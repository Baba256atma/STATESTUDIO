/**
 * EX-DRI-3 — Executive Experience ↔ Director Runtime Context & State Binding.
 *
 * Pure binding layer that:
 *   1. normalizes Executive Experience state
 *   2. binds normalized state to EX-DRI context contracts
 *   3. diffs context deterministically
 *   4. projects DRI directions into semantic EX state intents
 *
 * Describes and projects state — never mutates or executes it.
 *
 * Answers:
 *   Given the current Executive Experience state,
 *   what exact semantic context should DRI receive?
 *
 *   Given a DRI state-related direction,
 *   what semantic Executive Experience state change
 *   would eventually be required?
 */

import {
  EXECUTIVE_ATTENTION_DIRECTION_LEVELS,
  EXECUTIVE_FOCUS_DIRECTION_ROLES,
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeInteractionContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
  executiveExperienceDirectorRuntimeIntegrationContractsRegistry,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeInteractionContract,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutiveInteractionDirectionContract,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
  type ExecutiveAttentionDirectionContract,
  type ExecutiveAttentionDirectionLevel,
  type ExecutiveCoordinationDirectionContract,
  type ExecutiveDirectorRuntimeContextContract,
  type ExecutiveDirectorRuntimeCorrelation,
  type ExecutiveDirectorRuntimeInteractionContract,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveDirectorRuntimeResponseContract,
  type ExecutiveDirectorRuntimeResponseStatus,
  type ExecutiveDirectorRuntimeSubjectContract,
  type ExecutiveFocusDirectionContract,
  type ExecutiveFocusDirectionRole,
  type ExecutiveGuidanceDirectionContract,
  type ExecutiveInteractionDirectionContract,
  type ExecutivePresentationDirectionContract,
  type ExecutiveRuntimeDirectionContract,
  type ExecutiveSceneDirectionContract,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts";

// ─── Derived vocabulary from EX-DRI-2 (no EX-DRI-1 / DRI imports) ───────────

/** Canonical surfaces from frozen EX-DRI-2 contracts registry. */
export const EXECUTIVE_CONTEXT_BINDING_SURFACES =
  executiveExperienceDirectorRuntimeIntegrationContractsRegistry.surfaces;

export type ExecutiveExperienceSurface =
  (typeof EXECUTIVE_CONTEXT_BINDING_SURFACES)[number];

/** Canonical presentation states from frozen EX-DRI-2 contracts registry. */
export const EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES =
  executiveExperienceDirectorRuntimeIntegrationContractsRegistry.presentationStates;

export type ExecutivePresentationState =
  (typeof EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES)[number];

/** Canonical interaction kinds from frozen EX-DRI-2 contracts registry. */
export const EXECUTIVE_CONTEXT_BINDING_INTERACTION_KINDS =
  executiveExperienceDirectorRuntimeIntegrationContractsRegistry.interactionKinds;

export type ExecutiveInteractionKind =
  (typeof EXECUTIVE_CONTEXT_BINDING_INTERACTION_KINDS)[number];

/** Canonical focus / attention vocabularies from EX-DRI-2. */
export const EXECUTIVE_CONTEXT_BINDING_FOCUS_ROLES =
  EXECUTIVE_FOCUS_DIRECTION_ROLES;
export type { ExecutiveFocusDirectionRole };

export const EXECUTIVE_CONTEXT_BINDING_ATTENTION_LEVELS =
  EXECUTIVE_ATTENTION_DIRECTION_LEVELS;
export type { ExecutiveAttentionDirectionLevel };

/** Mode type from the canonical context contract surface. */
export type ExecutiveExperienceMode = NonNullable<
  ExecutiveDirectorRuntimeContextContract["mode"]
>;

/**
 * Additive re-export surface for EX-DRI-4 / EX-DRI-5 binding layers.
 * Preserves EX-DRI-3 as the chain boundary — no direct EX-DRI-2 imports
 * by downstream interaction or scene/presentation binding.
 */
export type {
  ExecutiveAttentionDirectionContract,
  ExecutiveCoordinationDirectionContract,
  ExecutiveDirectorRuntimeContextContract,
  ExecutiveDirectorRuntimeCorrelation,
  ExecutiveDirectorRuntimeInteractionContract,
  ExecutiveDirectorRuntimeRequestContract,
  ExecutiveDirectorRuntimeResponseContract,
  ExecutiveDirectorRuntimeResponseStatus,
  ExecutiveDirectorRuntimeSubjectContract,
  ExecutiveFocusDirectionContract,
  ExecutiveGuidanceDirectionContract,
  ExecutiveInteractionDirectionContract,
  ExecutivePresentationDirectionContract,
  ExecutiveRuntimeDirectionContract,
  ExecutiveSceneDirectionContract,
};

export {
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeInteractionContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeInteractionContract,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutiveInteractionDirectionContract,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeContextStateBindingIdentity =
  "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingVersion =
  "1.3.0" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingNamespace =
  "nexora.ex.dri.integration.context-state-binding" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingRole =
  "ExecutiveExperienceDirectorRuntimeContextStateBinding" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity =
  executiveExperienceDirectorRuntimeIntegrationContractsIdentity;

export const executiveExperienceDirectorRuntimeContextStateBindingDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingDirection =
  "ex-state-to-dri-context-and-dri-direction-to-ex-projection" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeContextStateBindingStateless =
  true as const;

export const executiveExperienceDirectorRuntimeContextStateBindingMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeContextStateBindingCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeContextStateBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeContextStateBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeContextStateBindingNamespace,
    role: executiveExperienceDirectorRuntimeContextStateBindingRole,
    dependency:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity,
    bindingDirection:
      executiveExperienceDirectorRuntimeContextStateBindingDirection,
    deterministicStatus:
      executiveExperienceDirectorRuntimeContextStateBindingDeterministic,
    statelessStatus:
      executiveExperienceDirectorRuntimeContextStateBindingStateless,
    mutationPolicy:
      executiveExperienceDirectorRuntimeContextStateBindingMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeContextStateBindingSideEffectPolicy,
  });

export const EXECUTIVE_CONTEXT_STATE_BINDING_PRINCIPLE =
  "EX state is application-specific. EX-DRI binding converts that state into stable semantic contracts. DRI must not depend directly on React state, component props, stores, renderer state, or route-specific state." as const;

// ─── Change kinds / issue codes / projection vocabulary ─────────────────────

export const EXECUTIVE_CONTEXT_CHANGE_KINDS = Object.freeze([
  "surface",
  "mode",
  "selection",
  "focus",
  "goal",
  "pack",
  "model",
  "presentation",
] as const);

export type ExecutiveContextChangeKind =
  (typeof EXECUTIVE_CONTEXT_CHANGE_KINDS)[number];

