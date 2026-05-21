import { stableSignature } from "../intelligence/shared/dedupe";
import {
  EXECUTIVE_INTERACTION_STABILITY_MAX_HISTORY,
  EXECUTIVE_INTERACTION_STABILITY_MAX_OBSERVATIONS,
  EXECUTIVE_INTERACTION_STABILITY_MAX_SNAPSHOTS,
} from "./executiveInteractionStabilityGuards";
import type {
  ExecutiveInteractionStabilityHistoryEntry,
  ExecutiveInteractionStabilitySnapshot,
  ExecutiveInteractionStabilityState,
  ExecutiveUIState,
  InteractionStabilityObservation,
} from "./executiveInteractionStabilityTypes";

function buildStoreSignature(state: {
  stabilitySnapshots: readonly ExecutiveInteractionStabilitySnapshot[];
}): string {
  return stableSignature([
    "d9-10-3-executive-interaction-stability",
    state.stabilitySnapshots.length,
    state.stabilitySnapshots[0]?.signature ?? "empty",
  ]);
}

export function createExecutiveInteractionStabilityStore(
  initial?: ExecutiveInteractionStabilityState
): {
  getState(): ExecutiveInteractionStabilityState;
  upsertStabilitySnapshots(
    snapshots: ExecutiveInteractionStabilitySnapshot[],
    now?: number
  ): ExecutiveInteractionStabilityState;
  upsertInteractionObservations(
    observations: InteractionStabilityObservation[],
    now?: number
  ): ExecutiveInteractionStabilityState;
  upsertInteractionHistory(
    entries: ExecutiveInteractionStabilityHistoryEntry[],
    now?: number
  ): ExecutiveInteractionStabilityState;
  setLastEvaluationSignature(signature: string): void;
  setLastUIState(state: ExecutiveUIState): void;
  clear(): ExecutiveInteractionStabilityState;
} {
  let state: ExecutiveInteractionStabilityState = initial ?? {
    stabilitySnapshots: [],
    interactionObservations: [],
    interactionHistory: [],
    signature: buildStoreSignature({ stabilitySnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastUIState: null,
  };

  return {
    getState(): ExecutiveInteractionStabilityState {
      return {
        ...state,
        stabilitySnapshots: state.stabilitySnapshots.map((s) => ({ ...s })),
        interactionObservations: state.interactionObservations.map((o) => ({ ...o })),
        interactionHistory: state.interactionHistory.map((e) => ({ ...e })),
      };
    },

    upsertStabilitySnapshots(
      snapshots: ExecutiveInteractionStabilitySnapshot[],
      now = Date.now()
    ): ExecutiveInteractionStabilityState {
      const bySig = new Map<string, ExecutiveInteractionStabilitySnapshot>();
      for (const s of state.stabilitySnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXECUTIVE_INTERACTION_STABILITY_MAX_SNAPSHOTS);
      state = {
        ...state,
        stabilitySnapshots: Object.freeze(next),
        signature: buildStoreSignature({ stabilitySnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertInteractionObservations(
      observations: InteractionStabilityObservation[],
      now = Date.now()
    ): ExecutiveInteractionStabilityState {
      const byId = new Map<string, InteractionStabilityObservation>();
      for (const o of state.interactionObservations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXECUTIVE_INTERACTION_STABILITY_MAX_OBSERVATIONS);
      state = { ...state, interactionObservations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInteractionHistory(
      entries: ExecutiveInteractionStabilityHistoryEntry[],
      now = Date.now()
    ): ExecutiveInteractionStabilityState {
      const byId = new Map<string, ExecutiveInteractionStabilityHistoryEntry>();
      for (const e of state.interactionHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, EXECUTIVE_INTERACTION_STABILITY_MAX_HISTORY);
      state = { ...state, interactionHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastUIState(uiState: ExecutiveUIState): void {
      state = { ...state, lastUIState: uiState };
    },

    clear(): ExecutiveInteractionStabilityState {
      state = {
        stabilitySnapshots: [],
        interactionObservations: [],
        interactionHistory: [],
        signature: buildStoreSignature({ stabilitySnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastUIState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createExecutiveInteractionStabilityStore>
>();

export function getExecutiveInteractionStabilityStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createExecutiveInteractionStabilityStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetExecutiveInteractionStabilityStores(): void {
  storesByOrganization.clear();
}
