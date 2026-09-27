import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const watchdog = setTimeout(() => process.exit(2), 18000);

const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8000 });
const page = await browser.newPage({ viewport: { width: 1352, height: 792 } });
page.setDefaultTimeout(7000);
await page.goto("http://127.0.0.1:3000/executive?ovs1=1", { waitUntil: "domcontentloaded", timeout: 8000 });
await page.waitForSelector("canvas", { timeout: 8000 });
await page.waitForTimeout(2000);

await page.getByRole("button", { name: /^focus$/i }).click().catch(() => null);
await page.waitForTimeout(1200);
await page.screenshot({ path: join(here, "live-focus.png") });

const afterFocus = await page.evaluate(() => ({
  ovs: {
    family: document.querySelector("[data-ovs-1-contract]")?.getAttribute("data-ovs-1-family"),
    primitive: document.querySelector("[data-ovs-1-contract]")?.getAttribute("data-ovs-1-primitive"),
    enabled: document.querySelector("[data-ovs-1-contract]")?.getAttribute("data-ovs-1-enabled"),
  },
  labels: Array.from(document.querySelectorAll("[data-testid^='nexora-stage-object-label-']")).map((el) => ({
    id: el.getAttribute("data-canonical-id"),
    text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
  })),
}));

const risk = page.locator("[data-testid='nexora-stage-object-label-obj-risk']");
let afterRisk = null;
if (await risk.count()) {
  await risk.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(here, "live-risk.png") });
  afterRisk = await page.evaluate(() => ({
    family: document.querySelector("[data-ovs-1-contract]")?.getAttribute("data-ovs-1-family"),
    primitive: document.querySelector("[data-ovs-1-contract]")?.getAttribute("data-ovs-1-primitive"),
  }));
}

writeFileSync(join(here, "live-focus-report.json"), JSON.stringify({ afterFocus, afterRisk }, null, 2));
await browser.close();
clearTimeout(watchdog);
