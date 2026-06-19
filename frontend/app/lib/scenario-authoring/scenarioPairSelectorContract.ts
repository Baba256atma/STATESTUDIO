/**
 * C:1 — Scenario Pair Selector contract.
 *
 * Selects compatible scenario pairs for comparison without executing
 * simulations or mutating scenario, scene, topology, routing, DS, or object
 * state.
 */

import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";
import type { ScenarioComparisonRequest } from "./ScenarioComparisonContract.ts";
import type { ExecutiveSimulationSummary } from "./simulationResultAggregatorContract.ts";

export const SCENARIO_PAIR_SELECTOR_DIAGNOSTIC = "[SCENARIO_PAIR_SELECTOR]" as const;

export const SCENARIO_PAIR_SELECTOR_READY_DIAGNOSTIC = "[SCENARIO_PAIR_SELECTOR_READY]" as const;

export const C1_PAIR_SELECTOR_COMPLETE_TAG = "[C1_PAIR_SELECTOR_COMPLETE]" as const;

export const SCENARIO_PAIR_SELECTOR_VERSION = "1.0.0" as const;

export type ScenarioPairSelectionKind = "draft" | "simulation";

export type ScenarioPairSelectionMode =
  | "draft_vs_draft"
  | "simulation_vs_simulation"
  | "baseline_vs_simulation";

export type ScenarioPairSelectionCandidate = Readonly<{
  kind: ScenarioPairSelectionKind;
  draft?: ScenarioDraft | null;
  simulation?: ExecutiveSimulationSummary | null;
  baseline?: boolean;
}>;

export type ScenarioPairSelectorInput = Readonly<{
  comparisonId: string;
  mode: ScenarioPairSelectionMode;
  scenarioA: ScenarioPairSelectionCandidate;
  scenarioB: ScenarioPairSelectionCandidate;
}>;

export type ScenarioPairSelectorResult = Readonly<{
  version: typeof SCENARIO_PAIR_SELECTOR_VERSION;
  accepted: boolean;
  reason: string;
  mode: ScenarioPairSelectionMode;
  comparisonRequest: ScenarioComparisonRequest | null;
  simulationExecution: false;
  readOnly: true;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  objectMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_PAIR_SELECTOR_DIAGNOSTIC,
    typeof SCENARIO_PAIR_SELECTOR_READY_DIAGNOSTIC,
  ];
}>;

export const SCENARIO_PAIR_SELECTOR_DIAGNOSTICS = Object.freeze([
  SCENARIO_PAIR_SELECTOR_DIAGNOSTIC,
  SCENARIO_PAIR_SELECTOR_READY_DIAGNOSTIC,
] as const);

export const EMPTY_SCENARIO_PAIR_SELECTOR_RESULT: ScenarioPairSelectorResult = Object.freeze({
  version: SCENARIO_PAIR_SELECTOR_VERSION,
  accepted: false,
  reason: "No scenario pair has been selected.",
  mode: "draft_vs_draft",
  comparisonRequest: null,
  simulationExecution: false,
  readOnly: true,
  mutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  objectMutation: false,
  diagnostics: SCENARIO_PAIR_SELECTOR_DIAGNOSTICS,
});
