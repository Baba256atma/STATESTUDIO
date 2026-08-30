/**
 * DTH:8 live /executive certification.
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
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      sceneScriptId: mount?.getAttribute("data-theatre-scene-script-id") ?? "missing",
      comparisonCount: mount?.getAttribute("data-theatre-comparison-candidate-count") ?? "0",
      comparisonDom: Boolean(comparison),
      reviewDom: Boolean(review),
      investigationDom: Boolean(investigation),
      commitmentId: mount?.getAttribute("data-theatre-decision-commitment-id") ?? "none",
      candidateId: mount?.getAttribute("data-theatre-decision-candidate-id") ?? "none",
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      authoritativeId: mount?.getAttribute("data-theatre-decision-authoritative-id") ?? "none",
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
const load = await snapshot(page);

await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
const afterCompare = await snapshot(page);
await page.screenshot({ path: join(out, "live-comparison.png") });

const clickedA = await clickStageObject(page, "ctx-scenario-pricing");
const afterClickA = await snapshot(page);
const closeInvestigation = page.locator('[data-testid="nexora-theatre-investigation-close"]');
if ((await closeInvestigation.count()) > 0) {
  await closeInvestigation.click({ force: true });
  await page.waitForTimeout(400);
}
const afterCloseInvestigation = await snapshot(page);
const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
await page.waitForTimeout(400);
const afterReview = await snapshot(page);
await page.screenshot({ path: join(out, "live-review.png") });

const why = await askExecutiveChat(page, "Why this one?");
const evidence = await askExecutiveChat(page, "What evidence supports it?");
const tradeOffs = await askExecutiveChat(page, "What are the trade-offs?");
const uncertain = await askExecutiveChat(page, "What remains uncertain?");

await page.locator('[data-testid="nexora-theatre-decision-cancel"]').click({ force: true, timeout: 5000 }).catch(() => null);
await page.waitForTimeout(400);
const afterCancel = await snapshot(page);

if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
await page.waitForTimeout(300);
const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
if ((await changeB.count()) > 0) await changeB.click({ force: true });
await page.waitForTimeout(400);
const afterSwitch = await snapshot(page);

const haveI = await askExecutiveChat(page, "Have I already made the decision?");
const afterHaveI = await snapshot(page);

await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
await page.waitForTimeout(500);
const afterApproveClick = await snapshot(page);
const approve = await askExecutiveChat(page, "Approve Demand Surge");
let afterCommit = await snapshot(page);
if (afterCommit.authoritativeId === "none") {
  const yes = await askExecutiveChat(page, "Yes");
  afterCommit = await snapshot(page);
  approve.last = `${approve.last}\n${yes.last}`;
}
if (afterCommit.authoritativeId === "none") {
  const go = await askExecutiveChat(page, "Let's go with Demand Surge");
  afterCommit = await snapshot(page);
  approve.last = `${approve.last}\n${go.last}`;
}
const next = await askExecutiveChat(page, "What happens next?");
await page.screenshot({ path: join(out, "live-committed.png") });
await page.screenshot({ path: join(out, "live-stage.png") });
await browser.close();

const leak = [why.last, evidence.last, haveI.last, approve.last, next.last].some((text) =>
  /DTH:8|CC:10|Scene Script|NCA-POST/i.test(text ?? ""),
);
const report = {
  identity: "DTH:8/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 30),
  load,
  afterCompare,
  selectA: { attempted: clickedA, afterClickA, afterCloseInvestigation },
  afterReview,
  questions: { why: why.last, evidence: evidence.last, tradeOffs: tradeOffs.last, uncertain: uncertain.last },
  afterCancel,
  afterSwitch,
  haveI: { text: haveI.last, afterHaveI },
  afterApproveClick,
  commit: { text: approve.last, afterCommit },
  next: next.last,
  architectureLeak: leak,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  !leak &&
  Number(afterCompare.comparisonCount) >= 2 &&
  afterClickA.authoritativeId === "none" &&
  afterClickA.decisionCommitted !== "true" &&
  afterReview.reviewDom === true &&
  afterReview.decisionState === "REVIEWING" &&
  afterCancel.comparisonDom === true &&
  Number(afterCancel.comparisonCount) >= 2 &&
  afterSwitch.candidateId === "ctx-scenario-demand" &&
  /no/i.test(haveI.last ?? "") &&
  afterCommit.executionStarted !== "true" &&
  afterCommit.authoritativeId !== "none" &&
  afterCommit.decisionState === "COMMITTED";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  comparisonCount: afterCompare.comparisonCount,
  reviewState: afterReview.decisionState,
  switchedTo: afterSwitch.candidateId,
  committed: afterCommit.authoritativeId,
  decisionState: afterCommit.decisionState,
  executionStarted: afterCommit.executionStarted,
}, null, 2));
if (!ok) process.exit(1);
