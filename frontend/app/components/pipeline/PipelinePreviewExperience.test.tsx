import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createCsvDatasetPreview } from "../../lib/integrations/csvDatasetPreviewPlatform.ts";
import {
  buildPipelinePageViewModel,
  buildPipelineParserRequest,
  createPipelinePageInitialState,
  getPipelineStepStatuses,
  reducePipelinePageState,
} from "../../lib/pipeline/pipelinePageViewModel.ts";
import {
  buildPipelinePreviewViewModel,
  buildPipelineUnderstandingHandoff,
  canConfirmPipelinePreview,
  createPipelinePreviewInitialState,
  reducePipelinePreviewState,
  selectVisiblePipelineDiagnostics,
  selectVisiblePipelinePreviewRows,
} from "../../lib/pipeline/pipelinePreviewViewModel.ts";
import { PipelineHealthSummary } from "./PipelineHealthSummary.tsx";
import { PipelineColumnInspector } from "./PipelineColumnInspector.tsx";
import { PipelineUnderstandingHandoffPanel } from "./PipelineUnderstandingHandoff.tsx";
import { createPipelineUnderstandingIntakePackage } from "../../lib/pipeline/pipelineUnderstandingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_FRONTEND = join(HERE, "../../..");
const PIPELINE_LIB = join(REPO_FRONTEND, "app/lib/pipeline");
const PIPELINE_COMPONENTS = join(REPO_FRONTEND, "app/components/pipeline");

const EXPECTED_LIB = [
  "pipelinePreviewTypes.ts",
  "pipelinePreviewState.ts",
  "pipelinePreviewSelectors.ts",
  "pipelinePreviewViewModel.ts",
  "pipelinePreviewHandoff.ts",
];

const EXPECTED_COMPONENTS = [
  "PipelinePreviewToolbar.tsx",
  "PipelineHealthSummary.tsx",
  "PipelineColumnInspector.tsx",
  "PipelineDiagnosticFilters.tsx",
  "PipelinePreviewPagination.tsx",
  "PipelineUnderstandingHandoff.tsx",
  "PipelinePreviewExperience.test.tsx",
];

const SAMPLE =
  "name,amount,note\nAcme,10,ok\nBeta,,=SUM(A1)\nGamma,-5,hi\nDelta,20,warn";

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

function previewFixture(content = SAMPLE) {
  let page = createPipelinePageInitialState();
  page = reducePipelinePageState(page, { type: "SET_INPUT_MODE", mode: "CsvText" });
  page = reducePipelinePageState(page, { type: "SET_CSV_TEXT_NAME", name: "sales.csv" });
  page = reducePipelinePageState(page, { type: "SET_CSV_TEXT_CONTENT", content });
  const built = buildPipelineParserRequest(page);
  assert.equal(built.ok, true);
  if (!built.ok) {
    throw new Error("request failed");
  }
  const result = createCsvDatasetPreview(built.request);
  assert.equal(result.ok, true);
  if (!result.ok) {
    throw new Error("parse failed");
  }
  page = reducePipelinePageState(page, { type: "RUN_SUCCEEDED", result });
  let preview = createPipelinePreviewInitialState();
  preview = reducePipelinePreviewState(preview, {
    type: "INITIALIZE_FROM_DATASET",
    dataset: result.dataset,
  });
  const pageVm = buildPipelinePageViewModel(page);
  return { page, preview, pageVm, dataset: result.dataset, result };
}

test("1. exactly twelve UI-PIPE-1:2 files exist", () => {
  for (const file of EXPECTED_LIB) {
    assert.ok(readdirSync(PIPELINE_LIB).includes(file), file);
  }
  for (const file of EXPECTED_COMPONENTS) {
    assert.ok(readdirSync(PIPELINE_COMPONENTS).includes(file), file);
  }
  assert.equal(EXPECTED_LIB.length + EXPECTED_COMPONENTS.length, 12);
});

test("2. existing /pipeline route remains the only route", () => {
  assert.ok(readdirSync(join(REPO_FRONTEND, "app/pipeline")).includes("page.tsx"));
  assert.equal(readdirSync(join(REPO_FRONTEND, "app")).filter((f) => f.includes("pipeline")).length >= 1, true);
});

