/** NOL-4:3 — immutable semantic Director Runtime state synchronization. */
import {
  calculateDirectorRuntimeHealth,
  validateDirectorRuntimeAdapter,
  validateRuntimeRequest,
  validateRuntimeResponse,
  type NexoraDirectorRuntimeAdapterContext,
  type NexoraDirectorRuntimeAdapterRequest,
  type NexoraDirectorRuntimeAdapterResponse,
  type NexoraDirectorRuntimeAdapterState,
  type NexoraDirectorRuntimeCapabilities,
  type NexoraDirectorRuntimeCommand,
  type NexoraDirectorRuntimeHealth,
  type NexoraDirectorRuntimeRequestMode,
} from "./nexoraObjectDirectorRuntimeAdapterFoundation.ts";
import {
  validateExecutionQueue,
  validateExecutionReport,
  type NexoraDirectorRuntimeExecutionQueue,
  type NexoraDirectorRuntimeExecutionReport,
  type NexoraDirectorRuntimeExecutionState,
} from "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts";

export * from "./nexoraObjectDirectorRuntimeCommandExecutionModel.ts";

export const nexoraObjectDirectorRuntimeStateSynchronizationEngineIdentity =
  "NOL-4:3/NexoraObjectDirectorRuntimeStateSynchronizationEngine" as const;
export const nexoraObjectDirectorRuntimeStateSynchronizationEngineVersion = "1.0.0" as const;
export const nexoraObjectDirectorRuntimeStateSynchronizationSchemaVersion = "1.0.0" as const;

export type NexoraDirectorRuntimeObjectLifecycle = "Created" | "Active" | "Hidden" | "Detached" | "Removed" | "Failed";
export interface NexoraDirectorRuntimeObjectState {
  readonly runtimeObjectId: string; readonly objectId: string; readonly sceneObjectId: string;
  readonly sourcePackageId?: string; readonly sourceCommandIds: readonly string[]; readonly generation: number;
  readonly lifecycle: NexoraDirectorRuntimeObjectLifecycle; readonly visible: boolean; readonly interactive: boolean;
  readonly focused: boolean; readonly operating: boolean;
  readonly attentionLevel: "None" | "Observe" | "Notice" | "Warning" | "Critical" | "Immediate";
  readonly renderingLevel: "Hidden" | "Minimal" | "Normal" | "Important" | "Focused" | "Operation";
  readonly cameraIntent: "None" | "Center" | "Follow" | "Overview" | "Inspection" | "Operation" | "AttentionPath";
  readonly relationshipMode: "Hidden" | "Direct" | "AttentionPath" | "Expanded";
  readonly labelMode: "Hidden" | "Short" | "Full";
  readonly indicatorMode: "StatusOnly" | "Essential" | "Executive" | "Operational";
  readonly animationPending: boolean; readonly lastCommandId?: string;
  readonly lastExecutionState?: NexoraDirectorRuntimeExecutionState; readonly updatedAt: string;
}
export interface NexoraDirectorRuntimeFocusState {
  readonly focusedObjectId?: string; readonly focusedRuntimeObjectId?: string; readonly operatingObjectId?: string;
  readonly suspendedObjectId?: string; readonly state: "None" | "Focused" | "Inspecting" | "Operating" | "Historical" | "Suspended"; readonly revision: number;
}
export interface NexoraDirectorRuntimeCameraState {
  readonly intent: NexoraDirectorRuntimeObjectState["cameraIntent"]; readonly targetObjectId?: string;
  readonly targetRuntimeObjectId?: string; readonly framing: "None" | "Object" | "Neighborhood" | "Cluster" | "AttentionPath" | "Stage";
  readonly userControlPreserved: boolean; readonly transitionPending: boolean;
}
export interface NexoraDirectorRuntimeAttentionState {
  readonly dominantObjectId?: string; readonly criticalObjectIds: readonly string[]; readonly warningObjectIds: readonly string[];
  readonly attentionPathObjectIds: readonly string[]; readonly pulsingObjectIds: readonly string[]; readonly dimmedObjectIds: readonly string[]; readonly revision: number;
}
export interface NexoraDirectorRuntimeTimelineState {
  readonly mode: "Live" | "Historical" | "Replay" | "Preview"; readonly position?: string; readonly playing: boolean; readonly focusedObjectId?: string; readonly revision: number;
}
export interface NexoraDirectorRuntimeDiagnosticsState {
  readonly enabled: boolean; readonly lastExecutionState?: NexoraDirectorRuntimeExecutionState; readonly commandCount: number;
  readonly completedCommandCount: number; readonly failedCommandCount: number; readonly skippedCommandCount: number;
  readonly retryCount: number; readonly rollbackCount: number; readonly staleObjectCount: number; readonly driftCount: number;
  readonly unsupportedCapabilityCount: number; readonly warnings: readonly string[];
}
export interface NexoraDirectorRuntimeState {
  readonly runtimeId: string; readonly runtimeVersion: string; readonly revision: number;
  readonly lifecycleState: NexoraDirectorRuntimeAdapterState; readonly health: NexoraDirectorRuntimeHealth;
  readonly capabilities: NexoraDirectorRuntimeCapabilities; readonly objects: readonly NexoraDirectorRuntimeObjectState[];
  readonly focus: NexoraDirectorRuntimeFocusState; readonly camera: NexoraDirectorRuntimeCameraState;
  readonly attention: NexoraDirectorRuntimeAttentionState; readonly timeline: NexoraDirectorRuntimeTimelineState;
  readonly diagnostics: NexoraDirectorRuntimeDiagnosticsState; readonly lastExecutionId?: string;
  readonly lastSynchronizationId?: string; readonly updatedAt: string;
}
export type NexoraDirectorRuntimeSynchronizationState = "Idle" | "Evaluating" | "Ready" | "Synchronizing" | "Completed" | "PartiallyCompleted" | "Failed" | "RolledBack";
export interface NexoraDirectorRuntimeStateSynchronizationContext {
  readonly source: "DirectorRuntime" | "RuntimeAdapter" | "System" | "Diagnostics"; readonly reason?: string; readonly actorId?: string;
  readonly correlationId?: string; readonly causationId?: string; readonly occurredAt?: string; readonly preserveFailedObjects?: boolean;
  readonly preserveDetachedObjects?: boolean; readonly removeMissingObjects?: boolean; readonly recoverStaleObjects?: boolean; readonly strictCapabilities?: boolean;
}
export interface NexoraDirectorRuntimeStateSynchronizationRequest {
  readonly synchronizationId: string; readonly runtimeContext: NexoraDirectorRuntimeAdapterContext;
  readonly previousRuntimeState: NexoraDirectorRuntimeState; readonly adapterRequest: NexoraDirectorRuntimeAdapterRequest;
  readonly adapterResponse: NexoraDirectorRuntimeAdapterResponse; readonly executionReport: NexoraDirectorRuntimeExecutionReport;
  readonly executionQueue?: NexoraDirectorRuntimeExecutionQueue; readonly mode: NexoraDirectorRuntimeRequestMode;
  readonly expectedRuntimeRevision?: number; readonly context: NexoraDirectorRuntimeStateSynchronizationContext;
}
export type NexoraDirectorRuntimeStateOperationType =
  | "CreateRuntimeObject" | "ActivateRuntimeObject" | "UpdateRuntimeObject" | "ReuseRuntimeObject" | "ShowRuntimeObject" | "HideRuntimeObject"
  | "DetachRuntimeObject" | "RemoveRuntimeObject" | "FailRuntimeObject" | "UpdateInteractionState" | "UpdateFocusState" | "UpdateCameraState"
  | "UpdateAttentionState" | "UpdateAnimationState" | "UpdateRelationshipState" | "UpdateIndicatorState" | "UpdateLabelState"
  | "UpdateTimelineState" | "UpdateDiagnosticsState" | "UpdateRuntimeHealth";
