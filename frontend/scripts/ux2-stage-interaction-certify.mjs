/**
 * UX:2 live /executive WebGL certification.
 * Do not use waitUntil: "networkidle" — the Stage keeps the network busy.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux2-stage-interaction";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

async function waitForStage() {
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]');
  await page.waitForSelector('[data-ux2="stage-interaction"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas', {
    timeout: 30000,
  });
  await page.waitForTimeout(900);
}

async function snapshot(name) {
  const path = join(outDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  const state = await page.evaluate(() => {
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const advisor = document.querySelector(
      '[data-testid="nexora-advisor-insight-region"]',
    );
    const canvas = stage?.querySelector("canvas");
    const attr = (el, name) => el?.getAttribute(name) ?? null;
    const text = (sel) =>
      document.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim() ??
      null;
    const visibleIds = [
      ...document.querySelectorAll('[data-testid^="nexora-stage-object-control-"]'),
    ]
      .filter((el) => {
        const opacity = Number(el.getAttribute("data-opacity") ?? "0");
        const focused = el.getAttribute("data-focused") === "true";
        return focused || opacity > 0.05;
      })
      .map((el) => el.getAttribute("data-canonical-id"));
    const contextIds = [
      ...document.querySelectorAll('[data-testid^="nexora-stage-context-control-"]'),
    ].map((el) => el.getAttribute("data-context-subject"));
    return {
      ux1: document.querySelector('[data-ux1="simplify-executive-page"]') != null,
      ux2: attr(stage, "data-ux2"),
      canvas: {
        width: canvas?.width ?? 0,
        height: canvas?.height ?? 0,
        clientWidth: canvas?.clientWidth ?? 0,
        clientHeight: canvas?.clientHeight ?? 0,
      },
      clicked: attr(stage, "data-stage-clicked-object-id"),
      selected: attr(stage, "data-stage-selected-object-id"),
      focused: attr(stage, "data-stage-focused-object-id"),
      anchor: attr(stage, "data-stage-anchor-object-id"),
      anchorPosition: attr(stage, "data-stage-anchor-position"),
      topologyMode: attr(stage, "data-stage-topology-mode"),
      cameraMode: attr(stage, "data-stage-camera-mode"),
      stageDepth: attr(stage, "data-stage-depth"),
      interactionMode: attr(stage, "data-interaction-mode"),
      advisorStage: attr(stage, "data-advisor-subject"),
      advisorRegion: attr(advisor, "data-advisor-subject"),
      advisorKind: attr(advisor, "data-advisor-kind"),
      advisorSubjectLabel: text('[data-testid="nexora-advisor-view-subject"]'),
      breadcrumb: text('[data-testid="nexora-stage-interaction-breadcrumb"]'),
      visibleObjectIds: visibleIds,
      contextSubjectIds: contextIds,
    };
  });
  return { path, state };
}

async function openObjectsList() {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  const open = await list.evaluate((el) => el.hasAttribute("open") || el.open === true);
  if (!open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
}

async function clickStageObject(id) {
  await openObjectsList();
  const control = page.locator(`[data-testid="nexora-stage-object-control-${id}"]`);
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(700);
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  const open = await list.evaluate((el) => el.hasAttribute("open") || el.open === true);
  if (open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
  return true;
}

async function clickContext(id) {
  const control = page.locator(`[data-testid="nexora-stage-context-control-${id}"]`);
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(700);
  return true;
}

async function clickQueueCategory(category) {
  const disclosure = page.locator('[data-testid="nexora-executive-queue-disclosure"]');
  if ((await disclosure.count()) > 0) {
    const open = await disclosure.evaluate(
      (el) => el.hasAttribute("open") || el.open === true,
    );
    if (!open) {
      await disclosure.locator("summary").click();
      await page.waitForTimeout(200);
    }
  }
  const row = page.locator(`[data-testid="nexora-executive-queue-row-${category}"]`);
  if ((await row.count()) === 0) return false;
  await row.click();
  await page.waitForTimeout(700);
  return true;
}

const report = {
  url,
  viewport: { width: 1502, height: 942 },
  captures: {},
  unavailable: [],
  notes: [],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForStage();
report.captures.overview = await snapshot("01-overview");

const businessClicks = [
  ["obj-customer", "02-customer-centered"],
  ["obj-capacity", "03-capacity-centered"],
  ["obj-revenue", "03b-revenue-centered"],
  ["obj-risk", "03c-risk-centered"],
];
for (const [id, name] of businessClicks) {
  const clicked = await clickStageObject(id);
  if (!clicked) {
    report.unavailable.push(id);
    continue;
  }
  report.captures[name] = await snapshot(name);
}

await page.keyboard.press("Escape");
await page.waitForTimeout(700);

const workSubjects = [
  ["ctx-problem-capacity", "04-problem-centered", "problem"],
  ["ctx-scenario-capacity", "05-scenario-centered", "scenario"],
  ["ctx-decision-capacity", "06-decision-centered", "decision"],
  ["ctx-execution-capacity", "07-execution-centered", "execution"],
];

await clickStageObject("obj-capacity");
for (const [id, name, category] of workSubjects) {
  let clicked = await clickContext(id);
  if (!clicked) clicked = await clickStageObject(id);
  if (!clicked) {
    await clickQueueCategory(category);
    clicked = await clickStageObject(id);
  }
  if (!clicked) {
    report.unavailable.push(id);
    report.notes.push(`${id} not clickable in the live Stage dataset`);
    continue;
  }
  report.captures[name] = await snapshot(name);
  if (id === "ctx-scenario-capacity") {
    const backButton = page.locator('[data-testid="nexora-stage-step-back"]');
    if ((await backButton.count()) > 0) {
      await backButton.click();
      await page.waitForTimeout(700);
      report.captures.back = await snapshot("08-back-navigation");
      await clickContext(id) || await clickStageObject(id);
      await page.waitForTimeout(500);
    }
  }
}

await page.keyboard.press("Escape");
await page.waitForTimeout(700);
report.captures.escape = await snapshot("09-escape-overview");

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(900);
report.captures.narrow = await snapshot("10-narrow-desktop-1280x800");

await writeFile(join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
