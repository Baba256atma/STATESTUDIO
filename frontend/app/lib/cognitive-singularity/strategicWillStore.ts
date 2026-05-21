import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_WILL_MAX_FIELDS,
  STRATEGIC_WILL_MAX_FRAGMENTATION_INDICATORS,
  STRATEGIC_WILL_MAX_OBSERVATIONS,
  STRATEGIC_WILL_MAX_SIGNALS,
  STRATEGIC_WILL_MAX_SNAPSHOTS,
} from "./strategicWillGuards";
import type {
  CrossSystemCommitmentField,
  DirectionalCommitmentSignal,
  EnterpriseCommitmentObservation,
  EnterpriseStrategicWillSnapshot,
  StrategicWillFragmentationIndicator,
  StrategicWillStoreState,
  WillState,
} from "./strategicWillTypes";

function mergeObservations(
  existing: EnterpriseCommitmentObservation,
  incoming: EnterpriseCommitmentObservation
): EnterpriseCommitmentObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    commitmentSignals: Object.freeze(
      Array.from(new Set([...existing.commitmentSignals, ...incoming.commitmentSignals])).slice(
        0,
        6
      )
    ),
    fragmentationRisks: Object.freeze(
      Array.from(new Set([...existing.fragmentationRisks, ...incoming.fragmentationRisks])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    willState: incoming.confidence >= existing.confidence ? incoming.willState : existing.willState,
    commitmentStrength:
      incoming.confidence >= existing.confidence
        ? incoming.commitmentStrength
        : existing.commitmentStrength,
    commitmentCategory:
      incoming.confidence >= existing.confidence
        ? incoming.commitmentCategory
        : existing.commitmentCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly EnterpriseCommitmentObservation[];
}): string {
  return stableSignature([
    "d9-9-5-strategic-will",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.willId),
  ]);
}

export function createStrategicWillStore(initial?: StrategicWillStoreState): {
  getState(): StrategicWillStoreState;
  upsertObservations(
    observations: EnterpriseCommitmentObservation[],
    now?: number
  ): StrategicWillStoreState;
  upsertSnapshots(
    snapshots: EnterpriseStrategicWillSnapshot[],
    now?: number
  ): StrategicWillStoreState;
  upsertDirectionalCommitmentSignals(
    signals: DirectionalCommitmentSignal[],
    now?: number
  ): StrategicWillStoreState;
  upsertCrossSystemCommitmentFields(
    fields: CrossSystemCommitmentField[],
    now?: number
  ): StrategicWillStoreState;
  upsertFragmentationIndicators(
    indicators: StrategicWillFragmentationIndicator[],
    now?: number
  ): StrategicWillStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastWillState(state: WillState): void;
  clear(): StrategicWillStoreState;
} {
  let state: StrategicWillStoreState = initial ?? {
    observations: [],
    snapshots: [],
    directionalCommitmentSignals: [],
    crossSystemCommitmentFields: [],
    fragmentationIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastWillState: null,
  };

  return {
    getState(): StrategicWillStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        directionalCommitmentSignals: state.directionalCommitmentSignals.map((s) => ({ ...s })),
        crossSystemCommitmentFields: state.crossSystemCommitmentFields.map((f) => ({ ...f })),
        fragmentationIndicators: state.fragmentationIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: EnterpriseCommitmentObservation[],
      now = Date.now()
    ): StrategicWillStoreState {
      const byId = new Map<string, EnterpriseCommitmentObservation>();
      for (const o of state.observations) byId.set(o.willId, o);
      for (const o of observations) {
        const existing = byId.get(o.willId);
        byId.set(o.willId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_WILL_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseStrategicWillSnapshot[],
      now = Date.now()
    ): StrategicWillStoreState {
      const bySig = new Map<string, EnterpriseStrategicWillSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_WILL_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDirectionalCommitmentSignals(
      signals: DirectionalCommitmentSignal[],
      now = Date.now()
    ): StrategicWillStoreState {
      const byId = new Map<string, DirectionalCommitmentSignal>();
      for (const s of state.directionalCommitmentSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_WILL_MAX_SIGNALS);
      state = { ...state, directionalCommitmentSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCrossSystemCommitmentFields(
      fields: CrossSystemCommitmentField[],
      now = Date.now()
    ): StrategicWillStoreState {
      const byId = new Map<string, CrossSystemCommitmentField>();
      for (const f of state.crossSystemCommitmentFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_WILL_MAX_FIELDS);
      state = { ...state, crossSystemCommitmentFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFragmentationIndicators(
      indicators: StrategicWillFragmentationIndicator[],
      now = Date.now()
    ): StrategicWillStoreState {
      const byId = new Map<string, StrategicWillFragmentationIndicator>();
      for (const i of state.fragmentationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_WILL_MAX_FRAGMENTATION_INDICATORS);
      state = { ...state, fragmentationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastWillState(willState: WillState): void {
      state = { ...state, lastWillState: willState };
    },

    clear(): StrategicWillStoreState {
      state = {
        observations: [],
        snapshots: [],
        directionalCommitmentSignals: [],
        crossSystemCommitmentFields: [],
        fragmentationIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastWillState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicWillStore>>();

export function getStrategicWillStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicWillStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicWillStores(): void {
  storesByOrganization.clear();
}
