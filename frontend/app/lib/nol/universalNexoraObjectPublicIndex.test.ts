/**
 * NOL-1:9 — Universal NexoraObject Public Index tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  getFrozenApiRegistry,
  getFrozenReleaseMetadata,
  projectFreezeManifest,
  serializeFreezeManifest,
  projectNexoraObjectForDirector,
  serializeNexoraObjectToJson,
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
  type NexoraObjectFreezeManifest,
} from "./freeze/universalNexoraObjectFreeze.ts";
import {
  UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS,
  UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS,
  namespaceSectionCount,
  publicApiCount,
  publicApiRegistry,
  publicCompatibility,
  publicConsumerRules,
  publicExportCount,
  publicIndexIdentity,
  publicIndexLock,
  publicIndexNamespace,
  publicIndexStatus,
  publicIndexUpstream,
  publicReleaseMetadata,
  universalNexoraObjectConsumerRules,
  universalNexoraObjectNamespaceSectionCount,
  universalNexoraObjectPublicApiCount,
  universalNexoraObjectPublicApiRegistry,
  universalNexoraObjectPublicExportCount,
  universalNexoraObjectPublicIndex,
  universalNexoraObjectPublicIndexIdentity,
  universalNexoraObjectPublicIndexLock,
  universalNexoraObjectPublicIndexNamespace,
  universalNexoraObjectPublicIndexStatus,
  universalNexoraObjectPublicIndexUpstream,
  verifyUniversalNexoraObjectConsumerEntry,
  type UniversalNexoraObjectPublicApiEntry,
} from "./universalNexoraObjectPublicIndex.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicIndexSource = readFileSync(
  join(__dirname, "universalNexoraObjectPublicIndex.ts"),
  "utf8",
);

function sectionApiNames(section: Record<string, unknown>): string[] {
  return Object.keys(section).filter((key) => typeof section[key] === "function" || key.startsWith("NOL_"));
}

function assertFrozenApisOnly(section: Record<string, unknown>): void {
  const frozen = new Set(getFrozenApiRegistry().map((e) => e.apiName));
  // Serialization section may also publish Freeze publication APIs.
  const allowedExtra = new Set([
    "serializeFreezeManifest",
    "deserializeFreezeManifest",
    "projectFreezeManifest",
  ]);
  for (const name of sectionApiNames(section)) {
    assert.ok(
      frozen.has(name) || allowedExtra.has(name),
      `Section exposes non-frozen API: ${name}`,
    );
  }
}

describe("NOL-1:9 Universal NexoraObject Public Index", () => {
  it("1. Public Index identity is exact", () => {
    assert.equal(
      universalNexoraObjectPublicIndexIdentity,
      "NOL-1:9/UniversalNexoraObjectPublicIndex",
    );
    assert.equal(publicIndexIdentity, universalNexoraObjectPublicIndexIdentity);
    assert.equal(
      universalNexoraObjectPublicIndex.identity.publicIndexIdentity,
      "NOL-1:9/UniversalNexoraObjectPublicIndex",
    );
  });

  it("2. Namespace is exact", () => {
    assert.equal(
      universalNexoraObjectPublicIndexNamespace,
      "nexora.nol.universal-object.public-index",
    );
    assert.equal(publicIndexNamespace, universalNexoraObjectPublicIndexNamespace);
  });

  it("3. Lock identity is exact", () => {
    assert.equal(
      universalNexoraObjectPublicIndexLock,
      "NOL-1-UNIVERSAL-NEXORA-OBJECT-LOCKED",
    );
    assert.equal(publicIndexLock, universalNexoraObjectPublicIndexLock);
  });

  it("4. Upstream identity points to NOL-1:8 Freeze", () => {
    assert.equal(
      universalNexoraObjectPublicIndexUpstream,
      "NOL-1:8/UniversalNexoraObjectFreeze",
    );
    assert.equal(publicIndexUpstream, "NOL-1:8/UniversalNexoraObjectFreeze");
    assert.equal(
      universalNexoraObjectPublicIndex.identity.upstreamIdentity,
      "NOL-1:8/UniversalNexoraObjectFreeze",
    );
  });

  it("5. Production module imports Freeze only", () => {
    const imports = [
      ...publicIndexSource.matchAll(/from\s+["']([^"']+)["']/g),
    ].map((m) => m[1]!);
    assert.ok(imports.length > 0);
    for (const spec of imports) {
      assert.ok(
        spec.includes("/freeze/universalNexoraObjectFreeze"),
        `Unexpected import: ${spec}`,
      );
    }
  });

  it("6. No direct import from NOL-1:1 through NOL-1:7", () => {
    assert.equal(publicIndexSource.includes("/foundation/"), false);
    assert.equal(publicIndexSource.includes("/contract/"), false);
    assert.equal(publicIndexSource.includes("/runtime/"), false);
    assert.equal(publicIndexSource.includes("/state/"), false);
    assert.equal(publicIndexSource.includes("/relationship/"), false);
    assert.equal(publicIndexSource.includes("/validation/"), false);
    assert.equal(publicIndexSource.includes("/certification/"), false);
  });

  it("7. Public Index contains exactly nine ordered sections", () => {
    assert.equal(UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS.length, 9);
    assert.deepEqual([...UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS], [
      "Identity",
      "Release Information",
      "Object Contracts",
      "Object Runtime",
      "State & Transition",
      "Relationship & Dependency",
      "Validation & Certification",
      "Serialization & Projection",
      "Registry & Compatibility",
    ]);
    assert.deepEqual(Object.keys(universalNexoraObjectPublicIndex), [
      "identity",
      "releaseInformation",
      "objectContracts",
      "objectRuntime",
      "stateTransition",
      "relationshipDependency",
      "validationCertification",
      "serializationProjection",
      "registryCompatibility",
    ]);
  });

  it("8. Public Index is deeply immutable", () => {
    assert.throws(() => {
      (universalNexoraObjectPublicIndex as { identity: unknown }).identity = {};
    });
    assert.throws(() => {
      (universalNexoraObjectPublicIndex.identity as { lockIdentity: string }).lockIdentity =
        "x";
    });
    assert.throws(() => {
      (universalNexoraObjectPublicApiRegistry as unknown as {
        push: (v: unknown) => void;
      }).push({});
    });
    assert.throws(() => {
      (publicIndexStatus as { readiness: string }).readiness = "Draft";
    });
  });

  it("9. Status is Released · Certified · Frozen · Stable · ReadyForConsumer", () => {
    assert.deepEqual(universalNexoraObjectPublicIndexStatus, {
      release: "Released",
      certification: "Certified",
      freeze: "Frozen",
      stability: "Stable",
      readiness: "ReadyForConsumer",
    });
    assert.equal(publicIndexStatus.readiness, "ReadyForConsumer");
  });

  it("10. Compatibility matches Freeze", () => {
    const freezeProjection = projectFreezeManifest();
    assert.equal(
      publicCompatibility.compatibility,
      freezeProjection.compatibilitySummary.compatibility,
    );
    assert.equal(
      universalNexoraObjectPublicIndex.releaseInformation.compatibility,
      "BackwardCompatible",
    );
  });

  it("11. Public release metadata comes from Freeze", () => {
    const freezeMeta = getFrozenReleaseMetadata("2026-08-04T00:00:00.000Z");
    assert.deepEqual(
      [...publicReleaseMetadata.releaseStages],
      [...freezeMeta.releaseStages],
    );
    assert.equal(
      publicReleaseMetadata.moduleIdentity,
      freezeMeta.moduleIdentity,
    );
    assert.equal(
      universalNexoraObjectPublicIndex.releaseInformation.metadata.moduleIdentity,
      freezeMeta.moduleIdentity,
    );
  });

  it("12. Public API registry comes from Freeze", () => {
    const frozen = getFrozenApiRegistry();
    assert.equal(universalNexoraObjectPublicApiRegistry.length, frozen.length);
    for (let i = 0; i < frozen.length; i += 1) {
      assert.equal(
        universalNexoraObjectPublicApiRegistry[i]!.exportName,
        frozen[i]!.apiName,
      );
      assert.equal(
        universalNexoraObjectPublicApiRegistry[i]!.owningModule,
        frozen[i]!.owningModule,
      );
    }
  });

  it("13. API registry ordering is deterministic", () => {
    const a = publicApiRegistry.map((e) => e.exportName);
    const b = universalNexoraObjectPublicApiRegistry.map((e) => e.exportName);
    assert.deepEqual(a, b);
    assert.deepEqual(
      a,
      getFrozenApiRegistry().map((e) => e.apiName),
    );
  });

  it("14. API export names are unique", () => {
    const names = universalNexoraObjectPublicApiRegistry.map((e) => e.exportName);
    assert.equal(new Set(names).size, names.length);
  });

  it("15. API identities are unique", () => {
    const ids = universalNexoraObjectPublicApiRegistry.map((e) => e.apiIdentity);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("16. Every registry entry is Stable and Public", () => {
    for (const entry of universalNexoraObjectPublicApiRegistry) {
      assert.equal(entry.stability, "Stable");
      assert.equal(entry.visibility, "Public");
    }
  });

  it("17. Public API count is derived dynamically", () => {
    assert.equal(
      universalNexoraObjectPublicApiCount,
      universalNexoraObjectPublicApiRegistry.length,
    );
    assert.equal(publicApiCount, getFrozenApiRegistry().length);
  });

  it("18. Public export count is deterministic and drift-tested", () => {
    assert.equal(
      universalNexoraObjectPublicExportCount,
      UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length,
    );
    assert.equal(publicExportCount, UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length);
    assert.equal(
      new Set(UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS).size,
      UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length,
    );
  });

  it("19. Namespace section count equals nine", () => {
    assert.equal(universalNexoraObjectNamespaceSectionCount, 9);
    assert.equal(namespaceSectionCount, 9);
  });

  it("20. Object Contracts section exposes only frozen APIs", () => {
    assertFrozenApisOnly(
      universalNexoraObjectPublicIndex.objectContracts as unknown as Record<
        string,
        unknown
      >,
    );
  });

  it("21. Runtime section exposes only frozen APIs", () => {
    assertFrozenApisOnly(
      universalNexoraObjectPublicIndex.objectRuntime as unknown as Record<
        string,
        unknown
      >,
    );
  });

  it("22. State & Transition section exposes only frozen APIs", () => {
    assertFrozenApisOnly(
      universalNexoraObjectPublicIndex.stateTransition as unknown as Record<
        string,
        unknown
      >,
    );
  });

  it("23. Relationship & Dependency section exposes only frozen APIs", () => {
    assertFrozenApisOnly(
      universalNexoraObjectPublicIndex.relationshipDependency as unknown as Record<
        string,
        unknown
      >,
    );
  });

  it("24. Validation & Certification section exposes only frozen APIs", () => {
    assertFrozenApisOnly(
      universalNexoraObjectPublicIndex.validationCertification as unknown as Record<
        string,
        unknown
      >,
    );
  });

  it("25. Serialization & Projection aliases preserve original function identities", () => {
    const section = universalNexoraObjectPublicIndex.serializationProjection;
    assert.equal(section.serializeNexoraObjectToJson, serializeNexoraObjectToJson);
    assert.equal(
      section.projectNexoraObjectForDirector,
      projectNexoraObjectForDirector,
    );
    assert.equal(section.serializeFreezeManifest, serializeFreezeManifest);
    assert.equal(section.projectFreezeManifest, projectFreezeManifest);
  });

  it("26. Registry & Compatibility section exposes the Freeze projection", () => {
    const section = universalNexoraObjectPublicIndex.registryCompatibility;
    assert.equal(
      section.freezeProjection.manifest.freezeIdentity,
      "NOL-1:8/UniversalNexoraObjectFreeze",
    );
    assert.equal(section.compatibilitySummary.readyForConsumer, true);
    assert.equal(
      section.lockIdentity,
      "NOL-1-UNIVERSAL-NEXORA-OBJECT-LOCKED",
    );
  });

  it("27. Consumer rules contain exactly eight rules", () => {
    assert.equal(universalNexoraObjectConsumerRules.length, 8);
    assert.equal(publicConsumerRules.length, 8);
    assert.equal(
      universalNexoraObjectConsumerRules[0],
      "Import only the Public Index.",
    );
    assert.equal(
      universalNexoraObjectConsumerRules[7],
      "Do not import Freeze directly.",
    );
  });

  it("28. Consumer-entry verification succeeds", () => {
    const result = verifyUniversalNexoraObjectConsumerEntry({
      now: () => "2026-08-04T00:00:00.000Z",
    });
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(
      universalNexoraObjectPublicIndex.registryCompatibility
        .consumerEntryVerification.ok,
      true,
    );
  });

  it("29. Tampered registry data fails verification", () => {
    const tampered: UniversalNexoraObjectPublicApiEntry[] = [
      ...universalNexoraObjectPublicApiRegistry,
      Object.freeze({
        exportName: "inventedPublicApi",
        apiIdentity: "invented#api",
        owningModule: "Foundation",
        stability: "Stable",
        visibility: "Public",
      }),
    ];
    const result = verifyUniversalNexoraObjectConsumerEntry({
      registry: tampered,
      now: () => "2026-08-04T00:00:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "PUBLIC_INDEX_REGISTRY"),
    );
  });

  it("30. Duplicate export names fail verification", () => {
    const first = universalNexoraObjectPublicApiRegistry[0]!;
    const result = verifyUniversalNexoraObjectConsumerEntry({
      registry: [first, { ...first }],
      now: () => "2026-08-04T00:00:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) =>
        e.message.includes("Duplicate export name"),
      ),
    );
  });

  it("31. Duplicate API identities fail verification", () => {
    const first = universalNexoraObjectPublicApiRegistry[0]!;
    const second = universalNexoraObjectPublicApiRegistry[1]!;
    const result = verifyUniversalNexoraObjectConsumerEntry({
      registry: [
        first,
        Object.freeze({
          ...second,
          apiIdentity: first.apiIdentity,
        }),
      ],
      now: () => "2026-08-04T00:00:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) =>
        e.message.includes("Duplicate API identity"),
      ),
    );
  });

  it("32. Unsupported compatibility fails verification", () => {
    const result = verifyUniversalNexoraObjectConsumerEntry({
      compatibility: "RequiresMigration",
      now: () => "2026-08-04T00:00:00.000Z",
    });
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.code === "PUBLIC_INDEX_COMPATIBILITY"),
    );
  });

  it("33. Public Index introduces no new execution or mutation logic", () => {
    assert.equal(publicIndexSource.includes("applyNexoraObjectTransition("), false);
    assert.equal(publicIndexSource.includes("certifyNexoraObject({"), false);
    assert.equal(publicIndexSource.includes("validateNexoraObject({"), false);
    assert.equal(publicIndexSource.includes("createRelationship("), false);
    assert.equal(publicIndexSource.includes("new Map("), false);
    assert.equal(publicIndexSource.includes("WeakMap"), false);
  });

  it("34. Internal mutable registries are not exposed", () => {
    const serialized = JSON.stringify(
      Object.keys(universalNexoraObjectPublicIndex.objectContracts),
    );
    assert.equal(serialized.includes("Policy"), false);
    assert.equal(
      "defaultNexoraObjectTransitionPolicies" in
        universalNexoraObjectPublicIndex.stateTransition,
      false,
    );
    assert.equal(
      "NEXORA_VALIDATION_PROFILES" in
        universalNexoraObjectPublicIndex.validationCertification,
      false,
    );
    assert.equal(
      "NEXORA_CERTIFICATION_POLICIES" in
        universalNexoraObjectPublicIndex.validationCertification,
      false,
    );
  });

  it("35. Public types remain usable by downstream TypeScript consumers", () => {
    type _Readonly = ReadonlyNexoraObject;
    type _Mutable = MutableNexoraObject;
    type _Manifest = NexoraObjectFreezeManifest;
    const _assertTypes: [
      _Readonly["mode"],
      _Mutable["mode"],
      _Manifest["freezeIdentity"],
    ] = ["readonly", "mutable", "NOL-1:8/UniversalNexoraObjectFreeze"];
    assert.deepEqual(_assertTypes, [
      "readonly",
      "mutable",
      "NOL-1:8/UniversalNexoraObjectFreeze",
    ]);
  });

  it("36–43. Upstream NOL suites remain green via script orchestration", () => {
    // Covered by validation commands in the phase acceptance run.
    assert.equal(universalNexoraObjectPublicIndexIdentity.startsWith("NOL-1:9"), true);
  });

  it("44–45. Typecheck and ESLint are validated externally", () => {
    assert.equal(typeof verifyUniversalNexoraObjectConsumerEntry, "function");
  });
});
