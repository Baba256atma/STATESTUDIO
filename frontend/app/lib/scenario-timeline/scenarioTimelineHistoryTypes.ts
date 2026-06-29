/**
 * APP-5:4 — Scenario Timeline History Engine domain types.
 */

import type {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_HISTORY_MILESTONE_KEYS,
} from "./scenarioTimelineHistoryConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineLifecycle } from "./scenarioTimelineLifecycleTypes.ts";
import type {
  ScenarioTimelineEventId,
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineHistoryMilestoneKey = (typeof SCENARIO_TIMELINE_HISTORY_MILESTONE_KEYS)[number];

export type ScenarioTimelineHistoryMilestone = Readonly<{
  milestoneId: string;
  milestoneKey: ScenarioTimelineHistoryMilestoneKey;
  stage: ScenarioTimelineLifecycleStage | null;
  eventId: ScenarioTimelineEventId;
  timestamp: string;
  title: string;
  summary: string;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryStageGroup = Readonly<{
  stage: ScenarioTimelineLifecycleStage;
  eventIds: readonly ScenarioTimelineEventId[];
  eventCount: number;
  firstTimestamp: string;
  lastTimestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryGroups = Readonly<{
  byLifecycleStage: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  byCalendarDate: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  byEventType: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  bySequenceOrder: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  byWorkspace: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  byScenario: Readonly<Record<string, readonly ScenarioTimelineEventId[]>>;
  readOnly: true;
}>;

export type ScenarioTimelineHistorySummary = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  historyId: string;
  narrative: string;
  eventCount: number;
  milestoneCount: number;
  latestStage: ScenarioTimelineLifecycleStage | null;
  latestEventId: ScenarioTimelineEventId | null;
  historyStart: string | null;
  historyEnd: string | null;
  durationMs: number;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineHistory = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  historyId: string;
  events: readonly ScenarioTimelineEvent[];
  orderedEvents: readonly ScenarioTimelineEvent[];
  milestones: readonly ScenarioTimelineHistoryMilestone[];
  historySummary: ScenarioTimelineHistorySummary;
  historyStart: string | null;
  historyEnd: string | null;
  duration: number;
  eventCount: number;
  stageGroups: readonly ScenarioTimelineHistoryStageGroup[];
  groups: ScenarioTimelineHistoryGroups;
  latestStage: ScenarioTimelineLifecycleStage | null;
  latestEventId: ScenarioTimelineEventId | null;
  timelineVersion: typeof SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION;
  validationResult: ScenarioTimelineValidationResult;
  metadata: ScenarioTimelineHistoryMetadata;
  readOnly: true;
}>;

export type BuildScenarioHistoryInput = Readonly<{
  events: readonly ScenarioTimelineEvent[];
  lifecycle?: ScenarioTimelineLifecycle;
  metadata?: ScenarioTimelineHistoryMetadata;
}>;

export type ScenarioTimelineHistoryEngineState = Readonly<{
  engineId: "scenario-timeline-history-engine";
  contractVersion: typeof SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredHistoryCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredHistoryCount: number;
  historyIds: readonly string[];
  scenarioIds: readonly ScenarioTimelineScenarioId[];
  readOnly: true;
}>;

export type ScenarioTimelineHistoryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineHistoryEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineHistoryCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineHistoryContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedStages: readonly ScenarioTimelineLifecycleStage[];
  milestoneKeys: readonly ScenarioTimelineHistoryMilestoneKey[];
  readOnly: true;
}>;

export type { ScenarioTimelineEventType, ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult };
