/**
 * NPA-T DTH-EXP:4B — DIR:1 selects relevance; existing authorities provide truth.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";

export const DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:4B/DirectorSceneCompositionBoundary" as const,
  director: nexoraSemanticPresentationDirectorIdentity,
  familySelection: "DTH-EXP:4A",
  recipeFamilies: "DTH-EXP:3B",
  recipeEngine: "DTH-EXP:3A",
  theatreActors: "DTH-EXP:2",
  theatreFoundation: "DTH-EXP:1",
  stage: "NEX-MVP:3 / NEX-MVP:4",
  objects: "MO:1 / NEX-MVP:4",
  nmi: "NMI context consumed, not scene composition authority",
  vai: "VAI:1–8",
  evidence: "CC:8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parallelDirector: false as const,
  parallelSceneStore: false as const,
  parallelManagementMap: false as const,
  parallelCausalEngine: false as const,
  parallelTimelineAuthority: false as const,
  bottleneckFamily: false as const,
  inventsActors: false as const,
  inventsRelationships: false as const,
  inventsEvidence: false as const,
  calculatesTruth: false as const,
  assignsVaiRoles: false as const,
  upgradesRelationshipSemantics: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  rendersNexo: false as const,
  multiNexoComposition: false as const,
  startsDthExp5: false as const,
});

export function verifyDthExpDirectorSceneCompositionBoundary(): { readonly ok: true } {
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.parallelDirector) {
    throw new Error("DTH-EXP:4B must not create a second Director");
  }
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.parallelSceneStore) {
    throw new Error("DTH-EXP:4B must not create a Scene store");
  }
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.inventsActors) {
    throw new Error("DTH-EXP:4B must not invent actors");
  }
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.upgradesRelationshipSemantics) {
    throw new Error("DTH-EXP:4B must not upgrade relationship semantics");
  }
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.assignsVaiRoles) {
    throw new Error("DTH-EXP:4B must not assign VAI roles");
  }
  if (DTH_EXP_DIRECTOR_SCENE_COMPOSITION_BOUNDARY.startsDthExp5) {
    throw new Error("DTH-EXP:4B must not start DTH-EXP:5");
  }
  return Object.freeze({ ok: true as const });
}
