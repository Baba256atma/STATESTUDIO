import { stableSignature } from "../intelligence/shared/dedupe";
import {
  OPERATIONAL_RELIABILITY_MAX_HISTORY,
  OPERATIONAL_RELIABILITY_MAX_OBSERVATIONS,
  OPERATIONAL_RELIABILITY_MAX_SNAPSHOTS,
} from "./operationalReliabilityGuards";
import type {
  ExecutiveOperationalReliabilitySnapshot,
  OperationalReliabilityHistoryEntry,
  OperationalReliabilityObservation,
  OperationalReliabilityState,
  RuntimeTrustState,
} from "./operationalReliabilityTypes";

function buildStoreSignature(state: {
  reliabilitySnapshots: readonly ExecutiveOperationalReliabilitySnapshot[];
}): string {
  return stableSignature([
    "d9-10-2-operational-reliability",
    state.reliabilitySnapshots.length,
    state.reliabilitySnapshots[0]?.signature ?? "empty",
  ]);
}

export function createOperationalReliabilityStore(initial?: OperationalReliabilityState): {
  getState(): OperationalReliabilityState;
  upsertReliabilitySnapshots(
    snapshots: ExecutiveOperationalReliabilitySnapshot[],
    now?: number
  ): OperationalReliabilityState;
  upsertTrustObservations(
    observations: OperationalReliabilityObservation[],
    now?: number
  ): OperationalReliabilityState;
  upsertTrustHistory(
    entries: OperationalReliabilityHistoryEntry[],
    now?: number
  ): OperationalReliabilityState;
  setLastEvaluationSignature(signature: string): void;
  setLastTrustState(state: RuntimeTrustState): void;
  clear(): OperationalReliabilityState;
} {
  let state: OperationalReliabilityState = initial ?? {
    reliabilitySnapshots: [],
    trustObservations: [],
    trustHistory: [],
    signature: buildStoreSignature({ reliabilitySnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastTrustState: null,
  };

  return {
    getState(): OperationalReliabilityState {
      return {
        ...state,
        reliabilitySnapshots: state.reliabilitySnapshots.map((s) => ({ ...s })),
        trustObservations: state.trustObservations.map((o) => ({ ...o })),
        trustHistory: state.trustHistory.map((e) => ({ ...e })),
      };
    },

    upsertReliabilitySnapshots(
      snapshots: ExecutiveOperationalReliabilitySnapshot[],
      now = Date.now()
    ): OperationalReliabilityState {
      const bySig = new Map<string, ExecutiveOperationalReliabilitySnapshot>();
      for (const s of state.reliabilitySnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, OPERATIONAL_RELIABILITY_MAX_SNAPSHOTS);
      state = {
        ...state,
        reliabilitySnapshots: Object.freeze(next),
        signature: buildStoreSignature({ reliabilitySnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertTrustObservations(
      observations: OperationalReliabilityObservation[],
      now = Date.now()
    ): OperationalReliabilityState {
      const byId = new Map<string, OperationalReliabilityObservation>();
      for (const o of state.trustObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, OPERATIONAL_RELIABILITY_MAX_OBSERVATIONS);
      state = { ...state, trustObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTrustHistory(
      entries: OperationalReliabilityHistoryEntry[],
      now = Date.now()
    ): OperationalReliabilityState {
      const byId = new Map<string, OperationalReliabilityHistoryEntry>();
      for (const e of state.trustHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, OPERATIONAL_RELIABILITY_MAX_HISTORY);
      state = { ...state, trustHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastTrustState(trustState: RuntimeTrustState): void {
      state = { ...state, lastTrustState: trustState };
    },

    clear(): OperationalReliabilityState {
      state = {
        reliabilitySnapshots: [],
        trustObservations: [],
        trustHistory: [],
        signature: buildStoreSignature({ reliabilitySnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastTrustState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createOperationalReliabilityStore>
>();

export function getOperationalReliabilityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createOperationalReliabilityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetOperationalReliabilityStores(): void {
  storesByOrganization.clear();
}
