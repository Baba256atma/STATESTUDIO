/**
 * EIL-2:8 — Integration Connector Freeze Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Freeze phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
} from "./integrationConnectorCertification.ts";
import * as FreezeModule from "./integrationConnectorFreeze.ts";
import {
  IntegrationConnectorFreezeBaselines,
  IntegrationConnectorFreezeCollections,
  IntegrationConnectorFreezeCompatibility,
  IntegrationConnectorFreezeExtensions,
  IntegrationConnectorFreezeIdentity,
  IntegrationConnectorFreezeLocks,
  IntegrationConnectorFreezePlatform,
  IntegrationConnectorFreezeSummary,
} from "./integrationConnectorFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL28_FILES = Object.freeze([
  "integrationConnectorFreezeTypes.ts",
  "integrationConnectorFreezeIdentity.ts",
  "integrationConnectorFreezeLocks.ts",
  "integrationConnectorFreezeBaselines.ts",
  "integrationConnectorFreezeCompatibility.ts",
  "integrationConnectorFreezeExtensions.ts",
  "integrationConnectorFreeze.ts",
  "integrationConnectorFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorFreezeIdentity",
  "IntegrationConnectorFreezeLocks",
  "IntegrationConnectorFreezeBaselines",
  "IntegrationConnectorFreezeCompatibility",
  "IntegrationConnectorFreezeExtensions",
  "IntegrationConnectorFreezeCollections",
  "IntegrationConnectorFreezeSummary",
  "IntegrationConnectorFreezePlatform",
] as const);

const EXPECTED_BASELINES = Object.freeze([
  "EIL-2:1",
  "EIL-2:2",
  "EIL-2:3",
  "EIL-2:4",
  "EIL-2:5",
  "EIL-2:6",
  "EIL-2:7",
  "EIL-2:8",
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
  /from ["']\.\/integrationConnectorCertification(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Certification|Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Criteria|Gates|Readiness|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle|ComplianceDeclarations)\.ts["']/,
  /from ["']\.\/integrationConnector(Platform|Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Connector)/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationConnectorPublicIndex/,
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

describe("EIL-2:8 Integration Connector Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(EIL28_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL28_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical identity, namespace, version, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationConnectorFreezeIdentity.phaseId, "EIL-2:8");
    assert.equal(
      IntegrationConnectorFreezeIdentity.canonicalId,
      "EIL-2:8/IntegrationConnectorFreeze",
    );
    assert.equal(
      IntegrationConnectorFreezeIdentity.name,
      "Integration Connector Freeze",
    );
    assert.equal(IntegrationConnectorFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorFreezeIdentity.namespace,
      "nexora.eil.integration-connector.freeze",
    );
    assert.equal(IntegrationConnectorFreezeIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorFreezeIdentity.platform, "EIL-2");
    assert.equal(IntegrationConnectorFreezeIdentity.phaseType, "Freeze");
    assert.equal(IntegrationConnectorFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationConnectorFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationConnectorFreezePlatform.status, "Frozen");
    assert.equal(
      IntegrationConnectorFreezePlatform.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationConnectorFreezePlatform.nextPhase,
      "EIL-2:9 — Integration Connector Public Index",
    );
  });

  it("declares Certification aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationConnectorFreezePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.certificationId,
      IntegrationConnectorCertificationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorCertification.ts",
    );
    assert.equal(
      IntegrationConnectorFreezeIdentity.certificationDependency,
      "EIL-2:7/IntegrationConnectorCertification",
    );
    assert.equal(
      IntegrationConnectorFreezeIdentity.certificationEntryPoint,
      "integrationConnectorCertification.ts",
    );
    assert.equal(dependency.certificationInternalImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorFreezePlatform.certificationPlatform,
      IntegrationConnectorCertificationPlatform,
    );
  });

  it("declares exactly one canonical platform lock EIL-2-INTEGRATION-CONNECTOR-LOCKED", () => {
    const canonicalLocks = IntegrationConnectorFreezeLocks.filter(
      (item) => item.isCanonicalPlatformLock,
    );
    assert.equal(canonicalLocks.length, 1);
    assert.equal(
      canonicalLocks[0]!.canonicalKey,
      "EIL-2-INTEGRATION-CONNECTOR-LOCKED",
    );
    assert.equal(
      IntegrationConnectorFreezePlatform.canonicalPlatformLock.canonicalKey,
      "EIL-2-INTEGRATION-CONNECTOR-LOCKED",
    );
    assert.equal(
      IntegrationConnectorFreezeSummary.canonicalPlatformLockKey,
      "EIL-2-INTEGRATION-CONNECTOR-LOCKED",
    );
    assert.equal(
      IntegrationConnectorFreezePlatform.inventory.canonicalPlatformLockCount,
      1,
    );
  });

  it("freezes locks, baselines, compatibility, and extensions", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeLocks), true);
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeBaselines), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorFreezeCompatibility),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeExtensions), true);
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeCollections), true);
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeSummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorFreezePlatform), true);

    for (const entry of IntegrationConnectorFreezeLocks) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    for (const entry of IntegrationConnectorFreezeBaselines) {
      assert.equal(Object.isFrozen(entry), true);
    }
    for (const entry of IntegrationConnectorFreezeCompatibility) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
    for (const entry of IntegrationConnectorFreezeExtensions) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
  });

  it("publishes complete architectural locks, baselines, and policies with deterministic ordinals", () => {
    const architectural = IntegrationConnectorFreezeLocks.filter(
      (item) => !item.isCanonicalPlatformLock,
    );
    assert.deepEqual(
      architectural.map((item) => item.canonicalKey),
      [...EXPECTED_ARCHITECTURAL_LOCKS],
    );
    assert.equal(architectural.length, 12);
    assert.equal(IntegrationConnectorFreezeLocks.length, 13);

    assert.deepEqual(
      IntegrationConnectorFreezeBaselines.map((item) => item.sourcePhase),
      [...EXPECTED_BASELINES],
    );
    assert.equal(IntegrationConnectorFreezeCompatibility.length, 10);
    assert.equal(IntegrationConnectorFreezeExtensions.length, 8);

    assertUnique(
      IntegrationConnectorFreezeLocks.map((item) => item.lockId),
      "lock IDs",
    );
    assertAscending(
      IntegrationConnectorFreezeLocks.map((item) => item.ordinal),
      "lock",
    );
    assertAscending(
      IntegrationConnectorFreezeBaselines.map((item) => item.ordinal),
      "baseline",
    );
    assertAscending(
      IntegrationConnectorFreezeCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
    assertAscending(
      IntegrationConnectorFreezeExtensions.map((item) => item.ordinal),
      "extension",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationConnectorFreezeCollections.lockCount,
      IntegrationConnectorFreezeLocks.length,
    );
    assert.equal(
      IntegrationConnectorFreezeCollections.baselineCount,
      IntegrationConnectorFreezeBaselines.length,
    );
    assert.equal(
      IntegrationConnectorFreezeCollections.compatibilityCount,
      IntegrationConnectorFreezeCompatibility.length,
    );
    assert.equal(
      IntegrationConnectorFreezeCollections.extensionCount,
      IntegrationConnectorFreezeExtensions.length,
    );
    assert.equal(
      IntegrationConnectorFreezeCollections.totalFreezeEntryCount,
      IntegrationConnectorFreezeLocks.length +
        IntegrationConnectorFreezeBaselines.length +
        IntegrationConnectorFreezeCompatibility.length +
        IntegrationConnectorFreezeExtensions.length,
    );
    assert.equal(
      IntegrationConnectorFreezeSummary.lockCount,
      IntegrationConnectorFreezeCollections.lockCount,
    );
    assert.equal(
      IntegrationConnectorFreezeSummary.totalFreezeEntryCount,
      IntegrationConnectorFreezeCollections.totalFreezeEntryCount,
    );
    assert.equal(
      IntegrationConnectorFreezePlatform.inventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationConnectorFreezeSummary.totalFreezeEntryCount, 39);
  });

  it("is metadata-only with zero runtime freeze behavior", () => {
    const platform = IntegrationConnectorFreezePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeFreeze, false);
    assert.equal(platform.lockEnforcement, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.endpointExecution, false);
    assert.equal(platform.protocolExecution, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.authenticationLogic, false);
    assert.equal(platform.authorizationLogic, false);
    assert.equal(platform.encryptionBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
  });

  it("has zero prohibited imports and Certification as sole module dependency", () => {
    const sources = EIL28_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorPublicIndex[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorFreeze.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorCertification\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorFreezePlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Public Index with stable summary", () => {
    assert.equal(
      IntegrationConnectorFreezeSummary.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(IntegrationConnectorFreezeSummary.status, "Frozen");
    assert.equal(
      IntegrationConnectorFreezeSummary.nextPhase,
      "EIL-2:9 — Integration Connector Public Index",
    );
    assert.equal(
      IntegrationConnectorFreezeSummary.certificationId,
      "EIL-2:7/IntegrationConnectorCertification",
    );
    assert.equal(Object.isFrozen(IntegrationConnectorFreezeSummary), true);
    assert.equal(IntegrationConnectorFreezeSummary.lockCount, 13);
    assert.equal(IntegrationConnectorFreezeSummary.baselineCount, 8);
    assert.equal(IntegrationConnectorFreezeSummary.compatibilityCount, 10);
    assert.equal(IntegrationConnectorFreezeSummary.extensionCount, 8);
    assert.equal(IntegrationConnectorFreezeSummary.totalFreezeEntryCount, 39);
  });
});
