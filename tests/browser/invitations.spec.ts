import { test, expect } from "./fixtures";

test("invitations restrict roles, reject duplicates, rotate links and activate only once", async ({
  page,
}) => {
  await page.goto("/admin/dashboard/invitations");
  await page.getByLabel("Simulasikan pengundang").selectOption("ADMIN");
  await expect(page.getByLabel("Role tujuan").locator("option")).toHaveCount(1);
  const email = "team.demo@example.com";
  await page.getByLabel("Email penerima").fill(email);
  await page
    .getByRole("button", { name: "Buat undangan", exact: true })
    .click();
  const row = page.getByRole("row").filter({ hasText: email });
  await expect(row).toBeVisible();
  const oldLink = await row
    .getByRole("link", { name: "Buka tautan" })
    .getAttribute("href");
  await page.getByLabel("Email penerima").fill(email);
  await page
    .getByRole("button", { name: "Buat undangan", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Masih ada undangan aktif" }),
  ).toBeVisible();
  await row.getByRole("button", { name: "Kirim ulang" }).click();
  await expect(
    row.getByRole("link", { name: "Buka tautan" }),
  ).not.toHaveAttribute("href", oldLink!);
  const newLink = await row
    .getByRole("link", { name: "Buka tautan" })
    .getAttribute("href");
  expect(newLink).not.toEqual(oldLink);
  await page.goto(oldLink!);
  await expect(
    page.getByRole("alert").filter({ hasText: "Undangan sudah" }),
  ).toBeVisible();
  await page.goto(newLink!);
  await page.getByLabel("Nama lengkap").fill("Nadia Organizer");
  await page
    .getByLabel("Kata sandi demo", { exact: true })
    .fill("DemoPassword123!");
  await page.getByLabel("Konfirmasi kata sandi").fill("DemoPassword123!");
  await page.getByRole("button", { name: "Aktifkan akun demo" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Akun demo berhasil diaktifkan",
  );
  await page.getByRole("link", { name: "Lihat akun demo" }).click();
  await expect(page.getByRole("row").filter({ hasText: email })).toContainText(
    "Nadia Organizer",
  );
  await page.goto(newLink!);
  await expect(
    page.getByRole("alert").filter({ hasText: "Undangan sudah" }),
  ).toBeVisible();
});
