/**
 * UI-PIPE-1:3 — Pipeline Understanding Intake Package construction.
 *
 * Builds the canonical immutable PipelineUnderstandingIntakePackage from a
 * successful parser preview and a confirmed PipelineUnderstandingHandoff.
 * Preview-only. No DKL-3 execution. No persistence. No mutation of inputs.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "../dkl/dataSourceKnowledgeRegistryPublicIndex.ts";
import type { CanonicalParsedDataset, ParserDiagnostic } from "../integrations/csvParserTypes.ts";
import type { PipelineDiagnosticCounts } from "./pipelinePageTypes.ts";
import { PIPELINE_UNDERSTANDING_CONTRACT_VERSION } from "./pipelineUnderstandingContract.ts";
import type {
  CreateIntakePackageInput,
  IntakeBoundariesSection,
  IntakeColumnProjection,
  IntakeDiagnosticEntry,
  IntakeDiagnosticsSection,
  IntakeIdentitySection,
  IntakePreviewEvidenceSection,
  IntakeReadinessSection,
  IntakeReviewSection,
  IntakeSourceSection,
  IntakeDatasetSection,
  PipelineUnderstandingIntakeFailure,
  PipelineUnderstandingIntakePackage,
  PipelineUnderstandingIntakeResult,
  PipelineUnderstandingIntakeSuccess,
  PipelineUnderstandingContractSummary,
  ContractValidationResult,
} from "./pipelineUnderstandingContractTypes.ts";
import { INTAKE_SECTION_ORDER } from "./pipelineUnderstandingContractTypes.ts";
import { validatePipelineUnderstandingIntakePackage as runValidationRules } from "./pipelineUnderstandingValidation.ts";

const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
};

/** Deterministic intake id from session, dataset, and handoff identities. */
export function deriveIntakeId(
  sessionId: string,
  datasetId: string,
  handoffId: string,
): string {
  return `intake:${sessionId}:${datasetId}:${handoffId}`;
}

const projectDiagnostic = (d: ParserDiagnostic): IntakeDiagnosticEntry =>
  Object.freeze({
    code: d.code,
    category: d.category,
    severity: d.severity,
    field: d.field,
    rowIndex: d.rowIndex,
    columnIndex: d.columnIndex,
    recoverable: d.recoverable,
    message: d.message,
  });

const countDiagnostics = (
  diagnostics: readonly ParserDiagnostic[],
): PipelineDiagnosticCounts => {
  let blocking = 0;
  let error = 0;
  let warning = 0;
  let info = 0;
  for (const d of diagnostics) {
    if (d.severity === "Blocking") blocking += 1;
    else if (d.severity === "Error") error += 1;
    else if (d.severity === "Warning") warning += 1;
    else info += 1;
  }
  return Object.freeze({
    blocking,
    error,
    warning,
    info,
    total: blocking + error + warning + info,
  });
};

const projectDiagnostics = (
  diagnostics: readonly ParserDiagnostic[],
): IntakeDiagnosticsSection => {
  const blockingDiagnostics = Object.freeze(
    diagnostics.filter((d) => d.severity === "Blocking").map(projectDiagnostic),
  );
  const errorDiagnostics = Object.freeze(
    diagnostics.filter((d) => d.severity === "Error").map(projectDiagnostic),
  );
  const warningDiagnostics = Object.freeze(
    diagnostics.filter((d) => d.severity === "Warning").map(projectDiagnostic),
  );
  const infoDiagnostics = Object.freeze(
    diagnostics.filter((d) => d.severity === "Info").map(projectDiagnostic),
  );
  const formulaRiskCount = diagnostics.filter((d) => d.category === "FormulaRisk").length;
  const diagnosticCounts = countDiagnostics(diagnostics);
  return Object.freeze({
    diagnosticCounts,
    blockingDiagnostics,
    errorDiagnostics,
    warningDiagnostics,
    infoDiagnostics,
    formulaRiskCount,
    hasBlockingIssues: diagnosticCounts.blocking > 0,
  });
};

const resolveSelectedKeys = (
  dataset: CanonicalParsedDataset,
  input: CreateIntakePackageInput,
): readonly string[] => {
  const raw = input.overrides?.selectedColumnKeys ?? input.handoff.selectedColumnKeys;
  return Object.freeze([...raw]);
};

