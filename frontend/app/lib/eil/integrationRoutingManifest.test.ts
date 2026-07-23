/**
 * EIL-3:5 — Integration Routing Manifest Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingValidationIdentity,
  IntegrationRoutingValidationPlatform,
} from "./integrationRoutingValidation.ts";
import * as ManifestModule from "./integrationRoutingManifest.ts";
import {
  IntegrationRoutingArchitectureManifest,
  IntegrationRoutingCompatibilityManifest,
  IntegrationRoutingDependencyManifest,
  IntegrationRoutingInventoryManifest,
  IntegrationRoutingManifestCollections,
  IntegrationRoutingManifestIdentity,
  IntegrationRoutingManifestPlatform,
  IntegrationRoutingManifestSummary,
} from "./integrationRoutingManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL35_FILES = Object.freeze([
  "integrationRoutingManifestTypes.ts",
  "integrationRoutingManifestIdentity.ts",
  "integrationRoutingArchitectureManifest.ts",
  "integrationRoutingInventoryManifest.ts",
  "integrationRoutingDependencyManifest.ts",
  "integrationRoutingCompatibilityManifest.ts",
  "integrationRoutingManifest.ts",
  "integrationRoutingManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingManifestIdentity",
  "IntegrationRoutingArchitectureManifest",
  "IntegrationRoutingInventoryManifest",
  "IntegrationRoutingDependencyManifest",
  "IntegrationRoutingCompatibilityManifest",
  "IntegrationRoutingManifestCollections",
  "IntegrationRoutingManifestSummary",
  "IntegrationRoutingManifestPlatform",
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
  /from ["']\.\/integrationRoutingValidation(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Validation|Model|Registry|Foundation)(Types|Identity|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationRouting(Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting(Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-3:5 Integration Routing Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(EIL35_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL35_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationRoutingManifestIdentity.phaseId, "EIL-3:5");
    assert.equal(
      IntegrationRoutingManifestIdentity.canonicalId,
      "EIL-3:5/IntegrationRoutingManifest",
    );
    assert.equal(
      IntegrationRoutingManifestIdentity.name,
      "Integration Routing Manifest",
    );
    assert.equal(IntegrationRoutingManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingManifestIdentity.namespace,
      "nexora.eil.integration-routing.manifest",
    );
    assert.equal(IntegrationRoutingManifestIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingManifestIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingManifestIdentity.phaseType, "Manifest");
    assert.equal(IntegrationRoutingManifestIdentity.status, "Manifest");
    assert.equal(
      IntegrationRoutingManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(IntegrationRoutingManifestPlatform.status, "Manifest");
    assert.equal(
      IntegrationRoutingManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationRoutingManifestPlatform.nextPhase,
      "EIL-3:6 — Integration Routing Platform",
    );
  });

  it("declares Validation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingManifestPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      IntegrationRoutingValidationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingValidation.ts",
    );
    assert.equal(
      IntegrationRoutingManifestIdentity.validationDependency,
      "EIL-3:4/IntegrationRoutingValidation",
    );
    assert.equal(
      IntegrationRoutingManifestIdentity.validationEntryPoint,
      "integrationRoutingValidation.ts",
    );
    assert.equal(dependency.validationInternalImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingManifestPlatform.validationPlatform,
      IntegrationRoutingValidationPlatform,
    );
  });

  it("publishes immutable architecture, inventory, dependency, and compatibility manifests", () => {
    assert.equal(Object.isFrozen(IntegrationRoutingArchitectureManifest), true);
    assert.equal(Object.isFrozen(IntegrationRoutingInventoryManifest), true);
    assert.equal(Object.isFrozen(IntegrationRoutingDependencyManifest), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingCompatibilityManifest),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingManifestCollections), true);
    assert.equal(Object.isFrozen(IntegrationRoutingManifestSummary), true);
    assert.equal(Object.isFrozen(IntegrationRoutingManifestPlatform), true);

    assert.equal(
      IntegrationRoutingArchitectureManifest.status,
      "Manifest",
    );
    assert.equal(
      IntegrationRoutingArchitectureManifest.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationRoutingDependencyManifest.aggregateEntryPoint,
      "integrationRoutingValidation.ts",
    );
    assert.equal(
      IntegrationRoutingDependencyManifest.phaseDependencyCount,
      1,
    );
  });

  it("publishes eight compatibility scopes in deterministic order", () => {
    const { declarations } = IntegrationRoutingCompatibilityManifest;
    assert.equal(declarations.length, 8);
    assert.equal(
      IntegrationRoutingCompatibilityManifest.declarationCount,
      declarations.length,
    );
    assert.deepEqual(
      declarations.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY_SCOPES],
    );
    assertAscending(
      declarations.map((item) => item.ordinal),
      "compatibility",
    );
    assert.ok(declarations.every((item) => item.runtimeValidated === false));
    assert.ok(declarations.every((item) => Object.isFrozen(item)));
  });

  it("derives inventory dynamically from upstream canonical collections", () => {
    const inventory = IntegrationRoutingInventoryManifest;
    const validation = IntegrationRoutingValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;

    assert.equal(inventory.countsDerivedFromUpstream, true);
    assert.equal(inventory.hardcodedCounts, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);

    assert.equal(inventory.foundationCategoryCount, foundation.categories.length);
    assert.equal(inventory.foundationContractCount, foundation.contracts.length);
    assert.equal(
      inventory.foundationCapabilityCount,
      foundation.capabilityDeclarations.length,
    );
    assert.equal(
      inventory.foundationResponsibilityCount,
      foundation.responsibilityDeclarations.length,
    );
    assert.equal(
      inventory.lifecycleStateCount,
      foundation.lifecycle.stateCount,
    );
    assert.equal(
      inventory.registryEntryCount,
      registry.collections.totalRegistryEntryCount,
    );
    assert.equal(inventory.domainModelCount, model.domains.length);
    assert.equal(inventory.relationshipModelCount, model.relationships.length);
    assert.equal(inventory.topologyModelCount, model.topologies.length);
    assert.equal(inventory.lifecycleModelCount, model.lifecycles.length);
    assert.equal(inventory.validationRuleCount, validation.rules.length);
    assert.equal(inventory.validationCategoryCount, validation.categories.length);
    assert.equal(inventory.validationFindingCount, validation.findings.length);
    assert.equal(inventory.publicExportCount, 32);

    assert.equal(inventory.foundationCategoryCount, 10);
    assert.equal(inventory.foundationContractCount, 10);
    assert.equal(inventory.foundationCapabilityCount, 10);
    assert.equal(inventory.foundationResponsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.registryEntryCount, 38);
    assert.equal(inventory.domainModelCount, 16);
    assert.equal(inventory.relationshipModelCount, 12);
    assert.equal(inventory.topologyModelCount, 8);
    assert.equal(inventory.lifecycleModelCount, 8);
    assert.equal(inventory.validationRuleCount, 26);
    assert.equal(inventory.validationCategoryCount, 16);
    assert.equal(inventory.validationFindingCount, 5);
    assert.equal(inventory.totalInventoryCount, 207);

    assert.equal(
      IntegrationRoutingManifestCollections.totalInventoryCount,
      inventory.totalInventoryCount,
    );
    assert.equal(
      IntegrationRoutingManifestSummary.totalInventoryCount,
      inventory.totalInventoryCount,
    );
  });

  it("is metadata-only with zero runtime behavior", () => {
    const platform = IntegrationRoutingManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.businessLogicBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil3Phases, false);
    assert.equal(platform.readiness.claimsRuntimeReady, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL35_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(source, /\b(fetch|axios|http\.request)\b/);
      assert.doesNotMatch(source, /\b(setTimeout|setInterval|Promise)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }
  });

  it("passes strict TypeScript and ESLint for manifest sources", () => {
    const sources = EIL35_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil", name),
    );

    const tsc = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/tsc"),
      [
        "--strict",
        "--noEmit",
        "--pretty",
        "false",
        "--allowImportingTsExtensions",
        "--module",
        "esnext",
        "--moduleResolution",
        "bundler",
        "--target",
        "ES2017",
        "--esModuleInterop",
        "--skipLibCheck",
        "--types",
        "node",
        ...sources,
        "app/lib/eil/integrationRoutingValidation.ts",
      ],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      tsc.status,
      0,
      `TypeScript failed:\n${tsc.stdout}\n${tsc.stderr}`,
    );

    const eslint = spawnSync(
      join(FRONTEND_ROOT, "node_modules/.bin/eslint"),
      [...sources],
      {
        cwd: FRONTEND_ROOT,
        encoding: "utf8",
      },
    );
    assert.equal(
      eslint.status,
      0,
      `ESLint failed:\n${eslint.stdout}\n${eslint.stderr}`,
    );
  });
});
