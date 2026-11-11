import assert from "node:assert/strict";
import test from "node:test";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  updateCsvColumnMapping,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import {
  commitPreparedCsvRealDataImport,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import { resetCanonicalMutationJournalForTests, listCanonicalMutations } from "./canonicalMutationJournal.ts";
import { assignManagerDatasetReference } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import { setDeckDatasetReferenceStorageForTests } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { createDeck, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { deleteWorkspace } from "../workspace/workspaceRegistryStore.ts";
import {
  approveCommittedDatasetEntities,
  approveSourceAssociation,
  previewCommittedDatasetEntities,
  previewSourceAssociation,
  readCommittedDatasetSnapshot,
} from "./canonicalDatasetEntityPipeline.ts";
import {
  archiveCanonicalObject,
  associateCanonicalObjectSource,
  canonicalObjectRevision,
  createCanonicalObject,
  getCanonicalObject,
  listCanonicalObjects,
  recoverCanonicalMutations,
  resetCanonicalObjectsForTests,
} from "./canonicalObjectRegistry.ts";
import {
  declareCanonicalRelationship,
  listCanonicalRelationships,
  resetCanonicalRelationshipsForTests,
} from "./canonicalRelationshipGraph.ts";

const T0 = "2026-11-09T12:00:00.000Z";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

function failingRelationshipStorage(): Storage & { fail: boolean } {
  const values = new Map<string, string>();
  const storage = {
    fail: false,
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) {
      if (storage.fail) throw new Error("relationship write failed");
      values.set(key, value);
    },
  };
  return storage;
}

function commitMachines(workspaceId: string, fileName: string, csv: string, importId: string, mode: "new" | "replace" = "new", sourceContextId?: string) {
  const parse = parseCsvDeterministically(csv);
  let mapping = suggestCsvColumnMappings(parse.columns, importId);
  for (const column of mapping.mappings) {
    if (!column.confirmed) mapping = updateCsvColumnMapping(mapping, column.columnIndex, null);
  }
  const prepared = prepareCsvRealDataImport({
    workspaceId,
    fileName,
    fileSize: csv.length,
    csvText: csv,
    importId,
    importedAt: T0,
    sourceContextId,
  }, mapping);
  assert.equal(prepared.ready, true, prepared.errors.join("; "));
  const result = commitPreparedCsvRealDataImport({
    prepared,
    expectedWorkspaceId: workspaceId,
    mode,
    committedAt: T0,
  });
  assert.equal(result.committed, true, result.reason);
  return result.current!;
}

test("committed dataset snapshot is one import, and approval rejects a replaced version", () => {
  resetCsvRealDataImportStoreForTests();
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  const csv = [
    "machine_id,machine_name,Production Used Capacity,Production Total Capacity",
    "M001,CNC Machine A,120,100",
    "M002,CNC Machine B,95,100",
  ].join("\n");
  const committed = commitMachines("overview", "machines.csv", csv, "import-a");
  const snapshot = readCommittedDatasetSnapshot("overview", committed.sourceContextId);
  assert.equal(snapshot.ok, true);
  if (!snapshot.ok) return;
  assert.equal(snapshot.value.rowCount, 2);
  assert.equal(snapshot.value.rows[0]?.machine_id, "M001");
  const before = canonicalObjectRevision();
  const preview = previewCommittedDatasetEntities({
    workspaceId: "overview",
    sourceContextId: committed.sourceContextId,
    deckId: "production",
    mapping: {
      objectType: "MACHINE",
      sourceKeyColumn: "machine_id",
      displayNameColumn: "machine_name",
      attributeColumns: { "Production Used Capacity": "capacityPerHour" },
    },
  });
  assert.equal(preview.ok, true);
  if (!preview.ok) return;
  assert.equal(preview.value.preview.proposed.length, 2);
  assert.equal(canonicalObjectRevision(), before);
  const approved = approveCommittedDatasetEntities({ plan: preview.value, workspaceId: "overview", deckId: "production" });
  assert.equal(approved.ok, true);
  const firstId = listCanonicalObjects("overview").find((object) => object.displayName === "CNC Machine A")?.canonicalObjectId;
  assert.ok(firstId);
  const replacedCsv = [
    "machine_id,machine_name,Production Used Capacity,Production Total Capacity",
    "M001,CNC Machine A,120,100",
    "M002,CNC Machine B Updated,95,100",
    "M004,CNC Machine C,80,100",
  ].join("\n");
  const replacement = commitMachines("overview", "machines.csv", replacedCsv, "import-b", "replace", committed.sourceContextId);
  assert.equal(replacement.importId, "import-b");
  assert.equal(replacement.sourceContextId, committed.sourceContextId);
  const stale = approveCommittedDatasetEntities({ plan: preview.value, workspaceId: "overview", deckId: "production" });
  assert.equal(stale.ok, false);
  if (stale.ok) return;
  assert.equal(stale.reason, "stale-dataset");
  const next = previewCommittedDatasetEntities({
    workspaceId: "overview",
    sourceContextId: committed.sourceContextId,
    deckId: "production",
    mapping: preview.value.mapping,
  });
  assert.equal(next.ok, true);
  if (!next.ok) return;
  assert.deepEqual(next.value.preview.updates.map((row) => row.sourceKey), ["M002"]);
  assert.deepEqual(next.value.preview.proposed.map((row) => row.sourceKey), ["M004"]);
  assert.deepEqual(next.value.preview.missing.map((row) => row.sourceKey), []);
  approveCommittedDatasetEntities({ plan: next.value, workspaceId: "overview", deckId: "production" });
  assert.equal(getCanonicalObject("overview", firstId!)?.canonicalObjectId, firstId);
  const wrongDeck = approveCommittedDatasetEntities({ plan: next.value, workspaceId: "overview", deckId: "finance" });
  assert.equal(wrongDeck.ok, false);
  assert.equal(readCommittedDatasetSnapshot("finance-overview", committed.sourceContextId).ok, false);
});

test("a failed relationship write stays recoverable and does not duplicate the object", () => {
  const relationships = failingRelationshipStorage();
  resetCanonicalRelationshipsForTests(relationships);
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  const createdA = createCanonicalObject({
    workspaceId: "recover-co",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  const createdB = createCanonicalObject({
    workspaceId: "recover-co",
    objectType: "MACHINE",
    displayName: "CNC Machine B",
    deckId: "production",
  });
  assert.equal(createdA.ok && createdB.ok, true);
  if (!createdA.ok || !createdB.ok) return;
  declareCanonicalRelationship({
    workspaceId: "recover-co",
    sourceObjectId: createdA.value.canonicalObjectId,
    targetObjectId: createdB.value.canonicalObjectId,
    relationshipType: "DEPENDS_ON",
    provenance: { origin: "MANAGER_DECLARED" },
    knownObjectIds: [createdA.value.canonicalObjectId, createdB.value.canonicalObjectId],
  });
  relationships.fail = true;
  const archived = archiveCanonicalObject({
    workspaceId: "recover-co",
    canonicalObjectId: createdA.value.canonicalObjectId,
    now: T0,
  });
  assert.equal(archived.ok, false);
  if (archived.ok) return;
  assert.equal(archived.reason, "recovery-required");
  assert.equal(getCanonicalObject("recover-co", createdA.value.canonicalObjectId)?.lifecycleStatus, "ARCHIVED");
  assert.equal(listCanonicalRelationships("recover-co").some((edge) => edge.status === "ACTIVE"), true);
  assert.equal(listCanonicalMutations().some((operation) => operation.status === "RECOVERY_REQUIRED"), true);
  relationships.fail = false;
  const recovered = recoverCanonicalMutations();
  assert.equal(recovered.ok, true);
  assert.equal(listCanonicalRelationships("recover-co").every((edge) => edge.status === "ARCHIVED"), true);
  assert.equal(listCanonicalObjects("recover-co").filter((object) => object.displayName === "CNC Machine A").length, 1);
  assert.equal(listCanonicalMutations().some((operation) => operation.status === "RECOVERY_REQUIRED"), false);
});

test("removing one dataset keeps an object that still has another source", () => {
  resetCsvRealDataImportStoreForTests();
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  const csv = [
    "machine_id,machine_name,Production Used Capacity,Production Total Capacity",
    "M001,CNC Machine A,120,100",
  ].join("\n");
  const production = commitMachines("overview", "production.csv", csv, "import-prod");
  const maintenance = commitMachines("overview", "maintenance.csv", csv, "import-maint");
  const first = previewCommittedDatasetEntities({
    workspaceId: "overview",
    sourceContextId: production.sourceContextId,
    deckId: "production",
    mapping: { objectType: "MACHINE", sourceKeyColumn: "machine_id", displayNameColumn: "machine_name", attributeColumns: {} },
  });
  assert.equal(first.ok, true);
  if (!first.ok) return;
  approveCommittedDatasetEntities({ plan: first.value, workspaceId: "overview", deckId: "production" });
  const object = listCanonicalObjects("overview").find((entry) => entry.displayName === "CNC Machine A");
  assert.ok(object);
  const linked = associateCanonicalObjectSource({
    workspaceId: "overview",
    canonicalObjectId: object!.canonicalObjectId,
    datasetId: maintenance.sourceContextId,
    sourceKey: "M001",
  });
  assert.equal(linked.ok, true);
  if (!linked.ok) return;
  assert.equal(linked.value.sourceLinks.length, 2);
  removeCsvRealDataImport({
    workspaceId: "overview",
    sourceContextId: production.sourceContextId,
    activeSourceContextId: production.sourceContextId,
    confirmedActiveRemoval: true,
  });
  const remaining = getCanonicalObject("overview", object!.canonicalObjectId);
  assert.equal(remaining?.lifecycleStatus, "ACTIVE");
  assert.equal(remaining?.sourceLinks.length, 1);
  assert.equal(remaining?.sourceLinks[0]?.datasetId, maintenance.sourceContextId);
});

test("a manager-approved second dataset links one object and preserves a conflicting attribute", () => {
  resetCsvRealDataImportStoreForTests();
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  setDeckRegistryStorageForTests(memory());
  setDeckDatasetReferenceStorageForTests(memory());
  const company = createManagerWorkspaceFromEntry({ name: "NPA Source Link", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  const deck = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(deck.ok, true);
  if (!deck.ok) return;
  const productionCsv = [
    "machine_id,machine_name,Production Used Capacity,Production Total Capacity",
    "M001,CNC Machine A,120,100",
  ].join("\n");
  const maintenanceCsv = [
    "machine_id,machine_name,capacity,Production Used Capacity,Production Total Capacity",
    "M001,CNC Machine A,110,120,100",
  ].join("\n");
  const production = commitMachines(company.workspaceId, "production.csv", productionCsv, "prod-1");
  const maintenance = commitMachines(company.workspaceId, "maintenance.csv", maintenanceCsv, "maint-1");
  assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: deck.value.deckId, datasetId: production.sourceContextId });
  assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: deck.value.deckId, datasetId: maintenance.sourceContextId });
  const mapped = previewCommittedDatasetEntities({
    workspaceId: company.workspaceId,
    sourceContextId: production.sourceContextId,
    deckId: deck.value.deckId,
    mapping: {
      objectType: "MACHINE",
      sourceKeyColumn: "machine_id",
      displayNameColumn: "machine_name",
      attributeColumns: { "Production Used Capacity": "capacityPerHour" },
    },
  });
  assert.equal(mapped.ok, true);
  if (!mapped.ok) return;
  approveCommittedDatasetEntities({ plan: mapped.value, workspaceId: company.workspaceId, deckId: deck.value.deckId });
  const machine = listCanonicalObjects(company.workspaceId).find((entry) => entry.displayName === "CNC Machine A");
  assert.ok(machine);
  if (!machine) return;
  const preview = previewSourceAssociation({
    workspaceId: company.workspaceId,
    deckId: deck.value.deckId,
    canonicalObjectId: machine.canonicalObjectId,
    sourceContextId: maintenance.sourceContextId,
    sourceKeyColumn: "machine_id",
    sourceKey: "M001",
    displayNameColumn: "machine_name",
    attributeColumns: { capacity: "capacityPerHour" },
  });
  assert.equal(preview.ok, true);
  if (!preview.ok) return;
  assert.equal(preview.value.status, "ATTRIBUTE_CONFLICT");
  assert.equal(preview.value.attributeConflicts[0]?.canonicalValue, "120");
  assert.equal(preview.value.attributeConflicts[0]?.sourceValue, "110");
  assert.equal(listCanonicalObjects(company.workspaceId).length, 1);
  const approved = approveSourceAssociation({ plan: preview.value, workspaceId: company.workspaceId, deckId: deck.value.deckId });
  assert.equal(approved.ok, true);
  const linked = getCanonicalObject(company.workspaceId, machine.canonicalObjectId);
  assert.equal(linked?.sourceLinks.length, 2);
  assert.equal(linked?.attributes.capacityPerHour, 120);
  assert.equal(listCanonicalObjects(company.workspaceId).length, 1);
  const other = createCanonicalObject({
    workspaceId: company.workspaceId,
    objectType: "MACHINE",
    displayName: "Other Machine",
    deckId: deck.value.deckId,
  });
  assert.equal(other.ok, true);
  if (!other.ok) return;
  const conflict = previewSourceAssociation({
    workspaceId: company.workspaceId,
    deckId: deck.value.deckId,
    canonicalObjectId: other.value.canonicalObjectId,
    sourceContextId: maintenance.sourceContextId,
    sourceKeyColumn: "machine_id",
    sourceKey: "M001",
  });
  assert.equal(conflict.ok && conflict.value.status, "IDENTITY_CONFLICT");
  const rejected = conflict.ok ? approveSourceAssociation({ plan: conflict.value, workspaceId: company.workspaceId, deckId: deck.value.deckId }) : conflict;
  assert.equal(rejected.ok, false);
  const replaced = commitMachines(company.workspaceId, "maintenance.csv", maintenanceCsv.replace("110", "109"), "maint-2", "replace", maintenance.sourceContextId);
  assert.equal(replaced.importId, "maint-2");
  const stale = approveSourceAssociation({ plan: preview.value, workspaceId: company.workspaceId, deckId: "finance" });
  assert.equal(stale.ok, false);
  const staleDataset = approveSourceAssociation({ plan: preview.value, workspaceId: company.workspaceId, deckId: deck.value.deckId });
  assert.equal(staleDataset.ok, false);
  if (staleDataset.ok) return;
  assert.equal(staleDataset.reason, "stale-dataset");
  removeCsvRealDataImport({
    workspaceId: company.workspaceId,
    sourceContextId: maintenance.sourceContextId,
    activeSourceContextId: null,
    confirmedActiveRemoval: true,
  });
  const kept = getCanonicalObject(company.workspaceId, machine.canonicalObjectId);
  assert.equal(kept?.lifecycleStatus, "ACTIVE");
  assert.equal(kept?.sourceLinks.length, 1);
  assert.equal(kept?.sourceLinks[0]?.datasetId, production.sourceContextId);
  deleteWorkspace(company.workspaceId);
});

test("a failed source-link write stays recoverable without a second object", () => {
  const objects = failingRelationshipStorage();
  resetCanonicalObjectsForTests(objects);
  resetCanonicalMutationJournalForTests(memory());
  const created = createCanonicalObject({
    workspaceId: "link-recover",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  objects.fail = true;
  const linked = associateCanonicalObjectSource({
    workspaceId: "link-recover",
    canonicalObjectId: created.value.canonicalObjectId,
    datasetId: "maintenance",
    sourceKey: "M001",
  });
  assert.equal(linked.ok, false);
  assert.equal(getCanonicalObject("link-recover", created.value.canonicalObjectId)?.sourceLinks.length, 0);
  assert.equal(listCanonicalMutations().some((operation) => operation.kind === "link-source" && operation.status === "RECOVERY_REQUIRED"), true);
  objects.fail = false;
  assert.equal(recoverCanonicalMutations().ok, true);
  assert.equal(recoverCanonicalMutations().ok, true);
  const recovered = getCanonicalObject("link-recover", created.value.canonicalObjectId);
  assert.equal(recovered?.sourceLinks.length, 1);
  assert.equal(listCanonicalObjects("link-recover").length, 1);
});
