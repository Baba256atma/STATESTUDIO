import type { VisualizationPlatformManifestReadinessEntry } from "./visualizationPlatformManifestTypes.ts";
import { VisualizationPlatformValidationPlatform } from "./visualizationPlatformValidation.ts";

const validation = VisualizationPlatformValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phaseSources = Object.freeze([
  ["Foundation", foundation.metadata.id, foundation],
  ["Registry", registry.metadata.id, registry],
  ["Model", model.metadata.id, model],
  ["Validation", validation.metadata.id, validation],
  ["Manifest", "EVE-8:5/VisualizationPlatformManifest", null],
] as const);

export const VisualizationPlatformManifestComposition = Object.freeze(
  phaseSources.map(([phase, canonicalReference, canonicalSource], index) =>
    Object.freeze({
      id: `EVE-8:5/Composition/${phase}` as const,
      phase,
      canonicalReference,
      canonicalSource,
      preservedByReference: true,
      deterministicOrder: index + 1,
      metadataOnly: true,
      immutable: true,
    })),
);

const readinessNames = Object.freeze([
  "ReadyForPlatform", "ManifestComplete", "ValidationSatisfied",
  "DependencySatisfied", "CompatibilitySatisfied", "InventoryPublished",
  "GuaranteePublished",
] as const);

export const VisualizationPlatformManifestReadiness:
readonly VisualizationPlatformManifestReadinessEntry[] = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-8:5/Readiness/${name}` as const,
    name,
    ready: true as const,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
