/**
 * D:2:2 — Evidence Strength Engine contract.
 *
 * Read-only contracts for measuring evidence strength behind D:1 recommendations.
 * Evaluates data completeness, signal consistency, simulation coverage, compare
 * coverage, and war room signal strength without mutating source intelligence.
 */

import type { DecisionExplanation, DecisionRecommendation } from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";

export const EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC = "[EVIDENCE_STRENGTH_ENGINE]" as const;

export const EVIDENCE_STRENGTH_READY_DIAGNOSTIC = "[EVIDENCE_STRENGTH_READY]" as const;

export const D2_EVIDENCE_STRENGTH_COMPLETE_TAG = "[D2_EVIDENCE_STRENGTH_COMPLETE]" as const;

export const EVIDENCE_STRENGTH_ENGINE_VERSION = "1.0.0" as const;

export type EvidenceStrengthDimensionId =
  | "dataCompleteness"
  | "signalConsistency"
  | "simulationCoverage"
  | "compareCoverage"
  | "warRoomSignalStrength";

export const EVIDENCE_STRENGTH_DIMENSION_WEIGHTS = Object.freeze({
  dataCompleteness: 25,
  signalConsistency: 20,
  simulationCoverage: 20,
  compareCoverage: 15,
  warRoomSignalStrength: 20,
} as const satisfies Record<EvidenceStrengthDimensionId, number>);

export type EvidenceStrengthDimension = Readonly<{
  dimensionId: EvidenceStrengthDimensionId;
  label: string;
  value: number;
  weight: number;
  readOnly: true;
  mutation: false;
}>;

export type EvidenceStrengthScore = Readonly<{
  scoreId: string;
  recommendationId: string;
  optionId: string;
  value: number;
  evidenceCount: number;
  dimensions: readonly EvidenceStrengthDimension[];
  readOnly: true;
  mutation: false;
}>;

export type EvidenceStrengthInput = Readonly<{
  evaluatedAt: string;
  inputProfile: DecisionInputProfile;
  recommendation: DecisionRecommendation;
  explanation: DecisionExplanation;
}>;

export type EvidenceStrengthResult = Readonly<{
  version: typeof EVIDENCE_STRENGTH_ENGINE_VERSION;
  evaluatedAt: string;
  profileId: string;
  recommendationId: string;
  score: EvidenceStrengthScore;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC,
    typeof EVIDENCE_STRENGTH_READY_DIAGNOSTIC,
  ];
}>;

export const EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS = Object.freeze([
  EVIDENCE_STRENGTH_ENGINE_DIAGNOSTIC,
  EVIDENCE_STRENGTH_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EVIDENCE_STRENGTH_RESULT: EvidenceStrengthResult = Object.freeze({
  version: EVIDENCE_STRENGTH_ENGINE_VERSION,
  evaluatedAt: "",
  profileId: "",
  recommendationId: "",
  score: Object.freeze({
    scoreId: "",
    recommendationId: "",
    optionId: "",
    value: 0,
    evidenceCount: 0,
    dimensions: Object.freeze([]),
    readOnly: true,
    mutation: false,
  }),
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: EVIDENCE_STRENGTH_ENGINE_DIAGNOSTICS,
});
