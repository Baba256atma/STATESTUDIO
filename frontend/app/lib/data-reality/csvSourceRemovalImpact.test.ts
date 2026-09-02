import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  getCsvRemovedSourceReference,
  listCsvRemovedSourceReferences,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "./csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "./csvRealDataVerticalSlice.ts";
import { analyzeCsvSourceRemovalImpact } from "./csvSourceRemovalImpact.ts";
import { answerCsvSourceRemovalInquiry } from "./csvSourceRemovalAdvisor.ts";

const here = dirname(fileURLToPath(import.meta.url));

function commit(input: Readonly<{
  fileName: string;
  csvText: string;
  importId: string;
  workspaceId?: "overview" | "workspace-a" | "workspace-b";
}>) {
  const workspaceId = input.workspaceId ?? "overview";
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName: input.fileName,
    fileSize: input.csvText.length,
    csvText: input.csvText,
    importId: input.importId,
    importedAt: "2026-08-31T18:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: "2026-08-31T18:00:01.000Z",
  });
  assert.equal(result.committed, true);
  assert.ok(result.current);
  return result.current;
}

test("zero-object source has no fabricated impact and first remove is refused without confirmation", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit({ fileName: "zero-object.csv", csvText: "date\n2026-08-31", importId: "zero" });
  const impact = analyzeCsvSourceRemovalImpact({
    source,
    peers: [source],
    activeSourceContextId: null,
  });
  assert.equal(impact.impactClass, "NO_EXECUTIVE_IMPACT");
  assert.equal(impact.dependents.length, 0);
  assert.equal(impact.firstClickDeletes, false);
  assert.match(impact.managerSummary, /not currently supplying any Executive Objects/);
  assert.equal(getCsvRealDataImport("overview", source.sourceContextId)?.importId, "zero");
});

test("active source remains until confirmed destructive removal, then history is retained", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit({
    fileName: "delivery-ready.csv",
    csvText: "currentRevenue,previousRevenue,usedCapacity,totalCapacity,totalDeliveries,onTimeDeliveries\n120000,100000,82,100,940,866",
    importId: "active-1",
  });
  const refused = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: source.sourceContextId,
    activeSourceContextId: source.sourceContextId,
  });
  assert.equal(refused.removed, false);
  assert.equal(refused.reason, "active_source");
  assert.ok(getCsvRealDataImport("overview", source.sourceContextId));
  assert.equal(getCsvRemovedSourceReference("overview", source.sourceContextId), null);

  const confirmed = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: source.sourceContextId,
    activeSourceContextId: source.sourceContextId,
    confirmedActiveRemoval: true,
    removedAt: "2026-08-31T18:05:00.000Z",
  });
  assert.equal(confirmed.removed, true);
  assert.equal(getCsvRealDataImport("overview", source.sourceContextId), null);
  assert.equal(confirmed.historicalReference?.suppliesCurrentReality, false);
  assert.equal(confirmed.historicalReference?.transfersSemanticConfirmation, false);
  assert.equal(confirmed.historicalReference?.importId, "active-1");
});

test("shared support remains when an inactive overlapping source is removed", () => {
  resetCsvRealDataImportStoreForTests();
  const first = commit({
    fileName: "delivery-a.csv",
    csvText: "currentRevenue,previousRevenue\n120,100",
    importId: "a",
  });
  const second = commit({
    fileName: "delivery-b.csv",
    csvText: "currentRevenue,previousRevenue\n130,110",
    importId: "b",
  });
  const impact = analyzeCsvSourceRemovalImpact({
    source: first,
    peers: [first, second],
    activeSourceContextId: second.sourceContextId,
  });
  assert.equal(impact.impactClass, "SHARED_SUPPORT_REMAINS");
  assert.ok(impact.dependents.some((entry) => entry.support === "shared"));
  const removed = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: first.sourceContextId,
    activeSourceContextId: second.sourceContextId,
  });
  assert.equal(removed.removed, true);
  assert.ok(getCsvRealDataImport("overview", second.sourceContextId));
});

