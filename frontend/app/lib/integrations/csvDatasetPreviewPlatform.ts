/**
 * INT-1:2 — CSV Dataset Preview Platform.
 *
 * The canonical, immutable aggregate for deterministic CSV/manual-input parsing
 * and syntactic dataset preview. Orchestrates foundation validation, input
 * normalization, encoding/delimiter resolution, record parsing, header
 * resolution, primitive-type inference, and bounded preview construction.
 *
 * Ownership: owned exclusively by INT-1:2.
 * Dependency rules: consumes INT-1:1 exclusively through csvManualInputFoundation.ts.
 * No classes, no async, no side effects, no I/O, no clock, no randomness.
 */

import {
  CsvManualInputContracts,
  CsvManualInputFoundation,
  CsvManualInputSourceReferences,
  validateCsvManualInputFoundationRequest,
} from "./csvManualInputFoundation.ts";
import { CsvDelimiterCandidates, detectCsvDelimiter } from "./csvDelimiterDetector.ts";
import {
  buildCsvDatasetPreview,
  manualTableToRecords,
} from "./csvDatasetPreviewBuilder.ts";
import {
  appendBoundedDiagnostics,
  buildParserDiagnostic,
  CsvParserDiagnosticCatalog,
  PARSER_DIAGNOSTIC_CODES,
} from "./csvParserDiagnostics.ts";
import { normalizeCsvParserInput } from "./csvInputNormalizer.ts";
import { inferCsvPrimitiveType } from "./csvPrimitiveTypeInference.ts";
import { parseCsvRecords } from "./csvRecordParser.ts";
import {
  CsvParserLimitValues,
  type CsvDatasetPreviewResult,
  type CsvParserRequest,
  type ParserDiagnostic,
} from "./csvParserTypes.ts";

export { CsvDelimiterCandidates, detectCsvDelimiter } from "./csvDelimiterDetector.ts";
export { CsvParserDiagnosticCatalog } from "./csvParserDiagnostics.ts";
export { normalizeCsvParserInput } from "./csvInputNormalizer.ts";
export { parseCsvRecords } from "./csvRecordParser.ts";
export { inferCsvPrimitiveType } from "./csvPrimitiveTypeInference.ts";

/** Canonical parser safety limits. */
export const CsvParserLimits = CsvParserLimitValues;

const PLATFORM_VERSION = "1.0.0";

const isNonEmpty = (value: string): boolean => value.trim().length > 0;

const toFoundationInput = (request: CsvParserRequest) => {
  if (request.input.mode === "ManualTable") {
    return {
      mode: "ManualTable" as const,
      name: request.input.name,
      columns: request.input.columns,
      rows: request.input.rows,
    };
  }
  // CsvText (CsvFileContent is not routed through foundation content checks).
  return {
    mode: "CsvText" as const,
    name: request.input.mode === "CsvText" ? request.input.name : request.sourceName,
    content: request.input.mode === "CsvText" ? request.input.content : "",
    encodingHint:
      request.input.mode === "CsvText" ? request.input.encodingHint : request.encodingHint,
  };
};

const resolveRegistryIds = (sourceMode: CsvParserRequest["sourceMode"]) => {
  const refs = CsvManualInputSourceReferences;
  if (sourceMode === "ManualTable") {
    return {
      sourceRegistryId: refs.manualInputDataSource.registryEntryId,
      connectorRegistryId: refs.manualEntryConnector.registryEntryId,
      contentTypeRegistryId: refs.manualRecordContent.registryEntryId,
    };
  }
  return {
    sourceRegistryId: refs.csvDataSource.registryEntryId,
    connectorRegistryId: refs.fileUploadConnector.registryEntryId,
    contentTypeRegistryId: refs.tabularContent.registryEntryId,
  };
};

const failure = (
  code: string,
  message: string,
  diagnostics: readonly ParserDiagnostic[],
  partialPreview: import("./csvParserTypes.ts").CanonicalParsedDataset | null = null,
): CsvDatasetPreviewResult =>
  Object.freeze({
    ok: false,
    failure: Object.freeze({ code, message }),
    diagnostics: Object.freeze([...diagnostics]),
    partialPreview,
  });

/**
 * Create a deterministic, deeply frozen CSV/manual dataset preview.
 * Never mutates the request. Never accesses network or filesystem.
 */
