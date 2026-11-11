import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createMemoryCsvDurabilityStorage, persistCsvRealDataImportDurability } from "../data-reality/csvRealDataImportDurability.ts";
import { CANONICAL_DECISION_STORAGE_KEY, createDecisionGoal, listDecisionGoals, resetDecisionDomainForTests } from "../scene-org/canonicalDecisionDomain.ts";
import { CANONICAL_MUTATION_JOURNAL_KEY, prepareCanonicalMutation, listCanonicalMutations, resetCanonicalMutationJournalForTests } from "../scene-org/canonicalMutationJournal.ts";
import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { createManagerWorkspaceFromEntry } from "./managerWorkspaceEntry.ts";
import { resetWorkspaceRegistryForTests } from "./workspaceRegistryStore.ts";
import { coordinateWorkspaceMutation, workspaceMutationCoordinationActive } from "./workspaceAuthorityFence.ts";

function memory(options?: { failKey?: string }): Storage & { failKey: string | null } {
  const values = new Map<string, string>();
  const store = {
    failKey: options?.failKey ?? null,
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) {
      if (store.failKey === key) throw new Error("injected-storage-failure");
      values.set(key, value);
    },
  };
  return store;
}

test("a callback exception releases coordination and the next mutation can commit", async () => {
  resetWorkspaceRegistryForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Failure Callback", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  await assert.rejects(
    coordinateWorkspaceMutation({ workspaceId: company.workspaceId }, () => {
      throw new Error("before-commit");
    }),
    /before-commit/,
  );
  assert.equal(workspaceMutationCoordinationActive(), false);
  const next = await coordinateWorkspaceMutation({ workspaceId: company.workspaceId }, () => "committed");
  assert.equal(next, "committed");
  assert.equal(workspaceMutationCoordinationActive(), false);
});

test("a rejected canonical write does not acknowledge a decision goal", () => {
  const store = memory();
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  setDeckRegistryStorageForTests(store);
  resetDecisionDomainForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "Failure Decision", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  const deck = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
  assert.equal(deck.ok, true);
  if (!deck.ok) return;
  const created = createDecisionGoal({
    workspaceId: company.workspaceId,
    deckId: deck.value.deckId,
    name: "Keep capacity",
    now: "2026-11-11T00:00:00.000Z",
  });
  assert.equal(created.ok, true);
  store.failKey = CANONICAL_DECISION_STORAGE_KEY;
  const failed = createDecisionGoal({
    workspaceId: company.workspaceId,
    deckId: deck.value.deckId,
    name: "Lost capacity",
    now: "2026-11-11T00:01:00.000Z",
  });
  assert.equal(failed.ok, false);
  if (!failed.ok) assert.equal(failed.reason, "storage-failed");
  assert.deepEqual(listDecisionGoals(company.workspaceId, deck.value.deckId).map((goal) => goal.name), ["Keep capacity"]);
  store.failKey = null;
  const retried = createDecisionGoal({
    workspaceId: company.workspaceId,
    deckId: deck.value.deckId,
    name: "Recovered capacity",
    now: "2026-11-11T00:02:00.000Z",
  });
  assert.equal(retried.ok, true);
  assert.deepEqual(listDecisionGoals(company.workspaceId, deck.value.deckId).map((goal) => goal.name), ["Keep capacity", "Recovered capacity"]);
});

test("a rejected journal append stays uncommitted and can be retried once", () => {
  const store = memory();
  resetWorkspaceRegistryForTests();
  resetCanonicalMutationJournalForTests(store);
  const company = createManagerWorkspaceFromEntry({ name: "Failure Journal", kind: "BUSINESS" });
  assert.ok(company);
  if (!company) return;
  const operation = {
    operationId: "journal-failure-1",
    kind: "archive-object" as const,
    workspaceId: company.workspaceId,
    canonicalObjectId: "object-1",
    datasetId: null,
    sourceKey: null,
    relationshipIds: [],
    status: "PREPARED" as const,
  };
  store.failKey = CANONICAL_MUTATION_JOURNAL_KEY;
  assert.equal(prepareCanonicalMutation(operation), "storage-failed");
  assert.equal(listCanonicalMutations().some((entry) => entry.operationId === operation.operationId), false);
  store.failKey = null;
  assert.equal(prepareCanonicalMutation(operation), "ok");
  assert.equal(prepareCanonicalMutation(operation), "duplicate");
  assert.equal(listCanonicalMutations().filter((entry) => entry.operationId === operation.operationId).length, 1);
});

test("a rejected dataset durability write leaves the previous snapshot in place", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  const first = await persistCsvRealDataImportDurability(storage, "2026-11-11T00:00:00.000Z");
  assert.equal(first.persisted, true);
  const before = await storage.get();
  storage.failNextWrite = true;
  const failed = await persistCsvRealDataImportDurability(storage, "2026-11-11T00:01:00.000Z");
  assert.equal(failed.persisted, false);
  assert.equal(failed.reason, "write-failed");
  assert.equal(await storage.get(), before);
  const retried = await persistCsvRealDataImportDurability(storage, "2026-11-11T00:02:00.000Z");
  assert.equal(retried.persisted, true);
});

test("failure instrumentation and save observation stay on the shared boundary", () => {
  const fence = readFileSync(new URL("./workspaceAuthorityFence.ts", import.meta.url), "utf8");
  const flow = readFileSync(new URL("../../executive/nex-mvp/data/NexoraLiveDataConnectionFlow.tsx", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  assert.match(fence, /if \(process\.env\.NODE_ENV === "production"\) return;/);
  assert.match(fence, /coordination-unavailable/);
  assert.doesNotMatch(fence, /unavailable[\s\S]{0,180}mutation\(\)/);
  assert.match(flow, /coordinateWorkspaceMutation\(\{ workspaceId \}/);
  assert.match(flow, /persistDurableMonitoringRuntimeBrowser/);
  assert.match(flow, /nexora-monitoring-save-observation/);
  assert.match(flow, /recoverDurableMonitoringRuntimeBrowser/);
  const refreshAck = explorer.slice(explorer.indexOf("const refresh = async"), explorer.indexOf("return <section data-testid=\"nexora-rdi4-live-source\""));
  assert.match(refreshAck, /await persistDurableMonitoringRuntimeBrowser/);
  const savedAt = refreshAck.indexOf("New observation saved for review");
  const persistedAt = refreshAck.indexOf("await persistDurableMonitoringRuntimeBrowser");
  assert.ok(persistedAt >= 0 && savedAt > persistedAt);
  assert.match(explorer, /nexora-monitoring-remove-observation[\s\S]{0,700}await persistDurableMonitoringRuntimeBrowser/);
});
