import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_COGNITION_MAX_EVENTS,
  TEMPORAL_COGNITION_MAX_EVOLUTION,
  TEMPORAL_COGNITION_MAX_FRAMES,
  TEMPORAL_COGNITION_MAX_SEQUENCES,
  TEMPORAL_COGNITION_MAX_SIGNALS,
  TEMPORAL_COGNITION_MAX_SNAPSHOTS,
} from "./temporalCognitionGuards";
import type {
  EnterpriseTemporalSnapshot,
  OperationalChronologyFrame,
  OrganizationalEvolutionEvent,
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TemporalCognitionSignal,
  TemporalCognitionStoreState,
} from "./temporalCognitionTypes";

function mergeSequences(
  existing: StrategicTimelineSequence,
  incoming: StrategicTimelineSequence
): StrategicTimelineSequence {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    events: Object.freeze(
      Array.from(new Set([...existing.events, ...incoming.events])).slice(0, 6)
    ),
    eventIds: Object.freeze(
      Array.from(new Set([...existing.eventIds, ...incoming.eventIds])).slice(0, 8)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  sequences: readonly StrategicTimelineSequence[];
  events: readonly OrganizationalTimelineEvent[];
}): string {
  return stableSignature([
    "d9-3-1-temporal-cognition",
    state.sequences.length,
    state.events.length,
    state.sequences.slice(0, 3).map((s) => s.timelineId),
  ]);
}

export function createTemporalCognitionStore(initial?: TemporalCognitionStoreState): {
  getState(): TemporalCognitionStoreState;
  upsertSequences(
    sequences: StrategicTimelineSequence[],
    now?: number
  ): TemporalCognitionStoreState;
  upsertEvents(
    events: OrganizationalTimelineEvent[],
    now?: number
  ): TemporalCognitionStoreState;
  upsertSnapshots(
    snapshots: EnterpriseTemporalSnapshot[],
    now?: number
  ): TemporalCognitionStoreState;
  upsertSignals(signals: TemporalCognitionSignal[], now?: number): TemporalCognitionStoreState;
  upsertChronologyFrames(
    frames: OperationalChronologyFrame[],
    now?: number
  ): TemporalCognitionStoreState;
  upsertEvolutionEvents(
    events: OrganizationalEvolutionEvent[],
    now?: number
  ): TemporalCognitionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalCognitionStoreState;
} {
  let state: TemporalCognitionStoreState = initial ?? {
    sequences: [],
    events: [],
    snapshots: [],
    signals: [],
    chronologyFrames: [],
    evolutionEvents: [],
    signature: buildStoreSignature({ sequences: [], events: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalCognitionStoreState {
      return {
        ...state,
        sequences: state.sequences.map((s) => ({ ...s })),
        events: state.events.map((e) => ({ ...e })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
        chronologyFrames: state.chronologyFrames.map((f) => ({ ...f })),
        evolutionEvents: state.evolutionEvents.map((e) => ({ ...e })),
      };
    },

    upsertSequences(
      sequences: StrategicTimelineSequence[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, StrategicTimelineSequence>();
      for (const s of state.sequences) byId.set(s.timelineId, s);
      for (const s of sequences) {
        const existing = byId.get(s.timelineId);
        byId.set(s.timelineId, existing ? mergeSequences(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_COGNITION_MAX_SEQUENCES);
      state = {
        ...state,
        sequences: Object.freeze(next),
        signature: buildStoreSignature({ sequences: next, events: state.events }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertEvents(
      events: OrganizationalTimelineEvent[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, OrganizationalTimelineEvent>();
      for (const e of state.events) byId.set(e.eventId, e);
      for (const e of events) byId.set(e.eventId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => a.observedAt - b.observedAt)
        .slice(-TEMPORAL_COGNITION_MAX_EVENTS);
      state = {
        ...state,
        events: Object.freeze(next),
        signature: buildStoreSignature({ sequences: state.sequences, events: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseTemporalSnapshot[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, EnterpriseTemporalSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COGNITION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: TemporalCognitionSignal[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, TemporalCognitionSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COGNITION_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertChronologyFrames(
      frames: OperationalChronologyFrame[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, OperationalChronologyFrame>();
      for (const f of state.chronologyFrames) byId.set(f.frameId, f);
      for (const f of frames) {
        const existing = byId.get(f.frameId);
        if (!existing) {
          byId.set(f.frameId, { ...f });
          continue;
        }
        byId.set(f.frameId, {
          ...existing,
          narrative: f.narrative || existing.narrative,
          lastObservedAt: Math.max(existing.lastObservedAt, f.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_COGNITION_MAX_FRAMES);
      state = { ...state, chronologyFrames: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEvolutionEvents(
      events: OrganizationalEvolutionEvent[],
      now = Date.now()
    ): TemporalCognitionStoreState {
      const byId = new Map<string, OrganizationalEvolutionEvent>();
      for (const e of state.evolutionEvents) byId.set(e.evolutionId, e);
      for (const e of events) byId.set(e.evolutionId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_COGNITION_MAX_EVOLUTION);
      state = { ...state, evolutionEvents: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalCognitionStoreState {
      state = {
        sequences: [],
        events: [],
        snapshots: [],
        signals: [],
        chronologyFrames: [],
        evolutionEvents: [],
        signature: buildStoreSignature({ sequences: [], events: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTemporalCognitionStore>>();

export function getTemporalCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalCognitionStores(): void {
  storesByOrganization.clear();
}
