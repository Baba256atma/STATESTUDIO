"use client";

import { useMemo, useRef, useState } from "react";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraDecisionTheatreDataObjectStageProjection } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { resolveExecutiveDensityAwareFraming } from "@/app/lib/spatial-presentation/executiveDensityAwareFraming";
import { resolveExecutiveLightingProfile } from "@/app/lib/spatial-presentation/executiveLightingFoundation";
import {
  estimateExecutiveObjectLabelScreenBounds,
  projectExecutiveObjectLabelToNdc,
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
  type ExecutiveObjectLabelCollisionAdjustment,
} from "@/app/lib/spatial-presentation/executiveObjectLabelInformationDensity";
import {
  publishExecutiveStageLabelObservability,
  resolveExecutiveLabelPlacementSideForSector,
  resolveExecutiveStageAngularSector,
} from "@/app/lib/spatial-presentation/executiveObjectLabelRelationshipGrammar";
import {
  resolveExecutiveObjectOcclusion,
  resolveExecutiveOcclusionReadability,
} from "@/app/lib/spatial-presentation/executiveObjectOcclusion";
import {
  mapStageRoleToSpatialRole,
  resolveExecutiveObjectVisualPresentation,
  toExecutiveObjectVisualInput,
} from "@/app/lib/spatial-presentation/executiveObjectVisualFoundation";
import { resolveExecutiveStage2DVisualPresentationOffset } from "@/app/lib/spatial-presentation/executiveStage2DVisualCertification";
import { NexoraSceneEnvironmentController } from "../workspace/NexoraSceneEnvironmentController";
import { NexoraExecutiveCameraController } from "./NexoraExecutiveCameraController";
import { NexoraExecutiveLightingRig } from "./NexoraExecutiveLightingRig";
import { NexoraStageConnections } from "./NexoraStageConnections";
import { NexoraStageContextNodes } from "./NexoraStageContextNodes";
import { NexoraStageDeepZEnvironment } from "./NexoraStageDeepZEnvironment";
import { NexoraStageMotionController } from "./NexoraStageMotionController";
import { NexoraStageObject } from "./NexoraStageObject";
import { NexoraStageDataObject } from "./NexoraStageDataObject";

type Props = {
  readonly presentation: NexoraMVPStageInteractionPresentation;
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly dataObjectStage: NexoraDecisionTheatreDataObjectStageProjection;
  readonly onSelectSubject: (subjectId: string) => void;
  readonly onSelectDataObject: (dataObjectId: string) => void;
  readonly onClearSelection: () => void;
};

function mergeOcclusionPresentation(
  object: NexoraMVPStageObjectPresentation,
  occlusionById: ReturnType<
    typeof resolveExecutiveObjectOcclusion
  >["byId"],
  hoveredId: string | null,
): NexoraMVPStageObjectPresentation {
  const occlusion = occlusionById.get(object.id);
  if (occlusion == null) {
    return object;
  }

  const readability = resolveExecutiveOcclusionReadability({
    occlusion,
    retainDiscoverability:
      object.attention === "critical" ||
      object.stateMarker === "critical" ||
      object.stateMarker === "unresolved",
    hovered: hoveredId === object.id,
    focused: object.focused,
  });

  const isDirectOccluderOfHovered =
    hoveredId != null &&
    occlusionById.get(hoveredId)?.occluderIds.includes(object.id) === true;

  const labelProminence =
    object.focused || object.labelProminence === "full"
      ? object.labelProminence
      : occlusion.state === "clear"
        ? object.labelProminence
        : readability.labelProminence;

  return Object.freeze({
    ...object,
    occlusionState: occlusion.state,
    occluderIds: occlusion.occluderIds,
    readabilityAssist: occlusion.readabilityAssist,
    silhouetteAssist:
      readability.silhouetteAssist ||
      (hoveredId === object.id && occlusion.state !== "clear"),
    labelProminence,
    // Subtle temporary occluder de-emphasis — presentation only.
    opacity: isDirectOccluderOfHovered
      ? Math.max(0.42, object.opacity * 0.82)
      : object.opacity,
  });
}

