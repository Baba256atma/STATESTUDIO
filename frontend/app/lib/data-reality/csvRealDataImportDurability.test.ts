import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  commitPreparedCsvRealDataImport,
  discardCsvImportCandidate,
  getCsvImportCandidate,
  getCsvRealDataImport,
  getCsvRealDataImportCommitInvocationCount,
  getCsvRealDataImportLastLifecycleKind,
  listCsvImportCandidates,
  listCsvRealDataImports,
  listCsvRemovedSourceReferences,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
  csvImportCandidateId,
} from "./csvRealDataImportStore.ts";
import {
  CSV_DURABILITY_AUTHORITY_BOUNDARY,
  createMemoryCsvDurabilityStorage,
  csvRealDataImportDurabilityIdentity,
  persistCsvRealDataImportDurability,
  recoverCsvRealDataImportDurability,
  parseCsvDurableSnapshot,
  getCsvDurabilityHealth,
  csvRealDataImportDurabilityVersion,
} from "./csvRealDataImportDurability.ts";
import { prepareCsvRealDataImport } from "./csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "./csvSemanticUnderstanding.ts";
import { parseCsvDeterministically, suggestCsvColumnMappings, updateCsvColumnMapping } from "./csvRealDataVerticalSlice.ts";
import { projectExecutiveSourceIntelligence } from "./executiveSourceIntelligence.ts";
import { deriveNexoraDecisionTheatreDataObjectId, projectCsvImportAsDecisionTheatreDataObject } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";

const here = dirname(fileURLToPath(import.meta.url));
const durabilitySource = readFileSync(join(here, "csvRealDataImportDurability.ts"), "utf8");
const storeSource = readFileSync(join(here, "csvRealDataImportStore.ts"), "utf8");
const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");

const T0 = "2026-09-02T18:00:00.000Z";

function commitFile(workspaceId: string, fileName: string, csvText: string, importId: string) {
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: T0,
  });
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode: "new",
    committedAt: T0,
  });
  assert.equal(result.committed, true);
  return result.current!;
}

function roundTrip(storage = createMemoryCsvDurabilityStorage()) {
  return persistCsvRealDataImportDurability(storage, T0).then(async (persisted) => {
    const commits = getCsvRealDataImportCommitInvocationCount();
    resetCsvRealDataImportStoreForTests();
    const recovered = await recoverCsvRealDataImportDurability(storage);
    return { persisted, recovered, commitsAfterResetHydrate: getCsvRealDataImportCommitInvocationCount(), commitsBeforeReset: commits };
  });
}

test("DATA-UX:6 committed CSV persists and restore does not commit again", async () => {
  resetCsvRealDataImportStoreForTests();
  const csv = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
  const committed = commitFile("overview", "delivery.csv", csv, "ux6-delivery");
  const objectId = projectCsvImportAsDecisionTheatreDataObject(committed).id;
  const esi = projectExecutiveSourceIntelligence(committed);
  const storage = createMemoryCsvDurabilityStorage();
  const trip = await roundTrip(storage);
  assert.equal(trip.persisted.persisted, true);
  assert.equal(trip.recovered.recovered, true);
  assert.equal(trip.commitsAfterResetHydrate, 0);
  assert.equal(getCsvRealDataImportLastLifecycleKind(), "hydrate");
  const restored = getCsvRealDataImport("overview", committed.sourceContextId);
  assert.ok(restored);
  assert.equal(listCsvRealDataImports("overview").length, 1);
  assert.equal(projectCsvImportAsDecisionTheatreDataObject(restored!).id, objectId);
  assert.equal(deriveNexoraDecisionTheatreDataObjectId("overview", committed.sourceContextId), objectId);
  assert.deepEqual(
    projectExecutiveSourceIntelligence(restored!).affectedObjects.map((entry) => entry.objectKey),
    esi.affectedObjects.map((entry) => entry.objectKey),
  );
  assert.doesNotMatch((restored!.prepared.summary?.headline ?? "") + esi.interpretation, /imported again|New source detected/i);
  assert.equal(CSV_DURABILITY_AUTHORITY_BOUNDARY.restoreCallsCommit, false);
});

