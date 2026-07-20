/**
 * NEA-8:1 — Executive Gateway Suite Lifecycle.
 *
 * Ordered suite lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-8:1.
 */

import type { ExecutiveGatewaySuiteLifecycleState } from "./executiveGatewaySuiteFoundationTypes.ts";

/** Canonical ordered suite lifecycle states. */
export const EXECUTIVE_GATEWAY_SUITE_LIFECYCLE_STATES: readonly ExecutiveGatewaySuiteLifecycleState[] =
  Object.freeze([
    "Foundation",
    "ReadyForRegistry",
    "ReadyForModel",
    "ReadyForValidation",
    "ReadyForManifest",
    "ReadyForPlatform",
    "ReadyForCertification",
    "ReadyForFreeze",
    "ReadyForPublicIndex",
  ]);

const TRANSITIONS = Object.freeze({
  Foundation: Object.freeze([
    "ReadyForRegistry",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForRegistry: Object.freeze([
    "ReadyForModel",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForModel: Object.freeze([
    "ReadyForValidation",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForValidation: Object.freeze([
    "ReadyForManifest",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForManifest: Object.freeze([
    "ReadyForPlatform",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForPlatform: Object.freeze([
    "ReadyForCertification",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForCertification: Object.freeze([
    "ReadyForFreeze",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForFreeze: Object.freeze([
    "ReadyForPublicIndex",
  ]) as readonly ExecutiveGatewaySuiteLifecycleState[],
  ReadyForPublicIndex: Object.freeze(
    [] as const,
  ) as readonly ExecutiveGatewaySuiteLifecycleState[],
} as const);

/** Canonical immutable suite lifecycle declaration. */
export const ExecutiveGatewaySuiteLifecycle = Object.freeze({
  lifecycleId: "NEA-8:1/ExecutiveGatewaySuiteLifecycle",
  sourcePhase: "NEA-8:1" as const,
  states: EXECUTIVE_GATEWAY_SUITE_LIFECYCLE_STATES,
  stateCount: EXECUTIVE_GATEWAY_SUITE_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  initialState: "Foundation" as const,
  currentState: "ReadyForRegistry" as const,
  terminalState: "ReadyForPublicIndex" as const,
  executesRuntime: false as const,
  stateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
