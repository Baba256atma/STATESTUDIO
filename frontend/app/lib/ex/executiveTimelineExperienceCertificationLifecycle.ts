/** EX-3:7 forward-only Certification lifecycle. */

import type { ExecutiveTimelineExperienceCertificationLifecycleState } from "./executiveTimelineExperienceCertificationTypes.ts";

export const ExecutiveTimelineExperienceCertificationLifecycleStates =
  Object.freeze([
    "Draft",
    "Prepared",
    "Review",
    "Certified",
    "ReadyForFreeze",
  ] as const satisfies readonly ExecutiveTimelineExperienceCertificationLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Prepared"] as const),
  Prepared: Object.freeze(["Review"] as const),
  Review: Object.freeze(["Certified"] as const),
  Certified: Object.freeze(["ReadyForFreeze"] as const),
  ReadyForFreeze: Object.freeze([] as const),
});

export const ExecutiveTimelineExperienceCertificationLifecycleSemantics =
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
      meaning:
        "Contracts, boundaries, and authorization references are reviewed.",
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
        "Certification is complete; EX-3:8 Freeze remains separately unauthorized.",
    }),
  ] as const);

export const isExecutiveTimelineExperienceCertificationLifecycleState = (
  value: unknown,
): value is ExecutiveTimelineExperienceCertificationLifecycleState =>
  typeof value === "string"
  && ExecutiveTimelineExperienceCertificationLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveTimelineExperienceCertificationLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveTimelineExperienceCertificationLifecycleState(from)
  && isExecutiveTimelineExperienceCertificationLifecycleState(to)
  && transitions[from].some((candidate) => candidate === to);

export const assertExecutiveTimelineExperienceCertificationLifecycleTransition =
  (from: unknown, to: unknown): true => {
    if (
      !canTransitionExecutiveTimelineExperienceCertificationLifecycle(from, to)
    ) {
      throw new Error(
        `Invalid EX-3:7 Certification lifecycle transition: ${String(from)} → ${String(to)}`,
      );
    }
    return true;
  };

export const ExecutiveTimelineExperienceCertificationLifecycle = Object.freeze({
  lifecycleId:
    "EX-3:7/ExecutiveTimelineExperienceCertificationLifecycle" as const,
  states: ExecutiveTimelineExperienceCertificationLifecycleStates,
  semantics: ExecutiveTimelineExperienceCertificationLifecycleSemantics,
  transitions,
  currentState: "ReadyForFreeze" as const,
  immediateForwardOnly: true as const,
  rollbackAllowed: false as const,
  executesTransitions: false as const,
  readyForFreezeAuthorizesEx38: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
