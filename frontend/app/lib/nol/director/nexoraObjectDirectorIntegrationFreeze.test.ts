/**
 * NOL-3:8 — NexoraObject Director Integration Freeze tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  NEXORA_DIRECTOR_FROZEN_MODULES,
  NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS,
  NOL_DIRECTOR_FREEZE_UPSTREAM,
  compareDirectorFreeze,
  createDirectorIntegrationFreezeManifest,
  deserializeDirectorFreeze,
  deserializeDirectorFreezeManifest,
  directorIntegrationCompatibility,
  directorIntegrationFreezeIdentity,
  directorIntegrationFreezeManifest,
  directorIntegrationFreezeStatus,
  directorIntegrationPublicApiRegistry,
  directorIntegrationReleaseInformation,
  getDirectorPublicApiRegistry,
  projectDirectorFreeze,
  serializeDirectorFreeze,
  serializeDirectorFreezeManifest,
  validateDirectorFreeze,
  verifyDirectorFreeze,
  type NexoraDirectorIntegrationFreezeManifest,
} from "./nexoraObjectDirectorIntegrationFreeze.ts";
import { directorIntegrationCertificationIdentity } from "./nexoraObjectDirectorIntegrationCertification.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(
  join(__dirname, "nexoraObjectDirectorIntegrationFreeze.ts"),
  "utf8",
);

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

describe("NOL-3:8 NexoraObject Director Integration Freeze", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      directorIntegrationFreezeIdentity,
      "NOL-3:8/NexoraObjectDirectorIntegrationFreeze",
    );
  });

  it("2. Imports only NOL-3:7.", () => {
    const imports = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./nexoraObjectDirectorIntegrationCertification.ts",
    ]);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.equal(
      /nexoraObjectDirectorIntegrationValidationIntegrityEngine/.test(source),
      false,
    );
  });

  it("3. Freeze manifest is immutable.", () => {
    const manifest = createDirectorIntegrationFreezeManifest(
      "2026-08-04T23:40:00.000Z",
    );
    assert.ok(isDeeplyFrozen(manifest));
    assert.ok(Object.isFrozen(directorIntegrationFreezeManifest));
    assert.throws(() => {
      (manifest as { publicApiCount: number }).publicApiCount = 0;
    });
  });

  it("4. Registry is immutable.", () => {
    const registry = getDirectorPublicApiRegistry();
    assert.equal(registry, directorIntegrationPublicApiRegistry);
    assert.ok(isDeeplyFrozen(registry));
    assert.throws(() => {
      (registry as unknown as { push: (v: unknown) => void }).push({});
    });
  });

  it("5. Release metadata is immutable.", () => {
    assert.ok(isDeeplyFrozen(directorIntegrationReleaseInformation));
    assert.equal(directorIntegrationReleaseInformation.releaseChannel, "Stable");
    assert.equal(directorIntegrationReleaseInformation.releaseStatus, "Released");
    assert.equal(
      directorIntegrationReleaseInformation.platformStatus,
      "Released · Certified · Frozen · Stable · ReadyForConsumer",
    );
    assert.equal(
      directorIntegrationReleaseInformation.consumerEntry,
      "PublicIndex",
    );
    assert.equal(directorIntegrationReleaseInformation.soleDependency, "NOL-3:7");
    assert.throws(() => {
      (directorIntegrationReleaseInformation as { releaseChannel: string })
        .releaseChannel = "Beta";
    });
  });

  it("6. Compatibility is exposed.", () => {
    assert.equal(directorIntegrationCompatibility, "BackwardCompatible");
    assert.equal(
      directorIntegrationFreezeManifest.compatibility,
      "BackwardCompatible",
    );
    assert.equal(
      directorIntegrationReleaseInformation.compatibility,
      "BackwardCompatible",
    );
  });

  it("7. Dependency lock is verified.", () => {
    assert.deepEqual([...NOL_DIRECTOR_FREEZE_UPSTREAM], [
      directorIntegrationCertificationIdentity,
    ]);
    const manifest = directorIntegrationFreezeManifest;
    assert.equal(manifest.dependencyCount, 1);
    assert.deepEqual([...manifest.dependency], [
      directorIntegrationCertificationIdentity,
    ]);
    const ok = verifyDirectorFreeze(manifest);
    assert.equal(ok.ok, true);

    const bypassed = Object.freeze({
      ...manifest,
      upstream: Object.freeze([
        directorIntegrationCertificationIdentity,
        "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
      ]),
      dependency: Object.freeze([
        directorIntegrationCertificationIdentity,
        "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
      ]),
      dependencyCount: 2,
    }) as unknown as NexoraDirectorIntegrationFreezeManifest;
    const failed = verifyDirectorFreeze(bypassed);
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some(
        (error) => error.code === "DIRECTOR_FREEZE_DEPENDENCY_LOCK_VIOLATION",
      ),
    );
  });

  it("8. Certification reference is verified.", () => {
    const manifest = directorIntegrationFreezeManifest;
    assert.equal(
      manifest.certificationIdentity,
      directorIntegrationCertificationIdentity,
    );
    assert.equal(manifest.certificationVersion, "1.0.0");
    assert.equal(manifest.certificationSchemaVersion, "1.0.0");
    const result = verifyDirectorFreeze(manifest);
    assert.equal(result.ok, true);
  });

  it("9. Public registry is derived from Certification.", () => {
    const certified = directorIntegrationPublicApiRegistry.filter(
      (entry) => entry.owningModule === "DirectorCertification",
    );
    assert.ok(certified.length > 0);
    for (const entry of certified) {
      assert.ok(
        entry.apiIdentity.startsWith(
          `${directorIntegrationCertificationIdentity}/`,
        ),
      );
      assert.equal(entry.status, "Stable");
    }
    assert.ok(
      certified.some((entry) => entry.apiName === "certifyDirectorIntegration"),
    );
  });

  it("10. Public API count is deterministic.", () => {
    const a = getDirectorPublicApiRegistry();
    const b = getDirectorPublicApiRegistry();
    assert.equal(a.length, b.length);
    assert.equal(
      directorIntegrationFreezeManifest.publicApiCount,
      a.length,
    );
    assert.equal(
      createDirectorIntegrationFreezeManifest().publicApiCount,
      a.length,
    );
  });

  it("11. Projection is immutable.", () => {
    for (const kind of [
      "Consumer",
      "Platform",
      "Diagnostics",
      "Release",
    ] as const) {
      const projection = projectDirectorFreeze(kind);
      assert.ok(isDeeplyFrozen(projection));
      assert.equal(projection.kind, kind);
      assert.throws(() => {
        (projection as { version: string }).version = "9.9.9";
      });
    }
  });

  it("12. Freeze comparison works.", () => {
    const left = createDirectorIntegrationFreezeManifest(
      "2026-08-04T23:40:00.000Z",
    );
    const right = createDirectorIntegrationFreezeManifest(
      "2026-08-04T23:41:00.000Z",
    );
    const comparison = compareDirectorFreeze(left, right);
    assert.equal(comparison.equal, true);
    assert.equal(comparison.identityMatch, true);
    assert.equal(comparison.versionMatch, true);
    assert.equal(comparison.publicApiCountDelta, 0);
    assert.ok(Object.isFrozen(comparison));
  });

  it("13. Freeze verification succeeds.", () => {
    const result = verifyDirectorFreeze(directorIntegrationFreezeManifest);
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(validateDirectorFreeze().ok, true);
  });

  it("14. Serialization round-trip succeeds.", () => {
    const serialized = serializeDirectorFreezeManifest(
      directorIntegrationFreezeManifest,
    );
    const restored = deserializeDirectorFreezeManifest(serialized);
    assert.equal(restored.identity, directorIntegrationFreezeIdentity);
    assert.equal(
      restored.publicApiCount,
      directorIntegrationFreezeManifest.publicApiCount,
    );
    const again = serializeDirectorFreeze(restored);
    const roundTrip = deserializeDirectorFreeze(again);
    assert.equal(roundTrip.schemaVersion, "1.0.0");
  });

  it("15. Unsupported schema is rejected.", () => {
    assert.throws(() => {
      deserializeDirectorFreezeManifest(
        JSON.stringify({
          identity: directorIntegrationFreezeIdentity,
          version: "1.0.0",
          schemaVersion: "9.9.9",
          manifest: directorIntegrationFreezeManifest,
        }),
      );
    });
  });

  it("16. Version lock is preserved.", () => {
    const manifest = directorIntegrationFreezeManifest;
    assert.equal(manifest.version, "1.0.0");
    assert.equal(manifest.releaseVersion, "1.0.0");
    assert.equal(manifest.schemaVersion, "1.0.0");
    const broken = Object.freeze({
      ...manifest,
      version: "2.0.0",
    }) as unknown as NexoraDirectorIntegrationFreezeManifest;
    const failed = verifyDirectorFreeze(broken);
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some(
        (error) => error.code === "DIRECTOR_FREEZE_VERSION_LOCK_VIOLATION",
      ),
    );
  });

  it("17. Status flags are exact.", () => {
    assert.deepEqual([...directorIntegrationFreezeStatus], [
      "Released",
      "Certified",
      "Frozen",
      "Stable",
      "ReadyForConsumer",
    ]);
    assert.deepEqual(
      [...directorIntegrationFreezeManifest.releaseStatus],
      [...directorIntegrationFreezeStatus],
    );
  });

  it("18. Typecheck remains clean.", () => {
    const manifest: NexoraDirectorIntegrationFreezeManifest =
      directorIntegrationFreezeManifest;
    assert.equal(typeof manifest.identity, "string");
  });

  it("19. ESLint remains clean.", () => {
    assert.equal(typeof verifyDirectorFreeze, "function");
  });

  it("20. No duplicated APIs are introduced.", () => {
    const names = directorIntegrationPublicApiRegistry.map(
      (entry) => entry.apiName,
    );
    assert.equal(new Set(names).size, names.length);
    assert.ok(
      NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS.includes(
        "certifyDirectorIntegration",
      ),
    );
    assert.equal(
      NEXORA_DIRECTOR_FROZEN_MODULES.some(
        (module) => module.name === "DirectorCertification",
      ),
      true,
    );
    // Freeze must not invent business APIs beyond freeze/certification surface.
    assert.equal(
      names.some((name) =>
        /projectNexoraObjectDirectorIntegration$|bindDirectorSceneCollection$|applyNexoraDirectorSceneSynchronization$/.test(
          name,
        ),
      ),
      false,
    );
  });
});
