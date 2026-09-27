/**
 * STAGE-THREAD:FIX1-CONT live check — unified Thread control on breadcrumb.
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
    const control = document.querySelector('[data-testid="nexora-stage-thread-control"]');
    const breadcrumb = document.querySelector(
      '[data-testid="nexora-stage-interaction-breadcrumb"]',
    );
    const floating = document.querySelector('[data-visual-audit="stage-thread-gateway"]');
    const listThread = document.querySelector(
      '[data-testid^="nexora-stage-context-control-thread-"]',
    );
    return {
      focused: stage?.getAttribute("data-focused-object"),
      threadState: stage?.getAttribute("data-stage-thread-state"),
      controlState: stage?.getAttribute("data-stage-thread-control-state"),
      controlAvailable: stage?.getAttribute("data-stage-thread-control-available"),
      world: stage?.getAttribute("data-stage-thread-control-world-occupancy"),
      az: stage?.getAttribute("data-stage-camera-azimuth"),
      el: stage?.getAttribute("data-stage-camera-elevation"),
      fov: stage?.getAttribute("data-stage-camera-fov"),
      effective: stage?.getAttribute("data-stage-camera-effective-distance"),
      advisorCollapsed: document
        .querySelector("[data-right-context-collapsed]")
        ?.getAttribute("data-right-context-collapsed"),
      controlText: (control?.textContent ?? "").replace(/\s+/g, " ").trim(),
      controlAction: control?.getAttribute("data-stage-thread-control"),
      controlCount: control?.getAttribute("data-gateway-count"),
      inBreadcrumb: Boolean(
        breadcrumb?.querySelector('[data-testid="nexora-stage-thread-control"]'),
      ),
      floatingGateway: Boolean(floating),
      listThread: Boolean(listThread),
      controlBox: control
        ? (() => {
            const r = control.getBoundingClientRect();
            return {
              x: Math.round(r.x),
              y: Math.round(r.y),
              w: Math.round(r.width),
              h: Math.round(r.height),
            };
          })()
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
    await page.waitForTimeout(700);
    report.collapsedAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-cont-collapsed-advisor-open.png"),
      fullPage: false,
    });

    const thread = page.locator('[data-testid="nexora-stage-thread-control"]');
    report.clickedOpen = (await thread.count()) > 0;
    if (report.clickedOpen) {
      await thread.click({ timeout: 4_000 });
      await page.waitForTimeout(800);
    }
    report.expandedAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-cont-expanded-advisor-open.png"),
      fullPage: false,
    });

    if ((await thread.count()) > 0) {
      await thread.click({ timeout: 4_000 });
      await page.waitForTimeout(800);
    }
    report.recollapsedAdvisorOpen = await inspect(page);

    await page.getByRole("button", { name: "Collapse Advisor" }).click().catch(() => undefined);
    await page.waitForTimeout(600);
    report.collapsedAdvisorClosed = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-cont-collapsed-advisor-closed.png"),
      fullPage: false,
    });

    if ((await thread.count()) > 0) {
      await thread.click({ timeout: 4_000 });
      await page.waitForTimeout(800);
    }
    report.expandedAdvisorClosed = await inspect(page);
    await page.screenshot({
      path: join(here, "thread-fix1-cont-expanded-advisor-closed.png"),
      fullPage: false,
    });

    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    await page
      .screenshot({ path: join(here, "thread-fix1-cont-error.png"), fullPage: false })
      .catch(() => undefined);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report-cont.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
