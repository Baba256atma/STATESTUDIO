/**
 * APP-2:1 — Scenario Intelligence state definitions.
 * Immutable health-state vocabulary — no scoring or evaluation logic.
 */

import type { ScenarioHealthState, ScenarioStateDefinition } from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_HEALTH_STATE_KEYS } from "./scenarioIntelligenceContract.ts";

export const SCENARIO_INTELLIGENCE_STATES_VERSION = "APP-2/1" as const;

export const SCENARIO_STATE_DEFINITIONS: readonly ScenarioStateDefinition[] = Object.freeze([
  Object.freeze({
    key: "unknown",
    label: "Unknown",
    description: "Scenario health has not been classified by a future APP-2 engine.",
    severityRank: 0,
  }),
  Object.freeze({
    key: "healthy",
    label: "Healthy",
    description: "Scenario references and lifecycle metadata are contract compliant.",
    severityRank: 1,
  }),
  Object.freeze({
    key: "attention",
    label: "Attention",
    description: "Scenario requires executive review but is not yet impaired.",
    severityRank: 2,
  }),
  Object.freeze({
    key: "warning",
    label: "Warning",
    description: "Scenario has contract or dependency warnings requiring follow-up.",
    severityRank: 3,
  }),
  Object.freeze({
    key: "critical",
    label: "Critical",
    description: "Scenario has critical contract or dependency violations.",
    severityRank: 4,
  }),
  Object.freeze({
    key: "blocked",
    label: "Blocked",
    description: "Scenario cannot proceed until blocking references are restored.",
    severityRank: 5,
  }),
]);

export const SCENARIO_DEFAULT_HEALTH_STATE: ScenarioHealthState = "unknown";

export function getScenarioStateDefinition(
  state: ScenarioHealthState
): ScenarioStateDefinition | null {
  return SCENARIO_STATE_DEFINITIONS.find((entry) => entry.key === state) ?? null;
}

export function listScenarioHealthStateKeys(): readonly ScenarioHealthState[] {
  return SCENARIO_HEALTH_STATE_KEYS;
}
