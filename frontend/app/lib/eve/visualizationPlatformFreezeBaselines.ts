import { VisualizationPlatformCertificationPlatform } from "./visualizationPlatformCertification.ts";
import type { VisualizationPlatformFrozenBaseline } from "./visualizationPlatformFreezeTypes.ts";

const certification = VisualizationPlatformCertificationPlatform;
const platform = certification.platform;
const baselineSources = Object.freeze([
  ["Certified platform", platform],
  ["Platform composition", platform.composition],
  ["Platform capabilities", platform.capabilities],
  ["Platform guarantees", platform.guarantees],
  ["Compatibility declarations", platform.compatibility],
  ["Dependency graph", platform.metadata.dependency],
  ["Published inventories", platform.inventory],
  ["Architectural metadata", platform.metadata],
] as const);

export const VisualizationPlatformFrozenBaselines:
readonly VisualizationPlatformFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-8:8/Baseline/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
