import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { RMS_MANAGER_AGENT_CONTRACT, RMS_OBSERVER_CONTRACT, RMS_OPERATOR_AGENT_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import {
  aggregateNexoraSimulationTestReports,
  runNexoraSimulationTestJourney,
  validateNexoraSimulationTestJourney,
} from "./nexoraSimulationTestHarness.ts";
import {
  classifyLifecycleJourney,
  classifyManagerJourney,
  renderContinuitySummary,
  renderLifecycleTable,
} from "./nexoraSimulationJourneyObservation.ts";
import {
  SIM_TEST_3_MANUFACTURING_PRIMARY,
} from "./nexoraSimulationManagerJourneys.ts";
import {
  SIM_TEST_4_MANUFACTURING_STRESS,
  SIM_TEST_4_PROJECT_STRESS,
} from "./nexoraSimulationStressJourneys.ts";
import {
  SIM_TEST_5_FAST_LIFECYCLE,
  SIM_TEST_5_JOURNEYS,
  SIM_TEST_5_LOGISTICS_PARITY,
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
  SIM_TEST_5_PROJECT_LIFECYCLE,
  SIM_TEST_5_SERVICE_PARITY,
} from "./nexoraSimulationLifecycleJourneys.ts";
import {
  SIM_TEST_5_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
  type NexoraSimulationJourneyTurnObservation,
  type NexoraSimulationTestJourney,
} from "./nexoraSimulationTestContract.ts";

const JOURNEY_SOURCE = readFileSync(new URL("./nexoraSimulationLifecycleJourneys.ts", import.meta.url), "utf8");
const HARNESS_SOURCE = readFileSync(new URL("./nexoraSimulationTestHarness.ts", import.meta.url), "utf8");

let cached: ReturnType<typeof runNexoraSimulationTestJourney>[] | null = null;

function reports() {
  cached ??= SIM_TEST_5_JOURNEYS.map((journey, index) =>
    runNexoraSimulationTestJourney({ journey, runId: `sim-test-5-${index}` }),
  );
  return cached;
}

function observation(
  overrides: Partial<NexoraSimulationJourneyTurnObservation> = {},
): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    turn: 1,
    tick: 0,
    intent: "ORIENT",
    utterance: "What is happening?",
    deictic: false,
    intendedSubject: null,
    response: "Operations are under pressure.",
    conversationSubjectId: null,
    canonicalSubjectId: null,
    focusedSubjectLabel: null,
    nmiCanonicalId: null,
    advisorReferentId: null,
    advisorReferentName: null,
    mlevelL1: null,
    mlevelL2: null,
    mlevelL3: null,
    mlevelVisibleDepth: 0,
    ancestorApplicable: "NOT_APPLICABLE",
    stageActiveSubjectId: null,
    stageSelectedObjectId: null,
    sceneIntent: null,
    clarificationRequired: false,
    decisionStatus: null,
    npsState: null,
    npsProblemLabel: null,
    vaiFocalObjectId: null,
    vaiRoleSummaries: Object.freeze([]),
    dataPublicationIds: Object.freeze([]),
    csvVersions: Object.freeze([]),
    visibleNumbers: Object.freeze({}),
    observerHiddenNumbers: Object.freeze({}),
    problemId: null,
    scenarioId: null,
    decisionId: null,
    decisionCount: 0,
    executionId: null,
    executionCount: 0,
    executionStatus: null,
    npsOutcomeStatus: null,
    npsResolutionStatus: null,
    npsLearningStatus: null,
    npsLearningDurable: false,
    nxa3OutcomeState: null,
    epistemicMarks: Object.freeze([]),
    ...overrides,
  });
}

function lifecycle(observations: readonly NexoraSimulationJourneyTurnObservation[], journey: NexoraSimulationTestJourney = SIM_TEST_5_MANUFACTURING_LIFECYCLE) {
  return classifyLifecycleJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey,
    observations,
  });
}

