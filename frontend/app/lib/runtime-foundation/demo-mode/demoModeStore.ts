import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  DEMO_MODE_MAX_HISTORY,
  DEMO_MODE_MAX_RISKS,
  DEMO_MODE_MAX_SNAPSHOTS,
} from "./demoModeGuards";
import type {
  ControlledPilotPresentationSnapshot,
  DemoModeHistoryEntry,
  DemoModeStoreState,
  DemoRiskIndicator,
  MVPDemoModeState,
} from "./demoModeTypes";

function buildStoreSignature(state: {
  demoModeSnapshots: readonly MVPDemoModeState[];
}): string {
  return stableSignature([
    "d9-10-7-mvp-demo-mode",
    state.demoModeSnapshots.length,
    state.demoModeSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createDemoModeStore(initial?: DemoModeStoreState): {
  getState(): DemoModeStoreState;
  upsertDemoModeSnapshots(snapshots: MVPDemoModeState[], now?: number): DemoModeStoreState;
  upsertDemoRiskHistory(risks: DemoRiskIndicator[], now?: number): DemoModeStoreState;
  upsertPilotObservations(
    observations: ControlledPilotPresentationSnapshot[],
    now?: number
  ): DemoModeStoreState;
  upsertDemoHistory(entries: DemoModeHistoryEntry[], now?: number): DemoModeStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastDemoState(state: MVPDemoModeState["demoState"]): void;
  clear(): DemoModeStoreState;
} {
  let state: DemoModeStoreState = initial ?? {
    demoModeSnapshots: [],
    demoRiskHistory: [],
    pilotObservations: [],
    demoHistory: [],
    signature: buildStoreSignature({ demoModeSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastDemoState: null,
  };

  return {
    getState(): DemoModeStoreState {
      return {
        ...state,
        demoModeSnapshots: state.demoModeSnapshots.map((s) => ({ ...s })),
        demoRiskHistory: state.demoRiskHistory.map((r) => ({ ...r })),
        pilotObservations: state.pilotObservations.map((p) => ({ ...p })),
        demoHistory: state.demoHistory.map((e) => ({ ...e })),
      };
    },

    upsertDemoModeSnapshots(snapshots: MVPDemoModeState[], now = Date.now()): DemoModeStoreState {
      const bySig = new Map<string, MVPDemoModeState>();
      for (const s of state.demoModeSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DEMO_MODE_MAX_SNAPSHOTS);
      state = {
        ...state,
        demoModeSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ demoModeSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertDemoRiskHistory(risks: DemoRiskIndicator[], now = Date.now()): DemoModeStoreState {
      const byId = new Map<string, DemoRiskIndicator>();
      for (const r of state.demoRiskHistory) byId.set(r.riskId, r);
      for (const r of risks) byId.set(r.riskId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DEMO_MODE_MAX_RISKS);
      state = { ...state, demoRiskHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPilotObservations(
      observations: ControlledPilotPresentationSnapshot[],
      now = Date.now()
    ): DemoModeStoreState {
      const byId = new Map<string, ControlledPilotPresentationSnapshot>();
      for (const p of state.pilotObservations) byId.set(p.presentationId, p);
      for (const p of observations) byId.set(p.presentationId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DEMO_MODE_MAX_SNAPSHOTS);
      state = { ...state, pilotObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDemoHistory(entries: DemoModeHistoryEntry[], now = Date.now()): DemoModeStoreState {
      const byId = new Map<string, DemoModeHistoryEntry>();
      for (const e of state.demoHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DEMO_MODE_MAX_HISTORY);
      state = { ...state, demoHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastDemoState(demoState: MVPDemoModeState["demoState"]): void {
      state = { ...state, lastDemoState: demoState };
    },

    clear(): DemoModeStoreState {
      state = {
        demoModeSnapshots: [],
        demoRiskHistory: [],
        pilotObservations: [],
        demoHistory: [],
        signature: buildStoreSignature({ demoModeSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastDemoState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDemoModeStore>>();

export function getDemoModeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDemoModeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDemoModeStores(): void {
  storesByOrganization.clear();
}
