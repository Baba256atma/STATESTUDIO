/**
 * NEX-CONV:2-FIX2 — live action-result subject/response parity proof.
 * Uses NEXORA_BASE_URL. Does not assume :3000.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-conv2-fix2-action-result-parity");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3015";
const EXISTING = `${BASE}/executive`;
const ENTRANCE = `${BASE}/executive?entrance=1&reset=1`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

function attachConsole(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
}

async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  attachConsole(page);
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(900);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      experience: shell?.getAttribute("data-executive-experience-context"),
      ent1State: shell?.getAttribute("data-nex-ent1-state"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      ent3Object: shell?.getAttribute("data-nex-ent3-object"),
      convSubject: shell?.getAttribute("data-nex-conv-subject"),
      convPurpose: shell?.getAttribute("data-nex-conv-purpose"),
      convMove: shell?.getAttribute("data-nex-conv-move"),
      convCoverage: shell?.getAttribute("data-nex-conv-coverage"),
      threadObjective: shell?.getAttribute("data-nex-conv2-objective"),
      threadSubject: shell?.getAttribute("data-nex-conv2-subject"),
      threadStatus: shell?.getAttribute("data-nex-conv2-status"),
      threadCovered: shell?.getAttribute("data-nex-conv2-covered"),
      threadMove: shell?.getAttribute("data-nex-conv2-move"),
      action: shell?.getAttribute("data-nex-conv-action"),
      actionResult: shell?.getAttribute("data-nex-conv-action-result"),
      actionFrom: shell?.getAttribute("data-nex-conv-action-from"),
      actionTo: shell?.getAttribute("data-nex-conv-action-to"),
      parity: shell?.getAttribute("data-nex-conv-parity"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      executionState: shell?.getAttribute("data-nex-exp8-state"),
      last: nexoraMessages.at(-1) ?? "",
      suggested: [
        ...document.querySelectorAll(
          "[data-testid='nexora-guided-entrance-suggested-actions'] [data-testid^='nexora-guided-entrance-action-']",
        ),
      ].map((node) => node.textContent ?? ""),
    };
  });
}

async function ask(page, utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(400);
  const snap = await snapshot(page);
  return { utterance, ...snap };
}

const existing = await open(EXISTING);
const existingNext = await ask(existing.page, "Show me the next one");
const existingDecision = await ask(existing.page, "Show me the Decision.");
const existingContinue = await ask(existing.page, "Continue");
const existingExecution = await ask(existing.page, "Show me Execution.");
const existingExecContinue = await ask(existing.page, "Continue");
await existing.page.screenshot({ path: join(OUT, "08-normal-executive.png") });
await existing.page.close();

const appearsPage = await open(ENTRANCE);
await appearsPage.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(appearsPage.page, "Why is this important?");
await ask(appearsPage.page, "Show me");
const appears = await ask(appearsPage.page, "What appears here?");
const appearsContinue = await ask(appearsPage.page, "Continue");
await appearsPage.page.screenshot({ path: join(OUT, "07-appears-continue.png") });
await appearsPage.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const r1 = await ask(first.page, "Why is this important?");
const r2 = await ask(first.page, "Why is this important?");
const shown = await ask(first.page, "Show me");
const focusDemo = await ask(first.page, "Show me how focus works");
const explainFirst = await ask(first.page, "Explain first");
const goal = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "00-goal-education.png") });
const identify = await ask(first.page, "What is this?");
const why = await ask(first.page, "Why is it on Stage?");
const compare = await ask(first.page, "What's the difference?");
const beforeNext = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-before-next.png") });

let kpi;
const nextChip = first.page.locator('[data-testid="nexora-guided-entrance-suggested-actions"]').getByText(
  /Show me the next one/i,
);
if (await nextChip.count()) {
  await nextChip.first().click();
  await first.page.waitForFunction(
    (previous) =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent !== previous,
    beforeNext.last,
  );
  await first.page.waitForTimeout(400);
  kpi = { utterance: "Show me the next one (chip)", ...(await snapshot(first.page)) };
} else {
  kpi = await ask(first.page, "Show me the next one");
}
await first.page.screenshot({ path: join(OUT, "02-goal-to-kpi.png") });
const kpiWhat = await ask(first.page, "What is this?");
const kpiWhy = await ask(first.page, "Why is it on Stage?");
const kpiDiff = await ask(first.page, "What's the difference?");
const issue = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "03-kpi-to-issue.png") });
const issueWhat = await ask(first.page, "What is this?");
const typedNext = await ask(first.page, "Show me the next one");
const equivalent = await ask(first.page, "what next");

const stage = first.page.locator('[data-testid="nexora-3d-executive-stage"] canvas');
const box = await stage.boundingBox();
if (box) {
  await first.page.mouse.click(box.x + 24, box.y + 24);
  await first.page.waitForTimeout(500);
}
const afterBg = await snapshot(first.page);
const skipped = await ask(first.page, "Skip this");
await first.page.screenshot({ path: join(OUT, "04-skip.png") });
await first.page.close();

const classifiedErrors = errors.filter((item) => /hydration|Minified React error #418/i.test(item));
const runtimeErrors = errors.filter((item) => !/hydration|Minified React error #418/i.test(item));

const compareReplay =
  /A Goal is the direction; a KPI is how we observe performance/i.test(kpi.last);
const kpiResponse = /kpi/i.test(kpi.last);
const stageKpi =
  kpi.ent3State === "KPI" || /kpi/i.test(kpi.ent3Object ?? "");
const convKpi =
  /kpi/i.test(kpi.threadSubject ?? "") || /kpi/i.test(kpi.actionTo ?? "");
const chipsKpi = !kpi.suggested.some((item) => /Improve delivery as a Goal/i.test(item));

const liveReport = {
  phase: "NEX-CONV:2-FIX2",
  identity: "NEX-CONV:2-FIX2/ActionResultParity",
  completedAt: new Date().toISOString(),
  base: BASE,
  relevance: [r1.last, r2.last],
  shown: shown.last,
  focusDemo: focusDemo.last,
  explainFirst: explainFirst.last,
  goal: {
    text: goal.last,
    ent3State: goal.ent3State,
    suggested: goal.suggested,
  },
  identify: identify.last,
  why: why.last,
  compare: compare.last,
  beforeNext: {
    ent3State: beforeNext.ent3State,
    threadSubject: beforeNext.threadSubject,
    last: beforeNext.last,
    suggested: beforeNext.suggested,
  },
  kpiTransition: {
    utterance: kpi.utterance,
    preActionSubject: beforeNext.ent3Object,
    lessonBefore: beforeNext.ent3State,
    lessonAfter: kpi.ent3State,
    requestedAction: kpi.action,
    actionResult: kpi.actionResult,
    resultingSubject: kpi.actionTo,
    stageSubject: kpi.ent3Object,
    conversationSubject: kpi.threadSubject,
    convSubject: kpi.convSubject,
    response: kpi.last,
    suggested: kpi.suggested,
    parity: kpi.parity,
    goalState: kpi.goalState,
    decisionState: kpi.decisionState,
    executionState: kpi.executionState,
  },
  kpiWhat: kpiWhat.last,
  kpiWhy: kpiWhy.last,
  kpiDiff: kpiDiff.last,
  issue: {
    text: issue.last,
    ent3State: issue.ent3State,
    threadSubject: issue.threadSubject,
  },
  issueWhat: issueWhat.last,
  typedNext: {
    text: typedNext.last,
    ent3State: typedNext.ent3State,
  },
  equivalent: {
    text: equivalent.last,
    ent3State: equivalent.ent3State,
  },
  appears: appears.last,
  appearsContinue: appearsContinue.last,
  afterBackgroundExperience: afterBg.experience,
  skipState: skipped.ent3State,
  existing: {
    next: existingNext.last,
    decision: existingDecision.last,
    continueAfterDecision: existingContinue.last,
    execution: existingExecution.last,
    continueAfterExecution: existingExecContinue.last,
    decisionState: existingContinue.decisionState,
    executionState: existingExecContinue.executionState,
    leak: existingNext.suggested.some((item) => /next one|Skip lesson/i.test(item)),
  },
  classifiedErrors,
  runtimeErrors,
};

liveReport.noCompareReplay = compareReplay !== true;
liveReport.kpiResponse = kpiResponse;
liveReport.stageKpi = stageKpi;
liveReport.convKpi = convKpi;
liveReport.parityPass = kpi.parity === "PASS" || (stageKpi && convKpi && kpiResponse);
liveReport.chipsAfterKpi = chipsKpi;
liveReport.kpiWhatProgressed = kpiWhat.last !== kpi.last;
liveReport.issueNotKpi = !/that.s a kpi/i.test(issueWhat.last);
liveReport.focusHeld = /focus/i.test(focusDemo.last);
liveReport.explainFirstHeld = /focus/i.test(explainFirst.last);
liveReport.showHandoff = /Stage/i.test(shown.last);
liveReport.appearsContinueIsFocus = /focus/i.test(appearsContinue.last);
liveReport.fix3Held =
  /entrance|guided|education/i.test(afterBg.experience ?? "") || afterBg.mode !== "existing";
liveReport.zeroBusinessWrites =
  [goal, identify, why, compare, kpi, kpiWhat, issue, typedNext].every(
    (turn) =>
      (turn.goalState ?? "none") === "none" &&
      (turn.decisionState ?? "none") === "none" &&
      (turn.executionState ?? "none") === "none",
  );
liveReport.existingContinueSafe =
  (existingContinue.decisionState ?? "none") === "none" &&
  (existingExecContinue.executionState ?? "none") === "none";
liveReport.noEducationalLeak = liveReport.existing.leak !== true;
liveReport.passed =
  liveReport.noCompareReplay &&
  liveReport.kpiResponse &&
  liveReport.stageKpi &&
  liveReport.convKpi &&
  liveReport.parityPass &&
  liveReport.chipsAfterKpi &&
  liveReport.kpiWhatProgressed &&
  liveReport.issueNotKpi &&
  liveReport.focusHeld &&
  liveReport.explainFirstHeld &&
  liveReport.showHandoff &&
  liveReport.appearsContinueIsFocus &&
  liveReport.fix3Held &&
  liveReport.zeroBusinessWrites &&
  liveReport.existingContinueSafe &&
  liveReport.noEducationalLeak &&
  runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
