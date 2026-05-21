import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_WISDOM_MAX_FIELDS,
  CIVILIZATION_WISDOM_MAX_OBSERVATIONS,
  CIVILIZATION_WISDOM_MAX_SIGNALS,
  CIVILIZATION_WISDOM_MAX_SNAPSHOTS,
  CIVILIZATION_WISDOM_MAX_TOPOLOGIES,
} from "./civilizationWisdomGuards";
import type {
  CivilizationWisdomSnapshot,
  CivilizationWisdomStoreState,
  InstitutionalLearningConvergenceSignal,
  LearningConvergenceState,
  LongHorizonWisdomObservation,
  MacroWisdomField,
  StrategicExperienceTopology,
} from "./civilizationWisdomTypes";

function mergeObservations(
  existing: LongHorizonWisdomObservation,
  incoming: LongHorizonWisdomObservation
): LongHorizonWisdomObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    wisdomSignals: Object.freeze(
      Array.from(new Set([...existing.wisdomSignals, ...incoming.wisdomSignals])).slice(0, 6)
    ),
    wisdomRisks: Object.freeze(
      Array.from(new Set([...existing.wisdomRisks, ...incoming.wisdomRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    convergenceState:
      incoming.confidence >= existing.confidence ? incoming.convergenceState : existing.convergenceState,
    wisdomStrength:
      incoming.confidence >= existing.confidence ? incoming.wisdomStrength : existing.wisdomStrength,
    wisdomCategory:
      incoming.confidence >= existing.confidence ? incoming.wisdomCategory : existing.wisdomCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly LongHorizonWisdomObservation[];
}): string {
  return stableSignature([
    "d9-8-8-civilization-wisdom",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.wisdomId),
  ]);
}

export function createCivilizationWisdomStore(initial?: CivilizationWisdomStoreState): {
  getState(): CivilizationWisdomStoreState;
  upsertObservations(
    observations: LongHorizonWisdomObservation[],
    now?: number
  ): CivilizationWisdomStoreState;
  upsertSnapshots(
    snapshots: CivilizationWisdomSnapshot[],
    now?: number
  ): CivilizationWisdomStoreState;
  upsertConvergenceSignals(
    signals: InstitutionalLearningConvergenceSignal[],
    now?: number
  ): CivilizationWisdomStoreState;
  upsertWisdomFields(fields: MacroWisdomField[], now?: number): CivilizationWisdomStoreState;
  upsertExperienceTopologies(
    topologies: StrategicExperienceTopology[],
    now?: number
  ): CivilizationWisdomStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastConvergenceState(state: LearningConvergenceState): void;
  clear(): CivilizationWisdomStoreState;
} {
  let state: CivilizationWisdomStoreState = initial ?? {
    observations: [],
    snapshots: [],
    convergenceSignals: [],
    wisdomFields: [],
    experienceTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastConvergenceState: null,
  };

  return {
    getState(): CivilizationWisdomStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        convergenceSignals: state.convergenceSignals.map((s) => ({ ...s })),
        wisdomFields: state.wisdomFields.map((f) => ({ ...f })),
        experienceTopologies: state.experienceTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: LongHorizonWisdomObservation[],
      now = Date.now()
    ): CivilizationWisdomStoreState {
      const byId = new Map<string, LongHorizonWisdomObservation>();
      for (const o of state.observations) byId.set(o.wisdomId, o);
      for (const o of observations) {
        const existing = byId.get(o.wisdomId);
        byId.set(o.wisdomId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_WISDOM_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationWisdomSnapshot[],
      now = Date.now()
    ): CivilizationWisdomStoreState {
      const bySig = new Map<string, CivilizationWisdomSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_WISDOM_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConvergenceSignals(
      signals: InstitutionalLearningConvergenceSignal[],
      now = Date.now()
    ): CivilizationWisdomStoreState {
      const byId = new Map<string, InstitutionalLearningConvergenceSignal>();
      for (const s of state.convergenceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_WISDOM_MAX_SIGNALS);
      state = { ...state, convergenceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertWisdomFields(fields: MacroWisdomField[], now = Date.now()): CivilizationWisdomStoreState {
      const byId = new Map<string, MacroWisdomField>();
      for (const f of state.wisdomFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_WISDOM_MAX_FIELDS);
      state = { ...state, wisdomFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertExperienceTopologies(
      topologies: StrategicExperienceTopology[],
      now = Date.now()
    ): CivilizationWisdomStoreState {
      const byId = new Map<string, StrategicExperienceTopology>();
      for (const t of state.experienceTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_WISDOM_MAX_TOPOLOGIES);
      state = { ...state, experienceTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastConvergenceState(convergenceState: LearningConvergenceState): void {
      state = { ...state, lastConvergenceState: convergenceState };
    },

    clear(): CivilizationWisdomStoreState {
      state = {
        observations: [],
        snapshots: [],
        convergenceSignals: [],
        wisdomFields: [],
        experienceTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastConvergenceState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationWisdomStore>
>();

export function getCivilizationWisdomStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationWisdomStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationWisdomStores(): void {
  storesByOrganization.clear();
}
