/**
 * REX-4:1 — Runtime Executive Insight Experience Foundation.
 *
 * Establishes the canonical deterministic foundation for Executive Insights
 * inside Nexora’s runtime-enabled Executive Experience:
 * vocabulary, immutable primitives, canonical value domains, subject model,
 * evidence model, signal model, relationship model, and foundation registry.
 *
 * Canonical flow:
 *   REX-3:9 Public Index → REX-4:1 Runtime Executive Insight Experience Foundation
 *
 * Foundation only. No insight inference, scoring, ranking, prioritization,
 * presentation resolution, orchestration, AI reasoning, rendering,
 * persistence, automation, or external integration.
 *
 * An Executive Insight is a structured executive-relevant observation
 * associated with one or more Nexora runtime subjects and supported by
 * explicit evidence/signals — not a rendered card, Advisor reply, or Stage cue.
 */

import {
  runtimeExecutiveAdvisorExperiencePublicIndexIdentity,
  runtimeExecutiveAdvisorExperiencePublicIndexSupportedImportPath,
  runtimeExecutiveAdvisorExperiencePublicIndexVersion,
  verifyRuntimeExecutiveAdvisorExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceFoundationIdentity =
  "REX-4:1/RuntimeExecutiveInsightExperienceFoundation" as const;

export const runtimeExecutiveInsightExperienceFoundationVersion =
  "4.1.0" as const;

export const runtimeExecutiveInsightExperienceFoundationNamespace =
  "nexora.rex.insight-experience.foundation" as const;

export const runtimeExecutiveInsightExperienceFoundationLayer =
  "REX" as const;

export const runtimeExecutiveInsightExperienceFoundationCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightExperienceFoundationPhase =
  "Foundation" as const;

export const runtimeExecutiveInsightExperienceFoundationStatus =
  "FoundationReady" as const;

export const runtimeExecutiveInsightExperienceFoundationArchitecturalRole =
  "RuntimeExecutiveInsightExperienceFoundationBoundary" as const;

export const runtimeExecutiveInsightExperienceFoundationDependencyIdentity =
  runtimeExecutiveAdvisorExperiencePublicIndexIdentity;

export const runtimeExecutiveInsightExperienceFoundationDependencyPath =
  runtimeExecutiveAdvisorExperiencePublicIndexSupportedImportPath;

/** Sole supported import path for REX-4 consumers of this foundation. */
export const runtimeExecutiveInsightExperienceFoundationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation" as const;

export const runtimeExecutiveInsightExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeExecutiveInsightExperienceFoundationDeterministic =
  true as const;

export const runtimeExecutiveInsightExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceFoundationIdentity,
    version: runtimeExecutiveInsightExperienceFoundationVersion,
    namespace: runtimeExecutiveInsightExperienceFoundationNamespace,
    layer: runtimeExecutiveInsightExperienceFoundationLayer,
    capability: runtimeExecutiveInsightExperienceFoundationCapability,
    phase: runtimeExecutiveInsightExperienceFoundationPhase,
    status: runtimeExecutiveInsightExperienceFoundationStatus,
    architecturalRole:
      runtimeExecutiveInsightExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorExperiencePublicIndexVersion,
    stabilityStatus:
      runtimeExecutiveInsightExperienceFoundationStability,
    deterministicStatus:
      runtimeExecutiveInsightExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightExperienceFoundationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveInsightExperienceFoundationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PRINCIPLE =
  "An Executive Insight is a structured executive-relevant observation supported by explicit evidence and signals — not an inferred score, Advisor reply, Stage reaction, or rendered presentation." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  insightAuthority: "REX-4:1" as const,
  architecturalRole:
    "RuntimeExecutiveInsightExperienceFoundationBoundary" as const,
  soleImmediateDependency:
    "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  importsRex3InternalDirectly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  presentationNeutral: true as const,
  domainNeutral: true as const,
  introducesInference: false as const,
  introducesScoring: false as const,
  introducesRanking: false as const,
  introducesPrioritization: false as const,
  introducesPresentationResolution: false as const,
  introducesOrchestration: false as const,
  introducesLlmGeneration: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
});

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_RELATIONSHIP_CHAIN =
  Object.freeze([
    "Runtime Subjects",
    "Evidence / Signals",
    "Executive Insight Structure",
    "Relationships / Attention Vocabulary",
    "Later REX-4 resolution / presentation",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex41Owns: "What an Executive Insight is (structure and vocabulary)." as const,
    laterRex4Owns:
      "Whether an insight should exist, how important it is, how it is ranked, presented, or acted upon." as const,
    doesNotDetermineExistence: true as const,
    doesNotInferBusinessMeaning: true as const,
    doesNotResolvePresentation: true as const,
    doesNotAdviseOrAct: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

/**
 * Canonical ordered Executive Insight categories.
 * Membership only — no category behavior inference in REX-4:1.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES = Object.freeze([
  "change",
  "trend",
  "deviation",
  "risk",
  "opportunity",
  "anomaly",
  "dependency",
  "conflict",
  "progress",
  "threshold",
  "forecast",
  "attention",
] as const);

export type RuntimeExecutiveInsightCategory =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES)[number];

/**
 * Insight subject kinds.
 * KOI = Key Output Index (goals/intents / executive focus).
 * KPI = Key Performance Indicator (may associate with NexoraObjects).
 * Do not introduce KOR.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS = Object.freeze([
  "nexora-object",
  "kpi",
  "koi",
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "pack",
  "connection",
  "scene",
] as const);

export type RuntimeExecutiveInsightSubjectKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS = Object.freeze({
  kpi: "Key Performance Indicator associated with NexoraObjects" as const,
  koi: "Key Output Index associated with goals, intents, and executive focus" as const,
  usesOnlyCanonicalIndexTerminology: true as const,
  introducesKor: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
});

/**
 * Evidence kinds — representation only. No evaluation or business meaning.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS = Object.freeze([
  "observation",
  "metric",
  "state",
  "transition",
  "comparison",
  "threshold",
  "relationship",
  "runtime-signal",
] as const);

export type RuntimeExecutiveInsightEvidenceKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS)[number];

/**
 * Signal kinds — descriptive runtime indications only. Not inferential.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS = Object.freeze([
  "observation",
  "metric",
  "state",
  "transition",
  "threshold",
  "relationship",
  "attention",
  "freshness",
  "runtime",
] as const);

export type RuntimeExecutiveInsightSignalKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS)[number];

/**
 * Observed/resolved direction only. Increasing is not inherently good or bad.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS = Object.freeze([
  "increasing",
  "decreasing",
  "stable",
  "mixed",
  "emerging",
  "resolved",
  "unknown",
] as const);

export type RuntimeExecutiveInsightDirection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS)[number];

/**
 * Severity is distinct from importance, urgency, confidence, and attention.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES = Object.freeze([
  "none",
  "low",
  "moderate",
  "high",
  "critical",
] as const);

export type RuntimeExecutiveInsightSeverity =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES)[number];

/**
 * Importance represents executive significance as a domain value only.
 * REX-4:1 does not calculate importance.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES = Object.freeze([
  "minimal",
  "low",
  "medium",
  "high",
  "essential",
] as const);

export type RuntimeExecutiveInsightImportance =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES)[number];

/**
 * Freshness vocabulary for later layers. No wall-clock evaluation here.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES = Object.freeze([
  "current",
  "recent",
  "aging",
  "stale",
  "unknown",
] as const);

export type RuntimeExecutiveInsightFreshness =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES)[number];

/**
 * Semantic reach of an insight. No access-control semantics.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_SCOPES = Object.freeze([
  "subject",
  "object",
  "goal",
  "scene",
  "workspace",
  "model",
  "organization",
  "global",
] as const);

export type RuntimeExecutiveInsightScope =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SCOPES)[number];

/**
 * Provenance kinds. external-reference is metadata only — no external access.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS = Object.freeze([
  "runtime",
  "model",
  "object",
  "metric",
  "pack",
  "scenario",
  "decision",
  "execution",
  "director",
  "external-reference",
  "unknown",
] as const);

export type RuntimeExecutiveInsightSourceKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS)[number];

/**
 * Relationship kinds. caused-by is supplied structured semantics only —
 * presence of a relationship does not infer causality by itself.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS = Object.freeze([
  "supports",
  "contradicts",
  "depends-on",
  "caused-by",
  "contributes-to",
  "related-to",
  "supersedes",
  "derived-from",
] as const);

export type RuntimeExecutiveInsightRelationshipKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS)[number];

/**
 * Explicit relationship direction. Kind semantics apply along this direction.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS = Object.freeze([
  "forward",
  "reverse",
  "bidirectional",
] as const);

export type RuntimeExecutiveInsightRelationshipDirection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS)[number];

/**
 * Attention state is separate from severity and importance.
 * REX-4:1 does not determine the appropriate attention state.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES = Object.freeze([
  "none",
  "background",
  "notice",
  "focus",
  "urgent",
] as const);

export type RuntimeExecutiveInsightAttentionState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES)[number];

/**
 * Canonical Executive Experience presentation states — compatibility only.
 * minimum → awareness; report → understanding;
 * operation → executive interaction/action context.
 * No presentation resolution in REX-4:1.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

export type RuntimeExecutiveInsightPresentationState =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS =
  Object.freeze({
    minimum: "awareness" as const,
    report: "understanding" as const,
    operation: "executive-interaction-action-context" as const,
  });

/**
 * Optional lifecycle/status metadata domain. Representation only.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES = Object.freeze([
  "proposed",
  "active",
  "superseded",
  "resolved",
  "archived",
  "unknown",
] as const);

export type RuntimeExecutiveInsightLifecycleStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES)[number];

/**
 * Bounded normalized confidence: 0 <= confidence <= 1.
 * Deterministic and serializable. No confidence inference.
 */
export type RuntimeExecutiveInsightConfidence = number & {
  readonly __runtimeExecutiveInsightConfidenceBrand: unique symbol;
};

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES = Object.freeze([
  "insight-category-modeling",
  "insight-subject-modeling",
  "insight-evidence-modeling",
  "insight-signal-modeling",
  "insight-direction-modeling",
  "insight-severity-modeling",
  "insight-importance-modeling",
  "insight-confidence-modeling",
  "insight-freshness-modeling",
  "insight-scope-modeling",
  "insight-source-modeling",
  "insight-relationship-modeling",
  "insight-attention-modeling",
  "presentation-state-compatibility",
  "stable-identity-primitives",
  "foundation-registry",
] as const);

export type RuntimeExecutiveInsightFoundationCapability =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightSubject {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveInsightSubjectKind;
  readonly label?: string;
  readonly referenceId?: string;
}

export interface RuntimeExecutiveInsightSource {
  readonly kind: RuntimeExecutiveInsightSourceKind;
  readonly sourceId?: string;
  readonly reference?: string;
}

export interface RuntimeExecutiveInsightEvidence {
  readonly evidenceId: string;
  readonly kind: RuntimeExecutiveInsightEvidenceKind;
  readonly source: RuntimeExecutiveInsightSource;
  readonly subjectId?: string;
  readonly reference?: string;
  readonly summary?: string;
  readonly observedAtIso?: string;
}

export interface RuntimeExecutiveInsightSignal {
  readonly signalId: string;
  readonly kind: RuntimeExecutiveInsightSignalKind;
  readonly subjectId: string;
  readonly source: RuntimeExecutiveInsightSource;
  readonly evidenceIds?: ReadonlyArray<string>;
  readonly direction?: RuntimeExecutiveInsightDirection;
  readonly confidence?: RuntimeExecutiveInsightConfidence;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly observedAtIso?: string;
}

export interface RuntimeExecutiveInsightRelationshipEndpoint {
  readonly endpointKind: "insight" | "subject";
  readonly endpointId: string;
}

export interface RuntimeExecutiveInsightRelationship {
  readonly relationshipId: string;
  readonly kind: RuntimeExecutiveInsightRelationshipKind;
  readonly direction: RuntimeExecutiveInsightRelationshipDirection;
  readonly from: RuntimeExecutiveInsightRelationshipEndpoint;
  readonly to: RuntimeExecutiveInsightRelationshipEndpoint;
}

/**
 * Canonical immutable Runtime Executive Insight.
 * Plain data only — no callbacks, class instances, React elements, Dates,
 * Maps, Sets, Promises, mutable containers, or service handles.
 */
export interface RuntimeExecutiveInsight {
  readonly insightId: string;
  readonly category: RuntimeExecutiveInsightCategory;
  readonly primarySubject: RuntimeExecutiveInsightSubject;
  readonly relatedSubjects?: ReadonlyArray<RuntimeExecutiveInsightSubject>;
  readonly evidence: ReadonlyArray<RuntimeExecutiveInsightEvidence>;
  readonly signals: ReadonlyArray<RuntimeExecutiveInsightSignal>;
  readonly direction: RuntimeExecutiveInsightDirection;
  readonly severity: RuntimeExecutiveInsightSeverity;
  readonly importance: RuntimeExecutiveInsightImportance;
  readonly confidence: RuntimeExecutiveInsightConfidence;
  readonly freshness: RuntimeExecutiveInsightFreshness;
  readonly scope: RuntimeExecutiveInsightScope;
  readonly source: RuntimeExecutiveInsightSource;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveInsightRelationship>;
  readonly attentionState: RuntimeExecutiveInsightAttentionState;
  readonly lifecycleStatus?: RuntimeExecutiveInsightLifecycleStatus;
  readonly presentationCompatibility?: RuntimeExecutiveInsightPresentationState;
  readonly summary?: string;
  readonly observedAtIso?: string;
  readonly foundationIdentity: typeof runtimeExecutiveInsightExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveInsightExperienceFoundationVersion;
}

export interface RuntimeExecutiveInsightFoundationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveInsightFoundationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightFoundationIssue>;
}

// ─── Invariants / forbidden ─────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "insight-is-structured-observation",
    order: 1,
    statement:
      "An Executive Insight is a structured observation with subjects, evidence, and signals — not a rendered UI unit.",
  }),
  Object.freeze({
    id: "stable-insight-identifier",
    order: 2,
    statement: "Every insight has a stable non-empty identifier.",
  }),
  Object.freeze({
    id: "canonical-insight-categories",
    order: 3,
    statement: "Insight category is one of the approved ordered categories.",
  }),
  Object.freeze({
    id: "kpi-koi-distinct",
    order: 4,
    statement:
      "KPI and KOI remain distinct subject kinds with canonical Index terminology.",
  }),
  Object.freeze({
    id: "no-kor-terminology",
    order: 5,
    statement: "KOR terminology is not part of the Insight foundation.",
  }),
  Object.freeze({
    id: "evidence-not-evaluated",
    order: 6,
    statement: "Evidence is represented but not evaluated in REX-4:1.",
  }),
  Object.freeze({
    id: "signals-not-inferential",
    order: 7,
    statement: "Signals are descriptive runtime indications, not inferences.",
  }),
  Object.freeze({
    id: "direction-not-value-judgment",
    order: 8,
    statement:
      "Direction describes observed/resolved direction without good/bad meaning.",
  }),
  Object.freeze({
    id: "severity-importance-attention-distinct",
    order: 9,
    statement:
      "Severity, importance, confidence, and attention remain separate domains.",
  }),
  Object.freeze({
    id: "confidence-normalized-bounds",
    order: 10,
    statement: "Confidence is a bounded normalized numeric value in [0, 1].",
  }),
  Object.freeze({
    id: "no-wall-clock-dependency",
    order: 11,
    statement:
      "Foundation functions do not sample wall-clock time or depend on ambient clocks.",
  }),
  Object.freeze({
    id: "presentation-compatibility-only",
    order: 12,
    statement:
      "minimum / report / operation are compatibility primitives, not resolved presentations.",
  }),
  Object.freeze({
    id: "relationship-direction-explicit",
    order: 13,
    statement: "Insight relationships carry explicit direction.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 14,
    statement: "Foundation APIs do not mutate caller input.",
  }),
  Object.freeze({
    id: "deterministic-foundation",
    order: 15,
    statement:
      "Equivalent foundation input produces equivalent foundation output.",
  }),
] as const);

