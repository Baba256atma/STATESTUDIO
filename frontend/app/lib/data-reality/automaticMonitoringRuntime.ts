/**
 * PM:2 — foreground/session automatic observation and monitoring runtime.
 *
 * Scheduling decides when an eligible RDI:4 connection may be observed. The
 * injected observation function remains the RDI boundary; PM:2 never reads a
 * provider payload or computes business meaning.
 */
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  NexoraLiveConnection,
  NexoraLivePreparedObservation,
  NexoraLiveTransportFailure,
} from "./liveDataConnectorFoundation.ts";
import {
  commitNexoraLiveObservation,
  listNexoraLiveObservations,
  setNexoraLiveConnectionState,
} from "./liveDataConnectionStore.ts";
import {
  evaluateProactiveMonitoring,
  type NexoraMonitoringResult,
} from "./proactiveMonitoringFoundation.ts";
import type { ExecutiveSourceProjectionInput } from "./executiveSourceIntelligence.ts";

export const automaticMonitoringRuntimeIdentity =
  "PM:2/NexoraAutomaticObservationMonitoringRuntime" as const;
export const automaticMonitoringRuntimeVersion = "1.0.0" as const;
export const automaticMonitoringRuntimeNamespace =
  "nexora.proactive-monitoring.automatic-observation-runtime" as const;
export const automaticMonitoringRuntimeModel =
  "foreground-session-monitoring" as const;

export const AUTOMATIC_MONITORING_AUTHORITY_BOUNDARY = Object.freeze({
  ownsSchedulingEligibility: true as const,
  ownsOperationalMonitoringState: true as const,
  ownsProviderObservation: false as const,
  ownsBusinessState: false as const,
  ownsRuntimeTruth: false as const,
  ownsSignificance: false as const,
  ownsAttentionResolution: false as const,
  ownsStageFocus: false as const,
  ownsAdvisorDelivery: false as const,
  ownsDurableMemory: false as const,
  deliversNotifications: false as const,
  runtimeModel: automaticMonitoringRuntimeModel,
});

export const NEXORA_MONITORING_OBSERVATION_MODES = Object.freeze([
  "manual",
  "scheduled",
] as const);
export type NexoraMonitoringObservationMode =
  (typeof NEXORA_MONITORING_OBSERVATION_MODES)[number];

export const NEXORA_MONITORING_EXECUTION_OWNERS = Object.freeze([
  "foreground",
  "background",
] as const);
export type NexoraMonitoringExecutionOwner =
  (typeof NEXORA_MONITORING_EXECUTION_OWNERS)[number];

export const NEXORA_MONITORING_FREQUENCIES = Object.freeze([
  "hourly",
  "every-6-hours",
  "daily",
] as const);
export type NexoraMonitoringFrequency =
  (typeof NEXORA_MONITORING_FREQUENCIES)[number];

export const NEXORA_MONITORING_FREQUENCY_MS = Object.freeze({
  hourly: 60 * 60 * 1_000,
  "every-6-hours": 6 * 60 * 60 * 1_000,
  daily: 24 * 60 * 60 * 1_000,
} as const satisfies Record<NexoraMonitoringFrequency, number>);

export const NEXORA_MONITORING_RUNTIME_STATUSES = Object.freeze([
  "idle",
  "scheduled",
  "observing",
  "healthy",
  "degraded",
  "paused",
  "authorization-required",
  "backoff",
  "error",
] as const);
export type NexoraMonitoringRuntimeStatus =
  (typeof NEXORA_MONITORING_RUNTIME_STATUSES)[number];

export type NexoraAutomaticMonitoringPolicy = Readonly<{
  policyId: string;
  workspaceId: WorkspaceId;
  connectionId: string;
  targetId: string;
  enabled: boolean;
  paused: boolean;
  executionOwner: NexoraMonitoringExecutionOwner;
  observationMode: NexoraMonitoringObservationMode;
  frequency: NexoraMonitoringFrequency;
  createdAt: string;
  updatedAt: string;
  lastScheduledAt: string | null;
  nextEligibleAt: string | null;
  provenance: Readonly<{
    createdBy: "manager";
    runtimeBoundary: typeof automaticMonitoringRuntimeIdentity;
    persistence: typeof automaticMonitoringRuntimeModel;
  }>;
}>;

