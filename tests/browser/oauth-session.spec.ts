import { test, expect } from "@playwright/test";

const user = { id: "oauth-user", name: "Pengguna Google", email: "google@example.com", roleId: 4, createdAt: "2026-01-01T00:00:00Z" };
const tokens = { accessToken: "new-access", refreshToken: "new-refresh", expiresIn: 900, tokenType: "Bearer" };

test("browser API callback opens a result page with the user's identity, not raw JSON", async ({ page }) => {
  await page.route("**/api/auth/google/callback?*", (route) => route.request().isNavigationRequest() ? route.continue() : route.fulfill({ json: { status: "T", data: { user, tokens } } }));
  await page.route("**/api/auth/me", (route) => route.fulfill({ json: { status: "T", data: user } }));
  await page.goto("/api/auth/google/callback?code=test-code&state=test-state");
  await expect(page).toHaveURL(/\/auth\/callback$/);
  await expect(page.getByRole("heading", { name: "Login Google berhasil" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Pengguna Google");
  expect(await page.evaluate(() => sessionStorage.getItem("accessToken"))).toBe("new-access");
  expect(await page.evaluate(() => localStorage.getItem("refreshToken"))).toBe("new-refresh");
  await expect(page.getByRole("link", { name: "Lanjutkan ke akun" })).toHaveAttribute("href", "/user/homepage");
});

test("Google cancellation and invalid callback show an actionable error", async ({ page }) => {
  await page.goto("/auth/callback?error=access_denied");
  await expect(page.getByRole("alert").filter({ hasText: "Login Google dibatalkan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kembali ke halaman masuk" })).toBeVisible();
  await page.goto("/auth/callback?code=without-state");
  await expect(page.getByRole("alert").filter({ hasText: "tidak menghasilkan sesi" })).toBeVisible();
});

test("expired access token refreshes before protected requests even if the backend returns 200", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("accessToken", "expired-access");
    sessionStorage.setItem("accessTokenExpiresAt", String(Date.now() - 1000));
    localStorage.setItem("refreshToken", "previous-refresh");
  });
  let refreshes = 0;
  await page.route("**/api/auth/refresh", (route) => { refreshes++; return route.fulfill({ json: { status: "T", data: tokens } }); });
  await page.route("**/api/auth/me", (route) => {
    expect(route.request().headers().authorization).toBe("Bearer new-access");
    return route.fulfill({ json: { status: "T", data: user } });
  });
  await page.goto("/user/profile");
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue(user.name);
  expect(refreshes).toBe(1);
});

test("visible tab proactively rotates the token before expiry", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    sessionStorage.setItem("accessToken", "near-expiry");
    sessionStorage.setItem("accessTokenExpiresAt", String(Date.now() + 61000));
    localStorage.setItem("refreshToken", "previous-refresh");
  });
  let refreshes = 0;
  await page.route("**/api/auth/refresh", (route) => { refreshes++; return route.fulfill({ json: { status: "T", data: tokens } }); });
  await page.route("**/api/auth/me", (route) => route.fulfill({ json: { status: "T", data: user } }));
  await page.goto("/user/profile");
  await expect(page.getByRole("heading", { name: "Profil akun" })).toBeVisible();
  await page.clock.fastForward(35000);
  await expect.poll(() => refreshes).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem("refreshToken"))).toBe("new-refresh");
});

test("two tabs rotate shared refresh tokens sequentially without logging one another out", async ({ context }) => {
  await context.addInitScript(() => {
    sessionStorage.setItem("accessToken", "expired");
    sessionStorage.setItem("accessTokenExpiresAt", String(Date.now() - 1000));
    if (!localStorage.getItem("refreshToken")) localStorage.setItem("refreshToken", "start-refresh");
  });
  let expectedToken = "start-refresh";
  let rejected = 0;
  let rotations = 0;
  await context.route("**/api/auth/refresh", async (route) => {
    if (route.request().postDataJSON().refreshToken !== expectedToken) {
      rejected++;
      await route.fulfill({ status: 401, json: { message: "Refresh token already used" } });
      return;
    }
    rotations++;
    expectedToken = `rotation-${rotations}`;
    const response = { ...tokens, accessToken: `access-${rotations}`, refreshToken: expectedToken };
    await new Promise((resolve) => setTimeout(resolve, 50));
    await route.fulfill({ json: { status: "T", data: response } });
  });
  await context.route("**/api/auth/me", (route) => route.fulfill({ json: { status: "T", data: user } }));
  const one = await context.newPage();
  const two = await context.newPage();
  await Promise.all([one.goto("/user/profile"), two.goto("/user/profile")]);
  await expect(one.getByRole("heading", { name: "Profil akun" })).toBeVisible();
  await expect(two.getByRole("heading", { name: "Profil akun" })).toBeVisible();
  expect(rejected).toBe(0);
  expect(rotations).toBeGreaterThanOrEqual(2);
  expect(rotations).toBeLessThanOrEqual(3);
});
