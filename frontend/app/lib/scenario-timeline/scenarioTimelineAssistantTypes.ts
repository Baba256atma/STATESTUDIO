/**
 * APP-5:7 — Scenario Timeline Assistant Integration domain types.
 */

import type {
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
} from "./scenarioTimelineAssistantConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistorySummary } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineHistoryMilestone } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type {
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineScenarioId,
  ScenarioTimelineWorkspaceId,
} from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelineAssistantQuestionKey = (typeof SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS)[number];

export type ScenarioTimelineAssistantMetadata = Readonly<Record<string, string>>;

export type ScenarioTimelineAssistantWarning = Readonly<{
  code: string;
  message: string;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantDiagnostics = Readonly<{
  apiLayerReady: boolean;
  timelineHealthy: boolean;
  validationValid: boolean;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantChangeRecord = Readonly<{
  eventId: string;
  fromStage: ScenarioTimelineLifecycleStage | null;
  toStage: ScenarioTimelineLifecycleStage;
  timestamp: string;
  title: string;
  summary: string;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantContext = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  timelineSummary: string;
  timelineHistory: readonly ScenarioTimelineEvent[];
  currentStage: ScenarioTimelineLifecycleStage | null;
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  milestones: readonly ScenarioTimelineAssistantMilestoneView[];
  recentChanges: readonly ScenarioTimelineAssistantChangeRecord[];
  importantEvents: readonly ScenarioTimelineEvent[];
  historyDuration: number | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  warnings: readonly ScenarioTimelineAssistantWarning[];
  diagnostics: ScenarioTimelineAssistantDiagnostics;
  platformVersion: typeof SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
  metadata: ScenarioTimelineAssistantMetadata;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantMilestoneView = Readonly<{
  milestoneId: string;
  milestoneKey: string;
  stage: ScenarioTimelineLifecycleStage | null;
  title: string;
  summary: string;
  timestamp: string;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantSummary = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  narrative: string;
  eventCount: number;
  milestoneCount: number;
  currentStage: ScenarioTimelineLifecycleStage | null;
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantExplanation = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  topic: string;
  explanation: string;
  evidenceEventIds: readonly string[];
  readOnly: true;
}>;

export type ScenarioTimelineAssistantAnswer = Readonly<{
  questionKey: ScenarioTimelineAssistantQuestionKey;
  question: string;
  answer: string;
  context: ScenarioTimelineAssistantContext;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantIntegrationInput = Readonly<{
  scenarioId: ScenarioTimelineScenarioId;
  workspaceId: ScenarioTimelineWorkspaceId;
  metadata?: ScenarioTimelineAssistantMetadata;
}>;

export type ScenarioTimelineAssistantIntegrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredContextCount: number;
  contextIds: readonly string[];
  readOnly: true;
}>;

export type ScenarioTimelineAssistantCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelineAssistantIntegrationCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ScenarioTimelineAssistantCertificationCheck[];
  readOnly: true;
}>;

export type ScenarioTimelineAssistantContractSurface = Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
  mandatoryContextFields: readonly string[];
  supportedQuestions: readonly ScenarioTimelineAssistantQuestionKey[];
  consumesApiLayerOnly: true;
  readOnly: true;
}>;

export type { ScenarioTimelineHistorySummary };
