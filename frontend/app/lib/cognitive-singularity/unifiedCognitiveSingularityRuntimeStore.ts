import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_HISTORY,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SNAPSHOTS,
  UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SUBSYSTEM_STATES,
} from "./unifiedCognitiveSingularityRuntimeGuards";
import type {
  CognitiveSingularitySubsystemState,
  FinalStrategicIntelligenceSnapshot,
  UnifiedCognitiveSingularityRuntimeHistoryEntry,
  UnifiedCognitiveSingularityRuntimeState,
  UnifiedCognitiveSingularityRuntimeStatus,
} from "./unifiedCognitiveSingularityRuntimeTypes";

function buildStoreSignature(state: {
  finalSnapshots: readonly FinalStrategicIntelligenceSnapshot[];
}): string {
  return stableSignature([
    "d9-9-10-unified-cognitive-singularity-runtime",
    state.finalSnapshots.length,
    state.finalSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createUnifiedCognitiveSingularityRuntimeStore(
  initial?: UnifiedCognitiveSingularityRuntimeState
): {
  getState(): UnifiedCognitiveSingularityRuntimeState;
  upsertFinalSnapshots(
    snapshots: FinalStrategicIntelligenceSnapshot[],
    now?: number
  ): UnifiedCognitiveSingularityRuntimeState;
  upsertSubsystemStates(
    states: CognitiveSingularitySubsystemState[],
    now?: number
  ): UnifiedCognitiveSingularityRuntimeState;
  upsertRuntimeHistory(
    entries: UnifiedCognitiveSingularityRuntimeHistoryEntry[],
    now?: number
  ): UnifiedCognitiveSingularityRuntimeState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: UnifiedCognitiveSingularityRuntimeStatus): void;
  clear(): UnifiedCognitiveSingularityRuntimeState;
} {
  let state: UnifiedCognitiveSingularityRuntimeState = initial ?? {
    finalSnapshots: [],
    subsystemStates: [],
    runtimeHistory: [],
    signature: buildStoreSignature({ finalSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedCognitiveSingularityRuntimeState {
      return {
        ...state,
        finalSnapshots: state.finalSnapshots.map((s) => ({ ...s })),
        subsystemStates: state.subsystemStates.map((s) => ({ ...s })),
        runtimeHistory: state.runtimeHistory.map((e) => ({ ...e })),
      };
    },

    upsertFinalSnapshots(
      snapshots: FinalStrategicIntelligenceSnapshot[],
      now = Date.now()
    ): UnifiedCognitiveSingularityRuntimeState {
      const bySig = new Map<string, FinalStrategicIntelligenceSnapshot>();
      for (const s of state.finalSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SNAPSHOTS);
      state = {
        ...state,
        finalSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ finalSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSubsystemStates(
      states: CognitiveSingularitySubsystemState[],
      now = Date.now()
    ): UnifiedCognitiveSingularityRuntimeState {
      const byId = new Map<string, CognitiveSingularitySubsystemState>();
      for (const s of state.subsystemStates) byId.set(s.subsystemId, s);
      for (const s of states) byId.set(s.subsystemId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)
        .slice(0, UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SUBSYSTEM_STATES);
      state = { ...state, subsystemStates: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRuntimeHistory(
      entries: UnifiedCognitiveSingularityRuntimeHistoryEntry[],
      now = Date.now()
    ): UnifiedCognitiveSingularityRuntimeState {
      const byId = new Map<string, UnifiedCognitiveSingularityRuntimeHistoryEntry>();
      for (const e of state.runtimeHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_HISTORY);
      state = { ...state, runtimeHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(runtimeStatus: UnifiedCognitiveSingularityRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: runtimeStatus };
    },

    clear(): UnifiedCognitiveSingularityRuntimeState {
      state = {
        finalSnapshots: [],
        subsystemStates: [],
        runtimeHistory: [],
        signature: buildStoreSignature({ finalSnapshots: [] }),
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
  ReturnType<typeof createUnifiedCognitiveSingularityRuntimeStore>
>();

export function getUnifiedCognitiveSingularityRuntimeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedCognitiveSingularityRuntimeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedCognitiveSingularityRuntimeStores(): void {
  storesByOrganization.clear();
}
