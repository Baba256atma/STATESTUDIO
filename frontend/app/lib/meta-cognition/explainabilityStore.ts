import { stableSignature } from "../intelligence/shared/dedupe";
import {
  EXPLAINABILITY_MAX_CONFIDENCE_FIELDS,
  EXPLAINABILITY_MAX_PATHWAYS,
  EXPLAINABILITY_MAX_SIGNALS,
  EXPLAINABILITY_MAX_SNAPSHOTS,
  EXPLAINABILITY_MAX_TRACES,
} from "./explainabilityGuards";
import type {
  EnterpriseCognitionPathway,
  ExecutiveReasoningTrace,
  ExplanationConfidenceField,
  ExplainabilityStoreState,
  StrategicExplanationSnapshot,
  TransparencyState,
  TransparentReasoningSignal,
} from "./explainabilityTypes";

function mergeTraces(
  existing: ExecutiveReasoningTrace,
  incoming: ExecutiveReasoningTrace
): ExecutiveReasoningTrace {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    reasoningPathways: Object.freeze(
      Array.from(new Set([...existing.reasoningPathways, ...incoming.reasoningPathways])).slice(0, 8)
    ),
    uncertaintyFactors: Object.freeze(
      Array.from(new Set([...existing.uncertaintyFactors, ...incoming.uncertaintyFactors])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    transparencyState:
      incoming.confidence >= existing.confidence
        ? incoming.transparencyState
        : existing.transparencyState,
    explanationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.explanationStrength
        : existing.explanationStrength,
    explanationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.explanationCategory
        : existing.explanationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  reasoningTraces: readonly ExecutiveReasoningTrace[];
}): string {
  return stableSignature([
    "d9-6-5-explainability",
    state.reasoningTraces.length,
    state.reasoningTraces.slice(0, 3).map((t) => t.explainabilityId),
  ]);
}

export function createExplainabilityStore(initial?: ExplainabilityStoreState): {
  getState(): ExplainabilityStoreState;
  upsertReasoningTraces(traces: ExecutiveReasoningTrace[], now?: number): ExplainabilityStoreState;
  upsertSnapshots(
    snapshots: StrategicExplanationSnapshot[],
    now?: number
  ): ExplainabilityStoreState;
  upsertTransparentReasoningSignals(
    signals: TransparentReasoningSignal[],
    now?: number
  ): ExplainabilityStoreState;
  upsertCognitionPathways(
    pathways: EnterpriseCognitionPathway[],
    now?: number
  ): ExplainabilityStoreState;
  upsertExplanationConfidenceFields(
    fields: ExplanationConfidenceField[],
    now?: number
  ): ExplainabilityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastTransparencyState(state: TransparencyState): void;
  clear(): ExplainabilityStoreState;
} {
  let state: ExplainabilityStoreState = initial ?? {
    reasoningTraces: [],
    snapshots: [],
    transparentReasoningSignals: [],
    cognitionPathways: [],
    explanationConfidenceFields: [],
    signature: buildStoreSignature({ reasoningTraces: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastTransparencyState: null,
  };

  return {
    getState(): ExplainabilityStoreState {
      return {
        ...state,
        reasoningTraces: state.reasoningTraces.map((t) => ({ ...t })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        transparentReasoningSignals: state.transparentReasoningSignals.map((s) => ({ ...s })),
        cognitionPathways: state.cognitionPathways.map((p) => ({ ...p })),
        explanationConfidenceFields: state.explanationConfidenceFields.map((f) => ({ ...f })),
      };
    },

    upsertReasoningTraces(traces: ExecutiveReasoningTrace[], now = Date.now()): ExplainabilityStoreState {
      const byId = new Map<string, ExecutiveReasoningTrace>();
      for (const t of state.reasoningTraces) byId.set(t.explainabilityId, t);
      for (const t of traces) {
        const existing = byId.get(t.explainabilityId);
        byId.set(t.explainabilityId, existing ? mergeTraces(existing, t) : t);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, EXPLAINABILITY_MAX_TRACES);
      state = {
        ...state,
        reasoningTraces: Object.freeze(next),
        signature: buildStoreSignature({ reasoningTraces: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicExplanationSnapshot[],
      now = Date.now()
    ): ExplainabilityStoreState {
      const bySig = new Map<string, StrategicExplanationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXPLAINABILITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTransparentReasoningSignals(
      signals: TransparentReasoningSignal[],
      now = Date.now()
    ): ExplainabilityStoreState {
      const byId = new Map<string, TransparentReasoningSignal>();
      for (const s of state.transparentReasoningSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXPLAINABILITY_MAX_SIGNALS);
      state = { ...state, transparentReasoningSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCognitionPathways(
      pathways: EnterpriseCognitionPathway[],
      now = Date.now()
    ): ExplainabilityStoreState {
      const byId = new Map<string, EnterpriseCognitionPathway>();
      for (const p of state.cognitionPathways) byId.set(p.pathwayId, p);
      for (const p of pathways) byId.set(p.pathwayId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXPLAINABILITY_MAX_PATHWAYS);
      state = { ...state, cognitionPathways: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertExplanationConfidenceFields(
      fields: ExplanationConfidenceField[],
      now = Date.now()
    ): ExplainabilityStoreState {
      const byId = new Map<string, ExplanationConfidenceField>();
      for (const f of state.explanationConfidenceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXPLAINABILITY_MAX_CONFIDENCE_FIELDS);
      state = { ...state, explanationConfidenceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastTransparencyState(transparencyState: TransparencyState): void {
      state = { ...state, lastTransparencyState: transparencyState };
    },

    clear(): ExplainabilityStoreState {
      state = {
        reasoningTraces: [],
        snapshots: [],
        transparentReasoningSignals: [],
        cognitionPathways: [],
        explanationConfidenceFields: [],
        signature: buildStoreSignature({ reasoningTraces: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastTransparencyState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createExplainabilityStore>>();

export function getExplainabilityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createExplainabilityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetExplainabilityStores(): void {
  storesByOrganization.clear();
}
