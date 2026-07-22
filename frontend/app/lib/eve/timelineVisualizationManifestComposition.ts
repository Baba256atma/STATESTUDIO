import { TimelineVisualizationValidationPlatform } from "./timelineVisualizationValidation.ts";
import type { TimelineVisualizationManifestReadinessEntry } from "./timelineVisualizationManifestTypes.ts";

const validation = TimelineVisualizationValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phaseSources = Object.freeze([
  ["Foundation", foundation.metadata.id, foundation],
  ["Registry", registry.metadata.id, registry],
  ["Model", model.metadata.id, model],
  ["Validation", validation.metadata.id, validation],
  ["Manifest", "EVE-4:5/TimelineVisualizationManifest", null],
] as const);

export const TimelineVisualizationManifestComposition = Object.freeze(
  phaseSources.map(([phase, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-4:5/Composition/${phase}`,
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
  "ManifestComplete", "CompositionVerified", "InventoryVerified",
  "CompatibilityVerified", "DependencyVerified", "MetadataVerified", "ReadyForPlatform",
] as const);

export const TimelineVisualizationManifestReadiness:
readonly TimelineVisualizationManifestReadinessEntry[] = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-4:5/Readiness/${name}`,
    name,
    ready: true,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
