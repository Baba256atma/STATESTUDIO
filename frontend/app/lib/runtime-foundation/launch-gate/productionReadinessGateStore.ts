import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  PRODUCTION_READINESS_GATE_MAX_BLOCKERS,
  PRODUCTION_READINESS_GATE_MAX_HISTORY,
  PRODUCTION_READINESS_GATE_MAX_RISKS,
  PRODUCTION_READINESS_GATE_MAX_SNAPSHOTS,
} from "./productionReadinessGateGuards";
import type {
  LaunchBlocker,
  LaunchRisk,
  MVPProductionReadinessGate,
  ProductionReadinessGateHistoryEntry,
  ProductionReadinessGateState,
} from "./productionReadinessGateTypes";

function buildStoreSignature(state: {
  readinessGates: readonly MVPProductionReadinessGate[];
}): string {
  return stableSignature([
    "d9-10-6-mvp-production-readiness-gate",
    state.readinessGates.length,
    state.readinessGates[0]?.signature ?? "empty",
  ]);
}

export function createProductionReadinessGateStore(
  initial?: ProductionReadinessGateState
): {
  getState(): ProductionReadinessGateState;
  upsertReadinessGates(gates: MVPProductionReadinessGate[], now?: number): ProductionReadinessGateState;
  upsertBlockerHistory(blockers: LaunchBlocker[], now?: number): ProductionReadinessGateState;
  upsertLaunchRiskHistory(risks: LaunchRisk[], now?: number): ProductionReadinessGateState;
  upsertGateHistory(entries: ProductionReadinessGateHistoryEntry[], now?: number): ProductionReadinessGateState;
  setLastEvaluationSignature(signature: string): void;
  setLastLaunchDecision(decision: MVPProductionReadinessGate["decision"]): void;
  clear(): ProductionReadinessGateState;
} {
  let state: ProductionReadinessGateState = initial ?? {
    readinessGates: [],
    blockerHistory: [],
    launchRiskHistory: [],
    gateHistory: [],
    signature: buildStoreSignature({ readinessGates: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastLaunchDecision: null,
  };

  return {
    getState(): ProductionReadinessGateState {
      return {
        ...state,
        readinessGates: state.readinessGates.map((g) => ({ ...g })),
        blockerHistory: state.blockerHistory.map((b) => ({ ...b })),
        launchRiskHistory: state.launchRiskHistory.map((r) => ({ ...r })),
        gateHistory: state.gateHistory.map((e) => ({ ...e })),
      };
    },

    upsertReadinessGates(gates: MVPProductionReadinessGate[], now = Date.now()): ProductionReadinessGateState {
      const bySig = new Map<string, MVPProductionReadinessGate>();
      for (const g of state.readinessGates) bySig.set(g.signature, g);
      for (const g of gates) bySig.set(g.signature, g);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRODUCTION_READINESS_GATE_MAX_SNAPSHOTS);
      state = {
        ...state,
        readinessGates: Object.freeze(next),
        signature: buildStoreSignature({ readinessGates: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertBlockerHistory(blockers: LaunchBlocker[], now = Date.now()): ProductionReadinessGateState {
      const byId = new Map<string, LaunchBlocker>();
      for (const b of state.blockerHistory) byId.set(b.blockerId, b);
      for (const b of blockers) byId.set(b.blockerId, b);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRODUCTION_READINESS_GATE_MAX_BLOCKERS);
      state = { ...state, blockerHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLaunchRiskHistory(risks: LaunchRisk[], now = Date.now()): ProductionReadinessGateState {
      const byId = new Map<string, LaunchRisk>();
      for (const r of state.launchRiskHistory) byId.set(r.riskId, r);
      for (const r of risks) byId.set(r.riskId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRODUCTION_READINESS_GATE_MAX_RISKS);
      state = { ...state, launchRiskHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGateHistory(
      entries: ProductionReadinessGateHistoryEntry[],
      now = Date.now()
    ): ProductionReadinessGateState {
      const byId = new Map<string, ProductionReadinessGateHistoryEntry>();
      for (const e of state.gateHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PRODUCTION_READINESS_GATE_MAX_HISTORY);
      state = { ...state, gateHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastLaunchDecision(decision: MVPProductionReadinessGate["decision"]): void {
      state = { ...state, lastLaunchDecision: decision };
    },

    clear(): ProductionReadinessGateState {
      state = {
        readinessGates: [],
        blockerHistory: [],
        launchRiskHistory: [],
        gateHistory: [],
        signature: buildStoreSignature({ readinessGates: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastLaunchDecision: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createProductionReadinessGateStore>
>();

export function getProductionReadinessGateStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createProductionReadinessGateStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetProductionReadinessGateStores(): void {
  storesByOrganization.clear();
}