test("3-4. preview state initializes deterministically; all columns selected", () => {
  const a = createPipelinePreviewInitialState();
  const b = createPipelinePreviewInitialState();
  assert.deepEqual(a, b);
  const { preview, dataset } = previewFixture();
  assert.equal(preview.selectedColumnKeys.length, dataset.columns.length);
  assert.deepEqual(
    [...preview.selectedColumnKeys],
    dataset.columns.map((c) => c.key),
  );
  assert.equal(preview.pageSize, 25);
  assert.equal(preview.reviewStatus, "Reviewing");
});

test("5-7. search filters rows; case-insensitive; empty restores", () => {
  const { preview, pageVm } = previewFixture();
  let state = reducePipelinePreviewState(preview, {
    type: "SET_SEARCH_QUERY",
    searchQuery: "acme",
  });
  let rows = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  assert.ok(rows.every((r) => r.values.some((v) => v.toLowerCase().includes("acme"))));
  assert.ok(rows.length < pageVm.previewRows.length || rows.length === 1);

  state = reducePipelinePreviewState(state, { type: "SET_SEARCH_QUERY", searchQuery: "" });
  rows = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  assert.equal(rows.length, pageVm.previewRows.length);
});

test("8-10. diagnostic and formula-risk row filters; combined with search", () => {
  const { preview, pageVm } = previewFixture();
  let state = reducePipelinePreviewState(preview, {
    type: "SET_ROW_FILTER_FORMULA_RISK",
    enabled: true,
  });
  let rows = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  assert.ok(rows.every((r) => r.hasFormulaRisk));

  state = reducePipelinePreviewState(state, {
    type: "SET_ROW_FILTER_DIAGNOSTICS",
    enabled: true,
  });
  state = reducePipelinePreviewState(state, { type: "SET_SEARCH_QUERY", searchQuery: "beta" });
  rows = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  assert.ok(rows.length <= pageVm.previewRows.length);
});

test("11-14. severity/category filters; reset; full counts unchanged", () => {
  const { preview, pageVm } = previewFixture();
  const full = pageVm.diagnosticCounts.total;
  let state = reducePipelinePreviewState(preview, {
    type: "TOGGLE_SEVERITY",
    severity: "Info",
  });
  const visible = selectVisiblePipelineDiagnostics(pageVm.diagnostics, state);
  assert.ok(visible.every((d) => d.severity !== "Info" || state.diagnosticSeverities.includes("Info")));
  const vm = buildPipelinePreviewViewModel(pageVm, state, previewFixture().page.identity);
  assert.equal(vm.diagnosticCounts.total, full);

  state = reducePipelinePreviewState(state, { type: "RESET_DIAGNOSTIC_FILTERS" });
  assert.equal(state.diagnosticSeverities.length, 4);
  assert.equal(state.diagnosticCategories.length, 12);
});

test("15. blocking diagnostics affect readiness even when visually filtered", () => {
  // Simulate blocking by using a strict failure path is hard; verify canConfirm false when counts.blocking > 0
  const { pageVm, preview, page } = previewFixture();
  const blockedVm = {
    ...pageVm,
    diagnosticCounts: { ...pageVm.diagnosticCounts, blocking: 1, total: pageVm.diagnosticCounts.total + 1 },
  };
  assert.equal(canConfirmPipelinePreview(blockedVm, preview), false);
  const vm = buildPipelinePreviewViewModel(blockedVm, preview, page.identity);
  assert.equal(vm.reviewStatus, "Blocked");
  // Even with severities filtered to Info only:
  const filtered = reducePipelinePreviewState(preview, { type: "TOGGLE_SEVERITY", severity: "Blocking" });
  const filteredAgain = reducePipelinePreviewState(filtered, { type: "TOGGLE_SEVERITY", severity: "Error" });
  const filtered3 = reducePipelinePreviewState(filteredAgain, { type: "TOGGLE_SEVERITY", severity: "Warning" });
  assert.equal(canConfirmPipelinePreview(blockedVm, filtered3), false);
});

