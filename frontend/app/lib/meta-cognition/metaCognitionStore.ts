import { stableSignature } from "../intelligence/shared/dedupe";
import {
  META_COGNITION_MAX_HEALTH_RECORDS,
  META_COGNITION_MAX_OBSERVATIONS,
  META_COGNITION_MAX_REFLECTIONS,
  META_COGNITION_MAX_RISKS,
  META_COGNITION_MAX_SIGNALS,
  META_COGNITION_MAX_SNAPSHOTS,
} from "./metaCognitionGuards";
import type {
  CognitionQualitySignal,
  MetaCognitionStoreState,
  MetaCognitiveRisk,
  MetaCognitionRuntimeSnapshot,
  ReasoningIntegrityObservation,
  SelfReflectionSummary,
  StrategicCognitionHealth,
} from "./metaCognitionTypes";

function mergeObservations(
  existing: ReasoningIntegrityObservation,
  incoming: ReasoningIntegrityObservation
): ReasoningIntegrityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    qualitySignals: Object.freeze(
      Array.from(new Set([...existing.qualitySignals, ...incoming.qualitySignals])).slice(0, 6)
    ),
    risks: Object.freeze(
      Array.from(new Set([...existing.risks, ...incoming.risks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    cognitionHealth:
      incoming.confidence >= existing.confidence ? incoming.cognitionHealth : existing.cognitionHealth,
    integrityState:
      incoming.confidence >= existing.confidence ? incoming.integrityState : existing.integrityState,
    cognitionCategory:
      incoming.confidence >= existing.confidence
        ? incoming.cognitionCategory
        : existing.cognitionCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  integrityObservations: readonly ReasoningIntegrityObservation[];
}): string {
  return stableSignature([
    "d9-6-1-meta-cognition",
    state.integrityObservations.length,
    state.integrityObservations.slice(0, 3).map((o) => o.metaCognitionId),
  ]);
}

export function createMetaCognitionStore(initial?: MetaCognitionStoreState): {
  getState(): MetaCognitionStoreState;
  upsertIntegrityObservations(
    observations: ReasoningIntegrityObservation[],
    now?: number
  ): MetaCognitionStoreState;
  upsertSnapshots(
    snapshots: MetaCognitionRuntimeSnapshot[],
    now?: number
  ): MetaCognitionStoreState;
  upsertCognitionQualitySignals(
    signals: CognitionQualitySignal[],
    now?: number
  ): MetaCognitionStoreState;
  upsertMetaCognitiveRisks(risks: MetaCognitiveRisk[], now?: number): MetaCognitionStoreState;
  upsertStrategicCognitionHealthRecords(
    records: StrategicCognitionHealth[],
    now?: number
  ): MetaCognitionStoreState;
  upsertSelfReflectionSummaries(
    summaries: SelfReflectionSummary[],
    now?: number
  ): MetaCognitionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): MetaCognitionStoreState;
} {
  let state: MetaCognitionStoreState = initial ?? {
    integrityObservations: [],
    snapshots: [],
    cognitionQualitySignals: [],
    metaCognitiveRisks: [],
    strategicCognitionHealthRecords: [],
    selfReflectionSummaries: [],
    signature: buildStoreSignature({ integrityObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): MetaCognitionStoreState {
      return {
        ...state,
        integrityObservations: state.integrityObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        cognitionQualitySignals: state.cognitionQualitySignals.map((s) => ({ ...s })),
        metaCognitiveRisks: state.metaCognitiveRisks.map((r) => ({ ...r })),
        strategicCognitionHealthRecords: state.strategicCognitionHealthRecords.map((h) => ({ ...h })),
        selfReflectionSummaries: state.selfReflectionSummaries.map((s) => ({ ...s })),
      };
    },

    upsertIntegrityObservations(
      observations: ReasoningIntegrityObservation[],
      now = Date.now()
    ): MetaCognitionStoreState {
      const byId = new Map<string, ReasoningIntegrityObservation>();
      for (const o of state.integrityObservations) byId.set(o.metaCognitionId, o);
      for (const o of observations) {
        const existing = byId.get(o.metaCognitionId);
        byId.set(o.metaCognitionId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, META_COGNITION_MAX_OBSERVATIONS);
      state = {
        ...state,
        integrityObservations: Object.freeze(next),
        signature: buildStoreSignature({ integrityObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(snapshots: MetaCognitionRuntimeSnapshot[], now = Date.now()): MetaCognitionStoreState {
      const bySig = new Map<string, MetaCognitionRuntimeSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, META_COGNITION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCognitionQualitySignals(
      signals: CognitionQualitySignal[],
      now = Date.now()
    ): MetaCognitionStoreState {
      const byId = new Map<string, CognitionQualitySignal>();
      for (const s of state.cognitionQualitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, META_COGNITION_MAX_SIGNALS);
      state = { ...state, cognitionQualitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertMetaCognitiveRisks(risks: MetaCognitiveRisk[], now = Date.now()): MetaCognitionStoreState {
      const byId = new Map<string, MetaCognitiveRisk>();
      for (const r of state.metaCognitiveRisks) byId.set(r.riskId, r);
      for (const r of risks) byId.set(r.riskId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, META_COGNITION_MAX_RISKS);
      state = { ...state, metaCognitiveRisks: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicCognitionHealthRecords(
      records: StrategicCognitionHealth[],
      now = Date.now()
    ): MetaCognitionStoreState {
      const byId = new Map<string, StrategicCognitionHealth>();
      for (const h of state.strategicCognitionHealthRecords) byId.set(h.healthId, h);
      for (const h of records) byId.set(h.healthId, h);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, META_COGNITION_MAX_HEALTH_RECORDS);
      state = { ...state, strategicCognitionHealthRecords: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSelfReflectionSummaries(
      summaries: SelfReflectionSummary[],
      now = Date.now()
    ): MetaCognitionStoreState {
      const byId = new Map<string, SelfReflectionSummary>();
      for (const s of state.selfReflectionSummaries) byId.set(s.summaryId, s);
      for (const s of summaries) byId.set(s.summaryId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, META_COGNITION_MAX_REFLECTIONS);
      state = { ...state, selfReflectionSummaries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): MetaCognitionStoreState {
      state = {
        integrityObservations: [],
        snapshots: [],
        cognitionQualitySignals: [],
        metaCognitiveRisks: [],
        strategicCognitionHealthRecords: [],
        selfReflectionSummaries: [],
        signature: buildStoreSignature({ integrityObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createMetaCognitionStore>>();

export function getMetaCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createMetaCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetMetaCognitionStores(): void {
  storesByOrganization.clear();
}
