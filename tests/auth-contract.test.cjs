const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const requests = [];
let server, baseURL, refreshes = 0;
const tokens = { accessToken: "verified-access", refreshToken: "refresh", tokenType: "Bearer", expiresIn: 900 };
const user = { id: "user", name: "Test User", email: "user@example.com", roleId: 4 };
before(async () => {
  server = http.createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : null;
    requests.push({ url: req.url, body, authorization: req.headers.authorization });
    res.setHeader("Content-Type", "application/json");
    let data;
    if (req.url === "/api/auth/login") {
      res.writeHead(401); res.end(JSON.stringify({ message: "invalid email or password" })); return;
    }
    if (req.url === "/api/auth/verify-otp" || req.url.startsWith("/api/auth/google/callback?")) data = { user, tokens };
    if (req.url === "/api/auth/refresh") {
      refreshes++;
      await new Promise((resolve) => setTimeout(resolve, 20));
      data = { ...tokens, accessToken: "fresh-access" };
    }
    if (req.url === "/api/auth/me") {
      if (req.headers.authorization !== "Bearer fresh-access") {
        res.writeHead(401); res.end(JSON.stringify({ message: "expired" })); return;
      }
      data = user;
    }
    if (req.url.startsWith("/api/users/")) data = { email: "invited@example.com", role: "ORGANIZER" };
    res.end(JSON.stringify({ message: "ok", status: "T", data }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseURL = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => new Promise((resolve) => server.close(resolve)));

function storage() {
  const data = new Map();
  return { getItem: (key) => data.get(key) || null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) };
}
function loadServices(localStorage = storage(), sessionStorage = storage()) {
  const cache = new Map();
  const context = vm.createContext({ fetch, Headers, Request, Response, URL, AbortSignal, TextEncoder, console, localStorage, sessionStorage, window: {}, process: { env: { NEXT_PUBLIC_API_URL: baseURL, BACKEND_URL: baseURL } } });
  function load(filename) {
    filename = path.resolve(__dirname, "..", filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const module = { exports: {} };
    cache.set(filename, module);
    const execute = vm.runInContext(`(function(require,module,exports){${compiled}\n})`, context);
    execute((name) => load(name.startsWith("@/") ? `${name.slice(2)}.ts` : path.resolve(path.dirname(filename), `${name}.ts`)), module, module.exports);
    return module.exports;
  }
  return { auth: load("services/auth.service.ts").authService, users: load("services/user.service.ts").userService, client: load("services/api-client.ts"), proxy: load("app/api/[...path]/route.ts"), connection: load("app/api/connection/route.ts"), localStorage, sessionStorage };
}

test("register waits for OTP; verification sends otp and stores tokens across reload", async () => {
  const services = loadServices();
  await services.auth.register({ name: user.name, email: user.email, password: "Password123!" });
  assert.equal(services.client.getAccessToken(), null);
  await services.auth.verifyEmail(user.email, "123456");
  assert.deepEqual(requests.at(-1).body, { email: user.email, otp: "123456" });
  assert.equal(requests.at(-1).url, "/api/auth/verify-otp");
  assert.equal(services.localStorage.getItem("refreshToken"), "refresh");
  const reloaded = loadServices(services.localStorage, services.sessionStorage);
  assert.equal(reloaded.client.getAccessToken(), "verified-access");
});
test("public credential failures never refresh or replace the login error", async () => {
  const services = loadServices();
  services.localStorage.setItem("refreshToken", "refresh");
  const before = refreshes;
  await assert.rejects(services.auth.login({ email: user.email, password: "wrong" }), /invalid email or password/);
  assert.equal(refreshes, before);
});
test("concurrent protected requests refresh once and retry with the rotated token", async () => {
  const services = loadServices();
  services.client.saveTokens(tokens);
  const before = refreshes;
  const profiles = await Promise.all([services.auth.getMe(), services.auth.getMe()]);
  assert.equal(refreshes - before, 1);
  assert.equal(profiles[0].email, user.email);
  assert.equal(services.client.getAccessToken(), "fresh-access");
});
test("resend, password recovery, invitations and logout match backend contracts", async () => {
  const services = loadServices();
  const registration = { name: user.name, email: user.email, password: "Password123!" };
  await services.auth.register(registration);
  await services.auth.resendVerification(user.email);
  assert.equal(requests.at(-1).url, "/api/auth/register");
  assert.deepEqual(requests.at(-1).body, registration);
  await services.auth.forgotPassword(user.email);
  assert.equal(requests.at(-1).url, "/api/auth/forgot-password");
  await services.auth.resetPassword(user.email, "123456", "NewPassword123!");
  assert.deepEqual(requests.at(-1).body, { email: user.email, otp: "123456", newPassword: "NewPassword123!" });
  services.client.saveTokens(tokens);
  await services.auth.changePassword("old", "new", "new");
  assert.deepEqual(requests.at(-1).body, { currentPassword: "old", newPassword: "new", confirmNewPassword: "new" });
  await services.users.invite("invited@example.com", "ORGANIZER");
  assert.equal(requests.at(-1).authorization, "Bearer verified-access");
  await services.users.validateInvite("a+b");
  assert.equal(requests.at(-1).url, "/api/users/validate-invite?token=a%2Bb");
  assert.equal(requests.at(-1).authorization, undefined);
  await services.users.acceptInvite({ token: "invite", name: "Invited", password: "Password123!", confirmPassword: "Password123!" });
  assert.equal(requests.at(-1).url, "/api/users/accept-invite");
  await services.auth.logout();
  assert.equal(services.client.getAccessToken(), null);
  assert.equal(services.localStorage.getItem("refreshToken"), null);
});

test("resending after reload gives instructions without calling an unsupported endpoint", async () => {
  const services = loadServices();
  const before = requests.length;
  await assert.rejects(services.auth.resendVerification(user.email), /kembali ke pendaftaran/);
  assert.equal(requests.length, before);
});

test("frontend proxy forwards POST bodies and bearer tokens while preserving backend errors", async () => {
  const services = loadServices();
  const body = { email: user.email, password: "wrong" };
  const response = await services.proxy.POST(new Request("http://frontend.test/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer existing" }, body: JSON.stringify(body),
  }), { params: Promise.resolve({ path: ["auth", "login"] }) });
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { message: "invalid email or password" });
  assert.deepEqual(requests.at(-1).body, body);
  assert.equal(requests.at(-1).authorization, "Bearer existing");
  assert.equal((await services.connection.GET()).status, 200);
  assert.equal(requests.at(-1).url, "/api/roles");
});

test("Google callback consumes the original backend JSON response", async () => {
  const services = loadServices();
  await services.auth.completeGoogleLogin("code=test-code&state=test-state");
  assert.equal(requests.at(-1).url, "/api/auth/google/callback?code=test-code&state=test-state");
  assert.equal(services.client.getAccessToken(), "verified-access");
});
