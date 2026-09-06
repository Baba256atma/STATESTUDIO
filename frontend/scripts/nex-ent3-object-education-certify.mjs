/**
 * NEX-ENT:3 — live /executive Object language education proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent3-object-education");
const EXISTING = "http://localhost:3000/executive";
const ENTRANCE = "http://localhost:3000/executive?entrance=1&reset=1";

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

async function open(url, options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1502, height: 942 },
    ...options,
  });
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
    const jargon = /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|graph vertex/i.test(
      nexoraMessages.join(" "),
    );
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent2State: shell?.getAttribute("data-nex-ent2-state"),
      ent2Focus: shell?.getAttribute("data-nex-ent2-focus"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      ent3Object: shell?.getAttribute("data-nex-ent3-object"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      focusedSubject: shell?.getAttribute("data-focused-subject"),
      goal: shell?.getAttribute("data-nex-exp2-goal"),
      goalConfirmed: shell?.getAttribute("data-nex-exp2-confirmed"),
      issueCount: shell?.getAttribute("data-nex-exp4-object-count"),
      scenarioCount: shell?.getAttribute("data-nex-exp5-object-count"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      last: nexoraMessages.at(-1) ?? "",
      jargon,
      educationalIds: [...document.querySelectorAll("[data-canonical-id]")]
        .map((node) => node.getAttribute("data-canonical-id"))
        .filter((id) => id?.startsWith("obj-nex-ent3-")),
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
await ask(first.page, "Show me");
await ask(first.page, "Show me how focus works");
const objects = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "02-object-goal.png") });
const what = await ask(first.page, "What is this?");
await ask(first.page, "Show me the next one");
const difference = await ask(first.page, "What's the difference between this and the Goal?");
await first.page.screenshot({ path: join(OUT, "03-kpi.png") });
await ask(first.page, "Show me the next one");
const risk = await ask(first.page, "Is Risk the same as Problem?");
await ask(first.page, "Show me the next one");
const notDecision = await ask(first.page, "Is this the Decision?");
await first.page.screenshot({ path: join(OUT, "04-scenario.png") });
await ask(first.page, "Show me the next one");
const authority = await ask(first.page, "Can you decide for me?");
await ask(first.page, "Show me the next one");
await ask(first.page, "Show me the next one");
const cause = await ask(first.page, "Does a good Outcome prove the Decision caused it?");
await first.page.screenshot({ path: join(OUT, "05-outcome.png") });

await first.page.locator('[data-testid="nexora-stage-object-list"]').evaluate((el) => {
  el.open = true;
});
const objectControl = first.page.locator('[data-testid="nexora-stage-object-control-obj-nex-ent3-outcome"]');
if (await objectControl.count()) {
  await objectControl.click({ force: true });
  await first.page.waitForTimeout(400);
}
const selected = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "06-select.png") });

const unrelated = await ask(first.page, "Show problems");
await first.page.screenshot({ path: join(OUT, "07-unrelated.png") });

await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "08-refresh.png") });
const skipped = await ask(first.page, "Skip this");
await first.page.screenshot({ path: join(OUT, "09-skip.png") });
await first.page.close();

const reduced = await open(ENTRANCE, { reducedMotion: "reduce" });
await reduced.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(reduced.page, "Show me");
await ask(reduced.page, "Show me how focus works");
const reducedGoal = await ask(reduced.page, "Show me the next one");
await reduced.page.screenshot({ path: join(OUT, "10-reduced-motion.png") });
await reduced.page.close();

const liveReport = {
  phase: "NEX-ENT:3",
  identity: "NEX-ENT:3/ObjectLanguageEducation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" && existingSnapshot.ent3State === "NOT_STARTED",
  entranceActivated: intro.entState === "AWAITING_MANAGER" && intro.objectCount === 1,
  objectEducationBegan:
    objects.ent3State === "GOAL" &&
    /now that you know the stage/i.test(objects.last) &&
    objects.focusedSubject === "obj-nex-ent3-goal",
  goalQuestion: /goal/i.test(what.last),
  kpiDistinction: /kpi/i.test(difference.last) && /goal/i.test(difference.last),
  riskDistinct: /not the same/i.test(risk.last),
  scenarioNotDecision: /not a decision/i.test(notDecision.last),
  decisionAuthority: /do not silently commit/i.test(authority.last),
  noCausality: /does not prove/i.test(cause.last),
  noBusinessWrites:
    objects.sufficiency === "INSUFFICIENT" &&
    objects.goalConfirmed === "false" &&
    objects.goal === "none" &&
    objects.issueCount === "0" &&
    objects.scenarioCount === "0" &&
    selected.sufficiency === "INSUFFICIENT",
  unrelatedAvailable: unrelated.ent3State !== "SKIPPED" && !/now that you know the stage/i.test(unrelated.last),
  refreshNoEducationalLeak:
    refreshed.objectCount === 1 &&
    (refreshed.ent3State === "NOT_STARTED" || refreshed.ent3State === "INACTIVE"),
  skipSafe: skipped.mode === "existing-workspace" && skipped.objectCount > 3,
  reducedMotionUnderstood: reducedGoal.ent3State === "GOAL",
  noDeveloperJargon: intro.jargon === false && objects.jargon === false && cause.jargon === false,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) => /unique key|hydration/i.test(text)),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "entranceActivated",
  "objectEducationBegan",
  "goalQuestion",
  "kpiDistinction",
  "riskDistinct",
  "scenarioNotDecision",
  "decisionAuthority",
  "noCausality",
  "noBusinessWrites",
  "unrelatedAvailable",
  "refreshNoEducationalLeak",
  "skipSafe",
  "reducedMotionUnderstood",
  "noDeveloperJargon",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
