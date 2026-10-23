import { test, expect } from "./fixtures";

test("demo changes synchronize between tabs on the same browser", async ({
  page,
  context,
}) => {
  await page.goto("/admin/dashboard/users");
  await expect(
    page.getByRole("row").filter({ hasText: "raka@example.com" }),
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto("/admin/dashboard/invitations");
  await other.getByLabel("Email penerima").fill("cross.tab@example.com");
  await other
    .getByRole("button", { name: "Buat undangan", exact: true })
    .click();
  const row = other
    .getByRole("row")
    .filter({ hasText: "cross.tab@example.com" });
  await row.getByRole("link", { name: "Buka tautan" }).click();
  await other.getByLabel("Nama lengkap").fill("Cross Tab User");
  await other
    .getByLabel("Kata sandi demo", { exact: true })
    .fill("DemoPassword123!");
  await other.getByLabel("Konfirmasi kata sandi").fill("DemoPassword123!");
  await other.getByRole("button", { name: "Aktifkan akun demo" }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "cross.tab@example.com" }),
  ).toBeVisible();
  await other.close();
});
