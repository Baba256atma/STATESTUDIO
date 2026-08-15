/**
 * SP:4.3 Stage bridge — apply executive network topology after SP:4.1C grammar
 * and before SP:4.2 presentation-plane mapping.
 *
 * Overview → executive-network (no flow).
 * Focus → explicit anchor owns exact presentation {0,0}.
 *
 * Does not invent relationships. Does not own scale or SP:4.4 choreography.
 */

import {
  createExecutivePresentationPlane,
  mapExecutive2DPositionToRenderWorld,
  worldTupleFromPresentationWorld,
} from "@/app/lib/spatial-presentation/executivePresentationPlaneFoundation";
import {
  resolveExecutiveNetworkTopology,
  type ExecutiveNetworkEdge,
  type ExecutiveNetworkNode,
  type ExecutiveNetworkTopology,
} from "@/app/lib/spatial-presentation/executiveNetworkTopology";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";

import type { NexoraMVPStageInteractionPresentation } from "./nexoraMVPObjectInteraction";

export type ApplyExecutiveNetworkTopologyOptions = {
  /** Explicit topology anchor. Defaults to focused object in focus mode. */
  readonly anchorObjectId?: string | null;
  /** Additional/override canonical edges. Defaults to Stage fixtures. */
  readonly edges?: readonly ExecutiveNetworkEdge[];
};

function isVisibleBusinessObject(disclosureState: string | undefined): boolean {
  return (
    disclosureState === "visible-primary" ||
    disclosureState === "visible-related" ||
    disclosureState === "background-discoverable" ||
    disclosureState == null
  );
}

function collectCanonicalEdges(
  presentation: NexoraMVPStageInteractionPresentation,
  override?: readonly ExecutiveNetworkEdge[],
): readonly ExecutiveNetworkEdge[] {
  if (override != null) return override;
  const fromScene = presentation.scene.connections
    .filter((connection) => connection.visualRole !== "hidden")
    .map((connection) =>
      Object.freeze({
        id: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
      }),
    );
  if (fromScene.length > 0) return Object.freeze(fromScene);
  return Object.freeze(
    NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.map((edge) =>
      Object.freeze({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
      }),
    ),
  );
}

/**
 * Apply SP:4.3 network topology: rewrite Business Object presentation/world
 * targets from native 2D constellation positions.
 */
export function applyExecutiveNetworkTopologyToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: ApplyExecutiveNetworkTopologyOptions,
): NexoraMVPStageInteractionPresentation {
  const plane = createExecutivePresentationPlane();
  const visibleObjects = presentation.scene.objects.filter(
    (object) =>
      object.disclosureState !== "hidden" &&
      isVisibleBusinessObject(object.disclosureState),
  );

  const nodes: ExecutiveNetworkNode[] = visibleObjects.map((object) =>
    Object.freeze({
      objectId: object.id,
      label: object.label,
      objectKind: object.kind,
      compositionScale: object.scale,
      attention: object.attention,
      status: object.status,
      disclosureState: object.disclosureState,
    }),
  );

  const edges = collectCanonicalEdges(presentation, options?.edges);

  const anchorObjectId =
    options?.anchorObjectId !== undefined
      ? options.anchorObjectId
      : presentation.scene.mode === "focus"
        ? presentation.scene.focusedObjectId
        : null;

  const topology = resolveExecutiveNetworkTopology({
    nodes,
    edges,
    plane,
    anchorObjectId,
    mode: presentation.scene.mode,
  });

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const placement = topology.byId.get(object.id);
      if (placement == null || object.disclosureState === "hidden") {
        return object;
      }
      const world = mapExecutive2DPositionToRenderWorld({
        position: placement.presentationPosition,
        plane,
      });
      return Object.freeze({
        ...object,
        // Preserve certified compositionScale — topology does not own scale.
        scale: object.scale,
        presentationPosition: placement.presentationPosition,
        networkTopologyLayer: placement.layer,
        networkTopologySlotId: placement.slotId,
        // depthRole metadata may remain on the object; it must not move anchors.
        // overviewPosition must not retain legacy overview XYZ in focus mode —
        // it is not layout authority; keep it aligned with the 2D→world target.
        targetPosition: worldTupleFromPresentationWorld(world),
        overviewPosition: worldTupleFromPresentationWorld(world),
      });
    }),
  );

  // Connections: preserve IDs; hide edges with a hidden endpoint.
  const visibleIds = new Set(
    objects
      .filter((object) => object.disclosureState !== "hidden")
      .map((object) => object.id),
  );
  const connections = Object.freeze(
    presentation.scene.connections.map((connection) => {
      const endpointsVisible =
        visibleIds.has(connection.sourceId) &&
        visibleIds.has(connection.targetId);
      if (endpointsVisible) return connection;
      return Object.freeze({
        ...connection,
        visualRole: "hidden" as const,
        opacity: 0,
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
      connections,
      networkTopology: topology,
      topologyKind: "executive-network" as const,
    }),
  });
}

export function getExecutiveNetworkTopologyFromPresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): ExecutiveNetworkTopology | null {
  const topology = (
    presentation.scene as {
      readonly networkTopology?: ExecutiveNetworkTopology;
    }
  ).networkTopology;
  return topology ?? null;
}
