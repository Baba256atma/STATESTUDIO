/**
 * REX-3:5 — Runtime Executive Advisor Stage Coordination.
 *
 * Translates validated REX-3:4 Executive Action Options into declarative Stage
 * Coordination Intents and Plans — without mutating Stage state, navigating,
 * calling an LLM, or rendering UI.
 *
 * Canonical flow:
 *   REX-3:4 Guidance / Action Package
 *     → Coordination Intent Resolution
 *     → Stage Coordination Plan
 *     → Runtime-safe Coordination Result
 *     → Ready for REX-3:6 Orchestration
 *
 * ready ≠ executed. Advisor does not own the Stage.
 */

import {
  RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE,
  assembleRuntimeExecutiveAdvisorGuidancePackage,
  isRuntimeExecutiveAdvisorExecutiveActionKind,
  runtimeExecutiveAdvisorGuidanceActionsIdentity,
  runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
  runtimeExecutiveAdvisorGuidanceActionsVersion,
  validateRuntimeExecutiveAdvisorExecutiveAction,
  validateRuntimeExecutiveAdvisorGuidancePackage,
  verifyRuntimeExecutiveAdvisorGuidanceActions,
  type RuntimeExecutiveAdvisorExecutiveAction,
  type RuntimeExecutiveAdvisorExecutiveActionKind,
  type RuntimeExecutiveAdvisorGuidance,
  type RuntimeExecutiveAdvisorGuidancePackage,
  type RuntimeExecutiveAdvisorGuidancePriority,
} from "@/app/lib/rex/runtimeExecutiveAdvisorGuidanceActions";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorStageCoordinationIdentity =
  "REX-3:5/RuntimeExecutiveAdvisorStageCoordination" as const;

export const runtimeExecutiveAdvisorStageCoordinationVersion =
  "3.5.0" as const;

export const runtimeExecutiveAdvisorStageCoordinationNamespace =
  "nexora.rex.advisor-experience.stage-coordination" as const;

export const runtimeExecutiveAdvisorStageCoordinationLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorStageCoordinationDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorStageCoordinationPhase =
  "StageCoordination" as const;

export const runtimeExecutiveAdvisorStageCoordinationArchitecturalRole =
  "RuntimeExecutiveAdvisorStageCoordinationBoundary" as const;

export const runtimeExecutiveAdvisorStageCoordinationDependencyIdentity =
  runtimeExecutiveAdvisorGuidanceActionsIdentity;

export const runtimeExecutiveAdvisorStageCoordinationDependencyPath =
  runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath;

export const runtimeExecutiveAdvisorStageCoordinationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorStageCoordination" as const;

export const runtimeExecutiveAdvisorStageCoordinationStability =
  "CoordinationReady" as const;

export const runtimeExecutiveAdvisorStageCoordinationDeterministic =
  true as const;

export const runtimeExecutiveAdvisorStageCoordinationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorStageCoordinationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorStageCoordinationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorStageCoordinationIdentity,
    version: runtimeExecutiveAdvisorStageCoordinationVersion,
    namespace: runtimeExecutiveAdvisorStageCoordinationNamespace,
    layer: runtimeExecutiveAdvisorStageCoordinationLayer,
    domain: runtimeExecutiveAdvisorStageCoordinationDomain,
    phase: runtimeExecutiveAdvisorStageCoordinationPhase,
    architecturalRole:
      runtimeExecutiveAdvisorStageCoordinationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorStageCoordinationDependencyIdentity,
    dependencyPath: runtimeExecutiveAdvisorStageCoordinationDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
    stabilityStatus: runtimeExecutiveAdvisorStageCoordinationStability,
    deterministicStatus:
      runtimeExecutiveAdvisorStageCoordinationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorStageCoordinationSideEffectPolicy,
    mutationPolicy: runtimeExecutiveAdvisorStageCoordinationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRINCIPLE =
  "Advisor Action Option → Coordination Request → Approved Runtime Boundary → Stage. Coordination plans are declarative; ready ≠ executed." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    coordinationAuthority: "REX-3:5" as const,
    architecturalRole:
      "RuntimeExecutiveAdvisorStageCoordinationBoundary" as const,
    soleImmediateDependency:
      "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions" as const,
    consumesGuidanceActionsOnly: true as const,
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
    forgesManagerConfirmation: false as const,
    inventsPaths: false as const,
    generatesProse: false as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES =
  Object.freeze(["none", "planned", "ready", "blocked"] as const);

