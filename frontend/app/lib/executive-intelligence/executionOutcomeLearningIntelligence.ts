/**
 * EI:6 — Execution, Outcome & Learning Loop.
 * Comparison and learning eligibility only; domain truth stays with CC10R,
 * CC11, CC12, RDI/Data Reality, and APP-4.
 */
import type { NexoraCanonicalDecisionRecord } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraCanonicalExecution } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { NexoraExecutionFollowUpSnapshot } from "../conversational-control/executiveFollowUpSnapshot.ts";
import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import {
  createCanonicalDurableExecutiveMemory,
  persistDurableExecutiveMemory,
  retrieveRelevantDurableExecutiveMemory,
} from "../executiveMemory/durableExecutiveMemory.ts";
import type { ExecutiveMemoryRecord } from "../executiveMemory/executiveMemoryRecord.ts";
import type { ExecutiveMemoryStorageResult, ExecutiveMemoryStoredRecord } from "../executiveMemory/executiveMemoryStorageTypes.ts";
import type { RealityAssessmentEvidenceHandoff } from "./problemRiskOpportunityIntelligence.ts";
import type { DecisionRationaleHandoff, ExpectedOutcomePreparation } from "./executiveDecisionIntelligence.ts";

export const executionOutcomeLearningIntelligenceIdentity = "EI:6/ExecutionOutcomeLearningLoop" as const;
export const executionOutcomeLearningIntelligenceVersion = "1.0.0" as const;
export const executionOutcomeLearningIntelligenceNamespace = "nexora.executive-intelligence.execution-outcome-learning" as const;

export const EXECUTION_OUTCOME_LEARNING_BOUNDARY = Object.freeze({
  role: "outcome-comparison-and-learning-eligibility" as const,
  decisionAuthority: "CC:10R/CanonicalDecisionRuntime" as const,
  executionAuthority: "CC:11/CanonicalExecution" as const,
  operationalObservationAuthority: "CC:12/ExecutionFollowUp" as const,
  businessObservationAuthority: "RDI + P0:1/Data Reality" as const,
  comparisonAuthority: "EI:6/OutcomeEvaluation" as const,
  durableMemoryAuthority: "APP-4/ExecutiveMemoryStorageEngine" as const,
  ownsDecisionTruth: false as const,
  ownsExecutionTruth: false as const,
  ownsRealityTruth: false as const,
  ownsDurableMemory: false as const,
  infersCausality: false as const,
  rewritesDecisionTimeContext: false as const,
  executionCompletionMeansOutcomeSuccess: false as const,
  mutatesStage: false as const,
});

export const executionOutcomeLearningCapabilityMap = deepFreeze([
  { concept: "decision", authority: "CC:10R", status: "CANONICAL", role: "committed Decision truth" },
  { concept: "execution", authority: "CC:11", status: "CANONICAL", role: "execution identity and lifecycle" },
  { concept: "execution-observation", authority: "CC:12", status: "CANONICAL", role: "immutable operational follow-up; never business outcome proof" },
  { concept: "actual-business-outcome", authority: "RDI + Data Reality", status: "CANONICAL", role: "validated KPI observation and provenance" },
  { concept: "outcome-comparison", authority: "EI:6", status: "CANONICAL", role: "versioned expected-versus-actual evaluation" },
  { concept: "decision-memory-view", authority: "STAGE-PROD:5", status: "PRESENTATION_ONLY", role: "session projection; no durable memory authority" },
  { concept: "durable-learning", authority: "APP-4", status: "CANONICAL", role: "record construction, persistence, lifecycle, retrieval" },
] as const);

