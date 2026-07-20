/**
 * NEA-2:1 — Channel Connector Lifecycle.
 *
 * Ordered connector lifecycle states, health statuses, and transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

import type {
  ChannelConnectorHealthStatus,
  ChannelConnectorLifecycleState,
} from "./channelConnectorFoundationTypes.ts";

/** Canonical ordered lifecycle states. */
export const CHANNEL_CONNECTOR_LIFECYCLE_STATES: readonly ChannelConnectorLifecycleState[] =
  Object.freeze([
    "Declared",
    "Registered",
    "Configured",
    "Certified",
    "Frozen",
    "Released",
    "Deprecated",
    "Retired",
  ]);

/** Canonical health status values. */
export const CHANNEL_CONNECTOR_HEALTH_STATUSES: readonly ChannelConnectorHealthStatus[] =
  Object.freeze([
    "Unknown",
    "Healthy",
    "Warning",
    "Unavailable",
    "Disabled",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Registered",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Registered: Object.freeze([
    "Configured",
    "Deprecated",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Configured: Object.freeze([
    "Certified",
    "Deprecated",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
    "Deprecated",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Frozen: Object.freeze([
    "Released",
    "Deprecated",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Released: Object.freeze([
    "Deprecated",
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly ChannelConnectorLifecycleState[],
  Retired: Object.freeze(
    [] as const,
  ) as readonly ChannelConnectorLifecycleState[],
} as const);

/** Canonical immutable connector lifecycle declaration. */
export const ChannelConnectorLifecycle = Object.freeze({
  lifecycleId: "NEA-2:1/ChannelConnectorLifecycle",
  sourcePhase: "NEA-2:1" as const,
  states: CHANNEL_CONNECTOR_LIFECYCLE_STATES,
  stateCount: CHANNEL_CONNECTOR_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  healthStatuses: CHANNEL_CONNECTOR_HEALTH_STATUSES,
  healthStatusCount: CHANNEL_CONNECTOR_HEALTH_STATUSES.length,
  initialState: "Declared" as const,
  terminalState: "Retired" as const,
  executesRuntime: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
