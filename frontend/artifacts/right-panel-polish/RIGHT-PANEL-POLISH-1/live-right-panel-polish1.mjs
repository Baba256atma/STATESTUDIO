/**
 * RIGHT-PANEL-POLISH:1 live /executive Advisor hierarchy proof.
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

async function advisorHierarchy(page) {
  return page.evaluate(() => {
    const read = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const rows = [...document.querySelectorAll("[data-readiness-status]")].map((row) => ({
      id: row.getAttribute("data-testid"),
      status: row.getAttribute("data-readiness-status"),
      text: row.textContent?.replace(/\s+/g, " ").trim() ?? "",
    }));
    return {
      polish: document.querySelector('[data-right-panel-polish="1"]') != null,
      subject: read('[data-testid="nexora-advisor-view-subject"]'),
      situation: read('[data-testid="nexora-advisor-observation"]'),
      readinessPresent: Boolean(document.querySelector('[data-testid="nexora-advisor-readiness"]')),
      readinessRows: rows,
      recommendation: read('[data-testid="nexora-advisor-recommendation"]'),
      why: read('[data-testid="nexora-advisor-why"]'),
      ask: Boolean(document.querySelector('[data-testid="nexora-advisor-ask"]')),
      detailsTab: Boolean(document.querySelector('[data-testid="executive-advisor-tab-insight"]')),
      stageReadinessCard: Boolean(
        document.querySelector('[data-testid="nexora-theatre-execution-readiness"]'),
      ),
      view: Boolean(document.querySelector('[data-testid="nexora-presentation-state-selector"]')),
      guidance: document
        .querySelector("[data-theatre-advisor-guidance]")
        ?.getAttribute("data-theatre-advisor-guidance"),
    };
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
if ((await reviewBtn.count()) > 0) {
  await reviewBtn.first().evaluate((el) => el.click());
  await page.waitForTimeout(400);
}
await askExecutiveChat(page, "Approve Demand Surge");
await page.locator('[data-testid="executive-advisor-tab-assist"]').first().evaluate((el) => el.click()).catch(() => null);
await page.waitForTimeout(400);
const after = await advisorHierarchy(page);
await page.screenshot({ path: join(out, "after-execution-readiness.png") });

const g2 = /committed decision/i.test(after.situation) && /not started/i.test(after.situation);
const g3 = after.readinessPresent && after.readinessRows.every((row) => row.status !== "unknown" || /not established/i.test(row.text));
const g4 = after.readinessRows.every((row) => row.status !== "unknown" || !/blocked/i.test(row.text));
const g5 = /next best action/i.test(after.recommendation);
const g11 = after.ask;
const g12 = after.polish && g2 && g3 && g5;

const report = {
  identity: "NPA-T RIGHT-PANEL-POLISH:1/ExecutiveAdvisorInformationHierarchy",
  url,
  after,
  gates: { g2, g3, g4, g5, g11, g12 },
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok = g2 && g3 && g4 && g5 && g11 && g12 && after.stageReadinessCard === false;
console.log(ok ? "RIGHT-PANEL-POLISH:1 live ok" : "RIGHT-PANEL-POLISH:1 live FAIL");
console.log(JSON.stringify({ g2, g3, g4, g5, g11, situation: after.situation, rows: after.readinessRows.length }, null, 2));
process.exit(ok ? 0 : 1);
