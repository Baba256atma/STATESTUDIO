/**
 * EI:1 — reference-only integration across Nexora's existing authorities.
 *
 * This module owns neither domain truth nor persistence. It records immutable
 * references, verifies identity continuity, and prepares (but never persists)
 * an APP-4 learning record when the required evidence already exists.
 */
import type { NexoraDataRealitySnapshot } from "../data-reality/dataRealityContracts.ts";
import type { NexoraDataRealityHandoff } from "../data-reality/realDataIntegrationFoundation.ts";
import type { NexoraExecutiveAssessmentIssue } from "../conversational-control/executiveAssessment.ts";
import type { NexoraExecutiveScenario } from "../conversational-control/executiveScenarioDefinition.ts";
import type { NexoraDecisionRuntimeAdapter } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraExecutionRuntimeAdapter } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  createCanonicalDurableExecutiveMemory,
  type DurableExecutiveMemoryWriteInput,
} from "../executiveMemory/durableExecutiveMemory.ts";
import type { ExecutiveMemoryRecord } from "../executiveMemory/executiveMemoryRecord.ts";

export const executiveIntelligenceIntegrationIdentity =
  "EI:1/ExecutiveIntelligenceEndToEndIntegration" as const;
export const executiveIntelligenceIntegrationVersion = "1.0.0" as const;
export const executiveIntelligenceIntegrationNamespace =
  "nexora.executive-intelligence.integration" as const;

export const EXECUTIVE_INTELLIGENCE_BOUNDARY = Object.freeze({
  role: "reference-only-integration-spine" as const,
  ownsReality: false as const,
  ownsIssues: false as const,
  ownsScenarios: false as const,
  ownsDecisions: false as const,
  ownsExecutions: false as const,
  ownsOutcomes: false as const,
  ownsLearning: false as const,
  ownsMemory: false as const,
  persistsMemory: false as const,
  advisorAuthority: false as const,
  stageAuthority: false as const,
});

export type ExecutiveIntelligenceTransitionStatus =
  | "CONNECTED"
  | "PARTIAL"
  | "MISSING"
  | "DUPLICATED"
  | "PRESENTATION_ONLY"
  | "UNVERIFIED";

export type ExecutiveIntelligenceStage =
  | "reality"
  | "issue"
  | "scenario"
  | "decision"
  | "execution"
  | "outcome"
  | "learning"
  | "memory";

export type ExecutiveIntelligenceCapability = Readonly<{
  stage: ExecutiveIntelligenceStage;
  authority: string;
  implementation: readonly string[];
  inputs: readonly string[];
  outputs: readonly string[];
}>;

export const executiveIntelligenceCapabilityMap: readonly ExecutiveIntelligenceCapability[] =
  deepFreeze([
    { stage: "reality", authority: "RDI:1 + P0:1/Data Reality", implementation: ["data-reality/realDataIntegrationFoundation", "data-reality/dataRealityFoundation"], inputs: ["external source snapshot", "mapping", "KPI definitions"], outputs: ["validated provenance", "data-reality KPI", "executive state"] },
    { stage: "issue", authority: "CC:8 assessment (transient); DS-6 risk (persisted)", implementation: ["conversational-control/executiveRecommendationResolver", "risk/workspaceRiskContract", "risk/workspaceRiskDetectionEngine"], inputs: ["canonical evidence pack", "workspace KPI/OKR health"], outputs: ["assessment issue/opportunity", "workspace risk"] },
    { stage: "scenario", authority: "CC:9 Scenario Conversation", implementation: ["conversational-control/executiveScenarioDefinition", "conversational-control/executiveScenarioEvaluation", "conversational-control/executiveScenarioComparison"], inputs: ["executive context", "problem reference", "assumptions", "interventions"], outputs: ["versioned scenario", "evaluation", "comparison"] },
    { stage: "decision", authority: "CC:10R Canonical Decision Runtime", implementation: ["conversational-control/executiveDecisionRuntimeAdapter", "conversational-control/executiveDecisionCommitmentResolver"], inputs: ["manager commitment", "scenario/recommendation candidate"], outputs: ["canonical committed decision"] },
    { stage: "execution", authority: "CC:11 canonical Execution port / EXS1 store", implementation: ["conversational-control/executiveExecutionRuntimeAdapter", "conversational-control/executiveExecutionFollowUp"], inputs: ["approved canonical decision"], outputs: ["decision-linked execution"] },
    { stage: "outcome", authority: "CC:12 observation; APP-4 historical outcome", implementation: ["conversational-control/executiveFollowUpSnapshot", "conversational-control/executiveFollowUpChange", "executiveMemory/executiveDecisionMemoryTypes"], inputs: ["canonical execution snapshots", "explicit outcome evidence"], outputs: ["non-causal execution change", "expected/actual outcome records"] },
    { stage: "learning", authority: "APP-4 Durable Executive Memory", implementation: ["executiveMemory/durableExecutiveMemory", "executiveMemory/executiveMemoryEvidence"], inputs: ["evidence-backed expected/actual comparison", "explicit lesson"], outputs: ["durable learning record"] },
    { stage: "memory", authority: "APP-4 Executive Memory Storage/Retrieval", implementation: ["executiveMemory/executiveMemoryStorageEngine", "executiveMemory/durableExecutiveMemory"], inputs: ["validated canonical memory record"], outputs: ["retrievable historical context"] },
  ] as const);

