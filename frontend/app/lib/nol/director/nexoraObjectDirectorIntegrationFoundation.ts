/**
 * NOL-3:1 — NexoraObject Director Integration Foundation
 *
 * Canonical integration contract between the frozen NOL-2 Material &
 * Representation platform and the Director Layer. Produces Director-consumable
 * semantic packages only — no renderer, React, or layout execution.
 *
 * Upstream: NOL-2:9 NexoraObject Material & Representation Public Index only.
 * Identity: NOL-3:1/NexoraObjectDirectorIntegrationFoundation
 */

import {
  validateNexoraObjectVisualizationProjection,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  type NexoraObjectVisualizationProjection,
} from "../nexoraObjectMaterialRepresentationPublicIndex.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraObjectDirectorIntegrationFoundationIdentity =
  "NOL-3:1/NexoraObjectDirectorIntegrationFoundation" as const;

export const nexoraObjectDirectorIntegrationFoundationVersion =
  "1.0.0" as const;

export const nexoraObjectDirectorIntegrationSchemaVersion = "1.0.0" as const;

export const NOL_DIRECTOR_INTEGRATION_IDENTITY =
  nexoraObjectDirectorIntegrationFoundationIdentity;
export const NOL_DIRECTOR_INTEGRATION_VERSION =
  nexoraObjectDirectorIntegrationFoundationVersion;
export const NOL_DIRECTOR_INTEGRATION_SCHEMA_VERSION =
  nexoraObjectDirectorIntegrationSchemaVersion;

export const NOL_DIRECTOR_INTEGRATION_UPSTREAM = Object.freeze([
  "NOL-2:9/NexoraObjectMaterialRepresentationPublicIndex",
] as const);

// ─── Constants ──────────────────────────────────────────────────────────────

const SCENE_OBJECT_ID_PREFIX = "nexora-scene-object:" as const;
const PICKING_ID_PREFIX = "nexora-pick:" as const;

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

const INSPECTION_SAFE_TARGETS = Object.freeze([
  "Workspace",
  "Advisor",
  "Timeline",
  "System",
] as const);

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

const PROJECTION_SECTIONS = Object.freeze([
  "SceneObject",
  "Hierarchy",
  "Interaction",
  "Picking",
  "Camera",
  "Animation",
  "Relationships",
  "Clustering",
  "Rendering",
  "Metadata",
] as const satisfies readonly NexoraDirectorProjectionSection[]);

const Z_INDEX_DEPTH: Readonly<Record<string, number>> = Object.freeze({
  Background: 0,
  Normal: 1,
  Elevated: 2,
  Overlay: 3,
  Operation: 4,
});

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NexoraDirectorSceneObject {
  readonly sceneObjectId: string;
  readonly objectId: string;
  readonly objectType: string;
  readonly representationState: "Minimum" | "Report" | "Operation";
  readonly renderingLevel:
    | "Hidden"
    | "Minimal"
    | "Normal"
    | "Important"
    | "Focused"
    | "Operation";
  readonly visible: boolean;
  readonly interactive: boolean;
  readonly readOnly: boolean;
  readonly renderingPriority: number;
}

export interface NexoraDirectorHierarchyProjection {
  readonly parentSceneObjectId?: string;
  readonly childSceneObjectIds: readonly string[];
  readonly layer:
    | "Background"
    | "Normal"
    | "Selected"
    | "Focused"
    | "Attention"
    | "Overlay"
    | "Historical";
  readonly order: number;
  readonly depthWeight: number;
  readonly groupId?: string;
}

export interface NexoraDirectorAffordanceProjection {
  readonly type: string;
  readonly visible: boolean;
  readonly enabled: boolean;
  readonly priority: number;
  readonly reasonDisabled?: string;
}

export interface NexoraDirectorInteractionProjection {
  readonly state:
    | "Idle"
    | "Hovered"
    | "Selected"
    | "Focused"
    | "Operating"
    | "Disabled"
    | "Historical";
  readonly selectable: boolean;
  readonly focusable: boolean;
  readonly operable: boolean;
  readonly inspectable: boolean;
  readonly affordances: readonly NexoraDirectorAffordanceProjection[];
}

export interface NexoraDirectorPickingProjection {
  readonly pickingId: string;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly enabled: boolean;
  readonly interactionState: NexoraDirectorInteractionProjection["state"];
  readonly representationState: "Minimum" | "Report" | "Operation";
  readonly layer: NexoraDirectorHierarchyProjection["layer"];
  readonly target:
    | "Object"
    | "Label"
    | "Badge"
    | "Indicator"
    | "RelationshipAnchor";
}

export type NexoraDirectorCameraIntent =
  | "None"
  | "Center"
  | "Follow"
  | "Overview"
  | "Inspection"
  | "Operation"
  | "AttentionPath";

export interface NexoraDirectorCameraProjection {
  readonly intent: NexoraDirectorCameraIntent;
  readonly targetSceneObjectId?: string;
  readonly framing:
    | "None"
    | "Object"
    | "Neighborhood"
    | "Cluster"
    | "AttentionPath"
    | "Stage";
  readonly priority: number;
  readonly preserveUserControl: boolean;
  readonly transitionHint?: string;
}