const projectColumns = (
  dataset: CanonicalParsedDataset,
  selectedKeys: readonly string[],
): readonly IntakeColumnProjection[] => {
  const keySet = new Set(selectedKeys);
  const projected = dataset.columns
    .filter((c) => keySet.has(c.key))
    .map((c) => {
      const diagnosticCodes = Object.freeze(
        dataset.diagnostics
          .filter((d) => d.columnIndex === c.index)
          .map((d) => d.code),
      );
      return Object.freeze({
        index: c.index,
        key: c.key,
        originalName: c.originalName,
        displayName: c.displayName,
        primitiveType: c.primitiveType,
        nonEmptySampleCount: c.nonEmptySampleCount,
        emptyValueCount: c.emptyValueCount,
        formulaRiskCount: c.formulaRiskCount,
        sampleValues: Object.freeze([...c.sampleValues]),
        diagnosticCodes,
        selectionStatus: "SelectedForUnderstanding" as const,
      });
    });
  return Object.freeze(projected);
};

const projectPreviewEvidence = (
  dataset: CanonicalParsedDataset,
  columns: readonly IntakeColumnProjection[],
): IntakePreviewEvidenceSection => {
  const selectedIndexes = columns.map((c) => c.index);
  const previewRows = Object.freeze(
    dataset.previewRows.map((row) => {
      const values: Record<string, string> = {};
      for (const col of columns) {
        values[col.key] = row.values[col.index] ?? "";
      }
      return Object.freeze({
        rowIndex: row.rowIndex,
        values: Object.freeze(values),
        hasFormulaRisk: row.hasFormulaRisk,
      });
    }),
  );
  const columnCoverage =
    dataset.columnCount === 0 ? 0 : columns.length / dataset.columnCount;
  const sampleCoverage =
    dataset.rowCountObserved === 0
      ? 0
      : Math.min(1, dataset.rowCountPreviewed / dataset.rowCountObserved);
  void selectedIndexes;
  return Object.freeze({
    previewRowCount: previewRows.length,
    previewRows,
    sampleCoverage,
    columnCoverage,
    isTruncated: dataset.truncated,
    evidenceScope: "ParserPreviewEvidence",
  });
};

const buildIdentity = (
  input: CreateIntakePackageInput,
  expectedIntakeId: string,
): IntakeIdentitySection => {
  const o = input.overrides;
  return Object.freeze({
    intakeId: expectedIntakeId,
    contractVersion: PIPELINE_UNDERSTANDING_CONTRACT_VERSION,
    tenantId: o?.tenantId ?? input.handoff.tenantId,
    workspaceId: o?.workspaceId ?? input.handoff.workspaceId,
    sessionId: o?.sessionId ?? input.handoff.sessionId,
    datasetId: o?.datasetId ?? input.handoff.datasetId,
    handoffId: o?.handoffId ?? input.handoff.handoffId,
    sourcePhase: "UI-PIPE-1:3",
    targetPhase: "DKL-3",
  });
};

const buildSource = (input: CreateIntakePackageInput): IntakeSourceSection => {
  const o = input.overrides;
  return Object.freeze({
    sourceMode: input.dataset.sourceMode,
    sourceName: input.dataset.datasetName,
    sourceRegistryId: o?.sourceRegistryId ?? input.dataset.sourceRegistryId,
    connectorRegistryId: o?.connectorRegistryId ?? input.dataset.connectorRegistryId,
    contentTypeRegistryId: o?.contentTypeRegistryId ?? input.dataset.contentTypeRegistryId,
    dklRegistryVersion: DataSourceKnowledgeRegistryPublicIndexVersion,
  });
};

const buildDataset = (
  input: CreateIntakePackageInput,
  selectedColumnCount: number,
): IntakeDatasetSection =>
  Object.freeze({
    datasetName: input.dataset.datasetName,
    encoding: input.dataset.encoding,
    delimiter: input.dataset.delimiter,
    hasHeader: input.dataset.hasHeader,
    columnCount: input.dataset.columnCount,
    selectedColumnCount,
    rowCountObserved: input.dataset.rowCountObserved,
    rowCountParsed: input.dataset.rowCountParsed,
    rowCountPreviewed: input.dataset.rowCountPreviewed,
    parseStatus: input.dataset.parseStatus,
    truncated: input.dataset.truncated,
    dataScope: "PreviewOnly",
  });

const buildReview = (
  input: CreateIntakePackageInput,
  selectedKeys: readonly string[],
): IntakeReviewSection => {
  const confirmed =
    input.overrides?.reviewConfirmed === false
      ? false
      : input.handoff.readyForUnderstanding === true;
  return Object.freeze({
    reviewStatus: confirmed ? "ReadyForUnderstanding" : "NotConfirmed",
    confirmed,
    selectedColumnKeys: selectedKeys,
    confirmedBy: input.confirmedBy,
    confirmationSource: "PipelinePreview",
    readyForUnderstanding: confirmed,
  });
};

