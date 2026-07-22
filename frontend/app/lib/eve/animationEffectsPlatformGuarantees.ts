import { AnimationEffectsManifestPlatform } from "./animationEffectsManifest.ts";
import type { AnimationEffectsPlatformGuarantee } from "./animationEffectsPlatformTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Manifest preserved",
  "Canonical phase composition preserved", "Canonical inventories preserved",
  "Canonical references preserved", "Dependency chain preserved",
  "Compatibility preserved", "Architectural boundaries preserved",
  "ReadyForCertification",
] as const);

export const AnimationEffectsPlatformGuarantees:
readonly AnimationEffectsPlatformGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-7:6/Guarantee/${index + 1}` as const,
    name,
    guaranteed: true as const,
    manifestReference: AnimationEffectsManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
