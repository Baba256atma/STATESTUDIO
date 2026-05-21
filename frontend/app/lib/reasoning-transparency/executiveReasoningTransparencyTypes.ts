import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { ExecutiveMetaCognitionSnapshot } from "../meta-cognition/executiveMetaCognitionTypes";

export type ExecutiveReasoningAssumption = {
  id: string;
  label: string;
  source: "operational" | "strategic" | "governance" | "evidence" | "interpretation";
  stability: "stable" | "forming" | "weak";
};

export type ExecutiveConfidenceFactor = {
  id: string;
  label: string;
  weight: "primary" | "supporting" | "caution";
};

export type ExecutiveUncertaintySource = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
  guidance: string;
};

export type ExecutiveReasoningTradeoff = {
  id: string;
  label: string;
  impact: "favor_current" | "neutral" | "favor_alternative";
};

/**
 * F10:2 — Deterministic executive reasoning transparency contract.
 * Structured strategic visibility; not raw chain-of-thought.
 */
export type ExecutiveReasoningTransparency = {
  advisoryId: string;
  strategicConclusion: string;
  primarySignals: readonly string[];
  assumptions: readonly ExecutiveReasoningAssumption[];
  confidenceFactors: readonly ExecutiveConfidenceFactor[];
  uncertaintySources: readonly ExecutiveUncertaintySource[];
  fragilityDrivers: readonly string[];
  tradeoffs: readonly ExecutiveReasoningTradeoff[];
  governanceNotes: readonly string[];
  advisoryLimits: readonly string[];
  reasoningSummary: string;
  signature: string;
  timestamp: number;
  rightRailLine: string;
  assistantLine: string;
  timelineLine: string;
};

export type StrategicAssumptionAwareness = {
  trackedAssumptions: readonly ExecutiveReasoningAssumption[];
  dependencyGaps: readonly string[];
  evidenceWeakness: readonly string[];
  signature: string;
};

export type BuildExecutiveReasoningTransparencyInput = {
  metaCognition: ExecutiveMetaCognitionSnapshot;
  canonicalRecommendation?: CanonicalRecommendation | null;
  pipelineStatus?: {
    fragilityLevel?: string | null;
    summary?: string | null;
    insightLine?: string | null;
  } | null;
  strategicAdvice?: unknown;
  timestamp?: number;
};
