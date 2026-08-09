/**
 * REX-3:6 — Runtime Executive Advisor Experience Orchestration.
 *
 * Combines validated REX-3:5 Stage Coordination into one deterministic Advisor
 * experience: presentation intent, guidance/action visibility, coordination
 * execution intent, sequencing, transitions, freshness, and interruptions.
 *
 * Canonical flow:
 *   REX-3:5 Stage Coordination Plan
 *     → Experience Orchestration
 *     → Advisor Presentation Intent
 *     → Coordination Sequencing
 *     → Interaction / Transition Plan
 *     → Runtime Executive Advisor Experience Result
 *     → Ready for REX-3:7 Platform
 *
 * Orchestrates approved runtime behavior. Does not render UI, mutate Stage,
 * navigate, or call an LLM. ready/executable ≠ executed.
 */

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN,
  isRuntimeExecutiveAdvisorStageCoordinationReady,
  runtimeExecutiveAdvisorStageCoordinationIdentity,
  runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
  runtimeExecutiveAdvisorStageCoordinationVersion,
  validateRuntimeExecutiveAdvisorStageCoordinationPlan,
  verifyRuntimeExecutiveAdvisorStageCoordination,
  type RuntimeExecutiveAdvisorStageCoordinationPlan,
  type RuntimeExecutiveAdvisorStageCoordinationStep,
} from "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceOrchestrationIdentity =
  "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationVersion =
  "3.6.0" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationNamespace =
  "nexora.rex.advisor-experience.orchestration" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationPhase =
  "ExperienceOrchestration" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationArchitecturalRole =
  "RuntimeExecutiveAdvisorExperienceOrchestrationBoundary" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity =
  runtimeExecutiveAdvisorStageCoordinationIdentity;

export const runtimeExecutiveAdvisorExperienceOrchestrationDependencyPath =
  runtimeExecutiveAdvisorStageCoordinationSupportedImportPath;

export const runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorExperienceOrchestration" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationStability =
  "OrchestrationReady" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorExperienceOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
    version: runtimeExecutiveAdvisorExperienceOrchestrationVersion,
    namespace: runtimeExecutiveAdvisorExperienceOrchestrationNamespace,
    layer: runtimeExecutiveAdvisorExperienceOrchestrationLayer,
    domain: runtimeExecutiveAdvisorExperienceOrchestrationDomain,
    phase: runtimeExecutiveAdvisorExperienceOrchestrationPhase,
    architecturalRole:
      runtimeExecutiveAdvisorExperienceOrchestrationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    stabilityStatus:
      runtimeExecutiveAdvisorExperienceOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveAdvisorExperienceOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorExperienceOrchestrationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveAdvisorExperienceOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PRINCIPLE =
  "Response + Guidance + Actions + Stage Coordination → one coherent Runtime Executive Advisor Experience. Orchestration owns sequencing; UI and Stage mutation remain downstream." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  orchestrationAuthority: "REX-3:6" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorExperienceOrchestrationBoundary" as const,
  soleImmediateDependency:
    "REX-3:5/RuntimeExecutiveAdvisorStageCoordination" as const,
  consumesStageCoordinationOnly: true as const,
  importsRex34Directly: false as const,
  importsRex33Directly: false as const,
  importsRex32Directly: false as const,
  importsRex31Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  executesActions: false as const,
  mutatesStageState: false as const,
  navigatesApplication: false as const,
  rendersUi: false as const,
  forgesManagerConfirmation: false as const,
  generatesProse: false as const,
  chatAssumesConversation: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES = Object.freeze([
  "idle",
  "prepared",
  "active",
  "suspended",
  "completed",
  "blocked",
] as const);

export type RuntimeExecutiveAdvisorOrchestrationState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES = Object.freeze([
  "passive",
  "responsive",
  "guidance",
  "coordinated",
] as const);

export type RuntimeExecutiveAdvisorOrchestrationMode =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES = Object.freeze([
  "observe",
  "understand",
  "respond",
  "guide",
  "coordinate",
  "settle",
] as const);

export type RuntimeExecutiveAdvisorExperiencePhase =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS = Object.freeze([
  "runtime-context",
  "subject-change",
  "stage-selection",
  "stage-focus",
  "interaction",
  "attention-change",
  "guidance-ready",
  "action-confirmed",
  "coordination-ready",
  "dismiss",
  "context-invalidated",
] as const);

export type RuntimeExecutiveAdvisorOrchestrationTrigger =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS = Object.freeze([
  "hidden",
  "signal",
  "summary",
  "guidance",
  "operation",
] as const);

export type RuntimeExecutiveAdvisorPresentationIntent =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY = Object.freeze([
  "hidden",
  "available",
  "primary",
  "expanded",
] as const);

export type RuntimeExecutiveAdvisorGuidanceVisibility =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY = Object.freeze([
  "hidden",
  "available",
  "confirmation-required",
  "blocked",
] as const);

export type RuntimeExecutiveAdvisorActionVisibility =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS =
  Object.freeze(["none", "defer", "request", "ready"] as const);

export type RuntimeExecutiveAdvisorCoordinationExecutionIntent =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS =
  Object.freeze([
    "enter",
    "advance",
    "hold",
    "resume",
    "settle",
    "dismiss",
  ] as const);

export type RuntimeExecutiveAdvisorExperienceTransitionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS = Object.freeze([
  "current",
  "stale",
  "invalid",
] as const);

export type RuntimeExecutiveAdvisorContextFreshness =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS =
  Object.freeze([
    "subject-changed",
    "selection-changed",
    "focus-changed",
    "scene-changed",
    "manager-action",
    "dismissed",
    "coordination-blocked",
  ] as const);

export type RuntimeExecutiveAdvisorExperienceInterruptionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STABILITY = Object.freeze([
  "unstable",
  "settling",
  "stable",
] as const);

export type RuntimeExecutiveAdvisorOrchestrationStability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STABILITY)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES =
  Object.freeze([
    "advisor-experience-orchestration",
    "orchestration-state-resolution",
    "orchestration-mode-resolution",
    "experience-phase-resolution",
    "presentation-intent-resolution",
    "guidance-visibility-resolution",
    "action-visibility-resolution",
    "coordination-execution-intent",
    "experience-sequencing",
    "transition-planning",
    "stale-context-detection",
    "interruption-handling",
    "manager-authority-protection",
    "orchestration-conflict-resolution",
    "orchestration-stability",
    "orchestration-executability",
    "orchestration-validation",
    "stable-orchestration-ordering",
  ] as const);

export type RuntimeExecutiveAdvisorOrchestrationCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "OrchestrationStates",
    "OrchestrationModes",
    "ExperiencePhases",
    "Triggers",
    "PresentationIntents",
    "GuidanceVisibility",
    "ActionVisibility",
    "CoordinationExecutionIntents",
    "Transitions",
    "Freshness",
    "Interruptions",
    "Validation",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorOrchestrationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

/**
 * Semantic experience signals published through the orchestration boundary.
 * Derived upstream of REX-3:6; this phase does not import REX-3:4.
 */
export interface RuntimeExecutiveAdvisorOrchestrationSignals {
  readonly hasResponse?: boolean;
  readonly hasGuidance?: boolean;
  readonly hasPrimaryGuidance?: boolean;
  readonly hasAlternativeGuidance?: boolean;
  readonly actionVisibilityHint?: RuntimeExecutiveAdvisorActionVisibility;
  readonly managerConfirmed?: boolean;
  readonly contextSubjectId?: string | null;
  readonly experienceSubjectId?: string | null;
  readonly interruption?: RuntimeExecutiveAdvisorExperienceInterruptionKind | null;
  readonly previouslyActive?: boolean;
}

export interface RuntimeExecutiveAdvisorOrchestrationInput {
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
  readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
}

