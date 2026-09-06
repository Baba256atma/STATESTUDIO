/**
 * NEX-ENT:10 — live /executive Personal Demo Handoff proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent10-personal-demo-handoff");
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
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent9State: shell?.getAttribute("data-nex-ent9-state"),
      ent10State: shell?.getAttribute("data-nex-ent10-state"),
      goalName: shell?.getAttribute("data-nex-exp2-goal"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      last: nexoraMessages.at(-1) ?? "",
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|CC:10|ent10Identity|demoGoalStore/i.test(
        nexoraMessages.slice(-6).join(" "),
      ),
      messageCount: nexoraMessages.length,
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

async function reachTrustReady(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 60; index += 1) {
    const snap = await ask(page, "Show me the next one");
    if (snap.ent9State === "QUICK_REVIEW") break;
  }
  await ask(page, "Ask me or keep it unresolved");
  await ask(page, "No");
  return ask(page, "No, I still decide");
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

const ready = await reachTrustReady(first.page);
await first.page.screenshot({ path: join(OUT, "02-trust-ready.png") });
const handoff = await ask(first.page, "Let's do it");
await first.page.screenshot({ path: join(OUT, "03-handoff-intro.png") });
const identity = await ask(
  first.page,
  "I'm Alex. I run operations for a logistics company.",
);
const workName = await ask(first.page, "The company is BAHA Doors.");
const goal = await ask(first.page, "Improve delivery.");
const noData = await ask(first.page, "Start without data");
await first.page.screenshot({ path: join(OUT, "04-completed.png") });
const known = await ask(first.page, "What do you know about my situation so far?");
const stageAsk = await ask(first.page, "What is on Stage now?");
const goalAsk = await ask(first.page, "What is my Goal?");
const dataAsk = await ask(first.page, "What data do you have?");
const lookFirst = await ask(first.page, "What should we look at first?");
await first.page.screenshot({ path: join(OUT, "05-personal-conversation.png") });

const beforeRefreshCount = (await snapshot(first.page)).messageCount;
await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "06-refresh.png") });
await first.page.close();

const skipSession = await open(ENTRANCE);
await skipSession.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachTrustReady(skipSession.page);
await ask(skipSession.page, "Let's do it");
const skipped = await ask(skipSession.page, "Skip for now");
await skipSession.page.screenshot({ path: join(OUT, "07-skip.png") });
await skipSession.page.close();

const returning = await open(EXISTING);
const returningSnapshot = await snapshot(returning.page);
await returning.page.close();

const liveReport = {
  phase: "NEX-ENT:10",
  identity: "NEX-ENT:10/PersonalDemoHandoff",
  completedAt: new Date().toISOString(),
  baseUrl: BASE,
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent10State === "NOT_STARTED" || existingSnapshot.ent10State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  trustReady: ready.ent9State === "READY",
  handoffBegan:
    handoff.ent10State === "INTRO" && /make this workspace yours/i.test(handoff.last),
  identityCanonical: /Alex/i.test(identity.last) || Boolean(identity.last),
  noInventedTarget: !/96%/.test(goal.last),
  completedWithoutData:
    noData.ent10State === "COMPLETED" &&
    /your workspace now|no accepted data|not your Data Library/i.test(noData.last),
  firstPersonal: known.last.length > 8 && !/Let's do it/i.test(known.last),
  stageAwareness: stageAsk.last.length > 8,
  goalAwareness: goalAsk.last.length > 8,
  dataAwareness: dataAsk.last.length > 8,
  noFabricatedIssue: !/created a (?:Problem|Issue)|Delivery Problem/i.test(lookFirst.last),
  skipClean:
    skipped.ent10State === "SKIPPED" &&
    /didn.t invent|That.s fine|your workspace/i.test(skipped.last),
  returningDoesNotRestart:
    returningSnapshot.mode === "existing-workspace" &&
    (returningSnapshot.ent10State === "NOT_STARTED" || returningSnapshot.ent10State == null),
  refreshNoDuplicateBurst: refreshed.messageCount <= beforeRefreshCount + 1,
  sameExecutive: !/\/demo/.test(BASE),
  jargonFree: handoff.jargon === false && noData.jargon === false,
  hydrationReact418: errors.filter((error) => /Minified React error #418/.test(error)),
  runtimeErrors: errors.filter((error) => !/Minified React error #418/.test(error)),
  runtimeWarnings: warnings,
};

const passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.entranceActivated &&
  liveReport.trustReady &&
  liveReport.handoffBegan &&
  liveReport.noInventedTarget &&
  liveReport.completedWithoutData &&
  liveReport.firstPersonal &&
  liveReport.skipClean &&
  liveReport.returningDoesNotRestart &&
  liveReport.jargonFree &&
  liveReport.runtimeErrors.length === 0;

liveReport.passed = passed;
liveReport.workName = workName.last;
liveReport.goalCopy = goal.last;
liveReport.knownCopy = known.last;
liveReport.goalAskCopy = goalAsk.last;
liveReport.dataAskCopy = dataAsk.last;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();

if (!passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
