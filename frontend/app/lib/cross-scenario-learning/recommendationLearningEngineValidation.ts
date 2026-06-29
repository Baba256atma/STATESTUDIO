/**
 * APP-10:7 — Recommendation Learning Engine validation.
 */

import { failureExists } from "./failureLearningEngineRegistry.ts";
import { outcomeExists } from "./outcomeLearningEngineRegistry.ts";
import { similarityResultExists } from "./similarityEngineRegistry.ts";
import { strategyExists } from "./strategyLearningEngineRegistry.ts";
import {
  RECOMMENDATION_CATEGORY_KEYS,
  RECOMMENDATION_LEARNING_CERTIFIED_SOURCES,
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LEARNING_ENGINE_LIMITS,
  RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS,
  RECOMMENDATION_LIFECYCLE_STATE_KEYS,
} from "./recommendationLearningEngineConstants.ts";
import type {
  ExecutiveRecommendationHistory,
  HistoricalRecommendationRecordInput,
  RecommendationCategory,
  RecommendationLearningRequest,
  RecommendationLifecycleState,
  RecommendationProfile,
  RecommendationProvenance,
  RecommendationValidationIssue,
  RecommendationValidationResult,
} from "./recommendationLearningEngineTypes.ts";

function issue(code: string, message: string, field?: string): RecommendationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationValidationIssue[]): RecommendationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isRecommendationCategory(value: string): value is RecommendationCategory {
  return (RECOMMENDATION_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function isRecommendationLifecycleState(value: string): value is RecommendationLifecycleState {
  return (RECOMMENDATION_LIFECYCLE_STATE_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(RECOMMENDATION_LEARNING_CERTIFIED_SOURCES as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateHistoricalRecommendationRecordInput(
  input: HistoricalRecommendationRecordInput
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!input.recommendationRecordId.trim()) {
    issues.push(issue("missing_field", "recommendationRecordId is required.", "recommendationRecordId"));
  }
  if (!input.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.recommendationSummary.trim()) {
    issues.push(issue("missing_field", "recommendationSummary is required.", "recommendationSummary"));
  }
  if (!isRecommendationCategory(input.recommendationCategory)) {
    issues.push(issue("invalid_category", "recommendationCategory is invalid.", "recommendationCategory"));
  }
  if (!isRecommendationLifecycleState(input.lifecycleState)) {
    issues.push(issue("invalid_lifecycle", "lifecycleState is invalid.", "lifecycleState"));
  }
  if (!input.outcomeSummary.trim()) {
    issues.push(issue("missing_field", "outcomeSummary is required.", "outcomeSummary"));
  }
  if (!input.failureSummary.trim()) {
    issues.push(issue("missing_field", "failureSummary is required.", "failureSummary"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (input.relatedStrategyIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedStrategyIds must not be empty.", "relatedStrategyIds"));
  }
  if (input.relatedSimilarityResultIds.length === 0) {
    issues.push(
      issue("missing_provenance", "relatedSimilarityResultIds must not be empty.", "relatedSimilarityResultIds")
    );
  }
  if (input.relatedOutcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedOutcomeIds must not be empty.", "relatedOutcomeIds"));
  }
  if (input.relatedFailureIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedFailureIds must not be empty.", "relatedFailureIds"));
  }
  if (input.decisionIds.length === 0) {
    issues.push(issue("missing_provenance", "decisionIds must not be empty.", "decisionIds"));
  }
  if (input.journalEntryIds.length === 0) {
    issues.push(issue("missing_provenance", "journalEntryIds must not be empty.", "journalEntryIds"));
  }
  if (input.timelineReferences.length === 0) {
    issues.push(issue("missing_provenance", "timelineReferences must not be empty.", "timelineReferences"));
  }
  if (hasDuplicateIds(input.relatedStrategyIds)) {
    issues.push(issue("duplicate_ids", "relatedStrategyIds contain duplicates.", "relatedStrategyIds"));
  }
  return result(issues);
}

export function validateRecommendationProvenance(provenance: RecommendationProvenance): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (provenance.scenarioIds.length === 0) {
    issues.push(issue("missing_provenance", "scenarioIds are required.", "provenance.scenarioIds"));
  }
  if (provenance.strategyIds.length === 0) {
    issues.push(issue("missing_provenance", "strategyIds are required.", "provenance.strategyIds"));
  }
  if (provenance.similarityResultIds.length === 0) {
    issues.push(issue("missing_provenance", "similarityResultIds are required.", "provenance.similarityResultIds"));
  }
  if (provenance.outcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "outcomeIds are required.", "provenance.outcomeIds"));
  }
  if (provenance.failureIds.length === 0) {
    issues.push(issue("missing_provenance", "failureIds are required.", "provenance.failureIds"));
  }
  if (provenance.engineVersion !== RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.similarityVersion !== "APP-10/3") {
    issues.push(issue("invalid_provenance", "similarityVersion mismatch.", "provenance.similarityVersion"));
  }
  if (provenance.outcomeVersion !== "APP-10/4") {
    issues.push(issue("invalid_provenance", "outcomeVersion mismatch.", "provenance.outcomeVersion"));
  }
  if (provenance.failureVersion !== "APP-10/5") {
    issues.push(issue("invalid_provenance", "failureVersion mismatch.", "provenance.failureVersion"));
  }
  if (provenance.strategyVersion !== "APP-10/6") {
    issues.push(issue("invalid_provenance", "strategyVersion mismatch.", "provenance.strategyVersion"));
  }
  return result(issues);
}

export function validateRecommendationProfile(profile: RecommendationProfile): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  for (const field of RECOMMENDATION_LEARNING_MANDATORY_PROFILE_FIELDS) {
    const value = profile[field as keyof RecommendationProfile];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (!isRecommendationCategory(profile.recommendationCategory)) {
    issues.push(issue("invalid_category", "recommendationCategory is invalid.", "recommendationCategory"));
  }
  if (!isRecommendationLifecycleState(profile.lifecycleState)) {
    issues.push(issue("invalid_lifecycle", "lifecycleState is invalid.", "lifecycleState"));
  }
  if (profile.historicalEvidence.length === 0) {
    issues.push(issue("missing_evidence", "historicalEvidence must not be empty.", "historicalEvidence"));
  }
  if (profile.evidenceCount !== profile.historicalEvidence.length) {
    issues.push(issue("invalid_evidence", "evidenceCount must match historicalEvidence length.", "evidenceCount"));
  }
  if (profile.version !== RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (profile.readOnly !== true) {
    issues.push(issue("invalid_contract", "RecommendationProfile must be read-only.", "readOnly"));
  }
  issues.push(...validateRecommendationProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveRecommendationHistory(
  history: ExecutiveRecommendationHistory
): RecommendationValidationResult {
  const issues = [...validateRecommendationProfile(history.profile).issues];
  if (history.outcomeLinks.length === 0) {
    issues.push(issue("missing_links", "outcomeLinks must not be empty.", "outcomeLinks"));
  }
  if (history.failureLinks.length === 0) {
    issues.push(issue("missing_links", "failureLinks must not be empty.", "failureLinks"));
  }
  if (history.lifecycleHistory.length === 0) {
    issues.push(issue("missing_lifecycle", "lifecycleHistory must not be empty.", "lifecycleHistory"));
  }
  if (history.readOnly !== true) {
    issues.push(issue("invalid_contract", "ExecutiveRecommendationHistory must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateRecommendationLearningRequest(
  request: RecommendationLearningRequest
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (request.records.length === 0) {
    issues.push(issue("missing_field", "records must not be empty.", "records"));
  }
  if (request.records.length > RECOMMENDATION_LEARNING_ENGINE_LIMITS.maxHistoricalRecords) {
    issues.push(issue("limit_exceeded", "records exceeds limit.", "records"));
  }
  for (const record of request.records) {
    issues.push(...validateHistoricalRecommendationRecordInput(record).issues);
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for scenario ${record.scenarioId}.`, "workspaceId"));
    }
  }
  return result(issues);
}

export function validateStrategyReferences(strategyIds: readonly string[]): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (strategyIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedStrategyIds must not be empty.", "relatedStrategyIds"));
  }
  for (const strategyId of strategyIds) {
    if (!strategyId.trim()) {
      issues.push(issue("missing_field", "strategyId must not be blank.", "relatedStrategyIds"));
      continue;
    }
    if (!strategyExists(strategyId)) {
      issues.push(issue("broken_reference", `Strategy not found: ${strategyId}.`, "relatedStrategyIds"));
    }
  }
  return result(issues);
}

export function validateSimilarityReferences(similarityResultIds: readonly string[]): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (similarityResultIds.length === 0) {
    issues.push(
      issue("missing_provenance", "relatedSimilarityResultIds must not be empty.", "relatedSimilarityResultIds")
    );
  }
  for (const resultId of similarityResultIds) {
    if (!resultId.trim()) {
      issues.push(issue("missing_field", "similarityResultId must not be blank.", "relatedSimilarityResultIds"));
      continue;
    }
    if (!similarityResultExists(resultId)) {
      issues.push(issue("broken_reference", `Similarity result not found: ${resultId}.`, "relatedSimilarityResultIds"));
    }
  }
  return result(issues);
}

export function validateOutcomeReferences(outcomeIds: readonly string[]): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (outcomeIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedOutcomeIds must not be empty.", "relatedOutcomeIds"));
  }
  for (const outcomeId of outcomeIds) {
    if (!outcomeId.trim()) {
      issues.push(issue("missing_field", "outcomeId must not be blank.", "relatedOutcomeIds"));
      continue;
    }
    if (!outcomeExists(outcomeId)) {
      issues.push(issue("broken_reference", `Outcome not found: ${outcomeId}.`, "relatedOutcomeIds"));
    }
  }
  return result(issues);
}

export function validateFailureReferences(failureIds: readonly string[]): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (failureIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedFailureIds must not be empty.", "relatedFailureIds"));
  }
  for (const failureId of failureIds) {
    if (!failureId.trim()) {
      issues.push(issue("missing_field", "failureId must not be blank.", "relatedFailureIds"));
      continue;
    }
    if (!failureExists(failureId)) {
      issues.push(issue("broken_reference", `Failure not found: ${failureId}.`, "relatedFailureIds"));
    }
  }
  return result(issues);
}

export function validateEngineDependencies(
  foundationInitialized: boolean,
  patternEngineInitialized: boolean,
  similarityEngineInitialized: boolean,
  outcomeEngineInitialized: boolean,
  failureEngineInitialized: boolean,
  strategyEngineInitialized: boolean
): RecommendationValidationResult {
  const issues: RecommendationValidationIssue[] = [];
  if (!foundationInitialized) {
    issues.push(issue("foundation_incompatible", "APP-10:1 foundation is not initialized."));
  }
  if (!patternEngineInitialized) {
    issues.push(issue("pattern_engine_incompatible", "APP-10:2 pattern extraction engine is not initialized."));
  }
  if (!similarityEngineInitialized) {
    issues.push(issue("similarity_engine_incompatible", "APP-10:3 similarity engine is not initialized."));
  }
  if (!outcomeEngineInitialized) {
    issues.push(issue("outcome_engine_incompatible", "APP-10:4 outcome learning engine is not initialized."));
  }
  if (!failureEngineInitialized) {
    issues.push(issue("failure_engine_incompatible", "APP-10:5 failure learning engine is not initialized."));
  }
  if (!strategyEngineInitialized) {
    issues.push(issue("strategy_engine_incompatible", "APP-10:6 strategy learning engine is not initialized."));
  }
  return result(issues);
}

export function validateRecommendationLearning(
  histories: readonly ExecutiveRecommendationHistory[]
): RecommendationValidationResult {
  const issues = histories.flatMap((history) => validateExecutiveRecommendationHistory(history).issues);
  return result(issues);
}
