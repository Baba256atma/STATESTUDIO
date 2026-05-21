import { stableSignature } from "../intelligence/shared/dedupe";
import {
  MULTI_TIMELINE_MAX_BRANCHES,
  MULTI_TIMELINE_MAX_DIVERGENCE,
  MULTI_TIMELINE_MAX_SEQUENCES,
  MULTI_TIMELINE_MAX_SIGNALS,
  MULTI_TIMELINE_MAX_SNAPSHOTS,
  MULTI_TIMELINE_MAX_TRAJECTORIES,
} from "./multiTimelineGuards";
import type {
  AlternativeEvolutionTrajectory,
  EnterpriseDivergencePath,
  MultiTimelineSnapshot,
  MultiTimelineStoreState,
  OrganizationalTimelineBranch,
  StrategicBranchingSequence,
  TemporalDivergenceSignal,
} from "./multiTimelineTypes";

function mergeDivergencePaths(
  existing: EnterpriseDivergencePath,
  incoming: EnterpriseDivergencePath
): EnterpriseDivergencePath {
  const branchById = new Map<string, OrganizationalTimelineBranch>();
  for (const b of existing.branches) branchById.set(b.branchId, b);
  for (const b of incoming.branches) branchById.set(b.branchId, b);

  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    branches: Object.freeze(Array.from(branchById.values()).slice(0, 8)),
    confidence: Math.max(existing.confidence, incoming.confidence),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  divergencePaths: readonly EnterpriseDivergencePath[];
  branches: readonly OrganizationalTimelineBranch[];
}): string {
  return stableSignature([
    "d9-3-5-multi-timeline",
    state.divergencePaths.length,
    state.branches.length,
    state.divergencePaths.slice(0, 2).map((d) => d.divergenceId),
  ]);
}

export function createMultiTimelineStore(initial?: MultiTimelineStoreState): {
  getState(): MultiTimelineStoreState;
  upsertDivergencePaths(
    paths: EnterpriseDivergencePath[],
    now?: number
  ): MultiTimelineStoreState;
  upsertBranches(
    branches: OrganizationalTimelineBranch[],
    now?: number
  ): MultiTimelineStoreState;
  upsertSnapshots(
    snapshots: MultiTimelineSnapshot[],
    now?: number
  ): MultiTimelineStoreState;
  upsertAlternativeTrajectories(
    trajectories: AlternativeEvolutionTrajectory[],
    now?: number
  ): MultiTimelineStoreState;
  upsertBranchingSequences(
    sequences: StrategicBranchingSequence[],
    now?: number
  ): MultiTimelineStoreState;
  upsertSignals(
    signals: TemporalDivergenceSignal[],
    now?: number
  ): MultiTimelineStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): MultiTimelineStoreState;
} {
  let state: MultiTimelineStoreState = initial ?? {
    divergencePaths: [],
    branches: [],
    snapshots: [],
    alternativeTrajectories: [],
    branchingSequences: [],
    signals: [],
    signature: buildStoreSignature({ divergencePaths: [], branches: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): MultiTimelineStoreState {
      return {
        ...state,
        divergencePaths: state.divergencePaths.map((d) => ({ ...d })),
        branches: state.branches.map((b) => ({ ...b })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        alternativeTrajectories: state.alternativeTrajectories.map((t) => ({ ...t })),
        branchingSequences: state.branchingSequences.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
      };
    },

    upsertDivergencePaths(
      paths: EnterpriseDivergencePath[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, EnterpriseDivergencePath>();
      for (const p of state.divergencePaths) byId.set(p.divergenceId, p);
      for (const p of paths) {
        const existing = byId.get(p.divergenceId);
        byId.set(p.divergenceId, existing ? mergeDivergencePaths(existing, p) : { ...p });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, MULTI_TIMELINE_MAX_DIVERGENCE);
      state = {
        ...state,
        divergencePaths: Object.freeze(next),
        signature: buildStoreSignature({ divergencePaths: next, branches: state.branches }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertBranches(
      branches: OrganizationalTimelineBranch[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, OrganizationalTimelineBranch>();
      for (const b of state.branches) byId.set(b.branchId, b);
      for (const b of branches) byId.set(b.branchId, b);
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, MULTI_TIMELINE_MAX_BRANCHES);
      state = {
        ...state,
        branches: Object.freeze(next),
        signature: buildStoreSignature({ divergencePaths: state.divergencePaths, branches: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: MultiTimelineSnapshot[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, MultiTimelineSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, MULTI_TIMELINE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlternativeTrajectories(
      trajectories: AlternativeEvolutionTrajectory[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, AlternativeEvolutionTrajectory>();
      for (const t of state.alternativeTrajectories) byId.set(t.trajectoryId, t);
      for (const t of trajectories) byId.set(t.trajectoryId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, MULTI_TIMELINE_MAX_TRAJECTORIES);
      state = { ...state, alternativeTrajectories: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBranchingSequences(
      sequences: StrategicBranchingSequence[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, StrategicBranchingSequence>();
      for (const s of state.branchingSequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, MULTI_TIMELINE_MAX_SEQUENCES);
      state = { ...state, branchingSequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: TemporalDivergenceSignal[],
      now = Date.now()
    ): MultiTimelineStoreState {
      const byId = new Map<string, TemporalDivergenceSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, MULTI_TIMELINE_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): MultiTimelineStoreState {
      state = {
        divergencePaths: [],
        branches: [],
        snapshots: [],
        alternativeTrajectories: [],
        branchingSequences: [],
        signals: [],
        signature: buildStoreSignature({ divergencePaths: [], branches: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createMultiTimelineStore>>();

export function getMultiTimelineStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createMultiTimelineStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetMultiTimelineStores(): void {
  storesByOrganization.clear();
}