export type RuntimeExecutiveAdvisorStageCoordinationState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS =
  Object.freeze([
    "observe",
    "focus",
    "select",
    "highlight",
    "show-related",
    "trace",
    "compare",
    "present",
    "open-scenario",
    "open-decision",
    "open-execution",
    "dismiss",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationIntent =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS =
  Object.freeze([
    "request-focus",
    "request-selection",
    "request-highlight",
    "request-related-visibility",
    "request-path-emphasis",
    "request-comparison",
    "request-presentation-state",
    "request-scene-context",
    "request-workflow-open",
    "request-dismiss",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationOperation =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES =
  Object.freeze(["background", "normal", "high", "critical"] as const);

export type RuntimeExecutiveAdvisorStageCoordinationPriority =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES =
  Object.freeze([
    "advisor-request",
    "manager-confirmed",
    "runtime-approved",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationAuthority =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS =
  Object.freeze([
    "action-available",
    "target-present",
    "target-visible",
    "relationship-present",
    "comparison-targets-present",
    "manager-confirmed",
    "scene-compatible",
    "presentation-compatible",
    "runtime-coordination-supported",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationPreconditionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS)[number];

/** Canonical presentation states preserved from upstream Advisor semantics. */
export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRESENTATION_STATES =
  Object.freeze(["minimum", "report", "operation"] as const);

export type RuntimeExecutiveAdvisorStageCoordinationPresentationState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRESENTATION_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_WORKFLOWS =
  Object.freeze(["scenario", "decision", "execution"] as const);

export type RuntimeExecutiveAdvisorStageCoordinationWorkflow =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_WORKFLOWS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_SCENE_MODES =
  Object.freeze(["related-context", "subject-context"] as const);

export type RuntimeExecutiveAdvisorStageCoordinationSceneMode =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_SCENE_MODES)[number];

/**
 * Canonical action → coordination intent mapping. Explicit and testable.
 * Operations are resolved separately with least-invasive / selection-safe rules.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS =
  Object.freeze([
    Object.freeze({
      actionKind: "inspect-subject" as const,
      intents: Object.freeze(["observe", "focus"] as const),
    }),
    Object.freeze({
      actionKind: "focus-subject" as const,
      intents: Object.freeze(["focus"] as const),
    }),
    Object.freeze({
      actionKind: "explain-subject" as const,
      intents: Object.freeze(["present", "observe"] as const),
    }),
    Object.freeze({
      actionKind: "compare-subjects" as const,
      intents: Object.freeze(["compare"] as const),
    }),
    Object.freeze({
      actionKind: "trace-relationship" as const,
      intents: Object.freeze(["trace"] as const),
    }),
    Object.freeze({
      actionKind: "show-related" as const,
      intents: Object.freeze(["show-related"] as const),
    }),
    Object.freeze({
      actionKind: "open-scenario" as const,
      intents: Object.freeze(["open-scenario"] as const),
    }),
    Object.freeze({
      actionKind: "open-decision" as const,
      intents: Object.freeze(["open-decision"] as const),
    }),
    Object.freeze({
      actionKind: "open-execution" as const,
      intents: Object.freeze(["open-execution"] as const),
    }),
    Object.freeze({
      actionKind: "review-decision" as const,
      intents: Object.freeze(["present", "open-decision"] as const),
    }),
    Object.freeze({
      actionKind: "review-execution" as const,
      intents: Object.freeze(["present", "open-execution"] as const),
    }),
    Object.freeze({
      actionKind: "dismiss-guidance" as const,
      intents: Object.freeze(["dismiss"] as const),
    }),
  ]);

/** Semantic operation sequencing (context → attention → relation → present → workflow). */
export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATION_SEQUENCE =
  Object.freeze([
    "request-scene-context",
    "request-focus",
    "request-highlight",
    "request-selection",
    "request-related-visibility",
    "request-path-emphasis",
    "request-comparison",
    "request-presentation-state",
    "request-workflow-open",
    "request-dismiss",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES =
  Object.freeze([
    "stage-coordination-modeling",
    "action-to-coordination-mapping",
    "coordination-intent-resolution",
    "coordination-operation-resolution",
    "coordination-target-resolution",
    "focus-coordination",
    "selection-coordination",
    "attention-coordination",
    "relationship-coordination",
    "comparison-coordination",
    "presentation-coordination",
    "scene-coordination",
    "workflow-coordination",
    "manager-selection-protection",
    "manager-confirmation-enforcement",
    "least-invasive-coordination",
    "coordination-conflict-resolution",
    "coordination-sequencing",
    "coordination-deduplication",
    "coordination-readiness",
    "coordination-validation",
    "stable-coordination-ordering",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "CoordinationStates",
    "CoordinationIntents",
    "CoordinationOperations",
    "CoordinationPriorities",
    "CoordinationAuthorities",
    "Preconditions",
    "ActionMappings",
    "Sequencing",
    "Validation",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorStageCoordinationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorStageCoordinationTarget {
  readonly subjectIds: ReadonlyArray<string>;
  readonly relationshipId?: string;
  readonly sceneId?: string;
  readonly presentationState?: RuntimeExecutiveAdvisorStageCoordinationPresentationState;
  readonly workflow?: RuntimeExecutiveAdvisorStageCoordinationWorkflow;
  readonly sceneMode?: RuntimeExecutiveAdvisorStageCoordinationSceneMode;
}

export interface RuntimeExecutiveAdvisorStageCoordinationPrecondition {
  readonly kind: RuntimeExecutiveAdvisorStageCoordinationPreconditionKind;
  readonly satisfied: boolean;
}

export interface RuntimeExecutiveAdvisorStageCoordinationStep {
  readonly id: string;
  readonly intent: RuntimeExecutiveAdvisorStageCoordinationIntent;
  readonly operation: RuntimeExecutiveAdvisorStageCoordinationOperation;
  readonly target: RuntimeExecutiveAdvisorStageCoordinationTarget;
  readonly priority: RuntimeExecutiveAdvisorStageCoordinationPriority;
  readonly authority: RuntimeExecutiveAdvisorStageCoordinationAuthority;
  readonly preconditions: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationPrecondition>;
  readonly sourceActionIds: ReadonlyArray<string>;
  readonly fromPrimaryGuidance: boolean;
  readonly blocked: boolean;
}

export interface RuntimeExecutiveAdvisorStageCoordinationPlan {
  readonly state: RuntimeExecutiveAdvisorStageCoordinationState;
  readonly steps: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep>;
  readonly blockedStepIds: ReadonlyArray<string>;
  readonly isReady: boolean;
  readonly coordinationIdentity: typeof runtimeExecutiveAdvisorStageCoordinationIdentity;
  readonly coordinationVersion: typeof runtimeExecutiveAdvisorStageCoordinationVersion;
  readonly guidanceIdentity: typeof runtimeExecutiveAdvisorGuidanceActionsIdentity;
  readonly guidanceVersion: typeof runtimeExecutiveAdvisorGuidanceActionsVersion;
}

export interface RuntimeExecutiveAdvisorStageCoordinationResult {
  readonly plan: RuntimeExecutiveAdvisorStageCoordinationPlan;
  readonly readyStepIds: ReadonlyArray<string>;
  readonly blockedStepIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorStageCoordinationContext {
  readonly managerSelectedSubjectId?: string | null;
  readonly managerConfirmedActionIds?: ReadonlyArray<string>;
  readonly visibleSubjectIds?: ReadonlyArray<string>;
  readonly knownRelationshipIds?: ReadonlyArray<string>;
  readonly sceneCompatible?: boolean;
  readonly presentationCompatible?: boolean;
  readonly runtimeCoordinationSupported?: boolean;
  /** When true, explicit selection coordination is permitted for focus-subject. */
  readonly allowSelectionTransfer?: boolean;
}

export interface RuntimeExecutiveAdvisorStageCoordinationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorStageCoordinationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationIssue>;
}

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "step-from-action",
      order: 1,
      statement: "Every coordination step must originate from a valid REX-3:4 action.",
    }),
    Object.freeze({
      id: "no-direct-stage-mutation",
      order: 2,
      statement: "No coordination step directly mutates Stage state.",
    }),
    Object.freeze({
      id: "manager-selection-protection",
      order: 3,
      statement: "Manager selection must not be silently overridden.",
    }),
    Object.freeze({
      id: "no-path-fabrication",
      order: 4,
      statement: "No unsupported relationship/path may be invented.",
    }),
    Object.freeze({
      id: "manager-confirmation",
      order: 5,
      statement:
        "Workflow-sensitive coordination must respect manager confirmation.",
    }),
    Object.freeze({
      id: "deterministic-plan",
      order: 6,
      statement: "Equivalent semantic input → equivalent coordination plan.",
    }),
    Object.freeze({
      id: "source-immutability",
      order: 7,
      statement: "Source input remains immutable.",
    }),
    Object.freeze({
      id: "presentation-semantics",
      order: 8,
      statement: "Coordination must preserve upstream presentation semantics.",
    }),
    Object.freeze({
      id: "least-invasive",
      order: 9,
      statement: "Coordination must use least-invasive valid behavior.",
    }),
    Object.freeze({
      id: "ready-not-executed",
      order: 10,
      statement: "ready means ready for orchestration, never executed.",
    }),
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_FORBIDDEN =
  Object.freeze([
    "LLM calls",
    "prompt templates",
    "embeddings",
    "generated prose",
    "action execution",
    "Stage mutation",
    "focus()",
    "select()",
    "highlight()",
    "showPath()",
    "changeScene()",
    "setPresentationState()",
    "navigate()",
    "openScenario()",
    "openDecision()",
    "openExecution()",
    "dispatch()",
    "React components",
    "Advisor panels",
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
): RuntimeExecutiveAdvisorStageCoordinationIssue {
  return path === undefined
    ? Object.freeze({ code, message })
    : Object.freeze({ code, message, path });
}

function uniquePreserveOrder(values: readonly string[]): ReadonlyArray<string> {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return Object.freeze(out);
}

function sortedUnique(values: readonly string[]): ReadonlyArray<string> {
  return Object.freeze(
    [...uniquePreserveOrder(values)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
  );
}

function guidancePriorityRank(
  priority: RuntimeExecutiveAdvisorGuidancePriority | undefined,
): number {
  switch (priority) {
    case "critical":
      return 3;
    case "high":
      return 2;
    case "normal":
      return 1;
    case "low":
      return 0;
    default:
      return 1;
  }
}

function coordinationPriorityRank(
  priority: RuntimeExecutiveAdvisorStageCoordinationPriority,
): number {
  switch (priority) {
    case "critical":
      return 3;
    case "high":
      return 2;
    case "normal":
      return 1;
    case "background":
      return 0;
  }
}

function authorityRank(
  authority: RuntimeExecutiveAdvisorStageCoordinationAuthority,
): number {
  switch (authority) {
    case "manager-confirmed":
      return 2;
    case "runtime-approved":
      return 1;
    case "advisor-request":
      return 0;
  }
}

function operationSequenceRank(
  operation: RuntimeExecutiveAdvisorStageCoordinationOperation,
): number {
  const index =
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATION_SEQUENCE.indexOf(
      operation,
    );
  return index === -1 ? 99 : index;
}

function invasivenessRank(
  operation: RuntimeExecutiveAdvisorStageCoordinationOperation,
): number {
  switch (operation) {
    case "request-dismiss":
      return 0;
    case "request-highlight":
      return 1;
    case "request-focus":
      return 2;
    case "request-related-visibility":
      return 3;
    case "request-path-emphasis":
      return 3;
    case "request-presentation-state":
      return 4;
    case "request-comparison":
      return 4;
    case "request-scene-context":
      return 5;
    case "request-workflow-open":
      return 6;
    case "request-selection":
      return 7;
  }
}

function mapGuidancePriorityToCoordination(
  priority: RuntimeExecutiveAdvisorGuidancePriority | undefined,
): RuntimeExecutiveAdvisorStageCoordinationPriority {
  switch (priority) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "low":
      return "background";
    case "normal":
    default:
      return "normal";
  }
}

function semanticStepKey(
  operation: RuntimeExecutiveAdvisorStageCoordinationOperation,
  target: RuntimeExecutiveAdvisorStageCoordinationTarget,
): string {
  return [
    operation,
    target.subjectIds.join(","),
    target.relationshipId ?? "",
    target.sceneId ?? "",
    target.presentationState ?? "",
    target.workflow ?? "",
    target.sceneMode ?? "",
  ].join("|");
}

function conflictGroupKey(
  step: RuntimeExecutiveAdvisorStageCoordinationStep,
): string | null {
  if (
    step.operation === "request-focus" ||
    step.operation === "request-selection" ||
    step.operation === "request-highlight"
  ) {
    return "attention";
  }
  if (step.operation === "request-presentation-state") {
    return "presentation";
  }
  if (step.operation === "request-workflow-open") {
    return `workflow:${step.target.workflow ?? ""}`;
  }
  return null;
}

// ─── Type guards ────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorStageCoordinationState(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationState {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationIntent(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationIntent {
  return (
    typeof value === "string" &&
    (RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS as readonly string[]).includes(
      value,
    )
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationOperation(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationOperation {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationPriority(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationPriority {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationAuthority(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationAuthority {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationPreconditionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationPreconditionKind {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS as readonly string[]
    ).includes(value)
  );
}

export function isRuntimeExecutiveAdvisorStageCoordinationPresentationState(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageCoordinationPresentationState {
  return (
    typeof value === "string" &&
    (
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRESENTATION_STATES as readonly string[]
    ).includes(value)
  );
}

// ─── Empty plan ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN:
  RuntimeExecutiveAdvisorStageCoordinationPlan = Object.freeze({
    state: "none",
    steps: Object.freeze([] as RuntimeExecutiveAdvisorStageCoordinationStep[]),
    blockedStepIds: Object.freeze([] as string[]),
    isReady: false,
    coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
    coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    guidanceIdentity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    guidanceVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_RESULT:
  RuntimeExecutiveAdvisorStageCoordinationResult = Object.freeze({
    plan: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN,
    readyStepIds: Object.freeze([] as string[]),
    blockedStepIds: Object.freeze([] as string[]),
  });

// ─── Mapping / resolution ───────────────────────────────────────────────────

export function mapRuntimeExecutiveAdvisorActionToCoordinationIntent(
  actionKind: RuntimeExecutiveAdvisorExecutiveActionKind,
): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationIntent> {
  const mapping = RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS.find(
    (entry) => entry.actionKind === actionKind,
  );
  return mapping ? mapping.intents : Object.freeze([]);
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationTarget(
  action: RuntimeExecutiveAdvisorExecutiveAction,
  options?: {
    readonly relationshipId?: string;
    readonly sceneId?: string;
    readonly presentationState?: RuntimeExecutiveAdvisorStageCoordinationPresentationState;
    readonly workflow?: RuntimeExecutiveAdvisorStageCoordinationWorkflow;
    readonly sceneMode?: RuntimeExecutiveAdvisorStageCoordinationSceneMode;
  },
): RuntimeExecutiveAdvisorStageCoordinationTarget {
  const subjectIds = uniquePreserveOrder(action.targetSubjectIds);
  return Object.freeze({
    subjectIds,
    ...(options?.relationshipId
      ? { relationshipId: options.relationshipId }
      : {}),
    ...(options?.sceneId ? { sceneId: options.sceneId } : {}),
    ...(options?.presentationState
      ? { presentationState: options.presentationState }
      : {}),
    ...(options?.workflow ? { workflow: options.workflow } : {}),
    ...(options?.sceneMode ? { sceneMode: options.sceneMode } : {}),
  });
}

function maxGuidancePriority(
  guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>,
  sourceGuidanceIds: ReadonlyArray<string>,
): RuntimeExecutiveAdvisorGuidancePriority | undefined {
  let best: RuntimeExecutiveAdvisorGuidancePriority | undefined;
  let bestRank = -1;
  for (const id of sourceGuidanceIds) {
    const entry = guidance.find((item) => item.id === id);
    if (!entry) continue;
    const rank = guidancePriorityRank(entry.priority);
    if (rank > bestRank) {
      bestRank = rank;
      best = entry.priority;
    }
  }
  return best;
}

function isActionConfirmed(
  action: RuntimeExecutiveAdvisorExecutiveAction,
  context: RuntimeExecutiveAdvisorStageCoordinationContext,
): boolean {
  const confirmed = context.managerConfirmedActionIds ?? [];
  return confirmed.includes(action.id);
}

function actionRequiresManagerConfirmation(
  action: RuntimeExecutiveAdvisorExecutiveAction,
): boolean {
  return (
    action.state === "requires-confirmation" ||
    action.authority === "manager-confirmation" ||
    action.kind === "open-scenario" ||
    action.kind === "open-decision" ||
    action.kind === "open-execution"
  );
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationAuthority(
  action: RuntimeExecutiveAdvisorExecutiveAction,
  context: RuntimeExecutiveAdvisorStageCoordinationContext,
): RuntimeExecutiveAdvisorStageCoordinationAuthority {
  if (
    actionRequiresManagerConfirmation(action) &&
    isActionConfirmed(action, context)
  ) {
    return "manager-confirmed";
  }
  if (
    action.authority === "runtime-coordination" &&
    (context.runtimeCoordinationSupported ?? true)
  ) {
    return "runtime-approved";
  }
  return "advisor-request";
}

export function evaluateRuntimeExecutiveAdvisorStageCoordinationPreconditions(
  input: {
    readonly action: RuntimeExecutiveAdvisorExecutiveAction;
    readonly operation: RuntimeExecutiveAdvisorStageCoordinationOperation;
    readonly target: RuntimeExecutiveAdvisorStageCoordinationTarget;
    readonly context: RuntimeExecutiveAdvisorStageCoordinationContext;
  },
): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationPrecondition> {
  const { action, operation, target, context } = input;
  const visible = new Set(context.visibleSubjectIds ?? target.subjectIds);
  const knownRelationships = new Set(context.knownRelationshipIds ?? []);
  const sceneCompatible = context.sceneCompatible ?? true;
  const presentationCompatible = context.presentationCompatible ?? true;
  const runtimeSupported = context.runtimeCoordinationSupported ?? true;

  const actionAvailable =
    action.state === "available" ||
    action.state === "requires-confirmation" ||
    (action.state === "disabled" && operation === "request-dismiss");

  const targetPresent = target.subjectIds.every((id) => isNonEmptyString(id));
  const targetVisible =
    target.subjectIds.length === 0 ||
    target.subjectIds.every((id) => visible.has(id));

  const relationshipRequired =
    operation === "request-path-emphasis" || action.kind === "trace-relationship";
  const relationshipPresent = relationshipRequired
    ? typeof target.relationshipId === "string" &&
      target.relationshipId.length > 0 &&
      (context.knownRelationshipIds === undefined ||
        knownRelationships.has(target.relationshipId))
    : true;

  const comparisonRequired =
    operation === "request-comparison" || action.kind === "compare-subjects";
  const comparisonTargetsPresent = comparisonRequired
    ? target.subjectIds.length >= 2 &&
      new Set(target.subjectIds).size === target.subjectIds.length
    : true;

  const managerConfirmedRequired = actionRequiresManagerConfirmation(action);
  const managerConfirmed = managerConfirmedRequired
    ? isActionConfirmed(action, context)
    : true;

  const sceneRequired =
    operation === "request-scene-context" || action.kind === "show-related";
  const presentationRequired =
    operation === "request-presentation-state";

  return Object.freeze([
    Object.freeze({
      kind: "action-available" as const,
      satisfied: actionAvailable,
    }),
    Object.freeze({
      kind: "target-present" as const,
      satisfied:
        operation === "request-dismiss" ||
        operation === "request-workflow-open" ||
        targetPresent,
    }),
    Object.freeze({
      kind: "target-visible" as const,
      satisfied:
        operation === "request-dismiss" ||
        operation === "request-workflow-open" ||
        targetVisible,
    }),
    Object.freeze({
      kind: "relationship-present" as const,
      satisfied: relationshipPresent,
    }),
    Object.freeze({
      kind: "comparison-targets-present" as const,
      satisfied: comparisonTargetsPresent,
    }),
    Object.freeze({
      kind: "manager-confirmed" as const,
      satisfied: managerConfirmed,
    }),
    Object.freeze({
      kind: "scene-compatible" as const,
      satisfied: sceneRequired ? sceneCompatible : true,
    }),
    Object.freeze({
      kind: "presentation-compatible" as const,
      satisfied: presentationRequired ? presentationCompatible : true,
    }),
    Object.freeze({
      kind: "runtime-coordination-supported" as const,
      satisfied: runtimeSupported,
    }),
  ]);
}

interface DraftStep {
  readonly intent: RuntimeExecutiveAdvisorStageCoordinationIntent;
  readonly operation: RuntimeExecutiveAdvisorStageCoordinationOperation;
  readonly target: RuntimeExecutiveAdvisorStageCoordinationTarget;
  readonly priority: RuntimeExecutiveAdvisorStageCoordinationPriority;
  readonly authority: RuntimeExecutiveAdvisorStageCoordinationAuthority;
  readonly preconditions: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationPrecondition>;
  readonly sourceActionIds: ReadonlyArray<string>;
  readonly fromPrimaryGuidance: boolean;
  readonly guidancePriorityRank: number;
  readonly sourceOrder: number;
}

function protectManagerSelection(
  action: RuntimeExecutiveAdvisorExecutiveAction,
  preferredOperation: "request-focus" | "request-selection" | "request-highlight",
  context: RuntimeExecutiveAdvisorStageCoordinationContext,
): "request-focus" | "request-selection" | "request-highlight" {
  const selected = context.managerSelectedSubjectId;
  if (!selected || selected.length === 0) {
    return preferredOperation;
  }
  const targetsDifferentSubject = action.targetSubjectIds.some(
    (id) => id !== selected,
  );
  if (!targetsDifferentSubject) {
    return preferredOperation;
  }
  // Never silently select away from manager selection.
  if (preferredOperation === "request-selection") {
    return context.allowSelectionTransfer === true
      ? "request-selection"
      : "request-highlight";
  }
  // Inspect / observe: prefer highlight over focus when protecting selection.
  if (action.kind === "inspect-subject" || action.kind === "explain-subject") {
    return "request-highlight";
  }
  return preferredOperation;
}

function buildDraftsForAction(input: {
  readonly action: RuntimeExecutiveAdvisorExecutiveAction;
  readonly package: RuntimeExecutiveAdvisorGuidancePackage;
  readonly context: RuntimeExecutiveAdvisorStageCoordinationContext;
  readonly sourceOrder: number;
}): DraftStep[] {
  const { action, package: pkg, context, sourceOrder } = input;
  if (action.state === "blocked" || action.state === "disabled") {
    return [];
  }

  const primaryId = pkg.primaryGuidance?.id ?? null;
  const fromPrimary =
    primaryId !== null && action.sourceGuidanceIds.includes(primaryId);
  const priority = mapGuidancePriorityToCoordination(
    maxGuidancePriority(pkg.guidance, action.sourceGuidanceIds),
  );
  const gRank = guidancePriorityRank(
    maxGuidancePriority(pkg.guidance, action.sourceGuidanceIds),
  );
  const authority = resolveRuntimeExecutiveAdvisorStageCoordinationAuthority(
    action,
    context,
  );
  const drafts: DraftStep[] = [];

  const push = (
    intent: RuntimeExecutiveAdvisorStageCoordinationIntent,
    operation: RuntimeExecutiveAdvisorStageCoordinationOperation,
    target: RuntimeExecutiveAdvisorStageCoordinationTarget,
  ) => {
    const preconditions =
      evaluateRuntimeExecutiveAdvisorStageCoordinationPreconditions({
        action,
        operation,
        target,
        context,
      });
    drafts.push({
      intent,
      operation,
      target,
      priority,
      authority,
      preconditions,
      sourceActionIds: Object.freeze([action.id]),
      fromPrimaryGuidance: fromPrimary,
      guidancePriorityRank: gRank,
      sourceOrder,
    });
  };

  switch (action.kind) {
    case "inspect-subject": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      const op = protectManagerSelection(action, "request-focus", context);
      push(op === "request-highlight" ? "highlight" : "focus", op, target);
      push(
        "present",
        "request-presentation-state",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          presentationState: "report",
        }),
      );
      break;
    }
    case "focus-subject": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      const op = protectManagerSelection(action, "request-focus", context);
      push(op === "request-highlight" ? "highlight" : "focus", op, target);
      break;
    }
    case "explain-subject": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      const op = protectManagerSelection(action, "request-focus", context);
      push(op === "request-highlight" ? "highlight" : "observe", op, target);
      push(
        "present",
        "request-presentation-state",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          presentationState: "report",
        }),
      );
      break;
    }
    case "compare-subjects": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      push("compare", "request-comparison", target);
      push(
        "present",
        "request-presentation-state",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          presentationState: "report",
        }),
      );
      break;
    }
    case "trace-relationship": {
      const subjectIds = uniquePreserveOrder(action.targetSubjectIds);
      const relationshipId =
        subjectIds.length >= 2
          ? `rel:${subjectIds[0]}→${subjectIds[1]}`
          : subjectIds.length === 1
            ? `rel:${subjectIds[0]}`
            : undefined;
      const known = context.knownRelationshipIds;
      const relationshipOk =
        relationshipId !== undefined &&
        (known === undefined || known.includes(relationshipId));

      if (subjectIds.length > 0) {
        const focusAction = action;
        const focusTarget =
          resolveRuntimeExecutiveAdvisorStageCoordinationTarget(focusAction, {
            relationshipId: relationshipOk ? relationshipId : undefined,
          });
        // Prefer focusing the first grounded subject if it does not steal selection;
        // otherwise highlight the non-selected target.
        const selected = context.managerSelectedSubjectId;
        if (selected && subjectIds.some((id) => id !== selected)) {
          const highlightIds = subjectIds.filter((id) => id !== selected);
          push(
            "highlight",
            "request-highlight",
            Object.freeze({
              subjectIds: uniquePreserveOrder(highlightIds),
              ...(relationshipOk && relationshipId
                ? { relationshipId }
                : {}),
            }),
          );
        } else {
          push(
            "focus",
            "request-focus",
            Object.freeze({
              subjectIds: Object.freeze([subjectIds[0]!]),
              ...(relationshipOk && relationshipId
                ? { relationshipId }
                : {}),
            }),
          );
        }
      }

      if (relationshipOk && relationshipId) {
        push(
          "trace",
          "request-path-emphasis",
          Object.freeze({
            subjectIds,
            relationshipId,
          }),
        );
        push(
          "present",
          "request-presentation-state",
          Object.freeze({
            subjectIds,
            relationshipId,
            presentationState: "report" as const,
          }),
        );
      } else {
        // Blocked path step — no fabrication.
        push(
          "trace",
          "request-path-emphasis",
          Object.freeze({
            subjectIds,
            ...(relationshipId ? { relationshipId } : {}),
          }),
        );
      }
      break;
    }
    case "show-related": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(
        action,
        {
          sceneId: action.targetSubjectIds[0],
          sceneMode: "related-context",
        },
      );
      push("show-related", "request-related-visibility", target);
      push("show-related", "request-scene-context", target);
      break;
    }
    case "open-scenario": {
      push(
        "open-scenario",
        "request-workflow-open",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          workflow: "scenario",
        }),
      );
      break;
    }
    case "open-decision": {
      push(
        "open-decision",
        "request-workflow-open",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          workflow: "decision",
        }),
      );
      break;
    }
    case "open-execution": {
      push(
        "open-execution",
        "request-workflow-open",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          workflow: "execution",
        }),
      );
      break;
    }
    case "review-decision": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      const op = protectManagerSelection(action, "request-focus", context);
      push(op === "request-highlight" ? "highlight" : "focus", op, target);
      push(
        "present",
        "request-presentation-state",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          presentationState: "operation",
        }),
      );
      break;
    }
    case "review-execution": {
      const target = resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action);
      const op = protectManagerSelection(action, "request-focus", context);
      push(op === "request-highlight" ? "highlight" : "focus", op, target);
      push(
        "present",
        "request-presentation-state",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action, {
          presentationState: "operation",
        }),
      );
      break;
    }
    case "dismiss-guidance": {
      push(
        "dismiss",
        "request-dismiss",
        resolveRuntimeExecutiveAdvisorStageCoordinationTarget(action),
      );
      break;
    }
    default: {
      const _exhaustive: never = action.kind;
      void _exhaustive;
      break;
    }
  }

  return drafts;
}

