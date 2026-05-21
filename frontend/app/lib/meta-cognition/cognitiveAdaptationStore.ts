import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_ADAPTATION_MAX_BALANCE_FIELDS,
  COGNITIVE_ADAPTATION_MAX_INDICATORS,
  COGNITIVE_ADAPTATION_MAX_OBSERVATIONS,
  COGNITIVE_ADAPTATION_MAX_SIGNALS,
  COGNITIVE_ADAPTATION_MAX_SNAPSHOTS,
} from "./cognitiveAdaptationGuards";
import type {
  AdaptiveReasoningObservation,
  CognitiveAdaptationStoreState,
  EnterpriseSelfStabilizationSignal,
  ExecutiveCognitiveAdaptationSnapshot,
  RuntimeBalanceField,
  StabilizationState,
  StrategicAdaptationIndicator,
} from "./cognitiveAdaptationTypes";

function mergeObservations(
  existing: AdaptiveReasoningObservation,
  incoming: AdaptiveReasoningObservation
): AdaptiveReasoningObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    adaptationSignals: Object.freeze(
      Array.from(new Set([...existing.adaptationSignals, ...incoming.adaptationSignals])).slice(0, 6)
    ),
    stabilizationRisks: Object.freeze(
      Array.from(new Set([...existing.stabilizationRisks, ...incoming.stabilizationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    stabilizationState:
      incoming.confidence >= existing.confidence
        ? incoming.stabilizationState
        : existing.stabilizationState,
    adaptationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationStrength
        : existing.adaptationStrength,
    adaptationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationCategory
        : existing.adaptationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  adaptiveObservations: readonly AdaptiveReasoningObservation[];
}): string {
  return stableSignature([
    "d9-6-8-cognitive-adaptation",
    state.adaptiveObservations.length,
    state.adaptiveObservations.slice(0, 3).map((o) => o.adaptationId),
  ]);
}

export function createCognitiveAdaptationStore(initial?: CognitiveAdaptationStoreState): {
  getState(): CognitiveAdaptationStoreState;
  upsertAdaptiveObservations(
    observations: AdaptiveReasoningObservation[],
    now?: number
  ): CognitiveAdaptationStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCognitiveAdaptationSnapshot[],
    now?: number
  ): CognitiveAdaptationStoreState;
  upsertSelfStabilizationSignals(
    signals: EnterpriseSelfStabilizationSignal[],
    now?: number
  ): CognitiveAdaptationStoreState;
  upsertAdaptationIndicators(
    indicators: StrategicAdaptationIndicator[],
    now?: number
  ): CognitiveAdaptationStoreState;
  upsertRuntimeBalanceFields(
    fields: RuntimeBalanceField[],
    now?: number
  ): CognitiveAdaptationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastStabilizationState(state: StabilizationState): void;
  clear(): CognitiveAdaptationStoreState;
} {
  let state: CognitiveAdaptationStoreState = initial ?? {
    adaptiveObservations: [],
    snapshots: [],
    selfStabilizationSignals: [],
    adaptationIndicators: [],
    runtimeBalanceFields: [],
    signature: buildStoreSignature({ adaptiveObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastStabilizationState: null,
  };

  return {
    getState(): CognitiveAdaptationStoreState {
      return {
        ...state,
        adaptiveObservations: state.adaptiveObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        selfStabilizationSignals: state.selfStabilizationSignals.map((s) => ({ ...s })),
        adaptationIndicators: state.adaptationIndicators.map((i) => ({ ...i })),
        runtimeBalanceFields: state.runtimeBalanceFields.map((f) => ({ ...f })),
      };
    },

    upsertAdaptiveObservations(
      observations: AdaptiveReasoningObservation[],
      now = Date.now()
    ): CognitiveAdaptationStoreState {
      const byId = new Map<string, AdaptiveReasoningObservation>();
      for (const o of state.adaptiveObservations) byId.set(o.adaptationId, o);
      for (const o of observations) {
        const existing = byId.get(o.adaptationId);
        byId.set(o.adaptationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_ADAPTATION_MAX_OBSERVATIONS);
      state = {
        ...state,
        adaptiveObservations: Object.freeze(next),
        signature: buildStoreSignature({ adaptiveObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCognitiveAdaptationSnapshot[],
      now = Date.now()
    ): CognitiveAdaptationStoreState {
      const bySig = new Map<string, ExecutiveCognitiveAdaptationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_ADAPTATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSelfStabilizationSignals(
      signals: EnterpriseSelfStabilizationSignal[],
      now = Date.now()
    ): CognitiveAdaptationStoreState {
      const byId = new Map<string, EnterpriseSelfStabilizationSignal>();
      for (const s of state.selfStabilizationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_ADAPTATION_MAX_SIGNALS);
      state = { ...state, selfStabilizationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptationIndicators(
      indicators: StrategicAdaptationIndicator[],
      now = Date.now()
    ): CognitiveAdaptationStoreState {
      const byId = new Map<string, StrategicAdaptationIndicator>();
      for (const i of state.adaptationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_ADAPTATION_MAX_INDICATORS);
      state = { ...state, adaptationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRuntimeBalanceFields(
      fields: RuntimeBalanceField[],
      now = Date.now()
    ): CognitiveAdaptationStoreState {
      const byId = new Map<string, RuntimeBalanceField>();
      for (const f of state.runtimeBalanceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_ADAPTATION_MAX_BALANCE_FIELDS);
      state = { ...state, runtimeBalanceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastStabilizationState(stabilizationState: StabilizationState): void {
      state = { ...state, lastStabilizationState: stabilizationState };
    },

    clear(): CognitiveAdaptationStoreState {
      state = {
        adaptiveObservations: [],
        snapshots: [],
        selfStabilizationSignals: [],
        adaptationIndicators: [],
        runtimeBalanceFields: [],
        signature: buildStoreSignature({ adaptiveObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastStabilizationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveAdaptationStore>>();

export function getCognitiveAdaptationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveAdaptationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveAdaptationStores(): void {
  storesByOrganization.clear();
}