export type NexoraAutomaticMonitoringRuntimeState = Readonly<{
  policyId: string;
  workspaceId: WorkspaceId;
  connectionId: string;
  status: NexoraMonitoringRuntimeStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  nextEligibleAt: string | null;
  lastObservationId: string | null;
  consecutiveFailures: number;
  lastFailureReason: string | null;
  latestEvaluation: NexoraMonitoringResult | null;
  activeFlightId: string | null;
  runtimeScope: typeof automaticMonitoringRuntimeModel;
}>;

export type NexoraMonitoringEligibilityReason =
  | "eligible"
  | "policy-disabled"
  | "policy-paused"
  | "manual-policy"
  | "execution-owner-mismatch"
  | "workspace-mismatch"
  | "connection-unavailable"
  | "connection-disabled"
  | "authorization-required"
  | "refresh-unsupported"
  | "already-observing"
  | "provider-backoff"
  | "not-due";

export type NexoraMonitoringEligibility = Readonly<{
  eligible: boolean;
  reason: NexoraMonitoringEligibilityReason;
  dueAt: string | null;
}>;

export type NexoraMonitoringRunResult = Readonly<{
  started: boolean;
  completed: boolean;
  trigger: "manual" | "scheduled";
  reason:
    | NexoraMonitoringEligibilityReason
    | "success"
    | "observation-failed"
    | "commit-failed"
    | "stale-observation";
  observationId: string | null;
  evaluation: NexoraMonitoringResult | null;
  previousObservationRetained: boolean;
}>;

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;
let policies: Readonly<Record<WorkspaceId, Readonly<Record<string, NexoraAutomaticMonitoringPolicy>>>> = Object.freeze({});
let runtimeStates: Readonly<Record<WorkspaceId, Readonly<Record<string, NexoraAutomaticMonitoringRuntimeState>>>> = Object.freeze({});
const activeFlights = new Map<string, Promise<NexoraMonitoringRunResult>>();

