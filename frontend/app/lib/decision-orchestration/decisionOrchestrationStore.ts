import { stableSignature } from "../intelligence/shared/dedupe";
import {
  DECISION_ORCHESTRATION_MAX_CANDIDATES,
  DECISION_ORCHESTRATION_MAX_DEPENDENCIES,
  DECISION_ORCHESTRATION_MAX_ORCHESTRATIONS,
  DECISION_ORCHESTRATION_MAX_SEQUENCES,
  DECISION_ORCHESTRATION_MAX_SIGNALS,
  DECISION_ORCHESTRATION_MAX_SNAPSHOTS,
} from "./decisionOrchestrationGuards";
import type {
  ActionReadinessSignal,
  DecisionCoordinationSnapshot,
  DecisionOrchestrationStoreState,
  ExecutiveActionCandidate,
  OperationalResponseSequence,
  OrganizationalResponseDependency,
  StrategicDecisionOrchestration,
} from "./decisionOrchestrationTypes";

function mergeOrchestrations(
  existing: StrategicDecisionOrchestration,
  incoming: StrategicDecisionOrchestration
): StrategicDecisionOrchestration {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    actionSequence: Object.freeze(
      Array.from(new Set([...existing.actionSequence, ...incoming.actionSequence])).slice(0, 6)
    ),
    dependencies: Object.freeze(
      Array.from(new Set([...existing.dependencies, ...incoming.dependencies])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    readinessState:
      readinessRank(incoming.readinessState) >= readinessRank(existing.readinessState)
        ? incoming.readinessState
        : existing.readinessState,
    actionPriority:
      priorityRank(incoming.actionPriority) >= priorityRank(existing.actionPriority)
        ? incoming.actionPriority
        : existing.actionPriority,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function readinessRank(state: StrategicDecisionOrchestration["readinessState"]): number {
  const ranks = { identified: 1, organizing: 2, sequencing: 3, coordinated: 4, ready: 5 };
  return ranks[state];
}

function priorityRank(priority: StrategicDecisionOrchestration["actionPriority"]): number {
  const ranks = { informational: 1, moderate: 2, elevated: 3, critical: 4 };
  return ranks[priority];
}

function buildStoreSignature(state: {
  strategicOrchestrations: readonly StrategicDecisionOrchestration[];
}): string {
  return stableSignature([
    "d9-5-1-decision-orchestration",
    state.strategicOrchestrations.length,
    state.strategicOrchestrations.slice(0, 3).map((o) => o.orchestrationId),
  ]);
}

export function createDecisionOrchestrationStore(initial?: DecisionOrchestrationStoreState): {
  getState(): DecisionOrchestrationStoreState;
  upsertStrategicOrchestrations(
    orchestrations: StrategicDecisionOrchestration[],
    now?: number
  ): DecisionOrchestrationStoreState;
  upsertSnapshots(
    snapshots: DecisionCoordinationSnapshot[],
    now?: number
  ): DecisionOrchestrationStoreState;
  upsertActionCandidates(
    candidates: ExecutiveActionCandidate[],
    now?: number
  ): DecisionOrchestrationStoreState;
  upsertActionReadinessSignals(
    signals: ActionReadinessSignal[],
    now?: number
  ): DecisionOrchestrationStoreState;
  upsertResponseSequences(
    sequences: OperationalResponseSequence[],
    now?: number
  ): DecisionOrchestrationStoreState;
  upsertResponseDependencies(
    dependencies: OrganizationalResponseDependency[],
    now?: number
  ): DecisionOrchestrationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): DecisionOrchestrationStoreState;
} {
  let state: DecisionOrchestrationStoreState = initial ?? {
    strategicOrchestrations: [],
    snapshots: [],
    actionCandidates: [],
    actionReadinessSignals: [],
    responseSequences: [],
    responseDependencies: [],
    signature: buildStoreSignature({ strategicOrchestrations: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): DecisionOrchestrationStoreState {
      return {
        ...state,
        strategicOrchestrations: state.strategicOrchestrations.map((o) => ({ ...o })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        actionCandidates: state.actionCandidates.map((c) => ({ ...c })),
        actionReadinessSignals: state.actionReadinessSignals.map((s) => ({ ...s })),
        responseSequences: state.responseSequences.map((s) => ({ ...s })),
        responseDependencies: state.responseDependencies.map((d) => ({ ...d })),
      };
    },

    upsertStrategicOrchestrations(
      orchestrations: StrategicDecisionOrchestration[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, StrategicDecisionOrchestration>();
      for (const o of state.strategicOrchestrations) byId.set(o.orchestrationId, o);
      for (const o of orchestrations) {
        const existing = byId.get(o.orchestrationId);
        byId.set(o.orchestrationId, existing ? mergeOrchestrations(existing, o) : { ...o });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_ORCHESTRATIONS);
      state = {
        ...state,
        strategicOrchestrations: Object.freeze(next),
        signature: buildStoreSignature({ strategicOrchestrations: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: DecisionCoordinationSnapshot[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, DecisionCoordinationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertActionCandidates(
      candidates: ExecutiveActionCandidate[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, ExecutiveActionCandidate>();
      for (const c of state.actionCandidates) byId.set(c.candidateId, c);
      for (const c of candidates) byId.set(c.candidateId, c);
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_CANDIDATES);
      state = { ...state, actionCandidates: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertActionReadinessSignals(
      signals: ActionReadinessSignal[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, ActionReadinessSignal>();
      for (const s of state.actionReadinessSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_SIGNALS);
      state = { ...state, actionReadinessSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResponseSequences(
      sequences: OperationalResponseSequence[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, OperationalResponseSequence>();
      for (const s of state.responseSequences) byId.set(s.sequenceId, s);
      for (const s of sequences) byId.set(s.sequenceId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_SEQUENCES);
      state = { ...state, responseSequences: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertResponseDependencies(
      dependencies: OrganizationalResponseDependency[],
      now = Date.now()
    ): DecisionOrchestrationStoreState {
      const byId = new Map<string, OrganizationalResponseDependency>();
      for (const d of state.responseDependencies) byId.set(d.dependencyId, d);
      for (const d of dependencies) byId.set(d.dependencyId, d);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, DECISION_ORCHESTRATION_MAX_DEPENDENCIES);
      state = { ...state, responseDependencies: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): DecisionOrchestrationStoreState {
      state = {
        strategicOrchestrations: [],
        snapshots: [],
        actionCandidates: [],
        actionReadinessSignals: [],
        responseSequences: [],
        responseDependencies: [],
        signature: buildStoreSignature({ strategicOrchestrations: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createDecisionOrchestrationStore>>();

export function getDecisionOrchestrationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createDecisionOrchestrationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetDecisionOrchestrationStores(): void {
  storesByOrganization.clear();
}
