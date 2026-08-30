/**
 * DTH:3 live /executive certification.
 * Live data may remain grammar-neutral (equal size, unknown relationship pattern).
 * Does not start DTH:4 atmosphere.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const pageErrors = [];
const consoleErrors = [];
const consoleWarnings = [];

await mkdir(out, { recursive: true });

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const keys = [...document.querySelectorAll("[data-testid]")].map((el) =>
      el.getAttribute("data-testid"),
    );
    const controls = [...document.querySelectorAll('[data-testid^="nexora-stage-object-control-"]')];
    const visible = controls
      .filter((el) => Number(el.getAttribute("data-opacity") ?? "0") > 0.05)
      .map((el) => el.getAttribute("data-canonical-id"));
    const executiveFamily = controls.filter((el) => el.getAttribute("data-visual-family") === "executive-object").length;
    const iconicNodes = [...document.querySelectorAll('[data-visual-family="iconic-object"]')];
    const scales = [...new Set(controls.map((el) => el.getAttribute("data-nexograph-scale")))];
    const atmospheres = [
      mount?.getAttribute("data-nexograph-atmosphere"),
      stage?.getAttribute("data-nexograph-atmosphere"),
    ];
    const cards = document.querySelectorAll('[data-testid*="nexo-select"], [data-testid*="nexo-time"], [data-testid*="investigation-card"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      selected: stage?.getAttribute("data-stage-selected-object-id") ?? "none",
      stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
      visibleCount: Number(stage?.getAttribute("data-stage-collection-visible") ?? "0"),
      visibleIds: visible,
      duplicateTestIds: keys.filter((id, index) => keys.indexOf(id) !== index),
      iconicCountAttr: mount?.getAttribute("data-theatre-iconic-count") ?? "missing",
      grammarVersion: mount?.getAttribute("data-nexograph-grammar-version") ?? "missing",
      grammarSupported: mount?.getAttribute("data-nexograph-supported") ?? "missing",
      legendVisible: mount?.getAttribute("data-nexograph-legend-visible") ?? "missing",
      atmosphere: atmospheres,
      executiveFamilyCount: executiveFamily,
      liveIconicDomCount: iconicNodes.length,
      uniqueScales: scales,
      cardOrChartCount: cards.length,
      advisorPresent: Boolean(
        document.querySelector('[data-testid="nexora-advisor-view"], [data-testid="nexora-conversational-input-field"]'),
      ),
      sampleForm: controls[0]?.getAttribute("data-nexograph-form-token") ?? null,
      sampleState: controls[0]?.getAttribute("data-nexograph-state-token") ?? null,
    };
  });
}

async function openObjectsList(page) {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  if ((await list.count()) === 0) return;
  const open = await list.evaluate((el) => el.hasAttribute("open") || el.open === true);
  if (!open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
}

async function clickStageObject(page, id) {
  await openObjectsList(page);
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`);
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(700);
  return true;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => pageErrors.push(String(error)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
  if (msg.type() === "warning") consoleWarnings.push(msg.text());
});
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const load = await snapshot(page);

const clicked = await clickStageObject(page, "obj-revenue");
const afterClick = await snapshot(page);

await page.locator('[data-testid="nexora-stage-step-back"]').click({ timeout: 5000 }).catch(() => null);
const afterBack = await snapshot(page);
await page.locator('[data-testid="nexora-stage-step-forward"]').click({ timeout: 5000 }).catch(() => null);
const afterForward = await snapshot(page);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
const afterEscape = await snapshot(page);
await page.locator('[data-testid="nexora-stage-reset"]').click({ timeout: 5000 }).catch(() => null);
const afterOverview = await snapshot(page);

const riskClicked = await clickStageObject(page, "obj-risk");
const afterRisk = await snapshot(page);

const turns = [];
for (const utterance of [
  "show problems",
  "show scenarios",
  "show decisions",
  "show executions",
  "Explain it",
  "which one is more important?",
  "show the NexoGraph",
]) {
  const reply = await askExecutiveChat(page, utterance);
  const stage = await snapshot(page);
  turns.push({
    utterance,
    reply: reply.last ?? "",
    focused: reply.focused,
    stage,
  });
}

await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
const problemsAgain = await askExecutiveChat(page, "show problems");
const refresh = await snapshot(page);

await page.screenshot({ path: join(out, "live-stage.png") });
await browser.close();

const architectureLeak = turns.some((turn) =>
  /DTH:3|DTH:2|DTH:1|DIR:1|NEX-MVP|NexoGraph|Scene Intent|War Room/i.test(turn.reply),
);
const dthConsole = consoleErrors.filter((text) =>
  /DTH:3|DTH:2|DTH:1|decision theatre|decisionTheatre|nexograph|iconic/i.test(text),
);
const hydration = consoleErrors.filter((text) => /hydrat/i.test(text));
const report = {
  identity: "DTH:3/LiveExecutiveCertification",
  url,
  runtimeCommand: "npx next start -p 3013",
  liveGrammarPolicy: "safe-neutral-no-fabricated-impact-or-iconics",
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 40),
  consoleWarnings: consoleWarnings.slice(0, 40),
  dthAttributedConsoleErrors: dthConsole,
  hydrationErrors: hydration,
  load,
  click: { attempted: clicked, afterClick },
  afterBack,
  afterForward,
  afterEscape,
  afterOverview,
  risk: { attempted: riskClicked, afterRisk },
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    focus: turn.focused,
    category: turn.stage.category,
    iconicCountAttr: turn.stage.iconicCountAttr,
    liveIconicDomCount: turn.stage.liveIconicDomCount,
    grammarVersion: turn.stage.grammarVersion,
    atmosphere: turn.stage.atmosphere,
    reply: String(turn.reply).slice(0, 180),
  })),
  refresh,
  refreshProblems: problemsAgain.focused,
  architectureLeak,
  duplicateKeys: [...new Set([
    ...(load.duplicateTestIds ?? []),
    ...turns.flatMap((turn) => turn.stage.duplicateTestIds ?? []),
  ])],
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  dthConsole.length === 0 &&
  hydration.length === 0 &&
  !architectureLeak &&
  load.mode !== "" &&
  load.iconicCountAttr === "0" &&
  load.liveIconicDomCount === 0 &&
  load.grammarVersion === "1.0.0" &&
  load.grammarSupported === "true" &&
  load.legendVisible === "false" &&
  load.atmosphere.every((item) => item === "none") &&
  load.cardOrChartCount === 0 &&
  (load.uniqueScales.length === 0 || load.uniqueScales.every((item) => item == null || item === "size-equal")) &&
  load.executiveFamilyCount > 0 &&
  load.advisorPresent === true &&
  afterClick.stageFocused === "obj-revenue" &&
  afterRisk.stageFocused === "obj-risk" &&
  afterRisk.liveIconicDomCount === 0 &&
  turns[0]?.stage.category === "problem" &&
  turns.every((turn) => turn.stage.liveIconicDomCount === 0) &&
  turns.every((turn) => (turn.stage.atmosphere ?? []).every((item) => item === "none")) &&
  refresh.category === "problem";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  pageErrors: pageErrors.length,
  dthConsole: dthConsole.length,
  architectureLeak,
  clickFocus: afterClick.stageFocused,
  riskFocus: afterRisk.stageFocused,
  grammarVersion: load.grammarVersion,
  iconicCount: load.iconicCountAttr,
  problemCategory: turns[0]?.stage.category,
}, null, 2));
if (!ok) process.exit(1);
