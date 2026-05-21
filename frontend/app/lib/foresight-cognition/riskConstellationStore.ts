import { stableSignature } from "../intelligence/shared/dedupe";
import {
  RISK_CONSTELLATION_MAX_CLUSTERS,
  RISK_CONSTELLATION_MAX_CONSTELLATIONS,
  RISK_CONSTELLATION_MAX_CORRELATIONS,
  RISK_CONSTELLATION_MAX_EMERGENCES,
  RISK_CONSTELLATION_MAX_PATTERNS,
  RISK_CONSTELLATION_MAX_SNAPSHOTS,
} from "./riskConstellationGuards";
import type {
  DistributedInstabilityPattern,
  EnterpriseRiskConstellation,
  MultiSignalPressureCluster,
  RiskConstellationSnapshot,
  RiskConstellationStoreState,
  StrategicRiskEmergence,
  WeakSignalCorrelation,
} from "./riskConstellationTypes";

function mergeConstellations(
  existing: EnterpriseRiskConstellation,
  incoming: EnterpriseRiskConstellation
): EnterpriseRiskConstellation {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    correlatedSignals: Object.freeze(
      Array.from(new Set([...existing.correlatedSignals, ...incoming.correlatedSignals])).slice(
        0,
        6
      )
    ),
    linkedSignalIds: Object.freeze(
      Array.from(new Set([...existing.linkedSignalIds, ...incoming.linkedSignalIds])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    correlationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.correlationStrength
        : existing.correlationStrength,
    constellationState:
      incoming.confidence >= existing.confidence
        ? incoming.constellationState
        : existing.constellationState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  constellations: readonly EnterpriseRiskConstellation[];
}): string {
  return stableSignature([
    "d9-4-2-risk-constellation",
    state.constellations.length,
    state.constellations.slice(0, 3).map((c) => c.constellationId),
  ]);
}

export function createRiskConstellationStore(initial?: RiskConstellationStoreState): {
  getState(): RiskConstellationStoreState;
  upsertConstellations(
    constellations: EnterpriseRiskConstellation[],
    now?: number
  ): RiskConstellationStoreState;
  upsertSnapshots(
    snapshots: RiskConstellationSnapshot[],
    now?: number
  ): RiskConstellationStoreState;
  upsertCorrelations(
    correlations: WeakSignalCorrelation[],
    now?: number
  ): RiskConstellationStoreState;
  upsertInstabilityPatterns(
    patterns: DistributedInstabilityPattern[],
    now?: number
  ): RiskConstellationStoreState;
  upsertStrategicRiskEmergences(
    emergences: StrategicRiskEmergence[],
    now?: number
  ): RiskConstellationStoreState;
  upsertPressureClusters(
    clusters: MultiSignalPressureCluster[],
    now?: number
  ): RiskConstellationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): RiskConstellationStoreState;
} {
  let state: RiskConstellationStoreState = initial ?? {
    constellations: [],
    snapshots: [],
    correlations: [],
    instabilityPatterns: [],
    strategicRiskEmergences: [],
    pressureClusters: [],
    signature: buildStoreSignature({ constellations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): RiskConstellationStoreState {
      return {
        ...state,
        constellations: state.constellations.map((c) => ({ ...c })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        correlations: state.correlations.map((c) => ({ ...c })),
        instabilityPatterns: state.instabilityPatterns.map((p) => ({ ...p })),
        strategicRiskEmergences: state.strategicRiskEmergences.map((e) => ({ ...e })),
        pressureClusters: state.pressureClusters.map((c) => ({ ...c })),
      };
    },

    upsertConstellations(
      constellations: EnterpriseRiskConstellation[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, EnterpriseRiskConstellation>();
      for (const c of state.constellations) byId.set(c.constellationId, c);
      for (const c of constellations) {
        const existing = byId.get(c.constellationId);
        byId.set(c.constellationId, existing ? mergeConstellations(existing, c) : { ...c });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, RISK_CONSTELLATION_MAX_CONSTELLATIONS);
      state = {
        ...state,
        constellations: Object.freeze(next),
        signature: buildStoreSignature({ constellations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: RiskConstellationSnapshot[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, RiskConstellationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, RISK_CONSTELLATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCorrelations(
      correlations: WeakSignalCorrelation[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, WeakSignalCorrelation>();
      for (const c of state.correlations) byId.set(c.correlationId, c);
      for (const c of correlations) byId.set(c.correlationId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, RISK_CONSTELLATION_MAX_CORRELATIONS);
      state = { ...state, correlations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInstabilityPatterns(
      patterns: DistributedInstabilityPattern[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, DistributedInstabilityPattern>();
      for (const p of state.instabilityPatterns) byId.set(p.patternId, p);
      for (const p of patterns) byId.set(p.patternId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, RISK_CONSTELLATION_MAX_PATTERNS);
      state = { ...state, instabilityPatterns: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicRiskEmergences(
      emergences: StrategicRiskEmergence[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, StrategicRiskEmergence>();
      for (const e of state.strategicRiskEmergences) byId.set(e.emergenceId, e);
      for (const e of emergences) byId.set(e.emergenceId, e);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, RISK_CONSTELLATION_MAX_EMERGENCES);
      state = { ...state, strategicRiskEmergences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPressureClusters(
      clusters: MultiSignalPressureCluster[],
      now = Date.now()
    ): RiskConstellationStoreState {
      const byId = new Map<string, MultiSignalPressureCluster>();
      for (const c of state.pressureClusters) byId.set(c.clusterId, c);
      for (const c of clusters) byId.set(c.clusterId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, RISK_CONSTELLATION_MAX_CLUSTERS);
      state = { ...state, pressureClusters: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): RiskConstellationStoreState {
      state = {
        constellations: [],
        snapshots: [],
        correlations: [],
        instabilityPatterns: [],
        strategicRiskEmergences: [],
        pressureClusters: [],
        signature: buildStoreSignature({ constellations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createRiskConstellationStore>>();

export function getRiskConstellationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createRiskConstellationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetRiskConstellationStores(): void {
  storesByOrganization.clear();
}
