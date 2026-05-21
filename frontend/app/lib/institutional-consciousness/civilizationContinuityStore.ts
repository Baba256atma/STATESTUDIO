import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_CONTINUITY_MAX_FIELDS,
  CIVILIZATION_CONTINUITY_MAX_OBSERVATIONS,
  CIVILIZATION_CONTINUITY_MAX_SIGNALS,
  CIVILIZATION_CONTINUITY_MAX_SNAPSHOTS,
  CIVILIZATION_CONTINUITY_MAX_TOPOLOGIES,
} from "./civilizationContinuityGuards";
import type {
  CivilizationContinuitySnapshot,
  CivilizationContinuityStoreState,
  EcosystemSurvivabilityObservation,
  LongHorizonResilienceField,
  MacroSustainabilitySignal,
  OperationalContinuityTopology,
  SustainabilityState,
} from "./civilizationContinuityTypes";

function mergeObservations(
  existing: EcosystemSurvivabilityObservation,
  incoming: EcosystemSurvivabilityObservation
): EcosystemSurvivabilityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    continuitySignals: Object.freeze(
      Array.from(new Set([...existing.continuitySignals, ...incoming.continuitySignals])).slice(0, 6)
    ),
    sustainabilityRisks: Object.freeze(
      Array.from(new Set([...existing.sustainabilityRisks, ...incoming.sustainabilityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    sustainabilityState:
      incoming.confidence >= existing.confidence
        ? incoming.sustainabilityState
        : existing.sustainabilityState,
    continuityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.continuityStrength
        : existing.continuityStrength,
    continuityCategory:
      incoming.confidence >= existing.confidence
        ? incoming.continuityCategory
        : existing.continuityCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly EcosystemSurvivabilityObservation[];
}): string {
  return stableSignature([
    "d9-8-5-civilization-continuity",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.continuityId),
  ]);
}

export function createCivilizationContinuityStore(initial?: CivilizationContinuityStoreState): {
  getState(): CivilizationContinuityStoreState;
  upsertObservations(
    observations: EcosystemSurvivabilityObservation[],
    now?: number
  ): CivilizationContinuityStoreState;
  upsertSnapshots(
    snapshots: CivilizationContinuitySnapshot[],
    now?: number
  ): CivilizationContinuityStoreState;
  upsertSustainabilitySignals(
    signals: MacroSustainabilitySignal[],
    now?: number
  ): CivilizationContinuityStoreState;
  upsertResilienceFields(
    fields: LongHorizonResilienceField[],
    now?: number
  ): CivilizationContinuityStoreState;
  upsertContinuityTopologies(
    topologies: OperationalContinuityTopology[],
    now?: number
  ): CivilizationContinuityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastSustainabilityState(state: SustainabilityState): void;
  clear(): CivilizationContinuityStoreState;
} {
  let state: CivilizationContinuityStoreState = initial ?? {
    observations: [],
    snapshots: [],
    sustainabilitySignals: [],
    resilienceFields: [],
    continuityTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastSustainabilityState: null,
  };

  return {
    getState(): CivilizationContinuityStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        sustainabilitySignals: state.sustainabilitySignals.map((s) => ({ ...s })),
        resilienceFields: state.resilienceFields.map((f) => ({ ...f })),
        continuityTopologies: state.continuityTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: EcosystemSurvivabilityObservation[],
      now = Date.now()
    ): CivilizationContinuityStoreState {
      const byId = new Map<string, EcosystemSurvivabilityObservation>();
      for (const o of state.observations) byId.set(o.continuityId, o);
      for (const o of observations) {
        const existing = byId.get(o.continuityId);
        byId.set(o.continuityId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_CONTINUITY_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationContinuitySnapshot[],
      now = Date.now()
    ): CivilizationContinuityStoreState {
      const bySig = new Map<string, CivilizationContinuitySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_CONTINUITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSustainabilitySignals(
      signals: MacroSustainabilitySignal[],
      now = Date.now()
    ): CivilizationContinuityStoreState {
      const byId = new Map<string, MacroSustainabilitySignal>();
      for (const s of state.sustainabilitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_CONTINUITY_MAX_SIGNALS);
      state = { ...state, sustainabilitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceFields(
      fields: LongHorizonResilienceField[],
      now = Date.now()
    ): CivilizationContinuityStoreState {
      const byId = new Map<string, LongHorizonResilienceField>();
      for (const f of state.resilienceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_CONTINUITY_MAX_FIELDS);
      state = { ...state, resilienceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertContinuityTopologies(
      topologies: OperationalContinuityTopology[],
      now = Date.now()
    ): CivilizationContinuityStoreState {
      const byId = new Map<string, OperationalContinuityTopology>();
      for (const t of state.continuityTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_CONTINUITY_MAX_TOPOLOGIES);
      state = { ...state, continuityTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastSustainabilityState(sustainabilityState: SustainabilityState): void {
      state = { ...state, lastSustainabilityState: sustainabilityState };
    },

    clear(): CivilizationContinuityStoreState {
      state = {
        observations: [],
        snapshots: [],
        sustainabilitySignals: [],
        resilienceFields: [],
        continuityTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastSustainabilityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationContinuityStore>
>();

export function getCivilizationContinuityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationContinuityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationContinuityStores(): void {
  storesByOrganization.clear();
}
