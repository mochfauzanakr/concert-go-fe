import path from "node:path";
import fs from "node:fs";
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".next/playwright-browsers");
const { chromium } = await import("@playwright/test");

(async () => {
  const browser = await chromium.launch();
  const origin = process.env.DESIGN_BASE_URL || "http://localhost:3100";
  const destination = path.resolve("docs/design/screenshots");
  const prototype = process.argv.includes("--prototype");
  const profiles = process.argv.includes("--profiles");
  const results = [];
  try {
    for (const [device, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
      if (!prototype) await context.addInitScript(() => {
        if (location.protocol.startsWith("http")) sessionStorage.setItem("concertgo_demo_preview", "true");
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      let detailPath = "";
      const screens = profiles ? [["user", "/user/profile"], ["admin", "/admin/dashboard/profile"]] : prototype ? [
        ["landing", "/design/discovery"], ["catalog", "/design/discovery?screen=catalog"], ["detail", "/design/discovery?screen=detail&id=senja-live"],
      ] : [["landing", "/"], ["catalog", "/user/events"], ["detail", ""]];
      for (const [screen, route] of screens) {
        await page.goto(`${origin}${route || detailPath}`, { waitUntil: "networkidle", timeout: 60000 });
        if (screen === "catalog" && !prototype) detailPath = await page.getByRole("link", { name: "Detail acara" }).first().getAttribute("href");
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
        // Reveal scroll-triggered content before capturing a full-page audit image.
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) {
            scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 120));
          }
          scrollTo(0, 0);
        });
        await page.waitForTimeout(450);
        const filename = `${profiles ? "profile" : prototype ? "proposal" : "current"}-${screen}-${device}.png`;
        await page.screenshot({ path: path.join(destination, filename), fullPage: true, animations: "disabled" });
        const metrics = await page.evaluate(() => ({
          width: innerWidth, documentWidth: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          headings: [...document.querySelectorAll("h1,h2")].map((element) => element.textContent?.trim()),
          searches: [...document.querySelectorAll('input[type="search"],input[placeholder*="Cari"],input[placeholder*="cari"]')].map((element) => ({ label: element.getAttribute("placeholder"), top: Math.round(element.getBoundingClientRect().top + scrollY) })),
        }));
        results.push({ screen, device, route: route || detailPath, screenshot: filename, ...metrics, errors: [...errors] });
      }
      await context.close();
    }
    fs.writeFileSync(path.join(destination, profiles ? "profile-metrics.json" : prototype ? "proposal-metrics.json" : "current-metrics.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
