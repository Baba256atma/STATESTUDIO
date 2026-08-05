/**
 * NOL-1:3 — Universal NexoraObject Runtime Model
 *
 * Canonical temporary / interaction / execution state for every NexoraObject.
 * Upstream: NOL-1:1 Foundation + NOL-1:2 Contract only.
 *
 * Identity: NOL-1:3/UniversalNexoraObjectRuntimeModel
 */

import type { NexoraObjectLifecycle } from "../foundation/universalNexoraObjectFoundation.ts";
import type { NexoraObjectRuntimeState as FoundationRuntimeFlags } from "../foundation/universalNexoraObjectFoundation.ts";
import {
  type AnyNexoraObject,
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const NOL_RUNTIME_IDENTITY =
  "NOL-1:3/UniversalNexoraObjectRuntimeModel" as const;

export const NOL_RUNTIME_MODEL_VERSION = "1.0.0" as const;

export const NOL_RUNTIME_SCHEMA_VERSION = "1.0.0" as const;

/** Spec aliases */
export const runtimeIdentity = NOL_RUNTIME_IDENTITY;
export const runtimeModelVersion = NOL_RUNTIME_MODEL_VERSION;
export const runtimeSchemaVersion = NOL_RUNTIME_SCHEMA_VERSION;

export const NOL_RUNTIME_TAGS = Object.freeze([
  "[NOL-1:3]",
  "[UNIVERSAL_NEXORA_OBJECT_RUNTIME]",
  "[COMMAND_DRIVEN]",
  "[IDENTITY_PRESERVED]",
  "[FOUNDATION_CONTRACT_BOUND]",
] as const);

// ─── Interaction & execution ────────────────────────────────────────────────

export type NexoraObjectInteractionState =
  | "Idle"
  | "Hovered"
  | "Selected"
  | "Focused"
  | "Highlighted";

export type NexoraObjectExecutionState =
  | "Idle"
  | "Preparing"
  | "Running"
  | "Paused"
  | "Completed"
  | "Failed"
  | "Cancelled";

/**
 * Canonical runtime state — extends Foundation boolean flags with
 * interaction/execution machines and revision tracking.
 */
export type NexoraObjectRuntimeState = {
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
  readonly runtimeRevision: number;
  readonly updatedAt: string;
};

// ─── Commands ───────────────────────────────────────────────────────────────

export type NexoraObjectRuntimeCommand =
  | { readonly type: "Select" }
  | { readonly type: "Deselect" }
  | { readonly type: "Focus" }
  | { readonly type: "Blur" }
  | { readonly type: "Show" }
  | { readonly type: "Hide" }
  | { readonly type: "Highlight" }
  | { readonly type: "ClearHighlight" }
  | { readonly type: "Lock" }
  | { readonly type: "Unlock" }
  | { readonly type: "MarkDirty" }
  | { readonly type: "MarkClean" }
  | { readonly type: "StartLoading" }
  | { readonly type: "StopLoading" }
  | { readonly type: "PrepareExecution" }
  | { readonly type: "StartExecution" }
  | { readonly type: "PauseExecution" }
  | { readonly type: "ResumeExecution" }
  | { readonly type: "CompleteExecution" }
  | { readonly type: "FailExecution"; readonly reason?: string }
  | { readonly type: "CancelExecution"; readonly reason?: string }
  | { readonly type: "ResetExecution" }
  | { readonly type: "ResetRuntime" };

export type NexoraObjectRuntimeCommandContext = {
  readonly actorId?: string;
  readonly source:
    | "Runtime"
    | "Director"
    | "Advisor"
    | "Timeline"
    | "Workspace"
    | "System";
  readonly authorizedSystemMutation?: boolean;
  readonly occurredAt?: string;
  readonly correlationId?: string;
  readonly reason?: string;
};

// ─── Events & errors ────────────────────────────────────────────────────────

export type NexoraObjectRuntimeEventType =
  | "RuntimeSelected"
  | "RuntimeDeselected"
  | "RuntimeFocused"
  | "RuntimeBlurred"
  | "RuntimeShown"
  | "RuntimeHidden"
  | "RuntimeHighlighted"
  | "RuntimeHighlightCleared"
  | "RuntimeLocked"
  | "RuntimeUnlocked"
  | "RuntimeDirty"
  | "RuntimeClean"
  | "RuntimeLoadingStarted"
  | "RuntimeLoadingStopped"
  | "ExecutionPreparing"
  | "ExecutionStarted"
  | "ExecutionPaused"
  | "ExecutionResumed"
  | "ExecutionCompleted"
  | "ExecutionFailed"
  | "ExecutionCancelled"
  | "ExecutionReset"
  | "RuntimeReset";

export type NexoraObjectRuntimeEvent = {
  readonly eventId: string;
  readonly objectId: string;
  readonly type: NexoraObjectRuntimeEventType;
  readonly occurredAt: string;
  readonly runtimeRevision: number;
  readonly actorId?: string;
  readonly source: NexoraObjectRuntimeCommandContext["source"];
  readonly correlationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
};

export type NexoraObjectRuntimeErrorCode =
  | "RUNTIME_OBJECT_DELETED"
  | "RUNTIME_OBJECT_ARCHIVED"
  | "RUNTIME_OBJECT_HIDDEN"
  | "RUNTIME_OBJECT_LOCKED"
  | "RUNTIME_OBJECT_LOADING"
  | "RUNTIME_INVALID_INTERACTION_TRANSITION"
  | "RUNTIME_INVALID_EXECUTION_TRANSITION"
  | "RUNTIME_INVARIANT_VIOLATION"
  | "RUNTIME_OBJECT_NOT_FOUND"
  | "RUNTIME_DUPLICATE_OBJECT_ID"
  | "RUNTIME_UNAUTHORIZED_SYSTEM_MUTATION"
  | "RUNTIME_UNSUPPORTED_VERSION";

export type NexoraObjectRuntimeError = {
  readonly code: NexoraObjectRuntimeErrorCode;
  readonly message: string;
  readonly objectId: string;
  readonly commandType?: NexoraObjectRuntimeCommand["type"];
  readonly details?: Readonly<Record<string, unknown>>;
};

export class NexoraObjectRuntimeException extends Error {
  readonly code: NexoraObjectRuntimeErrorCode;
  readonly objectId: string;
  constructor(err: NexoraObjectRuntimeError) {
    super(err.message);
    this.name = "NexoraObjectRuntimeException";
    this.code = err.code;
    this.objectId = err.objectId;
  }
}

export type NexoraObjectRuntimeGuardResult = {
  readonly allowed: boolean;
  readonly code?: NexoraObjectRuntimeErrorCode;
  readonly message?: string;
};

export type NexoraObjectRuntimeTransitionResult = {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly previousState: NexoraObjectRuntimeState;
  readonly nextState: NexoraObjectRuntimeState;
  readonly command: NexoraObjectRuntimeCommand;
  readonly events: readonly NexoraObjectRuntimeEvent[];
  readonly errors: readonly NexoraObjectRuntimeError[];
};

export type NexoraObjectRuntimeDependencies = {
  readonly now: () => string;
  readonly createEventId: () => string;
};

export type NexoraObjectRuntimeResetOptions = {
  readonly preserveVisibility?: boolean;
  readonly preserveLock?: boolean;
  /** When false, compute the transition without mutating store or object. */
  readonly commit?: boolean;
};

export type NexoraObjectRuntimeCollection = {
  readonly objects: readonly MutableNexoraObject[];
};

export type NexoraObjectRuntimeBatchCommand = {
  readonly objectIds: readonly string[];
  readonly command: NexoraObjectRuntimeCommand;
};

export type NexoraObjectRuntimeBatchMode = "Atomic" | "BestEffort";

export type NexoraObjectRuntimeBatchResult = {
  readonly accepted: boolean;
  readonly results: readonly NexoraObjectRuntimeTransitionResult[];
  readonly changedObjectIds: readonly string[];
  readonly rejectedObjectIds: readonly string[];
};

export type NexoraObjectRuntimeProjection = {
  readonly objectId: string;
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
  readonly runtimeRevision: number;
  readonly updatedAt: string;
  readonly runtimeSchemaVersion: typeof NOL_RUNTIME_SCHEMA_VERSION;
};

type SerializedRuntimeState = {
  readonly runtimeSchemaVersion: string;
  readonly state: NexoraObjectRuntimeState;
};

// ─── Store (temporary runtime reality; never persists identity) ─────────────

const runtimeByObjectId = new Map<string, NexoraObjectRuntimeState>();

let defaultEventSeq = 0;

export const defaultNexoraObjectRuntimeDependencies: NexoraObjectRuntimeDependencies =
  Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      defaultEventSeq += 1;
      return `nrt-evt-${defaultEventSeq}`;
    },
  });