test("DATA-UX:6 mappings keep confirmation authority; preview records survive", async () => {
  resetCsvRealDataImportStoreForTests();
  const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";
  const parse = parseCsvDeterministically(ambiguous);
  const structural = suggestCsvColumnMappings(parse.columns, "ux6-pending");
  const mapping = interpretCsvSemantics({
    input: { workspaceId: "overview", fileName: "forecast.csv", fileSize: ambiguous.length, csvText: ambiguous, importId: "ux6-pend", importedAt: T0 },
    parse,
    structural,
  });
  const confirmed = updateCsvColumnMapping(mapping, mapping.mappings.find((entry) => entry.sourceColumn === "OTD")!.columnIndex, "shipping.on-time");
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", "forecast.csv"),
    fileName: "forecast.csv",
    status: "preview",
    input: Object.freeze({ workspaceId: "overview", fileName: "forecast.csv", fileSize: ambiguous.length, csvText: ambiguous, importId: "ux6-pend", importedAt: T0 }),
    parse,
    mapping: confirmed,
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
  const storage = createMemoryCsvDurabilityStorage();
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  const pending = getCsvImportCandidate("overview", csvImportCandidateId("overview", "forecast.csv"));
  assert.ok(pending);
  assert.equal(listCsvRealDataImports("overview").length, 0);
  const otd = pending!.mapping?.mappings.find((entry) => entry.sourceColumn === "OTD");
  const bkl = pending!.mapping?.mappings.find((entry) => entry.sourceColumn === "BKL");
  assert.equal(otd?.semantic?.confirmationSource, "manager");
  assert.equal(otd?.confirmed, true);
  assert.notEqual(bkl?.semantic?.confirmationSource, "manager");
  assert.equal(pending!.parse?.records.length, 1);
  assert.equal(pending!.status === "completed", false);
});

test("DATA-UX:6 multi committed, multi pending, workspace isolation, cancel, remove, update", async () => {
  resetCsvRealDataImportStoreForTests();
  const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
  const a = commitFile("overview", "delivery.csv", ready, "ux6-a");
  const b = commitFile("overview", "capacity.csv", ready, "ux6-b");
  const customer = "Customer Satisfaction,Maximum Satisfaction Score\n4.2,5";
  commitFile("overview", "customer.csv", customer, "ux6-c");
  commitFile("workspace-b", "delivery.csv", ready, "ux6-b-delivery");
  const storage = createMemoryCsvDurabilityStorage();
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  assert.equal(listCsvRealDataImports("overview").map((entry) => entry.prepared.fileName).sort().join(","), "capacity.csv,customer.csv,delivery.csv");
  assert.equal(getCsvRealDataImport("workspace-b", a.sourceContextId), null);
  const other = listCsvRealDataImports("workspace-b");
  assert.equal(other.length, 1);
  assert.equal(other[0]!.prepared.fileName, "delivery.csv");
  assert.notEqual(other[0]!.sourceContextId, a.sourceContextId);

  resetCsvRealDataImportStoreForTests();
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", "ambiguous-a.csv"),
    fileName: "ambiguous-a.csv",
    status: "preview",
    input: Object.freeze({ workspaceId: "overview", fileName: "ambiguous-a.csv", fileSize: 8, csvText: ready, importId: "pend-a", importedAt: T0 }),
    parse: parseCsvDeterministically(ready),
    mapping: suggestCsvColumnMappings(parseCsvDeterministically(ready).columns, "pend-a"),
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", "ambiguous-b.csv"),
    fileName: "ambiguous-b.csv",
    status: "preview",
    input: Object.freeze({ workspaceId: "overview", fileName: "ambiguous-b.csv", fileSize: 8, csvText: ready, importId: "pend-b", importedAt: T0 }),
    parse: parseCsvDeterministically(ready),
    mapping: suggestCsvColumnMappings(parseCsvDeterministically(ready).columns, "pend-b"),
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  assert.equal(listCsvImportCandidates("overview").length, 2);
  discardCsvImportCandidate("overview", csvImportCandidateId("overview", "ambiguous-a.csv"));
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  assert.deepEqual(listCsvImportCandidates("overview").map((entry) => entry.fileName), ["ambiguous-b.csv"]);

  resetCsvRealDataImportStoreForTests();
  const current = commitFile("overview", "capacity.csv", ready, "ux6-cap-v1");
  const v2 = prepareCsvRealDataImport({
    workspaceId: "overview",
    fileName: "capacity.csv",
    fileSize: 40,
    csvText: "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n999,110,90,120",
    importId: "ux6-cap-v2",
    importedAt: "2026-09-02T19:00:00.000Z",
  });
  assert.equal(v2.ready, true);
  const replaced = commitPreparedCsvRealDataImport({
    prepared: v2,
    expectedWorkspaceId: "overview",
    mode: "replace",
    committedAt: "2026-09-02T19:00:00.000Z",
  });
  assert.equal(replaced.committed, true);
  assert.equal(replaced.current?.prepared.importId, "ux6-cap-v2");
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  assert.equal(getCsvRealDataImport("overview", current.sourceContextId)?.prepared.importId, "ux6-cap-v2");
  assert.notEqual(getCsvRealDataImport("overview", current.sourceContextId)?.prepared.importId, "ux6-cap-v1");

  removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: current.sourceContextId,
    activeSourceContextId: null,
    removedAt: T0,
  });
  await persistCsvRealDataImportDurability(storage, T0);
  resetCsvRealDataImportStoreForTests();
  await recoverCsvRealDataImportDurability(storage);
  assert.equal(getCsvRealDataImport("overview", current.sourceContextId), null);
  const history = listCsvRemovedSourceReferences("overview");
  assert.equal(history[0]?.suppliesCurrentReality, false);
  assert.equal(history[0]?.transfersSemanticConfirmation, false);
  void b;
});

