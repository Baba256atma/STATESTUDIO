import type { ExecutiveStrategyPlatformCompatibilityEntry } from "./executiveStrategyPlatformFreezeTypes.ts";

export const EXECUTIVE_STRATEGY_PLATFORM_COMPATIBILITY_MATRIX: readonly ExecutiveStrategyPlatformCompatibilityEntry[] = Object.freeze([
  Object.freeze({ compatibilityId: "strategy-compat-kpi", targetPlatform: "Executive KPI Platform", compatibilityStatus: "Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-okr", targetPlatform: "Executive OKR Platform", compatibilityStatus: "Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-portfolio", targetPlatform: "Portfolio Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-financial", targetPlatform: "Financial Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-organization", targetPlatform: "Organization Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-resource", targetPlatform: "Resource Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-business-health", targetPlatform: "Business Health Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-compat-reporting", targetPlatform: "Reporting Platform (future)", compatibilityStatus: "Future Compatible", metadataOnly: true, immutable: true }),
] as const);

export function getExecutiveStrategyPlatformCompatibilityMatrix(): readonly ExecutiveStrategyPlatformCompatibilityEntry[] {
  return EXECUTIVE_STRATEGY_PLATFORM_COMPATIBILITY_MATRIX;
}
