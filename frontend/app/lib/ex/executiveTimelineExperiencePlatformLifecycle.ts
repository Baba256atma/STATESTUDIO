/** EX-3:6 forward-only Platform lifecycle. */

import type { ExecutiveTimelineExperiencePlatformLifecycleState } from "./executiveTimelineExperiencePlatformTypes.ts";

export const ExecutiveTimelineExperiencePlatformLifecycleStates = Object.freeze([
  "Draft",
  "Prepared",
  "Integrated",
  "Platform",
  "ReadyForCertification",
] as const satisfies readonly ExecutiveTimelineExperiencePlatformLifecycleState[]);

const transitions = Object.freeze({
  Draft: Object.freeze(["Prepared"] as const),
  Prepared: Object.freeze(["Integrated"] as const),
  Integrated: Object.freeze(["Platform"] as const),
  Platform: Object.freeze(["ReadyForCertification"] as const),
  ReadyForCertification: Object.freeze([] as const),
});

export const ExecutiveTimelineExperiencePlatformLifecycleSemantics =
  Object.freeze([
    Object.freeze({
      state: "Draft" as const,
      order: 1,
      meaning: "Platform identity and metadata-only scope are drafted.",
    }),
    Object.freeze({
      state: "Prepared" as const,
      order: 2,
      meaning: "Manifest bindings and contracts are prepared.",
    }),
    Object.freeze({
      state: "Integrated" as const,
      order: 3,
      meaning: "Manifest aggregate is integrated into the Platform surface.",
    }),
    Object.freeze({
      state: "Platform" as const,
      order: 4,
      meaning: "Platform status is published as immutable metadata.",
    }),
    Object.freeze({
      state: "ReadyForCertification" as const,
      order: 5,
      meaning:
        "Metadata is complete; EX-3:7 Certification remains separately unauthorized.",
    }),
  ] as const);

export const isExecutiveTimelineExperiencePlatformLifecycleState = (
  value: unknown,
): value is ExecutiveTimelineExperiencePlatformLifecycleState =>
  typeof value === "string"
  && ExecutiveTimelineExperiencePlatformLifecycleStates.some(
    (state) => state === value,
  );

export const canTransitionExecutiveTimelineExperiencePlatformLifecycle = (
  from: unknown,
  to: unknown,
): boolean =>
  isExecutiveTimelineExperiencePlatformLifecycleState(from)
  && isExecutiveTimelineExperiencePlatformLifecycleState(to)
  && transitions[from].some((candidate) => candidate === to);

export const assertExecutiveTimelineExperiencePlatformLifecycleTransition = (
  from: unknown,
  to: unknown,
): true => {
  if (
    !canTransitionExecutiveTimelineExperiencePlatformLifecycle(from, to)
  ) {
    throw new Error(
      `Invalid EX-3:6 Platform lifecycle transition: ${String(from)} → ${String(to)}`,
    );
  }
  return true;
};

export const ExecutiveTimelineExperiencePlatformLifecycle = Object.freeze({
  lifecycleId: "EX-3:6/ExecutiveTimelineExperiencePlatformLifecycle" as const,
  states: ExecutiveTimelineExperiencePlatformLifecycleStates,
  semantics: ExecutiveTimelineExperiencePlatformLifecycleSemantics,
  transitions,
  currentState: "ReadyForCertification" as const,
  immediateForwardOnly: true as const,
  rollbackAllowed: false as const,
  executesTransitions: false as const,
  readyForCertificationAuthorizesEx37: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
