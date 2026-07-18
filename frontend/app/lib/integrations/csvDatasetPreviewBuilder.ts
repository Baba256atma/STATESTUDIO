/**
 * INT-1:2 — Dataset Preview Builder.
 *
 * Resolves headers, normalizes row widths, applies syntactic type inference,
 * builds bounded preview rows, and assembles the canonical immutable parsed
 * dataset. No semantic renaming. No Business Object conversion.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import {
  appendBoundedDiagnostics,
  buildParserDiagnostic,
  PARSER_DIAGNOSTIC_CODES,
} from "./csvParserDiagnostics.ts";
import {
  inferCsvPrimitiveType,
  isFormulaRiskValue,
} from "./csvPrimitiveTypeInference.ts";
import {
  CsvParserLimitValues,
  type CanonicalParsedDataset,
  type CsvParserSourceMode,
  type DelimiterHint,
  type EncodingHint,
  type HeaderResolutionResult,
  type ParsedColumnPreview,
  type ParsedPreviewRow,
  type ParsedRecord,
  type ParserDiagnostic,
  type ParseStatus,
  type ResolvedHeader,
} from "./csvParserTypes.ts";

const SAMPLE_VALUE_LIMIT = 5;

const slugify = (value: string): string => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug.length > 0 ? slug : "";
};

export const resolveHeaders = (
  records: readonly ParsedRecord[],
  hasHeader: boolean,
): HeaderResolutionResult => {
  const diagnostics: ParserDiagnostic[] = [];

  if (!hasHeader) {
    const width =
      records.find((r) => r.fields.length > 0)?.fields.length ?? 0;
    const headers: ResolvedHeader[] = [];
    for (let index = 0; index < width; index += 1) {
      const displayName = `Column ${index + 1}`;
      headers.push(
        Object.freeze({
          index,
          key: `column_${index + 1}`,
          originalName: displayName,
          displayName,
        }),
      );
    }
    return Object.freeze({
      headers: Object.freeze(headers),
      dataStartIndex: 0,
      diagnostics: Object.freeze(diagnostics),
    });
  }

  const headerRecord = records[0];
  if (headerRecord === undefined) {
    return Object.freeze({
      headers: Object.freeze([]),
      dataStartIndex: 0,
      diagnostics: Object.freeze(diagnostics),
    });
  }

  const usedKeys = new Map<string, number>();
  const headers: ResolvedHeader[] = [];
  for (let index = 0; index < headerRecord.fields.length; index += 1) {
    const originalName = headerRecord.fields[index]!;
    const trimmed = originalName.trim();
    let baseKey = slugify(trimmed);
    if (baseKey.length === 0) {
      baseKey = `column_${index + 1}`;
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.EMPTY_HEADER, {
          columnIndex: index,
          field: originalName,
        }),
      );
    }
    const seen = usedKeys.get(baseKey) ?? 0;
    usedKeys.set(baseKey, seen + 1);
    const key = seen === 0 ? baseKey : `${baseKey}_${seen + 1}`;
    if (seen > 0) {
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.DUPLICATE_HEADER, {
          columnIndex: index,
          field: originalName,
        }),
      );
    }
    headers.push(
      Object.freeze({
        index,
        key,
        originalName,
        displayName: trimmed.length > 0 ? trimmed : `Column ${index + 1}`,
      }),
    );
  }

  return Object.freeze({
    headers: Object.freeze(headers),
    dataStartIndex: 1,
    diagnostics: Object.freeze(diagnostics),
  });
};

interface NormalizedRow {
  readonly values: readonly string[];
  readonly diagnostics: readonly ParserDiagnostic[];
  readonly formulaRiskFlags: readonly boolean[];
}

const normalizeRowWidth = (
  fields: readonly string[],
  expectedWidth: number,
  rowIndex: number,
  strictColumnCount: boolean,
  maxColumns: number,
): NormalizedRow => {
  const diagnostics: ParserDiagnostic[] = [];
  const capped = fields.slice(0, maxColumns);
  let values: string[];

  if (capped.length < expectedWidth) {
    values = [...capped];
    while (values.length < expectedWidth) {
      values.push("");
    }
    diagnostics.push(
      buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.ROW_TOO_SHORT, {
        rowIndex,
        severity: "Warning",
      }),
    );
  } else if (capped.length > expectedWidth) {
    values = capped.slice(0, expectedWidth);
    diagnostics.push(
      buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.ROW_TOO_LONG, {
        rowIndex,
        severity: strictColumnCount ? "Error" : "Warning",
      }),
    );
  } else {
    values = [...capped];
  }

  const formulaRiskFlags = values.map((value) => isFormulaRiskValue(value));
  for (let columnIndex = 0; columnIndex < formulaRiskFlags.length; columnIndex += 1) {
    if (formulaRiskFlags[columnIndex]) {
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.FORMULA_RISK, {
          rowIndex,
          columnIndex,
        }),
      );
    }
  }

  return {
    values: Object.freeze(values),
    diagnostics: Object.freeze(diagnostics),
    formulaRiskFlags: Object.freeze(formulaRiskFlags),
  };
};

export interface PreviewBuildInput {
  readonly datasetId: string;
  readonly sessionId: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly datasetName: string;
  readonly sourceMode: CsvParserSourceMode;
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
  readonly encoding: EncodingHint;
  readonly delimiter: DelimiterHint;
  readonly hasHeader: boolean;
  readonly records: readonly ParsedRecord[];
  readonly previewRowLimit: number;
  readonly strictColumnCount: boolean;
  readonly alreadyTruncated: boolean;
  readonly seedDiagnostics: readonly ParserDiagnostic[];
}

export interface PreviewBuildResult {
  readonly dataset: CanonicalParsedDataset;
  readonly rejected: boolean;
}

/**
 * Build a deeply frozen canonical parsed dataset + preview from parsed records.
 */
