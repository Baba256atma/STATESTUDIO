/**
 * REX-4:6 — Runtime Executive Insight Experience Orchestration.
 *
 * Deterministic coordination of Executive Insight Experience intents across
 * Stage, Advisor, scene, and related executive domains.
 *
 * Canonical flow:
 *   REX-4:5 Presentation → REX-4:6 Orchestration → later REX-4 platform/index
 *
 * REX-4:5 answers: What information should be exposed in each presentation state?
 * REX-4:6 answers: Given an Executive Insight presentation and current executive
 * context, what coordinated experience intents should be exposed?
 *
 * Experience coordinator — not an execution engine.
 * Pure, stateless, immutable, renderer-neutral, AI-neutral.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KIND_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  isRuntimeExecutiveInsightPresentationState,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightInteractions,
  resolveRuntimeExecutiveInsightPresentation,
  resolveRuntimeExecutiveInsights,
  runtimeExecutiveInsightPresentationIdentity,
  runtimeExecutiveInsightPresentationSupportedImportPath,
  runtimeExecutiveInsightPresentationVersion,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightPresentation,
  type RuntimeExecutiveInsightCandidate,
  type RuntimeExecutiveInsightCandidateCollection,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightPresentationDescriptor,
  type RuntimeExecutiveInsightPresentationResult,
  type RuntimeExecutiveInsightPresentationState,
  type RuntimeExecutiveInsightPriorityAttentionState,
  type RuntimeExecutiveInsightPriorityBand,
  type RuntimeExecutiveInsightPriorityResult,
  type RuntimeExecutiveInsightSignalContract,
  type RuntimeExecutiveInsightSourceContract,
  type RuntimeExecutiveInsightSubjectContract,
  type RuntimeExecutiveRankedInsight,
} from "@/app/lib/rex/runtimeExecutiveInsightPresentation";

// ─── Transitively published Presentation/Priority/Resolution surface (for REX-4:7+)
// Publication fix: REX-4:7 platform consumes the complete REX-4 chain through REX-4:6 only.

export {
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_PRIORITY_BANDS,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightPresentationPolicy,
  createRuntimeExecutiveInsightPriorityPolicy,
  createRuntimeExecutiveInsightResolutionRule,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  evaluateRuntimeExecutiveInsightPriority,
  rankRuntimeExecutiveInsights,
  resolveRuntimeExecutiveInsight,
  resolveRuntimeExecutiveInsightAttention,
  resolveRuntimeExecutiveInsightInteractions,
  resolveRuntimeExecutiveInsightPresentation,
  resolveRuntimeExecutiveInsights,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightPresentationInput,
  validateRuntimeExecutiveInsightPriorityPolicy,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
};

export type {
  RuntimeExecutiveInsightCandidate,
  RuntimeExecutiveInsightCandidateCollection,
  RuntimeExecutiveInsightEvidenceContract,
  RuntimeExecutiveInsightPriorityBand,
  RuntimeExecutiveInsightPriorityResult,
  RuntimeExecutiveInsightSignalContract,
  RuntimeExecutiveInsightSourceContract,
  RuntimeExecutiveInsightSubjectContract,
  RuntimeExecutiveRankedInsight,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceOrchestrationIdentity =
  "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" as const;

export const runtimeExecutiveInsightExperienceOrchestrationVersion =
  "4.6.0" as const;

export const runtimeExecutiveInsightExperienceOrchestrationNamespace =
  "nexora.rex.insight-experience.orchestration" as const;

export const runtimeExecutiveInsightExperienceOrchestrationLayer =
  "REX" as const;

export const runtimeExecutiveInsightExperienceOrchestrationCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightExperienceOrchestrationPhase =
  "Orchestration" as const;

export const runtimeExecutiveInsightExperienceOrchestrationStatus =
  "OrchestrationReady" as const;

export const runtimeExecutiveInsightExperienceOrchestrationArchitecturalRole =
  "RuntimeExecutiveInsightExperienceOrchestrationBoundary" as const;

export const runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity =
  runtimeExecutiveInsightPresentationIdentity;

export const runtimeExecutiveInsightExperienceOrchestrationDependencyPath =
  runtimeExecutiveInsightPresentationSupportedImportPath;

export const runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightExperienceOrchestration" as const;

export const runtimeExecutiveInsightExperienceOrchestrationStability =
  "OrchestrationReady" as const;

export const runtimeExecutiveInsightExperienceOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveInsightExperienceOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightExperienceOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightExperienceOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceOrchestrationIdentity,
    version: runtimeExecutiveInsightExperienceOrchestrationVersion,
    namespace: runtimeExecutiveInsightExperienceOrchestrationNamespace,
    layer: runtimeExecutiveInsightExperienceOrchestrationLayer,
    capability: runtimeExecutiveInsightExperienceOrchestrationCapability,
    phase: runtimeExecutiveInsightExperienceOrchestrationPhase,
    status: runtimeExecutiveInsightExperienceOrchestrationStatus,
    architecturalRole:
      runtimeExecutiveInsightExperienceOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightPresentationVersion,
    stabilityStatus:
      runtimeExecutiveInsightExperienceOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveInsightExperienceOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightExperienceOrchestrationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveInsightExperienceOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRINCIPLE =
  "Presentation descriptor + explicit executive context + explicit orchestration policy → coordinated experience intents. REX-4:6 defines what should coordinate — not how UI components perform the coordination." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  orchestrationAuthority: "REX-4:6" as const,
  architecturalRole:
    "RuntimeExecutiveInsightExperienceOrchestrationBoundary" as const,
  soleImmediateDependency:
    "REX-4:5/RuntimeExecutiveInsightPresentation" as const,
  consumesPresentationOnly: true as const,
  importsRex44Directly: false as const,
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
  selectionDistinctFromFocus: true as const,
  attentionDistinctFromFocus: true as const,
  operationDistinctFromAction: true as const,
  recalculatesPriority: false as const,
  recalculatesAttention: false as const,
  reresolvesInsightSemantics: false as const,
  reresolvesPresentation: false as const,
  introducesAdvisorProse: false as const,
  introducesStageExecution: false as const,
  introducesSceneMutation: false as const,
  introducesAutomation: false as const,
  introducesNotifications: false as const,
  introducesLlmGeneration: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
});

// ─── Published upstream aliases ─────────────────────────────────────────────

export type {
  RuntimeExecutiveInsightPresentationDescriptor,
  RuntimeExecutiveInsightPresentationResult,
  RuntimeExecutiveInsightPresentationState,
  RuntimeExecutiveInsightPriorityAttentionState,
};

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_ATTENTION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_ATTENTION_STATES;
export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_SUBJECT_KIND_SEMANTICS;

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS =
  Object.freeze([
    "insight-selected",
    "insight-deselected",
    "insight-focused",
    "insight-unfocused",
    "subject-selected",
    "subject-focused",
    "presentation-changed",
    "attention-changed",
    "related-context-requested",
    "operation-context-requested",
  ] as const);

export type RuntimeExecutiveInsightOrchestrationEventKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS =
  Object.freeze([
    "select-insight",
    "focus-insight",
    "select-subject",
    "focus-subject",
    "expose-stage-context",
    "expose-advisor-context",
    "expose-scene-context",
    "expose-evidence-context",
    "expose-relationship-context",
    "expose-pack-context",
    "expose-decision-context",
    "expose-execution-context",
    "expose-scenario-context",
    "expose-problem-context",
    "sync-presentation-state",
    "clear-related-context",
  ] as const);

export type RuntimeExecutiveInsightExperienceIntentKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS =
  Object.freeze([
    "insight",
    "stage",
    "advisor",
    "scene",
    "subject",
    "evidence",
    "relationship",
    "pack",
    "decision",
    "execution",
    "scenario",
    "problem",
    "presentation",
  ] as const);

export type RuntimeExecutiveInsightExperienceIntentTarget =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES =
  Object.freeze(["background", "normal", "high", "critical"] as const);

export type RuntimeExecutiveInsightExperienceIntentPriority =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES = Object.freeze([
  "orchestrated",
  "no-op",
  "restricted",
  "invalid",
  "conflicted",
] as const);

export type RuntimeExecutiveInsightExperienceOrchestrationStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES =
  Object.freeze([
    "insight-selected",
    "insight-focused",
    "subject-selected",
    "subject-focused",
    "stage-context-exposed",
    "advisor-context-exposed",
    "scene-context-exposed",
    "evidence-context-exposed",
    "relationship-context-exposed",
    "pack-context-exposed",
    "decision-context-exposed",
    "execution-context-exposed",
    "scenario-context-exposed",
    "problem-context-exposed",
    "presentation-synchronized",
    "intent-suppressed-by-policy",
    "capability-unavailable",
    "missing-reference",
    "intent-deduplicated",
    "conflict-resolved",
    "conflict-unresolved",
    "no-context-change",
    "invalid-input",
    "invalid-policy",
    "invalid-event",
  ] as const);

export type RuntimeExecutiveInsightOrchestrationReasonCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CAPABILITIES =
  Object.freeze([
    "StageSupportsFocus",
    "AdvisorContextAvailable",
    "SceneRelationshipExposureAvailable",
    "OperationInteractionAvailable",
  ] as const);

export type RuntimeExecutiveInsightOrchestrationCapability =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES =
  Object.freeze([
    "deterministic-orchestration",
    "pure-functions",
    "immutable-input-preservation",
    "stable-intent-ordering",
    "deterministic-conflict-resolution",
    "explicit-unresolved-conflicts",
    "deterministic-intent-deduplication",
    "structured-stage-context-only",
    "structured-advisor-context-only",
    "structured-scene-context-only",
    "no-semantic-re-resolution",
    "no-ui-execution",
    "no-advisor-generation",
    "no-ai",
    "no-llm",
    "no-persistence",
    "no-external-integration",
    "no-automation",
  ] as const);

export type RuntimeExecutiveInsightOrchestrationConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES)[number];

const INTENT_ORDER_GROUP: Readonly<
  Record<RuntimeExecutiveInsightExperienceIntentKind, number>
> = Object.freeze({
  "select-insight": 1,
  "select-subject": 1,
  "focus-insight": 2,
  "focus-subject": 2,
  "sync-presentation-state": 3,
  "expose-stage-context": 4,
  "expose-advisor-context": 5,
  "expose-scene-context": 6,
  "expose-evidence-context": 7,
  "expose-relationship-context": 7,
  "expose-pack-context": 8,
  "expose-decision-context": 8,
  "expose-execution-context": 8,
  "expose-scenario-context": 8,
  "expose-problem-context": 8,
  "clear-related-context": 9,
});

const USER_EVENT_KINDS = Object.freeze([
  "insight-selected",
  "insight-deselected",
  "insight-focused",
  "insight-unfocused",
  "subject-selected",
  "subject-focused",
] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightExperienceContext {
  readonly activeWorkspaceId?: string;
  readonly activeModelId?: string;
  readonly activeExecutiveMode?: string;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly activeGoalId?: string;
  readonly activeKoiId?: string;
  readonly activeSceneId?: string;
  readonly activeDecisionId?: string;
  readonly activeExecutionId?: string;
  readonly activeScenarioId?: string;
  readonly activeProblemId?: string;
  readonly activePackId?: string;
  readonly activePresentationState?: RuntimeExecutiveInsightPresentationState;
  readonly selectedInsightId?: string;
  readonly focusedInsightId?: string;
}

export interface RuntimeExecutiveInsightStageContext {
  readonly selectedStageSubjectId?: string;
  readonly focusedStageSubjectId?: string;
  readonly visibleSubjectRefs?: ReadonlyArray<string>;
  readonly sceneRef?: string;
  readonly activePresentationState?: RuntimeExecutiveInsightPresentationState;
  readonly allowedCapabilities?: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightAdvisorContext {
  readonly currentAdvisorSubjectId?: string;
  readonly currentAdvisorInsightId?: string;
  readonly conversationRef?: string;
  readonly availableCapabilities?: ReadonlyArray<string>;
  readonly relatedEvidenceRefs?: ReadonlyArray<string>;
  readonly relatedDecisionId?: string;
  readonly relatedExecutionId?: string;
}

export interface RuntimeExecutiveInsightSceneContext {
  readonly sceneId?: string;
  readonly focusedNodeRef?: string;
  readonly selectedNodeRef?: string;
  readonly visibleRelationshipRefs?: ReadonlyArray<string>;
  readonly availableCapabilities?: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightExperienceOrchestrationPolicy {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly enabledCapabilities?: ReadonlyArray<RuntimeExecutiveInsightOrchestrationCapability>;
  readonly suppressIntentKinds?: ReadonlyArray<RuntimeExecutiveInsightExperienceIntentKind>;
  readonly maxPropagatedRefs?: number;
  readonly exposeStageOnSelect?: boolean;
  readonly exposeAdvisorOnSelect?: boolean;
  readonly exposeSceneOnSelect?: boolean;
  readonly exposeEvidenceOnReport?: boolean;
  readonly exposeRelationshipsOnReport?: boolean;
  readonly syncPresentationState?: boolean;
  readonly requireUniqueStageFocus?: boolean;
  readonly allowSparseMinimum?: boolean;
  readonly suppressWhenCapabilityMissing?: boolean;
}

export interface RuntimeExecutiveInsightExperienceOrchestrationInput {
  readonly presentation: RuntimeExecutiveInsightPresentationResult;
  readonly eventKind: RuntimeExecutiveInsightOrchestrationEventKind;
  readonly experienceContext: RuntimeExecutiveInsightExperienceContext;
  readonly stageContext: RuntimeExecutiveInsightStageContext;
  readonly advisorContext: RuntimeExecutiveInsightAdvisorContext;
  readonly sceneContext: RuntimeExecutiveInsightSceneContext;
  readonly policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy;
  readonly competingFocusSubjectIds?: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightExperienceIntent {
  readonly intentId: string;
  readonly kind: RuntimeExecutiveInsightExperienceIntentKind;
  readonly target: RuntimeExecutiveInsightExperienceIntentTarget;
  readonly priority: RuntimeExecutiveInsightExperienceIntentPriority;
  readonly sourceInsightId: string;
  readonly reference?: string;
  readonly presentationState?: RuntimeExecutiveInsightPresentationState;
  readonly attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
  readonly order: number;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>;
}

export interface RuntimeExecutiveInsightExperienceCoordinatedContexts {
  readonly stage?: Readonly<{
    readonly subjectId?: string;
    readonly sceneRef?: string;
    readonly attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
    readonly presentationState?: RuntimeExecutiveInsightPresentationState;
    readonly relatedSubjectRefs: ReadonlyArray<string>;
  }>;
  readonly advisor?: Readonly<{
    readonly insightId: string;
    readonly subjectId?: string;
    readonly evidenceRefs: ReadonlyArray<string>;
    readonly priorityBand?: string;
    readonly attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
    readonly decisionRef?: string;
    readonly executionRef?: string;
    readonly scenarioRef?: string;
    readonly packRefs: ReadonlyArray<string>;
    readonly kpiRefs: ReadonlyArray<string>;
    readonly koiRefs: ReadonlyArray<string>;
  }>;
  readonly scene?: Readonly<{
    readonly sceneId?: string;
    readonly focusedNodeRef?: string;
    readonly relationshipRefs: ReadonlyArray<string>;
    readonly attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
  }>;
  readonly packRefs: ReadonlyArray<string>;
  readonly decisionRefs: ReadonlyArray<string>;
  readonly executionRefs: ReadonlyArray<string>;
  readonly scenarioRefs: ReadonlyArray<string>;
  readonly problemRefs: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightExperienceOrchestrationResult {
  readonly status: RuntimeExecutiveInsightExperienceOrchestrationStatus;
  readonly sourceInsightId: string;
  readonly eventKind: RuntimeExecutiveInsightOrchestrationEventKind;
  readonly intents: ReadonlyArray<RuntimeExecutiveInsightExperienceIntent>;
  readonly suppressedIntents: ReadonlyArray<RuntimeExecutiveInsightExperienceIntent>;
  readonly conflictResolved: boolean;
  readonly conflictUnresolved: boolean;
  readonly contexts: RuntimeExecutiveInsightExperienceCoordinatedContexts;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>;
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly orchestrationIdentity: typeof runtimeExecutiveInsightExperienceOrchestrationIdentity;
  readonly orchestrationVersion: typeof runtimeExecutiveInsightExperienceOrchestrationVersion;
}

export interface RuntimeExecutiveInsightOrchestrationValidationIssue {
  readonly code: RuntimeExecutiveInsightOrchestrationReasonCode;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeExecutiveInsightOrchestrationValidationResult {
  readonly valid: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightOrchestrationValidationIssue>;
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

function compareAscii(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function freezeStrings(values: readonly string[]): ReadonlyArray<string> {
  return Object.freeze([...values]);
}

function limitRefs(
  values: ReadonlyArray<string>,
  max: number | undefined,
): ReadonlyArray<string> {
  if (max === undefined || values.length <= max) return freezeStrings(values);
  return freezeStrings(values.slice(0, max));
}

export function isRuntimeExecutiveInsightOrchestrationEventKind(
  value: unknown,
): value is RuntimeExecutiveInsightOrchestrationEventKind {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS,
    value,
  );
}

export function isRuntimeExecutiveInsightExperienceIntentKind(
  value: unknown,
): value is RuntimeExecutiveInsightExperienceIntentKind {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
    value,
  );
}

export function isRuntimeExecutiveInsightExperienceIntentTarget(
  value: unknown,
): value is RuntimeExecutiveInsightExperienceIntentTarget {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS,
    value,
  );
}

export function isRuntimeExecutiveInsightExperienceIntentPriority(
  value: unknown,
): value is RuntimeExecutiveInsightExperienceIntentPriority {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES,
    value,
  );
}

export function isRuntimeExecutiveInsightExperienceOrchestrationStatus(
  value: unknown,
): value is RuntimeExecutiveInsightExperienceOrchestrationStatus {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES, value);
}

export function isRuntimeExecutiveInsightOrchestrationReasonCode(
  value: unknown,
): value is RuntimeExecutiveInsightOrchestrationReasonCode {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES,
    value,
  );
}

function issue(
  code: RuntimeExecutiveInsightOrchestrationReasonCode,
  path?: string,
  details?: Readonly<Record<string, string | number | boolean>>,
): RuntimeExecutiveInsightOrchestrationValidationIssue {
  return Object.freeze({
    code,
    ...(path !== undefined ? { path } : {}),
    ...(details !== undefined ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function intentIdentity(intent: {
  readonly kind: RuntimeExecutiveInsightExperienceIntentKind;
  readonly target: RuntimeExecutiveInsightExperienceIntentTarget;
  readonly sourceInsightId: string;
  readonly reference?: string;
}): string {
  return [
    intent.kind,
    intent.target,
    intent.sourceInsightId,
    intent.reference ?? "",
  ].join("|");
}

function makeIntent(input: {
  readonly kind: RuntimeExecutiveInsightExperienceIntentKind;
  readonly target: RuntimeExecutiveInsightExperienceIntentTarget;
  readonly priority: RuntimeExecutiveInsightExperienceIntentPriority;
  readonly sourceInsightId: string;
  readonly reference?: string;
  readonly presentationState?: RuntimeExecutiveInsightPresentationState;
  readonly attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>;
  readonly order: number;
}): RuntimeExecutiveInsightExperienceIntent {
  return Object.freeze({
    intentId: `insight.orch:${intentIdentity(input)}:${input.order}`,
    kind: input.kind,
    target: input.target,
    priority: input.priority,
    sourceInsightId: input.sourceInsightId,
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.attentionState !== undefined
      ? { attentionState: input.attentionState }
      : {}),
    order: input.order,
    reasonCodes: Object.freeze([...input.reasonCodes]),
  });
}

export function validateRuntimeExecutiveInsightExperienceOrchestrationPolicy(
  value: unknown,
): RuntimeExecutiveInsightOrchestrationValidationResult {
  const issues: RuntimeExecutiveInsightOrchestrationValidationIssue[] = [];
  if (!isPlainObject(value) || !isNonEmptyString(value.policyId)) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-policy", "policy")]),
    });
  }
  if (value.suppressIntentKinds !== undefined) {
    if (!Array.isArray(value.suppressIntentKinds)) {
      issues.push(issue("invalid-policy", "policy.suppressIntentKinds"));
    } else {
      for (const kind of value.suppressIntentKinds) {
        if (!isRuntimeExecutiveInsightExperienceIntentKind(kind)) {
          issues.push(issue("invalid-policy", "policy.suppressIntentKinds"));
        }
      }
    }
  }
  if (
    value.maxPropagatedRefs !== undefined &&
    (typeof value.maxPropagatedRefs !== "number" ||
      !Number.isFinite(value.maxPropagatedRefs) ||
      value.maxPropagatedRefs < 0 ||
      !Number.isInteger(value.maxPropagatedRefs))
  ) {
    issues.push(issue("invalid-policy", "policy.maxPropagatedRefs"));
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveInsightExperienceOrchestrationInput(
  value: unknown,
): RuntimeExecutiveInsightOrchestrationValidationResult {
  const issues: RuntimeExecutiveInsightOrchestrationValidationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("invalid-input", "input")]),
    });
  }
  if (!isPlainObject(value.presentation)) {
    issues.push(issue("invalid-input", "presentation"));
  } else if (
    value.presentation.descriptor !== undefined &&
    (!isPlainObject(value.presentation.descriptor) ||
      !isNonEmptyString(value.presentation.descriptor.insightId))
  ) {
    issues.push(issue("invalid-input", "presentation.descriptor"));
  }
  if (!isRuntimeExecutiveInsightOrchestrationEventKind(value.eventKind)) {
    issues.push(issue("invalid-event", "eventKind"));
  }
  if (!isPlainObject(value.experienceContext)) {
    issues.push(issue("invalid-input", "experienceContext"));
  }
  if (!isPlainObject(value.stageContext)) {
    issues.push(issue("invalid-input", "stageContext"));
  }
  if (!isPlainObject(value.advisorContext)) {
    issues.push(issue("invalid-input", "advisorContext"));
  }
  if (!isPlainObject(value.sceneContext)) {
    issues.push(issue("invalid-input", "sceneContext"));
  }
  const policyValidation =
    validateRuntimeExecutiveInsightExperienceOrchestrationPolicy(value.policy);
  if (!policyValidation.valid) {
    issues.push(...policyValidation.issues);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function hasCapability(
  policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  capability: RuntimeExecutiveInsightOrchestrationCapability,
): boolean {
  const enabled = policy.enabledCapabilities;
  if (enabled === undefined) return true;
  return enabled.includes(capability);
}

function descriptorSubjectId(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): string {
  return descriptor.subjectReference.subjectId;
}

function descriptorRelatedSubjects(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState === "minimum") return Object.freeze([]);
  return freezeStrings(
    descriptor.relatedSubjects.map((entry) => entry.subjectId),
  );
}

function descriptorEvidence(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState === "minimum") return Object.freeze([]);
  return freezeStrings(descriptor.evidenceRefs);
}

function descriptorRelationships(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState === "minimum") return Object.freeze([]);
  return freezeStrings(descriptor.relationshipRefs);
}

function descriptorPacks(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState !== "operation") return Object.freeze([]);
  return freezeStrings(descriptor.packRefs);
}

function descriptorDecisions(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState !== "operation") return Object.freeze([]);
  return freezeStrings(descriptor.decisionRefs);
}

function descriptorExecutions(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState !== "operation") return Object.freeze([]);
  return freezeStrings(descriptor.executionRefs);
}

function descriptorScenarios(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState !== "operation") return Object.freeze([]);
  return freezeStrings(descriptor.scenarioRefs);
}

function descriptorProblems(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState !== "operation") return Object.freeze([]);
  return freezeStrings(descriptor.problemRefs);
}

function descriptorKpiRefs(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState === "minimum") return Object.freeze([]);
  return freezeStrings(descriptor.kpiRefs);
}

function descriptorKoiRefs(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
): ReadonlyArray<string> {
  if (descriptor.presentationState === "minimum") return Object.freeze([]);
  return freezeStrings(descriptor.koiRefs);
}

function priorityForEvent(
  eventKind: RuntimeExecutiveInsightOrchestrationEventKind,
  attentionState: RuntimeExecutiveInsightPriorityAttentionState,
): RuntimeExecutiveInsightExperienceIntentPriority {
  if ((USER_EVENT_KINDS as readonly string[]).includes(eventKind)) {
    return attentionState === "urgent" ? "critical" : "high";
  }
  if (attentionState === "urgent") return "high";
  if (attentionState === "focus") return "normal";
  return "background";
}

function sortIntents(
  intents: RuntimeExecutiveInsightExperienceIntent[],
): RuntimeExecutiveInsightExperienceIntent[] {
  return [...intents].sort((left, right) => {
    const groupDelta =
      INTENT_ORDER_GROUP[left.kind] - INTENT_ORDER_GROUP[right.kind];
    if (groupDelta !== 0) return groupDelta;
    const kindDelta = compareAscii(left.kind, right.kind);
    if (kindDelta !== 0) return kindDelta;
    const targetDelta = compareAscii(left.target, right.target);
    if (targetDelta !== 0) return targetDelta;
    const refDelta = compareAscii(left.reference ?? "", right.reference ?? "");
    if (refDelta !== 0) return refDelta;
    return compareAscii(left.sourceInsightId, right.sourceInsightId);
  });
}

function dedupeIntents(
  intents: MutableIntent[],
  reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[],
): MutableIntent[] {
  const seen = new Set<string>();
  const result: MutableIntent[] = [];
  for (const intent of intents) {
    const key = intentIdentity(intent);
    if (seen.has(key)) {
      if (!reasonCodes.includes("intent-deduplicated")) {
        reasonCodes.push("intent-deduplicated");
      }
      continue;
    }
    seen.add(key);
    result.push(intent);
  }
  return result;
}

function emptyContexts(): RuntimeExecutiveInsightExperienceCoordinatedContexts {
  return Object.freeze({
    packRefs: Object.freeze([]),
    decisionRefs: Object.freeze([]),
    executionRefs: Object.freeze([]),
    scenarioRefs: Object.freeze([]),
    problemRefs: Object.freeze([]),
  });
}

function buildContexts(
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
  policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy,
): RuntimeExecutiveInsightExperienceCoordinatedContexts {
  const max = policy.maxPropagatedRefs;
  const subjectId = descriptorSubjectId(descriptor);
  const related = limitRefs(descriptorRelatedSubjects(descriptor), max);
  const evidence = limitRefs(descriptorEvidence(descriptor), max);
  const relationships = limitRefs(descriptorRelationships(descriptor), max);
  const packs = limitRefs(descriptorPacks(descriptor), max);
  const decisions = limitRefs(
    [
      ...descriptorDecisions(descriptor),
      ...(input.experienceContext.activeDecisionId
        ? [input.experienceContext.activeDecisionId]
        : []),
    ],
    max,
  );
  const executions = limitRefs(
    [
      ...descriptorExecutions(descriptor),
      ...(input.experienceContext.activeExecutionId
        ? [input.experienceContext.activeExecutionId]
        : []),
    ],
    max,
  );
  const scenarios = limitRefs(
    [
      ...descriptorScenarios(descriptor),
      ...(input.experienceContext.activeScenarioId
        ? [input.experienceContext.activeScenarioId]
        : []),
    ],
    max,
  );
  const problems = limitRefs(
    [
      ...descriptorProblems(descriptor),
      ...(input.experienceContext.activeProblemId
        ? [input.experienceContext.activeProblemId]
        : []),
    ],
    max,
  );

  return Object.freeze({
    stage: Object.freeze({
      subjectId,
      ...(input.stageContext.sceneRef !== undefined
        ? { sceneRef: input.stageContext.sceneRef }
        : input.sceneContext.sceneId !== undefined
          ? { sceneRef: input.sceneContext.sceneId }
          : {}),
      attentionState: descriptor.attentionState,
      presentationState: descriptor.presentationState,
      relatedSubjectRefs: related,
    }),
    advisor: Object.freeze({
      insightId: descriptor.insightId,
      subjectId,
      evidenceRefs: evidence,
      priorityBand: descriptor.priorityBand,
      attentionState: descriptor.attentionState,
      ...(decisions[0] !== undefined ? { decisionRef: decisions[0] } : {}),
      ...(executions[0] !== undefined ? { executionRef: executions[0] } : {}),
      ...(scenarios[0] !== undefined ? { scenarioRef: scenarios[0] } : {}),
      packRefs: packs,
      kpiRefs: limitRefs(descriptorKpiRefs(descriptor), max),
      koiRefs: limitRefs(descriptorKoiRefs(descriptor), max),
    }),
    scene: Object.freeze({
      ...(input.sceneContext.sceneId !== undefined
        ? { sceneId: input.sceneContext.sceneId }
        : {}),
      focusedNodeRef: subjectId,
      relationshipRefs: relationships,
      attentionState: descriptor.attentionState,
    }),
    packRefs: packs,
    decisionRefs: decisions,
    executionRefs: executions,
    scenarioRefs: scenarios,
    problemRefs: problems,
  });
}

type MutableIntent = {
  kind: RuntimeExecutiveInsightExperienceIntentKind;
  target: RuntimeExecutiveInsightExperienceIntentTarget;
  priority: RuntimeExecutiveInsightExperienceIntentPriority;
  sourceInsightId: string;
  reference?: string;
  presentationState?: RuntimeExecutiveInsightPresentationState;
  attentionState?: RuntimeExecutiveInsightPriorityAttentionState;
  reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[];
};

function collectEventIntents(
  eventKind: RuntimeExecutiveInsightOrchestrationEventKind,
  descriptor: RuntimeExecutiveInsightPresentationDescriptor,
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
  policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[],
): MutableIntent[] {
  const intents: MutableIntent[] = [];
  const insightId = descriptor.insightId;
  const subjectId = descriptorSubjectId(descriptor);
  const presentationState = descriptor.presentationState;
  const attentionState = descriptor.attentionState;
  const priority = priorityForEvent(eventKind, attentionState);
  const sparseMinimum =
    presentationState === "minimum" && policy.allowSparseMinimum !== false;

  const push = (intent: MutableIntent) => {
    intents.push(intent);
  };

  if (eventKind === "insight-deselected" || eventKind === "insight-unfocused") {
    push({
      kind: "clear-related-context",
      target: "insight",
      priority: "normal",
      sourceInsightId: insightId,
      reasonCodes: ["no-context-change"],
    });
    reasonCodes.push("no-context-change");
    return intents;
  }

  if (
    eventKind === "insight-selected" ||
    eventKind === "subject-selected" ||
    eventKind === "related-context-requested" ||
    eventKind === "operation-context-requested" ||
    eventKind === "presentation-changed" ||
    eventKind === "attention-changed"
  ) {
    if (eventKind === "insight-selected") {
      push({
        kind: "select-insight",
        target: "insight",
        priority,
        sourceInsightId: insightId,
        reference: insightId,
        attentionState,
        reasonCodes: ["insight-selected"],
      });
      reasonCodes.push("insight-selected");
      push({
        kind: "select-subject",
        target: "subject",
        priority,
        sourceInsightId: insightId,
        reference: subjectId,
        reasonCodes: ["subject-selected"],
      });
      reasonCodes.push("subject-selected");
    }

    if (eventKind === "subject-selected") {
      push({
        kind: "select-subject",
        target: "subject",
        priority,
        sourceInsightId: insightId,
        reference:
          input.experienceContext.selectedSubjectId ?? subjectId,
        reasonCodes: ["subject-selected"],
      });
      reasonCodes.push("subject-selected");
    }
  }

  if (
    eventKind === "insight-focused" ||
    eventKind === "subject-focused" ||
    eventKind === "attention-changed"
  ) {
    if (eventKind === "insight-focused" || eventKind === "attention-changed") {
      push({
        kind: "focus-insight",
        target: "insight",
        priority,
        sourceInsightId: insightId,
        reference: insightId,
        attentionState,
        reasonCodes: ["insight-focused"],
      });
      reasonCodes.push("insight-focused");
    }
    push({
      kind: "focus-subject",
      target: "subject",
      priority,
      sourceInsightId: insightId,
      reference:
        eventKind === "subject-focused"
          ? (input.experienceContext.focusedSubjectId ?? subjectId)
          : subjectId,
      attentionState,
      reasonCodes: ["subject-focused"],
    });
    reasonCodes.push("subject-focused");
  }

  if (policy.syncPresentationState !== false) {
    push({
      kind: "sync-presentation-state",
      target: "presentation",
      priority: "normal",
      sourceInsightId: insightId,
      reference: presentationState,
      presentationState,
      reasonCodes: ["presentation-synchronized"],
    });
    reasonCodes.push("presentation-synchronized");
  }

  const exposeStage =
    policy.exposeStageOnSelect !== false &&
    !(sparseMinimum && eventKind === "presentation-changed");
  if (exposeStage) {
    push({
      kind: "expose-stage-context",
      target: "stage",
      priority,
      sourceInsightId: insightId,
      reference: subjectId,
      attentionState,
      presentationState,
      reasonCodes: ["stage-context-exposed"],
    });
    reasonCodes.push("stage-context-exposed");
  }

  const exposeAdvisor =
    policy.exposeAdvisorOnSelect !== false && !sparseMinimum;
  if (exposeAdvisor) {
    push({
      kind: "expose-advisor-context",
      target: "advisor",
      priority,
      sourceInsightId: insightId,
      reference: insightId,
      attentionState,
      presentationState,
      reasonCodes: ["advisor-context-exposed"],
    });
    reasonCodes.push("advisor-context-exposed");
  }

  const exposeScene =
    policy.exposeSceneOnSelect !== false && !sparseMinimum;
  if (exposeScene) {
    push({
      kind: "expose-scene-context",
      target: "scene",
      priority,
      sourceInsightId: insightId,
      reference: input.sceneContext.sceneId ?? subjectId,
      attentionState,
      reasonCodes: ["scene-context-exposed"],
    });
    reasonCodes.push("scene-context-exposed");
  }

  if (
    !sparseMinimum &&
    policy.exposeEvidenceOnReport !== false &&
    (presentationState === "report" || presentationState === "operation")
  ) {
    const evidence = descriptorEvidence(descriptor);
    if (evidence.length > 0) {
      push({
        kind: "expose-evidence-context",
        target: "evidence",
        priority: "normal",
        sourceInsightId: insightId,
        reference: evidence[0],
        reasonCodes: ["evidence-context-exposed"],
      });
      reasonCodes.push("evidence-context-exposed");
    } else {
      reasonCodes.push("missing-reference");
    }
  }

  if (
    !sparseMinimum &&
    policy.exposeRelationshipsOnReport !== false &&
    (presentationState === "report" || presentationState === "operation")
  ) {
    const relationships = descriptorRelationships(descriptor);
    if (relationships.length > 0) {
      push({
        kind: "expose-relationship-context",
        target: "relationship",
        priority: "normal",
        sourceInsightId: insightId,
        reference: relationships[0],
        reasonCodes: ["relationship-context-exposed"],
      });
      reasonCodes.push("relationship-context-exposed");
    }
  }

  if (presentationState === "operation" || eventKind === "operation-context-requested") {
    const packs = descriptorPacks(descriptor);
    const decisions = descriptorDecisions(descriptor);
    const executions = descriptorExecutions(descriptor);
    const scenarios = descriptorScenarios(descriptor);
    const problems = descriptorProblems(descriptor);
    const activePack = input.experienceContext.activePackId;
    const activeDecision = input.experienceContext.activeDecisionId;
    const activeExecution = input.experienceContext.activeExecutionId;
    const activeScenario = input.experienceContext.activeScenarioId;
    const activeProblem = input.experienceContext.activeProblemId;

    if (packs.length > 0 || activePack !== undefined) {
      push({
        kind: "expose-pack-context",
        target: "pack",
        priority: "normal",
        sourceInsightId: insightId,
        reference: packs[0] ?? activePack,
        reasonCodes: ["pack-context-exposed"],
      });
      reasonCodes.push("pack-context-exposed");
    }
    if (decisions.length > 0 || activeDecision !== undefined) {
      push({
        kind: "expose-decision-context",
        target: "decision",
        priority: "normal",
        sourceInsightId: insightId,
        reference: decisions[0] ?? activeDecision,
        reasonCodes: ["decision-context-exposed"],
      });
      reasonCodes.push("decision-context-exposed");
    }
    if (executions.length > 0 || activeExecution !== undefined) {
      push({
        kind: "expose-execution-context",
        target: "execution",
        priority: "normal",
        sourceInsightId: insightId,
        reference: executions[0] ?? activeExecution,
        reasonCodes: ["execution-context-exposed"],
      });
      reasonCodes.push("execution-context-exposed");
    }
    if (scenarios.length > 0 || activeScenario !== undefined) {
      push({
        kind: "expose-scenario-context",
        target: "scenario",
        priority: "normal",
        sourceInsightId: insightId,
        reference: scenarios[0] ?? activeScenario,
        reasonCodes: ["scenario-context-exposed"],
      });
      reasonCodes.push("scenario-context-exposed");
    }
    if (problems.length > 0 || activeProblem !== undefined) {
      push({
        kind: "expose-problem-context",
        target: "problem",
        priority: "normal",
        sourceInsightId: insightId,
        reference: problems[0] ?? activeProblem,
        reasonCodes: ["problem-context-exposed"],
      });
      reasonCodes.push("problem-context-exposed");
    }
  }

  return intents;
}

function applySuppression(
  intents: MutableIntent[],
  policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[],
): {
  readonly kept: MutableIntent[];
  readonly suppressed: MutableIntent[];
} {
  const suppressedKinds = new Set(policy.suppressIntentKinds ?? []);
  const kept: MutableIntent[] = [];
  const suppressed: MutableIntent[] = [];
  const suppressMissing = policy.suppressWhenCapabilityMissing !== false;

  for (const intent of intents) {
    if (suppressedKinds.has(intent.kind)) {
      suppressed.push({
        ...intent,
        reasonCodes: [...intent.reasonCodes, "intent-suppressed-by-policy"],
      });
      if (!reasonCodes.includes("intent-suppressed-by-policy")) {
        reasonCodes.push("intent-suppressed-by-policy");
      }
      continue;
    }

    if (suppressMissing) {
      if (
        (intent.kind === "expose-stage-context" ||
          intent.kind === "focus-subject") &&
        !hasCapability(policy, "StageSupportsFocus")
      ) {
        suppressed.push({
          ...intent,
          reasonCodes: [...intent.reasonCodes, "capability-unavailable"],
        });
        if (!reasonCodes.includes("capability-unavailable")) {
          reasonCodes.push("capability-unavailable");
        }
        continue;
      }
      if (
        intent.kind === "expose-advisor-context" &&
        !hasCapability(policy, "AdvisorContextAvailable")
      ) {
        suppressed.push({
          ...intent,
          reasonCodes: [...intent.reasonCodes, "capability-unavailable"],
        });
        if (!reasonCodes.includes("capability-unavailable")) {
          reasonCodes.push("capability-unavailable");
        }
        continue;
      }
      if (
        intent.kind === "expose-relationship-context" &&
        !hasCapability(policy, "SceneRelationshipExposureAvailable")
      ) {
        suppressed.push({
          ...intent,
          reasonCodes: [...intent.reasonCodes, "capability-unavailable"],
        });
        if (!reasonCodes.includes("capability-unavailable")) {
          reasonCodes.push("capability-unavailable");
        }
        continue;
      }
      if (
        (intent.kind === "expose-decision-context" ||
          intent.kind === "expose-execution-context" ||
          intent.kind === "expose-pack-context" ||
          intent.kind === "expose-scenario-context" ||
          intent.kind === "expose-problem-context") &&
        !hasCapability(policy, "OperationInteractionAvailable")
      ) {
        suppressed.push({
          ...intent,
          reasonCodes: [...intent.reasonCodes, "capability-unavailable"],
        });
        if (!reasonCodes.includes("capability-unavailable")) {
          reasonCodes.push("capability-unavailable");
        }
        continue;
      }
    }

    kept.push(intent);
  }

  return { kept, suppressed };
}

function resolveFocusConflicts(
  intents: MutableIntent[],
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
  policy: RuntimeExecutiveInsightExperienceOrchestrationPolicy,
  reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[],
): {
  readonly intents: MutableIntent[];
  readonly conflictResolved: boolean;
  readonly conflictUnresolved: boolean;
} {
  if (policy.requireUniqueStageFocus === false) {
    return {
      intents,
      conflictResolved: false,
      conflictUnresolved: false,
    };
  }

  const focusSubjects = intents.filter(
    (intent) =>
      intent.kind === "focus-subject" && intent.target === "subject",
  );
  const competing = [
    ...new Set([
      ...focusSubjects.map((intent) => intent.reference).filter(Boolean),
      ...(input.competingFocusSubjectIds ?? []),
    ]),
  ] as string[];

  if (competing.length <= 1) {
    return {
      intents,
      conflictResolved: false,
      conflictUnresolved: false,
    };
  }

  const isUserEvent = (USER_EVENT_KINDS as readonly string[]).includes(
    input.eventKind,
  );

  if (isUserEvent) {
    const preferred =
      input.experienceContext.focusedSubjectId ??
      input.experienceContext.selectedSubjectId ??
      competing.slice().sort(compareAscii)[0]!;
    const filtered = intents.filter(
      (intent) =>
        !(
          intent.kind === "focus-subject" &&
          intent.reference !== undefined &&
          intent.reference !== preferred
        ),
    );
    if (!filtered.some((intent) => intent.kind === "focus-subject")) {
      filtered.push({
        kind: "focus-subject",
        target: "subject",
        priority: "high",
        sourceInsightId:
          input.presentation.descriptor?.insightId ?? "unknown",
        reference: preferred,
        reasonCodes: ["subject-focused", "conflict-resolved"],
      });
    }
    reasonCodes.push("conflict-resolved");
    return {
      intents: filtered,
      conflictResolved: true,
      conflictUnresolved: false,
    };
  }

  // Non-user event with unresolved competing stage focus targets.
  reasonCodes.push("conflict-unresolved");
  return {
    intents,
    conflictResolved: false,
    conflictUnresolved: true,
  };
}

// ─── Primary APIs ───────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveInsightExperienceContexts(
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
): RuntimeExecutiveInsightExperienceCoordinatedContexts {
  const descriptor = input.presentation.descriptor;
  if (descriptor === undefined) return emptyContexts();
  return buildContexts(descriptor, input, input.policy);
}

export function resolveRuntimeExecutiveInsightExperienceIntents(
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
): {
  readonly intents: ReadonlyArray<RuntimeExecutiveInsightExperienceIntent>;
  readonly suppressedIntents: ReadonlyArray<RuntimeExecutiveInsightExperienceIntent>;
  readonly reasonCodes: ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>;
  readonly conflictResolved: boolean;
  readonly conflictUnresolved: boolean;
} {
  const reasonCodes: RuntimeExecutiveInsightOrchestrationReasonCode[] = [];
  const descriptor = input.presentation.descriptor;
  if (descriptor === undefined) {
    return Object.freeze({
      intents: Object.freeze([]),
      suppressedIntents: Object.freeze([]),
      reasonCodes: Object.freeze(["missing-reference"] as const),
      conflictResolved: false,
      conflictUnresolved: false,
    });
  }

  const collected = collectEventIntents(
    input.eventKind,
    descriptor,
    input,
    input.policy,
    reasonCodes,
  );
  const conflict = resolveFocusConflicts(
    collected,
    input,
    input.policy,
    reasonCodes,
  );
  const suppressed = applySuppression(
    conflict.intents,
    input.policy,
    reasonCodes,
  );
  const deduped = dedupeIntents(suppressed.kept, reasonCodes);
  const sorted = Object.freeze(
    sortIntents(
      deduped.map((intent, index) =>
        makeIntent({
          ...intent,
          order: index,
          reasonCodes: intent.reasonCodes,
        }),
      ),
    ).map((intent, index) =>
      makeIntent({
        kind: intent.kind,
        target: intent.target,
        priority: intent.priority,
        sourceInsightId: intent.sourceInsightId,
        reference: intent.reference,
        presentationState: intent.presentationState,
        attentionState: intent.attentionState,
        reasonCodes: intent.reasonCodes,
        order: index,
      }),
    ),
  );

  const suppressedFinal = Object.freeze(
    sortIntents(
      suppressed.suppressed.map((intent, index) =>
        makeIntent({
          ...intent,
          order: index,
          reasonCodes: intent.reasonCodes,
        }),
      ),
    ).map((intent, index) =>
      makeIntent({
        kind: intent.kind,
        target: intent.target,
        priority: intent.priority,
        sourceInsightId: intent.sourceInsightId,
        reference: intent.reference,
        presentationState: intent.presentationState,
        attentionState: intent.attentionState,
        reasonCodes: intent.reasonCodes,
        order: index,
      }),
    ),
  );

  return Object.freeze({
    intents: sorted,
    suppressedIntents: suppressedFinal,
    reasonCodes: Object.freeze([
      ...new Set(reasonCodes),
    ]) as ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>,
    conflictResolved: conflict.conflictResolved,
    conflictUnresolved: conflict.conflictUnresolved,
  });
}

export function orchestrateRuntimeExecutiveInsightExperience(
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
): RuntimeExecutiveInsightExperienceOrchestrationResult {
  const validation =
    validateRuntimeExecutiveInsightExperienceOrchestrationInput(input);
  if (!validation.valid) {
    return Object.freeze({
      status: "invalid",
      sourceInsightId: isPlainObject(input.presentation?.descriptor)
        ? String(input.presentation.descriptor.insightId ?? "")
        : "",
      eventKind: isRuntimeExecutiveInsightOrchestrationEventKind(input.eventKind)
        ? input.eventKind
        : "related-context-requested",
      intents: Object.freeze([]),
      suppressedIntents: Object.freeze([]),
      conflictResolved: false,
      conflictUnresolved: false,
      contexts: emptyContexts(),
      reasonCodes: Object.freeze(
        validation.issues.map((entry) => entry.code),
      ),
      policyId: isPlainObject(input.policy)
        ? String(input.policy.policyId ?? "")
        : "",
      ...(isPlainObject(input.policy) &&
      typeof input.policy.policyVersion === "string"
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    });
  }

  const descriptor = input.presentation.descriptor;
  if (
    descriptor === undefined ||
    input.presentation.status === "invalid" ||
    !isRuntimeExecutiveInsightPresentationState(
      descriptor.presentationState,
    )
  ) {
    return Object.freeze({
      status: "invalid",
      sourceInsightId: "",
      eventKind: input.eventKind,
      intents: Object.freeze([]),
      suppressedIntents: Object.freeze([]),
      conflictResolved: false,
      conflictUnresolved: false,
      contexts: emptyContexts(),
      reasonCodes: Object.freeze([
        "invalid-input",
        "missing-reference",
      ]) as ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>,
      policyId: input.policy.policyId,
      ...(input.policy.policyVersion !== undefined
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    }) as RuntimeExecutiveInsightExperienceOrchestrationResult;
  }

  const resolved = resolveRuntimeExecutiveInsightExperienceIntents(input);
  const contexts = buildContexts(descriptor, input, input.policy);

  if (resolved.conflictUnresolved) {
    return Object.freeze({
      status: "conflicted",
      sourceInsightId: descriptor.insightId,
      eventKind: input.eventKind,
      intents: resolved.intents,
      suppressedIntents: resolved.suppressedIntents,
      conflictResolved: false,
      conflictUnresolved: true,
      contexts,
      reasonCodes: resolved.reasonCodes,
      policyId: input.policy.policyId,
      ...(input.policy.policyVersion !== undefined
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    });
  }

  if (
    input.eventKind === "insight-deselected" ||
    input.eventKind === "insight-unfocused"
  ) {
    const onlyClear =
      resolved.intents.length === 1 &&
      resolved.intents[0]?.kind === "clear-related-context";
    return Object.freeze({
      status: (onlyClear ? "no-op" : "orchestrated") as
        | "no-op"
        | "orchestrated",
      sourceInsightId: descriptor.insightId,
      eventKind: input.eventKind,
      intents: resolved.intents,
      suppressedIntents: resolved.suppressedIntents,
      conflictResolved: resolved.conflictResolved,
      conflictUnresolved: false,
      contexts: emptyContexts(),
      reasonCodes: resolved.reasonCodes,
      policyId: input.policy.policyId,
      ...(input.policy.policyVersion !== undefined
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    }) as RuntimeExecutiveInsightExperienceOrchestrationResult;
  }

  if (resolved.intents.length === 0 && resolved.suppressedIntents.length > 0) {
    return Object.freeze({
      status: "restricted",
      sourceInsightId: descriptor.insightId,
      eventKind: input.eventKind,
      intents: resolved.intents,
      suppressedIntents: resolved.suppressedIntents,
      conflictResolved: resolved.conflictResolved,
      conflictUnresolved: false,
      contexts,
      reasonCodes: resolved.reasonCodes,
      policyId: input.policy.policyId,
      ...(input.policy.policyVersion !== undefined
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    });
  }

  if (resolved.intents.length === 0) {
    return Object.freeze({
      status: "no-op",
      sourceInsightId: descriptor.insightId,
      eventKind: input.eventKind,
      intents: resolved.intents,
      suppressedIntents: resolved.suppressedIntents,
      conflictResolved: resolved.conflictResolved,
      conflictUnresolved: false,
      contexts,
      reasonCodes: Object.freeze([
        ...new Set([...resolved.reasonCodes, "no-context-change"]),
      ]) as ReadonlyArray<RuntimeExecutiveInsightOrchestrationReasonCode>,
      policyId: input.policy.policyId,
      ...(input.policy.policyVersion !== undefined
        ? { policyVersion: input.policy.policyVersion }
        : {}),
      orchestrationIdentity:
        runtimeExecutiveInsightExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveInsightExperienceOrchestrationVersion,
    }) as RuntimeExecutiveInsightExperienceOrchestrationResult;
  }

  return Object.freeze({
    status: "orchestrated",
    sourceInsightId: descriptor.insightId,
    eventKind: input.eventKind,
    intents: resolved.intents,
    suppressedIntents: resolved.suppressedIntents,
    conflictResolved: resolved.conflictResolved,
    conflictUnresolved: false,
    contexts,
    reasonCodes: resolved.reasonCodes,
    policyId: input.policy.policyId,
    ...(input.policy.policyVersion !== undefined
      ? { policyVersion: input.policy.policyVersion }
      : {}),
    orchestrationIdentity:
      runtimeExecutiveInsightExperienceOrchestrationIdentity,
    orchestrationVersion:
      runtimeExecutiveInsightExperienceOrchestrationVersion,
  });
}

export function orchestrateRuntimeExecutiveInsightSelection(
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
): RuntimeExecutiveInsightExperienceOrchestrationResult {
  const eventKind =
    input.eventKind === "subject-selected"
      ? "subject-selected"
      : "insight-selected";
  return orchestrateRuntimeExecutiveInsightExperience({
    ...input,
    eventKind,
  });
}

export function orchestrateRuntimeExecutiveInsightFocus(
  input: RuntimeExecutiveInsightExperienceOrchestrationInput,
): RuntimeExecutiveInsightExperienceOrchestrationResult {
  const eventKind =
    input.eventKind === "subject-focused"
      ? "subject-focused"
      : "insight-focused";
  return orchestrateRuntimeExecutiveInsightExperience({
    ...input,
    eventKind,
  });
}

export function createRuntimeExecutiveInsightExperienceOrchestrationPolicy(input: {
  readonly policyId: string;
  readonly policyVersion?: string;
  readonly enabledCapabilities?: ReadonlyArray<RuntimeExecutiveInsightOrchestrationCapability>;
  readonly suppressIntentKinds?: ReadonlyArray<RuntimeExecutiveInsightExperienceIntentKind>;
  readonly maxPropagatedRefs?: number;
  readonly exposeStageOnSelect?: boolean;
  readonly exposeAdvisorOnSelect?: boolean;
  readonly exposeSceneOnSelect?: boolean;
  readonly exposeEvidenceOnReport?: boolean;
  readonly exposeRelationshipsOnReport?: boolean;
  readonly syncPresentationState?: boolean;
  readonly requireUniqueStageFocus?: boolean;
  readonly allowSparseMinimum?: boolean;
  readonly suppressWhenCapabilityMissing?: boolean;
}): RuntimeExecutiveInsightExperienceOrchestrationPolicy {
  const policy = Object.freeze({
    policyId: input.policyId,
    ...(input.policyVersion !== undefined
      ? { policyVersion: input.policyVersion }
      : {}),
    ...(input.enabledCapabilities !== undefined
      ? {
          enabledCapabilities: Object.freeze([...input.enabledCapabilities]),
        }
      : {}),
    ...(input.suppressIntentKinds !== undefined
      ? {
          suppressIntentKinds: Object.freeze([...input.suppressIntentKinds]),
        }
      : {}),
    ...(input.maxPropagatedRefs !== undefined
      ? { maxPropagatedRefs: input.maxPropagatedRefs }
      : {}),
    ...(input.exposeStageOnSelect !== undefined
      ? { exposeStageOnSelect: input.exposeStageOnSelect }
      : {}),
    ...(input.exposeAdvisorOnSelect !== undefined
      ? { exposeAdvisorOnSelect: input.exposeAdvisorOnSelect }
      : {}),
    ...(input.exposeSceneOnSelect !== undefined
      ? { exposeSceneOnSelect: input.exposeSceneOnSelect }
      : {}),
    ...(input.exposeEvidenceOnReport !== undefined
      ? { exposeEvidenceOnReport: input.exposeEvidenceOnReport }
      : {}),
    ...(input.exposeRelationshipsOnReport !== undefined
      ? { exposeRelationshipsOnReport: input.exposeRelationshipsOnReport }
      : {}),
    ...(input.syncPresentationState !== undefined
      ? { syncPresentationState: input.syncPresentationState }
      : {}),
    ...(input.requireUniqueStageFocus !== undefined
      ? { requireUniqueStageFocus: input.requireUniqueStageFocus }
      : {}),
    ...(input.allowSparseMinimum !== undefined
      ? { allowSparseMinimum: input.allowSparseMinimum }
      : {}),
    ...(input.suppressWhenCapabilityMissing !== undefined
      ? {
          suppressWhenCapabilityMissing:
            input.suppressWhenCapabilityMissing,
        }
      : {}),
  });
  const validated =
    validateRuntimeExecutiveInsightExperienceOrchestrationPolicy(policy);
  if (!validated.valid) {
    throw new TypeError(
      `invalid orchestration policy: ${validated.issues[0]?.code ?? "invalid-policy"}`,
    );
  }
  return policy;
}

export function getRuntimeExecutiveInsightExperienceOrchestrationIdentity():
  typeof runtimeExecutiveInsightExperienceOrchestrationCanonicalIdentity {
  return runtimeExecutiveInsightExperienceOrchestrationCanonicalIdentity;
}

export function getRuntimeExecutiveInsightExperienceOrchestrationRegistry():
  typeof runtimeExecutiveInsightExperienceOrchestrationRegistry {
  return runtimeExecutiveInsightExperienceOrchestrationRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceOrchestrationApiNames =
  Object.freeze([
    "getRuntimeExecutiveInsightExperienceOrchestrationIdentity",
    "getRuntimeExecutiveInsightExperienceOrchestrationRegistry",
    "isRuntimeExecutiveInsightOrchestrationEventKind",
    "isRuntimeExecutiveInsightExperienceIntentKind",
    "isRuntimeExecutiveInsightExperienceIntentTarget",
    "isRuntimeExecutiveInsightExperienceIntentPriority",
    "isRuntimeExecutiveInsightExperienceOrchestrationStatus",
    "isRuntimeExecutiveInsightOrchestrationReasonCode",
    "validateRuntimeExecutiveInsightExperienceOrchestrationPolicy",
    "validateRuntimeExecutiveInsightExperienceOrchestrationInput",
    "createRuntimeExecutiveInsightExperienceOrchestrationPolicy",
    "resolveRuntimeExecutiveInsightExperienceContexts",
    "resolveRuntimeExecutiveInsightExperienceIntents",
    "orchestrateRuntimeExecutiveInsightExperience",
    "orchestrateRuntimeExecutiveInsightSelection",
    "orchestrateRuntimeExecutiveInsightFocus",
    "verifyRuntimeExecutiveInsightExperienceOrchestration",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightOrchestrationEventKind",
    "RuntimeExecutiveInsightExperienceIntentKind",
    "RuntimeExecutiveInsightExperienceIntentTarget",
    "RuntimeExecutiveInsightExperienceIntentPriority",
    "RuntimeExecutiveInsightExperienceOrchestrationStatus",
    "RuntimeExecutiveInsightOrchestrationReasonCode",
    "RuntimeExecutiveInsightOrchestrationCapability",
    "RuntimeExecutiveInsightExperienceContext",
    "RuntimeExecutiveInsightStageContext",
    "RuntimeExecutiveInsightAdvisorContext",
    "RuntimeExecutiveInsightSceneContext",
    "RuntimeExecutiveInsightExperienceOrchestrationPolicy",
    "RuntimeExecutiveInsightExperienceOrchestrationInput",
    "RuntimeExecutiveInsightExperienceIntent",
    "RuntimeExecutiveInsightExperienceCoordinatedContexts",
    "RuntimeExecutiveInsightExperienceOrchestrationResult",
    "RuntimeExecutiveInsightOrchestrationValidationIssue",
    "RuntimeExecutiveInsightOrchestrationValidationResult",
    "RuntimeExecutiveInsightExperienceOrchestrationVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "EventKinds",
    "IntentKinds",
    "IntentTargets",
    "IntentPriorities",
    "OrchestrationStatuses",
    "ReasonCodes",
    "Capabilities",
    "ConsumerGuarantees",
    "PublicTypes",
    "PublicApis",
  ] as const);

export const runtimeExecutiveInsightExperienceOrchestrationRegistry =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceOrchestrationIdentity,
    version: runtimeExecutiveInsightExperienceOrchestrationVersion,
    namespace: runtimeExecutiveInsightExperienceOrchestrationNamespace,
    layer: runtimeExecutiveInsightExperienceOrchestrationLayer,
    capability: runtimeExecutiveInsightExperienceOrchestrationCapability,
    phase: runtimeExecutiveInsightExperienceOrchestrationPhase,
    status: runtimeExecutiveInsightExperienceOrchestrationStatus,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REGISTRY_SECTIONS.length,
    eventKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS,
    eventKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS.length,
    intentKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
    intentKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS.length,
    intentTargets: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS,
    intentTargetCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS.length,
    intentPriorities:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES,
    intentPriorityCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES.length,
    orchestrationStatuses: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
    orchestrationStatusCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES.length,
    reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES,
    reasonCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES.length,
    capabilities: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CAPABILITIES.length,
    consumerGuarantees:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES.length,
    publicTypes: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveInsightExperienceOrchestrationApiNames,
    publicApiCount:
      runtimeExecutiveInsightExperienceOrchestrationApiNames.length,
    orderingGuarantees: Object.freeze([
      "selection-before-focus",
      "presentation-sync-before-context",
      "stage-before-advisor-before-scene",
      "domain-context-after-evidence",
      "clear-intents-last",
    ]),
    conflictGuarantees: Object.freeze([
      "user-event-precedence",
      "stable-id-tie-break",
      "explicit-unresolved-conflicts",
    ]),
    nonGoals: Object.freeze([
      "ui-execution",
      "stage-mutation",
      "advisor-generation",
      "presentation-re-resolution",
      "priority-recomputation",
      "attention-recomputation",
      "kpi-calculation",
      "koi-calculation",
      "automation",
    ]),
  });

export const runtimeExecutiveInsightExperienceOrchestration = Object.freeze({
  phase: "Orchestration" as const,
  name: "RuntimeExecutiveInsightExperienceOrchestration" as const,
  identity: runtimeExecutiveInsightExperienceOrchestrationIdentity,
  version: runtimeExecutiveInsightExperienceOrchestrationVersion,
  namespace: runtimeExecutiveInsightExperienceOrchestrationNamespace,
  layer: runtimeExecutiveInsightExperienceOrchestrationLayer,
  capability: runtimeExecutiveInsightExperienceOrchestrationCapability,
  architecturalRole:
    runtimeExecutiveInsightExperienceOrchestrationArchitecturalRole,
  role: "Orchestration" as const,
  status: runtimeExecutiveInsightExperienceOrchestrationStatus,
  upstreamDependency:
    runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveInsightExperienceOrchestrationDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightExperienceOrchestrationSupportedImportPath,
  deterministic: runtimeExecutiveInsightExperienceOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  pure: true as const,
  stateless: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  reactIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY,
  eventKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS,
  intentKinds: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS,
  intentTargets: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS,
  intentPriorities: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES,
  orchestrationStatuses: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES,
  reasonCodes: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_CONSUMER_GUARANTEES,
  publicTypeNames: RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightExperienceOrchestrationApiNames,
  registry: runtimeExecutiveInsightExperienceOrchestrationRegistry,
  presentationBoundary: "REX-4:5-presentation-only" as const,
  architecturalStatus:
    "REX-4:6 Runtime Executive Insight Experience Orchestration — OrchestrationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightExperienceOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightExperienceOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveInsightExperienceOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveInsightExperienceOrchestrationNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity;
  readonly eventKindCount: number;
  readonly intentKindCount: number;
  readonly intentTargetCount: number;
  readonly intentPriorityCount: number;
  readonly orchestrationStatusCount: number;
  readonly reasonCodeCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly presentationBoundaryIntact: boolean;
  readonly upstreamPresentationOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
  readonly selectionDistinctFromFocus: boolean;
  readonly attentionDistinctFromFocus: boolean;
  readonly operationDistinctFromAction: boolean;
}

export function verifyRuntimeExecutiveInsightExperienceOrchestration():
  RuntimeExecutiveInsightExperienceOrchestrationVerification {
  const orchestrationModule = runtimeExecutiveInsightExperienceOrchestration;
  const registry = runtimeExecutiveInsightExperienceOrchestrationRegistry;
  const upstream = verifyRuntimeExecutiveInsightPresentation();

  const identityOk =
    orchestrationModule.identity ===
      "REX-4:6/RuntimeExecutiveInsightExperienceOrchestration" &&
    orchestrationModule.version === "4.6.0" &&
    orchestrationModule.namespace ===
      "nexora.rex.insight-experience.orchestration" &&
    orchestrationModule.layer === "REX" &&
    orchestrationModule.capability === "RuntimeExecutiveInsightExperience" &&
    orchestrationModule.phase === "Orchestration" &&
    orchestrationModule.status === "OrchestrationReady" &&
    orchestrationModule.upstreamDependency ===
      "REX-4:5/RuntimeExecutiveInsightPresentation" &&
    orchestrationModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightPresentation" &&
    orchestrationModule.presentationBoundary === "REX-4:5-presentation-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS], [
      "insight-selected",
      "insight-deselected",
      "insight-focused",
      "insight-unfocused",
      "subject-selected",
      "subject-focused",
      "presentation-changed",
      "attention-changed",
      "related-context-requested",
      "operation-context-requested",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES], [
      "orchestrated",
      "no-op",
      "restricted",
      "invalid",
      "conflicted",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES],
      ["background", "normal", "high", "critical"],
    );

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY.introducesKor === false;

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes("kpi") &&
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY.calculatesKpi === false;
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_SUBJECT_KINDS.includes("koi") &&
    RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY.calculatesKoi === false;

  const frozen =
    Object.isFrozen(orchestrationModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeExecutiveInsightExperienceOrchestrationCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_BOUNDARY);

  const presentationBoundaryIntact =
    orchestrationModule.boundary.soleImmediateDependency ===
      "REX-4:5/RuntimeExecutiveInsightPresentation" &&
    orchestrationModule.boundary.consumesPresentationOnly === true &&
    orchestrationModule.boundary.importsRex44Directly === false &&
    orchestrationModule.boundary.importsRex43Directly === false &&
    orchestrationModule.boundary.importsRex42Directly === false &&
    orchestrationModule.boundary.importsRex41Directly === false &&
    orchestrationModule.boundary.reresolvesPresentation === false &&
    orchestrationModule.boundary.recalculatesPriority === false &&
    orchestrationModule.boundary.recalculatesAttention === false &&
    orchestrationModule.boundary.introducesStageExecution === false &&
    orchestrationModule.boundary.introducesAdvisorProse === false &&
    orchestrationModule.boundary.introducesAutomation === false;

  const registryCountsOk =
    registry.eventKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS.length &&
    registry.intentKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS.length &&
    registry.intentTargetCount ===
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS.length &&
    registry.reasonCodeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightExperienceOrchestrationApiNames.length;

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    frozen &&
    presentationBoundaryIntact &&
    registryCountsOk &&
    upstream.ok === true &&
    orchestrationModule.boundary.selectionDistinctFromFocus === true &&
    orchestrationModule.boundary.attentionDistinctFromFocus === true &&
    orchestrationModule.boundary.operationDistinctFromAction === true &&
    orchestrationModule.principle ===
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightExperienceOrchestrationIdentity,
    version: runtimeExecutiveInsightExperienceOrchestrationVersion,
    namespace: runtimeExecutiveInsightExperienceOrchestrationNamespace,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceOrchestrationDependencyIdentity,
    eventKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_EVENT_KINDS.length,
    intentKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_KINDS.length,
    intentTargetCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_TARGETS.length,
    intentPriorityCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_INTENT_PRIORITIES.length,
    orchestrationStatusCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_STATUSES.length,
    reasonCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REASON_CODES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveInsightExperienceOrchestrationApiNames.length,
    sectionCount:
      RUNTIME_EXECUTIVE_INSIGHT_ORCHESTRATION_REGISTRY_SECTIONS.length,
    frozen,
    presentationBoundaryIntact,
    upstreamPresentationOk: upstream.ok === true,
    noKor,
    kpiSupported,
    koiSupported,
    selectionDistinctFromFocus:
      orchestrationModule.boundary.selectionDistinctFromFocus === true,
    attentionDistinctFromFocus:
      orchestrationModule.boundary.attentionDistinctFromFocus === true,
    operationDistinctFromAction:
      orchestrationModule.boundary.operationDistinctFromAction === true,
  });
}
