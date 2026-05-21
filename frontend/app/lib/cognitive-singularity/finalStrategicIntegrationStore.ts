import { stableSignature } from "../intelligence/shared/dedupe";
import {
  FINAL_STRATEGIC_INTEGRATION_MAX_FIELDS,
  FINAL_STRATEGIC_INTEGRATION_MAX_FRAGMENTATION_INDICATORS,
  FINAL_STRATEGIC_INTEGRATION_MAX_OBSERVATIONS,
  FINAL_STRATEGIC_INTEGRATION_MAX_SIGNALS,
  FINAL_STRATEGIC_INTEGRATION_MAX_SNAPSHOTS,
} from "./finalStrategicIntegrationGuards";
import type {
  EnterpriseCognitiveIntegrationField,
  FinalStrategicIntegrationSnapshot,
  FinalStrategicIntegrationStoreState,
  IntegrationState,
  RuntimeFragmentationIndicator,
  StrategicIntegrationObservation,
  TotalRuntimeConvergenceSignal,
} from "./finalStrategicIntegrationTypes";

function mergeObservations(
  existing: StrategicIntegrationObservation,
  incoming: StrategicIntegrationObservation
): StrategicIntegrationObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    integrationSignals: Object.freeze(
      Array.from(new Set([...existing.integrationSignals, ...incoming.integrationSignals])).slice(
        0,
        6
      )
    ),
    fragmentationRisks: Object.freeze(
      Array.from(new Set([...existing.fragmentationRisks, ...incoming.fragmentationRisks])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    integrationState:
      incoming.confidence >= existing.confidence
        ? incoming.integrationState
        : existing.integrationState,
    integrationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.integrationStrength
        : existing.integrationStrength,
    integrationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.integrationCategory
        : existing.integrationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly StrategicIntegrationObservation[];
}): string {
  return stableSignature([
    "d9-9-9-final-strategic-integration",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.integrationId),
  ]);
}

export function createFinalStrategicIntegrationStore(initial?: FinalStrategicIntegrationStoreState): {
  getState(): FinalStrategicIntegrationStoreState;
  upsertObservations(
    observations: StrategicIntegrationObservation[],
    now?: number
  ): FinalStrategicIntegrationStoreState;
  upsertSnapshots(
    snapshots: FinalStrategicIntegrationSnapshot[],
    now?: number
  ): FinalStrategicIntegrationStoreState;
  upsertTotalRuntimeConvergenceSignals(
    signals: TotalRuntimeConvergenceSignal[],
    now?: number
  ): FinalStrategicIntegrationStoreState;
  upsertEnterpriseCognitiveIntegrationFields(
    fields: EnterpriseCognitiveIntegrationField[],
    now?: number
  ): FinalStrategicIntegrationStoreState;
  upsertFragmentationIndicators(
    indicators: RuntimeFragmentationIndicator[],
    now?: number
  ): FinalStrategicIntegrationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastIntegrationState(state: IntegrationState): void;
  clear(): FinalStrategicIntegrationStoreState;
} {
  let state: FinalStrategicIntegrationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    totalRuntimeConvergenceSignals: [],
    enterpriseCognitiveIntegrationFields: [],
    fragmentationIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastIntegrationState: null,
  };

  return {
    getState(): FinalStrategicIntegrationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        totalRuntimeConvergenceSignals: state.totalRuntimeConvergenceSignals.map((s) => ({ ...s })),
        enterpriseCognitiveIntegrationFields: state.enterpriseCognitiveIntegrationFields.map(
          (f) => ({ ...f })
        ),
        fragmentationIndicators: state.fragmentationIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: StrategicIntegrationObservation[],
      now = Date.now()
    ): FinalStrategicIntegrationStoreState {
      const byId = new Map<string, StrategicIntegrationObservation>();
      for (const o of state.observations) byId.set(o.integrationId, o);
      for (const o of observations) {
        const existing = byId.get(o.integrationId);
        byId.set(o.integrationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, FINAL_STRATEGIC_INTEGRATION_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: FinalStrategicIntegrationSnapshot[],
      now = Date.now()
    ): FinalStrategicIntegrationStoreState {
      const bySig = new Map<string, FinalStrategicIntegrationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_STRATEGIC_INTEGRATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTotalRuntimeConvergenceSignals(
      signals: TotalRuntimeConvergenceSignal[],
      now = Date.now()
    ): FinalStrategicIntegrationStoreState {
      const byId = new Map<string, TotalRuntimeConvergenceSignal>();
      for (const s of state.totalRuntimeConvergenceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_STRATEGIC_INTEGRATION_MAX_SIGNALS);
      state = { ...state, totalRuntimeConvergenceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEnterpriseCognitiveIntegrationFields(
      fields: EnterpriseCognitiveIntegrationField[],
      now = Date.now()
    ): FinalStrategicIntegrationStoreState {
      const byId = new Map<string, EnterpriseCognitiveIntegrationField>();
      for (const f of state.enterpriseCognitiveIntegrationFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_STRATEGIC_INTEGRATION_MAX_FIELDS);
      state = { ...state, enterpriseCognitiveIntegrationFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFragmentationIndicators(
      indicators: RuntimeFragmentationIndicator[],
      now = Date.now()
    ): FinalStrategicIntegrationStoreState {
      const byId = new Map<string, RuntimeFragmentationIndicator>();
      for (const i of state.fragmentationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_STRATEGIC_INTEGRATION_MAX_FRAGMENTATION_INDICATORS);
      state = { ...state, fragmentationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastIntegrationState(integrationState: IntegrationState): void {
      state = { ...state, lastIntegrationState: integrationState };
    },

    clear(): FinalStrategicIntegrationStoreState {
      state = {
        observations: [],
        snapshots: [],
        totalRuntimeConvergenceSignals: [],
        enterpriseCognitiveIntegrationFields: [],
        fragmentationIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastIntegrationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createFinalStrategicIntegrationStore>
>();

export function getFinalStrategicIntegrationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createFinalStrategicIntegrationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetFinalStrategicIntegrationStores(): void {
  storesByOrganization.clear();
}
