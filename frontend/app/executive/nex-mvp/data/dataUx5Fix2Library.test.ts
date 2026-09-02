import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  getCsvRealDataImport,
  listCsvRealDataImports,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../../../lib/data-reality/csvRealDataImportStore.ts";
import { prepareCsvRealDataImport } from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import { nextCsvSemanticClarification } from "../../../lib/data-reality/csvSemanticUnderstanding.ts";
import { projectExecutiveSourceIntelligence } from "../../../lib/data-reality/executiveSourceIntelligence.ts";
import { projectNexoraDataRailLibrary } from "./nexoraDataRailPresentation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const shell = readFileSync(join(here, "../NexoraExecutiveShell.tsx"), "utf8");
const advisor = readFileSync(join(here, "../NexoraAdvisorInsightRegion.tsx"), "utf8");
const presentation = readFileSync(join(here, "nexoraDataRailPresentation.ts"), "utf8");

function commit(fileName: string, csvText: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: "2026-09-01T12:00:00.000Z",
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: "new",
    committedAt: "2026-09-01T12:00:01.000Z",
  });
  assert.equal(result.committed, true);
  assert.ok(result.current);
  return result.current;
}

test("DATA-UX:5-FIX2 empty CSV message appears only when csvCount is zero", () => {
  resetCsvRealDataImportStoreForTests();
  const empty = projectNexoraDataRailLibrary({
    csvImports: [],
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: null,
    activeLiveSourceContextId: null,
  });
  assert.equal(empty.csvEmpty, true);
  assert.equal(empty.totalCount, 0);
  assert.match(explorer, /library\.csvEmpty \? <div data-testid="nexora-data-rail-empty"/);
  assert.match(explorer, /CSV · \{library\.csvCount\} · Ready · \{library\.committedCsvCount\} · Pending · \{library\.pendingCsvCount\} · Connected · \{library\.connectedCount\}/);
  assert.match(explorer, /data-source-count=\{String\(library\.totalCount\)\}/);
});

test("DATA-UX:5-FIX2 one CSV source lists the filename and suppresses the empty message", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit("delivery_2026.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100", "fix2-delivery");
  const library = projectNexoraDataRailLibrary({
    csvImports: listCsvRealDataImports("overview"),
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: source.sourceContextId,
    activeLiveSourceContextId: null,
  });
  assert.equal(library.csvEmpty, false);
  assert.equal(library.csvRows[0]?.label, "delivery_2026.csv");
  assert.equal(library.csvRows[0]?.typeLabel, "CSV");
  assert.match(explorer, /data-source-filename=\{row\.label\}/);
});

test("DATA-UX:5-FIX2 close details and close Data are presentation-only", () => {
  assert.match(explorer, /nexora-data-source-close-details/);
  assert.match(explorer, /onCloseDetails=\{\(\) => setSelectedSourceId\(null\)\}/);
  assert.match(explorer, /onClick=\{onCloseDetails\}>Close details</);
  assert.match(shell, /onExplorerClose = useCallback\(\(\) => \{[\s\S]*setActiveNav\("Home"\);/);
  assert.doesNotMatch(shell, /onExplorerClose[\s\S]{0,200}removeCsvRealDataImport/);
});

test("DATA-UX:5-FIX2 reopen CSV reads the same committed mapping without a second store", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit("delivery_2026.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100", "fix2-reopen");
  const again = getCsvRealDataImport("overview", source.sourceContextId);
  assert.equal(again?.prepared.fileName, "delivery_2026.csv");
  assert.equal(again?.prepared.mapping.mappingId, source.prepared.mapping.mappingId);
  assert.equal(nextCsvSemanticClarification(again!.prepared.mapping) == null, nextCsvSemanticClarification(source.prepared.mapping) == null);
  assert.match(explorer, /selected = imports\.find/);
  assert.doesNotMatch(explorer, /setSelectedSourceId\(activeImport/);
});

test("DATA-UX:5-FIX2 remove uses DATA-UX:5 lifecycle and replace keeps identity", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit("delivery_2026.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100", "fix2-remove");
  const replacementCsv = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n140,110,70,100";
  const prepared = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "delivery_2026.csv",
    fileSize: replacementCsv.length,
    csvText: replacementCsv,
    importId: "fix2-replace",
    importedAt: "2026-09-01T12:06:00.000Z",
    sourceContextId: source.sourceContextId,
  });
  assert.equal(prepared.ready, true);
  const replaced = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: "overview",
    mode: "replace",
    committedAt: "2026-09-01T12:06:01.000Z",
  });
  assert.equal(replaced.reason, "replaced");
  assert.equal(replaced.current?.sourceContextId, source.sourceContextId);
  const removed = removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: source.sourceContextId,
    activeSourceContextId: null,
    removedAt: "2026-09-01T12:07:00.000Z",
  });
  assert.equal(removed.removed, true);
  assert.equal(listCsvRealDataImports("overview").length, 0);
  assert.match(explorer, /confirmedActiveRemoval: active/);
});

test("DATA-UX:5-FIX2 connected sources are separate from CSV and Engineering Source is Connected", () => {
  assert.match(explorer, /aria-label="CSV files"/);
  assert.match(explorer, /aria-label="Connected sources"/);
  assert.match(explorer, />Connected source</);
  assert.match(presentation, /typeLabel: "Connected"/);
  assert.doesNotMatch(explorer, /Engineering Source[\s\S]{0,80}CSV file/);
});

