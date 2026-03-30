"use client";

import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";
import type { ScenarioActionIntent } from "../simulation/scenarioActionTypes";

export type StrategyGenerationMode = "explore" | "optimize" | "stress_test";
export type StrategyPreferredFocus = "risk" | "growth" | "efficiency" | "stability";

export type StrategyGenerationInput = {
  intelligence: SystemIntelligenceResult;
  currentScenario?: Record<string, unknown> | null;
  constraints?: {
    maxStrategies?: number;
    riskTolerance?: number;
    preferredFocus?: StrategyPreferredFocus;
  };
  mode: StrategyGenerationMode;
  scene_json?: Record<string, unknown> | null;
  object_graph?: Record<string, unknown> | null;
};

export type GeneratedStrategy = {
  strategy_id: string;
  title: string;
  description: string;
  actions: ScenarioActionIntent[];
  expected_focus: string | null;
  rationale: string;
};

export type EvaluatedStrategy = {
  strategy: GeneratedStrategy;
  intelligence: SystemIntelligenceResult;
  score: number;
  ranking: number;
  tradeoffs: string[];
  risk_level: number;
  expected_impact: number;
};

export type StrategyGenerationResult = {
  strategies: EvaluatedStrategy[];
  recommended_strategy_id: string | null;
  summary: {
    headline: string;
    explanation: string;
    confidence: number;
  };
};

export type StrategyGenerationState = {
  active: boolean;
  result: StrategyGenerationResult | null;
  selectedStrategyId: string | null;
  loading: boolean;
  error: string | null;
  mode: StrategyGenerationMode;
  preferredFocus: StrategyPreferredFocus;
};
