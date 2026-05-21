import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DISTRIBUTED_MEMORY_SYNC_MAX_ALIGNMENT,
  DISTRIBUTED_MEMORY_SYNC_MAX_DIVERGENCE,
  DISTRIBUTED_MEMORY_SYNC_MAX_OBSERVATIONS,
  DISTRIBUTED_MEMORY_SYNC_MAX_SIGNALS,
  DISTRIBUTED_MEMORY_SYNC_MAX_SNAPSHOTS,
} from "./distributedMemorySyncGuards";
import type {
  CollaborativeContinuityObservation,
  ContinuityState,
  DistributedCognitionContinuitySignal,
  DistributedMemorySyncStoreState,
  EnterpriseMemoryDivergenceIndicator,
  MultiPerspectiveMemorySnapshot,
  StrategicMemoryAlignmentField,
} from "./distributedMemorySyncTypes";

function mergeObservations(
  existing: CollaborativeContinuityObservation,
  incoming: CollaborativeContinuityObservation
): CollaborativeContinuityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    synchronizedPerspectives: Object.freeze(
      Array.from(
        new Set([...existing.synchronizedPerspectives, ...incoming.synchronizedPerspectives])
      ).slice(0, 6)
    ),
    fragmentedPerspectives: Object.freeze(
      Array.from(new Set([...existing.fragmentedPerspectives, ...incoming.fragmentedPerspectives])).slice(
        0,
        6
      )
    ),
    synchronizationSignals: Object.freeze(
      Array.from(new Set([...existing.synchronizationSignals, ...incoming.synchronizationSignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    continuityState:
      incoming.confidence >= existing.confidence ? incoming.continuityState : existing.continuityState,
    synchronizationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.synchronizationStrength
        : existing.synchronizationStrength,
    synchronizationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.synchronizationCategory
        : existing.synchronizationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly CollaborativeContinuityObservation[];
}): string {
  return stableSignature([
    "d9-7-8-distributed-memory-sync",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.synchronizationId),
  ]);
}

export function createDistributedMemorySyncStore(initial?: DistributedMemorySyncStoreState): {
  getState(): DistributedMemorySyncStoreState;
  upsertObservations(
    observations: CollaborativeContinuityObservation[],
    now?: number
  ): DistributedMemorySyncStoreState;
  upsertSnapshots(
    snapshots: MultiPerspectiveMemorySnapshot[],
    now?: number
  ): DistributedMemorySyncStoreState;
  upsertContinuitySignals(
    signals: DistributedCognitionContinuitySignal[],
    now?: number
  ): DistributedMemorySyncStoreState;
  upsertDivergenceIndicators(
    indicators: EnterpriseMemoryDivergenceIndicator[],
    now?: number
  ): DistributedMemorySyncStoreState;
  upsertAlignmentFields(
    fields: StrategicMemoryAlignmentField[],
    now?: number
  ): DistributedMemorySyncStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastContinuityState(state: ContinuityState): void;
  clear(): DistributedMemorySyncStoreState;
} {
  let state: DistributedMemorySyncStoreState = initial ?? {
    observations: [],
    snapshots: [],
    continuitySignals: [],
    divergenceIndicators: [],
    alignmentFields: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastContinuityState: null,
  };

  return {
    getState(): DistributedMemorySyncStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        continuitySignals: state.continuitySignals.map((s) => ({ ...s })),
        divergenceIndicators: state.divergenceIndicators.map((i) => ({ ...i })),
        alignmentFields: state.alignmentFields.map((f) => ({ ...f })),
      };
    },

    upsertObservations(
      observations: CollaborativeContinuityObservation[],
      now = Date.now()
    ): DistributedMemorySyncStoreState {
      const byId = new Map<string, CollaborativeContinuityObservation>();
      for (const o of state.observations) byId.set(o.synchronizationId, o);
      for (const o of observations) {
        const existing = byId.get(o.synchronizationId);
        byId.set(o.synchronizationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DISTRIBUTED_MEMORY_SYNC_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: MultiPerspectiveMemorySnapshot[],
      now = Date.now()
    ): DistributedMemorySyncStoreState {
      const bySig = new Map<string, MultiPerspectiveMemorySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_MEMORY_SYNC_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertContinuitySignals(
      signals: DistributedCognitionContinuitySignal[],
      now = Date.now()
    ): DistributedMemorySyncStoreState {
      const byId = new Map<string, DistributedCognitionContinuitySignal>();
      for (const s of state.continuitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_MEMORY_SYNC_MAX_SIGNALS);
      state = { ...state, continuitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDivergenceIndicators(
      indicators: EnterpriseMemoryDivergenceIndicator[],
      now = Date.now()
    ): DistributedMemorySyncStoreState {
      const byId = new Map<string, EnterpriseMemoryDivergenceIndicator>();
      for (const i of state.divergenceIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_MEMORY_SYNC_MAX_DIVERGENCE);
      state = { ...state, divergenceIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlignmentFields(
      fields: StrategicMemoryAlignmentField[],
      now = Date.now()
    ): DistributedMemorySyncStoreState {
      const byId = new Map<string, StrategicMemoryAlignmentField>();
      for (const f of state.alignmentFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_MEMORY_SYNC_MAX_ALIGNMENT);
      state = { ...state, alignmentFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastContinuityState(continuityState: ContinuityState): void {
      state = { ...state, lastContinuityState: continuityState };
    },

    clear(): DistributedMemorySyncStoreState {
      state = {
        observations: [],
        snapshots: [],
        continuitySignals: [],
        divergenceIndicators: [],
        alignmentFields: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastContinuityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDistributedMemorySyncStore>>();

export function getDistributedMemorySyncStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDistributedMemorySyncStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDistributedMemorySyncStores(): void {
  storesByOrganization.clear();
}
