import { stableSignature } from "../intelligence/shared/dedupe";
import {
  AWARENESS_SYNC_MAX_ALIGNMENTS,
  AWARENESS_SYNC_MAX_FIELDS,
  AWARENESS_SYNC_MAX_FRAGMENTATION_INDICATORS,
  AWARENESS_SYNC_MAX_OBSERVATIONS,
  AWARENESS_SYNC_MAX_SIGNALS,
  AWARENESS_SYNC_MAX_SNAPSHOTS,
} from "./awarenessSynchronizationGuards";
import type {
  AwarenessFragmentationIndicator,
  AwarenessSynchronizationObservation,
  AwarenessSynchronizationStoreState,
  AwarenessState,
  CrossDomainAwarenessSignal,
  EnterpriseAwarenessSynchronizationSnapshot,
  StrategicAwarenessAlignment,
  UnifiedOperationalCognitionField,
} from "./awarenessSynchronizationTypes";

function mergeObservations(
  existing: AwarenessSynchronizationObservation,
  incoming: AwarenessSynchronizationObservation
): AwarenessSynchronizationObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    synchronizedDomains: Object.freeze(
      Array.from(new Set([...existing.synchronizedDomains, ...incoming.synchronizedDomains])).slice(
        0,
        8
      )
    ),
    fragmentationRisks: Object.freeze(
      Array.from(new Set([...existing.fragmentationRisks, ...incoming.fragmentationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    awarenessState:
      incoming.confidence >= existing.confidence ? incoming.awarenessState : existing.awarenessState,
    synchronizationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.synchronizationStrength
        : existing.synchronizationStrength,
    awarenessDomain:
      incoming.confidence >= existing.confidence ? incoming.awarenessDomain : existing.awarenessDomain,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly AwarenessSynchronizationObservation[];
}): string {
  return stableSignature([
    "d9-9-2-awareness-synchronization",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.synchronizationId),
  ]);
}

export function createAwarenessSynchronizationStore(
  initial?: AwarenessSynchronizationStoreState
): {
  getState(): AwarenessSynchronizationStoreState;
  upsertObservations(
    observations: AwarenessSynchronizationObservation[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  upsertSnapshots(
    snapshots: EnterpriseAwarenessSynchronizationSnapshot[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  upsertAwarenessSignals(
    signals: CrossDomainAwarenessSignal[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  upsertOperationalCognitionFields(
    fields: UnifiedOperationalCognitionField[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  upsertAwarenessAlignments(
    alignments: StrategicAwarenessAlignment[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  upsertFragmentationIndicators(
    indicators: AwarenessFragmentationIndicator[],
    now?: number
  ): AwarenessSynchronizationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastAwarenessState(state: AwarenessState): void;
  clear(): AwarenessSynchronizationStoreState;
} {
  let state: AwarenessSynchronizationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    awarenessSignals: [],
    operationalCognitionFields: [],
    awarenessAlignments: [],
    fragmentationIndicators: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastAwarenessState: null,
  };

  return {
    getState(): AwarenessSynchronizationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        awarenessSignals: state.awarenessSignals.map((s) => ({ ...s })),
        operationalCognitionFields: state.operationalCognitionFields.map((f) => ({ ...f })),
        awarenessAlignments: state.awarenessAlignments.map((a) => ({ ...a })),
        fragmentationIndicators: state.fragmentationIndicators.map((i) => ({ ...i })),
      };
    },

    upsertObservations(
      observations: AwarenessSynchronizationObservation[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const byId = new Map<string, AwarenessSynchronizationObservation>();
      for (const o of state.observations) byId.set(o.synchronizationId, o);
      for (const o of observations) {
        const existing = byId.get(o.synchronizationId);
        byId.set(o.synchronizationId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, AWARENESS_SYNC_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseAwarenessSynchronizationSnapshot[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const bySig = new Map<string, EnterpriseAwarenessSynchronizationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, AWARENESS_SYNC_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAwarenessSignals(
      signals: CrossDomainAwarenessSignal[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const byId = new Map<string, CrossDomainAwarenessSignal>();
      for (const s of state.awarenessSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, AWARENESS_SYNC_MAX_SIGNALS);
      state = { ...state, awarenessSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertOperationalCognitionFields(
      fields: UnifiedOperationalCognitionField[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const byId = new Map<string, UnifiedOperationalCognitionField>();
      for (const f of state.operationalCognitionFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, AWARENESS_SYNC_MAX_FIELDS);
      state = { ...state, operationalCognitionFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAwarenessAlignments(
      alignments: StrategicAwarenessAlignment[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const byId = new Map<string, StrategicAwarenessAlignment>();
      for (const a of state.awarenessAlignments) byId.set(a.alignmentId, a);
      for (const a of alignments) byId.set(a.alignmentId, a);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, AWARENESS_SYNC_MAX_ALIGNMENTS);
      state = { ...state, awarenessAlignments: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFragmentationIndicators(
      indicators: AwarenessFragmentationIndicator[],
      now = Date.now()
    ): AwarenessSynchronizationStoreState {
      const byId = new Map<string, AwarenessFragmentationIndicator>();
      for (const i of state.fragmentationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, AWARENESS_SYNC_MAX_FRAGMENTATION_INDICATORS);
      state = { ...state, fragmentationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastAwarenessState(awarenessState: AwarenessState): void {
      state = { ...state, lastAwarenessState: awarenessState };
    },

    clear(): AwarenessSynchronizationStoreState {
      state = {
        observations: [],
        snapshots: [],
        awarenessSignals: [],
        operationalCognitionFields: [],
        awarenessAlignments: [],
        fragmentationIndicators: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastAwarenessState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createAwarenessSynchronizationStore>
>();

export function getAwarenessSynchronizationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createAwarenessSynchronizationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetAwarenessSynchronizationStores(): void {
  storesByOrganization.clear();
}
