/**
 * S:2 — Draft to Simulation Adapter contract.
 *
 * Converts a valid active S:1 ScenarioDraft into a ScenarioSimulationRequest.
 * This adapter does not execute simulations and has no mutation authority.
 */

import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";
import type { ScenarioDraftBaselineReference } from "./scenarioDraftBuilderContract.ts";
import type { ScenarioSimulationRequest } from "./scenarioSimulationRuntimeContract.ts";

export const DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTIC = "[DRAFT_TO_SIMULATION_ADAPTER]" as const;

export const DRAFT_TO_SIMULATION_READY_DIAGNOSTIC = "[DRAFT_TO_SIMULATION_READY]" as const;

export const S2_DRAFT_ADAPTER_COMPLETE_TAG = "[S2_DRAFT_ADAPTER_COMPLETE]" as const;

export const DRAFT_TO_SIMULATION_ADAPTER_VERSION = "1.0.0" as const;

export type DraftToSimulationAdapterStatus = "ready" | "rejected";

export type DraftToSimulationAdapterResult = Readonly<{
  version: typeof DRAFT_TO_SIMULATION_ADAPTER_VERSION;
  status: DraftToSimulationAdapterStatus;
  draft: ScenarioDraft | null;
  request: ScenarioSimulationRequest | null;
  baselineReference: ScenarioDraftBaselineReference | null;
  reason: string;
  simulationExecution: false;
  sceneMutation: false;
  dsMutation: false;
  routingMutation: false;
  topologyMutation: false;
  draftMutation: false;
  diagnostics: readonly [
    typeof DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTIC,
    typeof DRAFT_TO_SIMULATION_READY_DIAGNOSTIC,
  ];
}>;

export const DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTICS = Object.freeze([
  DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTIC,
  DRAFT_TO_SIMULATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_DRAFT_TO_SIMULATION_ADAPTER_RESULT: DraftToSimulationAdapterResult = Object.freeze({
  version: DRAFT_TO_SIMULATION_ADAPTER_VERSION,
  status: "rejected",
  draft: null,
  request: null,
  baselineReference: null,
  reason: "ScenarioDraft is required.",
  simulationExecution: false,
  sceneMutation: false,
  dsMutation: false,
  routingMutation: false,
  topologyMutation: false,
  draftMutation: false,
  diagnostics: DRAFT_TO_SIMULATION_ADAPTER_DIAGNOSTICS,
});