export type ExecutiveIntelligenceTransition = Readonly<{
  from: ExecutiveIntelligenceStage;
  to: ExecutiveIntelligenceStage;
  status: ExecutiveIntelligenceTransitionStatus;
  evidence: string;
}>;

export const executiveIntelligenceTransitionMap: readonly ExecutiveIntelligenceTransition[] =
  deepFreeze([
    { from: "reality", to: "issue", status: "PARTIAL", evidence: "CC:8 derives issues from evidence, but the live MVP bridge projects catalog/runtime facts and does not preserve the RDI provenance chain." },
    { from: "issue", to: "scenario", status: "PARTIAL", evidence: "CC:9 preserves currentProblem and recommendation IDs; no direct typed assessment-issue handoff exists." },
    { from: "scenario", to: "decision", status: "CONNECTED", evidence: "CC:10 candidate/commitment preserves scenarioId and scenarioRevision through the canonical Decision Runtime." },
    { from: "decision", to: "execution", status: "CONNECTED", evidence: "CC:11 creates/reuses execution only from an approved decision and preserves decisionId." },
    { from: "execution", to: "outcome", status: "PARTIAL", evidence: "CC:12 observes immutable execution snapshots and changes, but has no business expected-outcome contract." },
    { from: "outcome", to: "learning", status: "MISSING", evidence: "No production authority compares expected and actual business outcomes into a learning record." },
    { from: "learning", to: "memory", status: "PARTIAL", evidence: "APP-4 can validate/store learning, but no automatic evidence-gated promotion handoff exists." },
  ] as const);

export type ExecutiveIntelligenceGap = Readonly<{
  gapId: string;
  transition: string;
  currentState: string;
  expectedState: string;
  rootCause: string;
  owner: string;
  requiredIntegration: string;
  severity: "medium" | "high" | "critical";
  phase: "EI:2" | "EI:3" | "EI:4" | "EI:5" | "EI:6";
}>;

