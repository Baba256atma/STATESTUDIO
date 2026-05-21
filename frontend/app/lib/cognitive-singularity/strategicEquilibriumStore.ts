import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_EQUILIBRIUM_MAX_FIELDS,
  STRATEGIC_EQUILIBRIUM_MAX_IMBALANCE_INDICATORS,
  STRATEGIC_EQUILIBRIUM_MAX_OBSERVATIONS,
  STRATEGIC_EQUILIBRIUM_MAX_SIGNALS,
  STRATEGIC_EQUILIBRIUM_MAX_SNAPSHOTS,
} from "./strategicEquilibriumGuards";
import type {
  CognitiveBalanceSignal,
  EnterpriseStrategicEquilibriumSnapshot,
  EquilibriumState,
  EquilibriumStabilityField,
  StrategicEquilibriumStoreState,
  StrategicImbalanceIndicator,
  TotalSystemBalanceObservation,
} from "./strategicEquilibriumTypes";

function mergeObservations(
  existing: TotalSystemBalanceObservation,
  incoming: TotalSystemBalanceObservation
): TotalSystemBalanceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    balanceSignals: Object.freeze(
      Array.from(new Set([...existing.balanceSignals, ...incoming.balanceSignals])).slice(0, 6)
    ),
    imbalanceRisks: Object.freeze(
      Array.from(new Set([...existing.imbalanceRisks, ...incoming.imbalanceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    equilibriumState:
      incoming.confidence >= existing.confidence
        ? incoming.equilibriumState
        : existing.equilibriumState,
    balanceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.balanceStrength
        : existing.balanceStrength,
    equilibriumCategory:
      incoming.confidence >= existing.confidence
        ? incoming.equilibriumCategory
        : existing.equilibriumCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly TotalSystemBalanceObservation[];
}): string {
  return stableSignature([
    "d9-9-7-strategic-equilibrium",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.equilibriumId),
  ]);
}

export function createStrategicEquilibriumStore(initial?: StrategicEquilibriumStoreState): {
  getState(): StrategicEquilibriumStoreState;
  upsertObservations(
    observations: TotalSystemBalanceObservation[],
    now?: number
  ): StrategicEquilibriumStoreState;
  upsertSnapshots(
    snapshots: EnterpriseStrategicEquilibriumSnapshot[],
    now?: number
  ): StrategicEquilibriumStoreState;
  upsertCognitiveBalanceSignals(
    signals: CognitiveBalanceSignal[],
    now?: number
  ): StrategicEquilibriumStoreState;
  upsertEquilibriumStabilityFields(
    fields: EquilibriumStabilityField[],
    now?: number
  ): StrategicEquilibriumStoreState;
  upsertImbalanceIndicators(
    indicators: StrategicImbalanceIndicator[],
    now?: number
  ): StrategicEquilibriumStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastEquilibriumState(state: EquilibriumState): void;
  clear(): StrategicEquilibriumStoreState;
} {
  let state: StrategicEquilibriumStoreState = initial ?? {
    observations: [],
    snapshots: [],
    cognitiveBalanceSignals: [],
    equilibriumStabilityFields: [],
    imbalanceIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastEquilibriumState: null,
  };

  return {
    getState(): StrategicEquilibriumStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        cognitiveBalanceSignals: state.cognitiveBalanceSignals.map((s) => ({ ...s })),
        equilibriumStabilityFields: state.equilibriumStabilityFields.map((f) => ({ ...f })),
        imbalanceIndicators: state.imbalanceIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: TotalSystemBalanceObservation[],
      now = Date.now()
    ): StrategicEquilibriumStoreState {
      const byId = new Map<string, TotalSystemBalanceObservation>();
      for (const o of state.observations) byId.set(o.equilibriumId, o);
      for (const o of observations) {
        const existing = byId.get(o.equilibriumId);
        byId.set(o.equilibriumId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_EQUILIBRIUM_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseStrategicEquilibriumSnapshot[],
      now = Date.now()
    ): StrategicEquilibriumStoreState {
      const bySig = new Map<string, EnterpriseStrategicEquilibriumSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_EQUILIBRIUM_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCognitiveBalanceSignals(
      signals: CognitiveBalanceSignal[],
      now = Date.now()
    ): StrategicEquilibriumStoreState {
      const byId = new Map<string, CognitiveBalanceSignal>();
      for (const s of state.cognitiveBalanceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_EQUILIBRIUM_MAX_SIGNALS);
      state = { ...state, cognitiveBalanceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEquilibriumStabilityFields(
      fields: EquilibriumStabilityField[],
      now = Date.now()
    ): StrategicEquilibriumStoreState {
      const byId = new Map<string, EquilibriumStabilityField>();
      for (const f of state.equilibriumStabilityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_EQUILIBRIUM_MAX_FIELDS);
      state = { ...state, equilibriumStabilityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertImbalanceIndicators(
      indicators: StrategicImbalanceIndicator[],
      now = Date.now()
    ): StrategicEquilibriumStoreState {
      const byId = new Map<string, StrategicImbalanceIndicator>();
      for (const i of state.imbalanceIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_EQUILIBRIUM_MAX_IMBALANCE_INDICATORS);
      state = { ...state, imbalanceIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastEquilibriumState(equilibriumState: EquilibriumState): void {
      state = { ...state, lastEquilibriumState: equilibriumState };
    },

    clear(): StrategicEquilibriumStoreState {
      state = {
        observations: [],
        snapshots: [],
        cognitiveBalanceSignals: [],
        equilibriumStabilityFields: [],
        imbalanceIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastEquilibriumState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicEquilibriumStore>>();

export function getStrategicEquilibriumStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicEquilibriumStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicEquilibriumStores(): void {
  storesByOrganization.clear();
}
