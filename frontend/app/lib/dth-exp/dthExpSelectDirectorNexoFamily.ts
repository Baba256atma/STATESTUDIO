/**
 * NPA-T DTH-EXP:4A — select one primary Nexo family from DIR:1 + interpreted management need.
 * Does not parse manager text, populate scenes, or replace referent authority.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { DTH_EXP_NEXO_RECIPE_FAMILIES, type DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import { dthExpDirectorNexoSelectionIdentity, dthExpDirectorNexoSelectionVersion } from "./dthExpDirectorNexoSelectionIdentity.ts";
import {
  DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY,
  type DthExpDirectorManagementNeed,
  type DthExpDirectorNexoSelection,
  type DthExpDirectorNexoSelectionInput,
} from "./dthExpDirectorNexoSelectionContract.ts";

function isFamily(value: string | null | undefined): value is DthExpNexoRecipeFamily {
  return value != null && (DTH_EXP_NEXO_RECIPE_FAMILIES as readonly string[]).includes(value);
}

function unresolved(
  input: DthExpDirectorNexoSelectionInput,
  managementNeed: DthExpDirectorManagementNeed,
  reason: string,
  directorIntent: NexoraDirectorPlan["intent"] | null,
): DthExpDirectorNexoSelection {
  return Object.freeze({
    identity: dthExpDirectorNexoSelectionIdentity,
    version: dthExpDirectorNexoSelectionVersion,
    sourceDirectorIdentity: nexoraSemanticPresentationDirectorIdentity,
    directorIntent,
    managementNeed,
    selectedFamily: null,
    selectionState: "unresolved",
    selectionReason: reason,
    supportState: "unsupported",
    canonicalSubjectId: input.canonicalSubjectId?.trim() || null,
    currentNexoFamily: isFamily(input.currentNexoFamily) ? input.currentNexoFamily : null,
    fallback: "preserve-current-scene-without-guessing",
    primaryFamilyOnly: true,
    populatesScene: false,
    actors: Object.freeze([]) as readonly [],
    evidenceRefs: Object.freeze([]) as readonly [],
    createsCausalTruth: false,
    ranksCandidates: false,
    decidesVaiRoles: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesCanonicalObjects: false,
  });
}

function selected(
  input: DthExpDirectorNexoSelectionInput,
  managementNeed: DthExpDirectorManagementNeed,
  family: DthExpNexoRecipeFamily,
  reason: string,
  state: DthExpDirectorNexoSelection["selectionState"],
  directorIntent: NexoraDirectorPlan["intent"] | null,
): DthExpDirectorNexoSelection {
  return Object.freeze({
    identity: dthExpDirectorNexoSelectionIdentity,
    version: dthExpDirectorNexoSelectionVersion,
    sourceDirectorIdentity: nexoraSemanticPresentationDirectorIdentity,
    directorIntent,
    managementNeed,
    selectedFamily: family,
    selectionState: state,
    selectionReason: reason,
    supportState: state === "preserved" ? "preserved" : "supported",
    canonicalSubjectId: input.canonicalSubjectId?.trim() || null,
    currentNexoFamily: isFamily(input.currentNexoFamily) ? input.currentNexoFamily : null,
    fallback: "preserve-current-scene-without-guessing",
    primaryFamilyOnly: true,
    populatesScene: false,
    actors: Object.freeze([]) as readonly [],
    evidenceRefs: Object.freeze([]) as readonly [],
    createsCausalTruth: false,
    ranksCandidates: false,
    decidesVaiRoles: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesCanonicalObjects: false,
  });
}

function deriveNeed(input: DthExpDirectorNexoSelectionInput): DthExpDirectorManagementNeed {
  if (input.managementNeed) return input.managementNeed;
  const scene = input.sceneIntentKind ?? null;
  if (scene === "INVESTIGATE_CONDITION") return "CAUSE_INVESTIGATION";
  if (scene === "REVIEW_EXECUTION") return "EXECUTION_STATUS";
  if (scene === "REVIEW_OUTCOME") return "OUTCOME_ASSESSMENT";
  if (scene === "COMPARE_CANDIDATES" && input.comparisonKind === "portfolio") return "PORTFOLIO_COMPARISON";
  if (scene === "COMPARE_CANDIDATES" && input.comparisonKind === "magnitude") return "MAGNITUDE_COMPARISON";
  if (scene === "PRESERVE_SCENE" || scene === "CLARIFY_SCENE") return "CONTINUATION";
  const plan = input.directorPlan;
  if (plan?.intent === "SHOW_RELATIONSHIP") return "OPERATIONAL_FLOW";
  if (plan?.intent === "SHOW_COLLECTION" && plan.collection?.kind === "risk") return "RISK_FOCUS";
  if (plan?.intent === "SHOW_COLLECTION" && plan.collection?.kind === "scenario") return "PORTFOLIO_COMPARISON";
  if (plan?.intent === "SHOW_COLLECTION" && plan.collection?.kind === "execution") return "EXECUTION_STATUS";
  return "UNSPECIFIED";
}

/**
 * Consumes DIR:1 plan + already-resolved management need/context.
 * Does not take manager utterance as selection authority.
 */
export function selectNexoraDirectorNexoFamily(
  input: DthExpDirectorNexoSelectionInput,
): DthExpDirectorNexoSelection {
  const plan = input.directorPlan ?? null;
  if (plan != null && plan.authority !== nexoraSemanticPresentationDirectorIdentity) {
    return unresolved(input, input.managementNeed ?? "UNSPECIFIED", "director-authority-not-dir1", plan.intent);
  }
  const directorIntent = plan?.intent ?? null;
  const need = deriveNeed(input);
  const current = isFamily(input.currentNexoFamily) ? input.currentNexoFamily : null;

  if (need === "UNSPECIFIED") {
    return unresolved(input, need, "management-perspective-not-established", directorIntent);
  }

  if (need === "CONTINUATION") {
    if (current != null && (plan == null || plan.intent === "NO_CHANGE" || plan.framing === "PRESERVE")) {
      return selected(input, need, current, "director-continuation-preserves-current-nexo", "preserved", directorIntent);
    }
    return unresolved(input, need, "continuation-without-supported-current-nexo", directorIntent);
  }

  const family = DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY[need];
  const reason =
    current != null && current !== family
      ? `explicit-management-need-overrides-stale-${current}`
      : `director-management-need:${need}`;
  return selected(input, need, family, reason, "selected", directorIntent);
}
