import { VisualizationSuiteManifestPlatform } from "./visualizationSuiteManifest.ts";
import type { VisualizationSuitePlatformCapability } from "./visualizationSuitePlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Suite composition", "Public Index aggregation", "Metadata publication",
  "Inventory publication", "Foundation reference preservation",
  "Registry reference preservation", "Model reference preservation",
  "Validation reference preservation", "Compatibility publication",
  "Certification readiness publication",
] as const);

export const VisualizationSuitePlatformCapabilities:
readonly VisualizationSuitePlatformCapability[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-9:6/Capability/${index + 1}` as const,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference: VisualizationSuiteManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
