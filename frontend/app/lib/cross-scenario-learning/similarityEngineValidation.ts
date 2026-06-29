/**
 * APP-10:3 — Similarity Engine validation.
 */

import { isPatternCategory } from "./patternExtractionEngineValidation.ts";
import {
  KPI_DIRECTION_KEYS,
  RISK_PROFILE_KEYS,
  SIMILARITY_ENGINE_CONTRACT_VERSION,
  SIMILARITY_ENGINE_LIMITS,
  SIMILARITY_MANDATORY_RESULT_FIELDS,
  SIMILARITY_SCORING_METHOD,
} from "./similarityEngineConstants.ts";
import type {
  KpiDirection,
  PatternSimilarityResult,
  RiskProfile,
  ScenarioSimilarityComparisonResult,
  ScenarioSimilarityInput,
  ScenarioSimilarityProfile,
  ScenarioSimilarityResult,
  SimilarityExplanation,
  SimilarityResult,
  SimilarityValidationIssue,
  SimilarityValidationResult,
} from "./similarityEngineTypes.ts";

function issue(code: string, message: string, field?: string): SimilarityValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: SimilarityValidationIssue[]): SimilarityValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isKpiDirection(value: string): value is KpiDirection {
  return (KPI_DIRECTION_KEYS as readonly string[]).includes(value);
}

