import { test, expect } from "./fixtures";
import fs from "node:fs";

test("checkout, payment, admin transaction and QR check-in form a consistent journey", async ({
  page,
}) => {
  await page.goto("/user/events");
  await page.getByRole("link", { name: "Detail acara" }).first().click();
  await expect(page).toHaveURL(/\/user\/events\/[^/]+$/);
  const eventId = new URL(page.url()).pathname.split("/").pop()!;
  await page.locator('aside a[href^="/user/checkout"]').first().click();
  await page.getByLabel("Jumlah tiket").selectOption("2");
  await page.getByLabel("Nama lengkap").fill("Sari Wulandari");
  await page.getByLabel("Email", { exact: true }).fill("sari@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Buat pesanan demo" }).click();
  await expect(page).toHaveURL(/\/user\/orders\/CG-/);
  const orderId = new URL(page.url()).pathname.split("/").pop()!;
  await page
    .getByRole("button", { name: "Simulasikan pembayaran berhasil" })
    .click();
  await expect(
    page.getByRole("heading", { name: "E-ticket diterbitkan" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Buka QR", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("link", { name: "Buka QR", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/user\/tickets\/TKT-/);
  const ticketURL = new URL(page.url()).pathname;
  const code = await page.getByText(/^CG-TICKET-[A-F0-9]{8}$/).innerText();
  await expect(page.locator('svg[height="176"][width="176"]')).toHaveCount(1);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh QR", exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe(`${code}.svg`);
  expect(fs.readFileSync((await download.path())!, "utf8")).toContain(
    'xmlns="http://www.w3.org/2000/svg"',
  );
  await page.goto(`/admin/dashboard/finance/transactions/${orderId}`);
  await expect(
    page.getByText("Sari Wulandari", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Buka QR", exact: true }),
  ).toHaveCount(2);
  await page.goto("/staff/scanner");
  await page.getByLabel("Acara yang diperiksa").selectOption(eventId);
  await page.getByLabel("Kode tiket", { exact: true }).fill(code);
  await page
    .getByRole("button", { name: "Periksa tiket", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Tiket valid", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Kode tiket", { exact: true }).fill(code);
  await page
    .getByRole("button", { name: "Periksa tiket", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Tiket ditolak", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Tiket sudah pernah digunakan/)).toBeVisible();
  await page.goto(ticketURL);
  await expect(
    page.getByText("Sudah digunakan", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Sudah digunakan", { exact: true }),
  ).toBeVisible();
});
