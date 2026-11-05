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
    const multipart = req.headers["content-type"]?.startsWith("multipart/form-data");
    const body = raw ? multipart ? raw : JSON.parse(raw) : null;
    requests.push({ url: req.url, body, authorization: req.headers.authorization, contentType: req.headers["content-type"] });
    res.setHeader("Content-Type", "application/json");
    let data;
    if (req.url === "/api/forbidden") {
      res.writeHead(403); res.end(JSON.stringify({ message: "Role forbidden", reqId: "req-denied", data: { role: "USER" } })); return;
    }
    if (req.url === "/api/unauthorized") {
      res.writeHead(401); res.end(JSON.stringify({ message: "Session revoked" })); return;
    }
    if (req.url === "/api/auth/login") {
      res.writeHead(401); res.end(JSON.stringify({ message: "invalid email or password" })); return;
    }
    if (req.url === "/api/auth/verify-otp" || req.url.startsWith("/api/auth/google/callback?")) data = { user, tokens };
    if (req.url === "/api/auth/refresh") {
      refreshes++;
      if (body.refreshToken === "unavailable") {
        res.writeHead(503); res.end(JSON.stringify({ message: "Session service unavailable" })); return;
      }
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
    if (req.url.startsWith("/api/users?")) {
      res.end(JSON.stringify({ status: "T", data: [user], pagination: { currentPage: 2, totalRecords: 21, totalPage: 3, nextPage: 3, prevPage: 1 } })); return;
    }
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
  const events = new EventTarget();
  const context = vm.createContext({ fetch, Headers, Request, Response, URL, URLSearchParams, AbortSignal, FormData, Blob, Event, TextEncoder, console, localStorage, sessionStorage, window: events, process: { env: { NEXT_PUBLIC_API_URL: baseURL, BACKEND_URL: baseURL } } });
  function load(filename) {
    filename = path.resolve(__dirname, "..", filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const execute = vm.runInContext(`(function(require,module,exports){${compiled}\n})`, context);
    execute((name) => load(name.startsWith("@/") ? `${name.slice(2)}.ts` : path.resolve(path.dirname(filename), `${name}.ts`)), loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return { auth: load("services/auth.service.ts").authService, users: load("services/user.service.ts").userService, permissions: load("lib/user-permissions.ts"), client: load("services/api-client.ts"), proxy: load("app/api/[...path]/route.ts"), connection: load("app/api/connection/route.ts"), localStorage, sessionStorage, events };
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

test("multipart reaches the backend with its boundary through client and proxy", async () => {
  const services = loadServices();
  const form = new FormData();
  form.set("name", "Nama Baru");
  form.set("avatar", new Blob(["image-data"], { type: "image/png" }), "avatar.png");
  await services.client.apiClient("/users/me", { method: "PUT", body: form, authenticated: false });
  assert.match(requests.at(-1).contentType, /^multipart\/form-data; boundary=/);
  assert.match(requests.at(-1).body, /name="avatar"; filename="avatar.png"/);
  const response = await services.proxy.PUT(new Request("http://frontend.test/api/users/me", { method: "PUT", body: form }), { params: Promise.resolve({ path: ["users", "me"] }) });
  assert.equal(response.status, 200);
  assert.match(requests.at(-1).body, /Nama Baru/);
});

test("API errors retain HTTP status, reqId and details without clearing valid sessions", async () => {
  const services = loadServices();
  services.client.saveTokens(tokens);
  await assert.rejects(services.client.apiClient("/forbidden"), (error) => {
    assert.equal(error.status, 403);
    assert.equal(error.reqId, "req-denied");
    assert.equal(error.details.role, "USER");
    return true;
  });
  assert.equal(services.localStorage.getItem("refreshToken"), "refresh");
});

test("a final protected 401 clears tokens and emits session invalidation", async () => {
  const services = loadServices();
  services.client.saveTokens(tokens);
  let invalidated = 0;
  services.events.addEventListener(services.client.SESSION_CLEARED_EVENT, () => invalidated++);
  await assert.rejects(services.client.apiClient("/unauthorized"), (error) => error.status === 401);
  assert.equal(services.client.getAccessToken(), null);
  assert.equal(services.localStorage.getItem("refreshToken"), null);
  assert.equal(invalidated, 1);
});

test("registration credentials are not persisted and cannot be resent after reload", async () => {
  const services = loadServices();
  services.sessionStorage.setItem("concertgo_pending_registration", "legacy-secret");
  await services.auth.register({ name: user.name, email: user.email, password: "Password123!" });
  assert.equal(services.sessionStorage.getItem("concertgo_pending_registration"), null);
  const reloaded = loadServices(services.localStorage, services.sessionStorage);
  await assert.rejects(reloaded.auth.resendVerification(user.email), /kembali ke pendaftaran/);
});

test("refresh service failure preserves credentials and reports its actual status", async () => {
  const services = loadServices();
  services.client.saveTokens({ ...tokens, refreshToken: "unavailable" });
  await assert.rejects(services.auth.getMe(), (error) => error.status === 503);
  assert.equal(services.localStorage.getItem("refreshToken"), "unavailable");
  assert.equal(services.client.getAccessToken(), tokens.accessToken);
});

test("an in-flight refresh cannot restore a logged-out session", async () => {
  const services = loadServices();
  services.client.saveTokens({ ...tokens, refreshToken: "delay-refresh" });
  const request = services.auth.getMe();
  const rejected = assert.rejects(request, (error) => error.status === 401);
  while (!requests.some((item) => item.url === "/api/auth/refresh" && item.body.refreshToken === "delay-refresh")) {
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  services.client.clearSession();
  await rejected;
  assert.equal(services.client.getAccessToken(), null);
  assert.equal(services.localStorage.getItem("refreshToken"), null);
});

test("user management preserves top-level pagination and sends the backend mutation payloads", async () => {
  const services = loadServices();
  services.client.saveTokens(tokens);
  const list = await services.users.list({ page: 2, pageSize: 10, search: "nama & email", roleId: 3, status: "ACTIVE" });
  const query = new URL(requests.at(-1).url, "http://fixture").searchParams;
  assert.equal(query.get("search"), "nama & email");
  assert.equal(query.get("roleId"), "3");
  assert.equal(list.data[0].id, "user");
  assert.equal(list.pagination.totalRecords, 21);
  await services.users.update("account-id", { name: "Nama Baru", roleId: 5 });
  assert.deepEqual(requests.at(-1).body, { name: "Nama Baru", roleId: 5 });
  await services.users.setStatus("account-id", "SUSPENDED");
  assert.deepEqual(requests.at(-1).body, { status: "SUSPENDED" });
  await services.users.updateProfile("Nama Profil");
  assert.deepEqual(requests.at(-1).body, { name: "Nama Profil" });
});

test("actor-target permissions follow backend hierarchy, self restrictions and invitation roles", () => {
  const { permissions: policy } = loadServices();
  const admin = { id: "admin", roleId: 2 };
  const root = { id: "root", roleId: 1 };
  const buyer = { id: "buyer", roleId: 4 };
  assert.equal(policy.canEditUser(admin, root), false);
  assert.equal(policy.canEditUser(admin, { id: "other-admin", roleId: 2 }), false);
  assert.equal(policy.canChangeUserStatus(root, root), false);
  assert.equal(policy.canChangeUserStatus(admin, buyer), true);
  const roles = [{ id: 1, name: "SUPER_ADMIN" }, { id: 2, name: "ADMIN" }, { id: 3, name: "ORGANIZER" }, { id: 4, name: "USER" }, { id: 5, name: "STAFF" }];
  assert.deepEqual(Array.from(policy.assignableRoles(admin, buyer, roles), (role) => role.id), [3, 4, 5]);
  assert.deepEqual(Array.from(policy.assignableRoles(root, root, roles), (role) => role.id), [1]);
  assert.deepEqual(Array.from(policy.inviteRoles(1)), ["ADMIN", "ORGANIZER"]);
  assert.deepEqual(Array.from(policy.inviteRoles(2)), ["ORGANIZER"]);
  assert.deepEqual(Array.from(policy.inviteRoles(3)), ["STAFF"]);
  assert.equal(policy.inviteRoles(4).length, 0);
});
