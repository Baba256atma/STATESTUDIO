/**
 * NOL-1:1 — Universal NexoraObject Foundation tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NEXORA_OBJECT_LIFECYCLES,
  NEXORA_OBJECT_STATUSES,
  NEXORA_OBJECT_STATUS_MEANING,
  NEXORA_OBJECT_TYPES,
  NOL_FOUNDATION_IDENTITY,
  UniversalNexoraObjectFoundation,
  addNexoraObjectRelationship,
  assertSameImmutableIdentity,
  cloneNexoraObject,
  createNexoraObject,
  createNexoraObjectSnapshot,
  deserializeNexoraObjectFromJson,
  exportNexoraObject,
  extendNexoraObject,
  getImmutableIdentity,
  getNexoraObjectFoundationSummary,
  getNexoraObjectStatusMeaning,
  importNexoraObject,
  isNexoraObjectStatus,
  isNexoraObjectType,
  projectNexoraObjectForAssistant,
  projectNexoraObjectForDirector,
  serializeNexoraObjectToJson,
  updateNexoraObjectLifecycle,
  updateNexoraObjectRuntime,
  updateNexoraObjectStatus,
  updateNexoraObjectVisualization,
  type NexoraObject,
} from "./universalNexoraObjectFoundation.ts";

function sample(overrides: Partial<Parameters<typeof createNexoraObject>[0]> = {}) {
  return createNexoraObject({
    id: "obj-factory-1",
    type: "Machine",
    caption: "Line A Press",
    description: "Primary stamping press",
    owner: "operations",
    createdAt: "2026-08-04T00:00:00.000Z",
    updatedAt: "2026-08-04T00:00:00.000Z",
    tags: ["manufacturing"],
    ...overrides,
  });
}

describe("NOL-1:1 Universal NexoraObject Foundation", () => {
  it("exposes exactly one universal foundation identity", () => {
    const summary = getNexoraObjectFoundationSummary();
    assert.equal(summary.identity, NOL_FOUNDATION_IDENTITY);
    assert.equal(summary.identity, "NOL-1:1/UniversalNexoraObjectFoundation");
    assert.equal(summary.dependencyFree, true);
    assert.equal(summary.universalContract, true);
    assert.equal(UniversalNexoraObjectFoundation.identity, summary.identity);
  });

  it("registers the full initial type and status catalogs", () => {
    assert.equal(NEXORA_OBJECT_TYPES.length, 26);
    assert.ok(isNexoraObjectType("Goal"));
    assert.ok(isNexoraObjectType("Decision"));
    assert.ok(isNexoraObjectType("Custom"));
    assert.equal(isNexoraObjectType("Unknown"), false);

    assert.equal(NEXORA_OBJECT_STATUSES.length, 6);
    assert.deepEqual([...NEXORA_OBJECT_STATUSES], [
      "Green",
      "Yellow",
      "Red",
      "Blue",
      "White",
      "Black",
    ]);
    assert.equal(getNexoraObjectStatusMeaning("Red"), "Critical");
    assert.equal(NEXORA_OBJECT_STATUS_MEANING.Green, "Healthy");
    assert.equal(NEXORA_OBJECT_LIFECYCLES.length, 5);
  });

  it("creates a frozen object with separated identity, runtime, and visualization", () => {
    const object = sample({ status: "Yellow" });
    assert.ok(Object.isFrozen(object));
    assert.ok(Object.isFrozen(object.identity));
    assert.ok(Object.isFrozen(object.runtime));
    assert.ok(Object.isFrozen(object.visualization));

    assert.equal(object.identity.id, "obj-factory-1");
    assert.equal(object.identity.type, "Machine");
    assert.equal(object.identity.version, 1);
    assert.equal(object.status, "Yellow");
    assert.equal(object.lifecycle, "Created");
    assert.equal(object.runtime.selected, false);
    assert.equal(object.visualization.colorState, "Yellow");
    assert.equal(object.eventLog[0]?.type, "Created");
  });

  it("keeps identity immutable across runtime and visualization updates", () => {
    const object = sample();
    const identityRef = getImmutableIdentity(object);

    const runtimeUpdated = updateNexoraObjectRuntime(object, {
      selected: true,
      focused: true,
    });
    assert.equal(runtimeUpdated.identity, identityRef);
    assert.equal(runtimeUpdated.runtime.selected, true);
    assert.equal(runtimeUpdated.runtime.focused, true);
    assert.equal(object.runtime.selected, false);

    const vizUpdated = updateNexoraObjectVisualization(runtimeUpdated, {
      opacity: 0.5,
      priority: 9,
      position: [1, 2, 3],
    });
    assert.equal(vizUpdated.identity, identityRef);
    assert.deepEqual(vizUpdated.visualization.position, [1, 2, 3]);
    assert.equal(vizUpdated.visualization.opacity, 0.5);

    assertSameImmutableIdentity(object, vizUpdated);
  });

  it("updates executive status and lifecycle without rewriting identity", () => {
    const object = sample({ status: "White" });
    const next = updateNexoraObjectStatus(object, "Red");
    assert.equal(next.identity, object.identity);
    assert.equal(next.status, "Red");
    assert.equal(next.visualization.colorState, "Red");
    assert.ok(next.eventLog.some((e) => e.type === "StatusChanged"));

    const paused = updateNexoraObjectLifecycle(next, "Paused");
    assert.equal(paused.identity, object.identity);
    assert.equal(paused.lifecycle, "Paused");
    assert.equal(isNexoraObjectStatus("Purple"), false);
  });

  it("supports unlimited relationship graph edges", () => {
    let object = sample();
    const targets = ["supplier-1", "inventory-1", "risk-1", "kpi-1", "pack-1"];
    for (const [index, toId] of targets.entries()) {
      object = addNexoraObjectRelationship(object, {
        id: `rel-${index}`,
        kind: index % 2 === 0 ? "depends_on" : "affects",
        toId,
        createdAt: "2026-08-04T00:00:00.000Z",
      });
    }
    assert.equal(object.relationships.length, 5);
    assert.ok(object.eventLog.some((e) => e.type === "RelationshipChanged"));
    const root = sample();
    const linked = addNexoraObjectRelationship(root, {
      id: "rel-root",
      kind: "contains",
      toId: "child-1",
      createdAt: "2026-08-04T00:00:00.000Z",
    });
    assert.equal(linked.identity, root.identity);
  });

  it("extends business objects without replacing the universal contract", () => {
    const inventory = extendNexoraObject(
      {
        id: "inv-100",
        type: "Asset",
        caption: "Safety Stock",
        createdAt: "2026-08-04T00:00:00.000Z",
      },
      { sku: "SS-100", onHand: 42 },
    );
    assert.equal(inventory.identity.type, "Asset");
    assert.equal(inventory.extension.sku, "SS-100");
    assert.equal(inventory.extension.onHand, 42);
    // Still a NexoraObject — same facets exist.
    assert.ok(inventory.kpi);
    assert.ok(inventory.knowledge);
    assert.ok(inventory.timeline);
  });

  it("serializes, snapshots, clones, exports, and imports", () => {
    const object = sample({ status: "Green" });
    const json = serializeNexoraObjectToJson(object);
    const restored = deserializeNexoraObjectFromJson(json);
    assert.equal(restored.identity.id, object.identity.id);
    assert.equal(restored.status, "Green");

    const snapshot = createNexoraObjectSnapshot(object, "snap-1");
    assert.equal(snapshot.objectId, object.identity.id);
    assert.equal(snapshot.object.identity.id, object.identity.id);

    const cloned = cloneNexoraObject(object, "obj-factory-2");
    assert.equal(cloned.identity.id, "obj-factory-2");
    assert.notEqual(cloned.identity.id, object.identity.id);
    assert.equal(cloned.identity.type, object.identity.type);

    const envelope = exportNexoraObject(object);
    assert.equal(envelope.foundation, NOL_FOUNDATION_IDENTITY);
    const imported = importNexoraObject(envelope);
    assert.equal(imported.identity.id, object.identity.id);
  });

  it("projects Director and Assistant surfaces without exposing mutators", () => {
    const object = updateNexoraObjectRuntime(sample({ status: "Blue" }), {
      highlighted: true,
    });

    const director = projectNexoraObjectForDirector(object);
    assert.equal(director.id, object.identity.id);
    assert.equal(director.visualization.colorState, "Blue");
    assert.equal("runtime" in director, false);
    assert.equal("identity" in director, false);

    const assistant = projectNexoraObjectForAssistant(object);
    assert.equal(assistant.id, object.identity.id);
    assert.ok(Array.isArray(assistant.knowledge.facts));
    assert.equal("visualization" in assistant, false);
    assert.equal("runtime" in assistant, false);
  });

  it("rejects empty identity fields and invalid catalogs", () => {
    assert.throws(() => sample({ id: "  " }), /identity.id/);
    assert.throws(() => sample({ caption: "" }), /identity.caption/);
    assert.throws(
      () =>
        createNexoraObject({
          id: "x",
          type: "NotAType" as NexoraObject["identity"]["type"],
          caption: "X",
        }),
      /Unsupported NexoraObject type/,
    );
  });

  it("keeps foundation dependency-free by owning its catalogs locally", () => {
    const summary = getNexoraObjectFoundationSummary();
    assert.equal(summary.objectTypeCount, NEXORA_OBJECT_TYPES.length);
    assert.equal(summary.statusCount, 6);
    assert.equal(summary.runtimeSeparatedFromIdentity, true);
    assert.equal(summary.visualizationIndependent, true);
    assert.equal(summary.identityImmutable, true);
  });
});
