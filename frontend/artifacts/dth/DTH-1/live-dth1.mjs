/**
 * DTH:1 live /executive certification. Reuses FINAL:3 helpers. Does not start DTH:2.
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

await mkdir(out, { recursive: true });

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const keys = [...document.querySelectorAll("[data-testid]")].map((el) =>
      el.getAttribute("data-testid"),
    );
    const visible = [...document.querySelectorAll('[data-testid^="nexora-stage-object-control-"]')]
      .filter((el) => Number(el.getAttribute("data-opacity") ?? "0") > 0.05)
      .map((el) => el.getAttribute("data-canonical-id"));
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      selected: stage?.getAttribute("data-stage-selected-object-id") ?? "none",
      stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
      visibleCount: Number(stage?.getAttribute("data-stage-collection-visible") ?? "0"),
      visibleIds: visible,
      duplicateTestIds: keys.filter((id, index) => keys.indexOf(id) !== index),
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
});
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
const load = await snapshot(page);

const clicked = await clickStageObject(page, "obj-revenue");
const afterClick = await snapshot(page);

await page.locator('[data-testid="nexora-stage-step-back"]').click({ timeout: 5000 }).catch(() => null);
const afterBack = await snapshot(page);
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
const afterEscape = await snapshot(page);

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
  const before = await snapshot(page);
  const reply = await askExecutiveChat(page, utterance);
  const stage = await snapshot(page);
  turns.push({
    utterance,
    reply: reply.last ?? "",
    focused: reply.focused,
    before,
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
  /DTH:1|DIR:1|NEX-MVP|NexoGraph|Scene Intent/i.test(turn.reply),
);
const dthConsole = consoleErrors.filter((text) => /DTH:1|decision theatre|decisionTheatre/i.test(text));
const report = {
  identity: "DTH:1/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 40),
  dthAttributedConsoleErrors: dthConsole,
  load,
  click: { attempted: clicked, afterClick },
  afterBack,
  afterEscape,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    focus: turn.focused,
    category: turn.stage.category,
    reply: String(turn.reply).slice(0, 180),
  })),
  refresh,
  refreshProblems: problemsAgain.focused,
  architectureLeak,
  duplicateKeys: [...new Set(turns.flatMap((turn) => turn.stage.duplicateTestIds))],
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  dthConsole.length === 0 &&
  !architectureLeak &&
  load.mode !== "" &&
  afterClick.stageFocused === "obj-revenue" &&
  turns[0]?.stage.category === "problem" &&
  refresh.category === "problem";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ok, url, pageErrors: pageErrors.length, dthConsole: dthConsole.length, architectureLeak, clickFocus: afterClick.stageFocused, problemCategory: turns[0]?.stage.category }, null, 2));
if (!ok) process.exit(1);
