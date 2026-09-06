/**
 * NEX-ENT:5 — live /executive Guided Attention proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent5-guided-attention");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3000";
const EXISTING = `${BASE}/executive`;
const ENTRANCE = `${BASE}/executive?entrance=1&reset=1`;

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
    const data = document.querySelector('[data-testid="nexora-stage-data-control"]');
    const stage = document.querySelector('[data-testid="executive-stage-frame"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    const suggestions = [...document.querySelectorAll("[data-suggestion-kind]")].map((node) => ({
      kind: node.getAttribute("data-suggestion-kind"),
      label: node.textContent ?? "",
    }));
    const jargon = /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|graph vertex/i.test(
      nexoraMessages.join(" "),
    );
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent4State: shell?.getAttribute("data-nex-ent4-state"),
      ent5State: shell?.getAttribute("data-nex-ent5-state"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      gaCue: shell?.getAttribute("data-guided-attention-cue"),
      gaActive: shell?.getAttribute("data-guided-attention-active"),
      gaAvailability: shell?.getAttribute("data-guided-attention-availability"),
      dataCue: data?.getAttribute("data-guided-attention-cue"),
      dataRail: data?.getAttribute("data-data-rail-open"),
      stageCue: stage?.getAttribute("data-guided-attention-cue"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      focusedSubject: shell?.getAttribute("data-focused-subject"),
      goal: shell?.getAttribute("data-nex-exp2-goal"),
      goalConfirmed: shell?.getAttribute("data-nex-exp2-confirmed"),
      issueCount: shell?.getAttribute("data-nex-exp4-object-count"),
      scenarioCount: shell?.getAttribute("data-nex-exp5-object-count"),
      last: nexoraMessages.at(-1) ?? "",
      suggestions,
      jargon,
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

async function reachAttentionIntro(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 15; index += 1) {
    await ask(page, "Show me the next one");
  }
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

const attention = await reachAttentionIntro(first.page);
await first.page.screenshot({ path: join(OUT, "02-attention-intro.png") });

const contextual = await ask(first.page, "Show me");
await first.page.screenshot({ path: join(OUT, "03-data-guidance.png") });
const dataOpen = contextual.dataRail === "true";

await first.page.waitForTimeout(3500);
const expired = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "04-expiry.png") });

const replay = await ask(first.page, "How do I add my data?");
const second = await ask(first.page, "Where do objects appear?");
await first.page.screenshot({ path: join(OUT, "05-second-target.png") });
const replacement = second.gaTarget === "STAGE" && replay.gaTarget === "DATA_ENTRY";

await first.page.locator('[data-testid="nexora-stage-object-list"]').evaluate((el) => {
  el.open = true;
});
const problem = first.page.locator('[data-testid="nexora-stage-object-control-obj-nex-ent3-problem"]');
if (await problem.count()) {
  await problem.click({ force: true });
  await first.page.waitForTimeout(400);
}
const focused = await snapshot(first.page);
const afterFocus = await ask(first.page, "Where is Data?");
await first.page.screenshot({ path: join(OUT, "06-focus-and-show.png") });

const collection = await ask(first.page, "Show me the problems");
const missing = await ask(first.page, "How do I go back?");
const during = await ask(first.page, "Why do I need it?");

await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "07-refresh.png") });
await first.page.close();

const skipSession = await open(ENTRANCE);
await skipSession.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachAttentionIntro(skipSession.page);
await ask(skipSession.page, "How do I add my data?");
const skipped = await ask(skipSession.page, "Skip this");
await skipSession.page.screenshot({ path: join(OUT, "08-skip.png") });
await skipSession.page.close();

const reduced = await open(ENTRANCE, { reducedMotion: "reduce" });
await reduced.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachAttentionIntro(reduced.page);
const reducedData = await ask(reduced.page, "How do I add my data?");
await reduced.page.screenshot({ path: join(OUT, "09-reduced-motion.png") });
await reduced.page.close();

const liveReport = {
  phase: "NEX-ENT:5",
  identity: "NEX-ENT:5/GuidedAttentionEducation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent5State === "NOT_STARTED" || existingSnapshot.ent5State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  attentionBegan:
    attention.ent5State === "INTRODUCING" && /attention|where something is/i.test(attention.last),
  contextualShowMe:
    contextual.gaTarget === "DATA_ENTRY" &&
    contextual.dataCue !== "none" &&
    /use data/i.test(contextual.last),
  noAutoOpen: dataOpen === false,
  expiry: expired.gaCue === "none" || expired.gaActive === "false",
  replay: replay.gaTarget === "DATA_ENTRY" && replay.dataCue !== "none",
  secondTarget: second.gaTarget === "STAGE" && second.stageCue !== "none",
  replacement,
  focusPreserved:
    !focused.focusedSubject ||
    afterFocus.focusedSubject === focused.focusedSubject ||
    afterFocus.gaTarget === "DATA_ENTRY",
  collectionNotAttention: collection.gaTarget !== "DATA_ENTRY" || /problem|issue/i.test(collection.last),
  missingBackSafe:
    missing.gaAvailability === "UNAVAILABLE" || /isn.t available|back/i.test(missing.last),
  conversationDuring: during.last.length > 8,
  skipClears: skipped.mode === "existing-workspace" && (skipped.gaActive === "false" || skipped.gaCue === "none"),
  refreshNoLeak:
    refreshed.objectCount === 1 &&
    (refreshed.ent5State === "NOT_STARTED" || refreshed.ent5State === "INACTIVE") &&
    (refreshed.gaCue === "none" || refreshed.gaCue == null),
  reducedMotion:
    reducedData.gaCue === "EMPHASIS" || /use data/i.test(reducedData.last),
  questionVersusAnswer:
    attention.suggestions.some((item) => item.kind === "question") &&
    attention.suggestions.some((item) => item.kind === "answer"),
  noBusinessWrites:
    attention.sufficiency === "INSUFFICIENT" &&
    afterFocus.goalConfirmed === "false" &&
    afterFocus.goal === "none",
  noDeveloperJargon: intro.jargon === false && attention.jargon === false,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) => /unique key|hydration/i.test(text)),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "entranceActivated",
  "attentionBegan",
  "contextualShowMe",
  "noAutoOpen",
  "expiry",
  "replay",
  "secondTarget",
  "replacement",
  "skipClears",
  "refreshNoLeak",
  "reducedMotion",
  "questionVersusAnswer",
  "noBusinessWrites",
  "noDeveloperJargon",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
