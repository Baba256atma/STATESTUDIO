/**
 * APP-10:3 — Similarity Engine domain types.
 */

import type { PatternCategory } from "./patternExtractionEngineTypes.ts";
import type {
  KPI_DIRECTION_KEYS,
  RISK_PROFILE_KEYS,
  SIMILARITY_DIMENSION_IDS,
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";

export type SimilarityResultId = string;
export type SimilarityWorkspaceId = string;
export type ScenarioId = string;
export type PatternId = string;

export type KpiDirection = (typeof KPI_DIRECTION_KEYS)[number];
export type RiskProfile = (typeof RISK_PROFILE_KEYS)[number];
export type SimilarityDimensionId = (typeof SIMILARITY_DIMENSION_IDS)[number];
export type SimilarityComparisonType = "scenario_to_scenario" | "scenario_to_pattern";
export type SimilarityScoringMethod = typeof SIMILARITY_SCORING_METHOD;

export type ScenarioSimilarityProfile = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: SimilarityWorkspaceId;
  businessGoal: string;
  strategyChain: readonly string[];
  objectTypes: readonly string[];
  kpiDirection: KpiDirection;
  riskProfile: RiskProfile;
  decisionType: string;
  timelinePhase: string;
  outcomeType: string;
  patternCategory: PatternCategory;
  workspaceDomain: string;
  readOnly: true;
}>;

export type ScenarioSimilarityInput = Readonly<{
  query: ScenarioSimilarityProfile;
  historicalScenarios: readonly ScenarioSimilarityProfile[];
  patterns?: readonly import("./patternExtractionEngineTypes.ts").ExecutivePattern[];
  comparedAt?: string;
  minScore?: number;
}>;

export type SimilarityDimension = Readonly<{
  dimensionId: SimilarityDimensionId;
  label: string;
  matched: boolean;
  weight: number;
  weightedContribution: number;
  queryValue: string;
  matchedValue: string;
  readOnly: true;
}>;

export type SimilarityEvidence = Readonly<{
  evidenceId: string;
  sourceType: "scenario" | "pattern" | "dimension";
  referenceId: string;
  description: string;
  readOnly: true;
}>;

export type SimilarityExplanation = Readonly<{
  summary: string;
  matchedDimensions: readonly SimilarityDimensionId[];
  unmatchedDimensions: readonly SimilarityDimensionId[];
  contributingScenarioIds: readonly ScenarioId[];
  contributingPatternIds: readonly PatternId[];
  finalScore: number;
  scoringMethod: SimilarityScoringMethod;
  readOnly: true;
}>;

export type ScenarioSimilarityResult = Readonly<{
  similarityResultId: SimilarityResultId;
  queryScenarioId: ScenarioId;
  matchedScenarioId: ScenarioId;
  workspaceId: SimilarityWorkspaceId;
  comparisonType: "scenario_to_scenario";
  score: number;
  dimensions: readonly SimilarityDimension[];
  evidence: readonly SimilarityEvidence[];
  explanation: SimilarityExplanation;
  comparedAt: string;
  version: typeof SIMILARITY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type PatternSimilarityResult = Readonly<{
  similarityResultId: SimilarityResultId;
  queryScenarioId: ScenarioId;
  matchedPatternId: PatternId;
  workspaceId: SimilarityWorkspaceId;
  comparisonType: "scenario_to_pattern";
  score: number;
  dimensions: readonly SimilarityDimension[];
  evidence: readonly SimilarityEvidence[];
  explanation: SimilarityExplanation;
  comparedAt: string;
  version: typeof SIMILARITY_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type SimilarityResult = ScenarioSimilarityResult | PatternSimilarityResult;

export type SimilarityRegistrySnapshot = Readonly<{
  registryVersion: typeof SIMILARITY_ENGINE_CONTRACT_VERSION;
  resultCount: number;
  resultIds: readonly SimilarityResultId[];
  readOnly: true;
}>;

export type SimilarityValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SimilarityValidationResult = Readonly<{
  valid: boolean;
  issues: readonly SimilarityValidationIssue[];
  readOnly: true;
}>;

export type SimilarityEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: SimilarityValidationIssue | null;
  readOnly: true;
}>;

export type ScenarioSimilarityComparisonResult = Readonly<{
  success: boolean;
  reason: string;
  queryScenarioId: ScenarioId;
  workspaceId: SimilarityWorkspaceId;
  scenarioResults: readonly ScenarioSimilarityResult[];
  patternResults: readonly PatternSimilarityResult[];
  comparedAt: string;
  readOnly: true;
}>;

export type SimilarityEngineState = Readonly<{
  engineId: "similarity-engine";
  contractVersion: typeof SIMILARITY_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredResultCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type SimilarityCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type SimilarityCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/3";
  contractVersion: typeof SIMILARITY_ENGINE_CONTRACT_VERSION;
  checks: readonly SimilarityCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type SimilarityScoreBreakdown = Readonly<{
  dimensions: readonly SimilarityDimension[];
  totalScore: number;
  readOnly: true;
}>;
