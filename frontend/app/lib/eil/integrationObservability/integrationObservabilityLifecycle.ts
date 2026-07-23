/**
 * EIL-6:1 — Integration Observability Foundation Lifecycle.
 *
 * Ordered immutable lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed lifecycle-state vocabulary for the EIL-6 ladder. */
export type ObservabilityLifecycleState =
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
export interface IntegrationObservabilityLifecycle {
  readonly lifecycleId: "EIL-6:1/IntegrationObservabilityLifecycle";
  readonly sourcePhase: "EIL-6:1";
  readonly states: readonly ObservabilityLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<ObservabilityLifecycleState, readonly ObservabilityLifecycleState[]>
  >;
  readonly currentState: "Declared";
  readonly foundationReadiness: "ReadyForRegistry";
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const INTEGRATION_OBSERVABILITY_FOUNDATION_LIFECYCLE_STATES: readonly ObservabilityLifecycleState[] =
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
  ]) as readonly ObservabilityLifecycleState[],
  Registered: Object.freeze([
    "Modeled",
  ]) as readonly ObservabilityLifecycleState[],
  Modeled: Object.freeze([
    "Validated",
  ]) as readonly ObservabilityLifecycleState[],
  Validated: Object.freeze([
    "Manifested",
  ]) as readonly ObservabilityLifecycleState[],
  Manifested: Object.freeze([
    "Platform",
  ]) as readonly ObservabilityLifecycleState[],
  Platform: Object.freeze([
    "Certified",
  ]) as readonly ObservabilityLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly ObservabilityLifecycleState[],
  Frozen: Object.freeze([
    "PublicIndex",
  ]) as readonly ObservabilityLifecycleState[],
  PublicIndex: Object.freeze(
    [] as const,
  ) as readonly ObservabilityLifecycleState[],
} as const);

/**
 * Canonical immutable Integration Observability Foundation lifecycle declaration.
 * Current state is Declared; foundation readiness is ReadyForRegistry.
 */
export const IntegrationObservabilityFoundationLifecycle: IntegrationObservabilityLifecycle =
  Object.freeze({
    lifecycleId: "EIL-6:1/IntegrationObservabilityLifecycle",
    sourcePhase: "EIL-6:1" as const,
    states: INTEGRATION_OBSERVABILITY_FOUNDATION_LIFECYCLE_STATES,
    stateCount: INTEGRATION_OBSERVABILITY_FOUNDATION_LIFECYCLE_STATES.length,
    transitions: TRANSITIONS,
    currentState: "Declared" as const,
    foundationReadiness: "ReadyForRegistry" as const,
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
