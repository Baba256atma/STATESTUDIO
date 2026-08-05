/**
 * NOL-2:6 — NexoraObject Visualization & Director Projection Engine
 *
 * Final NOL-2 output: transforms fully-resolved NexoraObject facets into a
 * single renderer-independent visualization package for the Director Layer.
 *
 * Upstream: NOL-2:1 through NOL-2:5 only.
 * Identity: NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine
 */

import {
  materialRepresentationFoundationIdentity,
  materialRepresentationSchemaVersion,
  type NexoraObjectAffordanceDescriptor,
  type NexoraObjectBadgeDescriptor,
  type NexoraObjectGeometryDescriptor,
  type NexoraObjectIndicatorDescriptor,
  type NexoraObjectRepresentation,
  type NexoraObjectRepresentationState,
  type NexoraObjectSeedColor,
  type NexoraObjectTypographyDescriptor,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";
import {
  materialStateResolutionModelIdentity,
  materialStateResolutionSchemaVersion,
  type NexoraObjectAnimationHints,
  type NexoraObjectMaterialState,
} from "./nexoraObjectMaterialStateResolutionModel.ts";
import {
  representationTransitionBehaviorEngineIdentity,
  representationTransitionBehaviorSchemaVersion,
  type NexoraObjectRepresentationBehaviorDescriptor,
  type NexoraObjectRepresentationTransitionState,
} from "./nexoraObjectRepresentationTransitionBehaviorEngine.ts";
import {
  representationContextAdaptiveDensityEngineIdentity,
  representationContextAdaptiveDensitySchemaVersion,
  type NexoraObjectAdaptiveRepresentationRecommendation,
  type NexoraObjectRepresentationClusterHint,
  type NexoraObjectStageDensity,
} from "./nexoraObjectRepresentationContextAdaptiveDensityEngine.ts";
import {
  materialInteractionAttentionEngineIdentity,
  materialInteractionAttentionSchemaVersion,
  type NexoraObjectMaterialAttentionState,
  type NexoraObjectMaterialInteractionResponse,
  type NexoraObjectMaterialInteractionState,
} from "./nexoraObjectMaterialInteractionAttentionEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const visualizationDirectorProjectionEngineIdentity =
  "NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine" as const;

export const visualizationDirectorProjectionEngineVersion = "1.0.0" as const;

export const visualizationDirectorProjectionSchemaVersion = "1.0.0" as const;

export const NOL_VISUALIZATION_IDENTITY =
  visualizationDirectorProjectionEngineIdentity;
export const NOL_VISUALIZATION_VERSION =
  visualizationDirectorProjectionEngineVersion;
export const NOL_VISUALIZATION_SCHEMA_VERSION =
  visualizationDirectorProjectionSchemaVersion;

export const NOL_VISUALIZATION_UPSTREAM = Object.freeze([
  materialRepresentationFoundationIdentity,
  materialStateResolutionModelIdentity,
  representationTransitionBehaviorEngineIdentity,
  representationContextAdaptiveDensityEngineIdentity,
  materialInteractionAttentionEngineIdentity,
] as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraObjectRenderingLevel =
  | "Hidden"
  | "Minimal"
  | "Normal"
  | "Important"
  | "Focused"
  | "Operation";

export type NexoraObjectCameraHint =
  | "Normal"
  | "Center"
  | "Follow"
  | "Overview"
  | "Inspection";

export type NexoraObjectAnimationSemantic =
  | "Appear"
  | "Disappear"
  | "Expand"
  | "Collapse"
  | "Focus"
  | "Attention"
  | "Operation"
  | "Historical"
  | "None";

export type NexoraObjectVisualizationSection =
  | "identity"
  | "representation"
  | "material"
  | "geometry"
  | "labels"
  | "badges"
  | "indicators"
  | "relationships"
  | "interaction"
  | "attention"
  | "hierarchy"
  | "rendering"
  | "picking"
  | "animation"
  | "visibility"
  | "cameraHints"
  | "metadata";

export interface NexoraObjectGeometryProjection {
  readonly shape: NexoraObjectGeometryDescriptor["shape"];
  readonly size: NexoraObjectGeometryDescriptor["size"];
  readonly scale: number;
  readonly depth: NexoraObjectGeometryDescriptor["depth"];
  readonly orientation: NexoraObjectGeometryDescriptor["orientation"];
  readonly anchor: "Center" | "Baseline" | "Surface";
  readonly spacingWeight: number;
  readonly collisionWeight: number;
  /** Coordinates are intentionally omitted — Director assigns layout. */
  readonly coordinatesForbidden: true;
}

export interface NexoraObjectLabelProjection {
  readonly mode: "Hidden" | "Short" | "Full";
  readonly captionVisible: boolean;
  readonly captionPriority: NexoraObjectTypographyDescriptor["captionPriority"];
  readonly captionMaxLines: number;
  readonly source: "AdaptiveDensity" | "Representation";
}

export interface NexoraObjectBadgeProjection {
  readonly badges: readonly NexoraObjectBadgeDescriptor[];
  readonly maximumBadgeCount: number;
}

export interface NexoraObjectIndicatorProjection {
  readonly indicators: NexoraObjectIndicatorDescriptor;
  readonly mode:
    | "StatusOnly"
    | "Essential"
    | "Executive"
    | "Operational";
}

export interface NexoraObjectRelationshipProjection {
  readonly mode: "Hidden" | "Direct" | "AttentionPath" | "Expanded";
  readonly graphTraversalPerformed: false;
}

export interface NexoraObjectInteractionProjection {
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly affordances: readonly NexoraObjectAffordanceDescriptor[];
  readonly interactive: boolean;
  readonly readOnly: boolean;
}

export interface NexoraObjectAttentionProjection {
  readonly attentionState: NexoraObjectMaterialAttentionState;
  readonly emphasis: NexoraObjectMaterialInteractionResponse["emphasis"];
  readonly layer: NexoraObjectMaterialInteractionResponse["layer"];
  readonly glow: NexoraObjectMaterialInteractionResponse["glow"];
  readonly outline: NexoraObjectMaterialInteractionResponse["outline"];
  readonly dimmed: boolean;
  readonly pulse: NexoraObjectMaterialInteractionResponse["pulse"];
  readonly reasons: NexoraObjectMaterialInteractionResponse["reasons"];
}

export interface NexoraObjectHierarchyProjection {
  readonly zIndexBand:
    | "Background"
    | "Normal"
    | "Elevated"
    | "Overlay"
    | "Operation";
  readonly layer: NexoraObjectMaterialInteractionResponse["layer"];
  readonly clustered: boolean;
  readonly clusterId?: string;
}

export interface NexoraObjectRenderingProjection {
  readonly level: NexoraObjectRenderingLevel;
  readonly priority: number;
  readonly priorityBand:
    | "Operation"
    | "Focused"
    | "Critical"
    | "Selected"
    | "Normal"
    | "Background";
  readonly stageDensity: NexoraObjectStageDensity;
}

export interface NexoraObjectPickingMetadata {
  readonly objectId: string;
  readonly objectType: string;
  readonly layer: NexoraObjectMaterialInteractionResponse["layer"];
  readonly interactionState: NexoraObjectMaterialInteractionState;
  readonly representationState: NexoraObjectRepresentationState;
  readonly renderingLevel: NexoraObjectRenderingLevel;
}

export interface NexoraObjectAnimationProjection {
  readonly semantic: NexoraObjectAnimationSemantic;
  readonly hints: NexoraObjectAnimationHints;
  readonly behaviors: readonly NexoraObjectRepresentationBehaviorDescriptor[];
}

export interface NexoraObjectVisibilityProjection {
  readonly visible: boolean;
  readonly opacity: number;
  readonly renderingLevel: NexoraObjectRenderingLevel;
  readonly dimmed: boolean;
}

export interface NexoraObjectCameraHintsProjection {
  readonly hint: NexoraObjectCameraHint;
  readonly weight: number;
  readonly followEligible: boolean;
}

export interface NexoraObjectVisualizationIdentity {
  readonly objectId: string;
  readonly objectType: string;
  readonly representationId: string;
  readonly representationVersion: string;
  readonly seedColor: NexoraObjectSeedColor;
  readonly projectionId: string;
  readonly projectionVersion: string;
}

export interface NexoraObjectVisualizationProjection {
  readonly identity: NexoraObjectVisualizationIdentity;
  readonly representation: {
    readonly state: NexoraObjectRepresentationState;
    readonly density: NexoraObjectRepresentation["density"];
    readonly profile: NexoraObjectRepresentation["profile"];
    readonly recommendedState: NexoraObjectRepresentationState;
    readonly recommendedDensity: NexoraObjectAdaptiveRepresentationRecommendation["recommendedDensity"];
  };
  readonly material: NexoraObjectMaterialState;
  readonly geometry: NexoraObjectGeometryProjection;
  readonly labels: NexoraObjectLabelProjection;
  readonly badges: NexoraObjectBadgeProjection;
  readonly indicators: NexoraObjectIndicatorProjection;
  readonly relationships: NexoraObjectRelationshipProjection;
  readonly interaction: NexoraObjectInteractionProjection;
  readonly attention: NexoraObjectAttentionProjection;
  readonly hierarchy: NexoraObjectHierarchyProjection;
  readonly rendering: NexoraObjectRenderingProjection;
  readonly picking: NexoraObjectPickingMetadata;
  readonly animation: NexoraObjectAnimationProjection;
  readonly visibility: NexoraObjectVisibilityProjection;
  readonly cameraHints: NexoraObjectCameraHintsProjection;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectDirectorPackage {
  readonly packageId: string;
  readonly engineIdentity: typeof visualizationDirectorProjectionEngineIdentity;
  readonly schemaVersion: typeof visualizationDirectorProjectionSchemaVersion;
  readonly createdAt: string;
  readonly projections: readonly NexoraObjectVisualizationProjection[];
}

export interface NexoraObjectVisualizationProjectionInput {
  readonly representation: NexoraObjectRepresentation;
  readonly materialState: NexoraObjectMaterialState;
  readonly transitionState: NexoraObjectRepresentationTransitionState;
  readonly adaptiveRecommendation: NexoraObjectAdaptiveRepresentationRecommendation;
  readonly interactionResponse: NexoraObjectMaterialInteractionResponse;
  readonly behaviors?: readonly NexoraObjectRepresentationBehaviorDescriptor[];
  readonly objectType?: string;
  readonly stageDensity?: NexoraObjectStageDensity;
  readonly clusterHint?: NexoraObjectRepresentationClusterHint;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface NexoraObjectVisualizationProjectionDiff {
  readonly objectId: string;
  readonly changed: boolean;
  readonly changedSections: readonly NexoraObjectVisualizationSection[];
  readonly previousProjectionId?: string;
  readonly nextProjectionId: string;
}

export interface NexoraObjectVisualizationSnapshot {
  readonly snapshotId: string;
  readonly createdAt: string;
  readonly projections: readonly NexoraObjectVisualizationProjection[];
}

export interface NexoraObjectVisualizationBatchRequest {
  readonly inputs: readonly NexoraObjectVisualizationProjectionInput[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraObjectVisualizationBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly projections: readonly NexoraObjectVisualizationProjection[];
  readonly rejectedObjectIds: readonly string[];
  readonly errors: readonly NexoraObjectVisualizationError[];
}

export type NexoraObjectVisualizationErrorCode =
  | "VISUALIZATION_INVALID_INPUT"
  | "VISUALIZATION_OBJECT_ID_MISMATCH"
  | "VISUALIZATION_DUPLICATE_OBJECT_ID"
  | "VISUALIZATION_INVALID_GEOMETRY"
  | "VISUALIZATION_INVALID_PRIORITY"
  | "VISUALIZATION_RENDERER_OBJECT_FORBIDDEN"
  | "VISUALIZATION_INVARIANT_VIOLATION"
  | "VISUALIZATION_UNSUPPORTED_VERSION";

export interface NexoraObjectVisualizationError {
  readonly code: NexoraObjectVisualizationErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectVisualizationDirectorProjectionException extends Error {
  readonly code: NexoraObjectVisualizationErrorCode;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectVisualizationError) {
    super(error.message);
    this.name = "NexoraObjectVisualizationDirectorProjectionException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.details = error.details;
  }
}

export interface NexoraObjectVisualizationDependencies {
  readonly now: () => string;
  readonly createProjectionId: () => string;
  readonly createPackageId: () => string;
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

function err(
  code: NexoraObjectVisualizationErrorCode,
  message: string,
  extras?: Partial<NexoraObjectVisualizationError>,
): NexoraObjectVisualizationError {
  return Object.freeze({ code, message, ...extras });
}

function defaultDependencies(): NexoraObjectVisualizationDependencies {
  let projectionSeq = 0;
  let packageSeq = 0;
  let snapshotSeq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createProjectionId: () => {
      projectionSeq += 1;
      return `viz-proj-${projectionSeq}`;
    },
    createPackageId: () => {
      packageSeq += 1;
      return `viz-pkg-${packageSeq}`;
    },
    createSnapshotId: () => {
      snapshotSeq += 1;
      return `viz-snap-${snapshotSeq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraObjectVisualizationDependencies,
): NexoraObjectVisualizationDependencies {
  return dependencies ?? defaultDependencies();
}

function materialMatchesObjectId(
  materialState: NexoraObjectMaterialState,
  objectId: string,
): boolean {
  return (
    typeof materialState.materialStateId === "string" &&
    materialState.materialStateId.startsWith(`ms:${objectId}:`)
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
      lower.includes("html") ||
      lower.includes("dom") ||
      lower.includes("react") ||
      lower === "geometryref" ||
      lower === "materialref" ||
      lower === "sceneref"
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

function hasCoordinateFields(geometry: NexoraObjectGeometryProjection): boolean {
  const record = geometry as unknown as Record<string, unknown>;
  return (
    "x" in record ||
    "y" in record ||
    "z" in record ||
    "position" in record ||
    "coordinates" in record ||
    "worldPosition" in record
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectVisualizationProjectionInput(
  input: NexoraObjectVisualizationProjectionInput,
): readonly NexoraObjectVisualizationError[] {
  const errors: NexoraObjectVisualizationError[] = [];
  const objectId = input.representation?.objectId;
  if (!objectId) {
    errors.push(
      err("VISUALIZATION_INVALID_INPUT", "representation.objectId is required."),
    );
    return Object.freeze(errors);
  }

  if (
    !materialMatchesObjectId(input.materialState, objectId) ||
    input.transitionState.objectId !== objectId ||
    input.adaptiveRecommendation.objectId !== objectId ||
    input.interactionResponse.objectId !== objectId
  ) {
    errors.push(
      err(
        "VISUALIZATION_OBJECT_ID_MISMATCH",
        "All input facets must share the same objectId.",
        {
          objectId,
          details: {
            materialStateId: input.materialState?.materialStateId,
            transitionObjectId: input.transitionState?.objectId,
            adaptiveObjectId: input.adaptiveRecommendation?.objectId,
            interactionObjectId: input.interactionResponse?.objectId,
          },
        },
      ),
    );
  }

  if (
    input.materialState.seedColor !==
      input.representation.material.color.seed ||
    input.materialState.material.color.seed !==
      input.representation.material.color.seed
  ) {
    errors.push(
      err(
        "VISUALIZATION_INVARIANT_VIOLATION",
        "Seed color must be consistent across representation and material state.",
        { objectId },
      ),
    );
  }

  const forbidden = containsForbiddenRendererKeys(input.metadata ?? {});
  if (forbidden) {
    errors.push(
      err(
        "VISUALIZATION_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific metadata key forbidden: ${forbidden}`,
        { objectId, details: { path: forbidden } },
      ),
    );
  }

  return Object.freeze(errors);
}

export function validateNexoraObjectVisualizationProjection(
  projection: NexoraObjectVisualizationProjection,
): readonly NexoraObjectVisualizationError[] {
  const errors: NexoraObjectVisualizationError[] = [];
  if (!projection.identity?.objectId) {
    errors.push(
      err("VISUALIZATION_INVALID_INPUT", "Projection identity.objectId required."),
    );
  }
  if (!Number.isFinite(projection.rendering.priority)) {
    errors.push(
      err("VISUALIZATION_INVALID_PRIORITY", "Rendering priority must be finite.", {
        objectId: projection.identity?.objectId,
      }),
    );
  }
  if (hasCoordinateFields(projection.geometry)) {
    errors.push(
      err(
        "VISUALIZATION_INVALID_GEOMETRY",
        "Geometry projection must not contain coordinates.",
        { objectId: projection.identity?.objectId },
      ),
    );
  }
  if (projection.geometry.coordinatesForbidden !== true) {
    errors.push(
      err(
        "VISUALIZATION_INVALID_GEOMETRY",
        "Geometry must declare coordinatesForbidden.",
        { objectId: projection.identity?.objectId },
      ),
    );
  }
  if (projection.relationships.graphTraversalPerformed !== false) {
    errors.push(
      err(
        "VISUALIZATION_INVARIANT_VIOLATION",
        "Relationship projection must never traverse graphs.",
        { objectId: projection.identity?.objectId },
      ),
    );
  }
  if (
    projection.labels.mode === "Hidden" &&
    projection.labels.captionVisible &&
    projection.rendering.level !== "Hidden"
  ) {
    // captionVisible may still be true from representation; label mode is authoritative
  }
  if (!Object.isFrozen(projection)) {
    errors.push(
      err(
        "VISUALIZATION_INVARIANT_VIOLATION",
        "Visualization projection must be immutable.",
        { objectId: projection.identity?.objectId },
      ),
    );
  }
  const forbidden = containsForbiddenRendererKeys(projection);
  if (forbidden) {
    errors.push(
      err(
        "VISUALIZATION_RENDERER_OBJECT_FORBIDDEN",
        `Renderer-specific value found at ${forbidden}`,
        { objectId: projection.identity?.objectId },
      ),
    );
  }
  return Object.freeze(errors);
}

export function assertNexoraObjectVisualizationProjectionInvariants(
  projection: NexoraObjectVisualizationProjection,
): void {
  const errors = validateNexoraObjectVisualizationProjection(projection);
  if (errors.length > 0) {
    throw new NexoraObjectVisualizationDirectorProjectionException(errors[0]!);
  }
}

// ─── Sub-projections ────────────────────────────────────────────────────────

export function projectRenderingLevel(
  input: NexoraObjectVisualizationProjectionInput,
): NexoraObjectRenderingLevel {
  if (
    !input.representation.visible ||
    !input.interactionResponse.materialState.visibility
  ) {
    return "Hidden";
  }
  if (input.interactionResponse.interactionState === "Operating") {
    return "Operation";
  }
  if (
    input.representation.state === "Operation" ||
    input.adaptiveRecommendation.recommendedState === "Operation"
  ) {
    return "Operation";
  }
  if (input.interactionResponse.interactionState === "Focused") {
    return "Focused";
  }
  if (
    input.representation.state === "Report" ||
    input.adaptiveRecommendation.recommendedState === "Report"
  ) {
    return "Important";
  }
  if (
    input.interactionResponse.interactionState === "Selected" ||
    input.interactionResponse.attentionState === "Warning" ||
    input.interactionResponse.attentionState === "Critical" ||
    input.interactionResponse.attentionState === "Immediate"
  ) {
    return "Normal";
  }
  if (input.representation.state === "Minimum") {
    return "Minimal";
  }
  return "Normal";
}

export function projectRenderingPriority(
  input: NexoraObjectVisualizationProjectionInput,
): {
  readonly priority: number;
  readonly priorityBand: NexoraObjectRenderingProjection["priorityBand"];
} {
  const interaction = input.interactionResponse.interactionState;
  const attention = input.interactionResponse.attentionState;
  const adaptiveRank = input.adaptiveRecommendation.rank;

  let priorityBand: NexoraObjectRenderingProjection["priorityBand"] =
    "Background";
  let base = 100;

  if (
    interaction === "Operating" ||
    input.representation.state === "Operation" ||
    input.adaptiveRecommendation.recommendedState === "Operation"
  ) {
    priorityBand = "Operation";
    base = 1000;
  } else if (interaction === "Focused") {
    priorityBand = "Focused";
    base = 900;
  } else if (
    attention === "Immediate" ||
    attention === "Critical" ||
    input.representation.material.color.seed === "Red"
  ) {
    priorityBand = "Critical";
    base = 800;
  } else if (interaction === "Selected") {
    priorityBand = "Selected";
    base = 700;
  } else if (
    input.representation.state === "Report" ||
    input.adaptiveRecommendation.recommendedState === "Report" ||
    attention === "Warning" ||
    attention === "Notice"
  ) {
    priorityBand = "Normal";
    base = 500;
  } else {
    priorityBand = "Background";
    base = 100;
  }

  // Lower adaptive rank is higher relevance — boost slightly.
  const priority = base + Math.max(0, 1000 - adaptiveRank);
  return deepFreeze({ priority, priorityBand });
}

export function projectGeometry(
  representation: NexoraObjectRepresentation,
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): NexoraObjectGeometryProjection {
  const geometry = representation.geometry;
  const scaleBoost =
    adaptive.recommendedState === "Operation"
      ? 1.25
      : adaptive.recommendedState === "Report"
        ? 1.1
        : 1;
  return deepFreeze({
    shape: geometry.shape,
    size: geometry.size,
    scale: Number(geometry.scale) * scaleBoost,
    depth: geometry.depth,
    orientation: geometry.orientation,
    anchor: "Center" as const,
    spacingWeight:
      adaptive.recommendedState === "Operation"
        ? 3
        : adaptive.recommendedState === "Report"
          ? 2
          : 1,
    collisionWeight:
      adaptive.recommendedState === "Operation"
        ? 3
        : adaptive.clustered
          ? 0.5
          : 1,
    coordinatesForbidden: true as const,
  });
}

export function projectLabels(
  representation: NexoraObjectRepresentation,
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): NexoraObjectLabelProjection {
  return deepFreeze({
    mode: adaptive.labelMode,
    captionVisible:
      adaptive.labelMode !== "Hidden" && representation.typography.captionVisible,
    captionPriority: representation.typography.captionPriority,
    captionMaxLines: representation.typography.captionMaxLines,
    source: "AdaptiveDensity" as const,
  });
}

export function projectBadges(
  representation: NexoraObjectRepresentation,
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): NexoraObjectBadgeProjection {
  const limited = representation.badges
    .filter((badge) => badge.visible)
    .slice()
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.badgeId.localeCompare(b.badgeId);
    })
    .slice(0, Math.max(0, adaptive.maximumBadgeCount));
  return deepFreeze({
    badges: Object.freeze(limited.map((badge) => deepFreeze({ ...badge }))),
    maximumBadgeCount: adaptive.maximumBadgeCount,
  });
}

export function projectIndicators(
  representation: NexoraObjectRepresentation,
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): NexoraObjectIndicatorProjection {
  return deepFreeze({
    indicators: deepFreeze({ ...representation.indicators }),
    mode: adaptive.indicatorMode,
  });
}

export function projectRelationships(
  adaptive: NexoraObjectAdaptiveRepresentationRecommendation,
): NexoraObjectRelationshipProjection {
  return deepFreeze({
    mode: adaptive.relationshipMode,
    graphTraversalPerformed: false as const,
  });
}

export function projectAnimation(
  input: NexoraObjectVisualizationProjectionInput,
): NexoraObjectAnimationProjection {
  const interaction = input.interactionResponse.interactionState;
  const attention = input.interactionResponse.attentionState;
  const profile = input.representation.profile;
  const transition = input.transitionState;

  let semantic: NexoraObjectAnimationSemantic = "None";
  if (profile === "Historical") semantic = "Historical";
  else if (interaction === "Operating") semantic = "Operation";
  else if (attention === "Immediate" || attention === "Critical")
    semantic = "Attention";
  else if (interaction === "Focused") semantic = "Focus";
  else if (
    transition.currentState !== transition.targetState &&
    transition.phase !== "Idle" &&
    transition.phase !== "Completed"
  ) {
    const expanding =
      (transition.currentState === "Minimum" &&
        (transition.targetState === "Report" ||
          transition.targetState === "Operation")) ||
      (transition.currentState === "Report" &&
        transition.targetState === "Operation");
    semantic = expanding ? "Expand" : "Collapse";
  } else if (!input.representation.visible) semantic = "Disappear";
  else if (input.materialState.animationHints.appear !== "None")
    semantic = "Appear";

  return deepFreeze({
    semantic,
    hints: deepFreeze({ ...input.materialState.animationHints }),
    behaviors: Object.freeze(
      (input.behaviors ?? []).map((behavior) => deepFreeze({ ...behavior })),
    ),
  });
}

export function projectCameraHints(
  input: NexoraObjectVisualizationProjectionInput,
): NexoraObjectCameraHintsProjection {
  const interaction = input.interactionResponse.interactionState;
  const level = projectRenderingLevel(input);

  let hint: NexoraObjectCameraHint = "Normal";
  if (interaction === "Operating" || level === "Operation") hint = "Inspection";
  else if (interaction === "Focused" || level === "Focused") hint = "Center";
  else if (
    input.interactionResponse.attentionState === "Immediate" ||
    input.interactionResponse.attentionState === "Critical"
  ) {
    hint = "Follow";
  } else if (input.stageDensity === "Sparse") {
    hint = "Overview";
  }

  const weight =
    hint === "Inspection"
      ? 1
      : hint === "Center"
        ? 0.85
        : hint === "Follow"
          ? 0.7
          : hint === "Overview"
            ? 0.4
            : 0.2;

  return deepFreeze({
    hint,
    weight,
    followEligible: hint === "Follow" || hint === "Center" || hint === "Inspection",
  });
}

function hierarchyBand(
  layer: NexoraObjectMaterialInteractionResponse["layer"],
  renderingLevel: NexoraObjectRenderingLevel,
): NexoraObjectHierarchyProjection["zIndexBand"] {
  if (renderingLevel === "Operation" || layer === "Overlay") return "Operation";
  if (layer === "Focused" || layer === "Attention") return "Elevated";
  if (layer === "Selected") return "Elevated";
  if (layer === "Historical" || layer === "Background") return "Background";
  return "Normal";
}

// ─── Primary projection ─────────────────────────────────────────────────────

export function projectVisualization(
  input: NexoraObjectVisualizationProjectionInput,
  dependencies?: NexoraObjectVisualizationDependencies,
): NexoraObjectVisualizationProjection {
  const deps = resolveDeps(dependencies);
  const errors = validateNexoraObjectVisualizationProjectionInput(input);
  if (errors.length > 0) {
    throw new NexoraObjectVisualizationDirectorProjectionException(errors[0]!);
  }

  const objectId = input.representation.objectId;
  const objectType = input.objectType ?? "NexoraObject";
  const stageDensity = input.stageDensity ?? "Balanced";
  const renderingLevel = projectRenderingLevel(input);
  const { priority, priorityBand } = projectRenderingPriority(input);
  const geometry = projectGeometry(
    input.representation,
    input.adaptiveRecommendation,
  );
  const labels = projectLabels(
    input.representation,
    input.adaptiveRecommendation,
  );
  const badges = projectBadges(
    input.representation,
    input.adaptiveRecommendation,
  );
  const indicators = projectIndicators(
    input.representation,
    input.adaptiveRecommendation,
  );
  const relationships = projectRelationships(input.adaptiveRecommendation);
  const animation = projectAnimation(input);
  const cameraHints = projectCameraHints(input);

  const dimmed =
    input.interactionResponse.dimmed ||
    input.adaptiveRecommendation.dimmed;
  const material =
    input.interactionResponse.materialState.seedColor ===
    input.representation.material.color.seed
      ? input.interactionResponse.materialState
      : input.materialState;

  const clustered = input.adaptiveRecommendation.clustered === true;
  const clusterId =
    clustered && input.clusterHint?.memberObjectIds.includes(objectId)
      ? input.clusterHint.clusterId
      : undefined;

  const projection: NexoraObjectVisualizationProjection = deepFreeze({
    identity: deepFreeze({
      objectId,
      objectType,
      representationId: input.representation.representationId,
      representationVersion: input.representation.representationVersion,
      seedColor: input.representation.material.color.seed,
      projectionId: deps.createProjectionId(),
      projectionVersion: visualizationDirectorProjectionEngineVersion,
    }),
    representation: deepFreeze({
      state: input.representation.state,
      density: input.representation.density,
      profile: input.representation.profile,
      recommendedState: input.adaptiveRecommendation.recommendedState,
      recommendedDensity: input.adaptiveRecommendation.recommendedDensity,
    }),
    material,
    geometry,
    labels,
    badges,
    indicators,
    relationships,
    interaction: deepFreeze({
      interactionState: input.interactionResponse.interactionState,
      affordances: Object.freeze(
        input.interactionResponse.affordances.map((item) =>
          deepFreeze({ ...item }),
        ),
      ),
      interactive: input.representation.interactive,
      readOnly: input.representation.readOnly,
    }),
    attention: deepFreeze({
      attentionState: input.interactionResponse.attentionState,
      emphasis: input.interactionResponse.emphasis,
      layer: input.interactionResponse.layer,
      glow: input.interactionResponse.glow,
      outline: input.interactionResponse.outline,
      dimmed,
      pulse: deepFreeze({ ...input.interactionResponse.pulse }),
      reasons: Object.freeze([...input.interactionResponse.reasons]),
    }),
    hierarchy: deepFreeze({
      zIndexBand: hierarchyBand(
        input.interactionResponse.layer,
        renderingLevel,
      ),
      layer: input.interactionResponse.layer,
      clustered,
      clusterId,
    }),
    rendering: deepFreeze({
      level: renderingLevel,
      priority,
      priorityBand,
      stageDensity,
    }),
    picking: deepFreeze({
      objectId,
      objectType,
      layer: input.interactionResponse.layer,
      interactionState: input.interactionResponse.interactionState,
      representationState: input.representation.state,
      renderingLevel,
    }),
    animation,
    visibility: deepFreeze({
      visible: renderingLevel !== "Hidden" && input.representation.visible,
      opacity: material.opacity,
      renderingLevel,
      dimmed,
    }),
    cameraHints,
    metadata: deepFreeze({
      ...(input.metadata ?? {}),
      transitionPhase: input.transitionState.phase,
      transitionRevision: input.transitionState.transitionRevision,
      adaptiveRank: input.adaptiveRecommendation.rank,
      relevanceScore: input.adaptiveRecommendation.relevanceScore,
    }),
  });

  assertNexoraObjectVisualizationProjectionInvariants(projection);
  return projection;
}

/** Alias matching the public API name `projectDirectorPackage`. */
export function projectDirectorPackage(
  inputs: readonly NexoraObjectVisualizationProjectionInput[],
  dependencies?: NexoraObjectVisualizationDependencies,
): NexoraObjectDirectorPackage {
  const deps = resolveDeps(dependencies);
  const projections = inputs.map((input) =>
    projectVisualization(input, deps),
  );
  return deepFreeze({
    packageId: deps.createPackageId(),
    engineIdentity: visualizationDirectorProjectionEngineIdentity,
    schemaVersion: visualizationDirectorProjectionSchemaVersion,
    createdAt: deps.now(),
    projections: Object.freeze(projections),
  });
}

export function projectVisualizationCollection(
  batch: NexoraObjectVisualizationBatchRequest,
  dependencies?: NexoraObjectVisualizationDependencies,
): NexoraObjectVisualizationBatchResult {
  const deps = resolveDeps(dependencies);
  const seen = new Set<string>();
  const duplicateErrors: NexoraObjectVisualizationError[] = [];

  for (const input of batch.inputs) {
    const objectId = input.representation?.objectId;
    if (!objectId) continue;
    if (seen.has(objectId)) {
      duplicateErrors.push(
        err(
          "VISUALIZATION_DUPLICATE_OBJECT_ID",
          `Duplicate objectId in batch: ${objectId}`,
          { objectId },
        ),
      );
    }
    seen.add(objectId);
  }

  if (duplicateErrors.length > 0 && batch.mode === "Atomic") {
    return deepFreeze({
      accepted: false,
      mode: "Atomic" as const,
      projections: Object.freeze([]),
      rejectedObjectIds: Object.freeze(
        duplicateErrors
          .map((error) => error.objectId)
          .filter((id): id is string => Boolean(id)),
      ),
      errors: Object.freeze(duplicateErrors),
    });
  }

  const projections: NexoraObjectVisualizationProjection[] = [];
  const rejectedObjectIds: string[] = [];
  const errors: NexoraObjectVisualizationError[] = [...duplicateErrors];

  for (const input of batch.inputs) {
    const objectId = input.representation?.objectId ?? "";
    if (
      duplicateErrors.some((error) => error.objectId === objectId) &&
      batch.mode === "BestEffort"
    ) {
      rejectedObjectIds.push(objectId);
      continue;
    }
    try {
      const inputErrors = validateNexoraObjectVisualizationProjectionInput(input);
      if (inputErrors.length > 0) {
        errors.push(...inputErrors);
        rejectedObjectIds.push(objectId);
        if (batch.mode === "Atomic") {
          return deepFreeze({
            accepted: false,
            mode: "Atomic" as const,
            projections: Object.freeze([]),
            rejectedObjectIds: Object.freeze([objectId]),
            errors: Object.freeze(errors),
          });
        }
        continue;
      }
      projections.push(projectVisualization(input, deps));
    } catch (error) {
      const vizError =
        error instanceof NexoraObjectVisualizationDirectorProjectionException
          ? err(error.code, error.message, {
              objectId: error.objectId,
              details: error.details,
            })
          : err(
              "VISUALIZATION_INVARIANT_VIOLATION",
              error instanceof Error ? error.message : "Unknown projection error.",
              { objectId },
            );
      errors.push(vizError);
      rejectedObjectIds.push(objectId);
      if (batch.mode === "Atomic") {
        return deepFreeze({
          accepted: false,
          mode: "Atomic" as const,
          projections: Object.freeze([]),
          rejectedObjectIds: Object.freeze([objectId]),
          errors: Object.freeze(errors),
        });
      }
    }
  }

  return deepFreeze({
    accepted: rejectedObjectIds.length === 0 && errors.length === 0,
    mode: batch.mode,
    projections: Object.freeze(projections),
    rejectedObjectIds: Object.freeze(rejectedObjectIds),
    errors: Object.freeze(errors),
  });
}

// ─── Diff / snapshot ────────────────────────────────────────────────────────

const SECTION_KEYS: readonly NexoraObjectVisualizationSection[] = Object.freeze([
  "identity",
  "representation",
  "material",
  "geometry",
  "labels",
  "badges",
  "indicators",
  "relationships",
  "interaction",
  "attention",
  "hierarchy",
  "rendering",
  "picking",
  "animation",
  "visibility",
  "cameraHints",
  "metadata",
]);

function sectionPayload(
  projection: NexoraObjectVisualizationProjection,
  section: NexoraObjectVisualizationSection,
): unknown {
  switch (section) {
    case "identity":
      return {
        objectId: projection.identity.objectId,
        objectType: projection.identity.objectType,
        representationId: projection.identity.representationId,
        representationVersion: projection.identity.representationVersion,
        seedColor: projection.identity.seedColor,
        projectionVersion: projection.identity.projectionVersion,
      };
    case "representation":
      return projection.representation;
    case "material":
      return {
        materialStateId: projection.material.materialStateId,
        seedColor: projection.material.seedColor,
        emphasis: projection.material.emphasis,
        layer: projection.material.layer,
        glow: projection.material.glow,
        outline: projection.material.outline,
        opacity: projection.material.opacity,
        cacheKey: projection.material.cacheKey,
      };
    case "geometry":
      return projection.geometry;
    case "labels":
      return projection.labels;
    case "badges":
      return projection.badges;
    case "indicators":
      return projection.indicators;
    case "relationships":
      return projection.relationships;
    case "interaction":
      return projection.interaction;
    case "attention":
      return projection.attention;
    case "hierarchy":
      return projection.hierarchy;
    case "rendering":
      return projection.rendering;
    case "picking":
      return projection.picking;
    case "animation":
      return projection.animation;
    case "visibility":
      return projection.visibility;
    case "cameraHints":
      return projection.cameraHints;
    case "metadata":
      return projection.metadata;
  }
}

export function calculateVisualizationProjectionDiff(
  previous: NexoraObjectVisualizationProjection | null | undefined,
  next: NexoraObjectVisualizationProjection,
): NexoraObjectVisualizationProjectionDiff {
  if (!previous) {
    return deepFreeze({
      objectId: next.identity.objectId,
      changed: true,
      changedSections: Object.freeze([...SECTION_KEYS]),
      nextProjectionId: next.identity.projectionId,
    });
  }

  if (previous.identity.objectId !== next.identity.objectId) {
    throw new NexoraObjectVisualizationDirectorProjectionException(
      err(
        "VISUALIZATION_OBJECT_ID_MISMATCH",
        "Diff requires matching objectIds.",
        {
          details: {
            previous: previous.identity.objectId,
            next: next.identity.objectId,
          },
        },
      ),
    );
  }

  const changedSections: NexoraObjectVisualizationSection[] = [];
  for (const section of SECTION_KEYS) {
    const before = JSON.stringify(sectionPayload(previous, section));
    const after = JSON.stringify(sectionPayload(next, section));
    if (before !== after) changedSections.push(section);
  }

  return deepFreeze({
    objectId: next.identity.objectId,
    changed: changedSections.length > 0,
    changedSections: Object.freeze(changedSections),
    previousProjectionId: previous.identity.projectionId,
    nextProjectionId: next.identity.projectionId,
  });
}

export function createNexoraObjectVisualizationSnapshot(
  projections: readonly NexoraObjectVisualizationProjection[],
  dependencies?: NexoraObjectVisualizationDependencies,
): NexoraObjectVisualizationSnapshot {
  const deps = resolveDeps(dependencies);
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    createdAt: deps.now(),
    projections: Object.freeze(projections.map((item) => deepFreeze(item))),
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeVisualizationProjection(
  projection: NexoraObjectVisualizationProjection,
): string {
  assertNexoraObjectVisualizationProjectionInvariants(projection);
  return JSON.stringify({
    engineIdentity: visualizationDirectorProjectionEngineIdentity,
    engineVersion: visualizationDirectorProjectionEngineVersion,
    schemaVersion: visualizationDirectorProjectionSchemaVersion,
    foundationIdentity: materialRepresentationFoundationIdentity,
    foundationSchemaVersion: materialRepresentationSchemaVersion,
    materialSchemaVersion: materialStateResolutionSchemaVersion,
    transitionIdentity: representationTransitionBehaviorEngineIdentity,
    transitionSchemaVersion: representationTransitionBehaviorSchemaVersion,
    adaptiveIdentity: representationContextAdaptiveDensityEngineIdentity,
    adaptiveSchemaVersion: representationContextAdaptiveDensitySchemaVersion,
    attentionIdentity: materialInteractionAttentionEngineIdentity,
    attentionSchemaVersion: materialInteractionAttentionSchemaVersion,
    projection,
  });
}

export function deserializeVisualizationProjection(
  json: string,
): NexoraObjectVisualizationProjection {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly projection?: NexoraObjectVisualizationProjection;
  };
  if (parsed.schemaVersion !== visualizationDirectorProjectionSchemaVersion) {
    throw new NexoraObjectVisualizationDirectorProjectionException(
      err(
        "VISUALIZATION_UNSUPPORTED_VERSION",
        `Unsupported visualization schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.projection) {
    throw new NexoraObjectVisualizationDirectorProjectionException(
      err(
        "VISUALIZATION_INVALID_INPUT",
        "Missing visualization projection payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.projection);
  assertNexoraObjectVisualizationProjectionInvariants(restored);
  return restored;
}

export function getNexoraObjectVisualizationDirectorProjectionEngineSummary() {
  return Object.freeze({
    identity: visualizationDirectorProjectionEngineIdentity,
    version: visualizationDirectorProjectionEngineVersion,
    schemaVersion: visualizationDirectorProjectionSchemaVersion,
    upstream: NOL_VISUALIZATION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noBusinessMutation: true,
  });
}

export const NexoraObjectVisualizationDirectorProjectionEngine = Object.freeze({
  identity: visualizationDirectorProjectionEngineIdentity,
  version: visualizationDirectorProjectionEngineVersion,
  schemaVersion: visualizationDirectorProjectionSchemaVersion,
  projectVisualization,
  projectVisualizationCollection,
  projectDirectorPackage,
  projectRenderingPriority,
  projectGeometry,
  projectLabels,
  projectBadges,
  projectIndicators,
  projectRelationships,
  projectAnimation,
  projectCameraHints,
  calculateVisualizationProjectionDiff,
  serializeVisualizationProjection,
  deserializeVisualizationProjection,
  summary: getNexoraObjectVisualizationDirectorProjectionEngineSummary,
});
