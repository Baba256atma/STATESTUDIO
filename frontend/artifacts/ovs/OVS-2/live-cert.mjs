/**
 * Bounded OVS:2 live cert against existing :3000. Hard ~25s.
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
        label: (el.getAttribute("aria-label") ?? "").slice(0, 80),
      }),
    );
    const stage = document.querySelector("[data-ovs-1-contract]");
    return {
      href: location.href,
      canvasCount: document.querySelectorAll("canvas").length,
      ovs1: stage
        ? {
            enabled: stage.getAttribute("data-ovs-1-enabled"),
            family: stage.getAttribute("data-ovs-1-family"),
            primitive: stage.getAttribute("data-ovs-1-primitive"),
          }
        : null,
      focusedSubject: document
        .querySelector("[data-focused-subject]")
        ?.getAttribute("data-focused-subject"),
      nmiOpen: document
        .querySelector("[data-nmi-panel-open]")
        ?.getAttribute("data-nmi-panel-open"),
      overflow: {
        innerW: innerWidth,
        innerH: innerHeight,
        scrollW: document.documentElement.scrollWidth,
        scrollH: document.documentElement.scrollHeight,
      },
      objects,
    };
  });
}

async function openListAndClick(page, id) {
  const details = page.locator('[data-testid="nexora-stage-object-list"]');
  if (!(await details.evaluate((el) => el.open).catch(() => false))) {
    await details.locator("summary").click({ timeout: 3_000 });
  }
  await page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).first().click({
    timeout: 4_000,
  });
  await page.waitForTimeout(450);
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
  const report = { url: URL, steps: [] };
  try {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 12_000 });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 12_000 });
    await page.waitForTimeout(1000);
    report.load = await collect(page);
    report.steps.push("loaded");
    await page.screenshot({ path: join(here, "live-overview.png"), fullPage: false });

    const byStatus = (status) =>
      report.load.objects.find((o) => o.status === status && o.id?.startsWith("obj-"));
    const stable = byStatus("stable") ?? report.load.objects.find((o) => o.id === "obj-revenue");
    const watch = byStatus("watch") ?? report.load.objects.find((o) => o.id === "obj-capacity");
    const risk = byStatus("risk") ?? report.load.objects.find((o) => o.id === "obj-risk");
    const unresolved = byStatus("unresolved") ?? risk;

    if (stable?.id) {
      await openListAndClick(page, stable.id);
      report.stable = { pick: stable, after: await collect(page) };
      await page.screenshot({ path: join(here, "live-stable.png"), fullPage: false });
      report.steps.push("stable");
    }
    if (watch?.id) {
      await openListAndClick(page, watch.id);
      report.watch = { pick: watch, after: await collect(page) };
      await page.screenshot({ path: join(here, "live-watch.png"), fullPage: false });
      report.steps.push("watch");
    }
    if (risk?.id) {
      await openListAndClick(page, risk.id);
      report.risk = { pick: risk, after: await collect(page) };
      await page.screenshot({ path: join(here, "live-critical.png"), fullPage: false });
      report.steps.push("critical");
      const canvas = page.locator("canvas").first();
      if ((await canvas.count()) > 0) {
        await canvas.hover({ timeout: 2_000 });
        report.hover = { after: await collect(page), focused: report.risk.after.focusedSubject };
        report.steps.push("hover");
      }
    }
    if (unresolved?.id && unresolved.id !== risk?.id) {
      await openListAndClick(page, unresolved.id);
      report.unresolved = { pick: unresolved, after: await collect(page) };
      await page.screenshot({ path: join(here, "live-unresolved.png"), fullPage: false });
      report.steps.push("unresolved");
    } else if (risk?.id) {
      report.unresolvedFromRisk = report.risk;
    }

    const beforeNmi = await page.evaluate(
      () => document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
    );
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(250);
    const mapMode = page.locator('[data-testid="nmi-mode-map"]');
    if ((await mapMode.count()) > 0) await mapMode.click();
    await page.waitForTimeout(200);
    const node = page.locator("[data-testid^=\"nmi-map-node-\"]").first();
    const nodeId = (await node.count()) > 0 ? await node.getAttribute("data-nmi-map-node") : null;
    if (nodeId) await node.click();
    await page.waitForTimeout(350);
    const afterPick = await collect(page);
    await page.locator('[data-testid="executive-nav-nmi"]').click();
    await page.waitForTimeout(250);
    const afterCollapse = await collect(page);
    report.nmi = { beforeNmi, nodeId, afterPickFocused: afterPick.focusedSubject, afterCollapse };
    report.steps.push("nmi");

    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    try {
      await page.screenshot({ path: join(here, "live-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        ok: report.ok,
        error: report.error ?? null,
        steps: report.steps,
        statuses: [...new Set((report.load?.objects ?? []).map((o) => o.status))],
        focused: {
          stable: report.stable?.after?.focusedSubject,
          watch: report.watch?.after?.focusedSubject,
          risk: report.risk?.after?.focusedSubject,
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