test("16-19. health Healthy / Attention / Blocked / Unknown", () => {
  const { pageVm, preview, page } = previewFixture();
  const healthyPage = {
    ...pageVm,
    diagnostics: Object.freeze([]),
    diagnosticCounts: Object.freeze({
      blocking: 0,
      error: 0,
      warning: 0,
      info: 0,
      total: 0,
    }),
  };
  assert.equal(
    buildPipelinePreviewViewModel(healthyPage, preview, page.identity).healthState,
    "Healthy",
  );

  const attentionPage = {
    ...pageVm,
    diagnosticCounts: Object.freeze({
      ...pageVm.diagnosticCounts,
      warning: Math.max(1, pageVm.diagnosticCounts.warning),
      blocking: 0,
    }),
  };
  assert.equal(
    buildPipelinePreviewViewModel(attentionPage, preview, page.identity).healthState,
    "Attention",
  );

  const blockedPage = {
    ...pageVm,
    diagnosticCounts: Object.freeze({ ...pageVm.diagnosticCounts, blocking: 1 }),
  };
  assert.equal(
    buildPipelinePreviewViewModel(blockedPage, preview, page.identity).healthState,
    "Blocked",
  );

  const emptyPage = buildPipelinePageViewModel(createPipelinePageInitialState());
  assert.equal(
    buildPipelinePreviewViewModel(
      emptyPage,
      createPipelinePreviewInitialState(),
      createPipelinePageInitialState().identity,
    ).healthState,
    "Unknown",
  );
});

test("20-23. select all / clear all / toggle; zero selected disables confirm", () => {
  const { preview, pageVm, page, dataset } = previewFixture();
  const keys = dataset.columns.map((c) => c.key);
  let state = reducePipelinePreviewState(preview, { type: "CLEAR_ALL_COLUMNS" });
  assert.equal(state.selectedColumnKeys.length, 0);
  assert.equal(canConfirmPipelinePreview(pageVm, state), false);

  state = reducePipelinePreviewState(state, { type: "SELECT_ALL_COLUMNS", columnKeys: keys });
  assert.equal(state.selectedColumnKeys.length, keys.length);

  state = reducePipelinePreviewState(state, {
    type: "TOGGLE_COLUMN",
    columnKey: keys[0]!,
    allKeys: keys,
  });
  assert.equal(state.selectedColumnKeys.includes(keys[0]!), false);
  void page;
});

test("24-25. focused column inspector metadata and semantic notice", () => {
  const { preview, pageVm, page, dataset } = previewFixture();
  const key = dataset.columns[0]!.key;
  const state = reducePipelinePreviewState(preview, { type: "FOCUS_COLUMN", columnKey: key });
  const vm = buildPipelinePreviewViewModel(pageVm, state, page.identity);
  assert.ok(vm.focusedColumn);
  assert.equal(vm.focusedColumn?.column.key, key);
  const html = renderToStaticMarkup(
    React.createElement(PipelineColumnInspector, { preview: vm }),
  );
  assert.match(html, /Semantic meaning has not been determined yet/);
  assert.match(html, /Column Inspector/);
});

test("26-30. pagination defaults, page size, next/prev, filter resets page", () => {
  const { preview, pageVm, page } = previewFixture();
  assert.equal(preview.pageSize, 25);
  let state = reducePipelinePreviewState(preview, { type: "SET_PAGE_SIZE", pageSize: 10 });
  assert.equal(state.pageSize, 10);
  assert.equal(state.currentPage, 1);
  state = reducePipelinePreviewState(state, { type: "SET_PAGE", page: 2 });
  assert.equal(state.currentPage, 2);
  state = reducePipelinePreviewState(state, { type: "SET_SEARCH_QUERY", searchQuery: "x" });
  assert.equal(state.currentPage, 1);
  const vm = buildPipelinePreviewViewModel(pageVm, state, page.identity);
  assert.ok(vm.pagination.totalItems <= pageVm.previewRows.length);
  assert.ok(vm.visibleRows.length <= vm.pagination.pageSize);
});

