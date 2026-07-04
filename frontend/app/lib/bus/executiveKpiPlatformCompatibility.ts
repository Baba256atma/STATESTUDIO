import { EXECUTIVE_KPI_COMPATIBILITY_MATRIX } from "./executiveKpiIntegrationPlatform.ts";
import type { ExecutiveKpiPlatformCompatibilityEntry } from "./executiveKpiPlatformFreezeTypes.ts";

export const EXECUTIVE_KPI_PLATFORM_COMPATIBILITY_MATRIX: readonly ExecutiveKpiPlatformCompatibilityEntry[] = Object.freeze([
  ...EXECUTIVE_KPI_COMPATIBILITY_MATRIX.map((entry) =>
    Object.freeze({
      compatibilityId: entry.compatibilityId,
      targetLayer: entry.targetLayer,
      compatibilityStatus: entry.compatibilityStatus,
      metadataOnly: true,
      immutable: true,
    })
  ),
  Object.freeze({ compatibilityId: "advisor-consumer-compatibility", targetLayer: "Advisor", compatibilityStatus: "Consumer Safe", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "dashboard-consumer-compatibility", targetLayer: "Dashboard", compatibilityStatus: "Consumer Safe", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "scenario-consumer-compatibility", targetLayer: "Scenario", compatibilityStatus: "Consumer Safe", metadataOnly: true, immutable: true }),
] as const);

export function getExecutiveKpiPlatformCompatibilityMatrix(): readonly ExecutiveKpiPlatformCompatibilityEntry[] {
  return EXECUTIVE_KPI_PLATFORM_COMPATIBILITY_MATRIX;
}
