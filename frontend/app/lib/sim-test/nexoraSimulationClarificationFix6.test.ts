import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { freezePendingClarification } from "../manager-object/nexoraMvpFinal63ClarificationGate.ts";
import { interpretClarificationTurn } from "../manager-object/nexoraMvpFinal63ClarificationResolver.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import { interpretContextualManagerTurn } from "../manager-object/nexoraMvpFinal62ConversationContinuity.ts";
import { createEmptyConversationContinuity } from "../manager-object/conversationContinuitySnapshot.ts";
import { classifyManagerJourney } from "./nexoraSimulationJourneyObservation.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
  SIM_TEST_6_T69_FOCUSED,
  SIM_TEST_6_T71_FOCUSED,
  SIM_TEST_6_T77_FOCUSED,
  SIM_TEST_6_T83_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { SIM_TEST_5_MANUFACTURING_LIFECYCLE } from "./nexoraSimulationLifecycleJourneys.ts";
import type { NexoraSimulationJourneyTurnObservation, NexoraSimulationTestJourney } from "./nexoraSimulationTestContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const DECISION_ID = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";

function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({
      workspace: "overview", presentationState: "minimum", environmentIntent: "neutral",
    }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix6-${utterance}`,
  });
}

function typeAmbiguityPending() {
  return freezePendingClarification({
    identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    reason: "TYPE_AMBIGUITY",
    originalUtterance: "Are you asking about the problem or the KPI?",
    requestedOperation: "EVIDENCE",
    candidates: Object.freeze([
      { subjectId: "obj-delivery", canonicalName: "Delivery", subjectKind: "object" },
      { subjectId: "ctx-problem-capacity", canonicalName: "Capacity Gap", subjectKind: "problem" },
    ]),
    expectedAnswer: "choice",
    binaryCandidateId: null,
    question: "Are you asking about the problem or the KPI?",
    questionSignature: "TYPE_AMBIGUITY:obj-delivery,ctx-problem-capacity:Are you asking about the problem or the KPI?",
    loopCount: 1,
    parked: false,
    consequence: "INQUIRY",
    originalIntentKind: "unknown",
  });
}

function interpret(utterance: string, pending = typeAmbiguityPending()) {
  const turnMeaning = interpretCanonicalManagerMeaning({ utterance, subjects });
  const contextual = interpretContextualManagerTurn({
    turnMeaning,
    subjects,
    previousContinuity: createEmptyConversationContinuity(),
    executiveContext: null,
    managerSession: createEmptyManagerObjectSession(),
    stageFocusedId: null,
  });
  return interpretClarificationTurn({
    turnMeaning,
    contextual,
    pending,
    continuity: createEmptyConversationContinuity(),
    subjects,
    intentKind: "unknown",
  });
}

function observation(overrides: Partial<NexoraSimulationJourneyTurnObservation>): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    turn: 1, tick: 0, intent: "ORIENT", utterance: "", deictic: false, intendedSubject: null,
    response: "", conversationSubjectId: null, canonicalSubjectId: null, focusedSubjectLabel: null,
    nmiCanonicalId: null, advisorReferentId: null, advisorReferentName: null,
    mlevelL1: null, mlevelL2: null, mlevelL3: null, mlevelVisibleDepth: 0,
    ancestorApplicable: "NOT_APPLICABLE", stageActiveSubjectId: null, stageSelectedObjectId: null,
    sceneIntent: null, clarificationRequired: false, decisionStatus: null, npsState: null,
    npsProblemLabel: null, vaiFocalObjectId: null, vaiRoleSummaries: Object.freeze([]),
    dataPublicationIds: Object.freeze([]), csvVersions: Object.freeze([]),
    visibleNumbers: Object.freeze({}), observerHiddenNumbers: Object.freeze({}),
    problemId: null, scenarioId: null, decisionId: null, decisionCount: 0, executionId: null,
    executionCount: 0, executionStatus: null, npsOutcomeStatus: null, npsResolutionStatus: null,
    npsLearningStatus: null, npsLearningDurable: false, nxa3OutcomeState: null,
    epistemicMarks: Object.freeze([]), ...overrides,
  });
}

function classify(observations: readonly NexoraSimulationJourneyTurnObservation[], journey: NexoraSimulationTestJourney = SIM_TEST_5_MANUFACTURING_LIFECYCLE) {
  return classifyManagerJourney({
    testRunId: "fix6",
    rmsRunId: "rms:fix6",
    journey,
    observations,
    causalOverclaimTurns: Object.freeze([]),
  });
}

test("SIM-TEST:6-FIX6 — T83 focused reproduction does not repeat type-ambiguity clarification", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T83_FOCUSED,
    runId: "sim-test-6-fix6-t83",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t77 = report.journeyObservations.find((item) => item.turn === 77)!;
  const t78 = report.journeyObservations.find((item) => item.turn === 78)!;
  assert.equal(t77.utterance, "Show me the alternatives again.");
  assert.equal(t78.utterance, "Compare those options without changing the decision.");
  assert.equal(t77.decisionCount, 1);
  assert.equal(t78.decisionCount, 1);
  assert.equal(t77.decisionId, DECISION_ID);
  const t81 = report.journeyObservations.find((item) => item.turn === 81)!;
  const t82 = report.journeyObservations.find((item) => item.turn === 82)!;
  const t83 = report.journeyObservations.find((item) => item.turn === 83)!;
  assert.equal(t83.utterance, "Is there a new bottleneck I should know about?");
  assert.equal(t83.canonicalSubjectId, "obj-delivery");
  assert.equal(t83.clarificationRequired, false);
  assert.doesNotMatch(t83.response, /Name the one you want to investigate/i);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 83),
    false,
  );
  assert.equal(t83.decisionCount, 1);
  assert.equal(t83.executionCount, 1);
  assert.equal(t81.decisionCount, 1);
  assert.equal(t82.executionCount, 1);
});

test("FIX6 — pending type-ambiguity is superseded by investigate, outcome, decision, and execution queries", () => {
  assert.equal(interpret("Is there a new bottleneck I should know about?").action, "proceed");
  assert.equal(interpret("Did the action work after the later data?").pending, null);
  assert.equal(interpret("What did we decide?").action, "proceed");
  assert.equal(interpret("How is the execution going?").action, "proceed");
  assert.equal(interpret("Compare those options without changing the decision.").action, "proceed");
});

test("FIX6 — pending answers, known switch, unknown switch, locative, and bare named issue", () => {
  const pending = run("What about Capacity Theatre?", run("Show Delivery."));
  assert.equal(pending.clarificationTurn.action === "clarify" || pending.status === "clarification-required", true);
  const answered = run("Delivery.", pending);
  assert.notEqual(answered.clarificationTurn.action, "clarify");

  const pending2 = run("What about Capacity Theatre?", run("Show Delivery."));
  const switched = run("Show Inventory.", pending2);
  assert.equal(switched.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(switched.managerObjectTurn.session.pendingClarification, null);

  const pending3 = run("What about Capacity Theatre?", run("Show Delivery."));
  const unknown = run("Go back to the supplier problem.", pending3);
  assert.equal(unknown.clarificationTurn.action === "clarify" || unknown.status === "clarification-required", true);
  assert.doesNotMatch(unknown.response, /Supplier Delay has been added/i);

  const delivery = run("Show Delivery.");
  const locative = run("What is the problem here?", delivery);
  assert.match(locative.nxaAdvisorContract?.referentId ?? locative.nextRuntimeState.focusedSubject?.id ?? "", /delivery/i);

  const capacity = run("Show Capacity.", locative);
  const named = run("The delivery issue.", capacity);
  assert.equal(named.nextRuntimeState.focusedSubject?.id, "obj-delivery");
});

test("FIX6 — resolved/superseded pending does not resurrect; unknown later is not Observer-repeated", () => {
  const missing = run("Go back to the supplier problem.", run("Show Capacity."));
  const resolved = run("Show Delivery.", missing);
  assert.equal(resolved.managerObjectTurn.session.pendingClarification, null);
  const deictic = run("Explain this.", resolved);
  assert.equal(deictic.nextRuntimeState.focusedSubject?.id, "obj-delivery");
  const laterUnknown = run("Go back to the supplier problem.", deictic);
  assert.equal(laterUnknown.clarificationTurn.action === "clarify" || laterUnknown.status === "clarification-required", true);
  const observations = [
    observation({ turn: 1, clarificationRequired: true, response: "Which one do you want me to look at?" }),
    observation({ turn: 2, clarificationRequired: false, response: "Focused on Delivery." }),
    observation({ turn: 3, clarificationRequired: true, response: "Which one do you want me to look at?" }),
  ];
  assert.equal(classify(observations).findings.some((item) => item.classification === "JOURNEY/REPEATED_CLARIFICATION"), false);
});

test("FIX6 — three consecutive identical clarifications still score as repeated", () => {
  const observations = [1, 2, 3].map((turn) => observation({
    turn,
    intent: "FOLLOW_UP",
    clarificationRequired: true,
    response: "Which subject do you mean?",
  }));
  assert.ok(classify(observations).findings.some((item) => item.classification === "JOURNEY/REPEATED_CLARIFICATION"));
});

test("FIX6 — long-distance and lifecycle-rich keep Decision/Execution; FIX5–FIX1 and SIM-TEST:5", () => {
  const t83 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T83_FOCUSED, runId: "fix6-long" });
  assert.equal(t83.journeyObservations.at(-1)?.decisionCount, 1);
  assert.equal(t83.journeyObservations.at(-1)?.executionCount, 1);
  const t77 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T77_FOCUSED, runId: "fix6-t77" });
  assert.equal(t77.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")), false);
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix6-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix6-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix6-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix6-t50" });
  assert.equal(t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50), false);
  const manufacturing = runNexoraSimulationTestJourney({ journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE, runId: "fix6-sim5" });
  assert.equal(manufacturing.findingCounts.S0, 0);
  assert.ok(manufacturing.journeyObservations.every((item) => (item.decisionCount ?? 0) <= 1));
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix6-fast" });
  assert.equal(fast.findingCounts.S1, 0);
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix6-fresh" });
  assert.equal(fresh.journeyObservations.some((item) => item.clarificationRequired), false);
  assert.equal(fresh.journeyObservations.every((item) => (item.decisionCount ?? 0) === 0), true);
});
