/**
 * MO-INT:1 — live /executive experience integration certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo-int1-executive-experience-integration");
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
  await page.waitForTimeout(350);
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      engine: shell?.getAttribute("data-mo-int1-engine"),
      lane: shell?.getAttribute("data-mo-int1-lane"),
      subject: shell?.getAttribute("data-mo1-active-object-id"),
      steals: shell?.getAttribute("data-mo6-steals-focus"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo-int1='experience-integration']").count()) > 0;
const advisorReader = (await page.locator("[data-mo-int1='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo-int1='stage-reader']").count()) > 0;

await ask(page, "My goal is to improve delivery reliability.");
const show = await ask(page, "Show Capacity.");
await page.screenshot({ path: join(OUT, "01-select.png") });
const explain = await ask(page, "Explain this.");
await page.screenshot({ path: join(OUT, "02-understand.png") });
const connected = await ask(page, "What is connected?");
const look = await ask(page, "Where should I look next?");
await page.screenshot({ path: join(OUT, "03-explore.png") });
await ask(page, "Show Capacity Gap.");
const where = await ask(page, "Where are we?");
await page.screenshot({ path: join(OUT, "04-journey.png") });
const attention = await ask(page, "What needs my attention?");
await page.screenshot({ path: join(OUT, "05-attention.png") });
const next = await ask(page, "What should I do next?");
await page.screenshot({ path: join(OUT, "06-console-clean.png") });

const liveReport = {
  phase: "MO-INT:1",
  identity: "MO-INT:1/ManagerObjectExecutiveExperienceIntegration",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: explain.engine === "MO-INT:1/ManagerObjectExecutiveExperienceIntegration",
  capacityPreserved: show.subject === "obj-capacity" && explain.subject === "obj-capacity",
  noEngineDump: !/Explanation:|Exploration:|Navigation:|Journey:|Attention:/.test(explain.last),
  noMoIds: !/\bMO:[1-6]\b/.test(`${where.last} ${attention.last} ${next.last}`),
  connectedCopy: /related|connected/i.test(connected.last),
  lookCopy: /Recommended next:|Recommended direction|Capacity Gap/i.test(look.last),
  whereCopy: /Goal:|Where we are|waiting/i.test(where.last),
  attentionCopy: /Needs your attention|No manager intervention|Intervention/i.test(attention.last),
  nextCopy: /next|decision|review|authority/i.test(next.last),
  doesNotStealFocus: attention.steals === "false",
  cameraPresent: Boolean(show.camera),
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
  "noEngineDump",
  "noMoIds",
  "connectedCopy",
  "lookCopy",
  "whereCopy",
  "attentionCopy",
  "nextCopy",
  "doesNotStealFocus",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
