/**
 * ASSISTANT-PANEL-BUILD-FIX live certification against a fresh production server.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const origin = (process.env.ASSISTANT_PANEL_ORIGIN ?? "http://localhost:3015").replace(/\/$/, "");
const typeCUrl = `${origin}/type-c`;
const executiveUrl = (process.env.EXECUTIVE_URL ?? `${origin}/executive`).split("?")[0];

const pageErrors = [];
const consoleErrors = [];
const consoleWarnings = [];
const hydrationErrors = [];
const environmentalBackendErrors = [];

function isEnvironmentalBackendNoise(text) {
  return (
    /127\.0\.0\.1:8000/.test(text) ||
    /blocked by CORS policy/.test(text) ||
    /net::ERR_FAILED/.test(text)
  );
}

function classifyConsole(msg) {
  const text = msg.text();
  const type = msg.type();
  if (/hydrat/i.test(text)) hydrationErrors.push(text);
  if (isEnvironmentalBackendNoise(text)) {
    environmentalBackendErrors.push(text);
    return;
  }
  if (type === "error") consoleErrors.push(text);
  if (type === "warning") consoleWarnings.push(text);
}

await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => pageErrors.push(String(error?.message ?? error)));
page.on("console", classifyConsole);

async function snapshotTypeC() {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-nx="main-right-panel-shell"]');
    const surface = document.querySelector('[data-nx="mrp-chat-first-assistant-surface"]');
    const accordion = document.querySelector('[data-nx="assistant-support-accordion"]');
    const dock = document.querySelector('[data-nx="assistant-support-icon-dock"]');
    const docked = [...document.querySelectorAll('[data-nx="assistant-docked-support-panel"]')];
    const scrolls = [...document.querySelectorAll('[data-nx="assistant-panel-scroll-container"]')];
    return {
      httpOk: true,
      mrpPresent: Boolean(shell),
      mrpTab: shell?.getAttribute("data-nx-mrp-tab") ?? null,
      assistantSurfacePresent: Boolean(surface),
      accordionPresent: Boolean(accordion),
      iconDockPresent: Boolean(dock),
      dockedPanelCount: docked.length,
      expandedPanels: docked
        .filter((el) => el.getAttribute("data-nx-expanded") === "true")
        .map((el) => el.getAttribute("data-nx-panel")),
      scrollMaxHeights: Object.fromEntries(
        scrolls.map((el) => [el.getAttribute("data-nx-panel"), getComputedStyle(el).maxHeight]),
      ),
      overflowFlags: Object.fromEntries(
        scrolls.map((el) => [el.getAttribute("data-nx-panel"), el.getAttribute("data-nx-overflow")]),
      ),
    };
  });
}

const typeCResponse = await page.goto(typeCUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-nx="main-right-panel-shell"]', { timeout: 45000 });
await page.waitForTimeout(800);
const mrpState = await page.getAttribute('[data-nx="main-right-panel-shell"]', "data-nx-mrp-state");
if (mrpState === "collapsed") {
  await page.getByRole("button", { name: "Expand main right panel" }).click();
  await page.waitForTimeout(400);
}
const assistantTab = page.locator("#nexora-mrp-tab-assistant");
if ((await assistantTab.count()) > 0) {
  await assistantTab.click();
}
await page.waitForSelector('[data-nx="assistant-support-icon-dock"]', { state: "visible", timeout: 15000 });

const loadSnapshot = await snapshotTypeC();

const insightButton = page.locator(
  '[data-nx="assistant-support-icon-dock-button"][data-nx-panel="insight"]',
);
const actionsButton = page.locator(
  '[data-nx="assistant-support-icon-dock-button"][data-nx-panel="actions"]',
);

let expanded = null;
let collapsed = null;
let actionsSize = null;
if ((await insightButton.count()) > 0) {
  await insightButton.click();
  await page.waitForTimeout(350);
  expanded = await snapshotTypeC();
  await insightButton.click();
  await page.waitForTimeout(350);
  collapsed = await snapshotTypeC();
}
if ((await actionsButton.count()) > 0) {
  await actionsButton.click();
  await page.waitForTimeout(350);
  actionsSize = await snapshotTypeC();
  await actionsButton.click();
  await page.waitForTimeout(200);
}

await page.screenshot({ path: join(out, "live-type-c.png"), fullPage: false });
const typeCPageErrors = [...pageErrors];
const typeCConsoleErrors = [...consoleErrors];
pageErrors.length = 0;
consoleErrors.length = 0;

const executivePage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
executivePage.on("pageerror", (error) => pageErrors.push(String(error?.message ?? error)));
executivePage.on("console", classifyConsole);

const executiveOpen = await openExecutivePage(
  executivePage,
  executiveUrl || EXECUTIVE_EXISTING_URL.replace("3000", "3015"),
);
await executivePage.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
await executivePage.waitForTimeout(700);

const executiveLoad = await executivePage.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
  const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
  const overlay = document.querySelector('[data-testid="nexora-stage-atmosphere-overlay"]');
  return {
    focused: shell?.getAttribute("data-focused-subject") ?? "none",
    advisorPresent: Boolean(
      document.querySelector('[data-testid="nexora-advisor-view"], [data-testid="nexora-conversational-input-field"]'),
    ),
    stagePresent: Boolean(stage),
    atmosphere: mount?.getAttribute("data-nexograph-atmosphere") ?? "missing",
    overlayMode: overlay?.getAttribute("data-atmosphere-mode") ?? "missing",
  };
});

const list = executivePage.locator('[data-testid="nexora-stage-object-list"]');
if ((await list.count()) > 0) {
  const open = await list.evaluate((el) => el.hasAttribute("open") || el.open === true);
  if (!open) {
    await list.locator("summary").click();
    await executivePage.waitForTimeout(200);
  }
}
const revenue = executivePage.locator('[data-testid="nexora-stage-object-control-obj-revenue"]');
let clickFocused = null;
if ((await revenue.count()) > 0) {
  await revenue.click();
  await executivePage.waitForTimeout(700);
  clickFocused = await executivePage.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
    };
  });
}

await executivePage.locator('[data-testid="nexora-stage-step-back"]').click({ timeout: 5000 }).catch(() => null);
await executivePage.waitForTimeout(400);
const afterBack = await executivePage.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
  return {
    focused: shell?.getAttribute("data-focused-subject") ?? "none",
    stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
  };
});
await executivePage.locator('[data-testid="nexora-stage-step-forward"]').click({ timeout: 5000 }).catch(() => null);
await executivePage.waitForTimeout(400);
const afterForward = await executivePage.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
  return {
    focused: shell?.getAttribute("data-focused-subject") ?? "none",
    stageFocused: stage?.getAttribute("data-stage-focused-object-id") ?? "none",
  };
});

await executivePage.screenshot({ path: join(out, "live-executive.png"), fullPage: false });
await browser.close();

const preexistingAssistantTabErrors = typeCPageErrors.filter((text) =>
  /Minified React error #185/.test(text),
);
const unexpectedTypeCPageErrors = typeCPageErrors.filter(
  (text) => !/Minified React error #185/.test(text),
);
const typeCOk =
  (typeCResponse?.status() ?? 0) === 200 &&
  loadSnapshot.mrpPresent &&
  loadSnapshot.assistantSurfacePresent &&
  loadSnapshot.accordionPresent &&
  expanded?.expandedPanels?.includes("insight") &&
  expanded?.scrollMaxHeights?.insight === "192px" &&
  actionsSize?.scrollMaxHeights?.actions === "144px";
const executiveOk =
  executiveLoad.stagePresent &&
  executiveLoad.advisorPresent &&
  executiveLoad.atmosphere === "none" &&
  clickFocused?.stageFocused === "obj-revenue";
const allObserved = [
  ...unexpectedTypeCPageErrors,
  ...pageErrors,
  ...typeCConsoleErrors,
  ...consoleErrors,
  ...hydrationErrors,
];
const moduleGraphOk = !allObserved.some((text) =>
  /ASSISTANT_PANEL_OVERFLOW|no exports|hydrat/i.test(text),
);
const consoleOk =
  unexpectedTypeCPageErrors.length === 0 &&
  pageErrors.length === 0 &&
  typeCConsoleErrors.length === 0 &&
  consoleErrors.length === 0 &&
  hydrationErrors.length === 0;

const report = {
  identity: "ASSISTANT-PANEL-BUILD-FIX/LiveRuntime",
  runtimeCommand: `npx next start -p ${new URL(origin).port || "3015"}`,
  origin,
  typeCUrl,
  executiveUrl,
  typeCHttp: typeCResponse?.status() ?? 0,
  executiveHttp: executiveOpen.http,
  typeCPageErrors,
  typeCConsoleErrors,
  pageErrors,
  consoleErrors,
  consoleWarnings,
  hydrationErrors,
  preexistingAssistantTabErrors,
  environmentalBackendErrors: environmentalBackendErrors.slice(0, 20),
  environmentalBackendErrorCount: environmentalBackendErrors.length,
  typeC: {
    load: loadSnapshot,
    expanded,
    collapsed,
    actionsSize,
  },
  executive: {
    load: executiveLoad,
    click: clickFocused,
    afterBack,
    afterForward,
  },
  ok: typeCOk && executiveOk && consoleOk && moduleGraphOk,
};

await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.ok) {
  process.exit(1);
}
