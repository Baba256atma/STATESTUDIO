import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
  listCsvRealDataImports,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import { projectExecutiveSourceIntelligence } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import {
  csvPotentialRelatedLabels,
  csvUncertainMeaningCopy,
  describeCsvNeedsAttentionForManager,
  describeCsvSourceForManager,
} from "./nexoraDataRailPresentation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const flow = readFileSync(join(here, "NexoraCsvRealDataImportFlow.tsx"), "utf8");

const ambiguousCsv = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

function mappingFor(fileName: string, csvText: string) {
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
  return interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
}

test("DATA-UX:5-FIX5 about this data is grounded and weak copy is honest", () => {
  const empty = mappingFor("notes.csv", "notes\nhello");
  assert.match(describeCsvSourceForManager({ fileName: "notes.csv", mapping: empty }), /has not confirmed enough business meaning to describe this source yet/);
  const review = mappingFor("data-ux3-ambiguous.csv", ambiguousCsv);
  const confirmed = updateCsvColumnMapping(review, review.mappings.find((entry) => entry.sourceColumn === "OTD")!.columnIndex, "shipping.on-time");
  const copy = describeCsvSourceForManager({ fileName: "data-ux3-ambiguous.csv", mapping: confirmed });
  assert.match(copy, /on-time deliveries/i);
  assert.doesNotMatch(copy, /BKL/);
  assert.match(flow, /nexora-csv-about/);
  assert.match(flow, /About this data/);
});

test("DATA-UX:5-FIX5 needs attention uses manager language for missing required data", () => {
  const diagnostic = 'KPI "kpi.production.utilization" is missing required metric "production.usedCapacity".';
  assert.equal(describeCsvNeedsAttentionForManager(diagnostic), "Nexora needs Used Capacity before this data can be used for Production.");
  assert.match(flow, /nexora-csv-needs-attention/);
  assert.match(flow, /required business field is not in this source/);
  assert.doesNotMatch(describeCsvNeedsAttentionForManager(diagnostic), /broken|Likely Bkl/i);
});

test("DATA-UX:5-FIX5 understands vs clarification copy; unknown abbreviations stay unconfirmed", () => {
  const review = mappingFor("data-ux3-ambiguous.csv", ambiguousCsv);
  const bkl = review.mappings.find((entry) => entry.sourceColumn === "BKL")!;
  assert.equal(csvUncertainMeaningCopy(bkl), "Meaning not confirmed");
  assert.doesNotMatch(csvUncertainMeaningCopy(bkl), /Likely Bkl/);
  const dt = review.mappings.find((entry) => entry.sourceColumn === "DT")!;
  assert.match(csvUncertainMeaningCopy(dt), /Likely Date|Meaning not confirmed/);
  assert.match(flow, /Nexora understands/);
  assert.match(flow, /nexora-csv-needs-clarification/);
  assert.match(flow, /csvConfirmedMappings/);
});

test("DATA-UX:5-FIX5 potentially related uses confirmed mapping targets only and does not write ESI", () => {
  resetCsvRealDataImportStoreForTests();
  const review = mappingFor("data-ux3-ambiguous.csv", ambiguousCsv);
  assert.equal(csvPotentialRelatedLabels(review).length, 0);
  const confirmed = updateCsvColumnMapping(review, review.mappings.find((entry) => entry.sourceColumn === "OTD")!.columnIndex, "shipping.on-time");
  assert.deepEqual([...csvPotentialRelatedLabels(confirmed)], ["Shipping"]);
  assert.match(flow, /nexora-csv-potentially-related/);
  assert.match(flow, /Nexora has not connected these objects yet/);
  assert.doesNotMatch(flow, /projectExecutiveSourceIntelligence/);
  assert.doesNotMatch(flow, /commitPreparedCsvRealDataImport[\s\S]{0,80}potentially/);
  assert.equal(listCsvRealDataImports("overview").length, 0);
});

test("DATA-UX:5-FIX5 collapse is presentation-only; correction uses existing mapping authority", () => {
  assert.match(flow, /<details data-testid="nexora-csv-needs-clarification"/);
  assert.match(flow, /<details data-testid="nexora-csv-columns"/);
  assert.match(flow, /<details data-testid="nexora-csv-preview-disclosure"/);
  assert.match(flow, /nexora-csv-change-meaning/);
  assert.match(flow, /nexora-csv-keep-current/);
  assert.match(flow, /updateCsvColumnMapping/);
  assert.match(flow, /onSemanticClarificationRequest/);
  assert.match(flow, /commitPreparedCsvRealDataImport/);
  assert.match(flow, /discardCsvImportCandidate/);
  assert.match(explorer, /nexora-csv-change-meaning-review/);
  assert.match(explorer, /analyzeCsvSourceRemovalImpact/);
  assert.match(explorer, /onUpdate\(\)/);
  assert.doesNotMatch(flow, /localStorage|IndexedDB/);
  assert.match(explorer, /setCsvIntake\("new"\)/);
  assert.match(explorer, /aria-label="Connected sources"/);
  assert.doesNotMatch(flow, /setInteraction|createDecision|createExecution/);
});

test("DATA-UX:5-FIX5 pending persist stays candidate-scoped and committed related objects stay ESI", () => {
  resetCsvRealDataImportStoreForTests();
  const review = mappingFor("a.csv", ambiguousCsv);
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", "a.csv"),
    fileName: "a.csv",
    status: "preview",
    input: Object.freeze({
      workspaceId: "overview" as const,
      fileName: "a.csv",
      fileSize: 8,
      csvText: ambiguousCsv,
      importId: "test:a",
      importedAt: "2026-09-01T18:00:00.000Z",
    }),
    parse: parseCsvDeterministically(ambiguousCsv),
    mapping: review,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
  const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
  const prepared = prepareCsvRealDataImport({ workspaceId: "overview", fileName: "b.csv", fileSize: ready.length, csvText: ready, importId: "fix5-b", importedAt: "2026-09-01T18:00:00.000Z" });
  assert.equal(prepared.ready, true);
  const esi = projectExecutiveSourceIntelligence({
    workspaceId: "overview",
    sourceContextId: prepared.sourceContextId,
    importId: prepared.importId,
    committedAt: "2026-09-01T18:00:01.000Z",
    prepared,
  });
  assert.ok(esi.affectedObjects.length >= 1);
  assert.match(explorer, /intelligence\.affectedObjects/);
  assert.doesNotMatch(explorer, /caused Capacity Gap/);
});
