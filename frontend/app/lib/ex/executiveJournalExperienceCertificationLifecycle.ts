import type { ExecutiveJournalExperienceCertificationLifecycleState } from "./executiveJournalExperienceCertificationTypes.ts";

export const ExecutiveJournalExperienceCertificationLifecycleStates =
  Object.freeze([
    "Draft",
    "Prepared",
    "Review",
    "Certified",
    "ReadyForFreeze",
  ] as const satisfies readonly ExecutiveJournalExperienceCertificationLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Prepared"] as const),
  Prepared: Object.freeze(["Review"] as const),
  Review: Object.freeze(["Certified"] as const),
  Certified: Object.freeze(["ReadyForFreeze"] as const),
  ReadyForFreeze: Object.freeze([] as const),
});

export const ExecutiveJournalExperienceCertificationLifecycleSemantics =
  Object.freeze([
    Object.freeze({
      state: "Draft" as const,
      order: 1,
      meaning: "Certification identity and metadata-only scope are drafted.",
    }),
    Object.freeze({
      state: "Prepared" as const,
      order: 2,
      meaning: "Evidence references and criteria catalogues are prepared.",
    }),
    Object.freeze({
      state: "Review" as const,
      order: 3,
      meaning: "Contracts, boundaries, and authorization references are reviewed.",
    }),
    Object.freeze({
      state: "Certified" as const,
      order: 4,
      meaning: "Platform architectural requirements are certified as satisfied.",
    }),
    Object.freeze({
      state: "ReadyForFreeze" as const,
      order: 5,
      meaning:
        "Certification is complete; EX-2:8 Freeze remains separately unauthorized.",
    }),
  ] as const);

export const isExecutiveJournalExperienceCertificationLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceCertificationLifecycleState =>
  typeof value === "string"
  && ExecutiveJournalExperienceCertificationLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveJournalExperienceCertificationLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveJournalExperienceCertificationLifecycleState(from)
  && isExecutiveJournalExperienceCertificationLifecycleState(to)
  && transitions[from].some((candidate: string) => candidate === to);

export const assertExecutiveJournalExperienceCertificationLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (
    !canTransitionExecutiveJournalExperienceCertificationLifecycle(from, to)
  ) {
    throw new Error(
      `Invalid EX-2:7 Certification lifecycle transition: ${String(from)} → ${String(to)}`,
    );
  }
  return true;
};

export const ExecutiveJournalExperienceCertificationLifecycle = Object.freeze({
  lifecycleId: "EX-2:7/ExecutiveJournalExperienceCertificationLifecycle" as const,
  states: ExecutiveJournalExperienceCertificationLifecycleStates,
  semantics: ExecutiveJournalExperienceCertificationLifecycleSemantics,
  transitions,
  currentState: "ReadyForFreeze" as const,
  immediateForwardOnly: true as const,
  rollbackProhibited: true as const,
  executesTransitions: false as const,
  readyForFreezeAuthorizesEx28: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
