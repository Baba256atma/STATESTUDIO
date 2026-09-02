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
  listCsvImportCandidates,
  listCsvRealDataImports,
  listCsvRemovedSourceReferences,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import {
  applyCsvSemanticClarification,
  interpretCsvSemantics,
  nextCsvSemanticClarification,
} from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import {
  beginNcaCsvSemanticClarification,
  csvSemanticClarificationTopicId,
  endNcaCsvSemanticClarification,
} from "../../../lib/manager-object/nexoraNcaCsvSemanticClarification.ts";
import type { NexoraConversationState } from "../../../lib/manager-object/nexoraNca2ConversationStateTypes.ts";
import { projectNexoraDataRailLibrary } from "./nexoraDataRailPresentation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const flow = readFileSync(join(here, "NexoraCsvRealDataImportFlow.tsx"), "utf8");
const shell = readFileSync(join(here, "../NexoraExecutiveShell.tsx"), "utf8");

const otdCsv = "date,OTD\n2026-08-31,94";
const readyCsv = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
const capCsv = "DT,CAP_HRS\n2026-01-01,40";

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
  assert.equal(saved.saved, true, saved.reason);
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

function library() {
  return projectNexoraDataRailLibrary({
    csvImports: listCsvRealDataImports("overview"),
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: null,
    activeLiveSourceContextId: null,
    pendingCandidates: listCsvImportCandidates("overview"),
  });
}

