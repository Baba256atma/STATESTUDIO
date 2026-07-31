import type { ExecutiveJournalExperiencePlatformLifecycleState } from "./executiveJournalExperiencePlatformTypes.ts";

export const ExecutiveJournalExperiencePlatformLifecycleStates = Object.freeze([
  "Declared", "ManifestBound", "PlatformContractsDeclared", "Sealed", "ReadyForCertification",
] as const satisfies readonly ExecutiveJournalExperiencePlatformLifecycleState[]);

const transitions = Object.freeze({
  Declared: Object.freeze(["ManifestBound"] as const),
  ManifestBound: Object.freeze(["PlatformContractsDeclared"] as const),
  PlatformContractsDeclared: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze(["ReadyForCertification"] as const),
  ReadyForCertification: Object.freeze([] as const),
});

export const ExecutiveJournalExperiencePlatformLifecycleSemantics = Object.freeze([
  Object.freeze({ state: "Declared" as const, order: 1, meaning: "Platform identity and metadata-only scope are declared." }),
  Object.freeze({ state: "ManifestBound" as const, order: 2, meaning: "The exact eligible EX-2:5 Manifest is bound." }),
  Object.freeze({ state: "PlatformContractsDeclared" as const, order: 3, meaning: "All metadata Platform contracts and bindings are declared." }),
  Object.freeze({ state: "Sealed" as const, order: 4, meaning: "The Platform package is immutable and sealed." }),
  Object.freeze({ state: "ReadyForCertification" as const, order: 5, meaning: "Metadata is complete; EX-2:7 remains separately unauthorized." }),
] as const);

export const isExecutiveJournalExperiencePlatformLifecycleState = (value: unknown): value is ExecutiveJournalExperiencePlatformLifecycleState =>
  typeof value === "string" && ExecutiveJournalExperiencePlatformLifecycleStates.some((state) => state === value);

export const canTransitionExecutiveJournalExperiencePlatformLifecycle = (from: unknown, to: unknown): boolean =>
  isExecutiveJournalExperiencePlatformLifecycleState(from)
  && isExecutiveJournalExperiencePlatformLifecycleState(to)
  && transitions[from].some((candidate: string) => candidate === to);

export const assertExecutiveJournalExperiencePlatformLifecycleTransition = (from: unknown, to: unknown): true => {
  if (!canTransitionExecutiveJournalExperiencePlatformLifecycle(from, to)) {
    throw new Error(`Invalid EX-2:6 Platform lifecycle transition: ${String(from)} → ${String(to)}`);
  }
  return true;
};

export const ExecutiveJournalExperiencePlatformLifecycle = Object.freeze({
  lifecycleId: "EX-2:6/ExecutiveJournalExperiencePlatformLifecycle" as const,
  states: ExecutiveJournalExperiencePlatformLifecycleStates,
  semantics: ExecutiveJournalExperiencePlatformLifecycleSemantics,
  transitions,
  currentState: "ReadyForCertification" as const,
  immediateForwardOnly: true as const,
  executesTransitions: false as const,
  readyForCertificationAuthorizesEx27: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
