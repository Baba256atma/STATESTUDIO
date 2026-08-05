/**
 * NOL-3:5 — NexoraObject Director Camera & Focus Coordination Engine
 *
 * Canonical semantic coordination for Director camera intent, object focus,
 * visual neighborhood, and stage framing. Produces immutable coordination
 * plans only — no renderer, camera, layout, or runtime mutation.
 *
 * Upstream: NOL-3:1, NOL-3:2, NOL-3:3, and NOL-3:4 only.
 * Identity: NOL-3:5/NexoraObjectDirectorCameraFocusCoordinationEngine
 */

import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  directorSceneBindingModelIdentity,
  findBindingByObjectId,
  findBindingBySceneObjectId,
  listBindings,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingRegistry,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  type NexoraDirectorSceneSynchronizationState,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";
import {
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
  type NexoraDirectorInteractionRoutingPlan,
} from "./nexoraObjectDirectorInteractionRoutingEngine.ts";

// ─── Upstream re-exports for NOL-3:6 (Director Integration surface) ─────────

export {
  nexoraObjectDirectorIntegrationFoundationIdentity,
  nexoraObjectDirectorIntegrationFoundationVersion,
  nexoraObjectDirectorIntegrationSchemaVersion,
  validateNexoraObjectDirectorIntegrationPackage,
  validateNexoraObjectDirectorIntegrationCollection,
  assertNexoraObjectDirectorIntegrationInvariants,
  serializeNexoraObjectDirectorIntegrationPackage,
  deserializeNexoraObjectDirectorIntegrationPackage,
  serializeNexoraObjectDirectorIntegrationCollection,
  deserializeNexoraObjectDirectorIntegrationCollection,
  serializeNexoraObjectDirectorIntegrationSnapshot,
  deserializeNexoraObjectDirectorIntegrationSnapshot,
  createNexoraDirectorSceneObjectId,
  createNexoraObjectDirectorIntegrationSnapshot,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
export type {
  NexoraObjectDirectorIntegrationPackage,
  NexoraObjectDirectorIntegrationCollection,
  NexoraObjectDirectorIntegrationSnapshot,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";

export {
  directorSceneBindingModelIdentity,
  directorSceneBindingModelVersion,
  directorSceneBindingSchemaVersion,
  validateDirectorSceneBinding,
  validateDirectorSceneBindingRegistry,
  assertDirectorSceneBindingInvariants,
  serializeDirectorSceneBinding,
  deserializeDirectorSceneBinding,
  serializeDirectorSceneBindingRegistry,
  deserializeDirectorSceneBindingRegistry,
  createDirectorSceneBinding,
  bindDirectorSceneCollection,
  findBindingByObjectId,
  listBindings,
  createDirectorSceneBindingSnapshot,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
export type {
  NexoraDirectorSceneBinding,
  NexoraDirectorSceneBindingRegistry,
  NexoraDirectorSceneBindingSnapshot,
} from "./nexoraObjectDirectorSceneBindingModel.ts";

export {
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  nexoraObjectDirectorSceneSynchronizationEngineVersion,
  nexoraObjectDirectorSceneSynchronizationSchemaVersion,
  validateNexoraDirectorSceneSynchronizationState,
  validateNexoraDirectorSceneSynchronizationPlan,
  validateNexoraDirectorSceneSynchronizationResult,
  validateNexoraDirectorSceneSynchronizationRequest,
  assertNexoraDirectorSceneSynchronizationInvariants,
  serializeNexoraDirectorSceneSynchronizationState,
  deserializeNexoraDirectorSceneSynchronizationState,
  serializeNexoraDirectorSceneSynchronizationPlan,
  deserializeNexoraDirectorSceneSynchronizationPlan,
  serializeNexoraDirectorSceneSynchronizationSnapshot,
  deserializeNexoraDirectorSceneSynchronizationSnapshot,
  createNexoraDirectorSceneSynchronizationState,
  createNexoraDirectorSceneSynchronizationSnapshot,
  evaluateNexoraDirectorSceneSynchronization,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";
export type {
  NexoraDirectorSceneSynchronizationState,
  NexoraDirectorSceneSynchronizationPlan,
  NexoraDirectorSceneSynchronizationResult,
  NexoraDirectorSceneSynchronizationSnapshot,
  NexoraDirectorSceneSynchronizationRequest,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";

export {
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
  nexoraObjectDirectorInteractionRoutingEngineVersion,
  nexoraObjectDirectorInteractionRoutingSchemaVersion,
  validateInteractionEvent,
  validateRoutingPlan,
  assertInteractionRoutingInvariants,
  serializeInteractionEvent,
  deserializeInteractionEvent,
  serializeInteractionRoutingPlan,
  deserializeInteractionRoutingPlan,
  serializeInteractionRoutingSnapshot,
  deserializeInteractionRoutingSnapshot,
  routeDirectorInteraction,
  createInteractionRoutingPlan,
} from "./nexoraObjectDirectorInteractionRoutingEngine.ts";
export type {
  NexoraDirectorInteractionEvent,
  NexoraDirectorInteractionRoutingPlan,
  NexoraDirectorInteractionRoutingSnapshot,
  NexoraDirectorInteractionRoutingContext,
} from "./nexoraObjectDirectorInteractionRoutingEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraObjectDirectorCameraFocusCoordinationEngineIdentity =
  "NOL-3:5/NexoraObjectDirectorCameraFocusCoordinationEngine" as const;

export const nexoraObjectDirectorCameraFocusCoordinationEngineVersion =
  "1.0.0" as const;

export const nexoraObjectDirectorCameraFocusCoordinationSchemaVersion =
  "1.0.0" as const;

export const NOL_DIRECTOR_CAMERA_FOCUS_IDENTITY =
  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity;
export const NOL_DIRECTOR_CAMERA_FOCUS_VERSION =
  nexoraObjectDirectorCameraFocusCoordinationEngineVersion;
export const NOL_DIRECTOR_CAMERA_FOCUS_SCHEMA_VERSION =
  nexoraObjectDirectorCameraFocusCoordinationSchemaVersion;

export const NOL_DIRECTOR_CAMERA_FOCUS_UPSTREAM = Object.freeze([
  nexoraObjectDirectorIntegrationFoundationIdentity,
  directorSceneBindingModelIdentity,
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_MAX_FOCUS_STACK_DEPTH = 16;

const FOCUS_REQUEST_TYPES = Object.freeze([
  "Focus",
  "Inspect",
  "Operate",
  "Overview",
  "Follow",
  "FocusAttentionPath",
  "FocusCluster",
  "HistoricalFocus",
  "ClearFocus",
  "RestorePreviousFocus",
] as const);

const FOCUS_SOURCES = Object.freeze([
  "Director",
  "Workspace",
  "Advisor",
  "Timeline",
  "Explorer",
  "User",
  "System",
] as const);

const FOCUS_STATES = Object.freeze([
  "None",
  "Requested",
  "Focused",
  "Inspecting",
  "Operating",
  "Historical",
  "Suspended",
] as const);

const CAMERA_INTENTS = Object.freeze([
  "None",
  "Center",
  "Follow",
  "Overview",
  "Inspection",
  "Operation",
  "AttentionPath",
] as const);

const FRAMING_MODES = Object.freeze([
  "None",
  "Object",
  "Neighborhood",
  "Cluster",
  "AttentionPath",
  "Stage",
] as const);

const TARGETLESS_REQUEST_TYPES = Object.freeze(
  new Set<NexoraDirectorFocusRequest["type"]>([
    "ClearFocus",
    "Overview",
    "RestorePreviousFocus",
  ]),
);

const INSPECTION_SAFE_REQUEST_TYPES = Object.freeze(
  new Set<NexoraDirectorFocusRequest["type"]>([
    "Inspect",
    "HistoricalFocus",
    "Focus",
    "Follow",
    "FocusAttentionPath",
    "FocusCluster",
    "Overview",
    "ClearFocus",
    "RestorePreviousFocus",
  ]),
);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraDirectorFocusState =
  | "None"
  | "Requested"
  | "Focused"
  | "Inspecting"
  | "Operating"
  | "Historical"
  | "Suspended";

export type NexoraDirectorCoordinatedCameraIntent =
  | "None"
  | "Center"
  | "Follow"
  | "Overview"
  | "Inspection"
  | "Operation"
  | "AttentionPath";

export type NexoraDirectorFramingMode =
  | "None"
  | "Object"
  | "Neighborhood"
  | "Cluster"
  | "AttentionPath"
  | "Stage";

export interface NexoraDirectorFocusRequest {
  readonly requestId: string;
  readonly targetObjectId?: string;
  readonly targetSceneObjectId?: string;
  readonly type:
    | "Focus"
    | "Inspect"
    | "Operate"
    | "Overview"
    | "Follow"
    | "FocusAttentionPath"
    | "FocusCluster"
    | "HistoricalFocus"
    | "ClearFocus"
    | "RestorePreviousFocus";
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "User"
    | "System";
  readonly priority: number;
  readonly preserveUserControl?: boolean;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly reason?: string;
  readonly occurredAt?: string;
  readonly payload?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorCameraFocusContext {
  readonly integrationCollection: NexoraObjectDirectorIntegrationCollection;
  readonly bindingRegistry: NexoraDirectorSceneBindingRegistry;
  readonly synchronizationState?: NexoraDirectorSceneSynchronizationState;
  readonly routingPlans?: readonly NexoraDirectorInteractionRoutingPlan[];
  readonly currentFocus?: NexoraDirectorCameraFocusState;
  readonly userCameraActive: boolean;
  readonly userCameraLocked: boolean;
  readonly stageMode:
    | "Overview"
    | "Inspection"
    | "Presentation"
    | "Operation"
    | "Replay";
  readonly reducedMotion: boolean;
  readonly strictFocusExclusivity?: boolean;
  readonly occurredAt?: string;
}

export interface NexoraDirectorCameraFocusState {
  readonly stateId: string;
  readonly revision: number;
  readonly focusState: NexoraDirectorFocusState;
  readonly focusedObjectId?: string;
  readonly focusedSceneObjectId?: string;
  readonly suspendedObjectId?: string;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly neighborhoodSceneObjectIds: readonly string[];
  readonly attentionPathSceneObjectIds: readonly string[];
  readonly clusterSceneObjectIds: readonly string[];
  readonly dimmedSceneObjectIds: readonly string[];
  readonly preservedSceneObjectIds: readonly string[];
  readonly userControlPreserved: boolean;
  readonly activeRequestId?: string;
  readonly updatedAt: string;
}

export interface NexoraDirectorFocusTargetResolution {
  readonly accepted: boolean;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly bindingId?: string;
  readonly packageId?: string;
  readonly focusState?: NexoraDirectorFocusState;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorFocusStackEntry {
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly focusState: NexoraDirectorFocusState;
  readonly requestId: string;
  readonly source: NexoraDirectorFocusRequest["source"];
  readonly suspendedAt?: string;
}

export interface NexoraDirectorFocusStack {
  readonly entries: readonly NexoraDirectorFocusStackEntry[];
}

export type NexoraDirectorCameraPreservationDecision =
  | "Preserve"
  | "Recommend"
  | "OverrideAllowed"
  | "Blocked";

export interface NexoraDirectorFocusNeighborhoodPlan {
  readonly focusedSceneObjectId: string;
  readonly directSceneObjectIds: readonly string[];
  readonly contextualSceneObjectIds: readonly string[];
  readonly backgroundSceneObjectIds: readonly string[];
  readonly hiddenSceneObjectIds: readonly string[];
  readonly dimmedSceneObjectIds: readonly string[];
}

export interface NexoraDirectorAttentionPathFramingResult {
  readonly accepted: boolean;
  readonly rootSceneObjectId?: string;
  readonly intermediateSceneObjectIds: readonly string[];
  readonly targetSceneObjectId?: string;
  readonly preservedSceneObjectIds: readonly string[];
  readonly dimmedSceneObjectIds: readonly string[];
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly attentionPathSceneObjectIds: readonly string[];
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorClusterFramingResult {
  readonly accepted: boolean;
  readonly clusterId?: string;
  readonly representativeSceneObjectId?: string;
  readonly memberSceneObjectIds: readonly string[];
  readonly expandRecommended: boolean;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly dimmedSceneObjectIds: readonly string[];
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorOperationFramingResult {
  readonly accepted: boolean;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly neighborhoodSceneObjectIds: readonly string[];
  readonly dimmedSceneObjectIds: readonly string[];
  readonly userControlPreserved: boolean;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorHistoricalFramingResult {
  readonly accepted: boolean;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly focusState: NexoraDirectorFocusState;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly preservedSceneObjectIds: readonly string[];
  readonly dimmedSceneObjectIds: readonly string[];
  readonly recommendFollow: boolean;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorOverviewFramingResult {
  readonly accepted: boolean;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly preservedStack: boolean;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorExclusiveFocusCoordination {
  readonly dominantObjectId?: string;
  readonly dominantSceneObjectId?: string;
  readonly focusState: NexoraDirectorFocusState;
  readonly suspendedObjectId?: string;
  readonly previousFocusSuspended: boolean;
  readonly replaced: boolean;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export type NexoraDirectorCameraFocusCommandType =
  | "SetFocus"
  | "ClearFocus"
  | "SuspendFocus"
  | "RestoreFocus"
  | "SetCameraIntent"
  | "SetFramingMode"
  | "PreserveUserCamera"
  | "RecommendCameraTransition"
  | "DimBackground"
  | "RestoreBackground"
  | "RevealNeighborhood"
  | "RevealAttentionPath"
  | "RevealCluster";

export interface NexoraDirectorCameraFocusCommand {
  readonly commandId: string;
  readonly requestId: string;
  readonly type: NexoraDirectorCameraFocusCommandType;
  readonly order: number;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly reversible: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorCameraFocusTransitionPlan {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly previousState: NexoraDirectorCameraFocusState;
  readonly projectedState: NexoraDirectorCameraFocusState;
  readonly target: NexoraDirectorFocusTargetResolution;
  readonly cameraDecision: NexoraDirectorCameraPreservationDecision;
  readonly neighborhood?: NexoraDirectorFocusNeighborhoodPlan;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly commands: readonly NexoraDirectorCameraFocusCommand[];
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorCameraFocusResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly previousState: NexoraDirectorCameraFocusState;
  readonly nextState: NexoraDirectorCameraFocusState;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly plan: NexoraDirectorCameraFocusTransitionPlan;
  readonly events: readonly NexoraDirectorCameraFocusEvent[];
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export type NexoraDirectorCameraFocusInterruptionMode =
  | "Suspend"
  | "Replace"
  | "Clear";

export interface NexoraDirectorCameraFocusQueue {
  readonly requests: readonly NexoraDirectorFocusRequest[];
}

export interface NexoraDirectorCameraFocusBatchRequest {
  readonly requests: readonly NexoraDirectorFocusRequest[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraDirectorCameraFocusBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly results: readonly NexoraDirectorCameraFocusResult[];
  readonly acceptedRequestIds: readonly string[];
  readonly rejectedRequestIds: readonly string[];
  readonly nextState: NexoraDirectorCameraFocusState;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorCameraFocusSimulationOptions {
  readonly stopOnFailure?: boolean;
  readonly focusStack?: NexoraDirectorFocusStack;
}

export interface NexoraDirectorCameraFocusSimulationResult {
  readonly accepted: boolean;
  readonly plans: readonly NexoraDirectorCameraFocusTransitionPlan[];
  readonly results: readonly NexoraDirectorCameraFocusResult[];
  readonly finalState: NexoraDirectorCameraFocusState;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly firstFailureRequestId?: string;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export type NexoraDirectorCameraFocusEventType =
  | "FocusRequested"
  | "FocusAccepted"
  | "FocusRejected"
  | "FocusChanged"
  | "FocusCleared"
  | "FocusSuspended"
  | "FocusRestored"
  | "CameraIntentResolved"
  | "CameraPreserved"
  | "NeighborhoodResolved"
  | "AttentionPathFramed"
  | "ClusterFramed"
  | "OverviewResolved";

export interface NexoraDirectorCameraFocusEvent {
  readonly eventId: string;
  readonly requestId: string;
  readonly type: NexoraDirectorCameraFocusEventType;
  readonly occurredAt: string;
  readonly revision: number;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly source: NexoraDirectorFocusRequest["source"];
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorCameraFocusRecord {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly previousObjectId?: string;
  readonly nextObjectId?: string;
  readonly previousFocusState: NexoraDirectorFocusState;
  readonly nextFocusState: NexoraDirectorFocusState;
  readonly cameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly framingMode: NexoraDirectorFramingMode;
  readonly revisionBefore: number;
  readonly revisionAfter: number;
  readonly occurredAt: string;
  readonly source: NexoraDirectorFocusRequest["source"];
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
  readonly errors: readonly NexoraDirectorCameraFocusError[];
}

export interface NexoraDirectorCameraFocusHistoryProjection {
  readonly records: readonly NexoraDirectorCameraFocusRecord[];
  readonly totalAccepted: number;
  readonly totalRejected: number;
  readonly totalChanged: number;
}

export interface NexoraDirectorCameraFocusSnapshot {
  readonly snapshotId: string;
  readonly state: NexoraDirectorCameraFocusState;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly createdAt: string;
}

export interface NexoraDirectorCameraFocusSnapshotComparison {
  readonly focusTargetChanged: boolean;
  readonly focusStateChanged: boolean;
  readonly cameraIntentChanged: boolean;
  readonly framingChanged: boolean;
  readonly neighborhoodChanged: boolean;
  readonly dimmingChanged: boolean;
  readonly focusStackChanged: boolean;
  readonly userControlPreservationChanged: boolean;
  readonly previousFocusedObjectId?: string;
  readonly nextFocusedObjectId?: string;
  readonly previousCameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly nextCameraIntent: NexoraDirectorCoordinatedCameraIntent;
  readonly previousNeighborhoodSceneObjectIds: readonly string[];
  readonly nextNeighborhoodSceneObjectIds: readonly string[];
}

export type NexoraDirectorCameraFocusWarningCode =
  | "DIRECTOR_FOCUS_USER_CAMERA_PRESERVED"
  | "DIRECTOR_FOCUS_USER_CAMERA_LOCKED"
  | "DIRECTOR_FOCUS_OPERATION_READ_ONLY"
  | "DIRECTOR_FOCUS_HISTORICAL_LIMIT_APPLIED"
  | "DIRECTOR_FOCUS_TARGET_RECOVERED"
  | "DIRECTOR_FOCUS_STACK_ENTRY_SKIPPED"
  | "DIRECTOR_FOCUS_BACKGROUND_DIMMED"
  | "DIRECTOR_FOCUS_NO_CHANGE";

export interface NexoraDirectorCameraFocusWarning {
  readonly code: NexoraDirectorCameraFocusWarningCode;
  readonly message: string;
  readonly requestId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraDirectorCameraFocusErrorCode =
  | "DIRECTOR_FOCUS_INVALID_REQUEST"
  | "DIRECTOR_FOCUS_INVALID_CONTEXT"
  | "DIRECTOR_FOCUS_TARGET_NOT_FOUND"
  | "DIRECTOR_FOCUS_BINDING_NOT_FOUND"
  | "DIRECTOR_FOCUS_SCENE_IDENTITY_MISMATCH"
  | "DIRECTOR_FOCUS_TARGET_HIDDEN"
  | "DIRECTOR_FOCUS_TARGET_DISABLED"
  | "DIRECTOR_FOCUS_TARGET_REMOVED"
  | "DIRECTOR_FOCUS_OPERATION_UNAVAILABLE"
  | "DIRECTOR_FOCUS_HISTORICAL_OPERATION_FORBIDDEN"
  | "DIRECTOR_FOCUS_DUPLICATE_REQUEST_ID"
  | "DIRECTOR_FOCUS_INVALID_PRIORITY"
  | "DIRECTOR_FOCUS_INVALID_STACK"
  | "DIRECTOR_FOCUS_CAMERA_OVERRIDE_BLOCKED"
  | "DIRECTOR_FOCUS_INVALID_ATTENTION_PATH"
  | "DIRECTOR_FOCUS_INVALID_CLUSTER"
  | "DIRECTOR_FOCUS_REVISION_CONFLICT"
  | "DIRECTOR_FOCUS_INVARIANT_VIOLATION"
  | "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN"
  | "DIRECTOR_FOCUS_UNSUPPORTED_VERSION";

export interface NexoraDirectorCameraFocusError {
  readonly code: NexoraDirectorCameraFocusErrorCode;
  readonly message: string;
  readonly requestId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectDirectorCameraFocusCoordinationException extends Error {
  readonly code: NexoraDirectorCameraFocusErrorCode;
  readonly requestId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorCameraFocusError) {
    super(error.message);
    this.name = "NexoraObjectDirectorCameraFocusCoordinationException";
    this.code = error.code;
    this.requestId = error.requestId;
    this.objectId = error.objectId;
    this.sceneObjectId = error.sceneObjectId;
    this.details = error.details;
  }
}

export type NexoraDirectorCameraFocusValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly errors: readonly NexoraDirectorCameraFocusError[];
    };

export interface NexoraDirectorCameraFocusDependencies {
  readonly now: () => string;
  readonly createStateId: () => string;
  readonly createCommandId: (
    requestId: string,
    type: NexoraDirectorCameraFocusCommandType,
  ) => string;
  readonly createEventId: () => string;
  readonly createSnapshotId: () => string;
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

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function isJsonSafe(value: unknown, seen = new Set<object>()): boolean {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return typeof value !== "number" || Number.isFinite(value);
  }
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (typeof value !== "object") return false;
  if (seen.has(value as object)) return true;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isJsonSafe(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isJsonSafe(item, seen),
  );
}

function containsForbiddenRendererKeys(
  value: unknown,
  path = "",
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "function") return path || "<root>";
  if (typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = containsForbiddenRendererKeys(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("mesh") ||
      lower.includes("three") ||
      lower.includes("webgl") ||
      lower.includes("webgpu") ||
      lower.includes("html") ||
      lower.includes("dom") ||
      lower.includes("react") ||
      lower === "geometryref" ||
      lower === "materialref" ||
      lower === "sceneref" ||
      lower === "camerainstance" ||
      lower === "coordinates" ||
      lower === "worldposition" ||
      lower === "matrix4" ||
      lower === "vector3" ||
      lower === "quaternion" ||
      lower === "camera"
    ) {
      return path ? `${path}.${key}` : key;
    }
    const found = containsForbiddenRendererKeys(
      record[key],
      path ? `${path}.${key}` : key,
    );
    if (found) return found;
  }
  return null;
}

function err(
  code: NexoraDirectorCameraFocusErrorCode,
  message: string,
  extras?: Partial<NexoraDirectorCameraFocusError>,
): NexoraDirectorCameraFocusError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraDirectorCameraFocusWarningCode,
  message: string,
  extras?: Partial<NexoraDirectorCameraFocusWarning>,
): NexoraDirectorCameraFocusWarning {
  return Object.freeze({ code, message, ...extras });
}

function throwFocus(error: NexoraDirectorCameraFocusError): never {
  throw new NexoraObjectDirectorCameraFocusCoordinationException(error);
}

export function defaultDeps(): NexoraDirectorCameraFocusDependencies {
  let seq = 0;
  return Object.freeze({
    now: (): string => new Date().toISOString(),
    createStateId: (): string => {
      seq += 1;
      return `dir-focus-state:${seq}`;
    },
    createCommandId: (
      requestId: string,
      type: NexoraDirectorCameraFocusCommandType,
    ): string => {
      seq += 1;
      return `dir-focus-cmd:${requestId}:${type}:${seq}`;
    },
    createEventId: (): string => {
      seq += 1;
      return `dir-focus-evt:${seq}`;
    },
    createSnapshotId: (): string => {
      seq += 1;
      return `dir-focus-snap:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorCameraFocusDependencies,
): NexoraDirectorCameraFocusDependencies {
  return dependencies ?? defaultDeps();
}

function emptyStack(): NexoraDirectorFocusStack {
  return deepFreeze({ entries: Object.freeze([]) });
}

function packagesByObjectId(
  collection: NexoraObjectDirectorIntegrationCollection,
): Map<string, NexoraObjectDirectorIntegrationPackage> {
  const map = new Map<string, NexoraObjectDirectorIntegrationPackage>();
  for (const pkg of collection.packages) {
    map.set(pkg.objectId, pkg);
  }
  return map;
}

function packagesBySceneObjectId(
  collection: NexoraObjectDirectorIntegrationCollection,
): Map<string, NexoraObjectDirectorIntegrationPackage> {
  const map = new Map<string, NexoraObjectDirectorIntegrationPackage>();
  for (const pkg of collection.packages) {
    map.set(pkg.sceneObject.sceneObjectId, pkg);
  }
  return map;
}

function payloadFlag(
  payload: Readonly<Record<string, unknown>> | undefined,
  key: string,
  defaultValue: boolean,
): boolean {
  if (!payload || !(key in payload)) return defaultValue;
  return payload[key] === true;
}

function payloadNumber(
  payload: Readonly<Record<string, unknown>> | undefined,
  key: string,
  defaultValue: number,
): number {
  if (!payload) return defaultValue;
  const value = payload[key];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : defaultValue;
}

function payloadStringArray(
  payload: Readonly<Record<string, unknown>> | undefined,
  key: string,
): readonly string[] | undefined {
  if (!payload) return undefined;
  const value = payload[key];
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item) => typeof item === "string")) return undefined;
  return value as readonly string[];
}

function isTemporaryFocus(request: NexoraDirectorFocusRequest): boolean {
  if (payloadFlag(request.payload, "temporary", false)) return true;
  if (request.type === "HistoricalFocus") return true;
  if (request.source === "Timeline") return true;
  if (
    request.source === "System" &&
    !payloadFlag(request.payload, "permanent", false)
  ) {
    return true;
  }
  return false;
}

function isSystemSafety(request: NexoraDirectorFocusRequest): boolean {
  return (
    request.source === "System" &&
    payloadFlag(request.payload, "safetyOverride", false)
  );
}

function isAutomaticSource(source: NexoraDirectorFocusRequest["source"]): boolean {
  return (
    source === "Advisor" ||
    source === "Workspace" ||
    source === "Director" ||
    source === "Explorer"
  );
}

function focusStateForRequestType(
  type: NexoraDirectorFocusRequest["type"],
): NexoraDirectorFocusState {
  switch (type) {
    case "Inspect":
      return "Inspecting";
    case "Operate":
      return "Operating";
    case "HistoricalFocus":
      return "Historical";
    case "ClearFocus":
    case "Overview":
      return "None";
    case "RestorePreviousFocus":
      return "Focused";
    case "Focus":
    case "Follow":
    case "FocusAttentionPath":
    case "FocusCluster":
    default:
      return "Focused";
  }
}

function cameraIntentForRequest(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorCoordinatedCameraIntent {
  switch (request.type) {
    case "Operate":
      return "Operation";
    case "Inspect":
      return "Inspection";
    case "HistoricalFocus":
      if (
        context.stageMode === "Replay" ||
        payloadFlag(request.payload, "replay", false)
      ) {
        return "Follow";
      }
      return "Inspection";
    case "Overview":
    case "ClearFocus":
      return "Overview";
    case "Follow":
      return "Follow";
    case "FocusAttentionPath":
      return "AttentionPath";
    case "FocusCluster":
      return "Center";
    case "Focus":
    case "RestorePreviousFocus":
    default:
      return "Center";
  }
}

function framingModeForRequest(
  request: NexoraDirectorFocusRequest,
): NexoraDirectorFramingMode {
  switch (request.type) {
    case "Overview":
    case "ClearFocus":
      return "Stage";
    case "FocusAttentionPath":
      return "AttentionPath";
    case "FocusCluster":
      return "Cluster";
    case "Operate":
    case "Inspect":
    case "Focus":
    case "Follow":
    case "HistoricalFocus":
    case "RestorePreviousFocus":
      return "Neighborhood";
    default:
      return "Object";
  }
}

function arraysEqual(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): boolean {
  const a = left ?? [];
  const b = right ?? [];
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function sortUnique(ids: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(ids)].sort());
}

function sceneIdsInCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
): Set<string> {
  return new Set(collection.packages.map((pkg) => pkg.sceneObject.sceneObjectId));
}

function resolvePackage(
  collection: NexoraObjectDirectorIntegrationCollection,
  objectId?: string,
  sceneObjectId?: string,
): NexoraObjectDirectorIntegrationPackage | undefined {
  if (objectId) {
    const byObject = packagesByObjectId(collection).get(objectId);
    if (byObject) return byObject;
  }
  if (sceneObjectId) {
    return packagesBySceneObjectId(collection).get(sceneObjectId);
  }
  return undefined;
}

function resolveBinding(
  registry: NexoraDirectorSceneBindingRegistry,
  objectId?: string,
  sceneObjectId?: string,
): NexoraDirectorSceneBinding | undefined {
  if (objectId) {
    const byObject = findBindingByObjectId(registry, objectId);
    if (byObject) return byObject;
  }
  if (sceneObjectId) {
    return findBindingBySceneObjectId(registry, sceneObjectId);
  }
  return undefined;
}

function stateFingerprint(state: NexoraDirectorCameraFocusState): string {
  return JSON.stringify({
    focusState: state.focusState,
    focusedObjectId: state.focusedObjectId ?? null,
    focusedSceneObjectId: state.focusedSceneObjectId ?? null,
    suspendedObjectId: state.suspendedObjectId ?? null,
    cameraIntent: state.cameraIntent,
    framingMode: state.framingMode,
    neighborhoodSceneObjectIds: state.neighborhoodSceneObjectIds,
    attentionPathSceneObjectIds: state.attentionPathSceneObjectIds,
    clusterSceneObjectIds: state.clusterSceneObjectIds,
    dimmedSceneObjectIds: state.dimmedSceneObjectIds,
    preservedSceneObjectIds: state.preservedSceneObjectIds,
    userControlPreserved: state.userControlPreserved,
  });
}

function buildCommand(input: {
  readonly deps: NexoraDirectorCameraFocusDependencies;
  readonly requestId: string;
  readonly type: NexoraDirectorCameraFocusCommandType;
  readonly order: number;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly reversible?: boolean;
  readonly payload?: Readonly<Record<string, unknown>>;
}): NexoraDirectorCameraFocusCommand {
  return deepFreeze({
    commandId: input.deps.createCommandId(input.requestId, input.type),
    requestId: input.requestId,
    type: input.type,
    order: input.order,
    objectId: input.objectId,
    sceneObjectId: input.sceneObjectId,
    reversible: input.reversible ?? true,
    payload: deepFreeze({ ...(input.payload ?? {}) }),
  });
}

function makeEvent(input: {
  readonly deps: NexoraDirectorCameraFocusDependencies;
  readonly request: NexoraDirectorFocusRequest;
  readonly type: NexoraDirectorCameraFocusEventType;
  readonly revision: number;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly payload?: Readonly<Record<string, unknown>>;
}): NexoraDirectorCameraFocusEvent {
  return deepFreeze({
    eventId: input.deps.createEventId(),
    requestId: input.request.requestId,
    type: input.type,
    occurredAt: input.request.occurredAt ?? input.deps.now(),
    revision: input.revision,
    objectId: input.objectId,
    sceneObjectId: input.sceneObjectId,
    source: input.request.source,
    correlationId: input.request.correlationId,
    causationId: input.request.causationId,
    payload: deepFreeze({ ...(input.payload ?? {}) }),
  });
}

// ─── Create State ───────────────────────────────────────────────────────────

export function createNexoraDirectorCameraFocusState(
  dependencies?: NexoraDirectorCameraFocusDependencies,
): NexoraDirectorCameraFocusState {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    stateId: deps.createStateId(),
    revision: 0,
    focusState: "None",
    cameraIntent: "None",
    framingMode: "None",
    neighborhoodSceneObjectIds: Object.freeze([]),
    attentionPathSceneObjectIds: Object.freeze([]),
    clusterSceneObjectIds: Object.freeze([]),
    dimmedSceneObjectIds: Object.freeze([]),
    preservedSceneObjectIds: Object.freeze([]),
    userControlPreserved: true,
    updatedAt: deps.now(),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraDirectorFocusRequest(
  request: NexoraDirectorFocusRequest,
): NexoraDirectorCameraFocusValidationResult {
  const errors: NexoraDirectorCameraFocusError[] = [];
  if (!request?.requestId) {
    errors.push(
      err("DIRECTOR_FOCUS_INVALID_REQUEST", "requestId must be non-empty."),
    );
  }
  if (
    !(FOCUS_REQUEST_TYPES as readonly string[]).includes(request?.type)
  ) {
    errors.push(
      err("DIRECTOR_FOCUS_INVALID_REQUEST", "Unsupported focus request type.", {
        requestId: request?.requestId,
        details: { type: request?.type },
      }),
    );
  }
  if (!(FOCUS_SOURCES as readonly string[]).includes(request?.source)) {
    errors.push(
      err("DIRECTOR_FOCUS_INVALID_REQUEST", "Unsupported focus request source.", {
        requestId: request?.requestId,
        details: { source: request?.source },
      }),
    );
  }
  if (
    typeof request?.priority !== "number" ||
    !Number.isFinite(request.priority) ||
    request.priority < 0
  ) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_PRIORITY",
        "priority must be a finite non-negative number.",
        { requestId: request?.requestId, details: { priority: request?.priority } },
      ),
    );
  }
  if (
    request?.targetObjectId &&
    request?.targetSceneObjectId &&
    request.targetSceneObjectId !==
      createNexoraDirectorSceneObjectId(request.targetObjectId) &&
    !request.targetSceneObjectId.includes(request.targetObjectId)
  ) {
    // Soft identity check: explicit mismatch only when both provided and clearly inconsistent
    // via package resolution is handled later; here check canonical id when both look canonical.
    const canonical = createNexoraDirectorSceneObjectId(request.targetObjectId);
    if (
      request.targetSceneObjectId.startsWith("nexora-scene-object:") &&
      request.targetSceneObjectId !== canonical
    ) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_SCENE_IDENTITY_MISMATCH",
          "targetObjectId and targetSceneObjectId do not match.",
          {
            requestId: request.requestId,
            objectId: request.targetObjectId,
            sceneObjectId: request.targetSceneObjectId,
          },
        ),
      );
    }
  }
  if (request?.payload !== undefined && !isJsonSafe(request.payload)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_REQUEST",
        "payload must be JSON-safe.",
        { requestId: request.requestId },
      ),
    );
  }
  const forbidden = containsForbiddenRendererKeys(request);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        {
          requestId: request?.requestId,
          details: { path: forbidden },
        },
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorCameraFocusState(
  state: NexoraDirectorCameraFocusState,
  context?: NexoraDirectorCameraFocusContext,
): NexoraDirectorCameraFocusValidationResult {
  const errors: NexoraDirectorCameraFocusError[] = [];
  if (!state?.stateId) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "stateId must be non-empty.",
      ),
    );
  }
  if (!Number.isInteger(state?.revision) || state.revision < 0) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "revision must be a non-negative integer.",
        { details: { revision: state?.revision } },
      ),
    );
  }
  if (!(FOCUS_STATES as readonly string[]).includes(state?.focusState)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Invalid focusState.",
        { details: { focusState: state?.focusState } },
      ),
    );
  }
  if (!(CAMERA_INTENTS as readonly string[]).includes(state?.cameraIntent)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Invalid cameraIntent.",
        { details: { cameraIntent: state?.cameraIntent } },
      ),
    );
  }
  if (!(FRAMING_MODES as readonly string[]).includes(state?.framingMode)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Invalid framingMode.",
        { details: { framingMode: state?.framingMode } },
      ),
    );
  }
  if (
    state?.focusedSceneObjectId &&
    state.dimmedSceneObjectIds.includes(state.focusedSceneObjectId)
  ) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Focused scene object must never be dimmed.",
        {
          objectId: state.focusedObjectId,
          sceneObjectId: state.focusedSceneObjectId,
        },
      ),
    );
  }
  if (
    state?.focusState !== "None" &&
    state?.focusState !== "Suspended" &&
    !state.focusedObjectId &&
    state.focusState !== "Requested"
  ) {
    // Suspended/None/Requested may omit target; dominant focus states require identity
    if (
      state.focusState === "Focused" ||
      state.focusState === "Inspecting" ||
      state.focusState === "Operating" ||
      state.focusState === "Historical"
    ) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
          "Dominant focus requires focusedObjectId.",
          { details: { focusState: state.focusState } },
        ),
      );
    }
  }
  if (context && state.focusedObjectId) {
    const pkg = resolvePackage(
      context.integrationCollection,
      state.focusedObjectId,
      state.focusedSceneObjectId,
    );
    const binding = resolveBinding(
      context.bindingRegistry,
      state.focusedObjectId,
      state.focusedSceneObjectId,
    );
    if (!pkg) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_TARGET_NOT_FOUND",
          "Focused object is not present in integration collection.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    }
    if (!binding) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_BINDING_NOT_FOUND",
          "Focused object has no binding.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    } else if (binding.state === "Removed") {
      errors.push(
        err(
          "DIRECTOR_FOCUS_TARGET_REMOVED",
          "Focused binding is removed.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    }
    if (pkg && (!pkg.sceneObject.visible || pkg.sceneObject.renderingLevel === "Hidden")) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_TARGET_HIDDEN",
          "Focused target is hidden.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    }
    if (
      state.focusState === "Operating" &&
      pkg &&
      pkg.sceneObject.representationState !== "Operation"
    ) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_OPERATION_UNAVAILABLE",
          "Operating focus requires Operation representation.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    }
    if (
      state.focusState === "Historical" &&
      pkg &&
      pkg.sceneObject.representationState === "Operation" &&
      pkg.interaction.operable
    ) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_HISTORICAL_OPERATION_FORBIDDEN",
          "Historical focus must not expose mutable Operation.",
          {
            objectId: state.focusedObjectId,
            sceneObjectId: state.focusedSceneObjectId,
          },
        ),
      );
    }
  }
  const forbidden = containsForbiddenRendererKeys(state);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { details: { path: forbidden } },
      ),
    );
  }
  if (!isDeeplyFrozen(state)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Camera focus state must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorFocusStack(
  stack: NexoraDirectorFocusStack,
): NexoraDirectorCameraFocusValidationResult {
  const errors: NexoraDirectorCameraFocusError[] = [];
  if (!stack || !Array.isArray(stack.entries)) {
    errors.push(
      err("DIRECTOR_FOCUS_INVALID_STACK", "Focus stack entries must be an array."),
    );
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  for (let i = 0; i < stack.entries.length; i += 1) {
    const entry = stack.entries[i]!;
    if (!entry.objectId || !entry.sceneObjectId || !entry.requestId) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_INVALID_STACK",
          "Focus stack entry is missing required identity fields.",
          {
            objectId: entry.objectId,
            sceneObjectId: entry.sceneObjectId,
            details: { index: i },
          },
        ),
      );
    }
    if (i > 0) {
      const prev = stack.entries[i - 1]!;
      if (
        prev.objectId === entry.objectId &&
        prev.sceneObjectId === entry.sceneObjectId &&
        prev.focusState === entry.focusState
      ) {
        errors.push(
          err(
            "DIRECTOR_FOCUS_INVALID_STACK",
            "Duplicate adjacent focus stack entries are prohibited.",
            {
              objectId: entry.objectId,
              sceneObjectId: entry.sceneObjectId,
              details: { index: i },
            },
          ),
        );
      }
    }
  }
  const forbidden = containsForbiddenRendererKeys(stack);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { details: { path: forbidden } },
      ),
    );
  }
  if (!isDeeplyFrozen(stack)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_STACK",
        "Focus stack must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorCameraFocusTransitionPlan(
  plan: NexoraDirectorCameraFocusTransitionPlan,
): NexoraDirectorCameraFocusValidationResult {
  const errors: NexoraDirectorCameraFocusError[] = [];
  if (!plan?.requestId) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_REQUEST",
        "plan.requestId must be non-empty.",
      ),
    );
  }
  const stateValidation = validateNexoraDirectorCameraFocusState(
    plan.projectedState,
  );
  if (!stateValidation.ok) {
    errors.push(...stateValidation.errors);
  }
  const stackValidation = validateNexoraDirectorFocusStack(plan.focusStack);
  if (!stackValidation.ok) {
    errors.push(...stackValidation.errors);
  }
  for (const command of plan.commands) {
    if (!command.commandId) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
          "commandId must be non-empty.",
          { requestId: plan.requestId },
        ),
      );
    }
    if (!Number.isInteger(command.order) || command.order < 0) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
          "command order must be a non-negative integer.",
          { requestId: plan.requestId, details: { commandId: command.commandId } },
        ),
      );
    }
    if (!isJsonSafe(command.payload)) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
          "Command payload must be JSON-safe.",
          { requestId: plan.requestId, details: { commandId: command.commandId } },
        ),
      );
    }
  }
  const forbidden = containsForbiddenRendererKeys(plan);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { requestId: plan.requestId, details: { path: forbidden } },
      ),
    );
  }
  if (!isDeeplyFrozen(plan)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Transition plan must be deeply immutable.",
        { requestId: plan.requestId },
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorCameraFocusResult(
  result: NexoraDirectorCameraFocusResult,
): NexoraDirectorCameraFocusValidationResult {
  const errors: NexoraDirectorCameraFocusError[] = [];
  const planValidation = validateNexoraDirectorCameraFocusTransitionPlan(
    result.plan,
  );
  if (!planValidation.ok) {
    errors.push(...planValidation.errors);
  }
  if (!result.accepted && result.changed) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Rejected results must not report changes.",
      ),
    );
  }
  if (!isDeeplyFrozen(result)) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        "Result must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function assertNexoraDirectorCameraFocusInvariants(
  value:
    | NexoraDirectorCameraFocusState
    | NexoraDirectorFocusStack
    | NexoraDirectorCameraFocusTransitionPlan
    | NexoraDirectorCameraFocusResult
    | NexoraDirectorFocusRequest,
): void {
  let validation: NexoraDirectorCameraFocusValidationResult;
  if ("plan" in value && "nextState" in value) {
    validation = validateNexoraDirectorCameraFocusResult(value);
  } else if ("projectedState" in value && "commands" in value) {
    validation = validateNexoraDirectorCameraFocusTransitionPlan(value);
  } else if ("entries" in value) {
    validation = validateNexoraDirectorFocusStack(value);
  } else if ("requestId" in value && "type" in value && "source" in value) {
    validation = validateNexoraDirectorFocusRequest(
      value as NexoraDirectorFocusRequest,
    );
  } else {
    validation = validateNexoraDirectorCameraFocusState(
      value as NexoraDirectorCameraFocusState,
    );
  }
  if (!validation.ok) {
    throwFocus(validation.errors[0]!);
  }
}

// ─── Focus Target Resolution ────────────────────────────────────────────────

export function resolveNexoraDirectorFocusTarget(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorFocusTargetResolution {
  const requestValidation = validateNexoraDirectorFocusRequest(request);
  if (!requestValidation.ok) {
    return deepFreeze({
      accepted: false,
      warnings: Object.freeze([]),
      errors: requestValidation.errors,
    });
  }

  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];

  if (TARGETLESS_REQUEST_TYPES.has(request.type)) {
    return deepFreeze({
      accepted: true,
      focusState: focusStateForRequestType(request.type),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  let objectId = request.targetObjectId;
  let sceneObjectId = request.targetSceneObjectId;

  if (!objectId && !sceneObjectId) {
    return deepFreeze({
      accepted: false,
      warnings: Object.freeze([]),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_TARGET_NOT_FOUND",
          "Focus request is missing targetObjectId and targetSceneObjectId.",
          { requestId: request.requestId },
        ),
      ]),
    });
  }

  if (!objectId && sceneObjectId) {
    const pkgByScene = packagesBySceneObjectId(
      context.integrationCollection,
    ).get(sceneObjectId);
    objectId = pkgByScene?.objectId;
  }
  if (!sceneObjectId && objectId) {
    const pkgByObject = packagesByObjectId(context.integrationCollection).get(
      objectId,
    );
    sceneObjectId =
      pkgByObject?.sceneObject.sceneObjectId ??
      createNexoraDirectorSceneObjectId(objectId);
  }

  if (
    objectId &&
    sceneObjectId &&
    request.targetObjectId &&
    request.targetSceneObjectId
  ) {
    const pkg = resolvePackage(
      context.integrationCollection,
      objectId,
      sceneObjectId,
    );
    if (
      pkg &&
      (pkg.objectId !== objectId ||
        pkg.sceneObject.sceneObjectId !== sceneObjectId)
    ) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_SCENE_IDENTITY_MISMATCH",
          "Resolved object and scene identities are inconsistent.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      );
    }
  }

  const pkg = resolvePackage(
    context.integrationCollection,
    objectId,
    sceneObjectId,
  );
  if (!pkg) {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_TARGET_NOT_FOUND",
          "Target package was not found in the integration collection.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      ]),
    });
  }

  objectId = pkg.objectId;
  sceneObjectId = pkg.sceneObject.sceneObjectId;

  const binding = resolveBinding(
    context.bindingRegistry,
    objectId,
    sceneObjectId,
  );
  if (!binding) {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      packageId: pkg.packageId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_BINDING_NOT_FOUND",
          "Target binding was not found.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      ]),
    });
  }

  if (binding.state === "Removed") {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      bindingId: binding.bindingId,
      packageId: pkg.packageId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_TARGET_REMOVED",
          "Removed bindings cannot receive focus.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      ]),
    });
  }

  const allowBindingRecovery = payloadFlag(
    request.payload,
    "allowBindingRecovery",
    true,
  );
  if (binding.state === "Detached") {
    if (!allowBindingRecovery) {
      return deepFreeze({
        accepted: false,
        objectId,
        sceneObjectId,
        bindingId: binding.bindingId,
        packageId: pkg.packageId,
        warnings: Object.freeze(warnings),
        errors: Object.freeze([
          err(
            "DIRECTOR_FOCUS_BINDING_NOT_FOUND",
            "Detached binding recovery is not allowed.",
            {
              requestId: request.requestId,
              objectId,
              sceneObjectId,
            },
          ),
        ]),
      });
    }
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_TARGET_RECOVERED",
        "Detached binding accepted with recovery allowed.",
        {
          requestId: request.requestId,
          objectId,
          sceneObjectId,
        },
      ),
    );
  }

  const hidden =
    !pkg.sceneObject.visible ||
    pkg.sceneObject.renderingLevel === "Hidden" ||
    binding.state === "Hidden";
  const historical =
    pkg.interaction.state === "Historical" ||
    binding.metadata.lifecycle === "Historical";
  const disabled = pkg.interaction.state === "Disabled";

  if (
    hidden &&
    (request.type === "Focus" ||
      request.type === "Inspect" ||
      request.type === "Operate")
  ) {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      bindingId: binding.bindingId,
      packageId: pkg.packageId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_TARGET_HIDDEN",
          "Hidden objects cannot receive ordinary Focus, Inspect, or Operate requests.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      ]),
    });
  }

  if (historical) {
    if (
      request.type === "Operate" ||
      (request.type !== "HistoricalFocus" &&
        !INSPECTION_SAFE_REQUEST_TYPES.has(request.type))
    ) {
      return deepFreeze({
        accepted: false,
        objectId,
        sceneObjectId,
        bindingId: binding.bindingId,
        packageId: pkg.packageId,
        warnings: Object.freeze(warnings),
        errors: Object.freeze([
          err(
            "DIRECTOR_FOCUS_HISTORICAL_OPERATION_FORBIDDEN",
            "Historical objects reject non-inspection-safe focus requests.",
            {
              requestId: request.requestId,
              objectId,
              sceneObjectId,
            },
          ),
        ]),
      });
    }
    if (request.type !== "HistoricalFocus") {
      warnings.push(
        warn(
          "DIRECTOR_FOCUS_HISTORICAL_LIMIT_APPLIED",
          "Historical target limited to inspection-safe focus.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      );
    }
  }

  if (disabled && request.type === "Operate") {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      bindingId: binding.bindingId,
      packageId: pkg.packageId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_TARGET_DISABLED",
          "Disabled objects may be framed but not operated.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      ]),
    });
  }

  if (request.type === "Operate") {
    if (pkg.sceneObject.representationState !== "Operation") {
      return deepFreeze({
        accepted: false,
        objectId,
        sceneObjectId,
        bindingId: binding.bindingId,
        packageId: pkg.packageId,
        warnings: Object.freeze(warnings),
        errors: Object.freeze([
          err(
            "DIRECTOR_FOCUS_OPERATION_UNAVAILABLE",
            "Operate requires an Operation integration package.",
            {
              requestId: request.requestId,
              objectId,
              sceneObjectId,
            },
          ),
        ]),
      });
    }
    if (pkg.sceneObject.readOnly || !pkg.interaction.operable) {
      warnings.push(
        warn(
          "DIRECTOR_FOCUS_OPERATION_READ_ONLY",
          "Read-only Operation may be framed as Operating but remains read-only.",
          {
            requestId: request.requestId,
            objectId,
            sceneObjectId,
          },
        ),
      );
    }
  }

  if (errors.length > 0) {
    return deepFreeze({
      accepted: false,
      objectId,
      sceneObjectId,
      bindingId: binding.bindingId,
      packageId: pkg.packageId,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  let focusState = focusStateForRequestType(request.type);
  if (historical && request.type === "HistoricalFocus") {
    focusState = "Historical";
  } else if (historical && focusState === "Focused") {
    focusState = "Inspecting";
  }

  return deepFreeze({
    accepted: true,
    objectId,
    sceneObjectId,
    bindingId: binding.bindingId,
    packageId: pkg.packageId,
    focusState,
    warnings: Object.freeze(warnings),
    errors: Object.freeze([]),
  });
}

// ─── Camera Priority & Preservation ─────────────────────────────────────────

export function resolveNexoraDirectorCameraPriority(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): number {
  void context;
  if (isSystemSafety(request)) return 1000;
  if (request.type === "Operate") return 900;
  if (request.source === "System") return 950;
  if (request.source === "User") return 800;
  if (
    request.type === "HistoricalFocus" ||
    request.source === "Timeline"
  ) {
    return 700;
  }
  if (request.type === "FocusAttentionPath") return 600;
  if (request.source === "Advisor") return 500;
  if (request.source === "Workspace" || request.source === "Explorer") {
    return 400;
  }
  if (request.source === "Director") return 350;
  if (request.type === "Inspect" || request.type === "Follow") return 300;
  if (request.type === "Overview" || request.type === "ClearFocus") return 100;
  return Math.max(0, request.priority);
}

export function resolveNexoraDirectorCameraPreservation(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorCameraPreservationDecision {
  const explicitPreserve = request.preserveUserControl === true;
  if (context.userCameraLocked) {
    if (isSystemSafety(request)) return "OverrideAllowed";
    return "Blocked";
  }
  if (request.source === "User") {
    return "OverrideAllowed";
  }
  if (isSystemSafety(request)) {
    return "OverrideAllowed";
  }
  if (context.userCameraActive && isAutomaticSource(request.source)) {
    return "Preserve";
  }
  if (explicitPreserve) {
    return "Preserve";
  }
  if (
    request.source === "Timeline" ||
    request.type === "HistoricalFocus" ||
    request.type === "Overview" ||
    request.type === "ClearFocus"
  ) {
    return "Recommend";
  }
  return "Recommend";
}

// ─── Neighborhood & Framing Resolvers ───────────────────────────────────────

export function resolveNexoraDirectorFocusNeighborhood(
  focusedSceneObjectId: string,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorFocusNeighborhoodPlan {
  const collection = context.integrationCollection;
  const focusedPkg = packagesBySceneObjectId(collection).get(
    focusedSceneObjectId,
  );
  const allSceneIds = collection.packages.map(
    (pkg) => pkg.sceneObject.sceneObjectId,
  );
  const hiddenSet = new Set(collection.hiddenSceneObjectIds);
  for (const pkg of collection.packages) {
    if (
      !pkg.sceneObject.visible ||
      pkg.sceneObject.renderingLevel === "Hidden"
    ) {
      hiddenSet.add(pkg.sceneObject.sceneObjectId);
    }
  }

  const direct = new Set<string>();
  const contextual = new Set<string>();

  if (focusedPkg) {
    for (const anchor of focusedPkg.relationships.anchors) {
      if (anchor.enabled && anchor.sceneObjectId !== focusedSceneObjectId) {
        direct.add(anchor.sceneObjectId);
      }
    }
    if (focusedPkg.clustering.clustered) {
      for (const memberId of focusedPkg.clustering.memberSceneObjectIds) {
        if (memberId !== focusedSceneObjectId) {
          contextual.add(memberId);
        }
      }
    }
  }

  for (const pkg of collection.packages) {
    for (const anchor of pkg.relationships.anchors) {
      if (
        anchor.enabled &&
        anchor.sceneObjectId === focusedSceneObjectId &&
        pkg.sceneObject.sceneObjectId !== focusedSceneObjectId
      ) {
        direct.add(pkg.sceneObject.sceneObjectId);
      }
    }
  }

  const known = new Set<string>([
    focusedSceneObjectId,
    ...direct,
    ...contextual,
  ]);
  const background = allSceneIds.filter(
    (id) => !known.has(id) && !hiddenSet.has(id),
  );
  const critical = new Set<string>();
  for (const pkg of collection.packages) {
    if (
      pkg.sceneObject.representationState === "Operation" ||
      pkg.sceneObject.renderingLevel === "Important" ||
      pkg.sceneObject.renderingLevel === "Operation" ||
      collection.activeOperationSceneObjectId ===
        pkg.sceneObject.sceneObjectId
    ) {
      critical.add(pkg.sceneObject.sceneObjectId);
    }
  }

  const dimmed = background.filter((id) => !critical.has(id));

  return deepFreeze({
    focusedSceneObjectId,
    directSceneObjectIds: Object.freeze([...direct].sort()),
    contextualSceneObjectIds: Object.freeze([...contextual].sort()),
    backgroundSceneObjectIds: Object.freeze(background.sort()),
    hiddenSceneObjectIds: Object.freeze([...hiddenSet].sort()),
    dimmedSceneObjectIds: Object.freeze(dimmed.sort()),
  });
}

export function resolveNexoraDirectorAttentionPathFraming(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorAttentionPathFramingResult {
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];
  const path =
    payloadStringArray(request.payload, "attentionPathSceneObjectIds") ??
    context.integrationCollection.attentionSceneObjectIds;

  if (!path || path.length === 0) {
    return deepFreeze({
      accepted: false,
      intermediateSceneObjectIds: Object.freeze([]),
      preservedSceneObjectIds: Object.freeze([]),
      dimmedSceneObjectIds: Object.freeze([]),
      cameraIntent: "AttentionPath" as const,
      framingMode: "AttentionPath" as const,
      attentionPathSceneObjectIds: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_INVALID_ATTENTION_PATH",
          "Attention path is empty or missing.",
          { requestId: request.requestId },
        ),
      ]),
    });
  }

  const validIds = sceneIdsInCollection(context.integrationCollection);
  const validPath: string[] = [];
  for (const sceneObjectId of path) {
    if (!validIds.has(sceneObjectId)) {
      errors.push(
        err(
          "DIRECTOR_FOCUS_INVALID_ATTENTION_PATH",
          `Invalid attention-path member: ${sceneObjectId}`,
          { requestId: request.requestId, sceneObjectId },
        ),
      );
    } else {
      validPath.push(sceneObjectId);
    }
  }

  if (validPath.length === 0) {
    return deepFreeze({
      accepted: false,
      intermediateSceneObjectIds: Object.freeze([]),
      preservedSceneObjectIds: Object.freeze([]),
      dimmedSceneObjectIds: Object.freeze([]),
      cameraIntent: "AttentionPath" as const,
      framingMode: "AttentionPath" as const,
      attentionPathSceneObjectIds: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  const rootSceneObjectId = validPath[0];
  const targetSceneObjectId = validPath[validPath.length - 1];
  const intermediateSceneObjectIds = validPath.slice(1, -1);
  const pathSet = new Set(validPath);
  const operationOutsidePath: string[] = [];
  for (const pkg of context.integrationCollection.packages) {
    if (
      pkg.sceneObject.representationState === "Operation" &&
      !pathSet.has(pkg.sceneObject.sceneObjectId)
    ) {
      operationOutsidePath.push(pkg.sceneObject.sceneObjectId);
    }
  }
  const preserved = sortUnique([...validPath, ...operationOutsidePath]);
  const dimmed = context.integrationCollection.packages
    .map((pkg) => pkg.sceneObject.sceneObjectId)
    .filter((id) => !pathSet.has(id) && !operationOutsidePath.includes(id));

  if (dimmed.length > 0) {
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_BACKGROUND_DIMMED",
        "Background objects dimmed for attention-path framing.",
        { requestId: request.requestId },
      ),
    );
  }

  return deepFreeze({
    accepted: errors.length === 0,
    rootSceneObjectId,
    intermediateSceneObjectIds: Object.freeze(intermediateSceneObjectIds),
    targetSceneObjectId,
    preservedSceneObjectIds: preserved,
    dimmedSceneObjectIds: Object.freeze(dimmed.sort()),
    cameraIntent: "AttentionPath" as const,
    framingMode: "AttentionPath" as const,
    attentionPathSceneObjectIds: Object.freeze([...validPath]),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

export function resolveNexoraDirectorClusterFraming(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorClusterFramingResult {
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];
  const target = resolveNexoraDirectorFocusTarget(request, context);
  if (!target.accepted || !target.sceneObjectId || !target.objectId) {
    return deepFreeze({
      accepted: false,
      memberSceneObjectIds: Object.freeze([]),
      expandRecommended: false,
      cameraIntent: "Center" as const,
      framingMode: "Cluster" as const,
      dimmedSceneObjectIds: Object.freeze([]),
      warnings: Object.freeze([...target.warnings, ...warnings]),
      errors: Object.freeze([...target.errors, ...errors]),
    });
  }

  const pkg = resolvePackage(
    context.integrationCollection,
    target.objectId,
    target.sceneObjectId,
  )!;
  if (!pkg.clustering.clustered || !pkg.clustering.clusterId) {
    return deepFreeze({
      accepted: false,
      memberSceneObjectIds: Object.freeze([]),
      expandRecommended: false,
      cameraIntent: "Center" as const,
      framingMode: "Cluster" as const,
      dimmedSceneObjectIds: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_INVALID_CLUSTER",
          "Cluster must exist in integration collection.",
          {
            requestId: request.requestId,
            objectId: target.objectId,
            sceneObjectId: target.sceneObjectId,
          },
        ),
      ]),
    });
  }

  const members = pkg.clustering.memberSceneObjectIds;
  const representative =
    pkg.clustering.representativeSceneObjectId ?? target.sceneObjectId;
  if (!members.includes(representative)) {
    return deepFreeze({
      accepted: false,
      clusterId: pkg.clustering.clusterId,
      representativeSceneObjectId: representative,
      memberSceneObjectIds: Object.freeze([...members]),
      expandRecommended: false,
      cameraIntent: "Center" as const,
      framingMode: "Cluster" as const,
      dimmedSceneObjectIds: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze([
        err(
          "DIRECTOR_FOCUS_INVALID_CLUSTER",
          "Cluster representative must belong to membership.",
          {
            requestId: request.requestId,
            sceneObjectId: representative,
            details: { clusterId: pkg.clustering.clusterId },
          },
        ),
      ]),
    });
  }

  let expandRecommended = false;
  for (const memberId of members) {
    const memberPkg = packagesBySceneObjectId(
      context.integrationCollection,
    ).get(memberId);
    if (
      memberPkg &&
      (memberPkg.sceneObject.representationState === "Operation" ||
        memberPkg.interaction.state === "Operating" ||
        memberPkg.sceneObject.renderingLevel === "Focused")
    ) {
      expandRecommended = true;
      break;
    }
  }

  const memberSet = new Set(members);
  const dimmed = context.integrationCollection.packages
    .map((p) => p.sceneObject.sceneObjectId)
    .filter((id) => !memberSet.has(id));

  return deepFreeze({
    accepted: true,
    clusterId: pkg.clustering.clusterId,
    representativeSceneObjectId: representative,
    memberSceneObjectIds: Object.freeze([...members]),
    expandRecommended,
    cameraIntent: "Center" as const,
    framingMode: "Cluster" as const,
    dimmedSceneObjectIds: Object.freeze(dimmed.sort()),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

export function resolveNexoraDirectorOperationFraming(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorOperationFramingResult {
  const target = resolveNexoraDirectorFocusTarget(
    { ...request, type: "Operate" },
    context,
  );
  const warnings = [...target.warnings];
  if (!target.accepted || !target.sceneObjectId || !target.objectId) {
    return deepFreeze({
      accepted: false,
      cameraIntent: "Operation" as const,
      framingMode: "Object" as const,
      neighborhoodSceneObjectIds: Object.freeze([]),
      dimmedSceneObjectIds: Object.freeze([]),
      userControlPreserved: true,
      warnings: Object.freeze(warnings),
      errors: target.errors,
    });
  }

  const neighborhood = resolveNexoraDirectorFocusNeighborhood(
    target.sceneObjectId,
    context,
  );
  const decision = resolveNexoraDirectorCameraPreservation(request, context);
  const userControlPreserved =
    decision === "Preserve" ||
    decision === "Blocked" ||
    request.preserveUserControl !== false;

  if (neighborhood.dimmedSceneObjectIds.length > 0) {
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_BACKGROUND_DIMMED",
        "Background may dim for Operation framing.",
        {
          requestId: request.requestId,
          objectId: target.objectId,
          sceneObjectId: target.sceneObjectId,
        },
      ),
    );
  }

  return deepFreeze({
    accepted: true,
    objectId: target.objectId,
    sceneObjectId: target.sceneObjectId,
    cameraIntent: "Operation" as const,
    framingMode: "Neighborhood" as const,
    neighborhoodSceneObjectIds: Object.freeze([
      ...neighborhood.directSceneObjectIds,
      ...neighborhood.contextualSceneObjectIds,
    ]),
    dimmedSceneObjectIds: neighborhood.dimmedSceneObjectIds,
    userControlPreserved,
    warnings: Object.freeze(warnings),
    errors: Object.freeze([]),
  });
}

export function resolveNexoraDirectorHistoricalFraming(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorHistoricalFramingResult {
  const target = resolveNexoraDirectorFocusTarget(
    { ...request, type: "HistoricalFocus" },
    context,
  );
  const warnings = [...target.warnings];
  if (!target.accepted || !target.sceneObjectId || !target.objectId) {
    return deepFreeze({
      accepted: false,
      focusState: "Historical" as const,
      cameraIntent: "Inspection" as const,
      framingMode: "Neighborhood" as const,
      preservedSceneObjectIds: Object.freeze([]),
      dimmedSceneObjectIds: Object.freeze([]),
      recommendFollow: false,
      warnings: Object.freeze(warnings),
      errors: target.errors,
    });
  }

  const recommendFollow =
    context.stageMode === "Replay" ||
    payloadFlag(request.payload, "replay", false);
  const cameraIntent: NexoraDirectorCoordinatedCameraIntent = recommendFollow
    ? "Follow"
    : "Inspection";

  warnings.push(
    warn(
      "DIRECTOR_FOCUS_HISTORICAL_LIMIT_APPLIED",
      "Historical framing disables mutation routes.",
      {
        requestId: request.requestId,
        objectId: target.objectId,
        sceneObjectId: target.sceneObjectId,
      },
    ),
  );

  const neighborhood = resolveNexoraDirectorFocusNeighborhood(
    target.sceneObjectId,
    context,
  );
  const historicalPeers = context.integrationCollection.packages
    .filter((pkg) => pkg.interaction.state === "Historical")
    .map((pkg) => pkg.sceneObject.sceneObjectId);

  return deepFreeze({
    accepted: true,
    objectId: target.objectId,
    sceneObjectId: target.sceneObjectId,
    focusState: "Historical" as const,
    cameraIntent,
    framingMode: "Neighborhood" as const,
    preservedSceneObjectIds: sortUnique([
      target.sceneObjectId,
      ...historicalPeers,
      ...neighborhood.directSceneObjectIds,
    ]),
    dimmedSceneObjectIds: neighborhood.dimmedSceneObjectIds,
    recommendFollow,
    warnings: Object.freeze(warnings),
    errors: Object.freeze([]),
  });
}

export function resolveNexoraDirectorOverviewFraming(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorOverviewFramingResult {
  void context;
  const preservedStack = payloadFlag(request.payload, "preserveFocusStack", true);
  return deepFreeze({
    accepted: true,
    cameraIntent: "Overview" as const,
    framingMode: "Stage" as const,
    preservedStack,
    warnings: Object.freeze([]),
    errors: Object.freeze([]),
  });
}

// ─── Exclusive Focus ────────────────────────────────────────────────────────

export function coordinateExclusiveNexoraDirectorFocus(
  request: NexoraDirectorFocusRequest,
  resolution: NexoraDirectorFocusTargetResolution,
  current: NexoraDirectorCameraFocusState,
  context: NexoraDirectorCameraFocusContext,
): NexoraDirectorExclusiveFocusCoordination {
  void context;
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];

  if (
    request.type === "ClearFocus" ||
    request.type === "Overview"
  ) {
    return deepFreeze({
      focusState: "None" as const,
      previousFocusSuspended: false,
      replaced: current.focusState !== "None",
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  if (!resolution.accepted) {
    return deepFreeze({
      focusState: current.focusState,
      dominantObjectId: current.focusedObjectId,
      dominantSceneObjectId: current.focusedSceneObjectId,
      suspendedObjectId: current.suspendedObjectId,
      previousFocusSuspended: false,
      replaced: false,
      warnings: Object.freeze([...resolution.warnings, ...warnings]),
      errors: Object.freeze([...resolution.errors, ...errors]),
    });
  }

  const nextFocusState = resolution.focusState ?? "Focused";
  const safety = isSystemSafety(request);
  const temporary = isTemporaryFocus(request);

  if (
    current.focusState === "Operating" &&
    nextFocusState !== "Operating" &&
    !safety &&
    request.type !== "Operate"
  ) {
    if (temporary) {
      return deepFreeze({
        dominantObjectId: resolution.objectId,
        dominantSceneObjectId: resolution.sceneObjectId,
        focusState: nextFocusState,
        suspendedObjectId: current.focusedObjectId,
        previousFocusSuspended: true,
        replaced: false,
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors),
      });
    }
  }

  if (temporary && current.focusedObjectId && current.focusState !== "None") {
    return deepFreeze({
      dominantObjectId: resolution.objectId,
      dominantSceneObjectId: resolution.sceneObjectId,
      focusState: nextFocusState,
      suspendedObjectId: current.focusedObjectId,
      previousFocusSuspended: true,
      replaced: false,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  if (
    nextFocusState === "Operating" &&
    current.focusState === "Inspecting"
  ) {
    return deepFreeze({
      dominantObjectId: resolution.objectId,
      dominantSceneObjectId: resolution.sceneObjectId,
      focusState: "Operating" as const,
      suspendedObjectId: undefined,
      previousFocusSuspended: false,
      replaced: true,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  return deepFreeze({
    dominantObjectId: resolution.objectId,
    dominantSceneObjectId: resolution.sceneObjectId,
    focusState: nextFocusState,
    suspendedObjectId: temporary ? current.focusedObjectId : undefined,
    previousFocusSuspended: Boolean(temporary && current.focusedObjectId),
    replaced: Boolean(
      current.focusedObjectId &&
        current.focusedObjectId !== resolution.objectId,
    ),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

// ─── Focus Stack ────────────────────────────────────────────────────────────

export function pushNexoraDirectorFocusStack(
  stack: NexoraDirectorFocusStack,
  entry: NexoraDirectorFocusStackEntry,
  options?: { readonly maxDepth?: number },
): NexoraDirectorFocusStack {
  const maxDepth = options?.maxDepth ?? DEFAULT_MAX_FOCUS_STACK_DEPTH;
  const last = stack.entries[stack.entries.length - 1];
  if (
    last &&
    last.objectId === entry.objectId &&
    last.sceneObjectId === entry.sceneObjectId &&
    last.focusState === entry.focusState
  ) {
    throwFocus(
      err(
        "DIRECTOR_FOCUS_INVALID_STACK",
        "Duplicate adjacent focus stack entries are prohibited.",
        {
          objectId: entry.objectId,
          sceneObjectId: entry.sceneObjectId,
          requestId: entry.requestId,
        },
      ),
    );
  }
  let entries = [...stack.entries, entry];
  if (entries.length > maxDepth) {
    entries = entries.slice(entries.length - maxDepth);
  }
  return deepFreeze({ entries: Object.freeze(entries) });
}

export function popNexoraDirectorFocusStack(
  stack: NexoraDirectorFocusStack,
): {
  readonly stack: NexoraDirectorFocusStack;
  readonly entry?: NexoraDirectorFocusStackEntry;
} {
  if (stack.entries.length === 0) {
    return deepFreeze({ stack, entry: undefined });
  }
  const entry = stack.entries[stack.entries.length - 1];
  return deepFreeze({
    stack: {
      entries: Object.freeze(stack.entries.slice(0, -1)),
    },
    entry,
  });
}

function isStackEntryRestorable(
  entry: NexoraDirectorFocusStackEntry,
  context: NexoraDirectorCameraFocusContext,
): boolean {
  const pkg = resolvePackage(
    context.integrationCollection,
    entry.objectId,
    entry.sceneObjectId,
  );
  const binding = resolveBinding(
    context.bindingRegistry,
    entry.objectId,
    entry.sceneObjectId,
  );
  if (!pkg || !binding) return false;
  if (binding.state === "Removed") return false;
  if (
    !pkg.sceneObject.visible ||
    pkg.sceneObject.renderingLevel === "Hidden" ||
    binding.state === "Hidden"
  ) {
    return false;
  }
  return true;
}

export function restorePreviousNexoraDirectorFocus(
  stack: NexoraDirectorFocusStack,
  context: NexoraDirectorCameraFocusContext,
): {
  readonly stack: NexoraDirectorFocusStack;
  readonly entry?: NexoraDirectorFocusStackEntry;
  readonly warnings: readonly NexoraDirectorCameraFocusWarning[];
} {
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  let entries = [...stack.entries];
  while (entries.length > 0) {
    const candidate = entries[entries.length - 1]!;
    entries = entries.slice(0, -1);
    if (isStackEntryRestorable(candidate, context)) {
      return deepFreeze({
        stack: { entries: Object.freeze(entries) },
        entry: candidate,
        warnings: Object.freeze(warnings),
      });
    }
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_STACK_ENTRY_SKIPPED",
        "Invalid focus stack entry skipped during restore.",
        {
          objectId: candidate.objectId,
          sceneObjectId: candidate.sceneObjectId,
          requestId: candidate.requestId,
        },
      ),
    );
  }
  return deepFreeze({
    stack: { entries: Object.freeze([]) },
    entry: undefined,
    warnings: Object.freeze(warnings),
  });
}

export function clearNexoraDirectorFocusStack(
  _stack?: NexoraDirectorFocusStack,
): NexoraDirectorFocusStack {
  void _stack;
  return emptyStack();
}

// ─── Evaluate / Apply Pipeline ──────────────────────────────────────────────

function validateContext(
  context: NexoraDirectorCameraFocusContext,
  requestId?: string,
): readonly NexoraDirectorCameraFocusError[] {
  const errors: NexoraDirectorCameraFocusError[] = [];
  if (!context?.integrationCollection || !context?.bindingRegistry) {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_CONTEXT",
        "integrationCollection and bindingRegistry are required.",
        { requestId },
      ),
    );
  }
  if (typeof context?.userCameraActive !== "boolean") {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_CONTEXT",
        "userCameraActive must be a boolean.",
        { requestId },
      ),
    );
  }
  if (typeof context?.userCameraLocked !== "boolean") {
    errors.push(
      err(
        "DIRECTOR_FOCUS_INVALID_CONTEXT",
        "userCameraLocked must be a boolean.",
        { requestId },
      ),
    );
  }
  // Touch routing plans / sync state without mutating (diagnostic reference only).
  void context.synchronizationState;
  void context.routingPlans;
  void listBindings(context.bindingRegistry);
  return Object.freeze(errors);
}

function projectClearedState(
  previous: NexoraDirectorCameraFocusState,
  deps: NexoraDirectorCameraFocusDependencies,
  request: NexoraDirectorFocusRequest,
  cameraDecision: NexoraDirectorCameraPreservationDecision,
): NexoraDirectorCameraFocusState {
  const overview = resolveNexoraDirectorOverviewFraming(request, {
    integrationCollection: {
      collectionId: "unused",
      packages: Object.freeze([]),
      sceneOrder: Object.freeze([]),
      attentionSceneObjectIds: Object.freeze([]),
      hiddenSceneObjectIds: Object.freeze([]),
      metadata: Object.freeze({}),
    },
    bindingRegistry: { registryId: "unused", bindings: Object.freeze([]) },
    userCameraActive: false,
    userCameraLocked: false,
    stageMode: "Overview",
    reducedMotion: false,
  });
  void overview;
  return deepFreeze({
    stateId: previous.stateId,
    revision: previous.revision,
    focusState: "None" as const,
    cameraIntent:
      cameraDecision === "Blocked" || cameraDecision === "Preserve"
        ? previous.cameraIntent === "None"
          ? ("Overview" as const)
          : previous.cameraIntent
        : ("Overview" as const),
    framingMode: "Stage" as const,
    neighborhoodSceneObjectIds: Object.freeze([]),
    attentionPathSceneObjectIds: Object.freeze([]),
    clusterSceneObjectIds: Object.freeze([]),
    dimmedSceneObjectIds: Object.freeze([]),
    preservedSceneObjectIds: Object.freeze([]),
    userControlPreserved:
      cameraDecision === "Preserve" ||
      cameraDecision === "Blocked" ||
      request.preserveUserControl !== false,
    activeRequestId: request.requestId,
    updatedAt: deps.now(),
  });
}

export function evaluateNexoraDirectorCameraFocusCoordination(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
  dependencies?: NexoraDirectorCameraFocusDependencies,
  focusStack?: NexoraDirectorFocusStack,
): NexoraDirectorCameraFocusTransitionPlan {
  const deps = resolveDeps(dependencies);
  const previousState =
    context.currentFocus ?? createNexoraDirectorCameraFocusState(deps);
  let stack = focusStack ?? emptyStack();
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];

  const requestValidation = validateNexoraDirectorFocusRequest(request);
  if (!requestValidation.ok) {
    errors.push(...requestValidation.errors);
  }
  const contextErrors = validateContext(context, request.requestId);
  if (contextErrors.length > 0) {
    errors.push(...contextErrors);
  }
  const stateValidation = validateNexoraDirectorCameraFocusState(previousState);
  if (!stateValidation.ok) {
    errors.push(...stateValidation.errors);
  }

  if (errors.length > 0) {
    const rejectedTarget = deepFreeze({
      accepted: false,
      warnings: Object.freeze([] as NexoraDirectorCameraFocusWarning[]),
      errors: Object.freeze([...errors]),
    });
    return deepFreeze({
      requestId: request.requestId,
      accepted: false,
      changed: false,
      previousState,
      projectedState: previousState,
      target: rejectedTarget,
      cameraDecision: "Blocked" as const,
      focusStack: stack,
      commands: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors),
    });
  }

  const cameraDecision = resolveNexoraDirectorCameraPreservation(
    request,
    context,
  );
  if (cameraDecision === "Blocked") {
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_USER_CAMERA_LOCKED",
        "User camera lock blocked automatic camera changes.",
        { requestId: request.requestId },
      ),
    );
  } else if (cameraDecision === "Preserve") {
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_USER_CAMERA_PRESERVED",
        "User camera activity preserved camera for automatic focus.",
        { requestId: request.requestId },
      ),
    );
  }

  // Restore previous focus from stack
  if (request.type === "RestorePreviousFocus") {
    const restored = restorePreviousNexoraDirectorFocus(stack, context);
    warnings.push(...restored.warnings);
    stack = restored.stack;
    if (!restored.entry) {
      const target = deepFreeze({
        accepted: false,
        warnings: Object.freeze([...warnings]),
        errors: Object.freeze([
          err(
            "DIRECTOR_FOCUS_INVALID_STACK",
            "No restorable focus stack entry.",
            { requestId: request.requestId },
          ),
        ]),
      });
      return deepFreeze({
        requestId: request.requestId,
        accepted: false,
        changed: false,
        previousState,
        projectedState: previousState,
        target,
        cameraDecision,
        focusStack: stack,
        commands: Object.freeze([]),
        warnings: Object.freeze(warnings),
        errors: target.errors,
      });
    }
    const synthetic: NexoraDirectorFocusRequest = deepFreeze({
      ...request,
      type: "Focus",
      targetObjectId: restored.entry.objectId,
      targetSceneObjectId: restored.entry.sceneObjectId,
      source: restored.entry.source,
    });
    return evaluateNexoraDirectorCameraFocusCoordination(
      synthetic,
      context,
      deps,
      stack,
    );
  }

  const target = resolveNexoraDirectorFocusTarget(request, context);
  warnings.push(...target.warnings);
  if (!target.accepted && !TARGETLESS_REQUEST_TYPES.has(request.type)) {
    return deepFreeze({
      requestId: request.requestId,
      accepted: false,
      changed: false,
      previousState,
      projectedState: previousState,
      target,
      cameraDecision,
      focusStack: stack,
      commands: Object.freeze([]),
      warnings: Object.freeze(warnings),
      errors: target.errors,
    });
  }

  const exclusive = coordinateExclusiveNexoraDirectorFocus(
    request,
    target,
    previousState,
    context,
  );
  warnings.push(...exclusive.warnings);
  errors.push(...exclusive.errors);

  let neighborhood: NexoraDirectorFocusNeighborhoodPlan | undefined;
  let attentionPathSceneObjectIds: readonly string[] = Object.freeze([]);
  let clusterSceneObjectIds: readonly string[] = Object.freeze([]);
  let dimmedSceneObjectIds: readonly string[] = Object.freeze([]);
  let preservedSceneObjectIds: readonly string[] = Object.freeze([]);
  let neighborhoodSceneObjectIds: readonly string[] = Object.freeze([]);
  let cameraIntent = cameraIntentForRequest(request, context);
  let framingMode = framingModeForRequest(request);
  let focusState = exclusive.focusState;
  let focusedObjectId = exclusive.dominantObjectId;
  let focusedSceneObjectId = exclusive.dominantSceneObjectId;
  const suspendedObjectId = exclusive.suspendedObjectId;

  if (request.type === "ClearFocus" || request.type === "Overview") {
    const overview = resolveNexoraDirectorOverviewFraming(request, context);
    cameraIntent =
      cameraDecision === "Blocked" || cameraDecision === "Preserve"
        ? previousState.cameraIntent === "None"
          ? "Overview"
          : previousState.cameraIntent
        : overview.cameraIntent;
    framingMode = overview.framingMode;
    focusState = "None";
    focusedObjectId = undefined;
    focusedSceneObjectId = undefined;
    if (previousState.focusedObjectId && previousState.focusedSceneObjectId) {
      const maxDepth = payloadNumber(
        request.payload,
        "maxFocusStackDepth",
        DEFAULT_MAX_FOCUS_STACK_DEPTH,
      );
      try {
        stack = pushNexoraDirectorFocusStack(
          stack,
          deepFreeze({
            objectId: previousState.focusedObjectId,
            sceneObjectId: previousState.focusedSceneObjectId,
            focusState: previousState.focusState,
            requestId: previousState.activeRequestId ?? request.requestId,
            source: request.source,
            suspendedAt: deps.now(),
          }),
          { maxDepth },
        );
      } catch {
        // duplicate adjacent — ignore for overview push
      }
    }
    if (!overview.preservedStack && request.type === "ClearFocus") {
      // ClearFocus may drop stack when payload says so
      if (payloadFlag(request.payload, "preserveFocusStack", true) === false) {
        stack = clearNexoraDirectorFocusStack(stack);
      }
    }
  } else if (request.type === "FocusAttentionPath") {
    const pathResult = resolveNexoraDirectorAttentionPathFraming(
      request,
      context,
    );
    warnings.push(...pathResult.warnings);
    errors.push(...pathResult.errors);
    if (!pathResult.accepted) {
      return deepFreeze({
        requestId: request.requestId,
        accepted: false,
        changed: false,
        previousState,
        projectedState: previousState,
        target,
        cameraDecision,
        focusStack: stack,
        commands: Object.freeze([]),
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors),
      });
    }
    cameraIntent = pathResult.cameraIntent;
    framingMode = pathResult.framingMode;
    attentionPathSceneObjectIds = pathResult.attentionPathSceneObjectIds;
    dimmedSceneObjectIds = pathResult.dimmedSceneObjectIds;
    preservedSceneObjectIds = pathResult.preservedSceneObjectIds;
    focusedSceneObjectId =
      pathResult.targetSceneObjectId ?? focusedSceneObjectId;
    if (focusedSceneObjectId) {
      const pkg = packagesBySceneObjectId(
        context.integrationCollection,
      ).get(focusedSceneObjectId);
      focusedObjectId = pkg?.objectId ?? focusedObjectId;
      neighborhood = resolveNexoraDirectorFocusNeighborhood(
        focusedSceneObjectId,
        context,
      );
      neighborhoodSceneObjectIds = Object.freeze([
        ...neighborhood.directSceneObjectIds,
        ...neighborhood.contextualSceneObjectIds,
      ]);
    }
    focusState = "Focused";
  } else if (request.type === "FocusCluster") {
    const clusterResult = resolveNexoraDirectorClusterFraming(request, context);
    warnings.push(...clusterResult.warnings);
    errors.push(...clusterResult.errors);
    if (!clusterResult.accepted) {
      return deepFreeze({
        requestId: request.requestId,
        accepted: false,
        changed: false,
        previousState,
        projectedState: previousState,
        target,
        cameraDecision,
        focusStack: stack,
        commands: Object.freeze([]),
        warnings: Object.freeze(warnings),
        errors: Object.freeze(errors),
      });
    }
    cameraIntent = clusterResult.cameraIntent;
    framingMode = clusterResult.framingMode;
    clusterSceneObjectIds = clusterResult.memberSceneObjectIds;
    dimmedSceneObjectIds = clusterResult.dimmedSceneObjectIds;
    focusedSceneObjectId =
      clusterResult.representativeSceneObjectId ?? focusedSceneObjectId;
    if (focusedSceneObjectId) {
      const pkg = packagesBySceneObjectId(
        context.integrationCollection,
      ).get(focusedSceneObjectId);
      focusedObjectId = pkg?.objectId ?? focusedObjectId;
    }
    preservedSceneObjectIds = clusterSceneObjectIds;
    focusState = "Focused";
  } else if (request.type === "Operate") {
    const op = resolveNexoraDirectorOperationFraming(request, context);
    warnings.push(...op.warnings);
    errors.push(...op.errors);
    cameraIntent =
      cameraDecision === "Blocked" || cameraDecision === "Preserve"
        ? previousState.cameraIntent
        : op.cameraIntent;
    framingMode = op.framingMode;
    neighborhoodSceneObjectIds = op.neighborhoodSceneObjectIds;
    dimmedSceneObjectIds = op.dimmedSceneObjectIds;
    focusState = "Operating";
    if (focusedSceneObjectId) {
      neighborhood = resolveNexoraDirectorFocusNeighborhood(
        focusedSceneObjectId,
        context,
      );
    }
  } else if (request.type === "HistoricalFocus") {
    const hist = resolveNexoraDirectorHistoricalFraming(request, context);
    warnings.push(...hist.warnings);
    errors.push(...hist.errors);
    cameraIntent =
      cameraDecision === "Blocked" || cameraDecision === "Preserve"
        ? previousState.cameraIntent
        : hist.cameraIntent;
    framingMode = hist.framingMode;
    preservedSceneObjectIds = hist.preservedSceneObjectIds;
    dimmedSceneObjectIds = hist.dimmedSceneObjectIds;
    focusState = "Historical";
    if (focusedSceneObjectId) {
      neighborhood = resolveNexoraDirectorFocusNeighborhood(
        focusedSceneObjectId,
        context,
      );
      neighborhoodSceneObjectIds = Object.freeze([
        ...neighborhood.directSceneObjectIds,
        ...neighborhood.contextualSceneObjectIds,
      ]);
    }
  } else if (focusedSceneObjectId) {
    neighborhood = resolveNexoraDirectorFocusNeighborhood(
      focusedSceneObjectId,
      context,
    );
    neighborhoodSceneObjectIds = Object.freeze([
      ...neighborhood.directSceneObjectIds,
      ...neighborhood.contextualSceneObjectIds,
    ]);
    dimmedSceneObjectIds = neighborhood.dimmedSceneObjectIds;
    preservedSceneObjectIds = sortUnique([
      focusedSceneObjectId,
      ...neighborhood.directSceneObjectIds,
    ]);
    if (cameraDecision === "Blocked" || cameraDecision === "Preserve") {
      // keep prior intent when preserving/blocking; still record recommendation in commands
      if (previousState.cameraIntent !== "None") {
        cameraIntent = previousState.cameraIntent;
      }
    }
    if (dimmedSceneObjectIds.length > 0) {
      warnings.push(
        warn(
          "DIRECTOR_FOCUS_BACKGROUND_DIMMED",
          "Unrelated background objects may be dimmed.",
          { requestId: request.requestId, sceneObjectId: focusedSceneObjectId },
        ),
      );
    }
  }

  // Ensure focused never dimmed
  if (focusedSceneObjectId) {
    dimmedSceneObjectIds = Object.freeze(
      dimmedSceneObjectIds.filter((id) => id !== focusedSceneObjectId),
    );
  }

  // Stack push on suspend / permanent replace
  const maxDepth = payloadNumber(
    request.payload,
    "maxFocusStackDepth",
    DEFAULT_MAX_FOCUS_STACK_DEPTH,
  );
  if (
    exclusive.previousFocusSuspended &&
    previousState.focusedObjectId &&
    previousState.focusedSceneObjectId
  ) {
    try {
      stack = pushNexoraDirectorFocusStack(
        stack,
        deepFreeze({
          objectId: previousState.focusedObjectId,
          sceneObjectId: previousState.focusedSceneObjectId,
          focusState: previousState.focusState,
          requestId: previousState.activeRequestId ?? request.requestId,
          source: request.source,
          suspendedAt: deps.now(),
        }),
        { maxDepth },
      );
    } catch {
      // duplicate adjacent
    }
  } else if (
    exclusive.replaced &&
    previousState.focusedObjectId &&
    previousState.focusedSceneObjectId &&
    previousState.focusedObjectId !== focusedObjectId
  ) {
    try {
      stack = pushNexoraDirectorFocusStack(
        stack,
        deepFreeze({
          objectId: previousState.focusedObjectId,
          sceneObjectId: previousState.focusedSceneObjectId,
          focusState: previousState.focusState,
          requestId: previousState.activeRequestId ?? request.requestId,
          source: request.source,
        }),
        { maxDepth },
      );
    } catch {
      // duplicate adjacent
    }
  }

  const userControlPreserved =
    cameraDecision === "Preserve" ||
    cameraDecision === "Blocked" ||
    request.preserveUserControl !== false;

  let projectedState: NexoraDirectorCameraFocusState = deepFreeze({
    stateId: previousState.stateId,
    revision: previousState.revision,
    focusState,
    focusedObjectId,
    focusedSceneObjectId,
    suspendedObjectId,
    cameraIntent,
    framingMode,
    neighborhoodSceneObjectIds,
    attentionPathSceneObjectIds,
    clusterSceneObjectIds,
    dimmedSceneObjectIds,
    preservedSceneObjectIds,
    userControlPreserved,
    activeRequestId: request.requestId,
    updatedAt: deps.now(),
  });

  if (request.type === "ClearFocus" || request.type === "Overview") {
    projectedState = projectClearedState(
      previousState,
      deps,
      request,
      cameraDecision,
    );
    projectedState = deepFreeze({
      ...projectedState,
      activeRequestId: request.requestId,
      userControlPreserved,
    });
  }

  const changed =
    stateFingerprint(previousState) !== stateFingerprint(projectedState);
  if (!changed) {
    warnings.push(
      warn(
        "DIRECTOR_FOCUS_NO_CHANGE",
        "Focus coordination produced no semantic change.",
        { requestId: request.requestId },
      ),
    );
  }

  const commands: NexoraDirectorCameraFocusCommand[] = [];
  let order = 0;
  if (exclusive.previousFocusSuspended && previousState.focusedObjectId) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "SuspendFocus",
        order: order++,
        objectId: previousState.focusedObjectId,
        sceneObjectId: previousState.focusedSceneObjectId,
      }),
    );
  }
  if (focusState === "None") {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "ClearFocus",
        order: order++,
      }),
    );
  } else if (focusedObjectId && focusedSceneObjectId) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "SetFocus",
        order: order++,
        objectId: focusedObjectId,
        sceneObjectId: focusedSceneObjectId,
        payload: { focusState },
      }),
    );
  }
  if (cameraDecision === "Preserve" || cameraDecision === "Blocked") {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "PreserveUserCamera",
        order: order++,
        payload: { decision: cameraDecision },
      }),
    );
  } else {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "SetCameraIntent",
        order: order++,
        objectId: focusedObjectId,
        sceneObjectId: focusedSceneObjectId,
        payload: { cameraIntent },
      }),
    );
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "RecommendCameraTransition",
        order: order++,
        payload: { cameraIntent, framingMode, decision: cameraDecision },
      }),
    );
  }
  commands.push(
    buildCommand({
      deps,
      requestId: request.requestId,
      type: "SetFramingMode",
      order: order++,
      payload: { framingMode },
    }),
  );
  if (neighborhoodSceneObjectIds.length > 0) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "RevealNeighborhood",
        order: order++,
        sceneObjectId: focusedSceneObjectId,
        payload: { neighborhoodSceneObjectIds },
      }),
    );
  }
  if (attentionPathSceneObjectIds.length > 0) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "RevealAttentionPath",
        order: order++,
        payload: { attentionPathSceneObjectIds },
      }),
    );
  }
  if (clusterSceneObjectIds.length > 0) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "RevealCluster",
        order: order++,
        payload: { clusterSceneObjectIds },
      }),
    );
  }
  if (dimmedSceneObjectIds.length > 0) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "DimBackground",
        order: order++,
        payload: { dimmedSceneObjectIds },
      }),
    );
  } else if (changed && previousState.dimmedSceneObjectIds.length > 0) {
    commands.push(
      buildCommand({
        deps,
        requestId: request.requestId,
        type: "RestoreBackground",
        order: order++,
      }),
    );
  }

  const accepted =
    errors.length === 0 &&
    (target.accepted || TARGETLESS_REQUEST_TYPES.has(request.type));

  const plan = deepFreeze({
    requestId: request.requestId,
    accepted,
    changed: accepted && changed,
    previousState,
    projectedState,
    target,
    cameraDecision,
    neighborhood,
    focusStack: stack,
    commands: Object.freeze(commands),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });

  const planValidation = validateNexoraDirectorCameraFocusTransitionPlan(plan);
  if (!planValidation.ok && accepted) {
    return deepFreeze({
      ...plan,
      accepted: false,
      changed: false,
      projectedState: previousState,
      errors: Object.freeze([...errors, ...planValidation.errors]),
    });
  }

  return plan;
}

export function applyNexoraDirectorCameraFocusCoordination(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
  dependencies?: NexoraDirectorCameraFocusDependencies,
  focusStack?: NexoraDirectorFocusStack,
): NexoraDirectorCameraFocusResult {
  const deps = resolveDeps(dependencies);
  const plan = evaluateNexoraDirectorCameraFocusCoordination(
    request,
    context,
    deps,
    focusStack,
  );
  const events: NexoraDirectorCameraFocusEvent[] = [];
  events.push(
    makeEvent({
      deps,
      request,
      type: "FocusRequested",
      revision: plan.previousState.revision,
      objectId: request.targetObjectId ?? plan.target.objectId,
      sceneObjectId: request.targetSceneObjectId ?? plan.target.sceneObjectId,
    }),
  );

  if (!plan.accepted) {
    events.push(
      makeEvent({
        deps,
        request,
        type: "FocusRejected",
        revision: plan.previousState.revision,
        objectId: plan.target.objectId,
        sceneObjectId: plan.target.sceneObjectId,
        payload: { errors: plan.errors.map((e) => e.code) },
      }),
    );
    return deepFreeze({
      accepted: false,
      changed: false,
      previousState: plan.previousState,
      nextState: plan.previousState,
      focusStack: plan.focusStack,
      plan,
      events: Object.freeze(events),
      warnings: plan.warnings,
      errors: plan.errors,
    });
  }

  let nextState = plan.projectedState;
  if (plan.changed) {
    nextState = deepFreeze({
      ...plan.projectedState,
      revision: plan.previousState.revision + 1,
      updatedAt: deps.now(),
    });
  }

  events.push(
    makeEvent({
      deps,
      request,
      type: "FocusAccepted",
      revision: nextState.revision,
      objectId: nextState.focusedObjectId,
      sceneObjectId: nextState.focusedSceneObjectId,
    }),
  );
  if (plan.changed) {
    if (nextState.focusState === "None") {
      events.push(
        makeEvent({
          deps,
          request,
          type: "FocusCleared",
          revision: nextState.revision,
        }),
      );
      events.push(
        makeEvent({
          deps,
          request,
          type: "OverviewResolved",
          revision: nextState.revision,
          payload: { cameraIntent: nextState.cameraIntent },
        }),
      );
    } else {
      events.push(
        makeEvent({
          deps,
          request,
          type: "FocusChanged",
          revision: nextState.revision,
          objectId: nextState.focusedObjectId,
          sceneObjectId: nextState.focusedSceneObjectId,
          payload: {
            previousObjectId: plan.previousState.focusedObjectId,
            nextObjectId: nextState.focusedObjectId,
          },
        }),
      );
    }
    if (nextState.suspendedObjectId) {
      events.push(
        makeEvent({
          deps,
          request,
          type: "FocusSuspended",
          revision: nextState.revision,
          objectId: nextState.suspendedObjectId,
        }),
      );
    }
    if (request.type === "RestorePreviousFocus") {
      events.push(
        makeEvent({
          deps,
          request,
          type: "FocusRestored",
          revision: nextState.revision,
          objectId: nextState.focusedObjectId,
          sceneObjectId: nextState.focusedSceneObjectId,
        }),
      );
    }
  }
  events.push(
    makeEvent({
      deps,
      request,
      type: "CameraIntentResolved",
      revision: nextState.revision,
      payload: {
        cameraIntent: nextState.cameraIntent,
        decision: plan.cameraDecision,
      },
    }),
  );
  if (
    plan.cameraDecision === "Preserve" ||
    plan.cameraDecision === "Blocked"
  ) {
    events.push(
      makeEvent({
        deps,
        request,
        type: "CameraPreserved",
        revision: nextState.revision,
        payload: { decision: plan.cameraDecision },
      }),
    );
  }
  if (plan.neighborhood) {
    events.push(
      makeEvent({
        deps,
        request,
        type: "NeighborhoodResolved",
        revision: nextState.revision,
        sceneObjectId: plan.neighborhood.focusedSceneObjectId,
      }),
    );
  }
  if (nextState.attentionPathSceneObjectIds.length > 0) {
    events.push(
      makeEvent({
        deps,
        request,
        type: "AttentionPathFramed",
        revision: nextState.revision,
        payload: {
          attentionPathSceneObjectIds: nextState.attentionPathSceneObjectIds,
        },
      }),
    );
  }
  if (nextState.clusterSceneObjectIds.length > 0) {
    events.push(
      makeEvent({
        deps,
        request,
        type: "ClusterFramed",
        revision: nextState.revision,
        payload: { clusterSceneObjectIds: nextState.clusterSceneObjectIds },
      }),
    );
  }

  const acceptedPlan = deepFreeze({
    ...plan,
    projectedState: nextState,
    changed: plan.changed,
  });

  return deepFreeze({
    accepted: true,
    changed: plan.changed,
    previousState: plan.previousState,
    nextState,
    focusStack: plan.focusStack,
    plan: acceptedPlan,
    events: Object.freeze(events),
    warnings: plan.warnings,
    errors: plan.errors,
  });
}

// ─── Interruption / Replacement ─────────────────────────────────────────────

export function interruptNexoraDirectorCameraFocus(
  context: NexoraDirectorCameraFocusContext,
  mode: NexoraDirectorCameraFocusInterruptionMode,
  dependencies?: NexoraDirectorCameraFocusDependencies,
  focusStack?: NexoraDirectorFocusStack,
  replacement?: NexoraDirectorFocusRequest,
): NexoraDirectorCameraFocusResult {
  const deps = resolveDeps(dependencies);
  const current =
    context.currentFocus ?? createNexoraDirectorCameraFocusState(deps);

  if (mode === "Clear") {
    const request: NexoraDirectorFocusRequest = deepFreeze({
      requestId: `interrupt-clear:${deps.createEventId()}`,
      type: "ClearFocus",
      source: "System",
      priority: 0,
      payload: Object.freeze({ preserveFocusStack: false }),
    });
    return applyNexoraDirectorCameraFocusCoordination(
      request,
      context,
      deps,
      focusStack,
    );
  }

  if (mode === "Suspend") {
    const request: NexoraDirectorFocusRequest = deepFreeze({
      requestId: `interrupt-suspend:${deps.createEventId()}`,
      type: "Overview",
      source: "System",
      priority: 0,
      payload: Object.freeze({ temporary: true, preserveFocusStack: true }),
    });
    // Push current then clear dominance
    let stack = focusStack ?? emptyStack();
    if (current.focusedObjectId && current.focusedSceneObjectId) {
      try {
        stack = pushNexoraDirectorFocusStack(
          stack,
          deepFreeze({
            objectId: current.focusedObjectId,
            sceneObjectId: current.focusedSceneObjectId,
            focusState: current.focusState,
            requestId: current.activeRequestId ?? request.requestId,
            source: "System",
            suspendedAt: deps.now(),
          }),
        );
      } catch {
        // ignore duplicate
      }
    }
    const result = applyNexoraDirectorCameraFocusCoordination(
      request,
      context,
      deps,
      stack,
    );
    return deepFreeze({
      ...result,
      nextState: deepFreeze({
        ...result.nextState,
        focusState:
          current.focusState !== "None"
            ? ("Suspended" as const)
            : ("None" as const),
        suspendedObjectId: current.focusedObjectId,
      }),
    });
  }

  // Replace
  if (replacement) {
    if (
      current.focusState === "Operating" &&
      replacement.type !== "Operate" &&
      !isSystemSafety(replacement)
    ) {
      const rejected = deepFreeze({
        accepted: false,
        changed: false,
        previousState: current,
        nextState: current,
        focusStack: focusStack ?? emptyStack(),
        plan: evaluateNexoraDirectorCameraFocusCoordination(
          replacement,
          context,
          deps,
          focusStack,
        ),
        events: Object.freeze([] as NexoraDirectorCameraFocusEvent[]),
        warnings: Object.freeze([] as NexoraDirectorCameraFocusWarning[]),
        errors: Object.freeze([
          err(
            "DIRECTOR_FOCUS_CAMERA_OVERRIDE_BLOCKED",
            "Operation focus requires explicit replacement unless System safety supersedes it.",
            { requestId: replacement.requestId },
          ),
        ]),
      });
      return rejected;
    }
    return applyNexoraDirectorCameraFocusCoordination(
      replacement,
      context,
      deps,
      focusStack,
    );
  }

  const clearRequest: NexoraDirectorFocusRequest = deepFreeze({
    requestId: `interrupt-replace:${deps.createEventId()}`,
    type: "ClearFocus",
    source: "System",
    priority: 0,
  });
  return applyNexoraDirectorCameraFocusCoordination(
    clearRequest,
    context,
    deps,
    focusStack,
  );
}

export function replaceNexoraDirectorCameraFocus(
  request: NexoraDirectorFocusRequest,
  context: NexoraDirectorCameraFocusContext,
  dependencies?: NexoraDirectorCameraFocusDependencies,
  focusStack?: NexoraDirectorFocusStack,
): NexoraDirectorCameraFocusResult {
  return interruptNexoraDirectorCameraFocus(
    context,
    "Replace",
    dependencies,
    focusStack,
    request,
  );
}

// ─── Queue / Batch / Simulation ─────────────────────────────────────────────

export function createNexoraDirectorCameraFocusQueue(
  requests: readonly NexoraDirectorFocusRequest[] = [],
): NexoraDirectorCameraFocusQueue {
  return deepFreeze({ requests: Object.freeze([...requests]) });
}

export function enqueueNexoraDirectorFocusRequest(
  queue: NexoraDirectorCameraFocusQueue,
  request: NexoraDirectorFocusRequest,
): NexoraDirectorCameraFocusQueue {
  if (queue.requests.some((item) => item.requestId === request.requestId)) {
    throwFocus(
      err(
        "DIRECTOR_FOCUS_DUPLICATE_REQUEST_ID",
        `Duplicate request ID: ${request.requestId}`,
        { requestId: request.requestId },
      ),
    );
  }
  const validation = validateNexoraDirectorFocusRequest(request);
  if (!validation.ok) {
    throwFocus(validation.errors[0]!);
  }
  return deepFreeze({
    requests: Object.freeze([...queue.requests, request]),
  });
}

export function dequeueNexoraDirectorFocusRequest(
  queue: NexoraDirectorCameraFocusQueue,
): {
  readonly queue: NexoraDirectorCameraFocusQueue;
  readonly request?: NexoraDirectorFocusRequest;
} {
  const ordered = resolveNexoraDirectorCameraFocusQueue(queue);
  if (ordered.requests.length === 0) {
    return deepFreeze({ queue: ordered, request: undefined });
  }
  const [request, ...rest] = ordered.requests;
  return deepFreeze({
    queue: { requests: Object.freeze(rest) },
    request,
  });
}

export function resolveNexoraDirectorCameraFocusQueue(
  queue: NexoraDirectorCameraFocusQueue,
  context?: NexoraDirectorCameraFocusContext,
): NexoraDirectorCameraFocusQueue {
  const stubContext: NexoraDirectorCameraFocusContext =
    context ??
    deepFreeze({
      integrationCollection: {
        collectionId: "queue",
        packages: Object.freeze([]),
        sceneOrder: Object.freeze([]),
        attentionSceneObjectIds: Object.freeze([]),
        hiddenSceneObjectIds: Object.freeze([]),
        metadata: Object.freeze({}),
      },
      bindingRegistry: { registryId: "queue", bindings: Object.freeze([]) },
      userCameraActive: false,
      userCameraLocked: false,
      stageMode: "Overview" as const,
      reducedMotion: false,
    });

  const sorted = [...queue.requests].sort((a, b) => {
    const sa = resolveNexoraDirectorCameraPriority(a, stubContext);
    const sb = resolveNexoraDirectorCameraPriority(b, stubContext);
    if (sb !== sa) return sb - sa;
    if (b.priority !== a.priority) return b.priority - a.priority;
    const ta = a.occurredAt ?? "";
    const tb = b.occurredAt ?? "";
    if (ta !== tb) return ta < tb ? -1 : ta > tb ? 1 : 0;
    return a.requestId < b.requestId ? -1 : a.requestId > b.requestId ? 1 : 0;
  });
  return deepFreeze({ requests: Object.freeze(sorted) });
}

export function coordinateNexoraDirectorCameraFocusBatch(
  batch: NexoraDirectorCameraFocusBatchRequest,
  context: NexoraDirectorCameraFocusContext,
  dependencies?: NexoraDirectorCameraFocusDependencies,
  focusStack?: NexoraDirectorFocusStack,
): NexoraDirectorCameraFocusBatchResult {
  const deps = resolveDeps(dependencies);
  const ids = new Set<string>();
  const duplicateErrors: NexoraDirectorCameraFocusError[] = [];
  for (const request of batch.requests) {
    if (ids.has(request.requestId)) {
      duplicateErrors.push(
        err(
          "DIRECTOR_FOCUS_DUPLICATE_REQUEST_ID",
          `Duplicate request ID: ${request.requestId}`,
          { requestId: request.requestId },
        ),
      );
    }
    ids.add(request.requestId);
  }

  const queue = resolveNexoraDirectorCameraFocusQueue(
    createNexoraDirectorCameraFocusQueue(batch.requests),
    context,
  );

  if (batch.mode === "Atomic") {
    const preflight: NexoraDirectorCameraFocusResult[] = [];
    const rejectedIds: string[] = [];
    let simulatedContext = context;
    let stack = focusStack ?? emptyStack();
    let failed = duplicateErrors.length > 0;
    for (const request of queue.requests) {
      const plan = evaluateNexoraDirectorCameraFocusCoordination(
        request,
        simulatedContext,
        deps,
        stack,
      );
      if (!plan.accepted) {
        failed = true;
        rejectedIds.push(request.requestId);
      }
      const result = applyNexoraDirectorCameraFocusCoordination(
        request,
        simulatedContext,
        deps,
        stack,
      );
      preflight.push(result);
      if (result.accepted) {
        simulatedContext = deepFreeze({
          ...simulatedContext,
          currentFocus: result.nextState,
        });
        stack = result.focusStack;
      } else {
        rejectedIds.push(request.requestId);
        failed = true;
      }
    }
    if (failed || duplicateErrors.length > 0) {
      const initial =
        context.currentFocus ?? createNexoraDirectorCameraFocusState(deps);
      return deepFreeze({
        accepted: false,
        mode: "Atomic" as const,
        results: Object.freeze([]),
        acceptedRequestIds: Object.freeze([]),
        rejectedRequestIds: Object.freeze([
          ...new Set([
            ...rejectedIds,
            ...duplicateErrors.map((e) => e.requestId!).filter(Boolean),
            ...queue.requests.map((r) => r.requestId),
          ]),
        ]),
        nextState: initial,
        focusStack: focusStack ?? emptyStack(),
        warnings: Object.freeze([]),
        errors: Object.freeze([
          ...duplicateErrors,
          ...preflight.flatMap((r) => [...r.errors]),
        ]),
      });
    }
    const acceptedRequestIds = queue.requests.map((r) => r.requestId);
    const last = preflight[preflight.length - 1];
    return deepFreeze({
      accepted: true,
      mode: "Atomic" as const,
      results: Object.freeze(preflight),
      acceptedRequestIds: Object.freeze(acceptedRequestIds),
      rejectedRequestIds: Object.freeze([]),
      nextState: last?.nextState ??
        context.currentFocus ??
        createNexoraDirectorCameraFocusState(deps),
      focusStack: last?.focusStack ?? focusStack ?? emptyStack(),
      warnings: Object.freeze(preflight.flatMap((r) => [...r.warnings])),
      errors: Object.freeze([]),
    });
  }

  // BestEffort
  const results: NexoraDirectorCameraFocusResult[] = [];
  const acceptedRequestIds: string[] = [];
  const rejectedRequestIds: string[] = [];
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [...duplicateErrors];
  let currentContext = context;
  let stack = focusStack ?? emptyStack();

  for (const request of queue.requests) {
    if (duplicateErrors.some((e) => e.requestId === request.requestId)) {
      rejectedRequestIds.push(request.requestId);
      continue;
    }
    const result = applyNexoraDirectorCameraFocusCoordination(
      request,
      currentContext,
      deps,
      stack,
    );
    results.push(result);
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    if (result.accepted) {
      acceptedRequestIds.push(request.requestId);
      currentContext = deepFreeze({
        ...currentContext,
        currentFocus: result.nextState,
      });
      stack = result.focusStack;
    } else {
      rejectedRequestIds.push(request.requestId);
    }
  }

  const nextState =
    results.filter((r) => r.accepted).at(-1)?.nextState ??
    context.currentFocus ??
    createNexoraDirectorCameraFocusState(deps);

  return deepFreeze({
    accepted: rejectedRequestIds.length === 0 && duplicateErrors.length === 0,
    mode: "BestEffort" as const,
    results: Object.freeze(results),
    acceptedRequestIds: Object.freeze(acceptedRequestIds),
    rejectedRequestIds: Object.freeze(rejectedRequestIds),
    nextState,
    focusStack: stack,
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

export function simulateNexoraDirectorCameraFocusSequence(
  requests: readonly NexoraDirectorFocusRequest[],
  context: NexoraDirectorCameraFocusContext,
  options?: NexoraDirectorCameraFocusSimulationOptions,
  dependencies?: NexoraDirectorCameraFocusDependencies,
): NexoraDirectorCameraFocusSimulationResult {
  const deps = resolveDeps(dependencies);
  const stopOnFailure = options?.stopOnFailure ?? true;
  const plans: NexoraDirectorCameraFocusTransitionPlan[] = [];
  const results: NexoraDirectorCameraFocusResult[] = [];
  const warnings: NexoraDirectorCameraFocusWarning[] = [];
  const errors: NexoraDirectorCameraFocusError[] = [];
  let currentContext = context;
  let stack = options?.focusStack ?? emptyStack();
  let firstFailureRequestId: string | undefined;

  for (const request of requests) {
    const plan = evaluateNexoraDirectorCameraFocusCoordination(
      request,
      currentContext,
      deps,
      stack,
    );
    plans.push(plan);
    const result = applyNexoraDirectorCameraFocusCoordination(
      request,
      currentContext,
      deps,
      stack,
    );
    results.push(result);
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    if (!result.accepted) {
      firstFailureRequestId = firstFailureRequestId ?? request.requestId;
      if (stopOnFailure) break;
      continue;
    }
    currentContext = deepFreeze({
      ...currentContext,
      currentFocus: result.nextState,
    });
    stack = result.focusStack;
  }

  return deepFreeze({
    accepted: firstFailureRequestId === undefined,
    plans: Object.freeze(plans),
    results: Object.freeze(results),
    finalState:
      results.filter((r) => r.accepted).at(-1)?.nextState ??
      context.currentFocus ??
      createNexoraDirectorCameraFocusState(deps),
    focusStack: stack,
    firstFailureRequestId,
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });
}

// ─── Records / History / Snapshots ──────────────────────────────────────────

export function createNexoraDirectorCameraFocusRecord(
  result: NexoraDirectorCameraFocusResult,
  request: NexoraDirectorFocusRequest,
  dependencies?: NexoraDirectorCameraFocusDependencies,
): NexoraDirectorCameraFocusRecord {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    requestId: request.requestId,
    accepted: result.accepted,
    changed: result.changed,
    previousObjectId: result.previousState.focusedObjectId,
    nextObjectId: result.nextState.focusedObjectId,
    previousFocusState: result.previousState.focusState,
    nextFocusState: result.nextState.focusState,
    cameraIntent: result.nextState.cameraIntent,
    framingMode: result.nextState.framingMode,
    revisionBefore: result.previousState.revision,
    revisionAfter: result.nextState.revision,
    occurredAt: request.occurredAt ?? deps.now(),
    source: request.source,
    warnings: result.warnings,
    errors: result.errors,
  });
}

export function projectNexoraDirectorCameraFocusHistory(
  records: readonly NexoraDirectorCameraFocusRecord[],
): NexoraDirectorCameraFocusHistoryProjection {
  let totalAccepted = 0;
  let totalRejected = 0;
  let totalChanged = 0;
  for (const record of records) {
    if (record.accepted) totalAccepted += 1;
    else totalRejected += 1;
    if (record.changed) totalChanged += 1;
  }
  return deepFreeze({
    records: Object.freeze([...records]),
    totalAccepted,
    totalRejected,
    totalChanged,
  });
}

export function createNexoraDirectorCameraFocusSnapshot(
  state: NexoraDirectorCameraFocusState,
  focusStack: NexoraDirectorFocusStack = emptyStack(),
  dependencies?: NexoraDirectorCameraFocusDependencies,
): NexoraDirectorCameraFocusSnapshot {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    state,
    focusStack,
    createdAt: deps.now(),
  });
}

export function compareNexoraDirectorCameraFocusSnapshots(
  left: NexoraDirectorCameraFocusSnapshot,
  right: NexoraDirectorCameraFocusSnapshot,
): NexoraDirectorCameraFocusSnapshotComparison {
  return deepFreeze({
    focusTargetChanged:
      left.state.focusedObjectId !== right.state.focusedObjectId ||
      left.state.focusedSceneObjectId !== right.state.focusedSceneObjectId,
    focusStateChanged: left.state.focusState !== right.state.focusState,
    cameraIntentChanged: left.state.cameraIntent !== right.state.cameraIntent,
    framingChanged: left.state.framingMode !== right.state.framingMode,
    neighborhoodChanged: !arraysEqual(
      left.state.neighborhoodSceneObjectIds,
      right.state.neighborhoodSceneObjectIds,
    ),
    dimmingChanged: !arraysEqual(
      left.state.dimmedSceneObjectIds,
      right.state.dimmedSceneObjectIds,
    ),
    focusStackChanged:
      JSON.stringify(left.focusStack.entries) !==
      JSON.stringify(right.focusStack.entries),
    userControlPreservationChanged:
      left.state.userControlPreserved !== right.state.userControlPreserved,
    previousFocusedObjectId: left.state.focusedObjectId,
    nextFocusedObjectId: right.state.focusedObjectId,
    previousCameraIntent: left.state.cameraIntent,
    nextCameraIntent: right.state.cameraIntent,
    previousNeighborhoodSceneObjectIds: left.state.neighborhoodSceneObjectIds,
    nextNeighborhoodSceneObjectIds: right.state.neighborhoodSceneObjectIds,
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

function serializeEnvelope(
  kind: string,
  payload: Record<string, unknown>,
): string {
  return JSON.stringify({
    identity: nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
    version: nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
    schemaVersion: nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
    kind,
    ...payload,
  });
}

function parseEnvelope(json: string, kind: string): Record<string, unknown> {
  const parsed = JSON.parse(json) as Record<string, unknown>;
  if (
    parsed.schemaVersion !==
    nexoraObjectDirectorCameraFocusCoordinationSchemaVersion
  ) {
    throwFocus(
      err(
        "DIRECTOR_FOCUS_UNSUPPORTED_VERSION",
        `Unsupported camera focus schema: ${String(parsed.schemaVersion)}`,
        { details: { kind, schemaVersion: parsed.schemaVersion } },
      ),
    );
  }
  if (parsed.kind !== kind) {
    throwFocus(
      err(
        "DIRECTOR_FOCUS_INVARIANT_VIOLATION",
        `Expected envelope kind ${kind}, received ${String(parsed.kind)}.`,
        { details: { expected: kind, received: parsed.kind } },
      ),
    );
  }
  return parsed;
}

export function serializeNexoraDirectorFocusRequest(
  request: NexoraDirectorFocusRequest,
): string {
  assertNexoraDirectorCameraFocusInvariants(request);
  return serializeEnvelope("focusRequest", { request });
}

export function deserializeNexoraDirectorFocusRequest(
  json: string,
): NexoraDirectorFocusRequest {
  const parsed = parseEnvelope(json, "focusRequest");
  const restored = deepFreeze(parsed.request as NexoraDirectorFocusRequest);
  assertNexoraDirectorCameraFocusInvariants(restored);
  return restored;
}

export function serializeNexoraDirectorCameraFocusState(
  state: NexoraDirectorCameraFocusState,
): string {
  assertNexoraDirectorCameraFocusInvariants(state);
  return serializeEnvelope("focusState", { state });
}

export function deserializeNexoraDirectorCameraFocusState(
  json: string,
): NexoraDirectorCameraFocusState {
  const parsed = parseEnvelope(json, "focusState");
  const restored = deepFreeze(parsed.state as NexoraDirectorCameraFocusState);
  assertNexoraDirectorCameraFocusInvariants(restored);
  return restored;
}

export function serializeNexoraDirectorFocusStack(
  stack: NexoraDirectorFocusStack,
): string {
  assertNexoraDirectorCameraFocusInvariants(stack);
  return serializeEnvelope("focusStack", { stack });
}

export function deserializeNexoraDirectorFocusStack(
  json: string,
): NexoraDirectorFocusStack {
  const parsed = parseEnvelope(json, "focusStack");
  const restored = deepFreeze(parsed.stack as NexoraDirectorFocusStack);
  assertNexoraDirectorCameraFocusInvariants(restored);
  return restored;
}

export function serializeNexoraDirectorCameraFocusRecord(
  record: NexoraDirectorCameraFocusRecord,
): string {
  return serializeEnvelope("focusRecord", { record });
}

export function deserializeNexoraDirectorCameraFocusRecord(
  json: string,
): NexoraDirectorCameraFocusRecord {
  const parsed = parseEnvelope(json, "focusRecord");
  return deepFreeze(parsed.record as NexoraDirectorCameraFocusRecord);
}

export function serializeNexoraDirectorCameraFocusSnapshot(
  snapshot: NexoraDirectorCameraFocusSnapshot,
): string {
  return serializeEnvelope("focusSnapshot", { snapshot });
}

export function deserializeNexoraDirectorCameraFocusSnapshot(
  json: string,
): NexoraDirectorCameraFocusSnapshot {
  const parsed = parseEnvelope(json, "focusSnapshot");
  return deepFreeze(parsed.snapshot as NexoraDirectorCameraFocusSnapshot);
}

// ─── Facade ─────────────────────────────────────────────────────────────────

export function getNexoraObjectDirectorCameraFocusCoordinationEngineSummary() {
  return Object.freeze({
    identity: nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
    version: nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
    schemaVersion: nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
    upstream: NOL_DIRECTOR_CAMERA_FOCUS_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noCameraExecution: true,
    noRuntimeMutation: true,
  });
}

export const NexoraObjectDirectorCameraFocusCoordinationEngine = Object.freeze({
  identity: nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
  version: nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
  schemaVersion: nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
  createNexoraDirectorCameraFocusState,
  resolveNexoraDirectorFocusTarget,
  resolveNexoraDirectorCameraPriority,
  resolveNexoraDirectorCameraPreservation,
  resolveNexoraDirectorFocusNeighborhood,
  resolveNexoraDirectorAttentionPathFraming,
  resolveNexoraDirectorClusterFraming,
  resolveNexoraDirectorOperationFraming,
  resolveNexoraDirectorHistoricalFraming,
  resolveNexoraDirectorOverviewFraming,
  coordinateExclusiveNexoraDirectorFocus,
  pushNexoraDirectorFocusStack,
  popNexoraDirectorFocusStack,
  restorePreviousNexoraDirectorFocus,
  clearNexoraDirectorFocusStack,
  evaluateNexoraDirectorCameraFocusCoordination,
  applyNexoraDirectorCameraFocusCoordination,
  interruptNexoraDirectorCameraFocus,
  replaceNexoraDirectorCameraFocus,
  createNexoraDirectorCameraFocusQueue,
  enqueueNexoraDirectorFocusRequest,
  dequeueNexoraDirectorFocusRequest,
  resolveNexoraDirectorCameraFocusQueue,
  coordinateNexoraDirectorCameraFocusBatch,
  simulateNexoraDirectorCameraFocusSequence,
  createNexoraDirectorCameraFocusRecord,
  projectNexoraDirectorCameraFocusHistory,
  createNexoraDirectorCameraFocusSnapshot,
  compareNexoraDirectorCameraFocusSnapshots,
  validateNexoraDirectorFocusRequest,
  validateNexoraDirectorCameraFocusState,
  validateNexoraDirectorFocusStack,
  validateNexoraDirectorCameraFocusTransitionPlan,
  validateNexoraDirectorCameraFocusResult,
  assertNexoraDirectorCameraFocusInvariants,
  serializeNexoraDirectorFocusRequest,
  deserializeNexoraDirectorFocusRequest,
  serializeNexoraDirectorCameraFocusState,
  deserializeNexoraDirectorCameraFocusState,
  serializeNexoraDirectorFocusStack,
  deserializeNexoraDirectorFocusStack,
  serializeNexoraDirectorCameraFocusRecord,
  deserializeNexoraDirectorCameraFocusRecord,
  serializeNexoraDirectorCameraFocusSnapshot,
  deserializeNexoraDirectorCameraFocusSnapshot,
  summary: getNexoraObjectDirectorCameraFocusCoordinationEngineSummary,
});
