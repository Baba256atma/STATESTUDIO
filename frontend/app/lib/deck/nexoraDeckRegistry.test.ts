import assert from "node:assert/strict";
import { test } from "node:test";

import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import {
  deleteWorkspace,
  getActiveWorkspaceId,
  renameWorkspace,
  resetWorkspaceRegistryForTests,
} from "../workspace/workspaceRegistryStore.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "./nexoraDeckIdentityContract.ts";
import {
  archiveManagerDeck,
  createManagerDeck,
  ensureManagerExecutiveDeck,
  renameManagerDeck,
  restoreManagerDeck,
  selectManagerDeck,
} from "./nexoraDeckRegistryAuthority.ts";
import {
  NEXORA_DECK_REGISTRY_STORAGE_KEY,
  NEXORA_EXECUTIVE_DECK_NAME,
  createDeck,
  getDeckRegistrySnapshot,
  listWorkspaceDecks,
  readActiveDeckId,
  recoverDeckRegistryFromStorage,
  resetDeckRegistryForTests,
  selectDeck,
  setDeckRegistryStorageForTests,
} from "./nexoraDeckRegistry.ts";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length(): number {
    return this.values.size;
  }
  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.values.delete(key);
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class FailingStorage extends MemoryStorage {
  override setItem(): void {
    throw new Error("quota");
  }
}

function isolate(): MemoryStorage {
  resetWorkspaceRegistryForTests();
  const storage = new MemoryStorage();
  setDeckRegistryStorageForTests(storage);
  resetDeckRegistryForTests();
  return storage;
}

test("a real workspace gains one Executive Deck and a Deck rename keeps its id", () => {
  isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const executive = listWorkspaceDecks(company.workspaceId).find((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID);
  assert.equal(executive?.kind, "EXECUTIVE");
  assert.equal(executive?.name, NEXORA_EXECUTIVE_DECK_NAME);
  assert.equal(readActiveDeckId(company.workspaceId), NEXORA_EXECUTIVE_DECK_ID);
  const renamedExecutive = renameManagerDeck({
    workspaceId: company.workspaceId,
    deckId: NEXORA_EXECUTIVE_DECK_ID,
    name: "Leadership",
  });
  assert.equal(renamedExecutive.ok, false);
  assert.equal(executive?.name, NEXORA_EXECUTIVE_DECK_NAME);

  const created = createManagerDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const renamed = renameManagerDeck({ workspaceId: company.workspaceId, name: "Plant", deckId: created.value.deckId });
  assert.equal(renamed.ok, true);
  if (!renamed.ok) return;
  assert.equal(renamed.value.deckId, created.value.deckId);
  assert.equal(renamed.value.createdAt, created.value.createdAt);
  assert.equal(renamed.value.name, "Plant");
  assert.equal(getActiveWorkspaceId(), company.workspaceId);
});

test("archive returns to Executive Deck and restore keeps the same Deck", () => {
  const storage = isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const finance = createManagerDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
  assert.equal(finance.ok, true);
  if (!finance.ok) return;
  assert.equal(selectManagerDeck(company.workspaceId, finance.value.deckId).ok, true);
  assert.equal(getActiveWorkspaceId(), company.workspaceId);
  const archived = archiveManagerDeck(company.workspaceId, finance.value.deckId);
  assert.equal(archived.ok, true);
  if (!archived.ok) return;
  assert.equal(archived.value.status, "ARCHIVED");
  assert.equal(archived.value.deckId, finance.value.deckId);
  assert.equal(readActiveDeckId(company.workspaceId), NEXORA_EXECUTIVE_DECK_ID);
  assert.equal(selectManagerDeck(company.workspaceId, finance.value.deckId).ok, false);
  const restored = restoreManagerDeck(company.workspaceId, finance.value.deckId);
  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  assert.equal(restored.value.deckId, finance.value.deckId);
  assert.equal(listWorkspaceDecks(company.workspaceId).filter((deck) => deck.deckId === finance.value.deckId).length, 1);
  assert.equal(archiveManagerDeck(company.workspaceId, NEXORA_EXECUTIVE_DECK_ID).ok, false);
  assert.equal(storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY)?.includes(company.workspaceId), true);
});

