/**
 * UX:4-FIX4 live /executive navigation occurrence identity certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux4-fix4-navigation-trail-identity";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

const consoleEntries = [];
const runtimeExceptions = [];
page.on("console", (message) => {
  if (message.type() === "warning" || message.type() === "error") {
    consoleEntries.push({
      type: message.type(),
      text: message.text(),
    });
  }
});
page.on("pageerror", (error) => {
  runtimeExceptions.push(String(error));
});

async function waitForExperience() {
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux2="stage-interaction"]');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(700);
}

async function ask(utterance) {
  const field = page.locator(
    '[data-testid="nexora-conversational-input-field"]',
  );
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForSelector(
    '[data-testid="nexora-conversational-thinking"]',
  );
  await page.waitForSelector(
    '[data-testid="nexora-conversational-thinking"]',
    { state: "detached" },
  );
  await page.waitForTimeout(180);
  return page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText();
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
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const split = (value) => (value ? value.split("|").filter(Boolean) : []);
    const breadcrumbEntries = [
      ...document.querySelectorAll("[data-navigation-trail-entry-id]"),
    ].map((element) => ({
      trailEntryId: attr(element, "data-navigation-trail-entry-id"),
      subjectId: attr(element, "data-navigation-subject-id"),
      text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
    }));
    return {
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        depth: attr(stage, "data-stage-depth"),
        navigationDepth: Number(
          attr(stage, "data-stage-navigation-depth") ?? "0",
        ),
        currentIndex: Number(
          attr(stage, "data-stage-navigation-current-index") ?? "-1",
        ),
        currentEntryId: attr(
          stage,
          "data-stage-navigation-current-entry-id",
        ),
        subjectIds: split(
          attr(stage, "data-stage-navigation-subject-ids"),
        ),
        trailEntryIds: split(
          attr(stage, "data-stage-navigation-entry-ids"),
        ),
      },
      advisor: {
        subject: attr(advisor, "data-advisor-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
      },
      breadcrumbEntries,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 2,
    };
  });
  return { path, state };
}

function unique(values) {
  return new Set(values).size === values.length;
}

const report = {
  url,
  viewport: { width: 1502, height: 942 },
  captures: {},
  checks: {},
  console: {},
  notes: [
    "Certification uses the real hydrated client and WebGL Stage.",
    "Trail occurrence IDs are created by the canonical Stage-2D trail writer.",
    "Console output is captured without filtering or suppressing React errors.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();

await ask("Focus on Capacity");
report.captures.capacity = await snapshot("01-capacity");

await ask("Review Capacity Gap");
report.captures.capacityGap = await snapshot("02-capacity-gap-review");
report.checks.capacityGap =
  report.captures.capacityGap.state.stage.focused ===
    "ctx-problem-capacity" &&
  report.captures.capacityGap.state.stage.anchorPosition === "0,0,0" &&
  report.captures.capacityGap.state.advisor.subject ===
    "ctx-problem-capacity";

const beforeRepeat = report.captures.capacityGap.state.stage;
await ask("Review Capacity Gap");
await ask("Review Capacity Gap");
await ask("Review Capacity Gap");
report.captures.repeated = await snapshot("03-repeat-same-subject");
const afterRepeat = report.captures.repeated.state.stage;
report.checks.adjacentNoOp =
  afterRepeat.navigationDepth === beforeRepeat.navigationDepth &&
  JSON.stringify(afterRepeat.subjectIds) ===
    JSON.stringify(beforeRepeat.subjectIds) &&
  JSON.stringify(afterRepeat.trailEntryIds) ===
    JSON.stringify(beforeRepeat.trailEntryIds);

await ask("Review Capacity Expansion Plan");
report.captures.scenario = await snapshot("04-scenario");
await ask("Review Capacity Gap");
report.captures.legitimateRepeat = await snapshot(
  "05-legitimate-capacity-gap-repeat",
);
const repeatState = report.captures.legitimateRepeat.state.stage;
const gapIndexes = repeatState.subjectIds
  .map((subjectId, index) => ({ subjectId, index }))
  .filter((entry) => entry.subjectId === "ctx-problem-capacity");
report.checks.legitimateRepeat =
  gapIndexes.length === 2 &&
  repeatState.trailEntryIds[gapIndexes[0].index] !==
    repeatState.trailEntryIds[gapIndexes[1].index];

await page.locator('[data-testid="nexora-stage-step-back"]').click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="nexora-3d-executive-stage"]')
      ?.getAttribute("data-stage-focused-object-id") ===
    "ctx-scenario-capacity",
);
report.captures.back = await snapshot("06-back-restoration");
report.checks.backRestoration =
  report.captures.back.state.stage.focused === "ctx-scenario-capacity";

await ask("Show overview");
await ask("Focus on Capacity");
const buttonBefore = await snapshot("button-before");
await page.locator('[data-advisor-action-priority="primary"]').click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="nexora-3d-executive-stage"]')
      ?.getAttribute("data-stage-focused-object-id") ===
    "ctx-problem-capacity",
);
report.captures.button = await snapshot("07-advisor-button-navigation");
report.checks.buttonSingleTransition =
  report.captures.button.state.stage.navigationDepth ===
  buttonBefore.state.stage.navigationDepth + 1;

await ask("Show overview");
await ask("Focus on Capacity");
const conversationBefore = await snapshot("conversation-before");
await ask("Review Capacity Gap");
report.captures.conversation = await snapshot("08-conversation-navigation");
report.checks.conversationSingleTransition =
  report.captures.conversation.state.stage.navigationDepth ===
    conversationBefore.state.stage.navigationDepth + 1 &&
  report.captures.conversation.state.stage.focused ===
    "ctx-problem-capacity";
report.checks.buttonTextParity =
  report.captures.button.state.stage.focused ===
    report.captures.conversation.state.stage.focused &&
  report.captures.button.state.stage.anchorPosition ===
    report.captures.conversation.state.stage.anchorPosition;

// Reproduce the original depth/index collision shape:
// Capacity(0) → Gap(1) → Scenario(2) → Decision(3) → Execution(4) → Gap(5).
await ask("Show overview");
await ask("Focus on Capacity");
await ask("Review Capacity Gap");
await ask("Review Capacity Expansion Plan");
await ask("Review Expand Capacity");
await ask("Review Capacity Expansion");
await ask("Review Capacity Gap");
report.captures.originalCollisionPath = await snapshot(
  "original-collision-path",
);
report.checks.originalCollisionPath =
  report.captures.originalCollisionPath.state.stage.navigationDepth === 6 &&
  report.captures.originalCollisionPath.state.stage.currentIndex === 5 &&
  report.captures.originalCollisionPath.state.stage.focused ===
    "ctx-problem-capacity" &&
  unique(
    report.captures.originalCollisionPath.state.stage.trailEntryIds,
  );

await ask("Show overview");
await ask("Focus on Risk");
const marginResponse = await ask("Review Margin Pressure");
report.captures.marginPressure = await snapshot(
  "review-margin-pressure-regression",
);
report.checks.marginPressureRegression =
  report.captures.marginPressure.state.stage.focused ===
    "ctx-problem-margin" &&
  report.captures.marginPressure.state.advisor.subject ===
    "ctx-problem-margin" &&
  !/not sure how that relates/i.test(marginResponse);

await ask("Show overview");
const disclosure = page.locator(
  '[data-testid="nexora-executive-queue-disclosure"]',
);
if ((await disclosure.getAttribute("open")) == null) {
  await page.locator('[data-testid="nexora-executive-queue-title"]').click();
}
await page.locator('[data-testid="nexora-executive-queue-row-problem"]').click();
await page.waitForSelector(
  '[data-testid="nexora-executive-queue-collection-header"]',
);
await ask("Review Capacity Gap");
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="nexora-3d-executive-stage"]')
      ?.getAttribute("data-stage-focused-object-id") ===
    "ctx-problem-capacity",
);
report.captures.queue = await snapshot("09-queue-collection-navigation");
report.checks.queueOccurrences =
  report.captures.queue.state.stage.navigationDepth === 2 &&
  report.captures.queue.state.stage.subjectIds[0]?.includes("collection") &&
  report.captures.queue.state.stage.subjectIds[1] ===
    "ctx-problem-capacity" &&
  unique(report.captures.queue.state.stage.trailEntryIds);

report.captures.final = await snapshot("10-final-console-clean");

const duplicateKeyWarnings = consoleEntries.filter((entry) =>
  /Encountered two children with the same key|unique "key"/i.test(entry.text),
);
report.console = {
  entries: consoleEntries,
  runtimeExceptions,
  duplicateKeyWarnings,
};
report.checks.uniqueTrailIdentities = Object.values(report.captures).every(
  (capture) => unique(capture.state.stage.trailEntryIds),
);
report.checks.uniqueBreadcrumbIdentities = Object.values(
  report.captures,
).every((capture) =>
  unique(
    capture.state.breadcrumbEntries.map((entry) => entry.trailEntryId),
  ),
);
report.checks.consoleClean =
  duplicateKeyWarnings.length === 0 && runtimeExceptions.length === 0;
report.checks.stageInvariants = Object.values(report.captures).every(
  (capture) =>
    capture.state.stage.cameraMode === "fixed-2d" &&
    capture.state.stage.depth === "0",
);
report.passed = Object.values(report.checks).every(Boolean);

await writeFile(
  join(outDir, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
