/**
 * NOL-1:2 — Universal NexoraObject Contract Model tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NOL_FOUNDATION_IDENTITY } from "../foundation/universalNexoraObjectFoundation.ts";
import {
  NEXORA_OBJECT_CONTRACT_SECTIONS,
  NOL_CONTRACT_IDENTITY,
  NOL_CONTRACT_VERSION,
  UniversalNexoraObjectContract,
  canTransitionStatus,
  cloneNexoraObject,
  createNexoraObjectContract,
  freezeNexoraObject,
  fromJSON,
  getNexoraObjectContractSummary,
  isNexoraObject,
  projectAssistantView,
  projectDirectorView,
  projectRuntimeView,
  projectTimelineView,
  validateNexoraObjectContract,
} from "./universalNexoraObjectContract.ts";

describe("NOL-1:2 Universal NexoraObject Contract Model", () => {
  it("publishes exactly one canonical contract identity bound to NOL-1:1", () => {
    const summary = getNexoraObjectContractSummary();
    assert.equal(summary.identity, NOL_CONTRACT_IDENTITY);
    assert.equal(summary.identity, "NOL-1:2/UniversalNexoraObjectContractModel");
    assert.equal(summary.upstream, NOL_FOUNDATION_IDENTITY);
    assert.equal(summary.dependencyFreeExceptFoundation, true);
    assert.equal(summary.canonicalPublicInterface, true);
    assert.equal(UniversalNexoraObjectContract.contractVersion, NOL_CONTRACT_VERSION);
  });

  it("freezes the permanent contract section order", () => {
    assert.deepEqual([...NEXORA_OBJECT_CONTRACT_SECTIONS], [
      "Identity",
      "Classification",
      "Status",
      "Lifecycle",
      "Relationships",
      "Metadata",
      "Runtime",
      "Visualization",
      "Timeline",
      "Knowledge",
      "KPI",
      "Executive",
      "Events",
      "Serialization",
    ]);
    assert.equal(NEXORA_OBJECT_CONTRACT_SECTIONS.length, 14);
  });

  it("creates a contract with required sections and classification", () => {
    const object = createNexoraObjectContract({
      id: "obj-1",
      type: "Decision",
      caption: "Increase Capacity",
      owner: "coo",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    assert.ok(isNexoraObject(object));
    assert.equal(object.mode, "mutable");
    assert.equal(object.identity.id, "obj-1");
    assert.equal(object.identity.type, "Decision");
    assert.equal(object.classification.objectCategory, "Execution");
    assert.equal(object.classification.workspaceAffinity, "Decision");
    assert.equal(object.classification.systemObject, true);
    assert.equal(object.contractVersion, NOL_CONTRACT_VERSION);
    assert.equal(object.status, "White");
    assert.equal(object.lifecycle, "Created");
    assert.equal(object.events[0]?.eventType, "Created");
  });

  it("keeps identity immutable across approved Runtime mutations", () => {
    const object = createNexoraObjectContract({
      id: "obj-2",
      type: "Machine",
      caption: "Press A",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    const identity = object.identity;

    object.setRuntime({ selected: true, focused: true });
    object.setStatus("Yellow");
    object.setVisualization({ opacity: 0.8, priority: 4 });

    assert.equal(object.identity.id, identity.id);
    assert.equal(object.identity.type, identity.type);
    assert.equal(object.identity.createdAt, identity.createdAt);
    assert.equal(object.runtime.selected, true);
    assert.equal(object.status, "Yellow");
    assert.equal(object.visualization.colorState, "Yellow");
  });

  it("validates status transitions and rejects arbitrary status strings", () => {
    assert.equal(canTransitionStatus("Green", "Yellow"), true);
    assert.equal(canTransitionStatus("Black", "Red"), true);

    const object = createNexoraObjectContract({
      id: "obj-3",
      type: "Risk",
      caption: "Lead Time",
      status: "Black",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    assert.throws(() => object.setStatus("Purple" as never), /Invalid status/);
    object.setStatus("White");
    assert.equal(object.status, "White");
  });

  it("enforces lifecycle rules for Deleted and Archived objects", () => {
    const object = createNexoraObjectContract({
      id: "obj-4",
      type: "Action",
      caption: "Start Plan",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    assert.throws(
      () => object.appendTimelineRef("history", "h1"),
      /Created objects cannot accumulate/,
    );

    object.setLifecycle("Active");
    object.appendTimelineRef("history", "h1");
    assert.equal(object.timeline.history.includes("h1"), true);

    object.setLifecycle("Archived");
    assert.throws(
      () => object.setRuntime({ executing: true }),
      /cannot execute/,
    );

    object.setLifecycle("Deleted");
    assert.throws(() => object.setStatus("Green"), /read-only/i);
  });

  it("exposes relationships only through graph helpers", () => {
    const object = createNexoraObjectContract({
      id: "obj-5",
      type: "Supplier",
      caption: "Acme",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    object.addRelationship({
      id: "rel-1",
      kind: "related_to",
      toId: "factory-1",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    assert.equal(object.getRelationships().length, 1);
    assert.equal(
      object.hasRelationship((r) => r.toId === "factory-1"),
      true,
    );
    assert.equal(
      object.findRelationship((r) => r.id === "rel-1")?.toId,
      "factory-1",
    );

    object.removeRelationship("rel-1");
    assert.equal(object.getRelationships().length, 0);
    // Consumers never receive a mutable relationships array field on the contract.
    assert.equal("relationships" in object, false);
  });

  it("separates readonly and mutable modes", () => {
    const mutable = createNexoraObjectContract({
      id: "obj-6",
      type: "KPI",
      caption: "OTIF",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    const readonly = freezeNexoraObject(mutable);
    assert.equal(readonly.mode, "readonly");
    assert.throws(
      () => (readonly as unknown as typeof mutable).setStatus("Green"),
      /Readonly/,
    );
  });

  it("supports versioned serialization round-trip and clone", () => {
    const object = createNexoraObjectContract({
      id: "obj-7",
      type: "Scenario",
      caption: "Shortage",
      status: "Blue",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    object.setLifecycle("Active");
    object.setMetadata({ tags: ["sim"], notes: ["board ready"] });

    const json = object.toJSON();
    const restored = fromJSON(json);
    assert.equal(restored.identity.id, "obj-7");
    assert.equal(restored.status, "Blue");
    assert.equal(restored.metadata.notes[0], "board ready");

    const snap = object.snapshot("snap-1");
    object.setStatus("Yellow");
    object.restore(snap);
    assert.equal(object.status, "Blue");

    const cloned = cloneNexoraObject(object, "obj-7-clone");
    assert.equal(cloned.identity.id, "obj-7-clone");
    assert.notEqual(cloned.identity.id, object.identity.id);
  });

  it("projects Director, Assistant, Timeline, and Runtime views", () => {
    const object = createNexoraObjectContract({
      id: "obj-8",
      type: "Opportunity",
      caption: "New Lane",
      status: "Green",
      createdAt: "2026-08-04T12:00:00.000Z",
    });

    const director = projectDirectorView(object);
    assert.equal(director.id, "obj-8");
    assert.ok(director.visualization);
    assert.equal("runtime" in director, false);
    assert.equal(director.contractVersion, NOL_CONTRACT_VERSION);

    const assistant = projectAssistantView(object);
    assert.ok(assistant.knowledge);
    assert.equal("visualization" in assistant, false);

    const timeline = projectTimelineView(object);
    assert.ok(timeline.timeline);
    assert.ok(Array.isArray(timeline.events));

    const runtime = projectRuntimeView(object);
    assert.equal(runtime.classification.objectCategory, "Intelligence");
    assert.ok(runtime.runtime);
  });

  it("returns structured validation errors for invalid contracts", () => {
    const result = validateNexoraObjectContract({
      contractVersion: "0.0.0",
      identity: { id: "", type: "Nope", caption: "" },
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.some((e) => e.code === "CONTRACT_VERSION_MISMATCH"));
    assert.ok(result.errors.some((e) => e.code === "INVALID_IDENTITY"));
    assert.ok(result.errors.some((e) => e.code === "INVALID_TYPE"));
  });

  it("rejects reserved metadata keys", () => {
    const object = createNexoraObjectContract({
      id: "obj-9",
      type: "Custom",
      caption: "Ext",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    assert.throws(
      () => object.setMetadata({ customFields: { id: "hijack" } }),
      /reserved/i,
    );
    assert.equal(object.classification.customObject, true);
  });
});
