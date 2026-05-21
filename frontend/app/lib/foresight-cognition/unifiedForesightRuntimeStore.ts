import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_FORESIGHT_RUNTIME_MAX_SNAPSHOTS,
  UNIFIED_FORESIGHT_RUNTIME_MAX_SUMMARIES,
} from "./unifiedForesightRuntimeGuards";
import type {
  EnterpriseAnticipatorySnapshot,
  ForesightRuntimeStatus,
  UnifiedForesightRuntimeStoreState,
} from "./unifiedForesightRuntimeTypes";

function buildStoreSignature(state: {
  snapshots: readonly EnterpriseAnticipatorySnapshot[];
  runtimeStatus: ForesightRuntimeStatus;
}): string {
  return stableSignature([
    "d9-4-10-unified-foresight",
    state.snapshots.length,
    state.runtimeStatus,
    state.snapshots[0]?.snapshotId ?? "none",
  ]);
}

export function createUnifiedForesightRuntimeStore(
  initial?: UnifiedForesightRuntimeStoreState
): {
  getState(): UnifiedForesightRuntimeStoreState;
  upsertSnapshot(
    snapshot: EnterpriseAnticipatorySnapshot,
    now?: number
  ): UnifiedForesightRuntimeStoreState;
  upsertForesightSummaries(
    summaries: { summaryId: string; headline: string; generatedAt: number }[],
    now?: number
  ): UnifiedForesightRuntimeStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: ForesightRuntimeStatus): void;
  clear(): UnifiedForesightRuntimeStoreState;
} {
  let state: UnifiedForesightRuntimeStoreState = initial ?? {
    snapshots: [],
    foresightSummaries: [],
    runtimeStatus: "initializing",
    signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedForesightRuntimeStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
        foresightSummaries: state.foresightSummaries.map((s) => ({ ...s })),
      };
    },

    upsertSnapshot(
      snapshot: EnterpriseAnticipatorySnapshot,
      now = Date.now()
    ): UnifiedForesightRuntimeStoreState {
      const byId = new Map<string, EnterpriseAnticipatorySnapshot>();
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
        .slice(0, UNIFIED_FORESIGHT_RUNTIME_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        runtimeStatus: snapshot.runtimeStatus,
        signature: buildStoreSignature({ snapshots: next, runtimeStatus: snapshot.runtimeStatus }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertForesightSummaries(
      summaries: { summaryId: string; headline: string; generatedAt: number }[],
      now = Date.now()
    ): UnifiedForesightRuntimeStoreState {
      const byId = new Map<string, { summaryId: string; headline: string; generatedAt: number }>();
      for (const s of state.foresightSummaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_FORESIGHT_RUNTIME_MAX_SUMMARIES);
      state = { ...state, foresightSummaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: ForesightRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedForesightRuntimeStoreState {
      state = {
        snapshots: [],
        foresightSummaries: [],
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
  ReturnType<typeof createUnifiedForesightRuntimeStore>
>();

export function getUnifiedForesightRuntimeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedForesightRuntimeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedForesightRuntimeStores(): void {
  storesByOrganization.clear();
}
