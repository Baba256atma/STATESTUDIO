import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_ADAPTATION_MAX_FIELDS,
  CIVILIZATION_ADAPTATION_MAX_OBSERVATIONS,
  CIVILIZATION_ADAPTATION_MAX_SIGNALS,
  CIVILIZATION_ADAPTATION_MAX_SNAPSHOTS,
  CIVILIZATION_ADAPTATION_MAX_TOPOLOGIES,
} from "./civilizationAdaptationGuards";
import type {
  CivilizationAdaptationSnapshot,
  CivilizationAdaptationStoreState,
  EcosystemTransformationField,
  EvolutionState,
  LongHorizonEvolutionObservation,
  MacroEvolutionSignal,
  SystemicAdaptationTopology,
} from "./civilizationAdaptationTypes";

function mergeObservations(
  existing: LongHorizonEvolutionObservation,
  incoming: LongHorizonEvolutionObservation
): LongHorizonEvolutionObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    adaptationSignals: Object.freeze(
      Array.from(new Set([...existing.adaptationSignals, ...incoming.adaptationSignals])).slice(0, 6)
    ),
    evolutionRisks: Object.freeze(
      Array.from(new Set([...existing.evolutionRisks, ...incoming.evolutionRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    evolutionState:
      incoming.confidence >= existing.confidence ? incoming.evolutionState : existing.evolutionState,
    adaptationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationStrength
        : existing.adaptationStrength,
    adaptationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationCategory
        : existing.adaptationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly LongHorizonEvolutionObservation[];
}): string {
  return stableSignature([
    "d9-8-6-civilization-adaptation",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.adaptationId),
  ]);
}

export function createCivilizationAdaptationStore(initial?: CivilizationAdaptationStoreState): {
  getState(): CivilizationAdaptationStoreState;
  upsertObservations(
    observations: LongHorizonEvolutionObservation[],
    now?: number
  ): CivilizationAdaptationStoreState;
  upsertSnapshots(
    snapshots: CivilizationAdaptationSnapshot[],
    now?: number
  ): CivilizationAdaptationStoreState;
  upsertEvolutionSignals(
    signals: MacroEvolutionSignal[],
    now?: number
  ): CivilizationAdaptationStoreState;
  upsertTransformationFields(
    fields: EcosystemTransformationField[],
    now?: number
  ): CivilizationAdaptationStoreState;
  upsertAdaptationTopologies(
    topologies: SystemicAdaptationTopology[],
    now?: number
  ): CivilizationAdaptationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastEvolutionState(state: EvolutionState): void;
  clear(): CivilizationAdaptationStoreState;
} {
  let state: CivilizationAdaptationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    evolutionSignals: [],
    transformationFields: [],
    adaptationTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastEvolutionState: null,
  };

  return {
    getState(): CivilizationAdaptationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        evolutionSignals: state.evolutionSignals.map((s) => ({ ...s })),
        transformationFields: state.transformationFields.map((f) => ({ ...f })),
        adaptationTopologies: state.adaptationTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: LongHorizonEvolutionObservation[],
      now = Date.now()
    ): CivilizationAdaptationStoreState {
      const byId = new Map<string, LongHorizonEvolutionObservation>();
      for (const o of state.observations) byId.set(o.adaptationId, o);
      for (const o of observations) {
        const existing = byId.get(o.adaptationId);
        byId.set(o.adaptationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_ADAPTATION_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationAdaptationSnapshot[],
      now = Date.now()
    ): CivilizationAdaptationStoreState {
      const bySig = new Map<string, CivilizationAdaptationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_ADAPTATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertEvolutionSignals(
      signals: MacroEvolutionSignal[],
      now = Date.now()
    ): CivilizationAdaptationStoreState {
      const byId = new Map<string, MacroEvolutionSignal>();
      for (const s of state.evolutionSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_ADAPTATION_MAX_SIGNALS);
      state = { ...state, evolutionSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTransformationFields(
      fields: EcosystemTransformationField[],
      now = Date.now()
    ): CivilizationAdaptationStoreState {
      const byId = new Map<string, EcosystemTransformationField>();
      for (const f of state.transformationFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_ADAPTATION_MAX_FIELDS);
      state = { ...state, transformationFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptationTopologies(
      topologies: SystemicAdaptationTopology[],
      now = Date.now()
    ): CivilizationAdaptationStoreState {
      const byId = new Map<string, SystemicAdaptationTopology>();
      for (const t of state.adaptationTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_ADAPTATION_MAX_TOPOLOGIES);
      state = { ...state, adaptationTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastEvolutionState(evolutionState: EvolutionState): void {
      state = { ...state, lastEvolutionState: evolutionState };
    },

    clear(): CivilizationAdaptationStoreState {
      state = {
        observations: [],
        snapshots: [],
        evolutionSignals: [],
        transformationFields: [],
        adaptationTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastEvolutionState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationAdaptationStore>
>();

export function getCivilizationAdaptationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationAdaptationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationAdaptationStores(): void {
  storesByOrganization.clear();
}
