/**
 * APP-10:6 — Strategy Learning Engine validation.
 */

import { failureExists } from "./failureLearningEngineRegistry.ts";
import { outcomeExists } from "./outcomeLearningEngineRegistry.ts";
import { patternExists } from "./patternExtractionEngineRegistry.ts";
import { similarityResultExists } from "./similarityEngineRegistry.ts";
import {
  STRATEGY_CATEGORY_KEYS,
  STRATEGY_LEARNING_CERTIFIED_SOURCES,
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
  STRATEGY_LEARNING_ENGINE_LIMITS,
  STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS,
} from "./strategyLearningEngineConstants.ts";
import type {
  ExecutiveStrategy,
  HistoricalStrategyRecordInput,
  StrategyCategory,
  StrategyLearningRequest,
  StrategyProfile,
  StrategyProvenance,
  StrategyValidationIssue,
  StrategyValidationResult,
} from "./strategyLearningEngineTypes.ts";

function issue(code: string, message: string, field?: string): StrategyValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: StrategyValidationIssue[]): StrategyValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function isStrategyCategory(value: string): value is StrategyCategory {
  return (STRATEGY_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(STRATEGY_LEARNING_CERTIFIED_SOURCES as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateHistoricalStrategyRecordInput(input: HistoricalStrategyRecordInput): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  if (!input.scenarioId.trim()) {
    issues.push(issue("missing_field", "scenarioId is required.", "scenarioId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.strategyName.trim()) {
    issues.push(issue("missing_field", "strategyName is required.", "strategyName"));
  }
  if (!isStrategyCategory(input.strategyCategory)) {
    issues.push(issue("invalid_category", "strategyCategory is invalid.", "strategyCategory"));
  }
  if (!input.businessGoal.trim()) {
    issues.push(issue("missing_field", "businessGoal is required.", "businessGoal"));
  }
  if (!input.outcomeSummary.trim()) {
    issues.push(issue("missing_field", "outcomeSummary is required.", "outcomeSummary"));
  }
  if (!input.failureSummary.trim()) {
    issues.push(issue("missing_field", "failureSummary is required.", "failureSummary"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (hasDuplicateIds(input.relatedPatternIds)) {
    issues.push(issue("duplicate_ids", "relatedPatternIds contain duplicates.", "relatedPatternIds"));
  }
  if (hasDuplicateIds(input.relatedSimilarityResultIds)) {
    issues.push(issue("duplicate_ids", "relatedSimilarityResultIds contain duplicates.", "relatedSimilarityResultIds"));
  }
  if (hasDuplicateIds(input.relatedOutcomeIds)) {
    issues.push(issue("duplicate_ids", "relatedOutcomeIds contain duplicates.", "relatedOutcomeIds"));
  }
  if (hasDuplicateIds(input.relatedFailureIds)) {
    issues.push(issue("duplicate_ids", "relatedFailureIds contain duplicates.", "relatedFailureIds"));
  }
  if (input.relatedPatternIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedPatternIds must not be empty.", "relatedPatternIds"));
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
  return result(issues);
}

export function validateStrategyProvenance(provenance: StrategyProvenance): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  if (provenance.scenarioIds.length === 0) {
    issues.push(issue("missing_provenance", "scenarioIds are required.", "provenance.scenarioIds"));
  }
  if (provenance.patternIds.length === 0) {
    issues.push(issue("missing_provenance", "patternIds are required.", "provenance.patternIds"));
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
  if (provenance.engineVersion !== STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.extractionVersion !== "APP-10/2") {
    issues.push(issue("invalid_provenance", "extractionVersion mismatch.", "provenance.extractionVersion"));
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
  if (hasDuplicateIds(provenance.scenarioIds)) {
    issues.push(issue("duplicate_provenance", "Duplicate scenarioIds in provenance.", "provenance.scenarioIds"));
  }
  return result(issues);
}

export function validateStrategyProfile(profile: StrategyProfile): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  for (const field of STRATEGY_LEARNING_MANDATORY_PROFILE_FIELDS) {
    const value = profile[field as keyof StrategyProfile];
    if (value === undefined || value === null) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (!isStrategyCategory(profile.strategyCategory)) {
    issues.push(issue("invalid_category", "strategyCategory is invalid.", "strategyCategory"));
  }
  if (profile.businessConditions.length === 0) {
    issues.push(issue("missing_conditions", "businessConditions must not be empty.", "businessConditions"));
  }
  if (profile.evidenceCount <= 0) {
    issues.push(issue("missing_evidence", "evidenceCount must be greater than zero.", "evidenceCount"));
  }
  if (profile.version !== STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (profile.readOnly !== true) {
    issues.push(issue("invalid_contract", "StrategyProfile must be read-only.", "readOnly"));
  }
  issues.push(...validateStrategyProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveStrategy(strategy: ExecutiveStrategy): StrategyValidationResult {
  const issues = [...validateStrategyProfile(strategy.strategy).issues];
  if (strategy.outcomeLinks.length === 0) {
    issues.push(issue("missing_links", "outcomeLinks must not be empty.", "outcomeLinks"));
  }
  if (strategy.failureLinks.length === 0) {
    issues.push(issue("missing_links", "failureLinks must not be empty.", "failureLinks"));
  }
  if (strategy.readOnly !== true) {
    issues.push(issue("invalid_contract", "ExecutiveStrategy must be read-only.", "readOnly"));
  }
  return result(issues);
}

export function validateStrategyLearningRequest(request: StrategyLearningRequest): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (request.records.length === 0) {
    issues.push(issue("missing_field", "records must not be empty.", "records"));
  }
  if (request.records.length > STRATEGY_LEARNING_ENGINE_LIMITS.maxHistoricalRecords) {
    issues.push(issue("limit_exceeded", "records exceeds limit.", "records"));
  }
  for (const record of request.records) {
    issues.push(...validateHistoricalStrategyRecordInput(record).issues);
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for scenario ${record.scenarioId}.`, "workspaceId"));
    }
  }
  return result(issues);
}

export function validatePatternReferences(patternIds: readonly string[]): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
  if (patternIds.length === 0) {
    issues.push(issue("missing_provenance", "relatedPatternIds must not be empty.", "relatedPatternIds"));
  }
  for (const patternId of patternIds) {
    if (!patternId.trim()) {
      issues.push(issue("missing_field", "patternId must not be blank.", "relatedPatternIds"));
      continue;
    }
    if (!patternExists(patternId)) {
      issues.push(issue("broken_reference", `Pattern not found: ${patternId}.`, "relatedPatternIds"));
    }
  }
  return result(issues);
}

export function validateSimilarityReferences(similarityResultIds: readonly string[]): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
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

export function validateOutcomeReferences(outcomeIds: readonly string[]): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
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

export function validateFailureReferences(failureIds: readonly string[]): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
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
  failureEngineInitialized: boolean
): StrategyValidationResult {
  const issues: StrategyValidationIssue[] = [];
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
  return result(issues);
}

export function validateStrategyLearning(strategies: readonly ExecutiveStrategy[]): StrategyValidationResult {
  const issues = strategies.flatMap((strategy) => validateExecutiveStrategy(strategy).issues);
  return result(issues);
}
