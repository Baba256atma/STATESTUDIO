/**
 * NEX-ENT:4 — live /executive Advisor & guided conversation proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent4-guided-conversation");
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
    const managerMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-manager"]'),
    ].map((node) => node.textContent ?? "");
    const suggestions = [...document.querySelectorAll("[data-suggestion-kind]")].map((node) => ({
      id: node.getAttribute("data-testid"),
      kind: node.getAttribute("data-suggestion-kind"),
      label: node.textContent ?? "",
    }));
    const jargon = /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|graph vertex/i.test(
      nexoraMessages.join(" "),
    );
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent2State: shell?.getAttribute("data-nex-ent2-state"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      ent4State: shell?.getAttribute("data-nex-ent4-state"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      focusedSubject: shell?.getAttribute("data-focused-subject"),
      goal: shell?.getAttribute("data-nex-exp2-goal"),
      goalConfirmed: shell?.getAttribute("data-nex-exp2-confirmed"),
      issueCount: shell?.getAttribute("data-nex-exp4-object-count"),
      scenarioCount: shell?.getAttribute("data-nex-exp5-object-count"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      last: nexoraMessages.at(-1) ?? "",
      lastManager: managerMessages.at(-1) ?? "",
      messageCount: nexoraMessages.length,
      suggestions,
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

async function clickSuggestion(page, testId) {
  const button = page.locator(`[data-testid="${testId}"]`);
  if (await button.count()) {
    await button.click();
    await page.waitForTimeout(500);
  }
  return snapshot(page);
}

async function reachConversationAsk(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 8; index += 1) {
    await ask(page, "Show me the next one");
  }
  return ask(page, "Show me the next one");
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

const asked = await reachConversationAsk(first.page);
await first.page.screenshot({ path: join(OUT, "02-conversation-ask.png") });

const what = await clickSuggestion(first.page, "nexora-guided-entrance-action-what-is-this");
await first.page.screenshot({ path: join(OUT, "03-ask-what-is-this.png") });

const showLesson = await ask(first.page, "Show me the next one");
const shown = await ask(first.page, "Show me the problems");
await first.page.screenshot({ path: join(OUT, "04-show-problems.png") });

const explainLesson = await ask(first.page, "Show me the next one");
await first.page.locator('[data-testid="nexora-stage-object-list"]').evaluate((el) => {
  el.open = true;
});
const problemControl = first.page.locator(
  '[data-testid="nexora-stage-object-control-obj-nex-ent3-problem"]',
);
if (await problemControl.count()) {
  await problemControl.click({ force: true });
  await first.page.waitForTimeout(400);
}
const selected = await snapshot(first.page);
const explained = await ask(first.page, "Explain this");
const why = await ask(first.page, "Why?");
await first.page.screenshot({ path: join(OUT, "05-explain-why.png") });

const investigateLesson = await ask(first.page, "Show me the next one");
const investigated = await ask(first.page, "Investigate this");
await first.page.screenshot({ path: join(OUT, "06-investigate.png") });

const compareLesson = await ask(first.page, "Show me the next one");
const compared = await ask(first.page, "Compare these");
const choose = await ask(first.page, "Which one should I choose?");
const correction = await ask(first.page, "No, I meant the other Scenario");
const ambiguous = await ask(first.page, "Show me that one");
await first.page.screenshot({ path: join(OUT, "07-compare.png") });

const unknownHonest = await ask(first.page, "I don't know");
const typo = await ask(first.page, "show me the problms");
const data = await ask(first.page, "How do I add my data?");
const unknown = await ask(first.page, "please frobnicate the quantiles");
const recap = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "08-review.png") });

const beforeRefreshCount = recap.messageCount;
await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "09-refresh.png") });
await first.page.close();

const skipSession = await open(ENTRANCE);
await skipSession.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachConversationAsk(skipSession.page);
const skipped = await ask(skipSession.page, "Skip this");
await skipSession.page.screenshot({ path: join(OUT, "10-skip.png") });
await skipSession.page.close();

const liveReport = {
  phase: "NEX-ENT:4",
  identity: "NEX-ENT:4/AdvisorGuidedConversation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent4State === "NOT_STARTED" || existingSnapshot.ent4State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  conversationBegan:
    asked.ent4State === "ASK" && /need commands/i.test(asked.last),
  usedSuggestedQuestion:
    what.suggestions.some((item) => item.kind === "question") ||
    /problem|goal|object/i.test(what.last),
  naturalLanguageShow: !/SHOW\(PROBLEM\)|\/investigate/i.test(shown.last),
  selectedEducationalProblem:
    selected.focusedSubject === "obj-nex-ent3-problem" ||
    selected.educationalIds.includes("obj-nex-ent3-problem"),
  explainThis: /problem/i.test(explained.last),
  whyContinuity: !/already inside the nexora executive workspace/i.test(why.last),
  investigateNoCause: !/the cause is|caused by late trucks/i.test(investigated.last),
  compareNoWinner: !/winner|objectively better|lower cost/i.test(compared.last),
  noCommitment: choose.decisionState === "none" || choose.decisionState == null,
  correctionSafe: !/invalid command/i.test(correction.last),
  ambiguityNotGuessedByEnt: ambiguous.ent4State === "COMPARE",
  iDontKnowSafe: /have to decide|fine/i.test(unknownHonest.last),
  dataHighLevel: /shortly/i.test(data.last) && !/data rail|csv picker/i.test(data.last),
  unknownNoBusinessWrite:
    unknown.goalConfirmed === "false" && unknown.goal === "none",
  recapComplete: recap.ent4State === "REVIEW" || recap.ent4State === "COMPLETED",
  refreshNoDuplicateActors:
    refreshed.objectCount === 1 &&
    (refreshed.ent4State === "NOT_STARTED" || refreshed.ent4State === "INACTIVE"),
  skipSafe: skipped.mode === "existing-workspace",
  questionVersusAnswer:
    asked.suggestions.some((item) => item.kind === "question") &&
    asked.suggestions.some((item) => item.kind === "answer"),
  noBusinessWrites:
    asked.sufficiency === "INSUFFICIENT" &&
    recap.goalConfirmed === "false" &&
    recap.goal === "none" &&
    recap.issueCount === "0" &&
    recap.scenarioCount === "0",
  noDeveloperJargon: intro.jargon === false && asked.jargon === false && recap.jargon === false,
  uncaught: errors.length,
  beforeRefreshCount,
  duplicateOrHydration: [...errors, ...warnings].filter((text) => /unique key|hydration/i.test(text)),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "entranceActivated",
  "conversationBegan",
  "naturalLanguageShow",
  "explainThis",
  "whyContinuity",
  "investigateNoCause",
  "compareNoWinner",
  "noCommitment",
  "correctionSafe",
  "iDontKnowSafe",
  "dataHighLevel",
  "unknownNoBusinessWrite",
  "refreshNoDuplicateActors",
  "skipSafe",
  "questionVersusAnswer",
  "noBusinessWrites",
  "noDeveloperJargon",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
