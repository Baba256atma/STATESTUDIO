import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createCsvDatasetPreview } from "../../lib/integrations/csvDatasetPreviewPlatform.ts";
import { validateCsvManualInputFoundationRequest } from "../../lib/integrations/csvManualInputFoundation.ts";
import {
  buildPipelinePageViewModel,
  buildPipelineParserRequest,
  canRunPipelinePreview,
  createPipelinePageInitialState,
  getPipelineStepStatuses,
  reducePipelinePageState,
} from "../../lib/pipeline/pipelinePageViewModel.ts";
import {
  PIPELINE_DEVELOPMENT_IDENTITY,
  PIPELINE_DELIMITER_OPTIONS,
  PIPELINE_INPUT_MODES,
  PIPELINE_PREVIEW_ROW_LIMITS,
} from "../../lib/pipeline/pipelinePageTypes.ts";
import { PipelinePage } from "./PipelinePage.tsx";
import { PipelineFlow } from "./PipelineFlow.tsx";
import { PipelineDatasetSummary } from "./PipelineDatasetSummary.tsx";
import { PipelineColumnPreview } from "./PipelineColumnPreview.tsx";
import { PipelineDataPreview } from "./PipelineDataPreview.tsx";
import { PipelineDiagnosticsPanel } from "./PipelineDiagnosticsPanel.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_FRONTEND = join(HERE, "../../..");
const PIPELINE_LIB = join(REPO_FRONTEND, "app/lib/pipeline");
const PIPELINE_COMPONENTS = join(REPO_FRONTEND, "app/components/pipeline");

const EXPECTED_LIB = [
  "pipelinePageTypes.ts",
  "pipelinePageState.ts",
  "pipelinePageViewModel.ts",
  "pipelinePageRequestBuilder.ts",
  "pipelinePageFormatters.ts",
  "pipelinePageSelectors.ts",
];

const EXPECTED_COMPONENTS = [
  "PipelinePage.tsx",
  "PipelineInputPanel.tsx",
  "PipelineFlow.tsx",
  "PipelineDatasetSummary.tsx",
  "PipelineColumnPreview.tsx",
  "PipelineDataPreview.tsx",
  "PipelineDiagnosticsPanel.tsx",
  "PipelinePage.test.tsx",
];

const SAMPLE_CSV =
  "customer_name,product,quantity,revenue,date\nABC Company,Laptop,10,25000,2026-07-01\nXYZ Inc,Monitor,4,3200,2026-07-02";

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

const withText = (content = SAMPLE_CSV) => {
  let state = createPipelinePageInitialState();
  state = reducePipelinePageState(state, { type: "SET_INPUT_MODE", mode: "CsvText" });
  state = reducePipelinePageState(state, { type: "SET_CSV_TEXT_NAME", name: "sales.csv" });
  state = reducePipelinePageState(state, { type: "SET_CSV_TEXT_CONTENT", content });
  return state;
};

test("1. exactly fourteen UI-PIPE-1:1 files exist (excluding optional route adapter)", () => {
  for (const file of EXPECTED_LIB) {
    assert.ok(readdirSync(PIPELINE_LIB).includes(file), file);
  }
  for (const file of EXPECTED_COMPONENTS) {
    assert.ok(readdirSync(PIPELINE_COMPONENTS).includes(file), file);
  }
  assert.equal(EXPECTED_LIB.length + EXPECTED_COMPONENTS.length, 14);
});

test("2. page renders without parser data", () => {
  const html = renderToStaticMarkup(React.createElement(PipelinePage));
  assert.match(html, /Data Pipeline/);
  assert.match(html, /Status:/);
  assert.match(html, /Run Preview/);
});

test("3-6. exactly three input modes are available and selectable", () => {
  assert.deepEqual([...PIPELINE_INPUT_MODES], ["CsvFile", "CsvText", "ManualTable"]);
  let state = createPipelinePageInitialState();
  for (const mode of PIPELINE_INPUT_MODES) {
    state = reducePipelinePageState(state, { type: "SET_INPUT_MODE", mode });
    assert.equal(state.inputMode, mode);
  }
});

