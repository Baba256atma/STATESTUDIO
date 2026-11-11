import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analyzeCanonicalTopology,
} from "./canonicalTopologyEngine.ts";
import { resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import {
  canonicalDataObjectId,
  declareCanonicalRelationship,
  listCanonicalRelationships,
  resetCanonicalRelationshipsForTests,
} from "./canonicalRelationshipGraph.ts";
import {
  applyDatasetReconciliation,
  approveCanonicalObjectProposal,
  archiveCanonicalObject,
  assignCanonicalObjectToDeck,
  associateCanonicalObjectSource,
  CANONICAL_OBJECT_STORAGE_KEY,
  canonicalObjectAuthorityStatus,
  createCanonicalObject,
  deleteCanonicalObject,
  forgetWorkspaceCanonicalObjects,
  listCanonicalObjects,
  listDeckCanonicalObjects,
  previewDatasetEntities,
  proposeCanonicalObject,
  rejectCanonicalObjectProposal,
  removeCanonicalObjectFromDeck,
  renameCanonicalObject,
  resetCanonicalObjectsForTests,
  restoreCanonicalObject,
  recoverCanonicalMutations,
  updateCanonicalObjectAttributes,
} from "./canonicalObjectRegistry.ts";
import { resetWorkspaceRegistryForTests, upsertWorkspace } from "../workspace/workspaceRegistryStore.ts";

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

const workspaceId = "company-a";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  upsertWorkspace({
    workspaceId,
    workspaceName: "Company A",
    status: "active",
    createdAt: "2026-11-10T00:00:00.000Z",
    updatedAt: "2026-11-10T00:00:00.000Z",
    lastOpenedAt: "2026-11-10T00:00:00.000Z",
    metadata: { authorityGeneration: 1 },
  });
});

