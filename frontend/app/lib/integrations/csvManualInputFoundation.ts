/**
 * INT-1:1 — CSV & Manual Input Integration Foundation.
 *
 * The canonical, immutable foundation for Nexora's first data-ingestion vertical
 * slice. It aggregates the integration contracts, DKL-2 source references,
 * acceptance/security policies, lifecycle, and diagnostic catalog, and publishes
 * a single deterministic foundation-level validation function. It defines the
 * safe boundary for accepting a CSV file, pasted CSV text, or a small manual
 * table — without reading files, parsing rows, persisting, or understanding
 * data. Parsing and preview belong to INT-1:2.
 *
 * Ownership: owned exclusively by INT-1. Consumes DKL-2 only through its released
 * Public Index. No classes, no async, no side effects, no I/O, no clock, no
 * randomness, no mutation.
 */

import { CsvManualInputContracts } from "./csvManualInputContracts.ts";
import {
  buildDiagnostic,
  DIAGNOSTIC_CODES,
  hasBlockingDiagnostic,
  CsvManualInputDiagnosticCatalog,
} from "./csvManualInputDiagnostics.ts";
import { CsvManualInputLifecycle } from "./csvManualInputLifecycle.ts";
import { CsvManualInputPolicies } from "./csvManualInputPolicies.ts";
import { CsvManualInputSourceReferences } from "./csvManualInputSourceIdentity.ts";
import type {
  CsvManualInputFoundationRequest,
  CsvManualInputSource,
  FoundationValidationResult,
  ImportDiagnostic,
  ImportLifecycleState,
  SourceRegistryReference,
  ValidatedFoundationSummary,
} from "./csvManualInputFoundationTypes.ts";

export { CsvManualInputContracts } from "./csvManualInputContracts.ts";
export { CsvManualInputSourceReferences } from "./csvManualInputSourceIdentity.ts";
export { CsvManualInputPolicies } from "./csvManualInputPolicies.ts";
export { CsvManualInputLifecycle } from "./csvManualInputLifecycle.ts";
export { CsvManualInputDiagnosticCatalog } from "./csvManualInputDiagnostics.ts";

/** The immutable INT-1:1 foundation version. */
export const CsvManualInputFoundationVersion = "1.0.0";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const getExtension = (fileName: string): string => {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
};

const looksLikePath = (fileName: string): boolean =>
  fileName.includes("/") || fileName.includes("\\") || fileName.includes("..");

const sourceNameOf = (input: CsvManualInputSource): string =>
  input.mode === "CsvFile" ? input.fileName : input.name;

interface ResolvedReferences {
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
  readonly references: readonly SourceRegistryReference[];
}

const referencesForMode = (input: CsvManualInputSource): ResolvedReferences => {
  const refs = CsvManualInputSourceReferences;
  if (input.mode === "ManualTable") {
    return {
      sourceRegistryId: refs.manualInputDataSource.registryEntryId,
      connectorRegistryId: refs.manualEntryConnector.registryEntryId,
      contentTypeRegistryId: refs.manualRecordContent.registryEntryId,
      references: Object.freeze([
        refs.manualInputDataSource,
        refs.manualEntryConnector,
        refs.manualRecordContent,
      ]),
    };
  }
  return {
    sourceRegistryId: refs.csvDataSource.registryEntryId,
    connectorRegistryId: refs.fileUploadConnector.registryEntryId,
    contentTypeRegistryId: refs.tabularContent.registryEntryId,
    references: Object.freeze([
      refs.csvDataSource,
      refs.fileUploadConnector,
      refs.tabularContent,
    ]),
  };
};

