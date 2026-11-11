/**
 * SP:4.3 Stage bridge — apply executive network topology after SP:4.1C grammar
 * and before SP:4.2 presentation-plane mapping.
 *
 * Selection at this boundary:
 *   Company / Goal overview ring already owns XY → leave it.
 *   No layout-eligible relationship among admitted objects → keep Flow XY.
 *   At least one layout-eligible relationship → existing network placement.
 *
 * A layout edge is a canonical stage connection whose source and target are
 * both visible business objects in this presentation. Context, thread, hidden,
 * stale, and cross-catalog endpoints are not layout edges. Global fixture
 * relationships are not consulted.
 *
 * Does not invent relationships. Does not own scale or SP:4.4 choreography.
 */

import {
  createExecutivePresentationPlane,
  mapExecutive2DPositionToRenderWorld,
  worldTupleFromPresentationWorld,
} from "@/app/lib/spatial-presentation/executivePresentationPlaneFoundation";
import { executiveOverviewRingOwnsPlacement } from "@/app/lib/spatial-presentation/executiveTopologyGuidedStageComposition";
import {
  resolveExecutiveNetworkTopology,
  type ExecutiveNetworkEdge,
  type ExecutiveNetworkNode,
  type ExecutiveNetworkTopology,
} from "@/app/lib/spatial-presentation/executiveNetworkTopology";

import type {
  NexoraMVPStageConnectionPresentation,
} from "./nexora3DExecutiveStage";
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

/**
 * Layout-eligible relationships for this presentation.
 * Both endpoints must be visible admitted business objects.
 * Hidden and context connections stay display-only.
 * Endpoints outside the admitted set are stale or cross-workspace and are dropped.
 */
export function resolveExecutiveStageLayoutEdges(input: {
  readonly connections: readonly {
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
    readonly visualRole?: NexoraMVPStageConnectionPresentation["visualRole"];
  }[];
  readonly eligibleObjectIds: ReadonlySet<string>;
}): readonly ExecutiveNetworkEdge[] {
  const accepted: ExecutiveNetworkEdge[] = [];
  const seen = new Set<string>();
  for (const connection of input.connections) {
    if (connection.visualRole === "hidden" || connection.visualRole === "context") {
      continue;
    }
    const sourceId = connection.sourceId.trim();
    const targetId = connection.targetId.trim();
    if (sourceId.length === 0 || targetId.length === 0 || sourceId === targetId) {
      continue;
    }
    if (
      !input.eligibleObjectIds.has(sourceId) ||
      !input.eligibleObjectIds.has(targetId)
    ) {
      continue;
    }
    const key = `${sourceId}\u0000${targetId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(
      Object.freeze({
        id: connection.id.trim().length > 0 ? connection.id : key,
        sourceId,
        targetId,
      }),
    );
  }
  return Object.freeze(accepted);
}

/**
 * Apply SP:4.3 network topology: rewrite Business Object presentation/world
 * targets from native 2D constellation positions.
 */
export function applyExecutiveNetworkTopologyToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: ApplyExecutiveNetworkTopologyOptions,
): NexoraMVPStageInteractionPresentation {
  if (
    executiveOverviewRingOwnsPlacement({
      mode: presentation.scene.mode,
      overviewAnchorId: presentation.scene.overviewAnchorId,
      focusedObjectId: presentation.scene.focusedObjectId,
      focusedSubjectId: presentation.focusedSubjectId,
    })
  ) {
    return presentation;
  }
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

  const eligibleObjectIds = new Set(nodes.map((node) => node.objectId));
  const edges = resolveExecutiveStageLayoutEdges({
    connections:
      options?.edges != null
        ? options.edges
        : presentation.scene.connections,
    eligibleObjectIds,
  });
  if (edges.length === 0) {
    return presentation;
  }

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
