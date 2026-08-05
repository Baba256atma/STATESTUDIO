/**
 * NOL-2:3 — NexoraObject Representation Transition & Behavior Engine
 *
 * Controls how representation moves between Minimum / Report / Operation.
 * Produces transition plans and projected visual states only — no mutation
 * of NOL-1 object data, no renderer execution.
 *
 * Upstream: NOL-2:1 + NOL-2:2 only.
 * Identity: NOL-2:3/NexoraObjectRepresentationTransitionBehaviorEngine
 */

import {
  materialRepresentationFoundationIdentity,
  materialRepresentationSchemaVersion,
  validateNexoraObjectRepresentation,
  type NexoraObjectAffordanceDescriptor,
  type NexoraObjectInformationDensity,
  type NexoraObjectMaterialEmphasis,
  type NexoraObjectRepresentation,
  type NexoraObjectRepresentationProfile,
  type NexoraObjectRepresentationState,
  type NexoraObjectSeedColor,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";
import {
  materialStateResolutionSchemaVersion,
  resolveMaterialState,
  type NexoraObjectMaterialResolutionContext,
  type NexoraObjectMaterialState,
} from "./nexoraObjectMaterialStateResolutionModel.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const representationTransitionBehaviorEngineIdentity =
  "NOL-2:3/NexoraObjectRepresentationTransitionBehaviorEngine" as const;

export const representationTransitionBehaviorEngineVersion = "1.0.0" as const;

export const representationTransitionBehaviorSchemaVersion = "1.0.0" as const;

export const NOL_REPRESENTATION_TRANSITION_IDENTITY =
  representationTransitionBehaviorEngineIdentity;
export const NOL_REPRESENTATION_TRANSITION_VERSION =
  representationTransitionBehaviorEngineVersion;
export const NOL_REPRESENTATION_TRANSITION_SCHEMA_VERSION =
  representationTransitionBehaviorSchemaVersion;

export const NOL_REPRESENTATION_TRANSITION_UPSTREAM = Object.freeze([
  materialRepresentationFoundationIdentity,
  "NOL-2:2/NexoraObjectMaterialStateResolutionModel",
] as const);

// ─── Core types ─────────────────────────────────────────────────────────────

export type NexoraObjectRepresentationTransitionType =
  | "ExpandToReport"
  | "ExpandToOperation"
  | "CollapseToReport"
  | "CollapseToMinimum"
  | "FocusReveal"
  | "SelectionReveal"
  | "AttentionReveal"
  | "EnterOperation"
  | "ExitOperation"
  | "EnterHistorical"
  | "ExitHistorical"
  | "Hide"
  | "Show"
  | "ResetRepresentation";

export type NexoraObjectRepresentationTransitionPhase =
  | "Idle"
  | "Preparing"
  | "ExitingCurrent"
  | "Transforming"
  | "EnteringTarget"
  | "Settling"
  | "Completed"
  | "Interrupted"
  | "Cancelled"
  | "Failed";

export type NexoraObjectRepresentationBehaviorType =
  | "Scale"
  | "Fade"
  | "DepthShift"
  | "FocusPull"
  | "BackgroundDim"
  | "CaptionReveal"
  | "IndicatorReveal"
  | "BadgeReveal"
  | "AffordanceReveal"
  | "RelationshipReveal"
  | "AttentionPulse"
  | "HistoricalMute"
  | "OperationLock"
  | "CameraHint";

export type NexoraObjectRepresentationInterruptionMode =
  | "Cancel"
  | "Reverse"
  | "Replace";

export interface NexoraObjectRepresentationTransitionContext {
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly reason?: string;
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt?: string;
  readonly selected?: boolean;
  readonly focused?: boolean;
  readonly highlighted?: boolean;
  readonly hidden?: boolean;
  readonly historical?: boolean;
  readonly locked?: boolean;
  readonly archived?: boolean;
  readonly deleted?: boolean;
  readonly authorizedForOperation?: boolean;
  readonly stageDensity?: "Sparse" | "Balanced" | "Dense";
  readonly reducedMotion?: boolean;
  readonly theme?: "Light" | "Dark" | "Auto";
}

export interface NexoraObjectRepresentationTransitionRequest {
  readonly transitionId: string;
  readonly objectId: string;
  readonly type: NexoraObjectRepresentationTransitionType;
  readonly targetState?: NexoraObjectRepresentationState;
  readonly context: NexoraObjectRepresentationTransitionContext;
  readonly expectedRepresentationVersion?: string;
  readonly expectedTransitionRevision?: number;
  readonly dryRun?: boolean;
}

export interface NexoraObjectRepresentationTransitionState {
  readonly objectId: string;
  readonly currentState: NexoraObjectRepresentationState;
  readonly targetState: NexoraObjectRepresentationState;
  readonly phase: NexoraObjectRepresentationTransitionPhase;
  readonly progress: number;
  readonly direction: "Forward" | "Reverse";
  readonly transitionRevision: number;
  readonly startedAt?: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly activeTransitionId?: string;
}

export interface NexoraObjectRepresentationBehaviorDescriptor {
  readonly behavior: NexoraObjectRepresentationBehaviorType;
  readonly phase: "Before" | "During" | "After";
  readonly intensity: "None" | "Low" | "Medium" | "High";
  readonly durationWeight: number;
  readonly reversible: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}

export type NexoraObjectRepresentationTransitionErrorCode =
  | "REPRESENTATION_TRANSITION_INVALID_REQUEST"
  | "REPRESENTATION_TRANSITION_OBJECT_MISMATCH"
  | "REPRESENTATION_TRANSITION_UNSUPPORTED_TYPE"
  | "REPRESENTATION_TRANSITION_INVALID_STATE"
  | "REPRESENTATION_TRANSITION_HIDDEN"
  | "REPRESENTATION_TRANSITION_DELETED"
  | "REPRESENTATION_TRANSITION_ARCHIVED"
  | "REPRESENTATION_TRANSITION_OPERATION_UNAUTHORIZED"
  | "REPRESENTATION_TRANSITION_HISTORICAL_MUTATION_FORBIDDEN"
  | "REPRESENTATION_TRANSITION_NOT_REVERSIBLE"
  | "REPRESENTATION_TRANSITION_NOT_INTERRUPTIBLE"
  | "REPRESENTATION_TRANSITION_ALREADY_ACTIVE"
  | "REPRESENTATION_TRANSITION_REVISION_CONFLICT"
  | "REPRESENTATION_TRANSITION_VERSION_CONFLICT"
  | "REPRESENTATION_TRANSITION_DUPLICATE_ID"
  | "REPRESENTATION_TRANSITION_POLICY_REJECTED"
  | "REPRESENTATION_TRANSITION_GUARD_REJECTED"
  | "REPRESENTATION_TRANSITION_INVALID_PROGRESS"
  | "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION"
  | "REPRESENTATION_TRANSITION_UNSUPPORTED_VERSION";

export type NexoraObjectRepresentationTransitionWarningCode =
  | "REPRESENTATION_OPERATION_FALLBACK_TO_REPORT"
  | "REPRESENTATION_READ_ONLY_OPERATION"
  | "REPRESENTATION_REDUCED_MOTION_APPLIED"
  | "REPRESENTATION_DENSE_STAGE_COMPACTED"
  | "REPRESENTATION_HISTORICAL_LIMIT_APPLIED"
  | "REPRESENTATION_NO_STATE_CHANGE"
  | "REPRESENTATION_EXISTING_TRANSITION_INTERRUPTED";

export interface NexoraObjectRepresentationTransitionError {
  readonly code: NexoraObjectRepresentationTransitionErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly transitionId?: string;
  readonly transitionType?: NexoraObjectRepresentationTransitionType;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectRepresentationTransitionWarning {
  readonly code: NexoraObjectRepresentationTransitionWarningCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectRepresentationTransitionBehaviorException extends Error {
  readonly code: NexoraObjectRepresentationTransitionErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;
  constructor(error: NexoraObjectRepresentationTransitionError) {
    super(error.message);
    this.name = "NexoraObjectRepresentationTransitionBehaviorException";
    this.code = error.code;
    this.details = error.details;
  }
}

export type NexoraObjectRepresentationTransitionGuard = (
  context: NexoraObjectRepresentationTransitionGuardContext,
) => NexoraObjectRepresentationTransitionGuardResult;

export interface NexoraObjectRepresentationTransitionGuardContext {
  readonly currentRepresentation: NexoraObjectRepresentation;
  readonly currentMaterialState: NexoraObjectMaterialState;
  readonly transitionState: NexoraObjectRepresentationTransitionState;
  readonly request: NexoraObjectRepresentationTransitionRequest;
}

export interface NexoraObjectRepresentationTransitionGuardResult {
  readonly allowed: boolean;
  readonly fallbackState?: NexoraObjectRepresentationState;
  readonly code?: NexoraObjectRepresentationTransitionErrorCode;
  readonly message?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectRepresentationTransitionDefinition {
  readonly type: NexoraObjectRepresentationTransitionType;
  readonly allowedFrom: readonly NexoraObjectRepresentationState[];
  readonly targetState: NexoraObjectRepresentationState | "ContextResolved";
  readonly reversible: boolean;
  readonly interruptible: boolean;
  readonly guards: readonly NexoraObjectRepresentationTransitionGuard[];
  readonly behaviors: readonly NexoraObjectRepresentationBehaviorType[];
}

export interface NexoraObjectRepresentationBehaviorPolicyResult {
  readonly allowed: boolean;
  readonly targetState?: NexoraObjectRepresentationState;
  readonly behaviors?: readonly NexoraObjectRepresentationBehaviorDescriptor[];
  readonly warnings?: readonly NexoraObjectRepresentationTransitionWarning[];
  readonly code?: NexoraObjectRepresentationTransitionErrorCode;
  readonly message?: string;
}

export interface NexoraObjectRepresentationBehaviorPolicy {
  readonly policyId: string;
  readonly priority: number;
  readonly appliesTo: readonly NexoraObjectRepresentationTransitionType[];
  readonly evaluate: (
    context: NexoraObjectRepresentationTransitionGuardContext,
  ) => NexoraObjectRepresentationBehaviorPolicyResult;
}

export interface NexoraObjectRepresentationTransitionPlan {
  readonly transitionId: string;
  readonly objectId: string;
  readonly type: NexoraObjectRepresentationTransitionType;
  readonly accepted: boolean;
  readonly noOp: boolean;
  readonly fallbackApplied: boolean;
  readonly previousRepresentation: NexoraObjectRepresentation;
  readonly targetRepresentation: NexoraObjectRepresentation;
  readonly previousMaterialState: NexoraObjectMaterialState;
  readonly targetMaterialState: NexoraObjectMaterialState;
  readonly previousTransitionState: NexoraObjectRepresentationTransitionState;
  readonly projectedTransitionState: NexoraObjectRepresentationTransitionState;
  readonly behaviors: readonly NexoraObjectRepresentationBehaviorDescriptor[];
  readonly evaluatedPolicies: readonly string[];
  readonly warnings: readonly NexoraObjectRepresentationTransitionWarning[];
  readonly errors: readonly NexoraObjectRepresentationTransitionError[];
}

export interface NexoraObjectRepresentationTransitionResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly dryRun: boolean;
  readonly fallbackApplied: boolean;
  readonly previousRepresentation: NexoraObjectRepresentation;
  readonly nextRepresentation: NexoraObjectRepresentation;
  readonly previousMaterialState: NexoraObjectMaterialState;
  readonly nextMaterialState: NexoraObjectMaterialState;
  readonly previousTransitionState: NexoraObjectRepresentationTransitionState;
  readonly nextTransitionState: NexoraObjectRepresentationTransitionState;
  readonly plan: NexoraObjectRepresentationTransitionPlan;
  readonly events: readonly NexoraObjectRepresentationTransitionEvent[];
  readonly warnings: readonly NexoraObjectRepresentationTransitionWarning[];
  readonly errors: readonly NexoraObjectRepresentationTransitionError[];
}

export type NexoraObjectRepresentationTransitionEventType =
  | "RepresentationTransitionStarted"
  | "RepresentationTransitionCompleted"
  | "RepresentationTransitionRejected"
  | "RepresentationTransitionInterrupted"
  | "RepresentationTransitionReversed"
  | "RepresentationFallbackApplied"
  | "RepresentationOperationEntered"
  | "RepresentationOperationExited"
  | "RepresentationHistoricalEntered"
  | "RepresentationReset";

export interface NexoraObjectRepresentationTransitionEvent {
  readonly eventId: string;
  readonly transitionId: string;
  readonly objectId: string;
  readonly type: NexoraObjectRepresentationTransitionEventType;
  readonly occurredAt: string;
  readonly transitionRevision: number;
  readonly source: NexoraObjectRepresentationTransitionContext["source"];
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectRepresentationTransitionRecord {
  readonly transitionId: string;
  readonly objectId: string;
  readonly type: NexoraObjectRepresentationTransitionType;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly fromState: NexoraObjectRepresentationState;
  readonly toState: NexoraObjectRepresentationState;
  readonly previousRevision: number;
  readonly nextRevision: number;
  readonly occurredAt: string;
  readonly source: NexoraObjectRepresentationTransitionContext["source"];
  readonly reason?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly warnings: readonly NexoraObjectRepresentationTransitionWarning[];
  readonly errors: readonly NexoraObjectRepresentationTransitionError[];
}

export interface NexoraObjectRepresentationProgressProjection {
  readonly transitionId: string;
  readonly objectId: string;
  readonly phase: NexoraObjectRepresentationTransitionPhase;
  readonly progress: number;
  readonly sourceState: NexoraObjectRepresentationState;
  readonly targetState: NexoraObjectRepresentationState;
  readonly activeBehaviors: readonly NexoraObjectRepresentationBehaviorDescriptor[];
  readonly materialInterpolationHints: Readonly<Record<string, unknown>>;
  readonly geometryInterpolationHints: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectRepresentationCollectionEntry {
  readonly representation: NexoraObjectRepresentation;
  readonly materialState: NexoraObjectMaterialState;
  readonly transitionState: NexoraObjectRepresentationTransitionState;
}

export interface NexoraObjectRepresentationTransitionBatchRequest {
  readonly requests: readonly NexoraObjectRepresentationTransitionRequest[];
  readonly mode: "Atomic" | "BestEffort";
  readonly correlationId?: string;
}

export interface NexoraObjectRepresentationTransitionBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly results: readonly NexoraObjectRepresentationTransitionResult[];
  readonly changedObjectIds: readonly string[];
  readonly rejectedObjectIds: readonly string[];
}

export interface NexoraObjectRepresentationTransitionDependencies {
  readonly now: () => string;
  readonly createEventId: () => string;
  readonly createTransitionId?: () => string;
  readonly emitRejectedEvents?: boolean;
  readonly materialTheme?: "Light" | "Dark" | "Auto";
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function err(
  code: NexoraObjectRepresentationTransitionErrorCode,
  message: string,
  extras?: Partial<NexoraObjectRepresentationTransitionError>,
): NexoraObjectRepresentationTransitionError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraObjectRepresentationTransitionWarningCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectRepresentationTransitionWarning {
  return Object.freeze({ code, message, details });
}

function behavior(
  name: NexoraObjectRepresentationBehaviorType,
  phase: NexoraObjectRepresentationBehaviorDescriptor["phase"],
  intensity: NexoraObjectRepresentationBehaviorDescriptor["intensity"],
  durationWeight: number,
  reversible = true,
  payload: Readonly<Record<string, unknown>> = {},
): NexoraObjectRepresentationBehaviorDescriptor {
  return Object.freeze({
    behavior: name,
    phase,
    intensity,
    durationWeight,
    reversible,
    payload: Object.freeze({ ...payload }),
  });
}

const MUTATION_AFFORDANCES = Object.freeze([
  "AddToStage",
  "RemoveFromStage",
  "Approve",
  "Reject",
  "Cancel",
  "Start",
  "Pause",
  "Resume",
  "Complete",
  "Edit",
] as const);

const EXECUTION_AFFORDANCES = Object.freeze([
  "Start",
  "Pause",
  "Resume",
  "Complete",
  "Cancel",
] as const);

let defaultEventSeq = 0;
let defaultTransitionSeq = 0;

export const defaultNexoraObjectRepresentationTransitionDependencies: NexoraObjectRepresentationTransitionDependencies =
  Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      defaultEventSeq += 1;
      return `nrt-evt-${defaultEventSeq}`;
    },
    createTransitionId: () => {
      defaultTransitionSeq += 1;
      return `nrt-trn-${defaultTransitionSeq}`;
    },
    emitRejectedEvents: true,
    materialTheme: "Light",
  });

function resolveDeps(
  deps?: NexoraObjectRepresentationTransitionDependencies,
): NexoraObjectRepresentationTransitionDependencies {
  return deps
    ? Object.freeze({
        ...defaultNexoraObjectRepresentationTransitionDependencies,
        ...deps,
      })
    : defaultNexoraObjectRepresentationTransitionDependencies;
}

function materialContextFrom(
  context: NexoraObjectRepresentationTransitionContext,
  deps: NexoraObjectRepresentationTransitionDependencies,
): NexoraObjectMaterialResolutionContext {
  return {
    theme: context.theme ?? deps.materialTheme ?? "Light",
    stageDensity: context.stageDensity,
    historicalMode: context.historical === true || context.deleted === true,
    interactionMode:
      context.authorizedForOperation === true ? "Operate" : "Inspect",
  };
}

function densityFor(
  state: NexoraObjectRepresentationState,
  profile: NexoraObjectRepresentationProfile,
): NexoraObjectInformationDensity {
  if (profile === "Historical") return "Executive";
  if (state === "Minimum") return "Seed";
  if (state === "Report") return "Executive";
  return "Operational";
}

function profileFor(
  state: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationTransitionContext,
): NexoraObjectRepresentationProfile {
  if (context.historical === true || context.deleted === true) {
    return "Historical";
  }
  if (state === "Operation") return "Operational";
  if (state === "Report") return "Executive";
  return "Seed";
}

function geometryFor(
  current: NexoraObjectRepresentation,
  state: NexoraObjectRepresentationState,
) {
  if (state === "Minimum") {
    return deepFreeze({
      ...current.geometry,
      size: "S" as const,
      scale: 0.75,
      depth: 0.1,
      anchorCount: 1,
    });
  }
  if (state === "Report") {
    return deepFreeze({
      ...current.geometry,
      size: "M" as const,
      scale: 1.25,
      depth: 0.4,
      anchorCount: 2,
    });
  }
  return deepFreeze({
    ...current.geometry,
    size: "L" as const,
    scale: 1.6,
    depth: 0.75,
    anchorCount: 4,
  });
}

function typographyFor(
  current: NexoraObjectRepresentation,
  state: NexoraObjectRepresentationState,
) {
  if (state === "Minimum") {
    return deepFreeze({
      ...current.typography,
      captionMaxLines: 1,
      captionPriority: "Low" as const,
      labelMode: "Short" as const,
      numericEmphasis: false,
    });
  }
  if (state === "Report") {
    return deepFreeze({
      ...current.typography,
      captionMaxLines: 2,
      captionPriority: "Normal" as const,
      labelMode: "Full" as const,
      numericEmphasis: true,
    });
  }
  return deepFreeze({
    ...current.typography,
    captionMaxLines: 3,
    captionPriority: "High" as const,
    labelMode: "Full" as const,
    numericEmphasis: true,
  });
}

function indicatorsFor(
  current: NexoraObjectRepresentation,
  state: NexoraObjectRepresentationState,
) {
  if (state === "Minimum") {
    return deepFreeze({
      ...current.indicators,
      healthVisible: false,
      confidenceVisible: false,
      trendVisible: false,
      warningVisible: false,
      lockVisible: false,
      executionVisible: false,
      dirtyVisible: false,
      loadingVisible: false,
      relationshipCountVisible: false,
      statusVisible: true,
    });
  }
  if (state === "Report") {
    return deepFreeze({
      ...current.indicators,
      lockVisible: false,
      executionVisible: false,
      dirtyVisible: false,
      loadingVisible: false,
      statusVisible: true,
    });
  }
  return deepFreeze({
    ...current.indicators,
    statusVisible: true,
  });
}

function filterAffordances(
  affordances: readonly NexoraObjectAffordanceDescriptor[],
  state: NexoraObjectRepresentationState,
  readOnly: boolean,
  archived: boolean,
): readonly NexoraObjectAffordanceDescriptor[] {
  return deepFreeze(
    affordances.map((item) => {
      const isMutation = (MUTATION_AFFORDANCES as readonly string[]).includes(
        item.affordance,
      );
      const isExecution = (EXECUTION_AFFORDANCES as readonly string[]).includes(
        item.affordance,
      );
      if (state === "Minimum" || state === "Report") {
        if (isMutation) {
          return deepFreeze({
            ...item,
            visible: false,
            enabled: false,
            reasonDisabled: "Not available outside Operation.",
          });
        }
      }
      if (archived && isExecution) {
        return deepFreeze({
          ...item,
          visible: false,
          enabled: false,
          reasonDisabled: "Archived objects expose no execution affordances.",
        });
      }
      if (readOnly && isMutation) {
        return deepFreeze({
          ...item,
          enabled: false,
          reasonDisabled: "Read-only representation.",
        });
      }
      return item;
    }),
  );
}

function emphasisFor(
  state: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationTransitionContext,
  seed: NexoraObjectSeedColor,
): NexoraObjectMaterialEmphasis {
  if (context.historical === true || context.deleted === true) {
    return "Historical";
  }
  if (seed === "Black") return "Disabled";
  if (seed === "Red") return "Critical";
  if (context.highlighted === true) return "Attention";
  if (context.focused === true) return "Focused";
  if (context.selected === true) return "Selected";
  if (context.stageDensity === "Dense" && state === "Minimum") {
    return "Background";
  }
  return "Normal";
}

/**
 * Project a target representation from the current one (NOL-2:1 contracts only).
 * Preserves Seed color; never invents object data.
 */
export function projectTargetNexoraObjectRepresentation(
  current: NexoraObjectRepresentation,
  targetState: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationTransitionContext,
): NexoraObjectRepresentation {
  const seed = current.material.color.seed;
  const profile = profileFor(targetState, context);
  const historical = profile === "Historical";
  const archived = context.archived === true;
  const locked = context.locked === true;
  const readOnly =
    historical ||
    archived ||
    (targetState === "Operation" &&
      (locked || context.authorizedForOperation === false));
  const hidden = context.hidden === true || !current.visible;
  const visible = !hidden && current.visible;

  const material = deepFreeze({
    ...current.material,
    color: deepFreeze({
      ...current.material.color,
      seed,
      inheritedFromStatus: true,
    }),
    emphasis: emphasisFor(targetState, context, seed),
    opacity: visible ? (historical ? Math.min(current.material.opacity, 0.55) : current.material.opacity || 1) : 0,
    surface:
      targetState === "Minimum"
        ? historical || seed === "Black"
          ? ("Ghost" as const)
          : ("Solid" as const)
        : targetState === "Report"
          ? ("Glass" as const)
          : ("Metal" as const),
  });

  return deepFreeze({
    ...current,
    representationId: `rep:${current.objectId}:${targetState}:${profile}`,
    representationVersion: materialRepresentationSchemaVersion,
    state: targetState,
    density: densityFor(targetState, profile),
    profile,
    material,
    geometry: geometryFor(current, targetState),
    typography: typographyFor(current, targetState),
    indicators: indicatorsFor(current, targetState),
    badges: deepFreeze(current.badges.map((b) => deepFreeze({ ...b }))),
    affordances: filterAffordances(
      current.affordances,
      targetState,
      readOnly,
      archived,
    ),
    visible,
    interactive: visible && !historical,
    readOnly,
  });
}

// ─── Transition state factory ───────────────────────────────────────────────

export function createNexoraObjectRepresentationTransitionState(
  objectId: string,
  currentState: NexoraObjectRepresentationState = "Minimum",
  updatedAt: string = "1970-01-01T00:00:00.000Z",
): NexoraObjectRepresentationTransitionState {
  return deepFreeze({
    objectId,
    currentState,
    targetState: currentState,
    phase: "Idle",
    progress: 0,
    direction: "Forward",
    transitionRevision: 0,
    updatedAt,
  });
}

// ─── Registry ───────────────────────────────────────────────────────────────

function def(
  type: NexoraObjectRepresentationTransitionType,
  allowedFrom: readonly NexoraObjectRepresentationState[],
  targetState: NexoraObjectRepresentationState | "ContextResolved",
  behaviors: readonly NexoraObjectRepresentationBehaviorType[],
  reversible = true,
  interruptible = true,
): NexoraObjectRepresentationTransitionDefinition {
  return Object.freeze({
    type,
    allowedFrom,
    targetState,
    reversible,
    interruptible,
    guards: Object.freeze([]),
    behaviors: Object.freeze([...behaviors]),
  });
}

const DEFAULT_DEFINITIONS: readonly NexoraObjectRepresentationTransitionDefinition[] =
  Object.freeze([
    def(
      "ExpandToReport",
      ["Minimum", "Report"],
      "Report",
      ["Scale", "CaptionReveal", "IndicatorReveal", "DepthShift", "FocusPull"],
    ),
    def(
      "ExpandToOperation",
      ["Minimum", "Report", "Operation"],
      "Operation",
      [
        "Scale",
        "CaptionReveal",
        "IndicatorReveal",
        "DepthShift",
        "FocusPull",
        "AffordanceReveal",
        "OperationLock",
        "CameraHint",
      ],
    ),
    def(
      "CollapseToReport",
      ["Operation", "Report"],
      "Report",
      ["AffordanceReveal", "Scale", "DepthShift"],
    ),
    def(
      "CollapseToMinimum",
      ["Report", "Operation", "Minimum"],
      "Minimum",
      ["IndicatorReveal", "CaptionReveal", "Scale", "DepthShift"],
    ),
    def(
      "FocusReveal",
      ["Minimum", "Report", "Operation"],
      "Report",
      ["FocusPull", "Scale", "DepthShift", "BackgroundDim", "CaptionReveal"],
    ),
    def(
      "SelectionReveal",
      ["Minimum", "Report", "Operation"],
      "ContextResolved",
      ["Scale", "DepthShift", "CaptionReveal"],
    ),
    def(
      "AttentionReveal",
      ["Minimum", "Report", "Operation"],
      "ContextResolved",
      ["DepthShift"],
      false,
      true,
    ),
    def(
      "EnterOperation",
      ["Minimum", "Report", "Operation"],
      "Operation",
      ["AffordanceReveal", "OperationLock", "Scale", "CameraHint", "DepthShift"],
    ),
    def(
      "ExitOperation",
      ["Operation"],
      "Report",
      ["AffordanceReveal", "Scale", "DepthShift"],
    ),
    def(
      "EnterHistorical",
      ["Minimum", "Report", "Operation"],
      "Report",
      ["HistoricalMute", "Fade", "DepthShift"],
    ),
    def(
      "ExitHistorical",
      ["Report", "Minimum"],
      "Minimum",
      ["Fade", "Scale"],
    ),
    def("Hide", ["Minimum", "Report", "Operation"], "Minimum", ["Fade"], true, true),
    def("Show", ["Minimum", "Report", "Operation"], "Minimum", ["Fade", "Scale"]),
    def(
      "ResetRepresentation",
      ["Minimum", "Report", "Operation"],
      "Minimum",
      ["Fade", "Scale", "DepthShift"],
    ),
  ]);

export type NexoraObjectRepresentationTransitionRegistry = {
  readonly definitions: readonly NexoraObjectRepresentationTransitionDefinition[];
};

export function createNexoraObjectRepresentationTransitionRegistry(
  definitions: readonly NexoraObjectRepresentationTransitionDefinition[] = DEFAULT_DEFINITIONS,
): NexoraObjectRepresentationTransitionRegistry {
  return Object.freeze({
    definitions: Object.freeze([...definitions]),
  });
}

const DEFAULT_REGISTRY = createNexoraObjectRepresentationTransitionRegistry();

export function getNexoraObjectRepresentationTransitionDefinition(
  type: NexoraObjectRepresentationTransitionType,
  registry: NexoraObjectRepresentationTransitionRegistry = DEFAULT_REGISTRY,
): NexoraObjectRepresentationTransitionDefinition | null {
  return registry.definitions.find((d) => d.type === type) ?? null;
}

export function hasNexoraObjectRepresentationTransitionDefinition(
  type: NexoraObjectRepresentationTransitionType,
  registry: NexoraObjectRepresentationTransitionRegistry = DEFAULT_REGISTRY,
): boolean {
  return getNexoraObjectRepresentationTransitionDefinition(type, registry) !== null;
}

export function listNexoraObjectRepresentationTransitionDefinitions(
  registry: NexoraObjectRepresentationTransitionRegistry = DEFAULT_REGISTRY,
): readonly NexoraObjectRepresentationTransitionDefinition[] {
  return registry.definitions;
}

export function validateNexoraObjectRepresentationTransitionRegistry(
  registry: NexoraObjectRepresentationTransitionRegistry = DEFAULT_REGISTRY,
): {
  readonly ok: boolean;
  readonly errors: readonly NexoraObjectRepresentationTransitionError[];
} {
  const errors: NexoraObjectRepresentationTransitionError[] = [];
  const seen = new Set<string>();
  for (const definition of registry.definitions) {
    if (seen.has(definition.type)) {
      errors.push(
        err(
          "REPRESENTATION_TRANSITION_DUPLICATE_ID",
          `Duplicate transition type: ${definition.type}`,
          { transitionType: definition.type },
        ),
      );
    }
    seen.add(definition.type);
  }
  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

// ─── Target resolution ──────────────────────────────────────────────────────

function resolveRequestedTarget(
  type: NexoraObjectRepresentationTransitionType,
  current: NexoraObjectRepresentationState,
  request: NexoraObjectRepresentationTransitionRequest,
  definition: NexoraObjectRepresentationTransitionDefinition,
): NexoraObjectRepresentationState {
  if (request.targetState) return request.targetState;
  if (definition.targetState !== "ContextResolved") {
    return definition.targetState;
  }
  if (type === "SelectionReveal") {
    if (request.context.stageDensity === "Dense" && !request.context.focused) {
      return "Minimum";
    }
    return "Report";
  }
  if (type === "AttentionReveal") return current;
  if (type === "Hide") return "Minimum";
  if (type === "Show") return current === "Operation" ? "Report" : current;
  return current;
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function canEnterNexoraObjectReport(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectRepresentationTransitionContext,
): NexoraObjectRepresentationTransitionGuardResult {
  if (context.hidden === true || !representation.visible) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_HIDDEN" as const,
      message: "Hidden representations cannot enter Report.",
    });
  }
  return Object.freeze({ allowed: true });
}

export function canEnterNexoraObjectOperation(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectRepresentationTransitionContext,
): NexoraObjectRepresentationTransitionGuardResult {
  if (context.hidden === true || !representation.visible) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_HIDDEN" as const,
      message: "Hidden representations cannot enter Operation.",
    });
  }
  if (context.deleted === true) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_DELETED" as const,
      message: "Deleted representations reject mutable Operation.",
      fallbackState: "Report" as const,
    });
  }
  if (context.historical === true) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_HISTORICAL_MUTATION_FORBIDDEN" as const,
      message: "Historical representations reject mutable Operation.",
      fallbackState: "Report" as const,
    });
  }
  if (context.authorizedForOperation === false) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_OPERATION_UNAUTHORIZED" as const,
      message: "Unauthorized Operation request.",
      fallbackState: "Report" as const,
    });
  }
  if (context.archived === true) {
    return Object.freeze({
      allowed: true,
      message: "Archived Operation is read-only inspection only.",
      details: { readOnly: true },
    });
  }
  return Object.freeze({ allowed: true });
}

