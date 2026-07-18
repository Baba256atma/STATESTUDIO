/**
 * UI-PIPE-1:3 — Deterministic fixtures for Pipeline Understanding Contract.
 *
 * No random values. No current timestamps. Ownership: UI-PIPE-1:3.
 */

import { createCsvDatasetPreview } from "../integrations/csvDatasetPreviewPlatform.ts";
import type { CanonicalParsedDataset, ParserDiagnostic } from "../integrations/csvParserTypes.ts";
import { buildPipelineUnderstandingHandoff } from "./pipelinePreviewViewModel.ts";
import type { PipelineDiagnosticCounts, PipelineIdentity } from "./pipelinePageTypes.ts";
import type { PipelineUnderstandingHandoff } from "./pipelinePreviewTypes.ts";
import type { CreateIntakePackageInput } from "./pipelineUnderstandingContractTypes.ts";

const IDENTITY: PipelineIdentity = Object.freeze({
  tenantId: "tenant-pipe-1",
  workspaceId: "workspace-pipe-1",
  sessionId: "session-pipe-1",
  developmentFallback: false,
});

const CONFIRMED_BY = "pipeline-contract-fixture-user";

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

const requireDataset = (label: string, content: string): CanonicalParsedDataset => {
  const result = createCsvDatasetPreview({
    sessionId: IDENTITY.sessionId,
    tenantId: IDENTITY.tenantId,
    workspaceId: IDENTITY.workspaceId,
    sourceMode: "CsvText",
    sourceName: label,
    encodingHint: "UTF-8",
    delimiterHint: "Comma",
    hasHeader: true,
    previewRowLimit: 50,
    strictColumnCount: false,
    datasetId: `dataset-${label}`,
    input: {
      mode: "CsvText",
      name: label,
      content,
      encodingHint: "UTF-8",
    },
  });
  if (!result.ok) {
    throw new Error(`Fixture ${label} failed to parse`);
  }
  return result.dataset;
};

const formulaRiskCount = (dataset: CanonicalParsedDataset): number =>
  dataset.columns.reduce((sum, c) => sum + c.formulaRiskCount, 0);

const buildHandoff = (
  dataset: CanonicalParsedDataset,
  selectedColumnKeys?: readonly string[],
): PipelineUnderstandingHandoff => {
  const keys = selectedColumnKeys ?? dataset.columns.map((c) => c.key);
  const handoff = buildPipelineUnderstandingHandoff({
    identity: IDENTITY,
    dataset,
    selectedColumnKeys: keys,
    diagnosticCounts: countDiagnostics(dataset.diagnostics),
    formulaRiskCount: formulaRiskCount(dataset),
  });
  if (handoff === null) {
    throw new Error("Expected handoff to build for fixture");
  }
  return handoff;
};

const withDiagnostics = (
  dataset: CanonicalParsedDataset,
  extra: readonly ParserDiagnostic[],
): CanonicalParsedDataset =>
  Object.freeze({
    ...dataset,
    diagnostics: Object.freeze([...dataset.diagnostics, ...extra]),
    parseStatus:
      extra.some((d) => d.severity === "Blocking")
        ? ("Rejected" as const)
        : extra.some((d) => d.severity === "Warning")
          ? ("ParsedWithWarnings" as const)
          : dataset.parseStatus,
  });

/** Valid CSV preview + confirmed handoff. */
export const validCsvPreviewFixture = (): CreateIntakePackageInput => {
  const dataset = requireDataset(
    "valid.csv",
    "customer_name,product,quantity\nABC Company,Laptop,10\nXYZ Inc,Monitor,4",
  );
  return Object.freeze({
    dataset,
    handoff: buildHandoff(dataset),
    confirmedBy: CONFIRMED_BY,
  });
};

/** Warning-only preview (still eligible for intake). */
export const warningOnlyPreviewFixture = (): CreateIntakePackageInput => {
  const base = requireDataset(
    "warning.csv",
    "name,value\nAlpha,1\nBeta,2",
  );
  const dataset = withDiagnostics(
    base,
    Object.freeze([
      Object.freeze({
        diagnosticId: "diag-warning-1",
        code: "PREVIEW_WARNING_SAMPLE",
        category: "Preview",
        severity: "Warning",
        message: "Sample warning for fixture.",
        field: null,
        rowIndex: 0,
        columnIndex: 0,
        recoverable: true,
      }),
    ]),
  );
  // Handoff builder allows warnings; rebuild with updated counts.
  const handoff = buildPipelineUnderstandingHandoff({
    identity: IDENTITY,
    dataset,
    selectedColumnKeys: dataset.columns.map((c) => c.key),
    diagnosticCounts: countDiagnostics(dataset.diagnostics),
    formulaRiskCount: formulaRiskCount(dataset),
  });
  if (handoff === null) {
    throw new Error("Expected warning-only handoff");
  }
  return Object.freeze({ dataset, handoff, confirmedBy: CONFIRMED_BY });
};

