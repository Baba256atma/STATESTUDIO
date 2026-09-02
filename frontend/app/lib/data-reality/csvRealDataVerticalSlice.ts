/**
 * RDI:2 — CSV Real Data Vertical Slice.
 *
 * Local CSV parsing and deterministic mapping only. Executive meaning is
 * delegated to the existing RDI:1 → P0 Data Reality → Runtime/Stage/Advisor
 * chain; this module never owns KPI thresholds or presentation rules.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  adaptNexoraDataSource,
  createNexoraDataRealityHandoff,
  type NexoraDataRealityFactProvenance,
  type NexoraDataRealityHandoff,
  type NexoraDataRealityMapper,
  type NexoraDataSource,
  type NexoraDataSourceAdapter,
  type NexoraDataSourceProvenance,
  type NexoraDataSourceSnapshot,
  type NexoraSourceRecord,
  type NexoraSourceValue,
} from "./realDataIntegrationFoundation.ts";
import type {
  NexoraDataRealitySnapshot,
  NexoraDataset,
  NexoraDatasetRecord,
  NexoraDatasetScenario,
} from "./dataRealityContracts.ts";
import {
  buildDataRealitySnapshot,
  computeDatasetKPIReality,
  normalizeDatasetToBusinessFacts,
  resolveDatasetExecutiveReality,
  type NexoraDatasetExecutiveRealityResult,
} from "./dataRealityFoundation.ts";
import {
  getExecutiveOperationsResolvedObjectBindings,
} from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";
import {
  projectDataRealityToExecutiveRuntime,
  type NexoraDataRealityStageProjectionResult,
} from "./dataRealityStageProjection.ts";
import {
  resolveDataRealityExecutiveAdvisorIntegration,
  type DataRealityExecutiveAdvisorIntegrationResult,
} from "./dataRealityExecutiveAdvisorIntegration.ts";

export const csvRealDataVerticalSliceIdentity =
  "RDI:2/NexoraCsvRealDataVerticalSlice" as const;
export const csvRealDataVerticalSliceVersion = "1.0.0" as const;
export const csvRealDataVerticalSliceNamespace =
  "nexora.real-data-integration.csv-vertical-slice" as const;

export const CSV_IMPORT_FLOW_STATES = Object.freeze([
  "idle",
  "file-selected",
  "parsing",
  "preview",
  "mapping",
  "validating",
  "ready",
  "importing",
  "completed",
  "error",
] as const);
export type CsvImportFlowState = (typeof CSV_IMPORT_FLOW_STATES)[number];

export const CSV_COLUMN_MAPPING_STATUSES = Object.freeze([
  "recognized",
  "suggested",
  "unmapped",
  "unsupported",
] as const);
export type CsvColumnMappingStatus =
  (typeof CSV_COLUMN_MAPPING_STATUSES)[number];

export type CsvCellValue = NexoraSourceValue;
export type CsvParseIssue = Readonly<{
  code:
    | "EMPTY_FILE"
    | "MISSING_HEADER"
    | "DUPLICATE_COLUMN"
    | "MALFORMED_QUOTE"
    | "MALFORMED_ROW";
  message: string;
  row: number | null;
  column: number | null;
}>;

export type ParsedCsvColumn = Readonly<{
  index: number;
  name: string;
  normalizedName: string;
}>;

export type ParsedCsvRecord = Readonly<{
  recordId: string;
  rowNumber: number;
  values: readonly CsvCellValue[];
}>;

export type CsvParseResult = Readonly<{
  valid: boolean;
  columns: readonly ParsedCsvColumn[];
  records: readonly ParsedCsvRecord[];
  issues: readonly CsvParseIssue[];
}>;

export type CsvMappingTarget = Readonly<{
  targetId: string;
  label: string;
  objectKey: string | null;
  metricKey: string | null;
  unit: string | null;
  aggregation: "sum" | "last" | "metadata";
  aliases: readonly string[];
}>;

export type CsvColumnMapping = Readonly<{
  columnIndex: number;
  sourceColumn: string;
  status: CsvColumnMappingStatus;
  targetId: string | null;
  targetLabel: string | null;
  confirmed: boolean;
  ignored: boolean;
  reason: string;
  /** DATA-UX:3 enrichment on the authoritative RDI field mapping; never Evidence. */
  semantic?: CsvFieldSemanticUnderstanding;
}>;

