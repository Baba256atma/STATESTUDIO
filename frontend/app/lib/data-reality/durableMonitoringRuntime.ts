/** PM:5 — browser-durable monitoring responsibility with a foreground runner. */
import {
  automaticMonitoringRuntimeModel,
  exportAutomaticMonitoringRecoverySnapshot,
  hydrateAutomaticMonitoringRecoverySnapshot,
  type NexoraAutomaticMonitoringPolicy,
  type NexoraAutomaticMonitoringRuntimeState,
  type NexoraMonitoringRuntimeStatus,
} from "./automaticMonitoringRuntime.ts";
import {
  exportNexoraLiveDataRecoverySnapshot,
  hydrateNexoraLiveDataRecoverySnapshot,
  type NexoraLiveDataRecoverySnapshot,
} from "./liveDataConnectionStore.ts";
import {
  exportProactiveAdvisorRecoverySnapshot,
  hydrateProactiveAdvisorRecoverySnapshot,
  type NexoraProactiveAdvisorRecoverySnapshot,
} from "./proactiveAdvisorDelivery.ts";

export const durableMonitoringRuntimeIdentity =
  "PM:5/NexoraDurableMonitoringRuntime" as const;
export const durableMonitoringRuntimeVersion = "1.0.0" as const;
export const durableMonitoringRuntimeNamespace =
  "nexora.proactive-monitoring.durable-runtime" as const;
export const durableMonitoringRuntimeModel =
  "durable-policy+foreground-runner" as const;
export const DURABLE_MONITORING_STORAGE_KEY = "nexora.monitoring.runtime.v1";
const DURABLE_MONITORING_DATABASE_NAME = "nexora-monitoring-runtime";
const DURABLE_MONITORING_DATABASE_STORE = "snapshots";
const DURABLE_MONITORING_DATABASE_CURRENT_KEY = "current";

export const DURABLE_MONITORING_AUTHORITY_BOUNDARY = Object.freeze({
  persistenceAuthority: "PM:5/dedicated-monitoring-repository" as const,
  providerPattern: "APP-4/local-storage-pattern-only" as const,
  storesExecutiveMemory: false as const,
  ownsBusinessTruth: false as const,
  activatesStoredObservation: false as const,
  ownsSignificance: false as const,
  ownsAdvisorReasoning: false as const,
  ownsStageFocus: false as const,
  externalNotifications: false as const,
  backgroundExecution: false as const,
  runtimeModel: durableMonitoringRuntimeModel,
});

export type NexoraDurableMonitoringFreshness = "fresh" | "stale" | "unknown";

export type NexoraDurableMonitoringRuntimeState = Readonly<{
  policyId: string;
  workspaceId: string;
  connectionId: string;
  status: NexoraMonitoringRuntimeStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastObservationId: string | null;
  consecutiveFailures: number;
  lastFailureReason: string | null;
  backoffUntil: string | null;
  nextEligibleAt: string | null;
  freshness: NexoraDurableMonitoringFreshness;
  updatedAt: string;
}>;

export type NexoraDurableMonitoringLease = Readonly<{
  policyId: string;
  ownerId: string;
  acquiredAt: string;
  expiresAt: string;
}>;

export type NexoraDurableMonitoringSnapshot = Readonly<{
  identity: typeof durableMonitoringRuntimeIdentity;
  version: typeof durableMonitoringRuntimeVersion;
  namespace: typeof durableMonitoringRuntimeNamespace;
  runtimeModel: typeof durableMonitoringRuntimeModel;
  writtenAt: string;
  policies: readonly NexoraAutomaticMonitoringPolicy[];
  runtimeStates: readonly NexoraDurableMonitoringRuntimeState[];
  liveData: NexoraLiveDataRecoverySnapshot;
  advisorDelivery: NexoraProactiveAdvisorRecoverySnapshot;
  leases: readonly NexoraDurableMonitoringLease[];
}>;

export type NexoraDurableMonitoringStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type NexoraDurableMonitoringRecoveryReport = Readonly<{
  recovered: boolean;
  reason: "recovered" | "empty" | "invalid";
  runtimeModel: typeof durableMonitoringRuntimeModel;
  policyCount: number;
  connectionCount: number;
  observationCount: number;
  briefCount: number;
  interruptedFlightCount: number;
  overduePolicyCount: number;
  staleStateCount: number;
  recoveredAt: string;
}>;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export function resolveDurableMonitoringFreshness(input: Readonly<{
  lastSuccessAt: string | null;
  nextEligibleAt: string | null;
  now: string;
}>): NexoraDurableMonitoringFreshness {
  if (!input.lastSuccessAt) return "unknown";
  if (input.nextEligibleAt && input.now >= input.nextEligibleAt) return "stale";
  return "fresh";
}

function durableState(
  state: NexoraAutomaticMonitoringRuntimeState,
  policy: NexoraAutomaticMonitoringPolicy,
  writtenAt: string,
): NexoraDurableMonitoringRuntimeState {
  return Object.freeze({
    policyId: state.policyId,
    workspaceId: state.workspaceId,
    connectionId: state.connectionId,
    status: state.status,
    lastAttemptAt: state.lastAttemptAt,
    lastSuccessAt: state.lastSuccessAt,
    lastObservationId: state.lastObservationId,
    consecutiveFailures: state.consecutiveFailures,
    lastFailureReason: state.lastFailureReason,
    backoffUntil: state.status === "backoff" ? state.nextEligibleAt : null,
    nextEligibleAt: state.nextEligibleAt,
    freshness: resolveDurableMonitoringFreshness({
      lastSuccessAt: state.lastSuccessAt,
      nextEligibleAt: state.nextEligibleAt,
      now: writtenAt,
    }),
    updatedAt: state.lastAttemptAt ?? state.lastSuccessAt ?? policy.updatedAt,
  });
}

function validatedSnapshot(value: unknown): NexoraDurableMonitoringSnapshot | null {
  const parsed = value as NexoraDurableMonitoringSnapshot;
  if (
      parsed?.identity !== durableMonitoringRuntimeIdentity ||
      parsed.version !== durableMonitoringRuntimeVersion ||
      parsed.runtimeModel !== durableMonitoringRuntimeModel ||
      !Array.isArray(parsed.policies) ||
      !Array.isArray(parsed.runtimeStates) ||
      !Array.isArray(parsed.liveData?.connections) ||
      !Array.isArray(parsed.liveData?.observations) ||
      !Array.isArray(parsed.advisorDelivery?.briefs) ||
      !Array.isArray(parsed.leases)
    ) return null;
  return deepFreeze(parsed);
}

function parseSnapshot(storage: NexoraDurableMonitoringStorage): NexoraDurableMonitoringSnapshot | null {
  const raw = storage.getItem(DURABLE_MONITORING_STORAGE_KEY);
  if (!raw) return null;
  try { return validatedSnapshot(JSON.parse(raw)); } catch { return null; }
}

function assertCredentialSafety(snapshot: NexoraDurableMonitoringSnapshot): void {
  const serialized = JSON.stringify(snapshot);
  if (/"(?:authorization|accessToken|apiSecret|cookie|oauthToken|pat)"\s*:/i.test(serialized) || /Bearer\s+[A-Za-z0-9._~-]+/i.test(serialized)) {
    throw new Error("PM:5 durable monitoring storage rejected credential material.");
  }
}

function createDurableMonitoringSnapshot(
  storage: NexoraDurableMonitoringStorage,
  writtenAt: string,
): NexoraDurableMonitoringSnapshot {
  const monitoring = exportAutomaticMonitoringRecoverySnapshot();
  const policiesById = new Map(monitoring.policies.map((policy) => [policy.policyId, policy]));
  const prior = parseSnapshot(storage);
  const snapshot = deepFreeze({
    identity: durableMonitoringRuntimeIdentity,
    version: durableMonitoringRuntimeVersion,
    namespace: durableMonitoringRuntimeNamespace,
    runtimeModel: durableMonitoringRuntimeModel,
    writtenAt,
    policies: Object.freeze([...monitoring.policies]),
    runtimeStates: Object.freeze(monitoring.runtimeStates.flatMap((state) => {
      const policy = policiesById.get(state.policyId);
      return policy ? [durableState(state, policy, writtenAt)] : [];
    })),
    liveData: exportNexoraLiveDataRecoverySnapshot(),
    advisorDelivery: exportProactiveAdvisorRecoverySnapshot(),
    leases: Object.freeze((prior?.leases ?? []).filter((lease) => lease.expiresAt > writtenAt)),
  } satisfies NexoraDurableMonitoringSnapshot);
  assertCredentialSafety(snapshot);
  return snapshot;
}

