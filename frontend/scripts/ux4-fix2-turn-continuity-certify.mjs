/**
 * UX:4-FIX2 live /executive turn-continuity certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux4-fix2-turn-continuity";
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

let expectedNexoraMessages = 0;
async function ask(utterance) {
  const field = page.locator(
    '[data-testid="nexora-conversational-input-field"]',
  );
  await field.click();
  await field.pressSequentially(utterance);
  await field.press("Enter");
  expectedNexoraMessages += 1;
  await page.waitForFunction(
    (expected) =>
      document.querySelectorAll(
        '[data-testid="nexora-conversational-message-nexora"]',
      ).length >= expected,
    expectedNexoraMessages,
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
    const conversation = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const canvas = stage?.querySelector("canvas");
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const messages = [
      ...document.querySelectorAll(
        '[data-testid^="nexora-conversational-message-"]',
      ),
    ].map((element) => ({
      role: element
        .getAttribute("data-testid")
        ?.replace("nexora-conversational-message-", ""),
      status: attr(element, "data-message-status"),
      text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
    }));
    return {
      ux1:
        document.querySelector('[data-ux1="simplify-executive-page"]') != null,
      ux2: attr(stage, "data-ux2"),
      ux3: attr(advisor, "data-ux3"),
      canvas: { width: canvas?.width ?? 0, height: canvas?.height ?? 0 },
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        depth: attr(stage, "data-stage-depth"),
      },
      advisor: {
        subject: attr(advisor, "data-advisor-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
      },
      conversation: {
        status: attr(conversation, "data-experience-status"),
        intent: attr(conversation, "data-intent-kind"),
        command: attr(conversation, "data-command-kind"),
        primarySubject: attr(conversation, "data-primary-subject"),
        pendingTurnKind: attr(conversation, "data-pending-turn-kind"),
        pendingTurnResolution: attr(
          conversation,
          "data-pending-turn-resolution",
        ),
        messages,
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
    "Pending-turn state is structured CC session state and is not inferred from rendered text.",
    "No LLM/provider or durable memory path was added.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();

// Reproduce the reported state: Capacity is already centered before greeting.
await ask("Focus on Capacity");
const greeting = await ask("hi");
report.captures.greeting = await snapshot("01-hi-review-question");
report.checks.greetingOwnsReviewExpectation =
  /Would you like to review it/.test(greeting) &&
  report.captures.greeting.state.conversation.pendingTurnKind ===
    "review-subject";

const review = await ask("yes");
report.captures.review = await snapshot("02-yes-reviews-subject");
const reviewedSubject = report.captures.review.state.stage.focused;
report.checks.yesReviewsSubject =
  reviewedSubject != null &&
  reviewedSubject !== "none" &&
  report.captures.review.state.conversation.intent === "focus" &&
  report.captures.review.state.conversation.pendingTurnResolution ===
    "answered" &&
  report.captures.review.state.advisor.subject === reviewedSubject &&
  !/Which option do you want to commit|Decision commitment/i.test(review);

if (reviewedSubject !== "obj-capacity") {
  await ask("Focus on Capacity");
}
const bareCapacity = await ask("capacity");
report.captures.bareCapacity = await snapshot("03-bare-capacity-recognized");
report.checks.bareCapacityRecognized =
  /Capacity is already the current subject/i.test(bareCapacity) &&
  !/not sure how that relates/i.test(bareCapacity);

await ask("customer");
report.captures.customer = await snapshot("04-subject-switch-customer");
report.checks.customerSwitch =
  report.captures.customer.state.stage.focused === "obj-customer" &&
  report.captures.customer.state.stage.anchorPosition === "0,0,0" &&
  report.captures.customer.state.advisor.subject === "obj-customer";

const customerExplanation = await ask("explain it");
report.captures.customerExplanation = await snapshot(
  "05-explain-it-customer",
);
report.checks.pronounContinuity =
  /Customer/i.test(customerExplanation) &&
  report.captures.customerExplanation.state.conversation.primarySubject ===
    "obj-customer";

await ask("hi");
await ask("Show Capacity instead");
report.captures.interruption = await snapshot(
  "06-pending-interrupted-by-explicit-command",
);
report.checks.explicitInterruption =
  report.captures.interruption.state.stage.focused === "obj-capacity" &&
  report.captures.interruption.state.conversation.pendingTurnResolution ===
    "interrupted" &&
  report.captures.interruption.state.conversation.pendingTurnKind === "";

await ask("Focus on Expand Capacity");
const ordinaryYes = await ask("yes");
report.captures.decisionSafety = await snapshot(
  "07-decision-commitment-safety",
);
report.checks.decisionSafety =
  report.captures.decisionSafety.state.stage.focused ===
    "ctx-decision-capacity" &&
  report.captures.decisionSafety.state.advisor.grammar === "decision" &&
  report.captures.decisionSafety.state.conversation.intent === "unknown" &&
  !/Which option do you want to commit|committed|approved/i.test(ordinaryYes);

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(700);
report.captures.narrow = await snapshot("08-narrow-desktop");
report.checks.narrowNoHorizontalOverflow =
  !report.captures.narrow.state.horizontalOverflow;

report.checks.stageInvariants =
  Object.values(report.captures).every(
    (capture) =>
      capture.state.stage.cameraMode === "fixed-2d" &&
      capture.state.stage.depth === "0",
  );
report.checks.noCommitmentLeakage = Object.values(report.captures).every(
  (capture) =>
    !capture.state.conversation.messages.some((message) =>
      /Which option do you want to commit to/.test(message.text),
    ),
);
report.passed = Object.values(report.checks).every(Boolean);

await writeFile(
  join(outDir, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
