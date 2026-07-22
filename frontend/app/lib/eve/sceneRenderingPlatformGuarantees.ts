import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import type { SceneRenderingPlatformGuarantee } from "./sceneRenderingPlatformTypes.ts";

const names = Object.freeze([
  "FoundationPreserved", "RegistryPreserved", "ModelPreserved",
  "ValidationPreserved", "ManifestPreserved", "CanonicalPhaseCompositionPreserved",
  "CanonicalInventoriesPreserved", "CanonicalReferencesPreserved",
  "DependencyChainPreserved", "CompatibilityMetadataPreserved",
  "ArchitecturalBoundariesPreserved", "ReadyForCertification",
] as const);

export const SceneRenderingPlatformGuarantees: readonly SceneRenderingPlatformGuarantee[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:6/Guarantee/${name}`,
    name,
    guaranteed: true,
    manifestReference: SceneRenderingManifest.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
