/**
 * MO:5 — live /executive Journey Intelligence certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo5-executive-journey-intelligence");
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
      engine: shell?.getAttribute("data-mo5-engine"),
      phase: shell?.getAttribute("data-mo5-phase"),
      state: shell?.getAttribute("data-mo5-state"),
      blocker: shell?.getAttribute("data-mo5-blocker"),
      subject: shell?.getAttribute("data-mo1-active-object-id"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo5='journey']").count()) > 0;
const advisorReader = (await page.locator("[data-mo5='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo5='stage-reader']").count()) > 0;

await ask(page, "My goal is to improve delivery reliability.");
await page.screenshot({ path: join(OUT, "01-goal.png") });
const capacity = await ask(page, "Explain Capacity.");
await page.screenshot({ path: join(OUT, "02-capacity.png") });
const where = await ask(page, "Where are we?");
await page.screenshot({ path: join(OUT, "03-where.png") });
const done = await ask(page, "What have we done so far?");
const unresolved = await ask(page, "What is still unresolved?");
const blocking = await ask(page, "What is blocking us?");
await page.screenshot({ path: join(OUT, "04-blocker.png") });
const next = await ask(page, "What should happen next?");
await page.screenshot({ path: join(OUT, "05-next.png") });
await page.screenshot({ path: join(OUT, "06-console-clean.png") });

const liveReport = {
  phase: "MO:5",
  identity: "MO:5/ExecutiveJourneyProgressIntelligence",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: where.engine === "MO:5/ExecutiveJourneyProgressIntelligence",
  capacityPreserved: capacity.subject === "obj-capacity" && where.subject === "obj-capacity",
  whereCopy: /Goal:|Where we are/i.test(where.last),
  accomplishedCopy: /done so far|Goal/i.test(done.last),
  unresolvedCopy: /unresolved|Decision/i.test(unresolved.last),
  blockerCopy: /blocker|DECISION/i.test(blocking.last),
  nextCopy: /decision|milestone|path/i.test(next.last),
  noPercent: !/\d+%\s+complete/i.test(where.last),
  noApprove: !/I approved/i.test(`${where.last} ${next.last}`),
  noStart: !/I started execution/i.test(`${where.last} ${next.last}`),
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
  "whereCopy",
  "accomplishedCopy",
  "unresolvedCopy",
  "blockerCopy",
  "nextCopy",
  "noPercent",
  "noApprove",
  "noStart",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