test("the same Deck id in another Workspace stays isolated", () => {
  isolate();
  const first = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  const second = createManagerWorkspaceFromEntry({ name: "Orbit", kind: "PROJECT" });
  assert.ok(first);
  assert.ok(second);
  const production = createManagerDeck({ workspaceId: first.workspaceId, name: "Production", kind: "DEPARTMENT" });
  const other = createManagerDeck({ workspaceId: second.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(production.ok && other.ok && production.value.deckId === other.value.deckId, true);
  assert.equal(selectManagerDeck(second.workspaceId, production.ok ? production.value.deckId : "").ok, true);
  assert.equal(readActiveDeckId(first.workspaceId), NEXORA_EXECUTIVE_DECK_ID);
  assert.equal(listWorkspaceDecks(first.workspaceId).some((deck) => deck.workspaceId === second.workspaceId), false);
});

test("invalid workspace, workflow mode, corrupt storage, and a failed save leave valid Decks in place", () => {
  const storage = isolate();
  assert.equal(ensureManagerExecutiveDeck(DEMO_WORKSPACE_ID).ok, false);
  assert.equal(selectDeck(DEMO_WORKSPACE_ID, "executive").ok, false);
  assert.equal(createDeck({ workspaceId: "overview", name: "Production", kind: "DEPARTMENT" }).ok, false);
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const valid = storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  storage.setItem(NEXORA_DECK_REGISTRY_STORAGE_KEY, "{");
  assert.equal(recoverDeckRegistryFromStorage().ok, false);
  assert.equal(storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY), "{");
  assert.equal(listWorkspaceDecks(company.workspaceId).some((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID), true);
  storage.setItem(NEXORA_DECK_REGISTRY_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, workspaces: {} }));
  assert.equal(recoverDeckRegistryFromStorage().ok, false);
  assert.equal(getDeckRegistrySnapshot().workspaces[company.workspaceId]?.decks.length, 1);
  storage.setItem(NEXORA_DECK_REGISTRY_STORAGE_KEY, valid ?? "");
  setDeckRegistryStorageForTests(new FailingStorage());
  const failed = createManagerDeck({ workspaceId: company.workspaceId, name: "Sales", kind: "FUNCTIONAL" });
  assert.equal(failed.ok, false);
  if (failed.ok) return;
  assert.equal(failed.reason, "storage-failed");
  assert.equal(listWorkspaceDecks(company.workspaceId).some((deck) => deck.name === "Sales"), false);
});

test("refresh restores the active Deck and Workspace rename or deletion stays scoped", () => {
  const storage = isolate();
  const company = createManagerWorkspaceFromEntry({ name: "Acme", kind: "BUSINESS" });
  assert.ok(company);
  const production = createManagerDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(production.ok, true);
  if (!production.ok) return;
  assert.equal(selectManagerDeck(company.workspaceId, production.value.deckId).ok, true);
  const raw = storage.getItem(NEXORA_DECK_REGISTRY_STORAGE_KEY);
  resetDeckRegistryForTests();
  assert.equal(listWorkspaceDecks(company.workspaceId).length, 0);
  storage.setItem(NEXORA_DECK_REGISTRY_STORAGE_KEY, raw ?? "");
  assert.equal(recoverDeckRegistryFromStorage().ok, true);
  assert.equal(readActiveDeckId(company.workspaceId), production.value.deckId);
  renameWorkspace(company.workspaceId, "Acme Plants");
  assert.equal(readActiveDeckId(company.workspaceId), production.value.deckId);
  deleteWorkspace(company.workspaceId);
  assert.equal(listWorkspaceDecks(company.workspaceId).length, 0);
  assert.equal(getDeckRegistrySnapshot().workspaces[company.workspaceId], undefined);
});