export function resetNexoraObjectRuntimeStoreForTests(): void {
  runtimeByObjectId.clear();
  defaultEventSeq = 0;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function freezeState(state: NexoraObjectRuntimeState): NexoraObjectRuntimeState {
  return Object.freeze({ ...state });
}

function deriveInteraction(
  flags: Pick<
    NexoraObjectRuntimeState,
    "focused" | "selected" | "highlighted" | "visible"
  >,
  preferHover = false,
): NexoraObjectInteractionState {
  if (!flags.visible) return "Idle";
  if (flags.focused) return "Focused";
  if (flags.selected) return "Selected";
  if (flags.highlighted) return "Highlighted";
  if (preferHover) return "Hovered";
  return "Idle";
}

function executingFrom(executionState: NexoraObjectExecutionState): boolean {
  return (
    executionState === "Preparing" ||
    executionState === "Running" ||
    executionState === "Paused"
  );
}

function syncInteraction(state: NexoraObjectRuntimeState): NexoraObjectRuntimeState {
  return freezeState({
    ...state,
    interactionState: deriveInteraction(state),
    executing: executingFrom(state.executionState),
  });
}

function err(
  code: NexoraObjectRuntimeErrorCode,
  message: string,
  objectId: string,
  commandType?: NexoraObjectRuntimeCommand["type"],
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectRuntimeError {
  return Object.freeze({ code, message, objectId, commandType, details });
}

function deny(
  code: NexoraObjectRuntimeErrorCode,
  message: string,
): NexoraObjectRuntimeGuardResult {
  return Object.freeze({ allowed: false, code, message });
}

function allow(): NexoraObjectRuntimeGuardResult {
  return Object.freeze({ allowed: true });
}

function lifecycleOf(object: AnyNexoraObject): NexoraObjectLifecycle {
  return object.lifecycle;
}

function isUserOriginated(context: NexoraObjectRuntimeCommandContext): boolean {
  return context.source !== "System" || !context.authorizedSystemMutation;
}

function lockBlocks(
  state: NexoraObjectRuntimeState,
  context: NexoraObjectRuntimeCommandContext,
): boolean {
  if (!state.locked) return false;
  if (context.authorizedSystemMutation && context.source === "System") {
    return false;
  }
  return isUserOriginated(context) || context.source !== "System";
}

// ─── Factory / hydrate / project ────────────────────────────────────────────

export function createDefaultNexoraObjectRuntimeState(
  updatedAt: string,
): NexoraObjectRuntimeState {
  return freezeState({
    selected: false,
    focused: false,
    visible: true,
    highlighted: false,
    locked: false,
    dirty: false,
    loading: false,
    executing: false,
    interactionState: "Idle",
    executionState: "Idle",
    runtimeRevision: 0,
    updatedAt,
  });
}

export function hydrateNexoraObjectRuntimeState(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  input?: Partial<NexoraObjectRuntimeState> & {
    readonly runtimeSchemaVersion?: string;
  },
  options?: { readonly allowHover?: boolean; readonly updatedAt?: string },
): NexoraObjectRuntimeState {
  if (
    input?.runtimeSchemaVersion &&
    input.runtimeSchemaVersion !== NOL_RUNTIME_SCHEMA_VERSION
  ) {
    throw new NexoraObjectRuntimeException(
      err(
        "RUNTIME_UNSUPPORTED_VERSION",
        `Unsupported runtime schema version: ${input.runtimeSchemaVersion}`,
        object.identity.id,
      ),
    );
  }

  const contractRuntime = object.runtime;
  const base = createDefaultNexoraObjectRuntimeState(
    options?.updatedAt ?? input?.updatedAt ?? "1970-01-01T00:00:00.000Z",
  );

  const merged = freezeState({
    ...base,
    selected: input?.selected ?? contractRuntime.selected,
    focused: input?.focused ?? contractRuntime.focused,
    visible: input?.visible ?? contractRuntime.visible,
    highlighted: input?.highlighted ?? false,
    locked: input?.locked ?? contractRuntime.locked,
    dirty: input?.dirty ?? contractRuntime.dirty,
    loading: input?.loading ?? contractRuntime.loading,
    executing: input?.executing ?? contractRuntime.executing,
    executionState: input?.executionState ?? "Idle",
    runtimeRevision: input?.runtimeRevision ?? 0,
    updatedAt: options?.updatedAt ?? input?.updatedAt ?? base.updatedAt,
    interactionState: "Idle",
  });

  const withExec = freezeState({
    ...merged,
    executing: executingFrom(merged.executionState),
    interactionState: deriveInteraction(
      merged,
      Boolean(options?.allowHover && input?.interactionState === "Hovered"),
    ),
  });

  const invariants = validateNexoraObjectRuntimeState(
    withExec,
    object.lifecycle,
  );
  if (!invariants.ok) {
    throw new NexoraObjectRuntimeException(
      err(
        "RUNTIME_INVARIANT_VIOLATION",
        invariants.errors[0] ?? "Invalid hydrated runtime state.",
        object.identity.id,
      ),
    );
  }

  runtimeByObjectId.set(object.identity.id, withExec);
  return withExec;
}

export function getNexoraObjectRuntimeState(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  deps: NexoraObjectRuntimeDependencies = defaultNexoraObjectRuntimeDependencies,
): NexoraObjectRuntimeState {
  const existing = runtimeByObjectId.get(object.identity.id);
  if (existing) return existing;
  return hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: deps.now(),
  });
}

