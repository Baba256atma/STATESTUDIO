/**
 * NPA-T OVS:4-FINAL — one Playwright session: Journeys A–C + bounded FPS on B.
 * Existing :3000 only. Does not start next dev. Does not change production.
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
    const objects = [...document.querySelectorAll("[data-canonical-id][data-status]")].map(
      (el) => ({
        id: el.getAttribute("data-canonical-id"),
        kind: el.getAttribute("data-object-type"),
        status: el.getAttribute("data-status"),
        visual: el.getAttribute("data-executive-visual-state"),
        focused: el.getAttribute("data-focused"),
        selected: el.getAttribute("data-selected"),
        family: el.getAttribute("data-ovs-1-family"),
        primitive: el.getAttribute("data-ovs-1-primitive"),
        label: (el.getAttribute("aria-label") ?? "").slice(0, 80),
      }),
    );
    const uniqueIds = [...new Set(objects.map((item) => item.id))];
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      orbitControls: Boolean(document.querySelector("[data-orbit], .orbit-controls")),
      compactNav: Boolean(document.querySelector('[data-testid="executive-nav-nmi"]')),
      advisorRegion: Boolean(document.querySelector('[data-testid="nexora-advisor-insight-region"]')),
      ovs3: {
        enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
        family: stage?.getAttribute("data-ovs-3-family") ?? null,
        scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
        data: stage?.getAttribute("data-ovs-3-data") ?? null,
        structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
        roadmap: stage?.getAttribute("data-ovs-3-roadmap") ?? null,
      },
      ovs1: {
        enabled: stage?.getAttribute("data-ovs-1-enabled") ?? null,
        family: stage?.getAttribute("data-ovs-1-family") ?? null,
        primitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      },
      sceneIntent: stage?.getAttribute("data-stage-prod-scene-intent") ?? null,
      sceneFamily: stage?.getAttribute("data-stage-prod-scene-family") ?? null,
      focusedSubject: document
        .querySelector("[data-focused-subject]")
        ?.getAttribute("data-focused-subject"),
      advisorSubject:
        document.querySelector("[data-advisor-subject]")?.getAttribute("data-advisor-subject") ??
        null,
      advisorBridge: (
        document.querySelector('[data-testid="nexora-advisor-bridge-subject"]')?.textContent ?? ""
      )
        .trim()
        .slice(0, 120),
      uniqueObjectIds: uniqueIds,
      uniqueObjectCount: uniqueIds.length,
      kinds: [...new Set(objects.map((item) => item.kind))],
      connections: [...document.querySelectorAll("[data-connection-id]")].map((el) =>
        el.getAttribute("data-connection-id"),
      ),
      capacity: objects.find((item) => item.id === "obj-capacity") ?? null,
      customer: objects.find((item) => item.id === "obj-customer") ?? null,
      risk: objects.find((item) => item.id === "obj-risk") ?? null,
      reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    };
  });
}

async function measureFps(page, durationMs) {
  return page.evaluate(async (ms) => {
    const intervals = [];
    let last = performance.now();
    const end = last + ms;
    await new Promise((resolve) => {
      const tick = (now) => {
        intervals.push(now - last);
        last = now;
        if (now < end) requestAnimationFrame(tick);
        else resolve(null);
      };
      requestAnimationFrame(tick);
    });
    const usable = intervals.slice(1);
    const max = Math.max(...usable);
    const mean = usable.reduce((sum, value) => sum + value, 0) / usable.length;
    const over33 = usable.filter((value) => value > 33.4).length;
    return {
      durationMs: ms,
      frameCount: usable.length,
      fps: Number((1000 / mean).toFixed(2)),
      meanIntervalMs: Number(mean.toFixed(3)),
      maxIntervalMs: Number(max.toFixed(3)),
      framesOver33_4Ms: over33,
    };
  }, durationMs);
}

async function clickControl(page, id) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
  }
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first();
  if ((await control.count()) === 0) return false;
  await control.click({ timeout: 3_000 });
  await page.waitForTimeout(400);
  return true;
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { url: URL, final: true, steps: [] };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(800);

    const customer = page.locator('[data-testid="nexora-stage-object-control-obj-customer"]').first();
    if ((await customer.count()) > 0 && (await customer.isVisible().catch(() => false))) {
      await customer.click({ timeout: 3_000 }).catch(() => undefined);
      await page.waitForTimeout(400);
      report.steps.push("click-customer");
    } else {
      const clicked = await clickControl(page, "obj-customer");
      report.steps.push(clicked ? "list-customer" : "overview-only");
    }
    report.journeyA = await collect(page);
    await page.screenshot({ path: join(here, "final-a-normal.png"), fullPage: false });
    report.steps.push("A");

    const investigate = page.getByRole("button", { name: /Investigate Risk/i }).first();
    if ((await investigate.count()) > 0) {
      await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 }).catch(
        () => undefined,
      );
      await page.waitForTimeout(400);
      await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 3_000 });
    } else {
      await clickControl(page, "obj-risk");
    }
    await page.waitForTimeout(800);
    report.journeyB = await collect(page);
    report.fps = await measureFps(page, 1500);
    report.journeyBAfterFps = await collect(page);
    await page.screenshot({ path: join(here, "final-b-risk-spatial.png"), fullPage: false });
    report.steps.push("B");

    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(800);
    report.journeyC = await collect(page);
    await page.screenshot({ path: join(here, "final-c-overview-recovery.png"), fullPage: false });
    report.steps.push("C");
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    try {
      await page.screenshot({ path: join(here, "final-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "final-report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: report.ok,
        error: report.error ?? null,
        steps: report.steps,
        A: {
          ovs3: report.journeyA?.ovs3,
          ovs1: report.journeyA?.ovs1,
          focused: report.journeyA?.focusedSubject,
          advisor: report.journeyA?.advisorSubject,
          objects: report.journeyA?.uniqueObjectCount,
          capacity: report.journeyA?.capacity,
          customer: report.journeyA?.customer,
        },
        B: {
          ovs3: report.journeyB?.ovs3,
          ovs1: report.journeyB?.ovs1,
          focused: report.journeyB?.focusedSubject,
          advisor: report.journeyB?.advisorSubject,
          risk: report.journeyB?.risk,
          objects: report.journeyB?.uniqueObjectCount,
        },
        fps: report.fps,
        C: {
          ovs3: report.journeyC?.ovs3,
          intent: report.journeyC?.sceneIntent,
          focused: report.journeyC?.focusedSubject,
          advisor: report.journeyC?.advisorSubject,
        },
      },
      null,
      2,
    ),
  );
  if (!report.ok) process.exit(2);
}

await main();