export const EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES = Object.freeze([
  "INVALID_SURFACE",
  "INVALID_MODE",
  "INVALID_SUBJECT",
  "INVALID_PRESENTATION_STATE",
  "DUPLICATE_SURFACE",
  "MISSING_ACTIVE_SURFACE",
  "INCONSISTENT_SELECTED_SUBJECT",
  "INCONSISTENT_FOCUSED_SUBJECT",
] as const);

export type ExecutiveContextStateBindingIssueCode =
  (typeof EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES)[number];

export const EXECUTIVE_STATE_PROJECTION_KINDS = Object.freeze([
  "focus",
  "selection",
  "presentation",
  "surface-coordination",
] as const);

export type ExecutiveStateProjectionKind =
  (typeof EXECUTIVE_STATE_PROJECTION_KINDS)[number];

export const EXECUTIVE_STATE_PROJECTION_STATUSES = Object.freeze([
  "applied-to-projection",
  "deferred",
  "unsupported",
] as const);

export type ExecutiveStateProjectionStatus =
  (typeof EXECUTIVE_STATE_PROJECTION_STATUSES)[number];

/**
 * Explicit precedence: surface-specific fields override only that surface;
 * shared executive state supplies common goal/model/pack/mode context.
 */
export const EXECUTIVE_CONTEXT_PRECEDENCE_RULES = Object.freeze([
  Object.freeze({
    id: "surface-specific-overrides-surface-fields",
    order: 1,
    statement:
      "surface-specific semantic state overrides only its corresponding surface field",
  }),
  Object.freeze({
    id: "shared-executive-state-common-context",
    order: 2,
    statement:
      "shared executive state provides common goal/model/pack/mode context",
  }),
  Object.freeze({
    id: "active-surface-must-be-explicit",
    order: 3,
    statement:
      "active surface comes only from explicit Executive Experience state",
  }),
  Object.freeze({
    id: "no-hidden-implicit-precedence",
    order: 4,
    statement: "no hidden implicit precedence is permitted",
  }),
] as const);

// ─── State snapshots ────────────────────────────────────────────────────────

/**
 * Renderer-independent semantic state for a single surface binding unit.
 */
export interface ExecutiveExperienceStateSnapshot {
  readonly surface: ExecutiveExperienceSurface;
  readonly mode?: ExecutiveExperienceMode;
  readonly selectedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly focusedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly activeGoalId?: string;
  readonly activePackId?: string;
  readonly activeModelId?: string;
  readonly presentationState?: ExecutivePresentationState;
}

export interface ExecutiveExperienceSurfaceState {
  readonly surface: ExecutiveExperienceSurface;
  readonly selectedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly focusedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly presentationState?: ExecutivePresentationState;
}

export interface ExecutiveExperienceCompositeStateSnapshot {
  readonly activeSurface: ExecutiveExperienceSurface;
  readonly surfaces: ReadonlyArray<ExecutiveExperienceSurfaceState>;
  readonly activeGoalId?: string;
  readonly activePackId?: string;
  readonly activeModelId?: string;
  readonly mode?: ExecutiveExperienceMode;
}

export interface ExecutiveContextStateBindingIssue {
  readonly code: ExecutiveContextStateBindingIssueCode;
  readonly path?: string;
  readonly message: string;
}

export interface ExecutiveContextStateBindingResult {
  readonly valid: boolean;
  readonly context?: ExecutiveDirectorRuntimeContextContract;
  readonly issues: ReadonlyArray<ExecutiveContextStateBindingIssue>;
}

export interface ExecutiveExperienceContextBindingResult {
  readonly valid: boolean;
  readonly activeContext?: ExecutiveDirectorRuntimeContextContract;
  readonly surfaceContexts: ReadonlyArray<ExecutiveDirectorRuntimeContextContract>;
  readonly issues: ReadonlyArray<ExecutiveContextStateBindingIssue>;
}

export interface ExecutiveContextDiff {
  readonly changed: boolean;
  readonly changes: ReadonlyArray<ExecutiveContextChangeKind>;
}

export interface ExecutiveFocusStateProjection {
  readonly kind: "focus";
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export interface ExecutiveSelectionStateProjection {
  readonly kind: "selection";
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export interface ExecutivePresentationStateProjection {
  readonly kind: "presentation";
  readonly surface: ExecutiveExperienceSurface;
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly state: ExecutivePresentationState;
}

export interface ExecutiveSurfaceCoordinationStateProjection {
  readonly kind: "surface-coordination";
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly targetSurfaces: ReadonlyArray<ExecutiveExperienceSurface>;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export type ExecutiveStateProjection =
  | ExecutiveFocusStateProjection
  | ExecutiveSelectionStateProjection
  | ExecutivePresentationStateProjection
  | ExecutiveSurfaceCoordinationStateProjection;

export interface ExecutiveStateProjectionResult {
  readonly status: ExecutiveStateProjectionStatus;
  readonly directionKind: ExecutiveRuntimeDirectionContract["kind"];
  readonly projection?: ExecutiveStateProjection;
}

export interface ExecutiveStateProjectionsResult {
  readonly results: ReadonlyArray<ExecutiveStateProjectionResult>;
  readonly projections: ReadonlyArray<ExecutiveStateProjection>;
}

// ─── Guarantees / forbidden ─────────────────────────────────────────────────

export const EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "ex-state-never-passed-directly-to-dri",
    order: 1,
    statement: "EX application state is never passed directly to DRI.",
  }),
  Object.freeze({
    id: "only-semantic-canonical-context-crosses",
    order: 2,
    statement: "Only semantic canonical context crosses the boundary.",
  }),
  Object.freeze({
    id: "state-binding-deterministic",
    order: 3,
    statement: "State binding is deterministic.",
  }),
  Object.freeze({
    id: "state-binding-stateless",
    order: 4,
    statement: "State binding is stateless.",
  }),
  Object.freeze({
    id: "source-state-never-mutated",
    order: 5,
    statement: "Source state is never mutated.",
  }),
  Object.freeze({
    id: "react-state-not-part-of-contract",
    order: 6,
    statement: "React state is not part of the contract.",
  }),
  Object.freeze({
    id: "renderer-state-not-part-of-contract",
    order: 7,
    statement: "Renderer state is not part of the contract.",
  }),
  Object.freeze({
    id: "active-surface-from-explicit-state",
    order: 8,
    statement: "Active surface comes from explicit state.",
  }),
  Object.freeze({
    id: "selection-mapped-not-interpreted",
    order: 9,
    statement: "Selection is mapped, not interpreted.",
  }),
  Object.freeze({
    id: "focus-mapped-not-calculated",
    order: 10,
    statement: "Focus is mapped, not calculated.",
  }),
  Object.freeze({
    id: "goal-identity-mapped-without-koi",
    order: 11,
    statement: "Goal identity is mapped without KOI calculation.",
  }),
  Object.freeze({
    id: "kpi-not-calculated",
    order: 12,
    statement: "KPI is not calculated.",
  }),
  Object.freeze({
    id: "koi-not-calculated",
    order: 13,
    statement: "KOI is not calculated.",
  }),
  Object.freeze({
    id: "presentation-mapped-not-resolved",
    order: 14,
    statement: "Presentation state is mapped, not resolved.",
  }),
  Object.freeze({
    id: "context-diffing-semantic",
    order: 15,
    statement: "Context diffing is semantic.",
  }),
  Object.freeze({
    id: "directions-projected-never-applied",
    order: 16,
    statement: "DRI directions may be projected but never applied.",
  }),
  Object.freeze({
    id: "projection-does-not-mutate-ui",
    order: 17,
    statement: "Projection does not mutate UI.",
  }),
  Object.freeze({
    id: "unsupported-directions-explicit",
    order: 18,
    statement: "Unsupported directions are explicit.",
  }),
  Object.freeze({
    id: "multi-surface-state-deterministic",
    order: 19,
    statement: "Multi-surface state remains deterministic.",
  }),
  Object.freeze({
    id: "context-precedence-explicit",
    order: 20,
    statement: "Context precedence is explicit.",
  }),
  Object.freeze({
    id: "no-runtime-engines-in-ex-dri-3",
    order: 21,
    statement: "No runtime engines exist in EX-DRI-3.",
  }),
  Object.freeze({
    id: "no-framework-coupling-in-ex-dri-3",
    order: 22,
    statement: "No framework coupling exists in EX-DRI-3.",
  }),
] as const);

