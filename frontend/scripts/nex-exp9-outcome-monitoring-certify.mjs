/**
 * NEX-EXP:9 — live outcome monitoring, Goal impact, Stage and conversation safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp9-outcome-monitoring-goal-impact",
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
      planningState: shell?.getAttribute("data-nex-exp8-state"),
      runtime: shell?.getAttribute("data-nex-exp8-runtime"),
      started: shell?.getAttribute("data-nex-exp8-started"),
      outcomeState: shell?.getAttribute("data-nex-exp9-state"),
      impact: shell?.getAttribute("data-nex-exp9-impact"),
      startsLearning: shell?.getAttribute("data-nex-exp9-starts-learning"),
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

async function seedToMonitoring(page) {
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
  return ask(page, "Confirm.");
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
const started = await seedToMonitoring(page);
await page.screenshot({ path: join(OUT, "01-execution-active.png") });
const unknown = await ask(page, "What is the outcome?");
await page.screenshot({ path: join(OUT, "02-outcome-unknown.png") });
const observed = await ask(page, "On-time delivery is now 94%.");
await page.screenshot({ path: join(OUT, "03-outcome-observed.png") });
const changed = await ask(page, "What changed?");
const expected = await ask(page, "What did we expect?");
const happened = await ask(page, "What actually happened?");
const worked = await ask(page, "Did it work?");
const improving = await ask(page, "Are we improving?");
const achieved = await ask(page, "Did we achieve the Goal?");
const gap = await ask(page, "How far are we from the Goal now?");
const source = await ask(page, "Where did that number come from?");
const current = await ask(page, "How current is it?");
const early = await ask(page, "Is this an early signal or a final outcome?");
const cause = await ask(page, "Did the execution cause this?");
const unknownQ = await ask(page, "What don't we know?");
const keep = await ask(page, "Should we keep going?");
const reassess = await ask(page, "Should we reassess?");
const attention = await ask(page, "What needs my attention?");
const done = await ask(page, "Execution is done. Did we succeed?");
const where = await ask(page, "Where are we?");
await page.screenshot({ path: join(OUT, "04-conversation.png") });
await page.screenshot({ path: join(OUT, "05-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:9",
  identity: "NEX-EXP:9/OutcomeMonitoringGoalImpactExperience",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  executionActive:
    started.started === "true" &&
    started.planningState === "READY_FOR_OUTCOME_MONITORING",
  noFakeOutcome: /does not yet have enough outcome evidence/i.test(unknown.last),
  expectedPredicted: /PREDICTED/i.test(expected.last),
  observedNumeric: /94/.test(`${observed.last} ${happened.last}`),
  whatChanged: /Before|91/.test(changed.last),
  didItWork: /target has not yet been reached/i.test(worked.last),
  improving: /IMPROVING/i.test(improving.last),
  notAchieved: /not achieved/i.test(achieved.last),
  gapNarrowed: observed.impact === "IMPROVING",
  provenance: /manager-reported/i.test(source.last),
  freshness: /current|stale|Freshness/i.test(current.last),
  earlySignal: /EARLY_SIGNAL|INTERIM/i.test(early.last),
  noCausation: /cannot confirm/i.test(cause.last),
  unknownsVisible: unknownQ.last.length > 8,
  keepGoingHandoff: /Learning\/Reassessment|does not make a new Decision/i.test(
    keep.last,
  ),
  reassessHandoff: /handoff/i.test(reassess.last),
  completeNotSuccess: /does not mean the Goal is achieved/i.test(done.last),
  startsLearningFalse: observed.startsLearning === "false",
  cameraFixed: observed.camera === "fixed-2d",
  topologyPresent: Boolean(observed.topologyZ),
  goalCenterPreserved: started.focused === "goal-executive-discovered",
  moStillWorks: where.last.length > 8 && attention.last.length > 8,
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
  console.error("NEX-EXP:9 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