export const executionOutcomeLearningGapRegister = deepFreeze([
  { gapId: "EI6-GAP-001", subject: "Expected KPI identity convergence", status: "PARTIAL", resolution: "Explicit KPI reference is required; general DS-4/Data Reality identity convergence remains future work." },
  { gapId: "EI6-GAP-002", subject: "Multi-KPI and delayed outcomes", status: "PARTIAL", resolution: "Contract supports versioned observations; aggregation and delay policy remain future work." },
  { gapId: "EI6-GAP-003", subject: "Partial execution impact", status: "UNRESOLVED", resolution: "Execution status is retained separately; contribution is never inferred." },
  { gapId: "EI6-GAP-004", subject: "Causal attribution", status: "UNRESOLVED", resolution: "Requires explicit external causal authority and evidence." },
  { gapId: "EI6-GAP-005", subject: "Memory relevance ranking", status: "PARTIAL", resolution: "APP-4 bounded retrieval is reused; richer semantic ranking remains future work." },
  { gapId: "EI6-GAP-006", subject: "Problem/Opportunity feedback creation", status: "PARTIAL", resolution: "Unexpected effects become evidence/context candidates, never automatic classifications." },
] as const);

export type CertifiedExecutionReference = Readonly<{
  authorityId: string;
  decisionId: string;
  executionId: string;
  workspaceId: string;
  modelId: string | null;
  status: NexoraCanonicalExecution["status"];
}>;
export type ExecutionFollowUpObservation = Readonly<{
  snapshotId: string;
  executionId: string;
  decisionId: string;
  status: NexoraCanonicalExecution["status"];
  observedAt: string | null;
  authorityId: "CC:12/ExecutionFollowUp";
  source: "canonical-execution-runtime";
}>;
export type ExpectedOutcomeSnapshot = Readonly<{
  expectedOutcomeId: string;
  authorityId: "EI:5/ExpectedOutcomePreparation";
  decisionId: string;
  recommendationId: string;
  workspaceId: string;
  kpiId: string;
  comparator: "lt" | "lte" | "gt" | "gte" | "eq";
  targetValue: number;
  baselineValue: number | null;
  unit: string;
  expectedStatement: string;
  successCriteriaRefs: readonly string[];
  assumptionRefs: readonly string[];
  strategicContextRefs: readonly string[];
  timeHorizonRef: string | null;
  capturedAt: string;
  revision: number;
}>;
export type ActualOutcomeObservation = Readonly<{
  actualOutcomeId: string;
  expectedOutcomeId: string | null;
  authorityId: "RDI + P0:1/Data Reality";
  workspaceId: string;
  sourceId: string;
  sourceSnapshotId: string;
  datasetId: string;
  observationId: string;
  kpiId: string;
  value: number;
  unit: string;
  observedAt: string;
  validationStatus: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  provenanceRefs: readonly string[];
  unexpected: boolean;
  classification: "unresolved";
}>;
export type OutcomeComparisonStatus = "matched" | "partially-matched" | "missed" | "exceeded" | "unresolved";
export type CausalAssessment = Readonly<{
  temporalSequenceObserved: boolean;
  association: "consistent-with-expected-direction" | "inconsistent-with-expected-direction" | "unresolved";
  causalStatus: "supported" | "unknown";
  authorityId: string | null;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
}>;
export type OutcomeEvaluation = Readonly<{
  evaluationId: string;
  version: number;
  previousEvaluationId: string | null;
  decisionId: string;
  executionId: string;
  expectedOutcome: ExpectedOutcomeSnapshot;
  actualOutcome: ActualOutcomeObservation | null;
  executionObservation: ExecutionFollowUpObservation | null;
  executionStatus: NexoraCanonicalExecution["status"];
  expectedOutcomeRefs: readonly string[];
  actualOutcomeRefs: readonly string[];
  successCriteriaRefs: readonly string[];
  comparisonStatus: OutcomeComparisonStatus;
  matched: boolean;
  partiallyMatched: boolean;
  missed: boolean;
  exceeded: boolean;
  unresolved: boolean;
  variance: number | null;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  assumptionsAtDecisionTime: readonly string[];
  uncertaintyAtDecisionTime: readonly string[];
  unexpectedEffects: readonly ActualOutcomeObservation[];
  causalAssessment: CausalAssessment;
  evaluationTimestamp: string;
  historicalContextPreserved: true;
}>;

