import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";
import type { SceneRenderingManifestGuarantee } from "./sceneRenderingManifestTypes.ts";

const names = Object.freeze([
  "FoundationPreserved", "RegistryPreserved", "ModelPreserved",
  "ValidationPreserved", "CanonicalReferencesPreserved",
  "CanonicalInventoriesPreserved", "DependencyChainPreserved",
  "CompatibilityPreserved", "ArchitecturalBoundariesPreserved",
  "PublicMetadataConsistency", "VersionConsistency", "ReadyForPlatform",
] as const);

export const SceneRenderingManifestGuarantees: readonly SceneRenderingManifestGuarantee[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:5/Guarantee/${name}`,
    name,
    description: `Declarative Scene Rendering Manifest guarantee for ${name}.`,
    guaranteed: true,
    evidenceReference: SceneRenderingValidation.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
