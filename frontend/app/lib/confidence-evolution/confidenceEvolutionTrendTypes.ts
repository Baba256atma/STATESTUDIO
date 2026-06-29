/**
 * APP-9:4 — Confidence Trend + Volatility domain types.
 * Read-only movement metadata over APP-9:3 query results.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type {
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceWorkspaceId,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION = "APP-9/4" as const;
export const CONFIDENCE_EVOLUTION_TREND_ARCHITECTURE_VERSION = "APP-9/4-confidence-trend-arch" as const;

export const CONFIDENCE_EVOLUTION_TREND_TAGS = Object.freeze([
  "[APP9_4]",
  "[CONFIDENCE_EVOLUTION_TREND]",
  "[READ_ONLY]",
  "[MOVEMENT_METADATA]",
  "[NO_PREDICTION]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_TREND_DIRECTIONS = Object.freeze([
  "increasing",
  "decreasing",
  "stable",
  "mixed",
  "unknown",
] as const);

export const CONFIDENCE_VOLATILITY_LEVELS = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
  "extreme",
] as const);

export const CONFIDENCE_STABILITY_LEVELS = Object.freeze([
  "stable",
  "moderately_stable",
  "unstable",
  "highly_unstable",
  "unknown",
] as const);

export const CONFIDENCE_MOVEMENT_EVENT_TYPES = Object.freeze([
  "increase",
  "decrease",
  "stable",
  "peak",
  "drop",
  "recovery",
] as const);

export const CONFIDENCE_EVOLUTION_TREND_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type ConfidenceTrendDirection = (typeof CONFIDENCE_TREND_DIRECTIONS)[number];
export type ConfidenceVolatilityLevel = (typeof CONFIDENCE_VOLATILITY_LEVELS)[number];
export type ConfidenceStabilityLevel = (typeof CONFIDENCE_STABILITY_LEVELS)[number];
export type ConfidenceMovementEventType = (typeof CONFIDENCE_MOVEMENT_EVENT_TYPES)[number];

export type ConfidenceMovementEvent = Readonly<{
  id: string;
  workspaceId: ConfidenceWorkspaceId;
  recordId: string;
  type: ConfidenceMovementEventType;
  fromScore: number;
  toScore: number;
  delta: number;
  occurredAt: string;
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceEvolutionTrendModel = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt: string;
  recordCount: number;
  firstScore: number | null;
  lastScore: number | null;
  totalDelta: number | null;
  averageDelta: number | null;
  direction: ConfidenceTrendDirection;
  volatilityScore: number;
  volatilityLevel: ConfidenceVolatilityLevel;
  stabilityLevel: ConfidenceStabilityLevel;
  peaks: readonly ConfidenceMovementEvent[];
  drops: readonly ConfidenceMovementEvent[];
  recoveries: readonly ConfidenceMovementEvent[];
  confidence: number;
  metadata: Readonly<Record<string, string>>;
  contractVersion: typeof CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ConfidenceDeltaPair = Readonly<{
  recordId: string;
  previousRecordId: string;
  fromScore: number;
  toScore: number;
  delta: number;
  occurredAt: string;
  readOnly: true;
}>;

export type BuildConfidenceTrendModelInput = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  generatedAt?: string;
  includeArchived?: boolean;
}>;

export type ConfidenceEvolutionTrendEngineState = Readonly<{
  engineId: "confidence-evolution-trend-engine";
  contractVersion: typeof CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionTrendResponse = Readonly<{
  success: boolean;
  reason: string;
  data: ConfidenceEvolutionTrendModel | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionTrendCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionTrendCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionTrendCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };

export function trendSuccess(reason: string, data: ConfidenceEvolutionTrendModel): ConfidenceEvolutionTrendResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function trendFailure(reason: string): ConfidenceEvolutionTrendResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export type { ConfidenceEvolutionEngineRecord };
