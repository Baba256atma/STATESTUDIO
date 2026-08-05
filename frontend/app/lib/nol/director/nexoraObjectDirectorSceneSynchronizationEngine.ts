/**
 * NOL-3:3 — NexoraObject Director Scene Synchronization Engine
 *
 * Canonical synchronization planner between immutable Director Integration
 * Packages (NOL-3:1) and persistent Scene Bindings (NOL-3:2). Produces
 * synchronization plans and commands only — no renderer execution.
 *
 * Upstream: NOL-3:1 and NOL-3:2 only.
 * Identity: NOL-3:3/NexoraObjectDirectorSceneSynchronizationEngine
 */

import {
  calculateNexoraObjectDirectorIntegrationDiff,
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  validateNexoraObjectDirectorIntegrationCollection,
  validateNexoraObjectDirectorIntegrationPackage,
  type NexoraDirectorProjectionSection,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationDiff,
  type NexoraObjectDirectorIntegrationPackage,
  type NexoraDirectorSceneUpdateType,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  bindDirectorSceneCollection,
  calculateDirectorSceneBindingDiff,
  directorSceneBindingModelIdentity,
  findBindingByObjectId,
  listBindings,
  reconcileDirectorSceneBindingRegistry,
  removeDirectorSceneBinding,
  validateDirectorSceneBindingRegistry,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingDependencies,
  type NexoraDirectorSceneBindingDiff,
  type NexoraDirectorSceneBindingRegistry,
  type NexoraDirectorSceneBindingState,
} from "./nexoraObjectDirectorSceneBindingModel.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraObjectDirectorSceneSynchronizationEngineIdentity =
  "NOL-3:3/NexoraObjectDirectorSceneSynchronizationEngine" as const;

export const nexoraObjectDirectorSceneSynchronizationEngineVersion =
  "1.0.0" as const;

export const nexoraObjectDirectorSceneSynchronizationSchemaVersion =
  "1.0.0" as const;

export const NOL_DIRECTOR_SCENE_SYNCHRONIZATION_IDENTITY =
  nexoraObjectDirectorSceneSynchronizationEngineIdentity;
export const NOL_DIRECTOR_SCENE_SYNCHRONIZATION_VERSION =
  nexoraObjectDirectorSceneSynchronizationEngineVersion;
export const NOL_DIRECTOR_SCENE_SYNCHRONIZATION_SCHEMA_VERSION =
  nexoraObjectDirectorSceneSynchronizationSchemaVersion;

