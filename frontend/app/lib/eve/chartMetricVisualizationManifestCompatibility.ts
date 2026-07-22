import type { ChartMetricVisualizationManifestCompatibilityEntry } from "./chartMetricVisualizationManifestTypes.ts";
import { ChartMetricVisualizationValidationPlatform } from "./chartMetricVisualizationValidation.ts";

const validation = ChartMetricVisualizationValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const compatibilitySources = Object.freeze([
  ["Foundation compatibility", foundation.metadata.id, foundation],
  ["Registry compatibility", registry.metadata.id, registry],
  ["Model compatibility", model.metadata.id, model],
  ["Validation compatibility", validation.metadata.id, validation],
  ["Namespace compatibility", validation.metadata.namespace, validation.metadata],
  ["Public surface compatibility", validation.metadata.id, validation],
  ["Inventory compatibility", validation.metadata.id, validation.inventory],
  ["Platform compatibility", validation.metadata.id, validation],
] as const);

export const ChartMetricVisualizationManifestCompatibility:
readonly ChartMetricVisualizationManifestCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) =>
    Object.freeze({
      id: `EVE-5:5/Compatibility/${name.replaceAll(" ", "")}` as const,
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
