import { test, expect } from "@playwright/test";

for (const width of [360, 390, 768, 1440]) {
  test(`design review remains readable without page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const screen of ["landing", "catalog", "detail", "system"]) {
      await page.goto(`/design/discovery?screen=${screen}`);
      await expect(page.locator("h1")).toHaveCount(1);
      const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(dimensions.page, `overflow in ${screen}`).toBeLessThanOrEqual(dimensions.viewport + 1);
      const top = await page.getByRole("searchbox", { name: "Cari acara atau musisi" }).evaluate((input) => input.getBoundingClientRect().top);
      expect(top).toBeLessThan(300);
    }
    expect(errors).toEqual([]);
  });
}

test("prototype search, sort and reset remain in the URL across reload", async ({ page }) => {
  await page.goto("/design/discovery");
  await page.getByRole("searchbox", { name: "Cari acara atau musisi" }).fill("jazz");
  await page.getByRole("button", { name: "Cari acara", exact: true }).click();
  await expect(page).toHaveURL(/screen=catalog.*q=jazz/);
  await expect(page.getByRole("heading", { name: "Hasil untuk “jazz”" })).toBeVisible();
  await page.getByLabel("Urutkan hasil").selectOption("price");
  await expect(page).toHaveURL(/sort=price/);
  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Cari acara atau musisi" })).toHaveValue("jazz");
  await expect(page.getByLabel("Urutkan hasil")).toHaveValue("price");
  await page.getByRole("link", { name: "Hapus filter jazz" }).click();
  await expect(page.getByRole("searchbox", { name: "Cari acara atau musisi" })).toHaveValue("");
});

test("mobile filters are keyboard-dismissable and apply city context", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design/discovery?screen=catalog");
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Sesuaikan pencarian" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Filter", exact: true }).click();
  await dialog.getByLabel("Filter kota").selectOption("Bandung");
  await dialog.getByRole("button", { name: "Terapkan filter" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/city=Bandung/);
  await expect(page.getByRole("heading", { name: "Acara di Bandung" })).toBeVisible();
});

test("detail selection changes the subtotal and does not create an API transaction", async ({ page }) => {
  let writes = 0;
  page.on("request", (request) => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) writes++; });
  await page.goto("/design/discovery?screen=detail&id=senja-live");
  await page.getByRole("radio", { name: /Premium/ }).check();
  await page.getByRole("button", { name: "Tambah tiket" }).click();
  await expect(page.getByLabel("Jumlah tiket dipilih")).toHaveText("2");
  await expect(page.getByText(/Rp\s*670\.000/)).toBeVisible();
  await page.getByRole("button", { name: "Tinjau pilihan" }).click();
  const dialog = page.getByRole("dialog", { name: "Pratinjau alur berikutnya" });
  await expect(dialog).toContainText("2 × Premium");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  expect(writes).toBe(0);
});

test("catalog empty and error states have a working recovery path", async ({ page }) => {
  await page.goto("/design/discovery?screen=catalog");
  await page.getByLabel("State rancangan").selectOption("error");
  await expect(page.getByRole("heading", { name: "Acara belum dapat dimuat" })).toBeVisible();
  await page.getByRole("link", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("link", { name: "Lihat After Hours Jazz Session" })).toBeVisible();
  await page.getByLabel("State rancangan").selectOption("empty");
  await expect(page.getByRole("heading", { name: "Belum ada acara yang cocok" })).toBeVisible();
  await page.getByRole("link", { name: "Reset pencarian" }).click();
  await page.getByLabel("State rancangan").selectOption("loading");
  await expect(page.getByRole("status", { name: "Memuat acara" })).toBeVisible();
});
