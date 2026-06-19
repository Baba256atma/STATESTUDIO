/**
 * D:1 — Decision Dashboard and Assistant binding contract.
 *
 * Read-only bindings that expose executive recommendations to Dashboard and
 * Assistant surfaces without execution authority, routing changes, or mutations.
 */

import type { DecisionExplanationResult } from "./decisionExplanationBuilderContract.ts";
import type { ExecutiveRecommendation } from "./recommendationEngineContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";

export const DASHBOARD_DECISION_BINDING_DIAGNOSTIC = "[DASHBOARD_DECISION_BINDING]" as const;

export const ASSISTANT_DECISION_BINDING_DIAGNOSTIC = "[ASSISTANT_DECISION_BINDING]" as const;

export const D1_BINDING_COMPLETE_TAG = "[D1_BINDING_COMPLETE]" as const;

export const DECISION_BINDING_VERSION = "1.0.0" as const;

export type DashboardDecisionBindingStatus = "bound" | "missing_recommendation";

export type DashboardDecisionRecommendedOptionView = Readonly<{
  optionId: string;
  label: string;
  summary: string;
  compositeScore: number;
  decisionScore: number;
  confidence: number;
  readOnly: true;
  mutation: false;
  executesActions: false;
}>;

export type DashboardDecisionAlternativeOptionView = Readonly<{
  optionId: string;
  label: string;
  summary: string;
  rank: number;
  compositeScore: number;
  readOnly: true;
  mutation: false;
  executesActions: false;
}>;

export type DashboardDecisionScoreView = Readonly<{
  scoreId: string;
  optionId: string;
  value: number;
  confidence: number;
  dimensions: readonly Readonly<{
    dimensionId: string;
    label: string;
    value: number;
  }>[];
  readOnly: true;
  mutation: false;
}>;

export type DashboardDecisionTradeoffView = Readonly<{
  dimensionId: string;
  label: string;
  summary: string;
  favoredOptionId: string | "neutral";
  readOnly: true;
  mutation: false;
}>;

export type DashboardDecisionRankingView = Readonly<{
  optionId: string;
  label: string;
  rank: number;
  compositeScore: number;
  readOnly: true;
  mutation: false;
}>;

export type DashboardDecisionBindingView = Readonly<{
  recommendationId: string;
  recommendedOption: DashboardDecisionRecommendedOptionView | null;
  alternativeOptions: readonly DashboardDecisionAlternativeOptionView[];
  scores: readonly DashboardDecisionScoreView[];
  tradeoffs: readonly DashboardDecisionTradeoffView[];
  ranking: readonly DashboardDecisionRankingView[];
  bindingStatus: DashboardDecisionBindingStatus;
  bindingReady: true;
  readOnly: true;
  executesRecommendations: false;
  mutation: false;
}>;

export type DashboardDecisionBindingResult = Readonly<{
  version: typeof DECISION_BINDING_VERSION;
  boundAt: string;
  view: DashboardDecisionBindingView | null;
  bindingStatus: DashboardDecisionBindingStatus;
  readOnly: true;
  executesRecommendations: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [typeof DASHBOARD_DECISION_BINDING_DIAGNOSTIC];
}>;

export type AssistantDecisionExplanationKind = "recommendation" | "tradeoff" | "reasoning";

export type AssistantDecisionExplanationView = Readonly<{
  explanationId: string;
  kind: AssistantDecisionExplanationKind;
  subjectId: string;
  title: string;
  explanation: string;
  readOnly: true;
  mutation: false;
}>;

export type AssistantDecisionBindingView = Readonly<{
  recommendationId: string;
  recommendationExplanation: AssistantDecisionExplanationView;
  tradeoffExplanations: readonly AssistantDecisionExplanationView[];
  reasoningExplanation: AssistantDecisionExplanationView;
  explanationCount: number;
  bindingReady: true;
  readOnly: true;
  actionExecution: false;
  mutation: false;
}>;

export type AssistantDecisionBindingResult = Readonly<{
  version: typeof DECISION_BINDING_VERSION;
  boundAt: string;
  view: AssistantDecisionBindingView | null;
  readOnly: true;
  actionExecution: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [typeof ASSISTANT_DECISION_BINDING_DIAGNOSTIC];
}>;

export type DecisionBindingBuildInput = Readonly<{
  boundAt: string;
  recommendation: ExecutiveRecommendation;
  tradeoffProfile: TradeoffProfile;
  explanation: DecisionExplanationResult;
}>;

export const DASHBOARD_DECISION_BINDING_DIAGNOSTICS = Object.freeze([
  DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
] as const);

export const ASSISTANT_DECISION_BINDING_DIAGNOSTICS = Object.freeze([
  ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
] as const);

export const DECISION_BINDING_DIAGNOSTICS = Object.freeze([
  DASHBOARD_DECISION_BINDING_DIAGNOSTIC,
  ASSISTANT_DECISION_BINDING_DIAGNOSTIC,
] as const);

export const EMPTY_DASHBOARD_DECISION_BINDING_RESULT: DashboardDecisionBindingResult = Object.freeze({
  version: DECISION_BINDING_VERSION,
  boundAt: "",
  view: null,
  bindingStatus: "missing_recommendation",
  readOnly: true,
  executesRecommendations: false,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: DASHBOARD_DECISION_BINDING_DIAGNOSTICS,
});

export const EMPTY_ASSISTANT_DECISION_BINDING_RESULT: AssistantDecisionBindingResult = Object.freeze({
  version: DECISION_BINDING_VERSION,
  boundAt: "",
  view: null,
  readOnly: true,
  actionExecution: false,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: ASSISTANT_DECISION_BINDING_DIAGNOSTICS,
});