export type ClaimValidationStatus = "validated" | "partially-validated" | "invalidated" | "inconclusive" | "unexpected";
export type ClaimValidation = Readonly<{
  validationId: string;
  claimId: string;
  claimType: "ASSUMPTION" | "PREDICTION";
  status: ClaimValidationStatus;
  rationale: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  causalEstablished: false;
}>;
export type LearningCategory = "validated" | "partially_validated" | "invalidated" | "unexpected" | "inconclusive";
export type LearningTarget = "assumption" | "prediction" | "scenario-expectation" | "constraint" | "trade-off-expectation" | "decision-rationale" | "execution-hypothesis";
export type LearningCandidate = Readonly<{
  learningId: string;
  version: number;
  previousLearningId: string | null;
  workspaceId: string;
  category: LearningCategory;
  target: LearningTarget;
  targetRef: string;
  statement: string;
  decisionId: string;
  executionId: string;
  recommendationId: string;
  scenarioId: string;
  issueId: string;
  realityId: string;
  outcomeEvaluationId: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  provenanceRefs: readonly string[];
  uncertaintyRefs: readonly string[];
  causalClaim: false;
  source: "EI:6/OutcomeEvaluation";
  createdAt: string;
}>;
export type LearningEligibility = Readonly<{
  eligible: boolean;
  reasons: readonly string[];
  memoryAuthority: "APP-4";
}>;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return value;
}
function unique<T extends string>(values: readonly T[]): readonly T[] { return Object.freeze([...new Set(values)].sort()); }
function copyEvidence(refs: readonly NexoraExecutiveEvidenceReference[]): readonly NexoraExecutiveEvidenceReference[] { return Object.freeze(refs.map((ref) => Object.freeze({ ...ref }))); }

export function referenceCertifiedExecution(input: { readonly decision: NexoraCanonicalDecisionRecord; readonly execution: NexoraCanonicalExecution }): CertifiedExecutionReference {
  if (input.decision.status !== "Approved" || !input.decision.locked) throw new Error("ei6-canonical-committed-decision-required");
  if (input.execution.decisionId !== input.decision.decisionId || input.execution.createdFromDecision !== true) throw new Error("ei6-execution-decision-link-invalid");
  if (!input.execution.workspaceId || input.execution.workspaceId !== input.decision.workspaceId) throw new Error("ei6-execution-workspace-mismatch");
  return deepFreeze({ authorityId: "CC:11/CanonicalExecution", decisionId: input.decision.decisionId, executionId: input.execution.executionId, workspaceId: input.execution.workspaceId, modelId: input.execution.modelId, status: input.execution.status });
}

export function referenceExecutionFollowUpObservation(input: { readonly execution: CertifiedExecutionReference; readonly snapshot: NexoraExecutionFollowUpSnapshot }): ExecutionFollowUpObservation {
  if (input.snapshot.executionId !== input.execution.executionId || input.snapshot.decisionId !== input.execution.decisionId) throw new Error("ei6-follow-up-execution-link-invalid");
  if (input.snapshot.workspaceId !== input.execution.workspaceId || input.snapshot.source !== "canonical-execution-runtime") throw new Error("ei6-follow-up-authority-invalid");
  return deepFreeze({ snapshotId: input.snapshot.snapshotId, executionId: input.snapshot.executionId, decisionId: input.snapshot.decisionId, status: input.snapshot.status, observedAt: input.snapshot.observedAt, authorityId: "CC:12/ExecutionFollowUp", source: input.snapshot.source });
}

export function captureExpectedOutcomeAtDecision(input: {
  readonly preparation: ExpectedOutcomePreparation;
  readonly rationale: DecisionRationaleHandoff;
  readonly decision: NexoraCanonicalDecisionRecord;
  readonly expectedOutcomeId: string;
  readonly kpiId: string;
  readonly comparator: ExpectedOutcomeSnapshot["comparator"];
  readonly targetValue: number;
  readonly baselineValue?: number | null;
  readonly unit: string;
  readonly expectedStatement: string;
  readonly capturedAt: string;
}): ExpectedOutcomeSnapshot {
  if (input.decision.status !== "Approved" || input.decision.recommendationId !== input.preparation.recommendationId || input.rationale.recommendationId !== input.preparation.recommendationId) throw new Error("ei6-expected-outcome-committed-rationale-required");
  if (!input.preparation.kpiRefs.includes(input.kpiId)) throw new Error("ei6-expected-kpi-reference-required");
  return deepFreeze({ expectedOutcomeId: input.expectedOutcomeId, authorityId: "EI:5/ExpectedOutcomePreparation", decisionId: input.decision.decisionId, recommendationId: input.preparation.recommendationId, workspaceId: input.decision.workspaceId ?? "", kpiId: input.kpiId, comparator: input.comparator, targetValue: input.targetValue, baselineValue: input.baselineValue ?? null, unit: input.unit, expectedStatement: input.expectedStatement, successCriteriaRefs: [...input.preparation.successCriteriaRefs], assumptionRefs: [...input.preparation.assumptionRefs], strategicContextRefs: [...input.rationale.strategicContextRefs], timeHorizonRef: input.preparation.timeHorizonRef, capturedAt: input.capturedAt, revision: 1 });
}

