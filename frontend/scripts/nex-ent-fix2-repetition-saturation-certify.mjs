/**
 * NEX-ENT-FIX2 — live repetition saturation proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent-fix2-repetition-saturation");
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
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent2Focus: shell?.getAttribute("data-nex-ent2-focus"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      last: nexoraMessages.at(-1) ?? "",
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
  return { utterance, last: snap.last, snap };
}

function examplesLoop(text) {
  return /Goal, a KPI, a Problem or Risk/i.test(text);
}

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const shown = await ask(first.page, "Show me");
const dashboard = await ask(first.page, "Is this a dashboard?");
const a1 = await ask(first.page, "What appears here?");
const a2 = await ask(first.page, "What appears here?");
const a3 = await ask(first.page, "What appears here?");
const a4 = await ask(first.page, "What appears here?");
await first.page.screenshot({ path: join(OUT, "01-appears-saturation.png") });
const focus = await ask(first.page, "Show me how focus works");
const explain = await ask(first.page, "Explain that.");
const why = await ask(first.page, "Why?");
const again = await ask(first.page, "Show me again.");
const now = await ask(first.page, "What appears here now?");
const nextLesson = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "02-after-focus.png") });
await first.page.close();

const capPage = await open(ENTRANCE);
await capPage.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const c1 = await ask(capPage.page, "What can Nexora do?");
const c2 = await ask(capPage.page, "What do you do?");
const c3 = await ask(capPage.page, "How can you help me?");
const c4 = await ask(capPage.page, "What can Nexora do?");
await capPage.page.close();

const repeatPage = await open(ENTRANCE);
await repeatPage.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(repeatPage.page, "Show me");
const appears = await ask(repeatPage.page, "What appears here?");
const exact = await ask(repeatPage.page, "Repeat exactly what you said.");
await repeatPage.page.close();

const liveReport = {
  phase: "NEX-ENT-FIX2",
  identity: "NEX-ENT-FIX1/EntranceConversationContinuity",
  completedAt: new Date().toISOString(),
  base: BASE,
  http: first.http,
  transcript: [shown, dashboard, a1, a2, a3, a4, focus, explain, why, again, now, nextLesson].map(
    (turn) => ({ utterance: turn.utterance, last: turn.last }),
  ),
  capability: [c1, c2, c3, c4].map((turn) => ({ utterance: turn.utterance, last: turn.last })),
  existingWorkspaceProtected: existingSnapshot.mode === "existing-workspace" && existingSnapshot.entState === "INACTIVE",
  dashboardPreserved: /isn.t a fixed dashboard/i.test(dashboard.last),
  appearsAnswer: /relevant things from the current situation/i.test(a1.last),
  appearsDeepen: examplesLoop(a2.last),
  appearsProgress: !examplesLoop(a3.last) && /Focus/i.test(a3.last),
  appearsClarify: /I may not be answering the part you mean/i.test(a4.last),
  noExamplesLoop: a3.last !== a2.last && a4.last !== a2.last,
  focusAfter: /brought Nexora into focus|show it again/i.test(focus.last),
  explainThatFocus: /Focus|Stage staying organized/i.test(explain.last),
  whyFocus: /clutter|related context|Focus/i.test(why.last),
  repeatShow: /show it again|brought Nexora into focus/i.test(again.last),
  appearsNow: /right now/i.test(now.last),
  nextLessonObject: /goal/i.test(nextLesson.last),
  capabilitySaturated: c1.last !== c2.last && c3.last !== c4.last && /I may not be answering|Show me|Stage/i.test(c4.last + c3.last),
  exactRepeat: exact.last === appears.last || appears.last.includes(exact.last.slice(0, 40)),
  runtimeErrors: errors.filter((item) => !/hydration|Minified React error #418/i.test(item)),
};

liveReport.passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.dashboardPreserved &&
  liveReport.appearsAnswer &&
  liveReport.appearsDeepen &&
  liveReport.appearsProgress &&
  liveReport.appearsClarify &&
  liveReport.noExamplesLoop &&
  liveReport.focusAfter &&
  liveReport.explainThatFocus &&
  liveReport.whyFocus &&
  liveReport.repeatShow &&
  liveReport.appearsNow &&
  liveReport.nextLessonObject &&
  liveReport.capabilitySaturated &&
  liveReport.exactRepeat &&
  liveReport.runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
