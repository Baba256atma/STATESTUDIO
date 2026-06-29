/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine domain types.
 */

import type { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION, SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS } from "./scenarioTimelineLifecycleConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type {
  ScenarioTimelineEventId,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineLifecycleStatus = (typeof SCENARIO_TIMELINE_LIFECYCLE_STATUS_KEYS)[number];

export type ScenarioTimelineLifecycleTransitionRecord = Readonly<{
  fromStage: ScenarioTimelineLifecycleStage | null;
  toStage: ScenarioTimelineLifecycleStage;
  eventId: ScenarioTimelineEventId;
  timestamp: string;
  sequenceOrder: number;
  valid: boolean;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineLifecycle = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  currentStage: ScenarioTimelineLifecycleStage | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  progressPercentage: number;
  status: ScenarioTimelineLifecycleStatus;
  lastEventId: ScenarioTimelineEventId | null;
  lastTimestamp: string | null;
  transitionHistory: readonly ScenarioTimelineLifecycleTransitionRecord[];
  isCompleted: boolean;
  isBlocked: boolean;
  validationResult: ScenarioTimelineValidationResult;
  platformVersion: typeof SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  metadata: ScenarioTimelineLifecycleMetadata;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleSummary = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  currentStage: ScenarioTimelineLifecycleStage | null;
  progressPercentage: number;
  status: ScenarioTimelineLifecycleStatus;
  isCompleted: boolean;
  isBlocked: boolean;
  eventCount: number;
  readOnly: true;
}>;

export type BuildScenarioLifecycleInput = Readonly<{
  events: readonly ScenarioTimelineEvent[];
  metadata?: ScenarioTimelineLifecycleMetadata;
}>;

export type ScenarioLifecycleTransitionValidation = Readonly<{
  valid: boolean;
  fromStage: ScenarioTimelineLifecycleStage | null;
  toStage: ScenarioTimelineLifecycleStage;
  reason: string;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleEngineState = Readonly<{
  engineId: "scenario-timeline-lifecycle-engine";
  contractVersion: typeof SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredLifecycleCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredLifecycleCount: number;
  scenarioIds: readonly ScenarioTimelineScenarioId[];
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineLifecycleCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineLifecycleContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedStages: readonly ScenarioTimelineLifecycleStage[];
  supportedStatuses: readonly ScenarioTimelineLifecycleStatus[];
  readOnly: true;
}>;

export type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult };
