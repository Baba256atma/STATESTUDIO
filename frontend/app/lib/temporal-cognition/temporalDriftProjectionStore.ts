import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TEMPORAL_DRIFT_MAX_DIRECTIONS,
  TEMPORAL_DRIFT_MAX_FORECASTS,
  TEMPORAL_DRIFT_MAX_PROJECTIONS,
  TEMPORAL_DRIFT_MAX_SIGNALS,
  TEMPORAL_DRIFT_MAX_SNAPSHOTS,
  TEMPORAL_DRIFT_MAX_TRENDS,
} from "./temporalDriftProjectionGuards";
import type {
  EnterpriseTrajectorySignal,
  OperationalDriftForecast,
  OrganizationalFutureDirection,
  StrategicEvolutionTrend,
  TemporalDriftProjection,
  TemporalDriftProjectionStoreState,
  TemporalDriftSnapshot,
} from "./temporalDriftProjectionTypes";

function mergeProjections(
  existing: TemporalDriftProjection,
  incoming: TemporalDriftProjection
): TemporalDriftProjection {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    supportingSignals: Object.freeze(
      Array.from(new Set([...existing.supportingSignals, ...incoming.supportingSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  projections: readonly TemporalDriftProjection[];
}): string {
  return stableSignature([
    "d9-3-4-temporal-drift",
    state.projections.length,
    state.projections.slice(0, 3).map((p) => p.projectionId),
  ]);
}

export function createTemporalDriftProjectionStore(
  initial?: TemporalDriftProjectionStoreState
): {
  getState(): TemporalDriftProjectionStoreState;
  upsertProjections(
    projections: TemporalDriftProjection[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  upsertSnapshots(
    snapshots: TemporalDriftSnapshot[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  upsertSignals(
    signals: EnterpriseTrajectorySignal[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  upsertFutureDirections(
    directions: OrganizationalFutureDirection[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  upsertEvolutionTrends(
    trends: StrategicEvolutionTrend[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  upsertForecasts(
    forecasts: OperationalDriftForecast[],
    now?: number
  ): TemporalDriftProjectionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): TemporalDriftProjectionStoreState;
} {
  let state: TemporalDriftProjectionStoreState = initial ?? {
    projections: [],
    snapshots: [],
    signals: [],
    futureDirections: [],
    evolutionTrends: [],
    forecasts: [],
    signature: buildStoreSignature({ projections: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): TemporalDriftProjectionStoreState {
      return {
        ...state,
        projections: state.projections.map((p) => ({ ...p })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
        futureDirections: state.futureDirections.map((d) => ({ ...d })),
        evolutionTrends: state.evolutionTrends.map((t) => ({ ...t })),
        forecasts: state.forecasts.map((f) => ({ ...f })),
      };
    },

    upsertProjections(
      projections: TemporalDriftProjection[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, TemporalDriftProjection>();
      for (const p of state.projections) byId.set(p.projectionId, p);
      for (const p of projections) {
        const existing = byId.get(p.projectionId);
        byId.set(p.projectionId, existing ? mergeProjections(existing, p) : { ...p });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_PROJECTIONS);
      state = {
        ...state,
        projections: Object.freeze(next),
        signature: buildStoreSignature({ projections: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: TemporalDriftSnapshot[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, TemporalDriftSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: EnterpriseTrajectorySignal[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, EnterpriseTrajectorySignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFutureDirections(
      directions: OrganizationalFutureDirection[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, OrganizationalFutureDirection>();
      for (const d of state.futureDirections) byId.set(d.directionId, d);
      for (const d of directions) byId.set(d.directionId, d);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_DIRECTIONS);
      state = { ...state, futureDirections: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEvolutionTrends(
      trends: StrategicEvolutionTrend[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, StrategicEvolutionTrend>();
      for (const t of state.evolutionTrends) byId.set(t.trendId, t);
      for (const t of trends) byId.set(t.trendId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_TRENDS);
      state = { ...state, evolutionTrends: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertForecasts(
      forecasts: OperationalDriftForecast[],
      now = Date.now()
    ): TemporalDriftProjectionStoreState {
      const byId = new Map<string, OperationalDriftForecast>();
      for (const f of state.forecasts) byId.set(f.forecastId, f);
      for (const f of forecasts) byId.set(f.forecastId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TEMPORAL_DRIFT_MAX_FORECASTS);
      state = { ...state, forecasts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): TemporalDriftProjectionStoreState {
      state = {
        projections: [],
        snapshots: [],
        signals: [],
        futureDirections: [],
        evolutionTrends: [],
        forecasts: [],
        signature: buildStoreSignature({ projections: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createTemporalDriftProjectionStore>
>();

export function getTemporalDriftProjectionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTemporalDriftProjectionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTemporalDriftProjectionStores(): void {
  storesByOrganization.clear();
}
