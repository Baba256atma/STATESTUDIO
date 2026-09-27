import { chromium } from "playwright";

const URL = "http://127.0.0.1:3000/executive?ovs1=1";
const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
await page.waitForTimeout(500);
const details = page.locator('[data-testid="nexora-stage-object-list"]');
if (!(await details.evaluate((el) => el.open).catch(() => false))) {
  await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
}
await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first().click({ timeout: 4_000 });
await page.waitForTimeout(800);
const names = await page.evaluate(() => {
  return [...document.querySelectorAll("button, a, [role='button']")]
    .map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim())
    .filter((text) => /capacity|expand|gap|plan|decision|execution/i.test(text))
    .slice(0, 80);
});
console.log(JSON.stringify(names, null, 2));
await browser.close();
