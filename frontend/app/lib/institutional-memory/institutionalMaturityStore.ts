import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_MATURITY_MAX_EVOLUTIONS,
  INSTITUTIONAL_MATURITY_MAX_OBSERVATIONS,
  INSTITUTIONAL_MATURITY_MAX_PROGRESS,
  INSTITUTIONAL_MATURITY_MAX_SIGNALS,
  INSTITUTIONAL_MATURITY_MAX_SNAPSHOTS,
  INSTITUTIONAL_MATURITY_MAX_TRENDS,
  maturityRank,
  trendRank,
} from "./institutionalMaturityGuards";
import type {
  CognitiveEvolutionObservation,
  InstitutionalMaturitySnapshot,
  InstitutionalMaturityStoreState,
  IntelligenceMaturitySignal,
  OrganizationalLearningEvolution,
  ResilienceMaturityTrend,
  StrategicAdaptationProgress,
} from "./institutionalMaturityTypes";

function mergeSnapshots(
  existing: InstitutionalMaturitySnapshot,
  incoming: InstitutionalMaturitySnapshot
): InstitutionalMaturitySnapshot {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    maturityLevel:
      maturityRank(incoming.maturityLevel) > maturityRank(existing.maturityLevel)
        ? incoming.maturityLevel
        : existing.maturityLevel,
    evolutionTrend:
      trendRank(incoming.evolutionTrend) > trendRank(existing.evolutionTrend)
        ? incoming.evolutionTrend
        : existing.evolutionTrend,
    confidence: Math.max(existing.confidence, incoming.confidence),
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 6)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  snapshots: readonly InstitutionalMaturitySnapshot[];
  evolutions: readonly OrganizationalLearningEvolution[];
}): string {
  return stableSignature([
    "d9-2-7-maturity",
    state.snapshots.length,
    state.evolutions.length,
    state.snapshots.slice(0, 3).map((s) => s.maturitySnapshotId),
  ]);
}

export function createInstitutionalMaturityStore(initial?: InstitutionalMaturityStoreState): {
  getState(): InstitutionalMaturityStoreState;
  upsertSnapshots(
    snapshots: InstitutionalMaturitySnapshot[],
    now?: number
  ): InstitutionalMaturityStoreState;
  upsertEvolutions(
    evolutions: OrganizationalLearningEvolution[],
    now?: number
  ): InstitutionalMaturityStoreState;
  upsertSignals(
    signals: IntelligenceMaturitySignal[],
    now?: number
  ): InstitutionalMaturityStoreState;
  upsertResilienceTrends(
    trends: ResilienceMaturityTrend[],
    now?: number
  ): InstitutionalMaturityStoreState;
  upsertAdaptationProgress(
    progress: StrategicAdaptationProgress[],
    now?: number
  ): InstitutionalMaturityStoreState;
  upsertObservations(
    observations: CognitiveEvolutionObservation[],
    now?: number
  ): InstitutionalMaturityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastDominantMaturityLevel(level: InstitutionalMaturitySnapshot["maturityLevel"]): void;
  clear(): InstitutionalMaturityStoreState;
} {
  let state: InstitutionalMaturityStoreState = initial ?? {
    snapshots: [],
    evolutions: [],
    signals: [],
    resilienceTrends: [],
    adaptationProgress: [],
    observations: [],
    signature: buildStoreSignature({ snapshots: [], evolutions: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastDominantMaturityLevel: null,
  };

  return {
    getState(): InstitutionalMaturityStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
        evolutions: state.evolutions.map((e) => ({ ...e })),
        signals: state.signals.map((s) => ({ ...s })),
        resilienceTrends: state.resilienceTrends.map((t) => ({ ...t })),
        adaptationProgress: state.adaptationProgress.map((p) => ({ ...p })),
        observations: state.observations.map((o) => ({ ...o })),
      };
    },

    upsertSnapshots(
      snapshots: InstitutionalMaturitySnapshot[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, InstitutionalMaturitySnapshot>();
      for (const s of state.snapshots) byId.set(s.maturitySnapshotId, s);
      for (const s of snapshots) {
        const existing = byId.get(s.maturitySnapshotId);
        byId.set(s.maturitySnapshotId, existing ? mergeSnapshots(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        signature: buildStoreSignature({ snapshots: next, evolutions: state.evolutions }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertEvolutions(
      evolutions: OrganizationalLearningEvolution[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, OrganizationalLearningEvolution>();
      for (const e of state.evolutions) byId.set(e.evolutionId, e);
      for (const e of evolutions) {
        const existing = byId.get(e.evolutionId);
        if (!existing) {
          byId.set(e.evolutionId, { ...e });
          continue;
        }
        byId.set(e.evolutionId, {
          ...existing,
          progressionSummary: e.progressionSummary || existing.progressionSummary,
          occurrenceCount: existing.occurrenceCount + 1,
          lastObservedAt: Math.max(existing.lastObservedAt, e.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_EVOLUTIONS);
      state = {
        ...state,
        evolutions: Object.freeze(next),
        signature: buildStoreSignature({ snapshots: state.snapshots, evolutions: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSignals(
      signals: IntelligenceMaturitySignal[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, IntelligenceMaturitySignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceTrends(
      trends: ResilienceMaturityTrend[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, ResilienceMaturityTrend>();
      for (const t of state.resilienceTrends) byId.set(t.trendId, t);
      for (const t of trends) byId.set(t.trendId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_TRENDS);
      state = { ...state, resilienceTrends: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptationProgress(
      progress: StrategicAdaptationProgress[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, StrategicAdaptationProgress>();
      for (const p of state.adaptationProgress) byId.set(p.progressId, p);
      for (const p of progress) byId.set(p.progressId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_PROGRESS);
      state = { ...state, adaptationProgress: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertObservations(
      observations: CognitiveEvolutionObservation[],
      now = Date.now()
    ): InstitutionalMaturityStoreState {
      const byId = new Map<string, CognitiveEvolutionObservation>();
      for (const o of state.observations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_MATURITY_MAX_OBSERVATIONS);
      state = { ...state, observations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastDominantMaturityLevel(level: InstitutionalMaturitySnapshot["maturityLevel"]): void {
      state = { ...state, lastDominantMaturityLevel: level };
    },

    clear(): InstitutionalMaturityStoreState {
      state = {
        snapshots: [],
        evolutions: [],
        signals: [],
        resilienceTrends: [],
        adaptationProgress: [],
        observations: [],
        signature: buildStoreSignature({ snapshots: [], evolutions: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastDominantMaturityLevel: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalMaturityStore>
>();

export function getInstitutionalMaturityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalMaturityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalMaturityStores(): void {
  storesByOrganization.clear();
}
