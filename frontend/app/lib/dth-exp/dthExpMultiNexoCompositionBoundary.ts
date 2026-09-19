/**
 * NPA-T DTH-EXP:8A — one Theatre, one primary Nexo, bounded supporting languages.
 * DIR:1/4A remains primary selector. No merged layout, 8B, or NEXO_EVIDENCE.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { dthExpDirectorNexoSelectionIdentity } from "./dthExpDirectorNexoSelectionIdentity.ts";

export const DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:8A/MultiNexoCompositionBoundary" as const,
  engine: "DTH-EXP:8A/PrimaryOwnedSupportEligibility",
  primarySelector: dthExpDirectorNexoSelectionIdentity,
  director: nexoraSemanticPresentationDirectorIdentity,
  advisor: conversationalExperienceIdentity,
  spatialGrammar: "DTH-EXP:5A",
  evidence: "CC:8",
  vai: "VAI:1–8",
  stage: "NEX-MVP:3 / NEX-MVP:4",
  nexoEvidenceFamily: false as const,
  parallelDirector: false as const,
  parallelPrimarySelector: false as const,
  advisorSelectsSupportingNexo: false as const,
  parsesRawText: false as const,
  mergedLayoutImplemented: false as const,
  multiNexoRendering: false as const,
  liveStageWiring: false as const,
  compositionCreatesCausality: false as const,
  supportingRearrangesBaseScene: false as const,
  writesCanonicalObjects: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  calculatesRisk: false as const,
  startsDthExp8B: false as const,
});

export function verifyDthExpMultiNexoCompositionBoundary(): { readonly ok: true } {
  if (DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.nexoEvidenceFamily) {
    throw new Error("DTH-EXP:8A must not create NEXO_EVIDENCE");
  }
  if (DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.parallelPrimarySelector) {
    throw new Error("DTH-EXP:8A must not create a second primary Nexo selector");
  }
  if (DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.mergedLayoutImplemented) {
    throw new Error("DTH-EXP:8A must not implement merged multi-Nexo layout");
  }
  if (DTH_EXP_MULTI_NEXO_COMPOSITION_BOUNDARY.startsDthExp8B) {
    throw new Error("DTH-EXP:8A must not start DTH-EXP:8B");
  }
  return Object.freeze({ ok: true as const });
}
