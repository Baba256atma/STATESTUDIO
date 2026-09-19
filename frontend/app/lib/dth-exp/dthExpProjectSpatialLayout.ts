/**
 * NPA-T DTH-EXP:5A — shared deterministic spatial grammar projector.
 * One engine for all nine Nexo families. Does not mutate the Theatre Scene.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreActor, DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import { DTH_EXP_SPATIAL_LAYOUT_ENGINE, dthExpSpatialLayoutIdentity, dthExpSpatialLayoutVersion } from "./dthExpSpatialLayoutIdentity.ts";
import {
  DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
  DTH_EXP_NORMALIZED_STAGE_SPACE,
  type DthExpNormalizedPoint,
  type DthExpSpatialActorLayout,
  type DthExpSpatialDensity,
  type DthExpSpatialDepth,
  type DthExpSpatialDisclosureState,
  type DthExpSpatialEvidenceHint,
  type DthExpSpatialLayoutInput,
  type DthExpSpatialLayoutProjection,
  type DthExpSpatialRelationshipPath,
  type DthExpSpatialSizeReason,
} from "./dthExpSpatialLayoutContract.ts";

function clamp(value: number): number {
  return Math.min(DTH_EXP_NORMALIZED_STAGE_SPACE.xMax, Math.max(DTH_EXP_NORMALIZED_STAGE_SPACE.xMin, value));
}

function point(x: number, y: number): DthExpNormalizedPoint {
  return Object.freeze({ x: clamp(x), y: clamp(y) });
}

function distance(a: DthExpNormalizedPoint, b: DthExpNormalizedPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function densityOf(count: number): DthExpSpatialDensity {
  if (count <= 4) return "sparse";
  if (count <= 8) return "normal";
  return "dense";
}

function laneFor(family: DthExpNexoRecipeFamily, actor: DthExpTheatreActor): string {
  const grouping = actor.presentation.grouping ?? "context";
  if (family === "NEXO_FLOW") {
    if (grouping === "upstream") return "upstream";
    if (grouping === "downstream") return "downstream";
    return "focal";
  }
  if (family === "NEXO_TIME") {
    if (grouping === "historical") return "past";
    if (grouping === "future" || grouping === "planned") return "future";
    return "now";
  }
  if (family === "NEXO_EXECUTION") {
    if (grouping === "planned") return "planned";
    if (grouping === "blocked") return "blocked";
    if (grouping === "completed") return "completed";
    return "active";
  }
  if (family === "NEXO_OUTCOME") {
    if (grouping === "planned") return "goal";
    return "observed";
  }
  if (family === "NEXO_CAUSE") return grouping === "causes" ? "candidates" : "focal-condition";
  if (family === "NEXO_IMPACT") return grouping === "impacts" && actor.attention !== "focal" ? "variables" : "outcome";
  if (family === "NEXO_RISK") return actor.canonicalObjectKind === "risk" ? "risks" : "subject";
  if (family === "NEXO_BARS") return "baseline";
  if (family === "NEXO_BUBBLE") return "portfolio-field";
  return grouping;
}

function xForLane(
  family: DthExpNexoRecipeFamily,
  lane: string,
  index: number,
  count: number,
  actor: DthExpTheatreActor,
  input: DthExpSpatialLayoutInput,
  focalId: string | null,
): number {
  const spread = count <= 1 ? 0.5 : 0.22 + (index / Math.max(1, count - 1)) * 0.56;
  if (family === "NEXO_FLOW") {
    const forward = input.scene.relationships.map((item) => ({ from: item.fromCanonicalObjectId, to: item.toCanonicalObjectId }));
    const reverse = input.scene.relationships.map((item) => ({ from: item.toCanonicalObjectId, to: item.fromCanonicalObjectId }));
    if (lane === "upstream" && focalId) return clamp(0.5 - 0.16 * Math.max(1, hopDistance(focalId, actor.canonicalObjectId, reverse)));
    if (lane === "downstream" && focalId) return clamp(0.5 + 0.16 * Math.max(1, hopDistance(focalId, actor.canonicalObjectId, forward)));
    return 0.5;
  }
  if (family === "NEXO_TIME") {
    if (lane === "past") return 0.18;
    if (lane === "future") return 0.82;
    return 0.5;
  }
  if (family === "NEXO_EXECUTION") {
    if (lane === "planned") return 0.18;
    if (lane === "blocked") return 0.62;
    if (lane === "completed") return 0.84;
    return 0.42;
  }
  if (family === "NEXO_OUTCOME") return lane === "goal" ? 0.28 : 0.72;
  if (family === "NEXO_CAUSE") return lane === "candidates" ? 0.22 : 0.62;
  if (family === "NEXO_IMPACT") return lane === "variables" ? 0.22 : 0.72;
  if (family === "NEXO_RISK") return lane === "risks" ? 0.72 : 0.38;
  if (family === "NEXO_BARS") return spread;
  if (family === "NEXO_BUBBLE") {
    const bound = input.bubbleXByCanonicalObjectId?.[actor.canonicalObjectId];
    return bound == null ? spread : 0.15 + clamp(bound) * 0.7;
  }
  return spread;
}

function yForLane(family: DthExpNexoRecipeFamily, lane: string, index: number, actor: DthExpTheatreActor, input: DthExpSpatialLayoutInput): number {
  if (family === "NEXO_FLOW") return 0.5;
  if (family === "NEXO_BARS") return 0.22;
  if (family === "NEXO_TIME") return 0.5;
  if (family === "NEXO_EXECUTION") return lane === "blocked" ? 0.68 : 0.5;
  if (family === "NEXO_OUTCOME") return 0.5;
  if (family === "NEXO_CAUSE") return lane === "candidates" ? 0.32 + index * 0.16 : 0.5;
  if (family === "NEXO_IMPACT") return lane === "variables" ? 0.35 + index * 0.15 : 0.5;
  if (family === "NEXO_RISK") return lane === "risks" ? 0.62 : 0.42;
  if (family === "NEXO_BUBBLE") {
    const bound = input.bubbleYByCanonicalObjectId?.[actor.canonicalObjectId];
    return bound == null ? 0.35 + (index % 3) * 0.18 : 0.15 + clamp(bound) * 0.7;
  }
  return 0.5;
}

function hopDistance(
  startId: string,
  goalId: string,
  edges: readonly { readonly from: string; readonly to: string }[],
): number {
  if (startId === goalId) return 0;
  const queue = [startId];
  const seen = new Set([startId]);
  let hops = 0;
  while (queue.length > 0) {
    hops += 1;
    const count = queue.length;
    for (let i = 0; i < count; i += 1) {
      const current = queue.shift()!;
      for (const edge of edges) {
        if (edge.from !== current) continue;
        if (edge.to === goalId) return hops;
        if (!seen.has(edge.to)) {
          seen.add(edge.to);
          queue.push(edge.to);
        }
      }
    }
  }
  return 0;
}

function neighborsOf(id: string, scene: DthExpTheatreScene): Set<string> {
  const ids = new Set<string>([id]);
  for (const rel of scene.relationships) {
    if (rel.fromCanonicalObjectId === id) ids.add(rel.toCanonicalObjectId);
    if (rel.toCanonicalObjectId === id) ids.add(rel.fromCanonicalObjectId);
  }
  return ids;
}

function disclosureFor(
  actor: DthExpTheatreActor,
  collapsed: boolean,
  dense: boolean,
): DthExpSpatialDisclosureState {
  if (actor.attention === "hidden") return "hidden";
  if (collapsed || actor.attention === "collapsed") return "collapsed";
  if (actor.attention === "de-emphasized" || (dense && actor.attention === "contextual")) return "de-emphasized";
  if (actor.attention === "focal" || actor.attention === "emphasized") return "visible";
  return "contextual";
}

function depthFor(disclosure: DthExpSpatialDisclosureState, attention: DthExpTheatreActor["attention"]): DthExpSpatialDepth {
  if (attention === "focal") return "foreground";
  if (disclosure === "collapsed" || disclosure === "hidden" || disclosure === "de-emphasized") return "background";
  return "middle";
}

function sizeFor(
  actor: DthExpTheatreActor,
  collapsed: boolean,
  magnitude: number | undefined,
): { readonly size: { readonly width: number; readonly height: number }; readonly reason: DthExpSpatialSizeReason } {
  if (collapsed) {
    return { size: Object.freeze({ width: 0.04, height: 0.04 }), reason: "collapsed-distant-context" };
  }
  if (magnitude != null) {
    const scaled = 0.06 + clamp(magnitude) * 0.1;
    return { size: Object.freeze({ width: scaled, height: scaled }), reason: "authoritative-magnitude" };
  }
  if (actor.attention === "focal") {
    return { size: Object.freeze({ width: 0.14, height: 0.14 }), reason: "focal-attention" };
  }
  if (actor.visualRole === "bar") {
    return { size: Object.freeze({ width: 0.08, height: 0.22 }), reason: "equal-comparison-slot" };
  }
  return { size: Object.freeze({ width: 0.08, height: 0.08 }), reason: "supporting-context" };
}

function pathKind(semanticRelation: string | null): DthExpSpatialRelationshipPath["presentationKind"] {
  const value = (semanticRelation ?? "").toLowerCase();
  if (value === "candidate" || value === "associated" || value === "related") return "candidate";
  if (value === "feeds" || value === "produces" || value === "serves") return "directional";
  if (!value) return "undirected";
  return "contextual";
}

function sorted(actors: readonly DthExpTheatreActor[]): readonly DthExpTheatreActor[] {
  return [...actors].sort((left, right) => left.canonicalObjectId.localeCompare(right.canonicalObjectId));
}

export function projectDthExpSpatialLayout(input: DthExpSpatialLayoutInput): DthExpSpatialLayoutProjection {
  const scene = input.scene;
  const family = input.family;
  const actors = sorted(scene.actors);
  const density = densityOf(actors.length);
  const focalId =
    scene.focalCanonicalObjectIds[0] ??
    actors.find((item) => item.attention === "focal")?.canonicalObjectId ??
    null;
  const bottleneck = input.bottleneckFocusCanonicalObjectId ?? null;
  const neighborIds = bottleneck ? neighborsOf(bottleneck, scene) : null;

  const byLane = new Map<string, DthExpTheatreActor[]>();
  for (const actor of actors) {
    const lane = laneFor(family, actor);
    const list = byLane.get(lane) ?? [];
    list.push(actor);
    byLane.set(lane, list);
  }

  const laid: DthExpSpatialActorLayout[] = [];
  for (const [lane, members] of [...byLane.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    members.forEach((actor, index) => {
      const collapsed =
        neighborIds != null &&
        !neighborIds.has(actor.canonicalObjectId) &&
        actor.canonicalObjectId !== bottleneck;
      const position = point(
        xForLane(family, lane, index, members.length, actor, input, focalId),
        yForLane(family, lane, index, actor, input),
      );
      const sized = sizeFor(actor, collapsed, input.magnitudeByCanonicalObjectId?.[actor.canonicalObjectId]);
      const disclosure = disclosureFor(actor, collapsed, density === "dense");
      const emphasis =
        actor.attention === "focal" ? "high" : actor.attention === "emphasized" ? "medium" : collapsed ? "none" : "low";
      laid.push(
        Object.freeze({
          actorId: actor.actorId,
          canonicalObjectId: actor.canonicalObjectId,
          engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
          lane,
          region: lane,
          order: index,
          position,
          size: sized.size,
          sizeReason: sized.reason,
          depth: depthFor(disclosure, actor.attention),
          emphasis,
          disclosure,
          grouping: actor.presentation.grouping,
          distanceFromFocal: 0,
          proximityImpliesCausality: false,
          layoutReason: collapsed
            ? "distant-context-collapsed-for-bottleneck-focus"
            : `shared-grammar:${family}:${lane}`,
          animationTarget: Object.freeze({
            position,
            size: sized.size,
            emphasis,
            disclosure,
            grouping: actor.presentation.grouping,
            interpolationImplemented: false as const,
            durationMs: null,
            easing: null,
          }),
        }),
      );
    });
  }

  const byCanonical = new Map(laid.map((item) => [item.canonicalObjectId, item]));
  const focalPoint = (focalId && byCanonical.get(focalId)?.position) || DTH_EXP_NORMALIZED_STAGE_SPACE.focalZone;
  const actorsWithDistance = Object.freeze(
    laid.map((item) =>
      Object.freeze({
        ...item,
        distanceFromFocal: distance(item.position, point(focalPoint.x, focalPoint.y)),
      }),
    ),
  );

  const relationshipPaths = Object.freeze(
    scene.relationships.map((rel) => {
      const from = byCanonical.get(rel.fromCanonicalObjectId)?.position ?? point(0.5, 0.5);
      const to = byCanonical.get(rel.toCanonicalObjectId)?.position ?? point(0.5, 0.5);
      return Object.freeze({
        relationshipId: rel.relationshipId,
        fromCanonicalObjectId: rel.fromCanonicalObjectId,
        toCanonicalObjectId: rel.toCanonicalObjectId,
        fromPosition: from,
        toPosition: to,
        presentationKind: pathKind(rel.semanticRelation),
        semanticRelation: rel.semanticRelation,
        sourceAuthority: rel.sourceAuthority,
        sourceRef: rel.sourceRef,
        impliesCausality: false as const,
        upgradesAssociationToCause: false as const,
      });
    }),
  );

  const evidenceByTarget = new Map<string, number>();
  const evidenceHints: DthExpSpatialEvidenceHint[] = scene.evidenceAttachments.map((item) => {
    const key = `${item.attachedToKind}:${item.attachedToId}`;
    const count = (evidenceByTarget.get(key) ?? 0) + 1;
    evidenceByTarget.set(key, count);
    let position = point(focalPoint.x, focalPoint.y - 0.12);
    let placement: DthExpSpatialEvidenceHint["placement"] = "attach-to-focal-investigation";
    if (item.attachedToKind === "object") {
      const host = byCanonical.get(item.attachedToId);
      position = point((host?.position.x ?? focalPoint.x) + 0.05, (host?.position.y ?? focalPoint.y) - 0.08);
      placement = count > 1 ? "collapsed-cluster" : "attach-to-actor";
    } else if (item.attachedToKind === "relationship") {
      const path = relationshipPaths.find((rel) => rel.relationshipId === item.attachedToId);
      position = point(
        ((path?.fromPosition.x ?? focalPoint.x) + (path?.toPosition.x ?? focalPoint.x)) / 2,
        ((path?.fromPosition.y ?? focalPoint.y) + (path?.toPosition.y ?? focalPoint.y)) / 2 + 0.06,
      );
      placement = "attach-to-relationship";
    }
    return Object.freeze({
      evidenceRef: item.evidenceRef,
      authority: "CC:8" as const,
      attachedToKind: item.attachedToKind,
      attachedToId: item.attachedToId,
      position,
      placement,
      copiesEvidence: false as const,
    });
  });

  return Object.freeze({
    identity: dthExpSpatialLayoutIdentity,
    version: dthExpSpatialLayoutVersion,
    engine: DTH_EXP_SPATIAL_LAYOUT_ENGINE,
    family,
    coordinateSpace: DTH_EXP_NORMALIZED_STAGE_SPACE,
    sceneRef: scene.sceneId,
    focalCanonicalObjectId: focalId,
    density,
    actors: actorsWithDistance,
    relationshipPaths,
    evidenceHints: Object.freeze(evidenceHints),
    futureTransitionSemantics: DTH_EXP_FUTURE_TRANSITION_SEMANTICS,
    animationEngine: false,
    interpolationImplemented: false,
    liveStageWiring: false,
    mutatesTheatreScene: false,
    mutatesCanonicalObjects: false,
    proximityImpliesCausality: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    declaresOutcomeSuccess: false,
    layoutProvenance: "DTH-EXP:5A/SharedSpatialGrammar",
  });
}
