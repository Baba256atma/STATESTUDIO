/**
 * D:1 — Tradeoff Analysis Engine contract.
 *
 * Read-only contracts for comparing decision alternatives across benefit, risk,
 * cost, pressure reduction, and KPI impact without mutating source intelligence.
 */

import type { DecisionOption, DecisionScore } from "./DecisionRecommendationContract.ts";

export const TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC = "[TRADEOFF_ANALYSIS_ENGINE]" as const;

export const TRADEOFF_ANALYSIS_READY_DIAGNOSTIC = "[TRADEOFF_ANALYSIS_READY]" as const;

export const D1_TRADEOFF_ANALYSIS_COMPLETE_TAG = "[D1_TRADEOFF_ANALYSIS_COMPLETE]" as const;

export const TRADEOFF_ANALYSIS_ENGINE_VERSION = "1.0.0" as const;

export type TradeoffDimensionId =
  | "benefit"
  | "risk"
  | "cost"
  | "pressureReduction"
  | "kpiImpact";

export type TradeoffAxisValue = Readonly<{
  dimensionId: TradeoffDimensionId;
  label: string;
  value: number;
  readOnly: true;
  mutation: false;
}>;

export type TradeoffOptionProfile = Readonly<{
  optionId: string;
  label: string;
  axes: readonly TradeoffAxisValue[];
  readOnly: true;
  mutation: false;
}>;

export type TradeoffDimension = Readonly<{
  dimensionId: TradeoffDimensionId;
  label: string;
  optionAId: string;
  optionBId: string;
  optionAValue: number;
  optionBValue: number;
  delta: number;
  favoredOptionId: string | "neutral";
  summary: string;
  readOnly: true;
  mutation: false;
}>;

export type TradeoffComparison = Readonly<{
  comparisonId: string;
  optionAId: string;
  optionBId: string;
  dimensions: readonly TradeoffDimension[];
  primaryDimension: TradeoffDimensionId | null;
  tradeoffCount: number;
  summary: string;
  readOnly: true;
  mutation: false;
}>;

export type TradeoffProfile = Readonly<{
  version: typeof TRADEOFF_ANALYSIS_ENGINE_VERSION;
  profileId: string;
  evaluatedAt: string;
  optionProfiles: readonly TradeoffOptionProfile[];
  comparisons: readonly TradeoffComparison[];
  optionCount: number;
  comparisonCount: number;
  tradeoffCount: number;
  primaryComparison: TradeoffComparison | null;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC,
    typeof TRADEOFF_ANALYSIS_READY_DIAGNOSTIC,
  ];
}>;

export type TradeoffAnalysisInput = Readonly<{
  profileId: string;
  evaluatedAt: string;
  options: readonly DecisionOption[];
  scores: readonly DecisionScore[];
}>;

export const TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS = Object.freeze([
  TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTIC,
  TRADEOFF_ANALYSIS_READY_DIAGNOSTIC,
] as const);

export const EMPTY_TRADEOFF_PROFILE: TradeoffProfile = Object.freeze({
  version: TRADEOFF_ANALYSIS_ENGINE_VERSION,
  profileId: "",
  evaluatedAt: "",
  optionProfiles: Object.freeze([]),
  comparisons: Object.freeze([]),
  optionCount: 0,
  comparisonCount: 0,
  tradeoffCount: 0,
  primaryComparison: null,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: TRADEOFF_ANALYSIS_ENGINE_DIAGNOSTICS,
});
