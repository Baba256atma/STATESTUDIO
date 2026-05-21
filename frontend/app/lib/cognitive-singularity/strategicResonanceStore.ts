import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_RESONANCE_MAX_AMPLIFICATION_INDICATORS,
  STRATEGIC_RESONANCE_MAX_FIELDS,
  STRATEGIC_RESONANCE_MAX_OBSERVATIONS,
  STRATEGIC_RESONANCE_MAX_SIGNALS,
  STRATEGIC_RESONANCE_MAX_SNAPSHOTS,
} from "./strategicResonanceGuards";
import type {
  CrossSystemResonanceSignal,
  EnterpriseStrategicResonanceSnapshot,
  HarmonicAlignmentField,
  ResonanceAmplificationIndicator,
  ResonanceState,
  StrategicReinforcementObservation,
  StrategicResonanceStoreState,
} from "./strategicResonanceTypes";

function mergeObservations(
  existing: StrategicReinforcementObservation,
  incoming: StrategicReinforcementObservation
): StrategicReinforcementObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    resonanceSignals: Object.freeze(
      Array.from(new Set([...existing.resonanceSignals, ...incoming.resonanceSignals])).slice(0, 6)
    ),
    amplificationRisks: Object.freeze(
      Array.from(new Set([...existing.amplificationRisks, ...incoming.amplificationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    resonanceState:
      incoming.confidence >= existing.confidence ? incoming.resonanceState : existing.resonanceState,
    resonanceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.resonanceStrength
        : existing.resonanceStrength,
    resonanceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.resonanceCategory
        : existing.resonanceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly StrategicReinforcementObservation[];
}): string {
  return stableSignature([
    "d9-9-8-strategic-resonance",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.resonanceId),
  ]);
}

export function createStrategicResonanceStore(initial?: StrategicResonanceStoreState): {
  getState(): StrategicResonanceStoreState;
  upsertObservations(
    observations: StrategicReinforcementObservation[],
    now?: number
  ): StrategicResonanceStoreState;
  upsertSnapshots(
    snapshots: EnterpriseStrategicResonanceSnapshot[],
    now?: number
  ): StrategicResonanceStoreState;
  upsertCrossSystemResonanceSignals(
    signals: CrossSystemResonanceSignal[],
    now?: number
  ): StrategicResonanceStoreState;
  upsertHarmonicAlignmentFields(
    fields: HarmonicAlignmentField[],
    now?: number
  ): StrategicResonanceStoreState;
  upsertAmplificationIndicators(
    indicators: ResonanceAmplificationIndicator[],
    now?: number
  ): StrategicResonanceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastResonanceState(state: ResonanceState): void;
  clear(): StrategicResonanceStoreState;
} {
  let state: StrategicResonanceStoreState = initial ?? {
    observations: [],
    snapshots: [],
    crossSystemResonanceSignals: [],
    harmonicAlignmentFields: [],
    amplificationIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastResonanceState: null,
  };

  return {
    getState(): StrategicResonanceStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        crossSystemResonanceSignals: state.crossSystemResonanceSignals.map((s) => ({ ...s })),
        harmonicAlignmentFields: state.harmonicAlignmentFields.map((f) => ({ ...f })),
        amplificationIndicators: state.amplificationIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: StrategicReinforcementObservation[],
      now = Date.now()
    ): StrategicResonanceStoreState {
      const byId = new Map<string, StrategicReinforcementObservation>();
      for (const o of state.observations) byId.set(o.resonanceId, o);
      for (const o of observations) {
        const existing = byId.get(o.resonanceId);
        byId.set(o.resonanceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_RESONANCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseStrategicResonanceSnapshot[],
      now = Date.now()
    ): StrategicResonanceStoreState {
      const bySig = new Map<string, EnterpriseStrategicResonanceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_RESONANCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCrossSystemResonanceSignals(
      signals: CrossSystemResonanceSignal[],
      now = Date.now()
    ): StrategicResonanceStoreState {
      const byId = new Map<string, CrossSystemResonanceSignal>();
      for (const s of state.crossSystemResonanceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_RESONANCE_MAX_SIGNALS);
      state = { ...state, crossSystemResonanceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertHarmonicAlignmentFields(
      fields: HarmonicAlignmentField[],
      now = Date.now()
    ): StrategicResonanceStoreState {
      const byId = new Map<string, HarmonicAlignmentField>();
      for (const f of state.harmonicAlignmentFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_RESONANCE_MAX_FIELDS);
      state = { ...state, harmonicAlignmentFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAmplificationIndicators(
      indicators: ResonanceAmplificationIndicator[],
      now = Date.now()
    ): StrategicResonanceStoreState {
      const byId = new Map<string, ResonanceAmplificationIndicator>();
      for (const i of state.amplificationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_RESONANCE_MAX_AMPLIFICATION_INDICATORS);
      state = { ...state, amplificationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastResonanceState(resonanceState: ResonanceState): void {
      state = { ...state, lastResonanceState: resonanceState };
    },

    clear(): StrategicResonanceStoreState {
      state = {
        observations: [],
        snapshots: [],
        crossSystemResonanceSignals: [],
        harmonicAlignmentFields: [],
        amplificationIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastResonanceState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicResonanceStore>>();

export function getStrategicResonanceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicResonanceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicResonanceStores(): void {
  storesByOrganization.clear();
}
