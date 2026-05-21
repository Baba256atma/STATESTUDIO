import { stableSignature } from "../intelligence/shared/dedupe";
import {
  SCENARIO_COORDINATION_MAX_FIELDS,
  SCENARIO_COORDINATION_MAX_SCENARIOS,
  SCENARIO_COORDINATION_MAX_SIGNALS,
  SCENARIO_COORDINATION_MAX_SNAPSHOTS,
  SCENARIO_COORDINATION_MAX_TOPOLOGIES,
} from "./scenarioCoordinationGuards";
import type {
  EnterpriseResponseTopology,
  OperationalInteractionField,
  ResponseReinforcementSignal,
  ScenarioCoordinationSnapshot,
  ScenarioCoordinationStoreState,
  StrategicResponseScenario,
} from "./scenarioCoordinationTypes";

function mergeTopologies(
  existing: EnterpriseResponseTopology,
  incoming: EnterpriseResponseTopology
): EnterpriseResponseTopology {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    interactionRelationships: Object.freeze(
      incoming.interactionRelationships.length >= existing.interactionRelationships.length
        ? incoming.interactionRelationships
        : existing.interactionRelationships
    ),
    coordinationRisks: Object.freeze(
      Array.from(new Set([...existing.coordinationRisks, ...incoming.coordinationRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    topologyState:
      incoming.confidence >= existing.confidence
        ? incoming.topologyState
        : existing.topologyState,
    coordinationStrength:
      incoming.confidence >= existing.confidence
        ? incoming.coordinationStrength
        : existing.coordinationStrength,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  responseTopologies: readonly EnterpriseResponseTopology[];
}): string {
  return stableSignature([
    "d9-5-4-scenario-coordination",
    state.responseTopologies.length,
    state.responseTopologies.slice(0, 3).map((t) => t.topologyId),
  ]);
}

export function createScenarioCoordinationStore(initial?: ScenarioCoordinationStoreState): {
  getState(): ScenarioCoordinationStoreState;
  upsertResponseTopologies(
    topologies: EnterpriseResponseTopology[],
    now?: number
  ): ScenarioCoordinationStoreState;
  upsertSnapshots(
    snapshots: ScenarioCoordinationSnapshot[],
    now?: number
  ): ScenarioCoordinationStoreState;
  upsertStrategicScenarios(
    scenarios: StrategicResponseScenario[],
    now?: number
  ): ScenarioCoordinationStoreState;
  upsertInteractionFields(
    fields: OperationalInteractionField[],
    now?: number
  ): ScenarioCoordinationStoreState;
  upsertReinforcementSignals(
    signals: ResponseReinforcementSignal[],
    now?: number
  ): ScenarioCoordinationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): ScenarioCoordinationStoreState;
} {
  let state: ScenarioCoordinationStoreState = initial ?? {
    responseTopologies: [],
    snapshots: [],
    strategicScenarios: [],
    interactionFields: [],
    reinforcementSignals: [],
    signature: buildStoreSignature({ responseTopologies: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): ScenarioCoordinationStoreState {
      return {
        ...state,
        responseTopologies: state.responseTopologies.map((t) => ({ ...t })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        strategicScenarios: state.strategicScenarios.map((s) => ({ ...s })),
        interactionFields: state.interactionFields.map((f) => ({ ...f })),
        reinforcementSignals: state.reinforcementSignals.map((s) => ({ ...s })),
      };
    },

    upsertResponseTopologies(
      topologies: EnterpriseResponseTopology[],
      now = Date.now()
    ): ScenarioCoordinationStoreState {
      const byId = new Map<string, EnterpriseResponseTopology>();
      for (const t of state.responseTopologies) byId.set(t.topologyId, t);
      for (const t of topologies) {
        const existing = byId.get(t.topologyId);
        byId.set(t.topologyId, existing ? mergeTopologies(existing, t) : { ...t });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, SCENARIO_COORDINATION_MAX_TOPOLOGIES);
      state = {
        ...state,
        responseTopologies: Object.freeze(next),
        signature: buildStoreSignature({ responseTopologies: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: ScenarioCoordinationSnapshot[],
      now = Date.now()
    ): ScenarioCoordinationStoreState {
      const byId = new Map<string, ScenarioCoordinationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, SCENARIO_COORDINATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrategicScenarios(
      scenarios: StrategicResponseScenario[],
      now = Date.now()
    ): ScenarioCoordinationStoreState {
      const byId = new Map<string, StrategicResponseScenario>();
      for (const s of state.strategicScenarios) byId.set(s.scenarioId, s);
      for (const s of scenarios) {
        const existing = byId.get(s.scenarioId);
        byId.set(s.scenarioId, existing ? { ...existing, ...s, occurrenceCount: existing.occurrenceCount + 1 } : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, SCENARIO_COORDINATION_MAX_SCENARIOS);
      state = { ...state, strategicScenarios: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertInteractionFields(
      fields: OperationalInteractionField[],
      now = Date.now()
    ): ScenarioCoordinationStoreState {
      const byId = new Map<string, OperationalInteractionField>();
      for (const f of state.interactionFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, SCENARIO_COORDINATION_MAX_FIELDS);
      state = { ...state, interactionFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertReinforcementSignals(
      signals: ResponseReinforcementSignal[],
      now = Date.now()
    ): ScenarioCoordinationStoreState {
      const byId = new Map<string, ResponseReinforcementSignal>();
      for (const s of state.reinforcementSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, SCENARIO_COORDINATION_MAX_SIGNALS);
      state = { ...state, reinforcementSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): ScenarioCoordinationStoreState {
      state = {
        responseTopologies: [],
        snapshots: [],
        strategicScenarios: [],
        interactionFields: [],
        reinforcementSignals: [],
        signature: buildStoreSignature({ responseTopologies: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createScenarioCoordinationStore>>();

export function getScenarioCoordinationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createScenarioCoordinationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetScenarioCoordinationStores(): void {
  storesByOrganization.clear();
}
