import assert from "node:assert/strict";
import test from "node:test";
import {
  approveManagerDecision,
  CANONICAL_DECISION_STORAGE_KEY,
  canonicalDecisionAuthorityStatus,
  createDecisionGoal,
  createDecisionScenario,
  createExecutionPlan,
  createManagerDecision,
  getManagerDecision,
  rejectManagerDecision,
  resetDecisionDomainForTests,
} from "./canonicalDecisionDomain.ts";
import {
  archiveCanonicalObject,
  associateCanonicalObjectSource,
  CANONICAL_OBJECT_STORAGE_KEY,
  canonicalObjectRegistryIdentity,
  createCanonicalObject,
  deleteCanonicalObject,
  getCanonicalObject,
  resetCanonicalObjectsForTests,
  updateCanonicalObjectAttributes,
} from "./canonicalObjectRegistry.ts";
import {
  archiveCanonicalRelationship,
  CANONICAL_RELATIONSHIP_STORAGE_KEY,
  canonicalRelationshipGraphIdentity,
  declareCanonicalRelationship,
  listCanonicalRelationships,
  resetCanonicalRelationshipsForTests,
} from "./canonicalRelationshipGraph.ts";
import { listCanonicalMutations, resetCanonicalMutationJournalForTests } from "./canonicalMutationJournal.ts";
import {
  installAuthoritativeWorkspaceCsv,
  removeCsvRealDataImport,
  resetCsvRealDataImportStoreForTests,
  type CsvCommittedImport,
} from "../data-reality/csvRealDataImportStore.ts";
import { parseCsvDeterministically } from "../data-reality/csvRealDataVerticalSlice.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { deleteWorkspace, listWorkspaces, resetWorkspaceRegistryForTests, setActiveWorkspace } from "../workspace/workspaceRegistryStore.ts";
import { createSceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";
import { serializeSceneOrgSavedScenes } from "./sceneOrgSavedSceneDurability.ts";
import { previewDecisionImpact } from "./decisionImpactPreview.ts";

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
  resetCanonicalObjectsForTests(memory());
  resetCanonicalRelationshipsForTests(memory());
  resetDecisionDomainForTests(memory());
  resetCanonicalMutationJournalForTests(memory());
  resetCsvRealDataImportStoreForTests();
}

function object(workspaceId: string, deckId: string, name: string, type: "MACHINE" | "ORGANIZATION_UNIT" = "MACHINE") {
  const created = createCanonicalObject({ workspaceId, objectType: type, displayName: name, deckId });
  if (!created.ok) throw new Error(created.reason);
  assert.equal(created.ok, true);
  return created.value;
}

function decisionChain(workspaceId: string, deckId: string, targetId: string | null, status: "PROPOSED" | "APPROVED" | "REJECTED" = "APPROVED") {
  const goal = createDecisionGoal({ workspaceId, deckId, name: "Improve Production Reliability" });
  const scenario = createDecisionScenario({ workspaceId, deckId, name: "Preventive Maintenance", goalId: goal.ok ? goal.value.goalId : "" });
  const decision = createManagerDecision({ workspaceId, deckId, name: "Approve Maintenance Pilot", scenarioId: scenario.ok ? scenario.value.scenarioId : "" });
  assert.equal(goal.ok && scenario.ok && decision.ok, true);
  if (!goal.ok || !scenario.ok || !decision.ok) throw new Error("context");
  if (status === "REJECTED") {
    assert.equal(rejectManagerDecision({ workspaceId, deckId, decisionId: decision.value.decisionId }).ok, true);
  }
  if (status === "APPROVED") {
    assert.equal(approveManagerDecision({ workspaceId, deckId, decisionId: decision.value.decisionId }).ok, true);
    if (targetId) {
      assert.equal(createExecutionPlan({
        workspaceId,
        deckId,
        name: "Maintenance Pilot",
        decisionId: decision.value.decisionId,
        organizationalObjectId: targetId,
      }).ok, true);
    }
  }
  return decision.value.decisionId;
}

