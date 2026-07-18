import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import * as foundationApi from "./csvManualInputFoundation.ts";
import {
  CsvManualInputContracts,
  CsvManualInputDiagnosticCatalog,
  CsvManualInputFoundation,
  CsvManualInputFoundationVersion,
  CsvManualInputLifecycle,
  CsvManualInputPolicies,
  CsvManualInputSourceReferences,
  validateCsvManualInputFoundationRequest,
} from "./csvManualInputFoundation.ts";
import type {
  CsvManualInputFoundationRequest,
  CsvManualInputSource,
} from "./csvManualInputFoundationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const SOURCE_FILES = [
  "csvManualInputFoundationTypes.ts",
  "csvManualInputContracts.ts",
  "csvManualInputSourceIdentity.ts",
  "csvManualInputPolicies.ts",
  "csvManualInputLifecycle.ts",
  "csvManualInputDiagnostics.ts",
  "csvManualInputFoundation.ts",
];
const ALL_FILES = [...SOURCE_FILES, "csvManualInputFoundation.test.ts"];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const validCsvFile: CsvManualInputSource = {
  mode: "CsvFile",
  fileName: "data.csv",
  fileSizeBytes: 2048,
  mimeType: "text/csv",
  lastModified: 0,
  encodingHint: "UTF-8",
};

const baseRequest = (overrides: Partial<CsvManualInputFoundationRequest> = {}): CsvManualInputFoundationRequest => ({
  tenantId: "tenant-1",
  workspaceId: "workspace-1",
  sessionId: "session-1",
  createdBy: "user-1",
  input: validCsvFile,
  ...overrides,
});

test("1. exactly eight INT-1:1 files exist", () => {
  for (const file of ALL_FILES) {
    assert.equal(readdirSync(HERE).includes(file), true, `missing ${file}`);
  }
  const csvFiles = readdirSync(HERE).filter((f) => f.startsWith("csvManualInput"));
  assert.equal(csvFiles.length, 8);
  assert.equal(ALL_FILES.length, 8);
});

test("2. foundation module has exactly eight runtime exports", () => {
  const names = Object.keys(foundationApi).sort();
  assert.deepEqual(names, [
    "CsvManualInputContracts",
    "CsvManualInputDiagnosticCatalog",
    "CsvManualInputFoundation",
    "CsvManualInputFoundationVersion",
    "CsvManualInputLifecycle",
    "CsvManualInputPolicies",
    "CsvManualInputSourceReferences",
    "validateCsvManualInputFoundationRequest",
  ]);
  assert.equal(names.length, 8);
});

test("3. DKL-2 is consumed only through its released Public Index", () => {
  for (const file of SOURCE_FILES) {
    const text = readFileSync(join(HERE, file), "utf8");
    const dklImports = text
      .split("\n")
      .filter((line) => line.includes("import") && line.includes("/dkl/"));
    for (const line of dklImports) {
      assert.match(line, /dataSourceKnowledgeRegistryPublicIndex/);
    }
  }
  assert.equal(CsvManualInputSourceReferences.publicIndexNamespace, "nexora.dkl.dsk-registry.public");
});

test("4-9. all required DKL-2 source references resolve", () => {
  const refs = CsvManualInputSourceReferences;
  assert.equal(refs.csvDataSource.resolved, true);
  assert.equal(refs.csvDataSource.registryEntryId, "dsk-datasource-csv");
  assert.equal(refs.manualInputDataSource.resolved, true);
  assert.equal(refs.manualInputDataSource.registryEntryId, "dsk-datasource-manual-input");
  assert.equal(refs.fileUploadConnector.resolved, true);
  assert.equal(refs.fileUploadConnector.registryEntryId, "dsk-connector-type-file-upload");
  assert.equal(refs.manualEntryConnector.resolved, true);
  assert.equal(refs.manualEntryConnector.registryEntryId, "dsk-connector-type-manual-entry");
  assert.equal(refs.tabularContent.resolved, true);
  assert.equal(refs.tabularContent.registryEntryId, "dsk-content-type-tabular");
  assert.equal(refs.manualRecordContent.resolved, true);
  assert.equal(refs.manualRecordContent.registryEntryId, "dsk-content-type-manual-record");
  assert.equal(refs.allResolved, true);
  assert.equal(refs.diagnostics.length, 0);
});

