/**
 * EIL-3:4 — Integration Routing Validation Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingModelIdentity,
  IntegrationRoutingModelPlatform,
} from "./integrationRoutingModel.ts";
import * as ValidationModule from "./integrationRoutingValidation.ts";
import {
  IntegrationRoutingValidationCategories,
  IntegrationRoutingValidationCollections,
  IntegrationRoutingValidationFindings,
  IntegrationRoutingValidationIdentity,
  IntegrationRoutingValidationPlatform,
  IntegrationRoutingValidationReadiness,
  IntegrationRoutingValidationRules,
  IntegrationRoutingValidationSummary,
} from "./integrationRoutingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL34_FILES = Object.freeze([
  "integrationRoutingValidationTypes.ts",
  "integrationRoutingValidationIdentity.ts",
  "integrationRoutingValidationRules.ts",
  "integrationRoutingValidationCategories.ts",
  "integrationRoutingValidationFindings.ts",
  "integrationRoutingValidationReadiness.ts",
  "integrationRoutingValidation.ts",
  "integrationRoutingValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingValidationIdentity",
  "IntegrationRoutingValidationRules",
  "IntegrationRoutingValidationCategories",
  "IntegrationRoutingValidationFindings",
  "IntegrationRoutingValidationReadiness",
  "IntegrationRoutingValidationCollections",
  "IntegrationRoutingValidationSummary",
  "IntegrationRoutingValidationPlatform",
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
  /from ["']\.\/integrationRoutingModel(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Model|Registry|Foundation)(Types|Identity|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationRouting(Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting(Manifest|Platform|Certification|Freeze|PublicIndex)/,
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

describe("EIL-3:4 Integration Routing Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(EIL34_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL34_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationRoutingValidationIdentity.phaseId, "EIL-3:4");
    assert.equal(
      IntegrationRoutingValidationIdentity.canonicalId,
      "EIL-3:4/IntegrationRoutingValidation",
    );
    assert.equal(
      IntegrationRoutingValidationIdentity.name,
      "Integration Routing Validation",
    );
    assert.equal(IntegrationRoutingValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingValidationIdentity.namespace,
      "nexora.eil.integration-routing.validation",
    );
    assert.equal(IntegrationRoutingValidationIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingValidationIdentity.platform, "EIL-3");
    assert.equal(IntegrationRoutingValidationIdentity.phaseType, "Validation");
    assert.equal(IntegrationRoutingValidationIdentity.status, "Validation");
    assert.equal(
      IntegrationRoutingValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(IntegrationRoutingValidationPlatform.status, "Validation");
    assert.equal(
      IntegrationRoutingValidationReadiness.readinessState,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationRoutingValidationPlatform.nextPhase,
      "EIL-3:5 — Integration Routing Manifest",
    );
  });

  it("declares Model aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingValidationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.modelId,
      IntegrationRoutingModelIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingModel.ts",
    );
    assert.equal(
      IntegrationRoutingValidationIdentity.modelDependency,
      "EIL-3:3/IntegrationRoutingModel",
    );
    assert.equal(
      IntegrationRoutingValidationIdentity.modelEntryPoint,
      "integrationRoutingModel.ts",
    );
    assert.equal(dependency.modelInternalImport, false);
    assert.equal(dependency.registryInternalImport, false);
    assert.equal(dependency.foundationInternalImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingValidationPlatform.modelPlatform,
      IntegrationRoutingModelPlatform,
    );
  });

  it("publishes exactly twenty-six validation rules in deterministic order", () => {
    assert.equal(IntegrationRoutingValidationRules.length, 26);
    assert.deepEqual(
      IntegrationRoutingValidationRules.map((item) => item.canonicalKey),
      [...EXPECTED_RULES],
    );
    assertUnique(
      IntegrationRoutingValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertAscending(
      IntegrationRoutingValidationRules.map((item) => item.ordinal),
      "rule",
    );
    assert.ok(
      IntegrationRoutingValidationRules.every(
        (item) =>
          item.executesValidation === false && item.metadataOnly === true,
      ),
    );
  });

  it("publishes exactly sixteen categories and five finding states", () => {
    assert.equal(IntegrationRoutingValidationCategories.length, 16);
    assert.deepEqual(
      IntegrationRoutingValidationCategories.map((item) => item.key),
      [...EXPECTED_CATEGORIES],
    );
    assertAscending(
      IntegrationRoutingValidationCategories.map((item) => item.ordinal),
      "category",
    );

    assert.equal(IntegrationRoutingValidationFindings.length, 5);
    assert.deepEqual(
      IntegrationRoutingValidationFindings.map((item) => item.state),
      [...EXPECTED_FINDINGS],
    );
    assertAscending(
      IntegrationRoutingValidationFindings.map((item) => item.ordinal),
      "finding",
    );
  });

  it("derives inventory dynamically from validation collections", () => {
    const { collections, inventory } = IntegrationRoutingValidationPlatform;
    assert.equal(collections.ruleCount, collections.rules.length);
    assert.equal(collections.categoryCount, collections.categories.length);
    assert.equal(collections.findingCount, collections.findings.length);
    assert.equal(collections.ruleCount, 26);
    assert.equal(collections.categoryCount, 16);
    assert.equal(collections.findingCount, 5);
    assert.equal(collections.totalValidationEntryCount, 47);

    assert.equal(inventory.ruleCount, collections.ruleCount);
    assert.equal(inventory.categoryCount, collections.categoryCount);
    assert.equal(inventory.findingCount, collections.findingCount);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationRoutingValidationCollections.ruleCount, 26);

    assert.equal(IntegrationRoutingValidationSummary.ruleCount, 26);
    assert.equal(IntegrationRoutingValidationSummary.categoryCount, 16);
    assert.equal(IntegrationRoutingValidationSummary.findingCount, 5);
    assert.equal(IntegrationRoutingValidationSummary.status, "Validation");
    assert.equal(
      IntegrationRoutingValidationSummary.readiness,
      "ReadyForManifest",
    );
  });

  it("publishes immutable collections and zero runtime behavior", () => {
    const platform = IntegrationRoutingValidationPlatform;
    assert.equal(Object.isFrozen(IntegrationRoutingValidationIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingValidationRules), true);
    assert.equal(Object.isFrozen(IntegrationRoutingValidationCategories), true);
    assert.equal(Object.isFrozen(IntegrationRoutingValidationFindings), true);
    assert.equal(Object.isFrozen(IntegrationRoutingValidationReadiness), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingValidationCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingValidationSummary), true);
    assert.equal(Object.isFrozen(platform), true);
    assert.ok(platform.rules.every((item) => Object.isFrozen(item)));
    assert.ok(platform.categories.every((item) => Object.isFrozen(item)));
    assert.ok(platform.findings.every((item) => Object.isFrozen(item)));

    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.validationEngine, false);
    assert.equal(platform.runtimeValidation, false);
    assert.equal(platform.ruleExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil3Phases, false);
    assert.equal(IntegrationRoutingValidationReadiness.executesGates, false);
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL34_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL34_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingModel.ts",
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
