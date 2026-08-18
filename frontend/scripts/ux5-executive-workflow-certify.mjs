/**
 * UX:5 live hydrated /executive workflow certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux5-executive-workflow";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

const consoleEntries = [];
const runtimeExceptions = [];
page.on("console", (message) => {
  if (message.type() === "warning" || message.type() === "error") {
    consoleEntries.push({ type: message.type(), text: message.text() });
  }
});
page.on("pageerror", (error) => runtimeExceptions.push(String(error)));

async function waitForExperience() {
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector('[data-ux5="executive-workflow"]');
  await page.waitForSelector(
    '[data-testid="nexora-conversational-input-field"]',
  );
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
  await page.waitForTimeout(160);
  return page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText();
}

async function waitFocused(subjectId) {
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector('[data-testid="nexora-3d-executive-stage"]')
        ?.getAttribute("data-stage-focused-object-id") === expected,
    subjectId,
  );
}

async function snapshot(name) {
  const path = join(outDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  const state = await page.evaluate(() => {
    const q = (selector) => document.querySelector(selector);
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const text = (selector) =>
      q(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const stage = q('[data-testid="nexora-3d-executive-stage"]');
    const advisor = q('[data-testid="nexora-advisor-insight-region"]');
    const workflow = q('[data-testid="nexora-flow-chain"]');
    return {
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        depth: attr(stage, "data-stage-depth"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        trailEntryIds:
          attr(stage, "data-stage-navigation-entry-ids")
            ?.split("|")
            .filter(Boolean) ?? [],
        subjectIds:
          attr(stage, "data-stage-navigation-subject-ids")
            ?.split("|")
            .filter(Boolean) ?? [],
      },
      workflow: {
        phase: attr(workflow, "data-workflow-phase"),
        readiness: attr(workflow, "data-workflow-readiness"),
        currentSubject: attr(workflow, "data-workflow-current-subject"),
        nextSubject: attr(workflow, "data-workflow-next-subject"),
        outcome: attr(workflow, "data-workflow-outcome"),
        learning: attr(workflow, "data-workflow-learning"),
        phaseLabel: text('[data-testid="nexora-workflow-phase"]'),
        readinessLabel: text('[data-testid="nexora-workflow-readiness"]'),
      },
      advisor: {
        subject: attr(advisor, "data-advisor-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
        attention: text('[data-testid="nexora-advisor-attention-subject"]'),
        situation: text('[data-testid="nexora-advisor-observation"]'),
        why: text('[data-testid="nexora-advisor-why"]'),
        evidence: text('[data-testid="nexora-advisor-evidence"]'),
        recommendation: text(
          '[data-testid="nexora-advisor-recommendation"]',
        ),
        decisionRequired: text(
          '[data-testid="nexora-advisor-decision-required"]',
        ),
        assumptions: text('[data-testid="nexora-advisor-assumptions"]'),
        primaryActionCount: document.querySelectorAll(
          '[data-advisor-action-priority="primary"]',
        ).length,
        primaryAction: q('[data-advisor-action-priority="primary"]')
          ?.textContent?.replace(/\s+/g, " ")
          .trim() ?? null,
      },
      conversation: text('[data-testid="nexora-conversational-messages"]'),
      scenarioPanelVisible:
        q('[data-testid="nexora-flow-panel-scenario"]') != null,
      scenarioCollectionVisible:
        q('[data-testid="nexora-executive-queue-collection-header"]') != null,
      scenarioCollection: text(
        '[data-testid="nexora-executive-queue"]',
      ),
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 2,
    };
  });
  return { path, state };
}

const report = {
  ux: "UX:5 — Executive Workflow Integration",
  url,
  viewport: { width: 1502, height: 942 },
  hydratedClient: true,
  webgl: true,
  captures: {},
  checks: {},
  unavailableStages: {},
  conversationResults: {},
  console: {},
  authorityBoundary: {
    workflowEngineCreated: false,
    nextAction: "Professional Advisor / NBA",
    decision: "CC:10R Canonical Decision Runtime",
    execution:
      "NEX-MVP:8 flowDomain projection in live /executive; CC:11 canonical Execution Runtime is not wired",
    outcome: "EI:6 + RDI / Data Reality",
    learning: "EI:6 + APP-4",
  },
  notes: [
    "The existing NEX-MVP:8 flow projection is reused; UX:5 adds manager orientation only.",
    "Scenario projection remains explicitly distinct from observed reality.",
    "Outcome and Learning screenshots are omitted when no validated live evidence exists.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();

report.captures.overview = await snapshot("01-overview-attention");
const overview = report.captures.overview.state;
report.checks.attentionIsNotSubject =
  overview.stage.focused === "none" &&
  overview.workflow.phase === "attention" &&
  overview.advisor.attention != null;

const overviewPrimary = page.locator(
  '[data-advisor-action-priority="primary"]',
);
if ((await overviewPrimary.count()) > 0) {
  await overviewPrimary.click();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-testid="nexora-3d-executive-stage"]')
        ?.getAttribute("data-stage-focused-object-id") !== "none",
  );
} else {
  await ask("Focus on Capacity");
}
report.captures.investigate = await snapshot("02-investigate-subject");
report.checks.attentionEntry =
  report.captures.investigate.state.stage.focused !== "none" &&
  report.captures.investigate.state.stage.anchorPosition === "0,0,0" &&
  report.captures.investigate.state.advisor.subject ===
    report.captures.investigate.state.stage.focused;

await ask("Review Capacity Gap");
await waitFocused("ctx-problem-capacity");
const evidenceResponse = await ask("Show the evidence");
report.conversationResults.showEvidence = evidenceResponse;
report.captures.evidence = await snapshot("03-evidence");
report.captures.problem = await snapshot("04-problem-or-opportunity");
report.checks.investigateUnderstand =
  report.captures.problem.state.workflow.phase === "understand" &&
  report.captures.problem.state.advisor.situation != null &&
  report.captures.problem.state.advisor.why != null &&
  report.captures.problem.state.advisor.evidence != null &&
  report.captures.problem.state.advisor.recommendation != null &&
  report.captures.problem.state.advisor.primaryActionCount === 1;
report.checks.evidenceGrounded =
  !/invented|fabricated/i.test(evidenceResponse) &&
  report.captures.evidence.state.advisor.evidence != null;

const scenariosResponse = await ask("Show the scenarios");
report.conversationResults.showScenarios = scenariosResponse;
await ask("Review Capacity Expansion Plan");
await waitFocused("ctx-scenario-capacity");
report.captures.scenario = await snapshot("05-scenario");
report.checks.scenarioTruth =
  report.captures.scenario.state.workflow.phase === "scenario" &&
  report.captures.scenario.state.workflow.readiness ===
    "scenario-projection" &&
  report.captures.scenario.state.advisor.grammar === "scenario";

await ask("Review Margin Pressure");
await waitFocused("ctx-problem-margin");
const compareButton = page.getByRole("button", {
  name: /compare scenarios/i,
});
if ((await compareButton.count()) > 0) {
  await compareButton.first().click();
  await page.waitForTimeout(300);
  report.captures.scenarioComparison = await snapshot(
    "06-scenario-comparison",
  );
  report.checks.multipleScenarioComparison =
    report.captures.scenarioComparison.state.scenarioPanelVisible ||
    (report.captures.scenarioComparison.state.scenarioCollectionVisible &&
      /Scenarios\s*·\s*[2-9]/i.test(
        report.captures.scenarioComparison.state.scenarioCollection ?? "",
      ));
  await page.keyboard.press("Escape");
} else {
  report.unavailableStages.scenarioComparison =
    "Multiple scenarios exist for Margin Pressure, but no comparison action was presented.";
  report.checks.multipleScenarioComparison = false;
}

await ask("Review Capacity Expansion Plan");
await waitFocused("ctx-scenario-capacity");
const decisionResponse = await ask("Review the decision");
report.conversationResults.reviewDecision = decisionResponse;
await waitFocused("ctx-decision-capacity");
report.captures.decision = await snapshot("07-decision");
report.checks.decisionContext =
  report.captures.decision.state.workflow.phase === "decision" &&
  report.captures.decision.state.workflow.readiness === "decision-required" &&
  report.captures.decision.state.advisor.grammar === "decision";

const preferenceResponse = await ask("I prefer Expand Capacity");
report.conversationResults.preference = preferenceResponse;
const readinessAfterPreference = await page
  .locator('[data-testid="nexora-workflow-readiness"]')
  .innerText();
const confirmationResponse = await ask(
  "I think we should probably choose this",
);
report.conversationResults.confirmationPrompt = confirmationResponse;
report.captures.decisionConfirmation = await snapshot(
  "08-decision-confirmation",
);
const committedResponse = await ask("Yes");
report.conversationResults.commitment = committedResponse;
const readinessAfterCommitment = await page
  .locator('[data-testid="nexora-workflow-readiness"]')
  .innerText();
report.checks.preferenceNotCommitment =
  /no Decision committed/i.test(preferenceResponse) &&
  /Decision required/i.test(readinessAfterPreference);
report.checks.canonicalDecisionConfirmation =
  /Commit to Expand Capacity/i.test(confirmationResponse) &&
  /Approved decision/i.test(committedResponse) &&
  /execution available/i.test(readinessAfterCommitment);

const executionResponse = await ask("Review Capacity Expansion");
report.conversationResults.reviewExecution = executionResponse;
await waitFocused("ctx-execution-capacity");
report.captures.execution = await snapshot("09-execution");
report.captures.conversationWorkflow = await snapshot(
  "12-conversation-workflow",
);
report.checks.executionReview =
  report.captures.execution.state.workflow.phase === "execution" &&
  report.captures.execution.state.workflow.readiness === "execution-planned" &&
  report.captures.execution.state.stage.anchorPosition === "0,0,0" &&
  report.captures.execution.state.advisor.subject ===
    "ctx-execution-capacity";
report.checks.outcomeTruthfulUnavailable =
  report.captures.execution.state.workflow.outcome === "unavailable" &&
  /outcome not yet available/i.test(
    report.captures.execution.state.workflow.readinessLabel ?? "",
  );
report.checks.learningTruthfulUnavailable =
  report.captures.execution.state.workflow.learning === "unavailable";
report.unavailableStages.outcome =
  "No validated EI:6 expected-versus-actual evaluation is wired to the live Capacity execution.";
report.unavailableStages.learning =
  "Without a validated Outcome evaluation, no EI:6 Learning or APP-4 promotion is presented.";
report.unavailableStages.opportunity =
  "The active Nexora MVP catalog contains Problems but no canonical Opportunity subject; none was invented.";
report.unavailableStages.canonicalExecutionRuntime =
  "The live MVP shell reads and mutates NEX-MVP:8 flowDomain execution records; CC:11 is certified separately but is not wired into /executive. UX:5 performs review/navigation only and does not bridge this authority gap.";
report.unavailableStages.decisionOutcomeTrace =
  "STAGE-PROD:5 has a read-only Decision Memory/Outcome Trace path, but no live finalization capture writer populates it in /executive.";

await page.locator('[data-testid="nexora-stage-step-back"]').click();
await waitFocused("ctx-decision-capacity");
report.captures.back = await snapshot("13-back-navigation");
report.checks.backNavigation =
  report.captures.back.state.stage.focused === "ctx-decision-capacity";

await ask("Show overview");
report.captures.overviewReturn = await snapshot("14-overview-return");
report.checks.overviewReturn =
  report.captures.overviewReturn.state.stage.focused === "none" &&
  report.captures.overviewReturn.state.workflow.phase === "attention";

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(500);
report.captures.narrow = await snapshot("15-narrow-desktop");
report.checks.narrowDesktop =
  !report.captures.narrow.state.horizontalOverflow;

const duplicateKeyWarnings = consoleEntries.filter((entry) =>
  /encountered two children with the same key|unique "key" prop/i.test(
    entry.text,
  ),
);
report.console = {
  warningsAndErrors: consoleEntries,
  runtimeExceptions,
  duplicateKeyWarnings,
};
report.checks.noDuplicateKeyWarnings = duplicateKeyWarnings.length === 0;
report.checks.noRuntimeExceptions = runtimeExceptions.length === 0;
report.checks.navigationOccurrenceIdsUnique = Object.values(report.captures)
  .map((capture) => capture.state.stage.trailEntryIds)
  .every((ids) => new Set(ids).size === ids.length);
report.checks.visualCalm =
  !report.captures.narrow.state.horizontalOverflow &&
  report.captures.narrow.state.advisor.primaryActionCount <= 1;

const requiredChecks = [
  "attentionIsNotSubject",
  "attentionEntry",
  "investigateUnderstand",
  "evidenceGrounded",
  "scenarioTruth",
  "multipleScenarioComparison",
  "decisionContext",
  "preferenceNotCommitment",
  "canonicalDecisionConfirmation",
  "executionReview",
  "outcomeTruthfulUnavailable",
  "learningTruthfulUnavailable",
  "backNavigation",
  "overviewReturn",
  "narrowDesktop",
  "noDuplicateKeyWarnings",
  "noRuntimeExceptions",
  "navigationOccurrenceIdsUnique",
  "visualCalm",
];
report.passed = requiredChecks.every((name) => report.checks[name] === true);
report.requiredChecks = requiredChecks;

await writeFile(
  join(outDir, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();

console.log(
  JSON.stringify(
    {
      passed: report.passed,
      checks: report.checks,
      unavailableStages: report.unavailableStages,
      console: report.console,
      captures: Object.fromEntries(
        Object.entries(report.captures).map(([key, value]) => [key, value.path]),
      ),
    },
    null,
    2,
  ),
);
if (!report.passed) process.exitCode = 1;
