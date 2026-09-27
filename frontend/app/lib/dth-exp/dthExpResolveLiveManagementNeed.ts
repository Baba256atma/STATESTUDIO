/**
 * NPA-T DTH-EXP:LIVE-FIX1 — live DTH:5 / DIR:1 context → existing managementNeed.
 * Does not select a Nexo family. DTH-EXP:4A remains family-selection authority.
 */

import type { NexoraDecisionTheatreSceneIntentKind } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts";
import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";

export const dthExpLiveManagementNeedIdentity =
  "NPA-T DTH-EXP:LIVE-FIX1/LiveManagementNeedAdapter" as const;

export const DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY = Object.freeze({
  identity: dthExpLiveManagementNeedIdentity,
  familySelectionAuthority: "DTH-EXP:4A",
  selectsNexoFamily: false as const,
  parallelDirector: false as const,
  parallelNexoSelector: false as const,
  inventsManagementNeedTaxonomy: false as const,
  inventsObjectTaxonomy: false as const,
  forcesOverviewFamily: false as const,
  wiresOvsStage: false as const,
});

export type DthExpLiveManagementNeedInput = Readonly<{
  managementNeed?: DthExpDirectorManagementNeed | null;
  sceneIntentKind?: NexoraDecisionTheatreSceneIntentKind | null;
  focalCanonicalObjectType?: string | null;
  collectionKind?: string | null;
  comparisonKind?: "portfolio" | "magnitude" | null;
  directorPlan?: NexoraDirectorPlan | null;
}>;

function typeOf(value: string | null | undefined): string {
  return `${value ?? ""}`.trim().toLowerCase();
}

function collectionNeed(kind: string | null | undefined): DthExpDirectorManagementNeed | null {
  const collection = typeOf(kind);
  if (collection === "risk") return "RISK_FOCUS";
  if (collection === "scenario") return "PORTFOLIO_COMPARISON";
  if (collection === "execution") return "EXECUTION_STATUS";
  return null;
}

function focalReviewNeed(objectType: string | null | undefined): DthExpDirectorManagementNeed {
  const type = typeOf(objectType);
  if (type === "execution") return "EXECUTION_STATUS";
  if (type === "outcome") return "OUTCOME_ASSESSMENT";
  if (type === "risk") return "RISK_FOCUS";
  if (type === "problem") return "CAUSE_INVESTIGATION";
  return "UNSPECIFIED";
}

/**
 * Interprets existing live DTH/DIR context into the certified management-need vocabulary.
 * Never returns a Nexo family.
 */
export function resolveDthExpManagementNeedFromLiveTheatre(
  input: DthExpLiveManagementNeedInput = {},
): DthExpDirectorManagementNeed {
  if (input.managementNeed) return input.managementNeed;

  const scene = input.sceneIntentKind ?? null;
  if (scene === "INVESTIGATE_CONDITION") return "CAUSE_INVESTIGATION";
  if (scene === "REVIEW_EXECUTION") return "EXECUTION_STATUS";
  if (scene === "REVIEW_OUTCOME") return "OUTCOME_ASSESSMENT";
  if (scene === "COMPARE_CANDIDATES" && input.comparisonKind === "portfolio") {
    return "PORTFOLIO_COMPARISON";
  }
  if (scene === "COMPARE_CANDIDATES" && input.comparisonKind === "magnitude") {
    return "MAGNITUDE_COMPARISON";
  }
  if (scene === "PRESERVE_SCENE" || scene === "CLARIFY_SCENE") return "CONTINUATION";

  if (scene === "REVIEW_FOCAL_OBJECT") {
    return focalReviewNeed(input.focalCanonicalObjectType);
  }

  if (scene === "REVIEW_COLLECTION") {
    return collectionNeed(input.collectionKind) ?? "UNSPECIFIED";
  }

  const plan = input.directorPlan;
  if (plan?.intent === "SHOW_RELATIONSHIP") return "OPERATIONAL_FLOW";
  if (plan?.intent === "SHOW_COLLECTION") {
    return collectionNeed(plan.collection?.kind) ?? "UNSPECIFIED";
  }

  if (scene === "ORIENT_TO_STAGE") return "UNSPECIFIED";
  return "UNSPECIFIED";
}

export function verifyDthExpLiveManagementNeedBoundary(): { readonly ok: true } {
  if (DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.selectsNexoFamily) {
    throw new Error("LIVE-FIX1 must not select a Nexo family");
  }
  if (DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.parallelNexoSelector) {
    throw new Error("LIVE-FIX1 must not create a second Nexo selector");
  }
  if (DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.forcesOverviewFamily) {
    throw new Error("LIVE-FIX1 must not force a family onto ORIENT_TO_STAGE");
  }
  if (DTH_EXP_LIVE_MANAGEMENT_NEED_BOUNDARY.wiresOvsStage) {
    throw new Error("LIVE-FIX1 must not wire OVS Stage spatial");
  }
  return Object.freeze({ ok: true as const });
}