function publish(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeAutomaticMonitoringRuntime(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAutomaticMonitoringRuntimeVersion(): number {
  return version;
}

function key(workspaceId: WorkspaceId, connectionId: string): string {
  return `${workspaceId}\u0000${connectionId}`;
}

function addMilliseconds(timestamp: string, milliseconds: number): string {
  return new Date(Date.parse(timestamp) + milliseconds).toISOString();
}

function baseRuntimeState(policy: NexoraAutomaticMonitoringPolicy): NexoraAutomaticMonitoringRuntimeState {
  return Object.freeze({
    policyId: policy.policyId,
    workspaceId: policy.workspaceId,
    connectionId: policy.connectionId,
    status: policy.paused ? "paused" : policy.enabled ? "scheduled" : "idle",
    lastAttemptAt: null,
    lastSuccessAt: null,
    nextEligibleAt: policy.nextEligibleAt,
    lastObservationId: null,
    consecutiveFailures: 0,
    lastFailureReason: null,
    latestEvaluation: null,
    activeFlightId: null,
    runtimeScope: automaticMonitoringRuntimeModel,
  });
}

function savePolicy(policy: NexoraAutomaticMonitoringPolicy): NexoraAutomaticMonitoringPolicy {
  policies = Object.freeze({
    ...policies,
    [policy.workspaceId]: Object.freeze({
      ...(policies[policy.workspaceId] ?? {}),
      [policy.connectionId]: policy,
    }),
  });
  publish();
  return policy;
}

function saveRuntimeState(state: NexoraAutomaticMonitoringRuntimeState): NexoraAutomaticMonitoringRuntimeState {
  runtimeStates = Object.freeze({
    ...runtimeStates,
    [state.workspaceId]: Object.freeze({
      ...(runtimeStates[state.workspaceId] ?? {}),
      [state.connectionId]: state,
    }),
  });
  publish();
  return state;
}

export function getAutomaticMonitoringPolicy(
  workspaceId: WorkspaceId,
  connectionId: string,
): NexoraAutomaticMonitoringPolicy | null {
  return policies[workspaceId]?.[connectionId] ?? null;
}

export function listAutomaticMonitoringPolicies(
  workspaceId: WorkspaceId,
): readonly NexoraAutomaticMonitoringPolicy[] {
  return Object.freeze(Object.values(policies[workspaceId] ?? {}).sort((a, b) =>
    a.policyId.localeCompare(b.policyId)));
}

export function getAutomaticMonitoringRuntimeState(
  workspaceId: WorkspaceId,
  connectionId: string,
): NexoraAutomaticMonitoringRuntimeState | null {
  return runtimeStates[workspaceId]?.[connectionId] ?? null;
}

export function enableAutomaticMonitoring(input: Readonly<{
  workspaceId: WorkspaceId;
  connectionId: string;
  targetId: string;
  frequency: NexoraMonitoringFrequency;
  enabledAt: string;
}>): NexoraAutomaticMonitoringPolicy {
  const existing = getAutomaticMonitoringPolicy(input.workspaceId, input.connectionId);
  const policy = Object.freeze({
    policyId: existing?.policyId ?? `pm2:policy:${input.workspaceId}:${input.connectionId}`,
    workspaceId: input.workspaceId,
    connectionId: input.connectionId,
    targetId: input.targetId,
    enabled: true,
    paused: false,
    executionOwner: existing?.executionOwner ?? "foreground",
    observationMode: "scheduled" as const,
    frequency: input.frequency,
    createdAt: existing?.createdAt ?? input.enabledAt,
    updatedAt: input.enabledAt,
    lastScheduledAt: existing?.lastScheduledAt ?? null,
    nextEligibleAt: input.enabledAt,
    provenance: existing?.provenance ?? Object.freeze({
      createdBy: "manager" as const,
      runtimeBoundary: automaticMonitoringRuntimeIdentity,
      persistence: automaticMonitoringRuntimeModel,
    }),
  });
  savePolicy(policy);
  saveRuntimeState(Object.freeze({
    ...(getAutomaticMonitoringRuntimeState(input.workspaceId, input.connectionId) ?? baseRuntimeState(policy)),
    status: "scheduled",
    nextEligibleAt: input.enabledAt,
  }));
  return policy;
}

/** Explicit manager-owned handoff. A policy has exactly one execution owner. */
export function setAutomaticMonitoringExecutionOwner(
  workspaceId: WorkspaceId,
  connectionId: string,
  executionOwner: NexoraMonitoringExecutionOwner,
  updatedAt: string,
): NexoraAutomaticMonitoringPolicy | null {
  const current = getAutomaticMonitoringPolicy(workspaceId, connectionId);
  if (!current) return null;
  return savePolicy(Object.freeze({ ...current, executionOwner, updatedAt }));
}

export function pauseAutomaticMonitoring(
  workspaceId: WorkspaceId,
  connectionId: string,
  pausedAt: string,
): NexoraAutomaticMonitoringPolicy | null {
  const current = getAutomaticMonitoringPolicy(workspaceId, connectionId);
  if (!current) return null;
  const policy = savePolicy(Object.freeze({ ...current, paused: true, updatedAt: pausedAt }));
  const state = getAutomaticMonitoringRuntimeState(workspaceId, connectionId) ?? baseRuntimeState(policy);
  saveRuntimeState(Object.freeze({ ...state, status: "paused", activeFlightId: null }));
  return policy;
}

export function resumeAutomaticMonitoring(
  workspaceId: WorkspaceId,
  connectionId: string,
  resumedAt: string,
): NexoraAutomaticMonitoringPolicy | null {
  const current = getAutomaticMonitoringPolicy(workspaceId, connectionId);
  if (!current) return null;
  const policy = savePolicy(Object.freeze({
    ...current,
    enabled: true,
    paused: false,
    observationMode: "scheduled",
    updatedAt: resumedAt,
    nextEligibleAt: resumedAt,
  }));
  const state = getAutomaticMonitoringRuntimeState(workspaceId, connectionId) ?? baseRuntimeState(policy);
  saveRuntimeState(Object.freeze({ ...state, status: "scheduled", nextEligibleAt: resumedAt }));
  return policy;
}

export function disableAutomaticMonitoring(
  workspaceId: WorkspaceId,
  connectionId: string,
  disabledAt: string,
): NexoraAutomaticMonitoringPolicy | null {
  const current = getAutomaticMonitoringPolicy(workspaceId, connectionId);
  if (!current) return null;
  const policy = savePolicy(Object.freeze({
    ...current,
    enabled: false,
    paused: false,
    observationMode: "manual",
    updatedAt: disabledAt,
    nextEligibleAt: null,
  }));
  const state = getAutomaticMonitoringRuntimeState(workspaceId, connectionId) ?? baseRuntimeState(policy);
  saveRuntimeState(Object.freeze({ ...state, status: "idle", nextEligibleAt: null, activeFlightId: null }));
  return policy;
}

export function updateAutomaticMonitoringFrequency(
  workspaceId: WorkspaceId,
  connectionId: string,
  frequency: NexoraMonitoringFrequency,
  updatedAt: string,
): NexoraAutomaticMonitoringPolicy | null {
  const current = getAutomaticMonitoringPolicy(workspaceId, connectionId);
  if (!current) return null;
  const nextEligibleAt = current.lastScheduledAt
    ? addMilliseconds(current.lastScheduledAt, NEXORA_MONITORING_FREQUENCY_MS[frequency])
    : updatedAt;
  const policy = savePolicy(Object.freeze({ ...current, frequency, updatedAt, nextEligibleAt }));
  const state = getAutomaticMonitoringRuntimeState(workspaceId, connectionId) ?? baseRuntimeState(policy);
  saveRuntimeState(Object.freeze({ ...state, nextEligibleAt }));
  return policy;
}

export function evaluateAutomaticMonitoringEligibility(input: Readonly<{
  policy: NexoraAutomaticMonitoringPolicy;
  connection: NexoraLiveConnection | null;
  runtimeState: NexoraAutomaticMonitoringRuntimeState | null;
  now: string;
  executionOwner?: NexoraMonitoringExecutionOwner;
}>): NexoraMonitoringEligibility {
  const { policy, connection, runtimeState, now } = input;
  const reject = (reason: NexoraMonitoringEligibilityReason, dueAt = runtimeState?.nextEligibleAt ?? policy.nextEligibleAt) =>
    Object.freeze({ eligible: false, reason, dueAt });
  if (!policy.enabled) return reject("policy-disabled");
  if (policy.paused) return reject("policy-paused");
  if (policy.observationMode !== "scheduled") return reject("manual-policy");
  if (policy.executionOwner !== (input.executionOwner ?? "foreground")) return reject("execution-owner-mismatch");
  if (!connection) return reject("connection-unavailable");
  if (connection.workspaceId !== policy.workspaceId) return reject("workspace-mismatch");
  if (connection.status === "authorization-required") return reject("authorization-required");
  if (connection.status === "disabled" || connection.status === "disconnected" || connection.status === "error") return reject("connection-disabled");
  if (!connection.capabilities.includes("refresh") && !connection.capabilities.includes("incremental-observation")) return reject("refresh-unsupported");
  if (runtimeState?.status === "observing" || activeFlights.has(key(policy.workspaceId, policy.connectionId))) return reject("already-observing");
  const dueAt = runtimeState?.nextEligibleAt ?? policy.nextEligibleAt;
  if (runtimeState?.status === "backoff" && dueAt && now < dueAt) return reject("provider-backoff", dueAt);
  if (dueAt && now < dueAt) return reject("not-due", dueAt);
  return Object.freeze({ eligible: true, reason: "eligible", dueAt });
}

export function findDueAutomaticMonitoringPolicies(input: Readonly<{
  policies: readonly NexoraAutomaticMonitoringPolicy[];
  connections: readonly NexoraLiveConnection[];
  runtimeStates: readonly NexoraAutomaticMonitoringRuntimeState[];
  now: string;
  executionOwner?: NexoraMonitoringExecutionOwner;
}>): readonly NexoraAutomaticMonitoringPolicy[] {
  const connectionsById = new Map(input.connections.map((entry) => [entry.connectionId, entry]));
  const statesById = new Map(input.runtimeStates.map((entry) => [entry.connectionId, entry]));
  return Object.freeze([...input.policies]
    .sort((a, b) => a.policyId.localeCompare(b.policyId))
    .filter((policy) => evaluateAutomaticMonitoringEligibility({
      policy,
      connection: connectionsById.get(policy.connectionId) ?? null,
      runtimeState: statesById.get(policy.connectionId) ?? null,
      now: input.now,
      executionOwner: input.executionOwner,
    }).eligible));
}

function projection(observation: ReturnType<typeof listNexoraLiveObservations>[number]): ExecutiveSourceProjectionInput {
  return Object.freeze({
    workspaceId: observation.workspaceId,
    sourceContextId: observation.sourceContextId,
    sourceLabel: observation.sourceLabel,
    committedAt: observation.committedAt,
    recordCount: observation.recordCount,
    mappingId: observation.mappingId,
    snapshot: observation.snapshot,
    handoff: observation.handoff,
    dataReality: observation.dataReality,
  });
}

function failureStatus(failure: NexoraLiveTransportFailure | null, count: number): NexoraMonitoringRuntimeStatus {
  if (failure === "authorization") return "authorization-required";
  return count >= 2 ? "backoff" : "degraded";
}

function backoffNext(policy: NexoraAutomaticMonitoringPolicy, failedAt: string, count: number): string | null {
  if (count < 1) return null;
  const multiplier = Math.min(2 ** Math.max(0, count - 1), 8);
  return addMilliseconds(failedAt, NEXORA_MONITORING_FREQUENCY_MS[policy.frequency] * multiplier);
}

function failureResult(
  trigger: "manual" | "scheduled",
  reason: NexoraMonitoringRunResult["reason"],
): NexoraMonitoringRunResult {
  return Object.freeze({
    started: reason !== "already-observing",
    completed: false,
    trigger,
    reason,
    observationId: null,
    evaluation: null,
    previousObservationRetained: true,
  });
}

export async function runNexoraMonitoringObservation(input: Readonly<{
  trigger: "manual" | "scheduled";
  connection: NexoraLiveConnection;
  policy?: NexoraAutomaticMonitoringPolicy | null;
  observedAt: string;
  executionOwner?: NexoraMonitoringExecutionOwner;
  observe: (input: Readonly<{ observationId: string; observedAt: string }>) => Promise<NexoraLivePreparedObservation>;
}>): Promise<NexoraMonitoringRunResult> {
  const flightKey = key(input.connection.workspaceId, input.connection.connectionId);
  if (activeFlights.has(flightKey)) return failureResult(input.trigger, "already-observing");
  const policy = input.policy ?? getAutomaticMonitoringPolicy(input.connection.workspaceId, input.connection.connectionId);
  if (input.trigger === "scheduled") {
    if (!policy) return failureResult(input.trigger, "policy-disabled");
    const eligibility = evaluateAutomaticMonitoringEligibility({
      policy,
      connection: input.connection,
      runtimeState: getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId),
      now: input.observedAt,
      executionOwner: input.executionOwner,
    });
    if (!eligibility.eligible) return failureResult(input.trigger, eligibility.reason);
  }

  const observationId = `PM2-${input.connection.connectionId}-${input.observedAt.replace(/[^0-9]/g, "")}`;
  const operation = (async (): Promise<NexoraMonitoringRunResult> => {
    if (policy) {
      const currentState = getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId) ?? baseRuntimeState(policy);
      saveRuntimeState(Object.freeze({
        ...currentState,
        status: "observing",
        lastAttemptAt: input.observedAt,
        activeFlightId: observationId,
      }));
      savePolicy(Object.freeze({ ...policy, lastScheduledAt: input.observedAt, updatedAt: input.observedAt }));
    }
    let prepared: NexoraLivePreparedObservation;
    try {
      prepared = await input.observe(Object.freeze({ observationId, observedAt: input.observedAt }));
    } catch (error) {
      if (policy) {
        const previous = getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId) ?? baseRuntimeState(policy);
        const failures = previous.consecutiveFailures + 1;
        const nextEligibleAt = backoffNext(policy, input.observedAt, failures);
        saveRuntimeState(Object.freeze({ ...previous, status: failureStatus(null, failures), consecutiveFailures: failures, lastFailureReason: error instanceof Error ? error.message : "Observation failed.", nextEligibleAt, activeFlightId: null }));
      }
      setNexoraLiveConnectionState({ workspaceId: input.connection.workspaceId, connectionId: input.connection.connectionId, state: "degraded", updatedAt: input.observedAt });
      return failureResult(input.trigger, "observation-failed");
    }

    if (!prepared.ready) {
      const authorization = prepared.transportFailure === "authorization";
      if (policy) {
        const previous = getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId) ?? baseRuntimeState(policy);
        const failures = previous.consecutiveFailures + 1;
        const nextEligibleAt = authorization ? null : backoffNext(policy, input.observedAt, failures);
        saveRuntimeState(Object.freeze({ ...previous, status: failureStatus(prepared.transportFailure, failures), consecutiveFailures: failures, lastFailureReason: prepared.errors[0] ?? "Observation failed.", nextEligibleAt, activeFlightId: null }));
      }
      setNexoraLiveConnectionState({ workspaceId: input.connection.workspaceId, connectionId: input.connection.connectionId, state: authorization ? "authorization-required" : "degraded", updatedAt: input.observedAt });
      return failureResult(input.trigger, "observation-failed");
    }

    const committed = commitNexoraLiveObservation({ connection: input.connection, prepared, committedAt: input.observedAt });
    if (!committed.committed || !committed.observation) {
      if (policy) {
        const currentPolicy = getAutomaticMonitoringPolicy(policy.workspaceId, policy.connectionId) ?? policy;
        const previousState = getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId) ?? baseRuntimeState(currentPolicy);
        saveRuntimeState(Object.freeze({
          ...previousState,
          status: committed.reason === "stale_observation"
            ? previousState.lastSuccessAt ? "healthy" : "scheduled"
            : "error",
          lastFailureReason: committed.reason,
          nextEligibleAt: addMilliseconds(input.observedAt, NEXORA_MONITORING_FREQUENCY_MS[currentPolicy.frequency]),
          activeFlightId: null,
        }));
      }
      return failureResult(input.trigger, committed.reason === "stale_observation" ? "stale-observation" : "commit-failed");
    }
    const history = listNexoraLiveObservations(input.connection.workspaceId, input.connection.connectionId);
    const current = history[history.length - 1]!;
    const previous = history[history.length - 2] ?? null;
    const evaluation = previous
      ? evaluateProactiveMonitoring(Object.freeze({ previous: projection(previous), current: projection(current) }))
      : null;
    if (policy) {
      const currentPolicy = getAutomaticMonitoringPolicy(policy.workspaceId, policy.connectionId) ?? policy;
      const nextEligibleAt = addMilliseconds(input.observedAt, NEXORA_MONITORING_FREQUENCY_MS[currentPolicy.frequency]);
      savePolicy(Object.freeze({ ...currentPolicy, nextEligibleAt, updatedAt: input.observedAt }));
      const previousState = getAutomaticMonitoringRuntimeState(policy.workspaceId, policy.connectionId) ?? baseRuntimeState(currentPolicy);
      saveRuntimeState(Object.freeze({
        ...previousState,
        status: "healthy",
        lastSuccessAt: input.observedAt,
        nextEligibleAt,
        lastObservationId: current.observationId,
        consecutiveFailures: 0,
        lastFailureReason: null,
        latestEvaluation: evaluation,
        activeFlightId: null,
      }));
    }
    return Object.freeze({
      started: true,
      completed: true,
      trigger: input.trigger,
      reason: "success" as const,
      observationId: current.observationId,
      evaluation,
      previousObservationRetained: true,
    });
  })();
  activeFlights.set(flightKey, operation);
  try {
    return await operation;
  } finally {
    activeFlights.delete(flightKey);
  }
}

