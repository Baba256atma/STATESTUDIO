/**
 * STAGE-COMPOSITION:6 live chart/ACTIONS lifecycle proof.
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

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const selector = document.querySelector('[data-testid="nexora-presentation-state-selector"]');
    const chart = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    const comparison = document.querySelector('[data-testid="nexora-theatre-comparison"]');
    const statusCard =
      document.querySelector('[data-testid="nexora-stage-contextual-visual"]')?.getAttribute(
        "data-stage-visual-family",
      ) === "STATUS_CARD";
    const object = document.querySelector("[data-testid^='nexora-stage-object-control-']");
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      presentation: selector?.getAttribute("data-active-presentation") ?? null,
      applicationPresentation: shell?.getAttribute("data-presentation-state") ?? null,
      focused: shell?.getAttribute("data-focused-subject") ?? null,
      routeStatus: shell?.getAttribute("data-cei2-route-status") ?? null,
      nexoFamily: shell?.getAttribute("data-cei2-nexo-family") ?? null,
      dirVi: shell?.getAttribute("data-cei2-dir-vi") ?? null,
      routeSubject: shell?.getAttribute("data-cei2-subject") ?? null,
      report: Boolean(document.querySelector('[data-testid="nexora-subject-report"]')),
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      chart: chart?.getAttribute("data-visual-representation") ?? null,
      object: Boolean(object),
      comparison: Boolean(comparison),
      comparisonSlot: comparison?.getAttribute("data-stage-overlay-slot") ?? null,
      statusCard,
      advisor:
        document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.replace(/\s+/g, " ").trim() ??
        null,
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

async function focusSubject(page, utterance, id) {
  await askExecutiveChat(page, utterance);
  await page.waitForFunction(
    (subjectId) =>
      document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ===
      subjectId,
    id,
    { timeout: 20000 },
  );
}

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await focusSubject(page, "Show me Inventory.", "obj-inventory");
await openView(page, "operation");
const inventoryActions = await snapshot(page);
await page.screenshot({ path: join(out, "inventory-actions.png") });

const showChartTurn = await askExecutiveChat(page, "Show me a chart.");
await page.waitForTimeout(800);
const inventoryChart = await snapshot(page);
await page.screenshot({ path: join(out, "inventory-chart.png") });

await openView(page, "operation");
const reopened = await snapshot(page);
await page.screenshot({ path: join(out, "chart-reopen-actions.png") });

const barTurn = await askExecutiveChat(page, "Bar chart.");
await page.waitForTimeout(800);
const barAfterReopen = await snapshot(page);
await page.screenshot({ path: join(out, "bar-refinement.png") });

await openView(page, "operation");
const failedRefinementTurn = await askExecutiveChat(page, "Show Capacity chart.");
await page.waitForTimeout(800);
const failedRefinement = await snapshot(page);
await page.screenshot({ path: join(out, "failed-refinement.png") });

await openView(page, "minimum");
await focusSubject(page, "Show me Inventory.", "obj-inventory");
await openView(page, "operation");
const barDirectTurn = await askExecutiveChat(page, "Bar chart.");
await page.waitForTimeout(800);
const inventoryBar = await snapshot(page);
await page.screenshot({ path: join(out, "inventory-bar.png") });

await page.locator('[data-testid="nexora-evidence-visual-dismiss"]').click({ timeout: 4000 }).catch(() => null);
await page.waitForTimeout(400);
const afterDismiss = await snapshot(page);
await page.screenshot({ path: join(out, "chart-close.png") });

await focusSubject(page, "Show me Inventory.", "obj-inventory");
await openView(page, "report");
const detailsBefore = await snapshot(page);
const detailsChartTurn = await askExecutiveChat(page, "Show me a chart.");
await page.waitForTimeout(800);
const detailsChart = await snapshot(page);
await page.screenshot({ path: join(out, "details-chart.png") });

await openView(page, "minimum");
await focusSubject(page, "Show me Capacity.", "obj-capacity");
await openView(page, "operation");
const capacityActions = await snapshot(page);
const capacityChartTurn = await askExecutiveChat(page, "Show me a chart.");
await page.waitForTimeout(800);
const capacityFailed = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-failed-chart.png") });

const clarifyTurn = await askExecutiveChat(page, "Compare these values.");
await page.waitForTimeout(600);
const capacityClarify = await snapshot(page);

const crossTurn = await askExecutiveChat(page, "Show Inventory chart.");
await page.waitForTimeout(800);
const crossSubject = await snapshot(page);
await page.screenshot({ path: join(out, "cross-subject.png") });

await openView(page, "minimum");
await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
await page.waitForSelector('[data-testid="nexora-theatre-comparison"]', { timeout: 15000 }).catch(() => null);
const comparison = await snapshot(page);
await openView(page, "operation");
const comparisonActions = await snapshot(page);
const comparisonChartTurn = await askExecutiveChat(page, "Show chart.");
await page.waitForTimeout(800);
const comparisonChart = await snapshot(page);
await page.screenshot({ path: join(out, "dth7-chart.png") });

await page.locator('[data-testid="nexora-stage-back"], [data-testid="nexora-presentation-back"]').first().click({ timeout: 3000 }).catch(() => null);
await page.waitForTimeout(300);
const afterBack = await snapshot(page);
await page.locator('[data-testid="nexora-stage-forward"], [data-testid="nexora-presentation-forward"]').first().click({ timeout: 3000 }).catch(() => null);
await page.waitForTimeout(300);
const afterForward = await snapshot(page);
await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-stage-overview"], [data-testid="nexora-presentation-overview"]')?.click();
});
await page.waitForTimeout(400);
const afterOverview = await snapshot(page);

const gates = {
  gInventoryActions:
    inventoryActions.focused === "obj-inventory" &&
    inventoryActions.presentation === "operation" &&
    inventoryActions.applicationPresentation === "operation" &&
    inventoryActions.actions === true &&
    inventoryActions.report === false,
  gInventoryChart:
    inventoryChart.focused === "obj-inventory" &&
    inventoryChart.chart === "TREND_LINE" &&
    inventoryChart.nexoFamily === "NexoTime" &&
    inventoryChart.routeStatus === "renderable" &&
    inventoryChart.actions === false &&
    inventoryChart.presentation !== "operation" &&
    inventoryChart.applicationPresentation !== "operation" &&
    inventoryChart.report === false &&
    inventoryChart.object === true &&
    inventoryChart.statusCard === false,
  gReopen:
    reopened.actions === true &&
    reopened.presentation === "operation" &&
    (reopened.chart === "TREND_LINE" || reopened.dirVi === "TREND_LINE"),
  gBarRefinement:
    barAfterReopen.chart === "COMPARISON_BARS" &&
    barAfterReopen.actions === false &&
    barAfterReopen.presentation !== "operation",
  gFailedRefinement: failedRefinement.actions === true,
  gInventoryBar:
    inventoryBar.chart === "COMPARISON_BARS" &&
    inventoryBar.actions === false &&
    inventoryBar.focused === "obj-inventory",
  gChartClose:
    afterDismiss.actions === false &&
    afterDismiss.presentation !== "operation",
  gDetailsChart:
    detailsChart.report === true &&
    detailsChart.presentation === "report" &&
    detailsChart.actions === false &&
    (detailsChart.chart === "TREND_LINE" || detailsChart.dirVi === "TREND_LINE"),
  gCapacityFailed:
    capacityFailed.focused === "obj-capacity" &&
    capacityFailed.actions === true &&
    capacityFailed.presentation === "operation" &&
    capacityFailed.chart == null &&
    (capacityFailed.routeStatus === "none" || capacityFailed.dirVi === "none"),
  gClarify: capacityClarify.actions === true && capacityClarify.presentation === "operation",
  gCross:
    crossSubject.actions === false &&
    crossSubject.presentation !== "operation" &&
    (crossSubject.chart === "TREND_LINE" || crossSubject.routeSubject === "obj-inventory"),
  gDth7:
    comparison.comparison === true &&
    comparison.comparisonSlot === "comparison" &&
    comparisonChart.comparisonSlot === "comparison",
  gNav: afterOverview.presentation !== "operation" || afterOverview.actions === false,
  gCamera:
    inventoryChart.cameraMode === "fixed-executive-perspective" &&
    inventoryChart.cameraFixed === "true",
  gZeroPageErrors: errors.length === 0,
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:6/ChartRequestActionsLifecycle",
  url,
  errors,
  inventoryActions,
  showChartTurn: showChartTurn.last ?? null,
  inventoryChart,
  reopened,
  barTurn: barTurn.last ?? null,
  barAfterReopen,
  failedRefinementTurn: failedRefinementTurn.last ?? null,
  failedRefinement,
  barDirectTurn: barDirectTurn.last ?? null,
  inventoryBar,
  afterDismiss,
  detailsBefore,
  detailsChartTurn: detailsChartTurn.last ?? null,
  detailsChart,
  capacityActions,
  capacityChartTurn: capacityChartTurn.last ?? null,
  capacityFailed,
  clarifyTurn: clarifyTurn.last ?? null,
  capacityClarify,
  crossTurn: crossTurn.last ?? null,
  crossSubject,
  comparison,
  comparisonActions,
  comparisonChartTurn: comparisonChartTurn.last ?? null,
  comparisonChart,
  afterBack,
  afterForward,
  afterOverview,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:6 live ok" : "STAGE-COMPOSITION:6 live FAIL");
console.log(JSON.stringify({
  gates,
  inventoryActions: {
    presentation: inventoryActions.presentation,
    actions: inventoryActions.actions,
  },
  inventoryChart: {
    presentation: inventoryChart.presentation,
    application: inventoryChart.applicationPresentation,
    chart: inventoryChart.chart,
    route: inventoryChart.routeStatus,
    family: inventoryChart.nexoFamily,
    actions: inventoryChart.actions,
    report: inventoryChart.report,
  },
  reopened: { presentation: reopened.presentation, actions: reopened.actions, chart: reopened.chart },
  bar: { chart: barAfterReopen.chart, actions: barAfterReopen.actions },
  capacityFailed: {
    presentation: capacityFailed.presentation,
    actions: capacityFailed.actions,
    chart: capacityFailed.chart,
    dirVi: capacityFailed.dirVi,
  },
  detailsChart: {
    presentation: detailsChart.presentation,
    report: detailsChart.report,
    chart: detailsChart.chart,
  },
  cross: { presentation: crossSubject.presentation, chart: crossSubject.chart, focused: crossSubject.focused },
  dth7: { slot: comparison.comparisonSlot, after: comparisonChart.comparisonSlot },
  errors,
}, null, 2));
process.exit(ok ? 0 : 1);
