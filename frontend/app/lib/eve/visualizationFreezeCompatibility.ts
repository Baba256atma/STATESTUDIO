import { VisualizationCertification } from "./visualizationCertification.ts";

export const VisualizationFreezeCompatibility = Object.freeze(
  VisualizationCertification.compatibility.map((entry, index) => Object.freeze({
    id: `EVE-1:8/Compatibility/${entry.name}`,
    name: entry.name,
    compatible: entry.certified,
    certificationReference: entry.platformReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })),
);

