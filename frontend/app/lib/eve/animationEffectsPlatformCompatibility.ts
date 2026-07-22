import { AnimationEffectsManifestPlatform } from "./animationEffectsManifest.ts";
import type { AnimationEffectsPlatformCompatibilityEntry } from "./animationEffectsPlatformTypes.ts";

const manifest = AnimationEffectsManifestPlatform;
const composition = manifest.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility", composition[0]!.canonicalReference,
    composition[0]!.canonicalSource],
  ["Registry compatibility", composition[1]!.canonicalReference,
    composition[1]!.canonicalSource],
  ["Model compatibility", composition[2]!.canonicalReference,
    composition[2]!.canonicalSource],
  ["Validation compatibility", composition[3]!.canonicalReference,
    composition[3]!.canonicalSource],
  ["Manifest compatibility", manifest.metadata.id, manifest],
  ["Namespace compatibility", manifest.metadata.namespace, manifest.metadata],
  ["Dependency compatibility", manifest.metadata.id,
    manifest.metadata.dependency],
  ["Future Certification compatibility", manifest.metadata.id, manifest],
] as const);

export const AnimationEffectsPlatformCompatibility:
readonly AnimationEffectsPlatformCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) =>
    Object.freeze({
      id: `EVE-7:6/Compatibility/${index + 1}` as const,
      name,
      compatible: true as const,
      canonicalReference,
      canonicalSource,
      deterministicOrder: index + 1,
      runtimeVerification: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