test("DATA-UX:5-FIX2 related objects come from ESI and do not claim causality", () => {
  resetCsvRealDataImportStoreForTests();
  const source = commit("delivery_2026.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100", "fix2-esi");
  const intelligence = projectExecutiveSourceIntelligence(source);
  const library = projectNexoraDataRailLibrary({
    csvImports: [source],
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: source.sourceContextId,
    activeLiveSourceContextId: null,
  });
  assert.deepEqual([...library.csvRows[0]!.relatedObjectLabels].sort(), [...new Set(intelligence.affectedObjects.map((entry) => entry.objectLabel))].sort());
  assert.match(explorer, /Related Objects/);
  assert.doesNotMatch(explorer, /caused Capacity|CSV caused|caused by this source/i);
  assert.doesNotMatch(presentation, /causality|caused/);
});

test("DATA-UX:5-FIX2 View Changes retains source identity", () => {
  assert.match(explorer, /Source: \{connection\.displayName\}/);
  assert.match(explorer, /Source: \{source\.prepared\.fileName\}/);
  assert.match(explorer, /nexora-pm1-view-changes/);
  assert.match(explorer, /nexora-csv-view-changes/);
});

test("DATA-UX:5-FIX2 ASK NEXORA collapses Data through existing nav and preserves the source", () => {
  assert.match(shell, /const onSourceAdvisorContext = useCallback\(\(context: ExecutiveSourceAdvisorContext\) => \{[\s\S]*setActiveNav\("Home"\);/);
  assert.match(shell, /dataRailSelectedSourceId/);
  assert.match(shell, /onReturnToDataSource=\{\(\) => setActiveNav\("Data"\)\}/);
  assert.match(advisor, /nexora-data-source-return/);
  assert.match(advisor, /Back to \{sourceIntelligenceContext\.title\}/);
  assert.doesNotMatch(shell, /onSourceAdvisorContext[\s\S]{0,400}removeCsvRealDataImport/);
  const askHandler = shell.slice(shell.indexOf("const onSourceAdvisorContext"), shell.indexOf("const onCsvSemanticClarificationRequest"));
  assert.match(askHandler, /onSelectSubject\(focusId\)/);
  assert.doesNotMatch(askHandler, /setInteraction\(|fabricat/);
});

test("DATA-UX:5-FIX2 Stage focus uses existing View on Stage / affectedStageObjectIds only", () => {
  assert.match(explorer, /onViewOnStage\(target\)/);
  assert.match(explorer, /onShowDataObjectOnStage\(projectCsvImportAsDecisionTheatreDataObject/);
  assert.doesNotMatch(explorer, /createStageObject|inventObject|setFocusedSubject\(/);
  assert.match(shell, /onViewSourceOnStage = useCallback\(\(stageObjectId: string\) => \{[\s\S]*onSelectSubject\(stageObjectId\);/);
});

test("DATA-UX:5-FIX2 same-named fields stay source-scoped and multi-CSV matches the store", () => {
  resetCsvRealDataImportStoreForTests();
  const delivery = commit("delivery.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100", "fix2-a");
  const orders = commit("orders.csv", "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n90,80,40,100", "fix2-b");
  assert.notEqual(delivery.sourceContextId, orders.sourceContextId);
  assert.notEqual(delivery.prepared.mapping.mappingId, orders.prepared.mapping.mappingId);
  const deliveryColumn = delivery.prepared.mapping.mappings.find((entry) => entry.sourceColumn === "usedCapacity");
  const ordersColumn = orders.prepared.mapping.mappings.find((entry) => entry.sourceColumn === "usedCapacity");
  assert.ok(deliveryColumn && ordersColumn);
  assert.equal(deliveryColumn.targetId, ordersColumn.targetId);
  assert.notEqual(delivery.prepared.mapping.mappingId, orders.prepared.mapping.mappingId);
  if (deliveryColumn.semantic && ordersColumn.semantic) {
    assert.notEqual(deliveryColumn.semantic.fieldId, ordersColumn.semantic.fieldId);
    assert.ok(deliveryColumn.semantic.fieldId.includes(delivery.sourceContextId));
    assert.ok(ordersColumn.semantic.fieldId.includes(orders.sourceContextId));
  }
  const library = projectNexoraDataRailLibrary({
    csvImports: listCsvRealDataImports("overview"),
    liveConnections: [],
    latestObservationByConnectionId: {},
    activeCsvSourceId: delivery.sourceContextId,
    activeLiveSourceContextId: null,
  });
  assert.equal(library.csvCount, 2);
  assert.deepEqual(library.csvRows.map((row) => row.label).sort(), ["delivery.csv", "orders.csv"]);
});

test("DATA-UX:5-FIX2 FIX1 clarification handoff and monitoring surface remain wired", () => {
  assert.match(explorer, /onSemanticClarificationRequest/);
  assert.match(explorer, /nexora-pm2-automatic-monitoring/);
  assert.match(shell, /resolveNcaCsvSemanticReply/);
  assert.match(explorer, /createMonitoringAdvisorContext/);
});
