import assert from "node:assert/strict";
import test from "node:test";

import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { resetDeckDatasetReferencesForTests, setDeckDatasetReferenceStorageForTests } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { listWorkspaceDecks, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { createCausalInvestigation, getCausalInvestigation, resetCausalInvestigationDomainForTests } from "../scene-org/canonicalCausalInvestigationDomain.ts";
import { createCanonicalObject, getCanonicalObject, resetCanonicalObjectsForTests } from "../scene-org/canonicalObjectRegistry.ts";
import { resetCanonicalRelationshipsForTests } from "../scene-org/canonicalRelationshipGraph.ts";
import { resetDecisionDomainForTests } from "../scene-org/canonicalDecisionDomain.ts";
import { resetCanonicalMutationJournalForTests } from "../scene-org/canonicalMutationJournal.ts";
import { createManagerWorkspaceFromEntry } from "./managerWorkspaceEntry.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "./workspaceRegistryContract.ts";
import { getWorkspaceById, resetWorkspaceRegistryForTests, upsertWorkspace } from "./workspaceRegistryStore.ts";
import { resetWorkspaceDeletionGuardForTests } from "./workspaceDeletionGuard.ts";
import {
  confirmWorkspaceDeletion,
  failWorkspaceDeletionStepForTests,
  previewWorkspaceDeletion,
  requestWorkspaceDeletion,
  retryWorkspaceDeletion,
} from "./workspaceDeletionLifecycle.ts";

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

function setup() {
  const store = memory();
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  failWorkspaceDeletionStepForTests(null);
  resetCsvRealDataImportStoreForTests();
  setDeckRegistryStorageForTests(store);
  resetDeckRegistryForTests();
  setDeckDatasetReferenceStorageForTests(store);
  resetDeckDatasetReferencesForTests();
  resetCanonicalObjectsForTests(store);
  resetCanonicalRelationshipsForTests(store);
  resetDecisionDomainForTests(store);
  resetCanonicalMutationJournalForTests(store);
  resetCausalInvestigationDomainForTests(store);
  return store;
}

function disposableWorkspace() {
  const created = createManagerWorkspaceFromEntry({ name: "Disposable Certification", kind: "BUSINESS" });
  assert.ok(created);
  const current = getWorkspaceById(created.workspaceId);
  assert.ok(current);
  upsertWorkspace(Object.freeze({
    ...current,
    metadata: Object.freeze({
      ...(current.metadata ?? {}),
      disposableCertification: "local-certification",
    }),
  }));
  return created.workspaceId;
}

test("protected and unmarked workspaces cannot be deleted", () => {
  setup();
  const keeper = createManagerWorkspaceFromEntry({ name: "Keeper Company", kind: "BUSINESS" });
  assert.ok(keeper);
  const protectedPreview = previewWorkspaceDeletion(DEMO_WORKSPACE_ID);
  assert.equal(protectedPreview.permitted, false);
  assert.equal(protectedPreview.reason, "protected-workspace");
  assert.equal(requestWorkspaceDeletion({ workspaceId: DEMO_WORKSPACE_ID, operationId: "op-demo" }).ok, false);
  assert.equal(requestWorkspaceDeletion({ workspaceId: BUSINESS_DEMO_WORKSPACE_ID, operationId: "op-business" }).ok, false);
  assert.equal(previewWorkspaceDeletion(keeper.workspaceId).reason, "local-deletion-unauthorized");
  assert.ok(getWorkspaceById(DEMO_WORKSPACE_ID));
  assert.ok(getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID));
  assert.ok(getWorkspaceById(keeper.workspaceId));
});