export interface NexoraDirectorRuntimeStateOperation {
  readonly operationId: string; readonly synchronizationId: string; readonly type: NexoraDirectorRuntimeStateOperationType;
  readonly objectId?: string; readonly runtimeObjectId?: string; readonly sourceCommandId?: string; readonly order: number;
  readonly reversible: boolean; readonly previousValue?: Readonly<Record<string, unknown>>; readonly nextValue?: Readonly<Record<string, unknown>>;
  readonly dependencies: readonly string[];
}
export interface NexoraDirectorRuntimeStateDrift {
  readonly objectId?: string; readonly runtimeObjectId?: string;
  readonly type: "MissingRuntimeObject" | "UnexpectedRuntimeObject" | "IdentityMismatch" | "GenerationMismatch" | "ExecutionStateMismatch" | "VisibilityMismatch" | "FocusMismatch" | "CameraTargetMismatch" | "AttentionMismatch" | "CapabilityMismatch" | "RevisionMismatch";
  readonly recoverable: boolean; readonly message: string;
}
export type NexoraDirectorRuntimeStateSynchronizationWarningCode = "RUNTIME_STATE_SYNC_NO_CHANGES" | "RUNTIME_STATE_SYNC_PARTIAL" | "RUNTIME_STATE_SYNC_OPTIONAL_CAPABILITY_SKIPPED" | "RUNTIME_STATE_SYNC_STALE_OBJECT_RECOVERED" | "RUNTIME_STATE_SYNC_DRIFT_RECOVERED" | "RUNTIME_STATE_SYNC_FAILED_OBJECT_PRESERVED" | "RUNTIME_STATE_SYNC_DETACHED_OBJECT_PRESERVED" | "RUNTIME_STATE_SYNC_REDUCED_MOTION_APPLIED" | "RUNTIME_STATE_SYNC_CAMERA_INTENT_PRESERVED" | "RUNTIME_STATE_SYNC_ROLLBACK_NON_REVERSIBLE";
export interface NexoraDirectorRuntimeStateSynchronizationWarning { readonly code: NexoraDirectorRuntimeStateSynchronizationWarningCode; readonly message: string; readonly synchronizationId?: string; readonly objectId?: string; readonly runtimeObjectId?: string; readonly commandId?: string; readonly details?: Readonly<Record<string, unknown>>; }
export type NexoraDirectorRuntimeStateSynchronizationErrorCode = "RUNTIME_STATE_SYNC_INVALID_REQUEST" | "RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE" | "RUNTIME_STATE_SYNC_RUNTIME_ID_MISMATCH" | "RUNTIME_STATE_SYNC_INVALID_ADAPTER_RESPONSE" | "RUNTIME_STATE_SYNC_INVALID_EXECUTION_REPORT" | "RUNTIME_STATE_SYNC_COMMAND_NOT_FOUND" | "RUNTIME_STATE_SYNC_COMMAND_STATE_MISMATCH" | "RUNTIME_STATE_SYNC_DUPLICATE_OBJECT_ID" | "RUNTIME_STATE_SYNC_DUPLICATE_RUNTIME_OBJECT_ID" | "RUNTIME_STATE_SYNC_DUPLICATE_OPERATION_ID" | "RUNTIME_STATE_SYNC_IDENTITY_MISMATCH" | "RUNTIME_STATE_SYNC_STALE_OBJECT" | "RUNTIME_STATE_SYNC_DRIFT" | "RUNTIME_STATE_SYNC_REQUIRED_CAPABILITY_UNAVAILABLE" | "RUNTIME_STATE_SYNC_INVALID_FOCUS" | "RUNTIME_STATE_SYNC_INVALID_CAMERA_TARGET" | "RUNTIME_STATE_SYNC_INVALID_ATTENTION_TARGET" | "RUNTIME_STATE_SYNC_INVALID_OPERATION_ORDER" | "RUNTIME_STATE_SYNC_OPERATION_DEPENDENCY_MISSING" | "RUNTIME_STATE_SYNC_OPERATION_DEPENDENCY_CYCLE" | "RUNTIME_STATE_SYNC_REVISION_CONFLICT" | "RUNTIME_STATE_SYNC_ATOMIC_REJECTED" | "RUNTIME_STATE_SYNC_ROLLBACK_UNAVAILABLE" | "RUNTIME_STATE_SYNC_RENDERER_OBJECT_FORBIDDEN" | "RUNTIME_STATE_SYNC_INVARIANT_VIOLATION" | "RUNTIME_STATE_SYNC_UNSUPPORTED_VERSION";
export interface NexoraDirectorRuntimeStateSynchronizationError { readonly code: NexoraDirectorRuntimeStateSynchronizationErrorCode; readonly message: string; readonly synchronizationId?: string; readonly runtimeId?: string; readonly objectId?: string; readonly runtimeObjectId?: string; readonly commandId?: string; readonly operationId?: string; readonly details?: Readonly<Record<string, unknown>>; }
export interface NexoraDirectorRuntimeStateSynchronizationPlan {
  readonly synchronizationId: string; readonly accepted: boolean; readonly changed: boolean; readonly noOp: boolean; readonly mode: NexoraDirectorRuntimeRequestMode;
  readonly previousRuntimeState: NexoraDirectorRuntimeState; readonly projectedRuntimeState: NexoraDirectorRuntimeState;
  readonly operations: readonly NexoraDirectorRuntimeStateOperation[]; readonly rollbackOperations: readonly NexoraDirectorRuntimeStateOperation[];
  readonly completedCommandIds: readonly string[]; readonly failedCommandIds: readonly string[]; readonly skippedCommandIds: readonly string[];
  readonly staleObjectIds: readonly string[]; readonly drift: readonly NexoraDirectorRuntimeStateDrift[];
  readonly warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[]; readonly errors: readonly NexoraDirectorRuntimeStateSynchronizationError[];
}
export type NexoraDirectorRuntimeStateSynchronizationEventType = "RuntimeStateSynchronizationStarted" | "RuntimeStateSynchronizationAccepted" | "RuntimeStateSynchronizationCompleted" | "RuntimeStateSynchronizationPartiallyCompleted" | "RuntimeStateSynchronizationRejected" | "RuntimeStateSynchronizationFailed" | "RuntimeStateSynchronizationRolledBack" | "RuntimeObjectCreated" | "RuntimeObjectUpdated" | "RuntimeObjectReused" | "RuntimeObjectShown" | "RuntimeObjectHidden" | "RuntimeObjectDetached" | "RuntimeObjectRemoved" | "RuntimeObjectFailed" | "RuntimeFocusChanged" | "RuntimeCameraChanged" | "RuntimeAttentionChanged" | "RuntimeDriftDetected" | "RuntimeHealthChanged";
export interface NexoraDirectorRuntimeStateSynchronizationEvent { readonly eventId: string; readonly synchronizationId: string; readonly runtimeId: string; readonly objectId?: string; readonly runtimeObjectId?: string; readonly type: NexoraDirectorRuntimeStateSynchronizationEventType; readonly occurredAt: string; readonly runtimeRevision: number; readonly correlationId?: string; readonly causationId?: string; readonly payload: Readonly<Record<string, unknown>>; }
export interface NexoraDirectorRuntimeStateSynchronizationRecord {
  readonly synchronizationId: string; readonly runtimeId: string; readonly accepted: boolean; readonly changed: boolean; readonly mode: NexoraDirectorRuntimeRequestMode;
  readonly revisionBefore: number; readonly revisionAfter: number; readonly createdCount: number; readonly updatedCount: number; readonly reusedCount: number;
  readonly shownCount: number; readonly hiddenCount: number; readonly detachedCount: number; readonly removedCount: number; readonly failedCount: number;
  readonly driftCount: number; readonly healthBefore: NexoraDirectorRuntimeHealth; readonly healthAfter: NexoraDirectorRuntimeHealth;
  readonly occurredAt: string; readonly warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[]; readonly errors: readonly NexoraDirectorRuntimeStateSynchronizationError[];
}
export interface NexoraDirectorRuntimeStateSynchronizationResult { readonly accepted: boolean; readonly changed: boolean; readonly simulated: boolean; readonly previousRuntimeState: NexoraDirectorRuntimeState; readonly nextRuntimeState: NexoraDirectorRuntimeState; readonly plan: NexoraDirectorRuntimeStateSynchronizationPlan; readonly events: readonly NexoraDirectorRuntimeStateSynchronizationEvent[]; readonly record: NexoraDirectorRuntimeStateSynchronizationRecord; readonly warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[]; readonly errors: readonly NexoraDirectorRuntimeStateSynchronizationError[]; }
export interface NexoraDirectorRuntimeStateSynchronizationDependencies { readonly now: () => string; readonly createRuntimeObjectId: (runtimeId: string, objectId: string) => string; readonly createOperationId: (synchronizationId: string, type: NexoraDirectorRuntimeStateOperationType, objectId?: string) => string; readonly createEventId: () => string; readonly createCheckpointId: () => string; readonly createSnapshotId: () => string; }
export interface NexoraDirectorRuntimeStateCheckpoint { readonly checkpointId: string; readonly runtimeState: NexoraDirectorRuntimeState; readonly executionReport?: NexoraDirectorRuntimeExecutionReport; readonly createdAt: string; }
export interface NexoraDirectorRuntimeStateSnapshot { readonly snapshotId: string; readonly runtimeState: NexoraDirectorRuntimeState; readonly synchronizationRecord?: NexoraDirectorRuntimeStateSynchronizationRecord; readonly createdAt: string; }
export interface NexoraDirectorRuntimeStateSynchronizationBatchRequest { readonly requests: readonly NexoraDirectorRuntimeStateSynchronizationRequest[]; readonly mode: "Atomic" | "BestEffort"; }
export interface NexoraDirectorRuntimeStateSynchronizationBatchResult { readonly accepted: boolean; readonly results: readonly NexoraDirectorRuntimeStateSynchronizationResult[]; readonly acceptedSynchronizationIds: readonly string[]; readonly rejectedSynchronizationIds: readonly string[]; readonly finalRuntimeState: NexoraDirectorRuntimeState; }
export interface NexoraDirectorRuntimeStateSimulationResult { readonly plans: readonly NexoraDirectorRuntimeStateSynchronizationPlan[]; readonly results: readonly NexoraDirectorRuntimeStateSynchronizationResult[]; readonly firstFailureSynchronizationId?: string; readonly finalProjectedRuntimeState: NexoraDirectorRuntimeState; }
export interface NexoraDirectorRuntimeExecutionReconciliation { readonly completedCommandIds: readonly string[]; readonly failedCommandIds: readonly string[]; readonly cancelledCommandIds: readonly string[]; readonly rolledBackCommandIds: readonly string[]; readonly skippedCommandIds: readonly string[]; readonly pendingCommandIds: readonly string[]; }
export interface NexoraDirectorRuntimeCapabilitySynchronization { readonly supportedCommandIds: readonly string[]; readonly skippedCommandIds: readonly string[]; readonly warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[]; readonly errors: readonly NexoraDirectorRuntimeStateSynchronizationError[]; }
export interface NexoraDirectorRuntimeStateValidationResult { readonly valid: boolean; readonly errors: readonly NexoraDirectorRuntimeStateSynchronizationError[]; readonly warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[]; }
export interface NexoraDirectorRuntimeStateSnapshotComparison { readonly equal: boolean; readonly revisionChanged: boolean; readonly lifecycleChanged: boolean; readonly healthChanged: boolean; readonly addedObjectIds: readonly string[]; readonly removedObjectIds: readonly string[]; readonly generationChangedObjectIds: readonly string[]; readonly visibilityChangedObjectIds: readonly string[]; readonly focusChanged: boolean; readonly cameraChanged: boolean; readonly attentionChanged: boolean; readonly timelineChanged: boolean; readonly diagnosticsChanged: boolean; }

