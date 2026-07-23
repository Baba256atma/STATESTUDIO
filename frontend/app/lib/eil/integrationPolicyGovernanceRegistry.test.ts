/**
 * EIL-5:2 — Integration Policy & Governance Registry Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import * as RegistryModule from "./integrationPolicyGovernanceRegistry.ts";
import {
  IntegrationPolicyGovernanceCapabilityRegistry,
  IntegrationPolicyGovernanceCategoryRegistry,
  IntegrationPolicyGovernanceContractRegistry,
  IntegrationPolicyGovernanceRegistryCollections,
  IntegrationPolicyGovernanceRegistryIdentity,
  IntegrationPolicyGovernanceRegistryPlatform,
  IntegrationPolicyGovernanceRegistrySummary,
  IntegrationPolicyGovernanceResponsibilityRegistry,
} from "./integrationPolicyGovernanceRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL52_FILES = Object.freeze([
  "integrationPolicyGovernanceRegistryTypes.ts",
  "integrationPolicyGovernanceRegistryIdentity.ts",
  "integrationPolicyGovernanceCategoryRegistry.ts",
  "integrationPolicyGovernanceContractRegistry.ts",
  "integrationPolicyGovernanceCapabilityRegistry.ts",
  "integrationPolicyGovernanceResponsibilityRegistry.ts",
  "integrationPolicyGovernanceRegistry.ts",
  "integrationPolicyGovernanceRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceRegistryIdentity",
  "IntegrationPolicyGovernanceCategoryRegistry",
  "IntegrationPolicyGovernanceContractRegistry",
  "IntegrationPolicyGovernanceCapabilityRegistry",
  "IntegrationPolicyGovernanceResponsibilityRegistry",
  "IntegrationPolicyGovernanceRegistryCollections",
  "IntegrationPolicyGovernanceRegistrySummary",
  "IntegrationPolicyGovernanceRegistryPlatform",
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
  /from ["']\.\/integrationPolicyGovernanceFoundation(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernanceFoundation(Types|Contracts|Capabilities|Responsibilities|Lifecycle|Identity)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationPolicyGovernance(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

const assertNoExecutableValues = (value: unknown, path: string): void => {
  assert.notEqual(typeof value, "function", `${path} must not be a function`);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertNoExecutableValues(value[index], `${path}[${index}]`);
    }
    return;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      assertNoExecutableValues(nested, `${path}.${key}`);
    }
  }
};

describe("EIL-5:2 Integration Policy & Governance Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(EIL52_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL52_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationPolicyGovernanceRegistryIdentity.phaseId, "EIL-5:2");
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
      "EIL-5:2/IntegrationPolicyGovernanceRegistry",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.name,
      "Integration Policy & Governance Registry",
    );
    assert.equal(IntegrationPolicyGovernanceRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.namespace,
      "nexora.eil.integration-policy-governance.registry",
    );
    assert.equal(IntegrationPolicyGovernanceRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationPolicyGovernanceRegistryIdentity.platform, "EIL-5");
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.phaseType,
      "Registry",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.status,
      "Registry",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationPolicyGovernanceRegistryPlatform.status, "Registry");
    assert.equal(
      IntegrationPolicyGovernanceRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryPlatform.nextPhase,
      "EIL-5:3 — Integration Policy & Governance Model",
    );
  });

  it("declares Foundation aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceRegistryPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.foundationId,
      "EIL-5:1/IntegrationPolicyGovernanceFoundation",
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceFoundation.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.foundationDependency,
      "EIL-5:1/IntegrationPolicyGovernanceFoundation",
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryIdentity.foundationEntryPoint,
      "integrationPolicyGovernanceFoundation.ts",
    );
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationInventory, false);
    assert.equal(
      IntegrationPolicyGovernanceRegistryPlatform.foundationPlatform,
      IntegrationPolicyGovernanceFoundationPlatform,
    );
  });

  it("registers Foundation categories, contracts, capabilities, and responsibilities", () => {
    assert.equal(IntegrationPolicyGovernanceCategoryRegistry.length, 10);
    assert.deepEqual(
      IntegrationPolicyGovernanceCategoryRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CATEGORIES],
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceCategoryRegistry.map((item) => item.name),
      [...EXPECTED_CATEGORY_NAMES],
    );
    assertAscending(
      IntegrationPolicyGovernanceCategoryRegistry.map((item) => item.ordinal),
      "category",
    );
    assertUnique(
      IntegrationPolicyGovernanceCategoryRegistry.map((item) => item.registryId),
      "category registry IDs",
    );
    assertUnique(
      IntegrationPolicyGovernanceCategoryRegistry.map(
        (item) => item.canonicalKey,
      ),
      "category keys",
    );

    assert.equal(IntegrationPolicyGovernanceContractRegistry.length, 10);
    assert.deepEqual(
      IntegrationPolicyGovernanceContractRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CONTRACTS],
    );
    assertAscending(
      IntegrationPolicyGovernanceContractRegistry.map((item) => item.ordinal),
      "contract",
    );
    assertUnique(
      IntegrationPolicyGovernanceContractRegistry.map((item) => item.registryId),
      "contract registry IDs",
    );

    assert.equal(IntegrationPolicyGovernanceCapabilityRegistry.length, 10);
    assert.deepEqual(
      IntegrationPolicyGovernanceCapabilityRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceCapabilityRegistry.map((item) => item.ordinal),
      "capability",
    );
    assertUnique(
      IntegrationPolicyGovernanceCapabilityRegistry.map(
        (item) => item.registryId,
      ),
      "capability registry IDs",
    );

    assert.equal(IntegrationPolicyGovernanceResponsibilityRegistry.length, 8);
    assert.deepEqual(
      IntegrationPolicyGovernanceResponsibilityRegistry.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_RESPONSIBILITIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceResponsibilityRegistry.map(
        (item) => item.ordinal,
      ),
      "responsibility",
    );
    assertUnique(
      IntegrationPolicyGovernanceResponsibilityRegistry.map(
        (item) => item.registryId,
      ),
      "responsibility registry IDs",
    );
  });

  it("preserves Foundation lifecycle references without reconstruction", () => {
    const { lifecycleCoverage, foundationPlatform } =
      IntegrationPolicyGovernanceRegistryPlatform;
    assert.equal(lifecycleCoverage.length, 8);
    assert.deepEqual(
      [...foundationPlatform.lifecycle.states],
      [...EXPECTED_LIFECYCLE],
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryCollections.lifecycleStateCount,
      foundationPlatform.inventory.lifecycleStateCount,
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryCollections.lifecycleStateCount,
      8,
    );
    assert.ok(
      lifecycleCoverage.every(
        (item) =>
          item.registered === true &&
          item.sourcePhase ===
            "EIL-5:1/IntegrationPolicyGovernanceFoundation" &&
          Object.isFrozen(item),
      ),
    );
  });

  it("derives inventory dynamically with total registry entry count of 38", () => {
    const { collections, inventory } =
      IntegrationPolicyGovernanceRegistryPlatform;
    assert.equal(collections.categoryCount, collections.categories.length);
    assert.equal(collections.contractCount, collections.contracts.length);
    assert.equal(collections.capabilityCount, collections.capabilities.length);
    assert.equal(
      collections.responsibilityCount,
      collections.responsibilities.length,
    );
    assert.equal(collections.categoryCount, 10);
    assert.equal(collections.contractCount, 10);
    assert.equal(collections.capabilityCount, 10);
    assert.equal(collections.responsibilityCount, 8);
    assert.equal(collections.totalRegistryEntryCount, 38);
    assert.equal(inventory.totalRegistryEntryCount, 38);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(
      IntegrationPolicyGovernanceRegistrySummary.totalRegistryEntryCount,
      38,
    );
    assert.equal(
      IntegrationPolicyGovernanceRegistryCollections.totalRegistryEntryCount,
      38,
    );
  });

  it("freezes all registry collections, tags, and source references", () => {
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCategoryRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceContractRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCapabilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceResponsibilityRegistry),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceRegistryCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceRegistrySummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceRegistryPlatform),
      true,
    );

    for (const entry of IntegrationPolicyGovernanceCategoryRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
      assert.equal(typeof entry.sourceReference, "string");
      assert.equal(entry.executesRuntime, false);
      assert.equal(entry.metadataOnly, true);
    }
    for (const entry of IntegrationPolicyGovernanceContractRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
    for (const entry of IntegrationPolicyGovernanceCapabilityRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
    for (const entry of IntegrationPolicyGovernanceResponsibilityRegistry) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(Object.isFrozen(entry.tags), true);
    }
  });

  it("is metadata-only with zero executable registry behavior", () => {
    const platform = IntegrationPolicyGovernanceRegistryPlatform;
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
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.connectorExecution, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil5Phases, false);

    assertNoExecutableValues(
      IntegrationPolicyGovernanceCategoryRegistry,
      "categories",
    );
    assertNoExecutableValues(
      IntegrationPolicyGovernanceContractRegistry,
      "contracts",
    );
    assertNoExecutableValues(
      IntegrationPolicyGovernanceCapabilityRegistry,
      "capabilities",
    );
    assertNoExecutableValues(
      IntegrationPolicyGovernanceResponsibilityRegistry,
      "responsibilities",
    );
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL52_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL52_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernanceFoundation.ts",
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
