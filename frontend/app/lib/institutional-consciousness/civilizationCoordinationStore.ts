import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CIVILIZATION_COORDINATION_MAX_FIELDS,
  CIVILIZATION_COORDINATION_MAX_OBSERVATIONS,
  CIVILIZATION_COORDINATION_MAX_SIGNALS,
  CIVILIZATION_COORDINATION_MAX_SNAPSHOTS,
  CIVILIZATION_COORDINATION_MAX_TOPOLOGIES,
} from "./civilizationCoordinationGuards";
import type {
  CivilizationCoordinationSnapshot,
  CivilizationCoordinationStoreState,
  CoordinationStabilityObservation,
  EcosystemAlignmentTopology,
  HarmonyState,
  InstitutionalHarmonySignal,
  MacroOperationalCoherenceField,
} from "./civilizationCoordinationTypes";

function mergeObservations(
  existing: CoordinationStabilityObservation,
  incoming: CoordinationStabilityObservation
): CoordinationStabilityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    coordinationSignals: Object.freeze(
      Array.from(new Set([...existing.coordinationSignals, ...incoming.coordinationSignals])).slice(
        0,
        6
      )
    ),
    coordinationRisks: Object.freeze(
      Array.from(new Set([...existing.coordinationRisks, ...incoming.coordinationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    harmonyState:
      incoming.confidence >= existing.confidence ? incoming.harmonyState : existing.harmonyState,
    coordinationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationStrength
        : existing.coordinationStrength,
    coordinationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationCategory
        : existing.coordinationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly CoordinationStabilityObservation[];
}): string {
  return stableSignature([
    "d9-8-7-civilization-coordination",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.coordinationId),
  ]);
}

export function createCivilizationCoordinationStore(initial?: CivilizationCoordinationStoreState): {
  getState(): CivilizationCoordinationStoreState;
  upsertObservations(
    observations: CoordinationStabilityObservation[],
    now?: number
  ): CivilizationCoordinationStoreState;
  upsertSnapshots(
    snapshots: CivilizationCoordinationSnapshot[],
    now?: number
  ): CivilizationCoordinationStoreState;
  upsertHarmonySignals(
    signals: InstitutionalHarmonySignal[],
    now?: number
  ): CivilizationCoordinationStoreState;
  upsertCoherenceFields(
    fields: MacroOperationalCoherenceField[],
    now?: number
  ): CivilizationCoordinationStoreState;
  upsertAlignmentTopologies(
    topologies: EcosystemAlignmentTopology[],
    now?: number
  ): CivilizationCoordinationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastHarmonyState(state: HarmonyState): void;
  clear(): CivilizationCoordinationStoreState;
} {
  let state: CivilizationCoordinationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    harmonySignals: [],
    coherenceFields: [],
    alignmentTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastHarmonyState: null,
  };

  return {
    getState(): CivilizationCoordinationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        harmonySignals: state.harmonySignals.map((s) => ({ ...s })),
        coherenceFields: state.coherenceFields.map((f) => ({ ...f })),
        alignmentTopologies: state.alignmentTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: CoordinationStabilityObservation[],
      now = Date.now()
    ): CivilizationCoordinationStoreState {
      const byId = new Map<string, CoordinationStabilityObservation>();
      for (const o of state.observations) byId.set(o.coordinationId, o);
      for (const o of observations) {
        const existing = byId.get(o.coordinationId);
        byId.set(o.coordinationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CIVILIZATION_COORDINATION_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CivilizationCoordinationSnapshot[],
      now = Date.now()
    ): CivilizationCoordinationStoreState {
      const bySig = new Map<string, CivilizationCoordinationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_COORDINATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertHarmonySignals(
      signals: InstitutionalHarmonySignal[],
      now = Date.now()
    ): CivilizationCoordinationStoreState {
      const byId = new Map<string, InstitutionalHarmonySignal>();
      for (const s of state.harmonySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_COORDINATION_MAX_SIGNALS);
      state = { ...state, harmonySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCoherenceFields(
      fields: MacroOperationalCoherenceField[],
      now = Date.now()
    ): CivilizationCoordinationStoreState {
      const byId = new Map<string, MacroOperationalCoherenceField>();
      for (const f of state.coherenceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_COORDINATION_MAX_FIELDS);
      state = { ...state, coherenceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlignmentTopologies(
      topologies: EcosystemAlignmentTopology[],
      now = Date.now()
    ): CivilizationCoordinationStoreState {
      const byId = new Map<string, EcosystemAlignmentTopology>();
      for (const t of state.alignmentTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CIVILIZATION_COORDINATION_MAX_TOPOLOGIES);
      state = { ...state, alignmentTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastHarmonyState(harmonyState: HarmonyState): void {
      state = { ...state, lastHarmonyState: harmonyState };
    },

    clear(): CivilizationCoordinationStoreState {
      state = {
        observations: [],
        snapshots: [],
        harmonySignals: [],
        coherenceFields: [],
        alignmentTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastHarmonyState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createCivilizationCoordinationStore>
>();

export function getCivilizationCoordinationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCivilizationCoordinationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCivilizationCoordinationStores(): void {
  storesByOrganization.clear();
}
