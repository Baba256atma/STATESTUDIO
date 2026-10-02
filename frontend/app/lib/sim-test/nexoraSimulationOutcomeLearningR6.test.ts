/** NPA-T SIM-TEST:10-R6 — full Outcome, Learning & next-cycle recertification. Measurement only. */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectPublishedKpiObservedDirection } from "../data-reality/publishedKpiObservedDirection.ts";
import { LIVE_OUTCOME_BOUNDARY, nexoraLiveOutcomeIntelligenceIdentity, projectLiveOutcomeIntelligence } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  listCapturedObservations,
  projectOutcomeObservationCapture,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  GROUNDED_LEARNING_BOUNDARY,
  projectGroundedLearningIntelligence,
  resetGroundedLearningForTests,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { synchronizeLiveExecutionOutcomeEvaluation } from "../nex-mvp/nexoraOutcomeLearningRuntimeIntegration.ts";
import { listLiveExecutionCaptureContextsForTests } from "../nex-mvp/nexoraPostDecisionObservationCapture.ts";
import { NPS_OUTCOME_LEARNING_BOUNDARY } from "../nexora-problem-solving/npsOutcomeLearning.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { SIM_TEST_5_JOURNEYS } from "./nexoraSimulationLifecycleJourneys.ts";
import {
  SIM_TEST_10_CORE_JOURNEYS,
  SIM_TEST_10_JOURNEYS,
  type SimTest10JourneyFamily,
} from "./nexoraSimulationOutcomeLearningJourneys.ts";
import {
  SIM_TEST_10_BOUNDARY,
  type NexoraSimulationTestJourney,
  type NexoraSimulationTestRunReport,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/SIM-TEST-10-R6/", import.meta.url);
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const SUCCESS_CLAIM = /\b(?:it worked|was successful|decision succeeded|outcome was success|execution succeeded)\b/i;
const CAUSAL_CERTAINTY = /\b(?:caused|because of|proves that|the decision made)\b/i;
const UNCERTAIN = /not enough|too early|unknown|does not establish|cannot tell|insufficient|not enough outcome evidence/i;
const ESTABLISHED = new Set(["MEETS_EXPECTATION", "EXCEEDS_EXPECTATION", "BELOW_EXPECTATION", "PARTIAL", "MIXED"]);
const NPS_LEARNING_SET = new Set(["BOUNDED", "TENTATIVE", "WEAKENED_HYPOTHESIS", "INCONCLUSIVE"]);

function productionFiles(directory: string): readonly string[] {
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const name of readdirSync(current)) {
      const path = resolve(current, name);
      const rel = relative(FRONTEND_ROOT, path);
      if (rel.startsWith("app/lib/sim-test/") || rel.includes("/node_modules/") || rel.includes("/.next/")) continue;
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(?:ts|tsx|js|mjs)$/.test(name) && !/\.test\./.test(name)) files.push(path);
    }
  };
  visit(directory);
  return Object.freeze(files.sort());
}

function productionSnapshot() {
  const files = productionFiles(resolve(FRONTEND_ROOT, "app"));
  const aggregate = createHash("sha256");
  const protectedNames = [
    "conversationalExperienceOrchestrator.ts", "executiveExecutionFollowUp.ts",
    "executiveDecisionRuntimeAdapter.ts", "executiveExecutionRuntimeAdapter.ts",
    "executiveScenarioResolver.ts", "executiveScenarioDefinition.ts",
    "executiveDecisionCommitmentResolver.ts", "npsOutcomeLearning.ts",
    "npsOutcomeLearningRuntime.ts", "ecaExecutiveOutcome.ts", "ecaExecutiveLearningClosure.ts",
    "nexoraLiveOutcomeIntelligence.ts", "nexoraLiveOutcomeObservationCapture.ts",
    "nexoraOutcomeLearningRuntimeIntegration.ts", "nexoraGroundedLearningIntelligence.ts",
    "nexoraPostDecisionObservationCapture.ts", "publishedKpiObservedDirection.ts", "csvRealDataImportStore.ts",
    "rmsManagerCc5Adapter.ts", "npsExecutionMonitoring.ts",
  ];
  const protectedFiles: Record<string, string> = {};
  for (const file of files) {
    const content = readFileSync(file);
    const rel = relative(FRONTEND_ROOT, file);
    const hash = createHash("sha256").update(content).digest("hex");
    aggregate.update(rel).update("\0").update(hash).update("\n");
    if (protectedNames.some((name) => rel.endsWith(name))) protectedFiles[rel] = hash;
  }
  return Object.freeze({ digest: aggregate.digest("hex"), fileCount: files.length, protectedFiles: Object.freeze(protectedFiles) });
}

function uniqueFindings(report: NexoraSimulationTestRunReport) {
  const unique = new Map<string, NexoraSimulationTestRunReport["findings"][number]>();
  for (const finding of [...report.findings, ...report.journeyFindings]) unique.set(finding.findingId, finding);
  return [...unique.values()];
}

function familyOf(journeyId: string): SimTest10JourneyFamily | "SIM5" | null {
  const core = SIM_TEST_10_JOURNEYS.find((item) => item.journeyId === journeyId);
  return core?.r10Family ?? (journeyId.startsWith("sim-test-5-") ? "SIM5" : null);
}

function snapshotCaptures() {
  return listCapturedObservations().map((item) => Object.freeze({
    observationId: item.observationId,
    executionId: item.executionId,
    decisionId: item.decisionId,
    subjectId: item.subjectId,
    metricId: item.metricId,
    dimension: item.dimension,
    value: item.value,
    sourceId: item.sourceId,
    datasetId: item.datasetId,
    observedAt: item.observedAt,
    capturedAt: item.capturedAt,
    eligibleAsActualOutcome: item.eligibleAsActualOutcome,
    isOutcome: item.isOutcome,
    rejections: item.rejections,
    duplicateOf: item.duplicateOf,
    provenanceRefs: item.provenanceRefs,
  }));
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `sim10-r6-${seed}` });
}

function outcomeReady(assessment: {
  readonly identity: string;
  readonly status: string;
  readonly comparison: { readonly comparable: boolean };
  readonly actualOutcome: unknown;
  readonly expectedOutcome: unknown;
}): boolean {
  return (
    assessment.identity === nexoraLiveOutcomeIntelligenceIdentity &&
    assessment.status === "comparison-ready" &&
    assessment.comparison.comparable &&
    assessment.actualOutcome != null &&
    assessment.expectedOutcome != null
  );
}

