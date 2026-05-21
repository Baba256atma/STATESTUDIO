import { stableSignature } from "../intelligence/shared/dedupe";
import {
  PREPAREDNESS_COGNITION_MAX_CAPABILITIES,
  PREPAREDNESS_COGNITION_MAX_GAP_INDICATORS,
  PREPAREDNESS_COGNITION_MAX_RESPONSE_READINESS,
  PREPAREDNESS_COGNITION_MAX_SIGNALS,
  PREPAREDNESS_COGNITION_MAX_SNAPSHOTS,
} from "./preparednessCognitionGuards";
import type {
  EnterprisePreparednessSnapshot,
  OperationalResilienceCapability,
  OrganizationalResponseReadiness,
  PreparednessCognitionStoreState,
  PreparednessGapIndicator,
  StrategicReadinessSignal,
} from "./preparednessCognitionTypes";

function mergeStrategicReadinessSignals(
  existing: StrategicReadinessSignal,
  incoming: StrategicReadinessSignal
): StrategicReadinessSignal {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    preparednessSignals: Object.freeze(
      Array.from(new Set([...existing.preparednessSignals, ...incoming.preparednessSignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    preparednessLevel:
      incoming.confidence >= existing.confidence
        ? incoming.preparednessLevel
        : existing.preparednessLevel,
    readinessState:
      incoming.confidence >= existing.confidence
        ? incoming.readinessState
        : existing.readinessState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  strategicReadinessSignals: readonly StrategicReadinessSignal[];
}): string {
  return stableSignature([
    "d9-4-7-preparedness-cognition",
    state.strategicReadinessSignals.length,
    state.strategicReadinessSignals.slice(0, 3).map((s) => s.preparednessId),
  ]);
}

export function createPreparednessCognitionStore(initial?: PreparednessCognitionStoreState): {
  getState(): PreparednessCognitionStoreState;
  upsertStrategicReadinessSignals(
    signals: StrategicReadinessSignal[],
    now?: number
  ): PreparednessCognitionStoreState;
  upsertSnapshots(
    snapshots: EnterprisePreparednessSnapshot[],
    now?: number
  ): PreparednessCognitionStoreState;
  upsertResilienceCapabilities(
    capabilities: OperationalResilienceCapability[],
    now?: number
  ): PreparednessCognitionStoreState;
  upsertPreparednessGapIndicators(
    indicators: PreparednessGapIndicator[],
    now?: number
  ): PreparednessCognitionStoreState;
  upsertResponseReadiness(
    readiness: OrganizationalResponseReadiness[],
    now?: number
  ): PreparednessCognitionStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): PreparednessCognitionStoreState;
} {
  let state: PreparednessCognitionStoreState = initial ?? {
    strategicReadinessSignals: [],
    snapshots: [],
    resilienceCapabilities: [],
    preparednessGapIndicators: [],
    responseReadiness: [],
    signature: buildStoreSignature({ strategicReadinessSignals: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): PreparednessCognitionStoreState {
      return {
        ...state,
        strategicReadinessSignals: state.strategicReadinessSignals.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        resilienceCapabilities: state.resilienceCapabilities.map((c) => ({ ...c })),
        preparednessGapIndicators: state.preparednessGapIndicators.map((g) => ({ ...g })),
        responseReadiness: state.responseReadiness.map((r) => ({ ...r })),
      };
    },

    upsertStrategicReadinessSignals(
      signals: StrategicReadinessSignal[],
      now = Date.now()
    ): PreparednessCognitionStoreState {
      const byId = new Map<string, StrategicReadinessSignal>();
      for (const s of state.strategicReadinessSignals) byId.set(s.preparednessId, s);
      for (const s of signals) {
        const existing = byId.get(s.preparednessId);
        byId.set(s.preparednessId, existing ? mergeStrategicReadinessSignals(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, PREPAREDNESS_COGNITION_MAX_SIGNALS);
      state = {
        ...state,
        strategicReadinessSignals: Object.freeze(next),
        signature: buildStoreSignature({ strategicReadinessSignals: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterprisePreparednessSnapshot[],
      now = Date.now()
    ): PreparednessCognitionStoreState {
      const byId = new Map<string, EnterprisePreparednessSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PREPAREDNESS_COGNITION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceCapabilities(
      capabilities: OperationalResilienceCapability[],
      now = Date.now()
    ): PreparednessCognitionStoreState {
      const byId = new Map<string, OperationalResilienceCapability>();
      for (const c of state.resilienceCapabilities) byId.set(c.capabilityId, c);
      for (const c of capabilities) byId.set(c.capabilityId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PREPAREDNESS_COGNITION_MAX_CAPABILITIES);
      state = { ...state, resilienceCapabilities: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPreparednessGapIndicators(
      indicators: PreparednessGapIndicator[],
      now = Date.now()
    ): PreparednessCognitionStoreState {
      const byId = new Map<string, PreparednessGapIndicator>();
      for (const g of state.preparednessGapIndicators) byId.set(g.gapId, g);
      for (const g of indicators) byId.set(g.gapId, g);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PREPAREDNESS_COGNITION_MAX_GAP_INDICATORS);
      state = { ...state, preparednessGapIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResponseReadiness(
      readiness: OrganizationalResponseReadiness[],
      now = Date.now()
    ): PreparednessCognitionStoreState {
      const byId = new Map<string, OrganizationalResponseReadiness>();
      for (const r of state.responseReadiness) byId.set(r.readinessId, r);
      for (const r of readiness) byId.set(r.readinessId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PREPAREDNESS_COGNITION_MAX_RESPONSE_READINESS);
      state = { ...state, responseReadiness: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): PreparednessCognitionStoreState {
      state = {
        strategicReadinessSignals: [],
        snapshots: [],
        resilienceCapabilities: [],
        preparednessGapIndicators: [],
        responseReadiness: [],
        signature: buildStoreSignature({ strategicReadinessSignals: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPreparednessCognitionStore>>();

export function getPreparednessCognitionStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPreparednessCognitionStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPreparednessCognitionStores(): void {
  storesByOrganization.clear();
}
