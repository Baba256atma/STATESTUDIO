import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_COMPRESSION_MAX_DIGESTS,
  TEMPORAL_COMPRESSION_MAX_LAYERS,
  TEMPORAL_COMPRESSION_MAX_SIGNALS,
  TEMPORAL_COMPRESSION_MAX_SNAPSHOTS,
  TEMPORAL_COMPRESSION_MAX_SUMMARIES,
  TEMPORAL_COMPRESSION_MAX_TIMELINES,
} from "./temporalCompressionGuards";
import type {
  EvolutionDistillationSignal,
  ExecutiveTemporalDigest,
  OrganizationalEvolutionSummary,
  StrategicTimelineCompression,
  TemporalAbstractionLayer,
  TemporalCompressionSnapshot,
  TemporalCompressionStoreState,
} from "./temporalCompressionTypes";

function mergeDigests(
  existing: ExecutiveTemporalDigest,
  incoming: ExecutiveTemporalDigest
): ExecutiveTemporalDigest {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    distilledSignals: Object.freeze(
      Array.from(new Set([...existing.distilledSignals, ...incoming.distilledSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    compressionLevel:
      incoming.confidence >= existing.confidence
        ? incoming.compressionLevel
        : existing.compressionLevel,
    abstractionState:
      incoming.confidence >= existing.confidence
        ? incoming.abstractionState
        : existing.abstractionState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  digests: readonly ExecutiveTemporalDigest[];
}): string {
  return stableSignature([
    "d9-3-7-temporal-compression",
    state.digests.length,
    state.digests.slice(0, 3).map((d) => d.compressionId),
  ]);
}

export function createTemporalCompressionStore(initial?: TemporalCompressionStoreState): {
  getState(): TemporalCompressionStoreState;
  upsertDigests(digests: ExecutiveTemporalDigest[], now?: number): TemporalCompressionStoreState;
  upsertSummaries(
    summaries: OrganizationalEvolutionSummary[],
    now?: number
  ): TemporalCompressionStoreState;
  upsertTimelineCompressions(
    compressions: StrategicTimelineCompression[],
    now?: number
  ): TemporalCompressionStoreState;
  upsertSnapshots(
    snapshots: TemporalCompressionSnapshot[],
    now?: number
  ): TemporalCompressionStoreState;
  upsertSignals(
    signals: EvolutionDistillationSignal[],
    now?: number
  ): TemporalCompressionStoreState;
  upsertAbstractionLayers(
    layers: TemporalAbstractionLayer[],
    now?: number
  ): TemporalCompressionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalCompressionStoreState;
} {
  let state: TemporalCompressionStoreState = initial ?? {
    digests: [],
    summaries: [],
    timelineCompressions: [],
    snapshots: [],
    signals: [],
    abstractionLayers: [],
    signature: buildStoreSignature({ digests: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalCompressionStoreState {
      return {
        ...state,
        digests: state.digests.map((d) => ({ ...d })),
        summaries: state.summaries.map((s) => ({ ...s })),
        timelineCompressions: state.timelineCompressions.map((t) => ({ ...t })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
        abstractionLayers: state.abstractionLayers.map((l) => ({ ...l })),
      };
    },

    upsertDigests(
      digests: ExecutiveTemporalDigest[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, ExecutiveTemporalDigest>();
      for (const d of state.digests) byId.set(d.compressionId, d);
      for (const d of digests) {
        const existing = byId.get(d.compressionId);
        byId.set(d.compressionId, existing ? mergeDigests(existing, d) : { ...d });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_DIGESTS);
      state = {
        ...state,
        digests: Object.freeze(next),
        signature: buildStoreSignature({ digests: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSummaries(
      summaries: OrganizationalEvolutionSummary[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, OrganizationalEvolutionSummary>();
      for (const s of state.summaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_SUMMARIES);
      state = { ...state, summaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTimelineCompressions(
      compressions: StrategicTimelineCompression[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, StrategicTimelineCompression>();
      for (const c of state.timelineCompressions) byId.set(c.compressionKey, c);
      for (const c of compressions) byId.set(c.compressionKey, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_TIMELINES);
      state = { ...state, timelineCompressions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: TemporalCompressionSnapshot[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, TemporalCompressionSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: EvolutionDistillationSignal[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, EvolutionDistillationSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAbstractionLayers(
      layers: TemporalAbstractionLayer[],
      now = Date.now()
    ): TemporalCompressionStoreState {
      const byId = new Map<string, TemporalAbstractionLayer>();
      for (const l of state.abstractionLayers) byId.set(l.layerId, l);
      for (const l of layers) byId.set(l.layerId, l);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COMPRESSION_MAX_LAYERS);
      state = { ...state, abstractionLayers: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalCompressionStoreState {
      state = {
        digests: [],
        summaries: [],
        timelineCompressions: [],
        snapshots: [],
        signals: [],
        abstractionLayers: [],
        signature: buildStoreSignature({ digests: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTemporalCompressionStore>>();

export function getTemporalCompressionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalCompressionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalCompressionStores(): void {
  storesByOrganization.clear();
}
