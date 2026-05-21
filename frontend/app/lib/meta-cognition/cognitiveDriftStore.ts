import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_DRIFT_MAX_CONSISTENCY_FIELDS,
  COGNITIVE_DRIFT_MAX_SIGNALS,
  COGNITIVE_DRIFT_MAX_SNAPSHOTS,
  COGNITIVE_DRIFT_MAX_STABILITIES,
  COGNITIVE_DRIFT_MAX_VOLATILITY,
} from "./cognitiveDriftGuards";
import type {
  CognitiveDriftStoreState,
  CognitiveVolatilityIndicator,
  EnterpriseDriftSignal,
  ExecutiveCognitiveDriftSnapshot,
  LongHorizonConsistencyField,
  StrategicReasoningStability,
  StabilityState,
} from "./cognitiveDriftTypes";

function mergeStabilities(
  existing: StrategicReasoningStability,
  incoming: StrategicReasoningStability
): StrategicReasoningStability {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    stabilitySignals: Object.freeze(
      Array.from(new Set([...existing.stabilitySignals, ...incoming.stabilitySignals])).slice(0, 6)
    ),
    driftRisks: Object.freeze(
      Array.from(new Set([...existing.driftRisks, ...incoming.driftRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    stabilityState:
      incoming.confidence >= existing.confidence ? incoming.stabilityState : existing.stabilityState,
    driftSeverity:
      incoming.confidence >= existing.confidence ? incoming.driftSeverity : existing.driftSeverity,
    driftCategory:
      incoming.confidence >= existing.confidence ? incoming.driftCategory : existing.driftCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  reasoningStabilities: readonly StrategicReasoningStability[];
}): string {
  return stableSignature([
    "d9-6-3-cognitive-drift",
    state.reasoningStabilities.length,
    state.reasoningStabilities.slice(0, 3).map((s) => s.driftId),
  ]);
}

export function createCognitiveDriftStore(initial?: CognitiveDriftStoreState): {
  getState(): CognitiveDriftStoreState;
  upsertReasoningStabilities(
    stabilities: StrategicReasoningStability[],
    now?: number
  ): CognitiveDriftStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCognitiveDriftSnapshot[],
    now?: number
  ): CognitiveDriftStoreState;
  upsertDriftSignals(signals: EnterpriseDriftSignal[], now?: number): CognitiveDriftStoreState;
  upsertVolatilityIndicators(
    indicators: CognitiveVolatilityIndicator[],
    now?: number
  ): CognitiveDriftStoreState;
  upsertLongHorizonConsistencyFields(
    fields: LongHorizonConsistencyField[],
    now?: number
  ): CognitiveDriftStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastStabilityState(state: StabilityState): void;
  clear(): CognitiveDriftStoreState;
} {
  let state: CognitiveDriftStoreState = initial ?? {
    reasoningStabilities: [],
    snapshots: [],
    driftSignals: [],
    volatilityIndicators: [],
    longHorizonConsistencyFields: [],
    signature: buildStoreSignature({ reasoningStabilities: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastStabilityState: null,
  };

  return {
    getState(): CognitiveDriftStoreState {
      return {
        ...state,
        reasoningStabilities: state.reasoningStabilities.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        driftSignals: state.driftSignals.map((s) => ({ ...s })),
        volatilityIndicators: state.volatilityIndicators.map((i) => ({ ...i })),
        longHorizonConsistencyFields: state.longHorizonConsistencyFields.map((f) => ({ ...f })),
      };
    },

    upsertReasoningStabilities(
      stabilities: StrategicReasoningStability[],
      now = Date.now()
    ): CognitiveDriftStoreState {
      const byId = new Map<string, StrategicReasoningStability>();
      for (const s of state.reasoningStabilities) byId.set(s.driftId, s);
      for (const s of stabilities) {
        const existing = byId.get(s.driftId);
        byId.set(s.driftId, existing ? mergeStabilities(existing, s) : s);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_DRIFT_MAX_STABILITIES);
      state = {
        ...state,
        reasoningStabilities: Object.freeze(next),
        signature: buildStoreSignature({ reasoningStabilities: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCognitiveDriftSnapshot[],
      now = Date.now()
    ): CognitiveDriftStoreState {
      const bySig = new Map<string, ExecutiveCognitiveDriftSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_DRIFT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDriftSignals(signals: EnterpriseDriftSignal[], now = Date.now()): CognitiveDriftStoreState {
      const byId = new Map<string, EnterpriseDriftSignal>();
      for (const s of state.driftSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_DRIFT_MAX_SIGNALS);
      state = { ...state, driftSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertVolatilityIndicators(
      indicators: CognitiveVolatilityIndicator[],
      now = Date.now()
    ): CognitiveDriftStoreState {
      const byId = new Map<string, CognitiveVolatilityIndicator>();
      for (const i of state.volatilityIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_DRIFT_MAX_VOLATILITY);
      state = { ...state, volatilityIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLongHorizonConsistencyFields(
      fields: LongHorizonConsistencyField[],
      now = Date.now()
    ): CognitiveDriftStoreState {
      const byId = new Map<string, LongHorizonConsistencyField>();
      for (const f of state.longHorizonConsistencyFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_DRIFT_MAX_CONSISTENCY_FIELDS);
      state = { ...state, longHorizonConsistencyFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastStabilityState(stabilityState: StabilityState): void {
      state = { ...state, lastStabilityState: stabilityState };
    },

    clear(): CognitiveDriftStoreState {
      state = {
        reasoningStabilities: [],
        snapshots: [],
        driftSignals: [],
        volatilityIndicators: [],
        longHorizonConsistencyFields: [],
        signature: buildStoreSignature({ reasoningStabilities: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastStabilityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveDriftStore>>();

export function getCognitiveDriftStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveDriftStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveDriftStores(): void {
  storesByOrganization.clear();
}
