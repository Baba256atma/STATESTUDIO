/**
 * UI-PIPE-1:3 — Contract Validation Rules.
 *
 * Exactly 18 deterministic validation rules across Identity, SourceReference,
 * Dataset, ColumnSelection, Diagnostics, Review, and Boundary.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import type {
  ContractValidationCategory,
  ContractValidationResult,
  ContractValidationRule,
  PipelineUnderstandingIntakePackage,
} from "./pipelineUnderstandingContractTypes.ts";
import type { CreateIntakePackageInput } from "./pipelineUnderstandingContractTypes.ts";
import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
  DataSourceKnowledgeRegistryPublicPlatform,
} from "../dkl/dataSourceKnowledgeRegistryPublicIndex.ts";

const rule = (
  ruleId: string,
  category: ContractValidationCategory,
  name: string,
  description: string,
  blocking: boolean,
): ContractValidationRule =>
  Object.freeze({ ruleId, category, name, description, blocking });

/** Exactly 18 immutable contract validation rules. */
export const PipelineUnderstandingValidationRules: readonly ContractValidationRule[] =
  Object.freeze([
    rule("TenantWorkspaceSessionPresent", "Identity", "TenantWorkspaceSessionPresent", "Tenant, workspace, and session ids must be present.", true),
    rule("IdentityMatchesHandoff", "Identity", "IdentityMatchesHandoff", "Package identity must match the confirmed handoff.", true),
    rule("DeterministicIntakeIdentity", "Identity", "DeterministicIntakeIdentity", "Intake id must be deterministically derived.", true),
    rule("SourceRegistryReferenceResolves", "SourceReference", "SourceRegistryReferenceResolves", "Source registry id must resolve in DKL-2 Public Index.", true),
    rule("ConnectorRegistryReferenceResolves", "SourceReference", "ConnectorRegistryReferenceResolves", "Connector registry id must resolve in DKL-2 Public Index.", true),
    rule("ContentTypeRegistryReferenceResolves", "SourceReference", "ContentTypeRegistryReferenceResolves", "Content-type registry id must resolve in DKL-2 Public Index.", true),
    rule("DatasetIdentityMatchesPreview", "Dataset", "DatasetIdentityMatchesPreview", "Dataset id must match the parser preview dataset.", true),
    rule("PreviewCountsAreConsistent", "Dataset", "PreviewCountsAreConsistent", "Preview counts must be consistent with the parser dataset.", true),
    rule("PreviewOnlyScopeDeclared", "Dataset", "PreviewOnlyScopeDeclared", "Data scope must be PreviewOnly.", true),
    rule("SelectedColumnsExist", "ColumnSelection", "SelectedColumnsExist", "Every selected column key must exist in the parser dataset.", true),
    rule("SelectedColumnsAreUnique", "ColumnSelection", "SelectedColumnsAreUnique", "Selected column keys must be unique.", true),
    rule("AtLeastOneColumnSelected", "ColumnSelection", "AtLeastOneColumnSelected", "At least one column must be selected.", true),
    rule("NoBlockingDiagnostics", "Diagnostics", "NoBlockingDiagnostics", "Blocking diagnostics prevent DKL-3 intake readiness.", true),
    rule("DiagnosticProjectionComplete", "Diagnostics", "DiagnosticProjectionComplete", "Diagnostic projection must include the complete parser diagnostic set.", true),
    rule("PreviewExplicitlyConfirmed", "Review", "PreviewExplicitlyConfirmed", "Preview must be explicitly confirmed.", true),
    rule("ReviewReadyForUnderstanding", "Review", "ReviewReadyForUnderstanding", "Review status must be ReadyForUnderstanding.", true),
    rule("IsolationBoundariesPreserved", "Boundary", "IsolationBoundariesPreserved", "Tenant, workspace, and session boundaries must be preserved.", true),
    rule("NoForbiddenProcessingPerformed", "Boundary", "NoForbiddenProcessingPerformed", "Persistence, semantics, AI, and engine processing must remain false.", true),
  ]);

const result = (
  ruleId: string,
  category: ContractValidationCategory,
  status: ContractValidationResult["status"],
  severity: ContractValidationResult["severity"],
  message: string,
  evidence: string,
  blocking: boolean,
): ContractValidationResult =>
  Object.freeze({ ruleId, category, status, severity, message, evidence, blocking });

const pass = (
  ruleId: string,
  category: ContractValidationCategory,
  message: string,
  evidence: string,
  blocking: boolean,
): ContractValidationResult =>
  result(ruleId, category, "PASS", "Info", message, evidence, blocking);

const fail = (
  ruleId: string,
  category: ContractValidationCategory,
  message: string,
  evidence: string,
  blocking: boolean,
): ContractValidationResult =>
  result(ruleId, category, "FAIL", blocking ? "Blocking" : "Error", message, evidence, blocking);

export interface ValidationContext {
  readonly input: CreateIntakePackageInput;
  readonly pkg: PipelineUnderstandingIntakePackage;
  readonly expectedIntakeId: string;
  readonly completeDiagnosticCount: number;
}

