import { TimelineVisualizationValidationPlatform } from "./timelineVisualizationValidation.ts";
import type { TimelineVisualizationManifestCompatibilityEntry } from "./timelineVisualizationManifestTypes.ts";

const validation = TimelineVisualizationValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility", foundation.metadata.id, foundation],
  ["Registry compatibility", registry.metadata.id, registry],
  ["Model compatibility", model.metadata.id, model],
  ["Validation compatibility", validation.metadata.id, validation],
  ["Namespace compatibility", validation.metadata.namespace, validation.metadata],
  ["Dependency compatibility", validation.metadata.modelReference, validation.metadata.dependency],
  ["Public surface compatibility", validation.metadata.id, validation],
  ["Platform compatibility", validation.metadata.id, validation],
] as const);

export const TimelineVisualizationManifestCompatibility:
readonly TimelineVisualizationManifestCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-4:5/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    compatible: true,
    canonicalReference,
    canonicalSource,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })),
);
