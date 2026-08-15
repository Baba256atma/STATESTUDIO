/**
 * NEX-MVP consumer of P2:8.3 Focus & Scene Choreography Validation.
 *
 * Applies spatial hierarchy via SP:1.5 Executive Focus Choreography on top of
 * P2:6 roles and P2:8.2 severity presentation. Does not invent edges or weaken
 * critical floors.
 */

import type { DataRealityAwareSceneChoreographyResult } from "@/app/lib/data-reality/dataRealityAwareSceneChoreography";
import type { DataRealityAwareConnectionsContextResult } from "@/app/lib/data-reality/dataRealityAwareConnectionsContext";
import {
  extractObservedFocusScenePresentation,
  validateFocusSceneChoreography,
  type FocusSceneChoreographyValidationResult,
} from "@/app/lib/data-reality/dataRealityFocusSceneChoreographyValidation";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  resolveExecutiveDensityFramingFromSceneEvidence,
} from "@/app/lib/spatial-presentation/executiveDensityAwareFraming";
import {
  resolveExecutiveFocusChoreography,
} from "@/app/lib/spatial-presentation/executiveFocusChoreography";
import {
  buildExecutiveTopologyStagePositionMap,
  resolveExecutiveTopologyGuidedStageComposition,
} from "@/app/lib/spatial-presentation/executiveTopologyGuidedStageComposition";

export const nexoraMVPDataRealityFocusSceneChoreographyIdentity =
  "NEX-MVP/P2:8.3/DataRealityFocusSceneChoreographyValidationConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_FOCUS_SCENE_CHOREOGRAPHY_BOUNDARY =
  Object.freeze({
    consumesP26Choreography: true as const,
    consumesP27ConnectionsContext: true as const,
    consumesP282ObjectVisualState: true as const,
    consumesP283FocusValidation: true as const,
    consumesSp15FocusChoreography: true as const,
    consumesSp41TopologyComposition: true as const,
    inventsRelationships: false as const,
    weakensCriticalDiscoverability: false as const,
    redesignsStageAesthetics: false as const,
    lowLevelMeshesMayImport: false as const,
  });

function applyFocusChoreographyToObject(
  object: NexoraMVPStageObjectPresentation,
  choreography: DataRealityAwareSceneChoreographyResult,
  focusPlan: ReturnType<typeof resolveExecutiveFocusChoreography>,
  topologyById: ReadonlyMap<string, readonly [number, number, number]>,
): NexoraMVPStageObjectPresentation {
  const plan = choreography.objects.find(
    (entry) => entry.objectId === object.id,
  );
  const spatial = focusPlan.objects.find(
    (entry) => entry.objectId === object.id,
  );
  if (!plan || choreography.anchorObjectId === undefined || spatial == null) {
    return object;
  }

  // SP:4.1B — preserve disclosure-hidden presentation.
  if (object.disclosureState === "hidden") {
    return Object.freeze({
      ...object,
      role: "unrelated" as const,
      focused: false,
      selected: false,
      opacity: 0,
      interactive: false,
      labelVisible: false,
      labelProminence: "minimal" as const,
    });
  }

  // SP:4.1C — when visual grammar owns geometry, preserve targetPosition/scale.
  if (object.visualGrammarRole != null) {
    if (plan.isAnchor || spatial.role === "focus") {
      return Object.freeze({
        ...object,
        role: "focused" as const,
        focused: true,
        selected: true,
        opacity: 1,
        labelProminence: "full" as const,
      });
    }
    if (plan.isRelated && spatial.role === "related") {
      return Object.freeze({
        ...object,
        role: "related" as const,
        focused: false,
        selected: false,
      });
    }
    const retained = plan.retainAttention || spatial.retainDiscoverability;
    return Object.freeze({
      ...object,
      role: "unrelated" as const,
      focused: false,
      selected: false,
      labelProminence: retained
        ? object.labelProminence === "minimal"
          ? "reduced"
          : object.labelProminence
        : object.labelProminence,
    });
  }

  const targetPosition =
    topologyById.get(object.id) ?? object.overviewPosition;

  if (plan.isAnchor || spatial.role === "focus") {
    return Object.freeze({
      ...object,
      role: "focused" as const,
      focused: true,
      selected: true,
      targetPosition,
      scale: Math.max(object.scale, 1.32),
      opacity: 1,
      labelProminence: "full" as const,
    });
  }

  if (plan.isRelated && spatial.role === "related") {
    return Object.freeze({
      ...object,
      role: "related" as const,
      focused: false,
      targetPosition,
      selected: false,
    });
  }

  // Background / competing attention / overflow related — spatially secondary.
  const retained = plan.retainAttention || spatial.retainDiscoverability;
  return Object.freeze({
    ...object,
    role: "unrelated" as const,
    focused: false,
    selected: false,
    targetPosition,
    scale: object.scale,
    opacity: object.opacity,
    emissiveIntensity: object.emissiveIntensity,
    stateMarker: object.stateMarker,
    rimIntensity: object.rimIntensity,
    executiveVisualState: object.executiveVisualState,
    labelProminence: retained
      ? object.labelProminence === "minimal"
        ? "reduced"
        : object.labelProminence
      : object.labelProminence,
  });
}

