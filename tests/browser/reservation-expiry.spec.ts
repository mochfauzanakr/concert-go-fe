import { test, expect } from "./fixtures";

test("expired reservations cannot be paid", async ({ page }) => {
  await page.clock.install();
  await page.goto("/user/orders/CG-DEMO-1002");
  await expect(
    page.getByRole("button", { name: "Simulasikan pembayaran berhasil" }),
  ).toBeVisible();
  await page.clock.fastForward(31 * 60 * 1000);
  await expect(
    page.getByRole("heading", { name: "Waktu pembayaran sudah habis" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Simulasikan pembayaran berhasil" }),
  ).toHaveCount(0);
});
