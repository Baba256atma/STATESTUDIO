/**
 * D:1 — Option Scoring Engine contract.
 *
 * Read-only scoring contracts for decision alternatives. Scores impact, risk,
 * KPI effect, scenario outcome, and war room pressure into normalized
 * DecisionScore outputs without mutating source intelligence.
 */

import type { DecisionOption, DecisionScore } from "./DecisionRecommendationContract.ts";
import type { DecisionInputProfile } from "./decisionInputAggregatorContract.ts";

export const OPTION_SCORING_ENGINE_DIAGNOSTIC = "[OPTION_SCORING_ENGINE]" as const;

export const OPTION_SCORING_READY_DIAGNOSTIC = "[OPTION_SCORING_READY]" as const;

export const D1_OPTION_SCORING_COMPLETE_TAG = "[D1_OPTION_SCORING_COMPLETE]" as const;

export const OPTION_SCORING_ENGINE_VERSION = "1.0.0" as const;

export type OptionScoringDimensionId =
  | "impact"
  | "risk"
  | "kpiEffect"
  | "scenarioOutcome"
  | "warRoomPressure";

export const OPTION_SCORING_DIMENSION_WEIGHTS = Object.freeze({
  impact: 25,
  risk: 25,
  kpiEffect: 20,
  scenarioOutcome: 20,
  warRoomPressure: 10,
} as const satisfies Record<OptionScoringDimensionId, number>);

export type OptionScoringInput = Readonly<{
  evaluatedAt: string;
  options: readonly DecisionOption[];
  inputProfile: DecisionInputProfile;
}>;

export type OptionScoringResult = Readonly<{
  version: typeof OPTION_SCORING_ENGINE_VERSION;
  evaluatedAt: string;
  profileId: string;
  scores: readonly DecisionScore[];
  scoreCount: number;
  normalizedScoring: true;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof OPTION_SCORING_ENGINE_DIAGNOSTIC,
    typeof OPTION_SCORING_READY_DIAGNOSTIC,
  ];
}>;

export const OPTION_SCORING_ENGINE_DIAGNOSTICS = Object.freeze([
  OPTION_SCORING_ENGINE_DIAGNOSTIC,
  OPTION_SCORING_READY_DIAGNOSTIC,
] as const);

export const EMPTY_OPTION_SCORING_RESULT: OptionScoringResult = Object.freeze({
  version: OPTION_SCORING_ENGINE_VERSION,
  evaluatedAt: "",
  profileId: "",
  scores: Object.freeze([]),
  scoreCount: 0,
  normalizedScoring: true,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: OPTION_SCORING_ENGINE_DIAGNOSTICS,
});
