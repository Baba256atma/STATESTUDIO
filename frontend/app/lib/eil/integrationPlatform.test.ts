/**
 * EIL-1:6 — Integration Platform Tests.
 *
 * Deterministic coverage for the immutable Integration Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationInventoryManifest,
  IntegrationManifestIdentity,
  IntegrationManifestPlatform,
  IntegrationManifestSummary,
} from "./integrationManifest.ts";
import * as PlatformModule from "./integrationPlatform.ts";
import {
  IntegrationPlatform,
  IntegrationPlatformCollections,
  IntegrationPlatformCompatibility,
  IntegrationPlatformComposition,
  IntegrationPlatformGuarantees,
  IntegrationPlatformIdentity,
  IntegrationPlatformInventory,
  IntegrationPlatformSummary,
} from "./integrationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL16_FILES = Object.freeze([
  "integrationPlatformTypes.ts",
  "integrationPlatformIdentity.ts",
  "integrationPlatformComposition.ts",
  "integrationPlatformInventory.ts",
  "integrationPlatformGuarantees.ts",
  "integrationPlatformCompatibility.ts",
  "integrationPlatform.ts",
  "integrationPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPlatformIdentity",
  "IntegrationPlatformComposition",
  "IntegrationPlatformInventory",
  "IntegrationPlatformGuarantees",
  "IntegrationPlatformCompatibility",
  "IntegrationPlatformCollections",
  "IntegrationPlatformSummary",
  "IntegrationPlatform",
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
  /from ["']\.\/integrationManifest(?!\.ts["'])/,
  /from ["']\.\/integration(Manifest|Validation|Model|Registry|Foundation)(Types|Identity|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry)\.ts["']/,
  /from ["']\.\/integration(Validation|Model|Registry|Foundation)\.ts["']/,
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

describe("EIL-1:6 Integration Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(EIL16_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL16_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationPlatformIdentity.phaseId, "EIL-1:6");
    assert.equal(
      IntegrationPlatformIdentity.canonicalId,
      "EIL-1:6/IntegrationPlatform",
    );
    assert.equal(IntegrationPlatformIdentity.name, "Integration Platform");
    assert.equal(IntegrationPlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationPlatformIdentity.namespace,
      "nexora.eil.integration.platform",
    );
    assert.equal(IntegrationPlatformIdentity.layer, "EIL");
    assert.equal(IntegrationPlatformIdentity.platform, "EIL-1");
    assert.equal(IntegrationPlatformIdentity.phaseType, "Platform");
    assert.equal(IntegrationPlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationPlatform.status, "Platform");
    assert.equal(
      IntegrationPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationPlatform.nextPhase,
      "EIL-1:7 — Integration Certification",
    );
  });

  it("declares Manifest aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.manifestId,
      IntegrationManifestIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationManifest.ts",
    );
    assert.equal(
      IntegrationPlatformIdentity.manifestDependency,
      "EIL-1:5/IntegrationManifest",
    );
    assert.equal(
      IntegrationPlatformIdentity.manifestEntryPoint,
      "integrationManifest.ts",
    );
    assert.equal(dependency.manifestInternalImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationPlatform.manifestPlatform,
      IntegrationManifestPlatform,
    );
    assert.equal(
      IntegrationPlatformComposition.manifestReference,
      "EIL-1:5/IntegrationManifest",
    );
  });

  it("freezes composition, inventory, guarantees, compatibility, and summary", () => {
    assert.equal(Object.isFrozen(IntegrationPlatformIdentity), true);
    assert.equal(Object.isFrozen(IntegrationPlatformComposition), true);
    assert.equal(Object.isFrozen(IntegrationPlatformInventory), true);
    assert.equal(Object.isFrozen(IntegrationPlatformGuarantees), true);
    assert.equal(Object.isFrozen(IntegrationPlatformCompatibility), true);
    assert.equal(Object.isFrozen(IntegrationPlatformCollections), true);
    assert.equal(Object.isFrozen(IntegrationPlatformSummary), true);
    assert.equal(Object.isFrozen(IntegrationPlatform), true);

    for (const entry of IntegrationPlatformGuarantees) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    for (const entry of IntegrationPlatformCompatibility) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
  });

  it("derives inventory dynamically from Manifest collections", () => {
    assert.equal(
      IntegrationPlatformInventory.manifestInventoryTotal,
      IntegrationInventoryManifest.totalInventoryCount,
    );
    assert.equal(
      IntegrationPlatformInventory.manifestInventoryTotal,
      IntegrationManifestSummary.totalInventoryCount,
    );
    assert.equal(IntegrationPlatformInventory.architectureManifestCount, 1);
    assert.equal(IntegrationPlatformInventory.dependencyManifestCount, 1);
    assert.equal(
      IntegrationPlatformInventory.compatibilityManifestCount,
      IntegrationManifestPlatform.compatibility.declarationCount,
    );
    assert.equal(IntegrationPlatformInventory.validationSummaryCount, 1);
    assert.equal(IntegrationPlatformInventory.platformMetadataCount, 8);
    assert.equal(IntegrationPlatformInventory.aggregatePublicExports, 8);
    assert.equal(
      IntegrationPlatformInventory.total,
      IntegrationPlatformInventory.manifestInventoryTotal +
        IntegrationPlatformInventory.architectureManifestCount +
        IntegrationPlatformInventory.dependencyManifestCount +
        IntegrationPlatformInventory.compatibilityManifestCount +
        IntegrationPlatformInventory.validationSummaryCount +
        IntegrationPlatformInventory.platformMetadataCount +
        IntegrationPlatformInventory.aggregatePublicExports,
    );
    assert.equal(
      IntegrationPlatformInventory.countsDerivedFromManifest,
      true,
    );
    assert.equal(IntegrationPlatformInventory.hardcodedCounts, false);
    assert.equal(
      IntegrationPlatformCollections.total,
      IntegrationPlatformInventory.total,
    );
    assert.equal(
      IntegrationPlatformSummary.total,
      IntegrationPlatformInventory.total,
    );
  });

  it("publishes complete guarantees and compatibility with deterministic ordinals", () => {
    assert.deepEqual(
      IntegrationPlatformGuarantees.map((item) => item.key),
      [...EXPECTED_GUARANTEES],
    );
    assertUnique(
      IntegrationPlatformGuarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
    assertAscending(
      IntegrationPlatformGuarantees.map((item) => item.ordinal),
      "guarantee",
    );

    assert.deepEqual(
      IntegrationPlatformCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertUnique(
      IntegrationPlatformCompatibility.map((item) => item.compatibilityId),
      "compatibility IDs",
    );
    assertAscending(
      IntegrationPlatformCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
  });

  it("preserves composition references and dependency direction", () => {
    assert.equal(
      IntegrationPlatformComposition.duplicatesUpstreamContents,
      false,
    );
    assert.ok(
      IntegrationPlatformComposition.releaseLineage.length >= 5,
    );
    assert.ok(
      IntegrationPlatformComposition.foundationReference.includes("EIL-1:1"),
    );
    assert.ok(
      IntegrationPlatformComposition.registryReference.includes("EIL-1:2"),
    );
    assert.ok(
      IntegrationPlatformComposition.modelReference.includes("EIL-1:3"),
    );
    assert.ok(
      IntegrationPlatformComposition.validationReference.includes("EIL-1:4"),
    );
    assert.equal(
      IntegrationPlatform.dependency.canonicalPath,
      "EIL-1:6 → EIL-1:5 IntegrationManifestPlatform (exclusive)",
    );
  });

  it("is metadata-only with zero runtime behavior", () => {
    const platform = IntegrationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.validationEngine, false);
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
    assert.equal(platform.readiness.claimsRuntimeReady, false);
    assert.equal(platform.readiness.claimsFrozen, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL16_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationCertification[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[7-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationPlatform.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationManifest\.ts["']/);
    assert.equal(IntegrationPlatform.dependency.laterEilPhaseImport, false);
  });

  it("is ready for Certification with stable summary", () => {
    assert.equal(
      IntegrationPlatformSummary.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationPlatformSummary.status, "Platform");
    assert.equal(
      IntegrationPlatformSummary.nextPhase,
      "EIL-1:7 — Integration Certification",
    );
    assert.equal(
      IntegrationPlatformSummary.manifestId,
      "EIL-1:5/IntegrationManifest",
    );
    assert.equal(IntegrationPlatformSummary.architecturalCompleteness, true);
    assert.equal(Object.isFrozen(IntegrationPlatformSummary), true);
    assert.equal(IntegrationPlatformSummary.guaranteeCount, 12);
    assert.equal(IntegrationPlatformSummary.compatibilityCount, 10);
    assert.equal(IntegrationPlatformSummary.manifestInventoryTotal, 233);
    assert.ok(IntegrationPlatformSummary.total > 233);
  });
});
