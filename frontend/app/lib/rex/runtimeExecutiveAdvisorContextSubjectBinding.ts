/**
 * REX-3:2 — Runtime Executive Advisor Context & Subject Binding.
 *
 * Deterministically binds approved runtime evidence into the Advisor subject
 * and context model established by REX-3:1.
 *
 * Canonical flow:
 *   REX-2 Stage Runtime State
 *     → Observe
 *     → Resolve Executive Subject
 *     → Bind Advisor Context
 *     → Produce Advisor Binding Result
 *
 *   REX-3:1 Foundation → REX-3:2 Context & Subject Binding
 *
 * Binding only. No advice generation, action execution, Stage mutation,
 * Advisor UI, LLM calls, or orchestration.
 *
 * REX-2 answers: What is happening on Stage?
 * REX-3:1 answers: What can the Advisor understand?
 * REX-3:2 answers: What is the Advisor currently grounded on?
 */

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT,
  createRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorProvenance,
  createRuntimeExecutiveAdvisorSnapshot,
  createRuntimeExecutiveAdvisorSubject,
  isRuntimeExecutiveAdvisorAttentionLevel,
  isRuntimeExecutiveAdvisorConfidence,
  isRuntimeExecutiveAdvisorContextual,
  isRuntimeExecutiveAdvisorGuidanceIntent,
  isRuntimeExecutiveAdvisorGuidanceReady,
  isRuntimeExecutiveAdvisorPresentationState,
  isRuntimeExecutiveAdvisorStageRelationship,
  isRuntimeExecutiveAdvisorSubjectKind,
  isRuntimeExecutiveAdvisorUrgency,
  normalizeRuntimeExecutiveAdvisorActionAffordances,
  normalizeRuntimeExecutiveAdvisorContext,
  normalizeRuntimeExecutiveAdvisorSubject,
  runtimeExecutiveAdvisorExperienceFoundationIdentity,
  runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
  runtimeExecutiveAdvisorExperienceFoundationVersion,
  validateRuntimeExecutiveAdvisorContext,
  verifyRuntimeExecutiveAdvisorExperienceFoundation,
  type RuntimeExecutiveAdvisorActionAffordance,
  type RuntimeExecutiveAdvisorAttentionLevel,
  type RuntimeExecutiveAdvisorConfidence,
  type RuntimeExecutiveAdvisorContext,
  type RuntimeExecutiveAdvisorEngagementState,
  type RuntimeExecutiveAdvisorFoundationIssue,
  type RuntimeExecutiveAdvisorFoundationValidationResult,
  type RuntimeExecutiveAdvisorGuidanceIntent,
  type RuntimeExecutiveAdvisorPresentationState,
  type RuntimeExecutiveAdvisorProvenance,
  type RuntimeExecutiveAdvisorProvenanceKind,
  type RuntimeExecutiveAdvisorSnapshot,
  type RuntimeExecutiveAdvisorStageRelationship,
  type RuntimeExecutiveAdvisorSubject,
  type RuntimeExecutiveAdvisorSubjectKind,
  type RuntimeExecutiveAdvisorUrgency,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorContextSubjectBindingIdentity =
  "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingVersion =
  "3.2.0" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingNamespace =
  "nexora.rex.advisor-experience.context-subject-binding" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingPhase =
  "ContextSubjectBinding" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingArchitecturalRole =
  "RuntimeExecutiveAdvisorContextSubjectBindingBoundary" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity =
  runtimeExecutiveAdvisorExperienceFoundationIdentity;

export const runtimeExecutiveAdvisorContextSubjectBindingDependencyPath =
  runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath;

/** Sole supported import path for REX-3 consumers of this binding layer. */
export const runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorContextSubjectBinding" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingStability =
  "BindingReady" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingDeterministic =
  true as const;

export const runtimeExecutiveAdvisorContextSubjectBindingSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorContextSubjectBindingCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    version: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    namespace: runtimeExecutiveAdvisorContextSubjectBindingNamespace,
    layer: runtimeExecutiveAdvisorContextSubjectBindingLayer,
    domain: runtimeExecutiveAdvisorContextSubjectBindingDomain,
    phase: runtimeExecutiveAdvisorContextSubjectBindingPhase,
    architecturalRole:
      runtimeExecutiveAdvisorContextSubjectBindingArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorContextSubjectBindingDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorExperienceFoundationVersion,
    stabilityStatus:
      runtimeExecutiveAdvisorContextSubjectBindingStability,
    deterministicStatus:
      runtimeExecutiveAdvisorContextSubjectBindingDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorContextSubjectBindingSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveAdvisorContextSubjectBindingMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRINCIPLE =
  "Runtime evidence → subject candidates → deterministic precedence → active Advisor subject → Advisor context. Binding grounds; it does not advise." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  bindingAuthority: "REX-3:2" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorContextSubjectBindingBoundary" as const,
  soleImmediateDependency:
    "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  mutatesStageState: false as const,
  executesActions: false as const,
  generatesAdvice: false as const,
  parsesNaturalLanguage: false as const,
  introducesRendering: false as const,
  introducesOrchestration: false as const,
});

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex2Owns: "What is happening on Stage?" as const,
    rex31Owns: "What can the Advisor understand?" as const,
    rex32Owns: "What is the Advisor currently grounded on?" as const,
    laterRex33Owns: "What runtime response should the Advisor form?" as const,
    oneWayBinding: "Stage Runtime → Advisor Context" as const,
    advisorIsNotSecondDirector: true as const,
  });

// ─── Binding source vocabulary ──────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS = Object.freeze([
  "explicit-manager-intent",
  "stage-selection",
  "stage-focus",
  "interaction",
  "attention",
  "scene",
  "presentation",
  "runtime-context",
  "related-subject",
] as const);

export type RuntimeExecutiveAdvisorBindingSourceKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS)[number];

