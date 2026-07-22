import { VisualizationManifest } from "./visualizationManifest.ts";
import type { VisualizationPlatformGuarantee } from "./visualizationPlatformTypes.ts";

const names = Object.freeze([
  "FoundationPreserved", "RegistryPreserved", "ModelPreserved",
  "ValidationPreserved", "ManifestPreserved", "CanonicalInventoriesPreserved",
  "CanonicalReferencesPreserved", "CompatibilityPreserved",
  "StablePlatformIdentity", "PublicExportConsistency",
  "ArchitecturalIntegrity", "ReadyForCertification",
] as const);

export const VisualizationPlatformGuarantees: readonly VisualizationPlatformGuarantee[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:6/Guarantee/${name}`,
    name,
    guaranteed: true,
    manifestReference: VisualizationManifest.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

