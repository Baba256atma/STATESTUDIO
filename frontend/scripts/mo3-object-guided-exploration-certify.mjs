/**
 * MO:3 — live /executive Object-Guided Exploration certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo3-object-guided-exploration");
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
      mo3: shell?.getAttribute("data-mo3"),
      engine: shell?.getAttribute("data-mo3-engine"),
      recommended: shell?.getAttribute("data-mo3-recommended"),
      kind: shell?.getAttribute("data-mo3-recommended-kind"),
      target: shell?.getAttribute("data-mo3-recommended-target"),
      subject: shell?.getAttribute("data-mo1-active-object-id"),
      chatSubject: chat?.getAttribute("data-mo1-active-object-id"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo3='exploration']").count()) > 0;
const advisorReader = (await page.locator("[data-mo3='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo3='stage-reader']").count()) > 0;

const capacity = await ask(page, "Explain Capacity");
await page.screenshot({ path: join(OUT, "01-explain-capacity.png") });
const next = await ask(page, "What should I look at next?");
await page.screenshot({ path: join(OUT, "02-look-next.png") });
const why = await ask(page, "Why?");
const show = await ask(page, "Show me that problem.");
await page.screenshot({ path: join(OUT, "03-show-problem.png") });
const revenue = await ask(page, "Explain Revenue");
const revenueNext = await ask(page, "What should I look at next?");
await page.screenshot({ path: join(OUT, "04-revenue-next.png") });
await page.screenshot({ path: join(OUT, "05-console-clean.png") });

const liveReport = {
  phase: "MO:3",
  identity: "MO:3/ObjectGuidedExecutiveExploration",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: next.engine === "MO:3/ObjectGuidedExecutiveExploration",
  capacityRecommendedProblem:
    next.kind === "INVESTIGATE" && next.target === "ctx-problem-capacity",
  lookNextCopy: /Recommended next:/i.test(next.last),
  whyPath: /Capacity Gap|connected/i.test(why.last),
  showSubject: show.subject,
  chatSubject: show.chatSubject,
  showLast: show.last.slice(0, 180),
  selectedProblem:
    show.subject === "ctx-problem-capacity" ||
    show.chatSubject === "ctx-problem-capacity",
  revenueNotCapacityFallback:
    revenueNext.target !== "ctx-problem-capacity" &&
    (revenueNext.target === "ctx-problem-margin" ||
      /Margin|Pricing|Revenue/i.test(`${revenueNext.recommended} ${revenueNext.last}`)),
  noApproveCommit: !/Recommended next: Approve/i.test(`${next.last} ${revenueNext.last}`),
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
  "capacityRecommendedProblem",
  "lookNextCopy",
  "whyPath",
  "selectedProblem",
  "revenueNotCapacityFallback",
  "noApproveCommit",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
