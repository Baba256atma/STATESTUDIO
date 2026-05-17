/**
 * D7:1:6 — Executive scenario comparison contracts.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ComparisonGuardResult } from "./comparisonGuards.ts";

export interface ScenarioComparison {
  comparisonId: string;
  comparedScenarioIds: string[];
  baselineScenarioId: string;
  comparisonScenarioId: string;
  createdAt: string;
  compareAtTick: number;
  summary?: string;
}

export interface ScenarioComparisonMetrics {
  fragilityDelta: number;
  operationalLoadDelta: number;
  recoveryPotentialDelta: number;
  confidenceDelta: number;
  propagationRiskDelta: number;
}

export interface ScenarioDeltaAnalysis {
  changedObjects: readonly string[];
  riskEscalations: readonly string[];
  recoveryDifferences: readonly string[];
  majorOperationalChanges: readonly string[];
  propagationPathChanges: readonly string[];
  divergenceSeverity: number;
}

export type StrategicTradeoffDimension =
  | "speed"
  | "stability"
  | "efficiency"
  | "resilience"
  | "cost"
  | "risk_exposure";

export interface StrategicTradeoff {
  dimension: StrategicTradeoffDimension;
  improvedIn: "baseline" | "comparison" | "neutral";
  worsenedIn: "baseline" | "comparison" | "neutral";
  summary: string;
}

export interface ExecutiveComparisonNarrative {
  headline: string;
  summary: string;
  saferPath?: "baseline" | "comparison" | "equivalent";
  riskierPath?: "baseline" | "comparison" | "equivalent";
  stabilityWinner?: "baseline" | "comparison" | "equivalent";
  recoveryWinner?: "baseline" | "comparison" | "equivalent";
  bullets: readonly string[];
}

export interface ScenarioComparisonSnapshot {
  comparison: ScenarioComparison;
  metrics: ScenarioComparisonMetrics;
  delta: ScenarioDeltaAnalysis;
  tradeoffs: readonly StrategicTradeoff[];
  narrative: ExecutiveComparisonNarrative;
  baselineTimelineId: string;
  comparisonTimelineId: string;
  compareAtTick: number;
  fingerprint: string;
}

/** Future UI / panel contract (no rendering in D7:1:6). */
export interface ScenarioComparisonPanelContract {
  comparisonId: string;
  compareAtTick: number;
  scenarios: readonly ScenarioComparisonPanelRow[];
  ranking: readonly ScenarioRankingEntry[];
  tradeoffs: readonly StrategicTradeoff[];
  narratives: readonly string[];
  viewHint: "side_by_side" | "ranking" | "tradeoff_grid";
}

export interface ScenarioComparisonPanelRow {
  scenarioId: string;
  timelineId: string;
  label: string;
  headline: string;
  fragilityScore: number;
  confidenceScore: number;
  recoveryScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
}

export interface ScenarioRankingEntry {
  scenarioId: string;
  rank: number;
  category: "safer" | "riskier" | "more_stable" | "recovery_potential";
  score: number;
  reason: string;
}

export interface CompareScenarioTimelinesInput {
  baseline: OperationalTimeline;
  comparison: OperationalTimeline;
  baselineScenarioId: string;
  comparisonScenarioId: string;
  compareAtTick?: number;
  forest?: ScenarioBranchForestState | null;
}

export interface CompareMultipleScenariosInput {
  baseline: OperationalTimeline;
  comparisons: readonly {
    timeline: OperationalTimeline;
    scenarioId: string;
  }[];
  compareAtTick?: number;
  forest?: ScenarioBranchForestState | null;
}

export interface MultiScenarioComparisonResult {
  comparisons: readonly ScenarioComparisonSnapshot[];
  panelContract: ScenarioComparisonPanelContract;
  fingerprint: string;
}

export type ScenarioComparisonResult =
  | { ok: true; snapshot: ScenarioComparisonSnapshot }
  | { ok: false; guard: ComparisonGuardResult };