export const CSV_SEMANTIC_STATES = Object.freeze([
  "UNDERSTOOD",
  "LIKELY",
  "AMBIGUOUS",
  "UNKNOWN",
  "CONFLICTING",
] as const);
export type CsvSemanticState = (typeof CSV_SEMANTIC_STATES)[number];
export type CsvSemanticConfirmationSource =
  | "authoritative-mapping"
  | "manager"
  | "none";
export type CsvStructuralDataType = "number" | "text" | "date" | "mixed" | "empty";

export type CsvFieldSemanticUnderstanding = Readonly<{
  fieldId: string;
  workspaceId: WorkspaceId;
  sourceContextId: string;
  sourceColumn: string;
  structuralType: CsvStructuralDataType;
  representativeValues: readonly string[];
  state: CsvSemanticState;
  proposedMeaning: string | null;
  confirmedMeaning: string | null;
  confirmedTargetId: string | null;
  confirmationSource: CsvSemanticConfirmationSource;
  unit: string | null;
  material: boolean;
  unresolvedReason: string | null;
  interpretationBasis: readonly string[];
  priorMeaning: string | null;
  schemaCompatibility: "new" | "compatible" | "renamed" | "datatype-changed" | "unit-changed" | "context-changed";
  authority: typeof csvRealDataVerticalSliceIdentity;
}>;

export type CsvMappingReview = Readonly<{
  mappingId: string;
  mappings: readonly CsvColumnMapping[];
  readyForValidation: boolean;
  recognizedCount: number;
  suggestedCount: number;
  ignoredCount: number;
  unresolvedCount: number;
}>;

export type CsvVerticalSliceInput = Readonly<{
  workspaceId: WorkspaceId;
  fileName: string;
  fileSize: number;
  csvText: string;
  importId: string;
  importedAt: string;
  observedAt?: string;
  sourceContextId?: string;
  scenario?: NexoraDatasetScenario;
}>;

export type CsvPreparedImport = Readonly<{
  ready: boolean;
  workspaceId: WorkspaceId;
  sourceContextId: string;
  importId: string;
  fileName: string;
  fileSize: number;
  parse: CsvParseResult;
  mapping: CsvMappingReview;
  snapshot: NexoraDataSourceSnapshot | null;
  handoff: NexoraDataRealityHandoff | null;
  dataReality: NexoraDatasetExecutiveRealityResult | null;
  runtime: NexoraDataRealityStageProjectionResult | null;
  advisor: DataRealityExecutiveAdvisorIntegrationResult | null;
  summary: CsvExecutiveImportSummary | null;
  errors: readonly string[];
}>;

export type CsvExecutiveImportSummary = Readonly<{
  headline: "Data connected";
  importedRecordCount: number;
  recognizedMeanings: readonly string[];
  updatedObjectCount: number;
  attentionObjectCount: number;
  criticalObjectCount: number;
  ignoredColumnCount: number;
}>;

function freezeIssue(issue: CsvParseIssue): CsvParseIssue {
  return Object.freeze({ ...issue });
}

function normalizeColumnName(value: string): string {
  return value.trim().toLowerCase().replace(/[%]/g, " percent ")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

export function csvCanonicalSourceContextId(
  workspaceId: WorkspaceId,
  fileName: string,
  explicitSourceContextId?: string,
): string {
  return explicitSourceContextId ?? `csv:${workspaceId}:${normalizeColumnName(fileName).replace(/ /g, "-")}`;
}

function parseCell(raw: string): CsvCellValue {
  const value = raw.trim();
  if (value.length === 0) return null;
  const numeric = value.replace(/[$£€,\s]/g, "");
  if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%$/.test(numeric)) {
    return Number(numeric.slice(0, -1));
  }
  if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(numeric)) {
    const numberValue = Number(numeric);
    return Number.isFinite(numberValue) ? numberValue : value;
  }
  return value;
}

