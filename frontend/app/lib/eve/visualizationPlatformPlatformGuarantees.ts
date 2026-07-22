import { VisualizationPlatformManifestPlatform } from "./visualizationPlatformManifest.ts";
import type { VisualizationPlatformPlatformGuarantee } from "./visualizationPlatformPlatformTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Manifest preserved",
  "Canonical references preserved", "Canonical inventories preserved",
  "Dependency chain preserved", "Compatibility preserved",
  "Namespace preserved", "Architectural boundaries preserved",
  "Ready for Certification",
] as const);

export const VisualizationPlatformPlatformGuarantees:
readonly VisualizationPlatformPlatformGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-8:6/Guarantee/${index + 1}` as const,
    name,
    guaranteed: true as const,
    manifestReference: VisualizationPlatformManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