export class NexoraObjectDirectorRuntimeStateSynchronizationException extends Error { constructor(message: string) { super(message); this.name = "NexoraObjectDirectorRuntimeStateSynchronizationException"; } }

function freeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((child) => freeze(child, seen)); return Object.isFrozen(value) ? value : Object.freeze(value); }
function copy<T>(value: T): T { return freeze(structuredClone(value)); }
function rec(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function frozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((x) => frozen(x, seen)); }
function stable(value: unknown): string { if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`; if (rec(value)) return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`; return JSON.stringify(value); }
function renderer(value: unknown, seen = new Set<object>()): boolean { if (typeof value === "function") return true; if (value === null || typeof value !== "object" || seen.has(value as object)) return false; seen.add(value as object); const name = (value as { constructor?: { name?: string } }).constructor?.name; if (name && /^(Mesh|Scene|Camera|Material|Geometry|Matrix|Vector|Quaternion|WebGL|WebGPU|Object3D)/i.test(name)) return true; return Object.entries(value as Record<string, unknown>).some(([k, v]) => /^(mesh|scene|cameraObject|material|geometry|matrix|vector|quaternion|renderer|coordinates|callback|uiNode)$/i.test(k) || renderer(v, seen)); }
function warning(code: NexoraDirectorRuntimeStateSynchronizationWarningCode, message: string, extra: Partial<NexoraDirectorRuntimeStateSynchronizationWarning> = {}): NexoraDirectorRuntimeStateSynchronizationWarning { return freeze({ code, message, ...extra }); }
function error(code: NexoraDirectorRuntimeStateSynchronizationErrorCode, message: string, extra: Partial<NexoraDirectorRuntimeStateSynchronizationError> = {}): NexoraDirectorRuntimeStateSynchronizationError { return freeze({ code, message, ...extra }); }
const DEFAULTS: NexoraDirectorRuntimeStateSynchronizationDependencies = freeze({ now: () => "1970-01-01T00:00:00.000Z", createRuntimeObjectId: (runtimeId: string, objectId: string) => createNexoraDirectorRuntimeObjectId(runtimeId, objectId), createOperationId: (sync: string, type: NexoraDirectorRuntimeStateOperationType, objectId?: string) => `${sync}:operation:${type}:${objectId ?? "runtime"}`, createEventId: () => "runtime-state-event", createCheckpointId: () => "runtime-state-checkpoint", createSnapshotId: () => "runtime-state-snapshot" });

export function createNexoraDirectorRuntimeObjectId(runtimeId: string, objectId: string): string { if (!runtimeId || !objectId) throw new Error("Runtime and object identity are required"); return `nexora-runtime-object:${runtimeId}:${objectId}`; }
export function createNexoraDirectorRuntimeState(context: NexoraDirectorRuntimeAdapterContext, updatedAt = context.timestamp): NexoraDirectorRuntimeState {
  const valid = validateDirectorRuntimeAdapter(context); if (!valid.valid) throw new Error(valid.errors.join("; "));
  return freeze({ runtimeId: context.runtimeId, runtimeVersion: context.engineVersion, revision: 0, lifecycleState: context.runtimeState,
    health: calculateDirectorRuntimeHealth(context.runtimeState, context.capabilities, context.compatibility), capabilities: copy(context.capabilities), objects: [],
    focus: freeze({ state: "None", revision: 0 }), camera: freeze({ intent: "None", framing: "None", userControlPreserved: true, transitionPending: false }),
    attention: freeze({ criticalObjectIds: [], warningObjectIds: [], attentionPathObjectIds: [], pulsingObjectIds: [], dimmedObjectIds: [], revision: 0 }),
    timeline: freeze({ mode: "Live", playing: false, revision: 0 }), diagnostics: freeze({ enabled: context.diagnosticsEnabled, commandCount: 0, completedCommandCount: 0, failedCommandCount: 0, skippedCommandCount: 0, retryCount: 0, rollbackCount: 0, staleObjectCount: 0, driftCount: 0, unsupportedCapabilityCount: 0, warnings: [] }), updatedAt });
}

const SYNC_TRANSITIONS: Readonly<Record<NexoraDirectorRuntimeSynchronizationState, readonly NexoraDirectorRuntimeSynchronizationState[]>> = freeze({ Idle: ["Evaluating"], Evaluating: ["Ready", "Failed"], Ready: ["Synchronizing"], Synchronizing: ["Completed", "PartiallyCompleted", "Failed"], Completed: ["Evaluating"], PartiallyCompleted: ["Evaluating"], Failed: ["RolledBack"], RolledBack: ["Evaluating"] });
export function transitionNexoraDirectorRuntimeSynchronizationState(from: NexoraDirectorRuntimeSynchronizationState, to: NexoraDirectorRuntimeSynchronizationState): NexoraDirectorRuntimeSynchronizationState { if (!SYNC_TRANSITIONS[from].includes(to)) throw new Error(`Illegal runtime state synchronization transition: ${from} -> ${to}`); return to; }

export function reconcileNexoraDirectorRuntimeExecutionReport(response: NexoraDirectorRuntimeAdapterResponse, report: NexoraDirectorRuntimeExecutionReport, queue?: NexoraDirectorRuntimeExecutionQueue): NexoraDirectorRuntimeExecutionReconciliation {
  const completed = report.completedCommands.filter((x) => x.state === "Completed").map((x) => x.commandId).sort();
  const failed = report.failedCommands.filter((x) => x.state === "Failed").map((x) => x.commandId).sort();
  const cancelled = report.failedCommands.filter((x) => x.state === "Cancelled").map((x) => x.commandId).sort();
  const rolledBack = [...report.completedCommands, ...report.failedCommands].filter((x) => x.state === "RolledBack").map((x) => x.commandId).sort();
  const known = new Set([...completed, ...failed, ...cancelled, ...rolledBack]);
  const commandIds = response.plannedCommands.map((x) => x.commandId);
  const pending = (queue?.commands.map((x) => x.commandId) ?? []).filter((id) => !known.has(id)).sort();
  const skipped = commandIds.filter((id) => !known.has(id) && !pending.includes(id)).sort();
  return freeze({ completedCommandIds: completed, failedCommandIds: failed, cancelledCommandIds: cancelled, rolledBackCommandIds: rolledBack, skippedCommandIds: skipped, pendingCommandIds: pending });
}