export function createCsvDatasetPreview(request: CsvParserRequest): CsvDatasetPreviewResult {
  const diagnostics: ParserDiagnostic[] = [];
  const limits = CsvParserLimits;

  if (!isNonEmpty(request.sessionId) || !isNonEmpty(request.tenantId) || !isNonEmpty(request.workspaceId)) {
    diagnostics.push(
      buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INVALID_REQUEST, {
        message: "sessionId, tenantId, and workspaceId are required.",
      }),
    );
    return failure(PARSER_DIAGNOSTIC_CODES.INVALID_REQUEST, "Missing isolation identity.", diagnostics);
  }

  if (
    request.previewRowLimit < limits.minimumPreviewRows ||
    request.previewRowLimit > limits.maximumPreviewRows
  ) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INVALID_PREVIEW_LIMIT));
    return failure(
      PARSER_DIAGNOSTIC_CODES.INVALID_PREVIEW_LIMIT,
      "previewRowLimit is outside the allowed safe range.",
      diagnostics,
    );
  }

  if (
    request.sourceMode !== "CsvText" &&
    request.sourceMode !== "CsvFileContent" &&
    request.sourceMode !== "ManualTable"
  ) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INVALID_REQUEST, { field: "sourceMode" }));
    return failure(PARSER_DIAGNOSTIC_CODES.INVALID_REQUEST, "Unrecognized source mode.", diagnostics);
  }

  // Guard against invalid direct callers via INT-1:1 foundation validation for
  // CsvText and ManualTable. CsvFileContent is parser-specific (caller-supplied
  // text/bytes); isolation identity is validated above.
  if (request.input.mode === "CsvText" || request.input.mode === "ManualTable") {
    const foundationResult = validateCsvManualInputFoundationRequest({
      tenantId: request.tenantId,
      workspaceId: request.workspaceId,
      sessionId: request.sessionId,
      createdBy: request.createdBy ?? "int-1:2-parser",
      input: toFoundationInput(request),
    });
    if (foundationResult.outcome === "Failure") {
      appendBoundedDiagnostics(
        diagnostics,
        [
          buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.FOUNDATION_REJECTED, {
            message: foundationResult.diagnostics[0]?.message ?? "Foundation rejected the request.",
          }),
        ],
        limits.maximumDiagnosticCount,
      );
      return failure(
        PARSER_DIAGNOSTIC_CODES.FOUNDATION_REJECTED,
        "INT-1:1 foundation validation rejected the request.",
        diagnostics,
      );
    }
  }

  const normalized = normalizeCsvParserInput(request.input);
  appendBoundedDiagnostics(diagnostics, normalized.diagnostics, limits.maximumDiagnosticCount);

  if (normalized.diagnostics.some((d) => d.code === PARSER_DIAGNOSTIC_CODES.UNSUPPORTED_ENCODING)) {
    return failure(
      PARSER_DIAGNOSTIC_CODES.UNSUPPORTED_ENCODING,
      "Unsupported encoding.",
      diagnostics,
    );
  }
  if (normalized.diagnostics.some((d) => d.code === PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED)) {
    return failure(PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED, "Input exceeds safety limits.", diagnostics);
  }
  if (normalized.diagnostics.some((d) => d.code === PARSER_DIAGNOSTIC_CODES.EMPTY_INPUT)) {
    return failure(PARSER_DIAGNOSTIC_CODES.EMPTY_INPUT, "Input content is empty.", diagnostics);
  }

  const registry = resolveRegistryIds(request.sourceMode);
  const datasetId = request.datasetId ?? `dataset:${request.sessionId}`;
  const delimiterHint =
    request.input.mode === "CsvFileContent" ? request.input.delimiterHint : request.delimiterHint;

  let records;
  let delimiter = delimiterHint === "Auto" ? ("Comma" as const) : delimiterHint;
  let alreadyTruncated = false;
  let encoding = normalized.encoding;

  if (normalized.isManualTable) {
    records = manualTableToRecords(normalized.manualColumns ?? [], normalized.manualRows ?? []);
    delimiter = "Comma";
    encoding = "UTF-8";
  } else {
    const detected = detectCsvDelimiter(normalized.text, delimiterHint);
    appendBoundedDiagnostics(diagnostics, detected.diagnostics, limits.maximumDiagnosticCount);
    delimiter = detected.delimiter;
    const parsed = parseCsvRecords(normalized.text, detected.character);
    appendBoundedDiagnostics(diagnostics, parsed.diagnostics, limits.maximumDiagnosticCount);
    alreadyTruncated = parsed.truncated;
    records = parsed.records;
    if (parsed.blocked) {
      return failure(
        PARSER_DIAGNOSTIC_CODES.PARSE_BLOCKED,
        "Parsing was blocked by a safety limit or syntax error.",
        diagnostics,
      );
    }
  }

  const built = buildCsvDatasetPreview({
    datasetId,
    sessionId: request.sessionId,
    tenantId: request.tenantId,
    workspaceId: request.workspaceId,
    datasetName: request.sourceName || normalized.sourceName,
    sourceMode: request.sourceMode,
    sourceRegistryId: registry.sourceRegistryId,
    connectorRegistryId: registry.connectorRegistryId,
    contentTypeRegistryId: registry.contentTypeRegistryId,
    encoding,
    delimiter,
    hasHeader: request.hasHeader,
    records,
    previewRowLimit: request.previewRowLimit,
    strictColumnCount: request.strictColumnCount,
    alreadyTruncated,
    seedDiagnostics: diagnostics,
  });

  if (built.rejected) {
    return failure(
      PARSER_DIAGNOSTIC_CODES.PARSE_BLOCKED,
      "Dataset preview rejected due to strict row-width or column limits.",
      built.dataset.diagnostics,
      built.dataset,
    );
  }

  return Object.freeze({
    ok: true,
    dataset: built.dataset,
    diagnostics: built.dataset.diagnostics,
  });
}