function inspectLiveCoreOut(last: NexoraSimulationTestRunReport["journeyObservations"][number] | undefined) {
  const sync = synchronizeLiveExecutionOutcomeEvaluation({
    executions: (last?.executionLedger ?? []).map((item) => ({
      executionId: item.executionId,
      decisionId: item.decisionId,
      title: "",
      status: item.status,
    })),
    decisions: (last?.decisionLedger ?? []).map((item) => ({
      decisionId: item.decisionId,
      subjectIds: item.subjectIds,
      scenarioId: item.scenarioId,
      committedAt: null,
      status: item.status,
    })),
    focusedSubjectId: last?.canonicalSubjectId ?? null,
  });
  const inspections = listLiveExecutionCaptureContextsForTests()
    .filter((context) => context.window != null && context.window.status !== "timing-incomplete")
    .map((context) => {
      const capture = projectOutcomeObservationCapture({
        subjectId: context.subjectId,
        expected: context.expected ?? null,
        window: context.window ?? null,
      });
      const assessment = projectLiveOutcomeIntelligence({
        subjectId: context.subjectId,
        decisionId: context.decisionId ?? null,
        executionId: context.executionId ?? null,
        expected: context.expected ?? null,
        capture,
      });
      const learning = projectGroundedLearningIntelligence({
        workspaceId: "nexora-mvp",
        subjectId: context.subjectId,
        createdAt: assessment.actualOutcome?.observedAt ?? "core-out2:session",
        assessment,
        capture,
        decisionId: assessment.decisionId,
        executionId: assessment.executionId,
      });
      return Object.freeze({
        subjectId: context.subjectId,
        decisionId: context.decisionId,
        executionId: context.executionId,
        assessmentStatus: assessment.status,
        comparisonResult: assessment.comparison.result,
        comparable: assessment.comparison.comparable,
        comparisonIncompatibility: assessment.comparison.incompatibilityReason,
        expectedDirection: assessment.expectedOutcome?.expectedDirection ?? null,
        expectedMetricId: assessment.expectedOutcome?.dimension ?? null,
        expectedValue: assessment.expectedOutcome?.numericTarget ?? null,
        expectedComparator: assessment.expectedOutcome?.comparator ?? null,
        baselineValue: capture.baseline?.numericValue ?? assessment.baseline?.numericValue ?? null,
        baselineMeasured: capture.baseline?.measured ?? assessment.baseline?.measured ?? null,
        baselineMeasuredAt: capture.baseline?.measuredAt ?? assessment.baseline?.measuredAt ?? null,
        baselineSource: capture.baseline?.source ?? assessment.baseline?.source ?? null,
        actualObservationId: assessment.actualOutcome?.observationId ?? null,
        actualValue: assessment.actualOutcome?.numericValue ?? null,
        actualObservedDirection: assessment.actualOutcome?.observedDirection ?? null,
        missingEvidence: assessment.missingEvidence,
        establishesCausation: assessment.establishesCausation,
        eligibilityReason: capture.linkedActuals.length > 0 ? "linked-actual" : "no-linked-actual",
        incompleteComparisonReason: assessment.missingEvidence,
        outcomeReady: outcomeReady(assessment),
        learningCandidateCount: learning.candidates.length,
        learningTypes: learning.candidates.map((item) => item.learningType),
        learningStatuses: learning.candidates.map((item) => item.status),
        learningIds: learning.candidates.map((item) => item.learningId),
        learningStatements: learning.candidates.map((item) => item.statement),
        learningDecisionIds: learning.candidates.flatMap((item) => item.decisionRefs),
        learningExecutionIds: learning.candidates.flatMap((item) => item.executionRefs),
        promotionEligibility: learning.candidates.map((item) => item.promotionEligibility),
        rejectionReasons: learning.rejectionReasons,
        answersLearning: sync.answers.learning ?? null,
      });
    });
  return Object.freeze({
    assessmentCount: sync.assessments.length,
    assessmentStatuses: sync.assessments.map((item) => item.status),
    comparisonResults: sync.assessments.map((item) => item.comparison.result),
    liveLearningAnswer: sync.answers.learning ?? null,
    inspections,
  });
}

