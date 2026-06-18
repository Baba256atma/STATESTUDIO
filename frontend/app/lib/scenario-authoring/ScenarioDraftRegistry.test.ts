import test from "node:test";
import assert from "node:assert/strict";

import {
  ScenarioDraftRegistry,
  archiveScenarioDraftRegistryEntry,
  createScenarioDraftRegistryEntry,
  getScenarioDraftRegistrySnapshot,
  listScenarioDraftRegistryEntries,
  readScenarioDraftRegistryEntry,
  resetScenarioDraftRegistryForTests,
  setScenarioDraftRegistryPersistenceAdapterForTests,
  updateScenarioDraftRegistryEntry,
} from "./ScenarioDraftRegistry.ts";
import {
  SCENARIO_DRAFT_REGISTRY_DIAGNOSTIC,
  SCENARIO_DRAFT_REGISTRY_READY_DIAGNOSTIC,
  S1_REGISTRY_COMPLETE_TAG,
  type ScenarioDraftRegistryPersistenceAdapter,
  type ScenarioDraftRegistrySnapshot,
} from "./scenarioDraftRegistryContract.ts";
import { buildScenarioDraft } from "./scenarioAuthoringContract.ts";

function buildValidDraft(overrides: Parameters<typeof buildScenarioDraft>[0] = {}) {
  return buildScenarioDraft({
    draftId: "scenario-draft:test-1",
    name: "Supplier Delay Risk",
    summary: "Model supplier outage impact.",
    description: "Executive risk scenario draft.",
    scenarioType: "risk",
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: ["supplier-1"],
    ...overrides,
  });
}

function createMemoryAdapter(initial: ScenarioDraftRegistrySnapshot | null = null) {
  let snapshot = initial;
  const adapter: ScenarioDraftRegistryPersistenceAdapter = Object.freeze({
    load: () => snapshot,
    save: (next) => {
      snapshot = next;
    },
    clear: () => {
      snapshot = null;
    },
  });
  return adapter;
}

test.beforeEach(() => {
  resetScenarioDraftRegistryForTests();
});

test("exports S1 registry completion tag", () => {
  assert.equal(S1_REGISTRY_COMPLETE_TAG, "[S1_REGISTRY_COMPLETE]");
  assert.equal(SCENARIO_DRAFT_REGISTRY_DIAGNOSTIC, "[SCENARIO_DRAFT_REGISTRY]");
  assert.equal(SCENARIO_DRAFT_REGISTRY_READY_DIAGNOSTIC, "[SCENARIO_DRAFT_REGISTRY_READY]");
});

test("creates reads updates and archives scenario drafts", () => {
  const draft = buildValidDraft();
  const created = createScenarioDraftRegistryEntry({ draft });

  assert.equal(created.success, true);
  assert.equal(created.reason, "created");
  assert.equal(created.draftsOnly, true);
  assert.equal(created.simulationActive, false);
  assert.equal(created.simulationResultsStored, false);
  assert.equal(created.registryIntegrityPreserved, true);

  const read = readScenarioDraftRegistryEntry({ draftId: draft.draftId });
  assert.equal(read?.draft.name, "Supplier Delay Risk");
  assert.equal(read?.registryStatus, "active");

  const updatedDraft = buildValidDraft({
    name: "Supplier Delay Risk v2",
    summary: "Updated supplier outage draft.",
  });
  const updated = updateScenarioDraftRegistryEntry({
    draftId: draft.draftId,
    draft: updatedDraft,
  });
  assert.equal(updated.success, true);
  assert.equal(updated.entry?.draft.name, "Supplier Delay Risk v2");

  const archived = archiveScenarioDraftRegistryEntry({ draftId: draft.draftId });
  assert.equal(archived.success, true);
  assert.equal(archived.entry?.registryStatus, "archived");
  assert.ok(archived.entry?.archivedAt);

  assert.equal(listScenarioDraftRegistryEntries().length, 0);
  assert.equal(listScenarioDraftRegistryEntries({ includeArchived: true }).length, 1);
});

test("rejects simulation payloads and preserves registry integrity", () => {
  const valid = createScenarioDraftRegistryEntry({ draft: buildValidDraft({ draftId: "scenario-draft:valid" }) });
  assert.equal(valid.success, true);

  const simulationDraft = {
    ...buildValidDraft({ draftId: "scenario-draft:sim" }),
    simulationActive: true,
  } as ReturnType<typeof buildValidDraft>;

  const rejected = createScenarioDraftRegistryEntry({ draft: simulationDraft });
  assert.equal(rejected.success, false);
  assert.equal(rejected.reason, "simulation_payload_rejected");

  const duplicate = createScenarioDraftRegistryEntry({ draft: buildValidDraft({ draftId: "scenario-draft:valid" }) });
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.reason, "duplicate_draft");

  const snapshot = getScenarioDraftRegistrySnapshot();
  assert.equal(snapshot.draftCount, 1);
  assert.equal(snapshot.activeCount, 1);
  assert.equal(snapshot.simulationResultsStored, false);
  assert.equal(snapshot.draftsOnly, true);
});

test("persists drafts across registry reinitialization", () => {
  const adapter = createMemoryAdapter();
  setScenarioDraftRegistryPersistenceAdapterForTests(adapter);

  const draft = buildValidDraft({ draftId: "scenario-draft:persist" });
  createScenarioDraftRegistryEntry({ draft });

  const persisted = adapter.load();
  assert.equal(persisted?.draftCount, 1);
  assert.equal(persisted?.entries[0]?.draft.draftId, "scenario-draft:persist");

  resetScenarioDraftRegistryForTests();
  setScenarioDraftRegistryPersistenceAdapterForTests(adapter);

  const restored = readScenarioDraftRegistryEntry({ draftId: "scenario-draft:persist" });
  assert.equal(restored?.draft.name, "Supplier Delay Risk");
  assert.equal(getScenarioDraftRegistrySnapshot().draftCount, 1);
});

test("does not mutate source draft during registry operations", () => {
  const draft = buildValidDraft({ draftId: "scenario-draft:immutable" });
  const before = JSON.stringify(draft);

  ScenarioDraftRegistry.createScenarioDraftRegistryEntry({ draft });
  ScenarioDraftRegistry.updateScenarioDraftRegistryEntry({
    draftId: draft.draftId,
    draft: buildValidDraft({ draftId: draft.draftId, name: "Updated Name" }),
  });

  assert.equal(JSON.stringify(draft), before);
});
