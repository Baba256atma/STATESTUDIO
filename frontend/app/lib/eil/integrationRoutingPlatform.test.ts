/**
 * EIL-3:6 — Integration Routing Platform Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingCompatibilityManifest,
  IntegrationRoutingInventoryManifest,
  IntegrationRoutingManifestIdentity,
  IntegrationRoutingManifestPlatform,
} from "./integrationRoutingManifest.ts";
import * as PlatformModule from "./integrationRoutingPlatform.ts";
import {
  IntegrationRoutingPlatform,
  IntegrationRoutingPlatformCollections,
  IntegrationRoutingPlatformCompatibility,
  IntegrationRoutingPlatformComposition,
  IntegrationRoutingPlatformGuarantees,
  IntegrationRoutingPlatformIdentity,
  IntegrationRoutingPlatformInventory,
  IntegrationRoutingPlatformSummary,
} from "./integrationRoutingPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL36_FILES = Object.freeze([
  "integrationRoutingPlatformTypes.ts",
  "integrationRoutingPlatformIdentity.ts",
  "integrationRoutingPlatformComposition.ts",
  "integrationRoutingPlatformInventory.ts",
  "integrationRoutingPlatformGuarantees.ts",
  "integrationRoutingPlatformCompatibility.ts",
  "integrationRoutingPlatform.ts",
  "integrationRoutingPlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingPlatformIdentity",
  "IntegrationRoutingPlatformComposition",
  "IntegrationRoutingPlatformInventory",
  "IntegrationRoutingPlatformGuarantees",
  "IntegrationRoutingPlatformCompatibility",
  "IntegrationRoutingPlatformCollections",
  "IntegrationRoutingPlatformSummary",
  "IntegrationRoutingPlatform",
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
  /from ["']\.\/integrationRoutingManifest(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Manifest|Validation|Model|Registry|Foundation)(Types|Identity|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationRouting(Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting(Certification|Freeze|PublicIndex)/,
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

describe("EIL-3:6 Integration Routing Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(EIL36_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL36_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationRoutingPlatformIdentity.phaseId, "EIL-3:6");
    assert.equal(
      IntegrationRoutingPlatformIdentity.canonicalId,
      "EIL-3:6/IntegrationRoutingPlatform",
    );
    assert.equal(
      IntegrationRoutingPlatformIdentity.name,
      "Integration Routing Platform",
    );
    assert.equal(IntegrationRoutingPlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingPlatformIdentity.namespace,
      "nexora.eil.integration-routing.platform",
    );
    assert.equal(IntegrationRoutingPlatformIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingPlatformIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingPlatformIdentity.phaseType, "Platform");
    assert.equal(IntegrationRoutingPlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationRoutingPlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationRoutingPlatform.status, "Platform");
    assert.equal(
      IntegrationRoutingPlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationRoutingPlatform.nextPhase,
      "EIL-3:7 — Integration Routing Certification",
    );
  });

  it("declares Manifest aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.manifestId,
      IntegrationRoutingManifestIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingManifest.ts",
    );
    assert.equal(
      IntegrationRoutingPlatformIdentity.manifestDependency,
      "EIL-3:5/IntegrationRoutingManifest",
    );
    assert.equal(
      IntegrationRoutingPlatformIdentity.manifestEntryPoint,
      "integrationRoutingManifest.ts",
    );
    assert.equal(dependency.manifestInternalImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingPlatform.manifestPlatform,
      IntegrationRoutingManifestPlatform,
    );
  });

  it("freezes composition, inventory, guarantees, compatibility, and summary", () => {
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformComposition), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformInventory), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformGuarantees), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingPlatformCompatibility),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformCollections), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPlatformSummary), true);
    assert.equal(Object.isFrozen(IntegrationRoutingPlatform), true);
    assert.ok(
      IntegrationRoutingPlatformGuarantees.every((item) =>
        Object.isFrozen(item)
      ),
    );
    assert.ok(
      IntegrationRoutingPlatformCompatibility.every((item) =>
        Object.isFrozen(item)
      ),
    );
  });

  it("publishes twelve guarantees and ten compatibility scopes in deterministic order", () => {
    assert.equal(IntegrationRoutingPlatformGuarantees.length, 12);
    assert.deepEqual(
      IntegrationRoutingPlatformGuarantees.map((item) => item.key),
      [...EXPECTED_GUARANTEES],
    );
    assertAscending(
      IntegrationRoutingPlatformGuarantees.map((item) => item.ordinal),
      "guarantee",
    );
    assert.ok(
      IntegrationRoutingPlatformGuarantees.every(
        (item) => item.runtimeEnforced === false,
      ),
    );

    assert.equal(IntegrationRoutingPlatformCompatibility.length, 10);
    assert.deepEqual(
      IntegrationRoutingPlatformCompatibility.map((item) => item.scope),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationRoutingPlatformCompatibility.map((item) => item.ordinal),
      "compatibility",
    );
    assert.ok(
      IntegrationRoutingPlatformCompatibility.every(
        (item) => item.runtimeValidated === false,
      ),
    );
  });

  it("derives inventory dynamically from Manifest collections", () => {
    const inventory = IntegrationRoutingPlatformInventory;
    assert.equal(inventory.countsDerivedFromManifest, true);
    assert.equal(inventory.hardcodedCounts, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);
    assert.equal(
      inventory.manifestInventoryTotal,
      IntegrationRoutingInventoryManifest.totalInventoryCount,
    );
    assert.equal(inventory.architectureManifestCount, 1);
    assert.equal(inventory.dependencyManifestCount, 1);
    assert.equal(
      inventory.compatibilityManifestCount,
      IntegrationRoutingCompatibilityManifest.declarationCount,
    );
    assert.equal(inventory.validationSummaryCount, 1);
    assert.equal(inventory.platformMetadataCount, 8);
    assert.equal(inventory.aggregatePublicExports, 8);
    assert.equal(inventory.manifestInventoryTotal, 207);
    assert.equal(inventory.total, 234);

    assert.equal(
      IntegrationRoutingPlatformCollections.total,
      inventory.total,
    );
    assert.equal(IntegrationRoutingPlatformSummary.total, inventory.total);
    assert.equal(
      IntegrationRoutingPlatformComposition.duplicatesUpstreamContents,
      false,
    );
    assert.equal(
      IntegrationRoutingPlatformComposition.manifestReference,
      "EIL-3:5/IntegrationRoutingManifest",
    );
  });

  it("is metadata-only with zero runtime behavior", () => {
    const platform = IntegrationRoutingPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.schedulingBehavior, false);
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
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil3Phases, false);
    assert.equal(platform.readiness.claimsRuntimeReady, false);
    assert.equal(platform.readiness.claimsFrozen, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL36_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL36_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingManifest.ts",
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
