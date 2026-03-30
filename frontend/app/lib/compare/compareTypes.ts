"use client";

import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";

export type CompareFocusDimension = "risk" | "efficiency" | "stability" | "growth" | "balanced";
export type CompareViewMode = "summary" | "deep" | "paths";

export type CompareInput = {
  scenarioA: {
    scenario: {
      id: string;
      title: string;
      [key: string]: unknown;
    };
    intelligence: SystemIntelligenceResult;
  };
  scenarioB: {
    scenario: {
      id: string;
      title: string;
      [key: string]: unknown;
    };
    intelligence: SystemIntelligenceResult;
  };
  focusDimension?: CompareFocusDimension;
};

export type CompareObjectDelta = {
  object_id: string;
  impactA: number;
  impactB: number;
  delta: number;
  interpretation: "improved" | "worse" | "neutral";
  rationale: string;
};

export type ComparePathDelta = {
  path_id: string;
  strengthA: number;
  strengthB: number;
  delta: number;
  interpretation: "stronger" | "weaker" | "equal";
  strategicRole: "critical" | "supporting" | "secondary";
  rationale: string;
};

export type CompareTradeoff = {
  dimension: "risk" | "efficiency" | "stability" | "growth";
  winner: "A" | "B" | "tie";
  confidence: number;
  explanation: string;
};

export type CompareSummary = {
  headline: string;
  winner: "A" | "B" | "tie";
  confidence: number;
  reasoning: string;
  keyTradeoffs: string[];
};

export type CompareAdvice = {
  advice_id: string;
  recommendation: "choose_A" | "choose_B" | "investigate_more" | "hybrid";
  title: string;
  explanation: string;
  confidence: number;
};

export type CompareResult = {
  object_deltas: CompareObjectDelta[];
  path_deltas: ComparePathDelta[];
  tradeoffs: CompareTradeoff[];
  summary: CompareSummary;
  advice: CompareAdvice[];
  meta: {
    comparison_mode?: string;
    timestamp?: number;
    engine_version?: string;
    source?: string;
  };
};

export type CompareModeState = {
  active: boolean;
  scenarioAId: string | null;
  scenarioBId: string | null;
  comparisonResult: CompareResult | null;
  focusDimension: CompareFocusDimension;
  mode: CompareViewMode;
};
