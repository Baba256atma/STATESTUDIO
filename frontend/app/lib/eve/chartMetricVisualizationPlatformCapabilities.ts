import { ChartMetricVisualizationManifestPlatform } from "./chartMetricVisualizationManifest.ts";
import type { ChartMetricVisualizationPlatformCapability } from "./chartMetricVisualizationPlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Canonical platform publication", "Architectural composition publication",
  "Platform inventory publication", "Capability publication", "Guarantee publication",
  "Compatibility publication", "Dependency publication", "Metadata publication",
  "Readiness publication", "Certification readiness publication",
] as const);

export const ChartMetricVisualizationPlatformCapabilities:
readonly ChartMetricVisualizationPlatformCapability[] = Object.freeze(capabilityNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:6/Capability/${name.replaceAll(" ", "")}` as const,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference: ChartMetricVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
