import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { classifyLifecycleJourney } from "./nexoraSimulationJourneyObservation.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import {
  SIM_TEST_6_FAST_PARITY,
  SIM_TEST_6_FRESH_SESSION,
  SIM_TEST_6_T50_FOCUSED,
  SIM_TEST_6_T64_FOCUSED,
  SIM_TEST_6_T69_FOCUSED,
  SIM_TEST_6_T71_FOCUSED,
  SIM_TEST_6_T77_FOCUSED,
} from "./nexoraSimulationLongSessionJourneys.ts";
import { SIM_TEST_5_MANUFACTURING_LIFECYCLE } from "./nexoraSimulationLifecycleJourneys.ts";
import type { NexoraSimulationJourneyTurnObservation, NexoraSimulationTestJourney } from "./nexoraSimulationTestContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const DECISION_ID = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";
const EXECUTION_ID = "execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";

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
    messageIdSeed: `fix5-${utterance}`,
  });
}

function decisionCount(turn: ReturnType<typeof executeNexoraConversationalExperience>) {
  return Object.keys(turn.nextDecisionSession?.provenanceByDecisionId ?? {}).length;
}

function observation(
  overrides: Partial<NexoraSimulationJourneyTurnObservation>,
): NexoraSimulationJourneyTurnObservation {
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
  return classifyLifecycleJourney({ testRunId: "fix5", rmsRunId: "rms:fix5", journey, observations });
}

test("SIM-TEST:6-FIX5 — T77/T78 focused reproduction is discussion, not a Decision write", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T77_FOCUSED,
    runId: "sim-test-6-fix5-t77",
  });
  assert.equal(report.harnessStatus, "PASS");
  assert.equal(report.findingCounts.S0, 0);
  const t13 = report.journeyObservations.find((item) => item.turn === 13)!;
  assert.equal(t13.utterance, "Let's go with option B.");
  assert.equal(t13.decisionCount, 1);
  assert.equal(t13.decisionId, DECISION_ID);
  const t76 = report.journeyObservations.find((item) => item.turn === 76)!;
  const t77 = report.journeyObservations.find((item) => item.turn === 77)!;
  const t78 = report.journeyObservations.find((item) => item.turn === 78)!;
  assert.equal(t77.utterance, "Show me the alternatives again.");
  assert.equal(t78.utterance, "Compare those options without changing the decision.");
  assert.equal(t76.decisionCount, 1);
  assert.equal(t77.decisionCount, 1);
  assert.equal(t78.decisionCount, 1);
  assert.equal(t77.decisionId, DECISION_ID);
  assert.equal(t78.decisionId, DECISION_ID);
  assert.equal(t77.executionCount, 1);
  assert.equal(t78.executionCount, 1);
  assert.equal(t77.executionId, EXECUTION_ID);
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("PREMATURE_DECISION")),
    false,
  );
  assert.equal(t71Safe(report), true);
});

function t71Safe(report: ReturnType<typeof runNexoraSimulationTestJourney>) {
  const t71 = report.journeyObservations.find((item) => item.turn === 71);
  const t69 = report.journeyObservations.find((item) => item.turn === 69);
  if (!t71 || !t69) return true;
  return t71.canonicalSubjectId === "obj-delivery" && t69.clarificationRequired === true;
}

test("FIX5 — Observer scores Decision write during explore/compare, not Decision presence after commit", () => {
  const premature = classify([
    observation({ turn: 1, intent: "COMPARE", decisionId: "dec-1", decisionCount: 1, response: "Option B looks stronger." }),
  ]);
  assert.ok(premature.some((item) => item.classification === "JOURNEY/PREMATURE_DECISION"));

  const legitimate = classify([
    observation({ turn: 1, intent: "COMMIT_DECISION", decisionId: "dec-1", decisionCount: 1, response: "Committed." }),
    observation({ turn: 2, intent: "EXPLORE_OPTIONS", decisionId: "dec-1", decisionCount: 1, response: "Alternatives remain." }),
    observation({ turn: 3, intent: "COMPARE", decisionId: "dec-1", decisionCount: 1, response: "Compared without changing the decision." }),
  ]);
  assert.equal(legitimate.some((item) => item.classification === "JOURNEY/PREMATURE_DECISION"), false);

  const writtenDuringCompare = classify([
    observation({ turn: 1, intent: "COMMIT_DECISION", decisionId: "dec-1", decisionCount: 1, response: "Committed." }),
    observation({ turn: 2, intent: "COMPARE", decisionId: "dec-2", decisionCount: 2, response: "A new Decision appeared." }),
  ]);
  assert.ok(writtenDuringCompare.some((item) => item.classification === "JOURNEY/PREMATURE_DECISION"));
});

