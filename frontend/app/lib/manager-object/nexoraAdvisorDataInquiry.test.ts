import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  csvImportCandidateId,
  exportCsvRealDataImportState,
  getCsvImportCandidate,
  hydrateCsvRealDataImportState,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { applyCsvSemanticClarification, interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import { ADVISOR_DATA_CONTEXT_BOUNDARY, projectAdvisorDataContext } from "./nexoraAdvisorDataContext.ts";
import {
  answerAdvisorDataInquiry,
  applyAdvisorDataSemanticClarification,
  emptyAdvisorDataDialogue,
} from "./nexoraAdvisorDataInquiry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const inquirySource = readFileSync(join(here, "nexoraAdvisorDataInquiry.ts"), "utf8");
const contextSource = readFileSync(join(here, "nexoraAdvisorDataContext.ts"), "utf8");
const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
const orchestrator = readFileSync(join(here, "../conversational-control/conversationalExperienceResponse.ts"), "utf8");

const T0 = "2026-09-02T20:00:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";

function mappingFor(fileName: string, csvText: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `adv1:${fileName}`,
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(csvText);
  return interpretCsvSemantics({ input, parse, structural: suggestCsvColumnMappings(parse.columns, input.importId) });
}

function savePending(fileName: string, csvText: string, mapping = mappingFor(fileName, csvText)) {
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", fileName),
    fileName,
    status: "preview",
    input: Object.freeze({
      workspaceId: "overview" as const,
      fileName,
      fileSize: csvText.length,
      csvText,
      importId: `adv1:${fileName}`,
      importedAt: T0,
    }),
    parse: parseCsvDeterministically(csvText),
    mapping,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
}

test("DATA-ADV:1 library, field, pending vs committed, and no I-couldn't-find for ORD_QTY", () => {
  resetCsvRealDataImportStoreForTests();
  savePending("orders.csv", ambiguous);
  const context = projectAdvisorDataContext("overview");
  assert.equal(context.sources.some((entry) => entry.label === "orders.csv" && entry.lifecycle === "pending"), true);
  const files = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What files do we have?" });
  assert.match(files?.text ?? "", /orders\.csv/i);
  assert.match(files?.text ?? "", /reviewed/i);
  const field = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "what is ORD_QTY ?" });
  assert.match(field?.text ?? "", /ORD_QTY is a field in orders\.csv/i);
  assert.doesNotMatch(field?.text ?? "", /couldn't find a clear match/i);
  assert.equal(field?.mutatesStage, false);
  assert.equal(ADVISOR_DATA_CONTEXT_BOUNDARY.ownsDataReality, false);
});

test("DATA-ADV:1 confirmed vs likely, continuity, multi-source ABC, missing supplier", () => {
  resetCsvRealDataImportStoreForTests();
  const review = mappingFor("orders.csv", ambiguous);
  const otd = review.mappings.find((entry) => entry.sourceColumn === "OTD")!;
  savePending("orders.csv", ambiguous, updateCsvColumnMapping(review, otd.columnIndex, "shipping.on-time"));
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity.csv",
    fileSize: ready.length,
    csvText: ready,
    importId: "adv1-cap",
    importedAt: T0,
  });
  assert.equal(prepared.ready, true);
  commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: T0 });

  const otdAsk = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Which file contains OTD?" });
  assert.match(otdAsk?.text ?? "", /orders\.csv/i);

  const first = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "what is ORD_QTY?" });
  const explain = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "explain it", dialogue: first?.dialogue });
  assert.match(explain?.text ?? "", /ORD_QTY/i);
  const from = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "which file is it from?", dialogue: first?.dialogue });
  assert.match(from?.text ?? "", /orders\.csv/i);
  const rest = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "what else is in that file?", dialogue: first?.dialogue });
  assert.match(rest?.text ?? "", /orders\.csv|OTD|under review/i);

  const capacity = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What does capacity.csv contain?" });
  assert.match(capacity?.text ?? "", /ready/i);
  const objects = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Which objects use capacity.csv?" });
  assert.match(objects?.text ?? "", /Capacity/);
  assert.match(objects?.text ?? "", /not a claim/i);
  const forCapacity = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What data do we have for Capacity?" });
  assert.match(forCapacity?.text ?? "", /capacity\.csv/i);
  const investigate = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "I want to investigate our delivery problem. What data can help me?" });
  assert.match(investigate?.text ?? "", /investigation order|not a claim that one source caused/i);
  const supplier = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "Do we have supplier data?" });
  assert.match(supplier?.text ?? "", /don't see an accepted supplier/i);

  resetCsvRealDataImportStoreForTests();
  const aText = "ABC\n1";
  const bText = "ABC\n2";
  const mapA = updateCsvColumnMapping(mappingFor("source-a.csv", aText), 0, "warehouse.used");
  const mapB = updateCsvColumnMapping(mappingFor("source-b.csv", bText), 0, "cost.operating");
  savePending("source-a.csv", aText, mapA);
  savePending("source-b.csv", bText, mapB);
  const abc = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What is ABC?" });
  assert.match(abc?.text ?? "", /source-a\.csv and source-b\.csv/i);
  assert.match(abc?.text ?? "", /Which source/i);
});

