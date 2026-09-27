/**
 * STAGE-VISIBILITY:FIX1 live check — Scenario collection + Detail isolation.
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
    const mount = document.querySelector('[aria-label="Executive Stage"]');
    const canvas = document.querySelector('[data-testid="nexora-stage-canvas"]');
    const detail = document.querySelector('[data-testid="nexora-org2-region-detail-workspace"]');
    const captions = [...document.querySelectorAll('[data-object-caption="primary"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        owner: el.getAttribute("data-label-owner-id") ?? el.getAttribute("data-canonical-id"),
        text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
        visible:
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          r.width > 0 &&
          r.height > 0 &&
          Number(style.opacity || "1") > 0.05,
        x: Math.round(r.x + r.width / 2),
        y: Math.round(r.y + r.height / 2),
      };
    });
    return {
      focused: stage?.getAttribute("data-focused-object"),
      az: stage?.getAttribute("data-stage-camera-azimuth"),
      el: stage?.getAttribute("data-stage-camera-elevation"),
      fov: stage?.getAttribute("data-stage-camera-fov"),
      effective: stage?.getAttribute("data-stage-camera-effective-distance"),
      threadState: stage?.getAttribute("data-stage-thread-state"),
      stageSurfaceActive: mount?.getAttribute("data-stage-surface-active"),
      stageVisibility: mount ? getComputedStyle(mount).visibility : null,
      stagePointer: mount ? getComputedStyle(mount).pointerEvents : null,
      canvasPresent: Boolean(canvas),
      detailOpen: detail?.getAttribute("hidden") == null && Boolean(detail?.getAttribute("aria-label")),
      detailHidden: detail?.hasAttribute("hidden") ?? true,
      captionCount: captions.filter((c) => c.visible).length,
      captions,
    };
  });
}

async function openNmi(page) {
  const nmi = page.locator('[data-testid="executive-nav-nmi"]');
  if ((await nmi.count()) === 0) return;
  const pressed = await nmi.getAttribute("aria-pressed");
  if (pressed !== "true") {
    await nmi.click({ timeout: 4000 }).catch(() => undefined);
    await page.waitForTimeout(400);
  }
}

async function openCollection(page, category) {
  await openNmi(page);
  const row = page.locator(`[data-testid="nexora-executive-queue-row-${category}"]`);
  if ((await row.count()) > 0) {
    await row.click({ timeout: 4000, force: true });
    await page.waitForTimeout(900);
    return true;
  }
  return false;
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    timeout: 8000,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8000);
  const report = { url: URL };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 18000 });
    await page.waitForTimeout(1000);

    report.openedScenario = await openCollection(page, "scenario");
    await page.waitForTimeout(700);
    report.aScenarioCollection = await inspect(page);
    await page.screenshot({
      path: join(here, "visibility-fix1-a-scenario-collection.png"),
      fullPage: false,
    });
    await page.screenshot({
      path: join(here, "visibility-fix1-b-scenario-after.png"),
      fullPage: false,
    });

    try {
      report.openedProblem = await openCollection(page, "problem");
      await page.waitForTimeout(700);
      report.eAlternateCollection = await inspect(page);
      await page.screenshot({
        path: join(here, "visibility-fix1-e-problem-collection.png"),
        fullPage: false,
      });
    } catch (error) {
      report.problemError = String(error);
    }

    await openCollection(page, "scenario").catch(() => false);
    await page.waitForTimeout(400);
    await page.locator('[data-testid="executive-nav-data"]').click({ timeout: 4000 });
    await page.waitForTimeout(800);
    report.cDetailOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "visibility-fix1-c-detail-workspace.png"),
      fullPage: false,
    });

    await page.locator('[data-testid="nexora-detail-workspace-close"]').click({ timeout: 4000 });
    await page.waitForTimeout(800);
    report.dReturnFromDetail = await inspect(page);
    await page.screenshot({
      path: join(here, "visibility-fix1-d-return-from-detail.png"),
      fullPage: false,
    });
  } catch (error) {
    report.error = String(error);
  } finally {
    await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify({
    http: report.http,
    openedScenario: report.openedScenario,
    scenarioCaptions: report.aScenarioCollection?.captions?.map((c) => c.text),
    scenarioSurface: report.aScenarioCollection?.stageSurfaceActive,
    detailCaptionVisible: report.cDetailOpenConfirmed?.captionCount ?? report.cDetailOpen?.captionCount,
    detailSurface: report.cDetailOpenConfirmed?.stageSurfaceActive ?? report.cDetailOpen?.stageSurfaceActive,
    restoreSurface: report.dReturnFromDetail?.stageSurfaceActive,
    restoreCaptions: report.dReturnFromDetail?.captionCount,
    error: report.error ?? null,
  }, null, 2));
}

main();
