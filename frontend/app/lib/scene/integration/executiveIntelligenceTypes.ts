/**
 * E2:100 — Executive Intelligence Completion Layer contracts.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import type { ExecutiveScenarioUniverseState } from "../scenario/executiveMultiScenarioUniverseTypes";
import type { ExecutiveScenarioPlaybackState } from "../scenario/executiveScenarioPlaybackTypes";
import type { ExecutiveTimelineHudModel } from "../executiveTimelineHudTypes";
import type { TypeCAlert } from "../../typec/typeCAlerts";
import type { TypeCDecisionRecommendation } from "../../typec/typeCDecisionRecommendation";
import type { TypeCExecutionState } from "../../typec/typeCExecutionState";
import type { TypeCMemoryState } from "../../typec/typeCMemory";
import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";

export type ExecutiveRuntimeModuleId =
  | "scene"
  | "camera"
  | "timeline"
  | "scenario_playback"
  | "scenario_universe"
  | "simulation"
  | "war_room"
  | "cognitive_twin"
  | "advisor";

export type ExecutiveRuntimeModuleHealth = "active" | "degraded" | "failed" | "idle";

export type ExecutiveRuntimeModuleEntry = {
  moduleId: ExecutiveRuntimeModuleId;
  owner: string;
  health: ExecutiveRuntimeModuleHealth;
  signature: string | null;
  dependencies: readonly ExecutiveRuntimeModuleId[];
};

export type ExecutiveValidationCategory =
  | "experience"
  | "mvp"
  | "command_center"
  | "timeline"
  | "camera"
  | "scene"
  | "performance"
  | "trust";

export type ExecutiveValidationResult = {
  validationId: string;
  category: ExecutiveValidationCategory;
  passed: boolean;
  summary: string;
  critical: boolean;
};

export type ExecutiveIntelligenceScorecard = {
  executiveReadinessScore: number;
  productMaturityScore: number;
  demoReadinessScore: number;
  productionCandidateScore: number;
};

export type ExecutiveAcceptanceGateId = "mvp" | "runtime" | "executive";

export type ExecutiveAcceptanceGate = {
  gateId: ExecutiveAcceptanceGateId;
  passed: boolean;
  blockers: readonly string[];
};

export type ExecutiveIntelligenceChecklistId = "pilot" | "demo" | "deployment";

export type ExecutiveIntelligenceChecklistItem = {
  id: string;
  label: string;
  complete: boolean;
};

export type ExecutiveIntelligenceChecklist = {
  checklistId: ExecutiveIntelligenceChecklistId;
  items: readonly ExecutiveIntelligenceChecklistItem[];
  completionPercent: number;
};

export type ExecutiveDemoWalkthroughStep = {
  step: number;
  title: string;
  narrative: string;
};

export type ExecutiveStrategicStoryPhase = {
  phase: "problem" | "analysis" | "simulation" | "decision" | "outcome";
  headline: string;
};

export type ExecutiveDemoFlow = {
  scenarioTitle: string;
  walkthroughSteps: readonly ExecutiveDemoWalkthroughStep[];
  strategicStory: readonly ExecutiveStrategicStoryPhase[];
};

export type ExecutiveLoopScanResult = {
  reactLoopRisk: boolean;
  idleLoopRisk: boolean;
  heartbeatAuditClean: boolean;
  notes: readonly string[];
};

export type ExecutiveIntelligenceHudModel = {
  headline: string;
  firstImpressionSummary: string;
  orientationSummary: string;
  readinessScore: number;
  acceptancePassed: boolean;
  mvpReady: boolean;
  activeModules: number;
  degradedModules: number;
  failedModules: number;
  topValidationGap: string | null;
  demoStepTitle: string | null;
};

export type BuildExecutiveIntelligenceRefreshInput = {
  sceneJson: unknown;
  selectedObjectId?: string | null;
  domainLabel?: string | null;
  domainId?: string | null;
  executiveTimelineHud?: ExecutiveTimelineHudModel | null;
  activeSimulation?: TypeCScenarioSimulation | null;
  activeScenarioTitle?: string | null;
  scenarioComparison?: TypeCScenarioComparison | null;
  scenarioUniverse?: ExecutiveScenarioUniverseState | null;
  playbackState?: ExecutiveScenarioPlaybackState | null;
  alerts?: readonly TypeCAlert[];
  executionState?: TypeCExecutionState | null;
  decisionRecommendation?: TypeCDecisionRecommendation | null;
  memoryState?: TypeCMemoryState | null;
  pipelineConfidence?: number | null;
  pipelineRiskLabel?: string | null;
  sceneObjectCount?: number | null;
  cameraPreset?: string | null;
};

export type ExecutiveIntelligenceState = {
  signature: string;
  active: boolean;
  registry: readonly ExecutiveRuntimeModuleEntry[];
  validations: readonly ExecutiveValidationResult[];
  scorecard: ExecutiveIntelligenceScorecard;
  acceptanceGates: readonly ExecutiveAcceptanceGate[];
  checklists: readonly ExecutiveIntelligenceChecklist[];
  demoFlow: ExecutiveDemoFlow;
  loopScan: ExecutiveLoopScanResult;
  hud: ExecutiveIntelligenceHudModel;
  mvpReady: boolean;
};
