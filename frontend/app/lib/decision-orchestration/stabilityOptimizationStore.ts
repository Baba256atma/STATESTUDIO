import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STABILITY_OPTIMIZATION_MAX_INDICATORS,
  STABILITY_OPTIMIZATION_MAX_OPTIMIZATIONS,
  STABILITY_OPTIMIZATION_MAX_PATHWAYS,
  STABILITY_OPTIMIZATION_MAX_SIGNALS,
  STABILITY_OPTIMIZATION_MAX_SNAPSHOTS,
  STABILITY_OPTIMIZATION_MAX_TOPOLOGIES,
} from "./stabilityOptimizationGuards";
import type {
  AdaptiveResilienceIndicator,
  EnterpriseResiliencePathway,
  OperationalSustainabilitySignal,
  StabilityOptimizationSnapshot,
  StabilityOptimizationStoreState,
  StabilityReinforcementTopology,
  StrategicStabilityOptimization,
} from "./stabilityOptimizationTypes";

function mergeOptimizations(
  existing: StrategicStabilityOptimization,
  incoming: StrategicStabilityOptimization
): StrategicStabilityOptimization {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    resilienceSignals: Object.freeze(
      Array.from(new Set([...existing.resilienceSignals, ...incoming.resilienceSignals])).slice(0, 6)
    ),
    sustainabilityRisks: Object.freeze(
      Array.from(new Set([...existing.sustainabilityRisks, ...incoming.sustainabilityRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    optimizationState:
      incoming.confidence >= existing.confidence
        ? incoming.optimizationState
        : existing.optimizationState,
    optimizationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.optimizationStrength
        : existing.optimizationStrength,
    optimizationCategory:
      incoming.confidence >= existing.confidence
        ? incoming.optimizationCategory
        : existing.optimizationCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  stabilityOptimizations: readonly StrategicStabilityOptimization[];
}): string {
  return stableSignature([
    "d9-5-9-stability-optimization",
    state.stabilityOptimizations.length,
    state.stabilityOptimizations.slice(0, 3).map((o) => o.optimizationId),
  ]);
}

export function createStabilityOptimizationStore(initial?: StabilityOptimizationStoreState): {
  getState(): StabilityOptimizationStoreState;
  upsertStabilityOptimizations(
    optimizations: StrategicStabilityOptimization[],
    now?: number
  ): StabilityOptimizationStoreState;
  upsertSnapshots(
    snapshots: StabilityOptimizationSnapshot[],
    now?: number
  ): StabilityOptimizationStoreState;
  upsertResiliencePathways(
    pathways: EnterpriseResiliencePathway[],
    now?: number
  ): StabilityOptimizationStoreState;
  upsertSustainabilitySignals(
    signals: OperationalSustainabilitySignal[],
    now?: number
  ): StabilityOptimizationStoreState;
  upsertReinforcementTopologies(
    topologies: StabilityReinforcementTopology[],
    now?: number
  ): StabilityOptimizationStoreState;
  upsertAdaptiveResilienceIndicators(
    indicators: AdaptiveResilienceIndicator[],
    now?: number
  ): StabilityOptimizationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): StabilityOptimizationStoreState;
} {
  let state: StabilityOptimizationStoreState = initial ?? {
    stabilityOptimizations: [],
    snapshots: [],
    resiliencePathways: [],
    sustainabilitySignals: [],
    reinforcementTopologies: [],
    adaptiveResilienceIndicators: [],
    signature: buildStoreSignature({ stabilityOptimizations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): StabilityOptimizationStoreState {
      return {
        ...state,
        stabilityOptimizations: state.stabilityOptimizations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        resiliencePathways: state.resiliencePathways.map((p) => ({ ...p })),
        sustainabilitySignals: state.sustainabilitySignals.map((s) => ({ ...s })),
        reinforcementTopologies: state.reinforcementTopologies.map((t) => ({ ...t })),
        adaptiveResilienceIndicators: state.adaptiveResilienceIndicators.map((i) => ({ ...i })),
      };
    },

    upsertStabilityOptimizations(
      optimizations: StrategicStabilityOptimization[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, StrategicStabilityOptimization>();
      for (const o of state.stabilityOptimizations) byId.set(o.optimizationId, o);
      for (const o of optimizations) {
        const existing = byId.get(o.optimizationId);
        byId.set(o.optimizationId, existing ? mergeOptimizations(existing, o) : { ...o });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_OPTIMIZATIONS);
      state = {
        ...state,
        stabilityOptimizations: Object.freeze(next),
        signature: buildStoreSignature({ stabilityOptimizations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StabilityOptimizationSnapshot[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, StabilityOptimizationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResiliencePathways(
      pathways: EnterpriseResiliencePathway[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, EnterpriseResiliencePathway>();
      for (const p of state.resiliencePathways) byId.set(p.pathwayId, p);
      for (const p of pathways) {
        const existing = byId.get(p.pathwayId);
        byId.set(
          p.pathwayId,
          existing
            ? { ...existing, ...p, occurrenceCount: existing.occurrenceCount + (p.occurrenceCount || 1) }
            : { ...p }
        );
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_PATHWAYS);
      state = { ...state, resiliencePathways: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSustainabilitySignals(
      signals: OperationalSustainabilitySignal[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, OperationalSustainabilitySignal>();
      for (const s of state.sustainabilitySignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_SIGNALS);
      state = { ...state, sustainabilitySignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReinforcementTopologies(
      topologies: StabilityReinforcementTopology[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, StabilityReinforcementTopology>();
      for (const t of state.reinforcementTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) byId.set(t.topologyId, t);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_TOPOLOGIES);
      state = { ...state, reinforcementTopologies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAdaptiveResilienceIndicators(
      indicators: AdaptiveResilienceIndicator[],
      now = Date.now()
    ): StabilityOptimizationStoreState {
      const byId = new Map<string, AdaptiveResilienceIndicator>();
      for (const i of state.adaptiveResilienceIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STABILITY_OPTIMIZATION_MAX_INDICATORS);
      state = { ...state, adaptiveResilienceIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): StabilityOptimizationStoreState {
      state = {
        stabilityOptimizations: [],
        snapshots: [],
        resiliencePathways: [],
        sustainabilitySignals: [],
        reinforcementTopologies: [],
        adaptiveResilienceIndicators: [],
        signature: buildStoreSignature({ stabilityOptimizations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStabilityOptimizationStore>>();

export function getStabilityOptimizationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStabilityOptimizationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStabilityOptimizationStores(): void {
  storesByOrganization.clear();
}
