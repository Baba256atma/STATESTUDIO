/**
 * NEX-EXP:1 — live /executive entrance + existing-workspace protection.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(
  process.cwd(),
  ".certification/nex-exp1-nexora-entrance-manager-identity",
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
    const labels = [...document.querySelectorAll("[data-label-prominence]")]
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      state: shell?.getAttribute("data-nex-exp1-state"),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      center: shell?.getAttribute("data-nex-exp1-center"),
      objectCount: shell?.getAttribute("data-nex-exp1-object-count"),
      focused: shell?.getAttribute("data-focused-subject"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      last,
      labels,
    };
  });
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
const first = await ask(page, "Hi.");
await page.screenshot({ path: join(OUT, "01-nexora-center.png") });
const who = await ask(page, "Who are you?");
const name = await ask(page, "I'm Dana.");
const org = await ask(page, "I work at Harbor Freight.");
const role = await ask(page, "My role is operations director.");
const domain = await ask(page, "We work in logistics.");
await page.screenshot({ path: join(OUT, "02-identity-center.png") });
const know = await ask(page, "What do you know about me?");
const need = await ask(page, "What do you still need to know?");
const why = await ask(page, "Why are you asking this?");
const goal = await ask(page, "I'm trying to reduce delivery delays.");
const correction = await ask(page, "Actually, we're a manufacturing company.");
await page.screenshot({ path: join(OUT, "03-console-clean.png") });

const liveReport = {
  phase: "NEX-EXP:1",
  identity: "NEX-EXP:1/NexoraEntranceManagerIdentityExperience",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    existingSnapshot.objectCount > 3,
  firstTimeNexoraCenter:
    first.center === "obj-nexora-entrance" &&
    Number(first.objectCount) === 1 &&
    /Nexora/i.test(first.last) &&
    first.camera === "fixed-2d",
  introPresent: /understand who I’m working with|understand who I'm working with/i.test(
    `${first.last} ${who.last}`,
  ),
  namePartial: name.sufficiency === "PARTIAL",
  identityBecameCenter:
    domain.center === "obj-executive-context" &&
    domain.focused === "obj-executive-context" &&
    /trying to achieve/i.test(domain.last),
  noObjectExplosion: Number(domain.objectCount) === 1,
  topologyPresent: Boolean(domain.topologyZ),
  cameraFixed: domain.camera === "fixed-2d",
  knownCopy: /Known:/i.test(know.last),
  unknownCopy: /unknown|enough/i.test(need.last),
  whyCopy: /executive context/i.test(why.last),
  correctionCopy: /manufacturing/i.test(correction.last),
  goalHandoff: /trying to achieve|delivery delays/i.test(goal.last),
  noWelcomeBackTitle: !/Welcome back, Operations Director/i.test(
    `${first.last} ${domain.last}`,
  ),
  ux3Present: (await page.locator("[data-ux3='professional-advisor']").count()) > 0,
  stageClickLawPresent:
    (await page.locator("[data-ux2-center-law='click-object-center-recompose']").count()) > 0,
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
  "existingWorkspaceProtected",
  "firstTimeNexoraCenter",
  "introPresent",
  "identityBecameCenter",
  "noObjectExplosion",
  "cameraFixed",
  "knownCopy",
  "goalHandoff",
  "ux3Present",
  "stageClickLawPresent",
];
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
