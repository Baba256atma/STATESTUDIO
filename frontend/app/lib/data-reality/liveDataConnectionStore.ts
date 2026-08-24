/** Workspace-scoped, in-memory RDI:4 connection and observation journal. */
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
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

function publish(): void { version += 1; listeners.forEach((listener) => listener()); }
export function subscribeLiveDataConnections(listener: Listener): () => void { listeners.add(listener); return () => listeners.delete(listener); }
export function getLiveDataConnectionVersion(): number { return version; }

export function listNexoraLiveConnections(workspaceId: WorkspaceId): readonly NexoraLiveConnection[] {
  return Object.freeze(Object.values(connections[workspaceId] ?? {}).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
}
export function getNexoraLiveConnection(workspaceId: WorkspaceId, connectionId: string): NexoraLiveConnection | null { return connections[workspaceId]?.[connectionId] ?? null; }
export function listNexoraLiveObservations(workspaceId: WorkspaceId, connectionId: string): readonly NexoraLiveCommittedObservation[] { return observations[workspaceId]?.[connectionId] ?? Object.freeze([]); }

export function listAllNexoraLiveCommittedObservations(): readonly NexoraLiveCommittedObservation[] {
  return Object.freeze(
    Object.values(observations).flatMap((workspace) =>
      Object.values(workspace).flatMap((history) => history),
    ),
  );
}

export function saveNexoraLiveConnection(connection: NexoraLiveConnection): NexoraLiveConnection {
  connections = Object.freeze({ ...connections, [connection.workspaceId]: Object.freeze({ ...(connections[connection.workspaceId] ?? {}), [connection.connectionId]: connection }) }); publish(); return connection;
}
export function setNexoraLiveConnectionState(input: Readonly<{ workspaceId: WorkspaceId; connectionId: string; state: NexoraLiveConnectionState; updatedAt: string; lastSuccessfulObservationAt?: string | null }>): NexoraLiveConnection | null {
  const current = getNexoraLiveConnection(input.workspaceId, input.connectionId); if (!current) return null;
  return saveNexoraLiveConnection(transitionNexoraLiveConnection(current, input.state, input.updatedAt, input.lastSuccessfulObservationAt === undefined ? current.lastSuccessfulObservationAt : input.lastSuccessfulObservationAt));
}

/** Atomic publication: failed preparations never alter the observation journal. */
export function commitNexoraLiveObservation(input: Readonly<{ connection: NexoraLiveConnection; prepared: NexoraLivePreparedObservation; committedAt: string }>): Readonly<{ committed: boolean; reason: "committed"|"not_ready"|"workspace_mismatch"|"connection_mismatch"|"stale_observation"; observation: NexoraLiveCommittedObservation | null }> {
  if (!input.prepared.ready || !input.prepared.snapshot || !input.prepared.handoff || !input.prepared.dataReality || !input.prepared.runtime || !input.prepared.advisor) return Object.freeze({ committed: false, reason: "not_ready", observation: null });
  if (input.connection.workspaceId !== input.prepared.workspaceId) return Object.freeze({ committed: false, reason: "workspace_mismatch", observation: null });
  if (input.prepared.snapshot.source.identity.connectionId !== input.connection.connectionId) return Object.freeze({ committed: false, reason: "connection_mismatch", observation: null });
  const existing = listNexoraLiveObservations(input.connection.workspaceId, input.connection.connectionId);
  const latest = existing[existing.length - 1];
  if (latest && input.prepared.observedAt < latest.observedAt) return Object.freeze({ committed: false, reason: "stale_observation", observation: null });
  const observation: NexoraLiveCommittedObservation = Object.freeze({ ...input.prepared, ready: true, snapshot: input.prepared.snapshot, handoff: input.prepared.handoff, dataReality: input.prepared.dataReality, runtime: input.prepared.runtime, advisor: input.prepared.advisor, committedAt: input.committedAt, connectionId: input.connection.connectionId });
  observations = Object.freeze({ ...observations, [input.connection.workspaceId]: Object.freeze({ ...(observations[input.connection.workspaceId] ?? {}), [input.connection.connectionId]: Object.freeze([...existing, observation]) }) });
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
>;

export type NexoraLiveDataRecoverySnapshot = Readonly<{
  connections: readonly NexoraLiveConnection[];
  observations: readonly NexoraDurableLiveObservation[];
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
    }))));
  return Object.freeze({
    connections: Object.freeze(Object.values(connections).flatMap((workspace) => Object.values(workspace)).sort((a, b) => a.connectionId.localeCompare(b.connectionId))),
    observations: Object.freeze(durableObservations.sort((a, b) => a.observedAt.localeCompare(b.observedAt) || a.observationId.localeCompare(b.observationId))),
  });
}

export function hydrateNexoraLiveDataRecoverySnapshot(snapshot: NexoraLiveDataRecoverySnapshot): void {
  const nextConnections: Record<WorkspaceId, Record<string, NexoraLiveConnection>> = {};
  for (const connection of snapshot.connections) {
    nextConnections[connection.workspaceId] ??= {};
    nextConnections[connection.workspaceId]![connection.connectionId] = connection;
  }
  const nextObservations: Record<WorkspaceId, Record<string, NexoraLiveCommittedObservation[]>> = {};
  for (const observation of snapshot.observations) {
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

export function resetLiveDataConnectionStoreForTests(): void { connections = Object.freeze({}); observations = Object.freeze({}); version = 0; listeners.clear(); }
