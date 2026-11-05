import { defineConfig } from "@playwright/test";
import path from "node:path";

process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(
  __dirname,
  ".next",
  "playwright-browsers",
);
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 90000,
  expect: { timeout: 12000 },
  workers: 2,
  fullyParallel: true,
  reporter: "list",
  outputDir: ".next/demo-test-results",
  use: {
    baseURL: process.env.DEMO_BASE_URL || "http://localhost:3100",
    viewport: { width: 1440, height: 960 },
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