/**
 * Canonical precedence metadata — authority of runtime evidence, not business
 * importance. Selection outranks focus; attention does not override stronger
 * manager/Stage authority.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES = Object.freeze([
  Object.freeze({
    order: 1,
    sourceKind: "explicit-manager-intent" as const,
    precedence: 900,
    authority: "highest" as const,
  }),
  Object.freeze({
    order: 2,
    sourceKind: "stage-selection" as const,
    precedence: 800,
    authority: "stage-selection" as const,
  }),
  Object.freeze({
    order: 3,
    sourceKind: "stage-focus" as const,
    precedence: 700,
    authority: "stage-focus" as const,
  }),
  Object.freeze({
    order: 4,
    sourceKind: "interaction" as const,
    precedence: 600,
    authority: "interaction" as const,
  }),
  Object.freeze({
    order: 5,
    sourceKind: "attention" as const,
    precedence: 500,
    authority: "attention" as const,
    note: "Applies to critical/elevated attention subjects; ambient/normal use reduced precedence." as const,
  }),
  Object.freeze({
    order: 6,
    sourceKind: "scene" as const,
    precedence: 400,
    authority: "scene" as const,
  }),
  Object.freeze({
    order: 7,
    sourceKind: "presentation" as const,
    precedence: 300,
    authority: "presentation" as const,
  }),
  Object.freeze({
    order: 8,
    sourceKind: "runtime-context" as const,
    precedence: 200,
    authority: "runtime-context" as const,
  }),
  Object.freeze({
    order: 9,
    sourceKind: "related-subject" as const,
    precedence: 100,
    authority: "related-subject" as const,
  }),
]);

export type RuntimeExecutiveAdvisorBindingPrecedenceRule =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES = Object.freeze([
  "unbound",
  "context-bound",
  "subject-bound",
  "fully-bound",
] as const);

export type RuntimeExecutiveAdvisorBindingState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STRONG_BINDING_SOURCES = Object.freeze([
  "explicit-manager-intent",
  "stage-selection",
  "stage-focus",
  "interaction",
  "attention",
] as const);

export type RuntimeExecutiveAdvisorStrongBindingSource =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STRONG_BINDING_SOURCES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES = Object.freeze([
  "binding-evidence-modeling",
  "subject-candidate-collection",
  "subject-precedence-resolution",
  "subject-binding",
  "context-binding",
  "stage-selection-binding",
  "stage-focus-binding",
  "interaction-binding",
  "attention-binding",
  "scene-binding",
  "runtime-context-binding",
  "related-subject-binding",
  "contextual-subject-preservation",
  "stage-relationship-resolution",
  "engagement-resolution",
  "provenance-binding",
  "binding-normalization",
  "binding-validation",
  "deterministic-tie-breaking",
] as const);

export type RuntimeExecutiveAdvisorBindingCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "BindingSources",
  "BindingStates",
  "Precedence",
  "Resolvers",
  "Normalization",
  "Validation",
  "Capabilities",
  "Compatibility",
] as const);

export type RuntimeExecutiveAdvisorBindingRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS)[number];

/**
 * Optional structured markers for later response-model derivation.
 * Binding resolution ignores these; they are additive publication only.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_MARKERS = Object.freeze([
  "risk",
  "opportunity",
  "deviation",
  "dependency",
  "conflict",
  "progress",
  "blocker",
] as const);

export type RuntimeExecutiveAdvisorBindingMarker =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_MARKERS)[number];

/**
 * Optional explicit subject-to-subject linkage for response relationships.
 * Binding must not invent stronger linkage than supplied here.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_LINKAGE_KINDS = Object.freeze([
  "related",
  "depends-on",
  "influences",
  "affected-by",
  "part-of",
  "connected-to",
] as const);

export type RuntimeExecutiveAdvisorBindingLinkageKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_LINKAGE_KINDS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorBindingEvidence {
  readonly sourceKind: RuntimeExecutiveAdvisorBindingSourceKind;
  readonly subject: RuntimeExecutiveAdvisorSubject;
  readonly sourceId?: string;
  readonly relationship?: RuntimeExecutiveAdvisorStageRelationship;
  readonly attention?: RuntimeExecutiveAdvisorAttentionLevel;
  readonly presentationState?: RuntimeExecutiveAdvisorPresentationState;
  readonly guidanceIntent?: RuntimeExecutiveAdvisorGuidanceIntent;
  readonly markers?: ReadonlyArray<RuntimeExecutiveAdvisorBindingMarker>;
  readonly linkageKind?: RuntimeExecutiveAdvisorBindingLinkageKind;
  readonly linkageTargetSubjectId?: string;
}

export interface RuntimeExecutiveAdvisorSubjectCandidate {
  readonly subject: RuntimeExecutiveAdvisorSubject;
  readonly sourceKind: RuntimeExecutiveAdvisorBindingSourceKind;
  readonly precedence: number;
  readonly stageRelationship: RuntimeExecutiveAdvisorStageRelationship;
  readonly evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>;
  readonly sourceOrder: number;
}

export interface RuntimeExecutiveAdvisorBindingInput {
  readonly evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>;
  readonly baseContext?: RuntimeExecutiveAdvisorContext;
}

export interface RuntimeExecutiveAdvisorBindingResult {
  readonly state: RuntimeExecutiveAdvisorBindingState;
  readonly context: RuntimeExecutiveAdvisorContext;
  readonly activeSubject: RuntimeExecutiveAdvisorSubject | null;
  readonly contextualSubjects: ReadonlyArray<RuntimeExecutiveAdvisorSubject>;
  readonly candidates: ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate>;
  readonly evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>;
  readonly isContextual: boolean;
  readonly isGuidanceReady: boolean;
  readonly bindingIdentity: typeof runtimeExecutiveAdvisorContextSubjectBindingIdentity;
  readonly bindingVersion: typeof runtimeExecutiveAdvisorContextSubjectBindingVersion;
  readonly foundationIdentity: typeof runtimeExecutiveAdvisorExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveAdvisorExperienceFoundationVersion;
}

export interface RuntimeExecutiveAdvisorBindingSnapshot {
  readonly binding: RuntimeExecutiveAdvisorBindingResult;
  readonly advisorSnapshot: RuntimeExecutiveAdvisorSnapshot;
}

export type RuntimeExecutiveAdvisorBindingIssue =
  RuntimeExecutiveAdvisorFoundationIssue;

export type RuntimeExecutiveAdvisorBindingValidationResult =
  RuntimeExecutiveAdvisorFoundationValidationResult;

// ─── Invariants / forbidden ─────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "active-subject-from-evidence",
    order: 1,
    statement:
      "Active subject must originate from legitimate binding evidence unless supplied through an approved base-context contract.",
  }),
  Object.freeze({
    id: "no-duplicate-contextual-active-subject",
    order: 2,
    statement:
      "Active subject must not also appear as a duplicate contextual subject.",
  }),
  Object.freeze({
    id: "selection-outranks-focus",
    order: 3,
    statement:
      "Selection outranks focus unless explicit manager intent exists.",
  }),
  Object.freeze({
    id: "attention-does-not-override-stronger-authority",
    order: 4,
    statement:
      "Attention does not silently override stronger manager/Stage authority.",
  }),
  Object.freeze({
    id: "no-upstream-mutation",
    order: 5,
    statement: "No binding operation mutates upstream data.",
  }),
  Object.freeze({
    id: "deterministic-binding",
    order: 6,
    statement: "Same semantic input produces the same binding output.",
  }),
  Object.freeze({
    id: "no-affordance-execution",
    order: 7,
    statement: "Binding never executes an affordance.",
  }),
  Object.freeze({
    id: "no-stage-mutation",
    order: 8,
    statement: "Binding never mutates Stage state.",
  }),
] as const);

export type RuntimeExecutiveAdvisorBindingInvariant =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "LLM calls",
    "prompt engineering",
    "natural-language parsing",
    "advice generation",
    "recommendation ranking",
    "action execution",
    "Stage mutation",
    "focus mutation",
    "selection mutation",
    "scene navigation",
    "UI rendering",
    "React hooks",
    "application stores",
    "Director computation",
    "causal inference",
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
): RuntimeExecutiveAdvisorBindingIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function compareSubjectIdentity(
  left: RuntimeExecutiveAdvisorSubject,
  right: RuntimeExecutiveAdvisorSubject,
): number {
  if (left.id < right.id) return -1;
  if (left.id > right.id) return 1;
  if (left.kind < right.kind) return -1;
  if (left.kind > right.kind) return 1;
  return 0;
}

function sourceKindOrder(
  sourceKind: RuntimeExecutiveAdvisorBindingSourceKind,
): number {
  return RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS.indexOf(sourceKind);
}

function isStrongSource(
  sourceKind: RuntimeExecutiveAdvisorBindingSourceKind,
): boolean {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_STRONG_BINDING_SOURCES as readonly string[]
  ).includes(sourceKind);
}

function isElevatedAttention(
  attention: RuntimeExecutiveAdvisorAttentionLevel | undefined,
): boolean {
  return attention === "elevated" || attention === "critical";
}

export function getRuntimeExecutiveAdvisorBindingPrecedence(
  sourceKind: RuntimeExecutiveAdvisorBindingSourceKind,
  attention?: RuntimeExecutiveAdvisorAttentionLevel,
): number {
  const rule = RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES.find(
    (entry) => entry.sourceKind === sourceKind,
  );
  if (!rule) {
    throw new TypeError(`unknown binding source kind: ${sourceKind}`);
  }
  if (sourceKind === "attention" && !isElevatedAttention(attention)) {
    // Ambient/normal attention remains evidence but must not outrank scene.
    return 350;
  }
  return rule.precedence;
}

function mapSourceKindToProvenanceKind(
  sourceKind: RuntimeExecutiveAdvisorBindingSourceKind,
): RuntimeExecutiveAdvisorProvenanceKind {
  switch (sourceKind) {
    case "presentation":
      return "presentation-state";
    case "related-subject":
      return "runtime-context";
    default:
      return sourceKind;
  }
}

function defaultRelationshipForSource(
  sourceKind: RuntimeExecutiveAdvisorBindingSourceKind,
): RuntimeExecutiveAdvisorStageRelationship {
  switch (sourceKind) {
    case "stage-selection":
      return "selected-subject";
    case "stage-focus":
      return "focused-subject";
    case "related-subject":
      return "related-subject";
    case "scene":
    case "runtime-context":
    case "presentation":
      return "observing";
    case "explicit-manager-intent":
    case "interaction":
    case "attention":
      return "related-subject";
    default:
      return "none";
  }
}

function attentionRank(
  attention: RuntimeExecutiveAdvisorAttentionLevel,
): number {
  switch (attention) {
    case "critical":
      return 4;
    case "elevated":
      return 3;
    case "normal":
      return 2;
    case "ambient":
    default:
      return 1;
  }
}

function maxAttention(
  levels: ReadonlyArray<RuntimeExecutiveAdvisorAttentionLevel>,
): RuntimeExecutiveAdvisorAttentionLevel {
  if (levels.length === 0) return "ambient";
  return levels.reduce((best, current) =>
    attentionRank(current) > attentionRank(best) ? current : best,
  );
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorBindingSourceKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorBindingSourceKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorBindingState(
  value: unknown,
): value is RuntimeExecutiveAdvisorBindingState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorBindingCapability(
  value: unknown,
): value is RuntimeExecutiveAdvisorBindingCapability {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorBindingMarker(
  value: unknown,
): value is RuntimeExecutiveAdvisorBindingMarker {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_MARKERS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorBindingLinkageKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorBindingLinkageKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_LINKAGE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorSubjectBound(
  result: RuntimeExecutiveAdvisorBindingResult,
): boolean {
  return (
    result.state === "subject-bound" ||
    result.state === "fully-bound"
  );
}

export function isRuntimeExecutiveAdvisorContextBound(
  result: RuntimeExecutiveAdvisorBindingResult,
): boolean {
  return result.state !== "unbound";
}

// ─── Normalization / constructors ───────────────────────────────────────────

export function normalizeRuntimeExecutiveAdvisorBindingEvidence(
  input: RuntimeExecutiveAdvisorBindingEvidence,
): RuntimeExecutiveAdvisorBindingEvidence {
  if (!isRuntimeExecutiveAdvisorBindingSourceKind(input.sourceKind)) {
    throw new TypeError("sourceKind must be a known Advisor binding source");
  }
  const subject = normalizeRuntimeExecutiveAdvisorSubject(input.subject);
  if (input.sourceId !== undefined && !isNonEmptyString(input.sourceId)) {
    throw new TypeError("sourceId must be a non-empty string when provided");
  }
  if (
    input.relationship !== undefined &&
    !isRuntimeExecutiveAdvisorStageRelationship(input.relationship)
  ) {
    throw new TypeError("relationship must be a known Stage relationship");
  }
  if (
    input.attention !== undefined &&
    !isRuntimeExecutiveAdvisorAttentionLevel(input.attention)
  ) {
    throw new TypeError("attention must be a known Advisor attention level");
  }
  if (
    input.presentationState !== undefined &&
    !isRuntimeExecutiveAdvisorPresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be minimum, report, or operation",
    );
  }
  if (
    input.guidanceIntent !== undefined &&
    !isRuntimeExecutiveAdvisorGuidanceIntent(input.guidanceIntent)
  ) {
    throw new TypeError("guidanceIntent must be a known Advisor guidance intent");
  }
  if (input.markers !== undefined) {
    if (!Array.isArray(input.markers)) {
      throw new TypeError("markers must be a readonly array when provided");
    }
    for (const marker of input.markers) {
      if (!isRuntimeExecutiveAdvisorBindingMarker(marker)) {
        throw new TypeError("markers contain an unknown binding marker");
      }
    }
  }
  if (
    input.linkageKind !== undefined &&
    !isRuntimeExecutiveAdvisorBindingLinkageKind(input.linkageKind)
  ) {
    throw new TypeError("linkageKind must be a known binding linkage kind");
  }
  if (
    input.linkageTargetSubjectId !== undefined &&
    !isNonEmptyString(input.linkageTargetSubjectId)
  ) {
    throw new TypeError(
      "linkageTargetSubjectId must be a non-empty string when provided",
    );
  }

  const markers =
    input.markers === undefined
      ? undefined
      : Object.freeze([...input.markers]);

  return Object.freeze({
    sourceKind: input.sourceKind,
    subject,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.relationship !== undefined
      ? { relationship: input.relationship }
      : {}),
    ...(input.attention !== undefined ? { attention: input.attention } : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.guidanceIntent !== undefined
      ? { guidanceIntent: input.guidanceIntent }
      : {}),
    ...(markers !== undefined ? { markers } : {}),
    ...(input.linkageKind !== undefined
      ? { linkageKind: input.linkageKind }
      : {}),
    ...(input.linkageTargetSubjectId !== undefined
      ? { linkageTargetSubjectId: input.linkageTargetSubjectId }
      : {}),
  });
}

export function createRuntimeExecutiveAdvisorBindingEvidence(input: {
  readonly sourceKind: RuntimeExecutiveAdvisorBindingSourceKind;
  readonly subject: RuntimeExecutiveAdvisorSubject;
  readonly sourceId?: string;
  readonly relationship?: RuntimeExecutiveAdvisorStageRelationship;
  readonly attention?: RuntimeExecutiveAdvisorAttentionLevel;
  readonly presentationState?: RuntimeExecutiveAdvisorPresentationState;
  readonly guidanceIntent?: RuntimeExecutiveAdvisorGuidanceIntent;
  readonly markers?: ReadonlyArray<RuntimeExecutiveAdvisorBindingMarker>;
  readonly linkageKind?: RuntimeExecutiveAdvisorBindingLinkageKind;
  readonly linkageTargetSubjectId?: string;
}): RuntimeExecutiveAdvisorBindingEvidence {
  return normalizeRuntimeExecutiveAdvisorBindingEvidence({
    sourceKind: input.sourceKind,
    subject: input.subject,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.relationship !== undefined
      ? { relationship: input.relationship }
      : {}),
    ...(input.attention !== undefined ? { attention: input.attention } : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.guidanceIntent !== undefined
      ? { guidanceIntent: input.guidanceIntent }
      : {}),
    ...(input.markers !== undefined ? { markers: input.markers } : {}),
    ...(input.linkageKind !== undefined
      ? { linkageKind: input.linkageKind }
      : {}),
    ...(input.linkageTargetSubjectId !== undefined
      ? { linkageTargetSubjectId: input.linkageTargetSubjectId }
      : {}),
  });
}

function evidenceDedupeKey(
  evidence: RuntimeExecutiveAdvisorBindingEvidence,
): string {
  return [
    evidence.sourceKind,
    evidence.subject.id,
    evidence.sourceId ?? "",
    evidence.relationship ?? "",
    evidence.attention ?? "",
    evidence.presentationState ?? "",
    evidence.guidanceIntent ?? "",
    (evidence.markers ?? []).join(","),
    evidence.linkageKind ?? "",
    evidence.linkageTargetSubjectId ?? "",
  ].join("\u0000");
}

export function normalizeRuntimeExecutiveAdvisorBindingInput(
  input: RuntimeExecutiveAdvisorBindingInput,
): RuntimeExecutiveAdvisorBindingInput {
  if (!Array.isArray(input.evidence)) {
    throw new TypeError("evidence must be a readonly array");
  }

  const seen = new Set<string>();
  const evidence: RuntimeExecutiveAdvisorBindingEvidence[] = [];
  for (const entry of input.evidence) {
    const normalized = normalizeRuntimeExecutiveAdvisorBindingEvidence(entry);
    const key = evidenceDedupeKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    evidence.push(normalized);
  }

  return Object.freeze({
    evidence: Object.freeze(evidence),
    ...(input.baseContext !== undefined
      ? {
          baseContext: normalizeRuntimeExecutiveAdvisorContext(input.baseContext),
        }
      : {}),
  });
}

export function normalizeRuntimeExecutiveAdvisorSubjectCandidates(
  candidates: ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate>,
): ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate> {
  return Object.freeze(
    candidates.map((candidate) =>
      Object.freeze({
        subject: normalizeRuntimeExecutiveAdvisorSubject(candidate.subject),
        sourceKind: candidate.sourceKind,
        precedence: candidate.precedence,
        stageRelationship: candidate.stageRelationship,
        evidence: Object.freeze(
          candidate.evidence.map((entry) =>
            normalizeRuntimeExecutiveAdvisorBindingEvidence(entry),
          ),
        ),
        sourceOrder: candidate.sourceOrder,
      }),
    ),
  );
}

// ─── Candidate collection / subject resolution ──────────────────────────────

export function collectRuntimeExecutiveAdvisorSubjectCandidates(
  evidenceInput: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
): ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate> {
  const normalizedEvidence = evidenceInput.map((entry, index) =>
    Object.freeze({
      evidence: normalizeRuntimeExecutiveAdvisorBindingEvidence(entry),
      sourceOrder: index,
    }),
  );

  type Acc = {
    subject: RuntimeExecutiveAdvisorSubject;
    evidence: RuntimeExecutiveAdvisorBindingEvidence[];
    sourceOrders: number[];
    bestPrecedence: number;
    bestSourceKind: RuntimeExecutiveAdvisorBindingSourceKind;
    bestSourceOrder: number;
    relationship: RuntimeExecutiveAdvisorStageRelationship;
  };

  const bySubjectId = new Map<string, Acc>();

  for (const { evidence, sourceOrder } of normalizedEvidence) {
    const precedence = getRuntimeExecutiveAdvisorBindingPrecedence(
      evidence.sourceKind,
      evidence.attention,
    );
    const existing = bySubjectId.get(evidence.subject.id);
    const relationship =
      evidence.relationship ?? defaultRelationshipForSource(evidence.sourceKind);

    if (!existing) {
      bySubjectId.set(evidence.subject.id, {
        subject: evidence.subject,
        evidence: [evidence],
        sourceOrders: [sourceOrder],
        bestPrecedence: precedence,
        bestSourceKind: evidence.sourceKind,
        bestSourceOrder: sourceOrder,
        relationship,
      });
      continue;
    }

    existing.evidence.push(evidence);
    existing.sourceOrders.push(sourceOrder);

    const betterPrecedence = precedence > existing.bestPrecedence;
    const equalPrecedence = precedence === existing.bestPrecedence;
    const betterSourceOrder =
      equalPrecedence && sourceOrder < existing.bestSourceOrder;
    const betterSourceKind =
      equalPrecedence &&
      sourceOrder === existing.bestSourceOrder &&
      sourceKindOrder(evidence.sourceKind) <
        sourceKindOrder(existing.bestSourceKind);

    if (betterPrecedence || betterSourceOrder || betterSourceKind) {
      existing.bestPrecedence = precedence;
      existing.bestSourceKind = evidence.sourceKind;
      existing.bestSourceOrder = sourceOrder;
      existing.relationship = relationship;
      // Prefer subject label/metadata from strongest evidence occurrence.
      existing.subject = evidence.subject;
    }
  }

  const candidates = [...bySubjectId.values()].map((entry) =>
    Object.freeze({
      subject: entry.subject,
      sourceKind: entry.bestSourceKind,
      precedence: entry.bestPrecedence,
      stageRelationship: entry.relationship,
      evidence: Object.freeze([...entry.evidence]),
      sourceOrder: Math.min(...entry.sourceOrders),
    }),
  );

  candidates.sort((left, right) => {
    if (right.precedence !== left.precedence) {
      return right.precedence - left.precedence;
    }
    if (left.sourceOrder !== right.sourceOrder) {
      return left.sourceOrder - right.sourceOrder;
    }
    const sourceDelta =
      sourceKindOrder(left.sourceKind) - sourceKindOrder(right.sourceKind);
    if (sourceDelta !== 0) return sourceDelta;
    return compareSubjectIdentity(left.subject, right.subject);
  });

  return Object.freeze(candidates);
}

export function resolveRuntimeExecutiveAdvisorSubject(
  evidenceInput: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
): RuntimeExecutiveAdvisorSubject | null {
  const candidates =
    collectRuntimeExecutiveAdvisorSubjectCandidates(evidenceInput);
  return candidates[0]?.subject ?? null;
}

export function resolveRuntimeExecutiveAdvisorStageRelationship(input: {
  readonly activeSubject: RuntimeExecutiveAdvisorSubject | null;
  readonly evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>;
}): RuntimeExecutiveAdvisorStageRelationship {
  if (input.activeSubject === null) {
    return input.evidence.length > 0 ? "observing" : "none";
  }

  const activeId = input.activeSubject.id;
  const normalized = input.evidence.map((entry) =>
    normalizeRuntimeExecutiveAdvisorBindingEvidence(entry),
  );

  const activeEvidence = normalized.filter(
    (entry) => entry.subject.id === activeId,
  );

  if (activeEvidence.some((entry) => entry.sourceKind === "stage-selection")) {
    return "selected-subject";
  }
  if (
    activeEvidence.some(
      (entry) => entry.relationship === "selected-subject",
    )
  ) {
    return "selected-subject";
  }
  if (activeEvidence.some((entry) => entry.sourceKind === "stage-focus")) {
    return "focused-subject";
  }
  if (
    activeEvidence.some(
      (entry) => entry.relationship === "focused-subject",
    )
  ) {
    return "focused-subject";
  }
  if (
    activeEvidence.some(
      (entry) =>
        entry.relationship === "related-subject" ||
        entry.sourceKind === "related-subject" ||
        entry.sourceKind === "explicit-manager-intent" ||
        entry.sourceKind === "interaction" ||
        entry.sourceKind === "attention",
    )
  ) {
    // Explicit/interaction/attention subjects that are not the Stage selection
    // remain related to Stage context when other Stage subjects exist.
    const hasOtherStageSubject = normalized.some(
      (entry) =>
        entry.subject.id !== activeId &&
        (entry.sourceKind === "stage-selection" ||
          entry.sourceKind === "stage-focus" ||
          entry.sourceKind === "scene"),
    );
    if (hasOtherStageSubject) {
      return "related-subject";
    }
    if (
      activeEvidence.some((entry) => entry.relationship === "related-subject")
    ) {
      return "related-subject";
    }
  }

  if (
    activeEvidence.some(
      (entry) =>
        entry.sourceKind === "scene" ||
        entry.sourceKind === "runtime-context" ||
        entry.sourceKind === "presentation",
    )
  ) {
    return "observing";
  }

  return activeEvidence[0]
    ? defaultRelationshipForSource(activeEvidence[0].sourceKind)
    : "none";
}

function resolveEngagement(input: {
  readonly activeSubject: RuntimeExecutiveAdvisorSubject | null;
  readonly candidates: ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate>;
  readonly contextualSubjects: ReadonlyArray<RuntimeExecutiveAdvisorSubject>;
  readonly state: RuntimeExecutiveAdvisorBindingState;
}): RuntimeExecutiveAdvisorEngagementState {
  if (input.state === "unbound" || input.activeSubject === null) {
    return input.candidates.length > 0 || input.contextualSubjects.length > 0
      ? "aware"
      : "idle";
  }

  if (input.state === "context-bound") {
    return "aware";
  }

  // subject-bound / fully-bound
  if (
    input.state === "fully-bound" ||
    input.contextualSubjects.length > 0
  ) {
    return "guiding";
  }

  return "engaged";
}

function resolveBindingState(input: {
  readonly activeSubject: RuntimeExecutiveAdvisorSubject | null;
  readonly winningCandidate: RuntimeExecutiveAdvisorSubjectCandidate | null;
  readonly contextualSubjects: ReadonlyArray<RuntimeExecutiveAdvisorSubject>;
  readonly evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>;
}): RuntimeExecutiveAdvisorBindingState {
  if (input.evidence.length === 0 && input.activeSubject === null) {
    return "unbound";
  }

  if (input.activeSubject === null) {
    return input.evidence.length > 0 ? "context-bound" : "unbound";
  }

  const strong =
    input.winningCandidate !== null &&
    isStrongSource(input.winningCandidate.sourceKind) &&
    !(
      input.winningCandidate.sourceKind === "attention" &&
      !input.winningCandidate.evidence.some((entry) =>
        isElevatedAttention(entry.attention),
      )
    );

  if (!strong) {
    return "context-bound";
  }

  const supportingEvidence = input.evidence.some(
    (entry) => entry.subject.id !== input.activeSubject!.id,
  );
  if (supportingEvidence || input.contextualSubjects.length > 0) {
    return "fully-bound";
  }

  // Multiple evidence records on the same strong subject still count as
  // meaningful supporting runtime context for fully-bound.
  if (
    input.winningCandidate !== null &&
    input.winningCandidate.evidence.length > 1
  ) {
    return "fully-bound";
  }

  return "subject-bound";
}

function resolveGuidanceIntent(
  input: RuntimeExecutiveAdvisorBindingInput,
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
): RuntimeExecutiveAdvisorGuidanceIntent {
  if (
    input.baseContext?.intent !== undefined &&
    isRuntimeExecutiveAdvisorGuidanceIntent(input.baseContext.intent)
  ) {
    return input.baseContext.intent;
  }

  for (const entry of evidence) {
    if (entry.guidanceIntent !== undefined) {
      return entry.guidanceIntent;
    }
  }

  return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.intent;
}

function resolvePresentationState(
  input: RuntimeExecutiveAdvisorBindingInput,
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
  activeSubjectId: string | null,
): RuntimeExecutiveAdvisorPresentationState {
  // Prefer runtime evidence presentation for the active subject, then any
  // evidence presentation, then an explicitly provided base context value.
  const activePresentation = evidence.find(
    (entry) =>
      entry.subject.id === activeSubjectId &&
      entry.presentationState !== undefined,
  )?.presentationState;
  if (activePresentation !== undefined) {
    return activePresentation;
  }

  const anyPresentation = evidence.find(
    (entry) => entry.presentationState !== undefined,
  )?.presentationState;
  if (anyPresentation !== undefined) {
    return anyPresentation;
  }

  if (
    input.baseContext?.presentationState !== undefined &&
    isRuntimeExecutiveAdvisorPresentationState(
      input.baseContext.presentationState,
    )
  ) {
    return input.baseContext.presentationState;
  }

  return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.presentationState;
}

function resolveAttention(
  input: RuntimeExecutiveAdvisorBindingInput,
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
  activeSubjectId: string | null,
): RuntimeExecutiveAdvisorAttentionLevel {
  const activeLevels = evidence
    .filter(
      (entry) =>
        entry.subject.id === activeSubjectId && entry.attention !== undefined,
    )
    .map((entry) => entry.attention!);
  if (activeLevels.length > 0) {
    return maxAttention(activeLevels);
  }

  const allLevels = evidence
    .filter((entry) => entry.attention !== undefined)
    .map((entry) => entry.attention!);
  if (allLevels.length > 0) {
    return maxAttention(allLevels);
  }

  return (
    input.baseContext?.attention ??
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.attention
  );
}

function buildProvenance(
  activeSubject: RuntimeExecutiveAdvisorSubject | null,
  evidence: ReadonlyArray<RuntimeExecutiveAdvisorBindingEvidence>,
): ReadonlyArray<RuntimeExecutiveAdvisorProvenance> {
  if (activeSubject === null) {
    const seen = new Set<string>();
    const provenance: RuntimeExecutiveAdvisorProvenance[] = [];
    for (const entry of evidence) {
      const kind = mapSourceKindToProvenanceKind(entry.sourceKind);
      const key = `${kind}\u0000${entry.sourceId ?? entry.subject.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      provenance.push(
        createRuntimeExecutiveAdvisorProvenance({
          kind,
          ...(entry.sourceId !== undefined
            ? { sourceId: entry.sourceId }
            : { sourceId: entry.subject.id }),
          reason: entry.sourceKind,
        }),
      );
    }
    return Object.freeze(provenance);
  }

  const seen = new Set<string>();
  const provenance: RuntimeExecutiveAdvisorProvenance[] = [];
  for (const entry of evidence) {
    if (entry.subject.id !== activeSubject.id) continue;
    const kind = mapSourceKindToProvenanceKind(entry.sourceKind);
    const key = `${kind}\u0000${entry.sourceId ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    provenance.push(
      createRuntimeExecutiveAdvisorProvenance({
        kind,
        ...(entry.sourceId !== undefined ? { sourceId: entry.sourceId } : {}),
        reason: entry.sourceKind,
      }),
    );
  }
  return Object.freeze(provenance);
}

function filterActionAffordances(
  affordances: ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance>,
  activeSubject: RuntimeExecutiveAdvisorSubject | null,
): ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance> {
  if (affordances.length === 0) {
    return Object.freeze([]);
  }

  return normalizeRuntimeExecutiveAdvisorActionAffordances(
    affordances.map((affordance) => {
      if (
        activeSubject === null &&
        affordance.subjectId !== undefined
      ) {
        return Object.freeze({ ...affordance, enabled: false });
      }
      return affordance;
    }),
  );
}

function collectContextualSubjects(
  activeSubject: RuntimeExecutiveAdvisorSubject | null,
  candidates: ReadonlyArray<RuntimeExecutiveAdvisorSubjectCandidate>,
): ReadonlyArray<RuntimeExecutiveAdvisorSubject> {
  const contextual = candidates
    .filter(
      (candidate) =>
        activeSubject === null || candidate.subject.id !== activeSubject.id,
    )
    .map((candidate) => candidate.subject);

  return Object.freeze(contextual);
}

export function createRuntimeExecutiveAdvisorBindingResult(
  input: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorBindingResult {
  return normalizeRuntimeExecutiveAdvisorBindingResult(input);
}

export function normalizeRuntimeExecutiveAdvisorBindingResult(
  input: RuntimeExecutiveAdvisorBindingResult,
): RuntimeExecutiveAdvisorBindingResult {
  if (!isRuntimeExecutiveAdvisorBindingState(input.state)) {
    throw new TypeError("state must be a known Advisor binding state");
  }

  const context = normalizeRuntimeExecutiveAdvisorContext(input.context);
  const activeSubject =
    input.activeSubject === null
      ? null
      : normalizeRuntimeExecutiveAdvisorSubject(input.activeSubject);
  const contextualSubjects = Object.freeze(
    input.contextualSubjects.map((subject) =>
      normalizeRuntimeExecutiveAdvisorSubject(subject),
    ),
  );
  const candidates = normalizeRuntimeExecutiveAdvisorSubjectCandidates(
    input.candidates,
  );
  const evidence = Object.freeze(
    input.evidence.map((entry) =>
      normalizeRuntimeExecutiveAdvisorBindingEvidence(entry),
    ),
  );

  if (
    activeSubject !== null &&
    contextualSubjects.some((subject) => subject.id === activeSubject.id)
  ) {
    throw new TypeError(
      "active subject must not also appear as a contextual subject",
    );
  }

  return Object.freeze({
    state: input.state,
    context,
    activeSubject,
    contextualSubjects,
    candidates,
    evidence,
    isContextual: input.isContextual,
    isGuidanceReady: input.isGuidanceReady,
    bindingIdentity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    bindingVersion: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    foundationIdentity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveAdvisorExperienceFoundationVersion,
  });
}

/**
 * Primary REX-3:2 operation: bind runtime evidence into Advisor context.
 */
