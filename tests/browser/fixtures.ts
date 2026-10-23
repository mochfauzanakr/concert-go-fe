import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const browserErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  // Keep these tests independent of external image/CDN availability.
  await page.route((url) => ["images.unsplash.com", "plus.unsplash.com"].includes(url.hostname), (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: fs.readFileSync(
        path.join(process.cwd(), "public/image/event-placeholder.svg"),
      ),
    }),
  );
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});
export { test, expect };
