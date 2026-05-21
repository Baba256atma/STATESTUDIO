import { stableSignature } from "../intelligence/shared/dedupe";
import {
  CAUSAL_DEPENDENCY_MAX_CHAINS,
  CAUSAL_DEPENDENCY_MAX_IMPACT,
  CAUSAL_DEPENDENCY_MAX_LINKS,
  CAUSAL_DEPENDENCY_MAX_SEQUENCES,
  CAUSAL_DEPENDENCY_MAX_SIGNALS,
  CAUSAL_DEPENDENCY_MAX_SNAPSHOTS,
} from "./causalDependencyGuards";
import type {
  CausalDependencySnapshot,
  CausalDependencyStoreState,
  DependencyPropagationSignal,
  OperationalCausalChain,
  OrganizationalImpactChain,
  StrategicCauseEffectSequence,
  TemporalDependencyLink,
} from "./causalDependencyTypes";

function mergeChains(
  existing: OperationalCausalChain,
  incoming: OperationalCausalChain
): OperationalCausalChain {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    chain: Object.freeze(
      Array.from(new Set([...existing.chain, ...incoming.chain])).slice(0, 6)
    ),
    upstreamNodeIds: Object.freeze(
      Array.from(new Set([...existing.upstreamNodeIds, ...incoming.upstreamNodeIds])).slice(0, 6)
    ),
    downstreamNodeIds: Object.freeze(
      Array.from(new Set([...existing.downstreamNodeIds, ...incoming.downstreamNodeIds])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  chains: readonly OperationalCausalChain[];
  links: readonly TemporalDependencyLink[];
}): string {
  return stableSignature([
    "d9-3-2-causal-dependency",
    state.chains.length,
    state.links.length,
    state.chains.slice(0, 3).map((c) => c.causalChainId),
  ]);
}

export function createCausalDependencyStore(initial?: CausalDependencyStoreState): {
  getState(): CausalDependencyStoreState;
  upsertChains(chains: OperationalCausalChain[], now?: number): CausalDependencyStoreState;
  upsertLinks(links: TemporalDependencyLink[], now?: number): CausalDependencyStoreState;
  upsertSnapshots(
    snapshots: CausalDependencySnapshot[],
    now?: number
  ): CausalDependencyStoreState;
  upsertSignals(
    signals: DependencyPropagationSignal[],
    now?: number
  ): CausalDependencyStoreState;
  upsertImpactChains(
    impacts: OrganizationalImpactChain[],
    now?: number
  ): CausalDependencyStoreState;
  upsertCauseEffectSequences(
    sequences: StrategicCauseEffectSequence[],
    now?: number
  ): CausalDependencyStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): CausalDependencyStoreState;
} {
  let state: CausalDependencyStoreState = initial ?? {
    chains: [],
    links: [],
    snapshots: [],
    signals: [],
    impactChains: [],
    causeEffectSequences: [],
    signature: buildStoreSignature({ chains: [], links: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): CausalDependencyStoreState {
      return {
        ...state,
        chains: state.chains.map((c) => ({ ...c })),
        links: state.links.map((l) => ({ ...l })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        signals: state.signals.map((s) => ({ ...s })),
        impactChains: state.impactChains.map((i) => ({ ...i })),
        causeEffectSequences: state.causeEffectSequences.map((s) => ({ ...s })),
      };
    },

    upsertChains(chains: OperationalCausalChain[], now = Date.now()): CausalDependencyStoreState {
      const byId = new Map<string, OperationalCausalChain>();
      for (const c of state.chains) byId.set(c.causalChainId, c);
      for (const c of chains) {
        const existing = byId.get(c.causalChainId);
        byId.set(c.causalChainId, existing ? mergeChains(existing, c) : { ...c });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_CHAINS);
      state = {
        ...state,
        chains: Object.freeze(next),
        signature: buildStoreSignature({ chains: next, links: state.links }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertLinks(links: TemporalDependencyLink[], now = Date.now()): CausalDependencyStoreState {
      const byId = new Map<string, TemporalDependencyLink>();
      for (const l of state.links) byId.set(l.linkId, l);
      for (const l of links) byId.set(l.linkId, l);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_LINKS);
      state = {
        ...state,
        links: Object.freeze(next),
        signature: buildStoreSignature({ chains: state.chains, links: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: CausalDependencySnapshot[],
      now = Date.now()
    ): CausalDependencyStoreState {
      const byId = new Map<string, CausalDependencySnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertSignals(
      signals: DependencyPropagationSignal[],
      now = Date.now()
    ): CausalDependencyStoreState {
      const byId = new Map<string, DependencyPropagationSignal>();
      for (const s of state.signals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_SIGNALS);
      state = { ...state, signals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertImpactChains(
      impacts: OrganizationalImpactChain[],
      now = Date.now()
    ): CausalDependencyStoreState {
      const byId = new Map<string, OrganizationalImpactChain>();
      for (const i of state.impactChains) byId.set(i.impactChainId, i);
      for (const i of impacts) byId.set(i.impactChainId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_IMPACT);
      state = { ...state, impactChains: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertCauseEffectSequences(
      sequences: StrategicCauseEffectSequence[],
      now = Date.now()
    ): CausalDependencyStoreState {
      const byId = new Map<string, StrategicCauseEffectSequence>();
      for (const s of state.causeEffectSequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, CAUSAL_DEPENDENCY_MAX_SEQUENCES);
      state = { ...state, causeEffectSequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): CausalDependencyStoreState {
      state = {
        chains: [],
        links: [],
        snapshots: [],
        signals: [],
        impactChains: [],
        causeEffectSequences: [],
        signature: buildStoreSignature({ chains: [], links: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createCausalDependencyStore>>();

export function getCausalDependencyStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createCausalDependencyStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetCausalDependencyStores(): void {
  storesByOrganization.clear();
}
