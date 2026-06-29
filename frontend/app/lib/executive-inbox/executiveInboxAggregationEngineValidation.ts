/**
 * APP-11:2 — Executive Inbox Aggregation Engine validation.
 */

import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { isExecutiveInboxSourceType } from "./executiveInboxValidation.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_CERTIFIED_SOURCE_APPS,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS,
  EXECUTIVE_INBOX_AGGREGATION_MANDATORY_ITEM_FIELDS,
} from "./executiveInboxAggregationEngineConstants.ts";
import type {
  CertifiedInboxSourceRecordInput,
  ExecutiveInboxAggregate,
  ExecutiveInboxAggregationRequest,
  ExecutiveInboxAggregationSession,
  ExecutiveInboxAggregationValidation,
  ExecutiveInboxAggregationValidationIssue,
  ExecutiveInboxItem,
  ExecutiveInboxItemProvenance,
  ExecutiveInboxSourceReference,
} from "./executiveInboxAggregationEngineTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveInboxAggregationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: ExecutiveInboxAggregationValidationIssue[]): ExecutiveInboxAggregationValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateCertifiedSourceApps(sourceApps: readonly string[]): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (sourceApps.length === 0) {
    issues.push(issue("missing_field", "sourceApps must not be empty.", "sourceApps"));
  }
  for (const app of sourceApps) {
    if (!(EXECUTIVE_INBOX_AGGREGATION_CERTIFIED_SOURCE_APPS as readonly string[]).includes(app)) {
      issues.push(issue("invalid_dependency", `Uncertified source app: ${app}.`, "sourceApps"));
    }
  }
  return result(issues);
}

export function validateCertifiedInboxSourceRecordInput(
  input: CertifiedInboxSourceRecordInput
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (!input.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceId"));
  }
  if (!input.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!input.platformId.trim()) {
    issues.push(issue("missing_field", "platformId is required.", "platformId"));
  }
  if (!input.appId.trim()) {
    issues.push(issue("missing_field", "appId is required.", "appId"));
  }
  if (!input.recordId.trim()) {
    issues.push(issue("missing_field", "recordId is required.", "recordId"));
  }
  if (!isExecutiveInboxSourceType(input.sourceType)) {
    issues.push(issue("invalid_source_type", "sourceType is invalid.", "sourceType"));
  }
  if (!input.businessContext.trim() || input.businessContext.length > EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS.maxBusinessContextLength) {
    issues.push(issue("invalid_business_context", "businessContext is invalid.", "businessContext"));
  }
  if (!input.summary.trim() || input.summary.length > EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS.maxSummaryLength) {
    issues.push(issue("invalid_summary", "summary is invalid.", "summary"));
  }
  if (!input.sourceVersion.trim()) {
    issues.push(issue("missing_field", "sourceVersion is required.", "sourceVersion"));
  }
  issues.push(...validateCertifiedSourceApps(input.sourceApps).issues);
  if (input.sourceApps.length > EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS.maxSourceAppsPerRecord) {
    issues.push(issue("limit_exceeded", "sourceApps exceeds limit.", "sourceApps"));
  }
  return result(issues);
}

export function validateExecutiveInboxSourceReference(
  reference: ExecutiveInboxSourceReference
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (!reference.sourceId.trim()) {
    issues.push(issue("missing_field", "sourceId is required.", "sourceReference.sourceId"));
  }
  if (!reference.recordId.trim()) {
    issues.push(issue("missing_field", "recordId is required.", "sourceReference.recordId"));
  }
  if (!isExecutiveInboxSourceType(reference.sourceType)) {
    issues.push(issue("invalid_source_type", "sourceType is invalid.", "sourceReference.sourceType"));
  }
  if (!reference.platformId.trim() || !reference.appId.trim() || !reference.sourceVersion.trim()) {
    issues.push(issue("incomplete_reference", "Source reference is incomplete.", "sourceReference"));
  }
  return result(issues);
}

