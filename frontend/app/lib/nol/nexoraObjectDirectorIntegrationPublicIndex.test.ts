/**
 * NOL-3:9 — NexoraObject Director Integration Public Index tests.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  directorIntegrationPublicApiRegistry,
  directorIntegrationFreezeIdentity,
  getDirectorPublicApiRegistry,
} from "./director/nexoraObjectDirectorIntegrationFreeze.ts";
import {
  DIRECTOR_INTEGRATION_CONSUMER_RULES,
  DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS,
  directorIntegrationCompatibility,
  directorIntegrationPublicIndexIdentity,
  directorIntegrationPublicIndexUpstream,
  directorIntegrationRegistry,
  directorIntegrationReleaseInformation,
  nexoraObjectDirectorIntegrationPublicIndex,
  deserializeDirectorIntegrationPublicIndex,
  serializeDirectorIntegrationPublicIndex,
  validateDirectorIntegrationPublicIndex,
  verifyDirectorIntegrationConsumerEntry,
} from "./nexoraObjectDirectorIntegrationPublicIndex.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicIndexPath = join(
  __dirname,
  "nexoraObjectDirectorIntegrationPublicIndex.ts",
);
const publicIndexTestPath = join(
  __dirname,
  "nexoraObjectDirectorIntegrationPublicIndex.test.ts",
);
const packageJsonPath = join(__dirname, "../../../package.json");
const source = readFileSync(publicIndexPath, "utf8");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  scripts: Record<string, string>;
};

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

describe("NOL-3:9 NexoraObject Director Integration Public Index", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      directorIntegrationPublicIndexIdentity,
      "NOL-3:9/NexoraObjectDirectorIntegrationPublicIndex",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.identity.publicIndexIdentity,
      directorIntegrationPublicIndexIdentity,
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.identity.version,
      "1.0.0",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.identity.schemaVersion,
      "1.0.0",
    );
  });

  it("2. Imports only NOL-3:8.", () => {
    const imports = [
      ...source.matchAll(/^\s*import[\s\S]*?from\s+"([^"]+)"/gm),
    ].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./director/nexoraObjectDirectorIntegrationFreeze.ts",
    ]);
    assert.equal(imports.length, 1);
  });

  it("3. Exactly one production dependency.", () => {
    assert.equal(
      directorIntegrationPublicIndexUpstream,
      directorIntegrationFreezeIdentity,
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.identity.upstreamIdentity,
      "NOL-3:8/NexoraObjectDirectorIntegrationFreeze",
    );
    const imports = [
      ...source.matchAll(/^\s*import[\s\S]*?from\s+"([^"]+)"/gm),
    ];
    assert.equal(imports.length, 1);
  });

  it("4. Exactly two files exist.", () => {
    assert.equal(existsSync(publicIndexPath), true);
    assert.equal(existsSync(publicIndexTestPath), true);
    assert.equal(
      existsSync(
        join(__dirname, "nexoraObjectDirectorIntegrationPublicIndex.index.ts"),
      ),
      false,
    );
  });

  it("5. Exactly nine namespace sections exist.", () => {
    assert.equal(DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS.length, 9);
    assert.equal(
      Object.keys(nexoraObjectDirectorIntegrationPublicIndex).length,
      9,
    );
  });

  it("6. Namespace order is correct.", () => {
    assert.deepEqual([...DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS], [
      "Identity",
      "Public Types",
      "Public APIs",
      "Validation",
      "Certification",
      "Release Information",
      "Compatibility",
      "Registry",
      "Consumer Information",
    ]);
    assert.deepEqual(
      Object.keys(nexoraObjectDirectorIntegrationPublicIndex),
      [
        "identity",
        "publicTypes",
        "publicApis",
        "validation",
        "certification",
        "releaseInformation",
        "compatibility",
        "registry",
        "consumerInformation",
      ],
    );
  });

  it("7. Public Index is the sole consumer entry.", () => {
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.consumerInformation
        .SoleConsumerEntryPoint,
      true,
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.consumerInformation.importPath,
      "@/app/lib/nol/nexoraObjectDirectorIntegrationPublicIndex",
    );
    const result = verifyDirectorIntegrationConsumerEntry({
      supportedConsumerEntries: [
        "@/app/lib/nol/nexoraObjectDirectorIntegrationPublicIndex",
      ],
    });
    assert.equal(result.ok, true);
  });

  it("8. Freeze-only dependency rule is enforced.", () => {
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.consumerInformation
        .FreezeOnlyDependency,
      true,
    );
    const failed = verifyDirectorIntegrationConsumerEntry({
      upstream: "NOL-3:7/NexoraObjectDirectorIntegrationCertification",
    });
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some((error) => error.code === "PUBLIC_INDEX_UPSTREAM"),
    );
    const bypass = verifyDirectorIntegrationConsumerEntry({
      upstream: "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
    });
    assert.equal(bypass.ok, false);
    assert.ok(
      bypass.errors.some((error) => error.code === "PUBLIC_INDEX_UPSTREAM"),
    );
  });

  it("9. Registry is immutable.", () => {
    assert.ok(Object.isFrozen(directorIntegrationRegistry));
    assert.ok(Object.isFrozen(directorIntegrationRegistry[0]));
    assert.throws(() => {
      (
        directorIntegrationRegistry as unknown as {
          push: (v: unknown) => void;
        }
      ).push({});
    });
  });

  it("10. Release metadata is immutable.", () => {
    assert.ok(Object.isFrozen(directorIntegrationReleaseInformation));
    assert.equal(directorIntegrationReleaseInformation.releaseChannel, "Stable");
    assert.equal(
      directorIntegrationReleaseInformation.releaseStatus,
      "Released",
    );
    assert.equal(
      directorIntegrationReleaseInformation.platformStatus,
      "Released · Certified · Frozen · Stable · ReadyForConsumer",
    );
    assert.equal(
      directorIntegrationReleaseInformation.consumerEntry,
      "PublicIndex",
    );
    assert.throws(() => {
      (
        directorIntegrationReleaseInformation as { releaseChannel: string }
      ).releaseChannel = "Beta";
    });
  });

  it("11. Compatibility is BackwardCompatible and immutable.", () => {
    assert.ok(
      Object.isFrozen(
        nexoraObjectDirectorIntegrationPublicIndex.compatibility,
      ),
    );
    assert.equal(directorIntegrationCompatibility, "BackwardCompatible");
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.compatibility.compatibility,
      "BackwardCompatible",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.compatibility.immutable,
      true,
    );
    assert.throws(() => {
      (
        nexoraObjectDirectorIntegrationPublicIndex.compatibility as {
          compatibility: string;
        }
      ).compatibility = "Breaking";
    });
  });

  it("12. Public APIs are re-exported only.", () => {
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.publicApis
        .certifyDirectorIntegration,
      nexoraObjectDirectorIntegrationPublicIndex.certification
        .certifyDirectorIntegration,
    );
    assert.equal(
      typeof nexoraObjectDirectorIntegrationPublicIndex.publicApis
        .getDirectorPublicApiRegistry,
      "function",
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.publicApis.verifyDirectorFreeze,
      nexoraObjectDirectorIntegrationPublicIndex.validation.verifyDirectorFreeze,
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.publicApis
        .NexoraObjectDirectorIntegrationFreeze,
      nexoraObjectDirectorIntegrationPublicIndex.publicApis
        .NexoraObjectDirectorIntegrationFreeze,
    );
  });

  it("13. No implementation logic exists.", () => {
    assert.equal(/projectDirectorSceneBinding\s*\(/.test(source), false);
    assert.equal(/applyNexoraDirectorSceneSynchronization\s*\(/.test(source), false);
    assert.equal(/routeDirectorInteraction\s*\(/.test(source), false);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.match(source, /no new engine logic/i);
  });

  it("14. Public API count matches Freeze.", () => {
    const registry = getDirectorPublicApiRegistry();
    assert.equal(registry, directorIntegrationPublicApiRegistry);
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.registry.publicApiCount,
      registry.length,
    );
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.registry.registry,
      directorIntegrationPublicApiRegistry,
    );
  });

  it("15. Consumer verification succeeds.", () => {
    const result = verifyDirectorIntegrationConsumerEntry({
      now: () => "2026-08-05T15:15:00.000Z",
    });
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.checkedAt, "2026-08-05T15:15:00.000Z");
    const validated = validateDirectorIntegrationPublicIndex();
    assert.equal(validated.ok, true);
  });

  it("16. Public Index is deeply immutable.", () => {
    assert.ok(Object.isFrozen(nexoraObjectDirectorIntegrationPublicIndex));
    assert.ok(
      Object.isFrozen(nexoraObjectDirectorIntegrationPublicIndex.identity),
    );
    assert.ok(
      Object.isFrozen(
        nexoraObjectDirectorIntegrationPublicIndex.consumerInformation,
      ),
    );
    assert.ok(isDeeplyFrozen(nexoraObjectDirectorIntegrationPublicIndex));
    assert.throws(() => {
      (
        nexoraObjectDirectorIntegrationPublicIndex as {
          identity: unknown;
        }
      ).identity = {};
    });
  });

  it("17. Serialization round-trip works.", () => {
    const serialized = serializeDirectorIntegrationPublicIndex();
    const restored = deserializeDirectorIntegrationPublicIndex(serialized);
    assert.equal(
      restored.identity.publicIndexIdentity,
      directorIntegrationPublicIndexIdentity,
    );
    assert.equal(restored.compatibility, "BackwardCompatible");
    assert.equal(restored.registryApiNames.length, directorIntegrationRegistry.length);
    assert.equal(restored.namespaceSections.length, 9);
    assert.equal(restored.consumerRules.length, 8);
    const again = deserializeDirectorIntegrationPublicIndex(
      serializeDirectorIntegrationPublicIndex(),
    );
    assert.equal(again.freezeManifest.identity, directorIntegrationFreezeIdentity);
  });

  it("18. Unsupported schema is rejected.", () => {
    const serialized = serializeDirectorIntegrationPublicIndex();
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    parsed.schemaVersion = "9.9.9";
    assert.throws(() => {
      deserializeDirectorIntegrationPublicIndex(JSON.stringify(parsed));
    });
    const importResult = verifyDirectorIntegrationConsumerEntry({
      imports: ['import { x } from "react"'],
    });
    assert.equal(importResult.ok, false);
    assert.ok(
      importResult.errors.some((error) => error.code === "PUBLIC_INDEX_IMPORT"),
    );
  });

  it("19. Consumer rules length is eight.", () => {
    assert.equal(DIRECTOR_INTEGRATION_CONSUMER_RULES.length, 8);
    assert.equal(
      nexoraObjectDirectorIntegrationPublicIndex.consumerInformation.rules
        .length,
      8,
    );
    assert.deepEqual(
      [...nexoraObjectDirectorIntegrationPublicIndex.consumerInformation.rules],
      [...DIRECTOR_INTEGRATION_CONSUMER_RULES],
    );
  });

  it("20. Typecheck passes.", () => {
    assert.equal(
      typeof verifyDirectorIntegrationConsumerEntry,
      "function",
    );
    assert.equal(
      typeof serializeDirectorIntegrationPublicIndex,
      "function",
    );
    assert.equal(
      typeof deserializeDirectorIntegrationPublicIndex,
      "function",
    );
    assert.equal(
      typeof validateDirectorIntegrationPublicIndex,
      "function",
    );
  });

  it("21. Upstream NOL suite scripts exist.", () => {
    assert.equal(
      typeof packageJson.scripts["test:nol-director-freeze"],
      "string",
    );
    assert.equal(
      typeof packageJson.scripts["test:nol-director-certification"],
      "string",
    );
    assert.equal(
      typeof packageJson.scripts["test:nol-director-public-index"],
      "string",
    );
    assert.match(
      packageJson.scripts["test:nol-director-public-index"],
      /nexoraObjectDirectorIntegrationPublicIndex\.test\.ts$/,
    );
  });
});
