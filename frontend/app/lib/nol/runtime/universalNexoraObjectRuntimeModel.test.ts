/**
 * NOL-1:3 — Universal NexoraObject Runtime Model tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it, beforeEach } from "node:test";
import { fileURLToPath } from "node:url";
import { createNexoraObjectContract } from "../contract/universalNexoraObjectContract.ts";
import {
  NOL_RUNTIME_IDENTITY,
  applyNexoraObjectRuntimeBatch,
  applyNexoraObjectRuntimeCommand,
  assertNexoraObjectRuntimeInvariants,
  createDefaultNexoraObjectRuntimeState,
  deserializeNexoraObjectRuntimeState,
  focusExclusiveNexoraObject,
  focusNexoraObject,
  getNexoraObjectRuntimeState,
  hideNexoraObject,
  hydrateNexoraObjectRuntimeState,
  lockNexoraObject,
  prepareNexoraObjectExecution,
  resetNexoraObjectRuntime,
  resetNexoraObjectRuntimeStoreForTests,
  runtimeIdentity,
  runtimeModelVersion,
  runtimeSchemaVersion,
  selectNexoraObject,
  serializeNexoraObjectRuntimeState,
  startNexoraObjectExecution,
  validateNexoraObjectRuntimeState,
  type NexoraObjectRuntimeDependencies,
  type NexoraObjectRuntimeState,
} from "./universalNexoraObjectRuntimeModel.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function deps(): NexoraObjectRuntimeDependencies {
  let n = 0;
  let e = 0;
  return {
    now: () => {
      n += 1;
      return `2026-08-04T12:00:0${n}.000Z`;
    },
    createEventId: () => {
      e += 1;
      return `evt-${e}`;
    },
  };
}

function makeObject(id: string) {
  const object = createNexoraObjectContract({
    id,
    type: "Decision",
    caption: `Object ${id}`,
    createdAt: "2026-08-04T12:00:00.000Z",
  });
  object.setLifecycle("Active");
  hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: "2026-08-04T12:00:00.000Z",
  });
  return object;
}

describe("NOL-1:3 Universal NexoraObject Runtime Model", () => {
  beforeEach(() => {
    resetNexoraObjectRuntimeStoreForTests();
  });

  it("1. default runtime state is valid and deterministic", () => {
    const a = createDefaultNexoraObjectRuntimeState("2026-08-04T12:00:00.000Z");
    const b = createDefaultNexoraObjectRuntimeState("2026-08-04T12:00:00.000Z");
    assert.deepEqual(a, b);
    assert.equal(a.interactionState, "Idle");
    assert.equal(a.executionState, "Idle");
    assert.equal(a.runtimeRevision, 0);
    assert.equal(a.visible, true);
    assert.equal(validateNexoraObjectRuntimeState(a, "Active").ok, true);
    assert.equal(runtimeIdentity, NOL_RUNTIME_IDENTITY);
    assert.equal(runtimeModelVersion, "1.0.0");
    assert.equal(runtimeSchemaVersion, "1.0.0");
  });

  it("2. selecting an object updates selection and revision", () => {
    const object = makeObject("rt-2");
    const d = deps();
    const result = selectNexoraObject(object, { source: "Runtime" }, d);
    assert.equal(result.accepted, true);
    assert.equal(result.changed, true);
    assert.equal(result.nextState.selected, true);
    assert.equal(result.nextState.runtimeRevision, 1);
    assert.equal(result.events[0]?.type, "RuntimeSelected");
    assert.equal(object.runtime.selected, true);
  });

  it("3. focusing automatically selects the object", () => {
    const object = makeObject("rt-3");
    const result = focusNexoraObject(object, { source: "Director" }, deps());
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.focused, true);
    assert.equal(result.nextState.selected, true);
    assert.equal(result.nextState.interactionState, "Focused");
  });

  it("4. hiding clears selection and focus", () => {
    const object = makeObject("rt-4");
    const d = deps();
    focusNexoraObject(object, { source: "Runtime" }, d);
    const result = hideNexoraObject(object, { source: "Workspace" }, d);
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.visible, false);
    assert.equal(result.nextState.selected, false);
    assert.equal(result.nextState.focused, false);
  });

  it("5. deleted objects reject interaction commands", () => {
    const object = makeObject("rt-5");
    object.setLifecycle("Deleted");
    const result = selectNexoraObject(object, { source: "Runtime" }, deps());
    assert.equal(result.accepted, false);
    assert.equal(result.errors[0]?.code, "RUNTIME_OBJECT_DELETED");
    assert.equal(result.nextState.selected, false);
  });

  it("6. archived objects reject execution commands", () => {
    const object = makeObject("rt-6");
    object.setLifecycle("Archived");
    const result = prepareNexoraObjectExecution(
      object,
      { source: "System", authorizedSystemMutation: true },
      deps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.errors[0]?.code, "RUNTIME_OBJECT_ARCHIVED");
  });

  it("7. locked objects reject unauthorized mutation", () => {
    const object = makeObject("rt-7");
    const d = deps();
    lockNexoraObject(object, { source: "Runtime" }, d);
    const result = selectNexoraObject(object, { source: "Workspace" }, d);
    assert.equal(result.accepted, false);
    assert.equal(result.errors[0]?.code, "RUNTIME_OBJECT_LOCKED");
  });

  it("8. authorized System mutation may bypass lock", () => {
    const object = makeObject("rt-8");
    const d = deps();
    lockNexoraObject(object, { source: "Runtime" }, d);
    const result = selectNexoraObject(
      object,
      { source: "System", authorizedSystemMutation: true },
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.selected, true);
  });

  it("9. execution transitions follow the state machine", () => {
    const object = makeObject("rt-9");
    const d = deps();
    const ctx = { source: "System" as const, authorizedSystemMutation: true };
    assert.equal(prepareNexoraObjectExecution(object, ctx, d).accepted, true);
    assert.equal(
      getNexoraObjectRuntimeState(object, d).executionState,
      "Preparing",
    );
    assert.equal(getNexoraObjectRuntimeState(object, d).executing, true);
    assert.equal(startNexoraObjectExecution(object, ctx, d).accepted, true);
    assert.equal(
      applyNexoraObjectRuntimeCommand(
        object,
        { type: "PauseExecution" },
        ctx,
        d,
      ).accepted,
      true,
    );
    assert.equal(
      applyNexoraObjectRuntimeCommand(
        object,
        { type: "ResumeExecution" },
        ctx,
        d,
      ).accepted,
      true,
    );
    assert.equal(
      applyNexoraObjectRuntimeCommand(
        object,
        { type: "CompleteExecution" },
        ctx,
        d,
      ).accepted,
      true,
    );
    assert.equal(getNexoraObjectRuntimeState(object, d).executing, false);
    assert.equal(
      getNexoraObjectRuntimeState(object, d).executionState,
      "Completed",
    );
  });

  it("10. invalid execution transitions return structured errors", () => {
    const object = makeObject("rt-10");
    const result = startNexoraObjectExecution(
      object,
      { source: "Runtime" },
      deps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.errors[0]?.code, "RUNTIME_INVALID_EXECUTION_TRANSITION");
    assert.equal(result.changed, false);
  });

  it("11. runtime reset preserves visibility and lock by default", () => {
    const object = makeObject("rt-11");
    const d = deps();
    selectNexoraObject(object, { source: "Runtime" }, d);
    lockNexoraObject(object, { source: "Runtime" }, d);
    hideNexoraObject(
      object,
      { source: "System", authorizedSystemMutation: true },
      d,
    );
    const result = resetNexoraObjectRuntime(
      object,
      undefined,
      { source: "System", authorizedSystemMutation: true },
      d,
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.selected, false);
    assert.equal(result.nextState.visible, false);
    assert.equal(result.nextState.locked, true);
  });

  it("12. runtime reset can clear visibility and lock through options", () => {
    const object = makeObject("rt-12");
    const d = deps();
    lockNexoraObject(object, { source: "Runtime" }, d);
    hideNexoraObject(
      object,
      { source: "System", authorizedSystemMutation: true },
      d,
    );
    const result = resetNexoraObjectRuntime(
      object,
      { preserveVisibility: false, preserveLock: false },
      { source: "System", authorizedSystemMutation: true },
      d,
    );
    assert.equal(result.nextState.visible, true);
    assert.equal(result.nextState.locked, false);
  });

  it("13. exclusive focus clears previous focused objects", () => {
    const a = makeObject("rt-13a");
    const b = makeObject("rt-13b");
    const d = deps();
    focusNexoraObject(a, { source: "Director" }, d);
    const results = focusExclusiveNexoraObject(
      { objects: [a, b] },
      "rt-13b",
      { source: "Director", correlationId: "corr-1" },
      d,
    );
    assert.equal(getNexoraObjectRuntimeState(a, d).focused, false);
    assert.equal(getNexoraObjectRuntimeState(b, d).focused, true);
    assert.equal(getNexoraObjectRuntimeState(b, d).selected, true);
    assert.ok(results.every((r) => r.events.every((e) => e.correlationId === "corr-1") || !r.changed || r.accepted));
    assert.ok(
      results.some((r) => r.events.some((e) => e.correlationId === "corr-1")),
    );
  });

  it("14. atomic batch rejects all mutations when one transition fails", () => {
    const a = makeObject("rt-14a");
    const b = makeObject("rt-14b");
    const d = deps();
    b.setLifecycle("Deleted");
    const batch = applyNexoraObjectRuntimeBatch(
      { objects: [a, b] },
      { objectIds: ["rt-14a", "rt-14b"], command: { type: "Select" } },
      "Atomic",
      { source: "Runtime" },
      d,
    );
    assert.equal(batch.accepted, false);
    assert.equal(getNexoraObjectRuntimeState(a, d).selected, false);
    assert.ok(batch.rejectedObjectIds.includes("rt-14b"));
    assert.deepEqual(batch.changedObjectIds, []);
  });

  it("15. best-effort batch applies valid transitions only", () => {
    const a = makeObject("rt-15a");
    const b = makeObject("rt-15b");
    const d = deps();
    b.setLifecycle("Deleted");
    const batch = applyNexoraObjectRuntimeBatch(
      { objects: [a, b] },
      { objectIds: ["rt-15a", "rt-15b"], command: { type: "Select" } },
      "BestEffort",
      { source: "Runtime" },
      d,
    );
    assert.equal(batch.accepted, false);
    assert.equal(getNexoraObjectRuntimeState(a, d).selected, true);
    assert.ok(batch.changedObjectIds.includes("rt-15a"));
    assert.ok(batch.rejectedObjectIds.includes("rt-15b"));
  });

  it("16. runtime serialization and hydration are reversible", () => {
    const object = makeObject("rt-16");
    const d = deps();
    selectNexoraObject(object, { source: "Runtime" }, d);
    const state = getNexoraObjectRuntimeState(object, d);
    const json = serializeNexoraObjectRuntimeState(state);
    const restored = deserializeNexoraObjectRuntimeState(json);
    assert.equal(restored.selected, state.selected);
    assert.equal(restored.runtimeRevision, state.runtimeRevision);
    assert.equal(restored.interactionState, state.interactionState);
    assert.match(json, /"runtimeSchemaVersion":"1.0.0"/);

    const object2 = makeObject("rt-16b");
    const hydrated = hydrateNexoraObjectRuntimeState(object2, {
      ...restored,
      runtimeSchemaVersion,
    });
    assert.equal(hydrated.selected, restored.selected);
    assert.equal(hydrated.runtimeRevision, restored.runtimeRevision);
  });

  it("17. runtime invariants detect inconsistent state", () => {
    const bad: NexoraObjectRuntimeState = {
      ...createDefaultNexoraObjectRuntimeState("2026-08-04T12:00:00.000Z"),
      focused: true,
      selected: false,
    };
    const validation = validateNexoraObjectRuntimeState(bad, "Active");
    assert.equal(validation.ok, false);
    assert.ok(validation.errors.some((e) => e.includes("focused implies selected")));
    assert.throws(() =>
      assertNexoraObjectRuntimeInvariants(bad, "Active", "bad"),
    );
  });

  it("18. runtime helpers never modify identity", () => {
    const object = makeObject("rt-18");
    const before = {
      id: object.identity.id,
      type: object.identity.type,
      createdAt: object.identity.createdAt,
    };
    focusNexoraObject(object, { source: "Runtime" }, deps());
    assert.deepEqual(
      {
        id: object.identity.id,
        type: object.identity.type,
        createdAt: object.identity.createdAt,
      },
      before,
    );
  });

  it("19. runtime helpers never modify metadata or relationships", () => {
    const object = makeObject("rt-19");
    object.setMetadata({ tags: ["keep"], notes: ["n1"] });
    object.addRelationship({
      id: "rel-1",
      kind: "related_to",
      toId: "other",
      createdAt: "2026-08-04T12:00:00.000Z",
    });
    const metaBefore = JSON.stringify(object.metadata);
    const relBefore = object.getRelationships().map((r) => r.id);
    selectNexoraObject(object, { source: "Runtime" }, deps());
    assert.equal(JSON.stringify(object.metadata), metaBefore);
    assert.deepEqual(
      object.getRelationships().map((r) => r.id),
      relBefore,
    );
  });

  it("20. the module imports only NOL-1:1 and NOL-1:2", () => {
    const source = readFileSync(
      join(__dirname, "universalNexoraObjectRuntimeModel.ts"),
      "utf8",
    );
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
      (m) => m[1]!,
    );
    assert.ok(imports.length >= 1);
    for (const spec of imports) {
      assert.ok(
        spec.includes("/foundation/universalNexoraObjectFoundation") ||
          spec.includes("/contract/universalNexoraObjectContract"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("from 'react'"), false);
    assert.equal(source.includes("next/"), false);
    assert.equal(source.includes("three"), false);
  });
});