function relate(workspaceId: string, sourceId: string, targetId: string, relationshipType: "DEPENDS_ON" | "CONTAINS" | "ASSOCIATED_WITH" | "SUPPLIES_TO", known: readonly string[]) {
  const created = declareCanonicalRelationship({ workspaceId, sourceObjectId: sourceId, targetObjectId: targetId, relationshipType, knownObjectIds: known });
  if (!created.ok) throw new Error(created.reason);
  assert.equal(created.ok, true);
  return created.value.relationshipId;
}

test("approved, proposed, and rejected decisions keep their status and do not invent a target", () => {
  setup();
  const machine = object("company-a", "production", "CNC Machine A");
  const approvedId = decisionChain("company-a", "production", machine.canonicalObjectId, "APPROVED");
  const proposedId = decisionChain("company-a", "production", null, "PROPOSED");
  const rejectedId = decisionChain("company-a", "production", null, "REJECTED");
  const approved = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId: approvedId });
  const proposed = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId: proposedId });
  const rejected = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId: rejectedId });
  assert.equal(approved.status, "ready");
  assert.equal(proposed.status, "ready");
  assert.equal(rejected.status, "ready");
  if (approved.status !== "ready" || proposed.status !== "ready" || rejected.status !== "ready") return;
  assert.equal(approved.preview.decisionStatus, "APPROVED");
  assert.equal(proposed.preview.decisionStatus, "PROPOSED");
  assert.equal(rejected.preview.decisionStatus, "REJECTED");
  assert.equal(approved.preview.directTargets[0]?.classification, "DIRECT_TARGET");
  assert.equal(proposed.preview.directTargets.length, 0);
  assert.match(proposed.preview.limitations.join(" "), /No organizational target was inferred/);
  assert.equal(getManagerDecision("company-a", approvedId)?.lifecycleStatus, "APPROVED");
  assert.equal(getManagerDecision("company-a", proposedId)?.lifecycleStatus, "PROPOSED");
  assert.equal(getManagerDecision("company-a", rejectedId)?.lifecycleStatus, "REJECTED");
  assert.equal(approved.preview.decisionContext.some((item) => item.kind === "GOAL"), true);
  assert.equal(approved.preview.decisionContext.some((item) => item.kind === "SCENARIO"), true);
  assert.equal(approved.preview.decisionContext.some((item) => item.kind === "EXECUTION_PLAN" && item.lifecycleStatus === "PLANNED"), true);
});