export const executiveIntelligenceGapRegister: readonly ExecutiveIntelligenceGap[] =
  deepFreeze([
    { gapId: "EI1-GAP-001", transition: "Reality → Issue", currentState: "CC:8 issue framing consumes projected runtime/catalog facts.", expectedState: "Validated RDI/Data Reality evidence reaches issue framing with provenance intact.", rootCause: "No canonical RDI-to-CC:8 evidence adapter.", owner: "Problem/Risk/Opportunity Intelligence", requiredIntegration: "Map active Data Reality KPI/state and RDI provenance into CC:8 evidence references.", severity: "critical", phase: "EI:3" },
    { gapId: "EI1-GAP-002", transition: "Issue → Scenario", currentState: "Context can carry a problem ID; assessment issue identity is not a first-class scenario handoff.", expectedState: "Scenario retains the originating issue reference and evidence.", rootCause: "CC:9 accepts context and recommendation IDs, not an assessment-issue contract.", owner: "Problem/Risk/Opportunity + Scenario Intelligence", requiredIntegration: "Add an authority-preserving issue reference to the CC:9 boundary.", severity: "high", phase: "EI:4" },
    { gapId: "EI1-GAP-003", transition: "Execution → Outcome", currentState: "Execution status/progress changes are observable; expected business outcome is absent.", expectedState: "Expected and actual outcomes link to execution without conflation.", rootCause: "CC:12 is operational follow-up, not a business outcome authority.", owner: "Execution/Outcome/Learning", requiredIntegration: "Connect explicit expected outcome from the committed decision and actual measured outcome evidence.", severity: "critical", phase: "EI:6" },
    { gapId: "EI1-GAP-004", transition: "Outcome → Learning", currentState: "APP-4 types can store outcomes and lessons, but no comparison authority exists.", expectedState: "Evidence-backed comparison yields an explicit learning candidate.", rootCause: "No expected-versus-actual learning policy/runtime.", owner: "Execution/Outcome/Learning", requiredIntegration: "Define comparison and learning eligibility without causal invention.", severity: "critical", phase: "EI:6" },
    { gapId: "EI1-GAP-005", transition: "Learning → APP-4", currentState: "Callers can write APP-4 records directly.", expectedState: "Only eligible, provenance-complete learning reaches APP-4 persistence.", rootCause: "No shared promotion boundary; persistence itself is already canonical.", owner: "Execution/Outcome/Learning", requiredIntegration: "Use a non-automatic eligibility gate and delegate record creation/persistence to APP-4.", severity: "high", phase: "EI:6" },
    { gapId: "EI1-GAP-006", transition: "Issue authority", currentState: "CC:8 assessments, DS-6 detected risks, DS-6 risks, and legacy risk registries coexist.", expectedState: "Each risk/issue kind has one declared authority and explicit adapters.", rootCause: "Capabilities were built in separate product phases.", owner: "Problem/Risk/Opportunity Intelligence", requiredIntegration: "Reconcile authority roles; do not merge stores in EI:1.", severity: "high", phase: "EI:3" },
    { gapId: "EI1-GAP-007", transition: "Integrated chain orchestration", currentState: "The legacy EIP registry orchestrator is disconnected from CC:9–12 and RDI.", expectedState: "One live chain uses specialized authorities.", rootCause: "EIP-1 predates the current runtime chain and operates on registry snapshots.", owner: "Executive Decision Intelligence", requiredIntegration: "Treat legacy EIP as registry presentation/orchestration, not a second live authority.", severity: "medium", phase: "EI:5" },
  ] as const);

export type ExecutiveEvidenceReference = Readonly<{
  sourceKind: string;
  sourceId: string;
  subjectId: string | null;
  factKey: string | null;
  observedAt: string | null;
  confidence: number | null;
  confidenceState: string | null;
}>;

type BaseReference = Readonly<{
  stage: ExecutiveIntelligenceStage;
  authorityId: string;
  recordId: string;
  workspaceId: string;
  subjectIds: readonly string[];
  evidenceRefs: readonly ExecutiveEvidenceReference[];
  provenanceRefs: readonly string[];
  observedAt: string | null;
  uncertaintyRefs: readonly string[];
}>;

export type ExecutiveRealityReference = BaseReference & Readonly<{
  stage: "reality";
  sourceSnapshotId: string;
  datasetId: string;
}>;
export type ExecutiveIssueReference = BaseReference & Readonly<{
  stage: "issue";
  issueKind: "problem" | "risk" | "opportunity";
}>;
export type ExecutiveScenarioReference = BaseReference & Readonly<{
  stage: "scenario";
  revision: number;
}>;
export type ExecutiveDecisionReference = BaseReference & Readonly<{
  stage: "decision";
  scenarioId: string | null;
  status: string;
}>;
export type ExecutiveExecutionReference = BaseReference & Readonly<{
  stage: "execution";
  decisionId: string;
  status: string;
}>;
export type ExecutiveOutcomeMeasurementReference = Readonly<{
  outcomeId: string;
  kind: "expected" | "actual";
  summary: string;
  observedAt: string | null;
  evidenceRefs: readonly ExecutiveEvidenceReference[];
}>;
export type ExecutiveOutcomeReference = BaseReference & Readonly<{
  stage: "outcome";
  executionId: string;
  expected: ExecutiveOutcomeMeasurementReference | null;
  actual: ExecutiveOutcomeMeasurementReference | null;
  causeEstablished: false;
}>;
export type ExecutiveLearningReference = BaseReference & Readonly<{
  stage: "learning";
  expectedOutcomeId: string;
  actualOutcomeId: string;
  memoryId: string;
}>;
export type ExecutiveMemoryReference = BaseReference & Readonly<{
  stage: "memory";
  learningId: string;
  category: "learning";
}>;

