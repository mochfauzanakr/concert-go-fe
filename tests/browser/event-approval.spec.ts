import { test, expect } from "./fixtures";

test("event review validates a rejection reason and publishes approved submissions to the catalog", async ({
  page,
}) => {
  await page.goto("/admin/dashboard/events/approval");
  await page.getByRole("button", { name: "Tinjau detail" }).first().click();
  await page
    .getByRole("button", { name: "Tolak pengajuan", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "minimal 10 karakter",
  );
  await page
    .getByLabel("Catatan jika ditolak")
    .fill("Dokumen kelayakan venue belum lengkap.");
  await page
    .getByRole("button", { name: "Tolak pengajuan", exact: true })
    .click();
  const title = await page.locator("article h2").first().innerText();
  await page.getByRole("button", { name: "Tinjau detail" }).first().click();
  await page
    .getByRole("button", { name: "Setujui acara", exact: true })
    .click();
  await page.goto("/user/events");
  await page
    .getByRole("textbox", { name: "Cari acara", exact: true })
    .fill(title);
  await expect(
    page.getByRole("link", { name: title, exact: true }),
  ).toBeVisible();
});