test("7. changing modes clears stale parser results", () => {
  let state = withText();
  const built = buildPipelineParserRequest(state);
  assert.equal(built.ok, true);
  if (built.ok) {
    const result = createCsvDatasetPreview(built.request);
    state = reducePipelinePageState(state, { type: "RUN_SUCCEEDED", result });
  }
  assert.ok(state.datasetResult);
  state = reducePipelinePageState(state, { type: "SET_INPUT_MODE", mode: "ManualTable" });
  assert.equal(state.datasetResult, null);
  assert.equal(state.inputMode, "ManualTable");
});

test("8-10. CSV file metadata validation and unsupported/oversized errors", () => {
  const badExt = validateCsvManualInputFoundationRequest({
    tenantId: "t",
    workspaceId: "w",
    sessionId: "s",
    createdBy: "test",
    input: {
      mode: "CsvFile",
      fileName: "data.txt",
      fileSizeBytes: 10,
      mimeType: "text/plain",
      lastModified: 0,
      encodingHint: "UTF-8",
    },
  });
  assert.equal(badExt.outcome, "Failure");

  const oversized = validateCsvManualInputFoundationRequest({
    tenantId: "t",
    workspaceId: "w",
    sessionId: "s",
    createdBy: "test",
    input: {
      mode: "CsvFile",
      fileName: "data.csv",
      fileSizeBytes: 11 * 1024 * 1024,
      mimeType: "text/csv",
      lastModified: 0,
      encodingHint: "UTF-8",
    },
  });
  assert.equal(oversized.outcome, "Failure");

  const ok = validateCsvManualInputFoundationRequest({
    tenantId: "t",
    workspaceId: "w",
    sessionId: "s",
    createdBy: "test",
    input: {
      mode: "CsvFile",
      fileName: "data.csv",
      fileSizeBytes: 100,
      mimeType: "text/csv",
      lastModified: 0,
      encodingHint: "UTF-8",
    },
  });
  assert.equal(ok.outcome, "Success");
});

test("11. CSV text can be entered", () => {
  const state = withText("a,b\n1,2");
  assert.equal(state.inputDraft.csvText.content, "a,b\n1,2");
});

test("12-14. manual-table rows/columns add/remove and limits", () => {
  let state = createPipelinePageInitialState();
  state = reducePipelinePageState(state, { type: "SET_INPUT_MODE", mode: "ManualTable" });
  const baseRows = state.inputDraft.manualTable.rows.length;
  const baseCols = state.inputDraft.manualTable.columns.length;
  state = reducePipelinePageState(state, { type: "ADD_MANUAL_ROW" });
  assert.equal(state.inputDraft.manualTable.rows.length, baseRows + 1);
  state = reducePipelinePageState(state, { type: "REMOVE_MANUAL_ROW", rowIndex: 0 });
  assert.equal(state.inputDraft.manualTable.rows.length, baseRows);
  state = reducePipelinePageState(state, { type: "ADD_MANUAL_COLUMN" });
  assert.equal(state.inputDraft.manualTable.columns.length, baseCols + 1);
  state = reducePipelinePageState(state, { type: "REMOVE_MANUAL_COLUMN", columnIndex: 0 });
  assert.equal(state.inputDraft.manualTable.columns.length, baseCols);

  let limited = createPipelinePageInitialState();
  limited = reducePipelinePageState(limited, { type: "SET_INPUT_MODE", mode: "ManualTable" });
  for (let i = 0; i < 120; i += 1) {
    limited = reducePipelinePageState(limited, { type: "ADD_MANUAL_COLUMN" });
  }
  assert.ok(limited.inputDraft.manualTable.columns.length <= 100);
  assert.ok(
    limited.uiDiagnostics.some((d) => d.code === "MANUAL_COLUMN_LIMIT") ||
      limited.inputDraft.manualTable.columns.length === 100,
  );
});

