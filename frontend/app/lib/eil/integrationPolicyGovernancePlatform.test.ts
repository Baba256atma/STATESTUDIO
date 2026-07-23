/**
 * EIL-5:6 — Integration Policy & Governance Platform Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Platform.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceCompatibilityManifest,
  IntegrationPolicyGovernanceInventoryManifest,
  IntegrationPolicyGovernanceManifestIdentity,
  IntegrationPolicyGovernanceManifestPlatform,
} from "./integrationPolicyGovernanceManifest.ts";
import * as PlatformModule from "./integrationPolicyGovernancePlatform.ts";
import {
  IntegrationPolicyGovernancePlatform,
  IntegrationPolicyGovernancePlatformCollections,
  IntegrationPolicyGovernancePlatformCompatibility,
  IntegrationPolicyGovernancePlatformComposition,
  IntegrationPolicyGovernancePlatformGuarantees,
  IntegrationPolicyGovernancePlatformIdentity,
  IntegrationPolicyGovernancePlatformInventory,
  IntegrationPolicyGovernancePlatformSummary,
} from "./integrationPolicyGovernancePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL56_FILES = Object.freeze([
  "integrationPolicyGovernancePlatformTypes.ts",
  "integrationPolicyGovernancePlatformIdentity.ts",
  "integrationPolicyGovernancePlatformComposition.ts",
  "integrationPolicyGovernancePlatformInventory.ts",
  "integrationPolicyGovernancePlatformGuarantees.ts",
  "integrationPolicyGovernancePlatformCompatibility.ts",
  "integrationPolicyGovernancePlatform.ts",
  "integrationPolicyGovernancePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernancePlatformIdentity",
  "IntegrationPolicyGovernancePlatformComposition",
  "IntegrationPolicyGovernancePlatformInventory",
  "IntegrationPolicyGovernancePlatformGuarantees",
  "IntegrationPolicyGovernancePlatformCompatibility",
  "IntegrationPolicyGovernancePlatformCollections",
  "IntegrationPolicyGovernancePlatformSummary",
  "IntegrationPolicyGovernancePlatform",
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
  /from ["']\.\/integrationPolicyGovernanceManifest(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Manifest|Validation|Model|Registry|Foundation)(Types|Identity|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationPolicyGovernance(Certification|Freeze|PublicIndex)/,
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

describe("EIL-5:6 Integration Policy & Governance Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(EIL56_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL56_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.phaseId,
      "EIL-5:6",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.canonicalId,
      "EIL-5:6/IntegrationPolicyGovernancePlatform",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.name,
      "Integration Policy & Governance Platform",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.namespace,
      "nexora.eil.integration-policy-governance.platform",
    );
    assert.equal(IntegrationPolicyGovernancePlatformIdentity.layer, "EIL");
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.phaseType,
      "Platform",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.status,
      "Platform",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(IntegrationPolicyGovernancePlatform.status, "Platform");
    assert.equal(
      IntegrationPolicyGovernancePlatform.readiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatform.nextPhase,
      "EIL-5:7 — Integration Policy & Governance Certification",
    );
  });

  it("declares Manifest aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernancePlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.manifestOnly, true);
    assert.equal(
      dependency.manifestId,
      IntegrationPolicyGovernanceManifestIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceManifest.ts",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.manifestDependency,
      "EIL-5:5/IntegrationPolicyGovernanceManifest",
    );
    assert.equal(
      IntegrationPolicyGovernancePlatformIdentity.manifestEntryPoint,
      "integrationPolicyGovernanceManifest.ts",
    );
    assert.equal(dependency.manifestInternalImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(
      IntegrationPolicyGovernancePlatform.manifestPlatform,
      IntegrationPolicyGovernanceManifestPlatform,
    );
  });

  it("publishes twelve guarantees and ten compatibility scopes in deterministic order", () => {
    assert.equal(IntegrationPolicyGovernancePlatformGuarantees.length, 12);
    assert.deepEqual(
      IntegrationPolicyGovernancePlatformGuarantees.map((item) => item.key),
      [...EXPECTED_GUARANTEES],
    );
    assertAscending(
      IntegrationPolicyGovernancePlatformGuarantees.map(
        (item) => item.ordinal,
      ),
      "guarantee",
    );
    assert.ok(
      IntegrationPolicyGovernancePlatformGuarantees.every(
        (item) => item.runtimeEnforced === false,
      ),
    );

    assert.equal(
      IntegrationPolicyGovernancePlatformCompatibility.length,
      10,
    );
    assert.deepEqual(
      IntegrationPolicyGovernancePlatformCompatibility.map(
        (item) => item.scope,
      ),
      [...EXPECTED_COMPATIBILITY],
    );
    assertAscending(
      IntegrationPolicyGovernancePlatformCompatibility.map(
        (item) => item.ordinal,
      ),
      "compatibility",
    );
    assert.equal(
      IntegrationPolicyGovernanceCompatibilityManifest.declarationCount,
      8,
    );
  });

  it("derives platform inventory dynamically as 234 from Manifest", () => {
    const inventory = IntegrationPolicyGovernancePlatformInventory;
    assert.equal(
      inventory.manifestInventoryTotal,
      IntegrationPolicyGovernanceInventoryManifest.totalInventoryCount,
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
    assert.equal(IntegrationPolicyGovernancePlatformCollections.total, 234);
    assert.equal(IntegrationPolicyGovernancePlatformSummary.total, 234);
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernancePlatformComposition),
      true,
    );
    assert.equal(Object.isFrozen(inventory), true);
    assert.equal(Object.isFrozen(IntegrationPolicyGovernancePlatform), true);
  });

  it("is metadata-only with zero runtime platform behavior", () => {
    const platform = IntegrationPolicyGovernancePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.runtimePlatform, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
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
    assert.equal(platform.importsLaterEil5Phases, false);
    assert.equal(platform.composition.duplicatesUpstreamContents, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL56_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL56_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernanceManifest.ts",
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