export function canCollapseNexoraObjectRepresentation(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectRepresentationTransitionContext,
): NexoraObjectRepresentationTransitionGuardResult {
  void representation;
  void context;
  return Object.freeze({ allowed: true });
}

export function canInterruptNexoraObjectRepresentationTransition(
  transitionState: NexoraObjectRepresentationTransitionState,
  definition: NexoraObjectRepresentationTransitionDefinition | null,
): NexoraObjectRepresentationTransitionGuardResult {
  if (
    transitionState.phase === "Idle" ||
    transitionState.phase === "Completed" ||
    transitionState.phase === "Cancelled" ||
    transitionState.phase === "Failed"
  ) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_INVALID_STATE" as const,
      message: "No active interruptible transition.",
    });
  }
  if (definition && !definition.interruptible) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_NOT_INTERRUPTIBLE" as const,
      message: "Transition is not interruptible.",
    });
  }
  return Object.freeze({ allowed: true });
}

export function canReverseNexoraObjectRepresentationTransition(
  definition: NexoraObjectRepresentationTransitionDefinition | null,
): NexoraObjectRepresentationTransitionGuardResult {
  if (!definition?.reversible) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_NOT_REVERSIBLE" as const,
      message: "Transition is not reversible.",
    });
  }
  return Object.freeze({ allowed: true });
}

