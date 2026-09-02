import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  discardCsvImportCandidate,
  getCsvImportCandidate,
  getCsvRemovedSourceReference,
  listCsvImportCandidates,
  listCsvRealDataImports,
  listCsvRemovedSourceReferences,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import { describeCsvSourceForManager, projectNexoraDataRailLibrary } from "./nexoraDataRailPresentation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const flow = readFileSync(join(here, "NexoraCsvRealDataImportFlow.tsx"), "utf8");
const shell = readFileSync(join(here, "../NexoraExecutiveShell.tsx"), "utf8");

const otdCsv = "date,OTD\n2026-08-31,94";
const readyCsv = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";

function candidateFrom(fileName: string, csvText: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `test:${fileName}`,
    importedAt: "2026-09-01T18:00:00.000Z",
    observedAt: "2026-09-01T18:00:00.000Z",
  });
  const parse = parseCsvDeterministically(csvText);
  const mapping = interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
  const saved = saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", fileName),
    fileName,
    status: "preview" as const,
    input,
    parse,
    mapping,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
  assert.equal(saved.saved, true);
  return saved.candidate;
}

function commitReady(fileName: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName,
    fileSize: readyCsv.length,
    csvText: readyCsv,
    importId,
    importedAt: "2026-09-01T18:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: "2026-09-01T18:00:01.000Z",
  });
  assert.ok(result.current);
  return result.current;
}

test("DATA-UX:5-FIX3 pending candidate is not a committed source and appears PENDING", () => {
  resetCsvRealDataImportStoreForTests();
  const pending = candidateFrom("otd-clarification.csv", otdCsv);
  assert.equal(listCsvRealDataImports("overview").length, 0);
  assert.equal(getCsvImportCandidate("overview", pending.candidateId)?.fileName, "otd-clarification.csv");
  const library = projectNexoraDataRailLibrary({
    csvImports: listCsvRealDataImports("overview"),
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: null,
    activeLiveSourceContextId: null,
    pendingCandidates: [pending],
  });
  assert.equal(library.pendingCsvCount, 1);
  assert.equal(library.committedCsvCount, 0);
  assert.equal(library.csvCount, 1);
  assert.equal(library.csvEmpty, false);
  assert.equal(library.csvRows[0]?.statusLabel, "Pending");
  assert.equal(library.csvRows[0]?.label, "otd-clarification.csv");
  assert.match(explorer, /nexora-csv-pending-row/);
  assert.match(flow, /Pending review/);
});

test("DATA-UX:5-FIX3 close keeps candidate; cancel discards without DATA-UX:5 history", () => {
  resetCsvRealDataImportStoreForTests();
  const kept = commitReady("delivery.csv", "fix3-kept");
  const pending = candidateFrom("otd-clarification.csv", otdCsv);
  assert.equal(getCsvImportCandidate("overview", pending.candidateId)?.fileName, "otd-clarification.csv");
  assert.equal(listCsvRealDataImports("overview").length, 1);
  assert.match(flow, /nexora-csv-review-close/);
  assert.doesNotMatch(flow, /cancelOpenClarification\(\); props\.onClose\(\)/);
  assert.match(flow, /nexora-csv-cancel-import/);
  assert.doesNotMatch(flow, /Cancel import[\s\S]{0,80}removeCsvRealDataImport/);
  const discarded = discardCsvImportCandidate("overview", csvImportCandidateId("overview", "otd-clarification.csv"));
  assert.equal(discarded?.fileName, "otd-clarification.csv");
  assert.equal(getCsvImportCandidate("overview", csvImportCandidateId("overview", "otd-clarification.csv")), null);
  assert.equal(listCsvRealDataImports("overview")[0]?.sourceContextId, kept.sourceContextId);
  assert.equal(listCsvRemovedSourceReferences("overview").length, 0);
  assert.equal(getCsvRemovedSourceReference("overview", kept.sourceContextId), null);
});

