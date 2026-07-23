/**
 * EIL-2:6 — Integration Connector Platform Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorManifestIdentity,
  IntegrationConnectorManifestPlatform,
  IntegrationConnectorInventoryManifest,
  IntegrationConnectorCompatibilityManifest,
} from "./integrationConnectorManifest.ts";
import * as PlatformModule from "./integrationConnectorPlatform.ts";
import {
  IntegrationConnectorPlatform,
  IntegrationConnectorPlatformCollections,
  IntegrationConnectorPlatformCompatibility,
  IntegrationConnectorPlatformComposition,
  IntegrationConnectorPlatformGuarantees,
  IntegrationConnectorPlatformIdentity,
  IntegrationConnectorPlatformInventory,
  IntegrationConnectorPlatformSummary,
} from "./integrationConnectorPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL26_FILES = Object.freeze([
  "integrationConnectorPlatformTypes.ts",
  "integrationConnectorPlatformIdentity.ts",
  "integrationConnectorPlatformComposition.ts",
  "integrationConnectorPlatformInventory.ts",
  "integrationConnectorPlatformGuarantees.ts",
  "integrationConnectorPlatformCompatibility.ts",
  "integrationConnectorPlatform.ts",
  "integrationConnectorPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorPlatformIdentity",
  "IntegrationConnectorPlatformComposition",
  "IntegrationConnectorPlatformInventory",
  "IntegrationConnectorPlatformGuarantees",
  "IntegrationConnectorPlatformCompatibility",
  "IntegrationConnectorPlatformCollections",
  "IntegrationConnectorPlatformSummary",
  "IntegrationConnectorPlatform",
] as const);

const EXPECTED_GUARANTEES = Object.freeze([
  "CanonicalComposition",
  "DeterministicIdentity",
  "ImmutableMetadata",
  "InventoryIntegrity",
  "DependencyIntegrity",
  "CompatibilityIntegrity",
  "NamespaceIntegrity",
  "ArchitecturalCompleteness",
  "MetadataOnlyArchitecture",
  "AggregateEntryPointIntegrity",
  "ReadinessIntegrity",
  "ReleaseConsistency",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Forward",
  "Version",
  "Namespace",
  "Release",
  "Architecture",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationConnectorManifest(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Manifest|Validation|Model|Registry|Foundation)(Types|Identity|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationConnector(Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Connector)/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertAscending = (ordinals: readonly number[], label: string): void => {
  assert.deepEqual(
    ordinals,
    [...ordinals].sort((a, b) => a - b),
    `${label} ordinals must be ascending`,
  );
};

describe("EIL-2:6 Integration Connector Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(EIL26_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL26_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationConnectorPlatformIdentity.phaseId, "EIL-2:6");
    assert.equal(
      IntegrationConnectorPlatformIdentity.canonicalId,
      "EIL-2:6/IntegrationConnectorPlatform",
    );
    assert.equal(
      IntegrationConnectorPlatformIdentity.name,
      "Integration Connector Platform",
    );
    assert.equal(IntegrationConnectorPlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorPlatformIdentity.namespace,
      "nexora.eil.integration-connector.platform",
    );
    assert.equal(IntegrationConnectorPlatformIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorPlatformIdentity.platform, "EIL-2");
    assert.equal(IntegrationConnectorPlatformIdentity.phaseType, "Platform");
    assert.equal(IntegrationConnectorPlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationConnectorPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationConnectorPlatform.status, "Platform");
    assert.equal(
      IntegrationConnectorPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationConnectorPlatform.nextPhase,
      "EIL-2:7 — Integration Connector Certification",
    );
  });

  it("declares Manifest as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationConnectorPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.manifestId,
      IntegrationConnectorManifestIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorManifest.ts",
    );
    assert.equal(
      IntegrationConnectorPlatformIdentity.manifestDependency,
      "EIL-2:5/IntegrationConnectorManifest",
    );
    assert.equal(
      IntegrationConnectorPlatformIdentity.manifestEntryPoint,
      "integrationConnectorManifest.ts",
    );
    assert.equal(dependency.manifestInternalImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorPlatform.manifestPlatform,
      IntegrationConnectorManifestPlatform,
    );
  });

  it("freezes composition, inventory, guarantees, compatibility, and summary", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorPlatformIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorPlatformComposition),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorPlatformInventory), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorPlatformGuarantees),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorPlatformCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorPlatformCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorPlatformSummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorPlatform), true);

    for (const entry of IntegrationConnectorPlatformGuarantees) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    for (const entry of IntegrationConnectorPlatformCompatibility) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
  });

  it("derives inventory dynamically from Manifest collections", () => {
    assert.equal(
      IntegrationConnectorPlatformInventory.manifestInventoryTotal,
      IntegrationConnectorInventoryManifest.totalInventoryCount,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.architectureManifestCount,
      1,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.dependencyManifestCount,
      1,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.compatibilityManifestCount,
      IntegrationConnectorCompatibilityManifest.declarationCount,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.validationSummaryCount,
      1,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.platformMetadataCount,
      8,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.aggregatePublicExports,
      8,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.countsDerivedFromManifest,
      true,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.hardcodedCounts,
      false,
    );
    assert.equal(
      IntegrationConnectorPlatformInventory.total,
      IntegrationConnectorInventoryManifest.totalInventoryCount +
        1 +
        1 +
        IntegrationConnectorCompatibilityManifest.declarationCount +
        1 +
        8 +
        8,
    );
    assert.equal(
      IntegrationConnectorPlatformCollections.total,
      IntegrationConnectorPlatformInventory.total,
    );
    assert.equal(
      IntegrationConnectorPlatformSummary.total,
      IntegrationConnectorPlatformInventory.total,
    );
    assert.equal(IntegrationConnectorPlatformInventory.total, 234);
  });

  it("publishes complete guarantees and compatibility with deterministic ordinals", () => {
    assert.equal(IntegrationConnectorPlatformGuarantees.length, 12);
    assert.deepEqual(
      IntegrationConnectorPlatformGuarantees.map((item) => item.key),
      [...EXPECTED_GUARANTEES],
    );
    assertAscending(
      IntegrationConnectorPlatformGuarantees.map((item) => item.ordinal),
      "guarantee",
    );

    assert.equal(IntegrationConnectorPlatformCompatibility.length, 10);
    assert.deepEqual(
      IntegrationConnectorPlatformCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationConnectorPlatformCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
  });

  it("preserves composition references and dependency direction", () => {
    assert.equal(
      IntegrationConnectorPlatformComposition.platformIdentity,
      "EIL-2:6/IntegrationConnectorPlatform",
    );
    assert.equal(
      IntegrationConnectorPlatformComposition.canonicalArchitecture,
      "EIL-2:5/Architecture",
    );
    assert.equal(
      IntegrationConnectorPlatformComposition.manifestReference,
      "EIL-2:5/IntegrationConnectorManifest",
    );
    assert.equal(
      IntegrationConnectorPlatformComposition.duplicatesUpstreamContents,
      false,
    );
    assert.equal(IntegrationConnectorPlatformComposition.ordinal, 1);
    assert.ok(
      IntegrationConnectorPlatformComposition.foundationReference.length > 0,
    );
    assert.ok(
      IntegrationConnectorPlatformComposition.registryReference.length > 0,
    );
    assert.ok(IntegrationConnectorPlatformComposition.modelReference.length > 0);
    assert.ok(
      IntegrationConnectorPlatformComposition.validationReference.length > 0,
    );
    assert.equal(
      IntegrationConnectorPlatformComposition.releaseLineage.length,
      5,
    );
  });

  it("is metadata-only with zero runtime connector behavior", () => {
    const platform = IntegrationConnectorPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
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

  it("has zero prohibited imports and Manifest as sole module dependency", () => {
    const sources = EIL26_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorCertification[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorPlatform.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorManifest\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Certification with stable summary", () => {
    assert.equal(
      IntegrationConnectorPlatformSummary.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationConnectorPlatformSummary.status, "Platform");
    assert.equal(
      IntegrationConnectorPlatformSummary.nextPhase,
      "EIL-2:7 — Integration Connector Certification",
    );
    assert.equal(
      IntegrationConnectorPlatformSummary.manifestId,
      "EIL-2:5/IntegrationConnectorManifest",
    );
    assert.equal(
      IntegrationConnectorPlatformSummary.architecturalCompleteness,
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorPlatformSummary), true);
    assert.equal(IntegrationConnectorPlatformSummary.guaranteeCount, 12);
    assert.equal(IntegrationConnectorPlatformSummary.compatibilityCount, 10);
    assert.equal(
      IntegrationConnectorPlatformSummary.manifestInventoryTotal,
      207,
    );
    assert.equal(IntegrationConnectorPlatformSummary.total, 234);
  });
});