const MAP: Readonly<Record<NexoraDirectorRuntimeCommand["type"], readonly NexoraDirectorRuntimeStateOperationType[]>> = freeze({ CreateRuntimeObject: ["CreateRuntimeObject", "ActivateRuntimeObject"], UpdateRuntimeObject: ["UpdateRuntimeObject"], ReuseRuntimeObject: ["ReuseRuntimeObject"], RemoveRuntimeObject: ["DetachRuntimeObject", "RemoveRuntimeObject"], ShowRuntimeObject: ["ShowRuntimeObject"], HideRuntimeObject: ["HideRuntimeObject"], UpdateInteraction: ["UpdateInteractionState"], UpdateFocus: ["UpdateFocusState"], UpdateCameraIntent: ["UpdateCameraState"], UpdateAttention: ["UpdateAttentionState"], UpdateAnimation: ["UpdateAnimationState"], UpdateRelationships: ["UpdateRelationshipState"], UpdateIndicators: ["UpdateIndicatorState"], UpdateLabels: ["UpdateLabelState"], UpdateTimeline: ["UpdateTimelineState"], UpdateDiagnostics: ["UpdateDiagnosticsState"] });
export function mapNexoraDirectorRuntimeCommandToStateOperations(command: NexoraDirectorRuntimeCommand, synchronizationId: string, runtimeId: string, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): readonly NexoraDirectorRuntimeStateOperation[] {
  const objectId = command.objectId; const runtimeObjectId = objectId ? dependencies.createRuntimeObjectId(runtimeId, objectId) : command.runtimeObjectId;
  const semanticValue = freeze({ ...copy(command.payload), ...(objectId ? { objectId } : {}), ...(command.runtimeObjectId ? { sceneObjectId: command.runtimeObjectId } : {}) });
  return freeze(MAP[command.type].map((type, index) => ({ operationId: dependencies.createOperationId(synchronizationId, type, objectId), synchronizationId, type,
    ...(objectId ? { objectId } : {}), ...(runtimeObjectId ? { runtimeObjectId } : {}), sourceCommandId: command.commandId, order: command.order * 10 + index,
    reversible: type !== "RemoveRuntimeObject", nextValue: semanticValue, dependencies: index ? [dependencies.createOperationId(synchronizationId, MAP[command.type][index - 1]!, objectId)] : [] })));
}

const CATEGORY: Readonly<Record<NexoraDirectorRuntimeStateOperationType, number>> = freeze({ CreateRuntimeObject: 1, ActivateRuntimeObject: 1, UpdateRuntimeObject: 2, ReuseRuntimeObject: 2, ShowRuntimeObject: 3, HideRuntimeObject: 3, UpdateInteractionState: 4, UpdateFocusState: 5, UpdateAttentionState: 6, UpdateRelationshipState: 7, UpdateIndicatorState: 8, UpdateLabelState: 8, UpdateAnimationState: 9, UpdateCameraState: 10, UpdateTimelineState: 11, UpdateDiagnosticsState: 12, UpdateRuntimeHealth: 13, FailRuntimeObject: 13, DetachRuntimeObject: 14, RemoveRuntimeObject: 14 });
export function resolveNexoraDirectorRuntimeStateOperationOrder(operations: readonly NexoraDirectorRuntimeStateOperation[]): readonly NexoraDirectorRuntimeStateOperation[] {
  const byId = new Map(operations.map((x) => [x.operationId, x])); if (byId.size !== operations.length) throw new Error("Duplicate runtime state operation ID");
  for (const op of operations) for (const dep of op.dependencies) if (!byId.has(dep)) throw new Error(`Missing runtime state operation dependency: ${dep}`);
  const pending = [...operations]; const done = new Set<string>(); const result: NexoraDirectorRuntimeStateOperation[] = [];
  const comparator = (a: NexoraDirectorRuntimeStateOperation, b: NexoraDirectorRuntimeStateOperation) => CATEGORY[a.type] - CATEGORY[b.type] || a.order - b.order || (a.objectId ?? "").localeCompare(b.objectId ?? "") || a.operationId.localeCompare(b.operationId);
  while (pending.length) { pending.sort(comparator); const i = pending.findIndex((x) => x.dependencies.every((d) => done.has(d))); if (i < 0) throw new Error("Runtime state operation dependency cycle"); const op = pending.splice(i, 1)[0]!; result.push(op); done.add(op.operationId); }
  return freeze(result);
}

export function createNexoraDirectorRuntimeStateRollbackPlan(operations: readonly NexoraDirectorRuntimeStateOperation[]): readonly NexoraDirectorRuntimeStateOperation[] {
  const inverse: Partial<Record<NexoraDirectorRuntimeStateOperationType, NexoraDirectorRuntimeStateOperationType>> = { CreateRuntimeObject: "RemoveRuntimeObject", ActivateRuntimeObject: "DetachRuntimeObject", UpdateRuntimeObject: "UpdateRuntimeObject", ShowRuntimeObject: "HideRuntimeObject", HideRuntimeObject: "ShowRuntimeObject", UpdateFocusState: "UpdateFocusState", UpdateCameraState: "UpdateCameraState", UpdateAttentionState: "UpdateAttentionState" };
  return freeze([...resolveNexoraDirectorRuntimeStateOperationOrder(operations)].reverse().map((op, order) => ({ ...copy(op), operationId: `rollback:${op.operationId}`, type: inverse[op.type] ?? op.type, order, reversible: inverse[op.type] !== undefined,
    ...(op.nextValue !== undefined ? { previousValue: op.nextValue } : {}),
    ...(op.previousValue !== undefined ? { nextValue: op.previousValue } : {}), dependencies: [] })));
}

function payload(op: NexoraDirectorRuntimeStateOperation): Record<string, unknown> { return rec(op.nextValue) ? op.nextValue as Record<string, unknown> : {}; }
function defaultObject(state: NexoraDirectorRuntimeState, op: NexoraDirectorRuntimeStateOperation, now: string): NexoraDirectorRuntimeObjectState {
  const objectId = op.objectId!; const p = payload(op); return freeze({ runtimeObjectId: op.runtimeObjectId ?? createNexoraDirectorRuntimeObjectId(state.runtimeId, objectId), objectId,
    sceneObjectId: typeof p.sceneObjectId === "string" ? p.sceneObjectId : typeof p.runtimeObjectId === "string" ? p.runtimeObjectId : `nexora-scene-object:${objectId}`,
    ...(typeof p.sourcePackageId === "string" ? { sourcePackageId: p.sourcePackageId } : {}), sourceCommandIds: op.sourceCommandId ? [op.sourceCommandId] : [], generation: 1,
    lifecycle: "Created", visible: p.visible !== false, interactive: p.interactive === true, focused: false, operating: false, attentionLevel: "None", renderingLevel: "Normal",
    cameraIntent: "None", relationshipMode: "Hidden", labelMode: "Hidden", indicatorMode: "StatusOnly", animationPending: false,
    ...(op.sourceCommandId ? { lastCommandId: op.sourceCommandId, lastExecutionState: "Completed" as const } : {}), updatedAt: now });
}
function updateObject(object: NexoraDirectorRuntimeObjectState, op: NexoraDirectorRuntimeStateOperation, now: string): NexoraDirectorRuntimeObjectState {
  const p = payload(op); const common = { sourceCommandIds: [...new Set([...object.sourceCommandIds, ...(op.sourceCommandId ? [op.sourceCommandId] : [])])], ...(op.sourceCommandId ? { lastCommandId: op.sourceCommandId, lastExecutionState: "Completed" as const } : {}), updatedAt: now };
  switch (op.type) {
    case "ActivateRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Active" });
    case "ReuseRuntimeObject": return freeze({ ...object, ...common });
    case "ShowRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Active", visible: true, generation: object.generation + 1 });
    case "HideRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Hidden", visible: false, interactive: false, focused: false, operating: false, generation: object.generation + 1 });
    case "DetachRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Detached", visible: false, interactive: false, focused: false, operating: false, generation: object.generation + 1 });
    case "RemoveRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Removed", visible: false, interactive: false, focused: false, operating: false, generation: object.generation + 1 });
    case "FailRuntimeObject": return freeze({ ...object, ...common, lifecycle: "Failed", visible: false, interactive: false, focused: false, operating: false });
    case "UpdateInteractionState": return freeze({ ...object, ...common, interactive: p.interactive !== false, generation: object.generation + 1 });
    case "UpdateAnimationState": return freeze({ ...object, ...common, animationPending: p.animationPending !== false, generation: object.generation + 1 });
    case "UpdateRelationshipState": return freeze({ ...object, ...common, relationshipMode: (p.relationshipMode as NexoraDirectorRuntimeObjectState["relationshipMode"]) ?? "Direct", generation: object.generation + 1 });
    case "UpdateIndicatorState": return freeze({ ...object, ...common, indicatorMode: (p.indicatorMode as NexoraDirectorRuntimeObjectState["indicatorMode"]) ?? "Essential", generation: object.generation + 1 });
    case "UpdateLabelState": return freeze({ ...object, ...common, labelMode: (p.labelMode as NexoraDirectorRuntimeObjectState["labelMode"]) ?? "Short", generation: object.generation + 1 });
    default: return freeze({ ...object, ...common, ...p, runtimeObjectId: object.runtimeObjectId, objectId: object.objectId, sceneObjectId: object.sceneObjectId, generation: object.generation + 1 });
  }
}

