import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRATEGIC_DEBATE_MAX_DEBATES,
  STRATEGIC_DEBATE_MAX_PROJECTIONS,
  STRATEGIC_DEBATE_MAX_SIGNALS,
  STRATEGIC_DEBATE_MAX_SNAPSHOTS,
  STRATEGIC_DEBATE_MAX_STRESS_FIELDS,
} from "./strategicDebateGuards";
import type {
  AlternativeStrategyProjection,
  AssumptionStressField,
  CounterfactualReasoningSnapshot,
  CounterfactualState,
  EnterpriseChallengeSignal,
  ExecutiveStrategicDebate,
  StrategicDebateStoreState,
} from "./strategicDebateTypes";

function mergeDebates(
  existing: ExecutiveStrategicDebate,
  incoming: ExecutiveStrategicDebate
): ExecutiveStrategicDebate {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    challengedAssumptions: Object.freeze(
      Array.from(new Set([...existing.challengedAssumptions, ...incoming.challengedAssumptions])).slice(
        0,
        6
      )
    ),
    reinforcedStrategies: Object.freeze(
      Array.from(new Set([...existing.reinforcedStrategies, ...incoming.reinforcedStrategies])).slice(
        0,
        6
      )
    ),
    counterfactualSignals: Object.freeze(
      Array.from(new Set([...existing.counterfactualSignals, ...incoming.counterfactualSignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    counterfactualState:
      incoming.confidence >= existing.confidence
        ? incoming.counterfactualState
        : existing.counterfactualState,
    debateStrength:
      incoming.confidence >= existing.confidence ? incoming.debateStrength : existing.debateStrength,
    debateCategory:
      incoming.confidence >= existing.confidence ? incoming.debateCategory : existing.debateCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: { debates: readonly ExecutiveStrategicDebate[] }): string {
  return stableSignature([
    "d9-7-5-strategic-debate",
    state.debates.length,
    state.debates.slice(0, 3).map((d) => d.debateId),
  ]);
}

export function createStrategicDebateStore(initial?: StrategicDebateStoreState): {
  getState(): StrategicDebateStoreState;
  upsertDebates(debates: ExecutiveStrategicDebate[], now?: number): StrategicDebateStoreState;
  upsertSnapshots(
    snapshots: CounterfactualReasoningSnapshot[],
    now?: number
  ): StrategicDebateStoreState;
  upsertAlternativeProjections(
    projections: AlternativeStrategyProjection[],
    now?: number
  ): StrategicDebateStoreState;
  upsertChallengeSignals(
    signals: EnterpriseChallengeSignal[],
    now?: number
  ): StrategicDebateStoreState;
  upsertAssumptionStressFields(
    fields: AssumptionStressField[],
    now?: number
  ): StrategicDebateStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCounterfactualState(state: CounterfactualState): void;
  clear(): StrategicDebateStoreState;
} {
  let state: StrategicDebateStoreState = initial ?? {
    debates: [],
    snapshots: [],
    alternativeProjections: [],
    challengeSignals: [],
    assumptionStressFields: [],
    signature: buildStoreSignature({ debates: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCounterfactualState: null,
  };

  return {
    getState(): StrategicDebateStoreState {
      return {
        ...state,
        debates: state.debates.map((d) => ({ ...d })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        alternativeProjections: state.alternativeProjections.map((p) => ({ ...p })),
        challengeSignals: state.challengeSignals.map((s) => ({ ...s })),
        assumptionStressFields: state.assumptionStressFields.map((f) => ({ ...f })),
      };
    },

    upsertDebates(debates: ExecutiveStrategicDebate[], now = Date.now()): StrategicDebateStoreState {
      const byId = new Map<string, ExecutiveStrategicDebate>();
      for (const d of state.debates) byId.set(d.debateId, d);
      for (const d of debates) {
        const existing = byId.get(d.debateId);
        byId.set(d.debateId, existing ? mergeDebates(existing, d) : d);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRATEGIC_DEBATE_MAX_DEBATES);
      state = {
        ...state,
        debates: Object.freeze(next),
        signature: buildStoreSignature({ debates: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CounterfactualReasoningSnapshot[],
      now = Date.now()
    ): StrategicDebateStoreState {
      const bySig = new Map<string, CounterfactualReasoningSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_DEBATE_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlternativeProjections(
      projections: AlternativeStrategyProjection[],
      now = Date.now()
    ): StrategicDebateStoreState {
      const byId = new Map<string, AlternativeStrategyProjection>();
      for (const p of state.alternativeProjections) byId.set(p.projectionId, p);
      for (const p of projections) byId.set(p.projectionId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_DEBATE_MAX_PROJECTIONS);
      state = { ...state, alternativeProjections: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertChallengeSignals(
      signals: EnterpriseChallengeSignal[],
      now = Date.now()
    ): StrategicDebateStoreState {
      const byId = new Map<string, EnterpriseChallengeSignal>();
      for (const s of state.challengeSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_DEBATE_MAX_SIGNALS);
      state = { ...state, challengeSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAssumptionStressFields(
      fields: AssumptionStressField[],
      now = Date.now()
    ): StrategicDebateStoreState {
      const byId = new Map<string, AssumptionStressField>();
      for (const f of state.assumptionStressFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRATEGIC_DEBATE_MAX_STRESS_FIELDS);
      state = { ...state, assumptionStressFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCounterfactualState(counterfactualState: CounterfactualState): void {
      state = { ...state, lastCounterfactualState: counterfactualState };
    },

    clear(): StrategicDebateStoreState {
      state = {
        debates: [],
        snapshots: [],
        alternativeProjections: [],
        challengeSignals: [],
        assumptionStressFields: [],
        signature: buildStoreSignature({ debates: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCounterfactualState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStrategicDebateStore>>();

export function getStrategicDebateStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStrategicDebateStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStrategicDebateStores(): void {
  storesByOrganization.clear();
}
