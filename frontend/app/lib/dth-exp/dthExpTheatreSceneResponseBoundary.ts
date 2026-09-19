/**
 * NPA-T DTH-EXP:7B — Advisor converses; DIR:1/Theatre pipeline responds.
 * No Advisor→Stage commands, keyword router, or DTH-EXP:8.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";

export const DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:7B/TheatreSceneResponseBoundary" as const,
  engine: "DTH-EXP:7B/CertifiedPipelineOrchestration",
  advisor: conversationalExperienceIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
  nexoSelection: "DTH-EXP:4A",
  sceneComposition: "DTH-EXP:4B",
  spatialLayout: "DTH-EXP:5A",
  sceneTransition: "DTH-EXP:5B",
  evidenceProjection: "DTH-EXP:6",
  sceneAwareness: "DTH-EXP:7A",
  stage: "NEX-MVP:3 / NEX-MVP:4",
  evidence: "CC:8",
  vai: "VAI:1–8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parsesRawText: false as const,
  advisorChoosesNexo: false as const,
  advisorSelectsActors: false as const,
  advisorLayoutsActors: false as const,
  advisorAnimatesActors: false as const,
  advisorManufacturesEvidence: false as const,
  advisorToSceneShortcut: false as const,
  parallelDirector: false as const,
  parallelIntentParser: false as const,
  parallelReferentResolver: false as const,
  liveStageWiring: false as const,
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  upgradesCausality: false as const,
  startsDthExp8: false as const,
});

export function verifyDthExpTheatreSceneResponseBoundary(): { readonly ok: true } {
  if (DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.parsesRawText) {
    throw new Error("DTH-EXP:7B must not parse raw manager text");
  }
  if (DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisorChoosesNexo) {
    throw new Error("DTH-EXP:7B must not let Advisor choose Nexo");
  }
  if (DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.advisorToSceneShortcut) {
    throw new Error("DTH-EXP:7B must not create an Advisor→Scene shortcut");
  }
  if (DTH_EXP_THEATRE_SCENE_RESPONSE_BOUNDARY.startsDthExp8) {
    throw new Error("DTH-EXP:7B must not start DTH-EXP:8");
  }
  return Object.freeze({ ok: true as const });
}
