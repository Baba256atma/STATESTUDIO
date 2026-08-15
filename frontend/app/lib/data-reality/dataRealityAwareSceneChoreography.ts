/**
 * P2:6 — Data-Reality-Aware Interaction & Scene Choreography Integration.
 *
 * Converts canonical P2:5 focus/attention semantics plus existing Stage
 * relationship graph into a render-safe choreography PLAN.
 *
 * Does NOT:
 *   - recompute KPI / executive state / attention / recommended focus
 *   - invent relationships or Advisor reasoning
 *   - expose Three.js Object3D instances
 *   - become a business reasoning layer
 *
 * Chain:
 *   P2:5 Focus & Attention Experience
 *   → P2:6 Scene Choreography (this module)
 *   → Existing NEX-MVP Stage / R3F consumers
 */

import {
  dataRealityAwareFocusAttentionExperienceIdentity,
  dataRealityAwareFocusAttentionExperienceNamespace,
  dataRealityAwareFocusAttentionExperienceVersion,
  type DataRealityAwareFocusAttentionExperienceResult,
  type DataRealityAwareFocusRole,
  type ResolveDataRealityAwareFocusAttentionExperienceInput,
  resolveDataRealityAwareFocusAttentionExperience,
} from "./dataRealityAwareFocusAttentionExperience.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareSceneChoreographyIdentity =
  "P2:6/DataRealityAwareInteractionSceneChoreographyIntegration" as const;

export const dataRealityAwareSceneChoreographyVersion = "2.6.0" as const;

export const dataRealityAwareSceneChoreographyNamespace =
  "nexora.data-reality.interaction-scene-choreography" as const;

export const dataRealityAwareSceneChoreographyPhase =
  "InteractionSceneChoreographyIntegration" as const;

export const dataRealityAwareSceneChoreographyArchitecturalRole =
  "DataRealityAwareSceneChoreographyBoundary" as const;

export interface DataRealityAwareSceneChoreographyIdentity {
  readonly identity: "P2:6/DataRealityAwareInteractionSceneChoreographyIntegration";
  readonly version: "2.6.0";
  readonly namespace: "nexora.data-reality.interaction-scene-choreography";
  readonly phase: "InteractionSceneChoreographyIntegration";
  readonly architecturalRole: "DataRealityAwareSceneChoreographyBoundary";
}

const IDENTITY: DataRealityAwareSceneChoreographyIdentity = Object.freeze({
  identity: dataRealityAwareSceneChoreographyIdentity,
  version: dataRealityAwareSceneChoreographyVersion,
  namespace: dataRealityAwareSceneChoreographyNamespace,
  phase: dataRealityAwareSceneChoreographyPhase,
  architecturalRole: dataRealityAwareSceneChoreographyArchitecturalRole,
});

export function getDataRealityAwareSceneChoreographyIdentity(): DataRealityAwareSceneChoreographyIdentity {
  return IDENTITY;
}

export const DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityAwareSceneChoreographyArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsAdvisorReasoning: false as const,
  inventsRecommendations: false as const,
  inventsRelationships: false as const,
  inventsSeverityScores: false as const,
  recomputesFocusAttention: false as const,
  usesStagePresentationAsTruth: false as const,
  exposesThreeJsObjects: false as const,
  introducesGlobalStore: false as const,
  consumesP25FocusAttentionOnly: true as const,
  immediateFocusAttentionSource:
    dataRealityAwareFocusAttentionExperienceIdentity,
  choreographyCertified: false as const,
});

export const DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
    "P2:5 Focus & Attention Experience",
    "P2:6 Interaction & Scene Choreography",
  ] as const);

// ─── Semantic roles / transition tokens ─────────────────────────────────────

export const DATA_REALITY_AWARE_SCENE_POSITION_ROLES = Object.freeze([
  "native",
  "focus-anchor",
  "related-near",
  "supporting",
  "background",
] as const);

export type DataRealityAwareScenePositionRole =
  (typeof DATA_REALITY_AWARE_SCENE_POSITION_ROLES)[number];

export const DATA_REALITY_AWARE_SCENE_SCALE_ROLES = Object.freeze([
  "native",
  "anchor-emphasis",
  "related-readable",
  "background-reduced",
] as const);

