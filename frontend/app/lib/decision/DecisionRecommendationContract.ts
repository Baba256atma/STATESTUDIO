/**
 * D:1 — Canonical Decision Recommendation contract.
 *
 * Immutable, read-only contracts for executive decision options, scoring,
 * explanations, and recommendations. Supports single, multiple, and ranked
 * recommendation bundles. No workflow execution, UI rendering, routing,
 * scene, topology, DS, or mutation authority.
 */

export const DECISION_CONTRACT_DIAGNOSTIC = "[DECISION_CONTRACT]" as const;

export const DECISION_CONTRACT_READY_DIAGNOSTIC = "[DECISION_CONTRACT_READY]" as const;

export const D1_CONTRACT_COMPLETE_TAG = "[D1_CONTRACT_COMPLETE]" as const;

export const DECISION_RECOMMENDATION_CONTRACT_VERSION = "1.0.0" as const;

export type DecisionRecommendationMode = "single" | "multiple" | "ranked";

export type DecisionRecommendationPriority = "low" | "medium" | "high" | "critical";

export type DecisionScoreDimension = Readonly<{
  dimensionId: string;
  label: string;
  value: number;
  weight: number;
  readOnly: true;
  mutation: false;
}>;

export type DecisionOption = Readonly<{
  optionId: string;
  label: string;
  summary: string;
  category?: string;
  readOnly: true;
  mutation: false;
}>;

export type DecisionScore = Readonly<{
  scoreId: string;
  optionId: string;
  value: number;
  confidence: number;
  dimensions: readonly DecisionScoreDimension[];
  readOnly: true;
  mutation: false;
}>;

export type DecisionExplanation = Readonly<{
  explanationId: string;
  optionId: string;
  rationale: string;
  evidenceIds: readonly string[];
  tradeoffSummary?: string;
  readOnly: true;
  mutation: false;
}>;

export type DecisionRecommendation = Readonly<{
  recommendationId: string;
  option: DecisionOption;
  score: DecisionScore;
  explanation: DecisionExplanation;
  rank: number | null;
  priority: DecisionRecommendationPriority;
  readOnly: true;
  mutation: false;
}>;

export type DecisionRecommendationBundle = Readonly<{
  version: typeof DECISION_RECOMMENDATION_CONTRACT_VERSION;
  bundleId: string;
  generatedAt: string;
  mode: DecisionRecommendationMode;
  recommendations: readonly DecisionRecommendation[];
  primaryRecommendation: DecisionRecommendation | null;
  topRankedRecommendation: DecisionRecommendation | null;
  recommendationCount: number;
  supportsSingleRecommendation: true;
  supportsMultipleRecommendations: true;
  supportsRankedRecommendations: true;
  readOnly: true;
  mutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  diagnostics: readonly [
    typeof DECISION_CONTRACT_DIAGNOSTIC,
    typeof DECISION_CONTRACT_READY_DIAGNOSTIC,
  ];
}>;

export type DecisionRecommendationContract = Readonly<{
  version: typeof DECISION_RECOMMENDATION_CONTRACT_VERSION;
  optionContract: "DecisionOption";
  scoreContract: "DecisionScore";
  explanationContract: "DecisionExplanation";
  recommendationContract: "DecisionRecommendation";
  bundleContract: "DecisionRecommendationBundle";
  supportsSingleRecommendation: true;
  supportsMultipleRecommendations: true;
  supportsRankedRecommendations: true;
  readOnly: true;
  mutation: false;
  diagnostics: readonly [
    typeof DECISION_CONTRACT_DIAGNOSTIC,
    typeof DECISION_CONTRACT_READY_DIAGNOSTIC,
  ];
}>;

export const DECISION_RECOMMENDATION_DIAGNOSTICS = Object.freeze([
  DECISION_CONTRACT_DIAGNOSTIC,
  DECISION_CONTRACT_READY_DIAGNOSTIC,
] as const);

