import type { AnimationEffectsValidationGate } from "./animationEffectsValidationTypes.ts";

const gateNames = Object.freeze([
  "Identity Verified", "Registry Verified", "Model Verified",
  "Relationships Verified", "Ownership Verified", "Boundaries Verified",
  "Lifecycle Verified", "Capabilities Verified", "Inventory Verified",
  "Dependencies Verified", "Architecture Verified", "ReadyForManifest",
] as const);

export const AnimationEffectsValidationGates:
readonly AnimationEffectsValidationGate[] = Object.freeze(gateNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:4/Gate/${index + 1}` as const,
    name,
    outcome: "Passed" as const,
    description: `Deterministic declarative validation gate: ${name}.`,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

const readinessNames = Object.freeze([
  "Identity Ready", "References Ready", "Model Ready", "Relationships Ready",
  "Inventory Ready", "Dependencies Ready", "ReadyForManifest",
] as const);

export const AnimationEffectsValidationReadinessDeclarations = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-7:4/Readiness/${index + 1}` as const,
    name,
    declared: true,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })),
);
