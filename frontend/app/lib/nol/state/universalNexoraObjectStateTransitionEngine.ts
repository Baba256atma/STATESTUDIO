/**
 * NOL-1:4 — Universal NexoraObject State & Transition Engine
 *
 * Single authority for lifecycle, status, runtime, visualization and executive
 * state transitions of every NexoraObject. Calculates the full effect set for a
 * requested transition, validates it against the registry, guards and policies,
 * and only then applies it atomically.
 *
 * Upstream: NOL-1:1 Foundation + NOL-1:2 Contract + NOL-1:3 Runtime Model only.
 *
 * Identity: NOL-1:4/UniversalNexoraObjectStateTransitionEngine
 */

import {
  NEXORA_OBJECT_STATUSES,
  isNexoraObjectLifecycle,
  isNexoraObjectStatus,
  type NexoraObjectLifecycle,
  type NexoraObjectStatus,
  type NexoraObjectType,
  type NexoraObjectVisualizationState,
} from "../foundation/universalNexoraObjectFoundation.ts";
import {
  canTransitionStatus,
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";
import {
  applyNexoraObjectRuntimeCommand,
  getNexoraObjectRuntimeState,
  hydrateNexoraObjectRuntimeState,
  validateNexoraObjectRuntimeState,
  type NexoraObjectExecutionState,
  type NexoraObjectInteractionState,
  type NexoraObjectRuntimeCommand,
  type NexoraObjectRuntimeCommandContext,
  type NexoraObjectRuntimeDependencies,
  type NexoraObjectRuntimeError,
  type NexoraObjectRuntimeState,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";

// ─── Engine identity & versions ─────────────────────────────────────────────

export const NOL_STE_IDENTITY =
  "NOL-1:4/UniversalNexoraObjectStateTransitionEngine" as const;

export const NOL_STE_NAMESPACE =
  "nexora.nol.universal.object.state.transition" as const;

export const NOL_STE_VERSION = "1.0.0" as const;

export const NOL_STE_STATE_SCHEMA_VERSION = "1.0.0" as const;

export const NOL_STE_TAGS = Object.freeze([
  "[NOL-1:4]",
  "[UNIVERSAL_NEXORA_OBJECT_STATE]",
  "[TRANSITION_ENGINE]",
  "[EFFECT_CALCULATED_THEN_APPLIED]",
  "[POLICY_DRIVEN]",
  "[RUNTIME_DELEGATED]",
  "[IDENTITY_PRESERVED]",
] as const);

/** Spec aliases. */
export const stateTransitionEngineIdentity = NOL_STE_IDENTITY;
export const stateTransitionEngineVersion = NOL_STE_VERSION;
export const stateTransitionSchemaVersion = NOL_STE_STATE_SCHEMA_VERSION;

export const NOL_STE_UPSTREAM = Object.freeze([
  "NOL-1:1/UniversalNexoraObjectFoundation",
  "NOL-1:2/UniversalNexoraObjectContractModel",
  "NOL-1:3/UniversalNexoraObjectRuntimeModel",
] as const);

// ─── Transition catalogue ───────────────────────────────────────────────────

export const NEXORA_OBJECT_LIFECYCLE_TRANSITION_TYPES = Object.freeze([
  "Activate",
  "Pause",
  "Resume",
  "Archive",
  "Restore",
  "Delete",
] as const);

export type NexoraObjectLifecycleTransitionType =
  (typeof NEXORA_OBJECT_LIFECYCLE_TRANSITION_TYPES)[number];

export const NEXORA_OBJECT_STATUS_TRANSITION_TYPES = Object.freeze([
  "SetGreen",
  "SetYellow",
  "SetRed",
  "SetBlue",
  "SetWhite",
  "SetBlack",
] as const);

export type NexoraObjectStatusTransitionType =
  (typeof NEXORA_OBJECT_STATUS_TRANSITION_TYPES)[number];

/** Runtime transition names are identical to NOL-1:3 command names. */
export const NEXORA_OBJECT_RUNTIME_TRANSITION_TYPES = Object.freeze([
  "Select",
  "Deselect",
  "Focus",
  "Blur",
  "Show",
  "Hide",
  "Highlight",
  "ClearHighlight",
  "Lock",
  "Unlock",
  "MarkDirty",
  "MarkClean",
  "StartLoading",
  "StopLoading",
  "PrepareExecution",
  "StartExecution",
  "PauseExecution",
  "ResumeExecution",
  "CompleteExecution",
  "FailExecution",
  "CancelExecution",
  "ResetExecution",
  "ResetRuntime",
] as const);

export type NexoraObjectRuntimeTransitionType =
  (typeof NEXORA_OBJECT_RUNTIME_TRANSITION_TYPES)[number];

export const NEXORA_OBJECT_STATE_TRANSITION_TYPES = Object.freeze([
  ...NEXORA_OBJECT_LIFECYCLE_TRANSITION_TYPES,
  ...NEXORA_OBJECT_STATUS_TRANSITION_TYPES,
  ...NEXORA_OBJECT_RUNTIME_TRANSITION_TYPES,
  "SetVisualization",
  "SetExecutiveState",
  "Composite",
] as const);

export type NexoraObjectTransitionType =
  (typeof NEXORA_OBJECT_STATE_TRANSITION_TYPES)[number];

export const NEXORA_OBJECT_TRANSITION_CATEGORIES = Object.freeze([
  "Lifecycle",
  "Status",
  "Runtime",
  "Visualization",
  "Executive",
  "Composite",
] as const);

export type NexoraObjectTransitionCategory =
  (typeof NEXORA_OBJECT_TRANSITION_CATEGORIES)[number];

export const NEXORA_OBJECT_TRANSITION_SOURCES = Object.freeze([
  "Engine",
  "Runtime",
  "Director",
  "Advisor",
  "Timeline",
  "Workspace",
  "System",
] as const);

export type NexoraObjectTransitionSource =
  (typeof NEXORA_OBJECT_TRANSITION_SOURCES)[number];

// ─── Lifecycle graph ────────────────────────────────────────────────────────

export const NEXORA_OBJECT_LIFECYCLE_GRAPH: Readonly<
  Record<NexoraObjectLifecycle, readonly NexoraObjectLifecycle[]>
> = Object.freeze({
  Created: Object.freeze(["Active", "Deleted"] as const),
  Active: Object.freeze(["Paused", "Archived", "Deleted"] as const),
  Paused: Object.freeze(["Active", "Archived", "Deleted"] as const),
  Archived: Object.freeze(["Active", "Deleted"] as const),
  Deleted: Object.freeze([] as readonly NexoraObjectLifecycle[]),
});

export const NEXORA_OBJECT_TERMINAL_EXECUTION_STATES = Object.freeze([
  "Completed",
  "Failed",
  "Cancelled",
] as const);

export const NEXORA_OBJECT_ACTIVE_EXECUTION_STATES = Object.freeze([
  "Preparing",
  "Running",
  "Paused",
] as const);

// ─── Patch surfaces ─────────────────────────────────────────────────────────

export const NEXORA_OBJECT_VISUALIZATION_PATCH_FIELDS = Object.freeze([
  "position",
  "scale",
  "rotation",
  "opacity",
  "animationState",
  "badgeState",
  "priority",
  "cameraWeight",
] as const);

export type NexoraObjectVisualizationPatchField =
  (typeof NEXORA_OBJECT_VISUALIZATION_PATCH_FIELDS)[number];

/**
 * Visualization fields the engine may write. `colorState` is intentionally
 * excluded — it is owned by the status transitions.
 */
export type NexoraObjectVisualizationPatch = {
  readonly position?: readonly [number, number, number];
  readonly scale?: readonly [number, number, number];
  readonly rotation?: readonly [number, number, number];
  readonly opacity?: number;
  readonly animationState?: string;
  readonly badgeState?: string;
  readonly priority?: number;
  readonly cameraWeight?: number;
};

export const NEXORA_OBJECT_EXECUTIVE_PATCH_FIELDS = Object.freeze([
  "importance",
  "urgency",
  "priority",
  "attentionScore",
  "impactScore",
  "confidence",
] as const);

export type NexoraObjectExecutivePatchField =
  (typeof NEXORA_OBJECT_EXECUTIVE_PATCH_FIELDS)[number];

export type NexoraObjectExecutivePatch = {
  readonly importance?: number;
  readonly urgency?: number;
  readonly priority?: number;
  readonly attentionScore?: number;
  readonly impactScore?: number;
  readonly confidence?: number;
};

export const NEXORA_OBJECT_EXECUTIVE_MIN = 0 as const;
export const NEXORA_OBJECT_EXECUTIVE_MAX = 100 as const;

export type NexoraObjectStateExecutive = {
  readonly importance: number;
  readonly urgency: number;
  readonly priority: number;
  readonly attentionScore: number;
  readonly impactScore: number;
  readonly confidence: number;
};

// ─── Canonical state ────────────────────────────────────────────────────────

/**
 * Canonical engine state — the composed truth of contract facets plus the
 * NOL-1:3 runtime reality, tagged with the engine's own revision counter.
 */
export type NexoraObjectState = {
  readonly objectId: string;
  readonly objectType: NexoraObjectType;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly runtime: NexoraObjectRuntimeState;
  readonly visualization: NexoraObjectVisualizationState;
  readonly executive: NexoraObjectStateExecutive;
  readonly stateRevision: number;
  readonly stateSchemaVersion: typeof NOL_STE_STATE_SCHEMA_VERSION;
  readonly updatedAt: string;
};

export type NexoraObjectStateProjection = {
  readonly objectId: string;
  readonly objectType: NexoraObjectType;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly visible: boolean;
  readonly highlighted: boolean;
  readonly locked: boolean;
  readonly dirty: boolean;
  readonly loading: boolean;
  readonly executing: boolean;
  readonly interactionState: NexoraObjectInteractionState;
  readonly executionState: NexoraObjectExecutionState;
  readonly opacity: number;
  readonly colorState: NexoraObjectStatus;
  readonly visualizationPriority: number;
  readonly cameraWeight: number;
  readonly executive: NexoraObjectStateExecutive;
  readonly stateRevision: number;
  readonly runtimeRevision: number;
  readonly updatedAt: string;
  readonly stateSchemaVersion: typeof NOL_STE_STATE_SCHEMA_VERSION;
};

// ─── Requests & context ─────────────────────────────────────────────────────

export type NexoraObjectTransitionContext = {
  readonly actorId?: string;
  readonly source: NexoraObjectTransitionSource;
  readonly authorizedSystemMutation?: boolean;
  readonly occurredAt?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly reason?: string;
};

export type NexoraObjectTransitionPayload = {
  readonly reason?: string;
  readonly visualization?: NexoraObjectVisualizationPatch;
  readonly executive?: NexoraObjectExecutivePatch;
  readonly transitions?: readonly NexoraObjectTransitionRequest[];
  readonly replayRestoration?: boolean;
  readonly [key: string]: unknown;
};

export type NexoraObjectTransitionRequest = {
  readonly transitionId?: string;
  readonly type: NexoraObjectTransitionType;
  readonly payload?: NexoraObjectTransitionPayload;
  readonly context?: NexoraObjectTransitionContext;
  readonly expectedStateRevision?: number;
  readonly dryRun?: boolean;
  readonly reason?: string;
};

export type NexoraObjectTransitionBatchMode = "Atomic" | "BestEffort";

export type NexoraObjectTransitionBatchItem = NexoraObjectTransitionRequest & {
  readonly objectId: string;
};

export type NexoraObjectTransitionBatchRequest = {
  readonly batchId?: string;
  readonly mode: NexoraObjectTransitionBatchMode;
  readonly transitions: readonly NexoraObjectTransitionBatchItem[];
  readonly context?: NexoraObjectTransitionContext;
};

// ─── Effects ────────────────────────────────────────────────────────────────

export const NEXORA_OBJECT_TRANSITION_EFFECT_KINDS = Object.freeze([
  "SetLifecycle",
  "SetStatus",
  "ApplyRuntimeCommand",
  "SetVisualization",
  "SetExecutiveState",
  "EmitEvent",
  "AddWarning",
] as const);

export type NexoraObjectTransitionEffectKind =
  (typeof NEXORA_OBJECT_TRANSITION_EFFECT_KINDS)[number];

export type NexoraObjectTransitionEffect =
  | { readonly kind: "SetLifecycle"; readonly lifecycle: NexoraObjectLifecycle }
  | { readonly kind: "SetStatus"; readonly status: NexoraObjectStatus }
  | {
      readonly kind: "ApplyRuntimeCommand";
      readonly command: NexoraObjectRuntimeCommand;
      /** Engine-internal cleanup issued as an authorized System mutation. */
      readonly elevated?: boolean;
    }
  | {
      readonly kind: "SetVisualization";
      readonly patch: NexoraObjectVisualizationPatch;
    }
  | {
      readonly kind: "SetExecutiveState";
      readonly patch: NexoraObjectStateExecutive;
    }
  | {
      readonly kind: "EmitEvent";
      readonly eventType: NexoraObjectStateEventType;
      readonly payload?: Readonly<Record<string, unknown>>;
    }
  | { readonly kind: "AddWarning"; readonly message: string };

// ─── Events ─────────────────────────────────────────────────────────────────

export const NEXORA_OBJECT_STATE_EVENT_TYPES = Object.freeze([
  "LifecycleChanged",
  "StatusChanged",
  "RuntimeChanged",
  "VisualizationChanged",
  "ExecutiveStateChanged",
  "TransitionApplied",
  "TransitionRejected",
  "TransitionNoOp",
] as const);

export type NexoraObjectStateEventType =
  (typeof NEXORA_OBJECT_STATE_EVENT_TYPES)[number];

export type NexoraObjectStateEvent = {
  readonly eventId: string;
  readonly objectId: string;
  readonly type: NexoraObjectStateEventType;
  readonly occurredAt: string;
  readonly stateRevision: number;
  readonly transitionId: string;
  readonly transitionType: NexoraObjectTransitionType;
  readonly source: NexoraObjectTransitionSource;
  readonly actorId?: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
};

// ─── Errors ─────────────────────────────────────────────────────────────────

export type NexoraObjectStateTransitionErrorCode =
  | "TRANSITION_UNSUPPORTED_TYPE"
  | "TRANSITION_INVALID_LIFECYCLE"
  | "TRANSITION_INVALID_STATUS"
  | "TRANSITION_INVALID_RUNTIME"
  | "TRANSITION_INVALID_EXECUTION"
  | "TRANSITION_INVALID_VISUALIZATION"
  | "TRANSITION_INVALID_EXECUTIVE"
  | "TRANSITION_INVALID_PAYLOAD"
  | "TRANSITION_OBJECT_LOCKED"
  | "TRANSITION_OBJECT_DELETED"
  | "TRANSITION_OBJECT_ARCHIVED"
  | "TRANSITION_OBJECT_NOT_FOUND"
  | "TRANSITION_DUPLICATE_TRANSITION_ID"
  | "TRANSITION_REVISION_CONFLICT"
  | "TRANSITION_STATE_REVISION_CONFLICT"
  | "TRANSITION_UNAUTHORIZED_SYSTEM_MUTATION"
  | "TRANSITION_REASON_REQUIRED"
  | "TRANSITION_POLICY_REJECTED"
  | "TRANSITION_NESTED_COMPOSITE"
  | "TRANSITION_EMPTY_COMPOSITE"
  | "TRANSITION_INVARIANT_VIOLATION"
  | "TRANSITION_IDENTITY_MUTATION"
  | "TRANSITION_BATCH_ABORTED"
  | "TRANSITION_UNSUPPORTED_VERSION";

export type NexoraObjectStateTransitionError = {
  readonly code: NexoraObjectStateTransitionErrorCode;
  readonly message: string;
  readonly objectId: string;
  readonly transitionType?: NexoraObjectTransitionType;
  readonly transitionId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export class NexoraObjectStateTransitionException extends Error {
  readonly code: NexoraObjectStateTransitionErrorCode;
  readonly objectId: string;
  readonly transitionType?: NexoraObjectTransitionType;
  readonly transitionId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectStateTransitionError) {
    super(error.message);
    this.name = "NexoraObjectStateTransitionException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.transitionType = error.transitionType;
    this.transitionId = error.transitionId;
    this.details = error.details;
  }
}

export type NexoraObjectTransitionGuardResult = {
  readonly allowed: boolean;
  readonly code?: NexoraObjectStateTransitionErrorCode;
  readonly message?: string;
};

export type NexoraObjectStateValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
};

// ─── Plans & results ────────────────────────────────────────────────────────

export type NexoraObjectTransitionPlan = {
  readonly transitionId: string;
  readonly type: NexoraObjectTransitionType;
  readonly objectId: string;
  readonly accepted: boolean;
  readonly noOp: boolean;
  readonly dryRun: boolean;
  readonly previousState: NexoraObjectState;
  readonly projectedState: NexoraObjectState;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
  readonly childTransitionIds: readonly string[];
  /** Fully resolved context — reused verbatim when the plan is applied. */
  readonly context: NexoraObjectTransitionContext;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly source: NexoraObjectTransitionSource;
  readonly occurredAt: string;
};

export type NexoraObjectTransitionResult = {
  readonly transitionId: string;
  readonly type: NexoraObjectTransitionType;
  readonly objectId: string;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly noOp: boolean;
  readonly dryRun: boolean;
  readonly previousState: NexoraObjectState;
  readonly nextState: NexoraObjectState;
  readonly previousStateRevision: number;
  readonly nextStateRevision: number;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly events: readonly NexoraObjectStateEvent[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
  readonly childTransitionIds: readonly string[];
  readonly correlationId: string;
  readonly causationId?: string;
  readonly source: NexoraObjectTransitionSource;
  readonly actorId?: string;
  readonly occurredAt: string;
};

export type NexoraObjectTransitionBatchResult = {
  readonly batchId: string;
  readonly mode: NexoraObjectTransitionBatchMode;
  readonly accepted: boolean;
  readonly results: readonly NexoraObjectTransitionResult[];
  readonly changedObjectIds: readonly string[];
  readonly rejectedObjectIds: readonly string[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly correlationId: string;
};

export type NexoraObjectTransitionSimulationResult = {
  readonly objectId: string;
  readonly accepted: boolean;
  readonly plans: readonly NexoraObjectTransitionPlan[];
  readonly initialState: NexoraObjectState;
  readonly finalState: NexoraObjectState;
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly correlationId: string;
};

export type NexoraObjectTransitionSimulationOptions = {
  readonly continueOnError?: boolean;
  readonly registry?: NexoraObjectTransitionRegistry;
  readonly policies?: readonly NexoraObjectTransitionPolicy[];
};

// ─── Registry ───────────────────────────────────────────────────────────────

export type NexoraObjectTransitionDefinition = {
  readonly type: NexoraObjectTransitionType;
  readonly category: NexoraObjectTransitionCategory;
  readonly description: string;
  readonly requiresReason: boolean;
  readonly targetLifecycle?: NexoraObjectLifecycle;
  readonly targetStatus?: NexoraObjectStatus;
  readonly runtimeCommandType?: NexoraObjectRuntimeCommand["type"];
  /** Lifecycles the transition may be *requested* from (no-ops excepted). */
  readonly allowedFromLifecycles: readonly NexoraObjectLifecycle[];
};

export type NexoraObjectTransitionRegistry = {
  readonly registryVersion: typeof NOL_STE_VERSION;
  readonly definitions: ReadonlyMap<
    NexoraObjectTransitionType,
    NexoraObjectTransitionDefinition
  >;
};

export type NexoraObjectTransitionRegistryValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly string[];
};

// ─── Policies ───────────────────────────────────────────────────────────────

export type NexoraObjectTransitionPolicyInput = {
  readonly objectId: string;
  readonly state: NexoraObjectState;
  readonly request: NexoraObjectTransitionRequest;
  readonly definition: NexoraObjectTransitionDefinition;
  readonly context: NexoraObjectTransitionContext;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly reason: string | null;
};

export type NexoraObjectTransitionPolicyOutcome = {
  readonly rejected?: boolean;
  readonly errors?: readonly NexoraObjectStateTransitionError[];
  readonly warnings?: readonly string[];
  readonly prependEffects?: readonly NexoraObjectTransitionEffect[];
  readonly appendEffects?: readonly NexoraObjectTransitionEffect[];
};

export type NexoraObjectTransitionPolicy = {
  readonly id: string;
  readonly description: string;
  readonly appliesTo: readonly NexoraObjectTransitionType[];
  readonly evaluate: (
    input: NexoraObjectTransitionPolicyInput,
  ) => NexoraObjectTransitionPolicyOutcome;
};

// ─── History ────────────────────────────────────────────────────────────────

export type NexoraObjectTransitionRecord = {
  readonly recordId: string;
  readonly transitionId: string;
  readonly objectId: string;
  readonly type: NexoraObjectTransitionType;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly noOp: boolean;
  readonly dryRun: boolean;
  readonly fromLifecycle: NexoraObjectLifecycle;
  readonly toLifecycle: NexoraObjectLifecycle;
  readonly fromStatus: NexoraObjectStatus;
  readonly toStatus: NexoraObjectStatus;
  readonly previousStateRevision: number;
  readonly nextStateRevision: number;
  readonly occurredAt: string;
  readonly source: NexoraObjectTransitionSource;
  readonly actorId?: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly errorCodes: readonly NexoraObjectStateTransitionErrorCode[];
  readonly warnings: readonly string[];
  readonly engineIdentity: typeof NOL_STE_IDENTITY;
  readonly engineVersion: typeof NOL_STE_VERSION;
  readonly stateSchemaVersion: typeof NOL_STE_STATE_SCHEMA_VERSION;
};

// ─── Dependencies ───────────────────────────────────────────────────────────

export type NexoraObjectStateTransitionDependencies = {
  readonly now: () => string;
  readonly createEventId: () => string;
  readonly createTransitionId?: () => string;
  readonly emitRejectedEvents?: boolean;
};

export type NexoraObjectTransitionEvaluationOptions = {
  readonly registry?: NexoraObjectTransitionRegistry;
  readonly policies?: readonly NexoraObjectTransitionPolicy[];
  /** Evaluate against a supplied (virtual) state instead of the live one. */
  readonly baseState?: NexoraObjectState;
  readonly correlationId?: string;
};

type SerializedNexoraObjectState = {
  readonly engineIdentity: string;
  readonly engineVersion: string;
  readonly stateSchemaVersion: string;
  readonly state: NexoraObjectState;
};

type SerializedNexoraObjectTransitionRecord = {
  readonly engineIdentity: string;
  readonly engineVersion: string;
  readonly stateSchemaVersion: string;
  readonly record: NexoraObjectTransitionRecord;
};

// ─── Store (engine revision only; identity never persisted here) ────────────

const stateRevisionByObjectId = new Map<string, number>();

let defaultEventSeq = 0;
let defaultTransitionSeq = 0;
let defaultRecordSeq = 0;

export const defaultNexoraObjectStateTransitionDependencies: NexoraObjectStateTransitionDependencies =
  Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      defaultEventSeq += 1;
      return `nst-evt-${defaultEventSeq}`;
    },
    createTransitionId: () => {
      defaultTransitionSeq += 1;
      return `nst-txn-${defaultTransitionSeq}`;
    },
    emitRejectedEvents: false,
  });

