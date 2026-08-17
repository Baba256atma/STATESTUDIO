import assert from "node:assert/strict";
import test from "node:test";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectExecutionFollowUpSnapshot } from "../conversational-control/executiveFollowUpSnapshot.ts";
import { initializeExecutiveMemoryStorageEngine, resetExecutiveMemoryStorageEngineForTests } from "../executiveMemory/executiveMemoryStorageEngine.ts";
import type { RealityAssessmentEvidenceHandoff } from "./problemRiskOpportunityIntelligence.ts";
import type { DecisionRationaleHandoff, ExpectedOutcomePreparation } from "./executiveDecisionIntelligence.ts";
import {
  EXECUTION_OUTCOME_LEARNING_BOUNDARY,
  assessCausalRelationship,
  captureExpectedOutcomeAtDecision,
  certifyExecutionOutcomeLearningLoop,
  createExecutiveLearningLoopTrace,
  createLearningCandidate,
  evaluateLearningEligibility,
  evaluateOutcome,
  executionOutcomeLearningCapabilityMap,
  executionOutcomeLearningGapRegister,
  executionOutcomeLearningStageCompatibility,
  observeActualOutcome,
  projectExecutiveDecisionReview,
  projectLearningLoopForAdvisor,
  promoteEligibleLearningToApp4,
  referenceCertifiedExecution,
  referenceExecutionFollowUpObservation,
  retrieveRelevantLearningContext,
  validateDecisionTimeClaim,
} from "./executionOutcomeLearningIntelligence.ts";

const workspaceId = "workspace-ei6";
const modelId = "model-ei6";
const observedAt = "2026-11-17T12:00:00.000Z";
const decisionAt = "2026-08-17T12:00:00.000Z";
const evidence = Object.freeze({ sourceKind: "data-reality" as const, sourceId: "github-live", subjectId: "obj-capacity", factKey: "kpi-capacity" });

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value); return Object.isFrozen(value) && Object.values(value).every((child) => deeplyFrozen(child, seen));
}
function handoff(kpiId = "kpi-capacity", value = 84, id = "capacity"): RealityAssessmentEvidenceHandoff {
  const evidenceId = `ei3:dataset-${id}:${kpiId}`;
  const reality = Object.freeze({ stage: "reality" as const, authorityId: "P0:1/NexoraDataRealityFoundation", recordId: `dataset-${id}`, workspaceId, subjectIds: Object.freeze([`obj-${id}`]), evidenceRefs: Object.freeze([Object.freeze({ ...evidence, subjectId: `obj-${id}`, factKey: kpiId, observedAt, confidence: 0.98, confidenceState: "verified" })]), provenanceRefs: Object.freeze([`github-live:record:${id}`]), observedAt, uncertaintyRefs: Object.freeze([]), sourceSnapshotId: `snapshot-${id}`, datasetId: `dataset-${id}` });
  return Object.freeze({ handoffId: `ei3:snapshot-${id}:dataset-${id}`, sourceId: "github-live", sourceSnapshotId: `snapshot-${id}`, datasetId: `dataset-${id}`, mappingId: `mapping-${id}`, workspaceId, observedAt, validationState: "valid", validationAccepted: true, reality, evidence: Object.freeze({ facts: Object.freeze([Object.freeze({ evidenceId, subjectId: `obj-${id}`, subjectLabel: id, attention: "important" as const, status: "risk" as const, factKey: kpiId, factValue: value, freshness: "current" as const, source: Object.freeze({ ...evidence, subjectId: `obj-${id}`, factKey: kpiId }) })]), relationships: Object.freeze([]), scopeSubjectIds: Object.freeze([`obj-${id}`]) }), evidenceProvenance: Object.freeze({ [evidenceId]: Object.freeze([`github-live:record:${id}:${kpiId}`]) }) });
}