export function persistDurableMonitoringRuntime(
  storage: NexoraDurableMonitoringStorage,
  writtenAt: string,
): NexoraDurableMonitoringSnapshot {
  const snapshot = createDurableMonitoringSnapshot(storage, writtenAt);
  storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

function openDurableMonitoringDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DURABLE_MONITORING_DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DURABLE_MONITORING_DATABASE_STORE)) {
        request.result.createObjectStore(DURABLE_MONITORING_DATABASE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("PM:5 durable repository could not be opened."));
  });
}

function mergeByIdentity<T>(
  prior: readonly T[],
  current: readonly T[],
  identity: (value: T) => string,
): readonly T[] {
  const merged = new Map(prior.map((value) => [identity(value), value]));
  current.forEach((value) => merged.set(identity(value), value));
  return Object.freeze([...merged.values()].sort((a, b) => identity(a).localeCompare(identity(b))));
}

function mergeBrowserSnapshots(
  prior: NexoraDurableMonitoringSnapshot | null,
  current: NexoraDurableMonitoringSnapshot,
): NexoraDurableMonitoringSnapshot {
  if (!prior) return current;
  const observations = mergeByIdentity(
    prior.liveData.observations,
    current.liveData.observations,
    (value) => `${value.workspaceId}:${value.connectionId}:${value.observationId}`,
  );
  const newestObservations = Object.freeze([...observations]
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt) || a.observationId.localeCompare(b.observationId))
    .filter((observation, index, ordered) => ordered
      .filter((candidate) => candidate.workspaceId === observation.workspaceId && candidate.connectionId === observation.connectionId)
      .slice(-2)
      .some((candidate) => candidate.observationId === observation.observationId)));
  return deepFreeze({
    ...current,
    policies: mergeByIdentity(prior.policies, current.policies, (value) => value.policyId),
    runtimeStates: mergeByIdentity(prior.runtimeStates, current.runtimeStates, (value) => value.policyId),
    liveData: Object.freeze({
      connections: mergeByIdentity(prior.liveData.connections, current.liveData.connections, (value) => `${value.workspaceId}:${value.connectionId}`),
      observations: newestObservations,
    }),
    advisorDelivery: Object.freeze({
      briefs: mergeByIdentity(prior.advisorDelivery.briefs, current.advisorDelivery.briefs, (value) => value.briefId),
    }),
    leases: mergeByIdentity(prior.leases, current.leases, (value) => value.policyId)
      .filter((lease) => lease.expiresAt > current.writtenAt),
  } satisfies NexoraDurableMonitoringSnapshot);
}

