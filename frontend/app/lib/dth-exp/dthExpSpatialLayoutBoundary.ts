/**
 * NPA-T DTH-EXP:5A — one shared spatial grammar. Stage and Director unchanged.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";

export const DTH_EXP_SPATIAL_LAYOUT_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:5A/SpatialLayoutBoundary" as const,
  engine: "DTH-EXP:5A/SharedSpatialGrammar",
  theatreScene: "DTH-EXP:1",
  theatreActors: "DTH-EXP:2",
  recipeEngine: "DTH-EXP:3A",
  nexoFamilies: "DTH-EXP:3B",
  director: nexoraSemanticPresentationDirectorIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  evidence: "CC:8",
  vai: "VAI:1–8",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parallelLayoutEnginePerFamily: false as const,
  parallelStage: false as const,
  parallelDirector: false as const,
  parallelSceneStore: false as const,
  parallelTimelineAuthority: false as const,
  bottleneckFamily: false as const,
  animationEngine: false as const,
  interpolationImplemented: false as const,
  liveStageWiring: false as const,
  mutatesTheatreScene: false as const,
  mutatesCanonicalObjects: false as const,
  proximityImpliesCausality: false as const,
  upgradesRelationshipSemantics: false as const,
  calculatesRisk: false as const,
  declaresOutcomeSuccess: false as const,
  pixelCoordinatesAreBusinessMeaning: false as const,
  startsDthExp5B: false as const,
});

export function verifyDthExpSpatialLayoutBoundary(): { readonly ok: true } {
  if (DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.parallelLayoutEnginePerFamily) {
    throw new Error("DTH-EXP:5A must use one shared layout grammar");
  }
  if (DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.animationEngine) {
    throw new Error("DTH-EXP:5A must not introduce an animation engine");
  }
  if (DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.parallelStage) {
    throw new Error("DTH-EXP:5A must not create a second Stage");
  }
  if (DTH_EXP_SPATIAL_LAYOUT_BOUNDARY.startsDthExp5B) {
    throw new Error("DTH-EXP:5A must not start DTH-EXP:5B");
  }
  return Object.freeze({ ok: true as const });
}