export function canShowHistoricalNexoraObjectRepresentation(
  representation: NexoraObjectRepresentation,
): NexoraObjectRepresentationTransitionGuardResult {
  if (!representation.visible && representation.profile !== "Historical") {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_HIDDEN" as const,
      message: "Hidden non-historical representation cannot be shown historically.",
    });
  }
  return Object.freeze({ allowed: true, fallbackState: "Report" });
}

export function canTransitionNexoraObjectRepresentation(
  guardContext: NexoraObjectRepresentationTransitionGuardContext,
  definition: NexoraObjectRepresentationTransitionDefinition | null,
): NexoraObjectRepresentationTransitionGuardResult {
  const { currentRepresentation, request } = guardContext;
  if (!definition) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_UNSUPPORTED_TYPE" as const,
      message: `Unsupported transition type: ${request.type}`,
    });
  }
  if (request.objectId !== currentRepresentation.objectId) {
    return Object.freeze({
      allowed: false,
      code: "REPRESENTATION_TRANSITION_OBJECT_MISMATCH" as const,
      message: "Transition objectId does not match representation.",
    });
  }
  if (
    !definition.allowedFrom.includes(currentRepresentation.state) &&
    request.type !== "AttentionReveal" &&
    request.type !== "SelectionReveal" &&
    request.type !== "FocusReveal"
  ) {
    // Still allow when target equals current (no-op path handled later).
  }

  const target = resolveRequestedTarget(
    request.type,
    currentRepresentation.state,
    request,
    definition,
  );

  if (target === "Report" || request.type === "FocusReveal") {
    const report = canEnterNexoraObjectReport(
      currentRepresentation,
      request.context,
    );
    if (!report.allowed && target === "Report") return report;
  }

  if (target === "Operation" || request.type === "EnterOperation" || request.type === "ExpandToOperation") {
    const operation = canEnterNexoraObjectOperation(
      currentRepresentation,
      request.context,
    );
    if (!operation.allowed) return operation;
  }

  if (target === "Minimum") {
    return canCollapseNexoraObjectRepresentation(
      currentRepresentation,
      request.context,
    );
  }

  return Object.freeze({ allowed: true });
}