export function synchronizeNexoraDirectorRuntimeFocusState(previous: NexoraDirectorRuntimeFocusState, objects: readonly NexoraDirectorRuntimeObjectState[], operation?: NexoraDirectorRuntimeStateOperation): NexoraDirectorRuntimeFocusState {
  const eligible = objects.filter((x) => x.visible && !["Hidden", "Detached", "Removed", "Failed"].includes(x.lifecycle)); const p = operation ? payload(operation) : {};
  const requested = typeof p.objectId === "string" ? p.objectId : operation?.objectId; const target = eligible.find((x) => x.objectId === requested);
  const focused = target ?? eligible.find((x) => x.focused); if (!focused) return stable(previous) === stable({ state: "None", revision: previous.revision }) ? previous : freeze({ state: "None", revision: previous.revision + 1 });
  const operating = p.operating === true; const next = { focusedObjectId: focused.objectId, focusedRuntimeObjectId: focused.runtimeObjectId, ...(operating ? { operatingObjectId: focused.objectId } : {}), state: operating ? "Operating" as const : "Focused" as const, revision: previous.revision + 1 };
  return stable({ ...next, revision: previous.revision }) === stable(previous) ? previous : freeze(next);
}
export function synchronizeNexoraDirectorRuntimeCameraState(previous: NexoraDirectorRuntimeCameraState, objects: readonly NexoraDirectorRuntimeObjectState[], operation?: NexoraDirectorRuntimeStateOperation, supported = true): NexoraDirectorRuntimeCameraState {
  if (!operation || !supported) return previous; const p = payload(operation); const id = typeof p.objectId === "string" ? p.objectId : operation.objectId; const target = objects.find((x) => x.objectId === id && x.visible && x.lifecycle === "Active");
  if (id && !target) return freeze({ intent: "None", framing: "None", userControlPreserved: previous.userControlPreserved, transitionPending: false });
  return freeze({ intent: (p.intent as NexoraDirectorRuntimeCameraState["intent"]) ?? "None", ...(target ? { targetObjectId: target.objectId, targetRuntimeObjectId: target.runtimeObjectId } : {}), framing: (p.framing as NexoraDirectorRuntimeCameraState["framing"]) ?? (target ? "Object" : "None"), userControlPreserved: p.userControlPreserved !== false, transitionPending: p.transitionPending === true });
}
function validIds(values: unknown, objects: readonly NexoraDirectorRuntimeObjectState[]): readonly string[] { const active = new Set(objects.filter((x) => x.lifecycle !== "Removed").map((x) => x.objectId)); return freeze([...new Set(Array.isArray(values) ? values.filter((x): x is string => typeof x === "string" && active.has(x)) : [])].sort()); }
export function synchronizeNexoraDirectorRuntimeAttentionState(previous: NexoraDirectorRuntimeAttentionState, objects: readonly NexoraDirectorRuntimeObjectState[], operation?: NexoraDirectorRuntimeStateOperation, reducedMotion = false): NexoraDirectorRuntimeAttentionState {
  const p = operation ? payload(operation) : {}; const next = { ...(typeof p.dominantObjectId === "string" && objects.some((x) => x.objectId === p.dominantObjectId && x.lifecycle !== "Removed") ? { dominantObjectId: p.dominantObjectId } : {}), criticalObjectIds: validIds(p.criticalObjectIds ?? previous.criticalObjectIds, objects), warningObjectIds: validIds(p.warningObjectIds ?? previous.warningObjectIds, objects), attentionPathObjectIds: validIds(p.attentionPathObjectIds ?? previous.attentionPathObjectIds, objects), pulsingObjectIds: reducedMotion ? [] : validIds(p.pulsingObjectIds ?? previous.pulsingObjectIds, objects), dimmedObjectIds: validIds(p.dimmedObjectIds ?? previous.dimmedObjectIds, objects), revision: previous.revision + 1 };
  return stable({ ...next, revision: previous.revision }) === stable(previous) ? previous : freeze(next);
}

export function resolveNexoraDirectorRuntimeCapabilitySynchronization(commands: readonly NexoraDirectorRuntimeCommand[], capabilities: NexoraDirectorRuntimeCapabilities, strict: boolean, synchronizationId?: string): NexoraDirectorRuntimeCapabilitySynchronization {
  const needed: Partial<Record<NexoraDirectorRuntimeCommand["type"], keyof NexoraDirectorRuntimeCapabilities>> = { UpdateCameraIntent: "cameraIntents", UpdateFocus: "focus", UpdateInteraction: "interaction", UpdateAnimation: "animationHints", UpdateAttention: "attention", UpdateLabels: "labels", UpdateIndicators: "indicators", UpdateRelationships: "relationships", UpdateTimeline: "timelineReplay", UpdateDiagnostics: "diagnostics" };
  const supported: string[] = [], skipped: string[] = []; const warnings: NexoraDirectorRuntimeStateSynchronizationWarning[] = [], errors: NexoraDirectorRuntimeStateSynchronizationError[] = [];
  for (const command of commands) { const feature = needed[command.type]; if (!feature || capabilities[feature]) supported.push(command.commandId); else { skipped.push(command.commandId); if (strict) errors.push(error("RUNTIME_STATE_SYNC_REQUIRED_CAPABILITY_UNAVAILABLE", `Required capability ${feature} is unavailable`, { synchronizationId, commandId: command.commandId })); else warnings.push(warning(command.type === "UpdateCameraIntent" ? "RUNTIME_STATE_SYNC_CAMERA_INTENT_PRESERVED" : "RUNTIME_STATE_SYNC_OPTIONAL_CAPABILITY_SKIPPED", `Skipped unsupported capability ${feature}`, { synchronizationId, commandId: command.commandId })); } }
  return freeze({ supportedCommandIds: supported.sort(), skippedCommandIds: skipped.sort(), warnings, errors });
}

export function synchronizeNexoraDirectorRuntimeDiagnosticsState(request: NexoraDirectorRuntimeStateSynchronizationRequest, reconciliation: NexoraDirectorRuntimeExecutionReconciliation, warnings: readonly NexoraDirectorRuntimeStateSynchronizationWarning[], drift: readonly NexoraDirectorRuntimeStateDrift[], stale: readonly string[], unsupportedCount: number): NexoraDirectorRuntimeDiagnosticsState {
  const r = request.executionReport; return freeze({ enabled: request.runtimeContext.diagnosticsEnabled, lastExecutionState: r.state,
    commandCount: request.adapterResponse.plannedCommands.length, completedCommandCount: reconciliation.completedCommandIds.length,
    failedCommandCount: reconciliation.failedCommandIds.length + reconciliation.cancelledCommandIds.length, skippedCommandCount: reconciliation.skippedCommandIds.length,
    retryCount: r.diagnostics.retries, rollbackCount: r.diagnostics.rollbackCount, staleObjectCount: stale.length, driftCount: drift.length,
    unsupportedCapabilityCount: unsupportedCount, warnings: warnings.map((x) => x.message) });
}
export function resolveNexoraDirectorRuntimeStateHealth(input: { readonly accepted: boolean; readonly mode: NexoraDirectorRuntimeRequestMode; readonly lifecycleState: NexoraDirectorRuntimeAdapterState; readonly failedCount: number; readonly drift: readonly NexoraDirectorRuntimeStateDrift[]; readonly unsupportedCapabilityCount: number; readonly corrupted?: boolean }): NexoraDirectorRuntimeHealth {
  if (input.lifecycleState === "Failed" || input.corrupted || input.drift.some((x) => !x.recoverable) || (!input.accepted && input.mode === "Atomic")) return "Unavailable";
  if (input.failedCount || input.drift.length || input.unsupportedCapabilityCount) return "Degraded"; return "Healthy";
}

export function projectNexoraDirectorRuntimeState(previous: NexoraDirectorRuntimeState, operations: readonly NexoraDirectorRuntimeStateOperation[], request: NexoraDirectorRuntimeStateSynchronizationRequest, changed = operations.length > 0): NexoraDirectorRuntimeState {
  const ordered = resolveNexoraDirectorRuntimeStateOperationOrder(operations); const now = request.context.occurredAt ?? request.runtimeContext.timestamp; let objects = previous.objects.map(copy);
  let focus = previous.focus, camera = previous.camera, attention = previous.attention, timeline = previous.timeline;
  for (const op of ordered) { if (op.type === "CreateRuntimeObject" && op.objectId && !objects.some((x) => x.objectId === op.objectId)) objects.push(defaultObject(previous, op, now)); else if (op.objectId) objects = objects.map((x) => x.objectId === op.objectId ? updateObject(x, op, now) : x);
    if (op.type === "UpdateFocusState") focus = synchronizeNexoraDirectorRuntimeFocusState(focus, objects, op);
    if (op.type === "UpdateCameraState") camera = synchronizeNexoraDirectorRuntimeCameraState(camera, objects, op, previous.capabilities.cameraIntents);
    if (op.type === "UpdateAttentionState") attention = synchronizeNexoraDirectorRuntimeAttentionState(attention, objects, op, request.runtimeContext.reducedMotion);
    if (op.type === "UpdateTimelineState") { const p = payload(op); timeline = freeze({ ...timeline, ...p, revision: timeline.revision + 1 }); }
  }
  focus = synchronizeNexoraDirectorRuntimeFocusState(focus, objects); camera = synchronizeNexoraDirectorRuntimeCameraState(camera, objects); attention = synchronizeNexoraDirectorRuntimeAttentionState(attention, objects, undefined, request.runtimeContext.reducedMotion);
  objects.sort((a, b) => a.objectId.localeCompare(b.objectId) || a.runtimeObjectId.localeCompare(b.runtimeObjectId));
  return freeze({ ...copy(previous), revision: changed ? previous.revision + 1 : previous.revision, lifecycleState: request.runtimeContext.runtimeState,
    objects, focus, camera, attention, timeline, lastExecutionId: request.executionReport.executionId, lastSynchronizationId: request.synchronizationId, updatedAt: now });
}

