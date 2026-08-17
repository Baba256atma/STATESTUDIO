import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CSV_IMPORT_FLOW_STATES,
  CSV_COLUMN_MAPPING_STATUSES,
  certifyCsvRealDataVerticalSlice,
  csvRealDataVerticalSliceIdentity,
  csvRealDataVerticalSliceNamespace,
  csvRealDataVerticalSliceVersion,
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  traceCsvExecutiveValue,
  updateCsvColumnMapping,
  type CsvMappingReview,
  type CsvPreparedImport,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";
import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "./csvRealDataImportStore.ts";

const here = dirname(fileURLToPath(import.meta.url));
const baselineCsv = readFileSync(join(here, "fixtures/rdi2-baseline.csv"), "utf8");
const pressureCsv = readFileSync(join(here, "fixtures/rdi2-pressure.csv"), "utf8");
const importedAt = "2026-08-15T12:00:00.000Z";

function input(options: Partial<CsvVerticalSliceInput> = {}): CsvVerticalSliceInput {
  return Object.freeze({
    workspaceId: "workspace-a",
    fileName: "executive-data.csv",
    fileSize: baselineCsv.length,
    csvText: baselineCsv,
    importId: "RDI-baseline",
    importedAt,
    sourceContextId: "csv:workspace-a:executive-operations",
    scenario: "baseline",
    ...options,
  });
}

function confirmSuggestions(value: CsvMappingReview): CsvMappingReview {
  return value.mappings.reduce((review, mapping) => {
    if (mapping.status !== "suggested" || !mapping.targetId) return review;
    return updateCsvColumnMapping(review, mapping.columnIndex, mapping.targetId);
  }, value);
}

function prepare(options: Partial<CsvVerticalSliceInput> = {}): CsvPreparedImport {
  const value = input(options);
  const parsed = parseCsvDeterministically(value.csvText);
  return prepareCsvRealDataImport(value, confirmSuggestions(suggestCsvColumnMappings(parsed.columns, value.importId)));
}

test.beforeEach(() => resetCsvRealDataImportStoreForTests());

test("publishes the RDI:2 identity and deterministic state vocabularies", () => {
  assert.equal(csvRealDataVerticalSliceIdentity, "RDI:2/NexoraCsvRealDataVerticalSlice");
  assert.equal(csvRealDataVerticalSliceVersion, "1.0.0");
  assert.equal(csvRealDataVerticalSliceNamespace, "nexora.real-data-integration.csv-vertical-slice");
  assert.deepEqual(CSV_COLUMN_MAPPING_STATUSES, ["recognized", "suggested", "unmapped", "unsupported"]);
  assert.deepEqual(CSV_IMPORT_FLOW_STATES, ["idle", "file-selected", "parsing", "preview", "mapping", "validating", "ready", "importing", "completed", "error"]);
});

test("A — parses headers, quotes, embedded commas, empty, numeric, percentage, date-like, and whitespace", () => {
  const parsed = parseCsvDeterministically('Date,Sales,Margin,Note,Empty\n2026-08-01,"42,300",12.5%,"North, West", \n');
  assert.equal(parsed.valid, true);
  assert.equal(parsed.records[0]?.values[1], 42300);
  assert.equal(parsed.records[0]?.values[2], 12.5);
  assert.equal(parsed.records[0]?.values[3], "North, West");
  assert.equal(parsed.records[0]?.values[4], null);
  assert.equal(parsed.records[0]?.values[0], "2026-08-01");
  assert.ok(Object.isFrozen(parsed.records[0]?.values));
});

test("A/E — rejects duplicate headers, malformed rows, malformed quotes, and empty files", () => {
  assert.equal(parseCsvDeterministically("A,A\n1,2\n").valid, false);
  assert.equal(parseCsvDeterministically("A,B\n1\n").issues[0]?.code, "MALFORMED_ROW");
  assert.equal(parseCsvDeterministically('A\n"open\n').issues.some((issue) => issue.code === "MALFORMED_QUOTE"), true);
  assert.equal(parseCsvDeterministically("  ").issues[0]?.code, "EMPTY_FILE");
});

test("B — CSV enters through the certified RDI:1 adapter snapshot boundary", () => {
  const result = prepare();
  assert.equal(result.ready, true);
  assert.equal(result.snapshot?.source.adapterId, "rdi2.csv.local-adapter");
  assert.equal(result.snapshot?.deterministic, true);
  assert.equal(result.snapshot?.validation.state, "valid");
  assert.equal(Object.isFrozen(result.snapshot?.records), true);
});

