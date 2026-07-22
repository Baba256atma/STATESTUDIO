import { GraphVisualizationManifest } from "./graphVisualizationManifest.ts";
import type { GraphVisualizationPlatformCapability } from "./graphVisualizationPlatformTypes.ts";

const names = Object.freeze([
  "Canonical Platform Publication", "Phase Composition Publication",
  "Platform Inventory Publication", "Capability Publication", "Guarantee Publication",
  "Compatibility Publication", "Dependency Publication", "Readiness Publication",
  "Metadata Publication", "Certification Readiness Publication",
] as const);

export const GraphVisualizationPlatformCapabilities:
readonly GraphVisualizationPlatformCapability[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-3:6/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Graph Visualization Platform capability for ${name}.`,
    manifestReference: GraphVisualizationManifest.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
