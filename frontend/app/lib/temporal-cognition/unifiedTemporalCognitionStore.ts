import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_TEMPORAL_COGNITION_MAX_EVOLUTION_SUMMARIES,
  UNIFIED_TEMPORAL_COGNITION_MAX_SNAPSHOTS,
} from "./unifiedTemporalCognitionGuards";
import type {
  EnterpriseTimeIntelligenceSnapshot,
  TemporalRuntimeStatus,
  UnifiedTemporalCognitionStoreState,
} from "./unifiedTemporalCognitionTypes";

function buildStoreSignature(state: {
  snapshots: readonly EnterpriseTimeIntelligenceSnapshot[];
  runtimeStatus: TemporalRuntimeStatus;
}): string {
  return stableSignature([
    "d9-3-10-unified-temporal",
    state.snapshots.length,
    state.runtimeStatus,
    state.snapshots[0]?.snapshotId ?? "none",
  ]);
}

export function createUnifiedTemporalCognitionStore(
  initial?: UnifiedTemporalCognitionStoreState
): {
  getState(): UnifiedTemporalCognitionStoreState;
  upsertSnapshot(
    snapshot: EnterpriseTimeIntelligenceSnapshot,
    now?: number
  ): UnifiedTemporalCognitionStoreState;
  upsertEvolutionSummaries(
    summaries: { summaryId: string; headline: string; generatedAt: number }[],
    now?: number
  ): UnifiedTemporalCognitionStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: TemporalRuntimeStatus): void;
  clear(): UnifiedTemporalCognitionStoreState;
} {
  let state: UnifiedTemporalCognitionStoreState = initial ?? {
    snapshots: [],
    evolutionSummaries: [],
    runtimeStatus: "initializing",
    signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedTemporalCognitionStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
        evolutionSummaries: state.evolutionSummaries.map((s) => ({ ...s })),
      };
    },

    upsertSnapshot(
      snapshot: EnterpriseTimeIntelligenceSnapshot,
      now = Date.now()
    ): UnifiedTemporalCognitionStoreState {
      const byId = new Map<string, EnterpriseTimeIntelligenceSnapshot>();
      for (const s of state.snapshots) byId.set(s.snapshotId, s);
      const existing = byId.get(snapshot.snapshotId);
      byId.set(
        snapshot.snapshotId,
        existing
          ? {
              ...existing,
              ...snapshot,
              generatedAt: Math.max(existing.generatedAt, snapshot.generatedAt),
            }
          : { ...snapshot }
      );
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_TEMPORAL_COGNITION_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        runtimeStatus: snapshot.runtimeStatus,
        signature: buildStoreSignature({ snapshots: next, runtimeStatus: snapshot.runtimeStatus }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertEvolutionSummaries(
      summaries: { summaryId: string; headline: string; generatedAt: number }[],
      now = Date.now()
    ): UnifiedTemporalCognitionStoreState {
      const byId = new Map<string, { summaryId: string; headline: string; generatedAt: number }>();
      for (const s of state.evolutionSummaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_TEMPORAL_COGNITION_MAX_EVOLUTION_SUMMARIES);
      state = { ...state, evolutionSummaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: TemporalRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedTemporalCognitionStoreState {
      state = {
        snapshots: [],
        evolutionSummaries: [],
        runtimeStatus: "initializing",
        signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastRuntimeStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createUnifiedTemporalCognitionStore>
>();

export function getUnifiedTemporalCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedTemporalCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedTemporalCognitionStores(): void {
  storesByOrganization.clear();
}
