import { stableSignature } from "../intelligence/shared/dedupe";
import {
  REASONING_INTEGRITY_MAX_ALIGNMENTS,
  REASONING_INTEGRITY_MAX_CONTRADICTIONS,
  REASONING_INTEGRITY_MAX_OBSERVATIONS,
  REASONING_INTEGRITY_MAX_SIGNALS,
  REASONING_INTEGRITY_MAX_SNAPSHOTS,
} from "./reasoningIntegrityGuards";
import type {
  CognitiveConsistencySignal,
  CrossRuntimeAlignment,
  EnterpriseContradictionIndicator,
  ExecutiveTrustObservation,
  ReasoningIntegrityStoreState,
  StrategicReasoningIntegritySnapshot,
} from "./reasoningIntegrityTypes";

function mergeTrustObservations(
  existing: ExecutiveTrustObservation,
  incoming: ExecutiveTrustObservation
): ExecutiveTrustObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    consistencySignals: Object.freeze(
      Array.from(new Set([...existing.consistencySignals, ...incoming.consistencySignals])).slice(
        0,
        6
      )
    ),
    integrityRisks: Object.freeze(
      Array.from(new Set([...existing.integrityRisks, ...incoming.integrityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    consistencyState:
      incoming.confidence >= existing.confidence
        ? incoming.consistencyState
        : existing.consistencyState,
    integrityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.integrityStrength
        : existing.integrityStrength,
    verificationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.verificationCategory
        : existing.verificationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  trustObservations: readonly ExecutiveTrustObservation[];
}): string {
  return stableSignature([
    "d9-6-2-reasoning-integrity",
    state.trustObservations.length,
    state.trustObservations.slice(0, 3).map((o) => o.integrityId),
  ]);
}

export function createReasoningIntegrityStore(initial?: ReasoningIntegrityStoreState): {
  getState(): ReasoningIntegrityStoreState;
  upsertTrustObservations(
    observations: ExecutiveTrustObservation[],
    now?: number
  ): ReasoningIntegrityStoreState;
  upsertSnapshots(
    snapshots: StrategicReasoningIntegritySnapshot[],
    now?: number
  ): ReasoningIntegrityStoreState;
  upsertConsistencySignals(
    signals: CognitiveConsistencySignal[],
    now?: number
  ): ReasoningIntegrityStoreState;
  upsertContradictionIndicators(
    indicators: EnterpriseContradictionIndicator[],
    now?: number
  ): ReasoningIntegrityStoreState;
  upsertCrossRuntimeAlignments(
    alignments: CrossRuntimeAlignment[],
    now?: number
  ): ReasoningIntegrityStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): ReasoningIntegrityStoreState;
} {
  let state: ReasoningIntegrityStoreState = initial ?? {
    trustObservations: [],
    snapshots: [],
    consistencySignals: [],
    contradictionIndicators: [],
    crossRuntimeAlignments: [],
    signature: buildStoreSignature({ trustObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): ReasoningIntegrityStoreState {
      return {
        ...state,
        trustObservations: state.trustObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        consistencySignals: state.consistencySignals.map((s) => ({ ...s })),
        contradictionIndicators: state.contradictionIndicators.map((i) => ({ ...i })),
        crossRuntimeAlignments: state.crossRuntimeAlignments.map((a) => ({ ...a })),
      };
    },

    upsertTrustObservations(
      observations: ExecutiveTrustObservation[],
      now = Date.now()
    ): ReasoningIntegrityStoreState {
      const byId = new Map<string, ExecutiveTrustObservation>();
      for (const o of state.trustObservations) byId.set(o.integrityId, o);
      for (const o of observations) {
        const existing = byId.get(o.integrityId);
        byId.set(o.integrityId, existing ? mergeTrustObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, REASONING_INTEGRITY_MAX_OBSERVATIONS);
      state = {
        ...state,
        trustObservations: Object.freeze(next),
        signature: buildStoreSignature({ trustObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicReasoningIntegritySnapshot[],
      now = Date.now()
    ): ReasoningIntegrityStoreState {
      const bySig = new Map<string, StrategicReasoningIntegritySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, REASONING_INTEGRITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConsistencySignals(
      signals: CognitiveConsistencySignal[],
      now = Date.now()
    ): ReasoningIntegrityStoreState {
      const byId = new Map<string, CognitiveConsistencySignal>();
      for (const s of state.consistencySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, REASONING_INTEGRITY_MAX_SIGNALS);
      state = { ...state, consistencySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertContradictionIndicators(
      indicators: EnterpriseContradictionIndicator[],
      now = Date.now()
    ): ReasoningIntegrityStoreState {
      const byId = new Map<string, EnterpriseContradictionIndicator>();
      for (const i of state.contradictionIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, REASONING_INTEGRITY_MAX_CONTRADICTIONS);
      state = { ...state, contradictionIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCrossRuntimeAlignments(
      alignments: CrossRuntimeAlignment[],
      now = Date.now()
    ): ReasoningIntegrityStoreState {
      const byId = new Map<string, CrossRuntimeAlignment>();
      for (const a of state.crossRuntimeAlignments) byId.set(a.alignmentId, a);
      for (const a of alignments) byId.set(a.alignmentId, a);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, REASONING_INTEGRITY_MAX_ALIGNMENTS);
      state = { ...state, crossRuntimeAlignments: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): ReasoningIntegrityStoreState {
      state = {
        trustObservations: [],
        snapshots: [],
        consistencySignals: [],
        contradictionIndicators: [],
        crossRuntimeAlignments: [],
        signature: buildStoreSignature({ trustObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createReasoningIntegrityStore>>();

export function getReasoningIntegrityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createReasoningIntegrityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetReasoningIntegrityStores(): void {
  storesByOrganization.clear();
}