export type ExecutiveContextStateBindingGuarantee =
  (typeof EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES)[number];

export const EXECUTIVE_CONTEXT_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "interaction event execution",
    "React hooks",
    "React context providers",
    "UI adapters",
    "Zustand stores",
    "Redux reducers",
    "Three.js binding",
    "camera control",
    "scene changes",
    "animations",
    "object highlighting",
    "object dimming",
    "Advisor rendering",
    "Insight rendering",
    "Timeline mutation",
    "Explorer mutation",
    "runtime engine calls",
    "focus resolution",
    "attention resolution",
    "presentation resolution",
    "guidance generation",
    "KPI computation",
    "KOI computation",
    "scenario simulation",
    "decision workflow",
    "execution workflow",
    "network access",
    "database access",
    "async orchestration",
  ] as const);

// ─── Internal helpers ───────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalOpaqueId(value: unknown): boolean {
  return value === undefined || hasOpaqueId(value);
}

function isExecutiveExperienceSurface(
  value: unknown,
): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_CONTEXT_BINDING_SURFACES as readonly unknown[]).includes(
    value,
  );
}

function isExecutivePresentationState(
  value: unknown,
): value is ExecutivePresentationState {
  return (
    EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

function isExecutiveExperienceMode(
  value: unknown,
): value is ExecutiveExperienceMode {
  return isExecutiveDirectorRuntimeContextContract({
    surface: "stage",
    mode: value,
  });
}

function freezeSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract,
): ExecutiveDirectorRuntimeSubjectContract {
  return createExecutiveDirectorRuntimeSubjectContract(subject);
}

function subjectsEqual(
  left: ExecutiveDirectorRuntimeSubjectContract | undefined,
  right: ExecutiveDirectorRuntimeSubjectContract | undefined,
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  return (
    left.id === right.id &&
    left.kind === right.kind &&
    (left.label ?? undefined) === (right.label ?? undefined)
  );
}

function issue(
  code: ExecutiveContextStateBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveContextStateBindingIssue {
  return Object.freeze(
    path !== undefined ? { code, message, path } : { code, message },
  );
}

function surfaceOrderIndex(surface: ExecutiveExperienceSurface): number {
  return EXECUTIVE_CONTEXT_BINDING_SURFACES.indexOf(surface);
}

function freezeSurfaceState(
  state: ExecutiveExperienceSurfaceState,
): ExecutiveExperienceSurfaceState {
  return Object.freeze({
    surface: state.surface,
    ...(state.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(state.selectedSubject) }
      : {}),
    ...(state.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(state.focusedSubject) }
      : {}),
    ...(state.presentationState !== undefined
      ? { presentationState: state.presentationState }
      : {}),
  });
}

function freezeSnapshot(
  snapshot: ExecutiveExperienceStateSnapshot,
): ExecutiveExperienceStateSnapshot {
  return Object.freeze({
    surface: snapshot.surface,
    ...(snapshot.mode !== undefined ? { mode: snapshot.mode } : {}),
    ...(snapshot.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(snapshot.selectedSubject) }
      : {}),
    ...(snapshot.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(snapshot.focusedSubject) }
      : {}),
    ...(snapshot.activeGoalId !== undefined
      ? { activeGoalId: snapshot.activeGoalId }
      : {}),
    ...(snapshot.activePackId !== undefined
      ? { activePackId: snapshot.activePackId }
      : {}),
    ...(snapshot.activeModelId !== undefined
      ? { activeModelId: snapshot.activeModelId }
      : {}),
    ...(snapshot.presentationState !== undefined
      ? { presentationState: snapshot.presentationState }
      : {}),
  });
}

function collectSnapshotIssues(
  value: unknown,
  path = "snapshot",
): ReadonlyArray<ExecutiveContextStateBindingIssue> {
  if (!isPlainObject(value)) {
    return [
      issue("INVALID_SURFACE", "state snapshot must be a plain object", path),
    ];
  }
  const issues: ExecutiveContextStateBindingIssue[] = [];
  if (!isExecutiveExperienceSurface(value.surface)) {
    issues.push(
      issue("INVALID_SURFACE", "surface must be a canonical surface", `${path}.surface`),
    );
  }
  if (value.mode !== undefined && !isExecutiveExperienceMode(value.mode)) {
    issues.push(
      issue("INVALID_MODE", "mode must be a known executive mode", `${path}.mode`),
    );
  }
  if (
    value.selectedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.selectedSubject)
  ) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "selectedSubject must be a valid subject contract",
        `${path}.selectedSubject`,
      ),
    );
  }
  if (
    value.focusedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.focusedSubject)
  ) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "focusedSubject must be a valid subject contract",
        `${path}.focusedSubject`,
      ),
    );
  }
  if (
    value.presentationState !== undefined &&
    !isExecutivePresentationState(value.presentationState)
  ) {
    issues.push(
      issue(
        "INVALID_PRESENTATION_STATE",
        "presentationState must be minimum|report|operation",
        `${path}.presentationState`,
      ),
    );
  }
  if (!isOptionalOpaqueId(value.activeGoalId)) {
    issues.push(
      issue("INVALID_SUBJECT", "activeGoalId must be a non-empty string", `${path}.activeGoalId`),
    );
  }
  if (!isOptionalOpaqueId(value.activePackId)) {
    issues.push(
      issue("INVALID_SUBJECT", "activePackId must be a non-empty string", `${path}.activePackId`),
    );
  }
  if (!isOptionalOpaqueId(value.activeModelId)) {
    issues.push(
      issue("INVALID_SUBJECT", "activeModelId must be a non-empty string", `${path}.activeModelId`),
    );
  }
  return Object.freeze(issues);
}

