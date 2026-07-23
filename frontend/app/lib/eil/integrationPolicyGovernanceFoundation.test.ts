/**
 * EIL-5:1 — Integration Policy & Governance Foundation Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./integrationPolicyGovernanceFoundation.ts";
import {
  IntegrationPolicyGovernanceFoundationCapabilities,
  IntegrationPolicyGovernanceFoundationCollections,
  IntegrationPolicyGovernanceFoundationContracts,
  IntegrationPolicyGovernanceFoundationIdentity,
  IntegrationPolicyGovernanceFoundationLifecycle,
  IntegrationPolicyGovernanceFoundationPlatform,
  IntegrationPolicyGovernanceFoundationResponsibilities,
  IntegrationPolicyGovernanceFoundationSummary,
} from "./integrationPolicyGovernanceFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL51_FILES = Object.freeze([
  "integrationPolicyGovernanceFoundationTypes.ts",
  "integrationPolicyGovernanceFoundationIdentity.ts",
  "integrationPolicyGovernanceFoundationContracts.ts",
  "integrationPolicyGovernanceFoundationCapabilities.ts",
  "integrationPolicyGovernanceFoundationResponsibilities.ts",
  "integrationPolicyGovernanceFoundationLifecycle.ts",
  "integrationPolicyGovernanceFoundation.ts",
  "integrationPolicyGovernanceFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceFoundationIdentity",
  "IntegrationPolicyGovernanceFoundationContracts",
  "IntegrationPolicyGovernanceFoundationCapabilities",
  "IntegrationPolicyGovernanceFoundationResponsibilities",
  "IntegrationPolicyGovernanceFoundationLifecycle",
  "IntegrationPolicyGovernanceFoundationCollections",
  "IntegrationPolicyGovernanceFoundationSummary",
  "IntegrationPolicyGovernanceFoundationPlatform",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "compatibility",
  "terminology",
  "readiness",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "IdentityPolicy",
  "AccessPolicy",
  "DependencyPolicy",
  "CompatibilityPolicy",
  "VersionPolicy",
  "LifecyclePolicy",
  "InventoryPolicy",
  "CompliancePolicy",
  "SecurityPolicy",
  "ExecutiveGovernancePolicy",
] as const);

const EXPECTED_CATEGORY_NAMES = Object.freeze([
  "Identity Policy",
  "Access Policy",
  "Dependency Policy",
  "Compatibility Policy",
  "Version Policy",
  "Lifecycle Policy",
  "Inventory Policy",
  "Compliance Policy",
  "Security Policy",
  "Executive Governance Policy",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "Policy",
  "GovernanceRule",
  "GovernanceBoundary",
  "GovernanceScope",
  "ComplianceContract",
  "PolicyLifecycle",
  "PolicyVersion",
  "PolicyMetadata",
  "PolicyCompatibility",
  "GovernanceIdentity",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "PolicyDescription",
  "GovernanceClassification",
  "ComplianceDeclaration",
  "DependencyDeclaration",
  "CompatibilityDeclaration",
  "LifecycleDescription",
  "MetadataPublication",
  "InventorySupport",
  "GovernanceReadiness",
  "ArchitecturalConsistency",
] as const);

const EXPECTED_RESPONSIBILITIES = Object.freeze([
  "PreserveGovernanceIdentity",
  "PreserveArchitecturalBoundaries",
  "PublishGovernanceMetadata",
  "PreserveDependencyDirection",
  "PreserveCompatibility",
  "PreserveDeterministicInventories",
  "SupportFutureRuntimePlatforms",
  "PreserveArchitecturalConsistency",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Designed",
  "Verified",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["'][^"']*\/(bus|ops|engine|dkl|nea|eve|director|advisor|core)\//,
  /from ["']\.\/integration(?!PolicyGovernanceFoundation)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs\/promises["']/,
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

describe("EIL-5:1 Integration Policy & Governance Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(EIL51_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL51_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, namespace, version, and Foundation status", () => {
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.foundationId,
      "EIL-5:1/IntegrationPolicyGovernanceFoundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.foundationVersion,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.foundationName,
      "Integration Policy & Governance Foundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.foundationNamespace,
      "nexora.eil.integration-policy-governance.foundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.status,
      "Foundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.phaseId,
      "EIL-5:1",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationIdentity.phaseType,
      "Foundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationPlatform.identity.foundationNamespace,
      "nexora.eil.integration-policy-governance.foundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationPlatform.nextPhase,
      "EIL-5:2 — Integration Policy & Governance Registry",
    );
  });

  it("publishes immutable exports and frozen aggregates", () => {
    const platform = IntegrationPolicyGovernanceFoundationPlatform;
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationContracts),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationResponsibilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationLifecycle),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceFoundationSummary),
      true,
    );
    assert.equal(Object.isFrozen(platform), true);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
  });

  it("publishes exactly ten governance categories in deterministic order", () => {
    const { categories } = IntegrationPolicyGovernanceFoundationPlatform;
    assert.equal(categories.length, 10);
    assert.deepEqual(
      categories.map((item) => item.categoryKey),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      categories.map((item) => item.canonicalName),
      [...EXPECTED_CATEGORY_NAMES],
    );
    assertUnique(
      categories.map((item) => item.categoryId),
      "category IDs",
    );
    assertAscending(
      categories.map((item) => item.deterministicOrder),
      "category",
    );
    assert.ok(categories.every((item) => item.runtimeImplemented === false));
  });

  it("publishes exactly ten contracts, ten capabilities, eight responsibilities, and eight lifecycle states", () => {
    assert.equal(IntegrationPolicyGovernanceFoundationContracts.length, 10);
    assert.deepEqual(
      IntegrationPolicyGovernanceFoundationContracts.map(
        (item) => item.contractName,
      ),
      [...EXPECTED_CONTRACTS],
    );
    assertAscending(
      IntegrationPolicyGovernanceFoundationContracts.map(
        (item) => item.deterministicOrder,
      ),
      "contract",
    );

    assert.equal(IntegrationPolicyGovernanceFoundationCapabilities.length, 10);
    assert.deepEqual(
      IntegrationPolicyGovernanceFoundationCapabilities.map(
        (item) => item.capabilityKey,
      ),
      [...EXPECTED_CAPABILITIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceFoundationCapabilities.map(
        (item) => item.deterministicOrder,
      ),
      "capability",
    );
    assert.ok(
      IntegrationPolicyGovernanceFoundationCapabilities.every(
        (item) =>
          item.ownedByEil5 === true && item.performsGovernance === false,
      ),
    );

    assert.equal(
      IntegrationPolicyGovernanceFoundationResponsibilities.length,
      8,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceFoundationResponsibilities.map(
        (item) => item.responsibilityId,
      ),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceFoundationResponsibilities.map(
        (item) => item.deterministicOrder,
      ),
      "responsibility",
    );

    assert.equal(IntegrationPolicyGovernanceFoundationLifecycle.stateCount, 8);
    assert.deepEqual(
      [...IntegrationPolicyGovernanceFoundationLifecycle.states],
      [...EXPECTED_LIFECYCLE],
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationLifecycle.currentState,
      "Verified",
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationLifecycle.executesTransitions,
      false,
    );
  });

  it("derives foundation inventory dynamically as 46", () => {
    const { inventory, collections } =
      IntegrationPolicyGovernanceFoundationPlatform;
    assert.equal(inventory.governanceCategoryCount, 10);
    assert.equal(inventory.contractCount, 10);
    assert.equal(inventory.capabilityCount, 10);
    assert.equal(inventory.responsibilityCount, 8);
    assert.equal(inventory.lifecycleStateCount, 8);
    assert.equal(inventory.totalFoundationEntryCount, 46);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(collections.governanceCategoryCount, 10);
    assert.equal(
      IntegrationPolicyGovernanceFoundationCollections.governanceCategoryCount,
      10,
    );
    assert.equal(
      IntegrationPolicyGovernanceFoundationSummary.governanceCategoryCount,
      10,
    );
    assert.equal(
      inventory.totalFoundationEntryCount,
      inventory.governanceCategoryCount +
        inventory.contractCount +
        inventory.capabilityCount +
        inventory.responsibilityCount +
        inventory.lifecycleStateCount,
    );
  });

  it("is metadata-only with zero governance runtime behavior", () => {
    const platform = IntegrationPolicyGovernanceFoundationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.consumesPreviousEilPlatforms, false);
    assert.equal(platform.importsLaterEil5Phases, false);
    assert.equal(platform.dependency.previousEilPlatformDependency, false);
    assert.equal(platform.dependency.laterEil5PhaseImport, false);
  });

  it("has zero prohibited imports across foundation sources", () => {
    const sources = EIL51_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for foundation sources", () => {
    const sources = EIL51_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
