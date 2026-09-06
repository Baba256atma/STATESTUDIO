/**
 * NEX-ENT:1 — live /executive entrance introduction proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent1-entrance-introduction");
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

async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
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
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    const labels = [...document.querySelectorAll("[data-label-prominence]")]
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    const jargon = /NCA|DTH|BCA|RDI|DATA-UX|canonical authority/i.test(
      nexoraMessages.join(" "),
    );
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      expState: shell?.getAttribute("data-nex-exp1-state"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      introduced: shell?.getAttribute("data-nex-ent1-introduced"),
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      introCount: nexoraMessages.length,
      last: nexoraMessages.at(-1) ?? "",
      labels,
      suggested: Boolean(
        document.querySelector('[data-testid="nexora-guided-entrance-suggested-actions"]'),
      ),
      skipButton: Boolean(
        document.querySelector('[data-testid="nexora-guided-entrance-action-skip"]'),
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
  await page.waitForTimeout(350);
  return snapshot(page);
}

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector('[data-nex-ent1-state]')?.getAttribute("data-nex-ent1-state") ===
      "AWAITING_MANAGER" ||
    (document.querySelector('[data-testid="nexora-conversational-message-nexora"]')
      ?.textContent?.length ?? 0) > 8,
);
const intro = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-entrance-intro.png") });
const capability = await ask(first.page, "What can Nexora do?");
await first.page.screenshot({ path: join(OUT, "02-capability.png") });
await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "03-refresh.png") });
const skipped = await ask(first.page, "Skip introduction");
await first.page.screenshot({ path: join(OUT, "04-skip.png") });
await first.page.close();

const reenter = await open(ENTRANCE);
const reentered = await snapshot(reenter.page);
await reenter.page.screenshot({ path: join(OUT, "05-reenter.png") });
await reenter.page.close();

const liveReport = {
  phase: "NEX-ENT:1",
  identity: "NEX-ENT:1/NexoraEntranceAndIntroduction",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3 &&
    existingSnapshot.entState === "INACTIVE",
  entranceActivated:
    intro.mode === "first-time" &&
    intro.entState === "AWAITING_MANAGER" &&
    intro.center === "obj-nexora-entrance" &&
    intro.objectCount === 1,
  minimalStage: intro.objectCount === 1 && intro.labels.every((label) => /nexora/i.test(label)),
  advisorIntroduced: /Welcome to Nexora/i.test(intro.last) && intro.introCount === 1,
  suggestedActionsPresent: intro.suggested === true && intro.skipButton === true,
  naturalInteraction: /understand what matters|decisions/i.test(capability.last),
  noBusinessTruth: intro.sufficiency === "INSUFFICIENT" && capability.sufficiency === "INSUFFICIENT",
  refreshNoDuplicateActors: refreshed.objectCount === 1 && refreshed.center === "obj-nexora-entrance",
  skipSafe:
    skipped.mode === "existing-workspace" &&
    skipped.objectCount > 3 &&
    skipped.entState === "SKIPPED",
  reenterDeterministic:
    reentered.mode === "first-time" &&
    reentered.objectCount === 1 &&
    reentered.entState === "AWAITING_MANAGER",
  noDeveloperJargon: intro.jargon === false && capability.jargon === false,
  cameraFixed: intro.camera === "fixed-2d",
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
  "minimalStage",
  "advisorIntroduced",
  "suggestedActionsPresent",
  "naturalInteraction",
  "noBusinessTruth",
  "refreshNoDuplicateActors",
  "skipSafe",
  "reenterDeterministic",
  "noDeveloperJargon",
  "cameraFixed",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