export function bindRuntimeExecutiveAdvisorContext(
  input: RuntimeExecutiveAdvisorBindingInput,
): RuntimeExecutiveAdvisorBindingResult {
  const normalizedInput = normalizeRuntimeExecutiveAdvisorBindingInput(input);
  const evidence = normalizedInput.evidence;
  const candidates = collectRuntimeExecutiveAdvisorSubjectCandidates(evidence);
  const winningCandidate = candidates[0] ?? null;
  const activeSubject = winningCandidate?.subject ?? null;
  const contextualSubjects = collectContextualSubjects(
    activeSubject,
    candidates,
  );

  const state = resolveBindingState({
    activeSubject,
    winningCandidate,
    contextualSubjects,
    evidence,
  });

  const stageRelationship = resolveRuntimeExecutiveAdvisorStageRelationship({
    activeSubject,
    evidence,
  });

  const engagement = resolveEngagement({
    activeSubject,
    candidates,
    contextualSubjects,
    state,
  });

  const intent = resolveGuidanceIntent(normalizedInput, evidence);
  const presentationState = resolvePresentationState(
    normalizedInput,
    evidence,
    activeSubject?.id ?? null,
  );
  const attention = resolveAttention(
    normalizedInput,
    evidence,
    activeSubject?.id ?? null,
  );
  const provenance = buildProvenance(activeSubject, evidence);
  const base = normalizedInput.baseContext ?? RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT;
  const actionAffordances = filterActionAffordances(
    base.actionAffordances,
    activeSubject,
  );

  const context = createRuntimeExecutiveAdvisorContext({
    subject: activeSubject,
    engagement,
    intent,
    attention,
    presentationState,
    informationDensity: base.informationDensity,
    confidence:
      state === "fully-bound" || state === "subject-bound"
        ? base.confidence === "unknown"
          ? "medium"
          : base.confidence
        : state === "context-bound"
          ? base.confidence === "unknown"
            ? "low"
            : base.confidence
          : "unknown",
    urgency: base.urgency,
    stageRelationship,
    provenance,
    actionAffordances,
  });

  const isContextual = isRuntimeExecutiveAdvisorContextual(context);
  const isGuidanceReady = isRuntimeExecutiveAdvisorGuidanceReady(context);

  return normalizeRuntimeExecutiveAdvisorBindingResult({
    state,
    context,
    activeSubject,
    contextualSubjects,
    candidates,
    evidence,
    isContextual,
    isGuidanceReady,
    bindingIdentity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    bindingVersion: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    foundationIdentity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveAdvisorExperienceFoundationVersion,
  });
}