export type DataRealityAwareSceneScaleRole =
  (typeof DATA_REALITY_AWARE_SCENE_SCALE_ROLES)[number];

export const DATA_REALITY_AWARE_SCENE_OPACITY_ROLES = Object.freeze([
  "full",
  "related",
  "background-soft",
  "retain-attention",
] as const);

export type DataRealityAwareSceneOpacityRole =
  (typeof DATA_REALITY_AWARE_SCENE_OPACITY_ROLES)[number];

export const DATA_REALITY_AWARE_SCENE_OBJECT_ROLES = Object.freeze([
  "anchor",
  "related",
  "background",
  "supporting",
] as const);

export type DataRealityAwareSceneObjectRole =
  (typeof DATA_REALITY_AWARE_SCENE_OBJECT_ROLES)[number];

export const DATA_REALITY_AWARE_SCENE_CAMERA_MODES = Object.freeze([
  "overview",
  "focus",
] as const);

export type DataRealityAwareSceneCameraMode =
  (typeof DATA_REALITY_AWARE_SCENE_CAMERA_MODES)[number];

export const DATA_REALITY_AWARE_SCENE_CAMERA_TARGET_ROLES = Object.freeze([
  "stage-origin",
  "focus-anchor",
] as const);

export type DataRealityAwareSceneCameraTargetRole =
  (typeof DATA_REALITY_AWARE_SCENE_CAMERA_TARGET_ROLES)[number];

export const DATA_REALITY_AWARE_SCENE_TRANSITION_KINDS = Object.freeze([
  "focus-engage",
  "focus-clear",
  "focus-change",
  "idle",
] as const);

export type DataRealityAwareSceneTransitionKind =
  (typeof DATA_REALITY_AWARE_SCENE_TRANSITION_KINDS)[number];

export const DATA_REALITY_AWARE_SCENE_DURATION_CLASSES = Object.freeze([
  "immediate",
  "fast",
  "standard",
  "deliberate",
] as const);

export type DataRealityAwareSceneDurationClass =
  (typeof DATA_REALITY_AWARE_SCENE_DURATION_CLASSES)[number];

export const DATA_REALITY_AWARE_SCENE_EASING_CLASSES = Object.freeze([
  "linear",
  "ease-out",
  "ease-in-out",
] as const);

export type DataRealityAwareSceneEasingClass =
  (typeof DATA_REALITY_AWARE_SCENE_EASING_CLASSES)[number];

// ─── Input / graph contracts (canonical descriptors only) ───────────────────

export type DataRealityAwareSceneObjectDescriptor = {
  readonly objectId: string;
};

