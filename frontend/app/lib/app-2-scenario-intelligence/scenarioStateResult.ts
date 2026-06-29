/**
 * APP-2:2 — Scenario State Engine result types.
 * Immutable evaluation output — no UI or rendering artifacts.
 */

import type {
  ScenarioDiagnostic,
  ScenarioHealthState,
  ScenarioIdentity,
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioMetadataRecord,
  ScenarioStatus,
} from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_STATE_ENGINE_VERSION = "APP-2/2" as const;

export type ScenarioOperationalState =
  | "unknown"
  | "inactive"
  | "active"
  | "monitoring"
  | "blocked"
  | "archived";

export type ScenarioStateEvaluationInput = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  evaluatedAt: string;
  identity: ScenarioIdentity | null;
  metadata: ScenarioMetadataRecord | null;
}>;

export type ScenarioStateResult = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  currentState: ScenarioHealthState;
  lifecycle: ScenarioStatus;
  operationalState: ScenarioOperationalState;
  confidence: number;
  completeness: number;
  monitoringEligible: boolean;
  isArchived: boolean;
  isInactive: boolean;
  isBlocked: boolean;
  diagnostics: readonly ScenarioDiagnostic[];
  timestamp: string;
  readOnly: true;
  engineVersion: typeof SCENARIO_STATE_ENGINE_VERSION;
}>;

export const SCENARIO_STATE_CONFIDENCE_BY_HEALTH: Readonly<Record<ScenarioHealthState, number>> =
  Object.freeze({
    healthy: 1,
    attention: 0.75,
    warning: 0.5,
    critical: 0.25,
    blocked: 0.1,
    unknown: 0,
  });

export function createScenarioStateResult(
  input: Omit<ScenarioStateResult, "readOnly" | "engineVersion">
): ScenarioStateResult {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    engineVersion: SCENARIO_STATE_ENGINE_VERSION,
  });
}
