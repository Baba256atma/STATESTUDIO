/**
 * VISUAL-POLISH:1-ACCEPT — one bounded capture. Existing :3000 only.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(800);
    const details = page.locator('[data-testid="nexora-stage-object-list"]');
    if (!(await details.evaluate((el) => el.open).catch(() => false))) {
      await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
    }
    const capacity = page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first();
    if ((await capacity.count()) > 0) {
      await capacity.click({ timeout: 3_000 });
    } else {
      await page.locator('[data-testid="nexora-stage-object-control-obj-customer"]').first().click({
        timeout: 3_000,
      });
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(here, "accept-operational.png"), fullPage: false });
    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(here, "accept-risk-spatial.png"), fullPage: false });
    console.log(JSON.stringify({ ok: true }));
  } finally {
    await browser.close().catch(() => undefined);
  }
}

await main();
