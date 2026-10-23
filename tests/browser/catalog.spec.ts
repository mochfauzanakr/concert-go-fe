import { test, expect } from "./fixtures";

test("catalog filters expose an empty state and can be reset without reloading", async ({
  page,
}) => {
  await page.goto("/user/events");
  const cards = page.locator("article");
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  await page
    .getByPlaceholder("Cari acara, musisi, atau genre...")
    .fill("no-such-concert-xyz");
  await expect(cards).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Belum menemukan acara yang cocok" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hapus filter" }).click();
  await expect(cards).toHaveCount(count);
  await expect(page.getByRole("button", { name: "Hapus filter" })).toHaveCount(
    0,
  );
  await page.getByLabel("Pilih kota").selectOption({ index: 1 });
  const city = await page.getByLabel("Pilih kota").inputValue();
  await expect(cards.first()).toBeVisible();
  for (const card of await cards.all()) await expect(card).toContainText(city);
  await page.getByRole("button", { name: "Hapus filter" }).click();
  await expect(cards).toHaveCount(count);
});
