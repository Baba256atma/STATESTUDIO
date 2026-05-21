import { stableSignature } from "../intelligence/shared/dedupe";
import {
  PRIORITY_ARBITRATION_MAX_ARBITRATIONS,
  PRIORITY_ARBITRATION_MAX_CONFLICTS,
  PRIORITY_ARBITRATION_MAX_SIGNALS,
  PRIORITY_ARBITRATION_MAX_SNAPSHOTS,
  PRIORITY_ARBITRATION_MAX_TRADEOFFS,
} from "./priorityArbitrationGuards";
import type {
  EnterpriseDecisionTradeoff,
  ExecutivePriorityArbitration,
  MultiObjectiveDecisionSnapshot,
  OperationalBalancingSignal,
  PriorityArbitrationStoreState,
  StrategicPriorityConflict,
} from "./priorityArbitrationTypes";

function mergeArbitrations(
  existing: ExecutivePriorityArbitration,
  incoming: ExecutivePriorityArbitration
): ExecutivePriorityArbitration {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    competingPriorities: Object.freeze(
      Array.from(new Set([...existing.competingPriorities, ...incoming.competingPriorities])).slice(
        0,
        6
      )
    ),
    balancingSignals: Object.freeze(
      Array.from(new Set([...existing.balancingSignals, ...incoming.balancingSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    arbitrationState:
      incoming.confidence >= existing.confidence
        ? incoming.arbitrationState
        : existing.arbitrationState,
    tradeoffType:
      incoming.confidence >= existing.confidence ? incoming.tradeoffType : existing.tradeoffType,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  executiveArbitrations: readonly ExecutivePriorityArbitration[];
}): string {
  return stableSignature([
    "d9-5-3-priority-arbitration",
    state.executiveArbitrations.length,
    state.executiveArbitrations.slice(0, 3).map((a) => a.arbitrationId),
  ]);
}

export function createPriorityArbitrationStore(initial?: PriorityArbitrationStoreState): {
  getState(): PriorityArbitrationStoreState;
  upsertExecutiveArbitrations(
    arbitrations: ExecutivePriorityArbitration[],
    now?: number
  ): PriorityArbitrationStoreState;
  upsertSnapshots(
    snapshots: MultiObjectiveDecisionSnapshot[],
    now?: number
  ): PriorityArbitrationStoreState;
  upsertPriorityConflicts(
    conflicts: StrategicPriorityConflict[],
    now?: number
  ): PriorityArbitrationStoreState;
  upsertDecisionTradeoffs(
    tradeoffs: EnterpriseDecisionTradeoff[],
    now?: number
  ): PriorityArbitrationStoreState;
  upsertBalancingSignals(
    signals: OperationalBalancingSignal[],
    now?: number
  ): PriorityArbitrationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): PriorityArbitrationStoreState;
} {
  let state: PriorityArbitrationStoreState = initial ?? {
    executiveArbitrations: [],
    snapshots: [],
    priorityConflicts: [],
    decisionTradeoffs: [],
    balancingSignals: [],
    signature: buildStoreSignature({ executiveArbitrations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): PriorityArbitrationStoreState {
      return {
        ...state,
        executiveArbitrations: state.executiveArbitrations.map((a) => ({ ...a })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        priorityConflicts: state.priorityConflicts.map((c) => ({ ...c })),
        decisionTradeoffs: state.decisionTradeoffs.map((t) => ({ ...t })),
        balancingSignals: state.balancingSignals.map((s) => ({ ...s })),
      };
    },

    upsertExecutiveArbitrations(
      arbitrations: ExecutivePriorityArbitration[],
      now = Date.now()
    ): PriorityArbitrationStoreState {
      const byId = new Map<string, ExecutivePriorityArbitration>();
      for (const a of state.executiveArbitrations) byId.set(a.arbitrationId, a);
      for (const a of arbitrations) {
        const existing = byId.get(a.arbitrationId);
        byId.set(a.arbitrationId, existing ? mergeArbitrations(existing, a) : { ...a });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, PRIORITY_ARBITRATION_MAX_ARBITRATIONS);
      state = {
        ...state,
        executiveArbitrations: Object.freeze(next),
        signature: buildStoreSignature({ executiveArbitrations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: MultiObjectiveDecisionSnapshot[],
      now = Date.now()
    ): PriorityArbitrationStoreState {
      const byId = new Map<string, MultiObjectiveDecisionSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRIORITY_ARBITRATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPriorityConflicts(
      conflicts: StrategicPriorityConflict[],
      now = Date.now()
    ): PriorityArbitrationStoreState {
      const byId = new Map<string, StrategicPriorityConflict>();
      for (const c of state.priorityConflicts) byId.set(c.conflictId, c);
      for (const c of conflicts) byId.set(c.conflictId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRIORITY_ARBITRATION_MAX_CONFLICTS);
      state = { ...state, priorityConflicts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDecisionTradeoffs(
      tradeoffs: EnterpriseDecisionTradeoff[],
      now = Date.now()
    ): PriorityArbitrationStoreState {
      const byId = new Map<string, EnterpriseDecisionTradeoff>();
      for (const t of state.decisionTradeoffs) byId.set(t.tradeoffId, t);
      for (const t of tradeoffs) byId.set(t.tradeoffId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRIORITY_ARBITRATION_MAX_TRADEOFFS);
      state = { ...state, decisionTradeoffs: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBalancingSignals(
      signals: OperationalBalancingSignal[],
      now = Date.now()
    ): PriorityArbitrationStoreState {
      const byId = new Map<string, OperationalBalancingSignal>();
      for (const s of state.balancingSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRIORITY_ARBITRATION_MAX_SIGNALS);
      state = { ...state, balancingSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): PriorityArbitrationStoreState {
      state = {
        executiveArbitrations: [],
        snapshots: [],
        priorityConflicts: [],
        decisionTradeoffs: [],
        balancingSignals: [],
        signature: buildStoreSignature({ executiveArbitrations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPriorityArbitrationStore>>();

export function getPriorityArbitrationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPriorityArbitrationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPriorityArbitrationStores(): void {
  storesByOrganization.clear();
}
