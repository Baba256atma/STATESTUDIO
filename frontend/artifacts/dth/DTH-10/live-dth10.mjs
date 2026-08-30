/**
 * DTH:10 live /executive certification.
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
    const review = document.querySelector('[data-testid="nexora-theatre-decision-commitment"]');
    const readiness = document.querySelector('[data-testid="nexora-theatre-execution-readiness"]');
    const live = document.querySelector('[data-testid="nexora-theatre-live-execution"]');
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      comparisonDom: Boolean(comparison),
      reviewDom: Boolean(review),
      readinessDom: Boolean(readiness),
      liveDom: Boolean(live),
      investigationDom: Boolean(investigation),
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      authoritativeId: mount?.getAttribute("data-theatre-decision-authoritative-id") ?? "none",
      readiness: mount?.getAttribute("data-theatre-execution-readiness") ?? "none",
      executionId: mount?.getAttribute("data-theatre-execution-id") ?? "none",
      liveState: mount?.getAttribute("data-theatre-live-execution-state") ?? "none",
      liveCanonical: mount?.getAttribute("data-theatre-live-execution-canonical") ?? "none",
      decisionCommitted: shell?.getAttribute("data-nex-exp7-committed") ?? "none",
      executionStarted: shell?.getAttribute("data-nex-exp8-started") ?? "none",
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
const afterCommit = await snapshot(page);
await page.screenshot({ path: join(out, "live-committed.png") });

await askExecutiveChat(page, "Start it.");
const afterStart = await snapshot(page);
await page.screenshot({ path: join(out, "live-stage.png") });

const happening = await askExecutiveChat(page, "What is happening now?");
const going = await askExecutiveChat(page, "How is it going?");
const why = await askExecutiveChat(page, "Why are we doing this?");
const attention = await askExecutiveChat(page, "Does anything need my attention?");
const showExecutions = await askExecutiveChat(page, "show executions");
const afterShow = await snapshot(page);
const showThis = await askExecutiveChat(page, "Show this execution.");
const explain = await askExecutiveChat(page, "Explain it.");
const problem = await askExecutiveChat(page, "What was the original problem?");
const result = await askExecutiveChat(page, "What was the result?");
const completeQ = await askExecutiveChat(page, "Is it complete?");
const completeCmd = await askExecutiveChat(page, "Mark it complete.");

const clickDemand = await clickStageObject(page, "ctx-scenario-demand");
const afterClick = await snapshot(page);
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true }).catch(() => null);
  await page.waitForTimeout(300);
}

await page.locator('[data-testid="nexora-stage-reset"]').click({ force: true }).catch(() => null);
await page.waitForTimeout(500);
const afterOverview = await snapshot(page);
await askExecutiveChat(page, "What is happening now?");
const afterReturn = await snapshot(page);

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const afterHardReload = await snapshot(page);

await browser.close();

const answers = {
  happening: happening.last,
  going: going.last,
  why: why.last,
  attention: attention.last,
  showExecutions: showExecutions.last,
  showThis: showThis.last,
  explain: explain.last,
  problem: problem.last,
  result: result.last,
  completeQ: completeQ.last,
  completeCmd: completeCmd.last,
};
const leak = Object.values(answers).some((text) => /DTH:10|CC:11|Scene Script|NCA-POST/i.test(text ?? ""));
const report = {
  identity: "DTH:10/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 20),
  afterCommit,
  afterStart,
  afterShow,
  afterClick: { attempted: clickDemand, afterClick },
  afterOverview,
  afterReturn,
  afterHardReload,
  questions: answers,
  architectureLeak: leak,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  !leak &&
  afterCommit.readiness === "COMMITTED_AWAITING_EXECUTION" &&
  afterCommit.liveState === "none" &&
  afterStart.executionId !== "none" &&
  afterStart.liveState === "EXECUTION_ACTIVE" &&
  afterStart.liveDom === true &&
  afterStart.comparisonDom === false &&
  afterStart.sceneIntent === "REVIEW_EXECUTION" &&
  /being executed/i.test(happening.last ?? "") &&
  /no authoritative progress observation/i.test(going.last ?? "") &&
  !/0%|50%|on track|behind schedule/i.test(going.last ?? "") &&
  /Demand Surge/i.test(why.last ?? "") &&
  /No supported attention signal/i.test(attention.last ?? "") &&
  afterShow.liveState === "EXECUTION_ACTIVE" &&
  /No authoritative Outcome/i.test(result.last ?? "") &&
  /not marked complete/i.test(completeQ.last ?? "") &&
  /confirmation/i.test(completeCmd.last ?? "") &&
  afterClick.liveState !== "none";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  afterStart,
  leak,
  going: going.last,
  liveState: afterStart.liveState,
  hardReloadLive: afterHardReload.liveState,
}, null, 2));
if (!ok) process.exit(1);