test("10. exactly three input modes exist", () => {
  assert.deepEqual([...CsvManualInputContracts.inputModes], ["CsvFile", "CsvText", "ManualTable"]);
  assert.equal(CsvManualInputContracts.inputModes.length, 3);
});

test("11. exactly nine lifecycle states exist in canonical order", () => {
  assert.deepEqual(
    [...CsvManualInputLifecycle.states],
    [
      "Created",
      "InputAccepted",
      "Parsing",
      "PreviewReady",
      "AwaitingConfirmation",
      "Confirmed",
      "Completed",
      "Failed",
      "Cancelled",
    ],
  );
});

test("12. valid lifecycle transitions succeed", () => {
  const pairs: readonly (readonly ["Created" | "InputAccepted" | "Parsing" | "PreviewReady" | "AwaitingConfirmation" | "Confirmed", "InputAccepted" | "Parsing" | "PreviewReady" | "AwaitingConfirmation" | "Confirmed" | "Completed"])[] = [
    ["Created", "InputAccepted"],
    ["InputAccepted", "Parsing"],
    ["Parsing", "PreviewReady"],
    ["PreviewReady", "AwaitingConfirmation"],
    ["AwaitingConfirmation", "Confirmed"],
    ["Confirmed", "Completed"],
  ];
  for (const [from, to] of pairs) {
    const result = CsvManualInputLifecycle.validateTransition(from, to);
    assert.equal(result.outcome, "Success");
  }
});

test("13. invalid lifecycle transitions return a failure result without throwing", () => {
  const result = CsvManualInputLifecycle.validateTransition("Created", "Completed");
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.equal(result.diagnostics[0].code, "LIFECYCLE_INVALID_TRANSITION");
  }
  assert.equal(CsvManualInputLifecycle.validateTransition("Completed", "Created").outcome, "Failure");
});

test("14. CSV extension policy accepts .csv", () => {
  const result = validateCsvManualInputFoundationRequest(baseRequest());
  assert.equal(result.outcome, "Success");
  assert.ok(CsvManualInputPolicies.file.allowedExtensions.includes(".csv"));
});

test("15. unsupported extensions are rejected", () => {
  const result = validateCsvManualInputFoundationRequest(
    baseRequest({ input: { ...validCsvFile, fileName: "data.txt" } }),
  );
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "FILE_EXTENSION_UNSUPPORTED"));
  }
});

test("16. supported MIME types are accepted", () => {
  for (const mimeType of ["text/csv", "application/csv", "text/plain"]) {
    const result = validateCsvManualInputFoundationRequest(
      baseRequest({ input: { ...validCsvFile, mimeType } }),
    );
    assert.equal(result.outcome, "Success");
  }
});

test("17. oversized files are rejected", () => {
  const result = validateCsvManualInputFoundationRequest(
    baseRequest({ input: { ...validCsvFile, fileSizeBytes: 11 * 1024 * 1024 } }),
  );
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "FILE_TOO_LARGE"));
  }
});

test("18. missing tenant id is rejected", () => {
  const result = validateCsvManualInputFoundationRequest(baseRequest({ tenantId: "" }));
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "INPUT_TENANT_REQUIRED"));
  }
});

test("19. missing workspace id is rejected", () => {
  const result = validateCsvManualInputFoundationRequest(baseRequest({ workspaceId: "  " }));
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "INPUT_WORKSPACE_REQUIRED"));
  }
});

test("20. missing session id is rejected", () => {
  const result = validateCsvManualInputFoundationRequest(baseRequest({ sessionId: "" }));
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "INPUT_SESSION_REQUIRED"));
  }
});

test("21. manual-table column limits are enforced", () => {
  const columns = Array.from({ length: 101 }, (_, i) => `c${i}`);
  const result = validateCsvManualInputFoundationRequest(
    baseRequest({ input: { mode: "ManualTable", name: "t", columns, rows: [] } }),
  );
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "TABLE_TOO_MANY_COLUMNS"));
  }
});

test("22. manual-table row limits are enforced", () => {
  const rows = Array.from({ length: 5001 }, () => ["v"]);
  const result = validateCsvManualInputFoundationRequest(
    baseRequest({ input: { mode: "ManualTable", name: "t", columns: ["a"], rows } }),
  );
  assert.equal(result.outcome, "Failure");
  if (result.outcome === "Failure") {
    assert.ok(result.diagnostics.some((d) => d.code === "TABLE_TOO_MANY_ROWS"));
  }
});

