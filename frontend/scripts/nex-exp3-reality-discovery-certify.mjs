/**
 * NEX-EXP:3 — live reality discovery, Goal-center preservation, workspace protection.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp3-current-reality-executive-context",
);
const EXISTING = "http://localhost:3000/executive";
const ENTRANCE = "http://localhost:3000/executive?entrance=1&reset=1";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

async function createPage(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(700);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      goalState: shell?.getAttribute("data-nex-exp2-state"),
      realityState: shell?.getAttribute("data-nex-exp3-state"),
      sufficiency: shell?.getAttribute("data-nex-exp3-sufficiency"),
      gap: shell?.getAttribute("data-nex-exp3-gap"),
      realityObjects: Number(shell?.getAttribute("data-nex-exp3-object-count") ?? 0),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      last,
    };
  });
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
  return snapshot(page);
}

const existing = await createPage(EXISTING);
const existingSnapshot = await existing.page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    mode: shell?.getAttribute("data-nex-exp1-mode"),
    objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
  };
});
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
await ask(page, "Hi.");
await ask(page, "I'm Dana. I run operations for a logistics company.");
const goal = await ask(page, "We need to improve delivery reliability.");
await page.screenshot({ path: join(OUT, "01-goal-center.png") });
const measure = await ask(page, "On-time delivery is around 91%. We want 96%.");
const conditions = await ask(
  page,
  "Our backlog is high and capacity is almost full.",
);
await page.screenshot({ path: join(OUT, "02-reality-around-goal.png") });
const know = await ask(page, "What do we know?");
const unknown = await ask(page, "What don't we know?");
const current = await ask(page, "What is the current value?");
const target = await ask(page, "What is the target?");
const gap = await ask(page, "What's the gap?");
const provenance = await ask(page, "Where did that number come from?");
const freshness = await ask(page, "How current is this data?");
const measured = await ask(page, "Is this measured or something I told you?");
const caused = await ask(page, "Does that mean Capacity caused the gap?");
const show = await ask(page, "Show Capacity.");
const explain = await ask(page, "Explain this.");
const relate = await ask(page, "How does this relate to my goal?");
const ready = await ask(page, "Are we ready to investigate the problem?");
await page.screenshot({ path: join(OUT, "03-console-clean.png") });
await page.close();

const liveReport = {
  phase: "NEX-EXP:3",
  identity: "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  goalRemainsCenterAfterGoal:
    goal.focused === "goal-executive-discovered" && goal.camera === "fixed-2d",
  goalRemainsCenterAfterReality:
    conditions.focused === "goal-executive-discovered" &&
    conditions.center === "goal-executive-discovered",
  gapKnown: /5 percentage points|below the target|Gap:/i.test(
    `${measure.last} ${gap.last}`,
  ),
  objectsEmerged:
    conditions.objectCount >= 3 &&
    conditions.objectCount <= 6 &&
    conditions.realityObjects >= 1,
  noCauseClaim: /not a confirmed cause/i.test(caused.last),
  noHireRecommendation: !/hire more staff/i.test(
    `${measure.last} ${conditions.last} ${ready.last}`,
  ),
  knowCopy: /91%|current/i.test(know.last),
  unknownCopy: /missing piece|unknown/i.test(unknown.last),
  currentCopy: /91%|current value/i.test(current.last),
  targetCopy: /96%|target/i.test(target.last),
  provenanceCopy: /manager-reported|comes from|provenance/i.test(provenance.last),
  freshnessCopy: /current|stale|unknown/i.test(freshness.last),
  measuredCopy: /manager-reported|validated/i.test(measured.last),
  showExplainWorked: show.last.length > 8 && explain.last.length > 8,
  relateWorked: /goal/i.test(relate.last),
  readyBoundary: /issue discovery has not started|enough context/i.test(ready.last),
  cameraFixed: conditions.camera === "fixed-2d",
  topologyPresent: Boolean(conditions.topologyZ),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "goalRemainsCenterAfterGoal",
  "goalRemainsCenterAfterReality",
  "gapKnown",
  "objectsEmerged",
  "noCauseClaim",
  "cameraFixed",
];
const missing = required.filter((key) => liveReport[key] !== true);
if (http !== 200 || errors.length > 0 || missing.length > 0) {
  console.error("NEX-EXP:3 live cert failed", { missing, errors });
  process.exit(1);
}
