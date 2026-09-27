/**
 * NPA-T STAGE-SPATIAL:1A-FIX1 — bounded live check. Existing :3000 only.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function inspect(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const objects = [...document.querySelectorAll("[data-testid^='nexora-stage-object-control-']")];
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      azimuth: stage?.getAttribute("data-stage-camera-azimuth") ?? null,
      elevation: stage?.getAttribute("data-stage-camera-elevation") ?? null,
      distance: stage?.getAttribute("data-stage-camera-distance") ?? null,
      fov: stage?.getAttribute("data-stage-camera-fov") ?? null,
      ovs3Enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
      ovs3Family: stage?.getAttribute("data-ovs-3-family") ?? null,
      ovs3Scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
      ovs3Structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
      objects: objects.map((el) => ({
        id: el.getAttribute("data-canonical-id"),
        pos: el.getAttribute("data-stage-position"),
        scale: el.getAttribute("data-scale"),
        focused: el.getAttribute("data-focused"),
        kind: el.getAttribute("data-object-type"),
        status: el.getAttribute("data-status"),
        role: el.getAttribute("data-role"),
      })),
    };
  });
}

async function openObjectList(page) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
  }
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const report = {};
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(900);
    await openObjectList(page);
    await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"]').first().click({
      timeout: 4_000,
    });
    await page.waitForTimeout(1000);
    report.capacity = await inspect(page);
    await page.screenshot({ path: join(here, "capacity-spacing-after.png"), fullPage: false });
    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 4_000 });
    await page.waitForTimeout(1000);
    report.risk = await inspect(page);
    await page.screenshot({ path: join(here, "risk-regression.png"), fullPage: false });
    await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close().catch(() => undefined);
  }
}

await main();
