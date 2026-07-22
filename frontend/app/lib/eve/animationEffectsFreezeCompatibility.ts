import { AnimationEffectsCertificationPlatform } from "./animationEffectsCertification.ts";
import type { AnimationEffectsFreezeDeclaration } from "./animationEffectsFreezeTypes.ts";

const certification = AnimationEffectsCertificationPlatform;
const composition = certification.platform.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility", composition[0]],
  ["Registry compatibility", composition[1]],
  ["Model compatibility", composition[2]],
  ["Validation compatibility", composition[3]],
  ["Manifest compatibility", composition[4]],
  ["Platform compatibility", certification.platform],
  ["Namespace compatibility", certification.metadata.namespace],
  ["Future Public Index compatibility", certification.readiness],
] as const);

export const AnimationEffectsFreezeCompatibility:
readonly AnimationEffectsFreezeDeclaration[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-7:8/Compatibility/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
