import { VisualizationManifest } from "./visualizationManifest.ts";
import type { VisualizationPlatformCapability } from "./visualizationPlatformTypes.ts";

const names = Object.freeze([
  "Visualization Platform Composition",
  "Visualization Metadata Publication",
  "Canonical Inventory Publication",
  "Validation Preservation",
  "Dependency Preservation",
  "Compatibility Publication",
  "Readiness Publication",
  "Architectural Boundary Preservation",
  "Stable Public Surface",
  "Certification Readiness",
] as const);

export const VisualizationPlatformCapabilities: readonly VisualizationPlatformCapability[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:6/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative EVE Platform capability for ${name}.`,
    manifestReference: VisualizationManifest.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })));

