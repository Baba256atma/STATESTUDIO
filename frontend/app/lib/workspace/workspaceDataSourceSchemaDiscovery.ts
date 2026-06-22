/**
 * DS-1:1 — Pure CSV schema discovery pipeline.
 * CSV → Parse Metadata → Inspect Columns → Infer Type → Build Schema Contract
 * No registry reads, no React, no scene/object/relationship writes.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX,
  WORKSPACE_DATA_SOURCE_SCHEMA_SAMPLE_VALUE_LIMIT,
  WORKSPACE_DATA_SOURCE_SCHEMA_TAGS,
  WORKSPACE_DATA_SOURCE_SCHEMA_VERSION,
  type WorkspaceDataSourceColumnSchema,
  type WorkspaceDataSourceDetectedColumnType,
  type WorkspaceDataSourceSchemaDiscoveryInput,
  type WorkspaceDataSourceSchemaProfile,
} from "./workspaceDataSourceSchemaContract.ts";

const IDENTIFIER_COLUMN_PATTERNS: readonly RegExp[] = [
  /^id$/i,
  /_id$/i,
  /_key$/i,
  /_code$/i,
  /_uuid$/i,
  /^uuid$/i,
  /^guid$/i,
  /^sku$/i,
  /identifier/i,
];

const CURRENCY_VALUE_PATTERN =
  /^(\$|€|£|¥|USD|EUR|GBP|CAD|AUD)\s*-?\d[\d,]*(\.\d+)?$|^-?\d[\d,]*(\.\d+)?\s(\$|€|£|¥|USD|EUR|GBP)$/i;
const PERCENTAGE_VALUE_PATTERN = /^-?\d+(\.\d+)?%$/;
const BOOLEAN_VALUE_PATTERN = /^(true|false|yes|no)$/i;
const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}/;
const SLASH_DATE_VALUE_PATTERN = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
const NUMERIC_VALUE_PATTERN = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
const UUID_VALUE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ParsedCsvMetadata = Readonly<{
  columnNames: readonly string[];
  dataRows: readonly (readonly string[])[];
  rowCount: number;
  columnCount: number;
}>;

export type InspectedColumn = Readonly<{
  columnName: string;
  values: readonly string[];
  rowCount: number;
}>;

export type BuildSchemaContractInput = Readonly<{
  workspaceId: string;
  dataSourceId: string;
  fileName: string;
  metadata: ParsedCsvMetadata;
  columns: readonly WorkspaceDataSourceColumnSchema[];
  discoveredAt?: string;
}>;

function emitNexoraSchemaDiscoveryDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    rowCount: number;
    columnCount: number;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("schemaDiscovery", `${NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_DATA_SOURCE_SCHEMA_TAGS,
    phase: "DS-1:1",
  });
}

export function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  if (inQuotes) {
    throw new Error("unclosed_quote");
  }

  fields.push(current);
  return fields;
}

function looksLikeIdentifierColumnName(columnName: string): boolean {
  const normalized = columnName.trim();
  return IDENTIFIER_COLUMN_PATTERNS.some((pattern) => pattern.test(normalized));
}

function detectCellType(value: string): WorkspaceDataSourceDetectedColumnType | "empty" {
  const trimmed = value.trim();
  if (!trimmed) return "empty";
  if (BOOLEAN_VALUE_PATTERN.test(trimmed)) return "boolean";
  if (PERCENTAGE_VALUE_PATTERN.test(trimmed)) return "percentage";
  if (CURRENCY_VALUE_PATTERN.test(trimmed)) return "currency";
  if (DATE_VALUE_PATTERN.test(trimmed) || SLASH_DATE_VALUE_PATTERN.test(trimmed)) return "date";
  if (NUMERIC_VALUE_PATTERN.test(trimmed)) return "number";
  if (UUID_VALUE_PATTERN.test(trimmed)) return "identifier";
  return "text";
}

function resolveColumnDetectedType(input: {
  columnName: string;
  values: readonly string[];
  uniqueValueCount: number;
  rowCount: number;
}): WorkspaceDataSourceDetectedColumnType {
  const nonEmptyValues = input.values.map((value) => value.trim()).filter((value) => value.length > 0);
  if (nonEmptyValues.length === 0) return "unknown";

  const cellTypes = nonEmptyValues.map((value) => detectCellType(value)).filter((type) => type !== "empty");
  const uniqueTypes = new Set(cellTypes);

  if (uniqueTypes.size === 1) {
    const only = [...uniqueTypes][0];
    if (looksLikeIdentifierColumnName(input.columnName)) {
      const uniquenessRatio = input.rowCount > 0 ? input.uniqueValueCount / input.rowCount : 0;
      if (uniquenessRatio >= 0.9) return "identifier";
    }
    return only ?? "unknown";
  }

  if (uniqueTypes.has("text")) return "text";
  if (uniqueTypes.size === 0) return "unknown";

  const numericLike =
    uniqueTypes.size > 0 &&
    [...uniqueTypes].every(
      (type) => type === "number" || type === "currency" || type === "percentage"
    );
  if (numericLike) return "number";

  return "unknown";
}

function buildSampleValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const samples: string[] = [];
  for (const raw of values) {
    const trimmed = raw.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    samples.push(trimmed);
    if (samples.length >= WORKSPACE_DATA_SOURCE_SCHEMA_SAMPLE_VALUE_LIMIT) break;
  }
  return Object.freeze(samples);
}

function buildColumnSchema(input: InspectedColumn): WorkspaceDataSourceColumnSchema {
  const trimmedValues = input.values.map((value) => value.trim());
  const nullCount = trimmedValues.filter((value) => value.length === 0).length;
  const nonEmptyValues = trimmedValues.filter((value) => value.length > 0);
  const uniqueValueCount = new Set(nonEmptyValues).size;
  const nullPercentage =
    input.rowCount > 0 ? Number(((nullCount / input.rowCount) * 100).toFixed(2)) : 0;

  return Object.freeze({
    columnName: input.columnName.trim(),
    detectedType: resolveColumnDetectedType({
      columnName: input.columnName,
      values: trimmedValues,
      uniqueValueCount,
      rowCount: input.rowCount,
    }),
    uniqueValueCount,
    nullPercentage,
    sampleValues: buildSampleValues(trimmedValues),
  });
}

function freezeSchema(schema: WorkspaceDataSourceSchemaProfile): WorkspaceDataSourceSchemaProfile {
  return Object.freeze({
    ...schema,
    columns: Object.freeze(
      schema.columns.map((column) =>
        Object.freeze({ ...column, sampleValues: Object.freeze([...column.sampleValues]) })
      )
    ),
  });
}

export function parseCsvMetadata(csvText: string): ParsedCsvMetadata {
  const normalized = csvText.replace(/^\uFEFF/, "");
  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("empty_csv");
  }

  const headerFields = splitCsvLine(lines[0] ?? "");
  const columnNames = Object.freeze(headerFields.map((field) => field.trim()));
  const dataRowLines = lines.slice(1).filter((line) => line.replace(/,/g, "").trim().length > 0);
  const dataRows = Object.freeze(dataRowLines.map((line) => Object.freeze(splitCsvLine(line))));

  return Object.freeze({
    columnNames,
    dataRows,
    rowCount: dataRows.length,
    columnCount: columnNames.length,
  });
}

export function inspectColumns(metadata: ParsedCsvMetadata): readonly InspectedColumn[] {
  return Object.freeze(
    metadata.columnNames.map((columnName, columnIndex) =>
      Object.freeze({
        columnName,
        values: Object.freeze(metadata.dataRows.map((row) => row[columnIndex] ?? "")),
        rowCount: metadata.rowCount,
      })
    )
  );
}

export function inferColumnTypes(columns: readonly InspectedColumn[]): readonly WorkspaceDataSourceColumnSchema[] {
  return Object.freeze(columns.map((column) => buildColumnSchema(column)));
}

export function buildSchemaContract(input: BuildSchemaContractInput): WorkspaceDataSourceSchemaProfile {
  const timestamp = input.discoveredAt ?? new Date().toISOString();
  return freezeSchema(
    Object.freeze({
      contractVersion: WORKSPACE_DATA_SOURCE_SCHEMA_VERSION,
      dataSourceId: input.dataSourceId.trim(),
      workspaceId: input.workspaceId.trim(),
      fileName: input.fileName.trim(),
      rowCount: input.metadata.rowCount,
      columnCount: input.metadata.columnCount,
      columns: Object.freeze([...input.columns]),
      discoveredAt: timestamp,
      updatedAt: timestamp,
    })
  );
}

export function discoverWorkspaceCsvSchema(
  input: WorkspaceDataSourceSchemaDiscoveryInput
): WorkspaceDataSourceSchemaProfile {
  const metadata = parseCsvMetadata(input.csvText);
  const inspectedColumns = inspectColumns(metadata);
  const columns = inferColumnTypes(inspectedColumns);
  const schema = buildSchemaContract({
    workspaceId: input.workspaceId,
    dataSourceId: input.dataSourceId,
    fileName: input.fileName,
    metadata,
    columns,
    discoveredAt: input.discoveredAt,
  });

  emitNexoraSchemaDiscoveryDiagnostic("Parse Metadata", {
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    step: "parse_metadata",
  });
  emitNexoraSchemaDiscoveryDiagnostic("Inspect Columns", {
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    step: "inspect_columns",
  });
  emitNexoraSchemaDiscoveryDiagnostic("Infer Type", {
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    step: "infer_type",
    columnTypes: schema.columns.map((column) => column.detectedType),
  });
  emitNexoraSchemaDiscoveryDiagnostic("Schema Discovered", {
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    step: "build_schema_contract",
    fileName: schema.fileName,
  });

  return schema;
}