export interface NexoraDirectorAnimationIntent {
  readonly type:
    | "Appear"
    | "Disappear"
    | "Expand"
    | "Collapse"
    | "Focus"
    | "Attention"
    | "Operation"
    | "Historical"
    | "RelationshipReveal"
    | "BackgroundDim";
  readonly phase: "Before" | "During" | "After";
  readonly intensity: "None" | "Low" | "Medium" | "High";
  readonly durationWeight: number;
  readonly reversible: boolean;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorAnimationProjection {
  readonly intents: readonly NexoraDirectorAnimationIntent[];
  readonly reducedMotion: boolean;
}

export interface NexoraDirectorRelationshipAnchor {
  readonly anchorId: string;
  readonly sceneObjectId: string;
  readonly index: number;
  readonly enabled: boolean;
}

export interface NexoraDirectorRelationshipProjection {
  readonly mode: "Hidden" | "Direct" | "AttentionPath" | "Expanded";
  readonly anchors: readonly NexoraDirectorRelationshipAnchor[];
  readonly attentionPathId?: string;
  readonly emphasizedRelationshipIds: readonly string[];
}

export interface NexoraDirectorClusterProjection {
  readonly clustered: boolean;
  readonly clusterId?: string;
  readonly memberSceneObjectIds: readonly string[];
  readonly representativeSceneObjectId?: string;
  readonly collapsed: boolean;
  readonly reason?:
    | "CapacityOverflow"
    | "LowRelevance"
    | "SharedContext"
    | "HistoricalGroup"
    | "RelationshipGroup";
}

export interface NexoraDirectorRenderingProjection {
  readonly renderingLevel:
    | "Hidden"
    | "Minimal"
    | "Normal"
    | "Important"
    | "Focused"
    | "Operation";
  readonly renderingPriority: number;
  readonly layer: NexoraDirectorHierarchyProjection["layer"];
  readonly dimmed: boolean;
  readonly visible: boolean;
  readonly cacheKey: string;
  readonly geometryKey: string;
  readonly materialKey: string;
  readonly updateStrategy: "Create" | "Update" | "Reuse" | "Hide" | "Remove";
}

export interface NexoraDirectorIntegrationMetadata {
  readonly sourceProjectionIdentity: string;
  readonly sourceProjectionVersion: string;
  readonly integrationIdentity: string;
  readonly integrationVersion: string;
  readonly schemaVersion: string;
  readonly createdAt: string;
  readonly correlationId?: string;
}

export interface NexoraObjectDirectorIntegrationPackage {
  readonly packageId: string;
  readonly packageVersion: string;
  readonly objectId: string;
  readonly sceneObject: NexoraDirectorSceneObject;
  readonly hierarchy: NexoraDirectorHierarchyProjection;
  readonly interaction: NexoraDirectorInteractionProjection;
  readonly picking: NexoraDirectorPickingProjection;
  readonly camera: NexoraDirectorCameraProjection;
  readonly animation: NexoraDirectorAnimationProjection;
  readonly relationships: NexoraDirectorRelationshipProjection;
  readonly clustering: NexoraDirectorClusterProjection;
  readonly rendering: NexoraDirectorRenderingProjection;
  readonly metadata: NexoraDirectorIntegrationMetadata;
}

export interface NexoraObjectDirectorIntegrationContext {
  readonly source:
    | "Director"
    | "Workspace"
    | "Advisor"
    | "Timeline"
    | "Explorer"
    | "System";
  readonly stageMode:
    | "Overview"
    | "Inspection"
    | "Presentation"
    | "Operation"
    | "Replay";
  readonly previousPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly correlationId?: string;
  readonly occurredAt?: string;
  readonly reducedMotion?: boolean;
}

export interface NexoraObjectDirectorIntegrationCollection {
  readonly collectionId: string;
  readonly packages: readonly NexoraObjectDirectorIntegrationPackage[];
  readonly sceneOrder: readonly string[];
  readonly focusedSceneObjectId?: string;
  readonly activeOperationSceneObjectId?: string;
  readonly attentionSceneObjectIds: readonly string[];
  readonly hiddenSceneObjectIds: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export type NexoraDirectorSceneUpdateType =
  | "Create"
  | "Update"
  | "Reuse"
  | "Hide"
  | "Show"
  | "Remove";

export type NexoraDirectorProjectionSection =
  | "SceneObject"
  | "Hierarchy"
  | "Interaction"
  | "Picking"
  | "Camera"
  | "Animation"
  | "Relationships"
  | "Clustering"
  | "Rendering"
  | "Metadata";

export interface NexoraDirectorSceneUpdate {
  readonly sceneObjectId: string;
  readonly objectId: string;
  readonly type: NexoraDirectorSceneUpdateType;
  readonly changedSections: readonly NexoraDirectorProjectionSection[];
  readonly previousPackage?: NexoraObjectDirectorIntegrationPackage;
  readonly nextPackage?: NexoraObjectDirectorIntegrationPackage;
}

export interface NexoraObjectDirectorIntegrationDiff {
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly update: NexoraDirectorSceneUpdate;
  readonly changed: boolean;
}

export interface NexoraObjectDirectorIntegrationBatchRequest {
  readonly items: readonly {
    readonly visualization: NexoraObjectVisualizationProjection;
    readonly context: NexoraObjectDirectorIntegrationContext;
  }[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraObjectDirectorIntegrationBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly packages: readonly NexoraObjectDirectorIntegrationPackage[];
  readonly acceptedObjectIds: readonly string[];
  readonly rejectedObjectIds: readonly string[];
  readonly errors: readonly NexoraObjectDirectorIntegrationError[];
}

export interface NexoraObjectDirectorIntegrationSnapshot {
  readonly snapshotId: string;
  readonly collection: NexoraObjectDirectorIntegrationCollection;
  readonly createdAt: string;
}

export interface NexoraObjectDirectorIntegrationSnapshotComparison {
  readonly leftSnapshotId: string;
  readonly rightSnapshotId: string;
  readonly addedObjectIds: readonly string[];
  readonly removedObjectIds: readonly string[];
  readonly sceneOrderChanged: boolean;
  readonly renderingLevelChangedObjectIds: readonly string[];
  readonly interactionChangedObjectIds: readonly string[];
  readonly attentionChangedObjectIds: readonly string[];
  readonly cameraIntentChangedObjectIds: readonly string[];
  readonly clusterChangedObjectIds: readonly string[];
  readonly updateStrategyChangedObjectIds: readonly string[];
}

export interface NexoraDirectorEventRoute {
  readonly routeId: string;
  readonly sceneObjectId: string;
  readonly objectId: string;
  readonly event:
    | "Hover"
    | "Select"
    | "Focus"
    | "OpenReport"
    | "OpenOperation"
    | "Affordance"
    | "InspectRelationship"
    | "InspectTimeline";
  readonly target: "Runtime" | "Workspace" | "Advisor" | "Timeline" | "System";
  readonly enabled: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export type NexoraObjectDirectorIntegrationWarningCode =
  | "DIRECTOR_CAMERA_HINT_IGNORABLE"
  | "DIRECTOR_REDUCED_MOTION_APPLIED"
  | "DIRECTOR_BACKGROUND_OBJECT_DIMMED"
  | "DIRECTOR_CLUSTER_PROJECTION_APPLIED"
  | "DIRECTOR_PICKING_DISABLED"
  | "DIRECTOR_OPERATION_READ_ONLY"
  | "DIRECTOR_NO_SCENE_UPDATE_REQUIRED";

export interface NexoraObjectDirectorIntegrationWarning {
  readonly code: NexoraObjectDirectorIntegrationWarningCode;
  readonly message: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export type NexoraObjectDirectorIntegrationErrorCode =
  | "DIRECTOR_INTEGRATION_INVALID_VISUALIZATION"
  | "DIRECTOR_INTEGRATION_OBJECT_ID_MISMATCH"
  | "DIRECTOR_INTEGRATION_DUPLICATE_OBJECT_ID"
  | "DIRECTOR_INTEGRATION_DUPLICATE_SCENE_OBJECT_ID"
  | "DIRECTOR_INTEGRATION_INVALID_HIERARCHY"
  | "DIRECTOR_INTEGRATION_INVALID_INTERACTION"
  | "DIRECTOR_INTEGRATION_INVALID_PICKING"
  | "DIRECTOR_INTEGRATION_INVALID_CAMERA_HINT"
  | "DIRECTOR_INTEGRATION_INVALID_ANIMATION_HINT"
  | "DIRECTOR_INTEGRATION_INVALID_RELATIONSHIP"
  | "DIRECTOR_INTEGRATION_INVALID_CLUSTER"
  | "DIRECTOR_INTEGRATION_INVALID_RENDERING_PRIORITY"
  | "DIRECTOR_INTEGRATION_RENDERER_OBJECT_FORBIDDEN"
  | "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION"
  | "DIRECTOR_INTEGRATION_UNSUPPORTED_VERSION";

export interface NexoraObjectDirectorIntegrationError {
  readonly code: NexoraObjectDirectorIntegrationErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectDirectorIntegrationException extends Error {
  readonly code: NexoraObjectDirectorIntegrationErrorCode;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectDirectorIntegrationError) {
    super(error.message);
    this.name = "NexoraObjectDirectorIntegrationException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.sceneObjectId = error.sceneObjectId;
    this.details = error.details;
  }
}

export interface NexoraObjectDirectorIntegrationDependencies {
  readonly now: () => string;
  readonly createPackageId: (
    objectId: string,
    visualizationVersion: string,
  ) => string;
  readonly createCollectionId: (sceneObjectIds: readonly string[]) => string;
  readonly createSnapshotId: () => string;
  readonly createRouteId: (
    sceneObjectId: string,
    event: NexoraDirectorEventRoute["event"],
  ) => string;
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
  code: NexoraObjectDirectorIntegrationErrorCode,
  message: string,
  extras?: Partial<NexoraObjectDirectorIntegrationError>,
): NexoraObjectDirectorIntegrationError {
  return Object.freeze({ code, message, ...extras });
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
  return null;
}

function defaultDeps(): NexoraObjectDirectorIntegrationDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createPackageId: (objectId: string, visualizationVersion: string) => {
      seq += 1;
      return `dir-pkg:${objectId}:${visualizationVersion}:${seq}`;
    },
    createCollectionId: (sceneObjectIds: readonly string[]) => {
      seq += 1;
      return `dir-col:${sceneObjectIds.join("|")}:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-snap:${seq}`;
    },
    createRouteId: (
      sceneObjectId: string,
      event: NexoraDirectorEventRoute["event"],
    ) => {
      seq += 1;
      return `dir-route:${sceneObjectId}:${event}:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationDependencies {
  return dependencies ?? defaultDeps();
}

function isMutationAffordance(type: string): boolean {
  return (MUTATION_AFFORDANCES as readonly string[]).includes(type);
}

function extractObjectIdFromSceneObjectId(
  sceneObjectId: string,
): string | undefined {
  if (!sceneObjectId.startsWith(SCENE_OBJECT_ID_PREFIX)) return undefined;
  const objectId = sceneObjectId.slice(SCENE_OBJECT_ID_PREFIX.length);
  return objectId.length > 0 ? objectId : undefined;
}

function hierarchyLayerOf(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorHierarchyProjection["layer"] {
  return visualization.attention.layer ?? visualization.hierarchy.layer;
}

function hierarchyOrderOf(
  visualization: NexoraObjectVisualizationProjection,
): number {
  const rank = visualization.metadata?.adaptiveRank;
  if (typeof rank === "number" && Number.isFinite(rank) && rank >= 0) {
    return Math.trunc(rank);
  }
  const priority = visualization.rendering.priority;
  return Number.isFinite(priority) ? Math.max(0, Math.trunc(priority)) : 0;
}

function depthWeightOf(
  visualization: NexoraObjectVisualizationProjection,
): number {
  return Z_INDEX_DEPTH[visualization.hierarchy.zIndexBand] ?? 0;
}

function sceneSortLayerOf(
  pkg: NexoraObjectDirectorIntegrationPackage,
): (typeof SCENE_LAYER_ORDER)[number] {
  if (pkg.sceneObject.renderingLevel === "Operation") return "Operation";
  return pkg.hierarchy.layer;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

function sectionPayload(
  pkg: NexoraObjectDirectorIntegrationPackage,
  section: NexoraDirectorProjectionSection,
): unknown {
  switch (section) {
    case "SceneObject":
      return pkg.sceneObject;
    case "Hierarchy":
      return pkg.hierarchy;
    case "Interaction":
      return pkg.interaction;
    case "Picking":
      return pkg.picking;
    case "Camera":
      return pkg.camera;
    case "Animation":
      return pkg.animation;
    case "Relationships":
      return pkg.relationships;
    case "Clustering":
      return pkg.clustering;
    case "Rendering": {
      return {
        renderingLevel: pkg.rendering.renderingLevel,
        renderingPriority: pkg.rendering.renderingPriority,
        layer: pkg.rendering.layer,
        dimmed: pkg.rendering.dimmed,
        visible: pkg.rendering.visible,
        cacheKey: pkg.rendering.cacheKey,
        geometryKey: pkg.rendering.geometryKey,
        materialKey: pkg.rendering.materialKey,
      };
    }
    case "Metadata":
      return pkg.metadata;
    default:
      return null;
  }
}

function recommendUpdateStrategy(
  previous: NexoraObjectDirectorIntegrationPackage | undefined,
  nextVisible: boolean,
  changedSections: readonly NexoraDirectorProjectionSection[],
): NexoraDirectorRenderingProjection["updateStrategy"] {
  if (!previous) return "Create";
  if (previous.sceneObject.visible && !nextVisible) return "Hide";
  if (!previous.sceneObject.visible && nextVisible) return "Update";
  if (changedSections.length === 0) return "Reuse";
  return "Update";
}

function recommendSceneUpdateType(
  previous: NexoraObjectDirectorIntegrationPackage | undefined,
  next: NexoraObjectDirectorIntegrationPackage,
  changedSections: readonly NexoraDirectorProjectionSection[],
): NexoraDirectorSceneUpdateType {
  if (!previous) return "Create";
  if (changedSections.length === 0) return "Reuse";
  if (previous.sceneObject.visible && !next.sceneObject.visible) return "Hide";
  if (!previous.sceneObject.visible && next.sceneObject.visible) return "Show";
  return "Update";
}

function mapCameraIntent(
  visualization: NexoraObjectVisualizationProjection,
): {
  readonly intent: NexoraDirectorCameraIntent;
  readonly framing: NexoraDirectorCameraProjection["framing"];
} {
  const hint = visualization.cameraHints.hint;
  if (visualization.interaction.interactionState === "Operating") {
    return { intent: "Operation", framing: "Object" };
  }
  switch (hint) {
    case "Center":
      return { intent: "Center", framing: "Object" };
    case "Follow":
      return { intent: "Follow", framing: "Neighborhood" };
    case "Overview":
      return { intent: "Overview", framing: "Stage" };
    case "Inspection":
      return { intent: "Inspection", framing: "Object" };
    case "Normal":
    default:
      return { intent: "None", framing: "None" };
  }
}

function mapAnimationIntensity(
  semantic: string,
): NexoraDirectorAnimationIntent["intensity"] {
  if (semantic === "None") return "None";
  if (semantic === "Appear" || semantic === "Disappear") return "Low";
  if (semantic === "Focus" || semantic === "Expand" || semantic === "Collapse") {
    return "Medium";
  }
  if (
    semantic === "Attention" ||
    semantic === "Operation" ||
    semantic === "Historical"
  ) {
    return "High";
  }
  return "Medium";
}

function mapDurationWeight(hintDuration: string | undefined): number {
  switch (hintDuration) {
    case "Instant":
      return 0;
    case "Short":
      return 1;
    case "Medium":
      return 2;
    case "Long":
      return 3;
    default:
      return 1;
  }
}

function buildAffordances(
  visualization: NexoraObjectVisualizationProjection,
): readonly NexoraDirectorAffordanceProjection[] {
  const state = visualization.interaction.interactionState;
  const disableMutation = state === "Disabled" || state === "Historical";
  return Object.freeze(
    visualization.interaction.affordances.map((item) => {
      const type = item.affordance;
      const mutation = isMutationAffordance(type);
      const enabled =
        item.enabled && !(disableMutation && mutation);
      const reasonDisabled = enabled
        ? undefined
        : item.reasonDisabled ??
          (disableMutation && mutation
            ? `${state}_mutation_disabled`
            : "disabled");
      return deepFreeze({
        type,
        visible: item.visible,
        enabled,
        priority: item.priority,
        ...(reasonDisabled ? { reasonDisabled } : {}),
      });
    }),
  );
}

// ─── Scene identity ─────────────────────────────────────────────────────────

export function createNexoraDirectorSceneObjectId(objectId: string): string {
  if (!objectId || typeof objectId !== "string") {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "objectId is required for scene-object identity.",
      ),
    );
  }
  return `${SCENE_OBJECT_ID_PREFIX}${objectId}`;
}

// ─── Sub-projections (canonical package path) ───────────────────────────────

function buildSceneObject(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorSceneObject {
  return deepFreeze({
    sceneObjectId: createNexoraDirectorSceneObjectId(
      visualization.identity.objectId,
    ),
    objectId: visualization.identity.objectId,
    objectType: visualization.identity.objectType,
    representationState: visualization.representation.state,
    renderingLevel: visualization.rendering.level,
    visible: visualization.visibility.visible,
    interactive: visualization.interaction.interactive,
    readOnly: visualization.interaction.readOnly,
    renderingPriority: visualization.rendering.priority,
  });
}

function buildHierarchy(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorHierarchyProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const groupId =
    visualization.hierarchy.clustered && visualization.hierarchy.clusterId
      ? visualization.hierarchy.clusterId
      : undefined;
  return deepFreeze({
    childSceneObjectIds: Object.freeze([sceneObjectId]),
    layer: hierarchyLayerOf(visualization),
    order: hierarchyOrderOf(visualization),
    depthWeight: depthWeightOf(visualization),
    ...(groupId ? { groupId } : {}),
  });
}

function buildInteraction(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorInteractionProjection {
  const state = visualization.interaction.interactionState;
  const historical = state === "Historical";
  const disabled = state === "Disabled";
  return deepFreeze({
    state,
    selectable: !disabled && visualization.interaction.interactive,
    focusable: !disabled && !historical && visualization.interaction.interactive,
    operable:
      !disabled &&
      !historical &&
      visualization.representation.state === "Operation" &&
      visualization.interaction.interactive,
    inspectable: !disabled,
    affordances: buildAffordances(visualization),
  });
}

function buildPicking(
  visualization: NexoraObjectVisualizationProjection,
  interaction: NexoraDirectorInteractionProjection,
  hierarchy: NexoraDirectorHierarchyProjection,
): NexoraDirectorPickingProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const enabled =
    visualization.visibility.visible &&
    interaction.state !== "Disabled";
  return deepFreeze({
    pickingId: `${PICKING_ID_PREFIX}${sceneObjectId}:Object`,
    objectId: visualization.identity.objectId,
    sceneObjectId,
    enabled,
    interactionState: interaction.state,
    representationState: visualization.representation.state,
    layer: hierarchy.layer,
    target: "Object" as const,
  });
}

function buildCamera(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorCameraProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const mapped = mapCameraIntent(visualization);
  const priority = Math.max(
    0,
    Math.min(1, visualization.cameraHints.weight),
  );
  return deepFreeze({
    intent: mapped.intent,
    ...(mapped.intent === "None" ? {} : { targetSceneObjectId: sceneObjectId }),
    framing: mapped.framing,
    priority,
    preserveUserControl: true,
    ...(visualization.material.animationHints.transitionDuration === "Instant"
      ? {}
      : {
          transitionHint: visualization.material.animationHints.easingHint,
        }),
  });
}

function buildAnimation(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
): NexoraDirectorAnimationProjection {
  const semantic = visualization.animation.semantic;
  const intents: NexoraDirectorAnimationIntent[] = [];
  if (semantic !== "None") {
    const type = semantic as NexoraDirectorAnimationIntent["type"];
    intents.push(
      deepFreeze({
        type,
        phase: "During" as const,
        intensity: mapAnimationIntensity(semantic),
        durationWeight: mapDurationWeight(
          visualization.animation.hints.transitionDuration,
        ),
        reversible: type !== "Disappear" && type !== "Historical",
        payload: deepFreeze({
          semantic,
          appear: visualization.animation.hints.appear,
          disappear: visualization.animation.hints.disappear,
          focus: visualization.animation.hints.focus,
          selection: visualization.animation.hints.selection,
          attention: visualization.animation.hints.attention,
        }),
      }),
    );
  }
  if (visualization.attention.dimmed) {
    intents.push(
      deepFreeze({
        type: "BackgroundDim" as const,
        phase: "During" as const,
        intensity: "Low" as const,
        durationWeight: 1,
        reversible: true,
        payload: deepFreeze({ reason: "dimmed" }),
      }),
    );
  }
  if (visualization.relationships.mode !== "Hidden") {
    intents.push(
      deepFreeze({
        type: "RelationshipReveal" as const,
        phase: "During" as const,
        intensity: "Low" as const,
        durationWeight: 1,
        reversible: true,
        payload: deepFreeze({ mode: visualization.relationships.mode }),
      }),
    );
  }
  return deepFreeze({
    intents: Object.freeze(intents),
    reducedMotion: context.reducedMotion === true,
  });
}

function buildRelationships(
  visualization: NexoraObjectVisualizationProjection,
): NexoraDirectorRelationshipProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const mode = visualization.relationships.mode;
  const anchors =
    mode === "Hidden"
      ? Object.freeze([])
      : Object.freeze([
          deepFreeze({
            anchorId: `nexora-rel-anchor:${sceneObjectId}:0`,
            sceneObjectId,
            index: 0,
            enabled: true,
          }),
        ]);
  const attentionPathId =
    mode === "AttentionPath"
      ? `nexora-attention-path:${sceneObjectId}`
      : undefined;
  return deepFreeze({
    mode,
    anchors,
    ...(attentionPathId ? { attentionPathId } : {}),
    emphasizedRelationshipIds: Object.freeze([] as string[]),
  });
}

function buildClustering(
  visualization: NexoraObjectVisualizationProjection,
  interaction: NexoraDirectorInteractionProjection,
): NexoraDirectorClusterProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const clustered = visualization.hierarchy.clustered === true;
  const protectedFromCollapse =
    interaction.state === "Focused" ||
    interaction.state === "Operating" ||
    interaction.state === "Selected" ||
    visualization.rendering.level === "Focused" ||
    visualization.rendering.level === "Operation" ||
    visualization.attention.attentionState === "Critical" ||
    visualization.attention.attentionState === "Immediate";

  if (!clustered) {
    return deepFreeze({
      clustered: false,
      memberSceneObjectIds: Object.freeze([] as string[]),
      collapsed: false,
    });
  }

  const reason: NexoraDirectorClusterProjection["reason"] =
    visualization.attention.dimmed || visualization.visibility.dimmed
      ? "LowRelevance"
      : interaction.state === "Historical"
        ? "HistoricalGroup"
        : visualization.relationships.mode !== "Hidden"
          ? "RelationshipGroup"
          : "SharedContext";

  return deepFreeze({
    clustered: true,
    ...(visualization.hierarchy.clusterId
      ? { clusterId: visualization.hierarchy.clusterId }
      : {}),
    memberSceneObjectIds: Object.freeze([sceneObjectId]),
    representativeSceneObjectId: sceneObjectId,
    collapsed: !protectedFromCollapse,
    reason,
  });
}

function buildRendering(
  visualization: NexoraObjectVisualizationProjection,
  hierarchy: NexoraDirectorHierarchyProjection,
  previous: NexoraObjectDirectorIntegrationPackage | undefined,
  changedSections: readonly NexoraDirectorProjectionSection[],
): NexoraDirectorRenderingProjection {
  const sceneObjectId = createNexoraDirectorSceneObjectId(
    visualization.identity.objectId,
  );
  const visible = visualization.visibility.visible;
  return deepFreeze({
    renderingLevel: visualization.rendering.level,
    renderingPriority: visualization.rendering.priority,
    layer: hierarchy.layer,
    dimmed: visualization.visibility.dimmed || visualization.attention.dimmed,
    visible,
    cacheKey: `nexora-cache:${sceneObjectId}:${visualization.rendering.level}:${visualization.rendering.priority}:${visible ? "v" : "h"}`,
    geometryKey: `nexora-geometry:${visualization.identity.objectId}:${visualization.geometry.shape}:${visualization.geometry.size}:${visualization.geometry.scale}`,
    materialKey: `nexora-material:${visualization.identity.objectId}:${visualization.identity.seedColor}:${visualization.representation.state}`,
    updateStrategy: recommendUpdateStrategy(
      previous,
      visible,
      changedSections,
    ),
  });
}

function buildMetadata(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  deps: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorIntegrationMetadata {
  return deepFreeze({
    sourceProjectionIdentity: visualizationDirectorProjectionEngineIdentity,
    sourceProjectionVersion:
      visualization.identity.projectionVersion ||
      visualizationDirectorProjectionEngineVersion,
    integrationIdentity: nexoraObjectDirectorIntegrationFoundationIdentity,
    integrationVersion: nexoraObjectDirectorIntegrationFoundationVersion,
    schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
    createdAt: context.occurredAt ?? deps.now(),
    ...(context.correlationId
      ? { correlationId: context.correlationId }
      : {}),
  });
}

function buildPackageCore(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  deps: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationPackage {
  const sceneObject = buildSceneObject(visualization);
  const hierarchy = buildHierarchy(visualization);
  const interaction = buildInteraction(visualization);
  const picking = buildPicking(visualization, interaction, hierarchy);
  const camera = buildCamera(visualization);
  const animation = buildAnimation(visualization, context);
  const relationships = buildRelationships(visualization);
  const clustering = buildClustering(visualization, interaction);
  const metadata = buildMetadata(visualization, context, deps);

  const draftWithoutRendering: Omit<
    NexoraObjectDirectorIntegrationPackage,
    "rendering" | "packageId" | "packageVersion"
  > = {
    objectId: visualization.identity.objectId,
    sceneObject,
    hierarchy,
    interaction,
    picking,
    camera,
    animation,
    relationships,
    clustering,
    metadata,
  };

  const previous = context.previousPackage;
  const provisionalChanged: NexoraDirectorProjectionSection[] = [];
  if (previous) {
    for (const section of PROJECTION_SECTIONS) {
      if (section === "Rendering" || section === "Metadata") continue;
      const before = stableStringify(
        sectionPayload(
          {
            ...previous,
            rendering: previous.rendering,
          },
          section,
        ),
      );
      const after = stableStringify(
        sectionPayload(
          {
            packageId: "",
            packageVersion: "",
            ...draftWithoutRendering,
            rendering: previous.rendering,
          },
          section,
        ),
      );
      if (before !== after) provisionalChanged.push(section);
    }
    if (
      previous.sceneObject.visible !== sceneObject.visible ||
      previous.sceneObject.renderingLevel !== sceneObject.renderingLevel ||
      previous.sceneObject.renderingPriority !== sceneObject.renderingPriority
    ) {
      if (!provisionalChanged.includes("SceneObject")) {
        provisionalChanged.push("SceneObject");
      }
    }
  }

  const rendering = buildRendering(
    visualization,
    hierarchy,
    previous,
    Object.freeze(provisionalChanged),
  );

  return deepFreeze({
    packageId: deps.createPackageId(
      visualization.identity.objectId,
      visualization.identity.projectionVersion,
    ),
    packageVersion: nexoraObjectDirectorIntegrationFoundationVersion,
    objectId: visualization.identity.objectId,
    sceneObject,
    hierarchy,
    interaction,
    picking,
    camera,
    animation,
    relationships,
    clustering,
    rendering,
    metadata,
  });
}

// ─── Public projection APIs ─────────────────────────────────────────────────

export function projectNexoraObjectDirectorIntegration(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationPackage {
  const deps = resolveDeps(dependencies);
  const vizErrors = validateNexoraObjectVisualizationProjection(visualization);
  if (vizErrors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_INVALID_VISUALIZATION",
        vizErrors[0]!.message,
        {
          objectId: visualization?.identity?.objectId,
          details: { visualizationErrors: vizErrors },
        },
      ),
    );
  }

  const pkg = buildPackageCore(visualization, context, deps);
  assertNexoraObjectDirectorIntegrationInvariants(pkg);
  return pkg;
}

export function projectNexoraDirectorSceneObject(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorSceneObject {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).sceneObject;
}

export function projectNexoraDirectorHierarchy(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorHierarchyProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).hierarchy;
}

export function projectNexoraDirectorInteraction(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorInteractionProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).interaction;
}

export function projectNexoraDirectorPicking(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorPickingProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).picking;
}

export function projectNexoraDirectorCamera(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorCameraProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).camera;
}

export function projectNexoraDirectorAnimation(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorAnimationProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).animation;
}

export function projectNexoraDirectorRelationships(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorRelationshipProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).relationships;
}

export function projectNexoraDirectorClustering(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorClusterProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).clustering;
}

export function projectNexoraDirectorRendering(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraDirectorRenderingProjection {
  return projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    dependencies,
  ).rendering;
}

export function projectNexoraDirectorEventRoutes(
  visualization: NexoraObjectVisualizationProjection,
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): readonly NexoraDirectorEventRoute[] {
  const deps = resolveDeps(dependencies);
  const pkg = projectNexoraObjectDirectorIntegration(
    visualization,
    context,
    deps,
  );
  const historical = pkg.interaction.state === "Historical";
  const disabled = pkg.interaction.state === "Disabled";
  const routes: NexoraDirectorEventRoute[] = [];

  const pushRoute = (
    event: NexoraDirectorEventRoute["event"],
    target: NexoraDirectorEventRoute["target"],
    enabled: boolean,
    metadata: Readonly<Record<string, unknown>> = {},
  ) => {
    const safeTarget =
      historical && !(INSPECTION_SAFE_TARGETS as readonly string[]).includes(target)
        ? "Timeline"
        : target;
    const finalEnabled =
      enabled &&
      !disabled &&
      !(historical && event !== "InspectRelationship" && event !== "InspectTimeline" && event !== "Select" && event !== "Focus" && event !== "Hover");
    routes.push(
      deepFreeze({
        routeId: deps.createRouteId(pkg.sceneObject.sceneObjectId, event),
        sceneObjectId: pkg.sceneObject.sceneObjectId,
        objectId: pkg.objectId,
        event,
        target: historical ? safeTarget : target,
        enabled: historical
          ? finalEnabled &&
            (INSPECTION_SAFE_TARGETS as readonly string[]).includes(
              historical ? safeTarget : target,
            )
          : finalEnabled,
        metadata: deepFreeze({ ...metadata }),
      }),
    );
  };

  pushRoute("Hover", "Runtime", pkg.interaction.selectable);
  pushRoute("Select", "Runtime", pkg.interaction.selectable);
  pushRoute("Focus", "Runtime", pkg.interaction.focusable);
  pushRoute(
    "OpenReport",
    "Workspace",
    pkg.interaction.inspectable && pkg.sceneObject.representationState !== "Minimum",
  );
  pushRoute(
    "OpenOperation",
    "Runtime",
    pkg.interaction.operable,
  );
  pushRoute(
    "InspectRelationship",
    "Timeline",
    pkg.interaction.inspectable && pkg.relationships.mode !== "Hidden",
  );
  pushRoute(
    "InspectTimeline",
    "Timeline",
    pkg.interaction.inspectable,
  );

  for (const affordance of pkg.interaction.affordances) {
    const target: NexoraDirectorEventRoute["target"] = isMutationAffordance(
      affordance.type,
    )
      ? "Runtime"
      : "Workspace";
    pushRoute("Affordance", target, affordance.enabled && affordance.visible, {
      affordance: affordance.type,
      reasonDisabled: affordance.reasonDisabled,
    });
  }

  return Object.freeze(routes);
}

export function resolveNexoraDirectorSceneOrder(
  packages: readonly NexoraObjectDirectorIntegrationPackage[],
): readonly string[] {
  const ranked = [...packages].sort((left, right) => {
    const leftLayer = SCENE_LAYER_ORDER.indexOf(sceneSortLayerOf(left));
    const rightLayer = SCENE_LAYER_ORDER.indexOf(sceneSortLayerOf(right));
    if (leftLayer !== rightLayer) return leftLayer - rightLayer;
    if (left.sceneObject.renderingPriority !== right.sceneObject.renderingPriority) {
      return (
        right.sceneObject.renderingPriority - left.sceneObject.renderingPriority
      );
    }
    if (left.hierarchy.depthWeight !== right.hierarchy.depthWeight) {
      return right.hierarchy.depthWeight - left.hierarchy.depthWeight;
    }
    return left.sceneObject.sceneObjectId.localeCompare(
      right.sceneObject.sceneObjectId,
    );
  });
  return Object.freeze(
    ranked.map((pkg) => pkg.sceneObject.sceneObjectId),
  );
}

export function projectNexoraObjectDirectorIntegrationCollection(
  visualizations: readonly NexoraObjectVisualizationProjection[],
  context: NexoraObjectDirectorIntegrationContext,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationCollection {
  const deps = resolveDeps(dependencies);
  const seen = new Set<string>();
  const packages: NexoraObjectDirectorIntegrationPackage[] = [];

  for (const visualization of visualizations) {
    const objectId = visualization.identity.objectId;
    if (seen.has(objectId)) {
      throw new NexoraObjectDirectorIntegrationException(
        err(
          "DIRECTOR_INTEGRATION_DUPLICATE_OBJECT_ID",
          `Duplicate objectId in collection: ${objectId}`,
          { objectId },
        ),
      );
    }
    seen.add(objectId);
    packages.push(
      projectNexoraObjectDirectorIntegration(visualization, context, deps),
    );
  }

  const frozenPackages = Object.freeze(packages);
  const sceneOrder = resolveNexoraDirectorSceneOrder(frozenPackages);

  const focusedCandidates = frozenPackages.filter(
    (pkg) =>
      pkg.interaction.state === "Focused" ||
      pkg.sceneObject.renderingLevel === "Focused",
  );
  const operationCandidates = frozenPackages.filter(
    (pkg) =>
      pkg.interaction.state === "Operating" ||
      pkg.sceneObject.renderingLevel === "Operation",
  );

  const pickOne = (
    candidates: readonly NexoraObjectDirectorIntegrationPackage[],
  ): string | undefined => {
    if (candidates.length === 0) return undefined;
    const orderIndex = new Map(sceneOrder.map((id, index) => [id, index]));
    const sorted = [...candidates].sort(
      (a, b) =>
        (orderIndex.get(b.sceneObject.sceneObjectId) ?? 0) -
        (orderIndex.get(a.sceneObject.sceneObjectId) ?? 0),
    );
    return sorted[0]!.sceneObject.sceneObjectId;
  };

  const attentionSceneObjectIds = Object.freeze(
    frozenPackages
      .filter(
        (pkg) =>
          pkg.hierarchy.layer === "Attention" ||
          pkg.camera.intent === "AttentionPath" ||
          pkg.interaction.state === "Focused",
      )
      .map((pkg) => pkg.sceneObject.sceneObjectId)
      .sort(),
  );

  const hiddenSceneObjectIds = Object.freeze(
    frozenPackages
      .filter((pkg) => !pkg.sceneObject.visible)
      .map((pkg) => pkg.sceneObject.sceneObjectId)
      .sort(),
  );

  const collection = deepFreeze({
    collectionId: deps.createCollectionId(sceneOrder),
    packages: frozenPackages,
    sceneOrder,
    focusedSceneObjectId: pickOne(focusedCandidates),
    activeOperationSceneObjectId: pickOne(operationCandidates),
    attentionSceneObjectIds,
    hiddenSceneObjectIds,
    metadata: deepFreeze({
      source: context.source,
      stageMode: context.stageMode,
      packageCount: frozenPackages.length,
    }),
  });

  const errors = validateNexoraObjectDirectorIntegrationCollection(collection);
  if (errors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(errors[0]!);
  }
  return collection;
}

export function projectNexoraObjectDirectorIntegrationBatch(
  request: NexoraObjectDirectorIntegrationBatchRequest,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationBatchResult {
  const deps = resolveDeps(dependencies);
  const seen = new Set<string>();
  const packages: NexoraObjectDirectorIntegrationPackage[] = [];
  const acceptedObjectIds: string[] = [];
  const rejectedObjectIds: string[] = [];
  const errors: NexoraObjectDirectorIntegrationError[] = [];

  for (const item of request.items) {
    const objectId = item.visualization.identity.objectId;
    if (seen.has(objectId)) {
      const duplicate = err(
        "DIRECTOR_INTEGRATION_DUPLICATE_OBJECT_ID",
        `Duplicate objectId in batch: ${objectId}`,
        { objectId },
      );
      errors.push(duplicate);
      rejectedObjectIds.push(objectId);
      if (request.mode === "Atomic") {
        return deepFreeze({
          accepted: false,
          mode: request.mode,
          packages: Object.freeze([]),
          acceptedObjectIds: Object.freeze([]),
          rejectedObjectIds: Object.freeze([...rejectedObjectIds]),
          errors: Object.freeze([...errors]),
        });
      }
      continue;
    }
    seen.add(objectId);

    try {
      const pkg = projectNexoraObjectDirectorIntegration(
        item.visualization,
        item.context,
        deps,
      );
      packages.push(pkg);
      acceptedObjectIds.push(objectId);
    } catch (caught) {
      const integrationError =
        caught instanceof NexoraObjectDirectorIntegrationException
          ? err(caught.code, caught.message, {
              objectId: caught.objectId ?? objectId,
              sceneObjectId: caught.sceneObjectId,
              details: caught.details,
            })
          : err(
              "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
              caught instanceof Error ? caught.message : "Unknown batch error.",
              { objectId },
            );
      errors.push(integrationError);
      rejectedObjectIds.push(objectId);
      if (request.mode === "Atomic") {
        return deepFreeze({
          accepted: false,
          mode: request.mode,
          packages: Object.freeze([]),
          acceptedObjectIds: Object.freeze([]),
          rejectedObjectIds: Object.freeze(
            request.items.map((entry) => entry.visualization.identity.objectId),
          ),
          errors: Object.freeze([...errors]),
        });
      }
    }
  }

  return deepFreeze({
    accepted: errors.length === 0,
    mode: request.mode,
    packages: Object.freeze(packages),
    acceptedObjectIds: Object.freeze(acceptedObjectIds),
    rejectedObjectIds: Object.freeze(rejectedObjectIds),
    errors: Object.freeze(errors),
  });
}

export function calculateNexoraObjectDirectorIntegrationDiff(
  previous: NexoraObjectDirectorIntegrationPackage | null | undefined,
  next: NexoraObjectDirectorIntegrationPackage,
): NexoraObjectDirectorIntegrationDiff {
  if (previous && previous.objectId !== next.objectId) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_OBJECT_ID_MISMATCH",
        "Diff requires matching objectIds.",
        {
          objectId: next.objectId,
          details: {
            previous: previous.objectId,
            next: next.objectId,
          },
        },
      ),
    );
  }

  const changedSections: NexoraDirectorProjectionSection[] = [];
  if (!previous) {
    changedSections.push(...PROJECTION_SECTIONS);
  } else {
    for (const section of PROJECTION_SECTIONS) {
      const before = stableStringify(sectionPayload(previous, section));
      const after = stableStringify(sectionPayload(next, section));
      if (before !== after) changedSections.push(section);
    }
  }

  const type = recommendSceneUpdateType(
    previous ?? undefined,
    next,
    Object.freeze(changedSections),
  );

  return deepFreeze({
    objectId: next.objectId,
    sceneObjectId: next.sceneObject.sceneObjectId,
    changed: changedSections.length > 0,
    update: deepFreeze({
      sceneObjectId: next.sceneObject.sceneObjectId,
      objectId: next.objectId,
      type,
      changedSections: Object.freeze(changedSections),
      previousPackage: previous ?? undefined,
      nextPackage: next,
    }),
  });
}

export function createNexoraObjectDirectorIntegrationSnapshot(
  collection: NexoraObjectDirectorIntegrationCollection,
  dependencies?: NexoraObjectDirectorIntegrationDependencies,
): NexoraObjectDirectorIntegrationSnapshot {
  const deps = resolveDeps(dependencies);
  const errors = validateNexoraObjectDirectorIntegrationCollection(collection);
  if (errors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(errors[0]!);
  }
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    collection,
    createdAt: deps.now(),
  });
}

export function compareNexoraObjectDirectorIntegrationSnapshots(
  left: NexoraObjectDirectorIntegrationSnapshot,
  right: NexoraObjectDirectorIntegrationSnapshot,
): NexoraObjectDirectorIntegrationSnapshotComparison {
  const leftByObject = new Map(
    left.collection.packages.map((pkg) => [pkg.objectId, pkg]),
  );
  const rightByObject = new Map(
    right.collection.packages.map((pkg) => [pkg.objectId, pkg]),
  );

  const addedObjectIds: string[] = [];
  const removedObjectIds: string[] = [];
  const renderingLevelChangedObjectIds: string[] = [];
  const interactionChangedObjectIds: string[] = [];
  const attentionChangedObjectIds: string[] = [];
  const cameraIntentChangedObjectIds: string[] = [];
  const clusterChangedObjectIds: string[] = [];
  const updateStrategyChangedObjectIds: string[] = [];

  for (const objectId of rightByObject.keys()) {
    if (!leftByObject.has(objectId)) addedObjectIds.push(objectId);
  }
  for (const objectId of leftByObject.keys()) {
    if (!rightByObject.has(objectId)) removedObjectIds.push(objectId);
  }

  for (const [objectId, rightPkg] of rightByObject) {
    const leftPkg = leftByObject.get(objectId);
    if (!leftPkg) continue;
    if (
      leftPkg.sceneObject.renderingLevel !== rightPkg.sceneObject.renderingLevel
    ) {
      renderingLevelChangedObjectIds.push(objectId);
    }
    if (stableStringify(leftPkg.interaction) !== stableStringify(rightPkg.interaction)) {
      interactionChangedObjectIds.push(objectId);
    }
    if (
      leftPkg.hierarchy.layer !== rightPkg.hierarchy.layer ||
      leftPkg.camera.intent === "AttentionPath" ||
      rightPkg.camera.intent === "AttentionPath"
    ) {
      if (
        leftPkg.hierarchy.layer !== rightPkg.hierarchy.layer ||
        leftPkg.camera.intent !== rightPkg.camera.intent
      ) {
        attentionChangedObjectIds.push(objectId);
      }
    }
    if (leftPkg.camera.intent !== rightPkg.camera.intent) {
      cameraIntentChangedObjectIds.push(objectId);
    }
    if (stableStringify(leftPkg.clustering) !== stableStringify(rightPkg.clustering)) {
      clusterChangedObjectIds.push(objectId);
    }
    if (leftPkg.rendering.updateStrategy !== rightPkg.rendering.updateStrategy) {
      updateStrategyChangedObjectIds.push(objectId);
    }
  }

  return deepFreeze({
    leftSnapshotId: left.snapshotId,
    rightSnapshotId: right.snapshotId,
    addedObjectIds: Object.freeze(addedObjectIds.sort()),
    removedObjectIds: Object.freeze(removedObjectIds.sort()),
    sceneOrderChanged:
      stableStringify(left.collection.sceneOrder) !==
      stableStringify(right.collection.sceneOrder),
    renderingLevelChangedObjectIds: Object.freeze(
      renderingLevelChangedObjectIds.sort(),
    ),
    interactionChangedObjectIds: Object.freeze(
      interactionChangedObjectIds.sort(),
    ),
    attentionChangedObjectIds: Object.freeze(attentionChangedObjectIds.sort()),
    cameraIntentChangedObjectIds: Object.freeze(
      cameraIntentChangedObjectIds.sort(),
    ),
    clusterChangedObjectIds: Object.freeze(clusterChangedObjectIds.sort()),
    updateStrategyChangedObjectIds: Object.freeze(
      updateStrategyChangedObjectIds.sort(),
    ),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectDirectorIntegrationPackage(
  pkg: NexoraObjectDirectorIntegrationPackage,
): readonly NexoraObjectDirectorIntegrationError[] {
  const errors: NexoraObjectDirectorIntegrationError[] = [];
  const objectId = pkg.objectId;
  const sceneObjectId = pkg.sceneObject?.sceneObjectId;

  if (!pkg.packageId) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "packageId must be non-empty.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (!objectId) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "objectId must be non-empty.",
        { sceneObjectId },
      ),
    );
  }
  if (
    objectId &&
    sceneObjectId !== `${SCENE_OBJECT_ID_PREFIX}${objectId}`
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "sceneObjectId must be deterministic for objectId.",
        { objectId, sceneObjectId },
      ),
    );
  }
  const reversible = extractObjectIdFromSceneObjectId(sceneObjectId ?? "");
  if (reversible !== objectId) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "sceneObjectId must reverse to objectId.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (!Number.isFinite(pkg.sceneObject.renderingPriority)) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_RENDERING_PRIORITY",
        "renderingPriority must be finite.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (
    !Number.isInteger(pkg.hierarchy.order) ||
    pkg.hierarchy.order < 0
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_HIERARCHY",
        "hierarchy.order must be a non-negative integer.",
        { objectId, sceneObjectId },
      ),
    );
  }
  const childIds = pkg.hierarchy.childSceneObjectIds;
  if (new Set(childIds).size !== childIds.length) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_HIERARCHY",
        "childSceneObjectIds must be unique.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (!pkg.sceneObject.visible && pkg.picking.enabled) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_PICKING",
        "Hidden objects cannot expose enabled picking.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (pkg.interaction.state === "Disabled") {
    const mutationEnabled = pkg.interaction.affordances.some(
      (item) => isMutationAffordance(item.type) && item.enabled,
    );
    if (mutationEnabled) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_INTERACTION",
          "Disabled objects must not expose mutation affordances.",
          { objectId, sceneObjectId },
        ),
      );
    }
  }
  if (pkg.interaction.state === "Historical") {
    const mutationEnabled = pkg.interaction.affordances.some(
      (item) => isMutationAffordance(item.type) && item.enabled,
    );
    if (mutationEnabled) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_INTERACTION",
          "Historical objects must expose inspection-safe affordances only.",
          { objectId, sceneObjectId },
        ),
      );
    }
  }
  if (
    pkg.sceneObject.renderingLevel === "Operation" &&
    pkg.sceneObject.representationState !== "Operation"
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Operation rendering requires Operation representation.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (
    pkg.sceneObject.renderingLevel === "Focused" &&
    !pkg.sceneObject.visible
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Focused rendering requires a visible object.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (
    pkg.picking.interactionState !== pkg.interaction.state ||
    pkg.picking.representationState !== pkg.sceneObject.representationState
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_PICKING",
        "Picking metadata must match interaction and representation state.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (
    pkg.camera.targetSceneObjectId &&
    pkg.camera.targetSceneObjectId !== sceneObjectId
  ) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_CAMERA_HINT",
        "Camera target must reference the package scene object.",
        { objectId, sceneObjectId },
      ),
    );
  }
  if (pkg.clustering.clustered) {
    if (
      pkg.clustering.representativeSceneObjectId &&
      !pkg.clustering.memberSceneObjectIds.includes(
        pkg.clustering.representativeSceneObjectId,
      )
    ) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_CLUSTER",
          "Cluster representative must belong to membership.",
          { objectId, sceneObjectId },
        ),
      );
    }
    if (
      pkg.clustering.collapsed &&
      (pkg.interaction.state === "Focused" ||
        pkg.interaction.state === "Operating")
    ) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_CLUSTER",
          "Focused and operating objects must not be hidden in collapsed clusters.",
          { objectId, sceneObjectId },
        ),
      );
    }
  }
  const anchorIds = pkg.relationships.anchors.map((anchor) => anchor.anchorId);
  if (new Set(anchorIds).size !== anchorIds.length) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVALID_RELATIONSHIP",
        "Relationship anchors must have unique IDs.",
        { objectId, sceneObjectId },
      ),
    );
  }
  for (const intent of pkg.animation.intents) {
    if (!isJsonSafe(intent.payload)) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_ANIMATION_HINT",
          "Animation payloads must be JSON-safe.",
          { objectId, sceneObjectId },
        ),
      );
      break;
    }
  }
  const forbidden = containsForbiddenRendererKeys(pkg);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { objectId, sceneObjectId, details: { path: forbidden } },
      ),
    );
  }
  if (!isDeeplyFrozen(pkg)) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Integration package must be deeply immutable.",
        { objectId, sceneObjectId },
      ),
    );
  }
  return Object.freeze(errors);
}

export function validateNexoraObjectDirectorIntegrationCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
): readonly NexoraObjectDirectorIntegrationError[] {
  const errors: NexoraObjectDirectorIntegrationError[] = [];
  const sceneIds = new Set<string>();
  const objectIds = new Set<string>();

  for (const pkg of collection.packages) {
    errors.push(...validateNexoraObjectDirectorIntegrationPackage(pkg));
    if (objectIds.has(pkg.objectId)) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_DUPLICATE_OBJECT_ID",
          `Duplicate objectId in collection: ${pkg.objectId}`,
          { objectId: pkg.objectId },
        ),
      );
    }
    objectIds.add(pkg.objectId);
    if (sceneIds.has(pkg.sceneObject.sceneObjectId)) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_DUPLICATE_SCENE_OBJECT_ID",
          `Duplicate sceneObjectId in collection: ${pkg.sceneObject.sceneObjectId}`,
          {
            objectId: pkg.objectId,
            sceneObjectId: pkg.sceneObject.sceneObjectId,
          },
        ),
      );
    }
    sceneIds.add(pkg.sceneObject.sceneObjectId);
  }

  for (const sceneObjectId of collection.sceneOrder) {
    if (!sceneIds.has(sceneObjectId)) {
      errors.push(
        err(
          "DIRECTOR_INTEGRATION_INVALID_HIERARCHY",
          `sceneOrder references unknown sceneObjectId: ${sceneObjectId}`,
          { sceneObjectId },
        ),
      );
    }
  }

  if (!isDeeplyFrozen(collection)) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Integration collection must be deeply immutable.",
      ),
    );
  }

  const forbidden = containsForbiddenRendererKeys(collection);
  if (forbidden) {
    errors.push(
      err(
        "DIRECTOR_INTEGRATION_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { details: { path: forbidden } },
      ),
    );
  }

  return Object.freeze(errors);
}

export function assertNexoraObjectDirectorIntegrationInvariants(
  pkg: NexoraObjectDirectorIntegrationPackage,
): void {
  const errors = validateNexoraObjectDirectorIntegrationPackage(pkg);
  if (errors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(errors[0]!);
  }
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectDirectorIntegrationPackage(
  pkg: NexoraObjectDirectorIntegrationPackage,
): string {
  assertNexoraObjectDirectorIntegrationInvariants(pkg);
  return JSON.stringify({
    identity: nexoraObjectDirectorIntegrationFoundationIdentity,
    version: nexoraObjectDirectorIntegrationFoundationVersion,
    schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
    package: pkg,
  });
}

export function deserializeNexoraObjectDirectorIntegrationPackage(
  json: string,
): NexoraObjectDirectorIntegrationPackage {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly package?: NexoraObjectDirectorIntegrationPackage;
  };
  if (parsed.schemaVersion !== nexoraObjectDirectorIntegrationSchemaVersion) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_UNSUPPORTED_VERSION",
        `Unsupported director integration schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.package) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Missing director integration package payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.package);
  assertNexoraObjectDirectorIntegrationInvariants(restored);
  return restored;
}

export function serializeNexoraObjectDirectorIntegrationCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
): string {
  const errors = validateNexoraObjectDirectorIntegrationCollection(collection);
  if (errors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(errors[0]!);
  }
  return JSON.stringify({
    identity: nexoraObjectDirectorIntegrationFoundationIdentity,
    version: nexoraObjectDirectorIntegrationFoundationVersion,
    schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
    collection,
  });
}

export function deserializeNexoraObjectDirectorIntegrationCollection(
  json: string,
): NexoraObjectDirectorIntegrationCollection {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly collection?: NexoraObjectDirectorIntegrationCollection;
  };
  if (parsed.schemaVersion !== nexoraObjectDirectorIntegrationSchemaVersion) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_UNSUPPORTED_VERSION",
        `Unsupported director integration schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.collection) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Missing director integration collection payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.collection);
  const errors = validateNexoraObjectDirectorIntegrationCollection(restored);
  if (errors.length > 0) {
    throw new NexoraObjectDirectorIntegrationException(errors[0]!);
  }
  return restored;
}

export function serializeNexoraObjectDirectorIntegrationSnapshot(
  snapshot: NexoraObjectDirectorIntegrationSnapshot,
): string {
  return JSON.stringify({
    identity: nexoraObjectDirectorIntegrationFoundationIdentity,
    version: nexoraObjectDirectorIntegrationFoundationVersion,
    schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
    snapshot,
  });
}

export function deserializeNexoraObjectDirectorIntegrationSnapshot(
  json: string,
): NexoraObjectDirectorIntegrationSnapshot {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly snapshot?: NexoraObjectDirectorIntegrationSnapshot;
  };
  if (parsed.schemaVersion !== nexoraObjectDirectorIntegrationSchemaVersion) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_UNSUPPORTED_VERSION",
        `Unsupported director integration schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.snapshot) {
    throw new NexoraObjectDirectorIntegrationException(
      err(
        "DIRECTOR_INTEGRATION_INVARIANT_VIOLATION",
        "Missing director integration snapshot payload.",
      ),
    );
  }
  return deepFreeze(parsed.snapshot);
}

