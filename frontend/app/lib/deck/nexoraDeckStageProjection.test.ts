import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalStageObjectIdentity,
  resolveDeckStageProjection,
  retainDeckStageSelection,
  type DeckStageDatasetRecord,
  type DeckStageProjectionReference,
} from "./nexoraDeckStageProjection.ts";

const workspaceId = "acme";

function deck(deckId: string, status: "ACTIVE" | "ARCHIVED" = "ACTIVE") {
  return Object.freeze({ deckId, workspaceId, status });
}

function reference(deckId: string, datasetId: string, owner = workspaceId): DeckStageProjectionReference {
  return Object.freeze({ workspaceId: owner, deckId, datasetId });
}

function dataset(datasetId: string, contentRevision: string, availability: DeckStageDatasetRecord["availability"] = "loaded", owner = workspaceId): DeckStageDatasetRecord {
  return Object.freeze({
    workspaceId: owner,
    datasetId,
    availability,
    contentRevision: availability === "loaded" ? contentRevision : null,
  });
}

test("one Dataset keeps one canonical object across two Decks", () => {
  const productionId = "csv:acme:production-csv";
  const inventoryId = "csv:acme:inventory-csv";
  const financeId = "csv:acme:finance-csv";
  const datasets = [
    dataset(financeId, "import-finance"),
    dataset(inventoryId, "import-inventory"),
    dataset(productionId, "import-production"),
  ];
  const production = resolveDeckStageProjection({
    workspaceId,
    deck: deck("production"),
    references: [reference("production", productionId), reference("production", inventoryId)],
    datasets,
  });
  const finance = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance"),
    references: [reference("finance", financeId)],
    datasets,
  });
  const executive = resolveDeckStageProjection({
    workspaceId,
    deck: deck("executive"),
    references: [
      reference("executive", financeId),
      reference("executive", productionId),
      reference("executive", inventoryId),
      reference("executive", productionId),
    ],
    datasets,
  });
  assert.equal(production.status, "projected");
  assert.deepEqual(production.objects.map((entry) => entry.identity.datasetId), [inventoryId, productionId]);
  assert.equal(finance.objects.length, 1);
  assert.equal(executive.objects.length, 3);
  assert.equal(
    executive.objects.find((entry) => entry.identity.datasetId === productionId)?.identity.objectId,
    production.objects.find((entry) => entry.identity.datasetId === productionId)?.identity.objectId,
  );
  assert.equal(new Set(executive.objects.map((entry) => entry.identity.objectId)).size, 3);
  const unassigned = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance"),
    references: [reference("finance", financeId)],
    datasets,
  });
  assert.equal(unassigned.objects.some((entry) => entry.identity.datasetId === productionId), false);
});

test("removal, replacement, refresh, and archive keep or drop the same object id", () => {
  const datasetId = "csv:acme:orders-csv";
  const first = canonicalStageObjectIdentity(workspaceId, datasetId);
  const replaced = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance"),
    references: [reference("finance", datasetId), reference("production", datasetId)],
    datasets: [dataset(datasetId, "import-2")],
  });
  assert.equal(replaced.objects[0]?.identity.objectId, first.objectId);
  assert.equal(replaced.objects[0]?.contentRevision, "import-2");
  assert.notEqual(first.objectId, canonicalStageObjectIdentity("other", datasetId).objectId);
  const removed = resolveDeckStageProjection({
    workspaceId,
    deck: deck("production"),
    references: [reference("finance", datasetId)],
    datasets: [dataset(datasetId, "import-2")],
  });
  assert.equal(removed.status, "empty");
  const archived = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance", "ARCHIVED"),
    references: [reference("finance", datasetId)],
    datasets: [dataset(datasetId, "import-2")],
  });
  assert.equal(archived.status, "archived");
  assert.equal(archived.objects.length, 0);
  const loading = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance"),
    references: [reference("finance", datasetId)],
    datasets: [dataset(datasetId, "import-2", "loading")],
  });
  assert.equal(loading.status, "loading");
  assert.deepEqual(loading.pendingDatasetIds, [datasetId]);
  const missing = resolveDeckStageProjection({
    workspaceId,
    deck: deck("finance"),
    references: [reference("finance", datasetId), reference("finance", "csv:other:foreign")],
    datasets: [dataset(datasetId, "import-2", "missing"), dataset("csv:other:foreign", "import-x", "loaded", "other")],
  });
  assert.equal(missing.status, "empty");
  assert.equal(retainDeckStageSelection(first.objectId, [first.objectId]), first.objectId);
  assert.equal(retainDeckStageSelection(first.objectId, []), null);
  assert.equal(retainDeckStageSelection(null, [first.objectId]), null);
});