test("manager objects keep stable ids across rename and attribute edits", () => {
  resetCanonicalObjectsForTests(memory());
  const created = createCanonicalObject({
    workspaceId,
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    attributes: { machineCode: "CNC-001", capacityPerHour: 120 },
    deckId: "production",
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const renamed = renameCanonicalObject({
    workspaceId,
    canonicalObjectId: created.value.canonicalObjectId,
    displayName: "CNC Machine A Prime",
  });
  assert.equal(renamed.ok && renamed.value.canonicalObjectId, created.value.canonicalObjectId);
  const edited = updateCanonicalObjectAttributes({
    workspaceId,
    canonicalObjectId: created.value.canonicalObjectId,
    attributes: { machineCode: "CNC-001", capacityPerHour: 140 },
  });
  assert.equal(edited.ok && edited.value.attributes.capacityPerHour, 140);
  assert.equal(updateCanonicalObjectAttributes({
    workspaceId,
    canonicalObjectId: created.value.canonicalObjectId,
    attributes: { machineCode: "CNC-001", causalRule: true },
  }).ok, false);
  assert.equal(createCanonicalObject({
    workspaceId: "demo_workspace",
    objectType: "MACHINE",
    displayName: "Blocked",
  }).ok, false);
});

test("dataset mapping preserves source identity and does not merge a second dataset automatically", () => {
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  const rows = [
    { machine_id: "M001", machine_name: "CNC Machine A", capacity: "120" },
    { machine_id: "M002", machine_name: "CNC Machine B", capacity: "95" },
    { machine_id: "M001", machine_name: "Duplicate", capacity: "1" },
    { machine_id: "", machine_name: "Missing", capacity: "1" },
  ];
  const mapping = {
    workspaceId,
    datasetId: "csv:company-a:machines",
    objectType: "MACHINE" as const,
    sourceKeyColumn: "machine_id",
    displayNameColumn: "machine_name",
    attributeColumns: { capacity: "capacityPerHour" },
    rows,
  };
  const preview = previewDatasetEntities(mapping);
  assert.equal(preview.ok, true);
  if (!preview.ok) return;
  assert.equal(preview.value.proposed.length, 2);
  assert.equal(preview.value.rejectedRows.length, 2);
  assert.equal(preview.value.syntheticObjects, false);
  const applied = applyDatasetReconciliation({ ...mapping, rows: rows.slice(0, 2), createProposed: true, deckId: "production" });
  assert.equal(applied.ok, true);
  const first = listDeckCanonicalObjects(workspaceId, "production");
  assert.equal(first.length, 2);
  const replaced = applyDatasetReconciliation({
    ...mapping,
    rows: [
      { machine_id: "M001", machine_name: "CNC Machine A", capacity: "120" },
      { machine_id: "M002", machine_name: "CNC Machine B Updated", capacity: "95" },
      { machine_id: "M003", machine_name: "CNC Machine C", capacity: "150" },
    ],
    createProposed: true,
    updateExisting: true,
    deckId: "production",
  });
  assert.equal(replaced.ok, true);
  const after = listCanonicalObjects(workspaceId).filter((object) => object.lifecycleStatus === "ACTIVE" && object.provenance === "VERIFIED_DATASET_MAPPING");
  assert.equal(after.find((object) => object.sourceLinks[0]?.sourceKey === "M001")?.canonicalObjectId, first[0]?.canonicalObjectId);
  assert.equal(after.find((object) => object.sourceLinks[0]?.sourceKey === "M002")?.displayName, "CNC Machine B Updated");
  assert.equal(after.length, 3);
  const other = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "From another source" });
  assert.equal(other.ok, true);
  if (!other.ok) return;
  assert.equal(associateCanonicalObjectSource({
    workspaceId,
    canonicalObjectId: other.value.canonicalObjectId,
    datasetId: "csv:company-a:machines",
    sourceKey: "M001",
  }).ok, false);
  const linked = associateCanonicalObjectSource({
    workspaceId,
    canonicalObjectId: other.value.canonicalObjectId,
    datasetId: "csv:company-a:maintenance",
    sourceKey: "M001",
  });
  assert.equal(linked.ok, true);
  const gone = applyDatasetReconciliation({
    ...mapping,
    rows: [{ machine_id: "M002", machine_name: "CNC Machine B Updated", capacity: "95" }],
    updateExisting: true,
    createProposed: false,
  });
  assert.equal(gone.ok && gone.value.missing.length > 0, true);
  assert.equal(listDeckCanonicalObjects(workspaceId, "production").some((object) => object.sourceLinks[0]?.sourceKey === "M001"), true);
});

