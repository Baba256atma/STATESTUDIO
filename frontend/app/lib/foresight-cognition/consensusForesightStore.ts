import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CONSENSUS_FORESIGHT_MAX_ALIGNMENT_SCORES,
  CONSENSUS_FORESIGHT_MAX_DISAGREEMENTS,
  CONSENSUS_FORESIGHT_MAX_PERSPECTIVE_SIGNALS,
  CONSENSUS_FORESIGHT_MAX_RECOMMENDATIONS,
  CONSENSUS_FORESIGHT_MAX_SNAPSHOTS,
} from "./consensusForesightGuards";
import type {
  AdvisoryPerspectiveSignal,
  ConsensusAlignmentScore,
  ConsensusForesightStoreState,
  MultiPerspectiveRecommendation,
  StrategicConsensusSnapshot,
  StrategicDisagreementSignal,
} from "./consensusForesightTypes";

function mergeMultiPerspectiveRecommendations(
  existing: MultiPerspectiveRecommendation,
  incoming: MultiPerspectiveRecommendation
): MultiPerspectiveRecommendation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    supportingPerspectives: Object.freeze(
      Array.from(new Set([...existing.supportingPerspectives, ...incoming.supportingPerspectives])).slice(
        0,
        8
      )
    ),
    disagreements: Object.freeze(
      Array.from(new Set([...existing.disagreements, ...incoming.disagreements])).slice(0, 4)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    consensusState:
      incoming.confidence >= existing.confidence
        ? incoming.consensusState
        : existing.consensusState,
    consensusStrength:
      incoming.confidence >= existing.confidence
        ? incoming.consensusStrength
        : existing.consensusStrength,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  multiPerspectiveRecommendations: readonly MultiPerspectiveRecommendation[];
}): string {
  return stableSignature([
    "d9-4-9-consensus-foresight",
    state.multiPerspectiveRecommendations.length,
    state.multiPerspectiveRecommendations.slice(0, 3).map((r) => r.consensusId),
  ]);
}

export function createConsensusForesightStore(initial?: ConsensusForesightStoreState): {
  getState(): ConsensusForesightStoreState;
  upsertMultiPerspectiveRecommendations(
    recommendations: MultiPerspectiveRecommendation[],
    now?: number
  ): ConsensusForesightStoreState;
  upsertSnapshots(
    snapshots: StrategicConsensusSnapshot[],
    now?: number
  ): ConsensusForesightStoreState;
  upsertPerspectiveSignals(
    signals: AdvisoryPerspectiveSignal[],
    now?: number
  ): ConsensusForesightStoreState;
  upsertAlignmentScores(
    scores: ConsensusAlignmentScore[],
    now?: number
  ): ConsensusForesightStoreState;
  upsertDisagreementSignals(
    signals: StrategicDisagreementSignal[],
    now?: number
  ): ConsensusForesightStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): ConsensusForesightStoreState;
} {
  let state: ConsensusForesightStoreState = initial ?? {
    multiPerspectiveRecommendations: [],
    snapshots: [],
    perspectiveSignals: [],
    alignmentScores: [],
    disagreementSignals: [],
    signature: buildStoreSignature({ multiPerspectiveRecommendations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): ConsensusForesightStoreState {
      return {
        ...state,
        multiPerspectiveRecommendations: state.multiPerspectiveRecommendations.map((r) => ({ ...r })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        perspectiveSignals: state.perspectiveSignals.map((s) => ({ ...s })),
        alignmentScores: state.alignmentScores.map((s) => ({ ...s })),
        disagreementSignals: state.disagreementSignals.map((s) => ({ ...s })),
      };
    },

    upsertMultiPerspectiveRecommendations(
      recommendations: MultiPerspectiveRecommendation[],
      now = Date.now()
    ): ConsensusForesightStoreState {
      const byId = new Map<string, MultiPerspectiveRecommendation>();
      for (const r of state.multiPerspectiveRecommendations) byId.set(r.consensusId, r);
      for (const r of recommendations) {
        const existing = byId.get(r.consensusId);
        byId.set(r.consensusId, existing ? mergeMultiPerspectiveRecommendations(existing, r) : { ...r });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CONSENSUS_FORESIGHT_MAX_RECOMMENDATIONS);
      state = {
        ...state,
        multiPerspectiveRecommendations: Object.freeze(next),
        signature: buildStoreSignature({ multiPerspectiveRecommendations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicConsensusSnapshot[],
      now = Date.now()
    ): ConsensusForesightStoreState {
      const byId = new Map<string, StrategicConsensusSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_FORESIGHT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPerspectiveSignals(
      signals: AdvisoryPerspectiveSignal[],
      now = Date.now()
    ): ConsensusForesightStoreState {
      const byId = new Map<string, AdvisoryPerspectiveSignal>();
      for (const s of state.perspectiveSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_FORESIGHT_MAX_PERSPECTIVE_SIGNALS);
      state = { ...state, perspectiveSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlignmentScores(
      scores: ConsensusAlignmentScore[],
      now = Date.now()
    ): ConsensusForesightStoreState {
      const byId = new Map<string, ConsensusAlignmentScore>();
      for (const s of state.alignmentScores) byId.set(s.scoreId, s);
      for (const s of scores) byId.set(s.scoreId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_FORESIGHT_MAX_ALIGNMENT_SCORES);
      state = { ...state, alignmentScores: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDisagreementSignals(
      signals: StrategicDisagreementSignal[],
      now = Date.now()
    ): ConsensusForesightStoreState {
      const byId = new Map<string, StrategicDisagreementSignal>();
      for (const s of state.disagreementSignals) byId.set(s.disagreementId, s);
      for (const s of signals) byId.set(s.disagreementId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CONSENSUS_FORESIGHT_MAX_DISAGREEMENTS);
      state = { ...state, disagreementSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): ConsensusForesightStoreState {
      state = {
        multiPerspectiveRecommendations: [],
        snapshots: [],
        perspectiveSignals: [],
        alignmentScores: [],
        disagreementSignals: [],
        signature: buildStoreSignature({ multiPerspectiveRecommendations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createConsensusForesightStore>>();

export function getConsensusForesightStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createConsensusForesightStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetConsensusForesightStores(): void {
  storesByOrganization.clear();
}
