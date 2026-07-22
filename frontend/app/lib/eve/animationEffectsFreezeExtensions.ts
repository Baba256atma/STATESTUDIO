import { AnimationEffectsCertificationPlatform } from "./animationEffectsCertification.ts";
import type { AnimationEffectsFreezeDeclaration } from "./animationEffectsFreezeTypes.ts";

const certification = AnimationEffectsCertificationPlatform;
const extensionNames = Object.freeze([
  "Animation extensions", "Transition extensions", "Effect extensions",
  "Timing extensions", "Motion extensions", "Policy extensions",
  "Profile extensions", "Runtime implementation extensions",
] as const);

export const AnimationEffectsFreezeExtensions:
readonly AnimationEffectsFreezeDeclaration[] = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-7:8/Extension/${index + 1}` as const,
    name,
    canonicalReference: certification,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