test("23. every validation result is immutable", () => {
  const success = validateCsvManualInputFoundationRequest(baseRequest());
  const failure = validateCsvManualInputFoundationRequest(baseRequest({ tenantId: "" }));
  assert.equal(isDeeplyFrozen(success), true);
  assert.equal(isDeeplyFrozen(failure), true);
});

test("24. policies and lifecycle objects are deeply frozen", () => {
  assert.equal(isDeeplyFrozen(CsvManualInputPolicies), true);
  assert.equal(isDeeplyFrozen(CsvManualInputLifecycle.transitions), true);
  assert.equal(isDeeplyFrozen(CsvManualInputFoundation), true);
  assert.equal(isDeeplyFrozen(CsvManualInputContracts), true);
  assert.equal(isDeeplyFrozen(CsvManualInputDiagnosticCatalog.codes), true);
});

test("25. requests are not mutated", () => {
  const request = baseRequest({ input: { ...validCsvFile } });
  const before = JSON.stringify(request);
  validateCsvManualInputFoundationRequest(request);
  assert.equal(JSON.stringify(request), before);
});

test("26. no random or clock-based behavior exists (deterministic results)", () => {
  const a = validateCsvManualInputFoundationRequest(baseRequest({ input: { ...validCsvFile, fileName: "x.txt" } }));
  const b = validateCsvManualInputFoundationRequest(baseRequest({ input: { ...validCsvFile, fileName: "x.txt" } }));
  assert.deepEqual(a, b);
  for (const file of SOURCE_FILES) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/Math\.random|Date\.now|new Date\(/.test(text), false, `clock/random in ${file}`);
  }
});

test("27, 28. no filesystem, network, or parsing behavior exists", () => {
  const forbidden = [
    "node:fs",
    "node:net",
    "node:http",
    "node:https",
    "worker_threads",
    "child_process",
    "TextDecoder",
    "TextEncoder",
    "fetch(",
    "XMLHttpRequest",
  ];
  for (const file of SOURCE_FILES) {
    const text = readFileSync(join(HERE, file), "utf8");
    for (const token of forbidden) {
      assert.equal(text.includes(token), false, `forbidden ${token} in ${file}`);
    }
  }
});

test("29. ownership boundaries are explicit", () => {
  assert.ok(CsvManualInputFoundation.ownership.owns.length > 0);
  assert.ok(CsvManualInputFoundation.ownership.doesNotOwn.length > 0);
  assert.equal(CsvManualInputFoundation.boundaries.modifiesDklRegistries, false);
  assert.equal(CsvManualInputFoundation.boundaries.consumesDklThroughPublicIndexOnly, true);
  assert.equal(CsvManualInputFoundation.boundaries.tenantIsolation, true);
  assert.equal(CsvManualInputFoundation.boundaries.workspaceIsolation, true);
});

test("30. readiness reports FoundationComplete and ReadyForParser", () => {
  const readiness = CsvManualInputFoundation.readiness;
  assert.equal(readiness.status, "FoundationComplete");
  assert.equal(readiness.readiness, "ReadyForParser");
  assert.equal(readiness.dklRegistryConnected, true);
  assert.equal(readiness.tenantBoundaryProtected, true);
  assert.equal(readiness.workspaceBoundaryProtected, true);
  assert.equal(readiness.nextPhase, "INT-1:2 — CSV Parser & Dataset Preview");
  for (const flag of [
    "FoundationComplete",
    "DklRegistryConnected",
    "TenantBoundaryProtected",
    "WorkspaceBoundaryProtected",
    "Deterministic",
    "Immutable",
    "ReadyForParser",
  ]) {
    assert.ok(readiness.completion.includes(flag), `missing ${flag}`);
  }
});

test("version and manual-table happy path are valid", () => {
  assert.equal(CsvManualInputFoundationVersion, "1.0.0");
  const result = validateCsvManualInputFoundationRequest(
    baseRequest({ input: { mode: "ManualTable", name: "t", columns: ["a", "b"], rows: [["1", "2"]] } }),
  );
  assert.equal(result.outcome, "Success");
  if (result.outcome === "Success") {
    assert.equal(result.value.sourceRegistryId, "dsk-datasource-manual-input");
    assert.equal(result.value.connectorRegistryId, "dsk-connector-type-manual-entry");
    assert.equal(result.value.contentTypeRegistryId, "dsk-content-type-manual-record");
  }
});
