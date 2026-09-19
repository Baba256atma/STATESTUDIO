/**
 * NPA-T DTH-EXP:4A — DIR:1 remains the only Director.
 * Selection chooses a Nexo family, not scene participants or analytical truth.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";

export const DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:4A/DirectorNexoSelectionBoundary" as const,
  director: nexoraSemanticPresentationDirectorIdentity,
  recipeFamilies: "DTH-EXP:3B",
  recipeEngine: "DTH-EXP:3A",
  vai: "VAI:1–8",
  evidence: "CC:8",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  referent: "existing CC/NCA/MO referent authority",
  nmi: "NMI context consumed, not selection authority",
  parallelDirector: false as const,
  parallelIntentRouter: false as const,
  parallelReferentResolver: false as const,
  keywordRouter: false as const,
  populatesScene: false as const,
  rendersNexo: false as const,
  multiNexoComposition: false as const,
  bottleneckFamily: false as const,
  parallelTimelineFamily: false as const,
  decidesVaiRoles: false as const,
  createsCausalTruth: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  startsDthExp4B: false as const,
});

export function verifyDthExpDirectorNexoSelectionBoundary(): { readonly ok: true } {
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelDirector) {
    throw new Error("DTH-EXP:4A must not create a second Director");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelIntentRouter) {
    throw new Error("DTH-EXP:4A must not create a parallel intent router");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.keywordRouter) {
    throw new Error("DTH-EXP:4A must not be a keyword router");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.populatesScene) {
    throw new Error("DTH-EXP:4A must not populate the scene");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.bottleneckFamily) {
    throw new Error("DTH-EXP:4A must not create NexoBottleneck");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.parallelTimelineFamily) {
    throw new Error("DTH-EXP:4A must not create a Timeline family");
  }
  if (DTH_EXP_DIRECTOR_NEXO_SELECTION_BOUNDARY.startsDthExp4B) {
    throw new Error("DTH-EXP:4A must not start DTH-EXP:4B");
  }
  return Object.freeze({ ok: true as const });
}
