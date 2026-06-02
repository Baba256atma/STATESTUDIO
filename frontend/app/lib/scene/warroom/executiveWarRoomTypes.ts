/**
 * E2:97 — Executive War Room runtime contracts.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import type { ExecutiveScenarioUniverseState } from "../scenario/executiveMultiScenarioUniverseTypes";
import type { ScenarioPlaybackStatus } from "../scenario/executiveScenarioPlaybackTypes";
import type { TypeCAlert } from "../../typec/typeCAlerts";
import type { TypeCDecisionRecommendation } from "../../typec/typeCDecisionRecommendation";
import type { TypeCExecutionState } from "../../typec/typeCExecutionState";
import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";
import type { ExecutiveCognitiveTwinState } from "../twin/executiveCognitiveTwinTypes";
import type { ExecutiveAdvisorState } from "../advisor/executiveAdvisorTypes";

export type ExecutiveWarRoomFocusMode =
  | "operations"
  | "risk"
  | "scenario"
  | "recovery"
  | "growth"
  | "strategic";

export type ExecutiveWarRoomStatusLevel = "stable" | "warning" | "elevated" | "critical";

export type ExecutiveWarRoomEventKind =
  | "incident"
  | "risk"
  | "opportunity"
  | "milestone"
  | "decision";

export type ExecutiveWarRoomAlertCategory =
  | "risk"
  | "operations"
  | "finance"
  | "scenario"
  | "governance";

export type ExecutiveWarRoomAlertSeverity = "low" | "medium" | "high" | "critical";

export type ExecutiveWarRoomRecommendationStatus = "pending" | "accepted" | "rejected" | "completed";

export type ExecutiveWarRoomSimulationStatus = "running" | "paused" | "completed" | "failed" | "idle";

export type ExecutiveWarRoomCommandId =
  | "analyze_system"
  | "show_risks"
  | "compare_scenarios"
  | "run_simulation"
  | "explain_situation"
  | "strategic_recommendation";

export type ExecutiveWarRoomOperationalContext = {
  selectedObjectId: string | null;
  selectedClusterId: string | null;
  selectedScenarioId: string | null;
  selectedRiskId: string | null;
  selectedTimelineEventId: string | null;
};

export type ExecutiveWarRoomMissionState = {
  focusMode: ExecutiveWarRoomFocusMode;
  autoFocusMode: ExecutiveWarRoomFocusMode;
  missionLabel: string;
  missionSummary: string;
};

export type ExecutiveWarRoomSituationBrief = {
  headline: string;
  summary: string;
  statusLevel: ExecutiveWarRoomStatusLevel;
};

export type ExecutiveWarRoomStrategicSummary = {
  headline: string;
  position: string;
  recommendedAction: string | null;
};

export type ExecutiveWarRoomEventRecord = {
  id: string;
  kind: ExecutiveWarRoomEventKind;
  title: string;
  summary: string;
  severity: ExecutiveWarRoomAlertSeverity;
  priorityScore: number;
  relatedObjectIds: readonly string[];
  escalated: boolean;
  timestampLabel: string | null;
};

export type ExecutiveWarRoomAlertRecord = {
  id: string;
  category: ExecutiveWarRoomAlertCategory;
  severity: ExecutiveWarRoomAlertSeverity;
  title: string;
  message: string;
  relatedObjectIds: readonly string[];
  acknowledged: boolean;
};

export type ExecutiveWarRoomRecommendationRecord = {
  id: string;
  title: string;
  reasoning: string;
  impactScore: number;
  confidence: number;
  urgency: number;
  rank: number;
  status: ExecutiveWarRoomRecommendationStatus;
  relatedScenarioId: string | null;
};

export type ExecutiveWarRoomDecisionRecord = {
  id: string;
  title: string;
  summary: string;
  priorityScore: number;
  impactSummary: string;
  relatedObjectIds: readonly string[];
  relatedScenarioId: string | null;
};

export type ExecutiveWarRoomSimulationRecord = {
  id: string;
  title: string;
  status: ExecutiveWarRoomSimulationStatus;
  riskLevel: "low" | "medium" | "high";
  affectedObjectCount: number;
  progressPercent: number | null;
};

export type ExecutiveWarRoomHotspot = {
  id: string;
  kind: "operational" | "risk" | "opportunity";
  objectId: string;
  label: string;
  magnitude: "minor" | "moderate" | "major" | "critical";
  score: number;
};

export type ExecutiveWarRoomKpiLayer = {
  operationalHealth: number;
  riskScore: number;
  resilienceScore: number;
  scenarioConfidence: number;
  strategicScore: number;
  operationalReadiness: number;
};

export type ExecutiveWarRoomCommandAction = {
  id: ExecutiveWarRoomCommandId;
  label: string;
  hint: string;
  enabled: boolean;
};

export type ExecutiveWarRoomHudModel = {
  mission: ExecutiveWarRoomMissionState;
  situation: ExecutiveWarRoomSituationBrief;
  strategic: ExecutiveWarRoomStrategicSummary;
  statusLevel: ExecutiveWarRoomStatusLevel;
  commands: readonly ExecutiveWarRoomCommandAction[];
  eventFeed: readonly ExecutiveWarRoomEventRecord[];
  kpis: ExecutiveWarRoomKpiLayer;
  bestScenarioTitle: string | null;
  tradeoffSummary: string | null;
  advisorInsight: string | null;
};

export type ExecutiveWarRoomCopilotContext = {
  focusMode: ExecutiveWarRoomFocusMode;
  situationHeadline: string;
  strategicHeadline: string;
  activeScenarioTitle: string | null;
  topRecommendation: string | null;
  criticalAlertCount: number;
  pendingDecisionCount: number;
};

export type BuildExecutiveWarRoomInput = {
  selectedObjectId?: string | null;
  selectedClusterId?: string | null;
  selectedTimelineEventId?: string | null;
  activeSimulation?: TypeCScenarioSimulation | null;
  activeScenarioTitle?: string | null;
  scenarioComparison?: TypeCScenarioComparison | null;
  scenarioUniverse?: ExecutiveScenarioUniverseState | null;
  playbackStatus?: ScenarioPlaybackStatus;
  playbackProgressPercent?: number | null;
  timelineEvents?: readonly TimelineEvent[];
  alerts?: readonly TypeCAlert[];
  decisionRecommendation?: TypeCDecisionRecommendation | null;
  executionState?: TypeCExecutionState | null;
  domainLabel?: string | null;
  pipelineRiskLabel?: string | null;
  pipelineConfidence?: number | null;
  cognitiveTwin?: ExecutiveCognitiveTwinState | null;
  executiveAdvisor?: ExecutiveAdvisorState | null;
};

export type ExecutiveWarRoomState = {
  signature: string;
  active: boolean;
  context: ExecutiveWarRoomOperationalContext;
  mission: ExecutiveWarRoomMissionState;
  situation: ExecutiveWarRoomSituationBrief;
  strategic: ExecutiveWarRoomStrategicSummary;
  statusLevel: ExecutiveWarRoomStatusLevel;
  events: readonly ExecutiveWarRoomEventRecord[];
  alerts: readonly ExecutiveWarRoomAlertRecord[];
  recommendations: readonly ExecutiveWarRoomRecommendationRecord[];
  decisions: readonly ExecutiveWarRoomDecisionRecord[];
  simulations: readonly ExecutiveWarRoomSimulationRecord[];
  hotspots: readonly ExecutiveWarRoomHotspot[];
  kpis: ExecutiveWarRoomKpiLayer;
  hud: ExecutiveWarRoomHudModel;
  copilot: ExecutiveWarRoomCopilotContext;
  bestScenarioId: string | null;
  bestScenarioTitle: string | null;
  tradeoffSummary: string | null;
};
