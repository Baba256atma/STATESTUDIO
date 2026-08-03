/** EX-3:8 forward-only Freeze lifecycle. */

import type { ExecutiveTimelineExperienceFreezeLifecycleState } from "./executiveTimelineExperienceFreezeTypes.ts";

export const ExecutiveTimelineExperienceFreezeLifecycleStates = Object.freeze([
  "Draft",
  "Prepared",
  "Validated",
  "Frozen",
  "ReadyForPublicIndex",
] as const satisfies readonly ExecutiveTimelineExperienceFreezeLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Prepared"] as const),
  Prepared: Object.freeze(["Validated"] as const),
  Validated: Object.freeze(["Frozen"] as const),
  Frozen: Object.freeze(["ReadyForPublicIndex"] as const),
  ReadyForPublicIndex: Object.freeze([] as const),
});

export const ExecutiveTimelineExperienceFreezeLifecycleSemantics = Object.freeze([
  Object.freeze({
    state: "Draft" as const,
    order: 1,
    meaning: "Freeze identity and metadata-only seal scope are drafted.",
  }),
  Object.freeze({
    state: "Prepared" as const,
    order: 2,
    meaning:
      "Locks, contracts, and upstream certification references are prepared.",
  }),
  Object.freeze({
    state: "Validated" as const,
    order: 3,
    meaning: "Architectural locks and authorization references are validated.",
  }),
  Object.freeze({
    state: "Frozen" as const,
    order: 4,
    meaning: "Certified metadata is permanently sealed as the Freeze artifact.",
  }),
  Object.freeze({
    state: "ReadyForPublicIndex" as const,
    order: 5,
    meaning:
      "Freeze is complete; EX-3:9 Public Index remains separately unauthorized.",
  }),
] as const);

export const isExecutiveTimelineExperienceFreezeLifecycleState = (
  value: unknown,
): value is ExecutiveTimelineExperienceFreezeLifecycleState =>
  typeof value === "string"
  && ExecutiveTimelineExperienceFreezeLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveTimelineExperienceFreezeLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveTimelineExperienceFreezeLifecycleState(from)
  && isExecutiveTimelineExperienceFreezeLifecycleState(to)
  && transitions[from].some((candidate) => candidate === to);

export const assertExecutiveTimelineExperienceFreezeLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (!canTransitionExecutiveTimelineExperienceFreezeLifecycle(from, to)) {
    throw new Error(
      `Invalid EX-3:8 Freeze lifecycle transition: ${String(from)} → ${String(to)}`,
    );
  }
  return true;
};

export const ExecutiveTimelineExperienceFreezeLifecycle = Object.freeze({
  lifecycleId: "EX-3:8/ExecutiveTimelineExperienceFreezeLifecycle" as const,
  states: ExecutiveTimelineExperienceFreezeLifecycleStates,
  semantics: ExecutiveTimelineExperienceFreezeLifecycleSemantics,
  transitions,
  currentState: "ReadyForPublicIndex" as const,
  immediateForwardOnly: true as const,
  rollbackAllowed: false as const,
  executesTransitions: false as const,
  readyForPublicIndexAuthorizesEx39: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
