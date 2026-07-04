import type { ExecutiveKpiCompatibilityEntry } from "./executiveKpiIntegrationTypes.ts";

export const EXECUTIVE_KPI_COMPATIBILITY_MATRIX: readonly ExecutiveKpiCompatibilityEntry[] = Object.freeze([
  ...["BUS-1", "BUS-2", "BUS-3", "BUS-4", "BUS-5", "BUS-6", "BUS-7", "BUS-8", "BUS-9", "BUS-10"].map((phaseId) =>
    Object.freeze({
      compatibilityId: `${phaseId.toLowerCase()}-compatibility`,
      targetLayer: phaseId,
      compatibilityStatus: "Compatible" as const,
      description: `${phaseId} is part of the integrated Executive KPI Platform metadata surface.`,
      metadataOnly: true,
      immutable: true,
    })
  ),
  Object.freeze({ compatibilityId: "core-compatibility", targetLayer: "CORE", compatibilityStatus: "Consumer Safe", description: "CORE may consume BUS metadata through public APIs.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "ds-compatibility", targetLayer: "DS", compatibilityStatus: "Consumer Safe", description: "DS may consume KPI metadata for data structure alignment.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "int-compatibility", targetLayer: "INT", compatibilityStatus: "Consumer Safe", description: "INT may consume integration metadata without runtime binding.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "knl-compatibility", targetLayer: "KNL", compatibilityStatus: "Consumer Safe", description: "KNL may consume KPI metadata as knowledge references.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "app-compatibility", targetLayer: "APP", compatibilityStatus: "Consumer Safe", description: "APP may consume Executive KPI Platform metadata through public APIs.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "lay-compatibility", targetLayer: "LAY", compatibilityStatus: "Consumer Safe", description: "LAY may consume KPI metadata as executive layer context.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "ops-compatibility", targetLayer: "OPS", compatibilityStatus: "Consumer Safe", description: "OPS may consume KPI integration metadata as operational context.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "eve-compatibility", targetLayer: "EVE", compatibilityStatus: "Consumer Safe", description: "EVE may consume KPI metadata as event-context metadata only.", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "future-bus-compatibility", targetLayer: "Future BUS phases", compatibilityStatus: "Future Compatible", description: "Future BUS phases may consume BUS-11 through public APIs.", metadataOnly: true, immutable: true }),
] as const);

export function listExecutiveKpiCompatibilityMatrix(): readonly ExecutiveKpiCompatibilityEntry[] {
  return EXECUTIVE_KPI_COMPATIBILITY_MATRIX;
}
