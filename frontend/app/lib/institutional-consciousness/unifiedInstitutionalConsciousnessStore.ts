import { stableSignature } from "../intelligence/shared/dedupe";
import {
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_HISTORY,
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS,
  UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SUBSYSTEM_STATES,
} from "./unifiedInstitutionalConsciousnessGuards";
import type {
  CivilizationScaleEnterpriseSnapshot,
  InstitutionalConsciousnessRuntimeHistoryEntry,
  InstitutionalConsciousnessSubsystemState,
  UnifiedInstitutionalConsciousnessRuntimeStatus,
  UnifiedInstitutionalConsciousnessState,
} from "./unifiedInstitutionalConsciousnessTypes";

function buildStoreSignature(state: {
  enterpriseSnapshots: readonly CivilizationScaleEnterpriseSnapshot[];
}): string {
  return stableSignature([
    "d9-8-10-unified-institutional-consciousness",
    state.enterpriseSnapshots.length,
    state.enterpriseSnapshots.slice(0, 2).map((s) => s.signature),
  ]);
}

export function createUnifiedInstitutionalConsciousnessStore(
  initial?: UnifiedInstitutionalConsciousnessState
): {
  getState(): UnifiedInstitutionalConsciousnessState;
  upsertEnterpriseSnapshots(
    snapshots: CivilizationScaleEnterpriseSnapshot[],
    now?: number
  ): UnifiedInstitutionalConsciousnessState;
  upsertSubsystemStates(
    states: InstitutionalConsciousnessSubsystemState[],
    now?: number
  ): UnifiedInstitutionalConsciousnessState;
  upsertRuntimeHistory(
    entries: InstitutionalConsciousnessRuntimeHistoryEntry[],
    now?: number
  ): UnifiedInstitutionalConsciousnessState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: UnifiedInstitutionalConsciousnessRuntimeStatus): void;
  clear(): UnifiedInstitutionalConsciousnessState;
} {
  let state: UnifiedInstitutionalConsciousnessState = initial ?? {
    enterpriseSnapshots: [],
    subsystemStates: [],
    runtimeHistory: [],
    signature: buildStoreSignature({ enterpriseSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedInstitutionalConsciousnessState {
      return {
        ...state,
        enterpriseSnapshots: state.enterpriseSnapshots.map((s) => ({ ...s })),
        subsystemStates: state.subsystemStates.map((s) => ({ ...s })),
        runtimeHistory: state.runtimeHistory.map((e) => ({ ...e })),
      };
    },

    upsertEnterpriseSnapshots(
      snapshots: CivilizationScaleEnterpriseSnapshot[],
      now = Date.now()
    ): UnifiedInstitutionalConsciousnessState {
      const bySig = new Map<string, CivilizationScaleEnterpriseSnapshot>();
      for (const s of state.enterpriseSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS);
      state = {
        ...state,
        enterpriseSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ enterpriseSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSubsystemStates(
      states: InstitutionalConsciousnessSubsystemState[],
      now = Date.now()
    ): UnifiedInstitutionalConsciousnessState {
      const byId = new Map<string, InstitutionalConsciousnessSubsystemState>();
      for (const s of state.subsystemStates) byId.set(s.subsystemId, s);
      for (const s of states) byId.set(s.subsystemId, s);
      const next = Array.from(byId.values()).slice(
        0,
        UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SUBSYSTEM_STATES
      );
      state = { ...state, subsystemStates: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRuntimeHistory(
      entries: InstitutionalConsciousnessRuntimeHistoryEntry[],
      now = Date.now()
    ): UnifiedInstitutionalConsciousnessState {
      const byId = new Map<string, InstitutionalConsciousnessRuntimeHistoryEntry>();
      for (const e of state.runtimeHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_HISTORY);
      state = { ...state, runtimeHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: UnifiedInstitutionalConsciousnessRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedInstitutionalConsciousnessState {
      state = {
        enterpriseSnapshots: [],
        subsystemStates: [],
        runtimeHistory: [],
        signature: buildStoreSignature({ enterpriseSnapshots: [] }),
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
  ReturnType<typeof createUnifiedInstitutionalConsciousnessStore>
>();

export function getUnifiedInstitutionalConsciousnessStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedInstitutionalConsciousnessStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedInstitutionalConsciousnessStores(): void {
  storesByOrganization.clear();
}