test("DATA-UX:5-FIX3 validation failure does not commit; success uses canonical commit", () => {
  resetCsvRealDataImportStoreForTests();
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName: "otd-clarification.csv",
    fileSize: otdCsv.length,
    csvText: otdCsv,
    importId: "fix3-otd",
    importedAt: "2026-09-01T18:00:00.000Z",
  });
  const parse = parseCsvDeterministically(otdCsv);
  const mapping = interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
  const prepared = prepareCsvRealDataImport(input, mapping);
  assert.equal(prepared.ready, false);
  assert.equal(listCsvRealDataImports("overview").length, 0);
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", "otd-clarification.csv"),
    fileName: "otd-clarification.csv",
    status: "error" as const,
    input,
    parse,
    mapping,
    prepared,
    error: prepared.errors[0] ?? "Validation failed.",
    replacementSourceContextId: null,
  }));
  assert.equal(getCsvImportCandidate("overview", csvImportCandidateId("overview", "otd-clarification.csv"))?.status, "error");
  assert.match(flow, /Use this data/);
  assert.match(flow, /commitPreparedCsvRealDataImport/);
  const ready = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity.csv",
    fileSize: readyCsv.length,
    csvText: readyCsv,
    importId: "fix3-ready",
    importedAt: "2026-09-01T18:01:00.000Z",
  });
  assert.equal(ready.ready, true);
  const committed = commitPreparedCsvRealDataImport({
    prepared: ready,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: "2026-09-01T18:01:01.000Z",
  });
  assert.equal(committed.committed, true);
  assert.equal(getCsvImportCandidate("overview", csvImportCandidateId("overview", "capacity.csv")), null);
  assert.equal(listCsvRealDataImports("overview").length, 1);
});

test("DATA-UX:5-FIX3 manager detail is grounded, preview is read-only, and lists stay separate", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commitReady("delivery.csv", "fix3-detail");
  const explanation = describeCsvSourceForManager({
    fileName: source.prepared.fileName,
    mapping: source.prepared.mapping,
    relatedObjectLabels: ["Capacity"],
  });
  assert.match(explanation, /Nexora understands/);
  assert.doesNotMatch(explanation, /caused|LLM|invent/i);
  assert.match(explorer, /nexora-csv-about/);
  assert.match(explorer, /nexora-csv-columns/);
  assert.match(explorer, /nexora-csv-committed-preview/);
  assert.match(explorer, /Preview only\. This does not change the source/);
  assert.match(explorer, /data-source-lifecycle=\{row\.lifecycle\}/);
  assert.match(explorer, /aria-label="Connected sources"/);
  assert.doesNotMatch(explorer, /nexora-rdi4-live-source[\s\S]{0,200}nexora-csv-columns/);
  assert.match(flow, /Available after validation/);
  assert.match(explorer, /removeCsvRealDataImport/);
  assert.match(flow, /onSemanticClarificationRequest/);
  assert.match(shell, /dataRailSelectedSourceId/);
  const other = commitReady("orders.csv", "fix3-orders");
  assert.notEqual(source.sourceContextId, other.sourceContextId);
});

test("DATA-UX:5-FIX3 pending mappings do not leak into a committed peer", () => {
  resetCsvRealDataImportStoreForTests();
  const committed = commitReady("delivery.csv", "fix3-peer");
  const pending = candidateFrom("otd-clarification.csv", otdCsv);
  assert.notEqual(pending.mapping?.mappingId, committed.prepared.mapping.mappingId);
  assert.equal(listCsvRealDataImports("overview")[0]?.prepared.fileName, "delivery.csv");
  assert.ok(pending.mapping?.mappings.some((entry) => entry.sourceColumn === "OTD"));
  assert.equal(committed.prepared.mapping.mappings.some((entry) => entry.sourceColumn === "OTD"), false);
});

test("DATA-UX:5-FIX3 cancel does not remove another CSV and empty copy stays csv-library scoped", () => {
  resetCsvRealDataImportStoreForTests();
  const kept = commitReady("delivery.csv", "fix3-keep-cancel");
  candidateFrom("otd-clarification.csv", otdCsv);
  discardCsvImportCandidate("overview", csvImportCandidateId("overview", "otd-clarification.csv"));
  assert.equal(listCsvRealDataImports("overview").length, 1);
  removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: kept.sourceContextId,
    activeSourceContextId: null,
  });
  const library = projectNexoraDataRailLibrary({
    csvImports: listCsvRealDataImports("overview"),
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: null,
    activeLiveSourceContextId: null,
    pendingCandidates: listCsvImportCandidates("overview"),
  });
  assert.equal(library.csvEmpty, true);
  assert.equal(library.pendingCsvCount, 0);
});