export function observeActualOutcome(input: { readonly handoff: RealityAssessmentEvidenceHandoff; readonly actualOutcomeId: string; readonly expectedOutcomeId?: string | null; readonly kpiId: string; readonly unexpected?: boolean }): ActualOutcomeObservation {
  if (!input.handoff.validationAccepted) throw new Error("ei6-actual-outcome-validation-required");
  const fact = input.handoff.evidence.facts.find((item) => item.factKey === input.kpiId);
  if (!fact || typeof fact.factValue !== "number") throw new Error("ei6-actual-outcome-kpi-evidence-required");
  const provenance = input.handoff.evidenceProvenance[fact.evidenceId] ?? [];
  if (provenance.length === 0) throw new Error("ei6-actual-outcome-provenance-required");
  return deepFreeze({ actualOutcomeId: input.actualOutcomeId, expectedOutcomeId: input.expectedOutcomeId ?? null, authorityId: "RDI + P0:1/Data Reality", workspaceId: input.handoff.workspaceId, sourceId: input.handoff.sourceId, sourceSnapshotId: input.handoff.sourceSnapshotId, datasetId: input.handoff.datasetId, observationId: fact.evidenceId, kpiId: input.kpiId, value: fact.factValue, unit: "", observedAt: input.handoff.observedAt, validationStatus: input.handoff.validationState, evidenceRefs: copyEvidence([fact.source]), provenanceRefs: unique(provenance), unexpected: input.unexpected === true, classification: "unresolved" });
}

function targetMet(expected: ExpectedOutcomeSnapshot, actual: number): boolean {
  if (expected.comparator === "lt") return actual < expected.targetValue;
  if (expected.comparator === "lte") return actual <= expected.targetValue;
  if (expected.comparator === "gt") return actual > expected.targetValue;
  if (expected.comparator === "gte") return actual >= expected.targetValue;
  return actual === expected.targetValue;
}
function movedTowardTarget(expected: ExpectedOutcomeSnapshot, actual: number): boolean {
  if (expected.baselineValue == null) return false;
  return Math.abs(actual - expected.targetValue) < Math.abs(expected.baselineValue - expected.targetValue);
}
function exceededTarget(expected: ExpectedOutcomeSnapshot, actual: number): boolean {
  if (!targetMet(expected, actual)) return false;
  if (expected.comparator === "lt" || expected.comparator === "lte") return actual < expected.targetValue;
  if (expected.comparator === "gt" || expected.comparator === "gte") return actual > expected.targetValue;
  return false;
}

export function assessCausalRelationship(input: { readonly temporalSequenceObserved: boolean; readonly consistentWithExpectedDirection: boolean | null; readonly causalAuthorityId?: string | null; readonly causalEvidenceRefs?: readonly NexoraExecutiveEvidenceReference[] }): CausalAssessment {
  const evidence = input.causalEvidenceRefs ?? [];
  const supported = Boolean(input.causalAuthorityId && evidence.length > 0);
  return deepFreeze({ temporalSequenceObserved: input.temporalSequenceObserved, association: input.consistentWithExpectedDirection == null ? "unresolved" : input.consistentWithExpectedDirection ? "consistent-with-expected-direction" : "inconsistent-with-expected-direction", causalStatus: supported ? "supported" : "unknown", authorityId: supported ? input.causalAuthorityId! : null, evidenceRefs: copyEvidence(evidence) });
}

