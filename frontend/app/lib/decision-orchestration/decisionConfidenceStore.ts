import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DECISION_CONFIDENCE_MAX_AMBIGUITY_INDICATORS,
  DECISION_CONFIDENCE_MAX_CERTAINTY_SIGNALS,
  DECISION_CONFIDENCE_MAX_CONFIDENCES,
  DECISION_CONFIDENCE_MAX_SNAPSHOTS,
  DECISION_CONFIDENCE_MAX_UNCERTAINTY_FIELDS,
} from "./decisionConfidenceGuards";
import type {
  ConfidenceArbitrationSnapshot,
  DecisionConfidenceStoreState,
  EnterpriseUncertaintyField,
  ExecutiveDecisionConfidence,
  OperationalAmbiguityIndicator,
  StrategicCertaintySignal,
} from "./decisionConfidenceTypes";

function mergeConfidences(
  existing: ExecutiveDecisionConfidence,
  incoming: ExecutiveDecisionConfidence
): ExecutiveDecisionConfidence {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    confidenceSignals: Object.freeze(
      Array.from(new Set([...existing.confidenceSignals, ...incoming.confidenceSignals])).slice(0, 6)
    ),
    uncertaintySignals: Object.freeze(
      Array.from(new Set([...existing.uncertaintySignals, ...incoming.uncertaintySignals])).slice(0, 6)
    ),
    confidenceScore: Math.max(existing.confidenceScore, incoming.confidenceScore),
    confidenceLevel:
      incoming.confidenceScore >= existing.confidenceScore
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    certaintyState:
      incoming.confidenceScore >= existing.confidenceScore
        ? incoming.certaintyState
        : existing.certaintyState,
    confidenceCategory:
      incoming.confidenceScore >= existing.confidenceScore
        ? incoming.confidenceCategory
        : existing.confidenceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  executiveConfidences: readonly ExecutiveDecisionConfidence[];
}): string {
  return stableSignature([
    "d9-5-6-decision-confidence",
    state.executiveConfidences.length,
    state.executiveConfidences.slice(0, 3).map((c) => c.confidenceId),
  ]);
}

export function createDecisionConfidenceStore(initial?: DecisionConfidenceStoreState): {
  getState(): DecisionConfidenceStoreState;
  upsertExecutiveConfidences(
    confidences: ExecutiveDecisionConfidence[],
    now?: number
  ): DecisionConfidenceStoreState;
  upsertSnapshots(
    snapshots: ConfidenceArbitrationSnapshot[],
    now?: number
  ): DecisionConfidenceStoreState;
  upsertCertaintySignals(
    signals: StrategicCertaintySignal[],
    now?: number
  ): DecisionConfidenceStoreState;
  upsertUncertaintyFields(
    fields: EnterpriseUncertaintyField[],
    now?: number
  ): DecisionConfidenceStoreState;
  upsertAmbiguityIndicators(
    indicators: OperationalAmbiguityIndicator[],
    now?: number
  ): DecisionConfidenceStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): DecisionConfidenceStoreState;
} {
  let state: DecisionConfidenceStoreState = initial ?? {
    executiveConfidences: [],
    snapshots: [],
    certaintySignals: [],
    uncertaintyFields: [],
    ambiguityIndicators: [],
    signature: buildStoreSignature({ executiveConfidences: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): DecisionConfidenceStoreState {
      return {
        ...state,
        executiveConfidences: state.executiveConfidences.map((c) => ({ ...c })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        certaintySignals: state.certaintySignals.map((s) => ({ ...s })),
        uncertaintyFields: state.uncertaintyFields.map((f) => ({ ...f })),
        ambiguityIndicators: state.ambiguityIndicators.map((i) => ({ ...i })),
      };
    },

    upsertExecutiveConfidences(
      confidences: ExecutiveDecisionConfidence[],
      now = Date.now()
    ): DecisionConfidenceStoreState {
      const byId = new Map<string, ExecutiveDecisionConfidence>();
      for (const c of state.executiveConfidences) byId.set(c.confidenceId, c);
      for (const c of confidences) {
        const existing = byId.get(c.confidenceId);
        byId.set(c.confidenceId, existing ? mergeConfidences(existing, c) : { ...c });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DECISION_CONFIDENCE_MAX_CONFIDENCES);
      state = {
        ...state,
        executiveConfidences: Object.freeze(next),
        signature: buildStoreSignature({ executiveConfidences: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ConfidenceArbitrationSnapshot[],
      now = Date.now()
    ): DecisionConfidenceStoreState {
      const byId = new Map<string, ConfidenceArbitrationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_CONFIDENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCertaintySignals(
      signals: StrategicCertaintySignal[],
      now = Date.now()
    ): DecisionConfidenceStoreState {
      const byId = new Map<string, StrategicCertaintySignal>();
      for (const s of state.certaintySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_CONFIDENCE_MAX_CERTAINTY_SIGNALS);
      state = { ...state, certaintySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertUncertaintyFields(
      fields: EnterpriseUncertaintyField[],
      now = Date.now()
    ): DecisionConfidenceStoreState {
      const byId = new Map<string, EnterpriseUncertaintyField>();
      for (const f of state.uncertaintyFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_CONFIDENCE_MAX_UNCERTAINTY_FIELDS);
      state = { ...state, uncertaintyFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAmbiguityIndicators(
      indicators: OperationalAmbiguityIndicator[],
      now = Date.now()
    ): DecisionConfidenceStoreState {
      const byId = new Map<string, OperationalAmbiguityIndicator>();
      for (const i of state.ambiguityIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_CONFIDENCE_MAX_AMBIGUITY_INDICATORS);
      state = { ...state, ambiguityIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): DecisionConfidenceStoreState {
      state = {
        executiveConfidences: [],
        snapshots: [],
        certaintySignals: [],
        uncertaintyFields: [],
        ambiguityIndicators: [],
        signature: buildStoreSignature({ executiveConfidences: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDecisionConfidenceStore>>();

export function getDecisionConfidenceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDecisionConfidenceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDecisionConfidenceStores(): void {
  storesByOrganization.clear();
}
