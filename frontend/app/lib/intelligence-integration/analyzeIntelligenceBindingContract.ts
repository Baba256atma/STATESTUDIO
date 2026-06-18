/**
 * INT:1:3 — Analyze Intelligence Binding integration contract.
 */

import type { AnalyzeIntelligenceProfile } from "./analyzeIntelligenceProfileContract.ts";
import {
  ANALYZE_BINDING_DIAGNOSTIC,
  ANALYZE_BINDING_READY_DIAGNOSTIC,
  ANALYZE_BINDING_DIAGNOSTICS,
  ANALYZE_INTELLIGENCE_BINDING_VERSION,
  EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT as EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_BINDING_RESULT,
  INT1_ANALYZE_BINDING_COMPLETE_TAG,
  type AnalyzeIntelligenceBindingBuildInput as CanonicalAnalyzeIntelligenceBindingBuildInput,
  type AnalyzeIntelligenceBindingResult as CanonicalAnalyzeIntelligenceBindingResult,
  type AnalyzeIntelligenceBindingStatus,
  type AnalyzeIntelligenceBindingView,
} from "../intelligence/analyzeIntelligenceBindingContract.ts";
import type { ExecutiveIntelligenceAdapterRegistry } from "./executiveIntelligenceAdapterContract.ts";

export {
  ANALYZE_BINDING_DIAGNOSTIC,
  ANALYZE_BINDING_READY_DIAGNOSTIC,
  ANALYZE_BINDING_DIAGNOSTICS,
  ANALYZE_INTELLIGENCE_BINDING_VERSION,
  INT1_ANALYZE_BINDING_COMPLETE_TAG,
};

export type {
  AnalyzeIntelligenceBindingStatus,
  AnalyzeIntelligenceBindingView,
};

export type AnalyzeIntelligenceBindingResult = Readonly<
  Omit<CanonicalAnalyzeIntelligenceBindingResult, "profile"> & {
    profile: AnalyzeIntelligenceProfile | null;
  }
>;

export type AnalyzeIntelligenceBindingBuildInput = Readonly<
  CanonicalAnalyzeIntelligenceBindingBuildInput & {
    adapterRegistry?: ExecutiveIntelligenceAdapterRegistry;
  }
>;

export const EMPTY_ANALYZE_INTELLIGENCE_BINDING_RESULT: AnalyzeIntelligenceBindingResult =
  Object.freeze({
    ...EMPTY_CANONICAL_ANALYZE_INTELLIGENCE_BINDING_RESULT,
    profile: null,
  });
