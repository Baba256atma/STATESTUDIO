import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INTERVENTION_TIMING_MAX_OPPORTUNITY_FIELDS,
  INTERVENTION_TIMING_MAX_PRESSURE_INDICATORS,
  INTERVENTION_TIMING_MAX_SENSITIVITIES,
  INTERVENTION_TIMING_MAX_SIGNALS,
  INTERVENTION_TIMING_MAX_SNAPSHOTS,
  INTERVENTION_TIMING_MAX_WINDOWS,
} from "./interventionTimingGuards";
import type {
  EnterpriseTimingSignal,
  InterventionTimingStoreState,
  InterventionWindowSnapshot,
  OperationalTimingSensitivity,
  StabilizationOpportunityField,
  StrategicInterventionWindow,
  TimingPressureIndicator,
} from "./interventionTimingTypes";

function mergeInterventionWindows(
  existing: StrategicInterventionWindow,
  incoming: StrategicInterventionWindow
): StrategicInterventionWindow {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    timingSignals: Object.freeze(
      Array.from(new Set([...existing.timingSignals, ...incoming.timingSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    timingSensitivity:
      incoming.confidence >= existing.confidence
        ? incoming.timingSensitivity
        : existing.timingSensitivity,
    windowState:
      incoming.confidence >= existing.confidence ? incoming.windowState : existing.windowState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  strategicInterventionWindows: readonly StrategicInterventionWindow[];
}): string {
  return stableSignature([
    "d9-4-6-intervention-timing",
    state.strategicInterventionWindows.length,
    state.strategicInterventionWindows.slice(0, 3).map((w) => w.interventionWindowId),
  ]);
}

export function createInterventionTimingStore(initial?: InterventionTimingStoreState): {
  getState(): InterventionTimingStoreState;
  upsertStrategicInterventionWindows(
    windows: StrategicInterventionWindow[],
    now?: number
  ): InterventionTimingStoreState;
  upsertSnapshots(
    snapshots: InterventionWindowSnapshot[],
    now?: number
  ): InterventionTimingStoreState;
  upsertTimingSignals(
    signals: EnterpriseTimingSignal[],
    now?: number
  ): InterventionTimingStoreState;
  upsertTimingSensitivities(
    sensitivities: OperationalTimingSensitivity[],
    now?: number
  ): InterventionTimingStoreState;
  upsertStabilizationOpportunityFields(
    fields: StabilizationOpportunityField[],
    now?: number
  ): InterventionTimingStoreState;
  upsertTimingPressureIndicators(
    indicators: TimingPressureIndicator[],
    now?: number
  ): InterventionTimingStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InterventionTimingStoreState;
} {
  let state: InterventionTimingStoreState = initial ?? {
    strategicInterventionWindows: [],
    snapshots: [],
    timingSignals: [],
    timingSensitivities: [],
    stabilizationOpportunityFields: [],
    timingPressureIndicators: [],
    signature: buildStoreSignature({ strategicInterventionWindows: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InterventionTimingStoreState {
      return {
        ...state,
        strategicInterventionWindows: state.strategicInterventionWindows.map((w) => ({ ...w })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        timingSignals: state.timingSignals.map((s) => ({ ...s })),
        timingSensitivities: state.timingSensitivities.map((s) => ({ ...s })),
        stabilizationOpportunityFields: state.stabilizationOpportunityFields.map((f) => ({ ...f })),
        timingPressureIndicators: state.timingPressureIndicators.map((i) => ({ ...i })),
      };
    },

    upsertStrategicInterventionWindows(
      windows: StrategicInterventionWindow[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, StrategicInterventionWindow>();
      for (const w of state.strategicInterventionWindows) byId.set(w.interventionWindowId, w);
      for (const w of windows) {
        const existing = byId.get(w.interventionWindowId);
        byId.set(w.interventionWindowId, existing ? mergeInterventionWindows(existing, w) : { ...w });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INTERVENTION_TIMING_MAX_WINDOWS);
      state = {
        ...state,
        strategicInterventionWindows: Object.freeze(next),
        signature: buildStoreSignature({ strategicInterventionWindows: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: InterventionWindowSnapshot[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, InterventionWindowSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_TIMING_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTimingSignals(
      signals: EnterpriseTimingSignal[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, EnterpriseTimingSignal>();
      for (const s of state.timingSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_TIMING_MAX_SIGNALS);
      state = { ...state, timingSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTimingSensitivities(
      sensitivities: OperationalTimingSensitivity[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, OperationalTimingSensitivity>();
      for (const s of state.timingSensitivities) byId.set(s.sensitivityId, s);
      for (const s of sensitivities) byId.set(s.sensitivityId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_TIMING_MAX_SENSITIVITIES);
      state = { ...state, timingSensitivities: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStabilizationOpportunityFields(
      fields: StabilizationOpportunityField[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, StabilizationOpportunityField>();
      for (const f of state.stabilizationOpportunityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_TIMING_MAX_OPPORTUNITY_FIELDS);
      state = { ...state, stabilizationOpportunityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTimingPressureIndicators(
      indicators: TimingPressureIndicator[],
      now = Date.now()
    ): InterventionTimingStoreState {
      const byId = new Map<string, TimingPressureIndicator>();
      for (const i of state.timingPressureIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INTERVENTION_TIMING_MAX_PRESSURE_INDICATORS);
      state = { ...state, timingPressureIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InterventionTimingStoreState {
      state = {
        strategicInterventionWindows: [],
        snapshots: [],
        timingSignals: [],
        timingSensitivities: [],
        stabilizationOpportunityFields: [],
        timingPressureIndicators: [],
        signature: buildStoreSignature({ strategicInterventionWindows: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createInterventionTimingStore>>();

export function getInterventionTimingStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInterventionTimingStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInterventionTimingStores(): void {
  storesByOrganization.clear();
}
