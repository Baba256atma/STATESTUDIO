/**
 * INT:1:2 — Analyze Intelligence Profile integration contract.
 *
 * Extends the canonical Analyze profile with adapter registry metadata for
 * INT-1:3 binding and certification surfaces.
 */

import type { ExecutiveIntelligenceAdapterRegistry } from "./executiveIntelligenceAdapterContract.ts";
import { EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY } from "./executiveIntelligenceAdapterContract.ts";
import {
  ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTIC,
  ANALYZE_INTELLIGENCE_CONTRACT_READY_DIAGNOSTIC,
  ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS,
  ANALYZE_INTELLIGENCE_PROFILE_VERSION,
  EMPTY_ANALYZE_INTELLIGENCE_PROFILE as EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_PROFILE,
  type AnalyzeConfidenceExposure,
  type AnalyzeHealthExposure,
  type AnalyzeImpactExposure,
  type AnalyzeImportanceExposure,
  type AnalyzeRiskExposure,
  type AnalyzeTrendExposure,
} from "../intelligence/analyzeIntelligenceProfileContract.ts";
import type { AnalyzeScenarioSummaryExposure as CanonicalAnalyzeScenarioSummaryExposure } from "../intelligence/analyzeIntelligenceProfileContract.ts";
import type { AnalyzeIntelligenceProfileBuildInput as CanonicalAnalyzeIntelligenceProfileBuildInput } from "../intelligence/analyzeIntelligenceProfileContract.ts";

export const ANALYZE_CONTRACT_DIAGNOSTIC = ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTIC;

export const ANALYZE_CONTRACT_READY_DIAGNOSTIC = ANALYZE_INTELLIGENCE_CONTRACT_READY_DIAGNOSTIC;

export { ANALYZE_INTELLIGENCE_PROFILE_VERSION };

export type {
  AnalyzeHealthExposure,
  AnalyzeImpactExposure,
  AnalyzeTrendExposure,
  AnalyzeImportanceExposure,
  AnalyzeRiskExposure,
  AnalyzeConfidenceExposure,
};

export type AnalyzeScenarioSummaryExposure = Readonly<
  CanonicalAnalyzeScenarioSummaryExposure & {
    comparisonPairCount: number;
    confidence: number;
  }
>;

export type AnalyzeIntelligenceProfile = Readonly<
  Omit<typeof EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_PROFILE, "scenarioSummary" | "snapshotVersion"> & {
    scenarioSummary: AnalyzeScenarioSummaryExposure;
    adapterVersion: string;
  }
>;

export type AnalyzeIntelligenceProfileBuildInput = Readonly<
  CanonicalAnalyzeIntelligenceProfileBuildInput & {
    adapterRegistry?: ExecutiveIntelligenceAdapterRegistry;
  }
>;

export const ANALYZE_CONTRACT_DIAGNOSTICS = ANALYZE_INTELLIGENCE_CONTRACT_DIAGNOSTICS;

export const EMPTY_ANALYZE_INTELLIGENCE_PROFILE: AnalyzeIntelligenceProfile = Object.freeze({
  ...EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_PROFILE,
  scenarioSummary: Object.freeze({
    ...EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_PROFILE.scenarioSummary,
    comparisonPairCount: 0,
    confidence: 0,
  }),
  adapterVersion: EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY.version,
});
