/**
 * STAGE-COMPOSITION:5 live DTH:7 placement/composition proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = `${(process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0]}?reset=1`;
await mkdir(out, { recursive: true });

function rectOf(el) {
  if (!el) return null;
  const box = el.getBoundingClientRect();
  if (box.width < 2 || box.height < 2) return null;
  return {
    x: Math.round(box.x),
    y: Math.round(box.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };
}

function intersect(a, b) {
  if (!a || !b) return false;
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const text = (selector) =>
      document.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const rectOf = (el) => {
      if (!el) return null;
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) return null;
      return {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(box.width),
        height: Math.round(box.height),
      };
    };
    const intersect = (a, b) => {
      if (!a || !b) return false;
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    };
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const comparison = document.querySelector('[data-testid="nexora-theatre-comparison"]');
    const report = document.querySelector('[data-testid="nexora-subject-report"]');
    const actions = document.querySelector('[data-testid="nexora-subject-operation"]');
    const chart = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    const object = document.querySelector("[data-testid^='nexora-stage-object-control-']");
    const view = document.querySelector('[data-testid="nexora-presentation-state-selector"]');
    const statusCard =
      document.querySelector('[data-testid="nexora-stage-contextual-visual"]')?.getAttribute(
        "data-stage-visual-family",
      ) === "STATUS_CARD";
    const comparisonRect = rectOf(comparison);
    const reportRect = rectOf(report);
    const actionsRect = rectOf(actions);
    const chartRect = rectOf(chart);
    const objectRect = rectOf(object);
    const major = [];
    if (object) major.push("Object");
    if (comparison) major.push("DTH:7");
    if (report) major.push("Report");
    if (chart) major.push("Chart");
    if (actions) major.push("ACTIONS");
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      presentation: view?.getAttribute("data-active-presentation") ?? null,
      focused:
        document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute(
          "data-focused-subject",
        ) ?? null,
      comparison: Boolean(comparison),
      comparisonId: comparison?.getAttribute("data-theatre-comparison-id") ?? null,
      comparisonSlot: comparison?.getAttribute("data-stage-overlay-slot") ?? null,
      comparisonCandidates: comparison?.getAttribute("data-theatre-comparison-candidate-count") ?? null,
      comparisonText: comparison?.textContent?.replace(/\s+/g, " ").trim().slice(0, 420) ?? null,
      report: Boolean(report),
      reportProvenance:
        document.querySelector('[data-testid="nexora-subject-report-kpi"]')?.getAttribute(
          "data-kpi-provenance",
        ) ?? text('[data-testid="nexora-subject-report-kpi-provenance"]'),
      actions: Boolean(actions),
      chart: chart?.getAttribute("data-visual-representation") ?? null,
      statusCard,
      advisorSituation: text('[data-testid="nexora-advisor-situation"]'),
      viewVisible: Boolean(view),
      chromeBack: Boolean(document.querySelector('[data-testid="nexora-stage-back"], [data-testid="nexora-presentation-back"]')),
      majorSurfaces: major,
      rects: { comparison: comparisonRect, report: reportRect, actions: actionsRect, chart: chartRect, object: objectRect },
      collisions: {
        comparisonReport: intersect(comparisonRect, reportRect),
        comparisonChart: intersect(comparisonRect, chartRect),
        comparisonActions: intersect(comparisonRect, actionsRect),
      },
    };
  });
}

async function openView(page, state) {
  const disclosure = page.locator('[data-testid="nexora-presentation-disclosure"]');
  if (await disclosure.count()) {
    const open = await disclosure.evaluate((el) => el.open);
    if (!open) await disclosure.locator("summary").click({ timeout: 3000 }).catch(() => null);
  }
  await page.locator(`[data-testid="nexora-presentation-option-${state}"]`).click({ timeout: 4000 }).catch(() => null);
  await page.waitForTimeout(400);
}

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await askExecutiveChat(page, "Show Capacity.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Capacity"),
);
const capacityFocus = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-focus.png") });

await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
await page.waitForSelector('[data-testid="nexora-theatre-comparison"]', { timeout: 15000 });
const comparison = await snapshot(page);
await page.screenshot({ path: join(out, "comparison.png") });

await page.locator('[data-testid="nexora-theatre-comparison-deeper"]').click({ timeout: 3000 }).catch(() => null);
await page.waitForTimeout(300);
await page.mouse.click(430, 430);
await page.waitForTimeout(500);
await openView(page, "report");
const comparisonDetails = await snapshot(page);
await page.screenshot({ path: join(out, "comparison-details.png") });

const chartTurn = await askExecutiveChat(page, "Show chart.");
await page.waitForTimeout(800);
const comparisonChart = await snapshot(page);
await page.screenshot({ path: join(out, "comparison-chart.png") });

await openView(page, "operation");
const comparisonActions = await snapshot(page);
await page.screenshot({ path: join(out, "comparison-actions.png") });

const chromeClicked = await page.evaluate(() => {
  const view = document.querySelector('[data-testid="nexora-presentation-state-selector"]');
  return Boolean(view);
});

await page.locator('[data-testid="nexora-stage-object-control-obj-capacity"], [data-testid^="nexora-stage-object-control-"]').first().click({ timeout: 4000 }).catch(() => null);
await page.waitForTimeout(300);
const objectClick = await snapshot(page);

await openView(page, "minimum");
await askExecutiveChat(page, "Show Capacity.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Capacity"),
);
const recovered = await snapshot(page);
await page.screenshot({ path: join(out, "post-comparison.png") });

await openView(page, "report");
const recoveredDetails = await snapshot(page);

const gates = {
  gComparison:
    comparison.comparison === true &&
    comparison.comparisonSlot === "comparison" &&
    Number(comparison.comparisonCandidates ?? 0) >= 2,
  gObjectOrientation: comparison.majorSurfaces.includes("Object"),
  gNoStatusCard:
    capacityFocus.statusCard === false &&
    comparison.statusCard === false &&
    recovered.statusCard === false,
  gDetailsCoexist:
    comparisonDetails.comparison === true &&
    comparisonDetails.collisions.comparisonReport === false &&
    (comparisonDetails.report === true ||
      (comparisonDetails.focused === "none" && comparisonDetails.report === false)),
  gChartRule:
    comparisonChart.collisions.comparisonChart === false &&
    (comparisonChart.comparison === true),
  gActions:
    comparisonActions.comparison === true &&
    comparisonActions.collisions.comparisonActions === false &&
    (comparisonActions.actions === true ||
      (comparisonActions.focused === "none" && comparisonActions.actions === false)),
  gRecovery:
    recovered.comparison === false &&
    recoveredDetails.report === true &&
    recoveredDetails.presentation === "report",
  gChrome: chromeClicked === true && comparison.viewVisible === true,
  gCamera:
    comparison.cameraMode === "fixed-executive-perspective" &&
    comparison.cameraFixed === "true",
  gZeroPageErrors: errors.length === 0,
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:5/Dth7ComparisonPlacementIntegration",
  url,
  errors,
  capacityFocus,
  comparison,
  comparisonDetails,
  comparisonChart,
  chartTurn: chartTurn.last ?? null,
  comparisonActions,
  objectClick,
  recovered,
  recoveredDetails,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:5 live ok" : "STAGE-COMPOSITION:5 live FAIL");
console.log(JSON.stringify({
  gates,
  comparison: {
    id: comparison.comparisonId,
    major: comparison.majorSurfaces,
    collisions: comparison.collisions,
  },
  details: comparisonDetails.majorSurfaces,
  chart: comparisonChart.majorSurfaces,
  actions: comparisonActions.majorSurfaces,
  recovered: recovered.majorSurfaces,
  recoveredDetails: recoveredDetails.majorSurfaces,
  errors,
}, null, 2));
process.exit(ok ? 0 : 1);