export function projectNexoraObjectRuntimeState(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  deps?: NexoraObjectRuntimeDependencies,
): NexoraObjectRuntimeProjection {
  const state = getNexoraObjectRuntimeState(object, deps);
  return Object.freeze({
    objectId: object.identity.id,
    selected: state.selected,
    focused: state.focused,
    visible: state.visible,
    highlighted: state.highlighted,
    locked: state.locked,
    dirty: state.dirty,
    loading: state.loading,
    executing: state.executing,
    interactionState: state.interactionState,
    executionState: state.executionState,
    runtimeRevision: state.runtimeRevision,
    updatedAt: state.updatedAt,
    runtimeSchemaVersion: NOL_RUNTIME_SCHEMA_VERSION,
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export function validateNexoraObjectRuntimeState(
  state: NexoraObjectRuntimeState,
  lifecycle: NexoraObjectLifecycle,
): { readonly ok: boolean; readonly errors: readonly string[] } {
  const errors: string[] = [];

  if (state.focused && !state.selected) {
    errors.push("focused implies selected");
  }
  if (!state.visible && state.focused) {
    errors.push("hidden implies not focused");
  }
  if (!state.visible && state.interactionState === "Hovered") {
    errors.push("hidden implies not hovered");
  }
  if (lifecycle === "Deleted" && state.selected) {
    errors.push("deleted implies not selected");
  }
  if (lifecycle === "Deleted" && state.focused) {
    errors.push("deleted implies not focused");
  }
  if (lifecycle === "Deleted" && state.executing) {
    errors.push("deleted implies not executing");
  }
  if (
    lifecycle === "Archived" &&
    (state.executionState === "Preparing" || state.executionState === "Running")
  ) {
    errors.push("archived implies not preparing or running");
  }
  if (state.executing !== executingFrom(state.executionState)) {
    errors.push("executing must match executionState");
  }
  if (!Number.isInteger(state.runtimeRevision) || state.runtimeRevision < 0) {
    errors.push("runtime revision must be a non-negative integer");
  }
  if (Number.isNaN(Date.parse(state.updatedAt))) {
    errors.push("updatedAt must be a valid ISO string");
  }
  if (
    (state.executionState === "Completed" ||
      state.executionState === "Failed" ||
      state.executionState === "Cancelled" ||
      state.executionState === "Idle") &&
    state.executing
  ) {
    errors.push("terminal/idle execution states set executing to false");
  }

  const expected = deriveInteraction(state);
  if (
    state.interactionState !== expected &&
    !(state.interactionState === "Hovered" && expected === "Idle")
  ) {
    // Allow Hovered only when no higher interaction applies.
    if (!(state.interactionState === "Hovered" && !state.selected && !state.focused && !state.highlighted && state.visible)) {
      errors.push("interaction state must match boolean flags");
    }
  }

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function assertNexoraObjectRuntimeInvariants(
  state: NexoraObjectRuntimeState,
  lifecycle: NexoraObjectLifecycle,
  objectId: string,
): void {
  const result = validateNexoraObjectRuntimeState(state, lifecycle);
  if (!result.ok) {
    throw new NexoraObjectRuntimeException(
      err(
        "RUNTIME_INVARIANT_VIOLATION",
        result.errors.join("; "),
        objectId,
      ),
    );
  }
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function canSelectNexoraObject(
  object: AnyNexoraObject,
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  if (lifecycleOf(object) === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot be selected.");
  }
  if (!state.visible) {
    return deny("RUNTIME_OBJECT_HIDDEN", "Hidden objects cannot be selected.");
  }
  return allow();
}

export function canFocusNexoraObject(
  object: AnyNexoraObject,
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  if (lifecycleOf(object) === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot be focused.");
  }
  if (!state.visible) {
    return deny("RUNTIME_OBJECT_HIDDEN", "Hidden objects cannot be focused.");
  }
  return allow();
}

export function canHideNexoraObject(
  object: AnyNexoraObject,
): NexoraObjectRuntimeGuardResult {
  if (lifecycleOf(object) === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot change visibility.");
  }
  return allow();
}

export function canLockNexoraObject(
  object: AnyNexoraObject,
): NexoraObjectRuntimeGuardResult {
  if (lifecycleOf(object) === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot be locked.");
  }
  return allow();
}

export function canExecuteNexoraObject(
  object: AnyNexoraObject,
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  const lifecycle = lifecycleOf(object);
  if (lifecycle === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot execute.");
  }
  if (lifecycle === "Archived") {
    return deny("RUNTIME_OBJECT_ARCHIVED", "Archived objects cannot execute.");
  }
  if (lifecycle !== "Active") {
    return deny(
      "RUNTIME_INVALID_EXECUTION_TRANSITION",
      "Only Active lifecycle objects may execute.",
    );
  }
  if (state.loading) {
    return deny(
      "RUNTIME_OBJECT_LOADING",
      "Execution cannot begin while loading.",
    );
  }
  return allow();
}

export function canPauseNexoraObjectExecution(
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  if (state.executionState !== "Running") {
    return deny(
      "RUNTIME_INVALID_EXECUTION_TRANSITION",
      "Only Running execution can be paused.",
    );
  }
  return allow();
}

export function canResumeNexoraObjectExecution(
  object: AnyNexoraObject,
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  const exec = canExecuteNexoraObject(object, state);
  if (!exec.allowed) return exec;
  if (state.executionState !== "Paused") {
    return deny(
      "RUNTIME_INVALID_EXECUTION_TRANSITION",
      "Only Paused execution can be resumed.",
    );
  }
  return allow();
}

export function canCompleteNexoraObjectExecution(
  state: NexoraObjectRuntimeState,
): NexoraObjectRuntimeGuardResult {
  if (state.executionState !== "Running") {
    return deny(
      "RUNTIME_INVALID_EXECUTION_TRANSITION",
      "Only Running execution can complete.",
    );
  }
  return allow();
}

export function canResetNexoraObjectRuntime(
  object: AnyNexoraObject,
): NexoraObjectRuntimeGuardResult {
  if (lifecycleOf(object) === "Deleted") {
    return deny("RUNTIME_OBJECT_DELETED", "Deleted objects cannot reset runtime.");
  }
  return allow();
}

function guardLock(
  state: NexoraObjectRuntimeState,
  context: NexoraObjectRuntimeCommandContext,
  objectId: string,
  commandType: NexoraObjectRuntimeCommand["type"],
): NexoraObjectRuntimeError | null {
  if (!lockBlocks(state, context)) return null;
  if (context.source === "System" && !context.authorizedSystemMutation) {
    return err(
      "RUNTIME_UNAUTHORIZED_SYSTEM_MUTATION",
      "System mutation requires authorizedSystemMutation.",
      objectId,
      commandType,
    );
  }
  return err(
    "RUNTIME_OBJECT_LOCKED",
    "Object is locked against user-originated runtime mutation.",
    objectId,
    commandType,
  );
}

// ─── Transition core ────────────────────────────────────────────────────────

function makeEvent(
  type: NexoraObjectRuntimeEventType,
  objectId: string,
  revision: number,
  context: NexoraObjectRuntimeCommandContext,
  deps: NexoraObjectRuntimeDependencies,
  payload: Readonly<Record<string, unknown>> = {},
): NexoraObjectRuntimeEvent {
  return Object.freeze({
    eventId: deps.createEventId(),
    objectId,
    type,
    occurredAt: context.occurredAt ?? deps.now(),
    runtimeRevision: revision,
    actorId: context.actorId,
    source: context.source,
    correlationId: context.correlationId,
    payload: Object.freeze({ ...payload }),
  });
}

function reject(
  previous: NexoraObjectRuntimeState,
  command: NexoraObjectRuntimeCommand,
  errors: readonly NexoraObjectRuntimeError[],
): NexoraObjectRuntimeTransitionResult {
  return Object.freeze({
    accepted: false,
    changed: false,
    previousState: previous,
    nextState: previous,
    command,
    events: Object.freeze([]),
    errors: Object.freeze([...errors]),
  });
}

function accept(
  previous: NexoraObjectRuntimeState,
  next: NexoraObjectRuntimeState,
  command: NexoraObjectRuntimeCommand,
  events: readonly NexoraObjectRuntimeEvent[],
): NexoraObjectRuntimeTransitionResult {
  const changed =
    previous.selected !== next.selected ||
    previous.focused !== next.focused ||
    previous.visible !== next.visible ||
    previous.highlighted !== next.highlighted ||
    previous.locked !== next.locked ||
    previous.dirty !== next.dirty ||
    previous.loading !== next.loading ||
    previous.executing !== next.executing ||
    previous.interactionState !== next.interactionState ||
    previous.executionState !== next.executionState;

  return Object.freeze({
    accepted: true,
    changed,
    previousState: previous,
    nextState: next,
    command,
    events: Object.freeze([...events]),
    errors: Object.freeze([]),
  });
}

function commitToObject(
  object: MutableNexoraObject,
  next: NexoraObjectRuntimeState,
  previous: NexoraObjectRuntimeState,
): void {
  runtimeByObjectId.set(object.identity.id, next);
  const patch: FoundationRuntimeFlags = Object.freeze({
    selected: next.selected,
    focused: next.focused,
    visible: next.visible,
    highlighted: next.highlighted,
    locked: next.locked,
    dirty: next.dirty,
    loading: next.loading,
    executing: next.executing,
  });
  try {
    object.setRuntime(patch);
  } catch (cause) {
    runtimeByObjectId.set(object.identity.id, previous);
    const message =
      cause instanceof Error ? cause.message : "Failed to commit runtime state.";
    throw new NexoraObjectRuntimeException(
      err(
        lifecycleOf(object) === "Deleted"
          ? "RUNTIME_OBJECT_DELETED"
          : "RUNTIME_INVARIANT_VIOLATION",
        message,
        object.identity.id,
      ),
    );
  }
}

function buildNext(
  previous: NexoraObjectRuntimeState,
  patch: Partial<NexoraObjectRuntimeState>,
  deps: NexoraObjectRuntimeDependencies,
  context: NexoraObjectRuntimeCommandContext,
  changed: boolean,
): NexoraObjectRuntimeState {
  const draft = {
    ...previous,
    ...patch,
    updatedAt: context.occurredAt ?? deps.now(),
    runtimeRevision: changed
      ? previous.runtimeRevision + 1
      : previous.runtimeRevision,
  };
  return syncInteraction(freezeState(draft));
}

export function applyNexoraObjectRuntimeCommand(
  object: MutableNexoraObject,
  command: NexoraObjectRuntimeCommand,
  context: NexoraObjectRuntimeCommandContext,
  deps: NexoraObjectRuntimeDependencies = defaultNexoraObjectRuntimeDependencies,
  options?: NexoraObjectRuntimeResetOptions,
): NexoraObjectRuntimeTransitionResult {
  const objectId = object.identity.id;
  const previous = getNexoraObjectRuntimeState(object, deps);
  const lifecycle = lifecycleOf(object);

  // Persistent facet fingerprints (contract getters re-project each access)
  const identityBefore = Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    createdAt: object.identity.createdAt,
  });
  const metadataBefore = JSON.stringify(object.metadata);
  const relationshipsBefore = object
    .getRelationships()
    .map((r) => r.id)
    .join("|");
  const lifecycleBefore = object.lifecycle;
  const statusBefore = object.status;

  // Idempotent Lock when already locked bypasses the lock guard.
  if (command.type === "Lock" && previous.locked) {
    return accept(previous, previous, command, []);
  }

  const lockError =
    command.type === "Unlock"
      ? null
      : guardLock(previous, context, objectId, command.type);
  if (lockError) {
    return reject(previous, command, [lockError]);
  }

  const events: NexoraObjectRuntimeEvent[] = [];
  let next = previous;
  let eventType: NexoraObjectRuntimeEventType | null = null;
  let payload: Record<string, unknown> = {};

  const failGuard = (
    guard: NexoraObjectRuntimeGuardResult,
  ): NexoraObjectRuntimeTransitionResult | null => {
    if (guard.allowed) return null;
    return reject(previous, command, [
      err(
        guard.code ?? "RUNTIME_INVALID_INTERACTION_TRANSITION",
        guard.message ?? "Runtime transition rejected.",
        objectId,
        command.type,
      ),
    ]);
  };

  switch (command.type) {
    case "Select": {
      const g = failGuard(canSelectNexoraObject(object, previous));
      if (g) return g;
      if (previous.selected) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(
        previous,
        { selected: true },
        deps,
        context,
        true,
      );
      eventType = "RuntimeSelected";
      break;
    }
    case "Deselect": {
      if (!previous.selected && !previous.focused) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(
        previous,
        { selected: false, focused: false },
        deps,
        context,
        true,
      );
      eventType = "RuntimeDeselected";
      break;
    }
    case "Focus": {
      const g = failGuard(canFocusNexoraObject(object, previous));
      if (g) return g;
      if (previous.focused && previous.selected) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(
        previous,
        { focused: true, selected: true },
        deps,
        context,
        true,
      );
      eventType = "RuntimeFocused";
      break;
    }
    case "Blur": {
      if (!previous.focused) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { focused: false }, deps, context, true);
      eventType = "RuntimeBlurred";
      break;
    }
    case "Show": {
      if (lifecycle === "Deleted") {
        return reject(previous, command, [
          err(
            "RUNTIME_OBJECT_DELETED",
            "Deleted objects cannot be shown.",
            objectId,
            command.type,
          ),
        ]);
      }
      if (previous.visible) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { visible: true }, deps, context, true);
      eventType = "RuntimeShown";
      break;
    }
    case "Hide": {
      const g = failGuard(canHideNexoraObject(object));
      if (g) return g;
      const keepHighlight =
        previous.highlighted &&
        (context.source === "System" || context.source === "Timeline");
      next = buildNext(
        previous,
        {
          visible: false,
          selected: false,
          focused: false,
          highlighted: keepHighlight ? previous.highlighted : false,
        },
        deps,
        context,
        true,
      );
      eventType = "RuntimeHidden";
      break;
    }
    case "Highlight": {
      if (lifecycle === "Deleted") {
        return reject(previous, command, [
          err(
            "RUNTIME_OBJECT_DELETED",
            "Deleted objects cannot be highlighted.",
            objectId,
            command.type,
          ),
        ]);
      }
      if (previous.highlighted) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { highlighted: true }, deps, context, true);
      eventType = "RuntimeHighlighted";
      break;
    }
    case "ClearHighlight": {
      if (!previous.highlighted) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { highlighted: false }, deps, context, true);
      eventType = "RuntimeHighlightCleared";
      break;
    }
    case "Lock": {
      const g = failGuard(canLockNexoraObject(object));
      if (g) return g;
      if (previous.locked) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { locked: true }, deps, context, true);
      eventType = "RuntimeLocked";
      break;
    }
    case "Unlock": {
      if (!previous.locked) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { locked: false }, deps, context, true);
      eventType = "RuntimeUnlocked";
      break;
    }
    case "MarkDirty": {
      if (lifecycle === "Deleted") {
        return reject(previous, command, [
          err(
            "RUNTIME_OBJECT_DELETED",
            "Deleted objects cannot be marked dirty.",
            objectId,
            command.type,
          ),
        ]);
      }
      if (previous.dirty) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { dirty: true }, deps, context, true);
      eventType = "RuntimeDirty";
      break;
    }
    case "MarkClean": {
      if (!previous.dirty) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { dirty: false }, deps, context, true);
      eventType = "RuntimeClean";
      break;
    }
    case "StartLoading": {
      if (lifecycle === "Deleted") {
        return reject(previous, command, [
          err(
            "RUNTIME_OBJECT_DELETED",
            "Deleted objects cannot start loading.",
            objectId,
            command.type,
          ),
        ]);
      }
      if (previous.loading) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { loading: true }, deps, context, true);
      eventType = "RuntimeLoadingStarted";
      break;
    }
    case "StopLoading": {
      if (!previous.loading) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(previous, { loading: false }, deps, context, true);
      eventType = "RuntimeLoadingStopped";
      break;
    }
    case "PrepareExecution": {
      const g = failGuard(canExecuteNexoraObject(object, previous));
      if (g) return g;
      if (previous.executionState !== "Idle") {
        return reject(previous, command, [
          err(
            "RUNTIME_INVALID_EXECUTION_TRANSITION",
            "PrepareExecution requires Idle execution state.",
            objectId,
            command.type,
          ),
        ]);
      }
      next = buildNext(
        previous,
        { executionState: "Preparing" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionPreparing";
      break;
    }
    case "StartExecution": {
      const g = failGuard(canExecuteNexoraObject(object, previous));
      if (g) return g;
      if (previous.executionState !== "Preparing") {
        return reject(previous, command, [
          err(
            "RUNTIME_INVALID_EXECUTION_TRANSITION",
            "StartExecution requires Preparing state.",
            objectId,
            command.type,
          ),
        ]);
      }
      next = buildNext(
        previous,
        { executionState: "Running" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionStarted";
      break;
    }
    case "PauseExecution": {
      const g = failGuard(canPauseNexoraObjectExecution(previous));
      if (g) return g;
      next = buildNext(
        previous,
        { executionState: "Paused" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionPaused";
      break;
    }
    case "ResumeExecution": {
      const g = failGuard(canResumeNexoraObjectExecution(object, previous));
      if (g) return g;
      next = buildNext(
        previous,
        { executionState: "Running" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionResumed";
      break;
    }
    case "CompleteExecution": {
      const g = failGuard(canCompleteNexoraObjectExecution(previous));
      if (g) return g;
      next = buildNext(
        previous,
        { executionState: "Completed" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionCompleted";
      break;
    }
    case "FailExecution": {
      if (
        previous.executionState !== "Preparing" &&
        previous.executionState !== "Running" &&
        previous.executionState !== "Paused"
      ) {
        return reject(previous, command, [
          err(
            "RUNTIME_INVALID_EXECUTION_TRANSITION",
            "FailExecution requires Preparing, Running, or Paused.",
            objectId,
            command.type,
          ),
        ]);
      }
      payload = { reason: command.reason ?? context.reason ?? null };
      next = buildNext(
        previous,
        { executionState: "Failed" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionFailed";
      break;
    }
    case "CancelExecution": {
      if (
        previous.executionState !== "Preparing" &&
        previous.executionState !== "Running" &&
        previous.executionState !== "Paused"
      ) {
        return reject(previous, command, [
          err(
            "RUNTIME_INVALID_EXECUTION_TRANSITION",
            "CancelExecution requires Preparing, Running, or Paused.",
            objectId,
            command.type,
          ),
        ]);
      }
      payload = { reason: command.reason ?? context.reason ?? null };
      next = buildNext(
        previous,
        { executionState: "Cancelled" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionCancelled";
      break;
    }
    case "ResetExecution": {
      if (previous.executionState === "Idle" && !previous.executing) {
        return accept(previous, previous, command, []);
      }
      next = buildNext(
        previous,
        { executionState: "Idle" },
        deps,
        context,
        true,
      );
      eventType = "ExecutionReset";
      break;
    }
    case "ResetRuntime": {
      const g = failGuard(canResetNexoraObjectRuntime(object));
      if (g) return g;
      const preserveVisibility = options?.preserveVisibility ?? true;
      const preserveLock = options?.preserveLock ?? true;
      next = buildNext(
        previous,
        {
          selected: false,
          focused: false,
          highlighted: false,
          dirty: false,
          loading: false,
          executionState: "Idle",
          visible: preserveVisibility ? previous.visible : true,
          locked: preserveLock ? previous.locked : false,
        },
        deps,
        context,
        true,
      );
      eventType = "RuntimeReset";
      payload = { preserveVisibility, preserveLock };
      break;
    }
    default: {
      const _exhaustive: never = command;
      void _exhaustive;
      throw new NexoraObjectRuntimeException(
        err(
          "RUNTIME_INVALID_INTERACTION_TRANSITION",
          "Unsupported runtime command.",
          objectId,
        ),
      );
    }
  }

  const result = accept(previous, next, command, []);
  if (!result.changed) {
    return result;
  }

  assertNexoraObjectRuntimeInvariants(next, lifecycle, objectId);

  if (eventType) {
    events.push(
      makeEvent(
        eventType,
        objectId,
        next.runtimeRevision,
        context,
        deps,
        payload,
      ),
    );
  }

  const shouldCommit = options?.commit !== false;
  if (shouldCommit) {
    commitToObject(object, next, previous);

    // Persistent facets must remain unchanged.
    if (
      object.identity.id !== identityBefore.id ||
      object.identity.type !== identityBefore.type ||
      object.identity.createdAt !== identityBefore.createdAt
    ) {
      throw new NexoraObjectRuntimeException(
        err(
          "RUNTIME_INVARIANT_VIOLATION",
          "Runtime mutation altered identity.",
          objectId,
          command.type,
        ),
      );
    }
    if (JSON.stringify(object.metadata) !== metadataBefore) {
      throw new NexoraObjectRuntimeException(
        err(
          "RUNTIME_INVARIANT_VIOLATION",
          "Runtime mutation altered metadata.",
          objectId,
          command.type,
        ),
      );
    }
    if (
      object.getRelationships().map((r) => r.id).join("|") !==
      relationshipsBefore
    ) {
      throw new NexoraObjectRuntimeException(
        err(
          "RUNTIME_INVARIANT_VIOLATION",
          "Runtime mutation altered relationships.",
          objectId,
          command.type,
        ),
      );
    }
    if (object.lifecycle !== lifecycleBefore || object.status !== statusBefore) {
      throw new NexoraObjectRuntimeException(
        err(
          "RUNTIME_INVARIANT_VIOLATION",
          "Runtime mutation altered lifecycle or status.",
          objectId,
          command.type,
        ),
      );
    }
  }

  return Object.freeze({
    ...result,
    events: Object.freeze(events),
  });
}

// ─── Convenience APIs ───────────────────────────────────────────────────────

function ctx(
  context?: NexoraObjectRuntimeCommandContext,
): NexoraObjectRuntimeCommandContext {
  return context ?? Object.freeze({ source: "Runtime" as const });
}

export function selectNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Select" },
    ctx(context),
    deps,
  );
}

export function deselectNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Deselect" },
    ctx(context),
    deps,
  );
}

export function focusNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Focus" },
    ctx(context),
    deps,
  );
}

export function blurNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Blur" },
    ctx(context),
    deps,
  );
}

export function showNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Show" },
    ctx(context),
    deps,
  );
}

export function hideNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Hide" },
    ctx(context),
    deps,
  );
}

