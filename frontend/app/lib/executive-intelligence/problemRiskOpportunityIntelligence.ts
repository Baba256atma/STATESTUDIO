/**
 * EI:3 — evidence-bounded Problem, Risk & Opportunity Intelligence.
 *
 * This is an immutable integration boundary. It does not observe reality,
 * persist domain objects, infer causes, predict outcomes, rank priorities, or
 * mutate EI:1, EI:2, Advisor, Runtime, or Stage.
 */
import type { NexoraDataRealitySnapshot } from "../data-reality/dataRealityContracts.ts";
import type {
  NexoraDataRealityHandoff,
  NexoraDataSourceValidationResult,
} from "../data-reality/realDataIntegrationFoundation.ts";
import type {
  NexoraExecutiveEvidenceReference,
  NexoraExecutiveReasoningEvidencePack,
  NexoraExecutiveRelationSupportKind,
} from "../conversational-control/executiveRecommendation.ts";
import type {
  NexoraExecutiveAssessmentIssue,
  NexoraExecutiveAssessmentOpportunity,
} from "../conversational-control/executiveAssessment.ts";
import type { ExecutiveIntelligenceTrace, ExecutiveRealityReference } from "./executiveIntelligenceIntegration.ts";
import type {
  OperationalSeverity,
  StrategicContext,
  StrategicReference,
  StrategicRelevanceLevel,
  StrategicEi1Trace,
} from "./strategicIntelligenceIntegration.ts";

export const problemRiskOpportunityIntelligenceIdentity =
  "EI:3/ProblemRiskOpportunityIntelligence" as const;
export const problemRiskOpportunityIntelligenceVersion = "1.0.0" as const;
export const problemRiskOpportunityIntelligenceNamespace =
  "nexora.executive-intelligence.problem-risk-opportunity" as const;

export const PROBLEM_RISK_OPPORTUNITY_BOUNDARY = Object.freeze({
  role: "evidence-bounded-assessment-integration" as const,
  realityAuthority: "RDI:1 + P0:1/Data Reality" as const,
  assessmentAuthority: "CC:8/ExecutiveAssessment" as const,
  riskLifecycleAuthority: "DS-6:1/WorkspaceRisk" as const,
  ownsReality: false as const,
  ownsRiskLifecycle: false as const,
  persistsIssues: false as const,
  predicts: false as const,
  infersCausality: false as const,
  computesPriority: false as const,
  mutatesEi1: false as const,
  mutatesEi2: false as const,
  mutatesStage: false as const,
});

export const problemRiskOpportunityCapabilityMap = deepFreeze([
  { concept: "reality", authority: "RDI:1 + P0:1/Data Reality", role: "validated observation and KPI truth", status: "CANONICAL" },
  { concept: "assessment", authority: "CC:8/ExecutiveAssessment", role: "transient evidence-backed issue, opportunity, constraint and uncertainty framing", status: "CANONICAL" },
  { concept: "problem", authority: "CC:8 assessment + EI:3 reference contract", role: "non-persistent current-condition classification", status: "PARTIAL" },
  { concept: "risk", authority: "DS-6:1/WorkspaceRisk", role: "persisted workspace risk lifecycle; EI:3 only references it", status: "CANONICAL" },
  { concept: "opportunity", authority: "CC:8 assessment + EI:3 reference contract", role: "non-persistent credible-upside classification", status: "PARTIAL" },
  { concept: "causal-support", authority: "explicit upstream evidence relationship", role: "relationship interpretation without inference", status: "PARTIAL" },
  { concept: "constraints", authority: "CC:8 assessment + referenced domain evidence", role: "non-persistent affected-entity framing", status: "PARTIAL" },
  { concept: "legacy-registries", authority: "none", role: "metadata/presentation only; never live EI:3 truth", status: "LEGACY" },
] as const);

