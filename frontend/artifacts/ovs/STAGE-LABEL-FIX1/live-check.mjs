/**
 * STAGE-LABEL:FIX1 live check — caption association on existing /executive.
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
    const captions = [...document.querySelectorAll('[data-object-caption="primary"]')].map(
      (el) => {
        const r = el.getBoundingClientRect();
        return {
          owner: el.getAttribute("data-label-owner-id") ?? el.getAttribute("data-canonical-id"),
          text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
          side: el.getAttribute("data-label-side"),
          visibility: el.getAttribute("data-label-visibility"),
          x: Math.round(r.x + r.width / 2),
          y: Math.round(r.y + r.height / 2),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      },
    );
    const duplicateOwners = captions
      .map((c) => c.owner)
      .filter((id, index, all) => id && all.indexOf(id) !== index);
    return {
      focused: stage?.getAttribute("data-focused-object"),
      threadState: stage?.getAttribute("data-stage-thread-state"),
      az: stage?.getAttribute("data-stage-camera-azimuth"),
      el: stage?.getAttribute("data-stage-camera-elevation"),
      fov: stage?.getAttribute("data-stage-camera-fov"),
      effective: stage?.getAttribute("data-stage-camera-effective-distance"),
      advisorCollapsed: document
        .querySelector("[data-right-context-collapsed]")
        ?.getAttribute("data-right-context-collapsed"),
      captionCount: captions.length,
      duplicateOwners,
      captions,
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
    const thread = page.locator('[data-testid="nexora-stage-thread-control"]');
    if ((await thread.count()) > 0) {
      const text = ((await thread.textContent()) ?? "").toUpperCase();
      if (text.includes("EXECUTIVE THREAD")) {
        await thread.click({ timeout: 4_000 });
        await page.waitForTimeout(900);
      }
    }
    report.aCapacityThreadExpandedAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "label-fix1-a-capacity-thread-expanded-advisor-open.png"),
      fullPage: false,
    });

    if ((await thread.count()) > 0) {
      const text = ((await thread.textContent()) ?? "").toUpperCase();
      if (text.includes("COLLAPSE")) {
        await thread.click({ timeout: 4_000 });
        await page.waitForTimeout(800);
      }
    }
    report.bCapacityThreadCollapsedAdvisorOpen = await inspect(page);
    await page.screenshot({
      path: join(here, "label-fix1-b-capacity-thread-collapsed-advisor-open.png"),
      fullPage: false,
    });

    if ((await thread.count()) > 0) {
      const text = ((await thread.textContent()) ?? "").toUpperCase();
      if (text.includes("EXECUTIVE THREAD")) {
        await thread.click({ timeout: 4_000 });
        await page.waitForTimeout(800);
      }
    }
    await page.getByRole("button", { name: "Collapse Advisor" }).click().catch(() => undefined);
    await page.waitForTimeout(700);
    report.cCapacityAdvisorClosed = await inspect(page);
    await page.screenshot({
      path: join(here, "label-fix1-c-capacity-advisor-closed.png"),
      fullPage: false,
    });

    await page.getByRole("button", { name: "Expand Advisor" }).click().catch(() => undefined);
    await page.waitForTimeout(500);
    report.clickedRisk = await clickObject(page, "obj-risk");
    await page.waitForTimeout(800);
    report.dRiskAlternate = await inspect(page);
    await page.screenshot({
      path: join(here, "label-fix1-d-risk-alternate.png"),
      fullPage: false,
    });
  } catch (error) {
    report.error = String(error);
  } finally {
    await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report, null, 2));
}

main();