test("SIM-TEST:10-R6 recertifies Outcome/Learning/next-cycle from turn 1", { timeout: 1_800_000 }, () => {
  assert.equal(SIM_TEST_10_BOUNDARY.createsOutcomeEngine, false);
  assert.equal(SIM_TEST_10_BOUNDARY.createsLearningAuthority, false);
  assert.equal(SIM_TEST_10_BOUNDARY.autoRepairs, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  assert.equal(LIVE_OUTCOME_BOUNDARY.createsLearning, false);
  assert.equal(GROUNDED_LEARNING_BOUNDARY.evaluatesOutcome, false);
  const productionBefore = productionSnapshot();
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(
    new URL("SOURCE-INTEGRITY-BEFORE.md", ARTIFACT_DIRECTORY),
    `# R6 production digest\n\n\`${productionBefore.digest}\`\nfiles: ${productionBefore.fileCount}\n`,
  );

  const population: readonly NexoraSimulationTestJourney[] = Object.freeze([
    ...SIM_TEST_10_JOURNEYS,
    ...SIM_TEST_5_JOURNEYS,
  ]);
  const reports = population.map((journey) => {
    resetGroundedLearningForTests();
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim10r6-${journey.journeyId}` });
    const last = report.journeyObservations.at(-1);
    const rdiCapacity = projectPublishedKpiObservedDirection({
      kpiId: "kpi.production.capacity-utilization",
      subjectId: "obj-capacity",
    });
    const rdiDelivery = projectPublishedKpiObservedDirection({
      kpiId: "kpi.shipping.on-time-rate",
      subjectId: "obj-delivery",
    });
    return Object.freeze({
      report,
      captures: snapshotCaptures(),
      coreOut: inspectLiveCoreOut(last),
      rdi: Object.freeze({
        capacity: Object.freeze({
          observedDirection: rdiCapacity.observedDirection,
          previousValue: rdiCapacity.previousValue,
          currentValue: rdiCapacity.currentValue,
          previousObservationId: rdiCapacity.previousObservationId,
          currentObservationId: rdiCapacity.currentObservationId,
        }),
        delivery: Object.freeze({
          observedDirection: rdiDelivery.observedDirection,
          previousValue: rdiDelivery.previousValue,
          currentValue: rdiDelivery.currentValue,
        }),
      }),
    });
  });

  const allReports = reports.map((item) => item.report);
  const allRows = allReports.flatMap((report) => report.journeyObservations);
  const leakRows = allRows.filter((row) => row.worldAdvancedUnpublished === true && SEALED.test(row.response))
    .map((row) => ({
      journeyId: reports.find((item) => item.report.journeyObservations.includes(row))?.report.identity.journeyId,
      turn: row.turn,
      utterance: row.utterance,
      response: row.response,
    }));

  const prematureClaims = allRows.flatMap((row) => {
    if (row.intent !== "ASK_OUTCOME") return [];
    const unpublished = row.worldAdvancedUnpublished === true;
    const established = ESTABLISHED.has(row.npsOutcomeStatus ?? "");
    const successWithoutUncertainty = SUCCESS_CLAIM.test(row.response) && !UNCERTAIN.test(row.response);
    if ((unpublished || row.npsOutcomeStatus === "TOO_EARLY" || row.npsOutcomeStatus === "UNKNOWN") && (established || successWithoutUncertainty)) {
      return [{ turn: row.turn, utterance: row.utterance, nps: row.npsOutcomeStatus, unpublished, response: row.response }];
    }
    return [];
  });

  const causalOverreach = allRows.flatMap((row) => {
    if (row.intent !== "ASK_CAUSE") return [];
    if (
      CAUSAL_CERTAINTY.test(row.response) &&
      !UNCERTAIN.test(row.response) &&
      !/does not establish|doesn’t establish|does not prove|does not by itself prove|doesn’t by itself prove/i.test(row.response)
    ) {
      return [{ turn: row.turn, utterance: row.utterance, response: row.response }];
    }
    return [];
  });

  const inventedDurable = allRows.filter((row) => row.npsLearningDurable === true);
  const allDecisions = new Set(allRows.flatMap((row) => (row.decisionLedger ?? []).map((item) => item.decisionId)));
  const allExecutions = new Set(allRows.flatMap((row) => (row.executionLedger ?? []).map((item) => item.executionId)));
  const allObservationIds = new Set(reports.flatMap((item) => item.captures.map((capture) => capture.observationId)));
  const allProblems = new Set(allRows.map((row) => row.problemId).filter(Boolean));
  const allScenarios = new Set(allRows.flatMap((row) => [
    row.scenarioId,
    row.activeScenarioId,
    ...(row.scenarioCandidateIds ?? []),
    ...(row.scenarioLedger ?? []).map((item) => item.scenarioId),
  ].filter(Boolean)));
  const establishedOutcomeRows = allRows.filter((row) => ESTABLISHED.has(row.npsOutcomeStatus ?? ""));
  const capturedMax = Math.max(0, ...allRows.map((row) => row.capturedOutcomeObservationCount ?? 0), ...reports.map((item) => item.captures.length));
  const observedNumeric = allRows.filter((row) => row.npsObservedOutcome != null);
  const eligibleCaptures = reports.flatMap((item) => item.captures.filter((capture) => capture.eligibleAsActualOutcome));
  const outcomeFlagged = reports.flatMap((item) => item.captures.filter((capture) => capture.isOutcome === true));
  const npsWrites = allRows.filter((row) => row.npsOutcomeStatus && NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome === true);
  const npsLearningRows = allRows.filter((row) => NPS_LEARNING_SET.has(row.npsLearningStatus ?? ""));
  const postPublicationOutcomeAsks = allRows.filter((row) =>
    row.intent === "ASK_OUTCOME" &&
    row.worldAdvancedUnpublished !== true &&
    (row.capturedOutcomeObservationCount ?? 0) > 0,
  );
  const postPublicationEstablished = postPublicationOutcomeAsks.filter((row) => ESTABLISHED.has(row.npsOutcomeStatus ?? ""));
  const postPublicationLearning = allRows.filter((row) =>
    (row.intent === "ASK_LEARNING" || row.intent === "ASK_OUTCOME") &&
    (row.capturedOutcomeObservationCount ?? 0) > 0 &&
    NPS_LEARNING_SET.has(row.npsLearningStatus ?? ""),
  );
  const outcomeInformedReassess = allRows.filter((row) =>
    (row.intent === "REASSESS" || /is this still a problem/i.test(row.utterance)) &&
    (row.capturedOutcomeObservationCount ?? 0) > 0,
  );

  const hReports = allReports.filter((report) => familyOf(report.identity.journeyId) === "H_MULTIPLE_OUTCOME_CHAINS");
  const hMaxExec = Math.max(0, ...hReports.flatMap((report) => report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)));
  const hCaptures = reports.filter((item) => familyOf(item.report.identity.journeyId) === "H_MULTIPLE_OUTCOME_CHAINS");
  const hExecutionBindings = hCaptures.flatMap((item) => item.captures.map((capture) => capture.executionId));

  const eCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-e_delayed_outcome");
  const eAsks = (eCore?.journeyObservations ?? []).filter((row) => row.intent === "ASK_OUTCOME").map((row) => ({
    turn: row.turn, tick: row.tick, unpublished: row.worldAdvancedUnpublished === true,
    nps: row.npsOutcomeStatus, captured: row.capturedOutcomeObservationCount ?? 0, expected: row.npsExpectedOutcome ?? null,
    observed: row.npsObservedOutcome ?? null, response: row.response,
  }));

  const jCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-j_reassessment");
  const jReassess = (jCore?.journeyObservations ?? []).filter((row) => row.intent === "REASSESS" || row.utterance === "Is this still a problem?").map((row) => ({
    turn: row.turn, utterance: row.utterance, subject: row.canonicalSubjectId, captured: row.capturedOutcomeObservationCount ?? 0,
    nps: row.npsOutcomeStatus, learning: row.npsLearningStatus, inventedTitle: /is this still a/i.test(row.response), response: row.response,
  }));

  const lCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-l_loop_reentry");
  const lRows = (lCore?.journeyObservations ?? []).map((row) => ({
    turn: row.turn, utterance: row.utterance, intent: row.intent, decisions: row.decisionLedger?.length ?? 0,
    executions: row.executionLedger?.length ?? 0, captured: row.capturedOutcomeObservationCount ?? 0,
    nps: row.npsOutcomeStatus, learning: row.npsLearningStatus, canonical: row.canonicalSubjectId,
  }));
  const lMaxDecisions = Math.max(0, ...lRows.map((row) => row.decisions));
  const lAttemptedNextCycle = (lCore?.journeyObservations ?? []).some((row) =>
    row.intent === "EXPLORE_OPTIONS" || row.intent === "COMMIT_DECISION",
  ) && (lCore?.journeyObservations ?? []).some((row) => row.intent === "REASSESS" || row.intent === "ASK_LEARNING");

  const chains = reports.map((item) => {
    const last = item.report.journeyObservations.at(-1);
    const executions = last?.executionLedger ?? [];
    const postAsk = item.report.journeyObservations.filter((row) => row.intent === "ASK_OUTCOME" && (row.capturedOutcomeObservationCount ?? 0) > 0).at(-1);
    const learnAsk = item.report.journeyObservations.filter((row) => row.intent === "ASK_LEARNING").at(-1);
    const reassess = item.report.journeyObservations.filter((row) => row.intent === "REASSESS" || /is this still a problem/i.test(row.utterance)).at(-1);
    return Object.freeze({
      journeyId: item.report.identity.journeyId,
      family: familyOf(item.report.identity.journeyId),
      problemId: last?.problemId ?? null,
      scenarioId: last?.scenarioId ?? last?.activeScenarioId ?? null,
      decisions: last?.decisionLedger ?? [],
      executions,
      observations: item.captures,
      npsOutcomeStatus: last?.npsOutcomeStatus ?? null,
      npsExpected: last?.npsExpectedOutcome ?? null,
      npsObserved: last?.npsObservedOutcome ?? null,
      npsLearningStatus: last?.npsLearningStatus ?? null,
      npsLearningDurable: last?.npsLearningDurable ?? false,
      postPublicationAskNps: postAsk?.npsOutcomeStatus ?? null,
      learningAskStatus: learnAsk?.npsLearningStatus ?? null,
      reassessmentAfterCapture: Boolean(reassess && (reassess.capturedOutcomeObservationCount ?? 0) > 0),
      observationExecutionIds: [...new Set(item.captures.map((capture) => capture.executionId).filter(Boolean))],
      rdi: item.rdi,
      liveLearningAnswer: item.coreOut.liveLearningAnswer,
      supportedLearning: item.coreOut.inspections.some((entry) => entry.learningStatuses.includes("supported")),
      firstStop:
        (last?.decisionLedger?.length ?? 0) === 0 ? "Scenario → Decision"
        : (last?.executionLedger?.length ?? 0) === 0 ? "Decision → Execution"
        : item.captures.length === 0 ? "Data Reality → Observation"
        : item.coreOut.assessmentCount === 0 ? "Observation → Evaluation"
        : item.coreOut.inspections.every((entry) => entry.baselineValue == null) && item.coreOut.inspections.length > 0
          ? "Pre-E Data Reality → Baseline"
        : item.rdi.capacity.observedDirection == null && item.coreOut.inspections.every((entry) => entry.actualObservedDirection == null)
          ? "RDI History → Observed Direction"
        : item.rdi.capacity.observedDirection != null && item.coreOut.inspections.every((entry) => entry.actualObservedDirection == null)
          ? "Observed Direction → CORE-OUT"
        : item.coreOut.inspections.every((entry) => !entry.comparable)
          ? "Evaluation → Comparison-ready"
        : item.coreOut.inspections.every((entry) => !entry.learningStatuses.includes("supported"))
          ? "Comparison-ready → Supported Learning"
          : reassess == null ? "Learning → Reassessment"
          : "loop-or-complete",
    });
  });

  const wrongExecutionBindings = chains.flatMap((chain) => {
    const allowed = new Set(chain.executions.map((item) => item.executionId));
    if (allowed.size === 0) return [];
    return chain.observations.filter((observation) => observation.executionId && !allowed.has(observation.executionId)).map((observation) => ({
      journeyId: chain.journeyId, observationId: observation.observationId, executionId: observation.executionId,
    }));
  });

  const observationsPresent = allObservationIds.size > 0 || capturedMax > 0;
  const coreOut1Eligible = eligibleCaptures.length > 0 || outcomeFlagged.length > 0;
  const npsEvaluationPresent = establishedOutcomeRows.length > 0 || postPublicationEstablished.length > 0;
  const allInspections = reports.flatMap((item) => item.coreOut.inspections);
  const coreOut1LiveEvaluations = reports.reduce((sum, item) => sum + item.coreOut.assessmentCount, 0);
  const comparisonIncomplete = allInspections.filter((item) => item.assessmentStatus === "comparison-incomplete");
  const comparisonReady = allInspections.filter((item) => item.comparable === true || item.assessmentStatus === "comparison-ready");
  const baselinesPresent = allInspections.filter((item) => item.baselineValue != null);
  const observedDirectionLive = allInspections.filter((item) => item.actualObservedDirection != null);
  const numericTargetsLive = allInspections.filter((item) => item.expectedValue != null);
  const comparatorsLive = allInspections.filter((item) => item.expectedComparator != null);
  const shapeCounts = allInspections.reduce((counts: Record<string, number>, item) => {
    const hasB = item.baselineValue != null;
    const hasA = item.actualObservationId != null;
    const hasD = item.expectedDirection != null;
    const hasT = item.expectedValue != null && item.expectedComparator != null;
    const hasOD = item.actualObservedDirection != null;
    const shape = !hasB && hasA
      ? "missing-baseline"
      : hasB && !hasA
        ? "missing-actual"
        : hasB && hasA && hasD && hasOD
          ? "baseline+actual+direction+observedDirection"
          : hasB && hasA && hasOD
            ? "baseline+actual+observedDirection"
            : hasB && hasA && hasT
              ? "baseline+actual+numeric-target"
              : hasB && hasA && hasD
                ? "baseline+actual+expected-direction"
                : hasB && hasA
                  ? "baseline+actual"
                  : !hasA && !hasB
                    ? "missing-actual"
                    : "other";
    counts[shape] = (counts[shape] ?? 0) + 1;
    return counts;
  }, {});
  const incompatibleShape = allInspections.filter((item) => item.comparisonIncompatibility === "incompatible-evidence-shape");
  const baselineMissingReason = allInspections.filter((item) => item.comparisonIncompatibility === "baseline-missing");
  const coreOut2CandidateInspections = allInspections.filter((item) => item.learningCandidateCount > 0);
  const supportedLearningInspections = allInspections.filter((item) => item.learningStatuses.includes("supported"));
  const inconclusiveLearningInspections = allInspections.filter((item) => item.learningStatuses.includes("inconclusive"));
  const crossThreadLearning = allInspections.filter((item) =>
    item.learningExecutionIds.some((executionId) => executionId != null && item.executionId != null && executionId !== item.executionId),
  );
  const comparisonCase =
    comparisonReady.length > 0
      ? "COMPARISON_READY_EXERCISED"
      : observedDirectionLive.length === 0 && numericTargetsLive.length === 0 && baselinesPresent.length > 0
        ? "INSUFFICIENT_SHAPE"
        : "INSUFFICIENT_EXERCISED_EVIDENCE";
  const learningCase =
    comparisonReady.length === 0
      ? "NOT_GATED_COMPARISON_INCOMPLETE"
      : comparisonReady.length > 0 && supportedLearningInspections.length === 0 && coreOut2CandidateInspections.length === 0
        ? "CAPABILITY_GAP"
        : comparisonReady.length > 0 && supportedLearningInspections.length === 0
          ? "CORRECT_NO_LEARNING_OR_INSUFFICIENT"
          : "LEARNING_EXERCISED";
  const familyA = reports.find((item) => item.report.identity.journeyId === "sim-test-10-a_expected_positive");
  const familyACapacity = familyA?.coreOut.inspections.find((item) => item.subjectId === "obj-capacity") ?? null;
  const rdiIncrease = reports.filter((item) => item.rdi.capacity.observedDirection === "increase").length;
  const rdiDecrease = reports.filter((item) => item.rdi.capacity.observedDirection === "decrease").length;
  const rdiStable = reports.filter((item) => item.rdi.capacity.observedDirection === "stable").length;
  const rdiNull = reports.filter((item) => item.rdi.capacity.observedDirection == null).length;
  const coreIncrease = allInspections.filter((item) => item.actualObservedDirection === "increase").length;
  const coreDecrease = allInspections.filter((item) => item.actualObservedDirection === "decrease").length;
  const coreStable = allInspections.filter((item) => item.actualObservedDirection === "stable").length;
  const coreNull = allInspections.filter((item) => item.actualObservedDirection == null).length;
  const metResults = allInspections.filter((item) => item.comparisonResult === "met").length;
  const notMetResults = allInspections.filter((item) => item.comparisonResult === "not-met").length;
  const partialResults = allInspections.filter((item) => item.comparisonResult === "partially-met" || item.comparisonResult === "mixed").length;
  const promotionEligibleInspections = allInspections.filter((item) =>
    item.promotionEligibility.includes("promotion-eligible"),
  );
  const notPromotionEligible = allInspections.filter((item) =>
    item.promotionEligibility.includes("not-promotion-eligible"),
  );
  const reassessRows = allRows.filter((row) =>
    row.intent === "REASSESS" ||
    /is this still a problem|what should we reconsider|is this risk still relevant|does this decision still make sense/i.test(row.utterance),
  );
  const consumedReassessRows = reassessRows.filter((row) => row.consumedSupportedLearning === true);
  const clarificationReassessRows = reassessRows.filter((row) => /which (?:item|one) do you mean/i.test(row.response));
  const journeysWithSupportedAndReassess = reports.filter((item) => {
    const supported = item.coreOut.inspections.some((entry) => entry.learningStatuses.includes("supported"));
    const reassess = item.report.journeyObservations.some((row) =>
      row.intent === "REASSESS" || /is this still a problem|what should we reconsider/i.test(row.utterance),
    );
    return supported && reassess;
  });
  const learningConsumedOnReassess = reports.filter((item) =>
    item.report.journeyObservations.some((row) => row.consumedSupportedLearning === true),
  );
  const wrongSubjectConsumption = consumedReassessRows.filter((row) => {
    const focused = row.focusedSubjectId ?? "";
    const ids = row.coreOut2LearningIds ?? [];
    if (focused.startsWith("obj-") && focused !== "obj-capacity") {
      return ids.some((id) => id.includes("obj-capacity"));
    }
    return false;
  });
  const jLearningInformed = (() => {
    const j = reports.find((item) => item.report.identity.journeyId === "sim-test-10-j_reassessment");
    if (!j) return Object.freeze({ present: false, supported: false, consumed: false, clarification: false, liveLearningAnswer: null as string | null, coreOut2LearningIds: [] as readonly string[] });
    const supported = j.coreOut.inspections.some((entry) => entry.learningStatuses.includes("supported"));
    const clarification = jReassess.some((row) => /which (?:item|one) do you mean/i.test(row.response));
    const consumedRows = j.report.journeyObservations.filter((row) => row.consumedSupportedLearning === true);
    return Object.freeze({
      present: true,
      supported,
      consumed: consumedRows.length > 0,
      clarification,
      liveLearningAnswer: j.coreOut.liveLearningAnswer,
      coreOut2LearningIds: consumedRows.flatMap((row) => [...(row.coreOut2LearningIds ?? [])]),
      focusedOnReassess: jReassess.map((row) => ({ utterance: row.utterance, subject: row.subject })),
    });
  })();
  const kTrace = (() => {
    const k = reports.find((item) => item.report.identity.journeyId === "sim-test-10-k_learning_assumption");
    if (!k) return null;
    const reconsider = k.report.journeyObservations.find((row) => row.utterance === "What should we reconsider?");
    return Object.freeze({
      supported: k.coreOut.inspections.some((entry) => entry.learningStatuses.includes("supported")),
      utterance: reconsider?.utterance ?? null,
      focusedSubjectId: reconsider?.focusedSubjectId ?? null,
      consumedSupportedLearning: reconsider?.consumedSupportedLearning === true,
      coreOut2LearningIds: [...(reconsider?.coreOut2LearningIds ?? [])],
      ecaLearningStatement: reconsider?.ecaLearningStatement ?? null,
      laterIntents: k.report.journeyObservations.slice(
        (k.report.journeyObservations.findIndex((row) => row.utterance === "What should we reconsider?") + 1) || 0,
      ).map((row) => row.intent),
    });
  })();
  const analyzeContinuity = (item: (typeof reports)[number]) => {
    const rows = item.report.journeyObservations;
    const consumedIndex = rows.findIndex((row) => row.consumedSupportedLearning === true);
    const later = consumedIndex >= 0 ? rows.slice(consumedIndex + 1) : [];
    const scenarioWork = later.filter((row) => row.intent === "EXPLORE_OPTIONS");
    const decisionWork = later.filter((row) => row.intent === "COMMIT_DECISION");
    const executionWork = later.filter((row) => row.intent === "REQUEST_EXECUTION");
    const sessionSurvives = later.some((row) => Boolean(row.ecaLastLearningNote));
    const laterJudgmentConsumes = later.some((row) => row.consumedSupportedLearning === true);
    const decisionCarriesLearningId = later.some((row) =>
      JSON.stringify(row.decisionLedger ?? []).includes("learn:"),
    );
    const scenarioCarriesLearningId = later.some((row) =>
      JSON.stringify(row.scenarioLedger ?? []).includes("learn:"),
    );
    const attemptedNextCycle = scenarioWork.length + decisionWork.length + executionWork.length > 0;
    const canonicalContinuityProven =
      attemptedNextCycle && (decisionCarriesLearningId || scenarioCarriesLearningId);
    return Object.freeze({
      journeyId: item.report.identity.journeyId,
      consumedIndex,
      consumedLearningIds: consumedIndex >= 0 ? [...(rows[consumedIndex]?.coreOut2LearningIds ?? [])] : [],
      attemptedNextCycle,
      scenarioWorkAfter: scenarioWork.length,
      decisionsAfter: decisionWork.length,
      executionsAfter: executionWork.length,
      sessionNoteSurvives: sessionSurvives,
      laterJudgmentConsumes,
      decisionCarriesLearningId,
      scenarioCarriesLearningId,
      canonicalContinuityProven,
      temporalSequenceOnly: consumedIndex >= 0 && attemptedNextCycle && !canonicalContinuityProven,
    });
  };
  const continuity = reports.map(analyzeContinuity);
  const lLearningLinked = (() => {
    const l = reports.find((item) => item.report.identity.journeyId === "sim-test-10-l_loop_reentry");
    const analyzed = continuity.find((item) => item.journeyId === "sim-test-10-l_loop_reentry");
    if (!l) return Object.freeze({ attemptedNextCycle: false, supportedBeforeD2: false, learningLinkedReentry: false, maxDecisions: lMaxDecisions });
    const reassess = l.report.journeyObservations.find((row) => row.utterance === "Is this still a problem?");
    const goA = l.report.journeyObservations.find((row) => row.utterance === "Go with A.");
    return Object.freeze({
      attemptedNextCycle: lAttemptedNextCycle,
      supportedBeforeD2: l.coreOut.inspections.some((entry) => entry.learningStatuses.includes("supported")),
      reassessConsumed: reassess?.consumedSupportedLearning === true,
      reassessLearningIds: [...(reassess?.coreOut2LearningIds ?? [])],
      reassessFocused: reassess?.focusedSubjectId ?? null,
      d2DecisionCount: goA?.decisionLedger?.length ?? 0,
      learningLinkedReentry: analyzed?.canonicalContinuityProven === true,
      temporalSequenceOnly: analyzed?.temporalSequenceOnly === true,
      canonicalLearningToDecisionLinkage: analyzed?.decisionCarriesLearningId === true,
      sessionNoteSurvives: analyzed?.sessionNoteSurvives === true,
      maxDecisions: lMaxDecisions,
      liveLearningAnswer: l.coreOut.liveLearningAnswer,
    });
  })();
  const nextCycleProven = continuity.filter((item) => item.canonicalContinuityProven);
  const temporalOnlyLater = continuity.filter((item) => item.temporalSequenceOnly);
  const firstDivergentBoundary = !observationsPresent
    ? "Data Reality → Observation"
    : coreOut1LiveEvaluations === 0
      ? "Observation → Evaluation"
      : baselinesPresent.length === 0
        ? "Pre-E Data Reality → Baseline"
        : rdiIncrease + rdiDecrease + rdiStable === 0
          ? "RDI History → Observed Direction"
          : observedDirectionLive.length === 0
            ? "Observed Direction → CORE-OUT"
            : comparisonReady.length === 0
              ? "Evaluation → Comparison-ready"
              : supportedLearningInspections.length === 0
                ? "Comparison-ready → Supported Learning"
                : consumedReassessRows.length === 0
                  ? "Learning → Reassessment"
                  : nextCycleProven.length > 0
                    ? "complete"
                    : "Reassessment → Next Management Cycle";

  const materialIds = new Set([
    ...allReports.filter((report) => leakRows.some((row) => row.journeyId === report.identity.journeyId)).map((report) => report.identity.journeyId),
    "sim-test-10-e_delayed_outcome",
    "sim-test-10-h_multiple_outcome_chains",
    "sim-test-10-j_reassessment",
    "sim-test-10-k_learning_assumption",
    "sim-test-10-l_loop_reentry",
    "sim-test-10-a_expected_positive",
    "sim-test-10-g_competing_executions",
    "sim-test-10-f_external_confounder",
    "sim-test-10-c_negative_tradeoff",
  ]);
  const replays = [...materialIds].flatMap((journeyId) => {
    const source = allReports.find((item) => item.identity.journeyId === journeyId);
    const journey = population.find((item) => item.journeyId === journeyId);
    if (!source || !journey) return [];
    const replay = runNexoraSimulationTestJourney({ journey, runId: `sim10r6-${journey.journeyId}` });
    return [{ journeyId, first: source.deterministicSignature, second: replay.deterministicSignature, matched: source.deterministicSignature === replay.deterministicSignature }];
  });

  const fix1 = (() => {
    const journey: NexoraSimulationTestJourney = Object.freeze({
      journeyId: "sim-test-10-r6-fix1-blocker",
      version: "1.0",
      title: "FIX1 blocker R2",
      scenarioId: "manufacturing-capacity-pressure",
      scenarioVersion: "1.0",
      managerProfileId: "DECISION_ORIENTED_MANAGER",
      behaviorSeed: 11,
      conversationLength: "medium",
      startingMode: "WATCH",
      mode: "INGESTION",
      boundedDurationTicks: 29,
      turnBudget: 8,
      maxRepeatedClarificationAttempts: 3,
      maxUnresolvedLoops: 3,
      disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE",
      requiredCheckpoints: Object.freeze(["DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED", "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE", "DECISION_STATE", "EXECUTION_STATE"]),
      targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "CC10", "CC11"]),
      stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"]),
      steps: Object.freeze([
        { kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 },
        { kind: "MANAGER_TURN" as const, utterance: "Status.", managementIntent: "ORIENT" },
        { kind: "MANAGER_TURN" as const, utterance: "Capacity. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with B.", managementIntent: "COMMIT_DECISION", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Delivery. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with A.", managementIntent: "COMMIT_DECISION", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Start it.", managementIntent: "REQUEST_EXECUTION", intendedSubject: "Delivery" },
      ]),
    });
    const report = runNexoraSimulationTestJourney({ journey, runId: "sim10-r6-fix1" });
    const replay = runNexoraSimulationTestJourney({ journey, runId: "sim10-r6-fix1" });
    const capacityDecisionId = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";
    const start = report.journeyObservations.find((row) => row.utterance === "Start it.")!;
    const goWithB = report.journeyObservations.find((row) => row.utterance === "Go with B.")!;
    const final = report.journeyObservations.at(-1)!;
    return Object.freeze({
      signature: report.deterministicSignature,
      replayMatched: report.deterministicSignature === replay.deterministicSignature,
      capacityDecisionPresent: (goWithB.decisionLedger ?? []).some((item) => item.decisionId === capacityDecisionId),
      goWithBDecisions: goWithB.decisionLedger?.length ?? 0,
      startExecutions: start.executionLedger?.length ?? 0,
      wrongThreadCapacityExecutions: (final.executionLedger ?? []).filter((item) => item.decisionId === capacityDecisionId).length,
      executionCount: final.executionLedger?.length ?? 0,
      response: final.response,
    });
  })();

  const fix2 = (() => {
    let turn = speak(null, "Capacity. Details.", "fix2-1");
    turn = speak(turn, "Options.", "fix2-2");
    const capacityNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    turn = speak(turn, "Delivery. Details.", "fix2-3");
    turn = speak(turn, "Options.", "fix2-4");
    const deliveryNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    turn = speak(turn, "Revenue. Details.", "fix2-5");
    turn = speak(turn, "Options.", "fix2-6");
    const revenueNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    const staleCapacityUnder = (label: string, names: readonly string[]) =>
      !/capacity/i.test(label) && names.some((name) => /investigate capacity|no action on capacity/i.test(name));
    return Object.freeze({
      capacityNames,
      deliveryNames,
      revenueNames,
      staleCapacityUnderDelivery: staleCapacityUnder("Delivery", deliveryNames),
      staleCapacityUnderRevenue: staleCapacityUnder("Revenue", revenueNames),
    });
  })();

  const productionAfter = productionSnapshot();
  const records = reports.map((item) => {
    const report = item.report;
    const findings = uniqueFindings(report);
    const last = report.journeyObservations.at(-1);
    return {
      journeyId: report.identity.journeyId,
      family: familyOf(report.identity.journeyId),
      profileId: report.identity.managerProfileId,
      scenarioId: report.identity.scenarioId,
      seed: population.find((journey) => journey.journeyId === report.identity.journeyId)?.behaviorSeed ?? null,
      signature: report.deterministicSignature,
      harnessStatus: report.harnessStatus,
      stopReason: report.stopReason,
      turns: report.turns,
      ticks: report.ticks,
      adaptiveTrace: report.adaptiveTrace,
      maxDecisions: Math.max(0, ...report.journeyObservations.map((row) => row.decisionLedger?.length ?? 0)),
      maxExecutions: Math.max(0, ...report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)),
      maxCaptured: Math.max(0, ...report.journeyObservations.map((row) => row.capturedOutcomeObservationCount ?? 0), item.captures.length),
      captureSnapshot: item.captures,
      coreOut: item.coreOut,
      rdi: item.rdi,
      npsStatuses: [...new Set(report.journeyObservations.map((row) => row.npsOutcomeStatus).filter(Boolean))],
      learningStatuses: [...new Set(report.journeyObservations.map((row) => row.npsLearningStatus).filter(Boolean))],
      finalDecisionLedger: last?.decisionLedger ?? [],
      finalExecutionLedger: last?.executionLedger ?? [],
      findings: findings.map((finding) => ({
        classification: finding.classification,
        rawSeverity: finding.severity,
        owner: finding.likelyOwner,
        turn: finding.managerTurn,
      })),
    };
  });
  const rawFindings = records.flatMap((record) => record.findings.map((finding) => ({ journeyId: record.journeyId, family: record.family, ...finding })));
  const rawCounts = rawFindings.reduce((counts, finding) => {
    counts[finding.rawSeverity] += 1;
    return counts;
  }, { S0: 0, S1: 0, S2: 0, S3: 0 });
  const classificationCounts: Record<string, number> = {};
  for (const finding of rawFindings) classificationCounts[finding.classification] = (classificationCounts[finding.classification] ?? 0) + 1;

  const comparisonToReady = comparisonReady.length > 0 ? "PASS" : "FAIL";
  const rdiToDirection = rdiIncrease + rdiDecrease + rdiStable > 0 ? "PASS" : "FAIL";
  const directionToCoreOut = observedDirectionLive.length > 0 ? "PASS" : rdiToDirection === "PASS" ? "FAIL" : "NOT EXERCISED";
  const evaluationToLearning =
    comparisonReady.length === 0
      ? "NOT EXERCISED"
      : supportedLearningInspections.length > 0
        ? "PASS"
        : coreOut2CandidateInspections.length > 0
          ? "EXPECTED NO-LEARNING"
          : "FAIL";
  const learningToReassessment =
    supportedLearningInspections.length === 0
      ? "NOT EXERCISED"
      : learningConsumedOnReassess.length > 0
        ? "PASS"
        : journeysWithSupportedAndReassess.length > 0
          ? "FAIL"
          : "NOT EXERCISED";
  const reassessToNext =
    consumedReassessRows.length === 0
      ? "NOT EXERCISED"
      : nextCycleProven.length > 0
        ? "PASS"
        : temporalOnlyLater.length > 0 || lAttemptedNextCycle
          ? "FAIL"
          : "NOT EXERCISED";

  const boundary = {
    "Scenario → Decision": allDecisions.size > 0 ? "PASS" : "FAIL",
    "Decision → Execution": allExecutions.size > 0 ? "PASS" : "FAIL",
    "Execution → Publication": records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0) > 0 ? "PASS" : "FAIL",
    "Publication → Data Reality": records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0) > 0 ? "PASS" : "FAIL",
    "Pre-action Data → Baseline": baselinesPresent.length > 0 ? "PASS" : "FAIL",
    "Data Reality → Observation": observationsPresent ? "PASS" : "FAIL",
    "Observation → Evaluation": coreOut1LiveEvaluations > 0 ? "PASS" : observationsPresent ? "FAIL" : "NOT EXERCISED",
    "RDI History → Observed Direction": rdiToDirection,
    "Observed Direction → CORE-OUT": directionToCoreOut,
    "Evaluation → Comparison-ready": comparisonToReady,
    "Comparison-ready → Supported Learning": evaluationToLearning,
    "Learning → Durable Learning": supportedLearningInspections.length > 0 ? "OBSERVED" : "NOT EXERCISED",
    "Learning → Reassessment": learningToReassessment,
    "Reassessment → Next Management Cycle": reassessToNext,
  } as const;

  const r6Certified =
    allDecisions.size > 0 &&
    allExecutions.size > 0 &&
    observationsPresent &&
    coreOut1LiveEvaluations > 0 &&
    baselinesPresent.length > 0 &&
    comparisonReady.length > 0 &&
    supportedLearningInspections.length > 0 &&
    consumedReassessRows.length > 0 &&
    nextCycleProven.length > 0 &&
    wrongSubjectConsumption.length === 0 &&
    leakRows.length === 0 &&
    prematureClaims.length === 0 &&
    causalOverreach.length === 0 &&
    wrongExecutionBindings.length === 0 &&
    crossThreadLearning.length === 0 &&
    fix1.wrongThreadCapacityExecutions === 0 &&
    fix2.staleCapacityUnderDelivery === false &&
    productionBefore.digest === productionAfter.digest;

  const summary = {
    phase: "NPA-T SIM-TEST:10-R6",
    certificationMode: "MEASUREMENT_ONLY",
    certifiedBaseline: "COMMIT-LIVE:1 + OUT-LIVE:1 + OUT-EVAL-LIVE:1 + OUT-BASE:1 + RDI-DIR:1 + OUT-DIR:1-R2 + LEARN-REASSESS:1",
    status: {
      r6: r6Certified ? "CERTIFIED" : "NOT CERTIFIED",
      parent: r6Certified ? "CERTIFIED" : "NOT CERTIFIED",
    },
    firstDivergentBoundary,
    comparisonCase,
    learningCase,
    familyA: {
      journeyId: familyA?.report.identity.journeyId ?? null,
      rdi: familyA?.rdi.capacity ?? null,
      inspection: familyACapacity,
    },
    direction: {
      rdiIncrease,
      rdiDecrease,
      rdiStable,
      rdiNull,
      coreIncrease,
      coreDecrease,
      coreStable,
      coreNull,
    },
    comparisonResults: {
      met: metResults,
      notMet: notMetResults,
      partialOrMixed: partialResults,
    },
    learningInformedReassessment: {
      journeysWithSupportedAndReassess: journeysWithSupportedAndReassess.map((item) => item.report.identity.journeyId),
      consumedJourneys: learningConsumedOnReassess.map((item) => item.report.identity.journeyId),
      reassessAsks: reassessRows.length,
      consumedSupportedLearningTrue: consumedReassessRows.length,
      coreOut2LearningIdsPresent: consumedReassessRows.filter((row) => (row.coreOut2LearningIds ?? []).length > 0).length,
      clarifications: clarificationReassessRows.length,
      wrongSubjectConsumption: wrongSubjectConsumption.length,
      familyJ: jLearningInformed,
      familyK: kTrace,
    },
    nextCycle: {
      familyL: lLearningLinked,
      proven: nextCycleProven,
      temporalOnly: temporalOnlyLater,
    },
    continuity,
    observedDirectionDiscovery: {
      fieldExistsOnCoreOut1: true,
      liveCoreOut1AWriter: "toEvaluatorObservation projects projectPublishedKpiObservedDirection",
      livePopulationNonNull: observedDirectionLive.length,
    },
    architecture: {
      outcomeOwner: SIM_TEST_10_BOUNDARY.outcomeOwner,
      learningOwner: SIM_TEST_10_BOUNDARY.learningOwner,
      integrationSeam: "CC:5 synchronizeLiveCc5OutcomeEvaluation → MVP-OUT:1 integrate → CORE-OUT:1/2",
      coreOut1InvokedFromCc5: coreOut1LiveEvaluations > 0,
      npsWritesOutcome: NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome,
      npsWritesLearning: NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning,
      newOutcomeAuthority: "none",
      newLearningAuthority: "none",
      newComparisonAuthority: "none",
    },
    population: {
      journeys: allReports.length,
      coreFamilies: SIM_TEST_10_CORE_JOURNEYS.length,
      journeyFamilies: [...new Set(SIM_TEST_10_JOURNEYS.map((item) => item.r10Family))],
      scenarios: [...new Set(records.map((item) => item.scenarioId))],
      profiles: [...new Set(records.map((item) => item.profileId))],
      seeds: [...new Set(records.map((item) => item.seed).filter((item) => item != null))],
      managerTurns: records.reduce((sum, item) => sum + item.turns, 0),
      nexoraTurns: records.reduce((sum, item) => sum + item.turns, 0),
      longSessions: population.filter((item) => item.conversationLength === "long").length,
      adaptiveEvents: records.reduce((sum, item) => sum + (item.adaptiveTrace?.eventTraces ?? 0), 0),
      operatorPublications: records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0),
      unpublishedChanges: records.reduce((sum, item) => sum + (item.adaptiveTrace?.worldAdvances ?? 0), 0),
      unpublishedAsks: allRows.filter((row) => row.worldAdvancedUnpublished === true && (row.intent === "ASK_OUTCOME" || row.intent === "ASK_LEARNING")).length,
      prePublicationOutcomeAsks: allRows.filter((row) => row.intent === "ASK_OUTCOME" && row.worldAdvancedUnpublished === true).length,
      postPublicationAsks: allRows.filter((row) => row.worldAdvancedUnpublished !== true && row.intent === "ASK_OUTCOME" && (row.csvVersions?.some((csv) => csv.tick > 0) ?? false)).length,
      learningAsks: allRows.filter((row) => row.intent === "ASK_LEARNING").length,
      reassessmentAsks: allRows.filter((row) => row.intent === "REASSESS" || /is this still a problem/i.test(row.utterance)).length,
      loopReentryAttempts: (lCore?.journeyObservations ?? []).filter((row) => row.intent === "EXPLORE_OPTIONS" || row.intent === "COMMIT_DECISION").length,
      harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    },
    boundary,
    multiplicity: {
      distinctProblems: allProblems.size,
      distinctScenarioIds: allScenarios.size,
      distinctDecisions: allDecisions.size,
      maxDecisions: Math.max(0, ...records.map((item) => item.maxDecisions)),
      distinctExecutions: allExecutions.size,
      maxExecutions: Math.max(0, ...records.map((item) => item.maxExecutions)),
      hMaxExecutions: hMaxExec,
      distinctObservations: allObservationIds.size,
      baselinesPresent: baselinesPresent.length,
      capturedOutcomeObservationsMax: capturedMax,
      coreOut1LiveEvaluations,
      comparisonIncomplete: comparisonIncomplete.length,
      comparisonReady: comparisonReady.length,
      incompatibleEvidenceShape: incompatibleShape.length,
      baselineMissingReason: baselineMissingReason.length,
      numericTargetsLive: numericTargetsLive.length,
      comparatorsLive: comparatorsLive.length,
      observedDirectionLive: observedDirectionLive.length,
      eligibleEvaluations: eligibleCaptures.length,
      coreOut2CandidateInspections: coreOut2CandidateInspections.length,
      supportedLearning: supportedLearningInspections.length,
      inconclusiveLearning: inconclusiveLearningInspections.length,
      npsLearningRows: npsLearningRows.length,
      learningDurableRows: inventedDurable.length,
      outcomeInformedReassessments: outcomeInformedReassess.length,
    },
    evidenceShapes: shapeCounts,
    delayedFamilyE: eAsks,
    reassessmentFamilyJ: jReassess,
    loopFamilyL: { rows: lRows, ...lLearningLinked },
    chains,
    hExecutionBindings: [...new Set(hExecutionBindings)],
    wrongExecutionBindings,
    prematureOutcomeClaims: prematureClaims,
    causalOverreach,
    groundTruthLeakRows: leakRows,
    inventedDurableLearning: inventedDurable.length,
    npsWriterHits: npsWrites.length,
    crossThreadLearning,
    learningInspections: allInspections,
    fix1Replay: fix1,
    fix2Replay: fix2,
    rawFindings: { counts: rawCounts, classificationCounts },
    deterministicReplays: replays,
    regression: {
      suites: "run separately after population",
      level4FullRepository: false,
    },
    productionIntegrity: {
      before: productionBefore,
      after: productionAfter,
      productionChangesDuringR6: productionBefore.digest === productionAfter.digest ? 0 : 1,
    },
    records,
  };

  writeFileSync(new URL("population-run.json", ARTIFACT_DIRECTORY), JSON.stringify(summary, null, 2));
  writeFileSync(
    new URL("SOURCE-INTEGRITY-AFTER.md", ARTIFACT_DIRECTORY),
    `# R6 production digest after\n\n\`${productionAfter.digest}\`\nfiles: ${productionAfter.fileCount}\nchanges: ${productionBefore.digest === productionAfter.digest ? 0 : 1}\n`,
  );
  writeFileSync(
    new URL("TESTS-EXECUTED.md", ARTIFACT_DIRECTORY),
    `# TESTS-EXECUTED\n\n- SIM-TEST:10-R6 population (${summary.population.journeys} journeys)\n- Focused regression suites: see CERTIFICATION.md (run outside this file)\n- Level 4 / full repository: not run\n`,
  );

  assert.equal(SIM_TEST_10_CORE_JOURNEYS.length, 14);
  assert.equal(new Set(SIM_TEST_10_JOURNEYS.map((item) => item.r10Family)).size, 14);
  assert.equal(summary.population.harnessFailures, 0);
  assert.equal(productionBefore.digest, productionAfter.digest);
  assert.equal(replays.every((item) => item.matched), true);
  assert.equal(leakRows.length, 0);
  assert.equal(inventedDurable.length, 0);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesLearning, false);
  assert.equal(fix1.wrongThreadCapacityExecutions, 0);
  assert.equal(fix1.goWithBDecisions >= 1, true);
  assert.equal(fix2.staleCapacityUnderDelivery, false);
  assert.equal(fix2.staleCapacityUnderRevenue, false);
  assert.ok(allDecisions.size > 0, "upstream Decision > 0");
  assert.ok(allExecutions.size > 0, "upstream Execution > 0");
  assert.ok(observationsPresent, "upstream Observation > 0");
  assert.ok(coreOut1LiveEvaluations > 0, "upstream CORE-OUT:1 Evaluation > 0");
  assert.ok(baselinesPresent.length > 0, "OUT-BASE:1 Baseline > 0");
  assert.ok((eAsks.length ?? 0) >= 3);
  assert.equal(wrongSubjectConsumption.length, 0);
  assert.equal(crossThreadLearning.length, 0);
});
