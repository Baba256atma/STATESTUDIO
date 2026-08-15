/**
 * NEX-MVP consumer of P2:8.5 Density, Camera & Executive Readability Validation.
 *
 * Applies restrained label-priority, camera framing, and background-edge
 * attenuation after P2:8.4. Does not invent edges, weaken critical floors,
 * or act as a semantic filter.
 */

import type { DataRealityAwareConnectionsContextResult } from "@/app/lib/data-reality/dataRealityAwareConnectionsContext";
import {
  DATA_REALITY_NORMAL_BACKGROUND_MIN_OPACITY,
  DATA_REALITY_READABILITY_CRITICAL_FLOORS,
  extractObservedExecutiveReadabilityEvidence,
  resolveDataRealityConnectionDensityState,
  resolveDataRealityLabelReadabilityState,
  validateExecutiveReadability,
  type ExecutiveReadabilityValidationResult,
} from "@/app/lib/data-reality/dataRealityDensityCameraExecutiveReadabilityValidation";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  resolveExecutiveDensityFramingFromSceneEvidence,
} from "@/app/lib/spatial-presentation/executiveDensityAwareFraming";
import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  toExecutiveCameraTuplePresentation,
} from "@/app/lib/spatial-presentation/executiveCameraFoundation";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "@/app/lib/spatial-presentation/executiveViewingAngle";

export const nexoraMVPDataRealityExecutiveReadabilityIdentity =
  "NEX-MVP/P2:8.5/DataRealityDensityCameraExecutiveReadabilityValidationConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_EXECUTIVE_READABILITY_BOUNDARY =
  Object.freeze({
    consumesP284ConnectionsContextVisual: true as const,
    consumesP285DensityCameraReadability: true as const,
    inventsRelationships: false as const,
    weakensCriticalDiscoverability: false as const,
    actsAsSemanticFilter: false as const,
    createsLayoutEngine: false as const,
    redesignsStageAesthetics: false as const,
    lowLevelMeshesMayImport: false as const,
  });

function applyLabelAndBreathingToObject(
  object: NexoraMVPStageObjectPresentation,
  mode: "overview" | "focus",
): NexoraMVPStageObjectPresentation {
  const label = resolveDataRealityLabelReadabilityState({
    objectId: object.id,
    mode,
    role: object.role,
    focused: object.focused,
    executiveVisualState: object.executiveVisualState,
    stateMarker: object.stateMarker,
    attention: object.attention,
  });

  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const isCritical =
    object.executiveVisualState === "critical" ||
    object.stateMarker === "critical";

  // Never weaken critical discoverability floors.
  let opacity = object.opacity;
  let scale = object.scale;
  let emissiveIntensity = object.emissiveIntensity;
  if (isCritical) {
    opacity = Math.max(opacity, floors.minOpacity);
    scale = Math.max(scale, floors.minScale);
    emissiveIntensity = Math.max(emissiveIntensity, floors.minEmissive);
  } else if (object.role === "unrelated" || mode === "overview") {
    // Avoid discoverability-tension dimming below structural density floor.
    opacity = Math.max(opacity, DATA_REALITY_NORMAL_BACKGROUND_MIN_OPACITY);
  }

  return Object.freeze({
    ...object,
    labelProminence: label.prominence,
    opacity,
    scale,
    emissiveIntensity,
  });
}

/**
 * Apply P2:8.5 readability corrections onto Stage presentation.
 * Preserves object IDs, roles, severity markers, and connection identity set.
 */
export function applyDataRealityExecutiveReadabilityToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  const mode = presentation.scene.mode;
  const relatedVisibleCount = presentation.scene.objects.filter(
    (object) => object.role === "related",
  ).length;
  const densityPositions =
    mode === "focus"
      ? presentation.scene.objects
          .filter(
            (object) =>
              object.role === "focused" || object.role === "related",
          )
          .map((object) =>
            Object.freeze({
              x: object.targetPosition[0],
              y: object.targetPosition[1],
              z: object.targetPosition[2],
            }),
          )
      : presentation.scene.objects.map((object) =>
          Object.freeze({
            x: object.overviewPosition[0],
            y: object.overviewPosition[1],
            z: object.overviewPosition[2],
          }),
        );
  const densityFraming = resolveExecutiveDensityFramingFromSceneEvidence({
    mode,
    focusedObjectId: presentation.scene.focusedObjectId,
    objectPositions: densityPositions,
    visibleObjectCount: presentation.scene.objects.length,
    visibleContextCount: presentation.contextNodes.length,
    relatedVisibleCount,
  });

  /**
   * SP:1.6 density distance/FOV on SP:1.2 angle family.
   * Target hierarchy unchanged: overview center / focus region.
   * For the canonical MVP balanced scene this matches certified readability
   * camera tuples within resolve tolerance.
   */
  const policy =
    mode === "focus"
      ? EXECUTIVE_FOCUS_VIEWING_POLICY
      : EXECUTIVE_OVERVIEW_VIEWING_POLICY;
  const cameraIntent = sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: Object.freeze({
        x: densityFraming.cameraTarget.x,
        y: densityFraming.cameraTarget.y,
        z: densityFraming.cameraTarget.z,
      }),
      distance: densityFraming.cameraDistance,
      azimuth: policy.azimuth,
      elevation: policy.elevation,
      fov: densityFraming.cameraFov,
    }),
  );
  const cameraPresentation = resolveExecutiveCameraPresentation(cameraIntent, {
    framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  });
  const cameraTuple = toExecutiveCameraTuplePresentation(cameraPresentation);

  const objects = Object.freeze(
    presentation.scene.objects.map((object) =>
      applyLabelAndBreathingToObject(object, mode),
    ),
  );

  const connections = Object.freeze(
    presentation.scene.connections.map((connection) => {
      const density = resolveDataRealityConnectionDensityState({
        connectionId: connection.id,
        visualRole: connection.visualRole,
        emphasized: connection.emphasized,
        opacity: connection.opacity,
        width: connection.lineWidth,
        mode,
      });
      return Object.freeze({
        ...connection,
        emphasized: density.emphasized,
        opacity: density.opacity,
        lineWidth: density.width,
        visualRole: density.visualRole as typeof connection.visualRole,
      });
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => {
      if (node.role === "context") {
        // Keep subordinate; slightly calm label competition via opacity.
        return Object.freeze({
          ...node,
          opacity: Math.min(Math.max(node.opacity, 0.82), 0.9),
          scale: Math.min(node.scale, 0.7),
        });
      }
      return node;
    }),
  );

  const contextConnections = Object.freeze(
    presentation.contextConnections.map((connection) => {
      const density = resolveDataRealityConnectionDensityState({
        connectionId: connection.id,
        visualRole: connection.visualRole ?? "context",
        emphasized: connection.emphasized,
        opacity: connection.opacity,
        width: connection.lineWidth,
        mode,
      });
      return Object.freeze({
        ...connection,
        emphasized: density.emphasized,
        opacity: density.opacity,
        lineWidth: density.width,
        visualRole: "context" as const,
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
      connections,
      camera: Object.freeze({
        position: cameraTuple.position,
        target: cameraTuple.target,
        fov: cameraTuple.fov,
        near: cameraTuple.near,
        far: cameraTuple.far,
      }),
    }),
    contextNodes,
    contextConnections,
    emphasizedRelationshipIds: Object.freeze(
      connections
        .filter((entry) => entry.emphasized)
        .map((entry) => entry.id),
    ),
  });
}

export type ResolveNexoraMVPExecutiveReadabilityValidationInput = {
  readonly scenario: string;
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly connectionsContext?: DataRealityAwareConnectionsContextResult;
};

export type NexoraMVPExecutiveReadabilityValidationBundle = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly validation: ExecutiveReadabilityValidationResult;
};

export function resolveNexoraMVPExecutiveReadabilityValidation(
  input: ResolveNexoraMVPExecutiveReadabilityValidationInput,
): NexoraMVPExecutiveReadabilityValidationBundle {
  const presentation = applyDataRealityExecutiveReadabilityToStagePresentation(
    input.presentation,
  );
  const observed = extractObservedExecutiveReadabilityEvidence(presentation);
  const validation = validateExecutiveReadability({
    scenario: input.scenario,
    observed,
    ...(input.connectionsContext !== undefined
      ? { connectionsContext: input.connectionsContext }
      : {}),
  });
  return Object.freeze({ presentation, validation });
}
