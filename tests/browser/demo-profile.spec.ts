import { test, expect } from "./fixtures";

for (const route of ["/user/profile", "/admin/dashboard/profile"]) {
  test(`demo profile uses the account form and persists locally: ${route}`, async ({ page }) => {
    let profileWrites = 0;
    await page.route("**/api/users/me", (request) => { profileWrites++; return request.abort(); });
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Profil akun", exact: true })).toBeVisible();
    await expect(page.getByText("Pratinjau demo. Nama dan foto profil hanya tersimpan di browser ini.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Tema & Background Beranda" })).toHaveCount(0);
    await page.getByLabel("Nama lengkap", { exact: true }).fill("Profil Demo Bersama");
    await page.getByLabel("Foto profil", { exact: true }).setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aMegAAAAASUVORK5CYII=", "base64") });
    await page.getByRole("button", { name: "Simpan profil", exact: true }).click();
    await expect(page.getByText("Profil demo berhasil disimpan di browser ini.")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Profil Demo Bersama");
    await expect(page.getByAltText("Foto profil", { exact: true })).toHaveAttribute("src", /^data:image\//);
    expect(profileWrites).toBe(0);
    expect(await page.evaluate(() => localStorage.getItem("refreshToken"))).toBeNull();
  });
}
