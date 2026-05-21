import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_DECISION_RUNTIME_MAX_ACTION_HISTORY,
  UNIFIED_DECISION_RUNTIME_MAX_SNAPSHOTS,
  UNIFIED_DECISION_RUNTIME_MAX_SUBSYSTEM_RECORDS,
  UNIFIED_DECISION_RUNTIME_MAX_SUMMARIES,
} from "./unifiedDecisionRuntimeGuards";
import type {
  DecisionRuntimeStatus,
  DecisionSubsystemId,
  EnterpriseStrategicActionSnapshot,
  UnifiedDecisionRuntimeStoreState,
} from "./unifiedDecisionRuntimeTypes";

function buildStoreSignature(state: {
  snapshots: readonly EnterpriseStrategicActionSnapshot[];
  runtimeStatus: DecisionRuntimeStatus;
}): string {
  return stableSignature([
    "d9-5-10-unified-decision-runtime",
    state.snapshots.length,
    state.runtimeStatus,
    state.snapshots[0]?.snapshotId ?? "none",
  ]);
}

export function createUnifiedDecisionRuntimeStore(
  initial?: UnifiedDecisionRuntimeStoreState
): {
  getState(): UnifiedDecisionRuntimeStoreState;
  upsertSnapshot(
    snapshot: EnterpriseStrategicActionSnapshot,
    now?: number
  ): UnifiedDecisionRuntimeStoreState;
  upsertOrchestrationSummaries(
    summaries: { summaryId: string; headline: string; generatedAt: number }[],
    now?: number
  ): UnifiedDecisionRuntimeStoreState;
  upsertStrategicActionHistory(
    actions: { actionId: string; headline: string; generatedAt: number }[],
    now?: number
  ): UnifiedDecisionRuntimeStoreState;
  upsertSubsystemHealthRecords(
    records: {
      recordId: string;
      subsystemId: DecisionSubsystemId;
      healthy: boolean;
      generatedAt: number;
    }[],
    now?: number
  ): UnifiedDecisionRuntimeStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: DecisionRuntimeStatus): void;
  clear(): UnifiedDecisionRuntimeStoreState;
} {
  let state: UnifiedDecisionRuntimeStoreState = initial ?? {
    snapshots: [],
    orchestrationSummaries: [],
    strategicActionHistory: [],
    subsystemHealthRecords: [],
    runtimeStatus: "initializing",
    signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedDecisionRuntimeStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
        orchestrationSummaries: state.orchestrationSummaries.map((s) => ({ ...s })),
        strategicActionHistory: state.strategicActionHistory.map((a) => ({ ...a })),
        subsystemHealthRecords: state.subsystemHealthRecords.map((r) => ({ ...r })),
      };
    },

    upsertSnapshot(
      snapshot: EnterpriseStrategicActionSnapshot,
      now = Date.now()
    ): UnifiedDecisionRuntimeStoreState {
      const byId = new Map<string, EnterpriseStrategicActionSnapshot>();
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
        .slice(0, UNIFIED_DECISION_RUNTIME_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        runtimeStatus: snapshot.runtimeStatus,
        signature: buildStoreSignature({ snapshots: next, runtimeStatus: snapshot.runtimeStatus }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertOrchestrationSummaries(
      summaries: { summaryId: string; headline: string; generatedAt: number }[],
      now = Date.now()
    ): UnifiedDecisionRuntimeStoreState {
      const byId = new Map<string, { summaryId: string; headline: string; generatedAt: number }>();
      for (const s of state.orchestrationSummaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_DECISION_RUNTIME_MAX_SUMMARIES);
      state = { ...state, orchestrationSummaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicActionHistory(
      actions: { actionId: string; headline: string; generatedAt: number }[],
      now = Date.now()
    ): UnifiedDecisionRuntimeStoreState {
      const byId = new Map<string, { actionId: string; headline: string; generatedAt: number }>();
      for (const a of state.strategicActionHistory) byId.set(a.actionId, a);
      for (const a of actions) byId.set(a.actionId, a);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_DECISION_RUNTIME_MAX_ACTION_HISTORY);
      state = { ...state, strategicActionHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSubsystemHealthRecords(
      records: {
        recordId: string;
        subsystemId: DecisionSubsystemId;
        healthy: boolean;
        generatedAt: number;
      }[],
      now = Date.now()
    ): UnifiedDecisionRuntimeStoreState {
      const byId = new Map<
        string,
        {
          recordId: string;
          subsystemId: DecisionSubsystemId;
          healthy: boolean;
          generatedAt: number;
        }
      >();
      for (const r of state.subsystemHealthRecords) byId.set(r.recordId, r);
      for (const r of records) byId.set(r.recordId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_DECISION_RUNTIME_MAX_SUBSYSTEM_RECORDS);
      state = { ...state, subsystemHealthRecords: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: DecisionRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedDecisionRuntimeStoreState {
      state = {
        snapshots: [],
        orchestrationSummaries: [],
        strategicActionHistory: [],
        subsystemHealthRecords: [],
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

const storesByOrganization = new Map<string, ReturnType<typeof createUnifiedDecisionRuntimeStore>>();

export function getUnifiedDecisionRuntimeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedDecisionRuntimeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedDecisionRuntimeStores(): void {
  storesByOrganization.clear();
}
