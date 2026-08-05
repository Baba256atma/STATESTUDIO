/**
 * NOL-3:7 — NexoraObject Director Integration Certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bindDirectorSceneCollection,
  createInteractionRoutingPlan,
  createNexoraDirectorCameraFocusSnapshot,
  createNexoraDirectorCameraFocusState,
  createNexoraDirectorSceneObjectId,
  createNexoraDirectorSceneSynchronizationSnapshot,
  createNexoraDirectorSceneSynchronizationState,
  createNexoraObjectDirectorIntegrationSnapshot,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  serializeNexoraDirectorCameraFocusState,
  serializeNexoraObjectDirectorIntegrationCollection,
  type NexoraDirectorCameraFocusState,
  type NexoraDirectorFocusStack,
  type NexoraDirectorInteractionRoutingContext,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorCameraFocusCoordinationEngine.ts";
import {
  validateDirectorIntegration,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
  nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
  nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
  type NexoraDirectorIntegrationValidationInput,
  type NexoraDirectorValidationDependencies,
  type NexoraDirectorValidationProfile,
  type NexoraDirectorValidationReport,
} from "./nexoraObjectDirectorIntegrationValidationIntegrityEngine.ts";
import {
  assertDirectorCertificationInvariants,
  certifyDirectorIntegration,
  compareDirectorCertifications,
  deserializeDirectorCertification,
  deserializeDirectorCertificationReport,
  directorIntegrationCertificationIdentity,
  directorIntegrationCertificationSchemaVersion,
  directorIntegrationCertificationVersion,
  expireDirectorCertification,
  NexoraDirectorIntegrationCertificationException,
  NOL_DIRECTOR_CERTIFICATION_UPSTREAM,
  projectDirectorCertification,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  serializeDirectorCertification,
  serializeDirectorCertificationReport,
  type NexoraDirectorCertificationDependencies,
  type NexoraDirectorCertificationProfile,
  type NexoraDirectorCertificationReport,
} from "./nexoraObjectDirectorIntegrationCertification.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorIntegrationCertification.ts"),
  "utf8",
);

const NOW = "2026-08-04T23:00:00.000Z";

function certificationDeps(): NexoraDirectorCertificationDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => NOW,
    createReportId: () => {
      seq += 1;
      return `dir-cert-report:${seq}`;
    },
    createCertificationId: () => {
      seq += 1;
      return `dir-cert:${seq}`;
    },
  });
}

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

function makePkg(objectId: string): NexoraObjectDirectorIntegrationPackage {
  const sceneObjectId = createNexoraDirectorSceneObjectId(objectId);
  return deepFreeze({
    packageId: `pkg:${objectId}`,
    packageVersion: "1.0.0",
    objectId,
    sceneObject: deepFreeze({
      sceneObjectId,
      objectId,
      objectType: "Goal",
      representationState: "Report" as const,
      renderingLevel: "Normal" as const,
      visible: true,
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
      enabled: true,
      interactionState: "Idle" as const,
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
      renderingLevel: "Normal" as const,
      renderingPriority: 1,
      layer: "Normal" as const,
      dimmed: false,
      visible: true,
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
    collectionId: "col:cert",
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
  readonly input: NexoraDirectorIntegrationValidationInput;
  readonly certificationInput: NexoraDirectorIntegrationValidationInput;
} {
  const a = makePkg("obj-a");
  const b = makePkg("obj-b");
  const collection = makeCollection([a, b]);
  const registry = bindDirectorSceneCollection(collection, undefined, {
    now: () => NOW,
    createBindingId: (objectId: string) => `nexora-binding:${objectId}`,
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
  }) as NexoraDirectorCameraFocusState;
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

  const integrationSnapshot = createNexoraObjectDirectorIntegrationSnapshot(
    collection,
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
      synchronizationState,
      collection,
      registry,
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
    focusState,
    focusStack,
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
      payload: serializeNexoraObjectDirectorIntegrationCollection(collection),
    }),
    deepFreeze({
      kind: "focusState",
      payload: serializeNexoraDirectorCameraFocusState(focusState),
    }),
  ]);
  const certificationInput: NexoraDirectorIntegrationValidationInput =
    deepFreeze({
      ...input,
      integrationSnapshot,
      synchronizationSnapshot,
      focusSnapshot,
      serializedArtifacts,
    });

  return { input, certificationInput };
}

function makeSyntheticValidationReport(
  overrides: {
    readonly passed?: boolean;
    readonly score?: number;
    readonly profile?: NexoraDirectorValidationProfile;
    readonly reportId?: string;
  } = {},
): NexoraDirectorValidationReport {
  return deepFreeze({
    reportId: overrides.reportId ?? "dir-val-report:synthetic",
    profile: overrides.profile ?? "Certification",
    score: overrides.score ?? 100,
    passed: overrides.passed ?? true,
    warnings: Object.freeze([]),
    errors: Object.freeze([]),
    repairSuggestions: Object.freeze([]),
    validatedSections: Object.freeze(["Identity", "Version"]),
    domainResults: deepFreeze({}),
    validationDurationMs: 0,
    createdAt: NOW,
    metadata: deepFreeze({
      engineIdentity:
        nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
      engineVersion:
        nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
      schemaVersion:
        nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
    }),
  });
}

function certifyProfile(
  profile: NexoraDirectorCertificationProfile,
  useCertificationInput = profile === "Platform" || profile === "Release",
): NexoraDirectorCertificationReport {
  const { input, certificationInput } = makeValidFixture();
  return certifyDirectorIntegration(
    {
      profile,
      input: useCertificationInput ? certificationInput : input,
      certifiedBy: "test-suite",
    },
    certificationDeps(),
  );
}

describe("NOL-3:7 NexoraObject Director Integration Certification", () => {
  it("1. Certification identity is exact", () => {
    assert.equal(
      directorIntegrationCertificationIdentity,
      "NOL-3:7/NexoraObjectDirectorIntegrationCertification",
    );
    assert.equal(directorIntegrationCertificationVersion, "1.0.0");
    assert.equal(directorIntegrationCertificationSchemaVersion, "1.0.0");
    assert.deepEqual([...NOL_DIRECTOR_CERTIFICATION_UPSTREAM], [
      nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
    ]);
  });

  it("2. Production imports are limited to NOL-3:6 validation engine", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.equal(imports.length, 1);
    assert.equal(
      imports[0],
      "./nexoraObjectDirectorIntegrationValidationIntegrityEngine.ts",
    );
  });

  it("3. Development certification succeeds", () => {
    const report = certifyProfile("Development");
    assert.equal(report.accepted, true);
    assert.equal(report.status, "Certified");
    assert.equal(report.profile, "Development");
    assert.ok(report.stamp);
    assert.ok(report.validationReport.score >= 60);
  });

  it("4. Testing certification succeeds", () => {
    const report = certifyProfile("Testing");
    assert.equal(report.accepted, true);
    assert.equal(report.status, "Certified");
    assert.equal(report.profile, "Testing");
    assert.ok(report.validationReport.score >= 75);
  });

  it("5. Production certification succeeds", () => {
    const report = certifyProfile("Production");
    assert.equal(report.accepted, true);
    assert.equal(report.status, "Certified");
    assert.equal(report.profile, "Production");
    assert.ok(report.validationReport.score >= 85);
  });

  it("6. Platform certification succeeds", () => {
    const report = certifyProfile("Platform");
    assert.equal(report.accepted, true);
    assert.equal(report.status, "Certified");
    assert.equal(report.profile, "Platform");
    assert.equal(report.validationReport.profile, "Certification");
    assert.ok(report.validationReport.score >= 90);
  });

  it("7. Release certification succeeds", () => {
    const report = certifyProfile("Release");
    assert.equal(report.accepted, true);
    assert.equal(report.status, "Certified");
    assert.equal(report.profile, "Release");
    assert.ok(report.validationReport.score >= 95);
  });

  it("8. Threshold policy enforced (score too low rejects)", () => {
    const lowScoreReport = makeSyntheticValidationReport({
      passed: true,
      score: 50,
      profile: "Certification",
    });
    const report = certifyDirectorIntegration(
      {
        profile: "Production",
        validationReport: lowScoreReport,
        certifiedBy: "policy-test",
      },
      certificationDeps(),
    );
    assert.equal(report.accepted, false);
    assert.ok(
      report.errors.some((item) => item.code === "DIRECTOR_CERT_SCORE_TOO_LOW"),
    );
    assert.equal(report.stamp, undefined);
  });

  it("9. Validation failure rejects certification", () => {
    const failedReport = makeSyntheticValidationReport({
      passed: false,
      score: 100,
      profile: "Certification",
    });
    const report = certifyDirectorIntegration(
      {
        profile: "Development",
        validationReport: failedReport,
        certifiedBy: "policy-test",
      },
      certificationDeps(),
    );
    assert.equal(report.accepted, false);
    assert.ok(
      report.errors.some(
        (item) => item.code === "DIRECTOR_CERT_VALIDATION_FAILED",
      ),
    );
  });

  it("10. Recertification creates new stamp", () => {
    const initial = certifyProfile("Development");
    const initialStampId = initial.stamp!.certificationId;
    const nextValidation = validateDirectorIntegration(
      makeValidFixture().input,
      "Standard",
      validationDeps(),
    );
    const recertified = recertifyDirectorIntegration(
      initial,
      {
        profile: "Development",
        validationReport: nextValidation,
        certifiedBy: "recert-test",
      },
      certificationDeps(),
    );
    assert.equal(recertified.accepted, true);
    assert.ok(recertified.stamp);
    assert.notEqual(recertified.stamp!.certificationId, initialStampId);
    assert.equal(recertified.history.length, initial.history.length + 1);
  });

  it("11. History is append-only", () => {
    const first = certifyProfile("Testing");
    const historyAfterFirst = first.history.length;
    const second = recertifyDirectorIntegration(
      first,
      {
        profile: "Testing",
        validationReport: first.validationReport,
        certifiedBy: "history-test",
      },
      certificationDeps(),
    );
    assert.equal(second.history.length, historyAfterFirst + 1);
    assert.deepEqual(
      second.history.slice(0, historyAfterFirst),
      first.history,
    );
  });

  it("12. Revocation preserves history", () => {
    const certified = certifyProfile("Production");
    const historyBefore = certified.history.length;
    const revoked = revokeDirectorCertification(
      certified,
      "manual revocation",
      certificationDeps(),
    );
    assert.equal(revoked.status, "Revoked");
    assert.equal(revoked.history.length, historyBefore + 1);
    assert.deepEqual(
      revoked.history.slice(0, historyBefore),
      certified.history,
    );
    assert.equal(revoked.stamp?.status, "Revoked");
  });

  it("13. Expiration preserves history", () => {
    const certified = certifyProfile("Testing");
    const historyBefore = certified.history.length;
    const expired = expireDirectorCertification(certified, certificationDeps());
    assert.equal(expired.status, "Expired");
    assert.equal(expired.history.length, historyBefore + 1);
    assert.deepEqual(
      expired.history.slice(0, historyBefore),
      certified.history,
    );
    assert.equal(expired.stamp?.status, "Expired");
  });

  it("14. Comparison works", () => {
    const a = certifyProfile("Development");
    const b = certifyProfile("Production", false);
    const comparison = compareDirectorCertifications(a, b);
    assert.equal(comparison.sameProfile, false);
    assert.equal(comparison.previousStatus, a.status);
    assert.equal(comparison.nextStatus, b.status);
    assert.equal(typeof comparison.integrityScoreDelta, "number");
    const again = compareDirectorCertifications(a, b);
    assert.deepEqual(again, comparison);
  });

  it("15. Projection is immutable", () => {
    const report = certifyProfile("Platform");
    const consumer = projectDirectorCertification(
      report,
      "Consumer",
      certificationDeps(),
    );
    const platform = projectDirectorCertification(
      report,
      "Platform",
      certificationDeps(),
    );
    const diagnostics = projectDirectorCertification(
      report,
      "Diagnostics",
      certificationDeps(),
    );
    assert.ok(isDeeplyFrozen(consumer));
    assert.ok(isDeeplyFrozen(platform));
    assert.ok(isDeeplyFrozen(diagnostics));
    assert.equal(consumer.kind, "Consumer");
    assert.equal(platform.kind, "Platform");
    assert.equal(diagnostics.kind, "Diagnostics");
    assert.ok(consumer.stampSummary);
    assert.equal(platform.integrityScore, report.validationReport.score);
  });

  it("16. Serialization round-trip succeeds", () => {
    const report = certifyProfile("Release");
    assert.ok(report.stamp);
    const stampJson = serializeDirectorCertification(report.stamp!);
    const restoredStamp = deserializeDirectorCertification(stampJson);
    assert.deepEqual(restoredStamp, report.stamp);

    const reportJson = serializeDirectorCertificationReport(report);
    const restoredReport = deserializeDirectorCertificationReport(reportJson);
    assert.equal(restoredReport.reportId, report.reportId);
    assert.equal(restoredReport.status, report.status);
    assert.equal(
      restoredReport.validationReport.reportId,
      report.validationReport.reportId,
    );
    assert.deepEqual(restoredReport.stamp, report.stamp);
  });

  it("17. Unsupported schema rejected", () => {
    assert.throws(
      () =>
        deserializeDirectorCertification(
          JSON.stringify({
            identity: directorIntegrationCertificationIdentity,
            version: directorIntegrationCertificationVersion,
            schemaVersion: "9.9.9",
            kind: "certificationStamp",
            stamp: {},
          }),
        ),
      (error: unknown) =>
        error instanceof NexoraDirectorIntegrationCertificationException &&
        error.code === "DIRECTOR_CERT_UNSUPPORTED_VERSION",
    );
    assert.throws(
      () =>
        deserializeDirectorCertificationReport(
          JSON.stringify({
            identity: directorIntegrationCertificationIdentity,
            version: directorIntegrationCertificationVersion,
            schemaVersion: "9.9.9",
            kind: "certificationReport",
            report: {},
          }),
        ),
      (error: unknown) =>
        error instanceof NexoraDirectorIntegrationCertificationException &&
        error.code === "DIRECTOR_CERT_UNSUPPORTED_VERSION",
    );
  });

  it("18. Immutable outputs", () => {
    const report = certifyProfile("Development");
    assert.ok(isDeeplyFrozen(report));
    assert.ok(isDeeplyFrozen(report.history));
    assert.ok(isDeeplyFrozen(report.warnings));
    assert.ok(isDeeplyFrozen(report.errors));
    if (report.stamp) assert.ok(isDeeplyFrozen(report.stamp));
    assert.doesNotThrow(() => assertDirectorCertificationInvariants(report));
  });

  it("19. Typecheck clean (smoke)", () => {
    const report: NexoraDirectorCertificationReport = certifyProfile(
      "Development",
    );
    assert.equal(report.accepted, true);
    assert.match(source, /export function certifyDirectorIntegration/);
    assert.match(source, /export function evaluateDirectorCertificationPolicy/);
  });

  it("20. ESLint clean (smoke)", () => {
    assert.equal(source.includes("eslint-disable"), false);
    const release = certifyProfile("Release");
    const releaseProjection = projectDirectorCertification(
      release,
      "Release",
      certificationDeps(),
    );
    assert.equal(releaseProjection.kind, "Release");
    assert.equal(releaseProjection.rejected, false);
    assert.ok(releaseProjection.certificationId);
  });
});
