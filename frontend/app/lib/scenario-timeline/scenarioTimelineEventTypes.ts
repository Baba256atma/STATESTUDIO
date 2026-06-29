/**
 * APP-5:2 — Scenario Timeline Event Engine domain types.
 */

import type { SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineEventConstants.ts";
import type {
  ScenarioTimelineEventId,
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineEventMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineEventExtensions = Readonly<Record<string, string>>;

export type ScenarioTimelineEventIdentity = Readonly<{
  eventId: ScenarioTimelineEventId;
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  stage: ScenarioTimelineLifecycleStage;
  readOnly: true;
}>;

export type ScenarioTimelineEventVersion = Readonly<{
  semanticVersion: string;
  schemaVersion: string;
  engineVersion: typeof SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION;
  foundationContractVersion: string;
  readOnly: true;
}>;

export type ScenarioTimelineEvent = Readonly<{
  eventId: ScenarioTimelineEventId;
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  eventType: ScenarioTimelineEventType;
  stage: ScenarioTimelineLifecycleStage;
  timestamp: string;
  createdBy: string;
  platformVersion: typeof SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION;
  title: string;
  summary: string;
  sourceModule: string;
  sequenceOrder: number;
  identity: ScenarioTimelineEventIdentity;
  version: ScenarioTimelineEventVersion;
  metadata: ScenarioTimelineEventMetadata;
  extensions: ScenarioTimelineEventExtensions;
  readOnly: true;
}>;

export type CreateTimelineEventInput = Readonly<{
  eventId?: ScenarioTimelineEventId;
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  stage: ScenarioTimelineLifecycleStage;
  eventType?: ScenarioTimelineEventType;
  timestamp: string;
  createdBy: string;
  title: string;
  summary: string;
  sourceModule?: string;
  metadata?: ScenarioTimelineEventMetadata;
  extensions?: ScenarioTimelineEventExtensions;
}>;

export type ScenarioTimelineEventTypeRegistration = Readonly<{
  stage: ScenarioTimelineLifecycleStage;
  eventType: ScenarioTimelineEventType;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ScenarioTimelineEventEngineState = Readonly<{
  engineId: "scenario-timeline-event-engine";
  contractVersion: typeof SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  publishedEventCount: number;
  registeredEventTypeCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineEventResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ScenarioTimelineEventEngineError | null;
  readOnly: true;
}>;

export type ScenarioTimelineEventEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ScenarioTimelineEventRegistrySnapshot = Readonly<{
  registryVersion: string;
  publishedEventCount: number;
  registeredEventTypeCount: number;
  eventIds: readonly ScenarioTimelineEventId[];
  readOnly: true;
}>;

export type ScenarioTimelineEventEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineEventCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineEventCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineEventContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedStages: readonly ScenarioTimelineLifecycleStage[];
  readOnly: true;
}>;

export type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult };
