/**
 * MRP:5A:1 / 5A:2 / 5A:3 — Advisory workspace runtime state contract.
 */

import {
  DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
  DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
  type AdvisoryExplainabilityLayer,
  type AdvisoryExplainabilitySurface,
} from "./advisoryExplainabilityContract.ts";
import type { RecommendationPackage } from "./advisoryHandoffContract.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
  DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
  type AdvisoryRecommendationLayer,
  type AdvisoryRecommendationSurface,
} from "./advisoryRecommendationContract.ts";
import {
  DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
  type AdvisoryConfidenceLevel,
} from "./advisoryStateContract.ts";
import {
  DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
  type AdvisoryWorkspaceContext,
} from "./advisoryWorkspaceContextContract.ts";

export const ADVISORY_STATE_TAG = "[ADVISORY_STATE]" as const;
export const ADVISORY_RUNTIME_TAG = "[ADVISORY_RUNTIME]" as const;

export const ADVISORY_WORKSPACE_STATE_VERSION = "5A.6.0";

export type AdvisoryWorkspaceStatePhase = "loading" | "ready" | "empty";

export type AdvisoryFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type AdvisoryWorkspaceState = Readonly<{
  phase: AdvisoryWorkspaceStatePhase;
  workspaceContext: AdvisoryWorkspaceContext;
  recommendationId: string | null;
  recommendationTitle: string | null;
  confidence: AdvisoryConfidenceLevel;
  rationale: string | null;
  selectedObjectId: string | null;
  sourceScenarioId: string | null;
  sourceDecisionId: string | null;
  recommendationLayer: AdvisoryRecommendationLayer;
  recommendationReadOnly: true;
  recommendationSurface: AdvisoryRecommendationSurface;
  recommendationOwned: true;
  explainabilityLayer: AdvisoryExplainabilityLayer;
  explainabilityReadOnly: true;
  explainabilitySurface: AdvisoryExplainabilitySurface;
  pendingRecommendationPackage: RecommendationPackage | null;
  handoffReady: boolean;
  executiveRecommendation: AdvisoryFieldSnapshot;
  recommendationDrivers: AdvisoryFieldSnapshot;
  confidenceSummary: AdvisoryFieldSnapshot;
  assumptions: AdvisoryFieldSnapshot;
  alternativeRecommendations: AdvisoryFieldSnapshot;
  revision: number;
  signature: string;
}>;

export type AdvisoryWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: AdvisoryWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const ADVISORY_LOADING_HEADLINE = "Loading…";
export const ADVISORY_LOADING_DETAIL = "Retrieving advisory workspace runtime state.";

export const ADVISORY_EMPTY_HEADLINE = "No data available";
export const ADVISORY_EMPTY_DETAIL = "Advisory workspace runtime returned an empty state.";

export const DEFAULT_EXECUTIVE_RECOMMENDATION: AdvisoryFieldSnapshot = Object.freeze({
  headline: "No executive recommendation signal",
  detail: "Runtime connected — executive recommendation intelligence not wired in MRP:5A:1.",
});

export const DEFAULT_RECOMMENDATION_DRIVERS: AdvisoryFieldSnapshot = Object.freeze({
  headline: "No recommendation drivers signal",
  detail: "Runtime connected — recommendation drivers intelligence not wired in MRP:5A:1.",
});

export const DEFAULT_CONFIDENCE_SUMMARY: AdvisoryFieldSnapshot = Object.freeze({
  headline: "No confidence summary signal",
  detail: "Runtime connected — confidence summary intelligence not wired in MRP:5A:1.",
});

export const DEFAULT_ASSUMPTIONS: AdvisoryFieldSnapshot = Object.freeze({
  headline: "No assumptions signal",
  detail: "Runtime connected — assumptions intelligence not wired in MRP:5A:1.",
});

export const DEFAULT_ALTERNATIVE_RECOMMENDATIONS: AdvisoryFieldSnapshot = Object.freeze({
  headline: "No alternative recommendations signal",
  detail: "Runtime connected — alternative recommendations intelligence not wired in MRP:5A:1.",
});

export const DEFAULT_ADVISORY_READY_STATE: AdvisoryWorkspaceState = Object.freeze({
  phase: "ready",
  workspaceContext: DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
  ...DEFAULT_ADVISORY_RECOMMENDATION_RUNTIME,
  recommendationLayer: DEFAULT_ADVISORY_RECOMMENDATION_LAYER,
  recommendationReadOnly: true,
  recommendationSurface: DEFAULT_ADVISORY_RECOMMENDATION_SURFACE,
  recommendationOwned: true,
  explainabilityLayer: DEFAULT_ADVISORY_EXPLAINABILITY_LAYER,
  explainabilityReadOnly: true,
  explainabilitySurface: DEFAULT_ADVISORY_EXPLAINABILITY_SURFACE,
  pendingRecommendationPackage: null,
  handoffReady: false,
  executiveRecommendation: DEFAULT_EXECUTIVE_RECOMMENDATION,
  recommendationDrivers: DEFAULT_RECOMMENDATION_DRIVERS,
  confidenceSummary: DEFAULT_CONFIDENCE_SUMMARY,
  assumptions: DEFAULT_ASSUMPTIONS,
  alternativeRecommendations: DEFAULT_ALTERNATIVE_RECOMMENDATIONS,
  revision: 0,
  signature: "advisory:ready:defaults",
});
