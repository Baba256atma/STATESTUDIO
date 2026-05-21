import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  PILOT_FEEDBACK_MAX_ENTRIES,
  PILOT_FEEDBACK_MAX_SIGNALS,
  PILOT_FEEDBACK_MAX_SNAPSHOTS,
} from "./pilotFeedbackGuards";
import type {
  ExecutiveFeedbackSignal,
  MVPPilotFeedback,
  PilotFeedbackHistoryEntry,
  PilotFeedbackStoreState,
  PilotLearningSnapshot,
} from "./pilotFeedbackTypes";

const PILOT_FEEDBACK_MAX_HISTORY = 10;

function buildStoreSignature(state: {
  learningSnapshots: readonly PilotLearningSnapshot[];
}): string {
  return stableSignature([
    "d9-10-8-mvp-pilot-feedback-loop",
    state.learningSnapshots.length,
    state.learningSnapshots[0]?.signature ?? "empty",
  ]);
}

export function createPilotFeedbackStore(initial?: PilotFeedbackStoreState): {
  getState(): PilotFeedbackStoreState;
  upsertFeedbackEntries(entries: MVPPilotFeedback[], now?: number): PilotFeedbackStoreState;
  upsertLearningSnapshots(snapshots: PilotLearningSnapshot[], now?: number): PilotFeedbackStoreState;
  upsertImprovementSignals(signals: ExecutiveFeedbackSignal[], now?: number): PilotFeedbackStoreState;
  upsertFeedbackHistory(entries: PilotFeedbackHistoryEntry[], now?: number): PilotFeedbackStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): PilotFeedbackStoreState;
} {
  let state: PilotFeedbackStoreState = initial ?? {
    feedbackEntries: [],
    learningSnapshots: [],
    improvementSignals: [],
    feedbackHistory: [],
    signature: buildStoreSignature({ learningSnapshots: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): PilotFeedbackStoreState {
      return {
        ...state,
        feedbackEntries: state.feedbackEntries.map((e) => ({ ...e })),
        learningSnapshots: state.learningSnapshots.map((s) => ({ ...s })),
        improvementSignals: state.improvementSignals.map((s) => ({ ...s })),
        feedbackHistory: state.feedbackHistory.map((e) => ({ ...e })),
      };
    },

    upsertFeedbackEntries(entries: MVPPilotFeedback[], now = Date.now()): PilotFeedbackStoreState {
      const bySig = new Map<string, MVPPilotFeedback>();
      for (const e of state.feedbackEntries) bySig.set(e.signature, e);
      for (const e of entries) bySig.set(e.signature, e);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PILOT_FEEDBACK_MAX_ENTRIES);
      state = { ...state, feedbackEntries: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertLearningSnapshots(
      snapshots: PilotLearningSnapshot[],
      now = Date.now()
    ): PilotFeedbackStoreState {
      const bySig = new Map<string, PilotLearningSnapshot>();
      for (const s of state.learningSnapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PILOT_FEEDBACK_MAX_SNAPSHOTS);
      state = {
        ...state,
        learningSnapshots: Object.freeze(next),
        signature: buildStoreSignature({ learningSnapshots: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertImprovementSignals(
      signals: ExecutiveFeedbackSignal[],
      now = Date.now()
    ): PilotFeedbackStoreState {
      const byId = new Map<string, ExecutiveFeedbackSignal>();
      for (const s of state.improvementSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
        .slice(0, PILOT_FEEDBACK_MAX_SIGNALS);
      state = { ...state, improvementSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFeedbackHistory(
      entries: PilotFeedbackHistoryEntry[],
      now = Date.now()
    ): PilotFeedbackStoreState {
      const byId = new Map<string, PilotFeedbackHistoryEntry>();
      for (const e of state.feedbackHistory) byId.set(e.entryId, e);
      for (const e of entries) byId.set(e.entryId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PILOT_FEEDBACK_MAX_HISTORY);
      state = { ...state, feedbackHistory: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): PilotFeedbackStoreState {
      state = {
        feedbackEntries: [],
        learningSnapshots: [],
        improvementSignals: [],
        feedbackHistory: [],
        signature: buildStoreSignature({ learningSnapshots: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPilotFeedbackStore>>();

export function getPilotFeedbackStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPilotFeedbackStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPilotFeedbackStores(): void {
  storesByOrganization.clear();
}
