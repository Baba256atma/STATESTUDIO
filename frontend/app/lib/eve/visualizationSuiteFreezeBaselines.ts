import { VisualizationSuiteCertificationPlatform } from "./visualizationSuiteCertification.ts";
import type { VisualizationSuiteFrozenBaseline } from "./visualizationSuiteFreezeTypes.ts";

const certification = VisualizationSuiteCertificationPlatform;
const platform = certification.platform;
const baselineSources = Object.freeze([
  ["Certified suite", platform],
  ["Suite composition", platform.composition],
  ["Suite capabilities", platform.capabilities],
  ["Suite guarantees", platform.guarantees],
  ["Compatibility declarations", platform.compatibility],
  ["Dependency graph", platform.metadata.dependency],
  ["Published inventories", platform.inventory],
  ["Architectural metadata", platform.metadata],
] as const);

export const VisualizationSuiteFrozenBaselines:
readonly VisualizationSuiteFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-9:8/Baseline/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