export const NOL_DIRECTOR_SCENE_SYNCHRONIZATION_UPSTREAM = Object.freeze([
  nexoraObjectDirectorIntegrationFoundationIdentity,
  directorSceneBindingModelIdentity,
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

const PHASE_ORDER = Object.freeze([
  "Prepare",
  "Structure",
  "Content",
  "Interaction",
  "Presentation",
  "Finalize",
] as const satisfies readonly NexoraDirectorSceneSynchronizationCommand["phase"][]);

const SCENE_LAYER_ORDER = Object.freeze([
  "Background",
  "Historical",
  "Normal",
  "Selected",
  "Attention",
  "Focused",
  "Overlay",
  "Operation",
] as const);

const SECTION_COMMAND_MAP = Object.freeze({
  SceneObject: "UpdateSceneObject",
  Hierarchy: "UpdateHierarchy",
  Interaction: "UpdateInteraction",
  Picking: "UpdatePicking",
  Camera: "UpdateCameraIntent",
  Animation: "UpdateAnimationIntent",
  Relationships: "UpdateRelationships",
  Clustering: "UpdateClustering",
  Rendering: "UpdateRendering",
} as const satisfies Partial<
  Record<NexoraDirectorProjectionSection, NexoraDirectorSceneSynchronizationCommandType>
>);

const COMMAND_PHASE_MAP = Object.freeze({
  CreateSceneObject: "Prepare",
  BindSceneObject: "Prepare",
  UpdateHierarchy: "Structure",
  UpdateClustering: "Structure",
  UpdateRelationships: "Structure",
  UpdateSceneObject: "Content",
  UpdateRendering: "Content",
  UpdateInteraction: "Interaction",
  UpdatePicking: "Interaction",
  UpdateEventRoutes: "Interaction",
  ShowSceneObject: "Presentation",
  HideSceneObject: "Presentation",
  UpdateCameraIntent: "Presentation",
  UpdateAnimationIntent: "Presentation",
  ReuseSceneObject: "Finalize",
  DetachSceneObject: "Finalize",
  RemoveSceneObject: "Finalize",
} as const satisfies Record<
  NexoraDirectorSceneSynchronizationCommandType,
  NexoraDirectorSceneSynchronizationCommand["phase"]
>);

const CONTEXT_DEFAULTS = Object.freeze({
  removeMissingObjects: false,
  preserveDetachedBindings: true,
  allowBindingRecovery: true,
  strictOrdering: true,
} as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NexoraDirectorSceneSynchronizationState {
  readonly synchronizationId: string;
  readonly collectionId: string;
  readonly revision: number;
  readonly status:
    | "Idle"
    | "Planning"
    | "Ready"
    | "Applying"
    | "Completed"
    | "PartiallyCompleted"
    | "Failed"
    | "RolledBack";
  readonly packageCount: number;
  readonly bindingCount: number;
  readonly pendingCommandCount: number;
  readonly completedCommandCount: number;
  readonly failedCommandCount: number;
  readonly startedAt?: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
}

export interface NexoraDirectorSceneSynchronizationContext {
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
  readonly removeMissingObjects?: boolean;
  readonly preserveDetachedBindings?: boolean;
  readonly allowBindingRecovery?: boolean;
  readonly strictOrdering?: boolean;
}

export interface NexoraDirectorSceneSynchronizationRequest {
  readonly requestId: string;
  readonly integrationCollection: NexoraObjectDirectorIntegrationCollection;
  readonly bindingRegistry: NexoraDirectorSceneBindingRegistry;
  readonly previousIntegrationCollection?: NexoraObjectDirectorIntegrationCollection;
  readonly previousSynchronizationState?: NexoraDirectorSceneSynchronizationState;
  readonly mode: "Atomic" | "BestEffort";
  readonly context: NexoraDirectorSceneSynchronizationContext;
  readonly expectedSynchronizationRevision?: number;
  readonly dryRun?: boolean;
}

export type NexoraDirectorSceneSynchronizationCommandType =
  | "CreateSceneObject"
  | "BindSceneObject"
  | "UpdateSceneObject"
  | "ReuseSceneObject"
  | "ShowSceneObject"
  | "HideSceneObject"
  | "DetachSceneObject"
  | "RemoveSceneObject"
  | "UpdateHierarchy"
  | "UpdateInteraction"
  | "UpdatePicking"
  | "UpdateCameraIntent"
  | "UpdateAnimationIntent"
  | "UpdateRelationships"
  | "UpdateClustering"
  | "UpdateRendering"
  | "UpdateEventRoutes";

export interface NexoraDirectorSceneSynchronizationCommand {
  readonly commandId: string;
  readonly requestId: string;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly bindingId?: string;
  readonly type: NexoraDirectorSceneSynchronizationCommandType;
  readonly order: number;
  readonly phase:
    | "Prepare"
    | "Structure"
    | "Content"
    | "Interaction"
    | "Presentation"
    | "Finalize";
  readonly dependsOnCommandIds: readonly string[];
  readonly changedSections: readonly NexoraDirectorProjectionSection[];
  readonly previousPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly nextPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly reversible: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorSceneSynchronizationPlan {
  readonly requestId: string;
  readonly accepted: boolean;
  readonly noOp: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly previousState: NexoraDirectorSceneSynchronizationState;
  readonly projectedState: NexoraDirectorSceneSynchronizationState;
  readonly bindingDiff: NexoraDirectorSceneBindingDiff;
  readonly commands: readonly NexoraDirectorSceneSynchronizationCommand[];
  readonly rollbackCommands: readonly NexoraDirectorSceneSynchronizationCommand[];
  readonly affectedObjectIds: readonly string[];
  readonly unchangedObjectIds: readonly string[];
  readonly staleObjectIds: readonly string[];
  readonly warnings: readonly NexoraDirectorSceneSynchronizationWarning[];
  readonly errors: readonly NexoraDirectorSceneSynchronizationError[];
}

export interface NexoraDirectorSceneSynchronizationCommandResult {
  readonly commandId: string;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly type: NexoraDirectorSceneSynchronizationCommandType;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly status: "Planned" | "Ready" | "Skipped" | "Rejected";
  readonly reason?: string;
  readonly errors: readonly NexoraDirectorSceneSynchronizationError[];
}

export interface NexoraDirectorSceneSynchronizationResult {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly dryRun: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly previousState: NexoraDirectorSceneSynchronizationState;
  readonly nextState: NexoraDirectorSceneSynchronizationState;
  readonly previousRegistry: NexoraDirectorSceneBindingRegistry;
  readonly nextRegistry: NexoraDirectorSceneBindingRegistry;
  readonly plan: NexoraDirectorSceneSynchronizationPlan;
  readonly commandResults: readonly NexoraDirectorSceneSynchronizationCommandResult[];
  readonly events: readonly NexoraDirectorSceneSynchronizationEvent[];
  readonly warnings: readonly NexoraDirectorSceneSynchronizationWarning[];
  readonly errors: readonly NexoraDirectorSceneSynchronizationError[];
}

export interface NexoraDirectorSceneSynchronizationDrift {
  readonly objectId: string;
  readonly sceneObjectId?: string;
  readonly type:
    | "MissingBinding"
    | "MissingPackage"
    | "PackageMismatch"
    | "SceneIdentityMismatch"
    | "StaleGeneration"
    | "UnexpectedHidden"
    | "UnexpectedDetached"
    | "UnexpectedRemoved";
  readonly recoverable: boolean;
  readonly message: string;
}

export interface NexoraDirectorSceneSynchronizationCheckpoint {
  readonly checkpointId: string;
  readonly synchronizationRevision: number;
  readonly integrationCollection: NexoraObjectDirectorIntegrationCollection;
  readonly bindingRegistry: NexoraDirectorSceneBindingRegistry;
  readonly createdAt: string;
}

export type NexoraDirectorSceneSynchronizationEventType =
  | "SynchronizationPlanned"
  | "SynchronizationAccepted"
  | "SynchronizationRejected"
  | "SynchronizationCompleted"
  | "SynchronizationPartiallyCompleted"
  | "SynchronizationFailed"
  | "SynchronizationRolledBack"
  | "SceneObjectCreatePlanned"
  | "SceneObjectUpdatePlanned"
  | "SceneObjectReusePlanned"
  | "SceneObjectShowPlanned"
  | "SceneObjectHidePlanned"
  | "SceneObjectDetachPlanned"
  | "SceneObjectRemovePlanned"
  | "SceneDriftDetected";

export interface NexoraDirectorSceneSynchronizationEvent {
  readonly eventId: string;
  readonly requestId: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly type: NexoraDirectorSceneSynchronizationEventType;
  readonly occurredAt: string;
  readonly synchronizationRevision: number;
  readonly source: NexoraDirectorSceneSynchronizationContext["source"];
  readonly actorId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorSceneSynchronizationRecord {
  readonly requestId: string;
  readonly revisionBefore: number;
  readonly revisionAfter: number;
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly createdCount: number;
  readonly updatedCount: number;
  readonly reusedCount: number;
  readonly shownCount: number;
  readonly hiddenCount: number;
  readonly detachedCount: number;
  readonly removedCount: number;
  readonly occurredAt: string;
  readonly warnings: readonly NexoraDirectorSceneSynchronizationWarning[];
  readonly errors: readonly NexoraDirectorSceneSynchronizationError[];
}

export interface NexoraDirectorSceneSynchronizationSnapshot {
  readonly snapshotId: string;
  readonly state: NexoraDirectorSceneSynchronizationState;
  readonly integrationCollection: NexoraObjectDirectorIntegrationCollection;
  readonly bindingRegistry: NexoraDirectorSceneBindingRegistry;
  readonly createdAt: string;
}

export interface NexoraDirectorSceneSynchronizationSnapshotComparison {
  readonly revisionChanged: boolean;
  readonly previousRevision: number;
  readonly nextRevision: number;
  readonly addedObjectIds: readonly string[];
  readonly removedObjectIds: readonly string[];
  readonly bindingGenerationChanges: readonly {
    readonly bindingId: string;
    readonly objectId: string;
    readonly from: number;
    readonly to: number;
  }[];
  readonly bindingLifecycleChanges: readonly {
    readonly bindingId: string;
    readonly objectId: string;
    readonly from: NexoraDirectorSceneBindingState;
    readonly to: NexoraDirectorSceneBindingState;
  }[];
  readonly sceneOrderChanged: boolean;
  readonly staleBindingObjectIds: readonly string[];
  readonly commandCountChanged: boolean;
  readonly previousCommandCount: number;
  readonly nextCommandCount: number;
}

export type NexoraDirectorSceneSynchronizationWarningCode =
  | "DIRECTOR_SYNC_NO_CHANGES"
  | "DIRECTOR_SYNC_BINDING_RECOVERED"
  | "DIRECTOR_SYNC_STALE_BINDING_DETECTED"
  | "DIRECTOR_SYNC_STALE_PACKAGE_DETECTED"
  | "DIRECTOR_SYNC_HIDDEN_BINDING_PRESERVED"
  | "DIRECTOR_SYNC_DETACHED_BINDING_PRESERVED"
  | "DIRECTOR_SYNC_BEST_EFFORT_PARTIAL"
  | "DIRECTOR_SYNC_REMOVE_DEFERRED"
  | "DIRECTOR_SYNC_ROLLBACK_NON_REVERSIBLE";

export interface NexoraDirectorSceneSynchronizationWarning {
  readonly code: NexoraDirectorSceneSynchronizationWarningCode;
  readonly message: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly commandId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraDirectorSceneSynchronizationErrorCode =
  | "DIRECTOR_SYNC_INVALID_REQUEST"
  | "DIRECTOR_SYNC_INVALID_COLLECTION"
  | "DIRECTOR_SYNC_INVALID_REGISTRY"
  | "DIRECTOR_SYNC_DUPLICATE_OBJECT_ID"
  | "DIRECTOR_SYNC_DUPLICATE_SCENE_OBJECT_ID"
  | "DIRECTOR_SYNC_DUPLICATE_COMMAND_ID"
  | "DIRECTOR_SYNC_BINDING_NOT_FOUND"
  | "DIRECTOR_SYNC_PACKAGE_NOT_FOUND"
  | "DIRECTOR_SYNC_BINDING_PACKAGE_MISMATCH"
  | "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH"
  | "DIRECTOR_SYNC_STALE_BINDING"
  | "DIRECTOR_SYNC_STALE_PACKAGE"
  | "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN"
  | "DIRECTOR_SYNC_INVALID_LIFECYCLE"
  | "DIRECTOR_SYNC_INVALID_COMMAND_ORDER"
  | "DIRECTOR_SYNC_COMMAND_DEPENDENCY_MISSING"
  | "DIRECTOR_SYNC_COMMAND_DEPENDENCY_CYCLE"
  | "DIRECTOR_SYNC_REVISION_CONFLICT"
  | "DIRECTOR_SYNC_ATOMIC_REJECTED"
  | "DIRECTOR_SYNC_ROLLBACK_UNAVAILABLE"
  | "DIRECTOR_SYNC_INVARIANT_VIOLATION"
  | "DIRECTOR_SYNC_RENDERER_OBJECT_FORBIDDEN"
  | "DIRECTOR_SYNC_UNSUPPORTED_VERSION";

export interface NexoraDirectorSceneSynchronizationError {
  readonly code: NexoraDirectorSceneSynchronizationErrorCode;
  readonly message: string;
  readonly requestId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly commandId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectDirectorSceneSynchronizationException extends Error {
  readonly code: NexoraDirectorSceneSynchronizationErrorCode;
  readonly requestId?: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly commandId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorSceneSynchronizationError) {
    super(error.message);
    this.name = "NexoraObjectDirectorSceneSynchronizationException";
    this.code = error.code;
    this.requestId = error.requestId;
    this.objectId = error.objectId;
    this.sceneObjectId = error.sceneObjectId;
    this.commandId = error.commandId;
    this.details = error.details;
  }
}

export type NexoraDirectorSceneSynchronizationValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly errors: readonly NexoraDirectorSceneSynchronizationError[];
    };

export interface NexoraDirectorSceneSynchronizationDependencies {
  readonly now: () => string;
  readonly createSynchronizationId: () => string;
  readonly createCommandId: (
    objectId: string,
    type: NexoraDirectorSceneSynchronizationCommandType,
  ) => string;
  readonly createEventId: () => string;
  readonly createCheckpointId: () => string;
  readonly createSnapshotId: () => string;
}

export interface NexoraDirectorSceneSynchronizationSimulationOptions {
  readonly stopOnFailure?: boolean;
}

export interface NexoraDirectorSceneSynchronizationSimulationResult {
  readonly results: readonly NexoraDirectorSceneSynchronizationResult[];
  readonly plans: readonly NexoraDirectorSceneSynchronizationPlan[];
  readonly finalRegistry: NexoraDirectorSceneBindingRegistry;
  readonly finalState: NexoraDirectorSceneSynchronizationState;
  readonly firstFailureIndex?: number;
}

export interface NexoraDirectorSceneSynchronizationHistoryProjection {
  readonly records: readonly NexoraDirectorSceneSynchronizationRecord[];
  readonly totalAccepted: number;
  readonly totalRejected: number;
  readonly totalCreated: number;
  readonly totalUpdated: number;
  readonly totalReused: number;
  readonly totalShown: number;
  readonly totalHidden: number;
  readonly totalDetached: number;
  readonly totalRemoved: number;
}

export interface NexoraDirectorSceneSynchronizationCheckpointRestore {
  readonly state: NexoraDirectorSceneSynchronizationState;
  readonly registry: NexoraDirectorSceneBindingRegistry;
  readonly integrationCollection: NexoraObjectDirectorIntegrationCollection;
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

function err(
  code: NexoraDirectorSceneSynchronizationErrorCode,
  message: string,
  extras?: Partial<NexoraDirectorSceneSynchronizationError>,
): NexoraDirectorSceneSynchronizationError {
  return Object.freeze({ code, message, ...extras });
}

function warn(
  code: NexoraDirectorSceneSynchronizationWarningCode,
  message: string,
  extras?: Partial<NexoraDirectorSceneSynchronizationWarning>,
): NexoraDirectorSceneSynchronizationWarning {
  return Object.freeze({ code, message, ...extras });
}

function throwSync(error: NexoraDirectorSceneSynchronizationError): never {
  throw new NexoraObjectDirectorSceneSynchronizationException(error);
}

function defaultDeps(): NexoraDirectorSceneSynchronizationDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createSynchronizationId: () => {
      seq += 1;
      return `dir-sync:${seq}`;
    },
    createCommandId: (
      objectId: string,
      type: NexoraDirectorSceneSynchronizationCommandType,
    ) => {
      seq += 1;
      return `dir-sync-cmd:${objectId}:${type}:${seq}`;
    },
    createEventId: () => {
      seq += 1;
      return `dir-sync-evt:${seq}`;
    },
    createCheckpointId: () => {
      seq += 1;
      return `dir-sync-ckpt:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-sync-snap:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationDependencies {
  return dependencies ?? defaultDeps();
}

function bindingDepsFrom(
  syncDeps: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneBindingDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => syncDeps.now(),
    createBindingId: (objectId: string, sceneObjectId: string) => {
      void sceneObjectId;
      return `nexora-binding:${objectId}`;
    },
    createRegistryId: (bindingIds: readonly string[]) => {
      seq += 1;
      return `dir-bind-reg:${bindingIds.join("|")}:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-bind-snap:${seq}`;
    },
  });
}

function resolveContext(
  context: NexoraDirectorSceneSynchronizationContext,
): NexoraDirectorSceneSynchronizationContext & {
  readonly removeMissingObjects: boolean;
  readonly preserveDetachedBindings: boolean;
  readonly allowBindingRecovery: boolean;
  readonly strictOrdering: boolean;
} {
  return deepFreeze({
    ...context,
    removeMissingObjects:
      context.removeMissingObjects ?? CONTEXT_DEFAULTS.removeMissingObjects,
    preserveDetachedBindings:
      context.preserveDetachedBindings ??
      CONTEXT_DEFAULTS.preserveDetachedBindings,
    allowBindingRecovery:
      context.allowBindingRecovery ?? CONTEXT_DEFAULTS.allowBindingRecovery,
    strictOrdering:
      context.strictOrdering ?? CONTEXT_DEFAULTS.strictOrdering,
  });
}

function emptyBindingDiff(): NexoraDirectorSceneBindingDiff {
  return deepFreeze({
    created: Object.freeze([]),
    updated: Object.freeze([]),
    hidden: Object.freeze([]),
    detached: Object.freeze([]),
    removed: Object.freeze([]),
    unchanged: Object.freeze([]),
  });
}

function phaseIndex(
  phase: NexoraDirectorSceneSynchronizationCommand["phase"],
): number {
  return PHASE_ORDER.indexOf(phase);
}

function layerIndex(layer: string | undefined): number {
  if (!layer) return SCENE_LAYER_ORDER.indexOf("Normal");
  const idx = SCENE_LAYER_ORDER.indexOf(
    layer as (typeof SCENE_LAYER_ORDER)[number],
  );
  return idx >= 0 ? idx : SCENE_LAYER_ORDER.indexOf("Normal");
}

function packageLayer(
  pkg: NexoraObjectDirectorIntegrationPackage | undefined,
): string {
  return pkg?.hierarchy.layer ?? "Normal";
}

function packagePriority(
  pkg: NexoraObjectDirectorIntegrationPackage | undefined,
): number {
  return pkg?.sceneObject.renderingPriority ?? 0;
}

function containsForbiddenRendererKeys(
  value: unknown,
  path = "",
): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "function") return path || "<root>";
  if (typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = containsForbiddenRendererKeys(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return undefined;
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
      lower === "vector3"
    ) {
      return path ? `${path}.${key}` : key;
    }
    const found = containsForbiddenRendererKeys(
      record[key],
      path ? `${path}.${key}` : key,
    );
    if (found) return found;
  }
  return undefined;
}

function packagesByObjectId(
  collection: NexoraObjectDirectorIntegrationCollection | undefined,
): Map<string, NexoraObjectDirectorIntegrationPackage> {
  const map = new Map<string, NexoraObjectDirectorIntegrationPackage>();
  if (!collection) return map;
  for (const pkg of collection.packages) {
    map.set(pkg.objectId, pkg);
  }
  return map;
}

function mapCollectionErrors(
  collectionErrors: readonly { readonly code: string; readonly message: string; readonly objectId?: string; readonly sceneObjectId?: string }[],
  requestId: string,
): NexoraDirectorSceneSynchronizationError[] {
  return collectionErrors.map((e) => {
    let code: NexoraDirectorSceneSynchronizationErrorCode =
      "DIRECTOR_SYNC_INVALID_COLLECTION";
    if (e.code.includes("DUPLICATE_OBJECT")) {
      code = "DIRECTOR_SYNC_DUPLICATE_OBJECT_ID";
    } else if (e.code.includes("DUPLICATE_SCENE")) {
      code = "DIRECTOR_SYNC_DUPLICATE_SCENE_OBJECT_ID";
    } else if (e.code.includes("RENDERER")) {
      code = "DIRECTOR_SYNC_RENDERER_OBJECT_FORBIDDEN";
    }
    return err(code, e.message, {
      requestId,
      objectId: e.objectId,
      sceneObjectId: e.sceneObjectId,
    });
  });
}

function overrideUpdateType(
  diff: NexoraObjectDirectorIntegrationDiff,
  nextPkg: NexoraObjectDirectorIntegrationPackage | undefined,
  forceRemove: boolean,
): NexoraDirectorSceneUpdateType {
  if (forceRemove || nextPkg?.rendering.updateStrategy === "Remove") {
    return "Remove";
  }
  return diff.update.type;
}

function sectionCommandsFor(
  sections: readonly NexoraDirectorProjectionSection[],
  previousPackage: NexoraObjectDirectorIntegrationPackage | undefined,
  nextPackage: NexoraObjectDirectorIntegrationPackage | undefined,
): NexoraDirectorSceneSynchronizationCommandType[] {
  const types: NexoraDirectorSceneSynchronizationCommandType[] = [];
  let interactionOrPicking = false;
  for (const section of sections) {
    if (section === "Metadata") {
      const prevStrategy = previousPackage?.rendering.updateStrategy;
      const nextStrategy = nextPackage?.rendering.updateStrategy;
      if (prevStrategy !== nextStrategy && nextStrategy !== undefined) {
        types.push("UpdateRendering");
      }
      continue;
    }
    const mapped = SECTION_COMMAND_MAP[section];
    if (mapped) types.push(mapped);
    if (section === "Interaction" || section === "Picking") {
      interactionOrPicking = true;
    }
  }
  if (interactionOrPicking) {
    types.push("UpdateEventRoutes");
  }
  return types;
}

function buildCommand(input: {
  readonly deps: NexoraDirectorSceneSynchronizationDependencies;
  readonly requestId: string;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly bindingId?: string;
  readonly type: NexoraDirectorSceneSynchronizationCommandType;
  readonly dependsOnCommandIds?: readonly string[];
  readonly changedSections?: readonly NexoraDirectorProjectionSection[];
  readonly previousPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly nextPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly reversible?: boolean;
  readonly payload?: Readonly<Record<string, unknown>>;
}): NexoraDirectorSceneSynchronizationCommand {
  const reversible =
    input.reversible ??
    (input.type !== "RemoveSceneObject" && input.type !== "DetachSceneObject");
  return deepFreeze({
    commandId: input.deps.createCommandId(input.objectId, input.type),
    requestId: input.requestId,
    objectId: input.objectId,
    sceneObjectId: input.sceneObjectId,
    bindingId: input.bindingId,
    type: input.type,
    order: 0,
    phase: COMMAND_PHASE_MAP[input.type],
    dependsOnCommandIds: Object.freeze([...(input.dependsOnCommandIds ?? [])]),
    changedSections: Object.freeze([...(input.changedSections ?? [])]),
    previousPackage: input.previousPackage,
    nextPackage: input.nextPackage,
    reversible,
    payload: deepFreeze({ ...(input.payload ?? {}) }),
  });
}

function withOrders(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): readonly NexoraDirectorSceneSynchronizationCommand[] {
  return Object.freeze(
    commands.map((command, index) =>
      deepFreeze({
        ...command,
        order: index,
      }),
    ),
  );
}

function detectCycles(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): boolean {
  const byId = new Map(commands.map((c) => [c.commandId, c]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): boolean => {
    if (visited.has(id)) return false;
    if (visiting.has(id)) return true;
    visiting.add(id);
    const command = byId.get(id);
    if (command) {
      for (const dep of command.dependsOnCommandIds) {
        if (visit(dep)) return true;
      }
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  for (const command of commands) {
    if (visit(command.commandId)) return true;
  }
  return false;
}

function topologicalKey(
  command: NexoraDirectorSceneSynchronizationCommand,
): {
  phase: number;
  layer: number;
  priority: number;
  objectId: string;
  commandId: string;
} {
  return {
    phase: phaseIndex(command.phase),
    layer: layerIndex(
      packageLayer(command.nextPackage ?? command.previousPackage),
    ),
    priority: packagePriority(
      command.nextPackage ?? command.previousPackage,
    ),
    objectId: command.objectId,
    commandId: command.commandId,
  };
}

function compareCommands(
  a: NexoraDirectorSceneSynchronizationCommand,
  b: NexoraDirectorSceneSynchronizationCommand,
): number {
  const ka = topologicalKey(a);
  const kb = topologicalKey(b);
  if (ka.phase !== kb.phase) return ka.phase - kb.phase;
  if (ka.layer !== kb.layer) return ka.layer - kb.layer;
  if (ka.priority !== kb.priority) return kb.priority - ka.priority;
  if (ka.objectId !== kb.objectId) {
    return ka.objectId < kb.objectId ? -1 : 1;
  }
  return ka.commandId < kb.commandId ? -1 : 1;
}

function sortWithDependencies(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): readonly NexoraDirectorSceneSynchronizationCommand[] {
  const remaining = new Map(commands.map((c) => [c.commandId, c]));
  const sorted: NexoraDirectorSceneSynchronizationCommand[] = [];
  const ready = (): NexoraDirectorSceneSynchronizationCommand[] => {
    const candidates: NexoraDirectorSceneSynchronizationCommand[] = [];
    for (const command of remaining.values()) {
      const depsOk = command.dependsOnCommandIds.every(
        (depId) => !remaining.has(depId),
      );
      if (depsOk) candidates.push(command);
    }
    candidates.sort(compareCommands);
    return candidates;
  };

  while (remaining.size > 0) {
    const candidates = ready();
    if (candidates.length === 0) {
      throwSync(
        err(
          "DIRECTOR_SYNC_COMMAND_DEPENDENCY_CYCLE",
          "Circular command dependencies detected.",
        ),
      );
    }
    const next = candidates[0]!;
    remaining.delete(next.commandId);
    sorted.push(next);
  }

  return withOrders(sorted);
}

function eventTypeForCommand(
  type: NexoraDirectorSceneSynchronizationCommandType,
): NexoraDirectorSceneSynchronizationEventType | undefined {
  switch (type) {
    case "CreateSceneObject":
      return "SceneObjectCreatePlanned";
    case "UpdateSceneObject":
    case "UpdateHierarchy":
    case "UpdateInteraction":
    case "UpdatePicking":
    case "UpdateCameraIntent":
    case "UpdateAnimationIntent":
    case "UpdateRelationships":
    case "UpdateClustering":
    case "UpdateRendering":
    case "UpdateEventRoutes":
      return "SceneObjectUpdatePlanned";
    case "ReuseSceneObject":
      return "SceneObjectReusePlanned";
    case "ShowSceneObject":
      return "SceneObjectShowPlanned";
    case "HideSceneObject":
      return "SceneObjectHidePlanned";
    case "DetachSceneObject":
      return "SceneObjectDetachPlanned";
    case "RemoveSceneObject":
      return "SceneObjectRemovePlanned";
    default:
      return undefined;
  }
}

function countCommandTypes(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): {
  createdCount: number;
  updatedCount: number;
  reusedCount: number;
  shownCount: number;
  hiddenCount: number;
  detachedCount: number;
  removedCount: number;
} {
  let createdCount = 0;
  let updatedCount = 0;
  let reusedCount = 0;
  let shownCount = 0;
  let hiddenCount = 0;
  let detachedCount = 0;
  let removedCount = 0;
  for (const command of commands) {
    switch (command.type) {
      case "CreateSceneObject":
        createdCount += 1;
        break;
      case "ReuseSceneObject":
        reusedCount += 1;
        break;
      case "ShowSceneObject":
        shownCount += 1;
        break;
      case "HideSceneObject":
        hiddenCount += 1;
        break;
      case "DetachSceneObject":
        detachedCount += 1;
        break;
      case "RemoveSceneObject":
        removedCount += 1;
        break;
      default:
        if (command.type.startsWith("Update")) updatedCount += 1;
        break;
    }
  }
  return {
    createdCount,
    updatedCount,
    reusedCount,
    shownCount,
    hiddenCount,
    detachedCount,
    removedCount,
  };
}

// ─── State ──────────────────────────────────────────────────────────────────

export function createNexoraDirectorSceneSynchronizationState(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  previousState?: NexoraDirectorSceneSynchronizationState,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationState {
  const deps = resolveDeps(dependencies);
  const now = deps.now();
  return deepFreeze({
    synchronizationId:
      previousState?.synchronizationId ?? deps.createSynchronizationId(),
    collectionId: collection.collectionId,
    revision: previousState?.revision ?? 0,
    status: "Idle" as const,
    packageCount: collection.packages.length,
    bindingCount: registry.bindings.length,
    pendingCommandCount: 0,
    completedCommandCount: 0,
    failedCommandCount: 0,
    updatedAt: now,
  });
}

// ─── Drift / Stale ──────────────────────────────────────────────────────────

export function detectNexoraDirectorSceneSynchronizationDrift(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
): readonly NexoraDirectorSceneSynchronizationDrift[] {
  const drifts: NexoraDirectorSceneSynchronizationDrift[] = [];
  const packages = packagesByObjectId(collection);
  const bindings = listBindings(registry);

  for (const pkg of collection.packages) {
    const binding = findBindingByObjectId(registry, pkg.objectId);
    if (!binding) {
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: pkg.sceneObject.sceneObjectId,
          type: "MissingBinding" as const,
          recoverable: true,
          message: `Missing binding for object ${pkg.objectId}.`,
        }),
      );
      continue;
    }
    if (binding.sceneObjectId !== pkg.sceneObject.sceneObjectId) {
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: pkg.sceneObject.sceneObjectId,
          type: "SceneIdentityMismatch" as const,
          recoverable: false,
          message: `Scene identity mismatch for ${pkg.objectId}.`,
        }),
      );
    }
    if (
      binding.packageId !== pkg.packageId &&
      binding.state !== "Removed"
    ) {
      // Not automatically stale; PackageMismatch when generation lagging handled below.
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: binding.sceneObjectId,
          type: "PackageMismatch" as const,
          recoverable: true,
          message: `Binding packageId differs from integration package for ${pkg.objectId}.`,
        }),
      );
    }
    if (binding.state === "Removed") {
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: binding.sceneObjectId,
          type: "UnexpectedRemoved" as const,
          recoverable: false,
          message: `Removed binding still has package for ${pkg.objectId}.`,
        }),
      );
    }
    if (binding.state === "Hidden" && pkg.sceneObject.visible) {
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: binding.sceneObjectId,
          type: "UnexpectedHidden" as const,
          recoverable: true,
          message: `Binding is Hidden while package is visible for ${pkg.objectId}.`,
        }),
      );
    }
    if (binding.state === "Detached") {
      drifts.push(
        deepFreeze({
          objectId: pkg.objectId,
          sceneObjectId: binding.sceneObjectId,
          type: "UnexpectedDetached" as const,
          recoverable: true,
          message: `Binding is Detached while package is present for ${pkg.objectId}.`,
        }),
      );
    }
  }

  for (const binding of bindings) {
    if (packages.has(binding.objectId)) continue;
    if (binding.state === "Removed") continue;
    drifts.push(
      deepFreeze({
        objectId: binding.objectId,
        sceneObjectId: binding.sceneObjectId,
        type: "MissingPackage" as const,
        recoverable: true,
        message: `Missing package for binding ${binding.objectId}.`,
      }),
    );
  }

  return Object.freeze(drifts);
}

export function findStaleNexoraDirectorSceneBindings(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
): readonly NexoraDirectorSceneBinding[] {
  const packages = packagesByObjectId(collection);
  const stale: NexoraDirectorSceneBinding[] = [];

  for (const binding of listBindings(registry)) {
    const pkg = packages.get(binding.objectId);
    let isStale = false;
    if (!pkg) {
      if (binding.state !== "Removed" && binding.state !== "Hidden") {
        isStale = true;
      }
    } else if (binding.sceneObjectId !== pkg.sceneObject.sceneObjectId) {
      isStale = true;
    } else if (
      binding.packageId !== pkg.packageId &&
      binding.state !== "Updated" &&
      binding.state !== "Bound"
    ) {
      // package differs but generation/state did not advance into Updated/Bound
      isStale = true;
    } else if (binding.state === "Bound" && !pkg.sceneObject.visible) {
      isStale = true;
    } else if (binding.state === "Hidden" && pkg.sceneObject.visible) {
      isStale = true;
    } else if (
      binding.state === "Removed" &&
      pkg.sceneObject.visible &&
      pkg.rendering.updateStrategy !== "Remove"
    ) {
      isStale = true;
    }
    if (isStale) stale.push(binding);
  }

  return Object.freeze(
    [...stale].sort((a, b) =>
      a.objectId < b.objectId ? -1 : a.objectId > b.objectId ? 1 : 0,
    ),
  );
}

export function findStaleNexoraDirectorIntegrationPackages(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  previousCollection?: NexoraObjectDirectorIntegrationCollection,
): readonly NexoraObjectDirectorIntegrationPackage[] {
  const previous = packagesByObjectId(previousCollection);
  const stale: NexoraObjectDirectorIntegrationPackage[] = [];

  for (const pkg of collection.packages) {
    const binding = findBindingByObjectId(registry, pkg.objectId);
    const prev = previous.get(pkg.objectId);
    let isStale = false;

    if (
      prev &&
      prev.packageVersion &&
      pkg.packageVersion &&
      prev.packageVersion.localeCompare(pkg.packageVersion, undefined, {
        numeric: true,
      }) > 0
    ) {
      isStale = true;
    }
    if (
      binding &&
      binding.sceneObjectId !== pkg.sceneObject.sceneObjectId
    ) {
      isStale = true;
    }
    if (
      binding &&
      binding.packageId === pkg.packageId &&
      binding.generation > 1 &&
      prev &&
      prev.packageId !== pkg.packageId
    ) {
      isStale = true;
    }
    if (isStale) stale.push(pkg);
  }

  return Object.freeze(
    [...stale].sort((a, b) =>
      a.objectId < b.objectId ? -1 : a.objectId > b.objectId ? 1 : 0,
    ),
  );
}

// ─── Command ordering / dependency validation ───────────────────────────────

export function resolveNexoraDirectorSceneSynchronizationCommandOrder(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): readonly NexoraDirectorSceneSynchronizationCommand[] {
  const validation = validateNexoraDirectorSceneSynchronizationDependencies(
    commands,
  );
  if (!validation.ok) {
    throwSync(validation.errors[0]!);
  }
  return sortWithDependencies(commands);
}

export function validateNexoraDirectorSceneSynchronizationDependencies(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  const byId = new Map(commands.map((c) => [c.commandId, c]));
  const ids = new Set<string>();

  for (const command of commands) {
    if (ids.has(command.commandId)) {
      errors.push(
        err(
          "DIRECTOR_SYNC_DUPLICATE_COMMAND_ID",
          `Duplicate commandId: ${command.commandId}`,
          { commandId: command.commandId, objectId: command.objectId },
        ),
      );
    }
    ids.add(command.commandId);

    for (const depId of command.dependsOnCommandIds) {
      if (depId === command.commandId) {
        errors.push(
          err(
            "DIRECTOR_SYNC_COMMAND_DEPENDENCY_CYCLE",
            `Command depends on itself: ${command.commandId}`,
            { commandId: command.commandId, objectId: command.objectId },
          ),
        );
      }
      if (!byId.has(depId)) {
        errors.push(
          err(
            "DIRECTOR_SYNC_COMMAND_DEPENDENCY_MISSING",
            `Missing dependency ${depId} for ${command.commandId}`,
            { commandId: command.commandId, objectId: command.objectId },
          ),
        );
      }
    }
  }

  if (detectCycles(commands)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_COMMAND_DEPENDENCY_CYCLE",
        "Circular command dependencies detected.",
      ),
    );
  }

  const byObject = new Map<string, NexoraDirectorSceneSynchronizationCommand[]>();
  for (const command of commands) {
    const list = byObject.get(command.objectId) ?? [];
    list.push(command);
    byObject.set(command.objectId, list);
  }

  for (const [objectId, objectCommands] of byObject) {
    const create = objectCommands.find((c) => c.type === "CreateSceneObject");
    const bind = objectCommands.find((c) => c.type === "BindSceneObject");
    if (create && bind && !bind.dependsOnCommandIds.includes(create.commandId)) {
      errors.push(
        err(
          "DIRECTOR_SYNC_INVALID_COMMAND_ORDER",
          `Bind must depend on Create for ${objectId}`,
          { objectId },
        ),
      );
    }
    const remove = objectCommands.find((c) => c.type === "RemoveSceneObject");
    if (remove) {
      const others = objectCommands.filter(
        (c) => c.commandId !== remove.commandId && c.type !== "DetachSceneObject",
      );
      for (const other of others) {
        if (
          phaseIndex(other.phase) > phaseIndex(remove.phase) ||
          (other.order > remove.order &&
            other.type !== "DetachSceneObject")
        ) {
          // Only flag if remove precedes required updates in explicit order field when set
          void other;
        }
      }
      for (const other of objectCommands) {
        if (
          other.type !== "RemoveSceneObject" &&
          other.type !== "DetachSceneObject" &&
          remove.order < other.order &&
          remove.order !== 0
        ) {
          errors.push(
            err(
              "DIRECTOR_SYNC_INVALID_COMMAND_ORDER",
              `Remove must occur last for ${objectId}`,
              { objectId, commandId: remove.commandId },
            ),
          );
          break;
        }
      }
    }
  }

  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

// ─── Rollback ───────────────────────────────────────────────────────────────

export function createNexoraDirectorSceneSynchronizationRollbackPlan(
  commands: readonly NexoraDirectorSceneSynchronizationCommand[],
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): {
  readonly rollbackCommands: readonly NexoraDirectorSceneSynchronizationCommand[];
  readonly warnings: readonly NexoraDirectorSceneSynchronizationWarning[];
} {
  const deps = resolveDeps(dependencies);
  const warnings: NexoraDirectorSceneSynchronizationWarning[] = [];
  const rollback: NexoraDirectorSceneSynchronizationCommand[] = [];

  const forward = [...commands].sort((a, b) => b.order - a.order);

  for (const command of forward) {
    if (command.type === "RemoveSceneObject") {
      warnings.push(
        warn(
          "DIRECTOR_SYNC_ROLLBACK_NON_REVERSIBLE",
          `RemoveSceneObject is non-reversible for ${command.objectId}.`,
          {
            objectId: command.objectId,
            sceneObjectId: command.sceneObjectId,
            commandId: command.commandId,
          },
        ),
      );
      continue;
    }
    if (command.type === "DetachSceneObject") {
      warnings.push(
        warn(
          "DIRECTOR_SYNC_ROLLBACK_NON_REVERSIBLE",
          `DetachSceneObject is non-reversible for ${command.objectId}.`,
          {
            objectId: command.objectId,
            sceneObjectId: command.sceneObjectId,
            commandId: command.commandId,
          },
        ),
      );
      continue;
    }

    let inverseType: NexoraDirectorSceneSynchronizationCommandType | undefined;
    let previousPackage = command.nextPackage;
    let nextPackage = command.previousPackage;
    let reversible = true;

    switch (command.type) {
      case "CreateSceneObject":
        inverseType = "RemoveSceneObject";
        previousPackage = command.nextPackage;
        nextPackage = undefined;
        reversible = false;
        break;
      case "BindSceneObject":
        inverseType = "DetachSceneObject";
        reversible = false;
        break;
      case "ShowSceneObject":
        inverseType = "HideSceneObject";
        break;
      case "HideSceneObject":
        inverseType = "ShowSceneObject";
        break;
      case "ReuseSceneObject":
        continue;
      default:
        if (command.type.startsWith("Update")) {
          if (!command.previousPackage) {
            warnings.push(
              warn(
                "DIRECTOR_SYNC_ROLLBACK_NON_REVERSIBLE",
                `Update rollback unavailable without previous package for ${command.objectId}.`,
                {
                  objectId: command.objectId,
                  commandId: command.commandId,
                },
              ),
            );
            continue;
          }
          inverseType = command.type;
          previousPackage = command.nextPackage;
          nextPackage = command.previousPackage;
        }
        break;
    }

    if (!inverseType) continue;

    rollback.push(
      buildCommand({
        deps,
        requestId: command.requestId,
        objectId: command.objectId,
        sceneObjectId: command.sceneObjectId,
        bindingId: command.bindingId,
        type: inverseType,
        changedSections: command.changedSections,
        previousPackage,
        nextPackage,
        reversible,
        payload: deepFreeze({
          rollbackOf: command.commandId,
        }),
      }),
    );
  }

  const ordered = withOrders(rollback);
  return deepFreeze({
    rollbackCommands: ordered,
    warnings: Object.freeze(warnings),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraDirectorSceneSynchronizationRequest(
  request: NexoraDirectorSceneSynchronizationRequest,
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  if (!request.requestId) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVALID_REQUEST",
        "requestId must be non-empty.",
      ),
    );
  }
  if (request.mode !== "Atomic" && request.mode !== "BestEffort") {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVALID_REQUEST",
        "mode must be Atomic or BestEffort.",
        { requestId: request.requestId },
      ),
    );
  }
  if (!request.context?.source) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVALID_REQUEST",
        "context.source is required.",
        { requestId: request.requestId },
      ),
    );
  }
  const forbidden = containsForbiddenRendererKeys(request);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_SYNC_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        {
          requestId: request.requestId,
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

export function validateNexoraDirectorSceneSynchronizationState(
  state: NexoraDirectorSceneSynchronizationState,
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  if (!state.synchronizationId) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "synchronizationId must be non-empty.",
      ),
    );
  }
  if (!Number.isInteger(state.revision) || state.revision < 0) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "revision must be a non-negative integer.",
        { details: { revision: state.revision } },
      ),
    );
  }
  for (const key of [
    "packageCount",
    "bindingCount",
    "pendingCommandCount",
    "completedCommandCount",
    "failedCommandCount",
  ] as const) {
    if (!Number.isInteger(state[key]) || state[key] < 0) {
      errors.push(
        err(
          "DIRECTOR_SYNC_INVARIANT_VIOLATION",
          `${key} must be a non-negative integer.`,
        ),
      );
    }
  }
  if (!isDeeplyFrozen(state)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Synchronization state must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorSceneSynchronizationCommand(
  command: NexoraDirectorSceneSynchronizationCommand,
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  if (!command.commandId) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "commandId must be non-empty.",
        { objectId: command.objectId },
      ),
    );
  }
  if (!command.objectId) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "objectId must be non-empty.",
        { commandId: command.commandId },
      ),
    );
  }
  if (!Number.isInteger(command.order) || command.order < 0) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVALID_COMMAND_ORDER",
        "command order must be a non-negative integer.",
        { commandId: command.commandId, objectId: command.objectId },
      ),
    );
  }
  if (command.type === "ReuseSceneObject" && command.changedSections.length > 0) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Reuse commands must not contain changed sections.",
        { commandId: command.commandId, objectId: command.objectId },
      ),
    );
  }
  if (
    command.type.startsWith("Update") &&
    command.changedSections.length === 0
  ) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Update commands must contain at least one changed section.",
        { commandId: command.commandId, objectId: command.objectId },
      ),
    );
  }
  if (!isJsonSafe(command.payload)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_RENDERER_OBJECT_FORBIDDEN",
        "Command payload must be JSON-safe.",
        { commandId: command.commandId, objectId: command.objectId },
      ),
    );
  }
  if (!isDeeplyFrozen(command)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Command must be deeply immutable.",
        { commandId: command.commandId },
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorSceneSynchronizationPlan(
  plan: NexoraDirectorSceneSynchronizationPlan,
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  if (!plan.requestId) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVALID_REQUEST",
        "plan.requestId must be non-empty.",
      ),
    );
  }
  const commandIds = new Set<string>();
  for (const command of plan.commands) {
    if (commandIds.has(command.commandId)) {
      errors.push(
        err(
          "DIRECTOR_SYNC_DUPLICATE_COMMAND_ID",
          `Duplicate commandId: ${command.commandId}`,
          { commandId: command.commandId },
        ),
      );
    }
    commandIds.add(command.commandId);
    const commandValidation = validateNexoraDirectorSceneSynchronizationCommand(
      command,
    );
    if (!commandValidation.ok) {
      errors.push(...commandValidation.errors);
    }
  }

  const depValidation =
    validateNexoraDirectorSceneSynchronizationDependencies(plan.commands);
  if (!depValidation.ok) {
    errors.push(...depValidation.errors);
  }

  const byObject = new Map<string, NexoraDirectorSceneSynchronizationCommand[]>();
  for (const command of plan.commands) {
    const list = byObject.get(command.objectId) ?? [];
    list.push(command);
    byObject.set(command.objectId, list);
  }
  for (const [objectId, objectCommands] of byObject) {
    const hasShow = objectCommands.some((c) => c.type === "ShowSceneObject");
    const hasHide = objectCommands.some((c) => c.type === "HideSceneObject");
    if (hasShow && hasHide) {
      errors.push(
        err(
          "DIRECTOR_SYNC_INVARIANT_VIOLATION",
          `Hide and Show must not occur together for ${objectId}`,
          { objectId },
        ),
      );
    }
  }

  if (!isDeeplyFrozen(plan)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Plan must be deeply immutable.",
      ),
    );
  }

  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function validateNexoraDirectorSceneSynchronizationResult(
  result: NexoraDirectorSceneSynchronizationResult,
): NexoraDirectorSceneSynchronizationValidationResult {
  const errors: NexoraDirectorSceneSynchronizationError[] = [];
  const planValidation = validateNexoraDirectorSceneSynchronizationPlan(
    result.plan,
  );
  if (!planValidation.ok) {
    errors.push(...planValidation.errors);
  }
  if (!result.accepted && result.changed && result.mode === "Atomic") {
    errors.push(
      err(
        "DIRECTOR_SYNC_ATOMIC_REJECTED",
        "Atomic rejected results must not report committed changes.",
      ),
    );
  }
  if (!isDeeplyFrozen(result)) {
    errors.push(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        "Result must be deeply immutable.",
      ),
    );
  }
  if (errors.length > 0) {
    return deepFreeze({ ok: false as const, errors: Object.freeze(errors) });
  }
  return deepFreeze({ ok: true as const });
}

export function assertNexoraDirectorSceneSynchronizationInvariants(
  value:
    | NexoraDirectorSceneSynchronizationState
    | NexoraDirectorSceneSynchronizationPlan
    | NexoraDirectorSceneSynchronizationResult
    | NexoraDirectorSceneSynchronizationCommand,
): void {
  let validation: NexoraDirectorSceneSynchronizationValidationResult;
  if ("commands" in value && "bindingDiff" in value) {
    validation = validateNexoraDirectorSceneSynchronizationPlan(value);
  } else if ("plan" in value && "commandResults" in value) {
    validation = validateNexoraDirectorSceneSynchronizationResult(value);
  } else if ("commandId" in value && "phase" in value) {
    validation = validateNexoraDirectorSceneSynchronizationCommand(value);
  } else {
    validation = validateNexoraDirectorSceneSynchronizationState(
      value as NexoraDirectorSceneSynchronizationState,
    );
  }
  if (!validation.ok) {
    throwSync(validation.errors[0]!);
  }
}

// ─── Evaluate ───────────────────────────────────────────────────────────────

function filterCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
  excludeObjectIds: ReadonlySet<string>,
): NexoraObjectDirectorIntegrationCollection {
  const packages = collection.packages.filter((pkg) => {
    if (!pkg.objectId) return false;
    if (excludeObjectIds.has(pkg.objectId)) return false;
    if (
      pkg.sceneObject?.objectId &&
      excludeObjectIds.has(pkg.sceneObject.objectId)
    ) {
      return false;
    }
    return true;
  });
  if (
    packages.length === collection.packages.length &&
    excludeObjectIds.size === 0
  ) {
    return collection;
  }
  const sceneIds = new Set(
    packages.map((pkg) => pkg.sceneObject.sceneObjectId),
  );
  return deepFreeze({
    ...collection,
    packages: Object.freeze(packages),
    sceneOrder: Object.freeze(
      collection.sceneOrder.filter((id) => sceneIds.has(id)),
    ),
    attentionSceneObjectIds: Object.freeze(
      collection.attentionSceneObjectIds.filter((id) => sceneIds.has(id)),
    ),
    hiddenSceneObjectIds: Object.freeze(
      collection.hiddenSceneObjectIds.filter((id) => sceneIds.has(id)),
    ),
  });
}

function generateCommandsForObject(input: {
  readonly deps: NexoraDirectorSceneSynchronizationDependencies;
  readonly requestId: string;
  readonly updateType: NexoraDirectorSceneUpdateType;
  readonly changedSections: readonly NexoraDirectorProjectionSection[];
  readonly previousPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly nextPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly binding?: NexoraDirectorSceneBinding;
  readonly objectId: string;
  readonly sceneObjectId: string;
}): NexoraDirectorSceneSynchronizationCommand[] {
  const {
    deps,
    requestId,
    updateType,
    changedSections,
    previousPackage,
    nextPackage,
    binding,
    objectId,
    sceneObjectId,
  } = input;
  const bindingId = binding?.bindingId;
  const commands: NexoraDirectorSceneSynchronizationCommand[] = [];

  if (updateType === "Create") {
    const create = buildCommand({
      deps,
      requestId,
      objectId,
      sceneObjectId,
      bindingId,
      type: "CreateSceneObject",
      changedSections,
      previousPackage,
      nextPackage,
      reversible: true,
    });
    const bind = buildCommand({
      deps,
      requestId,
      objectId,
      sceneObjectId,
      bindingId,
      type: "BindSceneObject",
      dependsOnCommandIds: [create.commandId],
      changedSections: Object.freeze([]),
      previousPackage,
      nextPackage,
    });
    commands.push(create, bind);
    const sectionTypes = sectionCommandsFor(
      changedSections,
      previousPackage,
      nextPackage,
    );
    for (const type of sectionTypes) {
      commands.push(
        buildCommand({
          deps,
          requestId,
          objectId,
          sceneObjectId,
          bindingId,
          type,
          dependsOnCommandIds: [bind.commandId],
          changedSections: Object.freeze(
            changedSections.filter((section) => {
              if (type === "UpdateEventRoutes") {
                return section === "Interaction" || section === "Picking";
              }
              const mapped =
                SECTION_COMMAND_MAP[
                  section as keyof typeof SECTION_COMMAND_MAP
                ];
              return mapped === type;
            }),
          ),
          previousPackage,
          nextPackage,
        }),
      );
    }
    if (nextPackage?.sceneObject.visible) {
      commands.push(
        buildCommand({
          deps,
          requestId,
          objectId,
          sceneObjectId,
          bindingId,
          type: "ShowSceneObject",
          dependsOnCommandIds: [bind.commandId],
          previousPackage,
          nextPackage,
        }),
      );
    }
    return commands;
  }

  if (updateType === "Reuse") {
    commands.push(
      buildCommand({
        deps,
        requestId,
        objectId,
        sceneObjectId,
        bindingId,
        type: "ReuseSceneObject",
        changedSections: Object.freeze([]),
        previousPackage,
        nextPackage,
      }),
    );
    return commands;
  }

  if (updateType === "Hide") {
    commands.push(
      buildCommand({
        deps,
        requestId,
        objectId,
        sceneObjectId,
        bindingId,
        type: "HideSceneObject",
        previousPackage,
        nextPackage,
      }),
    );
    return commands;
  }

  if (updateType === "Show") {
    commands.push(
      buildCommand({
        deps,
        requestId,
        objectId,
        sceneObjectId,
        bindingId,
        type: "ShowSceneObject",
        previousPackage,
        nextPackage,
      }),
    );
    return commands;
  }

  if (updateType === "Remove") {
    const detach = buildCommand({
      deps,
      requestId,
      objectId,
      sceneObjectId,
      bindingId,
      type: "DetachSceneObject",
      previousPackage,
      nextPackage,
      reversible: false,
    });
    const remove = buildCommand({
      deps,
      requestId,
      objectId,
      sceneObjectId,
      bindingId,
      type: "RemoveSceneObject",
      dependsOnCommandIds: [detach.commandId],
      previousPackage,
      nextPackage,
      reversible: false,
    });
    commands.push(detach, remove);
    return commands;
  }

  // Update
  const sectionTypes = sectionCommandsFor(
    changedSections,
    previousPackage,
    nextPackage,
  );
  const anchorIds: string[] = [];
  for (const type of sectionTypes) {
    const command = buildCommand({
      deps,
      requestId,
      objectId,
      sceneObjectId,
      bindingId,
      type,
      dependsOnCommandIds: anchorIds.length > 0 ? [anchorIds[0]!] : [],
      changedSections: Object.freeze(
        changedSections.filter((section) => {
          if (type === "UpdateEventRoutes") {
            return section === "Interaction" || section === "Picking";
          }
          const mapped =
            SECTION_COMMAND_MAP[section as keyof typeof SECTION_COMMAND_MAP];
          return mapped === type;
        }),
      ),
      previousPackage,
      nextPackage,
    });
    if (anchorIds.length === 0) {
      // first update has no dep; subsequent can depend on first for stability
      void 0;
    }
    commands.push(command);
    if (anchorIds.length === 0) anchorIds.push(command.commandId);
  }
  return commands;
}

export function evaluateNexoraDirectorSceneSynchronization(
  request: NexoraDirectorSceneSynchronizationRequest,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationPlan {
  const deps = resolveDeps(dependencies);
  const context = resolveContext(request.context);
  const warnings: NexoraDirectorSceneSynchronizationWarning[] = [];
  const errors: NexoraDirectorSceneSynchronizationError[] = [];

  const previousState =
    request.previousSynchronizationState ??
    createNexoraDirectorSceneSynchronizationState(
      request.integrationCollection,
      request.bindingRegistry,
      undefined,
      deps,
    );

  const failPlan = (
    planErrors: readonly NexoraDirectorSceneSynchronizationError[],
    planWarnings: readonly NexoraDirectorSceneSynchronizationWarning[] = warnings,
  ): NexoraDirectorSceneSynchronizationPlan => {
    const projectedState = deepFreeze({
      ...previousState,
      status: "Failed" as const,
      updatedAt: deps.now(),
      pendingCommandCount: 0,
      failedCommandCount: planErrors.length,
    });
    return deepFreeze({
      requestId: request.requestId,
      accepted: false,
      noOp: true,
      mode: request.mode,
      previousState,
      projectedState,
      bindingDiff: emptyBindingDiff(),
      commands: Object.freeze([]),
      rollbackCommands: Object.freeze([]),
      affectedObjectIds: Object.freeze([]),
      unchangedObjectIds: Object.freeze([]),
      staleObjectIds: Object.freeze([]),
      warnings: Object.freeze([...planWarnings]),
      errors: Object.freeze([...planErrors]),
    });
  };

  const requestValidation =
    validateNexoraDirectorSceneSynchronizationRequest(request);
  if (!requestValidation.ok) {
    return failPlan(requestValidation.errors);
  }

  const collectionErrors = validateNexoraObjectDirectorIntegrationCollection(
    request.integrationCollection,
  );
  const mappedCollectionErrors = mapCollectionErrors(
    collectionErrors,
    request.requestId,
  );

  if (
    request.expectedSynchronizationRevision !== undefined &&
    request.expectedSynchronizationRevision !== previousState.revision
  ) {
    return failPlan([
      err(
        "DIRECTOR_SYNC_REVISION_CONFLICT",
        "expectedSynchronizationRevision does not match current revision.",
        {
          requestId: request.requestId,
          details: {
            expected: request.expectedSynchronizationRevision,
            actual: previousState.revision,
          },
        },
      ),
    ]);
  }

  // Prefer explicit drift classification before hard registry rejection.
  const earlyDrifts = detectNexoraDirectorSceneSynchronizationDrift(
    request.integrationCollection,
    request.bindingRegistry,
  );
  const earlySceneIdentity = earlyDrifts.filter(
    (d) => d.type === "SceneIdentityMismatch",
  );
  if (request.mode === "Atomic" && earlySceneIdentity.length > 0) {
    return failPlan(
      earlySceneIdentity.map((d) =>
        err("DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH", d.message, {
          requestId: request.requestId,
          objectId: d.objectId,
          sceneObjectId: d.sceneObjectId,
        }),
      ),
      warnings,
    );
  }

  const registryValidation = validateDirectorSceneBindingRegistry(
    request.bindingRegistry,
  );
  if (!registryValidation.ok) {
    for (const e of registryValidation.errors) {
      const identityRelated =
        e.message.includes("deterministic") ||
        e.message.includes("sceneObjectId must");
      errors.push(
        err(
          identityRelated
            ? "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH"
            : "DIRECTOR_SYNC_INVALID_REGISTRY",
          e.message,
          {
            requestId: request.requestId,
            objectId: e.objectId,
            sceneObjectId: e.sceneObjectId,
            details: e.details,
          },
        ),
      );
    }
  }

  const invalidObjectIds = new Set<string>();
  for (const pkg of request.integrationCollection.packages) {
    const packageErrors = validateNexoraObjectDirectorIntegrationPackage(pkg);
    if (packageErrors.length > 0) {
      if (pkg.objectId) invalidObjectIds.add(pkg.objectId);
      if (pkg.sceneObject?.objectId) {
        invalidObjectIds.add(pkg.sceneObject.objectId);
      }
      // Empty objectId packages are always dropped by filterCollection.
    }
  }
  for (const e of mappedCollectionErrors) {
    if (e.objectId) invalidObjectIds.add(e.objectId);
  }

  if (request.mode === "Atomic" && mappedCollectionErrors.length > 0) {
    return failPlan(
      [
        ...mappedCollectionErrors,
        err(
          "DIRECTOR_SYNC_ATOMIC_REJECTED",
          "Atomic synchronization rejected due to invalid packages.",
          { requestId: request.requestId },
        ),
      ],
      warnings,
    );
  }

  if (request.mode === "Atomic" && errors.length > 0) {
    return failPlan(errors, warnings);
  }

  if (request.mode === "BestEffort" && mappedCollectionErrors.length > 0) {
    errors.push(...mappedCollectionErrors);
    warnings.push(
      warn(
        "DIRECTOR_SYNC_BEST_EFFORT_PARTIAL",
        "BestEffort isolation applied for invalid packages.",
        { details: { requestId: request.requestId } },
      ),
    );
  }

  const workingCollection = filterCollection(
    request.integrationCollection,
    invalidObjectIds,
  );

  const previousPackages = packagesByObjectId(
    request.previousIntegrationCollection,
  );
  const nextPackages = packagesByObjectId(workingCollection);

  const drifts = detectNexoraDirectorSceneSynchronizationDrift(
    workingCollection,
    request.bindingRegistry,
  );
  const nonRecoverable = drifts.filter((d) => !d.recoverable);
  const sceneIdentityDrifts = drifts.filter(
    (d) => d.type === "SceneIdentityMismatch",
  );

  for (const drift of drifts) {
    if (drift.type === "SceneDriftDetected" as string) {
      void drift;
    }
  }

  if (request.mode === "Atomic" && sceneIdentityDrifts.length > 0) {
    return failPlan(
      sceneIdentityDrifts.map((d) =>
        err(
          "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH",
          d.message,
          {
            requestId: request.requestId,
            objectId: d.objectId,
            sceneObjectId: d.sceneObjectId,
          },
        ),
      ),
      warnings,
    );
  }

  if (request.mode === "Atomic" && nonRecoverable.length > 0) {
    const removedReuse = nonRecoverable.filter(
      (d) => d.type === "UnexpectedRemoved",
    );
    if (removedReuse.length > 0) {
      return failPlan(
        removedReuse.map((d) =>
          err(
            "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN",
            d.message,
            {
              requestId: request.requestId,
              objectId: d.objectId,
              sceneObjectId: d.sceneObjectId,
            },
          ),
        ),
        warnings,
      );
    }
  }

  const isolatedObjectIds = new Set<string>(invalidObjectIds);
  if (request.mode === "BestEffort") {
    for (const drift of sceneIdentityDrifts) {
      isolatedObjectIds.add(drift.objectId);
      errors.push(
        err(
          "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH",
          drift.message,
          {
            requestId: request.requestId,
            objectId: drift.objectId,
            sceneObjectId: drift.sceneObjectId,
          },
        ),
      );
    }
    for (const drift of nonRecoverable) {
      if (drift.type === "UnexpectedRemoved") {
        isolatedObjectIds.add(drift.objectId);
        errors.push(
          err(
            "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN",
            drift.message,
            {
              requestId: request.requestId,
              objectId: drift.objectId,
              sceneObjectId: drift.sceneObjectId,
            },
          ),
        );
      }
    }
  }

  const effectiveCollection = filterCollection(
    workingCollection,
    isolatedObjectIds,
  );
  const effectiveNextPackages = packagesByObjectId(effectiveCollection);

  // Recovery policy / removed bindings
  for (const binding of listBindings(request.bindingRegistry)) {
    const pkg = effectiveNextPackages.get(binding.objectId);
    if (!pkg) continue;
    if (binding.state === "Removed") {
      isolatedObjectIds.add(binding.objectId);
      errors.push(
        err(
          "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN",
          `Removed binding cannot be reused for ${binding.objectId}.`,
          {
            requestId: request.requestId,
            objectId: binding.objectId,
            sceneObjectId: binding.sceneObjectId,
          },
        ),
      );
    } else if (
      binding.state === "Detached" &&
      !context.allowBindingRecovery
    ) {
      isolatedObjectIds.add(binding.objectId);
      errors.push(
        err(
          "DIRECTOR_SYNC_INVALID_LIFECYCLE",
          `Detached binding recovery is disabled for ${binding.objectId}.`,
          {
            requestId: request.requestId,
            objectId: binding.objectId,
            sceneObjectId: binding.sceneObjectId,
          },
        ),
      );
    } else if (binding.state === "Detached" && context.allowBindingRecovery) {
      warnings.push(
        warn(
          "DIRECTOR_SYNC_BINDING_RECOVERED",
          `Detached binding recovered for ${binding.objectId}.`,
          {
            objectId: binding.objectId,
            sceneObjectId: binding.sceneObjectId,
          },
        ),
      );
    }
  }

  if (
    request.mode === "Atomic" &&
    errors.some(
      (e) =>
        e.code === "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN" ||
        e.code === "DIRECTOR_SYNC_INVALID_LIFECYCLE",
    )
  ) {
    return failPlan(errors, warnings);
  }

  const finalCollection = filterCollection(
    effectiveCollection,
    isolatedObjectIds,
  );
  const finalNextPackages = packagesByObjectId(finalCollection);
  const bindingDeps = bindingDepsFrom(deps);

  let nextRegistry: NexoraDirectorSceneBindingRegistry;
  try {
    nextRegistry = reconcileDirectorSceneBindingRegistry(
      request.bindingRegistry,
      finalCollection,
      bindingDeps,
    );
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : "Binding reconciliation failed.";
    const code =
      caught instanceof Error &&
      "code" in caught &&
      (caught as { code: string }).code === "BINDING_REMOVED_CANNOT_REBIND"
        ? "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN"
        : "DIRECTOR_SYNC_INVALID_REGISTRY";
    if (request.mode === "Atomic") {
      return failPlan(
        [
          err(code as NexoraDirectorSceneSynchronizationErrorCode, message, {
            requestId: request.requestId,
          }),
          err(
            "DIRECTOR_SYNC_ATOMIC_REJECTED",
            "Atomic synchronization rejected during binding reconciliation.",
            { requestId: request.requestId },
          ),
        ],
        warnings,
      );
    }
    errors.push(
      err(code as NexoraDirectorSceneSynchronizationErrorCode, message, {
        requestId: request.requestId,
      }),
    );
    nextRegistry = request.bindingRegistry;
  }

  // Apply removeMissingObjects by removing bindings for absent packages.
  if (context.removeMissingObjects) {
    const present = new Set(finalCollection.packages.map((p) => p.objectId));
    const pruned: NexoraDirectorSceneBinding[] = [];
    for (const binding of nextRegistry.bindings) {
      if (present.has(binding.objectId) || binding.state === "Removed") {
        pruned.push(binding);
        continue;
      }
      try {
        pruned.push(removeDirectorSceneBinding(binding, bindingDeps));
      } catch {
        pruned.push(binding);
        warnings.push(
          warn(
            "DIRECTOR_SYNC_REMOVE_DEFERRED",
            `Unable to remove binding for ${binding.objectId}.`,
            {
              objectId: binding.objectId,
              sceneObjectId: binding.sceneObjectId,
            },
          ),
        );
      }
    }
    nextRegistry = deepFreeze({
      registryId: nextRegistry.registryId,
      bindings: Object.freeze(pruned),
    });
  } else {
    for (const binding of listBindings(request.bindingRegistry)) {
      if (finalNextPackages.has(binding.objectId)) continue;
      if (binding.state === "Removed") continue;
      if (binding.state === "Detached" && context.preserveDetachedBindings) {
        warnings.push(
          warn(
            "DIRECTOR_SYNC_DETACHED_BINDING_PRESERVED",
            `Detached binding preserved for ${binding.objectId}.`,
            {
              objectId: binding.objectId,
              sceneObjectId: binding.sceneObjectId,
            },
          ),
        );
      } else {
        warnings.push(
          warn(
            "DIRECTOR_SYNC_HIDDEN_BINDING_PRESERVED",
            `Missing package preserves binding for ${binding.objectId}.`,
            {
              objectId: binding.objectId,
              sceneObjectId: binding.sceneObjectId,
            },
          ),
        );
      }
    }
  }

  const staleBindings = findStaleNexoraDirectorSceneBindings(
    finalCollection,
    request.bindingRegistry,
  );
  const stalePackages = findStaleNexoraDirectorIntegrationPackages(
    finalCollection,
    request.bindingRegistry,
    request.previousIntegrationCollection,
  );
  for (const binding of staleBindings) {
    warnings.push(
      warn(
        "DIRECTOR_SYNC_STALE_BINDING_DETECTED",
        `Stale binding detected for ${binding.objectId}.`,
        {
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }
  for (const pkg of stalePackages) {
    warnings.push(
      warn(
        "DIRECTOR_SYNC_STALE_PACKAGE_DETECTED",
        `Stale package detected for ${pkg.objectId}.`,
        {
          objectId: pkg.objectId,
          sceneObjectId: pkg.sceneObject.sceneObjectId,
        },
      ),
    );
  }

  const bindingDiff = calculateDirectorSceneBindingDiff(
    request.bindingRegistry,
    nextRegistry,
  );

  const objectIds = new Set<string>([
    ...previousPackages.keys(),
    ...finalNextPackages.keys(),
    ...listBindings(request.bindingRegistry).map((b) => b.objectId),
  ]);

  const rawCommands: NexoraDirectorSceneSynchronizationCommand[] = [];
  const affectedObjectIds: string[] = [];
  const unchangedObjectIds: string[] = [];

  for (const objectId of [...objectIds].sort()) {
    if (isolatedObjectIds.has(objectId)) continue;

    const nextPkg = finalNextPackages.get(objectId);
    const prevPkg = previousPackages.get(objectId);
    const previousBinding = findBindingByObjectId(
      request.bindingRegistry,
      objectId,
    );
    const reconciledBinding = findBindingByObjectId(nextRegistry, objectId);
    const bindingForCommands = reconciledBinding ?? previousBinding;

    const missingNext = !nextPkg;
    const forceRemove =
      missingNext &&
      context.removeMissingObjects &&
      !!previousBinding &&
      previousBinding.state !== "Removed";

    if (missingNext && !forceRemove) {
      if (
        !previousBinding ||
        previousBinding.state === "Removed" ||
        previousBinding.state === "Hidden"
      ) {
        unchangedObjectIds.push(objectId);
        continue;
      }
      // Preserve via Hide
      const sceneObjectId =
        previousBinding.sceneObjectId ||
        createNexoraDirectorSceneObjectId(objectId);
      const hideCommands = generateCommandsForObject({
        deps,
        requestId: request.requestId,
        updateType: "Hide",
        changedSections: Object.freeze([]),
        previousPackage: prevPkg,
        nextPackage: prevPkg,
        binding: bindingForCommands,
        objectId,
        sceneObjectId,
      });
      rawCommands.push(...hideCommands);
      affectedObjectIds.push(objectId);
      continue;
    }

    if (forceRemove) {
      const sceneObjectId =
        previousBinding?.sceneObjectId ||
        prevPkg?.sceneObject.sceneObjectId ||
        createNexoraDirectorSceneObjectId(objectId);
      rawCommands.push(
        ...generateCommandsForObject({
          deps,
          requestId: request.requestId,
          updateType: "Remove",
          changedSections: Object.freeze([]),
          previousPackage: prevPkg,
          nextPackage: undefined,
          binding: bindingForCommands ?? previousBinding,
          objectId,
          sceneObjectId,
        }),
      );
      affectedObjectIds.push(objectId);
      continue;
    }

    if (!nextPkg) continue;

    // Previous binding presence decides Create vs Update/Reuse.
    let updateType: NexoraDirectorSceneUpdateType;
    let changedSections: readonly NexoraDirectorProjectionSection[];
    const previousForDiff = prevPkg;
    const hadPreviousBinding =
      !!previousBinding && previousBinding.state !== "Removed";

    if (!hadPreviousBinding) {
      const diff = calculateNexoraObjectDirectorIntegrationDiff(
        previousForDiff,
        nextPkg,
      );
      updateType = overrideUpdateType(diff, nextPkg, false);
      if (updateType !== "Remove") {
        updateType = previousForDiff ? updateType : "Create";
      }
      changedSections = diff.update.changedSections;
    } else if (!previousForDiff) {
      if (previousBinding!.packageId === nextPkg.packageId) {
        updateType = "Reuse";
        changedSections = Object.freeze([]);
      } else {
        const diff = calculateNexoraObjectDirectorIntegrationDiff(
          undefined,
          nextPkg,
        );
        updateType = "Update";
        changedSections = diff.update.changedSections;
      }
    } else {
      const diff = calculateNexoraObjectDirectorIntegrationDiff(
        previousForDiff,
        nextPkg,
      );
      updateType = overrideUpdateType(diff, nextPkg, false);
      changedSections = diff.update.changedSections;
      if (updateType === "Create") {
        updateType = changedSections.length === 0 ? "Reuse" : "Update";
      }
    }

    // packageId is outside projection sections; treat identity package
    // changes as updates so bindings advance generation.
    const previousPackageId =
      previousForDiff?.packageId ?? previousBinding?.packageId;
    if (
      previousPackageId &&
      previousPackageId !== nextPkg.packageId &&
      updateType === "Reuse"
    ) {
      updateType = "Update";
      changedSections = Object.freeze(["Rendering" as const]);
    }

    if (updateType === "Reuse") {
      unchangedObjectIds.push(objectId);
    } else {
      affectedObjectIds.push(objectId);
    }

    const sceneObjectId = nextPkg.sceneObject.sceneObjectId;
    const generated = generateCommandsForObject({
      deps,
      requestId: request.requestId,
      updateType,
      changedSections,
      previousPackage: previousForDiff,
      nextPackage: nextPkg,
      binding: bindingForCommands,
      objectId,
      sceneObjectId,
    });
    if (generated.length === 0) {
      if (updateType !== "Reuse") {
        const idx = affectedObjectIds.indexOf(objectId);
        if (idx >= 0) affectedObjectIds.splice(idx, 1);
        unchangedObjectIds.push(objectId);
      }
      continue;
    }
    rawCommands.push(...generated);
  }

  let commands: readonly NexoraDirectorSceneSynchronizationCommand[];
  try {
    commands = resolveNexoraDirectorSceneSynchronizationCommandOrder(
      rawCommands,
    );
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : "Command ordering failed.";
    const code =
      caught instanceof NexoraObjectDirectorSceneSynchronizationException
        ? caught.code
        : "DIRECTOR_SYNC_INVALID_COMMAND_ORDER";
    return failPlan(
      [
        err(code as NexoraDirectorSceneSynchronizationErrorCode, message, {
          requestId: request.requestId,
        }),
      ],
      warnings,
    );
  }

  const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
    commands,
    deps,
  );
  warnings.push(...rollback.warnings);

  const noOp =
    commands.length === 0 ||
    commands.every((command) => command.type === "ReuseSceneObject");
  if (noOp) {
    warnings.push(
      warn(
        "DIRECTOR_SYNC_NO_CHANGES",
        "Synchronization produced no scene changes.",
        { details: { requestId: request.requestId } },
      ),
    );
  }

  const changed =
    !noOp ||
    bindingDiff.created.length > 0 ||
    bindingDiff.updated.length > 0 ||
    bindingDiff.hidden.length > 0 ||
    bindingDiff.detached.length > 0 ||
    bindingDiff.removed.length > 0;

  const accepted =
    request.mode === "Atomic"
      ? errors.length === 0
      : errors.length === 0 || affectedObjectIds.length > 0 || noOp;

  const nextRevision =
    accepted && changed && !noOp
      ? previousState.revision + 1
      : previousState.revision;

  const projectedStatus =
    !accepted
      ? ("Failed" as const)
      : request.mode === "BestEffort" && errors.length > 0
        ? ("PartiallyCompleted" as const)
        : ("Ready" as const);

  const projectedState = deepFreeze({
    synchronizationId: previousState.synchronizationId,
    collectionId: finalCollection.collectionId,
    revision: nextRevision,
    status: projectedStatus,
    packageCount: finalCollection.packages.length,
    bindingCount: nextRegistry.bindings.length,
    pendingCommandCount: accepted ? commands.length : 0,
    completedCommandCount: 0,
    failedCommandCount: errors.length,
    updatedAt: deps.now(),
    ...(previousState.startedAt
      ? { startedAt: previousState.startedAt }
      : {}),
  });

  // Repair planning for recoverable drift: ensure MissingBinding creates commands.
  void drifts;
  void nextPackages;

  const plan = deepFreeze({
    requestId: request.requestId,
    accepted,
    noOp: noOp || !changed,
    mode: request.mode,
    previousState,
    projectedState,
    bindingDiff,
    commands: accepted ? commands : Object.freeze([] as NexoraDirectorSceneSynchronizationCommand[]),
    rollbackCommands: accepted
      ? rollback.rollbackCommands
      : Object.freeze([] as NexoraDirectorSceneSynchronizationCommand[]),
    affectedObjectIds: Object.freeze(affectedObjectIds),
    unchangedObjectIds: Object.freeze(unchangedObjectIds),
    staleObjectIds: Object.freeze(
      [
        ...new Set([
          ...staleBindings.map((b) => b.objectId),
          ...stalePackages.map((p) => p.objectId),
        ]),
      ].sort(),
    ),
    warnings: Object.freeze(warnings),
    errors: Object.freeze(errors),
  });

  // For Atomic reject after planning diagnostics, still expose rollback when requested.
  if (!accepted && request.mode === "Atomic") {
    return deepFreeze({
      ...plan,
      commands: Object.freeze([] as NexoraDirectorSceneSynchronizationCommand[]),
      rollbackCommands: rollback.rollbackCommands,
      bindingDiff: emptyBindingDiff(),
      projectedState: deepFreeze({
        ...previousState,
        status: "Failed" as const,
        updatedAt: deps.now(),
        failedCommandCount: errors.length,
        pendingCommandCount: 0,
      }),
    });
  }

  return plan;
}

// ─── Apply / synchronize ────────────────────────────────────────────────────

export function applyNexoraDirectorSceneSynchronization(
  request: NexoraDirectorSceneSynchronizationRequest,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationResult {
  const deps = resolveDeps(dependencies);
  const plan = evaluateNexoraDirectorSceneSynchronization(request, deps);
  const previousRegistry = request.bindingRegistry;
  const dryRun = request.dryRun === true;
  const now = deps.now();

  const commandResults: NexoraDirectorSceneSynchronizationCommandResult[] =
    plan.commands.map((command) =>
      deepFreeze({
        commandId: command.commandId,
        objectId: command.objectId,
        sceneObjectId: command.sceneObjectId,
        type: command.type,
        accepted: plan.accepted,
        changed: command.type !== "ReuseSceneObject",
        status: plan.accepted
          ? ("Planned" as const)
          : ("Rejected" as const),
        reason: plan.accepted ? undefined : "Synchronization rejected.",
        errors: Object.freeze(
          plan.accepted
            ? []
            : plan.errors.filter(
                (e) => !e.objectId || e.objectId === command.objectId,
              ),
        ),
      }),
    );

  const events: NexoraDirectorSceneSynchronizationEvent[] = [];
  const pushEvent = (
    type: NexoraDirectorSceneSynchronizationEventType,
    extras?: Partial<NexoraDirectorSceneSynchronizationEvent>,
  ): void => {
    events.push(
      deepFreeze({
        eventId: deps.createEventId(),
        requestId: request.requestId,
        type,
        occurredAt: now,
        synchronizationRevision: plan.previousState.revision,
        source: request.context.source,
        actorId: request.context.actorId,
        correlationId: request.context.correlationId,
        causationId: request.context.causationId,
        payload: deepFreeze({}),
        ...extras,
      }),
    );
  };

  pushEvent("SynchronizationPlanned", {
    payload: deepFreeze({
      commandCount: plan.commands.length,
      accepted: plan.accepted,
    }),
  });

  for (const drift of detectNexoraDirectorSceneSynchronizationDrift(
    request.integrationCollection,
    request.bindingRegistry,
  )) {
    pushEvent("SceneDriftDetected", {
      objectId: drift.objectId,
      sceneObjectId: drift.sceneObjectId,
      payload: deepFreeze({
        driftType: drift.type,
        recoverable: drift.recoverable,
        message: drift.message,
      }),
    });
  }

  for (const command of plan.commands) {
    const eventType = eventTypeForCommand(command.type);
    if (!eventType) continue;
    pushEvent(eventType, {
      objectId: command.objectId,
      sceneObjectId: command.sceneObjectId,
      payload: deepFreeze({ commandId: command.commandId, type: command.type }),
    });
  }

  let nextRegistry = previousRegistry;
  let nextState = plan.previousState;
  let accepted = plan.accepted;
  let changed = !plan.noOp && plan.accepted;

  if (!plan.accepted) {
    pushEvent("SynchronizationRejected");
    pushEvent("SynchronizationFailed");
    nextState = deepFreeze({
      ...plan.previousState,
      status: "Failed" as const,
      updatedAt: now,
      failedCommandCount: plan.errors.length,
      pendingCommandCount: 0,
    });
  } else if (dryRun) {
    nextRegistry = previousRegistry;
    nextState = deepFreeze({
      ...plan.previousState,
      status: "Ready" as const,
      updatedAt: now,
      pendingCommandCount: plan.commands.length,
    });
    changed = false;
    pushEvent("SynchronizationAccepted", {
      payload: deepFreeze({ dryRun: true }),
    });
  } else if (plan.noOp) {
    nextRegistry = previousRegistry;
    nextState = deepFreeze({
      ...plan.previousState,
      status: "Completed" as const,
      updatedAt: now,
      completedAt: now,
      pendingCommandCount: 0,
      completedCommandCount: plan.commands.length,
    });
    changed = false;
    pushEvent("SynchronizationAccepted");
    pushEvent("SynchronizationCompleted");
  } else {
    // Recompute reconciled registry the same way evaluate did for commit.
    const committedPlan = plan;
    // Evaluate already computed projected registry indirectly via bindingDiff;
    // re-bind for authoritative next registry.
    const context = resolveContext(request.context);
    const bindingDeps = bindingDepsFrom(deps);
    const invalidObjectIds = new Set(
      plan.errors.filter((e) => e.objectId).map((e) => e.objectId!),
    );
    const finalCollection = filterCollection(
      request.integrationCollection,
      invalidObjectIds,
    );
    try {
      nextRegistry = bindDirectorSceneCollection(
        finalCollection,
        previousRegistry,
        bindingDeps,
      );
      if (context.removeMissingObjects) {
        const present = new Set(
          finalCollection.packages.map((pkg) => pkg.objectId),
        );
        const pruned: NexoraDirectorSceneBinding[] = [];
        for (const binding of nextRegistry.bindings) {
          if (present.has(binding.objectId) || binding.state === "Removed") {
            pruned.push(binding);
          } else {
            pruned.push(removeDirectorSceneBinding(binding, bindingDeps));
          }
        }
        nextRegistry = deepFreeze({
          registryId: nextRegistry.registryId,
          bindings: Object.freeze(pruned),
        });
      }
    } catch (caught) {
      accepted = false;
      changed = false;
      nextRegistry = previousRegistry;
      const message =
        caught instanceof Error
          ? caught.message
          : "Failed to apply binding reconciliation.";
      pushEvent("SynchronizationFailed", {
        payload: deepFreeze({ message }),
      });
      nextState = deepFreeze({
        ...plan.previousState,
        status: "Failed" as const,
        updatedAt: now,
        failedCommandCount: plan.errors.length + 1,
      });
      return deepFreeze({
        accepted: false,
        changed: false,
        dryRun,
        mode: request.mode,
        previousState: plan.previousState,
        nextState,
        previousRegistry,
        nextRegistry,
        plan: committedPlan,
        commandResults: Object.freeze(commandResults),
        events: Object.freeze(events),
        warnings: plan.warnings,
        errors: Object.freeze([
          ...plan.errors,
          err("DIRECTOR_SYNC_ATOMIC_REJECTED", message, {
            requestId: request.requestId,
          }),
        ]),
      });
    }

    const partial =
      request.mode === "BestEffort" && plan.errors.length > 0;
    nextState = deepFreeze({
      ...committedPlan.projectedState,
      status: partial
        ? ("PartiallyCompleted" as const)
        : ("Completed" as const),
      revision: committedPlan.projectedState.revision,
      pendingCommandCount: 0,
      completedCommandCount: committedPlan.commands.length,
      failedCommandCount: plan.errors.length,
      updatedAt: now,
      completedAt: now,
      bindingCount: nextRegistry.bindings.length,
      packageCount: request.integrationCollection.packages.length,
    });
    pushEvent("SynchronizationAccepted");
    if (partial) {
      pushEvent("SynchronizationPartiallyCompleted");
    } else {
      pushEvent("SynchronizationCompleted");
    }
  }

  return deepFreeze({
    accepted,
    changed,
    dryRun,
    mode: request.mode,
    previousState: plan.previousState,
    nextState,
    previousRegistry,
    nextRegistry,
    plan,
    commandResults: Object.freeze(commandResults),
    events: Object.freeze(events),
    warnings: plan.warnings,
    errors: plan.errors,
  });
}

export function synchronizeNexoraDirectorSceneCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  context: NexoraDirectorSceneSynchronizationContext,
  options?: {
    readonly mode?: "Atomic" | "BestEffort";
    readonly previousIntegrationCollection?: NexoraObjectDirectorIntegrationCollection;
    readonly previousSynchronizationState?: NexoraDirectorSceneSynchronizationState;
    readonly expectedSynchronizationRevision?: number;
    readonly dryRun?: boolean;
    readonly requestId?: string;
  },
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationResult {
  const deps = resolveDeps(dependencies);
  const request: NexoraDirectorSceneSynchronizationRequest = deepFreeze({
    requestId: options?.requestId ?? `dir-sync-req:${deps.createSynchronizationId()}`,
    integrationCollection: collection,
    bindingRegistry: registry,
    previousIntegrationCollection: options?.previousIntegrationCollection,
    previousSynchronizationState: options?.previousSynchronizationState,
    mode: options?.mode ?? "Atomic",
    context,
    expectedSynchronizationRevision: options?.expectedSynchronizationRevision,
    dryRun: options?.dryRun,
  });
  return applyNexoraDirectorSceneSynchronization(request, deps);
}

// ─── Checkpoint / snapshot / record / simulation ────────────────────────────

export function createNexoraDirectorSceneSynchronizationCheckpoint(
  state: NexoraDirectorSceneSynchronizationState,
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationCheckpoint {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    checkpointId: deps.createCheckpointId(),
    synchronizationRevision: state.revision,
    integrationCollection: collection,
    bindingRegistry: registry,
    createdAt: deps.now(),
  });
}

export function restoreNexoraDirectorSceneSynchronizationCheckpoint(
  checkpoint: NexoraDirectorSceneSynchronizationCheckpoint,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationCheckpointRestore {
  const deps = resolveDeps(dependencies);
  const state = createNexoraDirectorSceneSynchronizationState(
    checkpoint.integrationCollection,
    checkpoint.bindingRegistry,
    deepFreeze({
      synchronizationId: deps.createSynchronizationId(),
      collectionId: checkpoint.integrationCollection.collectionId,
      revision: checkpoint.synchronizationRevision,
      status: "Idle" as const,
      packageCount: checkpoint.integrationCollection.packages.length,
      bindingCount: checkpoint.bindingRegistry.bindings.length,
      pendingCommandCount: 0,
      completedCommandCount: 0,
      failedCommandCount: 0,
      updatedAt: checkpoint.createdAt,
    }),
    deps,
  );
  return deepFreeze({
    state: deepFreeze({
      ...state,
      revision: checkpoint.synchronizationRevision,
    }),
    registry: checkpoint.bindingRegistry,
    integrationCollection: checkpoint.integrationCollection,
  });
}

export function simulateNexoraDirectorSceneSynchronizationSequence(
  requests: readonly NexoraDirectorSceneSynchronizationRequest[],
  options?: NexoraDirectorSceneSynchronizationSimulationOptions,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationSimulationResult {
  const deps = resolveDeps(dependencies);
  const stopOnFailure = options?.stopOnFailure ?? true;
  const results: NexoraDirectorSceneSynchronizationResult[] = [];
  const plans: NexoraDirectorSceneSynchronizationPlan[] = [];
  let registry =
    requests[0]?.bindingRegistry ??
    deepFreeze({ registryId: "empty", bindings: Object.freeze([]) });
  let state =
    requests[0]?.previousSynchronizationState ??
    (requests[0]
      ? createNexoraDirectorSceneSynchronizationState(
          requests[0].integrationCollection,
          registry,
          undefined,
          deps,
        )
      : createNexoraDirectorSceneSynchronizationState(
          deepFreeze({
            collectionId: "empty",
            packages: Object.freeze([]),
            sceneOrder: Object.freeze([]),
            attentionSceneObjectIds: Object.freeze([]),
            hiddenSceneObjectIds: Object.freeze([]),
            metadata: deepFreeze({}),
          }),
          registry,
          undefined,
          deps,
        ));
  let firstFailureIndex: number | undefined;
  let previousCollection = requests[0]?.previousIntegrationCollection;

  for (let index = 0; index < requests.length; index += 1) {
    const base = requests[index]!;
    const request = deepFreeze({
      ...base,
      bindingRegistry: registry,
      previousSynchronizationState: state,
      previousIntegrationCollection:
        base.previousIntegrationCollection ?? previousCollection,
    });
    const result = applyNexoraDirectorSceneSynchronization(request, deps);
    results.push(result);
    plans.push(result.plan);
    if (!result.accepted || result.nextState.status === "Failed") {
      if (firstFailureIndex === undefined) firstFailureIndex = index;
      if (stopOnFailure) break;
    }
    if (!result.dryRun && result.accepted) {
      registry = result.nextRegistry;
      state = result.nextState;
      previousCollection = request.integrationCollection;
    }
  }

  return deepFreeze({
    results: Object.freeze(results),
    plans: Object.freeze(plans),
    finalRegistry: registry,
    finalState: state,
    firstFailureIndex,
  });
}

export function createNexoraDirectorSceneSynchronizationRecord(
  result: NexoraDirectorSceneSynchronizationResult,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationRecord {
  const deps = resolveDeps(dependencies);
  const counts = countCommandTypes(result.plan.commands);
  return deepFreeze({
    requestId: result.plan.requestId,
    revisionBefore: result.previousState.revision,
    revisionAfter: result.nextState.revision,
    accepted: result.accepted,
    changed: result.changed,
    mode: result.mode,
    createdCount: counts.createdCount,
    updatedCount: counts.updatedCount,
    reusedCount: counts.reusedCount,
    shownCount: counts.shownCount,
    hiddenCount: counts.hiddenCount,
    detachedCount: counts.detachedCount,
    removedCount: counts.removedCount,
    occurredAt: deps.now(),
    warnings: result.warnings,
    errors: result.errors,
  });
}

export function projectNexoraDirectorSceneSynchronizationHistory(
  records: readonly NexoraDirectorSceneSynchronizationRecord[],
): NexoraDirectorSceneSynchronizationHistoryProjection {
  let totalAccepted = 0;
  let totalRejected = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalReused = 0;
  let totalShown = 0;
  let totalHidden = 0;
  let totalDetached = 0;
  let totalRemoved = 0;
  for (const record of records) {
    if (record.accepted) totalAccepted += 1;
    else totalRejected += 1;
    totalCreated += record.createdCount;
    totalUpdated += record.updatedCount;
    totalReused += record.reusedCount;
    totalShown += record.shownCount;
    totalHidden += record.hiddenCount;
    totalDetached += record.detachedCount;
    totalRemoved += record.removedCount;
  }
  return deepFreeze({
    records: Object.freeze([...records]),
    totalAccepted,
    totalRejected,
    totalCreated,
    totalUpdated,
    totalReused,
    totalShown,
    totalHidden,
    totalDetached,
    totalRemoved,
  });
}

export function createNexoraDirectorSceneSynchronizationSnapshot(
  state: NexoraDirectorSceneSynchronizationState,
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  dependencies?: NexoraDirectorSceneSynchronizationDependencies,
): NexoraDirectorSceneSynchronizationSnapshot {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    state,
    integrationCollection: collection,
    bindingRegistry: registry,
    createdAt: deps.now(),
  });
}

export function compareNexoraDirectorSceneSynchronizationSnapshots(
  left: NexoraDirectorSceneSynchronizationSnapshot,
  right: NexoraDirectorSceneSynchronizationSnapshot,
): NexoraDirectorSceneSynchronizationSnapshotComparison {
  const leftPackages = packagesByObjectId(left.integrationCollection);
  const rightPackages = packagesByObjectId(right.integrationCollection);
  const addedObjectIds: string[] = [];
  const removedObjectIds: string[] = [];
  for (const objectId of rightPackages.keys()) {
    if (!leftPackages.has(objectId)) addedObjectIds.push(objectId);
  }
  for (const objectId of leftPackages.keys()) {
    if (!rightPackages.has(objectId)) removedObjectIds.push(objectId);
  }

  const leftBindings = new Map(
    left.bindingRegistry.bindings.map((b) => [b.bindingId, b]),
  );
  const rightBindings = new Map(
    right.bindingRegistry.bindings.map((b) => [b.bindingId, b]),
  );
  const bindingGenerationChanges: {
    bindingId: string;
    objectId: string;
    from: number;
    to: number;
  }[] = [];
  const bindingLifecycleChanges: {
    bindingId: string;
    objectId: string;
    from: NexoraDirectorSceneBindingState;
    to: NexoraDirectorSceneBindingState;
  }[] = [];

  for (const [bindingId, rightBinding] of rightBindings) {
    const leftBinding = leftBindings.get(bindingId);
    if (!leftBinding) continue;
    if (leftBinding.generation !== rightBinding.generation) {
      bindingGenerationChanges.push({
        bindingId,
        objectId: rightBinding.objectId,
        from: leftBinding.generation,
        to: rightBinding.generation,
      });
    }
    if (leftBinding.state !== rightBinding.state) {
      bindingLifecycleChanges.push({
        bindingId,
        objectId: rightBinding.objectId,
        from: leftBinding.state,
        to: rightBinding.state,
      });
    }
  }

  const staleLeft = findStaleNexoraDirectorSceneBindings(
    left.integrationCollection,
    left.bindingRegistry,
  );
  const staleRight = findStaleNexoraDirectorSceneBindings(
    right.integrationCollection,
    right.bindingRegistry,
  );
  const staleBindingObjectIds = Object.freeze(
    [
      ...new Set([
        ...staleLeft.map((b) => b.objectId),
        ...staleRight.map((b) => b.objectId),
      ]),
    ].sort(),
  );

  return deepFreeze({
    revisionChanged: left.state.revision !== right.state.revision,
    previousRevision: left.state.revision,
    nextRevision: right.state.revision,
    addedObjectIds: Object.freeze(addedObjectIds.sort()),
    removedObjectIds: Object.freeze(removedObjectIds.sort()),
    bindingGenerationChanges: Object.freeze(bindingGenerationChanges),
    bindingLifecycleChanges: Object.freeze(bindingLifecycleChanges),
    sceneOrderChanged:
      JSON.stringify(left.integrationCollection.sceneOrder) !==
      JSON.stringify(right.integrationCollection.sceneOrder),
    staleBindingObjectIds,
    commandCountChanged:
      left.state.pendingCommandCount + left.state.completedCommandCount !==
      right.state.pendingCommandCount + right.state.completedCommandCount,
    previousCommandCount:
      left.state.pendingCommandCount + left.state.completedCommandCount,
    nextCommandCount:
      right.state.pendingCommandCount + right.state.completedCommandCount,
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

function serializeEnvelope(
  kind: string,
  payload: Record<string, unknown>,
): string {
  return JSON.stringify({
    identity: nexoraObjectDirectorSceneSynchronizationEngineIdentity,
    version: nexoraObjectDirectorSceneSynchronizationEngineVersion,
    schemaVersion: nexoraObjectDirectorSceneSynchronizationSchemaVersion,
    kind,
    ...payload,
  });
}

function parseEnvelope(json: string, kind: string): Record<string, unknown> {
  const parsed = JSON.parse(json) as Record<string, unknown>;
  if (
    parsed.schemaVersion !==
    nexoraObjectDirectorSceneSynchronizationSchemaVersion
  ) {
    throwSync(
      err(
        "DIRECTOR_SYNC_UNSUPPORTED_VERSION",
        `Unsupported synchronization schema: ${String(parsed.schemaVersion)}`,
        { details: { kind, schemaVersion: parsed.schemaVersion } },
      ),
    );
  }
  if (parsed.kind !== kind) {
    throwSync(
      err(
        "DIRECTOR_SYNC_INVARIANT_VIOLATION",
        `Unexpected serialized kind: ${String(parsed.kind)}`,
        { details: { expected: kind, actual: parsed.kind } },
      ),
    );
  }
  return parsed;
}

export function serializeNexoraDirectorSceneSynchronizationState(
  state: NexoraDirectorSceneSynchronizationState,
): string {
  assertNexoraDirectorSceneSynchronizationInvariants(state);
  return serializeEnvelope("state", { state });
}

export function deserializeNexoraDirectorSceneSynchronizationState(
  json: string,
): NexoraDirectorSceneSynchronizationState {
  const parsed = parseEnvelope(json, "state");
  const state = deepFreeze(
    parsed.state as NexoraDirectorSceneSynchronizationState,
  );
  assertNexoraDirectorSceneSynchronizationInvariants(state);
  return state;
}

export function serializeNexoraDirectorSceneSynchronizationPlan(
  plan: NexoraDirectorSceneSynchronizationPlan,
): string {
  const validation = validateNexoraDirectorSceneSynchronizationPlan(plan);
  if (!validation.ok) {
    throwSync(validation.errors[0]!);
  }
  return serializeEnvelope("plan", { plan });
}

export function deserializeNexoraDirectorSceneSynchronizationPlan(
  json: string,
): NexoraDirectorSceneSynchronizationPlan {
  const parsed = parseEnvelope(json, "plan");
  const plan = deepFreeze(
    parsed.plan as NexoraDirectorSceneSynchronizationPlan,
  );
  const validation = validateNexoraDirectorSceneSynchronizationPlan(plan);
  if (!validation.ok) {
    throwSync(validation.errors[0]!);
  }
  return plan;
}

export function serializeNexoraDirectorSceneSynchronizationRecord(
  record: NexoraDirectorSceneSynchronizationRecord,
): string {
  return serializeEnvelope("record", { record });
}

export function deserializeNexoraDirectorSceneSynchronizationRecord(
  json: string,
): NexoraDirectorSceneSynchronizationRecord {
  const parsed = parseEnvelope(json, "record");
  return deepFreeze(
    parsed.record as NexoraDirectorSceneSynchronizationRecord,
  );
}

export function serializeNexoraDirectorSceneSynchronizationCheckpoint(
  checkpoint: NexoraDirectorSceneSynchronizationCheckpoint,
): string {
  return serializeEnvelope("checkpoint", { checkpoint });
}

export function deserializeNexoraDirectorSceneSynchronizationCheckpoint(
  json: string,
): NexoraDirectorSceneSynchronizationCheckpoint {
  const parsed = parseEnvelope(json, "checkpoint");
  return deepFreeze(
    parsed.checkpoint as NexoraDirectorSceneSynchronizationCheckpoint,
  );
}

export function serializeNexoraDirectorSceneSynchronizationSnapshot(
  snapshot: NexoraDirectorSceneSynchronizationSnapshot,
): string {
  return serializeEnvelope("snapshot", { snapshot });
}

export function deserializeNexoraDirectorSceneSynchronizationSnapshot(
  json: string,
): NexoraDirectorSceneSynchronizationSnapshot {
  const parsed = parseEnvelope(json, "snapshot");
  return deepFreeze(
    parsed.snapshot as NexoraDirectorSceneSynchronizationSnapshot,
  );
}

export function getNexoraObjectDirectorSceneSynchronizationEngineSummary() {
  return Object.freeze({
    identity: nexoraObjectDirectorSceneSynchronizationEngineIdentity,
    version: nexoraObjectDirectorSceneSynchronizationEngineVersion,
    schemaVersion: nexoraObjectDirectorSceneSynchronizationSchemaVersion,
    upstream: NOL_DIRECTOR_SCENE_SYNCHRONIZATION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noRuntimeMutation: true,
  });
}

export const NexoraObjectDirectorSceneSynchronizationEngine = Object.freeze({
  identity: nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  version: nexoraObjectDirectorSceneSynchronizationEngineVersion,
  schemaVersion: nexoraObjectDirectorSceneSynchronizationSchemaVersion,
  createNexoraDirectorSceneSynchronizationState,
  evaluateNexoraDirectorSceneSynchronization,
  applyNexoraDirectorSceneSynchronization,
  synchronizeNexoraDirectorSceneCollection,
  resolveNexoraDirectorSceneSynchronizationCommandOrder,
  validateNexoraDirectorSceneSynchronizationDependencies,
  detectNexoraDirectorSceneSynchronizationDrift,
  findStaleNexoraDirectorSceneBindings,
  findStaleNexoraDirectorIntegrationPackages,
  createNexoraDirectorSceneSynchronizationRollbackPlan,
  createNexoraDirectorSceneSynchronizationCheckpoint,
  restoreNexoraDirectorSceneSynchronizationCheckpoint,
  simulateNexoraDirectorSceneSynchronizationSequence,
  createNexoraDirectorSceneSynchronizationRecord,
  projectNexoraDirectorSceneSynchronizationHistory,
  createNexoraDirectorSceneSynchronizationSnapshot,
  compareNexoraDirectorSceneSynchronizationSnapshots,
  validateNexoraDirectorSceneSynchronizationRequest,
  validateNexoraDirectorSceneSynchronizationState,
  validateNexoraDirectorSceneSynchronizationCommand,
  validateNexoraDirectorSceneSynchronizationPlan,
  validateNexoraDirectorSceneSynchronizationResult,
  assertNexoraDirectorSceneSynchronizationInvariants,
  serializeNexoraDirectorSceneSynchronizationState,
  deserializeNexoraDirectorSceneSynchronizationState,
  serializeNexoraDirectorSceneSynchronizationPlan,
  deserializeNexoraDirectorSceneSynchronizationPlan,
  serializeNexoraDirectorSceneSynchronizationRecord,
  deserializeNexoraDirectorSceneSynchronizationRecord,
  serializeNexoraDirectorSceneSynchronizationCheckpoint,
  deserializeNexoraDirectorSceneSynchronizationCheckpoint,
  serializeNexoraDirectorSceneSynchronizationSnapshot,
  deserializeNexoraDirectorSceneSynchronizationSnapshot,
  summary: getNexoraObjectDirectorSceneSynchronizationEngineSummary,
});
