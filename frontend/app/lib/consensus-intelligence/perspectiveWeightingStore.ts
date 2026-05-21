import { stableSignature } from "../intelligence/shared/dedupe";
import {
  PERSPECTIVE_WEIGHTING_MAX_FIELDS,
  PERSPECTIVE_WEIGHTING_MAX_SHIFTS,
  PERSPECTIVE_WEIGHTING_MAX_SIGNALS,
  PERSPECTIVE_WEIGHTING_MAX_SNAPSHOTS,
  PERSPECTIVE_WEIGHTING_MAX_WEIGHTINGS,
} from "./perspectiveWeightingGuards";
import type {
  AdaptiveInfluenceSignal,
  EnterpriseConsensusPrioritySnapshot,
  ExecutiveWeightingField,
  PerspectivePriorityShift,
  PerspectiveWeightingStoreState,
  PriorityState,
  StrategicPerspectiveWeight,
} from "./perspectiveWeightingTypes";

function mergeWeightings(
  existing: StrategicPerspectiveWeight,
  incoming: StrategicPerspectiveWeight
): StrategicPerspectiveWeight {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    dominantPerspectives: Object.freeze(
      Array.from(new Set([...existing.dominantPerspectives, ...incoming.dominantPerspectives])).slice(
        0,
        6
      )
    ),
    reducedPerspectives: Object.freeze(
      Array.from(new Set([...existing.reducedPerspectives, ...incoming.reducedPerspectives])).slice(
        0,
        6
      )
    ),
    weightingSignals: Object.freeze(
      Array.from(new Set([...existing.weightingSignals, ...incoming.weightingSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    priorityState:
      incoming.confidence >= existing.confidence ? incoming.priorityState : existing.priorityState,
    weightingStrength:
      incoming.confidence >= existing.confidence
        ? incoming.weightingStrength
        : existing.weightingStrength,
    weightingCategory:
      incoming.confidence >= existing.confidence
        ? incoming.weightingCategory
        : existing.weightingCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  weightings: readonly StrategicPerspectiveWeight[];
}): string {
  return stableSignature([
    "d9-7-3-perspective-weighting",
    state.weightings.length,
    state.weightings.slice(0, 3).map((w) => w.weightingId),
  ]);
}

export function createPerspectiveWeightingStore(initial?: PerspectiveWeightingStoreState): {
  getState(): PerspectiveWeightingStoreState;
  upsertWeightings(
    weightings: StrategicPerspectiveWeight[],
    now?: number
  ): PerspectiveWeightingStoreState;
  upsertSnapshots(
    snapshots: EnterpriseConsensusPrioritySnapshot[],
    now?: number
  ): PerspectiveWeightingStoreState;
  upsertPriorityShifts(
    shifts: PerspectivePriorityShift[],
    now?: number
  ): PerspectiveWeightingStoreState;
  upsertInfluenceSignals(
    signals: AdaptiveInfluenceSignal[],
    now?: number
  ): PerspectiveWeightingStoreState;
  upsertWeightingFields(
    fields: ExecutiveWeightingField[],
    now?: number
  ): PerspectiveWeightingStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastPriorityState(state: PriorityState): void;
  clear(): PerspectiveWeightingStoreState;
} {
  let state: PerspectiveWeightingStoreState = initial ?? {
    weightings: [],
    snapshots: [],
    priorityShifts: [],
    influenceSignals: [],
    weightingFields: [],
    signature: buildStoreSignature({ weightings: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastPriorityState: null,
  };

  return {
    getState(): PerspectiveWeightingStoreState {
      return {
        ...state,
        weightings: state.weightings.map((w) => ({ ...w })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        priorityShifts: state.priorityShifts.map((s) => ({ ...s })),
        influenceSignals: state.influenceSignals.map((s) => ({ ...s })),
        weightingFields: state.weightingFields.map((f) => ({ ...f })),
      };
    },

    upsertWeightings(
      weightings: StrategicPerspectiveWeight[],
      now = Date.now()
    ): PerspectiveWeightingStoreState {
      const byId = new Map<string, StrategicPerspectiveWeight>();
      for (const w of state.weightings) byId.set(w.weightingId, w);
      for (const w of weightings) {
        const existing = byId.get(w.weightingId);
        byId.set(w.weightingId, existing ? mergeWeightings(existing, w) : w);
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, PERSPECTIVE_WEIGHTING_MAX_WEIGHTINGS);
      state = {
        ...state,
        weightings: Object.freeze(next),
        signature: buildStoreSignature({ weightings: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: EnterpriseConsensusPrioritySnapshot[],
      now = Date.now()
    ): PerspectiveWeightingStoreState {
      const bySig = new Map<string, EnterpriseConsensusPrioritySnapshot>();
      for (const s of state.snapshots) bySig.set(s.signature, s);
      for (const s of snapshots) bySig.set(s.signature, s);
      const next = Array.from(bySig.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_WEIGHTING_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPriorityShifts(
      shifts: PerspectivePriorityShift[],
      now = Date.now()
    ): PerspectiveWeightingStoreState {
      const byId = new Map<string, PerspectivePriorityShift>();
      for (const s of state.priorityShifts) byId.set(s.shiftId, s);
      for (const s of shifts) byId.set(s.shiftId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_WEIGHTING_MAX_SHIFTS);
      state = { ...state, priorityShifts: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInfluenceSignals(
      signals: AdaptiveInfluenceSignal[],
      now = Date.now()
    ): PerspectiveWeightingStoreState {
      const byId = new Map<string, AdaptiveInfluenceSignal>();
      for (const s of state.influenceSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_WEIGHTING_MAX_SIGNALS);
      state = { ...state, influenceSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertWeightingFields(
      fields: ExecutiveWeightingField[],
      now = Date.now()
    ): PerspectiveWeightingStoreState {
      const byId = new Map<string, ExecutiveWeightingField>();
      for (const f of state.weightingFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, PERSPECTIVE_WEIGHTING_MAX_FIELDS);
      state = { ...state, weightingFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastPriorityState(priorityState: PriorityState): void {
      state = { ...state, lastPriorityState: priorityState };
    },

    clear(): PerspectiveWeightingStoreState {
      state = {
        weightings: [],
        snapshots: [],
        priorityShifts: [],
        influenceSignals: [],
        weightingFields: [],
        signature: buildStoreSignature({ weightings: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastPriorityState: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createPerspectiveWeightingStore>>();

export function getPerspectiveWeightingStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createPerspectiveWeightingStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetPerspectiveWeightingStores(): void {
  storesByOrganization.clear();
}