const validateFileInput = (
  input: Extract<CsvManualInputSource, { mode: "CsvFile" }>,
  diagnostics: ImportDiagnostic[],
): void => {
  const policy = CsvManualInputPolicies.file;
  const extension = getExtension(input.fileName);
  if (!policy.allowedExtensions.includes(extension)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.FILE_EXTENSION_UNSUPPORTED, { field: "fileName" }),
    );
  }
  if (!policy.allowedMimeTypes.includes(input.mimeType)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.FILE_MIME_UNSUPPORTED, { field: "mimeType" }),
    );
  }
  if (input.fileSizeBytes > policy.maximumFileSizeBytes) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.FILE_TOO_LARGE, { field: "fileSizeBytes" }));
  } else if (input.fileSizeBytes < policy.minimumFileSizeBytes) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.FILE_TOO_SMALL, { field: "fileSizeBytes" }));
  }
  if (looksLikePath(input.fileName)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.FILE_NAME_UNTRUSTED_PATH, { field: "fileName" }),
    );
  }
};

const validateTextInput = (
  input: Extract<CsvManualInputSource, { mode: "CsvText" }>,
  diagnostics: ImportDiagnostic[],
): void => {
  const policy = CsvManualInputPolicies.csvText;
  const length = input.content.length;
  if (length > policy.maximumCharacterCount) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.TEXT_TOO_LARGE, { field: "content" }));
  } else if (length < policy.minimumCharacterCount) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.TEXT_TOO_SMALL, { field: "content" }));
  }
};

const validateManualTableInput = (
  input: Extract<CsvManualInputSource, { mode: "ManualTable" }>,
  diagnostics: ImportDiagnostic[],
): void => {
  const policy = CsvManualInputPolicies.manualTable;
  if (input.columns.length === 0) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.TABLE_NO_COLUMNS, { field: "columns" }));
  }
  if (input.columns.length > policy.maximumColumns) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.TABLE_TOO_MANY_COLUMNS, { field: "columns" }),
    );
  }
  if (input.rows.length > policy.maximumRows) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.TABLE_TOO_MANY_ROWS, { field: "rows" }));
  }
  const scanLimit = Math.min(input.rows.length, policy.maximumRows);
  for (let rowIndex = 0; rowIndex < scanLimit; rowIndex += 1) {
    const row = input.rows[rowIndex];
    let offending = -1;
    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      if (row[columnIndex].length > policy.maximumCellCharacterCount) {
        offending = columnIndex;
        break;
      }
    }
    if (offending >= 0) {
      diagnostics.push(
        buildDiagnostic(DIAGNOSTIC_CODES.TABLE_CELL_TOO_LARGE, {
          field: "rows",
          rowIndex,
          columnIndex: offending,
        }),
      );
      break;
    }
  }
};

/**
 * Validate foundation-level concerns of an import request. Returns a
 * deterministic, immutable result. Never reads a file, parses rows, mutates the
 * request, or uses network/filesystem access. Ordinary invalid user input is
 * represented as structured diagnostics, not thrown errors.
 */
export function validateCsvManualInputFoundationRequest(
  request: CsvManualInputFoundationRequest,
): FoundationValidationResult {
  const diagnostics: ImportDiagnostic[] = [];

  if (!isNonEmptyString(request.tenantId)) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.INPUT_TENANT_REQUIRED, { field: "tenantId" }));
  }
  if (!isNonEmptyString(request.workspaceId)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.INPUT_WORKSPACE_REQUIRED, { field: "workspaceId" }),
    );
  }
  if (!isNonEmptyString(request.sessionId)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.INPUT_SESSION_REQUIRED, { field: "sessionId" }),
    );
  }
  if (!isNonEmptyString(request.createdBy)) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.INPUT_CREATED_BY_REQUIRED, { field: "createdBy" }),
    );
  }

  const input = request.input;
  const modeRecognized = CsvManualInputContracts.isRecognizedMode(input.mode);
  if (!modeRecognized) {
    diagnostics.push(buildDiagnostic(DIAGNOSTIC_CODES.INPUT_MODE_UNRECOGNIZED, { field: "mode" }));
  }

  if (!isNonEmptyString(sourceNameOf(input))) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.INPUT_SOURCE_NAME_REQUIRED, { field: "sourceName" }),
    );
  }

  if (modeRecognized) {
    if (input.mode === "CsvFile") {
      validateFileInput(input, diagnostics);
    } else if (input.mode === "CsvText") {
      validateTextInput(input, diagnostics);
    } else {
      validateManualTableInput(input, diagnostics);
    }
  }

  const startingLifecycleState: ImportLifecycleState =
    request.startingLifecycleState ?? CsvManualInputLifecycle.initialState;
  if (startingLifecycleState !== CsvManualInputLifecycle.initialState) {
    diagnostics.push(
      buildDiagnostic(DIAGNOSTIC_CODES.LIFECYCLE_INVALID_START, {
        field: "startingLifecycleState",
      }),
    );
  }

  const resolved = referencesForMode(input);
  for (const reference of resolved.references) {
    if (!reference.resolved) {
      diagnostics.push(
        buildDiagnostic(DIAGNOSTIC_CODES.REGISTRY_REFERENCE_MISSING, {
          field: reference.registryEntryId,
        }),
      );
    }
  }

  const frozenDiagnostics = Object.freeze([...diagnostics]);

  if (hasBlockingDiagnostic(frozenDiagnostics)) {
    return Object.freeze({ outcome: "Failure", diagnostics: frozenDiagnostics });
  }

  const summary: ValidatedFoundationSummary = Object.freeze({
    tenantId: request.tenantId,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    sourceMode: input.mode,
    sourceName: sourceNameOf(input),
    startingLifecycleState,
    sourceRegistryId: resolved.sourceRegistryId,
    connectorRegistryId: resolved.connectorRegistryId,
    contentTypeRegistryId: resolved.contentTypeRegistryId,
  });

  return Object.freeze({ outcome: "Success", value: summary, diagnostics: frozenDiagnostics });
}