export function highlightNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Highlight" },
    ctx(context),
    deps,
  );
}

export function clearNexoraObjectHighlight(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "ClearHighlight" },
    ctx(context),
    deps,
  );
}

export function lockNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Lock" },
    ctx(context),
    deps,
  );
}

export function unlockNexoraObject(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "Unlock" },
    ctx(context),
    deps,
  );
}

export function markNexoraObjectDirty(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "MarkDirty" },
    ctx(context),
    deps,
  );
}

export function markNexoraObjectClean(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "MarkClean" },
    ctx(context),
    deps,
  );
}

export function startNexoraObjectLoading(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "StartLoading" },
    ctx(context),
    deps,
  );
}

export function stopNexoraObjectLoading(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "StopLoading" },
    ctx(context),
    deps,
  );
}

export function prepareNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "PrepareExecution" },
    ctx(context),
    deps,
  );
}

export function startNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "StartExecution" },
    ctx(context),
    deps,
  );
}

export function pauseNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "PauseExecution" },
    ctx(context),
    deps,
  );
}

export function resumeNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "ResumeExecution" },
    ctx(context),
    deps,
  );
}

export function completeNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "CompleteExecution" },
    ctx(context),
    deps,
  );
}

export function failNexoraObjectExecution(
  object: MutableNexoraObject,
  reason?: string,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "FailExecution", reason },
    ctx(context),
    deps,
  );
}

