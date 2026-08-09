/**
 * REX-4:5 — Runtime Executive Insight Presentation.
 *
 * Deterministic transformation of prioritized Executive Insights into
 * structured, presentation-neutral descriptors for the canonical states:
 * minimum | report | operation.
 *
 * Canonical flow:
 *   REX-4:4 Priority & Attention → REX-4:5 Presentation → later REX-4 orchestration
 *
 * REX-4:4 answers: Which resolved insights deserve attention first?
 * REX-4:5 answers: Given a prioritized Executive Insight, what information
 * should be exposed in each executive presentation state?
 *
 * Pure, stateless, immutable, renderer-neutral, AI-neutral.
 * Defines what information is available — not how pixels are rendered.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  isRuntimeExecutiveInsightPriorityAttentionState,
  isRuntimeExecutiveInsightPriorityBand,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightPriorityAttentionIdentity,
  runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
  runtimeExecutiveInsightPriorityAttentionVersion,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightPriorityAttention,
  type RuntimeExecutiveInsightCandidate,
  type RuntimeExecutiveInsightCandidateCollection,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightPriorityAttentionState,
  type RuntimeExecutiveInsightPriorityBand,
  type RuntimeExecutiveInsightPriorityContribution,
  type RuntimeExecutiveInsightPriorityResult,
  type RuntimeExecutiveInsightSignalContract,
  type RuntimeExecutiveInsightSourceContract,
  type RuntimeExecutiveInsightSubjectContract,
  type RuntimeExecutiveRankedInsight,
} from "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention";

// ─── Transitively published Priority/Resolution surface (for REX-4:6+) ──────
// Publication fix: later REX-4 phases consume priority/resolution through REX-4:5 only.

export {
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsights,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
};

export type {
  RuntimeExecutiveInsightCandidate,
  RuntimeExecutiveInsightCandidateCollection,
  RuntimeExecutiveInsightEvidenceContract,
  RuntimeExecutiveInsightSignalContract,
  RuntimeExecutiveInsightSourceContract,
  RuntimeExecutiveInsightSubjectContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightPresentationIdentity =
  "REX-4:5/RuntimeExecutiveInsightPresentation" as const;

export const runtimeExecutiveInsightPresentationVersion = "4.5.0" as const;

export const runtimeExecutiveInsightPresentationNamespace =
  "nexora.rex.insight-experience.presentation" as const;

export const runtimeExecutiveInsightPresentationLayer = "REX" as const;

export const runtimeExecutiveInsightPresentationCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightPresentationPhase =
  "Presentation" as const;

export const runtimeExecutiveInsightPresentationStatus =
  "PresentationReady" as const;

export const runtimeExecutiveInsightPresentationArchitecturalRole =
  "RuntimeExecutiveInsightPresentationBoundary" as const;

export const runtimeExecutiveInsightPresentationDependencyIdentity =
  runtimeExecutiveInsightPriorityAttentionIdentity;

export const runtimeExecutiveInsightPresentationDependencyPath =
  runtimeExecutiveInsightPriorityAttentionSupportedImportPath;

export const runtimeExecutiveInsightPresentationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightPresentation" as const;

export const runtimeExecutiveInsightPresentationStability =
  "PresentationReady" as const;

export const runtimeExecutiveInsightPresentationDeterministic = true as const;

export const runtimeExecutiveInsightPresentationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightPresentationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightPresentationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightPresentationIdentity,
    version: runtimeExecutiveInsightPresentationVersion,
    namespace: runtimeExecutiveInsightPresentationNamespace,
    layer: runtimeExecutiveInsightPresentationLayer,
    capability: runtimeExecutiveInsightPresentationCapability,
    phase: runtimeExecutiveInsightPresentationPhase,
    status: runtimeExecutiveInsightPresentationStatus,
    architecturalRole:
      runtimeExecutiveInsightPresentationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveInsightPresentationDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightPresentationDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightPresentationSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightPriorityAttentionVersion,
    stabilityStatus: runtimeExecutiveInsightPresentationStability,
    deterministicStatus: runtimeExecutiveInsightPresentationDeterministic,
    sideEffectPolicy: runtimeExecutiveInsightPresentationSideEffectPolicy,
    mutationPolicy: runtimeExecutiveInsightPresentationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRINCIPLE =
  "Prioritized insight + attention metadata + explicit presentation context + explicit presentation policy → structured Executive Insight presentation descriptor. REX-4:5 defines what information is available — not how pixels are rendered." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  presentationAuthority: "REX-4:5" as const,
  architecturalRole:
    "RuntimeExecutiveInsightPresentationBoundary" as const,
  soleImmediateDependency:
    "REX-4:4/RuntimeExecutiveInsightPriorityAttention" as const,
  consumesPriorityAttentionOnly: true as const,
  importsRex43Directly: false as const,
  importsRex42Directly: false as const,
  importsRex41Directly: false as const,
  importsRex4LaterDirectly: false as const,
  importsRex3Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  reactIndependent: true as const,
  aiProviderIndependent: true as const,
  pureFunctions: true as const,
  stateless: true as const,
  severityDistinctFromPriority: true as const,
  noAutoUpgrade: true as const,
  informationMonotonicity: true as const,
  recalculatesPriority: false as const,
  recalculatesAttention: false as const,
  reresolvesInsightSemantics: false as const,
  introducesAdvisorProse: false as const,
  introducesStageExecution: false as const,
  introducesOrchestration: false as const,
  introducesAutomation: false as const,
  introducesNotifications: false as const,
  introducesLlmGeneration: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
});

// ─── Published upstream aliases (REX-4:4 boundary only) ──────────────────────

/** Candidate shape published transitively via RuntimeExecutiveRankedInsight. */
export type RuntimeExecutiveInsightPresentationCandidate =
  RuntimeExecutiveRankedInsight["candidate"];

export type {
  RuntimeExecutiveInsightPriorityAttentionState,
  RuntimeExecutiveInsightPriorityBand,
  RuntimeExecutiveInsightPriorityContribution,
  RuntimeExecutiveInsightPriorityResult,
  RuntimeExecutiveRankedInsight,
};

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KIND_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KIND_SEMANTICS;
export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS =
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS;
export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ATTENTION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES;

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

export type RuntimeExecutiveInsightPresentationState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES =
  Object.freeze([
    "eligible",
    "ineligible",
    "restricted",
    "invalid",
  ] as const);

export type RuntimeExecutiveInsightPresentationEligibilityStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES =
  Object.freeze(["compact", "balanced", "detailed"] as const);

export type RuntimeExecutiveInsightPresentationDensity =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS =
  Object.freeze([
    "none",
    "subtle",
    "normal",
    "strong",
    "critical",
  ] as const);

export type RuntimeExecutiveInsightPresentationEmphasisLevel =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS =
  Object.freeze([
    "identity",
    "subject",
    "classification",
    "priority",
    "attention",
    "confidence",
    "freshness",
    "scope",
    "evidence",
    "signals",
    "relationships",
    "provenance",
    "lifecycle",
    "kpi-context",
    "koi-context",
    "decision-context",
    "scenario-context",
    "execution-context",
    "pack-context",
    "interactions",
  ] as const);

export type RuntimeExecutiveInsightPresentationFieldGroup =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS =
  Object.freeze([
    "inspect",
    "focus-subject",
    "inspect-evidence",
    "inspect-relationship",
    "compare",
    "open-related",
    "ask-advisor",
    "review-decision",
    "review-execution",
  ] as const);

export type RuntimeExecutiveInsightPresentationInteractionKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES =
  Object.freeze([
    "eligible-minimum",
    "eligible-report",
    "eligible-operation",
    "restricted-state",
    "missing-required-subject",
    "missing-report-data",
    "missing-operation-context",
    "state-downgraded",
    "evidence-limited",
    "relationship-limited",
    "interaction-unavailable",
    "field-hidden-by-policy",
    "field-unavailable",
    "priority-emphasis-applied",
    "attention-emphasis-applied",
    "confidence-hidden",
    "provenance-hidden",
    "invalid-input",
    "invalid-policy",
    "invalid-requested-state",
  ] as const);

