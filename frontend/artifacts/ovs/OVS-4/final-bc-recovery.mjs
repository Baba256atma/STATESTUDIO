/**
 * One recovery: Journey B+C + FPS after Customer focus hid Investigate Risk.
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
        status: el.getAttribute("data-status"),
        visual: el.getAttribute("data-executive-visual-state"),
        focused: el.getAttribute("data-focused"),
        selected: el.getAttribute("data-selected"),
      }),
    );
    return {
      canvasCount: document.querySelectorAll("canvas").length,
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
        .slice(0, 80),
      uniqueObjectCount: new Set(objects.map((item) => item.id)).size,
      risk: objects.find((item) => item.id === "obj-risk") ?? null,
      connections: document.querySelectorAll("[data-connection-id]").length,
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
    return {
      durationMs: ms,
      frameCount: usable.length,
      fps: Number((1000 / mean).toFixed(2)),
      meanIntervalMs: Number(mean.toFixed(3)),
      maxIntervalMs: Number(max.toFixed(3)),
      framesOver33_4Ms: usable.filter((value) => value > 33.4).length,
    };
  }, durationMs);
}

async function main() {
  await mkdir(here, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 8_000 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { recovery: "B-C-FPS" };
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: /Investigate Risk/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(900);
    report.journeyB = await collect(page);
    report.fps = await measureFps(page, 1500);
    await page.screenshot({ path: join(here, "final-b-risk-spatial.png"), fullPage: false });
    await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 3_000 });
    await page.waitForTimeout(800);
    report.journeyC = await collect(page);
    await page.screenshot({ path: join(here, "final-c-overview-recovery.png"), fullPage: false });
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "final-bc-recovery.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

await main();