export function evaluateOutcome(input: { readonly evaluationId: string; readonly previousEvaluation?: OutcomeEvaluation | null; readonly execution: CertifiedExecutionReference; readonly executionObservation?: ExecutionFollowUpObservation | null; readonly expected: ExpectedOutcomeSnapshot; readonly actual?: ActualOutcomeObservation | null; readonly unexpectedEffects?: readonly ActualOutcomeObservation[]; readonly uncertaintyAtDecisionTime: readonly string[]; readonly evaluatedAt: string; readonly causalAuthorityId?: string | null; readonly causalEvidenceRefs?: readonly NexoraExecutiveEvidenceReference[] }): OutcomeEvaluation {
  if (input.execution.decisionId !== input.expected.decisionId || input.execution.workspaceId !== input.expected.workspaceId) throw new Error("ei6-outcome-scope-mismatch");
  if (input.executionObservation && (input.executionObservation.executionId !== input.execution.executionId || input.executionObservation.decisionId !== input.execution.decisionId)) throw new Error("ei6-outcome-follow-up-link-invalid");
  const actual = input.actual ?? null;
  if (actual && (actual.workspaceId !== input.expected.workspaceId || actual.expectedOutcomeId !== input.expected.expectedOutcomeId || actual.kpiId !== input.expected.kpiId)) throw new Error("ei6-actual-expected-identity-mismatch");
  const met = actual ? targetMet(input.expected, actual.value) : false;
  const moved = actual ? movedTowardTarget(input.expected, actual.value) : false;
  const status: OutcomeComparisonStatus = !actual ? "unresolved" : exceededTarget(input.expected, actual.value) ? "exceeded" : met ? "matched" : moved ? "partially-matched" : "missed";
  const causalAssessment = assessCausalRelationship({ temporalSequenceObserved: Boolean(actual), consistentWithExpectedDirection: actual ? moved || met : null, causalAuthorityId: input.causalAuthorityId, causalEvidenceRefs: input.causalEvidenceRefs });
  return deepFreeze({ evaluationId: input.evaluationId, version: (input.previousEvaluation?.version ?? 0) + 1, previousEvaluationId: input.previousEvaluation?.evaluationId ?? null, decisionId: input.execution.decisionId, executionId: input.execution.executionId, expectedOutcome: input.expected, actualOutcome: actual, executionObservation: input.executionObservation ?? null, executionStatus: input.execution.status, expectedOutcomeRefs: [input.expected.expectedOutcomeId], actualOutcomeRefs: actual ? [actual.actualOutcomeId] : [], successCriteriaRefs: [...input.expected.successCriteriaRefs], comparisonStatus: status, matched: status === "matched", partiallyMatched: status === "partially-matched", missed: status === "missed", exceeded: status === "exceeded", unresolved: status === "unresolved", variance: actual ? actual.value - input.expected.targetValue : null, evidenceRefs: copyEvidence(actual?.evidenceRefs ?? []), assumptionsAtDecisionTime: [...input.expected.assumptionRefs], uncertaintyAtDecisionTime: unique(input.uncertaintyAtDecisionTime), unexpectedEffects: [...(input.unexpectedEffects ?? [])], causalAssessment, evaluationTimestamp: input.evaluatedAt, historicalContextPreserved: true });
}

export function validateDecisionTimeClaim(input: { readonly validationId: string; readonly claimId: string; readonly claimType: "ASSUMPTION" | "PREDICTION"; readonly observation: "supports" | "partially-supports" | "contradicts" | "not-tested"; readonly rationale: string; readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[] }): ClaimValidation {
  const refs = input.evidenceRefs ?? [];
  if (input.observation !== "not-tested" && refs.length === 0) throw new Error("ei6-claim-validation-evidence-required");
  const status: ClaimValidationStatus = input.observation === "supports" ? "validated" : input.observation === "partially-supports" ? "partially-validated" : input.observation === "contradicts" ? "invalidated" : "inconclusive";
  return deepFreeze({ validationId: input.validationId, claimId: input.claimId, claimType: input.claimType, status, rationale: input.rationale, evidenceRefs: copyEvidence(refs), causalEstablished: false });
}

