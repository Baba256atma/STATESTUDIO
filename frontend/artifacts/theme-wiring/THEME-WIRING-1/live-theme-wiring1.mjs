/**
 * THEME-WIRING:1 live Day/Night + role + chart proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = `${(process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0]}?reset=1`;
await mkdir(out, { recursive: true });

async function computed(page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const right = document.querySelector('[data-testid="nexora-advisor-insight-region"]')
      ?? document.querySelector('[data-testid="nexora-right-package"]');
    const input = document.querySelector('[data-testid="nexora-conversational-input-field"]');
    const manager = document.querySelector('[data-testid="nexora-conversational-message-manager"]');
    const managerLabel = manager?.querySelector("span");
    const nexora = document.querySelector('[data-testid="nexora-conversational-message-nexora"]');
    const nexoraLabel = nexora?.querySelector("span");
    const chart = document.querySelector('[data-testid="nexora-evidence-visual-view"]');
    const report = document.querySelector('[data-testid="nexora-subject-report"]');
    const cs = (el) => (el ? getComputedStyle(el) : null);
    return {
      htmlDataTheme: html.getAttribute("data-theme"),
      shellThemeMode: shell?.getAttribute("data-theme-mode") ?? null,
      resolvedUiTheme: shell?.getAttribute("data-resolved-ui-theme") ?? null,
      focused: shell?.getAttribute("data-focused-subject") ?? null,
      presentation: shell?.getAttribute("data-presentation-state") ?? null,
      cameraMode: stage?.getAttribute("data-stage-camera-mode") ?? null,
      cameraFixed: stage?.getAttribute("data-stage-camera-fixed") ?? null,
      nxBgApp: getComputedStyle(html).getPropertyValue("--nx-bg-app").trim(),
      nxText: getComputedStyle(html).getPropertyValue("--nx-text").trim(),
      nxMuted: getComputedStyle(html).getPropertyValue("--nx-muted").trim(),
      nxRoleManagerLabel: getComputedStyle(html).getPropertyValue("--nx-role-manager-label").trim(),
      nxRoleNexoraLabel: getComputedStyle(html).getPropertyValue("--nx-role-nexora-label").trim(),
      shellBackground: cs(shell)?.backgroundColor ?? null,
      shellColor: cs(shell)?.color ?? null,
      stageBackground: cs(stage)?.backgroundColor ?? cs(stage)?.backgroundImage ?? null,
      rightBackground: cs(right)?.backgroundColor ?? null,
      inputBackground: cs(input)?.backgroundColor ?? null,
      managerColor: cs(manager)?.color ?? null,
      managerLabelColor: cs(managerLabel)?.color ?? null,
      nexoraColor: cs(nexora)?.color ?? null,
      nexoraLabelColor: cs(nexoraLabel)?.color ?? null,
      chartPresent: Boolean(chart),
      chartMetric: chart?.getAttribute("data-visual-metric") ?? null,
      chartRepresentation: chart?.getAttribute("data-visual-representation") ?? null,
      reportPresent: Boolean(report),
      localStorageTheme: localStorage.getItem("nx-theme-mode"),
    };
  });
}

async function setTheme(page, mode) {
  await page.evaluate((next) => {
    const details = [...document.querySelectorAll("details")].find((node) =>
      (node.querySelector("summary")?.textContent ?? "").toLowerCase().includes("display"),
    );
    if (details) details.open = true;
    document.querySelector(`[data-testid="executive-theme-${next}"]`)?.click();
  }, mode);
  for (let i = 0; i < 20; i += 1) {
    const current = await page.evaluate(() => ({
      html: document.documentElement.getAttribute("data-theme"),
      resolved: document
        .querySelector('[data-testid="nexora-executive-shell"]')
        ?.getAttribute("data-resolved-ui-theme"),
    }));
    if (current.html === mode && current.resolved === mode) return;
    await page.waitForTimeout(100);
  }
  throw new Error(`theme did not become ${mode}`);
}

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
await page.waitForTimeout(800);

await setTheme(page, "night");
const nightOverview = await computed(page);
await page.screenshot({ path: join(out, "night-overview.png") });

await setTheme(page, "day");
const dayOverview = await computed(page);
await page.screenshot({ path: join(out, "day-overview.png") });

await setTheme(page, "night");
await askExecutiveChat(page, "Show me Inventory chart.");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-evidence-visual-view"]')?.getAttribute("data-visual-representation") ===
    "TREND_LINE",
  null,
  { timeout: 25000 },
).catch(() => null);
await page.waitForTimeout(600);
const nightChart = await computed(page);
await page.screenshot({ path: join(out, "night-inventory-chart.png") });
await page.screenshot({ path: join(out, "night-conversation.png") });

const preserved = {
  focused: nightChart.focused,
  presentation: nightChart.presentation,
  chartRepresentation: nightChart.chartRepresentation,
};

await setTheme(page, "day");
await page.waitForTimeout(500);
const dayChart = await computed(page);
await page.screenshot({ path: join(out, "day-inventory-chart.png") });
await page.screenshot({ path: join(out, "day-conversation.png") });

await setTheme(page, "night");
await page.waitForTimeout(400);
const nightAgain = await computed(page);

await askExecutiveChat(page, "Focus on Risk");
await page.waitForFunction(
  () =>
    document.querySelector('[data-testid="nexora-executive-shell"]')?.getAttribute("data-focused-subject") ===
    "obj-risk",
  null,
  { timeout: 25000 },
).catch(() => null);
await setTheme(page, "night");
const riskNight = await computed(page);
await page.screenshot({ path: join(out, "risk-night.png") });
await setTheme(page, "day");
const riskDay = await computed(page);
await page.screenshot({ path: join(out, "risk-day.png") });

const payload = {
  identity: "NPA-T THEME-WIRING:1/LiveProof",
  url,
  errors,
  nightOverview,
  dayOverview,
  nightChart,
  dayChart,
  nightAgain,
  riskNight,
  riskDay,
  preservedAcrossSwitch: {
    focusUnchanged: dayChart.focused === preserved.focused,
    chartUnchanged: dayChart.chartRepresentation === preserved.chartRepresentation,
    nightRestoredFocus: nightAgain.focused === preserved.focused,
  },
  authority: {
    nightSynced:
      nightOverview.htmlDataTheme === "night" &&
      nightOverview.resolvedUiTheme === "night" &&
      nightOverview.shellThemeMode === "night",
    daySynced:
      dayOverview.htmlDataTheme === "day" &&
      dayOverview.resolvedUiTheme === "day" &&
      dayOverview.shellThemeMode === "day",
    pixelsChanged: nightOverview.shellBackground !== dayOverview.shellBackground,
    tokensChanged: nightOverview.nxBgApp !== dayOverview.nxBgApp,
    rolesDistinctNight:
      nightChart.managerLabelColor != null &&
      nightChart.nexoraLabelColor != null &&
      nightChart.managerLabelColor !== nightChart.nexoraLabelColor,
    rolesDistinctDay:
      dayChart.managerLabelColor != null &&
      dayChart.nexoraLabelColor != null &&
      dayChart.managerLabelColor !== dayChart.nexoraLabelColor,
  },
};

await writeFile(join(out, "live-browser.json"), `${JSON.stringify(payload, null, 2)}\n`);
await browser.close();
if (errors.length) {
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(payload, null, 2));