async function mergeWriteDurableMonitoringDatabase(snapshot: NexoraDurableMonitoringSnapshot): Promise<NexoraDurableMonitoringSnapshot> {
  const database = await openDurableMonitoringDatabase();
  const merged = await new Promise<NexoraDurableMonitoringSnapshot>((resolve, reject) => {
    const transaction = database.transaction(DURABLE_MONITORING_DATABASE_STORE, "readwrite");
    const store = transaction.objectStore(DURABLE_MONITORING_DATABASE_STORE);
    const request = store.get(DURABLE_MONITORING_DATABASE_CURRENT_KEY);
    let next = snapshot;
    request.onsuccess = () => {
      next = mergeBrowserSnapshots(validatedSnapshot(request.result), snapshot);
      store.put(next, DURABLE_MONITORING_DATABASE_CURRENT_KEY);
    };
    request.onerror = () => transaction.abort();
    transaction.oncomplete = () => resolve(next);
    transaction.onerror = () => reject(transaction.error ?? new Error("PM:5 durable repository write failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("PM:5 durable repository write was aborted."));
  });
  database.close();
  return merged;
}

async function readDurableMonitoringDatabase(): Promise<NexoraDurableMonitoringSnapshot | null> {
  const database = await openDurableMonitoringDatabase();
  const value = await new Promise<unknown>((resolve, reject) => {
    const transaction = database.transaction(DURABLE_MONITORING_DATABASE_STORE, "readonly");
    const request = transaction.objectStore(DURABLE_MONITORING_DATABASE_STORE).get(DURABLE_MONITORING_DATABASE_CURRENT_KEY);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("PM:5 durable repository read failed."));
  });
  database.close();
  return validatedSnapshot(value);
}

/** Browser repository: IndexedDB owns evidence; localStorage keeps only the lease/policy head. */
export async function persistDurableMonitoringRuntimeBrowser(
  storage: NexoraDurableMonitoringStorage,
  writtenAt: string,
): Promise<NexoraDurableMonitoringSnapshot> {
  const snapshot = await mergeWriteDurableMonitoringDatabase(createDurableMonitoringSnapshot(storage, writtenAt));
  const head = deepFreeze({
    ...snapshot,
    liveData: Object.freeze({ connections: Object.freeze([]), observations: Object.freeze([]) }),
    advisorDelivery: Object.freeze({ briefs: Object.freeze([]) }),
  } satisfies NexoraDurableMonitoringSnapshot);
  storage.removeItem(DURABLE_MONITORING_STORAGE_KEY);
  storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(head));
  return snapshot;
}

function runtimeRecoverySnapshot(snapshot: NexoraDurableMonitoringSnapshot) {
  return Object.freeze({
    policies: snapshot.policies,
    runtimeStates: Object.freeze(snapshot.runtimeStates.map((state) => Object.freeze({
      policyId: state.policyId,
      workspaceId: state.workspaceId,
      connectionId: state.connectionId,
      status: state.status,
      lastAttemptAt: state.lastAttemptAt,
      lastSuccessAt: state.lastSuccessAt,
      nextEligibleAt: state.nextEligibleAt,
      lastObservationId: state.lastObservationId,
      consecutiveFailures: state.consecutiveFailures,
      lastFailureReason: state.lastFailureReason,
      latestEvaluation: null,
      activeFlightId: null,
      runtimeScope: automaticMonitoringRuntimeModel,
    }))),
  });
}

export function hydrateDurableMonitoringSnapshot(
  snapshot: NexoraDurableMonitoringSnapshot,
  recoveredAt: string,
): NexoraDurableMonitoringRecoveryReport {
  hydrateNexoraLiveDataRecoverySnapshot(snapshot.liveData);
  hydrateAutomaticMonitoringRecoverySnapshot(runtimeRecoverySnapshot(snapshot), recoveredAt);
  hydrateProactiveAdvisorRecoverySnapshot(snapshot.advisorDelivery);
  const enabled = snapshot.policies.filter((policy) => policy.enabled && !policy.paused);
  const statesByPolicy = new Map(snapshot.runtimeStates.map((state) => [state.policyId, state]));
  return Object.freeze({
    recovered: true,
    reason: "recovered",
    runtimeModel: durableMonitoringRuntimeModel,
    policyCount: snapshot.policies.length,
    connectionCount: snapshot.liveData.connections.length,
    observationCount: snapshot.liveData.observations.length,
    briefCount: snapshot.advisorDelivery.briefs.length,
    interruptedFlightCount: snapshot.runtimeStates.filter((state) => state.status === "observing").length,
    overduePolicyCount: enabled.filter((policy) => {
      const dueAt = statesByPolicy.get(policy.policyId)?.nextEligibleAt ?? policy.nextEligibleAt;
      return !dueAt || dueAt <= recoveredAt;
    }).length,
    staleStateCount: snapshot.runtimeStates.filter((state) =>
      resolveDurableMonitoringFreshness({ lastSuccessAt: state.lastSuccessAt, nextEligibleAt: state.nextEligibleAt, now: recoveredAt }) !== "fresh").length,
    recoveredAt,
  });
}

function emptyRecoveryReport(reason: "empty" | "invalid", recoveredAt: string): NexoraDurableMonitoringRecoveryReport {
  return Object.freeze({
    recovered: false, reason, runtimeModel: durableMonitoringRuntimeModel,
    policyCount: 0, connectionCount: 0, observationCount: 0, briefCount: 0,
    interruptedFlightCount: 0, overduePolicyCount: 0, staleStateCount: 0, recoveredAt,
  });
}

