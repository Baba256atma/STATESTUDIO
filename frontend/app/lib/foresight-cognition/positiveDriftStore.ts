import { stableSignature } from "../intelligence/shared/dedupe";
import {
  POSITIVE_DRIFT_MAX_EVOLUTION_SIGNALS,
  POSITIVE_DRIFT_MAX_OPPORTUNITY_FIELDS,
  POSITIVE_DRIFT_MAX_PATTERNS,
  POSITIVE_DRIFT_MAX_SIGNALS,
  POSITIVE_DRIFT_MAX_SNAPSHOTS,
} from "./positiveDriftGuards";
import type {
  AdaptiveEvolutionSignal,
  OrganizationalGrowthPattern,
  PositiveDriftStoreState,
  PositiveTrajectorySnapshot,
  ResilienceOpportunityField,
  StrategicOpportunitySignal,
} from "./positiveDriftTypes";

function mergeStrategicOpportunitySignals(
  existing: StrategicOpportunitySignal,
  incoming: StrategicOpportunitySignal
): StrategicOpportunitySignal {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    opportunitySignals: Object.freeze(
      Array.from(new Set([...existing.opportunitySignals, ...incoming.opportunitySignals])).slice(
        0,
        6
      )
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    opportunityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.opportunityStrength
        : existing.opportunityStrength,
    positiveDriftState:
      incoming.confidence >= existing.confidence
        ? incoming.positiveDriftState
        : existing.positiveDriftState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  strategicOpportunitySignals: readonly StrategicOpportunitySignal[];
}): string {
  return stableSignature([
    "d9-4-4-positive-drift",
    state.strategicOpportunitySignals.length,
    state.strategicOpportunitySignals.slice(0, 3).map((s) => s.opportunityId),
  ]);
}

export function createPositiveDriftStore(initial?: PositiveDriftStoreState): {
  getState(): PositiveDriftStoreState;
  upsertStrategicOpportunitySignals(
    signals: StrategicOpportunitySignal[],
    now?: number
  ): PositiveDriftStoreState;
  upsertSnapshots(
    snapshots: PositiveTrajectorySnapshot[],
    now?: number
  ): PositiveDriftStoreState;
  upsertGrowthPatterns(
    patterns: OrganizationalGrowthPattern[],
    now?: number
  ): PositiveDriftStoreState;
  upsertResilienceOpportunityFields(
    fields: ResilienceOpportunityField[],
    now?: number
  ): PositiveDriftStoreState;
  upsertAdaptiveEvolutionSignals(
    signals: AdaptiveEvolutionSignal[],
    now?: number
  ): PositiveDriftStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): PositiveDriftStoreState;
} {
  let state: PositiveDriftStoreState = initial ?? {
    strategicOpportunitySignals: [],
    snapshots: [],
    growthPatterns: [],
    resilienceOpportunityFields: [],
    adaptiveEvolutionSignals: [],
    signature: buildStoreSignature({ strategicOpportunitySignals: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): PositiveDriftStoreState {
      return {
        ...state,
        strategicOpportunitySignals: state.strategicOpportunitySignals.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        growthPatterns: state.growthPatterns.map((p) => ({ ...p })),
        resilienceOpportunityFields: state.resilienceOpportunityFields.map((f) => ({ ...f })),
        adaptiveEvolutionSignals: state.adaptiveEvolutionSignals.map((s) => ({ ...s })),
      };
    },

    upsertStrategicOpportunitySignals(
      signals: StrategicOpportunitySignal[],
      now = Date.now()
    ): PositiveDriftStoreState {
      const byId = new Map<string, StrategicOpportunitySignal>();
      for (const s of state.strategicOpportunitySignals) byId.set(s.opportunityId, s);
      for (const s of signals) {
        const existing = byId.get(s.opportunityId);
        byId.set(s.opportunityId, existing ? mergeStrategicOpportunitySignals(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, POSITIVE_DRIFT_MAX_SIGNALS);
      state = {
        ...state,
        strategicOpportunitySignals: Object.freeze(next),
        signature: buildStoreSignature({ strategicOpportunitySignals: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: PositiveTrajectorySnapshot[],
      now = Date.now()
    ): PositiveDriftStoreState {
      const byId = new Map<string, PositiveTrajectorySnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, POSITIVE_DRIFT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGrowthPatterns(
      patterns: OrganizationalGrowthPattern[],
      now = Date.now()
    ): PositiveDriftStoreState {
      const byId = new Map<string, OrganizationalGrowthPattern>();
      for (const p of state.growthPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, POSITIVE_DRIFT_MAX_PATTERNS);
      state = { ...state, growthPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResilienceOpportunityFields(
      fields: ResilienceOpportunityField[],
      now = Date.now()
    ): PositiveDriftStoreState {
      const byId = new Map<string, ResilienceOpportunityField>();
      for (const f of state.resilienceOpportunityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, POSITIVE_DRIFT_MAX_OPPORTUNITY_FIELDS);
      state = { ...state, resilienceOpportunityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptiveEvolutionSignals(
      signals: AdaptiveEvolutionSignal[],
      now = Date.now()
    ): PositiveDriftStoreState {
      const byId = new Map<string, AdaptiveEvolutionSignal>();
      for (const s of state.adaptiveEvolutionSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, POSITIVE_DRIFT_MAX_EVOLUTION_SIGNALS);
      state = { ...state, adaptiveEvolutionSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): PositiveDriftStoreState {
      state = {
        strategicOpportunitySignals: [],
        snapshots: [],
        growthPatterns: [],
        resilienceOpportunityFields: [],
        adaptiveEvolutionSignals: [],
        signature: buildStoreSignature({ strategicOpportunitySignals: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPositiveDriftStore>>();

export function getPositiveDriftStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPositiveDriftStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPositiveDriftStores(): void {
  storesByOrganization.clear();
}
