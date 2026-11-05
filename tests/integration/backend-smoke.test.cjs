const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");

// Explicit opt-in: creates one test buyer in the local backend and sends OTP to Mailpit.
test("real backend: registration, OTP, login, profile, role denial, refresh and logout", {
  skip: process.env.RUN_BACKEND_INTEGRATION !== "1", timeout: 60000,
}, async () => {
  const origin = process.env.INTEGRATION_BASE_URL || "http://localhost:3100";
  const mailpit = process.env.MAILPIT_URL || "http://localhost:8025";
  const email = `fe-stage1-${randomUUID()}@example.com`;
  const password = `Cg!9${randomUUID()}Aa`;
  async function api(path, { method = "GET", body, token, expected = 200 } = {}) {
    const response = await fetch(`${origin}/api${path}`, {
      method, headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    assert.equal(response.status, expected, `${method} ${path}: ${result.message}`);
    return result.data;
  }
  await api("/auth/register", { method: "POST", body: { name: "FE Stage One Test", email, password } });
  let otp;
  for (let attempt = 0; attempt < 15 && !otp; attempt++) {
    const inbox = await (await fetch(`${mailpit}/api/v1/messages`)).json();
    const message = inbox.messages.find((item) => item.To.some((recipient) => recipient.Address === email));
    if (message) {
      const content = await (await fetch(`${mailpit}/api/v1/message/${message.ID}`)).json();
      otp = `${content.Text || ""} ${content.HTML || ""}`.match(/\b\d{6}\b/)?.[0];
    }
    if (!otp) await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(otp, "Registration OTP must be delivered to local Mailpit");
  const verified = await api("/auth/verify-otp", { method: "POST", body: { email, otp } });
  assert.equal(verified.user.email, email);
  assert.equal(verified.user.roleId, 4);
  await api("/auth/logout", { method: "POST", body: { refreshToken: verified.tokens.refreshToken } });
  const login = await api("/auth/login", { method: "POST", body: { email, password } });
  const profile = await api("/auth/me", { token: login.tokens.accessToken });
  assert.equal(profile.id, verified.user.id);
  const avatar = new FormData();
  avatar.set("name", "FE Stage One Test");
  avatar.set("avatar", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMegAAAAASUVORK5CYII=", "base64")], { type: "image/png" }), "avatar.png");
  const upload = await fetch(`${origin}/api/users/me`, { method: "PUT", headers: { Authorization: `Bearer ${login.tokens.accessToken}` }, body: avatar });
  assert.equal(upload.status, 200, "Multipart avatar upload must pass through the FE proxy");
  const uploaded = (await upload.json()).data;
  assert.ok(uploaded.avatarUrl);
  const image = await fetch(new URL(uploaded.avatarUrl, origin));
  assert.equal(image.status, 200, "Uploaded image must be accessible through the correct asset origin");
  assert.match(image.headers.get("content-type"), /^image\//);
  await api("/users", { token: login.tokens.accessToken, expected: 403 });
  const refreshed = await api("/auth/refresh", { method: "POST", body: { refreshToken: login.tokens.refreshToken } });
  assert.ok(refreshed.accessToken);
  assert.notEqual(refreshed.refreshToken, login.tokens.refreshToken);
  await api("/auth/logout", { method: "POST", body: { refreshToken: refreshed.refreshToken } });
  await api("/auth/refresh", { method: "POST", body: { refreshToken: refreshed.refreshToken }, expected: 401 });
});