function collectSurfaceStateIssues(
  value: unknown,
  path = "surfaceState",
): ReadonlyArray<ExecutiveContextStateBindingIssue> {
  if (!isPlainObject(value)) {
    return [
      issue("INVALID_SURFACE", "surface state must be a plain object", path),
    ];
  }
  const issues: ExecutiveContextStateBindingIssue[] = [];
  if (!isExecutiveExperienceSurface(value.surface)) {
    issues.push(
      issue("INVALID_SURFACE", "surface must be a canonical surface", `${path}.surface`),
    );
  }
  if (
    value.selectedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.selectedSubject)
  ) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "selectedSubject must be a valid subject contract",
        `${path}.selectedSubject`,
      ),
    );
  }
  if (
    value.focusedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.focusedSubject)
  ) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "focusedSubject must be a valid subject contract",
        `${path}.focusedSubject`,
      ),
    );
  }
  if (
    value.presentationState !== undefined &&
    !isExecutivePresentationState(value.presentationState)
  ) {
    issues.push(
      issue(
        "INVALID_PRESENTATION_STATE",
        "presentationState must be minimum|report|operation",
        `${path}.presentationState`,
      ),
    );
  }
  return Object.freeze(issues);
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveExperienceStateSnapshot(
  value: unknown,
): value is ExecutiveExperienceStateSnapshot {
  return collectSnapshotIssues(value).length === 0;
}

export function isExecutiveExperienceSurfaceState(
  value: unknown,
): value is ExecutiveExperienceSurfaceState {
  return collectSurfaceStateIssues(value).length === 0;
}

export function isExecutiveExperienceCompositeStateSnapshot(
  value: unknown,
): value is ExecutiveExperienceCompositeStateSnapshot {
  if (!isPlainObject(value)) return false;
  if (!isExecutiveExperienceSurface(value.activeSurface)) return false;
  if (!Array.isArray(value.surfaces)) return false;
  if (value.mode !== undefined && !isExecutiveExperienceMode(value.mode)) {
    return false;
  }
  if (!isOptionalOpaqueId(value.activeGoalId)) return false;
  if (!isOptionalOpaqueId(value.activePackId)) return false;
  if (!isOptionalOpaqueId(value.activeModelId)) return false;
  if (!value.surfaces.every((entry) => isExecutiveExperienceSurfaceState(entry))) {
    return false;
  }
  const surfaceIds = value.surfaces.map((entry) => entry.surface);
  if (new Set(surfaceIds).size !== surfaceIds.length) return false;
  return value.surfaces.some(
    (entry) => entry.surface === value.activeSurface,
  );
}

export function isExecutiveContextStateBindingResult(
  value: unknown,
): value is ExecutiveContextStateBindingResult {
  if (!isPlainObject(value)) return false;
  if (typeof value.valid !== "boolean") return false;
  if (!Array.isArray(value.issues)) return false;
  if (
    !value.issues.every(
      (entry) =>
        isPlainObject(entry) &&
        (EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES as readonly unknown[]).includes(
          entry.code,
        ) &&
        typeof entry.message === "string",
    )
  ) {
    return false;
  }
  if (value.valid) {
    return (
      value.context !== undefined &&
      isExecutiveDirectorRuntimeContextContract(value.context)
    );
  }
  return value.context === undefined;
}

export function isExecutiveContextChangeKind(
  value: unknown,
): value is ExecutiveContextChangeKind {
  return (EXECUTIVE_CONTEXT_CHANGE_KINDS as readonly unknown[]).includes(value);
}

