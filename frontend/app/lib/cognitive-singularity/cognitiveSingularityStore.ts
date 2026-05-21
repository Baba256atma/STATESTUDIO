import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_SINGULARITY_MAX_FIELDS,
  COGNITIVE_SINGULARITY_MAX_OBSERVATIONS,
  COGNITIVE_SINGULARITY_MAX_SIGNALS,
  COGNITIVE_SINGULARITY_MAX_SNAPSHOTS,
  COGNITIVE_SINGULARITY_MAX_TOPOLOGIES,
} from "./cognitiveSingularityGuards";
import type {
  CognitiveSingularityStoreState,
  CognitionState,
  CrossDomainAwarenessTopology,
  EnterpriseCognitiveSingularitySnapshot,
  IntelligenceConvergenceObservation,
  StrategicIntelligenceConvergenceSignal,
  UnifiedCognitionField,
} from "./cognitiveSingularityTypes";

function mergeObservations(
  existing: IntelligenceConvergenceObservation,
  incoming: IntelligenceConvergenceObservation
): IntelligenceConvergenceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    convergenceSignals: Object.freeze(
      Array.from(new Set([...existing.convergenceSignals, ...incoming.convergenceSignals])).slice(
        0,
        6
      )
    ),
    convergenceRisks: Object.freeze(
      Array.from(new Set([...existing.convergenceRisks, ...incoming.convergenceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    cognitionState:
      incoming.confidence >= existing.confidence ? incoming.cognitionState : existing.cognitionState,
    convergenceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.convergenceStrength
        : existing.convergenceStrength,
    convergenceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.convergenceCategory
        : existing.convergenceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly IntelligenceConvergenceObservation[];
}): string {
  return stableSignature([
    "d9-9-1-cognitive-singularity",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.convergenceId),
  ]);
}

export function createCognitiveSingularityStore(initial?: CognitiveSingularityStoreState): {
  getState(): CognitiveSingularityStoreState;
  upsertObservations(
    observations: IntelligenceConvergenceObservation[],
    now?: number
  ): CognitiveSingularityStoreState;
  upsertSnapshots(
    snapshots: EnterpriseCognitiveSingularitySnapshot[],
    now?: number
  ): CognitiveSingularityStoreState;
  upsertConvergenceSignals(
    signals: StrategicIntelligenceConvergenceSignal[],
    now?: number
  ): CognitiveSingularityStoreState;
  upsertCognitionFields(fields: UnifiedCognitionField[], now?: number): CognitiveSingularityStoreState;
  upsertAwarenessTopologies(
    topologies: CrossDomainAwarenessTopology[],
    now?: number
  ): CognitiveSingularityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCognitionState(state: CognitionState): void;
  clear(): CognitiveSingularityStoreState;
} {
  let state: CognitiveSingularityStoreState = initial ?? {
    observations: [],
    snapshots: [],
    convergenceSignals: [],
    cognitionFields: [],
    awarenessTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCognitionState: null,
  };

  return {
    getState(): CognitiveSingularityStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        convergenceSignals: state.convergenceSignals.map((s) => ({ ...s })),
        cognitionFields: state.cognitionFields.map((f) => ({ ...f })),
        awarenessTopologies: state.awarenessTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: IntelligenceConvergenceObservation[],
      now = Date.now()
    ): CognitiveSingularityStoreState {
      const byId = new Map<string, IntelligenceConvergenceObservation>();
      for (const o of state.observations) byId.set(o.convergenceId, o);
      for (const o of observations) {
        const existing = byId.get(o.convergenceId);
        byId.set(o.convergenceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_SINGULARITY_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseCognitiveSingularitySnapshot[],
      now = Date.now()
    ): CognitiveSingularityStoreState {
      const bySig = new Map<string, EnterpriseCognitiveSingularitySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_SINGULARITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConvergenceSignals(
      signals: StrategicIntelligenceConvergenceSignal[],
      now = Date.now()
    ): CognitiveSingularityStoreState {
      const byId = new Map<string, StrategicIntelligenceConvergenceSignal>();
      for (const s of state.convergenceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_SINGULARITY_MAX_SIGNALS);
      state = { ...state, convergenceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCognitionFields(fields: UnifiedCognitionField[], now = Date.now()): CognitiveSingularityStoreState {
      const byId = new Map<string, UnifiedCognitionField>();
      for (const f of state.cognitionFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_SINGULARITY_MAX_FIELDS);
      state = { ...state, cognitionFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAwarenessTopologies(
      topologies: CrossDomainAwarenessTopology[],
      now = Date.now()
    ): CognitiveSingularityStoreState {
      const byId = new Map<string, CrossDomainAwarenessTopology>();
      for (const t of state.awarenessTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_SINGULARITY_MAX_TOPOLOGIES);
      state = { ...state, awarenessTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCognitionState(cognitionState: CognitionState): void {
      state = { ...state, lastCognitionState: cognitionState };
    },

    clear(): CognitiveSingularityStoreState {
      state = {
        observations: [],
        snapshots: [],
        convergenceSignals: [],
        cognitionFields: [],
        awarenessTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCognitionState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveSingularityStore>>();

export function getCognitiveSingularityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveSingularityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveSingularityStores(): void {
  storesByOrganization.clear();
}