test("DATA-ADV:1 semantic write uses existing authority; isolation; no Stage/Decision writers", () => {
  resetCsvRealDataImportStoreForTests();
  const review = mappingFor("orders.csv", ambiguous);
  savePending("orders.csv", ambiguous, review);
  const field = review.mappings.find((entry) => entry.sourceColumn === "OTD")!;
  const answer = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "what is OTD?" });
  assert.ok(answer?.clarification);
  const written = applyAdvisorDataSemanticClarification("overview", csvImportCandidateId("overview", "orders.csv"), field.semantic!.fieldId, "Yes.");
  assert.equal(written.resolved, true);
  const candidate = getCsvImportCandidate("overview", csvImportCandidateId("overview", "orders.csv"));
  assert.equal(candidate?.mapping?.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "manager");
  const other = getCsvImportCandidate("workspace-b", csvImportCandidateId("workspace-b", "orders.csv"));
  assert.equal(other, null);
  const unknown = applyCsvSemanticClarification(candidate!.mapping!, field.semantic!.fieldId, "I don't know.");
  assert.equal(unknown.resolved, false);
  assert.match(contextSource, /projectAdvisorDataContext/);
  assert.doesNotMatch(inquirySource, /commitPreparedCsvRealDataImport|createDecision|onSelectSubject/);
  assert.match(shell, /answerAdvisorDataInquiry/);
  assert.match(orchestrator, /couldn't find a clear match/);
  assert.match(inquirySource, /applyCsvSemanticClarification/);
  void emptyAdvisorDataDialogue;
});

test("DATA-ADV:1 restore, project fixtures, unknown, and correction stay source-scoped", () => {
  resetCsvRealDataImportStoreForTests();
  const review = mappingFor("operations.csv", ambiguous);
  const otd = review.mappings.find((entry) => entry.sourceColumn === "OTD")!;
  savePending("operations.csv", ambiguous, updateCsvColumnMapping(review, otd.columnIndex, "shipping.on-time"));
  const snapshot = exportCsvRealDataImportState();
  resetCsvRealDataImportStoreForTests();
  hydrateCsvRealDataImportState(snapshot);
  const restored = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What is OTD?" });
  assert.match(restored?.text ?? "", /OTD means/i);
  assert.match(restored?.text ?? "", /operations\.csv/i);

  resetCsvRealDataImportStoreForTests();
  const schedule = "progress,cost,resources\n80,100,12";
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "schedule.csv",
    fileSize: schedule.length,
    csvText: schedule,
    importId: "adv1-schedule",
    importedAt: T0,
  });
  if (prepared.ready) {
    commitPreparedCsvRealDataImport({ prepared, expectedWorkspaceId: "overview", mode: "new", committedAt: T0 });
  } else {
    savePending("schedule.csv", schedule);
  }
  const delay = answerAdvisorDataInquiry({
    workspaceId: "overview",
    utterance: "What data can help me understand the project delay?",
  });
  assert.match(delay?.text ?? "", /schedule\.csv|accepted data|investigation order|don't see accepted/i);
  assert.doesNotMatch(delay?.text ?? "", /\bcaused the\b/i);

  resetCsvRealDataImportStoreForTests();
  const pendingReview = mappingFor("orders.csv", ambiguous);
  savePending("orders.csv", ambiguous, pendingReview);
  const qty = pendingReview.mappings.find((entry) => entry.sourceColumn === "ORD_QTY")!;
  const unknown = applyAdvisorDataSemanticClarification(
    "overview",
    csvImportCandidateId("overview", "orders.csv"),
    qty.semantic!.fieldId,
    "I don't know.",
  );
  assert.equal(unknown.resolved, false);
  const afterUnknown = getCsvImportCandidate("overview", csvImportCandidateId("overview", "orders.csv"));
  const qtyAfterUnknown = afterUnknown?.mapping?.mappings.find((entry) => entry.sourceColumn === "ORD_QTY");
  assert.equal(qtyAfterUnknown?.semantic?.confirmationSource !== "manager" || !qtyAfterUnknown?.confirmed, true);

  const correction = applyAdvisorDataSemanticClarification(
    "overview",
    csvImportCandidateId("overview", "orders.csv"),
    qty.semantic!.fieldId,
    "No, it means Ordered Units.",
  );
  assert.equal(correction.resolved, true);
  const afterCorrection = getCsvImportCandidate("overview", csvImportCandidateId("overview", "orders.csv"));
  assert.match(
    afterCorrection?.mapping?.mappings.find((entry) => entry.sourceColumn === "ORD_QTY")?.semantic?.confirmedMeaning ?? "",
    /Ordered Units/i,
  );
  const otherSource = mappingFor("other.csv", "ORD_QTY\n1");
  savePending("other.csv", "ORD_QTY\n1", otherSource);
  const otherAsk = answerAdvisorDataInquiry({ workspaceId: "overview", utterance: "What is ORD_QTY?" });
  assert.match(otherAsk?.text ?? "", /Which source|orders\.csv and other\.csv/i);
});
