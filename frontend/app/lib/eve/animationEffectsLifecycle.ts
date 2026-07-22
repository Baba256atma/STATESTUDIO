import type { AnimationEffectsLifecycleState } from "./animationEffectsFoundationTypes.ts";

const lifecycleStates = Object.freeze([
  "Declared", "Registered", "Modeled", "Certified", "Frozen",
] as const satisfies readonly AnimationEffectsLifecycleState[]);

export const AnimationEffectsLifecycle = Object.freeze(lifecycleStates.map(
  (name, index) => Object.freeze({
    id: `EVE-7:1/Lifecycle/${name}` as const,
    name,
    description: `${name} animation and effects architecture metadata.`,
    deterministicOrder: index + 1,
    transitionsProvided: false,
    stateMachineProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
