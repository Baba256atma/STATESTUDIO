import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ENTERPRISE_RUNTIME_FOUNDATION_MAX_HISTORY,
  ENTERPRISE_RUNTIME_FOUNDATION_MAX_OBSERVATIONS,
  ENTERPRISE_RUNTIME_FOUNDATION_MAX_SNAPSHOTS,
} from "./enterpriseRuntimeFoundationGuards";
import type {
  EnterpriseRuntimeFoundationHistoryEntry,
  EnterpriseRuntimeFoundationState,
  EnterpriseRuntimeFoundationStatus,
  MVPStrategicReadinessSnapshot,
  RuntimeReliabilityObservation,
} from "./enterpriseRuntimeFoundationTypes";

function buildStoreSignature(state: {
  readinessSnapshots: readonly MVPStrategicReadinessSnapshot[];
}): string {
  return stableSignature([
    "d9-10-1-enterprise-runtime-foundation",
    state.readinessSnapshots.length,
    state.readinessSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createEnterpriseRuntimeFoundationStore(
  initial?: EnterpriseRuntimeFoundationState
): {
  getState(): EnterpriseRuntimeFoundationState;
  upsertReadinessSnapshots(
    snapshots: MVPStrategicReadinessSnapshot[],
    now?: number
  ): EnterpriseRuntimeFoundationState;
  upsertReliabilityObservations(
    observations: RuntimeReliabilityObservation[],
    now?: number
  ): EnterpriseRuntimeFoundationState;
  upsertFoundationHistory(
    entries: EnterpriseRuntimeFoundationHistoryEntry[],
    now?: number
  ): EnterpriseRuntimeFoundationState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: EnterpriseRuntimeFoundationStatus): void;
  clear(): EnterpriseRuntimeFoundationState;
} {
  let state: EnterpriseRuntimeFoundationState = initial ?? {
    readinessSnapshots: [],
    reliabilityObservations: [],
    foundationHistory: [],
    signature: buildStoreSignature({ readinessSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): EnterpriseRuntimeFoundationState {
      return {
        ...state,
        readinessSnapshots: state.readinessSnapshots.map((s) => ({ ...s })),
        reliabilityObservations: state.reliabilityObservations.map((o) => ({ ...o })),
        foundationHistory: state.foundationHistory.map((e) => ({ ...e })),
      };
    },

    upsertReadinessSnapshots(
      snapshots: MVPStrategicReadinessSnapshot[],
      now = Date.now()
    ): EnterpriseRuntimeFoundationState {
      const bySig = new Map<string, MVPStrategicReadinessSnapshot>();
      for (const s of state.readinessSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ENTERPRISE_RUNTIME_FOUNDATION_MAX_SNAPSHOTS);
      state = {
        ...state,
        readinessSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ readinessSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertReliabilityObservations(
      observations: RuntimeReliabilityObservation[],
      now = Date.now()
    ): EnterpriseRuntimeFoundationState {
      const byId = new Map<string, RuntimeReliabilityObservation>();
      for (const o of state.reliabilityObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ENTERPRISE_RUNTIME_FOUNDATION_MAX_OBSERVATIONS);
      state = { ...state, reliabilityObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFoundationHistory(
      entries: EnterpriseRuntimeFoundationHistoryEntry[],
      now = Date.now()
    ): EnterpriseRuntimeFoundationState {
      const byId = new Map<string, EnterpriseRuntimeFoundationHistoryEntry>();
      for (const e of state.foundationHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ENTERPRISE_RUNTIME_FOUNDATION_MAX_HISTORY);
      state = { ...state, foundationHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(runtimeStatus: EnterpriseRuntimeFoundationStatus): void {
      state = { ...state, lastRuntimeStatus: runtimeStatus };
    },

    clear(): EnterpriseRuntimeFoundationState {
      state = {
        readinessSnapshots: [],
        reliabilityObservations: [],
        foundationHistory: [],
        signature: buildStoreSignature({ readinessSnapshots: [] }),
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
  ReturnType<typeof createEnterpriseRuntimeFoundationStore>
>();

export function getEnterpriseRuntimeFoundationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createEnterpriseRuntimeFoundationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetEnterpriseRuntimeFoundationStores(): void {
  storesByOrganization.clear();
}