test("relationship tracing preserves direction, stops cycles, and reports truncation", () => {
  setup();
  const machineA = object("company-a", "production", "CNC Machine A");
  const machineB = object("company-a", "production", "CNC Machine B");
  const machineC = object("company-a", "production", "CNC Machine C");
  const department = object("company-a", "production", "Production Department", "ORGANIZATION_UNIT");
  const partner = object("company-a", "production", "Partner");
  const known = [machineA, machineB, machineC, department, partner].map((item) => item.canonicalObjectId);
  relate("company-a", department.canonicalObjectId, machineA.canonicalObjectId, "CONTAINS", known);
  relate("company-a", machineB.canonicalObjectId, machineA.canonicalObjectId, "DEPENDS_ON", known);
  relate("company-a", machineC.canonicalObjectId, machineB.canonicalObjectId, "DEPENDS_ON", known);
  relate("company-a", machineA.canonicalObjectId, machineB.canonicalObjectId, "DEPENDS_ON", known);
  relate("company-a", machineA.canonicalObjectId, partner.canonicalObjectId, "ASSOCIATED_WITH", known);
  relate("company-a", machineA.canonicalObjectId, partner.canonicalObjectId, "SUPPLIES_TO", known);
  const decisionId = decisionChain("company-a", "production", machineA.canonicalObjectId);
  const oneHop = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  const twoHop = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId, maxDepth: 2 });
  assert.equal(oneHop.status, "ready");
  assert.equal(twoHop.status, "ready");
  if (oneHop.status !== "ready" || twoHop.status !== "ready") return;
  const names = oneHop.preview.connectedObjects.map((item) => item.name).sort();
  assert.deepEqual(names, ["CNC Machine B", "Partner", "Production Department"]);
  assert.equal(oneHop.preview.connectedObjects.find((item) => item.name === "CNC Machine C"), undefined);
  assert.equal(twoHop.preview.connectedObjects.some((item) => item.name === "CNC Machine C"), true);
  const departmentPath = oneHop.preview.connectedObjects.find((item) => item.name === "Production Department")?.path[0];
  const dependencyPath = oneHop.preview.connectedObjects.find((item) => item.name === "CNC Machine B")?.path[0];
  const associationPath = oneHop.preview.connectedObjects.find((item) => item.name === "Partner")?.path[0];
  assert.equal(departmentPath?.relationshipType, "CONTAINS");
  assert.equal(departmentPath?.traversal, "incoming");
  assert.equal(dependencyPath?.traversal, "incoming");
  assert.equal(associationPath?.traversal, "undirected");
  assert.equal(oneHop.preview.connectedObjects.filter((item) => item.name === "Partner").length, 1);
  assert.equal(twoHop.preview.connectedObjects.filter((item) => item.objectId === machineA.canonicalObjectId).length, 0);
  assert.match(oneHop.preview.connectedObjects.map((item) => item.explanation).join(" "), /does not establish/);
  assert.doesNotMatch(JSON.stringify(oneHop.preview), /will improve|definitely affected|guaranteed impact|will fail/i);
  const extra = Array.from({ length: 101 }, (_, index) => object("company-a", "production", `Neighbor ${index}`));
  const all = [...known, ...extra.map((item) => item.canonicalObjectId)];
  for (const neighbor of extra) relate("company-a", neighbor.canonicalObjectId, machineA.canonicalObjectId, "ASSOCIATED_WITH", all);
  const bounded = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  assert.equal(bounded.status, "ready");
  if (bounded.status !== "ready") return;
  assert.equal(bounded.preview.truncated, true);
  assert.equal(bounded.preview.omittedNodes > 0, true);
  assert.match(bounded.preview.limitations.join(" "), /incomplete/);
});

test("archived edges and inactive endpoints stay out of the active trace", () => {
  setup();
  const machineA = object("company-a", "production", "CNC Machine A");
  const machineB = object("company-a", "production", "CNC Machine B");
  const archived = object("company-a", "production", "Archived Machine");
  const known = [machineA.canonicalObjectId, machineB.canonicalObjectId, archived.canonicalObjectId];
  const edge = relate("company-a", machineB.canonicalObjectId, machineA.canonicalObjectId, "DEPENDS_ON", known);
  relate("company-a", archived.canonicalObjectId, machineA.canonicalObjectId, "DEPENDS_ON", known);
  const decisionId = decisionChain("company-a", "production", machineA.canonicalObjectId);
  archiveCanonicalRelationship("company-a", edge);
  assert.equal(archiveCanonicalObject({ workspaceId: "company-a", canonicalObjectId: archived.canonicalObjectId }).ok, true);
  const preview = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  assert.equal(preview.status, "ready");
  if (preview.status !== "ready") return;
  assert.equal(preview.preview.connectedObjects.some((item) => item.objectId === machineB.canonicalObjectId), false);
  assert.equal(preview.preview.missingReferences.some((item) => item.reason === "inactive"), true);
  assert.equal(deleteCanonicalObject({ workspaceId: "company-a", canonicalObjectId: machineA.canonicalObjectId }).ok, true);
  const missing = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  assert.equal(missing.status, "ready");
  if (missing.status !== "ready") return;
  assert.equal(missing.preview.directTargets.length, 0);
  assert.equal(missing.preview.missingReferences.some((item) => item.reason === "deleted"), true);
});

