import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DISTRIBUTED_ADVISORY_MAX_ADVISORIES,
  DISTRIBUTED_ADVISORY_MAX_CONSENSUS,
  DISTRIBUTED_ADVISORY_MAX_FIELDS,
  DISTRIBUTED_ADVISORY_MAX_SIGNALS,
  DISTRIBUTED_ADVISORY_MAX_SNAPSHOTS,
} from "./distributedAdvisoryGuards";
import type {
  AdvisoryCoordinationSignal,
  CollectiveStrategicGuidanceSnapshot,
  CoordinationState,
  DistributedAdvisoryStoreState,
  DistributedExecutiveAdvisory,
  EnterpriseRecommendationConsensus,
  StrategicGuidanceField,
} from "./distributedAdvisoryTypes";

function mergeAdvisories(
  existing: DistributedExecutiveAdvisory,
  incoming: DistributedExecutiveAdvisory
): DistributedExecutiveAdvisory {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    alignedGuidance: Object.freeze(
      Array.from(new Set([...existing.alignedGuidance, ...incoming.alignedGuidance])).slice(0, 6)
    ),
    moderatedGuidance: Object.freeze(
      Array.from(new Set([...existing.moderatedGuidance, ...incoming.moderatedGuidance])).slice(0, 6)
    ),
    advisorySignals: Object.freeze(
      Array.from(new Set([...existing.advisorySignals, ...incoming.advisorySignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    coordinationState:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationState
        : existing.coordinationState,
    guidanceStrength:
      incoming.confidence >= existing.confidence
        ? incoming.guidanceStrength
        : existing.guidanceStrength,
    advisoryCategory:
      incoming.confidence >= existing.confidence
        ? incoming.advisoryCategory
        : existing.advisoryCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  advisories: readonly DistributedExecutiveAdvisory[];
}): string {
  return stableSignature([
    "d9-7-4-distributed-advisory",
    state.advisories.length,
    state.advisories.slice(0, 3).map((a) => a.advisoryId),
  ]);
}

export function createDistributedAdvisoryStore(initial?: DistributedAdvisoryStoreState): {
  getState(): DistributedAdvisoryStoreState;
  upsertAdvisories(
    advisories: DistributedExecutiveAdvisory[],
    now?: number
  ): DistributedAdvisoryStoreState;
  upsertSnapshots(
    snapshots: CollectiveStrategicGuidanceSnapshot[],
    now?: number
  ): DistributedAdvisoryStoreState;
  upsertRecommendationConsensus(
    records: EnterpriseRecommendationConsensus[],
    now?: number
  ): DistributedAdvisoryStoreState;
  upsertCoordinationSignals(
    signals: AdvisoryCoordinationSignal[],
    now?: number
  ): DistributedAdvisoryStoreState;
  upsertGuidanceFields(
    fields: StrategicGuidanceField[],
    now?: number
  ): DistributedAdvisoryStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastCoordinationState(state: CoordinationState): void;
  clear(): DistributedAdvisoryStoreState;
} {
  let state: DistributedAdvisoryStoreState = initial ?? {
    advisories: [],
    snapshots: [],
    recommendationConsensus: [],
    coordinationSignals: [],
    guidanceFields: [],
    signature: buildStoreSignature({ advisories: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastCoordinationState: null,
  };

  return {
    getState(): DistributedAdvisoryStoreState {
      return {
        ...state,
        advisories: state.advisories.map((a) => ({ ...a })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        recommendationConsensus: state.recommendationConsensus.map((r) => ({ ...r })),
        coordinationSignals: state.coordinationSignals.map((s) => ({ ...s })),
        guidanceFields: state.guidanceFields.map((f) => ({ ...f })),
      };
    },

    upsertAdvisories(
      advisories: DistributedExecutiveAdvisory[],
      now = Date.now()
    ): DistributedAdvisoryStoreState {
      const byId = new Map<string, DistributedExecutiveAdvisory>();
      for (const a of state.advisories) byId.set(a.advisoryId, a);
      for (const a of advisories) {
        const existing = byId.get(a.advisoryId);
        byId.set(a.advisoryId, existing ? mergeAdvisories(existing, a) : a);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DISTRIBUTED_ADVISORY_MAX_ADVISORIES);
      state = {
        ...state,
        advisories: Object.freeze(next),
        signature: buildStoreSignature({ advisories: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CollectiveStrategicGuidanceSnapshot[],
      now = Date.now()
    ): DistributedAdvisoryStoreState {
      const bySig = new Map<string, CollectiveStrategicGuidanceSnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_ADVISORY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRecommendationConsensus(
      records: EnterpriseRecommendationConsensus[],
      now = Date.now()
    ): DistributedAdvisoryStoreState {
      const byId = new Map<string, EnterpriseRecommendationConsensus>();
      for (const r of state.recommendationConsensus) byId.set(r.consensusId, r);
      for (const r of records) byId.set(r.consensusId, r);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_ADVISORY_MAX_CONSENSUS);
      state = { ...state, recommendationConsensus: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCoordinationSignals(
      signals: AdvisoryCoordinationSignal[],
      now = Date.now()
    ): DistributedAdvisoryStoreState {
      const byId = new Map<string, AdvisoryCoordinationSignal>();
      for (const s of state.coordinationSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_ADVISORY_MAX_SIGNALS);
      state = { ...state, coordinationSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertGuidanceFields(
      fields: StrategicGuidanceField[],
      now = Date.now()
    ): DistributedAdvisoryStoreState {
      const byId = new Map<string, StrategicGuidanceField>();
      for (const f of state.guidanceFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DISTRIBUTED_ADVISORY_MAX_FIELDS);
      state = { ...state, guidanceFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastCoordinationState(coordinationState: CoordinationState): void {
      state = { ...state, lastCoordinationState: coordinationState };
    },

    clear(): DistributedAdvisoryStoreState {
      state = {
        advisories: [],
        snapshots: [],
        recommendationConsensus: [],
        coordinationSignals: [],
        guidanceFields: [],
        signature: buildStoreSignature({ advisories: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastCoordinationState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDistributedAdvisoryStore>>();

export function getDistributedAdvisoryStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDistributedAdvisoryStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDistributedAdvisoryStores(): void {
  storesByOrganization.clear();
}
