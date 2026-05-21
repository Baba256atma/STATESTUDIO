import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COLLECTIVE_LEARNING_MAX_EVOLUTIONS,
  COLLECTIVE_LEARNING_MAX_FIELDS,
  COLLECTIVE_LEARNING_MAX_MATURITY,
  COLLECTIVE_LEARNING_MAX_SIGNALS,
  COLLECTIVE_LEARNING_MAX_SNAPSHOTS,
} from "./collectiveLearningGuards";
import type {
  CollectiveLearningStoreState,
  DistributedStrategicLearningSignal,
  EnterpriseIntelligenceEvolution,
  ExecutiveCollectiveLearningSnapshot,
  LearningState,
  PerspectiveLearningField,
  StrategicMaturityObservation,
} from "./collectiveLearningTypes";

function mergeEvolutions(
  existing: EnterpriseIntelligenceEvolution,
  incoming: EnterpriseIntelligenceEvolution
): EnterpriseIntelligenceEvolution {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    learningSignals: Object.freeze(
      Array.from(new Set([...existing.learningSignals, ...incoming.learningSignals])).slice(0, 6)
    ),
    maturityRisks: Object.freeze(
      Array.from(new Set([...existing.maturityRisks, ...incoming.maturityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    learningState:
      incoming.confidence >= existing.confidence ? incoming.learningState : existing.learningState,
    evolutionStrength:
      incoming.confidence >= existing.confidence
        ? incoming.evolutionStrength
        : existing.evolutionStrength,
    learningCategory:
      incoming.confidence >= existing.confidence
        ? incoming.learningCategory
        : existing.learningCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  evolutions: readonly EnterpriseIntelligenceEvolution[];
}): string {
  return stableSignature([
    "d9-7-7-collective-learning",
    state.evolutions.length,
    state.evolutions.slice(0, 3).map((e) => e.learningId),
  ]);
}

export function createCollectiveLearningStore(initial?: CollectiveLearningStoreState): {
  getState(): CollectiveLearningStoreState;
  upsertEvolutions(
    evolutions: EnterpriseIntelligenceEvolution[],
    now?: number
  ): CollectiveLearningStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCollectiveLearningSnapshot[],
    now?: number
  ): CollectiveLearningStoreState;
  upsertLearningSignals(
    signals: DistributedStrategicLearningSignal[],
    now?: number
  ): CollectiveLearningStoreState;
  upsertMaturityObservations(
    observations: StrategicMaturityObservation[],
    now?: number
  ): CollectiveLearningStoreState;
  upsertLearningFields(
    fields: PerspectiveLearningField[],
    now?: number
  ): CollectiveLearningStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastLearningState(state: LearningState): void;
  clear(): CollectiveLearningStoreState;
} {
  let state: CollectiveLearningStoreState = initial ?? {
    evolutions: [],
    snapshots: [],
    learningSignals: [],
    maturityObservations: [],
    learningFields: [],
    signature: buildStoreSignature({ evolutions: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastLearningState: null,
  };

  return {
    getState(): CollectiveLearningStoreState {
      return {
        ...state,
        evolutions: state.evolutions.map((e) => ({ ...e })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        learningSignals: state.learningSignals.map((s) => ({ ...s })),
        maturityObservations: state.maturityObservations.map((o) => ({ ...o })),
        learningFields: state.learningFields.map((f) => ({ ...f })),
      };
    },

    upsertEvolutions(
      evolutions: EnterpriseIntelligenceEvolution[],
      now = Date.now()
    ): CollectiveLearningStoreState {
      const byId = new Map<string, EnterpriseIntelligenceEvolution>();
      for (const e of state.evolutions) byId.set(e.learningId, e);
      for (const e of evolutions) {
        const existing = byId.get(e.learningId);
        byId.set(e.learningId, existing ? mergeEvolutions(existing, e) : e);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COLLECTIVE_LEARNING_MAX_EVOLUTIONS);
      state = {
        ...state,
        evolutions: Object.freeze(next),
        signature: buildStoreSignature({ evolutions: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCollectiveLearningSnapshot[],
      now = Date.now()
    ): CollectiveLearningStoreState {
      const bySig = new Map<string, ExecutiveCollectiveLearningSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COLLECTIVE_LEARNING_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLearningSignals(
      signals: DistributedStrategicLearningSignal[],
      now = Date.now()
    ): CollectiveLearningStoreState {
      const byId = new Map<string, DistributedStrategicLearningSignal>();
      for (const s of state.learningSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COLLECTIVE_LEARNING_MAX_SIGNALS);
      state = { ...state, learningSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertMaturityObservations(
      observations: StrategicMaturityObservation[],
      now = Date.now()
    ): CollectiveLearningStoreState {
      const byId = new Map<string, StrategicMaturityObservation>();
      for (const o of state.maturityObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COLLECTIVE_LEARNING_MAX_MATURITY);
      state = { ...state, maturityObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLearningFields(
      fields: PerspectiveLearningField[],
      now = Date.now()
    ): CollectiveLearningStoreState {
      const byId = new Map<string, PerspectiveLearningField>();
      for (const f of state.learningFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COLLECTIVE_LEARNING_MAX_FIELDS);
      state = { ...state, learningFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastLearningState(learningState: LearningState): void {
      state = { ...state, lastLearningState: learningState };
    },

    clear(): CollectiveLearningStoreState {
      state = {
        evolutions: [],
        snapshots: [],
        learningSignals: [],
        maturityObservations: [],
        learningFields: [],
        signature: buildStoreSignature({ evolutions: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastLearningState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCollectiveLearningStore>>();

export function getCollectiveLearningStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCollectiveLearningStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCollectiveLearningStores(): void {
  storesByOrganization.clear();
}
