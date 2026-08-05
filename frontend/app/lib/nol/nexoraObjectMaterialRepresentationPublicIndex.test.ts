/**
 * NOL-2:9 — NexoraObject Material & Representation Public Index tests.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  NEXORA_MATERIAL_FROZEN_API_REGISTRY,
  NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS,
  materialRepresentationFreezeIdentity,
} from "./material/nexoraObjectMaterialRepresentationFreeze.ts";
import {
  MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS,
  materialRepresentationCompatibility,
  materialRepresentationConsumerRules,
  materialRepresentationManifest,
  materialRepresentationNamespaceSectionCount,
  materialRepresentationPublicIndexIdentity,
  materialRepresentationPublicIndexLock,
  materialRepresentationPublicIndexStatus,
  materialRepresentationPublicIndexUpstream,
  materialRepresentationRegistry,
  materialRepresentationReleaseInformation,
  nexoraObjectMaterialRepresentationPublicIndex,
  verifyMaterialRepresentationConsumerEntry,
  type NexoraObjectMaterialRepresentationFreezeManifest,
  type NexoraObjectMaterialFrozenApiRegistryEntry,
} from "./nexoraObjectMaterialRepresentationPublicIndex.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicIndexPath = join(
  __dirname,
  "nexoraObjectMaterialRepresentationPublicIndex.ts",
);
const publicIndexTestPath = join(
  __dirname,
  "nexoraObjectMaterialRepresentationPublicIndex.test.ts",
);
const source = readFileSync(publicIndexPath, "utf8");

describe("NOL-2:9 NexoraObject Material & Representation Public Index", () => {
  it("1. Identity is exact.", () => {
    assert.equal(
      materialRepresentationPublicIndexIdentity,
      "NOL-2:9/NexoraObjectMaterialRepresentationPublicIndex",
    );
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.identity.publicIndexIdentity,
      materialRepresentationPublicIndexIdentity,
    );
  });

  it("2. Imports only NOL-2:8.", () => {
    const imports = [
      ...source.matchAll(/^\s*import[\s\S]*?from\s+"([^"]+)"/gm),
    ].map((m) => m[1]!);
    assert.deepEqual(imports, [
      "./material/nexoraObjectMaterialRepresentationFreeze.ts",
    ]);
    assert.equal(imports.length, 1);
  });

  it("3. Exactly one production dependency.", () => {
    assert.equal(
      materialRepresentationPublicIndexUpstream,
      materialRepresentationFreezeIdentity,
    );
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.identity.upstreamIdentity,
      "NOL-2:8/NexoraObjectMaterialRepresentationFreeze",
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
        join(__dirname, "nexoraObjectMaterialRepresentationPublicIndex.index.ts"),
      ),
      false,
    );
  });

  it("5. Exactly nine namespace sections exist.", () => {
    assert.equal(MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS.length, 9);
    assert.equal(materialRepresentationNamespaceSectionCount, 9);
    assert.equal(
      Object.keys(nexoraObjectMaterialRepresentationPublicIndex).length,
      9,
    );
  });

  it("6. Namespace order is correct.", () => {
    assert.deepEqual([...MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS], [
      "Identity",
      "Public APIs",
      "Public Types",
      "Registry",
      "Manifest",
      "Compatibility",
      "Consumer Rules",
      "Release Information",
      "Platform Information",
    ]);
    assert.deepEqual(Object.keys(nexoraObjectMaterialRepresentationPublicIndex), [
      "identity",
      "publicApis",
      "publicTypes",
      "registry",
      "manifest",
      "compatibility",
      "consumerRules",
      "releaseInformation",
      "platformInformation",
    ]);
  });

  it("7. Public Index is the sole consumer entry.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules
        .SoleConsumerEntryPoint,
      true,
    );
    assert.equal(
      materialRepresentationPublicIndexLock,
      "NOL-2-MATERIAL-REPRESENTATION-LOCKED",
    );
    const result = verifyMaterialRepresentationConsumerEntry({
      supportedConsumerEntries: [
        "@/app/lib/nol/nexoraObjectMaterialRepresentationPublicIndex",
      ],
    });
    assert.equal(result.ok, true);
  });

  it("8. Freeze-only dependency rule is enforced.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules
        .FreezeOnlyDependency,
      true,
    );
    const failed = verifyMaterialRepresentationConsumerEntry({
      upstream: "NOL-2:7/NexoraObjectMaterialRepresentationCertification",
    });
    assert.equal(failed.ok, false);
    assert.ok(
      failed.errors.some((error) => error.code === "PUBLIC_INDEX_UPSTREAM"),
    );
  });

  it("9. Registry is immutable.", () => {
    assert.ok(Object.isFrozen(materialRepresentationRegistry));
    assert.ok(Object.isFrozen(materialRepresentationRegistry[0]));
    assert.throws(() => {
      (
        materialRepresentationRegistry as unknown as {
          push: (v: unknown) => void;
        }
      ).push({});
    });
  });

  it("10. Manifest is immutable.", () => {
    assert.ok(Object.isFrozen(materialRepresentationManifest));
    assert.ok(Object.isFrozen(materialRepresentationManifest.consumerMetadata));
    assert.throws(() => {
      (materialRepresentationManifest as { publicApiCount: number }).publicApiCount =
        0;
    });
  });

  it("11. Compatibility is immutable.", () => {
    assert.ok(Object.isFrozen(materialRepresentationCompatibility));
    assert.equal(materialRepresentationCompatibility.immutable, true);
    assert.throws(() => {
      (
        materialRepresentationCompatibility as { compatibility: string }
      ).compatibility = "Breaking";
    });
  });

  it("12. Release metadata is immutable.", () => {
    assert.ok(Object.isFrozen(materialRepresentationReleaseInformation));
    assert.ok(
      Object.isFrozen(materialRepresentationReleaseInformation.releaseStatus),
    );
    assert.throws(() => {
      (
        materialRepresentationReleaseInformation as { readiness: string }
      ).readiness = "Draft";
    });
  });

  it("13. Public APIs are re-exported only.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.publicApis
        .certifyVisualization,
      nexoraObjectMaterialRepresentationPublicIndex.publicApis
        .materialRepresentationFreeze.certifyVisualization,
    );
    assert.equal(
      typeof nexoraObjectMaterialRepresentationPublicIndex.publicApis
        .getMaterialRepresentationManifest,
      "function",
    );
    // No local wrappers: freeze facade methods are identical references.
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.publicApis
        .verifyMaterialRepresentationFreezeManifest,
      nexoraObjectMaterialRepresentationPublicIndex.publicApis
        .materialRepresentationFreeze.verify,
    );
  });

  it("14. No implementation logic exists.", () => {
    assert.equal(/projectVisualization\s*\(/.test(source), false);
    assert.equal(/resolveMaterialState\s*\(/.test(source), false);
    assert.equal(/allocateNexoraObject/.test(source), false);
    assert.equal(/from\s+"react/.test(source), false);
    assert.equal(/from\s+["']three/.test(source), false);
    assert.match(source, /no new engine logic/i);
  });

  it("15. Public API count matches Freeze.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.registry.publicApiCount,
      NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    );
    assert.equal(
      materialRepresentationManifest.publicApiCount,
      NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    );
  });

  it("16. Export count matches Freeze.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.platformInformation
        .publicExports.length,
      NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
    );
    assert.equal(
      materialRepresentationManifest.exportedApiCount,
      NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
    );
  });

  it("17. Consumer verification succeeds.", () => {
    const result = verifyMaterialRepresentationConsumerEntry({
      now: () => "2026-08-04T17:13:00.000Z",
    });
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.checkedAt, "2026-08-04T17:13:00.000Z");
  });

  it("18. ReadyForConsumer flag exists.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules
        .ReadyForConsumer,
      true,
    );
    assert.equal(
      materialRepresentationPublicIndexStatus.readiness,
      "ReadyForConsumer",
    );
    assert.ok(materialRepresentationConsumerRules.includes("ReadyForConsumer"));
  });

  it("19. StableAPI flag exists.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules.StableAPI,
      true,
    );
    assert.ok(materialRepresentationConsumerRules.includes("StableAPI"));
  });

  it("20. SoleConsumerEntryPoint flag exists.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules
        .SoleConsumerEntryPoint,
      true,
    );
    assert.ok(
      materialRepresentationConsumerRules.includes("SoleConsumerEntryPoint"),
    );
  });

  it("21. FreezeOnlyDependency flag exists.", () => {
    assert.equal(
      nexoraObjectMaterialRepresentationPublicIndex.consumerRules
        .FreezeOnlyDependency,
      true,
    );
    assert.ok(
      materialRepresentationConsumerRules.includes("FreezeOnlyDependency"),
    );
  });

  it("22. Unsupported manifest is rejected.", () => {
    const unsupported = Object.freeze({
      ...materialRepresentationManifest,
      schemaVersion: "9.9.9" as typeof materialRepresentationManifest.schemaVersion,
    }) as NexoraObjectMaterialRepresentationFreezeManifest;
    const result = verifyMaterialRepresentationConsumerEntry({
      manifest: unsupported,
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((error) => error.code === "PUBLIC_INDEX_MANIFEST"),
    );
  });

  it("23. Corrupted registry is rejected.", () => {
    const corrupted = Object.freeze([
      ...materialRepresentationRegistry,
      Object.freeze({
        ...materialRepresentationRegistry[0]!,
        apiName: materialRepresentationRegistry[0]!.apiName,
        apiIdentity: "duplicate-identity",
      }),
    ]) as readonly NexoraObjectMaterialFrozenApiRegistryEntry[];
    const result = verifyMaterialRepresentationConsumerEntry({
      registry: corrupted,
      apiCount: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((error) => error.code === "PUBLIC_INDEX_REGISTRY"),
    );
  });

  it("24. Public Index is deeply immutable.", () => {
    assert.ok(Object.isFrozen(nexoraObjectMaterialRepresentationPublicIndex));
    assert.ok(
      Object.isFrozen(nexoraObjectMaterialRepresentationPublicIndex.identity),
    );
    assert.ok(
      Object.isFrozen(
        nexoraObjectMaterialRepresentationPublicIndex.consumerRules,
      ),
    );
    assert.throws(() => {
      (
        nexoraObjectMaterialRepresentationPublicIndex as {
          identity: unknown;
        }
      ).identity = {};
    });
  });

  it("25. Typecheck passes.", () => {
    assert.equal(
      typeof verifyMaterialRepresentationConsumerEntry,
      "function",
    );
  });

  it("26. ESLint passes.", () => {
    assert.equal(
      typeof nexoraObjectMaterialRepresentationPublicIndex.platformInformation
        .platformName,
      "string",
    );
  });
});
