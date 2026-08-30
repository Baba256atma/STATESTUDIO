/**
 * DTH:11 live /executive certification.
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
const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const pageErrors = [];
const consoleErrors = [];

await mkdir(out, { recursive: true });

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const comparison = document.querySelector('[data-testid="nexora-theatre-comparison"]');
    const live = document.querySelector('[data-testid="nexora-theatre-live-execution"]');
    const outcome = document.querySelector('[data-testid="nexora-theatre-outcome-observation"]');
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      comparisonDom: Boolean(comparison),
      liveDom: Boolean(live),
      outcomeDom: Boolean(outcome),
      investigationDom: Boolean(investigation),
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      liveState: mount?.getAttribute("data-theatre-live-execution-state") ?? "none",
      executionId: mount?.getAttribute("data-theatre-execution-id") ?? "none",
      outcomeState: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
      outcomeId: mount?.getAttribute("data-theatre-outcome-id") ?? "none",
      outcomeExecutionId: mount?.getAttribute("data-theatre-outcome-execution-id") ?? "none",
    };
  });
}

async function openObjectsList(page) {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  if ((await list.count()) === 0) return;
  const open = await list.evaluate((el) => el.hasAttribute("open") || el.open === true);
  if (!open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
}

async function clickStageObject(page, id) {
  await openObjectsList(page);
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`);
  if ((await control.count()) === 0) return false;
  await control.click({ force: true });
  await page.waitForTimeout(700);
  return true;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => pageErrors.push(String(error)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
await page.waitForTimeout(300);
const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
if ((await changeB.count()) > 0) await changeB.click({ force: true });
await page.waitForTimeout(300);
const closeInvestigation = page.locator('[data-testid="nexora-theatre-investigation-close"]');
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true }).catch(() => null);
  await page.waitForTimeout(300);
}
await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
await askExecutiveChat(page, "Approve Demand Surge");
await askExecutiveChat(page, "Start it.");
const afterStart = await snapshot(page);
await page.screenshot({ path: join(out, "live-execution.png") });

const beforeResult = await askExecutiveChat(page, "What was the result?");
await askExecutiveChat(page, "Delivery improved from 91% to 94%.");
const afterObservation = await snapshot(page);
await page.screenshot({ path: join(out, "live-stage.png") });

const result = await askExecutiveChat(page, "What was the result?");
const goal = await askExecutiveChat(page, "Did we reach the goal?");
const improved = await askExecutiveChat(page, "How much did it improve?");
const success = await askExecutiveChat(page, "Was it successful?");
const cause = await askExecutiveChat(page, "Did this execution cause the improvement?");
const evidence = await askExecutiveChat(page, "What evidence supports that?");
const original = await askExecutiveChat(page, "What was the original decision?");
const showExec = await askExecutiveChat(page, "Show the execution.");
const showOutcomes = await askExecutiveChat(page, "Show all outcomes.");
const afterShow = await snapshot(page);

const clickDemand = await clickStageObject(page, "ctx-scenario-demand");
const afterClick = await snapshot(page);
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true }).catch(() => null);
  await page.waitForTimeout(300);
}
const clickDelivery = await clickStageObject(page, "obj-delivery");
const afterKpi = await snapshot(page);

await page.locator('[data-testid="nexora-stage-reset"]').click({ force: true }).catch(() => null);
await page.waitForTimeout(500);
await askExecutiveChat(page, "What was the result?");
const afterReturn = await snapshot(page);

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const afterHardReload = await snapshot(page);

await browser.close();

const answers = {
  beforeResult: beforeResult.last,
  result: result.last,
  goal: goal.last,
  improved: improved.last,
  success: success.last,
  cause: cause.last,
  evidence: evidence.last,
  original: original.last,
  showExec: showExec.last,
  showOutcomes: showOutcomes.last,
};
const leak = Object.values(answers).some((text) => /DTH:11|CORE-OUT|CC:11|Scene Script|NCA-POST/i.test(text ?? ""));
const report = {
  identity: "DTH:11/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 20),
  afterStart,
  afterObservation,
  afterShow,
  afterClick: { attempted: clickDemand, afterClick },
  afterKpi: { attempted: clickDelivery, afterKpi },
  afterReturn,
  afterHardReload,
  questions: answers,
  architectureLeak: leak,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  !leak &&
  afterStart.liveState === "EXECUTION_ACTIVE" &&
  /No authoritative Outcome|don't have an authoritative outcome/i.test(beforeResult.last ?? "") &&
  afterObservation.outcomeDom === true &&
  afterObservation.liveDom === false &&
  /94%/.test(result.last ?? "") &&
  /96%/.test(goal.last ?? "") &&
  /percentage points/.test(improved.last ?? "") &&
  !/\+3%/.test(improved.last ?? "") &&
  /not the same as declaring|did not fully reach the target/i.test(success.last ?? "") &&
  /does not establish that this execution alone caused/i.test(cause.last ?? "") &&
  /Demand Surge/i.test(original.last ?? "") &&
  afterObservation.outcomeExecutionId.includes("execution-") &&
  afterHardReload.outcomeDom === false &&
  afterHardReload.outcomeState === "none";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  afterStart,
  afterObservation,
  leak,
  result: result.last,
  outcomeState: afterObservation.outcomeState,
  hardReloadOutcome: afterHardReload.outcomeState,
}, null, 2));
if (!ok) process.exit(1);