test("DATA-UX:5-FIX4 Add Data starts new intake and does not reopen pending", () => {
  assert.match(explorer, /setCsvIntake\("new"\)/);
  assert.match(explorer, /nexora-rdi2-add-data/);
  assert.match(flow, /nexora-csv-new-intake/);
  assert.match(explorer, /initialCandidate=\{csvIntake === "resume" \? resumingCandidate/);
  assert.doesNotMatch(explorer, /initialCandidate=\{updatingSource \? null : pendingCandidate\}/);
  assert.match(explorer, /csvIntake === "new" \? `new-csv-\$\{intakeNonce\}`/);
  assert.match(explorer, /selectRow\(row\.id\)/);
  assert.doesNotMatch(explorer, /onClick=\{\(\) => \{ setUpdatingSource\(null\); setAdding\(true\); \}\}/);
});

test("DATA-UX:5-FIX4 two pending CSVs coexist with independent IDs, mappings, and previews", () => {
  resetCsvRealDataImportStoreForTests();
  const a = candidateFrom("data-ux3-ambiguous.csv", otdCsv);
  const b = candidateFrom("capacity-new.csv", capCsv);
  assert.notEqual(a.candidateId, b.candidateId);
  assert.equal(listCsvImportCandidates("overview").length, 2);
  assert.equal(listCsvRealDataImports("overview").length, 0);
  const view = library();
  assert.equal(view.pendingCsvCount, 2);
  assert.equal(view.committedCsvCount, 0);
  assert.equal(view.csvCount, 2);
  assert.equal(view.csvEmpty, false);
  assert.deepEqual(view.csvRows.map((row) => row.label).sort(), ["capacity-new.csv", "data-ux3-ambiguous.csv"]);
  assert.ok(a.parse?.columns.some((column) => column.name === "OTD"));
  assert.ok(b.parse?.columns.some((column) => column.name === "CAP_HRS"));
  assert.equal(a.parse?.columns.some((column) => column.name === "CAP_HRS"), false);
  assert.equal(b.mapping?.mappings.some((entry) => entry.sourceColumn === "OTD"), false);
  assert.notEqual(a.mapping?.mappingId, b.mapping?.mappingId);
});

test("DATA-UX:5-FIX4 close keeps both; cancel A leaves B; commit B leaves A pending", () => {
  resetCsvRealDataImportStoreForTests();
  const a = candidateFrom("data-ux3-ambiguous.csv", otdCsv);
  const b = candidateFrom("capacity.csv", readyCsv);
  assert.equal(listCsvImportCandidates("overview").length, 2);
  assert.match(flow, /nexora-csv-review-close/);
  assert.doesNotMatch(flow, /cancelOpenClarification\(\); props\.onClose\(\)/);
  const preparedB = prepareCsvRealDataImport(b.input, b.mapping!);
  assert.equal(preparedB.ready, true, preparedB.errors.join("; "));
  const committed = commitPreparedCsvRealDataImport({
    prepared: preparedB,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: "2026-09-01T18:02:00.000Z",
  });
  assert.equal(committed.committed, true);
  assert.equal(getCsvImportCandidate("overview", b.candidateId), null);
  assert.equal(getCsvImportCandidate("overview", a.candidateId)?.fileName, "data-ux3-ambiguous.csv");
  assert.equal(library().pendingCsvCount, 1);
  assert.equal(library().committedCsvCount, 1);
  discardCsvImportCandidate("overview", a.candidateId);
  assert.equal(listCsvImportCandidates("overview").length, 0);
  assert.equal(listCsvRealDataImports("overview")[0]?.prepared.fileName, "capacity.csv");
  assert.equal(listCsvRemovedSourceReferences("overview").length, 0);
});

test("DATA-UX:5-FIX4 validate A does not affect B; failure cannot become business reality", () => {
  resetCsvRealDataImportStoreForTests();
  const a = candidateFrom("otd-clarification.csv", otdCsv);
  const b = candidateFrom("capacity.csv", readyCsv);
  const preparedA = prepareCsvRealDataImport(a.input, a.mapping!);
  assert.equal(preparedA.ready, false);
  saveCsvImportCandidate(Object.freeze({ ...a, status: "error", prepared: preparedA, error: preparedA.errors[0] ?? "failed" }), { replaceCandidateId: a.candidateId });
  const preparedB = prepareCsvRealDataImport(b.input, b.mapping!);
  assert.equal(preparedB.ready, true);
  saveCsvImportCandidate(Object.freeze({ ...b, status: "ready", prepared: preparedB }), { replaceCandidateId: b.candidateId });
  assert.equal(getCsvImportCandidate("overview", a.candidateId)?.status, "error");
  assert.equal(getCsvImportCandidate("overview", b.candidateId)?.status, "ready");
  assert.equal(listCsvRealDataImports("overview").length, 0);
});

test("DATA-UX:5-FIX4 ASK NEXORA on A does not resolve B; NCA pending stays one question", () => {
  resetCsvRealDataImportStoreForTests();
  const a = candidateFrom("delivery.csv", otdCsv);
  const b = candidateFrom("capacity-new.csv", capCsv);
  const needA = nextCsvSemanticClarification(a.mapping!)!;
  const needB = nextCsvSemanticClarification(b.mapping!);
  assert.ok(needA);
  assert.notEqual(needA.sourceContextId, b.candidateId);
  const resolvedA = applyCsvSemanticClarification(a.mapping!, needA.fieldId, "Yes.");
  assert.equal(resolvedA.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "manager");
  if (needB) {
    assert.equal(b.mapping?.mappings.find((entry) => entry.semantic?.fieldId === needB.fieldId)?.semantic?.confirmationSource, "none");
  }
  const sessionA = beginNcaCsvSemanticClarification(Object.freeze({
    ncaConversationState: null as NexoraConversationState | null,
  }), needA);
  assert.equal(sessionA.ncaConversationState?.pendingQuestion?.relatedSubjectId, needA.fieldId);
  const afterCancelB = endNcaCsvSemanticClarification(sessionA, csvImportCandidateId("overview", "capacity-new.csv"));
  assert.equal(afterCancelB.ncaConversationState?.pendingQuestion?.relatedSubjectId, needA.fieldId);
  const afterCancelA = endNcaCsvSemanticClarification(sessionA, needA.sourceContextId);
  assert.equal(afterCancelA.ncaConversationState?.pendingQuestion, null);
  assert.match(shell, /csvSemanticClarificationTopicId\(sourceContextId\)/);
  assert.match(flow, /onSemanticClarificationRequest/);
});

test("DATA-UX:5-FIX4 same pending filename cannot silently overwrite; committed duplicate is explicit", () => {
  resetCsvRealDataImportStoreForTests();
  const first = candidateFrom("data.csv", otdCsv);
  const second = saveCsvImportCandidate(Object.freeze({
    ...first,
    input: Object.freeze({ ...first.input, importId: "test:data.csv:other" }),
    fileName: "data.csv",
    candidateId: csvImportCandidateId("overview", "data.csv"),
  }));
  assert.equal(second.saved, false);
  assert.equal(second.reason, "pending_duplicate");
  assert.equal(getCsvImportCandidate("overview", first.candidateId)?.input.importId, first.input.importId);
  commitReady("delivery.csv", "fix4-committed");
  assert.match(flow, /nexora-csv-existing-source/);
  assert.match(flow, /Update existing source/);
  assert.match(flow, /A pending source with this filename already exists/);
  assert.match(explorer, /setCsvIntake\("update"\)/);
});

test("DATA-UX:5-FIX4 Engineering Source, Stage, and FIX3 surfaces stay separated", () => {
  assert.match(explorer, /aria-label="Connected sources"/);
  assert.match(explorer, /setAddKind\("live"\)/);
  assert.doesNotMatch(explorer, /nexora-rdi4-live-source[\s\S]{0,200}nexora-csv-columns/);
  assert.match(explorer, /nexora-csv-about/);
  assert.match(flow, /Available after validation/);
  assert.doesNotMatch(flow, /removeCsvRealDataImport/);
  assert.match(explorer, /removeCsvRealDataImport/);
  assert.doesNotMatch(flow, /setInteraction|StageCommand|createDecision|createExecution/);
  assert.match(flow, /data-csv-intake/);
});
