/**
 * EIL-4:4 — Integration Orchestration Validation Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationModelIdentity,
  IntegrationOrchestrationModelPlatform,
} from "./integrationOrchestrationModel.ts";
import * as ValidationModule from "./integrationOrchestrationValidation.ts";
import {
  IntegrationOrchestrationValidationCategories,
  IntegrationOrchestrationValidationCollections,
  IntegrationOrchestrationValidationFindings,
  IntegrationOrchestrationValidationIdentity,
  IntegrationOrchestrationValidationPlatform,
  IntegrationOrchestrationValidationReadiness,
  IntegrationOrchestrationValidationRules,
  IntegrationOrchestrationValidationSummary,
} from "./integrationOrchestrationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL44_FILES = Object.freeze([
  "integrationOrchestrationValidationTypes.ts",
  "integrationOrchestrationValidationIdentity.ts",
  "integrationOrchestrationValidationRules.ts",
  "integrationOrchestrationValidationCategories.ts",
  "integrationOrchestrationValidationFindings.ts",
  "integrationOrchestrationValidationReadiness.ts",
  "integrationOrchestrationValidation.ts",
  "integrationOrchestrationValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationValidationIdentity",
  "IntegrationOrchestrationValidationRules",
  "IntegrationOrchestrationValidationCategories",
  "IntegrationOrchestrationValidationFindings",
  "IntegrationOrchestrationValidationReadiness",
  "IntegrationOrchestrationValidationCollections",
  "IntegrationOrchestrationValidationSummary",
  "IntegrationOrchestrationValidationPlatform",
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
  /from ["']\.\/integrationOrchestrationModel(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Model|Registry|Foundation)(Types|Identity|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationPublicIndex/,
  /from ["']\.\/integrationOrchestration(Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-4:4 Integration Orchestration Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(EIL44_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL44_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationOrchestrationValidationIdentity.phaseId, "EIL-4:4");
    assert.equal(
      IntegrationOrchestrationValidationIdentity.canonicalId,
      "EIL-4:4/IntegrationOrchestrationValidation",
    );
    assert.equal(
      IntegrationOrchestrationValidationIdentity.name,
      "Integration Orchestration Validation",
    );
    assert.equal(IntegrationOrchestrationValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationOrchestrationValidationIdentity.namespace,
      "nexora.eil.integration-orchestration.validation",
    );
    assert.equal(IntegrationOrchestrationValidationIdentity.layer, "EIL");
    assert.equal(IntegrationOrchestrationValidationIdentity.platform, "EIL-4");
    assert.equal(
      IntegrationOrchestrationValidationIdentity.phaseType,
      "Validation",
    );
    assert.equal(
      IntegrationOrchestrationValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      IntegrationOrchestrationValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationOrchestrationValidationPlatform.status,
      "Validation",
    );
    assert.equal(
      IntegrationOrchestrationValidationReadiness.readinessState,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationOrchestrationValidationReadiness.validationStatus,
      "Validation",
    );
    assert.equal(
      IntegrationOrchestrationValidationReadiness.upstreamDependency,
      "EIL-4:3/IntegrationOrchestrationModel",
    );
    assert.equal(
      IntegrationOrchestrationValidationPlatform.nextPhase,
      "EIL-4:5 — Integration Orchestration Manifest",
    );
  });

  it("declares Model aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationValidationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.modelId,
      IntegrationOrchestrationModelIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationModel.ts",
    );
    assert.equal(
      IntegrationOrchestrationValidationIdentity.modelDependency,
      "EIL-4:3/IntegrationOrchestrationModel",
    );
    assert.equal(
      IntegrationOrchestrationValidationIdentity.modelEntryPoint,
      "integrationOrchestrationModel.ts",
    );
    assert.equal(dependency.modelInternalImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      IntegrationOrchestrationValidationPlatform.modelPlatform,
      IntegrationOrchestrationModelPlatform,
    );
  });

  it("publishes twenty-six rules, sixteen categories, and five findings", () => {
    assert.equal(IntegrationOrchestrationValidationRules.length, 26);
    assert.deepEqual(
      IntegrationOrchestrationValidationRules.map((item) => item.canonicalKey),
      [...EXPECTED_RULES],
    );
    assertAscending(
      IntegrationOrchestrationValidationRules.map((item) => item.ordinal),
      "rule",
    );
    assertUnique(
      IntegrationOrchestrationValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assert.ok(
      IntegrationOrchestrationValidationRules.every(
        (item) => item.executesValidation === false,
      ),
    );

    assert.equal(IntegrationOrchestrationValidationCategories.length, 16);
    assert.deepEqual(
      IntegrationOrchestrationValidationCategories.map((item) => item.key),
      [...EXPECTED_CATEGORIES],
    );
    assertAscending(
      IntegrationOrchestrationValidationCategories.map((item) => item.ordinal),
      "category",
    );

    assert.equal(IntegrationOrchestrationValidationFindings.length, 5);
    assert.deepEqual(
      IntegrationOrchestrationValidationFindings.map((item) => item.state),
      [...EXPECTED_FINDINGS],
    );
    assertAscending(
      IntegrationOrchestrationValidationFindings.map((item) => item.ordinal),
      "finding",
    );
  });

  it("derives inventory dynamically with total validation entry count of 47", () => {
    const { collections, inventory } =
      IntegrationOrchestrationValidationPlatform;
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
      IntegrationOrchestrationValidationSummary.totalValidationEntryCount,
      47,
    );
    assert.equal(
      IntegrationOrchestrationValidationCollections.totalValidationEntryCount,
      47,
    );
  });

  it("freezes all validation collections and preserves metadata-only architecture", () => {
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationIdentity),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationOrchestrationValidationRules), true);
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationCategories),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationFindings),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationValidationPlatform),
      true,
    );

    const platform = IntegrationOrchestrationValidationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.runtimeValidation, false);
    assert.equal(platform.ruleExecution, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
    assert.equal(platform.triggerProcessing, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.previousEilPlatformDependency, false);
    assert.equal(platform.importsLaterEil4Phases, false);
    assert.equal(platform.readiness.executesGates, false);
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL44_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL44_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationModel.ts",
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