test("C — canonical column names map deterministically to existing meanings", () => {
  const parsed = parseCsvDeterministically(baselineCsv);
  const first = suggestCsvColumnMappings(parsed.columns, "RDI-test");
  const second = suggestCsvColumnMappings(parsed.columns, "RDI-test");
  assert.deepEqual(first, second);
  assert.equal(first.unresolvedCount, 0);
  assert.ok(first.mappings.every((mapping) => mapping.status === "recognized"));
});

test("D — aliases require confirmation and unknown columns require explicit ignore or mapping", () => {
  const parsed = parseCsvDeterministically("Sales,Mystery\n100,9\n");
  const review = suggestCsvColumnMappings(parsed.columns, "RDI-safe");
  assert.equal(review.readyForValidation, false);
  assert.equal(review.mappings[0]?.status, "suggested");
  assert.equal(review.mappings[0]?.confirmed, false);
  const confirmed = updateCsvColumnMapping(review, 0, "revenue.current");
  const ignored = updateCsvColumnMapping(confirmed, 1, null);
  assert.equal(ignored.readyForValidation, true);
  assert.equal(ignored.ignoredCount, 1);
});

test("E — an unresolved mapping cannot reach a Data Reality handoff", () => {
  const value = input({ csvText: "Sales,Mystery\n100,9\n", fileSize: 20 });
  const parsed = parseCsvDeterministically(value.csvText);
  const result = prepareCsvRealDataImport(value, suggestCsvColumnMappings(parsed.columns, value.importId));
  assert.equal(result.ready, false);
  assert.equal(result.handoff, null);
  assert.match(result.errors[0] ?? "", /Confirm or ignore/);
});

test("F — provenance traces executive Revenue to CSV source, row, field, and transformation", () => {
  const result = prepare();
  const trace = traceCsvExecutiveValue(result, "revenue", "currentRevenue");
  assert.equal(trace?.sourceId, "csv:workspace-a:executive-operations");
  assert.equal(trace?.sourceRecordId, "row-2");
  assert.equal(trace?.sourceFieldKey, "Current Revenue");
  assert.match(trace?.transformationRef ?? "", /aggregate:sum/);
});

test("G — Workspace A preparation cannot commit into Workspace B", () => {
  const prepared = prepare();
  const result = commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "workspace-b", mode: "new", committedAt: importedAt });
  assert.equal(result.committed, false);
  assert.equal(result.reason, "workspace_mismatch");
  assert.equal(listCsvRealDataImports("workspace-a").length, 0);
  assert.equal(listCsvRealDataImports("workspace-b").length, 0);
});

test("H — validated mapping produces an existing canonical NexoraDataset", () => {
  const result = prepare();
  assert.equal(result.handoff?.destinationAuthority, "P0:1/NexoraDataRealityFoundation");
  assert.equal(result.handoff?.dataset.source, "csv");
  assert.equal(result.handoff?.dataset.records.length, 11);
  assert.equal(result.handoff?.dataset.records.find((record) => record.metricKey === "currentRevenue")?.value, 8400000);
});

test("I/J/K/L — baseline values traverse Data Reality, Runtime, Stage, and Advisor", () => {
  const result = prepare();
  assert.equal(result.dataReality?.status, "resolved");
  assert.equal(result.dataReality?.kpis.length, 5);
  assert.equal(result.runtime?.status, "projected");
  assert.equal(result.runtime?.projections.length, 5);
  assert.ok((result.advisor?.observationResolution.observations.length ?? 0) > 0);
  assert.ok(["stable", "watch", "risk", "critical"].includes(result.advisor?.advisorContext.dominantState ?? ""));
});

test("required runtime proof — same adapter, mapping, objects, and rules yield different executive results", () => {
  const baseline = prepare();
  const pressure = prepare({ csvText: pressureCsv, fileSize: pressureCsv.length, fileName: "pressure.csv", importId: "RDI-pressure", sourceContextId: "csv:workspace-a:pressure", scenario: "operational-pressure" });
  assert.equal(pressure.ready, true);
  assert.equal(baseline.snapshot?.source.adapterId, pressure.snapshot?.source.adapterId);
  assert.deepEqual(baseline.handoff?.dataset.records.map((record) => `${record.objectKey}.${record.metricKey}`), pressure.handoff?.dataset.records.map((record) => `${record.objectKey}.${record.metricKey}`));
  assert.notDeepEqual(baseline.dataReality?.kpis.map((kpi) => kpi.value), pressure.dataReality?.kpis.map((kpi) => kpi.value));
  assert.notDeepEqual(baseline.dataReality?.objectStates.map((state) => state.state), pressure.dataReality?.objectStates.map((state) => state.state));
  assert.notDeepEqual(baseline.runtime?.projections.map((item) => item.mvpStatus), pressure.runtime?.projections.map((item) => item.mvpStatus));
  assert.notEqual(baseline.advisor?.advisorContext.dominantState, pressure.advisor?.advisorContext.dominantState);
});