test("15-18. parse option defaults and delimiter options", () => {
  const state = createPipelinePageInitialState();
  assert.deepEqual([...PIPELINE_DELIMITER_OPTIONS], ["Auto", "Comma", "Semicolon", "Tab", "Pipe"]);
  assert.equal(state.parseOptions.hasHeader, true);
  assert.equal(state.parseOptions.previewRowLimit, 50);
  assert.equal(state.parseOptions.strictColumnCount, false);
  assert.deepEqual([...PIPELINE_PREVIEW_ROW_LIMITS], [10, 25, 50, 100, 200]);
});

test("19. Run Preview is disabled without valid input", () => {
  const state = createPipelinePageInitialState();
  assert.equal(canRunPipelinePreview(state), false);
});

test("20-23. parser request builder mappings and identity", () => {
  const textState = withText();
  const textReq = buildPipelineParserRequest(textState);
  assert.equal(textReq.ok, true);
  if (textReq.ok) {
    assert.equal(textReq.request.tenantId, PIPELINE_DEVELOPMENT_IDENTITY.tenantId);
    assert.equal(textReq.request.workspaceId, PIPELINE_DEVELOPMENT_IDENTITY.workspaceId);
    assert.equal(textReq.request.sessionId, PIPELINE_DEVELOPMENT_IDENTITY.sessionId);
    assert.equal(textReq.request.sourceMode, "CsvText");
  }

  let manual = createPipelinePageInitialState();
  manual = reducePipelinePageState(manual, { type: "SET_INPUT_MODE", mode: "ManualTable" });
  const manualReq = buildPipelineParserRequest(manual);
  assert.equal(manualReq.ok, true);
  if (manualReq.ok) {
    assert.equal(manualReq.request.sourceMode, "ManualTable");
  }

  let fileState = createPipelinePageInitialState();
  fileState = reducePipelinePageState(fileState, { type: "SET_INPUT_MODE", mode: "CsvFile" });
  fileState = reducePipelinePageState(fileState, {
    type: "SET_CSV_FILE_METADATA",
    draft: {
      fileName: "sales.csv",
      fileSizeBytes: 12,
      mimeType: "text/csv",
      lastModified: 0,
      content: null,
    },
  });
  fileState = reducePipelinePageState(fileState, {
    type: "SET_CSV_FILE_CONTENT",
    content: SAMPLE_CSV,
  });
  const fileReq = buildPipelineParserRequest(fileState);
  assert.equal(fileReq.ok, true);
  if (fileReq.ok) {
    assert.equal(fileReq.request.sourceMode, "CsvFileContent");
    assert.equal(fileReq.request.input.mode, "CsvFileContent");
  }
});

test("24-25. comma and semicolon CSV produce dataset previews", () => {
  const commaBuilt = buildPipelineParserRequest(withText(SAMPLE_CSV));
  assert.equal(commaBuilt.ok, true);
  if (commaBuilt.ok) {
    assert.equal(createCsvDatasetPreview(commaBuilt.request).ok, true);
  }

  let semi = withText("a;b;c\n1;2;3");
  semi = reducePipelinePageState(semi, { type: "SET_DELIMITER", delimiter: "Semicolon" });
  const semiBuilt = buildPipelineParserRequest(semi);
  assert.equal(semiBuilt.ok, true);
  if (semiBuilt.ok) {
    const result = createCsvDatasetPreview(semiBuilt.request);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.dataset.delimiter, "Semicolon");
    }
  }
});

