import { join } from "node:path";

import {
  getAutomaticMonitoringPolicy,
  runNexoraMonitoringObservation,
} from "./automaticMonitoringRuntime.ts";
import {
  NexoraBackgroundMonitoringScheduler,
  createBackgroundMonitoringState,
  type NexoraBackgroundMonitoringState,
  type NexoraBackgroundPolicyExecutor,
} from "./backgroundMonitoringRuntime.ts";
import { NexoraBackgroundMonitoringFileRepository } from "./backgroundMonitoringFileRepository.ts";
import {
  DURABLE_MONITORING_STORAGE_KEY,
  hydrateDurableMonitoringSnapshot,
  persistDurableMonitoringRuntime,
  type NexoraDurableMonitoringSnapshot,
  type NexoraDurableMonitoringStorage,
} from "./durableMonitoringRuntime.ts";
import {
  createGithubRepositoryConnector,
  prepareNexoraLiveObservation,
} from "./liveDataConnectorFoundation.ts";
import { enqueueProactiveAdvisorBrief } from "./proactiveAdvisorDelivery.ts";

const DEFAULT_STATE_PATH = join(process.cwd(), ".nexora", "monitoring", "background-runtime.json");
const globalRuntime = globalThis as typeof globalThis & { __nexoraPm6Started?: boolean; __nexoraPm6Timer?: ReturnType<typeof setInterval> };

function memoryStorage(snapshot: NexoraDurableMonitoringSnapshot): NexoraDurableMonitoringStorage {
  let value: string | null = JSON.stringify(snapshot);
  return { getItem: (key) => key === DURABLE_MONITORING_STORAGE_KEY ? value : null, setItem: (key, next) => { if (key === DURABLE_MONITORING_STORAGE_KEY) value = next; }, removeItem: (key) => { if (key === DURABLE_MONITORING_STORAGE_KEY) value = null; } };
}

function githubConfiguration(reference: string): Readonly<{ owner: string; repository: string }> | null {
  const match = /^github:([^/]+)\/(.+)$/.exec(reference);
  return match ? Object.freeze({ owner: match[1]!, repository: match[2]! }) : null;
}

const executor: NexoraBackgroundPolicyExecutor = Object.freeze({
  execute: async ({ state, policy, observedAt }) => {
    hydrateDurableMonitoringSnapshot(state.monitoring, observedAt);
    const connection = state.monitoring.liveData.connections.find((item) => item.workspaceId === policy.workspaceId && item.connectionId === policy.connectionId) ?? null;
    const configuration = connection?.providerId === "github" ? githubConfiguration(connection.configurationReference) : null;
    if (!connection || !configuration) throw new Error(`No supported RDI:4 provider resolver exists for policy ${policy.policyId}.`);
    const connector = createGithubRepositoryConnector(fetch, process.env.GITHUB_TOKEN);
    const hydratedPolicy = getAutomaticMonitoringPolicy(policy.workspaceId, policy.connectionId) ?? policy;
    const result = await runNexoraMonitoringObservation({
      trigger: "scheduled",
      connection,
      policy: hydratedPolicy,
      observedAt,
      executionOwner: "background",
      observe: ({ observationId, observedAt: at }) => prepareNexoraLiveObservation({ connector, connection, configuration, observationId, observedAt: at }),
    });
    const advisorQueued = result.evaluation ? enqueueProactiveAdvisorBrief({ monitoring: result.evaluation }).enqueued : false;
    const storage = memoryStorage(state.monitoring);
    return Object.freeze({ monitoring: persistDurableMonitoringRuntime(storage, observedAt), result, advisorQueued });
  },
});

export function getNexoraBackgroundMonitoringRepository(): NexoraBackgroundMonitoringFileRepository {
  return new NexoraBackgroundMonitoringFileRepository(process.env.NEXORA_MONITORING_REPOSITORY_PATH ?? DEFAULT_STATE_PATH);
}

export function getNexoraBackgroundMonitoringScheduler(): NexoraBackgroundMonitoringScheduler {
  return new NexoraBackgroundMonitoringScheduler(getNexoraBackgroundMonitoringRepository(), executor, 4);
}

