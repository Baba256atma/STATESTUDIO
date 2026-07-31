/**
 * EX-2:5 — Executive Journal Experience Manifest metadata lifecycle.
 */

import type { ExecutiveJournalExperienceManifestLifecycleState } from "./executiveJournalExperienceManifestTypes.ts";

export const ExecutiveJournalExperienceManifestLifecycleStates =
  Object.freeze([
    "Declared",
    "ValidationBound",
    "CapabilitiesDeclared",
    "Sealed",
    "ReadyForPlatform",
  ] as const satisfies readonly ExecutiveJournalExperienceManifestLifecycleState[]);

const transitions = Object.freeze({
  Declared: Object.freeze(["ValidationBound"] as const),
  ValidationBound: Object.freeze(["CapabilitiesDeclared"] as const),
  CapabilitiesDeclared: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze(["ReadyForPlatform"] as const),
  ReadyForPlatform: Object.freeze([] as const),
});

export const ExecutiveJournalExperienceManifestLifecycleSemantics =
  Object.freeze([
    Object.freeze({ state: "Declared" as const, order: 1, meaning: "Manifest identity and metadata-only scope are declared." }),
    Object.freeze({ state: "ValidationBound" as const, order: 2, meaning: "The exact Valid EX-2:4 evidence is bound." }),
    Object.freeze({ state: "CapabilitiesDeclared" as const, order: 3, meaning: "Capability, non-capability, and prerequisite catalogues are complete." }),
    Object.freeze({ state: "Sealed" as const, order: 4, meaning: "All Manifest declarations are immutable." }),
    Object.freeze({ state: "ReadyForPlatform" as const, order: 5, meaning: "Manifest metadata is complete without EX-2:6 authority." }),
  ] as const);

export const isExecutiveJournalExperienceManifestLifecycleState = (
  value: unknown,
): value is ExecutiveJournalExperienceManifestLifecycleState =>
  typeof value === "string"
  && ExecutiveJournalExperienceManifestLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveJournalExperienceManifestLifecycle = (
  from: unknown,
  to: unknown,
): boolean => {
  if (
    !isExecutiveJournalExperienceManifestLifecycleState(from)
    || !isExecutiveJournalExperienceManifestLifecycleState(to)
  ) {
    return false;
  }
  return transitions[from].some((candidate) => candidate === to);
};

export const assertExecutiveJournalExperienceManifestLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (!canTransitionExecutiveJournalExperienceManifestLifecycle(from, to)) {
    throw new Error(`Invalid EX-2:5 manifest lifecycle transition: ${from} → ${to}`);
  }
  return true;
};

export const ExecutiveJournalExperienceManifestLifecycle = Object.freeze({
  lifecycleId: "EX-2:5/ExecutiveJournalExperienceManifestLifecycle" as const,
  states: ExecutiveJournalExperienceManifestLifecycleStates,
  semantics: ExecutiveJournalExperienceManifestLifecycleSemantics,
  transitions,
  currentState: "ReadyForPlatform" as const,
  immediateForwardOnly: true as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  readyForPlatformAuthorizesEx26: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
