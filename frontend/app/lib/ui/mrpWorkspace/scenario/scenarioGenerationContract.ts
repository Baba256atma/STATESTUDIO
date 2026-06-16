/**
 * MRP:4E:2 — Executive scenario generation contract.
 *
 * Read-only futures exploration — no execution, no object mutation.
 */

import type { ScenarioWorkspaceContext } from "./scenarioWorkspaceContextContract.ts";

export const MRP_SCENARIO_GENERATION_TAG = "[MRP_SCENARIO_GENERATION]" as const;

export const SCENARIO_GENERATION_VERSION = "4E.2.0";

export const SCENARIO_DECISION_QUESTION = "What could happen?" as const;

export type GeneratedScenarioId = "best_case" | "expected_case" | "worst_case";

export type GeneratedScenario = Readonly<{
  id: GeneratedScenarioId;
  title: string;
  probability: string;
  impact: string;
  confidence: string;
}>;

export type ScenarioGenerationRiskSnapshot = Readonly<{
  selectedObjectId: string | null;
  riskCount: number;
  elevatedRiskCount: number;
  criticalRiskCount: number;
  dominantRiskCategory: string;
}>;

export type ScenarioGenerationTimelineSnapshot = Readonly<{
  selectedObjectId: string | null;
  totalEvents: number;
  recentEventCount: number;
  decisionEventCount: number;
  riskEventCount: number;
}>;

export type ScenarioGenerationSelectedObject = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  hasSelection: boolean;
}>;

export type ScenarioGenerationInput = Readonly<{
  selectedObject: ScenarioGenerationSelectedObject;
  risk: ScenarioGenerationRiskSnapshot;
  timeline: ScenarioGenerationTimelineSnapshot;
}>;

export type ScenarioGenerationDataInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  workspaceContext?: ScenarioWorkspaceContext | null;
}>;

export type ScenarioGenerationSurface = Readonly<{
  question: typeof SCENARIO_DECISION_QUESTION;
  scenarios: readonly GeneratedScenario[];
  readOnly: true;
}>;

export const GENERATED_SCENARIO_ORDER: readonly GeneratedScenarioId[] = Object.freeze([
  "best_case",
  "expected_case",
  "worst_case",
]);

export const GENERATED_SCENARIO_TITLES: Readonly<Record<GeneratedScenarioId, string>> =
  Object.freeze({
    best_case: "Best Case",
    expected_case: "Expected Case",
    worst_case: "Worst Case",
  });

export const DEFAULT_SCENARIO_GENERATION_RISK: ScenarioGenerationRiskSnapshot = Object.freeze({
  selectedObjectId: null,
  riskCount: 0,
  elevatedRiskCount: 0,
  criticalRiskCount: 0,
  dominantRiskCategory: "None",
});

export const DEFAULT_SCENARIO_GENERATION_TIMELINE: ScenarioGenerationTimelineSnapshot =
  Object.freeze({
    selectedObjectId: null,
    totalEvents: 0,
    recentEventCount: 0,
    decisionEventCount: 0,
    riskEventCount: 0,
  });

export const DEFAULT_SCENARIO_GENERATION_SURFACE: ScenarioGenerationSurface = Object.freeze({
  question: SCENARIO_DECISION_QUESTION,
  scenarios: Object.freeze([]),
  readOnly: true,
});

export const SCENARIO_GENERATION_METRIC_LABELS = Object.freeze({
  probability: "Probability",
  impact: "Impact",
  confidence: "Confidence",
});
