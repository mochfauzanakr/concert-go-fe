const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

// Local-only opt-in: creates test accounts, temporarily grants the test actor SUPER_ADMIN,
// exercises the real UI/API, then demotes that actor and revokes test refresh tokens.
test("stage 2 real UI and backend: profile persistence, admin mutations and email invitations", {
  skip: process.env.RUN_STAGE2_INTEGRATION !== "1", timeout: 180000,
}, async () => {
  const origin = process.env.INTEGRATION_BASE_URL || "http://localhost:3100";
  const mailpit = process.env.MAILPIT_URL || "http://localhost:8025";
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Provisioning is restricted to local integration environments");
  process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".next/playwright-browsers");
  const { chromium, expect } = require("@playwright/test");
  const browser = await chromium.launch();
  const suffix = randomUUID();
  const rootEmail = `stage2-root-${suffix}@example.com`;
  const buyerEmail = `stage2-buyer-${suffix}@example.com`;
  const orgEmail = `stage2-org-${suffix}@example.com`;
  const staffEmail = `stage2-staff-${suffix}@example.com`;
  const adminEmail = `stage2-admin-${suffix}@example.com`;
  const password = `Cg!9${randomUUID()}Aa`;
  const tokens = [];
  let promoted = false;

  async function api(endpoint, { method = "GET", body, token, status = 200 } = {}) {
    const response = await fetch(`${origin}/api${endpoint}`, {
      method, headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    assert.equal(response.status, status, `${method} ${endpoint}: ${result.message}`);
    return result;
  }
  async function mail(email) {
    for (let attempt = 0; attempt < 20; attempt++) {
      const inbox = await (await fetch(`${mailpit}/api/v1/messages?limit=100`)).json();
      const item = inbox.messages.find((message) => message.To.some((recipient) => recipient.Address === email));
      if (item) {
        const message = await (await fetch(`${mailpit}/api/v1/message/${item.ID}`)).json();
        return `${message.Text || ""} ${message.HTML || ""}`;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Email pengujian belum diterima di Mailpit");
  }
  async function register(email) {
    await api("/auth/register", { method: "POST", body: { name: "Stage Two Test", email, password } });
    const otp = (await mail(email)).match(/\b\d{6}\b/)?.[0];
    assert.ok(otp);
    const session = (await api("/auth/verify-otp", { method: "POST", body: { email, otp } })).data;
    tokens.push(session.tokens.refreshToken);
    return session;
  }
  async function login(email) {
    const session = (await api("/auth/login", { method: "POST", body: { email, password } })).data;
    tokens.push(session.tokens.refreshToken);
    return session;
  }
  function provisionRoot(roleId) {
    const condition = roleId === 4 ? `email IN ('${rootEmail}', '${adminEmail}')` : `email='${rootEmail}'`;
    execFileSync("docker", ["exec", process.env.INTEGRATION_POSTGRES_CONTAINER || "concert-go-postgres-dev", "sh", "-c", 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "$1"', "stage2", `UPDATE users SET role_id=${roleId} WHERE ${condition};`], { stdio: "pipe" });
  }
  async function accountPage(session, route) {
    const context = await browser.newContext();
    await context.addInitScript((credentials) => {
      sessionStorage.setItem("accessToken", credentials.accessToken);
      localStorage.setItem("refreshToken", credentials.refreshToken);
    }, session.tokens);
    await context.route(/https:\/\/(images|plus)\.unsplash\.com\//, (route) => route.abort());
    const page = await context.newPage();
    await page.goto(`${origin}${route}`);
    return { context, page };
  }
  async function accept(email, role) {
    const token = (await mail(email)).match(/accept-invite\?token=([a-zA-Z0-9-]+)/)?.[1];
    assert.ok(token, "Invitation email must contain an absolute frontend activation link");
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${origin}/accept-invite?token=${token}`);
    await page.getByLabel("Nama lengkap", { exact: true }).fill(`Stage Two ${role}`);
    await page.getByLabel("Kata sandi", { exact: true }).fill(password);
    await page.getByLabel("Konfirmasi kata sandi", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Aktifkan akun", exact: true }).click();
    await expect(page.getByText("Akun berhasil diaktifkan. Silakan masuk.")).toBeVisible();
    await api(`/users/validate-invite?token=${token}`, { status: 400 });
    await context.close();
    return login(email);
  }

  try {
    await register(rootEmail);
    let buyerSession = await register(buyerEmail);
    provisionRoot(1); promoted = true;
    const root = await login(rootEmail);
    assert.equal(root.user.roleId, 1);

    const buyerUI = await accountPage(buyerSession, "/user/profile");
    await buyerUI.page.getByLabel("Nama lengkap", { exact: true }).fill("Profil Server Tahap Dua");
    await buyerUI.page.getByLabel("Foto profil", { exact: true }).setInputFiles({ name: "stage2.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMegAAAAASUVORK5CYII=", "base64") });
    await buyerUI.page.getByRole("button", { name: "Simpan profil", exact: true }).click();
    await expect(buyerUI.page.getByText("Profil berhasil disimpan ke server dan diverifikasi ulang.")).toBeVisible();
    await buyerUI.context.close();
    await api("/auth/logout", { method: "POST", body: { refreshToken: buyerSession.tokens.refreshToken } });
    buyerSession = await login(buyerEmail);
    const freshUI = await accountPage(buyerSession, "/user/profile");
    await expect(freshUI.page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Profil Server Tahap Dua");
    assert.ok(buyerSession.user.avatarUrl);
    await expect(freshUI.page.getByAltText("Foto profil", { exact: true })).toHaveAttribute("src", buyerSession.user.avatarUrl);
    await freshUI.context.close();

    const adminUI = await accountPage(root, "/admin/dashboard/users");
    await adminUI.page.getByLabel("Cari pengguna", { exact: true }).fill(buyerEmail);
    const row = adminUI.page.getByRole("row").filter({ hasText: buyerEmail });
    await row.getByRole("button", { name: "Lihat detail" }).click();
    const dialog = adminUI.page.getByRole("dialog");
    await dialog.getByLabel("Nama lengkap", { exact: true }).fill("Nama Diubah Administrator");
    await dialog.getByLabel("Role akun", { exact: true }).selectOption("5");
    await dialog.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
    await expect(dialog.getByLabel("Role akun", { exact: true })).toHaveValue("5");
    await dialog.getByRole("button", { name: "Suspend akun", exact: true }).click();
    await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
    await expect(dialog.getByRole("button", { name: "Aktifkan akun", exact: true })).toBeVisible();
    await api("/auth/login", { method: "POST", body: { email: buyerEmail, password }, status: 403 });
    await dialog.getByRole("button", { name: "Aktifkan akun", exact: true }).click();
    await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
    await expect(dialog.getByRole("button", { name: "Suspend akun", exact: true })).toBeVisible();
    const changed = await login(buyerEmail);
    assert.equal(changed.user.roleId, 5);
    assert.equal(changed.user.name, "Nama Diubah Administrator");

    await adminUI.page.keyboard.press("Escape");
    await adminUI.page.goto(`${origin}/admin/dashboard/invitations`);
    await adminUI.page.getByLabel("Email penerima").fill(orgEmail);
    await adminUI.page.getByLabel("Role penerima").selectOption("ORGANIZER");
    await adminUI.page.getByRole("button", { name: "Kirim undangan", exact: true }).click();
    await expect(adminUI.page.getByText("Undangan berhasil dikirim melalui email.")).toBeVisible();
    await api("/users/invite", { method: "POST", token: root.tokens.accessToken, body: { email: orgEmail, role: "ORGANIZER" }, status: 409 });
    const organizer = await accept(orgEmail, "ORGANIZER");
    assert.equal(organizer.user.roleId, 3);
    const organizerUI = await accountPage(organizer, "/invite-user");
    await expect(organizerUI.page.getByLabel("Role penerima").locator("option")).toHaveText(["STAFF"]);
    await organizerUI.page.getByLabel("Email penerima").fill(staffEmail);
    await organizerUI.page.getByRole("button", { name: "Kirim undangan", exact: true }).click();
    await expect(organizerUI.page.getByText("Undangan berhasil dikirim melalui email.")).toBeVisible();
    const staff = await accept(staffEmail, "STAFF");
    assert.equal(staff.user.roleId, 5);
    await api("/users", { token: staff.tokens.accessToken, status: 403 });

    await api("/users/invite", { method: "POST", token: root.tokens.accessToken, body: { email: adminEmail, role: "ADMIN" }, status: 201 });
    const admin = await accept(adminEmail, "ADMIN");
    await api(`/users/${root.user.id}`, { method: "PUT", token: admin.tokens.accessToken, body: { name: "Forbidden Edit", roleId: 1 }, status: 403 });
    await api(`/users/${staff.user.id}`, { method: "PUT", token: admin.tokens.accessToken, body: { name: "Forbidden Assignment", roleId: 2 }, status: 403 });
    await api(`/users/${root.user.id}/status`, { method: "PATCH", token: root.tokens.accessToken, body: { status: "SUSPENDED" }, status: 400 });
    const result = await api(`/users?search=${encodeURIComponent(buyerEmail)}&pageSize=10&page=1`, { token: root.tokens.accessToken });
    assert.equal(result.data[0].name, "Nama Diubah Administrator");
    assert.equal(result.pagination.totalRecords, 1);
  } finally {
    await browser.close();
    if (promoted) provisionRoot(4);
    for (const refreshToken of tokens) {
      await fetch(`${origin}/api/auth/logout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken }), signal: AbortSignal.timeout(10000) }).catch(() => {});
    }
  }
});
