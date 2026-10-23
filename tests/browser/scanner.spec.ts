import { test, expect } from "./fixtures";

test("camera denial leaves manual gate validation usable", async ({ page }) => {
  await page.addInitScript(() => {
    if (navigator.mediaDevices)
      Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
        configurable: true,
        value: () =>
          Promise.reject(new DOMException("Denied", "NotAllowedError")),
      });
  });
  await page.goto("/staff/scanner");
  await page.getByRole("button", { name: "Buka kamera scanner" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /Kamera/ }),
  ).toContainText(/kode tiket/);
  await page
    .getByLabel("Kode tiket", { exact: true })
    .fill("CG-DEMO-TICKET-001");
  await page
    .getByRole("button", { name: "Periksa tiket", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Tiket valid", exact: true }),
  ).toBeVisible();
});
