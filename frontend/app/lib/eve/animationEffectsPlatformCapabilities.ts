import { AnimationEffectsManifestPlatform } from "./animationEffectsManifest.ts";
import type { AnimationEffectsPlatformCapability } from "./animationEffectsPlatformTypes.ts";

const capabilityNames = Object.freeze([
  "Architecture composition", "Metadata publication", "Inventory publication",
  "Foundation reference preservation", "Registry reference preservation",
  "Model reference preservation", "Validation reference preservation",
  "Manifest reference preservation", "Compatibility publication",
  "Certification readiness publication",
] as const);

export const AnimationEffectsPlatformCapabilities:
readonly AnimationEffectsPlatformCapability[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-7:6/Capability/${index + 1}` as const,
    name,
    description: `Declarative Platform capability: ${name}.`,
    manifestReference: AnimationEffectsManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
