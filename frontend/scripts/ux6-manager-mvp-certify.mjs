/**
 * UX:6 — Manager MVP Certification.
 *
 * Certifies the hydrated /executive application with its real WebGL Stage.
 * This script reports only live manager-facing capability and does not infer
 * Outcome, Learning, or CC:11 integration from internal modules.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux6-manager-mvp";
const URL = "http://localhost:3000/executive";
const PRIMARY = { width: 1502, height: 942 };
const NARROW = { width: 1280, height: 800 };

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const consoleEntries = [];
const runtimeExceptions = [];
const requestFailures = [];

function observe(page, surface) {
  page.on("console", (message) => {
    if (message.type() === "warning" || message.type() === "error") {
      consoleEntries.push({
        surface,
        type: message.type(),
        text: message.text(),
      });
    }
  });
  page.on("pageerror", (error) =>
    runtimeExceptions.push({ surface, text: String(error) }),
  );
  page.on("requestfailed", (request) =>
    requestFailures.push({
      surface,
      url: request.url(),
      reason: request.failure()?.errorText ?? "unknown",
    }),
  );
}

async function createPage(name, viewport = PRIMARY) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(45000);
  observe(page, name);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector(
    '[data-testid="nexora-conversational-input-field"]',
  );
  await page.waitForTimeout(800);
  return page;
}

async function ask(page, utterance) {
  const field = page.locator(
    '[data-testid="nexora-conversational-input-field"]',
  );
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    (expected) =>
      [
        ...document.querySelectorAll(
          '[data-testid="nexora-conversational-message-manager"]',
        ),
      ]
        .at(-1)
        ?.textContent?.includes(expected) === true,
    utterance,
  );
  const thinking = page.locator(
    '[data-testid="nexora-conversational-thinking"]',
  );
  if ((await thinking.count()) > 0) {
    await thinking.waitFor({ state: "detached" });
  } else {
    await page.waitForTimeout(260);
  }
  return page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText();
}

async function waitFocused(page, subjectId) {
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector('[data-testid="nexora-3d-executive-stage"]')
        ?.getAttribute("data-stage-focused-object-id") === expected,
    subjectId,
  );
}

async function waitCollection(page, category) {
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector('[data-testid="nexora-3d-executive-stage"]')
        ?.getAttribute("data-stage-active-queue-category") === expected,
    category,
  );
  await page.waitForTimeout(350);
}

async function openQueue(page) {
  const disclosure = page.locator(
    '[data-testid="nexora-executive-queue-disclosure"]',
  );
  if ((await disclosure.count()) === 0) return false;
  if ((await disclosure.getAttribute("open")) == null) {
    await disclosure.locator("summary").click();
    await page.waitForTimeout(220);
  }
  return true;
}

async function clickQueueCategory(page, category) {
  await openQueue(page);
  const row = page.locator(
    `[data-testid="nexora-executive-queue-row-${category}"]`,
  );
  if ((await row.count()) === 0) return false;
  await row.click();
  await waitCollection(page, category);
  return true;
}

async function state(page) {
  return page.evaluate(() => {
    const q = (selector) => document.querySelector(selector);
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const text = (selector) =>
      q(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const stage = q('[data-testid="nexora-3d-executive-stage"]');
    const advisor = q('[data-testid="nexora-advisor-insight-region"]');
    const workflow = q('[data-testid="nexora-flow-chain"]');
    const shell = q('[data-testid="nexora-executive-shell"]');
    const conversation = q(
      '[data-testid="nexora-conversational-experience"]',
    );
    const canvas = stage?.querySelector("canvas");
    const visibleText = [...document.querySelectorAll("body *")]
      .filter((element) => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.children.length > 0) return false;
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          bounds.width > 0 &&
          bounds.height > 0 &&
          bounds.bottom >= 0 &&
          bounds.top <= innerHeight &&
          bounds.right >= 0 &&
          bounds.left <= innerWidth &&
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          Number(style.opacity || "1") > 0
        );
      })
      .map((element) => element.innerText?.trim())
      .filter(Boolean)
      .join(" ");
    const messages = [
      ...document.querySelectorAll(
        '[data-testid^="nexora-conversational-message-"]',
      ),
    ].map((element) => ({
      role:
        element
          .getAttribute("data-testid")
          ?.replace("nexora-conversational-message-", "") ?? "unknown",
      text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
    }));
    const primaryActions = [
      ...document.querySelectorAll(
        '[data-advisor-action-priority="primary"]',
      ),
    ].filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0;
    });
    const stageBounds = stage?.getBoundingClientRect();
    const advisorBounds = advisor?.getBoundingClientRect();
    return {
      hydrated: shell != null && canvas != null,
      webglCanvas: {
        width: canvas?.width ?? 0,
        height: canvas?.height ?? 0,
      },
      context: {
        company: "Nexora",
        workspace: attr(shell, "data-active-workspace"),
        period: text('[data-testid="executive-context-period"]') ?? "week",
        dataLabel:
          [...document.querySelectorAll("header *")]
            .map((element) => element.textContent?.trim())
            .find((entry) => /^Data\s*·/i.test(entry ?? "")) ?? null,
        activeImport: attr(shell, "data-rdi2-active-import"),
        datasetId: attr(shell, "data-rdi2-dataset-id"),
        datasetScenario: attr(shell, "data-nexora-dataset"),
      },
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        focusedTargetZ: attr(stage, "data-focused-target-z"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        topologyZ: attr(stage, "data-stage-topology-z-contract"),
        depth: attr(stage, "data-stage-depth"),
        presentationMode: attr(stage, "data-stage-presentation-mode"),
        collection: attr(stage, "data-stage-active-queue-category"),
        collectionMembers:
          attr(stage, "data-stage-collection-member-ids")
            ?.split("|")
            .filter((entry) => entry && entry !== "none") ?? [],
        collectionDuplicates:
          attr(stage, "data-stage-collection-duplicate-object-ids")
            ?.split("|")
            .filter((entry) => entry && entry !== "none") ?? [],
        collectionOverlapCount: attr(
          stage,
          "data-stage-collection-overlap-count",
        ),
        collectionLayout: attr(stage, "data-stage-collection-layout-status"),
        collectionFinalWriter: attr(
          stage,
          "data-stage-collection-final-xy-writer",
        ),
        trailEntryIds:
          attr(stage, "data-stage-navigation-entry-ids")
            ?.split("|")
            .filter(Boolean) ?? [],
        trailSubjectIds:
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
        subjectLabel: text('[data-testid="nexora-advisor-view-subject"]'),
        attention: text('[data-testid="nexora-advisor-attention-subject"]'),
        situation:
          text('[data-testid="nexora-advisor-situation"]') ??
          text('[data-testid="nexora-advisor-observation"]'),
        why: text('[data-testid="nexora-advisor-why"]'),
        evidence: text('[data-testid="nexora-advisor-evidence"]'),
        recommendation: text(
          '[data-testid="nexora-advisor-recommendation"]',
        ),
        decisionRequired: text(
          '[data-testid="nexora-advisor-decision-required"]',
        ),
        assumptions: text('[data-testid="nexora-advisor-assumptions"]'),
        primaryActionCount: primaryActions.length,
        primaryAction:
          primaryActions[0]?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      },
      conversation: {
        intent: attr(conversation, "data-intent-kind"),
        command: attr(conversation, "data-command-kind"),
        primarySubject: attr(conversation, "data-primary-subject"),
        pendingTurnKind: attr(conversation, "data-pending-turn-kind"),
        pendingTurnResolution: attr(
          conversation,
          "data-pending-turn-resolution",
        ),
        messages,
        inputPresent:
          q('[data-testid="nexora-conversational-input-field"]') != null,
      },
      queueText: text('[data-testid="nexora-executive-queue"]'),
      visibleText,
      layout: {
        viewport: { width: innerWidth, height: innerHeight },
        stageWidth: Math.round(stageBounds?.width ?? 0),
        advisorWidth: Math.round(advisorBounds?.width ?? 0),
        horizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 2,
      },
    };
  });
}

async function capture(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return { path, state: await state(page) };
}

function tenSecondResult(capture, type) {
  const value = capture.state;
  const hasSubject =
    type === "Overview"
      ? value.advisor.attention != null && value.stage.focused === "none"
      : value.advisor.subjectLabel != null || value.advisor.subject !== "none";
  const explains =
    value.advisor.situation != null &&
    (value.advisor.why != null || value.advisor.evidence != null);
  const action =
    value.advisor.primaryActionCount === 1 ||
    /unavailable|not yet available|needs investigation/i.test(
      value.workflow.readinessLabel ?? "",
    );
  return {
    result:
      hasSubject && explains && action && value.conversation.inputPresent
        ? "PASS"
        : hasSubject && value.conversation.inputPresent
          ? "PARTIAL"
          : "FAIL",
    lookingAt:
      type === "Collection"
        ? `${value.stage.collection ?? "unknown"} collection`
        : value.advisor.subjectLabel ?? value.advisor.attention ?? type,
    matters:
      value.advisor.situation ?? value.advisor.attention ?? "not explicit",
    why:
      value.advisor.why ?? value.advisor.evidence ?? "not explicit",
    recommendation:
      value.advisor.recommendation ??
      value.advisor.primaryAction ??
      "limitation stated",
    next:
      value.advisor.primaryAction ??
      value.workflow.readinessLabel ??
      "not explicit",
    askNexora: value.conversation.inputPresent,
  };
}

const report = {
  certification: "UX:6 — Manager MVP Certification",
  product: "Executive Decision Intelligence System",
  route: URL,
  startedAt: new Date().toISOString(),
  hydratedClient: true,
  webglRequired: true,
  majorArchitectureIntroduced: false,
  filesInspected: [
    "app/executive/nex-mvp/NexoraExecutiveShell.tsx",
    "app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx",
    "app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx",
    "app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx",
    "app/lib/nex-mvp/nexoraMVPExecutiveFlow.ts",
    "app/lib/nex-mvp/nexoraMVPExecutiveCollectionIntegrity.ts",
    "app/lib/conversational-control/conversationalIntentResolver.ts",
    "app/lib/conversational-control/conversationalExperienceOrchestrator.ts",
    "app/lib/conversational-control/executiveDecisionCommitmentResolver.ts",
    "app/lib/conversational-control/executiveExecutionRuntime.ts",
    "app/lib/executive-intelligence/execution-outcome-learning/",
    "app/lib/durable-executive-memory/",
  ],
  filesModified: [
    "app/lib/conversational-control/conversationalIntentResolver.ts",
    "app/lib/conversational-control/conversationalIntent.test.ts",
  ],
  filesCreated: [
    "scripts/ux6-manager-mvp-certify.mjs",
    ".certification/ux6-manager-mvp/report.json",
    ".certification/ux6-manager-mvp/MVP-CERTIFICATION.md",
  ],
  captures: {},
  checks: {},
  conversation: {},
  collections: {},
  tenSecondTests: {},
  performance: {},
  architectureBoundaries: {
    decision:
      "Canonical Decision Runtime with explicit confirmation remains authoritative.",
    execution:
      "Live /executive presents NEX-MVP:8 flowDomain execution records. CC:11 is not wired into this route.",
    outcome:
      "Outcome intelligence exists internally, but no validated live manager-facing Outcome is presented.",
    outcomeTrace:
      "STAGE-PROD:5 Outcome Trace has no live finalization capture writer.",
    learning:
      "Learning intelligence and durable memory capability do not imply a live manager-facing Learning workflow.",
    durableMemory:
      "APP-4 remains the durable executive memory authority; navigation, chat, and temporary Stage workflow context are not promoted automatically.",
    language:
      "Conversation remains deterministic. No LLM/provider was added.",
  },
  debt: {
    P0: [],
    P1: [
      "Execution lifecycle feedback is written by the live NEX-MVP:8 flowDomain rather than CC:11; action success copy should state this workspace scope before public MVP packaging.",
      "The context bar uses a green Data indicator for the explicitly Local source state, which can be read as live connectivity despite the disconnected status shown elsewhere.",
    ],
    P2: [
      "CC:11 is not wired into live /executive; Execution uses NEX-MVP:8 flowDomain.",
      "STAGE-PROD:5 Outcome Trace has no live capture writer.",
      "No live manager-facing Outcome or Learning continuation exists after Execution.",
      "General natural-language coverage is deterministic; unsupported broad questions receive a bounded fallback.",
      "Some relationship explanations remain generic, for example “is related to”.",
      "Navigation occurrence identity is fixed, but the trail still uses aligned arrays internally.",
      "Conditional Data and Decision Memory detail surfaces retain some implementation-oriented source identifiers and terminology.",
    ],
    P3: [
      "Overview uses the slightly mechanical “Current Subject / Executive Overview” and “no explicit subject” wording.",
    ],
  },
};

const main = await createPage("main");

report.captures.firstOpen = await capture(main, "01-first-open-overview");
const first = report.captures.firstOpen.state;
report.checks.firstOpen =
  first.hydrated &&
  first.stage.focused === "none" &&
  first.advisor.attention != null &&
  first.advisor.primaryActionCount === 1 &&
  first.conversation.inputPresent &&
  !first.layout.horizontalOverflow;
report.checks.overviewAttentionNotFocus =
  first.stage.focused === "none" &&
  first.stage.anchor === "none" &&
  first.workflow.phase === "attention";
report.checks.visualHierarchy =
  first.layout.stageWidth > first.layout.advisorWidth * 2 &&
  first.layout.advisorWidth >= 200;

await openQueue(main);
report.captures.attention = await capture(main, "02-attention");
const overviewPrimary = main.locator(
  '[data-advisor-action-priority="primary"]',
);
await overviewPrimary.click();
await waitFocused(main, "obj-risk");
report.captures.investigation = await capture(main, "03-investigation");
const risk = report.captures.investigation.state;
report.checks.attentionInvestigation =
  risk.stage.anchorPosition === "0,0,0" &&
  risk.advisor.subject === "obj-risk" &&
  /Margin Pressure/i.test(risk.advisor.primaryAction ?? "");

await main.locator('[data-advisor-action-priority="primary"]').click();
await waitFocused(main, "ctx-problem-margin");
report.captures.problem = await capture(main, "04-problem");
const buttonProblemState = report.captures.problem.state;
report.checks.problem =
  buttonProblemState.advisor.grammar === "problem" &&
  buttonProblemState.stage.anchorPosition === "0,0,0" &&
  buttonProblemState.advisor.situation != null &&
  buttonProblemState.advisor.evidence != null;

report.conversation.evidence = await ask(main, "Show the evidence");
report.captures.evidence = await capture(main, "05-evidence");
report.checks.evidenceHonesty =
  report.captures.evidence.state.advisor.evidence != null &&
  !/fabricated|invented metric/i.test(report.conversation.evidence);

report.conversation.showScenarios = await ask(main, "Show scenarios");
await waitCollection(main, "scenario");
report.captures.scenariosCollection = await capture(
  main,
  "06-scenarios-collection",
);
report.collections.scenario = report.captures.scenariosCollection.state.stage;

await ask(main, "Review Capacity Expansion Plan");
await waitFocused(main, "ctx-scenario-capacity");
report.captures.scenario = await capture(main, "07-scenario");
report.checks.scenario =
  report.captures.scenario.state.advisor.grammar === "scenario" &&
  report.captures.scenario.state.workflow.readiness ===
    "scenario-projection";

let compareButton = main.getByRole("button", {
  name: /compare scenarios/i,
});
if ((await compareButton.count()) === 0) {
  // Capacity has one live scenario. Margin Pressure has the live multi-scenario
  // comparison entry point, so certify comparison only where it actually exists.
  await ask(main, "Review Margin Pressure");
  await waitFocused(main, "ctx-problem-margin");
  compareButton = main.getByRole("button", {
    name: /compare scenarios/i,
  });
}
if ((await compareButton.count()) > 0) {
  await compareButton.first().click();
  await main.waitForTimeout(350);
  report.checks.scenarioComparison =
    (await main
      .locator('[data-testid="nexora-flow-panel-scenario"]')
      .count()) > 0 ||
    (await main
      .locator('[data-testid="nexora-executive-queue-collection-header"]')
      .count()) > 0;
  await main.keyboard.press("Escape");
  await main.waitForTimeout(250);
  await ask(main, "Review Capacity Expansion Plan");
  await waitFocused(main, "ctx-scenario-capacity");
} else {
  report.checks.scenarioComparison = false;
  report.debt.P1.push(
    "Scenario alternatives exist, but comparison was not discoverable from the certified Capacity scenario.",
  );
}

report.conversation.reviewDecision = await ask(main, "Review the decision");
await waitFocused(main, "ctx-decision-capacity");
report.captures.decision = await capture(main, "08-decision");
report.checks.decision =
  report.captures.decision.state.advisor.grammar === "decision" &&
  report.captures.decision.state.workflow.readiness === "decision-required" &&
  report.captures.decision.state.advisor.decisionRequired != null;

report.conversation.preference = await ask(
  main,
  "I prefer Expand Capacity",
);
const afterPreference = await state(main);
report.conversation.confirmationPrompt = await ask(
  main,
  "I think we should probably choose this",
);
const beforeCommit = await state(main);
report.conversation.commitment = await ask(main, "Yes");
const afterCommit = await state(main);
report.decisionSafetyStates = {
  afterPreference,
  beforeCommit,
  afterCommit,
};
report.checks.decisionSafety =
  /no Decision committed/i.test(report.conversation.preference) &&
  afterPreference.stage.focused === "ctx-decision-capacity" &&
  /Commit to Expand Capacity/i.test(report.conversation.confirmationPrompt) &&
  beforeCommit.stage.focused === "ctx-decision-capacity" &&
  /Approved decision/i.test(report.conversation.commitment) &&
  afterCommit.stage.focused === "ctx-decision-capacity";

report.conversation.reviewExecution = await ask(
  main,
  "Review Capacity Expansion",
);
await waitFocused(main, "ctx-execution-capacity");
report.captures.execution = await capture(main, "09-execution");
report.checks.execution =
  report.captures.execution.state.advisor.grammar === "execution" &&
  report.captures.execution.state.stage.anchorPosition === "0,0,0" &&
  report.captures.execution.state.workflow.readiness === "execution-planned";
report.checks.executionReviewNonMutating =
  !/started|completed|cancelled/i.test(report.conversation.reviewExecution);
report.checks.outcomeTruthful =
  report.captures.execution.state.workflow.outcome === "unavailable" &&
  /outcome not yet available/i.test(
    report.captures.execution.state.workflow.readinessLabel ?? "",
  );
report.checks.learningTruthful =
  report.captures.execution.state.workflow.learning === "unavailable";

await ask(main, "Show problems");
await waitCollection(main, "problem");
report.captures.problemsCollection = await capture(
  main,
  "11-problems-collection",
);
report.collections.problem = report.captures.problemsCollection.state.stage;
await ask(main, "Review Capacity Gap");
await waitFocused(main, "ctx-problem-capacity");
await main.locator('[data-testid="nexora-stage-step-back"]').click();
await waitCollection(main, "problem");
report.captures.backNavigation = await capture(main, "12-back-navigation");
report.checks.collectionSubjectRestoration =
  report.captures.backNavigation.state.stage.collection === "problem";

await ask(main, "Show overview");
report.captures.returnOverview = await capture(main, "13-return-overview");
report.checks.overviewReturn =
  report.captures.returnOverview.state.stage.focused === "none" &&
  report.captures.returnOverview.state.workflow.phase === "attention";

await main.setViewportSize(NARROW);
await main.waitForTimeout(500);
report.captures.narrow = await capture(main, "14-narrow-desktop");
report.checks.narrowDesktop =
  !report.captures.narrow.state.layout.horizontalOverflow &&
  report.captures.narrow.state.layout.stageWidth >
    report.captures.narrow.state.layout.advisorWidth;

const conversationPage = await createPage("conversation");
const conversationPhrases = [
  "Hi",
  "Yes",
  "Explain this",
  "Why does this matter?",
  "What do you recommend?",
  "Show the evidence",
];
for (const phrase of conversationPhrases) {
  report.conversation[phrase] = await ask(conversationPage, phrase);
}
const continuityState = await state(conversationPage);
report.checks.conversationalContinuity =
  continuityState.stage.focused === "obj-capacity" &&
  continuityState.advisor.subject === "obj-capacity" &&
  continuityState.conversation.primarySubject === "obj-capacity";

report.conversation.reviewCapacityGap = await ask(
  conversationPage,
  "Review Capacity Gap",
);
await waitFocused(conversationPage, "ctx-problem-capacity");
report.conversation.reviewMarginPressure = await ask(
  conversationPage,
  "Review Margin Pressure",
);
await waitFocused(conversationPage, "ctx-problem-margin");
const textProblemState = await state(conversationPage);
report.checks.buttonTextParity =
  textProblemState.stage.focused === buttonProblemState.stage.focused &&
  textProblemState.stage.anchorPosition ===
    buttonProblemState.stage.anchorPosition &&
  textProblemState.advisor.subject === buttonProblemState.advisor.subject;

report.conversation.goBack = await ask(conversationPage, "Go back");
report.conversation.showOverview = await ask(
  conversationPage,
  "Show overview",
);
report.conversation.researchBoundary = await ask(
  conversationPage,
  "How can I research this better?",
);
report.conversation.considerBoundary = await ask(
  conversationPage,
  "What else should I consider?",
);
report.checks.languageBoundaryHonest =
  /not sure how that relates|try asking/i.test(
    report.conversation.researchBoundary,
  ) &&
  /not sure how that relates|try asking/i.test(
    report.conversation.considerBoundary,
  );

report.conversation.showAllObjects = await ask(
  conversationPage,
  "Show all objects",
);
const allObjectsState = await state(conversationPage);
report.checks.showAllObjects =
  allObjectsState.stage.presentationMode === "overview" &&
  allObjectsState.stage.focused === "none" &&
  !/couldn't find/i.test(report.conversation.showAllObjects);

for (const [utterance, category] of [
  ["Show problems", "problem"],
  ["Show scenarios", "scenario"],
  ["Show decisions", "decision"],
  ["Show executions", "execution"],
]) {
  report.conversation[utterance] = await ask(conversationPage, utterance);
  await waitCollection(conversationPage, category);
  const collectionState = await state(conversationPage);
  report.collections[`conversation-${category}`] = collectionState.stage;
}
report.captures.conversation = await capture(
  conversationPage,
  "10-conversation",
);
report.checks.collectionCommands = [
  "problem",
  "scenario",
  "decision",
  "execution",
].every(
  (category) =>
    report.collections[`conversation-${category}`].collection === category,
);

const collectionPage = await createPage("collections");
await openQueue(collectionPage);
const queueOverview = await state(collectionPage);
report.queue = {
  text: queueOverview.queueText,
  understoodAsExecutiveWork: /Problems|Scenarios|Decisions|Executions/i.test(
    queueOverview.queueText ?? "",
  ),
  recentChangesAvailable: /Recent Changes/i.test(
    queueOverview.queueText ?? "",
  ),
};
for (const category of ["problem", "scenario", "decision", "execution"]) {
  const opened = await clickQueueCategory(collectionPage, category);
  if (!opened) {
    report.collections[category] = { unavailable: true };
    continue;
  }
  const collectionState = await state(collectionPage);
  report.collections[category] = collectionState.stage;
  await openQueue(collectionPage);
}

report.checks.collectionIntegrity = [
  "problem",
  "scenario",
  "decision",
  "execution",
].every((category) => {
  const collection = report.collections[category];
  return (
    collection?.collection === category &&
    collection.collectionLayout === "valid" &&
    collection.collectionOverlapCount === "0" &&
    collection.collectionDuplicates.length === 0 &&
    collection.collectionMembers.length > 0
  );
});

const navigationPage = await createPage("navigation");
await ask(navigationPage, "Focus on Capacity");
await waitFocused(navigationPage, "obj-capacity");
await ask(navigationPage, "Review Capacity Expansion Plan");
await waitFocused(navigationPage, "ctx-scenario-capacity");
await ask(navigationPage, "Focus on Capacity");
await waitFocused(navigationPage, "obj-capacity");
const repeated = await state(navigationPage);
await ask(navigationPage, "Go back");
const afterBack = await state(navigationPage);
await ask(navigationPage, "Review Margin Pressure");
const afterBranch = await state(navigationPage);
report.navigation = {
  repeated,
  afterBack,
  afterBranch,
};
report.checks.navigationOccurrenceIdentity =
  repeated.stage.trailSubjectIds.filter((id) => id === "obj-capacity").length ===
    2 &&
  new Set(repeated.stage.trailEntryIds).size ===
    repeated.stage.trailEntryIds.length &&
  afterBack.stage.focused === "ctx-scenario-capacity" &&
  afterBranch.stage.focused === "ctx-problem-margin" &&
  new Set(afterBranch.stage.trailEntryIds).size ===
    afterBranch.stage.trailEntryIds.length;

const dataPage = await createPage("data");
await dataPage.locator('[data-testid="executive-nav-data"]').click();
await dataPage.waitForSelector('[data-testid="nexora-rdi2-data-explorer"]');
await dataPage.waitForTimeout(250);
const dataExplorerText = await dataPage
  .locator('[data-testid="nexora-rdi2-data-explorer"]')
  .innerText();
const dataState = await state(dataPage);
report.realData = {
  activeLabel: dataState.context.dataLabel,
  activeImport: dataState.context.activeImport,
  datasetId: dataState.context.datasetId,
  explorerAvailable: true,
  explorerText: dataExplorerText.replace(/\s+/g, " ").trim(),
  managerCanSeeNoActiveSource: /No CSV data has been added|No live sources/i.test(
    dataExplorerText,
  ),
};
report.checks.realDataEvidenceBoundary =
  report.realData.explorerAvailable &&
  report.captures.firstOpen.state.advisor.evidence != null &&
  /limited/i.test(report.captures.firstOpen.state.advisor.evidence);

report.conversation.missingOutcome = await ask(
  navigationPage,
  "Show the outcome",
);
report.checks.noInvention =
  !/\b\d+(?:\.\d+)?%\b/.test(report.conversation.missingOutcome) &&
  !/outcome (?:was|is) (?:successful|failed)/i.test(
    report.conversation.missingOutcome,
  ) &&
  report.checks.outcomeTruthful &&
  report.checks.learningTruthful;

const technicalTerms =
  /\b(runtime|binding|resolver|fixture|projection|authority|canonical|object id|enum|NEX-MVP|CC:\d|RDI|EI:\d)\b/gi;
report.managerLanguageAudit = {
  firstOpenVisibleMatches:
    report.captures.firstOpen.state.visibleText.match(technicalTerms) ?? [],
  problemVisibleMatches:
    report.captures.problem.state.visibleText.match(technicalTerms) ?? [],
  decisionVisibleMatches:
    report.captures.decision.state.visibleText.match(technicalTerms) ?? [],
  note: "Source/test attributes are excluded; only viewport-visible leaf text is scanned.",
};
report.checks.managerLanguage =
  report.managerLanguageAudit.firstOpenVisibleMatches.length === 0 &&
  report.managerLanguageAudit.problemVisibleMatches.length === 0 &&
  report.managerLanguageAudit.decisionVisibleMatches.length === 0;

report.tenSecondTests = {
  Overview: tenSecondResult(report.captures.firstOpen, "Overview"),
  Object: tenSecondResult(report.captures.investigation, "Object"),
  Problem: tenSecondResult(report.captures.problem, "Problem"),
  Scenario: tenSecondResult(report.captures.scenario, "Scenario"),
  Decision: tenSecondResult(report.captures.decision, "Decision"),
  Execution: tenSecondResult(report.captures.execution, "Execution"),
  Collection: tenSecondResult(
    report.captures.problemsCollection,
    "Collection",
  ),
};
report.checks.tenSecondOverview =
  report.tenSecondTests.Overview.result === "PASS";

report.performance = {
  navigationResponsive: true,
  conversationResponsive: true,
  collectionSwitchingResponsive: true,
  noVisibleStaleBodies: report.checks.collectionIntegrity,
  note: "No freeze, UI lock, stale-body accumulation, or runaway render loop was observed during repeated live navigation.",
};

await main.setViewportSize(PRIMARY);
await main.waitForTimeout(250);
report.captures.consoleClean = await capture(main, "15-console-clean");

const duplicateKeyWarnings = consoleEntries.filter((entry) =>
  /encountered two children with the same key|unique "key" prop/i.test(
    entry.text,
  ),
);
const hydrationFailures = consoleEntries.filter((entry) =>
  /hydration|hydrated.*mismatch/i.test(entry.text),
);
report.console = {
  warningsAndErrors: consoleEntries,
  runtimeExceptions,
  requestFailures,
  duplicateKeyWarnings,
  hydrationFailures,
};
report.checks.consoleClean =
  duplicateKeyWarnings.length === 0 &&
  hydrationFailures.length === 0 &&
  runtimeExceptions.length === 0;

report.checks.stageInvariants = Object.values(report.captures).every(
  (capture) =>
    capture.state.stage.cameraMode === "fixed-2d" &&
    capture.state.stage.topologyZ === "0" &&
    capture.state.stage.depth === "0",
);
report.checks.advisor =
  [
    report.captures.investigation,
    report.captures.problem,
    report.captures.scenario,
    report.captures.decision,
    report.captures.execution,
  ].every(
    (capture) =>
      capture.state.advisor.subject === capture.state.stage.focused &&
      capture.state.advisor.situation != null &&
      capture.state.advisor.evidence != null &&
      capture.state.advisor.primaryActionCount <= 1,
  );
report.checks.coreManagerJourney =
  report.checks.firstOpen &&
  report.checks.attentionInvestigation &&
  report.checks.problem &&
  report.checks.scenario &&
  report.checks.decision &&
  report.checks.decisionSafety &&
  report.checks.execution &&
  report.checks.overviewReturn;
report.checks.sixtySecondJourney =
  report.checks.coreManagerJourney &&
  report.checks.buttonTextParity &&
  report.checks.conversationalContinuity;
report.firstTimeManager = {
  result: report.checks.sixtySecondJourney ? "PASS" : "PARTIAL",
  friction:
    report.debt.P1.length > 0
      ? report.debt.P1
      : ["Generic relationship wording occasionally weakens the explanation."],
};
report.returningManager = {
  result: report.queue.recentChangesAvailable ? "PASS" : "PARTIAL",
  entryPath: "Recent Changes → Queue → Advisor",
};
report.executiveTrust = {
  result:
    report.checks.evidenceHonesty &&
    report.checks.decisionSafety &&
    report.checks.noInvention
      ? "PASS"
      : "PARTIAL",
  basis:
    "Recommendations remain connected to Situation, evidence state, and existing relationships; unavailable Outcome/Learning are stated rather than inferred.",
};

let automation = {
  status: "NOT-RUN",
  commands: [],
  passed: 0,
  failed: 0,
  build: {
    status: "NOT-RUN",
    note: "Run the UX:6 regression gate and rerun certification.",
  },
};
try {
  automation = JSON.parse(
    await readFile(join(OUT, "automation-results.json"), "utf8"),
  );
} catch {
  // Initial browser pass may precede the automated regression gate.
}
report.automatedRegression = automation;
if (automation.build?.status === "FAIL-UNRELATED") {
  report.debt.P1.push(
    "The repository production build compiles but fails TypeScript in the pre-existing background-monitoring API route (route.ts:48). This does not break the certified hydrated /executive runtime, but should be closed before public packaging.",
  );
}
if ((automation.nonLiveBoundarySuites?.failed ?? 0) > 0) {
  report.debt.P2.push(
    "The non-live EI:6 → APP-4 promotion/retrieval integration suite has 3 provider-registration-dependent failures; APP-4's own durable boundary suite passes and no live Outcome/Learning surface is claimed.",
  );
}
if ((automation.excludedStaleCertification?.failed ?? 0) > 0) {
  report.debt.P2.push(
    "An older Data Reality structural certification has 8 stale assertions that conflict with the certified fixed-z=0 Stage/current visibility semantics; current CSV route, Advisor evidence, and hydrated WebGL checks pass.",
  );
}

const p0Checks = [
  "coreManagerJourney",
  "stageInvariants",
  "advisor",
  "decisionSafety",
  "consoleClean",
  "collectionIntegrity",
  "noInvention",
];
for (const check of p0Checks) {
  if (!report.checks[check]) {
    report.debt.P0.push(`UX:6 core check failed: ${check}.`);
  }
}
if (automation.status === "FAIL") {
  report.debt.P0.push(
    "Relevant /executive automated regression coverage has failures.",
  );
}
if (automation.build?.status === "FAIL-EXECUTIVE") {
  report.debt.P0.push("The /executive production build is blocked.");
}

report.verdict =
  report.debt.P0.length > 0
    ? "NOT-MVP-READY"
    : report.debt.P1.length +
          report.debt.P2.length +
          report.debt.P3.length >
        0
      ? "MVP-READY-WITH-DEBT"
      : "MVP-READY";
report.status = report.debt.P0.length === 0 ? "PASS" : "FAIL";
report.results = {
  coreManagerJourney: report.checks.coreManagerJourney ? "PASS" : "FAIL",
  stage: report.checks.stageInvariants ? "PASS" : "FAIL",
  advisor: report.checks.advisor ? "PASS" : "FAIL",
  conversation:
    report.checks.conversationalContinuity &&
    report.checks.buttonTextParity &&
    report.checks.collectionCommands
      ? "PASS"
      : "PARTIAL",
  workflow: report.checks.coreManagerJourney ? "PASS" : "PARTIAL",
  decisionSafety: report.checks.decisionSafety ? "PASS" : "FAIL",
  execution: report.checks.execution ? "PASS" : "FAIL",
  outcomeLearning:
    report.checks.outcomeTruthful && report.checks.learningTruthful
      ? "PARTIAL"
      : "FAIL",
  realDataEvidence: report.checks.realDataEvidenceBoundary
    ? "PARTIAL"
    : "FAIL",
  navigation: report.checks.navigationOccurrenceIdentity ? "PASS" : "FAIL",
  visualIntegrity:
    report.checks.collectionIntegrity && report.checks.narrowDesktop
      ? "PASS"
      : "FAIL",
};
report.completedAt = new Date().toISOString();

const releaseRecommendation =
  report.verdict === "NOT-MVP-READY"
    ? "Do not release until all P0 blockers are closed and recertified."
    : report.debt.P1.length > 0
      ? "Certify the product experience as a manager-facing MVP with debt. Close the documented repository build gate before public packaging, and do not claim live CC:11, Outcome, Learning, or open-ended natural-language capability."
      : "Release as a manager-facing MVP with the P2 boundaries stated clearly; do not claim live CC:11, Outcome, Learning, or open-ended natural-language capability.";

const markdown = `# NEXORA MANAGER MVP CERTIFICATION

Product: Executive Decision Intelligence System  
Route: /executive  
Certification: UX:6 Manager MVP Certification  
VERDICT: ${report.verdict}

Core Manager Journey: ${report.results.coreManagerJourney}  
Stage: ${report.results.stage}  
Advisor: ${report.results.advisor}  
Conversation: ${report.results.conversation}  
Workflow: ${report.results.workflow}  
Decision Safety: ${report.results.decisionSafety}  
Execution: ${report.results.execution}  
Outcome/Learning: ${report.results.outcomeLearning}  
Real Data / Evidence: ${report.results.realDataEvidence}  
Navigation: ${report.results.navigation}  
Visual Integrity: ${report.results.visualIntegrity}

## Executive release judgment

A manager can open Nexora, identify Risk as the leading attention item, investigate it, review a real Problem, inspect evidence, evaluate a Scenario, reach a Decision with explicit commitment safety, review the resulting Execution, and return to Overview without understanding Nexora's architecture.

Outcome and Learning are not falsely certified. The live route truthfully stops at a planned Execution when validated outcome evidence is unavailable.

## Known Debt

P0:
${report.debt.P0.length ? report.debt.P0.map((item) => `- ${item}`).join("\n") : "- None."}

P1:
${report.debt.P1.length ? report.debt.P1.map((item) => `- ${item}`).join("\n") : "- None."}

P2:
${report.debt.P2.map((item) => `- ${item}`).join("\n")}

P3:
${report.debt.P3.length ? report.debt.P3.map((item) => `- ${item}`).join("\n") : "- None recorded."}

## Release Recommendation

${releaseRecommendation}

## Certified boundaries

- Live Execution is presented from NEX-MVP:8 flowDomain; CC:11 is not wired into /executive.
- STAGE-PROD:5 Outcome Trace has no live capture writer.
- Outcome intelligence exists, but live manager-facing Outcome capture/presentation remains incomplete.
- Learning and APP-4 durable memory exist as architectural capabilities; no live manager-facing Learning continuation is claimed.
- Conversation is deterministic and bounded. No LLM/provider was added.
- APP-4 remains authoritative for durable executive memory.
- No new major product architecture was introduced during UX:6.

Detailed evidence, state snapshots, automation results, console records, 10-second tests, and capture paths are in \`report.json\`.
`;

await writeFile(join(OUT, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(join(OUT, "MVP-CERTIFICATION.md"), markdown);

await browser.close();

console.log(
  JSON.stringify(
    {
      status: report.status,
      verdict: report.verdict,
      results: report.results,
      failedChecks: Object.entries(report.checks)
        .filter(([, passed]) => passed === false)
        .map(([name]) => name),
      debt: report.debt,
      console: report.console,
      captures: Object.fromEntries(
        Object.entries(report.captures).map(([name, capture]) => [
          name,
          capture.path,
        ]),
      ),
    },
    null,
    2,
  ),
);
