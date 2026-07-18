/**
 * DKL-3:8 — Data Understanding Freeze Tests.
 *
 * Deterministic coverage for the immutable Freeze layer.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as freezeApi from "./dataUnderstandingFreeze.ts";
import {
  DataUnderstandingFreeze,
  DataUnderstandingFreezeRegistry,
  DataUnderstandingFreezeCompatibility,
  DataUnderstandingFreezeLocks,
  DataUnderstandingFreezeManifest,
  DataUnderstandingFreezeSummary,
  DataUnderstandingFreezeVersion,
  DataUnderstandingFreezeIdentity,
} from "./dataUnderstandingFreeze.ts";
import { DataUnderstandingCertification } from "./dataUnderstandingCertification.ts";
import { DataUnderstandingPlatformDependencies } from "./dataUnderstandingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL38_FILES = [
  "dataUnderstandingFreezeTypes.ts",
  "dataUnderstandingFreezeRegistry.ts",
  "dataUnderstandingFreezeCompatibility.ts",
  "dataUnderstandingFreezeLocks.ts",
  "dataUnderstandingFreezeManifest.ts",
  "dataUnderstandingFreezeSummary.ts",
  "dataUnderstandingFreeze.ts",
  "dataUnderstandingFreeze.test.ts",
];

const REQUIRED_LOCKS = [
  "FoundationLock",
  "RegistryLock",
  "ModelLock",
  "ValidationLock",
  "ManifestLock",
  "PlatformLock",
  "CertificationLock",
  "DependencyLock",
  "CompatibilityLock",
  "OwnershipLock",
  "BoundaryLock",
  "PublicApiLock",
  "ExtensionLock",
  "VersionLock",
  "ReleaseLock",
  "ReadyForPublicIndex",
] as const;

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

test("1. exactly eight DKL-3:8 files exist", () => {
  assert.equal(DKL38_FILES.length, 8);
  for (const file of DKL38_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. freeze module has exactly eight runtime exports", () => {
  assert.deepEqual(Object.keys(freezeApi).sort(), [
    "DataUnderstandingFreeze",
    "DataUnderstandingFreezeCompatibility",
    "DataUnderstandingFreezeIdentity",
    "DataUnderstandingFreezeLocks",
    "DataUnderstandingFreezeManifest",
    "DataUnderstandingFreezeRegistry",
    "DataUnderstandingFreezeSummary",
    "DataUnderstandingFreezeVersion",
  ]);
});

test("3. no helper functions among freeze public exports", () => {
  for (const [name, value] of Object.entries(freezeApi)) {
    assert.notEqual(typeof value, "function", `${name} must not be a function`);
  }
});

test("4. identity and version consistency", () => {
  assert.equal(
    DataUnderstandingFreezeIdentity.freezeId,
    "DKL-3:8/DataUnderstandingFreeze",
  );
  assert.equal(DataUnderstandingFreezeIdentity.sourcePhase, "DKL-3:8");
  assert.equal(DataUnderstandingFreezeIdentity.freezeStatus, "Frozen");
  assert.equal(DataUnderstandingFreezeIdentity.stability, "Stable");
  assert.equal(DataUnderstandingFreezeIdentity.readiness, "ReadyForPublicIndex");
  assert.equal(DataUnderstandingFreezeIdentity.certificationStatus, "Certified");
  assert.equal(DataUnderstandingFreezeIdentity.platformId, "DKL-3");
  assert.equal(DataUnderstandingFreezeVersion, "1.0.0");
  assert.equal(
    DataUnderstandingFreezeIdentity.freezeNamespace,
    "nexora.dkl.data-understanding.freeze",
  );
  assert.equal(DataUnderstandingFreeze.identity, DataUnderstandingFreezeIdentity);
  assert.equal(DataUnderstandingFreeze.version, DataUnderstandingFreezeVersion);
});

test("5. freeze completeness — components and surfaces", () => {
  assert.equal(DataUnderstandingFreezeRegistry.componentCount, 7);
  assert.equal(DataUnderstandingFreezeRegistry.frozenPhaseCount, 7);
  assert.equal(DataUnderstandingFreezeRegistry.frozenPublicApiCount, 56);
  assert.deepEqual([...DataUnderstandingFreezeRegistry.frozenPhases], [
    "DKL-3:1",
    "DKL-3:2",
    "DKL-3:3",
    "DKL-3:4",
    "DKL-3:5",
    "DKL-3:6",
    "DKL-3:7",
  ]);
  assert.deepEqual(Object.keys(DataUnderstandingFreeze.frozenSurfaces).sort(), [
    "certification",
    "foundation",
    "manifest",
    "model",
    "platform",
    "registry",
    "validation",
  ]);
  for (const surface of Object.values(DataUnderstandingFreeze.frozenSurfaces)) {
    assert.equal(surface.frozen, true);
  }
});

test("6. freeze locks — required set all Locked", () => {
  assert.equal(DataUnderstandingFreezeLocks.lockCount, 16);
  assert.equal(DataUnderstandingFreezeLocks.lockedLockCount, 16);
  assert.equal(DataUnderstandingFreezeLocks.allLocked, true);
  const names = DataUnderstandingFreezeLocks.locks.map((l) => l.lockName);
  for (const required of REQUIRED_LOCKS) {
    assert.ok(names.includes(required), `missing lock ${required}`);
  }
  for (const freezeLock of DataUnderstandingFreezeLocks.locks) {
    assert.equal(freezeLock.status, "Locked");
    assert.equal(freezeLock.protectionLevel, "Permanent");
  }
});

test("7. dependency locks", () => {
  assert.equal(DataUnderstandingFreeze.readiness.DependenciesFrozen, true);
  assert.equal(
    DataUnderstandingFreeze.dependencies.platformDependencies,
    DataUnderstandingPlatformDependencies,
  );
  assert.equal(DataUnderstandingPlatformDependencies.noFuturePhases, true);
  assert.ok(DataUnderstandingFreeze.dependencies.forbidden.includes("DKL-3:9+"));
  assert.ok(DataUnderstandingFreeze.dependencies.forbidden.includes("DKL-4"));
  assert.ok(
    DataUnderstandingFreeze.dependencies.forbidden.includes("Business Objects"),
  );
  assert.ok(
    DataUnderstandingFreeze.dependencies.forbidden.includes("Knowledge Graph"),
  );
  assert.ok(
    DataUnderstandingFreeze.dependencies.pipelineUnderstandingPlatform
      .readyForDKL3Intake,
  );
});

test("8. compatibility locks", () => {
  assert.equal(DataUnderstandingFreeze.readiness.CompatibilityFrozen, true);
  assert.equal(
    DataUnderstandingFreezeCompatibility.runtimeCompatibilityLogic,
    false,
  );
  assert.ok(DataUnderstandingFreezeCompatibility.entryCount >= 12);
  const byId = Object.fromEntries(
    DataUnderstandingFreezeCompatibility.entries.map((e) => [
      e.compatibilityId,
      e,
    ]),
  );
  assert.equal(byId.CertificationFreezeCompatible?.status, "Compatible");
  assert.equal(byId.ForwardCompatibleToPublicIndex?.status, "ForwardCompatible");
  assert.equal(byId.Dkl4CompatibilityReferenceOnly?.status, "Restricted");
  assert.equal(byId.BusinessObjectCompatibilityForbidden?.status, "Forbidden");
  assert.equal(byId.KnowledgeGraphCompatibilityForbidden?.status, "Forbidden");
  assert.equal(byId.ExtensionSurfaceLocked?.status, "Locked");
});

test("9. ownership and boundary locks", () => {
  assert.equal(DataUnderstandingFreeze.readiness.OwnershipFrozen, true);
  assert.equal(DataUnderstandingFreeze.readiness.BoundariesFrozen, true);
  const names = DataUnderstandingFreezeLocks.locks.map((l) => l.lockName);
  assert.ok(names.includes("OwnershipLock"));
  assert.ok(names.includes("BoundaryLock"));
});

test("10. public API and version locks", () => {
  assert.equal(DataUnderstandingFreeze.readiness.PublicApisFrozen, true);
  assert.equal(DataUnderstandingFreeze.readiness.VersionFrozen, true);
  assert.equal(DataUnderstandingFreezeRegistry.publicApiCount, 8);
  assert.equal(DataUnderstandingFreezeManifest.counts.publicApiCount, 8);
  assert.equal(DataUnderstandingFreezeManifest.counts.frozenPublicApiCount, 56);
  assert.deepEqual(
    [...DataUnderstandingFreezeRegistry.publicApiNames].sort(),
    Object.keys(freezeApi).sort(),
  );
  assert.equal(DataUnderstandingFreezeVersion, "1.0.0");
});

test("11. release readiness — ReadyForPublicIndex", () => {
  assert.equal(DataUnderstandingFreeze.readiness.ReadyForPublicIndex, true);
  assert.equal(DataUnderstandingFreeze.readiness.Frozen, true);
  assert.equal(DataUnderstandingFreeze.readiness.Stable, true);
  assert.equal(DataUnderstandingFreeze.freezeStatus, "Frozen");
  assert.equal(DataUnderstandingFreeze.stability, "Stable");
  assert.equal(
    DataUnderstandingFreezeIdentity.readiness,
    "ReadyForPublicIndex",
  );
  assert.equal(
    DataUnderstandingFreeze.nextPhase,
    "DKL-3:9 — Data Understanding Public Index",
  );
  assert.equal(DataUnderstandingFreezeSummary.readiness, "ReadyForPublicIndex");
  assert.equal(
    DataUnderstandingFreeze.frozenSurfaces.certification.identity,
    DataUnderstandingCertification.identity,
  );
  assert.equal(
    DataUnderstandingFreeze.frozenSurfaces.certification.readiness,
    true,
  );
});

test("12. immutability guarantees", () => {
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeIdentity), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeRegistry), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeCompatibility), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeLocks), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeManifest), true);
  assert.equal(isDeeplyFrozen(DataUnderstandingFreezeSummary), true);
  assert.equal(Object.isFrozen(DataUnderstandingFreeze), true);
  assert.equal(Object.isFrozen(DataUnderstandingFreeze.frozenSurfaces), true);
  assert.equal(Object.isFrozen(DataUnderstandingFreeze.dependencies), true);
});

test("13. no runtime behavior in source files", () => {
  for (const file of DKL38_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/\bclass\s+\w+/.test(text), false, file);
    assert.equal(/\basync\s+function\b/.test(text), false, file);
    assert.equal(/\bnew\s+Promise\b/.test(text), false, file);
    assert.equal(/Math\.random|Date\.now|new Date\(|process\.env/.test(text), false, file);
    assert.equal(/\buuid\b|randomUUID/i.test(text), false, file);
  }
});

test("14. no future dependencies — imports limited to allowed surfaces", () => {
  for (const file of DKL38_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    const imports = [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const spec of imports) {
      const allowed =
        spec.includes("dataUnderstanding") ||
        /dataSourceKnowledgeRegistryPublicIndex\.ts$/.test(spec) ||
        /pipelineUnderstandingPlatform\.ts$/.test(spec);
      assert.ok(allowed, `${file} imports forbidden module: ${spec}`);
    }
    assert.equal(/from\s+["'][^"']*dkl-4/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*dataUnderstandingPublicIndex/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/engine\//i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*\/persistence/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*businessObject/i.test(text), false, file);
    assert.equal(/from\s+["'][^"']*knowledgeGraph/i.test(text), false, file);
  }
});

test("15. metadata only — no understanding, validation, certification, BO, KG, AI, Engine", () => {
  assert.equal(DataUnderstandingFreeze.metadata.metadataOnly, true);
  assert.equal(DataUnderstandingFreeze.metadata.freezeOnly, true);
  assert.equal(DataUnderstandingFreeze.metadata.semanticUnderstandingPerformed, false);
  assert.equal(DataUnderstandingFreeze.metadata.validationExecuted, false);
  assert.equal(DataUnderstandingFreeze.metadata.certificationExecuted, false);
  assert.equal(DataUnderstandingFreeze.metadata.businessObjectsCreated, false);
  assert.equal(DataUnderstandingFreeze.metadata.knowledgeGraphCreated, false);
  assert.equal(DataUnderstandingFreeze.metadata.persistencePerformed, false);
  assert.equal(DataUnderstandingFreeze.metadata.aiExecuted, false);
  assert.equal(DataUnderstandingFreeze.metadata.engineReasoningPerformed, false);
  assert.equal(DataUnderstandingFreeze.readiness.UnderstandingForbidden, true);
  assert.equal(DataUnderstandingFreeze.readiness.ValidationExecutionForbidden, true);
  assert.equal(DataUnderstandingFreeze.readiness.CertificationExecutionForbidden, true);
  assert.equal(DataUnderstandingFreeze.readiness.BusinessObjectCreationForbidden, true);
  assert.equal(DataUnderstandingFreeze.readiness.KnowledgeGraphForbidden, true);
  assert.equal(DataUnderstandingFreeze.readiness.AIFree, true);
  assert.equal(DataUnderstandingFreeze.readiness.EngineFree, true);
});

test("16. summary and manifest consistency", () => {
  assert.equal(DataUnderstandingFreeze.summary, DataUnderstandingFreezeSummary);
  assert.equal(DataUnderstandingFreeze.manifest, DataUnderstandingFreezeManifest);
  assert.equal(DataUnderstandingFreeze.registry, DataUnderstandingFreezeRegistry);
  assert.equal(DataUnderstandingFreeze.locks, DataUnderstandingFreezeLocks);
  assert.equal(DataUnderstandingFreezeSummary.frozenPhases, 7);
  assert.equal(DataUnderstandingFreezeSummary.frozenApis, 56);
  assert.equal(DataUnderstandingFreezeSummary.lockCount, 16);
  assert.equal(DataUnderstandingFreezeSummary.blockingIssueCount, 0);
  assert.equal(DataUnderstandingFreezeSummary.warningCount, 0);
  const a = JSON.stringify(DataUnderstandingFreezeSummary);
  const b = JSON.stringify(DataUnderstandingFreezeSummary);
  assert.equal(a, b);
});
