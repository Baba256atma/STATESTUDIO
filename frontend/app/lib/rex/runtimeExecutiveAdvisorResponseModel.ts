/**
 * REX-3:3 — Runtime Executive Advisor Response Model.
 *
 * Transforms a grounded REX-3:2 binding result into a structured, deterministic
 * Executive Advisor Response Model: observations, signals, relationships,
 * implications, and response state — without generating prose or advice.
 *
 * Canonical flow:
 *   REX-3:2 Binding Result
 *     → Response Resolution
 *     → Observations / Signals / Relationships
 *     → Implications / Response State
 *     → Structured Advisor Response
 *
 *   REX-3:2 Context & Subject Binding → REX-3:3 Response Model
 *
 * Response modeling only. No LLM, conversational prose, action execution,
 * Stage mutation, UI, or Director coordination.
 *
 * REX-3:2 answers: What is the Advisor currently grounded on?
 * REX-3:3 answers: What structured executive response should be formed?
 * REX-3:4 will turn that into guidance and executive actions.
 */

import {
  bindRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorBindingEvidence,
  createRuntimeExecutiveAdvisorSubject,
  isRuntimeExecutiveAdvisorBindingMarker,
  isRuntimeExecutiveAdvisorConfidence,
  isRuntimeExecutiveAdvisorSubjectKind,
  isRuntimeExecutiveAdvisorUrgency,
  runtimeExecutiveAdvisorContextSubjectBindingIdentity,
  runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
  runtimeExecutiveAdvisorContextSubjectBindingVersion,
  validateRuntimeExecutiveAdvisorBindingResult,
  verifyRuntimeExecutiveAdvisorContextSubjectBinding,
  type RuntimeExecutiveAdvisorAttentionLevel,
  type RuntimeExecutiveAdvisorBindingEvidence,
  type RuntimeExecutiveAdvisorBindingMarker,
  type RuntimeExecutiveAdvisorBindingResult,
  type RuntimeExecutiveAdvisorConfidence,
  type RuntimeExecutiveAdvisorGuidanceIntent,
  type RuntimeExecutiveAdvisorProvenance,
  type RuntimeExecutiveAdvisorSubject,
  type RuntimeExecutiveAdvisorSubjectKind,
  type RuntimeExecutiveAdvisorUrgency,
} from "@/app/lib/rex/runtimeExecutiveAdvisorContextSubjectBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorResponseModelIdentity =
  "REX-3:3/RuntimeExecutiveAdvisorResponseModel" as const;

export const runtimeExecutiveAdvisorResponseModelVersion = "3.3.0" as const;

export const runtimeExecutiveAdvisorResponseModelNamespace =
  "nexora.rex.advisor-experience.response-model" as const;

export const runtimeExecutiveAdvisorResponseModelLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorResponseModelDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorResponseModelPhase =
  "ResponseModel" as const;

export const runtimeExecutiveAdvisorResponseModelArchitecturalRole =
  "RuntimeExecutiveAdvisorResponseModelBoundary" as const;

export const runtimeExecutiveAdvisorResponseModelDependencyIdentity =
  runtimeExecutiveAdvisorContextSubjectBindingIdentity;

export const runtimeExecutiveAdvisorResponseModelDependencyPath =
  runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath;

/** Sole supported import path for REX-3 consumers of this response model. */
export const runtimeExecutiveAdvisorResponseModelSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorResponseModel" as const;

export const runtimeExecutiveAdvisorResponseModelStability =
  "ResponseModelReady" as const;

export const runtimeExecutiveAdvisorResponseModelDeterministic = true as const;

export const runtimeExecutiveAdvisorResponseModelSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorResponseModelMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorResponseModelCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorResponseModelIdentity,
    version: runtimeExecutiveAdvisorResponseModelVersion,
    namespace: runtimeExecutiveAdvisorResponseModelNamespace,
    layer: runtimeExecutiveAdvisorResponseModelLayer,
    domain: runtimeExecutiveAdvisorResponseModelDomain,
    phase: runtimeExecutiveAdvisorResponseModelPhase,
    architecturalRole:
      runtimeExecutiveAdvisorResponseModelArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorResponseModelDependencyIdentity,
    dependencyPath: runtimeExecutiveAdvisorResponseModelDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorResponseModelSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    stabilityStatus: runtimeExecutiveAdvisorResponseModelStability,
    deterministicStatus: runtimeExecutiveAdvisorResponseModelDeterministic,
    sideEffectPolicy: runtimeExecutiveAdvisorResponseModelSideEffectPolicy,
    mutationPolicy: runtimeExecutiveAdvisorResponseModelMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PRINCIPLE =
  "REX-3:2 grounds; REX-3:3 forms structured executive meaning. Conservative, traceable, and non-generative — not advice, not prose, not action." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  responseAuthority: "REX-3:3" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorResponseModelBoundary" as const,
  soleImmediateDependency:
    "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding" as const,
  consumesBindingOnly: true as const,
  importsRex31Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  generatesProse: false as const,
  generatesAdvice: false as const,
  executesActions: false as const,
  mutatesStageState: false as const,
  strengthensCausality: false as const,
  fabricatesRisk: false as const,
});

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex31Owns: "Defines the Advisor foundation." as const,
    rex32Owns: "Grounds the Advisor on the current runtime subject/context." as const,
    rex33Owns: "Forms the structured executive response." as const,
    rex34Owns:
      "Turns the structured response into guidance and executive actions." as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES = Object.freeze([
  "empty",
  "contextual",
  "interpreted",
  "actionable",
] as const);

export type RuntimeExecutiveAdvisorResponseState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS = Object.freeze([
  "status",
  "explanation",
  "inspection",
  "comparison",
  "risk",
  "opportunity",
  "relationship",
  "decision-support",
  "execution-support",
] as const);

export type RuntimeExecutiveAdvisorResponseKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS = Object.freeze([
  "inform",
  "clarify",
  "highlight",
  "compare",
  "warn",
  "prepare-decision",
  "prepare-action",
] as const);

export type RuntimeExecutiveAdvisorHeadlineIntent =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES = Object.freeze([
  "state",
  "attention",
  "performance",
  "relationship",
  "change",
  "constraint",
  "execution",
] as const);

export type RuntimeExecutiveAdvisorObservationCategory =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE = Object.freeze([
  "background",
  "relevant",
  "important",
  "critical",
] as const);

export type RuntimeExecutiveAdvisorObservationImportance =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS = Object.freeze([
  "attention",
  "risk",
  "opportunity",
  "deviation",
  "dependency",
  "conflict",
  "progress",
  "blocker",
] as const);

export type RuntimeExecutiveAdvisorSignalKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES = Object.freeze([
  "info",
  "low",
  "medium",
  "high",
  "critical",
] as const);

export type RuntimeExecutiveAdvisorSignalSeverity =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS =
  Object.freeze([
    "related",
    "depends-on",
    "influences",
    "affected-by",
    "part-of",
    "connected-to",
  ] as const);

export type RuntimeExecutiveAdvisorResponseRelationshipKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS = Object.freeze([
  "monitor",
  "investigate",
  "compare",
  "review-decision",
  "prepare-scenario",
  "consider-action",
] as const);

export type RuntimeExecutiveAdvisorImplicationKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS = Object.freeze([
  "signal",
  "summary",
  "analysis",
] as const);

export type RuntimeExecutiveAdvisorResponseDepth =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES = Object.freeze([
  "neutral",
  "attention",
  "risk",
  "opportunity",
  "decision",
  "execution",
] as const);

