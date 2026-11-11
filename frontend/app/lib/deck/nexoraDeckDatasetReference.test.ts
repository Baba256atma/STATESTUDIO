import assert from "node:assert/strict";
import { test } from "node:test";

import {
  installAuthoritativeWorkspaceCsv,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "./nexoraDeckIdentityContract.ts";
import {
  archiveManagerDeck,
  createManagerDeck,
  renameManagerDeck,
  restoreManagerDeck,
} from "./nexoraDeckRegistryAuthority.ts";
import { resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "./nexoraDeckRegistry.ts";
import {
  assignManagerDatasetReference,
  listManagerDecksReferencingDataset,
  removeManagerDatasetReference,
  resolveManagerDeckDataset,
  workspaceDatasetIdentity,
} from "./nexoraDeckDatasetReferenceAuthority.ts";
import {
  NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY,
  getDeckDatasetReferenceSnapshot,
  listDeckDatasetReferences,
  recoverDeckDatasetReferencesFromStorage,
  resetDeckDatasetReferencesForTests,
  setDeckDatasetReferenceStorageForTests,
} from "./nexoraDeckDatasetReferenceRegistry.ts";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

class FailingStorage extends MemoryStorage {
  override setItem(): void { throw new Error("quota"); }
}

function dataset(workspaceId: string, name: string, importId: string): CsvCommittedImport {
  return {
    workspaceId,
    sourceContextId: `csv:${workspaceId}:${name}`,
    importId,
    committedAt: "2026-11-08T00:00:00.000Z",
    prepared: {
      fileName: `${name}.csv`,
      mapping: { mappingId: `map-${name}` },
      handoff: { dataset: { capturedAt: "2026-11-08T00:00:00.000Z", rows: [{ sku: "A" }] } },
    },
  } as unknown as CsvCommittedImport;
}

function isolate(): MemoryStorage {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  const storage = new MemoryStorage();
  setDeckRegistryStorageForTests(storage);
  setDeckDatasetReferenceStorageForTests(storage);
  resetDeckRegistryForTests();
  resetDeckDatasetReferencesForTests();
  return storage;
}

test("two Decks reference one Workspace Dataset and one removal leaves the Dataset intact", () => {
  isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const orders = dataset(company.workspaceId, "orders", "import-1");
  installAuthoritativeWorkspaceCsv([orders]);
  const production = createManagerDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  const finance = createManagerDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
  assert.equal(production.ok && finance.ok, true);
  if (!production.ok || !finance.ok) return;
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId }).ok, true);
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId }).ok, true);
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId }).ok, false);
  const fromProduction = resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId });
  const fromFinance = resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId });
  assert.equal(fromProduction, fromFinance);
  assert.deepEqual(workspaceDatasetIdentity(orders), { workspaceId: company.workspaceId, datasetId: orders.sourceContextId });
  assert.equal(JSON.stringify(getDeckDatasetReferenceSnapshot()).includes("sku"), false);
  assert.equal(removeManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId }).ok, true);
  assert.equal(resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId }), null);
  assert.equal(resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId })?.importId, "import-1");
  assert.equal(assignManagerDatasetReference({ workspaceId: DEMO_WORKSPACE_ID, deckId: "executive", datasetId: orders.sourceContextId }).ok, false);
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: "csv:other:orders" }).ok, false);
});

test("replacement keeps the Dataset id, deletion removes every reference, and a rename keeps the Deck pointer", () => {
  const storage = isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const orders = dataset(company.workspaceId, "orders", "import-1");
  installAuthoritativeWorkspaceCsv([orders]);
  const production = createManagerDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(production.ok, true);
  if (!production.ok) return;
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId }).ok, true);
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: NEXORA_EXECUTIVE_DECK_ID, datasetId: orders.sourceContextId }).ok, true);
  const replaced = dataset(company.workspaceId, "orders", "import-2");
  (replaced.prepared as { fileName: string }).fileName = "orders-renamed.csv";
  installAuthoritativeWorkspaceCsv([replaced]);
  const resolved = resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: production.value.deckId, datasetId: orders.sourceContextId });
  assert.equal(resolved?.importId, "import-2");
  assert.equal(resolved?.sourceContextId, orders.sourceContextId);
  assert.equal(resolved?.prepared.fileName, "orders-renamed.csv");
  const renamed = renameManagerDeck({ workspaceId: company.workspaceId, deckId: production.value.deckId, name: "Plant" });
  assert.equal(renamed.ok, true);
  assert.equal(listDeckDatasetReferences(company.workspaceId, production.value.deckId).length, 1);
  assert.equal(removeCsvRealDataImport({ workspaceId: company.workspaceId, sourceContextId: orders.sourceContextId, activeSourceContextId: null, confirmedActiveRemoval: true }).removed, true);
  assert.equal(resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: NEXORA_EXECUTIVE_DECK_ID, datasetId: orders.sourceContextId }), null);
  assert.equal(listManagerDecksReferencingDataset(company.workspaceId, orders.sourceContextId).length, 0);
  assert.equal(storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY)?.includes(orders.sourceContextId), false);
});

test("references survive refresh, archive, and restore, and bad storage cannot erase them", () => {
  const storage = isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const orders = dataset(company.workspaceId, "orders", "import-1");
  installAuthoritativeWorkspaceCsv([orders]);
  const finance = createManagerDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
  assert.equal(finance.ok, true);
  if (!finance.ok) return;
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId }).ok, true);
  const raw = storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY);
  resetDeckDatasetReferencesForTests();
  storage.setItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY, raw ?? "");
  assert.equal(recoverDeckDatasetReferencesFromStorage().ok, true);
  assert.equal(resolveManagerDeckDataset({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId })?.importId, "import-1");
  assert.equal(archiveManagerDeck(company.workspaceId, finance.value.deckId).ok, true);
  assert.equal(assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: finance.value.deckId, datasetId: orders.sourceContextId }).ok, false);
  assert.equal(restoreManagerDeck(company.workspaceId, finance.value.deckId).ok, true);
  assert.equal(listDeckDatasetReferences(company.workspaceId, finance.value.deckId).length, 1);
  storage.setItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY, "{");
  assert.equal(recoverDeckDatasetReferencesFromStorage().ok, false);
  assert.equal(storage.getItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY), "{");
  assert.equal(listDeckDatasetReferences(company.workspaceId, finance.value.deckId).length, 1);
  storage.setItem(NEXORA_DECK_DATASET_REFERENCE_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, references: [] }));
  assert.equal(recoverDeckDatasetReferencesFromStorage().ok, false);
  setDeckDatasetReferenceStorageForTests(new FailingStorage());
  const failed = assignManagerDatasetReference({ workspaceId: company.workspaceId, deckId: NEXORA_EXECUTIVE_DECK_ID, datasetId: orders.sourceContextId });
  assert.equal(failed.ok, false);
  assert.equal(listDeckDatasetReferences(company.workspaceId, NEXORA_EXECUTIVE_DECK_ID).length, 0);
  setDeckDatasetReferenceStorageForTests(storage);
  deleteWorkspace(company.workspaceId);
  assert.equal(getDeckDatasetReferenceSnapshot().references.some((reference) => reference.workspaceId === company.workspaceId), false);
});