export type ExecutiveIntelligenceTrace = Readonly<{
  traceId: string;
  workspaceId: string;
  reality: ExecutiveRealityReference | null;
  issue: ExecutiveIssueReference | null;
  scenario: ExecutiveScenarioReference | null;
  decision: ExecutiveDecisionReference | null;
  execution: ExecutiveExecutionReference | null;
  outcome: ExecutiveOutcomeReference | null;
  learning: ExecutiveLearningReference | null;
  memory: ExecutiveMemoryReference | null;
  links: readonly Readonly<{ from: ExecutiveIntelligenceStage; to: ExecutiveIntelligenceStage; status: "connected" | "unresolved"; reason: string }>[];
  complete: boolean;
  valid: boolean;
  issues: readonly string[];
}>;

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function evidenceRef(input: Partial<ExecutiveEvidenceReference> & Pick<ExecutiveEvidenceReference, "sourceKind" | "sourceId">): ExecutiveEvidenceReference {
  return Object.freeze({ sourceKind: input.sourceKind, sourceId: input.sourceId, subjectId: input.subjectId ?? null, factKey: input.factKey ?? null, observedAt: input.observedAt ?? null, confidence: input.confidence ?? null, confidenceState: input.confidenceState ?? null });
}

export function referenceExecutiveReality(input: {
  readonly handoff: NexoraDataRealityHandoff;
  readonly snapshot: NexoraDataRealitySnapshot;
}): ExecutiveRealityReference {
  if (input.handoff.dataset.id !== input.snapshot.datasetId) throw new Error("ei-reality-dataset-mismatch");
  const evidenceRefs = input.handoff.factProvenance.map((entry) => evidenceRef({ sourceKind: "data-reality", sourceId: entry.provenance.sourceId, subjectId: input.snapshot.objectStates.find((state) => state.objectKey === entry.objectKey)?.nexoraObjectId ?? entry.objectKey, factKey: entry.metricKey, observedAt: entry.provenance.observedAt, confidence: entry.provenance.confidence, confidenceState: entry.provenance.confidenceState }));
  return deepFreeze({ stage: "reality", authorityId: "P0:1/NexoraDataRealityFoundation", recordId: input.snapshot.datasetId, workspaceId: input.handoff.workspaceId, subjectIds: unique(input.snapshot.objectStates.map((state) => state.nexoraObjectId)), evidenceRefs, provenanceRefs: unique(input.handoff.factProvenance.map((entry) => `${entry.provenance.sourceId}:${entry.provenance.sourceRecordId ?? "record"}:${entry.provenance.sourceFieldKey ?? entry.metricKey}`)), observedAt: input.snapshot.createdAt, uncertaintyRefs: [], sourceSnapshotId: input.handoff.sourceSnapshotId, datasetId: input.snapshot.datasetId });
}

export function referenceExecutiveIssue(input: {
  readonly issue: NexoraExecutiveAssessmentIssue;
  readonly workspaceId: string;
  readonly observedAt: string | null;
  readonly issueKind?: "problem" | "risk" | "opportunity";
}): ExecutiveIssueReference {
  const refs = input.issue.evidenceRefs.map((ref) => evidenceRef({ sourceKind: ref.sourceKind, sourceId: ref.sourceId, subjectId: ref.subjectId ?? input.issue.subjectId, factKey: ref.factKey ?? null, observedAt: input.observedAt }));
  return deepFreeze({ stage: "issue", authorityId: "CC:8/ExecutiveAssessment", recordId: input.issue.issueId, workspaceId: input.workspaceId, subjectIds: [input.issue.subjectId], evidenceRefs: refs, provenanceRefs: unique(refs.map((ref) => `${ref.sourceKind}:${ref.sourceId}`)), observedAt: input.observedAt, uncertaintyRefs: [], issueKind: input.issueKind ?? "problem" });
}

