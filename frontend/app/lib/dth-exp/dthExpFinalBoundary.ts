/**
 * NPA-T DTH-EXP:FINAL — DTH-EXP:1–10 closed as one projection program.
 * No DTH-EXP:11. Live /executive rendering remains deferred debt.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE } from "./dthExpExecutiveJourneyContract.ts";

export const DTH_EXP_FINAL_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:FINAL/ProgramBoundary" as const,
  engine: "DTH-EXP:FINAL/ProgramAudit",
  program: "Decision Theatre Expansion",
  phases: Object.freeze([
    "DTH-EXP:1",
    "DTH-EXP:2",
    "DTH-EXP:3A",
    "DTH-EXP:3B",
    "DTH-EXP:4A",
    "DTH-EXP:4B",
    "DTH-EXP:5A",
    "DTH-EXP:5B",
    "DTH-EXP:6",
    "DTH-EXP:7A",
    "DTH-EXP:7B",
    "DTH-EXP:8A",
    "DTH-EXP:8B",
    "DTH-EXP:9",
    "DTH-EXP:10",
  ] as const),
  pipeline: DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE,
  advisor: conversationalExperienceIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
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
  liveExecutiveRenderingCertified: false as const,
  browserPerformanceCertified: false as const,
  interactiveDisclosureUiCertified: false as const,
  animationPlaybackCertified: false as const,
  startsDthExp11: false as const,
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
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
});

export function verifyDthExpFinalBoundary(): { readonly ok: true } {
  if (DTH_EXP_FINAL_BOUNDARY.newTheatreCapability) {
    throw new Error("DTH-EXP:FINAL must not add Theatre capability");
  }
  if (DTH_EXP_FINAL_BOUNDARY.startsDthExp11) {
    throw new Error("DTH-EXP:FINAL must not start DTH-EXP:11");
  }
  if (DTH_EXP_FINAL_BOUNDARY.liveExecutiveRenderingCertified) {
    throw new Error("DTH-EXP:FINAL must not claim live /executive rendering");
  }
  if (DTH_EXP_FINAL_BOUNDARY.browserPerformanceCertified) {
    throw new Error("DTH-EXP:FINAL must not claim unmeasured browser performance");
  }
  return Object.freeze({ ok: true as const });
}
