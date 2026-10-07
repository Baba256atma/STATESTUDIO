/**
 * STAGE-GUIDANCE:1 live /executive proof.
 * Journey 1: Expand Capacity on Stage without DTH:8–12 cards.
 * Journey 2: certified DTH:9 commit (Demand Surge) → Advisor readiness, no Stage card.
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
const pageErrors = [];
const consoleErrors = [];

await mkdir(out, { recursive: true });

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const advisor = document.querySelector("[data-theatre-advisor-guidance]");
    const objectCardRight = document.querySelector(
      '[data-testid="nexora-right-package-working-context"] [data-testid="nexora-theatre-investigation"]',
    );
    const stageObjectCard = document.querySelector(
      '[data-testid="nexora-stage-mount"] [data-testid="nexora-theatre-investigation"]',
    );
    const readinessCard = document.querySelector(
      '[data-testid="nexora-theatre-execution-readiness"]',
    );
    const commitmentCard = document.querySelector(
      '[data-testid="nexora-theatre-decision-commitment"]',
    );
    const liveCard = document.querySelector('[data-testid="nexora-theatre-live-execution"]');
    const outcomeCard = document.querySelector(
      '[data-testid="nexora-theatre-outcome-observation"]',
    );
    const learningCard = document.querySelector(
      '[data-testid="nexora-theatre-learning-reassessment"]',
    );
    const comparisonCard = document.querySelector('[data-testid="nexora-theatre-comparison"]');
    const view = document.querySelector('[data-testid="nexora-presentation-state-selector"]');
    const actions = document.querySelector('[data-testid="nexora-subject-operation"]');
    const actionsRadio = [...document.querySelectorAll('[role="radio"]')].find((el) =>
      /actions/i.test(el.textContent ?? el.getAttribute("aria-label") ?? ""),
    );
    const stageObject =
      document.querySelector('[data-testid="nexora-stage-object-control-ctx-decision-capacity"]') ??
      document.querySelector('[data-testid="nexora-stage-object-control-ctx-scenario-demand"]');
    const formerRegion = { left: window.innerWidth - 300, top: 72, width: 272, height: 420 };
    const objectRect = stageObject?.getBoundingClientRect() ?? null;
    const intersect =
      objectRect == null
        ? 0
        : Math.max(
            0,
            Math.min(objectRect.right, formerRegion.left + formerRegion.width) -
              Math.max(objectRect.left, formerRegion.left),
          ) *
          Math.max(
            0,
            Math.min(objectRect.bottom, formerRegion.top + formerRegion.height) -
              Math.max(objectRect.top, formerRegion.top),
          );
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      sceneIntent: mount?.getAttribute("data-theatre-scene-intent") ?? "missing",
      decisionState: mount?.getAttribute("data-theatre-decision-state") ?? "none",
      authoritativeId: mount?.getAttribute("data-theatre-decision-authoritative-id") ?? "none",
      readiness: mount?.getAttribute("data-theatre-execution-readiness") ?? "none",
      executionId: mount?.getAttribute("data-theatre-execution-id") ?? "none",
      decisionCommitted: shell?.getAttribute("data-nex-exp7-committed") ?? "none",
      executionStarted: shell?.getAttribute("data-nex-exp8-started") ?? "none",
      comparisonDom: Boolean(comparisonCard),
      reviewDom: Boolean(commitmentCard),
      readinessDom: Boolean(readinessCard),
      liveDom: Boolean(liveCard),
      outcomeDom: Boolean(outcomeCard),
      learningDom: Boolean(learningCard),
      viewDom: Boolean(view),
      actionsDom: Boolean(actions) || Boolean(actionsRadio),
      advisorGuidance: advisor?.getAttribute("data-theatre-advisor-guidance") ?? "none",
      advisorSource: advisor?.getAttribute("data-theatre-advisor-guidance-source") ?? "none",
      advisorSituation:
        document.querySelector('[data-testid="nexora-advisor-situation"]')?.textContent ??
        advisor?.textContent?.slice(0, 1200) ??
        "",
      rightTabs: [...document.querySelectorAll('[role="tab"]')].map(
        (el) => el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "",
      ),
      objectCardHost:
        document.querySelector("[data-object-card-host]")?.getAttribute("data-object-card-host") ??
        "none",
      stageObjectCard: Boolean(stageObjectCard),
      rightObjectCardHost: Boolean(objectCardRight),
      formerGuidanceOverlayMounted: Boolean(
        readinessCard || commitmentCard || liveCard || outcomeCard || learningCard,
      ),
      formerRegionObjectIntersectionArea: intersect,
      stageObjectBounds: objectRect
        ? {
            left: objectRect.left,
            top: objectRect.top,
            width: objectRect.width,
            height: objectRect.height,
          }
        : null,
    };
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => pageErrors.push(String(error)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });

await askExecutiveChat(page, "Review Expand Capacity");
const afterExpand = await snapshot(page);
await page.screenshot({ path: join(out, "live-expand-capacity-stage.png") });
const objectTab = page.locator('[data-testid="nexora-right-package-tab-ctx-decision-capacity"]');
if ((await objectTab.count()) > 0) {
  await objectTab.first().evaluate((el) => el.click());
  await page.waitForTimeout(400);
}
const afterObject = await snapshot(page);
await page.screenshot({ path: join(out, "live-selected-object.png") });
await page.locator('[data-testid="executive-advisor-tab-assist"]').first().evaluate((el) => el.click()).catch(() => null);

await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
await askExecutiveChat(page, "show scenarios");
await askExecutiveChat(page, "Compare them.");
const afterCompare = await snapshot(page);
await page.screenshot({ path: join(out, "live-comparison.png") });

const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
if ((await reviewBtn.count()) > 0) {
  await reviewBtn.first().evaluate((el) => el.click());
  await page.waitForTimeout(400);
}
const commit = await askExecutiveChat(page, "Approve Demand Surge");
const afterCommit = await snapshot(page);
await page.screenshot({ path: join(out, "live-committed-stage.png") });
await page.locator('[data-testid="executive-advisor-tab-assist"]').first().evaluate((el) => el.click()).catch(() => null);
const afterAdvisor = await snapshot(page);
await page.screenshot({ path: join(out, "live-advisor.png") });
const hasStarted = await askExecutiveChat(page, "Has execution started?");
const afterAsk = await snapshot(page);

const leak = /DTH:9|CC:11|advisorReadable|CC:10R/i.test(
  `${afterAdvisor.advisorSituation ?? ""} ${hasStarted.last ?? ""}`,
);
const g4 = afterCommit.readinessDom === false && afterExpand.readinessDom === false;
const g8 = afterCompare.comparisonDom === true;
const g9 =
  afterAdvisor.advisorGuidance === "execution-readiness" ||
  /committed|readiness|owner|timing|resources|dependenc/i.test(afterAdvisor.advisorSituation);
const g10 =
  afterCommit.decisionState === "COMMITTED" &&
  afterCommit.readiness === "COMMITTED_AWAITING_EXECUTION" &&
  afterCommit.executionId === "none";
const executionNotStarted = /not started|has not started|no\./i.test(hasStarted.last ?? "");
const g11 = afterExpand.viewDom && afterExpand.actionsDom;
const g12 = afterObject.stageObjectCard === false;
const g16 = afterCommit.formerGuidanceOverlayMounted === false && afterExpand.formerGuidanceOverlayMounted === false;

const report = {
  identity: "NPA-T STAGE-GUIDANCE:1/RelocateDthWorkflowGuidanceToExistingAdvisor",
  url,
  afterExpand,
  afterObject,
  afterCompare,
  afterCommit,
  afterAdvisor,
  afterAsk,
  commitReply: commit.last,
  hasStartedReply: hasStarted.last,
  leak,
  gates: { g4, g8, g9, g10, executionNotStarted, g11, g12, g16 },
  pageErrors,
  consoleErrors: consoleErrors.slice(0, 20),
};

await writeFile(join(out, "live-browser.json"), JSON.stringify(report, null, 2));
await browser.close();

const ok = g4 && g8 && g9 && g10 && executionNotStarted && g11 && g16 && !leak && pageErrors.length === 0;
console.log(ok ? "STAGE-GUIDANCE:1 live ok" : "STAGE-GUIDANCE:1 live FAIL");
console.log(
  JSON.stringify(
    {
      g4,
      g8,
      g9,
      g10,
      executionNotStarted,
      g11,
      g12,
      g16,
      leak,
      focusedExpand: afterExpand.focused,
      readiness: afterCommit.readiness,
      advisor: afterAdvisor.advisorGuidance,
      committed: afterCommit.decisionCommitted,
    },
    null,
    2,
  ),
);
process.exit(ok ? 0 : 1);
