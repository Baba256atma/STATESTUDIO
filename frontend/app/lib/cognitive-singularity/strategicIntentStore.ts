import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_INTENT_MAX_FIELDS,
  STRATEGIC_INTENT_MAX_OBSERVATIONS,
  STRATEGIC_INTENT_MAX_SIGNALS,
  STRATEGIC_INTENT_MAX_SNAPSHOTS,
  STRATEGIC_INTENT_MAX_TOPOLOGIES,
} from "./strategicIntentGuards";
import type {
  EnterprisePurposeAlignmentSignal,
  IntentState,
  OrganizationalIntentTopology,
  PurposeAlignmentObservation,
  StrategicDirectionField,
  StrategicIntentStoreState,
  UnifiedStrategicIntentSnapshot,
} from "./strategicIntentTypes";

function mergeObservations(
  existing: PurposeAlignmentObservation,
  incoming: PurposeAlignmentObservation
): PurposeAlignmentObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    alignmentSignals: Object.freeze(
      Array.from(new Set([...existing.alignmentSignals, ...incoming.alignmentSignals])).slice(0, 6)
    ),
    alignmentRisks: Object.freeze(
      Array.from(new Set([...existing.alignmentRisks, ...incoming.alignmentRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    intentState:
      incoming.confidence >= existing.confidence ? incoming.intentState : existing.intentState,
    alignmentStrength:
      incoming.confidence >= existing.confidence
        ? incoming.alignmentStrength
        : existing.alignmentStrength,
    intentCategory:
      incoming.confidence >= existing.confidence ? incoming.intentCategory : existing.intentCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly PurposeAlignmentObservation[];
}): string {
  return stableSignature([
    "d9-9-3-strategic-intent",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.intentId),
  ]);
}

export function createStrategicIntentStore(initial?: StrategicIntentStoreState): {
  getState(): StrategicIntentStoreState;
  upsertObservations(
    observations: PurposeAlignmentObservation[],
    now?: number
  ): StrategicIntentStoreState;
  upsertSnapshots(
    snapshots: UnifiedStrategicIntentSnapshot[],
    now?: number
  ): StrategicIntentStoreState;
  upsertPurposeAlignmentSignals(
    signals: EnterprisePurposeAlignmentSignal[],
    now?: number
  ): StrategicIntentStoreState;
  upsertStrategicDirectionFields(
    fields: StrategicDirectionField[],
    now?: number
  ): StrategicIntentStoreState;
  upsertIntentTopologies(
    topologies: OrganizationalIntentTopology[],
    now?: number
  ): StrategicIntentStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastIntentState(state: IntentState): void;
  clear(): StrategicIntentStoreState;
} {
  let state: StrategicIntentStoreState = initial ?? {
    observations: [],
    snapshots: [],
    purposeAlignmentSignals: [],
    strategicDirectionFields: [],
    intentTopologies: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastIntentState: null,
  };

  return {
    getState(): StrategicIntentStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        purposeAlignmentSignals: state.purposeAlignmentSignals.map((s) => ({ ...s })),
        strategicDirectionFields: state.strategicDirectionFields.map((f) => ({ ...f })),
        intentTopologies: state.intentTopologies.map((t) => ({ ...t })),
      };
    },

    upsertObservations(
      observations: PurposeAlignmentObservation[],
      now = Date.now()
    ): StrategicIntentStoreState {
      const byId = new Map<string, PurposeAlignmentObservation>();
      for (const o of state.observations) byId.set(o.intentId, o);
      for (const o of observations) {
        const existing = byId.get(o.intentId);
        byId.set(o.intentId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_INTENT_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: UnifiedStrategicIntentSnapshot[],
      now = Date.now()
    ): StrategicIntentStoreState {
      const bySig = new Map<string, UnifiedStrategicIntentSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_INTENT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPurposeAlignmentSignals(
      signals: EnterprisePurposeAlignmentSignal[],
      now = Date.now()
    ): StrategicIntentStoreState {
      const byId = new Map<string, EnterprisePurposeAlignmentSignal>();
      for (const s of state.purposeAlignmentSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_INTENT_MAX_SIGNALS);
      state = { ...state, purposeAlignmentSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicDirectionFields(
      fields: StrategicDirectionField[],
      now = Date.now()
    ): StrategicIntentStoreState {
      const byId = new Map<string, StrategicDirectionField>();
      for (const f of state.strategicDirectionFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_INTENT_MAX_FIELDS);
      state = { ...state, strategicDirectionFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertIntentTopologies(
      topologies: OrganizationalIntentTopology[],
      now = Date.now()
    ): StrategicIntentStoreState {
      const byId = new Map<string, OrganizationalIntentTopology>();
      for (const t of state.intentTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_INTENT_MAX_TOPOLOGIES);
      state = { ...state, intentTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastIntentState(intentState: IntentState): void {
      state = { ...state, lastIntentState: intentState };
    },

    clear(): StrategicIntentStoreState {
      state = {
        observations: [],
        snapshots: [],
        purposeAlignmentSignals: [],
        strategicDirectionFields: [],
        intentTopologies: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastIntentState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicIntentStore>>();

export function getStrategicIntentStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicIntentStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicIntentStores(): void {
  storesByOrganization.clear();
}