test("SIM-TEST:5 — existing authorities only; no new agents or backdoors", () => {
  assert.equal(SIM_TEST_5_BOUNDARY.createsDecisionAgent, false);
  assert.equal(SIM_TEST_5_BOUNDARY.createsExecutionAgent, false);
  assert.equal(SIM_TEST_5_BOUNDARY.createsOutcomeAgent, false);
  assert.equal(SIM_TEST_5_BOUNDARY.createsLearningAgent, false);
  assert.equal(SIM_TEST_5_BOUNDARY.commitDecisionBackdoor, false);
  assert.equal(SIM_TEST_5_BOUNDARY.startExecutionBackdoor, false);
  assert.equal(SIM_TEST_5_BOUNDARY.writeOutcomeBackdoor, false);
  assert.equal(SIM_TEST_5_BOUNDARY.autoRepairs, false);
  assert.equal(SIM_TEST_5_BOUNDARY.startsSimTest6, false);
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.kind, "MANAGER_AGENT");
  assert.equal(RMS_OPERATOR_AGENT_CONTRACT.kind, "OPERATOR_AGENT");
  assert.equal(RMS_OBSERVER_CONTRACT.kind, "OBSERVER");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.equal(HARNESS_SOURCE.includes("simTest.commitDecision"), false);
  assert.equal(HARNESS_SOURCE.includes("simTest.startExecution"), false);
  assert.equal(HARNESS_SOURCE.includes("simTest.writeOutcome"), false);
  assert.equal(HARNESS_SOURCE.includes("commitDecision("), false);
  assert.match(HARNESS_SOURCE, /listDecisions/);
  assert.match(HARNESS_SOURCE, /listExecutions/);
  for (const journey of SIM_TEST_5_JOURNEYS) validateNexoraSimulationTestJourney(journey);
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(JOURNEY_SOURCE.includes(key), false);
});

test("SIM-TEST:5 — manufacturing and project journeys declare the lifecycle progression", () => {
  assert.equal(SIM_TEST_5_MANUFACTURING_LIFECYCLE.mode, "INGESTION");
  assert.equal(SIM_TEST_5_MANUFACTURING_LIFECYCLE.managerProfileId, "DATA_DRIVEN_MANAGER");
  assert.equal(RMS_MANAGER_PROFILES.DATA_DRIVEN_MANAGER.groundTruthAccess, false);
  const manufacturing = SIM_TEST_5_MANUFACTURING_LIFECYCLE.steps.flatMap((step) => step.kind === "MANAGER_TURN" ? [step.managementIntent] : []);
  for (const intent of [
    "ORIENT", "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "ASK_VARIABLES", "EXPLORE_OPTIONS", "COMPARE",
    "REQUEST_EXECUTION_BEFORE_COMMIT", "COMMIT_DECISION", "REQUEST_EXECUTION", "ASK_OUTCOME",
    "ASK_COUNTERFACTUAL", "REVERSE_DECISION", "UNSUPPORTED_ACTION", "RETURN_TO_SUBJECT",
  ]) {
    assert.ok(manufacturing.some((item) => item === intent), intent);
  }
  const managerTurns = SIM_TEST_5_MANUFACTURING_LIFECYCLE.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  assert.ok(managerTurns >= 30 && managerTurns <= 50, String(managerTurns));
  const projectTurns = SIM_TEST_5_PROJECT_LIFECYCLE.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  assert.ok(projectTurns >= 12 && projectTurns <= 24);
  assert.equal(SIM_TEST_5_FAST_LIFECYCLE.mode, "FAST");
  assert.equal(SIM_TEST_5_LOGISTICS_PARITY.scenarioId, "logistics-delivery-pressure");
  assert.equal(SIM_TEST_5_SERVICE_PARITY.scenarioId, "service-capacity-pressure");
});