export function resetNexoraObjectStateTransitionStoreForTests(): void {
  stateRevisionByObjectId.clear();
  defaultEventSeq = 0;
  defaultTransitionSeq = 0;
  defaultRecordSeq = 0;
}

export function getNexoraObjectStateRevision(objectId: string): number {
  return stateRevisionByObjectId.get(objectId) ?? 0;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function err(
  code: NexoraObjectStateTransitionErrorCode,
  message: string,
  objectId: string,
  transitionType?: NexoraObjectTransitionType,
  transitionId?: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectStateTransitionError {
  return Object.freeze({
    code,
    message,
    objectId,
    transitionType,
    transitionId,
    details: details ? Object.freeze({ ...details }) : undefined,
  });
}

function deny(
  code: NexoraObjectStateTransitionErrorCode,
  message: string,
): NexoraObjectTransitionGuardResult {
  return Object.freeze({ allowed: false, code, message });
}

function allow(): NexoraObjectTransitionGuardResult {
  return Object.freeze({ allowed: true });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isVector3(value: unknown): value is readonly [number, number, number] {
  return (
    Array.isArray(value) && value.length === 3 && value.every(isFiniteNumber)
  );
}

function freezeVector(
  value: readonly [number, number, number],
): readonly [number, number, number] {
  return Object.freeze([value[0], value[1], value[2]]) as readonly [
    number,
    number,
    number,
  ];
}

function freezeVisualization(
  visualization: NexoraObjectVisualizationState,
): NexoraObjectVisualizationState {
  return Object.freeze({
    ...visualization,
    position: freezeVector(
      visualization.position as readonly [number, number, number],
    ),
    scale: freezeVector(visualization.scale as readonly [number, number, number]),
    rotation: freezeVector(
      visualization.rotation as readonly [number, number, number],
    ),
  });
}

function freezeState(state: NexoraObjectState): NexoraObjectState {
  return Object.freeze({
    ...state,
    runtime: Object.freeze({ ...state.runtime }),
    visualization: freezeVisualization(state.visualization),
    executive: Object.freeze({ ...state.executive }),
  });
}

function isSystemAuthorized(context: NexoraObjectTransitionContext): boolean {
  return context.source === "System" && context.authorizedSystemMutation === true;
}

function toRuntimeSource(
  source: NexoraObjectTransitionSource,
): NexoraObjectRuntimeCommandContext["source"] {
  return source === "Engine" ? "System" : source;
}

function toRuntimeContext(
  context: NexoraObjectTransitionContext,
  elevated: boolean,
): NexoraObjectRuntimeCommandContext {
  if (elevated) {
    return Object.freeze({
      actorId: context.actorId,
      source: "System" as const,
      authorizedSystemMutation: true,
      occurredAt: context.occurredAt,
      correlationId: context.correlationId,
      reason: context.reason,
    });
  }
  return Object.freeze({
    actorId: context.actorId,
    source: toRuntimeSource(context.source),
    authorizedSystemMutation:
      context.source === "Engine"
        ? context.authorizedSystemMutation ?? false
        : context.authorizedSystemMutation,
    occurredAt: context.occurredAt,
    correlationId: context.correlationId,
    reason: context.reason,
  });
}

function toRuntimeDependencies(
  deps: NexoraObjectStateTransitionDependencies,
): NexoraObjectRuntimeDependencies {
  return Object.freeze({ now: deps.now, createEventId: deps.createEventId });
}

function resolveDeps(
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectStateTransitionDependencies {
  return deps ?? defaultNexoraObjectStateTransitionDependencies;
}

function resolveTransitionId(
  request: NexoraObjectTransitionRequest,
  deps: NexoraObjectStateTransitionDependencies,
): string {
  if (request.transitionId && request.transitionId.trim()) {
    return request.transitionId.trim();
  }
  const factory =
    deps.createTransitionId ??
    defaultNexoraObjectStateTransitionDependencies.createTransitionId;
  return factory ? factory() : `nst-txn-${Date.now()}`;
}

function resolveContext(
  request: NexoraObjectTransitionRequest,
  fallback?: NexoraObjectTransitionContext,
): NexoraObjectTransitionContext {
  const merged: NexoraObjectTransitionContext = {
    source: "Engine",
    ...(fallback ?? {}),
    ...(request.context ?? {}),
  };
  return Object.freeze(merged);
}

function resolveReason(
  request: NexoraObjectTransitionRequest,
  context: NexoraObjectTransitionContext,
): string | null {
  const candidates = [
    context.reason,
    request.reason,
    typeof request.payload?.reason === "string"
      ? request.payload.reason
      : undefined,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

function stateFingerprint(state: NexoraObjectState): string {
  return JSON.stringify([
    state.status,
    state.lifecycle,
    state.runtime.selected,
    state.runtime.focused,
    state.runtime.visible,
    state.runtime.highlighted,
    state.runtime.locked,
    state.runtime.dirty,
    state.runtime.loading,
    state.runtime.executing,
    state.runtime.interactionState,
    state.runtime.executionState,
    state.visualization.position,
    state.visualization.scale,
    state.visualization.rotation,
    state.visualization.opacity,
    state.visualization.colorState,
    state.visualization.animationState,
    state.visualization.badgeState,
    state.visualization.priority,
    state.visualization.cameraWeight,
    state.executive.importance,
    state.executive.urgency,
    state.executive.priority,
    state.executive.attentionScore,
    state.executive.impactScore,
    state.executive.confidence,
  ]);
}

function isActiveExecution(executionState: NexoraObjectExecutionState): boolean {
  return (
    NEXORA_OBJECT_ACTIVE_EXECUTION_STATES as readonly string[]
  ).includes(executionState);
}

// ─── State factory / projection ─────────────────────────────────────────────

/**
 * Compose the canonical engine state from the contract facets plus the
 * NOL-1:3 runtime reality. Never mutates the object.
 */
export function createNexoraObjectState(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectState {
  const d = resolveDeps(deps);
  const runtime = getNexoraObjectRuntimeState(object, toRuntimeDependencies(d));
  const objectId = object.identity.id;

  return freezeState({
    objectId,
    objectType: object.identity.type,
    status: object.status,
    lifecycle: object.lifecycle,
    runtime,
    visualization: object.visualization,
    executive: {
      importance: object.executive.importance,
      urgency: object.executive.urgency,
      priority: object.executive.priority,
      attentionScore: object.executive.attentionScore,
      impactScore: object.executive.impactScore,
      confidence: object.executive.confidence,
    },
    stateRevision: getNexoraObjectStateRevision(objectId),
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
    updatedAt: runtime.updatedAt,
  });
}

export function projectNexoraObjectState(
  state: NexoraObjectState,
): NexoraObjectStateProjection {
  return Object.freeze({
    objectId: state.objectId,
    objectType: state.objectType,
    status: state.status,
    lifecycle: state.lifecycle,
    selected: state.runtime.selected,
    focused: state.runtime.focused,
    visible: state.runtime.visible,
    highlighted: state.runtime.highlighted,
    locked: state.runtime.locked,
    dirty: state.runtime.dirty,
    loading: state.runtime.loading,
    executing: state.runtime.executing,
    interactionState: state.runtime.interactionState,
    executionState: state.runtime.executionState,
    opacity: state.visualization.opacity,
    colorState: state.visualization.colorState,
    visualizationPriority: state.visualization.priority,
    cameraWeight: state.visualization.cameraWeight,
    executive: Object.freeze({ ...state.executive }),
    stateRevision: state.stateRevision,
    runtimeRevision: state.runtime.runtimeRevision,
    updatedAt: state.updatedAt,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export function validateNexoraObjectState(
  state: NexoraObjectState,
): NexoraObjectStateValidationResult {
  const errors: string[] = [];

  if (!state.objectId || !state.objectId.trim()) {
    errors.push("objectId must be a non-empty string");
  }
  if (!isNexoraObjectStatus(state.status)) {
    errors.push(`status is invalid: ${String(state.status)}`);
  }
  if (!isNexoraObjectLifecycle(state.lifecycle)) {
    errors.push(`lifecycle is invalid: ${String(state.lifecycle)}`);
  }
  if (!Number.isInteger(state.stateRevision) || state.stateRevision < 0) {
    errors.push("stateRevision must be a non-negative integer");
  }
  if (Number.isNaN(Date.parse(state.updatedAt))) {
    errors.push("updatedAt must be a valid ISO string");
  }
  if (state.stateSchemaVersion !== NOL_STE_STATE_SCHEMA_VERSION) {
    errors.push(
      `stateSchemaVersion must be ${NOL_STE_STATE_SCHEMA_VERSION}, received ${String(
        state.stateSchemaVersion,
      )}`,
    );
  }

  // Delegate the runtime portion to NOL-1:3.
  if (isNexoraObjectLifecycle(state.lifecycle)) {
    const runtimeValidation = validateNexoraObjectRuntimeState(
      state.runtime,
      state.lifecycle,
    );
    for (const message of runtimeValidation.errors) {
      errors.push(`runtime: ${message}`);
    }
  }

  if (state.runtime.focused && !state.runtime.selected) {
    errors.push("focused implies selected");
  }

  if (state.lifecycle === "Deleted") {
    if (!state.runtime.locked) errors.push("deleted implies locked");
    if (state.runtime.selected) errors.push("deleted implies not selected");
    if (state.runtime.focused) errors.push("deleted implies not focused");
    if (state.runtime.executing) errors.push("deleted implies not executing");
    if (isActiveExecution(state.runtime.executionState)) {
      errors.push("deleted implies no active execution");
    }
  }

  if (
    state.lifecycle === "Archived" &&
    (state.runtime.executionState === "Preparing" ||
      state.runtime.executionState === "Running")
  ) {
    errors.push("archived implies execution is neither Preparing nor Running");
  }

  if (state.lifecycle === "Created" && state.runtime.executionState !== "Idle") {
    errors.push("created implies execution state Idle");
  }

  const visualization = state.visualization;
  if (!isFiniteNumber(visualization.opacity)) {
    errors.push("visualization.opacity must be a finite number");
  } else if (visualization.opacity < 0 || visualization.opacity > 1) {
    errors.push("visualization.opacity must be within [0, 1]");
  }
  if (!isVector3(visualization.position)) {
    errors.push("visualization.position must be three finite numbers");
  }
  if (!isVector3(visualization.scale)) {
    errors.push("visualization.scale must be three finite numbers");
  }
  if (!isVector3(visualization.rotation)) {
    errors.push("visualization.rotation must be three finite numbers");
  }
  if (!isFiniteNumber(visualization.priority)) {
    errors.push("visualization.priority must be a finite number");
  }
  if (!isFiniteNumber(visualization.cameraWeight)) {
    errors.push("visualization.cameraWeight must be a finite number");
  }
  if (!isNexoraObjectStatus(visualization.colorState)) {
    errors.push("visualization.colorState must be a Seed status");
  }

  for (const field of NEXORA_OBJECT_EXECUTIVE_PATCH_FIELDS) {
    const value = state.executive[field];
    if (!isFiniteNumber(value)) {
      errors.push(`executive.${field} must be a finite number`);
      continue;
    }
    if (value < NEXORA_OBJECT_EXECUTIVE_MIN || value > NEXORA_OBJECT_EXECUTIVE_MAX) {
      errors.push(
        `executive.${field} must be within [${NEXORA_OBJECT_EXECUTIVE_MIN}, ${NEXORA_OBJECT_EXECUTIVE_MAX}]`,
      );
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function assertNexoraObjectStateInvariants(
  state: NexoraObjectState,
  objectId: string = state.objectId,
): void {
  const validation = validateNexoraObjectState(state);
  if (!validation.ok) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_INVARIANT_VIOLATION",
        validation.errors.join("; "),
        objectId,
      ),
    );
  }
}

// ─── Registry ───────────────────────────────────────────────────────────────

const ALL_LIFECYCLES: readonly NexoraObjectLifecycle[] = Object.freeze([
  "Created",
  "Active",
  "Paused",
  "Archived",
  "Deleted",
] as const);

const MUTABLE_LIFECYCLES: readonly NexoraObjectLifecycle[] = Object.freeze([
  "Created",
  "Active",
  "Paused",
  "Archived",
] as const);

const STATUS_BY_TRANSITION: Readonly<
  Record<NexoraObjectStatusTransitionType, NexoraObjectStatus>
> = Object.freeze({
  SetGreen: "Green",
  SetYellow: "Yellow",
  SetRed: "Red",
  SetBlue: "Blue",
  SetWhite: "White",
  SetBlack: "Black",
});

const LIFECYCLE_TARGET_BY_TRANSITION: Readonly<
  Record<NexoraObjectLifecycleTransitionType, NexoraObjectLifecycle>
> = Object.freeze({
  Activate: "Active",
  Pause: "Paused",
  Resume: "Active",
  Archive: "Archived",
  Restore: "Active",
  Delete: "Deleted",
});

const LIFECYCLE_SOURCES_BY_TRANSITION: Readonly<
  Record<NexoraObjectLifecycleTransitionType, readonly NexoraObjectLifecycle[]>
> = Object.freeze({
  Activate: Object.freeze(["Created", "Active", "Paused", "Archived"] as const),
  Pause: Object.freeze(["Active", "Paused"] as const),
  Resume: Object.freeze(["Paused", "Active"] as const),
  Archive: Object.freeze(["Active", "Paused", "Archived"] as const),
  Restore: Object.freeze(["Archived", "Active"] as const),
  Delete: Object.freeze([
    "Created",
    "Active",
    "Paused",
    "Archived",
    "Deleted",
  ] as const),
});

function buildDefaultDefinitions(): readonly NexoraObjectTransitionDefinition[] {
  const definitions: NexoraObjectTransitionDefinition[] = [];

  for (const type of NEXORA_OBJECT_LIFECYCLE_TRANSITION_TYPES) {
    definitions.push(
      Object.freeze({
        type,
        category: "Lifecycle" as const,
        description: `Lifecycle transition ${type} → ${LIFECYCLE_TARGET_BY_TRANSITION[type]}.`,
        requiresReason: type === "Delete",
        targetLifecycle: LIFECYCLE_TARGET_BY_TRANSITION[type],
        allowedFromLifecycles: LIFECYCLE_SOURCES_BY_TRANSITION[type],
      }),
    );
  }

  for (const type of NEXORA_OBJECT_STATUS_TRANSITION_TYPES) {
    definitions.push(
      Object.freeze({
        type,
        category: "Status" as const,
        description: `Status transition → ${STATUS_BY_TRANSITION[type]}.`,
        requiresReason: false,
        targetStatus: STATUS_BY_TRANSITION[type],
        allowedFromLifecycles: ALL_LIFECYCLES,
      }),
    );
  }

  for (const type of NEXORA_OBJECT_RUNTIME_TRANSITION_TYPES) {
    definitions.push(
      Object.freeze({
        type,
        category: "Runtime" as const,
        description: `Runtime command ${type} delegated to NOL-1:3.`,
        requiresReason: false,
        runtimeCommandType: type,
        allowedFromLifecycles: ALL_LIFECYCLES,
      }),
    );
  }

  definitions.push(
    Object.freeze({
      type: "SetVisualization" as const,
      category: "Visualization" as const,
      description: "Patch the Director-facing visualization facet.",
      requiresReason: false,
      allowedFromLifecycles: ALL_LIFECYCLES,
    }),
    Object.freeze({
      type: "SetExecutiveState" as const,
      category: "Executive" as const,
      description: "Patch the executive scoring facet.",
      requiresReason: false,
      allowedFromLifecycles: MUTABLE_LIFECYCLES,
    }),
    Object.freeze({
      type: "Composite" as const,
      category: "Composite" as const,
      description: "Atomic sequence of non-composite transitions.",
      requiresReason: false,
      allowedFromLifecycles: ALL_LIFECYCLES,
    }),
  );

  return Object.freeze(definitions);
}

export function createNexoraObjectTransitionRegistry(
  overrides?: readonly NexoraObjectTransitionDefinition[],
): NexoraObjectTransitionRegistry {
  const definitions = new Map<
    NexoraObjectTransitionType,
    NexoraObjectTransitionDefinition
  >();
  for (const definition of buildDefaultDefinitions()) {
    definitions.set(definition.type, definition);
  }
  for (const override of overrides ?? []) {
    definitions.set(override.type, Object.freeze({ ...override }));
  }
  return Object.freeze({
    registryVersion: NOL_STE_VERSION,
    definitions: definitions as ReadonlyMap<
      NexoraObjectTransitionType,
      NexoraObjectTransitionDefinition
    >,
  });
}

const defaultRegistry = createNexoraObjectTransitionRegistry();

export function getNexoraObjectTransitionRegistry(): NexoraObjectTransitionRegistry {
  return defaultRegistry;
}

export function getNexoraObjectTransitionDefinition(
  type: NexoraObjectTransitionType,
  registry: NexoraObjectTransitionRegistry = defaultRegistry,
): NexoraObjectTransitionDefinition | null {
  return registry.definitions.get(type) ?? null;
}

export function hasNexoraObjectTransitionDefinition(
  type: NexoraObjectTransitionType | string,
  registry: NexoraObjectTransitionRegistry = defaultRegistry,
): boolean {
  return registry.definitions.has(type as NexoraObjectTransitionType);
}

export function listNexoraObjectTransitionDefinitions(
  registry: NexoraObjectTransitionRegistry = defaultRegistry,
): readonly NexoraObjectTransitionDefinition[] {
  return Object.freeze([...registry.definitions.values()]);
}

export function validateNexoraObjectTransitionRegistry(
  registry: NexoraObjectTransitionRegistry = defaultRegistry,
): NexoraObjectTransitionRegistryValidationResult {
  const errors: string[] = [];

  if (registry.registryVersion !== NOL_STE_VERSION) {
    errors.push(
      `registryVersion must be ${NOL_STE_VERSION}, received ${String(
        registry.registryVersion,
      )}`,
    );
  }

  for (const type of NEXORA_OBJECT_STATE_TRANSITION_TYPES) {
    if (!registry.definitions.has(type)) {
      errors.push(`missing definition for transition type ${type}`);
    }
  }

  for (const [type, definition] of registry.definitions) {
    if (definition.type !== type) {
      errors.push(`definition key ${type} does not match ${definition.type}`);
    }
    if (
      !(NEXORA_OBJECT_TRANSITION_CATEGORIES as readonly string[]).includes(
        definition.category,
      )
    ) {
      errors.push(`definition ${type} has an unknown category`);
    }
    if (
      definition.category === "Lifecycle" &&
      (!definition.targetLifecycle ||
        !isNexoraObjectLifecycle(definition.targetLifecycle))
    ) {
      errors.push(`lifecycle definition ${type} requires a targetLifecycle`);
    }
    if (
      definition.category === "Status" &&
      (!definition.targetStatus || !isNexoraObjectStatus(definition.targetStatus))
    ) {
      errors.push(`status definition ${type} requires a targetStatus`);
    }
    if (definition.category === "Runtime" && !definition.runtimeCommandType) {
      errors.push(`runtime definition ${type} requires a runtimeCommandType`);
    }
    if (definition.allowedFromLifecycles.length === 0) {
      errors.push(`definition ${type} allows no source lifecycle`);
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function canTransitionNexoraObjectLifecycle(
  from: NexoraObjectLifecycle,
  to: NexoraObjectLifecycle,
): boolean {
  if (from === to) return true;
  return NEXORA_OBJECT_LIFECYCLE_GRAPH[from].includes(to);
}

export function listNexoraObjectLifecycleTargets(
  from: NexoraObjectLifecycle,
): readonly NexoraObjectLifecycle[] {
  return NEXORA_OBJECT_LIFECYCLE_GRAPH[from];
}

function guardLifecycleTransition(
  state: NexoraObjectState,
  target: NexoraObjectLifecycle,
  requiredFrom?: readonly NexoraObjectLifecycle[],
): NexoraObjectTransitionGuardResult {
  if (state.lifecycle === "Deleted" && target !== "Deleted") {
    return deny(
      "TRANSITION_OBJECT_DELETED",
      "Deleted objects cannot leave the Deleted lifecycle.",
    );
  }
  if (state.lifecycle === target) return allow();
  if (requiredFrom && !requiredFrom.includes(state.lifecycle)) {
    return deny(
      "TRANSITION_INVALID_LIFECYCLE",
      `Transition requires lifecycle in [${requiredFrom.join(", ")}], found ${state.lifecycle}.`,
    );
  }
  if (!canTransitionNexoraObjectLifecycle(state.lifecycle, target)) {
    return deny(
      "TRANSITION_INVALID_LIFECYCLE",
      `Lifecycle ${state.lifecycle} → ${target} is not permitted.`,
    );
  }
  return allow();
}

export function canActivateNexoraObject(
  state: NexoraObjectState,
): NexoraObjectTransitionGuardResult {
  return guardLifecycleTransition(state, "Active");
}

export function canPauseNexoraObject(
  state: NexoraObjectState,
): NexoraObjectTransitionGuardResult {
  return guardLifecycleTransition(state, "Paused", ["Active"]);
}

export function canResumeNexoraObject(
  state: NexoraObjectState,
): NexoraObjectTransitionGuardResult {
  return guardLifecycleTransition(state, "Active", ["Paused"]);
}

export function canArchiveNexoraObject(
  state: NexoraObjectState,
): NexoraObjectTransitionGuardResult {
  return guardLifecycleTransition(state, "Archived", ["Active", "Paused"]);
}

export function canRestoreNexoraObject(
  state: NexoraObjectState,
): NexoraObjectTransitionGuardResult {
  return guardLifecycleTransition(state, "Active", ["Archived"]);
}

export function canDeleteNexoraObject(
  state: NexoraObjectState,
  context: NexoraObjectTransitionContext,
  reason: string | null,
): NexoraObjectTransitionGuardResult {
  if (state.lifecycle === "Deleted") return allow();
  if (!reason) {
    return deny(
      "TRANSITION_REASON_REQUIRED",
      "Delete requires a reason (context.reason or payload.reason).",
    );
  }
  if (!state.runtime.locked && !isSystemAuthorized(context)) {
    return deny(
      "TRANSITION_POLICY_REJECTED",
      "Delete requires the object to be locked first, or an authorized System mutation.",
    );
  }
  return allow();
}

export function canSetNexoraObjectStatus(
  state: NexoraObjectState,
  status: NexoraObjectStatus,
  context: NexoraObjectTransitionContext,
): NexoraObjectTransitionGuardResult {
  if (!isNexoraObjectStatus(status)) {
    return deny("TRANSITION_INVALID_STATUS", `Unsupported status: ${status}`);
  }
  if (state.status === status) return allow();
  if (!canTransitionStatus(state.status, status)) {
    return deny(
      "TRANSITION_INVALID_STATUS",
      `Status ${state.status} → ${status} is not permitted.`,
    );
  }
  if (state.lifecycle === "Deleted") {
    if (status !== "Black" || !isSystemAuthorized(context)) {
      return deny(
        "TRANSITION_OBJECT_DELETED",
        "Deleted objects only retain their status or accept SetBlack from an authorized System mutation.",
      );
    }
  }
  return allow();
}

export function canApplyNexoraObjectRuntimeTransition(
  state: NexoraObjectState,
  type: NexoraObjectRuntimeTransitionType,
): NexoraObjectTransitionGuardResult {
  if (state.lifecycle === "Deleted") {
    return deny(
      "TRANSITION_OBJECT_DELETED",
      `Deleted objects cannot accept runtime transition ${type}.`,
    );
  }
  if (
    state.lifecycle === "Archived" &&
    (type === "PrepareExecution" ||
      type === "StartExecution" ||
      type === "ResumeExecution")
  ) {
    return deny(
      "TRANSITION_OBJECT_ARCHIVED",
      `Archived objects cannot accept runtime transition ${type}.`,
    );
  }
  return allow();
}

export function canSetNexoraObjectVisualization(
  state: NexoraObjectState,
  patch: NexoraObjectVisualizationPatch,
  context: NexoraObjectTransitionContext,
): NexoraObjectTransitionGuardResult {
  const validation = validateVisualizationPatch(patch);
  if (!validation.ok) {
    return deny("TRANSITION_INVALID_VISUALIZATION", validation.errors.join("; "));
  }
  if (state.lifecycle === "Deleted") {
    return deny(
      "TRANSITION_OBJECT_DELETED",
      "Deleted objects reject visualization changes outside authorized replay restoration.",
    );
  }
  void context;
  return allow();
}

export function canSetNexoraObjectExecutiveState(
  state: NexoraObjectState,
  patch: NexoraObjectExecutivePatch,
  context: NexoraObjectTransitionContext,
): NexoraObjectTransitionGuardResult {
  const validation = validateExecutivePatch(patch);
  if (!validation.ok) {
    return deny("TRANSITION_INVALID_EXECUTIVE", validation.errors.join("; "));
  }
  if (state.lifecycle === "Deleted") {
    return deny(
      "TRANSITION_OBJECT_DELETED",
      "Deleted objects reject executive state changes.",
    );
  }
  void context;
  return allow();
}

function validateVisualizationPatch(
  patch: NexoraObjectVisualizationPatch | undefined,
): NexoraObjectStateValidationResult {
  const errors: string[] = [];
  if (!patch || typeof patch !== "object") {
    return Object.freeze({
      ok: false,
      errors: Object.freeze(["visualization patch must be an object"]),
    });
  }

  const allowed = NEXORA_OBJECT_VISUALIZATION_PATCH_FIELDS as readonly string[];
  for (const key of Object.keys(patch)) {
    if (!allowed.includes(key)) {
      errors.push(`visualization field “${key}” is not writable by the engine`);
    }
  }

  for (const key of ["position", "scale", "rotation"] as const) {
    const value = patch[key];
    if (value === undefined) continue;
    if (!isVector3(value)) {
      errors.push(`visualization.${key} must be three finite numbers`);
    }
  }
  if (patch.opacity !== undefined) {
    if (!isFiniteNumber(patch.opacity)) {
      errors.push("visualization.opacity must be a finite number");
    } else if (patch.opacity < 0 || patch.opacity > 1) {
      errors.push("visualization.opacity must be within [0, 1]");
    }
  }
  for (const key of ["priority", "cameraWeight"] as const) {
    const value = patch[key];
    if (value === undefined) continue;
    if (!isFiniteNumber(value)) {
      errors.push(`visualization.${key} must be a finite number`);
    }
  }
  for (const key of ["animationState", "badgeState"] as const) {
    const value = patch[key];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      errors.push(`visualization.${key} must be a string`);
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

function validateExecutivePatch(
  patch: NexoraObjectExecutivePatch | undefined,
): NexoraObjectStateValidationResult {
  const errors: string[] = [];
  if (!patch || typeof patch !== "object") {
    return Object.freeze({
      ok: false,
      errors: Object.freeze(["executive patch must be an object"]),
    });
  }

  const allowed = NEXORA_OBJECT_EXECUTIVE_PATCH_FIELDS as readonly string[];
  for (const key of Object.keys(patch)) {
    if (!allowed.includes(key)) {
      errors.push(`executive field “${key}” is not writable by the engine`);
    }
  }

  for (const field of NEXORA_OBJECT_EXECUTIVE_PATCH_FIELDS) {
    const value = patch[field];
    if (value === undefined) continue;
    if (!isFiniteNumber(value)) {
      errors.push(`executive.${field} must be a finite number`);
      continue;
    }
    if (value < NEXORA_OBJECT_EXECUTIVE_MIN || value > NEXORA_OBJECT_EXECUTIVE_MAX) {
      errors.push(
        `executive.${field} must be within [${NEXORA_OBJECT_EXECUTIVE_MIN}, ${NEXORA_OBJECT_EXECUTIVE_MAX}]`,
      );
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

function countPatchFields(patch: Readonly<Record<string, unknown>>): number {
  return Object.keys(patch).filter((key) => patch[key] !== undefined).length;
}

// ─── Runtime bridge (dry projection without committing) ─────────────────────

function pushRuntimeState(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  state: NexoraObjectRuntimeState,
): void {
  hydrateNexoraObjectRuntimeState(
    object,
    {
      selected: state.selected,
      focused: state.focused,
      visible: state.visible,
      highlighted: state.highlighted,
      locked: state.locked,
      dirty: state.dirty,
      loading: state.loading,
      executing: state.executing,
      executionState: state.executionState,
      runtimeRevision: state.runtimeRevision,
      updatedAt: state.updatedAt,
    },
    { updatedAt: state.updatedAt },
  );
}

/**
 * Temporarily install a virtual runtime state so NOL-1:3 can compute a
 * `commit: false` projection against it, then restore the previous entry.
 */
function withVirtualRuntimeState<T>(
  object: MutableNexoraObject,
  virtual: NexoraObjectRuntimeState,
  run: () => T,
): T {
  const deps = toRuntimeDependencies(
    defaultNexoraObjectStateTransitionDependencies,
  );
  const saved = getNexoraObjectRuntimeState(object, deps);
  const mustSwap = saved !== virtual;
  if (mustSwap) pushRuntimeState(object, virtual);
  try {
    return run();
  } finally {
    if (mustSwap) pushRuntimeState(object, saved);
  }
}

function mapRuntimeErrorCode(
  code: NexoraObjectRuntimeError["code"],
): NexoraObjectStateTransitionErrorCode {
  switch (code) {
    case "RUNTIME_OBJECT_DELETED":
      return "TRANSITION_OBJECT_DELETED";
    case "RUNTIME_OBJECT_ARCHIVED":
      return "TRANSITION_OBJECT_ARCHIVED";
    case "RUNTIME_OBJECT_LOCKED":
      return "TRANSITION_OBJECT_LOCKED";
    case "RUNTIME_UNAUTHORIZED_SYSTEM_MUTATION":
      return "TRANSITION_UNAUTHORIZED_SYSTEM_MUTATION";
    case "RUNTIME_INVALID_EXECUTION_TRANSITION":
      return "TRANSITION_INVALID_EXECUTION";
    case "RUNTIME_INVARIANT_VIOLATION":
      return "TRANSITION_INVARIANT_VIOLATION";
    case "RUNTIME_OBJECT_NOT_FOUND":
      return "TRANSITION_OBJECT_NOT_FOUND";
    case "RUNTIME_UNSUPPORTED_VERSION":
      return "TRANSITION_UNSUPPORTED_VERSION";
    case "RUNTIME_OBJECT_HIDDEN":
    case "RUNTIME_OBJECT_LOADING":
    case "RUNTIME_INVALID_INTERACTION_TRANSITION":
    case "RUNTIME_DUPLICATE_OBJECT_ID":
    default:
      return "TRANSITION_INVALID_RUNTIME";
  }
}

function fromRuntimeError(
  runtimeError: NexoraObjectRuntimeError,
  objectId: string,
  transitionType: NexoraObjectTransitionType,
  transitionId: string,
): NexoraObjectStateTransitionError {
  return err(
    mapRuntimeErrorCode(runtimeError.code),
    runtimeError.message,
    objectId,
    transitionType,
    transitionId,
    {
      runtimeCode: runtimeError.code,
      runtimeMessage: runtimeError.message,
      runtimeCommandType: runtimeError.commandType,
      ...(runtimeError.details ?? {}),
    },
  );
}

function fromRuntimeException(
  cause: unknown,
  objectId: string,
  transitionType: NexoraObjectTransitionType,
  transitionId: string,
  commandType?: NexoraObjectRuntimeCommand["type"],
): NexoraObjectStateTransitionError {
  const runtimeCode =
    cause && typeof cause === "object" && "code" in cause
      ? String((cause as { readonly code: unknown }).code)
      : undefined;
  const message =
    cause instanceof Error ? cause.message : "Runtime transition failed.";
  const code: NexoraObjectStateTransitionErrorCode = runtimeCode
    ? mapRuntimeErrorCode(runtimeCode as NexoraObjectRuntimeError["code"])
    : "TRANSITION_INVALID_RUNTIME";
  return err(code, message, objectId, transitionType, transitionId, {
    runtimeCode: runtimeCode ?? null,
    runtimeMessage: message,
    runtimeCommandType: commandType,
  });
}

/**
 * NOL-1:2 rejects every mutation on a Deleted object, so contract setters can
 * still throw for effects the engine considered admissible (authorized SetBlack
 * on a Deleted object, for example). Translate those into engine error codes.
 */
function fromContractException(
  cause: unknown,
  objectId: string,
  transitionType: NexoraObjectTransitionType,
  transitionId: string,
  effectKind: NexoraObjectTransitionEffectKind,
  lifecycle: NexoraObjectLifecycle,
): NexoraObjectStateTransitionError {
  const contractCode =
    cause && typeof cause === "object" && "code" in cause
      ? String((cause as { readonly code: unknown }).code)
      : null;
  const message =
    cause instanceof Error ? cause.message : "Contract mutation failed.";

  let code: NexoraObjectStateTransitionErrorCode;
  if (lifecycle === "Deleted" || contractCode === "READ_ONLY") {
    code = "TRANSITION_OBJECT_DELETED";
  } else {
    switch (contractCode) {
      case "INVALID_STATUS":
      case "INVALID_STATUS_TRANSITION":
        code = "TRANSITION_INVALID_STATUS";
        break;
      case "INVALID_LIFECYCLE":
      case "INVALID_LIFECYCLE_RULE":
        code = "TRANSITION_INVALID_LIFECYCLE";
        break;
      case "EXECUTION_FORBIDDEN":
        code = "TRANSITION_INVALID_EXECUTION";
        break;
      default:
        code = "TRANSITION_INVARIANT_VIOLATION";
        break;
    }
  }

  return err(code, message, objectId, transitionType, transitionId, {
    contractCode,
    contractMessage: message,
    effectKind,
    lifecycle,
  });
}

// ─── Effect projection ──────────────────────────────────────────────────────

type EffectProjection = {
  readonly state: NexoraObjectState;
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
};

const DELETED_SAFE_RUNTIME_COMMANDS: readonly NexoraObjectRuntimeCommand["type"][] =
  Object.freeze(["Lock"] as const);

function projectTransitionEffects(
  object: MutableNexoraObject,
  baseState: NexoraObjectState,
  effects: readonly NexoraObjectTransitionEffect[],
  context: NexoraObjectTransitionContext,
  deps: NexoraObjectStateTransitionDependencies,
  transitionId: string,
  transitionType: NexoraObjectTransitionType,
): EffectProjection {
  const objectId = baseState.objectId;
  const errors: NexoraObjectStateTransitionError[] = [];
  const warnings: string[] = [];
  let state = baseState;

  for (const effect of effects) {
    switch (effect.kind) {
      case "SetLifecycle": {
        state = freezeState({ ...state, lifecycle: effect.lifecycle });
        break;
      }
      case "SetStatus": {
        state = freezeState({
          ...state,
          status: effect.status,
          visualization: {
            ...state.visualization,
            colorState: effect.status,
          },
        });
        break;
      }
      case "SetVisualization": {
        const patch = effect.patch;
        state = freezeState({
          ...state,
          visualization: {
            ...state.visualization,
            ...(patch.position !== undefined
              ? { position: freezeVector(patch.position) }
              : {}),
            ...(patch.scale !== undefined
              ? { scale: freezeVector(patch.scale) }
              : {}),
            ...(patch.rotation !== undefined
              ? { rotation: freezeVector(patch.rotation) }
              : {}),
            ...(patch.opacity !== undefined ? { opacity: patch.opacity } : {}),
            ...(patch.animationState !== undefined
              ? { animationState: patch.animationState }
              : {}),
            ...(patch.badgeState !== undefined
              ? { badgeState: patch.badgeState }
              : {}),
            ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
            ...(patch.cameraWeight !== undefined
              ? { cameraWeight: patch.cameraWeight }
              : {}),
          },
        });
        break;
      }
      case "SetExecutiveState": {
        state = freezeState({ ...state, executive: { ...effect.patch } });
        break;
      }
      case "AddWarning": {
        warnings.push(effect.message);
        break;
      }
      case "EmitEvent": {
        break;
      }
      case "ApplyRuntimeCommand": {
        const command = effect.command;

        if (
          state.lifecycle === "Deleted" &&
          !DELETED_SAFE_RUNTIME_COMMANDS.includes(command.type)
        ) {
          errors.push(
            err(
              "TRANSITION_OBJECT_DELETED",
              `Runtime command ${command.type} cannot run against a Deleted object.`,
              objectId,
              transitionType,
              transitionId,
              { runtimeCommandType: command.type },
            ),
          );
          break;
        }
        if (
          state.lifecycle === "Archived" &&
          (command.type === "PrepareExecution" ||
            command.type === "StartExecution" ||
            command.type === "ResumeExecution")
        ) {
          errors.push(
            err(
              "TRANSITION_OBJECT_ARCHIVED",
              `Runtime command ${command.type} cannot run against an Archived object.`,
              objectId,
              transitionType,
              transitionId,
              { runtimeCommandType: command.type },
            ),
          );
          break;
        }

        const runtimeContext = toRuntimeContext(context, effect.elevated === true);
        let projected: NexoraObjectRuntimeState | null = null;
        try {
          const result = withVirtualRuntimeState(object, state.runtime, () =>
            applyNexoraObjectRuntimeCommand(
              object,
              command,
              runtimeContext,
              toRuntimeDependencies(deps),
              { commit: false },
            ),
          );
          if (!result.accepted) {
            for (const runtimeError of result.errors) {
              errors.push(
                fromRuntimeError(
                  runtimeError,
                  objectId,
                  transitionType,
                  transitionId,
                ),
              );
            }
            break;
          }
          if (
            state.lifecycle === "Deleted" &&
            result.changed &&
            !DELETED_SAFE_RUNTIME_COMMANDS.includes(command.type)
          ) {
            errors.push(
              err(
                "TRANSITION_OBJECT_DELETED",
                `Runtime command ${command.type} would mutate a Deleted object.`,
                objectId,
                transitionType,
                transitionId,
                { runtimeCommandType: command.type },
              ),
            );
            break;
          }
          projected = result.nextState;
        } catch (cause) {
          errors.push(
            fromRuntimeException(
              cause,
              objectId,
              transitionType,
              transitionId,
              command.type,
            ),
          );
          break;
        }

        if (projected) {
          state = freezeState({
            ...state,
            runtime: projected,
            updatedAt: projected.updatedAt,
          });
        }
        break;
      }
      default: {
        const exhaustive: never = effect;
        void exhaustive;
        break;
      }
    }
  }

  return Object.freeze({
    state,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

// ─── Base transition computation ────────────────────────────────────────────

type BaseComputation = {
  readonly noOp: boolean;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
};

function baseResult(
  partial: Partial<BaseComputation>,
): BaseComputation {
  return Object.freeze({
    noOp: partial.noOp ?? false,
    effects: Object.freeze([...(partial.effects ?? [])]),
    errors: Object.freeze([...(partial.errors ?? [])]),
    warnings: Object.freeze([...(partial.warnings ?? [])]),
  });
}

function guardToBase(
  guard: NexoraObjectTransitionGuardResult,
  objectId: string,
  transitionType: NexoraObjectTransitionType,
  transitionId: string,
  fallbackCode: NexoraObjectStateTransitionErrorCode,
): BaseComputation | null {
  if (guard.allowed) return null;
  return baseResult({
    errors: [
      err(
        guard.code ?? fallbackCode,
        guard.message ?? "Transition rejected.",
        objectId,
        transitionType,
        transitionId,
      ),
    ],
  });
}

function computeBaseTransition(
  state: NexoraObjectState,
  request: NexoraObjectTransitionRequest,
  definition: NexoraObjectTransitionDefinition,
  context: NexoraObjectTransitionContext,
  reason: string | null,
  transitionId: string,
): BaseComputation {
  const objectId = state.objectId;
  const type = request.type;

  switch (definition.category) {
    case "Lifecycle": {
      const target = definition.targetLifecycle;
      if (!target) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_UNSUPPORTED_TYPE",
              `Lifecycle transition ${type} has no target lifecycle.`,
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }

      let guard: NexoraObjectTransitionGuardResult;
      switch (type as NexoraObjectLifecycleTransitionType) {
        case "Activate":
          guard = canActivateNexoraObject(state);
          break;
        case "Pause":
          guard = canPauseNexoraObject(state);
          break;
        case "Resume":
          guard = canResumeNexoraObject(state);
          break;
        case "Archive":
          guard = canArchiveNexoraObject(state);
          break;
        case "Restore":
          guard = canRestoreNexoraObject(state);
          break;
        case "Delete":
          guard = canDeleteNexoraObject(state, context, reason);
          break;
        default:
          guard = deny(
            "TRANSITION_UNSUPPORTED_TYPE",
            `Unsupported lifecycle transition: ${type}`,
          );
          break;
      }

      const rejection = guardToBase(
        guard,
        objectId,
        type,
        transitionId,
        "TRANSITION_INVALID_LIFECYCLE",
      );
      if (rejection) return rejection;

      if (state.lifecycle === target) {
        return baseResult({ noOp: true });
      }

      return baseResult({
        effects: [{ kind: "SetLifecycle", lifecycle: target }],
      });
    }

    case "Status": {
      const target = definition.targetStatus;
      if (!target) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_UNSUPPORTED_TYPE",
              `Status transition ${type} has no target status.`,
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      if (state.status === target) {
        return baseResult({ noOp: true });
      }
      const rejection = guardToBase(
        canSetNexoraObjectStatus(state, target, context),
        objectId,
        type,
        transitionId,
        "TRANSITION_INVALID_STATUS",
      );
      if (rejection) return rejection;

      return baseResult({ effects: [{ kind: "SetStatus", status: target }] });
    }

    case "Runtime": {
      const commandType = definition.runtimeCommandType;
      if (!commandType) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_UNSUPPORTED_TYPE",
              `Runtime transition ${type} has no runtime command.`,
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      const rejection = guardToBase(
        canApplyNexoraObjectRuntimeTransition(
          state,
          type as NexoraObjectRuntimeTransitionType,
        ),
        objectId,
        type,
        transitionId,
        "TRANSITION_INVALID_RUNTIME",
      );
      if (rejection) return rejection;

      const command: NexoraObjectRuntimeCommand =
        commandType === "FailExecution" || commandType === "CancelExecution"
          ? { type: commandType, reason: reason ?? undefined }
          : ({ type: commandType } as NexoraObjectRuntimeCommand);

      return baseResult({
        effects: [{ kind: "ApplyRuntimeCommand", command }],
      });
    }

    case "Visualization": {
      const patch = request.payload?.visualization;
      if (patch === undefined) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_INVALID_PAYLOAD",
              "SetVisualization requires payload.visualization.",
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      const validation = validateVisualizationPatch(patch);
      if (!validation.ok) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_INVALID_VISUALIZATION",
              validation.errors.join("; "),
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      if (countPatchFields(patch as Readonly<Record<string, unknown>>) === 0) {
        return baseResult({ noOp: true });
      }
      if (state.lifecycle === "Deleted") {
        const replayRestoration = request.payload?.replayRestoration === true;
        if (!isSystemAuthorized(context) || !replayRestoration) {
          return baseResult({
            errors: [
              err(
                "TRANSITION_OBJECT_DELETED",
                "Deleted objects only accept visualization changes from an authorized System replay restoration.",
                objectId,
                type,
                transitionId,
              ),
            ],
          });
        }
      }
      return baseResult({ effects: [{ kind: "SetVisualization", patch }] });
    }

    case "Executive": {
      const patch = request.payload?.executive;
      if (patch === undefined) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_INVALID_PAYLOAD",
              "SetExecutiveState requires payload.executive.",
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      const validation = validateExecutivePatch(patch);
      if (!validation.ok) {
        return baseResult({
          errors: [
            err(
              "TRANSITION_INVALID_EXECUTIVE",
              validation.errors.join("; "),
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      if (countPatchFields(patch as Readonly<Record<string, unknown>>) === 0) {
        return baseResult({ noOp: true });
      }
      if (state.lifecycle === "Deleted") {
        return baseResult({
          errors: [
            err(
              "TRANSITION_OBJECT_DELETED",
              "Deleted objects reject executive state changes.",
              objectId,
              type,
              transitionId,
            ),
          ],
        });
      }
      // Always emit a complete facet — the contract setter overwrites all six.
      const merged: NexoraObjectStateExecutive = {
        importance: patch.importance ?? state.executive.importance,
        urgency: patch.urgency ?? state.executive.urgency,
        priority: patch.priority ?? state.executive.priority,
        attentionScore: patch.attentionScore ?? state.executive.attentionScore,
        impactScore: patch.impactScore ?? state.executive.impactScore,
        confidence: patch.confidence ?? state.executive.confidence,
      };
      return baseResult({
        effects: [{ kind: "SetExecutiveState", patch: merged }],
      });
    }

    case "Composite":
    default: {
      return baseResult({
        errors: [
          err(
            "TRANSITION_UNSUPPORTED_TYPE",
            `Transition ${type} is not handled by the base computation.`,
            objectId,
            type,
            transitionId,
          ),
        ],
      });
    }
  }
}

// ─── Default policies ───────────────────────────────────────────────────────

function runtimeEffect(
  command: NexoraObjectRuntimeCommand,
): NexoraObjectTransitionEffect {
  return Object.freeze({
    kind: "ApplyRuntimeCommand" as const,
    command,
    elevated: true,
  });
}

export const nexoraObjectPauseExecutionPolicy: NexoraObjectTransitionPolicy =
  Object.freeze({
    id: "pause-execution",
    description:
      "Pausing a lifecycle pauses a running execution; Preparing requires an authorized System mutation.",
    appliesTo: Object.freeze(["Pause"] as const),
    evaluate: ({ state, context, objectId, request }) => {
      const execution = state.runtime.executionState;
      if (execution === "Running") {
        return Object.freeze({
          prependEffects: Object.freeze([
            runtimeEffect({ type: "PauseExecution" }),
          ]),
        });
      }
      if (execution === "Preparing") {
        if (!isSystemAuthorized(context)) {
          return Object.freeze({
            rejected: true,
            errors: Object.freeze([
              err(
                "TRANSITION_INVALID_EXECUTION",
                "Cannot pause while execution is Preparing without an authorized System mutation.",
                objectId,
                request.type,
                request.transitionId,
                { executionState: execution },
              ),
            ]),
          });
        }
        return Object.freeze({
          warnings: Object.freeze([
            "Lifecycle paused while execution was Preparing.",
          ]),
        });
      }
      return Object.freeze({});
    },
  });

export const nexoraObjectArchiveExecutionPolicy: NexoraObjectTransitionPolicy =
  Object.freeze({
    id: "archive-execution",
    description:
      "Archiving requires an inactive execution and clears interaction focus for non-Timeline sources.",
    appliesTo: Object.freeze(["Archive"] as const),
    evaluate: ({ state, context, objectId, request, reason }) => {
      const execution = state.runtime.executionState;
      const prependEffects: NexoraObjectTransitionEffect[] = [];
      const warnings: string[] = [];

      if (isActiveExecution(execution)) {
        if (!isSystemAuthorized(context)) {
          return Object.freeze({
            rejected: true,
            errors: Object.freeze([
              err(
                "TRANSITION_INVALID_EXECUTION",
                `Archive rejected while execution is ${execution}; cancel the execution or use an authorized System mutation.`,
                objectId,
                request.type,
                request.transitionId,
                { executionState: execution },
              ),
            ]),
          });
        }
        prependEffects.push(
          runtimeEffect({
            type: "CancelExecution",
            reason: reason ?? "Execution cancelled to archive the object.",
          }),
        );
        warnings.push(
          `Execution cancelled from ${execution} to allow archiving.`,
        );
      }

      if (context.source !== "Timeline" && context.source !== "System") {
        prependEffects.push(runtimeEffect({ type: "Blur" }));
        prependEffects.push(runtimeEffect({ type: "Deselect" }));
      }

      return Object.freeze({
        prependEffects: Object.freeze(prependEffects),
        warnings: Object.freeze(warnings),
      });
    },
  });

export const nexoraObjectDeletePolicy: NexoraObjectTransitionPolicy =
  Object.freeze({
    id: "delete-policy",
    description:
      "Delete requires a reason and a locked object (or authorized System mutation), and always cleans runtime state first.",
    appliesTo: Object.freeze(["Delete"] as const),
    evaluate: ({ state, context, objectId, request, reason }) => {
      if (!reason) {
        return Object.freeze({
          rejected: true,
          errors: Object.freeze([
            err(
              "TRANSITION_REASON_REQUIRED",
              "Delete requires a reason (context.reason or payload.reason).",
              objectId,
              request.type,
              request.transitionId,
            ),
          ]),
        });
      }
      if (!state.runtime.locked && !isSystemAuthorized(context)) {
        return Object.freeze({
          rejected: true,
          errors: Object.freeze([
            err(
              "TRANSITION_POLICY_REJECTED",
              "Delete requires the object to be locked first; only an authorized System mutation may delete an unlocked object.",
              objectId,
              request.type,
              request.transitionId,
              { locked: state.runtime.locked },
            ),
          ]),
        });
      }

      const prependEffects: NexoraObjectTransitionEffect[] = [];
      if (isActiveExecution(state.runtime.executionState)) {
        prependEffects.push(
          runtimeEffect({ type: "CancelExecution", reason }),
        );
      }
      prependEffects.push(runtimeEffect({ type: "Deselect" }));
      prependEffects.push(runtimeEffect({ type: "ClearHighlight" }));
      prependEffects.push(runtimeEffect({ type: "StopLoading" }));
      prependEffects.push(runtimeEffect({ type: "Lock" }));

      return Object.freeze({ prependEffects: Object.freeze(prependEffects) });
    },
  });

export const nexoraObjectBlackStatusPolicy: NexoraObjectTransitionPolicy =
  Object.freeze({
    id: "black-status",
    description:
      "Black status locks the object; leaving Black never unlocks it. Deleted objects require an authorized System mutation.",
    appliesTo: Object.freeze(["SetBlack"] as const),
    evaluate: ({ state, context, objectId, request }) => {
      if (state.lifecycle === "Deleted" && !isSystemAuthorized(context)) {
        return Object.freeze({
          rejected: true,
          errors: Object.freeze([
            err(
              "TRANSITION_OBJECT_DELETED",
              "SetBlack on a Deleted object requires an authorized System mutation.",
              objectId,
              request.type,
              request.transitionId,
            ),
          ]),
        });
      }
      return Object.freeze({
        appendEffects: Object.freeze([runtimeEffect({ type: "Lock" })]),
      });
    },
  });

export const defaultNexoraObjectTransitionPolicies: readonly NexoraObjectTransitionPolicy[] =
  Object.freeze([
    nexoraObjectPauseExecutionPolicy,
    nexoraObjectArchiveExecutionPolicy,
    nexoraObjectDeletePolicy,
    nexoraObjectBlackStatusPolicy,
  ]);

type PolicyApplication = {
  readonly rejected: boolean;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
};

function applyPolicies(
  policies: readonly NexoraObjectTransitionPolicy[],
  input: NexoraObjectTransitionPolicyInput,
): PolicyApplication {
  const prepends: NexoraObjectTransitionEffect[] = [];
  const appends: NexoraObjectTransitionEffect[] = [];
  const errors: NexoraObjectStateTransitionError[] = [];
  const warnings: string[] = [];
  let rejected = false;

  for (const policy of policies) {
    if (!policy.appliesTo.includes(input.request.type)) continue;
    const outcome = policy.evaluate(input);
    if (outcome.warnings) warnings.push(...outcome.warnings);
    if (outcome.errors) errors.push(...outcome.errors);
    if (outcome.rejected || (outcome.errors && outcome.errors.length > 0)) {
      rejected = true;
      continue;
    }
    if (outcome.prependEffects) prepends.push(...outcome.prependEffects);
    if (outcome.appendEffects) appends.push(...outcome.appendEffects);
  }

  return Object.freeze({
    rejected,
    effects: Object.freeze([...prepends, ...input.effects, ...appends]),
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

// ─── Evaluation ─────────────────────────────────────────────────────────────

type PlanInput = {
  readonly transitionId: string;
  readonly type: NexoraObjectTransitionType;
  readonly objectId: string;
  readonly accepted: boolean;
  readonly noOp: boolean;
  readonly dryRun: boolean;
  readonly previousState: NexoraObjectState;
  readonly projectedState: NexoraObjectState;
  readonly effects: readonly NexoraObjectTransitionEffect[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly warnings: readonly string[];
  readonly childTransitionIds: readonly string[];
  readonly context: NexoraObjectTransitionContext;
  readonly correlationId: string;
  readonly occurredAt: string;
};

function makePlan(input: PlanInput): NexoraObjectTransitionPlan {
  return Object.freeze({
    transitionId: input.transitionId,
    type: input.type,
    objectId: input.objectId,
    accepted: input.accepted,
    noOp: input.noOp,
    dryRun: input.dryRun,
    previousState: input.previousState,
    projectedState: input.projectedState,
    effects: Object.freeze([...input.effects]),
    errors: Object.freeze([...input.errors]),
    warnings: Object.freeze([...input.warnings]),
    childTransitionIds: Object.freeze([...input.childTransitionIds]),
    context: input.context,
    correlationId: input.correlationId,
    causationId: input.context.causationId,
    source: input.context.source,
    occurredAt: input.occurredAt,
  });
}

function evaluateAgainstState(
  object: MutableNexoraObject,
  state: NexoraObjectState,
  request: NexoraObjectTransitionRequest,
  deps: NexoraObjectStateTransitionDependencies,
  registry: NexoraObjectTransitionRegistry,
  policies: readonly NexoraObjectTransitionPolicy[],
  explicitCorrelationId: string | undefined,
  depth: number,
  inheritedContext?: NexoraObjectTransitionContext,
): NexoraObjectTransitionPlan {
  const objectId = state.objectId;
  const transitionId = resolveTransitionId(request, deps);
  const baseContext = resolveContext(request, inheritedContext);
  const correlationId =
    explicitCorrelationId ?? baseContext.correlationId ?? transitionId;
  const context: NexoraObjectTransitionContext = Object.freeze({
    ...baseContext,
    correlationId,
  });
  const occurredAt = context.occurredAt ?? deps.now();
  const dryRun = request.dryRun === true;
  const reason = resolveReason(request, context);

  const common = {
    transitionId,
    type: request.type,
    objectId,
    dryRun,
    previousState: state,
    context,
    correlationId,
    occurredAt,
  } as const;

  const rejectPlan = (
    errors: readonly NexoraObjectStateTransitionError[],
    warnings: readonly string[] = [],
    childTransitionIds: readonly string[] = [],
  ): NexoraObjectTransitionPlan =>
    makePlan({
      ...common,
      accepted: false,
      noOp: false,
      projectedState: state,
      effects: [],
      errors,
      warnings,
      childTransitionIds,
    });

  if (
    !(NEXORA_OBJECT_STATE_TRANSITION_TYPES as readonly string[]).includes(
      request.type,
    )
  ) {
    return rejectPlan([
      err(
        "TRANSITION_UNSUPPORTED_TYPE",
        `Unsupported transition type: ${String(request.type)}`,
        objectId,
        request.type,
        transitionId,
      ),
    ]);
  }

  const definition = getNexoraObjectTransitionDefinition(request.type, registry);
  if (!definition) {
    return rejectPlan([
      err(
        "TRANSITION_UNSUPPORTED_TYPE",
        `Transition ${request.type} is not registered.`,
        objectId,
        request.type,
        transitionId,
      ),
    ]);
  }

  if (
    request.expectedStateRevision !== undefined &&
    request.expectedStateRevision !== state.stateRevision
  ) {
    return rejectPlan([
      err(
        "TRANSITION_STATE_REVISION_CONFLICT",
        `Expected state revision ${request.expectedStateRevision}, found ${state.stateRevision}.`,
        objectId,
        request.type,
        transitionId,
        {
          expectedStateRevision: request.expectedStateRevision,
          actualStateRevision: state.stateRevision,
        },
      ),
    ]);
  }

  let effects: readonly NexoraObjectTransitionEffect[] = [];
  let warnings: readonly string[] = [];
  let childTransitionIds: readonly string[] = [];
  let noOp = false;

  if (definition.category === "Composite") {
    if (depth > 0) {
      return rejectPlan([
        err(
          "TRANSITION_NESTED_COMPOSITE",
          "Composite transitions cannot be nested.",
          objectId,
          request.type,
          transitionId,
        ),
      ]);
    }

    const nested = request.payload?.transitions ?? [];
    if (nested.length === 0) {
      return rejectPlan([
        err(
          "TRANSITION_EMPTY_COMPOSITE",
          "Composite transitions require payload.transitions with at least one entry.",
          objectId,
          request.type,
          transitionId,
        ),
      ]);
    }

    const childIds: string[] = [];
    const childEffects: NexoraObjectTransitionEffect[] = [];
    const childWarnings: string[] = [];
    const childErrors: NexoraObjectStateTransitionError[] = [];
    let virtual = state;
    let allNoOp = true;

    for (const child of nested) {
      if (child.type === "Composite") {
        childErrors.push(
          err(
            "TRANSITION_NESTED_COMPOSITE",
            "Composite transitions cannot be nested.",
            objectId,
            request.type,
            transitionId,
          ),
        );
        break;
      }
      const childPlan = evaluateAgainstState(
        object,
        virtual,
        child,
        deps,
        registry,
        policies,
        correlationId,
        depth + 1,
        context,
      );
      childIds.push(childPlan.transitionId);
      childWarnings.push(...childPlan.warnings);
      if (!childPlan.accepted) {
        childErrors.push(...childPlan.errors);
        break;
      }
      if (!childPlan.noOp) {
        allNoOp = false;
        childEffects.push(...childPlan.effects);
        virtual = childPlan.projectedState;
      }
    }

    if (childErrors.length > 0) {
      return rejectPlan(childErrors, childWarnings, childIds);
    }

    effects = Object.freeze(childEffects);
    warnings = Object.freeze(childWarnings);
    childTransitionIds = Object.freeze(childIds);
    noOp = allNoOp;
  } else {
    const base = computeBaseTransition(
      state,
      request,
      definition,
      context,
      reason,
      transitionId,
    );
    if (base.errors.length > 0) {
      return rejectPlan(base.errors, base.warnings);
    }
    if (base.noOp) {
      return makePlan({
        ...common,
        accepted: true,
        noOp: true,
        projectedState: state,
        effects: [],
        errors: [],
        warnings: base.warnings,
        childTransitionIds: [],
      });
    }

    const policyApplication = applyPolicies(policies, {
      objectId,
      state,
      request: Object.freeze({ ...request, transitionId }),
      definition,
      context,
      effects: base.effects,
      reason,
    });

    if (policyApplication.rejected) {
      return rejectPlan(policyApplication.errors, [
        ...base.warnings,
        ...policyApplication.warnings,
      ]);
    }

    effects = policyApplication.effects;
    warnings = Object.freeze([
      ...base.warnings,
      ...policyApplication.warnings,
    ]);
  }

  const projection = projectTransitionEffects(
    object,
    state,
    effects,
    context,
    deps,
    transitionId,
    request.type,
  );

  const allWarnings = Object.freeze([...warnings, ...projection.warnings]);

  if (projection.errors.length > 0) {
    return rejectPlan(projection.errors, allWarnings, childTransitionIds);
  }

  const invariants = validateNexoraObjectState(projection.state);
  if (!invariants.ok) {
    return rejectPlan(
      [
        err(
          "TRANSITION_INVARIANT_VIOLATION",
          invariants.errors.join("; "),
          objectId,
          request.type,
          transitionId,
          { invariantErrors: Object.freeze([...invariants.errors]) },
        ),
      ],
      allWarnings,
      childTransitionIds,
    );
  }

  const effectivelyNoOp =
    noOp || stateFingerprint(projection.state) === stateFingerprint(state);

  return makePlan({
    ...common,
    accepted: true,
    noOp: effectivelyNoOp,
    projectedState: effectivelyNoOp ? state : projection.state,
    effects: effectivelyNoOp ? [] : effects,
    errors: [],
    warnings: allWarnings,
    childTransitionIds,
  });
}

/**
 * Calculate the full effect set and projected state for a transition.
 * Never mutates the object, the runtime store or the engine revision store.
 */
export function evaluateNexoraObjectTransition(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  request: NexoraObjectTransitionRequest,
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionEvaluationOptions,
): NexoraObjectTransitionPlan {
  const d = resolveDeps(deps);
  const target = object as MutableNexoraObject;
  const state = options?.baseState ?? createNexoraObjectState(target, d);
  return evaluateAgainstState(
    target,
    state,
    request,
    d,
    options?.registry ?? defaultRegistry,
    options?.policies ?? defaultNexoraObjectTransitionPolicies,
    options?.correlationId,
    0,
    undefined,
  );
}

export function canApplyNexoraObjectTransition(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  request: NexoraObjectTransitionRequest,
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionEvaluationOptions,
): NexoraObjectTransitionGuardResult {
  const plan = evaluateNexoraObjectTransition(object, request, deps, options);
  if (plan.accepted) return allow();
  const first = plan.errors[0];
  return deny(
    first?.code ?? "TRANSITION_POLICY_REJECTED",
    first?.message ?? "Transition rejected.",
  );
}

// ─── Application ────────────────────────────────────────────────────────────

function makeStateEvent(
  type: NexoraObjectStateEventType,
  plan: NexoraObjectTransitionPlan,
  stateRevision: number,
  deps: NexoraObjectStateTransitionDependencies,
  payload: Readonly<Record<string, unknown>> = {},
): NexoraObjectStateEvent {
  return Object.freeze({
    eventId: deps.createEventId(),
    objectId: plan.objectId,
    type,
    occurredAt: plan.occurredAt,
    stateRevision,
    transitionId: plan.transitionId,
    transitionType: plan.type,
    source: plan.context.source,
    actorId: plan.context.actorId,
    correlationId: plan.correlationId,
    causationId: plan.context.causationId,
    payload: Object.freeze({ ...payload }),
  });
}

function makeResult(
  plan: NexoraObjectTransitionPlan,
  input: {
    readonly accepted: boolean;
    readonly changed: boolean;
    readonly noOp: boolean;
    readonly nextState: NexoraObjectState;
    readonly previousStateRevision: number;
    readonly nextStateRevision: number;
    readonly effects?: readonly NexoraObjectTransitionEffect[];
    readonly events?: readonly NexoraObjectStateEvent[];
    readonly errors?: readonly NexoraObjectStateTransitionError[];
    readonly warnings?: readonly string[];
  },
): NexoraObjectTransitionResult {
  return Object.freeze({
    transitionId: plan.transitionId,
    type: plan.type,
    objectId: plan.objectId,
    accepted: input.accepted,
    changed: input.changed,
    noOp: input.noOp,
    dryRun: plan.dryRun,
    previousState: plan.previousState,
    nextState: input.nextState,
    previousStateRevision: input.previousStateRevision,
    nextStateRevision: input.nextStateRevision,
    effects: Object.freeze([...(input.effects ?? plan.effects)]),
    events: Object.freeze([...(input.events ?? [])]),
    errors: Object.freeze([...(input.errors ?? plan.errors)]),
    warnings: Object.freeze([...(input.warnings ?? plan.warnings)]),
    childTransitionIds: plan.childTransitionIds,
    correlationId: plan.correlationId,
    causationId: plan.context.causationId,
    source: plan.context.source,
    actorId: plan.context.actorId,
    occurredAt: plan.occurredAt,
  });
}

function rejectedResult(
  plan: NexoraObjectTransitionPlan,
  deps: NexoraObjectStateTransitionDependencies,
  errors?: readonly NexoraObjectStateTransitionError[],
): NexoraObjectTransitionResult {
  const finalErrors = errors ?? plan.errors;
  const revision = plan.previousState.stateRevision;
  const events = deps.emitRejectedEvents
    ? [
        makeStateEvent("TransitionRejected", plan, revision, deps, {
          errorCodes: Object.freeze(finalErrors.map((e) => e.code)),
          messages: Object.freeze(finalErrors.map((e) => e.message)),
        }),
      ]
    : [];
  return makeResult(plan, {
    accepted: false,
    changed: false,
    noOp: false,
    nextState: plan.previousState,
    previousStateRevision: revision,
    nextStateRevision: revision,
    events,
    errors: finalErrors,
  });
}

/**
 * Evaluate, then apply the calculated effects atomically.
 * Rejected, dry-run and no-op transitions never mutate anything.
 */
export function applyNexoraObjectTransition(
  object: MutableNexoraObject,
  request: NexoraObjectTransitionRequest,
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionEvaluationOptions,
): NexoraObjectTransitionResult {
  const d = resolveDeps(deps);
  const plan = evaluateNexoraObjectTransition(object, request, d, options);
  const previousRevision = plan.previousState.stateRevision;

  if (!plan.accepted) {
    return rejectedResult(plan, d);
  }

  if (plan.dryRun) {
    return makeResult(plan, {
      accepted: true,
      changed: false,
      noOp: plan.noOp,
      nextState: plan.projectedState,
      previousStateRevision: previousRevision,
      nextStateRevision: previousRevision,
    });
  }

  if (plan.noOp) {
    return makeResult(plan, {
      accepted: true,
      changed: false,
      noOp: true,
      nextState: plan.previousState,
      previousStateRevision: previousRevision,
      nextStateRevision: previousRevision,
    });
  }

  const objectId = plan.objectId;
  const identityBefore = Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    createdAt: object.identity.createdAt,
    owner: object.identity.owner,
  });

  const runtimeDeps = toRuntimeDependencies(d);
  const emitted: { readonly type: NexoraObjectStateEventType; readonly payload: Readonly<Record<string, unknown>> }[] = [];
  const warnings: string[] = [...plan.warnings];
  let mutated = false;

  const fail = (
    error: NexoraObjectStateTransitionError,
  ): NexoraObjectTransitionResult => {
    if (mutated) {
      throw new NexoraObjectStateTransitionException(
        err(
          "TRANSITION_INVARIANT_VIOLATION",
          `Transition ${plan.type} failed after partial application: ${error.message}`,
          objectId,
          plan.type,
          plan.transitionId,
          { cause: error.code, causeMessage: error.message },
        ),
      );
    }
    return rejectedResult(plan, d, [error]);
  };

  for (const effect of plan.effects) {
    try {
      switch (effect.kind) {
        case "SetLifecycle": {
          const from = object.lifecycle;
          object.setLifecycle(effect.lifecycle);
          mutated = true;
          emitted.push({
            type: "LifecycleChanged",
            payload: Object.freeze({ from, to: effect.lifecycle }),
          });
          break;
        }
        case "SetStatus": {
          const from = object.status;
          object.setStatus(effect.status);
          mutated = true;
          emitted.push({
            type: "StatusChanged",
            payload: Object.freeze({ from, to: effect.status }),
          });
          break;
        }
        case "SetVisualization": {
          object.setVisualization(
            effect.patch as Partial<NexoraObjectVisualizationState>,
          );
          mutated = true;
          emitted.push({
            type: "VisualizationChanged",
            payload: Object.freeze({
              fields: Object.freeze(Object.keys(effect.patch)),
            }),
          });
          break;
        }
        case "SetExecutiveState": {
          object.setExecutive(effect.patch);
          mutated = true;
          emitted.push({
            type: "ExecutiveStateChanged",
            payload: Object.freeze({ ...effect.patch }),
          });
          break;
        }
        case "ApplyRuntimeCommand": {
          const runtimeResult = applyNexoraObjectRuntimeCommand(
            object,
            effect.command,
            toRuntimeContext(plan.context, effect.elevated === true),
            runtimeDeps,
          );
          if (!runtimeResult.accepted) {
            const runtimeError = runtimeResult.errors[0];
            return fail(
              runtimeError
                ? fromRuntimeError(
                    runtimeError,
                    objectId,
                    plan.type,
                    plan.transitionId,
                  )
                : err(
                    "TRANSITION_INVALID_RUNTIME",
                    `Runtime command ${effect.command.type} was rejected.`,
                    objectId,
                    plan.type,
                    plan.transitionId,
                  ),
            );
          }
          if (runtimeResult.changed) {
            mutated = true;
            emitted.push({
              type: "RuntimeChanged",
              payload: Object.freeze({
                commandType: effect.command.type,
                runtimeRevision: runtimeResult.nextState.runtimeRevision,
                interactionState: runtimeResult.nextState.interactionState,
                executionState: runtimeResult.nextState.executionState,
              }),
            });
          }
          break;
        }
        case "EmitEvent": {
          emitted.push({
            type: effect.eventType,
            payload: Object.freeze({ ...(effect.payload ?? {}) }),
          });
          break;
        }
        case "AddWarning": {
          warnings.push(effect.message);
          break;
        }
        default: {
          const exhaustive: never = effect;
          void exhaustive;
          break;
        }
      }
    } catch (cause) {
      return fail(
        effect.kind === "ApplyRuntimeCommand"
          ? fromRuntimeException(
              cause,
              objectId,
              plan.type,
              plan.transitionId,
              effect.command.type,
            )
          : fromContractException(
              cause,
              objectId,
              plan.type,
              plan.transitionId,
              effect.kind,
              object.lifecycle,
            ),
      );
    }
  }

  if (!mutated) {
    return makeResult(plan, {
      accepted: true,
      changed: false,
      noOp: true,
      nextState: plan.previousState,
      previousStateRevision: previousRevision,
      nextStateRevision: previousRevision,
      warnings,
    });
  }

  const nextRevision = previousRevision + 1;
  stateRevisionByObjectId.set(objectId, nextRevision);
  const nextState = createNexoraObjectState(object, d);

  if (
    object.identity.id !== identityBefore.id ||
    object.identity.type !== identityBefore.type ||
    object.identity.createdAt !== identityBefore.createdAt ||
    object.identity.owner !== identityBefore.owner
  ) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_IDENTITY_MUTATION",
        "Transition altered the immutable identity facet.",
        objectId,
        plan.type,
        plan.transitionId,
      ),
    );
  }

  assertNexoraObjectStateInvariants(nextState, objectId);

  const events: NexoraObjectStateEvent[] = emitted.map((entry) =>
    makeStateEvent(entry.type, plan, nextRevision, d, entry.payload),
  );
  events.push(
    makeStateEvent("TransitionApplied", plan, nextRevision, d, {
      effectKinds: Object.freeze(plan.effects.map((effect) => effect.kind)),
      childTransitionIds: plan.childTransitionIds,
      fromLifecycle: plan.previousState.lifecycle,
      toLifecycle: nextState.lifecycle,
      fromStatus: plan.previousState.status,
      toStatus: nextState.status,
    }),
  );

  return makeResult(plan, {
    accepted: true,
    changed: true,
    noOp: false,
    nextState,
    previousStateRevision: previousRevision,
    nextStateRevision: nextRevision,
    events,
    warnings,
  });
}

// ─── Batch ──────────────────────────────────────────────────────────────────

function newTransitionId(deps: NexoraObjectStateTransitionDependencies): string {
  const factory =
    deps.createTransitionId ??
    defaultNexoraObjectStateTransitionDependencies.createTransitionId;
  return factory ? factory() : `nst-txn-${Date.now()}`;
}

function mergeRequestContext(
  request: NexoraObjectTransitionRequest,
  fallback?: NexoraObjectTransitionContext,
): NexoraObjectTransitionRequest {
  if (!fallback) return request;
  return Object.freeze({
    ...request,
    context: Object.freeze({
      ...fallback,
      ...(request.context ?? {}),
    }),
  });
}

function batchResult(input: {
  readonly batchId: string;
  readonly mode: NexoraObjectTransitionBatchMode;
  readonly accepted: boolean;
  readonly results: readonly NexoraObjectTransitionResult[];
  readonly changedObjectIds: readonly string[];
  readonly rejectedObjectIds: readonly string[];
  readonly errors: readonly NexoraObjectStateTransitionError[];
  readonly correlationId: string;
}): NexoraObjectTransitionBatchResult {
  return Object.freeze({
    batchId: input.batchId,
    mode: input.mode,
    accepted: input.accepted,
    results: Object.freeze([...input.results]),
    changedObjectIds: Object.freeze([...input.changedObjectIds]),
    rejectedObjectIds: Object.freeze([...input.rejectedObjectIds]),
    errors: Object.freeze([...input.errors]),
    correlationId: input.correlationId,
  });
}

/**
 * Atomic mode evaluates every transition against a chained virtual state and
 * applies none if any is rejected. BestEffort applies each accepted transition.
 */
export function applyNexoraObjectTransitionBatch(
  objects: readonly MutableNexoraObject[],
  batch: NexoraObjectTransitionBatchRequest,
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionEvaluationOptions,
): NexoraObjectTransitionBatchResult {
  const d = resolveDeps(deps);
  const registry = options?.registry ?? defaultRegistry;
  const policies = options?.policies ?? defaultNexoraObjectTransitionPolicies;
  const batchId = batch.batchId?.trim() || newTransitionId(d);
  const correlationId =
    options?.correlationId ?? batch.context?.correlationId ?? batchId;

  const errors: NexoraObjectStateTransitionError[] = [];
  const rejectedObjectIds: string[] = [];

  // Duplicate explicit transition ids abort the whole batch.
  const seenTransitionIds = new Set<string>();
  for (const item of batch.transitions) {
    const id = item.transitionId?.trim();
    if (!id) continue;
    if (seenTransitionIds.has(id)) {
      errors.push(
        err(
          "TRANSITION_DUPLICATE_TRANSITION_ID",
          `Duplicate transitionId in batch: ${id}`,
          item.objectId,
          item.type,
          id,
        ),
      );
    }
    seenTransitionIds.add(id);
  }
  if (errors.length > 0) {
    return batchResult({
      batchId,
      mode: batch.mode,
      accepted: false,
      results: [],
      changedObjectIds: [],
      rejectedObjectIds: Object.freeze([
        ...new Set(batch.transitions.map((item) => item.objectId)),
      ]),
      errors,
      correlationId,
    });
  }

  const byId = new Map<string, MutableNexoraObject>();
  for (const object of objects) {
    byId.set(object.identity.id, object);
  }

  const resolvable: {
    readonly object: MutableNexoraObject;
    readonly request: NexoraObjectTransitionRequest;
    readonly objectId: string;
  }[] = [];

  for (const item of batch.transitions) {
    const object = byId.get(item.objectId);
    if (!object) {
      errors.push(
        err(
          "TRANSITION_OBJECT_NOT_FOUND",
          `Object not found: ${item.objectId}`,
          item.objectId,
          item.type,
          item.transitionId,
        ),
      );
      if (!rejectedObjectIds.includes(item.objectId)) {
        rejectedObjectIds.push(item.objectId);
      }
      continue;
    }
    resolvable.push({
      object,
      objectId: item.objectId,
      request: mergeRequestContext(item, batch.context),
    });
  }

  if (batch.mode === "Atomic") {
    const virtualStates = new Map<string, NexoraObjectState>();
    const plans: {
      readonly object: MutableNexoraObject;
      readonly request: NexoraObjectTransitionRequest;
      readonly plan: NexoraObjectTransitionPlan;
    }[] = [];
    let anyRejected = errors.length > 0;

    for (const entry of resolvable) {
      const state =
        virtualStates.get(entry.objectId) ??
        createNexoraObjectState(entry.object, d);
      const plan = evaluateAgainstState(
        entry.object,
        state,
        entry.request,
        d,
        registry,
        policies,
        correlationId,
        0,
        undefined,
      );
      plans.push({ object: entry.object, request: entry.request, plan });
      if (!plan.accepted) {
        anyRejected = true;
        if (!rejectedObjectIds.includes(entry.objectId)) {
          rejectedObjectIds.push(entry.objectId);
        }
        errors.push(...plan.errors);
        continue;
      }
      virtualStates.set(
        entry.objectId,
        plan.noOp
          ? state
          : freezeState({
              ...plan.projectedState,
              stateRevision: state.stateRevision + 1,
            }),
      );
    }

    if (anyRejected) {
      const results = plans.map(({ plan }) =>
        plan.accepted
          ? rejectedResult(plan, d, [
              err(
                "TRANSITION_BATCH_ABORTED",
                "Atomic batch aborted because another transition in the batch was rejected.",
                plan.objectId,
                plan.type,
                plan.transitionId,
              ),
            ])
          : rejectedResult(plan, d),
      );
      return batchResult({
        batchId,
        mode: batch.mode,
        accepted: false,
        results,
        changedObjectIds: [],
        rejectedObjectIds,
        errors,
        correlationId,
      });
    }

    const results: NexoraObjectTransitionResult[] = [];
    const changedObjectIds: string[] = [];
    for (const entry of plans) {
      const result = applyNexoraObjectTransition(
        entry.object,
        entry.request,
        d,
        { registry, policies, correlationId },
      );
      results.push(result);
      if (result.changed && !changedObjectIds.includes(result.objectId)) {
        changedObjectIds.push(result.objectId);
      }
      if (!result.accepted) {
        errors.push(...result.errors);
        if (!rejectedObjectIds.includes(result.objectId)) {
          rejectedObjectIds.push(result.objectId);
        }
      }
    }

    return batchResult({
      batchId,
      mode: batch.mode,
      accepted: rejectedObjectIds.length === 0,
      results,
      changedObjectIds,
      rejectedObjectIds,
      errors,
      correlationId,
    });
  }

  // BestEffort
  const results: NexoraObjectTransitionResult[] = [];
  const changedObjectIds: string[] = [];

  for (const entry of resolvable) {
    const result = applyNexoraObjectTransition(entry.object, entry.request, d, {
      registry,
      policies,
      correlationId,
    });
    results.push(result);
    if (result.changed && !changedObjectIds.includes(result.objectId)) {
      changedObjectIds.push(result.objectId);
    }
    if (!result.accepted) {
      errors.push(...result.errors);
      if (!rejectedObjectIds.includes(result.objectId)) {
        rejectedObjectIds.push(result.objectId);
      }
    }
  }

  return batchResult({
    batchId,
    mode: batch.mode,
    accepted: rejectedObjectIds.length === 0,
    results,
    changedObjectIds,
    rejectedObjectIds,
    errors,
    correlationId,
  });
}

// ─── Simulation ─────────────────────────────────────────────────────────────

/** Pure projection — identical to evaluation and guaranteed side-effect free. */
export function simulateNexoraObjectTransition(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  request: NexoraObjectTransitionRequest,
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionEvaluationOptions,
): NexoraObjectTransitionPlan {
  return evaluateNexoraObjectTransition(object, request, deps, options);
}

export function simulateNexoraObjectTransitionSequence(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  requests: readonly NexoraObjectTransitionRequest[],
  deps?: NexoraObjectStateTransitionDependencies,
  options?: NexoraObjectTransitionSimulationOptions,
): NexoraObjectTransitionSimulationResult {
  const d = resolveDeps(deps);
  const target = object as MutableNexoraObject;
  const registry = options?.registry ?? defaultRegistry;
  const policies = options?.policies ?? defaultNexoraObjectTransitionPolicies;
  const initialState = createNexoraObjectState(target, d);
  const correlationId = newTransitionId(d);

  const plans: NexoraObjectTransitionPlan[] = [];
  const errors: NexoraObjectStateTransitionError[] = [];
  let state = initialState;
  let accepted = true;

  for (const request of requests) {
    const plan = evaluateAgainstState(
      target,
      state,
      request,
      d,
      registry,
      policies,
      correlationId,
      0,
      undefined,
    );
    plans.push(plan);

    if (!plan.accepted) {
      accepted = false;
      errors.push(...plan.errors);
      if (options?.continueOnError !== true) break;
      continue;
    }
    if (!plan.noOp) {
      state = freezeState({
        ...plan.projectedState,
        stateRevision: state.stateRevision + 1,
      });
    }
  }

  return Object.freeze({
    objectId: initialState.objectId,
    accepted,
    plans: Object.freeze(plans),
    initialState,
    finalState: state,
    errors: Object.freeze(errors),
    correlationId,
  });
}

// ─── History ────────────────────────────────────────────────────────────────

export function createNexoraObjectTransitionRecord(
  result: NexoraObjectTransitionResult,
  recordId?: string,
): NexoraObjectTransitionRecord {
  let id = recordId?.trim();
  if (!id) {
    defaultRecordSeq += 1;
    id = `nst-rec-${defaultRecordSeq}`;
  }
  return Object.freeze({
    recordId: id,
    transitionId: result.transitionId,
    objectId: result.objectId,
    type: result.type,
    accepted: result.accepted,
    changed: result.changed,
    noOp: result.noOp,
    dryRun: result.dryRun,
    fromLifecycle: result.previousState.lifecycle,
    toLifecycle: result.nextState.lifecycle,
    fromStatus: result.previousState.status,
    toStatus: result.nextState.status,
    previousStateRevision: result.previousStateRevision,
    nextStateRevision: result.nextStateRevision,
    occurredAt: result.occurredAt,
    source: result.source,
    actorId: result.actorId,
    correlationId: result.correlationId,
    causationId: result.causationId,
    errorCodes: Object.freeze(result.errors.map((error) => error.code)),
    warnings: Object.freeze([...result.warnings]),
    engineIdentity: NOL_STE_IDENTITY,
    engineVersion: NOL_STE_VERSION,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
  });
}

export function projectNexoraObjectTransitionHistory(
  records: readonly NexoraObjectTransitionRecord[],
): readonly NexoraObjectTransitionRecord[] {
  return Object.freeze([...records]);
}

export function filterNexoraObjectTransitionHistory(
  records: readonly NexoraObjectTransitionRecord[],
  objectId: string,
): readonly NexoraObjectTransitionRecord[] {
  return Object.freeze(
    records.filter((record) => record.objectId === objectId),
  );
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectState(state: NexoraObjectState): string {
  const envelope: SerializedNexoraObjectState = Object.freeze({
    engineIdentity: NOL_STE_IDENTITY,
    engineVersion: NOL_STE_VERSION,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
    state,
  });
  return JSON.stringify(envelope);
}

function assertEnvelopeVersions(
  envelope: {
    readonly engineIdentity?: string;
    readonly engineVersion?: string;
    readonly stateSchemaVersion?: string;
  },
  objectId: string,
): void {
  if (envelope.engineIdentity !== NOL_STE_IDENTITY) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_UNSUPPORTED_VERSION",
        `Unsupported engine identity: ${String(envelope.engineIdentity)}`,
        objectId,
      ),
    );
  }
  if (envelope.engineVersion !== NOL_STE_VERSION) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_UNSUPPORTED_VERSION",
        `Unsupported engine version: ${String(envelope.engineVersion)}`,
        objectId,
      ),
    );
  }
  if (envelope.stateSchemaVersion !== NOL_STE_STATE_SCHEMA_VERSION) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_UNSUPPORTED_VERSION",
        `Unsupported state schema version: ${String(envelope.stateSchemaVersion)}`,
        objectId,
      ),
    );
  }
}

export function deserializeNexoraObjectState(json: string): NexoraObjectState {
  let parsed: SerializedNexoraObjectState;
  try {
    parsed = JSON.parse(json) as SerializedNexoraObjectState;
  } catch {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_UNSUPPORTED_VERSION",
        "State payload is not valid JSON.",
        "unknown",
      ),
    );
  }

  const objectId = parsed?.state?.objectId ?? "unknown";
  assertEnvelopeVersions(parsed ?? {}, objectId);

  if (!parsed.state || typeof parsed.state !== "object") {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_INVARIANT_VIOLATION",
        "State payload is missing the state section.",
        objectId,
      ),
    );
  }

  const state = freezeState({
    ...parsed.state,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
  });
  assertNexoraObjectStateInvariants(state, objectId);
  return state;
}

export function serializeNexoraObjectTransitionRecord(
  record: NexoraObjectTransitionRecord,
): string {
  const envelope: SerializedNexoraObjectTransitionRecord = Object.freeze({
    engineIdentity: NOL_STE_IDENTITY,
    engineVersion: NOL_STE_VERSION,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
    record,
  });
  return JSON.stringify(envelope);
}

export function deserializeNexoraObjectTransitionRecord(
  json: string,
): NexoraObjectTransitionRecord {
  let parsed: SerializedNexoraObjectTransitionRecord;
  try {
    parsed = JSON.parse(json) as SerializedNexoraObjectTransitionRecord;
  } catch {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_UNSUPPORTED_VERSION",
        "Transition record payload is not valid JSON.",
        "unknown",
      ),
    );
  }

  const objectId = parsed?.record?.objectId ?? "unknown";
  assertEnvelopeVersions(parsed ?? {}, objectId);

  const record = parsed.record;
  if (!record || typeof record !== "object") {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_INVARIANT_VIOLATION",
        "Transition record payload is missing the record section.",
        objectId,
      ),
    );
  }
  if (
    !hasNexoraObjectTransitionDefinition(record.type) ||
    !isNexoraObjectLifecycle(record.fromLifecycle) ||
    !isNexoraObjectLifecycle(record.toLifecycle) ||
    !isNexoraObjectStatus(record.fromStatus) ||
    !isNexoraObjectStatus(record.toStatus)
  ) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_INVARIANT_VIOLATION",
        "Transition record contains unsupported lifecycle, status or transition type.",
        objectId,
      ),
    );
  }

  return Object.freeze({
    ...record,
    errorCodes: Object.freeze([...(record.errorCodes ?? [])]),
    warnings: Object.freeze([...(record.warnings ?? [])]),
    engineIdentity: NOL_STE_IDENTITY,
    engineVersion: NOL_STE_VERSION,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
  });
}

// ─── Convenience APIs ───────────────────────────────────────────────────────

function request(
  type: NexoraObjectTransitionType,
  context?: NexoraObjectTransitionContext,
  payload?: NexoraObjectTransitionPayload,
): NexoraObjectTransitionRequest {
  return Object.freeze({
    type,
    context: context ?? Object.freeze({ source: "Engine" as const }),
    payload,
  });
}

export function activateNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(object, request("Activate", context), deps);
}

export function pauseNexoraObjectLifecycle(
  object: MutableNexoraObject,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(object, request("Pause", context), deps);
}

export function resumeNexoraObjectLifecycle(
  object: MutableNexoraObject,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(object, request("Resume", context), deps);
}

export function archiveNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(object, request("Archive", context), deps);
}

export function restoreNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(object, request("Restore", context), deps);
}

export function deleteNexoraObject(
  object: MutableNexoraObject,
  reason: string,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(
    object,
    request("Delete", context, Object.freeze({ reason })),
    deps,
  );
}

const STATUS_TRANSITION_BY_STATUS: Readonly<
  Record<NexoraObjectStatus, NexoraObjectStatusTransitionType>
> = Object.freeze({
  Green: "SetGreen",
  Yellow: "SetYellow",
  Red: "SetRed",
  Blue: "SetBlue",
  White: "SetWhite",
  Black: "SetBlack",
});

export function setNexoraObjectStatus(
  object: MutableNexoraObject,
  status: NexoraObjectStatus,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  if (!isNexoraObjectStatus(status)) {
    throw new NexoraObjectStateTransitionException(
      err(
        "TRANSITION_INVALID_STATUS",
        `Unsupported status: ${String(status)}`,
        object.identity.id,
      ),
    );
  }
  return applyNexoraObjectTransition(
    object,
    request(STATUS_TRANSITION_BY_STATUS[status], context),
    deps,
  );
}

export function setNexoraObjectVisualizationState(
  object: MutableNexoraObject,
  patch: NexoraObjectVisualizationPatch,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(
    object,
    request("SetVisualization", context, Object.freeze({ visualization: patch })),
    deps,
  );
}

export function setNexoraObjectExecutiveState(
  object: MutableNexoraObject,
  patch: NexoraObjectExecutivePatch,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(
    object,
    request("SetExecutiveState", context, Object.freeze({ executive: patch })),
    deps,
  );
}

export function applyNexoraObjectRuntimeTransition(
  object: MutableNexoraObject,
  type: NexoraObjectRuntimeTransitionType,
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
  reason?: string,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(
    object,
    Object.freeze({
      type,
      context: context ?? Object.freeze({ source: "Engine" as const }),
      reason,
    }),
    deps,
  );
}

export function applyNexoraObjectCompositeTransition(
  object: MutableNexoraObject,
  transitions: readonly NexoraObjectTransitionRequest[],
  context?: NexoraObjectTransitionContext,
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionResult {
  return applyNexoraObjectTransition(
    object,
    request("Composite", context, Object.freeze({ transitions })),
    deps,
  );
}

// ─── Engine summary ─────────────────────────────────────────────────────────

export function getNexoraObjectStateTransitionEngineSummary() {
  return Object.freeze({
    identity: NOL_STE_IDENTITY,
    namespace: NOL_STE_NAMESPACE,
    engineVersion: NOL_STE_VERSION,
    stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
    upstream: NOL_STE_UPSTREAM,
    transitionTypeCount: NEXORA_OBJECT_STATE_TRANSITION_TYPES.length,
    lifecycleTransitionCount: NEXORA_OBJECT_LIFECYCLE_TRANSITION_TYPES.length,
    statusTransitionCount: NEXORA_OBJECT_STATUS_TRANSITION_TYPES.length,
    runtimeTransitionCount: NEXORA_OBJECT_RUNTIME_TRANSITION_TYPES.length,
    statusCount: NEXORA_OBJECT_STATUSES.length,
    policyCount: defaultNexoraObjectTransitionPolicies.length,
    effectCalculatedBeforeApply: true,
    runtimeDelegated: true,
    identityPreserved: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectStateTransitionEngine = Object.freeze({
  identity: NOL_STE_IDENTITY,
  engineVersion: NOL_STE_VERSION,
  stateSchemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
  tags: NOL_STE_TAGS,
  transitionTypes: NEXORA_OBJECT_STATE_TRANSITION_TYPES,
  lifecycleGraph: NEXORA_OBJECT_LIFECYCLE_GRAPH,
  policies: defaultNexoraObjectTransitionPolicies,
  createState: createNexoraObjectState,
  projectState: projectNexoraObjectState,
  validateState: validateNexoraObjectState,
  evaluate: evaluateNexoraObjectTransition,
  apply: applyNexoraObjectTransition,
  applyBatch: applyNexoraObjectTransitionBatch,
  simulate: simulateNexoraObjectTransition,
  simulateSequence: simulateNexoraObjectTransitionSequence,
  registry: getNexoraObjectTransitionRegistry,
  summary: getNexoraObjectStateTransitionEngineSummary,
});

// ─── Spec-facing aliases ────────────────────────────────────────────────────

export type NexoraObjectStateDomain =
  | "Status"
  | "Lifecycle"
  | "Runtime"
  | "Execution"
  | "Visualization"
  | "Executive"
  | "Composite";

export type NexoraObjectTransitionErrorCode = NexoraObjectStateTransitionErrorCode;
export type NexoraObjectTransitionError = NexoraObjectStateTransitionError;
export type NexoraObjectTransitionEventType = NexoraObjectStateEventType;
export type NexoraObjectTransitionEvent = NexoraObjectStateEvent;
export type NexoraObjectTransitionWarningCode =
  | "TRANSITION_STATUS_ESCALATED"
  | "TRANSITION_STATUS_DEESCALATED"
  | "TRANSITION_OBJECT_REMAINS_LOCKED"
  | "TRANSITION_EXECUTION_CANCELLED"
  | "TRANSITION_FOCUS_CLEARED"
  | "TRANSITION_SELECTION_CLEARED"
  | "TRANSITION_NO_STATE_CHANGE";
export type NexoraObjectTransitionWarning = {
  readonly code: NexoraObjectTransitionWarningCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export const canChangeNexoraObjectLifecycle = canTransitionNexoraObjectLifecycle;
export const canChangeNexoraObjectStatus = canSetNexoraObjectStatus;
export const canUpdateNexoraObjectVisualization = canSetNexoraObjectVisualization;
export const canUpdateNexoraObjectExecutiveState = canSetNexoraObjectExecutiveState;

export function canApplyNexoraObjectExecutionTransition(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  type:
    | "PrepareExecution"
    | "StartExecution"
    | "PauseExecution"
    | "ResumeExecution"
    | "CompleteExecution"
    | "FailExecution"
    | "CancelExecution"
    | "ResetExecution",
  deps?: NexoraObjectStateTransitionDependencies,
): NexoraObjectTransitionGuardResult {
  void deps;
  const state = createNexoraObjectState(object);
  return canApplyNexoraObjectRuntimeTransition(
    state,
    type as NexoraObjectRuntimeTransitionType,
  );
}