export function createLearningCandidate(input: { readonly learningId: string; readonly previousLearning?: LearningCandidate | null; readonly category: LearningCategory; readonly target: LearningTarget; readonly targetRef: string; readonly statement: string; readonly workspaceId: string; readonly decisionId: string; readonly executionId: string; readonly recommendationId: string; readonly scenarioId: string; readonly issueId: string; readonly realityId: string; readonly outcomeEvaluation: OutcomeEvaluation; readonly provenanceRefs: readonly string[]; readonly uncertaintyRefs: readonly string[]; readonly createdAt: string }): LearningCandidate {
  if (!input.statement.trim()) throw new Error("ei6-learning-statement-required");
  if (input.decisionId !== input.outcomeEvaluation.decisionId || input.executionId !== input.outcomeEvaluation.executionId) throw new Error("ei6-learning-outcome-link-invalid");
  return deepFreeze({ learningId: input.learningId, version: (input.previousLearning?.version ?? 0) + 1, previousLearningId: input.previousLearning?.learningId ?? null, workspaceId: input.workspaceId, category: input.category, target: input.target, targetRef: input.targetRef, statement: input.statement, decisionId: input.decisionId, executionId: input.executionId, recommendationId: input.recommendationId, scenarioId: input.scenarioId, issueId: input.issueId, realityId: input.realityId, outcomeEvaluationId: input.outcomeEvaluation.evaluationId, evidenceRefs: copyEvidence(input.outcomeEvaluation.evidenceRefs), provenanceRefs: unique(input.provenanceRefs), uncertaintyRefs: unique(input.uncertaintyRefs), causalClaim: false, source: "EI:6/OutcomeEvaluation", createdAt: input.createdAt });
}

export function evaluateLearningEligibility(input: { readonly candidate: LearningCandidate; readonly outcome: OutcomeEvaluation; readonly knownLearningIds?: readonly string[]; readonly sourcePresentationOnly?: boolean; readonly unsupportedCausalClaim?: boolean }): LearningEligibility {
  const reasons: string[] = [];
  if (!input.candidate.decisionId) reasons.push("canonical-decision-reference-missing");
  if (!input.candidate.executionId) reasons.push("execution-reference-missing");
  if (!input.outcome.actualOutcome || input.candidate.evidenceRefs.length === 0) reasons.push("actual-evidence-missing");
  if (input.candidate.provenanceRefs.length === 0) reasons.push("provenance-missing");
  if (!input.candidate.statement.trim()) reasons.push("learning-statement-missing");
  if (!input.candidate.workspaceId) reasons.push("workspace-scope-missing");
  if (input.candidate.decisionId !== input.outcome.decisionId || input.candidate.executionId !== input.outcome.executionId || input.candidate.outcomeEvaluationId !== input.outcome.evaluationId) reasons.push("outcome-link-mismatch");
  if (input.outcome.uncertaintyAtDecisionTime.length > 0 && input.candidate.uncertaintyRefs.length === 0) reasons.push("uncertainty-context-missing");
  if ((input.knownLearningIds ?? []).includes(input.candidate.learningId)) reasons.push("duplicate-learning");
  if (input.sourcePresentationOnly) reasons.push("presentation-only-source");
  if (input.unsupportedCausalClaim) reasons.push("unsupported-causal-claim");
  if (input.outcome.comparisonStatus === "unresolved") reasons.push("outcome-unresolved");
  return deepFreeze({ eligible: reasons.length === 0, reasons: unique(reasons), memoryAuthority: "APP-4" });
}

