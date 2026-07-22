import { VisualizationPlatformManifestPlatform } from "./visualizationPlatformManifest.ts";
import type { VisualizationPlatformPlatformCapability } from "./visualizationPlatformPlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Platform composition", "Module aggregation", "Metadata publication",
  "Inventory publication", "Foundation reference preservation",
  "Registry reference preservation", "Model reference preservation",
  "Validation reference preservation", "Compatibility publication",
  "Certification readiness publication",
] as const);

export const VisualizationPlatformPlatformCapabilities:
readonly VisualizationPlatformPlatformCapability[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-8:6/Capability/${index + 1}` as const,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference: VisualizationPlatformManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