export type RuntimeExecutiveInsightFoundationInvariant =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "insight inference",
    "insight scoring",
    "insight ranking",
    "insight prioritization",
    "attention resolution",
    "presentation resolution",
    "confidence inference",
    "anomaly detection",
    "threshold evaluation",
    "trend analysis",
    "forecasting algorithms",
    "KPI calculation",
    "KOI calculation",
    "Advisor prose generation",
    "recommendation generation",
    "Stage reactions",
    "scene orchestration",
    "AI/LLM calls",
    "autonomous agents",
    "automation",
    "React",
    "Three.js",
    "CSS",
    "API calls",
    "database access",
    "persistence",
    "telemetry",
    "timers",
    "event listeners",
    "application state management",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Categories",
    "SubjectKinds",
    "EvidenceKinds",
    "SignalKinds",
    "Directions",
    "Severities",
    "ImportanceValues",
    "FreshnessValues",
    "Scopes",
    "SourceKinds",
    "RelationshipKinds",
    "RelationshipDirections",
    "AttentionStates",
    "PresentationStates",
    "LifecycleStatuses",
    "Capabilities",
    "PublicApis",
  ] as const);

export type RuntimeExecutiveInsightFoundationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS)[number];

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

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function requireOpaqueId(value: string, field: string): string {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
  return value;
}

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveInsightFoundationIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function asConfidence(value: number): RuntimeExecutiveInsightConfidence {
  return value as RuntimeExecutiveInsightConfidence;
}