export type App4LearningPromotionResult = Readonly<{
  promoted: boolean;
  reason: string;
  record: ExecutiveMemoryRecord | null;
  stored: ExecutiveMemoryStoredRecord | null;
  authority: "APP-4";
}>;
export function promoteEligibleLearningToApp4(input: { readonly candidate: LearningCandidate; readonly outcome: OutcomeEvaluation; readonly eligibility: LearningEligibility; readonly owner: string }): App4LearningPromotionResult {
  if (!input.eligibility.eligible) return deepFreeze({ promoted: false, reason: input.eligibility.reasons.join(",") || "learning-ineligible", record: null, stored: null, authority: "APP-4" });
  const memoryInput = { id: input.candidate.learningId, workspaceId: input.candidate.workspaceId, kind: "learning" as const, title: `Learning from ${input.candidate.decisionId}`, summary: input.candidate.statement, narrative: `Expected-versus-actual evaluation ${input.candidate.outcomeEvaluationId}. Causal attribution remains ${input.outcome.causalAssessment.causalStatus}.`, status: input.candidate.category, source: "EI:6/OutcomeEvaluation", owner: input.owner, confidence: null, createdAt: input.candidate.createdAt, updatedAt: input.candidate.createdAt, subjectReferences: [{ type: "decision" as const, targetId: input.candidate.decisionId, label: "Canonical Decision" }, { type: "execution" as const, targetId: input.candidate.executionId, label: "Canonical Execution" }, { type: "outcome" as const, targetId: input.candidate.outcomeEvaluationId, label: "Outcome Evaluation" }, { type: "scenario" as const, targetId: input.candidate.scenarioId, label: "Scenario" }, { type: "problem" as const, targetId: input.candidate.issueId, label: "Issue" }, { type: "evidence" as const, targetId: input.candidate.realityId, label: "Observed Reality" }], provenance: input.candidate.provenanceRefs, outcome: { outcomeId: input.candidate.outcomeEvaluationId, description: `${input.outcome.comparisonStatus}: ${input.candidate.statement}`, achieved: input.outcome.comparisonStatus === "matched" || input.outcome.comparisonStatus === "exceeded" ? true : input.outcome.comparisonStatus === "missed" ? false : null, measuredAt: input.outcome.actualOutcome?.observedAt ?? null }, lesson: { lessonId: input.candidate.learningId, summary: input.candidate.statement, context: `Target ${input.candidate.target}: ${input.candidate.targetRef}` } };
  const record = createCanonicalDurableExecutiveMemory(memoryInput);
  const persisted: ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> = persistDurableExecutiveMemory(memoryInput);
  return deepFreeze({ promoted: persisted.success, reason: persisted.reason, record, stored: persisted.data, authority: "APP-4" });
}

export function retrieveRelevantLearningContext(input: { readonly workspaceId: string; readonly currentSubjectId: string; readonly relatedSubjectIds?: readonly string[]; readonly limit?: number }) {
  const memories = retrieveRelevantDurableExecutiveMemory(input).filter((stored) => stored.record.category === "learning");
  return deepFreeze({ workspaceId: input.workspaceId, subjectId: input.currentSubjectId, historicalContextOnly: true as const, currentTruthAuthority: false as const, memories: memories.map((stored) => ({ memoryId: stored.record.id, summary: stored.record.header.summary, validationStatus: stored.record.metadata.customMetadata.status ?? "unknown", confidence: stored.record.confidence?.level ?? "unknown", provenance: (stored.record.metadata.customMetadata.provenance ?? "").split("|").filter(Boolean), updatedAt: stored.record.updatedAt })) });
}

export function projectExecutiveDecisionReview(input: { readonly decision: NexoraCanonicalDecisionRecord; readonly execution: CertifiedExecutionReference; readonly outcome: OutcomeEvaluation; readonly validations: readonly ClaimValidation[]; readonly learning: LearningCandidate; readonly promotion?: App4LearningPromotionResult | null }) {
  return deepFreeze({ projectionOnly: true as const, authority: false as const, decisionId: input.decision.decisionId, decisionStatus: input.decision.status, executionId: input.execution.executionId, executionStatus: input.execution.status, expected: input.outcome.expectedOutcome.expectedStatement, actual: input.outcome.actualOutcome ? `${input.outcome.actualOutcome.value}${input.outcome.actualOutcome.unit}` : "Unresolved", outcome: input.outcome.comparisonStatus, validated: input.validations.filter((item) => item.status === "validated").map((item) => item.claimId), invalidated: input.validations.filter((item) => item.status === "invalidated").map((item) => item.claimId), inconclusive: input.validations.filter((item) => item.status === "inconclusive").map((item) => item.claimId), unexpected: input.outcome.unexpectedEffects.map((item) => item.actualOutcomeId), learning: input.learning.statement, causalAttribution: input.outcome.causalAssessment.causalStatus, remembered: input.promotion?.promoted === true, memoryId: input.promotion?.stored?.record.id ?? null });
}