const OWNERSHIP = Object.freeze({
  owns: Object.freeze([
    "normalization of accepted CSV/manual input",
    "deterministic delimiter detection",
    "controlled CSV record parsing",
    "header extraction",
    "row-width diagnostics",
    "preview row truncation",
    "syntactic primitive-type inference",
    "dataset preview construction",
    "parser diagnostics",
    "immutable parse results",
  ]),
  doesNotOwn: Object.freeze([
    "file picker behavior",
    "upload transport",
    "permanent storage",
    "source registration mutation",
    "data cleaning",
    "semantic column meaning",
    "customer/product/project identification",
    "Business Object mapping",
    "knowledge relationships",
    "decision analysis",
    "user-interface rendering",
  ]),
});

const BOUNDARIES = Object.freeze({
  consumesFoundationOnly: true,
  foundationModule: "csvManualInputFoundation.ts",
  tenantIsolation: true,
  workspaceIsolation: true,
  modifiesDklRegistries: false,
  externalCsvPackages: false,
});

const READINESS = Object.freeze({
  status: "ParserComplete",
  completion: Object.freeze([
    "ParserComplete",
    "CsvParsingOperational",
    "ManualTablePreviewOperational",
    "PrimitiveInferenceOperational",
    "TenantBoundaryProtected",
    "WorkspaceBoundaryProtected",
    "Deterministic",
    "Immutable",
    "DatasetPreviewAvailable",
    "ReadyForPipelinePage",
  ]),
  readiness: "ReadyForPipelinePage",
  nextPhase: "UI-PIPE-1:1 — Pipeline Page Foundation",
  foundationVersion: CsvManualInputFoundation.identity.version,
  supportedModes: CsvManualInputContracts.inputModes,
});

/** The single, deeply frozen INT-1:2 aggregate platform. */
export const CsvDatasetPreviewPlatform = Object.freeze({
  identity: Object.freeze({
    platformId: "INT-1",
    phaseId: "INT-1:2",
    name: "CSV Parser & Dataset Preview",
    namespace: "nexora.integrations.csv-dataset-preview",
    version: PLATFORM_VERSION,
    owner: "INT-1 CSV & Manual Input Integration",
  }),
  contracts: Object.freeze({
    sourceModes: Object.freeze(["CsvText", "CsvFileContent", "ManualTable"] as const),
    encodings: Object.freeze(["UTF-8", "UTF-8-BOM", "UTF-16LE", "UTF-16BE", "Unknown"] as const),
    delimiters: Object.freeze(["Comma", "Semicolon", "Tab", "Pipe", "Auto"] as const),
    primitiveTypes: Object.freeze([
      "String",
      "Integer",
      "Decimal",
      "Boolean",
      "Date",
      "DateTime",
      "Unknown",
    ] as const),
    parseStatuses: Object.freeze(["Parsed", "ParsedWithWarnings", "Rejected", "Truncated"] as const),
  }),
  limits: CsvParserLimits,
  delimiterDetection: Object.freeze({
    candidates: CsvDelimiterCandidates,
    detect: detectCsvDelimiter,
  }),
  recordParsing: Object.freeze({
    parse: parseCsvRecords,
  }),
  typeInference: Object.freeze({
    infer: inferCsvPrimitiveType,
  }),
  previewBuilder: Object.freeze({
    create: createCsvDatasetPreview,
  }),
  diagnostics: CsvParserDiagnosticCatalog,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  readiness: READINESS,
});