test("dataset evidence keeps provenance and conflicts without writing canonical attributes", () => {
  setup();
  for (const workspace of listWorkspaces()) {
    if (workspace.workspaceId.startsWith("impact_evidence_")) deleteWorkspace(workspace.workspaceId);
  }
  resetWorkspaceRegistryForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Impact Evidence", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  try {
  const machine = object(company.workspaceId, "production", "CNC Machine A");
  assert.equal(updateCanonicalObjectAttributes({
    workspaceId: company.workspaceId,
    canonicalObjectId: machine.canonicalObjectId,
    attributes: { capacityPerHour: 120 },
  }).ok, true);
  const current = parseCsvDeterministically("id,capacity\nCNC-A,120");
  const conflict = parseCsvDeterministically("id,capacity\nCNC-A,90");
  const currentImport = {
    workspaceId: company.workspaceId,
    sourceContextId: "csv:production",
    importId: "import-production",
    committedAt: "2026-11-09T00:00:00.000Z",
    prepared: { fileName: "production.csv", parse: current, mapping: { mappingId: "map-production" } },
  } as CsvCommittedImport;
  const conflictImport = {
    workspaceId: company.workspaceId,
    sourceContextId: "csv:maintenance",
    importId: "import-maintenance",
    committedAt: "2026-11-09T00:00:00.000Z",
    prepared: { fileName: "maintenance.csv", parse: conflict, mapping: { mappingId: "map-maintenance" } },
  } as CsvCommittedImport;
  installAuthoritativeWorkspaceCsv([currentImport, conflictImport]);
  assert.equal(associateCanonicalObjectSource({ workspaceId: company.workspaceId, canonicalObjectId: machine.canonicalObjectId, datasetId: "csv:production", sourceKey: "CNC-A" }).ok, true);
  assert.equal(associateCanonicalObjectSource({ workspaceId: company.workspaceId, canonicalObjectId: machine.canonicalObjectId, datasetId: "csv:maintenance", sourceKey: "CNC-A" }).ok, true);
  assert.equal(associateCanonicalObjectSource({ workspaceId: company.workspaceId, canonicalObjectId: machine.canonicalObjectId, datasetId: "csv:missing", sourceKey: "CNC-A" }).ok, true);
  const decisionId = decisionChain(company.workspaceId, "production", machine.canonicalObjectId);
  const before = listCanonicalMutations().length;
  const preview = previewDecisionImpact({ workspaceId: company.workspaceId, deckId: "production", decisionId });
  assert.equal(listCanonicalMutations().length, before);
  assert.equal(getCanonicalObject(company.workspaceId, machine.canonicalObjectId)?.attributes.capacityPerHour, 120);
  assert.equal(preview.status, "ready");
  if (preview.status !== "ready") return;
  assert.equal(preview.preview.evidenceSources.length, 3);
  assert.equal(preview.preview.evidenceSources.filter((item) => item.availability === "current").length, 2);
  assert.equal(preview.preview.evidenceSources.some((item) => item.availability === "missing"), true);
  assert.equal(preview.preview.evidenceSources.some((item) => item.conflicts.some((conflict) => conflict.sourceValue === "90" && conflict.canonicalValue === "120")), true);
  assert.equal(removeCsvRealDataImport({
    workspaceId: company.workspaceId,
    sourceContextId: "csv:production",
    activeSourceContextId: null,
    confirmedActiveRemoval: true,
  }).removed, true);
  assert.equal(associateCanonicalObjectSource({
    workspaceId: company.workspaceId,
    canonicalObjectId: machine.canonicalObjectId,
    datasetId: "csv:production",
    sourceKey: "CNC-A",
  }).ok, true);
  const deleted = previewDecisionImpact({ workspaceId: company.workspaceId, deckId: "production", decisionId });
  assert.equal(deleted.status, "ready");
  if (deleted.status !== "ready") return;
  assert.equal(deleted.preview.evidenceSources.some((item) => item.datasetId === "csv:production" && item.availability === "deleted"), true);
  assert.equal(getCanonicalObject(company.workspaceId, machine.canonicalObjectId)?.attributes.capacityPerHour, 120);
  } finally {
    deleteWorkspace(company.workspaceId);
    resetWorkspaceRegistryForTests();
    resetCsvRealDataImportStoreForTests();
  }
});

