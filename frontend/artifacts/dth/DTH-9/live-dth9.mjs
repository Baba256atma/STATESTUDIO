/**
 * DTH:9 live /executive certification.
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
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      comparisonCount: mount?.getAttribute("data-theatre-comparison-candidate-count") ?? "0",
      comparisonDom: Boolean(comparison),
      reviewDom: Boolean(review),
      readinessDom: Boolean(readiness),
      investigationDom: Boolean(investigation),
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      authoritativeId: mount?.getAttribute("data-theatre-decision-authoritative-id") ?? "none",
      readiness: mount?.getAttribute("data-theatre-execution-readiness") ?? "none",
      executionId: mount?.getAttribute("data-theatre-execution-id") ?? "none",
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
const afterCompare = await snapshot(page);

const clickedA = await clickStageObject(page, "ctx-scenario-pricing");
const closeInvestigation = page.locator('[data-testid="nexora-theatre-investigation-close"]');
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true });
  await page.waitForTimeout(400);
}
const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
await page.waitForTimeout(300);
const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
if ((await changeB.count()) > 0) await changeB.click({ force: true });
await page.waitForTimeout(300);
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true }).catch(() => null);
  await page.waitForTimeout(300);
}
await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
const approve = await askExecutiveChat(page, "Approve Demand Surge");
const afterCommit = await snapshot(page);
await page.screenshot({ path: join(out, "live-committed.png") });

const clickDecision = await clickStageObject(page, "ctx-scenario-demand");
const afterClickCommitted = await snapshot(page);
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true }).catch(() => null);
  await page.waitForTimeout(300);
}

const next = await askExecutiveChat(page, "What happens next?");
const hasStarted = await askExecutiveChat(page, "Has execution started?");
const ready = await askExecutiveChat(page, "Is this decision ready to execute?");
const showExecutions = await askExecutiveChat(page, "show executions");
const afterShowExecutions = await snapshot(page);
const start = await askExecutiveChat(page, "Start it.");
const afterStart = await snapshot(page);
await page.screenshot({ path: join(out, "live-stage.png") });
await browser.close();

const leak = [next.last, hasStarted.last, ready.last, showExecutions.last, start.last].some((text) =>
  /DTH:9|CC:11|Scene Script|NCA-POST/i.test(text ?? ""),
);
const report = {
  identity: "DTH:9/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 20),
  afterCompare,
  approve: approve.last,
  afterCommit,
  clickCommitted: { attempted: clickDecision, afterClickCommitted },
  questions: {
    next: next.last,
    hasStarted: hasStarted.last,
    ready: ready.last,
    showExecutions: showExecutions.last,
    start: start.last,
  },
  afterShowExecutions,
  afterStart,
  architectureLeak: leak,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  !leak &&
  afterCommit.authoritativeId !== "none" &&
  afterCommit.decisionState === "COMMITTED" &&
  afterCommit.readiness === "COMMITTED_AWAITING_EXECUTION" &&
  afterCommit.comparisonDom === false &&
  afterCommit.readinessDom === true &&
  afterClickCommitted.readiness !== "EXECUTION_STARTED" &&
  /not started/i.test(hasStarted.last ?? "") &&
  afterShowExecutions.readiness !== "EXECUTION_STARTED" &&
  afterStart.executionId !== "none" &&
  /Execution has started/i.test(start.last ?? "");

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  committed: afterCommit.authoritativeId,
  readiness: afterCommit.readiness,
  sceneIntent: afterCommit.sceneIntent,
  afterStartReadiness: afterStart.readiness,
  afterStartExecutionId: afterStart.executionId,
}, null, 2));
if (!ok) process.exit(1);
