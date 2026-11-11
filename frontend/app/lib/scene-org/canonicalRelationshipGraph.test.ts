import assert from "node:assert/strict";
import { test } from "node:test";
import { deriveNexoraDecisionTheatreDataObjectId } from "../decision-theatre/nexoraDecisionTheatreDataObjectProjection.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "../decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import {
  archiveCanonicalRelationship,
  archiveRelationshipsForRemovedObject,
  assessCanonicalTopologySupport,
  canonicalDataObjectId,
  canonicalRelationshipAuthorityStatus,
  CANONICAL_RELATIONSHIP_STORAGE_KEY,
  declareCanonicalRelationship,
  deleteCanonicalRelationship,
  editCanonicalRelationshipType,
  forgetWorkspaceCanonicalRelationships,
  listCanonicalRelationships,
  readCanonicalRelationshipGraph,
  resetCanonicalRelationshipsForTests,
  resolveDeckRelationshipGraph,
  restoreCanonicalRelationship,
} from "./canonicalRelationshipGraph.ts";
import { projectOrganizationalSolarLayout } from "./organizationalSolarView.ts";

function refusedReason(result: { readonly ok: true } | { readonly ok: false; readonly reason: string }): string {
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("expected refusal");
  return result.reason;
}

function memoryStorage(initial?: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial ?? {}));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

const workspaceId = "company-a";
const production = canonicalDataObjectId(workspaceId, "csv:company-a:production-csv");
const inventory = canonicalDataObjectId(workspaceId, "csv:company-a:inventory-csv");
const finance = canonicalDataObjectId(workspaceId, "csv:company-a:finance-csv");
const known = [production, inventory, finance];

test("canonical dataset identity matches the Stage object id", () => {
  assert.equal(production, deriveNexoraDecisionTheatreDataObjectId(workspaceId, "csv:company-a:production-csv"));
});

test("manager-declared relationships stay workspace-owned and reject invalid edges", () => {
  const storage = memoryStorage();
  resetCanonicalRelationshipsForTests(storage);
  const created = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
    now: "2026-11-09T00:00:00.000Z",
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  assert.equal(created.value.relationshipId, "cr:company-a:1");
  assert.equal(created.value.workspaceId, workspaceId);
  assert.equal(created.value.direction, "DIRECTED");
  assert.equal(created.value.provenance.origin, "MANAGER_DECLARED");
  assert.equal(created.value.status, "ACTIVE");
  assert.equal(declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  }).ok, false);
  assert.equal(refusedReason(declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: production,
    relationshipType: "MONITORS",
    knownObjectIds: known,
  })), "self-link");
  assert.equal(refusedReason(declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: canonicalDataObjectId("company-b", "csv:company-b:inventory-csv"),
    relationshipType: "DEPENDS_ON",
    knownObjectIds: [...known, canonicalDataObjectId("company-b", "csv:company-b:inventory-csv")],
  })), "cross-workspace");
  assert.equal(refusedReason(declareCanonicalRelationship({
    workspaceId: "demo_workspace",
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  })), "protected-workspace");
  const reports = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: finance,
    relationshipType: "REPORTS_TO",
    knownObjectIds: known,
  });
  assert.equal(reports.ok, true);
  assert.equal(refusedReason(declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: finance,
    targetObjectId: production,
    relationshipType: "REPORTS_TO",
    knownObjectIds: known,
  })), "cycle");
  const dependencyLoop = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: inventory,
    targetObjectId: production,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(dependencyLoop.ok, true);
  const view = readCanonicalRelationshipGraph(workspaceId);
  assert.equal(view.causalClaims, false);
  assert.equal(view.simulation, false);
  assert.equal(assessCanonicalTopologySupport().tree, "STRUCTURAL_AND_HIERARCHY");
  assert.equal(assessCanonicalTopologySupport().bus, "UNSUPPORTED_SEMANTICS");
});

test("relationship lifecycle persists, and corrupt storage is not overwritten", () => {
  const storage = memoryStorage();
  resetCanonicalRelationshipsForTests(storage);
  const created = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const edited = editCanonicalRelationshipType({
    workspaceId,
    relationshipId: created.value.relationshipId,
    relationshipType: "MONITORS",
  });
  assert.equal(edited.ok && edited.value.relationshipType, "MONITORS");
  assert.equal(archiveCanonicalRelationship(workspaceId, created.value.relationshipId).ok, true);
  assert.equal(resolveDeckRelationshipGraph({
    workspaceId,
    deckId: "production",
    authorizedObjectIds: known,
  }).relationships.length, 0);
  assert.equal(restoreCanonicalRelationship(workspaceId, created.value.relationshipId).ok, true);
  assert.equal(deleteCanonicalRelationship(workspaceId, created.value.relationshipId).ok, true);
  assert.equal(listCanonicalRelationships(workspaceId).length, 0);
  resetCanonicalRelationshipsForTests(storage);
  assert.equal(canonicalRelationshipAuthorityStatus(), "empty");
  storage.setItem(CANONICAL_RELATIONSHIP_STORAGE_KEY, "{");
  resetCanonicalRelationshipsForTests(storage);
  const refused = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(refusedReason(refused), "corrupt");
  assert.equal(storage.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY), "{");
  const unsupported = memoryStorage({
    [CANONICAL_RELATIONSHIP_STORAGE_KEY]: JSON.stringify({
      identity: "NPA-T CANONICAL-RELATIONSHIP-GRAPH:1/WorkspaceCanonicalRelationshipGraph",
      schemaVersion: 99,
      workspaces: {},
    }),
  });
  resetCanonicalRelationshipsForTests(unsupported);
  const blocked = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(refusedReason(blocked), "unsupported-version");
  assert.match(unsupported.getItem(CANONICAL_RELATIONSHIP_STORAGE_KEY) ?? "", /"schemaVersion":99/);
  let writes = 0;
  const failing = memoryStorage();
  const original = failing.setItem.bind(failing);
  failing.setItem = (key, value) => {
    writes += 1;
    if (writes > 0) throw new Error("disk full");
    original(key, value);
  };
  resetCanonicalRelationshipsForTests(failing);
  const failed = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(refusedReason(failed), "storage-failed");
  assert.equal(listCanonicalRelationships(workspaceId).length, 0);
});

