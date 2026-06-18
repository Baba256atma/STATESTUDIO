/**
 * DS:3:7 — Executive Object Intelligence Aggregator contract.
 *
 * Read-only executive summary across health, impact, confidence, trend, and
 * importance intelligence.
 */

import type { ObjectConfidenceResult } from "./objectConfidenceContract.ts";
import type { ObjectHealthResult } from "./objectHealthContract.ts";
import type { ObjectImpactResult } from "./objectImpactContract.ts";
import type { ObjectImportanceProfile } from "./objectImportanceContract.ts";
import type { ObjectTrendProfile } from "./objectTrendContract.ts";

export const EXEC_OBJECT_INTELLIGENCE_DIAGNOSTIC = "[EXEC_OBJECT_INTELLIGENCE]" as const;

export const EXEC_OBJECT_INTELLIGENCE_READY_DIAGNOSTIC =
  "[EXEC_OBJECT_INTELLIGENCE_READY]" as const;

export const EXEC_OBJECT_INTELLIGENCE_VERSION = "3.7.0" as const;

export type ExecutiveObjectAttentionLevel = "monitor" | "review" | "prioritize";

export type ExecutiveObjectIntelligenceProfile = Readonly<{
  objectId: string;
  health?: ObjectHealthResult;
  impact?: ObjectImpactResult;
  confidence?: ObjectConfidenceResult;
  trend?: ObjectTrendProfile;
  importance?: ObjectImportanceProfile;
}>;

export type ExecutiveObjectAttention = Readonly<{
  objectId: string;
  attentionLevel: ExecutiveObjectAttentionLevel;
  reason: string;
}>;

export type ExecutiveObjectIntelligenceSummary = Readonly<{
  version: typeof EXEC_OBJECT_INTELLIGENCE_VERSION;
  executiveSummary: string;
  objectCount: number;
  averageHealthScore: number;
  averageImpactScore: number;
  averageConfidenceScore: number;
  averageImportanceScore: number;
  improvingCount: number;
  stableCount: number;
  decliningCount: number;
  volatileCount: number;
  topStrengths: readonly string[];
  topWeaknesses: readonly string[];
  recommendedAttention: readonly ExecutiveObjectAttention[];
  profiles: readonly ExecutiveObjectIntelligenceProfile[];
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof EXEC_OBJECT_INTELLIGENCE_DIAGNOSTIC,
    typeof EXEC_OBJECT_INTELLIGENCE_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveObjectIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
  healthProfiles?: readonly ObjectHealthResult[];
  impactProfiles?: readonly ObjectImpactResult[];
  confidenceProfiles?: readonly ObjectConfidenceResult[];
  trendProfiles?: readonly ObjectTrendProfile[];
  importanceProfiles?: readonly ObjectImportanceProfile[];
}>;

export const EXEC_OBJECT_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  EXEC_OBJECT_INTELLIGENCE_DIAGNOSTIC,
  EXEC_OBJECT_INTELLIGENCE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_OBJECT_INTELLIGENCE_SUMMARY: ExecutiveObjectIntelligenceSummary =
  Object.freeze({
    version: EXEC_OBJECT_INTELLIGENCE_VERSION,
    executiveSummary: "No object intelligence is available.",
    objectCount: 0,
    averageHealthScore: 0,
    averageImpactScore: 0,
    averageConfidenceScore: 0,
    averageImportanceScore: 0,
    improvingCount: 0,
    stableCount: 0,
    decliningCount: 0,
    volatileCount: 0,
    topStrengths: Object.freeze([]),
    topWeaknesses: Object.freeze([]),
    recommendedAttention: Object.freeze([]),
    profiles: Object.freeze([]),
    sceneMutation: false,
    simulation: false,
    diagnostics: EXEC_OBJECT_INTELLIGENCE_DIAGNOSTICS,
  });
