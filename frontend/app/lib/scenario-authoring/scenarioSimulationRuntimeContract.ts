/**
 * S:2 — Scenario Simulation Runtime contract.
 *
 * Consumes saved S:1 ScenarioDraft records and produces immutable simulation
 * snapshots. Read-only relative to scene, DS, routing, topology, and draft
 * registry state.
 */

import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";
import type { ScenarioDraftBaselineReference } from "./scenarioDraftBuilderContract.ts";
import type { ScenarioDraftRegistryEntry } from "./scenarioDraftRegistryContract.ts";

export const SCENARIO_SIMULATION_RUNTIME_DIAGNOSTIC = "[SCENARIO_SIMULATION_RUNTIME]" as const;

export const SCENARIO_SIMULATION_READY_DIAGNOSTIC = "[SCENARIO_SIMULATION_READY]" as const;

export const S2_RUNTIME_COMPLETE_TAG = "[S2_RUNTIME_COMPLETE]" as const;

export const SCENARIO_SIMULATION_RUNTIME_VERSION = "1.0.0" as const;

export type ScenarioSimulationStatus = "ready" | "blocked";

export type ScenarioSimulationMetadata = Readonly<{
  simulationId: string;
  draftId: string;
  draftName: string;
  scenarioType: ScenarioDraft["scenarioType"];
  sourceDraftUpdatedAt: string;
  simulatedAt: string;
  savedDraftConsumed: true;
  registryStatus: ScenarioDraftRegistryEntry["registryStatus"];
  immutable: true;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
}>;

export type ScenarioSimulationRequest = Readonly<{
  draftId: string;
  baselineReference?: ScenarioDraftBaselineReference;
  includeArchived?: boolean;
  requestedBy?: string;
  requestReason?: string;
  dryRun?: true;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
}>;

export type ScenarioSimulationResult = Readonly<{
  version: typeof SCENARIO_SIMULATION_RUNTIME_VERSION;
  status: ScenarioSimulationStatus;
  draft: ScenarioDraft | null;
  metadata: ScenarioSimulationMetadata | null;
  summary: string;
  focusObjectIds: readonly string[];
  assumptions: readonly string[];
  changeCount: number;
  validationMessages: readonly string[];
  readinessScore: number;
  savedDraftConsumed: boolean;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  topologyMutation: false;
  draftMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_SIMULATION_RUNTIME_DIAGNOSTIC,
    typeof SCENARIO_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const SCENARIO_SIMULATION_RUNTIME_DIAGNOSTICS = Object.freeze([
  SCENARIO_SIMULATION_RUNTIME_DIAGNOSTIC,
  SCENARIO_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_SIMULATION_RESULT: ScenarioSimulationResult = Object.freeze({
  version: SCENARIO_SIMULATION_RUNTIME_VERSION,
  status: "blocked",
  draft: null,
  metadata: null,
  summary: "No saved scenario draft has been simulated.",
  focusObjectIds: Object.freeze([]),
  assumptions: Object.freeze([]),
  changeCount: 0,
  validationMessages: Object.freeze(["Saved ScenarioDraft is required."]),
  readinessScore: 0,
  savedDraftConsumed: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  topologyMutation: false,
  draftMutation: false,
  diagnostics: SCENARIO_SIMULATION_RUNTIME_DIAGNOSTICS,
});
