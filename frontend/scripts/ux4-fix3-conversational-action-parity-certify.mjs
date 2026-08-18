/**
 * UX:4-FIX3 live /executive conversational action parity certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux4-fix3-conversational-action-parity";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

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
  await page.waitForTimeout(220);
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
    const conversation = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const text = (selector) =>
      document
        .querySelector(selector)
        ?.textContent?.replace(/\s+/g, " ")
        .trim() ?? null;
    return {
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        depth: attr(stage, "data-stage-depth"),
        breadcrumb: text('[data-testid="nexora-stage-interaction-breadcrumb"]'),
      },
      advisor: {
        subject: attr(advisor, "data-advisor-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
        recommendation: text('[data-testid="nexora-advisor-recommendation"]'),
        primaryAction: text('[data-advisor-action-priority="primary"]'),
      },
      conversation: {
        status: attr(conversation, "data-experience-status"),
        intent: attr(conversation, "data-intent-kind"),
        command: attr(conversation, "data-command-kind"),
        runtime: attr(conversation, "data-runtime-status"),
        primarySubject: attr(conversation, "data-primary-subject"),
        pendingResolution: attr(
          conversation,
          "data-pending-turn-resolution",
        ),
        lastResponse:
          [
            ...document.querySelectorAll(
              '[data-testid="nexora-conversational-message-nexora"]',
            ),
          ]
            .at(-1)
            ?.textContent?.replace(/\s+/g, " ")
            .trim() ?? null,
      },
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 2,
    };
  });
  return { path, state };
}

const report = {
  url,
  viewport: { width: 1502, height: 942 },
  captures: {},
  checks: {},
  notes: [
    "Certification uses the real hydrated client and WebGL Stage.",
    "Advisor button and conversation reuse the same NBA target and canonical subject-selection runtime.",
    "Only non-consequential navigation/review actions receive direct parity.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();

await ask("Focus on Risk");
report.captures.riskRecommendation = await snapshot("01-risk-recommendation");
report.checks.riskRecommendation =
  /Review Margin Pressure/i.test(
    report.captures.riskRecommendation.state.advisor.primaryAction ?? "",
  );

const textResponse = await ask("Review Margin Pressure");
report.captures.textReview = await snapshot("02-text-review-margin-pressure");
report.captures.marginCentered = await snapshot("03-margin-pressure-centered");
const textState = report.captures.textReview.state;
report.checks.textReview =
  textState.stage.focused === "ctx-problem-margin" &&
  textState.stage.anchor === "ctx-problem-margin" &&
  textState.stage.anchorPosition === "0,0,0" &&
  textState.advisor.subject === "ctx-problem-margin" &&
  textState.conversation.primarySubject === "ctx-problem-margin" &&
  !/not sure how that relates/i.test(textResponse);

await ask("Focus on Risk");
await page.locator('[data-advisor-action-priority="primary"]').click();
await page.waitForFunction(
  () =>
    document
      .querySelector('[data-testid="nexora-3d-executive-stage"]')
      ?.getAttribute("data-stage-focused-object-id") === "ctx-problem-margin",
);
report.captures.buttonReview = await snapshot("04-button-review-margin-pressure");
const buttonState = report.captures.buttonReview.state;

await ask("Focus on Risk");
await ask("Review Margin Pressure");
report.captures.parity = await snapshot("05-button-text-parity");
const parityState = report.captures.parity.state;
report.checks.buttonTextParity =
  buttonState.stage.focused === parityState.stage.focused &&
  buttonState.stage.anchor === parityState.stage.anchor &&
  buttonState.stage.anchorPosition === parityState.stage.anchorPosition &&
  buttonState.advisor.subject === parityState.advisor.subject &&
  buttonState.stage.breadcrumb === parityState.stage.breadcrumb;

await ask("Focus on Capacity");
await ask("Review Capacity Gap");
report.captures.capacityGap = await snapshot("06-review-capacity-gap");
report.checks.capacityGap =
  report.captures.capacityGap.state.stage.focused === "ctx-problem-capacity" &&
  report.captures.capacityGap.state.advisor.subject === "ctx-problem-capacity";

await ask("Focus on Risk");
const pronounResponse = await ask("review it");
report.captures.pronoun = await snapshot("07-review-it");
report.checks.pronoun =
  report.captures.pronoun.state.stage.focused === "ctx-problem-margin" &&
  !/Which item|not sure how that relates/i.test(pronounResponse);

await ask("Focus on Capacity");
const beforeExplain = await snapshot("08-explain-vs-review");
await ask("Explain Margin Pressure");
const afterExplain = await snapshot("08-explain-vs-review");
report.captures.explain = afterExplain;
report.checks.explainIsInformational =
  beforeExplain.state.stage.focused === "obj-capacity" &&
  afterExplain.state.stage.focused === "obj-capacity" &&
  afterExplain.state.conversation.intent === "explain" &&
  afterExplain.state.conversation.primarySubject === "ctx-problem-margin";

const decisionResponse = await ask("Review Expand Capacity");
report.captures.decision = await snapshot("09-decision-review-safety");
report.checks.decisionReviewSafety =
  report.captures.decision.state.stage.focused === "ctx-decision-capacity" &&
  report.captures.decision.state.advisor.grammar === "decision" &&
  !/committed|approved|which option do you want to commit/i.test(
    decisionResponse,
  );

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(700);
report.captures.narrow = await snapshot("10-narrow-desktop");
report.checks.narrowNoHorizontalOverflow =
  !report.captures.narrow.state.horizontalOverflow;

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
