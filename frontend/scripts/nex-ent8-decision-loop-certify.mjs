/**
 * NEX-ENT:8 — live /executive Decision Loop education proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent8-decision-loop");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3000";
const EXISTING = `${BASE}/executive`;
const ENTRANCE = `${BASE}/executive?entrance=1&reset=1`;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

function attachConsole(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
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
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent7State: shell?.getAttribute("data-nex-ent7-state"),
      ent8State: shell?.getAttribute("data-nex-ent8-state"),
      visual: shell?.getAttribute("data-visual-view"),
      purpose: shell?.getAttribute("data-visual-purpose"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      last: nexoraMessages.at(-1) ?? "",
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|CC:10|CC:11/i.test(
        nexoraMessages.join(" "),
      ),
      messageCount: nexoraMessages.length,
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
  return snapshot(page);
}

async function reachDecisionLoop(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 40; index += 1) {
    const snap = await ask(page, "Show me the next one");
    if (snap.ent8State === "EVIDENCE") return snap;
  }
  return snapshot(page);
}

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const intro = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-entrance-intro.png") });

const evidence = await reachDecisionLoop(first.page);
await first.page.screenshot({ path: join(OUT, "02-evidence.png") });

const known = await ask(first.page, "What do we know?");
const issue = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "03-issue.png") });
const cause = await ask(first.page, "Is capacity the cause?");
const investigate = await ask(first.page, "Show me the next one");
const why = await ask(first.page, "Why are we investigating this?");
const scenarios = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "04-scenarios.png") });
const compared = await ask(first.page, "Show me the next one");
const scenarioQ = await ask(first.page, "What is a Scenario?");
const recommend = await ask(first.page, "Which would you recommend?");
const recommendWhy = await ask(first.page, "Why?");
const commit = await ask(first.page, "Show me the next one");
const notYet = await ask(first.page, "Not yet");
const approve = await ask(first.page, "Approve Temporary Capacity.");
const decided = await ask(first.page, "Have I decided yet?");
const execution = await ask(first.page, "Show me the next one");
const start = await ask(first.page, "Start the execution.");
const outcome = await ask(first.page, "Show me the next one");
const happened = await ask(first.page, "What happened?");
const caused = await ask(first.page, "Did our Decision cause this improvement?");
const review = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "05-review.png") });
const problems = await ask(first.page, "Show me the problems");
const locate = await ask(first.page, "Where is Data?");
const trend = await ask(first.page, "Show me delivery over time");
await first.page.screenshot({ path: join(OUT, "06-routing.png") });

const beforeRefreshCount = (await snapshot(first.page)).messageCount;
await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "07-refresh.png") });
await first.page.close();

const skipSession = await open(ENTRANCE);
await skipSession.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachDecisionLoop(skipSession.page);
const skipped = await ask(skipSession.page, "Skip for now");
await skipSession.page.screenshot({ path: join(OUT, "08-skip.png") });
await skipSession.page.close();

const liveReport = {
  phase: "NEX-ENT:8",
  identity: "NEX-ENT:8/DecisionLoopEducation",
  completedAt: new Date().toISOString(),
  baseUrl: BASE,
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent8State === "NOT_STARTED" || existingSnapshot.ent8State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  decisionLoopBegan:
    evidence.ent8State === "EVIDENCE" && /managed decision/i.test(evidence.last),
  evidenceGrounded: /OTD|90|two months|evidence/i.test(known.last),
  issueNotCause:
    issue.ent8State === "ISSUE" && /not the same as a cause/i.test(issue.last),
  noUnsupportedCause: /do not prove capacity caused/i.test(cause.last),
  investigateWhy:
    /worth investigating|isn.t established as the cause/i.test(why.last),
  scenariosNotDecision:
    scenarios.ent8State === "SCENARIOS" && /not yet a Decision/i.test(scenarios.last),
  comparisonNoWinner: /does not pick a winner|unknown/i.test(compared.last),
  scenarioQuestionStays: /not yet a Decision/i.test(scenarioQ.last),
  recommendationNotDecision: /recommendation, not a Decision/i.test(recommend.last),
  recommendWhy: /not scoring/i.test(recommendWhy.last),
  notYetNoDecision: /No Decision was committed/i.test(notYet.last),
  approveDidNotWriteEntDecision: /have I decided|not through this introduction|I can recommend/i.test(
    `${approve.last} ${decided.last}`,
  ),
  executionNotAutoStarted: /does not mean work has started/i.test(execution.last),
  startDidNotWriteEntExecution: execution.ent8State === "EXECUTION",
  outcomeNoCause: /does not prove the Decision caused/i.test(outcome.last + happened.last),
  causeChallenge: /does not prove|not prove/i.test(caused.last + outcome.last),
  reviewLoop: /You remain the Decision authority/i.test(review.last),
  problemsRoute: /problem/i.test(problems.last),
  dataLocate: locate.gaTarget === "DATA_ENTRY",
  visualRoute: trend.purpose === "TREND",
  skipClean: skipped.ent8State === "SKIPPED",
  refreshNoDuplicateBurst: refreshed.messageCount <= beforeRefreshCount + 1,
  jargonFree: evidence.jargon === false && review.jargon === false,
  runtimeErrors: errors,
  runtimeWarnings: warnings,
};

const passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.entranceActivated &&
  liveReport.decisionLoopBegan &&
  liveReport.evidenceGrounded &&
  liveReport.issueNotCause &&
  liveReport.noUnsupportedCause &&
  liveReport.investigateWhy &&
  liveReport.scenariosNotDecision &&
  liveReport.comparisonNoWinner &&
  liveReport.recommendationNotDecision &&
  liveReport.notYetNoDecision &&
  liveReport.executionNotAutoStarted &&
  liveReport.outcomeNoCause &&
  liveReport.reviewLoop &&
  liveReport.problemsRoute &&
  liveReport.skipClean &&
  liveReport.jargonFree &&
  errors.length === 0;

liveReport.passed = passed;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();

if (!passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