export function recoverDurableMonitoringRuntime(
  storage: NexoraDurableMonitoringStorage,
  recoveredAt: string,
): NexoraDurableMonitoringRecoveryReport {
  const raw = storage.getItem(DURABLE_MONITORING_STORAGE_KEY);
  const snapshot = parseSnapshot(storage);
  return snapshot
    ? hydrateDurableMonitoringSnapshot(snapshot, recoveredAt)
    : emptyRecoveryReport(raw ? "invalid" : "empty", recoveredAt);
}

export async function recoverDurableMonitoringRuntimeBrowser(
  storage: NexoraDurableMonitoringStorage,
  recoveredAt: string,
): Promise<NexoraDurableMonitoringRecoveryReport> {
  try {
    const snapshot = await readDurableMonitoringDatabase();
    if (snapshot) return hydrateDurableMonitoringSnapshot(snapshot, recoveredAt);
  } catch {
    // The small synchronous head remains a supported fallback.
  }
  return recoverDurableMonitoringRuntime(storage, recoveredAt);
}

export function acquireDurableMonitoringLease(input: Readonly<{
  storage: NexoraDurableMonitoringStorage;
  policyId: string;
  ownerId: string;
  acquiredAt: string;
  durationMs?: number;
}>): Readonly<{ acquired: boolean; lease: NexoraDurableMonitoringLease | null }> {
  const snapshot = parseSnapshot(input.storage);
  if (!snapshot || !snapshot.policies.some((policy) => policy.policyId === input.policyId)) {
    return Object.freeze({ acquired: false, lease: null });
  }
  const current = snapshot.leases.find((lease) => lease.policyId === input.policyId && lease.expiresAt > input.acquiredAt);
  if (current && current.ownerId !== input.ownerId) return Object.freeze({ acquired: false, lease: current });
  const lease = Object.freeze({
    policyId: input.policyId,
    ownerId: input.ownerId,
    acquiredAt: input.acquiredAt,
    expiresAt: new Date(Date.parse(input.acquiredAt) + Math.max(60_000, input.durationMs ?? 5 * 60_000)).toISOString(),
  });
  const next = deepFreeze({
    ...snapshot,
    leases: Object.freeze([...snapshot.leases.filter((entry) => entry.policyId !== input.policyId && entry.expiresAt > input.acquiredAt), lease]),
  });
  input.storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(next));
  const verified = parseSnapshot(input.storage)?.leases.find((entry) => entry.policyId === input.policyId);
  return Object.freeze({ acquired: verified?.ownerId === input.ownerId, lease: verified?.ownerId === input.ownerId ? verified : null });
}

export function releaseDurableMonitoringLease(input: Readonly<{
  storage: NexoraDurableMonitoringStorage;
  policyId: string;
  ownerId: string;
}>): boolean {
  const snapshot = parseSnapshot(input.storage);
  if (!snapshot) return false;
  const lease = snapshot.leases.find((entry) => entry.policyId === input.policyId);
  if (!lease || lease.ownerId !== input.ownerId) return false;
  const next = deepFreeze({ ...snapshot, leases: Object.freeze(snapshot.leases.filter((entry) => entry.policyId !== input.policyId)) });
  input.storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(next));
  return true;
}

export function clearDurableMonitoringRuntimeForTests(storage: NexoraDurableMonitoringStorage): void {
  storage.removeItem(DURABLE_MONITORING_STORAGE_KEY);
}

export type DurableMonitoringCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K"
  | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V";

export function certifyDurableMonitoringRuntime(
  evidence: Readonly<Record<DurableMonitoringCertificationGate, boolean>>,
) {
  const gates = Object.freeze((Object.keys(evidence) as DurableMonitoringCertificationGate[])
    .sort()
    .map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({
    certified: gates.length === 22 && gates.every((entry) => entry.passed),
    runtimeModel: durableMonitoringRuntimeModel,
    passedGateCount: gates.filter((entry) => entry.passed).length,
    failedGateCount: gates.filter((entry) => !entry.passed).length,
    gates,
  });
}
