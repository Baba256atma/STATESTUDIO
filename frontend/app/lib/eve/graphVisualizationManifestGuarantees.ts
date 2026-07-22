import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import type { GraphVisualizationManifestGuarantee } from "./graphVisualizationManifestTypes.ts";

const names = Object.freeze([
  "FoundationPreserved", "RegistryPreserved", "ModelPreserved", "ValidationPreserved",
  "CanonicalCompositionPreserved", "CanonicalInventoriesPreserved",
  "CanonicalReferencesPreserved", "DependencyIntegrityPreserved",
  "CompatibilityPreserved", "ArchitecturalBoundariesPreserved",
  "MetadataImmutabilityPreserved", "ReadyForPlatform",
] as const);

export const GraphVisualizationManifestGuarantees:
readonly GraphVisualizationManifestGuarantee[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-3:5/Guarantee/${name}`,
    name,
    description: `Declarative Graph Visualization Manifest guarantee for ${name}.`,
    guaranteed: true,
    evidenceReference: GraphVisualizationValidation.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
