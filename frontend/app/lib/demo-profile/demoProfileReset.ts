/**
 * DEMO-MVP:3 — Reset Demo.
 *
 * Restores the selected Demo Profile to its certified CSV baseline.
 * A reset is not a profile switch and does not clear the profile.
 * Shared stores are filtered by canonical demo_workspace ownership.
 * The session keys and storage keys themselves stay in place.
 */
import type { NexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  hydrateNexoraCanonicalDecisionRuntimeRecords,
  NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
  serializeNexoraCanonicalDecisionRuntimeState,
} from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraCanonicalExecutionRuntimeAdapter } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  hydrateNexoraCanonicalExecutionRuntimeRecords,
  NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
  serializeNexoraCanonicalExecutionRuntimeState,
} from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { getOutcomes, unregisterOutcome } from "../cross-scenario-learning/outcomeLearningEngineRegistry.ts";
import {
  exportAutomaticMonitoringRecoverySnapshot,
  hydrateAutomaticMonitoringRecoverySnapshot,
} from "../data-reality/automaticMonitoringRuntime.ts";
import {
  exportCsvRealDataImportState,
  hydrateCsvRealDataImportState,
  releaseCsvPublishedKpiObservationsForRemovedSources,
} from "../data-reality/csvRealDataImportStore.ts";
import { DURABLE_MONITORING_STORAGE_KEY } from "../data-reality/durableMonitoringRuntime.ts";
import {
  loadSceneOrgSavedScenes,
  persistSceneOrgSavedScenes,
  type SceneOrgSavedSceneStorage,
} from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { isDemoProfileId, type DemoProfileId } from "./demoProfileContract.ts";
import { readActiveDemoProfile } from "./demoProfileStore.ts";
import { ensureManufacturingDemoPackage } from "./manufacturingDemoPackage.ts";
import { ensureProjectDemoPackage } from "./projectDemoPackage.ts";

export const demoProfileResetIdentity = "DEMO-MVP:3/ResetDemo" as const;

const DEMO_OWNED_KEY_PREFIXES = Object.freeze([
  `nexora.approvalWorkflow.${DEMO_WORKSPACE_ID}.`,
  `nexora.collaboration.${DEMO_WORKSPACE_ID}.`,
  `nexora.decisionMemory.${DEMO_WORKSPACE_ID}.`,
]);

export type DemoResetStorage = Pick<Storage, "getItem" | "setItem" | "removeItem" | "key"> & {
  readonly length: number;
};

export type DemoResetRemoved = Readonly<{
  csvImportIds: readonly string[];
  decisionIds: readonly string[];
  executionIds: readonly string[];
  sceneIds: readonly string[];
  approvalKeys: readonly string[];
  collaborationKeys: readonly string[];
  learningKeys: readonly string[];
  outcomeIds: readonly string[];
  monitoringPolicyIds: readonly string[];
}>;

export type DemoResetResult = Readonly<{
  identity: typeof demoProfileResetIdentity;
  status: "reset" | "refused" | "failed";
  reason: "not_demo_workspace" | "no_modern_profile" | "baseline_not_ready" | null;
  profileId: DemoProfileId | null;
  removed: DemoResetRemoved;
  restored: readonly string[];
  preservedManagerState: true;
  failures: readonly string[];
}>;

export type ResetActiveDemoInput = Readonly<{
  decisionRuntime?: NexoraCanonicalDecisionRuntime | null;
  executionRuntime?: NexoraCanonicalExecutionRuntimeAdapter | null;
  localStorage?: DemoResetStorage | null;
  sessionStorage?: DemoResetStorage | null;
  sceneStorage?: SceneOrgSavedSceneStorage | null;
}>;

const listeners = new Set<(result: DemoResetResult) => void>();

