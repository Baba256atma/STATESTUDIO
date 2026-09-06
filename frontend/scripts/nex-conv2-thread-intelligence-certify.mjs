/**
 * NEX-CONV:2 — live Conversation Thread Intelligence proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-conv2-thread-intelligence");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3000";
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
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      convSubject: shell?.getAttribute("data-nex-conv-subject"),
      convPurpose: shell?.getAttribute("data-nex-conv-purpose"),
      convMove: shell?.getAttribute("data-nex-conv-move"),
      convCoverage: shell?.getAttribute("data-nex-conv-coverage"),
      convReason: shell?.getAttribute("data-nex-conv-reason"),
      threadObjective: shell?.getAttribute("data-nex-conv2-objective"),
      threadSubject: shell?.getAttribute("data-nex-conv2-subject"),
      threadStatus: shell?.getAttribute("data-nex-conv2-status"),
      threadCovered: shell?.getAttribute("data-nex-conv2-covered"),
      threadTurn: shell?.getAttribute("data-nex-conv2-turn"),
      threadMove: shell?.getAttribute("data-nex-conv2-move"),
      threadReason: shell?.getAttribute("data-nex-conv2-reason"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
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
const existingSnapshot = await snapshot(existing.page);
const existingExplain = await ask(existing.page, "Explain Capacity Gap.");
const existingWhy = await ask(existing.page, "Why does it matter?");
const existingEvidence = await ask(existing.page, "What evidence supports it?");
const existingNext = await ask(existing.page, "What should I look at next?");
await existing.page.screenshot({ path: join(OUT, "04-normal-executive.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(first.page, "Show me");
await ask(first.page, "Show me how focus works");
await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "00-goal-education.png") });
const w1 = await ask(first.page, "What is this?");
const w2 = await ask(first.page, "What is this?");
const w3 = await ask(first.page, "What is this?");
const y1 = await ask(first.page, "Why is it on Stage?");
const w4 = await ask(first.page, "What is this?");
const y2 = await ask(first.page, "Why is it on Stage?");
const w5 = await ask(first.page, "What is this?");
const d1 = await ask(first.page, "What's the difference?");
const w6 = await ask(first.page, "What is this?");
await first.page.screenshot({ path: join(OUT, "01-goal-thread.png") });
const kpi = await ask(first.page, "Show me the next one");
const k1 = await ask(first.page, "What is this?");
await first.page.screenshot({ path: join(OUT, "02-kpi-transition.png") });
const skipped = await ask(first.page, "Skip this");
await first.page.screenshot({ path: join(OUT, "03-skip.png") });
const afterSkip = await ask(first.page, "Explain Capacity Gap.");
await first.page.close();

const writes = {
  goal: [w6.goalState, k1.goalState, skipped.goalState, afterSkip.goalState],
  decision: [w6.decisionState, k1.decisionState, skipped.decisionState, afterSkip.decisionState],
};

const liveReport = {
  phase: "NEX-CONV:2",
  identity: "NEX-CONV:2/ConversationThreadIntelligence",
  completedAt: new Date().toISOString(),
  base: BASE,
  http: first.http,
  existingWorkspace: existingSnapshot.mode,
  goalSequence: [w1, w2, w3, y1, w4, y2, w5, d1, w6].map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    subject: turn.convSubject,
    purpose: turn.convPurpose,
    conv1Move: turn.convMove,
    conv1Coverage: turn.convCoverage,
    threadObjective: turn.threadObjective,
    threadCovered: turn.threadCovered,
    threadTurn: turn.threadTurn,
    threadMove: turn.threadMove,
    threadReason: turn.threadReason,
    suggested: turn.suggested,
    goalState: turn.goalState,
    decisionState: turn.decisionState,
  })),
  suggestedAfterIdentify: w1.suggested,
  suggestedAfterWhy: y1.suggested,
  suggestedAfterCompare: d1.suggested,
  kpiTransition: {
    present: kpi.last,
    first: k1.last,
    subject: k1.threadSubject,
    covered: k1.threadCovered,
  },
  skip: {
    last: skipped.last,
    suggested: skipped.suggested,
    ent3: skipped.ent3State,
  },
  normalExecutive: [existingExplain, existingWhy, existingEvidence, existingNext, afterSkip].map(
    (turn) => ({
      utterance: turn.utterance,
      last: turn.last,
      suggested: turn.suggested,
      mode: turn.mode,
    }),
  ),
  writes,
  finalWhatIsNotGenericClarify: !/I may not be answering the part you mean/i.test(w6.last),
  finalWhatIsThreadAware: /we've covered|we can look/i.test(w6.last),
  noLessonAdvance: w6.ent3State === "GOAL",
  kpiFresh: /kpi/i.test(k1.last) && k1.threadSubject === "obj-nex-ent3-kpi",
  actionsEvolved:
    w1.suggested.some((item) => /why is it on stage/i.test(item)) &&
    !y1.suggested.some((item) => /why is it on stage/i.test(item)) &&
    !d1.suggested.some((item) => /difference/i.test(item)),
  skipClearsNextObject: !skipped.suggested.some((item) => /next one/i.test(item)),
  normalAdvisorResponded: existingExplain.last.length > 8 && existingWhy.last.length > 8,
  noEducationalLeakAfterSkip: !afterSkip.suggested.some((item) => /next one/i.test(item)),
  zeroBusinessWrites: writes.goal.every((state) => state === "none") &&
    writes.decision.every((state) => state === "none"),
  runtimeErrors: errors.filter((item) => !/hydration|Minified React error #418/i.test(item)),
};

liveReport.passed =
  liveReport.finalWhatIsNotGenericClarify &&
  liveReport.finalWhatIsThreadAware &&
  liveReport.noLessonAdvance &&
  liveReport.kpiFresh &&
  liveReport.actionsEvolved &&
  liveReport.skipClearsNextObject &&
  liveReport.normalAdvisorResponded &&
  liveReport.noEducationalLeakAfterSkip &&
  liveReport.zeroBusinessWrites &&
  liveReport.runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
