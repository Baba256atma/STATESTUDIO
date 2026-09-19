/**
 * NPA-T DTH-EXP:4A — Director Nexo family selection contract.
 * One primary family. No scene population. No business truth.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraDecisionTheatreSceneIntentKind } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts";
import { DTH_EXP_NEXO_RECIPE_FAMILIES, type DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import { dthExpDirectorNexoSelectionIdentity, dthExpDirectorNexoSelectionVersion } from "./dthExpDirectorNexoSelectionIdentity.ts";

export const DTH_EXP_DIRECTOR_NEXO_FAMILIES = DTH_EXP_NEXO_RECIPE_FAMILIES;

export const DTH_EXP_DIRECTOR_MANAGEMENT_NEEDS = Object.freeze([
  "PORTFOLIO_COMPARISON",
  "MAGNITUDE_COMPARISON",
  "OPERATIONAL_FLOW",
  "BOTTLENECK_LOCATION",
  "VARIABLE_LEVER",
  "RISK_FOCUS",
  "TEMPORAL_DEVELOPMENT",
  "CAUSE_INVESTIGATION",
  "EXECUTION_STATUS",
  "OUTCOME_ASSESSMENT",
  "CONTINUATION",
  "UNSPECIFIED",
] as const);

export type DthExpDirectorManagementNeed = (typeof DTH_EXP_DIRECTOR_MANAGEMENT_NEEDS)[number];

export const DTH_EXP_DIRECTOR_NEXO_SELECTION_STATES = Object.freeze([
  "selected",
  "preserved",
  "unresolved",
] as const);

export type DthExpDirectorNexoSelectionState = (typeof DTH_EXP_DIRECTOR_NEXO_SELECTION_STATES)[number];

export const DTH_EXP_DIRECTOR_NEXO_NEED_TO_FAMILY = Object.freeze({
  PORTFOLIO_COMPARISON: "NEXO_BUBBLE",
  MAGNITUDE_COMPARISON: "NEXO_BARS",
  OPERATIONAL_FLOW: "NEXO_FLOW",
  BOTTLENECK_LOCATION: "NEXO_FLOW",
  VARIABLE_LEVER: "NEXO_IMPACT",
  RISK_FOCUS: "NEXO_RISK",
  TEMPORAL_DEVELOPMENT: "NEXO_TIME",
  CAUSE_INVESTIGATION: "NEXO_CAUSE",
  EXECUTION_STATUS: "NEXO_EXECUTION",
  OUTCOME_ASSESSMENT: "NEXO_OUTCOME",
} as const satisfies Record<
  Exclude<DthExpDirectorManagementNeed, "CONTINUATION" | "UNSPECIFIED">,
  DthExpNexoRecipeFamily
>);

export type DthExpDirectorNexoSelection = Readonly<{
  identity: typeof dthExpDirectorNexoSelectionIdentity;
  version: typeof dthExpDirectorNexoSelectionVersion;
  sourceDirectorIdentity: typeof nexoraSemanticPresentationDirectorIdentity;
  directorIntent: NexoraDirectorPlan["intent"] | null;
  managementNeed: DthExpDirectorManagementNeed;
  selectedFamily: DthExpNexoRecipeFamily | null;
  selectionState: DthExpDirectorNexoSelectionState;
  selectionReason: string;
  supportState: "supported" | "preserved" | "unsupported";
  canonicalSubjectId: string | null;
  currentNexoFamily: DthExpNexoRecipeFamily | null;
  fallback: "preserve-current-scene-without-guessing";
  primaryFamilyOnly: true;
  populatesScene: false;
  actors: readonly [];
  evidenceRefs: readonly [];
  createsCausalTruth: false;
  ranksCandidates: false;
  decidesVaiRoles: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  writesCanonicalObjects: false;
}>;

export type DthExpDirectorNexoSelectionInput = Readonly<{
  directorPlan?: NexoraDirectorPlan | null;
  canonicalSubjectId?: string | null;
  managementNeed?: DthExpDirectorManagementNeed | null;
  currentNexoFamily?: DthExpNexoRecipeFamily | null;
  sceneIntentKind?: NexoraDecisionTheatreSceneIntentKind | null;
  comparisonKind?: "portfolio" | "magnitude" | null;
  nmiContextHint?: string | null;
}>;