export const DECISION_RECOMMENDATION_CONTRACT: DecisionRecommendationContract = Object.freeze({
  version: DECISION_RECOMMENDATION_CONTRACT_VERSION,
  optionContract: "DecisionOption",
  scoreContract: "DecisionScore",
  explanationContract: "DecisionExplanation",
  recommendationContract: "DecisionRecommendation",
  bundleContract: "DecisionRecommendationBundle",
  supportsSingleRecommendation: true,
  supportsMultipleRecommendations: true,
  supportsRankedRecommendations: true,
  readOnly: true,
  mutation: false,
  diagnostics: DECISION_RECOMMENDATION_DIAGNOSTICS,
});

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function priorityWeight(priority: DecisionRecommendationPriority): number {
  if (priority === "critical") return 4;
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

export function buildDecisionOption(
  input: Omit<DecisionOption, "readOnly" | "mutation">
): DecisionOption {
  return Object.freeze({
    ...input,
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionScoreDimension(
  input: Omit<DecisionScoreDimension, "readOnly" | "mutation">
): DecisionScoreDimension {
  return Object.freeze({
    ...input,
    value: clampScore(input.value),
    weight: clampScore(input.weight),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionScore(
  input: Omit<DecisionScore, "dimensions" | "readOnly" | "mutation"> & {
    dimensions?: readonly DecisionScoreDimension[];
  }
): DecisionScore {
  return Object.freeze({
    ...input,
    value: clampScore(input.value),
    confidence: clampScore(input.confidence),
    dimensions: Object.freeze(
      (input.dimensions ?? []).map((dimension) => buildDecisionScoreDimension(dimension))
    ),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionExplanation(
  input: Omit<DecisionExplanation, "evidenceIds" | "readOnly" | "mutation"> & {
    evidenceIds: readonly string[];
  }
): DecisionExplanation {
  return Object.freeze({
    ...input,
    evidenceIds: Object.freeze([...input.evidenceIds]),
    readOnly: true as const,
    mutation: false as const,
  });
}

export function buildDecisionRecommendation(
  input: Omit<DecisionRecommendation, "option" | "score" | "explanation" | "readOnly" | "mutation"> & {
    option: Omit<DecisionOption, "readOnly" | "mutation">;
    score: Omit<DecisionScore, "dimensions" | "readOnly" | "mutation"> & {
      dimensions?: readonly DecisionScoreDimension[];
    };
    explanation: Omit<DecisionExplanation, "evidenceIds" | "readOnly" | "mutation"> & {
      evidenceIds: readonly string[];
    };
  }
): DecisionRecommendation {
  return Object.freeze({
    recommendationId: input.recommendationId,
    option: buildDecisionOption(input.option),
    score: buildDecisionScore(input.score),
    explanation: buildDecisionExplanation(input.explanation),
    rank: input.rank,
    priority: input.priority,
    readOnly: true as const,
    mutation: false as const,
  });
}

function compareRecommendations(a: DecisionRecommendation, b: DecisionRecommendation): number {
  return (
    b.score.value - a.score.value ||
    b.score.confidence - a.score.confidence ||
    priorityWeight(b.priority) - priorityWeight(a.priority) ||
    a.recommendationId.localeCompare(b.recommendationId)
  );
}

function withRank(
  recommendation: DecisionRecommendation,
  rank: number
): DecisionRecommendation {
  return Object.freeze({
    ...recommendation,
    rank,
  });
}

export function buildDecisionRecommendationBundle(input: {
  bundleId: string;
  generatedAt: string;
  mode: DecisionRecommendationMode;
  recommendations: readonly DecisionRecommendation[];
}): DecisionRecommendationBundle {
  const normalized = Object.freeze(
    input.recommendations.map((recommendation) => buildDecisionRecommendation(recommendation))
  );

  let recommendations: readonly DecisionRecommendation[] = normalized;
  let primaryRecommendation: DecisionRecommendation | null = null;
  let topRankedRecommendation: DecisionRecommendation | null = null;

  if (input.mode === "single") {
    primaryRecommendation = normalized[0] ?? null;
    recommendations = primaryRecommendation ? Object.freeze([primaryRecommendation]) : Object.freeze([]);
  } else if (input.mode === "ranked") {
    const ranked = Object.freeze(
      [...normalized]
        .sort(compareRecommendations)
        .map((recommendation, index) => withRank(recommendation, index + 1))
    );
    recommendations = ranked;
    topRankedRecommendation = ranked[0] ?? null;
    primaryRecommendation = topRankedRecommendation;
  } else {
    recommendations = normalized;
    primaryRecommendation = normalized[0] ?? null;
  }

  return Object.freeze({
    version: DECISION_RECOMMENDATION_CONTRACT_VERSION,
    bundleId: input.bundleId,
    generatedAt: input.generatedAt,
    mode: input.mode,
    recommendations,
    primaryRecommendation,
    topRankedRecommendation,
    recommendationCount: recommendations.length,
    supportsSingleRecommendation: true as const,
    supportsMultipleRecommendations: true as const,
    supportsRankedRecommendations: true as const,
    readOnly: true as const,
    mutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    dsMutation: false as const,
    diagnostics: DECISION_RECOMMENDATION_DIAGNOSTICS,
  });
}

export const EMPTY_DECISION_RECOMMENDATION_BUNDLE: DecisionRecommendationBundle =
  buildDecisionRecommendationBundle({
    bundleId: "",
    generatedAt: "",
    mode: "single",
    recommendations: Object.freeze([]),
  });
