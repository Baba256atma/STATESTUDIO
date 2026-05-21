import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ECOSYSTEM_SYNC_MAX_FIELDS,
  ECOSYSTEM_SYNC_MAX_OBSERVATIONS,
  ECOSYSTEM_SYNC_MAX_SIGNALS,
  ECOSYSTEM_SYNC_MAX_SNAPSHOTS,
  ECOSYSTEM_SYNC_MAX_TOPOLOGIES,
} from "./ecosystemSynchronizationGuards";
import type {
  CivilizationScaleCoordinationField,
  CoordinationState,
  EcosystemSynchronizationSnapshot,
  EcosystemSynchronizationStoreState,
  InstitutionalInterdependencySignal,
  MacroDependencyTopology,
  OperationalSynchronizationObservation,
} from "./ecosystemSynchronizationTypes";

function mergeObservations(
  existing: OperationalSynchronizationObservation,
  incoming: OperationalSynchronizationObservation
): OperationalSynchronizationObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    synchronizationSignals: Object.freeze(
      Array.from(new Set([...existing.synchronizationSignals, ...incoming.synchronizationSignals])).slice(
        0,
        6
      )
    ),
    ecosystemRisks: Object.freeze(
      Array.from(new Set([...existing.ecosystemRisks, ...incoming.ecosystemRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    coordinationState:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationState
        : existing.coordinationState,
    synchronizationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.synchronizationStrength
        : existing.synchronizationStrength,
    synchronizationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.synchronizationCategory
        : existing.synchronizationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly OperationalSynchronizationObservation[];
}): string {
  return stableSignature([
    "d9-8-2-ecosystem-synchronization",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.synchronizationId),
  ]);
}

export function createEcosystemSynchronizationStore(initial?: EcosystemSynchronizationStoreState): {
  getState(): EcosystemSynchronizationStoreState;
  upsertObservations(
    observations: OperationalSynchronizationObservation[],
    now?: number
  ): EcosystemSynchronizationStoreState;
  upsertSnapshots(
    snapshots: EcosystemSynchronizationSnapshot[],
    now?: number
  ): EcosystemSynchronizationStoreState;
  upsertInterdependencySignals(
    signals: InstitutionalInterdependencySignal[],
    now?: number
  ): EcosystemSynchronizationStoreState;
  upsertCoordinationFields(
    fields: CivilizationScaleCoordinationField[],
    now?: number
  ): EcosystemSynchronizationStoreState;
  upsertDependencyTopologies(
    topologies: MacroDependencyTopology[],
    now?: number
  ): EcosystemSynchronizationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCoordinationState(state: CoordinationState): void;
  clear(): EcosystemSynchronizationStoreState;
} {
  let state: EcosystemSynchronizationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    interdependencySignals: [],
    coordinationFields: [],
    dependencyTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCoordinationState: null,
  };

  return {
    getState(): EcosystemSynchronizationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        interdependencySignals: state.interdependencySignals.map((s) => ({ ...s })),
        coordinationFields: state.coordinationFields.map((f) => ({ ...f })),
        dependencyTopologies: state.dependencyTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: OperationalSynchronizationObservation[],
      now = Date.now()
    ): EcosystemSynchronizationStoreState {
      const byId = new Map<string, OperationalSynchronizationObservation>();
      for (const o of state.observations) byId.set(o.synchronizationId, o);
      for (const o of observations) {
        const existing = byId.get(o.synchronizationId);
        byId.set(o.synchronizationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ECOSYSTEM_SYNC_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EcosystemSynchronizationSnapshot[],
      now = Date.now()
    ): EcosystemSynchronizationStoreState {
      const bySig = new Map<string, EcosystemSynchronizationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ECOSYSTEM_SYNC_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInterdependencySignals(
      signals: InstitutionalInterdependencySignal[],
      now = Date.now()
    ): EcosystemSynchronizationStoreState {
      const byId = new Map<string, InstitutionalInterdependencySignal>();
      for (const s of state.interdependencySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ECOSYSTEM_SYNC_MAX_SIGNALS);
      state = { ...state, interdependencySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCoordinationFields(
      fields: CivilizationScaleCoordinationField[],
      now = Date.now()
    ): EcosystemSynchronizationStoreState {
      const byId = new Map<string, CivilizationScaleCoordinationField>();
      for (const f of state.coordinationFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ECOSYSTEM_SYNC_MAX_FIELDS);
      state = { ...state, coordinationFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDependencyTopologies(
      topologies: MacroDependencyTopology[],
      now = Date.now()
    ): EcosystemSynchronizationStoreState {
      const byId = new Map<string, MacroDependencyTopology>();
      for (const t of state.dependencyTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ECOSYSTEM_SYNC_MAX_TOPOLOGIES);
      state = { ...state, dependencyTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCoordinationState(coordinationState: CoordinationState): void {
      state = { ...state, lastCoordinationState: coordinationState };
    },

    clear(): EcosystemSynchronizationStoreState {
      state = {
        observations: [],
        snapshots: [],
        interdependencySignals: [],
        coordinationFields: [],
        dependencyTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCoordinationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createEcosystemSynchronizationStore>
>();

export function getEcosystemSynchronizationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createEcosystemSynchronizationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetEcosystemSynchronizationStores(): void {
  storesByOrganization.clear();
}