export function getNexoraObjectDirectorIntegrationFoundationSummary() {
  return Object.freeze({
    identity: nexoraObjectDirectorIntegrationFoundationIdentity,
    version: nexoraObjectDirectorIntegrationFoundationVersion,
    schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
    upstream: NOL_DIRECTOR_INTEGRATION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
  });
}

export const NexoraObjectDirectorIntegrationFoundation = Object.freeze({
  identity: nexoraObjectDirectorIntegrationFoundationIdentity,
  version: nexoraObjectDirectorIntegrationFoundationVersion,
  schemaVersion: nexoraObjectDirectorIntegrationSchemaVersion,
  createNexoraDirectorSceneObjectId,
  projectNexoraObjectDirectorIntegration,
  projectNexoraObjectDirectorIntegrationCollection,
  projectNexoraObjectDirectorIntegrationBatch,
  resolveNexoraDirectorSceneOrder,
  calculateNexoraObjectDirectorIntegrationDiff,
  createNexoraObjectDirectorIntegrationSnapshot,
  compareNexoraObjectDirectorIntegrationSnapshots,
  validateNexoraObjectDirectorIntegrationPackage,
  validateNexoraObjectDirectorIntegrationCollection,
  assertNexoraObjectDirectorIntegrationInvariants,
  serializeNexoraObjectDirectorIntegrationPackage,
  deserializeNexoraObjectDirectorIntegrationPackage,
  summary: getNexoraObjectDirectorIntegrationFoundationSummary,
});