export function createRuntimeExecutiveAdvisorBindingSnapshot(input: {
  readonly binding: RuntimeExecutiveAdvisorBindingResult;
}): RuntimeExecutiveAdvisorBindingSnapshot {
  const binding = normalizeRuntimeExecutiveAdvisorBindingResult(input.binding);
  return Object.freeze({
    binding,
    advisorSnapshot: createRuntimeExecutiveAdvisorSnapshot({
      context: binding.context,
    }),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorBindingEvidence(
  value: unknown,
): RuntimeExecutiveAdvisorBindingValidationResult {
  const issues: RuntimeExecutiveAdvisorBindingIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-evidence", "evidence must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorBindingSourceKind(value.sourceKind)) {
    issues.push(
      issue(
        "invalid-binding-source",
        "sourceKind is not an approved binding source",
        "sourceKind",
      ),
    );
  }

  if (!isPlainObject(value.subject)) {
    issues.push(issue("invalid-subject", "subject must be an object", "subject"));
  } else {
    if (!isNonEmptyString(value.subject.id)) {
      issues.push(
        issue("invalid-subject-id", "subject id must be non-empty", "subject.id"),
      );
    }
    try {
      normalizeRuntimeExecutiveAdvisorSubject(
        value.subject as unknown as RuntimeExecutiveAdvisorSubject,
      );
    } catch {
      issues.push(
        issue("invalid-subject", "subject failed foundation normalization", "subject"),
      );
    }
  }

  if (value.sourceId !== undefined && !isNonEmptyString(value.sourceId)) {
    issues.push(
      issue(
        "invalid-source-id",
        "sourceId must be a non-empty string when provided",
        "sourceId",
      ),
    );
  }
  if (
    value.relationship !== undefined &&
    !isRuntimeExecutiveAdvisorStageRelationship(value.relationship)
  ) {
    issues.push(
      issue(
        "invalid-relationship",
        "relationship is not approved",
        "relationship",
      ),
    );
  }
  if (
    value.attention !== undefined &&
    !isRuntimeExecutiveAdvisorAttentionLevel(value.attention)
  ) {
    issues.push(
      issue("invalid-attention", "attention is not approved", "attention"),
    );
  }
  if (
    value.presentationState !== undefined &&
    !isRuntimeExecutiveAdvisorPresentationState(value.presentationState)
  ) {
    issues.push(
      issue(
        "invalid-presentation-state",
        "presentationState is not approved",
        "presentationState",
      ),
    );
  }
  if (
    value.guidanceIntent !== undefined &&
    !isRuntimeExecutiveAdvisorGuidanceIntent(value.guidanceIntent)
  ) {
    issues.push(
      issue(
        "invalid-guidance-intent",
        "guidanceIntent is not approved",
        "guidanceIntent",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAdvisorBindingResult(
  value: unknown,
): RuntimeExecutiveAdvisorBindingValidationResult {
  const issues: RuntimeExecutiveAdvisorBindingIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-binding-result", "binding result must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorBindingState(value.state)) {
    issues.push(
      issue("invalid-binding-state", "binding state is not approved", "state"),
    );
  }

  const contextResult = validateRuntimeExecutiveAdvisorContext(value.context);
  for (const entry of contextResult.issues) {
    issues.push(
      issue(
        entry.code,
        entry.message,
        entry.path ? `context.${entry.path}` : "context",
      ),
    );
  }

  if (!Array.isArray(value.evidence)) {
    issues.push(
      issue("invalid-evidence", "evidence must be an array", "evidence"),
    );
  } else {
    value.evidence.forEach((entry, index) => {
      const result = validateRuntimeExecutiveAdvisorBindingEvidence(entry);
      for (const item of result.issues) {
        issues.push(
          issue(
            item.code,
            item.message,
            item.path
              ? `evidence[${index}].${item.path}`
              : `evidence[${index}]`,
          ),
        );
      }
    });
  }

  if (!Array.isArray(value.candidates)) {
    issues.push(
      issue("invalid-candidates", "candidates must be an array", "candidates"),
    );
  } else {
    value.candidates.forEach((candidate, index) => {
      if (!isPlainObject(candidate)) {
        issues.push(
          issue(
            "invalid-candidate",
            "candidate must be an object",
            `candidates[${index}]`,
          ),
        );
        return;
      }
      if (typeof candidate.precedence !== "number") {
        issues.push(
          issue(
            "invalid-precedence",
            "candidate precedence must be a number",
            `candidates[${index}].precedence`,
          ),
        );
      }
      if (!isRuntimeExecutiveAdvisorBindingSourceKind(candidate.sourceKind)) {
        issues.push(
          issue(
            "invalid-candidate-source",
            "candidate sourceKind is not approved",
            `candidates[${index}].sourceKind`,
          ),
        );
      }
    });
  }

  if (!Array.isArray(value.contextualSubjects)) {
    issues.push(
      issue(
        "invalid-contextual-subjects",
        "contextualSubjects must be an array",
        "contextualSubjects",
      ),
    );
  }

  const activeSubjectId =
    isPlainObject(value.activeSubject) &&
    isNonEmptyString(value.activeSubject.id)
      ? value.activeSubject.id
      : null;

  if (
    activeSubjectId !== null &&
    Array.isArray(value.contextualSubjects) &&
    value.contextualSubjects.some(
      (subject) => isPlainObject(subject) && subject.id === activeSubjectId,
    )
  ) {
    issues.push(
      issue(
        "duplicate-active-contextual-subject",
        "active subject must not appear in contextualSubjects",
        "contextualSubjects",
      ),
    );
  }

  if (isPlainObject(value.context) && contextResult.ok) {
    const boundContext =
      value.context as unknown as RuntimeExecutiveAdvisorContext;
    if (
      typeof value.isContextual === "boolean" &&
      value.isContextual !== isRuntimeExecutiveAdvisorContextual(boundContext)
    ) {
      issues.push(
        issue(
          "inconsistent-is-contextual",
          "isContextual must match foundation contextual-awareness",
          "isContextual",
        ),
      );
    }
    if (
      typeof value.isGuidanceReady === "boolean" &&
      value.isGuidanceReady !==
        isRuntimeExecutiveAdvisorGuidanceReady(boundContext)
    ) {
      issues.push(
        issue(
          "inconsistent-is-guidance-ready",
          "isGuidanceReady must match foundation guidance-readiness",
          "isGuidanceReady",
        ),
      );
    }

    if (
      boundContext.subject !== null &&
      activeSubjectId !== null &&
      boundContext.subject.id !== activeSubjectId
    ) {
      issues.push(
        issue(
          "inconsistent-active-subject",
          "activeSubject must match context.subject",
          "activeSubject",
        ),
      );
    }
  }

  if (
    value.bindingIdentity !==
      runtimeExecutiveAdvisorContextSubjectBindingIdentity ||
    value.bindingVersion !==
      runtimeExecutiveAdvisorContextSubjectBindingVersion
  ) {
    issues.push(
      issue(
        "invalid-binding-metadata",
        "binding identity/version metadata is invalid",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorContextSubjectBindingIdentity():
  typeof runtimeExecutiveAdvisorContextSubjectBindingCanonicalIdentity {
  return runtimeExecutiveAdvisorContextSubjectBindingCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorContextSubjectBindingApiNames =
  Object.freeze([
    "createRuntimeExecutiveAdvisorBindingEvidence",
    "collectRuntimeExecutiveAdvisorSubjectCandidates",
    "resolveRuntimeExecutiveAdvisorSubject",
    "resolveRuntimeExecutiveAdvisorStageRelationship",
    "bindRuntimeExecutiveAdvisorContext",
    "createRuntimeExecutiveAdvisorBindingResult",
    "createRuntimeExecutiveAdvisorBindingSnapshot",
    "normalizeRuntimeExecutiveAdvisorBindingEvidence",
    "normalizeRuntimeExecutiveAdvisorBindingInput",
    "normalizeRuntimeExecutiveAdvisorSubjectCandidates",
    "normalizeRuntimeExecutiveAdvisorBindingResult",
    "getRuntimeExecutiveAdvisorBindingPrecedence",
    "isRuntimeExecutiveAdvisorBindingSourceKind",
    "isRuntimeExecutiveAdvisorBindingState",
    "isRuntimeExecutiveAdvisorBindingCapability",
    "isRuntimeExecutiveAdvisorSubjectBound",
    "isRuntimeExecutiveAdvisorContextBound",
    "validateRuntimeExecutiveAdvisorBindingEvidence",
    "validateRuntimeExecutiveAdvisorBindingResult",
    "verifyRuntimeExecutiveAdvisorContextSubjectBinding",
    "getRuntimeExecutiveAdvisorContextSubjectBindingIdentity",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorBindingSourceKind",
    "RuntimeExecutiveAdvisorBindingState",
    "RuntimeExecutiveAdvisorBindingPrecedenceRule",
    "RuntimeExecutiveAdvisorStrongBindingSource",
    "RuntimeExecutiveAdvisorBindingCapability",
    "RuntimeExecutiveAdvisorBindingRegistrySection",
    "RuntimeExecutiveAdvisorBindingEvidence",
    "RuntimeExecutiveAdvisorSubjectCandidate",
    "RuntimeExecutiveAdvisorBindingInput",
    "RuntimeExecutiveAdvisorBindingResult",
    "RuntimeExecutiveAdvisorBindingSnapshot",
    "RuntimeExecutiveAdvisorBindingIssue",
    "RuntimeExecutiveAdvisorBindingValidationResult",
    "RuntimeExecutiveAdvisorBindingInvariant",
    "RuntimeExecutiveAdvisorContextSubjectBindingVerification",
  ] as const);

export const runtimeExecutiveAdvisorContextSubjectBindingRegistry =
  Object.freeze({
    identity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    version: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    namespace: runtimeExecutiveAdvisorContextSubjectBindingNamespace,
    layer: runtimeExecutiveAdvisorContextSubjectBindingLayer,
    domain: runtimeExecutiveAdvisorContextSubjectBindingDomain,
    phase: runtimeExecutiveAdvisorContextSubjectBindingPhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorContextSubjectBindingDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS.length,
    bindingSources: RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS,
    bindingSourceCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS.length,
    bindingStates: RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES,
    bindingStateCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES.length,
    precedenceRules: RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES,
    precedenceRuleCount:
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES.length,
    capabilities: RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES.length,
    invariants: RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveAdvisorContextSubjectBindingApiNames,
    publicApiCount:
      runtimeExecutiveAdvisorContextSubjectBindingApiNames.length,
  });

export const runtimeExecutiveAdvisorContextSubjectBinding = Object.freeze({
  phase: "ContextSubjectBinding" as const,
  name: "RuntimeExecutiveAdvisorContextSubjectBinding" as const,
  identity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
  version: runtimeExecutiveAdvisorContextSubjectBindingVersion,
  namespace: runtimeExecutiveAdvisorContextSubjectBindingNamespace,
  layer: runtimeExecutiveAdvisorContextSubjectBindingLayer,
  domain: runtimeExecutiveAdvisorContextSubjectBindingDomain,
  architecturalRole:
    runtimeExecutiveAdvisorContextSubjectBindingArchitecturalRole,
  role: "ContextSubjectBinding" as const,
  status: runtimeExecutiveAdvisorContextSubjectBindingStability,
  upstreamDependency:
    runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity,
  dependencyPath:
    runtimeExecutiveAdvisorContextSubjectBindingDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorContextSubjectBindingSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorContextSubjectBindingDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_BINDING_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_RESPONSIBILITY_SEPARATION,
  bindingSources: RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS,
  bindingStates: RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES,
  precedenceRules: RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorContextSubjectBindingApiNames,
  registry: runtimeExecutiveAdvisorContextSubjectBindingRegistry,
  foundationBoundary: "REX-3:1-foundation-only" as const,
  architecturalStatus:
    "REX-3:2 Binding Complete — Ready for REX-3:3 Advisor Runtime Response Model" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorContextSubjectBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorContextSubjectBindingIdentity;
  readonly version: typeof runtimeExecutiveAdvisorContextSubjectBindingVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorContextSubjectBindingNamespace;
  readonly layer: typeof runtimeExecutiveAdvisorContextSubjectBindingLayer;
  readonly domain: typeof runtimeExecutiveAdvisorContextSubjectBindingDomain;
  readonly phase: typeof runtimeExecutiveAdvisorContextSubjectBindingPhase;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity;
  readonly bindingSourceCount: number;
  readonly bindingStateCount: number;
  readonly precedenceRuleCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly selectionOutranksFocus: boolean;
  readonly attentionDoesNotOverrideSelection: boolean;
  readonly foundationOk: boolean;
  readonly noStageMutation: boolean;
  readonly noAi: boolean;
}

export function verifyRuntimeExecutiveAdvisorContextSubjectBinding():
  RuntimeExecutiveAdvisorContextSubjectBindingVerification {
  const module = runtimeExecutiveAdvisorContextSubjectBinding;
  const registry = runtimeExecutiveAdvisorContextSubjectBindingRegistry;
  const foundation = verifyRuntimeExecutiveAdvisorExperienceFoundation();

  const identityOk =
    module.identity ===
      "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding" &&
    module.version === "3.2.0" &&
    module.namespace ===
      "nexora.rex.advisor-experience.context-subject-binding" &&
    module.layer === "RuntimeExecutiveExperience" &&
    module.domain === "ExecutiveAdvisor" &&
    module.phase === "ContextSubjectBinding" &&
    module.upstreamDependency ===
      "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation" &&
    module.foundationBoundary === "REX-3:1-foundation-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS], [
      "explicit-manager-intent",
      "stage-selection",
      "stage-focus",
      "interaction",
      "attention",
      "scene",
      "presentation",
      "runtime-context",
      "related-subject",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES], [
      "unbound",
      "context-bound",
      "subject-bound",
      "fully-bound",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "BindingSources",
        "BindingStates",
        "Precedence",
        "Resolvers",
        "Normalization",
        "Validation",
        "Capabilities",
        "Compatibility",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES.every(
      (rule, index) => rule.order === index + 1,
    );

  const factory = createRuntimeExecutiveAdvisorSubject({
    id: "object.factory",
    kind: "nexora-object",
    label: "Factory",
  });
  const delivery = createRuntimeExecutiveAdvisorSubject({
    id: "object.delivery",
    kind: "nexora-object",
    label: "Delivery",
  });

  const selectionVsFocus = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-focus",
        subject: delivery,
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory,
      }),
    ],
  });
  const selectionOutranksFocus =
    selectionVsFocus.activeSubject?.id === "object.factory";

  const attentionVsSelection = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory,
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "attention",
        subject: delivery,
        attention: "critical",
      }),
    ],
  });
  const attentionDoesNotOverrideSelection =
    attentionVsSelection.activeSubject?.id === "object.factory" &&
    attentionVsSelection.contextualSubjects.some(
      (subject) => subject.id === "object.delivery",
    );

  const registryCountsOk =
    registry.bindingSourceCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS.length &&
    registry.bindingStateCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES.length &&
    registry.precedenceRuleCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES.length &&
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveAdvisorContextSubjectBindingApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES.length;

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeExecutiveAdvisorContextSubjectBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_BINDING_BOUNDARY);

  const foundationBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation" &&
    module.boundary.consumesFoundationOnly === true &&
    module.boundary.importsRex2Directly === false &&
    module.boundary.importsRex1Directly === false &&
    module.boundary.importsExDriDirectly === false &&
    module.boundary.importsDriDirectly === false &&
    module.boundary.importsNolDirectly === false;

  const empty = bindRuntimeExecutiveAdvisorContext({ evidence: [] });
  const emptyOk =
    empty.state === "unbound" &&
    empty.activeSubject === null &&
    empty.contextualSubjects.length === 0 &&
    empty.context.engagement === "idle" &&
    empty.isContextual === false &&
    empty.isGuidanceReady === false;

  const ok =
    identityOk &&
    vocabOk &&
    selectionOutranksFocus &&
    attentionDoesNotOverrideSelection &&
    registryCountsOk &&
    frozen &&
    foundationBoundaryIntact &&
    emptyOk &&
    foundation.ok === true &&
    module.boundary.mutatesStageState === false &&
    module.boundary.generatesAdvice === false &&
    module.boundary.aiProviderIndependent === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorContextSubjectBindingIdentity,
    version: runtimeExecutiveAdvisorContextSubjectBindingVersion,
    namespace: runtimeExecutiveAdvisorContextSubjectBindingNamespace,
    layer: runtimeExecutiveAdvisorContextSubjectBindingLayer,
    domain: runtimeExecutiveAdvisorContextSubjectBindingDomain,
    phase: runtimeExecutiveAdvisorContextSubjectBindingPhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorContextSubjectBindingDependencyIdentity,
    bindingSourceCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS.length,
    bindingStateCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES.length,
    precedenceRuleCount:
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES.length,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES.length,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveAdvisorContextSubjectBindingApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_BINDING_INVARIANTS.length,
    frozen,
    foundationBoundaryIntact,
    selectionOutranksFocus,
    attentionDoesNotOverrideSelection,
    foundationOk: foundation.ok === true,
    noStageMutation: module.boundary.mutatesStageState === false,
    noAi: module.boundary.generatesAdvice === false,
  });
}

// ─── Additive foundation publication for REX-3:3+ consumers ─────────────────
// Re-exports only. Binding behavior is unchanged.

export {
  createRuntimeExecutiveAdvisorSubject,
  isRuntimeExecutiveAdvisorConfidence,
  isRuntimeExecutiveAdvisorSubjectKind,
  isRuntimeExecutiveAdvisorUrgency,
};

export type {
  RuntimeExecutiveAdvisorAttentionLevel,
  RuntimeExecutiveAdvisorConfidence,
  RuntimeExecutiveAdvisorContext,
  RuntimeExecutiveAdvisorEngagementState,
  RuntimeExecutiveAdvisorGuidanceIntent,
  RuntimeExecutiveAdvisorPresentationState,
  RuntimeExecutiveAdvisorProvenance,
  RuntimeExecutiveAdvisorSubject,
  RuntimeExecutiveAdvisorSubjectKind,
  RuntimeExecutiveAdvisorUrgency,
};
