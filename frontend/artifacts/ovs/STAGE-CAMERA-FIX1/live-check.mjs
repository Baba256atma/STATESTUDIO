/**
 * STAGE-CAMERA:FIX1 live check against existing :3000.
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
    return {
      az: stage?.getAttribute("data-stage-camera-azimuth"),
      el: stage?.getAttribute("data-stage-camera-elevation"),
      base: stage?.getAttribute("data-stage-camera-base-distance"),
      distance: stage?.getAttribute("data-stage-camera-distance"),
      effective: stage?.getAttribute("data-stage-camera-effective-distance"),
      reason: stage?.getAttribute("data-stage-camera-fit-reason"),
      conflict: stage?.getAttribute("data-stage-camera-fit-conflict"),
      safe: stage?.getAttribute("data-stage-safe-viewport"),
      fov: stage?.getAttribute("data-stage-camera-fov"),
      ovs3: stage?.getAttribute("data-ovs-3-family"),
      focused: [...document.querySelectorAll('[data-focused="true"][data-canonical-id]')].map(
        (el) => el.getAttribute("data-canonical-id"),
      ),
      advisorCollapsed: document
        .querySelector("[data-right-context-collapsed]")
        ?.getAttribute("data-right-context-collapsed"),
      canvas: (() => {
        const r = document
          .querySelector('[data-testid="nexora-stage-canvas-host"]')
          ?.getBoundingClientRect();
        return r
          ? { w: Math.round(r.width), h: Math.round(r.height) }
          : null;
      })(),
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
    await page.waitForTimeout(700);
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
    await page.waitForTimeout(900);
    report.capacityAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "camera-fix1-capacity-advisor-open.png"),
      fullPage: false,
    });

    const collapse = page.getByRole("button", { name: /collapse/i }).first();
    if ((await collapse.count()) > 0) {
      await collapse.click();
      await page.waitForTimeout(700);
    }
    report.capacityAdvisorClosed = await inspect(page);
    await page.screenshot({
      path: join(here, "camera-fix1-capacity-advisor-closed.png"),
      fullPage: false,
    });

    const expand = page.getByRole("button", { name: /expand|advisor/i }).first();
    if ((await expand.count()) > 0) {
      await expand.click().catch(() => undefined);
      await page.waitForTimeout(500);
    }
    report.capacityAdvisorReopen = await inspect(page);
    await page.screenshot({
      path: join(here, "camera-fix1-capacity-advisor-top.png"),
      fullPage: false,
    });

    report.clickedRisk = await clickObject(page, "obj-risk");
    await page.waitForTimeout(800);
    report.risk = await inspect(page);
    await page.screenshot({
      path: join(here, "camera-fix1-risk.png"),
      fullPage: false,
    });

    report.clickedRevenue = await clickObject(page, "obj-revenue");
    await page.waitForTimeout(700);
    report.simple = await inspect(page);
    await page.screenshot({
      path: join(here, "camera-fix1-simple-revenue.png"),
      fullPage: false,
    });

    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    await page
      .screenshot({ path: join(here, "camera-fix1-error.png"), fullPage: false })
      .catch(() => undefined);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: report.ok,
        error: report.error,
        capacityOpen: report.capacityAdvisorOpen,
        capacityClosed: report.capacityAdvisorClosed,
        risk: report.risk,
        simple: report.simple,
      },
      null,
      2,
    ),
  );
}

main();
