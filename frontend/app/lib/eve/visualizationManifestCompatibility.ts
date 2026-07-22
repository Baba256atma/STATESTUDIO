import { VisualizationValidation } from "./visualizationValidation.ts";
import type { VisualizationManifestCompatibilityEntry } from "./visualizationManifestTypes.ts";

const model = VisualizationValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

const references = Object.freeze([
  ["FoundationCompatibility", foundation.identity.id],
  ["RegistryCompatibility", registry.metadata.id],
  ["ModelCompatibility", model.metadata.id],
  ["ValidationCompatibility", VisualizationValidation.metadata.id],
  ["ManifestCompatibility", "EVE-1:5/VisualizationManifest"],
  ["ForwardPlatformCompatibility", VisualizationValidation.metadata.id],
] as const);

export const VisualizationManifestCompatibility: readonly VisualizationManifestCompatibilityEntry[] =
  Object.freeze(references.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-1:5/Compatibility/${name}`,
    name,
    compatible: true,
    canonicalReference,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

