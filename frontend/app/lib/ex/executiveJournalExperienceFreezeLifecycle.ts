import type { ExecutiveJournalExperienceFreezeLifecycleState } from "./executiveJournalExperienceFreezeTypes.ts";

export const ExecutiveJournalExperienceFreezeLifecycleStates = Object.freeze([
  "Draft",
  "Prepared",
  "Validated",
  "Frozen",
  "ReadyForPublicIndex",
] as const satisfies readonly ExecutiveJournalExperienceFreezeLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Prepared"] as const),
  Prepared: Object.freeze(["Validated"] as const),
  Validated: Object.freeze(["Frozen"] as const),
  Frozen: Object.freeze(["ReadyForPublicIndex"] as const),
  ReadyForPublicIndex: Object.freeze([] as const),
});

export const ExecutiveJournalExperienceFreezeLifecycleSemantics = Object.freeze([
  Object.freeze({
    state: "Draft" as const,
    order: 1,
    meaning: "Freeze identity and metadata-only seal scope are drafted.",
  }),
  Object.freeze({
    state: "Prepared" as const,
    order: 2,
    meaning: "Locks, contracts, and upstream certification references are prepared.",
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
      "Freeze is complete; EX-2:9 Public Index remains separately unauthorized.",
  }),
] as const);

export const isExecutiveJournalExperienceFreezeLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceFreezeLifecycleState =>
  typeof value === "string"
  && ExecutiveJournalExperienceFreezeLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveJournalExperienceFreezeLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveJournalExperienceFreezeLifecycleState(from)
  && isExecutiveJournalExperienceFreezeLifecycleState(to)
  && transitions[from].some((candidate: string) => candidate === to);

export const assertExecutiveJournalExperienceFreezeLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (!canTransitionExecutiveJournalExperienceFreezeLifecycle(from, to)) {
    throw new Error(
      `Invalid EX-2:8 Freeze lifecycle transition: ${String(from)} → ${String(to)}`,
    );
  }
  return true;
};

export const ExecutiveJournalExperienceFreezeLifecycle = Object.freeze({
  lifecycleId: "EX-2:8/ExecutiveJournalExperienceFreezeLifecycle" as const,
  states: ExecutiveJournalExperienceFreezeLifecycleStates,
  semantics: ExecutiveJournalExperienceFreezeLifecycleSemantics,
  transitions,
  currentState: "ReadyForPublicIndex" as const,
  immediateForwardOnly: true as const,
  rollbackProhibited: true as const,
  executesTransitions: false as const,
  readyForPublicIndexAuthorizesEx29: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
