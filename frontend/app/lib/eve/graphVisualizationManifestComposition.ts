import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import type { GraphVisualizationManifestReadinessEntry } from "./graphVisualizationManifestTypes.ts";

const model = GraphVisualizationValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phaseSources = Object.freeze([
  ["Foundation", foundation.metadata.id, foundation],
  ["Registry", registry.metadata.id, registry],
  ["Model", model.metadata.id, model],
  ["Validation", GraphVisualizationValidation.metadata.id, GraphVisualizationValidation],
] as const);

export const GraphVisualizationManifestComposition = Object.freeze([
  ...phaseSources.map(([phase, canonicalReference, canonicalPhase], index) => Object.freeze({
    phase,
    canonicalReference,
    canonicalPhase,
    preservedByReference: true,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
  Object.freeze({
    phase: "Manifest",
    canonicalReference: "EVE-3:5/GraphVisualizationManifest",
    canonicalPhase: "EVE-3:5/GraphVisualizationManifest",
    preservedByReference: true,
    deterministicOrder: phaseSources.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
]);

const readinessNames = Object.freeze([
  "ManifestComplete", "CompositionVerified", "InventoryVerified",
  "CompatibilityVerified", "DependencyVerified", "MetadataVerified",
  "ReadyForPlatform",
] as const);

export const GraphVisualizationManifestReadiness:
readonly GraphVisualizationManifestReadinessEntry[] = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-3:5/Readiness/${name}`,
    name,
    ready: true,
    validationReference: GraphVisualizationValidation.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
