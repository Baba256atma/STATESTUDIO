/**
 * NPA-T SIM-TEST:2 — RMS Operator observable records -> customer-like CSV ->
 * existing RDI:2 Gate. This is a simulation adapter, not a data authority.
 */

import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  csvCanonicalSourceContextId,
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  type CsvPreparedImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import type { RmsObservableRecord, RmsOperationalSourceFamily } from "../rms/rmsOperatorContract.ts";

export const nexoraSimulationCsvIngestionIdentity =
  "NPA-T SIM-TEST:2/OperatorCsvProjection" as const;

export const SIM_TEST_2_BOUNDARY = Object.freeze({
  identity: nexoraSimulationCsvIngestionIdentity,
  csvOwner: "NPA-T RMS:3/OperatorObservableData" as const,
  parserAndGate: "RDI:2/NexoraCsvRealDataVerticalSlice" as const,
  handoff: "RDI:1/NexoraRealDataIntegrationFoundation" as const,
  dataReality: "P0:1/NexoraDataRealityFoundation" as const,
  commitWriter: "RDI:2/csvRealDataImportStore" as const,
  createsCsvAgent: false as const,
  createsParser: false as const,
  createsMapper: false as const,
  createsGate: false as const,
  writesDataRealityDirectly: false as const,
  confirmsAmbiguousSemantics: false as const,
  exposesGroundTruth: false as const,
});

export type SimulationCsvSourceType =
  | "ERP" | "PRODUCTION" | "INVENTORY" | "MAINTENANCE"
  | "PMO" | "PROJECT_CONTROL" | "CRM" | "HR";

function sourceTypes(...sources: SimulationCsvSourceType[]): readonly SimulationCsvSourceType[] {
  return Object.freeze(sources);
}

export const SIM_TEST_SCENARIO_CSV_SOURCES: Readonly<Record<string, readonly SimulationCsvSourceType[]>> = Object.freeze({
  "manufacturing-capacity-pressure": sourceTypes("ERP", "PRODUCTION", "INVENTORY", "MAINTENANCE"),
  "project-delivery-pressure": sourceTypes("PMO", "PROJECT_CONTROL"),
  "logistics-delivery-pressure": sourceTypes("ERP", "INVENTORY"),
  "service-capacity-pressure": sourceTypes("CRM", "HR"),
});

const FILE_NAME: Readonly<Record<SimulationCsvSourceType, string>> = Object.freeze({
  ERP: "ERP.csv",
  PRODUCTION: "Production.csv",
  INVENTORY: "Inventory.csv",
  MAINTENANCE: "Maintenance.csv",
  PMO: "PMO.csv",
  PROJECT_CONTROL: "ProjectControl.csv",
  CRM: "CRM.csv",
  HR: "HR.csv",
});

const CANONICAL_HEADER: Readonly<Record<string, string>> = Object.freeze({
  orders_received: "ordersReceived",
  requested_quantity: "requestedQuantity",
  CAP_AV: "Production Total Capacity",
  produced_quantity: "Production Used Capacity",
  inventory_quantity: "onHand",
  machine_status: "machineStatus",
  downtime_unreported: "downtimeMinutes",
  last_cycle_count: "lastCycleCount",
  planned_progress: "plannedProgress",
  actual_progress: "actualProgress",
  resource_usage: "resourceLoad",
  schedule_observation: "scheduleVarianceDays",
});

export const SIM_TEST_INGESTION_TRACE_KINDS = Object.freeze([
  "GROUND_TRUTH_CHANGED", "OPERATOR_OBSERVED", "CSV_GENERATED", "CSV_UPDATED",
  "INGESTION_STARTED", "INGESTION_COMPLETED", "DATA_REALITY_UPDATED",
  "NEXORA_OBSERVED", "MANAGER_TURN",
] as const);
export type SimulationIngestionTraceKind = (typeof SIM_TEST_INGESTION_TRACE_KINDS)[number];

export type SimulationCsvProvenance = Readonly<{
  scenarioId: string;
  simulationRunId: string;
  sourceType: SimulationCsvSourceType;
  fileName: string;
  schemaVersion: "sim-test.csv.v1";
  generatedAtTick: number;
  generatedAt: string;
  sourceContextId: string;
  operatorRecordIds: readonly string[];
  sealedGroundTruthIncluded: false;
}>;

export type SimulationCsvFileVersion = Readonly<{
  fileId: string;
  fileName: string;
  sourceType: SimulationCsvSourceType;
  schemaVersion: "sim-test.csv.v1";
  version: number;
  generatedAtTick: number;
  generatedAt: string;
  headers: readonly string[];
  rowCount: number;
  csvText: string;
  statuses: readonly RmsObservableRecord["status"][];
  stale: boolean;
  provenance: SimulationCsvProvenance;
}>;

