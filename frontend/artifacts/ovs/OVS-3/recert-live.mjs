/**
 * NPA-T OVS:3-RECERT — one bounded Playwright pass against existing :3000.
 * Does not start next dev. Does not modify production.
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
        attention: el.getAttribute("data-attention"),
        visual: el.getAttribute("data-executive-visual-state"),
        focused: el.getAttribute("data-focused"),
        selected: el.getAttribute("data-selected"),
        family: el.getAttribute("data-ovs-1-family"),
        primitive: el.getAttribute("data-ovs-1-primitive"),
        label: (el.getAttribute("aria-label") ?? "").slice(0, 80),
      }),
    );
    const risk = objects.find((item) => item.id === "obj-risk") ?? null;
    const connections = [...document.querySelectorAll("[data-connection-id]")].map((el) => ({
      id: el.getAttribute("data-connection-id"),
      from: el.getAttribute("data-from-id") ?? el.getAttribute("data-source-id"),
      to: el.getAttribute("data-to-id") ?? el.getAttribute("data-target-id"),
    }));
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      orbitControls: Boolean(document.querySelector("[data-orbit], .orbit-controls")),
      ovs3: {
        enabled: stage?.getAttribute("data-ovs-3-enabled") ?? null,
        family: stage?.getAttribute("data-ovs-3-family") ?? null,
        scene: stage?.getAttribute("data-ovs-3-scene") ?? null,
        data: stage?.getAttribute("data-ovs-3-data") ?? null,
        structures: stage?.getAttribute("data-ovs-3-structures") ?? null,
        roadmap: stage?.getAttribute("data-ovs-3-roadmap") ?? null,
        identity: stage?.getAttribute("data-ovs-3-identity") ?? null,
      },
      ovs1: {
        enabled: stage?.getAttribute("data-ovs-1-enabled") ?? null,
        family: stage?.getAttribute("data-ovs-1-family") ?? null,
        primitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      },
      sceneFamily: stage?.getAttribute("data-stage-prod-scene-family") ?? null,
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
        .slice(0, 120),
      risk,
      objectIds: objects.map((item) => item.id),
      kinds: [...new Set(objects.map((item) => item.kind))],
      connections,
      objectCount: objects.length,
    };
  });
}

async function clickControl(page, id) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 2_000 }).catch(() => undefined);
  }
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first();
  if ((await control.count()) === 0) return false;
  await control.click({ timeout: 3_000 });
  await page.waitForTimeout(500);
  return true;
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
  const report = { url: URL, recert: true, steps: [] };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(900);
    report.overviewBefore = await collect(page);
    await page.screenshot({ path: join(here, "recert-overview-before.png"), fullPage: false });
    report.steps.push("overview-before");

    const investigate = page.getByRole("button", { name: /Investigate Risk/i }).first();
    if ((await investigate.count()) > 0) {
      await investigate.click({ timeout: 3_000 });
      await page.waitForTimeout(700);
      report.steps.push("investigate-risk");
    } else {
      const clicked = await clickControl(page, "obj-risk");
      report.steps.push(clicked ? "list-risk" : "risk-unavailable");
    }
    report.risk = await collect(page);
    await page.screenshot({ path: join(here, "recert-risk-spatial.png"), fullPage: false });
    report.steps.push("risk");

    await page.locator('[data-testid="nexora-advisor-insight-region"]').click({ timeout: 2_000 }).catch(
      () => undefined,
    );
    await page.waitForTimeout(200);
    report.advisor = await collect(page);
    report.steps.push("advisor");

    await page.locator('[data-testid="nexora-stage-reset"]').click({ timeout: 3_000 });
    await page.waitForTimeout(700);
    report.overviewAfter = await collect(page);
    await page.screenshot({ path: join(here, "recert-overview-after.png"), fullPage: false });
    report.steps.push("overview-after");
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    try {
      await page.screenshot({ path: join(here, "recert-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "recert-report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: report.ok,
        error: report.error ?? null,
        steps: report.steps,
        overviewBefore: report.overviewBefore?.ovs3,
        risk: {
          ovs3: report.risk?.ovs3,
          focused: report.risk?.focusedSubject,
          advisor: report.risk?.advisorSubject,
          riskObj: report.risk?.risk,
          intent: report.risk?.sceneIntent,
          canvas: report.risk?.canvasCount,
        },
        overviewAfter: report.overviewAfter?.ovs3,
      },
      null,
      2,
    ),
  );
  if (!report.ok) process.exit(2);
}

await main();
