/**
 * STAGE-COMPOSITION:4 live Report vs textual STATUS_CARD proof.
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
    const text = (selector) =>
      document.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const report = document.querySelector('[data-testid="nexora-subject-report"]');
    const kpi = document.querySelector('[data-testid="nexora-subject-report-kpi"]');
    const visual = document.querySelector('[data-testid="nexora-stage-contextual-visual"]');
    const chart = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const inspect = document.querySelector('[data-testid="nexora-theatre-investigation-source"]');
    const visualInspect = document.querySelector('[data-testid="nexora-stage-visual-inspection"]');
    const major = [];
    if (document.querySelector("[data-testid^='nexora-stage-object-control-']")) major.push("Object");
    if (report) major.push("Report");
    if (document.querySelector('[data-testid="nexora-subject-operation"]')) major.push("ACTIONS");
    if (visual?.getAttribute("data-stage-visual-family") === "STATUS_CARD") major.push("STATUS_CARD");
    if (chart && visual?.getAttribute("data-stage-visual-family") !== "STATUS_CARD") {
      major.push(visual?.getAttribute("data-stage-visual-family") === "COMPARISON" ? "Comparison" : "Chart");
    }
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      presentation:
        document.querySelector('[data-testid="nexora-presentation-state-selector"]')
          ?.getAttribute("data-active-presentation") ?? null,
      focused:
        document.querySelector('[data-testid="nexora-executive-shell"]')
          ?.getAttribute("data-focused-subject") ?? null,
      report: Boolean(report),
      reportTitle: text('[data-testid="nexora-subject-report-title"]'),
      reportKpi: text('[data-testid="nexora-subject-report-kpi"]'),
      reportKpiProvenance:
        kpi?.getAttribute("data-kpi-provenance") ??
        text('[data-testid="nexora-subject-report-kpi-provenance"]'),
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      statusCard: visual?.getAttribute("data-stage-visual-family") === "STATUS_CARD",
      contextualVisualFamily: visual?.getAttribute("data-stage-visual-family") ?? null,
      sceneEvidenceLabel: text('[data-testid="nexora-stage-contextual-visual"]'),
      chart: chart?.getAttribute("data-visual-representation") ?? null,
      chartSource: text('[data-testid="nexora-evidence-visual-view"]'),
      visualInspection: Boolean(visualInspect),
      advisorSubject: text('[data-testid="nexora-advisor-view-subject"]'),
      advisorSituation: text('[data-testid="nexora-advisor-situation"]'),
      advisorEvidence: text('[data-testid="nexora-advisor-evidence"]'),
      selectedObject: Boolean(investigation),
      selectedObjectText: investigation?.textContent?.replace(/\s+/g, " ").trim().slice(0, 400) ?? null,
      inspectSource: Boolean(inspect),
      inspectSourceText: inspect?.textContent?.replace(/\s+/g, " ").trim().slice(0, 280) ?? null,
      majorSurfaces: major,
    };
  });
}

async function openView(page, state) {
  await page.evaluate((nextState) => {
    const disclosure = document.querySelector('[data-testid="nexora-presentation-disclosure"]');
    if (disclosure && !disclosure.open) disclosure.open = true;
    document.querySelector(`[data-testid="nexora-presentation-option-${nextState}"]`)?.click();
  }, state);
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

await page.locator('[data-testid="nexora-right-package-tab-obj-capacity"]').click({ timeout: 8000 }).catch(() => null);
await page.waitForTimeout(400);
const selectedObject = await snapshot(page);
await page.screenshot({ path: join(out, "selected-object.png") });

await page.locator('[data-testid="executive-advisor-tab-assist"]').click({ timeout: 5000 }).catch(() => null);
await page.waitForTimeout(300);
const advisor = await snapshot(page);

await openView(page, "report");
const capacityDetails = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-details.png") });

await openView(page, "operation");
const capacityActions = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-actions.png") });

await openView(page, "minimum");
await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-subject-action-act-capacity-problem"]')?.click();
});
await page.waitForTimeout(600);
const afterInvestigate = await snapshot(page);
await page.screenshot({ path: join(out, "investigate-problem.png") });

await askExecutiveChat(page, "Show Inventory.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Inventory"),
);
const inventoryFocus = await snapshot(page);
const chartTurn = await askExecutiveChat(page, "Show chart.");
await page.waitForTimeout(900);
const inventoryChart = await snapshot(page);
await page.screenshot({ path: join(out, "inventory-chart.png") });

const barTurn = await askExecutiveChat(page, "Bar chart.");
await page.waitForTimeout(900);
const barChart = await snapshot(page);
await page.screenshot({ path: join(out, "inventory-bars.png") });

const pendingTurn = await askExecutiveChat(page, "What data is pending review?");

const gates = {
  gFocusObjectFirst:
    capacityFocus.presentation === "minimum" &&
    capacityFocus.report === false &&
    capacityFocus.actions === false &&
    capacityFocus.statusCard === false,
  gDetails:
    capacityDetails.presentation === "report" &&
    capacityDetails.report === true &&
    capacityDetails.actions === false &&
    capacityDetails.statusCard === false,
  gDetailsProvenance:
    capacityDetails.reportKpiProvenance === "presentation-fixture" ||
    /Presentation baseline/.test(capacityDetails.reportKpiProvenance ?? ""),
  gActions:
    capacityActions.presentation === "operation" &&
    capacityActions.actions === true &&
    capacityActions.report === false &&
    capacityActions.statusCard === false,
  gDiscoverability:
    /enough evidence|Evidence limited|limited|unknown|Inspect source/i.test(
      `${selectedObject.selectedObjectText ?? ""} ${selectedObject.inspectSourceText ?? ""} ${advisor.advisorEvidence ?? ""} ${advisor.advisorSituation ?? ""}`,
    ),
  gInventoryChart:
    inventoryChart.chart === "TREND_LINE" &&
    inventoryChart.statusCard !== true &&
    /80|95|88|72|67|74/.test(inventoryChart.chartSource ?? ""),
  gBarChart:
    (barChart.chart === "COMPARISON_BARS" || barChart.chart === "TREND_LINE") &&
    barChart.statusCard !== true,
  gCamera:
    capacityFocus.cameraMode === "fixed-executive-perspective" &&
    capacityFocus.cameraFixed === "true",
  gZeroPageErrors: errors.length === 0,
  gPendingNotAccepted:
    !/current data confirms/i.test(pendingTurn.last ?? "") ||
    /pending review/i.test(pendingTurn.last ?? ""),
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:4/ReportSceneEvidenceResponsibilitySeparation",
  url,
  errors,
  capacityFocus,
  selectedObject,
  advisor,
  capacityDetails,
  capacityActions,
  afterInvestigate,
  inventoryFocus,
  inventoryChart,
  chartTurn: chartTurn.last ?? null,
  barChart,
  barTurn: barTurn.last ?? null,
  pending: pendingTurn.last ?? null,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:4 live ok" : "STAGE-COMPOSITION:4 live FAIL");
console.log(JSON.stringify({ gates, capacityFocus: {
  major: capacityFocus.majorSurfaces,
  statusCard: capacityFocus.statusCard,
  presentation: capacityFocus.presentation,
}, details: capacityDetails.majorSurfaces, actions: capacityActions.majorSurfaces,
  chart: inventoryChart.chart, discover: {
    selected: selectedObject.selectedObjectText,
    inspect: selectedObject.inspectSourceText,
    advisorEvidence: advisor.advisorEvidence,
  }, errors }, null, 2));
process.exit(ok ? 0 : 1);
