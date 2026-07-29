/**
 * RTC-2:9 — Executive Journal Runtime Certification Lifecycle.
 *
 * Ownership: owned exclusively by RTC-2:9.
 */

import type { ExecutiveJournalRuntimeCertificationGateId } from "./executiveJournalRuntimeCertificationTypes.ts";

export type ExecutiveJournalRuntimeCertificationLifecycleState =
  | "Declared"
  | "GatesBound"
  | "Sealed";

export const EXECUTIVE_JOURNAL_CERTIFICATION_LIFECYCLE_STATES = Object.freeze([
  "Declared",
  "GatesBound",
  "Sealed",
] as const satisfies readonly ExecutiveJournalRuntimeCertificationLifecycleState[]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze(["GatesBound"] as const),
  GatesBound: Object.freeze(["Sealed"] as const),
  Sealed: Object.freeze([] as const),
} as const);

export const ExecutiveJournalRuntimeCertificationGateIds = Object.freeze([
  "G-01",
  "G-02",
  "G-03",
  "G-04",
  "G-05",
  "G-06",
  "G-07",
  "G-08",
  "G-09",
  "G-10",
  "G-11",
  "G-12",
  "G-13",
  "G-14",
  "G-15",
  "G-16",
  "G-17",
  "G-18",
] as const satisfies readonly ExecutiveJournalRuntimeCertificationGateId[]);

export const ExecutiveJournalRuntimeNonWaivableGateIds = Object.freeze([
  "G-01",
  "G-03",
  "G-07",
  "G-08",
  "G-10",
  "G-11",
  "G-12",
  "G-13",
  "G-18",
] as const satisfies readonly ExecutiveJournalRuntimeCertificationGateId[]);

export const ExecutiveJournalRuntimeCertificationLifecycle = Object.freeze({
  lifecycleId: "RTC-2:9/ExecutiveJournalRuntimeCertificationLifecycle" as const,
  sourcePhase: "RTC-2:9" as const,
  states: EXECUTIVE_JOURNAL_CERTIFICATION_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_JOURNAL_CERTIFICATION_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "Sealed" as const,
  evaluatesOnly: true as const,
  authorizesDeployment: false as const,
  precedence: Object.freeze([
    "NotReady",
    "ConditionallyReady",
    "ReadyForAuthorization",
  ] as const),
  gateResultKinds: Object.freeze([
    "Pass",
    "Fail",
    "Exception",
    "NotEvaluated",
  ] as const),
  gateIds: ExecutiveJournalRuntimeCertificationGateIds,
  nonWaivableGateIds: ExecutiveJournalRuntimeNonWaivableGateIds,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