/** Reconstruct supported foreground eligibility without firing an observation. */
export function recoverForegroundMonitoringRuntime(
  policy: NexoraAutomaticMonitoringPolicy,
  previous: NexoraAutomaticMonitoringRuntimeState | null,
): NexoraAutomaticMonitoringRuntimeState {
  if (!policy.enabled) return Object.freeze({ ...(previous ?? baseRuntimeState(policy)), status: "idle", nextEligibleAt: null, activeFlightId: null });
  if (policy.paused) return Object.freeze({ ...(previous ?? baseRuntimeState(policy)), status: "paused", activeFlightId: null });
  return Object.freeze({ ...(previous ?? baseRuntimeState(policy)), status: "scheduled", nextEligibleAt: previous?.nextEligibleAt ?? policy.nextEligibleAt, activeFlightId: null });
}

/** Wake-up mechanism only; all due decisions remain in the deterministic scheduler. */
export function startNexoraForegroundMonitoringRuntime(
  tick: () => void,
  cadenceMs = 60_000,
): () => void {
  const intervalId = globalThis.setInterval(tick, Math.max(60_000, cadenceMs));
  return () => globalThis.clearInterval(intervalId);
}

export function listAutomaticMonitoringRuntimeStates(
  workspaceId: WorkspaceId,
): readonly NexoraAutomaticMonitoringRuntimeState[] {
  return Object.freeze(Object.values(runtimeStates[workspaceId] ?? {}).sort((a, b) =>
    a.policyId.localeCompare(b.policyId)));
}