test("M — failed replacement leaves previous Runtime truth intact", () => {
  const baseline = prepare();
  const committed = commitPreparedCsvRealDataImport({ prepared: baseline, expectedWorkspaceId: "workspace-a", mode: "new", committedAt: importedAt });
  assert.equal(committed.committed, true);
  const invalid = prepare({ csvText: "Current Revenue\nnot-a-number\n", fileSize: 30, importId: "RDI-invalid" });
  assert.equal(invalid.ready, false);
  const rejected = commitPreparedCsvRealDataImport({ prepared: invalid, expectedWorkspaceId: "workspace-a", mode: "replace", committedAt: "2026-08-15T13:00:00.000Z" });
  assert.equal(rejected.committed, false);
  assert.equal(getCsvRealDataImport("workspace-a", baseline.sourceContextId)?.importId, "RDI-baseline");
});

test("re-import distinguishes new, replace, and cancel deterministically", () => {
  const baseline = prepare();
  assert.equal(commitPreparedCsvRealDataImport({ prepared: baseline, expectedWorkspaceId: "workspace-a", mode: "new", committedAt: importedAt }).reason, "committed");
  assert.equal(commitPreparedCsvRealDataImport({ prepared: baseline, expectedWorkspaceId: "workspace-a", mode: "new", committedAt: importedAt }).reason, "source_exists");
  assert.equal(commitPreparedCsvRealDataImport({ prepared: baseline, expectedWorkspaceId: "workspace-a", mode: "cancel", committedAt: importedAt }).reason, "cancelled");
  const pressure = prepare({ csvText: pressureCsv, fileSize: pressureCsv.length, importId: "RDI-pressure", scenario: "operational-pressure" });
  assert.equal(commitPreparedCsvRealDataImport({ prepared: pressure, expectedWorkspaceId: "workspace-a", mode: "replace", committedAt: "2026-08-15T13:00:00.000Z" }).reason, "replaced");
  assert.equal(getCsvRealDataImport("workspace-a", baseline.sourceContextId)?.importId, "RDI-pressure");
});

test("N — UI source exposes upload, preview/mapping, validation, import, and executive result evidence", () => {
  const ui = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraCsvRealDataImportFlow.tsx"), "utf8");
  for (const evidence of ["upload", "preview-mapping", "validation", "completed", "stage-advisor"]) assert.match(ui, new RegExp(`data-rdi2-evidence=\\"${evidence}\\"`));
  assert.match(ui, /Choose CSV/);
  assert.match(ui, /Validate Import/);
  assert.match(ui, /Data connected/);
  assert.match(ui, /Replace Existing Source Snapshot/);
});

test("N — canonical /executive Data Explorer exposes Add Data and mounts RDI:2", () => {
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");
  assert.match(shell, /explorerKind === "data"/);
  assert.match(shell, /NexoraExecutiveDataExplorer/);
  assert.match(explorer, /\+ Add Data/);
  assert.match(explorer, /CsvRealDataImportFlow/);
  assert.match(explorer, /data-rdi2-canonical-route="\/executive"/);
});

test("J/K/L — downstream modules receive datasets/snapshots, never CSV text", () => {
  const source = readFileSync(join(here, "csvRealDataVerticalSlice.ts"), "utf8");
  assert.match(source, /resolveDatasetExecutiveReality\(handoff\.dataset/);
  assert.match(source, /projectDataRealityToExecutiveRuntime\(dataReality\.snapshot\)/);
  assert.match(source, /resolveDataRealityExecutiveAdvisorIntegration\(\{/);
  assert.doesNotMatch(source, /fetch\(|WebSocket|EventSource|setInterval|setTimeout/);
});

test("A–O automated certification reports 15/15", () => {
  const certification = certifyCsvRealDataVerticalSlice({ csvParsing: true, canonicalAdapter: true, mapping: true, ambiguitySafety: true, validation: true, provenance: true, workspaceIsolation: true, dataRealityHandoff: true, executiveMeaning: true, runtime: true, stage: true, advisor: true, failureAtomicity: true, uiFlow: true, regression: true });
  assert.equal(certification.certified, true);
  assert.equal(certification.passedGateCount, 15);
  assert.equal(certification.failedGateCount, 0);
  assert.deepEqual(certification.gates.map((gate) => gate.gate), "ABCDEFGHIJKLMNO".split(""));
  assert.equal(Object.isFrozen(certification.gates), true);
});
