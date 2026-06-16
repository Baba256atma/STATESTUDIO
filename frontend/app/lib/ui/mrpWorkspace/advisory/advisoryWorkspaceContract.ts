/**
 * MRP:5A:1 / 5A:3 — Advisory workspace contract.
 *
 * Advisory owns recommendation — not commitment or approval (Rule #14).
 */

import type { AdvisoryRecommendationSurface } from "./advisoryRecommendationContract.ts";
import type { AdvisoryExplainabilitySurface } from "./advisoryExplainabilityContract.ts";
import type { AdvisoryHandoffSurface } from "./advisoryHandoffContract.ts";
import type { AdvisoryWorkspaceContext } from "./advisoryWorkspaceContextContract.ts";

export const ADVISORY_FOUNDATION_TAG = "[MRP_ADVISORY_FOUNDATION]" as const;
export const MRP_ADVISORY_CERTIFIED_TAG = "[MRP_ADVISORY_CERTIFIED]" as const;
export const MRP_PHASE5A_COMPLETE_TAG = "[MRP_PHASE5A_COMPLETE]" as const;

export const ADVISORY_WORKSPACE_VERSION = "5A.6.0";

export const CANONICAL_ADVISORY_WORKSPACE_OWNER = "AdvisoryWorkspace" as const;

export type AdvisoryWorkspaceSectionId =
  | "executive_recommendation"
  | "recommendation_drivers"
  | "confidence_summary"
  | "assumptions"
  | "alternative_recommendations";

export type AdvisoryWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type AdvisoryWorkspaceCardView = Readonly<{
  id: AdvisoryWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: AdvisoryWorkspaceCardTone;
}>;

export type AdvisoryWorkspaceView = Readonly<{
  workspaceId: "advisory";
  cards: readonly AdvisoryWorkspaceCardView[];
  workspaceContext: AdvisoryWorkspaceContext;
  recommendation: AdvisoryRecommendationSurface;
  explainability: AdvisoryExplainabilitySurface;
  handoff: AdvisoryHandoffSurface;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "advisory_workspace_foundation" | "advisory_workspace_runtime_state";
  ownsRecommendationsOnly: true;
}>;

export const ADVISORY_WORKSPACE_SECTION_ORDER: readonly AdvisoryWorkspaceSectionId[] =
  Object.freeze([
    "executive_recommendation",
    "recommendation_drivers",
    "confidence_summary",
    "assumptions",
    "alternative_recommendations",
  ]);

export const ADVISORY_WORKSPACE_SECTION_LABELS: Readonly<
  Record<AdvisoryWorkspaceSectionId, string>
> = Object.freeze({
  executive_recommendation: "Executive Recommendation",
  recommendation_drivers: "Recommendation Drivers",
  confidence_summary: "Confidence Summary",
  assumptions: "Assumptions",
  alternative_recommendations: "Alternative Recommendations",
});
