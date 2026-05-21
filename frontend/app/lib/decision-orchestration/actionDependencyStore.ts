import { stableSignature } from "../intelligence/shared/dedupe";
import {
  ACTION_DEPENDENCY_MAX_BOTTLENECKS,
  ACTION_DEPENDENCY_MAX_GRAPHS,
  ACTION_DEPENDENCY_MAX_NODES,
  ACTION_DEPENDENCY_MAX_SIGNALS,
  ACTION_DEPENDENCY_MAX_SNAPSHOTS,
} from "./actionDependencyGuards";
import type {
  ActionDependencyStoreState,
  CoordinationBottleneckIndicator,
  DependencyAwarenessSnapshot,
  EnterpriseDependencyNode,
  OperationalCoordinationGraph,
  ResponseRelationshipSignal,
} from "./actionDependencyTypes";

function mergeCoordinationGraphs(
  existing: OperationalCoordinationGraph,
  incoming: OperationalCoordinationGraph
): OperationalCoordinationGraph {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    dependencyRelationships: Object.freeze(
      incoming.dependencyRelationships.length >= existing.dependencyRelationships.length
        ? incoming.dependencyRelationships
        : existing.dependencyRelationships
    ),
    bottlenecks: Object.freeze(
      Array.from(new Set([...existing.bottlenecks, ...incoming.bottlenecks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    coordinationState:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationState
        : existing.coordinationState,
    dependencyStrength:
      incoming.confidence >= existing.confidence
        ? incoming.dependencyStrength
        : existing.dependencyStrength,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  coordinationGraphs: readonly OperationalCoordinationGraph[];
}): string {
  return stableSignature([
    "d9-5-2-action-dependency",
    state.coordinationGraphs.length,
    state.coordinationGraphs.slice(0, 3).map((g) => g.dependencyGraphId),
  ]);
}

export function createActionDependencyStore(initial?: ActionDependencyStoreState): {
  getState(): ActionDependencyStoreState;
  upsertCoordinationGraphs(
    graphs: OperationalCoordinationGraph[],
    now?: number
  ): ActionDependencyStoreState;
  upsertSnapshots(
    snapshots: DependencyAwarenessSnapshot[],
    now?: number
  ): ActionDependencyStoreState;
  upsertDependencyNodes(
    nodes: EnterpriseDependencyNode[],
    now?: number
  ): ActionDependencyStoreState;
  upsertRelationshipSignals(
    signals: ResponseRelationshipSignal[],
    now?: number
  ): ActionDependencyStoreState;
  upsertBottleneckIndicators(
    indicators: CoordinationBottleneckIndicator[],
    now?: number
  ): ActionDependencyStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): ActionDependencyStoreState;
} {
  let state: ActionDependencyStoreState = initial ?? {
    coordinationGraphs: [],
    snapshots: [],
    dependencyNodes: [],
    relationshipSignals: [],
    bottleneckIndicators: [],
    signature: buildStoreSignature({ coordinationGraphs: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): ActionDependencyStoreState {
      return {
        ...state,
        coordinationGraphs: state.coordinationGraphs.map((g) => ({ ...g })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        dependencyNodes: state.dependencyNodes.map((n) => ({ ...n })),
        relationshipSignals: state.relationshipSignals.map((s) => ({ ...s })),
        bottleneckIndicators: state.bottleneckIndicators.map((i) => ({ ...i })),
      };
    },

    upsertCoordinationGraphs(
      graphs: OperationalCoordinationGraph[],
      now = Date.now()
    ): ActionDependencyStoreState {
      const byId = new Map<string, OperationalCoordinationGraph>();
      for (const g of state.coordinationGraphs) byId.set(g.dependencyGraphId, g);
      for (const g of graphs) {
        const existing = byId.get(g.dependencyGraphId);
        byId.set(g.dependencyGraphId, existing ? mergeCoordinationGraphs(existing, g) : { ...g });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, ACTION_DEPENDENCY_MAX_GRAPHS);
      state = {
        ...state,
        coordinationGraphs: Object.freeze(next),
        signature: buildStoreSignature({ coordinationGraphs: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: DependencyAwarenessSnapshot[],
      now = Date.now()
    ): ActionDependencyStoreState {
      const byId = new Map<string, DependencyAwarenessSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ACTION_DEPENDENCY_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertDependencyNodes(
      nodes: EnterpriseDependencyNode[],
      now = Date.now()
    ): ActionDependencyStoreState {
      const byId = new Map<string, EnterpriseDependencyNode>();
      for (const n of state.dependencyNodes) byId.set(n.nodeId, n);
      for (const n of nodes) byId.set(n.nodeId, n);
      const next = Array.from(byId.values())
        .sort((a, b) => b.inboundCount - a.inboundCount)
        .slice(0, ACTION_DEPENDENCY_MAX_NODES);
      state = { ...state, dependencyNodes: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertRelationshipSignals(
      signals: ResponseRelationshipSignal[],
      now = Date.now()
    ): ActionDependencyStoreState {
      const byId = new Map<string, ResponseRelationshipSignal>();
      for (const s of state.relationshipSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ACTION_DEPENDENCY_MAX_SIGNALS);
      state = { ...state, relationshipSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertBottleneckIndicators(
      indicators: CoordinationBottleneckIndicator[],
      now = Date.now()
    ): ActionDependencyStoreState {
      const byId = new Map<string, CoordinationBottleneckIndicator>();
      for (const i of state.bottleneckIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, ACTION_DEPENDENCY_MAX_BOTTLENECKS);
      state = { ...state, bottleneckIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): ActionDependencyStoreState {
      state = {
        coordinationGraphs: [],
        snapshots: [],
        dependencyNodes: [],
        relationshipSignals: [],
        bottleneckIndicators: [],
        signature: buildStoreSignature({ coordinationGraphs: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createActionDependencyStore>>();

export function getActionDependencyStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createActionDependencyStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetActionDependencyStores(): void {
  storesByOrganization.clear();
}