export interface RuntimeExecutiveAdvisorOrchestrationStep {
  readonly id: string;
  readonly phase: RuntimeExecutiveAdvisorExperiencePhase;
  readonly presentationIntent: RuntimeExecutiveAdvisorPresentationIntent;
  readonly guidanceVisibility: RuntimeExecutiveAdvisorGuidanceVisibility;
  readonly actionVisibility: RuntimeExecutiveAdvisorActionVisibility;
  readonly coordinationExecutionIntent: RuntimeExecutiveAdvisorCoordinationExecutionIntent;
  readonly coordinationStepIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorExperienceTransition {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorExperienceTransitionKind;
  readonly fromPhase: RuntimeExecutiveAdvisorExperiencePhase | null;
  readonly toPhase: RuntimeExecutiveAdvisorExperiencePhase | null;
}

export interface RuntimeExecutiveAdvisorExperienceOrchestrationPlan {
  readonly state: RuntimeExecutiveAdvisorOrchestrationState;
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly steps: ReadonlyArray<RuntimeExecutiveAdvisorOrchestrationStep>;
  readonly transitions: ReadonlyArray<RuntimeExecutiveAdvisorExperienceTransition>;
  readonly freshness: RuntimeExecutiveAdvisorContextFreshness;
  readonly interruption: RuntimeExecutiveAdvisorExperienceInterruptionKind | null;
  readonly stability: RuntimeExecutiveAdvisorOrchestrationStability;
  readonly isStable: boolean;
  readonly isExecutable: boolean;
  readonly orchestrationIdentity: typeof runtimeExecutiveAdvisorExperienceOrchestrationIdentity;
  readonly orchestrationVersion: typeof runtimeExecutiveAdvisorExperienceOrchestrationVersion;
  readonly coordinationIdentity: typeof runtimeExecutiveAdvisorStageCoordinationIdentity;
  readonly coordinationVersion: typeof runtimeExecutiveAdvisorStageCoordinationVersion;
}

export interface RuntimeExecutiveAdvisorExperienceOrchestrationResult {
  readonly plan: RuntimeExecutiveAdvisorExperienceOrchestrationPlan;
  readonly activeStep: RuntimeExecutiveAdvisorOrchestrationStep | null;
  readonly currentPhase: RuntimeExecutiveAdvisorExperiencePhase | null;
  readonly freshness: RuntimeExecutiveAdvisorContextFreshness;
}

export interface RuntimeExecutiveAdvisorOrchestrationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorOrchestrationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorOrchestrationIssue>;
}

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "from-coordination",
    order: 1,
    statement:
      "Every orchestration plan originates from valid REX-3:5 coordination data.",
  }),
  Object.freeze({
    id: "manager-outranks-advisor",
    order: 2,
    statement: "Manager actions outrank Advisor continuation.",
  }),
  Object.freeze({
    id: "stale-not-active",
    order: 3,
    statement: "Stale context must not continue as active guidance.",
  }),
  Object.freeze({
    id: "confirmation-not-forged",
    order: 4,
    statement:
      "Confirmation-required actions cannot become ready without confirmation.",
  }),
  Object.freeze({
    id: "blocked-not-executable",
    order: 5,
    statement: "Blocked coordination cannot become executable.",
  }),
  Object.freeze({
    id: "canonical-phase-order",
    order: 6,
    statement: "Experience phases remain canonically ordered.",
  }),
  Object.freeze({
    id: "no-ui-render",
    order: 7,
    statement: "No orchestration step directly renders UI.",
  }),
  Object.freeze({
    id: "no-stage-mutation",
    order: 8,
    statement: "No orchestration step directly mutates Stage state.",
  }),
  Object.freeze({
    id: "deterministic-orchestration",
    order: 9,
    statement: "Equivalent semantic input → equivalent orchestration output.",
  }),
  Object.freeze({
    id: "source-immutability",
    order: 10,
    statement: "Source input remains immutable.",
  }),
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_FORBIDDEN = Object.freeze([
  "LLM calls",
  "prompt templates",
  "embeddings",
  "generated conversational responses",
  "React components",
  "hooks",
  "Advisor Panel implementation",
  "Stage overlay implementation",
  "CSS",
  "animations",
  "select()",
  "focus()",
  "highlight()",
  "changeScene()",
  "showPath()",
  "setPresentationState()",
  "navigate()",
  "openScenario()",
  "openDecision()",
  "openExecution()",
  "dispatch()",
  "DOM events",
  "Zustand subscriptions",
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
): RuntimeExecutiveAdvisorOrchestrationIssue {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

function phaseIndex(phase: RuntimeExecutiveAdvisorExperiencePhase): number {
  return RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES.indexOf(phase);
}

function interruptionPriority(
  kind: RuntimeExecutiveAdvisorExperienceInterruptionKind,
): number {
  switch (kind) {
    case "manager-action":
      return 6;
    case "dismissed":
      return 5;
    case "subject-changed":
    case "selection-changed":
      return 4;
    case "focus-changed":
    case "scene-changed":
      return 3;
    case "coordination-blocked":
      return 2;
  }
}

function signalsOf(
  input: RuntimeExecutiveAdvisorOrchestrationInput,
): Required<
  Pick<
    RuntimeExecutiveAdvisorOrchestrationSignals,
    | "hasResponse"
    | "hasGuidance"
    | "hasPrimaryGuidance"
    | "hasAlternativeGuidance"
    | "managerConfirmed"
    | "previouslyActive"
  >
> &
  RuntimeExecutiveAdvisorOrchestrationSignals {
  const signals = input.signals ?? {};
  const plan = input.coordinationPlan;
  const hasCoordination = plan.steps.length > 0;
  return {
    hasResponse: signals.hasResponse ?? hasCoordination,
    hasGuidance:
      signals.hasGuidance ??
      (hasCoordination && plan.state !== "none"),
    hasPrimaryGuidance:
      signals.hasPrimaryGuidance ??
      (hasCoordination && (plan.state === "ready" || plan.state === "planned")),
    hasAlternativeGuidance: signals.hasAlternativeGuidance ?? false,
    actionVisibilityHint: signals.actionVisibilityHint,
    managerConfirmed: signals.managerConfirmed ?? false,
    contextSubjectId: signals.contextSubjectId,
    experienceSubjectId: signals.experienceSubjectId,
    interruption: signals.interruption ?? null,
    previouslyActive: signals.previouslyActive ?? false,
  };
}

function readyCoordinationSteps(
  plan: RuntimeExecutiveAdvisorStageCoordinationPlan,
): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep> {
  return Object.freeze(plan.steps.filter((step) => !step.blocked));
}

function hasConfirmationDeferredSteps(
  plan: RuntimeExecutiveAdvisorStageCoordinationPlan,
): boolean {
  return plan.steps.some(
    (step) =>
      step.blocked &&
      step.preconditions.some(
        (precondition) =>
          precondition.kind === "manager-confirmed" &&
          precondition.satisfied === false,
      ),
  );
}

function hasWorkflowOpen(
  plan: RuntimeExecutiveAdvisorStageCoordinationPlan,
): boolean {
  return plan.steps.some(
    (step) => step.operation === "request-workflow-open",
  );
}

// ─── Type guards ────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorOrchestrationState(
  value: unknown,
): value is RuntimeExecutiveAdvisorOrchestrationState {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorOrchestrationMode(
  value: unknown,
): value is RuntimeExecutiveAdvisorOrchestrationMode {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorExperiencePhase(
  value: unknown,
): value is RuntimeExecutiveAdvisorExperiencePhase {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorOrchestrationTrigger(
  value: unknown,
): value is RuntimeExecutiveAdvisorOrchestrationTrigger {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorPresentationIntent(
  value: unknown,
): value is RuntimeExecutiveAdvisorPresentationIntent {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorGuidanceVisibility(
  value: unknown,
): value is RuntimeExecutiveAdvisorGuidanceVisibility {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorActionVisibility(
  value: unknown,
): value is RuntimeExecutiveAdvisorActionVisibility {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorCoordinationExecutionIntent(
  value: unknown,
): value is RuntimeExecutiveAdvisorCoordinationExecutionIntent {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorExperienceTransitionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorExperienceTransitionKind {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorContextFreshness(
  value: unknown,
): value is RuntimeExecutiveAdvisorContextFreshness {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorExperienceInterruptionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorExperienceInterruptionKind {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS as readonly string[]
    ).includes(value)
  );
}

// ─── Empty orchestration ────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN:
  RuntimeExecutiveAdvisorExperienceOrchestrationPlan = Object.freeze({
    state: "idle",
    mode: "passive",
    trigger: "runtime-context",
    steps: Object.freeze([] as RuntimeExecutiveAdvisorOrchestrationStep[]),
    transitions: Object.freeze(
      [] as RuntimeExecutiveAdvisorExperienceTransition[],
    ),
    freshness: "current",
    interruption: null,
    stability: "stable",
    isStable: true,
    isExecutable: false,
    orchestrationIdentity:
      runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
    orchestrationVersion:
      runtimeExecutiveAdvisorExperienceOrchestrationVersion,
    coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
    coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
  });

// ─── Resolvers ──────────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveAdvisorContextFreshness(input: {
  readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
}): RuntimeExecutiveAdvisorContextFreshness {
  const signals = input.signals ?? {};
  if (
    input.trigger === "context-invalidated" ||
    signals.contextSubjectId === null ||
    (signals.experienceSubjectId !== undefined &&
      signals.experienceSubjectId !== null &&
      signals.contextSubjectId === undefined)
  ) {
    if (
      input.trigger === "context-invalidated" ||
      signals.contextSubjectId === null
    ) {
      return "invalid";
    }
  }

  if (
    signals.contextSubjectId !== undefined &&
    signals.experienceSubjectId !== undefined &&
    signals.experienceSubjectId !== null &&
    signals.contextSubjectId !== signals.experienceSubjectId
  ) {
    return "stale";
  }

  if (
    input.trigger === "subject-change" ||
    input.trigger === "stage-selection" ||
    signals.interruption === "subject-changed" ||
    signals.interruption === "selection-changed"
  ) {
    if (
      signals.experienceSubjectId !== undefined &&
      signals.experienceSubjectId !== null &&
      signals.contextSubjectId !== undefined &&
      signals.contextSubjectId !== signals.experienceSubjectId
    ) {
      return "stale";
    }
  }

  return "current";
}

export function resolveRuntimeExecutiveAdvisorExperienceInterruption(input: {
  readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
}): RuntimeExecutiveAdvisorExperienceInterruptionKind | null {
  const signals = input.signals ?? {};
  if (signals.interruption) {
    return signals.interruption;
  }
  if (input.trigger === "dismiss") {
    return "dismissed";
  }
  if (input.trigger === "subject-change") {
    return "subject-changed";
  }
  if (input.trigger === "stage-selection") {
    return "selection-changed";
  }
  if (input.trigger === "stage-focus") {
    return "focus-changed";
  }
  if (input.trigger === "context-invalidated") {
    return "subject-changed";
  }
  if (input.coordinationPlan.state === "blocked") {
    return "coordination-blocked";
  }
  if (
    input.coordinationPlan.blockedStepIds.length > 0 &&
    input.coordinationPlan.isReady === false &&
    input.coordinationPlan.steps.length > 0 &&
    input.coordinationPlan.steps.every((step) => step.blocked)
  ) {
    return "coordination-blocked";
  }
  return null;
}

export function resolveRuntimeExecutiveAdvisorOrchestrationMode(input: {
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
  readonly freshness?: RuntimeExecutiveAdvisorContextFreshness;
}): RuntimeExecutiveAdvisorOrchestrationMode {
  const signals = signalsOf({
    coordinationPlan: input.coordinationPlan,
    trigger: "runtime-context",
    signals: input.signals,
  });
  const plan = input.coordinationPlan;

  if (plan.state === "none" && !signals.hasResponse && !signals.hasGuidance) {
    return "passive";
  }

  const coordinationReady =
    isRuntimeExecutiveAdvisorStageCoordinationReady(plan) ||
    (plan.state === "ready" && plan.isReady);

  if (coordinationReady && signals.hasGuidance) {
    return "coordinated";
  }

  if (signals.hasGuidance || plan.steps.length > 0) {
    // Guidance without ready coordination, or deferred confirmation.
    if (!coordinationReady) {
      return signals.hasGuidance || plan.steps.length > 0
        ? "guidance"
        : signals.hasResponse
          ? "responsive"
          : "passive";
    }
  }

  if (signals.hasResponse && !signals.hasGuidance && plan.steps.length === 0) {
    return "responsive";
  }

  if (plan.steps.length === 0 && !signals.hasGuidance) {
    return signals.hasResponse ? "responsive" : "passive";
  }

  if (coordinationReady) {
    return "coordinated";
  }

  if (signals.hasGuidance || plan.steps.length > 0) {
    return "guidance";
  }

  return signals.hasResponse ? "responsive" : "passive";
}

export function resolveRuntimeExecutiveAdvisorExperiencePhases(
  mode: RuntimeExecutiveAdvisorOrchestrationMode,
): ReadonlyArray<RuntimeExecutiveAdvisorExperiencePhase> {
  switch (mode) {
    case "passive":
      return Object.freeze(["observe", "settle"]);
    case "responsive":
      return Object.freeze(["observe", "understand", "respond", "settle"]);
    case "guidance":
      return Object.freeze([
        "observe",
        "understand",
        "respond",
        "guide",
        "settle",
      ]);
    case "coordinated":
      return Object.freeze([
        "observe",
        "understand",
        "respond",
        "guide",
        "coordinate",
        "settle",
      ]);
  }
}

export function resolveRuntimeExecutiveAdvisorPresentationIntent(input: {
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly state?: RuntimeExecutiveAdvisorOrchestrationState;
  readonly trigger?: RuntimeExecutiveAdvisorOrchestrationTrigger;
}): RuntimeExecutiveAdvisorPresentationIntent {
  if (
    input.state === "idle" ||
    input.trigger === "dismiss" ||
    input.state === "completed"
  ) {
    return "hidden";
  }
  switch (input.mode) {
    case "passive":
      return "signal";
    case "responsive":
      return "summary";
    case "guidance":
      return "guidance";
    case "coordinated":
      return "operation";
  }
}

export function resolveRuntimeExecutiveAdvisorGuidanceVisibility(input: {
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
  readonly state?: RuntimeExecutiveAdvisorOrchestrationState;
  readonly trigger?: RuntimeExecutiveAdvisorOrchestrationTrigger;
}): RuntimeExecutiveAdvisorGuidanceVisibility {
  if (
    input.trigger === "dismiss" ||
    input.state === "idle" ||
    input.state === "completed" ||
    input.mode === "passive"
  ) {
    return "hidden";
  }
  const signals = input.signals ?? {};
  if (!signals.hasGuidance && input.mode === "responsive") {
    return "available";
  }
  if (!signals.hasGuidance && input.mode !== "guidance" && input.mode !== "coordinated") {
    return "hidden";
  }
  if (signals.hasAlternativeGuidance && signals.hasPrimaryGuidance) {
    return "expanded";
  }
  if (signals.hasPrimaryGuidance || input.mode === "coordinated" || input.mode === "guidance") {
    return "primary";
  }
  if (signals.hasGuidance) {
    return "available";
  }
  return "hidden";
}

export function resolveRuntimeExecutiveAdvisorActionVisibility(input: {
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
  readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
  readonly trigger?: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly state?: RuntimeExecutiveAdvisorOrchestrationState;
}): RuntimeExecutiveAdvisorActionVisibility {
  if (
    input.trigger === "dismiss" ||
    input.state === "idle" ||
    input.state === "completed" ||
    input.mode === "passive" ||
    input.mode === "responsive"
  ) {
    return "hidden";
  }

  const hint = input.signals?.actionVisibilityHint;
  if (hint) {
    return hint;
  }

  const plan = input.coordinationPlan;
  const confirmed = input.signals?.managerConfirmed === true;

  // Confirmation-gated workflows outrank generic blocked visibility.
  if (!confirmed && (hasConfirmationDeferredSteps(plan) || hasWorkflowOpen(plan))) {
    if (hasConfirmationDeferredSteps(plan)) {
      return "confirmation-required";
    }
    if (
      hasWorkflowOpen(plan) &&
      plan.steps.some(
        (step) =>
          step.operation === "request-workflow-open" &&
          step.authority !== "manager-confirmed",
      )
    ) {
      return "confirmation-required";
    }
  }

  if (
    plan.state === "blocked" &&
    plan.steps.length > 0 &&
    plan.steps.every((step) => step.blocked) &&
    !hasConfirmationDeferredSteps(plan)
  ) {
    return "blocked";
  }
  if (readyCoordinationSteps(plan).length > 0 || plan.steps.length > 0) {
    return "available";
  }
  return "hidden";
}

export function resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent(
  input: {
    readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
    readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
    readonly signals?: RuntimeExecutiveAdvisorOrchestrationSignals;
    readonly actionVisibility?: RuntimeExecutiveAdvisorActionVisibility;
    readonly freshness?: RuntimeExecutiveAdvisorContextFreshness;
    readonly state?: RuntimeExecutiveAdvisorOrchestrationState;
    readonly trigger?: RuntimeExecutiveAdvisorOrchestrationTrigger;
  },
): RuntimeExecutiveAdvisorCoordinationExecutionIntent {
  if (
    input.trigger === "dismiss" ||
    input.state === "idle" ||
    input.state === "completed" ||
    input.state === "suspended" ||
    input.freshness === "stale" ||
    input.freshness === "invalid" ||
    input.mode === "passive" ||
    input.mode === "responsive"
  ) {
    return "none";
  }

  const plan = input.coordinationPlan;
  const actionVisibility = input.actionVisibility ?? "hidden";

  if (actionVisibility === "confirmation-required") {
    return "defer";
  }
  if (actionVisibility === "blocked" || plan.state === "blocked") {
    return "none";
  }
  if (
    isRuntimeExecutiveAdvisorStageCoordinationReady(plan) ||
    (plan.state === "ready" && plan.isReady)
  ) {
    return "ready";
  }
  if (plan.state === "planned" || plan.steps.length > 0) {
    return "request";
  }
  return "none";
}

export function resolveRuntimeExecutiveAdvisorExperienceTransitions(
  phases: ReadonlyArray<RuntimeExecutiveAdvisorExperiencePhase>,
  input: {
    readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
    readonly freshness: RuntimeExecutiveAdvisorContextFreshness;
    readonly interruption: RuntimeExecutiveAdvisorExperienceInterruptionKind | null;
    readonly previouslyActive?: boolean;
  },
): ReadonlyArray<RuntimeExecutiveAdvisorExperienceTransition> {
  if (phases.length === 0) {
    return Object.freeze([]);
  }

  const transitions: RuntimeExecutiveAdvisorExperienceTransition[] = [];

  if (input.trigger === "dismiss" || input.interruption === "dismissed") {
    transitions.push(
      Object.freeze({
        id: "transition:0:dismiss",
        kind: "dismiss" as const,
        fromPhase: phases[0] ?? null,
        toPhase: "settle",
      }),
    );
    return Object.freeze(transitions);
  }

  if (input.freshness === "stale") {
    transitions.push(
      Object.freeze({
        id: "transition:0:hold",
        kind: "hold" as const,
        fromPhase: input.previouslyActive ? phases[0]! : null,
        toPhase: null,
      }),
    );
    return Object.freeze(transitions);
  }

  if (input.freshness === "invalid") {
    transitions.push(
      Object.freeze({
        id: "transition:0:settle",
        kind: "settle" as const,
        fromPhase: input.previouslyActive ? phases[0]! : null,
        toPhase: "settle",
      }),
    );
    return Object.freeze(transitions);
  }

  if (input.previouslyActive && input.interruption === "manager-action") {
    transitions.push(
      Object.freeze({
        id: "transition:0:hold",
        kind: "hold" as const,
        fromPhase: phases[0] ?? null,
        toPhase: null,
      }),
    );
  }

  transitions.push(
    Object.freeze({
      id: "transition:enter",
      kind: "enter" as const,
      fromPhase: null,
      toPhase: phases[0]!,
    }),
  );

  for (let index = 0; index < phases.length - 1; index += 1) {
    transitions.push(
      Object.freeze({
        id: `transition:advance:${phases[index]}→${phases[index + 1]}`,
        kind: "advance" as const,
        fromPhase: phases[index]!,
        toPhase: phases[index + 1]!,
      }),
    );
  }

  transitions.push(
    Object.freeze({
      id: "transition:settle",
      kind: "settle" as const,
      fromPhase: phases[phases.length - 1]!,
      toPhase: "settle",
    }),
  );

  return Object.freeze(transitions);
}

function resolveOrchestrationState(input: {
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly trigger: RuntimeExecutiveAdvisorOrchestrationTrigger;
  readonly freshness: RuntimeExecutiveAdvisorContextFreshness;
  readonly interruption: RuntimeExecutiveAdvisorExperienceInterruptionKind | null;
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
  readonly previouslyActive: boolean;
  readonly coordinationExecutionIntent: RuntimeExecutiveAdvisorCoordinationExecutionIntent;
}): RuntimeExecutiveAdvisorOrchestrationState {
  if (input.trigger === "dismiss" || input.interruption === "dismissed") {
    return "completed";
  }
  if (input.freshness === "invalid") {
    return "completed";
  }
  if (input.freshness === "stale") {
    return "suspended";
  }
  if (
    input.interruption === "manager-action" &&
    input.previouslyActive
  ) {
    return "suspended";
  }
  if (
    input.coordinationPlan.state === "blocked" &&
    input.mode !== "passive" &&
    input.coordinationExecutionIntent !== "ready"
  ) {
    // Keep useful context; mark blocked when coordination cannot proceed.
    if (
      input.coordinationPlan.steps.length > 0 &&
      input.coordinationPlan.steps.every((step) => step.blocked)
    ) {
      return "blocked";
    }
  }
  if (
    input.coordinationPlan.state === "none" &&
    input.mode === "passive"
  ) {
    return input.previouslyActive ? "completed" : "idle";
  }
  if (
    input.coordinationExecutionIntent === "ready" ||
    input.mode === "coordinated" ||
    input.mode === "guidance" ||
    input.mode === "responsive"
  ) {
    return "active";
  }
  if (input.coordinationPlan.steps.length > 0) {
    return "prepared";
  }
  return "idle";
}

function resolveStability(input: {
  readonly state: RuntimeExecutiveAdvisorOrchestrationState;
  readonly freshness: RuntimeExecutiveAdvisorContextFreshness;
  readonly phases: ReadonlyArray<RuntimeExecutiveAdvisorExperiencePhase>;
  readonly steps: ReadonlyArray<RuntimeExecutiveAdvisorOrchestrationStep>;
  readonly coordinationExecutionIntent: RuntimeExecutiveAdvisorCoordinationExecutionIntent;
  readonly actionVisibility: RuntimeExecutiveAdvisorActionVisibility;
}): RuntimeExecutiveAdvisorOrchestrationStability {
  if (input.freshness === "stale" || input.state === "suspended") {
    return "unstable";
  }
  if (input.state === "blocked") {
    return "unstable";
  }
  if (
    input.actionVisibility === "confirmation-required" &&
    input.coordinationExecutionIntent === "defer"
  ) {
    return "settling";
  }
  if (input.state === "prepared") {
    return "settling";
  }
  // Canonical phase order check.
  for (let index = 1; index < input.phases.length; index += 1) {
    if (phaseIndex(input.phases[index]!) < phaseIndex(input.phases[index - 1]!)) {
      return "unstable";
    }
  }
  if (
    input.freshness === "current" &&
    (input.state === "active" ||
      input.state === "idle" ||
      input.state === "completed") &&
    input.steps.length === input.phases.length
  ) {
    return "stable";
  }
  return "settling";
}

function buildSteps(input: {
  readonly phases: ReadonlyArray<RuntimeExecutiveAdvisorExperiencePhase>;
  readonly mode: RuntimeExecutiveAdvisorOrchestrationMode;
  readonly presentationIntent: RuntimeExecutiveAdvisorPresentationIntent;
  readonly guidanceVisibility: RuntimeExecutiveAdvisorGuidanceVisibility;
  readonly actionVisibility: RuntimeExecutiveAdvisorActionVisibility;
  readonly coordinationExecutionIntent: RuntimeExecutiveAdvisorCoordinationExecutionIntent;
  readonly coordinationPlan: RuntimeExecutiveAdvisorStageCoordinationPlan;
}): ReadonlyArray<RuntimeExecutiveAdvisorOrchestrationStep> {
  const readyIds = readyCoordinationSteps(input.coordinationPlan).map(
    (step) => step.id,
  );
  const allIds = input.coordinationPlan.steps.map((step) => step.id);

  return Object.freeze(
    input.phases.map((phase, index) => {
      const isGuide = phase === "guide";
      const isCoordinate = phase === "coordinate";
      const isSettle = phase === "settle";
      const isRespond = phase === "respond";

      const presentationIntent =
        phase === "observe"
          ? input.mode === "passive"
            ? ("signal" as const)
            : ("hidden" as const)
          : phase === "understand"
            ? ("summary" as const)
            : isRespond
              ? input.mode === "responsive"
                ? ("summary" as const)
                : input.presentationIntent === "operation"
                  ? ("summary" as const)
                  : input.presentationIntent
              : isGuide
                ? ("guidance" as const)
                : isCoordinate
                  ? ("operation" as const)
                  : isSettle
                    ? input.presentationIntent
                    : input.presentationIntent;

      const guidanceVisibility =
        isGuide || isCoordinate || (isSettle && input.mode !== "passive")
          ? input.guidanceVisibility
          : phase === "respond" && input.mode === "responsive"
            ? ("available" as const)
            : ("hidden" as const);

      const actionVisibility =
        isGuide || isCoordinate
          ? input.actionVisibility
          : isSettle &&
              (input.mode === "guidance" || input.mode === "coordinated")
            ? input.actionVisibility
            : ("hidden" as const);

      const coordinationExecutionIntent =
        isCoordinate
          ? input.coordinationExecutionIntent
          : isSettle && input.mode === "coordinated"
            ? input.coordinationExecutionIntent
            : ("none" as const);

      const coordinationStepIds =
        isCoordinate || (isSettle && input.mode === "coordinated")
          ? input.coordinationExecutionIntent === "ready"
            ? readyIds
            : allIds
          : Object.freeze([] as string[]);

      return Object.freeze({
        id: `orch:${index}:${phase}`,
        phase,
        presentationIntent,
        guidanceVisibility,
        actionVisibility,
        coordinationExecutionIntent,
        coordinationStepIds: Object.freeze([...coordinationStepIds]),
      });
    }),
  );
}

/**
 * Primary REX-3:6 operation: resolve a complete Advisor experience orchestration.
 */
export function resolveRuntimeExecutiveAdvisorExperienceOrchestration(
  input: RuntimeExecutiveAdvisorOrchestrationInput,
): RuntimeExecutiveAdvisorExperienceOrchestrationResult {
  const planValidation = validateRuntimeExecutiveAdvisorStageCoordinationPlan(
    input.coordinationPlan,
  );
  const signals = signalsOf(input);

  const isEmptyCoordination =
    input.coordinationPlan.state === "none" &&
    input.coordinationPlan.steps.length === 0;

  if (
    isEmptyCoordination &&
    !signals.hasResponse &&
    !signals.hasGuidance &&
    input.trigger !== "dismiss" &&
    input.trigger !== "context-invalidated" &&
    !signals.interruption
  ) {
    const empty = RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN;
    return Object.freeze({
      plan: Object.freeze({
        ...empty,
        trigger: input.trigger,
      }),
      activeStep: null,
      currentPhase: null,
      freshness: "current" as const,
    });
  }

  // Invalid coordination metadata still allows empty/idle if plan is the empty constant.
  if (
    !planValidation.ok &&
    input.coordinationPlan ===
      RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN
  ) {
    return Object.freeze({
      plan: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN,
      activeStep: null,
      currentPhase: null,
      freshness: "current" as const,
    });
  }

  const freshness = resolveRuntimeExecutiveAdvisorContextFreshness({
    trigger: input.trigger,
    signals,
  });

  let interruption = resolveRuntimeExecutiveAdvisorExperienceInterruption({
    trigger: input.trigger,
    signals,
    coordinationPlan: input.coordinationPlan,
  });

  // Manager authority protection: manager interruptions outrank continuation.
  if (signals.interruption === "manager-action") {
    interruption = "manager-action";
  }
  if (
    interruption &&
    signals.interruption &&
    interruptionPriority(signals.interruption) > interruptionPriority(interruption)
  ) {
    interruption = signals.interruption;
  }

  // Dismiss path.
  if (input.trigger === "dismiss" || interruption === "dismissed") {
    const phases = Object.freeze(["settle"] as const);
    const steps = Object.freeze([
      Object.freeze({
        id: "orch:0:settle",
        phase: "settle" as const,
        presentationIntent: "hidden" as const,
        guidanceVisibility: "hidden" as const,
        actionVisibility: "hidden" as const,
        coordinationExecutionIntent: "none" as const,
        coordinationStepIds: Object.freeze([] as string[]),
      }),
    ]);
    const transitions = resolveRuntimeExecutiveAdvisorExperienceTransitions(
      phases,
      {
        trigger: "dismiss",
        freshness: "current",
        interruption: "dismissed",
        previouslyActive: signals.previouslyActive,
      },
    );
    const plan = Object.freeze({
      state: "completed" as const,
      mode: "passive" as const,
      trigger: input.trigger,
      steps,
      transitions,
      freshness: "current" as const,
      interruption: "dismissed" as const,
      stability: "stable" as const,
      isStable: true,
      isExecutable: false,
      orchestrationIdentity:
        runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveAdvisorExperienceOrchestrationVersion,
      coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
      coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    });
    return Object.freeze({
      plan,
      activeStep: steps[0]!,
      currentPhase: "settle" as const,
      freshness: "current" as const,
    });
  }

  // Invalid context → settle/dismiss semantics.
  if (freshness === "invalid") {
    const phases = Object.freeze(["settle"] as const);
    const steps = Object.freeze([
      Object.freeze({
        id: "orch:0:settle",
        phase: "settle" as const,
        presentationIntent: "hidden" as const,
        guidanceVisibility: "hidden" as const,
        actionVisibility: "hidden" as const,
        coordinationExecutionIntent: "none" as const,
        coordinationStepIds: Object.freeze([] as string[]),
      }),
    ]);
    const plan = Object.freeze({
      state: "completed" as const,
      mode: "passive" as const,
      trigger: input.trigger,
      steps,
      transitions: resolveRuntimeExecutiveAdvisorExperienceTransitions(phases, {
        trigger: input.trigger,
        freshness,
        interruption,
        previouslyActive: signals.previouslyActive,
      }),
      freshness,
      interruption,
      stability: "stable" as const,
      isStable: true,
      isExecutable: false,
      orchestrationIdentity:
        runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveAdvisorExperienceOrchestrationVersion,
      coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
      coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    });
    return Object.freeze({
      plan,
      activeStep: steps[0]!,
      currentPhase: "settle",
      freshness,
    });
  }

  // Stale context → suspend; do not continue active guidance against wrong subject.
  if (freshness === "stale" || interruption === "manager-action") {
    const priorMode = resolveRuntimeExecutiveAdvisorOrchestrationMode({
      coordinationPlan: input.coordinationPlan,
      signals,
      freshness,
    });
    const phases = resolveRuntimeExecutiveAdvisorExperiencePhases(priorMode);
    const steps = Object.freeze([
      Object.freeze({
        id: "orch:0:hold",
        phase: "settle" as const,
        presentationIntent: "hidden" as const,
        guidanceVisibility: "hidden" as const,
        actionVisibility: "hidden" as const,
        coordinationExecutionIntent: "none" as const,
        coordinationStepIds: Object.freeze([] as string[]),
      }),
    ]);
    const plan = Object.freeze({
      state: "suspended" as const,
      mode: priorMode,
      trigger: input.trigger,
      steps,
      transitions: resolveRuntimeExecutiveAdvisorExperienceTransitions(phases, {
        trigger: input.trigger,
        freshness: freshness === "stale" ? "stale" : "current",
        interruption: interruption ?? "subject-changed",
        previouslyActive: true,
      }),
      freshness: freshness === "stale" ? ("stale" as const) : ("current" as const),
      interruption: interruption ?? "subject-changed",
      stability: "unstable" as const,
      isStable: false,
      isExecutable: false,
      orchestrationIdentity:
        runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveAdvisorExperienceOrchestrationVersion,
      coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
      coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    });
    return Object.freeze({
      plan,
      activeStep: steps[0]!,
      currentPhase: "settle",
      freshness: plan.freshness,
    });
  }

  const mode = resolveRuntimeExecutiveAdvisorOrchestrationMode({
    coordinationPlan: input.coordinationPlan,
    signals,
    freshness,
  });
  const phases = resolveRuntimeExecutiveAdvisorExperiencePhases(mode);

  const provisionalState = resolveOrchestrationState({
    mode,
    trigger: input.trigger,
    freshness,
    interruption,
    coordinationPlan: input.coordinationPlan,
    previouslyActive: signals.previouslyActive,
    coordinationExecutionIntent: "none",
  });

  const presentationIntent = resolveRuntimeExecutiveAdvisorPresentationIntent({
    mode,
    state: provisionalState,
    trigger: input.trigger,
  });
  const guidanceVisibility = resolveRuntimeExecutiveAdvisorGuidanceVisibility({
    mode,
    signals,
    state: provisionalState,
    trigger: input.trigger,
  });
  const actionVisibility = resolveRuntimeExecutiveAdvisorActionVisibility({
    mode,
    coordinationPlan: input.coordinationPlan,
    signals,
    trigger: input.trigger,
    state: provisionalState,
  });
  const coordinationExecutionIntent =
    resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent({
      mode,
      coordinationPlan: input.coordinationPlan,
      signals,
      actionVisibility,
      freshness,
      state: provisionalState,
      trigger: input.trigger,
    });

  const state = resolveOrchestrationState({
    mode,
    trigger: input.trigger,
    freshness,
    interruption,
    coordinationPlan: input.coordinationPlan,
    previouslyActive: signals.previouslyActive,
    coordinationExecutionIntent,
  });

  // Re-resolve presentation for final state (blocked keeps guidance context).
  const finalPresentation =
    state === "blocked"
      ? mode === "coordinated" || mode === "guidance"
        ? ("guidance" as const)
        : presentationIntent
      : resolveRuntimeExecutiveAdvisorPresentationIntent({
          mode,
          state,
          trigger: input.trigger,
        });
  const finalGuidanceVisibility =
    state === "blocked"
      ? guidanceVisibility === "hidden"
        ? ("available" as const)
        : guidanceVisibility
      : resolveRuntimeExecutiveAdvisorGuidanceVisibility({
          mode,
          signals,
          state,
          trigger: input.trigger,
        });
  const finalActionVisibility =
    state === "blocked"
      ? ("blocked" as const)
      : resolveRuntimeExecutiveAdvisorActionVisibility({
          mode,
          coordinationPlan: input.coordinationPlan,
          signals,
          trigger: input.trigger,
          state,
        });
  const finalCoordinationIntent =
    state === "blocked"
      ? ("none" as const)
      : resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent({
          mode,
          coordinationPlan: input.coordinationPlan,
          signals,
          actionVisibility: finalActionVisibility,
          freshness,
          state,
          trigger: input.trigger,
        });

  const steps = buildSteps({
    phases,
    mode,
    presentationIntent: finalPresentation,
    guidanceVisibility: finalGuidanceVisibility,
    actionVisibility: finalActionVisibility,
    coordinationExecutionIntent: finalCoordinationIntent,
    coordinationPlan: input.coordinationPlan,
  });

  const transitions = resolveRuntimeExecutiveAdvisorExperienceTransitions(
    phases,
    {
      trigger: input.trigger,
      freshness,
      interruption,
      previouslyActive: signals.previouslyActive,
    },
  );

  const stability = resolveStability({
    state,
    freshness,
    phases,
    steps,
    coordinationExecutionIntent: finalCoordinationIntent,
    actionVisibility: finalActionVisibility,
  });

  const isStable = stability === "stable";
  const isExecutable =
    isStable &&
    state === "active" &&
    finalCoordinationIntent === "ready" &&
    finalActionVisibility !== "confirmation-required" &&
    finalActionVisibility !== "blocked" &&
    input.coordinationPlan.state === "ready" &&
    input.coordinationPlan.isReady === true;

  const orchestrationPlan: RuntimeExecutiveAdvisorExperienceOrchestrationPlan =
    Object.freeze({
      state,
      mode,
      trigger: input.trigger,
      steps,
      transitions,
      freshness,
      interruption,
      stability,
      isStable,
      isExecutable,
      orchestrationIdentity:
        runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
      orchestrationVersion:
        runtimeExecutiveAdvisorExperienceOrchestrationVersion,
      coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
      coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    });

  const activeStep =
    steps.find((step) => step.phase === "coordinate") ??
    steps.find((step) => step.phase === "guide") ??
    steps.find((step) => step.phase === "respond") ??
    steps.find((step) => step.phase === "settle") ??
    steps[0] ??
    null;

  return Object.freeze({
    plan: orchestrationPlan,
    activeStep,
    currentPhase: activeStep?.phase ?? null,
    freshness,
  });
}

export function isRuntimeExecutiveAdvisorExperienceStable(
  plan: RuntimeExecutiveAdvisorExperienceOrchestrationPlan,
): boolean {
  return (
    plan.isStable === true &&
    plan.stability === "stable" &&
    plan.freshness === "current" &&
    plan.state !== "suspended" &&
    plan.state !== "blocked"
  );
}

export function isRuntimeExecutiveAdvisorExperienceExecutable(
  plan: RuntimeExecutiveAdvisorExperienceOrchestrationPlan,
): boolean {
  return (
    plan.isExecutable === true &&
    isRuntimeExecutiveAdvisorExperienceStable(plan) &&
    plan.state === "active" &&
    plan.steps.some(
      (step) => step.coordinationExecutionIntent === "ready",
    )
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorExperienceOrchestration(
  value: unknown,
): RuntimeExecutiveAdvisorOrchestrationValidationResult {
  const issues: RuntimeExecutiveAdvisorOrchestrationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-orchestration", "orchestration plan must be an object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorOrchestrationState(value.state)) {
    issues.push(issue("invalid-state", "state invalid", "state"));
  }
  if (!isRuntimeExecutiveAdvisorOrchestrationMode(value.mode)) {
    issues.push(issue("invalid-mode", "mode invalid", "mode"));
  }
  if (!isRuntimeExecutiveAdvisorOrchestrationTrigger(value.trigger)) {
    issues.push(issue("invalid-trigger", "trigger invalid", "trigger"));
  }
  if (!isRuntimeExecutiveAdvisorContextFreshness(value.freshness)) {
    issues.push(issue("invalid-freshness", "freshness invalid", "freshness"));
  }
  if (
    value.interruption !== null &&
    !isRuntimeExecutiveAdvisorExperienceInterruptionKind(value.interruption)
  ) {
    issues.push(
      issue("invalid-interruption", "interruption invalid", "interruption"),
    );
  }
  if (typeof value.isStable !== "boolean") {
    issues.push(issue("invalid-is-stable", "isStable must be boolean", "isStable"));
  }
  if (typeof value.isExecutable !== "boolean") {
    issues.push(
      issue("invalid-is-executable", "isExecutable must be boolean", "isExecutable"),
    );
  }

  if (!Array.isArray(value.steps)) {
    issues.push(issue("invalid-steps", "steps must be an array", "steps"));
  } else {
    const ids: string[] = [];
    const phases: RuntimeExecutiveAdvisorExperiencePhase[] = [];
    value.steps.forEach((step, index) => {
      if (!isPlainObject(step)) {
        issues.push(issue("invalid-step", "step invalid", `steps[${index}]`));
        return;
      }
      if (!isNonEmptyString(step.id)) {
        issues.push(
          issue("invalid-step-id", "step id required", `steps[${index}].id`),
        );
      } else {
        ids.push(step.id);
      }
      if (!isRuntimeExecutiveAdvisorExperiencePhase(step.phase)) {
        issues.push(
          issue("invalid-phase", "phase invalid", `steps[${index}].phase`),
        );
      } else {
        phases.push(step.phase);
      }
      if (!isRuntimeExecutiveAdvisorPresentationIntent(step.presentationIntent)) {
        issues.push(
          issue(
            "invalid-presentation-intent",
            "presentationIntent invalid",
            `steps[${index}].presentationIntent`,
          ),
        );
      }
      if (!isRuntimeExecutiveAdvisorGuidanceVisibility(step.guidanceVisibility)) {
        issues.push(
          issue(
            "invalid-guidance-visibility",
            "guidanceVisibility invalid",
            `steps[${index}].guidanceVisibility`,
          ),
        );
      }
      if (!isRuntimeExecutiveAdvisorActionVisibility(step.actionVisibility)) {
        issues.push(
          issue(
            "invalid-action-visibility",
            "actionVisibility invalid",
            `steps[${index}].actionVisibility`,
          ),
        );
      }
      if (
        !isRuntimeExecutiveAdvisorCoordinationExecutionIntent(
          step.coordinationExecutionIntent,
        )
      ) {
        issues.push(
          issue(
            "invalid-coordination-execution-intent",
            "coordinationExecutionIntent invalid",
            `steps[${index}].coordinationExecutionIntent`,
          ),
        );
      }
      if (!Array.isArray(step.coordinationStepIds)) {
        issues.push(
          issue(
            "invalid-coordination-step-ids",
            "coordinationStepIds must be an array",
            `steps[${index}].coordinationStepIds`,
          ),
        );
      }
      if (
        step.actionVisibility === "confirmation-required" &&
        step.coordinationExecutionIntent === "ready"
      ) {
        issues.push(
          issue(
            "confirmation-ready-inconsistency",
            "confirmation-required cannot be ready",
            `steps[${index}]`,
          ),
        );
      }
    });

    if (!unique(ids)) {
      issues.push(issue("duplicate-step-ids", "step ids must be unique", "steps"));
    }
    for (let index = 1; index < phases.length; index += 1) {
      if (phaseIndex(phases[index]!) < phaseIndex(phases[index - 1]!)) {
        issues.push(
          issue(
            "phase-order-violation",
            "experience phases must follow canonical order",
            "steps",
          ),
        );
        break;
      }
    }
  }

  if (Array.isArray(value.transitions)) {
    value.transitions.forEach((transition, index) => {
      if (
        !isPlainObject(transition) ||
        !isRuntimeExecutiveAdvisorExperienceTransitionKind(transition.kind)
      ) {
        issues.push(
          issue(
            "invalid-transition",
            "transition invalid",
            `transitions[${index}]`,
          ),
        );
      }
    });
  } else {
    issues.push(
      issue("invalid-transitions", "transitions must be an array", "transitions"),
    );
  }

  if (value.freshness === "stale" && value.state === "active") {
    issues.push(
      issue(
        "stale-active-inconsistency",
        "stale context cannot remain active",
        "state",
      ),
    );
  }
  if (value.state === "blocked" && value.isExecutable === true) {
    issues.push(
      issue(
        "blocked-executable-inconsistency",
        "blocked orchestration cannot be executable",
        "isExecutable",
      ),
    );
  }
  if (value.isExecutable === true && value.isStable !== true) {
    issues.push(
      issue(
        "executable-requires-stable",
        "executable plans must be stable",
        "isExecutable",
      ),
    );
  }
  if (value.isStable === true && value.stability === "unstable") {
    issues.push(
      issue(
        "stable-flag-inconsistency",
        "isStable inconsistent with stability",
        "isStable",
      ),
    );
  }
  if (value.state === "idle") {
    if (
      (Array.isArray(value.steps) && value.steps.length > 0) ||
      value.isExecutable === true
    ) {
      issues.push(
        issue(
          "idle-inconsistency",
          "idle orchestration must have empty steps and isExecutable=false",
          "state",
        ),
      );
    }
  }

  if (
    value.orchestrationIdentity !==
      runtimeExecutiveAdvisorExperienceOrchestrationIdentity ||
    value.orchestrationVersion !==
      runtimeExecutiveAdvisorExperienceOrchestrationVersion
  ) {
    issues.push(
      issue(
        "invalid-orchestration-metadata",
        "orchestration identity/version metadata is invalid",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorExperienceOrchestrationIdentity():
  typeof runtimeExecutiveAdvisorExperienceOrchestrationCanonicalIdentity {
  return runtimeExecutiveAdvisorExperienceOrchestrationCanonicalIdentity;
}

/**
 * Additive consumer publication for REX-3:7+: keep platform consumers on the
 * REX-3:6 surface without importing REX-3:5 directly. Does not alter orchestration.
 */
export { RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN };

export {
  assembleRuntimeExecutiveAdvisorGuidancePackage,
  resolveRuntimeExecutiveAdvisorStageCoordinationPlan,
} from "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination";

export type {
  RuntimeExecutiveAdvisorExecutiveAction,
  RuntimeExecutiveAdvisorGuidance,
  RuntimeExecutiveAdvisorGuidancePackage,
  RuntimeExecutiveAdvisorStageCoordinationContext,
  RuntimeExecutiveAdvisorStageCoordinationPlan,
} from "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination";

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceOrchestrationApiNames =
  Object.freeze([
    "resolveRuntimeExecutiveAdvisorExperienceOrchestration",
    "resolveRuntimeExecutiveAdvisorOrchestrationMode",
    "resolveRuntimeExecutiveAdvisorExperiencePhases",
    "resolveRuntimeExecutiveAdvisorPresentationIntent",
    "resolveRuntimeExecutiveAdvisorGuidanceVisibility",
    "resolveRuntimeExecutiveAdvisorActionVisibility",
    "resolveRuntimeExecutiveAdvisorCoordinationExecutionIntent",
    "resolveRuntimeExecutiveAdvisorExperienceTransitions",
    "resolveRuntimeExecutiveAdvisorContextFreshness",
    "resolveRuntimeExecutiveAdvisorExperienceInterruption",
    "isRuntimeExecutiveAdvisorExperienceStable",
    "isRuntimeExecutiveAdvisorExperienceExecutable",
    "validateRuntimeExecutiveAdvisorExperienceOrchestration",
    "verifyRuntimeExecutiveAdvisorExperienceOrchestration",
    "getRuntimeExecutiveAdvisorExperienceOrchestrationIdentity",
    "isRuntimeExecutiveAdvisorOrchestrationState",
    "isRuntimeExecutiveAdvisorOrchestrationMode",
    "isRuntimeExecutiveAdvisorExperiencePhase",
    "isRuntimeExecutiveAdvisorOrchestrationTrigger",
    "isRuntimeExecutiveAdvisorPresentationIntent",
    "isRuntimeExecutiveAdvisorGuidanceVisibility",
    "isRuntimeExecutiveAdvisorActionVisibility",
    "isRuntimeExecutiveAdvisorCoordinationExecutionIntent",
    "isRuntimeExecutiveAdvisorExperienceTransitionKind",
    "isRuntimeExecutiveAdvisorContextFreshness",
    "isRuntimeExecutiveAdvisorExperienceInterruptionKind",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorOrchestrationState",
    "RuntimeExecutiveAdvisorOrchestrationMode",
    "RuntimeExecutiveAdvisorExperiencePhase",
    "RuntimeExecutiveAdvisorOrchestrationTrigger",
    "RuntimeExecutiveAdvisorPresentationIntent",
    "RuntimeExecutiveAdvisorGuidanceVisibility",
    "RuntimeExecutiveAdvisorActionVisibility",
    "RuntimeExecutiveAdvisorCoordinationExecutionIntent",
    "RuntimeExecutiveAdvisorExperienceTransitionKind",
    "RuntimeExecutiveAdvisorContextFreshness",
    "RuntimeExecutiveAdvisorExperienceInterruptionKind",
    "RuntimeExecutiveAdvisorOrchestrationStability",
    "RuntimeExecutiveAdvisorOrchestrationCapability",
    "RuntimeExecutiveAdvisorOrchestrationRegistrySection",
    "RuntimeExecutiveAdvisorOrchestrationSignals",
    "RuntimeExecutiveAdvisorOrchestrationInput",
    "RuntimeExecutiveAdvisorOrchestrationStep",
    "RuntimeExecutiveAdvisorExperienceTransition",
    "RuntimeExecutiveAdvisorExperienceOrchestrationPlan",
    "RuntimeExecutiveAdvisorExperienceOrchestrationResult",
    "RuntimeExecutiveAdvisorOrchestrationIssue",
    "RuntimeExecutiveAdvisorOrchestrationValidationResult",
    "RuntimeExecutiveAdvisorExperienceOrchestrationVerification",
  ] as const);

export const runtimeExecutiveAdvisorExperienceOrchestrationRegistry =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
    version: runtimeExecutiveAdvisorExperienceOrchestrationVersion,
    namespace: runtimeExecutiveAdvisorExperienceOrchestrationNamespace,
    layer: runtimeExecutiveAdvisorExperienceOrchestrationLayer,
    domain: runtimeExecutiveAdvisorExperienceOrchestrationDomain,
    phase: runtimeExecutiveAdvisorExperienceOrchestrationPhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceOrchestrationDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS.length,
    orchestrationStates: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES,
    orchestrationStateCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES.length,
    orchestrationModes: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES,
    orchestrationModeCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES.length,
    experiencePhases: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES,
    experiencePhaseCount: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES.length,
    triggers: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS,
    triggerCount: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS.length,
    presentationIntents: RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS,
    presentationIntentCount:
      RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS.length,
    guidanceVisibility: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY,
    guidanceVisibilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY.length,
    actionVisibility: RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY,
    actionVisibilityCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY.length,
    coordinationExecutionIntents:
      RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS,
    coordinationExecutionIntentCount:
      RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS.length,
    transitionKinds: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS,
    transitionKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS.length,
    freshness: RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS,
    freshnessCount: RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS.length,
    interruptionKinds:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS,
    interruptionKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS.length,
    capabilities: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES.length,
    publicTypes: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveAdvisorExperienceOrchestrationApiNames,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceOrchestrationApiNames.length,
  });

export const runtimeExecutiveAdvisorExperienceOrchestration = Object.freeze({
  phase: "ExperienceOrchestration" as const,
  name: "RuntimeExecutiveAdvisorExperienceOrchestration" as const,
  identity: runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
  version: runtimeExecutiveAdvisorExperienceOrchestrationVersion,
  namespace: runtimeExecutiveAdvisorExperienceOrchestrationNamespace,
  layer: runtimeExecutiveAdvisorExperienceOrchestrationLayer,
  domain: runtimeExecutiveAdvisorExperienceOrchestrationDomain,
  architecturalRole:
    runtimeExecutiveAdvisorExperienceOrchestrationArchitecturalRole,
  role: "ExperienceOrchestration" as const,
  status: runtimeExecutiveAdvisorExperienceOrchestrationStability,
  upstreamDependency:
    runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveAdvisorExperienceOrchestrationDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorExperienceOrchestrationSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorExperienceOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_BOUNDARY,
  orchestrationStates: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES,
  orchestrationModes: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES,
  experiencePhases: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES,
  triggers: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS,
  presentationIntents: RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS,
  guidanceVisibility: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY,
  actionVisibility: RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY,
  coordinationExecutionIntents:
    RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS,
  transitionKinds: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS,
  freshness: RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS,
  interruptionKinds: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES,
  emptyPlan: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_INVARIANTS,
  forbiddenResponsibilities: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_FORBIDDEN,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorExperienceOrchestrationApiNames,
  registry: runtimeExecutiveAdvisorExperienceOrchestrationRegistry,
  coordinationBoundary: "REX-3:5-stage-coordination-only" as const,
  architecturalStatus:
    "REX-3:6 Experience Orchestration Complete — Ready for REX-3:7 Runtime Executive Advisor Experience Platform" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorExperienceOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorExperienceOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperienceOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorExperienceOrchestrationNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity;
  readonly orchestrationStateCount: number;
  readonly orchestrationModeCount: number;
  readonly experiencePhaseCount: number;
  readonly triggerCount: number;
  readonly presentationIntentCount: number;
  readonly guidanceVisibilityCount: number;
  readonly actionVisibilityCount: number;
  readonly coordinationExecutionIntentCount: number;
  readonly transitionKindCount: number;
  readonly freshnessCount: number;
  readonly interruptionKindCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly coordinationBoundaryIntact: boolean;
  readonly noStageMutation: boolean;
  readonly noNavigation: boolean;
  readonly noUi: boolean;
  readonly noAutoExecution: boolean;
  readonly coordinationOk: boolean;
  readonly noAi: boolean;
}

export function verifyRuntimeExecutiveAdvisorExperienceOrchestration():
  RuntimeExecutiveAdvisorExperienceOrchestrationVerification {
  const module = runtimeExecutiveAdvisorExperienceOrchestration;
  const registry = runtimeExecutiveAdvisorExperienceOrchestrationRegistry;
  const coordinationOk = verifyRuntimeExecutiveAdvisorStageCoordination();

  const identityOk =
    module.identity ===
      "REX-3:6/RuntimeExecutiveAdvisorExperienceOrchestration" &&
    module.version === "3.6.0" &&
    module.namespace === "nexora.rex.advisor-experience.orchestration" &&
    module.upstreamDependency ===
      "REX-3:5/RuntimeExecutiveAdvisorStageCoordination" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination" &&
    module.coordinationBoundary === "REX-3:5-stage-coordination-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES], [
      "idle",
      "prepared",
      "active",
      "suspended",
      "completed",
      "blocked",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES], [
      "observe",
      "understand",
      "respond",
      "guide",
      "coordinate",
      "settle",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "OrchestrationStates",
        "OrchestrationModes",
        "ExperiencePhases",
        "Triggers",
        "PresentationIntents",
        "GuidanceVisibility",
        "ActionVisibility",
        "CoordinationExecutionIntents",
        "Transitions",
        "Freshness",
        "Interruptions",
        "Validation",
        "Capabilities",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES.length === 4 &&
    RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES.length === 18;

  const empty = RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN;
  const emptyOk =
    empty.state === "idle" &&
    empty.mode === "passive" &&
    empty.steps.length === 0 &&
    empty.isStable === true &&
    empty.isExecutable === false;

  const phaseSequencesOk =
    exactOrder(
      [...resolveRuntimeExecutiveAdvisorExperiencePhases("passive")],
      ["observe", "settle"],
    ) &&
    exactOrder(
      [...resolveRuntimeExecutiveAdvisorExperiencePhases("coordinated")],
      ["observe", "understand", "respond", "guide", "coordinate", "settle"],
    );

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_ADVISOR_EMPTY_EXPERIENCE_ORCHESTRATION_PLAN,
    );

  const coordinationBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:5/RuntimeExecutiveAdvisorStageCoordination" &&
    module.boundary.consumesStageCoordinationOnly === true &&
    module.boundary.importsRex34Directly === false &&
    module.boundary.executesActions === false &&
    module.boundary.mutatesStageState === false &&
    module.boundary.navigatesApplication === false &&
    module.boundary.rendersUi === false;

  const ok =
    identityOk &&
    vocabOk &&
    emptyOk &&
    phaseSequencesOk &&
    frozen &&
    coordinationBoundaryIntact &&
    coordinationOk.ok === true &&
    module.boundary.aiProviderIndependent === true;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorExperienceOrchestrationIdentity,
    version: runtimeExecutiveAdvisorExperienceOrchestrationVersion,
    namespace: runtimeExecutiveAdvisorExperienceOrchestrationNamespace,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceOrchestrationDependencyIdentity,
    orchestrationStateCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_STATES.length,
    orchestrationModeCount: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_MODES.length,
    experiencePhaseCount: RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_PHASES.length,
    triggerCount: RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_TRIGGERS.length,
    presentationIntentCount:
      RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_INTENTS.length,
    guidanceVisibilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_VISIBILITY.length,
    actionVisibilityCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_VISIBILITY.length,
    coordinationExecutionIntentCount:
      RUNTIME_EXECUTIVE_ADVISOR_COORDINATION_EXECUTION_INTENTS.length,
    transitionKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_TRANSITION_KINDS.length,
    freshnessCount: RUNTIME_EXECUTIVE_ADVISOR_CONTEXT_FRESHNESS.length,
    interruptionKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_EXPERIENCE_INTERRUPTION_KINDS.length,
    capabilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_CAPABILITIES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceOrchestrationApiNames.length,
    frozen,
    coordinationBoundaryIntact,
    noStageMutation: module.boundary.mutatesStageState === false,
    noNavigation: module.boundary.navigatesApplication === false,
    noUi: module.boundary.rendersUi === false,
    noAutoExecution: module.boundary.executesActions === false,
    coordinationOk: coordinationOk.ok === true,
    noAi: module.boundary.aiProviderIndependent === true,
  });
}
