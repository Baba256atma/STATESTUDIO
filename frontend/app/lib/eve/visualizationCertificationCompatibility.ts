import { VisualizationPlatform } from "./visualizationPlatform.ts";
import type { VisualizationCertificationCompatibilityEntry } from "./visualizationCertificationTypes.ts";

export const VisualizationCertificationCompatibility: readonly VisualizationCertificationCompatibilityEntry[] =
  Object.freeze(VisualizationPlatform.compatibility.map((entry, index) =>
    Object.freeze({
      id: `EVE-1:7/Compatibility/${entry.name}`,
      name: entry.name,
      certified: true,
      platformReference: entry.manifestReference,
      deterministicOrder: index + 1,
      runtimeVerification: false,
      metadataOnly: true,
      immutable: true,
    })),
);