export const problemRiskOpportunityGapRegister = deepFreeze([
  { gapId: "EI3-GAP-001", transition: "Problem/Opportunity → persistence", status: "MISSING", owner: "future domain phase", resolution: "EI:3 intentionally creates no store or lifecycle." },
  { gapId: "EI3-GAP-002", transition: "BUS strategic risk → DS-6 risk", status: "PARTIAL", owner: "future authority convergence", resolution: "Use explicit identity mapping; do not merge authorities." },
  { gapId: "EI3-GAP-003", transition: "Issue → Scenario", status: "PARTIAL", owner: "EI:4", resolution: "Carry this immutable issue reference into the existing CC:9 boundary." },
  { gapId: "EI3-GAP-004", transition: "Uncertainty → Decision", status: "PARTIAL", owner: "EI:5", resolution: "Preserve claim type and evidence without converting assumptions into facts." },
  { gapId: "EI3-GAP-005", transition: "Issue outcome → Learning", status: "MISSING", owner: "EI:6", resolution: "Compare explicit outcome evidence without inventing cause." },
] as const);

export const EXECUTIVE_ISSUE_TYPES = Object.freeze(["problem", "risk", "opportunity", "unresolved"] as const);
export type ExecutiveIssueType = (typeof EXECUTIVE_ISSUE_TYPES)[number];

export const EXECUTIVE_CLAIM_TYPES = Object.freeze(["FACT", "ASSUMPTION", "PREDICTION", "UNKNOWN"] as const);
export type ExecutiveClaimType = (typeof EXECUTIVE_CLAIM_TYPES)[number];

export const SEMANTIC_CONFIDENCE_LEVELS = Object.freeze(["high", "medium", "low", "unknown"] as const);
export type SemanticConfidence = (typeof SEMANTIC_CONFIDENCE_LEVELS)[number];

export const EVIDENCE_STRENGTH_LEVELS = Object.freeze(["strong", "moderate", "weak", "unknown"] as const);
export type EvidenceStrength = (typeof EVIDENCE_STRENGTH_LEVELS)[number];

export const CAUSAL_RELATIONSHIP_KINDS = Object.freeze([
  "observed-relationship",
  "possible-contributor",
  "supported-causal",
  "unknown-cause",
] as const);
export type CausalRelationshipKind = (typeof CAUSAL_RELATIONSHIP_KINDS)[number];

export const CONSTRAINT_CATEGORIES = Object.freeze([
  "capacity", "budget", "time", "resource", "dependency", "policy",
  "technical", "operational", "external", "unknown",
] as const);
export type ConstraintCategory = (typeof CONSTRAINT_CATEGORIES)[number];

export type ExecutiveClaim = Readonly<{
  claimId: string;
  type: ExecutiveClaimType;
  statement: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  provenanceRefs: readonly string[];
  confidence: SemanticConfidence;
  observedAt: string | null;
  unresolved: boolean;
}>;

export type EvidenceBoundedRelationship = Readonly<{
  relationshipId: string;
  kind: CausalRelationshipKind;
  sourceEntityId: string;
  targetEntityId: string;
  upstreamSupportKind: NexoraExecutiveRelationSupportKind | null;
  authorityId: string | null;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  causeEstablished: boolean;
}>;

export type ExecutiveConstraintReference = Readonly<{
  constraintId: string;
  category: ConstraintCategory;
  summary: string;
  affectedEntityRefs: readonly string[];
  authorityId: string;
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
}>;

export type ExecutiveIssueFraming = Readonly<{
  issueId: string;
  requestedType: ExecutiveIssueType;
  issueType: ExecutiveIssueType;
  title: string;
  workspaceId: string;
  contractAuthorityId: "EI:3/ProblemRiskOpportunityIntelligence";
  assessmentAuthorityId: "CC:8/ExecutiveAssessment";
  persistenceAuthorityId: null;
  riskLifecycleReference: StrategicReference | null;
  reality: ExecutiveRealityReference;
  strategicContext: StrategicContext | null;
  claims: readonly ExecutiveClaim[];
  relationships: readonly EvidenceBoundedRelationship[];
  constraints: readonly ExecutiveConstraintReference[];
  operationalSeverity: OperationalSeverity;
  strategicRelevance: StrategicRelevanceLevel;
  evidenceStrength: EvidenceStrength;
  confidence: SemanticConfidence;
  uncertaintyRefs: readonly string[];
  createdAt: string;
  updatedAt: string;
}>;

