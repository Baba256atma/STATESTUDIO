import { SceneRenderingValidation } from "./sceneRenderingValidation.ts";
import type { SceneRenderingManifestCompatibilityEntry } from "./sceneRenderingManifestTypes.ts";

const model = SceneRenderingValidation.model;
const registry = model.registry;
const foundation = registry.foundation;

const references = Object.freeze([
  ["FoundationCompatibility", foundation.identity.id],
  ["RegistryCompatibility", registry.metadata.id],
  ["ModelCompatibility", model.metadata.id],
  ["ValidationCompatibility", SceneRenderingValidation.metadata.id],
  ["NamespaceCompatibility", SceneRenderingValidation.metadata.namespace],
  ["DependencyCompatibility", SceneRenderingValidation.metadata.id],
  ["PublicSurfaceCompatibility", SceneRenderingValidation.metadata.id],
  ["FuturePlatformCompatibility", SceneRenderingValidation.metadata.id],
] as const);

export const SceneRenderingManifestCompatibility: readonly SceneRenderingManifestCompatibilityEntry[] =
  Object.freeze(references.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-2:5/Compatibility/${name}`,
    name,
    compatible: true,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })));
