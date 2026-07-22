import type { VisualizationPlatformManifestCompatibilityEntry } from "./visualizationPlatformManifestTypes.ts";
import { VisualizationPlatformValidationPlatform } from "./visualizationPlatformValidation.ts";

const validation = VisualizationPlatformValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const compatibilitySources = Object.freeze([
  ["Foundation compatibility", foundation.metadata.id, foundation],
  ["Registry compatibility", registry.metadata.id, registry],
  ["Model compatibility", model.metadata.id, model],
  ["Validation compatibility", validation.metadata.id, validation],
  ["Namespace compatibility", validation.metadata.namespace, validation.metadata],
  ["Dependency compatibility", validation.metadata.id,
    validation.metadata.dependency],
  ["Public metadata compatibility", validation.metadata.id, validation],
  ["Future Platform compatibility", validation.metadata.id, validation],
] as const);

export const VisualizationPlatformManifestCompatibility:
readonly VisualizationPlatformManifestCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) =>
    Object.freeze({
      id: `EVE-8:5/Compatibility/${index + 1}` as const,
      name,
      compatible: true as const,
      canonicalReference,
      canonicalSource,
      deterministicOrder: index + 1,
      runtimeVerification: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