export function detectNexoraDirectorRuntimeStateDrift(state: NexoraDirectorRuntimeState, response: NexoraDirectorRuntimeAdapterResponse): readonly NexoraDirectorRuntimeStateDrift[] {
  const drift: NexoraDirectorRuntimeStateDrift[] = []; const objects = new Map(state.objects.map((x) => [x.objectId, x]));
  for (const command of response.plannedCommands) { if (!command.objectId) continue; const object = objects.get(command.objectId);
    if (command.type !== "CreateRuntimeObject" && !object) drift.push(freeze({ objectId: command.objectId, type: "MissingRuntimeObject", recoverable: true, message: `Runtime object ${command.objectId} is missing` }));
    if (object && object.runtimeObjectId !== createNexoraDirectorRuntimeObjectId(state.runtimeId, command.objectId)) drift.push(freeze({ objectId: command.objectId, runtimeObjectId: object.runtimeObjectId, type: "IdentityMismatch", recoverable: false, message: "Runtime object identity mismatch" }));
    if (object && command.revision !== undefined && object.generation > command.revision + 1) drift.push(freeze({ objectId: command.objectId, runtimeObjectId: object.runtimeObjectId, type: "GenerationMismatch", recoverable: true, message: "Runtime object generation is ahead of command revision" }));
    if (object && command.type === "HideRuntimeObject" && object.visible) drift.push(freeze({ objectId: command.objectId, runtimeObjectId: object.runtimeObjectId, type: "VisibilityMismatch", recoverable: true, message: "Object remains visible before completed Hide reconciliation" }));
  } return freeze(drift.sort((a, b) => (a.objectId ?? "").localeCompare(b.objectId ?? "") || a.type.localeCompare(b.type)));
}
export function findStaleNexoraDirectorRuntimeObjects(state: NexoraDirectorRuntimeState, response: NexoraDirectorRuntimeAdapterResponse, report: NexoraDirectorRuntimeExecutionReport): readonly NexoraDirectorRuntimeObjectState[] {
  const commands = new Map(response.plannedCommands.map((x) => [x.commandId, x])); const completed = new Set(report.completedCommands.map((x) => x.commandId));
  return freeze(state.objects.filter((object) => !object.lastCommandId || !commands.has(object.lastCommandId) || (object.lastCommandId && !completed.has(object.lastCommandId)) || (object.lifecycle === "Removed" && (object.focused || object.visible))).sort((a, b) => a.objectId.localeCompare(b.objectId)));
}

export function validateNexoraDirectorRuntimeStateSynchronizationRequest(request: unknown): NexoraDirectorRuntimeStateValidationResult {
  const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(request)) return freeze({ valid: false, errors: [error("RUNTIME_STATE_SYNC_INVALID_REQUEST", "Synchronization request must be an object")], warnings: [] });
  if (typeof request.synchronizationId !== "string" || !request.synchronizationId) errors.push(error("RUNTIME_STATE_SYNC_INVALID_REQUEST", "synchronizationId is required"));
  if (renderer(request)) errors.push(error("RUNTIME_STATE_SYNC_RENDERER_OBJECT_FORBIDDEN", "Renderer objects are forbidden"));
  if (!frozen(request)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_REQUEST", "Synchronization request must be deeply immutable"));
  return freeze({ valid: !errors.length, errors, warnings: [] });
}

