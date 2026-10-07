/**
 * RIGHT-PANEL-POLISH:1-FIX1 live /executive first-viewport proof.
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

async function advisorSnapshot(page) {
  return page.evaluate(() => {
    const read = (sel) =>
      document.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
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
      recommendationPrimary: read('[data-testid="nexora-advisor-recommendation-primary"]'),
      priorityWeight:
        document
          .querySelector('[data-testid="nexora-advisor-top-priority"]')
          ?.getAttribute("data-advisor-weight") ?? null,
      attentionWeight:
        document
          .querySelector('[data-testid="nexora-advisor-attention"]')
          ?.getAttribute("data-advisor-weight") ?? null,
      history: Boolean(document.querySelector('[data-advisor-history="true"]')),
      ask: Boolean(document.querySelector('[data-testid="nexora-advisor-ask"]')),
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
await askExecutiveChat(page, "Approve Expand Capacity");
let after = await advisorSnapshot(page);
if (after.guidance !== "execution-readiness") {
  await askExecutiveChat(page, "Approve Demand Surge");
  after = await advisorSnapshot(page);
}
await page
  .locator('[data-testid="executive-advisor-tab-assist"]')
  .first()
  .evaluate((el) => el.click())
  .catch(() => null);
await page.waitForTimeout(400);
after = await advisorSnapshot(page);
await page.screenshot({
  path: join(out, "after-execution-readiness.png"),
  clip: { x: 980, y: 48, width: 500, height: 720 },
});
await page.screenshot({ path: join(out, "after-full.png") });

const g1 =
  after.recommendationPrimary.length > 0 &&
  !/Viewing this scene does not start execution/i.test(after.recommendationPrimary) &&
  !/Starting work requires an explicit start/i.test(after.recommendationPrimary);
const g4 =
  after.readinessPresent &&
  after.readinessRows.every(
    (row) => row.status !== "unknown" || /not established/i.test(row.text),
  );
const g5 = after.priorityWeight === "secondary" || after.attentionWeight === "secondary";
const g7 = after.ask;
const g11 = g1 && g4 && after.guidance === "execution-readiness";

const report = {
  identity: "NPA-T RIGHT-PANEL-POLISH:1-FIX1/ExecutiveAdvisorMicroPolish",
  url,
  after,
  gates: { g1, g4, g5, g7, g11 },
};
await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();
const ok =
  g1 &&
  g4 &&
  g5 &&
  g7 &&
  g11 &&
  after.stageReadinessCard === false &&
  after.history === true;
console.log(ok ? "RIGHT-PANEL-POLISH:1-FIX1 live ok" : "RIGHT-PANEL-POLISH:1-FIX1 live FAIL");
console.log(
  JSON.stringify(
    {
      g1,
      g4,
      g5,
      g7,
      g11,
      situation: after.situation,
      primary: after.recommendationPrimary,
      subject: after.subject,
    },
    null,
    2,
  ),
);
process.exit(ok ? 0 : 1);
