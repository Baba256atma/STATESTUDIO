/**
 * APP-5:1 — Scenario Timeline Platform domain types.
 * Immutable contract vocabulary — no visualization, storage, or execution.
 */

import type {
  SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";

export type ScenarioTimelineTypeId = string;
export type ScenarioTimelineEventId = string;
export type ScenarioTimelineScenarioId = string;
export type ScenarioTimelineWorkspaceId = string;

export type ScenarioTimelineCertificationStatus = "pending" | "pass" | "fail";
export type ScenarioTimelineFreezeState = "open" | "frozen";
export type ScenarioTimelineArchitectureStatus = "build" | "certified";

export type ScenarioTimelineLifecycleStage =
  (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number];

export type ScenarioTimelineEventType =
  (typeof SCENARIO_TIMELINE_EVENT_TYPE_KEYS)[number];

export type ScenarioTimelinePlatformIdentity = Readonly<{
  appId: "APP-5";
  title: "Scenario Timeline";
  version: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  status: ScenarioTimelineArchitectureStatus;
  certificationStatus: ScenarioTimelineCertificationStatus;
  freezeState: ScenarioTimelineFreezeState;
  architectureVersion: string;
}>;

export type ScenarioTimelineTypeRegistration = Readonly<{
  typeId: ScenarioTimelineTypeId;
  label: string;
  description: string;
  supportedLifecycleStages: readonly ScenarioTimelineLifecycleStage[];
  supportedEventTypes: readonly ScenarioTimelineEventType[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type ScenarioTimelineType = Readonly<{
  typeId: ScenarioTimelineTypeId;
  label: string;
  description: string;
  supportedLifecycleStages: readonly ScenarioTimelineLifecycleStage[];
  supportedEventTypes: readonly ScenarioTimelineEventType[];
  metadata: Readonly<Record<string, string>>;
  registeredAt: string;
  readOnly: true;
}>;

export type ScenarioTimelineEventContract = Readonly<{
  eventId: ScenarioTimelineEventId;
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  eventType: ScenarioTimelineEventType;
  lifecycleStage: ScenarioTimelineLifecycleStage;
  title: string;
  summary: string;
  occurredAt: string;
  sourceModule: string;
  contractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  timelineTypeId?: ScenarioTimelineTypeId;
  readOnly: true;
}>;

export type ScenarioTimelineValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ScenarioTimelineValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ScenarioTimelineValidationIssue[];
  readOnly: true;
}>;

export type ScenarioTimelinePlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformState = Readonly<{
  platformId: "scenario-timeline-platform";
  foundationVersion: string;
  contractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  timelineTypeCount: number;
  registeredTimelineTypeIds: readonly ScenarioTimelineTypeId[];
  supportedLifecycleStages: readonly ScenarioTimelineLifecycleStage[];
  supportedEventTypes: readonly ScenarioTimelineEventType[];
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineFutureCompatibility = Readonly<{
  app5Ready: boolean;
  eventsReady: boolean;
  storageReady: boolean;
  retrievalReady: boolean;
  visualizationReady: boolean;
  playbackReady: boolean;
  scenarioIntelligenceConsumerReady: boolean;
  executiveIntentConsumerReady: boolean;
  executiveMemoryConsumerReady: boolean;
  executiveTimeConsumerReady: boolean;
  readOnly: true;
  metadataOnly: true;
}>;

export type ScenarioTimelineRegistrySnapshot = Readonly<{
  registryVersion: string;
  timelineTypeCount: number;
  timelineTypeIds: readonly ScenarioTimelineTypeId[];
  readOnly: true;
}>;

export type ScenarioTimelinePlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  issues: readonly ScenarioTimelineValidationIssue[];
  readOnly: true;
}>;
