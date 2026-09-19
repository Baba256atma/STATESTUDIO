/**
 * NPA-T DTH-EXP:5B — one shared semantic transition planner. No playback, no second Stage.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";

export const DTH_EXP_SCENE_TRANSITION_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:5B/SceneTransitionBoundary" as const,
  engine: "DTH-EXP:5B/SharedSemanticTransition",
  spatialLayout: "DTH-EXP:5A",
  director: nexoraSemanticPresentationDirectorIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  evidence: "CC:8",
  vai: "VAI:1–8",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parallelAnimationEnginePerFamily: false as const,
  parallelStage: false as const,
  parallelDirector: false as const,
  animationPlayback: false as const,
  liveStageWiring: false as const,
  interpolatesPixels: false as const,
  mutatesTheatreScene: false as const,
  mutatesCanonicalObjects: false as const,
  proximityImpliesCausality: false as const,
  upgradesRelationshipSemantics: false as const,
  calculatesRisk: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  parallelTimelineAuthority: false as const,
  bottleneckFamily: false as const,
  enteringCreatesObject: false as const,
  exitingDeletesObject: false as const,
  startsDthExp6: false as const,
});

export function verifyDthExpSceneTransitionBoundary(): { readonly ok: true } {
  if (DTH_EXP_SCENE_TRANSITION_BOUNDARY.parallelAnimationEnginePerFamily) {
    throw new Error("DTH-EXP:5B must use one shared transition engine");
  }
  if (DTH_EXP_SCENE_TRANSITION_BOUNDARY.animationPlayback) {
    throw new Error("DTH-EXP:5B must not implement animation playback");
  }
  if (DTH_EXP_SCENE_TRANSITION_BOUNDARY.liveStageWiring) {
    throw new Error("DTH-EXP:5B must not wire live Stage");
  }
  if (DTH_EXP_SCENE_TRANSITION_BOUNDARY.startsDthExp6) {
    throw new Error("DTH-EXP:5B must not start DTH-EXP:6");
  }
  return Object.freeze({ ok: true as const });
}
