/**
 * STAGE-COMPOSITION:1-FIX3 live ACTIONS + camera + composition proof.
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
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const selector = document.querySelector('[data-testid="nexora-presentation-state-selector"]');
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      cameraContract: stage?.getAttribute("data-stage-camera-contract") ?? null,
      azimuth: stage?.getAttribute("data-stage-camera-azimuth") ?? null,
      elevation: stage?.getAttribute("data-stage-camera-elevation") ?? null,
      distance: stage?.getAttribute("data-stage-camera-distance") ?? null,
      target: stage?.getAttribute("data-stage-camera-target") ?? null,
      depth: stage?.getAttribute("data-stage-depth") ?? null,
      positionMode: stage?.getAttribute("data-stage-position-mode") ?? null,
      presentation: selector?.getAttribute("data-active-presentation") ?? null,
      object: Boolean(document.querySelector('[data-testid="nexora-right-object"]') || document.querySelector('[data-testid="nexora-selected-object"]')),
      report: Boolean(document.querySelector('[data-testid="nexora-subject-report"]')),
      sceneEvidence: Boolean(document.querySelector('[data-testid="nexora-evidence-visual-view"]')),
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      actionTitle:
        document.querySelector('[data-testid="nexora-subject-operation-title"]')?.textContent?.trim() ??
        null,
      advisor:
        document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.replace(/\s+/g, " ").trim() ??
        null,
      focused: document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ?? null,
    };
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await askExecutiveChat(page, "Show Capacity.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Capacity"),
);

await page.evaluate(() => {
  const disclosure = document.querySelector('[data-testid="nexora-presentation-disclosure"]');
  if (disclosure && !disclosure.open) disclosure.open = true;
  document.querySelector('[data-testid="nexora-presentation-option-operation"]')?.click();
});
await page.waitForTimeout(300);
const afterActions = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-actions.png") });

await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-subject-action-act-capacity-problem"]')?.click();
});
await page.waitForTimeout(500);
const afterInvestigate = await snapshot(page);
await page.screenshot({ path: join(out, "investigate-problem.png") });

await page.evaluate(() => {
  const disclosure = document.querySelector('[data-testid="nexora-presentation-disclosure"]');
  if (disclosure && !disclosure.open) disclosure.open = true;
  document.querySelector('[data-testid="nexora-presentation-option-operation"]')?.click();
});
await page.waitForTimeout(300);
const afterReopen = await snapshot(page);

await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-stage-reset"]')?.click();
});
await page.waitForTimeout(400);
const afterOverview = await snapshot(page);
await page.screenshot({ path: join(out, "overview.png") });

const cameraKeys = ["cameraMode", "cameraFixed", "azimuth", "elevation", "distance", "target"];
const poses = [afterActions, afterInvestigate, afterReopen, afterOverview];
const cameraStable = poses.every((pose) =>
  cameraKeys.every((key) => pose[key] === afterActions[key]),
);

const gActionsOpen = afterActions.actions === true && afterActions.presentation === "operation";
const gInvestigate =
  afterInvestigate.actions === false &&
  afterInvestigate.presentation !== "operation" &&
  /Capacity Gap/i.test(`${afterInvestigate.advisor} ${afterInvestigate.focused} ${afterInvestigate.actionTitle}`);
const gReopen = afterReopen.actions === true && afterReopen.presentation === "operation";
const gOverview = afterOverview.actions === false && afterOverview.presentation !== "operation";
const gCamera =
  afterActions.cameraMode === "fixed-executive-perspective" &&
  afterActions.cameraFixed === "true" &&
  cameraStable;

const report = {
  identity: "NPA-T STAGE-COMPOSITION:1-FIX3/TypecheckFailureClassification",
  url,
  afterActions,
  afterInvestigate,
  afterReopen,
  afterOverview,
  cameraStable,
  composition: {
    beforeAction: {
      report: afterActions.report,
      sceneEvidence: afterActions.sceneEvidence,
      actions: afterActions.actions,
    },
    afterAction: {
      focused: afterInvestigate.focused,
      advisor: afterInvestigate.advisor,
      report: afterInvestigate.report,
      sceneEvidence: afterInvestigate.sceneEvidence,
      actions: afterInvestigate.actions,
    },
  },
  gates: { gActionsOpen, gInvestigate, gReopen, gOverview, gCamera },
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = gActionsOpen && gInvestigate && gReopen && gOverview && gCamera;
console.log(ok ? "STAGE-COMPOSITION:1-FIX3 live ok" : "STAGE-COMPOSITION:1-FIX3 live FAIL");
console.log(JSON.stringify({ gates: report.gates, composition: report.composition }, null, 2));
process.exit(ok ? 0 : 1);
