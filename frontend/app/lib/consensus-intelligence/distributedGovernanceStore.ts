import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DISTRIBUTED_GOVERNANCE_MAX_COHERENCE,
  DISTRIBUTED_GOVERNANCE_MAX_INDICATORS,
  DISTRIBUTED_GOVERNANCE_MAX_OBSERVATIONS,
  DISTRIBUTED_GOVERNANCE_MAX_SIGNALS,
  DISTRIBUTED_GOVERNANCE_MAX_SNAPSHOTS,
} from "./distributedGovernanceGuards";
import type {
  CollaborativeIntegrityObservation,
  CollectiveIntegritySignal,
  DistributedGovernanceStoreState,
  DistributedGovernanceIndicator,
  DistributedStrategicGovernanceSnapshot,
  EnterpriseCoherenceField,
  GovernanceState,
} from "./distributedGovernanceTypes";

function mergeObservations(
  existing: CollaborativeIntegrityObservation,
  incoming: CollaborativeIntegrityObservation
): CollaborativeIntegrityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    governanceSignals: Object.freeze(
      Array.from(new Set([...existing.governanceSignals, ...incoming.governanceSignals])).slice(0, 6)
    ),
    integrityRisks: Object.freeze(
      Array.from(new Set([...existing.integrityRisks, ...incoming.integrityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    governanceState:
      incoming.confidence >= existing.confidence ? incoming.governanceState : existing.governanceState,
    integrityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.integrityStrength
        : existing.integrityStrength,
    governanceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.governanceCategory
        : existing.governanceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly CollaborativeIntegrityObservation[];
}): string {
  return stableSignature([
    "d9-7-9-distributed-governance",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.governanceId),
  ]);
}

export function createDistributedGovernanceStore(initial?: DistributedGovernanceStoreState): {
  getState(): DistributedGovernanceStoreState;
  upsertObservations(
    observations: CollaborativeIntegrityObservation[],
    now?: number
  ): DistributedGovernanceStoreState;
  upsertSnapshots(
    snapshots: DistributedStrategicGovernanceSnapshot[],
    now?: number
  ): DistributedGovernanceStoreState;
  upsertIntegritySignals(
    signals: CollectiveIntegritySignal[],
    now?: number
  ): DistributedGovernanceStoreState;
  upsertGovernanceIndicators(
    indicators: DistributedGovernanceIndicator[],
    now?: number
  ): DistributedGovernanceStoreState;
  upsertCoherenceFields(
    fields: EnterpriseCoherenceField[],
    now?: number
  ): DistributedGovernanceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastGovernanceState(state: GovernanceState): void;
  clear(): DistributedGovernanceStoreState;
} {
  let state: DistributedGovernanceStoreState = initial ?? {
    observations: [],
    snapshots: [],
    integritySignals: [],
    governanceIndicators: [],
    coherenceFields: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastGovernanceState: null,
  };

  return {
    getState(): DistributedGovernanceStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        integritySignals: state.integritySignals.map((s) => ({ ...s })),
        governanceIndicators: state.governanceIndicators.map((i) => ({ ...i })),
        coherenceFields: state.coherenceFields.map((f) => ({ ...f })),
      };
    },

    upsertObservations(
      observations: CollaborativeIntegrityObservation[],
      now = Date.now()
    ): DistributedGovernanceStoreState {
      const byId = new Map<string, CollaborativeIntegrityObservation>();
      for (const o of state.observations) byId.set(o.governanceId, o);
      for (const o of observations) {
        const existing = byId.get(o.governanceId);
        byId.set(o.governanceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DISTRIBUTED_GOVERNANCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: DistributedStrategicGovernanceSnapshot[],
      now = Date.now()
    ): DistributedGovernanceStoreState {
      const bySig = new Map<string, DistributedStrategicGovernanceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_GOVERNANCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertIntegritySignals(
      signals: CollectiveIntegritySignal[],
      now = Date.now()
    ): DistributedGovernanceStoreState {
      const byId = new Map<string, CollectiveIntegritySignal>();
      for (const s of state.integritySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_GOVERNANCE_MAX_SIGNALS);
      state = { ...state, integritySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGovernanceIndicators(
      indicators: DistributedGovernanceIndicator[],
      now = Date.now()
    ): DistributedGovernanceStoreState {
      const byId = new Map<string, DistributedGovernanceIndicator>();
      for (const i of state.governanceIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_GOVERNANCE_MAX_INDICATORS);
      state = { ...state, governanceIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCoherenceFields(
      fields: EnterpriseCoherenceField[],
      now = Date.now()
    ): DistributedGovernanceStoreState {
      const byId = new Map<string, EnterpriseCoherenceField>();
      for (const f of state.coherenceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_GOVERNANCE_MAX_COHERENCE);
      state = { ...state, coherenceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastGovernanceState(governanceState: GovernanceState): void {
      state = { ...state, lastGovernanceState: governanceState };
    },

    clear(): DistributedGovernanceStoreState {
      state = {
        observations: [],
        snapshots: [],
        integritySignals: [],
        governanceIndicators: [],
        coherenceFields: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastGovernanceState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDistributedGovernanceStore>>();

export function getDistributedGovernanceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDistributedGovernanceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDistributedGovernanceStores(): void {
  storesByOrganization.clear();
}
