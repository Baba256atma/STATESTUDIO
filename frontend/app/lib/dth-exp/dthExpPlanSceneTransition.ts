/**
 * NPA-T DTH-EXP:5B — plan semantic transitions between two 5A spatial projections.
 * One shared engine. No playback, interpolation, or live Stage wiring.
 */

import type { DthExpTheatreActor, DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type { DthExpSpatialActorLayout, DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import {
  DTH_EXP_SCENE_TRANSITION_ENGINE,
  dthExpSceneTransitionIdentity,
  dthExpSceneTransitionVersion,
} from "./dthExpSceneTransitionIdentity.ts";
import {
  DTH_EXP_TIMING_CATEGORIES,
  DTH_EXP_TRANSITION_SEQUENCE,
  type DthExpActorTransition,
  type DthExpActorTransitionClass,
  type DthExpEvidenceTransition,
  type DthExpMotionOperation,
  type DthExpRelationshipTransition,
  type DthExpSceneTransitionInput,
  type DthExpSceneTransitionPlan,
  type DthExpTransitionReason,
} from "./dthExpSceneTransitionContract.ts";

const EMPHASIS_RANK = Object.freeze({ none: 0, low: 1, medium: 2, high: 3 });
const DISCLOSURE_RANK = Object.freeze({
  hidden: 0,
  collapsed: 1,
  "de-emphasized": 2,
  contextual: 3,
  visible: 4,
});

function sortIds(ids: readonly string[]): readonly string[] {
  return Object.freeze([...ids].sort((left, right) => left.localeCompare(right)));
}

function byCanonical(actors: readonly DthExpSpatialActorLayout[]): Map<string, DthExpSpatialActorLayout> {
  return new Map(actors.map((item) => [item.canonicalObjectId, item]));
}

function sceneRole(scene: DthExpTheatreScene | null | undefined, id: string): DthExpTheatreActor | null {
  return scene?.actors.find((item) => item.canonicalObjectId === id) ?? null;
}

function visualRole(scene: DthExpTheatreScene | null | undefined, id: string): DthExpVisualRole | null {
  return sceneRole(scene, id)?.visualRole ?? null;
}

function moved(from: DthExpSpatialActorLayout | undefined, to: DthExpSpatialActorLayout | undefined): boolean {
  if (!from || !to) return false;
  return from.position.x !== to.position.x || from.position.y !== to.position.y;
}

function managementReason(source: DthExpSpatialLayoutProjection, target: DthExpSpatialLayoutProjection): DthExpTransitionReason {
  if (source.family === target.family) return "same-family-focus-change";
  if (target.family === "NEXO_TIME") return "time-progression";
  if (target.family === "NEXO_EXECUTION") return "execution-state-presentation";
  if (target.family === "NEXO_OUTCOME") return "outcome-comparison-presentation";
  return "perspective-change";
}

function classifyPersistent(from: DthExpSpatialActorLayout, to: DthExpSpatialActorLayout, targetFocal: string | null): DthExpActorTransitionClass {
  const promoted =
    (to.canonicalObjectId === targetFocal && from.canonicalObjectId !== targetFocal) ||
    EMPHASIS_RANK[to.emphasis] > EMPHASIS_RANK[from.emphasis] ||
    DISCLOSURE_RANK[to.disclosure] > DISCLOSURE_RANK[from.disclosure] ||
    to.distanceFromFocal + 0.02 < from.distanceFromFocal;
  const reduced =
    EMPHASIS_RANK[to.emphasis] < EMPHASIS_RANK[from.emphasis] ||
    DISCLOSURE_RANK[to.disclosure] < DISCLOSURE_RANK[from.disclosure] ||
    to.disclosure === "collapsed" && from.disclosure !== "collapsed";
  if (promoted) return "context-promoted";
  if (reduced) return "context-reduced";
  return "persistent";
}

function operationsFor(
  classification: DthExpActorTransitionClass,
  from: DthExpSpatialActorLayout | undefined,
  to: DthExpSpatialActorLayout | undefined,
  fromRole: DthExpVisualRole | null,
  toRole: DthExpVisualRole | null,
): readonly DthExpMotionOperation[] {
  if (classification === "entering") return Object.freeze(["enter"]);
  if (classification === "exiting") return Object.freeze(["exit"]);
  const ops: DthExpMotionOperation[] = [];
  if (moved(from, to)) ops.push("reposition");
  if (from && to && from.grouping !== to.grouping) ops.push("regroup");
  if (fromRole !== toRole) ops.push("role-transform");
  if (from && to && from.disclosure === "collapsed" && to.disclosure === "visible") ops.push("expand");
  if (classification === "context-promoted") ops.push("promote");
  if (classification === "context-reduced") ops.push("de-emphasize");
  return Object.freeze(ops.length > 0 ? ops : ["reposition"]);
}

function reasonsFor(
  classification: DthExpActorTransitionClass,
  management: DthExpTransitionReason,
  to: DthExpSpatialActorLayout | undefined,
  targetFocal: string | null,
): readonly DthExpTransitionReason[] {
  const reasons: DthExpTransitionReason[] = [management];
  if (classification === "entering") reasons.push("newly-relevant");
  if (classification === "exiting") reasons.push("no-longer-required");
  if (to?.canonicalObjectId === targetFocal) reasons.push("became-focal");
  if (classification === "context-reduced") reasons.push("became-supporting-context");
  return Object.freeze(sortIds(reasons) as readonly DthExpTransitionReason[]);
}

export function planDthExpSceneTransition(input: DthExpSceneTransitionInput): DthExpSceneTransitionPlan {
  const source = input.source;
  const target = input.target;
  const sourceMap = byCanonical(source.actors);
  const targetMap = byCanonical(target.actors);
  const ids = sortIds([...new Set([...sourceMap.keys(), ...targetMap.keys()])]);
  const management = managementReason(source, target);
  const targetFocal = target.focalCanonicalObjectId;

  const actors: DthExpActorTransition[] = ids.map((id) => {
    const from = sourceMap.get(id);
    const to = targetMap.get(id);
    const classification: DthExpActorTransitionClass =
      from && to ? classifyPersistent(from, to, targetFocal) : to ? "entering" : "exiting";
    const disclosure = to?.disclosure ?? from?.disclosure ?? "hidden";
    const bounded = disclosure === "hidden" || disclosure === "collapsed";
    const fromRole = visualRole(input.sourceScene, id);
    const toRole = visualRole(input.targetScene, id);
    return Object.freeze({
      canonicalObjectId: id,
      actorId: to?.actorId ?? from?.actorId ?? id,
      classification,
      operations: operationsFor(classification, from, to, fromRole, toRole),
      reasons: reasonsFor(classification, management, to, targetFocal),
      fromLane: from?.lane ?? null,
      toLane: to?.lane ?? null,
      fromVisualRole: fromRole,
      toVisualRole: toRole,
      createsBusinessObject: false as const,
      deletesBusinessObject: false as const,
      presentationOnly: true as const,
      boundedTreatment: bounded,
      skipDetailedMotion: bounded && classification !== "context-promoted",
    });
  });

  const sourceRel = new Map(source.relationshipPaths.map((item) => [item.relationshipId, item]));
  const targetRel = new Map(target.relationshipPaths.map((item) => [item.relationshipId, item]));
  const relationships: DthExpRelationshipTransition[] = sortIds([...new Set([...sourceRel.keys(), ...targetRel.keys()])]).map(
    (id) => {
      const next = targetRel.get(id);
      const prev = sourceRel.get(id);
      const chosen = next ?? prev!;
      return Object.freeze({
        relationshipId: id,
        classification: next && prev ? "persistent" : next ? "entering" : "exiting",
        semanticRelation: chosen.semanticRelation,
        sourceAuthority: chosen.sourceAuthority,
        impliesCausality: false as const,
        upgradesAssociationToCause: false as const,
      });
    },
  );

  const sourceEv = new Map(source.evidenceHints.map((item) => [item.evidenceRef, item]));
  const targetEv = new Map(target.evidenceHints.map((item) => [item.evidenceRef, item]));
  const evidence: DthExpEvidenceTransition[] = sortIds([...new Set([...sourceEv.keys(), ...targetEv.keys()])]).map((ref) => {
    const next = targetEv.get(ref);
    const prev = sourceEv.get(ref);
    const chosen = next ?? prev!;
    const classification: DthExpEvidenceTransition["classification"] =
      next && prev ? (prev.placement === "collapsed-cluster" && next.placement !== "collapsed-cluster" ? "revealed" : "persistent") : next ? "entering" : "exiting";
    return Object.freeze({
      evidenceRef: ref,
      authority: "CC:8" as const,
      classification,
      attachedToId: chosen.attachedToId,
      increasesCertainty: false as const,
      copiesEvidence: false as const,
    });
  });

  const reducedMotion = Object.freeze({
    appliesTargetProjectionDirectly: true as const,
    movement: false as const,
    managementMeaningPreserved: true as const,
    becameFocal:
      targetFocal ??
      target.actors.find((item) => item.emphasis === "high")?.canonicalObjectId ??
      null,
    becameSecondary: sortIds(actors.filter((item) => item.classification === "context-reduced").map((item) => item.canonicalObjectId)),
    entered: sortIds(actors.filter((item) => item.classification === "entering").map((item) => item.canonicalObjectId)),
    leftVisiblePerspective: sortIds(actors.filter((item) => item.classification === "exiting").map((item) => item.canonicalObjectId)),
    roleChanged: sortIds(
      actors.filter((item) => item.operations.includes("role-transform")).map((item) => item.canonicalObjectId),
    ),
    relationshipsBecameRelevant: sortIds(
      relationships.filter((item) => item.classification === "entering").map((item) => item.relationshipId),
    ),
    evidenceBecameRelevant: sortIds(
      evidence.filter((item) => item.classification === "entering" || item.classification === "revealed").map((item) => item.evidenceRef),
    ),
  });

  return Object.freeze({
    identity: dthExpSceneTransitionIdentity,
    version: dthExpSceneTransitionVersion,
    engine: DTH_EXP_SCENE_TRANSITION_ENGINE,
    planId: `dth-exp:5b:${source.sceneRef}:${target.sceneRef}:${source.family}:${target.family}`,
    sourceFamily: source.family,
    targetFamily: target.family,
    sourceSceneRef: source.sceneRef,
    targetSceneRef: target.sceneRef,
    managementTransitionReason: management,
    sequence: DTH_EXP_TRANSITION_SEQUENCE,
    timingCategories: DTH_EXP_TIMING_CATEGORIES,
    actors: Object.freeze(actors),
    relationships: Object.freeze(relationships),
    evidence: Object.freeze(evidence),
    reducedMotion,
    replacement: Object.freeze({
      policy: "latest-valid-target-supersedes-incomplete-plan" as const,
      supersedesPlanId: input.supersededPlanId ?? null,
      obsoletePlanMustNotOverride: Object.freeze([
        "new-subject",
        "new-director-selection",
        "new-scene-composition",
        "new-canonical-truth",
      ] as const),
    }),
    animationPlayback: false,
    liveStageWiring: false,
    interpolatesPixels: false,
    mutatesTheatreScene: false,
    mutatesCanonicalObjects: false,
    proximityImpliesCausality: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    writesExecution: false,
    writesOutcome: false,
    assignsVaiRoles: false,
  });
}