export function referenceExecutiveScenario(input: { readonly scenario: NexoraExecutiveScenario; readonly workspaceId: string }): ExecutiveScenarioReference {
  return deepFreeze({ stage: "scenario", authorityId: "CC:9/ScenarioConversation", recordId: input.scenario.scenarioId, workspaceId: input.workspaceId, subjectIds: unique(input.scenario.subjectIds), evidenceRefs: input.scenario.assumptions.filter((item) => item.evidenceSource).map((item) => evidenceRef({ sourceKind: "scenario-assumption", sourceId: item.evidenceSource!, subjectId: item.subjectId ?? null, factKey: item.metricKey ?? item.key })), provenanceRefs: unique(input.scenario.assumptions.map((item) => item.evidenceSource).filter((item): item is string => Boolean(item))), observedAt: null, uncertaintyRefs: [], revision: input.scenario.revision });
}

export function referenceCanonicalDecision(input: { readonly runtime: NexoraDecisionRuntimeAdapter; readonly decisionId: string }): ExecutiveDecisionReference | null {
  const decision = input.runtime.getDecision(input.decisionId);
  if (!decision) return null;
  return deepFreeze({ stage: "decision", authorityId: input.runtime.authorityId, recordId: decision.decisionId, workspaceId: decision.workspaceId ?? "", subjectIds: unique(decision.subjectIds), evidenceRefs: decision.evidenceRefs.map((ref) => evidenceRef({ sourceKind: ref.sourceKind, sourceId: ref.sourceId, subjectId: ref.subjectId ?? null, factKey: ref.factKey ?? null })), provenanceRefs: unique(decision.evidenceRefs.map((ref) => `${ref.sourceKind}:${ref.sourceId}`)), observedAt: decision.committedAt ?? null, uncertaintyRefs: unique(decision.uncertaintyRefs), scenarioId: decision.scenarioId ?? null, status: decision.status });
}

export function referenceCanonicalExecution(input: { readonly runtime: NexoraExecutionRuntimeAdapter; readonly executionId: string; readonly subjectIds: readonly string[]; readonly observedAt?: string | null }): ExecutiveExecutionReference | null {
  const execution = input.runtime.getExecution(input.executionId);
  if (!execution) return null;
  return deepFreeze({ stage: "execution", authorityId: input.runtime.authorityId, recordId: execution.executionId, workspaceId: execution.workspaceId ?? "", subjectIds: unique(input.subjectIds), evidenceRefs: [], provenanceRefs: [`decision:${execution.decisionId}`], observedAt: input.observedAt ?? null, uncertaintyRefs: [], decisionId: execution.decisionId, status: execution.status });
}

export function referenceExecutiveOutcome(input: {
  readonly outcomeId: string;
  readonly workspaceId: string;
  readonly executionId: string;
  readonly subjectIds: readonly string[];
  readonly authorityId: "CC:12/ExecutionFollowUp" | "APP-4:7/ExecutiveDecisionMemory";
  readonly expected: ExecutiveOutcomeMeasurementReference | null;
  readonly actual: ExecutiveOutcomeMeasurementReference | null;
}): ExecutiveOutcomeReference {
  return deepFreeze({ stage: "outcome", authorityId: input.authorityId, recordId: input.outcomeId, workspaceId: input.workspaceId, subjectIds: unique(input.subjectIds), evidenceRefs: [...(input.expected?.evidenceRefs ?? []), ...(input.actual?.evidenceRefs ?? [])], provenanceRefs: unique([...(input.expected?.evidenceRefs ?? []), ...(input.actual?.evidenceRefs ?? [])].map((ref) => `${ref.sourceKind}:${ref.sourceId}`)), observedAt: input.actual?.observedAt ?? null, uncertaintyRefs: [], executionId: input.executionId, expected: input.expected, actual: input.actual, causeEstablished: false });
}

export type ExecutiveLearningPromotionResult = Readonly<{
  eligible: boolean;
  record: ExecutiveMemoryRecord | null;
  learning: ExecutiveLearningReference | null;
  memory: ExecutiveMemoryReference | null;
  reasons: readonly string[];
}>;

