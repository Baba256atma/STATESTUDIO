/**
 * One recovery: complete Overview stale-clear after list Overview was hidden.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function collect(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      ovs3: {
        enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
        family: stage?.getAttribute("data-ovs-3-family") ?? null,
        scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
        structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
      },
      sceneIntent: stage?.getAttribute("data-stage-prod-scene-intent") ?? null,
      focusedSubject: document
        .querySelector("[data-focused-subject]")
        ?.getAttribute("data-focused-subject"),
      advisorSubject:
        document.querySelector("[data-advisor-subject]")?.getAttribute("data-advisor-subject") ??
        null,
      canvasCount: document.querySelectorAll("canvas").length,
    };
  });
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { recovery: true };
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(700);
    report.risk = await collect(page);
    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(700);
    report.overviewAfter = await collect(page);
    await page.screenshot({ path: join(here, "recert-overview-after.png"), fullPage: false });
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "recert-overview-recovery.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

await main();
