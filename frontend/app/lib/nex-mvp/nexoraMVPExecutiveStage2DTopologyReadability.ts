/**
 * STAGE-2D:4 Stage bridge — apply anchored topology readability polish.
 *
 * Wraps STAGE-2D:3 recomposition with footprint-aware spacing, adaptive
 * 1-hop layout, secondary prioritization, and planar connection routing.
 */

import {
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
} from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera";
import {
  EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY,
  EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY,
  getExecutiveStage2DTopologyReadabilityIdentity,
  resolveExecutiveStage2DTopologyReadability,
  type ExecutiveStage2DTopologyReadability,
} from "@/app/lib/spatial-presentation/executiveStage2DTopologyReadability";
import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "@/app/lib/spatial-presentation/executiveStage2DHardSeparation";
import {
  EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET,
  enforceExecutiveStageNoOrphanLabel,
  mapNeighborhoodClassToVisualRole,
} from "@/app/lib/spatial-presentation/executiveStageVisualBalance";
import {
  EXECUTIVE_OBJECT_PRESENCE_CONNECTION,
  isExecutiveObjectPresenceV2Enabled,
} from "@/app/lib/spatial-presentation/executiveObjectPresenceIdentity";
import {
  EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE,
} from "@/app/lib/spatial-presentation/executiveObjectLabelRelationshipGrammar";
import {
  isExecutiveThreadWorkKind,
  EXECUTIVE_THREAD_GATEWAY_FOOTPRINT,
  resolveExecutiveThreadGatewayPosition,
  resolveExecutiveThreadSectorPosition,
} from "@/app/lib/spatial-presentation/executiveThreadExpansion";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures";
import {
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import type { NexoraMVPStageObjectRole } from "./nexora3DExecutiveStage";
import type { NexoraMVPStageInteractionPresentation } from "./nexoraMVPObjectInteraction";

export const nexoraMVPExecutiveStage2DTopologyReadabilityIdentity =
  "NEX-MVP/STAGE-2D:4/ExecutiveStage2DTopologyReadabilityBridge" as const;

export const NEXORA_MVP_EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY = Object.freeze({
  ...EXECUTIVE_STAGE_2D_READABILITY_BOUNDARY,
  authorizesAnchoredPositions: true as const,
  overviewDefersToNetworkTopology: true as const,
});

function undirectedEdgeKey(sourceId: string, targetId: string): string {
  return sourceId < targetId
    ? `${sourceId}::${targetId}`
    : `${targetId}::${sourceId}`;
}

function collectCanonicalContextLinks(
  presentation: NexoraMVPStageInteractionPresentation,
) {
  const seen = new Set<string>();
  const links: Array<{
    readonly id: string;
    readonly objectId: string;
    readonly contextId: string;
  }> = [];
  const add = (id: string, objectId: string, contextId: string) => {
    if (!id || !objectId || !contextId || objectId === contextId) return;
    const key = undirectedEdgeKey(objectId, contextId);
    if (seen.has(key)) return;
    seen.add(key);
    links.push(
      Object.freeze({
        id,
        objectId,
        contextId,
      }),
    );
  };
  for (const connection of presentation.contextConnections ?? []) {
    add(connection.id, connection.sourceId, connection.targetId);
  }
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    add(link.id, link.objectId, link.contextId);
  }
  return Object.freeze(links);
}

function collectRelationships(
  presentation: NexoraMVPStageInteractionPresentation,
) {
  const seen = new Set<string>();
  const edges: Array<{
    readonly id: string;
    readonly sourceId: string;
    readonly targetId: string;
  }> = [];
  const add = (id: string, sourceId: string, targetId: string) => {
    if (!id || !sourceId || !targetId || sourceId === targetId) return;
    const key = undirectedEdgeKey(sourceId, targetId);
    if (seen.has(key)) return;
    seen.add(key);
    edges.push(
      Object.freeze({
        id,
        sourceId,
        targetId,
      }),
    );
  };

  for (const connection of presentation.scene.connections) {
    // Neighborhood truth is independent of visualRole. Hidden edges still
    // encode canonical 1-hop adjacency. Thread visual edges stay excluded.
    if (connection.visualRole === "context") continue;
    add(connection.id, connection.sourceId, connection.targetId);
  }

  for (const edge of NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES) {
    add(edge.id, edge.sourceId, edge.targetId);
  }

  // UX:2 — canonical object↔work links are relationship truth, not inference.
  // When a Problem / Scenario / Decision / Execution is the Stage anchor,
  // linked business Objects remain in the 1-hop neighborhood.
  for (const link of collectCanonicalContextLinks(presentation)) {
    add(link.id, link.objectId, link.contextId);
  }

  return Object.freeze(edges);
}