/** RFC-4180-shaped parser with deterministic, explainable failure output. */
export function parseCsvDeterministically(csvText: string): CsvParseResult {
  const issues: CsvParseIssue[] = [];
  if (csvText.trim().length === 0) {
    return Object.freeze({
      valid: false,
      columns: Object.freeze([]),
      records: Object.freeze([]),
      issues: Object.freeze([freezeIssue({ code: "EMPTY_FILE", message: "The CSV file is empty.", row: null, column: null })]),
    });
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index]!;
    if (quoted) {
      if (char === '"') {
        if (csvText[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (quoted) {
    issues.push(freezeIssue({ code: "MALFORMED_QUOTE", message: "A quoted field is not closed.", row: rows.length + 1, column: row.length + 1 }));
  }
  row.push(field.replace(/\r$/, ""));
  if (row.some((entry) => entry.length > 0) || rows.length === 0) rows.push(row);

  const header = rows[0]?.map((entry) => entry.trim()) ?? [];
  if (header.length === 0 || header.every((entry) => entry.length === 0)) {
    issues.push(freezeIssue({ code: "MISSING_HEADER", message: "A header row is required.", row: 1, column: null }));
  }
  const normalizedHeaders = header.map(normalizeColumnName);
  const seen = new Map<string, number>();
  normalizedHeaders.forEach((name, index) => {
    if (!name) {
      issues.push(freezeIssue({ code: "MISSING_HEADER", message: `Column ${index + 1} has no name.`, row: 1, column: index + 1 }));
    } else if (seen.has(name)) {
      issues.push(freezeIssue({ code: "DUPLICATE_COLUMN", message: `Column name "${header[index]}" is duplicated.`, row: 1, column: index + 1 }));
    } else {
      seen.set(name, index);
    }
  });

  const columns = Object.freeze(header.map((name, index) => Object.freeze({ index, name, normalizedName: normalizedHeaders[index] ?? "" })));
  const records: ParsedCsvRecord[] = [];
  rows.slice(1).forEach((values, index) => {
    if (values.length === 1 && values[0]?.trim() === "") return;
    if (values.length !== header.length) {
      issues.push(freezeIssue({ code: "MALFORMED_ROW", message: `Row ${index + 2} has ${values.length} fields; expected ${header.length}.`, row: index + 2, column: null }));
      return;
    }
    records.push(Object.freeze({
      recordId: `row-${index + 2}`,
      rowNumber: index + 2,
      values: Object.freeze(values.map(parseCell)),
    }));
  });

  if (records.length === 0 && !issues.some((entry) => entry.code === "EMPTY_FILE")) {
    issues.push(freezeIssue({ code: "EMPTY_FILE", message: "The CSV contains no data rows.", row: null, column: null }));
  }
  return Object.freeze({ valid: issues.length === 0, columns, records: Object.freeze(records), issues: Object.freeze(issues) });
}

export const CSV_MAPPING_TARGETS: readonly CsvMappingTarget[] = Object.freeze([
  Object.freeze({ targetId: "date", label: "Date", objectKey: null, metricKey: null, unit: null, aggregation: "metadata" as const, aliases: Object.freeze(["date", "observed at", "period", "day"]) }),
  Object.freeze({ targetId: "revenue.current", label: "Current Revenue", objectKey: "revenue", metricKey: "currentRevenue", unit: "USD", aggregation: "sum" as const, aliases: Object.freeze(["current revenue", "revenue", "sales", "sales revenue"]) }),
  Object.freeze({ targetId: "revenue.previous", label: "Previous Revenue", objectKey: "revenue", metricKey: "previousRevenue", unit: "USD", aggregation: "sum" as const, aliases: Object.freeze(["previous revenue", "prior revenue", "prior sales", "previous sales"]) }),
  Object.freeze({ targetId: "cost.operating", label: "Operating Cost", objectKey: "cost", metricKey: "operatingCost", unit: "USD", aggregation: "sum" as const, aliases: Object.freeze(["operating cost", "cost", "costs", "operating expense"]) }),
  Object.freeze({ targetId: "production.used", label: "Production Used Capacity", objectKey: "production", metricKey: "usedCapacity", unit: "units", aggregation: "last" as const, aliases: Object.freeze(["production used capacity", "production rate", "used capacity", "production used"]) }),
  Object.freeze({ targetId: "production.total", label: "Production Total Capacity", objectKey: "production", metricKey: "totalCapacity", unit: "units", aggregation: "last" as const, aliases: Object.freeze(["production total capacity", "production capacity", "total capacity"]) }),
  Object.freeze({ targetId: "warehouse.used", label: "Warehouse Used Capacity", objectKey: "warehouse", metricKey: "usedCapacity", unit: "units", aggregation: "last" as const, aliases: Object.freeze(["warehouse used capacity", "inventory used", "warehouse used"]) }),
  Object.freeze({ targetId: "warehouse.total", label: "Warehouse Total Capacity", objectKey: "warehouse", metricKey: "totalCapacity", unit: "units", aggregation: "last" as const, aliases: Object.freeze(["warehouse total capacity", "warehouse capacity", "inventory capacity"]) }),
  Object.freeze({ targetId: "shipping.on-time", label: "On-Time Deliveries", objectKey: "shipping", metricKey: "onTimeDeliveries", unit: "deliveries", aggregation: "sum" as const, aliases: Object.freeze(["on time deliveries", "ontime deliveries", "on time orders"]) }),
  Object.freeze({ targetId: "shipping.total", label: "Total Deliveries", objectKey: "shipping", metricKey: "totalDeliveries", unit: "deliveries", aggregation: "sum" as const, aliases: Object.freeze(["total deliveries", "deliveries", "shipped orders"]) }),
  Object.freeze({ targetId: "customer.score", label: "Customer Satisfaction", objectKey: "customer", metricKey: "satisfactionScore", unit: "score", aggregation: "last" as const, aliases: Object.freeze(["customer satisfaction", "satisfaction score", "customer score"]) }),
  Object.freeze({ targetId: "customer.maximum", label: "Maximum Satisfaction Score", objectKey: "customer", metricKey: "maximumSatisfactionScore", unit: "score", aggregation: "last" as const, aliases: Object.freeze(["maximum satisfaction score", "max satisfaction score", "maximum score"]) }),
]);

function canonicalMetricName(target: CsvMappingTarget): string {
  return target.metricKey ? normalizeColumnName(target.metricKey) : normalizeColumnName(target.label);
}

export function suggestCsvColumnMappings(columns: readonly ParsedCsvColumn[], importId: string): CsvMappingReview {
  const mappings = columns.map((column): CsvColumnMapping => {
    const exact = CSV_MAPPING_TARGETS.find((target) => canonicalMetricName(target) === column.normalizedName || normalizeColumnName(target.label) === column.normalizedName);
    if (exact) return Object.freeze({ columnIndex: column.index, sourceColumn: column.name, status: "recognized", targetId: exact.targetId, targetLabel: exact.label, confirmed: true, ignored: false, reason: "Exact canonical Data Reality name." });
    const alias = CSV_MAPPING_TARGETS.find((target) => target.aliases.some((entry) => normalizeColumnName(entry) === column.normalizedName));
    if (alias) return Object.freeze({ columnIndex: column.index, sourceColumn: column.name, status: "suggested", targetId: alias.targetId, targetLabel: alias.label, confirmed: false, ignored: false, reason: "Known deterministic alias; confirmation required." });
    const unsupported = /^(id|name|description|notes?|comment|orders?)$/.test(column.normalizedName);
    return Object.freeze({ columnIndex: column.index, sourceColumn: column.name, status: unsupported ? "unsupported" : "unmapped", targetId: null, targetLabel: null, confirmed: false, ignored: false, reason: unsupported ? "No existing executive fact owns this column." : "No deterministic Data Reality meaning was found." });
  });
  return buildCsvMappingReview(`rdi2:mapping:${importId}`, mappings);
}

export function buildCsvMappingReview(mappingId: string, mappings: readonly CsvColumnMapping[]): CsvMappingReview {
  const frozen = Object.freeze(mappings.map((entry) => Object.freeze({ ...entry })));
  const unresolvedCount = frozen.filter((entry) => !entry.ignored && (!entry.targetId || !entry.confirmed)).length;
  return Object.freeze({
    mappingId,
    mappings: frozen,
    readyForValidation: unresolvedCount === 0 && frozen.some((entry) => entry.confirmed && entry.targetId),
    recognizedCount: frozen.filter((entry) => entry.status === "recognized" && !entry.ignored).length,
    suggestedCount: frozen.filter((entry) => entry.status === "suggested" && !entry.ignored).length,
    ignoredCount: frozen.filter((entry) => entry.ignored).length,
    unresolvedCount,
  });
}

export function updateCsvColumnMapping(
  review: CsvMappingReview,
  columnIndex: number,
  targetId: string | null,
): CsvMappingReview {
  const target = targetId ? CSV_MAPPING_TARGETS.find((entry) => entry.targetId === targetId) ?? null : null;
  const mappings = review.mappings.map((entry): CsvColumnMapping => {
    if (entry.columnIndex !== columnIndex) return entry;
    if (!target) return Object.freeze({
      ...entry,
      targetId: null,
      targetLabel: null,
      confirmed: true,
      ignored: true,
      reason: "Ignored by user.",
      ...(entry.semantic ? { semantic: Object.freeze({ ...entry.semantic, material: false, unresolvedReason: null }) } : {}),
    });
    return Object.freeze({
      ...entry,
      targetId: target.targetId,
      targetLabel: target.label,
      confirmed: true,
      ignored: false,
      status: entry.targetId === target.targetId ? entry.status : "suggested",
      reason: "Confirmed by user.",
      ...(entry.semantic ? { semantic: Object.freeze({
        ...entry.semantic,
        state: "UNDERSTOOD" as const,
        confirmedMeaning: target.label,
        confirmedTargetId: target.targetId,
        confirmationSource: "manager" as const,
        unresolvedReason: null,
      }) } : {}),
    });
  });
  return buildCsvMappingReview(review.mappingId, mappings);
}

function provenance(input: CsvVerticalSliceInput, recordId: string | null, fieldKey: string | null, transformationRef: string | null): NexoraDataSourceProvenance {
  return Object.freeze({
    sourceId: csvCanonicalSourceContextId(input.workspaceId, input.fileName, input.sourceContextId),
    sourceType: "csv",
    providerName: "local-csv",
    sourceRecordId: recordId,
    sourceFieldKey: fieldKey,
    observedAt: input.observedAt ?? input.importedAt,
    importedAt: input.importedAt,
    transformationRef,
    confidenceState: "verified" as const,
    confidence: 1,
  });
}

function parsedRecordsToSourceRecords(input: CsvVerticalSliceInput, parsed: CsvParseResult): readonly NexoraSourceRecord[] {
  return Object.freeze(parsed.records.map((record) => {
    const recordProvenance = provenance(input, record.recordId, null, "RDI:2/CSVAdapter");
    return Object.freeze({
      recordId: record.recordId,
      provenance: recordProvenance,
      fields: Object.freeze(parsed.columns.map((column) => Object.freeze({
        key: column.name,
        sourceDataType: record.values[column.index] === null ? "empty" : typeof record.values[column.index],
        value: record.values[column.index] ?? null,
        provenance: provenance(input, record.recordId, column.name, "RDI:2/CSVAdapter"),
      }))),
    });
  }));
}

function buildCsvSource(input: CsvVerticalSliceInput): NexoraDataSource {
  const sourceId = csvCanonicalSourceContextId(input.workspaceId, input.fileName, input.sourceContextId);
  return Object.freeze({
    identity: Object.freeze({ sourceId, sourceType: "csv", workspaceId: input.workspaceId, providerName: "local-csv", connectionId: input.importId, observedAt: input.observedAt ?? input.importedAt, schemaVersion: "rdi2.csv.v1" }),
    metadata: Object.freeze({ displayName: input.fileName, description: "Locally imported CSV", configurationRef: input.importId, tags: Object.freeze(["csv", "local", "rdi2"]) }),
    adapterId: "rdi2.csv.local-adapter",
  });
}

function buildCsvAdapter(input: CsvVerticalSliceInput): NexoraDataSourceAdapter {
  return Object.freeze({
    adapterId: "rdi2.csv.local-adapter",
    adapterVersion: "1.0.0",
    sourceType: "csv",
    providerName: "local-csv",
    adapt: () => Object.freeze({ records: parsedRecordsToSourceRecords(input, parseCsvDeterministically(input.csvText)) }),
  });
}

function numericValues(parsed: CsvParseResult, columnIndex: number): readonly Readonly<{ value: number; record: ParsedCsvRecord }>[] {
  return Object.freeze(parsed.records.flatMap((record) => {
    const value = record.values[columnIndex];
    return typeof value === "number" && Number.isFinite(value) ? [Object.freeze({ value, record })] : [];
  }));
}

function buildMapper(input: CsvVerticalSliceInput, parsed: CsvParseResult, mapping: CsvMappingReview): NexoraDataRealityMapper {
  return Object.freeze({
    mappingId: mapping.mappingId,
    mappingVersion: "1.0.0",
    map: () => {
      const datasetRecords: NexoraDatasetRecord[] = [];
      const factProvenance: NexoraDataRealityFactProvenance[] = [];
      for (const entry of mapping.mappings) {
        if (entry.ignored || !entry.confirmed || !entry.targetId) continue;
        const target = CSV_MAPPING_TARGETS.find((candidate) => candidate.targetId === entry.targetId);
        if (!target || !target.objectKey || !target.metricKey || target.aggregation === "metadata") continue;
        const values = numericValues(parsed, entry.columnIndex);
        if (values.length === 0) continue;
        const value = target.aggregation === "sum" ? values.reduce((sum, item) => sum + item.value, 0) : values[values.length - 1]!.value;
        datasetRecords.push(Object.freeze({ objectKey: target.objectKey, metricKey: target.metricKey, value, ...(target.unit ? { unit: target.unit } : {}), observedAt: input.importedAt }));
        const source = values[0]!;
        factProvenance.push(Object.freeze({ objectKey: target.objectKey, metricKey: target.metricKey, provenance: provenance(input, source.record.recordId, entry.sourceColumn, `${mapping.mappingId}:aggregate:${target.aggregation}`) }));
      }
      const dataset: NexoraDataset = Object.freeze({
        id: `rdi2:dataset:${input.importId}`,
        name: input.fileName,
        version: "1.0.0",
        capturedAt: input.importedAt,
        source: "csv",
        familyId: "nexora.executive-operations",
        scenario: input.scenario ?? "baseline",
        records: Object.freeze(datasetRecords.sort((a, b) => `${a.objectKey}.${a.metricKey}`.localeCompare(`${b.objectKey}.${b.metricKey}`))),
      });
      return Object.freeze({ dataset, factProvenance: Object.freeze(factProvenance) });
    },
  });
}

function failure(input: CsvVerticalSliceInput, parse: CsvParseResult, mapping: CsvMappingReview, errors: readonly string[], snapshot: NexoraDataSourceSnapshot | null = null): CsvPreparedImport {
  return Object.freeze({ ready: false, workspaceId: input.workspaceId, sourceContextId: csvCanonicalSourceContextId(input.workspaceId, input.fileName, input.sourceContextId), importId: input.importId, fileName: input.fileName, fileSize: input.fileSize, parse, mapping, snapshot, handoff: null, dataReality: null, runtime: null, advisor: null, summary: null, errors: Object.freeze([...errors]) });
}

function resolveSourceScopedExecutiveReality(
  dataset: NexoraDataset,
  mapping: CsvMappingReview,
  createdAt: string,
): NexoraDatasetExecutiveRealityResult {
  const objectKeys = new Set(
    mapping.mappings.flatMap((entry) => {
      if (!entry.confirmed || entry.ignored || !entry.targetId) return [];
      const target = CSV_MAPPING_TARGETS.find((candidate) => candidate.targetId === entry.targetId);
      return target?.objectKey ? [target.objectKey] : [];
    }),
  );
  const definitions = getExecutiveOperationsKpiDefinitions().filter((definition) =>
    objectKeys.has(definition.objectKey),
  );
  const bindings = getExecutiveOperationsResolvedObjectBindings().filter((binding) =>
    objectKeys.has(binding.objectKey),
  );
  const definitionIds = new Set(definitions.map((definition) => definition.id));
  const rules = getExecutiveOperationsExecutiveStateRules().filter((rule) =>
    definitionIds.has(rule.kpiId),
  );

  if (definitions.length > 0) {
    return resolveDatasetExecutiveReality(dataset, {
      bindings,
      definitions,
      rules,
      createdAt,
    });
  }

  const facts = normalizeDatasetToBusinessFacts(dataset);
  const binding = computeDatasetKPIReality(dataset, {
    bindings,
    definitions,
    calculatedAt: createdAt,
  });
  const snapshot = buildDataRealitySnapshot({
    datasetId: dataset.id,
    facts,
    kpis: Object.freeze([]),
    objectStates: Object.freeze([]),
    createdAt,
  });
  return Object.freeze({
    status: "partial" as const,
    datasetId: dataset.id,
    facts,
    boundFacts: binding.boundFacts,
    kpis: Object.freeze([]),
    objectStates: Object.freeze([]),
    bindingIssues: binding.bindingIssues,
    kpiIssues: Object.freeze([]),
    stateIssues: Object.freeze([]),
    snapshot,
  });
}

export function prepareCsvRealDataImport(input: CsvVerticalSliceInput, mappingOverride?: CsvMappingReview): CsvPreparedImport {
  const parse = parseCsvDeterministically(input.csvText);
  const mapping = mappingOverride ?? suggestCsvColumnMappings(parse.columns, input.importId);
  if (!input.workspaceId.trim()) return failure(input, parse, mapping, ["Choose a workspace before importing data."]);
  if (!/\.csv$/i.test(input.fileName)) return failure(input, parse, mapping, ["RDI:2 accepts CSV files only."]);
  if (!parse.valid) return failure(input, parse, mapping, parse.issues.map((entry) => entry.message));
  if (!mapping.readyForValidation) return failure(input, parse, mapping, ["Confirm or ignore every uncertain column before validation."]);

  const source = buildCsvSource(input);
  const adapterResult = adaptNexoraDataSource(buildCsvAdapter(input), {
    source,
    snapshotId: `rdi2:snapshot:${input.importId}`,
    importedAt: input.importedAt,
    payload: input.csvText,
  }, { expectedWorkspaceId: input.workspaceId, supportedSourceTypes: Object.freeze(["csv"]) });
  if (!adapterResult.ok || !adapterResult.snapshot) return failure(input, parse, mapping, adapterResult.validation.issues.map((entry) => entry.message));

  const handoffResult = createNexoraDataRealityHandoff(adapterResult.snapshot, buildMapper(input, parse, mapping), input.workspaceId);
  if (!handoffResult.ready) return failure(input, parse, mapping, handoffResult.validation.issues.map((entry) => entry.message), adapterResult.snapshot);
  const handoff = handoffResult.handoff;
  const dataReality = resolveSourceScopedExecutiveReality(handoff.dataset, mapping, input.importedAt);
  if (dataReality.status === "invalid") {
    const issues = [...dataReality.bindingIssues, ...dataReality.kpiIssues, ...dataReality.stateIssues];
    return failure(input, parse, mapping, issues.length ? issues.map((entry) => entry.message) : ["The mapped columns do not yet produce an executive KPI."], adapterResult.snapshot);
  }
  const runtime = projectDataRealityToExecutiveRuntime(
    dataReality.snapshot,
    undefined,
    { allowEmptyProjection: true },
  );
  if (runtime.status === "invalid") return failure(input, parse, mapping, runtime.issues.map((entry) => entry.message), adapterResult.snapshot);
  const advisor = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: handoff.dataset,
    dataReality,
    currentWorkspace: input.workspaceId,
  });
  const states = dataReality.objectStates;
  const summary: CsvExecutiveImportSummary = Object.freeze({
    headline: "Data connected",
    importedRecordCount: parse.records.length,
    recognizedMeanings: Object.freeze(mapping.mappings.filter((entry) => entry.confirmed && !entry.ignored && entry.targetLabel).map((entry) => entry.targetLabel!).filter((value, index, all) => all.indexOf(value) === index)),
    updatedObjectCount: states.length,
    attentionObjectCount: states.filter((entry) => entry.state === "attention").length,
    criticalObjectCount: states.filter((entry) => entry.state === "critical").length,
    ignoredColumnCount: mapping.ignoredCount,
  });
  return Object.freeze({ ready: true, workspaceId: input.workspaceId, sourceContextId: source.identity.sourceId, importId: input.importId, fileName: input.fileName, fileSize: input.fileSize, parse, mapping, snapshot: adapterResult.snapshot, handoff, dataReality, runtime, advisor, summary, errors: Object.freeze([]) });
}

export function traceCsvExecutiveValue(prepared: CsvPreparedImport, objectKey: string, metricKey: string): NexoraDataSourceProvenance | null {
  return prepared.handoff?.factProvenance.find((entry) => entry.objectKey === objectKey && entry.metricKey === metricKey)?.provenance ?? null;
}

export type CsvRealDataCertificationGate = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O";
export type CsvRealDataCertificationEvidence = Readonly<Record<
  "csvParsing" | "canonicalAdapter" | "mapping" | "ambiguitySafety" | "validation" | "provenance" | "workspaceIsolation" | "dataRealityHandoff" | "executiveMeaning" | "runtime" | "stage" | "advisor" | "failureAtomicity" | "uiFlow" | "regression",
  boolean
>>;

export function certifyCsvRealDataVerticalSlice(evidence: CsvRealDataCertificationEvidence) {
  const definitions = [
    ["A", "CSV Parsing", evidence.csvParsing], ["B", "Canonical Adapter", evidence.canonicalAdapter], ["C", "Mapping", evidence.mapping], ["D", "Ambiguity Safety", evidence.ambiguitySafety], ["E", "Validation", evidence.validation], ["F", "Provenance", evidence.provenance], ["G", "Workspace Isolation", evidence.workspaceIsolation], ["H", "Data Reality Handoff", evidence.dataRealityHandoff], ["I", "Executive Meaning", evidence.executiveMeaning], ["J", "Runtime", evidence.runtime], ["K", "Stage", evidence.stage], ["L", "Advisor", evidence.advisor], ["M", "Failure Atomicity", evidence.failureAtomicity], ["N", "UI Flow", evidence.uiFlow], ["O", "Regression", evidence.regression],
  ] as const;
  const gates = Object.freeze(definitions.map(([gate, name, passed]) => Object.freeze({ gate: gate as CsvRealDataCertificationGate, name, passed })));
  const passedGateCount = gates.filter((entry) => entry.passed).length;
  return Object.freeze({ certified: passedGateCount === gates.length, passedGateCount, failedGateCount: gates.length - passedGateCount, gates });
}

export function getCsvSnapshotReality(prepared: CsvPreparedImport): NexoraDataRealitySnapshot | null {
  return prepared.dataReality?.snapshot ?? null;
}