function isStepBlocked(
  preconditions: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationPrecondition>,
): boolean {
  return preconditions.some((entry) => entry.satisfied === false);
}

function dedupeDrafts(drafts: readonly DraftStep[]): DraftStep[] {
  const byKey = new Map<string, DraftStep>();
  for (const draft of drafts) {
    const key = semanticStepKey(draft.operation, draft.target);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, draft);
      continue;
    }
    const mergedSource = sortedUnique([
      ...existing.sourceActionIds,
      ...draft.sourceActionIds,
    ]);
    const preferDraft =
      authorityRank(draft.authority) > authorityRank(existing.authority) ||
      (authorityRank(draft.authority) === authorityRank(existing.authority) &&
        (draft.fromPrimaryGuidance && !existing.fromPrimaryGuidance ||
          (draft.fromPrimaryGuidance === existing.fromPrimaryGuidance &&
            (draft.guidancePriorityRank > existing.guidancePriorityRank ||
              (draft.guidancePriorityRank === existing.guidancePriorityRank &&
                draft.sourceOrder < existing.sourceOrder)))));
    const winner = preferDraft ? draft : existing;
    byKey.set(key, {
      ...winner,
      sourceActionIds: mergedSource,
      fromPrimaryGuidance:
        existing.fromPrimaryGuidance || draft.fromPrimaryGuidance,
      guidancePriorityRank: Math.max(
        existing.guidancePriorityRank,
        draft.guidancePriorityRank,
      ),
      priority:
        coordinationPriorityRank(draft.priority) >
        coordinationPriorityRank(existing.priority)
          ? draft.priority
          : existing.priority,
      authority:
        authorityRank(draft.authority) > authorityRank(existing.authority)
          ? draft.authority
          : existing.authority,
      sourceOrder: Math.min(existing.sourceOrder, draft.sourceOrder),
      preconditions:
        draft.preconditions.some((p) => !p.satisfied) &&
        !existing.preconditions.some((p) => !p.satisfied)
          ? existing.preconditions
          : existing.preconditions.some((p) => !p.satisfied) &&
              !draft.preconditions.some((p) => !p.satisfied)
            ? draft.preconditions
            : winner.preconditions,
    });
  }
  return [...byKey.values()];
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationConflicts(
  steps: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep>,
): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep> {
  const groups = new Map<string, RuntimeExecutiveAdvisorStageCoordinationStep[]>();
  const passthrough: RuntimeExecutiveAdvisorStageCoordinationStep[] = [];

  for (const step of steps) {
    const group = conflictGroupKey(step);
    if (group === null) {
      passthrough.push(step);
      continue;
    }
    const list = groups.get(group) ?? [];
    list.push(step);
    groups.set(group, list);
  }

  const resolved: RuntimeExecutiveAdvisorStageCoordinationStep[] = [...passthrough];

  for (const [, groupSteps] of [...groups.entries()].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  )) {
    if (groupSteps.length === 1) {
      resolved.push(groupSteps[0]!);
      continue;
    }

    // Competing attention: keep exactly one focus/selection/highlight step.
    if (groupSteps[0] && conflictGroupKey(groupSteps[0]) === "attention") {
      // Prefer manager-confirmed, then primary, then priority, then less invasive, then id.
      const winner = [...groupSteps].sort((a, b) => {
        const auth = authorityRank(b.authority) - authorityRank(a.authority);
        if (auth !== 0) return auth;
        if (a.fromPrimaryGuidance !== b.fromPrimaryGuidance) {
          return a.fromPrimaryGuidance ? -1 : 1;
        }
        const pri =
          coordinationPriorityRank(b.priority) -
          coordinationPriorityRank(a.priority);
        if (pri !== 0) return pri;
        const inv = invasivenessRank(a.operation) - invasivenessRank(b.operation);
        if (inv !== 0) return inv;
        // Prefer richer relationship grounding when otherwise equivalent.
        const aRel = a.target.relationshipId ? 1 : 0;
        const bRel = b.target.relationshipId ? 1 : 0;
        if (aRel !== bRel) return bRel - aRel;
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      })[0]!;
      // Merge source action ids from equivalent attention steps.
      const mergedSources = sortedUnique(
        groupSteps.flatMap((step) => [...step.sourceActionIds]),
      );
      resolved.push(
        Object.freeze({
          ...winner,
          sourceActionIds: mergedSources,
          fromPrimaryGuidance: groupSteps.some((step) => step.fromPrimaryGuidance),
        }),
      );
      continue;
    }

    // Presentation / workflow: single winner.
    const winner = [...groupSteps].sort((a, b) => {
      const auth = authorityRank(b.authority) - authorityRank(a.authority);
      if (auth !== 0) return auth;
      if (a.fromPrimaryGuidance !== b.fromPrimaryGuidance) {
        return a.fromPrimaryGuidance ? -1 : 1;
      }
      const pri =
        coordinationPriorityRank(b.priority) -
        coordinationPriorityRank(a.priority);
      if (pri !== 0) return pri;
      const inv = invasivenessRank(a.operation) - invasivenessRank(b.operation);
      if (inv !== 0) return inv;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    })[0]!;
    resolved.push(winner);
  }

  return Object.freeze(resolved);
}

