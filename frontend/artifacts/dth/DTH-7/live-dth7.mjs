/**
 * DTH:7 live /executive certification.
 * Comparison overlay from authoritative membership. No NexoCompare arena.
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
const consoleWarnings = [];

await mkdir(out, { recursive: true });

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const comparison = document.querySelector('[data-testid="nexora-theatre-comparison"]');
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const cards = document.querySelectorAll('[data-testid*="nexo-select"], [data-testid*="nexo-time"], [data-testid*="investigation-card"], [data-testid*="nexo-compare"], [data-testid*="nexo-lens"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      sceneScriptId: mount?.getAttribute("data-theatre-scene-script-id") ?? "missing",
      comparisonId: mount?.getAttribute("data-theatre-comparison-id") ?? "none",
      comparisonCount: mount?.getAttribute("data-theatre-comparison-candidate-count") ?? "0",
      comparisonLevel: mount?.getAttribute("data-theatre-comparison-level") ?? "none",
      activeCandidate: mount?.getAttribute("data-theatre-comparison-active-candidate") ?? "none",
      comparisonDom: Boolean(comparison),
      investigationDom: Boolean(investigation),
      investigationObjectId: mount?.getAttribute("data-theatre-investigation-object-id") ?? "none",
      cardOrChartCount: cards.length,
      decisionCommitted: shell?.getAttribute("data-nex-exp7-committed") ?? "none",
      decisionState: shell?.getAttribute("data-nex-exp7-state") ?? "none",
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

function leak(text) {
  return /COMPARE_CANDIDATES|NCA-POST|Scene Script|comparison projection|canonical members|claim ledger|semantic authority|runtime binding|DTH:7/i.test(
    text ?? "",
  );
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => pageErrors.push(String(error)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
  if (msg.type() === "warning") consoleWarnings.push(msg.text());
});
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const load = await snapshot(page);

await askExecutiveChat(page, "show problems");
const problems = await snapshot(page);

await askExecutiveChat(page, "show scenarios");
const scenarios = await snapshot(page);

const compareThem = await askExecutiveChat(page, "Compare them.");
const afterCompare = await snapshot(page);

const evidenceAsk = await askExecutiveChat(page, "Which one has stronger evidence?");
const afterEvidence = await snapshot(page);

const betterAsk = await askExecutiveChat(page, "Which one is better?");
const afterBetter = await snapshot(page);

const clickedA = await clickStageObject(page, "ctx-scenario-pricing");
const afterSelectA = await snapshot(page);

const whyThis = await askExecutiveChat(page, "Why this one?");
const afterWhy = await snapshot(page);

await page.locator('[data-testid="nexora-theatre-investigation-close"]').click({ timeout: 5000 }).catch(() => null);
await page.waitForTimeout(400);
const afterCloseInvestigation = await snapshot(page);

const tradeOff = await askExecutiveChat(page, "What is the biggest trade-off?");
const afterTradeOff = await snapshot(page);

const doNothing = await askExecutiveChat(page, "What happens if we do nothing?");
const afterDoNothing = await snapshot(page);

const unknowns = await askExecutiveChat(page, "What do we still not know?");
const afterUnknowns = await snapshot(page);

await askExecutiveChat(page, "show scenarios");
const clickedAgain = await clickStageObject(page, "ctx-scenario-demand");
const afterClickB = await snapshot(page);

const chooseAsk = await askExecutiveChat(page, "Choose Pricing Response.");
const afterChoose = await snapshot(page);

await page.screenshot({ path: join(out, "live-stage.png") });
await browser.close();

const replies = [
  compareThem.last,
  evidenceAsk.last,
  betterAsk.last,
  whyThis.last,
  tradeOff.last,
  doNothing.last,
  unknowns.last,
  chooseAsk.last,
];
const architectureLeak = replies.some((text) => leak(text));
const fakeScore = replies.some((text) => /\b(87|74|63)\b/.test(text ?? "") && /score|rank|percent/i.test(text ?? ""));
const fabricatedZero = /cost is 0|cost: 0|zero days|risk = low because missing/i.test(doNothing.last ?? "");
const inventedConsequence = /will definitely|guaranteed to fail|always succeeds/i.test(doNothing.last ?? "");
const dthConsole = consoleErrors.filter((text) => /DTH:7|decision theatre/i.test(text));
const hydration = consoleErrors.filter((text) => /hydrat/i.test(text));

const report = {
  identity: "DTH:7/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 40),
  consoleWarnings: consoleWarnings.slice(0, 20),
  dthAttributedConsoleErrors: dthConsole,
  hydrationErrors: hydration,
  load,
  problems,
  scenarios,
  compare: { text: compareThem.last, afterCompare },
  evidence: { text: evidenceAsk.last, afterEvidence },
  better: { text: betterAsk.last, afterBetter },
  selectA: { attempted: clickedA, afterSelectA, why: whyThis.last, afterWhy, afterCloseInvestigation },
  tradeOff: { text: tradeOff.last, afterTradeOff },
  doNothing: { text: doNothing.last, afterDoNothing },
  unknowns: { text: unknowns.last, afterUnknowns },
  clickB: { attempted: clickedAgain, afterClickB },
  choose: { text: chooseAsk.last, afterChoose },
  architectureLeak,
  fakeScore,
  fabricatedZero,
  inventedConsequence,
  zeroPageErrors: pageErrors.length === 0,
};

const comparisonPresent = Number(afterCompare.comparisonCount) >= 2 && afterCompare.comparisonDom === true;
const membershipPreserved =
  afterCloseInvestigation.comparisonCount === afterCompare.comparisonCount &&
  afterCloseInvestigation.comparisonId !== "none";
const clickNotDecision =
  afterSelectA.decisionCommitted !== "true" && afterClickB.decisionCommitted !== "true";
const chooseNotExecute = afterChoose.executionStarted !== "true";
const whyAnchored = /Pricing Response|this option|this scenario/i.test(whyThis.last ?? "");

const ok =
  report.zeroPageErrors &&
  dthConsole.length === 0 &&
  hydration.length === 0 &&
  !architectureLeak &&
  !fakeScore &&
  !fabricatedZero &&
  !inventedConsequence &&
  load.cardOrChartCount === 0 &&
  comparisonPresent &&
  clickedA &&
  afterSelectA.investigationDom === true &&
  afterCloseInvestigation.investigationDom === false &&
  membershipPreserved &&
  clickNotDecision &&
  chooseNotExecute &&
  afterCloseInvestigation.sceneScriptId === afterWhy.sceneScriptId &&
  whyAnchored &&
  clickedAgain;

report.ok = ok;
report.checks = {
  comparisonPresent,
  membershipPreserved,
  clickNotDecision,
  chooseNotExecute,
  whyAnchored,
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  comparisonCount: afterCompare.comparisonCount,
  comparisonIntent: afterCompare.sceneIntent,
  closedInvestigation: afterCloseInvestigation.investigationDom === false,
  membershipPreserved,
  clickNotDecision,
  chooseNotExecute,
  architectureLeak,
}, null, 2));
if (!ok) process.exit(1);
