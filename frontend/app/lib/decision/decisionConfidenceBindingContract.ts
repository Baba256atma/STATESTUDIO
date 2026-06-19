/**
 * D:2:6 — Decision Confidence Dashboard and Assistant binding contract.
 *
 * Read-only bindings that expose recommendation confidence to Dashboard and
 * Assistant surfaces without execution authority, routing changes, or mutations.
 */

import type { DecisionConfidenceLevel } from "./DecisionConfidenceContract.ts";
import type { ConfidenceExplanationResult } from "./confidenceExplanationBuilderContract.ts";
import type { EvidenceStrengthProfile } from "./recommendationConfidenceScoringEngineContract.ts";
import type { RecommendationConfidenceScore } from "./recommendationConfidenceScoringEngineContract.ts";
import type { UncertaintyProfile } from "./uncertaintyDetectionEngineContract.ts";

export const DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC =
  "[DASHBOARD_CONFIDENCE_BINDING]" as const;

export const ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC =
  "[ASSISTANT_CONFIDENCE_BINDING]" as const;

export const D2_CONFIDENCE_BINDING_COMPLETE_TAG =
  "[D2_CONFIDENCE_BINDING_COMPLETE]" as const;

export const DECISION_CONFIDENCE_BINDING_VERSION = "1.0.0" as const;

export type DashboardConfidenceBindingStatus = "bound" | "missing_confidence";

export type DashboardUncertaintyWarningView = Readonly<{
  warningId: string;
  label: string;
  severity: number;
  detail: string;
  readOnly: true;
  mutation: false;
}>;

export type DashboardConfidenceBindingView = Readonly<{
  recommendationId: string;
  optionId: string;
  optionLabel: string;
  confidenceScore: number;
  confidenceLevel: DecisionConfidenceLevel;
  confidenceLabel: string;
  evidenceStrength: number;
  evidenceCount: number;
  uncertaintyWarnings: readonly DashboardUncertaintyWarningView[];
  uncertaintyWarningCount: number;
  bindingStatus: DashboardConfidenceBindingStatus;
  bindingReady: true;
  readOnly: true;
  executesDecisions: false;
  mutation: false;
}>;

export type DashboardConfidenceBindingResult = Readonly<{
  version: typeof DECISION_CONFIDENCE_BINDING_VERSION;
  boundAt: string;
  view: DashboardConfidenceBindingView | null;
  bindingStatus: DashboardConfidenceBindingStatus;
  readOnly: true;
  executesDecisions: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [typeof DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC];
}>;

export type AssistantConfidenceExplanationKind =
  | "confidence_level"
  | "supporting_evidence"
  | "remaining_uncertainty";

export type AssistantConfidenceExplanationView = Readonly<{
  explanationId: string;
  kind: AssistantConfidenceExplanationKind;
  subjectId: string;
  title: string;
  explanation: string;
  readOnly: true;
  mutation: false;
}>;

export type AssistantConfidenceBindingView = Readonly<{
  recommendationId: string;
  confidenceLevelExplanation: AssistantConfidenceExplanationView;
  supportingEvidenceExplanations: readonly AssistantConfidenceExplanationView[];
  remainingUncertaintyExplanation: AssistantConfidenceExplanationView;
  explanationCount: number;
  bindingReady: true;
  readOnly: true;
  actionExecution: false;
  mutation: false;
}>;

export type AssistantConfidenceBindingResult = Readonly<{
  version: typeof DECISION_CONFIDENCE_BINDING_VERSION;
  boundAt: string;
  view: AssistantConfidenceBindingView | null;
  readOnly: true;
  actionExecution: false;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [typeof ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC];
}>;

export type DecisionConfidenceBindingBuildInput = Readonly<{
  boundAt: string;
  recommendationId: string;
  optionId: string;
  optionLabel: string;
  confidenceScore: RecommendationConfidenceScore;
  evidenceStrength: EvidenceStrengthProfile;
  uncertainty: UncertaintyProfile;
  explanation: ConfidenceExplanationResult;
}>;

export const DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTICS = Object.freeze([
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
] as const);

export const ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTICS = Object.freeze([
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
] as const);

export const DECISION_CONFIDENCE_BINDING_DIAGNOSTICS = Object.freeze([
  DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTIC,
  ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTIC,
] as const);

export const EMPTY_DASHBOARD_CONFIDENCE_BINDING_RESULT: DashboardConfidenceBindingResult =
  Object.freeze({
    version: DECISION_CONFIDENCE_BINDING_VERSION,
    boundAt: "",
    view: null,
    bindingStatus: "missing_confidence",
    readOnly: true,
    executesDecisions: false,
    mutation: false,
    sourceMutation: false,
    sceneMutation: false,
    topologyMutation: false,
    routingMutation: false,
    dsMutation: false,
    simulationMutation: false,
    diagnostics: DASHBOARD_CONFIDENCE_BINDING_DIAGNOSTICS,
  });

export const EMPTY_ASSISTANT_CONFIDENCE_BINDING_RESULT: AssistantConfidenceBindingResult =
  Object.freeze({
    version: DECISION_CONFIDENCE_BINDING_VERSION,
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
    diagnostics: ASSISTANT_CONFIDENCE_BINDING_DIAGNOSTICS,
  });
