import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_RECALL_MAX_FRAMES,
  INSTITUTIONAL_RECALL_MAX_MATCHES,
  INSTITUTIONAL_RECALL_MAX_RECONSTRUCTIONS,
  INSTITUTIONAL_RECALL_MAX_REFERENCES,
  INSTITUTIONAL_RECALL_MAX_RESULTS,
  INSTITUTIONAL_RECALL_MAX_SIMILARITY_SCORES,
  similarityRank,
} from "./institutionalRecallGuards";
import type {
  ExecutiveHistoricalReference,
  HistoricalContextFrame,
  HistoricalSituationReconstruction,
  InstitutionalRecallResult,
  InstitutionalRecallStoreState,
  OperationalSimilarityScore,
  StrategicMemoryMatch,
} from "./institutionalRecallTypes";

function mergeRecalls(
  existing: InstitutionalRecallResult,
  incoming: InstitutionalRecallResult
): InstitutionalRecallResult {
  return {
    ...existing,
    title: incoming.title || existing.title,
    summary: incoming.summary || existing.summary,
    similarityLevel:
      similarityRank(incoming.similarityLevel) > similarityRank(existing.similarityLevel)
        ? incoming.similarityLevel
        : existing.similarityLevel,
    confidence: Math.max(existing.confidence, incoming.confidence),
    relatedMemories: Object.freeze(
      Array.from(new Set([...existing.relatedMemories, ...incoming.relatedMemories])).slice(0, 8)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  recalls: readonly InstitutionalRecallResult[];
  contextFrames: readonly HistoricalContextFrame[];
}): string {
  return stableSignature([
    "d9-2-6-recall",
    state.recalls.length,
    state.contextFrames.length,
    state.recalls.slice(0, 3).map((r) => r.recallId),
  ]);
}

export function createInstitutionalRecallStore(initial?: InstitutionalRecallStoreState): {
  getState(): InstitutionalRecallStoreState;
  upsertRecalls(
    recalls: InstitutionalRecallResult[],
    now?: number
  ): InstitutionalRecallStoreState;
  upsertContextFrames(
    frames: HistoricalContextFrame[],
    now?: number
  ): InstitutionalRecallStoreState;
  upsertExecutiveReferences(
    references: ExecutiveHistoricalReference[],
    now?: number
  ): InstitutionalRecallStoreState;
  upsertStrategicMatches(
    matches: StrategicMemoryMatch[],
    now?: number
  ): InstitutionalRecallStoreState;
  upsertReconstructions(
    reconstructions: HistoricalSituationReconstruction[],
    now?: number
  ): InstitutionalRecallStoreState;
  upsertSimilarityScores(
    scores: OperationalSimilarityScore[],
    now?: number
  ): InstitutionalRecallStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalRecallStoreState;
} {
  let state: InstitutionalRecallStoreState = initial ?? {
    recalls: [],
    contextFrames: [],
    executiveReferences: [],
    strategicMatches: [],
    reconstructions: [],
    similarityScores: [],
    signature: buildStoreSignature({ recalls: [], contextFrames: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalRecallStoreState {
      return {
        ...state,
        recalls: state.recalls.map((r) => ({ ...r })),
        contextFrames: state.contextFrames.map((f) => ({ ...f })),
        executiveReferences: state.executiveReferences.map((r) => ({ ...r })),
        strategicMatches: state.strategicMatches.map((m) => ({ ...m })),
        reconstructions: state.reconstructions.map((r) => ({ ...r })),
        similarityScores: state.similarityScores.map((s) => ({ ...s })),
      };
    },

    upsertRecalls(
      recalls: InstitutionalRecallResult[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, InstitutionalRecallResult>();
      for (const r of state.recalls) byId.set(r.recallId, r);
      for (const r of recalls) {
        const existing = byId.get(r.recallId);
        byId.set(r.recallId, existing ? mergeRecalls(existing, r) : { ...r });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_RESULTS);
      state = {
        ...state,
        recalls: Object.freeze(next),
        signature: buildStoreSignature({ recalls: next, contextFrames: state.contextFrames }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertContextFrames(
      frames: HistoricalContextFrame[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, HistoricalContextFrame>();
      for (const f of state.contextFrames) byId.set(f.frameId, f);
      for (const f of frames) {
        const existing = byId.get(f.frameId);
        if (!existing) {
          byId.set(f.frameId, { ...f });
          continue;
        }
        byId.set(f.frameId, {
          ...existing,
          narrative: f.narrative || existing.narrative,
          lastObservedAt: Math.max(existing.lastObservedAt, f.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_FRAMES);
      state = {
        ...state,
        contextFrames: Object.freeze(next),
        signature: buildStoreSignature({ recalls: state.recalls, contextFrames: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertExecutiveReferences(
      references: ExecutiveHistoricalReference[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, ExecutiveHistoricalReference>();
      for (const r of state.executiveReferences) byId.set(r.referenceId, r);
      for (const r of references) byId.set(r.referenceId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_REFERENCES);
      state = { ...state, executiveReferences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicMatches(
      matches: StrategicMemoryMatch[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, StrategicMemoryMatch>();
      for (const m of state.strategicMatches) byId.set(m.matchId, m);
      for (const m of matches) byId.set(m.matchId, m);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_MATCHES);
      state = { ...state, strategicMatches: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReconstructions(
      reconstructions: HistoricalSituationReconstruction[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, HistoricalSituationReconstruction>();
      for (const r of state.reconstructions) byId.set(r.reconstructionId, r);
      for (const r of reconstructions) byId.set(r.reconstructionId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_RECONSTRUCTIONS);
      state = { ...state, reconstructions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSimilarityScores(
      scores: OperationalSimilarityScore[],
      now = Date.now()
    ): InstitutionalRecallStoreState {
      const byId = new Map<string, OperationalSimilarityScore>();
      for (const s of state.similarityScores) byId.set(s.scoreId, s);
      for (const s of scores) byId.set(s.scoreId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_RECALL_MAX_SIMILARITY_SCORES);
      state = { ...state, similarityScores: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalRecallStoreState {
      state = {
        recalls: [],
        contextFrames: [],
        executiveReferences: [],
        strategicMatches: [],
        reconstructions: [],
        similarityScores: [],
        signature: buildStoreSignature({ recalls: [], contextFrames: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createInstitutionalRecallStore>>();

export function getInstitutionalRecallStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalRecallStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalRecallStores(): void {
  storesByOrganization.clear();
}
