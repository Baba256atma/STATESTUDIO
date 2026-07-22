import { SceneRenderingPlatform } from "./sceneRenderingPlatform.ts";
import type { SceneRenderingCertificationCompatibilityEntry } from "./sceneRenderingCertificationTypes.ts";

const names = Object.freeze([
  "PlatformCompatibility", "ManifestCompatibility", "ValidationCompatibility",
  "RegistryCompatibility", "FoundationCompatibility", "NamespaceCompatibility",
  "DependencyCompatibility", "FutureFreezeCompatibility",
] as const);

const upstreamReferences = SceneRenderingPlatform.inventory.upstreamCanonicalReferences;
const references = Object.freeze([
  SceneRenderingPlatform.metadata.id,
  SceneRenderingPlatform.metadata.manifestReference,
  upstreamReferences[3]!,
  upstreamReferences[1]!,
  upstreamReferences[0]!,
  SceneRenderingPlatform.metadata.namespace,
  SceneRenderingPlatform.metadata.manifestReference,
  SceneRenderingPlatform.metadata.id,
] as const);

export const SceneRenderingCertificationCompatibility: readonly SceneRenderingCertificationCompatibilityEntry[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:7/Compatibility/${name}`,
    name,
    certified: true,
    canonicalReference: references[index]!,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })));
