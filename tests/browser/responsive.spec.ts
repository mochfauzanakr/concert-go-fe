import { test, expect } from "./fixtures";

for (const width of [1440, 390, 360]) {
  test(`all demo pages fit the viewport and stay usable at ${width}px`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: width < 600 ? 844 : 960 });
    const routes = [
      "/admin/dashboard",
      "/admin/dashboard/users",
      "/admin/dashboard/invitations",
      "/admin/dashboard/events/approval",
      "/admin/dashboard/concerts",
      "/admin/dashboard/finance/transactions",
      "/admin/dashboard/finance/transactions/CG-DEMO-1001",
      "/admin/dashboard/activity",
      "/admin/dashboard/system/help",
      "/user/events",
      "/user/orders",
      "/user/orders/CG-DEMO-1001",
      "/user/tickets",
      "/user/tickets/TKT-DEMO-1",
      "/user/notifications",
      "/user/security",
      "/user/help",
      "/staff/scanner",
    ];
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText("Mode demo interaktif.", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("status", { name: "Memuat halaman" }),
      ).toHaveCount(0);
      const dimensions = await page.evaluate(() => ({
        width: window.innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.scroll,
        `horizontal overflow at ${route}`,
      ).toBeLessThanOrEqual(dimensions.width + 1);
      if (
        [
          "/admin/dashboard/users",
          "/user/events",
          "/user/tickets/TKT-DEMO-1",
          "/staff/scanner",
        ].includes(route)
      )
        await page.screenshot({
          path: testInfo.outputPath(
            `${width}-${route.split("/").filter(Boolean).join("-")}.png`,
          ),
          fullPage: true,
          animations: "disabled",
        });
    }
    if (width < 600) {
      await page.goto("/admin/dashboard/users");
      await page.getByRole("button", { name: "Lihat detail" }).first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      const dialogWidth = await page
        .getByRole("dialog")
        .evaluate((element) => element.getBoundingClientRect().width);
      expect(dialogWidth).toBeLessThan(width);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await page.getByRole("button", { name: "Buka menu navigasi" }).click();
      await expect(
        page.getByRole("link", { name: "Undangan Pengguna" }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Undangan Pengguna" }).click();
      await expect(
        page.getByRole("heading", { name: "Undangan pengguna", exact: true }),
      ).toBeVisible();
    }
    await page.evaluate(() =>
      document.documentElement.setAttribute("data-theme", "dark"),
    );
    await page.screenshot({
      path: testInfo.outputPath(`${width}-dark.png`),
      fullPage: true,
      animations: "disabled",
    });
  });
}
