import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import type { GraphVisualizationManifestCompatibilityEntry } from "./graphVisualizationManifestTypes.ts";

const model = GraphVisualizationValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

const sources = Object.freeze([
  ["FoundationCompatibility", foundation.metadata.id, foundation],
  ["RegistryCompatibility", registry.metadata.id, registry],
  ["ModelCompatibility", model.metadata.id, model],
  ["ValidationCompatibility", GraphVisualizationValidation.metadata.id, GraphVisualizationValidation],
  ["NamespaceCompatibility", GraphVisualizationValidation.metadata.namespace, GraphVisualizationValidation.metadata],
  ["DependencyCompatibility", GraphVisualizationValidation.metadata.modelReference, GraphVisualizationValidation.metadata.dependency],
  ["PublicSurfaceCompatibility", GraphVisualizationValidation.metadata.id, GraphVisualizationValidation],
  ["FuturePlatformCompatibility", GraphVisualizationValidation.metadata.id, GraphVisualizationValidation],
] as const);

export const GraphVisualizationManifestCompatibility:
readonly GraphVisualizationManifestCompatibilityEntry[] = Object.freeze(
  sources.map(([name, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-3:5/Compatibility/${name}`,
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
