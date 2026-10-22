import { test, expect } from "./fixtures";

test("notifications and other device sessions can be managed without revoking this device", async ({
  page,
}) => {
  await page.goto("/user/notifications");
  await page.getByRole("button", { name: "Tandai semua dibaca" }).click();
  await expect(
    page.getByRole("button", { name: "Tandai semua dibaca" }),
  ).toBeDisabled();
  await page.goto("/user/security");
  await page
    .getByRole("button", { name: "Keluar dari perangkat lain" })
    .click();
  await page.getByRole("button", { name: "Ya, akhiri sesi" }).click();
  await expect(page.getByText("Sesi diakhiri", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Perangkat ini", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Sesi diakhiri", { exact: true })).toHaveCount(2);
});
