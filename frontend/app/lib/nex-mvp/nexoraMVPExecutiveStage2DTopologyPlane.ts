/**
 * STAGE-2D:2 Stage bridge — enforce true X/Y topology positions on the
 * live Executive Stage presentation.
 *
 * Final physical Stage positions pass through this boundary:
 *   {x, y, z?} → normalize → {x, y, z: EXECUTIVE_STAGE_2D_DEPTH}
 *
 * Semantic systems (Director / focus / attention / Data Reality) may still
 * decide importance. They must not introduce semantic depth.
 */

import {
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY,
  EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY,
  getExecutiveStage2DTopologyPlaneIdentity,
  normalizeExecutiveStage2DPositionTuple,
} from "@/app/lib/spatial-presentation/executiveStage2DTopologyPlane";
import type { NexoraMVPStageObjectPresentation } from "./nexora3DExecutiveStage";
import type {
  NexoraMVPContextNodePresentation,
  NexoraMVPStageInteractionPresentation,
} from "./nexoraMVPObjectInteraction";

export const nexoraMVPExecutiveStage2DTopologyPlaneIdentity =
  "NEX-MVP/STAGE-2D:2/ExecutiveStage2DTopologyPlaneBridge" as const;

export const NEXORA_MVP_EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY =
  Object.freeze({
    ...EXECUTIVE_STAGE_2D_TOPOLOGY_PLANE_BOUNDARY,
    authorizesFinalStagePositions: true as const,
    flattensOverviewAndTarget: true as const,
    flattensContextNodes: true as const,
  });

function flattenObject(
  object: NexoraMVPStageObjectPresentation,
): NexoraMVPStageObjectPresentation {
  return Object.freeze({
    ...object,
    targetPosition: normalizeExecutiveStage2DPositionTuple(object.targetPosition),
    overviewPosition: normalizeExecutiveStage2DPositionTuple(
      object.overviewPosition,
    ),
  });
}

function flattenContext(
  node: NexoraMVPContextNodePresentation,
): NexoraMVPContextNodePresentation {
  return Object.freeze({
    ...node,
    targetPosition: normalizeExecutiveStage2DPositionTuple(node.targetPosition),
  });
}

/**
 * Authoritative final position pass for the live Stage pipeline.
 * Preserves ids / focus / attention / presentation state; forces z = 0.
 */
export function applyExecutiveStage2DTopologyPlaneToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  const objects = Object.freeze(
    presentation.scene.objects.map((object) => flattenObject(object)),
  );
  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => flattenContext(node)),
  );

  return Object.freeze({
    ...presentation,
    contextNodes,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
    }),
  });
}

export function getNexoraMVPExecutiveStage2DTopologyPlaneObservability(): Readonly<{
  readonly identity: string;
  readonly stagePlane: string;
  readonly stageDepth: string;
  readonly positionMode: string;
  readonly contract: string;
}> {
  const identity = getExecutiveStage2DTopologyPlaneIdentity();
  return Object.freeze({
    identity: identity.id,
    stagePlane: EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY.stagePlane,
    stageDepth: EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY.stageDepth,
    positionMode: EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY.positionMode,
    contract: EXECUTIVE_STAGE_2D_TOPOLOGY_OBSERVABILITY.contract,
  });
}

export {
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPositionTuple,
};
