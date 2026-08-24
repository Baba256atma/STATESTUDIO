/**
 * NEX-EXP:4 — live issue discovery, Goal-center preservation, workspace protection.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp4-problem-risk-opportunity-discovery",
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
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      realityState: shell?.getAttribute("data-nex-exp3-state"),
      issueState: shell?.getAttribute("data-nex-exp4-state"),
      issueObjects: Number(shell?.getAttribute("data-nex-exp4-object-count") ?? 0),
      issueKinds: shell?.getAttribute("data-nex-exp4-kinds"),
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
const beforeIssues = await ask(
  page,
  "Our backlog is high and capacity is almost full.",
);
await page.screenshot({ path: join(OUT, "01-before-issue-discovery.png") });
const preventing = await ask(page, "What may be preventing the Goal?");
const gapProblem = await ask(page, "Do we have a Problem?");
const problem = await ask(page, "Capacity is our biggest problem.");
const vsRisk = await ask(page, "Is this a Problem or a Risk?");
const risk = await ask(page, "Supplier delays are becoming risky.");
const risks = await ask(page, "What risks do we have?");
const weekend = await ask(page, "We may be able to use weekend capacity.");
await ask(page, "Do we have any opportunities?");
const rec = await ask(page, "Is that an opportunity or a recommendation?");
const tight = await ask(page, "Budget is tight.");
const cap = await ask(page, "Budget is capped at $250k.");
const constraints = await ask(page, "What constraints matter?");
const why = await ask(page, "Why do you think Capacity is a Problem?");
const root = await ask(page, "Is Capacity the root cause?");
const evidence = await ask(page, "What evidence supports that?");
const unknown = await ask(page, "What don't we know?");
await ask(page, "This may be a supplier issue.");
await ask(page, "Supplier delays are already happening.");
await ask(page, "I'm only worried they may happen next month.");
const show = await ask(page, "Show the Problem.");
const explain = await ask(page, "Explain this.");
const affect = await ask(page, "How does this affect my Goal?");
const ready = await ask(page, "Are we ready to explore scenarios?");
await page.screenshot({ path: join(OUT, "02-after-issue-emergence.png") });
await page.screenshot({ path: join(OUT, "03-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:4",
  identity: "NEX-EXP:4/ProblemRiskOpportunityDiscovery",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  goalRemainsCenterBeforeIssues:
    beforeIssues.focused === "goal-executive-discovered" &&
    beforeIssues.camera === "fixed-2d",
  goalRemainsCenterAfterIssues:
    problem.focused === "goal-executive-discovered" &&
    problem.center === "goal-executive-discovered",
  gapWithoutForcedProblem: /gap is an observed symptom|not yet have a supported Problem/i.test(
    gapProblem.last,
  ),
  problemDiscovered: /Problem candidate|Capacity/i.test(problem.last),
  riskDiscovered: /Risk/i.test(`${risk.last} ${risks.last}`),
  opportunityNotRecommendation: /not a recommendation/i.test(
    `${weekend.last} ${rec.last}`,
  ),
  constraintClarified: /spending limit|under pressure|Constraint/i.test(
    `${tight.last} ${cap.last} ${constraints.last}`,
  ),
  noRootCause: /not a confirmed root cause|unconfirmed/i.test(root.last),
  evidenceCopy: /evidence|related is not the same as caused/i.test(
    `${why.last} ${evidence.last}`,
  ),
  unknownCopy: /unknown|unconfirmed|does not yet/i.test(unknown.last),
  preventingCopy: /preventing|investigate|Problem|gap/i.test(preventing.last),
  vsRiskCopy: /current|future/i.test(vsRisk.last),
  showExplainWorked: show.last.length > 8 && explain.last.length > 8,
  affectGoal: /goal/i.test(affect.last),
  readyBoundary: /scenarios or options|not created yet|not yet/i.test(ready.last),
  noFakeProbability: !/probability is \d/i.test(
    `${risk.last} ${risks.last} ${problem.last}`,
  ),
  issueObjectsRestrained:
    problem.issueObjects >= 1 && problem.issueObjects <= 4,
  cameraFixed: problem.camera === "fixed-2d",
  topologyPresent: Boolean(problem.topologyZ),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ).length,
};

const missing = Object.entries(liveReport)
  .filter(([, value]) => value === false)
  .map(([key]) => key);

await writeFile(join(OUT, "live-browser.json"), JSON.stringify({ liveReport, missing, errors, warnings }, null, 2));

if (missing.length || liveReport.uncaught || liveReport.duplicateOrHydration) {
  console.error("NEX-EXP:4 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