export function buildCsvDatasetPreview(input: PreviewBuildInput): PreviewBuildResult {
  const limits = CsvParserLimitValues;
  const diagnostics: ParserDiagnostic[] = [];
  appendBoundedDiagnostics(diagnostics, input.seedDiagnostics, limits.maximumDiagnosticCount);

  const headerResult = resolveHeaders(input.records, input.hasHeader);
  appendBoundedDiagnostics(diagnostics, headerResult.diagnostics, limits.maximumDiagnosticCount);

  let expectedWidth = headerResult.headers.length;
  if (expectedWidth === 0) {
    const firstData = input.records
      .slice(headerResult.dataStartIndex)
      .find((r) => r.fields.length > 0);
    expectedWidth = firstData?.fields.length ?? 0;
  }

  if (expectedWidth > limits.maximumParsedColumns) {
    appendBoundedDiagnostics(
      diagnostics,
      [buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.COLUMN_LIMIT_EXCEEDED)],
      limits.maximumDiagnosticCount,
    );
    const emptyDataset = Object.freeze({
      datasetId: input.datasetId,
      sessionId: input.sessionId,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      datasetName: input.datasetName,
      sourceMode: input.sourceMode,
      sourceRegistryId: input.sourceRegistryId,
      connectorRegistryId: input.connectorRegistryId,
      contentTypeRegistryId: input.contentTypeRegistryId,
      encoding: input.encoding,
      delimiter: input.delimiter,
      hasHeader: input.hasHeader,
      columnCount: 0,
      rowCountObserved: 0,
      rowCountParsed: 0,
      rowCountPreviewed: 0,
      columns: Object.freeze([]),
      previewRows: Object.freeze([]),
      diagnostics: Object.freeze([...diagnostics]),
      truncated: false,
      parseStatus: "Rejected" as const,
    });
    return { dataset: emptyDataset, rejected: true };
  }

  // Ensure header list covers expected width when headerless and inferred later.
  let headers = headerResult.headers;
  if (headers.length === 0 && expectedWidth > 0) {
    const generated: ResolvedHeader[] = [];
    for (let index = 0; index < expectedWidth; index += 1) {
      const displayName = `Column ${index + 1}`;
      generated.push(
        Object.freeze({
          index,
          key: `column_${index + 1}`,
          originalName: displayName,
          displayName,
        }),
      );
    }
    headers = Object.freeze(generated);
  }

  const dataRecords = input.records.slice(headerResult.dataStartIndex);
  const normalizedRows: NormalizedRow[] = [];
  let rejectedForWidth = false;

  for (let i = 0; i < dataRecords.length; i += 1) {
    const record = dataRecords[i]!;
    appendBoundedDiagnostics(diagnostics, record.diagnostics, limits.maximumDiagnosticCount);
    const normalized = normalizeRowWidth(
      record.fields,
      expectedWidth,
      i,
      input.strictColumnCount,
      limits.maximumParsedColumns,
    );
    appendBoundedDiagnostics(diagnostics, normalized.diagnostics, limits.maximumDiagnosticCount);
    if (
      input.strictColumnCount &&
      normalized.diagnostics.some((d) => d.code === PARSER_DIAGNOSTIC_CODES.ROW_TOO_LONG)
    ) {
      rejectedForWidth = true;
    }
    normalizedRows.push(normalized);
  }

  const previewLimit = Math.min(
    Math.max(input.previewRowLimit, limits.minimumPreviewRows),
    limits.maximumPreviewRows,
  );
  const previewSource = normalizedRows.slice(0, previewLimit);
  const previewTruncated = normalizedRows.length > previewLimit;
  if (previewTruncated) {
    appendBoundedDiagnostics(
      diagnostics,
      [buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.PREVIEW_TRUNCATED)],
      limits.maximumDiagnosticCount,
    );
  }

  const columns: ParsedColumnPreview[] = [];
  for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
    const header = headers[columnIndex]!;
    const columnValues = normalizedRows.map((row) => row.values[columnIndex] ?? "");
    const sampleValues: string[] = [];
    let emptyValueCount = 0;
    let formulaRiskCount = 0;
    const diagnosticIds: string[] = [];

    for (let rowIndex = 0; rowIndex < columnValues.length; rowIndex += 1) {
      const value = columnValues[rowIndex]!;
      if (value.trim().length === 0) {
        emptyValueCount += 1;
      } else if (sampleValues.length < SAMPLE_VALUE_LIMIT) {
        sampleValues.push(value);
      }
      if (normalizedRows[rowIndex]?.formulaRiskFlags[columnIndex]) {
        formulaRiskCount += 1;
      }
    }

    for (const d of diagnostics) {
      if (d.columnIndex === columnIndex && diagnosticIds.length < 20) {
        diagnosticIds.push(d.diagnosticId);
      }
    }

    columns.push(
      Object.freeze({
        index: columnIndex,
        key: header.key,
        originalName: header.originalName,
        displayName: header.displayName,
        primitiveType: inferCsvPrimitiveType(sampleValues),
        sampleValues: Object.freeze(sampleValues),
        nonEmptySampleCount: sampleValues.length,
        emptyValueCount,
        formulaRiskCount,
        diagnosticIds: Object.freeze(diagnosticIds),
      }),
    );
  }

  const previewRows: ParsedPreviewRow[] = previewSource.map((row, index) =>
    Object.freeze({
      rowIndex: index,
      values: row.values,
      cellDiagnostics: row.diagnostics,
      hasFormulaRisk: row.formulaRiskFlags.some(Boolean),
    }),
  );

  const truncated = input.alreadyTruncated || previewTruncated;
  let parseStatus: ParseStatus;
  if (rejectedForWidth) {
    parseStatus = "Rejected";
  } else if (truncated && diagnostics.some((d) => d.code === PARSER_DIAGNOSTIC_CODES.ROW_LIMIT_EXCEEDED)) {
    parseStatus = "Truncated";
  } else if (
    diagnostics.some(
      (d) =>
        d.severity === "Warning" ||
        d.severity === "Error" ||
        d.code === PARSER_DIAGNOSTIC_CODES.PREVIEW_TRUNCATED,
    )
  ) {
    parseStatus = truncated && !previewTruncated ? "Truncated" : "ParsedWithWarnings";
  } else if (truncated) {
    parseStatus = "Truncated";
  } else {
    parseStatus = "Parsed";
  }

  const dataset: CanonicalParsedDataset = Object.freeze({
    datasetId: input.datasetId,
    sessionId: input.sessionId,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    datasetName: input.datasetName,
    sourceMode: input.sourceMode,
    sourceRegistryId: input.sourceRegistryId,
    connectorRegistryId: input.connectorRegistryId,
    contentTypeRegistryId: input.contentTypeRegistryId,
    encoding: input.encoding,
    delimiter: input.delimiter,
    hasHeader: input.hasHeader,
    columnCount: columns.length,
    rowCountObserved: normalizedRows.length,
    rowCountParsed: normalizedRows.length,
    rowCountPreviewed: previewRows.length,
    columns: Object.freeze(columns),
    previewRows: Object.freeze(previewRows),
    diagnostics: Object.freeze([...diagnostics]),
    truncated,
    parseStatus,
  });

  return { dataset, rejected: rejectedForWidth };
}

/**
 * Convert a validated manual table directly into parsed records (no delimiter parsing).
 */
export function manualTableToRecords(
  columns: readonly string[],
  rows: readonly (readonly string[])[],
): readonly ParsedRecord[] {
  const header: ParsedRecord = Object.freeze({
    fields: Object.freeze([...columns]),
    recordIndex: 0,
    unclosedQuote: false,
    diagnostics: Object.freeze([]),
  });
  const data = rows.map((row, index) =>
    Object.freeze({
      fields: Object.freeze([...row]),
      recordIndex: index + 1,
      unclosedQuote: false,
      diagnostics: Object.freeze([]),
    }),
  );
  return Object.freeze([header, ...data]);
}
