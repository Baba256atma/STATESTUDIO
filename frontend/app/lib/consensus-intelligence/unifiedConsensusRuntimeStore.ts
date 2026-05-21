import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_CONSENSUS_RUNTIME_MAX_HISTORY,
  UNIFIED_CONSENSUS_RUNTIME_MAX_SNAPSHOTS,
  UNIFIED_CONSENSUS_RUNTIME_MAX_SUBSYSTEM_STATES,
} from "./unifiedConsensusRuntimeGuards";
import type {
  ConsensusRuntimeHistoryEntry,
  ConsensusSubsystemState,
  DistributedExecutiveCognitionSnapshot,
  UnifiedConsensusRuntimeState,
  UnifiedConsensusRuntimeStatus,
} from "./unifiedConsensusRuntimeTypes";

function buildStoreSignature(state: {
  cognitionSnapshots: readonly DistributedExecutiveCognitionSnapshot[];
}): string {
  return stableSignature([
    "d9-7-10-unified-consensus-runtime",
    state.cognitionSnapshots.length,
    state.cognitionSnapshots.slice(0, 2).map((s) => s.signature),
  ]);
}

export function createUnifiedConsensusRuntimeStore(initial?: UnifiedConsensusRuntimeState): {
  getState(): UnifiedConsensusRuntimeState;
  upsertCognitionSnapshots(
    snapshots: DistributedExecutiveCognitionSnapshot[],
    now?: number
  ): UnifiedConsensusRuntimeState;
  upsertSubsystemStates(
    states: ConsensusSubsystemState[],
    now?: number
  ): UnifiedConsensusRuntimeState;
  upsertRuntimeHistory(
    entries: ConsensusRuntimeHistoryEntry[],
    now?: number
  ): UnifiedConsensusRuntimeState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: UnifiedConsensusRuntimeStatus): void;
  clear(): UnifiedConsensusRuntimeState;
} {
  let state: UnifiedConsensusRuntimeState = initial ?? {
    cognitionSnapshots: [],
    subsystemStates: [],
    runtimeHistory: [],
    signature: buildStoreSignature({ cognitionSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedConsensusRuntimeState {
      return {
        ...state,
        cognitionSnapshots: state.cognitionSnapshots.map((s) => ({ ...s })),
        subsystemStates: state.subsystemStates.map((s) => ({ ...s })),
        runtimeHistory: state.runtimeHistory.map((e) => ({ ...e })),
      };
    },

    upsertCognitionSnapshots(
      snapshots: DistributedExecutiveCognitionSnapshot[],
      now = Date.now()
    ): UnifiedConsensusRuntimeState {
      const bySig = new Map<string, DistributedExecutiveCognitionSnapshot>();
      for (const s of state.cognitionSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_CONSENSUS_RUNTIME_MAX_SNAPSHOTS);
      state = {
        ...state,
        cognitionSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ cognitionSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSubsystemStates(
      states: ConsensusSubsystemState[],
      now = Date.now()
    ): UnifiedConsensusRuntimeState {
      const byId = new Map<string, ConsensusSubsystemState>();
      for (const s of state.subsystemStates) byId.set(s.subsystemId, s);
      for (const s of states) byId.set(s.subsystemId, s);
      const next = Array.from(byId.values()).slice(0, UNIFIED_CONSENSUS_RUNTIME_MAX_SUBSYSTEM_STATES);
      state = { ...state, subsystemStates: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRuntimeHistory(
      entries: ConsensusRuntimeHistoryEntry[],
      now = Date.now()
    ): UnifiedConsensusRuntimeState {
      const byId = new Map<string, ConsensusRuntimeHistoryEntry>();
      for (const e of state.runtimeHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_CONSENSUS_RUNTIME_MAX_HISTORY);
      state = { ...state, runtimeHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: UnifiedConsensusRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedConsensusRuntimeState {
      state = {
        cognitionSnapshots: [],
        subsystemStates: [],
        runtimeHistory: [],
        signature: buildStoreSignature({ cognitionSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastRuntimeStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createUnifiedConsensusRuntimeStore>>();

export function getUnifiedConsensusRuntimeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedConsensusRuntimeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedConsensusRuntimeStores(): void {
  storesByOrganization.clear();
}