export type RuntimeExecutiveAdvisorResponseEmphasis =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS = Object.freeze([
  "none",
  "inspect",
  "explain",
  "compare",
  "trace",
  "open-scenario",
  "review-decision",
  "review-execution",
] as const);

export type RuntimeExecutiveAdvisorNextStepKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES = Object.freeze([
  "response-modeling",
  "response-state-resolution",
  "response-kind-resolution",
  "headline-intent-resolution",
  "observation-derivation",
  "signal-derivation",
  "relationship-derivation",
  "implication-resolution",
  "confidence-resolution",
  "urgency-resolution",
  "response-depth-resolution",
  "response-emphasis-resolution",
  "next-step-resolution",
  "response-actionability",
  "response-provenance",
  "response-validation",
  "semantic-deduplication",
  "stable-response-ordering",
  "causal-guarding",
] as const);

export type RuntimeExecutiveAdvisorResponseCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ResponseStates",
    "ResponseKinds",
    "HeadlineIntents",
    "ObservationCategories",
    "ObservationImportance",
    "SignalKinds",
    "SignalSeverities",
    "RelationshipKinds",
    "ImplicationKinds",
    "ResponseDepths",
    "ResponseEmphases",
    "NextStepKinds",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorResponseRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS)[number];

/**
 * Response-kind resolution precedence (highest first):
 * 1. compare intent
 * 2. explicit risk marker
 * 3. explicit opportunity marker
 * 4. decision subject / decision intents
 * 5. execution subject / act intent
 * 6. inspect / investigate intents
 * 7. explain intent
 * 8. relationship structure
 * 9. observe / default → status
 */
