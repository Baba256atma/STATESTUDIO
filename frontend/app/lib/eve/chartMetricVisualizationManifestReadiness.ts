import type { ChartMetricVisualizationManifestReadinessEntry } from "./chartMetricVisualizationManifestTypes.ts";
import { ChartMetricVisualizationValidationPlatform } from "./chartMetricVisualizationValidation.ts";

const validation = ChartMetricVisualizationValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phaseSources = Object.freeze([
  ["Foundation", foundation.metadata.id, foundation],
  ["Registry", registry.metadata.id, registry],
  ["Model", model.metadata.id, model],
  ["Validation", validation.metadata.id, validation],
  ["Manifest", "EVE-5:5/ChartMetricVisualizationManifest", null],
] as const);

export const ChartMetricVisualizationManifestComposition = Object.freeze(
  phaseSources.map(([phase, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-5:5/Composition/${phase}` as const,
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
  "FoundationReady", "RegistryReady", "ModelReady", "ValidationReady", "InventoryReady",
  "MetadataReady", "ReadyForPlatform",
] as const);

export const ChartMetricVisualizationManifestReadiness:
readonly ChartMetricVisualizationManifestReadinessEntry[] = Object.freeze(readinessNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:5/Readiness/${name}` as const,
    name,
    ready: true as const,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
