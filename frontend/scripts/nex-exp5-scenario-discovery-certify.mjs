/**
 * NEX-EXP:5 — live scenario/option discovery, center preservation, decision safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp5-scenario-option-discovery",
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
      issueState: shell?.getAttribute("data-nex-exp4-state"),
      scenarioState: shell?.getAttribute("data-nex-exp5-state"),
      scenarioObjects: Number(shell?.getAttribute("data-nex-exp5-object-count") ?? 0),
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
const options = await ask(page, "What options do we have?");
await ask(page, "What could we do about this?");
await ask(page, "Let's explore some scenarios.");
const weekend = await ask(page, "We could add weekend capacity.");
await page.screenshot({ path: join(OUT, "01-first-scenario.png") });
await ask(page, "What if we outsource part of it?");
const nothing = await ask(page, "What if we do nothing?");
const happen = await ask(page, "What would happen if we increased capacity?");
const pred = await ask(page, "Is that a prediction or a scenario?");
const assume = await ask(page, "What does Scenario A assume?");
const unknown = await ask(page, "What don't we know?");
await ask(page, "What constraints affect it?");
await ask(page, "Is Scenario A feasible?");
const rec = await ask(page, "Does this mean you recommend Scenario A?");
const chosen = await ask(page, "Which Scenario did I choose?");
await ask(page, "I haven't decided yet.");
const show = await ask(page, "Show Scenario A.");
const explain = await ask(page, "Explain this.");
const affect = await ask(page, "How does this affect my Goal?");
const compare = await ask(page, "Compare these scenarios.");
const approve = await ask(page, "Approve Scenario A.");
await page.screenshot({ path: join(OUT, "02-scenarios-around-goal.png") });
await page.screenshot({ path: join(OUT, "03-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:5",
  identity: "NEX-EXP:5/ScenarioOptionDiscovery",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  goalRemainsCenter:
    weekend.focused === "goal-executive-discovered" &&
    weekend.camera === "fixed-2d",
  optionsWithoutInvention: /will not invent|No manager-stated|possible/i.test(
    options.last,
  ),
  scenarioFormed: weekend.scenarioObjects >= 1 && weekend.scenarioObjects <= 4,
  doNothing: /current plan|do nothing|possible path/i.test(nothing.last),
  notPrediction: /not a prediction/i.test(pred.last),
  assumptionNotFact: /assum|not a validated fact/i.test(assume.last),
  unknownsPreserved: /unknown/i.test(unknown.last),
  notRecommendation: /not a recommendation/i.test(rec.last),
  notSelected: /None is selected|not a Decision/i.test(chosen.last),
  expectedNotObserved: /prospective|not an observed outcome|may change/i.test(
    happen.last,
  ),
  showExplainWorked: show.last.length > 8 && explain.last.length > 8,
  affectGoal: /goal/i.test(affect.last),
  compareHandoff: /ready to compare|Not yet|comparison/i.test(compare.last),
  approveNotCommitted: !/approved Scenario A as your decision/i.test(approve.last),
  noFakeNumeric: !/\$120k|ROI = 34/i.test(`${weekend.last} ${happen.last}`),
  cameraFixed: weekend.camera === "fixed-2d",
  topologyPresent: Boolean(weekend.topologyZ),
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
  console.error("NEX-EXP:5 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
