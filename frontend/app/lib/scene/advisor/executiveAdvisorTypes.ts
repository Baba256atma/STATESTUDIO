/**
 * E2:99 — Executive Advisor + Strategic Co-Reasoning contracts.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import type { ExecutiveScenarioUniverseState } from "../scenario/executiveMultiScenarioUniverseTypes";
import type { ExecutiveCognitiveTwinState } from "../twin/executiveCognitiveTwinTypes";
import type { ExecutiveWarRoomState } from "../warroom/executiveWarRoomTypes";
import type { TypeCAlert } from "../../typec/typeCAlerts";
import type { TypeCDecisionRecommendation } from "../../typec/typeCDecisionRecommendation";
import type { TypeCExecutionState } from "../../typec/typeCExecutionState";
import type { TypeCMemoryState } from "../../typec/typeCMemory";
import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";

export type ExecutiveAdvisorObservationKind =
  | "opportunity"
  | "risk"
  | "drift"
  | "misalignment"
  | "blind_spot"
  | "early_signal";

export type ExecutiveAdvisorRecommendationStatus =
  | "proposed"
  | "reviewed"
  | "accepted"
  | "rejected"
  | "implemented";

export type ExecutiveAdvisorQuestionKind = "strategic_challenge" | "blind_spot" | "assumption_check";

export type ExecutiveAdvisorObservation = {
  id: string;
  kind: ExecutiveAdvisorObservationKind;
  title: string;
  summary: string;
  urgency: number;
  confidence: number;
  relatedObjectIds: readonly string[];
  relatedScenarioId: string | null;
};

export type ExecutiveAdvisorQuestion = {
  id: string;
  kind: ExecutiveAdvisorQuestionKind;
  question: string;
  rationale: string;
  priority: number;
};

export type ExecutiveAdvisorRecommendation = {
  id: string;
  title: string;
  action: string;
  reasoning: string;
  impactScore: number;
  confidence: number;
  urgency: number;
  feasibility: number;
  rank: number;
  status: ExecutiveAdvisorRecommendationStatus;
  evidenceIds: readonly string[];
};

export type ExecutiveAdvisorEvidence = {
  id: string;
  label: string;
  detail: string;
  source: "twin" | "war_room" | "simulation" | "timeline" | "memory";
};

export type ExecutiveAdvisorReasoningStep = {
  stepId: string;
  label: string;
  conclusion: string;
  confidence: number;
  evidenceIds: readonly string[];
};

export type ExecutiveAdvisorReasoningChain = {
  chainId: string;
  topic: string;
  steps: readonly ExecutiveAdvisorReasoningStep[];
  overallConfidence: number;
};

export type ExecutiveAdvisorScenarioEvaluation = {
  scenarioId: string;
  title: string;
  rank: number;
  warningLevel: "none" | "watch" | "elevated" | "critical";
  summary: string;
  confidence: number;
};

export type ExecutiveAdvisorTradeOff = {
  id: string;
  title: string;
  gain: number;
  cost: number;
  risk: number;
  explanation: string;
  preferredOption: string | null;
};

export type ExecutiveAdvisorTimelineWarning = {
  id: string;
  title: string;
  summary: string;
  severity: "watch" | "warning" | "critical";
  stepIndex: number | null;
  relatedObjectIds: readonly string[];
};

export type ExecutiveAdvisorStrategicBrief = {
  headline: string;
  summary: string;
  proactiveInsight: string | null;
  missionGuidance: string;
};

export type ExecutiveAdvisorHudModel = {
  brief: ExecutiveAdvisorStrategicBrief;
  topObservation: ExecutiveAdvisorObservation | null;
  topQuestion: ExecutiveAdvisorQuestion | null;
  topRecommendation: ExecutiveAdvisorRecommendation | null;
  feed: readonly ExecutiveAdvisorObservation[];
  recommendations: readonly ExecutiveAdvisorRecommendation[];
  questions: readonly ExecutiveAdvisorQuestion[];
  scenarioWarnings: readonly ExecutiveAdvisorScenarioEvaluation[];
  transparencyHeadline: string;
  calibratedConfidence: number;
};

export type ExecutiveAdvisorCopilotContext = {
  dialogueContext: string;
  situationExplanation: string;
  consequenceExplanation: string;
  simulationInterpretation: string | null;
  twinInterpretation: string | null;
};

export type BuildExecutiveAdvisorInput = {
  cognitiveTwin?: ExecutiveCognitiveTwinState | null;
  warRoom?: ExecutiveWarRoomState | null;
  activeSimulation?: TypeCScenarioSimulation | null;
  activeScenarioTitle?: string | null;
  scenarioComparison?: TypeCScenarioComparison | null;
  scenarioUniverse?: ExecutiveScenarioUniverseState | null;
  timelineEvents?: readonly TimelineEvent[];
  alerts?: readonly TypeCAlert[];
  executionState?: TypeCExecutionState | null;
  decisionRecommendation?: TypeCDecisionRecommendation | null;
  memoryState?: TypeCMemoryState | null;
  selectedObjectId?: string | null;
  domainLabel?: string | null;
  pipelineConfidence?: number | null;
};

export type ExecutiveAdvisorState = {
  signature: string;
  active: boolean;
  observations: readonly ExecutiveAdvisorObservation[];
  questions: readonly ExecutiveAdvisorQuestion[];
  recommendations: readonly ExecutiveAdvisorRecommendation[];
  evidence: readonly ExecutiveAdvisorEvidence[];
  reasoningChains: readonly ExecutiveAdvisorReasoningChain[];
  scenarioEvaluations: readonly ExecutiveAdvisorScenarioEvaluation[];
  tradeOffs: readonly ExecutiveAdvisorTradeOff[];
  timelineWarnings: readonly ExecutiveAdvisorTimelineWarning[];
  forecasts: readonly { id: string; title: string; summary: string; horizon: "near" | "mid" | "long"; confidence: number }[];
  preferenceSignals: readonly string[];
  hud: ExecutiveAdvisorHudModel;
  copilot: ExecutiveAdvisorCopilotContext;
  explainability: {
    headline: string;
    evidenceCount: number;
    reasoningStepCount: number;
    confidenceCeiling: number;
  };
};
