/**
 * NEX-EXP:7 — live decision/commitment, confirmation, Stage and execution safety.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp7-manager-decision-commitment",
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
      comparisonState: shell?.getAttribute("data-nex-exp6-state"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      committed: shell?.getAttribute("data-nex-exp7-committed"),
      startsExecution: shell?.getAttribute("data-nex-exp7-starts-execution"),
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
await ask(page, "We could add weekend capacity.");
await ask(page, "What if we do nothing?");
await ask(page, "Compare these scenarios.");
await ask(page, "Compare the scenarios.");
const rec = await ask(page, "What do you recommend?");
const why = await ask(page, "Why?");
const deciding = await ask(page, "What exactly am I deciding?");
const accept = await ask(page, "What am I accepting if I choose this?");
const risks = await ask(page, "What are the risks?");
const uncertain = await ask(page, "What are we uncertain about?");
const prefer = await ask(page, "I prefer Scenario A.");
const decided1 = await ask(page, "Have I decided?");
await page.screenshot({ path: join(OUT, "01-preference-not-committed.png") });
const go = await ask(page, "Let's go with Scenario A.");
const decided2 = await ask(page, "Have I decided yet?");
const yes = await ask(page, "Yes, confirm.");
await page.screenshot({ path: join(OUT, "02-committed.png") });
const what = await ask(page, "What did I decide?");
const whyDecide = await ask(page, "Why did I decide it?");
const exec = await ask(page, "Did execution start?");
const next = await ask(page, "What happens next?");
const show = await ask(page, "Show Scenario A.");
const explain = await ask(page, "Explain this.");
const affect = await ask(page, "How does this affect my Goal?");
await page.screenshot({ path: join(OUT, "03-console-clean.png") });
await page.close();

const rejectPage = await createPage(ENTRANCE);
await ask(rejectPage.page, "Hi.");
await ask(rejectPage.page, "I'm Dana. I run operations for a logistics company.");
await ask(rejectPage.page, "We need to improve delivery reliability.");
await ask(rejectPage.page, "On-time delivery is around 91%. We want 96%.");
await ask(rejectPage.page, "Our backlog is high and capacity is almost full.");
await ask(rejectPage.page, "Capacity is our biggest problem.");
await ask(rejectPage.page, "Are we ready to explore scenarios?");
await ask(rejectPage.page, "We could add weekend capacity.");
await ask(rejectPage.page, "What if we do nothing?");
await ask(rejectPage.page, "Compare these scenarios.");
await ask(rejectPage.page, "Compare the scenarios.");
await ask(rejectPage.page, "Which one do you recommend?");
const no = await ask(rejectPage.page, "No, don't approve it.");
const wait = await ask(rejectPage.page, "Not yet.");
const chooseB = await ask(rejectPage.page, "I choose Scenario B instead.");
const whyAB = await ask(rejectPage.page, "Why are you recommending A over B?");
await ask(rejectPage.page, "Approve this.");
const confirmIt = await ask(rejectPage.page, "Confirm it.");
await rejectPage.page.close();
await browser.close();

const liveReport = {
  phase: "NEX-EXP:7",
  identity: "NEX-EXP:7/ManagerDecisionCommitmentExperience",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  decisionQuestion: /Should we proceed with /i.test(deciding.last),
  recommendationExplained: /recommend|tied|withhold/i.test(`${rec.last} ${why.last}`),
  briefVisible: /benefit|sacrifice|Status: Not approved/i.test(
    `${accept.last} ${risks.last}`,
  ),
  uncertaintyVisible: /uncertain|unknown/i.test(uncertain.last),
  preferenceNotCommit: /has not been approved/i.test(prefer.last),
  notDecidedBeforeConfirm: /No/i.test(`${decided1.last} ${decided2.last}`),
  confirmationAsked: /Confirm\?/i.test(go.last),
  committed: /Decision committed/i.test(yes.last) && yes.committed === "true",
  executionNotStarted:
    /Execution has not started/i.test(`${yes.last} ${exec.last}`) &&
    yes.startsExecution === "false",
  decidedKnown: /committed|KNOWN|PREDICTED/i.test(`${what.last} ${whyDecide.last}`),
  nextIsPlanning: /execution planning|has not started/i.test(next.last),
  cameraFixed: yes.camera === "fixed-2d",
  topologyPresent: Boolean(yes.topologyZ),
  goalCenterPreserved: yes.focused === "goal-executive-discovered",
  moStillWorks: show.last.length > 8 && explain.last.length > 8 && /goal/i.test(affect.last),
  rejectOrConfirm: /reject|Confirm\?/i.test(no.last),
  deferral: /Deferred|uncommitted/i.test(wait.last),
  chooseOther: /not been approved|not blocked/i.test(chooseB.last),
  whyOver: whyAB.last.length > 8,
  deicticConfirm: /Decision committed|Confirm\?|reject/i.test(confirmIt.last),
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
  console.error("NEX-EXP:7 live cert failed", { missing, errors });
  process.exit(1);
}

console.log(JSON.stringify(liveReport, null, 2));
