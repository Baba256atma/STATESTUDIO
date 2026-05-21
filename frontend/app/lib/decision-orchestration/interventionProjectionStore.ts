import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INTERVENTION_PROJECTION_MAX_EVOLUTIONS,
  INTERVENTION_PROJECTION_MAX_PROJECTIONS,
  INTERVENTION_PROJECTION_MAX_SIGNALS,
  INTERVENTION_PROJECTION_MAX_SIMULATIONS,
  INTERVENTION_PROJECTION_MAX_SNAPSHOTS,
  INTERVENTION_PROJECTION_MAX_TOPOLOGIES,
} from "./interventionProjectionGuards";
import type {
  EnterpriseOutcomeSimulation,
  InterventionEffectTopology,
  InterventionProjectionStoreState,
  OperationalConsequenceSignal,
  OutcomeProjectionSnapshot,
  ResponseEvolutionProjection,
  StrategicInterventionProjection,
} from "./interventionProjectionTypes";

function mergeProjections(
  existing: StrategicInterventionProjection,
  incoming: StrategicInterventionProjection
): StrategicInterventionProjection {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    projectedOutcomes: Object.freeze(
      Array.from(new Set([...existing.projectedOutcomes, ...incoming.projectedOutcomes])).slice(0, 6)
    ),
    secondaryEffects: Object.freeze(
      Array.from(new Set([...existing.secondaryEffects, ...incoming.secondaryEffects])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    projectionState:
      incoming.confidence >= existing.confidence
        ? incoming.projectionState
        : existing.projectionState,
    projectionStrength:
      incoming.confidence >= existing.confidence
        ? incoming.projectionStrength
        : existing.projectionStrength,
    projectionCategory:
      incoming.confidence >= existing.confidence
        ? incoming.projectionCategory
        : existing.projectionCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  interventionProjections: readonly StrategicInterventionProjection[];
}): string {
  return stableSignature([
    "d9-5-8-intervention-projection",
    state.interventionProjections.length,
    state.interventionProjections.slice(0, 3).map((p) => p.projectionId),
  ]);
}

export function createInterventionProjectionStore(initial?: InterventionProjectionStoreState): {
  getState(): InterventionProjectionStoreState;
  upsertInterventionProjections(
    projections: StrategicInterventionProjection[],
    now?: number
  ): InterventionProjectionStoreState;
  upsertSnapshots(
    snapshots: OutcomeProjectionSnapshot[],
    now?: number
  ): InterventionProjectionStoreState;
  upsertOutcomeSimulations(
    simulations: EnterpriseOutcomeSimulation[],
    now?: number
  ): InterventionProjectionStoreState;
  upsertConsequenceSignals(
    signals: OperationalConsequenceSignal[],
    now?: number
  ): InterventionProjectionStoreState;
  upsertEvolutionProjections(
    evolutions: ResponseEvolutionProjection[],
    now?: number
  ): InterventionProjectionStoreState;
  upsertEffectTopologies(
    topologies: InterventionEffectTopology[],
    now?: number
  ): InterventionProjectionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InterventionProjectionStoreState;
} {
  let state: InterventionProjectionStoreState = initial ?? {
    interventionProjections: [],
    snapshots: [],
    outcomeSimulations: [],
    consequenceSignals: [],
    evolutionProjections: [],
    effectTopologies: [],
    signature: buildStoreSignature({ interventionProjections: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InterventionProjectionStoreState {
      return {
        ...state,
        interventionProjections: state.interventionProjections.map((p) => ({ ...p })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        outcomeSimulations: state.outcomeSimulations.map((s) => ({ ...s })),
        consequenceSignals: state.consequenceSignals.map((s) => ({ ...s })),
        evolutionProjections: state.evolutionProjections.map((e) => ({ ...e })),
        effectTopologies: state.effectTopologies.map((t) => ({ ...t })),
      };
    },

    upsertInterventionProjections(
      projections: StrategicInterventionProjection[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, StrategicInterventionProjection>();
      for (const p of state.interventionProjections) byId.set(p.projectionId, p);
      for (const p of projections) {
        const existing = byId.get(p.projectionId);
        byId.set(p.projectionId, existing ? mergeProjections(existing, p) : { ...p });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_PROJECTIONS);
      state = {
        ...state,
        interventionProjections: Object.freeze(next),
        signature: buildStoreSignature({ interventionProjections: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: OutcomeProjectionSnapshot[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, OutcomeProjectionSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertOutcomeSimulations(
      simulations: EnterpriseOutcomeSimulation[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, EnterpriseOutcomeSimulation>();
      for (const s of state.outcomeSimulations) byId.set(s.simulationId, s);
      for (const s of simulations) {
        const existing = byId.get(s.simulationId);
        byId.set(
          s.simulationId,
          existing
            ? {
                ...existing,
                ...s,
                occurrenceCount: existing.occurrenceCount + (s.occurrenceCount || 1),
              }
            : { ...s }
        );
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_SIMULATIONS);
      state = { ...state, outcomeSimulations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConsequenceSignals(
      signals: OperationalConsequenceSignal[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, OperationalConsequenceSignal>();
      for (const s of state.consequenceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_SIGNALS);
      state = { ...state, consequenceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEvolutionProjections(
      evolutions: ResponseEvolutionProjection[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, ResponseEvolutionProjection>();
      for (const e of state.evolutionProjections) byId.set(e.evolutionId, e);
      for (const e of evolutions) byId.set(e.evolutionId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_EVOLUTIONS);
      state = { ...state, evolutionProjections: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEffectTopologies(
      topologies: InterventionEffectTopology[],
      now = Date.now()
    ): InterventionProjectionStoreState {
      const byId = new Map<string, InterventionEffectTopology>();
      for (const t of state.effectTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_PROJECTION_MAX_TOPOLOGIES);
      state = { ...state, effectTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InterventionProjectionStoreState {
      state = {
        interventionProjections: [],
        snapshots: [],
        outcomeSimulations: [],
        consequenceSignals: [],
        evolutionProjections: [],
        effectTopologies: [],
        signature: buildStoreSignature({ interventionProjections: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInterventionProjectionStore>
>();

export function getInterventionProjectionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInterventionProjectionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInterventionProjectionStores(): void {
  storesByOrganization.clear();
}
