import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ADAPTIVE_SEQUENCING_MAX_EVOLUTIONS,
  ADAPTIVE_SEQUENCING_MAX_SEQUENCES,
  ADAPTIVE_SEQUENCING_MAX_SHIFTS,
  ADAPTIVE_SEQUENCING_MAX_SIGNALS,
  ADAPTIVE_SEQUENCING_MAX_SNAPSHOTS,
  ADAPTIVE_SEQUENCING_MAX_TRANSITIONS,
} from "./adaptiveSequencingGuards";
import type {
  AdaptiveDecisionSequence,
  AdaptiveSequencingSnapshot,
  AdaptiveSequencingStoreState,
  DynamicResponseEvolution,
  EnterpriseResponseTransition,
  OperationalPriorityShift,
  SequencingAdaptationSignal,
} from "./adaptiveSequencingTypes";

function mergeSequences(
  existing: AdaptiveDecisionSequence,
  incoming: AdaptiveDecisionSequence
): AdaptiveDecisionSequence {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    sequencingTransitions: Object.freeze(
      incoming.sequencingTransitions.length >= existing.sequencingTransitions.length
        ? incoming.sequencingTransitions
        : existing.sequencingTransitions
    ),
    adaptationSignals: Object.freeze(
      Array.from(new Set([...existing.adaptationSignals, ...incoming.adaptationSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    sequencingState:
      incoming.confidence >= existing.confidence
        ? incoming.sequencingState
        : existing.sequencingState,
    adaptationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationStrength
        : existing.adaptationStrength,
    adaptationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.adaptationCategory
        : existing.adaptationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  adaptiveSequences: readonly AdaptiveDecisionSequence[];
}): string {
  return stableSignature([
    "d9-5-5-adaptive-sequencing",
    state.adaptiveSequences.length,
    state.adaptiveSequences.slice(0, 3).map((s) => s.adaptiveSequenceId),
  ]);
}

export function createAdaptiveSequencingStore(initial?: AdaptiveSequencingStoreState): {
  getState(): AdaptiveSequencingStoreState;
  upsertAdaptiveSequences(
    sequences: AdaptiveDecisionSequence[],
    now?: number
  ): AdaptiveSequencingStoreState;
  upsertSnapshots(
    snapshots: AdaptiveSequencingSnapshot[],
    now?: number
  ): AdaptiveSequencingStoreState;
  upsertResponseEvolutions(
    evolutions: DynamicResponseEvolution[],
    now?: number
  ): AdaptiveSequencingStoreState;
  upsertResponseTransitions(
    transitions: EnterpriseResponseTransition[],
    now?: number
  ): AdaptiveSequencingStoreState;
  upsertPriorityShifts(
    shifts: OperationalPriorityShift[],
    now?: number
  ): AdaptiveSequencingStoreState;
  upsertAdaptationSignals(
    signals: SequencingAdaptationSignal[],
    now?: number
  ): AdaptiveSequencingStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): AdaptiveSequencingStoreState;
} {
  let state: AdaptiveSequencingStoreState = initial ?? {
    adaptiveSequences: [],
    snapshots: [],
    responseEvolutions: [],
    responseTransitions: [],
    priorityShifts: [],
    adaptationSignals: [],
    signature: buildStoreSignature({ adaptiveSequences: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): AdaptiveSequencingStoreState {
      return {
        ...state,
        adaptiveSequences: state.adaptiveSequences.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        responseEvolutions: state.responseEvolutions.map((e) => ({ ...e })),
        responseTransitions: state.responseTransitions.map((t) => ({ ...t })),
        priorityShifts: state.priorityShifts.map((s) => ({ ...s })),
        adaptationSignals: state.adaptationSignals.map((s) => ({ ...s })),
      };
    },

    upsertAdaptiveSequences(
      sequences: AdaptiveDecisionSequence[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, AdaptiveDecisionSequence>();
      for (const s of state.adaptiveSequences) byId.set(s.adaptiveSequenceId, s);
      for (const s of sequences) {
        const existing = byId.get(s.adaptiveSequenceId);
        byId.set(s.adaptiveSequenceId, existing ? mergeSequences(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_SEQUENCES);
      state = {
        ...state,
        adaptiveSequences: Object.freeze(next),
        signature: buildStoreSignature({ adaptiveSequences: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: AdaptiveSequencingSnapshot[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, AdaptiveSequencingSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResponseEvolutions(
      evolutions: DynamicResponseEvolution[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, DynamicResponseEvolution>();
      for (const e of state.responseEvolutions) byId.set(e.evolutionId, e);
      for (const e of evolutions) {
        const existing = byId.get(e.evolutionId);
        byId.set(
          e.evolutionId,
          existing
            ? {
                ...existing,
                ...e,
                occurrenceCount: existing.occurrenceCount + (e.occurrenceCount || 1),
              }
            : { ...e }
        );
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_EVOLUTIONS);
      state = { ...state, responseEvolutions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResponseTransitions(
      transitions: EnterpriseResponseTransition[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, EnterpriseResponseTransition>();
      for (const t of state.responseTransitions) byId.set(t.transitionId, t);
      for (const t of transitions) byId.set(t.transitionId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_TRANSITIONS);
      state = { ...state, responseTransitions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPriorityShifts(
      shifts: OperationalPriorityShift[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, OperationalPriorityShift>();
      for (const s of state.priorityShifts) byId.set(s.shiftId, s);
      for (const s of shifts) byId.set(s.shiftId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_SHIFTS);
      state = { ...state, priorityShifts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptationSignals(
      signals: SequencingAdaptationSignal[],
      now = Date.now()
    ): AdaptiveSequencingStoreState {
      const byId = new Map<string, SequencingAdaptationSignal>();
      for (const s of state.adaptationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADAPTIVE_SEQUENCING_MAX_SIGNALS);
      state = { ...state, adaptationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): AdaptiveSequencingStoreState {
      state = {
        adaptiveSequences: [],
        snapshots: [],
        responseEvolutions: [],
        responseTransitions: [],
        priorityShifts: [],
        adaptationSignals: [],
        signature: buildStoreSignature({ adaptiveSequences: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createAdaptiveSequencingStore>>();

export function getAdaptiveSequencingStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createAdaptiveSequencingStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetAdaptiveSequencingStores(): void {
  storesByOrganization.clear();
}
