/**
 * EIL-7:1 — Integration Governance Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed lifecycle-state vocabulary for the EIL-7 ladder. */
export type GovernanceLifecycleState =
  | "Declared"
  | "Registered"
  | "Modeled"
  | "Validated"
  | "Manifested"
  | "Platform"
  | "Certified"
  | "Frozen"
  | "PublicIndex";

/** Immutable lifecycle descriptor. */
export interface IntegrationGovernanceLifecycle {
  readonly lifecycleId: "EIL-7:1/IntegrationGovernanceLifecycle";
  readonly sourcePhase: "EIL-7:1";
  readonly states: readonly GovernanceLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<GovernanceLifecycleState, readonly GovernanceLifecycleState[]>
  >;
  readonly currentState: "Declared";
  readonly foundationReadiness: "ReadyForRegistry";
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const INTEGRATION_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES: readonly GovernanceLifecycleState[] =
  Object.freeze([
    "Declared",
    "Registered",
    "Modeled",
    "Validated",
    "Manifested",
    "Platform",
    "Certified",
    "Frozen",
    "PublicIndex",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Registered",
  ]) as readonly GovernanceLifecycleState[],
  Registered: Object.freeze([
    "Modeled",
  ]) as readonly GovernanceLifecycleState[],
  Modeled: Object.freeze([
    "Validated",
  ]) as readonly GovernanceLifecycleState[],
  Validated: Object.freeze([
    "Manifested",
  ]) as readonly GovernanceLifecycleState[],
  Manifested: Object.freeze([
    "Platform",
  ]) as readonly GovernanceLifecycleState[],
  Platform: Object.freeze([
    "Certified",
  ]) as readonly GovernanceLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly GovernanceLifecycleState[],
  Frozen: Object.freeze([
    "PublicIndex",
  ]) as readonly GovernanceLifecycleState[],
  PublicIndex: Object.freeze(
    [] as const,
  ) as readonly GovernanceLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Governance Foundation lifecycle declaration.
 * Current state is Declared; foundation readiness is ReadyForRegistry.
 */
export const IntegrationGovernanceFoundationLifecycle: IntegrationGovernanceLifecycle =
  Object.freeze({
    lifecycleId: "EIL-7:1/IntegrationGovernanceLifecycle",
    sourcePhase: "EIL-7:1" as const,
    states: INTEGRATION_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Declared" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
