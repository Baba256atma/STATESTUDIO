import { AnimationEffectsCertificationPlatform } from "./animationEffectsCertification.ts";
import type { AnimationEffectsFrozenBaseline } from "./animationEffectsFreezeTypes.ts";

const certification = AnimationEffectsCertificationPlatform;
const platform = certification.platform;
const baselineSources = Object.freeze([
  ["Certified platform", platform],
  ["Certification status", certification.readiness],
  ["Platform capabilities", platform.capabilities],
  ["Platform guarantees", platform.guarantees],
  ["Compatibility declarations", platform.compatibility],
  ["Dependency graph", platform.metadata.dependency],
  ["Inventory publication", platform.inventory],
  ["Architectural metadata", platform.metadata],
] as const);

export const AnimationEffectsFrozenBaselines:
readonly AnimationEffectsFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-7:8/Baseline/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