// ─── Policies ───────────────────────────────────────────────────────────────

const denseStagePolicy: NexoraObjectRepresentationBehaviorPolicy = Object.freeze({
  policyId: "DenseStagePolicy",
  priority: 10,
  appliesTo: Object.freeze(["SelectionReveal"] as const),
  evaluate: (context: NexoraObjectRepresentationTransitionGuardContext) => {
    if (context.request.context.stageDensity !== "Dense") {
      return Object.freeze({ allowed: true });
    }
    if (context.request.context.focused === true) {
      return Object.freeze({
        allowed: true,
        targetState: "Report" as const,
        warnings: Object.freeze([
          warn(
            "REPRESENTATION_DENSE_STAGE_COMPACTED",
            "Focused object expands to Report on dense stage.",
          ),
        ]),
      });
    }
    return Object.freeze({
      allowed: true,
      targetState: "Minimum" as const,
      warnings: Object.freeze([
        warn(
          "REPRESENTATION_DENSE_STAGE_COMPACTED",
          "Non-focused selection remains Minimum on dense stage.",
        ),
      ]),
    });
  },
});

const reducedMotionPolicy: NexoraObjectRepresentationBehaviorPolicy =
  Object.freeze({
    policyId: "ReducedMotionPolicy",
    priority: 20,
    appliesTo: Object.freeze([
      "ExpandToReport",
      "ExpandToOperation",
      "CollapseToReport",
      "CollapseToMinimum",
      "FocusReveal",
      "SelectionReveal",
      "AttentionReveal",
      "EnterOperation",
      "ExitOperation",
    ] as const),
    evaluate: (context: NexoraObjectRepresentationTransitionGuardContext) => {
      if (!context.request.context.reducedMotion) {
        return Object.freeze({ allowed: true });
      }
      return Object.freeze({
        allowed: true,
        warnings: Object.freeze([
          warn(
            "REPRESENTATION_REDUCED_MOTION_APPLIED",
            "Reduced-motion policy suppresses pulse and duration weights.",
          ),
        ]),
        behaviors: Object.freeze([]),
      });
    },
  });

const unauthorizedOperationPolicy: NexoraObjectRepresentationBehaviorPolicy =
  Object.freeze({
    policyId: "UnauthorizedOperationPolicy",
    priority: 5,
    appliesTo: Object.freeze([
      "ExpandToOperation",
      "EnterOperation",
    ] as const),
    evaluate: (context: NexoraObjectRepresentationTransitionGuardContext) => {
      if (context.request.context.authorizedForOperation !== false) {
        return Object.freeze({ allowed: true });
      }
      return Object.freeze({
        allowed: true,
        targetState: "Report" as const,
        warnings: Object.freeze([
          warn(
            "REPRESENTATION_OPERATION_FALLBACK_TO_REPORT",
            "Unauthorized Operation fell back to Report.",
          ),
        ]),
      });
    },
  });

const historicalPolicy: NexoraObjectRepresentationBehaviorPolicy = Object.freeze({
  policyId: "HistoricalPolicy",
  priority: 1,
  appliesTo: Object.freeze([
    "ExpandToOperation",
    "EnterOperation",
    "EnterHistorical",
    "FocusReveal",
    "SelectionReveal",
  ] as const),
  evaluate: (context: NexoraObjectRepresentationTransitionGuardContext) => {
    if (
      context.request.context.historical !== true &&
      context.request.context.deleted !== true
    ) {
      return Object.freeze({ allowed: true });
    }
    return Object.freeze({
      allowed: true,
      targetState: "Report" as const,
      warnings: Object.freeze([
        warn(
          "REPRESENTATION_HISTORICAL_LIMIT_APPLIED",
          "Historical context limited to Report.",
        ),
      ]),
      behaviors: Object.freeze([
        behavior("HistoricalMute", "During", "Medium", 1, true),
      ]),
    });
  },
});

const DEFAULT_POLICIES: readonly NexoraObjectRepresentationBehaviorPolicy[] =
  Object.freeze([
    historicalPolicy,
    unauthorizedOperationPolicy,
    denseStagePolicy,
    reducedMotionPolicy,
  ]);

// ─── Behavior building ──────────────────────────────────────────────────────