export function prepareExecutiveLearningPromotion(input: {
  readonly outcome: ExecutiveOutcomeReference;
  readonly memoryId: string;
  readonly lessonId: string;
  readonly lessonSummary: string;
  readonly lessonContext: string;
  readonly decisionId: string;
  readonly owner: string;
  readonly confidence: number | null;
  readonly timestamp: string;
}): ExecutiveLearningPromotionResult {
  const reasons: string[] = [];
  if (!input.outcome.expected) reasons.push("expected-outcome-missing");
  if (!input.outcome.actual) reasons.push("actual-outcome-missing");
  if (input.outcome.expected?.evidenceRefs.length === 0) reasons.push("expected-outcome-evidence-missing");
  if (input.outcome.actual?.evidenceRefs.length === 0) reasons.push("actual-outcome-evidence-missing");
  if (!input.outcome.actual?.observedAt) reasons.push("actual-outcome-observation-time-missing");
  if (!input.lessonSummary.trim()) reasons.push("learning-summary-missing");
  if (reasons.length > 0) return deepFreeze({ eligible: false, record: null, learning: null, memory: null, reasons });

  const expected = input.outcome.expected!;
  const actual = input.outcome.actual!;
  const provenance = unique(input.outcome.provenanceRefs);
  const memoryInput: DurableExecutiveMemoryWriteInput = {
    id: input.memoryId, workspaceId: input.outcome.workspaceId, kind: "learning", title: `Learning from ${input.outcome.recordId}`,
    summary: input.lessonSummary, narrative: input.lessonContext, status: "active", source: executiveIntelligenceIntegrationIdentity,
    owner: input.owner, confidence: input.confidence, createdAt: input.timestamp, updatedAt: input.timestamp,
    subjectReferences: [
      { type: "decision", targetId: input.decisionId, label: input.decisionId },
      { type: "execution", targetId: input.outcome.executionId, label: input.outcome.executionId },
      { type: "outcome", targetId: input.outcome.recordId, label: input.outcome.recordId },
    ],
    provenance,
    outcome: { outcomeId: actual.outcomeId, description: actual.summary, achieved: null, measuredAt: actual.observedAt },
    lesson: { lessonId: input.lessonId, summary: input.lessonSummary, context: input.lessonContext },
  };
  const record = createCanonicalDurableExecutiveMemory(memoryInput);
  const common = { workspaceId: input.outcome.workspaceId, subjectIds: input.outcome.subjectIds, evidenceRefs: [...expected.evidenceRefs, ...actual.evidenceRefs], provenanceRefs: provenance, observedAt: actual.observedAt, uncertaintyRefs: [] };
  const learning: ExecutiveLearningReference = deepFreeze({ ...common, stage: "learning", authorityId: "APP-4/DurableExecutiveMemory", recordId: input.lessonId, expectedOutcomeId: expected.outcomeId, actualOutcomeId: actual.outcomeId, memoryId: record.id });
  const memory: ExecutiveMemoryReference = deepFreeze({ ...common, stage: "memory", authorityId: "APP-4/ExecutiveMemoryStorageEngine", recordId: record.id, learningId: input.lessonId, category: "learning" });
  return deepFreeze({ eligible: true, record, learning, memory, reasons: ["app4-record-created-not-persisted", "expected-and-actual-distinct", "provenance-complete"] });
}

const STAGES: readonly ExecutiveIntelligenceStage[] = Object.freeze(["reality", "issue", "scenario", "decision", "execution", "outcome", "learning", "memory"]);

export function createExecutiveIntelligenceTrace(input: Omit<ExecutiveIntelligenceTrace, "links" | "complete" | "valid" | "issues">): ExecutiveIntelligenceTrace {
  const refs = STAGES.map((stage) => input[stage]);
  const issues: string[] = [];
  for (const ref of refs) if (ref && ref.workspaceId !== input.workspaceId) issues.push(`workspace-mismatch:${ref.stage}`);
  const continuity = (left: BaseReference | null, right: BaseReference | null) => !left || !right || left.subjectIds.length === 0 || right.subjectIds.length === 0 || left.subjectIds.some((id) => right.subjectIds.includes(id));
  if (!continuity(input.reality, input.issue)) issues.push("identity-discontinuity:reality-issue");
  if (!continuity(input.issue, input.scenario)) issues.push("identity-discontinuity:issue-scenario");
  if (input.scenario && input.decision?.scenarioId !== input.scenario.recordId) issues.push("identity-discontinuity:scenario-decision");
  if (input.decision && input.execution?.decisionId !== input.decision.recordId) issues.push("identity-discontinuity:decision-execution");
  if (input.execution && input.outcome?.executionId !== input.execution.recordId) issues.push("identity-discontinuity:execution-outcome");
  if (input.outcome && input.learning && (input.learning.expectedOutcomeId !== input.outcome.expected?.outcomeId || input.learning.actualOutcomeId !== input.outcome.actual?.outcomeId)) issues.push("identity-discontinuity:outcome-learning");
  if (input.learning && input.memory?.learningId !== input.learning.recordId) issues.push("identity-discontinuity:learning-memory");
  for (const ref of refs) if (ref && (ref.stage === "reality" || ref.stage === "issue" || ref.stage === "outcome" || ref.stage === "learning") && ref.evidenceRefs.length === 0) issues.push(`evidence-missing:${ref.stage}`);
  const links = STAGES.slice(0, -1).map((stage, index) => {
    const next = STAGES[index + 1];
    const left = input[stage]; const right = input[next];
    return Object.freeze({ from: stage, to: next, status: left && right ? "connected" as const : "unresolved" as const, reason: left && right ? "adjacent-references-present" : `missing-${left ? next : stage}-reference` });
  });
  const complete = refs.every(Boolean) && links.every((link) => link.status === "connected");
  return deepFreeze({ ...input, links, complete, valid: issues.length === 0, issues: unique(issues) });
}

