import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_META_COGNITION_MAX_HISTORY,
  UNIFIED_META_COGNITION_MAX_REGULATION_PATTERNS,
  UNIFIED_META_COGNITION_MAX_SNAPSHOTS,
  UNIFIED_META_COGNITION_MAX_SUBSYSTEM_STATES,
  UNIFIED_META_COGNITION_MAX_SURVIVABILITY,
  UNIFIED_META_COGNITION_MAX_TRUST_OBSERVATIONS,
} from "./unifiedMetaCognitionGuards";
import type {
  CognitionGovernanceHistoryEntry,
  EnterpriseSelfReflectiveSnapshot,
  ExecutiveTrustRuntime,
  MetaCognitionSubsystemState,
  SelfRegulationPatternRecord,
  SurvivabilitySummaryRecord,
  UnifiedMetaCognitionRuntimeState,
  UnifiedRuntimeStatus,
} from "./unifiedMetaCognitionTypes";

function buildStoreSignature(state: {
  selfReflectiveSnapshots: readonly EnterpriseSelfReflectiveSnapshot[];
}): string {
  return stableSignature([
    "d9-6-10-unified-meta-cognition",
    state.selfReflectiveSnapshots.length,
    state.selfReflectiveSnapshots.slice(0, 2).map((s) => s.signature),
  ]);
}

export function createUnifiedMetaCognitionStore(initial?: UnifiedMetaCognitionRuntimeState): {
  getState(): UnifiedMetaCognitionRuntimeState;
  upsertSelfReflectiveSnapshots(
    snapshots: EnterpriseSelfReflectiveSnapshot[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  upsertSubsystemStates(
    states: MetaCognitionSubsystemState[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  upsertGovernanceHistory(
    entries: CognitionGovernanceHistoryEntry[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  upsertTrustRuntimeObservations(
    observations: ExecutiveTrustRuntime[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  upsertSurvivabilitySummaries(
    records: SurvivabilitySummaryRecord[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  upsertSelfRegulationPatterns(
    patterns: SelfRegulationPatternRecord[],
    now?: number
  ): UnifiedMetaCognitionRuntimeState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: UnifiedRuntimeStatus): void;
  clear(): UnifiedMetaCognitionRuntimeState;
} {
  let state: UnifiedMetaCognitionRuntimeState = initial ?? {
    selfReflectiveSnapshots: [],
    subsystemStates: [],
    governanceHistory: [],
    trustRuntimeObservations: [],
    survivabilitySummaries: [],
    selfRegulationPatterns: [],
    signature: buildStoreSignature({ selfReflectiveSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedMetaCognitionRuntimeState {
      return {
        ...state,
        selfReflectiveSnapshots: state.selfReflectiveSnapshots.map((s) => ({ ...s })),
        subsystemStates: state.subsystemStates.map((s) => ({ ...s })),
        governanceHistory: state.governanceHistory.map((e) => ({ ...e })),
        trustRuntimeObservations: state.trustRuntimeObservations.map((t) => ({ ...t })),
        survivabilitySummaries: state.survivabilitySummaries.map((r) => ({ ...r })),
        selfRegulationPatterns: state.selfRegulationPatterns.map((p) => ({ ...p })),
      };
    },

    upsertSelfReflectiveSnapshots(
      snapshots: EnterpriseSelfReflectiveSnapshot[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const bySig = new Map<string, EnterpriseSelfReflectiveSnapshot>();
      for (const s of state.selfReflectiveSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_SNAPSHOTS);
      state = {
        ...state,
        selfReflectiveSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ selfReflectiveSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSubsystemStates(
      states: MetaCognitionSubsystemState[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const byId = new Map<string, MetaCognitionSubsystemState>();
      for (const s of state.subsystemStates) byId.set(s.subsystemId, s);
      for (const s of states) byId.set(s.subsystemId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_SUBSYSTEM_STATES);
      state = { ...state, subsystemStates: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGovernanceHistory(
      entries: CognitionGovernanceHistoryEntry[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const byId = new Map<string, CognitionGovernanceHistoryEntry>();
      for (const e of state.governanceHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_HISTORY);
      state = { ...state, governanceHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTrustRuntimeObservations(
      observations: ExecutiveTrustRuntime[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const byId = new Map<string, ExecutiveTrustRuntime>();
      for (const t of state.trustRuntimeObservations) byId.set(t.trustRuntimeId, t);
      for (const t of observations) byId.set(t.trustRuntimeId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_TRUST_OBSERVATIONS);
      state = { ...state, trustRuntimeObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSurvivabilitySummaries(
      records: SurvivabilitySummaryRecord[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const byId = new Map<string, SurvivabilitySummaryRecord>();
      for (const r of state.survivabilitySummaries) byId.set(r.recordId, r);
      for (const r of records) byId.set(r.recordId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_SURVIVABILITY);
      state = { ...state, survivabilitySummaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSelfRegulationPatterns(
      patterns: SelfRegulationPatternRecord[],
      now = Date.now()
    ): UnifiedMetaCognitionRuntimeState {
      const byId = new Map<string, SelfRegulationPatternRecord>();
      for (const p of state.selfRegulationPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_META_COGNITION_MAX_REGULATION_PATTERNS);
      state = { ...state, selfRegulationPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(runtimeStatus: UnifiedRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: runtimeStatus };
    },

    clear(): UnifiedMetaCognitionRuntimeState {
      state = {
        selfReflectiveSnapshots: [],
        subsystemStates: [],
        governanceHistory: [],
        trustRuntimeObservations: [],
        survivabilitySummaries: [],
        selfRegulationPatterns: [],
        signature: buildStoreSignature({ selfReflectiveSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastRuntimeStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createUnifiedMetaCognitionStore>>();

export function getUnifiedMetaCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedMetaCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedMetaCognitionStores(): void {
  storesByOrganization.clear();
}
