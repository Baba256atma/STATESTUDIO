import { TimelineVisualizationManifestPlatform } from "./timelineVisualizationManifest.ts";
import type { TimelineVisualizationPlatformCapability } from "./timelineVisualizationPlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Canonical architecture publication", "Phase composition publication",
  "Platform identity publication", "Dependency publication", "Compatibility publication",
  "Inventory publication", "Metadata publication", "Certification readiness publication",
  "Stable public platform publication", "Canonical reference preservation",
] as const);

export const TimelineVisualizationPlatformCapabilities:
readonly TimelineVisualizationPlatformCapability[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-4:6/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference: TimelineVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
