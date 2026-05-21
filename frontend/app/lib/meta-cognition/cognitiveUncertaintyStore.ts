import { stableSignature } from "../intelligence/shared/dedupe";
import {
  COGNITIVE_UNCERTAINTY_MAX_INCOMPLETE,
  COGNITIVE_UNCERTAINTY_MAX_OBSERVATIONS,
  COGNITIVE_UNCERTAINTY_MAX_SIGNALS,
  COGNITIVE_UNCERTAINTY_MAX_SNAPSHOTS,
  COGNITIVE_UNCERTAINTY_MAX_TOPOLOGY,
  COGNITIVE_UNCERTAINTY_MAX_UNKNOWN_ZONES,
} from "./cognitiveUncertaintyGuards";
import type {
  CognitiveUncertaintyStoreState,
  EnterpriseAmbiguitySignal,
  ExecutiveCognitiveUncertaintySnapshot,
  IncompleteInformationIndicator,
  StrategicAmbiguityObservation,
  CautionPosture,
  UncertaintyTopologyField,
  UnknownZoneObservation,
} from "./cognitiveUncertaintyTypes";

function mergeObservations(
  existing: StrategicAmbiguityObservation,
  incoming: StrategicAmbiguityObservation
): StrategicAmbiguityObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    knownSignals: Object.freeze(
      Array.from(new Set([...existing.knownSignals, ...incoming.knownSignals])).slice(0, 6)
    ),
    unknownZones: Object.freeze(
      Array.from(new Set([...existing.unknownZones, ...incoming.unknownZones])).slice(0, 6)
    ),
    cautionRisks: Object.freeze(
      Array.from(new Set([...existing.cautionRisks, ...incoming.cautionRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    cautionPosture:
      incoming.confidence >= existing.confidence ? incoming.cautionPosture : existing.cautionPosture,
    uncertaintySeverity:
      incoming.confidence >= existing.confidence
        ? incoming.uncertaintySeverity
        : existing.uncertaintySeverity,
    ambiguityCategory:
      incoming.confidence >= existing.confidence
        ? incoming.ambiguityCategory
        : existing.ambiguityCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  ambiguityObservations: readonly StrategicAmbiguityObservation[];
}): string {
  return stableSignature([
    "d9-6-4-cognitive-uncertainty",
    state.ambiguityObservations.length,
    state.ambiguityObservations.slice(0, 3).map((o) => o.ambiguityId),
  ]);
}

export function createCognitiveUncertaintyStore(initial?: CognitiveUncertaintyStoreState): {
  getState(): CognitiveUncertaintyStoreState;
  upsertAmbiguityObservations(
    observations: StrategicAmbiguityObservation[],
    now?: number
  ): CognitiveUncertaintyStoreState;
  upsertSnapshots(
    snapshots: ExecutiveCognitiveUncertaintySnapshot[],
    now?: number
  ): CognitiveUncertaintyStoreState;
  upsertAmbiguitySignals(signals: EnterpriseAmbiguitySignal[], now?: number): CognitiveUncertaintyStoreState;
  upsertUncertaintyTopologyFields(
    fields: UncertaintyTopologyField[],
    now?: number
  ): CognitiveUncertaintyStoreState;
  upsertIncompleteInformationIndicators(
    indicators: IncompleteInformationIndicator[],
    now?: number
  ): CognitiveUncertaintyStoreState;
  upsertUnknownZoneObservations(
    zones: UnknownZoneObservation[],
    now?: number
  ): CognitiveUncertaintyStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCautionPosture(posture: CautionPosture): void;
  clear(): CognitiveUncertaintyStoreState;
} {
  let state: CognitiveUncertaintyStoreState = initial ?? {
    ambiguityObservations: [],
    snapshots: [],
    ambiguitySignals: [],
    uncertaintyTopologyFields: [],
    incompleteInformationIndicators: [],
    unknownZoneObservations: [],
    signature: buildStoreSignature({ ambiguityObservations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCautionPosture: null,
  };

  return {
    getState(): CognitiveUncertaintyStoreState {
      return {
        ...state,
        ambiguityObservations: state.ambiguityObservations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        ambiguitySignals: state.ambiguitySignals.map((s) => ({ ...s })),
        uncertaintyTopologyFields: state.uncertaintyTopologyFields.map((f) => ({ ...f })),
        incompleteInformationIndicators: state.incompleteInformationIndicators.map((i) => ({ ...i })),
        unknownZoneObservations: state.unknownZoneObservations.map((z) => ({ ...z })),
      };
    },

    upsertAmbiguityObservations(
      observations: StrategicAmbiguityObservation[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const byId = new Map<string, StrategicAmbiguityObservation>();
      for (const o of state.ambiguityObservations) byId.set(o.ambiguityId, o);
      for (const o of observations) {
        const existing = byId.get(o.ambiguityId);
        byId.set(o.ambiguityId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_OBSERVATIONS);
      state = {
        ...state,
        ambiguityObservations: Object.freeze(next),
        signature: buildStoreSignature({ ambiguityObservations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveCognitiveUncertaintySnapshot[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const bySig = new Map<string, ExecutiveCognitiveUncertaintySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAmbiguitySignals(
      signals: EnterpriseAmbiguitySignal[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const byId = new Map<string, EnterpriseAmbiguitySignal>();
      for (const s of state.ambiguitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_SIGNALS);
      state = { ...state, ambiguitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertUncertaintyTopologyFields(
      fields: UncertaintyTopologyField[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const byId = new Map<string, UncertaintyTopologyField>();
      for (const f of state.uncertaintyTopologyFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_TOPOLOGY);
      state = { ...state, uncertaintyTopologyFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertIncompleteInformationIndicators(
      indicators: IncompleteInformationIndicator[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const byId = new Map<string, IncompleteInformationIndicator>();
      for (const i of state.incompleteInformationIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_INCOMPLETE);
      state = { ...state, incompleteInformationIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertUnknownZoneObservations(
      zones: UnknownZoneObservation[],
      now = Date.now()
    ): CognitiveUncertaintyStoreState {
      const byId = new Map<string, UnknownZoneObservation>();
      for (const z of state.unknownZoneObservations) byId.set(z.zoneId, z);
      for (const z of zones) byId.set(z.zoneId, z);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, COGNITIVE_UNCERTAINTY_MAX_UNKNOWN_ZONES);
      state = { ...state, unknownZoneObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCautionPosture(posture: CautionPosture): void {
      state = { ...state, lastCautionPosture: posture };
    },

    clear(): CognitiveUncertaintyStoreState {
      state = {
        ambiguityObservations: [],
        snapshots: [],
        ambiguitySignals: [],
        uncertaintyTopologyFields: [],
        incompleteInformationIndicators: [],
        unknownZoneObservations: [],
        signature: buildStoreSignature({ ambiguityObservations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCautionPosture: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCognitiveUncertaintyStore>>();

export function getCognitiveUncertaintyStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCognitiveUncertaintyStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCognitiveUncertaintyStores(): void {
  storesByOrganization.clear();
}
