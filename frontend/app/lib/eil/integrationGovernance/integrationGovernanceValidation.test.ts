/**
 * EIL-7:4 — Integration Governance Validation Tests.
 *
 * Deterministic architectural coverage for the immutable Validation phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  IntegrationGovernanceModel,
  IntegrationGovernanceModelCanonicalId,
} from "./integrationGovernanceModel.ts";
import {
  IntegrationGovernanceValidation,
  IntegrationGovernanceValidationAggregateResult,
  IntegrationGovernanceValidationCategories,
  IntegrationGovernanceValidationGates,
  IntegrationGovernanceValidationIdentity,
  IntegrationGovernanceValidationInventory,
  IntegrationGovernanceValidationReadiness,
  IntegrationGovernanceValidationReport,
  IntegrationGovernanceValidationRules,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL74_FILES = Object.freeze([
  "integrationGovernanceValidation.ts",
  "integrationGovernanceValidationRules.ts",
  "integrationGovernanceValidationCategories.ts",
  "integrationGovernanceValidationResults.ts",
  "integrationGovernanceValidationGates.ts",
  "integrationGovernanceValidationInventory.ts",
  "integrationGovernanceValidationReport.ts",
  "integrationGovernanceValidation.test.ts",
]);

const REQUIRED_VALIDATION_EXPORTS = Object.freeze([
  "IntegrationGovernanceValidationIdentity",
  "IntegrationGovernanceValidation",
  "IntegrationGovernanceValidationCategories",
  "IntegrationGovernanceValidationRules",
  "IntegrationGovernanceValidationGates",
  "IntegrationGovernanceValidationInventory",
  "IntegrationGovernanceValidationReport",
  "IntegrationGovernanceValidationReadiness",
  "IntegrationGovernanceValidationAggregateResult",
] as const);

const EXPECTED_CATEGORY_KEYS = Object.freeze([
  "IdentityValidation",
  "NamespaceValidation",
  "DependencyValidation",
  "InventoryValidation",
  "RelationshipValidation",
  "OrderingValidation",
  "ImmutabilityValidation",
  "ExportValidation",
  "MetadataValidation",
  "ReadinessValidation",
] as const);

const EXPECTED_GATE_KEYS = Object.freeze([
  "IdentityComplete",
  "NamespaceComplete",
  "RegistryDependencyVerified",
  "ModelDependencyVerified",
  "InventoryVerified",
  "RelationshipsVerified",
  "MetadataVerified",
  "ExportSurfaceVerified",
  "ImmutabilityVerified",
  "DeterministicOrderingVerified",
  "RuntimeIndependenceVerified",
  "PackageIntegrityVerified",
  "TypeIntegrityVerified",
  "ValidationComplete",
  "ArchitectureApproved",
  "ReadyForManifest",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernance(Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
  /from ["']\.\/integrationGovernance(Domain|Contract|Capability|Policy|Compliance|Lifecycle)(Registry|Models)\.ts["']/,
  /from ["']\.\.\/integration(?!Governance)/,
  /from ["']\.\.\/integrationObservability/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']react["']/,
  /from ["']next\//,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const assertSequentialOrders = (
  orders: readonly number[],
  label: string,
): void => {
  assert.deepEqual(
    orders,
    Array.from({ length: orders.length }, (_, index) => index + 1),
    `${label} orders must be sequential starting at 1`,
  );
};

describe("EIL-7:4 Integration Governance Validation", () => {
  it("creates exactly eight Validation files", () => {
    assert.equal(EIL74_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL74_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Validation status, and ReadyForManifest", () => {
    assert.equal(IntegrationGovernanceValidationIdentity.phaseId, "EIL-7:4");
    assert.equal(
      IntegrationGovernanceValidationIdentity.canonicalId,
      "EIL-7:4/IntegrationGovernanceValidation",
    );
    assert.equal(
      IntegrationGovernanceValidationIdentity.name,
      "Integration Governance Validation",
    );
    assert.equal(IntegrationGovernanceValidationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceValidationIdentity.namespace,
      "nexora.eil.integration-governance.validation",
    );
    assert.equal(
      IntegrationGovernanceValidationIdentity.status,
      "Validation",
    );
    assert.equal(
      IntegrationGovernanceValidationIdentity.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationGovernanceValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationGovernanceValidation.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      IntegrationGovernanceValidationIdentity.modelDependency,
      IntegrationGovernanceModelCanonicalId,
    );
  });

  it("consumes Model aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationGovernanceValidation.dependency.modelOnly, true);
    assert.equal(
      IntegrationGovernanceValidation.dependency.upstreamCanonicalId,
      IntegrationGovernanceModelCanonicalId,
    );
    assert.equal(
      IntegrationGovernanceValidation.model,
      IntegrationGovernanceModel,
    );
    assert.equal(
      IntegrationGovernanceValidation.dependency.registryDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceValidation.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceValidation.dependency.laterEil7PhaseImport,
      false,
    );
  });

  it("publishes 10 categories, 40 rules, 16 gates with derived inventory 66", () => {
    assert.equal(IntegrationGovernanceValidationCategories.length, 10);
    assert.equal(IntegrationGovernanceValidationRules.length, 40);
    assert.equal(IntegrationGovernanceValidationGates.length, 16);

    const derived =
      IntegrationGovernanceValidationCategories.length +
      IntegrationGovernanceValidationRules.length +
      IntegrationGovernanceValidationGates.length;

    assert.equal(derived, 66);
    assert.equal(
      IntegrationGovernanceValidationInventory.totalValidationInventory,
      derived,
    );
    assert.equal(
      IntegrationGovernanceValidationInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationGovernanceValidationAggregateResult, "Pass");
    assert.equal(IntegrationGovernanceValidation.aggregateResult, "Pass");
    assert.equal(
      IntegrationGovernanceValidationReport.aggregateResult,
      "Pass",
    );
  });

  it("preserves category/gate order, uniqueness, and rule distribution", () => {
    assert.deepEqual(
      IntegrationGovernanceValidationCategories.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CATEGORY_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceValidationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATE_KEYS],
    );

    assertUnique(
      IntegrationGovernanceValidationCategories.map((item) => item.categoryId),
      "category IDs",
    );
    assertUnique(
      IntegrationGovernanceValidationRules.map((item) => item.ruleId),
      "rule IDs",
    );
    assertUnique(
      IntegrationGovernanceValidationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertUnique(
      IntegrationGovernanceValidationRules.map((item) => item.canonicalKey),
      "rule keys",
    );

    assertSequentialOrders(
      IntegrationGovernanceValidationCategories.map((item) => item.order),
      "categories",
    );
    assertSequentialOrders(
      IntegrationGovernanceValidationRules.map((item) => item.order),
      "rules",
    );
    assertSequentialOrders(
      IntegrationGovernanceValidationGates.map((item) => item.order),
      "gates",
    );

    for (const categoryKey of EXPECTED_CATEGORY_KEYS) {
      const rulesForCategory = IntegrationGovernanceValidationRules.filter(
        (item) => item.categoryKey === categoryKey,
      );
      assert.equal(
        rulesForCategory.length,
        4,
        `${categoryKey} must have exactly 4 rules`,
      );
    }

    assert.ok(
      IntegrationGovernanceValidationRules.every(
        (item) =>
          item.declaredResult === "Pass" &&
          item.sourceModelId === IntegrationGovernanceModelCanonicalId,
      ),
    );
    assert.ok(
      IntegrationGovernanceValidationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("exposes an immutable aggregate Validation and package Validation surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceValidation), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceValidationCategories),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceValidationRules), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceValidationGates), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceValidationInventory),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceValidationReport), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceValidationIdentity),
      true,
    );

    assert.equal(
      IntegrationGovernanceValidation.categories,
      IntegrationGovernanceValidationCategories,
    );
    assert.equal(
      IntegrationGovernanceValidation.rules,
      IntegrationGovernanceValidationRules,
    );
    assert.equal(
      IntegrationGovernanceValidation.gates,
      IntegrationGovernanceValidationGates,
    );
    assert.equal(
      IntegrationGovernanceValidation.report,
      IntegrationGovernanceValidationReport,
    );

    for (const exportName of REQUIRED_VALIDATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime validation or governance behavior", () => {
    const validation = IntegrationGovernanceValidation;
    assert.equal(validation.metadataOnly, true);
    assert.equal(validation.runtimeBehavior, false);
    assert.equal(validation.runtimeValidation, false);
    assert.equal(validation.validationEngine, false);
    assert.equal(validation.governanceEngine, false);
    assert.equal(validation.policyEngine, false);
    assert.equal(validation.complianceEngine, false);
    assert.equal(validation.approvalWorkflow, false);
    assert.equal(validation.auditRuntime, false);
    assert.equal(validation.riskRuntime, false);
    assert.equal(validation.versionManager, false);
    assert.equal(validation.dashboard, false);
    assert.equal(validation.networkingBehavior, false);
    assert.equal(validation.persistenceBehavior, false);
    assert.equal(validation.reactBehavior, false);
    assert.equal(validation.stateMutation, false);
    assert.equal(validation.importsLaterEil7Phases, false);
    assert.equal(
      IntegrationGovernanceValidationReport.evaluatesRuntime,
      false,
    );
  });

  it("has zero prohibited imports across validation sources", () => {
    const sources = EIL74_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(join(HERE, file), "utf8");
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

    assert.match(
      readFileSync(join(HERE, "integrationGovernanceValidation.ts"), "utf8"),
      /from ["']\.\/integrationGovernanceModel\.ts["']/,
    );
  });

  it("passes strict TypeScript and ESLint for validation sources", () => {
    const sources = EIL74_FILES.filter((name) => !name.endsWith(".test.ts")).map(
      (name) => join("app/lib/eil/integrationGovernance", name),
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
        "app/lib/eil/integrationGovernance/index.ts",
        "app/lib/eil/integrationGovernance/integrationGovernanceModel.ts",
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
      [...sources, "app/lib/eil/integrationGovernance/index.ts"],
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