test("unrelated sources and other workspaces are not touched", () => {
  resetCsvRealDataImportStoreForTests();
  const delivery = commit({ fileName: "zero-object.csv", csvText: "date\n2026-08-31", importId: "d" });
  const finance = commit({
    fileName: "finance.csv",
    csvText: "currentRevenue,previousRevenue\n50,40",
    importId: "f",
  });
  const other = commit({
    fileName: "zero-object.csv",
    csvText: "date\n2026-08-30",
    importId: "w-b",
    workspaceId: "workspace-b",
  });
  removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: delivery.sourceContextId,
    activeSourceContextId: null,
  });
  assert.ok(getCsvRealDataImport("overview", finance.sourceContextId));
  assert.ok(getCsvRealDataImport("workspace-b", other.sourceContextId));
  assert.equal(listCsvRemovedSourceReferences("workspace-b").length, 0);
});

test("remove then new import does not transfer confirmation and keeps a distinct historical import", () => {
  resetCsvRealDataImportStoreForTests();
  const original = commit({ fileName: "delivery-ready.csv", csvText: "currentRevenue,previousRevenue,usedCapacity,totalCapacity,totalDeliveries,onTimeDeliveries\n1,1,1,1,1,1", importId: "old" });
  const sourceId = original.sourceContextId;
  removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: sourceId,
    activeSourceContextId: null,
    removedAt: "2026-08-31T18:10:00.000Z",
  });
  const next = commit({
    fileName: "delivery-ready.csv",
    csvText: "currentRevenue,previousRevenue,usedCapacity,totalCapacity,totalDeliveries,onTimeDeliveries\n2,1,1,1,1,1",
    importId: "new",
  });
  assert.equal(next.sourceContextId, sourceId);
  assert.equal(next.importId, "new");
  assert.equal(getCsvRemovedSourceReference("overview", sourceId)?.importId, "old");
  assert.notEqual(next.prepared.mapping.mappingId, getCsvRemovedSourceReference("overview", sourceId)?.mappingId);
});

test("failed retry does not duplicate historical references", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit({ fileName: "raw.csv", csvText: "date\n2026-08-31", importId: "once" });
  const first = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: source.sourceContextId,
    activeSourceContextId: null,
  });
  const second = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: source.sourceContextId,
    activeSourceContextId: null,
  });
  assert.equal(first.removed, true);
  assert.equal(second.removed, false);
  assert.equal(second.reason, "not_found");
  assert.equal(listCsvRemovedSourceReferences("overview").length, 1);
});

test("Advisor explains impact and never deletes", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit({ fileName: "raw.csv", csvText: "date\n2026-08-31", importId: "ask" });
  const impact = analyzeCsvSourceRemovalImpact({
    source,
    peers: [source],
    activeSourceContextId: null,
  });
  const review = answerCsvSourceRemovalInquiry({ impact, utterance: "Get rid of this." });
  assert.equal(review?.intent, "request-review");
  assert.match(review?.text ?? "", /confirm/i);
  assert.ok(getCsvRealDataImport("overview", source.sourceContextId));
  const cancel = answerCsvSourceRemovalInquiry({ impact, utterance: "Cancel." });
  assert.equal(cancel?.intent, "cancel-review");
  assert.ok(getCsvRealDataImport("overview", source.sourceContextId));
});

test("DATA-UX:5 Data Rail opens review instead of deleting on first intent", () => {
  const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(explorer, /nexora-data-source-remove-intent/);
  assert.match(explorer, /nexora-data-source-removal-review/);
  assert.match(explorer, /nexora-data-source-remove-confirm/);
  assert.match(explorer, /confirmedActiveRemoval: active/);
  assert.match(explorer, /onDismissRemovalReview/);
  assert.doesNotMatch(explorer.slice(explorer.indexOf("nexora-data-source-remove-intent"), explorer.indexOf("nexora-data-source-remove-confirm")), /removeCsvRealDataImport/);
  assert.match(shell, /answerCsvSourceRemovalInquiry/);
  assert.match(shell, /onCsvSourceRemoved/);
  assert.doesNotMatch(shell, /setInteraction\(.*removeCsv/);
});
