/**
 * One recovery pass: remaining OVS:2 scenes the first pass missed
 * (Risk not on Capacity list). Hard ~25s against existing :3000.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";

async function collect(page) {
  return page.evaluate(() => {
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
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      focusedSubject: document
        .querySelector("[data-focused-subject]")
        ?.getAttribute("data-focused-subject"),
      nmiOpen: document
        .querySelector("[data-nmi-panel-open]")
        ?.getAttribute("data-nmi-panel-open"),
      advisorSubject: (
        document.querySelector("[data-advisor-subject]")?.textContent ??
        document.querySelector("[data-testid='nexora-advisor-subject']")?.textContent ??
        ""
      )
        .trim()
        .slice(0, 80),
      statuses: [...new Set(objects.map((o) => o.status))],
      visuals: [...new Set(objects.map((o) => o.visual))],
      objects,
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
  await page.waitForTimeout(400);
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
  const report = { url: URL, recovery: true, steps: [] };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(800);
    report.load = await collect(page);
    report.steps.push("loaded");

    const investigate = page.getByRole("button", { name: /Investigate Risk/i }).first();
    if ((await investigate.count()) > 0) {
      await investigate.click({ timeout: 3_000 });
      await page.waitForTimeout(500);
      report.steps.push("investigate-risk");
    } else {
      const clicked = await clickControl(page, "obj-risk");
      report.steps.push(clicked ? "list-risk" : "risk-unavailable");
    }
    report.risk = await collect(page);
    await page.screenshot({ path: join(here, "live-risk-unresolved.png"), fullPage: false });
    report.steps.push("risk");

    const canvas = page.locator("canvas").first();
    if ((await canvas.count()) > 0) {
      await canvas.hover({ timeout: 2_000 });
      report.hover = await collect(page);
      report.steps.push("hover");
    }

    const budgetVisible = await clickControl(page, "obj-budget");
    if (!budgetVisible) {
      await page.getByRole("button", { name: /^OVERVIEW$/i }).first().click({ timeout: 2_000 }).catch(
        () => undefined,
      );
      await page.waitForTimeout(300);
      await clickControl(page, "obj-capacity");
      await clickControl(page, "obj-budget");
    }
    report.unresolved = await collect(page);
    await page.screenshot({ path: join(here, "live-unresolved.png"), fullPage: false });
    report.steps.push("unresolved");

    const beforeNmi = report.unresolved.focusedSubject;
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(250);
    const mapMode = page.locator('[data-testid="nmi-mode-map"]');
    if ((await mapMode.count()) > 0) await mapMode.click();
    await page.waitForTimeout(200);
    const node = page.locator("[data-testid^=\"nmi-map-node-\"]").first();
    const nodeId =
      (await node.count()) > 0
        ? ((await node.getAttribute("data-nmi-map-node")) ??
          (await node.getAttribute("data-testid")))
        : null;
    if ((await node.count()) > 0) await node.click();
    await page.waitForTimeout(350);
    const afterPick = await collect(page);
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(250);
    const afterCollapse = await collect(page);
    report.nmi = {
      beforeNmi,
      nodeId,
      afterPickFocused: afterPick.focusedSubject,
      afterCollapseFocused: afterCollapse.focusedSubject,
    };
    report.steps.push("nmi");
    await page.screenshot({ path: join(here, "live-nmi-continuity.png"), fullPage: false });

    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    try {
      await page.screenshot({ path: join(here, "live-recovery-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-recovery-report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: report.ok,
        error: report.error ?? null,
        steps: report.steps,
        statuses: report.load?.statuses,
        focused: {
          risk: report.risk?.focusedSubject,
          unresolved: report.unresolved?.focusedSubject,
        },
        nmi: report.nmi,
      },
      null,
      2,
    ),
  );
  if (!report.ok) process.exit(2);
}

await main();
