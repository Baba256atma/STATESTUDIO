/**
 * MO:4 — live /executive Goal-Directed Navigation certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/mo4-goal-directed-navigation");
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
      engine: shell?.getAttribute("data-mo4-engine"),
      goal: shell?.getAttribute("data-mo4-goal"),
      source: shell?.getAttribute("data-mo4-source"),
      confirmed: shell?.getAttribute("data-mo4-confirmed"),
      direction: shell?.getAttribute("data-mo4-direction"),
      target: shell?.getAttribute("data-mo4-target"),
      subject: shell?.getAttribute("data-mo1-active-object-id"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      last,
    };
  });
}

const { page, http } = await createPage();
const shellPresent = (await page.locator("[data-mo4='goal-navigation']").count()) > 0;
const advisorReader = (await page.locator("[data-mo4='advisor-reader']").count()) > 0;
const stageReader = (await page.locator("[data-mo4='stage-reader']").count()) > 0;

const stated = await ask(page, "My goal is to improve delivery reliability.");
await page.screenshot({ path: join(OUT, "01-goal-stated.png") });
const current = await ask(page, "What is my current goal?");
await page.screenshot({ path: join(OUT, "02-current-goal.png") });
const capacity = await ask(page, "Explain Capacity.");
await page.screenshot({ path: join(OUT, "03-explain-capacity.png") });
const next = await ask(page, "Where should I go next?");
await page.screenshot({ path: join(OUT, "04-go-next.png") });
const why = await ask(page, "Why?");
const changed = await ask(page, "Protecting cash is now the priority.");
await page.screenshot({ path: join(OUT, "05-goal-change.png") });
const nextCash = await ask(page, "Where should I go next?");
await page.screenshot({ path: join(OUT, "06-recalculated.png") });
await page.screenshot({ path: join(OUT, "07-console-clean.png") });

const liveReport = {
  phase: "MO:4",
  identity: "MO:4/GoalDirectedExecutiveNavigation",
  completedAt: new Date().toISOString(),
  http,
  shellPresent,
  advisorReader,
  stageReader,
  enginePresent: stated.engine === "MO:4/GoalDirectedExecutiveNavigation",
  goalStated: /Improve Delivery Reliability/i.test(stated.last) || /delivery/i.test(stated.goal ?? ""),
  currentGoal: /Improve Delivery Reliability/i.test(current.last) || /delivery/i.test(current.goal ?? ""),
  capacitySubject: capacity.subject === "obj-capacity",
  goNextGoalDirected:
    /Capacity Gap|Recommended direction|Investigate/i.test(next.last) &&
    next.confirmed === "true",
  whyPath: /Capacity Gap|connected|goal/i.test(why.last),
  goalChanged: /cash/i.test(`${changed.last} ${changed.goal}`),
  rankingRecalculated:
    /cash/i.test(`${nextCash.goal} ${nextCash.last}`) &&
    nextCash.goal !== next.goal,
  noApproveCommit: !/I approved/i.test(`${next.last} ${nextCash.last}`),
  noExecutionStart: !/I started execution/i.test(`${next.last} ${nextCash.last}`),
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
  "goalStated",
  "currentGoal",
  "capacitySubject",
  "goNextGoalDirected",
  "whyPath",
  "goalChanged",
  "rankingRecalculated",
  "noApproveCommit",
  "noExecutionStart",
  "stageClickLawPresent",
  "ux1Present",
  "ux3Present",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
