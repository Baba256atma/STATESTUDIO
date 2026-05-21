import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_STEWARDSHIP_MAX_FIELDS,
  CIVILIZATION_STEWARDSHIP_MAX_OBSERVATIONS,
  CIVILIZATION_STEWARDSHIP_MAX_SIGNALS,
  CIVILIZATION_STEWARDSHIP_MAX_SNAPSHOTS,
  CIVILIZATION_STEWARDSHIP_MAX_TOPOLOGIES,
} from "./civilizationStewardshipGuards";
import type {
  CivilizationStewardshipSnapshot,
  CivilizationStewardshipStoreState,
  EcosystemSurvivabilityField,
  InstitutionalPreservationTopology,
  LongHorizonStewardshipObservation,
  MacroPreservationSignal,
  PreservationState,
} from "./civilizationStewardshipTypes";

function mergeObservations(
  existing: LongHorizonStewardshipObservation,
  incoming: LongHorizonStewardshipObservation
): LongHorizonStewardshipObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    stewardshipSignals: Object.freeze(
      Array.from(new Set([...existing.stewardshipSignals, ...incoming.stewardshipSignals])).slice(
        0,
        6
      )
    ),
    preservationRisks: Object.freeze(
      Array.from(new Set([...existing.preservationRisks, ...incoming.preservationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    preservationState:
      incoming.confidence >= existing.confidence
        ? incoming.preservationState
        : existing.preservationState,
    stewardshipStrength:
      incoming.confidence >= existing.confidence
        ? incoming.stewardshipStrength
        : existing.stewardshipStrength,
    stewardshipCategory:
      incoming.confidence >= existing.confidence
        ? incoming.stewardshipCategory
        : existing.stewardshipCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly LongHorizonStewardshipObservation[];
}): string {
  return stableSignature([
    "d9-8-9-civilization-stewardship",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.stewardshipId),
  ]);
}

export function createCivilizationStewardshipStore(initial?: CivilizationStewardshipStoreState): {
  getState(): CivilizationStewardshipStoreState;
  upsertObservations(
    observations: LongHorizonStewardshipObservation[],
    now?: number
  ): CivilizationStewardshipStoreState;
  upsertSnapshots(
    snapshots: CivilizationStewardshipSnapshot[],
    now?: number
  ): CivilizationStewardshipStoreState;
  upsertPreservationSignals(
    signals: MacroPreservationSignal[],
    now?: number
  ): CivilizationStewardshipStoreState;
  upsertSurvivabilityFields(
    fields: EcosystemSurvivabilityField[],
    now?: number
  ): CivilizationStewardshipStoreState;
  upsertPreservationTopologies(
    topologies: InstitutionalPreservationTopology[],
    now?: number
  ): CivilizationStewardshipStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastPreservationState(state: PreservationState): void;
  clear(): CivilizationStewardshipStoreState;
} {
  let state: CivilizationStewardshipStoreState = initial ?? {
    observations: [],
    snapshots: [],
    preservationSignals: [],
    survivabilityFields: [],
    preservationTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastPreservationState: null,
  };

  return {
    getState(): CivilizationStewardshipStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        preservationSignals: state.preservationSignals.map((s) => ({ ...s })),
        survivabilityFields: state.survivabilityFields.map((f) => ({ ...f })),
        preservationTopologies: state.preservationTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: LongHorizonStewardshipObservation[],
      now = Date.now()
    ): CivilizationStewardshipStoreState {
      const byId = new Map<string, LongHorizonStewardshipObservation>();
      for (const o of state.observations) byId.set(o.stewardshipId, o);
      for (const o of observations) {
        const existing = byId.get(o.stewardshipId);
        byId.set(o.stewardshipId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_STEWARDSHIP_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationStewardshipSnapshot[],
      now = Date.now()
    ): CivilizationStewardshipStoreState {
      const bySig = new Map<string, CivilizationStewardshipSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_STEWARDSHIP_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPreservationSignals(
      signals: MacroPreservationSignal[],
      now = Date.now()
    ): CivilizationStewardshipStoreState {
      const byId = new Map<string, MacroPreservationSignal>();
      for (const s of state.preservationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_STEWARDSHIP_MAX_SIGNALS);
      state = { ...state, preservationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSurvivabilityFields(
      fields: EcosystemSurvivabilityField[],
      now = Date.now()
    ): CivilizationStewardshipStoreState {
      const byId = new Map<string, EcosystemSurvivabilityField>();
      for (const f of state.survivabilityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_STEWARDSHIP_MAX_FIELDS);
      state = { ...state, survivabilityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPreservationTopologies(
      topologies: InstitutionalPreservationTopology[],
      now = Date.now()
    ): CivilizationStewardshipStoreState {
      const byId = new Map<string, InstitutionalPreservationTopology>();
      for (const t of state.preservationTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_STEWARDSHIP_MAX_TOPOLOGIES);
      state = { ...state, preservationTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastPreservationState(preservationState: PreservationState): void {
      state = { ...state, lastPreservationState: preservationState };
    },

    clear(): CivilizationStewardshipStoreState {
      state = {
        observations: [],
        snapshots: [],
        preservationSignals: [],
        survivabilityFields: [],
        preservationTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastPreservationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationStewardshipStore>
>();

export function getCivilizationStewardshipStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationStewardshipStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationStewardshipStores(): void {
  storesByOrganization.clear();
}
