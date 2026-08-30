/**
 * DTH:6 live /executive certification.
 * Investigation overlay on existing Theatre. No Cards, NexoSelect, NexoCompare, or NexoTime.
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
    const investigation = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const cards = document.querySelectorAll('[data-testid*="nexo-select"], [data-testid*="nexo-time"], [data-testid*="investigation-card"], [data-testid*="nexo-compare"], [data-testid*="nexo-lens"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      sceneScriptId: mount?.getAttribute("data-theatre-scene-script-id") ?? "missing",
      investigationObjectId: mount?.getAttribute("data-theatre-investigation-object-id") ?? "none",
      investigationObjectType: mount?.getAttribute("data-theatre-investigation-object-type") ?? "none",
      investigationLevel: mount?.getAttribute("data-theatre-investigation-level") ?? "none",
      investigationDom: Boolean(investigation),
      overlayObjectId: investigation?.getAttribute("data-theatre-investigation-object-id") ?? null,
      overlayType: investigation?.getAttribute("data-theatre-investigation-object-type") ?? null,
      cardOrChartCount: cards.length,
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

await askExecutiveChat(page, "show problems");
const problems = await snapshot(page);
const clickedProblem = await clickStageObject(page, "ctx-problem-margin");
const afterProblem = await snapshot(page);
const explain = await askExecutiveChat(page, "Explain this.");
const afterExplain = await snapshot(page);
const evidence = await askExecutiveChat(page, "What evidence supports it?");
const afterEvidence = await snapshot(page);
await page.locator('[data-testid="nexora-theatre-investigation-close"]').click({ timeout: 5000 }).catch(() => null);
await page.waitForTimeout(400);
const afterClose = await snapshot(page);

await askExecutiveChat(page, "show scenarios");
const scenarios = await snapshot(page);
const clickedScenario = await clickStageObject(page, "ctx-scenario-pricing");
const afterScenario = await snapshot(page);
const compare = await askExecutiveChat(page, "Compare it with the other one.");
const afterCompare = await snapshot(page);

await askExecutiveChat(page, "show executions");
const clickedExecution = await clickStageObject(page, "ctx-execution-capacity");
const afterExecution = await snapshot(page);
const unknownAsk = await askExecutiveChat(page, "What is the cost?");
const afterUnknown = await snapshot(page);

await page.screenshot({ path: join(out, "live-stage.png") });
await browser.close();

const architectureLeak = [explain.last, evidence.last, compare.last, unknownAsk.last].some((text) =>
  /DTH:6|NCA|DIR:1|Scene Script ID|canonical entity|runtime binding/i.test(text ?? ""),
);
const dthConsole = consoleErrors.filter((text) => /DTH:6|decision theatre/i.test(text));
const hydration = consoleErrors.filter((text) => /hydrat/i.test(text));
const fabricatedZero = /cost is 0|cost: 0|zero days/i.test(unknownAsk.last ?? "");

const report = {
  identity: "DTH:6/LiveExecutiveCertification",
  url,
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 40),
  consoleWarnings: consoleWarnings.slice(0, 20),
  dthAttributedConsoleErrors: dthConsole,
  hydrationErrors: hydration,
  load,
  problems,
  problem: { attempted: clickedProblem, afterProblem, explain: explain.last, evidence: evidence.last, afterExplain, afterEvidence, afterClose },
  comparison: { attempted: clickedScenario, scenarios, afterScenario, compare: compare.last, afterCompare },
  execution: { attempted: clickedExecution, afterExecution, unknown: unknownAsk.last, afterUnknown },
  architectureLeak,
  fabricatedZero,
  zeroPageErrors: pageErrors.length === 0,
};

const ok =
  report.zeroPageErrors &&
  dthConsole.length === 0 &&
  hydration.length === 0 &&
  !architectureLeak &&
  !fabricatedZero &&
  load.cardOrChartCount === 0 &&
  clickedProblem &&
  afterProblem.investigationDom === true &&
  afterProblem.overlayType === "problem" &&
  afterClose.investigationDom === false &&
  afterClose.sceneScriptId === afterProblem.sceneScriptId &&
  clickedScenario &&
  afterScenario.overlayType === "scenario" &&
  afterCompare.focused === afterScenario.focused &&
  clickedExecution &&
  afterExecution.overlayType === "execution";

report.ok = ok;
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  ok,
  url,
  problemType: afterProblem.overlayType,
  closed: afterClose.investigationDom === false,
  scenePreserved: afterClose.sceneScriptId === afterProblem.sceneScriptId,
  scenarioType: afterScenario.overlayType,
  executionType: afterExecution.overlayType,
  architectureLeak,
}, null, 2));
if (!ok) process.exit(1);