export type NexoraAutomaticMonitoringRecoverySnapshot = Readonly<{
  policies: readonly NexoraAutomaticMonitoringPolicy[];
  runtimeStates: readonly NexoraAutomaticMonitoringRuntimeState[];
}>;

/** PM:5 persistence seam. Active promises/flights are deliberately excluded. */
export function exportAutomaticMonitoringRecoverySnapshot(): NexoraAutomaticMonitoringRecoverySnapshot {
  return Object.freeze({
    policies: Object.freeze(Object.values(policies).flatMap((workspace) => Object.values(workspace)).sort((a, b) => a.policyId.localeCompare(b.policyId))),
    runtimeStates: Object.freeze(Object.values(runtimeStates).flatMap((workspace) => Object.values(workspace)).sort((a, b) => a.policyId.localeCompare(b.policyId))),
  });
}

/** Replaces in-memory PM:2 state from a validated PM:5 snapshot. */
export function hydrateAutomaticMonitoringRecoverySnapshot(
  snapshot: NexoraAutomaticMonitoringRecoverySnapshot,
  recoveredAt: string,
): void {
  const nextPolicies: Record<WorkspaceId, Record<string, NexoraAutomaticMonitoringPolicy>> = {};
  for (const policy of snapshot.policies) {
    nextPolicies[policy.workspaceId] ??= {};
    nextPolicies[policy.workspaceId]![policy.connectionId] = Object.freeze({
      ...policy,
      executionOwner: policy.executionOwner ?? "foreground",
      provenance: Object.freeze({ ...policy.provenance }),
    });
  }
  const nextStates: Record<WorkspaceId, Record<string, NexoraAutomaticMonitoringRuntimeState>> = {};
  for (const stored of snapshot.runtimeStates) {
    const policy = nextPolicies[stored.workspaceId]?.[stored.connectionId];
    if (!policy || policy.policyId !== stored.policyId) continue;
    const backoffActive = stored.status === "backoff" && Boolean(stored.nextEligibleAt && recoveredAt < stored.nextEligibleAt);
    const status: NexoraMonitoringRuntimeStatus = !policy.enabled
      ? "idle"
      : policy.paused
        ? "paused"
        : stored.status === "authorization-required"
          ? "authorization-required"
          : backoffActive
            ? "backoff"
            : "scheduled";
    nextStates[stored.workspaceId] ??= {};
    nextStates[stored.workspaceId]![stored.connectionId] = Object.freeze({
      ...stored,
      status,
      nextEligibleAt: status === "idle" ? null : stored.nextEligibleAt ?? policy.nextEligibleAt,
      latestEvaluation: null,
      activeFlightId: null,
      runtimeScope: automaticMonitoringRuntimeModel,
    });
  }
  for (const policy of snapshot.policies) {
    nextStates[policy.workspaceId] ??= {};
    nextStates[policy.workspaceId]![policy.connectionId] ??= baseRuntimeState(policy);
  }
  policies = Object.freeze(Object.fromEntries(Object.entries(nextPolicies).map(([workspaceId, values]) => [workspaceId, Object.freeze(values)])));
  runtimeStates = Object.freeze(Object.fromEntries(Object.entries(nextStates).map(([workspaceId, values]) => [workspaceId, Object.freeze(values)])));
  activeFlights.clear();
  publish();
}

export function resetAutomaticMonitoringRuntimeForTests(): void {
  policies = Object.freeze({});
  runtimeStates = Object.freeze({});
  activeFlights.clear();
  version = 0;
  listeners.clear();
}

export type AutomaticMonitoringCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
  | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T";

export function certifyAutomaticMonitoringRuntime(
  evidence: Readonly<Record<AutomaticMonitoringCertificationGate, boolean>>,
) {
  const gates = Object.freeze((Object.keys(evidence) as AutomaticMonitoringCertificationGate[])
    .sort()
    .map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({
    certified: gates.length === 20 && gates.every((entry) => entry.passed),
    passedGateCount: gates.filter((entry) => entry.passed).length,
    failedGateCount: gates.filter((entry) => !entry.passed).length,
    gates,
  });
}
