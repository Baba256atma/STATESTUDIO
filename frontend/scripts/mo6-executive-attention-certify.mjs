/**
 * MO:6 — live /executive Attention & Intervention Intelligence certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo6-executive-attention-intelligence");
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
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      engine: shell?.getAttribute("data-mo6-engine"),
      state: shell?.getAttribute("data-mo6-state"),
      primary: shell?.getAttribute("data-mo6-primary"),
      intervention: shell?.getAttribute("data-mo6-intervention"),
      steals: shell?.getAttribute("data-mo6-steals-focus"),
      subject: shell?.getAttribute("data-mo1-active-object-id"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo6='attention']").count()) > 0;
const advisorReader = (await page.locator("[data-mo6='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo6='stage-reader']").count()) > 0;

await ask(page, "My goal is to improve delivery reliability.");
const capacity = await ask(page, "Explain Capacity.");
await page.screenshot({ path: join(OUT, "01-attention.png") });
const needs = await ask(page, "What needs my attention?");
await page.screenshot({ path: join(OUT, "02-primary.png") });
const why = await ask(page, "Why this?");
const whyNot = await ask(page, "Why not Revenue?");
await page.screenshot({ path: join(OUT, "03-why-not.png") });
const intervene = await ask(page, "Do I need to intervene?");
const leave = await ask(page, "Can I leave this alone for now?");
const nothing = await ask(page, "What happens if I do nothing?");
await page.screenshot({ path: join(OUT, "04-inaction.png") });
await page.screenshot({ path: join(OUT, "05-console-clean.png") });

const liveReport = {
  phase: "MO:6",
  identity: "MO:6/ExecutiveAttentionInterventionIntelligence",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: needs.engine === "MO:6/ExecutiveAttentionInterventionIntelligence",
  capacityPreserved:
    capacity.subject === "obj-capacity" &&
    needs.subject === "obj-capacity" &&
    whyNot.subject === "obj-capacity",
  attentionCopy: /Needs your attention|No executive intervention|Intervention/i.test(needs.last),
  whyCopy: /Why now|Needs your attention|highest-priority|ranking/i.test(why.last),
  whyNotCopy: /outranks|highest-priority|Revenue|ranking/i.test(whyNot.last),
  interveneCopy: /Intervention:/i.test(intervene.last),
  noApprove: !/I approved|Approve Scenario B/i.test(intervene.last),
  leaveCopy: /continue|watching|intervention|leave|without manager/i.test(leave.last),
  inactionCopy: /does not currently have enough evidence|No intervention is required/i.test(nothing.last),
  noImmediately: !/\bimmediately\b|\btoday\b/i.test(`${needs.last} ${nothing.last}`),
  doesNotStealFocus: needs.steals === "false",
  cameraPresent: Boolean(capacity.camera),
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
  "capacityPreserved",
  "attentionCopy",
  "whyCopy",
  "whyNotCopy",
  "interveneCopy",
  "noApprove",
  "leaveCopy",
  "inactionCopy",
  "noImmediately",
  "doesNotStealFocus",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
