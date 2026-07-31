/**
 * EX-2:3 — Executive Journal Experience Model lifecycle.
 *
 * Package-construction lifecycle only; never a journal runtime lifecycle.
 */

import type { ExecutiveJournalExperienceModelLifecycleState } from "./executiveJournalExperienceModelTypes.ts";

export const ExecutiveJournalExperienceModelLifecycleStates = Object.freeze([
  "Declared",
  "UpstreamBound",
  "EntityModelConstructed",
  "Sealed",
  "ReadyForValidation",
] as const satisfies readonly ExecutiveJournalExperienceModelLifecycleState[]);

const lifecycleTransitions = Object.freeze({
  Declared: Object.freeze(["UpstreamBound"] as const),
  UpstreamBound: Object.freeze(["EntityModelConstructed"] as const),
  EntityModelConstructed: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze(["ReadyForValidation"] as const),
  ReadyForValidation: Object.freeze([] as const),
});

export const isExecutiveJournalExperienceModelLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceModelLifecycleState =>
  typeof value === "string"
  && ExecutiveJournalExperienceModelLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveJournalExperienceModelLifecycle = (
  from: unknown,
  to: unknown,
): boolean => {
  if (
    !isExecutiveJournalExperienceModelLifecycleState(from)
    || !isExecutiveJournalExperienceModelLifecycleState(to)
  ) {
    return false;
  }
  return lifecycleTransitions[from].some((candidate) => candidate === to);
};

export const assertExecutiveJournalExperienceModelLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (!canTransitionExecutiveJournalExperienceModelLifecycle(from, to)) {
    throw new Error(`Invalid EX-2:3 model lifecycle transition: ${from} → ${to}`);
  }
  return true;
};

export const ExecutiveJournalExperienceModelLifecycle = Object.freeze({
  lifecycleId: "EX-2:3/ExecutiveJournalExperienceModelLifecycle" as const,
  states: ExecutiveJournalExperienceModelLifecycleStates,
  transitions: lifecycleTransitions,
  currentState: "ReadyForValidation" as const,
  ordered: true as const,
  forwardOnly: true as const,
  executesTransitions: false as const,
  journalRuntimeLifecycle: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