export type SimulationCsvIngestionState = Readonly<{
  file: SimulationCsvFileVersion;
  state: "NO_ROWS" | "MAPPING_REQUIRED" | "INGESTION_COMPLETED" | "INGESTION_FAILED";
  gateIdentity: "RDI:2/NexoraCsvRealDataVerticalSlice";
  mappingPath: string;
  semanticConfirmationBySimulator: false;
  prepared: CsvPreparedImport | null;
  committed: boolean;
  dataRealityUpdated: boolean;
  publicationRef: string | null;
  errors: readonly string[];
}>;

export type SimulationIngestionTrace = Readonly<{
  traceId: string;
  kind: SimulationIngestionTraceKind;
  tick: number;
  sourceType: SimulationCsvSourceType | null;
  fileName: string | null;
  ref: string;
  observerOnly: true;
  writeAttempted: false;
}>;

export type SimulationCsvProjectionPolicy = Readonly<{
  omitFields?: readonly string[];
  headerOverrides?: Readonly<Record<string, string>>;
  staleSourceAfterTick?: Readonly<Partial<Record<SimulationCsvSourceType, number>>>;
  delayedFieldsUntilTick?: Readonly<Record<string, number>>;
  conflicts?: readonly Readonly<{
    sourceType: SimulationCsvSourceType;
    field: string;
    value: string | number | boolean;
  }>[];
}>;