export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KIND_PRECEDENCE = Object.freeze([
  "compare-intent",
  "risk-marker",
  "opportunity-marker",
  "decision-support",
  "execution-support",
  "inspection-intent",
  "explanation-intent",
  "relationship-structure",
  "status-default",
] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export type RuntimeExecutiveAdvisorResponseSubject =
  RuntimeExecutiveAdvisorSubject;

export interface RuntimeExecutiveAdvisorObservation {
  readonly id: string;
  readonly subjectId: string;
  readonly category: RuntimeExecutiveAdvisorObservationCategory;
  readonly importance: RuntimeExecutiveAdvisorObservationImportance;
  readonly sourceIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorSignal {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorSignalKind;
  readonly subjectId: string;
  readonly severity: RuntimeExecutiveAdvisorSignalSeverity;
  readonly sourceIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorResponseRelationship {
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: RuntimeExecutiveAdvisorResponseRelationshipKind;
  readonly sourceIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorImplication {
  readonly id: string;
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveAdvisorImplicationKind;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly sourceIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorResponse {
  readonly state: RuntimeExecutiveAdvisorResponseState;
  readonly kind: RuntimeExecutiveAdvisorResponseKind;
  readonly subject: RuntimeExecutiveAdvisorResponseSubject | null;
  readonly headlineIntent: RuntimeExecutiveAdvisorHeadlineIntent;
  readonly observations: ReadonlyArray<RuntimeExecutiveAdvisorObservation>;
  readonly signals: ReadonlyArray<RuntimeExecutiveAdvisorSignal>;
  readonly relationships: ReadonlyArray<RuntimeExecutiveAdvisorResponseRelationship>;
  readonly implications: ReadonlyArray<RuntimeExecutiveAdvisorImplication>;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly urgency: RuntimeExecutiveAdvisorUrgency;
  readonly depth: RuntimeExecutiveAdvisorResponseDepth;
  readonly emphasis: RuntimeExecutiveAdvisorResponseEmphasis;
  readonly nextSteps: ReadonlyArray<RuntimeExecutiveAdvisorNextStepKind>;
  readonly provenance: ReadonlyArray<RuntimeExecutiveAdvisorProvenance>;
  readonly isActionable: boolean;
  readonly responseIdentity: typeof runtimeExecutiveAdvisorResponseModelIdentity;
  readonly responseVersion: typeof runtimeExecutiveAdvisorResponseModelVersion;
  readonly bindingIdentity: typeof runtimeExecutiveAdvisorContextSubjectBindingIdentity;
  readonly bindingVersion: typeof runtimeExecutiveAdvisorContextSubjectBindingVersion;
}

export interface RuntimeExecutiveAdvisorResponseIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorResponseValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorResponseIssue>;
}

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "no-response-without-grounding",
    order: 1,
    statement:
      "No non-empty response without grounded REX-3:2 context.",
  }),
  Object.freeze({
    id: "provenance-preserved",
    order: 2,
    statement: "Every derived claim preserves provenance.",
  }),
  Object.freeze({
    id: "no-fabricated-facts",
    order: 3,
    statement: "No fabricated executive fact.",
  }),
  Object.freeze({
    id: "no-causal-strengthening",
    order: 4,
    statement: "No causal strengthening.",
  }),
  Object.freeze({
    id: "implications-non-executing",
    order: 5,
    statement: "No implication executes an action.",
  }),
  Object.freeze({
    id: "no-risk-without-evidence",
    order: 6,
    statement: "No risk/opportunity without supporting evidence.",
  }),
  Object.freeze({
    id: "deterministic-response",
    order: 7,
    statement: "Same semantic input → same response.",
  }),
  Object.freeze({
    id: "input-immutability",
    order: 8,
    statement: "Input data remains immutable.",
  }),
  Object.freeze({
    id: "deterministic-ordering",
    order: 9,
    statement: "Response ordering remains deterministic.",
  }),
  Object.freeze({
    id: "ai-ui-neutral",
    order: 10,
    statement: "REX-3:3 remains AI-neutral and UI-neutral.",
  }),
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_FORBIDDEN = Object.freeze([
  "LLM calls",
  "prompt templates",
  "embeddings",
  "AI SDK dependencies",
  "generated Advisor messages",
  "conversational prose",
  "action execution",
  "Stage mutation",
  "React components",
  "Advisor Panel",
  "causal inference beyond evidence",
  "risk fabrication from attention alone",
] as const);

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

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveAdvisorResponseIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function sourceIdOf(evidence: RuntimeExecutiveAdvisorBindingEvidence): string {
  return evidence.sourceId ?? `${evidence.sourceKind}:${evidence.subject.id}`;
}

function mergeSourceIds(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const id of [...left, ...right]) {
    if (seen.has(id)) continue;
    seen.add(id);
    merged.push(id);
  }
  return Object.freeze(merged);
}

function attentionSeverity(
  attention: RuntimeExecutiveAdvisorAttentionLevel,
): RuntimeExecutiveAdvisorSignalSeverity {
  switch (attention) {
    case "critical":
      return "critical";
    case "elevated":
      return "high";
    case "normal":
      return "low";
    case "ambient":
    default:
      return "info";
  }
}

function attentionImportance(
  attention: RuntimeExecutiveAdvisorAttentionLevel,
): RuntimeExecutiveAdvisorObservationImportance {
  switch (attention) {
    case "critical":
      return "critical";
    case "elevated":
      return "important";
    case "normal":
      return "relevant";
    case "ambient":
    default:
      return "background";
  }
}

function hasMarker(
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
  marker: RuntimeExecutiveAdvisorBindingMarker,
): boolean {
  return evidence.some((entry) => entry.markers?.includes(marker) === true);
}

function collectMarkers(
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
): ReadonlyArray<RuntimeExecutiveAdvisorBindingMarker> {
  const seen = new Set<RuntimeExecutiveAdvisorBindingMarker>();
  const markers: RuntimeExecutiveAdvisorBindingMarker[] = [];
  for (const entry of evidence) {
    for (const marker of entry.markers ?? []) {
      if (seen.has(marker)) continue;
      seen.add(marker);
      markers.push(marker);
    }
  }
  return Object.freeze(markers);
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorResponseState(
  value: unknown,
): value is RuntimeExecutiveAdvisorResponseState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorResponseKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorResponseKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorHeadlineIntent(
  value: unknown,
): value is RuntimeExecutiveAdvisorHeadlineIntent {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorObservationCategory(
  value: unknown,
): value is RuntimeExecutiveAdvisorObservationCategory {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorObservationImportance(
  value: unknown,
): value is RuntimeExecutiveAdvisorObservationImportance {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorSignalKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorSignalKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorSignalSeverity(
  value: unknown,
): value is RuntimeExecutiveAdvisorSignalSeverity {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorResponseRelationshipKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorResponseRelationshipKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorImplicationKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorImplicationKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorResponseDepth(
  value: unknown,
): value is RuntimeExecutiveAdvisorResponseDepth {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorResponseEmphasis(
  value: unknown,
): value is RuntimeExecutiveAdvisorResponseEmphasis {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorNextStepKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorNextStepKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Empty response ─────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE: RuntimeExecutiveAdvisorResponse =
  Object.freeze({
    state: "empty",
    kind: "status",
    subject: null,
    headlineIntent: "inform",
    observations: Object.freeze([] as RuntimeExecutiveAdvisorObservation[]),
    signals: Object.freeze([] as RuntimeExecutiveAdvisorSignal[]),
    relationships: Object.freeze(
      [] as RuntimeExecutiveAdvisorResponseRelationship[],
    ),
    implications: Object.freeze([] as RuntimeExecutiveAdvisorImplication[]),
    confidence: "unknown",
    urgency: "none",
    depth: "signal",
    emphasis: "neutral",
    nextSteps: Object.freeze([] as RuntimeExecutiveAdvisorNextStepKind[]),
    provenance: Object.freeze([] as RuntimeExecutiveAdvisorProvenance[]),
    isActionable: false,
    responseIdentity: runtimeExecutiveAdvisorResponseModelIdentity,
    responseVersion: runtimeExecutiveAdvisorResponseModelVersion,
    bindingIdentity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    bindingVersion: runtimeExecutiveAdvisorContextSubjectBindingVersion,
  });

// ─── Resolvers ──────────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveAdvisorResponseKind(
  binding: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorResponseKind {
  const intent = binding.context.intent;
  const subjectKind = binding.activeSubject?.kind;
  const markers = collectMarkers(binding.evidence);

  if (intent === "compare") return "comparison";
  if (markers.includes("risk")) return "risk";
  if (markers.includes("opportunity")) return "opportunity";
  if (
    subjectKind === "decision" ||
    intent === "decide" ||
    intent === "recommend" ||
    intent === "evaluate"
  ) {
    return "decision-support";
  }
  if (subjectKind === "execution" || intent === "act") {
    return "execution-support";
  }
  if (intent === "inspect" || intent === "investigate") return "inspection";
  if (intent === "explain") return "explanation";
  if (binding.contextualSubjects.length > 0) return "relationship";
  if (intent === "observe") return "status";
  return "status";
}

export function resolveRuntimeExecutiveAdvisorHeadlineIntent(
  kind: RuntimeExecutiveAdvisorResponseKind,
): RuntimeExecutiveAdvisorHeadlineIntent {
  switch (kind) {
    case "status":
      return "inform";
    case "explanation":
    case "inspection":
    case "relationship":
      return "clarify";
    case "comparison":
      return "compare";
    case "risk":
      return "warn";
    case "opportunity":
      return "highlight";
    case "decision-support":
      return "prepare-decision";
    case "execution-support":
      return "prepare-action";
    default:
      return "inform";
  }
}

export function resolveRuntimeExecutiveAdvisorResponseDepth(
  binding: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorResponseDepth {
  switch (binding.context.presentationState) {
    case "operation":
      return "analysis";
    case "report":
      return "summary";
    case "minimum":
    default:
      return "signal";
  }
}

export function resolveRuntimeExecutiveAdvisorResponseEmphasis(input: {
  readonly kind: RuntimeExecutiveAdvisorResponseKind;
  readonly signals: ReadonlyArray<RuntimeExecutiveAdvisorSignal>;
}): RuntimeExecutiveAdvisorResponseEmphasis {
  if (input.signals.some((signal) => signal.kind === "risk")) return "risk";
  if (input.signals.some((signal) => signal.kind === "opportunity")) {
    return "opportunity";
  }
  if (input.kind === "decision-support") return "decision";
  if (input.kind === "execution-support") return "execution";
  if (input.signals.some((signal) => signal.kind === "attention")) {
    return "attention";
  }
  return "neutral";
}

export function deriveRuntimeExecutiveAdvisorObservations(
  binding: RuntimeExecutiveAdvisorBindingResult,
): ReadonlyArray<RuntimeExecutiveAdvisorObservation> {
  if (binding.activeSubject === null && binding.state === "unbound") {
    return Object.freeze([]);
  }

  const byKey = new Map<string, RuntimeExecutiveAdvisorObservation>();

  const upsert = (
    category: RuntimeExecutiveAdvisorObservationCategory,
    subjectId: string,
    importance: RuntimeExecutiveAdvisorObservationImportance,
    sourceIds: ReadonlyArray<string>,
  ) => {
    const id = `obs.${category}.${subjectId}`;
    const existing = byKey.get(id);
    if (existing) {
      byKey.set(
        id,
        Object.freeze({
          ...existing,
          importance:
            RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.indexOf(importance) >
            RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.indexOf(
              existing.importance,
            )
              ? importance
              : existing.importance,
          sourceIds: mergeSourceIds(existing.sourceIds, sourceIds),
        }),
      );
      return;
    }
    byKey.set(
      id,
      Object.freeze({
        id,
        subjectId,
        category,
        importance,
        sourceIds: Object.freeze([...sourceIds]),
      }),
    );
  };

  if (binding.activeSubject !== null) {
    const activeEvidence = binding.evidence.filter(
      (entry) => entry.subject.id === binding.activeSubject!.id,
    );
    const sourceIds = activeEvidence.map(sourceIdOf);
    upsert(
      "state",
      binding.activeSubject.id,
      binding.state === "fully-bound" || binding.state === "subject-bound"
        ? "relevant"
        : "background",
      sourceIds.length > 0 ? sourceIds : [`binding:${binding.activeSubject.id}`],
    );

    if (binding.activeSubject.kind === "kpi") {
      upsert("performance", binding.activeSubject.id, "relevant", sourceIds);
    }
    if (binding.activeSubject.kind === "execution") {
      upsert("execution", binding.activeSubject.id, "relevant", sourceIds);
    }
  }

  for (const entry of binding.evidence) {
    // Ambient/normal attention is grounding context, not a distinct observation.
    if (
      entry.attention === "elevated" ||
      entry.attention === "critical"
    ) {
      upsert(
        "attention",
        entry.subject.id,
        attentionImportance(entry.attention),
        [sourceIdOf(entry)],
      );
    }
    if (
      entry.sourceKind === "related-subject" ||
      entry.linkageKind !== undefined
    ) {
      upsert("relationship", entry.subject.id, "relevant", [sourceIdOf(entry)]);
    }
  }

  const observations = [...byKey.values()];
  observations.sort((left, right) => {
    const importanceDelta =
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.indexOf(right.importance) -
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.indexOf(left.importance);
    if (importanceDelta !== 0) return importanceDelta;
    const categoryDelta =
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES.indexOf(left.category) -
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES.indexOf(right.category);
    if (categoryDelta !== 0) return categoryDelta;
    return left.subjectId < right.subjectId
      ? -1
      : left.subjectId > right.subjectId
        ? 1
        : 0;
  });

  return Object.freeze(observations);
}

export function deriveRuntimeExecutiveAdvisorSignals(
  binding: RuntimeExecutiveAdvisorBindingResult,
): ReadonlyArray<RuntimeExecutiveAdvisorSignal> {
  const byKey = new Map<string, RuntimeExecutiveAdvisorSignal>();

  const upsert = (
    kind: RuntimeExecutiveAdvisorSignalKind,
    subjectId: string,
    severity: RuntimeExecutiveAdvisorSignalSeverity,
    sourceIds: ReadonlyArray<string>,
  ) => {
    const id = `sig.${kind}.${subjectId}`;
    const existing = byKey.get(id);
    if (existing) {
      byKey.set(
        id,
        Object.freeze({
          ...existing,
          severity:
            RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.indexOf(severity) >
            RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.indexOf(existing.severity)
              ? severity
              : existing.severity,
          sourceIds: mergeSourceIds(existing.sourceIds, sourceIds),
        }),
      );
      return;
    }
    byKey.set(
      id,
      Object.freeze({
        id,
        kind,
        subjectId,
        severity,
        sourceIds: Object.freeze([...sourceIds]),
      }),
    );
  };

  for (const entry of binding.evidence) {
    // Attention signals require elevated/critical evidence. Normal/ambient must
    // not fabricate executive concern or force interpreted/actionable states.
    if (
      entry.attention === "elevated" ||
      entry.attention === "critical"
    ) {
      upsert(
        "attention",
        entry.subject.id,
        attentionSeverity(entry.attention),
        [sourceIdOf(entry)],
      );
    }
    for (const marker of entry.markers ?? []) {
      if (!isRuntimeExecutiveAdvisorBindingMarker(marker)) continue;
      // Markers map 1:1 onto non-attention signal kinds. Risk/opportunity
      // require explicit markers — never inferred from attention alone.
      const severity: RuntimeExecutiveAdvisorSignalSeverity =
        marker === "risk" || marker === "blocker"
          ? "high"
          : marker === "opportunity"
            ? "medium"
            : "medium";
      upsert(marker, entry.subject.id, severity, [sourceIdOf(entry)]);
    }
  }

  const signals = [...byKey.values()];
  signals.sort((left, right) => {
    const severityDelta =
      RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.indexOf(right.severity) -
      RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.indexOf(left.severity);
    if (severityDelta !== 0) return severityDelta;
    const kindDelta =
      RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS.indexOf(left.kind) -
      RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS.indexOf(right.kind);
    if (kindDelta !== 0) return kindDelta;
    return left.subjectId < right.subjectId
      ? -1
      : left.subjectId > right.subjectId
        ? 1
        : 0;
  });

  return Object.freeze(signals);
}

export function deriveRuntimeExecutiveAdvisorRelationships(
  binding: RuntimeExecutiveAdvisorBindingResult,
): ReadonlyArray<RuntimeExecutiveAdvisorResponseRelationship> {
  if (binding.activeSubject === null) {
    return Object.freeze([]);
  }

  const activeId = binding.activeSubject.id;
  const byKey = new Map<string, RuntimeExecutiveAdvisorResponseRelationship>();

  const upsert = (
    sourceSubjectId: string,
    targetSubjectId: string,
    kind: RuntimeExecutiveAdvisorResponseRelationshipKind,
    sourceIds: ReadonlyArray<string>,
  ) => {
    if (sourceSubjectId === targetSubjectId) return;
    const id = `${sourceSubjectId}->${targetSubjectId}:${kind}`;
    const existing = byKey.get(id);
    if (existing) {
      byKey.set(
        id,
        Object.freeze({
          ...existing,
          sourceIds: mergeSourceIds(existing.sourceIds, sourceIds),
        }),
      );
      return;
    }
    byKey.set(
      id,
      Object.freeze({
        sourceSubjectId,
        targetSubjectId,
        kind,
        sourceIds: Object.freeze([...sourceIds]),
      }),
    );
  };

  for (const entry of binding.evidence) {
    if (entry.linkageKind !== undefined) {
      const target =
        entry.linkageTargetSubjectId ??
        (entry.subject.id === activeId
          ? binding.contextualSubjects[0]?.id
          : activeId);
      if (target !== undefined) {
        const source =
          entry.subject.id === activeId ? activeId : entry.subject.id;
        const resolvedTarget =
          entry.subject.id === activeId ? target : activeId;
        upsert(source, resolvedTarget, entry.linkageKind, [sourceIdOf(entry)]);
      }
      continue;
    }

    if (
      entry.sourceKind === "related-subject" &&
      entry.subject.id !== activeId
    ) {
      upsert(activeId, entry.subject.id, "related", [sourceIdOf(entry)]);
    }

    if (
      entry.sourceKind === "scene" &&
      entry.subject.id !== activeId
    ) {
      // Scene co-membership is connected-to, never influences/causes.
      upsert(activeId, entry.subject.id, "connected-to", [sourceIdOf(entry)]);
    }
  }

  // Contextual subjects without stronger linkage remain related.
  for (const contextual of binding.contextualSubjects) {
    const keyPrefix = `${activeId}->${contextual.id}:`;
    const alreadyLinked = [...byKey.keys()].some((key) =>
      key.startsWith(keyPrefix),
    );
    if (!alreadyLinked) {
      upsert(activeId, contextual.id, "related", [
        `contextual:${contextual.id}`,
      ]);
    }
  }

  const relationships = [...byKey.values()];
  relationships.sort((left, right) => {
    const kindDelta =
      RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS.indexOf(left.kind) -
      RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS.indexOf(right.kind);
    if (kindDelta !== 0) return kindDelta;
    if (left.sourceSubjectId !== right.sourceSubjectId) {
      return left.sourceSubjectId < right.sourceSubjectId ? -1 : 1;
    }
    return left.targetSubjectId < right.targetSubjectId
      ? -1
      : left.targetSubjectId > right.targetSubjectId
        ? 1
        : 0;
  });

  return Object.freeze(relationships);
}

export function deriveRuntimeExecutiveAdvisorImplications(
  binding: RuntimeExecutiveAdvisorBindingResult,
  signals: ReadonlyArray<RuntimeExecutiveAdvisorSignal>,
): ReadonlyArray<RuntimeExecutiveAdvisorImplication> {
  if (binding.activeSubject === null) {
    return Object.freeze([]);
  }

  const byKey = new Map<string, RuntimeExecutiveAdvisorImplication>();
  const confidence: RuntimeExecutiveAdvisorConfidence =
    binding.context.confidence === "unknown"
      ? binding.state === "fully-bound" || binding.state === "subject-bound"
        ? "medium"
        : "low"
      : binding.context.confidence;

  const upsert = (
    kind: RuntimeExecutiveAdvisorImplicationKind,
    subjectId: string,
    sourceIds: ReadonlyArray<string>,
    implicationConfidence: RuntimeExecutiveAdvisorConfidence = confidence,
  ) => {
    const id = `impl.${kind}.${subjectId}`;
    const existing = byKey.get(id);
    if (existing) {
      byKey.set(
        id,
        Object.freeze({
          ...existing,
          sourceIds: mergeSourceIds(existing.sourceIds, sourceIds),
        }),
      );
      return;
    }
    byKey.set(
      id,
      Object.freeze({
        id,
        subjectId,
        kind,
        confidence: implicationConfidence,
        sourceIds: Object.freeze([...sourceIds]),
      }),
    );
  };

  const activeId = binding.activeSubject.id;

  for (const signal of signals) {
    if (
      signal.kind === "attention" &&
      (signal.severity === "critical" || signal.severity === "high")
    ) {
      upsert("investigate", signal.subjectId, signal.sourceIds);
    }
    if (signal.kind === "risk" || signal.kind === "blocker") {
      upsert("investigate", signal.subjectId, signal.sourceIds);
    }
    if (signal.kind === "opportunity") {
      upsert("consider-action", signal.subjectId, signal.sourceIds, "low");
    }
  }

  if (
    binding.context.intent === "compare" &&
    binding.contextualSubjects.length + (binding.activeSubject ? 1 : 0) >= 2
  ) {
    upsert(
      "compare",
      activeId,
      binding.evidence.map(sourceIdOf),
    );
  }

  if (binding.activeSubject.kind === "decision") {
    upsert("review-decision", activeId, [`subject:${activeId}`]);
  }
  if (binding.activeSubject.kind === "execution") {
    upsert("monitor", activeId, [`subject:${activeId}`]);
  }
  if (binding.activeSubject.kind === "scenario") {
    upsert("prepare-scenario", activeId, [`subject:${activeId}`]);
  }

  const implications = [...byKey.values()];
  implications.sort((left, right) => {
    const kindDelta =
      RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS.indexOf(left.kind) -
      RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS.indexOf(right.kind);
    if (kindDelta !== 0) return kindDelta;
    return left.subjectId < right.subjectId
      ? -1
      : left.subjectId > right.subjectId
        ? 1
        : 0;
  });

  return Object.freeze(implications);
}

function resolveNextSteps(input: {
  readonly kind: RuntimeExecutiveAdvisorResponseKind;
  readonly intent: RuntimeExecutiveAdvisorGuidanceIntent;
  readonly subjectKind: RuntimeExecutiveAdvisorSubjectKind | undefined;
  readonly implications: ReadonlyArray<RuntimeExecutiveAdvisorImplication>;
}): ReadonlyArray<RuntimeExecutiveAdvisorNextStepKind> {
  const steps = new Set<RuntimeExecutiveAdvisorNextStepKind>();

  if (input.kind === "comparison" || input.intent === "compare") {
    steps.add("compare");
  }
  if (input.kind === "inspection" || input.intent === "inspect") {
    steps.add("inspect");
  }
  if (input.intent === "explain" || input.kind === "explanation") {
    steps.add("explain");
  }
  if (input.implications.some((entry) => entry.kind === "investigate")) {
    steps.add("inspect");
    steps.add("trace");
  }
  if (
    input.subjectKind === "decision" ||
    input.implications.some((entry) => entry.kind === "review-decision")
  ) {
    steps.add("review-decision");
  }
  if (
    input.subjectKind === "execution" ||
    input.implications.some((entry) => entry.kind === "monitor")
  ) {
    steps.add("review-execution");
  }
  if (
    input.subjectKind === "scenario" ||
    input.implications.some((entry) => entry.kind === "prepare-scenario")
  ) {
    steps.add("open-scenario");
  }

  const ordered = RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS.filter(
    (step) => step !== "none" && steps.has(step),
  );
  return Object.freeze(ordered);
}

export function resolveRuntimeExecutiveAdvisorResponseState(input: {
  readonly binding: RuntimeExecutiveAdvisorBindingResult;
  readonly observations: ReadonlyArray<RuntimeExecutiveAdvisorObservation>;
  readonly signals: ReadonlyArray<RuntimeExecutiveAdvisorSignal>;
  readonly relationships: ReadonlyArray<RuntimeExecutiveAdvisorResponseRelationship>;
  readonly implications: ReadonlyArray<RuntimeExecutiveAdvisorImplication>;
  readonly nextSteps: ReadonlyArray<RuntimeExecutiveAdvisorNextStepKind>;
}): RuntimeExecutiveAdvisorResponseState {
  if (
    input.binding.state === "unbound" ||
    input.binding.activeSubject === null
  ) {
    return "empty";
  }

  if (input.nextSteps.length > 0 && input.implications.length > 0) {
    return "actionable";
  }

  const hasInterpretation =
    input.signals.length > 0 ||
    input.relationships.length > 0 ||
    input.implications.length > 0 ||
    input.observations.some(
      (observation) =>
        observation.category !== "state" ||
        observation.importance === "important" ||
        observation.importance === "critical",
    );

  if (hasInterpretation) {
    return "interpreted";
  }

  return "contextual";
}

export function isRuntimeExecutiveAdvisorResponseActionable(
  response: Pick<
    RuntimeExecutiveAdvisorResponse,
    "state" | "nextSteps" | "implications" | "subject"
  >,
): boolean {
  return (
    response.subject !== null &&
    response.state === "actionable" &&
    response.nextSteps.length > 0 &&
    response.implications.length > 0
  );
}

function resolveConfidence(
  binding: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorConfidence {
  if (isRuntimeExecutiveAdvisorConfidence(binding.context.confidence)) {
    if (binding.context.confidence !== "unknown") {
      return binding.context.confidence;
    }
  }
  if (binding.state === "fully-bound") return "high";
  if (binding.state === "subject-bound") return "medium";
  if (binding.state === "context-bound") return "low";
  return "unknown";
}

function resolveUrgency(
  binding: RuntimeExecutiveAdvisorBindingResult,
  signals: ReadonlyArray<RuntimeExecutiveAdvisorSignal>,
): RuntimeExecutiveAdvisorUrgency {
  if (
    isRuntimeExecutiveAdvisorUrgency(binding.context.urgency) &&
    binding.context.urgency !== "none"
  ) {
    return binding.context.urgency;
  }

  if (signals.some((signal) => signal.severity === "critical")) {
    return "high";
  }
  if (
    signals.some(
      (signal) =>
        signal.kind === "risk" ||
        signal.kind === "blocker" ||
        signal.severity === "high",
    )
  ) {
    return "medium";
  }
  return "none";
}

/**
 * Primary REX-3:3 operation: resolve structured Advisor response from binding.
 */
export function resolveRuntimeExecutiveAdvisorResponse(
  binding: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorResponse {
  const validation = validateRuntimeExecutiveAdvisorBindingResult(binding);
  if (!validation.ok && binding.state === "unbound") {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE;
  }

  if (binding.activeSubject === null || binding.state === "unbound") {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE;
  }

  const kind = resolveRuntimeExecutiveAdvisorResponseKind(binding);
  const headlineIntent = resolveRuntimeExecutiveAdvisorHeadlineIntent(kind);
  const observations = deriveRuntimeExecutiveAdvisorObservations(binding);
  const signals = deriveRuntimeExecutiveAdvisorSignals(binding);
  const relationships = deriveRuntimeExecutiveAdvisorRelationships(binding);
  const implications = deriveRuntimeExecutiveAdvisorImplications(
    binding,
    signals,
  );
  const depth = resolveRuntimeExecutiveAdvisorResponseDepth(binding);
  const emphasis = resolveRuntimeExecutiveAdvisorResponseEmphasis({
    kind,
    signals,
  });
  const nextSteps = resolveNextSteps({
    kind,
    intent: binding.context.intent,
    subjectKind: binding.activeSubject.kind,
    implications,
  });
  const state = resolveRuntimeExecutiveAdvisorResponseState({
    binding,
    observations,
    signals,
    relationships,
    implications,
    nextSteps,
  });
  const confidence = resolveConfidence(binding);
  const urgency = resolveUrgency(binding, signals);
  const provenance = Object.freeze([...binding.context.provenance]);

  const isActionable =
    state === "actionable" &&
    nextSteps.length > 0 &&
    implications.length > 0;

  return Object.freeze({
    state,
    kind,
    subject: binding.activeSubject,
    headlineIntent,
    observations,
    signals,
    relationships,
    implications,
    confidence,
    urgency,
    depth,
    emphasis,
    nextSteps,
    provenance,
    isActionable,
    responseIdentity: runtimeExecutiveAdvisorResponseModelIdentity,
    responseVersion: runtimeExecutiveAdvisorResponseModelVersion,
    bindingIdentity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    bindingVersion: runtimeExecutiveAdvisorContextSubjectBindingVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorResponse(
  value: unknown,
): RuntimeExecutiveAdvisorResponseValidationResult {
  const issues: RuntimeExecutiveAdvisorResponseIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-response", "response must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorResponseState(value.state)) {
    issues.push(issue("invalid-response-state", "state is not approved", "state"));
  }
  if (!isRuntimeExecutiveAdvisorResponseKind(value.kind)) {
    issues.push(issue("invalid-response-kind", "kind is not approved", "kind"));
  }
  if (!isRuntimeExecutiveAdvisorHeadlineIntent(value.headlineIntent)) {
    issues.push(
      issue(
        "invalid-headline-intent",
        "headlineIntent is not approved",
        "headlineIntent",
      ),
    );
  }
  if (!isRuntimeExecutiveAdvisorConfidence(value.confidence)) {
    issues.push(
      issue("invalid-confidence", "confidence is not approved", "confidence"),
    );
  }
  if (!isRuntimeExecutiveAdvisorUrgency(value.urgency)) {
    issues.push(issue("invalid-urgency", "urgency is not approved", "urgency"));
  }
  if (!isRuntimeExecutiveAdvisorResponseDepth(value.depth)) {
    issues.push(issue("invalid-depth", "depth is not approved", "depth"));
  }
  if (!isRuntimeExecutiveAdvisorResponseEmphasis(value.emphasis)) {
    issues.push(
      issue("invalid-emphasis", "emphasis is not approved", "emphasis"),
    );
  }
  if (typeof value.isActionable !== "boolean") {
    issues.push(
      issue("invalid-actionable", "isActionable must be a boolean", "isActionable"),
    );
  }

  if (value.subject !== null) {
    if (!isPlainObject(value.subject)) {
      issues.push(issue("invalid-subject", "subject must be object or null", "subject"));
    } else if (
      !isNonEmptyString(value.subject.id) ||
      !isRuntimeExecutiveAdvisorSubjectKind(value.subject.kind)
    ) {
      issues.push(
        issue("invalid-subject", "subject identity/kind invalid", "subject"),
      );
    }
  }

  if (value.state === "empty") {
    if (value.subject !== null) {
      issues.push(
        issue(
          "empty-state-inconsistency",
          "empty response must not have a subject",
          "subject",
        ),
      );
    }
    if (value.isActionable === true) {
      issues.push(
        issue(
          "empty-state-inconsistency",
          "empty response cannot be actionable",
          "isActionable",
        ),
      );
    }
  }

  if (value.state === "actionable" && value.isActionable !== true) {
    issues.push(
      issue(
        "actionable-state-inconsistency",
        "actionable state requires isActionable=true",
        "isActionable",
      ),
    );
  }

  const observationIds: string[] = [];
  if (!Array.isArray(value.observations)) {
    issues.push(
      issue("invalid-observations", "observations must be an array", "observations"),
    );
  } else {
    value.observations.forEach((observation, index) => {
      if (!isPlainObject(observation)) {
        issues.push(
          issue(
            "invalid-observation",
            "observation must be an object",
            `observations[${index}]`,
          ),
        );
        return;
      }
      if (!isNonEmptyString(observation.id)) {
        issues.push(
          issue(
            "invalid-observation-id",
            "observation id must be non-empty",
            `observations[${index}].id`,
          ),
        );
      } else {
        observationIds.push(observation.id);
      }
      if (!isRuntimeExecutiveAdvisorObservationCategory(observation.category)) {
        issues.push(
          issue(
            "invalid-observation-category",
            "observation category invalid",
            `observations[${index}].category`,
          ),
        );
      }
      if (
        !isRuntimeExecutiveAdvisorObservationImportance(observation.importance)
      ) {
        issues.push(
          issue(
            "invalid-observation-importance",
            "observation importance invalid",
            `observations[${index}].importance`,
          ),
        );
      }
    });
    if (!unique(observationIds)) {
      issues.push(
        issue(
          "duplicate-observation-id",
          "observation ids must be unique",
          "observations",
        ),
      );
    }
  }

  const signalIds: string[] = [];
  if (!Array.isArray(value.signals)) {
    issues.push(issue("invalid-signals", "signals must be an array", "signals"));
  } else {
    value.signals.forEach((signal, index) => {
      if (!isPlainObject(signal)) {
        issues.push(
          issue("invalid-signal", "signal must be an object", `signals[${index}]`),
        );
        return;
      }
      if (!isNonEmptyString(signal.id)) {
        issues.push(
          issue(
            "invalid-signal-id",
            "signal id must be non-empty",
            `signals[${index}].id`,
          ),
        );
      } else {
        signalIds.push(signal.id);
      }
      if (!isRuntimeExecutiveAdvisorSignalKind(signal.kind)) {
        issues.push(
          issue(
            "invalid-signal-kind",
            "signal kind invalid",
            `signals[${index}].kind`,
          ),
        );
      }
      if (!isRuntimeExecutiveAdvisorSignalSeverity(signal.severity)) {
        issues.push(
          issue(
            "invalid-signal-severity",
            "signal severity invalid",
            `signals[${index}].severity`,
          ),
        );
      }
    });
    if (!unique(signalIds)) {
      issues.push(
        issue("duplicate-signal-id", "signal ids must be unique", "signals"),
      );
    }
  }

  if (!Array.isArray(value.relationships)) {
    issues.push(
      issue(
        "invalid-relationships",
        "relationships must be an array",
        "relationships",
      ),
    );
  } else {
    value.relationships.forEach((relationship, index) => {
      if (!isPlainObject(relationship)) {
        issues.push(
          issue(
            "invalid-relationship",
            "relationship must be an object",
            `relationships[${index}]`,
          ),
        );
        return;
      }
      if (
        !isRuntimeExecutiveAdvisorResponseRelationshipKind(relationship.kind)
      ) {
        issues.push(
          issue(
            "invalid-relationship-kind",
            "relationship kind invalid",
            `relationships[${index}].kind`,
          ),
        );
      }
      if (
        !isNonEmptyString(relationship.sourceSubjectId) ||
        !isNonEmptyString(relationship.targetSubjectId)
      ) {
        issues.push(
          issue(
            "invalid-relationship-subjects",
            "relationship subject ids must be non-empty",
            `relationships[${index}]`,
          ),
        );
      }
    });
  }

  if (!Array.isArray(value.implications)) {
    issues.push(
      issue(
        "invalid-implications",
        "implications must be an array",
        "implications",
      ),
    );
  } else {
    const implicationIds: string[] = [];
    value.implications.forEach((implication, index) => {
      if (!isPlainObject(implication)) {
        issues.push(
          issue(
            "invalid-implication",
            "implication must be an object",
            `implications[${index}]`,
          ),
        );
        return;
      }
      if (!isNonEmptyString(implication.id)) {
        issues.push(
          issue(
            "invalid-implication-id",
            "implication id must be non-empty",
            `implications[${index}].id`,
          ),
        );
      } else {
        implicationIds.push(implication.id);
      }
      if (!isRuntimeExecutiveAdvisorImplicationKind(implication.kind)) {
        issues.push(
          issue(
            "invalid-implication-kind",
            "implication kind invalid",
            `implications[${index}].kind`,
          ),
        );
      }
    });
    if (!unique(implicationIds)) {
      issues.push(
        issue(
          "duplicate-implication-id",
          "implication ids must be unique",
          "implications",
        ),
      );
    }
  }

  if (!Array.isArray(value.nextSteps)) {
    issues.push(
      issue("invalid-next-steps", "nextSteps must be an array", "nextSteps"),
    );
  } else {
    value.nextSteps.forEach((step, index) => {
      if (!isRuntimeExecutiveAdvisorNextStepKind(step)) {
        issues.push(
          issue(
            "invalid-next-step-kind",
            "next step kind invalid",
            `nextSteps[${index}]`,
          ),
        );
      }
    });
  }

  if (
    value.responseIdentity !== runtimeExecutiveAdvisorResponseModelIdentity ||
    value.responseVersion !== runtimeExecutiveAdvisorResponseModelVersion
  ) {
    issues.push(
      issue(
        "invalid-response-metadata",
        "response identity/version metadata is invalid",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorResponseModelIdentity():
  typeof runtimeExecutiveAdvisorResponseModelCanonicalIdentity {
  return runtimeExecutiveAdvisorResponseModelCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorResponseModelApiNames = Object.freeze([
  "resolveRuntimeExecutiveAdvisorResponse",
  "resolveRuntimeExecutiveAdvisorResponseState",
  "resolveRuntimeExecutiveAdvisorResponseKind",
  "resolveRuntimeExecutiveAdvisorHeadlineIntent",
  "deriveRuntimeExecutiveAdvisorObservations",
  "deriveRuntimeExecutiveAdvisorSignals",
  "deriveRuntimeExecutiveAdvisorRelationships",
  "deriveRuntimeExecutiveAdvisorImplications",
  "resolveRuntimeExecutiveAdvisorResponseDepth",
  "resolveRuntimeExecutiveAdvisorResponseEmphasis",
  "isRuntimeExecutiveAdvisorResponseActionable",
  "validateRuntimeExecutiveAdvisorResponse",
  "verifyRuntimeExecutiveAdvisorResponseModel",
  "getRuntimeExecutiveAdvisorResponseModelIdentity",
  "isRuntimeExecutiveAdvisorResponseState",
  "isRuntimeExecutiveAdvisorResponseKind",
  "isRuntimeExecutiveAdvisorHeadlineIntent",
  "isRuntimeExecutiveAdvisorObservationCategory",
  "isRuntimeExecutiveAdvisorObservationImportance",
  "isRuntimeExecutiveAdvisorSignalKind",
  "isRuntimeExecutiveAdvisorSignalSeverity",
  "isRuntimeExecutiveAdvisorResponseRelationshipKind",
  "isRuntimeExecutiveAdvisorImplicationKind",
  "isRuntimeExecutiveAdvisorResponseDepth",
  "isRuntimeExecutiveAdvisorResponseEmphasis",
  "isRuntimeExecutiveAdvisorNextStepKind",
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorResponseState",
    "RuntimeExecutiveAdvisorResponseKind",
    "RuntimeExecutiveAdvisorHeadlineIntent",
    "RuntimeExecutiveAdvisorObservationCategory",
    "RuntimeExecutiveAdvisorObservationImportance",
    "RuntimeExecutiveAdvisorSignalKind",
    "RuntimeExecutiveAdvisorSignalSeverity",
    "RuntimeExecutiveAdvisorResponseRelationshipKind",
    "RuntimeExecutiveAdvisorImplicationKind",
    "RuntimeExecutiveAdvisorResponseDepth",
    "RuntimeExecutiveAdvisorResponseEmphasis",
    "RuntimeExecutiveAdvisorNextStepKind",
    "RuntimeExecutiveAdvisorResponseCapability",
    "RuntimeExecutiveAdvisorResponseRegistrySection",
    "RuntimeExecutiveAdvisorResponseSubject",
    "RuntimeExecutiveAdvisorObservation",
    "RuntimeExecutiveAdvisorSignal",
    "RuntimeExecutiveAdvisorResponseRelationship",
    "RuntimeExecutiveAdvisorImplication",
    "RuntimeExecutiveAdvisorResponse",
    "RuntimeExecutiveAdvisorResponseIssue",
    "RuntimeExecutiveAdvisorResponseValidationResult",
    "RuntimeExecutiveAdvisorResponseModelVerification",
  ] as const);

export const runtimeExecutiveAdvisorResponseModelRegistry = Object.freeze({
  identity: runtimeExecutiveAdvisorResponseModelIdentity,
  version: runtimeExecutiveAdvisorResponseModelVersion,
  namespace: runtimeExecutiveAdvisorResponseModelNamespace,
  layer: runtimeExecutiveAdvisorResponseModelLayer,
  domain: runtimeExecutiveAdvisorResponseModelDomain,
  phase: runtimeExecutiveAdvisorResponseModelPhase,
  dependencyIdentity: runtimeExecutiveAdvisorResponseModelDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorResponseModelDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorResponseModelSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS.length,
  responseStates: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES,
  responseStateCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES.length,
  responseKinds: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS,
  responseKindCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS.length,
  headlineIntents: RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS,
  headlineIntentCount: RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS.length,
  observationCategories: RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES,
  observationCategoryCount:
    RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES.length,
  observationImportance: RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE,
  observationImportanceCount:
    RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.length,
  signalKinds: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS,
  signalKindCount: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS.length,
  signalSeverities: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES,
  signalSeverityCount: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.length,
  relationshipKinds: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS,
  relationshipKindCount:
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS.length,
  implicationKinds: RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS,
  implicationKindCount: RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS.length,
  responseDepths: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS,
  responseDepthCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS.length,
  responseEmphases: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES,
  responseEmphasisCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES.length,
  nextStepKinds: RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS,
  nextStepKindCount: RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS.length,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES.length,
  publicTypes: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES,
  publicTypeCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveAdvisorResponseModelApiNames,
  publicApiCount: runtimeExecutiveAdvisorResponseModelApiNames.length,
});

export const runtimeExecutiveAdvisorResponseModel = Object.freeze({
  phase: "ResponseModel" as const,
  name: "RuntimeExecutiveAdvisorResponseModel" as const,
  identity: runtimeExecutiveAdvisorResponseModelIdentity,
  version: runtimeExecutiveAdvisorResponseModelVersion,
  namespace: runtimeExecutiveAdvisorResponseModelNamespace,
  layer: runtimeExecutiveAdvisorResponseModelLayer,
  domain: runtimeExecutiveAdvisorResponseModelDomain,
  architecturalRole: runtimeExecutiveAdvisorResponseModelArchitecturalRole,
  role: "ResponseModel" as const,
  status: runtimeExecutiveAdvisorResponseModelStability,
  upstreamDependency: runtimeExecutiveAdvisorResponseModelDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorResponseModelDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorResponseModelSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorResponseModelDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RESPONSIBILITY_SEPARATION,
  responseStates: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES,
  responseKinds: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS,
  headlineIntents: RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS,
  observationCategories: RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES,
  observationImportance: RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE,
  signalKinds: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS,
  signalSeverities: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES,
  relationshipKinds: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS,
  implicationKinds: RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS,
  responseDepths: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS,
  responseEmphases: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES,
  nextStepKinds: RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES,
  emptyResponse: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_INVARIANTS,
  forbiddenResponsibilities: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_FORBIDDEN,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorResponseModelApiNames,
  registry: runtimeExecutiveAdvisorResponseModelRegistry,
  bindingBoundary: "REX-3:2-binding-only" as const,
  architecturalStatus:
    "REX-3:3 Response Model Complete — Ready for REX-3:4 Advisor Guidance & Executive Actions" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorResponseModelVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorResponseModelIdentity;
  readonly version: typeof runtimeExecutiveAdvisorResponseModelVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorResponseModelNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorResponseModelDependencyIdentity;
  readonly responseStateCount: number;
  readonly responseKindCount: number;
  readonly headlineIntentCount: number;
  readonly observationCategoryCount: number;
  readonly observationImportanceCount: number;
  readonly signalKindCount: number;
  readonly signalSeverityCount: number;
  readonly relationshipKindCount: number;
  readonly implicationKindCount: number;
  readonly responseDepthCount: number;
  readonly responseEmphasisCount: number;
  readonly nextStepKindCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly bindingBoundaryIntact: boolean;
  readonly noRiskFromAttentionAlone: boolean;
  readonly noCausalStrengthening: boolean;
  readonly bindingOk: boolean;
  readonly noAi: boolean;
  readonly noStageMutation: boolean;
}

export function verifyRuntimeExecutiveAdvisorResponseModel():
  RuntimeExecutiveAdvisorResponseModelVerification {
  const module = runtimeExecutiveAdvisorResponseModel;
  const registry = runtimeExecutiveAdvisorResponseModelRegistry;
  const bindingOk = verifyRuntimeExecutiveAdvisorContextSubjectBinding();

  const identityOk =
    module.identity === "REX-3:3/RuntimeExecutiveAdvisorResponseModel" &&
    module.version === "3.3.0" &&
    module.namespace === "nexora.rex.advisor-experience.response-model" &&
    module.upstreamDependency ===
      "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorContextSubjectBinding" &&
    module.bindingBoundary === "REX-3:2-binding-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES], [
      "empty",
      "contextual",
      "interpreted",
      "actionable",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS], [
      "status",
      "explanation",
      "inspection",
      "comparison",
      "risk",
      "opportunity",
      "relationship",
      "decision-support",
      "execution-support",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS],
      [
        "Identity",
        "ResponseStates",
        "ResponseKinds",
        "HeadlineIntents",
        "ObservationCategories",
        "ObservationImportance",
        "SignalKinds",
        "SignalSeverities",
        "RelationshipKinds",
        "ImplicationKinds",
        "ResponseDepths",
        "ResponseEmphases",
        "NextStepKinds",
        "Capabilities",
      ],
    );

  const attentionOnly = resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({
      evidence: [
        {
          sourceKind: "stage-selection",
          subject: {
            id: "object.factory",
            kind: "nexora-object",
            label: "Factory",
          },
        },
        {
          sourceKind: "attention",
          subject: {
            id: "object.delivery",
            kind: "nexora-object",
            label: "Delivery",
          },
          attention: "critical",
        },
      ],
    }),
  );
  const noRiskFromAttentionAlone =
    !attentionOnly.signals.some((signal) => signal.kind === "risk") &&
    attentionOnly.signals.some((signal) => signal.kind === "attention");

  const relatedOnly = resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({
      evidence: [
        {
          sourceKind: "stage-selection",
          subject: {
            id: "object.factory",
            kind: "nexora-object",
            label: "Factory",
          },
        },
        {
          sourceKind: "related-subject",
          subject: {
            id: "object.delivery",
            kind: "nexora-object",
            label: "Delivery",
          },
        },
      ],
    }),
  );
  const noCausalStrengthening = relatedOnly.relationships.every(
    (relationship) =>
      relationship.kind === "related" || relationship.kind === "connected-to",
  );

  const empty = resolveRuntimeExecutiveAdvisorResponse(
    bindRuntimeExecutiveAdvisorContext({ evidence: [] }),
  );
  const emptyOk =
    empty.state === "empty" &&
    empty.subject === null &&
    empty.isActionable === false;

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EMPTY_RESPONSE) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_BOUNDARY);

  const bindingBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding" &&
    module.boundary.consumesBindingOnly === true &&
    module.boundary.importsRex31Directly === false &&
    module.boundary.importsRex2Directly === false;

  const ok =
    identityOk &&
    vocabOk &&
    noRiskFromAttentionAlone &&
    noCausalStrengthening &&
    emptyOk &&
    frozen &&
    bindingBoundaryIntact &&
    bindingOk.ok === true &&
    module.boundary.generatesProse === false &&
    module.boundary.mutatesStageState === false &&
    module.boundary.aiProviderIndependent === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorResponseModelIdentity,
    version: runtimeExecutiveAdvisorResponseModelVersion,
    namespace: runtimeExecutiveAdvisorResponseModelNamespace,
    dependencyIdentity: runtimeExecutiveAdvisorResponseModelDependencyIdentity,
    responseStateCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_STATES.length,
    responseKindCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_KINDS.length,
    headlineIntentCount: RUNTIME_EXECUTIVE_ADVISOR_HEADLINE_INTENTS.length,
    observationCategoryCount:
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_CATEGORIES.length,
    observationImportanceCount:
      RUNTIME_EXECUTIVE_ADVISOR_OBSERVATION_IMPORTANCE.length,
    signalKindCount: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_KINDS.length,
    signalSeverityCount: RUNTIME_EXECUTIVE_ADVISOR_SIGNAL_SEVERITIES.length,
    relationshipKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_RELATIONSHIP_KINDS.length,
    implicationKindCount: RUNTIME_EXECUTIVE_ADVISOR_IMPLICATION_KINDS.length,
    responseDepthCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_DEPTHS.length,
    responseEmphasisCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_EMPHASES.length,
    nextStepKindCount: RUNTIME_EXECUTIVE_ADVISOR_NEXT_STEP_KINDS.length,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_CAPABILITIES.length,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_REGISTRY_SECTIONS.length,
    publicTypeCount: RUNTIME_EXECUTIVE_ADVISOR_RESPONSE_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveAdvisorResponseModelApiNames.length,
    frozen,
    bindingBoundaryIntact,
    noRiskFromAttentionAlone,
    noCausalStrengthening,
    bindingOk: bindingOk.ok === true,
    noAi: module.boundary.generatesProse === false,
    noStageMutation: module.boundary.mutatesStageState === false,
  });
}

// ─── Additive consumer publication for REX-3:4+ ─────────────────────────────
// Re-exports only. Response-model behavior is unchanged.

export {
  bindRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorBindingEvidence,
  createRuntimeExecutiveAdvisorSubject,
  isRuntimeExecutiveAdvisorConfidence,
  isRuntimeExecutiveAdvisorSubjectKind,
  isRuntimeExecutiveAdvisorUrgency,
};

export type {
  RuntimeExecutiveAdvisorBindingResult,
  RuntimeExecutiveAdvisorConfidence,
  RuntimeExecutiveAdvisorProvenance,
  RuntimeExecutiveAdvisorSubject,
  RuntimeExecutiveAdvisorSubjectKind,
  RuntimeExecutiveAdvisorUrgency,
};
