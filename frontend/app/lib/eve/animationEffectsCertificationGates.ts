import type { AnimationEffectsCertificationGate } from "./animationEffectsCertificationTypes.ts";

const gateNames = Object.freeze([
  "Identity Verified", "Platform Verified", "Composition Verified",
  "Dependencies Verified", "Inventories Verified", "Capabilities Verified",
  "Guarantees Verified", "Compatibility Verified", "Namespace Verified",
  "Public Surface Verified", "Architecture Verified", "ReadyForFreeze",
] as const);

export const AnimationEffectsCertificationGates:
readonly AnimationEffectsCertificationGate[] = Object.freeze(
  gateNames.map((name, index) => Object.freeze({
    id: `EVE-7:7/Gate/${index + 1}` as const,
    name,
    outcome: "Passed" as const,
    description: `Deterministic declarative certification gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