export type ExecutiveIntelligenceAdvisorProjection = Readonly<{
  traceId: string;
  factsOnly: true;
  authority: false;
  answers: Readonly<Record<"whatIsHappening" | "whyAttention" | "options" | "decision" | "execution" | "outcome" | "learning", Readonly<{ status: "supported" | "unresolved"; referenceIds: readonly string[] }>>>;
}>;

export function projectExecutiveIntelligenceForAdvisor(trace: ExecutiveIntelligenceTrace): ExecutiveIntelligenceAdvisorProjection {
  const answer = (...refs: readonly (BaseReference | null)[]) => Object.freeze({ status: refs.every(Boolean) ? "supported" as const : "unresolved" as const, referenceIds: Object.freeze(refs.filter((ref): ref is BaseReference => Boolean(ref)).map((ref) => ref.recordId)) });
  return deepFreeze({ traceId: trace.traceId, factsOnly: true, authority: false, answers: { whatIsHappening: answer(trace.reality), whyAttention: answer(trace.reality, trace.issue), options: answer(trace.scenario), decision: answer(trace.decision), execution: answer(trace.execution), outcome: answer(trace.outcome), learning: answer(trace.learning, trace.memory) } });
}

export type ExecutiveIntelligenceCertification = Readonly<{
  certified: boolean;
  authorityPreserved: boolean;
  identityContinuous: boolean;
  provenancePreserved: boolean;
  expectedActualDistinct: boolean;
  unresolvedEvidenceHonest: boolean;
  checks: readonly string[];
}>;

export function certifyExecutiveIntelligenceTrace(trace: ExecutiveIntelligenceTrace): ExecutiveIntelligenceCertification {
  const authorityPreserved = EXECUTIVE_INTELLIGENCE_BOUNDARY.ownsReality === false && EXECUTIVE_INTELLIGENCE_BOUNDARY.ownsDecisions === false && EXECUTIVE_INTELLIGENCE_BOUNDARY.ownsMemory === false;
  const provenancePreserved = (trace.reality?.provenanceRefs.length ?? 0) > 0 && (trace.learning?.provenanceRefs.length ?? 0) > 0;
  const expectedActualDistinct = Boolean(trace.outcome?.expected && trace.outcome.actual && trace.outcome.expected.kind === "expected" && trace.outcome.actual.kind === "actual" && trace.outcome.expected.outcomeId !== trace.outcome.actual.outcomeId);
  const unresolvedEvidenceHonest = trace.links.every((link) => link.status === "connected" || link.reason.startsWith("missing-"));
  const checks = Object.freeze([`authority:${authorityPreserved ? "passed" : "failed"}`, `identity:${trace.valid ? "passed" : "failed"}`, `provenance:${provenancePreserved ? "passed" : "failed"}`, `expected-actual:${expectedActualDistinct ? "passed" : "failed"}`, `unresolved-evidence:${unresolvedEvidenceHonest ? "passed" : "failed"}`, `complete:${trace.complete ? "passed" : "failed"}`]);
  return deepFreeze({ certified: trace.complete && trace.valid && authorityPreserved && provenancePreserved && expectedActualDistinct && unresolvedEvidenceHonest, authorityPreserved, identityContinuous: trace.valid, provenancePreserved, expectedActualDistinct, unresolvedEvidenceHonest, checks });
}
