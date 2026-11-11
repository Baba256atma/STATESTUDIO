/** Workspace-scoped, in-memory RDI:4 connection and observation journal. */
import { demoProfileIdForWrite, demoProfileVisible } from "../demo-profile/demoProfileOwnership.ts";
import type { DemoProfileId } from "../demo-profile/demoProfileContract.ts";
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination } from "../workspace/workspaceAuthorityFence.ts";
import { DEMO_WORKSPACE_ID, type WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { legacyWorkflowKeyBlockedForActiveManager } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import {
  transitionNexoraLiveConnection,
  type NexoraLiveCommittedObservation,
  type NexoraLiveConnection,
  type NexoraLiveConnectionState,
  type NexoraLivePreparedObservation,
} from "./liveDataConnectorFoundation.ts";
import { projectDataRealityToExecutiveRuntime } from "./dataRealityStageProjection.ts";
import { resolveDataRealityExecutiveAdvisorIntegration } from "./dataRealityExecutiveAdvisorIntegration.ts";
import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;
let connections: Readonly<Record<WorkspaceId, Readonly<Record<string, NexoraLiveConnection>>>> = Object.freeze({});
let observations: Readonly<Record<WorkspaceId, Readonly<Record<string, readonly NexoraLiveCommittedObservation[]>>>> = Object.freeze({});

export type NexoraLiveObservationDeletion = Readonly<{
  workspaceId: WorkspaceId;
  connectionId: string;
  observationId: string;
  demoProfileId: DemoProfileId | null;
  removedAt: string;
}>;

let observationDeletions: readonly NexoraLiveObservationDeletion[] = Object.freeze([]);

function observationDeletionIdentity(value: Readonly<{
  workspaceId: string;
  connectionId: string;
  observationId: string;
  demoProfileId?: string | null;
}>): string {
  return `${value.workspaceId}:${value.connectionId}:${value.demoProfileId ?? ""}:${value.observationId}`;
}

export function listNexoraLiveObservationDeletions(): readonly NexoraLiveObservationDeletion[] {
  return observationDeletions;
}

function rememberObservationDeletion(entry: NexoraLiveObservationDeletion): void {
  const key = observationDeletionIdentity(entry);
  if (observationDeletions.some((current) => observationDeletionIdentity(current) === key)) return;
  observationDeletions = Object.freeze(
    [...observationDeletions, Object.freeze(entry)].sort((a, b) => observationDeletionIdentity(a).localeCompare(observationDeletionIdentity(b))),
  );
}

function observationDeletionFor(
  workspaceId: string,
  connectionId: string,
  demoProfileId: string | null,
  observationId: string,
): NexoraLiveObservationDeletion | null {
  const key = observationDeletionIdentity({ workspaceId, connectionId, observationId, demoProfileId });
  return observationDeletions.find((entry) => observationDeletionIdentity(entry) === key) ?? null;
}

function publish(): void { version += 1; listeners.forEach((listener) => listener()); }
export function subscribeLiveDataConnections(listener: Listener): () => void { listeners.add(listener); return () => listeners.delete(listener); }
export function getLiveDataConnectionVersion(): number { return version; }

export function listNexoraLiveConnections(workspaceId: WorkspaceId): readonly NexoraLiveConnection[] {
  return Object.freeze(Object.values(connections[workspaceId] ?? {}).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
}
export function getNexoraLiveConnection(workspaceId: WorkspaceId, connectionId: string): NexoraLiveConnection | null { return connections[workspaceId]?.[connectionId] ?? null; }
function observationHistory(workspaceId: WorkspaceId, connectionId: string): readonly NexoraLiveCommittedObservation[] {
  return observations[workspaceId]?.[connectionId] ?? Object.freeze([]);
}

export function listNexoraLiveObservations(workspaceId: WorkspaceId, connectionId: string): readonly NexoraLiveCommittedObservation[] {
  return Object.freeze(
    observationHistory(workspaceId, connectionId).filter((observation) =>
      demoProfileVisible(observation.workspaceId, observation.demoProfileId),
    ),
  );
}

export function listAllNexoraLiveCommittedObservations(): readonly NexoraLiveCommittedObservation[] {
  return Object.freeze(
    Object.values(observations).flatMap((workspace) =>
      Object.values(workspace).flatMap((history) =>
        history.filter((observation) => demoProfileVisible(observation.workspaceId, observation.demoProfileId)),
      ),
    ),
  );
}

export function saveNexoraLiveConnection(connection: NexoraLiveConnection): NexoraLiveConnection {
  if (legacyWorkflowKeyBlockedForActiveManager(connection.workspaceId)) return connection;
  connections = Object.freeze({ ...connections, [connection.workspaceId]: Object.freeze({ ...(connections[connection.workspaceId] ?? {}), [connection.connectionId]: connection }) }); publish(); return connection;
}
export function setNexoraLiveConnectionState(input: Readonly<{ workspaceId: WorkspaceId; connectionId: string; state: NexoraLiveConnectionState; updatedAt: string; lastSuccessfulObservationAt?: string | null }>): NexoraLiveConnection | null {
  const current = getNexoraLiveConnection(input.workspaceId, input.connectionId); if (!current) return null;
  return saveNexoraLiveConnection(transitionNexoraLiveConnection(current, input.state, input.updatedAt, input.lastSuccessfulObservationAt === undefined ? current.lastSuccessfulObservationAt : input.lastSuccessfulObservationAt));
}

/** Atomic publication: failed preparations never alter the observation journal. */
export function commitNexoraLiveObservation(input: Readonly<{ connection: NexoraLiveConnection; prepared: NexoraLivePreparedObservation; committedAt: string }>): Readonly<{ committed: boolean; reason: "committed"|"not_ready"|"workspace_mismatch"|"connection_mismatch"|"stale_observation"|"profile_mismatch"|"removed_observation"; observation: NexoraLiveCommittedObservation | null }> {
  if (
    requireWorkspaceMutationCoordination() ||
    !evaluateWorkspaceAuthority(input.connection.workspaceId).ok ||
    legacyWorkflowKeyBlockedForActiveManager(input.connection.workspaceId)
  ) {
    return Object.freeze({ committed: false, reason: "workspace_mismatch", observation: null });
  }
  if (!input.prepared.ready || !input.prepared.snapshot || !input.prepared.handoff || !input.prepared.dataReality || !input.prepared.runtime || !input.prepared.advisor) return Object.freeze({ committed: false, reason: "not_ready", observation: null });
  if (input.connection.workspaceId !== input.prepared.workspaceId) return Object.freeze({ committed: false, reason: "workspace_mismatch", observation: null });
  if (input.prepared.snapshot.source.identity.connectionId !== input.connection.connectionId) return Object.freeze({ committed: false, reason: "connection_mismatch", observation: null });
  const history = observationHistory(input.connection.workspaceId, input.connection.connectionId);
  const profileId = demoProfileIdForWrite(input.connection.workspaceId);
  if (observationDeletionFor(input.connection.workspaceId, input.connection.connectionId, profileId, input.prepared.observationId)) {
    return Object.freeze({ committed: false, reason: "removed_observation", observation: null });
  }
  const occupied = history.find((observation) => observation.observationId === input.prepared.observationId);
  if (occupied && (occupied.demoProfileId ?? null) !== profileId) {
    return Object.freeze({ committed: false, reason: "profile_mismatch", observation: occupied });
  }
  const comparable = history.filter((observation) => (observation.demoProfileId ?? null) === profileId);
  const latest = comparable[comparable.length - 1];
  if (latest && input.prepared.observedAt < latest.observedAt) return Object.freeze({ committed: false, reason: "stale_observation", observation: null });
  const observation: NexoraLiveCommittedObservation = Object.freeze({
    ...input.prepared,
    ready: true,
    snapshot: input.prepared.snapshot,
    handoff: input.prepared.handoff,
    dataReality: input.prepared.dataReality,
    runtime: input.prepared.runtime,
    advisor: input.prepared.advisor,
    committedAt: input.committedAt,
    connectionId: input.connection.connectionId,
    ...(profileId ? { demoProfileId: profileId } : {}),
  });
  observations = Object.freeze({ ...observations, [input.connection.workspaceId]: Object.freeze({ ...(observations[input.connection.workspaceId] ?? {}), [input.connection.connectionId]: Object.freeze([...history, observation]) }) });
  const currentWorkspace = connections[input.connection.workspaceId] ?? {};
  connections = Object.freeze({ ...connections, [input.connection.workspaceId]: Object.freeze({ ...currentWorkspace, [input.connection.connectionId]: transitionNexoraLiveConnection(input.connection, "connected", input.committedAt, observation.observedAt) }) });
  publish();
  return Object.freeze({ committed: true, reason: "committed", observation });
}

export function disconnectNexoraLiveConnection(input: Readonly<{ workspaceId: WorkspaceId; connectionId: string; activeSourceContextId: string | null; disconnectedAt: string }>): Readonly<{ disconnected: boolean; reason: "disconnected"|"not_found"|"active_source"; connection: NexoraLiveConnection | null }> {
  const connection = getNexoraLiveConnection(input.workspaceId, input.connectionId);
  if (!connection) return Object.freeze({ disconnected: false, reason: "not_found", connection: null });
  if (input.activeSourceContextId === `live:${input.connectionId}`) return Object.freeze({ disconnected: false, reason: "active_source", connection });
  const disconnected = setNexoraLiveConnectionState({ workspaceId: input.workspaceId, connectionId: input.connectionId, state: "disconnected", updatedAt: input.disconnectedAt });
  return Object.freeze({ disconnected: true, reason: "disconnected", connection: disconnected });
}

export type NexoraDurableLiveObservation = Pick<
  NexoraLiveCommittedObservation,
  | "ready"
  | "workspaceId"
  | "sourceContextId"
  | "observationId"
  | "sourceLabel"
  | "observedAt"
  | "recordCount"
  | "mappingId"
  | "snapshot"
  | "handoff"
  | "transportFailure"
  | "errors"
  | "committedAt"
  | "connectionId"
  | "demoProfileId"
>;

export type NexoraLiveDataRecoverySnapshot = Readonly<{
  connections: readonly NexoraLiveConnection[];
  observations: readonly NexoraDurableLiveObservation[];
  observationDeletions?: readonly NexoraLiveObservationDeletion[];
}>;

/**
 * PM:5 persists safe metadata and only the two newest canonical observations.
 * Data Reality, Runtime, and advisor projections are intentionally rebuilt
 * from the canonical handoff during recovery; duplicating them made real
 * observations too large for the browser repository and would create a
 * second truth payload.
 */
export function exportNexoraLiveDataRecoverySnapshot(): NexoraLiveDataRecoverySnapshot {
  const durableObservations = Object.values(observations).flatMap((workspace) =>
    Object.values(workspace).flatMap((history) => history.slice(-2).map((observation) => Object.freeze({
      ready: observation.ready,
      workspaceId: observation.workspaceId,
      sourceContextId: observation.sourceContextId,
      observationId: observation.observationId,
      sourceLabel: observation.sourceLabel,
      observedAt: observation.observedAt,
      recordCount: observation.recordCount,
      mappingId: observation.mappingId,
      snapshot: observation.snapshot,
      handoff: observation.handoff,
      transportFailure: observation.transportFailure,
      errors: observation.errors,
      committedAt: observation.committedAt,
      connectionId: observation.connectionId,
      ...(observation.demoProfileId ? { demoProfileId: observation.demoProfileId } : {}),
    }))));
  return Object.freeze({
    connections: Object.freeze(Object.values(connections).flatMap((workspace) => Object.values(workspace)).sort((a, b) => a.connectionId.localeCompare(b.connectionId))),
    observations: Object.freeze(durableObservations.sort((a, b) => a.observedAt.localeCompare(b.observedAt) || a.observationId.localeCompare(b.observationId))),
    observationDeletions,
  });
}

export function hydrateNexoraLiveDataRecoverySnapshot(snapshot: NexoraLiveDataRecoverySnapshot): void {
  const nextConnections: Record<WorkspaceId, Record<string, NexoraLiveConnection>> = {};
  for (const connection of snapshot.connections) {
    nextConnections[connection.workspaceId] ??= {};
    nextConnections[connection.workspaceId]![connection.connectionId] = connection;
  }
  observationDeletions = Object.freeze([...(snapshot.observationDeletions ?? [])]);
  const nextObservations: Record<WorkspaceId, Record<string, NexoraLiveCommittedObservation[]>> = {};
  for (const observation of snapshot.observations) {
    if (observationDeletionFor(observation.workspaceId, observation.connectionId, observation.demoProfileId ?? null, observation.observationId)) continue;
    const connection = nextConnections[observation.workspaceId]?.[observation.connectionId];
    if (!connection || observation.snapshot.source.identity.connectionId !== connection.connectionId) continue;
    const dataReality = resolveDatasetExecutiveReality(observation.handoff.dataset, {
      bindings: getExecutiveOperationsResolvedObjectBindings(),
      definitions: getExecutiveOperationsKpiDefinitions(),
      rules: getExecutiveOperationsExecutiveStateRules(),
      createdAt: observation.observedAt,
    });
    if (dataReality.status === "invalid") continue;
    const recoveredObservation: NexoraLiveCommittedObservation = Object.freeze({
      ...observation,
      dataReality,
      runtime: projectDataRealityToExecutiveRuntime(dataReality.snapshot),
      advisor: resolveDataRealityExecutiveAdvisorIntegration({
        dataset: observation.handoff.dataset,
        currentWorkspace: observation.workspaceId,
      }),
    });
    nextObservations[observation.workspaceId] ??= {};
    nextObservations[observation.workspaceId]![observation.connectionId] ??= [];
    nextObservations[observation.workspaceId]![observation.connectionId]!.push(recoveredObservation);
  }
  connections = Object.freeze(Object.fromEntries(Object.entries(nextConnections).map(([workspaceId, values]) => [workspaceId, Object.freeze(values)])));
  observations = Object.freeze(Object.fromEntries(Object.entries(nextObservations).map(([workspaceId, values]) => [workspaceId, Object.freeze(Object.fromEntries(Object.entries(values).map(([connectionId, history]) => [connectionId, Object.freeze(history.sort((a, b) => a.observedAt.localeCompare(b.observedAt)))])))])));
  publish();
}

/** Removes one demo profile's observations. Other profiles, legacy rows, and customer workspaces stay. */
/** Removes one Workspace-owned observation and records a tombstone. Other observations stay. */
export function removeWorkspaceLiveObservation(input: Readonly<{
  workspaceId: WorkspaceId;
  connectionId: string;
  observationId: string;
  removedAt: string;
}>): Readonly<{ removed: boolean; reason: "removed" | "not_found" | "workspace_mismatch" }> {
  if (
    requireWorkspaceMutationCoordination()
    || !evaluateWorkspaceAuthority(input.workspaceId).ok
    || legacyWorkflowKeyBlockedForActiveManager(input.workspaceId)
  ) {
    return Object.freeze({ removed: false, reason: "workspace_mismatch" });
  }
  const history = observationHistory(input.workspaceId, input.connectionId);
  const target = history.find((observation) => observation.observationId === input.observationId && observation.workspaceId === input.workspaceId);
  if (!target) return Object.freeze({ removed: false, reason: "not_found" });
  const kept = history.filter((observation) => observation.observationId !== target.observationId);
  const nextWorkspace = { ...(observations[input.workspaceId] ?? {}) };
  if (kept.length > 0) nextWorkspace[input.connectionId] = Object.freeze(kept);
  else delete nextWorkspace[input.connectionId];
  const next = { ...observations };
  if (Object.keys(nextWorkspace).length > 0) next[input.workspaceId] = Object.freeze(nextWorkspace);
  else delete next[input.workspaceId];
  observations = Object.freeze(next);
  rememberObservationDeletion(Object.freeze({
    workspaceId: target.workspaceId,
    connectionId: target.connectionId,
    observationId: target.observationId,
    demoProfileId: target.demoProfileId ?? null,
    removedAt: input.removedAt,
  }));
  publish();
  return Object.freeze({ removed: true, reason: "removed" });
}

export function removeDemoProfileLiveObservations(profileId: DemoProfileId): readonly string[] {
  const removed: string[] = [];
  const next: Record<string, Record<string, readonly NexoraLiveCommittedObservation[]>> = {};
  for (const [workspaceId, connectionsForWorkspace] of Object.entries(observations)) {
    const keptConnections: Record<string, readonly NexoraLiveCommittedObservation[]> = {};
    for (const [connectionId, history] of Object.entries(connectionsForWorkspace)) {
      const kept = history.filter((observation) => {
        if (observation.workspaceId === DEMO_WORKSPACE_ID && observation.demoProfileId === profileId) {
          removed.push(observation.observationId);
          rememberObservationDeletion(Object.freeze({
            workspaceId: observation.workspaceId,
            connectionId: observation.connectionId,
            observationId: observation.observationId,
            demoProfileId: profileId,
            removedAt: observation.committedAt,
          }));
          return false;
        }
        return true;
      });
      if (kept.length > 0) keptConnections[connectionId] = Object.freeze(kept);
    }
    if (Object.keys(keptConnections).length > 0) next[workspaceId] = Object.freeze(keptConnections);
  }
  observations = Object.freeze(next);
  publish();
  return Object.freeze(removed);
}

export function resetLiveDataConnectionStoreForTests(): void { connections = Object.freeze({}); observations = Object.freeze({}); observationDeletions = Object.freeze([]); version = 0; listeners.clear(); }
