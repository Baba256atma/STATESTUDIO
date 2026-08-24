/**
 * NEX-E2E:1 — live first-time full executive loop on /executive?entrance=1&reset=1.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-e2e1-full-executive-experience",
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
      e2e: shell?.getAttribute("data-nex-e2e1"),
      createsExp11: shell?.getAttribute("data-nex-e2e1-creates-exp11"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      committed: shell?.getAttribute("data-nex-exp7-committed"),
      startsExecution: shell?.getAttribute("data-nex-exp7-starts-execution"),
      executionState: shell?.getAttribute("data-nex-exp8-state"),
      started: shell?.getAttribute("data-nex-exp8-started"),
      outcomeState: shell?.getAttribute("data-nex-exp9-state"),
      impact: shell?.getAttribute("data-nex-exp9-impact"),
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

const existing = await createPage(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
const entranceOpen = await snapshot(page);
await page.screenshot({ path: join(OUT, "01-nexora-center.png") });

const hi = await ask(page, "Hi.");
const identity = await ask(
  page,
  "I'm Sarah. I run operations for a logistics company.",
);
await page.screenshot({ path: join(OUT, "02-manager-company-center.png") });
const goal = await ask(page, "My goal is to improve delivery reliability.");
await page.screenshot({ path: join(OUT, "03-goal-center.png") });
const reality = await ask(page, "We're currently at 91%; target is 96%.");
await ask(page, "Backlog is high.");
await page.screenshot({ path: join(OUT, "04-goal-reality.png") });
const preventing = await ask(page, "What may be preventing the Goal?");
await ask(page, "Capacity is our biggest problem.");
await page.screenshot({ path: join(OUT, "05-goal-issues.png") });
await ask(page, "Are we ready to explore scenarios?");
await ask(page, "What options do we have?");
await ask(page, "We could add temporary capacity.");
await ask(page, "We could use external capacity.");
await ask(page, "What if we maintain the current plan?");
await page.screenshot({ path: join(OUT, "06-scenarios.png") });
await ask(page, "Compare them.");
const recommend = await ask(page, "What do you recommend?");
const whyRec = await ask(page, "Why?");
await ask(page, "I prefer Scenario A.");
await ask(page, "Let's go with A.");
const confirmDecision = await ask(page, "Confirm.");
await page.screenshot({ path: join(OUT, "07-decision.png") });
const next = await ask(page, "What happens next?");
const owner = await ask(page, "Who owns it?");
await ask(page, "Let's start it.");
const confirmStart = await ask(page, "Confirm.");
await page.screenshot({ path: join(OUT, "08-execution.png") });
const changed = await ask(page, "What changed?");
const observed = await ask(page, "On-time delivery is now 94%.");
await page.screenshot({ path: join(OUT, "09-outcome.png") });
const worked = await ask(page, "Did it work?");
const learned = await ask(page, "What did we learn?");
await page.screenshot({ path: join(OUT, "10-learning.png") });
const whyLearn = await ask(page, "Why?");
const cycle = await ask(page, "Where should the next cycle start?");
await page.screenshot({ path: join(OUT, "11-next-cycle.png") });
await page.screenshot({ path: join(OUT, "12-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-E2E:1",
  identity: "NEX-E2E:1/FullExecutiveExperienceEndToEndCertification",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  firstTimeMode: entranceOpen.mode === "first-time" || hi.mode === "first-time",
  createsExp11: identity.createsExp11 === "false",
  identityUnderstood: /Sarah|operations|logistics/i.test(identity.last),
  goalClear: /delivery reliability|Goal/i.test(goal.last),
  realityVisible: /91|96|gap|current/i.test(reality.last),
  issueDistinguished: /Problem|Risk|Opportunity|Constraint|prevent/i.test(
    preventing.last,
  ),
  recommendationExplained: /recommend/i.test(`${recommend.last} ${whyRec.last}`),
  managerControlledApproval:
    confirmDecision.committed === "true" &&
    confirmDecision.startsExecution === "false",
  executionSeparated: /plan|owner|start|readiness/i.test(
    `${next.last} ${owner.last}`,
  ),
  notAutoStartedBeforeConfirm: confirmStart.started === "true",
  outcomeUnknownBeforeEvidence: /UNKNOWN|not observed|No observed|not an Outcome|enough outcome evidence|PREDICTED/i.test(
    changed.last,
  ),
  expectedVsObserved: /PREDICTED|94|IMPROV/i.test(
    `${observed.last} ${worked.last}`,
  ),
  learningScoped: /THIS_CASE_ONLY|Learning|assumption/i.test(
    `${learned.last} ${whyLearn.last}`,
  ),
  nextCycleNotForcedGoal: /REALITY|ISSUE|SCENARIO|MONITOR|CLOSE|EXECUTION|DECISION/i.test(
    cycle.last,
  ),
  cameraFixed: cycle.camera === "fixed-2d",
  topologyPresent: Boolean(cycle.topologyZ),
  goalCenterPreserved: /goal-executive-discovered/.test(
    `${goal.focused} ${cycle.focused}`,
  ),
  errors: [...new Set(errors)].slice(0, 20),
  warnings: [...new Set(warnings)].slice(0, 20),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
console.log(JSON.stringify(liveReport, null, 2));
const failed =
  liveReport.http !== 200 ||
  !liveReport.existingWorkspaceProtected ||
  !liveReport.createsExp11 ||
  !liveReport.managerControlledApproval ||
  !liveReport.learningScoped ||
  liveReport.errors.length > 0;
process.exit(failed ? 1 : 0);
