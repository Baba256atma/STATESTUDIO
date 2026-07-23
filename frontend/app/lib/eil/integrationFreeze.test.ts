/**
 * EIL-1:8 — Integration Freeze Tests.
 *
 * Deterministic coverage for the immutable Integration Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationCertificationIdentity,
  IntegrationCertificationPlatform,
} from "./integrationCertification.ts";
import * as FreezeModule from "./integrationFreeze.ts";
import {
  IntegrationFreezeBaselines,
  IntegrationFreezeCollections,
  IntegrationFreezeCompatibility,
  IntegrationFreezeExtensions,
  IntegrationFreezeIdentity,
  IntegrationFreezeLocks,
  IntegrationFreezePlatform,
  IntegrationFreezeSummary,
} from "./integrationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL18_FILES = Object.freeze([
  "integrationFreezeTypes.ts",
  "integrationFreezeIdentity.ts",
  "integrationFreezeLocks.ts",
  "integrationFreezeBaselines.ts",
  "integrationFreezeCompatibility.ts",
  "integrationFreezeExtensions.ts",
  "integrationFreeze.ts",
  "integrationFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationFreezeIdentity",
  "IntegrationFreezeLocks",
  "IntegrationFreezeBaselines",
  "IntegrationFreezeCompatibility",
  "IntegrationFreezeExtensions",
  "IntegrationFreezeCollections",
  "IntegrationFreezeSummary",
  "IntegrationFreezePlatform",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "EIL-1:1",
  "EIL-1:2",
  "EIL-1:3",
  "EIL-1:4",
  "EIL-1:5",
  "EIL-1:6",
  "EIL-1:7",
  "EIL-1:8",
] as const);

const EXPECTED_ARCHITECTURAL_LOCKS = Object.freeze([
  "IdentityLock",
  "NamespaceLock",
  "VersionLock",
  "DependencyLock",
  "InventoryLock",
  "CompatibilityLock",
  "PlatformLock",
  "CertificationLock",
  "MetadataLock",
  "PublicSurfaceLock",
  "DeterministicOrderingLock",
  "ReadinessLock",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationCertification(?!\.ts["'])/,
  /from ["']\.\/integration(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integration(Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-1:8 Integration Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(EIL18_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL18_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, namespace, version, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationFreezeIdentity.phaseId, "EIL-1:8");
    assert.equal(
      IntegrationFreezeIdentity.canonicalId,
      "EIL-1:8/IntegrationFreeze",
    );
    assert.equal(IntegrationFreezeIdentity.name, "Integration Freeze");
    assert.equal(IntegrationFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationFreezeIdentity.namespace,
      "nexora.eil.integration.freeze",
    );
    assert.equal(IntegrationFreezeIdentity.layer, "EIL");
    assert.equal(IntegrationFreezeIdentity.platform, "EIL-1");
    assert.equal(IntegrationFreezeIdentity.phaseType, "Freeze");
    assert.equal(IntegrationFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationFreezePlatform.status, "Frozen");
    assert.equal(
      IntegrationFreezePlatform.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationFreezePlatform.nextPhase,
      "EIL-1:9 — Integration Public Index",
    );
  });

  it("declares Certification aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationFreezePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.certificationId,
      IntegrationCertificationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationCertification.ts",
    );
    assert.equal(
      IntegrationFreezeIdentity.certificationDependency,
      "EIL-1:7/IntegrationCertification",
    );
    assert.equal(
      IntegrationFreezeIdentity.certificationEntryPoint,
      "integrationCertification.ts",
    );
    assert.equal(dependency.certificationInternalImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationFreezePlatform.certificationPlatform,
      IntegrationCertificationPlatform,
    );
  });

  it("declares exactly one canonical platform lock EIL-1-INTEGRATION-LOCKED", () => {
    const canonicalLocks = IntegrationFreezeLocks.filter(
      (item) => item.isCanonicalPlatformLock,
    );
    assert.equal(canonicalLocks.length, 1);
    assert.equal(canonicalLocks[0]!.canonicalKey, "EIL-1-INTEGRATION-LOCKED");
    assert.equal(
      IntegrationFreezePlatform.canonicalPlatformLock.canonicalKey,
      "EIL-1-INTEGRATION-LOCKED",
    );
    assert.equal(
      IntegrationFreezeSummary.canonicalPlatformLockKey,
      "EIL-1-INTEGRATION-LOCKED",
    );
    assert.equal(
      IntegrationFreezePlatform.inventory.canonicalPlatformLockCount,
      1,
    );
  });

  it("freezes locks, baselines, compatibility, and extensions", () => {
    assert.equal(Object.isFrozen(IntegrationFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationFreezeLocks), true);
    assert.equal(Object.isFrozen(IntegrationFreezeBaselines), true);
    assert.equal(Object.isFrozen(IntegrationFreezeCompatibility), true);
    assert.equal(Object.isFrozen(IntegrationFreezeExtensions), true);
    assert.equal(Object.isFrozen(IntegrationFreezeCollections), true);
    assert.equal(Object.isFrozen(IntegrationFreezeSummary), true);
    assert.equal(Object.isFrozen(IntegrationFreezePlatform), true);

    for (const entry of IntegrationFreezeLocks) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    for (const entry of IntegrationFreezeBaselines) {
      assert.equal(Object.isFrozen(entry), true);
    }
    for (const entry of IntegrationFreezeCompatibility) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
    for (const entry of IntegrationFreezeExtensions) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
  });

  it("publishes complete architectural locks, baselines, and policies with deterministic ordinals", () => {
    const architectural = IntegrationFreezeLocks.filter(
      (item) => !item.isCanonicalPlatformLock,
    );
    assert.deepEqual(
      architectural.map((item) => item.canonicalKey),
      [...EXPECTED_ARCHITECTURAL_LOCKS],
    );
    assert.equal(architectural.length, 12);
    assert.equal(IntegrationFreezeLocks.length, 13);

    assert.deepEqual(
      IntegrationFreezeBaselines.map((item) => item.sourcePhase),
      [...EXPECTED_BASELINES],
    );
    assert.equal(IntegrationFreezeCompatibility.length, 10);
    assert.equal(IntegrationFreezeExtensions.length, 8);

    assertUnique(
      IntegrationFreezeLocks.map((item) => item.lockId),
      "lock IDs",
    );
    assertAscending(
      IntegrationFreezeLocks.map((item) => item.ordinal),
      "lock",
    );
    assertAscending(
      IntegrationFreezeBaselines.map((item) => item.ordinal),
      "baseline",
    );
    assertAscending(
      IntegrationFreezeCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
    assertAscending(
      IntegrationFreezeExtensions.map((item) => item.ordinal),
      "extension",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationFreezeCollections.lockCount,
      IntegrationFreezeLocks.length,
    );
    assert.equal(
      IntegrationFreezeCollections.baselineCount,
      IntegrationFreezeBaselines.length,
    );
    assert.equal(
      IntegrationFreezeCollections.compatibilityCount,
      IntegrationFreezeCompatibility.length,
    );
    assert.equal(
      IntegrationFreezeCollections.extensionCount,
      IntegrationFreezeExtensions.length,
    );
    assert.equal(
      IntegrationFreezeCollections.totalFreezeEntryCount,
      IntegrationFreezeLocks.length +
        IntegrationFreezeBaselines.length +
        IntegrationFreezeCompatibility.length +
        IntegrationFreezeExtensions.length,
    );
    assert.equal(
      IntegrationFreezeSummary.lockCount,
      IntegrationFreezeCollections.lockCount,
    );
    assert.equal(
      IntegrationFreezeSummary.totalFreezeEntryCount,
      IntegrationFreezeCollections.totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationFreezePlatform.inventory.countsDerivedFromCollections,
      true,
    );
  });

  it("is metadata-only with zero runtime freeze behavior", () => {
    const platform = IntegrationFreezePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeFreeze, false);
    assert.equal(platform.lockEnforcement, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL18_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(
        source,
        /from ["'][^"']*integrationPublicIndex[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:9[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationFreeze.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationCertification\.ts["']/);
    assert.equal(
      IntegrationFreezePlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for Public Index with stable summary", () => {
    assert.equal(
      IntegrationFreezeSummary.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationFreezeSummary.status, "Frozen");
    assert.equal(
      IntegrationFreezeSummary.nextPhase,
      "EIL-1:9 — Integration Public Index",
    );
    assert.equal(
      IntegrationFreezeSummary.certificationId,
      "EIL-1:7/IntegrationCertification",
    );
    assert.equal(Object.isFrozen(IntegrationFreezeSummary), true);
    assert.equal(IntegrationFreezeSummary.lockCount, 13);
    assert.equal(IntegrationFreezeSummary.baselineCount, 8);
    assert.equal(IntegrationFreezeSummary.compatibilityCount, 10);
    assert.equal(IntegrationFreezeSummary.extensionCount, 8);
    assert.equal(IntegrationFreezeSummary.totalFreezeEntryCount, 39);
  });
});
