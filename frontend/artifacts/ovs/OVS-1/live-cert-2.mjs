/**
 * Second bounded pass: Risk geometry + NMI map node. Existing :3000 only.
 */
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = {};
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(900);
    const details = page.locator('[data-testid="nexora-stage-object-list"]');
    await details.locator("summary").click();
    await page.locator('[data-testid="nexora-stage-object-control-obj-risk"]').first().click();
    await page.waitForTimeout(500);
    report.risk = await page.evaluate(() => ({
      focused: document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
      ovsFamily: document.querySelector("[data-ovs-1-family]")?.getAttribute("data-ovs-1-family"),
      ovsPrimitive: document.querySelector("[data-ovs-1-primitive]")?.getAttribute("data-ovs-1-primitive"),
      advisor: document.querySelector('[data-testid="executive-advisor-panel"]')?.innerText?.slice(0, 280),
    }));
    await page.screenshot({ path: join(here, "live-risk.png"), fullPage: false });

    await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first().click();
    await page.waitForTimeout(400);
    report.capacity = await page.evaluate(() => ({
      focused: document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
      ovsFamily: document.querySelector("[data-ovs-1-family]")?.getAttribute("data-ovs-1-family"),
      ovsPrimitive: document.querySelector("[data-ovs-1-primitive]")?.getAttribute("data-ovs-1-primitive"),
    }));
    await page.screenshot({ path: join(here, "live-capacity.png"), fullPage: false });

    const beforeNmi = await page.evaluate(
      () => document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
    );
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(300);
    const mapMode = page.locator('[data-testid="nmi-mode-map"]');
    if ((await mapMode.count()) > 0) await mapMode.click();
    await page.waitForTimeout(200);
    const node = page.locator("[data-testid^=\"nmi-map-node-\"]").first();
    report.nmiNodeCount = await page.locator("[data-testid^=\"nmi-map-node-\"]").count();
    let nodeId = null;
    if (report.nmiNodeCount > 0) {
      nodeId = await node.getAttribute("data-nmi-map-node");
      await node.click();
      await page.waitForTimeout(400);
    }
    const afterPick = await page.evaluate(() => ({
      focused: document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
      nmiOpen: document.querySelector("[data-nmi-panel-open]")?.getAttribute("data-nmi-panel-open"),
    }));
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(250);
    const afterCollapse = await page.evaluate(() => ({
      focused: document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
      nmiOpen: document.querySelector("[data-nmi-panel-open]")?.getAttribute("data-nmi-panel-open"),
    }));
    report.nmi = { beforeNmi, nodeId, afterPick, afterCollapse };
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report-2.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

await main();
