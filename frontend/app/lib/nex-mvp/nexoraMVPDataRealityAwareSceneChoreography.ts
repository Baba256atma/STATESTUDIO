/**
 * NEX-MVP consumer of P2:6 Scene Choreography.
 *
 * Maps semantic choreography plans onto existing Stage presentation targets
 * (position / scale / opacity / camera / connections). Meshes and the camera
 * controller continue to interpolate — this module only sets targets.
 *
 * Shell may import this module. Low-level Stage meshes must not resolve P2:6.
 */

import {
  resolveDataRealityAwareSceneChoreography,
  type DataRealityAwareSceneChoreographyResult,
  type DataRealityAwareSceneObjectChoreography,
  type DataRealityAwareSceneObjectDescriptor,
  type DataRealityAwareSceneRelationshipEdge,
} from "@/app/lib/data-reality/dataRealityAwareSceneChoreography";
import type { DataRealityAwareFocusAttentionExperienceResult } from "@/app/lib/data-reality/dataRealityAwareFocusAttentionExperience";
import type {
  NexoraMVPStageCameraPresentation,
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
  NexoraMVPStageObjectRole,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  resolveExecutiveDensityFramingFromSceneEvidence,
} from "@/app/lib/spatial-presentation/executiveDensityAwareFraming";
import {
  resolveExecutiveFocusChoreography,
  type ExecutiveFocusObjectPresentation,
} from "@/app/lib/spatial-presentation/executiveFocusChoreography";
import {
  buildExecutiveTopologyStagePositionMap,
  resolveExecutiveTopologyGuidedStageComposition,
} from "@/app/lib/spatial-presentation/executiveTopologyGuidedStageComposition";
export const nexoraMVPDataRealityAwareSceneChoreographyIdentity =
  "NEX-MVP/P2:6/DataRealityAwareSceneChoreographyConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_AWARE_SCENE_CHOREOGRAPHY_BOUNDARY =
  Object.freeze({
    consumesP25FocusAttention: true as const,
    consumesP26Choreography: true as const,
    consumesSp41TopologyComposition: true as const,
    inventsRelationships: false as const,
    inventsSeverityScores: false as const,
    recomputesFocusAttention: false as const,
    exposesThreeJsObjects: false as const,
    introducesGlobalStore: false as const,
    singleAuthoritativeCameraPath: true as const,
  });

export type ResolveNexoraMVPDataRealityAwareSceneChoreographyInput = {
  readonly focusAttention: DataRealityAwareFocusAttentionExperienceResult;
  readonly stageObjects: readonly DataRealityAwareSceneObjectDescriptor[];
  readonly relationships: readonly DataRealityAwareSceneRelationshipEdge[];
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

export type NexoraMVPDataRealityAwareSceneChoreographyResult = {
  readonly choreography: DataRealityAwareSceneChoreographyResult;
};

/**
 * Resolve P2:6 from pre-resolved P2:5 focus/attention + Stage graph.
 */
export function resolveNexoraMVPDataRealityAwareSceneChoreography(
  input: ResolveNexoraMVPDataRealityAwareSceneChoreographyInput,
): NexoraMVPDataRealityAwareSceneChoreographyResult {
  const choreography = resolveDataRealityAwareSceneChoreography({
    focusAttention: input.focusAttention,
    stageObjects: input.stageObjects,
    relationships: input.relationships,
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.workspace !== undefined ? { workspace: input.workspace } : {}),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
  });
  return Object.freeze({ choreography });
}

function stageRoleFor(
  entry: DataRealityAwareSceneObjectChoreography,
  hasAnchor: boolean,
  spatialRole: ExecutiveFocusObjectPresentation["role"] | undefined,
): NexoraMVPStageObjectRole {
  if (!hasAnchor) return "normal";
  if (entry.isAnchor || spatialRole === "focus") return "focused";
  // Overflow 1-hop related may be spatially background — keep semantic related
  // only when SP:1.5 assigns the related slot.
  if (entry.isRelated && spatialRole === "related") return "related";
  return "unrelated";
}

