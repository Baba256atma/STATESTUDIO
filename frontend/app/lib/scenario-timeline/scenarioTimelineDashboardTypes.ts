/**
 * APP-5:8 — Scenario Timeline Dashboard Integration domain types.
 */

import type { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineDashboardConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type {
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineDashboardMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineDashboardDiagnostics = Readonly<{
  apiLayerReady: boolean;
  timelineHealthy: boolean;
  validationValid: boolean;
  assistantContextUsed: boolean;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardHealth = Readonly<{
  healthy: boolean;
  status: string;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardChangeRecord = Readonly<{
  eventId: string;
  fromStage: ScenarioTimelineLifecycleStage | null;
  toStage: ScenarioTimelineLifecycleStage;
  timestamp: string;
  title: string;
  summary: string;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardMilestoneView = Readonly<{
  milestoneId: string;
  milestoneKey: string;
  stage: ScenarioTimelineLifecycleStage | null;
  title: string;
  summary: string;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardMetrics = Readonly<{
  eventCount: number;
  milestoneCount: number;
  completedStageCount: number;
  remainingStageCount: number;
  historyDurationMs: number | null;
  progressPercent: number | null;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardContext = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  summary: string;
  status: ScenarioTimelineLifecycleStatus | null;
  progress: number | null;
  currentStage: ScenarioTimelineLifecycleStage | null;
  milestones: readonly ScenarioTimelineDashboardMilestoneView[];
  recentChanges: readonly ScenarioTimelineDashboardChangeRecord[];
  recentEvents: readonly ScenarioTimelineEvent[];
  historySummary: string;
  historyDuration: number | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  eventCount: number;
  timelineHealth: ScenarioTimelineDashboardHealth;
  diagnostics: ScenarioTimelineDashboardDiagnostics;
  platformVersion: typeof SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  metadata: ScenarioTimelineDashboardMetadata;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardViewModel = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  summary: string;
  executiveSummary: string;
  status: ScenarioTimelineLifecycleStatus | null;
  progress: number | null;
  currentStage: ScenarioTimelineLifecycleStage | null;
  milestones: readonly ScenarioTimelineDashboardMilestoneView[];
  recentChanges: readonly ScenarioTimelineDashboardChangeRecord[];
  recentEvents: readonly ScenarioTimelineEvent[];
  historySummary: string;
  historyDuration: number | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  eventCount: number;
  timelineHealth: ScenarioTimelineDashboardHealth;
  metrics: ScenarioTimelineDashboardMetrics;
  diagnostics: ScenarioTimelineDashboardDiagnostics;
  platformVersion: typeof SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  metadata: ScenarioTimelineDashboardMetadata;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardIntegrationInput = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  metadata?: ScenarioTimelineDashboardMetadata;
  useAssistantContext?: boolean;
}>;

export type ScenarioTimelineDashboardIntegrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredViewModelCount: number;
  viewModelIds: readonly string[];
  readOnly: true;
}>;

export type ScenarioTimelineDashboardCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineDashboardIntegrationCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineDashboardCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineDashboardContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  mandatoryContextFields: readonly string[];
  mandatoryViewModelFields: readonly string[];
  consumesApiLayerOnly: true;
  readOnly: true;
}>;
