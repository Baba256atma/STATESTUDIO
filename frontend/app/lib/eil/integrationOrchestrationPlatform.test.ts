/**
 * EIL-4:6 — Integration Orchestration Platform Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationCompatibilityManifest,
  IntegrationOrchestrationInventoryManifest,
  IntegrationOrchestrationManifestIdentity,
  IntegrationOrchestrationManifestPlatform,
} from "./integrationOrchestrationManifest.ts";
import * as PlatformModule from "./integrationOrchestrationPlatform.ts";
import {
  IntegrationOrchestrationPlatform,
  IntegrationOrchestrationPlatformCollections,
  IntegrationOrchestrationPlatformCompatibility,
  IntegrationOrchestrationPlatformComposition,
  IntegrationOrchestrationPlatformGuarantees,
  IntegrationOrchestrationPlatformIdentity,
  IntegrationOrchestrationPlatformInventory,
  IntegrationOrchestrationPlatformSummary,
} from "./integrationOrchestrationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL46_FILES = Object.freeze([
  "integrationOrchestrationPlatformTypes.ts",
  "integrationOrchestrationPlatformIdentity.ts",
  "integrationOrchestrationPlatformComposition.ts",
  "integrationOrchestrationPlatformInventory.ts",
  "integrationOrchestrationPlatformGuarantees.ts",
  "integrationOrchestrationPlatformCompatibility.ts",
  "integrationOrchestrationPlatform.ts",
  "integrationOrchestrationPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationPlatformIdentity",
  "IntegrationOrchestrationPlatformComposition",
  "IntegrationOrchestrationPlatformInventory",
  "IntegrationOrchestrationPlatformGuarantees",
  "IntegrationOrchestrationPlatformCompatibility",
  "IntegrationOrchestrationPlatformCollections",
  "IntegrationOrchestrationPlatformSummary",
  "IntegrationOrchestrationPlatform",
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
  /from ["']\.\/integrationOrchestrationManifest(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Manifest|Validation|Model|Registry|Foundation)(Types|Identity|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationOrchestration(Certification|Freeze|PublicIndex)/,
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

describe("EIL-4:6 Integration Orchestration Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(EIL46_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL46_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationOrchestrationPlatformIdentity.phaseId, "EIL-4:6");
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.canonicalId,
      "EIL-4:6/IntegrationOrchestrationPlatform",
    );
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.name,
      "Integration Orchestration Platform",
    );
    assert.equal(IntegrationOrchestrationPlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.namespace,
      "nexora.eil.integration-orchestration.platform",
    );
    assert.equal(IntegrationOrchestrationPlatformIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationPlatformIdentity.platform, "EIL-4");
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.phaseType,
      "Platform",
    );
    assert.equal(IntegrationOrchestrationPlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationOrchestrationPlatform.status, "Platform");
    assert.equal(
      IntegrationOrchestrationPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationOrchestrationPlatform.nextPhase,
      "EIL-4:7 — Integration Orchestration Certification",
    );
  });

  it("declares Manifest aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.manifestId,
      IntegrationOrchestrationManifestIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationManifest.ts",
    );
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.manifestDependency,
      "EIL-4:5/IntegrationOrchestrationManifest",
    );
    assert.equal(
      IntegrationOrchestrationPlatformIdentity.manifestEntryPoint,
      "integrationOrchestrationManifest.ts",
    );
    assert.equal(dependency.manifestInternalImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(
      IntegrationOrchestrationPlatform.manifestPlatform,
      IntegrationOrchestrationManifestPlatform,
    );
  });

  it("publishes twelve guarantees and ten compatibility scopes in deterministic order", () => {
    assert.equal(IntegrationOrchestrationPlatformGuarantees.length, 12);
    assert.deepEqual(
      IntegrationOrchestrationPlatformGuarantees.map((item) => item.key),
      [...EXPECTED_GUARANTEES],
    );
    assertAscending(
      IntegrationOrchestrationPlatformGuarantees.map((item) => item.ordinal),
      "guarantee",
    );
    assert.ok(
      IntegrationOrchestrationPlatformGuarantees.every(
        (item) => item.runtimeEnforced === false,
      ),
    );

    assert.equal(IntegrationOrchestrationPlatformCompatibility.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationPlatformCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationOrchestrationPlatformCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
    assert.equal(
      IntegrationOrchestrationCompatibilityManifest.declarationCount,
      8,
    );
  });

  it("derives platform inventory dynamically as 234 from Manifest", () => {
    const inventory = IntegrationOrchestrationPlatformInventory;
    assert.equal(
      inventory.manifestInventoryTotal,
      IntegrationOrchestrationInventoryManifest.totalInventoryCount,
    );
    assert.equal(inventory.manifestInventoryTotal, 207);
    assert.equal(inventory.architectureManifestCount, 1);
    assert.equal(inventory.dependencyManifestCount, 1);
    assert.equal(inventory.compatibilityManifestCount, 8);
    assert.equal(inventory.validationSummaryCount, 1);
    assert.equal(inventory.platformMetadataCount, 8);
    assert.equal(inventory.aggregatePublicExports, 8);
    assert.equal(inventory.total, 234);
    assert.equal(inventory.countsDerivedFromManifest, true);
    assert.equal(inventory.hardcodedCounts, false);
    assert.equal(IntegrationOrchestrationPlatformCollections.total, 234);
    assert.equal(IntegrationOrchestrationPlatformSummary.total, 234);
    assert.equal(Object.isFrozen(IntegrationOrchestrationPlatformComposition), true);
    assert.equal(Object.isFrozen(inventory), true);
    assert.equal(Object.isFrozen(IntegrationOrchestrationPlatform), true);
  });

  it("is metadata-only with zero runtime platform behavior", () => {
    const platform = IntegrationOrchestrationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.triggerProcessing, false);
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
    assert.equal(platform.composition.duplicatesUpstreamContents, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL46_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for platform sources", () => {
    const sources = EIL46_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationManifest.ts",
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
