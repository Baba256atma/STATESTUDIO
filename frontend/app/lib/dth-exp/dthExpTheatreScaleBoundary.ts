/**
 * NPA-T DTH-EXP:9 — large worlds stay bounded by certified relevance, not a new engine.
 * 4B remains context selection. 5A density, 6 Evidence, 8A/8B Multi-Nexo remain owners.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { DTH_EXP_SCENE_TRANSITION_ENGINE } from "./dthExpSceneTransitionIdentity.ts";
import { dthExpDirectorNexoSelectionIdentity } from "./dthExpDirectorNexoSelectionIdentity.ts";

export const DTH_EXP_THEATRE_SCALE_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:9/TheatreScaleBoundary" as const,
  engine: "DTH-EXP:9/RelevanceBoundedWorkingSet",
  relevance: "DTH-EXP:4B / DIR:1",
  spatialDensity: "DTH-EXP:5A",
  evidence: "DTH-EXP:6 / CC:8",
  multiNexoEligibility: "DTH-EXP:8A",
  multiNexoComposition: "DTH-EXP:8B",
  transition: DTH_EXP_SCENE_TRANSITION_ENGINE,
  primarySelector: dthExpDirectorNexoSelectionIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
  advisor: conversationalExperienceIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  workingSetIsCanonicalStore: false as const,
  secondRelevanceEngine: false as const,
  secondLayoutEngine: false as const,
  persistentSceneCache: false as const,
  shadowNmiGraph: false as const,
  firstNAdmission: false as const,
  presentationAdmissionIsBusinessRanking: false as const,
  densityImpliesImportance: false as const,
  evidenceCountCreatesConfidence: false as const,
  ranksBubbleCandidates: false as const,
  upgradesCausality: false as const,
  assignsVaiRoles: false as const,
  calculatesRisk: false as const,
  parallelTimelineAuthority: false as const,
  inventsTimeAggregates: false as const,
  browserPerformanceCertified: false as const,
  liveStageWiring: false as const,
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  startsDthExp10: false as const,
  startsDthExpFinal: false as const,
});

export function verifyDthExpTheatreScaleBoundary(): { readonly ok: true } {
  if (DTH_EXP_THEATRE_SCALE_BOUNDARY.workingSetIsCanonicalStore) {
    throw new Error("DTH-EXP:9 must not create a canonical working-set store");
  }
  if (DTH_EXP_THEATRE_SCALE_BOUNDARY.secondRelevanceEngine) {
    throw new Error("DTH-EXP:9 must not create a second relevance engine");
  }
  if (DTH_EXP_THEATRE_SCALE_BOUNDARY.browserPerformanceCertified) {
    throw new Error("DTH-EXP:9 must not claim unmeasured browser performance");
  }
  if (DTH_EXP_THEATRE_SCALE_BOUNDARY.startsDthExp10) {
    throw new Error("DTH-EXP:9 must not start DTH-EXP:10");
  }
  if (DTH_EXP_THEATRE_SCALE_BOUNDARY.startsDthExpFinal) {
    throw new Error("DTH-EXP:9 must not start DTH-EXP:FINAL");
  }
  return Object.freeze({ ok: true as const });
}
