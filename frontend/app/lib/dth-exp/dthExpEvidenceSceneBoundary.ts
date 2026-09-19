/**
 * NPA-T DTH-EXP:6 — Theatre presents Evidence. CC:8 / Data Reality remain truth owners.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";

export const DTH_EXP_EVIDENCE_SCENE_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:6/EvidenceSceneBoundary" as const,
  engine: "DTH-EXP:6/SharedEvidenceProjection",
  evidenceAuthority: "CC:8",
  dataReality: "RDI / Data Reality",
  semanticCandidates: "DATA-ADV:2",
  spatialLayout: "DTH-EXP:5A",
  sceneTransition: "DTH-EXP:5B",
  director: nexoraSemanticPresentationDirectorIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  vai: "VAI:1–8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parallelEvidenceStore: false as const,
  parallelDataReality: false as const,
  evidenceIsMoObject: false as const,
  evidenceScoringEngine: false as const,
  visualProminenceCreatesConfidence: false as const,
  evidenceCountCreatesConfidence: false as const,
  proximityImpliesCausality: false as const,
  upgradesRelationshipSemantics: false as const,
  inventsProvenance: false as const,
  inventsSemanticMeaning: false as const,
  promotesUnderReviewToAccepted: false as const,
  historicalSuppliesCurrentReality: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  parallelTimelineAuthority: false as const,
  bottleneckFamily: false as const,
  liveStageWiring: false as const,
  liveEvidenceUi: false as const,
  startsDthExp7: false as const,
});

export function verifyDthExpEvidenceSceneBoundary(): { readonly ok: true } {
  if (DTH_EXP_EVIDENCE_SCENE_BOUNDARY.parallelEvidenceStore) {
    throw new Error("DTH-EXP:6 must not create a second Evidence store");
  }
  if (DTH_EXP_EVIDENCE_SCENE_BOUNDARY.evidenceIsMoObject) {
    throw new Error("DTH-EXP:6 must not make Evidence an MO Object");
  }
  if (DTH_EXP_EVIDENCE_SCENE_BOUNDARY.visualProminenceCreatesConfidence) {
    throw new Error("DTH-EXP:6 must not treat prominence as confidence");
  }
  if (DTH_EXP_EVIDENCE_SCENE_BOUNDARY.startsDthExp7) {
    throw new Error("DTH-EXP:6 must not start DTH-EXP:7");
  }
  return Object.freeze({ ok: true as const });
}