export async function importNexoraBackgroundMonitoringSnapshot(snapshot: NexoraDurableMonitoringSnapshot, importedAt: string): Promise<NexoraBackgroundMonitoringState> {
  const repository = getNexoraBackgroundMonitoringRepository();
  const transaction = await repository.transact({ ownerId: `pm6:import:${Date.now()}`, acquiredAt: importedAt, leaseMs: 60_000, operation: async (current) => {
    if (!current) { const state = createBackgroundMonitoringState(snapshot, importedAt); return { state, value: state }; }
    const serverPolicies = new Map(current.monitoring.policies.map((policy) => [policy.policyId, policy]));
    const acceptedPolicyIds = new Set<string>();
    snapshot.policies.filter((policy) => policy.executionOwner === "background").forEach((policy) => {
      const prior = serverPolicies.get(policy.policyId);
      if (!prior || policy.updatedAt >= prior.updatedAt) { serverPolicies.set(policy.policyId, policy); acceptedPolicyIds.add(policy.policyId); }
    });
    const serverConnections = new Map(current.monitoring.liveData.connections.map((connection) => [`${connection.workspaceId}:${connection.connectionId}`, connection]));
    snapshot.liveData.connections.forEach((connection) => {
      if (snapshot.policies.some((policy) => policy.executionOwner === "background" && policy.workspaceId === connection.workspaceId && policy.connectionId === connection.connectionId)) serverConnections.set(`${connection.workspaceId}:${connection.connectionId}`, connection);
    });
    const runtimeStates = new Map(current.monitoring.runtimeStates.map((runtimeState) => [runtimeState.policyId, runtimeState]));
    snapshot.policies.filter((policy) => acceptedPolicyIds.has(policy.policyId)).forEach((policy) => {
      const incoming = snapshot.runtimeStates.find((runtimeState) => runtimeState.policyId === policy.policyId);
      const prior = runtimeStates.get(policy.policyId);
      if (!incoming && !prior) return;
      const runtimeState = incoming ?? prior!;
      runtimeStates.set(policy.policyId, Object.freeze({
        ...runtimeState,
        status: !policy.enabled ? "idle" : policy.paused ? "paused" : "scheduled",
        nextEligibleAt: policy.enabled && !policy.paused ? policy.nextEligibleAt : null,
        updatedAt: policy.updatedAt,
      }));
    });
    const monitoring = Object.freeze({ ...current.monitoring, writtenAt: importedAt, policies: Object.freeze([...serverPolicies.values()].sort((a, b) => a.policyId.localeCompare(b.policyId))), runtimeStates: Object.freeze([...runtimeStates.values()].sort((a, b) => a.policyId.localeCompare(b.policyId))), liveData: Object.freeze({ connections: Object.freeze([...serverConnections.values()]), observations: current.monitoring.liveData.observations }) });
    const state = Object.freeze({ ...current, revision: current.revision + 1, writtenAt: importedAt, monitoring });
    return { state, value: state };
  }});
  if (!transaction.value) throw new Error("PM:6 repository is busy; background ownership was not imported.");
  return transaction.value;
}

/** Manager-initiated refresh uses the same repository lock as the scheduler. */
export async function runNexoraBackgroundManualObservation(input: Readonly<{
  workspaceId: string;
  connectionId: string;
  observedAt: string;
}>) {
  const ownerId = `pm6:manual:${input.workspaceId}:${input.connectionId}:${input.observedAt}`;
  const transaction = await getNexoraBackgroundMonitoringRepository().transact({
    ownerId,
    acquiredAt: input.observedAt,
    leaseMs: 5 * 60_000,
    operation: async (current) => {
      if (!current) return { state: null, value: Object.freeze({ completed: false, reason: "policy-unavailable" as const, observationId: null }) };
      const policy = current.monitoring.policies.find((entry) => entry.workspaceId === input.workspaceId && entry.connectionId === input.connectionId && entry.executionOwner === "background");
      if (!policy) return { state: current, value: Object.freeze({ completed: false, reason: "execution-owner-mismatch" as const, observationId: null }) };
      const duePolicy = Object.freeze({ ...policy, nextEligibleAt: input.observedAt });
      const forcedMonitoring = Object.freeze({
        ...current.monitoring,
        policies: Object.freeze(current.monitoring.policies.map((entry) => entry.policyId === policy.policyId ? duePolicy : entry)),
        runtimeStates: Object.freeze(current.monitoring.runtimeStates.map((entry) => entry.policyId === policy.policyId ? Object.freeze({ ...entry, status: "scheduled" as const, nextEligibleAt: input.observedAt }) : entry)),
      });
      const forcedState = Object.freeze({ ...current, monitoring: forcedMonitoring });
      const outcome = await executor.execute({ state: forcedState, policy: duePolicy, runId: ownerId, observedAt: input.observedAt });
      const state = Object.freeze({
        ...current,
        revision: current.revision + 1,
        writtenAt: input.observedAt,
        monitoring: outcome.monitoring,
        completedRuns: Object.freeze([...current.completedRuns, Object.freeze({ runId: ownerId, policyId: policy.policyId, dueAt: input.observedAt, completedAt: input.observedAt, result: outcome.result.reason, observationId: outcome.result.observationId })].slice(-200)),
      });
      return { state, value: Object.freeze({ completed: outcome.result.completed, reason: outcome.result.reason, observationId: outcome.result.observationId }) };
    },
  });
  return transaction.acquired ? transaction.value : Object.freeze({ completed: false, reason: "already-observing" as const, observationId: null });
}

export function startNexoraBackgroundMonitoringServer(cadenceMs = 30_000): void {
  if (globalRuntime.__nexoraPm6Started) return;
  globalRuntime.__nexoraPm6Started = true;
  const wake = () => { void getNexoraBackgroundMonitoringScheduler().runDuePolicies(new Date().toISOString()).catch((error) => console.error("[PM:6] background invocation failed", error instanceof Error ? error.message : "unknown failure")); };
  void wake();
  globalRuntime.__nexoraPm6Timer = setInterval(wake, Math.max(5_000, cadenceMs));
}
