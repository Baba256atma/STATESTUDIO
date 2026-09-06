/**
 * NEX-ENT-FIX3 — live Entrance Stage background / Overview isolation proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent-fix3-stage-overview-isolation");
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
    const advisor = document.querySelector('[data-ux3="professional-advisor"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const text = `${advisor?.textContent ?? ""}\n${stage?.textContent ?? ""}`;
    return {
      experience: shell?.getAttribute("data-executive-experience-context"),
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent10: shell?.getAttribute("data-nex-ent10-state"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      stageFocus: stage?.getAttribute("data-focused-object"),
      topology: stage?.getAttribute("data-stage-topology-mode"),
      advisorSubject: advisor?.getAttribute("data-advisor-current-subject"),
      advisorTitle: advisor?.querySelector("h2, strong, [data-testid]")?.textContent ?? "",
      advisorText: advisor?.textContent ?? "",
      hasCapacityGap: /Capacity Gap/i.test(text),
      hasRiskPriority: /Investigation Priority[\s\S]{0,80}Capacity Gap|Risk Priority/i.test(text),
      hasRiskLabel: /\bRisk\b/.test(text) && /Capacity Gap/i.test(text),
    };
  });
}

async function clickBackground(page) {
  const canvas = page.locator('[data-testid="nexora-stage-canvas-host"] canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.click(box.x + 24, box.y + 24);
  } else {
    await canvas.click({ position: { x: 16, y: 16 }, force: true });
  }
  await page.waitForTimeout(500);
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
  const last = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "",
  );
  return { utterance, last, snap };
}

const existing = await open(EXISTING);
const existingSnap = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-default-executive.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const before = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-before-background.png") });
await clickBackground(first.page);
const afterBackground = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "02-after-background.png") });
await clickBackground(first.page);
await clickBackground(first.page);
const afterRepeat = await snapshot(first.page);
await first.page.locator('[data-testid="nexora-stage-reset"]').click();
await first.page.waitForTimeout(400);
const afterOverviewControl = await snapshot(first.page);
const nexoraClicked = await first.page.evaluate(() => {
  const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
  return stage?.getAttribute("data-focused-object") ?? "none";
});
await ask(first.page, "Show me");
const appears = await ask(first.page, "What appears here?");
const now = await ask(first.page, "What is on the Stage right now?");
const focus = await ask(first.page, "Show me how focus works");
await clickBackground(first.page);
const afterFocusBackground = await snapshot(first.page);
const skip = await ask(first.page, "Skip introduction");
await clickBackground(first.page);
const afterSkipBackground = await snapshot(first.page);
await first.page.close();

const runtimeErrors = errors.filter((item) => !/hydration|Minified React error #418/i.test(item));

const liveReport = {
  phase: "NEX-ENT-FIX3",
  identity: "NEX-ENT-FIX3/EntranceStageOverviewIsolation",
  completedAt: new Date().toISOString(),
  base: BASE,
  http: first.http,
  before,
  afterBackground,
  afterRepeat,
  afterOverviewControl,
  nexoraClicked,
  appears: appears.last,
  now: now.last,
  focus: focus.last,
  afterFocusBackground,
  skip: skip.last,
  afterSkipBackground,
  existingSnap,
  runtimeErrors,
};

liveReport.passed =
  before.experience === "GUIDED_ENTRANCE" &&
  before.objectCount === 1 &&
  before.stageFocus === "obj-nexora-entrance" &&
  before.hasCapacityGap === false &&
  afterBackground.experience === "GUIDED_ENTRANCE" &&
  afterBackground.stageFocus === "obj-nexora-entrance" &&
  afterBackground.hasCapacityGap === false &&
  afterBackground.advisorSubject === "obj-nexora-entrance" &&
  afterRepeat.hasCapacityGap === false &&
  afterOverviewControl.experience === "GUIDED_ENTRANCE" &&
  afterOverviewControl.hasCapacityGap === false &&
  afterOverviewControl.stageFocus === "obj-nexora-entrance" &&
  /NEXORA|educational presence|Stage/i.test(now.last) &&
  !/Capacity Gap/i.test(now.last) &&
  afterFocusBackground.experience === "GUIDED_ENTRANCE" &&
  afterFocusBackground.hasCapacityGap === false &&
  afterSkipBackground.experience === "EXECUTIVE_WORKSPACE" &&
  afterSkipBackground.hasCapacityGap === true &&
  existingSnap.experience === "EXECUTIVE_WORKSPACE" &&
  existingSnap.hasCapacityGap === true &&
  runtimeErrors.length === 0;

await writeFile(join(OUT, "live-browser.json"), `${JSON.stringify(liveReport, null, 2)}\n`);
await browser.close();
if (!liveReport.passed) {
  console.error(JSON.stringify(liveReport, null, 2));
  process.exit(1);
}
console.log(`NEX-ENT-FIX3 live proof passed at ${BASE}`);