test("FIX5 — discussion, comparison, option mention, queries, and ambiguous preference do not write Decisions", () => {
  const problem = run("Show Capacity.");
  const discuss = run("Show me the alternatives.", problem);
  assert.equal(decisionCount(discuss), 0);
  const compare = run("Compare them.", discuss);
  assert.equal(decisionCount(compare), 0);
  const mention = run("What was option B?", compare);
  assert.equal(decisionCount(mention), 0);
  const ambiguous = run("Maybe B.", mention);
  assert.equal(decisionCount(ambiguous), 0);
  const look = run("Let's look at B.", ambiguous);
  assert.equal(decisionCount(look), 0);
  const negative = run("Don't commit yet.", look);
  assert.equal(decisionCount(negative), 0);
});

test("FIX5 — explicit commitment still reaches CC:10; queries after Decision do not duplicate", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "fix5-commit-queries",
  });
  const optionB = report.journeyObservations.find((item) => item.utterance === "Let's go with option B.")!;
  assert.ok((optionB.decisionCount ?? 0) >= 1 || optionB.decisionStatus === "confirmation-required");
  const afterCommit = report.journeyObservations.filter((item) => item.turn >= optionB.turn);
  assert.ok(afterCommit.every((item) => (item.decisionCount ?? 0) <= 1));
  const queries = afterCommit.filter((item) =>
    /did it work|what did we|why did we|how is (this|it) (execution|going)|alternatives again|compare/i.test(item.utterance),
  );
  assert.ok(queries.length >= 1);
  assert.ok(queries.every((item) => (item.decisionCount ?? 0) <= 1));
  assert.ok(afterCommit.every((item) => (item.executionCount ?? 0) <= 1));
});

test("FIX5 — lifecycle-rich and long-distance revisit keep one Decision and one Execution", () => {
  const report = runNexoraSimulationTestJourney({
    journey: SIM_TEST_6_T77_FOCUSED,
    runId: "fix5-lifecycle",
  });
  const last = report.journeyObservations.at(-1)!;
  assert.equal(last.decisionCount, 1);
  assert.equal(last.executionCount, 1);
  assert.equal(last.decisionId, DECISION_ID);
  const changes = report.journeyObservations.filter((item, index, all) => {
    const previous = all[index - 1];
    return (item.decisionCount ?? 0) !== (previous?.decisionCount ?? 0);
  });
  assert.equal(changes.length, 1);
  assert.equal(changes[0]?.turn, 13);
  const execChanges = report.journeyObservations.filter((item, index, all) => {
    const previous = all[index - 1];
    return (item.executionCount ?? 0) !== (previous?.executionCount ?? 0);
  });
  assert.equal(execChanges.length, 1);
});

test("FIX5 — FIX4 T71, FIX3 T69, FIX2 T64, FIX1 T50, SIM-TEST:5-FIX1, FAST, fresh", () => {
  const t71 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T71_FOCUSED, runId: "fix5-t71" });
  assert.equal(t71.journeyObservations.find((item) => item.turn === 71)?.canonicalSubjectId, "obj-delivery");
  const t69 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T69_FOCUSED, runId: "fix5-t69" });
  assert.equal(t69.journeyObservations.find((item) => item.turn === 69)?.clarificationRequired, true);
  const t64 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T64_FOCUSED, runId: "fix5-t64" });
  assert.equal(t64.journeyObservations.find((item) => item.turn === 64)?.canonicalSubjectId, "obj-delivery");
  const t50 = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_T50_FOCUSED, runId: "fix5-t50" });
  assert.equal(
    t50.journeyFindings.some((item) => item.classification.includes("REPEATED_CLARIFICATION") && item.managerTurn === 50),
    false,
  );
  const manufacturing = runNexoraSimulationTestJourney({
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    runId: "fix5-sim5-fix1",
  });
  assert.equal(manufacturing.findingCounts.S0, 0);
  const optionB = manufacturing.journeyObservations.find((item) => item.utterance === "Let's go with option B.");
  assert.ok(optionB);
  assert.ok((optionB.decisionCount ?? 0) >= 1 || optionB.decisionStatus === "confirmation-required");
  assert.ok(manufacturing.journeyObservations.every((item) => (item.decisionCount ?? 0) <= 1));
  const fast = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FAST_PARITY, runId: "fix5-fast" });
  assert.equal(fast.findingCounts.S0, 0);
  assert.equal(fast.findingCounts.S1, 0);
  // Encodes T16 "Go back to the capacity issue." keeping the visited Capacity Object, with
  // Advisor T17/T20/T21 following canonical rather than Capacity Gap.
  assert.equal(fast.deterministicSignature, "fnv1a32:3aa7cfc6");
  const fresh = runNexoraSimulationTestJourney({ journey: SIM_TEST_6_FRESH_SESSION, runId: "fix5-fresh" });
  assert.equal(fresh.findingCounts.S0, 0);
  assert.equal(fresh.journeyObservations.every((item) => (item.decisionCount ?? 0) === 0), true);
  assert.equal(fresh.journeyObservations.every((item) => (item.executionCount ?? 0) === 0), true);
});