export function cancelNexoraObjectExecution(
  object: MutableNexoraObject,
  reason?: string,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "CancelExecution", reason },
    ctx(context),
    deps,
  );
}

export function resetNexoraObjectExecution(
  object: MutableNexoraObject,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "ResetExecution" },
    ctx(context),
    deps,
  );
}

export function resetNexoraObjectRuntime(
  object: MutableNexoraObject,
  options?: NexoraObjectRuntimeResetOptions,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
) {
  return applyNexoraObjectRuntimeCommand(
    object,
    { type: "ResetRuntime" },
    ctx(context),
    deps,
    options,
  );
}

// ─── Collection coordinator ─────────────────────────────────────────────────

export function clearNexoraObjectCollectionFocus(
  collection: NexoraObjectRuntimeCollection,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
): readonly NexoraObjectRuntimeTransitionResult[] {
  const correlationId =
    context?.correlationId ??
    (deps ?? defaultNexoraObjectRuntimeDependencies).createEventId();
  const base = ctx({ ...ctx(context), correlationId });
  return Object.freeze(
    collection.objects.map((object) =>
      blurNexoraObject(object, base, deps),
    ),
  );
}

export function clearNexoraObjectCollectionSelection(
  collection: NexoraObjectRuntimeCollection,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
): readonly NexoraObjectRuntimeTransitionResult[] {
  const correlationId =
    context?.correlationId ??
    (deps ?? defaultNexoraObjectRuntimeDependencies).createEventId();
  const base = ctx({ ...ctx(context), correlationId });
  return Object.freeze(
    collection.objects.map((object) =>
      deselectNexoraObject(object, base, deps),
    ),
  );
}

