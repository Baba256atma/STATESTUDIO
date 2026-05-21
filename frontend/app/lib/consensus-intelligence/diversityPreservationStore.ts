import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DIVERSITY_PRESERVATION_MAX_FIELDS,
  DIVERSITY_PRESERVATION_MAX_INDICATORS,
  DIVERSITY_PRESERVATION_MAX_OBSERVATIONS,
  DIVERSITY_PRESERVATION_MAX_SIGNALS,
  DIVERSITY_PRESERVATION_MAX_SNAPSHOTS,
} from "./diversityPreservationGuards";
import type {
  AntiConsensusFragilitySignal,
  DiversityPreservationStoreState,
  DiversityResilienceObservation,
  EnterpriseGroupthinkIndicator,
  PerspectivePluralityField,
  PluralityState,
  StrategicDiversitySnapshot,
} from "./diversityPreservationTypes";

function mergeObservations(
  existing: DiversityResilienceObservation,
  incoming: DiversityResilienceObservation
): DiversityResilienceObservation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    preservedPerspectives: Object.freeze(
      Array.from(new Set([...existing.preservedPerspectives, ...incoming.preservedPerspectives])).slice(
        0,
        6
      )
    ),
    weakenedPerspectives: Object.freeze(
      Array.from(new Set([...existing.weakenedPerspectives, ...incoming.weakenedPerspectives])).slice(
        0,
        6
      )
    ),
    diversitySignals: Object.freeze(
      Array.from(new Set([...existing.diversitySignals, ...incoming.diversitySignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    pluralityState:
      incoming.confidence >= existing.confidence ? incoming.pluralityState : existing.pluralityState,
    fragilityStrength:
      incoming.confidence >= existing.confidence
        ? incoming.fragilityStrength
        : existing.fragilityStrength,
    diversityCategory:
      incoming.confidence >= existing.confidence
        ? incoming.diversityCategory
        : existing.diversityCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  observations: readonly DiversityResilienceObservation[];
}): string {
  return stableSignature([
    "d9-7-6-diversity-preservation",
    state.observations.length,
    state.observations.slice(0, 3).map((o) => o.diversityId),
  ]);
}

export function createDiversityPreservationStore(initial?: DiversityPreservationStoreState): {
  getState(): DiversityPreservationStoreState;
  upsertObservations(
    observations: DiversityResilienceObservation[],
    now?: number
  ): DiversityPreservationStoreState;
  upsertSnapshots(
    snapshots: StrategicDiversitySnapshot[],
    now?: number
  ): DiversityPreservationStoreState;
  upsertGroupthinkIndicators(
    indicators: EnterpriseGroupthinkIndicator[],
    now?: number
  ): DiversityPreservationStoreState;
  upsertFragilitySignals(
    signals: AntiConsensusFragilitySignal[],
    now?: number
  ): DiversityPreservationStoreState;
  upsertPluralityFields(
    fields: PerspectivePluralityField[],
    now?: number
  ): DiversityPreservationStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastPluralityState(state: PluralityState): void;
  clear(): DiversityPreservationStoreState;
} {
  let state: DiversityPreservationStoreState = initial ?? {
    observations: [],
    snapshots: [],
    groupthinkIndicators: [],
    fragilitySignals: [],
    pluralityFields: [],
    signature: buildStoreSignature({ observations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastPluralityState: null,
  };

  return {
    getState(): DiversityPreservationStoreState {
      return {
        ...state,
        observations: state.observations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        groupthinkIndicators: state.groupthinkIndicators.map((i) => ({ ...i })),
        fragilitySignals: state.fragilitySignals.map((s) => ({ ...s })),
        pluralityFields: state.pluralityFields.map((f) => ({ ...f })),
      };
    },

    upsertObservations(
      observations: DiversityResilienceObservation[],
      now = Date.now()
    ): DiversityPreservationStoreState {
      const byId = new Map<string, DiversityResilienceObservation>();
      for (const o of state.observations) byId.set(o.diversityId, o);
      for (const o of observations) {
        const existing = byId.get(o.diversityId);
        byId.set(o.diversityId, existing ? mergeObservations(existing, o) : o);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DIVERSITY_PRESERVATION_MAX_OBSERVATIONS);
      state = {
        ...state,
        observations: Object.freeze(next),
        signature: buildStoreSignature({ observations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StrategicDiversitySnapshot[],
      now = Date.now()
    ): DiversityPreservationStoreState {
      const bySig = new Map<string, StrategicDiversitySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DIVERSITY_PRESERVATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGroupthinkIndicators(
      indicators: EnterpriseGroupthinkIndicator[],
      now = Date.now()
    ): DiversityPreservationStoreState {
      const byId = new Map<string, EnterpriseGroupthinkIndicator>();
      for (const i of state.groupthinkIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DIVERSITY_PRESERVATION_MAX_INDICATORS);
      state = { ...state, groupthinkIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertFragilitySignals(
      signals: AntiConsensusFragilitySignal[],
      now = Date.now()
    ): DiversityPreservationStoreState {
      const byId = new Map<string, AntiConsensusFragilitySignal>();
      for (const s of state.fragilitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DIVERSITY_PRESERVATION_MAX_SIGNALS);
      state = { ...state, fragilitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPluralityFields(
      fields: PerspectivePluralityField[],
      now = Date.now()
    ): DiversityPreservationStoreState {
      const byId = new Map<string, PerspectivePluralityField>();
      for (const f of state.pluralityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DIVERSITY_PRESERVATION_MAX_FIELDS);
      state = { ...state, pluralityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastPluralityState(pluralityState: PluralityState): void {
      state = { ...state, lastPluralityState: pluralityState };
    },

    clear(): DiversityPreservationStoreState {
      state = {
        observations: [],
        snapshots: [],
        groupthinkIndicators: [],
        fragilitySignals: [],
        pluralityFields: [],
        signature: buildStoreSignature({ observations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastPluralityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDiversityPreservationStore>>();

export function getDiversityPreservationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDiversityPreservationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDiversityPreservationStores(): void {
  storesByOrganization.clear();
}