/** Run all 18 contract validation rules. Never throws for ordinary invalid input. */
export function validatePipelineUnderstandingIntakePackage(
  context: ValidationContext,
): readonly ContractValidationResult[] {
  const { input, pkg, expectedIntakeId, completeDiagnosticCount } = context;
  const handoff = input.handoff;
  const dataset = input.dataset;
  const registry = DataSourceKnowledgeRegistryPublicPlatform.registry;
  const results: ContractValidationResult[] = [];

  // Identity
  const idsPresent =
    pkg.identity.tenantId.trim().length > 0 &&
    pkg.identity.workspaceId.trim().length > 0 &&
    pkg.identity.sessionId.trim().length > 0;
  results.push(
    idsPresent
      ? pass("TenantWorkspaceSessionPresent", "Identity", "Tenant, workspace, and session are present.", "identity fields non-empty", true)
      : fail("TenantWorkspaceSessionPresent", "Identity", "Tenant, workspace, or session is missing.", "empty identity field", true),
  );

  const identityMatches =
    pkg.identity.tenantId === handoff.tenantId &&
    pkg.identity.workspaceId === handoff.workspaceId &&
    pkg.identity.sessionId === handoff.sessionId &&
    pkg.identity.datasetId === handoff.datasetId &&
    pkg.identity.handoffId === handoff.handoffId &&
    pkg.identity.tenantId === dataset.tenantId &&
    pkg.identity.workspaceId === dataset.workspaceId &&
    pkg.identity.sessionId === dataset.sessionId &&
    pkg.identity.datasetId === dataset.datasetId;
  results.push(
    identityMatches
      ? pass("IdentityMatchesHandoff", "Identity", "Identity matches handoff and dataset.", "tenant/workspace/session/dataset/handoff aligned", true)
      : fail("IdentityMatchesHandoff", "Identity", "Identity does not match handoff or dataset.", "mismatch detected", true),
  );

  results.push(
    pkg.identity.intakeId === expectedIntakeId
      ? pass("DeterministicIntakeIdentity", "Identity", "Intake id is deterministic.", expectedIntakeId, true)
      : fail("DeterministicIntakeIdentity", "Identity", "Intake id is not deterministic.", `${pkg.identity.intakeId} !== ${expectedIntakeId}`, true),
  );

  // SourceReference
  const sourceOk = registry.dataSources.getById(pkg.source.sourceRegistryId) !== undefined;
  results.push(
    sourceOk
      ? pass("SourceRegistryReferenceResolves", "SourceReference", "Source registry reference resolves.", pkg.source.sourceRegistryId, true)
      : fail("SourceRegistryReferenceResolves", "SourceReference", "Source registry reference does not resolve.", pkg.source.sourceRegistryId, true),
  );
  const connectorOk = registry.connectors.getById(pkg.source.connectorRegistryId) !== undefined;
  results.push(
    connectorOk
      ? pass("ConnectorRegistryReferenceResolves", "SourceReference", "Connector registry reference resolves.", pkg.source.connectorRegistryId, true)
      : fail("ConnectorRegistryReferenceResolves", "SourceReference", "Connector registry reference does not resolve.", pkg.source.connectorRegistryId, true),
  );
  const contentOk = registry.contentTypes.getById(pkg.source.contentTypeRegistryId) !== undefined;
  results.push(
    contentOk
      ? pass("ContentTypeRegistryReferenceResolves", "SourceReference", "Content-type registry reference resolves.", pkg.source.contentTypeRegistryId, true)
      : fail("ContentTypeRegistryReferenceResolves", "SourceReference", "Content-type registry reference does not resolve.", pkg.source.contentTypeRegistryId, true),
  );

  // Dataset
  results.push(
    pkg.identity.datasetId === dataset.datasetId && pkg.dataset.datasetName === dataset.datasetName
      ? pass("DatasetIdentityMatchesPreview", "Dataset", "Dataset identity matches preview.", dataset.datasetId, true)
      : fail("DatasetIdentityMatchesPreview", "Dataset", "Dataset identity does not match preview.", pkg.identity.datasetId, true),
  );

  const countsOk =
    pkg.dataset.columnCount === dataset.columnCount &&
    pkg.dataset.rowCountObserved === dataset.rowCountObserved &&
    pkg.dataset.rowCountPreviewed === dataset.rowCountPreviewed &&
    pkg.previewEvidence.previewRowCount <= dataset.rowCountPreviewed &&
    pkg.previewEvidence.previewRows.length <= dataset.previewRows.length;
  results.push(
    countsOk
      ? pass("PreviewCountsAreConsistent", "Dataset", "Preview counts are consistent.", `previewRows=${pkg.previewEvidence.previewRowCount}`, true)
      : fail("PreviewCountsAreConsistent", "Dataset", "Preview counts are inconsistent.", "count mismatch", true),
  );

  results.push(
    pkg.dataset.dataScope === "PreviewOnly"
      ? pass("PreviewOnlyScopeDeclared", "Dataset", "PreviewOnly scope declared.", "dataScope=PreviewOnly", true)
      : fail("PreviewOnlyScopeDeclared", "Dataset", "PreviewOnly scope missing.", String(pkg.dataset.dataScope), true),
  );

  // ColumnSelection
  const datasetKeys = new Set(dataset.columns.map((c) => c.key));
  const selected = pkg.review.selectedColumnKeys;
  const allExist = selected.every((k) => datasetKeys.has(k));
  results.push(
    allExist
      ? pass("SelectedColumnsExist", "ColumnSelection", "Selected columns exist in parser dataset.", `${selected.length} keys`, true)
      : fail("SelectedColumnsExist", "ColumnSelection", "One or more selected columns are missing.", selected.join(","), true),
  );

  const unique = new Set(selected).size === selected.length;
  results.push(
    unique
      ? pass("SelectedColumnsAreUnique", "ColumnSelection", "Selected columns are unique.", `${selected.length} unique`, true)
      : fail("SelectedColumnsAreUnique", "ColumnSelection", "Duplicate selected columns detected.", selected.join(","), true),
  );

  results.push(
    selected.length > 0 && pkg.columns.length > 0
      ? pass("AtLeastOneColumnSelected", "ColumnSelection", "At least one column is selected.", `${pkg.columns.length}`, true)
      : fail("AtLeastOneColumnSelected", "ColumnSelection", "Zero columns selected.", "0", true),
  );

  // Diagnostics
  results.push(
    !pkg.diagnostics.hasBlockingIssues && pkg.readiness.blockingIssueCount === 0
      ? pass("NoBlockingDiagnostics", "Diagnostics", "No blocking diagnostics.", "blocking=0", true)
      : fail("NoBlockingDiagnostics", "Diagnostics", "Blocking diagnostics present.", `blocking=${pkg.readiness.blockingIssueCount}`, true),
  );

  const projectedCount =
    pkg.diagnostics.blockingDiagnostics.length +
    pkg.diagnostics.errorDiagnostics.length +
    pkg.diagnostics.warningDiagnostics.length +
    pkg.diagnostics.infoDiagnostics.length;
  results.push(
    projectedCount === completeDiagnosticCount &&
      pkg.diagnostics.diagnosticCounts.total === completeDiagnosticCount
      ? pass("DiagnosticProjectionComplete", "Diagnostics", "Diagnostic projection is complete.", `count=${projectedCount}`, true)
      : fail("DiagnosticProjectionComplete", "Diagnostics", "Diagnostic projection incomplete.", `${projectedCount}/${completeDiagnosticCount}`, true),
  );

  // Review
  const confirmed =
    input.overrides?.reviewConfirmed === false
      ? false
      : pkg.review.confirmed === true && handoff.readyForUnderstanding === true;
  results.push(
    confirmed
      ? pass("PreviewExplicitlyConfirmed", "Review", "Preview explicitly confirmed.", "confirmed=true", true)
      : fail("PreviewExplicitlyConfirmed", "Review", "Preview was not explicitly confirmed.", "confirmed=false", true),
  );

  results.push(
    pkg.review.reviewStatus === "ReadyForUnderstanding" &&
      pkg.review.readyForUnderstanding === true &&
      pkg.review.confirmed === true &&
      handoff.reviewStatus === "ReadyForUnderstanding"
      ? pass("ReviewReadyForUnderstanding", "Review", "Review is ReadyForUnderstanding.", "reviewStatus ok", true)
      : fail("ReviewReadyForUnderstanding", "Review", "Review is not ReadyForUnderstanding.", pkg.review.reviewStatus, true),
  );

  // Boundary
  results.push(
    pkg.boundaries.tenantBoundaryPreserved &&
      pkg.boundaries.workspaceBoundaryPreserved &&
      pkg.boundaries.sessionBoundaryPreserved &&
      identityMatches
      ? pass("IsolationBoundariesPreserved", "Boundary", "Isolation boundaries preserved.", "tenant/workspace/session", true)
      : fail("IsolationBoundariesPreserved", "Boundary", "Isolation boundaries violated.", "boundary mismatch", true),
  );

  const forbiddenOk =
    pkg.boundaries.previewOnly &&
    !pkg.boundaries.persistencePerformed &&
    !pkg.boundaries.semanticUnderstandingPerformed &&
    !pkg.boundaries.businessObjectMappingPerformed &&
    !pkg.boundaries.aiInferencePerformed &&
    !pkg.boundaries.engineReasoningPerformed &&
    !input.overrides?.injectSemanticField &&
    !input.overrides?.injectPersistenceField;
  results.push(
    forbiddenOk
      ? pass("NoForbiddenProcessingPerformed", "Boundary", "No forbidden processing performed.", "preview-only boundary", true)
      : fail("NoForbiddenProcessingPerformed", "Boundary", "Forbidden processing or injected fields detected.", "boundary violation", true),
  );

  // Silence unused export reference in type-check scenarios
  void DataSourceKnowledgeRegistryPublicIndexVersion;

  return Object.freeze(results);
}