const BOUNDARIES: IntakeBoundariesSection = Object.freeze({
  tenantBoundaryPreserved: true,
  workspaceBoundaryPreserved: true,
  sessionBoundaryPreserved: true,
  previewOnly: true,
  persistencePerformed: false,
  semanticUnderstandingPerformed: false,
  businessObjectMappingPerformed: false,
  aiInferencePerformed: false,
  engineReasoningPerformed: false,
});

const buildReadiness = (
  validationResults: readonly ContractValidationResult[],
  diagnostics: IntakeDiagnosticsSection,
  reviewConfirmed: boolean,
): IntakeReadinessSection => {
  const failBlocking = validationResults.filter((r) => r.status === "FAIL" && r.blocking);
  const byId = (id: string) => validationResults.find((r) => r.ruleId === id);

  const identityValid =
    byId("TenantWorkspaceSessionPresent")?.status === "PASS" &&
    byId("IdentityMatchesHandoff")?.status === "PASS" &&
    byId("DeterministicIntakeIdentity")?.status === "PASS";
  const sourceReferencesValid =
    byId("SourceRegistryReferenceResolves")?.status === "PASS" &&
    byId("ConnectorRegistryReferenceResolves")?.status === "PASS" &&
    byId("ContentTypeRegistryReferenceResolves")?.status === "PASS";
  const selectedColumnsValid =
    byId("SelectedColumnsExist")?.status === "PASS" &&
    byId("SelectedColumnsAreUnique")?.status === "PASS" &&
    byId("AtLeastOneColumnSelected")?.status === "PASS";
  const diagnosticsAcceptable = byId("NoBlockingDiagnostics")?.status === "PASS";
  const boundaryIntegrityValid =
    byId("IsolationBoundariesPreserved")?.status === "PASS" &&
    byId("NoForbiddenProcessingPerformed")?.status === "PASS";
  const contractValid = failBlocking.length === 0;
  const readyForDKL3Intake =
    contractValid &&
    identityValid &&
    sourceReferencesValid &&
    selectedColumnsValid &&
    diagnosticsAcceptable &&
    reviewConfirmed &&
    boundaryIntegrityValid &&
    byId("PreviewOnlyScopeDeclared")?.status === "PASS" &&
    byId("PreviewExplicitlyConfirmed")?.status === "PASS" &&
    byId("ReviewReadyForUnderstanding")?.status === "PASS";

  return Object.freeze({
    contractValid,
    sourceReferencesValid,
    identityValid,
    selectedColumnsValid,
    diagnosticsAcceptable,
    reviewConfirmed,
    boundaryIntegrityValid,
    readyForDKL3Intake,
    blockingIssueCount: diagnostics.diagnosticCounts.blocking,
    warningCount: diagnostics.diagnosticCounts.warning,
    nextPlatform: "DKL-3",
  });
};

const buildSummary = (
  pkg: PipelineUnderstandingIntakePackage | null,
  validationResults: readonly ContractValidationResult[],
): PipelineUnderstandingContractSummary => {
  const passCount = validationResults.filter((r) => r.status === "PASS").length;
  const failCount = validationResults.filter((r) => r.status === "FAIL").length;
  return Object.freeze({
    contractValid: pkg?.readiness.contractValid ?? false,
    readyForDKL3Intake: pkg?.readiness.readyForDKL3Intake ?? false,
    sectionCount: INTAKE_SECTION_ORDER.length,
    selectedColumnCount: pkg?.columns.length ?? 0,
    blockingIssueCount: pkg?.readiness.blockingIssueCount ?? failCount,
    warningCount: pkg?.readiness.warningCount ?? 0,
    validationPassCount: passCount,
    validationFailCount: failCount,
    dataScope: "PreviewOnly",
    targetPlatform: "DKL-3",
    nextPhase: "DKL-3:1",
  });
};

/**
 * Construct and validate the canonical Pipeline Understanding Intake Package.
 * Never mutates inputs. Never throws for ordinary invalid handoffs.
 */
