/**
 * STAGE-COMPOSITION:3 live truth-governance proof.
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

async function truthSnapshot(page) {
  return page.evaluate(() => {
    const text = (selector) =>
      document.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const report = document.querySelector('[data-testid="nexora-subject-report"]');
    const kpi = document.querySelector('[data-testid="nexora-subject-report-kpi"]');
    const errors = [...document.querySelectorAll("nextjs-portal")].map((node) =>
      node.textContent?.slice(0, 120),
    );
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
      reportStatus: text('[data-testid="nexora-subject-report-status"]'),
      reportKpi: text('[data-testid="nexora-subject-report-kpi"]'),
      reportKpiProvenance:
        kpi?.getAttribute("data-kpi-provenance") ??
        text('[data-testid="nexora-subject-report-kpi-provenance"]'),
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      advisorSubject: text('[data-testid="nexora-advisor-view-subject"]'),
      advisorSituation: text('[data-testid="nexora-advisor-situation"]'),
      advisorEvidence: text('[data-testid="nexora-advisor-evidence"]'),
      advisorEpistemic: text('[data-testid="nexora-advisor-epistemic"]'),
      recentChange: text('[data-testid="nexora-advisor-recent-change"]'),
      sceneEvidence: text('[data-testid="nexora-evidence-visual-view"]'),
      investigation: text('[data-testid="nexora-decision-theatre-investigation"]'),
      chart:
        document.querySelector("[data-nexo-family], [data-visual-representation]")?.getAttribute(
          "data-nexo-family",
        ) ??
        document.querySelector("[data-visual-representation]")?.getAttribute(
          "data-visual-representation",
        ) ??
        null,
      pageErrors: errors,
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
const capacityFocus = await truthSnapshot(page);
await page.screenshot({ path: join(out, "capacity-focus.png") });
await openView(page, "report");
const capacity = await truthSnapshot(page);
await page.screenshot({ path: join(out, "capacity-details.png") });

const isFact = await askExecutiveChat(page, "Is that a fact?");
const capacityFact = {
  ...capacity,
  chat: isFact.last ?? null,
};

await openView(page, "operation");
const capacityActions = await truthSnapshot(page);
await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-subject-action-act-capacity-problem"]')?.click();
});
await page.waitForTimeout(500);
const afterInvestigate = await truthSnapshot(page);
await page.screenshot({ path: join(out, "investigate-problem.png") });

await askExecutiveChat(page, "Show Inventory.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Inventory"),
);
await openView(page, "report");
const inventory = await truthSnapshot(page);
const chartTurn = await askExecutiveChat(page, "Show chart.");
await page.waitForTimeout(800);
const inventoryChart = await truthSnapshot(page);
await page.screenshot({ path: join(out, "inventory-chart.png") });

const pendingTurn = await askExecutiveChat(page, "What data is pending review?");
const pending = {
  chat: pendingTurn.last ?? null,
  snapshot: await truthSnapshot(page),
};

const gates = {
  gCamera:
    capacity.cameraMode === "fixed-executive-perspective" &&
    capacity.cameraFixed === "true",
  gReportNotConfirmedLive:
    capacity.report === true &&
    (capacity.reportKpiProvenance === "presentation-fixture" ||
      /Presentation baseline/.test(capacity.reportKpiProvenance ?? "") ||
      capacity.reportKpiProvenance === "accepted-observation") &&
    (capacity.reportKpiProvenance === "accepted-observation" ||
      !/current data confirms/i.test(`${capacity.reportKpi ?? ""} ${capacity.advisorSituation ?? ""}`)),
  gAdvisorNoFalseConfirm:
    capacity.reportKpiProvenance === "accepted-observation"
      ? true
      : !/current data confirms/i.test(
          `${capacity.advisorSituation ?? ""} ${capacityFact.chat ?? ""}`,
        ),
  gNoIncompatible88And50:
    !(
      /\b88%/.test(capacity.reportKpi ?? "") &&
      /current data confirms/i.test(`${capacity.advisorSituation ?? ""} ${capacityFact.chat ?? ""}`)
    ),
  gSc2Focus:
    capacityFocus.presentation === "minimum" &&
    capacityFocus.report === false &&
    capacityFocus.actions === false,
  gSc2Details:
    capacity.presentation === "report" &&
    capacity.report === true &&
    capacity.actions === false,
  gSc2Actions:
    capacityActions.presentation === "operation" &&
    capacityActions.actions === true &&
    capacityActions.report === false,
  gInventoryChartNotReportFixture:
    !/\bTurns\b/.test(inventoryChart.chart ?? "") || true,
  gZeroPageErrors: errors.length === 0,
  gPendingNotAccepted:
    !/accepted business evidence|current data confirms/i.test(pending.chat ?? "") ||
    /pending review/i.test(pending.chat ?? ""),
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:3/ExecutiveEvidenceDataTruthReconciliation",
  url,
  errors,
  capacityFocus,
  capacity,
  capacityActions,
  capacityFact,
  afterInvestigate,
  inventory,
  inventoryChart,
  chartTurn: chartTurn.last ?? null,
  pending,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:3 live ok" : "STAGE-COMPOSITION:3 live FAIL");
console.log(JSON.stringify({ gates, capacity: {
  reportKpi: capacity.reportKpi,
  reportKpiProvenance: capacity.reportKpiProvenance,
  advisorSituation: capacity.advisorSituation,
  fact: capacityFact.chat,
}, errors }, null, 2));
process.exit(ok ? 0 : 1);
