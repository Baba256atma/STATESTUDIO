/**
 * C:1 — Executive Compare Summary contract.
 *
 * Aggregates comparison differences into executive advantages, disadvantages,
 * tradeoffs, recommendation, and confidence. No UI rendering or mutations.
 */

import type { ScenarioComparisonResult } from "./ScenarioComparisonContract.ts";

export const EXEC_COMPARE_SUMMARY_DIAGNOSTIC = "[EXEC_COMPARE_SUMMARY]" as const;

export const EXEC_COMPARE_SUMMARY_READY_DIAGNOSTIC = "[EXEC_COMPARE_SUMMARY_READY]" as const;

export const C1_EXEC_SUMMARY_COMPLETE_TAG = "[C1_EXEC_SUMMARY_COMPLETE]" as const;

export const EXECUTIVE_COMPARE_SUMMARY_VERSION = "1.0.0" as const;

export type ExecutiveCompareRecommendation = "scenarioA" | "scenarioB" | "neutral";

export type ExecutiveCompareSummaryInput = Readonly<{
  comparison: ScenarioComparisonResult;
}>;

export type ExecutiveCompareSummary = Readonly<{
  version: typeof EXECUTIVE_COMPARE_SUMMARY_VERSION;
  comparisonId: string;
  scenarioAId: string;
  scenarioBId: string;
  advantages: readonly string[];
  disadvantages: readonly string[];
  keyTradeoffs: readonly string[];
  recommendedOption: ExecutiveCompareRecommendation;
  recommendationRationale: string;
  comparisonConfidence: number;
  objectDifferenceCount: number;
  relationshipDifferenceCount: number;
  kpiDifferenceCount: number;
  riskDifferenceCount: number;
  uiRendering: false;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
  diagnostics: readonly [
    typeof EXEC_COMPARE_SUMMARY_DIAGNOSTIC,
    typeof EXEC_COMPARE_SUMMARY_READY_DIAGNOSTIC,
  ];
}>;

export const EXEC_COMPARE_SUMMARY_DIAGNOSTICS = Object.freeze([
  EXEC_COMPARE_SUMMARY_DIAGNOSTIC,
  EXEC_COMPARE_SUMMARY_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_COMPARE_SUMMARY: ExecutiveCompareSummary = Object.freeze({
  version: EXECUTIVE_COMPARE_SUMMARY_VERSION,
  comparisonId: "",
  scenarioAId: "",
  scenarioBId: "",
  advantages: Object.freeze([]),
  disadvantages: Object.freeze([]),
  keyTradeoffs: Object.freeze([]),
  recommendedOption: "neutral",
  recommendationRationale: "No comparison result is available.",
  comparisonConfidence: 0,
  objectDifferenceCount: 0,
  relationshipDifferenceCount: 0,
  kpiDifferenceCount: 0,
  riskDifferenceCount: 0,
  uiRendering: false,
  mutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  objectMutation: false,
  diagnostics: EXEC_COMPARE_SUMMARY_DIAGNOSTICS,
});
