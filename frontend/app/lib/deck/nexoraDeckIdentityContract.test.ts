import assert from "node:assert/strict";
import { test } from "node:test";

import { DEMO_WORKSPACE_ID, LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS } from "../workspace/workspaceRegistryContract.ts";
import {
  acceptDeckDescriptor,
  acceptDeckId,
  acceptDeckIdentity,
  classifyRecordOwnership,
  acceptDeckIdentitySet,
  acceptDeckRecord,
  acceptExecutiveObjectReference,
  datasetOwnershipAfterDeckReference,
  deckAccessAllowed,
  deckIdentityForDemoProfile,
  deckIdentityOf,
  deckSelectionAfterWorkspaceSwitch,
  decksShareWorkspace,
  executiveDeckIdentity,
  executiveMembershipAuthorizesSourceMutation,
  recordVisibleToDeck,
  sameCanonicalObject,
  sameDeckDescriptorIdentity,
  sameDeckIdentity,
  sharedDatasetSurvivesDeckDeletion,
  stageContextAfterViewChange,
  NEXORA_DECK_NAVIGATION_CONTRACT,
  NEXORA_EXECUTIVE_DECK_ID,
  type NexoraDeckIdentity,
} from "./nexoraDeckIdentityContract.ts";
import { BUSINESS_DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";

const companyA = "company_a";
const companyB = "company_b";

function deck(workspaceId: string, deckId: string, name = "Manufacturing"): NexoraDeckIdentity {
  const identity = acceptDeckIdentity({ workspaceId, deckId, name });
  assert.ok(identity);
  return identity;
}

test("a trimmed Deck identity is accepted and an empty id is rejected", () => {
  assert.equal(acceptDeckId("  manufacturing  "), "manufacturing");
  assert.equal(acceptDeckId(""), null);
  assert.equal(acceptDeckId("   "), null);
  assert.equal(acceptDeckId(null), null);
  assert.equal(acceptDeckIdentity({ workspaceId: "  ", deckId: "manufacturing" }), null);
  assert.deepEqual(acceptDeckIdentity({ workspaceId: companyA, deckId: "manufacturing" }), {
    workspaceId: companyA,
    deckId: "manufacturing",
  });
});

test("workflow modes are rejected as Deck ids and as Deck workspaces", () => {
  for (const mode of LEGACY_WORKFLOW_WORKSPACE_IDENTIFIERS) {
    assert.equal(acceptDeckId(mode), null);
    assert.equal(acceptDeckIdentity({ workspaceId: companyA, deckId: mode }), null);
    assert.equal(acceptDeckIdentity({ workspaceId: mode, deckId: "manufacturing" }), null);
  }
});

test("display name is not part of Deck identity", () => {
  const first = acceptDeckDescriptor({ workspaceId: companyA, deckId: "manufacturing", name: "Plant" });
  const renamed = acceptDeckDescriptor({ workspaceId: companyA, deckId: "manufacturing", name: "Quality" });
  assert.ok(first);
  assert.ok(renamed);
  assert.equal(sameDeckDescriptorIdentity(first, renamed), true);
  assert.equal(sameDeckIdentity(deckIdentityOf(first), deckIdentityOf(renamed)), true);
  assert.notEqual(first.name, renamed.name);
  assert.equal(acceptDeckDescriptor({ workspaceId: companyA, deckId: "manufacturing", name: "  " }), null);
});

test("one workspace holds multiple Decks and the same deckId in another workspace is distinct", () => {
  const manufacturing = deck(companyA, "manufacturing");
  const project = deck(companyA, "project", "Project");
  const foreign = deck(companyB, "manufacturing");
  assert.equal(decksShareWorkspace([manufacturing, project]), true);
  assert.equal(decksShareWorkspace([manufacturing, foreign]), false);
  assert.equal(sameDeckIdentity(manufacturing, project), false);
  assert.equal(sameDeckIdentity(manufacturing, foreign), false);
  assert.equal(manufacturing.deckId, foreign.deckId);
});

test("cross-workspace records stay hidden when the deckId matches", () => {
  const viewer = deck(companyB, "manufacturing");
  const owned = {
    workspaceId: companyA,
    deckId: "manufacturing",
    ownership: "deck-owned" as const,
  };
  assert.equal(recordVisibleToDeck(owned, viewer), false);
  assert.equal(classifyRecordOwnership(owned), "deck-owned");
  assert.equal(deckAccessAllowed({ authorizedWorkspaceId: companyB, deck: deck(companyA, "manufacturing") }), false);
  assert.equal(deckAccessAllowed({ authorizedWorkspaceId: companyA, deck: deck(companyA, "manufacturing") }), true);
});

test("optional Deck ownership isolates Deck rows and preserves legacy and shared rows", () => {
  const viewer = deck(companyA, "manufacturing");
  const other = deck(companyA, "project", "Project");
  const legacy = { workspaceId: companyA, fileName: "equipment.csv", sceneName: "Finance", objectLabel: "CNC-01", observedAt: "2026-11-04T00:00:00.000Z" };
  const shared = { workspaceId: companyA, ownership: "workspace-shared" as const, fileName: "equipment.csv" };
  const owned = { workspaceId: companyA, deckId: "manufacturing", fileName: "production.csv" };
  const foreignDeck = { workspaceId: companyA, deckId: "project", ownership: "deck-owned" as const };
  assert.equal(classifyRecordOwnership(legacy), "legacy-unassigned");
  assert.equal(classifyRecordOwnership(shared), "workspace-shared");
  assert.equal(classifyRecordOwnership(owned), "deck-owned");
  assert.equal(recordVisibleToDeck(legacy, viewer), false);
  assert.equal(recordVisibleToDeck(shared, viewer), true);
  assert.equal(recordVisibleToDeck(shared, other), true);
  assert.equal(recordVisibleToDeck(owned, viewer), true);
  assert.equal(recordVisibleToDeck(owned, other), false);
  assert.equal(recordVisibleToDeck(foreignDeck, viewer), false);
  assert.equal(classifyRecordOwnership({ workspaceId: companyA, ownership: "deck-owned", deckId: "overview" }), "legacy-unassigned");
});

test("demo profiles map to Deck identity only inside demo_workspace", () => {
  assert.deepEqual(deckIdentityForDemoProfile(DEMO_WORKSPACE_ID, "manufacturing"), {
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "manufacturing",
  });
  assert.deepEqual(deckIdentityForDemoProfile(DEMO_WORKSPACE_ID, "project"), {
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "project",
  });
  assert.equal(deckIdentityForDemoProfile(companyA, "manufacturing"), null);
  assert.equal(deckIdentityForDemoProfile(DEMO_WORKSPACE_ID, "business"), null);
  assert.equal(deckIdentityForDemoProfile(DEMO_WORKSPACE_ID, null), null);
});

test("a workspace switch drops a Deck from the previous workspace", () => {
  const selection = deck(companyA, "manufacturing");
  assert.equal(deckSelectionAfterWorkspaceSwitch(selection, companyB), null);
  assert.equal(deckSelectionAfterWorkspaceSwitch(selection, "overview"), null);
  assert.deepEqual(deckSelectionAfterWorkspaceSwitch(selection, companyA), selection);
  assert.equal(selection.workspaceId, companyA);
});

test("a Deck reference does not take ownership of workspace-shared data", () => {
  const dataset = { workspaceId: companyA, ownership: "workspace-shared" as const, fileName: "equipment.csv" };
  const reference = {
    workspaceId: companyA,
    datasetId: "equipment.csv",
    referencedBy: deck(companyA, "manufacturing"),
  };
  assert.equal(datasetOwnershipAfterDeckReference(dataset, reference), "workspace-shared");
  assert.equal(sharedDatasetSurvivesDeckDeletion(dataset), true);
  assert.equal(sharedDatasetSurvivesDeckDeletion({ workspaceId: companyA, deckId: "manufacturing" }), false);
  assert.equal(datasetOwnershipAfterDeckReference(dataset, {
    ...reference,
    referencedBy: deck(companyB, "manufacturing"),
  }), null);
  assert.equal(datasetOwnershipAfterDeckReference(
    { workspaceId: companyA, deckId: "manufacturing" },
    reference,
  ), null);
});

test("duplicate Deck ids in one Workspace are rejected and the same id elsewhere stays distinct", () => {
  const manufacturing = deck(companyA, "manufacturing");
  const again = deck(companyA, "manufacturing", "Plant");
  const foreign = deck(companyB, "manufacturing");
  assert.equal(acceptDeckIdentitySet([manufacturing, again]), null);
  assert.equal(acceptDeckIdentitySet([manufacturing, foreign])?.length, 2);
});

test("Executive Deck is a first-class kind and a rename keeps the id", () => {
  const createdAt = "2026-11-08T00:00:00.000Z";
  const record = acceptDeckRecord({
    workspaceId: companyA,
    deckId: NEXORA_EXECUTIVE_DECK_ID,
    name: "Executive",
    kind: "EXECUTIVE",
    status: "ACTIVE",
    createdAt,
    updatedAt: createdAt,
  });
  const renamed = acceptDeckRecord({
    ...record,
    name: "Leadership",
    updatedAt: "2026-11-08T01:00:00.000Z",
  });
  assert.equal(record?.kind, "EXECUTIVE");
  assert.equal(renamed?.deckId, record?.deckId);
  assert.equal(renamed?.createdAt, createdAt);
  assert.notEqual(renamed?.name, record?.name);
  assert.equal(acceptDeckRecord({ ...record, kind: "overview" }), null);
  assert.deepEqual(executiveDeckIdentity(companyA), { workspaceId: companyA, deckId: "executive" });
  assert.equal(executiveDeckIdentity("overview"), null);
});

test("an Executive reference preserves the source object and does not authorize mutation", () => {
  const reference = acceptExecutiveObjectReference({
    workspaceId: companyA,
    canonicalObjectId: "obj-capacity",
    sourceDeckId: "manufacturing",
    memberDeckId: "executive",
  });
  const sourceMembership = acceptExecutiveObjectReference({
    workspaceId: companyA,
    canonicalObjectId: "obj-capacity",
    sourceDeckId: "inventory",
    memberDeckId: "executive",
  });
  assert.ok(reference);
  assert.ok(sourceMembership);
  assert.equal(sameCanonicalObject(reference, sourceMembership), true);
  assert.equal(reference.sourceDeckId, "manufacturing");
  assert.equal("dataset" in reference, false);
  assert.equal(executiveMembershipAuthorizesSourceMutation(reference), false);
  assert.equal(acceptExecutiveObjectReference({
    workspaceId: companyA,
    canonicalObjectId: "obj-capacity",
    sourceDeckId: "overview",
    memberDeckId: "executive",
  }), null);
  assert.equal(acceptExecutiveObjectReference({
    workspaceId: "overview",
    canonicalObjectId: "obj-capacity",
    sourceDeckId: "manufacturing",
    memberDeckId: "executive",
  }), null);
});

test("Business Demo does not inherit a Manufacturing Deck identity", () => {
  assert.equal(deckIdentityForDemoProfile(BUSINESS_DEMO_WORKSPACE_ID, "manufacturing"), null);
  assert.equal(deckIdentityForDemoProfile(BUSINESS_DEMO_WORKSPACE_ID, "project"), null);
  assert.deepEqual(executiveDeckIdentity(BUSINESS_DEMO_WORKSPACE_ID), {
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    deckId: "executive",
  });
});

test("a Stage view change keeps the Deck and does not select a Workspace", () => {
  const context = {
    workspaceId: companyA,
    deckId: "executive",
    demoProfileId: null,
    stageViewId: null,
  };
  const next = stageContextAfterViewChange(context, "decision-solar");
  assert.equal(next?.deckId, "executive");
  assert.equal(next?.workspaceId, companyA);
  assert.equal(next?.stageViewId, "decision-solar");
  assert.equal(stageContextAfterViewChange(context, "overview"), null);
  assert.equal(NEXORA_DECK_NAVIGATION_CONTRACT.deckSelectionChangesWorkspace, false);
  assert.equal(NEXORA_DECK_NAVIGATION_CONTRACT.workflowModeIsDeckId, false);
});