export type RealityAssessmentEvidenceHandoff = Readonly<{
  handoffId: string;
  sourceId: string;
  sourceSnapshotId: string;
  datasetId: string;
  mappingId: string;
  workspaceId: string;
  observedAt: string;
  validationState: NexoraDataSourceValidationResult["state"];
  validationAccepted: true;
  reality: ExecutiveRealityReference;
  evidence: NexoraExecutiveReasoningEvidencePack;
  evidenceProvenance: Readonly<Record<string, readonly string[]>>;
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

function copyEvidence(refs: readonly NexoraExecutiveEvidenceReference[]): readonly NexoraExecutiveEvidenceReference[] {
  return Object.freeze(refs.map((ref) => Object.freeze({ ...ref })));
}

export function resolveSemanticConfidence(
  evidenceRefs: readonly NexoraExecutiveEvidenceReference[],
  provenanceRefs: readonly string[],
  realityEvidence: readonly ExecutiveRealityReference["evidenceRefs"][number][] = [],
): SemanticConfidence {
  if (evidenceRefs.length === 0 || provenanceRefs.length === 0) return "unknown";
  const relevant = realityEvidence.filter((ref) => evidenceRefs.some((candidate) =>
    candidate.sourceId === ref.sourceId
    && (candidate.subjectId == null || candidate.subjectId === ref.subjectId)
  ));
  if (relevant.length === 0) return "medium";
  if (relevant.every((ref) => ref.confidenceState === "verified")) return "high";
  if (relevant.some((ref) => ref.confidenceState === "uncertain")) return "low";
  return "medium";
}

export function createExecutiveClaim(input: {
  readonly claimId: string;
  readonly type: ExecutiveClaimType;
  readonly statement: string;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs?: readonly string[];
  readonly observedAt?: string | null;
  readonly realityEvidence?: ExecutiveRealityReference["evidenceRefs"];
}): ExecutiveClaim {
  const evidenceRefs = input.evidenceRefs ?? [];
  const provenanceRefs = input.provenanceRefs ?? [];
  if (!input.claimId.trim() || !input.statement.trim()) throw new Error("ei3-claim-identity-required");
  if (input.type === "FACT" && (evidenceRefs.length === 0 || provenanceRefs.length === 0)) {
    throw new Error("ei3-fact-evidence-and-provenance-required");
  }
  const confidence = input.type === "UNKNOWN"
    ? "unknown"
    : resolveSemanticConfidence(evidenceRefs, provenanceRefs, input.realityEvidence ?? []);
  return deepFreeze({
    claimId: input.claimId,
    type: input.type,
    statement: input.statement,
    evidenceRefs: copyEvidence(evidenceRefs),
    provenanceRefs: unique(provenanceRefs),
    observedAt: input.type === "PREDICTION" || input.type === "UNKNOWN" ? null : input.observedAt ?? null,
    confidence,
    unresolved: input.type === "UNKNOWN",
  });
}

export function createEvidenceBoundedRelationship(input: {
  readonly relationshipId: string;
  readonly kind: CausalRelationshipKind;
  readonly sourceEntityId: string;
  readonly targetEntityId: string;
  readonly upstreamSupportKind?: NexoraExecutiveRelationSupportKind | null;
  readonly authorityId?: string | null;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
}): EvidenceBoundedRelationship {
  const evidenceRefs = input.evidenceRefs ?? [];
  const support = input.upstreamSupportKind ?? null;
  const authorityId = input.authorityId ?? null;
  if (!input.relationshipId || !input.sourceEntityId || !input.targetEntityId) throw new Error("ei3-relationship-identity-required");
  if (input.kind !== "unknown-cause" && (evidenceRefs.length === 0 || !authorityId)) throw new Error("ei3-relationship-evidence-required");
  if (input.kind === "supported-causal" && (support !== "causal" || evidenceRefs.length === 0 || !authorityId)) {
    throw new Error("ei3-supported-causal-authority-required");
  }
  if (support === "correlated" && input.kind === "supported-causal") throw new Error("ei3-correlation-is-not-causation");
  const causeEstablished = input.kind === "supported-causal" && support === "causal";
  return deepFreeze({ relationshipId: input.relationshipId, kind: input.kind, sourceEntityId: input.sourceEntityId, targetEntityId: input.targetEntityId, upstreamSupportKind: support, authorityId, evidenceRefs: copyEvidence(evidenceRefs), causeEstablished });
}

export function createExecutiveConstraintReference(input: {
  readonly constraintId: string;
  readonly category: ConstraintCategory;
  readonly summary: string;
  readonly affectedEntityRefs: readonly string[];
  readonly authorityId: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
}): ExecutiveConstraintReference {
  if (!input.constraintId || !input.summary.trim() || !input.authorityId) throw new Error("ei3-constraint-identity-required");
  if (input.affectedEntityRefs.length === 0) throw new Error("ei3-constraint-affected-entity-required");
  return deepFreeze({ ...input, affectedEntityRefs: unique(input.affectedEntityRefs), evidenceRefs: copyEvidence(input.evidenceRefs) });
}

function attentionFor(state: "normal" | "attention" | "critical"): "normal" | "important" | "critical" {
  return state === "attention" ? "important" : state;
}

export function createRealityAssessmentEvidenceHandoff(input: {
  readonly handoff: NexoraDataRealityHandoff;
  readonly snapshot: NexoraDataRealitySnapshot;
  readonly validation: NexoraDataSourceValidationResult;
  readonly reality: ExecutiveRealityReference;
}): RealityAssessmentEvidenceHandoff {
  if (!input.validation.accepted) throw new Error("ei3-rdi-validation-required");
  if (input.handoff.dataset.id !== input.snapshot.datasetId || input.reality.datasetId !== input.snapshot.datasetId) throw new Error("ei3-dataset-identity-mismatch");
  if (input.reality.sourceSnapshotId !== input.handoff.sourceSnapshotId || input.reality.workspaceId !== input.handoff.workspaceId) throw new Error("ei3-reality-handoff-mismatch");
  const evidenceProvenance: Record<string, readonly string[]> = {};
  const facts = input.snapshot.kpis.map((kpi) => {
    const objectState = input.snapshot.objectStates.find((state) => state.nexoraObjectId === kpi.nexoraObjectId);
    const sourceEvidence = input.reality.evidenceRefs.filter((ref) => ref.subjectId === kpi.nexoraObjectId);
    if (sourceEvidence.length === 0) throw new Error(`ei3-kpi-provenance-missing:${kpi.kpiId}`);
    const evidenceId = `ei3:${input.snapshot.datasetId}:${kpi.kpiId}`;
    evidenceProvenance[evidenceId] = unique(sourceEvidence.flatMap((ref) => [
      ...input.reality.provenanceRefs,
      `${ref.sourceKind}:${ref.sourceId}:${ref.factKey ?? kpi.kpiId}`,
    ]));
    return Object.freeze({
      evidenceId,
      subjectId: kpi.nexoraObjectId,
      subjectLabel: kpi.objectKey,
      attention: objectState ? attentionFor(objectState.state) : undefined,
      status: objectState?.state === "critical" ? "risk" as const : "stable" as const,
      factKey: kpi.kpiId,
      factValue: kpi.value,
      freshness: "current" as const,
      source: Object.freeze({ sourceKind: "data-reality" as const, sourceId: input.handoff.sourceId, subjectId: kpi.nexoraObjectId, factKey: kpi.kpiId }),
    });
  });
  return deepFreeze({
    handoffId: `ei3:${input.handoff.sourceSnapshotId}:${input.snapshot.datasetId}`,
    sourceId: input.handoff.sourceId,
    sourceSnapshotId: input.handoff.sourceSnapshotId,
    datasetId: input.snapshot.datasetId,
    mappingId: input.handoff.mappingId,
    workspaceId: input.handoff.workspaceId,
    observedAt: input.snapshot.createdAt,
    validationState: input.validation.state,
    validationAccepted: true,
    reality: input.reality,
    evidence: { facts, relationships: [], scopeSubjectIds: unique(facts.map((fact) => fact.subjectId)) },
    evidenceProvenance,
  });
}

function classify(requested: ExecutiveIssueType, claims: readonly ExecutiveClaim[], risk: StrategicReference | null): ExecutiveIssueType {
  if (requested === "unresolved") return "unresolved";
  const facts = claims.filter((claim) => claim.type === "FACT" && claim.evidenceRefs.length > 0 && claim.provenanceRefs.length > 0);
  if (requested === "problem") return facts.length > 0 ? "problem" : "unresolved";
  if (requested === "opportunity") return facts.length > 0 ? "opportunity" : "unresolved";
  const supportedFutureClaim = claims.some((claim) =>
    (claim.type === "PREDICTION" || claim.type === "ASSUMPTION")
    && claim.evidenceRefs.length > 0
    && claim.provenanceRefs.length > 0,
  );
  return risk?.kind === "risk" && risk.authorityId === "DS-6:1/WorkspaceRisk" || supportedFutureClaim ? "risk" : "unresolved";
}

function evidenceStrength(claims: readonly ExecutiveClaim[]): EvidenceStrength {
  const supported = claims.filter((claim) => claim.evidenceRefs.length > 0 && claim.provenanceRefs.length > 0);
  if (supported.length === 0) return "unknown";
  if (supported.every((claim) => claim.confidence === "high")) return "strong";
  if (supported.some((claim) => claim.confidence === "high" || claim.confidence === "medium")) return "moderate";
  return "weak";
}

export function createExecutiveIssueFraming(input: {
  readonly issueId: string;
  readonly requestedType: ExecutiveIssueType;
  readonly title: string;
  readonly workspaceId: string;
  readonly reality: ExecutiveRealityReference;
  readonly strategicContext?: StrategicContext | null;
  readonly riskLifecycleReference?: StrategicReference | null;
  readonly claims: readonly ExecutiveClaim[];
  readonly relationships?: readonly EvidenceBoundedRelationship[];
  readonly constraints?: readonly ExecutiveConstraintReference[];
  readonly operationalSeverity: OperationalSeverity;
  readonly uncertaintyRefs?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}): ExecutiveIssueFraming {
  if (input.reality.workspaceId !== input.workspaceId) throw new Error("ei3-issue-reality-workspace-mismatch");
  if (input.strategicContext && input.strategicContext.workspaceId !== input.workspaceId) throw new Error("ei3-issue-strategic-workspace-mismatch");
  const risk = input.riskLifecycleReference ?? null;
  if (risk && (risk.kind !== "risk" || risk.authorityId !== "DS-6:1/WorkspaceRisk")) throw new Error("ei3-risk-lifecycle-must-reference-ds6");
  const issueType = classify(input.requestedType, input.claims, risk);
  const strength = evidenceStrength(input.claims);
  const confidence: SemanticConfidence = strength === "strong" ? "high" : strength === "moderate" ? "medium" : strength === "weak" ? "low" : "unknown";
  return deepFreeze({
    issueId: input.issueId,
    requestedType: input.requestedType,
    issueType,
    title: input.title,
    workspaceId: input.workspaceId,
    contractAuthorityId: "EI:3/ProblemRiskOpportunityIntelligence",
    assessmentAuthorityId: "CC:8/ExecutiveAssessment",
    persistenceAuthorityId: null,
    riskLifecycleReference: risk,
    reality: input.reality,
    strategicContext: input.strategicContext ?? null,
    claims: [...input.claims],
    relationships: [...(input.relationships ?? [])],
    constraints: [...(input.constraints ?? [])],
    operationalSeverity: input.operationalSeverity,
    strategicRelevance: input.strategicContext?.strategicRelevance.level ?? "unresolved",
    evidenceStrength: strength,
    confidence,
    uncertaintyRefs: unique([...(input.uncertaintyRefs ?? []), ...input.claims.filter((claim) => claim.unresolved).map((claim) => claim.claimId)]),
    createdAt: input.createdAt ?? input.reality.observedAt ?? "unresolved",
    updatedAt: input.updatedAt ?? input.createdAt ?? input.reality.observedAt ?? "unresolved",
  });
}

/** References an actual CC:8 assessment result without copying authority. */
export function referenceCanonicalAssessmentFraming(input: {
  readonly assessment: NexoraExecutiveAssessmentIssue | NexoraExecutiveAssessmentOpportunity;
  readonly requestedType: Exclude<ExecutiveIssueType, "unresolved">;
  readonly handoff: RealityAssessmentEvidenceHandoff;
  readonly strategicContext?: StrategicContext | null;
  readonly riskLifecycleReference?: StrategicReference | null;
  readonly relationships?: readonly EvidenceBoundedRelationship[];
  readonly constraints?: readonly ExecutiveConstraintReference[];
  readonly operationalSeverity: OperationalSeverity;
  readonly uncertaintyRefs?: readonly string[];
}): ExecutiveIssueFraming {
  const issueId = "issueId" in input.assessment ? input.assessment.issueId : input.assessment.opportunityId;
  const provenanceRefs = unique(input.assessment.evidenceRefs.flatMap((ref) => {
    const evidenceFact = input.handoff.evidence.facts.find((fact) =>
      fact.source.sourceId === ref.sourceId
      && (ref.subjectId == null || fact.subjectId === ref.subjectId)
      && (ref.factKey == null || fact.factKey === ref.factKey),
    );
    return evidenceFact ? input.handoff.evidenceProvenance[evidenceFact.evidenceId] ?? [] : [];
  }));
  const claim = createExecutiveClaim({
    claimId: `claim:${issueId}`,
    type: "FACT",
    statement: input.assessment.summary,
    evidenceRefs: input.assessment.evidenceRefs,
    provenanceRefs,
    observedAt: input.handoff.observedAt,
    realityEvidence: input.handoff.reality.evidenceRefs,
  });
  return createExecutiveIssueFraming({
    issueId,
    requestedType: input.requestedType,
    title: input.assessment.summary,
    workspaceId: input.handoff.workspaceId,
    reality: input.handoff.reality,
    strategicContext: input.strategicContext,
    riskLifecycleReference: input.riskLifecycleReference,
    claims: [claim],
    relationships: input.relationships,
    constraints: input.constraints,
    operationalSeverity: input.operationalSeverity,
    uncertaintyRefs: input.uncertaintyRefs,
    createdAt: input.handoff.observedAt,
    updatedAt: input.handoff.observedAt,
  });
}

export type ProblemRiskOpportunityTrace = Readonly<{
  traceId: string;
  ei1: ExecutiveIntelligenceTrace;
  strategic: StrategicEi1Trace | null;
  assessmentHandoff: RealityAssessmentEvidenceHandoff;
  issue: ExecutiveIssueFraming;
  scenarioId: string | null;
  decisionId: string | null;
  executionId: string | null;
  complete: boolean;
  valid: boolean;
  issues: readonly string[];
}>;

export function createProblemRiskOpportunityTrace(input: {
  readonly traceId: string;
  readonly ei1: ExecutiveIntelligenceTrace;
  readonly strategic?: StrategicEi1Trace | null;
  readonly assessmentHandoff: RealityAssessmentEvidenceHandoff;
  readonly issue: ExecutiveIssueFraming;
}): ProblemRiskOpportunityTrace {
  const issues: string[] = [];
  if (input.ei1.workspaceId !== input.issue.workspaceId) issues.push("ei1-issue-workspace-mismatch");
  if (input.ei1.reality?.recordId !== input.assessmentHandoff.datasetId) issues.push("ei1-assessment-reality-mismatch");
  if (input.issue.reality.recordId !== input.assessmentHandoff.datasetId) issues.push("issue-assessment-reality-mismatch");
  if (input.strategic && input.strategic.strategicContext.contextId !== input.issue.strategicContext?.contextId) issues.push("issue-strategic-context-mismatch");
  const valid = input.ei1.valid && input.assessmentHandoff.validationAccepted && input.issue.issueType !== "unresolved" && issues.length === 0;
  return deepFreeze({
    traceId: input.traceId,
    ei1: input.ei1,
    strategic: input.strategic ?? null,
    assessmentHandoff: input.assessmentHandoff,
    issue: input.issue,
    scenarioId: input.ei1.scenario?.recordId ?? null,
    decisionId: input.ei1.decision?.recordId ?? null,
    executionId: input.ei1.execution?.recordId ?? null,
    complete: valid && input.ei1.scenario != null && input.ei1.decision != null && input.ei1.execution != null,
    valid,
    issues: unique(issues),
  });
}

export type IssueAdvisorProjection = Readonly<{
  issueId: string;
  issueType: ExecutiveIssueType;
  factsOnly: true;
  authority: false;
  claims: readonly Readonly<{ claimId: string; status: "KNOWN" | "ASSUMED" | "PREDICTED" | "UNKNOWN"; statement: string; evidenceRefs: readonly NexoraExecutiveEvidenceReference[] }>[];
  knownConstraints: readonly string[];
  causeStatus: "SUPPORTED" | "POSSIBLE" | "UNKNOWN";
}>;

export function projectIssueForAdvisor(issue: ExecutiveIssueFraming): IssueAdvisorProjection {
  const status = (type: ExecutiveClaimType) => type === "FACT" ? "KNOWN" as const : type === "ASSUMPTION" ? "ASSUMED" as const : type === "PREDICTION" ? "PREDICTED" as const : "UNKNOWN" as const;
  const causeStatus = issue.relationships.some((item) => item.causeEstablished)
    ? "SUPPORTED" as const
    : issue.relationships.some((item) => item.kind === "possible-contributor" || item.kind === "observed-relationship")
      ? "POSSIBLE" as const
      : "UNKNOWN" as const;
  return deepFreeze({ issueId: issue.issueId, issueType: issue.issueType, factsOnly: true, authority: false, claims: issue.claims.map((claim) => ({ claimId: claim.claimId, status: status(claim.type), statement: claim.statement, evidenceRefs: claim.evidenceRefs })), knownConstraints: issue.constraints.map((item) => item.constraintId), causeStatus });
}

export const problemRiskOpportunityStageCompatibility = deepFreeze({
  projectionOnly: true,
  authority: false,
  existingTopologyPreserved: true,
  zPlane: 0,
  clickToCenterPreserved: true,
  fixedCameraPreserved: true,
  proximityEstablishesCausality: false,
  specializedProblemRiskOpportunityKindsRequired: false,
});

export function certifyProblemRiskOpportunityIntelligence(trace: ProblemRiskOpportunityTrace) {
  const provenanceComplete = Object.values(trace.assessmentHandoff.evidenceProvenance).every((refs) => refs.length > 0);
  const claimsValid = trace.issue.claims.every((claim) => claim.type !== "FACT" || claim.evidenceRefs.length > 0 && claim.provenanceRefs.length > 0);
  const causalClaimsValid = trace.issue.relationships.every((relationship) => !relationship.causeEstablished || relationship.upstreamSupportKind === "causal" && relationship.evidenceRefs.length > 0 && relationship.authorityId != null);
  const riskAuthorityPreserved = !trace.issue.riskLifecycleReference || trace.issue.riskLifecycleReference.authorityId === "DS-6:1/WorkspaceRisk";
  const strategicContextPreserved = !trace.issue.strategicContext || trace.issue.strategicContext.workspaceId === trace.issue.workspaceId;
  const checks = Object.freeze([
    `trace:${trace.valid ? "passed" : "failed"}`,
    `provenance:${provenanceComplete ? "passed" : "failed"}`,
    `claims:${claimsValid ? "passed" : "failed"}`,
    `causality:${causalClaimsValid ? "passed" : "failed"}`,
    `risk-authority:${riskAuthorityPreserved ? "passed" : "failed"}`,
    `strategic-context:${strategicContextPreserved ? "passed" : "failed"}`,
  ]);
  return deepFreeze({ certified: trace.valid && provenanceComplete && claimsValid && causalClaimsValid && riskAuthorityPreserved && strategicContextPreserved, provenanceComplete, claimsValid, causalClaimsValid, riskAuthorityPreserved, strategicContextPreserved, checks });
}