export function focusExclusiveNexoraObject(
  collection: NexoraObjectRuntimeCollection,
  objectId: string,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
): readonly NexoraObjectRuntimeTransitionResult[] {
  const d = deps ?? defaultNexoraObjectRuntimeDependencies;
  const correlationId = context?.correlationId ?? d.createEventId();
  const base = ctx({ ...ctx(context), correlationId });
  const results: NexoraObjectRuntimeTransitionResult[] = [];

  for (const object of collection.objects) {
    if (object.identity.id === objectId) continue;
    const state = getNexoraObjectRuntimeState(object, d);
    if (state.focused) {
      results.push(blurNexoraObject(object, base, d));
    }
  }

  const target = collection.objects.find((o) => o.identity.id === objectId);
  if (!target) {
    throw new NexoraObjectRuntimeException(
      err("RUNTIME_OBJECT_NOT_FOUND", `Object not found: ${objectId}`, objectId),
    );
  }
  results.push(focusNexoraObject(target, base, d));
  return Object.freeze(results);
}

export function selectExclusiveNexoraObject(
  collection: NexoraObjectRuntimeCollection,
  objectId: string,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
): readonly NexoraObjectRuntimeTransitionResult[] {
  const d = deps ?? defaultNexoraObjectRuntimeDependencies;
  const correlationId = context?.correlationId ?? d.createEventId();
  const base = ctx({ ...ctx(context), correlationId });
  const results: NexoraObjectRuntimeTransitionResult[] = [];

  for (const object of collection.objects) {
    if (object.identity.id === objectId) continue;
    const state = getNexoraObjectRuntimeState(object, d);
    if (state.focused) results.push(blurNexoraObject(object, base, d));
    else if (state.selected) results.push(deselectNexoraObject(object, base, d));
  }

  const target = collection.objects.find((o) => o.identity.id === objectId);
  if (!target) {
    throw new NexoraObjectRuntimeException(
      err("RUNTIME_OBJECT_NOT_FOUND", `Object not found: ${objectId}`, objectId),
    );
  }
  results.push(selectNexoraObject(target, base, d));
  return Object.freeze(results);
}

