/**
 * DTH:12 live /executive certification.
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
    const learning = document.querySelector('[data-testid="nexora-theatre-learning-reassessment"]');
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      comparisonDom: Boolean(comparison),
      liveDom: Boolean(live),
      outcomeDom: Boolean(outcome),
      learningDom: Boolean(learning),
      investigationDom: Boolean(investigation),
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      liveState: mount?.getAttribute("data-theatre-live-execution-state") ?? "none",
      executionId: mount?.getAttribute("data-theatre-execution-id") ?? "none",
      outcomeState: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
      learningState: mount?.getAttribute("data-theatre-learning-state") ?? "none",
      reassessmentState: mount?.getAttribute("data-theatre-reassessment-state") ?? "none",
      learningDurable: mount?.getAttribute("data-theatre-learning-durable") ?? "none",
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

const beforeLearn = await askExecutiveChat(page, "What did we learn?");
await askExecutiveChat(page, "Delivery improved from 91% to 94%.");
const afterObservation = await snapshot(page);
await page.screenshot({ path: join(out, "live-stage.png") });

const learned = await askExecutiveChat(page, "What did we learn?");
const why = await askExecutiveChat(page, "Why do you think that?");
const evidence = await askExecutiveChat(page, "What evidence supports that?");
const worked = await askExecutiveChat(page, "Did the decision work?");
const wrong = await askExecutiveChat(page, "Was our decision wrong?");
const assumption = await askExecutiveChat(page, "Which assumption changed?");
const uncertain = await askExecutiveChat(page, "What remains uncertain?");
const reconsider = await askExecutiveChat(page, "What should we reconsider?");
const another = await askExecutiveChat(page, "Should we try another option?");
const goal = await askExecutiveChat(page, "Should we change the goal?");
const original = await askExecutiveChat(page, "Show the original decision.");
const showOutcome = await askExecutiveChat(page, "Show the outcome.");
const showExec = await askExecutiveChat(page, "Show the execution.");
const showScenarios = await askExecutiveChat(page, "Show the original scenarios.");
const reenter = await askExecutiveChat(page, "Let's reconsider the alternatives.");
const afterReenter = await snapshot(page);

const clickDelivery = await clickStageObject(page, "obj-delivery");
const afterKpi = await snapshot(page);

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const afterHardReload = await snapshot(page);

await browser.close();

const answers = {
  beforeLearn: beforeLearn.last,
  learned: learned.last,
  why: why.last,
  evidence: evidence.last,
  worked: worked.last,
  wrong: wrong.last,
  assumption: assumption.last,
  uncertain: uncertain.last,
  reconsider: reconsider.last,
  another: another.last,
  goal: goal.last,
  original: original.last,
  showOutcome: showOutcome.last,
  showExec: showExec.last,
  showScenarios: showScenarios.last,
  reenter: reenter.last,
};
const leak = Object.values(answers).some((text) => /DTH:12|CORE-OUT|APP-4|CC:11|Scene Script/i.test(text ?? ""));
const report = {
  identity: "DTH:12/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 20),
  afterStart,
  afterObservation,
  afterReenter,
  afterKpi: { attempted: clickDelivery, afterKpi },
  afterHardReload,
  questions: answers,
  architectureLeak: leak,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  !leak &&
  afterStart.liveState === "EXECUTION_ACTIVE" &&
  /enough evidence yet|no authoritative Outcome|don't have an authoritative outcome/i.test(beforeLearn.last ?? "") &&
  afterObservation.learningDom === true &&
  afterObservation.learningDurable === "false" &&
  /94%/.test(learned.last ?? "") &&
  /96%/.test(learned.last ?? "") &&
  /does not establish that the intervention alone caused/i.test(learned.last ?? "") &&
  /does not by itself establish that the Decision was wrong/i.test(wrong.last ?? "") &&
  /96%/.test(goal.last ?? "") &&
  /not a new Decision/i.test(reenter.last ?? "") &&
  afterReenter.comparisonDom === false &&
  afterHardReload.learningDom === false &&
  afterHardReload.learningState === "none";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  afterStart,
  afterObservation,
  leak,
  learned: learned.last,
  learningState: afterObservation.learningState,
  hardReloadLearning: afterHardReload.learningState,
}, null, 2));
if (!ok) process.exit(1);
