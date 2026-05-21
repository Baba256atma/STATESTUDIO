import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ADVISORY_FORESIGHT_MAX_FOCUS_SUGGESTIONS,
  ADVISORY_FORESIGHT_MAX_PRIORITY_FIELDS,
  ADVISORY_FORESIGHT_MAX_RECOMMENDATIONS,
  ADVISORY_FORESIGHT_MAX_SIGNALS,
  ADVISORY_FORESIGHT_MAX_SNAPSHOTS,
} from "./advisoryForesightGuards";
import type {
  AdvisoryForesightStoreState,
  AdvisoryPriorityField,
  EnterpriseRecommendationSnapshot,
  ExecutiveGuidanceRecommendation,
  OrganizationalFocusSuggestion,
  StrategicAdvisorySignal,
} from "./advisoryForesightTypes";

function mergeExecutiveGuidanceRecommendations(
  existing: ExecutiveGuidanceRecommendation,
  incoming: ExecutiveGuidanceRecommendation
): ExecutiveGuidanceRecommendation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    recommendations: Object.freeze(
      Array.from(new Set([...existing.recommendations, ...incoming.recommendations])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    recommendationPriority:
      incoming.confidence >= existing.confidence
        ? incoming.recommendationPriority
        : existing.recommendationPriority,
    advisoryState:
      incoming.confidence >= existing.confidence ? incoming.advisoryState : existing.advisoryState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  executiveGuidanceRecommendations: readonly ExecutiveGuidanceRecommendation[];
}): string {
  return stableSignature([
    "d9-4-8-advisory-foresight",
    state.executiveGuidanceRecommendations.length,
    state.executiveGuidanceRecommendations.slice(0, 3).map((r) => r.advisoryId),
  ]);
}

export function createAdvisoryForesightStore(initial?: AdvisoryForesightStoreState): {
  getState(): AdvisoryForesightStoreState;
  upsertExecutiveGuidanceRecommendations(
    recommendations: ExecutiveGuidanceRecommendation[],
    now?: number
  ): AdvisoryForesightStoreState;
  upsertSnapshots(
    snapshots: EnterpriseRecommendationSnapshot[],
    now?: number
  ): AdvisoryForesightStoreState;
  upsertStrategicAdvisorySignals(
    signals: StrategicAdvisorySignal[],
    now?: number
  ): AdvisoryForesightStoreState;
  upsertOrganizationalFocusSuggestions(
    suggestions: OrganizationalFocusSuggestion[],
    now?: number
  ): AdvisoryForesightStoreState;
  upsertAdvisoryPriorityFields(
    fields: AdvisoryPriorityField[],
    now?: number
  ): AdvisoryForesightStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): AdvisoryForesightStoreState;
} {
  let state: AdvisoryForesightStoreState = initial ?? {
    executiveGuidanceRecommendations: [],
    snapshots: [],
    strategicAdvisorySignals: [],
    organizationalFocusSuggestions: [],
    advisoryPriorityFields: [],
    signature: buildStoreSignature({ executiveGuidanceRecommendations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): AdvisoryForesightStoreState {
      return {
        ...state,
        executiveGuidanceRecommendations: state.executiveGuidanceRecommendations.map((r) => ({
          ...r,
        })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        strategicAdvisorySignals: state.strategicAdvisorySignals.map((s) => ({ ...s })),
        organizationalFocusSuggestions: state.organizationalFocusSuggestions.map((s) => ({
          ...s,
        })),
        advisoryPriorityFields: state.advisoryPriorityFields.map((f) => ({ ...f })),
      };
    },

    upsertExecutiveGuidanceRecommendations(
      recommendations: ExecutiveGuidanceRecommendation[],
      now = Date.now()
    ): AdvisoryForesightStoreState {
      const byId = new Map<string, ExecutiveGuidanceRecommendation>();
      for (const r of state.executiveGuidanceRecommendations) byId.set(r.advisoryId, r);
      for (const r of recommendations) {
        const existing = byId.get(r.advisoryId);
        byId.set(
          r.advisoryId,
          existing ? mergeExecutiveGuidanceRecommendations(existing, r) : { ...r }
        );
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ADVISORY_FORESIGHT_MAX_RECOMMENDATIONS);
      state = {
        ...state,
        executiveGuidanceRecommendations: Object.freeze(next),
        signature: buildStoreSignature({ executiveGuidanceRecommendations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseRecommendationSnapshot[],
      now = Date.now()
    ): AdvisoryForesightStoreState {
      const byId = new Map<string, EnterpriseRecommendationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADVISORY_FORESIGHT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicAdvisorySignals(
      signals: StrategicAdvisorySignal[],
      now = Date.now()
    ): AdvisoryForesightStoreState {
      const byId = new Map<string, StrategicAdvisorySignal>();
      for (const s of state.strategicAdvisorySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADVISORY_FORESIGHT_MAX_SIGNALS);
      state = { ...state, strategicAdvisorySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertOrganizationalFocusSuggestions(
      suggestions: OrganizationalFocusSuggestion[],
      now = Date.now()
    ): AdvisoryForesightStoreState {
      const byId = new Map<string, OrganizationalFocusSuggestion>();
      for (const s of state.organizationalFocusSuggestions) byId.set(s.suggestionId, s);
      for (const s of suggestions) byId.set(s.suggestionId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADVISORY_FORESIGHT_MAX_FOCUS_SUGGESTIONS);
      state = { ...state, organizationalFocusSuggestions: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdvisoryPriorityFields(
      fields: AdvisoryPriorityField[],
      now = Date.now()
    ): AdvisoryForesightStoreState {
      const byId = new Map<string, AdvisoryPriorityField>();
      for (const f of state.advisoryPriorityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ADVISORY_FORESIGHT_MAX_PRIORITY_FIELDS);
      state = { ...state, advisoryPriorityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): AdvisoryForesightStoreState {
      state = {
        executiveGuidanceRecommendations: [],
        snapshots: [],
        strategicAdvisorySignals: [],
        organizationalFocusSuggestions: [],
        advisoryPriorityFields: [],
        signature: buildStoreSignature({ executiveGuidanceRecommendations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createAdvisoryForesightStore>>();

export function getAdvisoryForesightStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createAdvisoryForesightStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetAdvisoryForesightStores(): void {
  storesByOrganization.clear();
}