function collectSecondaryCandidates(
  presentation: NexoraMVPStageInteractionPresentation,
) {
  const fromContext = presentation.contextNodes
    .filter(
      (node) =>
        node.role !== "collapsed-thread" &&
        node.role !== "source-anchor",
    )
    .map((node) =>
      Object.freeze({
        id: node.id,
        kind: node.kind,
        opacity: node.opacity,
        focused: node.focused,
        attention:
          node.opacity >= 0.55
            ? "elevated"
            : node.opacity >= 0.35
              ? "normal"
              : "normal",
        priorityHint: node.opacity >= 0.5 ? 10 : 0,
      }),
    );
  // STAGE-THREAD:1 — projected executive-work Stage objects as secondary.
  const fromProjected = presentation.scene.objects
    .filter(
      (object) =>
        isExecutiveThreadWorkKind(object.kind) &&
        object.disclosureState !== "hidden",
    )
    .map((object) =>
      Object.freeze({
        id: object.id,
        kind: object.kind,
        opacity: object.opacity,
        focused: object.focused,
        attention: object.attention,
        priorityHint: 20,
      }),
    );
  const seen = new Set<string>();
  const merged = [];
  for (const candidate of [...fromProjected, ...fromContext]) {
    if (seen.has(candidate.id)) continue;
    seen.add(candidate.id);
    merged.push(candidate);
  }
  return Object.freeze(merged);
}

function roleForClass(
  classification: string | undefined,
): NexoraMVPStageObjectRole {
  if (classification === "anchor") return "focused";
  if (classification === "related") return "related";
  if (classification === "peripheral" || classification === "background") {
    return "peripheral";
  }
  return "unrelated";
}

function toWorldTuple(position: {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}): readonly [number, number, number] {
  const normalized = normalizeExecutiveStage2DPosition(position);
  return Object.freeze([
    normalized.x,
    normalized.y,
    EXECUTIVE_STAGE_2D_DEPTH,
  ] as const);
}

export function resolveStage2DAnchorObjectId(
  presentation: NexoraMVPStageInteractionPresentation,
): string | null {
  if (presentation.scene.mode !== "focus") return null;
  return (
    presentation.scene.focusedObjectId ??
    presentation.scene.selectedObjectId ??
    null
  );
}

export function resolveExecutiveStage2DTopologyReadabilityFromPresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): ExecutiveStage2DTopologyReadability {
  const anchorObjectId = resolveStage2DAnchorObjectId(presentation);
  const presentationState =
    presentation.scene.presentationState === "report" ||
    presentation.scene.presentationState === "operation"
      ? presentation.scene.presentationState
      : "minimum";
  const threadExpanded = presentation.threadExpansion?.expanded === true;

  return resolveExecutiveStage2DTopologyReadability({
    anchorObjectId,
    presentationState,
    // STAGE-THREAD:1 — while Thread is expanded, business peers recede so the
    // decision chain can occupy certified XY sectors around the anchor.
    maxRelated: threadExpanded ? 0 : undefined,
    maxSecondary: threadExpanded ? 4 : undefined,
    objects: presentation.scene.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        label: object.label,
        attention: object.attention,
        status: object.status,
        disclosureState: object.disclosureState,
        basePosition: Object.freeze({
          x: object.targetPosition[0],
          y: object.targetPosition[1],
          z: object.targetPosition[2],
        }),
      }),
    ),
    relationships: collectRelationships(presentation),
    contextLinks: collectCanonicalContextLinks(presentation),
    secondaryCandidates: collectSecondaryCandidates(presentation),
  });
}

/**
 * Apply STAGE-2D:4 readability (includes STAGE-2D:3 truth) when anchored.
 * Overview → passthrough with overview readability metadata.
 */
