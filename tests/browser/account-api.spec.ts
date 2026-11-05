import { test, expect, type Page } from "@playwright/test";

const roles = [{ id: 1, name: "SUPER_ADMIN" }, { id: 2, name: "ADMIN" }, { id: 3, name: "ORGANIZER" }, { id: 4, name: "USER" }, { id: 5, name: "STAFF" }];
const actor = { id: "root-id", name: "Akun Server", email: "root@example.com", roleId: 1, createdAt: "2026-01-01T00:00:00Z", avatarUrl: null as string | null };
const buyer = { id: "buyer-id", name: "Pembeli Server", email: "buyer@example.com", roleId: 4, createdAt: "2026-01-01T00:00:00Z", status: "ACTIVE", provider: "email" };

async function session(page: Page, roleId = 1) {
  const user = { ...actor, roleId };
  await page.addInitScript(() => {
    sessionStorage.setItem("accessToken", "fixture-access");
    localStorage.setItem("refreshToken", "fixture-refresh");
  });
  await page.route("**/api/auth/me", (route) => route.fulfill({ json: { status: "T", data: user } }));
  await page.route("**/api/roles", (route) => route.fulfill({ json: { status: "T", data: roles } }));
  await page.route(/https:\/\/(images|plus)\.unsplash\.com\//, (route) => route.abort());
  return user;
}

test("profile migrates old overrides, saves multipart and shows server identity after reload", async ({ page }) => {
  const user = await session(page, 4);
  await page.addInitScript(() => localStorage.setItem("concertgo_user_profile", JSON.stringify({ state: {
    profile: { name: "Nama Lokal Lama" }, ownerId: "root-id", overridesByUser: { "root-id": { name: "Override Lama", avatar: "data:image/png;base64,old", city: "Bandung" } },
  }, version: 0 })));
  let uploaded = false;
  await page.route("**/api/users/me", async (route) => {
    expect(route.request().method()).toBe("PUT");
    expect(route.request().headers()["content-type"]).toMatch(/^multipart\/form-data; boundary=/);
    expect(route.request().postData()).toContain('filename="avatar.png"');
    user.name = "Nama Baru Server";
    user.avatarUrl = "/uploads/avatars/test-avatar.png";
    uploaded = true;
    await route.fulfill({ json: { status: "T", data: { ...user, status: "ACTIVE", provider: "email" } } });
  });
  await page.route("**/uploads/avatars/test-avatar.png", (route) => route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMegAAAAASUVORK5CYII=", "base64") }));
  await page.goto("/user/profile");
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Akun Server");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Nama Baru Server");
  await page.getByLabel("Foto profil", { exact: true }).setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: Buffer.from("image") });
  await page.getByRole("button", { name: "Simpan profil", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Profil berhasil disimpan ke server" })).toBeVisible();
  expect(uploaded).toBe(true);
  await page.reload();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Nama Baru Server");
  await expect(page.getByAltText("Foto profil", { exact: true })).toHaveAttribute("src", "/uploads/avatars/test-avatar.png");
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("concertgo_user_profile") || "{}").state);
  expect(state.overridesByUser["root-id"].name).toBeUndefined();
  expect(state.overridesByUser["root-id"].city).toBe("Bandung");
});