function cameraDistanceFromScene(camera: {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}): number {
  const dx = camera.position[0] - camera.target[0];
  const dy = camera.position[1] - camera.target[1];
  const dz = camera.position[2] - camera.target[2];
  return Math.hypot(dx, dy, dz);
}

/**
 * Canonical Stage scene graph — presentation consumer only.
 * SP:1.8 occlusion readability is derived from camera + rendered targets.
 * SP:2.5 label density / collision is resolved from camera + density + priority.
 */
export function NexoraStageScene({
  presentation,
  environment,
  dataObjectStage,
  onSelectSubject,
  onSelectDataObject,
  onClearSelection,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const previousCollisionsRef = useRef<
    ReadonlyMap<string, ExecutiveObjectLabelCollisionAdjustment>
  >(new Map());
  const scene = presentation.scene;

  const allConnections = useMemo(
    () =>
      [...scene.connections, ...presentation.contextConnections, ...dataObjectStage.connections].map(
        (connection) =>
          Object.freeze({
            ...connection,
            opacity: Math.min(
              1,
              connection.opacity * environment.connectionEmphasis,
            ),
          }),
      ),
    [
      scene.connections,
      presentation.contextConnections,
      dataObjectStage.connections,
      environment.connectionEmphasis,
    ],
  );

  const visualPresentationOffset = useMemo(
    () => resolveExecutiveStage2DVisualPresentationOffset(),
    [],
  );

  const cameraDistance = useMemo(
    () => cameraDistanceFromScene(scene.camera),
    [scene.camera],
  );

  const densityFraming = useMemo(() => {
    const relatedVisibleCount = scene.objects.filter(
      (object) => object.role === "related",
    ).length;
    return resolveExecutiveDensityAwareFraming({
      mode: scene.mode,
      visibleObjectCount: scene.objects.length,
      visibleContextCount: presentation.contextNodes.length,
      focusedObjectId: scene.focusedObjectId,
      relatedVisibleCount,
    });
  }, [
    presentation.contextNodes.length,
    scene.focusedObjectId,
    scene.mode,
    scene.objects,
  ]);

  const occlusion = useMemo(
    () =>
      resolveExecutiveObjectOcclusion({
        objects: scene.objects.map((object) => {
          const visual = resolveExecutiveObjectVisualPresentation(
            toExecutiveObjectVisualInput({
              objectId: object.id,
              objectKind: object.kind,
              objectName: object.label,
              selected: object.selected,
              focused: object.focused,
              attention: object.attention,
              status: object.status,
              role: object.role,
              scale: object.scale,
              cameraDistance,
              densityProfile: densityFraming.profile,
            }),
          );
          return Object.freeze({
            objectId: object.id,
            position: Object.freeze({
              x: object.targetPosition[0],
              y: object.targetPosition[1],
              z: object.targetPosition[2],
            }),
            // SP:2.1 connection-anchor radius — geometry-family agnostic.
            radius: visual.connectionAnchor.radius,
          });
        }),
        cameraPosition: Object.freeze({
          x: scene.camera.position[0],
          y: scene.camera.position[1],
          z: scene.camera.position[2],
        }),
        cameraTarget: Object.freeze({
          x: scene.camera.target[0],
          y: scene.camera.target[1],
          z: scene.camera.target[2],
        }),
        fovDegrees: scene.camera.fov,
        aspect: 1.45,
        hoveredObjectId: hoveredId,
        focusedObjectId: scene.focusedObjectId,
      }),
    [
      cameraDistance,
      densityFraming.profile,
      hoveredId,
      scene.camera,
      scene.focusedObjectId,
      scene.objects,
    ],
  );

  const occludedObjects = useMemo(
    () =>
      scene.objects.map((object) =>
        mergeOcclusionPresentation(object, occlusion.byId, hoveredId),
      ),
    [hoveredId, occlusion.byId, scene.objects],
  );
  const connectionObjects = useMemo(
    () => [
      ...occludedObjects,
      ...dataObjectStage.participants.map((entry) => entry.presentation),
    ],
    [dataObjectStage.participants, occludedObjects],
  );

  const lighting = useMemo(
    () =>
      resolveExecutiveLightingProfile({
        profileId: "executive-default",
        environment: {
          keyLightColor: environment.keyLightColor,
          fillLightColor: environment.fillLightColor,
          groundColor: environment.groundColor,
        },
      }),
    [
      environment.fillLightColor,
      environment.groundColor,
      environment.keyLightColor,
    ],
  );

  const labelCollisions = useMemo(() => {
    // STAGE-LABEL:1 owns final placement — skip free-float screen displacement.
    const stageLabelActive = occludedObjects.some(
      (object) => object.stageLabelContract === "stage-label-1",
    );
    if (stageLabelActive) {
      const empty = new Map();
      return Object.freeze({
        byId: empty,
        adjustments: Object.freeze([]),
        visibleCount: occludedObjects.filter((o) => o.labelVisible !== false)
          .length,
        hiddenCount: 0,
        collisionCount: 0,
        overflowCount: 0,
      });
    }
    const viewportWidth = 1280;
    const viewportHeight = 720;
    const focusedId = scene.focusedObjectId;
    const candidates = occludedObjects.map((object, stageOrder) => {
      const label = resolveExecutiveObjectLabelPresentation({
        objectId: object.id,
        objectName: object.label,
        objectKind: object.kind,
        status: object.status,
        attention: object.attention,
        stateMarker: object.stateMarker,
        primaryValue: object.primaryValue,
        primaryMetricLabel: object.primaryMetricLabel,
        spatialRole: mapStageRoleToSpatialRole(object.role),
        focused: object.focused,
        selected: object.selected,
        hovered: hoveredId === object.id,
        occlusionState: object.occlusionState,
        readabilityAssist: object.readabilityAssist,
        cameraDistance,
        densityProfile: densityFraming.profile,
        labelProminence: object.labelProminence,
        stageOrder,
        preferredPlacementSide:
          object.focused || object.id === focusedId
            ? "top"
            : focusedId
              ? resolveExecutiveLabelPlacementSideForSector(
                  resolveExecutiveStageAngularSector(
                    object.targetPosition[0],
                    object.targetPosition[1],
                  ),
                )
              : "top",
      });
      const projected = projectExecutiveObjectLabelToNdc({
        world: {
          x: object.targetPosition[0] + (label.anchor.worldOffsetX ?? 0),
          y: object.targetPosition[1] + (label.anchor.worldOffsetY ?? label.anchor.offset),
          z: object.targetPosition[2],
        },
        cameraPosition: {
          x: scene.camera.position[0],
          y: scene.camera.position[1],
          z: scene.camera.position[2],
        },
        cameraTarget: {
          x: scene.camera.target[0],
          y: scene.camera.target[1],
          z: scene.camera.target[2],
        },
        fovDegrees: scene.camera.fov,
        aspect: viewportWidth / viewportHeight,
      });
      const screenX = ((projected.x + 1) * 0.5) * viewportWidth;
      const screenY = ((1 - projected.y) * 0.5) * viewportHeight;
      const bounds = estimateExecutiveObjectLabelScreenBounds({
        lines: label.lines,
        fontSizePx: label.fontSizePx,
        screenX,
        screenY,
      });
      // STAGE-OBJ:3 — sector-aware preferred label side.
      let preferredPlacementSide:
        | "top"
        | "top-right"
        | "right"
        | "bottom-right"
        | "bottom"
        | "bottom-left"
        | "left"
        | "top-left" = "top";
      if (object.focused || object.id === focusedId) {
        preferredPlacementSide = "top";
      } else if (focusedId) {
        const sector = resolveExecutiveStageAngularSector(
          object.targetPosition[0],
          object.targetPosition[1],
        );
        preferredPlacementSide =
          resolveExecutiveLabelPlacementSideForSector(sector);
      }
      return Object.freeze({
        objectId: object.id,
        priorityRank: label.priorityRank,
        stageOrder,
        level: label.level,
        prominence: label.prominence,
        visible: label.visible,
        screenX: bounds.x,
        screenY: bounds.y,
        width: bounds.width,
        height: bounds.height,
        preferredPlacementSide,
      });
    });

    const resolved = resolveExecutiveObjectLabelCollisions({
      candidates,
      viewportWidth,
      viewportHeight,
      previous: previousCollisionsRef.current,
    });
    previousCollisionsRef.current = resolved.byId;
    publishExecutiveStageLabelObservability({
      labelVisibleCount: resolved.visibleCount,
      labelHiddenCount: resolved.hiddenCount,
      labelCollisionCount: resolved.collisionCount,
      labelOverflowCount: resolved.overflowCount,
      primaryEdgeCount: scene.connections.filter(
        (connection) =>
          connection.visualRole === "anchor-incident" ||
          connection.emphasized === true,
      ).length,
      secondaryEdgeCount: scene.connections.filter(
        (connection) =>
          connection.visualRole === "context" ||
          connection.visualRole === "related",
      ).length,
      edgeLabelCollisionCount: 0,
      sectorCompression:
        (
          scene as {
            readonly stage2dReadability?: {
              readonly sectorCompression?: number;
            };
          }
        ).stage2dReadability?.sectorCompression ?? 0,
    });
    return resolved;
  }, [
    cameraDistance,
    densityFraming.profile,
    hoveredId,
    occludedObjects,
    scene.camera,
    scene.connections,
    scene.focusedObjectId,
  ]);

  return (
    <>
      <NexoraExecutiveLightingRig lighting={lighting} />

      <NexoraSceneEnvironmentController
        environment={environment}
        groundResponse={lighting.tokens.groundResponse}
        onClearSelection={onClearSelection}
      />

      {/*
        STAGE-2D:6V — presentation offset so semantic {0,0,0} projects to the
        usable Stage visual center. Camera remains fixed at (0,0,11)→(0,0,0).
        STAGE-DEPTH:1 — Deep-Z atmosphere shares this visual-center offset and
        sits behind the Executive topology plane (z < 0).
      */}
      <group
        position={[
          visualPresentationOffset.x,
          visualPresentationOffset.y,
          0,
        ]}
        userData={{ stage2dVisualOffset: true }}
      >
        <NexoraStageDeepZEnvironment
          topologyMode={scene.mode === "focus" ? "anchored" : "overview"}
        />

        {/* ExecutiveTopologyPlane — semantic z = 0 */}
        <group
          userData={{
            spatialLayer: "semantic-plane",
            stageSemanticPlaneZ: 0,
          }}
          renderOrder={0}
        >
          <NexoraStageMotionController
            objects={occludedObjects}
            contextNodes={presentation.contextNodes}
            anchorObjectId={
              scene.mode === "focus"
                ? (scene.focusedObjectId ?? scene.selectedObjectId ?? null)
                : null
            }
          />

          <NexoraStageConnections
            connections={allConnections}
            objects={connectionObjects}
            contextNodes={presentation.contextNodes}
          />

          {occludedObjects.map((object, stageOrder) => (
            <NexoraStageObject
              key={object.id}
              presentation={object}
              hoveredId={hoveredId}
              onSelect={onSelectSubject}
              onHover={setHoveredId}
              cameraDistance={cameraDistance}
              densityProfile={densityFraming.profile}
              stageOrder={stageOrder}
              labelCollision={labelCollisions.byId.get(object.id)}
              presentationLevel={
                scene.presentationState === "report" ||
                scene.presentationState === "operation"
                  ? scene.presentationState
                  : "minimum"
              }
            />
          ))}

          {dataObjectStage.participants.map((participant) => (
            <NexoraStageDataObject
              key={participant.dataObject.id}
              participant={participant}
              onSelect={onSelectDataObject}
            />
          ))}

          <NexoraStageContextNodes
            nodes={presentation.contextNodes}
            hoveredId={hoveredId}
            onSelect={onSelectSubject}
            onHover={setHoveredId}
          />
        </group>
      </group>

      <NexoraExecutiveCameraController camera={scene.camera} />
    </>
  );
}