export function isExecutiveStateProjectionKind(
  value: unknown,
): value is ExecutiveStateProjectionKind {
  return (EXECUTIVE_STATE_PROJECTION_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveStateProjectionStatus(
  value: unknown,
): value is ExecutiveStateProjectionStatus {
  return (EXECUTIVE_STATE_PROJECTION_STATUSES as readonly unknown[]).includes(
    value,
  );
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normalizeExecutiveExperienceState(
  input: ExecutiveExperienceStateSnapshot,
): ExecutiveExperienceStateSnapshot {
  const issues = collectSnapshotIssues(input);
  if (issues.length > 0) {
    throw new TypeError(
      `invalid ExecutiveExperienceStateSnapshot: ${issues[0]!.code}`,
    );
  }
  return freezeSnapshot(input);
}

export function normalizeExecutiveExperienceCompositeState(
  input: ExecutiveExperienceCompositeStateSnapshot,
): ExecutiveExperienceCompositeStateSnapshot {
  if (!isPlainObject(input as unknown)) {
    throw new TypeError("composite state must be a plain object");
  }
  if (!isExecutiveExperienceSurface(input.activeSurface)) {
    throw new TypeError("activeSurface must be a canonical surface");
  }
  if (!Array.isArray(input.surfaces)) {
    throw new TypeError("surfaces must be an array");
  }
  if (input.mode !== undefined && !isExecutiveExperienceMode(input.mode)) {
    throw new TypeError("mode must be a known executive mode");
  }
  if (!isOptionalOpaqueId(input.activeGoalId)) {
    throw new TypeError("activeGoalId must be a non-empty string when provided");
  }
  if (!isOptionalOpaqueId(input.activePackId)) {
    throw new TypeError("activePackId must be a non-empty string when provided");
  }
  if (!isOptionalOpaqueId(input.activeModelId)) {
    throw new TypeError("activeModelId must be a non-empty string when provided");
  }

  const seen = new Set<ExecutiveExperienceSurface>();
  const normalizedSurfaces: ExecutiveExperienceSurfaceState[] = [];
  for (const entry of input.surfaces) {
    const surfaceIssues = collectSurfaceStateIssues(entry);
    if (surfaceIssues.length > 0) {
      throw new TypeError(
        `invalid surface state: ${surfaceIssues[0]!.code}`,
      );
    }
    if (seen.has(entry.surface)) {
      throw new TypeError("DUPLICATE_SURFACE");
    }
    seen.add(entry.surface);
    normalizedSurfaces.push(freezeSurfaceState(entry));
  }

  normalizedSurfaces.sort(
    (left, right) =>
      surfaceOrderIndex(left.surface) - surfaceOrderIndex(right.surface),
  );

  if (!seen.has(input.activeSurface)) {
    throw new TypeError("MISSING_ACTIVE_SURFACE");
  }

  return Object.freeze({
    activeSurface: input.activeSurface,
    surfaces: Object.freeze(normalizedSurfaces),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
    ...(input.activeGoalId !== undefined
      ? { activeGoalId: input.activeGoalId }
      : {}),
    ...(input.activePackId !== undefined
      ? { activePackId: input.activePackId }
      : {}),
    ...(input.activeModelId !== undefined
      ? { activeModelId: input.activeModelId }
      : {}),
  });
}

// ─── Selection / focus / goal / pack / model / presentation helpers ─────────

export function bindSelectedExecutiveSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract | undefined,
): ExecutiveDirectorRuntimeSubjectContract | undefined {
  if (subject === undefined) return undefined;
  if (!isExecutiveDirectorRuntimeSubjectContract(subject)) {
    throw new TypeError("selected subject must be a valid subject contract");
  }
  return freezeSubject(subject);
}

export function bindFocusedExecutiveSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract | undefined,
): ExecutiveDirectorRuntimeSubjectContract | undefined {
  if (subject === undefined) return undefined;
  if (!isExecutiveDirectorRuntimeSubjectContract(subject)) {
    throw new TypeError("focused subject must be a valid subject contract");
  }
  return freezeSubject(subject);
}

export function bindActiveGoalId(
  activeGoalId: string | undefined,
): string | undefined {
  if (activeGoalId === undefined) return undefined;
  if (!hasOpaqueId(activeGoalId)) {
    throw new TypeError("activeGoalId must be a non-empty opaque identifier");
  }
  return activeGoalId;
}

export function bindActivePackId(
  activePackId: string | undefined,
): string | undefined {
  if (activePackId === undefined) return undefined;
  if (!hasOpaqueId(activePackId)) {
    throw new TypeError("activePackId must be a non-empty opaque identifier");
  }
  return activePackId;
}

export function bindActiveModelId(
  activeModelId: string | undefined,
): string | undefined {
  if (activeModelId === undefined) return undefined;
  if (!hasOpaqueId(activeModelId)) {
    throw new TypeError("activeModelId must be a non-empty opaque identifier");
  }
  return activeModelId;
}

export function bindExecutivePresentationState(
  presentationState: ExecutivePresentationState | undefined,
): ExecutivePresentationState | undefined {
  if (presentationState === undefined) return undefined;
  if (!isExecutivePresentationState(presentationState)) {
    throw new TypeError(
      "presentationState must be minimum|report|operation",
    );
  }
  return presentationState;
}

// ─── Context binding ────────────────────────────────────────────────────────

function buildContextFromParts(input: {
  readonly surface: ExecutiveExperienceSurface;
  readonly mode?: ExecutiveExperienceMode;
  readonly selectedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly focusedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly activeGoalId?: string;
  readonly activePackId?: string;
  readonly activeModelId?: string;
  readonly presentationState?: ExecutivePresentationState;
}): ExecutiveDirectorRuntimeContextContract {
  return createExecutiveDirectorRuntimeContextContract({
    surface: input.surface,
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
    ...(input.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(input.selectedSubject) }
      : {}),
    ...(input.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(input.focusedSubject) }
      : {}),
    ...(input.activeGoalId !== undefined
      ? { activeGoalId: input.activeGoalId }
      : {}),
    ...(input.activePackId !== undefined
      ? { activePackId: input.activePackId }
      : {}),
    ...(input.activeModelId !== undefined
      ? { activeModelId: input.activeModelId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
  });
}

/**
 * Converts EX state into a canonical EX → DRI context contract.
 * Deterministic mapping only — no runtime interpretation.
 */
export function bindExecutiveExperienceStateToDirectorRuntimeContext(
  input: ExecutiveExperienceStateSnapshot,
): ExecutiveContextStateBindingResult {
  const issues = [...collectSnapshotIssues(input)];
  if (issues.length > 0) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze(issues),
    });
  }

  const context = buildContextFromParts({
    surface: input.surface,
    mode: input.mode,
    selectedSubject: bindSelectedExecutiveSubject(input.selectedSubject),
    focusedSubject: bindFocusedExecutiveSubject(input.focusedSubject),
    activeGoalId: bindActiveGoalId(input.activeGoalId),
    activePackId: bindActivePackId(input.activePackId),
    activeModelId: bindActiveModelId(input.activeModelId),
    presentationState: bindExecutivePresentationState(input.presentationState),
  });

  return Object.freeze({
    valid: true,
    context,
    issues: Object.freeze([]),
  });
}

/**
 * Binds a complete multi-surface Executive Experience snapshot.
 * Shared goal/model/pack/mode apply to all surface contexts;
 * surface-specific selection/focus/presentation remain distinct.
 */
export function bindExecutiveExperienceCompositeState(
  input: ExecutiveExperienceCompositeStateSnapshot,
): ExecutiveExperienceContextBindingResult {
  const issues: ExecutiveContextStateBindingIssue[] = [];

  if (!isPlainObject(input as unknown)) {
    return Object.freeze({
      valid: false,
      surfaceContexts: Object.freeze([]),
      issues: Object.freeze([
        issue("INVALID_SURFACE", "composite state must be a plain object"),
      ]),
    });
  }

  if (!isExecutiveExperienceSurface(input.activeSurface)) {
    issues.push(
      issue(
        "INVALID_SURFACE",
        "activeSurface must be a canonical surface",
        "activeSurface",
      ),
    );
  }

  if (input.mode !== undefined && !isExecutiveExperienceMode(input.mode)) {
    issues.push(
      issue("INVALID_MODE", "mode must be a known executive mode", "mode"),
    );
  }

  if (!isOptionalOpaqueId(input.activeGoalId)) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "activeGoalId must be a non-empty string",
        "activeGoalId",
      ),
    );
  }
  if (!isOptionalOpaqueId(input.activePackId)) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "activePackId must be a non-empty string",
        "activePackId",
      ),
    );
  }
  if (!isOptionalOpaqueId(input.activeModelId)) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "activeModelId must be a non-empty string",
        "activeModelId",
      ),
    );
  }

  if (!Array.isArray(input.surfaces)) {
    issues.push(
      issue("INVALID_SURFACE", "surfaces must be an array", "surfaces"),
    );
    return Object.freeze({
      valid: false,
      surfaceContexts: Object.freeze([]),
      issues: Object.freeze(issues),
    });
  }

  const seen = new Set<string>();
  for (let index = 0; index < input.surfaces.length; index += 1) {
    const entry = input.surfaces[index]!;
    const surfaceIssues = collectSurfaceStateIssues(
      entry,
      `surfaces[${index}]`,
    );
    issues.push(...surfaceIssues);
    if (isExecutiveExperienceSurfaceState(entry)) {
      if (seen.has(entry.surface)) {
        issues.push(
          issue(
            "DUPLICATE_SURFACE",
            "duplicate surface in composite state",
            `surfaces[${index}].surface`,
          ),
        );
      }
      seen.add(entry.surface);
    }
  }

  if (
    isExecutiveExperienceSurface(input.activeSurface) &&
    !seen.has(input.activeSurface)
  ) {
    issues.push(
      issue(
        "MISSING_ACTIVE_SURFACE",
        "activeSurface must appear in surfaces",
        "activeSurface",
      ),
    );
  }

  if (issues.length > 0) {
    return Object.freeze({
      valid: false,
      surfaceContexts: Object.freeze([]),
      issues: Object.freeze(issues),
    });
  }

  const normalized = normalizeExecutiveExperienceCompositeState(input);
  const shared = {
    mode: normalized.mode,
    activeGoalId: normalized.activeGoalId,
    activePackId: normalized.activePackId,
    activeModelId: normalized.activeModelId,
  };

  const surfaceContexts = Object.freeze(
    normalized.surfaces.map((surfaceState) =>
      buildContextFromParts({
        surface: surfaceState.surface,
        mode: shared.mode,
        selectedSubject: surfaceState.selectedSubject,
        focusedSubject: surfaceState.focusedSubject,
        activeGoalId: shared.activeGoalId,
        activePackId: shared.activePackId,
        activeModelId: shared.activeModelId,
        presentationState: surfaceState.presentationState,
      }),
    ),
  );

  const activeSurfaceState = normalized.surfaces.find(
    (entry) => entry.surface === normalized.activeSurface,
  )!;

  const activeContext = buildContextFromParts({
    surface: activeSurfaceState.surface,
    mode: shared.mode,
    selectedSubject: activeSurfaceState.selectedSubject,
    focusedSubject: activeSurfaceState.focusedSubject,
    activeGoalId: shared.activeGoalId,
    activePackId: shared.activePackId,
    activeModelId: shared.activeModelId,
    presentationState: activeSurfaceState.presentationState,
  });

  return Object.freeze({
    valid: true,
    activeContext,
    surfaceContexts,
    issues: Object.freeze([]),
  });
}

