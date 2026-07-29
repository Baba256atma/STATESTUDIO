/**
 * RTC-3:1 — Executive Decision Register Lifecycle.
 *
 * Ordered immutable decision-record states and declarative transition map.
 * Metadata only — no runtime state machine. Append-only lineage.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import type {
  ExecutiveDecisionRegisterLifecycleDeclaration,
  ExecutiveDecisionRegisterLifecycleState,
} from "./executiveDecisionRegisterTypes.ts";

export const EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES:
  readonly ExecutiveDecisionRegisterLifecycleState[] = Object.freeze([
    "Proposed",
    "Confirmed",
    "Effective",
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]);

const STATE_SEMANTICS = Object.freeze({
  Proposed:
    "Non-authoritative proposal; cannot operate as the governing decision.",
  Confirmed:
    "Explicit human confirmation and authority bound; not yet necessarily operative.",
  Effective: "Currently operative decision for its declared scope.",
  Disputed:
    "Challenge recorded; original decision and challenge evidence preserved.",
  Superseded:
    "Replaced by a successor; predecessor and replacement references preserved.",
  Closed:
    "Closure or outcome evidence preserved; history remains append-only.",
  Disposed:
    "Governance disposition evidence preserved; history is not erased.",
} as const);

/**
 * Declared permitted transitions. Reopening and resolution are expressed as
 * new append-only events; original records are never rewritten in place.
 */
const TRANSITIONS = Object.freeze({
  Proposed: Object.freeze([
    "Confirmed",
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Confirmed: Object.freeze([
    "Effective",
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Effective: Object.freeze([
    "Disputed",
    "Superseded",
    "Closed",
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Disputed: Object.freeze([
    "Effective",
    "Superseded",
    "Closed",
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Superseded: Object.freeze([
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Closed: Object.freeze([
    "Disposed",
  ]) as readonly ExecutiveDecisionRegisterLifecycleState[],
  Disposed: Object.freeze(
    [] as const,
  ) as readonly ExecutiveDecisionRegisterLifecycleState[],
} as const);

/** States that require authority_ref when becoming consequential. */
export const ExecutiveDecisionRegisterConsequentialStates = Object.freeze([
  "Confirmed",
  "Effective",
  "Disputed",
  "Superseded",
  "Closed",
  "Disposed",
] as const);

export function isCanonicalDecisionRegisterLifecycleState(
  value: unknown,
): value is ExecutiveDecisionRegisterLifecycleState {
  return typeof value === "string"
    && (EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES as readonly string[])
      .includes(value);
}

export const ExecutiveDecisionRegisterLifecycle:
  ExecutiveDecisionRegisterLifecycleDeclaration = Object.freeze({
    lifecycleId: "RTC-3:1/ExecutiveDecisionRegisterLifecycle" as const,
    sourcePhase: "RTC-3:1" as const,
    states: EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
    stateCount: EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    stateSemantics: STATE_SEMANTICS,
    appendOnly: true as const,
    correctionsDoNotErase: true as const,
    proposedIsNonAuthoritative: true as const,
    confirmedRequiresHumanAndAuthority: true as const,
    consequentialStatesRequireAuthorityRef: true as const,
    supersessionRequiresPredecessorRef: true as const,
    disputePreservesChallengedDecisionRef: true as const,
    dispositionPreservesGovernanceEvidence: true as const,
    reopeningRequiresNewLifecycleEvent: true as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
