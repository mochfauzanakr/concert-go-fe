import { test, expect } from "@playwright/test";

// Deliberately does not use demo fixtures: these tests verify real-session UI rules.
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/(images|plus)\.unsplash\.com\//, (route) => route.abort());
});

async function signedIn(page: import("@playwright/test").Page, roleId: number) {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("fixtureSessionInitialized")) {
      sessionStorage.setItem("accessToken", "test-access");
      localStorage.setItem("refreshToken", "test-refresh");
      sessionStorage.setItem("fixtureSessionInitialized", "true");
    }
  });
  await page.context().route("**/api/auth/me", (route) => route.fulfill({ json: {
    status: "T", data: { id: "account-one", name: "Akun Integrasi", email: "account@example.com", roleId, createdAt: "2026-01-01T00:00:00Z" },
  } }));
}

test("guest direct access redirects to sign-in with the original destination", async ({ page }) => {
  await page.goto("/admin/dashboard/users?search=nama");
  await expect(page).toHaveURL(/\/sign-in\?returnTo=/);
  expect(new URL(page.url()).searchParams.get("returnTo")).toBe("/admin/dashboard/users?search=nama");
});

for (const roleId of [3, 4, 5]) {
  test(`role ${roleId} cannot open the admin workspace`, async ({ page }) => {
    await signedIn(page, roleId);
    await page.goto("/admin/dashboard");
    await expect(page.getByRole("heading", { name: "Akses tidak diizinkan" })).toBeVisible();
  });
}

test("organizer has a separate destination without access to the admin panel", async ({ page }) => {
  await signedIn(page, 3);
  await page.goto("/organizer");
  await expect(page.getByRole("heading", { name: "Akun organizer" })).toBeVisible();
});

test("temporary backend failure can be retried without deleting credentials", async ({ page }) => {
  await signedIn(page, 4);
  let unavailable = true;
  await page.route("**/api/auth/me", (route) => route.fulfill(unavailable ? {
    status: 503, json: { message: "Backend tidak tersedia sementara" },
  } : { json: { status: "T", data: { id: "account-one", name: "Akun Integrasi", email: "account@example.com", roleId: 4 } } }));
  await page.goto("/user/profile");
  await expect(page.getByRole("heading", { name: "Sesi belum dapat diperiksa" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("refreshToken"))).toBe("test-refresh");
  unavailable = false;
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sesi belum dapat diperiksa" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/user\/profile$/);
});

test("invalid refresh clears persisted identities and returns to sign-in", async ({ page }) => {
  await signedIn(page, 4);
  await page.route("**/api/auth/me", (route) => route.fulfill({ status: 401, json: { message: "Expired" } }));
  await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 401, json: { message: "Revoked" } }));
  await page.goto("/user/profile");
  await expect(page).toHaveURL(/\/sign-in\?returnTo=/);
  expect(await page.evaluate(() => localStorage.getItem("refreshToken"))).toBeNull();
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem("concertgo_user_profile") || "{}").state);
  expect(profile?.ownerId).toBeNull();
});

test("demo preview requires an explicit entry and can be exited", async ({ page }) => {
  await page.goto("/admin/dashboard?preview=demo");
  await expect(page.getByRole("button", { name: "Keluar dari demo" })).toBeVisible();
  await page.getByRole("button", { name: "Keluar dari demo" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem("concertgo_demo_preview"))).toBeNull();
});

test("logout in another tab removes access and local identity in this tab", async ({ page, context }) => {
  await signedIn(page, 4);
  await page.goto("/user/profile");
  await expect(page.getByRole("heading", { name: "Profil akun" })).toBeVisible();
  const other = await context.newPage();
  await other.goto("/account-access");
  await other.evaluate(() => localStorage.removeItem("refreshToken"));
  await expect(page).toHaveURL(/\/sign-in\?returnTo=/);
  expect(await page.evaluate(() => sessionStorage.getItem("accessToken"))).toBeNull();
});