export function applyNexoraObjectRuntimeBatch(
  collection: NexoraObjectRuntimeCollection,
  batch: NexoraObjectRuntimeBatchCommand,
  mode: NexoraObjectRuntimeBatchMode,
  context?: NexoraObjectRuntimeCommandContext,
  deps?: NexoraObjectRuntimeDependencies,
): NexoraObjectRuntimeBatchResult {
  const d = deps ?? defaultNexoraObjectRuntimeDependencies;
  const seen = new Set<string>();
  const normalizedIds: string[] = [];
  for (const id of batch.objectIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    normalizedIds.push(id);
  }

  const byId = new Map(
    collection.objects.map((o) => [o.identity.id, o] as const),
  );
  const planned: {
    object: MutableNexoraObject;
    result: NexoraObjectRuntimeTransitionResult;
  }[] = [];

  const dryResults: NexoraObjectRuntimeTransitionResult[] = [];
  const missing: string[] = [];

  for (const id of normalizedIds) {
    const object = byId.get(id);
    if (!object) {
      missing.push(id);
      dryResults.push(
        reject(createDefaultNexoraObjectRuntimeState(d.now()), batch.command, [
          err(
            "RUNTIME_OBJECT_NOT_FOUND",
            `Object not found: ${id}`,
            id,
            batch.command.type,
          ),
        ]),
      );
      continue;
    }
    const result = applyNexoraObjectRuntimeCommand(
      object,
      batch.command,
      ctx(context),
      d,
      { commit: false },
    );
    planned.push({ object, result });
    dryResults.push(result);
  }

  if (mode === "Atomic") {
    const anyRejected =
      missing.length > 0 || dryResults.some((r) => !r.accepted);
    if (anyRejected) {
      return Object.freeze({
        accepted: false,
        results: Object.freeze(dryResults),
        changedObjectIds: Object.freeze([]),
        rejectedObjectIds: Object.freeze([
          ...missing,
          ...planned
            .filter((p) => !p.result.accepted)
            .map((p) => p.object.identity.id),
        ]),
      });
    }
    const results = normalizedIds.map((id) => {
      const object = byId.get(id)!;
      return applyNexoraObjectRuntimeCommand(
        object,
        batch.command,
        ctx(context),
        d,
      );
    });
    return Object.freeze({
      accepted: true,
      results: Object.freeze(results),
      changedObjectIds: Object.freeze(
        results.flatMap((r, i) => (r.changed ? [normalizedIds[i]!] : [])),
      ),
      rejectedObjectIds: Object.freeze([]),
    });
  }

  // BestEffort — apply only accepted transitions
  const results: NexoraObjectRuntimeTransitionResult[] = [];
  const changedObjectIds: string[] = [];
  const rejectedObjectIds: string[] = [...missing];

  for (const id of normalizedIds) {
    const object = byId.get(id);
    if (!object) {
      results.push(
        dryResults.find((r) => r.errors[0]?.objectId === id) ??
          reject(createDefaultNexoraObjectRuntimeState(d.now()), batch.command, [
            err(
              "RUNTIME_OBJECT_NOT_FOUND",
              `Object not found: ${id}`,
              id,
              batch.command.type,
            ),
          ]),
      );
      continue;
    }
    const plannedResult = planned.find((p) => p.object.identity.id === id)!;
    if (!plannedResult.result.accepted) {
      results.push(plannedResult.result);
      rejectedObjectIds.push(id);
      continue;
    }
    const applied = applyNexoraObjectRuntimeCommand(
      object,
      batch.command,
      ctx(context),
      d,
    );
    results.push(applied);
    if (applied.changed) changedObjectIds.push(id);
  }

  return Object.freeze({
    accepted: rejectedObjectIds.length === 0,
    results: Object.freeze(results),
    changedObjectIds: Object.freeze(changedObjectIds),
    rejectedObjectIds: Object.freeze(rejectedObjectIds),
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectRuntimeState(
  state: NexoraObjectRuntimeState,
): string {
  const sanitized = freezeState({
    ...state,
    interactionState:
      state.interactionState === "Hovered" ? "Idle" : state.interactionState,
  });
  const envelope: SerializedRuntimeState = Object.freeze({
    runtimeSchemaVersion: NOL_RUNTIME_SCHEMA_VERSION,
    state: sanitized,
  });
  return JSON.stringify(envelope);
}

export function deserializeNexoraObjectRuntimeState(
  json: string,
): NexoraObjectRuntimeState {
  const parsed = JSON.parse(json) as SerializedRuntimeState;
  if (parsed.runtimeSchemaVersion !== NOL_RUNTIME_SCHEMA_VERSION) {
    throw new NexoraObjectRuntimeException(
      err(
        "RUNTIME_UNSUPPORTED_VERSION",
        `Unsupported runtime schema version: ${parsed.runtimeSchemaVersion}`,
        "unknown",
      ),
    );
  }
  const state = freezeState(parsed.state);
  const validation = validateNexoraObjectRuntimeState(state, "Active");
  if (!validation.ok) {
    throw new NexoraObjectRuntimeException(
      err(
        "RUNTIME_INVARIANT_VIOLATION",
        validation.errors.join("; "),
        "unknown",
      ),
    );
  }
  return state;
}

export function getNexoraObjectRuntimeModelSummary() {
  return Object.freeze({
    identity: NOL_RUNTIME_IDENTITY,
    runtimeModelVersion: NOL_RUNTIME_MODEL_VERSION,
    runtimeSchemaVersion: NOL_RUNTIME_SCHEMA_VERSION,
    upstream: Object.freeze([
      "NOL-1:1/UniversalNexoraObjectFoundation",
      "NOL-1:2/UniversalNexoraObjectContractModel",
    ]),
    commandDriven: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectRuntimeModel = Object.freeze({
  identity: NOL_RUNTIME_IDENTITY,
  runtimeModelVersion: NOL_RUNTIME_MODEL_VERSION,
  runtimeSchemaVersion: NOL_RUNTIME_SCHEMA_VERSION,
  tags: NOL_RUNTIME_TAGS,
  apply: applyNexoraObjectRuntimeCommand,
  summary: getNexoraObjectRuntimeModelSummary,
});