export function subscribeDemoReset(listener: (result: DemoResetResult) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emptyRemoved(): DemoResetRemoved {
  return Object.freeze({
    csvImportIds: Object.freeze([]),
    decisionIds: Object.freeze([]),
    executionIds: Object.freeze([]),
    sceneIds: Object.freeze([]),
    approvalKeys: Object.freeze([]),
    collaborationKeys: Object.freeze([]),
    learningKeys: Object.freeze([]),
    outcomeIds: Object.freeze([]),
    monitoringPolicyIds: Object.freeze([]),
  });
}

function refused(
  reason: "not_demo_workspace" | "no_modern_profile",
  profileId: DemoProfileId | null,
): DemoResetResult {
  return Object.freeze({
    identity: demoProfileResetIdentity,
    status: "refused" as const,
    reason,
    profileId,
    removed: emptyRemoved(),
    restored: Object.freeze([]),
    preservedManagerState: true as const,
    failures: Object.freeze([]),
  });
}

function browserLocalStorage(): DemoResetStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function browserSessionStorage(): DemoResetStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function storageKeys(storage: DemoResetStorage): readonly string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key) keys.push(key);
  }
  return keys;
}

function removeDemoWorkspaceCsv(): readonly string[] {
  const exported = exportCsvRealDataImportState();
  const removedCommitted = exported.committed.filter((entry) => entry.workspaceId === DEMO_WORKSPACE_ID);
  const removedIds = removedCommitted.map((entry) => entry.importId);
  const pendingIds = exported.pending
    .filter((entry) => entry.workspaceId === DEMO_WORKSPACE_ID)
    .map((entry) => entry.input.importId);
  releaseCsvPublishedKpiObservationsForRemovedSources(
    DEMO_WORKSPACE_ID,
    removedCommitted.map((entry) => ({
      sourceContextId: entry.sourceContextId,
      importId: entry.importId,
    })),
  );
  hydrateCsvRealDataImportState({
    committed: exported.committed.filter((entry) => entry.workspaceId !== DEMO_WORKSPACE_ID),
    pending: exported.pending.filter((entry) => entry.workspaceId !== DEMO_WORKSPACE_ID),
    removed: exported.removed.filter((entry) => entry.workspaceId !== DEMO_WORKSPACE_ID),
  });
  return Object.freeze([...removedIds, ...pendingIds]);
}

function filterDecisions(input: ResetActiveDemoInput): readonly string[] {
  const removed: string[] = [];
  if (input.decisionRuntime) {
    const kept = input.decisionRuntime.adapter.listDecisions().filter((decision) => {
      if (decision.workspaceId === DEMO_WORKSPACE_ID) {
        removed.push(decision.decisionId);
        return false;
      }
      return true;
    });
    input.decisionRuntime.hydrateDecisions(kept);
    const session = input.sessionStorage ?? browserSessionStorage();
    if (session) {
      session.setItem(
        NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
        serializeNexoraCanonicalDecisionRuntimeState(input.decisionRuntime.getState()),
      );
    }
    return Object.freeze(removed);
  }
  const session = input.sessionStorage ?? browserSessionStorage();
  if (!session) return Object.freeze([]);
  const serialized = session.getItem(NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY);
  if (!serialized) return Object.freeze([]);
  const hydrated = hydrateNexoraCanonicalDecisionRuntimeRecords(serialized, []);
  const kept = hydrated.filter((decision) => {
    if (decision.workspaceId === DEMO_WORKSPACE_ID) {
      removed.push(decision.decisionId);
      return false;
    }
    return true;
  });
  session.setItem(
    NEXORA_CANONICAL_DECISION_RUNTIME_SESSION_KEY,
    JSON.stringify({ version: 1, decisions: kept }),
  );
  return Object.freeze(removed);
}

function filterExecutions(input: ResetActiveDemoInput): readonly string[] {
  const removed: string[] = [];
  if (input.executionRuntime) {
    const kept = input.executionRuntime.listExecutions().filter((execution) => {
      if (execution.workspaceId === DEMO_WORKSPACE_ID) {
        removed.push(execution.executionId);
        return false;
      }
      return true;
    });
    input.executionRuntime.hydrateExecutions(kept);
    const session = input.sessionStorage ?? browserSessionStorage();
    if (session) {
      session.setItem(
        NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
        serializeNexoraCanonicalExecutionRuntimeState(input.executionRuntime.getState()),
      );
    }
    return Object.freeze(removed);
  }
  const session = input.sessionStorage ?? browserSessionStorage();
  if (!session) return Object.freeze([]);
  const serialized = session.getItem(NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY);
  if (!serialized) return Object.freeze([]);
  const hydrated = hydrateNexoraCanonicalExecutionRuntimeRecords(serialized, []);
  const kept = hydrated.filter((execution) => {
    if (execution.workspaceId === DEMO_WORKSPACE_ID) {
      removed.push(execution.executionId);
      return false;
    }
    return true;
  });
  session.setItem(
    NEXORA_CANONICAL_EXECUTION_RUNTIME_SESSION_KEY,
    JSON.stringify({ version: 1, executions: kept }),
  );
  return Object.freeze(removed);
}

