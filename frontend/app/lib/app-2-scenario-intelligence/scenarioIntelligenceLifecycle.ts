/**
 * APP-2:1 — Scenario Intelligence lifecycle contract.
 * Immutable lifecycle stages — no engine transitions or persistence.
 */

import type {
  ScenarioLifecycleStageDefinition,
  ScenarioLifecycleStageKey,
  ScenarioStatus,
} from "./scenarioIntelligenceTypes.ts";
import { SCENARIO_STATUS_KEYS } from "./scenarioIntelligenceContract.ts";

export const SCENARIO_INTELLIGENCE_LIFECYCLE_VERSION = "APP-2/1" as const;

export const SCENARIO_LIFECYCLE_STAGE_DEFINITIONS: readonly ScenarioLifecycleStageDefinition[] =
  Object.freeze([
    Object.freeze({
      key: "created",
      order: 0,
      label: "Created",
      description: "Scenario identity registered in the APP-2 contract boundary.",
    }),
    Object.freeze({
      key: "draft",
      order: 1,
      label: "Draft",
      description: "Scenario metadata exists but intelligence analysis has not started.",
    }),
    Object.freeze({
      key: "analyzing",
      order: 2,
      label: "Analyzing",
      description: "Scenario is eligible for future APP-2 intelligence analysis.",
    }),
    Object.freeze({
      key: "waiting",
      order: 3,
      label: "Waiting",
      description: "Scenario is blocked on external executive references or approvals.",
    }),
    Object.freeze({
      key: "active",
      order: 4,
      label: "Active",
      description: "Scenario is the current executive intelligence focus.",
    }),
    Object.freeze({
      key: "monitoring",
      order: 5,
      label: "Monitoring",
      description: "Scenario remains observable after activation.",
    }),
    Object.freeze({
      key: "completed",
      order: 6,
      label: "Completed",
      description: "Scenario intelligence lifecycle reached a terminal success state.",
    }),
    Object.freeze({
      key: "archived",
      order: 7,
      label: "Archived",
      description: "Scenario is retained for audit and read-only inspection.",
    }),
  ]);

export const SCENARIO_LIFECYCLE_TERMINAL_STAGES = Object.freeze([
  "completed",
  "archived",
] as const satisfies readonly ScenarioStatus[]);

export function isScenarioLifecycleTerminalStage(stage: ScenarioLifecycleStageKey): boolean {
  return (SCENARIO_LIFECYCLE_TERMINAL_STAGES as readonly string[]).includes(stage);
}

export function getScenarioLifecycleStageDefinition(
  stage: ScenarioLifecycleStageKey
): ScenarioLifecycleStageDefinition | null {
  return SCENARIO_LIFECYCLE_STAGE_DEFINITIONS.find((entry) => entry.key === stage) ?? null;
}

export function listScenarioLifecycleStageKeys(): readonly ScenarioLifecycleStageKey[] {
  return SCENARIO_STATUS_KEYS;
}
