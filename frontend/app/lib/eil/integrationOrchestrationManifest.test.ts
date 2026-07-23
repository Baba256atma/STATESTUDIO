/**
 * EIL-4:5 — Integration Orchestration Manifest Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationValidationIdentity,
  IntegrationOrchestrationValidationPlatform,
} from "./integrationOrchestrationValidation.ts";
import * as ManifestModule from "./integrationOrchestrationManifest.ts";
import {
  IntegrationOrchestrationArchitectureManifest,
  IntegrationOrchestrationCompatibilityManifest,
  IntegrationOrchestrationDependencyManifest,
  IntegrationOrchestrationInventoryManifest,
  IntegrationOrchestrationManifestCollections,
  IntegrationOrchestrationManifestIdentity,
  IntegrationOrchestrationManifestPlatform,
  IntegrationOrchestrationManifestSummary,
} from "./integrationOrchestrationManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL45_FILES = Object.freeze([
  "integrationOrchestrationManifestTypes.ts",
  "integrationOrchestrationManifestIdentity.ts",
  "integrationOrchestrationArchitectureManifest.ts",
  "integrationOrchestrationInventoryManifest.ts",
  "integrationOrchestrationDependencyManifest.ts",
  "integrationOrchestrationCompatibilityManifest.ts",
  "integrationOrchestrationManifest.ts",
  "integrationOrchestrationManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationManifestIdentity",
  "IntegrationOrchestrationArchitectureManifest",
  "IntegrationOrchestrationInventoryManifest",
  "IntegrationOrchestrationDependencyManifest",
  "IntegrationOrchestrationCompatibilityManifest",
  "IntegrationOrchestrationManifestCollections",
  "IntegrationOrchestrationManifestSummary",
  "IntegrationOrchestrationManifestPlatform",
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
  /from ["']\.\/integrationOrchestrationValidation(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Validation|Model|Registry|Foundation)(Types|Identity|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationOrchestration(Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-4:5 Integration Orchestration Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(EIL45_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL45_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, namespace, version, Manifest status, and ReadyForPlatform", () => {
    assert.equal(IntegrationOrchestrationManifestIdentity.phaseId, "EIL-4:5");
    assert.equal(
      IntegrationOrchestrationManifestIdentity.canonicalId,
      "EIL-4:5/IntegrationOrchestrationManifest",
    );
    assert.equal(
      IntegrationOrchestrationManifestIdentity.name,
      "Integration Orchestration Manifest",
    );
    assert.equal(IntegrationOrchestrationManifestIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationManifestIdentity.namespace,
      "nexora.eil.integration-orchestration.manifest",
    );
    assert.equal(IntegrationOrchestrationManifestIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationManifestIdentity.platform, "EIL-4");
    assert.equal(
      IntegrationOrchestrationManifestIdentity.phaseType,
      "Manifest",
    );
    assert.equal(IntegrationOrchestrationManifestIdentity.status, "Manifest");
    assert.equal(
      IntegrationOrchestrationManifestIdentity.readiness,
      "ReadyForPlatform",
    );
    assert.equal(IntegrationOrchestrationManifestPlatform.status, "Manifest");
    assert.equal(
      IntegrationOrchestrationManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationOrchestrationManifestPlatform.nextPhase,
      "EIL-4:6 — Integration Orchestration Platform",
    );
  });

  it("declares Validation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationManifestPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.validationId,
      IntegrationOrchestrationValidationIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationValidation.ts",
    );
    assert.equal(
      IntegrationOrchestrationManifestIdentity.validationDependency,
      "EIL-4:4/IntegrationOrchestrationValidation",
    );
    assert.equal(
      IntegrationOrchestrationManifestIdentity.validationEntryPoint,
      "integrationOrchestrationValidation.ts",
    );
    assert.equal(dependency.validationInternalImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(
      IntegrationOrchestrationManifestPlatform.validationPlatform,
      IntegrationOrchestrationValidationPlatform,
    );
  });

  it("publishes immutable architecture, inventory, dependency, and compatibility manifests", () => {
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationArchitectureManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationInventoryManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationDependencyManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCompatibilityManifest),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationManifestCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationManifestSummary), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationManifestPlatform),
      true,
    );

    assert.equal(
      IntegrationOrchestrationArchitectureManifest.status,
      "Manifest",
    );
    assert.equal(
      IntegrationOrchestrationArchitectureManifest.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      IntegrationOrchestrationDependencyManifest.aggregateEntryPoint,
      "integrationOrchestrationValidation.ts",
    );
    assert.equal(
      IntegrationOrchestrationCompatibilityManifest.declarationCount,
      8,
    );
    assert.deepEqual(
      IntegrationOrchestrationCompatibilityManifest.declarations.map(
        (item) => item.scope,
      ),
      [...EXPECTED_COMPATIBILITY_SCOPES],
    );
    assertAscending(
      IntegrationOrchestrationCompatibilityManifest.declarations.map(
        (item) => item.ordinal,
      ),
      "compatibility",
    );
  });

  it("derives inventory dynamically as 207 from Validation → Model → Registry → Foundation", () => {
    const inventory = IntegrationOrchestrationInventoryManifest;
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
    assert.equal(inventory.publicExportCount, 32);
    assert.equal(inventory.totalInventoryCount, 207);
    assert.equal(inventory.countsDerivedFromUpstream, true);
    assert.equal(inventory.hardcodedCounts, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);
    assert.equal(
      IntegrationOrchestrationManifestCollections.totalInventoryCount,
      207,
    );
    assert.equal(
      IntegrationOrchestrationManifestSummary.totalInventoryCount,
      207,
    );
  });

  it("is metadata-only with zero runtime manifest behavior", () => {
    const platform = IntegrationOrchestrationManifestPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.triggerProcessing, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil4Phases, false);
  });

  it("has zero prohibited imports across manifest sources", () => {
    const sources = EIL45_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL45_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationValidation.ts",
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
