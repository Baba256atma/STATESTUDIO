/**
 * NPA-T VAI:4 — bounded Advisor Variable-analysis contracts.
 */

import { vaiAdvisorAnalysisIdentity } from "./vaiAdvisorIdentity.ts";
import type { VaiVariable } from "./vaiContract.ts";
import type { VaiObjectRoleResolveResult } from "./vaiObjectRoleResolver.ts";
import type { VaiAnalyticalRelationship } from "./vaiCausalContract.ts";

export const VAI_ADVISOR_INTENTS = Object.freeze([
  "VARIABLES_MATTER",
  "LEVER",
  "OUTCOME",
  "PATH",
  "MODERATOR",
  "CONTROL",
  "CONFOUNDER",
  "CAUSAL",
  "WHY_ROLE",
  "WHY_NOT_CAUSE",
  "EVIDENCE",
  "INVESTIGATE",
  "FOLLOWUP_LEVER",
  "FOLLOWUP_EVIDENCE",
  "FOLLOWUP_CAUSE",
  "NONE",
] as const);

export type VaiAdvisorIntent = (typeof VAI_ADVISOR_INTENTS)[number];

export type VaiAdvisorFocalObject = {
  readonly id: string;
  readonly label: string;
};

export type VaiAdvisorSession = {
  readonly analysisContextId: string;
  readonly focalObjectId: string;
  readonly focalObjectLabel: string;
  readonly lastVariableId: string | null;
  readonly lastRole: string | null;
};

export type VaiAdvisorBundle = {
  readonly analysisContextId: string;
  readonly focalObject: VaiAdvisorFocalObject;
  readonly variables: readonly VaiVariable[];
  readonly roleResult: VaiObjectRoleResolveResult;
  readonly relationship: VaiAnalyticalRelationship | null;
  readonly staleObjectLabel?: string | null;
};

export const VAI_ADVISOR_BOUNDARY = Object.freeze({
  identity: vaiAdvisorAnalysisIdentity,
  secondAdvisor: false as const,
  secondIntentAuthority: false as const,
  secondReferentResolver: false as const,
  writesVariables: false as const,
  writesEvidence: false as const,
  writesObjects: false as const,
  writesStage: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  createsScenario: false as const,
  replacesNps: false as const,
  independentlyPromotesCausality: false as const,
  startsVai5: false as const,
});