function filterOwnedKeys(storage: DemoResetStorage | null): Readonly<{
  approvalKeys: readonly string[];
  collaborationKeys: readonly string[];
  learningKeys: readonly string[];
}> {
  if (!storage) {
    return Object.freeze({
      approvalKeys: Object.freeze([]),
      collaborationKeys: Object.freeze([]),
      learningKeys: Object.freeze([]),
    });
  }
  const approvalKeys: string[] = [];
  const collaborationKeys: string[] = [];
  const learningKeys: string[] = [];
  for (const key of storageKeys(storage)) {
    if (key.startsWith(DEMO_OWNED_KEY_PREFIXES[0])) approvalKeys.push(key);
    else if (key.startsWith(DEMO_OWNED_KEY_PREFIXES[1])) collaborationKeys.push(key);
    else if (key.startsWith(DEMO_OWNED_KEY_PREFIXES[2])) learningKeys.push(key);
  }
  for (const key of [...approvalKeys, ...collaborationKeys, ...learningKeys]) {
    storage.removeItem(key);
  }
  return Object.freeze({
    approvalKeys: Object.freeze(approvalKeys),
    collaborationKeys: Object.freeze(collaborationKeys),
    learningKeys: Object.freeze(learningKeys),
  });
}

function filterScenes(storage: SceneOrgSavedSceneStorage | null): Readonly<{
  sceneIds: readonly string[];
  failure: string | null;
}> {
  if (!storage) return Object.freeze({ sceneIds: Object.freeze([]), failure: null });
  const loaded = loadSceneOrgSavedScenes(storage);
  if (loaded.status === "invalid" || loaded.status === "incompatible") {
    return Object.freeze({
      sceneIds: Object.freeze([]),
      failure: `saved-scenes-${loaded.status}`,
    });
  }
  const removed = loaded.scenes.filter((scene) => scene.managerWorkspaceId === DEMO_WORKSPACE_ID);
  const kept = loaded.scenes.filter((scene) => scene.managerWorkspaceId !== DEMO_WORKSPACE_ID);
  if (removed.length === 0) return Object.freeze({ sceneIds: Object.freeze([]), failure: null });
  const persisted = persistSceneOrgSavedScenes(kept, storage);
  if (!persisted.persisted) {
    return Object.freeze({
      sceneIds: Object.freeze([]),
      failure: `saved-scenes-${persisted.reason}`,
    });
  }
  return Object.freeze({
    sceneIds: Object.freeze(removed.map((scene) => scene.sceneId)),
    failure: null,
  });
}

function filterOutcomes(): readonly string[] {
  const removed: string[] = [];
  for (const outcome of getOutcomes(DEMO_WORKSPACE_ID)) {
    const result = unregisterOutcome(outcome.outcome.outcomeId);
    if (result.success && result.data) removed.push(result.data);
  }
  return Object.freeze(removed);
}

