/**
 * NOL-3:6 — NexoraObject Director Integration Validation & Integrity Engine tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bindDirectorSceneCollection,
  createDirectorSceneBinding,
  createInteractionRoutingPlan,
  createNexoraDirectorCameraFocusSnapshot,
  createNexoraDirectorCameraFocusState,
  createNexoraDirectorSceneObjectId,
  createNexoraDirectorSceneSynchronizationSnapshot,
  createNexoraDirectorSceneSynchronizationState,
  createNexoraObjectDirectorIntegrationSnapshot,
  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  serializeNexoraDirectorCameraFocusState,
  serializeNexoraObjectDirectorIntegrationCollection,
  type NexoraDirectorCameraFocusState,
  type NexoraDirectorFocusStack,
  type NexoraDirectorInteractionRoutingContext,
  type NexoraDirectorInteractionRoutingPlan,
  type NexoraDirectorSceneBinding,
  type NexoraDirectorSceneBindingRegistry,
  type NexoraDirectorSceneSynchronizationState,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorCameraFocusCoordinationEngine.ts";
import {
  assertDirectorIntegrationInvariants,
  calculateDirectorIntegrityScore,
  compareDirectorValidationReports,
  deserializeNexoraDirectorValidationReport,
  generateDirectorRepairSuggestions,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
  nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
  NOL_DIRECTOR_VALIDATION_UPSTREAM,
  NexoraObjectDirectorIntegrationValidationException,
  serializeNexoraDirectorValidationReport,
  validateDirectorBindings,
  validateDirectorFocus,
  validateDirectorIntegration,
  validateDirectorIntegrationBatch,
  validateDirectorRouting,
  validateDirectorSerialization,
  validateDirectorSnapshots,
  validateDirectorSynchronization,
  type NexoraDirectorIntegrationValidationInput,
  type NexoraDirectorValidationDependencies,
  type NexoraDirectorValidationIssue,
  type NexoraDirectorValidationReport,
} from "./nexoraObjectDirectorIntegrationValidationIntegrityEngine.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(
    __dirname,
    "nexoraObjectDirectorIntegrationValidationIntegrityEngine.ts",
  ),
  "utf8",
);

const NOW = "2026-08-04T23:00:00.000Z";

function validationDeps(): NexoraDirectorValidationDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => NOW,
    createReportId: () => {
      seq += 1;
      return `dir-val-report:${seq}`;
    },
    createSuggestionId: () => {
      seq += 1;
      return `dir-val-suggestion:${seq}`;
    },
    elapsedMs: () => 0,
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
    readonly visible?: boolean;
    readonly operable?: boolean;
  } = {},
): NexoraObjectDirectorIntegrationPackage {
  const sceneObjectId = createNexoraDirectorSceneObjectId(objectId);
  const visible = overrides.visible ?? true;
  const renderingLevel = visible ? ("Normal" as const) : ("Hidden" as const);
  const interactionState = "Idle" as const;

  return deepFreeze({
    packageId: `pkg:${objectId}`,
    packageVersion: "1.0.0",
    objectId,
    sceneObject: deepFreeze({
      sceneObjectId,
      objectId,
      objectType: "Goal",
      representationState: "Report" as const,
      renderingLevel,
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
      state: interactionState,
      selectable: true,
      focusable: true,
      operable: overrides.operable ?? false,
      inspectable: true,
      affordances: Object.freeze([]),
    }),
    picking: deepFreeze({
      pickingId: `nexora-pick:${sceneObjectId}:Object`,
      objectId,
      sceneObjectId,
      enabled: visible,
      interactionState,
      representationState: "Report" as const,
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
      mode: "Direct" as const,
      anchors: Object.freeze([]),
      emphasizedRelationshipIds: Object.freeze([]),
    }),
    clustering: deepFreeze({
      clustered: false,
      memberSceneObjectIds: Object.freeze([]),
      collapsed: false,
    }),
    rendering: deepFreeze({
      renderingLevel,
      renderingPriority: 1,
      layer: "Normal" as const,
      dimmed: false,
      visible,
      cacheKey: `cache:${objectId}`,
      geometryKey: `geo:${objectId}`,
      materialKey: `mat:${objectId}`,
      updateStrategy: "Update" as const,
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
  packages: readonly NexoraObjectDirectorIntegrationPackage[],
): NexoraObjectDirectorIntegrationCollection {
  return deepFreeze({
    collectionId: "col:validation",
    packages: Object.freeze([...packages]),
    sceneOrder: Object.freeze(
      packages.map((pkg) => pkg.sceneObject.sceneObjectId),
    ),
    attentionSceneObjectIds: Object.freeze([]),
    hiddenSceneObjectIds: Object.freeze([]),
    metadata: Object.freeze({}),
  });
}

function makeValidFixture(): {
  readonly collection: NexoraObjectDirectorIntegrationCollection;
  readonly registry: NexoraDirectorSceneBindingRegistry;
  readonly synchronizationState: NexoraDirectorSceneSynchronizationState;
  readonly routingPlans: readonly NexoraDirectorInteractionRoutingPlan[];
  readonly focusState: NexoraDirectorCameraFocusState;
  readonly focusStack: NexoraDirectorFocusStack;
  readonly input: NexoraDirectorIntegrationValidationInput;
} {
  const a = makePkg("obj-a");
  const b = makePkg("obj-b");
  const collection = makeCollection([a, b]);
  const registry = bindDirectorSceneCollection(collection, undefined, {
    now: () => NOW,
    createBindingId: (objectId: string, sceneObjectId: string) => {
      void sceneObjectId;
      return `nexora-binding:${objectId}`;
    },
    createRegistryId: (bindingIds: readonly string[]) =>
      `dir-bind-reg:${bindingIds.join("|")}`,
    createSnapshotId: () => "dir-bind-snap:1",
  });
  const synchronizationState = createNexoraDirectorSceneSynchronizationState(
    collection,
    registry,
    undefined,
    {
      now: () => NOW,
      createSynchronizationId: () => "dir-sync:1",
      createCommandId: (objectId: string, type: string) =>
        `dir-sync-cmd:${objectId}:${type}`,
      createEventId: () => "dir-sync-evt:1",
      createCheckpointId: () => "dir-sync-cp:1",
      createSnapshotId: () => "dir-sync-snap:1",
    },
  );
  const bindingA = registry.bindings.find((item) => item.objectId === "obj-a")!;
  const routingContext: NexoraDirectorInteractionRoutingContext = deepFreeze({
    integrationPackage: a,
    binding: bindingA,
  });
  const routingPlans = Object.freeze([
    createInteractionRoutingPlan(
      deepFreeze({
        eventId: "evt-a",
        interactionType: "Select",
        objectId: a.objectId,
        sceneObjectId: a.sceneObject.sceneObjectId,
        bindingId: bindingA.bindingId,
        timestamp: NOW,
        source: "Workspace",
        modifiers: Object.freeze({}),
        payload: Object.freeze({}),
        priority: 10,
      }),
      routingContext,
      {
        now: () => NOW,
        createEventId: () => "dir-route-evt:1",
        createPlanId: () => "dir-route-plan:1",
        createQueueId: () => "dir-route-queue:1",
        createSnapshotId: () => "dir-route-snap:1",
      },
    ),
  ]);
  const focusState = deepFreeze({
    ...createNexoraDirectorCameraFocusState({
      now: () => NOW,
      createStateId: () => "dir-focus-state:1",
      createCommandId: (requestId: string, type: string) =>
        `dir-focus-cmd:${requestId}:${type}`,
      createEventId: () => "dir-focus-evt:1",
      createSnapshotId: () => "dir-focus-snap:1",
    }),
    revision: 1,
    focusState: "Focused" as const,
    focusedObjectId: a.objectId,
    focusedSceneObjectId: a.sceneObject.sceneObjectId,
    cameraIntent: "Center" as const,
    framingMode: "Object" as const,
    neighborhoodSceneObjectIds: Object.freeze([b.sceneObject.sceneObjectId]),
    updatedAt: NOW,
  });
  const focusStack: NexoraDirectorFocusStack = deepFreeze({
    entries: Object.freeze([]),
  });
  const input: NexoraDirectorIntegrationValidationInput = deepFreeze({
    integrationCollection: collection,
    bindingRegistry: registry,
    synchronizationState,
    routingPlans,
    focusState,
    focusStack,
  });
  return {
    collection,
    registry,
    synchronizationState,
    routingPlans,
    focusState,
    focusStack,
    input,
  };
}

describe("NOL-3:6 NexoraObject Director Integration Validation & Integrity Engine", () => {
  it("1. Engine identity is exact", () => {
    assert.equal(
      nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
      "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
      "1.0.0",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
      "1.0.0",
    );
    assert.deepEqual([...NOL_DIRECTOR_VALIDATION_UPSTREAM], [
      nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
    ]);
  });

  it("2. Production imports are limited to NOL-3:5 camera focus engine", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.equal(imports.length, 1);
    assert.equal(
      imports[0],
      "./nexoraObjectDirectorCameraFocusCoordinationEngine.ts",
    );
  });

  it("3. Valid integration passes Minimal validation", () => {
    const { input } = makeValidFixture();
    const report = validateDirectorIntegration(
      input,
      "Minimal",
      validationDeps(),
    );
    assert.equal(report.passed, true);
    assert.equal(report.profile, "Minimal");
    assert.ok(report.validatedSections.includes("Identity"));
    assert.ok(report.score >= 90);
  });

  it("4. Valid integration passes Standard validation", () => {
    const { input } = makeValidFixture();
    const report = validateDirectorIntegration(
      input,
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, true);
    assert.equal(report.profile, "Standard");
    assert.ok(report.validatedSections.includes("Packages"));
    assert.ok(report.validatedSections.includes("Bindings"));
    assert.ok(report.validatedSections.includes("Synchronization"));
    assert.ok(report.validatedSections.includes("Routing"));
    assert.ok(report.validatedSections.includes("Focus"));
  });

  it("5. Valid integration passes Strict validation", () => {
    const { input } = makeValidFixture();
    const report = validateDirectorIntegration(
      input,
      "Strict",
      validationDeps(),
    );
    assert.equal(report.passed, true);
    assert.equal(report.profile, "Strict");
    assert.ok(report.validatedSections.includes("Immutability"));
    assert.ok(report.validatedSections.includes("Compatibility"));
  });

  it("6. Valid integration passes Certification validation", () => {
    const fixture = makeValidFixture();
    const integrationSnapshot = createNexoraObjectDirectorIntegrationSnapshot(
      fixture.collection,
      {
        now: () => NOW,
        createSnapshotId: () => "dir-int-snap:1",
        createPackageId: (objectId: string) => `pkg:${objectId}`,
        createCollectionId: (sceneObjectIds: readonly string[]) =>
          `col:${sceneObjectIds.join("|")}`,
        createRouteId: (sceneObjectId: string, event: string) =>
          `route:${sceneObjectId}:${event}`,
      },
    );
    const synchronizationSnapshot =
      createNexoraDirectorSceneSynchronizationSnapshot(
        fixture.synchronizationState,
        fixture.collection,
        fixture.registry,
        {
          now: () => NOW,
          createSynchronizationId: () => "dir-sync:1",
          createCommandId: (objectId: string, type: string) =>
            `dir-sync-cmd:${objectId}:${type}`,
          createEventId: () => "dir-sync-evt:1",
          createCheckpointId: () => "dir-sync-cp:1",
          createSnapshotId: () => "dir-sync-snap:1",
        },
      );
    const focusSnapshot = createNexoraDirectorCameraFocusSnapshot(
      fixture.focusState,
      fixture.focusStack,
      {
        now: () => NOW,
        createStateId: () => "dir-focus-state:1",
        createCommandId: (requestId: string, type: string) =>
          `dir-focus-cmd:${requestId}:${type}`,
        createEventId: () => "dir-focus-evt:1",
        createSnapshotId: () => "dir-focus-snap:1",
      },
    );
    const serializedArtifacts = Object.freeze([
      deepFreeze({
        kind: "integrationCollection",
        payload: serializeNexoraObjectDirectorIntegrationCollection(
          fixture.collection,
        ),
      }),
      deepFreeze({
        kind: "focusState",
        payload: serializeNexoraDirectorCameraFocusState(fixture.focusState),
      }),
    ]);
    const report = validateDirectorIntegration(
      {
        ...fixture.input,
        integrationSnapshot,
        synchronizationSnapshot,
        focusSnapshot,
        serializedArtifacts,
      },
      "Certification",
      validationDeps(),
    );
    assert.equal(report.passed, true);
    assert.equal(report.profile, "Certification");
    assert.ok(report.validatedSections.includes("Serialization"));
    assert.ok(report.validatedSections.includes("Snapshots"));
    assert.ok(report.validatedSections.includes("PublicAPI"));
  });

  it("7. Invalid package fails Packages domain", () => {
    const bad = makePkg("bad-pkg");
    const broken = deepFreeze({
      ...bad,
      packageId: "",
    });
    const report = validateDirectorIntegration(
      { integrationCollection: makeCollection([broken]) },
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(report.errors.some((item) => item.code === "InvalidPackage"));
  });

  it("8. Invalid binding fails Bindings domain", () => {
    const pkg = makePkg("bind-bad");
    const binding = createDirectorSceneBinding(pkg, {
      now: () => NOW,
      createBindingId: () => "nexora-binding:bind-bad",
      createRegistryId: () => "reg:1",
      createSnapshotId: () => "snap:1",
    });
    const registry: NexoraDirectorSceneBindingRegistry = deepFreeze({
      registryId: "reg:bad",
      bindings: Object.freeze([
        deepFreeze({
          ...binding,
          generation: 0,
        }),
      ]),
    });
    const report = validateDirectorBindings(
      registry,
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(report.errors.some((item) => item.code === "InvalidBinding"));
  });

  it("9. Invalid synchronization fails Synchronization domain", () => {
    const { collection, registry } = makeValidFixture();
    const state = createNexoraDirectorSceneSynchronizationState(
      collection,
      registry,
      undefined,
      {
        now: () => NOW,
        createSynchronizationId: () => "dir-sync:bad",
        createCommandId: (objectId: string, type: string) =>
          `dir-sync-cmd:${objectId}:${type}`,
        createEventId: () => "dir-sync-evt:bad",
        createCheckpointId: () => "dir-sync-cp:bad",
        createSnapshotId: () => "dir-sync-snap:bad",
      },
    );
    const badState = deepFreeze({
      ...state,
      revision: -1,
    });
    const report = validateDirectorSynchronization(
      badState,
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some((item) => item.code === "InvalidSynchronization"),
    );
  });

  it("10. Invalid routing fails Routing domain", () => {
    const { routingPlans } = makeValidFixture();
    const badPlan = deepFreeze({
      ...routingPlans[0]!,
      planId: "",
    });
    const report = validateDirectorRouting(
      [badPlan],
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(report.errors.some((item) => item.code === "InvalidRouting"));
  });

  it("11. Invalid focus fails Focus domain", () => {
    const focusState = createNexoraDirectorCameraFocusState({
      now: () => NOW,
      createStateId: () => "dir-focus-state:bad",
      createCommandId: (requestId: string, type: string) =>
        `dir-focus-cmd:${requestId}:${type}`,
      createEventId: () => "dir-focus-evt:bad",
      createSnapshotId: () => "dir-focus-snap:bad",
    });
    const badState = deepFreeze({
      ...focusState,
      revision: -5,
    });
    const report = validateDirectorFocus(
      badState,
      undefined,
      "Standard",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(report.errors.some((item) => item.code === "InvalidFocus"));
  });

  it("12. Cross-module integrity rejects binding outside collection", () => {
    const a = makePkg("obj-a");
    const orphan = makePkg("orphan");
    const collection = makeCollection([a]);
    const orphanBinding = createDirectorSceneBinding(orphan, {
      now: () => NOW,
      createBindingId: () => "nexora-binding:orphan",
      createRegistryId: () => "reg:orphan",
      createSnapshotId: () => "snap:orphan",
    });
    const registry: NexoraDirectorSceneBindingRegistry = deepFreeze({
      registryId: "reg:cross",
      bindings: Object.freeze([orphanBinding]),
    });
    const report = validateDirectorIntegration(
      {
        integrationCollection: collection,
        bindingRegistry: registry,
      },
      "Strict",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some((item) => item.code === "InvalidCompatibility"),
    );
  });

  it("13. Focused object must resolve through bindings", () => {
    const { collection, registry, focusState } = makeValidFixture();
    const badFocus = deepFreeze({
      ...focusState,
      focusedObjectId: "missing-object",
      focusedSceneObjectId: createNexoraDirectorSceneObjectId("missing-object"),
    });
    const report = validateDirectorIntegration(
      {
        integrationCollection: collection,
        bindingRegistry: registry,
        focusState: badFocus,
      },
      "Strict",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some((item) =>
        item.message.includes("Focused object does not resolve"),
      ),
    );
  });

  it("14. Integrity score is deterministic and weighted", () => {
    const { input } = makeValidFixture();
    const a = validateDirectorIntegration(input, "Standard", validationDeps());
    const b = validateDirectorIntegration(input, "Standard", validationDeps());
    assert.equal(a.score, b.score);
    const fromPartial = calculateDirectorIntegrityScore({
      Identity: 100,
      Bindings: 100,
      Synchronization: 100,
      Routing: 100,
      Focus: 100,
      Serialization: 100,
    });
    assert.equal(fromPartial, 100);
    const reduced = calculateDirectorIntegrityScore({
      Identity: 100,
      Bindings: 50,
    });
    assert.equal(reduced, Math.round((100 * 20 + 50 * 20) / 40));
  });

  it("15. Repair suggestions are immutable and never mutate input", () => {
    const errors: NexoraDirectorValidationIssue[] = [
      deepFreeze({
        code: "InvalidBinding" as const,
        message: "Duplicate binding objectId: obj-a",
        domain: "Bindings" as const,
      }),
      deepFreeze({
        code: "UnsupportedVersion" as const,
        message: "Unsupported schema",
        domain: "Serialization" as const,
      }),
    ];
    const warnings: NexoraDirectorValidationIssue[] = [
      deepFreeze({
        code: "InvalidSynchronization" as const,
        message: "Synchronization status indicates staleness: Failed",
        domain: "Synchronization" as const,
      }),
    ];
    const before = JSON.stringify({ errors, warnings });
    const suggestions = generateDirectorRepairSuggestions(
      errors,
      warnings,
      validationDeps(),
    );
    assert.equal(JSON.stringify({ errors, warnings }), before);
    assert.ok(isDeeplyFrozen(suggestions));
    assert.ok(suggestions.some((item) => item.code === "DUPLICATE_BINDING"));
    assert.ok(suggestions.some((item) => item.code === "UNSUPPORTED_SCHEMA"));
    assert.ok(suggestions.some((item) => item.code === "STALE_SYNCHRONIZATION"));
  });

  it("16. Atomic batch rejects all when one item fails", () => {
    const { input } = makeValidFixture();
    const badFocus = deepFreeze({
      ...input.focusState!,
      revision: -1,
    });
    const batch = validateDirectorIntegrationBatch(
      {
        mode: "Atomic",
        items: [
          { input, profile: "Standard" },
          {
            input: { focusState: badFocus },
            profile: "Standard",
          },
        ],
      },
      validationDeps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.reports.length, 0);
    assert.deepEqual([...batch.rejectedIndexes], [1]);
    assert.deepEqual([...batch.acceptedIndexes], []);
  });

  it("17. BestEffort batch isolates failures", () => {
    const { input } = makeValidFixture();
    const badFocus = deepFreeze({
      ...input.focusState!,
      revision: -1,
    });
    const batch = validateDirectorIntegrationBatch(
      {
        mode: "BestEffort",
        items: [
          { input, profile: "Standard" },
          {
            input: { focusState: badFocus },
            profile: "Standard",
          },
        ],
      },
      validationDeps(),
    );
    assert.equal(batch.accepted, false);
    assert.equal(batch.reports.length, 2);
    assert.equal(batch.reports[0]!.passed, true);
    assert.equal(batch.reports[1]!.passed, false);
    assert.deepEqual([...batch.acceptedIndexes], [0]);
    assert.deepEqual([...batch.rejectedIndexes], [1]);
  });

  it("18. Report comparison is deterministic", () => {
    const { input } = makeValidFixture();
    const good = validateDirectorIntegration(
      input,
      "Standard",
      validationDeps(),
    );
    const bad = validateDirectorIntegration(
      {
        focusState: deepFreeze({
          ...input.focusState!,
          revision: -2,
        }),
      },
      "Standard",
      validationDeps(),
    );
    const comparison = compareDirectorValidationReports(good, bad);
    assert.equal(comparison.previousPassed, true);
    assert.equal(comparison.nextPassed, false);
    assert.equal(comparison.passedChanged, true);
    assert.ok(comparison.scoreDelta < 0);
    assert.ok(comparison.addedErrorCodes.includes("InvalidFocus"));
    const again = compareDirectorValidationReports(good, bad);
    assert.deepEqual(again, comparison);
  });

  it("19. Unsupported schema deserialization is rejected", () => {
    assert.throws(
      () =>
        deserializeNexoraDirectorValidationReport(
          JSON.stringify({
            identity:
              nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
            version:
              nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
            schemaVersion: "9.9.9",
            kind: "validationReport",
            report: {},
          }),
        ),
      (error: unknown) =>
        error instanceof
          NexoraObjectDirectorIntegrationValidationException &&
        error.code === "UnsupportedVersion",
    );
    const report = validateDirectorSerialization(
      [
        {
          kind: "focusState",
          payload: JSON.stringify({
            identity:
              nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
            version: "1.0.0",
            schemaVersion: "9.9.9",
            kind: "focusState",
            state: {},
          }),
        },
      ],
      "Certification",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some((item) => item.code === "UnsupportedVersion"),
    );
  });

  it("20. Renderer-forbidden keys are rejected", () => {
    const pkg = makePkg("render-bad");
    const binding: NexoraDirectorSceneBinding = deepFreeze({
      ...createDirectorSceneBinding(pkg, {
        now: () => NOW,
        createBindingId: () => "nexora-binding:render-bad",
        createRegistryId: () => "reg:render",
        createSnapshotId: () => "snap:render",
      }),
      metadata: deepFreeze({ meshRef: "forbidden" }),
    });
    const registry: NexoraDirectorSceneBindingRegistry = deepFreeze({
      registryId: "reg:render",
      bindings: Object.freeze([binding]),
    });
    const report = validateDirectorIntegration(
      { bindingRegistry: registry },
      "Strict",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some((item) => item.code === "RendererObjectForbidden"),
    );
  });

  it("21. Functions and callbacks are rejected", () => {
    const focusState = createNexoraDirectorCameraFocusState({
      now: () => NOW,
      createStateId: () => "dir-focus-state:cb",
      createCommandId: (requestId: string, type: string) =>
        `dir-focus-cmd:${requestId}:${type}`,
      createEventId: () => "dir-focus-evt:cb",
      createSnapshotId: () => "dir-focus-snap:cb",
    });
    const tainted = {
      ...focusState,
      neighborhoodSceneObjectIds: Object.freeze([]) as readonly string[],
    } as NexoraDirectorCameraFocusState & {
      onFocus?: () => void;
    };
    Object.defineProperty(tainted, "onFocus", {
      value: () => undefined,
      enumerable: true,
    });
    const report = validateDirectorIntegration(
      { focusState: Object.freeze(tainted) },
      "Strict",
      validationDeps(),
    );
    assert.equal(report.passed, false);
    assert.ok(
      report.errors.some(
        (item) =>
          item.code === "InvalidImmutability" &&
          item.message.includes("functions/callbacks"),
      ),
    );
  });

  it("22. Validation report JSON round-trip succeeds", () => {
    const { input } = makeValidFixture();
    const report = validateDirectorIntegration(
      input,
      "Standard",
      validationDeps(),
    );
    const restored = deserializeNexoraDirectorValidationReport(
      serializeNexoraDirectorValidationReport(report),
    );
    assert.deepEqual(restored, report);
  });

  it("23. Convenience domain validators scope to canonical integration API", () => {
    const { registry, synchronizationState, routingPlans, focusState } =
      makeValidFixture();
    const bindings = validateDirectorBindings(
      registry,
      "Standard",
      validationDeps(),
    );
    const sync = validateDirectorSynchronization(
      synchronizationState,
      "Standard",
      validationDeps(),
    );
    const routing = validateDirectorRouting(
      routingPlans,
      "Standard",
      validationDeps(),
    );
    const focus = validateDirectorFocus(
      focusState,
      undefined,
      "Standard",
      validationDeps(),
    );
    assert.equal(bindings.passed, true);
    assert.equal(sync.passed, true);
    assert.equal(routing.passed, true);
    assert.equal(focus.passed, true);
  });

  it("24. Snapshot and serialization validators accept valid artifacts", () => {
    const fixture = makeValidFixture();
    const integrationSnapshot = createNexoraObjectDirectorIntegrationSnapshot(
      fixture.collection,
      {
        now: () => NOW,
        createSnapshotId: () => "dir-int-snap:2",
        createPackageId: (objectId: string) => `pkg:${objectId}`,
        createCollectionId: (sceneObjectIds: readonly string[]) =>
          `col:${sceneObjectIds.join("|")}`,
        createRouteId: (sceneObjectId: string, event: string) =>
          `route:${sceneObjectId}:${event}`,
      },
    );
    const snapshots = validateDirectorSnapshots(
      { integrationSnapshot },
      "Certification",
      validationDeps(),
    );
    const serialization = validateDirectorSerialization(
      [
        {
          kind: "integrationCollection",
          payload: serializeNexoraObjectDirectorIntegrationCollection(
            fixture.collection,
          ),
        },
      ],
      "Certification",
      validationDeps(),
    );
    assert.equal(snapshots.passed, true);
    assert.equal(serialization.passed, true);
  });

  it("25. assertDirectorIntegrationInvariants throws on failure", () => {
    assert.throws(
      () =>
        assertDirectorIntegrationInvariants({
          focusState: deepFreeze({
            ...createNexoraDirectorCameraFocusState({
              now: () => NOW,
              createStateId: () => "dir-focus-state:assert",
              createCommandId: (requestId: string, type: string) =>
                `dir-focus-cmd:${requestId}:${type}`,
              createEventId: () => "dir-focus-evt:assert",
              createSnapshotId: () => "dir-focus-snap:assert",
            }),
            revision: -1,
          }),
        }),
      (error: unknown) =>
        error instanceof
        NexoraObjectDirectorIntegrationValidationException,
    );
    const { input } = makeValidFixture();
    assert.doesNotThrow(() => assertDirectorIntegrationInvariants(input));
  });

  it("26. Typecheck and ESLint smoke remain clean", () => {
    const report: NexoraDirectorValidationReport = validateDirectorIntegration(
      {},
      "Minimal",
      validationDeps(),
    );
    assert.equal(report.passed, true);
    assert.equal(report.score, 100);
    assert.match(source, /export function validateDirectorIntegration/);
    assert.match(source, /export function calculateDirectorIntegrityScore/);
    assert.equal(source.includes("eslint-disable"), false);
  });
});
