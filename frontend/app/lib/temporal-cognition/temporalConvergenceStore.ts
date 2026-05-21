import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_CONVERGENCE_MAX_PATTERNS,
  TEMPORAL_CONVERGENCE_MAX_SEQUENCES,
  TEMPORAL_CONVERGENCE_MAX_SIGNALS,
  TEMPORAL_CONVERGENCE_MAX_SNAPSHOTS,
  TEMPORAL_CONVERGENCE_MAX_TRAJECTORIES,
} from "./temporalConvergenceGuards";
import type {
  EnterpriseConvergenceSignal,
  OperationalSynchronizationSequence,
  OrganizationalAlignmentTrajectory,
  StabilityConvergencePattern,
  StrategicAlignmentSnapshot,
  TemporalConvergenceStoreState,
} from "./temporalConvergenceTypes";

function mergePatterns(
  existing: StabilityConvergencePattern,
  incoming: StabilityConvergencePattern
): StabilityConvergencePattern {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    convergenceSignals: Object.freeze(
      Array.from(new Set([...existing.convergenceSignals, ...incoming.convergenceSignals])).slice(
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
  patterns: readonly StabilityConvergencePattern[];
}): string {
  return stableSignature([
    "d9-3-6-temporal-convergence",
    state.patterns.length,
    state.patterns.slice(0, 3).map((p) => p.convergenceId),
  ]);
}

export function createTemporalConvergenceStore(initial?: TemporalConvergenceStoreState): {
  getState(): TemporalConvergenceStoreState;
  upsertPatterns(
    patterns: StabilityConvergencePattern[],
    now?: number
  ): TemporalConvergenceStoreState;
  upsertSnapshots(
    snapshots: StrategicAlignmentSnapshot[],
    now?: number
  ): TemporalConvergenceStoreState;
  upsertSignals(
    signals: EnterpriseConvergenceSignal[],
    now?: number
  ): TemporalConvergenceStoreState;
  upsertTrajectories(
    trajectories: OrganizationalAlignmentTrajectory[],
    now?: number
  ): TemporalConvergenceStoreState;
  upsertSequences(
    sequences: OperationalSynchronizationSequence[],
    now?: number
  ): TemporalConvergenceStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalConvergenceStoreState;
} {
  let state: TemporalConvergenceStoreState = initial ?? {
    patterns: [],
    snapshots: [],
    signals: [],
    trajectories: [],
    sequences: [],
    signature: buildStoreSignature({ patterns: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalConvergenceStoreState {
      return {
        ...state,
        patterns: state.patterns.map((p) => ({ ...p })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
        trajectories: state.trajectories.map((t) => ({ ...t })),
        sequences: state.sequences.map((s) => ({ ...s })),
      };
    },

    upsertPatterns(
      patterns: StabilityConvergencePattern[],
      now = Date.now()
    ): TemporalConvergenceStoreState {
      const byId = new Map<string, StabilityConvergencePattern>();
      for (const p of state.patterns) byId.set(p.convergenceId, p);
      for (const p of patterns) {
        const existing = byId.get(p.convergenceId);
        byId.set(p.convergenceId, existing ? mergePatterns(existing, p) : { ...p });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_CONVERGENCE_MAX_PATTERNS);
      state = {
        ...state,
        patterns: Object.freeze(next),
        signature: buildStoreSignature({ patterns: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicAlignmentSnapshot[],
      now = Date.now()
    ): TemporalConvergenceStoreState {
      const byId = new Map<string, StrategicAlignmentSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_CONVERGENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: EnterpriseConvergenceSignal[],
      now = Date.now()
    ): TemporalConvergenceStoreState {
      const byId = new Map<string, EnterpriseConvergenceSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_CONVERGENCE_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTrajectories(
      trajectories: OrganizationalAlignmentTrajectory[],
      now = Date.now()
    ): TemporalConvergenceStoreState {
      const byId = new Map<string, OrganizationalAlignmentTrajectory>();
      for (const t of state.trajectories) byId.set(t.trajectoryId, t);
      for (const t of trajectories) byId.set(t.trajectoryId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_CONVERGENCE_MAX_TRAJECTORIES);
      state = { ...state, trajectories: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSequences(
      sequences: OperationalSynchronizationSequence[],
      now = Date.now()
    ): TemporalConvergenceStoreState {
      const byId = new Map<string, OperationalSynchronizationSequence>();
      for (const s of state.sequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_CONVERGENCE_MAX_SEQUENCES);
      state = { ...state, sequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalConvergenceStoreState {
      state = {
        patterns: [],
        snapshots: [],
        signals: [],
        trajectories: [],
        sequences: [],
        signature: buildStoreSignature({ patterns: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTemporalConvergenceStore>>();

export function getTemporalConvergenceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalConvergenceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalConvergenceStores(): void {
  storesByOrganization.clear();
}
