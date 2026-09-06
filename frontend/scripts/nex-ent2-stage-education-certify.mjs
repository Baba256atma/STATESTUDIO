/**
 * NEX-ENT:2 — live /executive Stage education proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent2-stage-education");
const EXISTING = "http://localhost:3000/executive";
const ENTRANCE = "http://localhost:3000/executive?entrance=1&reset=1";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

function attachConsole(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
}

async function open(url, options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1502, height: 942 },
    ...options,
  });
  page.setDefaultTimeout(45000);
  attachConsole(page);
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(900);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    const labels = [...document.querySelectorAll("[data-label-prominence]")]
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    const suggested = [
      ...document.querySelectorAll("[data-suggestion-kind]"),
    ].map((node) => ({
      id: node.getAttribute("data-testid"),
      kind: node.getAttribute("data-suggestion-kind"),
      label: node.textContent?.trim() ?? "",
    }));
    const jargon = /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection|Director authority|HUD|scene script/i.test(
      nexoraMessages.join(" "),
    );
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      expState: shell?.getAttribute("data-nex-exp1-state"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent2State: shell?.getAttribute("data-nex-ent2-state"),
      ent2Focus: shell?.getAttribute("data-nex-ent2-focus"),
      ent2Interacted: shell?.getAttribute("data-nex-ent2-interacted"),
      introduced: shell?.getAttribute("data-nex-ent1-introduced"),
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      interactionMode: shell?.getAttribute("data-interaction-mode"),
      focusedSubject: shell?.getAttribute("data-focused-subject"),
      environmentIntent: mount?.getAttribute("data-environment-intent"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      introCount: nexoraMessages.length,
      last: nexoraMessages.at(-1) ?? "",
      labels,
      suggested,
      suggestedKinds: suggested.map((item) => item.kind),
      skipButton: Boolean(
        document.querySelector('[data-testid="nexora-guided-entrance-action-skip"]') ||
          document.querySelector('[data-testid="nexora-guided-entrance-action-skip-education"]'),
      ),
      jargon,
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

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const intro = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-entrance-intro.png") });

const shown = await ask(first.page, "Show me");
await first.page.screenshot({ path: join(OUT, "02-stage-education.png") });

const whatStage = await ask(first.page, "What is the Stage?");
await first.page.screenshot({ path: join(OUT, "03-what-is-stage.png") });

const dashboard = await ask(first.page, "Is it a dashboard?");
await first.page.screenshot({ path: join(OUT, "04-dashboard.png") });

const appears = await ask(first.page, "What appears here?");
await first.page.screenshot({ path: join(OUT, "05-appears.png") });

const unrelated = await ask(first.page, "Show problems");
await first.page.screenshot({ path: join(OUT, "06-unrelated.png") });

const focus = await ask(first.page, "Show me how focus works");
await first.page.screenshot({ path: join(OUT, "07-focus.png") });

await first.page.locator('[data-testid="nexora-stage-object-list"]').evaluate((el) => {
  el.open = true;
});
const objectControl = first.page.locator(
  '[data-testid="nexora-stage-object-control-obj-nexora-entrance"]',
);
await objectControl.waitFor({ state: "attached", timeout: 8000 });
await objectControl.click({ force: true });
await first.page.waitForFunction(
  () =>
    document
      .querySelector("[data-nex-ent2-interacted]")
      ?.getAttribute("data-nex-ent2-interacted") === "true" ||
    /focus the workspace/i.test(
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "",
    ),
);
const interacted = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "08-interaction.png") });

await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "09-refresh.png") });

const skipped = await ask(first.page, "Skip this");
await first.page.screenshot({ path: join(OUT, "10-skip.png") });
await first.page.close();

const reduced = await open(ENTRANCE, {
  reducedMotion: "reduce",
});
await reduced.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const reducedIntro = await snapshot(reduced.page);
const reducedShown = await ask(reduced.page, "Show me");
const reducedFocus = await ask(reduced.page, "Show me how focus works");
await reduced.page.screenshot({ path: join(OUT, "11-reduced-motion.png") });
await reduced.page.close();

const reenter = await open(ENTRANCE);
const reentered = await snapshot(reenter.page);
await reenter.page.screenshot({ path: join(OUT, "12-reenter.png") });
await reenter.page.close();

const liveReport = {
  phase: "NEX-ENT:2",
  identity: "NEX-ENT:2/StageWorkspaceEducation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3 &&
    existingSnapshot.entState === "INACTIVE" &&
    existingSnapshot.ent2State === "INACTIVE",
  entranceActivated:
    intro.mode === "first-time" &&
    intro.entState === "AWAITING_MANAGER" &&
    intro.center === "obj-nexora-entrance" &&
    intro.objectCount === 1,
  stageEducationBegan:
    shown.ent2State === "INTRODUCING" &&
    /this is your stage/i.test(shown.last) &&
    shown.objectCount === 1 &&
    shown.environmentIntent === "investigate",
  stageQuestion:
    /active executive workspace/i.test(whatStage.last) &&
    whatStage.objectCount === 1,
  dashboardDistinction: /isn.t a fixed dashboard|not a fixed dashboard/i.test(dashboard.last),
  appearsWithoutObjectEducation:
    /relevant things/i.test(appears.last) &&
    !/Goal → KPI|object families/i.test(appears.last),
  suggestedQuestionKind:
    shown.suggestedKinds.includes("question") &&
    shown.suggested.some((item) => /focus|appears|dashboard/i.test(item.label)),
  unrelatedAvailable:
    !/this is your stage/i.test(unrelated.last) &&
    unrelated.ent2State === "INTRODUCING" &&
    unrelated.objectCount === 1,
  focusDemonstrated:
    focus.ent2Focus === "true" &&
    focus.interactionMode === "object-focused" &&
    focus.focusedSubject === "obj-nexora-entrance" &&
    /brought Nexora into focus/i.test(focus.last) &&
    focus.objectCount === 1,
  managerInteractionAcknowledged:
    interacted.ent2Interacted === "true" &&
    /focus the workspace/i.test(interacted.last),
  refreshNoDuplicateActors:
    refreshed.objectCount === 1 && refreshed.center === "obj-nexora-entrance",
  skipSafe:
    skipped.mode === "existing-workspace" &&
    skipped.objectCount > 3 &&
    (skipped.entState === "SKIPPED" || skipped.ent2State === "SKIPPED"),
  reducedMotionUnderstood:
    /this is your stage/i.test(reducedShown.last) &&
    reducedFocus.ent2Focus === "true" &&
    reducedFocus.objectCount === 1 &&
    reducedIntro.objectCount === 1,
  reenterDeterministic:
    reentered.mode === "first-time" &&
    reentered.objectCount === 1 &&
    reentered.entState === "AWAITING_MANAGER",
  noDeveloperJargon:
    intro.jargon === false &&
    shown.jargon === false &&
    whatStage.jargon === false &&
    dashboard.jargon === false &&
    focus.jargon === false,
  cameraFixed: intro.camera === "fixed-2d",
  noFabricatedObjects: shown.objectCount === 1 && focus.objectCount === 1,
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
  "entranceActivated",
  "stageEducationBegan",
  "stageQuestion",
  "dashboardDistinction",
  "appearsWithoutObjectEducation",
  "suggestedQuestionKind",
  "unrelatedAvailable",
  "focusDemonstrated",
  "managerInteractionAcknowledged",
  "refreshNoDuplicateActors",
  "skipSafe",
  "reducedMotionUnderstood",
  "reenterDeterministic",
  "noDeveloperJargon",
  "cameraFixed",
  "noFabricatedObjects",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
