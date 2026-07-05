import type { ExecutiveOkrPlatformCompatibility } from "./executiveOkrPlatformFreezeTypes.ts";

export const EXECUTIVE_OKR_PLATFORM_COMPATIBILITY_MATRIX: readonly ExecutiveOkrPlatformCompatibility[] = Object.freeze([
  Object.freeze({
    compatibilityId: "bus-core-kpi-compatibility",
    targetLayer: "BUS-1 through BUS-12 Executive KPI Platform",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-13-foundation-compatibility",
    targetLayer: "BUS-13 Executive OKR Platform Foundation",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-14-definition-compatibility",
    targetLayer: "BUS-14 Executive OKR Definition Platform",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-15-alignment-compatibility",
    targetLayer: "BUS-15 Executive OKR Alignment Platform",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "app-consumer-compatibility",
    targetLayer: "APP",
    compatibilityStatus: "Consumer Safe",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "lay-consumer-compatibility",
    targetLayer: "LAY",
    compatibilityStatus: "Consumer Safe",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "ops-consumer-compatibility",
    targetLayer: "OPS",
    compatibilityStatus: "Consumer Safe",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "eve-consumer-compatibility",
    targetLayer: "EVE",
    compatibilityStatus: "Future Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "metadata-boundary-compatibility",
    targetLayer: "Metadata-only Business Suite consumers",
    compatibilityStatus: "Metadata Only",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export function getExecutiveOkrPlatformCompatibilityMatrix(): readonly ExecutiveOkrPlatformCompatibility[] {
  return EXECUTIVE_OKR_PLATFORM_COMPATIBILITY_MATRIX;
}