function applyObjectChoreography(
  object: NexoraMVPStageObjectPresentation,
  entry: DataRealityAwareSceneObjectChoreography,
  hasAnchor: boolean,
  spatial: ExecutiveFocusObjectPresentation | undefined,
  topologyById: ReadonlyMap<string, readonly [number, number, number]>,
): NexoraMVPStageObjectPresentation {
  // SP:4.1B — choreography must not resurrect disclosure-hidden subjects.
  if (object.disclosureState === "hidden") {
    return Object.freeze({
      ...object,
      role: "unrelated" as const,
      opacity: 0,
      emissiveIntensity: 0,
      labelProminence: "minimal" as const,
      interactive: false,
      labelVisible: false,
      focused: false,
      selected: false,
    });
  }

  if (!hasAnchor) {
    // Reset toward native overview targets; preserve attention signals.
    return Object.freeze({
      ...object,
      role: "normal" as const,
      targetPosition: object.overviewPosition,
      scale: Math.max(object.scale, 1),
      opacity: Math.max(object.opacity, 0.85),
      emissiveIntensity: Math.max(object.emissiveIntensity, 0.06),
      labelProminence: "full" as const,
      focused: false,
      selected: object.selected,
    });
  }

  const role =
    object.disclosureState === "background-discoverable"
      ? ("unrelated" as const)
      : stageRoleFor(entry, hasAnchor, spatial?.role);

  // SP:4.1C — preserve calibrated geometry when visual grammar already authored it.
  // Opacity/emissive attention cues may still refine; positions/scales stay grammar-owned.
  if (object.visualGrammarRole != null) {
    let opacity =
      role === "unrelated" ? 0.28 : role === "related" ? 0.92 : 1;
    let emissiveIntensity =
      role === "focused" ? 0.45 : role === "unrelated" ? 0.02 : 0.12;
    let labelProminence: NexoraMVPStageObjectPresentation["labelProminence"] =
      object.labelProminence;
    if (entry.retainAttention && role === "unrelated") {
      opacity = Math.max(opacity, 0.58);
      emissiveIntensity = Math.max(emissiveIntensity, 0.18);
      if (labelProminence === "minimal") labelProminence = "reduced";
    }
    if (object.disclosureState === "background-discoverable") {
      opacity = Math.min(Math.max(opacity, 0.34), 0.48);
      labelProminence = "minimal";
    }
    return Object.freeze({
      ...object,
      role,
      opacity,
      emissiveIntensity,
      labelProminence,
      focused: entry.isAnchor && object.disclosureState === "visible-primary",
      selected: entry.isAnchor || object.selected,
    });
  }

  const targetPosition =
    topologyById.get(object.id) ?? object.overviewPosition;

  let scale =
    role === "focused"
      ? 1.28
      : role === "related"
        ? 1.05
        : role === "unrelated"
          ? 0.78
          : 1;
  let opacity =
    role === "unrelated" ? 0.28 : role === "related" ? 0.92 : 1;
  let emissiveIntensity =
    role === "focused" ? 0.45 : role === "unrelated" ? 0.02 : 0.12;
  let labelProminence: NexoraMVPStageObjectPresentation["labelProminence"] =
    role === "focused" || role === "normal"
      ? "full"
      : role === "related"
        ? "reduced"
        : "minimal";

  // Attention retention: never mute critical/recommended/unresolved.
  if (entry.retainAttention && role === "unrelated") {
    opacity = Math.max(opacity, 0.58);
    emissiveIntensity = Math.max(emissiveIntensity, 0.18);
    if (labelProminence === "minimal") labelProminence = "reduced";
    scale = Math.max(scale, 0.88);
  }

  if (object.disclosureState === "background-discoverable") {
    opacity = Math.min(Math.max(opacity, 0.34), 0.48);
    labelProminence = "minimal";
  }

  return Object.freeze({
    ...object,
    role,
    targetPosition,
    scale,
    opacity,
    emissiveIntensity,
    labelProminence,
    focused: entry.isAnchor && object.disclosureState === "visible-primary",
    selected: entry.isAnchor || object.selected,
  });
}

/**
 * Apply P2:6 choreography plan onto Stage interaction presentation.
 * Sets semantic targets only — existing R3F useFrame paths interpolate.
 */
export function applyDataRealityAwareSceneChoreographyToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  choreography: DataRealityAwareSceneChoreographyResult,
): NexoraMVPStageInteractionPresentation {
  const byId = new Map(
    choreography.objects.map((entry) => [entry.objectId, entry]),
  );
  const relatedOrdered = Object.freeze(
    choreography.objects
      .filter((entry) => entry.isRelated)
      .sort((a, b) => a.transitionPriority - b.transitionPriority)
      .map((entry) => entry.objectId),
  );
  // STAGE-2D:6V-FIX — Direct user click > automatic DR attention.
  // Never clear an explicit Stage focus when choreography anchor is absent,
  // and never let recommended Capacity replace an explicit Budget click.
  const automatic = choreography.anchorObjectId ?? null;
  const explicit =
    presentation.scene.focusedObjectId != null &&
    presentation.scene.focusedObjectId.length > 0
      ? presentation.scene.focusedObjectId
      : null;
  const selected =
    presentation.scene.selectedObjectId != null &&
    presentation.scene.selectedObjectId.length > 0
      ? presentation.scene.selectedObjectId
      : null;
  const effectiveFocusId = explicit ?? selected ?? automatic;
  const hasAnchor = effectiveFocusId != null;
  const retainIds = new Set(choreography.attentionRetention.objectIds);

  const densityFraming = resolveExecutiveDensityFramingFromSceneEvidence({
    mode: hasAnchor ? "focus" : "overview",
    focusedObjectId: effectiveFocusId,
    objectPositions: presentation.scene.objects.map((object) =>
      Object.freeze({
        x: object.overviewPosition[0],
        y: object.overviewPosition[1],
        z: object.overviewPosition[2],
      }),
    ),
    visibleObjectCount: presentation.scene.objects.length,
    visibleContextCount: presentation.contextNodes.length,
    relatedVisibleCount: relatedOrdered.length,
  });

  /** SP:1.5 — spatial + focus camera; SP:1.6 supplies density distance/FOV. */
  const focusPlan = resolveExecutiveFocusChoreography({
    focusedObjectId: effectiveFocusId,
    objects: presentation.scene.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        basePosition: Object.freeze({
          x: object.overviewPosition[0],
          y: object.overviewPosition[1],
          z: object.overviewPosition[2],
        }),
        retainDiscoverability: retainIds.has(object.id),
      }),
    ),
    connections: presentation.scene.connections.map((connection) =>
      Object.freeze({
        id: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
      }),
    ),
    cameraDistance: densityFraming.cameraDistance,
    cameraFov: densityFraming.cameraFov,
  });
  const spatialById = new Map(
    focusPlan.objects.map((entry) => [entry.objectId, entry]),
  );

  const topologyObjects = presentation.scene.objects.filter(
    (object) => object.disclosureState !== "hidden",
  );
  const topologyObjectIds = new Set(
    topologyObjects.map((object) => object.id),
  );
  const topology = resolveExecutiveTopologyGuidedStageComposition({
    objects: topologyObjects.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
      }),
    ),
    relationships: presentation.scene.connections.filter(
      (connection) =>
        topologyObjectIds.has(connection.sourceId) &&
        topologyObjectIds.has(connection.targetId) &&
        connection.visualRole !== "hidden",
    ).map((connection) =>
      Object.freeze({
        id: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
      }),
    ),
    focusedObjectId: effectiveFocusId,
    topologyType: "auto",
  });
  const topologyById = buildExecutiveTopologyStagePositionMap(topology);

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const entry = byId.get(object.id);
      if (!entry) {
        // Explicit user focus may target a Stage object absent from DR plans.
        if (hasAnchor && object.id === effectiveFocusId) {
          return Object.freeze({
            ...object,
            role: "focused" as const,
            focused: true,
            selected: true,
          });
        }
        return object;
      }
      const applied = applyObjectChoreography(
        object,
        entry,
        hasAnchor,
        spatialById.get(object.id),
        topologyById,
      );
      if (!hasAnchor) return applied;
      const isExplicitFocus = object.id === effectiveFocusId;
      return Object.freeze({
        ...applied,
        focused:
          isExplicitFocus && object.disclosureState === "visible-primary",
        selected:
          isExplicitFocus ||
          object.id === presentation.scene.selectedObjectId ||
          applied.selected,
        role: isExplicitFocus
          ? ("focused" as const)
          : applied.role === "focused"
            ? ("related" as const)
            : applied.role,
      });
    }),
  );

  const connectionById = new Map(
    choreography.connections.map((entry) => [entry.connectionId, entry]),
  );
  const connections = Object.freeze(
    presentation.scene.connections.map(
      (connection): NexoraMVPStageConnectionPresentation => {
        const plan = connectionById.get(connection.id);
        if (!plan) return connection;
        if (!hasAnchor) {
          return Object.freeze({
            ...connection,
            emphasized: false,
            opacity: Math.max(connection.opacity, 0.28),
          });
        }
        return Object.freeze({
          ...connection,
          emphasized: plan.shouldForeground,
          opacity: plan.shouldForeground
            ? 0.78
            : plan.shouldDeemphasize
              ? 0.1
              : connection.opacity,
        });
      },
    ),
  );

  const focusCamera: NexoraMVPStageCameraPresentation = Object.freeze({
    position: focusPlan.cameraTuple.position,
    target: focusPlan.cameraTuple.target,
    fov: focusPlan.cameraTuple.fov,
    near: focusPlan.cameraTuple.near,
    far: focusPlan.cameraTuple.far,
  });
  const overviewCamera: NexoraMVPStageCameraPresentation = Object.freeze({
    position: densityFraming.cameraTuple.position,
    target: densityFraming.cameraTuple.target,
    fov: densityFraming.cameraTuple.fov,
    near: densityFraming.cameraTuple.near,
    far: densityFraming.cameraTuple.far,
  });
  const camera =
    choreography.camera.mode === "focus" ? focusCamera : overviewCamera;

  const emphasizedObjectIds = Object.freeze(
    Array.from(
      new Set([
        ...presentation.emphasizedObjectIds,
        ...(effectiveFocusId ? [effectiveFocusId] : []),
        ...relatedOrdered,
        ...retainIds,
      ]),
    ),
  );

  const subordinateObjectIds = Object.freeze(
    objects
      .filter(
        (object) =>
          object.role === "unrelated" && !retainIds.has(object.id),
      )
      .map((object) => object.id),
  );

  return Object.freeze({
    ...presentation,
    focusedSubjectId: effectiveFocusId,
    scene: Object.freeze({
      ...presentation.scene,
      mode: hasAnchor ? ("focus" as const) : ("overview" as const),
      focusedObjectId: effectiveFocusId,
      // Preserve explicit selection when present; do not let automatic
      // attention rebind selection away from a direct Business Object click.
      selectedObjectId:
        presentation.scene.selectedObjectId ?? effectiveFocusId,
      objects,
      connections,
      camera,
    }),
    emphasizedObjectIds,
    subordinateObjectIds,
  });
}
