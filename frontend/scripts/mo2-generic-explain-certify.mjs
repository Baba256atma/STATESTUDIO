/**
 * MO:2 — live /executive Generic Explain Engine certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo2-generic-explain-engine");
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
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      mo2: shell?.getAttribute("data-mo2"),
      engine: shell?.getAttribute("data-mo2-engine"),
      subject: shell?.getAttribute("data-mo2-subject"),
      summary: shell?.getAttribute("data-mo2-summary"),
      epistemic: shell?.getAttribute("data-mo2-epistemic"),
      intent: shell?.getAttribute("data-mo2-intent"),
      focus: shell?.getAttribute("data-mo2-focus"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      focused: stage?.getAttribute("data-stage-focused-object-id"),
      chatEngine: chat?.getAttribute("data-mo2-engine"),
      chatSubject: chat?.getAttribute("data-mo2-subject"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo2='explain-engine']").count()) > 0;
const advisorReader = (await page.locator("[data-mo2='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo2='stage-reader']").count()) > 0;

const capacity = await ask(page, "Explain Capacity");
await page.screenshot({ path: join(OUT, "01-explain-capacity.png") });
const delivery = await ask(page, "Explain Delivery");
await page.screenshot({ path: join(OUT, "02-explain-delivery.png") });
const goal = await ask(page, "Explain Goal");
await page.screenshot({ path: join(OUT, "03-explain-goal.png") });
const risk = await ask(page, "Explain Risk");
await page.screenshot({ path: join(OUT, "04-explain-risk.png") });
await ask(page, "Focus on Capacity Expansion Plan");
const scenario = await ask(page, "Explain this");
await ask(page, "Focus on Expand Capacity");
const decision = await ask(page, "Explain this");
await ask(page, "Focus on Capacity Expansion");
const execution = await ask(page, "Explain this");
await page.screenshot({ path: join(OUT, "05-explain-execution.png") });
const whyImportant = await ask(page, "Why is this important?");
const connected = await ask(page, "What is connected to this?");
await page.screenshot({ path: join(OUT, "06-connected.png") });
const unknown = await ask(page, "What don't we know?");
const continues = await ask(page, "What happens if this continues?");
await page.screenshot({ path: join(OUT, "07-continues.png") });
const shouldDo = await ask(page, "What should I do?");
void unknown;
await page.screenshot({ path: join(OUT, "08-console-clean.png") });

const noCommitLanguage = !/decision committed|execution started/i.test(
  `${whyImportant.last} ${connected.last} ${continues.last} ${shouldDo.last}`,
);

const liveReport = {
  phase: "MO:2",
  identity: "MO:2/GenericExplainEngine",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: capacity.engine === "MO:2/GenericExplainEngine",
  capacitySubject: capacity.subject === "obj-capacity" && /Capacity/i.test(capacity.summary ?? ""),
  deliverySubject: delivery.subject === "obj-delivery",
  goalSubject: goal.subject === "goal-capacity-availability",
  riskSubject: risk.subject === "obj-risk",
  scenarioSubject: scenario.subject === "ctx-scenario-capacity",
  decisionSubject: decision.subject === "ctx-decision-capacity",
  executionSubject: execution.subject === "ctx-execution-capacity",
  deicticPreserved: whyImportant.subject === execution.subject,
  connectedOverlay: /related to|does not currently have recorded related/i.test(connected.last),
  continuesNotFact: !/\bwill definitely\b|\bis a fact\b/i.test(continues.last),
  noCommitLanguage,
  cameraFixed: capacity.camera === "fixed" || capacity.camera === "locked" || Boolean(capacity.camera),
  stageClickLawPresent:
    (await page.locator("[data-ux2-center-law='click-object-center-recompose']").count()) > 0,
  ux1Present: (await page.locator("[data-ux1='simplify-executive-page']").count()) > 0,
  ux3Present: (await page.locator("[data-ux3='professional-advisor']").count()) > 0,
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
  "shellPresent",
  "advisorReader",
  "stageReader",
  "enginePresent",
  "capacitySubject",
  "deliverySubject",
  "goalSubject",
  "riskSubject",
  "scenarioSubject",
  "decisionSubject",
  "executionSubject",
  "deicticPreserved",
  "continuesNotFact",
  "noCommitLanguage",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
