/**
 * APP-5:5 — Scenario Timeline Query Engine domain types.
 */

import type {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_FILTER_KEYS,
  SCENARIO_TIMELINE_QUERY_TYPE_KEYS,
} from "./scenarioTimelineQueryConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistory, ScenarioTimelineHistorySummary } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycle, ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type {
  ScenarioTimelineEventId,
  ScenarioTimelineEventType,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineValidationIssue,
  ScenarioTimelineValidationResult,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineQueryType = (typeof SCENARIO_TIMELINE_QUERY_TYPE_KEYS)[number];
export type ScenarioTimelineQueryFilterKey = (typeof SCENARIO_TIMELINE_QUERY_FILTER_KEYS)[number];

export type ScenarioTimelineQueryFilters = Readonly<{
  scenarioId?: ScenarioTimelineScenarioId;
  workspaceId?: ScenarioTimelineWorkspaceId;
  eventId?: ScenarioTimelineEventId;
  historyId?: string;
  stage?: ScenarioTimelineLifecycleStage;
  eventType?: ScenarioTimelineEventType;
  dateFrom?: string;
  dateTo?: string;
  sequenceFrom?: number;
  sequenceTo?: number;
}>;

export type ScenarioTimelineQueryInput = Readonly<{
  queryType: ScenarioTimelineQueryType;
  filters: ScenarioTimelineQueryFilters;
  metadata?: Readonly<Record<string, string>>;
}>;

export type ScenarioTimelineQueryMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineQueryResult = Readonly<{
  scenarioId: ScenarioTimelineScenarioId | null;
  workspaceId: ScenarioTimelineWorkspaceId | null;
  queryId: string;
  queryType: ScenarioTimelineQueryType;
  filters: ScenarioTimelineQueryFilters;
  events: readonly ScenarioTimelineEvent[];
  history: ScenarioTimelineHistory | null;
  lifecycle: ScenarioTimelineLifecycle | null;
  summary: ScenarioTimelineHistorySummary | null;
  milestones: ScenarioTimelineHistory["milestones"];
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  latestEvent: ScenarioTimelineEvent | null;
  firstEvent: ScenarioTimelineEvent | null;
  duration: number | null;
  validationResult: ScenarioTimelineValidationResult;
  metadata: ScenarioTimelineQueryMetadata;
  queryTimestamp: string;
  platformVersion: typeof SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ScenarioTimelineQueryEngineState = Readonly<{
  engineId: "scenario-timeline-query-engine";
  contractVersion: typeof SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredQueryCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineQueryResponse = Readonly<{
  success: boolean;
  reason: string;
  data: ScenarioTimelineQueryResult | null;
  readOnly: true;
}>;

export type ScenarioTimelineQueryRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredQueryCount: number;
  queryIds: readonly string[];
  readOnly: true;
}>;

export type ScenarioTimelineQueryCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineQueryEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineQueryCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineQueryContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION;
  mandatoryResultFields: readonly string[];
  supportedQueryTypes: readonly ScenarioTimelineQueryType[];
  supportedFilters: readonly ScenarioTimelineQueryFilterKey[];
  readOnly: true;
}>;

export type { ScenarioTimelineValidationIssue, ScenarioTimelineValidationResult };
