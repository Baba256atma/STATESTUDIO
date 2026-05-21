import { stableSignature } from "../intelligence/shared/dedupe";
import {
  TRUST_CALIBRATION_MAX_ADJUSTMENTS,
  TRUST_CALIBRATION_MAX_FIELDS,
  TRUST_CALIBRATION_MAX_INDICATORS,
  TRUST_CALIBRATION_MAX_SIGNALS,
  TRUST_CALIBRATION_MAX_SNAPSHOTS,
} from "./trustCalibrationGuards";
import type {
  CognitiveReliabilityIndicator,
  EnterpriseReliabilitySignal,
  ExecutiveTrustCalibrationSnapshot,
  OperationalTrustworthinessField,
  StrategicTrustAdjustment,
  TrustCalibrationStoreState,
  TrustState,
} from "./trustCalibrationTypes";

function mergeAdjustments(
  existing: StrategicTrustAdjustment,
  incoming: StrategicTrustAdjustment
): StrategicTrustAdjustment {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    reliabilitySignals: Object.freeze(
      Array.from(new Set([...existing.reliabilitySignals, ...incoming.reliabilitySignals])).slice(0, 6)
    ),
    cautionSignals: Object.freeze(
      Array.from(new Set([...existing.cautionSignals, ...incoming.cautionSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    trustState: incoming.confidence >= existing.confidence ? incoming.trustState : existing.trustState,
    reliabilityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.reliabilityStrength
        : existing.reliabilityStrength,
    trustCategory:
      incoming.confidence >= existing.confidence ? incoming.trustCategory : existing.trustCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  trustAdjustments: readonly StrategicTrustAdjustment[];
}): string {
  return stableSignature([
    "d9-6-6-trust-calibration",
    state.trustAdjustments.length,
    state.trustAdjustments.slice(0, 3).map((a) => a.trustCalibrationId),
  ]);
}

export function createTrustCalibrationStore(initial?: TrustCalibrationStoreState): {
  getState(): TrustCalibrationStoreState;
  upsertTrustAdjustments(
    adjustments: StrategicTrustAdjustment[],
    now?: number
  ): TrustCalibrationStoreState;
  upsertSnapshots(
    snapshots: ExecutiveTrustCalibrationSnapshot[],
    now?: number
  ): TrustCalibrationStoreState;
  upsertReliabilitySignals(
    signals: EnterpriseReliabilitySignal[],
    now?: number
  ): TrustCalibrationStoreState;
  upsertTrustworthinessFields(
    fields: OperationalTrustworthinessField[],
    now?: number
  ): TrustCalibrationStoreState;
  upsertReliabilityIndicators(
    indicators: CognitiveReliabilityIndicator[],
    now?: number
  ): TrustCalibrationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastTrustState(state: TrustState): void;
  clear(): TrustCalibrationStoreState;
} {
  let state: TrustCalibrationStoreState = initial ?? {
    trustAdjustments: [],
    snapshots: [],
    reliabilitySignals: [],
    trustworthinessFields: [],
    reliabilityIndicators: [],
    signature: buildStoreSignature({ trustAdjustments: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastTrustState: null,
  };

  return {
    getState(): TrustCalibrationStoreState {
      return {
        ...state,
        trustAdjustments: state.trustAdjustments.map((a) => ({ ...a })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        reliabilitySignals: state.reliabilitySignals.map((s) => ({ ...s })),
        trustworthinessFields: state.trustworthinessFields.map((f) => ({ ...f })),
        reliabilityIndicators: state.reliabilityIndicators.map((i) => ({ ...i })),
      };
    },

    upsertTrustAdjustments(
      adjustments: StrategicTrustAdjustment[],
      now = Date.now()
    ): TrustCalibrationStoreState {
      const byId = new Map<string, StrategicTrustAdjustment>();
      for (const a of state.trustAdjustments) byId.set(a.trustCalibrationId, a);
      for (const a of adjustments) {
        const existing = byId.get(a.trustCalibrationId);
        byId.set(a.trustCalibrationId, existing ? mergeAdjustments(existing, a) : a);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, TRUST_CALIBRATION_MAX_ADJUSTMENTS);
      state = {
        ...state,
        trustAdjustments: Object.freeze(next),
        signature: buildStoreSignature({ trustAdjustments: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ExecutiveTrustCalibrationSnapshot[],
      now = Date.now()
    ): TrustCalibrationStoreState {
      const bySig = new Map<string, ExecutiveTrustCalibrationSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TRUST_CALIBRATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReliabilitySignals(
      signals: EnterpriseReliabilitySignal[],
      now = Date.now()
    ): TrustCalibrationStoreState {
      const byId = new Map<string, EnterpriseReliabilitySignal>();
      for (const s of state.reliabilitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TRUST_CALIBRATION_MAX_SIGNALS);
      state = { ...state, reliabilitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTrustworthinessFields(
      fields: OperationalTrustworthinessField[],
      now = Date.now()
    ): TrustCalibrationStoreState {
      const byId = new Map<string, OperationalTrustworthinessField>();
      for (const f of state.trustworthinessFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TRUST_CALIBRATION_MAX_FIELDS);
      state = { ...state, trustworthinessFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReliabilityIndicators(
      indicators: CognitiveReliabilityIndicator[],
      now = Date.now()
    ): TrustCalibrationStoreState {
      const byId = new Map<string, CognitiveReliabilityIndicator>();
      for (const i of state.reliabilityIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, TRUST_CALIBRATION_MAX_INDICATORS);
      state = { ...state, reliabilityIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastTrustState(trustState: TrustState): void {
      state = { ...state, lastTrustState: trustState };
    },

    clear(): TrustCalibrationStoreState {
      state = {
        trustAdjustments: [],
        snapshots: [],
        reliabilitySignals: [],
        trustworthinessFields: [],
        reliabilityIndicators: [],
        signature: buildStoreSignature({ trustAdjustments: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastTrustState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createTrustCalibrationStore>>();

export function getTrustCalibrationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createTrustCalibrationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetTrustCalibrationStores(): void {
  storesByOrganization.clear();
}
