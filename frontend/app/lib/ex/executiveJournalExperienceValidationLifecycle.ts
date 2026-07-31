/**
 * EX-2:4 — Executive Journal Experience Validation lifecycle.
 */

import type { ExecutiveJournalExperienceValidationLifecycleState } from "./executiveJournalExperienceValidationTypes.ts";

export const ExecutiveJournalExperienceValidationLifecycleStates =
  Object.freeze([
    "Declared",
    "UpstreamBound",
    "RulesConstructed",
    "Sealed",
    "ReadyForManifest",
  ] as const satisfies readonly ExecutiveJournalExperienceValidationLifecycleState[]);

const transitions = Object.freeze({
  Declared: Object.freeze(["UpstreamBound"] as const),
  UpstreamBound: Object.freeze(["RulesConstructed"] as const),
  RulesConstructed: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze(["ReadyForManifest"] as const),
  ReadyForManifest: Object.freeze([] as const),
});

export const ExecutiveJournalExperienceValidationLifecycleSemantics =
  Object.freeze([
    Object.freeze({
      state: "Declared" as const,
      order: 1,
      meaning: "Validation identity and scope are declared.",
    }),
    Object.freeze({
      state: "UpstreamBound" as const,
      order: 2,
      meaning: "The exact EX-2:3 Model reference is bound.",
    }),
    Object.freeze({
      state: "RulesConstructed" as const,
      order: 3,
      meaning: "The closed canonical rule catalogue is complete.",
    }),
    Object.freeze({
      state: "Sealed" as const,
      order: 4,
      meaning: "Validation metadata and rule catalogues are immutable.",
    }),
    Object.freeze({
      state: "ReadyForManifest" as const,
      order: 5,
      meaning: "Validation contract is complete without EX-2:5 authority.",
    }),
  ] as const);

export const isExecutiveJournalExperienceValidationLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceValidationLifecycleState =>
  typeof value === "string"
  && ExecutiveJournalExperienceValidationLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveJournalExperienceValidationLifecycle = (
  from: unknown,
  to: unknown,
): boolean => {
  if (
    !isExecutiveJournalExperienceValidationLifecycleState(from)
    || !isExecutiveJournalExperienceValidationLifecycleState(to)
  ) {
    return false;
  }
  return transitions[from].some((candidate) => candidate === to);
};

export const assertExecutiveJournalExperienceValidationLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (!canTransitionExecutiveJournalExperienceValidationLifecycle(from, to)) {
    throw new Error(`Invalid EX-2:4 validation lifecycle transition: ${from} → ${to}`);
  }
  return true;
};

export const ExecutiveJournalExperienceValidationLifecycle = Object.freeze({
  lifecycleId:
    "EX-2:4/ExecutiveJournalExperienceValidationLifecycle" as const,
  states: ExecutiveJournalExperienceValidationLifecycleStates,
  semantics: ExecutiveJournalExperienceValidationLifecycleSemantics,
  transitions,
  currentState: "ReadyForManifest" as const,
  immediateForwardOnly: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  readyForManifestDoesNotAuthorizeEx25: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