// ─── Predicates (vocabulary) ────────────────────────────────────────────────

export function isRuntimeExecutiveInsightCategory(
  value: unknown,
): value is RuntimeExecutiveInsightCategory {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightSubjectKind(
  value: unknown,
): value is RuntimeExecutiveInsightSubjectKind {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightEvidenceKind(
  value: unknown,
): value is RuntimeExecutiveInsightEvidenceKind {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightSignalKind(
  value: unknown,
): value is RuntimeExecutiveInsightSignalKind {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightDirection(
  value: unknown,
): value is RuntimeExecutiveInsightDirection {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightSeverity(
  value: unknown,
): value is RuntimeExecutiveInsightSeverity {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightImportance(
  value: unknown,
): value is RuntimeExecutiveInsightImportance {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES as readonly unknown[]
  ).includes(value);
}

/**
 * Validates bounded normalized confidence: finite number in [0, 1].
 * Does not infer confidence from evidence or signals.
 */
export function isRuntimeExecutiveInsightConfidence(
  value: unknown,
): value is RuntimeExecutiveInsightConfidence {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

export function isRuntimeExecutiveInsightFreshness(
  value: unknown,
): value is RuntimeExecutiveInsightFreshness {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightScope(
  value: unknown,
): value is RuntimeExecutiveInsightScope {
  return (RUNTIME_EXECUTIVE_INSIGHT_SCOPES as readonly unknown[]).includes(
    value,
  );
}

export function isRuntimeExecutiveInsightSourceKind(
  value: unknown,
): value is RuntimeExecutiveInsightSourceKind {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightRelationshipKind(
  value: unknown,
): value is RuntimeExecutiveInsightRelationshipKind {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightRelationshipDirection(
  value: unknown,
): value is RuntimeExecutiveInsightRelationshipDirection {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightAttentionState(
  value: unknown,
): value is RuntimeExecutiveInsightAttentionState {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightPresentationState(
  value: unknown,
): value is RuntimeExecutiveInsightPresentationState {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightLifecycleStatus(
  value: unknown,
): value is RuntimeExecutiveInsightLifecycleStatus {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightFoundationCapability(
  value: unknown,
): value is RuntimeExecutiveInsightFoundationCapability {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

// ─── Stable identity primitives ─────────────────────────────────────────────

/**
 * Deterministic insight ID from caller-provided opaque key.
 * Identical key → identical ID. No randomness, UUID, or wall-clock.
 */
export function createRuntimeExecutiveInsightId(input: {
  readonly key: string;
}): string {
  return `rex.insight:${requireOpaqueId(input.key, "key")}`;
}

export function createRuntimeExecutiveInsightSubjectRef(input: {
  readonly kind: RuntimeExecutiveInsightSubjectKind;
  readonly key: string;
}): string {
  if (!isRuntimeExecutiveInsightSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known Insight subject kind");
  }
  return `rex.insight.subject:${input.kind}:${requireOpaqueId(input.key, "key")}`;
}

export function createRuntimeExecutiveInsightEvidenceId(input: {
  readonly key: string;
}): string {
  return `rex.insight.evidence:${requireOpaqueId(input.key, "key")}`;
}

export function createRuntimeExecutiveInsightSignalId(input: {
  readonly key: string;
}): string {
  return `rex.insight.signal:${requireOpaqueId(input.key, "key")}`;
}

export function createRuntimeExecutiveInsightRelationshipId(input: {
  readonly key: string;
}): string {
  return `rex.insight.relationship:${requireOpaqueId(input.key, "key")}`;
}

// ─── Normalization / constructors ───────────────────────────────────────────

export function normalizeRuntimeExecutiveInsightConfidence(
  value: number,
): RuntimeExecutiveInsightConfidence {
  if (!isRuntimeExecutiveInsightConfidence(value)) {
    throw new TypeError("confidence must be a finite number in [0, 1]");
  }
  return asConfidence(value);
}

export function normalizeRuntimeExecutiveInsightSource(
  input: RuntimeExecutiveInsightSource,
): RuntimeExecutiveInsightSource {
  if (!isRuntimeExecutiveInsightSourceKind(input.kind)) {
    throw new TypeError("kind must be a known Insight source kind");
  }
  if (input.sourceId !== undefined && !isNonEmptyString(input.sourceId)) {
    throw new TypeError("sourceId must be a non-empty string when provided");
  }
  if (input.reference !== undefined && typeof input.reference !== "string") {
    throw new TypeError("reference must be a string when provided");
  }

  return Object.freeze({
    kind: input.kind,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
  });
}

export function normalizeRuntimeExecutiveInsightSubject(
  input: RuntimeExecutiveInsightSubject,
): RuntimeExecutiveInsightSubject {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId must be a non-empty string");
  }
  if (!isRuntimeExecutiveInsightSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known Insight subject kind");
  }
  if (input.label !== undefined && typeof input.label !== "string") {
    throw new TypeError("label must be a string when provided");
  }
  if (
    input.referenceId !== undefined &&
    !isNonEmptyString(input.referenceId)
  ) {
    throw new TypeError("referenceId must be a non-empty string when provided");
  }

  return Object.freeze({
    subjectId: input.subjectId,
    kind: input.kind,
    ...(input.label !== undefined ? { label: input.label } : {}),
    ...(input.referenceId !== undefined
      ? { referenceId: input.referenceId }
      : {}),
  });
}

export function normalizeRuntimeExecutiveInsightEvidence(
  input: RuntimeExecutiveInsightEvidence,
): RuntimeExecutiveInsightEvidence {
  if (!isNonEmptyString(input.evidenceId)) {
    throw new TypeError("evidenceId must be a non-empty string");
  }
  if (!isRuntimeExecutiveInsightEvidenceKind(input.kind)) {
    throw new TypeError("kind must be a known Insight evidence kind");
  }
  if (input.subjectId !== undefined && !isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId must be a non-empty string when provided");
  }
  if (input.reference !== undefined && typeof input.reference !== "string") {
    throw new TypeError("reference must be a string when provided");
  }
  if (input.summary !== undefined && typeof input.summary !== "string") {
    throw new TypeError("summary must be a string when provided");
  }
  if (
    input.observedAtIso !== undefined &&
    !isNonEmptyString(input.observedAtIso)
  ) {
    throw new TypeError(
      "observedAtIso must be a non-empty string when provided",
    );
  }

  return Object.freeze({
    evidenceId: input.evidenceId,
    kind: input.kind,
    source: normalizeRuntimeExecutiveInsightSource(input.source),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
  });
}

export function normalizeRuntimeExecutiveInsightSignal(
  input: RuntimeExecutiveInsightSignal,
): RuntimeExecutiveInsightSignal {
  if (!isNonEmptyString(input.signalId)) {
    throw new TypeError("signalId must be a non-empty string");
  }
  if (!isRuntimeExecutiveInsightSignalKind(input.kind)) {
    throw new TypeError("kind must be a known Insight signal kind");
  }
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId must be a non-empty string");
  }
  if (
    input.direction !== undefined &&
    !isRuntimeExecutiveInsightDirection(input.direction)
  ) {
    throw new TypeError("direction must be a known Insight direction");
  }
  if (
    input.confidence !== undefined &&
    !isRuntimeExecutiveInsightConfidence(input.confidence)
  ) {
    throw new TypeError("confidence must be a finite number in [0, 1]");
  }
  if (
    input.freshness !== undefined &&
    !isRuntimeExecutiveInsightFreshness(input.freshness)
  ) {
    throw new TypeError("freshness must be a known Insight freshness value");
  }
  if (
    input.observedAtIso !== undefined &&
    !isNonEmptyString(input.observedAtIso)
  ) {
    throw new TypeError(
      "observedAtIso must be a non-empty string when provided",
    );
  }
  if (input.evidenceIds !== undefined) {
    if (!Array.isArray(input.evidenceIds)) {
      throw new TypeError("evidenceIds must be a readonly array when provided");
    }
    if (!input.evidenceIds.every(isNonEmptyString)) {
      throw new TypeError("evidenceIds entries must be non-empty strings");
    }
    if (!unique(input.evidenceIds)) {
      throw new TypeError("evidenceIds must be unique");
    }
  }

  return Object.freeze({
    signalId: input.signalId,
    kind: input.kind,
    subjectId: input.subjectId,
    source: normalizeRuntimeExecutiveInsightSource(input.source),
    ...(input.evidenceIds !== undefined
      ? { evidenceIds: Object.freeze([...input.evidenceIds]) }
      : {}),
    ...(input.direction !== undefined ? { direction: input.direction } : {}),
    ...(input.confidence !== undefined
      ? { confidence: asConfidence(input.confidence) }
      : {}),
    ...(input.freshness !== undefined ? { freshness: input.freshness } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
  });
}

export function normalizeRuntimeExecutiveInsightRelationship(
  input: RuntimeExecutiveInsightRelationship,
): RuntimeExecutiveInsightRelationship {
  if (!isNonEmptyString(input.relationshipId)) {
    throw new TypeError("relationshipId must be a non-empty string");
  }
  if (!isRuntimeExecutiveInsightRelationshipKind(input.kind)) {
    throw new TypeError("kind must be a known Insight relationship kind");
  }
  if (!isRuntimeExecutiveInsightRelationshipDirection(input.direction)) {
    throw new TypeError(
      "direction must be a known Insight relationship direction",
    );
  }
  if (
    !isPlainObject(input.from) ||
    (input.from.endpointKind !== "insight" &&
      input.from.endpointKind !== "subject") ||
    !isNonEmptyString(input.from.endpointId)
  ) {
    throw new TypeError("from must be a valid relationship endpoint");
  }
  if (
    !isPlainObject(input.to) ||
    (input.to.endpointKind !== "insight" &&
      input.to.endpointKind !== "subject") ||
    !isNonEmptyString(input.to.endpointId)
  ) {
    throw new TypeError("to must be a valid relationship endpoint");
  }

  return Object.freeze({
    relationshipId: input.relationshipId,
    kind: input.kind,
    direction: input.direction,
    from: Object.freeze({
      endpointKind: input.from.endpointKind,
      endpointId: input.from.endpointId,
    }),
    to: Object.freeze({
      endpointKind: input.to.endpointKind,
      endpointId: input.to.endpointId,
    }),
  });
}

export function normalizeRuntimeExecutiveInsight(
  input: Omit<
    RuntimeExecutiveInsight,
    "foundationIdentity" | "foundationVersion"
  > & {
    readonly foundationIdentity?: typeof runtimeExecutiveInsightExperienceFoundationIdentity;
    readonly foundationVersion?: typeof runtimeExecutiveInsightExperienceFoundationVersion;
  },
): RuntimeExecutiveInsight {
  if (!isNonEmptyString(input.insightId)) {
    throw new TypeError("insightId must be a non-empty string");
  }
  if (!isRuntimeExecutiveInsightCategory(input.category)) {
    throw new TypeError("category must be a known Insight category");
  }
  if (!isRuntimeExecutiveInsightDirection(input.direction)) {
    throw new TypeError("direction must be a known Insight direction");
  }
  if (!isRuntimeExecutiveInsightSeverity(input.severity)) {
    throw new TypeError("severity must be a known Insight severity");
  }
  if (!isRuntimeExecutiveInsightImportance(input.importance)) {
    throw new TypeError("importance must be a known Insight importance value");
  }
  if (!isRuntimeExecutiveInsightConfidence(input.confidence)) {
    throw new TypeError("confidence must be a finite number in [0, 1]");
  }
  if (!isRuntimeExecutiveInsightFreshness(input.freshness)) {
    throw new TypeError("freshness must be a known Insight freshness value");
  }
  if (!isRuntimeExecutiveInsightScope(input.scope)) {
    throw new TypeError("scope must be a known Insight scope");
  }
  if (!isRuntimeExecutiveInsightAttentionState(input.attentionState)) {
    throw new TypeError(
      "attentionState must be a known Insight attention state",
    );
  }
  if (
    input.lifecycleStatus !== undefined &&
    !isRuntimeExecutiveInsightLifecycleStatus(input.lifecycleStatus)
  ) {
    throw new TypeError(
      "lifecycleStatus must be a known Insight lifecycle status",
    );
  }
  if (
    input.presentationCompatibility !== undefined &&
    !isRuntimeExecutiveInsightPresentationState(
      input.presentationCompatibility,
    )
  ) {
    throw new TypeError(
      "presentationCompatibility must be minimum, report, or operation",
    );
  }
  if (input.summary !== undefined && typeof input.summary !== "string") {
    throw new TypeError("summary must be a string when provided");
  }
  if (
    input.observedAtIso !== undefined &&
    !isNonEmptyString(input.observedAtIso)
  ) {
    throw new TypeError(
      "observedAtIso must be a non-empty string when provided",
    );
  }
  if (!Array.isArray(input.evidence)) {
    throw new TypeError("evidence must be a readonly array");
  }
  if (!Array.isArray(input.signals)) {
    throw new TypeError("signals must be a readonly array");
  }
  if (
    input.relatedSubjects !== undefined &&
    !Array.isArray(input.relatedSubjects)
  ) {
    throw new TypeError("relatedSubjects must be a readonly array when provided");
  }
  if (
    input.relationships !== undefined &&
    !Array.isArray(input.relationships)
  ) {
    throw new TypeError("relationships must be a readonly array when provided");
  }
  if (
    input.foundationIdentity !== undefined &&
    input.foundationIdentity !==
      runtimeExecutiveInsightExperienceFoundationIdentity
  ) {
    throw new TypeError("foundationIdentity metadata is invalid");
  }
  if (
    input.foundationVersion !== undefined &&
    input.foundationVersion !==
      runtimeExecutiveInsightExperienceFoundationVersion
  ) {
    throw new TypeError("foundationVersion metadata is invalid");
  }

  const primarySubject = normalizeRuntimeExecutiveInsightSubject(
    input.primarySubject,
  );
  const relatedSubjects =
    input.relatedSubjects === undefined
      ? undefined
      : Object.freeze(
          input.relatedSubjects.map((subject) =>
            normalizeRuntimeExecutiveInsightSubject(subject),
          ),
        );
  const evidence = Object.freeze(
    input.evidence.map((entry) =>
      normalizeRuntimeExecutiveInsightEvidence(entry),
    ),
  );
  const signals = Object.freeze(
    input.signals.map((entry) =>
      normalizeRuntimeExecutiveInsightSignal(entry),
    ),
  );
  const relationships =
    input.relationships === undefined
      ? undefined
      : Object.freeze(
          input.relationships.map((entry) =>
            normalizeRuntimeExecutiveInsightRelationship(entry),
          ),
        );

  if (evidence.length > 0) {
    const evidenceIds = evidence.map((entry) => entry.evidenceId);
    if (!unique(evidenceIds)) {
      throw new TypeError("evidence identifiers within an insight must be unique");
    }
  }
  if (signals.length > 0) {
    const signalIds = signals.map((entry) => entry.signalId);
    if (!unique(signalIds)) {
      throw new TypeError("signal identifiers within an insight must be unique");
    }
  }
  if (relationships !== undefined && relationships.length > 0) {
    const relationshipIds = relationships.map((entry) => entry.relationshipId);
    if (!unique(relationshipIds)) {
      throw new TypeError(
        "relationship identifiers within an insight must be unique",
      );
    }
  }

  return Object.freeze({
    insightId: input.insightId,
    category: input.category,
    primarySubject,
    ...(relatedSubjects !== undefined ? { relatedSubjects } : {}),
    evidence,
    signals,
    direction: input.direction,
    severity: input.severity,
    importance: input.importance,
    confidence: asConfidence(input.confidence),
    freshness: input.freshness,
    scope: input.scope,
    source: normalizeRuntimeExecutiveInsightSource(input.source),
    ...(relationships !== undefined ? { relationships } : {}),
    attentionState: input.attentionState,
    ...(input.lifecycleStatus !== undefined
      ? { lifecycleStatus: input.lifecycleStatus }
      : {}),
    ...(input.presentationCompatibility !== undefined
      ? { presentationCompatibility: input.presentationCompatibility }
      : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
    foundationIdentity: runtimeExecutiveInsightExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveInsightExperienceFoundationVersion,
  });
}

export function createRuntimeExecutiveInsightSubject(input: {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveInsightSubjectKind;
  readonly label?: string;
  readonly referenceId?: string;
}): RuntimeExecutiveInsightSubject {
  return normalizeRuntimeExecutiveInsightSubject({
    subjectId: input.subjectId,
    kind: input.kind,
    ...(input.label !== undefined ? { label: input.label } : {}),
    ...(input.referenceId !== undefined
      ? { referenceId: input.referenceId }
      : {}),
  });
}

export function createRuntimeExecutiveInsightSource(input: {
  readonly kind: RuntimeExecutiveInsightSourceKind;
  readonly sourceId?: string;
  readonly reference?: string;
}): RuntimeExecutiveInsightSource {
  return normalizeRuntimeExecutiveInsightSource({
    kind: input.kind,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
  });
}

export function createRuntimeExecutiveInsightEvidence(input: {
  readonly evidenceId: string;
  readonly kind: RuntimeExecutiveInsightEvidenceKind;
  readonly source: RuntimeExecutiveInsightSource;
  readonly subjectId?: string;
  readonly reference?: string;
  readonly summary?: string;
  readonly observedAtIso?: string;
}): RuntimeExecutiveInsightEvidence {
  return normalizeRuntimeExecutiveInsightEvidence(input);
}

export function createRuntimeExecutiveInsightSignal(input: {
  readonly signalId: string;
  readonly kind: RuntimeExecutiveInsightSignalKind;
  readonly subjectId: string;
  readonly source: RuntimeExecutiveInsightSource;
  readonly evidenceIds?: ReadonlyArray<string>;
  readonly direction?: RuntimeExecutiveInsightDirection;
  readonly confidence?: number;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly observedAtIso?: string;
}): RuntimeExecutiveInsightSignal {
  return normalizeRuntimeExecutiveInsightSignal({
    signalId: input.signalId,
    kind: input.kind,
    subjectId: input.subjectId,
    source: input.source,
    ...(input.evidenceIds !== undefined
      ? { evidenceIds: input.evidenceIds }
      : {}),
    ...(input.direction !== undefined ? { direction: input.direction } : {}),
    ...(input.confidence !== undefined
      ? { confidence: asConfidence(input.confidence) }
      : {}),
    ...(input.freshness !== undefined ? { freshness: input.freshness } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
  });
}

export function createRuntimeExecutiveInsightRelationship(input: {
  readonly relationshipId: string;
  readonly kind: RuntimeExecutiveInsightRelationshipKind;
  readonly direction: RuntimeExecutiveInsightRelationshipDirection;
  readonly from: RuntimeExecutiveInsightRelationshipEndpoint;
  readonly to: RuntimeExecutiveInsightRelationshipEndpoint;
}): RuntimeExecutiveInsightRelationship {
  return normalizeRuntimeExecutiveInsightRelationship(input);
}

export function createRuntimeExecutiveInsight(input: {
  readonly insightId: string;
  readonly category: RuntimeExecutiveInsightCategory;
  readonly primarySubject: RuntimeExecutiveInsightSubject;
  readonly relatedSubjects?: ReadonlyArray<RuntimeExecutiveInsightSubject>;
  readonly evidence?: ReadonlyArray<RuntimeExecutiveInsightEvidence>;
  readonly signals?: ReadonlyArray<RuntimeExecutiveInsightSignal>;
  readonly direction?: RuntimeExecutiveInsightDirection;
  readonly severity?: RuntimeExecutiveInsightSeverity;
  readonly importance?: RuntimeExecutiveInsightImportance;
  readonly confidence?: number;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly scope?: RuntimeExecutiveInsightScope;
  readonly source: RuntimeExecutiveInsightSource;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveInsightRelationship>;
  readonly attentionState?: RuntimeExecutiveInsightAttentionState;
  readonly lifecycleStatus?: RuntimeExecutiveInsightLifecycleStatus;
  readonly presentationCompatibility?: RuntimeExecutiveInsightPresentationState;
  readonly summary?: string;
  readonly observedAtIso?: string;
}): RuntimeExecutiveInsight {
  return normalizeRuntimeExecutiveInsight({
    insightId: input.insightId,
    category: input.category,
    primarySubject: input.primarySubject,
    ...(input.relatedSubjects !== undefined
      ? { relatedSubjects: input.relatedSubjects }
      : {}),
    evidence: input.evidence ?? Object.freeze([]),
    signals: input.signals ?? Object.freeze([]),
    direction: input.direction ?? "unknown",
    severity: input.severity ?? "none",
    importance: input.importance ?? "minimal",
    confidence: asConfidence(input.confidence ?? 0),
    freshness: input.freshness ?? "unknown",
    scope: input.scope ?? "subject",
    source: input.source,
    ...(input.relationships !== undefined
      ? { relationships: input.relationships }
      : {}),
    attentionState: input.attentionState ?? "none",
    ...(input.lifecycleStatus !== undefined
      ? { lifecycleStatus: input.lifecycleStatus }
      : {}),
    ...(input.presentationCompatibility !== undefined
      ? { presentationCompatibility: input.presentationCompatibility }
      : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
  });
}

// ─── Lightweight structural checks ──────────────────────────────────────────

export function validateRuntimeExecutiveInsightConfidence(
  value: unknown,
): RuntimeExecutiveInsightFoundationValidationResult {
  if (isRuntimeExecutiveInsightConfidence(value)) {
    return Object.freeze({ ok: true, issues: Object.freeze([]) });
  }
  return Object.freeze({
    ok: false,
    issues: Object.freeze([
      issue(
        "invalid-confidence",
        "confidence must be a finite number in [0, 1]",
        "confidence",
      ),
    ]),
  });
}

export function getRuntimeExecutiveInsightExperienceFoundationIdentity():
  typeof runtimeExecutiveInsightExperienceFoundationCanonicalIdentity {
  return runtimeExecutiveInsightExperienceFoundationCanonicalIdentity;
}

export function getRuntimeExecutiveInsightExperienceFoundationRegistry():
  typeof runtimeExecutiveInsightExperienceFoundationRegistry {
  return runtimeExecutiveInsightExperienceFoundationRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceFoundationApiNames =
  Object.freeze([
    "getRuntimeExecutiveInsightExperienceFoundationIdentity",
    "getRuntimeExecutiveInsightExperienceFoundationRegistry",
    "isRuntimeExecutiveInsightCategory",
    "isRuntimeExecutiveInsightSubjectKind",
    "isRuntimeExecutiveInsightEvidenceKind",
    "isRuntimeExecutiveInsightSignalKind",
    "isRuntimeExecutiveInsightDirection",
    "isRuntimeExecutiveInsightSeverity",
    "isRuntimeExecutiveInsightImportance",
    "isRuntimeExecutiveInsightConfidence",
    "isRuntimeExecutiveInsightFreshness",
    "isRuntimeExecutiveInsightScope",
    "isRuntimeExecutiveInsightSourceKind",
    "isRuntimeExecutiveInsightRelationshipKind",
    "isRuntimeExecutiveInsightRelationshipDirection",
    "isRuntimeExecutiveInsightAttentionState",
    "isRuntimeExecutiveInsightPresentationState",
    "isRuntimeExecutiveInsightLifecycleStatus",
    "isRuntimeExecutiveInsightFoundationCapability",
    "normalizeRuntimeExecutiveInsightConfidence",
    "validateRuntimeExecutiveInsightConfidence",
    "createRuntimeExecutiveInsightId",
    "createRuntimeExecutiveInsightSubjectRef",
    "createRuntimeExecutiveInsightEvidenceId",
    "createRuntimeExecutiveInsightSignalId",
    "createRuntimeExecutiveInsightRelationshipId",
    "createRuntimeExecutiveInsightSubject",
    "createRuntimeExecutiveInsightSource",
    "createRuntimeExecutiveInsightEvidence",
    "createRuntimeExecutiveInsightSignal",
    "createRuntimeExecutiveInsightRelationship",
    "createRuntimeExecutiveInsight",
    "normalizeRuntimeExecutiveInsightSubject",
    "normalizeRuntimeExecutiveInsightSource",
    "normalizeRuntimeExecutiveInsightEvidence",
    "normalizeRuntimeExecutiveInsightSignal",
    "normalizeRuntimeExecutiveInsightRelationship",
    "normalizeRuntimeExecutiveInsight",
    "verifyRuntimeExecutiveInsightExperienceFoundation",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightCategory",
    "RuntimeExecutiveInsightSubjectKind",
    "RuntimeExecutiveInsightEvidenceKind",
    "RuntimeExecutiveInsightSignalKind",
    "RuntimeExecutiveInsightDirection",
    "RuntimeExecutiveInsightSeverity",
    "RuntimeExecutiveInsightImportance",
    "RuntimeExecutiveInsightConfidence",
    "RuntimeExecutiveInsightFreshness",
    "RuntimeExecutiveInsightScope",
    "RuntimeExecutiveInsightSourceKind",
    "RuntimeExecutiveInsightRelationshipKind",
    "RuntimeExecutiveInsightRelationshipDirection",
    "RuntimeExecutiveInsightAttentionState",
    "RuntimeExecutiveInsightPresentationState",
    "RuntimeExecutiveInsightLifecycleStatus",
    "RuntimeExecutiveInsightFoundationCapability",
    "RuntimeExecutiveInsightSubject",
    "RuntimeExecutiveInsightSource",
    "RuntimeExecutiveInsightEvidence",
    "RuntimeExecutiveInsightSignal",
    "RuntimeExecutiveInsightRelationshipEndpoint",
    "RuntimeExecutiveInsightRelationship",
    "RuntimeExecutiveInsight",
    "RuntimeExecutiveInsightFoundationIssue",
    "RuntimeExecutiveInsightFoundationValidationResult",
    "RuntimeExecutiveInsightFoundationInvariant",
    "RuntimeExecutiveInsightFoundationRegistrySection",
    "RuntimeExecutiveInsightExperienceFoundationVerification",
  ] as const);

export const runtimeExecutiveInsightExperienceFoundationRegistry =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceFoundationIdentity,
    version: runtimeExecutiveInsightExperienceFoundationVersion,
    namespace: runtimeExecutiveInsightExperienceFoundationNamespace,
    layer: runtimeExecutiveInsightExperienceFoundationLayer,
    capability: runtimeExecutiveInsightExperienceFoundationCapability,
    phase: runtimeExecutiveInsightExperienceFoundationPhase,
    status: runtimeExecutiveInsightExperienceFoundationStatus,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS.length,
    categories: RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES,
    categoryCount: RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES.length,
    subjectKinds: RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.length,
    evidenceKinds: RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS,
    evidenceKindCount: RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS.length,
    signalKinds: RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS,
    signalKindCount: RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS.length,
    directions: RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS,
    directionCount: RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS.length,
    severities: RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES,
    severityCount: RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES.length,
    importanceValues: RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES,
    importanceCount: RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES.length,
    freshnessValues: RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES,
    freshnessCount: RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES.length,
    scopes: RUNTIME_EXECUTIVE_INSIGHT_SCOPES,
    scopeCount: RUNTIME_EXECUTIVE_INSIGHT_SCOPES.length,
    sourceKinds: RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS,
    sourceKindCount: RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS.length,
    relationshipKinds: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS,
    relationshipKindCount: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS.length,
    relationshipDirections: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS,
    relationshipDirectionCount:
      RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS.length,
    attentionStates: RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES,
    attentionStateCount: RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES.length,
    presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length,
    presentationStateSemantics:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS,
    lifecycleStatuses: RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES,
    lifecycleStatusCount: RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES.length,
    capabilities: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES.length,
    invariants: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveInsightExperienceFoundationApiNames,
    publicApiCount:
      runtimeExecutiveInsightExperienceFoundationApiNames.length,
    relationshipChain: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_RELATIONSHIP_CHAIN,
  });

export const runtimeExecutiveInsightExperienceFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "RuntimeExecutiveInsightExperienceFoundation" as const,
  identity: runtimeExecutiveInsightExperienceFoundationIdentity,
  version: runtimeExecutiveInsightExperienceFoundationVersion,
  namespace: runtimeExecutiveInsightExperienceFoundationNamespace,
  layer: runtimeExecutiveInsightExperienceFoundationLayer,
  capability: runtimeExecutiveInsightExperienceFoundationCapability,
  architecturalRole:
    runtimeExecutiveInsightExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeExecutiveInsightExperienceFoundationStatus,
  upstreamDependency:
    runtimeExecutiveInsightExperienceFoundationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveInsightExperienceFoundationDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
  deterministic: runtimeExecutiveInsightExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  presentationNeutral: true as const,
  domainNeutral: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_RESPONSIBILITY_SEPARATION,
  categories: RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES,
  subjectKinds: RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS,
  evidenceKinds: RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS,
  signalKinds: RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS,
  directions: RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS,
  severities: RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES,
  importanceValues: RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES,
  freshnessValues: RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES,
  scopes: RUNTIME_EXECUTIVE_INSIGHT_SCOPES,
  sourceKinds: RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS,
  relationshipKinds: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS,
  relationshipDirections: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS,
  attentionStates: RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
  presentationStateSemantics:
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS,
  lifecycleStatuses: RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES,
  capabilities: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_FORBIDDEN_RESPONSIBILITIES,
  relationshipChain: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_RELATIONSHIP_CHAIN,
  publicTypeNames: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightExperienceFoundationApiNames,
  registry: runtimeExecutiveInsightExperienceFoundationRegistry,
  publicIndexBoundary: "REX-3:9-public-index-only" as const,
  architecturalStatus:
    "REX-4:1 Runtime Executive Insight Experience Foundation — FoundationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightExperienceFoundationIdentity;
  readonly version: typeof runtimeExecutiveInsightExperienceFoundationVersion;
  readonly namespace: typeof runtimeExecutiveInsightExperienceFoundationNamespace;
  readonly layer: typeof runtimeExecutiveInsightExperienceFoundationLayer;
  readonly capability: typeof runtimeExecutiveInsightExperienceFoundationCapability;
  readonly phase: typeof runtimeExecutiveInsightExperienceFoundationPhase;
  readonly status: typeof runtimeExecutiveInsightExperienceFoundationStatus;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightExperienceFoundationDependencyIdentity;
  readonly categoryCount: number;
  readonly subjectKindCount: number;
  readonly evidenceKindCount: number;
  readonly signalKindCount: number;
  readonly directionCount: number;
  readonly severityCount: number;
  readonly importanceCount: number;
  readonly freshnessCount: number;
  readonly scopeCount: number;
  readonly sourceKindCount: number;
  readonly relationshipKindCount: number;
  readonly attentionStateCount: number;
  readonly presentationStateCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly publicIndexBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly aiProviderIndependent: boolean;
  readonly presentationCompatibilityPreserved: boolean;
  readonly upstreamConsumerEntryOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
}

export function verifyRuntimeExecutiveInsightExperienceFoundation():
  RuntimeExecutiveInsightExperienceFoundationVerification {
  const foundationModule = runtimeExecutiveInsightExperienceFoundation;
  const registry = runtimeExecutiveInsightExperienceFoundationRegistry;
  const upstream = verifyRuntimeExecutiveAdvisorExperienceConsumerEntry();

  const identityOk =
    foundationModule.identity ===
      "REX-4:1/RuntimeExecutiveInsightExperienceFoundation" &&
    foundationModule.version === "4.1.0" &&
    foundationModule.namespace === "nexora.rex.insight-experience.foundation" &&
    foundationModule.layer === "REX" &&
    foundationModule.capability === "RuntimeExecutiveInsightExperience" &&
    foundationModule.phase === "Foundation" &&
    foundationModule.status === "FoundationReady" &&
    foundationModule.upstreamDependency ===
      "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex" &&
    foundationModule.upstreamDependency ===
      runtimeExecutiveAdvisorExperiencePublicIndexIdentity &&
    foundationModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorExperiencePublicIndex" &&
    foundationModule.publicIndexBoundary === "REX-3:9-public-index-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES], [
      "change",
      "trend",
      "deviation",
      "risk",
      "opportunity",
      "anomaly",
      "dependency",
      "conflict",
      "progress",
      "threshold",
      "forecast",
      "attention",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS], [
      "nexora-object",
      "kpi",
      "koi",
      "goal",
      "problem",
      "scenario",
      "decision",
      "execution",
      "pack",
      "connection",
      "scene",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS], [
      "observation",
      "metric",
      "state",
      "transition",
      "comparison",
      "threshold",
      "relationship",
      "runtime-signal",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS], [
      "observation",
      "metric",
      "state",
      "transition",
      "threshold",
      "relationship",
      "attention",
      "freshness",
      "runtime",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS], [
      "increasing",
      "decreasing",
      "stable",
      "mixed",
      "emerging",
      "resolved",
      "unknown",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES], [
      "none",
      "low",
      "moderate",
      "high",
      "critical",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES], [
      "minimal",
      "low",
      "medium",
      "high",
      "essential",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES], [
      "current",
      "recent",
      "aging",
      "stale",
      "unknown",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SCOPES], [
      "subject",
      "object",
      "goal",
      "scene",
      "workspace",
      "model",
      "organization",
      "global",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS], [
      "runtime",
      "model",
      "object",
      "metric",
      "pack",
      "scenario",
      "decision",
      "execution",
      "director",
      "external-reference",
      "unknown",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS], [
      "supports",
      "contradicts",
      "depends-on",
      "caused-by",
      "contributes-to",
      "related-to",
      "supersedes",
      "derived-from",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS], [
      "forward",
      "reverse",
      "bidirectional",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES], [
      "none",
      "background",
      "notice",
      "focus",
      "urgent",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "Categories",
        "SubjectKinds",
        "EvidenceKinds",
        "SignalKinds",
        "Directions",
        "Severities",
        "ImportanceValues",
        "FreshnessValues",
        "Scopes",
        "SourceKinds",
        "RelationshipKinds",
        "RelationshipDirections",
        "AttentionStates",
        "PresentationStates",
        "LifecycleStatuses",
        "Capabilities",
        "PublicApis",
      ],
    );

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.includes("kpi") &&
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS.calculatesKpi === false;
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.includes("koi") &&
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS.calculatesKoi === false;
  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.includes(forbiddenIndexTerm) &&
    RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS.introducesKor === false &&
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_BOUNDARY.introducesKor === false;

  const presentationCompatibilityPreserved =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS.minimum ===
      "awareness" &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS.report ===
      "understanding" &&
    RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS.operation ===
      "executive-interaction-action-context";

  const registryCountsOk =
    registry.categoryCount === RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES.length &&
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.length &&
    registry.evidenceKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS.length &&
    registry.signalKindCount === RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS.length &&
    registry.directionCount === RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS.length &&
    registry.severityCount === RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES.length &&
    registry.importanceCount ===
      RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES.length &&
    registry.freshnessCount ===
      RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES.length &&
    registry.scopeCount === RUNTIME_EXECUTIVE_INSIGHT_SCOPES.length &&
    registry.sourceKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS.length &&
    registry.relationshipKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS.length &&
    registry.attentionStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length &&
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightExperienceFoundationApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES.length;

  const invariantsOk =
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS.length === 15 &&
    RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(foundationModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeExecutiveInsightExperienceFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_SCOPES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_BOUNDARY);

  const publicIndexBoundaryIntact =
    foundationModule.boundary.soleImmediateDependency ===
      "REX-3:9/RuntimeExecutiveAdvisorExperiencePublicIndex" &&
    foundationModule.boundary.consumesPublicIndexOnly === true &&
    foundationModule.boundary.importsRex3InternalDirectly === false &&
    foundationModule.boundary.importsRex2Directly === false &&
    foundationModule.boundary.importsRex1Directly === false &&
    foundationModule.boundary.importsExDriDirectly === false &&
    foundationModule.boundary.importsDriDirectly === false &&
    foundationModule.boundary.importsNolDirectly === false &&
    foundationModule.boundary.introducesInference === false &&
    foundationModule.boundary.introducesScoring === false &&
    foundationModule.boundary.introducesRanking === false &&
    foundationModule.boundary.introducesLlmGeneration === false &&
    foundationModule.boundary.introducesRendering === false &&
    foundationModule.boundary.introducesKor === false;

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    presentationCompatibilityPreserved &&
    registryCountsOk &&
    invariantsOk &&
    frozen &&
    publicIndexBoundaryIntact &&
    foundationModule.frameworkIndependent === true &&
    foundationModule.rendererIndependent === true &&
    foundationModule.aiProviderIndependent === true &&
    upstream.valid === true &&
    foundationModule.principle === RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightExperienceFoundationIdentity,
    version: runtimeExecutiveInsightExperienceFoundationVersion,
    namespace: runtimeExecutiveInsightExperienceFoundationNamespace,
    layer: runtimeExecutiveInsightExperienceFoundationLayer,
    capability: runtimeExecutiveInsightExperienceFoundationCapability,
    phase: runtimeExecutiveInsightExperienceFoundationPhase,
    status: runtimeExecutiveInsightExperienceFoundationStatus,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceFoundationDependencyIdentity,
    categoryCount: RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES.length,
    subjectKindCount: RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS.length,
    evidenceKindCount: RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS.length,
    signalKindCount: RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS.length,
    directionCount: RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS.length,
    severityCount: RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES.length,
    importanceCount: RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES.length,
    freshnessCount: RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES.length,
    scopeCount: RUNTIME_EXECUTIVE_INSIGHT_SCOPES.length,
    sourceKindCount: RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS.length,
    relationshipKindCount: RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS.length,
    attentionStateCount: RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES.length,
    presentationStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES.length,
    capabilityCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_CAPABILITIES.length,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveInsightExperienceFoundationApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_INSIGHT_FOUNDATION_INVARIANTS.length,
    frozen,
    publicIndexBoundaryIntact,
    rendererIndependent: foundationModule.rendererIndependent === true,
    aiProviderIndependent: foundationModule.aiProviderIndependent === true,
    presentationCompatibilityPreserved,
    upstreamConsumerEntryOk: upstream.valid === true,
    noKor,
    kpiSupported,
    koiSupported,
  });
}
