/**
 * NEX-ENT-FIX1 — live entrance conversation continuity proof.
 * Uses NEXORA_BASE_URL. Does not assume :3000.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent-fix1-conversation-continuity");
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
    const suggested = [
      ...document.querySelectorAll("[data-suggestion-kind]"),
    ].map((node) => node.textContent?.trim() ?? "");
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent2State: shell?.getAttribute("data-nex-ent2-state"),
      ent2Focus: shell?.getAttribute("data-nex-ent2-focus"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      last: nexoraMessages.at(-1) ?? "",
      messages: nexoraMessages.slice(-12),
      suggested,
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|repeatCount/i.test(
        nexoraMessages.slice(-8).join(" "),
      ),
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

const cap1 = await ask(first.page, "What can Nexora do?");
await first.page.screenshot({ path: join(OUT, "02-capability-1.png") });
const cap2 = await ask(first.page, "What can Nexora do?");
await first.page.screenshot({ path: join(OUT, "03-capability-2.png") });
const show = await ask(first.page, "Show me");
const appears = await ask(first.page, "What appears here?");
const focus = await ask(first.page, "Show me how focus works");
await first.page.screenshot({ path: join(OUT, "04-focus-show.png") });
const explain = await ask(first.page, "Explain first");
await first.page.screenshot({ path: join(OUT, "05-explain-after-show.png") });
const focusAgain = await ask(first.page, "Show me how focus works");
const explainAgain = await ask(first.page, "Explain first");
await first.page.screenshot({ path: join(OUT, "06-explain-after-repeat.png") });
const why = await ask(first.page, "Why?");
const explainIt = await ask(first.page, "Explain it");
const doAgain = await ask(first.page, "Do it again");
const nextLesson = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "07-next-lesson.png") });

await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "08-refresh.png") });
await first.page.close();

const skipPage = await open(ENTRANCE);
await skipPage.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const skipped = await ask(skipPage.page, "Skip introduction");
await skipPage.page.screenshot({ path: join(OUT, "09-skip.png") });
await skipPage.page.close();

const staleOffer =
  /I can show you that now/i.test(explain.last) ||
  /I can show you that now/i.test(explainAgain.last);
const looped =
  cap1.last === cap2.last ||
  (explain.last === explainAgain.last && /I can show you that now/i.test(explain.last));

const liveReport = {
  phase: "NEX-ENT-FIX1",
  identity: "NEX-ENT-FIX1/EntranceConversationContinuity",
  completedAt: new Date().toISOString(),
  base: BASE,
  http: first.http,
  transcript: [
    cap1,
    cap2,
    show,
    appears,
    focus,
    explain,
    focusAgain,
    explainAgain,
    why,
    explainIt,
    doAgain,
    nextLesson,
  ].map((turn) => ({ utterance: turn.utterance, last: turn.last })),
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.entState === "INACTIVE",
  capabilityDeepened: cap1.last !== cap2.last && /Goals, data, Problems/i.test(cap2.last),
  showAfterCapability: /this is your stage/i.test(show.last),
  appearsRetained: /relevant things/i.test(appears.last),
  focusDemonstrated: /brought Nexora into focus/i.test(focus.last) && focus.snap.ent2Focus === "true",
  explainAfterShow: /Focus means choosing/i.test(explain.last) && !staleOffer,
  repeatShowAware: /show it again/i.test(focusAgain.last),
  explainAfterRepeat: /Stage staying organized|Focus means choosing/i.test(explainAgain.last),
  noStaleShowOffer: !staleOffer,
  noBlindLoop: !looped,
  whyKeptFocus: /clutter|related context|Focus/i.test(why.last),
  deicticExplain: /Focus|Stage/i.test(explainIt.last),
  doItAgain: /show it again|brought Nexora into focus/i.test(doAgain.last),
  nextLessonObject: /goal/i.test(nextLesson.last) && nextLesson.snap.ent3State !== "NOT_STARTED",
  nextLessonNotHijackedByFocus: !/I can show you that now/i.test(nextLesson.last),
  skipPreserved: /workspace as it is/i.test(skipped.last),
  refreshDidNotDuplicate:
    refreshed.objectCount <= Math.max(intro.objectCount, focus.snap.objectCount) + 8,
  jargonFree:
    !cap1.snap.jargon &&
    !explain.snap.jargon &&
    !nextLesson.snap.jargon,
  runtimeErrors: errors.filter((item) => !/hydration|Minified React error #418/i.test(item)),
};

liveReport.passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.capabilityDeepened &&
  liveReport.showAfterCapability &&
  liveReport.appearsRetained &&
  liveReport.focusDemonstrated &&
  liveReport.explainAfterShow &&
  liveReport.repeatShowAware &&
  liveReport.explainAfterRepeat &&
  liveReport.noStaleShowOffer &&
  liveReport.noBlindLoop &&
  liveReport.whyKeptFocus &&
  liveReport.deicticExplain &&
  liveReport.doItAgain &&
  liveReport.nextLessonObject &&
  liveReport.nextLessonNotHijackedByFocus &&
  liveReport.skipPreserved &&
  liveReport.jargonFree &&
  liveReport.runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();

if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
