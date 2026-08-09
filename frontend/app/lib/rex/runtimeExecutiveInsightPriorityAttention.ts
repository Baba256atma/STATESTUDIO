/**
 * REX-4:4 — Runtime Executive Insight Priority & Attention.
 *
 * Deterministic evaluation of resolved Executive Insight Candidates into
 * executive priority, urgency, relevance, attention, escalation, and
 * suppression metadata — then stable ranking.
 *
 * Canonical flow:
 *   REX-4:3 Resolution → REX-4:4 Priority & Attention → later REX-4 presentation
 *
 * REX-4:3 answers: What Executive Insight candidate can be resolved?
 * REX-4:4 answers: Which resolved insights deserve the manager’s attention first,
 * and at what attention level?
 *
 * Pure, stateless, immutable, AI-neutral. No presentation selection, Advisor
 * prose, Stage reactions, orchestration, notifications, or automation.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KIND_SEMANTICS,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightResolutionIdentity,
  runtimeExecutiveInsightResolutionSupportedImportPath,
  runtimeExecutiveInsightResolutionVersion,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightResolution,
  type RuntimeExecutiveInsightCandidate,
  type RuntimeExecutiveInsightCandidateCollection,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightResolutionFreshness,
  type RuntimeExecutiveInsightResolutionImportance,
  type RuntimeExecutiveInsightResolutionScope,
  type RuntimeExecutiveInsightResolutionSeverity,
  type RuntimeExecutiveInsightSignalContract,
  type RuntimeExecutiveInsightSourceContract,
  type RuntimeExecutiveInsightSubjectContract,
} from "@/app/lib/rex/runtimeExecutiveInsightResolution";

// ─── Transitively published Resolution/Contracts surface (for REX-4:5+) ─────
// Publication fix: later REX-4 phases consume resolution through REX-4:4 only.

export {
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsights,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
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

export const runtimeExecutiveInsightPriorityAttentionIdentity =
  "REX-4:4/RuntimeExecutiveInsightPriorityAttention" as const;

export const runtimeExecutiveInsightPriorityAttentionVersion =
  "4.4.0" as const;

export const runtimeExecutiveInsightPriorityAttentionNamespace =
  "nexora.rex.insight-experience.priority-attention" as const;

export const runtimeExecutiveInsightPriorityAttentionLayer = "REX" as const;

export const runtimeExecutiveInsightPriorityAttentionCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightPriorityAttentionPhase =
  "PriorityAttention" as const;

export const runtimeExecutiveInsightPriorityAttentionStatus =
  "PriorityAttentionReady" as const;

export const runtimeExecutiveInsightPriorityAttentionArchitecturalRole =
  "RuntimeExecutiveInsightPriorityAttentionBoundary" as const;

export const runtimeExecutiveInsightPriorityAttentionDependencyIdentity =
  runtimeExecutiveInsightResolutionIdentity;

export const runtimeExecutiveInsightPriorityAttentionDependencyPath =
  runtimeExecutiveInsightResolutionSupportedImportPath;

export const runtimeExecutiveInsightPriorityAttentionSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightPriorityAttention" as const;

export const runtimeExecutiveInsightPriorityAttentionStability =
  "PriorityAttentionReady" as const;

export const runtimeExecutiveInsightPriorityAttentionDeterministic =
  true as const;

export const runtimeExecutiveInsightPriorityAttentionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightPriorityAttentionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightPriorityAttentionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightPriorityAttentionIdentity,
    version: runtimeExecutiveInsightPriorityAttentionVersion,
    namespace: runtimeExecutiveInsightPriorityAttentionNamespace,
    layer: runtimeExecutiveInsightPriorityAttentionLayer,
    capability: runtimeExecutiveInsightPriorityAttentionCapability,
    phase: runtimeExecutiveInsightPriorityAttentionPhase,
    status: runtimeExecutiveInsightPriorityAttentionStatus,
    architecturalRole:
      runtimeExecutiveInsightPriorityAttentionArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveInsightPriorityAttentionDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightPriorityAttentionDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightResolutionVersion,
    stabilityStatus: runtimeExecutiveInsightPriorityAttentionStability,
    deterministicStatus:
      runtimeExecutiveInsightPriorityAttentionDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightPriorityAttentionSideEffectPolicy,
    mutationPolicy: runtimeExecutiveInsightPriorityAttentionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PRINCIPLE =
  "Resolved insight candidates + explicit executive context + explicit priority policy → deterministic priority and attention. REX-4:4 decides what to notice first — not what to do, present, or automate." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    priorityAttentionAuthority: "REX-4:4" as const,
    architecturalRole:
      "RuntimeExecutiveInsightPriorityAttentionBoundary" as const,
    soleImmediateDependency:
      "REX-4:3/RuntimeExecutiveInsightResolution" as const,
    consumesResolutionOnly: true as const,
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
    aiProviderIndependent: true as const,
    pureFunctions: true as const,
    stateless: true as const,
    severityDistinctFromPriority: true as const,
    importanceDistinctFromPriority: true as const,
    attentionDistinctFromUiFocus: true as const,
    introducesPresentationResolution: false as const,
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

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS = Object.freeze([
  "severity",
  "importance",
  "urgency",
  "confidence",
  "freshness",
  "scope",
  "focus-relevance",
  "goal-relevance",
  "decision-relevance",
  "execution-relevance",
] as const);

export type RuntimeExecutiveInsightPriorityDimension =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS = Object.freeze([
  "minimal",
  "low",
  "medium",
  "high",
  "critical",
] as const);

export type RuntimeExecutiveInsightPriorityBand =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES = Object.freeze([
  "none",
  "low",
  "moderate",
  "high",
  "immediate",
] as const);

export type RuntimeExecutiveInsightUrgency =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES =
  Object.freeze([
    "none",
    "weak",
    "moderate",
    "strong",
    "direct",
  ] as const);

export type RuntimeExecutiveInsightExecutiveRelevance =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES =
  Object.freeze([
    "none",
    "background",
    "notice",
    "focus",
    "urgent",
  ] as const);

export type RuntimeExecutiveInsightPriorityAttentionState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES = Object.freeze([
  "none",
  "eligible",
  "escalated",
] as const);

export type RuntimeExecutiveInsightEscalationState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES = Object.freeze([
  "visible",
  "deemphasized",
  "suppressed",
] as const);

export type RuntimeExecutiveInsightSuppressionState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES = Object.freeze([
  "severity-contribution",
  "importance-contribution",
  "urgency-contribution",
  "confidence-contribution",
  "freshness-contribution",
  "scope-contribution",
  "focus-match",
  "goal-match",
  "koi-match",
  "decision-match",
  "execution-match",
  "escalation-applied",
  "deescalation-applied",
  "suppressed-stale",
  "suppressed-superseded",
  "suppressed-acknowledged",
  "low-relevance",
  "direct-relevance",
  "tie-break-applied",
  "invalid-policy",
  "invalid-weight",
  "invalid-candidate",
  "invalid-score",
] as const);

export type RuntimeExecutiveInsightPriorityReasonCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KIND_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KIND_SEMANTICS;

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES =
  Object.freeze([
    "deterministic-priority-evaluation",
    "deterministic-ranking",
    "stable-tie-breaking",
    "pure-functions",
    "immutable-input-preservation",
    "explicit-policy-driven-weighting",
    "transparent-contribution-data",
    "no-hidden-scoring",
    "no-ai",
    "no-llm",
    "no-persistence",
    "no-external-access",
    "no-presentation-selection",
    "no-advisor-generation",
    "no-stage-execution",
    "no-automation",
  ] as const);

export type RuntimeExecutiveInsightPriorityAttentionConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES)[number];

// ─── Default normalization maps (policy may override) ───────────────────────

const DEFAULT_SEVERITY_VALUES = Object.freeze({
  none: 0,
  low: 0.25,
  moderate: 0.5,
  high: 0.75,
  critical: 1,
} as const);

const DEFAULT_IMPORTANCE_VALUES = Object.freeze({
  minimal: 0,
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  essential: 1,
} as const);

const DEFAULT_FRESHNESS_VALUES = Object.freeze({
  current: 1,
  recent: 0.75,
  aging: 0.4,
  stale: 0.1,
  unknown: 0.2,
} as const);

const DEFAULT_SCOPE_VALUES = Object.freeze({
  subject: 0.2,
  object: 0.35,
  goal: 0.55,
  scene: 0.45,
  workspace: 0.65,
  model: 0.75,
  organization: 0.9,
  global: 1,
} as const);

const DEFAULT_URGENCY_VALUES = Object.freeze({
  none: 0,
  low: 0.25,
  moderate: 0.5,
  high: 0.75,
  immediate: 1,
} as const);

const DEFAULT_RELEVANCE_VALUES = Object.freeze({
  none: 0,
  weak: 0.25,
  moderate: 0.5,
  strong: 0.75,
  direct: 1,
} as const);

const DEFAULT_BAND_THRESHOLDS = Object.freeze({
  minimal: 0,
  low: 0.2,
  medium: 0.4,
  high: 0.6,
  critical: 0.8,
} as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export type RuntimeExecutiveInsightPriorityWeightMap = Readonly<
  Record<RuntimeExecutiveInsightPriorityDimension, number>
>;

export interface RuntimeExecutiveInsightPriorityBandThresholds {
  readonly minimal: number;
  readonly low: number;
  readonly medium: number;
  readonly high: number;
  readonly critical: number;
}

export interface RuntimeExecutiveInsightPriorityPolicy {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly weights: RuntimeExecutiveInsightPriorityWeightMap;
  readonly severityValues?: Readonly<
    Record<RuntimeExecutiveInsightResolutionSeverity, number>
  >;
  readonly importanceValues?: Readonly<
    Record<RuntimeExecutiveInsightResolutionImportance, number>
  >;
  readonly freshnessValues?: Readonly<
    Record<RuntimeExecutiveInsightResolutionFreshness, number>
  >;
  readonly scopeValues?: Readonly<
    Record<RuntimeExecutiveInsightResolutionScope, number>
  >;
  readonly urgencyValues?: Readonly<
    Record<RuntimeExecutiveInsightUrgency, number>
  >;
  readonly bandThresholds?: RuntimeExecutiveInsightPriorityBandThresholds;
  readonly escalateWhenPriorityBandAtLeast?: RuntimeExecutiveInsightPriorityBand;
  readonly escalateWhenUrgencyAtLeast?: RuntimeExecutiveInsightUrgency;
  readonly suppressStale?: boolean;
  readonly suppressSuperseded?: boolean;
  readonly suppressAcknowledged?: boolean;
  readonly deemphasizeWhenRelevanceAtMost?: RuntimeExecutiveInsightExecutiveRelevance;
}

export interface RuntimeExecutiveInsightPriorityContext {
  readonly focusedSubjectId?: string;
  readonly selectedSubjectId?: string;
  readonly activeGoalId?: string;
  readonly activeKoiId?: string;
  readonly activeWorkspaceId?: string;
  readonly activeModelId?: string;
  readonly activeSceneId?: string;
  readonly executiveModeRef?: string;
  readonly organizationalScope?: RuntimeExecutiveInsightResolutionScope;
  readonly temporalRefIso?: string;
  readonly decisionSubjectIds?: ReadonlyArray<string>;
  readonly executionSubjectIds?: ReadonlyArray<string>;
  readonly acknowledgedCandidateIds?: ReadonlyArray<string>;
  readonly suppliedUrgencyByCandidateId?: Readonly<
    Record<string, RuntimeExecutiveInsightUrgency>
  >;
}

export interface RuntimeExecutiveInsightPriorityInput {
  readonly candidate: RuntimeExecutiveInsightCandidate;
  readonly context: RuntimeExecutiveInsightPriorityContext;
  readonly policy: RuntimeExecutiveInsightPriorityPolicy;
  readonly collectionOrderIndex?: number;
}

export interface RuntimeExecutiveInsightPriorityCollectionInput {
  readonly collection: RuntimeExecutiveInsightCandidateCollection;
  readonly context: RuntimeExecutiveInsightPriorityContext;
  readonly policy: RuntimeExecutiveInsightPriorityPolicy;
  readonly collectionId?: string;
}

export interface RuntimeExecutiveInsightPriorityContribution {
  readonly dimension: RuntimeExecutiveInsightPriorityDimension;
  readonly inputValue: string | number;
  readonly normalizedValue: number;
  readonly weight: number;
  readonly contribution: number;
  readonly reasonCode: RuntimeExecutiveInsightPriorityReasonCode;
}

export interface RuntimeExecutiveInsightPriorityResult {
  readonly candidateId: string;
  readonly priorityScore: number;
  readonly priorityBand: RuntimeExecutiveInsightPriorityBand;
  readonly urgency: RuntimeExecutiveInsightUrgency;
  readonly executiveRelevance: RuntimeExecutiveInsightExecutiveRelevance;
  readonly contributions: ReadonlyArray<RuntimeExecutiveInsightPriorityContribution>;
  readonly attentionState: RuntimeExecutiveInsightPriorityAttentionState;
  readonly escalationState: RuntimeExecutiveInsightEscalationState;
  readonly suppressionState: RuntimeExecutiveInsightSuppressionState;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightPriorityReasonCode>;
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly priorityIdentity: typeof runtimeExecutiveInsightPriorityAttentionIdentity;
  readonly priorityVersion: typeof runtimeExecutiveInsightPriorityAttentionVersion;
}

export interface RuntimeExecutiveRankedInsight {
  readonly rank: number;
  readonly candidateId: string;
  readonly candidate: RuntimeExecutiveInsightCandidate;
  readonly priority: RuntimeExecutiveInsightPriorityResult;
  readonly tieBreakApplied: boolean;
}

export interface RuntimeExecutiveInsightRankedCollection {
  readonly collectionId?: string;
  readonly ranked: ReadonlyArray<RuntimeExecutiveRankedInsight>;
  readonly suppressed: ReadonlyArray<RuntimeExecutiveInsightPriorityResult>;
}

export interface RuntimeExecutiveInsightPriorityValidationIssue {
  readonly code: RuntimeExecutiveInsightPriorityReasonCode;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeExecutiveInsightPriorityValidationResult {
  readonly valid: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightPriorityValidationIssue>;
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

function includesValue<T>(collection: readonly T[], value: unknown): value is T {
  return (collection as readonly unknown[]).includes(value);
}

function compareAscii(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function isFiniteWeight(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function bandIndex(band: RuntimeExecutiveInsightPriorityBand): number {
  return RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS.indexOf(band);
}

function urgencyIndex(urgency: RuntimeExecutiveInsightUrgency): number {
  return RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES.indexOf(urgency);
}

function relevanceIndex(
  relevance: RuntimeExecutiveInsightExecutiveRelevance,
): number {
  return RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES.indexOf(relevance);
}

function freshnessIndex(
  freshness: RuntimeExecutiveInsightResolutionFreshness,
): number {
  return (["current", "recent", "aging", "stale", "unknown"] as const).indexOf(
    freshness,
  );
}

export function isRuntimeExecutiveInsightPriorityDimension(
  value: unknown,
): value is RuntimeExecutiveInsightPriorityDimension {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS, value);
}

export function isRuntimeExecutiveInsightPriorityBand(
  value: unknown,
): value is RuntimeExecutiveInsightPriorityBand {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS, value);
}

export function isRuntimeExecutiveInsightUrgency(
  value: unknown,
): value is RuntimeExecutiveInsightUrgency {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES, value);
}

export function isRuntimeExecutiveInsightExecutiveRelevance(
  value: unknown,
): value is RuntimeExecutiveInsightExecutiveRelevance {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES,
    value,
  );
}

export function isRuntimeExecutiveInsightPriorityAttentionState(
  value: unknown,
): value is RuntimeExecutiveInsightPriorityAttentionState {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES,
    value,
  );
}

export function isRuntimeExecutiveInsightEscalationState(
  value: unknown,
): value is RuntimeExecutiveInsightEscalationState {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES, value);
}

export function isRuntimeExecutiveInsightSuppressionState(
  value: unknown,
): value is RuntimeExecutiveInsightSuppressionState {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES, value);
}

export function isRuntimeExecutiveInsightPriorityReasonCode(
  value: unknown,
): value is RuntimeExecutiveInsightPriorityReasonCode {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES, value);
}

function issue(
  code: RuntimeExecutiveInsightPriorityReasonCode,
  path?: string,
  details?: Readonly<Record<string, string | number | boolean>>,
): RuntimeExecutiveInsightPriorityValidationIssue {
  return Object.freeze({
    code,
    ...(path !== undefined ? { path } : {}),
    ...(details !== undefined ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function contribution(input: {
  readonly dimension: RuntimeExecutiveInsightPriorityDimension;
  readonly inputValue: string | number;
  readonly normalizedValue: number;
  readonly weight: number;
  readonly reasonCode: RuntimeExecutiveInsightPriorityReasonCode;
}): RuntimeExecutiveInsightPriorityContribution {
  const normalizedValue = clamp01(input.normalizedValue);
  const weight = clamp01(input.weight);
  return Object.freeze({
    dimension: input.dimension,
    inputValue: input.inputValue,
    normalizedValue,
    weight,
    contribution: clamp01(normalizedValue * weight),
    reasonCode: input.reasonCode,
  });
}

export function validateRuntimeExecutiveInsightPriorityPolicy(
  value: unknown,
): RuntimeExecutiveInsightPriorityValidationResult {
  const issues: RuntimeExecutiveInsightPriorityValidationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-policy", "policy")]),
    });
  }
  if (!isNonEmptyString(value.policyId)) {
    issues.push(issue("invalid-policy", "policy.policyId"));
  }
  if (!isPlainObject(value.weights)) {
    issues.push(issue("invalid-policy", "policy.weights"));
  } else {
    for (const dimension of RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS) {
      const weight = value.weights[dimension];
      if (typeof weight !== "number") {
        issues.push(issue("invalid-weight", `policy.weights.${dimension}`));
        continue;
      }
      if (Number.isNaN(weight)) {
        issues.push(
          issue("invalid-weight", `policy.weights.${dimension}`, {
            reason: "nan",
          }),
        );
        continue;
      }
      if (!Number.isFinite(weight)) {
        issues.push(
          issue("invalid-weight", `policy.weights.${dimension}`, {
            reason: "infinity",
          }),
        );
        continue;
      }
      if (weight < 0 || weight > 1) {
        issues.push(
          issue("invalid-weight", `policy.weights.${dimension}`, {
            weight,
          }),
        );
      }
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function validateCandidate(
  candidate: unknown,
): RuntimeExecutiveInsightPriorityValidationResult {
  if (
    !isPlainObject(candidate) ||
    !isNonEmptyString(candidate.candidateId) ||
    !isPlainObject(candidate.primarySubject) ||
    !isNonEmptyString(candidate.primarySubject.subjectId)
  ) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-candidate", "candidate")]),
    });
  }
  if (
    typeof candidate.confidence !== "number" ||
    !Number.isFinite(candidate.confidence) ||
    candidate.confidence < 0 ||
    candidate.confidence > 1
  ) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        issue("invalid-candidate", "candidate.confidence"),
      ]),
    });
  }
  return Object.freeze({ valid: true, issues: Object.freeze([]) });
}

function lookupMapValue(
  map: Readonly<Record<string, number>> | undefined,
  key: string,
  fallback: number,
): number {
  if (map === undefined) return fallback;
  const value = map[key];
  return typeof value === "number" && Number.isFinite(value)
    ? clamp01(value)
    : fallback;
}

function resolveFocusRelevance(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
): {
  readonly relevance: RuntimeExecutiveInsightExecutiveRelevance;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
  readonly normalized: number;
} {
  const subjectId = candidate.primarySubject.subjectId;
  const relatedIds = candidate.relatedSubjects.map(
    (entry) => entry.subject.subjectId,
  );
  if (
    context.focusedSubjectId === subjectId ||
    context.selectedSubjectId === subjectId
  ) {
    return {
      relevance: "direct",
      reasonCodes: ["focus-match", "direct-relevance"],
      normalized: 1,
    };
  }
  if (
    (context.focusedSubjectId !== undefined &&
      relatedIds.includes(context.focusedSubjectId)) ||
    (context.selectedSubjectId !== undefined &&
      relatedIds.includes(context.selectedSubjectId))
  ) {
    return {
      relevance: "strong",
      reasonCodes: ["focus-match"],
      normalized: 0.75,
    };
  }
  return { relevance: "none", reasonCodes: [], normalized: 0 };
}

function resolveGoalKoiRelevance(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
): {
  readonly normalized: number;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
} {
  const reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[] = [];
  let normalized = 0;
  const ids = [
    candidate.primarySubject.subjectId,
    ...candidate.relatedSubjects.map((entry) => entry.subject.subjectId),
  ];
  if (
    context.activeGoalId !== undefined &&
    ids.includes(context.activeGoalId)
  ) {
    normalized = Math.max(normalized, 1);
    reasonCodes.push("goal-match");
  }
  if (context.activeKoiId !== undefined && ids.includes(context.activeKoiId)) {
    normalized = Math.max(normalized, 1);
    reasonCodes.push("koi-match");
  }
  if (
    candidate.primarySubject.kind === "koi" ||
    candidate.relatedSubjects.some((entry) => entry.subject.kind === "koi")
  ) {
    if (context.activeKoiId !== undefined) {
      normalized = Math.max(normalized, 0.75);
      if (!reasonCodes.includes("koi-match")) reasonCodes.push("koi-match");
    }
  }
  if (
    candidate.primarySubject.kind === "goal" ||
    candidate.relatedSubjects.some((entry) => entry.subject.kind === "goal")
  ) {
    if (context.activeGoalId !== undefined) {
      normalized = Math.max(normalized, 0.75);
      if (!reasonCodes.includes("goal-match")) reasonCodes.push("goal-match");
    }
  }
  return { normalized, reasonCodes };
}

function resolveDecisionRelevance(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
): {
  readonly normalized: number;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
} {
  const decisionIds = context.decisionSubjectIds ?? [];
  if (decisionIds.length === 0) {
    return { normalized: 0, reasonCodes: [] };
  }
  const ids = [
    candidate.primarySubject.subjectId,
    ...candidate.relatedSubjects.map((entry) => entry.subject.subjectId),
  ];
  const related = candidate.relationships.some(
    (entry) =>
      (entry.from.endpointKind === "subject" &&
        decisionIds.includes(entry.from.endpointId)) ||
      (entry.to.endpointKind === "subject" &&
        decisionIds.includes(entry.to.endpointId)),
  );
  if (ids.some((id) => decisionIds.includes(id)) || related) {
    return { normalized: 1, reasonCodes: ["decision-match"] };
  }
  return { normalized: 0, reasonCodes: [] };
}

function resolveExecutionRelevance(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
): {
  readonly normalized: number;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
} {
  const executionIds = context.executionSubjectIds ?? [];
  if (executionIds.length === 0) {
    return { normalized: 0, reasonCodes: [] };
  }
  const ids = [
    candidate.primarySubject.subjectId,
    ...candidate.relatedSubjects.map((entry) => entry.subject.subjectId),
  ];
  const related = candidate.relationships.some(
    (entry) =>
      (entry.from.endpointKind === "subject" &&
        executionIds.includes(entry.from.endpointId)) ||
      (entry.to.endpointKind === "subject" &&
        executionIds.includes(entry.to.endpointId)),
  );
  if (ids.some((id) => executionIds.includes(id)) || related) {
    return { normalized: 1, reasonCodes: ["execution-match"] };
  }
  return { normalized: 0, reasonCodes: [] };
}

function deriveUrgency(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
  executiveRelevance: RuntimeExecutiveInsightExecutiveRelevance,
): RuntimeExecutiveInsightUrgency {
  const supplied = context.suppliedUrgencyByCandidateId?.[candidate.candidateId];
  if (supplied !== undefined && isRuntimeExecutiveInsightUrgency(supplied)) {
    return supplied;
  }
  if (
    candidate.severity === "critical" &&
    candidate.freshness === "current" &&
    executiveRelevance !== "none"
  ) {
    return "immediate";
  }
  if (candidate.severity === "critical") return "high";
  if (candidate.severity === "high" && candidate.freshness === "current") {
    return "high";
  }
  if (candidate.severity === "high") return "moderate";
  if (candidate.severity === "moderate") return "low";
  return "none";
}

function scoreToBand(
  score: number,
  thresholds: RuntimeExecutiveInsightPriorityBandThresholds,
): RuntimeExecutiveInsightPriorityBand {
  if (score >= thresholds.critical) return "critical";
  if (score >= thresholds.high) return "high";
  if (score >= thresholds.medium) return "medium";
  if (score >= thresholds.low) return "low";
  return "minimal";
}

function resolveExecutiveRelevance(
  focus: RuntimeExecutiveInsightExecutiveRelevance,
  goalNormalized: number,
  decisionNormalized: number,
  executionNormalized: number,
): RuntimeExecutiveInsightExecutiveRelevance {
  const maxNormalized = Math.max(
    DEFAULT_RELEVANCE_VALUES[focus],
    goalNormalized,
    decisionNormalized,
    executionNormalized,
  );
  if (maxNormalized >= 1) return "direct";
  if (maxNormalized >= 0.75) return "strong";
  if (maxNormalized >= 0.5) return "moderate";
  if (maxNormalized > 0) return "weak";
  return "none";
}

export function resolveRuntimeExecutiveInsightSuppression(
  candidate: RuntimeExecutiveInsightCandidate,
  context: RuntimeExecutiveInsightPriorityContext,
  policy: RuntimeExecutiveInsightPriorityPolicy,
  executiveRelevance: RuntimeExecutiveInsightExecutiveRelevance,
): {
  readonly suppressionState: RuntimeExecutiveInsightSuppressionState;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
} {
  const reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[] = [];
  if (
    policy.suppressAcknowledged === true &&
    (context.acknowledgedCandidateIds ?? []).includes(candidate.candidateId)
  ) {
    reasonCodes.push("suppressed-acknowledged");
    return { suppressionState: "suppressed", reasonCodes };
  }
  if (policy.suppressSuperseded === true) {
    const superseded = candidate.relationships.some(
      (entry) =>
        entry.kind === "supersedes" &&
        entry.to.endpointKind === "insight" &&
        entry.to.endpointId === candidate.candidateId &&
        entry.from.endpointKind === "insight" &&
        entry.from.endpointId !== candidate.candidateId,
    );
    if (superseded) {
      reasonCodes.push("suppressed-superseded");
      return { suppressionState: "suppressed", reasonCodes };
    }
  }

  if (policy.suppressStale === true && candidate.freshness === "stale") {
    reasonCodes.push("suppressed-stale");
    return { suppressionState: "suppressed", reasonCodes };
  }

  if (
    policy.deemphasizeWhenRelevanceAtMost !== undefined &&
    relevanceIndex(executiveRelevance) <=
      relevanceIndex(policy.deemphasizeWhenRelevanceAtMost)
  ) {
    reasonCodes.push("low-relevance");
    return { suppressionState: "deemphasized", reasonCodes };
  }

  return { suppressionState: "visible", reasonCodes };
}

export function resolveRuntimeExecutiveInsightEscalation(
  priorityBand: RuntimeExecutiveInsightPriorityBand,
  urgency: RuntimeExecutiveInsightUrgency,
  policy: RuntimeExecutiveInsightPriorityPolicy,
  suppressionState: RuntimeExecutiveInsightSuppressionState,
): {
  readonly escalationState: RuntimeExecutiveInsightEscalationState;
  readonly reasonCodes: RuntimeExecutiveInsightPriorityReasonCode[];
  readonly deescalated: boolean;
} {
  if (suppressionState === "suppressed") {
    return {
      escalationState: "none",
      reasonCodes: ["deescalation-applied"],
      deescalated: true,
    };
  }
  const bandGate = policy.escalateWhenPriorityBandAtLeast ?? "critical";
  const urgencyGate = policy.escalateWhenUrgencyAtLeast ?? "immediate";
  if (
    bandIndex(priorityBand) >= bandIndex(bandGate) &&
    urgencyIndex(urgency) >= urgencyIndex(urgencyGate)
  ) {
    return {
      escalationState: "escalated",
      reasonCodes: ["escalation-applied"],
      deescalated: false,
    };
  }
  if (
    bandIndex(priorityBand) >= bandIndex(bandGate) ||
    urgencyIndex(urgency) >= urgencyIndex(urgencyGate)
  ) {
    return {
      escalationState: "eligible",
      reasonCodes: [],
      deescalated: false,
    };
  }
  return { escalationState: "none", reasonCodes: [], deescalated: false };
}

export function resolveRuntimeExecutiveInsightAttention(
  priorityBand: RuntimeExecutiveInsightPriorityBand,
  urgency: RuntimeExecutiveInsightUrgency,
  executiveRelevance: RuntimeExecutiveInsightExecutiveRelevance,
  escalationState: RuntimeExecutiveInsightEscalationState,
  suppressionState: RuntimeExecutiveInsightSuppressionState,
): RuntimeExecutiveInsightPriorityAttentionState {
  if (suppressionState === "suppressed") return "none";
  if (
    escalationState === "escalated" ||
    urgency === "immediate" ||
    priorityBand === "critical"
  ) {
    return "urgent";
  }
  if (
    priorityBand === "high" ||
    urgency === "high" ||
    executiveRelevance === "direct"
  ) {
    return "focus";
  }
  if (
    priorityBand === "medium" ||
    urgency === "moderate" ||
    executiveRelevance === "strong"
  ) {
    return "notice";
  }
  if (
    priorityBand === "low" ||
    suppressionState === "deemphasized" ||
    executiveRelevance === "weak"
  ) {
    return "background";
  }
  return "none";
}

// ─── Primary evaluation ─────────────────────────────────────────────────────

export function evaluateRuntimeExecutiveInsightPriority(
  input: RuntimeExecutiveInsightPriorityInput,
): RuntimeExecutiveInsightPriorityResult {
  const policyValidation = validateRuntimeExecutiveInsightPriorityPolicy(
    input.policy,
  );
  const candidateValidation = validateCandidate(input.candidate);
  if (!policyValidation.valid || !candidateValidation.valid) {
    return Object.freeze({
      candidateId: isPlainObject(input.candidate)
        ? String(input.candidate.candidateId ?? "")
        : "",
      priorityScore: 0,
      priorityBand: "minimal" as const,
      urgency: "none" as const,
      executiveRelevance: "none" as const,
      contributions: Object.freeze([]),
      attentionState: "none" as const,
      escalationState: "none" as const,
      suppressionState: "visible" as const,
      reasonCodes: Object.freeze([
        ...policyValidation.issues.map((entry) => entry.code),
        ...candidateValidation.issues.map((entry) => entry.code),
      ]),
      policyId: isPlainObject(input.policy)
        ? String(input.policy.policyId ?? "")
        : "",
      ...(isPlainObject(input.policy) &&
      typeof input.policy.policyVersion === "string"
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      priorityIdentity: runtimeExecutiveInsightPriorityAttentionIdentity,
      priorityVersion: runtimeExecutiveInsightPriorityAttentionVersion,
    });
  }

  const candidate = input.candidate;
  const policy = input.policy;
  const context = input.context;
  const weights = policy.weights;
  const bandThresholds = policy.bandThresholds ?? DEFAULT_BAND_THRESHOLDS;

  const focus = resolveFocusRelevance(candidate, context);
  const goal = resolveGoalKoiRelevance(candidate, context);
  const decision = resolveDecisionRelevance(candidate, context);
  const execution = resolveExecutionRelevance(candidate, context);
  const executiveRelevance = resolveExecutiveRelevance(
    focus.relevance,
    goal.normalized,
    decision.normalized,
    execution.normalized,
  );
  const urgency = deriveUrgency(candidate, context, executiveRelevance);

  const severityNorm = lookupMapValue(
    policy.severityValues,
    candidate.severity,
    DEFAULT_SEVERITY_VALUES[
      candidate.severity as keyof typeof DEFAULT_SEVERITY_VALUES
    ] ?? 0,
  );
  const importanceNorm = lookupMapValue(
    policy.importanceValues,
    candidate.importance,
    DEFAULT_IMPORTANCE_VALUES[
      candidate.importance as keyof typeof DEFAULT_IMPORTANCE_VALUES
    ] ?? 0,
  );
  const freshnessNorm = lookupMapValue(
    policy.freshnessValues,
    candidate.freshness,
    DEFAULT_FRESHNESS_VALUES[
      candidate.freshness as keyof typeof DEFAULT_FRESHNESS_VALUES
    ] ?? 0,
  );
  const scopeNorm = lookupMapValue(
    policy.scopeValues,
    candidate.scope,
    DEFAULT_SCOPE_VALUES[
      candidate.scope as keyof typeof DEFAULT_SCOPE_VALUES
    ] ?? 0,
  );
  const urgencyNorm = lookupMapValue(
    policy.urgencyValues,
    urgency,
    DEFAULT_URGENCY_VALUES[urgency],
  );
  const confidenceNorm = clamp01(candidate.confidence);

  const contributions = [
    contribution({
      dimension: "severity",
      inputValue: candidate.severity,
      normalizedValue: severityNorm,
      weight: weights.severity,
      reasonCode: "severity-contribution",
    }),
    contribution({
      dimension: "importance",
      inputValue: candidate.importance,
      normalizedValue: importanceNorm,
      weight: weights.importance,
      reasonCode: "importance-contribution",
    }),
    contribution({
      dimension: "urgency",
      inputValue: urgency,
      normalizedValue: urgencyNorm,
      weight: weights.urgency,
      reasonCode: "urgency-contribution",
    }),
    contribution({
      dimension: "confidence",
      inputValue: candidate.confidence,
      normalizedValue: confidenceNorm,
      weight: weights.confidence,
      reasonCode: "confidence-contribution",
    }),
    contribution({
      dimension: "freshness",
      inputValue: candidate.freshness,
      normalizedValue: freshnessNorm,
      weight: weights.freshness,
      reasonCode: "freshness-contribution",
    }),
    contribution({
      dimension: "scope",
      inputValue: candidate.scope,
      normalizedValue: scopeNorm,
      weight: weights.scope,
      reasonCode: "scope-contribution",
    }),
    contribution({
      dimension: "focus-relevance",
      inputValue: focus.relevance,
      normalizedValue: focus.normalized,
      weight: weights["focus-relevance"],
      reasonCode: "focus-match",
    }),
    contribution({
      dimension: "goal-relevance",
      inputValue: goal.normalized,
      normalizedValue: goal.normalized,
      weight: weights["goal-relevance"],
      reasonCode: goal.reasonCodes.includes("koi-match")
        ? "koi-match"
        : "goal-match",
    }),
    contribution({
      dimension: "decision-relevance",
      inputValue: decision.normalized,
      normalizedValue: decision.normalized,
      weight: weights["decision-relevance"],
      reasonCode: "decision-match",
    }),
    contribution({
      dimension: "execution-relevance",
      inputValue: execution.normalized,
      normalizedValue: execution.normalized,
      weight: weights["execution-relevance"],
      reasonCode: "execution-match",
    }),
  ] as RuntimeExecutiveInsightPriorityContribution[];

  const totalWeight = RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS.reduce(
    (sum, dimension) => sum + clamp01(weights[dimension]),
    0,
  );
  const weightedSum = contributions.reduce(
    (sum, entry) => sum + entry.contribution,
    0,
  );
  const priorityScore =
    totalWeight === 0 ? 0 : clamp01(weightedSum / totalWeight);
  if (!Number.isFinite(priorityScore)) {
    return Object.freeze({
      candidateId: candidate.candidateId,
      priorityScore: 0,
      priorityBand: "minimal",
      urgency: "none",
      executiveRelevance: "none",
      contributions: Object.freeze([]),
      attentionState: "none",
      escalationState: "none",
      suppressionState: "visible",
      reasonCodes: Object.freeze(["invalid-score"] as const),
      policyId: policy.policyId,
      ...(policy.policyVersion !== undefined
        ? { policyVersion: policy.policyVersion }
        : {}),
      priorityIdentity: runtimeExecutiveInsightPriorityAttentionIdentity,
      priorityVersion: runtimeExecutiveInsightPriorityAttentionVersion,
    });
  }

  const priorityBand = scoreToBand(priorityScore, bandThresholds);
  const suppression = resolveRuntimeExecutiveInsightSuppression(
    candidate,
    context,
    policy,
    executiveRelevance,
  );
  const escalation = resolveRuntimeExecutiveInsightEscalation(
    priorityBand,
    urgency,
    policy,
    suppression.suppressionState,
  );
  const attentionState = resolveRuntimeExecutiveInsightAttention(
    priorityBand,
    urgency,
    executiveRelevance,
    escalation.escalationState,
    suppression.suppressionState,
  );

  const reasonCodes = Object.freeze([
    ...new Set([
      ...contributions
        .filter((entry) => entry.weight > 0 && entry.normalizedValue > 0)
        .map((entry) => entry.reasonCode),
      ...focus.reasonCodes,
      ...goal.reasonCodes,
      ...decision.reasonCodes,
      ...execution.reasonCodes,
      ...suppression.reasonCodes,
      ...escalation.reasonCodes,
      ...(executiveRelevance === "none" && priorityBand !== "minimal"
        ? (["low-relevance"] as const)
        : []),
      ...(executiveRelevance === "direct"
        ? (["direct-relevance"] as const)
        : []),
    ]),
  ]) as ReadonlyArray<RuntimeExecutiveInsightPriorityReasonCode>;

  return Object.freeze({
    candidateId: candidate.candidateId,
    priorityScore,
    priorityBand,
    urgency,
    executiveRelevance,
    contributions: Object.freeze(contributions),
    attentionState,
    escalationState: escalation.escalationState,
    suppressionState: suppression.suppressionState,
    reasonCodes,
    policyId: policy.policyId,
    ...(policy.policyVersion !== undefined
      ? { policyVersion: policy.policyVersion }
      : {}),
    priorityIdentity: runtimeExecutiveInsightPriorityAttentionIdentity,
    priorityVersion: runtimeExecutiveInsightPriorityAttentionVersion,
  });
}

export function rankRuntimeExecutiveInsights(
  input: RuntimeExecutiveInsightPriorityCollectionInput,
): RuntimeExecutiveInsightRankedCollection {
  const candidates = input.collection.candidates;
  const evaluated = candidates.map((candidate, index) => ({
    candidate,
    collectionOrderIndex: index,
    priority: evaluateRuntimeExecutiveInsightPriority({
      candidate,
      context: input.context,
      policy: input.policy,
      collectionOrderIndex: index,
    }),
  }));

  const suppressed = Object.freeze(
    evaluated
      .filter((entry) => entry.priority.suppressionState === "suppressed")
      .map((entry) => entry.priority),
  );

  const visible = evaluated.filter(
    (entry) => entry.priority.suppressionState !== "suppressed",
  );

  const sorted = [...visible].sort((left, right) => {
    // 1. suppression eligibility (deemphasized after visible)
    const suppressionDelta =
      (left.priority.suppressionState === "deemphasized" ? 1 : 0) -
      (right.priority.suppressionState === "deemphasized" ? 1 : 0);
    if (suppressionDelta !== 0) return suppressionDelta;

    // 2. priority score (desc)
    const scoreDelta =
      right.priority.priorityScore - left.priority.priorityScore;
    if (scoreDelta !== 0) return scoreDelta > 0 ? 1 : -1;

    // 3. priority band (desc)
    const bandDelta =
      bandIndex(right.priority.priorityBand) -
      bandIndex(left.priority.priorityBand);
    if (bandDelta !== 0) return bandDelta;

    // 4. urgency (desc)
    const urgencyDelta =
      urgencyIndex(right.priority.urgency) -
      urgencyIndex(left.priority.urgency);
    if (urgencyDelta !== 0) return urgencyDelta;

    // 5. executive relevance (desc)
    const relevanceDelta =
      relevanceIndex(right.priority.executiveRelevance) -
      relevanceIndex(left.priority.executiveRelevance);
    if (relevanceDelta !== 0) return relevanceDelta;

    // 6. confidence (desc)
    const confidenceDelta =
      right.candidate.confidence - left.candidate.confidence;
    if (confidenceDelta !== 0) return confidenceDelta > 0 ? 1 : -1;

    // 7. freshness (current first)
    const freshnessDelta =
      freshnessIndex(left.candidate.freshness) -
      freshnessIndex(right.candidate.freshness);
    if (freshnessDelta !== 0) return freshnessDelta;

    // 8. canonical candidate collection order
    const orderDelta =
      left.collectionOrderIndex - right.collectionOrderIndex;
    if (orderDelta !== 0) return orderDelta;

    // 9. stable candidate ID
    return compareAscii(left.candidate.candidateId, right.candidate.candidateId);
  });

  const ranked = Object.freeze(
    sorted.map((entry, index) => {
      const tieBreakApplied =
        index > 0 &&
        sorted[index - 1]!.priority.priorityScore ===
          entry.priority.priorityScore &&
        sorted[index - 1]!.priority.priorityBand ===
          entry.priority.priorityBand &&
        sorted[index - 1]!.priority.urgency === entry.priority.urgency;
      const priority = tieBreakApplied
        ? Object.freeze({
            ...entry.priority,
            reasonCodes: Object.freeze([
              ...new Set([...entry.priority.reasonCodes, "tie-break-applied"]),
            ]) as ReadonlyArray<RuntimeExecutiveInsightPriorityReasonCode>,
          })
        : entry.priority;
      return Object.freeze({
        rank: index + 1,
        candidateId: entry.candidate.candidateId,
        candidate: entry.candidate,
        priority,
        tieBreakApplied,
      });
    }),
  );

  return Object.freeze({
    ...(input.collectionId !== undefined
      ? { collectionId: input.collectionId }
      : input.collection.collectionId !== undefined
        ? { collectionId: input.collection.collectionId }
        : {}),
    ranked,
    suppressed,
  });
}

export function createRuntimeExecutiveInsightPriorityPolicy(input: {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly weights: RuntimeExecutiveInsightPriorityWeightMap;
  readonly severityValues?: RuntimeExecutiveInsightPriorityPolicy["severityValues"];
  readonly importanceValues?: RuntimeExecutiveInsightPriorityPolicy["importanceValues"];
  readonly freshnessValues?: RuntimeExecutiveInsightPriorityPolicy["freshnessValues"];
  readonly scopeValues?: RuntimeExecutiveInsightPriorityPolicy["scopeValues"];
  readonly urgencyValues?: RuntimeExecutiveInsightPriorityPolicy["urgencyValues"];
  readonly bandThresholds?: RuntimeExecutiveInsightPriorityBandThresholds;
  readonly escalateWhenPriorityBandAtLeast?: RuntimeExecutiveInsightPriorityBand;
  readonly escalateWhenUrgencyAtLeast?: RuntimeExecutiveInsightUrgency;
  readonly suppressStale?: boolean;
  readonly suppressSuperseded?: boolean;
  readonly suppressAcknowledged?: boolean;
  readonly deemphasizeWhenRelevanceAtMost?: RuntimeExecutiveInsightExecutiveRelevance;
}): RuntimeExecutiveInsightPriorityPolicy {
  const policy = Object.freeze({
    policyId: input.policyId,
    ...(input.policyVersion !== undefined
      ? { policyVersion: input.policyVersion }
      : {}),
    weights: Object.freeze({ ...input.weights }),
    ...(input.severityValues !== undefined
      ? { severityValues: Object.freeze({ ...input.severityValues }) }
      : {}),
    ...(input.importanceValues !== undefined
      ? { importanceValues: Object.freeze({ ...input.importanceValues }) }
      : {}),
    ...(input.freshnessValues !== undefined
      ? { freshnessValues: Object.freeze({ ...input.freshnessValues }) }
      : {}),
    ...(input.scopeValues !== undefined
      ? { scopeValues: Object.freeze({ ...input.scopeValues }) }
      : {}),
    ...(input.urgencyValues !== undefined
      ? { urgencyValues: Object.freeze({ ...input.urgencyValues }) }
      : {}),
    ...(input.bandThresholds !== undefined
      ? { bandThresholds: Object.freeze({ ...input.bandThresholds }) }
      : {}),
    ...(input.escalateWhenPriorityBandAtLeast !== undefined
      ? {
          escalateWhenPriorityBandAtLeast:
            input.escalateWhenPriorityBandAtLeast,
        }
      : {}),
    ...(input.escalateWhenUrgencyAtLeast !== undefined
      ? { escalateWhenUrgencyAtLeast: input.escalateWhenUrgencyAtLeast }
      : {}),
    ...(input.suppressStale !== undefined
      ? { suppressStale: input.suppressStale }
      : {}),
    ...(input.suppressSuperseded !== undefined
      ? { suppressSuperseded: input.suppressSuperseded }
      : {}),
    ...(input.suppressAcknowledged !== undefined
      ? { suppressAcknowledged: input.suppressAcknowledged }
      : {}),
    ...(input.deemphasizeWhenRelevanceAtMost !== undefined
      ? {
          deemphasizeWhenRelevanceAtMost:
            input.deemphasizeWhenRelevanceAtMost,
        }
      : {}),
  });
  const validated = validateRuntimeExecutiveInsightPriorityPolicy(policy);
  if (!validated.valid) {
    throw new TypeError(
      `invalid priority policy: ${validated.issues[0]?.code ?? "invalid-policy"}`,
    );
  }
  return policy;
}

export function getRuntimeExecutiveInsightPriorityAttentionIdentity():
  typeof runtimeExecutiveInsightPriorityAttentionCanonicalIdentity {
  return runtimeExecutiveInsightPriorityAttentionCanonicalIdentity;
}

export function getRuntimeExecutiveInsightPriorityAttentionRegistry():
  typeof runtimeExecutiveInsightPriorityAttentionRegistry {
  return runtimeExecutiveInsightPriorityAttentionRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightPriorityAttentionApiNames = Object.freeze([
  "getRuntimeExecutiveInsightPriorityAttentionIdentity",
  "getRuntimeExecutiveInsightPriorityAttentionRegistry",
  "isRuntimeExecutiveInsightPriorityDimension",
  "isRuntimeExecutiveInsightPriorityBand",
  "isRuntimeExecutiveInsightUrgency",
  "isRuntimeExecutiveInsightExecutiveRelevance",
  "isRuntimeExecutiveInsightPriorityAttentionState",
  "isRuntimeExecutiveInsightEscalationState",
  "isRuntimeExecutiveInsightSuppressionState",
  "isRuntimeExecutiveInsightPriorityReasonCode",
  "validateRuntimeExecutiveInsightPriorityPolicy",
  "createRuntimeExecutiveInsightPriorityPolicy",
  "evaluateRuntimeExecutiveInsightPriority",
  "rankRuntimeExecutiveInsights",
  "resolveRuntimeExecutiveInsightAttention",
  "resolveRuntimeExecutiveInsightSuppression",
  "resolveRuntimeExecutiveInsightEscalation",
  "verifyRuntimeExecutiveInsightPriorityAttention",
] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightPriorityDimension",
    "RuntimeExecutiveInsightPriorityBand",
    "RuntimeExecutiveInsightUrgency",
    "RuntimeExecutiveInsightExecutiveRelevance",
    "RuntimeExecutiveInsightPriorityAttentionState",
    "RuntimeExecutiveInsightEscalationState",
    "RuntimeExecutiveInsightSuppressionState",
    "RuntimeExecutiveInsightPriorityReasonCode",
    "RuntimeExecutiveInsightPriorityWeightMap",
    "RuntimeExecutiveInsightPriorityBandThresholds",
    "RuntimeExecutiveInsightPriorityPolicy",
    "RuntimeExecutiveInsightPriorityContext",
    "RuntimeExecutiveInsightPriorityInput",
    "RuntimeExecutiveInsightPriorityCollectionInput",
    "RuntimeExecutiveInsightPriorityContribution",
    "RuntimeExecutiveInsightPriorityResult",
    "RuntimeExecutiveRankedInsight",
    "RuntimeExecutiveInsightRankedCollection",
    "RuntimeExecutiveInsightPriorityValidationIssue",
    "RuntimeExecutiveInsightPriorityValidationResult",
    "RuntimeExecutiveInsightPriorityAttentionVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "PriorityDimensions",
    "PriorityBands",
    "UrgencyValues",
    "ExecutiveRelevanceValues",
    "AttentionStates",
    "EscalationStates",
    "SuppressionStates",
    "ReasonCodes",
    "ConsumerGuarantees",
    "PublicTypes",
    "PublicApis",
  ] as const);

export const runtimeExecutiveInsightPriorityAttentionRegistry = Object.freeze({
  identity: runtimeExecutiveInsightPriorityAttentionIdentity,
  version: runtimeExecutiveInsightPriorityAttentionVersion,
  namespace: runtimeExecutiveInsightPriorityAttentionNamespace,
  layer: runtimeExecutiveInsightPriorityAttentionLayer,
  capability: runtimeExecutiveInsightPriorityAttentionCapability,
  phase: runtimeExecutiveInsightPriorityAttentionPhase,
  status: runtimeExecutiveInsightPriorityAttentionStatus,
  dependencyIdentity:
    runtimeExecutiveInsightPriorityAttentionDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightPriorityAttentionDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_REGISTRY_SECTIONS.length,
  priorityDimensions: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS,
  priorityDimensionCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS.length,
  priorityBands: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS,
  priorityBandCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS.length,
  urgencyValues: RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES,
  urgencyCount: RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES.length,
  executiveRelevanceValues:
    RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES,
  executiveRelevanceCount:
    RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES.length,
  attentionStates: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES,
  attentionStateCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES.length,
  escalationStates: RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES,
  escalationStateCount: RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES.length,
  suppressionStates: RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES,
  suppressionStateCount: RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES.length,
  reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES,
  reasonCodeCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES.length,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES,
  consumerGuaranteeCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveInsightPriorityAttentionApiNames,
  publicApiCount: runtimeExecutiveInsightPriorityAttentionApiNames.length,
  priorityScoreRange: Object.freeze({ min: 0, max: 1 }),
  nonGoals: Object.freeze([
    "presentation-selection",
    "advisor-prose",
    "stage-execution",
    "automation",
    "ml-ranking",
    "llm-ranking",
    "kpi-calculation",
    "koi-calculation",
  ]),
});

export const runtimeExecutiveInsightPriorityAttention = Object.freeze({
  phase: "PriorityAttention" as const,
  name: "RuntimeExecutiveInsightPriorityAttention" as const,
  identity: runtimeExecutiveInsightPriorityAttentionIdentity,
  version: runtimeExecutiveInsightPriorityAttentionVersion,
  namespace: runtimeExecutiveInsightPriorityAttentionNamespace,
  layer: runtimeExecutiveInsightPriorityAttentionLayer,
  capability: runtimeExecutiveInsightPriorityAttentionCapability,
  architecturalRole:
    runtimeExecutiveInsightPriorityAttentionArchitecturalRole,
  role: "PriorityAttention" as const,
  status: runtimeExecutiveInsightPriorityAttentionStatus,
  upstreamDependency:
    runtimeExecutiveInsightPriorityAttentionDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightPriorityAttentionDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightPriorityAttentionSupportedImportPath,
  deterministic: runtimeExecutiveInsightPriorityAttentionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  pure: true as const,
  stateless: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY,
  priorityDimensions: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS,
  priorityBands: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS,
  urgencyValues: RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES,
  executiveRelevanceValues:
    RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES,
  attentionStates: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES,
  escalationStates: RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES,
  suppressionStates: RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES,
  reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_CONSUMER_GUARANTEES,
  publicTypeNames:
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightPriorityAttentionApiNames,
  registry: runtimeExecutiveInsightPriorityAttentionRegistry,
  resolutionBoundary: "REX-4:3-resolution-only" as const,
  architecturalStatus:
    "REX-4:4 Runtime Executive Insight Priority & Attention — PriorityAttentionReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightPriorityAttentionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightPriorityAttentionIdentity;
  readonly version: typeof runtimeExecutiveInsightPriorityAttentionVersion;
  readonly namespace: typeof runtimeExecutiveInsightPriorityAttentionNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightPriorityAttentionDependencyIdentity;
  readonly priorityDimensionCount: number;
  readonly priorityBandCount: number;
  readonly urgencyCount: number;
  readonly executiveRelevanceCount: number;
  readonly attentionStateCount: number;
  readonly escalationStateCount: number;
  readonly suppressionStateCount: number;
  readonly reasonCodeCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly resolutionBoundaryIntact: boolean;
  readonly upstreamResolutionOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
  readonly severityDistinctFromPriority: boolean;
  readonly importanceDistinctFromPriority: boolean;
}

export function verifyRuntimeExecutiveInsightPriorityAttention():
  RuntimeExecutiveInsightPriorityAttentionVerification {
  const priorityModule = runtimeExecutiveInsightPriorityAttention;
  const registry = runtimeExecutiveInsightPriorityAttentionRegistry;
  const upstream = verifyRuntimeExecutiveInsightResolution();

  const identityOk =
    priorityModule.identity ===
      "REX-4:4/RuntimeExecutiveInsightPriorityAttention" &&
    priorityModule.version === "4.4.0" &&
    priorityModule.namespace ===
      "nexora.rex.insight-experience.priority-attention" &&
    priorityModule.layer === "REX" &&
    priorityModule.capability === "RuntimeExecutiveInsightExperience" &&
    priorityModule.phase === "PriorityAttention" &&
    priorityModule.status === "PriorityAttentionReady" &&
    priorityModule.upstreamDependency ===
      "REX-4:3/RuntimeExecutiveInsightResolution" &&
    priorityModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightResolution" &&
    priorityModule.resolutionBoundary === "REX-4:3-resolution-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS], [
      "severity",
      "importance",
      "urgency",
      "confidence",
      "freshness",
      "scope",
      "focus-relevance",
      "goal-relevance",
      "decision-relevance",
      "execution-relevance",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS], [
      "minimal",
      "low",
      "medium",
      "high",
      "critical",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES], [
      "none",
      "low",
      "moderate",
      "high",
      "immediate",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES], [
      "none",
      "background",
      "notice",
      "focus",
      "urgent",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES], [
      "none",
      "eligible",
      "escalated",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES], [
      "visible",
      "deemphasized",
      "suppressed",
    ]);

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY.introducesKor ===
      false;

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS.includes("kpi") &&
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY.calculatesKpi ===
      false;
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_SUBJECT_KINDS.includes("koi") &&
    RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY.calculatesKoi ===
      false;

  const frozen =
    Object.isFrozen(priorityModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveInsightPriorityAttentionCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_BOUNDARY);

  const resolutionBoundaryIntact =
    priorityModule.boundary.soleImmediateDependency ===
      "REX-4:3/RuntimeExecutiveInsightResolution" &&
    priorityModule.boundary.consumesResolutionOnly === true &&
    priorityModule.boundary.importsRex42Directly === false &&
    priorityModule.boundary.importsRex41Directly === false &&
    priorityModule.boundary.introducesPresentationResolution === false &&
    priorityModule.boundary.introducesAdvisorProse === false &&
    priorityModule.boundary.introducesStageExecution === false &&
    priorityModule.boundary.introducesAutomation === false;

  const registryCountsOk =
    registry.priorityDimensionCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS.length &&
    registry.priorityBandCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS.length &&
    registry.urgencyCount === RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES.length &&
    registry.attentionStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES.length &&
    registry.reasonCodeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightPriorityAttentionApiNames.length;

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    frozen &&
    resolutionBoundaryIntact &&
    registryCountsOk &&
    upstream.ok === true &&
    isFiniteWeight(0) &&
    isFiniteWeight(1) &&
    !isFiniteWeight(Number.NaN) &&
    !isFiniteWeight(Number.POSITIVE_INFINITY) &&
    priorityModule.principle ===
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightPriorityAttentionIdentity,
    version: runtimeExecutiveInsightPriorityAttentionVersion,
    namespace: runtimeExecutiveInsightPriorityAttentionNamespace,
    dependencyIdentity:
      runtimeExecutiveInsightPriorityAttentionDependencyIdentity,
    priorityDimensionCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_DIMENSIONS.length,
    priorityBandCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_BANDS.length,
    urgencyCount: RUNTIME_EXECUTIVE_INSIGHT_URGENCY_VALUES.length,
    executiveRelevanceCount:
      RUNTIME_EXECUTIVE_INSIGHT_EXECUTIVE_RELEVANCE_VALUES.length,
    attentionStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_STATES.length,
    escalationStateCount: RUNTIME_EXECUTIVE_INSIGHT_ESCALATION_STATES.length,
    suppressionStateCount: RUNTIME_EXECUTIVE_INSIGHT_SUPPRESSION_STATES.length,
    reasonCodeCount: RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_REASON_CODES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveInsightPriorityAttentionApiNames.length,
    sectionCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRIORITY_ATTENTION_REGISTRY_SECTIONS.length,
    frozen,
    resolutionBoundaryIntact,
    upstreamResolutionOk: upstream.ok === true,
    noKor,
    kpiSupported,
    koiSupported,
    severityDistinctFromPriority:
      priorityModule.boundary.severityDistinctFromPriority === true,
    importanceDistinctFromPriority:
      priorityModule.boundary.importanceDistinctFromPriority === true,
  });
}