test("SIM-TEST:5 — classifier detects premature decision, premature execution, and Ground Truth leak", () => {
  const prematureDecision = lifecycle([
    observation({ turn: 1, intent: "COMPARE", decisionId: "dec-1", decisionCount: 1, response: "Option B looks stronger." }),
  ]);
  assert.ok(prematureDecision.some((finding) => finding.classification === "JOURNEY/PREMATURE_DECISION"));

  const postCommitCompare = lifecycle([
    observation({ turn: 1, intent: "COMMIT_DECISION", decisionId: "dec-1", decisionCount: 1, response: "Option B is committed." }),
    observation({ turn: 2, intent: "COMPARE", decisionId: "dec-1", decisionCount: 1, response: "Option B still looks stronger." }),
  ]);
  assert.equal(postCommitCompare.some((finding) => finding.classification === "JOURNEY/PREMATURE_DECISION"), false);

  const prematureExecution = lifecycle([
    observation({ turn: 1, intent: "REQUEST_EXECUTION_BEFORE_COMMIT", executionId: "ex-1", executionCount: 1, response: "Started." }),
  ]);
  assert.ok(prematureExecution.some((finding) => finding.classification === "JOURNEY/PREMATURE_EXECUTION"));

  const leak = lifecycle([
    observation({
      turn: 1,
      intent: "ASK_OUTCOME",
      response: "Capacity recovered by 248 units.",
      visibleNumbers: Object.freeze({ availableCapacity: 110 }),
      observerHiddenNumbers: Object.freeze({ secretRecovery: 248 }),
    }),
  ]);
  assert.ok(leak.some((finding) => finding.classification === "JOURNEY/GROUND_TRUTH_LEAK"));
  assert.equal(leak.find((finding) => finding.classification === "JOURNEY/GROUND_TRUTH_LEAK")?.severity, "S0");

  const missing = lifecycle([
    observation({ turn: 1, intent: "COMMIT_DECISION", response: "Which option do you want to commit to?", clarificationRequired: true }),
    observation({ turn: 2, intent: "COMMIT_DECISION", response: "Which do you mean, the Capacity Gap problem or the Capacity?", clarificationRequired: true }),
  ]);
  assert.ok(missing.some((finding) => finding.classification === "JOURNEY/MISSING_DECISION"));
});

test("SIM-TEST:5 — committed Decision is not treated as investigation CONTEXT_OVERRIDE", () => {
  const measured = classifyManagerJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey: SIM_TEST_5_MANUFACTURING_LIFECYCLE,
    observations: [observation({ turn: 1, intent: "COMMIT_DECISION", decisionStatus: "applied", response: "Decision recorded." })],
    causalOverclaimTurns: [],
  });
  assert.equal(measured.findings.some((finding) => finding.classification === "JOURNEY/CONTEXT_OVERRIDE"), false);
});

test("SIM-TEST:5 — primary INGESTION lifecycle and bounded parity journeys run through the harness", () => {
  const suite = reports();
  const manufacturing = suite[0]!;
  const project = suite[1]!;
  const logistics = suite[2]!;
  const service = suite[3]!;
  const fast = suite[4]!;
  for (const report of suite) {
    assert.equal(report.harnessStatus, "PASS", report.error ?? report.identity.journeyId);
    assert.equal(report.autoRepairAttempted, false);
    assert.equal(report.managerFirewall?.groundTruthAccess, false);
  }
  assert.equal(manufacturing.identity.mode, "INGESTION");
  assert.ok(manufacturing.turns >= 30);
  assert.equal(fast.identity.mode, "FAST");
  assert.ok(renderLifecycleTable(manufacturing).includes("Decision"));
  assert.ok(renderContinuitySummary(manufacturing).includes("Referent"));
  const aggregate = aggregateNexoraSimulationTestReports("sim-test-5", suite);
  assert.equal(aggregate.harnessFailures, 0);
  assert.equal(aggregate.crossRunIsolation, "PASS");
  assert.ok(project.turns >= 12);
  assert.ok(logistics.turns >= 8);
  assert.ok(service.turns >= 8);
  void manufacturing.findingCounts;
});

test("SIM-TEST:5 — SIM-TEST:3-FIX1 and SIM-TEST:4-FIX1 regression journeys remain green", () => {
  const manufacturing3 = runNexoraSimulationTestJourney({ journey: SIM_TEST_3_MANUFACTURING_PRIMARY, runId: "sim-test-5-reg-3" });
  const manufacturing4 = runNexoraSimulationTestJourney({ journey: SIM_TEST_4_MANUFACTURING_STRESS, runId: "sim-test-5-reg-4m" });
  const project4 = runNexoraSimulationTestJourney({ journey: SIM_TEST_4_PROJECT_STRESS, runId: "sim-test-5-reg-4p" });
  for (const report of [manufacturing3, manufacturing4, project4]) {
    assert.equal(report.harnessStatus, "PASS");
    assert.equal(report.findingCounts.S0, 0);
    assert.equal(report.findingCounts.S1, 0, report.journeyFindings.map((item) => item.classification).join(","));
  }
});
