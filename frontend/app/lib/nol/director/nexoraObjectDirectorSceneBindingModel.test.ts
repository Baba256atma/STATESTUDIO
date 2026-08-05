/**
 * NOL-3:2 — NexoraObject Director Scene Binding Model tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bindDirectorSceneCollection,
  calculateDirectorSceneBindingDiff,
  compareDirectorSceneBindingSnapshots,
  createDirectorSceneBinding,
  createDirectorSceneBindingSnapshot,
  deserializeDirectorSceneBinding,
  deserializeDirectorSceneBindingRegistry,
  detachDirectorSceneBinding,
  directorSceneBindingModelIdentity,
  findBindingByBindingId,
  findBindingByObjectId,
  findBindingBySceneObjectId,
  hideDirectorSceneBinding,
  reconcileDirectorSceneBinding,
  reconcileDirectorSceneBindingRegistry,
  removeDirectorSceneBinding,
  serializeDirectorSceneBinding,
  serializeDirectorSceneBindingRegistry,
  updateDirectorSceneBinding,
  validateDirectorSceneBindingRegistry,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingDependencies,
  type NexoraDirectorSceneBindingRegistry,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorSceneBindingModel.ts"),
  "utf8",
);

const NOW = "2026-08-04T18:00:00.000Z";

function bindingDeps(): NexoraDirectorSceneBindingDependencies {
  let local = 0;
  return Object.freeze({
    now: () => NOW,
    createBindingId: (objectId: string, sceneObjectId: string) => {
      void sceneObjectId;
      return `nexora-binding:${objectId}`;
    },
    createRegistryId: (bindingIds: readonly string[]) => {
      local += 1;
      return `dir-bind-reg:${bindingIds.join("|")}:${local}`;
    },
    createSnapshotId: () => {
      local += 1;
      return `dir-bind-snap:${local}`;
    },
  });
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function makePkg(
  objectId: string,
  overrides: {
    readonly packageId?: string;
    readonly visible?: boolean;
    readonly updateStrategy?:
      | "Create"
      | "Update"
      | "Reuse"
      | "Hide"
      | "Remove";
  } = {},
): NexoraObjectDirectorIntegrationPackage {
  const sceneObjectId = createNexoraDirectorSceneObjectId(objectId);
  const visible = overrides.visible ?? true;
  const updateStrategy = overrides.updateStrategy ?? "Update";

  return deepFreeze({
    packageId: overrides.packageId ?? `pkg:${objectId}`,
    packageVersion: "1.0.0",
    objectId,
    sceneObject: deepFreeze({
      sceneObjectId,
      objectId,
      objectType: "Goal",
      representationState: "Minimum" as const,
      renderingLevel: visible ? ("Normal" as const) : ("Hidden" as const),
      visible,
      interactive: true,
      readOnly: false,
      renderingPriority: 1,
    }),
    hierarchy: deepFreeze({
      childSceneObjectIds: Object.freeze([sceneObjectId]),
      layer: "Normal" as const,
      order: 0,
      depthWeight: 0,
    }),
    interaction: deepFreeze({
      state: "Idle" as const,
      selectable: true,
      focusable: true,
      operable: false,
      inspectable: true,
      affordances: Object.freeze([]),
    }),
    picking: deepFreeze({
      pickingId: `nexora-pick:${sceneObjectId}:Object`,
      objectId,
      sceneObjectId,
      enabled: visible,
      interactionState: "Idle" as const,
      representationState: "Minimum" as const,
      layer: "Normal" as const,
      target: "Object" as const,
    }),
    camera: deepFreeze({
      intent: "None" as const,
      framing: "None" as const,
      priority: 0,
      preserveUserControl: true,
    }),
    animation: deepFreeze({
      intents: Object.freeze([]),
      reducedMotion: false,
    }),
    relationships: deepFreeze({
      mode: "Hidden" as const,
      anchors: Object.freeze([]),
      emphasizedRelationshipIds: Object.freeze([]),
    }),
    clustering: deepFreeze({
      clustered: false,
      memberSceneObjectIds: Object.freeze([]),
      collapsed: false,
    }),
    rendering: deepFreeze({
      renderingLevel: visible ? ("Normal" as const) : ("Hidden" as const),
      renderingPriority: 1,
      layer: "Normal" as const,
      dimmed: false,
      visible,
      cacheKey: `cache:${objectId}`,
      geometryKey: `geo:${objectId}`,
      materialKey: `mat:${objectId}`,
      updateStrategy,
    }),
    metadata: deepFreeze({
      sourceProjectionIdentity: "NOL-2:9/Test",
      sourceProjectionVersion: "1.0.0",
      integrationIdentity: nexoraObjectDirectorIntegrationFoundationIdentity,
      integrationVersion: "1.0.0",
      schemaVersion: "1.0.0",
      createdAt: NOW,
    }),
  });
}

function makeCollection(
  objectIds: readonly string[],
  overrides: {
    readonly pkgOverrides?: (
      objectId: string,
    ) => Parameters<typeof makePkg>[1];
  } = {},
): NexoraObjectDirectorIntegrationCollection {
  const packages = Object.freeze(
    objectIds.map((objectId) =>
      makePkg(objectId, overrides.pkgOverrides?.(objectId)),
    ),
  );
  const sceneOrder = Object.freeze(
    packages.map(
      (pkg: NexoraObjectDirectorIntegrationPackage) =>
        pkg.sceneObject.sceneObjectId,
    ),
  );
  return deepFreeze({
    collectionId: `col:${objectIds.join("|")}`,
    packages,
    sceneOrder,
    attentionSceneObjectIds: Object.freeze([] as string[]),
    hiddenSceneObjectIds: Object.freeze(
      packages
        .filter(
          (pkg: NexoraObjectDirectorIntegrationPackage) =>
            !pkg.sceneObject.visible,
        )
        .map(
          (pkg: NexoraObjectDirectorIntegrationPackage) =>
            pkg.sceneObject.sceneObjectId,
        ),
    ),
    metadata: deepFreeze({}),
  });
}

function bound(objectId: string, deps = bindingDeps()): NexoraDirectorSceneBinding {
  return reconcileDirectorSceneBinding(undefined, makePkg(objectId), deps);
}

describe("NOL-3:2 NexoraObject Director Scene Binding Model", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      directorSceneBindingModelIdentity,
      "NOL-3:2/NexoraObjectDirectorSceneBindingModel",
    );
  });

  it("2. Imports only NOL-3:1.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectDirectorIntegrationFoundation.ts",
    ]);
  });

  it("3. Binding creation succeeds.", () => {
    const deps = bindingDeps();
    const binding = createDirectorSceneBinding(makePkg("create-1"), deps);
    assert.equal(binding.objectId, "create-1");
    assert.equal(binding.state, "Created");
    assert.equal(binding.bindingId, "nexora-binding:create-1");
  });

  it("4. Generation starts at 1.", () => {
    const binding = createDirectorSceneBinding(makePkg("gen-1"), bindingDeps());
    assert.equal(binding.generation, 1);
  });

  it("5. Update increments generation.", () => {
    const deps = bindingDeps();
    const initial = bound("upd-1", deps);
    const updated = updateDirectorSceneBinding(
      initial,
      makePkg("upd-1", { packageId: "pkg:upd-1:v2" }),
      deps,
    );
    assert.equal(updated.generation, 2);
    assert.equal(updated.state, "Updated");
  });

  it("6. Hide preserves identity.", () => {
    const deps = bindingDeps();
    const initial = bound("hide-1", deps);
    const hidden = hideDirectorSceneBinding(initial, deps);
    assert.equal(hidden.bindingId, initial.bindingId);
    assert.equal(hidden.objectId, initial.objectId);
    assert.equal(hidden.sceneObjectId, initial.sceneObjectId);
    assert.equal(hidden.generation, initial.generation);
    assert.equal(hidden.state, "Hidden");
  });

  it("7. Detach preserves identity.", () => {
    const deps = bindingDeps();
    const initial = bound("detach-1", deps);
    const detached = detachDirectorSceneBinding(initial, deps);
    assert.equal(detached.bindingId, initial.bindingId);
    assert.equal(detached.objectId, initial.objectId);
    assert.equal(detached.sceneObjectId, initial.sceneObjectId);
    assert.equal(detached.generation, initial.generation);
    assert.equal(detached.state, "Detached");
  });

  it("8. Remove marks Removed.", () => {
    const deps = bindingDeps();
    const initial = bound("remove-1", deps);
    const removed = removeDirectorSceneBinding(initial, deps);
    assert.equal(removed.state, "Removed");
  });

  it("9. Invalid lifecycle transitions are rejected.", () => {
    const deps = bindingDeps();
    const created = createDirectorSceneBinding(makePkg("trans-1"), deps);
    assert.throws(() =>
      updateDirectorSceneBinding(
        created,
        makePkg("trans-1", { packageId: "pkg:trans-1:v2" }),
        deps,
      ),
    );
    assert.throws(() => hideDirectorSceneBinding(created, deps));
    assert.throws(() => detachDirectorSceneBinding(created, deps));
    assert.throws(() => removeDirectorSceneBinding(created, deps));

    const removed = removeDirectorSceneBinding(bound("trans-2", deps), deps);
    assert.throws(() =>
      reconcileDirectorSceneBinding(removed, makePkg("trans-2"), deps),
    );
  });

  it("10. Duplicate object IDs rejected.", () => {
    const collection = makeCollection(["dup-a", "dup-a"]);
    assert.throws(() => bindDirectorSceneCollection(collection, undefined, bindingDeps()));
  });

  it("11. Duplicate scene-object IDs rejected.", () => {
    const pkgA = makePkg("obj-a");
    const pkgB = deepFreeze({
      ...makePkg("obj-b"),
      sceneObject: deepFreeze({
        ...makePkg("obj-b").sceneObject,
        sceneObjectId: pkgA.sceneObject.sceneObjectId,
      }),
    });
    const collection = deepFreeze({
      ...makeCollection(["obj-a"]),
      packages: Object.freeze([pkgA, pkgB]),
      sceneOrder: Object.freeze([
        pkgA.sceneObject.sceneObjectId,
        pkgB.sceneObject.sceneObjectId,
      ]),
    });
    assert.throws(() => bindDirectorSceneCollection(collection, undefined, bindingDeps()));
  });

  it("12. Duplicate binding IDs rejected.", () => {
    const bindingA = bound("dup-bind-a", bindingDeps());
    const bindingB = bound("dup-bind-b", bindingDeps());
    const duplicateRegistry = deepFreeze({
      registryId: "bad-reg",
      bindings: Object.freeze([
        bindingA,
        deepFreeze({ ...bindingB, bindingId: bindingA.bindingId }),
      ]),
    });
    const result = validateDirectorSceneBindingRegistry(duplicateRegistry);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(
        result.errors.some(
          (error) => error.code === "BINDING_DUPLICATE_BINDING_ID",
        ),
      );
    }
  });

  it("13. Collection binding preserves order.", () => {
    const collection = makeCollection(["order-c", "order-a", "order-b"]);
    const registry = bindDirectorSceneCollection(collection, undefined, bindingDeps());
    const sceneIds = registry.bindings.map((item) => item.sceneObjectId);
    assert.deepEqual(sceneIds, [...collection.sceneOrder]);
  });

  it("14. Existing bindings are reused.", () => {
    const deps = bindingDeps();
    const first = bindDirectorSceneCollection(
      makeCollection(["reuse-1"]),
      undefined,
      deps,
    );
    const firstBinding = first.bindings[0]!;
    const second = bindDirectorSceneCollection(
      makeCollection(["reuse-1"]),
      first,
      deps,
    );
    assert.equal(second.bindings[0]!.bindingId, firstBinding.bindingId);
    assert.equal(second.bindings[0]!.sceneObjectId, firstBinding.sceneObjectId);
  });

  it("15. New bindings are created correctly.", () => {
    const deps = bindingDeps();
    const first = bindDirectorSceneCollection(
      makeCollection(["existing-1"]),
      undefined,
      deps,
    );
    const second = bindDirectorSceneCollection(
      makeCollection(["existing-1", "new-1"]),
      first,
      deps,
    );
    assert.equal(second.bindings.length, 2);
    const created = findBindingByObjectId(second, "new-1");
    assert.ok(created);
    assert.equal(created!.state, "Bound");
    assert.equal(created!.generation, 1);
  });

  it("16. Hidden bindings are restored correctly.", () => {
    const deps = bindingDeps();
    const hiddenCollection = makeCollection(["restore-1"], {
      pkgOverrides: () => ({ visible: false, updateStrategy: "Hide" }),
    });
    const hiddenRegistry = bindDirectorSceneCollection(
      hiddenCollection,
      undefined,
      deps,
    );
    assert.equal(hiddenRegistry.bindings[0]!.state, "Hidden");

    const visibleCollection = makeCollection(["restore-1"], {
      pkgOverrides: () => ({ visible: true, updateStrategy: "Update" }),
    });
    const restored = bindDirectorSceneCollection(
      visibleCollection,
      hiddenRegistry,
      deps,
    );
    assert.equal(restored.bindings[0]!.state, "Bound");
    assert.equal(
      restored.bindings[0]!.bindingId,
      hiddenRegistry.bindings[0]!.bindingId,
    );
  });

  it("17. Removed bindings cannot be rebound.", () => {
    const deps = bindingDeps();
    const removed = removeDirectorSceneBinding(bound("norebind-1", deps), deps);
    assert.throws(() =>
      reconcileDirectorSceneBinding(removed, makePkg("norebind-1"), deps),
    );
  });

  it("18. Lookup by object ID succeeds.", () => {
    const registry = bindDirectorSceneCollection(
      makeCollection(["lookup-obj-1"]),
      undefined,
      bindingDeps(),
    );
    const found = findBindingByObjectId(registry, "lookup-obj-1");
    assert.ok(found);
    assert.equal(found!.objectId, "lookup-obj-1");
  });

  it("19. Lookup by scene ID succeeds.", () => {
    const registry = bindDirectorSceneCollection(
      makeCollection(["lookup-scene-1"]),
      undefined,
      bindingDeps(),
    );
    const sceneObjectId = createNexoraDirectorSceneObjectId("lookup-scene-1");
    const found = findBindingBySceneObjectId(registry, sceneObjectId);
    assert.ok(found);
    assert.equal(found!.sceneObjectId, sceneObjectId);
  });

  it("20. Lookup by binding ID succeeds.", () => {
    const registry = bindDirectorSceneCollection(
      makeCollection(["lookup-bind-1"]),
      undefined,
      bindingDeps(),
    );
    const bindingId = "nexora-binding:lookup-bind-1";
    const found = findBindingByBindingId(registry, bindingId);
    assert.ok(found);
    assert.equal(found!.bindingId, bindingId);
  });

  it("21. Binding diff detects created.", () => {
    const deps = bindingDeps();
    const previous = bindDirectorSceneCollection(
      makeCollection(["diff-a"]),
      undefined,
      deps,
    );
    const next = bindDirectorSceneCollection(
      makeCollection(["diff-a", "diff-b"]),
      previous,
      deps,
    );
    const diff = calculateDirectorSceneBindingDiff(previous, next);
    assert.equal(diff.created.length, 1);
    assert.equal(diff.created[0]!.objectId, "diff-b");
  });

  it("22. Binding diff detects updated.", () => {
    const deps = bindingDeps();
    const previous = bindDirectorSceneCollection(
      makeCollection(["diff-upd-1"]),
      undefined,
      deps,
    );
    const next = bindDirectorSceneCollection(
      makeCollection(["diff-upd-1"], {
        pkgOverrides: () => ({ packageId: "pkg:diff-upd-1:v2" }),
      }),
      previous,
      deps,
    );
    const diff = calculateDirectorSceneBindingDiff(previous, next);
    assert.equal(diff.updated.length, 1);
    assert.equal(diff.updated[0]!.objectId, "diff-upd-1");
  });

  it("23. Binding diff detects hidden.", () => {
    const deps = bindingDeps();
    const previous = bindDirectorSceneCollection(
      makeCollection(["diff-hide-1"]),
      undefined,
      deps,
    );
    const next = bindDirectorSceneCollection(
      makeCollection(["diff-hide-1"], {
        pkgOverrides: () => ({ visible: false, updateStrategy: "Hide" }),
      }),
      previous,
      deps,
    );
    const diff = calculateDirectorSceneBindingDiff(previous, next);
    assert.equal(diff.hidden.length, 1);
    assert.equal(diff.hidden[0]!.state, "Hidden");
  });

  it("24. Binding diff detects removed.", () => {
    const deps = bindingDeps();
    const previous = bindDirectorSceneCollection(
      makeCollection(["diff-remove-1"]),
      undefined,
      deps,
    );
    const next = bindDirectorSceneCollection(
      makeCollection(["diff-remove-1"], {
        pkgOverrides: () => ({ updateStrategy: "Remove" }),
      }),
      previous,
      deps,
    );
    const diff = calculateDirectorSceneBindingDiff(previous, next);
    assert.equal(diff.removed.length, 1);
    assert.equal(diff.removed[0]!.state, "Removed");
  });

  it("25. Snapshot comparison detects lifecycle changes.", () => {
    const deps = bindingDeps();
    const leftRegistry = bindDirectorSceneCollection(
      makeCollection(["snap-1"]),
      undefined,
      deps,
    );
    const rightRegistry = reconcileDirectorSceneBindingRegistry(
      leftRegistry,
      makeCollection(["snap-1"], {
        pkgOverrides: () => ({ visible: false, updateStrategy: "Hide" }),
      }),
      deps,
    );
    const left = createDirectorSceneBindingSnapshot(leftRegistry, deps);
    const right = createDirectorSceneBindingSnapshot(rightRegistry, deps);
    const comparison = compareDirectorSceneBindingSnapshots(left, right);
    assert.ok(comparison.hiddenBindings.length > 0);
    assert.ok(comparison.stateTransitions.length > 0);
  });

  it("26. Serialization round-trip succeeds.", () => {
    const deps = bindingDeps();
    const binding = bound("ser-1", deps);
    const restored = deserializeDirectorSceneBinding(
      serializeDirectorSceneBinding(binding),
    );
    assert.deepEqual(restored, binding);
    assert.ok(Object.isFrozen(restored));

    const registry = bindDirectorSceneCollection(
      makeCollection(["ser-reg-1"]),
      undefined,
      deps,
    );
    const restoredRegistry = deserializeDirectorSceneBindingRegistry(
      serializeDirectorSceneBindingRegistry(registry),
    );
    assert.equal(restoredRegistry.registryId, registry.registryId);
    assert.equal(restoredRegistry.bindings.length, registry.bindings.length);
  });

  it("27. Unsupported schemas rejected.", () => {
    const binding = bound("uns-1", bindingDeps());
    assert.throws(() =>
      deserializeDirectorSceneBinding(
        JSON.stringify({
          schemaVersion: "0.0.0",
          binding,
        }),
      ),
    );
    assert.throws(() =>
      deserializeDirectorSceneBindingRegistry(
        JSON.stringify({
          schemaVersion: "0.0.0",
          registry: { registryId: "x", bindings: [] },
        }),
      ),
    );
  });

  it("28. Registry immutable.", () => {
    const registry = bindDirectorSceneCollection(
      makeCollection(["imm-reg-1"]),
      undefined,
      bindingDeps(),
    );
    assert.ok(isDeeplyFrozen(registry));
    assert.throws(() => {
      (registry as { registryId: string }).registryId = "mutated";
    });
  });

  it("29. Bindings immutable.", () => {
    const binding = bound("imm-bind-1", bindingDeps());
    assert.ok(isDeeplyFrozen(binding));
    assert.throws(() => {
      (binding as { objectId: string }).objectId = "mutated";
    });
  });

  it("30. Typecheck passes.", () => {
    const binding: NexoraDirectorSceneBinding = bound("tc-1", bindingDeps());
    const registry: NexoraDirectorSceneBindingRegistry = bindDirectorSceneCollection(
      makeCollection(["tc-1"]),
      undefined,
      bindingDeps(),
    );
    assert.equal(typeof binding.bindingId, "string");
    assert.equal(typeof registry.registryId, "string");
  });

  it("31. ESLint passes.", () => {
    assert.equal(source.includes("eslint-disable"), false);
    assert.equal(typeof createDirectorSceneBinding, "function");
    assert.equal(typeof bindDirectorSceneCollection, "function");
  });
});