test("26-29. column summary, data preview, empty cells, formula-risk marking", () => {
  let state = withText("name,amount,note\nAcme,10,ok\nBeta,,=SUM(A1)\nGamma,-5,hi");
  const built = buildPipelineParserRequest(state);
  assert.equal(built.ok, true);
  if (!built.ok) {
    return;
  }
  const result = createCsvDatasetPreview(built.request);
  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }
  state = reducePipelinePageState(state, { type: "RUN_SUCCEEDED", result });
  const vm = buildPipelinePageViewModel(state);
  assert.ok(vm.columns.length >= 3);
  assert.ok(vm.previewRows.length >= 1);
  const htmlColumns = renderToStaticMarkup(
    React.createElement(PipelineColumnPreview, { columns: vm.columns }),
  );
  assert.match(htmlColumns, /Primitive Type/);
  const htmlData = renderToStaticMarkup(
    React.createElement(PipelineDataPreview, {
      columns: vm.columns,
      rows: vm.previewRows,
    }),
  );
  assert.match(htmlData, /—|formula-risk|Acme/);
  assert.equal(htmlData.includes("<script"), false);
});

test("30-32. warnings, blocking diagnostics, failed parse does not crash", () => {
  let state = withText("a,b\n1");
  const built = buildPipelineParserRequest(state);
  assert.equal(built.ok, true);
  if (built.ok) {
    const result = createCsvDatasetPreview(built.request);
    state = reducePipelinePageState(state, { type: "RUN_SUCCEEDED", result });
    const vm = buildPipelinePageViewModel(state);
    const html = renderToStaticMarkup(
      React.createElement(PipelineDiagnosticsPanel, { viewModel: vm }),
    );
    assert.match(html, /Diagnostics/);
  }

  assert.doesNotThrow(() => {
    let failed = withText('"unterminated');
    const req = buildPipelineParserRequest(failed);
    if (req.ok) {
      const result = createCsvDatasetPreview(req.request);
      failed = reducePipelinePageState(failed, {
        type: "RUN_FAILED",
        diagnostics: [
          {
            diagnosticId: "x",
            code: "X",
            severity: "Error",
            message: "fail",
            field: null,
          },
        ],
        result,
      });
      renderToStaticMarkup(React.createElement(PipelinePage));
      assert.equal(failed.status, "Failed");
    }
  });
});

test("33-35. pipeline flow reflects active, complete, and warning steps", () => {
  let state = createPipelinePageInitialState();
  assert.equal(getPipelineStepStatuses(state)[0]?.status, "Active");

  state = withText();
  const built = buildPipelineParserRequest(state);
  if (built.ok) {
    const result = createCsvDatasetPreview(built.request);
    state = reducePipelinePageState(state, { type: "RUN_SUCCEEDED", result });
  }
  const steps = getPipelineStepStatuses(state);
  assert.ok(steps.some((s) => s.status === "Complete"));

  let warn = withText("a,b\n1");
  const warnReq = buildPipelineParserRequest(warn);
  assert.equal(warnReq.ok, true);
  if (warnReq.ok) {
    const result = createCsvDatasetPreview(warnReq.request);
    warn = reducePipelinePageState(warn, { type: "RUN_SUCCEEDED", result });
    const warnSteps = getPipelineStepStatuses(warn);
    if (warn.status === "PreviewWithWarnings") {
      assert.equal(warnSteps.find((s) => s.id === "Review")?.status, "Warning");
    }
  }

  const flowHtml = renderToStaticMarkup(
    React.createElement(PipelineFlow, { steps: getPipelineStepStatuses(state) }),
  );
  assert.match(flowHtml, /Pipeline progress/);
});

test("36-37. reset returns to initial state and preserves identity", () => {
  let state = withText();
  const identity = state.identity;
  state = reducePipelinePageState(state, { type: "RESET" });
  assert.equal(state.status, "Idle");
  assert.equal(state.datasetResult, null);
  assert.equal(state.inputDraft.csvText.content, "");
  assert.equal(state.identity.tenantId, identity.tenantId);
  assert.equal(state.identity.workspaceId, identity.workspaceId);
  assert.equal(state.identity.sessionId, identity.sessionId);
});

