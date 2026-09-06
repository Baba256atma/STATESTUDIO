/**
 * NEX-ENT:9 — live /executive Trust + Quick Review proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent9-trust-review");
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
      ent8State: shell?.getAttribute("data-nex-ent8-state"),
      ent9State: shell?.getAttribute("data-nex-ent9-state"),
      visual: shell?.getAttribute("data-visual-view"),
      purpose: shell?.getAttribute("data-visual-purpose"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      last: nexoraMessages.at(-1) ?? "",
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|CC:10|trust score|CERTIFIED/i.test(
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

async function reachTrustReview(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 50; index += 1) {
    const snap = await ask(page, "Show me the next one");
    if (snap.ent9State === "SOURCE") return snap;
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

const source = await reachTrustReview(first.page);
await first.page.screenshot({ path: join(OUT, "02-source.png") });
const provenance = await ask(first.page, "Where did this information come from?");
const meaning = await ask(first.page, "What does this mean?");
const likely = await ask(first.page, "Are you sure?");
const dunno = await ask(first.page, "I don't know");
const whyAsk = await ask(first.page, "Why are you asking me this?");
const cause = await ask(
  first.page,
  "If capacity and delivery move together, does that prove capacity caused the problem?",
);
const outcome = await ask(
  first.page,
  "The result improved after our Decision. Did our Decision cause this?",
);
const whyRec = await ask(first.page, "Why did you recommend that?");
const decide = await ask(first.page, "Can you decide for me?");
let review = source;
for (let index = 0; index < 8; index += 1) {
  review = await ask(first.page, "Show me the next one");
  if (review.ent9State === "QUICK_REVIEW") break;
}
await first.page.screenshot({ path: join(OUT, "03-review.png") });
const wrong = await ask(first.page, "Guess the most likely meaning");
const q2 = await ask(first.page, "No");
const ready = await ask(first.page, "I decide");
await first.page.screenshot({ path: join(OUT, "04-ready.png") });
const problems = await ask(first.page, "Show me the problems");
const locate = await ask(first.page, "Where is Data?");
const trend = await ask(first.page, "Show me delivery over time");
await first.page.screenshot({ path: join(OUT, "05-routing.png") });

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
await reachTrustReview(skipSession.page);
const skipped = await ask(skipSession.page, "Skip review");
await skipSession.page.screenshot({ path: join(OUT, "07-skip.png") });
await skipSession.page.close();

const liveReport = {
  phase: "NEX-ENT:9",
  identity: "NEX-ENT:9/TrustReview",
  completedAt: new Date().toISOString(),
  baseUrl: BASE,
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent9State === "NOT_STARTED" || existingSnapshot.ent9State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  trustBegan: source.ent9State === "SOURCE" && /rules I follow/i.test(source.last),
  provenance: /example operations source/i.test(provenance.last),
  unknown: /don.t know/i.test(meaning.last),
  likely: /likely meaning/i.test(likely.last),
  iDontKnow: /unresolved/i.test(dunno.last),
  whyAsk: /false confidence|automatic Decision/i.test(whyAsk.last),
  evidenceNotCause: /does not prove/i.test(cause.last),
  outcomeNotCause: /does not, by itself, prove|does not prove/i.test(outcome.last),
  explainRecommend: /not a fact and not a Decision/i.test(whyRec.last),
  managerAuthority: /commitment remains yours/i.test(decide.last),
  reviewStarted: review.ent9State === "QUICK_REVIEW",
  wrongContinues: /provisional/i.test(wrong.last) && !/FAIL|trust score/i.test(wrong.last),
  readyHandoff:
    ready.ent9State === "READY" &&
    /ready to make this workspace yours/i.test(ready.last) &&
    !/What business|central workspace be called/i.test(ready.last),
  problemsRoute: /problem/i.test(problems.last),
  dataLocate: locate.gaTarget === "DATA_ENTRY",
  visualRoute: trend.purpose === "TREND",
  skipClean: skipped.ent9State === "SKIPPED",
  refreshNoDuplicateBurst: refreshed.messageCount <= beforeRefreshCount + 1,
  jargonFree: source.jargon === false && ready.jargon === false,
  runtimeErrors: errors,
  runtimeWarnings: warnings,
};

const passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.entranceActivated &&
  liveReport.trustBegan &&
  liveReport.provenance &&
  liveReport.unknown &&
  liveReport.likely &&
  liveReport.iDontKnow &&
  liveReport.whyAsk &&
  liveReport.evidenceNotCause &&
  liveReport.outcomeNotCause &&
  liveReport.explainRecommend &&
  liveReport.managerAuthority &&
  liveReport.wrongContinues &&
  liveReport.readyHandoff &&
  liveReport.problemsRoute &&
  liveReport.skipClean &&
  liveReport.jargonFree &&
  errors.length === 0;

liveReport.passed = passed;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();

if (!passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(liveReport, null, 2));