export function validateExecutiveInboxItemProvenance(
  provenance: ExecutiveInboxItemProvenance
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (!provenance.originatingPlatform.trim()) {
    issues.push(issue("missing_provenance", "originatingPlatform is required.", "provenance.originatingPlatform"));
  }
  if (!provenance.originatingRecordId.trim()) {
    issues.push(issue("missing_provenance", "originatingRecordId is required.", "provenance.originatingRecordId"));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required.", "provenance.workspaceId"));
  }
  if (provenance.aggregationVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "aggregationVersion mismatch.", "provenance.aggregationVersion"));
  }
  if (provenance.engineVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.foundationVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  if (provenance.sourceApps.length === 0) {
    issues.push(issue("missing_provenance", "sourceApps are required.", "provenance.sourceApps"));
  }
  return result(issues);
}

export function validateExecutiveInboxItem(item: ExecutiveInboxItem): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  for (const field of EXECUTIVE_INBOX_AGGREGATION_MANDATORY_ITEM_FIELDS) {
    if (!(field in item) || item[field as keyof ExecutiveInboxItem] === undefined) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (item.version !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Item version mismatch.", "version"));
  }
  if (item.engineVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Engine version mismatch.", "engineVersion"));
  }
  if (item.readOnly !== true) {
    issues.push(issue("invalid_item", "Item must be read-only.", "readOnly"));
  }
  issues.push(...validateExecutiveInboxSourceReference(item.sourceReference).issues);
  issues.push(...validateExecutiveInboxItemProvenance(item.provenance).issues);
  return result(issues);
}

export function validateExecutiveInboxAggregate(aggregate: ExecutiveInboxAggregate): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (aggregate.itemCount !== aggregate.items.length) {
    issues.push(issue("invalid_aggregate", "itemCount mismatch.", "itemCount"));
  }
  if (hasDuplicateIds(aggregate.items.map((entry) => entry.itemId))) {
    issues.push(issue("duplicate_items", "Aggregate contains duplicate item IDs.", "items"));
  }
  for (const item of aggregate.items) {
    issues.push(...validateExecutiveInboxItem(item).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxAggregationSession(
  session: ExecutiveInboxAggregationSession
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (!session.sessionId.trim() || !session.workspaceId.trim() || !session.label.trim()) {
    issues.push(issue("invalid_session", "Aggregation session is incomplete.", "session"));
  }
  if (session.engineVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Session engine version mismatch.", "engineVersion"));
  }
  return result(issues);
}

export function validateExecutiveInboxAggregationRequest(
  request: ExecutiveInboxAggregationRequest
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (request.sourceRecords.length === 0) {
    issues.push(issue("missing_field", "sourceRecords must not be empty.", "sourceRecords"));
  }
  if (request.sourceRecords.length > EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS.maxSourceRecords) {
    issues.push(issue("limit_exceeded", "sourceRecords exceeds limit.", "sourceRecords"));
  }
  if (hasDuplicateIds(request.sourceRecords.map((entry) => entry.sourceId))) {
    issues.push(issue("duplicate_ids", "sourceRecords contain duplicate sourceIds.", "sourceRecords"));
  }
  for (const record of request.sourceRecords) {
    issues.push(...validateCertifiedInboxSourceRecordInput(record).issues);
    if (record.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", `Workspace mismatch for source ${record.sourceId}.`, "workspaceId"));
    }
  }
  return result(issues);
}

export function validateFoundationCompatibilityForEngine(foundationInitialized: boolean): ExecutiveInboxAggregationValidation {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-11:1 foundation is not initialized.", "foundation")]);
  }
  return result([]);
}

export function validateExecutiveInboxAggregation(
  items: readonly ExecutiveInboxItem[]
): ExecutiveInboxAggregationValidation {
  const issues: ExecutiveInboxAggregationValidationIssue[] = [];
  if (hasDuplicateIds(items.map((entry) => entry.itemId))) {
    issues.push(issue("duplicate_items", "Aggregated items contain duplicate IDs.", "items"));
  }
  for (const item of items) {
    issues.push(...validateExecutiveInboxItem(item).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxItems(items: readonly ExecutiveInboxItem[]): ExecutiveInboxAggregationValidation {
  return validateExecutiveInboxAggregation(items);
}