export type DataRealityAwareSceneRelationshipEdge = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ResolveDataRealityAwareSceneChoreographyInput = {
  readonly focusAttention?: DataRealityAwareFocusAttentionExperienceResult;
  readonly focusAttentionInput?: ResolveDataRealityAwareFocusAttentionExperienceInput;
  readonly stageObjects: readonly DataRealityAwareSceneObjectDescriptor[];
  readonly relationships: readonly DataRealityAwareSceneRelationshipEdge[];
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

// ─── Output contracts ───────────────────────────────────────────────────────

export type DataRealityAwareSceneObjectChoreography = {
  readonly objectId: string;
  readonly role: DataRealityAwareSceneObjectRole;
  readonly focusRole: DataRealityAwareFocusRole | "none";
  readonly isAnchor: boolean;
  readonly isRelated: boolean;
  readonly isBackground: boolean;
  readonly retainAttention: boolean;
  readonly targetPositionRole: DataRealityAwareScenePositionRole;
  readonly targetScaleRole: DataRealityAwareSceneScaleRole;
  readonly targetOpacityRole: DataRealityAwareSceneOpacityRole;
  readonly shouldReveal: boolean;
  readonly shouldDeemphasize: boolean;
  readonly transitionPriority: number;
};

export type DataRealityAwareSceneCameraGuidance = {
  readonly mode: DataRealityAwareSceneCameraMode;
  readonly targetObjectId?: string;
  readonly targetRole: DataRealityAwareSceneCameraTargetRole;
  readonly transitionKind: DataRealityAwareSceneTransitionKind;
};

export type DataRealityAwareSceneConnectionChoreography = {
  readonly connectionId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly involvesAnchor: boolean;
  readonly shouldForeground: boolean;
  readonly shouldDeemphasize: boolean;
};

export type DataRealityAwareSceneAttentionRetention = {
  readonly objectIds: readonly string[];
  readonly reason: "critical-recommended-unresolved";
};

export type DataRealityAwareSceneTransitionGuidance = {
  readonly kind: DataRealityAwareSceneTransitionKind;
  readonly durationClass: DataRealityAwareSceneDurationClass;
  readonly easingClass: DataRealityAwareSceneEasingClass;
};

export type DataRealityAwareSceneResetBehavior = {
  readonly restoreNativeLayout: boolean;
  readonly restoreOverviewCamera: boolean;
  readonly clearDeemphasis: boolean;
  readonly preserveAttentionSignals: boolean;
  readonly clearBusinessTruth: false;
};

export type DataRealityAwareSceneChoreographyProvenance = {
  readonly experienceIdentity: "P2:6/DataRealityAwareInteractionSceneChoreographyIntegration";
  readonly experienceVersion: "2.6.0";
  readonly experienceNamespace: "nexora.data-reality.interaction-scene-choreography";
  readonly experiencePhase: "InteractionSceneChoreographyIntegration";
  readonly experienceCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_PROVENANCE_CHAIN;
  readonly immediateFocusAttentionSource: typeof dataRealityAwareFocusAttentionExperienceIdentity;
  readonly immediateFocusAttentionVersion: typeof dataRealityAwareFocusAttentionExperienceVersion;
  readonly immediateFocusAttentionNamespace: typeof dataRealityAwareFocusAttentionExperienceNamespace;
  readonly focusAttentionExperienceId: string;
  readonly datasetId: string;
};

export type DataRealityAwareSceneChoreographyResult = {
  readonly choreographyId: string;
  readonly identity: DataRealityAwareSceneChoreographyIdentity;
  readonly anchorObjectId?: string;
  readonly objects: readonly DataRealityAwareSceneObjectChoreography[];
  readonly camera: DataRealityAwareSceneCameraGuidance;
  readonly connections: readonly DataRealityAwareSceneConnectionChoreography[];
  readonly attentionRetention: DataRealityAwareSceneAttentionRetention;
  readonly transition: DataRealityAwareSceneTransitionGuidance;
  readonly resetBehavior: DataRealityAwareSceneResetBehavior;
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
  readonly provenance: DataRealityAwareSceneChoreographyProvenance;
  readonly sourceFocusAttention: DataRealityAwareFocusAttentionExperienceResult;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getDataRealityAwareSceneAnchor(
  result: DataRealityAwareSceneChoreographyResult,
): string | undefined {
  return result.anchorObjectId;
}

export function getDataRealityAwareRelatedSceneObjects(
  result: DataRealityAwareSceneChoreographyResult,
): readonly DataRealityAwareSceneObjectChoreography[] {
  return Object.freeze(result.objects.filter((entry) => entry.isRelated));
}

export function getDataRealityAwareRetainedAttentionObjects(
  result: DataRealityAwareSceneChoreographyResult,
): readonly DataRealityAwareSceneObjectChoreography[] {
  return Object.freeze(
    result.objects.filter((entry) => entry.retainAttention),
  );
}

export function getDataRealityAwareSceneCameraGuidance(
  result: DataRealityAwareSceneChoreographyResult,
): DataRealityAwareSceneCameraGuidance {
  return result.camera;
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function resolveFocusAttention(
  input: ResolveDataRealityAwareSceneChoreographyInput,
): DataRealityAwareFocusAttentionExperienceResult {
  if (input.focusAttention) return input.focusAttention;
  if (input.focusAttentionInput) {
    return resolveDataRealityAwareFocusAttentionExperience(
      input.focusAttentionInput,
    );
  }
  throw new Error(
    "resolveDataRealityAwareSceneChoreography requires focusAttention or focusAttentionInput",
  );
}

function relatedIdsFor(
  objectId: string,
  relationships: readonly DataRealityAwareSceneRelationshipEdge[],
): ReadonlySet<string> {
  const related = new Set<string>();
  for (const edge of relationships) {
    if (edge.sourceId === objectId) related.add(edge.targetId);
    if (edge.targetId === objectId) related.add(edge.sourceId);
  }
  return related;
}

function focusRoleForObject(
  focusAttention: DataRealityAwareFocusAttentionExperienceResult,
  objectId: string,
): DataRealityAwareFocusRole | "none" {
  const state = focusAttention.objectStates.find(
    (entry) => entry.objectId === objectId,
  );
  return state?.focusRole ?? "none";
}

function shouldRetainAttention(
  focusAttention: DataRealityAwareFocusAttentionExperienceResult,
  objectId: string,
  isAnchor: boolean,
): boolean {
  if (isAnchor) return false;
  if (
    focusAttention.presentationGuidance.retainAttentionObjectIds.includes(
      objectId,
    )
  ) {
    return true;
  }
  if (focusAttention.criticalObjects.includes(objectId)) return true;
  if (focusAttention.recommendedFocus === objectId) return true;
  if (focusAttention.unresolvedObjects.includes(objectId)) return true;
  return false;
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:6 Scene Choreography API.
 * Produces a deterministic semantic plan for existing Stage consumers.
 */
export function resolveDataRealityAwareSceneChoreography(
  input: ResolveDataRealityAwareSceneChoreographyInput,
): DataRealityAwareSceneChoreographyResult {
  const focusAttention = resolveFocusAttention(input);
  // Anchor comes ONLY from P2:5 primaryFocus — never recomputed here.
  // Require explicit user interaction (selected or runtime focus). A
  // recommended/prioritized-only primaryFocus must NOT auto-center the scene
  // while the manager is still in overview with no selection.
  // Do not require DR-catalog membership: Stage may focus objects absent from
  // the Data Reality object set (e.g. Budget). Explicit user focus still anchors.
  const hasInteractionFocus =
    focusAttention.runtimeFocus !== undefined ||
    focusAttention.selectedFocus !== undefined;
  const anchorObjectId =
    hasInteractionFocus && focusAttention.primaryFocus !== undefined
      ? focusAttention.primaryFocus
      : undefined;

  const related =
    anchorObjectId === undefined
      ? new Set<string>()
      : relatedIdsFor(anchorObjectId, input.relationships);

  const relatedOrdered = Object.freeze(
    input.stageObjects
      .map((entry) => entry.objectId)
      .filter(
        (objectId) =>
          related.has(objectId) && objectId !== anchorObjectId,
      ),
  );

  const objects = Object.freeze(
    input.stageObjects.map((descriptor, index) => {
      const objectId = descriptor.objectId;
      const isAnchor = objectId === anchorObjectId;
      const isRelated =
        !isAnchor &&
        anchorObjectId !== undefined &&
        related.has(objectId);
      const retainAttention = shouldRetainAttention(
        focusAttention,
        objectId,
        isAnchor,
      );
      const isBackground =
        anchorObjectId !== undefined && !isAnchor && !isRelated;
      const role: DataRealityAwareSceneObjectRole =
        anchorObjectId === undefined
          ? "supporting"
          : isAnchor
            ? "anchor"
            : isRelated
              ? "related"
              : retainAttention
                ? "supporting"
                : "background";

      const targetPositionRole: DataRealityAwareScenePositionRole =
        anchorObjectId === undefined
          ? "native"
          : isAnchor
            ? "focus-anchor"
            : isRelated
              ? "related-near"
              : retainAttention
                ? "supporting"
                : "background";

      const targetScaleRole: DataRealityAwareSceneScaleRole =
        anchorObjectId === undefined
          ? "native"
          : isAnchor
            ? "anchor-emphasis"
            : isRelated
              ? "related-readable"
              : "background-reduced";

      const targetOpacityRole: DataRealityAwareSceneOpacityRole =
        anchorObjectId === undefined
          ? "full"
          : isAnchor
            ? "full"
            : isRelated
              ? "related"
              : retainAttention
                ? "retain-attention"
                : "background-soft";

      const relatedIndex = relatedOrdered.indexOf(objectId);
      const transitionPriority = isAnchor
        ? 0
        : isRelated
          ? 1 + Math.max(0, relatedIndex)
          : retainAttention
            ? 100 + index
            : 200 + index;

      return Object.freeze({
        objectId,
        role,
        focusRole: focusRoleForObject(focusAttention, objectId),
        isAnchor,
        isRelated,
        isBackground,
        retainAttention,
        targetPositionRole,
        targetScaleRole,
        targetOpacityRole,
        shouldReveal: isRelated,
        shouldDeemphasize:
          isBackground && !retainAttention,
        transitionPriority,
      });
    }),
  );

  const attentionRetentionObjectIds = Object.freeze(
    objects
      .filter((entry) => entry.retainAttention)
      .map((entry) => entry.objectId),
  );

  const connections = Object.freeze(
    input.relationships.map((edge) => {
      const involvesAnchor =
        anchorObjectId !== undefined &&
        (edge.sourceId === anchorObjectId ||
          edge.targetId === anchorObjectId);
      return Object.freeze({
        connectionId: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        involvesAnchor,
        shouldForeground: involvesAnchor && anchorObjectId !== undefined,
        shouldDeemphasize:
          anchorObjectId !== undefined && !involvesAnchor,
      });
    }),
  );

  const transitionKind: DataRealityAwareSceneTransitionKind =
    anchorObjectId === undefined ? "focus-clear" : "focus-engage";

  const camera: DataRealityAwareSceneCameraGuidance = Object.freeze(
    anchorObjectId === undefined
      ? {
          mode: "overview" as const,
          targetRole: "stage-origin" as const,
          transitionKind: "focus-clear" as const,
        }
      : {
          mode: "focus" as const,
          targetObjectId: anchorObjectId,
          targetRole: "focus-anchor" as const,
          transitionKind: "focus-engage" as const,
        },
  );

  const transition: DataRealityAwareSceneTransitionGuidance = Object.freeze({
    kind: transitionKind,
    durationClass:
      transitionKind === "focus-clear"
        ? ("standard" as const)
        : ("fast" as const),
    easingClass: "ease-out" as const,
  });

  const resetBehavior: DataRealityAwareSceneResetBehavior = Object.freeze({
    restoreNativeLayout: true,
    restoreOverviewCamera: true,
    clearDeemphasis: true,
    preserveAttentionSignals: true,
    clearBusinessTruth: false,
  });

  const presentationState =
    input.presentationState ??
    focusAttention.presentationGuidance.presentationState;
  const workspace =
    input.workspace ?? focusAttention.presentationGuidance.workspace;
  const mode = input.mode ?? focusAttention.presentationGuidance.mode;

  const choreographyId = [
    "scene-choreography",
    normalizeToken(focusAttention.datasetIdentity.datasetId),
    normalizeToken(focusAttention.experienceId),
    normalizeToken(anchorObjectId),
    normalizeToken(presentationState),
    normalizeToken(workspace),
  ].join(":");

  return Object.freeze({
    choreographyId,
    identity: IDENTITY,
    ...(anchorObjectId !== undefined ? { anchorObjectId } : {}),
    objects,
    camera,
    connections,
    attentionRetention: Object.freeze({
      objectIds: attentionRetentionObjectIds,
      reason: "critical-recommended-unresolved" as const,
    }),
    transition,
    resetBehavior,
    ...(presentationState !== undefined ? { presentationState } : {}),
    ...(workspace !== undefined ? { workspace } : {}),
    ...(mode !== undefined ? { mode } : {}),
    provenance: Object.freeze({
      experienceIdentity: dataRealityAwareSceneChoreographyIdentity,
      experienceVersion: dataRealityAwareSceneChoreographyVersion,
      experienceNamespace: dataRealityAwareSceneChoreographyNamespace,
      experiencePhase: dataRealityAwareSceneChoreographyPhase,
      experienceCertified: false,
      chain: DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_PROVENANCE_CHAIN,
      immediateFocusAttentionSource:
        dataRealityAwareFocusAttentionExperienceIdentity,
      immediateFocusAttentionVersion:
        dataRealityAwareFocusAttentionExperienceVersion,
      immediateFocusAttentionNamespace:
        dataRealityAwareFocusAttentionExperienceNamespace,
      focusAttentionExperienceId: focusAttention.experienceId,
      datasetId: focusAttention.datasetIdentity.datasetId,
    }),
    sourceFocusAttention: focusAttention,
  });
}