function buildBehaviors(
  type: NexoraObjectRepresentationTransitionType,
  definition: NexoraObjectRepresentationTransitionDefinition,
  from: NexoraObjectRepresentationState,
  to: NexoraObjectRepresentationState,
  context: NexoraObjectRepresentationTransitionContext,
  seed: NexoraObjectSeedColor,
  policyBehaviors: readonly NexoraObjectRepresentationBehaviorDescriptor[],
): readonly NexoraObjectRepresentationBehaviorDescriptor[] {
  const reduced = context.reducedMotion === true;
  const weight = reduced ? 0 : 1;
  const list: NexoraObjectRepresentationBehaviorDescriptor[] = [];

  const push = (
    name: NexoraObjectRepresentationBehaviorType,
    phase: NexoraObjectRepresentationBehaviorDescriptor["phase"],
    intensity: NexoraObjectRepresentationBehaviorDescriptor["intensity"],
  ) => {
    if (reduced && name === "AttentionPulse") return;
    list.push(behavior(name, phase, intensity, weight));
  };

  if (from === "Minimum" && to === "Operation") {
    // Preserve Report-stage semantic behaviors in the combined plan.
    for (const name of [
      "Scale",
      "CaptionReveal",
      "IndicatorReveal",
      "DepthShift",
      "FocusPull",
      "AffordanceReveal",
      "OperationLock",
      "CameraHint",
    ] as const) {
      push(name, "During", "Medium");
    }
  } else {
    for (const name of definition.behaviors) {
      push(name, "During", "Medium");
    }
  }

  if (type === "AttentionReveal") {
    const intensity =
      seed === "Red" ? "High" : seed === "Yellow" ? "Medium" : "Low";
    if (!reduced) {
      list.push(behavior("AttentionPulse", "During", intensity, weight));
    }
  }

  if (type === "FocusReveal") {
    push("BackgroundDim", "During", "Low");
  }

  if (context.locked === true && to === "Operation") {
    push("OperationLock", "After", "Medium");
  }

  for (const item of policyBehaviors) {
    if (reduced && item.behavior === "AttentionPulse") continue;
    list.push(
      reduced
        ? behavior(
            item.behavior,
            item.phase,
            item.intensity,
            0,
            item.reversible,
            item.payload,
          )
        : item,
    );
  }

  // Deduplicate by behavior+phase, keep first.
  const seen = new Set<string>();
  const unique: NexoraObjectRepresentationBehaviorDescriptor[] = [];
  for (const item of list) {
    const key = `${item.behavior}:${item.phase}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return deepFreeze(unique);
}

// ─── Evaluation / application ───────────────────────────────────────────────

export function evaluateNexoraObjectRepresentationTransition(
  currentRepresentation: NexoraObjectRepresentation,
  currentMaterialState: NexoraObjectMaterialState,
  transitionState: NexoraObjectRepresentationTransitionState,
  request: NexoraObjectRepresentationTransitionRequest,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
  policies: readonly NexoraObjectRepresentationBehaviorPolicy[] = DEFAULT_POLICIES,
  registry: NexoraObjectRepresentationTransitionRegistry = DEFAULT_REGISTRY,
): NexoraObjectRepresentationTransitionPlan {
  const deps = resolveDeps(dependencies);
  const now = request.context.occurredAt ?? deps.now();
  const errors: NexoraObjectRepresentationTransitionError[] = [];
  const warnings: NexoraObjectRepresentationTransitionWarning[] = [];
  const evaluatedPolicies: string[] = [];

  if (!request.transitionId || !request.objectId) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVALID_REQUEST",
        "transitionId and objectId are required.",
        { transitionId: request.transitionId, objectId: request.objectId },
      ),
    );
  }

  const validation = validateNexoraObjectRepresentation(currentRepresentation);
  if (!validation.ok) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVALID_STATE",
        "Current representation failed validation.",
        { objectId: currentRepresentation.objectId },
      ),
    );
  }

  if (currentMaterialState.seedColor !== currentRepresentation.material.color.seed) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
        "Material Seed color does not match representation Seed color.",
        { objectId: currentRepresentation.objectId },
      ),
    );
  }

  if (
    request.expectedTransitionRevision !== undefined &&
    request.expectedTransitionRevision !== transitionState.transitionRevision
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_REVISION_CONFLICT",
        "Expected transition revision mismatch.",
        {
          objectId: request.objectId,
          details: {
            expected: request.expectedTransitionRevision,
            actual: transitionState.transitionRevision,
          },
        },
      ),
    );
  }

  if (
    request.expectedRepresentationVersion !== undefined &&
    request.expectedRepresentationVersion !==
      currentRepresentation.representationVersion
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_VERSION_CONFLICT",
        "Expected representation version mismatch.",
        { objectId: request.objectId },
      ),
    );
  }

  const definition = getNexoraObjectRepresentationTransitionDefinition(
    request.type,
    registry,
  );
  const guardContext: NexoraObjectRepresentationTransitionGuardContext =
    Object.freeze({
      currentRepresentation,
      currentMaterialState,
      transitionState,
      request,
    });

  let targetState = definition
    ? resolveRequestedTarget(
        request.type,
        currentRepresentation.state,
        request,
        definition,
      )
    : currentRepresentation.state;
  let fallbackApplied = false;

  const guardResult = canTransitionNexoraObjectRepresentation(
    guardContext,
    definition,
  );
  if (!guardResult.allowed) {
    if (guardResult.fallbackState) {
      targetState = guardResult.fallbackState;
      fallbackApplied = true;
      warnings.push(
        warn(
          "REPRESENTATION_OPERATION_FALLBACK_TO_REPORT",
          guardResult.message ?? "Fallback applied.",
        ),
      );
    } else {
      errors.push(
        err(
          guardResult.code ?? "REPRESENTATION_TRANSITION_GUARD_REJECTED",
          guardResult.message ?? "Transition rejected by guard.",
          {
            objectId: request.objectId,
            transitionId: request.transitionId,
            transitionType: request.type,
            details: guardResult.details,
          },
        ),
      );
    }
  }

  let policyBehaviors: NexoraObjectRepresentationBehaviorDescriptor[] = [];
  const sorted = [...policies].sort((a, b) => a.priority - b.priority);
  for (const policy of sorted) {
    if (!policy.appliesTo.includes(request.type)) continue;
    evaluatedPolicies.push(policy.policyId);
    const outcome = policy.evaluate(guardContext);
    if (!outcome.allowed) {
      errors.push(
        err(
          outcome.code ?? "REPRESENTATION_TRANSITION_POLICY_REJECTED",
          outcome.message ?? `Policy rejected transition: ${policy.policyId}`,
          {
            objectId: request.objectId,
            transitionId: request.transitionId,
            transitionType: request.type,
          },
        ),
      );
      break;
    }
    if (outcome.targetState) {
      if (
        outcome.targetState !== targetState &&
        (fallbackApplied ||
          policy.policyId === "DenseStagePolicy" ||
          policy.policyId === "HistoricalPolicy" ||
          policy.policyId === "UnauthorizedOperationPolicy")
      ) {
        targetState = outcome.targetState;
        if (policy.policyId === "UnauthorizedOperationPolicy") {
          fallbackApplied = true;
        }
      } else if (policy.policyId === "DenseStagePolicy") {
        targetState = outcome.targetState;
      } else if (policy.policyId === "HistoricalPolicy") {
        targetState = outcome.targetState;
      } else if (policy.policyId === "UnauthorizedOperationPolicy") {
        targetState = outcome.targetState;
        fallbackApplied = true;
      }
    }
    if (outcome.warnings) warnings.push(...outcome.warnings);
    if (outcome.behaviors) policyBehaviors = [...policyBehaviors, ...outcome.behaviors];
  }

  // Hidden hard-reject for Report/Operation when no fallback path accepted.
  if (
    (request.context.hidden === true || !currentRepresentation.visible) &&
    (targetState === "Report" || targetState === "Operation") &&
    !fallbackApplied
  ) {
    if (
      !errors.some((e) => e.code === "REPRESENTATION_TRANSITION_HIDDEN")
    ) {
      errors.push(
        err(
          "REPRESENTATION_TRANSITION_HIDDEN",
          "Hidden representations cannot enter Report or Operation.",
          {
            objectId: request.objectId,
            transitionId: request.transitionId,
            transitionType: request.type,
          },
        ),
      );
    }
  }

  const noOp =
    errors.length === 0 &&
    targetState === currentRepresentation.state &&
    request.type !== "AttentionReveal" &&
    request.type !== "Hide" &&
    request.type !== "Show";

  if (noOp) {
    warnings.push(
      warn("REPRESENTATION_NO_STATE_CHANGE", "Self-transition is a no-op."),
    );
  }

  const targetRepresentation =
    errors.length === 0
      ? projectTargetNexoraObjectRepresentation(
          currentRepresentation,
          targetState,
          {
            ...request.context,
            historical:
              request.context.historical === true ||
              request.context.deleted === true ||
              request.type === "EnterHistorical",
            hidden:
              request.type === "Hide"
                ? true
                : request.type === "Show"
                  ? false
                  : request.context.hidden,
          },
        )
      : currentRepresentation;

  // Hide forces invisible representation.
  const finalTarget =
    request.type === "Hide" && errors.length === 0
      ? deepFreeze({
          ...targetRepresentation,
          visible: false,
          interactive: false,
          material: deepFreeze({
            ...targetRepresentation.material,
            opacity: 0,
          }),
        })
      : request.type === "Show" && errors.length === 0
        ? deepFreeze({
            ...targetRepresentation,
            visible: true,
            interactive: !targetRepresentation.readOnly,
            material: deepFreeze({
              ...targetRepresentation.material,
              opacity: Math.max(targetRepresentation.material.opacity, 1),
            }),
          })
        : targetRepresentation;

  const targetMaterialState =
    errors.length === 0
      ? resolveMaterialState(
          finalTarget,
          materialContextFrom(request.context, deps),
        )
      : currentMaterialState;

  if (
    errors.length === 0 &&
    targetMaterialState.seedColor !== currentRepresentation.material.color.seed
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
        "Transition altered Seed color.",
        { objectId: request.objectId },
      ),
    );
  }

  const behaviors =
    errors.length === 0 && definition
      ? buildBehaviors(
          request.type,
          definition,
          currentRepresentation.state,
          finalTarget.state,
          request.context,
          currentRepresentation.material.color.seed,
          policyBehaviors,
        )
      : Object.freeze([]);

  if (
    request.context.locked === true &&
    finalTarget.state === "Operation" &&
    errors.length === 0
  ) {
    warnings.push(
      warn(
        "REPRESENTATION_READ_ONLY_OPERATION",
        "Locked representation enters read-only Operation.",
      ),
    );
  }

  const accepted = errors.length === 0;
  const projectedTransitionState = deepFreeze({
    objectId: currentRepresentation.objectId,
    currentState: currentRepresentation.state,
    targetState: accepted ? finalTarget.state : currentRepresentation.state,
    phase: accepted
      ? noOp
        ? ("Idle" as const)
        : ("Preparing" as const)
      : ("Failed" as const),
    progress: accepted && noOp ? 1 : 0,
    direction: "Forward" as const,
    transitionRevision: transitionState.transitionRevision,
    startedAt: accepted && !noOp ? now : transitionState.startedAt,
    updatedAt: now,
    completedAt: accepted && noOp ? now : undefined,
    activeTransitionId:
      accepted && !noOp ? `${request.type}::${request.transitionId}` : undefined,
  });

  return deepFreeze({
    transitionId: request.transitionId,
    objectId: request.objectId,
    type: request.type,
    accepted,
    noOp: accepted && noOp,
    fallbackApplied,
    previousRepresentation: currentRepresentation,
    targetRepresentation: accepted ? finalTarget : currentRepresentation,
    previousMaterialState: currentMaterialState,
    targetMaterialState: accepted ? targetMaterialState : currentMaterialState,
    previousTransitionState: transitionState,
    projectedTransitionState,
    behaviors,
    evaluatedPolicies: Object.freeze([...evaluatedPolicies]),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

function makeEvent(
  type: NexoraObjectRepresentationTransitionEventType,
  request: NexoraObjectRepresentationTransitionRequest,
  revision: number,
  deps: NexoraObjectRepresentationTransitionDependencies,
  payload: Readonly<Record<string, unknown>> = {},
): NexoraObjectRepresentationTransitionEvent {
  return Object.freeze({
    eventId: deps.createEventId(),
    transitionId: request.transitionId,
    objectId: request.objectId,
    type,
    occurredAt: request.context.occurredAt ?? deps.now(),
    transitionRevision: revision,
    source: request.context.source,
    actorId: request.context.actorId,
    correlationId: request.context.correlationId,
    causationId: request.context.causationId,
    payload: Object.freeze({ ...payload }),
  });
}

export function applyNexoraObjectRepresentationTransition(
  currentRepresentation: NexoraObjectRepresentation,
  currentMaterialState: NexoraObjectMaterialState,
  transitionState: NexoraObjectRepresentationTransitionState,
  request: NexoraObjectRepresentationTransitionRequest,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): NexoraObjectRepresentationTransitionResult {
  const deps = resolveDeps(dependencies);
  const plan = evaluateNexoraObjectRepresentationTransition(
    currentRepresentation,
    currentMaterialState,
    transitionState,
    request,
    deps,
  );
  const dryRun = request.dryRun === true;
  const events: NexoraObjectRepresentationTransitionEvent[] = [];

  if (!plan.accepted) {
    if (deps.emitRejectedEvents !== false) {
      events.push(
        makeEvent(
          "RepresentationTransitionRejected",
          request,
          transitionState.transitionRevision,
          deps,
          { errors: plan.errors.map((e) => e.code) },
        ),
      );
    }
    return deepFreeze({
      accepted: false,
      changed: false,
      dryRun,
      fallbackApplied: plan.fallbackApplied,
      previousRepresentation: currentRepresentation,
      nextRepresentation: currentRepresentation,
      previousMaterialState: currentMaterialState,
      nextMaterialState: currentMaterialState,
      previousTransitionState: transitionState,
      nextTransitionState: transitionState,
      plan,
      events: Object.freeze(events),
      warnings: plan.warnings,
      errors: plan.errors,
    });
  }

  if (plan.noOp || dryRun) {
    if (plan.fallbackApplied) {
      events.push(
        makeEvent(
          "RepresentationFallbackApplied",
          request,
          transitionState.transitionRevision,
          deps,
        ),
      );
    }
    return deepFreeze({
      accepted: true,
      changed: false,
      dryRun,
      fallbackApplied: plan.fallbackApplied,
      previousRepresentation: currentRepresentation,
      nextRepresentation: dryRun
        ? plan.targetRepresentation
        : currentRepresentation,
      previousMaterialState: currentMaterialState,
      nextMaterialState: dryRun
        ? plan.targetMaterialState
        : currentMaterialState,
      previousTransitionState: transitionState,
      nextTransitionState: dryRun
        ? plan.projectedTransitionState
        : transitionState,
      plan,
      events: Object.freeze(events),
      warnings: plan.warnings,
      errors: plan.errors,
    });
  }

  const nextRevision = transitionState.transitionRevision + 1;
  const now = request.context.occurredAt ?? deps.now();
  const nextTransitionState = deepFreeze({
    ...plan.projectedTransitionState,
    currentState: plan.targetRepresentation.state,
    targetState: plan.targetRepresentation.state,
    phase: "Completed" as const,
    progress: 1,
    transitionRevision: nextRevision,
    updatedAt: now,
    completedAt: now,
    activeTransitionId: undefined,
  });

  events.push(
    makeEvent("RepresentationTransitionStarted", request, nextRevision, deps),
    makeEvent("RepresentationTransitionCompleted", request, nextRevision, deps, {
      from: currentRepresentation.state,
      to: plan.targetRepresentation.state,
    }),
  );
  if (plan.fallbackApplied) {
    events.push(
      makeEvent("RepresentationFallbackApplied", request, nextRevision, deps),
    );
  }
  if (plan.targetRepresentation.state === "Operation") {
    events.push(
      makeEvent("RepresentationOperationEntered", request, nextRevision, deps),
    );
  }
  if (
    currentRepresentation.state === "Operation" &&
    plan.targetRepresentation.state !== "Operation"
  ) {
    events.push(
      makeEvent("RepresentationOperationExited", request, nextRevision, deps),
    );
  }
  if (request.type === "EnterHistorical") {
    events.push(
      makeEvent("RepresentationHistoricalEntered", request, nextRevision, deps),
    );
  }
  if (request.type === "ResetRepresentation") {
    events.push(makeEvent("RepresentationReset", request, nextRevision, deps));
  }

  return deepFreeze({
    accepted: true,
    changed: true,
    dryRun: false,
    fallbackApplied: plan.fallbackApplied,
    previousRepresentation: currentRepresentation,
    nextRepresentation: plan.targetRepresentation,
    previousMaterialState: currentMaterialState,
    nextMaterialState: plan.targetMaterialState,
    previousTransitionState: transitionState,
    nextTransitionState,
    plan,
    events: Object.freeze(events),
    warnings: plan.warnings,
    errors: plan.errors,
  });
}

// ─── Progress / phase ───────────────────────────────────────────────────────

export function resolveNexoraObjectRepresentationTransitionPhase(
  progress: number,
  reducedMotion = false,
): NexoraObjectRepresentationTransitionPhase {
  if (reducedMotion) {
    return progress >= 1 ? "Completed" : "Preparing";
  }
  if (progress <= 0) return "Preparing";
  if (progress <= 0.2) return "ExitingCurrent";
  if (progress <= 0.7) return "Transforming";
  if (progress <= 0.9) return "EnteringTarget";
  if (progress < 1) return "Settling";
  return "Completed";
}

export function projectNexoraObjectRepresentationTransitionProgress(
  plan: NexoraObjectRepresentationTransitionPlan,
  progress: number,
  options: { readonly clamp?: boolean; readonly reducedMotion?: boolean } = {},
): NexoraObjectRepresentationProgressProjection {
  let value = progress;
  if (options.clamp) {
    value = Math.min(1, Math.max(0, value));
  } else if (value < 0 || value > 1 || Number.isNaN(value)) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_INVALID_PROGRESS",
        `Invalid progress: ${progress}`,
        { transitionId: plan.transitionId, objectId: plan.objectId },
      ),
    );
  }

  const phase = resolveNexoraObjectRepresentationTransitionPhase(
    value,
    options.reducedMotion === true,
  );
  const activeBehaviors =
    phase === "Completed" || phase === "Preparing"
      ? Object.freeze([])
      : plan.behaviors;

  return deepFreeze({
    transitionId: plan.transitionId,
    objectId: plan.objectId,
    phase,
    progress: value,
    sourceState: plan.previousRepresentation.state,
    targetState: plan.targetRepresentation.state,
    activeBehaviors,
    materialInterpolationHints: Object.freeze({
      fromOpacity: plan.previousMaterialState.opacity,
      toOpacity: plan.targetMaterialState.opacity,
      fromLayer: plan.previousMaterialState.layer,
      toLayer: plan.targetMaterialState.layer,
      progress: value,
    }),
    geometryInterpolationHints: Object.freeze({
      fromScale: plan.previousRepresentation.geometry.scale,
      toScale: plan.targetRepresentation.geometry.scale,
      fromSize: plan.previousRepresentation.geometry.size,
      toSize: plan.targetRepresentation.geometry.size,
      progress: value,
    }),
  });
}

// ─── Interruption ───────────────────────────────────────────────────────────

export function interruptNexoraObjectRepresentationTransition(
  currentRepresentation: NexoraObjectRepresentation,
  currentMaterialState: NexoraObjectMaterialState,
  transitionState: NexoraObjectRepresentationTransitionState,
  mode: NexoraObjectRepresentationInterruptionMode,
  replacement?: NexoraObjectRepresentationTransitionRequest,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): NexoraObjectRepresentationTransitionResult {
  const deps = resolveDeps(dependencies);
  const activeType = transitionState.activeTransitionId
    ? ("ExpandToReport" as NexoraObjectRepresentationTransitionType)
    : null;
  const definition = activeType
    ? getNexoraObjectRepresentationTransitionDefinition(activeType)
    : null;

  if (mode === "Cancel") {
    const can = canInterruptNexoraObjectRepresentationTransition(
      transitionState,
      definition ??
        getNexoraObjectRepresentationTransitionDefinition("ExpandToReport"),
    );
    const now = deps.now();
    const nextTransitionState = deepFreeze({
      ...transitionState,
      phase: "Cancelled" as const,
      progress: 0,
      activeTransitionId: undefined,
      updatedAt: now,
      completedAt: now,
      targetState: transitionState.currentState,
    });
    const request: NexoraObjectRepresentationTransitionRequest = Object.freeze({
      transitionId: transitionState.activeTransitionId ?? "interrupt-cancel",
      objectId: currentRepresentation.objectId,
      type: "ResetRepresentation",
      context: Object.freeze({ source: "System" as const }),
    });
    return deepFreeze({
      accepted: can.allowed || transitionState.phase !== "Idle",
      changed: false,
      dryRun: false,
      fallbackApplied: false,
      previousRepresentation: currentRepresentation,
      nextRepresentation: currentRepresentation,
      previousMaterialState: currentMaterialState,
      nextMaterialState: currentMaterialState,
      previousTransitionState: transitionState,
      nextTransitionState,
      plan: evaluateNexoraObjectRepresentationTransition(
        currentRepresentation,
        currentMaterialState,
        transitionState,
        request,
        deps,
      ),
      events: Object.freeze([
        makeEvent(
          "RepresentationTransitionInterrupted",
          request,
          transitionState.transitionRevision,
          deps,
          { mode: "Cancel" },
        ),
      ]),
      warnings: Object.freeze([
        warn(
          "REPRESENTATION_EXISTING_TRANSITION_INTERRUPTED",
          "Transition cancelled; source representation remains authoritative.",
        ),
      ]),
      errors: Object.freeze(
        can.allowed
          ? []
          : [
              err(
                can.code ?? "REPRESENTATION_TRANSITION_NOT_INTERRUPTIBLE",
                can.message ?? "Cannot cancel.",
              ),
            ],
      ),
    });
  }

  if (mode === "Reverse") {
    const activeTypeName = transitionState.activeTransitionId?.includes("::")
      ? (transitionState.activeTransitionId.split("::")[0] as NexoraObjectRepresentationTransitionType)
      : ("ExpandToReport" as NexoraObjectRepresentationTransitionType);
    const defn = getNexoraObjectRepresentationTransitionDefinition(activeTypeName);
    const can = canReverseNexoraObjectRepresentationTransition(defn);
    const request: NexoraObjectRepresentationTransitionRequest = Object.freeze({
      transitionId:
        transitionState.activeTransitionId?.split("::")[1] ??
        "interrupt-reverse",
      objectId: currentRepresentation.objectId,
      type: "CollapseToMinimum",
      context: Object.freeze({ source: "System" as const }),
    });
    if (!can.allowed) {
      return deepFreeze({
        accepted: false,
        changed: false,
        dryRun: false,
        fallbackApplied: false,
        previousRepresentation: currentRepresentation,
        nextRepresentation: currentRepresentation,
        previousMaterialState: currentMaterialState,
        nextMaterialState: currentMaterialState,
        previousTransitionState: transitionState,
        nextTransitionState: transitionState,
        plan: evaluateNexoraObjectRepresentationTransition(
          currentRepresentation,
          currentMaterialState,
          transitionState,
          request,
          deps,
        ),
        events: Object.freeze([]),
        warnings: Object.freeze([]),
        errors: Object.freeze([
          err(
            "REPRESENTATION_TRANSITION_NOT_REVERSIBLE",
            can.message ?? "Not reversible.",
            { objectId: currentRepresentation.objectId },
          ),
        ]),
      });
    }

    const reverseRequest: NexoraObjectRepresentationTransitionRequest =
      Object.freeze({
        transitionId: `reverse-${deps.createEventId()}`,
        objectId: currentRepresentation.objectId,
        type:
          transitionState.targetState === "Operation"
            ? "CollapseToReport"
            : "CollapseToMinimum",
        targetState: transitionState.currentState,
        context: Object.freeze({
          source: "System" as const,
          correlationId: replacement?.context.correlationId,
        }),
      });
    const result = applyNexoraObjectRepresentationTransition(
      currentRepresentation,
      currentMaterialState,
      deepFreeze({
        ...transitionState,
        direction: "Reverse",
        progress: 1 - transitionState.progress,
      }),
      reverseRequest,
      deps,
    );
    return deepFreeze({
      ...result,
      events: Object.freeze([
        ...result.events,
        makeEvent(
          "RepresentationTransitionReversed",
          reverseRequest,
          result.nextTransitionState.transitionRevision,
          deps,
        ),
      ]),
    });
  }

  // Replace — do not commit partial projection; evaluate from committed representation.
  if (!replacement) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_INVALID_REQUEST",
        "Replace interruption requires a replacement request.",
      ),
    );
  }
  const interruptedState = deepFreeze({
    ...transitionState,
    phase: "Interrupted" as const,
    activeTransitionId: undefined,
    updatedAt: deps.now(),
  });
  const result = applyNexoraObjectRepresentationTransition(
    currentRepresentation,
    currentMaterialState,
    interruptedState,
    replacement,
    deps,
  );
  return deepFreeze({
    ...result,
    warnings: Object.freeze([
      ...result.warnings,
      warn(
        "REPRESENTATION_EXISTING_TRANSITION_INTERRUPTED",
        "Prior transition interrupted and replaced.",
      ),
    ]),
    events: Object.freeze([
      makeEvent(
        "RepresentationTransitionInterrupted",
        replacement,
        interruptedState.transitionRevision,
        deps,
        { mode: "Replace" },
      ),
      ...result.events,
    ]),
  });
}

// ─── Sequence simulation ────────────────────────────────────────────────────

export function simulateNexoraObjectRepresentationTransitionSequence(
  currentRepresentation: NexoraObjectRepresentation,
  currentMaterialState: NexoraObjectMaterialState,
  transitionState: NexoraObjectRepresentationTransitionState,
  requests: readonly NexoraObjectRepresentationTransitionRequest[],
  options: {
    readonly continueOnError?: boolean;
    readonly dependencies?: NexoraObjectRepresentationTransitionDependencies;
  } = {},
): {
  readonly plans: readonly NexoraObjectRepresentationTransitionPlan[];
  readonly firstFailureIndex: number | null;
  readonly finalRepresentation: NexoraObjectRepresentation;
  readonly finalMaterialState: NexoraObjectMaterialState;
  readonly finalTransitionState: NexoraObjectRepresentationTransitionState;
} {
  const deps = resolveDeps(options.dependencies);
  const plans: NexoraObjectRepresentationTransitionPlan[] = [];
  let representation = currentRepresentation;
  let material = currentMaterialState;
  let transition = transitionState;
  let firstFailureIndex: number | null = null;

  for (let i = 0; i < requests.length; i += 1) {
    const result = applyNexoraObjectRepresentationTransition(
      representation,
      material,
      transition,
      { ...requests[i]!, dryRun: false },
      deps,
    );
    plans.push(result.plan);
    if (!result.accepted) {
      if (firstFailureIndex === null) firstFailureIndex = i;
      if (!options.continueOnError) break;
      continue;
    }
    if (result.changed) {
      representation = result.nextRepresentation;
      material = result.nextMaterialState;
      transition = result.nextTransitionState;
    }
  }

  return deepFreeze({
    plans: Object.freeze(plans),
    firstFailureIndex,
    finalRepresentation: representation,
    finalMaterialState: material,
    finalTransitionState: transition,
  });
}

// ─── Multi-object coordination ──────────────────────────────────────────────

export function focusExclusiveNexoraObjectRepresentation(
  entries: readonly NexoraObjectRepresentationCollectionEntry[],
  focusObjectId: string,
  context: NexoraObjectRepresentationTransitionContext,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): readonly NexoraObjectRepresentationTransitionResult[] {
  const deps = resolveDeps(dependencies);
  const correlationId = context.correlationId ?? deps.createEventId();
  const results: NexoraObjectRepresentationTransitionResult[] = [];

  for (const entry of entries) {
    const isFocus = entry.representation.objectId === focusObjectId;
    const request: NexoraObjectRepresentationTransitionRequest = Object.freeze({
      transitionId: deps.createTransitionId?.() ?? deps.createEventId(),
      objectId: entry.representation.objectId,
      type: isFocus ? "FocusReveal" : "CollapseToMinimum",
      context: Object.freeze({
        ...context,
        focused: isFocus,
        selected: isFocus ? true : context.selected,
        correlationId,
      }),
    });
    results.push(
      applyNexoraObjectRepresentationTransition(
        entry.representation,
        entry.materialState,
        entry.transitionState,
        request,
        deps,
      ),
    );
  }
  return Object.freeze(results);
}

export function openExclusiveNexoraObjectOperation(
  entries: readonly NexoraObjectRepresentationCollectionEntry[],
  operationObjectId: string,
  context: NexoraObjectRepresentationTransitionContext,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): readonly NexoraObjectRepresentationTransitionResult[] {
  const deps = resolveDeps(dependencies);
  const correlationId = context.correlationId ?? deps.createEventId();
  const results: NexoraObjectRepresentationTransitionResult[] = [];

  for (const entry of entries) {
    const isTarget = entry.representation.objectId === operationObjectId;
    const isMutableOperation =
      entry.representation.state === "Operation" &&
      !entry.representation.readOnly &&
      entry.representation.profile !== "Historical";

    const request: NexoraObjectRepresentationTransitionRequest = Object.freeze({
      transitionId: deps.createTransitionId?.() ?? deps.createEventId(),
      objectId: entry.representation.objectId,
      type: isTarget
        ? "EnterOperation"
        : isMutableOperation
          ? "CollapseToReport"
          : "FocusReveal",
      context: Object.freeze({
        ...context,
        authorizedForOperation: isTarget
          ? context.authorizedForOperation !== false
          : false,
        correlationId,
      }),
    });

    if (!isTarget && !isMutableOperation) {
      // Leave non-operation entries unchanged.
      continue;
    }

    results.push(
      applyNexoraObjectRepresentationTransition(
        entry.representation,
        entry.materialState,
        entry.transitionState,
        request,
        deps,
      ),
    );
  }
  return Object.freeze(results);
}

export function collapseNexoraObjectRepresentationsToMinimum(
  entries: readonly NexoraObjectRepresentationCollectionEntry[],
  context: NexoraObjectRepresentationTransitionContext,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): readonly NexoraObjectRepresentationTransitionResult[] {
  const deps = resolveDeps(dependencies);
  return Object.freeze(
    entries.map((entry) =>
      applyNexoraObjectRepresentationTransition(
        entry.representation,
        entry.materialState,
        entry.transitionState,
        Object.freeze({
          transitionId: deps.createTransitionId?.() ?? deps.createEventId(),
          objectId: entry.representation.objectId,
          type: "CollapseToMinimum" as const,
          context,
        }),
        deps,
      ),
    ),
  );
}

export function applyNexoraObjectRepresentationTransitionBatch(
  entriesByObjectId: Readonly<
    Record<string, NexoraObjectRepresentationCollectionEntry>
  >,
  batch: NexoraObjectRepresentationTransitionBatchRequest,
  dependencies?: NexoraObjectRepresentationTransitionDependencies,
): NexoraObjectRepresentationTransitionBatchResult {
  const deps = resolveDeps(dependencies);
  const seenIds = new Set<string>();
  for (const request of batch.requests) {
    if (seenIds.has(request.transitionId)) {
      return deepFreeze({
        accepted: false,
        mode: batch.mode,
        results: Object.freeze([]),
        changedObjectIds: Object.freeze([]),
        rejectedObjectIds: Object.freeze(
          batch.requests.map((r) => r.objectId),
        ),
      });
    }
    seenIds.add(request.transitionId);
  }

  const evaluated: NexoraObjectRepresentationTransitionResult[] = [];
  for (const request of batch.requests) {
    const entry = entriesByObjectId[request.objectId];
    if (!entry) {
      evaluated.push(
        deepFreeze({
          accepted: false,
          changed: false,
          dryRun: false,
          fallbackApplied: false,
          previousRepresentation: undefined as unknown as NexoraObjectRepresentation,
          nextRepresentation: undefined as unknown as NexoraObjectRepresentation,
          previousMaterialState: undefined as unknown as NexoraObjectMaterialState,
          nextMaterialState: undefined as unknown as NexoraObjectMaterialState,
          previousTransitionState:
            undefined as unknown as NexoraObjectRepresentationTransitionState,
          nextTransitionState:
            undefined as unknown as NexoraObjectRepresentationTransitionState,
          plan: deepFreeze({
            transitionId: request.transitionId,
            objectId: request.objectId,
            type: request.type,
            accepted: false,
            noOp: false,
            fallbackApplied: false,
            previousRepresentation:
              undefined as unknown as NexoraObjectRepresentation,
            targetRepresentation:
              undefined as unknown as NexoraObjectRepresentation,
            previousMaterialState:
              undefined as unknown as NexoraObjectMaterialState,
            targetMaterialState:
              undefined as unknown as NexoraObjectMaterialState,
            previousTransitionState:
              undefined as unknown as NexoraObjectRepresentationTransitionState,
            projectedTransitionState:
              undefined as unknown as NexoraObjectRepresentationTransitionState,
            behaviors: Object.freeze([]),
            evaluatedPolicies: Object.freeze([]),
            warnings: Object.freeze([]),
            errors: Object.freeze([
              err(
                "REPRESENTATION_TRANSITION_OBJECT_MISMATCH",
                `Unknown object in batch: ${request.objectId}`,
                { objectId: request.objectId, transitionId: request.transitionId },
              ),
            ]),
          }),
          events: Object.freeze([]),
          warnings: Object.freeze([]),
          errors: Object.freeze([
            err(
              "REPRESENTATION_TRANSITION_OBJECT_MISMATCH",
              `Unknown object in batch: ${request.objectId}`,
            ),
          ]),
        }),
      );
      continue;
    }
    evaluated.push(
      applyNexoraObjectRepresentationTransition(
        entry.representation,
        entry.materialState,
        entry.transitionState,
        {
          ...request,
          dryRun: batch.mode === "Atomic",
          context: Object.freeze({
            ...request.context,
            correlationId:
              request.context.correlationId ?? batch.correlationId,
          }),
        },
        deps,
      ),
    );
  }

  if (batch.mode === "Atomic") {
    const failed = evaluated.some((r) => !r.accepted);
    if (failed) {
      return deepFreeze({
        accepted: false,
        mode: "Atomic",
        results: Object.freeze(evaluated),
        changedObjectIds: Object.freeze([]),
        rejectedObjectIds: Object.freeze(
          evaluated.filter((r) => !r.accepted).map((r) => r.plan.objectId),
        ),
      });
    }
    // Commit for real
    const committed = batch.requests.map((request) => {
      const entry = entriesByObjectId[request.objectId]!;
      return applyNexoraObjectRepresentationTransition(
        entry.representation,
        entry.materialState,
        entry.transitionState,
        {
          ...request,
          dryRun: false,
          context: Object.freeze({
            ...request.context,
            correlationId:
              request.context.correlationId ?? batch.correlationId,
          }),
        },
        deps,
      );
    });
    return deepFreeze({
      accepted: true,
      mode: "Atomic",
      results: Object.freeze(committed),
      changedObjectIds: Object.freeze(
        committed.filter((r) => r.changed).map((r) => r.plan.objectId),
      ),
      rejectedObjectIds: Object.freeze([]),
    });
  }

  return deepFreeze({
    accepted: evaluated.every((r) => r.accepted),
    mode: "BestEffort",
    results: Object.freeze(evaluated),
    changedObjectIds: Object.freeze(
      evaluated.filter((r) => r.changed).map((r) => r.plan.objectId),
    ),
    rejectedObjectIds: Object.freeze(
      evaluated.filter((r) => !r.accepted).map((r) => r.plan.objectId),
    ),
  });
}

// ─── Records ────────────────────────────────────────────────────────────────

export function createNexoraObjectRepresentationTransitionRecord(
  result: NexoraObjectRepresentationTransitionResult,
): NexoraObjectRepresentationTransitionRecord {
  return deepFreeze({
    transitionId: result.plan.transitionId,
    objectId: result.plan.objectId,
    type: result.plan.type,
    accepted: result.accepted,
    changed: result.changed,
    fromState: result.previousRepresentation.state,
    toState: result.nextRepresentation.state,
    previousRevision: result.previousTransitionState.transitionRevision,
    nextRevision: result.nextTransitionState.transitionRevision,
    occurredAt: result.nextTransitionState.updatedAt,
    source: result.plan.previousTransitionState
      ? result.events[0]?.source ?? "System"
      : "System",
    correlationId: result.events[0]?.correlationId,
    causationId: result.events[0]?.causationId,
    warnings: result.warnings,
    errors: result.errors,
  });
}

export function projectNexoraObjectRepresentationTransitionHistory(
  records: readonly NexoraObjectRepresentationTransitionRecord[],
): readonly NexoraObjectRepresentationTransitionRecord[] {
  return Object.freeze(
    [...records].sort((a, b) => {
      if (a.occurredAt === b.occurredAt) {
        return a.transitionId.localeCompare(b.transitionId);
      }
      return a.occurredAt < b.occurredAt ? -1 : 1;
    }),
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectRepresentationTransitionState(
  transitionState: NexoraObjectRepresentationTransitionState,
  representation?: NexoraObjectRepresentation,
  materialState?: NexoraObjectMaterialState,
): {
  readonly ok: boolean;
  readonly errors: readonly NexoraObjectRepresentationTransitionError[];
} {
  const errors: NexoraObjectRepresentationTransitionError[] = [];
  const states: NexoraObjectRepresentationState[] = [
    "Minimum",
    "Report",
    "Operation",
  ];
  if (!states.includes(transitionState.currentState)) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVALID_STATE",
        `Invalid current state: ${transitionState.currentState}`,
      ),
    );
  }
  if (!states.includes(transitionState.targetState)) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVALID_STATE",
        `Invalid target state: ${transitionState.targetState}`,
      ),
    );
  }
  if (
    typeof transitionState.progress !== "number" ||
    transitionState.progress < 0 ||
    transitionState.progress > 1 ||
    Number.isNaN(transitionState.progress)
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVALID_PROGRESS",
        "Progress must be between 0 and 1.",
      ),
    );
  }
  if (
    !Number.isInteger(transitionState.transitionRevision) ||
    transitionState.transitionRevision < 0
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
        "Transition revision must be a non-negative integer.",
      ),
    );
  }
  if (transitionState.phase === "Completed" && transitionState.progress !== 1) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
        "Completed phase requires progress 1.",
      ),
    );
  }
  if (
    transitionState.phase === "Idle" &&
    transitionState.activeTransitionId !== undefined
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
        "Idle phase must not have an active transition ID.",
      ),
    );
  }
  if (
    representation &&
    representation.objectId !== transitionState.objectId
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_OBJECT_MISMATCH",
        "Transition objectId does not match representation.",
        { objectId: transitionState.objectId },
      ),
    );
  }
  if (materialState && materialState.material.color.seed) {
    if (
      representation &&
      materialState.seedColor !== representation.material.color.seed
    ) {
      errors.push(
        err(
          "REPRESENTATION_TRANSITION_INVARIANT_VIOLATION",
          "Material Seed does not match representation Seed.",
        ),
      );
    }
  }
  if (
    representation &&
    !representation.visible &&
    (transitionState.targetState === "Report" ||
      transitionState.targetState === "Operation") &&
    transitionState.phase !== "Failed" &&
    transitionState.phase !== "Cancelled"
  ) {
    errors.push(
      err(
        "REPRESENTATION_TRANSITION_HIDDEN",
        "Hidden representation cannot target Report or Operation.",
      ),
    );
  }
  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function assertNexoraObjectRepresentationTransitionInvariants(
  transitionState: NexoraObjectRepresentationTransitionState,
  representation?: NexoraObjectRepresentation,
  materialState?: NexoraObjectMaterialState,
): void {
  const result = validateNexoraObjectRepresentationTransitionState(
    transitionState,
    representation,
    materialState,
  );
  if (!result.ok) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      result.errors[0]!,
    );
  }
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectRepresentationTransitionState(
  transitionState: NexoraObjectRepresentationTransitionState,
): string {
  assertNexoraObjectRepresentationTransitionInvariants(transitionState);
  return JSON.stringify({
    engineIdentity: representationTransitionBehaviorEngineIdentity,
    engineVersion: representationTransitionBehaviorEngineVersion,
    schemaVersion: representationTransitionBehaviorSchemaVersion,
    foundationIdentity: materialRepresentationFoundationIdentity,
    foundationSchemaVersion: materialRepresentationSchemaVersion,
    materialSchemaVersion: materialStateResolutionSchemaVersion,
    transitionState,
  });
}

export function deserializeNexoraObjectRepresentationTransitionState(
  json: string,
): NexoraObjectRepresentationTransitionState {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly engineIdentity?: string;
    readonly transitionState?: NexoraObjectRepresentationTransitionState;
  };
  if (parsed.schemaVersion !== representationTransitionBehaviorSchemaVersion) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_UNSUPPORTED_VERSION",
        `Unsupported transition schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.transitionState) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_INVALID_REQUEST",
        "Missing transition state payload.",
      ),
    );
  }
  const restored = deepFreeze({ ...parsed.transitionState });
  assertNexoraObjectRepresentationTransitionInvariants(restored);
  return restored;
}