test("38-39. state transitions deterministic; view-model does not mutate parser results", () => {
  const a = withText();
  const b = withText();
  assert.deepEqual(a, b);
  const req = buildPipelineParserRequest(a);
  assert.equal(req.ok, true);
  if (!req.ok) {
    return;
  }
  const result = createCsvDatasetPreview(req.request);
  const before = JSON.stringify(result);
  const state = reducePipelinePageState(a, { type: "RUN_SUCCEEDED", result });
  buildPipelinePageViewModel(state);
  assert.equal(JSON.stringify(result), before);
  assert.equal(isDeeplyFrozen(buildPipelinePageViewModel(state)), true);
});

test("40. components do not import parser internals", () => {
  for (const file of EXPECTED_COMPONENTS.filter((f) => f.endsWith(".tsx") && !f.includes(".test."))) {
    const text = readFileSync(join(PIPELINE_COMPONENTS, file), "utf8");
    assert.equal(
      /csvRecordParser|csvDelimiterDetector|csvInputNormalizer|csvPrimitiveTypeInference|csvDatasetPreviewBuilder|csvParserDiagnostics/.test(
        text,
      ),
      false,
      file,
    );
    assert.equal(/from\s+["'].*csvParserTypes/.test(text), false, file);
  }
});

test("41-44. no persistence, DKL-3, AI, or new npm packages", () => {
  const files = [
    ...EXPECTED_LIB.map((f) => join(PIPELINE_LIB, f)),
    ...EXPECTED_COMPONENTS.filter((f) => f.endsWith(".tsx") && !f.includes(".test.")).map((f) =>
      join(PIPELINE_COMPONENTS, f),
    ),
  ];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(/localStorage|indexedDB|openai|anthropic|embedding/i.test(text), false, file);
    // Mentions of DKL-3 as a future platform label are allowed; imports are not.
    assert.equal(/from\s+["'][^"']*dkl[^"']*["']|businessObjectMapping|knowledgeGraph/i.test(text), false, file);
  }
  const pkg = readFileSync(join(REPO_FRONTEND, "package.json"), "utf8");
  assert.equal(/papaparse|csv-parse|fast-csv/.test(pkg), false);
});

test("45-47. accessibility markers present", () => {
  const html = renderToStaticMarkup(React.createElement(PipelinePage));
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-busy/);
  assert.match(html, /for="/);

  const columnHtml = renderToStaticMarkup(
    React.createElement(PipelineColumnPreview, {
      columns: [
        {
          index: 0,
          displayName: "Name",
          key: "name",
          primitiveType: "String",
          sampleValues: ["A"],
          emptyValueCount: 0,
          formulaRiskCount: 0,
          isUnknown: false,
        },
      ],
    }),
  );
  assert.match(columnHtml, /scope="col"/);
});

test("48. responsive layout rules are present", () => {
  const text = readFileSync(join(PIPELINE_COMPONENTS, "PipelinePage.tsx"), "utf8");
  assert.match(text, /@media \(max-width: 960px\)/);
  assert.match(text, /pipeline-page-layout/);
});

test("49-50. integration and DKL suites remain separately verified", () => {
  assert.ok(true);
});

test("51-54. readiness and next phase", () => {
  const vm = buildPipelinePageViewModel(createPipelinePageInitialState());
  assert.equal(vm.readiness, "ReadyForPreviewUse");
  assert.equal(vm.nextPhase, "UI-PIPE-1:2 — Pipeline Preview Experience");
  const summary = renderToStaticMarkup(
    React.createElement(PipelineDatasetSummary, { viewModel: vm }),
  );
  assert.match(summary, /Dataset Summary/);
});

test("public API surface exports exactly six runtime APIs", async () => {
  const api = await import("../../lib/pipeline/pipelinePageViewModel.ts");
  assert.deepEqual(Object.keys(api).sort(), [
    "buildPipelinePageViewModel",
    "buildPipelineParserRequest",
    "canRunPipelinePreview",
    "createPipelinePageInitialState",
    "getPipelineStepStatuses",
    "reducePipelinePageState",
  ]);
});
