import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_FRAGILITY_MAX_FIELDS,
  CIVILIZATION_FRAGILITY_MAX_OBSERVATIONS,
  CIVILIZATION_FRAGILITY_MAX_SIGNALS,
  CIVILIZATION_FRAGILITY_MAX_SNAPSHOTS,
  CIVILIZATION_FRAGILITY_MAX_TOPOLOGIES,
} from "./civilizationFragilityGuards";
import type {
  CascadingInstabilityObservation,
  CivilizationFragilitySnapshot,
  CivilizationFragilityStoreState,
  FragilityPropagationField,
  MacroResilienceSignal,
  ResilienceState,
  SystemicResilienceTopology,
} from "./civilizationFragilityTypes";

function mergeObservations(
  existing: CascadingInstabilityObservation,
  incoming: CascadingInstabilityObservation
): CascadingInstabilityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    propagationSignals: Object.freeze(
      Array.from(new Set([...existing.propagationSignals, ...incoming.propagationSignals])).slice(0, 6)
    ),
    resilienceRisks: Object.freeze(
      Array.from(new Set([...existing.resilienceRisks, ...incoming.resilienceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    resilienceState:
      incoming.confidence >= existing.confidence
        ? incoming.resilienceState
        : existing.resilienceState,
    propagationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.propagationStrength
        : existing.propagationStrength,
    fragilityCategory:
      incoming.confidence >= existing.confidence
        ? incoming.fragilityCategory
        : existing.fragilityCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly CascadingInstabilityObservation[];
}): string {
  return stableSignature([
    "d9-8-3-civilization-fragility",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.fragilityId),
  ]);
}

export function createCivilizationFragilityStore(initial?: CivilizationFragilityStoreState): {
  getState(): CivilizationFragilityStoreState;
  upsertObservations(
    observations: CascadingInstabilityObservation[],
    now?: number
  ): CivilizationFragilityStoreState;
  upsertSnapshots(
    snapshots: CivilizationFragilitySnapshot[],
    now?: number
  ): CivilizationFragilityStoreState;
  upsertResilienceSignals(
    signals: MacroResilienceSignal[],
    now?: number
  ): CivilizationFragilityStoreState;
  upsertPropagationFields(
    fields: FragilityPropagationField[],
    now?: number
  ): CivilizationFragilityStoreState;
  upsertResilienceTopologies(
    topologies: SystemicResilienceTopology[],
    now?: number
  ): CivilizationFragilityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastResilienceState(state: ResilienceState): void;
  clear(): CivilizationFragilityStoreState;
} {
  let state: CivilizationFragilityStoreState = initial ?? {
    observations: [],
    snapshots: [],
    resilienceSignals: [],
    propagationFields: [],
    resilienceTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastResilienceState: null,
  };

  return {
    getState(): CivilizationFragilityStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        resilienceSignals: state.resilienceSignals.map((s) => ({ ...s })),
        propagationFields: state.propagationFields.map((f) => ({ ...f })),
        resilienceTopologies: state.resilienceTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: CascadingInstabilityObservation[],
      now = Date.now()
    ): CivilizationFragilityStoreState {
      const byId = new Map<string, CascadingInstabilityObservation>();
      for (const o of state.observations) byId.set(o.fragilityId, o);
      for (const o of observations) {
        const existing = byId.get(o.fragilityId);
        byId.set(o.fragilityId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_FRAGILITY_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationFragilitySnapshot[],
      now = Date.now()
    ): CivilizationFragilityStoreState {
      const bySig = new Map<string, CivilizationFragilitySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_FRAGILITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceSignals(
      signals: MacroResilienceSignal[],
      now = Date.now()
    ): CivilizationFragilityStoreState {
      const byId = new Map<string, MacroResilienceSignal>();
      for (const s of state.resilienceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_FRAGILITY_MAX_SIGNALS);
      state = { ...state, resilienceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPropagationFields(
      fields: FragilityPropagationField[],
      now = Date.now()
    ): CivilizationFragilityStoreState {
      const byId = new Map<string, FragilityPropagationField>();
      for (const f of state.propagationFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_FRAGILITY_MAX_FIELDS);
      state = { ...state, propagationFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceTopologies(
      topologies: SystemicResilienceTopology[],
      now = Date.now()
    ): CivilizationFragilityStoreState {
      const byId = new Map<string, SystemicResilienceTopology>();
      for (const t of state.resilienceTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_FRAGILITY_MAX_TOPOLOGIES);
      state = { ...state, resilienceTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastResilienceState(resilienceState: ResilienceState): void {
      state = { ...state, lastResilienceState: resilienceState };
    },

    clear(): CivilizationFragilityStoreState {
      state = {
        observations: [],
        snapshots: [],
        resilienceSignals: [],
        propagationFields: [],
        resilienceTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastResilienceState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationFragilityStore>
>();

export function getCivilizationFragilityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationFragilityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationFragilityStores(): void {
  storesByOrganization.clear();
}
