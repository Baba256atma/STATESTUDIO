/**
 * EIL-1:5 — Integration Manifest Tests.
 *
 * Deterministic coverage for the immutable Integration Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationValidationIdentity,
  IntegrationValidationPlatform,
} from "./integrationValidation.ts";
import * as ManifestModule from "./integrationManifest.ts";
import {
  IntegrationArchitectureManifest,
  IntegrationCompatibilityManifest,
  IntegrationDependencyManifest,
  IntegrationInventoryManifest,
  IntegrationManifestCollections,
  IntegrationManifestIdentity,
  IntegrationManifestPlatform,
  IntegrationManifestSummary,
} from "./integrationManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL15_FILES = Object.freeze([
  "integrationManifestTypes.ts",
  "integrationManifestIdentity.ts",
  "integrationArchitectureManifest.ts",
  "integrationInventoryManifest.ts",
  "integrationDependencyManifest.ts",
  "integrationCompatibilityManifest.ts",
  "integrationManifest.ts",
  "integrationManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationManifestIdentity",
  "IntegrationArchitectureManifest",
  "IntegrationInventoryManifest",
  "IntegrationDependencyManifest",
  "IntegrationCompatibilityManifest",
  "IntegrationManifestCollections",
  "IntegrationManifestSummary",
  "IntegrationManifestPlatform",
] as const);

const EXPECTED_COMPATIBILITY_SCOPES = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Forward",
  "Version",
  "Namespace",
  "Architecture",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationValidation(?!\.ts["'])/,
  /from ["']\.\/integration(Validation|Model|Registry|Foundation)(Types|Identity|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry)\.ts["']/,
  /from ["']\.\/integration(Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\.\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']react["']/,
  /from ["']next\//,
]);

describe("EIL-1:5 Integration Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(EIL15_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL15_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationManifestIdentity.phaseId, "EIL-1:5");
    assert.equal(
      IntegrationManifestIdentity.canonicalId,
      "EIL-1:5/IntegrationManifest",
    );
    assert.equal(IntegrationManifestIdentity.name, "Integration Manifest");
    assert.equal(IntegrationManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationManifestIdentity.namespace,
      "nexora.eil.integration.manifest",
    );
    assert.equal(IntegrationManifestIdentity.layer, "EIL");
    assert.equal(IntegrationManifestIdentity.platform, "EIL-1");
    assert.equal(IntegrationManifestIdentity.phaseType, "Manifest");
    assert.equal(IntegrationManifestIdentity.status, "Manifest");
    assert.equal(IntegrationManifestIdentity.readiness, "ReadyForPlatform");
    assert.equal(IntegrationManifestPlatform.status, "Manifest");
    assert.equal(
      IntegrationManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationManifestPlatform.nextPhase,
      "EIL-1:6 — Integration Platform",
    );
  });

  it("declares Validation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationManifestPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      IntegrationValidationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationValidation.ts",
    );
    assert.equal(
      IntegrationManifestIdentity.validationDependency,
      "EIL-1:4/IntegrationValidation",
    );
    assert.equal(
      IntegrationManifestIdentity.validationEntryPoint,
      "integrationValidation.ts",
    );
    assert.equal(dependency.validationInternalImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationManifestPlatform.validationPlatform,
      IntegrationValidationPlatform,
    );
    assert.equal(
      IntegrationDependencyManifest.aggregateEntryPoint,
      "integrationValidation.ts",
    );
    assert.equal(
      IntegrationDependencyManifest.dependencyDirection,
      "Validation → Manifest",
    );
  });

  it("freezes architecture, inventory, dependency, compatibility, and summary", () => {
    assert.equal(Object.isFrozen(IntegrationManifestIdentity), true);
    assert.equal(Object.isFrozen(IntegrationArchitectureManifest), true);
    assert.equal(Object.isFrozen(IntegrationInventoryManifest), true);
    assert.equal(Object.isFrozen(IntegrationDependencyManifest), true);
    assert.equal(Object.isFrozen(IntegrationCompatibilityManifest), true);
    assert.equal(Object.isFrozen(IntegrationManifestCollections), true);
    assert.equal(Object.isFrozen(IntegrationManifestSummary), true);
    assert.equal(Object.isFrozen(IntegrationManifestPlatform), true);
    assert.equal(
      Object.isFrozen(IntegrationCompatibilityManifest.declarations),
      true,
    );
    for (const entry of IntegrationCompatibilityManifest.declarations) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
  });

  it("derives inventory dynamically from upstream canonical collections", () => {
    const validation = IntegrationValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;

    assert.equal(
      IntegrationInventoryManifest.foundationContractCount,
      registry.contracts.length,
    );
    assert.equal(
      IntegrationInventoryManifest.foundationCapabilityCount,
      registry.capabilities.length,
    );
    assert.equal(
      IntegrationInventoryManifest.foundationResponsibilityCount,
      registry.responsibilities.length,
    );
    assert.equal(
      IntegrationInventoryManifest.lifecycleStateCount,
      model.lifecycle.length,
    );
    assert.equal(
      IntegrationInventoryManifest.registryEntryCount,
      registry.collections.totalRegistryEntryCount,
    );
    assert.equal(
      IntegrationInventoryManifest.domainModelCount,
      model.domains.length,
    );
    assert.equal(
      IntegrationInventoryManifest.relationshipModelCount,
      model.relationships.length,
    );
    assert.equal(
      IntegrationInventoryManifest.topologyModelCount,
      model.topology.length,
    );
    assert.equal(
      IntegrationInventoryManifest.validationRuleCount,
      validation.rules.length,
    );
    assert.equal(
      IntegrationInventoryManifest.validationCategoryCount,
      validation.categories.length,
    );
    assert.equal(
      IntegrationInventoryManifest.validationFindingCount,
      validation.findings.length,
    );
    assert.equal(
      IntegrationInventoryManifest.publicExportCount,
      registry.foundationPlatform.apiRegistry.length * 4,
    );
    assert.equal(IntegrationInventoryManifest.countsDerivedFromUpstream, true);
    assert.equal(IntegrationInventoryManifest.hardcodedCounts, false);
    assert.equal(
      IntegrationManifestCollections.totalInventoryCount,
      IntegrationInventoryManifest.totalInventoryCount,
    );
    assert.equal(
      IntegrationManifestSummary.totalInventoryCount,
      IntegrationInventoryManifest.totalInventoryCount,
    );
  });

  it("publishes complete compatibility declarations with deterministic ordinals", () => {
    assert.equal(IntegrationCompatibilityManifest.declarationCount, 8);
    assert.deepEqual(
      IntegrationCompatibilityManifest.declarations.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY_SCOPES],
    );
    const ordinals = IntegrationCompatibilityManifest.declarations.map(
      (item) => item.ordinal,
    );
    assert.deepEqual(
      ordinals,
      [...ordinals].sort((a, b) => a - b),
    );
    assert.equal(
      new Set(
        IntegrationCompatibilityManifest.declarations.map(
          (item) => item.compatibilityId,
        ),
      ).size,
      8,
    );
  });

  it("preserves architecture lineage and dependency direction", () => {
    assert.deepEqual(
      [...IntegrationArchitectureManifest.sourcePhases],
      ["EIL-1:1", "EIL-1:2", "EIL-1:3", "EIL-1:4", "EIL-1:5"],
    );
    assert.equal(IntegrationArchitectureManifest.releaseLineage.length, 4);
    assert.ok(
      IntegrationArchitectureManifest.canonicalReferences.includes(
        IntegrationValidationIdentity.canonicalId,
      ),
    );
    assert.equal(IntegrationDependencyManifest.phaseDependencyCount, 1);
    assert.equal(
      IntegrationDependencyManifest.upstreamDependency,
      "EIL-1:4/IntegrationValidation",
    );
  });

  it("is metadata-only with zero runtime behavior", () => {
    const platform = IntegrationManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.serviceDiscovery, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
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
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
    assert.equal(platform.readiness.claimsRuntimeReady, false);
    assert.equal(platform.readiness.claimsReadyForCertification, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL15_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationPlatform[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[6-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationManifest.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationValidation\.ts["']/);
    assert.equal(
      IntegrationManifestPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for the Platform phase with stable summary", () => {
    assert.equal(IntegrationManifestSummary.readiness, "ReadyForPlatform");
    assert.equal(IntegrationManifestSummary.status, "Manifest");
    assert.equal(
      IntegrationManifestSummary.nextPhase,
      "EIL-1:6 — Integration Platform",
    );
    assert.equal(
      IntegrationManifestSummary.validationId,
      "EIL-1:4/IntegrationValidation",
    );
    assert.equal(IntegrationManifestSummary.validationStatus, "Validation");
    assert.equal(IntegrationManifestSummary.architecturalCompleteness, true);
    assert.equal(Object.isFrozen(IntegrationManifestSummary), true);
    assert.equal(IntegrationManifestSummary.foundationContractCount, 10);
    assert.equal(IntegrationManifestSummary.domainModelCount, 16);
    assert.ok(IntegrationManifestSummary.registryEntryCount > 0);
    assert.ok(IntegrationManifestSummary.validationRuleCount >= 24);
    assert.ok(IntegrationManifestSummary.totalInventoryCount > 50);
  });
});