/**
 * Minimal spatial hierarchy correction after P2:6 + P2:8.2.
 * Strengthens anchor ownership via SP:1.5; keeps critical discoverability floors.
 *
 * Explicit Stage user focus beats automatic DR attention — when they diverge,
 * preserve the upstream presentation (already focused by P2:6 apply).
 */
export function applyDataRealityFocusSceneChoreographyToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  choreography: DataRealityAwareSceneChoreographyResult,
): NexoraMVPStageInteractionPresentation {
  const explicit =
    presentation.scene.focusedObjectId != null &&
    presentation.scene.focusedObjectId.length > 0
      ? presentation.scene.focusedObjectId
      : null;
  if (
    explicit != null &&
    choreography.anchorObjectId !== undefined &&
    choreography.anchorObjectId !== explicit
  ) {
    return presentation;
  }
  if (choreography.anchorObjectId === undefined) {
    // Overview already composed by P2:6 + P2:8.2 — do not re-layout.
    // Explicit focus may still be present (e.g. Budget outside DR catalog).
    return presentation;
  }

  const relatedVisibleCount = choreography.objects.filter(
    (entry) => entry.isRelated,
  ).length;
  const densityFraming = resolveExecutiveDensityFramingFromSceneEvidence({
    mode: "focus",
    focusedObjectId: choreography.anchorObjectId,
    objectPositions: presentation.scene.objects.map((object) =>
      Object.freeze({
        x: object.overviewPosition[0],
        y: object.overviewPosition[1],
        z: object.overviewPosition[2],
      }),
    ),
    visibleObjectCount: presentation.scene.objects.length,
    visibleContextCount: presentation.contextNodes.length,
    relatedVisibleCount,
  });

  const focusPlan = resolveExecutiveFocusChoreography({
    focusedObjectId: choreography.anchorObjectId,
    objects: presentation.scene.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        basePosition: Object.freeze({
          x: object.overviewPosition[0],
          y: object.overviewPosition[1],
          z: object.overviewPosition[2],
        }),
        retainDiscoverability:
          choreography.objects.find((entry) => entry.objectId === object.id)
            ?.retainAttention === true,
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
    relationships: presentation.scene.connections
      .filter(
        (connection) =>
          topologyObjectIds.has(connection.sourceId) &&
          topologyObjectIds.has(connection.targetId) &&
          connection.visualRole !== "hidden",
      )
      .map((connection) =>
        Object.freeze({
          id: connection.id,
          sourceId: connection.sourceId,
          targetId: connection.targetId,
        }),
      ),
    focusedObjectId: choreography.anchorObjectId,
    topologyType: "auto",
  });
  const topologyById = buildExecutiveTopologyStagePositionMap(topology);

  const objects = Object.freeze(
    presentation.scene.objects.map((object) =>
      applyFocusChoreographyToObject(
        object,
        choreography,
        focusPlan,
        topologyById,
      ),
    ),
  );

  return Object.freeze({
    ...presentation,
    focusedSubjectId: choreography.anchorObjectId,
    scene: Object.freeze({
      ...presentation.scene,
      mode: "focus" as const,
      focusedObjectId: choreography.anchorObjectId,
      objects,
      camera: Object.freeze({
        position: focusPlan.cameraTuple.position,
        target: focusPlan.cameraTuple.target,
        fov: focusPlan.cameraTuple.fov,
        near: focusPlan.cameraTuple.near,
        far: focusPlan.cameraTuple.far,
      }),
    }),
  });
}

export type ResolveNexoraMVPFocusSceneChoreographyValidationInput = {
  readonly scenario: string;
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly choreography: DataRealityAwareSceneChoreographyResult;
  readonly connectionsContext: DataRealityAwareConnectionsContextResult;
};

export type NexoraMVPFocusSceneChoreographyValidationBundle = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly validation: FocusSceneChoreographyValidationResult;
};

export function resolveNexoraMVPFocusSceneChoreographyValidation(
  input: ResolveNexoraMVPFocusSceneChoreographyValidationInput,
): NexoraMVPFocusSceneChoreographyValidationBundle {
  const presentation = applyDataRealityFocusSceneChoreographyToStagePresentation(
    input.presentation,
    input.choreography,
  );
  const observed = extractObservedFocusScenePresentation(presentation);
  const validation = validateFocusSceneChoreography({
    scenario: input.scenario,
    choreography: input.choreography,
    connectionsContext: input.connectionsContext,
    observed,
  });
  return Object.freeze({ presentation, validation });
}
