import { test, expect } from "./fixtures";

test("user management filters, confirms status changes, persists them and records the audit", async ({
  page,
}) => {
  await page.goto("/admin/dashboard/users");
  const row = page.getByRole("row").filter({ hasText: "raka@example.com" });
  await page.getByPlaceholder("Cari nama atau email...").fill("raka");
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Lihat detail" }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Alasan suspend")
    .fill("Pemeriksaan akun demo");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Suspend akun", exact: true })
    .click();
  await expect(row.getByText("Disuspend", { exact: true })).toBeVisible();
  await page.reload();
  await expect(row.getByText("Disuspend", { exact: true })).toBeVisible();
  await row.getByRole("button", { name: "Lihat detail" }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Alasan aktivasi kembali")
    .fill("Pemeriksaan sudah selesai");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Aktifkan kembali" })
    .click();
  await expect(row.getByText("Aktif", { exact: true })).toBeVisible();
  await page.goto("/admin/dashboard/activity");
  await expect(
    page.getByRole("heading", { name: "Akun disuspend", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Akun diaktifkan", exact: true }),
  ).toBeVisible();
});