test("DATA-UX:6 corruption, incompatible version, write failure, and authority boundaries", async () => {
  resetCsvRealDataImportStoreForTests();
  const ready = "currentRevenue,previousRevenue,usedCapacity,totalCapacity\n120,100,80,100";
  commitFile("overview", "delivery.csv", ready, "ux6-ok");
  const storage = createMemoryCsvDurabilityStorage();
  await persistCsvRealDataImportDurability(storage, T0);
  const raw = JSON.parse((await storage.get())!);
  raw.committed.push({ workspaceId: "overview", sourceContextId: "csv:overview:broken.csv", importId: "bad" });
  await storage.set(JSON.stringify(raw));
  resetCsvRealDataImportStoreForTests();
  const mixed = await recoverCsvRealDataImportDurability(storage);
  assert.equal(mixed.rejectedCommitted, 1);
  assert.equal(listCsvRealDataImports("overview").length, 1);
  assert.equal(listCsvRealDataImports("overview")[0]!.prepared.fileName, "delivery.csv");

  const incompatible = parseCsvDurableSnapshot(JSON.stringify({
    identity: csvRealDataImportDurabilityIdentity,
    version: "9.0.0",
    namespace: "nexora.csv.real-data.durable",
    writtenAt: T0,
    committed: raw.committed,
    pending: [],
    removed: [],
  }));
  assert.equal(incompatible.reason, "incompatible");
  assert.equal(incompatible.snapshot, null);

  resetCsvRealDataImportStoreForTests();
  commitFile("overview", "session.csv", ready, "ux6-session");
  storage.failNextWrite = true;
  const failed = await persistCsvRealDataImportDurability(storage, T0);
  assert.equal(failed.persisted, false);
  assert.equal(getCsvDurabilityHealth(), "session-only");
  assert.ok(getCsvRealDataImport("overview", csvImportCandidateId("overview", "session.csv")));

  assert.match(durabilitySource, /indexedDB/);
  assert.doesNotMatch(durabilitySource, /commitPreparedCsvRealDataImport/);
  assert.doesNotMatch(durabilitySource, /createDecision|createExecution|beginNcaCsvSemanticClarification|onSelectSubject/);
  assert.match(storeSource, /hydrateCsvRealDataImportState/);
  assert.match(shell, /resetEntrance/);
  assert.match(shell, /recoverCsvRealDataImportDurabilityBrowser/);
  assert.match(shell, /clearCsvRealDataImportDurabilityBrowser/);
  assert.match(explorer, /nexora-csv-durability-warning/);
  assert.match(explorer, /setCsvIntake\("new"\)/);
  assert.equal(csvRealDataImportDurabilityVersion, "1.0.0");
});