const OWNERSHIP = Object.freeze({
  owns: Object.freeze([
    "CSV and manual-input integration contracts",
    "import-session identity",
    "file/input acceptance policies",
    "controlled parsing interfaces",
    "upload lifecycle metadata",
    "row and column preview contracts",
    "import diagnostics",
    "integration result envelopes",
    "temporary in-memory import representation",
    "source registration references to DKL-2",
  ]),
  doesNotOwn: Object.freeze([
    "semantic column understanding",
    "Business Object mapping",
    "knowledge extraction",
    "Knowledge Graph construction",
    "executive analysis",
    "permanent organizational persistence",
    "data cleaning workflows",
    "automatic decision-making",
    "source-of-truth certification",
    "live database connectors",
    "PDF or document parsing",
    "chat ingestion",
    "email ingestion",
  ]),
});

const BOUNDARIES = Object.freeze({
  tenantIsolation: true,
  workspaceIsolation: true,
  consumesDklThroughPublicIndexOnly: true,
  modifiesDklRegistries: false,
  dependencyAllowList: Object.freeze(["dataSourceKnowledgeRegistryPublicIndex.ts"]),
  security: CsvManualInputPolicies.security,
});

const READINESS = Object.freeze({
  status: "FoundationComplete",
  completion: Object.freeze([
    "FoundationComplete",
    "DklRegistryConnected",
    "TenantBoundaryProtected",
    "WorkspaceBoundaryProtected",
    "Deterministic",
    "Immutable",
    "ReadyForParser",
  ]),
  dklRegistryConnected: CsvManualInputSourceReferences.allResolved,
  tenantBoundaryProtected: true,
  workspaceBoundaryProtected: true,
  deterministic: true,
  immutable: true,
  readiness: "ReadyForParser",
  nextPhase: "INT-1:2 — CSV Parser & Dataset Preview",
});

const IDENTITY = Object.freeze({
  platformId: "INT-1",
  phaseId: "INT-1:1",
  name: "CSV & Manual Input Integration Foundation",
  namespace: "nexora.integrations.csv-manual-input",
  version: CsvManualInputFoundationVersion,
  owner: "INT-1 CSV & Manual Input Integration",
});

/** The single, deeply frozen INT-1:1 aggregate foundation. */
export const CsvManualInputFoundation = Object.freeze({
  identity: IDENTITY,
  contracts: CsvManualInputContracts,
  sourceReferences: CsvManualInputSourceReferences,
  policies: CsvManualInputPolicies,
  lifecycle: CsvManualInputLifecycle,
  diagnostics: CsvManualInputDiagnosticCatalog,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  readiness: READINESS,
});