// ─── Equality & diffing ─────────────────────────────────────────────────────

export function areExecutiveDirectorRuntimeContextsEqual(
  left: ExecutiveDirectorRuntimeContextContract,
  right: ExecutiveDirectorRuntimeContextContract,
): boolean {
  if (!isExecutiveDirectorRuntimeContextContract(left)) return false;
  if (!isExecutiveDirectorRuntimeContextContract(right)) return false;
  return (
    left.surface === right.surface &&
    (left.mode ?? undefined) === (right.mode ?? undefined) &&
    subjectsEqual(left.selectedSubject, right.selectedSubject) &&
    subjectsEqual(left.focusedSubject, right.focusedSubject) &&
    (left.activeGoalId ?? undefined) === (right.activeGoalId ?? undefined) &&
    (left.activePackId ?? undefined) === (right.activePackId ?? undefined) &&
    (left.activeModelId ?? undefined) === (right.activeModelId ?? undefined) &&
    (left.presentationState ?? undefined) ===
      (right.presentationState ?? undefined)
  );
}

export function diffExecutiveDirectorRuntimeContext(
  previous: ExecutiveDirectorRuntimeContextContract,
  next: ExecutiveDirectorRuntimeContextContract,
): ExecutiveContextDiff {
  if (!isExecutiveDirectorRuntimeContextContract(previous)) {
    throw new TypeError("previous must be a valid context contract");
  }
  if (!isExecutiveDirectorRuntimeContextContract(next)) {
    throw new TypeError("next must be a valid context contract");
  }

  const changes: ExecutiveContextChangeKind[] = [];
  if (previous.surface !== next.surface) changes.push("surface");
  if ((previous.mode ?? undefined) !== (next.mode ?? undefined)) {
    changes.push("mode");
  }
  if (!subjectsEqual(previous.selectedSubject, next.selectedSubject)) {
    changes.push("selection");
  }
  if (!subjectsEqual(previous.focusedSubject, next.focusedSubject)) {
    changes.push("focus");
  }
  if (
    (previous.activeGoalId ?? undefined) !== (next.activeGoalId ?? undefined)
  ) {
    changes.push("goal");
  }
  if (
    (previous.activePackId ?? undefined) !== (next.activePackId ?? undefined)
  ) {
    changes.push("pack");
  }
  if (
    (previous.activeModelId ?? undefined) !== (next.activeModelId ?? undefined)
  ) {
    changes.push("model");
  }
  if (
    (previous.presentationState ?? undefined) !==
    (next.presentationState ?? undefined)
  ) {
    changes.push("presentation");
  }

  // Preserve canonical change-kind ordering.
  const ordered = EXECUTIVE_CONTEXT_CHANGE_KINDS.filter((kind) =>
    changes.includes(kind),
  );

  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

// ─── DRI → EX semantic projections (never applied) ──────────────────────────

function projectFocusDirection(
  direction: ExecutiveFocusDirectionContract,
): ExecutiveStateProjectionResult {
  const projection: ExecutiveFocusStateProjection = Object.freeze({
    kind: "focus" as const,
    surface: direction.surface,
    ...(direction.subject !== undefined
      ? { subject: freezeSubject(direction.subject) }
      : {}),
  });
  return Object.freeze({
    status: "applied-to-projection" as const,
    directionKind: "focus" as const,
    projection,
  });
}

function projectPresentationDirection(
  direction: ExecutivePresentationDirectionContract,
): ExecutiveStateProjectionResult {
  const projection: ExecutivePresentationStateProjection = Object.freeze({
    kind: "presentation" as const,
    surface: direction.surface,
    subject: freezeSubject(direction.subject),
    state: direction.state,
  });
  return Object.freeze({
    status: "applied-to-projection" as const,
    directionKind: "presentation" as const,
    projection,
  });
}

function projectCoordinationDirection(
  direction: ExecutiveCoordinationDirectionContract,
): ExecutiveStateProjectionResult {
  const projection: ExecutiveSurfaceCoordinationStateProjection = Object.freeze({
    kind: "surface-coordination" as const,
    sourceSurface: direction.sourceSurface,
    targetSurfaces: Object.freeze([...direction.targetSurfaces]),
    ...(direction.subject !== undefined
      ? { subject: freezeSubject(direction.subject) }
      : {}),
  });
  return Object.freeze({
    status: "applied-to-projection" as const,
    directionKind: "coordination" as const,
    projection,
  });
}

/**
 * Translates one DRI → EX direction into a semantic state projection.
 * Does not mutate Executive Experience state.
 * Accepts unknown so invalid runtime values yield explicit `unsupported`.
 */
export function projectDirectorRuntimeDirectionToExecutiveState(
  direction: unknown,
): ExecutiveStateProjectionResult {
  if (!isExecutiveRuntimeDirectionContract(direction)) {
    const kind =
      isPlainObject(direction) && typeof direction.kind === "string"
        ? direction.kind
        : "unknown";
    return Object.freeze({
      status: "unsupported" as const,
      directionKind: kind as ExecutiveRuntimeDirectionContract["kind"],
    });
  }

  switch (direction.kind) {
    case "focus":
      return projectFocusDirection(direction);
    case "presentation":
      return projectPresentationDirection(direction);
    case "coordination":
      return projectCoordinationDirection(direction);
    case "scene":
    case "attention":
    case "guidance":
    case "interaction":
      // Deferred to later EX-DRI binding layers — never silently dropped.
      return Object.freeze({
        status: "deferred" as const,
        directionKind: direction.kind,
      });
    default: {
      const _exhaustive: never = direction;
      void _exhaustive;
      return Object.freeze({
        status: "unsupported" as const,
        directionKind: "scene" as const,
      });
    }
  }
}

export function projectDirectorRuntimeDirectionsToExecutiveState(
  directions: ReadonlyArray<unknown>,
): ExecutiveStateProjectionsResult {
  if (!Array.isArray(directions)) {
    throw new TypeError("directions must be an array");
  }
  const results = Object.freeze(
    directions.map((direction) =>
      projectDirectorRuntimeDirectionToExecutiveState(direction),
    ),
  );
  const projections = Object.freeze(
    results
      .filter(
        (result) =>
          result.status === "applied-to-projection" &&
          result.projection !== undefined,
      )
      .map((result) => result.projection!),
  );
  return Object.freeze({ results, projections });
}

// ─── Catalogs / registry ────────────────────────────────────────────────────

export const EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveExperienceSurface",
  "ExecutivePresentationState",
  "ExecutiveExperienceMode",
  "ExecutiveExperienceStateSnapshot",
  "ExecutiveExperienceSurfaceState",
  "ExecutiveExperienceCompositeStateSnapshot",
  "ExecutiveContextStateBindingIssue",
  "ExecutiveContextStateBindingIssueCode",
  "ExecutiveContextStateBindingResult",
  "ExecutiveExperienceContextBindingResult",
  "ExecutiveContextChangeKind",
  "ExecutiveContextDiff",
  "ExecutiveStateProjectionKind",
  "ExecutiveStateProjectionStatus",
  "ExecutiveFocusStateProjection",
  "ExecutiveSelectionStateProjection",
  "ExecutivePresentationStateProjection",
  "ExecutiveSurfaceCoordinationStateProjection",
  "ExecutiveStateProjection",
  "ExecutiveStateProjectionResult",
  "ExecutiveStateProjectionsResult",
  "ExecutiveContextStateBindingGuarantee",
  "ExecutiveExperienceDirectorRuntimeContextStateBindingVerification",
] as const);