function filterMonitoring(storage: DemoResetStorage | null): readonly string[] {
  const snapshot = exportAutomaticMonitoringRecoverySnapshot();
  const removed = snapshot.policies
    .filter((policy) => policy.workspaceId === DEMO_WORKSPACE_ID)
    .map((policy) => policy.policyId);
  hydrateAutomaticMonitoringRecoverySnapshot(
    {
      policies: snapshot.policies.filter((policy) => policy.workspaceId !== DEMO_WORKSPACE_ID),
      runtimeStates: snapshot.runtimeStates.filter((state) => state.workspaceId !== DEMO_WORKSPACE_ID),
    },
    "2026-08-31T00:00:00.000Z",
  );
  if (storage) {
    const raw = storage.getItem(DURABLE_MONITORING_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          policies?: { workspaceId?: string }[];
          runtimeStates?: { workspaceId?: string }[];
          liveData?: {
            connections?: { workspaceId?: string }[];
            observations?: { workspaceId?: string }[];
          };
        };
        const keep = <T extends { workspaceId?: string }>(records: T[] | undefined) =>
          (records ?? []).filter((record) => record.workspaceId !== DEMO_WORKSPACE_ID);
        parsed.policies = keep(parsed.policies);
        parsed.runtimeStates = keep(parsed.runtimeStates);
        if (parsed.liveData) {
          parsed.liveData.connections = keep(parsed.liveData.connections);
          parsed.liveData.observations = keep(parsed.liveData.observations);
        }
        storage.setItem(DURABLE_MONITORING_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // An unreadable monitoring snapshot is left unchanged rather than deleted.
      }
    }
  }
  return Object.freeze(removed);
}

function restorePackage(profileId: DemoProfileId): Readonly<{
  restored: readonly string[];
  failures: readonly string[];
}> {
  const loaded = profileId === "project"
    ? ensureProjectDemoPackage({ workspaceId: DEMO_WORKSPACE_ID })
    : ensureManufacturingDemoPackage({ workspaceId: DEMO_WORKSPACE_ID });
  const failures = loaded.files.flatMap((file) => file.errors.map((error) => `${file.fileName}: ${error}`));
  if (loaded.refused || loaded.files.some((file) => !file.ready || !file.committed)) {
    return Object.freeze({
      restored: Object.freeze(loaded.files.filter((file) => file.committed).map((file) => file.fileName)),
      failures: Object.freeze(failures.length > 0 ? failures : ["baseline_not_ready"]),
    });
  }
  return Object.freeze({
    restored: Object.freeze(loaded.files.map((file) => file.fileName)),
    failures: Object.freeze([]),
  });
}

/** Restore the active Demo Profile baseline. Refuses any other live workspace. */
export function resetActiveDemo(input: ResetActiveDemoInput = {}): DemoResetResult {
  const liveWorkspaceId = readLiveExecutiveDataWorkspaceId();
  const profileId = readActiveDemoProfile();
  if (liveWorkspaceId !== DEMO_WORKSPACE_ID) {
    const result = refused("not_demo_workspace", null);
    listeners.forEach((listener) => listener(result));
    return result;
  }
  if (!isDemoProfileId(profileId)) {
    const result = refused("no_modern_profile", null);
    listeners.forEach((listener) => listener(result));
    return result;
  }

  const csvImportIds = removeDemoWorkspaceCsv();
  const decisionIds = filterDecisions(input);
  const executionIds = filterExecutions(input);
  const owned = filterOwnedKeys(input.localStorage === undefined ? browserLocalStorage() : input.localStorage);
  const scenes = filterScenes(input.sceneStorage === undefined ? browserLocalStorage() : input.sceneStorage);
  const outcomeIds = filterOutcomes();
  const monitoringPolicyIds = filterMonitoring(
    input.localStorage === undefined ? browserLocalStorage() : input.localStorage,
  );
  const restored = restorePackage(profileId);
  const failures = [...restored.failures];
  if (scenes.failure) failures.push(scenes.failure);
  const result: DemoResetResult = Object.freeze({
    identity: demoProfileResetIdentity,
    status: failures.length > 0 ? "failed" as const : "reset" as const,
    reason: failures.length > 0 ? "baseline_not_ready" as const : null,
    profileId,
    removed: Object.freeze({
      csvImportIds,
      decisionIds,
      executionIds,
      sceneIds: scenes.sceneIds,
      approvalKeys: owned.approvalKeys,
      collaborationKeys: owned.collaborationKeys,
      learningKeys: owned.learningKeys,
      outcomeIds,
      monitoringPolicyIds,
    }),
    restored: restored.restored,
    preservedManagerState: true as const,
    failures: Object.freeze(failures),
  });
  listeners.forEach((listener) => listener(result));
  return result;
}
