import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureIndex.ts";
import type { BusinessArchitectureCompatibility } from "./businessSuiteArchitectureFreezeTypes.ts";

const PHASE_COMPATIBILITY: readonly BusinessArchitectureCompatibility[] = Object.freeze([
  Object.freeze({
    compatibilityId: "bus-arch-1-compatibility",
    targetId: "BUS-ARCH-1",
    targetName: "Business Suite Master Architecture",
    classification: "phase",
    compatible: true,
    requirements: Object.freeze(["Architecture identity", "Platform registry", "Deterministic manifest"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-arch-2-compatibility",
    targetId: "BUS-ARCH-2",
    targetName: "Business Suite Platform Boundary Map",
    classification: "phase",
    compatible: true,
    requirements: Object.freeze(["Boundary registry", "Ownership matrix", "Restriction matrix"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-arch-3-compatibility",
    targetId: "BUS-ARCH-3",
    targetName: "Business Suite Dependency & Consumer Map",
    classification: "phase",
    compatible: true,
    requirements: Object.freeze(["Dependency registry", "Consumer registry", "Provider registry"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-arch-4-compatibility",
    targetId: "BUS-ARCH-4",
    targetName: "Business Suite Public API & Extension Policy",
    classification: "phase",
    compatible: true,
    requirements: Object.freeze(["Public API catalog", "Extension policy", "Version policy"]),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    compatibilityId: "bus-arch-5-compatibility",
    targetId: "BUS-ARCH-5",
    targetName: "Business Suite Implementation Roadmap",
    classification: "phase",
    compatible: true,
    requirements: Object.freeze(["Implementation waves", "Release groups", "Certification stages"]),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

const FUTURE_PLATFORM_COMPATIBILITY: readonly BusinessArchitectureCompatibility[] = Object.freeze(
  buildBusinessSuiteArchitectureManifest().platforms.map((platform) =>
    Object.freeze({
      compatibilityId: `${platform.platformId}-future-compatibility`,
      targetId: platform.platformId,
      targetName: platform.platformName,
      classification: "future-platform",
      compatible: true,
      requirements: Object.freeze([
        "Consume certified public APIs only",
        "Preserve BUS-ARCH boundaries",
        "Remain independently certifiable",
      ]),
      metadataOnly: true,
      immutable: true,
    })
  )
);

export const BusinessSuiteArchitectureCompatibility: readonly BusinessArchitectureCompatibility[] = Object.freeze([
  ...PHASE_COMPATIBILITY,
  ...FUTURE_PLATFORM_COMPATIBILITY,
]);
