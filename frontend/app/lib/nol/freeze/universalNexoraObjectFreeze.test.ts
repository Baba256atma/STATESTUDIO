/**
 * NOL-1:8 — Universal NexoraObject Freeze tests.
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
import { resetNexoraObjectGraphStoreForTests } from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";
import { resetNexoraValidationStoreForTests } from "../validation/universalNexoraObjectValidationIntegrityEngine.ts";
import { resetNexoraCertificationStoreForTests } from "../certification/universalNexoraObjectCertification.ts";
import {
  NEXORA_FROZEN_API_REGISTRY,
  NEXORA_FROZEN_MODULES,
  NEXORA_FROZEN_PUBLIC_EXPORTS,
  createFreezeManifest,
  deserializeFreezeManifest,
  freezeIdentity,
  freezeVersion,
  getFrozenApiRegistry,
  getFrozenReleaseMetadata,
  projectFreezeManifest,
  serializeFreezeManifest,
  verifyFreezeCompatibility,
  verifyFreezeDependencies,
  verifyFreezeIntegrity,
} from "./universalNexoraObjectFreeze.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeObject(id: string) {
  const object = createNexoraObjectContract({
    id,
    type: "Decision",
    caption: `Object ${id}`,
    createdAt: "2026-08-04T16:30:00.000Z",
  });
  object.setLifecycle("Active");
  hydrateNexoraObjectRuntimeState(object, undefined, {
    updatedAt: "2026-08-04T16:30:00.000Z",
  });
  return object;
}

describe("NOL-1:8 Universal NexoraObject Freeze", () => {
  beforeEach(() => {
    resetNexoraObjectRuntimeStoreForTests();
    resetNexoraObjectStateTransitionStoreForTests();
    resetNexoraObjectGraphStoreForTests();
    resetNexoraValidationStoreForTests();
    resetNexoraCertificationStoreForTests();
  });

  it("1. Freeze manifest is created", () => {
    const manifest = createFreezeManifest("2026-08-04T16:30:00.000Z");
    assert.equal(manifest.freezeIdentity, freezeIdentity);
    assert.equal(manifest.freezeVersion, freezeVersion);
    assert.equal(manifest.createdAt, "2026-08-04T16:30:00.000Z");
    assert.ok(manifest.publicApiCount > 0);
  });

  it("2. Freeze manifest is immutable", () => {
    const manifest = createFreezeManifest("2026-08-04T16:30:00.000Z");
    assert.throws(() => {
      (manifest as { publicApiCount: number }).publicApiCount = 0;
    });
    assert.throws(() => {
      (manifest.frozenModules as unknown as { push: (v: unknown) => void }).push(
        {},
      );
    });
  });

  it("3. Exactly seven modules are frozen", () => {
    assert.equal(NEXORA_FROZEN_MODULES.length, 7);
    assert.deepEqual(
      NEXORA_FROZEN_MODULES.map((m) => m.name),
      [
        "Foundation",
        "Contract",
        "Runtime",
        "StateTransition",
        "Relationship",
        "Validation",
        "Certification",
      ],
    );
    const manifest = createFreezeManifest();
    assert.equal(manifest.frozenModules.length, 7);
  });

  it("4. API registry is deterministic", () => {
    const a = getFrozenApiRegistry().map((e) => e.apiName);
    const b = getFrozenApiRegistry().map((e) => e.apiName);
    assert.deepEqual(a, b);
    assert.deepEqual(
      a,
      NEXORA_FROZEN_API_REGISTRY.map((e) => e.apiName),
    );
    assert.ok(a.every((name, index) => name === b[index]));
  });

  it("5. Public export count is stable", () => {
    const manifest = createFreezeManifest();
    assert.equal(manifest.publicExportCount, NEXORA_FROZEN_PUBLIC_EXPORTS.length);
    assert.equal(
      createFreezeManifest().publicExportCount,
      manifest.publicExportCount,
    );
    assert.ok(manifest.publicExportCount >= manifest.publicApiCount);
  });

  it("6. Dependency verification succeeds", () => {
    const result = verifyFreezeDependencies();
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
  });

  it("7. Forbidden dependency is rejected", () => {
    const result = verifyFreezeDependencies([
      { from: "Runtime", to: "Director" },
      { from: "Validation", to: "react" },
    ]);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "FREEZE_FORBIDDEN_DEPENDENCY"),
    );
  });

  it("8. Cyclic dependency is rejected", () => {
    const result = verifyFreezeDependencies([
      { from: "Runtime", to: "Contract" },
      { from: "Contract", to: "Runtime" },
    ]);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "FREEZE_CYCLIC_DEPENDENCY"),
    );
  });

  it("9. Version compatibility is verified", () => {
    const result = verifyFreezeCompatibility(createFreezeManifest());
    assert.equal(result.ok, true);
    const manifest = createFreezeManifest();
    assert.equal(manifest.dependencyVersions.foundation, "1.0.0");
    assert.equal(manifest.dependencyVersions.certification, "1.0.0");
  });

  it("10. Schema versions are recorded", () => {
    const manifest = createFreezeManifest();
    assert.equal(manifest.schemaVersions.objectSchema, "1.0.0");
    assert.equal(manifest.schemaVersions.runtimeSchema, "1.0.0");
    assert.equal(manifest.schemaVersions.stateSchema, "1.0.0");
    assert.equal(manifest.schemaVersions.relationshipSchema, "1.0.0");
    assert.equal(manifest.schemaVersions.validationSchema, "1.0.0");
    assert.equal(manifest.schemaVersions.certificationSchema, "1.0.0");
  });

  it("11. Freeze delegates to Validation", () => {
    const object = makeObject("f11");
    object.setVisualization({ opacity: Number.NaN });
    const failed = verifyFreezeIntegrity({
      object,
      certificationProfile: "Development",
      requestedBy: "freeze-test",
      now: () => "2026-08-04T16:30:00.000Z",
    });
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some((e) => e.code === "FREEZE_VALIDATION_FAILED"),
    );
    assert.ok(
      failed.errors.some(
        (e) => e.details?.delegatedTo?.toString().includes("NOL-1:6"),
      ),
    );
  });

  it("12. Freeze delegates to Certification", () => {
    const object = makeObject("f12");
    object.setExecutive({ importance: 999 });
    const result = verifyFreezeIntegrity({
      object,
      certificationProfile: "Platform",
      requestedBy: "freeze-test",
      now: () => "2026-08-04T16:30:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "FREEZE_CERTIFICATION_FAILED") ||
        result.errors.some((e) => e.code === "FREEZE_VALIDATION_FAILED"),
    );
  });

  it("13. Failed certification rejects Freeze", () => {
    const object = makeObject("f13");
    object.addRelationship({
      id: "ext-1",
      kind: "related_to",
      toId: "outside",
      createdAt: "2026-08-04T16:30:00.000Z",
    });
    const result = verifyFreezeIntegrity({
      object,
      certificationProfile: "Release",
      requestedBy: "freeze-test",
      now: () => "2026-08-04T16:30:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some(
        (e) =>
          e.code === "FREEZE_CERTIFICATION_FAILED" ||
          e.code === "FREEZE_VALIDATION_FAILED",
      ),
    );
  });

  it("14. Compatibility metadata is correct", () => {
    const manifest = createFreezeManifest();
    assert.equal(manifest.compatibility, "BackwardCompatible");
    assert.equal(manifest.compatibilityVersion, "1.0.0");
    const projection = projectFreezeManifest();
    assert.equal(
      projection.compatibilitySummary.compatibility,
      "BackwardCompatible",
    );
    assert.equal(projection.compatibilitySummary.readyForConsumer, true);
  });

  it("15. Release metadata is immutable", () => {
    const metadata = getFrozenReleaseMetadata("2026-08-04T16:30:00.000Z");
    assert.throws(() => {
      (metadata as { readiness: string }).readiness = "Draft";
    });
    assert.deepEqual([...metadata.releaseStages], [
      "Released",
      "Certified",
      "Frozen",
      "Stable",
      "ReadyForConsumer",
    ]);
  });

  it("16. Freeze serialization is reversible", () => {
    const manifest = createFreezeManifest("2026-08-04T16:30:00.000Z");
    const json = serializeFreezeManifest(manifest);
    const restored = deserializeFreezeManifest(json);
    assert.equal(restored.freezeIdentity, manifest.freezeIdentity);
    assert.equal(restored.publicApiCount, manifest.publicApiCount);
    assert.equal(restored.frozenModules.length, 7);
    assert.equal(restored.compatibility, "BackwardCompatible");
  });

  it("17. Registry projection hides internal members", () => {
    const projection = projectFreezeManifest();
    const keys = Object.keys(projection);
    assert.deepEqual(keys.sort(), [
      "compatibilitySummary",
      "manifest",
      "registry",
      "releaseMetadata",
    ]);
    assert.equal("policies" in projection, false);
    assert.equal("validateNexoraObject" in projection, false);
    assert.equal("certifyNexoraObject" in projection, false);
    for (const entry of projection.registry) {
      assert.equal(entry.stability, "Stable");
      assert.equal(entry.visibility, "Public");
    }
  });

  it("18. Engine imports only NOL-1:1 through NOL-1:7", () => {
    const source = readFileSync(
      join(__dirname, "universalNexoraObjectFreeze.ts"),
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
          spec.includes("/state/") ||
          spec.includes("/relationship/") ||
          spec.includes("/validation/") ||
          spec.includes("/certification/"),
        `Unexpected import: ${spec}`,
      );
    }
    assert.equal(source.includes("from \"react\""), false);
    assert.equal(source.includes("next/"), false);
  });

  it("19. Freeze identity matches specification", () => {
    assert.equal(freezeIdentity, "NOL-1:8/UniversalNexoraObjectFreeze");
    assert.equal(
      createFreezeManifest().freezeIdentity,
      "NOL-1:8/UniversalNexoraObjectFreeze",
    );
  });

  it("20. Freeze is marked ReadyForConsumer", () => {
    const metadata = getFrozenReleaseMetadata();
    assert.equal(metadata.readiness, "ReadyForConsumer");
    assert.ok(metadata.releaseStages.includes("ReadyForConsumer"));
    assert.ok(metadata.releaseStages.includes("Frozen"));
    assert.ok(metadata.releaseStages.includes("Certified"));
    assert.ok(metadata.releaseStages.includes("Released"));
    assert.ok(metadata.releaseStages.includes("Stable"));
    const projection = projectFreezeManifest();
    assert.equal(projection.compatibilitySummary.readyForConsumer, true);
  });
});