export type RuntimeExecutiveInsightPresentationReasonCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES =
  Object.freeze([
    "exact-minimum-report-operation-semantics",
    "deterministic-state-resolution",
    "deterministic-fallback-downgrade",
    "immutable-input-preservation",
    "presentation-neutral-outputs",
    "renderer-neutral-outputs",
    "no-react-dependency",
    "no-ai",
    "no-llm",
    "no-semantic-re-resolution",
    "no-priority-recomputation",
    "no-stage-execution",
    "no-advisor-generation",
    "no-orchestration",
    "no-automation",
    "stable-ordering",
    "structured-interaction-intents-only",
  ] as const);

export type RuntimeExecutiveInsightPresentationConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES)[number];

const DEFAULT_STATE_DENSITY = Object.freeze({
  minimum: "compact",
  report: "balanced",
  operation: "detailed",
} as const satisfies Record<
  RuntimeExecutiveInsightPresentationState,
  RuntimeExecutiveInsightPresentationDensity
>);

const STATE_RANK: Readonly<
  Record<RuntimeExecutiveInsightPresentationState, number>
> = Object.freeze({
  minimum: 0,
  report: 1,
  operation: 2,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightPresentationSubjectReference {
  readonly subjectId: string;
  readonly kind: string;
  readonly label?: string;
  readonly scope?: string;
}

export interface RuntimeExecutiveInsightPresentationEmphasis {
  readonly level: RuntimeExecutiveInsightPresentationEmphasisLevel;
  readonly attentionEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel;
  readonly priorityEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel;
  readonly severityEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel;
  readonly confidenceEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel;
  readonly focusRelevance: boolean;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightPresentationReasonCode>;
}

export interface RuntimeExecutiveInsightInteractionDescriptor {
  readonly interactionId: string;
  readonly kind: RuntimeExecutiveInsightPresentationInteractionKind;
  readonly targetRef?: string;
  readonly subjectId?: string;
  readonly evidenceId?: string;
  readonly relationshipId?: string;
  readonly order: number;
}

export interface RuntimeExecutiveInsightPresentationPolicy {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly allowedStates?: ReadonlyArray<RuntimeExecutiveInsightPresentationState>;
  readonly hiddenFieldGroups?: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly showPriorityScore?: boolean;
  readonly showContributions?: boolean;
  readonly showProvenance?: boolean;
  readonly showConfidenceInMinimum?: boolean;
  readonly showEvidenceCountInMinimum?: boolean;
  readonly maxEvidenceRefs?: number;
  readonly maxSignalRefs?: number;
  readonly maxRelationshipRefs?: number;
  readonly maxInteractions?: number;
  readonly allowDowngrade?: boolean;
  readonly requireOperationContext?: boolean;
  readonly densityByState?: Partial<
    Record<
      RuntimeExecutiveInsightPresentationState,
      RuntimeExecutiveInsightPresentationDensity
    >
  >;
  readonly allowAskAdvisor?: boolean;
  readonly allowCompare?: boolean;
}

export interface RuntimeExecutiveInsightPresentationContext {
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly activeGoalId?: string;
  readonly activeKoiId?: string;
  readonly activeMode?: string;
  readonly activeWorkspaceId?: string;
  readonly activeSceneId?: string;
  readonly activeModelId?: string;
  readonly decisionRefs?: ReadonlyArray<string>;
  readonly executionRefs?: ReadonlyArray<string>;
  readonly scenarioRefs?: ReadonlyArray<string>;
  readonly problemRefs?: ReadonlyArray<string>;
  readonly packRefs?: ReadonlyArray<string>;
  readonly consumerCapabilities?: ReadonlyArray<string>;
  readonly densityConstraint?: RuntimeExecutiveInsightPresentationDensity;
}

export interface RuntimeExecutiveInsightPresentationInput {
  readonly priority: RuntimeExecutiveInsightPriorityResult;
  readonly candidate: RuntimeExecutiveInsightPresentationCandidate;
  readonly requestedState: RuntimeExecutiveInsightPresentationState;
  readonly context: RuntimeExecutiveInsightPresentationContext;
  readonly policy: RuntimeExecutiveInsightPresentationPolicy;
}

export interface RuntimeExecutiveInsightPresentationEligibility {
  readonly status: RuntimeExecutiveInsightPresentationEligibilityStatus;
  readonly requestedState: RuntimeExecutiveInsightPresentationState;
  readonly resolvedState?: RuntimeExecutiveInsightPresentationState;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightPresentationReasonCode>;
}

export interface RuntimeExecutiveInsightMinimumDescriptor {
  readonly insightId: string;
  readonly presentationState: "minimum";
  readonly subjectReference: RuntimeExecutiveInsightPresentationSubjectReference;
  readonly category: string;
  readonly direction: string;
  readonly priorityBand: RuntimeExecutiveInsightPriorityBand;
  readonly attentionState: RuntimeExecutiveInsightPriorityAttentionState;
  readonly compactSeverity?: string;
  readonly compactImportance?: string;
  readonly compactStatus?: string;
  readonly evidenceCount?: number;
  readonly emphasis: RuntimeExecutiveInsightPresentationEmphasis;
  readonly density: RuntimeExecutiveInsightPresentationDensity;
  readonly visibleFieldGroups: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly fieldOrder: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
}

export interface RuntimeExecutiveInsightReportDescriptor {
  readonly insightId: string;
  readonly presentationState: "report";
  readonly subjectReference: RuntimeExecutiveInsightPresentationSubjectReference;
  readonly primarySubject: RuntimeExecutiveInsightPresentationSubjectReference;
  readonly relatedSubjects: ReadonlyArray<RuntimeExecutiveInsightPresentationSubjectReference>;
  readonly category: string;
  readonly direction: string;
  readonly severity: string;
  readonly importance: string;
  readonly priorityBand: RuntimeExecutiveInsightPriorityBand;
  readonly priorityScore?: number;
  readonly urgency: string;
  readonly executiveRelevance: string;
  readonly attentionState: RuntimeExecutiveInsightPriorityAttentionState;
  readonly confidence?: number;
  readonly freshness?: string;
  readonly scope?: string;
  readonly evidenceRefs: ReadonlyArray<string>;
  readonly signalRefs: ReadonlyArray<string>;
  readonly relationshipRefs: ReadonlyArray<string>;
  readonly contributions?: ReadonlyArray<RuntimeExecutiveInsightPriorityContribution>;
  readonly provenance?: Readonly<{ sourceKind: string; sourceId?: string }>;
  readonly lifecycle?: Readonly<{ status: string }>;
  readonly kpiRefs: ReadonlyArray<string>;
  readonly koiRefs: ReadonlyArray<string>;
  readonly emphasis: RuntimeExecutiveInsightPresentationEmphasis;
  readonly density: RuntimeExecutiveInsightPresentationDensity;
  readonly visibleFieldGroups: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly fieldOrder: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
}

export interface RuntimeExecutiveInsightOperationDescriptor {
  readonly insightId: string;
  readonly presentationState: "operation";
  readonly subjectReference: RuntimeExecutiveInsightPresentationSubjectReference;
  readonly primarySubject: RuntimeExecutiveInsightPresentationSubjectReference;
  readonly relatedSubjects: ReadonlyArray<RuntimeExecutiveInsightPresentationSubjectReference>;
  readonly category: string;
  readonly direction: string;
  readonly severity: string;
  readonly importance: string;
  readonly priorityBand: RuntimeExecutiveInsightPriorityBand;
  readonly priorityScore?: number;
  readonly urgency: string;
  readonly executiveRelevance: string;
  readonly attentionState: RuntimeExecutiveInsightPriorityAttentionState;
  readonly confidence?: number;
  readonly freshness?: string;
  readonly scope?: string;
  readonly evidenceRefs: ReadonlyArray<string>;
  readonly signalRefs: ReadonlyArray<string>;
  readonly relationshipRefs: ReadonlyArray<string>;
  readonly contributions?: ReadonlyArray<RuntimeExecutiveInsightPriorityContribution>;
  readonly provenance?: Readonly<{ sourceKind: string; sourceId?: string }>;
  readonly lifecycle?: Readonly<{ status: string }>;
  readonly kpiRefs: ReadonlyArray<string>;
  readonly koiRefs: ReadonlyArray<string>;
  readonly decisionRefs: ReadonlyArray<string>;
  readonly executionRefs: ReadonlyArray<string>;
  readonly scenarioRefs: ReadonlyArray<string>;
  readonly problemRefs: ReadonlyArray<string>;
  readonly packRefs: ReadonlyArray<string>;
  readonly interactions: ReadonlyArray<RuntimeExecutiveInsightInteractionDescriptor>;
  readonly emphasis: RuntimeExecutiveInsightPresentationEmphasis;
  readonly density: RuntimeExecutiveInsightPresentationDensity;
  readonly visibleFieldGroups: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly fieldOrder: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
}

export type RuntimeExecutiveInsightPresentationDescriptor =
  | RuntimeExecutiveInsightMinimumDescriptor
  | RuntimeExecutiveInsightReportDescriptor
  | RuntimeExecutiveInsightOperationDescriptor;

export interface RuntimeExecutiveInsightPresentationResult {
  readonly status: RuntimeExecutiveInsightPresentationEligibilityStatus;
  readonly requestedState: RuntimeExecutiveInsightPresentationState;
  readonly resolvedState?: RuntimeExecutiveInsightPresentationState;
  readonly descriptor?: RuntimeExecutiveInsightPresentationDescriptor;
  readonly eligibility: RuntimeExecutiveInsightPresentationEligibility;
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightPresentationReasonCode>;
  readonly omittedFieldGroups: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly presentationIdentity: typeof runtimeExecutiveInsightPresentationIdentity;
  readonly presentationVersion: typeof runtimeExecutiveInsightPresentationVersion;
}

export interface RuntimeExecutiveInsightPresentationValidationIssue {
  readonly code: RuntimeExecutiveInsightPresentationReasonCode;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeExecutiveInsightPresentationValidationResult {
  readonly valid: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightPresentationValidationIssue>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function includesValue<T>(
  collection: readonly T[],
  value: unknown,
): value is T {
  return (collection as readonly unknown[]).includes(value);
}

export function isRuntimeExecutiveInsightPresentationState(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationState {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES, value);
}

export function isRuntimeExecutiveInsightPresentationEligibilityStatus(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationEligibilityStatus {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES,
    value,
  );
}

export function isRuntimeExecutiveInsightPresentationDensity(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationDensity {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES,
    value,
  );
}

export function isRuntimeExecutiveInsightPresentationEmphasisLevel(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationEmphasisLevel {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS,
    value,
  );
}

export function isRuntimeExecutiveInsightPresentationFieldGroup(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationFieldGroup {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS,
    value,
  );
}

export function isRuntimeExecutiveInsightPresentationInteractionKind(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationInteractionKind {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS,
    value,
  );
}

export function isRuntimeExecutiveInsightPresentationReasonCode(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationReasonCode {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES,
    value,
  );
}

function issue(
  code: RuntimeExecutiveInsightPresentationReasonCode,
  path?: string,
  details?: Readonly<Record<string, string | number | boolean>>,
): RuntimeExecutiveInsightPresentationValidationIssue {
  return Object.freeze({
    code,
    ...(path !== undefined ? { path } : {}),
    ...(details !== undefined ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function freezeStrings(values: readonly string[]): ReadonlyArray<string> {
  return Object.freeze([...values]);
}

function subjectRef(
  subject: RuntimeExecutiveInsightPresentationCandidate["primarySubject"],
): RuntimeExecutiveInsightPresentationSubjectReference {
  return Object.freeze({
    subjectId: subject.subjectId,
    kind: subject.kind,
    ...(typeof subject.label === "string" ? { label: subject.label } : {}),
    ...(typeof subject.scope === "string" ? { scope: subject.scope } : {}),
  });
}

function hasRequiredSubject(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
): boolean {
  return (
    isPlainObject(candidate.primarySubject) &&
    isNonEmptyString(candidate.primarySubject.subjectId) &&
    isNonEmptyString(candidate.primarySubject.kind)
  );
}

function hasReportData(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  priority: RuntimeExecutiveInsightPriorityResult,
): boolean {
  return (
    hasRequiredSubject(candidate) &&
    isNonEmptyString(candidate.category) &&
    isNonEmptyString(candidate.severity) &&
    isNonEmptyString(candidate.importance) &&
    isRuntimeExecutiveInsightPriorityBand(priority.priorityBand) &&
    isRuntimeExecutiveInsightPriorityAttentionState(priority.attentionState)
  );
}

function hasOperationContext(
  context: RuntimeExecutiveInsightPresentationContext,
  candidate: RuntimeExecutiveInsightPresentationCandidate,
): boolean {
  const refs = [
    ...(context.decisionRefs ?? []),
    ...(context.executionRefs ?? []),
    ...(context.scenarioRefs ?? []),
    ...(context.problemRefs ?? []),
    ...(context.packRefs ?? []),
  ];
  if (refs.length > 0) return true;
  return candidate.relatedSubjects.some((entry) =>
    ["decision", "execution", "scenario", "problem", "pack"].includes(
      entry.subject.kind,
    ),
  );
}

export function validateRuntimeExecutiveInsightPresentationPolicy(
  value: unknown,
): RuntimeExecutiveInsightPresentationValidationResult {
  const issues: RuntimeExecutiveInsightPresentationValidationIssue[] = [];
  if (!isPlainObject(value) || !isNonEmptyString(value.policyId)) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-policy", "policy")]),
    });
  }
  if (value.allowedStates !== undefined) {
    if (!Array.isArray(value.allowedStates)) {
      issues.push(issue("invalid-policy", "policy.allowedStates"));
    } else {
      for (const state of value.allowedStates) {
        if (!isRuntimeExecutiveInsightPresentationState(state)) {
          issues.push(issue("invalid-policy", "policy.allowedStates"));
        }
      }
    }
  }
  if (value.hiddenFieldGroups !== undefined) {
    if (!Array.isArray(value.hiddenFieldGroups)) {
      issues.push(issue("invalid-policy", "policy.hiddenFieldGroups"));
    } else {
      for (const group of value.hiddenFieldGroups) {
        if (!isRuntimeExecutiveInsightPresentationFieldGroup(group)) {
          issues.push(issue("invalid-policy", "policy.hiddenFieldGroups"));
        }
      }
    }
  }
  for (const key of [
    "maxEvidenceRefs",
    "maxSignalRefs",
    "maxRelationshipRefs",
    "maxInteractions",
  ] as const) {
    const numeric = value[key];
    if (
      numeric !== undefined &&
      (typeof numeric !== "number" ||
        !Number.isFinite(numeric) ||
        numeric < 0 ||
        !Number.isInteger(numeric))
    ) {
      issues.push(issue("invalid-policy", `policy.${key}`));
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveInsightPresentationInput(
  value: unknown,
): RuntimeExecutiveInsightPresentationValidationResult {
  const issues: RuntimeExecutiveInsightPresentationValidationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-input", "input")]),
    });
  }
  if (!isPlainObject(value.priority) || !isNonEmptyString(value.priority.candidateId)) {
    issues.push(issue("invalid-input", "priority"));
  }
  if (!isPlainObject(value.candidate) || !isNonEmptyString(value.candidate.candidateId)) {
    issues.push(issue("invalid-input", "candidate"));
  }
  if (!isRuntimeExecutiveInsightPresentationState(value.requestedState)) {
    issues.push(issue("invalid-requested-state", "requestedState"));
  }
  if (!isPlainObject(value.context)) {
    issues.push(issue("invalid-input", "context"));
  }
  const policyValidation = validateRuntimeExecutiveInsightPresentationPolicy(
    value.policy,
  );
  if (!policyValidation.valid) {
    issues.push(...policyValidation.issues);
  }
  if (
    isPlainObject(value.priority) &&
    isPlainObject(value.candidate) &&
    value.priority.candidateId !== value.candidate.candidateId
  ) {
    issues.push(issue("invalid-input", "candidateId-mismatch"));
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function resolveDensity(
  state: RuntimeExecutiveInsightPresentationState,
  policy: RuntimeExecutiveInsightPresentationPolicy,
  context: RuntimeExecutiveInsightPresentationContext,
): RuntimeExecutiveInsightPresentationDensity {
  if (
    context.densityConstraint !== undefined &&
    isRuntimeExecutiveInsightPresentationDensity(context.densityConstraint)
  ) {
    return context.densityConstraint;
  }
  const fromPolicy = policy.densityByState?.[state];
  if (
    fromPolicy !== undefined &&
    isRuntimeExecutiveInsightPresentationDensity(fromPolicy)
  ) {
    return fromPolicy;
  }
  return DEFAULT_STATE_DENSITY[state];
}

function maxEmphasis(
  left: RuntimeExecutiveInsightPresentationEmphasisLevel,
  right: RuntimeExecutiveInsightPresentationEmphasisLevel,
): RuntimeExecutiveInsightPresentationEmphasisLevel {
  const order = RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS;
  return order.indexOf(left) >= order.indexOf(right) ? left : right;
}

export function resolveRuntimeExecutiveInsightPresentationEmphasis(
  priority: RuntimeExecutiveInsightPriorityResult,
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  context: RuntimeExecutiveInsightPresentationContext,
): RuntimeExecutiveInsightPresentationEmphasis {
  const reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[] = [];

  let attentionEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel =
    "none";
  switch (priority.attentionState) {
    case "urgent":
      attentionEmphasis = "critical";
      break;
    case "focus":
      attentionEmphasis = "strong";
      break;
    case "notice":
      attentionEmphasis = "normal";
      break;
    case "background":
      attentionEmphasis = "subtle";
      break;
    default:
      attentionEmphasis = "none";
  }
  if (attentionEmphasis !== "none") {
    reasonCodes.push("attention-emphasis-applied");
  }

  let priorityEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel =
    "none";
  switch (priority.priorityBand) {
    case "critical":
      priorityEmphasis = "critical";
      break;
    case "high":
      priorityEmphasis = "strong";
      break;
    case "medium":
      priorityEmphasis = "normal";
      break;
    case "low":
      priorityEmphasis = "subtle";
      break;
    default:
      priorityEmphasis = "none";
  }
  if (priorityEmphasis !== "none") {
    reasonCodes.push("priority-emphasis-applied");
  }

  let severityEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel =
    "none";
  switch (candidate.severity) {
    case "critical":
      severityEmphasis = "critical";
      break;
    case "high":
      severityEmphasis = "strong";
      break;
    case "moderate":
      severityEmphasis = "normal";
      break;
    case "low":
      severityEmphasis = "subtle";
      break;
    default:
      severityEmphasis = "none";
  }

  const confidenceEmphasis: RuntimeExecutiveInsightPresentationEmphasisLevel =
    candidate.confidence >= 0.85
      ? "strong"
      : candidate.confidence >= 0.6
        ? "normal"
        : candidate.confidence >= 0.3
          ? "subtle"
          : "none";

  const focusRelevance =
    context.focusedSubjectId === candidate.primarySubject.subjectId ||
    context.selectedSubjectId === candidate.primarySubject.subjectId;

  const level = maxEmphasis(
    attentionEmphasis,
    maxEmphasis(priorityEmphasis, severityEmphasis),
  );

  return Object.freeze({
    level,
    attentionEmphasis,
    priorityEmphasis,
    severityEmphasis,
    confidenceEmphasis,
    focusRelevance,
    reasonCodes: Object.freeze(reasonCodes),
  });
}

function collectKpiRefs(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
): ReadonlyArray<string> {
  const refs: string[] = [];
  if (candidate.primarySubject.kind === "kpi") {
    refs.push(candidate.primarySubject.subjectId);
  }
  for (const related of candidate.relatedSubjects) {
    if (related.subject.kind === "kpi") {
      refs.push(related.subject.subjectId);
    }
  }
  return freezeStrings(refs);
}

function collectKoiRefs(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
): ReadonlyArray<string> {
  const refs: string[] = [];
  if (candidate.primarySubject.kind === "koi") {
    refs.push(candidate.primarySubject.subjectId);
  }
  for (const related of candidate.relatedSubjects) {
    if (related.subject.kind === "koi") {
      refs.push(related.subject.subjectId);
    }
  }
  return freezeStrings(refs);
}

function limitRefs(
  values: ReadonlyArray<string>,
  max: number | undefined,
  limitedCodes: RuntimeExecutiveInsightPresentationReasonCode[],
  code: RuntimeExecutiveInsightPresentationReasonCode,
): ReadonlyArray<string> {
  if (max === undefined || values.length <= max) {
    return freezeStrings(values);
  }
  limitedCodes.push(code);
  return freezeStrings(values.slice(0, max));
}

function filterFieldGroups(
  groups: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>,
  policy: RuntimeExecutiveInsightPresentationPolicy,
  reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[],
): {
  readonly visible: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly omitted: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
} {
  const hidden = new Set(policy.hiddenFieldGroups ?? []);
  const visible: RuntimeExecutiveInsightPresentationFieldGroup[] = [];
  const omitted: RuntimeExecutiveInsightPresentationFieldGroup[] = [];
  for (const group of RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS) {
    if (!groups.includes(group)) continue;
    if (hidden.has(group)) {
      omitted.push(group);
      if (!reasonCodes.includes("field-hidden-by-policy")) {
        reasonCodes.push("field-hidden-by-policy");
      }
      continue;
    }
    visible.push(group);
  }
  return {
    visible: Object.freeze(visible),
    omitted: Object.freeze(omitted),
  };
}

function baseMinimumGroups(
  policy: RuntimeExecutiveInsightPresentationPolicy,
): RuntimeExecutiveInsightPresentationFieldGroup[] {
  const groups: RuntimeExecutiveInsightPresentationFieldGroup[] = [
    "identity",
    "subject",
    "classification",
    "priority",
    "attention",
  ];
  if (policy.showConfidenceInMinimum === true) {
    groups.push("confidence");
  }
  if (policy.showEvidenceCountInMinimum === true) {
    groups.push("evidence");
  }
  return groups;
}

function baseReportGroups(): RuntimeExecutiveInsightPresentationFieldGroup[] {
  return [
    "identity",
    "subject",
    "classification",
    "priority",
    "attention",
    "confidence",
    "freshness",
    "scope",
    "evidence",
    "signals",
    "relationships",
    "provenance",
    "lifecycle",
    "kpi-context",
    "koi-context",
  ];
}

function baseOperationGroups(): RuntimeExecutiveInsightPresentationFieldGroup[] {
  return [
    ...baseReportGroups(),
    "decision-context",
    "scenario-context",
    "execution-context",
    "pack-context",
    "interactions",
  ];
}

export function resolveRuntimeExecutiveInsightInteractions(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  context: RuntimeExecutiveInsightPresentationContext,
  policy: RuntimeExecutiveInsightPresentationPolicy,
): ReadonlyArray<RuntimeExecutiveInsightInteractionDescriptor> {
  const interactions: RuntimeExecutiveInsightInteractionDescriptor[] = [];
  let order = 0;

  const push = (
    kind: RuntimeExecutiveInsightPresentationInteractionKind,
    extras?: {
      readonly targetRef?: string;
      readonly subjectId?: string;
      readonly evidenceId?: string;
      readonly relationshipId?: string;
    },
  ) => {
    interactions.push(
      Object.freeze({
        interactionId: `insight.interaction:${kind}:${order}`,
        kind,
        order,
        ...(extras?.targetRef !== undefined
          ? { targetRef: extras.targetRef }
          : {}),
        ...(extras?.subjectId !== undefined
          ? { subjectId: extras.subjectId }
          : {}),
        ...(extras?.evidenceId !== undefined
          ? { evidenceId: extras.evidenceId }
          : {}),
        ...(extras?.relationshipId !== undefined
          ? { relationshipId: extras.relationshipId }
          : {}),
      }),
    );
    order += 1;
  };

  push("inspect", { targetRef: candidate.candidateId });
  push("focus-subject", {
    subjectId: candidate.primarySubject.subjectId,
    targetRef: candidate.primarySubject.subjectId,
  });

  if (candidate.evidenceIds.length > 0) {
    push("inspect-evidence", {
      evidenceId: candidate.evidenceIds[0],
      targetRef: candidate.evidenceIds[0],
    });
  }

  if (candidate.relationships.length > 0) {
    push("inspect-relationship", {
      relationshipId: candidate.relationships[0]!.relationshipId,
      targetRef: candidate.relationships[0]!.relationshipId,
    });
  }

  if (policy.allowCompare !== false && candidate.relatedSubjects.length > 0) {
    push("compare", {
      subjectId: candidate.relatedSubjects[0]!.subject.subjectId,
      targetRef: candidate.relatedSubjects[0]!.subject.subjectId,
    });
  }

  if (candidate.relatedSubjects.length > 0) {
    push("open-related", {
      subjectId: candidate.relatedSubjects[0]!.subject.subjectId,
      targetRef: candidate.relatedSubjects[0]!.subject.subjectId,
    });
  }

  if (policy.allowAskAdvisor !== false) {
    push("ask-advisor", { targetRef: candidate.candidateId });
  }

  const decisionRefs = context.decisionRefs ?? [];
  if (decisionRefs.length > 0) {
    push("review-decision", { targetRef: decisionRefs[0] });
  }

  const executionRefs = context.executionRefs ?? [];
  if (executionRefs.length > 0) {
    push("review-execution", { targetRef: executionRefs[0] });
  }

  const max = policy.maxInteractions;
  if (max !== undefined && interactions.length > max) {
    return Object.freeze(interactions.slice(0, max));
  }
  return Object.freeze(interactions);
}

function buildMinimumDescriptor(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  priority: RuntimeExecutiveInsightPriorityResult,
  policy: RuntimeExecutiveInsightPresentationPolicy,
  context: RuntimeExecutiveInsightPresentationContext,
  reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[],
): {
  readonly descriptor: RuntimeExecutiveInsightMinimumDescriptor;
  readonly omitted: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
} {
  const emphasis = resolveRuntimeExecutiveInsightPresentationEmphasis(
    priority,
    candidate,
    context,
  );
  reasonCodes.push(...emphasis.reasonCodes);
  const groups = filterFieldGroups(
    baseMinimumGroups(policy),
    policy,
    reasonCodes,
  );
  if (policy.showConfidenceInMinimum !== true) {
    reasonCodes.push("confidence-hidden");
  }
  const descriptor: RuntimeExecutiveInsightMinimumDescriptor = Object.freeze({
    insightId: candidate.candidateId,
    presentationState: "minimum",
    subjectReference: subjectRef(candidate.primarySubject),
    category: candidate.category,
    direction: candidate.direction,
    priorityBand: priority.priorityBand,
    attentionState: priority.attentionState,
    compactSeverity: candidate.severity,
    compactImportance: candidate.importance,
    compactStatus: priority.suppressionState,
    ...(policy.showEvidenceCountInMinimum === true
      ? { evidenceCount: candidate.evidenceIds.length }
      : {}),
    emphasis,
    density: resolveDensity("minimum", policy, context),
    visibleFieldGroups: groups.visible,
    fieldOrder: groups.visible,
  });
  return { descriptor, omitted: groups.omitted };
}

function buildReportDescriptor(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  priority: RuntimeExecutiveInsightPriorityResult,
  policy: RuntimeExecutiveInsightPresentationPolicy,
  context: RuntimeExecutiveInsightPresentationContext,
  reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[],
): {
  readonly descriptor: RuntimeExecutiveInsightReportDescriptor;
  readonly omitted: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
} {
  const emphasis = resolveRuntimeExecutiveInsightPresentationEmphasis(
    priority,
    candidate,
    context,
  );
  reasonCodes.push(...emphasis.reasonCodes);

  const evidenceRefs = limitRefs(
    candidate.evidenceIds,
    policy.maxEvidenceRefs,
    reasonCodes,
    "evidence-limited",
  );
  const signalRefs = limitRefs(
    candidate.signalIds,
    policy.maxSignalRefs,
    reasonCodes,
    "evidence-limited",
  );
  const relationshipRefs = limitRefs(
    candidate.relationships.map((entry) => entry.relationshipId),
    policy.maxRelationshipRefs,
    reasonCodes,
    "relationship-limited",
  );

  const groups = filterFieldGroups(baseReportGroups(), policy, reasonCodes);
  const showProvenance = policy.showProvenance !== false;
  if (!showProvenance) {
    reasonCodes.push("provenance-hidden");
  }

  const descriptor: RuntimeExecutiveInsightReportDescriptor = Object.freeze({
    insightId: candidate.candidateId,
    presentationState: "report",
    subjectReference: subjectRef(candidate.primarySubject),
    primarySubject: subjectRef(candidate.primarySubject),
    relatedSubjects: Object.freeze(
      candidate.relatedSubjects.map((entry) => subjectRef(entry.subject)),
    ),
    category: candidate.category,
    direction: candidate.direction,
    severity: candidate.severity,
    importance: candidate.importance,
    priorityBand: priority.priorityBand,
    ...(policy.showPriorityScore === true
      ? { priorityScore: priority.priorityScore }
      : {}),
    urgency: priority.urgency,
    executiveRelevance: priority.executiveRelevance,
    attentionState: priority.attentionState,
    ...(groups.visible.includes("confidence")
      ? { confidence: candidate.confidence }
      : {}),
    ...(groups.visible.includes("freshness")
      ? { freshness: candidate.freshness }
      : {}),
    ...(groups.visible.includes("scope") ? { scope: candidate.scope } : {}),
    evidenceRefs,
    signalRefs,
    relationshipRefs,
    ...(policy.showContributions !== false
      ? { contributions: priority.contributions }
      : {}),
    ...(showProvenance && groups.visible.includes("provenance")
      ? {
          provenance: Object.freeze({
            sourceKind: candidate.source.kind,
            ...(candidate.source.sourceId !== undefined
              ? { sourceId: candidate.source.sourceId }
              : {}),
          }),
        }
      : {}),
    ...(groups.visible.includes("lifecycle")
      ? { lifecycle: Object.freeze({ status: "active" }) }
      : {}),
    kpiRefs: collectKpiRefs(candidate),
    koiRefs: collectKoiRefs(candidate),
    emphasis,
    density: resolveDensity("report", policy, context),
    visibleFieldGroups: groups.visible,
    fieldOrder: groups.visible,
  });
  return { descriptor, omitted: groups.omitted };
}

function buildOperationDescriptor(
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  priority: RuntimeExecutiveInsightPriorityResult,
  policy: RuntimeExecutiveInsightPresentationPolicy,
  context: RuntimeExecutiveInsightPresentationContext,
  reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[],
): {
  readonly descriptor: RuntimeExecutiveInsightOperationDescriptor;
  readonly omitted: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
} {
  const report = buildReportDescriptor(
    candidate,
    priority,
    policy,
    context,
    reasonCodes,
  );
  const interactions = resolveRuntimeExecutiveInsightInteractions(
    candidate,
    context,
    policy,
  );
  if (interactions.length === 0) {
    reasonCodes.push("interaction-unavailable");
  }
  const groups = filterFieldGroups(baseOperationGroups(), policy, reasonCodes);

  const descriptor: RuntimeExecutiveInsightOperationDescriptor = Object.freeze({
    insightId: report.descriptor.insightId,
    presentationState: "operation",
    subjectReference: report.descriptor.subjectReference,
    primarySubject: report.descriptor.primarySubject,
    relatedSubjects: report.descriptor.relatedSubjects,
    category: report.descriptor.category,
    direction: report.descriptor.direction,
    severity: report.descriptor.severity,
    importance: report.descriptor.importance,
    priorityBand: report.descriptor.priorityBand,
    ...(report.descriptor.priorityScore !== undefined
      ? { priorityScore: report.descriptor.priorityScore }
      : {}),
    urgency: report.descriptor.urgency,
    executiveRelevance: report.descriptor.executiveRelevance,
    attentionState: report.descriptor.attentionState,
    ...(report.descriptor.confidence !== undefined
      ? { confidence: report.descriptor.confidence }
      : {}),
    ...(report.descriptor.freshness !== undefined
      ? { freshness: report.descriptor.freshness }
      : {}),
    ...(report.descriptor.scope !== undefined
      ? { scope: report.descriptor.scope }
      : {}),
    evidenceRefs: report.descriptor.evidenceRefs,
    signalRefs: report.descriptor.signalRefs,
    relationshipRefs: report.descriptor.relationshipRefs,
    ...(report.descriptor.contributions !== undefined
      ? { contributions: report.descriptor.contributions }
      : {}),
    ...(report.descriptor.provenance !== undefined
      ? { provenance: report.descriptor.provenance }
      : {}),
    ...(report.descriptor.lifecycle !== undefined
      ? { lifecycle: report.descriptor.lifecycle }
      : {}),
    kpiRefs: report.descriptor.kpiRefs,
    koiRefs: report.descriptor.koiRefs,
    decisionRefs: freezeStrings(context.decisionRefs ?? []),
    executionRefs: freezeStrings(context.executionRefs ?? []),
    scenarioRefs: freezeStrings(context.scenarioRefs ?? []),
    problemRefs: freezeStrings(context.problemRefs ?? []),
    packRefs: freezeStrings(context.packRefs ?? []),
    interactions,
    emphasis: report.descriptor.emphasis,
    density: resolveDensity("operation", policy, context),
    visibleFieldGroups: groups.visible,
    fieldOrder: groups.visible,
  });

  return {
    descriptor,
    omitted: Object.freeze([
      ...new Set([...report.omitted, ...groups.omitted]),
    ]),
  };
}

function allowedStates(
  policy: RuntimeExecutiveInsightPresentationPolicy,
): ReadonlyArray<RuntimeExecutiveInsightPresentationState> {
  return policy.allowedStates ?? RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES;
}

function canUseState(
  state: RuntimeExecutiveInsightPresentationState,
  policy: RuntimeExecutiveInsightPresentationPolicy,
): boolean {
  return allowedStates(policy).includes(state);
}

function resolveTargetState(
  requested: RuntimeExecutiveInsightPresentationState,
  candidate: RuntimeExecutiveInsightPresentationCandidate,
  priority: RuntimeExecutiveInsightPriorityResult,
  context: RuntimeExecutiveInsightPresentationContext,
  policy: RuntimeExecutiveInsightPresentationPolicy,
): {
  readonly status: RuntimeExecutiveInsightPresentationEligibilityStatus;
  readonly resolvedState?: RuntimeExecutiveInsightPresentationState;
  readonly reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[];
} {
  const reasonCodes: RuntimeExecutiveInsightPresentationReasonCode[] = [];

  if (!hasRequiredSubject(candidate)) {
    return {
      status: "invalid",
      reasonCodes: ["missing-required-subject", "invalid-input"],
    };
  }

  if (!canUseState(requested, policy)) {
    return {
      status: "ineligible",
      reasonCodes: ["restricted-state", "invalid-requested-state"],
    };
  }

  const allowDowngrade = policy.allowDowngrade !== false;

  if (requested === "minimum") {
    reasonCodes.push("eligible-minimum");
    return { status: "eligible", resolvedState: "minimum", reasonCodes };
  }

  if (requested === "report") {
    if (!hasReportData(candidate, priority)) {
      if (allowDowngrade && canUseState("minimum", policy)) {
        return {
          status: "restricted",
          resolvedState: "minimum",
          reasonCodes: [
            "missing-report-data",
            "state-downgraded",
            "eligible-minimum",
          ],
        };
      }
      return {
        status: "ineligible",
        reasonCodes: ["missing-report-data"],
      };
    }
    reasonCodes.push("eligible-report");
    return { status: "eligible", resolvedState: "report", reasonCodes };
  }

  // operation
  if (!hasReportData(candidate, priority)) {
    if (allowDowngrade && canUseState("minimum", policy)) {
      return {
        status: "restricted",
        resolvedState: "minimum",
        reasonCodes: [
          "missing-report-data",
          "state-downgraded",
          "eligible-minimum",
        ],
      };
    }
    return {
      status: "ineligible",
      reasonCodes: ["missing-report-data"],
    };
  }

  const requireOp = policy.requireOperationContext !== false;
  if (requireOp && !hasOperationContext(context, candidate)) {
    if (allowDowngrade && canUseState("report", policy)) {
      return {
        status: "restricted",
        resolvedState: "report",
        reasonCodes: [
          "missing-operation-context",
          "state-downgraded",
          "restricted-state",
          "eligible-report",
        ],
      };
    }
    if (allowDowngrade && canUseState("minimum", policy)) {
      return {
        status: "restricted",
        resolvedState: "minimum",
        reasonCodes: [
          "missing-operation-context",
          "state-downgraded",
          "eligible-minimum",
        ],
      };
    }
    return {
      status: "ineligible",
      reasonCodes: ["missing-operation-context"],
    };
  }

  reasonCodes.push("eligible-operation");
  return { status: "eligible", resolvedState: "operation", reasonCodes };
}

function emptyResult(
  input: Partial<RuntimeExecutiveInsightPresentationInput>,
  status: RuntimeExecutiveInsightPresentationEligibilityStatus,
  reasonCodes: ReadonlyArray<RuntimeExecutiveInsightPresentationReasonCode>,
): RuntimeExecutiveInsightPresentationResult {
  const requestedState =
    input.requestedState !== undefined &&
    isRuntimeExecutiveInsightPresentationState(input.requestedState)
      ? input.requestedState
      : "minimum";
  return Object.freeze({
    status,
    requestedState,
    eligibility: Object.freeze({
      status,
      requestedState,
      reasonCodes: Object.freeze([...reasonCodes]),
    }),
    policyId:
      isPlainObject(input.policy) && isNonEmptyString(input.policy.policyId)
        ? input.policy.policyId
        : "",
    ...(isPlainObject(input.policy) &&
    typeof input.policy.policyVersion === "string"
      ? { policyVersion: input.policy.policyVersion }
      : {}),
    reasonCodes: Object.freeze([...reasonCodes]),
    omittedFieldGroups: Object.freeze([]),
    presentationIdentity: runtimeExecutiveInsightPresentationIdentity,
    presentationVersion: runtimeExecutiveInsightPresentationVersion,
  });
}

// ─── Primary APIs ───────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveInsightPresentation(
  input: RuntimeExecutiveInsightPresentationInput,
): RuntimeExecutiveInsightPresentationResult {
  const validation = validateRuntimeExecutiveInsightPresentationInput(input);
  if (!validation.valid) {
    return emptyResult(
      input,
      "invalid",
      validation.issues.map((entry) => entry.code),
    );
  }

  const { candidate, priority, context, policy, requestedState } = input;
  const target = resolveTargetState(
    requestedState,
    candidate,
    priority,
    context,
    policy,
  );

  if (
    target.status === "invalid" ||
    target.status === "ineligible" ||
    target.resolvedState === undefined
  ) {
    return Object.freeze({
      status: target.status,
      requestedState,
      eligibility: Object.freeze({
        status: target.status,
        requestedState,
        reasonCodes: Object.freeze([...target.reasonCodes]),
      }),
      policyId: policy.policyId,
      ...(policy.policyVersion !== undefined
        ? { policyVersion: policy.policyVersion }
        : {}),
      reasonCodes: Object.freeze([...target.reasonCodes]),
      omittedFieldGroups: Object.freeze([]),
      presentationIdentity: runtimeExecutiveInsightPresentationIdentity,
      presentationVersion: runtimeExecutiveInsightPresentationVersion,
    });
  }

  // Hard invariant: never resolve above requested state.
  if (STATE_RANK[target.resolvedState] > STATE_RANK[requestedState]) {
    return emptyResult(input, "invalid", ["invalid-requested-state"]);
  }

  const reasonCodes = [...target.reasonCodes];
  let descriptor: RuntimeExecutiveInsightPresentationDescriptor;
  let omitted: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;

  if (target.resolvedState === "minimum") {
    const built = buildMinimumDescriptor(
      candidate,
      priority,
      policy,
      context,
      reasonCodes,
    );
    descriptor = built.descriptor;
    omitted = built.omitted;
  } else if (target.resolvedState === "report") {
    const built = buildReportDescriptor(
      candidate,
      priority,
      policy,
      context,
      reasonCodes,
    );
    descriptor = built.descriptor;
    omitted = built.omitted;
  } else {
    const built = buildOperationDescriptor(
      candidate,
      priority,
      policy,
      context,
      reasonCodes,
    );
    descriptor = built.descriptor;
    omitted = built.omitted;
  }

  const uniqueReasons = Object.freeze([
    ...new Set(reasonCodes),
  ]) as ReadonlyArray<RuntimeExecutiveInsightPresentationReasonCode>;

  return Object.freeze({
    status: target.status,
    requestedState,
    resolvedState: target.resolvedState,
    descriptor,
    eligibility: Object.freeze({
      status: target.status,
      requestedState,
      resolvedState: target.resolvedState,
      reasonCodes: uniqueReasons,
    }),
    policyId: policy.policyId,
    ...(policy.policyVersion !== undefined
      ? { policyVersion: policy.policyVersion }
      : {}),
    reasonCodes: uniqueReasons,
    omittedFieldGroups: omitted,
    presentationIdentity: runtimeExecutiveInsightPresentationIdentity,
    presentationVersion: runtimeExecutiveInsightPresentationVersion,
  });
}

export function resolveRuntimeExecutiveInsightMinimumPresentation(
  input: Omit<RuntimeExecutiveInsightPresentationInput, "requestedState">,
): RuntimeExecutiveInsightPresentationResult {
  return resolveRuntimeExecutiveInsightPresentation({
    ...input,
    requestedState: "minimum",
  });
}

export function resolveRuntimeExecutiveInsightReportPresentation(
  input: Omit<RuntimeExecutiveInsightPresentationInput, "requestedState">,
): RuntimeExecutiveInsightPresentationResult {
  return resolveRuntimeExecutiveInsightPresentation({
    ...input,
    requestedState: "report",
  });
}

export function resolveRuntimeExecutiveInsightOperationPresentation(
  input: Omit<RuntimeExecutiveInsightPresentationInput, "requestedState">,
): RuntimeExecutiveInsightPresentationResult {
  return resolveRuntimeExecutiveInsightPresentation({
    ...input,
    requestedState: "operation",
  });
}

export function createRuntimeExecutiveInsightPresentationPolicy(input: {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly allowedStates?: ReadonlyArray<RuntimeExecutiveInsightPresentationState>;
  readonly hiddenFieldGroups?: ReadonlyArray<RuntimeExecutiveInsightPresentationFieldGroup>;
  readonly showPriorityScore?: boolean;
  readonly showContributions?: boolean;
  readonly showProvenance?: boolean;
  readonly showConfidenceInMinimum?: boolean;
  readonly showEvidenceCountInMinimum?: boolean;
  readonly maxEvidenceRefs?: number;
  readonly maxSignalRefs?: number;
  readonly maxRelationshipRefs?: number;
  readonly maxInteractions?: number;
  readonly allowDowngrade?: boolean;
  readonly requireOperationContext?: boolean;
  readonly densityByState?: Partial<
    Record<
      RuntimeExecutiveInsightPresentationState,
      RuntimeExecutiveInsightPresentationDensity
    >
  >;
  readonly allowAskAdvisor?: boolean;
  readonly allowCompare?: boolean;
}): RuntimeExecutiveInsightPresentationPolicy {
  const policy = Object.freeze({
    policyId: input.policyId,
    ...(input.policyVersion !== undefined
      ? { policyVersion: input.policyVersion }
      : {}),
    ...(input.allowedStates !== undefined
      ? { allowedStates: Object.freeze([...input.allowedStates]) }
      : {}),
    ...(input.hiddenFieldGroups !== undefined
      ? { hiddenFieldGroups: Object.freeze([...input.hiddenFieldGroups]) }
      : {}),
    ...(input.showPriorityScore !== undefined
      ? { showPriorityScore: input.showPriorityScore }
      : {}),
    ...(input.showContributions !== undefined
      ? { showContributions: input.showContributions }
      : {}),
    ...(input.showProvenance !== undefined
      ? { showProvenance: input.showProvenance }
      : {}),
    ...(input.showConfidenceInMinimum !== undefined
      ? { showConfidenceInMinimum: input.showConfidenceInMinimum }
      : {}),
    ...(input.showEvidenceCountInMinimum !== undefined
      ? { showEvidenceCountInMinimum: input.showEvidenceCountInMinimum }
      : {}),
    ...(input.maxEvidenceRefs !== undefined
      ? { maxEvidenceRefs: input.maxEvidenceRefs }
      : {}),
    ...(input.maxSignalRefs !== undefined
      ? { maxSignalRefs: input.maxSignalRefs }
      : {}),
    ...(input.maxRelationshipRefs !== undefined
      ? { maxRelationshipRefs: input.maxRelationshipRefs }
      : {}),
    ...(input.maxInteractions !== undefined
      ? { maxInteractions: input.maxInteractions }
      : {}),
    ...(input.allowDowngrade !== undefined
      ? { allowDowngrade: input.allowDowngrade }
      : {}),
    ...(input.requireOperationContext !== undefined
      ? { requireOperationContext: input.requireOperationContext }
      : {}),
    ...(input.densityByState !== undefined
      ? { densityByState: Object.freeze({ ...input.densityByState }) }
      : {}),
    ...(input.allowAskAdvisor !== undefined
      ? { allowAskAdvisor: input.allowAskAdvisor }
      : {}),
    ...(input.allowCompare !== undefined
      ? { allowCompare: input.allowCompare }
      : {}),
  });
  const validated = validateRuntimeExecutiveInsightPresentationPolicy(policy);
  if (!validated.valid) {
    throw new TypeError(
      `invalid presentation policy: ${validated.issues[0]?.code ?? "invalid-policy"}`,
    );
  }
  return policy;
}

export function getRuntimeExecutiveInsightPresentationIdentity():
  typeof runtimeExecutiveInsightPresentationCanonicalIdentity {
  return runtimeExecutiveInsightPresentationCanonicalIdentity;
}

export function getRuntimeExecutiveInsightPresentationRegistry():
  typeof runtimeExecutiveInsightPresentationRegistry {
  return runtimeExecutiveInsightPresentationRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightPresentationApiNames = Object.freeze([
  "getRuntimeExecutiveInsightPresentationIdentity",
  "getRuntimeExecutiveInsightPresentationRegistry",
  "isRuntimeExecutiveInsightPresentationState",
  "isRuntimeExecutiveInsightPresentationEligibilityStatus",
  "isRuntimeExecutiveInsightPresentationDensity",
  "isRuntimeExecutiveInsightPresentationEmphasisLevel",
  "isRuntimeExecutiveInsightPresentationFieldGroup",
  "isRuntimeExecutiveInsightPresentationInteractionKind",
  "isRuntimeExecutiveInsightPresentationReasonCode",
  "validateRuntimeExecutiveInsightPresentationPolicy",
  "validateRuntimeExecutiveInsightPresentationInput",
  "createRuntimeExecutiveInsightPresentationPolicy",
  "resolveRuntimeExecutiveInsightPresentationEmphasis",
  "resolveRuntimeExecutiveInsightInteractions",
  "resolveRuntimeExecutiveInsightPresentation",
  "resolveRuntimeExecutiveInsightMinimumPresentation",
  "resolveRuntimeExecutiveInsightReportPresentation",
  "resolveRuntimeExecutiveInsightOperationPresentation",
  "verifyRuntimeExecutiveInsightPresentation",
] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightPresentationState",
    "RuntimeExecutiveInsightPresentationEligibilityStatus",
    "RuntimeExecutiveInsightPresentationDensity",
    "RuntimeExecutiveInsightPresentationEmphasisLevel",
    "RuntimeExecutiveInsightPresentationFieldGroup",
    "RuntimeExecutiveInsightPresentationInteractionKind",
    "RuntimeExecutiveInsightPresentationReasonCode",
    "RuntimeExecutiveInsightPresentationCandidate",
    "RuntimeExecutiveInsightPresentationSubjectReference",
    "RuntimeExecutiveInsightPresentationEmphasis",
    "RuntimeExecutiveInsightInteractionDescriptor",
    "RuntimeExecutiveInsightPresentationPolicy",
    "RuntimeExecutiveInsightPresentationContext",
    "RuntimeExecutiveInsightPresentationInput",
    "RuntimeExecutiveInsightPresentationEligibility",
    "RuntimeExecutiveInsightMinimumDescriptor",
    "RuntimeExecutiveInsightReportDescriptor",
    "RuntimeExecutiveInsightOperationDescriptor",
    "RuntimeExecutiveInsightPresentationDescriptor",
    "RuntimeExecutiveInsightPresentationResult",
    "RuntimeExecutiveInsightPresentationValidationIssue",
    "RuntimeExecutiveInsightPresentationValidationResult",
    "RuntimeExecutiveInsightPresentationVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "PresentationStates",
    "EligibilityStatuses",
    "DensityValues",
    "EmphasisValues",
    "FieldGroups",
    "InteractionKinds",
    "ReasonCodes",
    "ConsumerGuarantees",
    "PublicTypes",
    "PublicApis",
  ] as const);

export const runtimeExecutiveInsightPresentationRegistry = Object.freeze({
  identity: runtimeExecutiveInsightPresentationIdentity,
  version: runtimeExecutiveInsightPresentationVersion,
  namespace: runtimeExecutiveInsightPresentationNamespace,
  layer: runtimeExecutiveInsightPresentationLayer,
  capability: runtimeExecutiveInsightPresentationCapability,
  phase: runtimeExecutiveInsightPresentationPhase,
  status: runtimeExecutiveInsightPresentationStatus,
  dependencyIdentity: runtimeExecutiveInsightPresentationDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightPresentationDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightPresentationSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REGISTRY_SECTIONS.length,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
  presentationStateCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length,
  eligibilityStatuses:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES,
  eligibilityStatusCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES.length,
  densityValues: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES,
  densityValueCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES.length,
  emphasisValues: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS,
  emphasisValueCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS.length,
  fieldGroups: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS,
  fieldGroupCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS.length,
  interactionKinds: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS,
  interactionKindCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS.length,
  reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES,
  reasonCodeCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES.length,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES,
  consumerGuaranteeCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveInsightPresentationApiNames,
  publicApiCount: runtimeExecutiveInsightPresentationApiNames.length,
  nonGoals: Object.freeze([
    "react-components",
    "css",
    "three-js",
    "advisor-prose",
    "stage-execution",
    "orchestration",
    "automation",
    "priority-recomputation",
    "attention-recomputation",
    "semantic-re-resolution",
    "kpi-calculation",
    "koi-calculation",
  ]),
});

export const runtimeExecutiveInsightPresentation = Object.freeze({
  phase: "Presentation" as const,
  name: "RuntimeExecutiveInsightPresentation" as const,
  identity: runtimeExecutiveInsightPresentationIdentity,
  version: runtimeExecutiveInsightPresentationVersion,
  namespace: runtimeExecutiveInsightPresentationNamespace,
  layer: runtimeExecutiveInsightPresentationLayer,
  capability: runtimeExecutiveInsightPresentationCapability,
  architecturalRole: runtimeExecutiveInsightPresentationArchitecturalRole,
  role: "Presentation" as const,
  status: runtimeExecutiveInsightPresentationStatus,
  upstreamDependency: runtimeExecutiveInsightPresentationDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightPresentationDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightPresentationSupportedImportPath,
  deterministic: runtimeExecutiveInsightPresentationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  pure: true as const,
  stateless: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  reactIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
  eligibilityStatuses:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES,
  densityValues: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES,
  emphasisValues: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS,
  fieldGroups: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS,
  interactionKinds: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS,
  reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_CONSUMER_GUARANTEES,
  publicTypeNames: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightPresentationApiNames,
  registry: runtimeExecutiveInsightPresentationRegistry,
  priorityAttentionBoundary: "REX-4:4-priority-attention-only" as const,
  architecturalStatus:
    "REX-4:5 Runtime Executive Insight Presentation — PresentationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightPresentationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightPresentationIdentity;
  readonly version: typeof runtimeExecutiveInsightPresentationVersion;
  readonly namespace: typeof runtimeExecutiveInsightPresentationNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightPresentationDependencyIdentity;
  readonly presentationStateCount: number;
  readonly eligibilityStatusCount: number;
  readonly densityValueCount: number;
  readonly emphasisValueCount: number;
  readonly fieldGroupCount: number;
  readonly interactionKindCount: number;
  readonly reasonCodeCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly priorityBoundaryIntact: boolean;
  readonly upstreamPriorityOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
  readonly noAutoUpgrade: boolean;
  readonly informationMonotonicity: boolean;
}

export function verifyRuntimeExecutiveInsightPresentation():
  RuntimeExecutiveInsightPresentationVerification {
  const presentationModule = runtimeExecutiveInsightPresentation;
  const registry = runtimeExecutiveInsightPresentationRegistry;
  const upstream = verifyRuntimeExecutiveInsightPriorityAttention();

  const identityOk =
    presentationModule.identity ===
      "REX-4:5/RuntimeExecutiveInsightPresentation" &&
    presentationModule.version === "4.5.0" &&
    presentationModule.namespace ===
      "nexora.rex.insight-experience.presentation" &&
    presentationModule.layer === "REX" &&
    presentationModule.capability === "RuntimeExecutiveInsightExperience" &&
    presentationModule.phase === "Presentation" &&
    presentationModule.status === "PresentationReady" &&
    presentationModule.upstreamDependency ===
      "REX-4:4/RuntimeExecutiveInsightPriorityAttention" &&
    presentationModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention" &&
    presentationModule.priorityAttentionBoundary ===
      "REX-4:4-priority-attention-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES],
      ["eligible", "ineligible", "restricted", "invalid"],
    ) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES], [
      "compact",
      "balanced",
      "detailed",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS], [
      "none",
      "subtle",
      "normal",
      "strong",
      "critical",
    ]);

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY.introducesKor === false;

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS.includes("kpi") &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY.calculatesKpi === false;
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS.includes("koi") &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY.calculatesKoi === false;

  const frozen =
    Object.isFrozen(presentationModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveInsightPresentationCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_BOUNDARY);

  const priorityBoundaryIntact =
    presentationModule.boundary.soleImmediateDependency ===
      "REX-4:4/RuntimeExecutiveInsightPriorityAttention" &&
    presentationModule.boundary.consumesPriorityAttentionOnly === true &&
    presentationModule.boundary.importsRex43Directly === false &&
    presentationModule.boundary.importsRex42Directly === false &&
    presentationModule.boundary.importsRex41Directly === false &&
    presentationModule.boundary.recalculatesPriority === false &&
    presentationModule.boundary.recalculatesAttention === false &&
    presentationModule.boundary.reresolvesInsightSemantics === false &&
    presentationModule.boundary.introducesOrchestration === false &&
    presentationModule.boundary.introducesStageExecution === false &&
    presentationModule.boundary.introducesAdvisorProse === false &&
    presentationModule.boundary.introducesAutomation === false;

  const registryCountsOk =
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length &&
    registry.fieldGroupCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS.length &&
    registry.interactionKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS.length &&
    registry.reasonCodeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightPresentationApiNames.length;

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    frozen &&
    priorityBoundaryIntact &&
    registryCountsOk &&
    upstream.ok === true &&
    presentationModule.boundary.noAutoUpgrade === true &&
    presentationModule.boundary.informationMonotonicity === true &&
    presentationModule.principle ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightPresentationIdentity,
    version: runtimeExecutiveInsightPresentationVersion,
    namespace: runtimeExecutiveInsightPresentationNamespace,
    dependencyIdentity:
      runtimeExecutiveInsightPresentationDependencyIdentity,
    presentationStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length,
    eligibilityStatusCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ELIGIBILITY_STATUSES.length,
    densityValueCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_DENSITY_VALUES.length,
    emphasisValueCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_EMPHASIS_LEVELS.length,
    fieldGroupCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_FIELD_GROUPS.length,
    interactionKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_INTERACTION_KINDS.length,
    reasonCodeCount: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REASON_CODES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveInsightPresentationApiNames.length,
    sectionCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_REGISTRY_SECTIONS.length,
    frozen,
    priorityBoundaryIntact,
    upstreamPriorityOk: upstream.ok === true,
    noKor,
    kpiSupported,
    koiSupported,
    noAutoUpgrade: presentationModule.boundary.noAutoUpgrade === true,
    informationMonotonicity:
      presentationModule.boundary.informationMonotonicity === true,
  });
}
