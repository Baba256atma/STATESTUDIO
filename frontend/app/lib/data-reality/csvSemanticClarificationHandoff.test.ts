import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  applyCsvSemanticClarification,
  interpretCsvSemantics,
  nextCsvSemanticClarification,
} from "./csvSemanticUnderstanding.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";
import {
  beginNcaCsvSemanticClarification,
  classifyCsvSemanticClarificationUtterance,
  endNcaCsvSemanticClarification,
  resolveNcaCsvSemanticReply,
} from "../manager-object/nexoraNcaCsvSemanticClarification.ts";
import type { NexoraConversationState } from "../manager-object/nexoraNca2ConversationStateTypes.ts";

const here = dirname(fileURLToPath(import.meta.url));

function emptySession(): Readonly<{
  activeObjectId: null;
  previousActiveObjectId: null;
  activationSource: "none";
  pendingClarification: null;
  ncaConversationState: NexoraConversationState | null;
}> {
  return Object.freeze({
    activeObjectId: null,
    previousActiveObjectId: null,
    activationSource: "none",
    pendingClarification: null,
    ncaConversationState: null,
  });
}

function understand(fileName: string, csvText: string, workspaceId: CsvVerticalSliceInput["workspaceId"] = "overview") {
  const parse = parseCsvDeterministically(csvText);
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `test:${workspaceId}:${fileName}`,
    importedAt: "2026-08-31T20:00:00.000Z",
    observedAt: "2026-08-31T20:00:00.000Z",
  });
  return interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
}

const otdCsv = "date,OTD\n2026-08-31,94";

test("ASK NEXORA emits the next clarification and reuses the same pending field", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review);
  assert.ok(need);
  assert.match(need.question, /OTD/i);
  const first = beginNcaCsvSemanticClarification(emptySession(), need);
  const second = beginNcaCsvSemanticClarification(first, need);
  assert.equal(first.ncaConversationState?.pendingQuestion?.relatedSubjectId, need.fieldId);
  assert.equal(second.ncaConversationState, first.ncaConversationState);
});

test("Yes resolves the pending field; explicit confirmation does too", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review)!;
  const yes = applyCsvSemanticClarification(review, need.fieldId, "Yes.");
  assert.equal(yes.resolved, true);
  assert.equal(yes.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "manager");
  const sentence = applyCsvSemanticClarification(review, need.fieldId, "Yes, OTD means on-time delivery.");
  assert.equal(sentence.resolved, true);
  assert.match(sentence.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmedMeaning ?? "", /on-time delivery/i);
});

test("No rejects the candidate without inventing a replacement", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review)!;
  const rejected = applyCsvSemanticClarification(review, need.fieldId, "No.");
  const semantic = rejected.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic;
  assert.equal(rejected.resolved, false);
  assert.equal(semantic?.confirmationSource, "none");
  assert.equal(semantic?.confirmedMeaning, null);
  assert.notEqual(semantic?.confirmedMeaning, "No");
});

test("correction captures manager meaning; unknown and ignore stay safe", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review)!;
  const corrected = applyCsvSemanticClarification(review, need.fieldId, "No, OTD means order-to-delivery time.");
  assert.equal(corrected.resolved, true);
  assert.equal(corrected.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmedMeaning, "Order-to-delivery time");
  const unknown = applyCsvSemanticClarification(review, need.fieldId, "I don't know.");
  assert.equal(unknown.resolved, false);
  assert.equal(unknown.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.state, "UNKNOWN");
  const ignored = applyCsvSemanticClarification(review, need.fieldId, "Ignore this column.");
  assert.equal(ignored.resolved, true);
  assert.equal(ignored.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.ignored, true);
  const maybe = applyCsvSemanticClarification(review, need.fieldId, "Maybe.");
  assert.equal(maybe.resolved, false);
  assert.notEqual(maybe.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmedMeaning, "Maybe");
});

