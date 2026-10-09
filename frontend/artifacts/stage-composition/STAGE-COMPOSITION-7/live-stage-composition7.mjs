/**
 * STAGE-COMPOSITION:7 live cross-subject visual focus proof.
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
    const selectedObject =
      document.querySelector('[data-testid="nexora-right-package-canonical-id"]') ??
      document.querySelector('[data-testid="nexora-right-package-title"]');
    const statusCard =
      document.querySelector('[data-testid="nexora-stage-contextual-visual"]')?.getAttribute(
        "data-stage-visual-family",
      ) === "STATUS_CARD";
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      presentation: selector?.getAttribute("data-active-presentation") ?? null,
      applicationPresentation: shell?.getAttribute("data-presentation-state") ?? null,
      focused: shell?.getAttribute("data-focused-subject") ?? null,
      selected: shell?.getAttribute("data-selected-subject") ?? null,
      routeStatus: shell?.getAttribute("data-cei2-route-status") ?? null,
      nexoFamily: shell?.getAttribute("data-cei2-nexo-family") ?? null,
      dirVi: shell?.getAttribute("data-cei2-dir-vi") ?? null,
      routeSubject: shell?.getAttribute("data-cei2-subject") ?? null,
      report: Boolean(document.querySelector('[data-testid="nexora-subject-report"]')),
      reportTitle:
        document.querySelector('[data-testid="nexora-subject-report-title"]')?.textContent?.trim() ??
        null,
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      chart: chart?.getAttribute("data-visual-representation") ?? null,
      comparisonSlot: comparison?.getAttribute("data-stage-overlay-slot") ?? null,
      statusCard,
      advisor:
        document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.replace(/\s+/g, " ").trim() ??
        null,
      selectedObject: selectedObject?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) ?? null,
      mlevel:
        shell?.getAttribute("data-nmi-l1") ??
        document.querySelector("[data-nmi-l1]")?.getAttribute("data-nmi-l1") ??
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

await focusSubject(page, "Show me Capacity.", "obj-capacity");
const capacityBefore = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-before.png") });

const crossTurn = await askExecutiveChat(page, "Show Inventory chart.");
await page.waitForTimeout(900);
const crossAfter = await snapshot(page);
await page.screenshot({ path: join(out, "cross-subject-inventory-chart.png") });

const backClicked = await page.locator('[data-testid="nexora-stage-step-back"]').first().click({ timeout: 4000 }).then(() => true).catch(() => false);
await page.waitForTimeout(400);
const afterBack = await snapshot(page);
const forwardClicked = await page.locator('[data-testid="nexora-stage-step-forward"]').first().click({ timeout: 4000 }).then(() => true).catch(() => false);
await page.waitForTimeout(400);
const afterForward = await snapshot(page);

await focusSubject(page, "Show me Capacity.", "obj-capacity");
await openView(page, "operation");
const capacityActions = await snapshot(page);
const actionsCrossTurn = await askExecutiveChat(page, "Show Inventory chart.");
await page.waitForTimeout(900);
const actionsCross = await snapshot(page);
await page.screenshot({ path: join(out, "actions-cross-subject.png") });

await focusSubject(page, "Show me Inventory.", "obj-inventory");
const unsupportedTurn = await askExecutiveChat(page, "Show Capacity chart.");
await page.waitForTimeout(800);
const unsupported = await snapshot(page);
await page.screenshot({ path: join(out, "unsupported-capacity-chart.png") });

const sameChartTurn = await askExecutiveChat(page, "Show me a chart.");
await page.waitForTimeout(800);
const sameSubject = await snapshot(page);
await page.screenshot({ path: join(out, "same-subject-chart.png") });

const barTurn = await askExecutiveChat(page, "Bar chart.");
await page.waitForTimeout(800);
const refined = await snapshot(page);
await page.screenshot({ path: join(out, "refinement-bars.png") });

await focusSubject(page, "Show me Capacity.", "obj-capacity");
const stale = await snapshot(page);
await page.screenshot({ path: join(out, "stale-after-capacity.png") });

await focusSubject(page, "Show me Inventory.", "obj-inventory");
await openView(page, "report");
const details = await snapshot(page);
await focusSubject(page, "Show me Capacity.", "obj-capacity");
await openView(page, "report");
const detailsThenCrossTurn = await askExecutiveChat(page, "Show Inventory chart.");
await page.waitForTimeout(900);
const detailsCross = await snapshot(page);
await page.screenshot({ path: join(out, "details-cross-subject.png") });

await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
await page.waitForSelector('[data-testid="nexora-theatre-comparison"]', { timeout: 15000 }).catch(() => null);
const comparison = await snapshot(page);
await page.screenshot({ path: join(out, "dth7.png") });

const gates = {
  gCross:
    capacityBefore.focused === "obj-capacity" &&
    crossAfter.focused === "obj-inventory" &&
    crossAfter.chart === "TREND_LINE" &&
    crossAfter.routeSubject === "obj-inventory" &&
    crossAfter.routeStatus === "renderable" &&
    /inventory/i.test(crossAfter.advisor ?? "") &&
    (crossAfter.selected === "obj-inventory" ||
      /obj-inventory|inventory/i.test(crossAfter.selectedObject ?? "")),
  gActionsCross:
    capacityActions.actions === true &&
    actionsCross.focused === "obj-inventory" &&
    actionsCross.chart === "TREND_LINE" &&
    actionsCross.actions === false &&
    actionsCross.presentation !== "operation",
  gUnsupported:
    unsupported.focused === "obj-inventory" &&
    unsupported.chart == null &&
    (unsupported.dirVi === "none" || unsupported.routeStatus === "none"),
  gSameSubject:
    sameSubject.focused === "obj-inventory" &&
    sameSubject.chart === "TREND_LINE",
  gRefine:
    refined.focused === "obj-inventory" &&
    refined.chart === "COMPARISON_BARS",
  gStale:
    stale.focused === "obj-capacity" &&
    stale.chart == null,
  gDetails:
    details.report === true &&
    detailsCross.focused === "obj-inventory" &&
    detailsCross.chart === "TREND_LINE" &&
    detailsCross.report === true,
  gHistory:
    backClicked === true &&
    afterBack.focused === "obj-capacity" &&
    forwardClicked === true &&
    afterForward.focused === "obj-inventory",
  gDth7: comparison.comparisonSlot === "comparison",
  gCamera:
    crossAfter.cameraMode === "fixed-executive-perspective" &&
    crossAfter.cameraFixed === "true",
  gNoStatusCard:
    crossAfter.statusCard === false &&
    stale.statusCard === false &&
    comparison.statusCard === false,
  gZeroPageErrors: errors.length === 0,
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:7/CrossSubjectVisualFocus",
  url,
  errors,
  capacityBefore,
  crossTurn: crossTurn.last ?? null,
  crossAfter,
  capacityActions,
  actionsCrossTurn: actionsCrossTurn.last ?? null,
  actionsCross,
  unsupportedTurn: unsupportedTurn.last ?? null,
  unsupported,
  sameChartTurn: sameChartTurn.last ?? null,
  sameSubject,
  barTurn: barTurn.last ?? null,
  refined,
  stale,
  details,
  detailsThenCrossTurn: detailsThenCrossTurn.last ?? null,
  detailsCross,
  backClicked,
  afterBack,
  forwardClicked,
  afterForward,
  comparison,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:7 live ok" : "STAGE-COMPOSITION:7 live FAIL");
console.log(JSON.stringify({
  gates,
  cross: {
    before: capacityBefore.focused,
    after: crossAfter.focused,
    chart: crossAfter.chart,
    route: crossAfter.routeSubject,
    advisor: crossAfter.advisor,
    presentation: crossAfter.presentation,
  },
  actionsCross: {
    focused: actionsCross.focused,
    chart: actionsCross.chart,
    actions: actionsCross.actions,
    presentation: actionsCross.presentation,
  },
  unsupported: { focused: unsupported.focused, chart: unsupported.chart },
  stale: { focused: stale.focused, chart: stale.chart },
  detailsCross: {
    focused: detailsCross.focused,
    report: detailsCross.report,
    chart: detailsCross.chart,
  },
  history: { back: afterBack.focused, forward: afterForward.focused },
  errors,
}, null, 2));
process.exit(ok ? 0 : 1);