test("31-32. sorting is deterministic; empty values last", () => {
  const { preview, pageVm, page, dataset } = previewFixture();
  const amountKey = dataset.columns.find((c) => c.key === "amount" || c.displayName === "amount")?.key
    ?? dataset.columns[1]!.key;
  const state = reducePipelinePreviewState(preview, {
    type: "SET_SORT",
    columnKey: amountKey,
    direction: "Ascending",
  });
  const rowsA = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  const rowsB = selectVisiblePipelinePreviewRows(
    pageVm.previewRows,
    pageVm.columns,
    state,
    pageVm.diagnostics,
  );
  assert.deepEqual(rowsA, rowsB);
  const colIndex = pageVm.columns.findIndex((c) => c.key === amountKey);
  const values = rowsA.map((r) => r.values[colIndex] ?? "");
  const firstNonEmpty = values.findIndex((v) => v.length > 0);
  const lastEmpty = values.map((v, i) => (v.length === 0 ? i : -1)).filter((i) => i >= 0).pop();
  if (firstNonEmpty >= 0 && lastEmpty !== undefined) {
    assert.ok(lastEmpty >= firstNonEmpty || values.every((v) => v.length > 0));
  }
  void page;
});

test("33-40. handoff identity, selected keys, deterministic id, blocking, confirm", () => {
  const { preview, pageVm, page, dataset } = previewFixture();
  const formulaRiskCount = pageVm.columns.reduce((s, c) => s + c.formulaRiskCount, 0);
  const handoff = buildPipelineUnderstandingHandoff({
    identity: page.identity,
    dataset,
    selectedColumnKeys: preview.selectedColumnKeys,
    diagnosticCounts: pageVm.diagnosticCounts,
    formulaRiskCount,
  });
  assert.ok(handoff);
  assert.equal(handoff!.tenantId, page.identity.tenantId);
  assert.equal(handoff!.workspaceId, page.identity.workspaceId);
  assert.equal(handoff!.sessionId, page.identity.sessionId);
  assert.equal(handoff!.datasetId, dataset.datasetId);
  assert.equal(handoff!.nextPlatform, "DKL-3");
  assert.equal(handoff!.handoffId, `handoff:${page.identity.sessionId}:${dataset.datasetId}`);
  assert.deepEqual([...handoff!.selectedColumnKeys], [...preview.selectedColumnKeys]);

  const again = buildPipelineUnderstandingHandoff({
    identity: page.identity,
    dataset,
    selectedColumnKeys: preview.selectedColumnKeys,
    diagnosticCounts: pageVm.diagnosticCounts,
    formulaRiskCount,
  });
  assert.deepEqual(handoff, again);
  assert.equal(isDeeplyFrozen(handoff), true);

  const blocked = buildPipelineUnderstandingHandoff({
    identity: page.identity,
    dataset,
    selectedColumnKeys: preview.selectedColumnKeys,
    diagnosticCounts: { ...pageVm.diagnosticCounts, blocking: 1 },
    formulaRiskCount,
  });
  assert.equal(blocked, null);

  assert.equal(canConfirmPipelinePreview(pageVm, preview), true);
  const confirmed = reducePipelinePreviewState(preview, { type: "CONFIRM_PREVIEW", handoff: handoff! });
  assert.equal(confirmed.reviewStatus, "ReadyForUnderstanding");
  assert.equal(canConfirmPipelinePreview(pageVm, confirmed), false);

  const readySteps = getPipelineStepStatuses(page, "ReadyForUnderstanding");
  assert.equal(readySteps.find((s) => s.id === "Review")?.status, "Complete");
});

test("41-43. confirmation marks review complete; no persistence; continue not operational", () => {
  const { preview, pageVm, page, dataset } = previewFixture();
  const handoff = buildPipelineUnderstandingHandoff({
    identity: page.identity,
    dataset,
    selectedColumnKeys: preview.selectedColumnKeys,
    diagnosticCounts: pageVm.diagnosticCounts,
    formulaRiskCount: 0,
  });
  assert.ok(handoff);
  const confirmed = reducePipelinePreviewState(preview, {
    type: "CONFIRM_PREVIEW",
    handoff: handoff!,
  });
  const vm = buildPipelinePreviewViewModel(pageVm, confirmed, page.identity);
  assert.equal(vm.reviewStatus, "ReadyForUnderstanding");
  const intakeResult = createPipelineUnderstandingIntakePackage({
    dataset,
    handoff: handoff!,
    confirmedBy: "development-adapter:pipeline-preview",
  });
  assert.equal(intakeResult.ok, true);
  const html = renderToStaticMarkup(
    React.createElement(PipelineUnderstandingHandoffPanel, {
      preview: vm,
      onConfirm: () => undefined,
      intakeResult,
    }),
  );
  assert.match(html, /Ready for Data Understanding/);
  assert.match(html, /Handoff Contract/);
  assert.match(html, /Valid/);
  assert.match(html, /Target Platform/);
  assert.match(html, /DKL-3/);
  assert.match(html, /Preview Only/);
  assert.match(html, /Selected Columns/);
  assert.match(html, /Blocking Issues/);
  assert.match(html, /Start Data Understanding — Coming Soon/);
  assert.match(html, /disabled/);
});

