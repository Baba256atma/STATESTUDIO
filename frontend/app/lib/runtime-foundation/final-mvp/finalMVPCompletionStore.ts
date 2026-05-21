import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  FINAL_MVP_COMPLETION_MAX_BLOCKERS,
  FINAL_MVP_COMPLETION_MAX_HISTORY,
  FINAL_MVP_COMPLETION_MAX_SNAPSHOTS,
} from "./finalMVPCompletionGuards";
import type {
  FinalMVPCompletionHistoryEntry,
  FinalMVPCompletionSnapshot,
  FinalMVPCompletionStoreState,
} from "./finalMVPCompletionTypes";

function buildStoreSignature(state: {
  completionSnapshots: readonly FinalMVPCompletionSnapshot[];
}): string {
  return stableSignature([
    "d9-10-10-final-mvp-completion",
    state.completionSnapshots.length,
    state.completionSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createFinalMVPCompletionStore(initial?: FinalMVPCompletionStoreState): {
  getState(): FinalMVPCompletionStoreState;
  upsertCompletionSnapshots(
    snapshots: FinalMVPCompletionSnapshot[],
    now?: number
  ): FinalMVPCompletionStoreState;
  upsertReadinessHistory(
    entries: FinalMVPCompletionHistoryEntry[],
    now?: number
  ): FinalMVPCompletionStoreState;
  upsertBlockerHistory(blockers: string[], now?: number): FinalMVPCompletionStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastPublishReadyStatus(status: FinalMVPCompletionSnapshot["publishReadyStatus"]): void;
  clear(): FinalMVPCompletionStoreState;
} {
  let state: FinalMVPCompletionStoreState = initial ?? {
    completionSnapshots: [],
    readinessHistory: [],
    blockerHistory: [],
    signature: buildStoreSignature({ completionSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastPublishReadyStatus: null,
  };

  return {
    getState(): FinalMVPCompletionStoreState {
      return {
        ...state,
        completionSnapshots: state.completionSnapshots.map((s) => ({ ...s })),
        readinessHistory: state.readinessHistory.map((e) => ({ ...e })),
        blockerHistory: [...state.blockerHistory],
      };
    },

    upsertCompletionSnapshots(
      snapshots: FinalMVPCompletionSnapshot[],
      now = Date.now()
    ): FinalMVPCompletionStoreState {
      const bySig = new Map<string, FinalMVPCompletionSnapshot>();
      for (const s of state.completionSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_MVP_COMPLETION_MAX_SNAPSHOTS);
      state = {
        ...state,
        completionSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ completionSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertReadinessHistory(
      entries: FinalMVPCompletionHistoryEntry[],
      now = Date.now()
    ): FinalMVPCompletionStoreState {
      const byId = new Map<string, FinalMVPCompletionHistoryEntry>();
      for (const e of state.readinessHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_MVP_COMPLETION_MAX_HISTORY);
      state = { ...state, readinessHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBlockerHistory(blockers: string[], now = Date.now()): FinalMVPCompletionStoreState {
      const merged = Array.from(new Set([...state.blockerHistory, ...blockers]))
        .slice(0, FINAL_MVP_COMPLETION_MAX_BLOCKERS);
      state = { ...state, blockerHistory: Object.freeze(merged), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastPublishReadyStatus(status: FinalMVPCompletionSnapshot["publishReadyStatus"]): void {
      state = { ...state, lastPublishReadyStatus: status };
    },

    clear(): FinalMVPCompletionStoreState {
      state = {
        completionSnapshots: [],
        readinessHistory: [],
        blockerHistory: [],
        signature: buildStoreSignature({ completionSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastPublishReadyStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createFinalMVPCompletionStore>>();

export function getFinalMVPCompletionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createFinalMVPCompletionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetFinalMVPCompletionStores(): void {
  storesByOrganization.clear();
}
