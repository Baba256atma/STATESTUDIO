/**
 * STAGE-COMPOSITION:2 live object-first Report/ACTIONS activation proof.
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
    const objects = [...document.querySelectorAll("[data-canonical-id], [data-object-id]")].map(
      (node) => node.getAttribute("data-canonical-id") ?? node.getAttribute("data-object-id"),
    );
    return {
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      azimuth: stage?.getAttribute("data-stage-camera-azimuth") ?? null,
      elevation: stage?.getAttribute("data-stage-camera-elevation") ?? null,
      distance: stage?.getAttribute("data-stage-camera-distance") ?? null,
      target: stage?.getAttribute("data-stage-camera-target") ?? null,
      presentation: selector?.getAttribute("data-active-presentation") ?? null,
      report: Boolean(document.querySelector('[data-testid="nexora-subject-report"]')),
      reportTitle:
        document.querySelector('[data-testid="nexora-subject-report-title"]')?.textContent?.trim() ??
        null,
      actions: Boolean(document.querySelector('[data-testid="nexora-subject-operation"]')),
      sceneEvidence: Boolean(
        document.querySelector('[data-testid="nexora-evidence-visual-view"]') ||
          document.querySelector('[data-testid="nexora-stage-contextual-visual"]'),
      ),
      advisor:
        document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.replace(/\s+/g, " ").trim() ??
        null,
      focused:
        document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ??
        null,
      objectIds: objects.filter(Boolean).slice(0, 12),
    };
  });
}

async function openView(page, state) {
  await page.evaluate((nextState) => {
    const disclosure = document.querySelector('[data-testid="nexora-presentation-disclosure"]');
    if (disclosure && !disclosure.open) disclosure.open = true;
    document.querySelector(`[data-testid="nexora-presentation-option-${nextState}"]`)?.click();
  }, state);
  await page.waitForTimeout(300);
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
const focus = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-focus.png") });

await openView(page, "operation");
const actions = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-actions.png") });

await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-subject-action-act-capacity-problem"]')?.click();
});
await page.waitForTimeout(500);
const afterInvestigate = await snapshot(page);
await page.screenshot({ path: join(out, "investigate-problem.png") });

await page.evaluate(() => {
  document.querySelector('[data-testid="nexora-stage-object-obj-capacity"]')?.click();
});
await page.waitForTimeout(400);
if ((await snapshot(page)).focused !== "obj-capacity") {
  await askExecutiveChat(page, "Show Capacity.");
  await page.waitForFunction(
    () =>
      document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Capacity") &&
      !document.querySelector('[data-testid="nexora-advisor-view-subject"]')?.textContent?.includes("Gap"),
  );
}
await openView(page, "report");
const details = await snapshot(page);
await page.screenshot({ path: join(out, "capacity-details.png") });

await openView(page, "operation");
const detailsToActions = await snapshot(page);
await page.screenshot({ path: join(out, "details-to-actions.png") });

await openView(page, "minimum");
const actionsToFocus = await snapshot(page);
await page.screenshot({ path: join(out, "actions-to-focus.png") });

const cameraKeys = ["cameraMode", "cameraFixed", "azimuth", "elevation", "distance", "target"];
const poses = [focus, actions, afterInvestigate, details, detailsToActions, actionsToFocus];
const cameraStable = poses.every((pose) =>
  cameraKeys.every((key) => pose[key] === focus[key]),
);

const gates = {
  gFocus:
    focus.focused === "obj-capacity" &&
    focus.presentation === "minimum" &&
    focus.report === false &&
    focus.actions === false,
  gActions:
    actions.focused === "obj-capacity" &&
    actions.actions === true &&
    actions.report === false &&
    actions.presentation === "operation",
  gInvestigate:
    afterInvestigate.focused === "ctx-problem-capacity" &&
    afterInvestigate.actions === false &&
    afterInvestigate.report === false &&
    afterInvestigate.presentation !== "operation",
  gDetails:
    details.focused === "obj-capacity" &&
    details.report === true &&
    details.actions === false &&
    details.presentation === "report",
  gDetailsToActions:
    detailsToActions.actions === true &&
    detailsToActions.report === false &&
    detailsToActions.focused === "obj-capacity",
  gActionsToFocus:
    actionsToFocus.report === false &&
    actionsToFocus.actions === false &&
    actionsToFocus.presentation === "minimum" &&
    actionsToFocus.focused === "obj-capacity",
  gCamera:
    focus.cameraMode === "fixed-executive-perspective" &&
    focus.cameraFixed === "true" &&
    cameraStable,
};

const report = {
  identity: "NPA-T STAGE-COMPOSITION:2/ReportActivationObjectFirst",
  url,
  focus,
  actions,
  afterInvestigate,
  details,
  detailsToActions,
  actionsToFocus,
  cameraStable,
  gates,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = Object.values(gates).every(Boolean);
console.log(ok ? "STAGE-COMPOSITION:2 live ok" : "STAGE-COMPOSITION:2 live FAIL");
console.log(JSON.stringify(gates, null, 2));
process.exit(ok ? 0 : 1);
