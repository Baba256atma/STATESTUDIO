import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_COHERENCE_MAX_FIELDS,
  STRATEGIC_COHERENCE_MAX_MISALIGNMENT_INDICATORS,
  STRATEGIC_COHERENCE_MAX_OBSERVATIONS,
  STRATEGIC_COHERENCE_MAX_SIGNALS,
  STRATEGIC_COHERENCE_MAX_SNAPSHOTS,
} from "./strategicCoherenceGuards";
import type {
  CoherenceState,
  CrossRuntimeMisalignmentIndicator,
  EnterpriseCoherenceField,
  StrategicCoherenceObservation,
  StrategicCoherenceStoreState,
  TotalSystemAlignmentSignal,
  UnifiedStrategicCoherenceSnapshot,
} from "./strategicCoherenceTypes";

function mergeObservations(
  existing: StrategicCoherenceObservation,
  incoming: StrategicCoherenceObservation
): StrategicCoherenceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    coherenceSignals: Object.freeze(
      Array.from(new Set([...existing.coherenceSignals, ...incoming.coherenceSignals])).slice(0, 6)
    ),
    misalignmentRisks: Object.freeze(
      Array.from(new Set([...existing.misalignmentRisks, ...incoming.misalignmentRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    coherenceState:
      incoming.confidence >= existing.confidence ? incoming.coherenceState : existing.coherenceState,
    coherenceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.coherenceStrength
        : existing.coherenceStrength,
    coherenceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.coherenceCategory
        : existing.coherenceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly StrategicCoherenceObservation[];
}): string {
  return stableSignature([
    "d9-9-6-strategic-coherence",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.coherenceId),
  ]);
}

export function createStrategicCoherenceStore(initial?: StrategicCoherenceStoreState): {
  getState(): StrategicCoherenceStoreState;
  upsertObservations(
    observations: StrategicCoherenceObservation[],
    now?: number
  ): StrategicCoherenceStoreState;
  upsertSnapshots(
    snapshots: UnifiedStrategicCoherenceSnapshot[],
    now?: number
  ): StrategicCoherenceStoreState;
  upsertTotalSystemAlignmentSignals(
    signals: TotalSystemAlignmentSignal[],
    now?: number
  ): StrategicCoherenceStoreState;
  upsertEnterpriseCoherenceFields(
    fields: EnterpriseCoherenceField[],
    now?: number
  ): StrategicCoherenceStoreState;
  upsertMisalignmentIndicators(
    indicators: CrossRuntimeMisalignmentIndicator[],
    now?: number
  ): StrategicCoherenceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCoherenceState(state: CoherenceState): void;
  clear(): StrategicCoherenceStoreState;
} {
  let state: StrategicCoherenceStoreState = initial ?? {
    observations: [],
    snapshots: [],
    totalSystemAlignmentSignals: [],
    enterpriseCoherenceFields: [],
    misalignmentIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCoherenceState: null,
  };

  return {
    getState(): StrategicCoherenceStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        totalSystemAlignmentSignals: state.totalSystemAlignmentSignals.map((s) => ({ ...s })),
        enterpriseCoherenceFields: state.enterpriseCoherenceFields.map((f) => ({ ...f })),
        misalignmentIndicators: state.misalignmentIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: StrategicCoherenceObservation[],
      now = Date.now()
    ): StrategicCoherenceStoreState {
      const byId = new Map<string, StrategicCoherenceObservation>();
      for (const o of state.observations) byId.set(o.coherenceId, o);
      for (const o of observations) {
        const existing = byId.get(o.coherenceId);
        byId.set(o.coherenceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_COHERENCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: UnifiedStrategicCoherenceSnapshot[],
      now = Date.now()
    ): StrategicCoherenceStoreState {
      const bySig = new Map<string, UnifiedStrategicCoherenceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_COHERENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTotalSystemAlignmentSignals(
      signals: TotalSystemAlignmentSignal[],
      now = Date.now()
    ): StrategicCoherenceStoreState {
      const byId = new Map<string, TotalSystemAlignmentSignal>();
      for (const s of state.totalSystemAlignmentSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_COHERENCE_MAX_SIGNALS);
      state = { ...state, totalSystemAlignmentSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEnterpriseCoherenceFields(
      fields: EnterpriseCoherenceField[],
      now = Date.now()
    ): StrategicCoherenceStoreState {
      const byId = new Map<string, EnterpriseCoherenceField>();
      for (const f of state.enterpriseCoherenceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_COHERENCE_MAX_FIELDS);
      state = { ...state, enterpriseCoherenceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertMisalignmentIndicators(
      indicators: CrossRuntimeMisalignmentIndicator[],
      now = Date.now()
    ): StrategicCoherenceStoreState {
      const byId = new Map<string, CrossRuntimeMisalignmentIndicator>();
      for (const i of state.misalignmentIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_COHERENCE_MAX_MISALIGNMENT_INDICATORS);
      state = { ...state, misalignmentIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCoherenceState(coherenceState: CoherenceState): void {
      state = { ...state, lastCoherenceState: coherenceState };
    },

    clear(): StrategicCoherenceStoreState {
      state = {
        observations: [],
        snapshots: [],
        totalSystemAlignmentSignals: [],
        enterpriseCoherenceFields: [],
        misalignmentIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCoherenceState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicCoherenceStore>>();

export function getStrategicCoherenceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicCoherenceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicCoherenceStores(): void {
  storesByOrganization.clear();
}