export function createPipelineUnderstandingIntakePackage(
  input: CreateIntakePackageInput,
): PipelineUnderstandingIntakeResult {
  try {
    if (
      input === null ||
      typeof input !== "object" ||
      input.dataset === null ||
      typeof input.dataset !== "object" ||
      input.handoff === null ||
      typeof input.handoff !== "object"
    ) {
      return deepFreeze({
        ok: false,
        validationResults: Object.freeze([]),
        failure: Object.freeze({
          code: "INVALID_INPUT",
          message: "Dataset and confirmed handoff are required.",
        }),
        partialPackage: null,
        summary: buildSummary(null, []),
      } satisfies PipelineUnderstandingIntakeFailure);
    }

    const sessionId = input.overrides?.sessionId ?? input.handoff.sessionId;
    const datasetId = input.overrides?.datasetId ?? input.handoff.datasetId;
    const handoffId = input.overrides?.handoffId ?? input.handoff.handoffId;
    const expectedIntakeId = deriveIntakeId(sessionId, datasetId, handoffId);

    const selectedKeys = resolveSelectedKeys(input.dataset, input);
    const columns = projectColumns(input.dataset, selectedKeys);
    const previewEvidence = projectPreviewEvidence(input.dataset, columns);
    const diagnostics = projectDiagnostics(input.dataset.diagnostics);
    const identity = buildIdentity(input, expectedIntakeId);
    const source = buildSource(input);
    const dataset = buildDataset(input, columns.length);
    const review = buildReview(input, selectedKeys);

    // Temporary package for validation (readiness filled after rules run).
    const provisional: PipelineUnderstandingIntakePackage = Object.freeze({
      identity,
      source,
      dataset,
      columns,
      previewEvidence,
      diagnostics,
      review,
      boundaries: BOUNDARIES,
      readiness: Object.freeze({
        contractValid: false,
        sourceReferencesValid: false,
        identityValid: false,
        selectedColumnsValid: false,
        diagnosticsAcceptable: false,
        reviewConfirmed: input.overrides?.reviewConfirmed !== false && input.handoff.readyForUnderstanding,
        boundaryIntegrityValid: false,
        readyForDKL3Intake: false,
        blockingIssueCount: diagnostics.diagnosticCounts.blocking,
        warningCount: diagnostics.diagnosticCounts.warning,
        nextPlatform: "DKL-3" as const,
      }),
    });

    const validationResults = runValidationRules({
      input,
      pkg: provisional,
      expectedIntakeId,
      completeDiagnosticCount: input.dataset.diagnostics.length,
    });

    const reviewConfirmed =
      input.overrides?.reviewConfirmed !== false && input.handoff.readyForUnderstanding === true;
    const readiness = buildReadiness(validationResults, diagnostics, reviewConfirmed);

    const pkg: PipelineUnderstandingIntakePackage = deepFreeze({
      identity,
      source,
      dataset,
      columns,
      previewEvidence,
      diagnostics,
      review,
      boundaries: BOUNDARIES,
      readiness,
    });

    const summary = buildSummary(pkg, validationResults);

    if (readiness.readyForDKL3Intake && readiness.contractValid) {
      return deepFreeze({
        ok: true,
        package: pkg,
        validationResults,
        summary,
      } satisfies PipelineUnderstandingIntakeSuccess);
    }

    const firstFail = validationResults.find((r) => r.status === "FAIL");
    return deepFreeze({
      ok: false,
      validationResults,
      failure: Object.freeze({
        code: firstFail?.ruleId ?? "CONTRACT_VALIDATION_FAILED",
        message: firstFail?.message ?? "Contract validation failed.",
      }),
      partialPackage: pkg,
      summary,
    } satisfies PipelineUnderstandingIntakeFailure);
  } catch {
    return deepFreeze({
      ok: false,
      validationResults: Object.freeze([]),
      failure: Object.freeze({
        code: "UNEXPECTED_CONTRACT_FAILURE",
        message: "Contract construction failed without throwing to the caller.",
      }),
      partialPackage: null,
      summary: buildSummary(null, []),
    } satisfies PipelineUnderstandingIntakeFailure);
  }
}

/** Re-validate an intake package against the 18 contract rules. */
export function validatePipelineUnderstandingIntakePackage(
  pkg: PipelineUnderstandingIntakePackage,
  input: CreateIntakePackageInput,
): readonly ContractValidationResult[] {
  const expectedIntakeId = deriveIntakeId(
    pkg.identity.sessionId,
    pkg.identity.datasetId,
    pkg.identity.handoffId,
  );
  return runValidationRules({
    input,
    pkg,
    expectedIntakeId,
    completeDiagnosticCount: input.dataset.diagnostics.length,
  });
}

export function getPipelineUnderstandingContractSummary(
  result: PipelineUnderstandingIntakeResult,
): PipelineUnderstandingContractSummary {
  return result.summary;
}