export type ExecutiveLearningLoopTrace = Readonly<{
  traceId: string;
  strategyRefs: readonly string[];
  objectiveRefs: readonly string[];
  realityId: string;
  issueId: string;
  scenarioId: string;
  recommendationId: string;
  decisionId: string;
  executionId: string;
  expectedOutcomeId: string;
  actualOutcomeId: string;
  outcomeEvaluationId: string;
  learningId: string;
  memoryId: string | null;
  complete: boolean;
  valid: boolean;
  causalAttribution: "supported" | "unknown";
}>;
export function createExecutiveLearningLoopTrace(input: { readonly traceId: string; readonly rationale: DecisionRationaleHandoff; readonly decision: NexoraCanonicalDecisionRecord; readonly execution: CertifiedExecutionReference; readonly expected: ExpectedOutcomeSnapshot; readonly actual: ActualOutcomeObservation; readonly outcome: OutcomeEvaluation; readonly learning: LearningCandidate; readonly promotion?: App4LearningPromotionResult | null }): ExecutiveLearningLoopTrace {
  const valid = input.decision.decisionId === input.execution.decisionId && input.expected.decisionId === input.decision.decisionId && input.actual.expectedOutcomeId === input.expected.expectedOutcomeId && input.outcome.actualOutcome?.actualOutcomeId === input.actual.actualOutcomeId && input.learning.outcomeEvaluationId === input.outcome.evaluationId;
  const memoryId = input.promotion?.promoted ? input.promotion.stored?.record.id ?? null : null;
  return deepFreeze({ traceId: input.traceId, strategyRefs: input.rationale.strategicContextRefs.filter((ref) => ref.includes("strategy")), objectiveRefs: input.rationale.runtimeRationale.goalIds, realityId: input.learning.realityId, issueId: input.learning.issueId, scenarioId: input.learning.scenarioId, recommendationId: input.learning.recommendationId, decisionId: input.decision.decisionId, executionId: input.execution.executionId, expectedOutcomeId: input.expected.expectedOutcomeId, actualOutcomeId: input.actual.actualOutcomeId, outcomeEvaluationId: input.outcome.evaluationId, learningId: input.learning.learningId, memoryId, complete: valid && memoryId != null, valid, causalAttribution: input.outcome.causalAssessment.causalStatus });
}

export function projectLearningLoopForAdvisor(input: { readonly review: ReturnType<typeof projectExecutiveDecisionReview>; readonly retrieval: ReturnType<typeof retrieveRelevantLearningContext> }) {
  return deepFreeze({ factsOnly: true as const, authority: false as const, observed: input.review.actual, compared: input.review.outcome, learned: input.review.learning, inconclusive: input.review.inconclusive, remembered: input.review.remembered, relevantHistoricalLearning: input.retrieval.memories, historicalMemoryIsCurrentTruth: false as const });
}

export const executionOutcomeLearningStageCompatibility = deepFreeze({ projectionOnly: true, outcomeAuthority: false, learningAuthority: false, memoryAuthority: false, visualSequenceImpliesCausality: false, existingTopologyPreserved: true, fixedCameraPreserved: true, zPlane: 0 });

export function certifyExecutionOutcomeLearningLoop(trace: ExecutiveLearningLoopTrace) {
  const authorityPreserved = !EXECUTION_OUTCOME_LEARNING_BOUNDARY.ownsExecutionTruth && !EXECUTION_OUTCOME_LEARNING_BOUNDARY.ownsDurableMemory;
  const causalRestraint = trace.causalAttribution === "unknown";
  const fullTrace = trace.complete && trace.valid && trace.memoryId === trace.learningId;
  return deepFreeze({ certified: authorityPreserved && causalRestraint && fullTrace, authorityPreserved, causalRestraint, fullTrace, checks: [`authority:${authorityPreserved ? "passed" : "failed"}`, `causality:${causalRestraint ? "passed" : "failed"}`, `trace:${fullTrace ? "passed" : "failed"}`] });
}
