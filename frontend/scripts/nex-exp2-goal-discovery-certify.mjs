/**
 * NEX-EXP:2 — live goal discovery, Stage center transfer, workspace protection.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp2-goal-discovery-object-emergence",
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
    const labels = [...document.querySelectorAll("[data-label-prominence]")]
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      identityState: shell?.getAttribute("data-nex-exp1-state"),
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      goalSufficiency: shell?.getAttribute("data-nex-exp2-sufficiency"),
      goalName: shell?.getAttribute("data-nex-exp2-goal"),
      goalConfirmed: shell?.getAttribute("data-nex-exp2-confirmed"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      last,
      labels,
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
    focused: shell?.getAttribute("data-focused-subject"),
  };
});
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
const hi = await ask(page, "Hi.");
await page.screenshot({ path: join(OUT, "01-identity-ready.png") });
const identity = await ask(
  page,
  "I'm Dana. I run operations for a logistics company.",
);
await page.screenshot({ path: join(OUT, "02-manager-center.png") });
const beforeGoal = identity;
const goal = await ask(page, "We need to improve delivery reliability.");
await page.screenshot({ path: join(OUT, "03-goal-center.png") });
const success = await ask(page, "Reduce late deliveries below 5%.");
const deadline = await ask(page, "We need this by Q4.");
const change = await ask(page, "Actually, cost is more important right now.");
const refine = await ask(
  page,
  "No, refine the goal — reduce delivery cost without hurting service.",
);
const whatGoal = await ask(page, "What is my goal?");
const whyPhrase = await ask(page, "Why did you phrase it that way?");
const unknowns = await ask(page, "What do we still not know?");
const showGoal = await ask(page, "Show me the goal.");
const explain = await ask(page, "Explain this.");
const connected = await ask(page, "How does this connect to my company?");
await page.screenshot({ path: join(OUT, "04-console-clean.png") });
await page.close();

const earlySession = await createPage(`${ENTRANCE}&ts=${Date.now()}`);
const earlyIdentity = await ask(
  earlySession.page,
  "I'm Priya. I run operations for a logistics company and we're trying to reduce delivery delays.",
);
const earlyFollow = await ask(earlySession.page, "Hi.");
await earlySession.page.screenshot({ path: join(OUT, "05-early-signal.png") });
await earlySession.page.close();

const liveReport = {
  phase: "NEX-EXP:2",
  identity: "NEX-EXP:2/GoalDiscoveryGoalObjectEmergence",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  identityThenGoalAsk: /trying to achieve/i.test(identity.last),
  beforeGoalManagerCenter:
    beforeGoal.center === "obj-executive-context" &&
    beforeGoal.focused === "obj-executive-context" &&
    beforeGoal.objectCount === 1,
  afterGoalCenter:
    goal.focused === "goal-executive-discovered" &&
    goal.center === "goal-executive-discovered" &&
    /Goal:/i.test(goal.last),
  relatedContextRemains: goal.objectCount === 2,
  noExplosion: goal.objectCount <= 2 && !/Capacity|Revenue/i.test(goal.labels.join(" ")),
  cameraFixed: goal.camera === "fixed-2d",
  topologyPresent: Boolean(goal.topologyZ),
  successCaptured: /5%|below 5/i.test(success.last),
  deadlineCaptured: /q4/i.test(`${deadline.last} ${whatGoal.last}`),
  changeOrRefine: /cost/i.test(`${change.last} ${refine.last}`),
  whatGoalAnswered: /goal/i.test(whatGoal.last),
  phraseEpistemic: /infer|unknown|stated/i.test(whyPhrase.last),
  unknownsHonest: /unknown/i.test(unknowns.last),
  showExplainWorks:
    /goal/i.test(showGoal.last) && /executive goal|outcome/i.test(explain.last),
  companyLink: /related|connect/i.test(connected.last),
  earlySignalReused: /reduce delivery delays|delivery/i.test(
    `${earlyIdentity.last} ${earlyFollow.last}`,
  ),
  earlyDidNotBlankAsk: !/What outcome are you trying to achieve right now\?/i.test(
    earlyFollow.last,
  ),
  firstHiNotForm: !/OKR|KPI|deadline|constraint/i.test(hi.last),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "identityThenGoalAsk",
  "beforeGoalManagerCenter",
  "afterGoalCenter",
  "relatedContextRemains",
  "noExplosion",
  "cameraFixed",
  "successCaptured",
  "deadlineCaptured",
  "whatGoalAnswered",
  "earlySignalReused",
];
const missing = required.filter((key) => liveReport[key] !== true);
if (http !== 200 || errors.length > 0 || missing.length > 0) {
  console.error("NEX-EXP:2 live cert failed", { missing, errors });
  process.exit(1);
}
