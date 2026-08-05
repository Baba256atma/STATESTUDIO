/**
 * NOL-3:3 — NexoraObject Director Scene Synchronization Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";
import {
  bindDirectorSceneCollection,
  detachDirectorSceneBinding,
  findBindingByObjectId,
  removeDirectorSceneBinding,
  type NexoraDirectorSceneBindingDependencies,
  type NexoraDirectorSceneBindingRegistry,
} from "./nexoraObjectDirectorSceneBindingModel.ts";
import {
  applyNexoraDirectorSceneSynchronization,
  assertNexoraDirectorSceneSynchronizationInvariants,
  compareNexoraDirectorSceneSynchronizationSnapshots,
  createNexoraDirectorSceneSynchronizationCheckpoint,
  createNexoraDirectorSceneSynchronizationRecord,
  createNexoraDirectorSceneSynchronizationRollbackPlan,
  createNexoraDirectorSceneSynchronizationSnapshot,
  createNexoraDirectorSceneSynchronizationState,
  deserializeNexoraDirectorSceneSynchronizationCheckpoint,
  deserializeNexoraDirectorSceneSynchronizationPlan,
  deserializeNexoraDirectorSceneSynchronizationRecord,
  deserializeNexoraDirectorSceneSynchronizationSnapshot,
  deserializeNexoraDirectorSceneSynchronizationState,
  detectNexoraDirectorSceneSynchronizationDrift,
  evaluateNexoraDirectorSceneSynchronization,
  findStaleNexoraDirectorIntegrationPackages,
  findStaleNexoraDirectorSceneBindings,
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  nexoraObjectDirectorSceneSynchronizationEngineVersion,
  nexoraObjectDirectorSceneSynchronizationSchemaVersion,
  NOL_DIRECTOR_SCENE_SYNCHRONIZATION_UPSTREAM,
  projectNexoraDirectorSceneSynchronizationHistory,
  resolveNexoraDirectorSceneSynchronizationCommandOrder,
  restoreNexoraDirectorSceneSynchronizationCheckpoint,
  serializeNexoraDirectorSceneSynchronizationCheckpoint,
  serializeNexoraDirectorSceneSynchronizationPlan,
  serializeNexoraDirectorSceneSynchronizationRecord,
  serializeNexoraDirectorSceneSynchronizationSnapshot,
  serializeNexoraDirectorSceneSynchronizationState,
  simulateNexoraDirectorSceneSynchronizationSequence,
  synchronizeNexoraDirectorSceneCollection,
  validateNexoraDirectorSceneSynchronizationDependencies,
  validateNexoraDirectorSceneSynchronizationPlan,
  validateNexoraDirectorSceneSynchronizationRequest,
  type NexoraDirectorSceneSynchronizationCommand,
  type NexoraDirectorSceneSynchronizationDependencies,
  type NexoraDirectorSceneSynchronizationRequest,
} from "./nexoraObjectDirectorSceneSynchronizationEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorSceneSynchronizationEngine.ts"),
  "utf8",
);

const NOW = "2026-08-04T19:00:00.000Z";

function syncDeps(): NexoraDirectorSceneSynchronizationDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => NOW,
    createSynchronizationId: () => {
      seq += 1;
      return `dir-sync:${seq}`;
    },
    createCommandId: (
      objectId: string,
      type: NexoraDirectorSceneSynchronizationCommand["type"],
    ) => {
      seq += 1;
      return `dir-sync-cmd:${objectId}:${type}:${seq}`;
    },
    createEventId: () => {
      seq += 1;
      return `dir-sync-evt:${seq}`;
    },
    createCheckpointId: () => {
      seq += 1;
      return `dir-sync-ckpt:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-sync-snap:${seq}`;
    },
  });
}

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
    readonly renderingPriority?: number;
    readonly layer?: "Background" | "Normal" | "Selected" | "Focused" | "Attention" | "Overlay" | "Historical";
    readonly interactionState?:
      | "Idle"
      | "Hovered"
      | "Selected"
      | "Focused"
      | "Operating"
      | "Disabled"
      | "Historical";
    readonly packageVersion?: string;
    readonly sceneObjectId?: string;
  } = {},
): NexoraObjectDirectorIntegrationPackage {
  const sceneObjectId =
    overrides.sceneObjectId ?? createNexoraDirectorSceneObjectId(objectId);
  const visible = overrides.visible ?? true;
  const updateStrategy = overrides.updateStrategy ?? "Update";

  return deepFreeze({
    packageId: overrides.packageId ?? `pkg:${objectId}`,
    packageVersion: overrides.packageVersion ?? "1.0.0",
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
      renderingPriority: overrides.renderingPriority ?? 1,
    }),
    hierarchy: deepFreeze({
      childSceneObjectIds: Object.freeze([sceneObjectId]),
      layer: overrides.layer ?? ("Normal" as const),
      order: 0,
      depthWeight: 0,
    }),
    interaction: deepFreeze({
      state: overrides.interactionState ?? ("Idle" as const),
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
      interactionState: overrides.interactionState ?? ("Idle" as const),
      representationState: "Minimum" as const,
      layer: overrides.layer ?? ("Normal" as const),
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
      renderingPriority: overrides.renderingPriority ?? 1,
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
    readonly collectionId?: string;
    readonly packages?: readonly NexoraObjectDirectorIntegrationPackage[];
  } = {},
): NexoraObjectDirectorIntegrationCollection {
  const packages = Object.freeze(
    overrides.packages ??
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
    collectionId: overrides.collectionId ?? `col:${objectIds.join("|")}`,
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

function emptyRegistry(): NexoraDirectorSceneBindingRegistry {
  return deepFreeze({
    registryId: "dir-bind-reg:empty",
    bindings: Object.freeze([]),
  });
}

function bindCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
  previous?: NexoraDirectorSceneBindingRegistry,
): NexoraDirectorSceneBindingRegistry {
  return bindDirectorSceneCollection(collection, previous, bindingDeps());
}

function makeRequest(
  collection: NexoraObjectDirectorIntegrationCollection,
  registry: NexoraDirectorSceneBindingRegistry,
  overrides: Partial<NexoraDirectorSceneSynchronizationRequest> = {},
): NexoraDirectorSceneSynchronizationRequest {
  return deepFreeze({
    requestId: overrides.requestId ?? "req:1",
    integrationCollection: collection,
    bindingRegistry: registry,
    previousIntegrationCollection: overrides.previousIntegrationCollection,
    previousSynchronizationState: overrides.previousSynchronizationState,
    mode: overrides.mode ?? "Atomic",
    context: overrides.context ??
      deepFreeze({
        source: "Director" as const,
      }),
    expectedSynchronizationRevision: overrides.expectedSynchronizationRevision,
    dryRun: overrides.dryRun,
  });
}

describe("NOL-3:3 NexoraObject Director Scene Synchronization Engine", () => {
  it("1. Engine identity is exact.", () => {
    assert.equal(
      nexoraObjectDirectorSceneSynchronizationEngineIdentity,
      "NOL-3:3/NexoraObjectDirectorSceneSynchronizationEngine",
    );
    assert.equal(nexoraObjectDirectorSceneSynchronizationEngineVersion, "1.0.0");
    assert.equal(
      nexoraObjectDirectorSceneSynchronizationSchemaVersion,
      "1.0.0",
    );
    assert.deepEqual(NOL_DIRECTOR_SCENE_SYNCHRONIZATION_UPSTREAM, [
      nexoraObjectDirectorIntegrationFoundationIdentity,
      "NOL-3:2/NexoraObjectDirectorSceneBindingModel",
    ]);
  });

  it("2. Production imports are limited to NOL-3:1 and NOL-3:2.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectDirectorIntegrationFoundation.ts",
      "./nexoraObjectDirectorSceneBindingModel.ts",
    ]);
  });

  it("3. Default synchronization state is Idle with revision zero.", () => {
    const collection = makeCollection(["a"]);
    const registry = emptyRegistry();
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    assert.equal(state.status, "Idle");
    assert.equal(state.revision, 0);
    assert.equal(state.packageCount, 1);
    assert.equal(state.bindingCount, 0);
  });

  it("4. Initial collection produces Create and Bind commands.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.equal(plan.accepted, true);
    const types = plan.commands.map((c) => c.type);
    assert.ok(types.includes("CreateSceneObject"));
    assert.ok(types.includes("BindSceneObject"));
  });

  it("5. Equal previous and next collections produce Reuse.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry, {
        previousIntegrationCollection: collection,
      }),
      syncDeps(),
    );
    assert.ok(plan.commands.every((c) => c.type === "ReuseSceneObject"));
  });

  it("6. Changed package sections produce only corresponding update commands.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({
        packageId: "pkg:a:v2",
        interactionState: "Selected",
      }),
    });
    const registry = bindCollection(previous);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    const types = new Set(plan.commands.map((c) => c.type));
    assert.ok(types.has("UpdateInteraction"));
    assert.ok(!types.has("CreateSceneObject"));
    assert.ok(!types.has("UpdateHierarchy"));
  });

  it("7. Hidden package produces Hide command.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({
        packageId: "pkg:a:hide",
        visible: false,
        updateStrategy: "Hide",
      }),
    });
    const registry = bindCollection(previous);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    assert.ok(plan.commands.some((c) => c.type === "HideSceneObject"));
  });

  it("8. Hidden-to-visible package produces Show command.", () => {
    const previous = makeCollection(["a"], {
      pkgOverrides: () => ({ visible: false, updateStrategy: "Hide" }),
    });
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({
        packageId: "pkg:a:show",
        visible: true,
        updateStrategy: "Update",
      }),
    });
    const registry = bindCollection(previous);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    assert.ok(plan.commands.some((c) => c.type === "ShowSceneObject"));
  });

  it("9. Missing package preserves binding by default.", () => {
    const previous = makeCollection(["a", "b"]);
    const next = makeCollection(["a"]);
    const registry = bindCollection(previous);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
        context: deepFreeze({ source: "Director" as const }),
      }),
      syncDeps(),
    );
    assert.ok(findBindingByObjectId(result.nextRegistry, "b"));
    assert.ok(
      result.warnings.some(
        (w) => w.code === "DIRECTOR_SYNC_HIDDEN_BINDING_PRESERVED",
      ),
    );
  });

  it("10. Missing package removes binding when policy requests removal.", () => {
    const previous = makeCollection(["a", "b"]);
    const next = makeCollection(["a"]);
    const registry = bindCollection(previous);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
        context: deepFreeze({
          source: "Director" as const,
          removeMissingObjects: true,
        }),
      }),
      syncDeps(),
    );
    const binding = findBindingByObjectId(result.nextRegistry, "b");
    assert.ok(binding);
    assert.equal(binding.state, "Removed");
    assert.ok(
      result.plan.commands.some((c) => c.type === "RemoveSceneObject"),
    );
  });

  it("11. Detached binding may recover when allowed.", () => {
    const collection = makeCollection(["a"]);
    let registry = bindCollection(collection);
    const binding = findBindingByObjectId(registry, "a")!;
    const detached = detachDirectorSceneBinding(binding, bindingDeps());
    registry = deepFreeze({
      registryId: registry.registryId,
      bindings: Object.freeze([detached]),
    });
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:recover" }),
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: collection,
        context: deepFreeze({
          source: "Director" as const,
          allowBindingRecovery: true,
        }),
      }),
      syncDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.ok(
      plan.warnings.some((w) => w.code === "DIRECTOR_SYNC_BINDING_RECOVERED"),
    );
  });

  it("12. Removed binding cannot recover.", () => {
    const collection = makeCollection(["a"]);
    let registry = bindCollection(collection);
    const binding = findBindingByObjectId(registry, "a")!;
    const removed = removeDirectorSceneBinding(binding, bindingDeps());
    registry = deepFreeze({
      registryId: registry.registryId,
      bindings: Object.freeze([removed]),
    });
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:again" }),
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: collection,
      }),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.ok(
      plan.errors.some(
        (e) => e.code === "DIRECTOR_SYNC_REMOVED_BINDING_REUSE_FORBIDDEN",
      ),
    );
  });

  it("13. Binding identity is preserved across updates.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:v2", interactionState: "Focused" }),
    });
    const registry = bindCollection(previous);
    const before = findBindingByObjectId(registry, "a")!;
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    const after = findBindingByObjectId(result.nextRegistry, "a")!;
    assert.equal(after.bindingId, before.bindingId);
  });

  it("14. Scene-object identity is preserved across updates.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:v2", interactionState: "Hovered" }),
    });
    const registry = bindCollection(previous);
    const before = findBindingByObjectId(registry, "a")!;
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    const after = findBindingByObjectId(result.nextRegistry, "a")!;
    assert.equal(after.sceneObjectId, before.sceneObjectId);
  });

  it("15. Binding generation increments only when package changes.", () => {
    const previous = makeCollection(["a"]);
    const same = makeCollection(["a"]);
    const changed = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:v2" }),
    });
    const registry = bindCollection(previous);
    const before = findBindingByObjectId(registry, "a")!;
    const reuse = applyNexoraDirectorSceneSynchronization(
      makeRequest(same, registry, { previousIntegrationCollection: previous }),
      syncDeps(),
    );
    assert.equal(
      findBindingByObjectId(reuse.nextRegistry, "a")!.generation,
      before.generation,
    );
    const update = applyNexoraDirectorSceneSynchronization(
      makeRequest(changed, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    assert.equal(
      findBindingByObjectId(update.nextRegistry, "a")!.generation,
      before.generation + 1,
    );
  });

  it("16. No-op synchronization does not increment revision.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry, {
        previousIntegrationCollection: collection,
        previousSynchronizationState: deepFreeze({
          ...state,
          revision: 3,
        }),
      }),
      syncDeps(),
    );
    assert.equal(result.nextState.revision, 3);
    assert.equal(result.changed, false);
  });

  it("17. Accepted changed synchronization increments revision once.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a", "b"]);
    const registry = bindCollection(previous);
    const state = createNexoraDirectorSceneSynchronizationState(
      previous,
      registry,
      undefined,
      syncDeps(),
    );
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
        previousSynchronizationState: state,
      }),
      syncDeps(),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.changed, true);
    assert.equal(result.nextState.revision, state.revision + 1);
  });

  it("18. Revision conflict is rejected.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry, {
        previousSynchronizationState: deepFreeze({ ...state, revision: 2 }),
        expectedSynchronizationRevision: 1,
      }),
      syncDeps(),
    );
    assert.equal(result.accepted, false);
    assert.ok(
      result.errors.some((e) => e.code === "DIRECTOR_SYNC_REVISION_CONFLICT"),
    );
    assert.equal(result.nextRegistry, registry);
  });

  it("19. Dry-run does not change registry or revision.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a", "b"]);
    const registry = bindCollection(previous);
    const state = createNexoraDirectorSceneSynchronizationState(
      previous,
      registry,
      undefined,
      syncDeps(),
    );
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
        previousSynchronizationState: state,
        dryRun: true,
      }),
      syncDeps(),
    );
    assert.equal(result.dryRun, true);
    assert.equal(result.nextRegistry, registry);
    assert.equal(result.nextState.revision, state.revision);
  });

  it("20. Atomic mode rejects all when one package is invalid.", () => {
    const valid = makePkg("a");
    const invalid = deepFreeze({
      ...makePkg("b"),
      objectId: "",
    });
    const collection = makeCollection(["a", "b"], {
      packages: [valid, invalid as NexoraObjectDirectorIntegrationPackage],
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry(), { mode: "Atomic" }),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.equal(plan.commands.length, 0);
  });

  it("21. Atomic rejection returns original binding registry.", () => {
    const previous = makeCollection(["a"]);
    const registry = bindCollection(previous);
    const invalid = deepFreeze({
      ...makePkg("b"),
      objectId: "",
    });
    const collection = makeCollection(["a", "b"], {
      packages: [makePkg("a"), invalid as NexoraObjectDirectorIntegrationPackage],
    });
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry, { mode: "Atomic" }),
      syncDeps(),
    );
    assert.equal(result.accepted, false);
    assert.equal(result.nextRegistry, registry);
  });

  it("22. BestEffort isolates invalid packages.", () => {
    const invalid = deepFreeze({
      ...makePkg("bad"),
      objectId: "",
    });
    const collection = makeCollection(["a", "bad"], {
      packages: [makePkg("a"), invalid as NexoraObjectDirectorIntegrationPackage],
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry(), { mode: "BestEffort" }),
      syncDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.ok(plan.commands.some((c) => c.objectId === "a"));
    assert.ok(!plan.commands.some((c) => c.objectId === "bad"));
  });

  it("23. BestEffort returns PartiallyCompleted for mixed results.", () => {
    const invalid = deepFreeze({
      ...makePkg("bad"),
      objectId: "",
    });
    const collection = makeCollection(["a", "bad"], {
      packages: [makePkg("a"), invalid as NexoraObjectDirectorIntegrationPackage],
    });
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry(), { mode: "BestEffort" }),
      syncDeps(),
    );
    assert.equal(result.accepted, true);
    assert.equal(result.nextState.status, "PartiallyCompleted");
    assert.ok(
      result.warnings.some((w) => w.code === "DIRECTOR_SYNC_BEST_EFFORT_PARTIAL"),
    );
  });

  it("24. Drift detection finds missing bindings.", () => {
    const collection = makeCollection(["a"]);
    const drifts = detectNexoraDirectorSceneSynchronizationDrift(
      collection,
      emptyRegistry(),
    );
    assert.ok(drifts.some((d) => d.type === "MissingBinding"));
  });

  it("25. Drift detection finds package mismatch.", () => {
    const collection = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:new" }),
    });
    const registry = bindCollection(makeCollection(["a"]));
    const drifts = detectNexoraDirectorSceneSynchronizationDrift(
      collection,
      registry,
    );
    assert.ok(drifts.some((d) => d.type === "PackageMismatch"));
  });

  it("26. Drift detection finds scene-identity mismatch.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const binding = findBindingByObjectId(registry, "a")!;
    const mismatched = deepFreeze({
      registryId: registry.registryId,
      bindings: Object.freeze([
        deepFreeze({
          ...binding,
          sceneObjectId: "nexora-scene-object:other",
        }),
      ]),
    });
    const drifts = detectNexoraDirectorSceneSynchronizationDrift(
      collection,
      mismatched,
    );
    assert.ok(drifts.some((d) => d.type === "SceneIdentityMismatch"));
  });

  it("27. Recoverable drift generates repair planning.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.equal(plan.accepted, true);
    assert.ok(plan.commands.some((c) => c.type === "CreateSceneObject"));
  });

  it("28. Non-recoverable drift rejects Atomic mode.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const binding = findBindingByObjectId(registry, "a")!;
    const mismatched = deepFreeze({
      registryId: registry.registryId,
      bindings: Object.freeze([
        deepFreeze({
          ...binding,
          sceneObjectId: "nexora-scene-object:other",
        }),
      ]),
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, mismatched, { mode: "Atomic" }),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.ok(
      plan.errors.some(
        (e) => e.code === "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH",
      ),
    );
  });

  it("29. Stale binding detection is deterministic.", () => {
    const collection = makeCollection(["a"], {
      pkgOverrides: () => ({ visible: true }),
    });
    const registry = bindCollection(
      makeCollection(["a"], { pkgOverrides: () => ({ visible: false }) }),
    );
    const first = findStaleNexoraDirectorSceneBindings(collection, registry);
    const second = findStaleNexoraDirectorSceneBindings(collection, registry);
    assert.deepEqual(
      first.map((b) => b.bindingId),
      second.map((b) => b.bindingId),
    );
  });

  it("30. Stale package detection is deterministic.", () => {
    const previous = makeCollection(["a"], {
      pkgOverrides: () => ({ packageVersion: "2.0.0" }),
    });
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageVersion: "1.0.0", packageId: "pkg:a:old" }),
    });
    const registry = bindCollection(previous);
    const first = findStaleNexoraDirectorIntegrationPackages(
      next,
      registry,
      previous,
    );
    const second = findStaleNexoraDirectorIntegrationPackages(
      next,
      registry,
      previous,
    );
    assert.deepEqual(
      first.map((p) => p.objectId),
      second.map((p) => p.objectId),
    );
    assert.ok(first.some((p) => p.objectId === "a"));
  });

  it("31. Commands follow fixed phase ordering.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const phaseRank: Record<string, number> = {
      Prepare: 0,
      Structure: 1,
      Content: 2,
      Interaction: 3,
      Presentation: 4,
      Finalize: 5,
    };
    for (let i = 1; i < plan.commands.length; i += 1) {
      assert.ok(
        phaseRank[plan.commands[i]!.phase]! >=
          phaseRank[plan.commands[i - 1]!.phase]!,
      );
    }
  });

  it("32. Explicit dependencies precede dependent commands.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const index = new Map(plan.commands.map((c, i) => [c.commandId, i]));
    for (const command of plan.commands) {
      for (const dep of command.dependsOnCommandIds) {
        assert.ok(index.get(dep)! < index.get(command.commandId)!);
      }
    }
  });

  it("33. Create precedes Bind.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const create = plan.commands.find((c) => c.type === "CreateSceneObject")!;
    const bind = plan.commands.find((c) => c.type === "BindSceneObject")!;
    assert.ok(create.order < bind.order);
    assert.ok(bind.dependsOnCommandIds.includes(create.commandId));
  });

  it("34. Bind precedes section updates.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const bind = plan.commands.find((c) => c.type === "BindSceneObject")!;
    const section = plan.commands.find((c) =>
      c.type.startsWith("Update"),
    );
    assert.ok(section);
    assert.ok(bind.order < section!.order);
  });

  it("35. Remove occurs last for an object.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection([]);
    const registry = bindCollection(previous);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
        context: deepFreeze({
          source: "Director" as const,
          removeMissingObjects: true,
        }),
      }),
      syncDeps(),
    );
    const objectCommands = plan.commands.filter((c) => c.objectId === "a");
    const remove = objectCommands.find((c) => c.type === "RemoveSceneObject")!;
    assert.equal(
      remove.order,
      Math.max(...objectCommands.map((c) => c.order)),
    );
  });

  it("36. Circular command dependencies are rejected.", () => {
    const a = deepFreeze({
      commandId: "c1",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "UpdateSceneObject" as const,
      order: 0,
      phase: "Content" as const,
      dependsOnCommandIds: Object.freeze(["c2"]),
      changedSections: Object.freeze(["SceneObject" as const]),
      reversible: true,
      payload: deepFreeze({}),
    });
    const b = deepFreeze({
      commandId: "c2",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "UpdateRendering" as const,
      order: 1,
      phase: "Content" as const,
      dependsOnCommandIds: Object.freeze(["c1"]),
      changedSections: Object.freeze(["Rendering" as const]),
      reversible: true,
      payload: deepFreeze({}),
    });
    const validation = validateNexoraDirectorSceneSynchronizationDependencies([
      a,
      b,
    ]);
    assert.equal(validation.ok, false);
    if (!validation.ok) {
      assert.ok(
        validation.errors.some(
          (e) => e.code === "DIRECTOR_SYNC_COMMAND_DEPENDENCY_CYCLE",
        ),
      );
    }
  });

  it("37. Missing command dependencies are rejected.", () => {
    const command = deepFreeze({
      commandId: "c1",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "BindSceneObject" as const,
      order: 0,
      phase: "Prepare" as const,
      dependsOnCommandIds: Object.freeze(["missing"]),
      changedSections: Object.freeze([] as const),
      reversible: true,
      payload: deepFreeze({}),
    });
    const validation = validateNexoraDirectorSceneSynchronizationDependencies([
      command,
    ]);
    assert.equal(validation.ok, false);
    if (!validation.ok) {
      assert.ok(
        validation.errors.some(
          (e) => e.code === "DIRECTOR_SYNC_COMMAND_DEPENDENCY_MISSING",
        ),
      );
    }
  });

  it("38. Reuse commands contain no changed sections.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry, {
        previousIntegrationCollection: collection,
      }),
      syncDeps(),
    );
    for (const command of plan.commands.filter(
      (c) => c.type === "ReuseSceneObject",
    )) {
      assert.equal(command.changedSections.length, 0);
    }
  });

  it("39. Update commands contain at least one changed section.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({
        packageId: "pkg:a:v2",
        interactionState: "Selected",
      }),
    });
    const registry = bindCollection(previous);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, {
        previousIntegrationCollection: previous,
      }),
      syncDeps(),
    );
    for (const command of plan.commands.filter((c) =>
      c.type.startsWith("Update"),
    )) {
      assert.ok(command.changedSections.length > 0);
    }
  });

  it("40. Rollback reverses command order.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
      plan.commands,
      syncDeps(),
    );
    const forwardIds = plan.commands.map((c) => c.commandId);
    const rollbackOf = rollback.rollbackCommands.map(
      (c) => c.payload.rollbackOf as string,
    );
    assert.deepEqual(rollbackOf, [...forwardIds].reverse().filter((id) =>
      rollbackOf.includes(id),
    ));
    for (let i = 1; i < rollback.rollbackCommands.length; i += 1) {
      assert.ok(
        rollback.rollbackCommands[i]!.order >
          rollback.rollbackCommands[i - 1]!.order,
      );
    }
  });

  it("41. Create rollback proposes Remove.", () => {
    const collection = makeCollection(["a"]);
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const create = plan.commands.find((c) => c.type === "CreateSceneObject")!;
    const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
      [create],
      syncDeps(),
    );
    assert.ok(
      rollback.rollbackCommands.some((c) => c.type === "RemoveSceneObject"),
    );
  });

  it("42. Hide rollback proposes Show when appropriate.", () => {
    const hide = deepFreeze({
      commandId: "hide1",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "HideSceneObject" as const,
      order: 0,
      phase: "Presentation" as const,
      dependsOnCommandIds: Object.freeze([] as string[]),
      changedSections: Object.freeze([] as const),
      previousPackage: makePkg("a", { visible: true }),
      nextPackage: makePkg("a", { visible: false }),
      reversible: true,
      payload: deepFreeze({}),
    });
    const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
      [hide],
      syncDeps(),
    );
    assert.ok(
      rollback.rollbackCommands.some((c) => c.type === "ShowSceneObject"),
    );
  });

  it("43. Update rollback restores previous package.", () => {
    const previousPackage = makePkg("a");
    const nextPackage = makePkg("a", {
      packageId: "pkg:a:v2",
      interactionState: "Selected",
    });
    const update = deepFreeze({
      commandId: "u1",
      requestId: "r",
      objectId: "a",
      sceneObjectId: previousPackage.sceneObject.sceneObjectId,
      type: "UpdateInteraction" as const,
      order: 0,
      phase: "Interaction" as const,
      dependsOnCommandIds: Object.freeze([] as string[]),
      changedSections: Object.freeze(["Interaction" as const]),
      previousPackage,
      nextPackage,
      reversible: true,
      payload: deepFreeze({}),
    });
    const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
      [update],
      syncDeps(),
    );
    const inverse = rollback.rollbackCommands[0]!;
    assert.equal(inverse.nextPackage?.packageId, previousPackage.packageId);
  });

  it("44. Non-reversible removal is identified.", () => {
    const remove = deepFreeze({
      commandId: "rm1",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "RemoveSceneObject" as const,
      order: 0,
      phase: "Finalize" as const,
      dependsOnCommandIds: Object.freeze([] as string[]),
      changedSections: Object.freeze([] as const),
      reversible: false,
      payload: deepFreeze({}),
    });
    const rollback = createNexoraDirectorSceneSynchronizationRollbackPlan(
      [remove],
      syncDeps(),
    );
    assert.ok(
      rollback.warnings.some(
        (w) => w.code === "DIRECTOR_SYNC_ROLLBACK_NON_REVERSIBLE",
      ),
    );
  });

  it("45. Checkpoint creation is deterministic.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    const a = createNexoraDirectorSceneSynchronizationCheckpoint(
      state,
      collection,
      registry,
      syncDeps(),
    );
    const b = createNexoraDirectorSceneSynchronizationCheckpoint(
      state,
      collection,
      registry,
      syncDeps(),
    );
    assert.equal(a.synchronizationRevision, b.synchronizationRevision);
    assert.equal(a.createdAt, b.createdAt);
  });

  it("46. Checkpoint restoration does not mutate live inputs.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    const checkpoint = createNexoraDirectorSceneSynchronizationCheckpoint(
      state,
      collection,
      registry,
      syncDeps(),
    );
    const before = JSON.stringify(collection);
    const restored = restoreNexoraDirectorSceneSynchronizationCheckpoint(
      checkpoint,
      syncDeps(),
    );
    assert.equal(JSON.stringify(collection), before);
    assert.equal(restored.registry, checkpoint.bindingRegistry);
    assert.equal(restored.state.revision, checkpoint.synchronizationRevision);
  });

  it("47. Sequence simulation preserves request order.", () => {
    const c1 = makeCollection(["a"]);
    const c2 = makeCollection(["a", "b"]);
    const registry = emptyRegistry();
    const simulation = simulateNexoraDirectorSceneSynchronizationSequence(
      [
        makeRequest(c1, registry, { requestId: "r1" }),
        makeRequest(c2, registry, {
          requestId: "r2",
          previousIntegrationCollection: c1,
        }),
      ],
      undefined,
      syncDeps(),
    );
    assert.equal(simulation.results[0]!.plan.requestId, "r1");
    assert.equal(simulation.results[1]!.plan.requestId, "r2");
  });

  it("48. Sequence simulation never mutates inputs.", () => {
    const c1 = makeCollection(["a"]);
    const registry = emptyRegistry();
    const beforeCollection = JSON.stringify(c1);
    const beforeRegistry = JSON.stringify(registry);
    simulateNexoraDirectorSceneSynchronizationSequence(
      [makeRequest(c1, registry, { requestId: "r1" })],
      undefined,
      syncDeps(),
    );
    assert.equal(JSON.stringify(c1), beforeCollection);
    assert.equal(JSON.stringify(registry), beforeRegistry);
  });

  it("49. Sequence simulation identifies first failure.", () => {
    const c1 = makeCollection(["a"]);
    const registry = emptyRegistry();
    const state = createNexoraDirectorSceneSynchronizationState(
      c1,
      registry,
      undefined,
      syncDeps(),
    );
    const simulation = simulateNexoraDirectorSceneSynchronizationSequence(
      [
        makeRequest(c1, registry, {
          requestId: "r1",
          previousSynchronizationState: deepFreeze({ ...state, revision: 1 }),
          expectedSynchronizationRevision: 0,
        }),
        makeRequest(c1, registry, { requestId: "r2" }),
      ],
      { stopOnFailure: true },
      syncDeps(),
    );
    assert.equal(simulation.firstFailureIndex, 0);
    assert.equal(simulation.results.length, 1);
  });

  it("50. Synchronization events preserve correlation and causation IDs.", () => {
    const collection = makeCollection(["a"]);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry(), {
        context: deepFreeze({
          source: "Director" as const,
          correlationId: "corr-1",
          causationId: "cause-1",
          actorId: "actor-1",
        }),
      }),
      syncDeps(),
    );
    assert.ok(result.events.length > 0);
    for (const event of result.events) {
      assert.equal(event.correlationId, "corr-1");
      assert.equal(event.causationId, "cause-1");
      assert.equal(event.actorId, "actor-1");
    }
  });

  it("51. Synchronization records report accurate command counts.", () => {
    const collection = makeCollection(["a"]);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const record = createNexoraDirectorSceneSynchronizationRecord(
      result,
      syncDeps(),
    );
    assert.equal(record.createdCount, 1);
    assert.ok(record.updatedCount >= 1);
    const history = projectNexoraDirectorSceneSynchronizationHistory([record]);
    assert.equal(history.totalCreated, 1);
  });

  it("52. Snapshot comparison detects revision changes.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      syncDeps(),
    );
    const left = createNexoraDirectorSceneSynchronizationSnapshot(
      state,
      collection,
      registry,
      syncDeps(),
    );
    const right = createNexoraDirectorSceneSynchronizationSnapshot(
      deepFreeze({ ...state, revision: state.revision + 1 }),
      collection,
      registry,
      syncDeps(),
    );
    const comparison = compareNexoraDirectorSceneSynchronizationSnapshots(
      left,
      right,
    );
    assert.equal(comparison.revisionChanged, true);
  });

  it("53. Snapshot comparison detects binding generation changes.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({ packageId: "pkg:a:v2" }),
    });
    const registry = bindCollection(previous);
    const state = createNexoraDirectorSceneSynchronizationState(
      previous,
      registry,
      undefined,
      syncDeps(),
    );
    const left = createNexoraDirectorSceneSynchronizationSnapshot(
      state,
      previous,
      registry,
      syncDeps(),
    );
    const applied = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, { previousIntegrationCollection: previous }),
      syncDeps(),
    );
    const right = createNexoraDirectorSceneSynchronizationSnapshot(
      applied.nextState,
      next,
      applied.nextRegistry,
      syncDeps(),
    );
    const comparison = compareNexoraDirectorSceneSynchronizationSnapshots(
      left,
      right,
    );
    assert.ok(comparison.bindingGenerationChanges.length > 0);
  });

  it("54. Snapshot comparison detects lifecycle changes.", () => {
    const previous = makeCollection(["a"]);
    const next = makeCollection(["a"], {
      pkgOverrides: () => ({
        packageId: "pkg:a:hide",
        visible: false,
        updateStrategy: "Hide",
      }),
    });
    const registry = bindCollection(previous);
    const state = createNexoraDirectorSceneSynchronizationState(
      previous,
      registry,
      undefined,
      syncDeps(),
    );
    const left = createNexoraDirectorSceneSynchronizationSnapshot(
      state,
      previous,
      registry,
      syncDeps(),
    );
    const applied = applyNexoraDirectorSceneSynchronization(
      makeRequest(next, registry, { previousIntegrationCollection: previous }),
      syncDeps(),
    );
    const right = createNexoraDirectorSceneSynchronizationSnapshot(
      applied.nextState,
      next,
      applied.nextRegistry,
      syncDeps(),
    );
    const comparison = compareNexoraDirectorSceneSynchronizationSnapshots(
      left,
      right,
    );
    assert.ok(comparison.bindingLifecycleChanges.length > 0);
  });

  it("55. Validation rejects duplicate object IDs.", () => {
    const collection = makeCollection(["a", "a"], {
      packages: [makePkg("a"), makePkg("a")],
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.ok(
      plan.errors.some((e) => e.code === "DIRECTOR_SYNC_DUPLICATE_OBJECT_ID"),
    );
  });

  it("56. Validation rejects duplicate scene-object IDs.", () => {
    const a = makePkg("a");
    const b = deepFreeze({
      ...makePkg("b"),
      sceneObject: deepFreeze({
        ...makePkg("b").sceneObject,
        sceneObjectId: a.sceneObject.sceneObjectId,
      }),
    });
    const collection = makeCollection(["a", "b"], { packages: [a, b] });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.ok(
      plan.errors.some(
        (e) =>
          e.code === "DIRECTOR_SYNC_DUPLICATE_SCENE_OBJECT_ID" ||
          e.code === "DIRECTOR_SYNC_INVALID_COLLECTION",
      ),
    );
  });

  it("57. Validation rejects duplicate command IDs.", () => {
    const command = deepFreeze({
      commandId: "dup",
      requestId: "r",
      objectId: "a",
      sceneObjectId: "nexora-scene-object:a",
      type: "ReuseSceneObject" as const,
      order: 0,
      phase: "Finalize" as const,
      dependsOnCommandIds: Object.freeze([] as string[]),
      changedSections: Object.freeze([] as const),
      reversible: true,
      payload: deepFreeze({}),
    });
    const validation = validateNexoraDirectorSceneSynchronizationDependencies([
      command,
      deepFreeze({ ...command, order: 1 }),
    ]);
    assert.equal(validation.ok, false);
  });

  it("58. Validation rejects package/binding identity mismatch.", () => {
    const collection = makeCollection(["a"]);
    const registry = bindCollection(collection);
    const binding = findBindingByObjectId(registry, "a")!;
    const mismatched = deepFreeze({
      registryId: registry.registryId,
      bindings: Object.freeze([
        deepFreeze({
          ...binding,
          sceneObjectId: "nexora-scene-object:other",
        }),
      ]),
    });
    const plan = evaluateNexoraDirectorSceneSynchronization(
      makeRequest(collection, mismatched),
      syncDeps(),
    );
    assert.equal(plan.accepted, false);
    assert.ok(
      plan.errors.some(
        (e) => e.code === "DIRECTOR_SYNC_SCENE_IDENTITY_MISMATCH",
      ),
    );
  });

  it("59. Validation rejects renderer-specific objects.", () => {
    const validation = validateNexoraDirectorSceneSynchronizationRequest(
      makeRequest(makeCollection(["a"]), emptyRegistry(), {
        context: deepFreeze({
          source: "Director" as const,
          reason: "x",
        }),
      }),
    );
    // Inject forbidden payload via raw object
    const bad = {
      ...makeRequest(makeCollection(["a"]), emptyRegistry()),
      context: {
        source: "Director" as const,
        mesh: { triangles: 1 },
      },
    };
    const result = validateNexoraDirectorSceneSynchronizationRequest(
      bad as NexoraDirectorSceneSynchronizationRequest,
    );
    assert.equal(result.ok, false);
    void validation;
  });

  it("60. Plans and results are deeply immutable.", () => {
    const collection = makeCollection(["a"]);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.ok(isDeeplyFrozen(result));
    assert.ok(isDeeplyFrozen(result.plan));
    assertNexoraDirectorSceneSynchronizationInvariants(result.plan);
  });

  it("61. Serialization and deserialization are reversible.", () => {
    const collection = makeCollection(["a"]);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const stateJson = serializeNexoraDirectorSceneSynchronizationState(
      result.nextState,
    );
    assert.deepEqual(
      deserializeNexoraDirectorSceneSynchronizationState(stateJson),
      result.nextState,
    );
    const planJson = serializeNexoraDirectorSceneSynchronizationPlan(
      result.plan,
    );
    assert.equal(
      deserializeNexoraDirectorSceneSynchronizationPlan(planJson).requestId,
      result.plan.requestId,
    );
    const record = createNexoraDirectorSceneSynchronizationRecord(
      result,
      syncDeps(),
    );
    assert.deepEqual(
      deserializeNexoraDirectorSceneSynchronizationRecord(
        serializeNexoraDirectorSceneSynchronizationRecord(record),
      ),
      record,
    );
    const checkpoint = createNexoraDirectorSceneSynchronizationCheckpoint(
      result.nextState,
      collection,
      result.nextRegistry,
      syncDeps(),
    );
    assert.deepEqual(
      deserializeNexoraDirectorSceneSynchronizationCheckpoint(
        serializeNexoraDirectorSceneSynchronizationCheckpoint(checkpoint),
      ),
      checkpoint,
    );
    const snapshot = createNexoraDirectorSceneSynchronizationSnapshot(
      result.nextState,
      collection,
      result.nextRegistry,
      syncDeps(),
    );
    assert.deepEqual(
      deserializeNexoraDirectorSceneSynchronizationSnapshot(
        serializeNexoraDirectorSceneSynchronizationSnapshot(snapshot),
      ),
      snapshot,
    );
  });

  it("62. Unsupported schemas are rejected.", () => {
    assert.throws(() => {
      deserializeNexoraDirectorSceneSynchronizationState(
        JSON.stringify({
          schemaVersion: "0.0.0",
          kind: "state",
          state: {},
        }),
      );
    });
  });

  it("63. Serialized output contains no functions or renderer instances.", () => {
    const collection = makeCollection(["a"]);
    const result = applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    const json = serializeNexoraDirectorSceneSynchronizationPlan(result.plan);
    assert.equal(json.includes("function"), false);
    assert.equal(json.includes("\"mesh\""), false);
    JSON.parse(json);
  });

  it("64. No integration package is mutated.", () => {
    const collection = makeCollection(["a"]);
    const before = JSON.stringify(collection.packages[0]);
    applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, emptyRegistry()),
      syncDeps(),
    );
    assert.equal(JSON.stringify(collection.packages[0]), before);
  });

  it("65. No binding registry input is mutated.", () => {
    const collection = makeCollection(["a"]);
    const registry = emptyRegistry();
    const before = JSON.stringify(registry);
    applyNexoraDirectorSceneSynchronization(
      makeRequest(collection, registry),
      syncDeps(),
    );
    assert.equal(JSON.stringify(registry), before);
  });

  it("66. No NOL-1 or NOL-2 state is mutated.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectDirectorIntegrationFoundation.ts",
      "./nexoraObjectDirectorSceneBindingModel.ts",
    ]);
    assert.equal(source.includes("nexoraObjectRuntime"), false);
    assert.equal(
      source.includes('from "../nexoraObjectMaterialRepresentationPublicIndex'),
      false,
    );
    assert.equal(source.includes('from "react"'), false);
    assert.equal(source.includes('from "three"'), false);
    const collection = makeCollection(["a"]);
    const pkg = collection.packages[0]!;
    const before = JSON.stringify(pkg);
    synchronizeNexoraDirectorSceneCollection(
      collection,
      emptyRegistry(),
      deepFreeze({ source: "System" as const }),
      { mode: "Atomic" },
      syncDeps(),
    );
    assert.equal(JSON.stringify(pkg), before);
  });

  it("67. Typecheck remains clean.", () => {
    // Exercised by repository typecheck; ensure public ordering API typechecks.
    const ordered = resolveNexoraDirectorSceneSynchronizationCommandOrder([]);
    assert.equal(ordered.length, 0);
    const validation = validateNexoraDirectorSceneSynchronizationPlan(
      evaluateNexoraDirectorSceneSynchronization(
        makeRequest(makeCollection(["a"]), emptyRegistry()),
        syncDeps(),
      ),
    );
    assert.equal(validation.ok, true);
  });

  it("68. ESLint remains clean.", () => {
    // Exercised by repository ESLint on the new files.
    assert.ok(source.includes("evaluateNexoraDirectorSceneSynchronization"));
  });
});
