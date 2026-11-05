import { test, expect } from "./fixtures";

test("the interface stays Indonesian with default styling despite saved preferences", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    localStorage.setItem("concertgo-theme", "dark");
    localStorage.setItem(
      "concertgo-language",
      JSON.stringify({ state: { language: "en" }, version: 0 }),
    );
  });
  await page.goto("/user/settings?tab=theme");
  await expect(
    page.getByRole("heading", { name: "Informasi Profil & Data Akun" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tema Tampilan", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ganti Bahasa", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--theme-bg")
        .trim(),
    ),
  ).toBe("#f6efe1");
  await page.goto("/user/settings?tab=language");
  await expect(
    page.getByRole("heading", { name: "Informasi Profil & Data Akun" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Informasi Profil & Data Akun" }),
  ).toBeVisible();
});
