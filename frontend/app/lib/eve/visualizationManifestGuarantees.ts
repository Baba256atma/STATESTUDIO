import { VisualizationValidation } from "./visualizationValidation.ts";
import type { VisualizationManifestGuarantee } from "./visualizationManifestTypes.ts";

const names = Object.freeze([
  "ValidationCompleted", "ModelIntegrityPreserved", "RegistryIntegrityPreserved",
  "FoundationIntegrityPreserved", "CanonicalInventoriesPreserved",
  "DependencyChainPreserved", "PublicMetadataConsistency",
  "ArchitecturalBoundaryPreservation", "CanonicalReferencePreservation",
  "ManifestCompleteness", "VersionConsistency", "ReadyForPlatform",
] as const);

export const VisualizationManifestGuarantees: readonly VisualizationManifestGuarantee[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:5/Guarantee/${name}`,
    name,
    description: `Declarative EVE Manifest guarantee for ${name}.`,
    guaranteed: true,
    evidenceReference: VisualizationValidation.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

