/**
 * NPA-T DTH-EXP:10 — certification of DTH-EXP:1–9 as one Theatre.
 * Owns no new truth. Does not start DTH-EXP:FINAL.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { DTH_EXP_SCENE_TRANSITION_ENGINE } from "./dthExpSceneTransitionIdentity.ts";
import { dthExpDirectorNexoSelectionIdentity } from "./dthExpDirectorNexoSelectionIdentity.ts";

export const DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:10/ExecutiveJourneyBoundary" as const,
  engine: "DTH-EXP:10/CertifiedPipelineComposition",
  pipeline: Object.freeze([
    "CC:5",
    "DTH-EXP:7A",
    "DIR:1",
    "DTH-EXP:4A",
    "DTH-EXP:4B",
    "DTH-EXP:3B",
    "DTH-EXP:3A",
    "DTH-EXP:5A",
    "DTH-EXP:5B",
    "DTH-EXP:6",
    "DTH-EXP:8A",
    "DTH-EXP:8B",
    "DTH-EXP:9",
    "DTH-EXP:7B",
  ] as const),
  advisor: conversationalExperienceIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
  primarySelector: dthExpDirectorNexoSelectionIdentity,
  transition: DTH_EXP_SCENE_TRANSITION_ENGINE,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  objects: "MO:1 / NEX-MVP:4",
  nmi: "NMI:1–8",
  vai: "VAI:1–8",
  evidence: "CC:8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  referent: "CC:5 / ECA / NCA / MO referent",
  newTheatreCapability: false as const,
  parallelObjectStore: false as const,
  parallelSceneStore: false as const,
  parallelStage: false as const,
  parallelDirector: false as const,
  parallelAdvisor: false as const,
  parallelReferentResolver: false as const,
  parallelEvidenceStore: false as const,
  nexoBottleneck: false as const,
  nexoEvidence: false as const,
  parallelTimelineAuthority: false as const,
  advisorToStageCommands: false as const,
  browserPerformanceCertified: false as const,
  liveStageWiring: false as const,
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  assignsVaiRoles: false as const,
  calculatesRisk: false as const,
  upgradesCausality: false as const,
  startsDthExpFinal: false as const,
});

export function verifyDthExpExecutiveJourneyBoundary(): { readonly ok: true } {
  if (DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.newTheatreCapability) {
    throw new Error("DTH-EXP:10 must not add a new Theatre capability");
  }
  if (DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.parallelDirector) {
    throw new Error("DTH-EXP:10 must not create a second Director");
  }
  if (DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.advisorToStageCommands) {
    throw new Error("DTH-EXP:10 must not create Advisor→Stage commands");
  }
  if (DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.startsDthExpFinal) {
    throw new Error("DTH-EXP:10 must not start DTH-EXP:FINAL");
  }
  return Object.freeze({ ok: true as const });
}
