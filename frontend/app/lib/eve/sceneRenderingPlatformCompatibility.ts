import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import type { SceneRenderingPlatformCompatibilityEntry } from "./sceneRenderingPlatformTypes.ts";

const references = SceneRenderingManifest.inventory.canonicalReferences;
const seeds = Object.freeze([
  ["FoundationCompatibility", references[0]!],
  ["RegistryCompatibility", references[1]!],
  ["ModelCompatibility", references[2]!],
  ["ValidationCompatibility", references[3]!],
  ["ManifestCompatibility", SceneRenderingManifest.metadata.id],
  ["NamespaceCompatibility", SceneRenderingManifest.metadata.namespace],
  ["DependencyCompatibility", SceneRenderingManifest.metadata.validationReference],
  ["FutureCertificationCompatibility", SceneRenderingManifest.metadata.id],
] as const);

export const SceneRenderingPlatformCompatibility: readonly SceneRenderingPlatformCompatibilityEntry[] =
  Object.freeze(seeds.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-2:6/Compatibility/${name}`,
    name,
    compatible: true,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })));