export function evaluateNexoraDirectorRuntimeStateSynchronization(request: NexoraDirectorRuntimeStateSynchronizationRequest, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateSynchronizationPlan {
  const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; const warnings: NexoraDirectorRuntimeStateSynchronizationWarning[] = [];
  const requestValidation = validateNexoraDirectorRuntimeStateSynchronizationRequest(request); errors.push(...requestValidation.errors);
  if (request.previousRuntimeState.runtimeId !== request.runtimeContext.runtimeId || request.adapterRequest.runtimeContext.runtimeId !== request.runtimeContext.runtimeId) errors.push(error("RUNTIME_STATE_SYNC_RUNTIME_ID_MISMATCH", "Runtime IDs must match", { synchronizationId: request.synchronizationId }));
  if (request.expectedRuntimeRevision !== undefined && request.expectedRuntimeRevision !== request.previousRuntimeState.revision) errors.push(error("RUNTIME_STATE_SYNC_REVISION_CONFLICT", `Expected Runtime revision ${request.expectedRuntimeRevision}, actual ${request.previousRuntimeState.revision}`, { details: { expected: request.expectedRuntimeRevision, actual: request.previousRuntimeState.revision } }));
  if (!validateRuntimeRequest(request.adapterRequest).valid || !validateRuntimeResponse(request.adapterResponse).valid) errors.push(error("RUNTIME_STATE_SYNC_INVALID_ADAPTER_RESPONSE", "Adapter request or response is invalid"));
  if (!validateExecutionReport(request.executionReport).valid || (request.executionQueue && !validateExecutionQueue(request.executionQueue).valid)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_EXECUTION_REPORT", "Execution report or queue is invalid"));
  const reconciliation = reconcileNexoraDirectorRuntimeExecutionReport(request.adapterResponse, request.executionReport, request.executionQueue);
  const capabilities = resolveNexoraDirectorRuntimeCapabilitySynchronization(request.adapterResponse.plannedCommands, request.runtimeContext.capabilities, request.context.strictCapabilities === true || request.mode === "Atomic", request.synchronizationId); warnings.push(...capabilities.warnings); errors.push(...capabilities.errors);
  const completed = new Set(reconciliation.completedCommandIds); const supported = new Set(capabilities.supportedCommandIds);
  const commands = request.adapterResponse.plannedCommands.filter((x) => completed.has(x.commandId) && supported.has(x.commandId));
  let operations = commands.flatMap((command) => mapNexoraDirectorRuntimeCommandToStateOperations(command, request.synchronizationId, request.previousRuntimeState.runtimeId, dependencies));
  const drift = detectNexoraDirectorRuntimeStateDrift(request.previousRuntimeState, request.adapterResponse); const stale = findStaleNexoraDirectorRuntimeObjects(request.previousRuntimeState, request.adapterResponse, request.executionReport).map((x) => x.objectId);
  if (drift.some((x) => !x.recoverable)) errors.push(error("RUNTIME_STATE_SYNC_IDENTITY_MISMATCH", "Non-recoverable Runtime identity drift detected"));
  if (request.mode === "Atomic" && (reconciliation.failedCommandIds.length || reconciliation.cancelledCommandIds.length)) errors.push(error("RUNTIME_STATE_SYNC_ATOMIC_REJECTED", "Atomic synchronization rejected due to incomplete command execution"));
  if (request.mode === "BestEffort" && reconciliation.failedCommandIds.length) warnings.push(warning("RUNTIME_STATE_SYNC_PARTIAL", "BestEffort synchronization isolated failed commands"));
  operations = [...resolveNexoraDirectorRuntimeStateOperationOrder(operations)]; const changed = operations.length > 0; if (!changed && !errors.length) warnings.push(warning("RUNTIME_STATE_SYNC_NO_CHANGES", "Synchronization produced no state changes"));
  const accepted = errors.length === 0; const projected = accepted ? projectNexoraDirectorRuntimeState(request.previousRuntimeState, operations, request, changed) : request.previousRuntimeState;
  const rollbackOperations = createNexoraDirectorRuntimeStateRollbackPlan(operations);
  return freeze({ synchronizationId: request.synchronizationId, accepted, changed: accepted && changed, noOp: !changed, mode: request.mode,
    previousRuntimeState: request.previousRuntimeState, projectedRuntimeState: projected, operations, rollbackOperations,
    completedCommandIds: reconciliation.completedCommandIds, failedCommandIds: reconciliation.failedCommandIds,
    skippedCommandIds: [...new Set([...reconciliation.skippedCommandIds, ...reconciliation.cancelledCommandIds, ...capabilities.skippedCommandIds])].sort(), staleObjectIds: stale, drift, warnings, errors });
}

export function createNexoraDirectorRuntimeStateSynchronizationRecord(plan: NexoraDirectorRuntimeStateSynchronizationPlan, next: NexoraDirectorRuntimeState, occurredAt: string): NexoraDirectorRuntimeStateSynchronizationRecord {
  const count = (type: NexoraDirectorRuntimeStateOperationType) => plan.operations.filter((x) => x.type === type).length;
  return freeze({ synchronizationId: plan.synchronizationId, runtimeId: plan.previousRuntimeState.runtimeId, accepted: plan.accepted, changed: plan.changed, mode: plan.mode,
    revisionBefore: plan.previousRuntimeState.revision, revisionAfter: next.revision, createdCount: count("CreateRuntimeObject"), updatedCount: count("UpdateRuntimeObject"), reusedCount: count("ReuseRuntimeObject"), shownCount: count("ShowRuntimeObject"), hiddenCount: count("HideRuntimeObject"), detachedCount: count("DetachRuntimeObject"), removedCount: count("RemoveRuntimeObject"), failedCount: plan.failedCommandIds.length, driftCount: plan.drift.length, healthBefore: plan.previousRuntimeState.health, healthAfter: next.health, occurredAt, warnings: plan.warnings, errors: plan.errors });
}
export function applyNexoraDirectorRuntimeStateSynchronization(request: NexoraDirectorRuntimeStateSynchronizationRequest, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateSynchronizationResult {
  const plan = evaluateNexoraDirectorRuntimeStateSynchronization(request, dependencies); const simulated = request.mode === "Simulation";
  let next = !plan.accepted || !plan.changed || simulated ? request.previousRuntimeState : plan.projectedRuntimeState;
  if (plan.accepted && plan.changed && !simulated) { const health = resolveNexoraDirectorRuntimeStateHealth({ accepted: true, mode: request.mode, lifecycleState: next.lifecycleState, failedCount: plan.failedCommandIds.length, drift: plan.drift, unsupportedCapabilityCount: plan.warnings.filter((x) => x.code === "RUNTIME_STATE_SYNC_OPTIONAL_CAPABILITY_SKIPPED").length }); const reconciliation = reconcileNexoraDirectorRuntimeExecutionReport(request.adapterResponse, request.executionReport, request.executionQueue); const diagnostics = synchronizeNexoraDirectorRuntimeDiagnosticsState(request, reconciliation, plan.warnings, plan.drift, plan.staleObjectIds, plan.warnings.filter((x) => x.code.includes("CAPABILITY")).length); next = freeze({ ...copy(next), health, diagnostics }); }
  const occurredAt = request.context.occurredAt ?? dependencies.now(); const events: NexoraDirectorRuntimeStateSynchronizationEvent[] = [freeze({ eventId: dependencies.createEventId(), synchronizationId: request.synchronizationId, runtimeId: request.previousRuntimeState.runtimeId, type: plan.accepted ? (plan.failedCommandIds.length ? "RuntimeStateSynchronizationPartiallyCompleted" : "RuntimeStateSynchronizationCompleted") : "RuntimeStateSynchronizationRejected", occurredAt, runtimeRevision: next.revision, ...(request.context.correlationId ? { correlationId: request.context.correlationId } : {}), ...(request.context.causationId ? { causationId: request.context.causationId } : {}), payload: freeze({ operationCount: plan.operations.length }) })];
  return freeze({ accepted: plan.accepted, changed: plan.changed && !simulated, simulated, previousRuntimeState: request.previousRuntimeState, nextRuntimeState: next, plan, events, record: createNexoraDirectorRuntimeStateSynchronizationRecord(plan, next, occurredAt), warnings: plan.warnings, errors: plan.errors });
}

export function createNexoraDirectorRuntimeStateCheckpoint(state: NexoraDirectorRuntimeState, report?: NexoraDirectorRuntimeExecutionReport, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateCheckpoint { return freeze({ checkpointId: dependencies.createCheckpointId(), runtimeState: copy(state), ...(report ? { executionReport: copy(report) } : {}), createdAt: dependencies.now() }); }
export function restoreNexoraDirectorRuntimeStateCheckpoint(checkpoint: NexoraDirectorRuntimeStateCheckpoint): NexoraDirectorRuntimeState { return copy(checkpoint.runtimeState); }
export function simulateNexoraDirectorRuntimeStateSynchronizationSequence(requests: readonly NexoraDirectorRuntimeStateSynchronizationRequest[], continueAfterFailure = false, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateSimulationResult {
  const results: NexoraDirectorRuntimeStateSynchronizationResult[] = []; let current = requests[0]?.previousRuntimeState; let firstFailure: string | undefined;
  for (const original of requests) { const request = freeze({ ...copy(original), previousRuntimeState: current ?? original.previousRuntimeState, mode: "Simulation" as const }); const result = applyNexoraDirectorRuntimeStateSynchronization(request, dependencies); results.push(result); if (!result.accepted && !firstFailure) { firstFailure = original.synchronizationId; if (!continueAfterFailure) break; } if (result.accepted) current = result.plan.projectedRuntimeState; }
  return freeze({ plans: results.map((x) => x.plan), results, ...(firstFailure ? { firstFailureSynchronizationId: firstFailure } : {}), finalProjectedRuntimeState: current ?? requests[0]!.previousRuntimeState });
}
export function synchronizeNexoraDirectorRuntimeStateBatch(batch: NexoraDirectorRuntimeStateSynchronizationBatchRequest, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateSynchronizationBatchResult {
  const ids = batch.requests.map((x) => x.synchronizationId); if (new Set(ids).size !== ids.length) throw new Error("Duplicate synchronization IDs"); const results: NexoraDirectorRuntimeStateSynchronizationResult[] = []; let current = batch.requests[0]?.previousRuntimeState;
  for (const original of batch.requests) { const request = freeze({ ...copy(original), previousRuntimeState: current ?? original.previousRuntimeState, mode: batch.mode }); const result = applyNexoraDirectorRuntimeStateSynchronization(request, dependencies); results.push(result); if (result.accepted) current = result.nextRuntimeState; else if (batch.mode === "Atomic") { current = batch.requests[0]!.previousRuntimeState; break; } }
  const rejected = results.filter((x) => !x.accepted).map((x) => x.plan.synchronizationId); const atomicRejected = batch.mode === "Atomic" && rejected.length > 0;
  return freeze({ accepted: rejected.length === 0, results, acceptedSynchronizationIds: atomicRejected ? [] : results.filter((x) => x.accepted).map((x) => x.plan.synchronizationId), rejectedSynchronizationIds: rejected, finalRuntimeState: current ?? batch.requests[0]!.previousRuntimeState });
}
export function projectNexoraDirectorRuntimeStateSynchronizationHistory(records: readonly NexoraDirectorRuntimeStateSynchronizationRecord[]): readonly NexoraDirectorRuntimeStateSynchronizationRecord[] { return freeze([...records].sort((a, b) => a.revisionAfter - b.revisionAfter || a.synchronizationId.localeCompare(b.synchronizationId)).map(copy)); }
export function createNexoraDirectorRuntimeStateSnapshot(state: NexoraDirectorRuntimeState, recordValue?: NexoraDirectorRuntimeStateSynchronizationRecord, dependencies: NexoraDirectorRuntimeStateSynchronizationDependencies = DEFAULTS): NexoraDirectorRuntimeStateSnapshot { return freeze({ snapshotId: dependencies.createSnapshotId(), runtimeState: copy(state), ...(recordValue ? { synchronizationRecord: copy(recordValue) } : {}), createdAt: dependencies.now() }); }
export function compareNexoraDirectorRuntimeStateSnapshots(left: NexoraDirectorRuntimeStateSnapshot, right: NexoraDirectorRuntimeStateSnapshot): NexoraDirectorRuntimeStateSnapshotComparison {
  const l = left.runtimeState, r = right.runtimeState, lm = new Map(l.objects.map((x) => [x.objectId, x])), rm = new Map(r.objects.map((x) => [x.objectId, x])); const shared = [...lm.keys()].filter((x) => rm.has(x));
  const result = { revisionChanged: l.revision !== r.revision, lifecycleChanged: l.lifecycleState !== r.lifecycleState, healthChanged: l.health !== r.health,
    addedObjectIds: [...rm.keys()].filter((x) => !lm.has(x)).sort(), removedObjectIds: [...lm.keys()].filter((x) => !rm.has(x)).sort(),
    generationChangedObjectIds: shared.filter((x) => lm.get(x)!.generation !== rm.get(x)!.generation).sort(), visibilityChangedObjectIds: shared.filter((x) => lm.get(x)!.visible !== rm.get(x)!.visible).sort(),
    focusChanged: stable(l.focus) !== stable(r.focus), cameraChanged: stable(l.camera) !== stable(r.camera), attentionChanged: stable(l.attention) !== stable(r.attention), timelineChanged: stable(l.timeline) !== stable(r.timeline), diagnosticsChanged: stable(l.diagnostics) !== stable(r.diagnostics) };
  return freeze({ equal: !result.revisionChanged && !result.lifecycleChanged && !result.healthChanged && !result.addedObjectIds.length && !result.removedObjectIds.length && !result.generationChangedObjectIds.length && !result.visibilityChangedObjectIds.length && !result.focusChanged && !result.cameraChanged && !result.attentionChanged && !result.timelineChanged && !result.diagnosticsChanged, ...result });
}

export function validateNexoraDirectorRuntimeObjectState(value: unknown): NexoraDirectorRuntimeStateValidationResult { const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(value)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE", "Runtime object must be an object")); else { if (!Number.isInteger(value.generation) || Number(value.generation) < 1) errors.push(error("RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE", "Runtime object generation must be positive")); if (value.lifecycle === "Removed" && (value.visible || value.focused || value.operating)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE", "Removed Runtime object cannot remain active")); if (renderer(value)) errors.push(error("RUNTIME_STATE_SYNC_RENDERER_OBJECT_FORBIDDEN", "Renderer objects are forbidden")); } return freeze({ valid: !errors.length, errors, warnings: [] }); }
export function validateNexoraDirectorRuntimeState(value: unknown): NexoraDirectorRuntimeStateValidationResult {
  const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(value) || !Array.isArray(value.objects)) return freeze({ valid: false, errors: [error("RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE", "Runtime state is invalid")], warnings: [] });
  if (typeof value.runtimeId !== "string" || !value.runtimeId || !Number.isInteger(value.revision) || Number(value.revision) < 0) errors.push(error("RUNTIME_STATE_SYNC_INVALID_RUNTIME_STATE", "Runtime identity or revision is invalid"));
  const objects = value.objects as readonly unknown[]; objects.forEach((x) => errors.push(...validateNexoraDirectorRuntimeObjectState(x).errors)); const objectIds = objects.map((x) => rec(x) ? x.objectId : undefined), runtimeIds = objects.map((x) => rec(x) ? x.runtimeObjectId : undefined), sceneIds = objects.map((x) => rec(x) ? x.sceneObjectId : undefined);
  if (new Set(objectIds).size !== objectIds.length) errors.push(error("RUNTIME_STATE_SYNC_DUPLICATE_OBJECT_ID", "Object IDs must be unique")); if (new Set(runtimeIds).size !== runtimeIds.length) errors.push(error("RUNTIME_STATE_SYNC_DUPLICATE_RUNTIME_OBJECT_ID", "Runtime-object IDs must be unique")); if (new Set(sceneIds).size !== sceneIds.length) errors.push(error("RUNTIME_STATE_SYNC_IDENTITY_MISMATCH", "Scene-object IDs must be unique"));
  const activeObjects = (objects.filter(rec) as Record<string, unknown>[]).filter((x) => !["Hidden", "Detached", "Removed", "Failed"].includes(String(x.lifecycle)));
  const activeIds = new Set(activeObjects.map((x) => x.objectId)); const activeRuntimeIds = new Set(activeObjects.map((x) => x.runtimeObjectId));
  const focus = rec(value.focus) ? value.focus : {}; if (focus.focusedObjectId !== undefined && !activeIds.has(focus.focusedObjectId)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_FOCUS", "Focused object must reference an active Runtime object"));
  if (focus.operatingObjectId !== undefined && (!activeIds.has(focus.operatingObjectId) || focus.focusedObjectId !== focus.operatingObjectId)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_FOCUS", "Operating object must be the active focused object"));
  const camera = rec(value.camera) ? value.camera : {}; if (camera.targetRuntimeObjectId !== undefined && !activeRuntimeIds.has(camera.targetRuntimeObjectId)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_CAMERA_TARGET", "Camera target must reference an active Runtime object"));
  if (renderer(value)) errors.push(error("RUNTIME_STATE_SYNC_RENDERER_OBJECT_FORBIDDEN", "Renderer objects are forbidden")); if (!frozen(value)) errors.push(error("RUNTIME_STATE_SYNC_INVARIANT_VIOLATION", "Runtime state must be deeply immutable")); return freeze({ valid: !errors.length, errors, warnings: [] });
}
export function validateNexoraDirectorRuntimeStateOperation(value: unknown): NexoraDirectorRuntimeStateValidationResult { const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(value) || typeof value.operationId !== "string" || !Array.isArray(value.dependencies)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_OPERATION_ORDER", "Runtime state operation is invalid")); if (renderer(value)) errors.push(error("RUNTIME_STATE_SYNC_RENDERER_OBJECT_FORBIDDEN", "Renderer objects are forbidden")); return freeze({ valid: !errors.length, errors, warnings: [] }); }
export function validateNexoraDirectorRuntimeStateSynchronizationPlan(value: unknown): NexoraDirectorRuntimeStateValidationResult { const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(value) || !Array.isArray(value.operations)) errors.push(error("RUNTIME_STATE_SYNC_INVALID_OPERATION_ORDER", "Synchronization plan is invalid")); else { try { resolveNexoraDirectorRuntimeStateOperationOrder(value.operations as unknown as NexoraDirectorRuntimeStateOperation[]); } catch (cause) { errors.push(error("RUNTIME_STATE_SYNC_INVALID_OPERATION_ORDER", String(cause))); } } if (!frozen(value)) errors.push(error("RUNTIME_STATE_SYNC_INVARIANT_VIOLATION", "Plan must be immutable")); return freeze({ valid: !errors.length, errors, warnings: [] }); }
export function validateNexoraDirectorRuntimeStateSynchronizationResult(value: unknown): NexoraDirectorRuntimeStateValidationResult { const errors: NexoraDirectorRuntimeStateSynchronizationError[] = []; if (!rec(value) || !rec(value.plan) || !rec(value.nextRuntimeState)) errors.push(error("RUNTIME_STATE_SYNC_INVARIANT_VIOLATION", "Synchronization result is invalid")); if (!frozen(value)) errors.push(error("RUNTIME_STATE_SYNC_INVARIANT_VIOLATION", "Result must be immutable")); return freeze({ valid: !errors.length, errors, warnings: [] }); }
export function assertNexoraDirectorRuntimeStateSynchronizationInvariants(value: unknown): void { const validation = rec(value) && "operations" in value ? validateNexoraDirectorRuntimeStateSynchronizationPlan(value) : rec(value) && "nextRuntimeState" in value ? validateNexoraDirectorRuntimeStateSynchronizationResult(value) : validateNexoraDirectorRuntimeState(value); if (!validation.valid) throw new NexoraObjectDirectorRuntimeStateSynchronizationException(validation.errors.map((x) => x.message).join("; ")); }

type SerializationKind = "State" | "Plan" | "Record" | "Checkpoint" | "Snapshot";
function serialize(kind: SerializationKind, payloadValue: unknown): string { if (renderer(payloadValue)) throw new NexoraObjectDirectorRuntimeStateSynchronizationException("Renderer objects are forbidden"); return JSON.stringify({ identity: nexoraObjectDirectorRuntimeStateSynchronizationEngineIdentity, schemaVersion: nexoraObjectDirectorRuntimeStateSynchronizationSchemaVersion, kind, payload: payloadValue }); }
function deserialize<T>(json: string, kind: SerializationKind): T { const parsed: unknown = JSON.parse(json); if (!rec(parsed) || parsed.identity !== nexoraObjectDirectorRuntimeStateSynchronizationEngineIdentity || parsed.schemaVersion !== nexoraObjectDirectorRuntimeStateSynchronizationSchemaVersion || parsed.kind !== kind) throw new NexoraObjectDirectorRuntimeStateSynchronizationException("Unsupported Runtime state synchronization schema"); if (renderer(parsed.payload)) throw new NexoraObjectDirectorRuntimeStateSynchronizationException("Renderer objects are forbidden"); return freeze(parsed.payload as T); }
export const serializeNexoraDirectorRuntimeState = (value: NexoraDirectorRuntimeState): string => serialize("State", value);
export const deserializeNexoraDirectorRuntimeState = (json: string): NexoraDirectorRuntimeState => { const value = deserialize<NexoraDirectorRuntimeState>(json, "State"); const v = validateNexoraDirectorRuntimeState(value); if (!v.valid) throw new NexoraObjectDirectorRuntimeStateSynchronizationException(v.errors.map((x) => x.message).join("; ")); return value; };
export const serializeNexoraDirectorRuntimeStateSynchronizationPlan = (value: NexoraDirectorRuntimeStateSynchronizationPlan): string => serialize("Plan", value);
export const deserializeNexoraDirectorRuntimeStateSynchronizationPlan = (json: string): NexoraDirectorRuntimeStateSynchronizationPlan => deserialize(json, "Plan");
export const serializeNexoraDirectorRuntimeStateSynchronizationRecord = (value: NexoraDirectorRuntimeStateSynchronizationRecord): string => serialize("Record", value);
export const deserializeNexoraDirectorRuntimeStateSynchronizationRecord = (json: string): NexoraDirectorRuntimeStateSynchronizationRecord => deserialize(json, "Record");
export const serializeNexoraDirectorRuntimeStateCheckpoint = (value: NexoraDirectorRuntimeStateCheckpoint): string => serialize("Checkpoint", value);
export const deserializeNexoraDirectorRuntimeStateCheckpoint = (json: string): NexoraDirectorRuntimeStateCheckpoint => deserialize(json, "Checkpoint");
export const serializeNexoraDirectorRuntimeStateSnapshot = (value: NexoraDirectorRuntimeStateSnapshot): string => serialize("Snapshot", value);
export const deserializeNexoraDirectorRuntimeStateSnapshot = (json: string): NexoraDirectorRuntimeStateSnapshot => deserialize(json, "Snapshot");