function csvCell(value: RmsObservableRecord["value"]): string {
  if (value == null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sourceRecords(
  source: SimulationCsvSourceType,
  records: readonly RmsObservableRecord[],
  tick: number,
  policy?: SimulationCsvProjectionPolicy,
): readonly RmsObservableRecord[] {
  const direct = records.filter((record) =>
    record.sourceFamily === source &&
    record.status === "AVAILABLE" &&
    !policy?.omitFields?.includes(record.field) &&
    tick >= (policy?.delayedFieldsUntilTick?.[record.field] ?? 0),
  );
  const conflict = (policy?.conflicts ?? []).filter((item) => item.sourceType === source).map((item): RmsObservableRecord => {
    const base = records.find((record) => record.field === item.field) ?? records[0];
    if (!base) throw new Error(`SIM-TEST:2 conflict ${item.field} requires an Operator observation`);
    return Object.freeze({
      ...base,
      recordId: `${base.runId}:conflict:${source}:${item.field}:${tick}`,
      sourceFamily: source as RmsOperationalSourceFamily,
      sourceSystemId: `source:${source.toLowerCase()}`,
      domain: source as RmsOperationalSourceFamily,
      tick,
      field: item.field,
      value: item.value,
      observationProvenance: `${base.observationProvenance}:controlled-source-disagreement:${source}`,
    });
  });
  return Object.freeze([...direct, ...conflict]);
}

export function projectRmsOperatorRecordsToCsv(input: {
  readonly scenarioId: string;
  readonly simulationRunId: string;
  readonly tick: number;
  readonly records: readonly RmsObservableRecord[];
  readonly previous?: readonly SimulationCsvFileVersion[];
  readonly policy?: SimulationCsvProjectionPolicy;
}): readonly SimulationCsvFileVersion[] {
  const sources = SIM_TEST_SCENARIO_CSV_SOURCES[input.scenarioId];
  if (!sources) throw new Error(`SIM-TEST:2 has no CSV contract for ${input.scenarioId}`);
  return Object.freeze(sources.map((source) => {
    const previous = [...(input.previous ?? [])].reverse().find((item) => item.sourceType === source) ?? null;
    const staleAfter = input.policy?.staleSourceAfterTick?.[source];
    if (previous && staleAfter != null && input.tick > staleAfter) {
      return Object.freeze({ ...previous, stale: true });
    }
    const records = sourceRecords(source, input.records, input.tick, input.policy);
    const fields = [...new Set(records.map((record) => record.field))];
    const headers = Object.freeze(["date", ...fields.map((field) => input.policy?.headerOverrides?.[field] ?? CANONICAL_HEADER[field] ?? field)]);
    const rows = records.length === 0
      ? []
      : [Object.freeze([records[0]?.simulatedAt ?? "", ...fields.map((field) => records.find((record) => record.field === field)?.value ?? null)])];
    const csvText = [headers.join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n") + "\n";
    const version = (previous?.version ?? 0) + 1;
    const fileName = FILE_NAME[source];
    const sourceContextId = csvCanonicalSourceContextId(
      "overview",
      fileName,
      `sim-test-2:${input.scenarioId}:${input.simulationRunId}:${source.toLowerCase()}`,
    );
    return Object.freeze({
      fileId: `${input.simulationRunId}:${source}:${input.tick}`,
      fileName,
      sourceType: source,
      schemaVersion: "sim-test.csv.v1" as const,
      version,
      generatedAtTick: input.tick,
      generatedAt: records[0]?.simulatedAt ?? `tick:${input.tick}`,
      headers,
      rowCount: rows.length,
      csvText,
      statuses: Object.freeze([...new Set(records.map((record) => record.status))]),
      stale: false,
      provenance: Object.freeze({
        scenarioId: input.scenarioId,
        simulationRunId: input.simulationRunId,
        sourceType: source,
        fileName,
        schemaVersion: "sim-test.csv.v1" as const,
        generatedAtTick: input.tick,
        generatedAt: records[0]?.simulatedAt ?? `tick:${input.tick}`,
        sourceContextId,
        operatorRecordIds: Object.freeze(records.map((record) => record.recordId)),
        sealedGroundTruthIncluded: false as const,
      }),
    });
  }));
}

export function ingestSimulationCsvFile(file: SimulationCsvFileVersion): SimulationCsvIngestionState {
  if (file.rowCount === 0) {
    return Object.freeze({
      file, state: "NO_ROWS" as const, gateIdentity: "RDI:2/NexoraCsvRealDataVerticalSlice" as const,
      mappingPath: "no-observable-rows", semanticConfirmationBySimulator: false as const,
      prepared: null, committed: false, dataRealityUpdated: false, publicationRef: null,
      errors: Object.freeze(["No Operator-observable rows are available for this source."]),
    });
  }
  const importId = `${file.fileId}:import`;
  const input = Object.freeze({
    workspaceId: "overview",
    fileName: file.fileName,
    fileSize: file.csvText.length,
    csvText: file.csvText,
    importId,
    importedAt: file.generatedAt,
    observedAt: file.generatedAt,
    sourceContextId: file.provenance.sourceContextId,
  });
  const parsed = parseCsvDeterministically(file.csvText);
  const mapping = suggestCsvColumnMappings(parsed.columns, importId);
  const prepared = prepareCsvRealDataImport(input, mapping);
  if (!prepared.ready) {
    saveCsvImportCandidate(Object.freeze({
      workspaceId: input.workspaceId,
      candidateId: file.provenance.sourceContextId,
      fileName: file.fileName,
      status: "mapping" as const,
      input,
      parse: parsed,
      mapping,
      prepared,
      error: prepared.errors[0] ?? null,
      replacementSourceContextId: null,
    }));
    return Object.freeze({
      file, state: "MAPPING_REQUIRED" as const, gateIdentity: "RDI:2/NexoraCsvRealDataVerticalSlice" as const,
      mappingPath: mapping.mappingId, semanticConfirmationBySimulator: false as const,
      prepared, committed: false, dataRealityUpdated: false, publicationRef: null,
      errors: prepared.errors,
    });
  }
  const existing = getCsvRealDataImport(input.workspaceId, prepared.sourceContextId);
  const commit = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: input.workspaceId,
    mode: existing ? "replace" : "new",
    committedAt: file.generatedAt,
  });
  return Object.freeze({
    file,
    state: commit.committed ? "INGESTION_COMPLETED" as const : "INGESTION_FAILED" as const,
    gateIdentity: "RDI:2/NexoraCsvRealDataVerticalSlice" as const,
    mappingPath: mapping.mappingId,
    semanticConfirmationBySimulator: false as const,
    prepared,
    committed: commit.committed,
    dataRealityUpdated: Boolean(commit.committed && prepared.dataReality),
    publicationRef: commit.current?.prepared.handoff?.sourceSnapshotId ?? null,
    errors: commit.committed ? Object.freeze([]) : Object.freeze([commit.reason]),
  });
}

export function traceSimulationCsvIngestion(input: {
  readonly tick: number;
  readonly sequence: number;
  readonly kind: SimulationIngestionTraceKind;
  readonly sourceType?: SimulationCsvSourceType | null;
  readonly fileName?: string | null;
  readonly ref: string;
}): SimulationIngestionTrace {
  return Object.freeze({
    traceId: `sim-test-2:trace:${input.sequence}:${input.kind}`,
    kind: input.kind,
    tick: input.tick,
    sourceType: input.sourceType ?? null,
    fileName: input.fileName ?? null,
    ref: input.ref,
    observerOnly: true as const,
    writeAttempted: false as const,
  });
}