export function isRiskProfile(value: string): value is RiskProfile {
  return (RISK_PROFILE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateScenarioSimilarityProfile(profile: ScenarioSimilarityProfile): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  if (!profile.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!profile.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!profile.businessGoal.trim()) {
    issues.push(issue("missing_field", "businessGoal is required.", "businessGoal"));
  }
  if (profile.strategyChain.length === 0) {
    issues.push(issue("missing_field", "strategyChain must not be empty.", "strategyChain"));
  }
  if (profile.strategyChain.length > SIMILARITY_ENGINE_LIMITS.maxStrategyChainSteps) {
    issues.push(issue("limit_exceeded", "strategyChain exceeds limit.", "strategyChain"));
  }
  if (!isKpiDirection(profile.kpiDirection)) {
    issues.push(issue("invalid_field", "kpiDirection is invalid.", "kpiDirection"));
  }
  if (!isRiskProfile(profile.riskProfile)) {
    issues.push(issue("invalid_field", "riskProfile is invalid.", "riskProfile"));
  }
  if (!isPatternCategory(profile.patternCategory)) {
    issues.push(issue("invalid_field", "patternCategory is invalid.", "patternCategory"));
  }
  if (!profile.workspaceDomain.trim()) {
    issues.push(issue("missing_field", "workspaceDomain is required.", "workspaceDomain"));
  }
  if (profile.readOnly !== true) {
    issues.push(issue("invalid_contract", "ScenarioSimilarityProfile must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateSimilarityExplanation(explanation: SimilarityExplanation): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  if (!explanation.summary.trim()) {
    issues.push(issue("missing_field", "summary is required.", "explanation.summary"));
  }
  if (explanation.scoringMethod !== SIMILARITY_SCORING_METHOD) {
    issues.push(issue("invalid_field", "scoringMethod mismatch.", "explanation.scoringMethod"));
  }
  if (explanation.finalScore < SIMILARITY_ENGINE_LIMITS.minScore || explanation.finalScore > SIMILARITY_ENGINE_LIMITS.maxScore) {
    issues.push(issue("invalid_score", "finalScore out of range.", "explanation.finalScore"));
  }
  return result(issues);
}

function validateSimilarityResultCommon(resultValue: SimilarityResult): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  for (const field of SIMILARITY_MANDATORY_RESULT_FIELDS) {
    const value = resultValue[field as keyof SimilarityResult];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (resultValue.score < SIMILARITY_ENGINE_LIMITS.minScore || resultValue.score > SIMILARITY_ENGINE_LIMITS.maxScore) {
    issues.push(issue("invalid_score", "score out of range.", "score"));
  }
  if (resultValue.version !== SIMILARITY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (resultValue.dimensions.length === 0) {
    issues.push(issue("missing_field", "dimensions must not be empty.", "dimensions"));
  }
  if (resultValue.evidence.length === 0) {
    issues.push(issue("missing_evidence", "evidence must not be empty.", "evidence"));
  }
  if (resultValue.readOnly !== true) {
    issues.push(issue("invalid_contract", "Similarity result must be read-only.", "readOnly"));
  }
  if (hasDuplicateIds(resultValue.evidence.map((entry) => entry.evidenceId))) {
    issues.push(issue("duplicate_evidence", "Duplicate evidence ids detected.", "evidence"));
  }
  issues.push(...validateSimilarityExplanation(resultValue.explanation).issues);
  if (resultValue.explanation.finalScore !== resultValue.score) {
    issues.push(issue("invalid_score", "explanation.finalScore must match score.", "score"));
  }
  return result(issues);
}

export function validateScenarioSimilarityResult(resultValue: ScenarioSimilarityResult): SimilarityValidationResult {
  const issues = [...validateSimilarityResultCommon(resultValue).issues];
  if (resultValue.comparisonType !== "scenario_to_scenario") {
    issues.push(issue("invalid_type", "comparisonType must be scenario_to_scenario.", "comparisonType"));
  }
  if (!resultValue.matchedScenarioId.trim()) {
    issues.push(issue("missing_field", "matchedScenarioId is required.", "matchedScenarioId"));
  }
  return result(issues);
}

export function validatePatternSimilarityResult(resultValue: PatternSimilarityResult): SimilarityValidationResult {
  const issues = [...validateSimilarityResultCommon(resultValue).issues];
  if (resultValue.comparisonType !== "scenario_to_pattern") {
    issues.push(issue("invalid_type", "comparisonType must be scenario_to_pattern.", "comparisonType"));
  }
  if (!resultValue.matchedPatternId.trim()) {
    issues.push(issue("missing_field", "matchedPatternId is required.", "matchedPatternId"));
  }
  return result(issues);
}

export function validateSimilarityResult(resultValue: SimilarityResult): SimilarityValidationResult {
  return resultValue.comparisonType === "scenario_to_scenario"
    ? validateScenarioSimilarityResult(resultValue)
    : validatePatternSimilarityResult(resultValue);
}

export function validateScenarioSimilarityInput(input: ScenarioSimilarityInput): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  issues.push(...validateScenarioSimilarityProfile(input.query).issues);
  if (input.historicalScenarios.length === 0 && (input.patterns?.length ?? 0) === 0) {
    issues.push(issue("missing_field", "At least one historical scenario or pattern is required."));
  }
  if (input.historicalScenarios.length > SIMILARITY_ENGINE_LIMITS.maxHistoricalScenarios) {
    issues.push(issue("limit_exceeded", "historicalScenarios exceeds limit.", "historicalScenarios"));
  }
  for (const scenario of input.historicalScenarios) {
    issues.push(...validateScenarioSimilarityProfile(scenario).issues);
    if (scenario.workspaceId !== input.query.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for scenario ${scenario.scenarioId}.`, "workspaceId"));
    }
    if (scenario.scenarioId === input.query.scenarioId) {
      issues.push(issue("self_comparison", "Query scenario cannot appear in historicalScenarios.", "historicalScenarios"));
    }
  }
  return result(issues);
}

export function validateSimilarityComparisonResult(
  comparison: ScenarioSimilarityComparisonResult
): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  for (const entry of comparison.scenarioResults) {
    issues.push(...validateScenarioSimilarityResult(entry).issues);
  }
  for (const entry of comparison.patternResults) {
    issues.push(...validatePatternSimilarityResult(entry).issues);
  }
  return result(issues);
}

export function validateEngineDependencies(
  foundationInitialized: boolean,
  patternEngineInitialized: boolean
): SimilarityValidationResult {
  const issues: SimilarityValidationIssue[] = [];
  if (!foundationInitialized) {
    issues.push(issue("foundation_incompatible", "APP-10:1 foundation is not initialized."));
  }
  if (!patternEngineInitialized) {
    issues.push(issue("pattern_engine_incompatible", "APP-10:2 pattern extraction engine is not initialized."));
  }
  return result(issues);
}
