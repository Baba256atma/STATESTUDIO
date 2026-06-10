/**
 * MRP:10:11-FIX runtime evidence collector — headless browser session at /type-c
 * Usage: node scripts/mrp10-runtime-evidence.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../.tmp/mrp10-runtime-evidence");
const BASE_URL = process.env.MRP10_BASE_URL ?? "http://localhost:3000";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const consoleLines = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[MRP10RuntimeTrace]") || text.includes("activeTab=")) {
      consoleLines.push(text);
    }
  });

  console.log(`Navigating to ${BASE_URL}/type-c ...`);
  await page.goto(`${BASE_URL}/type-c`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(8000);

  const domEvidence = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => [...document.querySelectorAll(sel)].map((el) => el.tagName + (el.id ? `#${el.id}` : "") + (el.getAttribute("data-nx") ? `[data-nx=${el.getAttribute("data-nx")}]` : ""));

    const rightPanelRoot = q("#nexora-right-panel-root");
    const shell = q("#nexora-main-right-panel-shell");
    const runtimePanel = q('[data-nx="dashboard-runtime-panel"]');
    const homeSurface = q('[data-nx="executive-dashboard-home-surface"]') ?? q('[data-nx-dashboard-home="true"]');
    const dedicatedHeader = q('[data-nx="dedicated-dashboard-mode-header"]');
    const legacyHost = q('[data-nx="dashboard-runtime-legacy-host"]');

    const trace = window.__MRP10_RUNTIME_TRACE__ ?? [];

    return {
      url: location.href,
      rightPanelRootChildCount: rightPanelRoot?.childElementCount ?? 0,
      rightPanelRootHtmlSnippet: rightPanelRoot?.innerHTML?.slice(0, 500) ?? null,
      hasMainRightPanelShell: Boolean(shell),
      hasDashboardRuntimePanel: Boolean(runtimePanel),
      dashboardModeAttr: runtimePanel?.getAttribute("data-nx-dashboard-mode") ?? null,
      hasExecutiveDashboardHomeSurface: Boolean(homeSurface),
      hasDedicatedDashboardModeHeader: Boolean(dedicatedHeader),
      hasLegacyHostSlot: Boolean(legacyHost),
      mrpTab: shell?.getAttribute("data-nx-mrp-tab") ?? null,
      shellDashboardMode: shell?.getAttribute("data-nx-dashboard-mode") ?? null,
      visibleTextSample: rightPanelRoot?.textContent?.replace(/\s+/g, " ").trim().slice(0, 300) ?? null,
      dataNxMarkers: qa("[data-nx]").filter((s) => /dashboard|mrp|right-panel|executive|dedicated/i.test(s)).slice(0, 30),
      trace,
    };
  });

  const screenshotPath = path.join(OUT_DIR, "type-c-right-panel.png");
  const aside = page.locator("aside").first();
  if (await aside.count()) {
    await aside.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  const report = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    consoleLines,
    domEvidence,
    screenshotPath,
  };

  await writeFile(path.join(OUT_DIR, "evidence.json"), JSON.stringify(report, null, 2));
  console.log("\n=== MRP10 RUNTIME EVIDENCE ===\n");
  console.log("Console [MRP10RuntimeTrace] lines:");
  consoleLines.forEach((line) => console.log(line));
  console.log("\nDOM evidence:");
  console.log(JSON.stringify(domEvidence, null, 2));
  console.log(`\nScreenshot: ${screenshotPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