/** Blocking diagnostic preview (not ready for intake). */
export const blockingDiagnosticPreviewFixture = (): CreateIntakePackageInput => {
  const base = requireDataset(
    "blocking.csv",
    "name,value\nAlpha,1",
  );
  const dataset = withDiagnostics(
    base,
    Object.freeze([
      Object.freeze({
        diagnosticId: "diag-blocking-1",
        code: "PREVIEW_BLOCKING_SAMPLE",
        category: "Security",
        severity: "Blocking",
        message: "Sample blocking diagnostic.",
        field: null,
        rowIndex: null,
        columnIndex: null,
        recoverable: false,
      }),
    ]),
  );
  // Construct handoff manually — builder correctly refuses blocking cases.
  const handoff: PipelineUnderstandingHandoff = Object.freeze({
    handoffId: `handoff:${IDENTITY.sessionId}:${dataset.datasetId}`,
    tenantId: IDENTITY.tenantId,
    workspaceId: IDENTITY.workspaceId,
    sessionId: IDENTITY.sessionId,
    datasetId: dataset.datasetId,
    datasetName: dataset.datasetName,
    sourceMode: dataset.sourceMode,
    sourceRegistryId: dataset.sourceRegistryId,
    selectedColumnKeys: Object.freeze(dataset.columns.map((c) => c.key)),
    columnCount: dataset.columnCount,
    selectedColumnCount: dataset.columnCount,
    rowCountObserved: dataset.rowCountObserved,
    rowCountPreviewed: dataset.rowCountPreviewed,
    parseStatus: dataset.parseStatus,
    diagnosticCounts: countDiagnostics(dataset.diagnostics),
    blockingIssueCount: 1,
    warningCount: 0,
    formulaRiskCount: 0,
    reviewStatus: "ReadyForUnderstanding",
    readyForUnderstanding: true,
    nextPlatform: "DKL-3",
  });
  return Object.freeze({ dataset, handoff, confirmedBy: CONFIRMED_BY });
};

export const tenantMismatchFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({ tenantId: "other-tenant" }),
  });
};

export const workspaceMismatchFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({ workspaceId: "other-workspace" }),
  });
};

export const sessionMismatchFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({ sessionId: "other-session" }),
  });
};

export const datasetMismatchFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({ datasetId: "other-dataset" }),
  });
};

export const missingSelectedColumnFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({
      selectedColumnKeys: Object.freeze(["missing-column-key"]),
    }),
  });
};

export const duplicateSelectedColumnFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  const key = base.dataset.columns[0]!.key;
  return Object.freeze({
    ...base,
    overrides: Object.freeze({
      selectedColumnKeys: Object.freeze([key, key]),
    }),
  });
};

export const zeroSelectedColumnsFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({
      selectedColumnKeys: Object.freeze([]),
    }),
  });
};

export const unconfirmedReviewFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({ reviewConfirmed: false }),
  });
};

export const unresolvedSourceReferenceFixture = (): CreateIntakePackageInput => {
  const base = validCsvPreviewFixture();
  return Object.freeze({
    ...base,
    overrides: Object.freeze({
      sourceRegistryId: "dsk-datasource-does-not-exist",
    }),
  });
};

export const deselectedColumnPreviewFixture = (): CreateIntakePackageInput => {
  const dataset = requireDataset(
    "deselect.csv",
    "keep_col,drop_col,also_keep\n1,2,3\n4,5,6",
  );
  const selected = dataset.columns
    .filter((c) => c.key !== "drop_col")
    .map((c) => c.key);
  return Object.freeze({
    dataset,
    handoff: buildHandoff(dataset, selected),
    confirmedBy: CONFIRMED_BY,
  });
};

export const PipelineUnderstandingFixtures = Object.freeze({
  validCsvPreviewFixture,
  warningOnlyPreviewFixture,
  blockingDiagnosticPreviewFixture,
  tenantMismatchFixture,
  workspaceMismatchFixture,
  sessionMismatchFixture,
  datasetMismatchFixture,
  missingSelectedColumnFixture,
  duplicateSelectedColumnFixture,
  zeroSelectedColumnsFixture,
  unconfirmedReviewFixture,
  unresolvedSourceReferenceFixture,
  deselectedColumnPreviewFixture,
  IDENTITY,
  CONFIRMED_BY,
});