function fixture() {
  const recommendationId = "ei5:recommendation:capacity";
  const scenarioId = "cc9:scenario:optimize";
  const issueId = "issue-capacity";
  const decisionRuntime = createNexoraCanonicalDecisionRuntime();
  const runtimeRationale = Object.freeze({ summary: "Manager approved capacity optimization.", goalIds: Object.freeze(["objective-readiness"]), problemIds: Object.freeze([issueId]), recommendationId, scenarioId, evidenceRefs: Object.freeze([evidence]), uncertaintyRefs: Object.freeze(["assumption-resources", "prediction-capacity", "unknown-demand"]) });
  const approved = decisionRuntime.adapter.transitionDecision({ decisionId: "cc10:decision:capacity", action: "approve", title: "Optimize Capacity", subjectIds: ["obj-capacity"], scenarioId, scenarioRevision: 1, recommendationId, rationale: runtimeRationale, evidenceRefs: [evidence], uncertaintyRefs: runtimeRationale.uncertaintyRefs, workspaceId, modelId, committedAt: decisionAt });
  assert.equal(approved.status, "applied");
  const decision = approved.decision!;
  const executionRuntime = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisionRuntime.adapter });
  const created = executionRuntime.createExecution({ decisionId: decision.decisionId, workspaceId, modelId });
  const executionId = created.execution!.executionId;
  executionRuntime.transitionExecution({ executionId, action: "prepare" });
  executionRuntime.transitionExecution({ executionId, action: "start" });
  executionRuntime.transitionExecution({ executionId, action: "complete" });
  const execution = executionRuntime.getExecution(executionId)!;
  const executionRef = referenceCertifiedExecution({ decision, execution });
  const followUp = projectExecutionFollowUpSnapshot({ runtime: executionRuntime, executionId, observedAt })!;
  const executionObservation = referenceExecutionFollowUpObservation({ execution: executionRef, snapshot: followUp });
  const preparation: ExpectedOutcomePreparation = Object.freeze({ preparationId: `ei5:expected:${recommendationId}`, recommendationId, expectedOutcomeRefs: Object.freeze(["expected:capacity-below-80"]), successCriteriaRefs: Object.freeze(["success:capacity-below-80"]), kpiRefs: Object.freeze(["kpi-capacity"]), timeHorizonRef: "90:day", assumptionRefs: Object.freeze(["assumption-resources"]), validationAuthority: "EI:6", validated: false });
  const rationale: DecisionRationaleHandoff = Object.freeze({ rationaleId: `ei5:rationale:${recommendationId}`, recommendationId, issueId, selectedScenarioId: scenarioId, consideredScenarioIds: Object.freeze(["cc9:scenario:expand", scenarioId, "cc9:scenario:baseline"]), strategicContextRefs: Object.freeze(["strategy-resilience", "objective-readiness"]), evidenceRefs: Object.freeze([evidence]), assumptionRefs: Object.freeze(["assumption-resources"]), predictionRefs: Object.freeze(["prediction-capacity"]), unknownRefs: Object.freeze(["unknown-demand"]), tradeoffRefs: Object.freeze(["tradeoff-optimize"]), constraintRefs: Object.freeze(["constraint-budget"]), conflictingEvidence: Object.freeze(["Optimization upside may be limited."]), runtimeRationale, expectedOutcomePreparation: preparation });
  const expected = captureExpectedOutcomeAtDecision({ preparation, rationale, decision, expectedOutcomeId: "expected-capacity-80", kpiId: "kpi-capacity", comparator: "lte", targetValue: 80, baselineValue: 88, unit: "%", expectedStatement: "Capacity utilization will fall to 80% or below within 90 days.", capturedAt: decisionAt });
  const actualHandoff = handoff();
  const actual = observeActualOutcome({ handoff: actualHandoff, actualOutcomeId: "actual-capacity-84", expectedOutcomeId: expected.expectedOutcomeId, kpiId: expected.kpiId });
  const unexpected = observeActualOutcome({ handoff: handoff("kpi-response-time", 120, "customer"), actualOutcomeId: "unexpected-response-time", kpiId: "kpi-response-time", unexpected: true });
  const outcome = evaluateOutcome({ evaluationId: "outcome-evaluation-v1", execution: executionRef, executionObservation, expected, actual, unexpectedEffects: [unexpected], uncertaintyAtDecisionTime: runtimeRationale.uncertaintyRefs, evaluatedAt: observedAt });
  const assumptionValidation = validateDecisionTimeClaim({ validationId: "validate-assumption", claimId: "assumption-resources", claimType: "ASSUMPTION", observation: "partially-supports", rationale: "Optimization completed but required more effort than expected.", evidenceRefs: actual.evidenceRefs });
  const predictionValidation = validateDecisionTimeClaim({ validationId: "validate-prediction", claimId: "prediction-capacity", claimType: "PREDICTION", observation: "partially-supports", rationale: "Capacity moved downward but remained above target.", evidenceRefs: actual.evidenceRefs });
  const learning = createLearningCandidate({ learningId: "learning-capacity-v1", category: "partially_validated", target: "scenario-expectation", targetRef: expected.expectedOutcomeId, statement: "Capacity optimization reduced pressure, but the expected impact magnitude was too optimistic.", workspaceId, decisionId: decision.decisionId, executionId, recommendationId, scenarioId, issueId, realityId: actual.datasetId, outcomeEvaluation: outcome, provenanceRefs: actual.provenanceRefs, uncertaintyRefs: runtimeRationale.uncertaintyRefs, createdAt: observedAt });
  const eligibility = evaluateLearningEligibility({ candidate: learning, outcome });
  return { decisionRuntime, decision, executionRuntime, execution, executionRef, followUp, executionObservation, preparation, rationale, expected, actualHandoff, actual, unexpected, outcome, assumptionValidation, predictionValidation, learning, eligibility };
}

