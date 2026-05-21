import { stableSignature } from "../intelligence/shared/dedupe";
import {
  PERSPECTIVE_NEGOTIATION_MAX_NEGOTIATIONS,
  PERSPECTIVE_NEGOTIATION_MAX_RECONCILIATION_FIELDS,
  PERSPECTIVE_NEGOTIATION_MAX_SIGNALS,
  PERSPECTIVE_NEGOTIATION_MAX_SNAPSHOTS,
  PERSPECTIVE_NEGOTIATION_MAX_TRADEOFFS,
} from "./perspectiveNegotiationGuards";
import type {
  CognitiveNegotiationSignal,
  EnterpriseConflictResolutionSnapshot,
  ExecutiveTradeoffResolution,
  PerspectiveNegotiationStoreState,
  PerspectiveReconciliationField,
  ResolutionState,
  StrategicPerspectiveNegotiation,
} from "./perspectiveNegotiationTypes";

function mergeNegotiations(
  existing: StrategicPerspectiveNegotiation,
  incoming: StrategicPerspectiveNegotiation
): StrategicPerspectiveNegotiation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    alignedPerspectives: Object.freeze(
      Array.from(new Set([...existing.alignedPerspectives, ...incoming.alignedPerspectives])).slice(
        0,
        6
      )
    ),
    contestedPerspectives: Object.freeze(
      Array.from(
        new Set([...existing.contestedPerspectives, ...incoming.contestedPerspectives])
      ).slice(0, 6)
    ),
    negotiationSignals: Object.freeze(
      Array.from(new Set([...existing.negotiationSignals, ...incoming.negotiationSignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    resolutionState:
      incoming.confidence >= existing.confidence
        ? incoming.resolutionState
        : existing.resolutionState,
    negotiationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.negotiationStrength
        : existing.negotiationStrength,
    negotiationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.negotiationCategory
        : existing.negotiationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  negotiations: readonly StrategicPerspectiveNegotiation[];
}): string {
  return stableSignature([
    "d9-7-2-perspective-negotiation",
    state.negotiations.length,
    state.negotiations.slice(0, 3).map((n) => n.negotiationId),
  ]);
}

export function createPerspectiveNegotiationStore(initial?: PerspectiveNegotiationStoreState): {
  getState(): PerspectiveNegotiationStoreState;
  upsertNegotiations(
    negotiations: StrategicPerspectiveNegotiation[],
    now?: number
  ): PerspectiveNegotiationStoreState;
  upsertSnapshots(
    snapshots: EnterpriseConflictResolutionSnapshot[],
    now?: number
  ): PerspectiveNegotiationStoreState;
  upsertTradeoffResolutions(
    resolutions: ExecutiveTradeoffResolution[],
    now?: number
  ): PerspectiveNegotiationStoreState;
  upsertNegotiationSignals(
    signals: CognitiveNegotiationSignal[],
    now?: number
  ): PerspectiveNegotiationStoreState;
  upsertReconciliationFields(
    fields: PerspectiveReconciliationField[],
    now?: number
  ): PerspectiveNegotiationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastResolutionState(state: ResolutionState): void;
  clear(): PerspectiveNegotiationStoreState;
} {
  let state: PerspectiveNegotiationStoreState = initial ?? {
    negotiations: [],
    snapshots: [],
    tradeoffResolutions: [],
    negotiationSignals: [],
    reconciliationFields: [],
    signature: buildStoreSignature({ negotiations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastResolutionState: null,
  };

  return {
    getState(): PerspectiveNegotiationStoreState {
      return {
        ...state,
        negotiations: state.negotiations.map((n) => ({ ...n })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        tradeoffResolutions: state.tradeoffResolutions.map((r) => ({ ...r })),
        negotiationSignals: state.negotiationSignals.map((s) => ({ ...s })),
        reconciliationFields: state.reconciliationFields.map((f) => ({ ...f })),
      };
    },

    upsertNegotiations(
      negotiations: StrategicPerspectiveNegotiation[],
      now = Date.now()
    ): PerspectiveNegotiationStoreState {
      const byId = new Map<string, StrategicPerspectiveNegotiation>();
      for (const n of state.negotiations) byId.set(n.negotiationId, n);
      for (const n of negotiations) {
        const existing = byId.get(n.negotiationId);
        byId.set(n.negotiationId, existing ? mergeNegotiations(existing, n) : n);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, PERSPECTIVE_NEGOTIATION_MAX_NEGOTIATIONS);
      state = {
        ...state,
        negotiations: Object.freeze(next),
        signature: buildStoreSignature({ negotiations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseConflictResolutionSnapshot[],
      now = Date.now()
    ): PerspectiveNegotiationStoreState {
      const bySig = new Map<string, EnterpriseConflictResolutionSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_NEGOTIATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertTradeoffResolutions(
      resolutions: ExecutiveTradeoffResolution[],
      now = Date.now()
    ): PerspectiveNegotiationStoreState {
      const byId = new Map<string, ExecutiveTradeoffResolution>();
      for (const r of state.tradeoffResolutions) byId.set(r.resolutionId, r);
      for (const r of resolutions) byId.set(r.resolutionId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_NEGOTIATION_MAX_TRADEOFFS);
      state = { ...state, tradeoffResolutions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertNegotiationSignals(
      signals: CognitiveNegotiationSignal[],
      now = Date.now()
    ): PerspectiveNegotiationStoreState {
      const byId = new Map<string, CognitiveNegotiationSignal>();
      for (const s of state.negotiationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_NEGOTIATION_MAX_SIGNALS);
      state = { ...state, negotiationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReconciliationFields(
      fields: PerspectiveReconciliationField[],
      now = Date.now()
    ): PerspectiveNegotiationStoreState {
      const byId = new Map<string, PerspectiveReconciliationField>();
      for (const f of state.reconciliationFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_NEGOTIATION_MAX_RECONCILIATION_FIELDS);
      state = { ...state, reconciliationFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastResolutionState(resolutionState: ResolutionState): void {
      state = { ...state, lastResolutionState: resolutionState };
    },

    clear(): PerspectiveNegotiationStoreState {
      state = {
        negotiations: [],
        snapshots: [],
        tradeoffResolutions: [],
        negotiationSignals: [],
        reconciliationFields: [],
        signature: buildStoreSignature({ negotiations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastResolutionState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPerspectiveNegotiationStore>>();

export function getPerspectiveNegotiationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPerspectiveNegotiationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPerspectiveNegotiationStores(): void {
  storesByOrganization.clear();
}
