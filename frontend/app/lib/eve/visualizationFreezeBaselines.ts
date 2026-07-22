import { VisualizationCertification } from "./visualizationCertification.ts";
import type { VisualizationFrozenBaseline } from "./visualizationFreezeTypes.ts";

const platform = VisualizationCertification.platform;

const seeds = Object.freeze([
  ["CertifiedPlatform", platform],
  ["CertificationStatus", VisualizationCertification.metadata.status],
  ["PlatformCapabilities", platform.capabilities],
  ["PlatformGuarantees", platform.guarantees],
  ["CompatibilityDeclarations", VisualizationCertification.compatibility],
  ["DependencyGraph", platform.metadata.dependency],
  ["InventoryPublication", VisualizationCertification.inventory],
  ["ArchitecturalMetadata", platform.metadata],
] as const);

export const VisualizationFrozenBaselines: readonly VisualizationFrozenBaseline[] =
  Object.freeze(seeds.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-1:8/Baseline/${name}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

