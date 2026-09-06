/**
 * NEX-ENT:7 — live /executive Visual Intelligence proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent7-visual-intelligence");
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
    const view = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent6State: shell?.getAttribute("data-nex-ent6-state"),
      ent7State: shell?.getAttribute("data-nex-ent7-state"),
      visual: shell?.getAttribute("data-visual-view"),
      purpose: shell?.getAttribute("data-visual-purpose"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      last: nexoraMessages.at(-1) ?? "",
      viewPresent: Boolean(view),
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|Recharts|VISUAL_INTENT/i.test(
        nexoraMessages.join(" "),
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
  return snapshot(page);
}

async function reachVisualEducation(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 28; index += 1) {
    const snap = await ask(page, "Show me the next one");
    if (snap.ent7State === "PURPOSE") return snap;
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

const purpose = await reachVisualEducation(first.page);
await first.page.screenshot({ path: join(OUT, "02-visual-purpose.png") });

const stageCue = await ask(first.page, "Show me");
await first.page.screenshot({ path: join(OUT, "03-stage-attention.png") });

const trend = await ask(first.page, "Show me delivery over time");
await first.page.screenshot({ path: join(OUT, "04-trend.png") });

const explained = await ask(first.page, "What does this show?");
const why = await ask(first.page, "Why did you choose this view?");
const provenance = await ask(first.page, "What data is this using?");
const missing = await ask(first.page, "Show me delivery for the last six months");
const compared = await ask(first.page, "Compare delivery across the two periods");
await first.page.screenshot({ path: join(OUT, "05-compare.png") });
const cause = await ask(first.page, "Does this prove why delivery changed?");
const problems = await ask(first.page, "Show me the problems");
const locate = await ask(first.page, "Where is Data?");
await first.page.screenshot({ path: join(OUT, "06-routing.png") });

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
await reachVisualEducation(skipSession.page);
const skipped = await ask(skipSession.page, "Skip for now");
await skipSession.page.screenshot({ path: join(OUT, "08-skip.png") });
await skipSession.page.close();

const liveReport = {
  phase: "NEX-ENT:7",
  identity: "NEX-ENT:7/VisualIntelligenceEducation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent7State === "NOT_STARTED" || existingSnapshot.ent7State == null) &&
    existingSnapshot.visual !== "present",
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  visualEducationBegan:
    purpose.ent7State === "PURPOSE" && /don.t need to choose a chart/i.test(purpose.last),
  stageGuidance: stageCue.gaTarget === "STAGE",
  trendShown:
    trend.purpose === "TREND" &&
    trend.viewPresent === true &&
    /trend/i.test(trend.last),
  explained: /changed|periods/i.test(explained.last),
  whyView: /over time|ordered/i.test(why.last),
  provenance: /OTD|example/i.test(provenance.last),
  noFabricatedHistory: /6 months|six months/i.test(missing.last) && missing.purpose !== "none",
  comparison: compared.purpose === "COMPARE" && /does not pick a winner/i.test(compared.last),
  noCause: /pattern/i.test(cause.last),
  problemsNotCharted: /problem/i.test(problems.last),
  dataLocate: locate.gaTarget === "DATA_ENTRY",
  skipClean: skipped.ent7State === "SKIPPED" && skipped.visual !== "present",
  refreshNoDuplicateView: refreshed.visual !== "present",
  jargonFree: purpose.jargon === false && trend.jargon === false,
  runtimeErrors: errors,
  runtimeWarnings: warnings,
};

const passed =
  liveReport.existingWorkspaceProtected &&
  liveReport.entranceActivated &&
  liveReport.visualEducationBegan &&
  liveReport.trendShown &&
  liveReport.explained &&
  liveReport.whyView &&
  liveReport.provenance &&
  liveReport.noFabricatedHistory &&
  liveReport.comparison &&
  liveReport.noCause &&
  liveReport.problemsNotCharted &&
  liveReport.dataLocate &&
  liveReport.skipClean &&
  liveReport.refreshNoDuplicateView &&
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
