import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DECISION_OUTCOME_MAX_CORRELATIONS,
  DECISION_OUTCOME_MAX_OBSERVATIONS,
  DECISION_OUTCOME_MAX_PATTERNS,
  DECISION_OUTCOME_MAX_RECORDS,
} from "./decisionOutcomeGuards";
import type {
  DecisionOutcomeStoreState,
  ExecutiveConsequencePattern,
  InstitutionalDecisionRecord,
  OperationalOutcomeObservation,
  StrategicOutcomeCorrelation,
} from "./decisionOutcomeTypes";

function impactRank(level: InstitutionalDecisionRecord["impactLevel"]): number {
  const ranks: Record<InstitutionalDecisionRecord["impactLevel"], number> = {
    minimal: 1,
    moderate: 2,
    significant: 3,
    major: 4,
    systemic: 5,
  };
  return ranks[level];
}

function mergeDecisions(
  existing: InstitutionalDecisionRecord,
  incoming: InstitutionalDecisionRecord
): InstitutionalDecisionRecord {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    impactLevel:
      impactRank(incoming.impactLevel) > impactRank(existing.impactLevel)
        ? incoming.impactLevel
        : existing.impactLevel,
    confidence: Math.max(existing.confidence, incoming.confidence),
    observations: Object.freeze(
      Array.from(new Set([...existing.observations, ...incoming.observations])).slice(0, 6)
    ),
    linkedMemoryIds: Object.freeze(
      Array.from(new Set([...existing.linkedMemoryIds, ...incoming.linkedMemoryIds])).slice(0, 8)
    ),
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  decisions: readonly InstitutionalDecisionRecord[];
  patterns: readonly ExecutiveConsequencePattern[];
}): string {
  return stableSignature([
    "d9-2-4-decision-outcome",
    state.decisions.length,
    state.patterns.length,
    state.decisions.slice(0, 3).map((d) => d.decisionOutcomeId),
  ]);
}

export function createDecisionOutcomeStore(initial?: DecisionOutcomeStoreState): {
  getState(): DecisionOutcomeStoreState;
  upsertDecisions(
    records: InstitutionalDecisionRecord[],
    now?: number
  ): DecisionOutcomeStoreState;
  upsertObservations(
    observations: OperationalOutcomeObservation[],
    now?: number
  ): DecisionOutcomeStoreState;
  upsertPatterns(
    patterns: ExecutiveConsequencePattern[],
    now?: number
  ): DecisionOutcomeStoreState;
  upsertCorrelations(
    correlations: StrategicOutcomeCorrelation[],
    now?: number
  ): DecisionOutcomeStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): DecisionOutcomeStoreState;
} {
  let state: DecisionOutcomeStoreState = initial ?? {
    decisions: [],
    observations: [],
    patterns: [],
    correlations: [],
    signature: buildStoreSignature({ decisions: [], patterns: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): DecisionOutcomeStoreState {
      return {
        ...state,
        decisions: state.decisions.map((d) => ({ ...d })),
        observations: state.observations.map((o) => ({ ...o })),
        patterns: state.patterns.map((p) => ({ ...p })),
        correlations: state.correlations.map((c) => ({ ...c })),
      };
    },

    upsertDecisions(
      records: InstitutionalDecisionRecord[],
      now = Date.now()
    ): DecisionOutcomeStoreState {
      const byId = new Map<string, InstitutionalDecisionRecord>();
      for (const d of state.decisions) byId.set(d.decisionOutcomeId, d);
      for (const d of records) {
        const existing = byId.get(d.decisionOutcomeId);
        byId.set(d.decisionOutcomeId, existing ? mergeDecisions(existing, d) : { ...d });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DECISION_OUTCOME_MAX_RECORDS);
      state = {
        ...state,
        decisions: Object.freeze(next),
        signature: buildStoreSignature({ decisions: next, patterns: state.patterns }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertObservations(
      observations: OperationalOutcomeObservation[],
      now = Date.now()
    ): DecisionOutcomeStoreState {
      const byId = new Map<string, OperationalOutcomeObservation>();
      for (const o of state.observations) byId.set(o.observationId, o);
      for (const o of observations) byId.set(o.observationId, o);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_OUTCOME_MAX_OBSERVATIONS);
      state = { ...state, observations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPatterns(
      patterns: ExecutiveConsequencePattern[],
      now = Date.now()
    ): DecisionOutcomeStoreState {
      const byId = new Map<string, ExecutiveConsequencePattern>();
      for (const p of state.patterns) byId.set(p.patternId, p);
      for (const p of patterns) {
        const existing = byId.get(p.patternId);
        if (!existing) {
          byId.set(p.patternId, { ...p });
          continue;
        }
        byId.set(p.patternId, {
          ...existing,
          lesson: p.lesson || existing.lesson,
          occurrenceCount: existing.occurrenceCount + 1,
          lastObservedAt: Math.max(existing.lastObservedAt, p.lastObservedAt),
        });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DECISION_OUTCOME_MAX_PATTERNS);
      state = {
        ...state,
        patterns: Object.freeze(next),
        signature: buildStoreSignature({ decisions: state.decisions, patterns: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertCorrelations(
      correlations: StrategicOutcomeCorrelation[],
      now = Date.now()
    ): DecisionOutcomeStoreState {
      const byId = new Map<string, StrategicOutcomeCorrelation>();
      for (const c of state.correlations) byId.set(c.correlationId, c);
      for (const c of correlations) byId.set(c.correlationId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_OUTCOME_MAX_CORRELATIONS);
      state = { ...state, correlations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): DecisionOutcomeStoreState {
      state = {
        decisions: [],
        observations: [],
        patterns: [],
        correlations: [],
        signature: buildStoreSignature({ decisions: [], patterns: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDecisionOutcomeStore>>();

export function getDecisionOutcomeStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDecisionOutcomeStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDecisionOutcomeStores(): void {
  storesByOrganization.clear();
}
