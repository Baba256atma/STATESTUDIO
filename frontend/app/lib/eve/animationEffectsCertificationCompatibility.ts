import { AnimationEffectsPlatform } from "./animationEffectsPlatform.ts";
import type { AnimationEffectsCertificationCompatibilityEntry } from "./animationEffectsCertificationTypes.ts";

const platform = AnimationEffectsPlatform;
const composition = platform.composition;
const verificationSources = Object.freeze([
  ["Foundation compatibility", composition[0]!.canonicalReference],
  ["Registry compatibility", composition[1]!.canonicalReference],
  ["Model compatibility", composition[2]!.canonicalReference],
  ["Validation compatibility", composition[3]!.canonicalReference],
  ["Manifest compatibility", composition[4]!.canonicalReference],
  ["Namespace compatibility", platform.metadata.namespace],
  ["Dependency compatibility", platform.metadata.id],
  ["Future Freeze compatibility", platform.metadata.id],
] as const);

export const AnimationEffectsCertificationCompatibility:
readonly AnimationEffectsCertificationCompatibilityEntry[] = Object.freeze(
  verificationSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-7:7/Compatibility/${index + 1}` as const,
    name,
    verified: true as const,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeVerification: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
