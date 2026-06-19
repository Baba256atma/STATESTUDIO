/**
 * D:2:3 — Uncertainty Detection Engine contract.
 *
 * Read-only contracts for detecting uncertainty and weak decision areas behind
 * D:1 recommendations. Identifies missing data, conflicting signals, low
 * simulation confidence, weak KPI/risk evidence, and scenario disagreement
 * without mutating source intelligence.
 */

import type { DecisionRecommendation } from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";

export const UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC = "[UNCERTAINTY_DETECTION_ENGINE]" as const;

export const UNCERTAINTY_DETECTION_READY_DIAGNOSTIC = "[UNCERTAINTY_DETECTION_READY]" as const;

export const D2_UNCERTAINTY_COMPLETE_TAG = "[D2_UNCERTAINTY_COMPLETE]" as const;

export const UNCERTAINTY_DETECTION_ENGINE_VERSION = "1.0.0" as const;

export type UncertaintyDetectionCategoryId =
  | "missingData"
  | "conflictingSignals"
  | "lowSimulationConfidence"
  | "weakKpiEvidence"
  | "weakRiskEvidence"
  | "scenarioDisagreement";

export const UNCERTAINTY_DETECTION_CATEGORY_LABELS = Object.freeze({
  missingData: "Missing Data",
  conflictingSignals: "Conflicting Signals",
  lowSimulationConfidence: "Low Simulation Confidence",
  weakKpiEvidence: "Weak KPI Evidence",
  weakRiskEvidence: "Weak Risk Evidence",
  scenarioDisagreement: "Scenario Disagreement",
} as const satisfies Record<UncertaintyDetectionCategoryId, string>);

export type UncertaintyFinding = Readonly<{
  findingId: string;
  categoryId: UncertaintyDetectionCategoryId;
  label: string;
  severity: number;
  detail: string;
  readOnly: true;
  mutation: false;
}>;

export type UncertaintyProfile = Readonly<{
  version: typeof UNCERTAINTY_DETECTION_ENGINE_VERSION;
  profileId: string;
  evaluatedAt: string;
  recommendationId: string | null;
  findings: readonly UncertaintyFinding[];
  findingCount: number;
  aggregateUncertainty: number;
  evidenceGapCount: number;
  weakAreaCount: number;
  detectedCategories: readonly UncertaintyDetectionCategoryId[];
  supportsMissingDataDetection: true;
  supportsConflictingSignalsDetection: true;
  supportsLowSimulationConfidenceDetection: true;
  supportsWeakKpiEvidenceDetection: true;
  supportsWeakRiskEvidenceDetection: true;
  supportsScenarioDisagreementDetection: true;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC,
    typeof UNCERTAINTY_DETECTION_READY_DIAGNOSTIC,
  ];
}>;

export type UncertaintyDetectionInput = Readonly<{
  evaluatedAt: string;
  inputProfile: DecisionInputProfile;
  recommendation?: DecisionRecommendation | null;
}>;

export type UncertaintyDetectionResult = Readonly<{
  version: typeof UNCERTAINTY_DETECTION_ENGINE_VERSION;
  evaluatedAt: string;
  profileId: string;
  recommendationId: string | null;
  profile: UncertaintyProfile;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC,
    typeof UNCERTAINTY_DETECTION_READY_DIAGNOSTIC,
  ];
}>;

export const UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS = Object.freeze([
  UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTIC,
  UNCERTAINTY_DETECTION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_UNCERTAINTY_PROFILE: UncertaintyProfile = Object.freeze({
  version: UNCERTAINTY_DETECTION_ENGINE_VERSION,
  profileId: "",
  evaluatedAt: "",
  recommendationId: null,
  findings: Object.freeze([]),
  findingCount: 0,
  aggregateUncertainty: 0,
  evidenceGapCount: 0,
  weakAreaCount: 0,
  detectedCategories: Object.freeze([]),
  supportsMissingDataDetection: true,
  supportsConflictingSignalsDetection: true,
  supportsLowSimulationConfidenceDetection: true,
  supportsWeakKpiEvidenceDetection: true,
  supportsWeakRiskEvidenceDetection: true,
  supportsScenarioDisagreementDetection: true,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
});

export const EMPTY_UNCERTAINTY_DETECTION_RESULT: UncertaintyDetectionResult = Object.freeze({
  version: UNCERTAINTY_DETECTION_ENGINE_VERSION,
  evaluatedAt: "",
  profileId: "",
  recommendationId: null,
  profile: EMPTY_UNCERTAINTY_PROFILE,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: UNCERTAINTY_DETECTION_ENGINE_DIAGNOSTICS,
});
