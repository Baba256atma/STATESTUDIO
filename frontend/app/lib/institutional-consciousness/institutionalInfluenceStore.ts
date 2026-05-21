import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_INFLUENCE_MAX_FIELDS,
  INSTITUTIONAL_INFLUENCE_MAX_OBSERVATIONS,
  INSTITUTIONAL_INFLUENCE_MAX_SIGNALS,
  INSTITUTIONAL_INFLUENCE_MAX_SNAPSHOTS,
  INSTITUTIONAL_INFLUENCE_MAX_TOPOLOGIES,
} from "./institutionalInfluenceGuards";
import type {
  CivilizationImpactSignal,
  EcosystemImpactTopology,
  ImpactState,
  InstitutionalInfluenceSnapshot,
  InstitutionalInfluenceStoreState,
  MacroInfluenceObservation,
  OperationalInfluenceField,
} from "./institutionalInfluenceTypes";

function mergeObservations(
  existing: MacroInfluenceObservation,
  incoming: MacroInfluenceObservation
): MacroInfluenceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    influenceSignals: Object.freeze(
      Array.from(new Set([...existing.influenceSignals, ...incoming.influenceSignals])).slice(0, 6)
    ),
    impactRisks: Object.freeze(
      Array.from(new Set([...existing.impactRisks, ...incoming.impactRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    impactState:
      incoming.confidence >= existing.confidence ? incoming.impactState : existing.impactState,
    influenceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.influenceStrength
        : existing.influenceStrength,
    influenceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.influenceCategory
        : existing.influenceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly MacroInfluenceObservation[];
}): string {
  return stableSignature([
    "d9-8-4-institutional-influence",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.influenceId),
  ]);
}

export function createInstitutionalInfluenceStore(initial?: InstitutionalInfluenceStoreState): {
  getState(): InstitutionalInfluenceStoreState;
  upsertObservations(
    observations: MacroInfluenceObservation[],
    now?: number
  ): InstitutionalInfluenceStoreState;
  upsertSnapshots(
    snapshots: InstitutionalInfluenceSnapshot[],
    now?: number
  ): InstitutionalInfluenceStoreState;
  upsertImpactSignals(
    signals: CivilizationImpactSignal[],
    now?: number
  ): InstitutionalInfluenceStoreState;
  upsertInfluenceFields(
    fields: OperationalInfluenceField[],
    now?: number
  ): InstitutionalInfluenceStoreState;
  upsertImpactTopologies(
    topologies: EcosystemImpactTopology[],
    now?: number
  ): InstitutionalInfluenceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastImpactState(state: ImpactState): void;
  clear(): InstitutionalInfluenceStoreState;
} {
  let state: InstitutionalInfluenceStoreState = initial ?? {
    observations: [],
    snapshots: [],
    impactSignals: [],
    influenceFields: [],
    impactTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastImpactState: null,
  };

  return {
    getState(): InstitutionalInfluenceStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        impactSignals: state.impactSignals.map((s) => ({ ...s })),
        influenceFields: state.influenceFields.map((f) => ({ ...f })),
        impactTopologies: state.impactTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: MacroInfluenceObservation[],
      now = Date.now()
    ): InstitutionalInfluenceStoreState {
      const byId = new Map<string, MacroInfluenceObservation>();
      for (const o of state.observations) byId.set(o.influenceId, o);
      for (const o of observations) {
        const existing = byId.get(o.influenceId);
        byId.set(o.influenceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_INFLUENCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: InstitutionalInfluenceSnapshot[],
      now = Date.now()
    ): InstitutionalInfluenceStoreState {
      const bySig = new Map<string, InstitutionalInfluenceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_INFLUENCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertImpactSignals(
      signals: CivilizationImpactSignal[],
      now = Date.now()
    ): InstitutionalInfluenceStoreState {
      const byId = new Map<string, CivilizationImpactSignal>();
      for (const s of state.impactSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_INFLUENCE_MAX_SIGNALS);
      state = { ...state, impactSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInfluenceFields(
      fields: OperationalInfluenceField[],
      now = Date.now()
    ): InstitutionalInfluenceStoreState {
      const byId = new Map<string, OperationalInfluenceField>();
      for (const f of state.influenceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_INFLUENCE_MAX_FIELDS);
      state = { ...state, influenceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertImpactTopologies(
      topologies: EcosystemImpactTopology[],
      now = Date.now()
    ): InstitutionalInfluenceStoreState {
      const byId = new Map<string, EcosystemImpactTopology>();
      for (const t of state.impactTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_INFLUENCE_MAX_TOPOLOGIES);
      state = { ...state, impactTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastImpactState(impactState: ImpactState): void {
      state = { ...state, lastImpactState: impactState };
    },

    clear(): InstitutionalInfluenceStoreState {
      state = {
        observations: [],
        snapshots: [],
        impactSignals: [],
        influenceFields: [],
        impactTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastImpactState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalInfluenceStore>
>();

export function getInstitutionalInfluenceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalInfluenceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalInfluenceStores(): void {
  storesByOrganization.clear();
}