export function orderRuntimeExecutiveAdvisorStageCoordinationSteps(
  steps: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep>,
): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep> {
  const ordered = [...steps].sort((a, b) => {
    const auth = authorityRank(b.authority) - authorityRank(a.authority);
    if (auth !== 0) return auth;
    if (a.fromPrimaryGuidance !== b.fromPrimaryGuidance) {
      return a.fromPrimaryGuidance ? -1 : 1;
    }
    const pri =
      coordinationPriorityRank(b.priority) - coordinationPriorityRank(a.priority);
    if (pri !== 0) return pri;
    const seq =
      operationSequenceRank(a.operation) - operationSequenceRank(b.operation);
    if (seq !== 0) return seq;
    const aSources = a.sourceActionIds.join(",");
    const bSources = b.sourceActionIds.join(",");
    if (aSources !== bSources) {
      return aSources < bSources ? -1 : 1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  return Object.freeze(ordered);
}

function draftToStep(
  draft: DraftStep,
  index: number,
): RuntimeExecutiveAdvisorStageCoordinationStep {
  const key = semanticStepKey(draft.operation, draft.target);
  const id = `coord:${draft.operation}:${key}:s${index}`;
  const blocked = isStepBlocked(draft.preconditions);
  return Object.freeze({
    id,
    intent: draft.intent,
    operation: draft.operation,
    target: draft.target,
    priority: draft.priority,
    authority: draft.authority,
    preconditions: draft.preconditions,
    sourceActionIds: draft.sourceActionIds,
    fromPrimaryGuidance: draft.fromPrimaryGuidance,
    blocked,
  });
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationStep(input: {
  readonly action: RuntimeExecutiveAdvisorExecutiveAction;
  readonly package: RuntimeExecutiveAdvisorGuidancePackage;
  readonly context?: RuntimeExecutiveAdvisorStageCoordinationContext;
}): ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep> {
  const context = input.context ?? {};
  const drafts = buildDraftsForAction({
    action: input.action,
    package: input.package,
    context,
    sourceOrder: 0,
  });
  return Object.freeze(
    dedupeDrafts(drafts).map((draft, index) => draftToStep(draft, index)),
  );
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationState(input: {
  readonly steps: ReadonlyArray<RuntimeExecutiveAdvisorStageCoordinationStep>;
}): RuntimeExecutiveAdvisorStageCoordinationState {
  if (input.steps.length === 0) {
    return "none";
  }
  const allBlocked = input.steps.every((step) => step.blocked);
  if (allBlocked) {
    return "blocked";
  }
  const anyBlocked = input.steps.some((step) => step.blocked);
  const anyReady = input.steps.some((step) => !step.blocked);
  if (anyReady && !anyBlocked) {
    return "ready";
  }
  if (anyReady && anyBlocked) {
    return "planned";
  }
  // Steps exist but awaiting confirmation (blocked on manager-confirmed only)
  const onlyConfirmationBlocked = input.steps.every(
    (step) =>
      step.blocked &&
      step.preconditions.every(
        (precondition) =>
          precondition.satisfied ||
          precondition.kind === "manager-confirmed",
      ),
  );
  if (onlyConfirmationBlocked) {
    return "planned";
  }
  return "blocked";
}

export function isRuntimeExecutiveAdvisorStageCoordinationReady(
  plan: RuntimeExecutiveAdvisorStageCoordinationPlan,
): boolean {
  return (
    plan.state === "ready" &&
    plan.isReady === true &&
    plan.steps.some((step) => !step.blocked)
  );
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
  guidancePackage: RuntimeExecutiveAdvisorGuidancePackage,
  context: RuntimeExecutiveAdvisorStageCoordinationContext = {},
): RuntimeExecutiveAdvisorStageCoordinationPlan {
  const packageValidation =
    validateRuntimeExecutiveAdvisorGuidancePackage(guidancePackage);
  if (
    guidancePackage.state === "none" ||
    guidancePackage.actions.length === 0 ||
    (!packageValidation.ok &&
      guidancePackage === RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE)
  ) {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN;
  }

  if (guidancePackage.actions.length === 0) {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN;
  }

  const drafts: DraftStep[] = [];
  guidancePackage.actions.forEach((action, index) => {
    const actionValidation = validateRuntimeExecutiveAdvisorExecutiveAction(action);
    if (!actionValidation.ok && action.state === "blocked") {
      return;
    }
    if (action.state === "disabled") {
      return;
    }
    drafts.push(
      ...buildDraftsForAction({
        action,
        package: guidancePackage,
        context,
        sourceOrder: index,
      }),
    );
  });

  if (drafts.length === 0) {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN;
  }

  const deduped = dedupeDrafts(drafts);
  const asSteps = deduped.map((draft, index) => draftToStep(draft, index));
  const conflictResolved =
    resolveRuntimeExecutiveAdvisorStageCoordinationConflicts(asSteps);
  const ordered =
    orderRuntimeExecutiveAdvisorStageCoordinationSteps(conflictResolved);

  // Re-stabilize ids after ordering for determinism of identity by content.
  const stabilized = Object.freeze(
    ordered.map((step, index) =>
      Object.freeze({
        ...step,
        id: `coord:${index}:${step.operation}:${semanticStepKey(step.operation, step.target)}`,
      }),
    ),
  );

  const blockedStepIds = Object.freeze(
    stabilized.filter((step) => step.blocked).map((step) => step.id),
  );
  const state = resolveRuntimeExecutiveAdvisorStageCoordinationState({
    steps: stabilized,
  });
  const isReady =
    state === "ready" &&
    stabilized.some((step) => !step.blocked) &&
    blockedStepIds.length === 0;

  return Object.freeze({
    state,
    steps: stabilized,
    blockedStepIds,
    isReady,
    coordinationIdentity: runtimeExecutiveAdvisorStageCoordinationIdentity,
    coordinationVersion: runtimeExecutiveAdvisorStageCoordinationVersion,
    guidanceIdentity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    guidanceVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
  });
}

export function resolveRuntimeExecutiveAdvisorStageCoordinationResult(
  guidancePackage: RuntimeExecutiveAdvisorGuidancePackage,
  context: RuntimeExecutiveAdvisorStageCoordinationContext = {},
): RuntimeExecutiveAdvisorStageCoordinationResult {
  const plan = resolveRuntimeExecutiveAdvisorStageCoordinationPlan(
    guidancePackage,
    context,
  );
  return Object.freeze({
    plan,
    readyStepIds: Object.freeze(
      plan.steps.filter((step) => !step.blocked).map((step) => step.id),
    ),
    blockedStepIds: plan.blockedStepIds,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorStageCoordinationStep(
  value: unknown,
): RuntimeExecutiveAdvisorStageCoordinationValidationResult {
  const issues: RuntimeExecutiveAdvisorStageCoordinationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-step", "step must be a plain object"),
      ]),
    });
  }
  if (!isNonEmptyString(value.id)) {
    issues.push(issue("invalid-step-id", "id must be non-empty", "id"));
  }
  if (!isRuntimeExecutiveAdvisorStageCoordinationIntent(value.intent)) {
    issues.push(issue("invalid-intent", "intent invalid", "intent"));
  }
  if (!isRuntimeExecutiveAdvisorStageCoordinationOperation(value.operation)) {
    issues.push(issue("invalid-operation", "operation invalid", "operation"));
  }
  if (!isRuntimeExecutiveAdvisorStageCoordinationPriority(value.priority)) {
    issues.push(issue("invalid-priority", "priority invalid", "priority"));
  }
  if (!isRuntimeExecutiveAdvisorStageCoordinationAuthority(value.authority)) {
    issues.push(issue("invalid-authority", "authority invalid", "authority"));
  }
  if (!isPlainObject(value.target) || !Array.isArray(value.target.subjectIds)) {
    issues.push(issue("invalid-target", "target.subjectIds required", "target"));
  } else {
    if (
      value.operation === "request-comparison" &&
      value.target.subjectIds.length < 2
    ) {
      issues.push(
        issue(
          "invalid-compare-targets",
          "comparison requires at least two targets",
          "target.subjectIds",
        ),
      );
    }
    if (
      value.operation === "request-path-emphasis" &&
      !isNonEmptyString(value.target.relationshipId) &&
      value.blocked !== true
    ) {
      issues.push(
        issue(
          "invalid-relationship",
          "path emphasis requires relationshipId or blocked step",
          "target.relationshipId",
        ),
      );
    }
    if (
      value.target.presentationState !== undefined &&
      !isRuntimeExecutiveAdvisorStageCoordinationPresentationState(
        value.target.presentationState,
      )
    ) {
      issues.push(
        issue(
          "invalid-presentation-state",
          "presentationState must be minimum, report, or operation",
          "target.presentationState",
        ),
      );
    }
  }
  if (!Array.isArray(value.preconditions)) {
    issues.push(
      issue("invalid-preconditions", "preconditions must be an array", "preconditions"),
    );
  } else {
    value.preconditions.forEach((precondition, index) => {
      if (
        !isPlainObject(precondition) ||
        !isRuntimeExecutiveAdvisorStageCoordinationPreconditionKind(
          precondition.kind,
        ) ||
        typeof precondition.satisfied !== "boolean"
      ) {
        issues.push(
          issue(
            "invalid-precondition",
            "precondition invalid",
            `preconditions[${index}]`,
          ),
        );
      }
    });
  }
  if (!Array.isArray(value.sourceActionIds) || value.sourceActionIds.length === 0) {
    issues.push(
      issue(
        "invalid-source-actions",
        "sourceActionIds must be a non-empty array",
        "sourceActionIds",
      ),
    );
  }
  if (typeof value.blocked !== "boolean") {
    issues.push(issue("invalid-blocked", "blocked must be boolean", "blocked"));
  }
  if (
    value.authority === "manager-confirmed" &&
    Array.isArray(value.preconditions) &&
    value.preconditions.some(
      (entry) =>
        isPlainObject(entry) &&
        entry.kind === "manager-confirmed" &&
        entry.satisfied === false,
    )
  ) {
    issues.push(
      issue(
        "authority-confirmation-inconsistency",
        "manager-confirmed authority requires satisfied confirmation",
        "authority",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAdvisorStageCoordinationPlan(
  value: unknown,
): RuntimeExecutiveAdvisorStageCoordinationValidationResult {
  const issues: RuntimeExecutiveAdvisorStageCoordinationIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-plan", "plan must be a plain object"),
      ]),
    });
  }
  if (!isRuntimeExecutiveAdvisorStageCoordinationState(value.state)) {
    issues.push(issue("invalid-plan-state", "state invalid", "state"));
  }
  if (typeof value.isReady !== "boolean") {
    issues.push(issue("invalid-is-ready", "isReady must be boolean", "isReady"));
  }
  if (!Array.isArray(value.steps)) {
    issues.push(issue("invalid-steps", "steps must be an array", "steps"));
  } else {
    const ids: string[] = [];
    const semanticKeys: string[] = [];
    value.steps.forEach((step, index) => {
      const result = validateRuntimeExecutiveAdvisorStageCoordinationStep(step);
      for (const item of result.issues) {
        issues.push(
          issue(
            item.code,
            item.message,
            item.path ? `steps[${index}].${item.path}` : `steps[${index}]`,
          ),
        );
      }
      if (isPlainObject(step) && isNonEmptyString(step.id)) {
        ids.push(step.id);
      }
      if (
        isPlainObject(step) &&
        isRuntimeExecutiveAdvisorStageCoordinationOperation(step.operation) &&
        isPlainObject(step.target) &&
        Array.isArray(step.target.subjectIds)
      ) {
        semanticKeys.push(
          semanticStepKey(
            step.operation,
            step.target as unknown as RuntimeExecutiveAdvisorStageCoordinationTarget,
          ),
        );
      }
    });
    if (!unique(ids)) {
      issues.push(issue("duplicate-step-ids", "step ids must be unique", "steps"));
    }
    if (!unique(semanticKeys)) {
      issues.push(
        issue(
          "duplicate-semantic-steps",
          "equivalent semantic steps must be coalesced",
          "steps",
        ),
      );
    }

    if (Array.isArray(value.blockedStepIds)) {
      const blockedStepIds = value.blockedStepIds.filter(
        (entry): entry is string => typeof entry === "string",
      );
      for (const blockedId of blockedStepIds) {
        if (!ids.includes(blockedId)) {
          issues.push(
            issue(
              "invalid-blocked-step-ref",
              "blockedStepIds must reference plan steps",
              "blockedStepIds",
            ),
          );
        }
      }
      const expectedBlocked = value.steps
        .filter(
          (step) => isPlainObject(step) && step.blocked === true && isNonEmptyString(step.id),
        )
        .map((step) => (step as { id: string }).id);
      if (
        blockedStepIds.length !== expectedBlocked.length ||
        expectedBlocked.some((id) => !blockedStepIds.includes(id))
      ) {
        issues.push(
          issue(
            "blocked-plan-inconsistency",
            "blockedStepIds inconsistent with step.blocked flags",
            "blockedStepIds",
          ),
        );
      }
    } else {
      issues.push(
        issue(
          "invalid-blocked-step-ids",
          "blockedStepIds must be an array",
          "blockedStepIds",
        ),
      );
    }

    const computedState = resolveRuntimeExecutiveAdvisorStageCoordinationState({
      steps: value.steps as RuntimeExecutiveAdvisorStageCoordinationStep[],
    });
    if (
      isRuntimeExecutiveAdvisorStageCoordinationState(value.state) &&
      value.state !== computedState &&
      !(value.state === "none" && (value.steps as unknown[]).length === 0)
    ) {
      // Allow planned vs blocked nuance only when mixed; otherwise flag.
      if (
        !(
          (value.state === "planned" || value.state === "blocked") &&
          (computedState === "planned" || computedState === "blocked")
        )
      ) {
        issues.push(
          issue(
            "plan-state-inconsistency",
            "plan state inconsistent with steps",
            "state",
          ),
        );
      }
    }

    if (value.isReady === true) {
      if (value.state !== "ready") {
        issues.push(
          issue(
            "ready-plan-inconsistency",
            "isReady requires state=ready",
            "isReady",
          ),
        );
      }
      if (
        Array.isArray(value.blockedStepIds) &&
        value.blockedStepIds.length > 0
      ) {
        issues.push(
          issue(
            "ready-with-blocked",
            "ready plan cannot include blocked steps",
            "isReady",
          ),
        );
      }
    }
  }

  if (value.state === "none") {
    if (
      (Array.isArray(value.steps) && value.steps.length > 0) ||
      value.isReady === true
    ) {
      issues.push(
        issue(
          "empty-plan-inconsistency",
          "none state must have empty steps and isReady=false",
          "state",
        ),
      );
    }
  }

  if (
    value.coordinationIdentity !==
      runtimeExecutiveAdvisorStageCoordinationIdentity ||
    value.coordinationVersion !==
      runtimeExecutiveAdvisorStageCoordinationVersion
  ) {
    issues.push(
      issue(
        "invalid-plan-metadata",
        "coordination identity/version metadata is invalid",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorStageCoordinationIdentity():
  typeof runtimeExecutiveAdvisorStageCoordinationCanonicalIdentity {
  return runtimeExecutiveAdvisorStageCoordinationCanonicalIdentity;
}

/**
 * Additive consumer publication for REX-3:6+: keep orchestration consumers on the
 * REX-3:5 surface without importing REX-3:4 directly. Does not alter coordination.
 */
export { assembleRuntimeExecutiveAdvisorGuidancePackage };

export type {
  RuntimeExecutiveAdvisorExecutiveAction,
  RuntimeExecutiveAdvisorGuidance,
  RuntimeExecutiveAdvisorGuidancePackage,
};

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorStageCoordinationApiNames = Object.freeze([
  "mapRuntimeExecutiveAdvisorActionToCoordinationIntent",
  "resolveRuntimeExecutiveAdvisorStageCoordinationTarget",
  "evaluateRuntimeExecutiveAdvisorStageCoordinationPreconditions",
  "resolveRuntimeExecutiveAdvisorStageCoordinationAuthority",
  "resolveRuntimeExecutiveAdvisorStageCoordinationStep",
  "resolveRuntimeExecutiveAdvisorStageCoordinationPlan",
  "resolveRuntimeExecutiveAdvisorStageCoordinationResult",
  "resolveRuntimeExecutiveAdvisorStageCoordinationState",
  "resolveRuntimeExecutiveAdvisorStageCoordinationConflicts",
  "orderRuntimeExecutiveAdvisorStageCoordinationSteps",
  "isRuntimeExecutiveAdvisorStageCoordinationReady",
  "validateRuntimeExecutiveAdvisorStageCoordinationStep",
  "validateRuntimeExecutiveAdvisorStageCoordinationPlan",
  "verifyRuntimeExecutiveAdvisorStageCoordination",
  "getRuntimeExecutiveAdvisorStageCoordinationIdentity",
  "isRuntimeExecutiveAdvisorStageCoordinationState",
  "isRuntimeExecutiveAdvisorStageCoordinationIntent",
  "isRuntimeExecutiveAdvisorStageCoordinationOperation",
  "isRuntimeExecutiveAdvisorStageCoordinationPriority",
  "isRuntimeExecutiveAdvisorStageCoordinationAuthority",
  "isRuntimeExecutiveAdvisorStageCoordinationPreconditionKind",
  "isRuntimeExecutiveAdvisorStageCoordinationPresentationState",
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorStageCoordinationState",
    "RuntimeExecutiveAdvisorStageCoordinationIntent",
    "RuntimeExecutiveAdvisorStageCoordinationOperation",
    "RuntimeExecutiveAdvisorStageCoordinationPriority",
    "RuntimeExecutiveAdvisorStageCoordinationAuthority",
    "RuntimeExecutiveAdvisorStageCoordinationPreconditionKind",
    "RuntimeExecutiveAdvisorStageCoordinationPresentationState",
    "RuntimeExecutiveAdvisorStageCoordinationWorkflow",
    "RuntimeExecutiveAdvisorStageCoordinationSceneMode",
    "RuntimeExecutiveAdvisorStageCoordinationCapability",
    "RuntimeExecutiveAdvisorStageCoordinationRegistrySection",
    "RuntimeExecutiveAdvisorStageCoordinationTarget",
    "RuntimeExecutiveAdvisorStageCoordinationPrecondition",
    "RuntimeExecutiveAdvisorStageCoordinationStep",
    "RuntimeExecutiveAdvisorStageCoordinationPlan",
    "RuntimeExecutiveAdvisorStageCoordinationResult",
    "RuntimeExecutiveAdvisorStageCoordinationContext",
    "RuntimeExecutiveAdvisorStageCoordinationIssue",
    "RuntimeExecutiveAdvisorStageCoordinationValidationResult",
    "RuntimeExecutiveAdvisorStageCoordinationVerification",
  ] as const);

export const runtimeExecutiveAdvisorStageCoordinationRegistry = Object.freeze({
  identity: runtimeExecutiveAdvisorStageCoordinationIdentity,
  version: runtimeExecutiveAdvisorStageCoordinationVersion,
  namespace: runtimeExecutiveAdvisorStageCoordinationNamespace,
  layer: runtimeExecutiveAdvisorStageCoordinationLayer,
  domain: runtimeExecutiveAdvisorStageCoordinationDomain,
  phase: runtimeExecutiveAdvisorStageCoordinationPhase,
  dependencyIdentity:
    runtimeExecutiveAdvisorStageCoordinationDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorStageCoordinationDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS,
  sectionCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS.length,
  coordinationStates: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES,
  coordinationStateCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES.length,
  coordinationIntents: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS,
  coordinationIntentCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS.length,
  coordinationOperations:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS,
  coordinationOperationCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS.length,
  coordinationPriorities:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES,
  coordinationPriorityCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES.length,
  coordinationAuthorities:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES,
  coordinationAuthorityCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES.length,
  preconditionKinds:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS,
  preconditionKindCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS.length,
  actionMappings: RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS,
  actionMappingCount:
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS.length,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES,
  capabilityCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES.length,
  publicTypes: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveAdvisorStageCoordinationApiNames,
  publicApiCount: runtimeExecutiveAdvisorStageCoordinationApiNames.length,
});

export const runtimeExecutiveAdvisorStageCoordination = Object.freeze({
  phase: "StageCoordination" as const,
  name: "RuntimeExecutiveAdvisorStageCoordination" as const,
  identity: runtimeExecutiveAdvisorStageCoordinationIdentity,
  version: runtimeExecutiveAdvisorStageCoordinationVersion,
  namespace: runtimeExecutiveAdvisorStageCoordinationNamespace,
  layer: runtimeExecutiveAdvisorStageCoordinationLayer,
  domain: runtimeExecutiveAdvisorStageCoordinationDomain,
  architecturalRole:
    runtimeExecutiveAdvisorStageCoordinationArchitecturalRole,
  role: "StageCoordination" as const,
  status: runtimeExecutiveAdvisorStageCoordinationStability,
  upstreamDependency:
    runtimeExecutiveAdvisorStageCoordinationDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorStageCoordinationDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorStageCoordinationSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorStageCoordinationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_BOUNDARY,
  coordinationStates: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES,
  coordinationIntents: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS,
  coordinationOperations:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS,
  coordinationPriorities:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES,
  coordinationAuthorities:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES,
  preconditionKinds:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS,
  actionMappings: RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS,
  operationSequence:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATION_SEQUENCE,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES,
  emptyPlan: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_FORBIDDEN,
  publicTypeNames:
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorStageCoordinationApiNames,
  registry: runtimeExecutiveAdvisorStageCoordinationRegistry,
  guidanceBoundary: "REX-3:4-guidance-actions-only" as const,
  architecturalStatus:
    "REX-3:5 Stage Coordination Complete — Ready for REX-3:6 Advisor Experience Orchestration" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorStageCoordinationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorStageCoordinationIdentity;
  readonly version: typeof runtimeExecutiveAdvisorStageCoordinationVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorStageCoordinationNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorStageCoordinationDependencyIdentity;
  readonly coordinationStateCount: number;
  readonly coordinationIntentCount: number;
  readonly coordinationOperationCount: number;
  readonly coordinationPriorityCount: number;
  readonly coordinationAuthorityCount: number;
  readonly preconditionKindCount: number;
  readonly actionMappingCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly guidanceBoundaryIntact: boolean;
  readonly noStageMutation: boolean;
  readonly noNavigation: boolean;
  readonly noAutoExecution: boolean;
  readonly guidanceOk: boolean;
  readonly noAi: boolean;
}

export function verifyRuntimeExecutiveAdvisorStageCoordination():
  RuntimeExecutiveAdvisorStageCoordinationVerification {
  const module = runtimeExecutiveAdvisorStageCoordination;
  const registry = runtimeExecutiveAdvisorStageCoordinationRegistry;
  const guidanceOk = verifyRuntimeExecutiveAdvisorGuidanceActions();

  const identityOk =
    module.identity ===
      "REX-3:5/RuntimeExecutiveAdvisorStageCoordination" &&
    module.version === "3.5.0" &&
    module.namespace ===
      "nexora.rex.advisor-experience.stage-coordination" &&
    module.upstreamDependency ===
      "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorGuidanceActions" &&
    module.guidanceBoundary === "REX-3:4-guidance-actions-only";

  const vocabOk =
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES],
      ["none", "planned", "ready", "blocked"],
    ) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "CoordinationStates",
        "CoordinationIntents",
        "CoordinationOperations",
        "CoordinationPriorities",
        "CoordinationAuthorities",
        "Preconditions",
        "ActionMappings",
        "Sequencing",
        "Validation",
        "Capabilities",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS.length === 12 &&
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS.length === 12 &&
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS.length === 10;

  const empty = RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN;
  const emptyOk =
    empty.state === "none" &&
    empty.steps.length === 0 &&
    empty.blockedStepIds.length === 0 &&
    empty.isReady === false;

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EMPTY_STAGE_COORDINATION_PLAN) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS);

  const guidanceBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions" &&
    module.boundary.consumesGuidanceActionsOnly === true &&
    module.boundary.importsRex33Directly === false &&
    module.boundary.executesActions === false &&
    module.boundary.mutatesStageState === false &&
    module.boundary.navigatesApplication === false &&
    module.boundary.forgesManagerConfirmation === false &&
    module.boundary.inventsPaths === false;

  // Smoke: inspect maps to observe/focus intents.
  const inspectIntents =
    mapRuntimeExecutiveAdvisorActionToCoordinationIntent("inspect-subject");
  const mappingOk =
    inspectIntents.includes("observe") && inspectIntents.includes("focus");

  const ok =
    identityOk &&
    vocabOk &&
    emptyOk &&
    frozen &&
    guidanceBoundaryIntact &&
    mappingOk &&
    guidanceOk.ok === true &&
    module.boundary.aiProviderIndependent === true &&
    isRuntimeExecutiveAdvisorExecutiveActionKind("inspect-subject");

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorStageCoordinationIdentity,
    version: runtimeExecutiveAdvisorStageCoordinationVersion,
    namespace: runtimeExecutiveAdvisorStageCoordinationNamespace,
    dependencyIdentity:
      runtimeExecutiveAdvisorStageCoordinationDependencyIdentity,
    coordinationStateCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_STATES.length,
    coordinationIntentCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_INTENTS.length,
    coordinationOperationCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_OPERATIONS.length,
    coordinationPriorityCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRIORITIES.length,
    coordinationAuthorityCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_AUTHORITIES.length,
    preconditionKindCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PRECONDITION_KINDS.length,
    actionMappingCount:
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_TO_COORDINATION_MAPPINGS.length,
    capabilityCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_CAPABILITIES.length,
    sectionCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_COORDINATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveAdvisorStageCoordinationApiNames.length,
    frozen,
    guidanceBoundaryIntact,
    noStageMutation: module.boundary.mutatesStageState === false,
    noNavigation: module.boundary.navigatesApplication === false,
    noAutoExecution: module.boundary.executesActions === false,
    guidanceOk: guidanceOk.ok === true,
    noAi: module.boundary.aiProviderIndependent === true,
  });
}