export const executiveExperienceDirectorRuntimeContextStateBindingValidatorNames =
  Object.freeze([
    "isExecutiveExperienceStateSnapshot",
    "isExecutiveExperienceSurfaceState",
    "isExecutiveExperienceCompositeStateSnapshot",
    "isExecutiveContextStateBindingResult",
    "isExecutiveContextChangeKind",
    "isExecutiveStateProjectionKind",
    "isExecutiveStateProjectionStatus",
  ] as const);

export const executiveExperienceDirectorRuntimeContextStateBindingApiNames =
  Object.freeze([
    "normalizeExecutiveExperienceState",
    "normalizeExecutiveExperienceCompositeState",
    "bindExecutiveExperienceStateToDirectorRuntimeContext",
    "bindExecutiveExperienceCompositeState",
    "bindSelectedExecutiveSubject",
    "bindFocusedExecutiveSubject",
    "bindActiveGoalId",
    "bindActivePackId",
    "bindActiveModelId",
    "bindExecutivePresentationState",
    "diffExecutiveDirectorRuntimeContext",
    "areExecutiveDirectorRuntimeContextsEqual",
    "projectDirectorRuntimeDirectionToExecutiveState",
    "projectDirectorRuntimeDirectionsToExecutiveState",
    ...executiveExperienceDirectorRuntimeContextStateBindingValidatorNames,
    "getExecutiveExperienceDirectorRuntimeContextStateBindingIdentity",
    "verifyExecutiveExperienceDirectorRuntimeContextStateBinding",
  ] as const);

export const EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "StateSnapshots",
  "SurfaceState",
  "Bindings",
  "Diffing",
  "Projection",
  "Validation",
  "Guarantees",
] as const);

export function getExecutiveExperienceDirectorRuntimeContextStateBindingIdentity():
  typeof executiveExperienceDirectorRuntimeContextStateBindingCanonicalIdentity {
  return executiveExperienceDirectorRuntimeContextStateBindingCanonicalIdentity;
}

export const executiveExperienceDirectorRuntimeContextStateBindingRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeContextStateBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeContextStateBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeContextStateBindingNamespace,
    role: executiveExperienceDirectorRuntimeContextStateBindingRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyPath,
    principle: EXECUTIVE_CONTEXT_STATE_BINDING_PRINCIPLE,
    surfaces: EXECUTIVE_CONTEXT_BINDING_SURFACES,
    surfaceCount: EXECUTIVE_CONTEXT_BINDING_SURFACES.length,
    presentationStates: EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES,
    presentationStateCount:
      EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES.length,
    changeKinds: EXECUTIVE_CONTEXT_CHANGE_KINDS,
    changeKindCount: EXECUTIVE_CONTEXT_CHANGE_KINDS.length,
    issueCodes: EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES.length,
    projectionKinds: EXECUTIVE_STATE_PROJECTION_KINDS,
    projectionKindCount: EXECUTIVE_STATE_PROJECTION_KINDS.length,
    projectionStatuses: EXECUTIVE_STATE_PROJECTION_STATUSES,
    projectionStatusCount: EXECUTIVE_STATE_PROJECTION_STATUSES.length,
    precedenceRules: EXECUTIVE_CONTEXT_PRECEDENCE_RULES,
    precedenceRuleCount: EXECUTIVE_CONTEXT_PRECEDENCE_RULES.length,
    guarantees: EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.length,
    forbiddenResponsibilities:
      EXECUTIVE_CONTEXT_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES,
    forbiddenResponsibilityCount:
      EXECUTIVE_CONTEXT_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES.length,
    validators:
      executiveExperienceDirectorRuntimeContextStateBindingValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeContextStateBindingValidatorNames
        .length,
    registrySections: EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS.length,
    publicTypes: EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES,
    publicTypeCount: EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeContextStateBindingApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeContextStateBindingApiNames.length,
  });

