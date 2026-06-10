/**
 * MRP:10:12 runtime validation — visible right rail host at /type-c
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../.tmp/mrp10-visible-host-evidence");
const BASE_URL = process.env.MRP10_BASE_URL ?? "http://localhost:3000";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const consoleLines = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[MRP10VisibleHost]") || text.includes("[MRP10RuntimeTrace]")) {
      consoleLines.push(text);
    }
  });

  await page.goto(`${BASE_URL}/type-c`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForSelector("#nexora-visible-mrp-host", { timeout: 60000 });
  await page.waitForTimeout(5000);

  const dashboardEvidence = await page.evaluate(() => {
    const home = document.querySelector('[data-nx="executive-dashboard-home-surface"]');
    const visibleHost = document.getElementById("nexora-visible-mrp-host");
    const hiddenRoot = document.getElementById("nexora-right-panel-root");
    const objectShell = document.querySelector('[data-nx="object-panel-shell"]');
    const assistantShell = document.querySelector('[data-nx="executive-assistant-shell"]');
    const rect = (el) => (el instanceof HTMLElement ? el.getBoundingClientRect() : null);
    const homeRect = rect(home);
    const visibleHostRect = rect(visibleHost);
    return {
      hasVisibleMrpHost: Boolean(visibleHost),
      visibleHostRect: visibleHostRect
        ? { width: visibleHostRect.width, height: visibleHostRect.height }
        : null,
      hasHomeSurface: Boolean(home),
      homeRect: homeRect ? { width: homeRect.width, height: homeRect.height } : null,
      hiddenRootChildCount: hiddenRoot?.childElementCount ?? 0,
      objectPanelShellState: objectShell?.getAttribute("data-nx-state") ?? null,
      executiveAssistantShellPresent: Boolean(assistantShell),
      trace: window.__MRP10_VISIBLE_HOST_TRACE__ ?? [],
    };
  });

  await page.locator("#nexora-visible-mrp-host").screenshot({
    path: path.join(OUT_DIR, "visible-mrp-host-dashboard.png"),
  });

  await page.getByRole("tab", { name: "Assistant" }).click();
  await page.waitForTimeout(2000);

  const assistantEvidence = await page.evaluate(() => {
    const home = document.querySelector('[data-nx="executive-dashboard-home-surface"]');
    const assistantHost = document.getElementById("nexora-executive-assistant-host");
    const homeRect = home instanceof HTMLElement ? home.getBoundingClientRect() : null;
    const assistantRect = assistantHost instanceof HTMLElement ? assistantHost.getBoundingClientRect() : null;
    return {
      homeHidden: home instanceof HTMLElement ? getComputedStyle(home).display === "none" : true,
      homeRect: homeRect ? { width: homeRect.width, height: homeRect.height } : null,
      assistantRect: assistantRect ? { width: assistantRect.width, height: assistantRect.height } : null,
    };
  });

  await page.locator("#nexora-visible-mrp-host").screenshot({
    path: path.join(OUT_DIR, "visible-mrp-host-assistant.png"),
  });

  await page.getByRole("tab", { name: "Dashboard" }).click();
  await page.waitForTimeout(2000);

  const report = {
    capturedAt: new Date().toISOString(),
    consoleLines: [...new Set(consoleLines)],
    dashboardEvidence,
    assistantEvidence,
  };

  await writeFile(path.join(OUT_DIR, "evidence.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