export function applyExecutiveStage2DTopologyReadabilityToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  const readability =
    resolveExecutiveStage2DTopologyReadabilityFromPresentation(presentation);

  if (readability.mode !== "anchored" || readability.anchorObjectId == null) {
    return Object.freeze({
      ...presentation,
      scene: Object.freeze({
        ...presentation.scene,
        stage2dRecomposition: readability,
        stage2dReadability: readability,
      }),
    });
  }

  const relatedSet = new Set(readability.relatedObjectIds);
  const backgroundSet = new Set(readability.backgroundObjectIds);
  const peripheralSet = new Set(
    readability.peripheralObjectIds ?? readability.backgroundObjectIds,
  );
  const hiddenSet = new Set(readability.hiddenObjectIds);
  const secondarySet = new Set(readability.secondaryObjectIds);
  const routeByConnectionId = new Map(
    readability.connectionRoutes.map((route) => [route.connectionId, route]),
  );

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const classification = readability.classifications[object.id];
      const resolved = readability.positions[object.id];
      const role = roleForClass(classification);
      const visualRole = mapNeighborhoodClassToVisualRole(classification);

      if (classification === "hidden" || hiddenSet.has(object.id)) {
        // Fade/recede in place — do not travel across the Stage.
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          focused: false,
          selected: false,
          opacity: 0,
          interactive: false,
          labelVisible: false,
          labelProminence: "minimal" as const,
          disclosureState: "hidden" as const,
        });
      }

      // STAGE-2D:6V-FIX — no unresolved layout slot ⇒ do not keep a ghost body.
      if (resolved == null) {
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          focused: false,
          selected: false,
          opacity: 0,
          interactive: false,
          labelVisible: false,
          labelProminence: "minimal" as const,
          disclosureState: "hidden" as const,
        });
      }

      const world = toWorldTuple(resolved);
      const isAnchor = object.id === readability.anchorObjectId;
      const isRelated = relatedSet.has(object.id);
      const isSecondary = secondarySet.has(object.id);
      const isThreadWork = isExecutiveThreadWorkKind(object.kind);
      const isPeripheral =
        peripheralSet.has(object.id) ||
        backgroundSet.has(object.id) ||
        visualRole === "peripheral";
      const budget = EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET;

      const opacity = isAnchor
        ? 1
        : isRelated || (isSecondary && isThreadWork)
          ? Math.max(object.opacity, budget.relatedBodyOpacityMin)
          : isSecondary
            ? Math.max(object.opacity, 0.72)
            : isPeripheral
              ? Math.min(
                  Math.max(object.opacity, budget.peripheralBodyOpacityMin),
                  budget.peripheralBodyOpacityMax,
                )
              : Math.min(object.opacity, budget.contextBodyOpacityMax);

      const labelVisible = enforceExecutiveStageNoOrphanLabel({
        bodyOpacity: opacity,
        labelVisible:
          isAnchor || isRelated || isPeripheral || isSecondary || isThreadWork,
        disclosureState: isAnchor
          ? "visible-primary"
          : isRelated || isSecondary || isThreadWork
            ? "visible-related"
            : isPeripheral
              ? "background-discoverable"
              : "hidden",
      });

      return Object.freeze({
        ...object,
        role: isSecondary || isThreadWork
          ? ("related" as const)
          : role,
        focused: isAnchor,
        selected: isAnchor || object.selected,
        targetPosition: world,
        overviewPosition: world,
        presentationPosition: Object.freeze({
          x: resolved.x,
          y: resolved.y,
        }),
        // Anchor readability via existing presentation controls only.
        scale: isAnchor
          ? Math.min(Math.max(object.scale, 0.92), 1.0)
          : isRelated || isThreadWork
            ? Math.min(Math.max(object.scale, 0.82), 0.92)
            : isSecondary
              ? Math.min(Math.max(object.scale, 0.78), 0.88)
              : isPeripheral
                ? Math.min(
                    Math.max(object.scale, budget.peripheralScaleMin),
                    budget.peripheralScaleMax,
                  )
                : Math.min(object.scale, 0.62),
        opacity,
        labelVisible,
        labelProminence: isAnchor
          ? ("full" as const)
          : isRelated || isThreadWork || isSecondary
            ? ("full" as const)
            : isPeripheral
              ? ("minimal" as const)
              : ("minimal" as const),
        disclosureState: isAnchor
          ? ("visible-primary" as const)
          : isRelated || isSecondary || isThreadWork
            ? ("visible-related" as const)
            : isPeripheral
              ? ("background-discoverable" as const)
              : ("hidden" as const),
        interactive: true,
      });
    }),
  );

  const visibleBusinessIds = new Set(
    objects
      .filter((object) => object.disclosureState !== "hidden")
      .map((object) => object.id),
  );

  const connections = Object.freeze(
    presentation.scene.connections.map((connection) => {
      const sourceVisible = visibleBusinessIds.has(connection.sourceId);
      const targetVisible = visibleBusinessIds.has(connection.targetId);
      if (!sourceVisible || !targetVisible) {
        return Object.freeze({
          ...connection,
          visualRole: "hidden" as const,
          opacity: 0,
          emphasized: false,
          routeKind: undefined,
          routePoints: undefined,
        });
      }
      const route = routeByConnectionId.get(connection.id);
      const touchesAnchor =
        connection.sourceId === readability.anchorObjectId ||
        connection.targetId === readability.anchorObjectId;
      const bothRelatedOrAnchor =
        (relatedSet.has(connection.sourceId) ||
          connection.sourceId === readability.anchorObjectId) &&
        (relatedSet.has(connection.targetId) ||
          connection.targetId === readability.anchorObjectId);
      if (touchesAnchor && bothRelatedOrAnchor) {
        const points =
          route?.points.map(
            (point) =>
              Object.freeze([point.x, point.y, EXECUTIVE_STAGE_2D_DEPTH] as const),
          ) ?? undefined;
        return Object.freeze({
          ...connection,
          visualRole: "anchor-incident" as const,
          opacity: Math.min(
            Math.max(connection.opacity, 0.28),
            isExecutiveObjectPresenceV2Enabled()
              ? Math.min(
                  EXECUTIVE_OBJECT_PRESENCE_CONNECTION.anchorIncidentOpacityCap,
                  EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.primaryOpacityCap,
                )
              : 0.55,
          ),
          emphasized: true,
          lineWidth: Math.min(
            Math.max(connection.lineWidth ?? 1.2, 0.95),
            isExecutiveObjectPresenceV2Enabled()
              ? Math.min(
                  EXECUTIVE_OBJECT_PRESENCE_CONNECTION.anchorIncidentLineWidthCap,
                  EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.primaryLineWidthCap,
                )
              : 1.35,
          ),
          routeKind: route?.routeKind ?? ("straight" as const),
          routePoints: points ? Object.freeze(points) : undefined,
        });
      }
      // STAGE-OBJ:3 — related-peer edges are secondary (restrained), not hidden.
      if (bothRelatedOrAnchor && !touchesAnchor) {
        return Object.freeze({
          ...connection,
          visualRole: "context" as const,
          opacity: Math.min(
            connection.opacity,
            EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.secondaryOpacityCap,
          ),
          emphasized: false,
          lineWidth: Math.min(
            connection.lineWidth ?? 0.9,
            EXECUTIVE_STAGE_RELATIONSHIP_VISUAL_ROLE.secondaryLineWidthCap,
          ),
          routeKind: route?.routeKind ?? ("straight" as const),
          routePoints: route?.points
            ? Object.freeze(
                route.points.map(
                  (point) =>
                    Object.freeze([
                      point.x,
                      point.y,
                      EXECUTIVE_STAGE_2D_DEPTH,
                    ] as const),
                ),
              )
            : undefined,
        });
      }
      return Object.freeze({
        ...connection,
        visualRole: "hidden" as const,
        opacity: 0,
        emphasized: false,
        lineWidth: Math.min(
          connection.lineWidth ?? 0.9,
          isExecutiveObjectPresenceV2Enabled()
            ? EXECUTIVE_OBJECT_PRESENCE_CONNECTION.backgroundLineWidthCap
            : 0.85,
        ),
        routeKind: undefined,
        routePoints: undefined,
      });
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes.map((node) => {
      if (node.role === "collapsed-thread") {
        // STAGE-THREAD:1-FIX — preserve discoverable gateway footprint/placement.
        // Do not shrink to legacy subordinate metadata opacity/scale.
        const occupiedCenters = objects
          .filter(
            (object) =>
              object.disclosureState !== "hidden" && object.opacity > 0.05,
          )
          .map((object) => {
            const classification =
              readability.classifications[object.id] ?? "related";
            const half =
              classification === "anchor"
                ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.anchor
                : classification === "related"
                  ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.related
                  : EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.secondary;
            return Object.freeze({
              x: object.targetPosition[0],
              y: object.targetPosition[1],
              halfWidth: half,
              halfHeight: half,
              halfExtent: half,
            });
          });
        const gateway = resolveExecutiveThreadGatewayPosition({
          mode: node.gatewayMode === "quiet-collapse"
            ? "quiet-collapse"
            : "discoverable-collapsed",
          occupiedCenters,
          minGap: EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minVisualGap,
        });
        const isQuiet = node.gatewayMode === "quiet-collapse";
        return Object.freeze({
          ...node,
          targetPosition: Object.freeze([
            gateway.x,
            gateway.y,
            0,
          ] as const),
          opacity: isQuiet
            ? Math.min(Math.max(node.opacity, 0.55), 0.72)
            : Math.max(node.opacity, 0.92),
          scale: isQuiet
            ? Math.min(Math.max(node.scale, 0.8), 0.9)
            : Math.max(node.scale, 1),
          interactive: true,
          focused: false,
          labelVisible: true,
        });
      }
      if (!secondarySet.has(node.id)) {
        return Object.freeze({
          ...node,
          opacity: 0,
          interactive: false,
          focused: false,
        });
      }
      const resolved = readability.positions[node.id];
      if (resolved == null) return node;
      const world = toWorldTuple(resolved);
      return Object.freeze({
        ...node,
        targetPosition: world,
        opacity: Math.max(node.opacity, 0.52),
        scale: Math.min(node.scale, 0.78),
        interactive: true,
        focused: false,
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    focusedSubjectId: readability.anchorObjectId,
    emphasizedObjectIds: Object.freeze([
      readability.anchorObjectId,
      ...readability.relatedObjectIds,
    ]),
    subordinateObjectIds: Object.freeze([
      ...(readability.peripheralObjectIds ?? readability.backgroundObjectIds),
      ...readability.hiddenObjectIds,
    ]),
    contextNodes,
    scene: Object.freeze({
      ...presentation.scene,
      mode: "focus" as const,
      focusedObjectId: readability.anchorObjectId,
      selectedObjectId:
        presentation.scene.selectedObjectId ?? readability.anchorObjectId,
      objects,
      connections,
      stage2dRecomposition: readability,
      stage2dReadability: readability,
      topologyKind: "stage-2d-recomposition" as const,
    }),
  });
}

export function getNexoraMVPExecutiveStage2DReadabilityObservability(
  presentation: NexoraMVPStageInteractionPresentation,
): Readonly<{
  readonly identity: string;
  readonly topologyMode: string;
  readonly anchorObjectId: string;
  readonly anchorPosition: string;
  readonly neighborhoodDepth: string;
  readonly relatedVisible: string;
  readonly secondaryVisible: string;
  readonly hiddenCount: string;
  readonly secondaryOverflow: string;
  readonly routingMode: string;
  readonly contract: string;
  readonly layoutStatus: string;
  readonly layoutOverlapCount: string;
  readonly layoutMinGap: string;
  readonly sectorCompression: string;
  readonly sectorBreathingAdjustedCount: string;
}> {
  const identity = getExecutiveStage2DTopologyReadabilityIdentity();
  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: ExecutiveStage2DTopologyReadability;
      readonly stage2dRecomposition?: ExecutiveStage2DTopologyReadability;
    }
  ).stage2dReadability ??
    (
      presentation.scene as {
        readonly stage2dRecomposition?: ExecutiveStage2DTopologyReadability;
      }
    ).stage2dRecomposition;

  const mode =
    readability?.mode === "anchored"
      ? EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY.anchoredMode
      : EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY.overviewMode;

  return Object.freeze({
    identity: identity.id,
    topologyMode: mode,
    anchorObjectId: readability?.anchorObjectId ?? "none",
    anchorPosition: readability?.mode === "anchored" ? "0,0,0" : "none",
    neighborhoodDepth: mode === "anchored" ? "1" : "none",
    relatedVisible: String(readability?.relatedVisibleCount ?? 0),
    secondaryVisible: String(readability?.secondaryVisibleCount ?? 0),
    hiddenCount: String(readability?.hiddenCount ?? 0),
    secondaryOverflow: String(readability?.secondaryOverflowCount ?? 0),
    routingMode: EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY.routingMode,
    contract: EXECUTIVE_STAGE_2D_READABILITY_OBSERVABILITY.contract,
    layoutStatus: readability?.layoutStatus ?? "none",
    layoutOverlapCount: String(readability?.layoutOverlapCount ?? 0),
    layoutMinGap: String(
      readability?.layoutMinGap ?? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minVisualGap,
    ),
    sectorCompression: String(readability?.sectorCompression ?? 0),
    sectorBreathingAdjustedCount: String(
      readability?.sectorBreathingAdjustedCount ?? 0,
    ),
  });
}
