/**
 * STAGE-THREAD:FIX1 live check against existing :3000.
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
    const collapse = document.querySelector('[data-testid="nexora-stage-collapse-thread"]');
    const breadcrumb = document.querySelector(
      '[data-testid="nexora-stage-interaction-breadcrumb"]',
    );
    const collapseRect = collapse?.getBoundingClientRect();
    const canvas = document
      .querySelector('[data-testid="nexora-stage-canvas-host"]')
      ?.getBoundingClientRect();
    const objectLabels = [...document.querySelectorAll("[data-canonical-id]")]
      .filter((el) => el.getAttribute("data-visual-audit") === "stage-object-label")
      .map((el) => ({
        id: el.getAttribute("data-canonical-id"),
        label: (el.textContent ?? "").trim(),
        r: el.getBoundingClientRect(),
      }));
    const overlap = objectLabels.some((entry) => {
      if (!collapseRect) return false;
      return !(
        collapseRect.right < entry.r.left ||
        collapseRect.left > entry.r.right ||
        collapseRect.bottom < entry.r.top ||
        collapseRect.top > entry.r.bottom
      );
    });
    return {
      focused: stage?.getAttribute("data-focused-object"),
      threadState: stage?.getAttribute("data-stage-thread-state"),
      collapseAvailable: stage?.getAttribute("data-stage-thread-collapse-available"),
      collapseSurface: stage?.getAttribute("data-stage-thread-collapse-surface"),
      collapseWorld: stage?.getAttribute("data-stage-thread-collapse-world-occupancy"),
      az: stage?.getAttribute("data-stage-camera-azimuth"),
      el: stage?.getAttribute("data-stage-camera-elevation"),
      fov: stage?.getAttribute("data-stage-camera-fov"),
      effective: stage?.getAttribute("data-stage-camera-effective-distance"),
      advisorCollapsed: document
        .querySelector("[data-right-context-collapsed]")
        ?.getAttribute("data-right-context-collapsed"),
      collapseInDom: Boolean(collapse),
      collapseInBreadcrumb: Boolean(
        breadcrumb?.querySelector('[data-testid="nexora-stage-collapse-thread"]'),
      ),
      collapseOverlapsObjectLabel: overlap,
      collapseBox: collapseRect
        ? {
            x: Math.round(collapseRect.x),
            y: Math.round(collapseRect.y),
            w: Math.round(collapseRect.width),
            h: Math.round(collapseRect.height),
          }
        : null,
      canvas: canvas
        ? { w: Math.round(canvas.width), h: Math.round(canvas.height) }
        : null,
    };
  });
}

async function clickObject(page, id) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 3_000 }).catch(() => undefined);
  }
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first();
  if ((await control.count()) > 0) {
    await control.click({ timeout: 4_000 });
    await page.waitForTimeout(600);
    return true;
  }
  return false;
}

async function expandThread(page, objectId) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 3_000 }).catch(() => undefined);
  }
  const gateway = page.locator(
    `[data-testid="nexora-stage-context-control-thread-${objectId}"]`,
  );
  if ((await gateway.count()) > 0) {
    await gateway.click({ timeout: 4_000 });
    await page.waitForTimeout(800);
    return true;
  }
  return false;
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    timeout: 8_000,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { url: URL };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', {
      timeout: 18_000,
    });
    await page.waitForTimeout(1200);

    report.clickedCapacity = await clickObject(page, "obj-capacity");
    report.expandedCapacity = await expandThread(page, "obj-capacity");
    await page.waitForTimeout(700);
    report.capacityAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-capacity-advisor-open.png"),
      fullPage: false,
    });

    const objectIds = await page.evaluate(() =>
      [...document.querySelectorAll("[data-testid^='nexora-stage-object-control-']")].map(
        (el) => el.getAttribute("data-testid"),
      ),
    );
    report.objectControls = objectIds;

    const execution = page.locator(
      '[data-testid="nexora-stage-object-control-ctx-execution-capacity"]',
    );
    if ((await execution.count()) > 0) {
      await execution.click({ timeout: 4_000 }).catch(() => undefined);
      await page.waitForTimeout(500);
    }
    report.afterNearbyObjectClick = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-capacity-nearby-object.png"),
      fullPage: false,
    });

    const collapse = page.locator('[data-testid="nexora-stage-collapse-thread"]');
    report.collapseVisibleBefore = (await collapse.count()) > 0;
    if (report.collapseVisibleBefore) {
      await collapse.click({ timeout: 4_000 });
      await page.waitForTimeout(700);
    }
    report.afterCollapse = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-after-collapse.png"),
      fullPage: false,
    });

    report.clickedCapacityAgain = await clickObject(page, "obj-capacity");
    report.expandedAgain = await expandThread(page, "obj-capacity");
    const advisorToggle = page.locator("[data-right-context-collapsed]").first();
    const collapsed = await advisorToggle.getAttribute("data-right-context-collapsed");
    if (collapsed === "false") {
      await page.getByRole("button", { name: "Collapse Advisor" }).click().catch(() => undefined);
      await page.waitForTimeout(600);
    }
    report.capacityAdvisorClosed = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-capacity-advisor-closed.png"),
      fullPage: false,
    });

    report.clickedRisk = await clickObject(page, "obj-risk");
    report.expandedRisk = await expandThread(page, "obj-risk");
    await page.waitForTimeout(600);
    report.risk = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-risk.png"),
      fullPage: false,
    });

    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    await page
      .screenshot({ path: join(here, "thread-fix1-error.png"), fullPage: false })
      .catch(() => undefined);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
