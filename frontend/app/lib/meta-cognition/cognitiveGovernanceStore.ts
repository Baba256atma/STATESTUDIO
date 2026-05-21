import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_GOVERNANCE_MAX_INDICATORS,
  COGNITIVE_GOVERNANCE_MAX_INTEGRITY_FIELDS,
  COGNITIVE_GOVERNANCE_MAX_OBSERVATIONS,
  COGNITIVE_GOVERNANCE_MAX_SIGNALS,
  COGNITIVE_GOVERNANCE_MAX_SNAPSHOTS,
} from "./cognitiveGovernanceGuards";
import type {
  CognitiveConstraintObservation,
  CognitiveGovernanceStoreState,
  EnterpriseSelfRegulationSignal,
  ExecutiveCognitiveGovernanceSnapshot,
  GovernanceIntegrityField,
  RegulationState,
  StrategicBoundaryIndicator,
} from "./cognitiveGovernanceTypes";

function mergeObservations(
  existing: CognitiveConstraintObservation,
  incoming: CognitiveConstraintObservation
): CognitiveConstraintObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    governanceSignals: Object.freeze(
      Array.from(new Set([...existing.governanceSignals, ...incoming.governanceSignals])).slice(0, 6)
    ),
    governanceRisks: Object.freeze(
      Array.from(new Set([...existing.governanceRisks, ...incoming.governanceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    regulationState:
      incoming.confidence >= existing.confidence
        ? incoming.regulationState
        : existing.regulationState,
    governanceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.governanceStrength
        : existing.governanceStrength,
    governanceCategory:
      incoming.confidence >= existing.confidence
        ? incoming.governanceCategory
        : existing.governanceCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  constraintObservations: readonly CognitiveConstraintObservation[];
}): string {
  return stableSignature([
    "d9-6-9-cognitive-governance",
    state.constraintObservations.length,
    state.constraintObservations.slice(0, 3).map((o) => o.governanceId),
  ]);
}

export function createCognitiveGovernanceStore(initial?: CognitiveGovernanceStoreState): {
  getState(): CognitiveGovernanceStoreState;
  upsertConstraintObservations(
    observations: CognitiveConstraintObservation[],
    now?: number
  ): CognitiveGovernanceStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCognitiveGovernanceSnapshot[],
    now?: number
  ): CognitiveGovernanceStoreState;
  upsertSelfRegulationSignals(
    signals: EnterpriseSelfRegulationSignal[],
    now?: number
  ): CognitiveGovernanceStoreState;
  upsertBoundaryIndicators(
    indicators: StrategicBoundaryIndicator[],
    now?: number
  ): CognitiveGovernanceStoreState;
  upsertGovernanceIntegrityFields(
    fields: GovernanceIntegrityField[],
    now?: number
  ): CognitiveGovernanceStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastRegulationState(state: RegulationState): void;
  clear(): CognitiveGovernanceStoreState;
} {
  let state: CognitiveGovernanceStoreState = initial ?? {
    constraintObservations: [],
    snapshots: [],
    selfRegulationSignals: [],
    boundaryIndicators: [],
    governanceIntegrityFields: [],
    signature: buildStoreSignature({ constraintObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRegulationState: null,
  };

  return {
    getState(): CognitiveGovernanceStoreState {
      return {
        ...state,
        constraintObservations: state.constraintObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        selfRegulationSignals: state.selfRegulationSignals.map((s) => ({ ...s })),
        boundaryIndicators: state.boundaryIndicators.map((i) => ({ ...i })),
        governanceIntegrityFields: state.governanceIntegrityFields.map((f) => ({ ...f })),
      };
    },

    upsertConstraintObservations(
      observations: CognitiveConstraintObservation[],
      now = Date.now()
    ): CognitiveGovernanceStoreState {
      const byId = new Map<string, CognitiveConstraintObservation>();
      for (const o of state.constraintObservations) byId.set(o.governanceId, o);
      for (const o of observations) {
        const existing = byId.get(o.governanceId);
        byId.set(o.governanceId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_GOVERNANCE_MAX_OBSERVATIONS);
      state = {
        ...state,
        constraintObservations: Object.freeze(next),
        signature: buildStoreSignature({ constraintObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCognitiveGovernanceSnapshot[],
      now = Date.now()
    ): CognitiveGovernanceStoreState {
      const bySig = new Map<string, ExecutiveCognitiveGovernanceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_GOVERNANCE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSelfRegulationSignals(
      signals: EnterpriseSelfRegulationSignal[],
      now = Date.now()
    ): CognitiveGovernanceStoreState {
      const byId = new Map<string, EnterpriseSelfRegulationSignal>();
      for (const s of state.selfRegulationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_GOVERNANCE_MAX_SIGNALS);
      state = { ...state, selfRegulationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBoundaryIndicators(
      indicators: StrategicBoundaryIndicator[],
      now = Date.now()
    ): CognitiveGovernanceStoreState {
      const byId = new Map<string, StrategicBoundaryIndicator>();
      for (const i of state.boundaryIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_GOVERNANCE_MAX_INDICATORS);
      state = { ...state, boundaryIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGovernanceIntegrityFields(
      fields: GovernanceIntegrityField[],
      now = Date.now()
    ): CognitiveGovernanceStoreState {
      const byId = new Map<string, GovernanceIntegrityField>();
      for (const f of state.governanceIntegrityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_GOVERNANCE_MAX_INTEGRITY_FIELDS);
      state = { ...state, governanceIntegrityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRegulationState(regulationState: RegulationState): void {
      state = { ...state, lastRegulationState: regulationState };
    },

    clear(): CognitiveGovernanceStoreState {
      state = {
        constraintObservations: [],
        snapshots: [],
        selfRegulationSignals: [],
        boundaryIndicators: [],
        governanceIntegrityFields: [],
        signature: buildStoreSignature({ constraintObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastRegulationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveGovernanceStore>>();

export function getCognitiveGovernanceStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveGovernanceStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveGovernanceStores(): void {
  storesByOrganization.clear();
}
