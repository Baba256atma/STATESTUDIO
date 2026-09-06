/**
 * NEX-CONV:2-FIX1 — live Entrance intent routing proof.
 * Uses NEXORA_BASE_URL. Does not assume :3000.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-conv2-fix1-entrance-intent-routing");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3014";
const EXISTING = `${BASE}/executive`;
const ENTRANCE = `${BASE}/executive?entrance=1&reset=1`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

function attachConsole(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
}

async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
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
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      experience: shell?.getAttribute("data-executive-experience-context"),
      ent1State: shell?.getAttribute("data-nex-ent1-state"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      convSubject: shell?.getAttribute("data-nex-conv-subject"),
      convPurpose: shell?.getAttribute("data-nex-conv-purpose"),
      convMove: shell?.getAttribute("data-nex-conv-move"),
      convCoverage: shell?.getAttribute("data-nex-conv-coverage"),
      convReason: shell?.getAttribute("data-nex-conv-reason"),
      threadObjective: shell?.getAttribute("data-nex-conv2-objective"),
      threadSubject: shell?.getAttribute("data-nex-conv2-subject"),
      threadStatus: shell?.getAttribute("data-nex-conv2-status"),
      threadCovered: shell?.getAttribute("data-nex-conv2-covered"),
      threadTurn: shell?.getAttribute("data-nex-conv2-turn"),
      threadMove: shell?.getAttribute("data-nex-conv2-move"),
      threadReason: shell?.getAttribute("data-nex-conv2-reason"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      last: nexoraMessages.at(-1) ?? "",
      suggested: [
        ...document.querySelectorAll(
          "[data-testid='nexora-guided-entrance-suggested-actions'] [data-testid^='nexora-guided-entrance-action-']",
        ),
      ].map((node) => node.textContent ?? ""),
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
  const snap = await snapshot(page);
  return { utterance, ...snap };
}

const existing = await open(EXISTING);
const existingWhyProblem = await ask(existing.page, "Why is this Problem important?");
const existingInvestigate = await ask(existing.page, "Why should I investigate it?");
const existingCausal = await ask(existing.page, "Why do you think it happened?");
const existingCollection = await ask(existing.page, "Show problems.");
const existingWhich = await ask(existing.page, "Which one first?");
const existingWhy = await ask(existing.page, "Why?");
const existingCompare = await ask(existing.page, "Compare them.");
await existing.page.screenshot({ path: join(OUT, "08-normal-executive.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const welcome = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "00-welcome.png") });
const r1 = await ask(first.page, "Why is this important?");
await first.page.screenshot({ path: join(OUT, "01-why-important-1.png") });
const r2 = await ask(first.page, "Why is this important?");
await first.page.screenshot({ path: join(OUT, "02-why-important-2.png") });
const r3 = await ask(first.page, "Why is this important?");
await first.page.screenshot({ path: join(OUT, "03-why-important-3.png") });
const r4 = await ask(first.page, "Why is this important?");
await first.page.screenshot({ path: join(OUT, "04-why-important-4.png") });

let shown;
const showChip = first.page.locator('[data-testid="nexora-guided-entrance-action-continue"]');
if (await showChip.count()) {
  await showChip.click();
  await first.page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await first.page.waitForTimeout(400);
  shown = { utterance: "Show me (chip)", ...(await snapshot(first.page)) };
} else {
  shown = await ask(first.page, "Show me");
}
await first.page.screenshot({ path: join(OUT, "05-show-me.png") });
const explainThat = await ask(first.page, "Explain that.");
const whyFollow = await ask(first.page, "Why?");
const whatNext = await ask(first.page, "What next?");
await first.page.screenshot({ path: join(OUT, "06-post-show.png") });
const status = await ask(first.page, "Is NEXORA stable?");
await first.page.screenshot({ path: join(OUT, "07-status.png") });

await ask(first.page, "Show me");
await ask(first.page, "Show me how focus works");
await ask(first.page, "Show me the next one");
const g1 = await ask(first.page, "What is this?");
const g2 = await ask(first.page, "What is this?");
const g3 = await ask(first.page, "What is this?");
const gy = await ask(first.page, "Why is it on Stage?");
const gd = await ask(first.page, "What's the difference?");
const g4 = await ask(first.page, "What is this?");
const stage = first.page.locator('[data-testid="nexora-3d-executive-stage"] canvas');
const box = await stage.boundingBox();
if (box) {
  await first.page.mouse.click(box.x + 24, box.y + 24);
  await first.page.waitForTimeout(500);
}
const afterBg = await snapshot(first.page);
const skipped = await ask(first.page, "Skip this");
const afterSkip = await ask(first.page, "Explain Capacity Gap.");
await first.page.close();

const classifiedErrors = errors.filter((item) => /hydration|Minified React error #418/i.test(item));
const runtimeErrors = errors.filter((item) => !/hydration|Minified React error #418/i.test(item));

const turns = [r1, r2, r3, r4];
const liveReport = {
  phase: "NEX-CONV:2-FIX1",
  identity: "NEX-CONV:2-FIX1/EntranceIntentRouting",
  completedAt: new Date().toISOString(),
  base: BASE,
  welcome: welcome.last,
  relevanceTurns: turns.map((turn) => ({
    text: turn.last,
    purpose: turn.convPurpose,
    move: turn.convMove,
    coverage: turn.convCoverage,
    threadObjective: turn.threadObjective,
    threadMove: turn.threadMove,
    suggested: turn.suggested,
    goalState: turn.goalState,
    decisionState: turn.decisionState,
  })),
  shown,
  explainThat: explainThat.last,
  whyFollow: whyFollow.last,
  whatNext: whatNext.last,
  status: status.last,
  conv1Goal: [g1.convMove, g2.convMove, g3.convMove],
  conv2Goal: { purpose: gy.convPurpose, difference: gd.convMove, final: g4.threadMove },
  afterBackgroundExperience: afterBg.experience,
  skipClearsNextObject: !skipped.suggested.some((item) => /next one/i.test(item)),
  existing: {
    whyProblem: existingWhyProblem.last,
    investigate: existingInvestigate.last,
    causal: existingCausal.last,
    collection: existingCollection.last,
    which: existingWhich.last,
    why: existingWhy.last,
    compare: existingCompare.last,
    leak: existingWhyProblem.suggested.some((item) => /next one|Skip lesson/i.test(item)),
  },
  classifiedErrors,
  runtimeErrors,
};

liveReport.noStableOnRelevance = turns.every((turn) => !/NEXORA is stable/i.test(turn.last));
liveReport.firstRelevant = /situation|evidence|decision|attention/i.test(r1.last);
liveReport.progressed = new Set(turns.map((turn) => turn.last)).size >= 3;
liveReport.hasShowAction = turns.some((turn) => turn.suggested.some((item) => /show me/i.test(item)));
liveReport.showHandoff = /Stage/i.test(shown.last);
liveReport.statusStillWorks = /stable/i.test(status.last);
liveReport.conv1Progressed = g1.convMove !== g3.convMove || g1.convCoverage !== g3.convCoverage;
liveReport.threadParticipated = turns.some((turn) => turn.threadObjective === "LEARN_CAPABILITY");
liveReport.fix3Held = /entrance|guided|education/i.test(afterBg.experience ?? "") || afterBg.mode !== "existing";
liveReport.zeroBusinessWrites =
  [...turns, shown, skipped, afterSkip, g4].every(
    (turn) => (turn.goalState ?? "none") === "none" && (turn.decisionState ?? "none") === "none",
  );
liveReport.noEducationalLeak = liveReport.existing.leak !== true;
liveReport.causalDistinct = !/keeps the situation, evidence, options/i.test(existingCausal.last);
liveReport.passed =
  liveReport.noStableOnRelevance &&
  liveReport.firstRelevant &&
  liveReport.progressed &&
  liveReport.hasShowAction &&
  liveReport.showHandoff &&
  liveReport.statusStillWorks &&
  liveReport.threadParticipated &&
  liveReport.zeroBusinessWrites &&
  liveReport.noEducationalLeak &&
  liveReport.causalDistinct &&
  runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
