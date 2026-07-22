import type { AnimationEffectsManifestGuarantee } from "./animationEffectsManifestTypes.ts";
import { AnimationEffectsValidationPlatform } from "./animationEffectsValidation.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved",
  "Validation preserved", "Canonical references preserved",
  "Canonical inventories preserved", "Dependency chain preserved",
  "Compatibility preserved", "Architectural boundaries preserved",
  "Public metadata consistency", "Version consistency", "ReadyForPlatform",
] as const);

export const AnimationEffectsManifestGuarantees:
readonly AnimationEffectsManifestGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-7:5/Guarantee/${index + 1}` as const,
    name,
    description: `Declarative Manifest guarantee: ${name}.`,
    guaranteed: true as const,
    evidenceReference: AnimationEffectsValidationPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
