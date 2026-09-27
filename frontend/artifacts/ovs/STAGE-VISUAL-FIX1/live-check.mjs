/**
 * STAGE-VISUAL:FIX1 live check — Customer/Capacity Watch scene. Existing :3000.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function inspect(page) {
  return page.evaluate(() => {
    const labels = [...document.querySelectorAll("[data-canonical-id][data-status]")].map(
      (el) => ({
        id: el.getAttribute("data-canonical-id"),
        status: el.getAttribute("data-status"),
        attention: el.getAttribute("data-attention"),
        focused: el.getAttribute("data-focused"),
        selected: el.getAttribute("data-selected"),
        visual: el.getAttribute("data-executive-visual-state"),
        label: (el.getAttribute("aria-label") ?? "").slice(0, 80),
      }),
    );
    const stage = document.querySelector("[data-nexora-3d-executive-stage], [data-testid='nexora-3d-executive-stage']");
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      camera: {
        az: stage?.getAttribute("data-stage-camera-azimuth") ??
          document.querySelector("[data-stage-camera-azimuth]")?.getAttribute("data-stage-camera-azimuth"),
        el: document.querySelector("[data-stage-camera-elevation]")?.getAttribute("data-stage-camera-elevation"),
        d: document.querySelector("[data-stage-camera-distance]")?.getAttribute("data-stage-camera-distance"),
        fov: document.querySelector("[data-stage-camera-fov]")?.getAttribute("data-stage-camera-fov"),
      },
      ovs1: document.querySelector("[data-ovs-1-family]")?.getAttribute("data-ovs-1-family"),
      ovs3: document.querySelector("[data-ovs-3-family]")?.getAttribute("data-ovs-3-family"),
      focused: [...document.querySelectorAll('[data-focused="true"]')].map((el) =>
        el.getAttribute("data-canonical-id"),
      ),
      labels,
    };
  });
}

async function openListAndClick(page, id) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 3_000 }).catch(() => undefined);
  }
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first();
  if ((await control.count()) > 0) {
    await control.click({ timeout: 4_000 });
    await page.waitForTimeout(500);
    return true;
  }
  const named = page.getByRole("button", { name: /risk/i }).first();
  if ((await named.count()) > 0) {
    await named.click({ timeout: 4_000 });
    await page.waitForTimeout(500);
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
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(1100);
    report.overview = await inspect(page);
    await page.screenshot({ path: join(here, "fix1-overview.png"), fullPage: false });

    report.clickedRisk = await openListAndClick(page, "obj-risk");
    await page.waitForTimeout(700);
    report.risk = await inspect(page);
    await page.screenshot({ path: join(here, "fix1-customer-capacity.png"), fullPage: false });

    const canvas = page.locator("canvas").first();
    if ((await canvas.count()) > 0) {
      await canvas.hover({ timeout: 2_000 }).catch(() => undefined);
      report.hover = await inspect(page);
    }
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    await page.screenshot({ path: join(here, "fix1-error.png"), fullPage: false }).catch(() => undefined);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, http: report.http, clickedRisk: report.clickedRisk, error: report.error }, null, 2));
}

main();