test("confirmation is bound to the current preview and a failed cleanup stays incomplete", () => {
  setup();
  const workspaceId = disposableWorkspace();
  const keeper = createManagerWorkspaceFromEntry({ name: "Keeper Company", kind: "BUSINESS" });
  assert.ok(keeper);
  const owned = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "CNC Machine A", now: "2026-11-10T00:00:00.000Z" });
  const kept = createCanonicalObject({ workspaceId: keeper.workspaceId, objectType: "MACHINE", displayName: "CNC Machine A", now: "2026-11-10T00:00:00.000Z" });
  assert.equal(owned.ok, true);
  assert.equal(kept.ok, true);
  const investigation = createCausalInvestigation({
    workspaceId,
    deckId: "production",
    title: "Efficiency decline",
    problemStatement: "Output fell against the committed measurement.",
    now: "2026-11-10T00:00:00.000Z",
  });
  assert.equal(investigation.ok, true);
  const preview = previewWorkspaceDeletion(workspaceId);
  assert.equal(preview.permitted, true);
  assert.equal(preview.objects, 1);
  assert.equal(preview.investigations, 1);
  assert.ok(preview.decks >= 1);

  const unconfirmed = confirmWorkspaceDeletion({ workspaceId, operationId: "op-1", fingerprint: preview.fingerprint });
  assert.equal(unconfirmed.reason, "confirmation-required");
  assert.ok(getCanonicalObject(workspaceId, owned.ok ? owned.value.canonicalObjectId : ""));

  const requested = requestWorkspaceDeletion({ workspaceId, operationId: "op-1" });
  assert.equal(requested.ok, true);
  assert.equal(requested.phase, "DELETE_REQUESTED");
  const conflict = requestWorkspaceDeletion({ workspaceId, operationId: "op-2" });
  assert.equal(conflict.reason, "operation-conflict");

  const extra = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "CNC Machine A", now: "2026-11-10T00:01:00.000Z" });
  assert.equal(extra.ok, false);
  if (!extra.ok) assert.equal(extra.reason, "deletion-in-progress");
  const stale = confirmWorkspaceDeletion({ workspaceId, operationId: "op-1", fingerprint: "stale-fingerprint" });
  assert.equal(stale.reason, "stale-confirmation");
  assert.equal(getWorkspaceById(workspaceId)?.metadata && "deletionLifecycle" in (getWorkspaceById(workspaceId)?.metadata ?? {}), true);

  const current = previewWorkspaceDeletion(workspaceId);
  failWorkspaceDeletionStepForTests("objects");
  const blocked = confirmWorkspaceDeletion({ workspaceId, operationId: "op-1", fingerprint: current.fingerprint });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.phase, "DELETE_BLOCKED");
  assert.equal(blocked.failedStep, "objects");
  assert.ok(getWorkspaceById(workspaceId));
  assert.equal(getCausalInvestigation(workspaceId, investigation.ok ? investigation.value.investigationId : "")?.lifecycleStatus, undefined);
  const rejected = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "Late machine", now: "2026-11-10T00:02:00.000Z" });
  assert.equal(rejected.ok, false);
  if (!rejected.ok) assert.equal(rejected.reason, "deletion-in-progress");

  failWorkspaceDeletionStepForTests(null);
  const resumed = retryWorkspaceDeletion({ workspaceId, operationId: "op-1" });
  assert.equal(resumed.ok, true);
  assert.equal(resumed.phase, "DELETED");
  assert.equal(getWorkspaceById(workspaceId), null);
  assert.equal(listWorkspaceDecks(workspaceId).length, 0);
  assert.equal(getCanonicalObject(workspaceId, owned.ok ? owned.value.canonicalObjectId : ""), null);
  assert.ok(getWorkspaceById(keeper.workspaceId));
  assert.ok(getCanonicalObject(keeper.workspaceId, kept.ok ? kept.value.canonicalObjectId : ""));
  assert.ok(getWorkspaceById(DEMO_WORKSPACE_ID));
  assert.ok(getWorkspaceById(BUSINESS_DEMO_WORKSPACE_ID));

  const repeated = requestWorkspaceDeletion({ workspaceId, operationId: "op-1" });
  assert.equal(repeated.ok, false);
  const replay = retryWorkspaceDeletion({ workspaceId, operationId: "op-1" });
  assert.equal(replay.ok, false);
});