test("impact analysis stays inside the workspace and deck and fails closed", () => {
  setup();
  const machine = object("company-a", "production", "CNC Machine A");
  const hidden = object("company-a", "finance", "Finance Asset");
  const known = [machine.canonicalObjectId, hidden.canonicalObjectId];
  relate("company-a", machine.canonicalObjectId, hidden.canonicalObjectId, "DEPENDS_ON", known);
  const decisionId = decisionChain("company-a", "production", machine.canonicalObjectId);
  const foreign = previewDecisionImpact({ workspaceId: "company-b", deckId: "production", decisionId });
  const otherDeck = previewDecisionImpact({ workspaceId: "company-a", deckId: "finance", decisionId });
  const current = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  assert.equal(foreign.status, "blocked");
  assert.equal(otherDeck.status, "blocked");
  if (otherDeck.status === "blocked") assert.equal(otherDeck.reason, "wrong-deck");
  assert.equal(JSON.stringify(otherDeck).includes("Finance Asset"), false);
  assert.equal(JSON.stringify(otherDeck).includes("CNC Machine A"), false);
  assert.equal(current.status, "ready");
  if (current.status !== "ready") return;
  assert.equal(JSON.stringify(current.preview).includes("Finance Asset"), false);
  assert.equal(current.preview.missingReferences.some((item) => item.reason === "unauthorized" && item.objectId == null), true);
  const again = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId });
  assert.equal(again.status, "ready");
  if (again.status !== "ready") return;
  assert.equal(again.preview.fingerprint, current.preview.fingerprint);
  const store = memory();
  store.setItem(CANONICAL_DECISION_STORAGE_KEY, "{");
  resetDecisionDomainForTests(store);
  assert.equal(canonicalDecisionAuthorityStatus(), "corrupt");
  assert.equal(previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId }).status, "blocked");
  const versioned = memory();
  versioned.setItem(CANONICAL_RELATIONSHIP_STORAGE_KEY, JSON.stringify({
    identity: canonicalRelationshipGraphIdentity,
    schemaVersion: 2,
    workspaces: {},
  }));
  resetCanonicalRelationshipsForTests(versioned);
  resetDecisionDomainForTests(memory());
  assert.equal(previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId: "missing" }).status, "blocked");
  const objects = memory();
  objects.setItem(CANONICAL_OBJECT_STORAGE_KEY, JSON.stringify({
    identity: canonicalObjectRegistryIdentity,
    schemaVersion: 2,
    workspaces: {},
  }));
  resetCanonicalObjectsForTests(objects);
  resetCanonicalRelationshipsForTests(memory());
  const unsupported = previewDecisionImpact({ workspaceId: "company-a", deckId: "production", decisionId: "missing" });
  assert.equal(unsupported.status, "blocked");
  if (unsupported.status === "blocked") assert.equal(unsupported.reason, "unsupported-version");
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-impact",
    name: "Impact",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "company-a",
    ownerDeckId: "production",
    canonicalReferences: [],
    layout: { presentationDepth: "minimum", leftRegion: "management", rightRegion: "contextual", detailWorkspace: "closed" },
    stageView: "decision-solar",
  });
  assert.equal(serializeSceneOrgSavedScenes([scene]).includes("impact:"), false);
  assert.equal(listCanonicalRelationships("company-a").length >= 0, true);
});
