/**
 * APP-2:1 — Scenario Intelligence contract.
 * Immutable architecture vocabulary, isolation manifest, and validation helpers.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ScenarioHealthState,
  ScenarioIdentity,
  ScenarioIntelligenceIdentity,
  ScenarioIntelligenceValidationIssue,
  ScenarioIntelligenceValidationResult,
  ScenarioLifecycleStageKey,
  ScenarioSource,
  ScenarioStatus,
  ScenarioType,
} from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_INTELLIGENCE_CONTRACT_VERSION = "APP-2/1" as const;
export const SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION = "APP-2/1-arch" as const;
export const SCENARIO_INTELLIGENCE_SOURCE = "app-2-scenario-intelligence-contract" as const;
export const SCENARIO_INTELLIGENCE_LOG_PREFIX = "[NexoraScenarioIntelligence]" as const;

export const SCENARIO_INTELLIGENCE_IDENTITY: ScenarioIntelligenceIdentity = Object.freeze({
  appId: "APP-2",
  title: "Scenario Intelligence",
  version: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
});

export const SCENARIO_INTELLIGENCE_TAGS = Object.freeze([
  "[APP2_1_SCENARIO_INTELLIGENCE_CONTRACT]",
  "[SCENARIO_INTELLIGENCE_CONTRACT_READY]",
  "[SCENARIO_INTELLIGENCE_READ_ONLY]",
  "[NO_INTELLIGENCE_EXECUTION]",
  "[NO_RECOMMENDATIONS]",
  "[NO_AI_REASONING]",
  "[EXECUTIVE_TIME_AWARE]",
  "[TIMELINE_AWARE]",
  "[WORKSPACE_AWARE]",
] as const);

export const SCENARIO_TYPE_KEYS = Object.freeze([
  "baseline",
  "what_if",
  "stress_test",
  "comparison",
  "simulation",
  "authoring",
  "manual",
] as const satisfies readonly ScenarioType[]);

export const SCENARIO_SOURCE_KEYS = Object.freeze([
  "scenario_authoring",
  "scenario_simulation",
  "compare_engine",
  "workspace",
  "manual",
  "import",
] as const satisfies readonly ScenarioSource[]);

export const SCENARIO_STATUS_KEYS = Object.freeze([
  "created",
  "draft",
  "analyzing",
  "waiting",
  "active",
  "monitoring",
  "completed",
  "archived",
] as const satisfies readonly ScenarioStatus[]);

export const SCENARIO_HEALTH_STATE_KEYS = Object.freeze([
  "unknown",
  "healthy",
  "attention",
  "warning",
  "critical",
  "blocked",
] as const satisfies readonly ScenarioHealthState[]);

export const SCENARIO_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "scenarioId",
  "workspaceId",
  "scenarioType",
  "createdAt",
  "updatedAt",
  "owner",
  "source",
  "executiveTimeReference",
  "timelineReference",
  "status",
] as const);

export const SCENARIO_INTELLIGENCE_MUST_NOT_OWN = Object.freeze([
  "scenario_engine",
  "priority_engine",
  "conflict_engine",
  "opportunity_engine",
  "recommendations",
  "assistant_integration",
  "dashboard_integration",
  "executive_summaries",
  "learning",
  "predictions",
  "ai_reasoning",
  "ml_inference",
  "decision_execution",
  "scoring",
  "calculations",
  "scenario_simulation_execution",
  "compare_engine_execution",
] as const);

export const SCENARIO_INTELLIGENCE_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executive-time/executiveTimeContextEngine",
  "executive-time/executiveTimeStateEngine",
  "executive-time/executiveTimeTransitionEngine",
  "executive-time/executiveTimePriorityEngine",
  "executive-time/executiveEventEngine",
  "executive-time/executivePredictionEngine",
  "executive-time/executiveConflictEngine",
  "scenario-authoring/",
  "scenario-intelligence/ScenarioRecommendationEngine",
  "scenario-intelligence/ScenarioBuilderEngine",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
] as const);

export const SCENARIO_INTELLIGENCE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-2/1",
  title: "Scenario Intelligence Contract",
  goal: "Immutable APP-2 architecture contract — interfaces, lifecycle, diagnostics, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceTypes.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceContract.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceDiagnostics.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceLifecycle.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceMetadata.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceEvents.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceStates.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceApi.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceCertificationContract.ts",
    "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligenceContract.test.ts",
    "docs/app-2-1-scenario-intelligence-contract-report.md",
  ]),
  forbiddenPatterns: SCENARIO_INTELLIGENCE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_INTELLIGENCE_TAGS,
} satisfies StageManifest);

export const SCENARIO_INTELLIGENCE_MODULE_PATHS = Object.freeze(
  SCENARIO_INTELLIGENCE_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const SCENARIO_INTELLIGENCE_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  intelligenceExecutionDeferred: true,
} as const);

function issue(code: string, message: string): ScenarioIntelligenceValidationIssue {
  return Object.freeze({ code, message });
}

export function isScenarioType(value: string): value is ScenarioType {
  return (SCENARIO_TYPE_KEYS as readonly string[]).includes(value);
}

export function isScenarioSource(value: string): value is ScenarioSource {
  return (SCENARIO_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isScenarioStatus(value: string): value is ScenarioStatus {
  return (SCENARIO_STATUS_KEYS as readonly string[]).includes(value);
}

export function isScenarioHealthState(value: string): value is ScenarioHealthState {
  return (SCENARIO_HEALTH_STATE_KEYS as readonly string[]).includes(value);
}

export function isScenarioLifecycleStageKey(value: string): value is ScenarioLifecycleStageKey {
  return isScenarioStatus(value);
}

export function validateScenarioIdentityShape(
  input: Partial<ScenarioIdentity>
): ScenarioIntelligenceValidationResult {
  const issues: ScenarioIntelligenceValidationIssue[] = [];
  for (const field of SCENARIO_IDENTITY_MANDATORY_FIELDS) {
    if (!(field in input) || input[field as keyof ScenarioIdentity] === undefined) {
      issues.push(issue(`missing_${field}`, `scenario.${field} is required.`));
    }
  }
  if (input.scenarioType && !isScenarioType(input.scenarioType)) {
    issues.push(issue("invalid_scenario_type", "scenarioType must be a known scenario type."));
  }
  if (input.source && !isScenarioSource(input.source)) {
    issues.push(issue("invalid_source", "source must be a known scenario source."));
  }
  if (input.status && !isScenarioStatus(input.status)) {
    issues.push(issue("invalid_status", "status must be a known scenario lifecycle status."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function resolveScenarioIdentityExample(): ScenarioIdentity {
  return Object.freeze({
    scenarioId: "scn-example-001",
    workspaceId: "ws-example-001",
    scenarioType: "what_if",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    owner: "system",
    source: "manual",
    executiveTimeReference: Object.freeze({
      contextKey: "now",
      eventId: null,
      timestamp: new Date(0).toISOString(),
      readOnly: true as const,
    }),
    timelineReference: Object.freeze({
      timelineId: "timeline-example-001",
      anchorTimestamp: new Date(0).toISOString(),
      readOnly: true as const,
    }),
    status: "created",
  });
}