export function serializeNexoraObjectRepresentationTransitionRecord(
  record: NexoraObjectRepresentationTransitionRecord,
): string {
  return JSON.stringify({
    engineIdentity: representationTransitionBehaviorEngineIdentity,
    schemaVersion: representationTransitionBehaviorSchemaVersion,
    record,
  });
}

export function deserializeNexoraObjectRepresentationTransitionRecord(
  json: string,
): NexoraObjectRepresentationTransitionRecord {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly record?: NexoraObjectRepresentationTransitionRecord;
  };
  if (parsed.schemaVersion !== representationTransitionBehaviorSchemaVersion) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_UNSUPPORTED_VERSION",
        `Unsupported transition record schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.record) {
    throw new NexoraObjectRepresentationTransitionBehaviorException(
      err(
        "REPRESENTATION_TRANSITION_INVALID_REQUEST",
        "Missing transition record payload.",
      ),
    );
  }
  return deepFreeze({
    ...parsed.record,
    warnings: Object.freeze(
      (parsed.record.warnings ?? []).map((w) => deepFreeze({ ...w })),
    ),
    errors: Object.freeze(
      (parsed.record.errors ?? []).map((e) => deepFreeze({ ...e })),
    ),
  });
}

export function getNexoraObjectRepresentationTransitionBehaviorEngineSummary() {
  return Object.freeze({
    identity: representationTransitionBehaviorEngineIdentity,
    version: representationTransitionBehaviorEngineVersion,
    schemaVersion: representationTransitionBehaviorSchemaVersion,
    upstream: NOL_REPRESENTATION_TRANSITION_UPSTREAM,
    transitionTypes: Object.freeze(
      DEFAULT_DEFINITIONS.map((d) => d.type),
    ),
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
  });
}

export const NexoraObjectRepresentationTransitionBehaviorEngine = Object.freeze({
  identity: representationTransitionBehaviorEngineIdentity,
  version: representationTransitionBehaviorEngineVersion,
  schemaVersion: representationTransitionBehaviorSchemaVersion,
  createState: createNexoraObjectRepresentationTransitionState,
  createRegistry: createNexoraObjectRepresentationTransitionRegistry,
  evaluate: evaluateNexoraObjectRepresentationTransition,
  apply: applyNexoraObjectRepresentationTransition,
  projectProgress: projectNexoraObjectRepresentationTransitionProgress,
  resolvePhase: resolveNexoraObjectRepresentationTransitionPhase,
  interrupt: interruptNexoraObjectRepresentationTransition,
  simulateSequence: simulateNexoraObjectRepresentationTransitionSequence,
  focusExclusive: focusExclusiveNexoraObjectRepresentation,
  openExclusiveOperation: openExclusiveNexoraObjectOperation,
  collapseToMinimum: collapseNexoraObjectRepresentationsToMinimum,
  batch: applyNexoraObjectRepresentationTransitionBatch,
  summary: getNexoraObjectRepresentationTransitionBehaviorEngineSummary,
});
