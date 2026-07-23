/**
 * EIL-5:1 — Integration Policy & Governance Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

import type {
  IntegrationPolicyGovernanceLifecycle as PolicyGovernanceLifecycleDescriptor,
  PolicyGovernanceLifecycleState,
} from "./integrationPolicyGovernanceFoundationTypes.ts";

export const INTEGRATION_POLICY_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES: readonly PolicyGovernanceLifecycleState[] =
  Object.freeze([
    "Declared",
    "Designed",
    "Verified",
    "Certified",
    "Frozen",
    "Released",
    "Deprecated",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Designed",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Designed: Object.freeze([
    "Verified",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Verified: Object.freeze([
    "Certified",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly PolicyGovernanceLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly PolicyGovernanceLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Policy & Governance Foundation lifecycle declaration.
 * Current state is Verified; foundation readiness is ReadyForRegistry.
 */
export const IntegrationPolicyGovernanceFoundationLifecycle: PolicyGovernanceLifecycleDescriptor =
  Object.freeze({
    lifecycleId: "EIL-5:1/IntegrationPolicyGovernanceLifecycle",
    sourcePhase: "EIL-5:1" as const,
    states: INTEGRATION_POLICY_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_POLICY_GOVERNANCE_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Verified" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