export const executiveExperienceDirectorRuntimeContextStateBinding =
  Object.freeze({
    phase: "EX-DRI-3" as const,
    name: "ExecutiveExperienceDirectorRuntimeContextStateBinding" as const,
    identity:
      executiveExperienceDirectorRuntimeContextStateBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeContextStateBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeContextStateBindingNamespace,
    role: executiveExperienceDirectorRuntimeContextStateBindingRole,
    stage: "ContextStateBinding" as const,
    status: "ContextStateBindingReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyPath,
    bindingDirection:
      executiveExperienceDirectorRuntimeContextStateBindingDirection,
    deterministic:
      executiveExperienceDirectorRuntimeContextStateBindingDeterministic,
    stateless:
      executiveExperienceDirectorRuntimeContextStateBindingStateless,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_CONTEXT_STATE_BINDING_PRINCIPLE,
    surfaces: EXECUTIVE_CONTEXT_BINDING_SURFACES,
    presentationStates: EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES,
    changeKinds: EXECUTIVE_CONTEXT_CHANGE_KINDS,
    projectionKinds: EXECUTIVE_STATE_PROJECTION_KINDS,
    projectionStatuses: EXECUTIVE_STATE_PROJECTION_STATUSES,
    precedenceRules: EXECUTIVE_CONTEXT_PRECEDENCE_RULES,
    guarantees: EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES,
    forbiddenResponsibilities:
      EXECUTIVE_CONTEXT_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES,
    publicApiSurface:
      executiveExperienceDirectorRuntimeContextStateBindingApiNames,
    publicTypes: EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeContextStateBindingRegistry,
    contractsBoundary: "EX-DRI-2-contracts-only" as const,
    architecturalStatus:
      "ContextStateBinding Complete · Deterministic · Stateless · Immutable · Framework-Independent · ReadyForExDriInteractionBinding" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeContextStateBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeContextStateBindingIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeContextStateBindingVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeContextStateBindingNamespace;
  readonly role: typeof executiveExperienceDirectorRuntimeContextStateBindingRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity;
  readonly surfaceCount: number;
  readonly changeKindCount: number;
  readonly projectionKindCount: number;
  readonly projectionStatusCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly validatorCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesCompatible: boolean;
  readonly precedenceExplicit: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeContextStateBinding():
  ExecutiveExperienceDirectorRuntimeContextStateBindingVerification {
  const binding = executiveExperienceDirectorRuntimeContextStateBinding;
  const registry = executiveExperienceDirectorRuntimeContextStateBindingRegistry;

  const identityOk =
    binding.identity ===
      "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding" &&
    binding.version === "1.3.0" &&
    binding.namespace ===
      "nexora.ex.dri.integration.context-state-binding" &&
    binding.role ===
      "ExecutiveExperienceDirectorRuntimeContextStateBinding" &&
    binding.status === "ContextStateBindingReady" &&
    binding.upstreamDependency ===
      "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts" &&
    binding.upstreamDependency ===
      executiveExperienceDirectorRuntimeIntegrationContractsIdentity &&
    registry.dependencyIdentity === binding.upstreamDependency &&
    binding.contractsBoundary === "EX-DRI-2-contracts-only";

  const dependencyOk =
    binding.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts";

  const surfacesCompatible = exactOrder(EXECUTIVE_CONTEXT_BINDING_SURFACES, [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);

  const presentationStatesCompatible = exactOrder(
    EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES,
    ["minimum", "report", "operation"],
  );

  const changeKindsOk = exactOrder(EXECUTIVE_CONTEXT_CHANGE_KINDS, [
    "surface",
    "mode",
    "selection",
    "focus",
    "goal",
    "pack",
    "model",
    "presentation",
  ]);

  const projectionOk =
    exactOrder(EXECUTIVE_STATE_PROJECTION_KINDS, [
      "focus",
      "selection",
      "presentation",
      "surface-coordination",
    ]) &&
    exactOrder(EXECUTIVE_STATE_PROJECTION_STATUSES, [
      "applied-to-projection",
      "deferred",
      "unsupported",
    ]);

  const issueCodesOk =
    exactOrder(EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES, [
      "INVALID_SURFACE",
      "INVALID_MODE",
      "INVALID_SUBJECT",
      "INVALID_PRESENTATION_STATE",
      "DUPLICATE_SURFACE",
      "MISSING_ACTIVE_SURFACE",
      "INCONSISTENT_SELECTED_SUBJECT",
      "INCONSISTENT_FOCUSED_SUBJECT",
    ]) && unique([...EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES]);

  const guaranteesOk =
    EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.length === 22 &&
    unique(
      EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.map((entry) => entry.id),
    ) &&
    EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const precedenceExplicit =
    EXECUTIVE_CONTEXT_PRECEDENCE_RULES.length === 4 &&
    unique(EXECUTIVE_CONTEXT_PRECEDENCE_RULES.map((entry) => entry.id));

  const registryIntegrityOk =
    registry.surfaceCount === EXECUTIVE_CONTEXT_BINDING_SURFACES.length &&
    registry.changeKindCount === EXECUTIVE_CONTEXT_CHANGE_KINDS.length &&
    registry.projectionKindCount ===
      EXECUTIVE_STATE_PROJECTION_KINDS.length &&
    registry.projectionStatusCount ===
      EXECUTIVE_STATE_PROJECTION_STATUSES.length &&
    registry.issueCodeCount ===
      EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.length &&
    registry.validatorCount ===
      executiveExperienceDirectorRuntimeContextStateBindingValidatorNames
        .length &&
    registry.registrySectionCount ===
      EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeContextStateBindingApiNames.length &&
    exactOrder(
      [...EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "StateSnapshots",
        "SurfaceState",
        "Bindings",
        "Diffing",
        "Projection",
        "Validation",
        "Guarantees",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(binding) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeContextStateBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_BINDING_SURFACES) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_BINDING_INTERACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_CHANGE_KINDS) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_STATE_PROJECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_STATE_PROJECTION_STATUSES) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_PRECEDENCE_RULES) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES) &&
    Object.isFrozen(
      EXECUTIVE_CONTEXT_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES,
    ) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS);

  const contractsBoundaryIntact =
    binding.upstreamDependency ===
      "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts" &&
    binding.contractsBoundary === "EX-DRI-2-contracts-only";

  const frameworkIndependent =
    binding.frameworkIndependent === true &&
    binding.rendererIndependent === true &&
    binding.browserIndependent === true &&
    binding.stateless === true;

  const ok =
    identityOk &&
    dependencyOk &&
    surfacesCompatible &&
    presentationStatesCompatible &&
    changeKindsOk &&
    projectionOk &&
    issueCodesOk &&
    guaranteesOk &&
    precedenceExplicit &&
    registryIntegrityOk &&
    immutabilityOk &&
    contractsBoundaryIntact &&
    frameworkIndependent &&
    binding.principle === EXECUTIVE_CONTEXT_STATE_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeContextStateBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeContextStateBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeContextStateBindingNamespace,
    role: executiveExperienceDirectorRuntimeContextStateBindingRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeContextStateBindingDependencyIdentity,
    surfaceCount: EXECUTIVE_CONTEXT_BINDING_SURFACES.length,
    changeKindCount: EXECUTIVE_CONTEXT_CHANGE_KINDS.length,
    projectionKindCount: EXECUTIVE_STATE_PROJECTION_KINDS.length,
    projectionStatusCount: EXECUTIVE_STATE_PROJECTION_STATUSES.length,
    issueCodeCount: EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES.length,
    validatorCount:
      executiveExperienceDirectorRuntimeContextStateBindingValidatorNames
        .length,
    registrySectionCount:
      EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS.length,
    publicTypeCount:
      EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      executiveExperienceDirectorRuntimeContextStateBindingApiNames.length,
    frozen: immutabilityOk,
    contractsBoundaryIntact,
    frameworkIndependent,
    presentationStatesCompatible,
    precedenceExplicit,
  });
}
