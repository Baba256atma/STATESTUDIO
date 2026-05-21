import { stableSignature } from "../intelligence/shared/dedupe";
import {
  FORESIGHT_COGNITION_MAX_INDICATORS,
  FORESIGHT_COGNITION_MAX_PATTERNS,
  FORESIGHT_COGNITION_MAX_PRESSURE_EMERGENCES,
  FORESIGHT_COGNITION_MAX_SIGNALS,
  FORESIGHT_COGNITION_MAX_SNAPSHOTS,
  FORESIGHT_COGNITION_MAX_WEAK_SIGNALS,
} from "./foresightCognitionGuards";
import type {
  AnticipatoryOperationalPattern,
  EmergingStrategicSignal,
  EnterpriseForesightSnapshot,
  ForesightCognitionStoreState,
  OrganizationalFutureIndicator,
  StrategicPressureEmergence,
  WeakSignalDetection,
} from "./foresightCognitionTypes";

function mergeEmergingSignals(
  existing: EmergingStrategicSignal,
  incoming: EmergingStrategicSignal
): EmergingStrategicSignal {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    weakSignals: Object.freeze(
      Array.from(new Set([...existing.weakSignals, ...incoming.weakSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    emergenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.emergenceLevel
        : existing.emergenceLevel,
    foresightState:
      incoming.confidence >= existing.confidence
        ? incoming.foresightState
        : existing.foresightState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  emergingSignals: readonly EmergingStrategicSignal[];
}): string {
  return stableSignature([
    "d9-4-1-foresight-cognition",
    state.emergingSignals.length,
    state.emergingSignals.slice(0, 3).map((s) => s.foresightId),
  ]);
}

export function createForesightCognitionStore(initial?: ForesightCognitionStoreState): {
  getState(): ForesightCognitionStoreState;
  upsertEmergingSignals(
    signals: EmergingStrategicSignal[],
    now?: number
  ): ForesightCognitionStoreState;
  upsertSnapshots(
    snapshots: EnterpriseForesightSnapshot[],
    now?: number
  ): ForesightCognitionStoreState;
  upsertWeakSignalDetections(
    detections: WeakSignalDetection[],
    now?: number
  ): ForesightCognitionStoreState;
  upsertAnticipatoryPatterns(
    patterns: AnticipatoryOperationalPattern[],
    now?: number
  ): ForesightCognitionStoreState;
  upsertPressureEmergences(
    emergences: StrategicPressureEmergence[],
    now?: number
  ): ForesightCognitionStoreState;
  upsertFutureIndicators(
    indicators: OrganizationalFutureIndicator[],
    now?: number
  ): ForesightCognitionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): ForesightCognitionStoreState;
} {
  let state: ForesightCognitionStoreState = initial ?? {
    emergingSignals: [],
    snapshots: [],
    weakSignalDetections: [],
    anticipatoryPatterns: [],
    pressureEmergences: [],
    futureIndicators: [],
    signature: buildStoreSignature({ emergingSignals: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): ForesightCognitionStoreState {
      return {
        ...state,
        emergingSignals: state.emergingSignals.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        weakSignalDetections: state.weakSignalDetections.map((d) => ({ ...d })),
        anticipatoryPatterns: state.anticipatoryPatterns.map((p) => ({ ...p })),
        pressureEmergences: state.pressureEmergences.map((e) => ({ ...e })),
        futureIndicators: state.futureIndicators.map((i) => ({ ...i })),
      };
    },

    upsertEmergingSignals(
      signals: EmergingStrategicSignal[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, EmergingStrategicSignal>();
      for (const s of state.emergingSignals) byId.set(s.foresightId, s);
      for (const s of signals) {
        const existing = byId.get(s.foresightId);
        byId.set(s.foresightId, existing ? mergeEmergingSignals(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_SIGNALS);
      state = {
        ...state,
        emergingSignals: Object.freeze(next),
        signature: buildStoreSignature({ emergingSignals: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseForesightSnapshot[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, EnterpriseForesightSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertWeakSignalDetections(
      detections: WeakSignalDetection[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, WeakSignalDetection>();
      for (const d of state.weakSignalDetections) byId.set(d.detectionId, d);
      for (const d of detections) byId.set(d.detectionId, d);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_WEAK_SIGNALS);
      state = { ...state, weakSignalDetections: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAnticipatoryPatterns(
      patterns: AnticipatoryOperationalPattern[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, AnticipatoryOperationalPattern>();
      for (const p of state.anticipatoryPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_PATTERNS);
      state = { ...state, anticipatoryPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPressureEmergences(
      emergences: StrategicPressureEmergence[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, StrategicPressureEmergence>();
      for (const e of state.pressureEmergences) byId.set(e.emergenceId, e);
      for (const e of emergences) byId.set(e.emergenceId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_PRESSURE_EMERGENCES);
      state = { ...state, pressureEmergences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFutureIndicators(
      indicators: OrganizationalFutureIndicator[],
      now = Date.now()
    ): ForesightCognitionStoreState {
      const byId = new Map<string, OrganizationalFutureIndicator>();
      for (const i of state.futureIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FORESIGHT_COGNITION_MAX_INDICATORS);
      state = { ...state, futureIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): ForesightCognitionStoreState {
      state = {
        emergingSignals: [],
        snapshots: [],
        weakSignalDetections: [],
        anticipatoryPatterns: [],
        pressureEmergences: [],
        futureIndicators: [],
        signature: buildStoreSignature({ emergingSignals: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createForesightCognitionStore>>();

export function getForesightCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createForesightCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetForesightCognitionStores(): void {
  storesByOrganization.clear();
}