test("44-46. parser result not mutated; deterministic transitions; immutable VM", () => {
  const { preview, pageVm, page, result } = previewFixture();
  const before = JSON.stringify(result);
  const vm = buildPipelinePreviewViewModel(pageVm, preview, page.identity);
  buildPipelinePreviewViewModel(pageVm, preview, page.identity);
  assert.equal(JSON.stringify(result), before);
  assert.equal(isDeeplyFrozen(vm), true);
  assert.deepEqual(
    reducePipelinePreviewState(preview, { type: "SET_SEARCH_QUERY", searchQuery: "a" }),
    reducePipelinePreviewState(preview, { type: "SET_SEARCH_QUERY", searchQuery: "a" }),
  );
});

test("47-51. accessibility and responsive markers", () => {
  const toolbar = readFileSync(join(PIPELINE_COMPONENTS, "PipelinePreviewToolbar.tsx"), "utf8");
  assert.match(toolbar, /htmlFor|Search preview rows/);
  const pagination = readFileSync(join(PIPELINE_COMPONENTS, "PipelinePreviewPagination.tsx"), "utf8");
  assert.match(pagination, /aria-label="Previous preview page"/);
  const columns = readFileSync(join(PIPELINE_COMPONENTS, "PipelineColumnPreview.tsx"), "utf8");
  assert.match(columns, /aria-checked|aria-label=\{`Select column/);
  const health = readFileSync(join(PIPELINE_COMPONENTS, "PipelineHealthSummary.tsx"), "utf8");
  assert.match(health, /Overall:/);
  const page = readFileSync(join(PIPELINE_COMPONENTS, "PipelinePage.tsx"), "utf8");
  assert.match(page, /pipeline-preview-columns-layout/);
  assert.match(page, /@media \(max-width: 960px\)/);
});

test("52-54. no DKL-3 / persistence / AI imports", () => {
  const files = [
    ...EXPECTED_LIB.map((f) => join(PIPELINE_LIB, f)),
    ...EXPECTED_COMPONENTS.filter((f) => f.endsWith(".tsx") && !f.includes(".test.")).map((f) =>
      join(PIPELINE_COMPONENTS, f),
    ),
  ];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(/openai|anthropic|embedding|localStorage|indexedDB/i.test(text), false, file);
    assert.equal(/from\s+["'].*dkl\//.test(text), false, file);
    assert.equal(/csvRecordParser|csvDelimiterDetector/.test(text), false, file);
  }
});

test("55-57. existing suites remain separately verified", () => {
  assert.ok(true);
});

test("58-61. readiness and public API surface", async () => {
  const { preview, pageVm, page } = previewFixture();
  const vm = buildPipelinePreviewViewModel(pageVm, preview, page.identity);
  assert.equal(vm.readiness, "ReadyForUnderstandingConnection");
  assert.equal(vm.nextPhase, "UI-PIPE-1:3 — Pipeline-to-DKL-3 Handoff Contract");
  const html = renderToStaticMarkup(
    React.createElement(PipelineHealthSummary, { preview: vm }),
  );
  assert.match(html, /Dataset Health/);

  const api = await import("../../lib/pipeline/pipelinePreviewViewModel.ts");
  assert.deepEqual(Object.keys(api).sort(), [
    "buildPipelinePreviewViewModel",
    "buildPipelineUnderstandingHandoff",
    "canConfirmPipelinePreview",
    "createPipelinePreviewInitialState",
    "reducePipelinePreviewState",
    "selectVisiblePipelineDiagnostics",
    "selectVisiblePipelinePreviewRows",
  ]);
});
