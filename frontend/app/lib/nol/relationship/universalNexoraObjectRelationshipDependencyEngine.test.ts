/**
 * NOL-1:5 — Universal NexoraObject Relationship & Dependency Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createNexoraObjectContract } from "../contract/universalNexoraObjectContract.ts";
import {
  hydrateNexoraObjectRuntimeState,
  resetNexoraObjectRuntimeStoreForTests,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
import { resetNexoraObjectStateTransitionStoreForTests } from "../state/universalNexoraObjectStateTransitionEngine.ts";
import {
  applyNexoraGraphComposite,
  breakCycleProposal,
  captureObjectFingerprints,
  assertGraphDoesNotMutateRuntimeOrState,
  cloneNexoraObjectGraph,
  createNexoraGraphSnapshot,
  createNexoraObjectGraph,
  createRelationship,
  deserializeGraph,
  detectCycles,
  findAllPaths,
  findDependencies,
  findDependents,
  findDescendants,
  findDownstream,
  findLeafNodes,
  findNeighborhood,
  findRelationship,
  findRootNodes,
  findShortestPath,
  findUpstream,
  getRelationship,
  hasCycle,
  listNexoraGraphEvents,
  listRelationships,
  projectGraph,
  relationshipEngineIdentity,
  relationshipSchemaVersion,
  removeRelationship,
  resetNexoraObjectGraphStoreForTests,
  restoreNexoraGraphSnapshot,
  serializeGraph,
  simulateImpactPropagation,
  traverseBfs,
  traverseDfs,
  updateRelationship,
  type NexoraGraphDependencies,
} from "./universalNexoraObjectRelationshipDependencyEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function deps(): NexoraGraphDependencies {
  let n = 0;
  let e = 0;
  return {
    now: () =>
      `2026-08-04T15:${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n++ % 60).padStart(2, "0")}.000Z`,
    createEventId: () => `ge-${++e}`,
  };
}

function makeObject(id: string, caption = id) {
  const object = createNexoraObjectContract({
    id,
    type: "Decision",
    caption,
    createdAt: "2026-08-04T15:00:00.000Z",
  });
  object.setLifecycle("Active");
  hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: "2026-08-04T15:00:00.000Z",
  });
  return object;
}

describe("NOL-1:5 Universal NexoraObject Relationship & Dependency Engine", () => {
  beforeEach(() => {
    resetNexoraObjectGraphStoreForTests();
    resetNexoraObjectRuntimeStoreForTests();
    resetNexoraObjectStateTransitionStoreForTests();
  });

  it("1. Create node relationship", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g1", [a, b], deps());
    const result = createRelationship(
      "g1",
      {
        edgeId: "e1",
        type: "depends_on",
        fromId: "a",
        toId: "b",
      },
      deps(),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.edge?.fromId, "a");
    assert.equal(getRelationship("g1", "e1")?.type, "depends_on");
  });

  it("2. Remove relationship", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g2", [a, b], deps());
    createRelationship(
      "g2",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    const result = removeRelationship("g2", "e1", deps());
    assert.equal(result.accepted, true);
    assert.equal(getRelationship("g2", "e1"), null);
  });

  it("3. Update relationship", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g3", [a, b], deps());
    createRelationship(
      "g3",
      { edgeId: "e1", type: "supports", fromId: "a", toId: "b", weight: 1 },
      deps(),
    );
    const result = updateRelationship(
      "g3",
      "e1",
      { weight: 5, label: "critical" },
      deps(),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.edge?.weight, 5);
    assert.equal(result.edge?.label, "critical");
    assert.equal(result.edge?.revision, 1);
  });

  it("4. Duplicate edge rejection", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g4", [a, b], deps());
    createRelationship(
      "g4",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    const dupId = createRelationship(
      "g4",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    assert.equal(dupId.accepted, false);
    assert.equal(dupId.errors[0]?.code, "GRAPH_DUPLICATE_EDGE_ID");
    const dupRel = createRelationship(
      "g4",
      { edgeId: "e2", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    assert.equal(dupRel.accepted, false);
    assert.equal(dupRel.errors[0]?.code, "GRAPH_DUPLICATE_RELATIONSHIP");
  });

  it("5. Invalid node rejection", () => {
    const a = makeObject("a");
    createNexoraObjectGraph("g5", [a], deps());
    const result = createRelationship(
      "g5",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "missing" },
      deps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.errors[0]?.code, "GRAPH_OBJECT_NOT_FOUND");
  });

  it("6. Parent/child traversal", () => {
    const parent = makeObject("parent");
    const child = makeObject("child");
    const grand = makeObject("grand");
    createNexoraObjectGraph("g6", [parent, child, grand], deps());
    createRelationship(
      "g6",
      { edgeId: "e1", type: "parent_of", fromId: "parent", toId: "child" },
      deps(),
    );
    createRelationship(
      "g6",
      { edgeId: "e2", type: "parent_of", fromId: "child", toId: "grand" },
      deps(),
    );
    assert.deepEqual(findDescendants("g6", "parent"), ["child", "grand"]);
    assert.ok(findUpstream("g6", "grand").includes("child"));
  });

  it("7. Upstream traversal", () => {
    const goal = makeObject("goal");
    const kpi = makeObject("kpi");
    const factory = makeObject("factory");
    createNexoraObjectGraph("g7", [goal, kpi, factory], deps());
    createRelationship(
      "g7",
      { edgeId: "e1", type: "depends_on", fromId: "goal", toId: "kpi" },
      deps(),
    );
    createRelationship(
      "g7",
      { edgeId: "e2", type: "depends_on", fromId: "kpi", toId: "factory" },
      deps(),
    );
    const upstream = findUpstream("g7", "factory");
    assert.ok(upstream.includes("kpi"));
    assert.ok(upstream.includes("goal"));
  });

  it("8. Downstream traversal", () => {
    const factory = makeObject("factory");
    const inventory = makeObject("inventory");
    const customer = makeObject("customer");
    createNexoraObjectGraph("g8", [factory, inventory, customer], deps());
    createRelationship(
      "g8",
      { edgeId: "e1", type: "affects", fromId: "factory", toId: "inventory" },
      deps(),
    );
    createRelationship(
      "g8",
      { edgeId: "e2", type: "affects", fromId: "inventory", toId: "customer" },
      deps(),
    );
    assert.deepEqual(findDownstream("g8", "factory"), ["inventory", "customer"]);
  });

  it("9. BFS traversal", () => {
    const r = makeObject("r");
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g9", [r, a, b, c], deps());
    createRelationship(
      "g9",
      { edgeId: "e1", type: "contains", fromId: "r", toId: "a" },
      deps(),
    );
    createRelationship(
      "g9",
      { edgeId: "e2", type: "contains", fromId: "r", toId: "b" },
      deps(),
    );
    createRelationship(
      "g9",
      { edgeId: "e3", type: "contains", fromId: "a", toId: "c" },
      deps(),
    );
    const order = traverseBfs("g9", "r");
    assert.equal(order[0], "r");
    assert.ok(order.indexOf("a") < order.indexOf("c"));
  });

  it("10. DFS traversal", () => {
    const r = makeObject("r");
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g10", [r, a, b], deps());
    createRelationship(
      "g10",
      { edgeId: "e-a", type: "contains", fromId: "r", toId: "a" },
      deps(),
    );
    createRelationship(
      "g10",
      { edgeId: "e-b", type: "contains", fromId: "r", toId: "b" },
      deps(),
    );
    const order = traverseDfs("g10", "r");
    assert.equal(order[0], "r");
    assert.equal(order.length, 3);
  });

  it("11. Shortest path", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    const d = makeObject("d");
    createNexoraObjectGraph("g11", [a, b, c, d], deps());
    createRelationship(
      "g11",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g11",
      { edgeId: "e2", type: "affects", fromId: "b", toId: "d" },
      deps(),
    );
    createRelationship(
      "g11",
      { edgeId: "e3", type: "affects", fromId: "a", toId: "c" },
      deps(),
    );
    createRelationship(
      "g11",
      { edgeId: "e4", type: "affects", fromId: "c", toId: "d" },
      deps(),
    );
    const path = findShortestPath("g11", "a", "d");
    assert.ok(path);
    assert.equal(path!.length, 2);
    assert.deepEqual(path!.nodes[0], "a");
    assert.deepEqual(path!.nodes[path!.nodes.length - 1], "d");
  });

  it("12. Multiple path discovery", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    const d = makeObject("d");
    createNexoraObjectGraph("g12", [a, b, c, d], deps());
    createRelationship(
      "g12",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g12",
      { edgeId: "e2", type: "affects", fromId: "b", toId: "d" },
      deps(),
    );
    createRelationship(
      "g12",
      { edgeId: "e3", type: "affects", fromId: "a", toId: "c" },
      deps(),
    );
    createRelationship(
      "g12",
      { edgeId: "e4", type: "affects", fromId: "c", toId: "d" },
      deps(),
    );
    const paths = findAllPaths("g12", "a", "d");
    assert.equal(paths.length, 2);
  });

  it("13. Root node detection", () => {
    const root = makeObject("root");
    const child = makeObject("child");
    createNexoraObjectGraph("g13", [root, child], deps());
    createRelationship(
      "g13",
      { edgeId: "e1", type: "contains", fromId: "root", toId: "child" },
      deps(),
    );
    assert.deepEqual(findRootNodes("g13"), ["root"]);
  });

  it("14. Leaf node detection", () => {
    const root = makeObject("root");
    const child = makeObject("child");
    createNexoraObjectGraph("g14", [root, child], deps());
    createRelationship(
      "g14",
      { edgeId: "e1", type: "contains", fromId: "root", toId: "child" },
      deps(),
    );
    assert.deepEqual(findLeafNodes("g14"), ["child"]);
  });

  it("15. Cycle detection", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g15", [a, b, c], deps());
    createRelationship(
      "g15",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g15",
      { edgeId: "e2", type: "depends_on", fromId: "b", toId: "c" },
      deps(),
    );
    createRelationship(
      "g15",
      { edgeId: "e3", type: "depends_on", fromId: "c", toId: "a" },
      deps(),
    );
    assert.equal(hasCycle("g15"), true);
    const cycles = detectCycles("g15", undefined, deps());
    assert.ok(cycles.length >= 1);
    const proposal = breakCycleProposal("g15");
    assert.ok(proposal.length >= 1);
    assert.ok(proposal[0]?.removeEdgeId);
  });

  it("16. Self-reference policy", () => {
    const a = makeObject("a");
    createNexoraObjectGraph("g16", [a], deps());
    const denied = createRelationship(
      "g16",
      { edgeId: "e1", type: "relates_to", fromId: "a", toId: "a" },
      deps(),
    );
    assert.equal(denied.accepted, false);
    assert.equal(denied.errors[0]?.code, "GRAPH_SELF_REFERENCE_FORBIDDEN");
    const allowed = createRelationship(
      "g16",
      {
        edgeId: "e2",
        type: "relates_to",
        fromId: "a",
        toId: "a",
        allowSelfReference: true,
      },
      deps(),
    );
    assert.equal(allowed.accepted, true);
  });

  it("17. Relationship filtering", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g17", [a, b, c], deps());
    createRelationship(
      "g17",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g17",
      { edgeId: "e2", type: "affects", fromId: "a", toId: "c" },
      deps(),
    );
    const filtered = listRelationships("g17", {
      relationshipTypes: ["depends_on"],
    });
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]?.type, "depends_on");
    assert.deepEqual(findDependencies("g17", "a"), ["b"]);
  });

  it("18. Neighborhood search", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g18", [a, b, c], deps());
    createRelationship(
      "g18",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g18",
      { edgeId: "e2", type: "affects", fromId: "b", toId: "c" },
      deps(),
    );
    const near = findNeighborhood("g18", "a", 1);
    assert.ok(near.includes("b"));
    assert.equal(near.includes("c"), false);
    const far = findNeighborhood("g18", "a", 2);
    assert.ok(far.includes("c"));
  });

  it("19. Impact propagation simulation", () => {
    const factory = makeObject("factory");
    const warehouse = makeObject("warehouse");
    const shipping = makeObject("shipping");
    const customer = makeObject("customer");
    factory.setStatus("Red");
    createNexoraObjectGraph(
      "g19",
      [factory, warehouse, shipping, customer],
      deps(),
    );
    createRelationship(
      "g19",
      { edgeId: "e1", type: "affects", fromId: "factory", toId: "warehouse" },
      deps(),
    );
    createRelationship(
      "g19",
      { edgeId: "e2", type: "affects", fromId: "warehouse", toId: "shipping" },
      deps(),
    );
    createRelationship(
      "g19",
      { edgeId: "e3", type: "affects", fromId: "shipping", toId: "customer" },
      deps(),
    );
    const impact = simulateImpactPropagation("g19", {
      objectId: "factory",
      status: "Red",
    });
    assert.equal(impact.path[0]?.objectId, "factory");
    assert.ok(impact.reachedObjectIds.includes("customer"));
    assert.equal(warehouse.status, "White");
    assert.equal(customer.status, "White");
  });

  it("20. Projection immutability", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g20", [a, b], deps());
    createRelationship(
      "g20",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    const projection = projectGraph("g20");
    assert.equal(projection.engineIdentity, relationshipEngineIdentity);
    assert.throws(() => {
      (projection.nodes as unknown as NexoraGraphNodeRefMutable).push({
        objectId: "x",
        objectType: "Decision",
        caption: "x",
        status: "White",
        lifecycle: "Active",
      });
    });
  });

  it("21. Serialization/deserialization", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g21", [a, b], deps());
    createRelationship(
      "g21",
      { edgeId: "e1", type: "measures", fromId: "a", toId: "b" },
      deps(),
    );
    const json = serializeGraph("g21");
    resetNexoraObjectGraphStoreForTests();
    const restored = deserializeGraph(json, [a, b], deps());
    assert.equal(restored.graphId, "g21");
    assert.equal(getRelationship("g21", "e1")?.type, "measures");
  });

  it("22. Version compatibility", () => {
    const a = makeObject("a");
    createNexoraObjectGraph("g22", [a], deps());
    assert.throws(() =>
      deserializeGraph(
        JSON.stringify({
          engineIdentity: relationshipEngineIdentity,
          schemaVersion: "9.9.9",
          graphId: "g22",
          graphRevision: 0,
          nodes: [],
          edges: [],
        }),
        [a],
        deps(),
      ),
    );
  });

  it("23. Graph snapshot restore", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g23", [a, b], deps());
    createRelationship(
      "g23",
      { edgeId: "e1", type: "owns", fromId: "a", toId: "b" },
      deps(),
    );
    const snapshot = createNexoraGraphSnapshot("g23", "snap-1", deps());
    removeRelationship("g23", "e1", deps());
    assert.equal(getRelationship("g23", "e1"), null);
    restoreNexoraGraphSnapshot(snapshot, [a, b], deps());
    assert.equal(getRelationship("g23", "e1")?.type, "owns");
  });

  it("24. Atomic composite operations", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g24", [a, b, c], deps());
    const result = applyNexoraGraphComposite(
      "g24",
      [
        {
          op: "create",
          input: {
            edgeId: "e1",
            type: "affects",
            fromId: "a",
            toId: "b",
          },
        },
        {
          op: "create",
          input: {
            edgeId: "e1",
            type: "affects",
            fromId: "b",
            toId: "c",
          },
        },
      ],
      deps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(getRelationship("g24", "e1"), null);
    assert.equal(listRelationships("g24").length, 0);
  });

  it("25. No Runtime mutation", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g25", [a, b], deps());
    const before = captureObjectFingerprints([a, b]);
    createRelationship(
      "g25",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    assertGraphDoesNotMutateRuntimeOrState([a, b], before);
  });

  it("26. No State mutation", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g26", [a, b], deps());
    const before = captureObjectFingerprints([a, b]);
    createRelationship(
      "g26",
      { edgeId: "e1", type: "affects", fromId: "a", toId: "b" },
      deps(),
    );
    updateRelationship("g26", "e1", { weight: 9 }, deps());
    assertGraphDoesNotMutateRuntimeOrState([a, b], before);
  });

  it("27. No Identity mutation", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const identity = {
      id: a.identity.id,
      type: a.identity.type,
      createdAt: a.identity.createdAt,
    };
    createNexoraObjectGraph("g27", [a, b], deps());
    createRelationship(
      "g27",
      { edgeId: "e1", type: "references", fromId: "a", toId: "b" },
      deps(),
    );
    assert.deepEqual(
      {
        id: a.identity.id,
        type: a.identity.type,
        createdAt: a.identity.createdAt,
      },
      identity,
    );
  });

  it("28. Dependency validation", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    const c = makeObject("c");
    createNexoraObjectGraph("g28", [a, b, c], deps());
    createRelationship(
      "g28",
      { edgeId: "e1", type: "depends_on", fromId: "a", toId: "b" },
      deps(),
    );
    createRelationship(
      "g28",
      { edgeId: "e2", type: "depends_on", fromId: "b", toId: "c" },
      deps(),
    );
    assert.deepEqual(findDependencies("g28", "a"), ["b", "c"]);
    assert.deepEqual(findDependents("g28", "c"), ["b", "a"]);
    assert.ok(
      findRelationship("g28", (edge) => edge.type === "depends_on" && edge.toId === "c"),
    );
  });

  it("29. Event generation", () => {
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g29", [a, b], deps());
    createRelationship(
      "g29",
      { edgeId: "e1", type: "causes", fromId: "a", toId: "b" },
      deps(),
    );
    updateRelationship("g29", "e1", { label: "risk" }, deps());
    removeRelationship("g29", "e1", deps());
    const events = listNexoraGraphEvents("g29");
    const types = events.map((e) => e.type);
    assert.ok(types.includes("RelationshipCreated"));
    assert.ok(types.includes("RelationshipUpdated"));
    assert.ok(types.includes("RelationshipDeleted"));
    assert.ok(types.includes("GraphChanged"));
    assert.ok(types.includes("DependencyChanged"));
  });

  it("30. Framework independence", () => {
    const source = readFileSync(
      join(
        __dirname,
        "universalNexoraObjectRelationshipDependencyEngine.ts",
      ),
      "utf8",
    );
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    for (const spec of imports) {
      assert.ok(
        spec.includes("/foundation/") ||
          spec.includes("/contract/") ||
          spec.includes("/runtime/") ||
          spec.includes("/state/"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("next/"), false);
    assert.equal(source.includes("three"), false);
    assert.equal(
      relationshipEngineIdentity,
      "NOL-1:5/UniversalNexoraObjectRelationshipDependencyEngine",
    );
    assert.equal(relationshipSchemaVersion, "1.0.0");

    // Clone API remains available without framework deps.
    const a = makeObject("a");
    const b = makeObject("b");
    createNexoraObjectGraph("g30", [a, b], deps());
    createRelationship(
      "g30",
      { edgeId: "e1", type: "relates_to", fromId: "a", toId: "b" },
      deps(),
    );
    const cloned = cloneNexoraObjectGraph("g30", "g30-clone", [a, b], deps());
    assert.equal(cloned.graphId, "g30-clone");
    assert.equal(projectGraph("g30-clone").edgeCount, 1);
  });
});

type NexoraGraphNodeRefMutable = {
  push(value: {
    objectId: string;
    objectType: string;
    caption: string;
    status: "White";
    lifecycle: "Active";
  }): number;
};
