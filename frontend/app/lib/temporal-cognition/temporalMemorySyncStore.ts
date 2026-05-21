import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_MEMORY_SYNC_MAX_ALIGNMENTS,
  TEMPORAL_MEMORY_SYNC_MAX_BRIDGES,
  TEMPORAL_MEMORY_SYNC_MAX_FINGERPRINTS,
  TEMPORAL_MEMORY_SYNC_MAX_RECORDS,
  TEMPORAL_MEMORY_SYNC_MAX_SEQUENCES,
  TEMPORAL_MEMORY_SYNC_MAX_SIGNALS,
  TEMPORAL_MEMORY_SYNC_MAX_SNAPSHOTS,
} from "./temporalMemorySyncGuards";
import type {
  CrossPeriodAwarenessSignal,
  InstitutionalTemporalSyncSnapshot,
  OrganizationalPeriodBridge,
  PeriodSynchronizationSequence,
  TemporalMemorySyncStoreState,
  TemporalMemorySyncRecord,
  TemporalPeriodAlignment,
} from "./temporalMemorySyncTypes";

function mergeSyncRecords(
  existing: TemporalMemorySyncRecord,
  incoming: TemporalMemorySyncRecord
): TemporalMemorySyncRecord {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    crossPeriodSignals: Object.freeze(
      Array.from(new Set([...existing.crossPeriodSignals, ...incoming.crossPeriodSignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  syncRecords: readonly TemporalMemorySyncRecord[];
}): string {
  return stableSignature([
    "d9-3-8-temporal-memory-sync",
    state.syncRecords.length,
    state.syncRecords.slice(0, 3).map((r) => r.syncId),
  ]);
}

export function createTemporalMemorySyncStore(initial?: TemporalMemorySyncStoreState): {
  getState(): TemporalMemorySyncStoreState;
  upsertSyncRecords(
    records: TemporalMemorySyncRecord[],
    now?: number
  ): TemporalMemorySyncStoreState;
  upsertSnapshots(
    snapshots: InstitutionalTemporalSyncSnapshot[],
    now?: number
  ): TemporalMemorySyncStoreState;
  upsertAwarenessSignals(
    signals: CrossPeriodAwarenessSignal[],
    now?: number
  ): TemporalMemorySyncStoreState;
  upsertPeriodBridges(
    bridges: OrganizationalPeriodBridge[],
    now?: number
  ): TemporalMemorySyncStoreState;
  upsertPeriodAlignments(
    alignments: TemporalPeriodAlignment[],
    now?: number
  ): TemporalMemorySyncStoreState;
  upsertSequences(
    sequences: PeriodSynchronizationSequence[],
    now?: number
  ): TemporalMemorySyncStoreState;
  recordPeriodFingerprint(reference: string, fingerprint: string, now?: number): void;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalMemorySyncStoreState;
} {
  let state: TemporalMemorySyncStoreState = initial ?? {
    syncRecords: [],
    snapshots: [],
    awarenessSignals: [],
    periodBridges: [],
    periodAlignments: [],
    sequences: [],
    periodFingerprints: [],
    signature: buildStoreSignature({ syncRecords: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalMemorySyncStoreState {
      return {
        ...state,
        syncRecords: state.syncRecords.map((r) => ({ ...r })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        awarenessSignals: state.awarenessSignals.map((s) => ({ ...s })),
        periodBridges: state.periodBridges.map((b) => ({ ...b })),
        periodAlignments: state.periodAlignments.map((a) => ({ ...a })),
        sequences: state.sequences.map((s) => ({ ...s })),
        periodFingerprints: state.periodFingerprints.map((f) => ({ ...f })),
      };
    },

    upsertSyncRecords(
      records: TemporalMemorySyncRecord[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, TemporalMemorySyncRecord>();
      for (const r of state.syncRecords) byId.set(r.syncId, r);
      for (const r of records) {
        const existing = byId.get(r.syncId);
        byId.set(r.syncId, existing ? mergeSyncRecords(existing, r) : { ...r });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_RECORDS);
      state = {
        ...state,
        syncRecords: Object.freeze(next),
        signature: buildStoreSignature({ syncRecords: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: InstitutionalTemporalSyncSnapshot[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, InstitutionalTemporalSyncSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAwarenessSignals(
      signals: CrossPeriodAwarenessSignal[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, CrossPeriodAwarenessSignal>();
      for (const s of state.awarenessSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_SIGNALS);
      state = { ...state, awarenessSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPeriodBridges(
      bridges: OrganizationalPeriodBridge[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, OrganizationalPeriodBridge>();
      for (const b of state.periodBridges) byId.set(b.bridgeId, b);
      for (const b of bridges) byId.set(b.bridgeId, b);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_BRIDGES);
      state = { ...state, periodBridges: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPeriodAlignments(
      alignments: TemporalPeriodAlignment[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, TemporalPeriodAlignment>();
      for (const a of state.periodAlignments) byId.set(a.alignmentId, a);
      for (const a of alignments) byId.set(a.alignmentId, a);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_ALIGNMENTS);
      state = { ...state, periodAlignments: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSequences(
      sequences: PeriodSynchronizationSequence[],
      now = Date.now()
    ): TemporalMemorySyncStoreState {
      const byId = new Map<string, PeriodSynchronizationSequence>();
      for (const s of state.sequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_MEMORY_SYNC_MAX_SEQUENCES);
      state = { ...state, sequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    recordPeriodFingerprint(reference: string, fingerprint: string, now = Date.now()): void {
      const next = [
        { reference, fingerprint, recordedAt: now },
        ...state.periodFingerprints.filter((f) => f.reference !== reference),
      ].slice(0, TEMPORAL_MEMORY_SYNC_MAX_FINGERPRINTS);
      state = { ...state, periodFingerprints: Object.freeze(next), updatedAt: now };
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalMemorySyncStoreState {
      state = {
        syncRecords: [],
        snapshots: [],
        awarenessSignals: [],
        periodBridges: [],
        periodAlignments: [],
        sequences: [],
        periodFingerprints: [],
        signature: buildStoreSignature({ syncRecords: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTemporalMemorySyncStore>>();

export function getTemporalMemorySyncStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalMemorySyncStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalMemorySyncStores(): void {
  storesByOrganization.clear();
}
