import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_RESILIENCE_MAX_DURABILITY,
  COGNITIVE_RESILIENCE_MAX_OBSERVATIONS,
  COGNITIVE_RESILIENCE_MAX_SIGNALS,
  COGNITIVE_RESILIENCE_MAX_SNAPSHOTS,
  COGNITIVE_RESILIENCE_MAX_STRESS_FIELDS,
} from "./cognitiveResilienceGuards";
import type {
  CognitiveResilienceStoreState,
  CognitiveStressField,
  EnterpriseSurvivabilitySignal,
  ExecutiveCognitiveResilienceSnapshot,
  RuntimeResilienceObservation,
  StrategicDurabilityIndicator,
  SurvivabilityState,
} from "./cognitiveResilienceTypes";

function mergeObservations(
  existing: RuntimeResilienceObservation,
  incoming: RuntimeResilienceObservation
): RuntimeResilienceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    resilienceSignals: Object.freeze(
      Array.from(new Set([...existing.resilienceSignals, ...incoming.resilienceSignals])).slice(0, 6)
    ),
    survivabilityRisks: Object.freeze(
      Array.from(new Set([...existing.survivabilityRisks, ...incoming.survivabilityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    survivabilityState:
      incoming.confidence >= existing.confidence
        ? incoming.survivabilityState
        : existing.survivabilityState,
    resilienceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.resilienceStrength
        : existing.resilienceStrength,
    resilienceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.resilienceCategory
        : existing.resilienceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  resilienceObservations: readonly RuntimeResilienceObservation[];
}): string {
  return stableSignature([
    "d9-6-7-cognitive-resilience",
    state.resilienceObservations.length,
    state.resilienceObservations.slice(0, 3).map((o) => o.resilienceId),
  ]);
}

export function createCognitiveResilienceStore(initial?: CognitiveResilienceStoreState): {
  getState(): CognitiveResilienceStoreState;
  upsertResilienceObservations(
    observations: RuntimeResilienceObservation[],
    now?: number
  ): CognitiveResilienceStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCognitiveResilienceSnapshot[],
    now?: number
  ): CognitiveResilienceStoreState;
  upsertSurvivabilitySignals(
    signals: EnterpriseSurvivabilitySignal[],
    now?: number
  ): CognitiveResilienceStoreState;
  upsertDurabilityIndicators(
    indicators: StrategicDurabilityIndicator[],
    now?: number
  ): CognitiveResilienceStoreState;
  upsertCognitiveStressFields(
    fields: CognitiveStressField[],
    now?: number
  ): CognitiveResilienceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastSurvivabilityState(state: SurvivabilityState): void;
  clear(): CognitiveResilienceStoreState;
} {
  let state: CognitiveResilienceStoreState = initial ?? {
    resilienceObservations: [],
    snapshots: [],
    survivabilitySignals: [],
    durabilityIndicators: [],
    cognitiveStressFields: [],
    signature: buildStoreSignature({ resilienceObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastSurvivabilityState: null,
  };

  return {
    getState(): CognitiveResilienceStoreState {
      return {
        ...state,
        resilienceObservations: state.resilienceObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        survivabilitySignals: state.survivabilitySignals.map((s) => ({ ...s })),
        durabilityIndicators: state.durabilityIndicators.map((i) => ({ ...i })),
        cognitiveStressFields: state.cognitiveStressFields.map((f) => ({ ...f })),
      };
    },

    upsertResilienceObservations(
      observations: RuntimeResilienceObservation[],
      now = Date.now()
    ): CognitiveResilienceStoreState {
      const byId = new Map<string, RuntimeResilienceObservation>();
      for (const o of state.resilienceObservations) byId.set(o.resilienceId, o);
      for (const o of observations) {
        const existing = byId.get(o.resilienceId);
        byId.set(o.resilienceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_RESILIENCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        resilienceObservations: Object.freeze(next),
        signature: buildStoreSignature({ resilienceObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCognitiveResilienceSnapshot[],
      now = Date.now()
    ): CognitiveResilienceStoreState {
      const bySig = new Map<string, ExecutiveCognitiveResilienceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_RESILIENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSurvivabilitySignals(
      signals: EnterpriseSurvivabilitySignal[],
      now = Date.now()
    ): CognitiveResilienceStoreState {
      const byId = new Map<string, EnterpriseSurvivabilitySignal>();
      for (const s of state.survivabilitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_RESILIENCE_MAX_SIGNALS);
      state = { ...state, survivabilitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDurabilityIndicators(
      indicators: StrategicDurabilityIndicator[],
      now = Date.now()
    ): CognitiveResilienceStoreState {
      const byId = new Map<string, StrategicDurabilityIndicator>();
      for (const i of state.durabilityIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_RESILIENCE_MAX_DURABILITY);
      state = { ...state, durabilityIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCognitiveStressFields(
      fields: CognitiveStressField[],
      now = Date.now()
    ): CognitiveResilienceStoreState {
      const byId = new Map<string, CognitiveStressField>();
      for (const f of state.cognitiveStressFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_RESILIENCE_MAX_STRESS_FIELDS);
      state = { ...state, cognitiveStressFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastSurvivabilityState(survivabilityState: SurvivabilityState): void {
      state = { ...state, lastSurvivabilityState: survivabilityState };
    },

    clear(): CognitiveResilienceStoreState {
      state = {
        resilienceObservations: [],
        snapshots: [],
        survivabilitySignals: [],
        durabilityIndicators: [],
        cognitiveStressFields: [],
        signature: buildStoreSignature({ resilienceObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastSurvivabilityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveResilienceStore>>();

export function getCognitiveResilienceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveResilienceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveResilienceStores(): void {
  storesByOrganization.clear();
}
