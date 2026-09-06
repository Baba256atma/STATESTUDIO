/**
 * NEX-CONV:1 — live Conversation Kernel proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-conv1-conversation-kernel");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3000";
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
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      convSubject: shell?.getAttribute("data-nex-conv-subject"),
      convPurpose: shell?.getAttribute("data-nex-conv-purpose"),
      convMove: shell?.getAttribute("data-nex-conv-move"),
      convCoverage: shell?.getAttribute("data-nex-conv-coverage"),
      convReason: shell?.getAttribute("data-nex-conv-reason"),
      last: nexoraMessages.at(-1) ?? "",
      suggested: [
        ...document.querySelectorAll('[data-testid="nexora-suggested-action"], [data-kind="question"], [data-kind="answer"]'),
      ]
        .slice(0, 8)
        .map((node) => node.textContent ?? ""),
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

function uniqueProgression(texts) {
  return new Set(texts).size >= 3;
}

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
const existingExplain = await ask(existing.page, "Explain it.");
const existingMore = await ask(existing.page, "Tell me more.");
const existingWhy = await ask(existing.page, "Why?");
await existing.page.screenshot({ path: join(OUT, "04-normal-executive.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(first.page, "Show me");
await ask(first.page, "Show me how focus works");
await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "01-goal-education.png") });
const w1 = await ask(first.page, "What is this?");
const w2 = await ask(first.page, "What is this?");
const w3 = await ask(first.page, "What is this?");
const w4 = await ask(first.page, "What is this?");
const w5 = await ask(first.page, "What is this?");
await first.page.screenshot({ path: join(OUT, "02-goal-what-is-this.png") });
const y1 = await ask(first.page, "Why is it on Stage?");
const y2 = await ask(first.page, "Why is it on Stage?");
const y3 = await ask(first.page, "Why is it on Stage?");
const y4 = await ask(first.page, "Why is it on Stage?");
await first.page.screenshot({ path: join(OUT, "03-goal-why.png") });
await ask(first.page, "Show me the next one");
const k1 = await ask(first.page, "What is this?");
const k2 = await ask(first.page, "What is this?");
const k3 = await ask(first.page, "What is this?");
await first.page.close();

const liveReport = {
  phase: "NEX-CONV:1",
  identity: "NEX-CONV:1/ConversationKernel",
  completedAt: new Date().toISOString(),
  base: BASE,
  http: first.http,
  existingWorkspace: existingSnapshot.mode,
  goalWhat: [w1, w2, w3, w4, w5].map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    subject: turn.convSubject,
    purpose: turn.convPurpose,
    move: turn.convMove,
    coverage: turn.convCoverage,
    reason: turn.convReason,
  })),
  goalWhy: [y1, y2, y3, y4].map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    move: turn.convMove,
    purpose: turn.convPurpose,
    coverage: turn.convCoverage,
  })),
  nextObject: [k1, k2, k3].map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    move: turn.convMove,
    subject: turn.convSubject,
  })),
  normalExecutive: [existingExplain, existingMore, existingWhy].map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
  })),
  goalNoInfiniteRepeat: uniqueProgression([w1.last, w2.last, w3.last, w4.last]),
  whyNoInfiniteRepeat: uniqueProgression([y1.last, y2.last, y3.last, y4.last]),
  nextObjectFresh: /kpi/i.test(k1.last) && k1.last !== w4.last,
  nextObjectProgresses: k2.last !== k1.last,
  normalAdvisorResponded: existingExplain.last.length > 8 && existingWhy.last.length > 8,
  runtimeErrors: errors.filter((item) => !/hydration|Minified React error #418/i.test(item)),
};

liveReport.passed =
  liveReport.goalNoInfiniteRepeat &&
  liveReport.whyNoInfiniteRepeat &&
  liveReport.nextObjectFresh &&
  liveReport.nextObjectProgresses &&
  liveReport.normalAdvisorResponded &&
  liveReport.runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
