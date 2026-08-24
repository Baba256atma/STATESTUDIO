/**
 * MO:1 — live /executive Manager–Object certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/mo1-manager-object-interaction",
);
const URL = "http://localhost:3000/executive";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

async function createPage() {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
  const response = await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(700);
  return { page, http: response?.status() ?? 0 };
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
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const chat = document.querySelector('[data-testid="nexora-conversational-experience"]');
    const last = [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
      .at(-1)?.textContent ?? "";
    return {
      mo1: shell?.getAttribute("data-mo1"),
      active: shell?.getAttribute("data-mo1-active-object-id"),
      activation: shell?.getAttribute("data-mo1-activation"),
      focused: stage?.getAttribute("data-stage-focused-object-id"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      chatActive: chat?.getAttribute("data-mo1-active-object-id"),
      chatIntent: chat?.getAttribute("data-mo1-intent"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo1='interaction']").count()) > 0;

const capacity = await ask(page, "Focus on Capacity");
await page.screenshot({ path: join(OUT, "01-capacity-active.png") });
const explainThis = await ask(page, "Explain this");
await page.screenshot({ path: join(OUT, "02-explain-this.png") });
const delivery = await ask(page, "Explain Delivery");
await page.screenshot({ path: join(OUT, "03-explain-delivery.png") });
const followUp = await ask(page, "What should I do about this?");
await page.screenshot({ path: join(OUT, "04-follow-up.png") });
const goal = await ask(page, "Explain Close Capacity Gap");
await page.screenshot({ path: join(OUT, "05-goal-active.png") });
const problem = await ask(page, "Focus on Capacity Gap");
const scenario = await ask(page, "Focus on Capacity Expansion Plan");
const decision = await ask(page, "Focus on Expand Capacity");
const execution = await ask(page, "Focus on Capacity Expansion");
await page.screenshot({ path: join(OUT, "06-execution-active.png") });
await page.screenshot({ path: join(OUT, "07-console-clean.png") });

const liveReport = {
  phase: "MO:1",
  identity: "MO:1/ManagerObjectInteractionFoundation",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  capacityActive: capacity.active === "obj-capacity",
  explainThisPreserved: explainThis.active === "obj-capacity",
  explainDeliverySwitched: delivery.active === "obj-delivery",
  followUpPreserved: followUp.active === "obj-delivery",
  goalActive: goal.active === "goal-capacity-availability",
  problemActive: problem.active === "ctx-problem-capacity",
  scenarioActive: scenario.active === "ctx-scenario-capacity",
  decisionActive: decision.active === "ctx-decision-capacity",
  executionActive: execution.active === "ctx-execution-capacity",
  stageClickLawPresent:
    (await page.locator("[data-ux2-center-law='click-object-center-recompose']").count()) >
    0,
  ux1Present: (await page.locator("[data-ux1='simplify-executive-page']").count()) > 0,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
const required = [
  "capacityActive",
  "explainThisPreserved",
  "explainDeliverySwitched",
  "followUpPreserved",
  "goalActive",
  "problemActive",
  "scenarioActive",
  "decisionActive",
  "executionActive",
  "stageClickLawPresent",
  "ux1Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
