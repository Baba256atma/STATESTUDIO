/**
 * EIL-2:5 — Integration Connector Manifest Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorValidationIdentity,
  IntegrationConnectorValidationPlatform,
} from "./integrationConnectorValidation.ts";
import * as ManifestModule from "./integrationConnectorManifest.ts";
import {
  IntegrationConnectorArchitectureManifest,
  IntegrationConnectorCompatibilityManifest,
  IntegrationConnectorDependencyManifest,
  IntegrationConnectorInventoryManifest,
  IntegrationConnectorManifestCollections,
  IntegrationConnectorManifestIdentity,
  IntegrationConnectorManifestPlatform,
  IntegrationConnectorManifestSummary,
} from "./integrationConnectorManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL25_FILES = Object.freeze([
  "integrationConnectorManifestTypes.ts",
  "integrationConnectorManifestIdentity.ts",
  "integrationConnectorArchitectureManifest.ts",
  "integrationConnectorInventoryManifest.ts",
  "integrationConnectorDependencyManifest.ts",
  "integrationConnectorCompatibilityManifest.ts",
  "integrationConnectorManifest.ts",
  "integrationConnectorManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorManifestIdentity",
  "IntegrationConnectorArchitectureManifest",
  "IntegrationConnectorInventoryManifest",
  "IntegrationConnectorDependencyManifest",
  "IntegrationConnectorCompatibilityManifest",
  "IntegrationConnectorManifestCollections",
  "IntegrationConnectorManifestSummary",
  "IntegrationConnectorManifestPlatform",
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
  /from ["']\.\/integrationConnectorValidation(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Validation|Model|Registry|Foundation)(Types|Identity|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationConnector(Model|Registry|Foundation)\.ts["']/,
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

describe("EIL-2:5 Integration Connector Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(EIL25_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL25_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationConnectorManifestIdentity.phaseId, "EIL-2:5");
    assert.equal(
      IntegrationConnectorManifestIdentity.canonicalId,
      "EIL-2:5/IntegrationConnectorManifest",
    );
    assert.equal(
      IntegrationConnectorManifestIdentity.name,
      "Integration Connector Manifest",
    );
    assert.equal(IntegrationConnectorManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorManifestIdentity.namespace,
      "nexora.eil.integration-connector.manifest",
    );
    assert.equal(IntegrationConnectorManifestIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorManifestIdentity.platform, "EIL-2");
    assert.equal(IntegrationConnectorManifestIdentity.phaseType, "Manifest");
    assert.equal(IntegrationConnectorManifestIdentity.status, "Manifest");
    assert.equal(
      IntegrationConnectorManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(IntegrationConnectorManifestPlatform.status, "Manifest");
    assert.equal(
      IntegrationConnectorManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationConnectorManifestPlatform.nextPhase,
      "EIL-2:6 — Integration Connector Platform",
    );
  });

  it("declares Validation as the sole phase dependency via aggregate entry point", () => {
    const { dependency } = IntegrationConnectorManifestPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      IntegrationConnectorValidationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorValidation.ts",
    );
    assert.equal(
      IntegrationConnectorManifestIdentity.validationDependency,
      "EIL-2:4/IntegrationConnectorValidation",
    );
    assert.equal(
      IntegrationConnectorManifestIdentity.validationEntryPoint,
      "integrationConnectorValidation.ts",
    );
    assert.equal(dependency.validationInternalImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorManifestPlatform.validationPlatform,
      IntegrationConnectorValidationPlatform,
    );
    assert.equal(
      IntegrationConnectorDependencyManifest.dependencyDirection,
      "Validation → Manifest",
    );
  });

  it("freezes architecture, inventory, dependency, compatibility, and summary", () => {
    assert.equal(Object.isFrozen(IntegrationConnectorManifestIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorArchitectureManifest),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorInventoryManifest), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorDependencyManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCompatibilityManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorManifestCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorManifestSummary), true);
    assert.equal(Object.isFrozen(IntegrationConnectorManifestPlatform), true);
    assert.equal(
      Object.isFrozen(
        IntegrationConnectorCompatibilityManifest.declarations,
      ),
      true,
    );
    for (const entry of IntegrationConnectorCompatibilityManifest.declarations) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeValidated, false);
    }
  });

  it("derives inventory dynamically from upstream canonical collections", () => {
    const validation = IntegrationConnectorValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;

    assert.equal(
      IntegrationConnectorInventoryManifest.foundationCategoryCount,
      foundation.categories.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.foundationContractCount,
      registry.contracts.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.foundationCapabilityCount,
      registry.capabilities.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.foundationResponsibilityCount,
      registry.responsibilities.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.lifecycleStateCount,
      registry.inventory.lifecycleStateCount,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.registryEntryCount,
      registry.collections.totalRegistryEntryCount,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.domainModelCount,
      model.domains.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.relationshipModelCount,
      model.relationships.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.endpointModelCount,
      model.endpoints.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.protocolModelCount,
      model.protocols.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.validationRuleCount,
      validation.rules.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.validationCategoryCount,
      validation.categories.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.validationFindingCount,
      validation.findings.length,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.publicExportCount,
      foundation.apiRegistry.length * 4,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.countsDerivedFromUpstream,
      true,
    );
    assert.equal(
      IntegrationConnectorInventoryManifest.hardcodedCounts,
      false,
    );
    assert.equal(
      IntegrationConnectorManifestCollections.totalInventoryCount,
      IntegrationConnectorInventoryManifest.totalInventoryCount,
    );
    assert.equal(
      IntegrationConnectorManifestSummary.totalInventoryCount,
      IntegrationConnectorInventoryManifest.totalInventoryCount,
    );
  });

  it("publishes complete compatibility declarations with deterministic ordinals", () => {
    assert.equal(
      IntegrationConnectorCompatibilityManifest.declarationCount,
      8,
    );
    assert.deepEqual(
      IntegrationConnectorCompatibilityManifest.declarations.map(
        (item) => item.scope,
      ),
      [...EXPECTED_COMPATIBILITY_SCOPES],
    );
    assertAscending(
      IntegrationConnectorCompatibilityManifest.declarations.map(
        (item) => item.ordinal,
      ),
      "compatibility",
    );
    assert.equal(IntegrationConnectorArchitectureManifest.ordinal, 1);
    assert.deepEqual(
      [...IntegrationConnectorArchitectureManifest.sourcePhases],
      ["EIL-2:1", "EIL-2:2", "EIL-2:3", "EIL-2:4", "EIL-2:5"],
    );
  });

  it("preserves architecture lineage and dependency direction", () => {
    assert.equal(
      IntegrationConnectorArchitectureManifest.platformIdentity,
      "EIL-2",
    );
    assert.equal(
      IntegrationConnectorArchitectureManifest.architectureIdentity,
      "EIL-2:5/IntegrationConnectorManifest",
    );
    assert.equal(
      IntegrationConnectorArchitectureManifest.canonicalReferences.length,
      4,
    );
    assert.equal(
      IntegrationConnectorDependencyManifest.aggregateEntryPoint,
      "integrationConnectorValidation.ts",
    );
    assert.equal(
      IntegrationConnectorDependencyManifest.phaseDependencyCount,
      1,
    );
    assert.equal(
      IntegrationConnectorDependencyManifest.laterEil2PhaseImport,
      false,
    );
    assert.equal(IntegrationConnectorDependencyManifest.eil1Dependency, false);
  });

  it("is metadata-only with zero runtime connector behavior", () => {
    const platform = IntegrationConnectorManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.validationEngine, false);
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
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
  });

  it("has zero prohibited imports and Validation as sole module dependency", () => {
    const sources = EIL25_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorPlatform[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorManifest.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorValidation\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorManifestPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Platform with stable summary", () => {
    assert.equal(
      IntegrationConnectorManifestSummary.readiness,
      "ReadyForPlatform",
    );
    assert.equal(IntegrationConnectorManifestSummary.status, "Manifest");
    assert.equal(
      IntegrationConnectorManifestSummary.nextPhase,
      "EIL-2:6 — Integration Connector Platform",
    );
    assert.equal(
      IntegrationConnectorManifestSummary.validationId,
      "EIL-2:4/IntegrationConnectorValidation",
    );
    assert.equal(
      IntegrationConnectorManifestSummary.architecturalCompleteness,
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorManifestSummary), true);
    assert.equal(
      IntegrationConnectorManifestSummary.foundationCategoryCount,
      10,
    );
    assert.equal(IntegrationConnectorManifestSummary.registryEntryCount, 38);
    assert.equal(IntegrationConnectorManifestSummary.domainModelCount, 16);
    assert.equal(IntegrationConnectorManifestSummary.validationRuleCount, 26);
    assert.equal(IntegrationConnectorManifestSummary.totalInventoryCount, 207);
  });
});
