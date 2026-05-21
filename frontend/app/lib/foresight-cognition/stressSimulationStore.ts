import { stableSignature } from "../intelligence/shared/dedupe";
import {
  STRESS_SIMULATION_MAX_PRESSURE_FIELDS,
  STRESS_SIMULATION_MAX_PROPAGATIONS,
  STRESS_SIMULATION_MAX_SCENARIOS,
  STRESS_SIMULATION_MAX_SIMULATIONS,
  STRESS_SIMULATION_MAX_SNAPSHOTS,
  STRESS_SIMULATION_MAX_STRAIN_SIGNALS,
} from "./stressSimulationGuards";
import type {
  AnticipatoryStrainSignal,
  EnterpriseStressPropagation,
  OperationalStressScenario,
  OrganizationalPressureField,
  StrategicPressureSimulation,
  StressSimulationSnapshot,
  StressSimulationStoreState,
} from "./stressSimulationTypes";

function mergeOperationalStressScenarios(
  existing: OperationalStressScenario,
  incoming: OperationalStressScenario
): OperationalStressScenario {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    stressSignals: Object.freeze(
      Array.from(new Set([...existing.stressSignals, ...incoming.stressSignals])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    confidenceLevel:
      incoming.confidence >= existing.confidence
        ? incoming.confidenceLevel
        : existing.confidenceLevel,
    stressSeverity:
      incoming.confidence >= existing.confidence
        ? incoming.stressSeverity
        : existing.stressSeverity,
    simulationState:
      incoming.confidence >= existing.confidence
        ? incoming.simulationState
        : existing.simulationState,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  operationalStressScenarios: readonly OperationalStressScenario[];
}): string {
  return stableSignature([
    "d9-4-5-stress-simulation",
    state.operationalStressScenarios.length,
    state.operationalStressScenarios.slice(0, 3).map((s) => s.stressScenarioId),
  ]);
}

export function createStressSimulationStore(initial?: StressSimulationStoreState): {
  getState(): StressSimulationStoreState;
  upsertOperationalStressScenarios(
    scenarios: OperationalStressScenario[],
    now?: number
  ): StressSimulationStoreState;
  upsertSnapshots(
    snapshots: StressSimulationSnapshot[],
    now?: number
  ): StressSimulationStoreState;
  upsertPressureSimulations(
    simulations: StrategicPressureSimulation[],
    now?: number
  ): StressSimulationStoreState;
  upsertStressPropagations(
    propagations: EnterpriseStressPropagation[],
    now?: number
  ): StressSimulationStoreState;
  upsertStrainSignals(
    signals: AnticipatoryStrainSignal[],
    now?: number
  ): StressSimulationStoreState;
  upsertPressureFields(
    fields: OrganizationalPressureField[],
    now?: number
  ): StressSimulationStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): StressSimulationStoreState;
} {
  let state: StressSimulationStoreState = initial ?? {
    operationalStressScenarios: [],
    snapshots: [],
    pressureSimulations: [],
    stressPropagations: [],
    strainSignals: [],
    pressureFields: [],
    signature: buildStoreSignature({ operationalStressScenarios: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): StressSimulationStoreState {
      return {
        ...state,
        operationalStressScenarios: state.operationalStressScenarios.map((s) => ({ ...s })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        pressureSimulations: state.pressureSimulations.map((s) => ({ ...s })),
        stressPropagations: state.stressPropagations.map((p) => ({ ...p })),
        strainSignals: state.strainSignals.map((s) => ({ ...s })),
        pressureFields: state.pressureFields.map((f) => ({ ...f })),
      };
    },

    upsertOperationalStressScenarios(
      scenarios: OperationalStressScenario[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, OperationalStressScenario>();
      for (const s of state.operationalStressScenarios) byId.set(s.stressScenarioId, s);
      for (const s of scenarios) {
        const existing = byId.get(s.stressScenarioId);
        byId.set(s.stressScenarioId, existing ? mergeOperationalStressScenarios(existing, s) : { ...s });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, STRESS_SIMULATION_MAX_SCENARIOS);
      state = {
        ...state,
        operationalStressScenarios: Object.freeze(next),
        signature: buildStoreSignature({ operationalStressScenarios: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: StressSimulationSnapshot[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, StressSimulationSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRESS_SIMULATION_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPressureSimulations(
      simulations: StrategicPressureSimulation[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, StrategicPressureSimulation>();
      for (const s of state.pressureSimulations) byId.set(s.simulationId, s);
      for (const s of simulations) byId.set(s.simulationId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRESS_SIMULATION_MAX_SIMULATIONS);
      state = { ...state, pressureSimulations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStressPropagations(
      propagations: EnterpriseStressPropagation[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, EnterpriseStressPropagation>();
      for (const p of state.stressPropagations) byId.set(p.propagationId, p);
      for (const p of propagations) byId.set(p.propagationId, p);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRESS_SIMULATION_MAX_PROPAGATIONS);
      state = { ...state, stressPropagations: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertStrainSignals(
      signals: AnticipatoryStrainSignal[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, AnticipatoryStrainSignal>();
      for (const s of state.strainSignals) byId.set(s.strainId, s);
      for (const s of signals) byId.set(s.strainId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRESS_SIMULATION_MAX_STRAIN_SIGNALS);
      state = { ...state, strainSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertPressureFields(
      fields: OrganizationalPressureField[],
      now = Date.now()
    ): StressSimulationStoreState {
      const byId = new Map<string, OrganizationalPressureField>();
      for (const f of state.pressureFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, STRESS_SIMULATION_MAX_PRESSURE_FIELDS);
      state = { ...state, pressureFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): StressSimulationStoreState {
      state = {
        operationalStressScenarios: [],
        snapshots: [],
        pressureSimulations: [],
        stressPropagations: [],
        strainSignals: [],
        pressureFields: [],
        signature: buildStoreSignature({ operationalStressScenarios: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<string, ReturnType<typeof createStressSimulationStore>>();

export function getStressSimulationStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createStressSimulationStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetStressSimulationStores(): void {
  storesByOrganization.clear();
}
