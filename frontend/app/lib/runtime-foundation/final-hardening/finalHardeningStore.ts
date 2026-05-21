import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  FINAL_HARDENING_MAX_BLOCKERS,
  FINAL_HARDENING_MAX_HISTORY,
  FINAL_HARDENING_MAX_SNAPSHOTS,
} from "./finalHardeningGuards";
import type {
  FinalHardeningHistoryEntry,
  FinalHardeningStoreState,
  FinalStabilizationChecklist,
  HardeningRisk,
  MVPFinalHardeningSnapshot,
} from "./finalStabilizationChecklistTypes";

function buildStoreSignature(state: {
  hardeningSnapshots: readonly MVPFinalHardeningSnapshot[];
}): string {
  return stableSignature([
    "d9-10-9-mvp-final-hardening",
    state.hardeningSnapshots.length,
    state.hardeningSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createFinalHardeningStore(initial?: FinalHardeningStoreState): {
  getState(): FinalHardeningStoreState;
  upsertHardeningSnapshots(
    snapshots: MVPFinalHardeningSnapshot[],
    now?: number
  ): FinalHardeningStoreState;
  upsertChecklistHistory(checklists: FinalStabilizationChecklist[], now?: number): FinalHardeningStoreState;
  upsertBlockerHistory(risks: HardeningRisk[], now?: number): FinalHardeningStoreState;
  upsertReleaseCandidateHistory(
    entries: FinalHardeningHistoryEntry[],
    now?: number
  ): FinalHardeningStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastReleaseCandidateStatus(status: MVPFinalHardeningSnapshot["releaseCandidateStatus"]): void;
  clear(): FinalHardeningStoreState;
} {
  let state: FinalHardeningStoreState = initial ?? {
    hardeningSnapshots: [],
    checklistHistory: [],
    releaseCandidateHistory: [],
    blockerHistory: [],
    signature: buildStoreSignature({ hardeningSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastReleaseCandidateStatus: null,
  };

  return {
    getState(): FinalHardeningStoreState {
      return {
        ...state,
        hardeningSnapshots: state.hardeningSnapshots.map((s) => ({ ...s })),
        checklistHistory: state.checklistHistory.map((c) => ({ ...c })),
        releaseCandidateHistory: state.releaseCandidateHistory.map((e) => ({ ...e })),
        blockerHistory: state.blockerHistory.map((r) => ({ ...r })),
      };
    },

    upsertHardeningSnapshots(
      snapshots: MVPFinalHardeningSnapshot[],
      now = Date.now()
    ): FinalHardeningStoreState {
      const bySig = new Map<string, MVPFinalHardeningSnapshot>();
      for (const s of state.hardeningSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_HARDENING_MAX_SNAPSHOTS);
      state = {
        ...state,
        hardeningSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ hardeningSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertChecklistHistory(
      checklists: FinalStabilizationChecklist[],
      now = Date.now()
    ): FinalHardeningStoreState {
      const byId = new Map<string, FinalStabilizationChecklist>();
      for (const c of state.checklistHistory) byId.set(c.checklistId, c);
      for (const c of checklists) byId.set(c.checklistId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.passedCount - a.passedCount)
        .slice(0, FINAL_HARDENING_MAX_SNAPSHOTS);
      state = { ...state, checklistHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBlockerHistory(risks: HardeningRisk[], now = Date.now()): FinalHardeningStoreState {
      const byId = new Map<string, HardeningRisk>();
      for (const r of state.blockerHistory) byId.set(r.riskId, r);
      for (const r of risks) byId.set(r.riskId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_HARDENING_MAX_BLOCKERS);
      state = { ...state, blockerHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReleaseCandidateHistory(
      entries: FinalHardeningHistoryEntry[],
      now = Date.now()
    ): FinalHardeningStoreState {
      const byId = new Map<string, FinalHardeningHistoryEntry>();
      for (const e of state.releaseCandidateHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, FINAL_HARDENING_MAX_HISTORY);
      state = { ...state, releaseCandidateHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastReleaseCandidateStatus(status: MVPFinalHardeningSnapshot["releaseCandidateStatus"]): void {
      state = { ...state, lastReleaseCandidateStatus: status };
    },

    clear(): FinalHardeningStoreState {
      state = {
        hardeningSnapshots: [],
        checklistHistory: [],
        releaseCandidateHistory: [],
        blockerHistory: [],
        signature: buildStoreSignature({ hardeningSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastReleaseCandidateStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createFinalHardeningStore>>();

export function getFinalHardeningStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createFinalHardeningStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetFinalHardeningStores(): void {
  storesByOrganization.clear();
}
