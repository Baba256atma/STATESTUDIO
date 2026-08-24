/**
 * NEX-EXP:10 — live learning, reassessment, Stage and next-cycle safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp10-learning-reassessment-next-cycle",
);
const EXISTING = "http://localhost:3000/executive";
const ENTRANCE = "http://localhost:3000/executive?entrance=1&reset=1";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

async function createPage(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(700);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      outcomeState: shell?.getAttribute("data-nex-exp9-state"),
      learningState: shell?.getAttribute("data-nex-exp10-state"),
      route: shell?.getAttribute("data-nex-exp10-route"),
      commits: shell?.getAttribute("data-nex-exp10-commits-decision"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      last,
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

async function seedToLearning(page) {
  await ask(page, "Hi.");
  await ask(page, "I'm Dana. I run operations for a logistics company.");
  await ask(page, "We need to improve delivery reliability.");
  await ask(page, "On-time delivery is around 91%. We want 96%.");
  await ask(page, "Our backlog is high and capacity is almost full.");
  await ask(page, "Capacity is our biggest problem.");
  await ask(page, "Are we ready to explore scenarios?");
  await ask(page, "We could add weekend capacity.");
  await ask(page, "What if we do nothing?");
  await ask(page, "Compare these scenarios.");
  await ask(page, "Compare the scenarios.");
  await ask(page, "Which one do you recommend?");
  await ask(page, "Let's go with Scenario A.");
  await ask(page, "Yes, confirm.");
  await ask(page, "What's the execution plan?");
  await ask(page, "Let's start it.");
  await ask(page, "Confirm.");
  return ask(page, "On-time delivery is now 94%.");
}

const existing = await createPage(EXISTING);
const existingSnapshot = await existing.page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    mode: shell?.getAttribute("data-nex-exp1-mode"),
    objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
  };
});
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
const observed = await seedToLearning(page);
await page.screenshot({ path: join(OUT, "01-outcome-ready.png") });
const learned = await ask(page, "What did we learn?");
await page.screenshot({ path: join(OUT, "02-learning.png") });
const correct = await ask(page, "Which assumptions were correct?");
const wrong = await ask(page, "Which assumptions were wrong?");
const notLearn = await ask(page, "What did we not learn?");
const prove = await ask(page, "Did this prove the decision was right?");
const cause = await ask(page, "Did this prove Capacity caused the improvement?");
const reassess = await ask(page, "What should we reassess?");
const valid = await ask(page, "Is the Goal still valid?");
const changeGoal = await ask(page, "Should we change the Goal?");
const problem = await ask(page, "Should we revisit the Problem?");
const scenarios = await ask(page, "Should we explore new Scenarios?");
const decision = await ask(page, "Should we revisit the Decision?");
const execution = await ask(page, "Should we change execution?");
const next = await ask(page, "Where should the next cycle start?");
const remember = await ask(page, "What will Nexora remember from this?");
const why = await ask(page, "Why will you remember that?");
const done = await ask(page, "Are we done?");
const where = await ask(page, "Where are we?");
const attention = await ask(page, "What needs my attention?");
await page.screenshot({ path: join(OUT, "03-conversation.png") });
await page.screenshot({ path: join(OUT, "04-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:10",
  identity: "NEX-EXP:10/LearningReassessmentNextExecutiveCycle",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  outcomeReady: observed.outcomeState === "READY_FOR_LEARNING_REASSESSMENT",
  learnedScoped: /THIS_CASE_ONLY/i.test(learned.last),
  assumptionsReviewed: /SUPPORTED|NOT_TESTED|NOT_SUPPORTED/i.test(
    `${correct.last} ${wrong.last} ${notLearn.last}`,
  ),
  decisionNotDeclaredCorrect: /not a declaration|SUPPORTED_BY_OUTCOME|INCONCLUSIVE/i.test(
    prove.last,
  ),
  noConfirmedCause: /UNKNOWN/i.test(cause.last),
  reassessVisible: /Reassessment route|REALITY|SCENARIO|ISSUE/i.test(reassess.last),
  goalNotAutoChanged: /not changed automatically|Manager retains/i.test(
    `${valid.last} ${changeGoal.last}`,
  ),
  nextCycleRouted: /REALITY|not an automatic restart at Goal/i.test(next.last),
  memoryHonest: /APP-4|Memory status|provenance/i.test(`${remember.last} ${why.last}`),
  notFakeClosure: /Cycle status/i.test(done.last),
  commitsDecisionFalse: next.commits === "false",
  cameraFixed: learned.camera === "fixed-2d",
  topologyPresent: Boolean(learned.topologyZ),
  goalCenterPreserved: observed.focused === "goal-executive-discovered",
  moStillWorks: where.last.length > 8 && attention.last.length > 8,
  problemAndScenarioAnswered: problem.last.length > 8 && scenarios.last.length > 8,
  decisionExecutionUnchanged: /No new Decision|unchanged/i.test(
    `${decision.last} ${execution.last}`,
  ),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ).length,
};

const missing = Object.entries(liveReport)
  .filter(([, value]) => value === false)
  .map(([key]) => key);

await writeFile(
  join(OUT, "live-browser.json"),
  JSON.stringify({ liveReport, missing, errors, warnings }, null, 2),
);

if (missing.length || liveReport.uncaught || liveReport.duplicateOrHydration) {
  console.error("NEX-EXP:10 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
