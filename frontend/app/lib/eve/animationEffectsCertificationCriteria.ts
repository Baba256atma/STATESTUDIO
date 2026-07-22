import { AnimationEffectsPlatform } from "./animationEffectsPlatform.ts";
import type { AnimationEffectsCertificationCriterion } from "./animationEffectsCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Platform identity integrity", "Canonical phase composition integrity",
  "Foundation preservation", "Registry preservation", "Model preservation",
  "Validation preservation", "Manifest preservation", "Dependency integrity",
  "Canonical reference integrity", "Inventory consistency",
  "Capability consistency", "Guarantee consistency", "Compatibility consistency",
  "Namespace integrity", "Canonical Inventory Rule compliance",
  "Architectural boundary compliance",
] as const);

export const AnimationEffectsCertificationCriteria:
readonly AnimationEffectsCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-7:7/Criterion/${index + 1}` as const,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: AnimationEffectsPlatform.metadata.id,
    status: "Certified" as const,
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
