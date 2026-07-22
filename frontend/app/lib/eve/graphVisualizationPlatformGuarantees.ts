import { GraphVisualizationManifest } from "./graphVisualizationManifest.ts";
import type { GraphVisualizationPlatformGuarantee } from "./graphVisualizationPlatformTypes.ts";

const names = Object.freeze([
  "FoundationPreserved", "RegistryPreserved", "ModelPreserved", "ValidationPreserved",
  "ManifestPreserved", "CanonicalCompositionPreserved", "CanonicalReferencesPreserved",
  "CanonicalInventoriesPreserved", "CompatibilityPreserved",
  "DependencyIntegrityPreserved", "MetadataImmutabilityPreserved",
  "ReadyForCertification",
] as const);

export const GraphVisualizationPlatformGuarantees:
readonly GraphVisualizationPlatformGuarantee[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-3:6/Guarantee/${name}`,
    name,
    guaranteed: true,
    manifestReference: GraphVisualizationManifest.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