test("proposals stay off the stage until approval, and lifecycle does not resurrect a deleted object", () => {
  resetCanonicalRelationshipsForTests(memory());
  resetCanonicalObjectsForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  const proposal = proposeCanonicalObject({ workspaceId, objectType: "ACTIVITY", displayName: "Quality Inspection" });
  assert.equal(proposal.ok, true);
  if (!proposal.ok) return;
  assert.equal(listDeckCanonicalObjects(workspaceId, "production").length, 0);
  assert.equal(rejectCanonicalObjectProposal(workspaceId, proposal.value.proposalId).ok, true);
  const second = proposeCanonicalObject({ workspaceId, objectType: "ACTIVITY", displayName: "Quality Inspection" });
  assert.equal(second.ok, true);
  if (!second.ok) return;
  const approved = approveCanonicalObjectProposal({ workspaceId, proposalId: second.value.proposalId, deckId: "production" });
  assert.equal(approved.ok && approved.value.provenance, "MANAGER_APPROVED_PROPOSAL");
  if (!approved.ok) return;
  const machine = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "CNC Machine A", deckId: "production" });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  const edge = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: approved.value.canonicalObjectId,
    targetObjectId: machine.value.canonicalObjectId,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: [approved.value.canonicalObjectId, machine.value.canonicalObjectId, canonicalDataObjectId(workspaceId, "csv:company-a:production")],
  });
  assert.equal(edge.ok, true);
  assert.equal(archiveCanonicalObject({ workspaceId, canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
  assert.equal(listDeckCanonicalObjects(workspaceId, "production").some((object) => object.canonicalObjectId === machine.value.canonicalObjectId), false);
  assert.equal(listCanonicalRelationships(workspaceId).find((relationship) => relationship.targetObjectId === machine.value.canonicalObjectId)?.status, "ARCHIVED");
  assert.equal(restoreCanonicalObject({ workspaceId, canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
  assert.equal(deleteCanonicalObject({ workspaceId, canonicalObjectId: machine.value.canonicalObjectId }).ok, true);
  assert.equal(renameCanonicalObject({
    workspaceId,
    canonicalObjectId: machine.value.canonicalObjectId,
    displayName: "Returned",
  }).ok, false);
});

test("deck removal keeps one workspace object and topology reads only declared edges", () => {
  resetCanonicalRelationshipsForTests(memory());
  resetCanonicalObjectsForTests(memory());
  const department = createCanonicalObject({ workspaceId, objectType: "ORGANIZATION_UNIT", displayName: "Production", deckId: "production" });
  const machine = createCanonicalObject({ workspaceId, objectType: "MACHINE", displayName: "CNC Machine A", deckId: "production" });
  assert.equal(department.ok && machine.ok, true);
  if (!department.ok || !machine.ok) return;
  assignCanonicalObjectToDeck({ workspaceId, canonicalObjectId: machine.value.canonicalObjectId, deckId: "executive" });
  removeCanonicalObjectFromDeck({ workspaceId, canonicalObjectId: machine.value.canonicalObjectId, deckId: "production" });
  assert.equal(listDeckCanonicalObjects(workspaceId, "production").some((object) => object.canonicalObjectId === machine.value.canonicalObjectId), false);
  assert.equal(listDeckCanonicalObjects(workspaceId, "executive")[0]?.canonicalObjectId, machine.value.canonicalObjectId);
  declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: department.value.canonicalObjectId,
    targetObjectId: machine.value.canonicalObjectId,
    relationshipType: "CONTAINS",
    knownObjectIds: [department.value.canonicalObjectId, machine.value.canonicalObjectId],
  });
  const analysis = analyzeCanonicalTopology({
    workspaceId,
    deckId: "executive",
    nodeIds: [machine.value.canonicalObjectId],
    relationships: listCanonicalRelationships(workspaceId),
  });
  assert.equal(analysis.syntheticCanonicalEdges, false);
  assert.equal(analysis.inputRelationshipIds.length, 0);
  assert.equal(analysis.busStatus, "UNSUPPORTED_SEMANTICS");
});

test("corrupt registry storage is not treated as empty and a failed write leaves memory unchanged", () => {
  const store = memory();
  store.setItem(CANONICAL_OBJECT_STORAGE_KEY, "{");
  resetCanonicalObjectsForTests(store);
  assert.equal(canonicalObjectAuthorityStatus(), "corrupt");
  assert.equal(createCanonicalObject({ workspaceId, objectType: "PRODUCT", displayName: "Finished" }).ok, false);
  assert.equal(store.getItem(CANONICAL_OBJECT_STORAGE_KEY), "{");
  const failing = memory();
  failing.setItem = () => { throw new Error("full"); };
  resetCanonicalObjectsForTests(failing);
  assert.equal(createCanonicalObject({ workspaceId, objectType: "PRODUCT", displayName: "Finished" }).ok, false);
  assert.equal(canonicalObjectAuthorityStatus(), "empty");
});

test("five hundred registry objects stay addressable without raising the topology render limit", () => {
  resetCanonicalObjectsForTests(memory());
  let lastId = "";
  for (let index = 0; index < 500; index += 1) {
    const created = createCanonicalObject({ workspaceId, objectType: "RESOURCE", displayName: `Material ${index}` });
    assert.equal(created.ok, true);
    if (created.ok) lastId = created.value.canonicalObjectId;
  }
  assert.equal(createCanonicalObject({ workspaceId, objectType: "RESOURCE", displayName: "Overflow" }).ok, false);
  assert.equal(renameCanonicalObject({ workspaceId, canonicalObjectId: lastId, displayName: "Material last" }).ok, true);
  assert.equal(forgetWorkspaceCanonicalObjects(workspaceId).ok, true);
  assert.equal(listDeckCanonicalObjects(workspaceId, "production").length, 0);
});
