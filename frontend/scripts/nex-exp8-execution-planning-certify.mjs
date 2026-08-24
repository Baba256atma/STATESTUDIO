/**
 * NEX-EXP:8 — live execution planning, confirmation, Stage and start safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp8-execution-planning-commitment-to-action",
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
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      committed: shell?.getAttribute("data-nex-exp7-committed"),
      planningState: shell?.getAttribute("data-nex-exp8-state"),
      readiness: shell?.getAttribute("data-nex-exp8-readiness"),
      runtime: shell?.getAttribute("data-nex-exp8-runtime"),
      started: shell?.getAttribute("data-nex-exp8-started"),
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

async function seedToCommitted(page) {
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
  return ask(page, "Yes, confirm.");
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
const committed = await seedToCommitted(page);
await page.screenshot({ path: join(OUT, "01-decision-committed.png") });
const next = await ask(page, "What happens next?");
const plan = await ask(page, "What's the execution plan?");
const happen = await ask(page, "What exactly needs to happen?");
const owns = await ask(page, "Who owns this?");
const first = await ask(page, "What comes first?");
const parallel = await ask(page, "What can happen in parallel?");
const blocking = await ask(page, "What is blocking us?");
const ready = await ask(page, "Are we ready to start?");
const whyNot = await ask(page, "Why aren't we ready?");
const assumptions = await ask(page, "What assumptions remain?");
const constraints = await ask(page, "What constraints matter?");
const progress = await ask(page, "What will tell us execution is progressing?");
const goalDone = await ask(page, "Does this mean the Goal is achieved?");
const like = await ask(page, "I like the plan.");
const didStart = await ask(page, "Did execution start?");
await page.screenshot({ path: join(OUT, "02-plan-not-started.png") });
const start = await ask(page, "Let's start it.");
const confirm = await ask(page, "Confirm.");
await page.screenshot({ path: join(OUT, "03-execution-active.png") });
const status = await ask(page, "What is the execution status?");
const where = await ask(page, "Where are we now?");
const attention = await ask(page, "What needs my attention?");
const pause = await ask(page, "Pause execution.");
const change = await ask(page, "Change the plan.");
await page.screenshot({ path: join(OUT, "04-console-clean.png") });
await page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:8",
  identity: "NEX-EXP:8/ExecutionPlanningCommitmentToAction",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  decisionCommitted: committed.committed === "true",
  nextIsPlanning: /execution planning/i.test(next.last),
  planVisible: /not started/i.test(`${plan.last} ${happen.last}`),
  ownerUnknown: /No execution owner is currently assigned|not yet assigned/i.test(
    owns.last,
  ),
  sequenceVisible: first.last.length > 8 && parallel.last.length > 8,
  blockerVisible: /blocker|owner/i.test(blocking.last),
  notReady: /Not yet/i.test(`${ready.last} ${whyNot.last}`),
  assumptionsVisible: /UNKNOWN|assumption/i.test(assumptions.last),
  progressNoPercent: /percent complete|canonical execution/i.test(progress.last),
  goalNotAchieved: /No/i.test(goalDone.last),
  reviewNotStart: /not execution start/i.test(like.last) && /No/i.test(didStart.last),
  confirmationAsked: /Confirm\?/i.test(start.last),
  started:
    /Execution started/i.test(confirm.last) && confirm.started === "true",
  runtimeActive: confirm.runtime === "in-progress",
  statusActive: /in-progress/i.test(status.last),
  cameraFixed: confirm.camera === "fixed-2d",
  topologyPresent: Boolean(confirm.topologyZ),
  goalCenterPreserved: confirm.focused === "goal-executive-discovered",
  moStillWorks: where.last.length > 8 && attention.last.length > 8,
  pauseBoundary: /not a supported canonical/i.test(pause.last),
  changeBoundary: /ACTIVE|not started|Decision/i.test(change.last),
  constraintsHonest: constraints.last.length > 8,
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
  console.error("NEX-EXP:8 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
