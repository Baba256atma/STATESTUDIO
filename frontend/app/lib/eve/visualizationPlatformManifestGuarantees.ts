import type { VisualizationPlatformManifestGuarantee } from "./visualizationPlatformManifestTypes.ts";
import { VisualizationPlatformValidationPlatform } from "./visualizationPlatformValidation.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Canonical references preserved",
  "Canonical inventories preserved", "Dependency chain preserved",
  "Compatibility preserved", "Architectural boundaries preserved",
  "Namespace preserved", "Version preserved", "Ready for Platform",
] as const);

export const VisualizationPlatformManifestGuarantees:
readonly VisualizationPlatformManifestGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-8:5/Guarantee/${index + 1}` as const,
    name,
    description: `Declarative Manifest guarantee: ${name}.`,
    guaranteed: true as const,
    evidenceReference: VisualizationPlatformValidationPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
