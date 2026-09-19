/**
 * NPA-T DTH-EXP:8B — supporting Nexo enriches the primary Scene.
 * 5A remains spatial authority. No second Stage, Director, or DTH-EXP:9.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { DTH_EXP_SCENE_TRANSITION_ENGINE } from "./dthExpSceneTransitionIdentity.ts";
import { dthExpDirectorNexoSelectionIdentity } from "./dthExpDirectorNexoSelectionIdentity.ts";

export const DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:8B/MultiNexoSceneBoundary" as const,
  engine: "DTH-EXP:8B/PrimarySkeletonLocalAttachment",
  eligibility: "DTH-EXP:8A",
  spatialGrammar: "DTH-EXP:5A",
  evidence: "DTH-EXP:6 / CC:8",
  transition: DTH_EXP_SCENE_TRANSITION_ENGINE,
  primarySelector: dthExpDirectorNexoSelectionIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
  advisor: conversationalExperienceIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  secondSceneStore: false as const,
  secondGlobalLayoutEngine: false as const,
  secondAnimationEngine: false as const,
  supportingRearrangesBaseScene: false as const,
  parsesRawText: false as const,
  choosesPrimaryFamily: false as const,
  presentationPriorityIsBusinessRanking: false as const,
  compositionCreatesCausality: false as const,
  nexoEvidenceFamily: false as const,
  liveStageWiring: false as const,
  multiNexoRendering: false as const,
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  calculatesRisk: false as const,
  ranksBubbleCandidates: false as const,
  parallelTimelineAuthority: false as const,
  startsDthExp9: false as const,
});

export function verifyDthExpMultiNexoSceneBoundary(): { readonly ok: true } {
  if (DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.secondSceneStore) {
    throw new Error("DTH-EXP:8B must not create a second Scene store");
  }
  if (DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.secondGlobalLayoutEngine) {
    throw new Error("DTH-EXP:8B must not create a second global layout engine");
  }
  if (DTH_EXP_MULTI_NEXO_SCENE_BOUNDARY.startsDthExp9) {
    throw new Error("DTH-EXP:8B must not start DTH-EXP:9");
  }
  return Object.freeze({ ok: true as const });
}
