import { test, expect } from "./fixtures";

test("support conversations work across user and admin views and can be resolved", async ({
  page,
}) => {
  const subject = "Bantuan e-ticket demo saya";
  await page.goto("/user/help");
  await page
    .getByRole("button", { name: "Buat permintaan", exact: true })
    .click();
  await page.getByLabel("Judul permintaan").fill(subject);
  await page
    .getByLabel("Pesan", { exact: true })
    .fill("Tolong bantu saya menemukan QR untuk tiket demo ini.");
  await page.getByRole("button", { name: "Kirim permintaan demo" }).click();
  await expect(
    page.getByRole("heading", { name: subject }).last(),
  ).toBeVisible();
  await page.goto("/admin/dashboard/system/help");
  await page.getByRole("button").filter({ hasText: subject }).click();
  await page
    .getByLabel("Balasan untuk pengguna")
    .fill("Silakan buka menu E-ticket dan pilih Lihat QR e-ticket.");
  await page.getByRole("button", { name: "Kirim pesan demo" }).click();
  await page.getByRole("button", { name: "Selesaikan laporan" }).click();
  await page.goto("/user/help");
  await page.getByRole("button").filter({ hasText: subject }).click();
  await expect(
    page.getByText("Silakan buka menu E-ticket dan pilih Lihat QR e-ticket.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Buka kembali percakapan" }),
  ).toBeVisible();
  await page.goto("/user/notifications");
  await expect(
    page.getByRole("heading", { name: "Tim bantuan membalas pesanmu" }),
  ).toBeVisible();
});
