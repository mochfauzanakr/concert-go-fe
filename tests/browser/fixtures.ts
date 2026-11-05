import { test as base, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// An automatic fixture runs for every file and tab, including reused workers.
export const test = base.extend<{ demoSetup: void }>({
  demoSetup: [async ({ page, context }, use) => {
    await context.addInitScript(() => {
      if (window.location.protocol === "http:" || window.location.protocol === "https:") {
        sessionStorage.setItem("concertgo_demo_preview", "true");
      }
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    context.on("page", (tab) => tab.on("pageerror", (error) => errors.push(error.message)));
    // Keep these tests independent of external image/CDN availability.
    await context.route((url) => ["images.unsplash.com", "plus.unsplash.com"].includes(url.hostname), (route) =>
      route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: fs.readFileSync(path.join(process.cwd(), "public/image/event-placeholder.svg")),
      }),
    );
    await use();
    expect(errors).toEqual([]);
  }, { auto: true }],
});

export { expect };
