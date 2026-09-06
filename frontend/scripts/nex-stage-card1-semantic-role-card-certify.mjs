/**
 * NEX-STAGE-CARD:1 — live semantic-role card proof.
 * Uses NEXORA_BASE_URL. Does not assume :3000.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-stage-card1-semantic-role-card");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3016";
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
    const mount = document.querySelector("[data-nex-stage-card-role]");
    const card = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      experience: shell?.getAttribute("data-executive-experience-context"),
      ent3State: shell?.getAttribute("data-nex-ent3-state"),
      ent3Object: shell?.getAttribute("data-nex-ent3-object"),
      convSubject: shell?.getAttribute("data-nex-conv-subject"),
      threadSubject: shell?.getAttribute("data-nex-conv2-subject"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      decisionState: shell?.getAttribute("data-nex-exp7-state"),
      executionState: shell?.getAttribute("data-nex-exp8-state"),
      investigationLevel: mount?.getAttribute("data-theatre-investigation-level"),
      mountObjectId: mount?.getAttribute("data-theatre-investigation-object-id"),
      cardRole: card?.getAttribute("data-nex-stage-card-role") ?? mount?.getAttribute("data-nex-stage-card-role"),
      statusSource:
        card?.getAttribute("data-nex-stage-card-status-source") ??
        mount?.getAttribute("data-nex-stage-card-status-source"),
      evidence:
        card?.getAttribute("data-nex-stage-card-evidence") ??
        mount?.getAttribute("data-nex-stage-card-evidence"),
      relationships:
        card?.getAttribute("data-nex-stage-card-relationships") ??
        mount?.getAttribute("data-nex-stage-card-relationships"),
      cardObjectId: card?.getAttribute("data-theatre-investigation-object-id"),
      cardText: card?.textContent ?? "",
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
  return snapshot(page);
}

async function clickObject(page, objectId) {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  if (await list.count()) {
    await list.evaluate((el) => {
      el.open = true;
    });
    await page.waitForTimeout(200);
  }
  const control = page.locator(`[data-testid="nexora-stage-object-control-${objectId}"]`);
  await control.waitFor({ state: "visible", timeout: 8000 });
  await control.click();
  await page.waitForSelector('[data-testid="nexora-theatre-investigation"]', { timeout: 10000 });
  await page.waitForTimeout(300);
  return snapshot(page);
}

const existing = await open(EXISTING);
await ask(existing.page, "show problems");
const problem = await clickObject(existing.page, "ctx-problem-margin");
await existing.page.screenshot({ path: join(OUT, "04-business-problem.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await ask(first.page, "Why is this important?");
await ask(first.page, "Show me");
await ask(first.page, "Show me how focus works");
await ask(first.page, "Explain first");
const nexoraCard = await clickObject(first.page, "obj-nexora-entrance");
await first.page.screenshot({ path: join(OUT, "00-nexora-card.png") });
const asked = await ask(first.page, "What is this?");
const closed = first.page.locator('[data-testid="nexora-theatre-investigation-close"]');
if (await closed.count()) await closed.click();
await first.page.waitForTimeout(300);
const goal = await ask(first.page, "Show me the next one");
const goalCard = await clickObject(first.page, "obj-nex-ent3-goal");
await first.page.screenshot({ path: join(OUT, "01-goal-card.png") });
const goalAsk = await ask(first.page, "What is this?");
const kpiCard = await ask(first.page, "Show me the next one");
await first.page.screenshot({ path: join(OUT, "02-kpi-after-transition.png") });
const stage = first.page.locator('[data-testid="nexora-3d-executive-stage"] canvas');
const box = await stage.boundingBox();
if (box) {
  await first.page.mouse.click(box.x + 24, box.y + 24);
  await first.page.waitForTimeout(400);
}
const afterBg = await snapshot(first.page);
const skipped = await ask(first.page, "Skip this");
await first.page.screenshot({ path: join(OUT, "03-skip.png") });
await first.page.close();

const classifiedErrors = errors.filter((item) => /hydration|Minified React error #418/i.test(item));
const runtimeErrors = errors.filter((item) => !/hydration|Minified React error #418/i.test(item));

const liveReport = {
  phase: "NEX-STAGE-CARD:1",
  identity: "NEX-STAGE-CARD:1/SemanticEntityRoleCard",
  completedAt: new Date().toISOString(),
  base: BASE,
  nexoraCard,
  asked: asked.last,
  goal: { state: goal.ent3State, card: goalCard },
  goalAsk: goalAsk.last,
  kpiCard,
  afterBackgroundExperience: afterBg.experience,
  skipState: skipped.ent3State,
  businessProblem: {
    cardText: problem.cardText,
    role: problem.cardRole,
  },
  classifiedErrors,
  runtimeErrors,
};

liveReport.nexoraRole = nexoraCard.cardRole === "EDUCATIONAL_ACTOR";
liveReport.nexoraId = nexoraCard.cardObjectId === "obj-nexora-entrance";
liveReport.noStable = !/Current state: stable/i.test(nexoraCard.cardText);
liveReport.noEvidenceFallback = !/does not yet have enough evidence/i.test(nexoraCard.cardText);
liveReport.noRelationshipFallback = !/No supported relationships/i.test(nexoraCard.cardText);
liveReport.noAObject = !/is a object/i.test(nexoraCard.cardText);
liveReport.hasIdentity = /decision workspace|executive decision/i.test(nexoraCard.cardText);
liveReport.hasRole = /Role in this Stage|organizes the current scene/i.test(nexoraCard.cardText);
liveReport.statusNotApplicable = nexoraCard.statusSource === "not-applicable";
liveReport.goalEducational = /educational example/i.test(goalCard.cardText);
liveReport.kpiNotStaleGoal =
  !/obj-nex-ent3-goal/.test(kpiCard.cardObjectId ?? "") ||
  /kpi/i.test(kpiCard.cardText + (kpiCard.ent3State ?? ""));
liveReport.advisorEducational = /goal/i.test(goalAsk.last);
liveReport.fix3Held =
  /entrance|guided|education/i.test(afterBg.experience ?? "") || afterBg.mode !== "existing";
liveReport.businessDepth = /Current state:|enough evidence|Risk|relationship/i.test(problem.cardText);
liveReport.zeroWrites =
  [nexoraCard, goalCard, kpiCard].every(
    (turn) =>
      (turn.goalState ?? "none") === "none" &&
      (turn.decisionState ?? "none") === "none" &&
      (turn.executionState ?? "none") === "none",
  );
liveReport.passed =
  liveReport.nexoraRole &&
  liveReport.nexoraId &&
  liveReport.noStable &&
  liveReport.noEvidenceFallback &&
  liveReport.noRelationshipFallback &&
  liveReport.noAObject &&
  liveReport.hasIdentity &&
  liveReport.hasRole &&
  liveReport.statusNotApplicable &&
  liveReport.goalEducational &&
  liveReport.kpiNotStaleGoal &&
  liveReport.advisorEducational &&
  liveReport.fix3Held &&
  liveReport.businessDepth &&
  liveReport.zeroWrites &&
  runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
