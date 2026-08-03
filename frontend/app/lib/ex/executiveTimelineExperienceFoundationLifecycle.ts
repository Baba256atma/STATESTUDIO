import type { ExecutiveTimelineExperienceFoundationLifecycleState } from "./executiveTimelineExperienceFoundationTypes.ts";

export const ExecutiveTimelineExperienceFoundationLifecycleStates =
  Object.freeze([
    "Draft",
    "Defined",
    "Reviewed",
    "Foundation",
    "ReadyForRegistry",
  ] as const satisfies readonly ExecutiveTimelineExperienceFoundationLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Defined"] as const),
  Defined: Object.freeze(["Reviewed"] as const),
  Reviewed: Object.freeze(["Foundation"] as const),
  Foundation: Object.freeze(["ReadyForRegistry"] as const),
  ReadyForRegistry: Object.freeze([] as const),
});

export const ExecutiveTimelineExperienceFoundationLifecycleSemantics =
  Object.freeze([
    Object.freeze({
      state: "Draft" as const,
      order: 1,
      meaning: "Timeline Experience Foundation identity and scope are drafted.",
    }),
    Object.freeze({
      state: "Defined" as const,
      order: 2,
      meaning:
        "Mission, capabilities, non-capabilities, and contracts are defined.",
    }),
    Object.freeze({
      state: "Reviewed" as const,
      order: 3,
      meaning: "Boundaries and dependency declarations are reviewed.",
    }),
    Object.freeze({
      state: "Foundation" as const,
      order: 4,
      meaning: "Foundation metadata is sealed as the architectural base.",
    }),
    Object.freeze({
      state: "ReadyForRegistry" as const,
      order: 5,
      meaning:
        "Foundation is complete; EX-3:2 Registry remains separately unauthorized.",
    }),
  ] as const);

export const isExecutiveTimelineExperienceFoundationLifecycleState = (
  value: unknown,
): value is ExecutiveTimelineExperienceFoundationLifecycleState =>
  typeof value === "string"
  && ExecutiveTimelineExperienceFoundationLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveTimelineExperienceFoundationLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveTimelineExperienceFoundationLifecycleState(from)
  && isExecutiveTimelineExperienceFoundationLifecycleState(to)
  && transitions[from].some((candidate: string) => candidate === to);

export const assertExecutiveTimelineExperienceFoundationLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (
    !canTransitionExecutiveTimelineExperienceFoundationLifecycle(from, to)
  ) {
    throw new Error(
      `Invalid EX-3:1 Foundation lifecycle transition: ${String(from)} → ${String(to)}`,
    );
  }
  return true;
};

export const ExecutiveTimelineExperienceFoundationLifecycle = Object.freeze({
  lifecycleId: "EX-3:1/ExecutiveTimelineExperienceFoundationLifecycle" as const,
  states: ExecutiveTimelineExperienceFoundationLifecycleStates,
  semantics: ExecutiveTimelineExperienceFoundationLifecycleSemantics,
  transitions,
  currentState: "ReadyForRegistry" as const,
  immediateForwardOnly: true as const,
  rollbackProhibited: true as const,
  executesTransitions: false as const,
  readyForRegistryAuthorizesEx32: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