test("profile rejects invalid files and does not claim success on server failure", async ({ page }) => {
  await session(page, 4);
  let writes = 0;
  await page.route("**/api/users/me", (route) => { writes++; return route.fulfill({ status: 500, json: { message: "Penyimpanan gagal", reqId: "profile-failed" } }); });
  await page.goto("/user/profile");
  await page.getByLabel("Foto profil", { exact: true }).setInputFiles({ name: "bad.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg/>") });
  await expect(page.getByRole("alert").filter({ hasText: "JPG, PNG, atau WebP" })).toBeVisible();
  await page.getByLabel("Foto profil", { exact: true }).setInputFiles({ name: "big.png", mimeType: "image/png", buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
  await expect(page.getByRole("alert").filter({ hasText: "maksimal 2 MB" })).toBeVisible();
  expect(writes).toBe(0);
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Nama Belum Tersimpan");
  await page.getByRole("button", { name: "Simpan profil", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Penyimpanan gagal (ID: profile-failed)" })).toBeVisible();
  await expect(page.getByText("Profil berhasil disimpan ke server", { exact: false })).toHaveCount(0);
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Nama Belum Tersimpan");
});

test("admin search and pagination use server queries; empty results can be reset", async ({ page }) => {
  await session(page);
  const queries: URLSearchParams[] = [];
  await page.route("**/api/users?*", (route) => {
    const params = new URL(route.request().url()).searchParams;
    queries.push(params);
    const empty = params.get("search") === "tidak-ada";
    return route.fulfill({ json: { status: "T", data: empty ? [] : [buyer], pagination: { currentPage: Number(params.get("page")), totalRecords: empty ? 0 : 21, totalPage: empty ? 0 : 3, nextPage: empty ? null : 2, prevPage: params.get("page") === "2" ? 1 : null } } });
  });
  await page.goto("/admin/dashboard/users");
  await expect(page.getByRole("cell", { name: "buyer@example.com" })).toBeVisible();
  await page.getByRole("button", { name: "Berikutnya", exact: true }).click();
  await expect(page.getByText("Halaman 2 dari 3 · 21 pengguna")).toBeVisible();
  await page.getByLabel("Filter role", { exact: true }).selectOption("3");
  await page.getByLabel("Filter status", { exact: true }).selectOption("SUSPENDED");
  await page.getByLabel("Cari pengguna", { exact: true }).fill("tidak-ada");
  await expect(page.getByRole("heading", { name: "Tidak ada pengguna ditemukan" })).toBeVisible();
  expect(queries.at(-1)?.get("page")).toBe("1");
  expect(queries.at(-1)?.get("roleId")).toBe("3");
  expect(queries.at(-1)?.get("status")).toBe("SUSPENDED");
  await page.getByRole("button", { name: "Reset filter" }).click();
  await expect(page.getByRole("cell", { name: "buyer@example.com" })).toBeVisible();
});

test("admin edits and status changes require confirmation and refetch the account", async ({ page }) => {
  await session(page);
  let user = { ...buyer };
  const writes: unknown[] = [];
  await page.route("**/api/users?*", (route) => route.fulfill({ json: { status: "T", data: [user], pagination: { currentPage: 1, totalPage: 1, totalRecords: 1 } } }));
  await page.route("**/api/users/buyer-id", (route) => {
    if (route.request().method() === "PUT") { const body = route.request().postDataJSON(); writes.push(body); user = { ...user, ...body }; }
    return route.fulfill({ json: { status: "T", data: user } });
  });
  await page.route("**/api/users/buyer-id/status", (route) => { const body = route.request().postDataJSON(); writes.push(body); user = { ...user, ...body }; return route.fulfill({ json: { status: "T", data: user } }); });
  await page.goto("/admin/dashboard/users");
  await page.getByRole("button", { name: "Lihat detail" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("buyer@example.com", { exact: true })).toBeVisible();
  await dialog.getByLabel("Nama lengkap", { exact: true }).fill("Nama Administrator Baru");
  await dialog.getByLabel("Role akun", { exact: true }).selectOption("3");
  await dialog.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  expect(writes).toHaveLength(0);
  await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
  await expect(dialog.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Nama Administrator Baru");
  await dialog.getByRole("button", { name: "Suspend akun", exact: true }).click();
  await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
  await expect(dialog.getByRole("button", { name: "Aktifkan akun", exact: true })).toBeVisible();
  expect(writes).toEqual([{ name: "Nama Administrator Baru", roleId: 3 }, { status: "SUSPENDED" }]);
});

test("a slow previous search cannot replace the latest server results", async ({ page }) => {
  await session(page);
  let slowStarted = false;
  let finishSlow: () => void = () => {};
  const slowFinished = new Promise<void>((resolve) => { finishSlow = resolve; });
  await page.route("**/api/users?*", async (route) => {
    const search = new URL(route.request().url()).searchParams.get("search");
    if (search === "lama") {
      slowStarted = true;
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    await route.fulfill({ json: { status: "T", data: [{ ...buyer, name: search === "baru" ? "Hasil Terbaru" : "Hasil Lama" }] } }).catch(() => {});
    if (search === "lama") finishSlow();
  });
  await page.goto("/admin/dashboard/users");
  await page.getByLabel("Cari pengguna", { exact: true }).fill("lama");
  await expect.poll(() => slowStarted).toBe(true);
  await page.getByLabel("Cari pengguna", { exact: true }).fill("baru");
  await expect(page.getByRole("cell", { name: "Hasil Terbaru", exact: true })).toBeVisible();
  await slowFinished;
  await expect(page.getByRole("cell", { name: "Hasil Terbaru", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Hasil Lama", exact: true })).toHaveCount(0);
});

test("ADMIN cannot edit peers and cannot assign privileged roles to a buyer", async ({ page }) => {
  await session(page, 2);
  const peer = { ...buyer, id: "peer-id", roleId: 2, name: "Admin Lain" };
  await page.route("**/api/users?*", (route) => route.fulfill({ json: { status: "T", data: [peer, buyer] } }));
  await page.route("**/api/users/peer-id", (route) => route.fulfill({ json: { status: "T", data: peer } }));
  await page.route("**/api/users/buyer-id", (route) => route.fulfill({ json: { status: "T", data: buyer } }));
  await page.goto("/admin/dashboard/users");
  await page.getByRole("row").filter({ hasText: "Admin Lain" }).getByRole("button", { name: "Lihat detail" }).click();
  await expect(page.getByRole("dialog").getByText("Anda tidak dapat mengedit akun dengan peran ini.")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Simpan perubahan", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.getByRole("row").filter({ hasText: "Pembeli Server" }).getByRole("button", { name: "Lihat detail" }).click();
  await expect(page.getByRole("dialog").getByLabel("Role akun", { exact: true }).locator("option")).toHaveText(["Pilih role", "ORGANIZER", "USER", "STAFF"]);
});

test("an admin mutation failure preserves form values and exposes retry", async ({ page }) => {
  await session(page);
  await page.route("**/api/users?*", (route) => route.fulfill({ json: { status: "T", data: [buyer] } }));
  await page.route("**/api/users/buyer-id", (route) => route.fulfill(route.request().method() === "PUT" ? { status: 403, json: { message: "Perubahan tidak diizinkan" } } : { json: { status: "T", data: buyer } }));
  await page.goto("/admin/dashboard/users");
  await page.getByRole("button", { name: "Lihat detail" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nama lengkap", { exact: true }).fill("Nama Percobaan");
  await dialog.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await dialog.getByRole("button", { name: "Ya, simpan perubahan" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Perubahan tidak diizinkan");
  await expect(dialog.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Nama Percobaan");
  await expect(dialog.getByRole("button", { name: "Simpan perubahan", exact: true })).toBeEnabled();
});

test("organizer invitations use session role and report duplicate and email failures", async ({ page }) => {
  await session(page, 3);
  let attempt = 0;
  await page.route("**/api/users/invite", (route) => {
    attempt++;
    const body = route.request().postDataJSON();
    expect(body.role).toBe("STAFF");
    if (attempt === 1) return route.fulfill({ status: 409, json: { message: "Active invitation already exists" } });
    if (attempt === 2) return route.fulfill({ status: 500, json: { message: "Failed to send invitation email" } });
    return route.fulfill({ status: 201, json: { status: "T", data: { id: "invite-id", email: body.email, role: "STAFF", status: "PENDING", expiresAt: "2026-12-01T00:00:00Z" } } });
  });
  await page.goto("/invite-user");
  await expect(page.getByLabel("Role penerima").locator("option")).toHaveText(["STAFF"]);
  await expect(page.getByLabel("Simulasikan pengundang")).toHaveCount(0);
  await page.getByLabel("Email penerima").fill("staff@example.com");
  await page.getByRole("button", { name: "Kirim undangan", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "already exists" })).toBeVisible();
  await page.getByRole("button", { name: "Kirim undangan", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "send invitation email" })).toBeVisible();
  await page.getByRole("button", { name: "Kirim undangan", exact: true }).click();
  await expect(page.getByText("Undangan berhasil dikirim melalui email.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Kirim ulang", exact: true })).toHaveCount(0);
});

test("invitation activation handles invalid tokens and successful one-time activation", async ({ page }) => {
  let accepted = false;
  await page.route("**/api/users/validate-invite?*", (route) => route.fulfill(accepted ? { status: 400, json: { message: "Invalid or expired invitation token" } } : { json: { status: "T", data: { email: "invited@example.com", role: "ORGANIZER" } } }));
  await page.route("**/api/users/accept-invite", (route) => { accepted = true; return route.fulfill({ status: 201, json: { status: "T", data: buyer } }); });
  await page.goto("/accept-invite?token=real-shaped-token");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Organizer Baru");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Password123!");
  await page.getByLabel("Konfirmasi kata sandi", { exact: true }).fill("Password123!");
  await page.getByRole("button", { name: "Aktifkan akun", exact: true }).click();
  await expect(page.getByText("Akun berhasil diaktifkan. Silakan masuk.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("alert").filter({ hasText: "Invalid or expired" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Aktifkan akun", exact: true })).toHaveCount(0);
  await page.goto("/accept-invite");
  await expect(page.getByRole("alert").filter({ hasText: "tidak memiliki token" })).toBeVisible();
});
