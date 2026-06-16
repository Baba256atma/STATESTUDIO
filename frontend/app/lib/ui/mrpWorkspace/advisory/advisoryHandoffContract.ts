/**
 * MRP:5A:5 — Advisory → Governance handoff contract.
 *
 * Prepares RecommendationPackage for governance review — Advisory may not approve or execute.
 */

import type { AdvisoryConfidenceLevel } from "./advisoryStateContract.ts";

export const MRP_ADVISORY_HANDOFF_TAG = "[MRP_ADVISORY_HANDOFF]" as const;

export const ADVISORY_HANDOFF_VERSION = "5A.5.0";

export const ADVISORY_HANDOFF_CONTEXT = "advisory" as const;

export const ADVISORY_HANDOFF_QUESTION =
  "What recommendation should governance review?" as const;

export type RecommendationPackage = Readonly<{
  recommendationId: string;
  recommendationTitle: string;
  confidence: AdvisoryConfidenceLevel;
  rationale: string;
  supportingDrivers: readonly string[];
  sourceScenarioId: string | null;
  sourceDecisionId: string | null;
  createdAt: string;
}>;

export type AdvisoryHandoffSurface = Readonly<{
  question: typeof ADVISORY_HANDOFF_QUESTION;
  pendingRecommendationPackage: RecommendationPackage | null;
  handoffReady: boolean;
  dashboardContext: typeof ADVISORY_HANDOFF_CONTEXT;
  preparesOnly: true;
  recommendsOnly: true;
  approvesDecisions: false;
  executesActions: false;
}>;

export type AdvisoryHandoffInput = Readonly<{
  createdAt?: string;
}>;

export const DEFAULT_ADVISORY_HANDOFF_SURFACE: AdvisoryHandoffSurface = Object.freeze({
  question: ADVISORY_HANDOFF_QUESTION,
  pendingRecommendationPackage: null,
  handoffReady: false,
  dashboardContext: ADVISORY_HANDOFF_CONTEXT,
  preparesOnly: true,
  recommendsOnly: true,
  approvesDecisions: false,
  executesActions: false,
});
