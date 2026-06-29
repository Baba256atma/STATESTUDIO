/**
 * APP-9:3 — Confidence Evolution Query validation.
 */

import { validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionEngineInitialized } from "./confidenceEvolutionEngine.ts";
import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import {
  isConfidenceChangeReason,
  isConfidenceLevel,
  isConfidenceSource,
  validateWorkspaceIsolation,
} from "./confidenceEvolutionValidation.ts";
import { isConfidenceRecordStatus } from "./confidenceEvolutionEngineValidation.ts";
import {
  CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
  DEFAULT_CONFIDENCE_EVOLUTION_QUERY_DIRECTION,
  type ConfidenceEvolutionQueryFilters,
  type ConfidenceEvolutionQueryInput,
  type ConfidenceEvolutionQueryResult,
  type ConfidenceEvolutionValidationIssue,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionQueryTypes.ts";

function issue(code: string, message: string, field?: string): ConfidenceEvolutionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ConfidenceEvolutionValidationIssue[]): ConfidenceEvolutionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForQuery(timestamp: string): ConfidenceEvolutionValidationResult {
  const foundation = validateConfidenceEvolution(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateConfidenceEngineAvailabilityForQuery(): ConfidenceEvolutionValidationResult {
  if (!isConfidenceEvolutionEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-9:2 Confidence Evolution Engine is not initialized.")]);
  }
  return result([]);
}

export function validateConfidenceEvolutionQueryInput(
  input: ConfidenceEvolutionQueryInput
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  const filters = input.filters;

  if (!filters.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }

  if (filters.confidenceLevel !== undefined && !isConfidenceLevel(filters.confidenceLevel)) {
    issues.push(issue("invalid_enum", "Invalid confidenceLevel.", "confidenceLevel"));
  }
  if (filters.source !== undefined && !isConfidenceSource(filters.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (filters.reason !== undefined && !isConfidenceChangeReason(filters.reason)) {
    issues.push(issue("invalid_enum", "Invalid reason.", "reason"));
  }
  if (filters.status !== undefined && !isConfidenceRecordStatus(filters.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }

  if (filters.direction !== undefined && filters.direction !== "asc" && filters.direction !== "desc") {
    issues.push(issue("invalid_enum", "Invalid direction.", "direction"));
  }

  if (filters.confidenceScoreMin !== undefined) {
    if (typeof filters.confidenceScoreMin !== "number" || Number.isNaN(filters.confidenceScoreMin)) {
      issues.push(issue("invalid_field", "Invalid confidenceScoreMin.", "confidenceScoreMin"));
    }
  }
  if (filters.confidenceScoreMax !== undefined) {
    if (typeof filters.confidenceScoreMax !== "number" || Number.isNaN(filters.confidenceScoreMax)) {
      issues.push(issue("invalid_field", "Invalid confidenceScoreMax.", "confidenceScoreMax"));
    }
  }
  if (
    filters.confidenceScoreMin !== undefined &&
    filters.confidenceScoreMax !== undefined &&
    filters.confidenceScoreMin > filters.confidenceScoreMax
  ) {
    issues.push(
      issue(
        "invalid_range",
        "confidenceScoreMin must be less than or equal to confidenceScoreMax.",
        "confidenceScoreMin"
      )
    );
  }

  if (filters.updatedAtFrom && filters.updatedAtTo && filters.updatedAtFrom > filters.updatedAtTo) {
    issues.push(issue("invalid_range", "updatedAtFrom must be before or equal to updatedAtTo.", "updatedAtFrom"));
  }
  if (filters.createdAtFrom && filters.createdAtTo && filters.createdAtFrom > filters.createdAtTo) {
    issues.push(issue("invalid_range", "createdAtFrom must be before or equal to createdAtTo.", "createdAtFrom"));
  }

  return result(issues);
}

export function validateConfidenceEvolutionQueryResult(
  resultValue: ConfidenceEvolutionQueryResult
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];

  if (resultValue.contractVersion !== CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (resultValue.readOnly !== true) {
    issues.push(issue("contract_violation", "Query result must be read-only.", "readOnly"));
  }
  if (resultValue.totalRecords !== resultValue.records.length) {
    issues.push(issue("invalid_field", "totalRecords must match records length.", "totalRecords"));
  }
  if (resultValue.ordering.primary !== "updatedAt") {
    issues.push(issue("invalid_field", "Invalid ordering primary field.", "ordering"));
  }
  if (resultValue.ordering.direction !== "asc" && resultValue.ordering.direction !== "desc") {
    issues.push(issue("invalid_field", "Invalid ordering direction.", "ordering"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForQueryResult(
  records: readonly ConfidenceEvolutionEngineRecord[],
  workspaceId: string
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationIssue[] = [];
  for (const record of records) {
    const isolation = validateWorkspaceIsolation(workspaceId, record.workspaceId);
    if (!isolation.valid) {
      issues.push(...isolation.issues);
      break;
    }
  }
  return result(issues);
}

export function resolveQueryDirection(filters: ConfidenceEvolutionQueryFilters): "asc" | "desc" {
  return filters.direction ?? DEFAULT_CONFIDENCE_EVOLUTION_QUERY_DIRECTION;
}

export function assertNoMutationApisInQuerySource(source: string): boolean {
  return (
    !source.includes("createConfidenceRecord(") &&
    !source.includes("updateConfidenceMetadata(") &&
    !source.includes("archiveConfidenceRecord(") &&
    !source.includes("registerConfidenceRecord(")
  );
}

export const ConfidenceEvolutionQueryValidation = Object.freeze({
  validateFoundationCompatibilityForQuery,
  validateConfidenceEngineAvailabilityForQuery,
  validateConfidenceEvolutionQueryInput,
  validateConfidenceEvolutionQueryResult,
  validateWorkspaceIsolationForQueryResult,
  resolveQueryDirection,
  assertNoMutationApisInQuerySource,
});
