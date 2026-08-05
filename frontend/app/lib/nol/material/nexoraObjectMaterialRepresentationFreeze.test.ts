/**
 * NOL-2:8 — NexoraObject Material & Representation Freeze tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  NEXORA_MATERIAL_FROZEN_API_REGISTRY,
  NEXORA_MATERIAL_FROZEN_MODULES,
  NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS,
  NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES,
  NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
  NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
  NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
  NOL_MATERIAL_FREEZE_UPSTREAM,
  deserializeMaterialRepresentationFreezeManifest,
  getMaterialRepresentationCompatibility,
  getMaterialRepresentationManifest,
  getMaterialRepresentationRegistry,
  getMaterialRepresentationReleaseInformation,
  materialRepresentationFreeze,
  materialRepresentationFreezeIdentity,
  serializeMaterialRepresentationFreezeManifest,
  verifyMaterialRepresentationFreezeManifest,
  type NexoraObjectMaterialRepresentationFreezeManifest,
} from "./nexoraObjectMaterialRepresentationFreeze.ts";
import { materialRepresentationCertificationIdentity } from "./nexoraObjectMaterialRepresentationCertification.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectMaterialRepresentationFreeze.ts"),
  "utf8",
);

describe("NOL-2:8 NexoraObject Material & Representation Freeze", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      materialRepresentationFreezeIdentity,
      "NOL-2:8/NexoraObjectMaterialRepresentationFreeze",
    );
    assert.equal(
      materialRepresentationFreeze.identity,
      materialRepresentationFreezeIdentity,
    );
  });

  it("2. Imports only NOL-2:7.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectMaterialRepresentationCertification.ts",
    ]);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
  });

  it("3. Manifest is immutable.", () => {
    const manifest = getMaterialRepresentationManifest(
      "2026-08-04T17:05:00.000Z",
    );
    assert.ok(Object.isFrozen(manifest));
    assert.ok(Object.isFrozen(manifest.releaseStatus));
    assert.ok(Object.isFrozen(manifest.consumerMetadata));
    assert.throws(() => {
      (manifest as { publicApiCount: number }).publicApiCount = 0;
    });
  });

  it("4. Registry is immutable.", () => {
    const registry = getMaterialRepresentationRegistry();
    assert.equal(registry, NEXORA_MATERIAL_FROZEN_API_REGISTRY);
    assert.ok(Object.isFrozen(registry));
    assert.ok(Object.isFrozen(registry[0]));
    assert.throws(() => {
      (registry as unknown as { push: (v: unknown) => void }).push({});
    });
  });

  it("5. Public surface is immutable.", () => {
    assert.ok(Object.isFrozen(NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS));
    assert.ok(Object.isFrozen(NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES));
    assert.ok(Object.isFrozen(materialRepresentationFreeze));
    assert.throws(() => {
      (NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS as unknown as {
        push: (v: string) => void;
      }).push("experimental");
    });
  });

  it("6. Compatibility is immutable.", () => {
    const compatibility = getMaterialRepresentationCompatibility();
    assert.equal(
      compatibility.compatibility,
      NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
    );
    assert.equal(compatibility.immutable, true);
    assert.ok(Object.isFrozen(compatibility));
    assert.throws(() => {
      (compatibility as { compatibility: string }).compatibility = "Breaking";
    });
  });

  it("7. Release metadata is immutable.", () => {
    const release = getMaterialRepresentationReleaseInformation(
      "2026-08-04T17:05:00.000Z",
    );
    assert.ok(Object.isFrozen(release));
    assert.ok(Object.isFrozen(release.releaseStatus));
    assert.deepEqual(
      [...release.releaseStatus],
      [...NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS],
    );
    assert.throws(() => {
      (release as { readiness: string }).readiness = "Draft";
    });
  });

  it("8. Dependency lock is enforced.", () => {
    assert.deepEqual([...NOL_MATERIAL_FREEZE_UPSTREAM], [
      materialRepresentationCertificationIdentity,
    ]);
    const manifest = getMaterialRepresentationManifest();
    assert.equal(manifest.dependencyCount, 1);
    assert.deepEqual([...manifest.upstream], [
      materialRepresentationCertificationIdentity,
    ]);
    const result = verifyMaterialRepresentationFreezeManifest(manifest);
    assert.equal(result.ok, true);

    const bypassed = Object.freeze({
      ...manifest,
      upstream: Object.freeze([
        materialRepresentationCertificationIdentity,
        "NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine",
      ]),
      dependencyCount: 2,
    }) as unknown as NexoraObjectMaterialRepresentationFreezeManifest;
    const failed = verifyMaterialRepresentationFreezeManifest(bypassed);
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some(
        (error) => error.code === "MATERIAL_FREEZE_DEPENDENCY_LOCK_VIOLATION",
      ),
    );
  });

  it("9. Certification is required.", () => {
    const manifest = getMaterialRepresentationManifest();
    assert.equal(
      manifest.certificationIdentity,
      materialRepresentationCertificationIdentity,
    );
    assert.ok(manifest.certificationVersion);
    assert.ok(manifest.releaseStatus.includes("Certified"));

    const withoutCertification = Object.freeze({
      ...manifest,
      certificationIdentity:
        "" as typeof materialRepresentationCertificationIdentity,
      certificationVersion: "" as typeof manifest.certificationVersion,
      releaseStatus: Object.freeze([
        "Released",
        "Frozen",
        "Stable",
        "ReadyForConsumer",
      ]) as typeof manifest.releaseStatus,
    });
    const failed = verifyMaterialRepresentationFreezeManifest(
      withoutCertification,
      { requireCertification: true },
    );
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some(
        (error) => error.code === "MATERIAL_FREEZE_CERTIFICATION_REQUIRED",
      ),
    );
  });

  it("10. Public API registry is deterministic.", () => {
    const a = getMaterialRepresentationRegistry().map((entry) => entry.apiName);
    const b = getMaterialRepresentationRegistry().map((entry) => entry.apiName);
    assert.deepEqual(a, b);
    assert.equal(new Set(a).size, a.length);
    assert.ok(a.includes("certifyVisualization"));
    assert.ok(a.includes("verifyMaterialRepresentationFreezeManifest"));
  });

  it("11. Counts are correct.", () => {
    const manifest = getMaterialRepresentationManifest();
    assert.equal(manifest.moduleCount, NEXORA_MATERIAL_FROZEN_MODULES.length);
    assert.equal(manifest.moduleCount, 7);
    assert.equal(
      manifest.publicApiCount,
      NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    );
    assert.equal(
      manifest.exportedApiCount,
      NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
    );
    assert.equal(
      manifest.exportedTypeCount,
      NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES.length,
    );
    assert.equal(manifest.dependencyCount, 1);
  });

  it("12. Manifest verification succeeds.", () => {
    const result = verifyMaterialRepresentationFreezeManifest(
      getMaterialRepresentationManifest("2026-08-04T17:05:00.000Z"),
      { checkedAt: "2026-08-04T17:05:00.000Z" },
    );
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.checkedAt, "2026-08-04T17:05:00.000Z");
  });

  it("13. Corrupted manifest is rejected.", () => {
    const manifest = getMaterialRepresentationManifest();
    const corrupted = Object.freeze({
      ...manifest,
      identity: "NOL-2:8/Corrupted" as typeof manifest.identity,
    });
    const result = verifyMaterialRepresentationFreezeManifest(corrupted);
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some(
        (error) => error.code === "MATERIAL_FREEZE_CORRUPTED_MANIFEST",
      ),
    );
  });

  it("14. Unsupported schema is rejected.", () => {
    assert.throws(() =>
      deserializeMaterialRepresentationFreezeManifest(
        JSON.stringify({
          schemaVersion: "9.9.9",
          manifest: getMaterialRepresentationManifest(),
        }),
      ),
    );
  });

  it("15. Serialization metadata is preserved.", () => {
    const manifest = getMaterialRepresentationManifest(
      "2026-08-04T17:05:00.000Z",
    );
    const json = serializeMaterialRepresentationFreezeManifest(manifest);
    const parsed = JSON.parse(json) as {
      engineIdentity: string;
      schemaVersion: string;
      certificationIdentity: string;
      manifest: NexoraObjectMaterialRepresentationFreezeManifest;
    };
    assert.equal(parsed.engineIdentity, materialRepresentationFreezeIdentity);
    assert.equal(parsed.schemaVersion, "1.0.0");
    assert.equal(
      parsed.certificationIdentity,
      materialRepresentationCertificationIdentity,
    );
    const restored = deserializeMaterialRepresentationFreezeManifest(json);
    assert.equal(restored.identity, manifest.identity);
    assert.equal(restored.generatedAt, manifest.generatedAt);
    assert.equal(restored.publicApiCount, manifest.publicApiCount);
    assert.ok(Object.isFrozen(restored));
  });

  it("16. ReadyForConsumer flag exists.", () => {
    assert.equal(
      NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA.ReadyForConsumer,
      true,
    );
    assert.equal(
      getMaterialRepresentationReleaseInformation().readiness,
      "ReadyForConsumer",
    );
  });

  it("17. StableAPI flag exists.", () => {
    assert.equal(
      NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA.StableAPI,
      true,
    );
    assert.equal(
      getMaterialRepresentationReleaseInformation().stableApi,
      true,
    );
  });

  it("18. SoleConsumerEntryPoint flag exists.", () => {
    assert.equal(
      NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA.SoleConsumerEntryPoint,
      true,
    );
    assert.equal(
      getMaterialRepresentationReleaseInformation().soleConsumerEntryPoint,
      true,
    );
  });

  it("19. FreezeOnlyDependency flag exists.", () => {
    assert.equal(
      NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA.FreezeOnlyDependency,
      true,
    );
    assert.equal(
      getMaterialRepresentationReleaseInformation().freezeOnlyDependency,
      true,
    );
  });

  it("20. Typecheck passes.", () => {
    assert.equal(typeof getMaterialRepresentationManifest, "function");
    assert.equal(typeof verifyMaterialRepresentationFreezeManifest, "function");
  });

  it("21. ESLint passes.", () => {
    assert.equal(typeof materialRepresentationFreeze.verify, "function");
  });
});
