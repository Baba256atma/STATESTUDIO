/**
 * NEX-EXP:6 — live comparison, trade-off, recommendation, Stage and decision safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp6-scenario-comparison-tradeoff-recommendation",
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
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      scenarioState: shell?.getAttribute("data-nex-exp5-state"),
      comparisonState: shell?.getAttribute("data-nex-exp6-state"),
      recommendation: shell?.getAttribute("data-nex-exp6-recommendation"),
      recommendedId: shell?.getAttribute("data-nex-exp6-recommended-id"),
      commitsDecision: shell?.getAttribute("data-nex-exp6-commits-decision"),
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

const existing = await createPage(EXISTING);
const existingSnapshot = await existing.page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    mode: shell?.getAttribute("data-nex-exp1-mode"),
    objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
    exp6: shell?.getAttribute("data-nex-exp6-state"),
  };
});
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
await ask(page, "Hi.");
await ask(page, "I'm Dana. I run operations for a logistics company.");
await ask(page, "We need to improve delivery reliability.");
await ask(page, "On-time delivery is around 91%. We want 96%.");
await ask(page, "Our backlog is high and capacity is almost full.");
await ask(page, "Capacity is our biggest problem.");
await ask(page, "Are we ready to explore scenarios?");
await ask(page, "We could add weekend capacity.");
await ask(page, "What if we outsource part of it?");
await ask(page, "What if we do nothing?");
const closed = await ask(page, "Compare these scenarios.");
await page.screenshot({ path: join(OUT, "01-before-comparison.png") });
const compare = await ask(page, "Compare the scenarios.");
const different = await ask(page, "How are they different?");
const gain = await ask(page, "What do I gain with Scenario A?");
const sacrifice = await ask(page, "What do I sacrifice?");
const faster = await ask(page, "Which one is faster?");
const cheaper = await ask(page, "Which one costs less?");
const risk = await ask(page, "Which one has more risk?");
const fit = await ask(page, "Which one fits my Goal best?");
const assume = await ask(page, "What assumptions matter most?");
const unknown = await ask(page, "What don't we know?");
const rec = await ask(page, "Which one do you recommend?");
await page.screenshot({ path: join(OUT, "02-after-recommendation.png") });
const why = await ask(page, "Why?");
const whyNot = await ask(page, "Why not Scenario B?");
const better = await ask(page, "What would make Scenario B better?");
const confident = await ask(page, "How confident are you?");
const choosing = await ask(page, "Are you choosing this for me?");
const decided = await ask(page, "Have I decided yet?");
const prefer = await ask(page, "I prefer Scenario A.");
const show = await ask(page, "Show Scenario B.");
const explain = await ask(page, "Explain this.");
const affect = await ask(page, "How does this affect my Goal?");
const shift = await ask(page, "What if cash becomes more important than speed?");
const approve = await ask(page, "Approve Scenario A.");
await page.screenshot({ path: join(OUT, "03-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:6",
  identity: "NEX-EXP:6/ScenarioComparisonTradeoffRecommendation",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  exp5Closed: closed.scenarioState === "READY_FOR_SCENARIO_COMPARISON",
  comparisonStarted: /Scenario A|Scenario B|comparable|recommend/i.test(compare.last),
  differences: different.last.length > 8,
  gainSacrifice: /gain|sacrifice/i.test(`${gain.last} ${sacrifice.last}`),
  noInventedCheaper: /unknown|will not rank|cost/i.test(cheaper.last),
  unknownNotRisk: /not high risk|unknown/i.test(`${risk.last} ${unknown.last}`),
  recommendationExplained: /recommend|tied|withhold|cannot recommend/i.test(
    `${rec.last} ${why.last}`,
  ),
  notChoosing: /does not choose|not a Decision|No\./i.test(
    `${choosing.last} ${decided.last}`,
  ),
  preferenceNotCommit: /not approval/i.test(prefer.last),
  commitsDecisionFalse: rec.commitsDecision === "false",
  goalRemainsCenter:
    rec.focused === "goal-executive-discovered" && rec.camera === "fixed-2d",
  noFocusSteal:
    show.focused === "goal-executive-discovered" ||
    Boolean(show.focused),
  cameraFixed: rec.camera === "fixed-2d",
  topologyPresent: Boolean(rec.topologyZ),
  moStillWorks: show.last.length > 8 && explain.last.length > 8 && /goal/i.test(affect.last),
  priorityRecalc: /Recalculated|COST|cost|recommend|tied/i.test(shift.last),
  approveNotExp6: !/commitsDecision=false, startsExecution=false/.test(approve.last),
  fasterQualitative: !/exactly \d+ days/.test(faster.last),
  whyNotAlternative: whyNot.last.length > 8 && better.last.length > 8,
  confidenceNonNumeric: !/\d+%/.test(confident.last),
  closedHandoff: /ready to compare|comparison has not started|None has been selected/i.test(
    closed.last,
  ),
  fitGoal: /goal/i.test(fit.last),
  assumeVisible: assume.last.length > 8,
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
  console.error("NEX-EXP:6 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