test.beforeEach(() => { resetExecutiveMemoryStorageEngineForTests(); initializeExecutiveMemoryStorageEngine(observedAt, "in_memory"); });

test("A. only a canonical committed Decision can enter the execution/outcome chain", () => {
  const runtime = createNexoraCanonicalDecisionRuntime();
  const pending = runtime.adapter.transitionDecision({ decisionId: "pending", action: "create", title: "Pending", workspaceId, modelId }).decision!;
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: runtime.adapter });
  assert.equal(executions.createExecution({ decisionId: pending.decisionId, workspaceId, modelId }).status, "not-eligible");
  assert.throws(() => referenceCertifiedExecution({ decision: pending, execution: fixture().execution }), /committed-decision/);
});
test("B. expected outcome remains immutable after observation", () => {
  const value = fixture(); const before = JSON.stringify(value.expected);
  evaluateOutcome({ evaluationId: "repeat", execution: value.executionRef, expected: value.expected, actual: value.actual, uncertaintyAtDecisionTime: [], evaluatedAt: observedAt });
  assert.equal(JSON.stringify(value.expected), before); assert.equal(value.expected.capturedAt, decisionAt);
});
test("C. factual Actual Outcome requires validation and provenance", () => {
  const value = fixture(); assert.equal(value.actual.authorityId, "RDI + P0:1/Data Reality"); assert.ok(value.actual.provenanceRefs.length > 0);
  const invalid = Object.freeze({ ...value.actualHandoff, evidenceProvenance: Object.freeze({}) });
  assert.throws(() => observeActualOutcome({ handoff: invalid, actualOutcomeId: "bad", kpiId: "kpi-capacity" }), /provenance/);
});
test("D. completed execution does not imply successful business outcome", () => {
  const value = fixture(); assert.equal(value.execution.status, "completed"); assert.equal(value.outcome.executionObservation?.authorityId, "CC:12/ExecutionFollowUp"); assert.equal(value.outcome.comparisonStatus, "partially-matched"); assert.equal(EXECUTION_OUTCOME_LEARNING_BOUNDARY.executionCompletionMeansOutcomeSuccess, false);
});
test("E. expected 80 versus actual 84 from baseline 88 is partially matched", () => {
  const value = fixture(); assert.equal(value.outcome.variance, 4); assert.equal(value.outcome.comparisonStatus, "partially-matched"); assert.equal(value.outcome.partiallyMatched, true); assert.deepEqual(value.outcome.actualOutcomeRefs, [value.actual.actualOutcomeId]);
});
test("F. absent actual evidence remains unresolved and later evidence creates a new version", () => {
  const value = fixture(); const unresolved = evaluateOutcome({ evaluationId: "outcome-v0", execution: value.executionRef, expected: value.expected, uncertaintyAtDecisionTime: [], evaluatedAt: "2026-10-01" });
  const reevaluated = evaluateOutcome({ evaluationId: "outcome-v1", previousEvaluation: unresolved, execution: value.executionRef, expected: value.expected, actual: value.actual, uncertaintyAtDecisionTime: [], evaluatedAt: observedAt });
  assert.equal(unresolved.comparisonStatus, "unresolved"); assert.equal(reevaluated.version, 2); assert.equal(reevaluated.previousEvaluationId, unresolved.evaluationId); assert.equal(unresolved.actualOutcome, null);
});
test("G. assumptions can be validated, invalidated, or inconclusive only with appropriate evidence", () => {
  const value = fixture();
  const validated = validateDecisionTimeClaim({ validationId: "v", claimId: "a", claimType: "ASSUMPTION", observation: "supports", rationale: "Observed support.", evidenceRefs: value.actual.evidenceRefs });
  const invalidated = validateDecisionTimeClaim({ validationId: "i", claimId: "a", claimType: "ASSUMPTION", observation: "contradicts", rationale: "Observed contradiction.", evidenceRefs: value.actual.evidenceRefs });
  const inconclusive = validateDecisionTimeClaim({ validationId: "u", claimId: "a", claimType: "ASSUMPTION", observation: "not-tested", rationale: "Not tested." });
  assert.deepEqual([validated.status, invalidated.status, inconclusive.status], ["validated", "invalidated", "inconclusive"]);
});
test("H. prediction validation never converts the original prediction into Reality", () => {
  const value = fixture(); assert.equal(value.predictionValidation.claimType, "PREDICTION"); assert.equal(value.predictionValidation.status, "partially-validated"); assert.equal(value.predictionValidation.causalEstablished, false);
});
test("I. temporal association does not establish causality", () => {
  const value = fixture(); assert.equal(value.outcome.causalAssessment.temporalSequenceObserved, true); assert.equal(value.outcome.causalAssessment.association, "consistent-with-expected-direction"); assert.equal(value.outcome.causalAssessment.causalStatus, "unknown");
  assert.equal(assessCausalRelationship({ temporalSequenceObserved: true, consistentWithExpectedDirection: true }).causalStatus, "unknown");
});
test("J. unexpected effects remain explicit and unclassified", () => {
  const value = fixture(); assert.equal(value.outcome.unexpectedEffects[0].unexpected, true); assert.equal(value.outcome.unexpectedEffects[0].classification, "unresolved");
});
test("K. unsupported, duplicate, presentation-only, or causal learning cannot be promoted", () => {
  const value = fixture();
  const gate = evaluateLearningEligibility({ candidate: value.learning, outcome: value.outcome, knownLearningIds: [value.learning.learningId], sourcePresentationOnly: true, unsupportedCausalClaim: true });
  const promotion = promoteEligibleLearningToApp4({ candidate: value.learning, outcome: value.outcome, eligibility: gate, owner: "manager" });
  assert.equal(gate.eligible, false); assert.equal(promotion.promoted, false); assert.equal(promotion.record, null);
});
test("L. APP-4 remains the only durable memory authority", () => {
  const value = fixture(); const promotion = promoteEligibleLearningToApp4({ candidate: value.learning, outcome: value.outcome, eligibility: value.eligibility, owner: "manager" });
  assert.equal(value.eligibility.memoryAuthority, "APP-4"); assert.equal(promotion.authority, "APP-4"); assert.equal(promotion.promoted, true); assert.equal(EXECUTION_OUTCOME_LEARNING_BOUNDARY.ownsDurableMemory, false);
});
test("M. promoted learning reconstructs to Decision, Scenario, Issue, and Reality", () => {
  const value = fixture(); const promotion = promoteEligibleLearningToApp4({ candidate: value.learning, outcome: value.outcome, eligibility: value.eligibility, owner: "manager" });
  const trace = createExecutiveLearningLoopTrace({ traceId: "loop", rationale: value.rationale, decision: value.decision, execution: value.executionRef, expected: value.expected, actual: value.actual, outcome: value.outcome, learning: value.learning, promotion });
  assert.equal(trace.valid, true); assert.equal(trace.complete, true); assert.equal(trace.issueId, value.rationale.issueId); assert.equal(trace.realityId, value.actual.datasetId); assert.equal(certifyExecutionOutcomeLearningLoop(trace).certified, true);
});
test("N. future retrieval supplies relevant historical context without becoming current truth", () => {
  const value = fixture(); promoteEligibleLearningToApp4({ candidate: value.learning, outcome: value.outcome, eligibility: value.eligibility, owner: "manager" });
  const retrieval = retrieveRelevantLearningContext({ workspaceId, currentSubjectId: value.decision.decisionId, relatedSubjectIds: [value.rationale.issueId] });
  assert.equal(retrieval.memories[0].memoryId, value.learning.learningId); assert.equal(retrieval.historicalContextOnly, true); assert.equal(retrieval.currentTruthAuthority, false);
});
test("O. hindsight cannot rewrite original Decision rationale or expectation", () => {
  const value = fixture(); const rationaleBefore = JSON.stringify(value.decision.rationale); const expectedBefore = JSON.stringify(value.expected);
  createLearningCandidate({ learningId: "learning-v2", previousLearning: value.learning, category: "validated", target: "prediction", targetRef: "prediction-capacity", statement: "Later evidence strengthened the directional finding.", workspaceId, decisionId: value.decision.decisionId, executionId: value.execution.executionId, recommendationId: value.rationale.recommendationId, scenarioId: value.rationale.selectedScenarioId, issueId: value.rationale.issueId, realityId: value.actual.datasetId, outcomeEvaluation: value.outcome, provenanceRefs: value.actual.provenanceRefs, uncertaintyRefs: [], createdAt: "2026-12-01" });
  assert.equal(JSON.stringify(value.decision.rationale), rationaleBefore); assert.equal(JSON.stringify(value.expected), expectedBefore);
});
test("P. EI:1 authority boundaries remain intact", () => { assert.equal(EXECUTION_OUTCOME_LEARNING_BOUNDARY.decisionAuthority, "CC:10R/CanonicalDecisionRuntime"); });
test("Q. EI:2 strategic references survive the full rationale", () => { const value = fixture(); assert.ok(value.rationale.strategicContextRefs.includes("objective-readiness")); });
test("R. EI:3 assumption/prediction/unknown references remain distinct", () => { const value = fixture(); assert.deepEqual(value.rationale.assumptionRefs, ["assumption-resources"]); assert.deepEqual(value.rationale.predictionRefs, ["prediction-capacity"]); assert.deepEqual(value.rationale.unknownRefs, ["unknown-demand"]); });
test("S. EI:4 scenario and trade-off references remain intact", () => { const value = fixture(); assert.equal(value.rationale.selectedScenarioId, "cc9:scenario:optimize"); assert.deepEqual(value.rationale.tradeoffRefs, ["tradeoff-optimize"]); });
test("T. EI:5 recommendation/commitment stays canonical and review/Advisor/Stage remain projections", () => {
  const value = fixture(); const promotion = promoteEligibleLearningToApp4({ candidate: value.learning, outcome: value.outcome, eligibility: value.eligibility, owner: "manager" });
  const review = projectExecutiveDecisionReview({ decision: value.decision, execution: value.executionRef, outcome: value.outcome, validations: [value.assumptionValidation, value.predictionValidation], learning: value.learning, promotion });
  const retrieval = retrieveRelevantLearningContext({ workspaceId, currentSubjectId: value.decision.decisionId }); const advisor = projectLearningLoopForAdvisor({ review, retrieval });
  assert.equal(value.decision.status, "Approved"); assert.equal(review.projectionOnly, true); assert.equal(advisor.historicalMemoryIsCurrentTruth, false); assert.equal(executionOutcomeLearningStageCompatibility.visualSequenceImpliesCausality, false); assert.equal(deeplyFrozen(executionOutcomeLearningCapabilityMap), true); assert.equal(deeplyFrozen(executionOutcomeLearningGapRegister), true);
});