test("unrelated Advisor questions do not consume CSV clarification pending", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review)!;
  const session = beginNcaCsvSemanticClarification(emptySession(), need);
  assert.equal(classifyCsvSemanticClarificationUtterance("What is Capacity Gap?"), "unrelated");
  assert.equal(resolveNcaCsvSemanticReply(session, "What is Capacity Gap?"), null);
  assert.equal(session.ncaConversationState?.pendingQuestion?.relatedSubjectId, need.fieldId);
  assert.equal(resolveNcaCsvSemanticReply(session, "Yes.")?.kind, "affirm");
});

test("two unresolved columns stay independently scoped", () => {
  const review = understand("production.csv", "DT,OTD,CAP_AV\n2026-08-31,94,820");
  const first = nextCsvSemanticClarification(review)!;
  const afterFirst = applyCsvSemanticClarification(review, first.fieldId, "Yes.").review;
  const second = nextCsvSemanticClarification(afterFirst);
  assert.ok(second);
  assert.notEqual(second.fieldId, first.fieldId);
  assert.equal(afterFirst.mappings.find((entry) => entry.semantic?.fieldId === first.fieldId)?.semantic?.confirmationSource, "manager");
  assert.equal(afterFirst.mappings.find((entry) => entry.semantic?.fieldId === second.fieldId)?.semantic?.confirmationSource, "none");
});

test("same column name in two CSV sources remains source-scoped", () => {
  const a = understand("delivery-a.csv", otdCsv, "overview");
  const b = understand("delivery-b.csv", otdCsv, "workspace-b");
  const needA = nextCsvSemanticClarification(a)!;
  const needB = nextCsvSemanticClarification(b)!;
  assert.notEqual(needA.fieldId, needB.fieldId);
  assert.notEqual(needA.sourceContextId, needB.sourceContextId);
  const resolvedA = applyCsvSemanticClarification(a, needA.fieldId, "Yes.");
  assert.equal(resolvedA.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "manager");
  assert.equal(b.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "none");
});

test("source replacement and removal invalidate stale clarification", () => {
  const review = understand("otd.csv", otdCsv);
  const need = nextCsvSemanticClarification(review)!;
  const session = beginNcaCsvSemanticClarification(emptySession(), need);
  const replacement = interpretCsvSemantics({
    input: Object.freeze({
      workspaceId: "overview" as const,
      fileName: "otd.csv",
      fileSize: 24,
      csvText: "date,OTD\n2026-09-01,91",
      importId: "test:overview:otd.csv:replace",
      importedAt: "2026-08-31T21:00:00.000Z",
      observedAt: "2026-08-31T21:00:00.000Z",
    }),
    parse: parseCsvDeterministically("date,OTD\n2026-09-01,91"),
    structural: suggestCsvColumnMappings(parseCsvDeterministically("date,OTD\n2026-09-01,91").columns, "test:overview:otd.csv:replace"),
  });
  assert.notEqual(replacement.mappingId, review.mappingId);
  const closed = endNcaCsvSemanticClarification(session, need.sourceContextId);
  assert.equal(closed.ncaConversationState?.pendingQuestion, null);
  assert.equal(resolveNcaCsvSemanticReply(closed, "Yes."), null);
});

test("DATA-UX:5-FIX1 wiring: Ask Nexora awaits manager and does not spam or mutate Stage", () => {
  const flow = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraCsvRealDataImportFlow.tsx"), "utf8");
  const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(flow, /Waiting for your answer/);
  assert.match(flow, /That clarification is no longer open/);
  assert.match(flow, /onSemanticClarificationCancel/);
  assert.match(explorer, /awaitingClarificationFieldId/);
  assert.doesNotMatch(explorer, /createEmptyNca|conversationMessages/);
  assert.match(shell, /last\.text === need\.question/);
  assert.match(shell, /endNcaCsvSemanticClarification/);
  const resolveAt = shell.indexOf("const semanticReply = resolveNcaCsvSemanticReply");
  const executeAt = shell.indexOf("executeNexoraConversationalExperience({", resolveAt);
  assert.ok(resolveAt >= 0 && executeAt > resolveAt);
  assert.doesNotMatch(shell.slice(resolveAt, executeAt), /setInteraction|setApplication/);
});
