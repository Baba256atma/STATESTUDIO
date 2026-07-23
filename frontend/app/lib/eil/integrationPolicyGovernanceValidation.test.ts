/**
 * EIL-5:4 — Integration Policy & Governance Validation Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernanceModelIdentity,
  IntegrationPolicyGovernanceModelPlatform,
} from "./integrationPolicyGovernanceModel.ts";
import * as ValidationModule from "./integrationPolicyGovernanceValidation.ts";
import {
  IntegrationPolicyGovernanceValidationCategories,
  IntegrationPolicyGovernanceValidationCollections,
  IntegrationPolicyGovernanceValidationFindings,
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationPlatform,
  IntegrationPolicyGovernanceValidationReadiness,
  IntegrationPolicyGovernanceValidationRules,
  IntegrationPolicyGovernanceValidationSummary,
} from "./integrationPolicyGovernanceValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL54_FILES = Object.freeze([
  "integrationPolicyGovernanceValidationTypes.ts",
  "integrationPolicyGovernanceValidationIdentity.ts",
  "integrationPolicyGovernanceValidationRules.ts",
  "integrationPolicyGovernanceValidationCategories.ts",
  "integrationPolicyGovernanceValidationFindings.ts",
  "integrationPolicyGovernanceValidationReadiness.ts",
  "integrationPolicyGovernanceValidation.ts",
  "integrationPolicyGovernanceValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceValidationIdentity",
  "IntegrationPolicyGovernanceValidationRules",
  "IntegrationPolicyGovernanceValidationCategories",
  "IntegrationPolicyGovernanceValidationFindings",
  "IntegrationPolicyGovernanceValidationReadiness",
  "IntegrationPolicyGovernanceValidationCollections",
  "IntegrationPolicyGovernanceValidationSummary",
  "IntegrationPolicyGovernanceValidationPlatform",
] as const);

const EXPECTED_RULES = Object.freeze([
  "IdentityIntegrity",
  "NamespaceIntegrity",
  "VersionIntegrity",
  "RegistryReferenceIntegrity",
  "DomainModelCompleteness",
  "RelationshipCompleteness",
  "TopologyCompleteness",
  "LifecycleCompleteness",
  "DependencyDirection",
  "CompatibilityIntegrity",
  "OwnershipIntegrity",
  "BoundaryIntegrity",
  "InventoryIntegrity",
  "CollectionIntegrity",
  "ExportIntegrity",
  "Immutability",
  "DeterministicOrdering",
  "CanonicalInventoryRule",
  "MetadataOnlyCompliance",
  "RuntimeSurfaceProhibition",
  "ArchitecturalConsistency",
  "ReadinessIntegrity",
  "SummaryIntegrity",
  "PlatformAggregateIntegrity",
  "SourceReferenceIntegrity",
  "DocumentationIntegrity",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "Identity",
  "Namespace",
  "Registry",
  "DomainModel",
  "Relationship",
  "Topology",
  "Lifecycle",
  "Dependency",
  "Compatibility",
  "Inventory",
  "Export",
  "Immutability",
  "Determinism",
  "Readiness",
  "Architecture",
  "Documentation",
] as const);

const EXPECTED_FINDINGS = Object.freeze([
  "Pass",
  "Warning",
  "Error",
  "Skipped",
  "NotApplicable",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationPolicyGovernanceModel(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Model|Registry|Foundation)(Types|Identity|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationPolicyGovernance(Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-5:4 Integration Policy & Governance Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(EIL54_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL54_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.phaseId,
      "EIL-5:4",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.canonicalId,
      "EIL-5:4/IntegrationPolicyGovernanceValidation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.name,
      "Integration Policy & Governance Validation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.namespace,
      "nexora.eil.integration-policy-governance.validation",
    );
    assert.equal(IntegrationPolicyGovernanceValidationIdentity.layer, "EIL");
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.phaseType,
      "Validation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationPlatform.status,
      "Validation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationReadiness.readinessState,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationReadiness.validationStatus,
      "Validation",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationReadiness.upstreamDependency,
      "EIL-5:3/IntegrationPolicyGovernanceModel",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationPlatform.nextPhase,
      "EIL-5:5 — Integration Policy & Governance Manifest",
    );
  });

  it("declares Model aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceValidationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.modelId,
      IntegrationPolicyGovernanceModelIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernanceModel.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.modelDependency,
      "EIL-5:3/IntegrationPolicyGovernanceModel",
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationIdentity.modelEntryPoint,
      "integrationPolicyGovernanceModel.ts",
    );
    assert.equal(dependency.modelInternalImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      IntegrationPolicyGovernanceValidationPlatform.modelPlatform,
      IntegrationPolicyGovernanceModelPlatform,
    );
  });

  it("publishes twenty-six rules, sixteen categories, and five findings", () => {
    assert.equal(IntegrationPolicyGovernanceValidationRules.length, 26);
    assert.deepEqual(
      IntegrationPolicyGovernanceValidationRules.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_RULES],
    );
    assertAscending(
      IntegrationPolicyGovernanceValidationRules.map((item) => item.ordinal),
      "rule",
    );
    assertUnique(
      IntegrationPolicyGovernanceValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assert.ok(
      IntegrationPolicyGovernanceValidationRules.every(
        (item) => item.executesValidation === false,
      ),
    );

    assert.equal(IntegrationPolicyGovernanceValidationCategories.length, 16);
    assert.deepEqual(
      IntegrationPolicyGovernanceValidationCategories.map((item) => item.key),
      [...EXPECTED_CATEGORIES],
    );
    assertAscending(
      IntegrationPolicyGovernanceValidationCategories.map(
        (item) => item.ordinal,
      ),
      "category",
    );

    assert.equal(IntegrationPolicyGovernanceValidationFindings.length, 5);
    assert.deepEqual(
      IntegrationPolicyGovernanceValidationFindings.map((item) => item.state),
      [...EXPECTED_FINDINGS],
    );
    assertAscending(
      IntegrationPolicyGovernanceValidationFindings.map((item) => item.ordinal),
      "finding",
    );
  });

  it("derives inventory dynamically with total validation entry count of 47", () => {
    const { collections, inventory } =
      IntegrationPolicyGovernanceValidationPlatform;
    assert.equal(collections.ruleCount, collections.rules.length);
    assert.equal(collections.categoryCount, collections.categories.length);
    assert.equal(collections.findingCount, collections.findings.length);
    assert.equal(collections.ruleCount, 26);
    assert.equal(collections.categoryCount, 16);
    assert.equal(collections.findingCount, 5);
    assert.equal(collections.totalValidationEntryCount, 47);
    assert.equal(inventory.totalValidationEntryCount, 47);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(
      IntegrationPolicyGovernanceValidationSummary.totalValidationEntryCount,
      47,
    );
    assert.equal(
      IntegrationPolicyGovernanceValidationCollections.totalValidationEntryCount,
      47,
    );
  });

  it("freezes all validation collections and preserves metadata-only architecture", () => {
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationRules),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationCategories),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationFindings),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceValidationPlatform),
      true,
    );

    const platform = IntegrationPolicyGovernanceValidationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.runtimeValidation, false);
    assert.equal(platform.ruleExecution, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEnforcement, false);
    assert.equal(platform.authorizationEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.orchestrationRuntime, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil5Phases, false);
    assert.equal(platform.readiness.executesGates, false);
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL54_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for validation sources", () => {
    const sources = EIL54_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernanceModel.ts",
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
