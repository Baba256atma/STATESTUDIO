import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_IDENTITY_MAX_DRIFT_INDICATORS,
  STRATEGIC_IDENTITY_MAX_FIELDS,
  STRATEGIC_IDENTITY_MAX_OBSERVATIONS,
  STRATEGIC_IDENTITY_MAX_SIGNALS,
  STRATEGIC_IDENTITY_MAX_SNAPSHOTS,
} from "./strategicIdentityGuards";
import type {
  EnterpriseStrategicIdentitySnapshot,
  IdentityAlignmentObservation,
  IdentityState,
  OrganizationalDriftIndicator,
  OrganizationalSelfConsistencySignal,
  StrategicIdentityField,
  StrategicIdentityStoreState,
} from "./strategicIdentityTypes";

function mergeObservations(
  existing: IdentityAlignmentObservation,
  incoming: IdentityAlignmentObservation
): IdentityAlignmentObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    consistencySignals: Object.freeze(
      Array.from(new Set([...existing.consistencySignals, ...incoming.consistencySignals])).slice(
        0,
        6
      )
    ),
    driftRisks: Object.freeze(
      Array.from(new Set([...existing.driftRisks, ...incoming.driftRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    identityState:
      incoming.confidence >= existing.confidence ? incoming.identityState : existing.identityState,
    consistencyLevel:
      incoming.confidence >= existing.confidence
        ? incoming.consistencyLevel
        : existing.consistencyLevel,
    identityCategory:
      incoming.confidence >= existing.confidence ? incoming.identityCategory : existing.identityCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly IdentityAlignmentObservation[];
}): string {
  return stableSignature([
    "d9-9-4-strategic-identity",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.identityId),
  ]);
}

export function createStrategicIdentityStore(initial?: StrategicIdentityStoreState): {
  getState(): StrategicIdentityStoreState;
  upsertObservations(
    observations: IdentityAlignmentObservation[],
    now?: number
  ): StrategicIdentityStoreState;
  upsertSnapshots(
    snapshots: EnterpriseStrategicIdentitySnapshot[],
    now?: number
  ): StrategicIdentityStoreState;
  upsertSelfConsistencySignals(
    signals: OrganizationalSelfConsistencySignal[],
    now?: number
  ): StrategicIdentityStoreState;
  upsertStrategicIdentityFields(
    fields: StrategicIdentityField[],
    now?: number
  ): StrategicIdentityStoreState;
  upsertDriftIndicators(
    indicators: OrganizationalDriftIndicator[],
    now?: number
  ): StrategicIdentityStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastIdentityState(state: IdentityState): void;
  clear(): StrategicIdentityStoreState;
} {
  let state: StrategicIdentityStoreState = initial ?? {
    observations: [],
    snapshots: [],
    selfConsistencySignals: [],
    strategicIdentityFields: [],
    driftIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastIdentityState: null,
  };

  return {
    getState(): StrategicIdentityStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        selfConsistencySignals: state.selfConsistencySignals.map((s) => ({ ...s })),
        strategicIdentityFields: state.strategicIdentityFields.map((f) => ({ ...f })),
        driftIndicators: state.driftIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: IdentityAlignmentObservation[],
      now = Date.now()
    ): StrategicIdentityStoreState {
      const byId = new Map<string, IdentityAlignmentObservation>();
      for (const o of state.observations) byId.set(o.identityId, o);
      for (const o of observations) {
        const existing = byId.get(o.identityId);
        byId.set(o.identityId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_IDENTITY_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseStrategicIdentitySnapshot[],
      now = Date.now()
    ): StrategicIdentityStoreState {
      const bySig = new Map<string, EnterpriseStrategicIdentitySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_IDENTITY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSelfConsistencySignals(
      signals: OrganizationalSelfConsistencySignal[],
      now = Date.now()
    ): StrategicIdentityStoreState {
      const byId = new Map<string, OrganizationalSelfConsistencySignal>();
      for (const s of state.selfConsistencySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_IDENTITY_MAX_SIGNALS);
      state = { ...state, selfConsistencySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicIdentityFields(
      fields: StrategicIdentityField[],
      now = Date.now()
    ): StrategicIdentityStoreState {
      const byId = new Map<string, StrategicIdentityField>();
      for (const f of state.strategicIdentityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_IDENTITY_MAX_FIELDS);
      state = { ...state, strategicIdentityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDriftIndicators(
      indicators: OrganizationalDriftIndicator[],
      now = Date.now()
    ): StrategicIdentityStoreState {
      const byId = new Map<string, OrganizationalDriftIndicator>();
      for (const i of state.driftIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_IDENTITY_MAX_DRIFT_INDICATORS);
      state = { ...state, driftIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastIdentityState(identityState: IdentityState): void {
      state = { ...state, lastIdentityState: identityState };
    },

    clear(): StrategicIdentityStoreState {
      state = {
        observations: [],
        snapshots: [],
        selfConsistencySignals: [],
        strategicIdentityFields: [],
        driftIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastIdentityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicIdentityStore>>();

export function getStrategicIdentityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicIdentityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicIdentityStores(): void {
  storesByOrganization.clear();
}