test("deck projection hides unauthorized endpoints and keeps one workspace relationship", () => {
  const storage = memoryStorage();
  resetCanonicalRelationshipsForTests(storage);
  const created = declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  const productionDeck = resolveDeckRelationshipGraph({
    workspaceId,
    deckId: "production",
    authorizedObjectIds: [production, inventory],
  });
  const executive = resolveDeckRelationshipGraph({
    workspaceId,
    deckId: "executive",
    authorizedObjectIds: [production, inventory],
  });
  const financeDeck = resolveDeckRelationshipGraph({
    workspaceId,
    deckId: "finance",
    authorizedObjectIds: [finance],
  });
  assert.equal(productionDeck.relationships[0]?.relationshipId, executive.relationships[0]?.relationshipId);
  assert.deepEqual(financeDeck.hiddenRelationshipIds, [created.value.relationshipId]);
  assert.equal(financeDeck.relationships.length, 0);
});

test("dataset removal archives affected edges and workspace deletion removes only that workspace", () => {
  const storage = memoryStorage();
  resetCanonicalRelationshipsForTests(storage);
  declareCanonicalRelationship({
    workspaceId,
    sourceObjectId: production,
    targetObjectId: inventory,
    relationshipType: "DEPENDS_ON",
    knownObjectIds: known,
  });
  declareCanonicalRelationship({
    workspaceId: "company-b",
    sourceObjectId: canonicalDataObjectId("company-b", "csv:company-b:production-csv"),
    targetObjectId: canonicalDataObjectId("company-b", "csv:company-b:inventory-csv"),
    relationshipType: "MONITORS",
    knownObjectIds: [
      canonicalDataObjectId("company-b", "csv:company-b:production-csv"),
      canonicalDataObjectId("company-b", "csv:company-b:inventory-csv"),
    ],
  });
  const archived = archiveRelationshipsForRemovedObject(workspaceId, inventory);
  assert.equal(archived.ok && archived.value, 1);
  assert.equal(listCanonicalRelationships(workspaceId)[0]?.status, "ARCHIVED");
  assert.equal(listCanonicalRelationships("company-b")[0]?.status, "ACTIVE");
  assert.equal(forgetWorkspaceCanonicalRelationships(workspaceId).ok, true);
  assert.equal(listCanonicalRelationships(workspaceId).length, 0);
  assert.equal(listCanonicalRelationships("company-b").length, 1);
});

test("solar keeps neutral rings for dependency edges and does not invent edges", () => {
  const neutral = projectOrganizationalSolarLayout({ objectIds: [production, inventory] });
  assert.equal(neutral.semanticLevel, "neutral-presentation");
  assert.equal(neutral.relationshipEdges.length, 0);
  const withDependency = projectOrganizationalSolarLayout({
    objectIds: [production, inventory],
    relationships: [{
      relationshipId: "cr:company-a:1",
      sourceObjectId: production,
      targetObjectId: inventory,
      relationshipType: "DEPENDS_ON",
      direction: "DIRECTED",
    }],
  });
  assert.equal(withDependency.semanticLevel, "neutral-presentation");
  assert.equal(withDependency.rings[0]?.semanticType, "presentation-ring");
  assert.equal(withDependency.relationshipEdges[0]?.relationshipId, "cr:company-a:1");
  const hierarchy = projectOrganizationalSolarLayout({
    objectIds: [production, finance],
    relationships: [{
      relationshipId: "cr:company-a:2",
      sourceObjectId: production,
      targetObjectId: finance,
      relationshipType: "REPORTS_TO",
      direction: "DIRECTED",
    }],
  });
  assert.equal(hierarchy.semanticLevel, "organizational-hierarchy");
  assert.equal(hierarchy.rings[0]?.semanticType, "organizational-level");
  const projected = projectNexoraDecisionTheatreDataObjectsToStage({
    dataObjects: [
      { id: production, label: "production.csv", sourceId: "production", unresolvedFieldCount: 0, relationships: [] },
      { id: inventory, label: "inventory.csv", sourceId: "inventory", unresolvedFieldCount: 0, relationships: [] },
    ] as never,
    visibleDataObjectIds: [production, inventory],
    selectedDataObjectId: production,
    businessFocusId: null,
    stageObjects: [],
    sceneIntentKind: "business" as never,
    labelSide: "top-right",
    graphEdges: withDependency.relationshipEdges,
  });
  assert.equal(projected.connections.length, 1);
  assert.equal(projected.connections[0]?.id, "cr:company-a:1");
  assert.equal(projected.connections[0]?.impliesCausality, false);
  assert.equal(projected.connections[0]?.relation, "DEPENDS_ON");
});
