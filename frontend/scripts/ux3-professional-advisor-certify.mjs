/**
 * UX:3 live /executive WebGL + Professional Advisor certification.
 * Uses the real client Stage; SSR output does not qualify.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux3-professional-advisor";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

async function waitForExperience() {
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]');
  await page.waitForSelector('[data-ux2="stage-interaction"]');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector(
    '[data-testid="nexora-3d-executive-stage"] canvas',
    { timeout: 30000 },
  );
  await page.waitForTimeout(900);
}

async function snapshot(name) {
  const path = join(outDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  const state = await page.evaluate(() => {
    const stage = document.querySelector(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    const advisor = document.querySelector(
      '[data-testid="nexora-advisor-insight-region"]',
    );
    const view = document.querySelector('[data-testid="nexora-advisor-view"]');
    const canvas = stage?.querySelector("canvas");
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const text = (selector) =>
      document
        .querySelector(selector)
        ?.textContent?.replace(/\s+/g, " ")
        .trim() ?? null;
    const primaryActions = [
      ...document.querySelectorAll(
        '[data-advisor-action-priority="primary"]',
      ),
    ].filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0;
    });
    const secondaryActions = [
      ...document.querySelectorAll(
        '[data-advisor-action-priority="secondary"]',
      ),
    ].filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0;
    });
    const advisorBounds = advisor?.getBoundingClientRect();
    const stageBounds = stage?.getBoundingClientRect();

    return {
      ux1:
        document.querySelector('[data-ux1="simplify-executive-page"]') != null,
      ux2: attr(stage, "data-ux2"),
      ux3: attr(advisor, "data-ux3"),
      canvas: {
        width: canvas?.width ?? 0,
        height: canvas?.height ?? 0,
        clientWidth: canvas?.clientWidth ?? 0,
        clientHeight: canvas?.clientHeight ?? 0,
      },
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        depth: attr(stage, "data-stage-depth"),
      },
      advisor: {
        bridgeSubject: attr(advisor, "data-advisor-subject"),
        currentSubject: attr(advisor, "data-advisor-current-subject"),
        attentionSubject: attr(advisor, "data-advisor-attention-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
        subjectLabel: text('[data-testid="nexora-advisor-view-subject"]'),
        subjectState: text('[data-testid="nexora-advisor-subject-state"]'),
        attentionLabel: text(
          '[data-testid="nexora-advisor-attention-subject"]',
        ),
        situation: text('[data-testid="nexora-advisor-situation"]'),
        why: text('[data-testid="nexora-advisor-why"]'),
        recommendation: text(
          '[data-testid="nexora-advisor-recommendation"]',
        ),
        empty: text('[data-testid="nexora-advisor-empty"]'),
        evidence: text('[data-testid="nexora-advisor-evidence"]'),
        primaryActionCount: primaryActions.length,
        primaryAction: primaryActions[0]?.textContent
          ?.replace(/\s+/g, " ")
          .trim() ?? null,
        secondaryActionCount: secondaryActions.length,
        recommendationAuthority: attr(
          view,
          "data-recommendation-authority",
        ),
        evidenceState: attr(view, "data-evidence-state"),
      },
      layout: {
        stageWidth: Math.round(stageBounds?.width ?? 0),
        advisorWidth: Math.round(advisorBounds?.width ?? 0),
        horizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 2,
      },
      askNexoraPresent:
        document.querySelector('[data-testid="nexora-conversational-input"]') !=
        null,
    };
  });
  return { path, state };
}

async function openObjectsList() {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  const open = await list.evaluate(
    (element) => element.hasAttribute("open") || element.open === true,
  );
  if (!open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
}

async function clickStageObject(id) {
  await openObjectsList();
  const control = page.locator(
    `[data-testid="nexora-stage-object-control-${id}"]`,
  );
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(700);
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  const open = await list.evaluate(
    (element) => element.hasAttribute("open") || element.open === true,
  );
  if (open) {
    await list.locator("summary").click();
    await page.waitForTimeout(200);
  }
  return true;
}

async function clickContext(id) {
  const control = page.locator(
    `[data-testid="nexora-stage-context-control-${id}"]`,
  );
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(700);
  return true;
}

async function clickQueueCategory(category) {
  const disclosure = page.locator(
    '[data-testid="nexora-executive-queue-disclosure"]',
  );
  if ((await disclosure.count()) > 0) {
    const open = await disclosure.evaluate(
      (element) => element.hasAttribute("open") || element.open === true,
    );
    if (!open) {
      await disclosure.locator("summary").click();
      await page.waitForTimeout(200);
    }
  }
  const row = page.locator(
    `[data-testid="nexora-executive-queue-row-${category}"]`,
  );
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
  limitedOrNoRecommendationCapture: null,
  notes: [
    "Certification uses the real client/WebGL Stage.",
    "Ask Nexora presence is checked; no conversational response is submitted.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();
report.captures.overview = await snapshot("01-executive-overview");
if (
  report.captures.overview.state.advisor.empty != null ||
  ["limited", "incomplete", "none"].includes(
    report.captures.overview.state.advisor.evidenceState,
  )
) {
  report.limitedOrNoRecommendationCapture = "09-limited-overview";
}

const businessSubjects = [
  ["obj-capacity", "02-capacity-object"],
  ["obj-customer", "03-customer-object"],
  ["obj-risk", "08-risk"],
];

for (const [id, name] of businessSubjects) {
  const clicked = await clickStageObject(id);
  if (!clicked) {
    report.unavailable.push(id);
    continue;
  }
  const capture = await snapshot(name);
  report.captures[name] = capture;
  if (
    report.limitedOrNoRecommendationCapture == null &&
    (capture.state.advisor.empty != null ||
      capture.state.advisor.evidenceState === "limited" ||
      capture.state.advisor.evidenceState === "incomplete" ||
      capture.state.advisor.evidenceState === "none")
  ) {
    report.limitedOrNoRecommendationCapture = name;
  }
}

await page.keyboard.press("Escape");
await page.waitForTimeout(700);
await clickStageObject("obj-capacity");

const workSubjects = [
  ["ctx-problem-capacity", "04-problem", "problem"],
  ["ctx-scenario-capacity", "05-scenario", "scenario"],
  ["ctx-decision-capacity", "06-decision", "decision"],
  ["ctx-execution-capacity", "07-execution", "execution"],
];

for (const [id, name, category] of workSubjects) {
  let clicked = await clickContext(id);
  if (!clicked) clicked = await clickStageObject(id);
  if (!clicked) {
    await clickQueueCategory(category);
    clicked = await clickStageObject(id);
  }
  if (!clicked) {
    report.unavailable.push(id);
    report.notes.push(`${id} was unavailable in the active runtime dataset.`);
    continue;
  }
  const capture = await snapshot(name);
  report.captures[name] = capture;
  if (
    report.limitedOrNoRecommendationCapture == null &&
    (capture.state.advisor.empty != null ||
      capture.state.advisor.evidenceState === "limited" ||
      capture.state.advisor.evidenceState === "incomplete" ||
      capture.state.advisor.evidenceState === "none")
  ) {
    report.limitedOrNoRecommendationCapture = name;
  }
}

await page.keyboard.press("Escape");
await page.waitForTimeout(700);
report.captures.limitedOverview = await snapshot("09-limited-overview");
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(900);
report.captures.narrow = await snapshot("10-narrow-desktop-1280x800");

if (report.limitedOrNoRecommendationCapture == null) {
  report.notes.push(
    "No natural limited/no-recommendation state appeared in the requested live subjects; none was fabricated for certification.",
  );
}

await writeFile(
  join(outDir, "report.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
