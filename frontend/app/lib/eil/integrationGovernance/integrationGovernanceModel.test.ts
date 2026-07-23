/**
 * EIL-7:3 — Integration Governance Model Tests.
 *
 * Deterministic architectural coverage for the immutable Model.
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
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryCanonicalId,
} from "./integrationGovernanceRegistry.ts";
import {
  IntegrationGovernanceCapabilityModels,
  IntegrationGovernanceComplianceModels,
  IntegrationGovernanceContractModels,
  IntegrationGovernanceDomainModels,
  IntegrationGovernanceLifecycleModels,
  IntegrationGovernanceModel,
  IntegrationGovernanceModelIdentity,
  IntegrationGovernanceModelInventory,
  IntegrationGovernanceModelReadiness,
  IntegrationGovernancePolicyModels,
  IntegrationGovernanceRelationshipModels,
  IntegrationGovernanceRelationshipTypes,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL73_FILES = Object.freeze([
  "integrationGovernanceModel.ts",
  "integrationGovernanceDomainModels.ts",
  "integrationGovernanceContractModels.ts",
  "integrationGovernanceCapabilityModels.ts",
  "integrationGovernancePolicyModels.ts",
  "integrationGovernanceComplianceModels.ts",
  "integrationGovernanceLifecycleModels.ts",
  "integrationGovernanceModel.test.ts",
]);

const REQUIRED_MODEL_EXPORTS = Object.freeze([
  "IntegrationGovernanceModelIdentity",
  "IntegrationGovernanceModel",
  "IntegrationGovernanceDomainModels",
  "IntegrationGovernanceContractModels",
  "IntegrationGovernanceCapabilityModels",
  "IntegrationGovernancePolicyModels",
  "IntegrationGovernanceComplianceModels",
  "IntegrationGovernanceLifecycleModels",
  "IntegrationGovernanceModelInventory",
  "IntegrationGovernanceModelReadiness",
  "IntegrationGovernanceRelationshipModels",
] as const);

const EXPECTED_DOMAIN_KEYS = Object.freeze([
  "PoliciesModel",
  "ComplianceModel",
  "VersioningModel",
  "CompatibilityModel",
  "StandardsModel",
  "ApprovalsModel",
  "AuditModel",
  "RiskModel",
  "LifecycleModel",
  "GovernanceModel",
] as const);

const EXPECTED_CONTRACT_KEYS = Object.freeze([
  "GovernanceContractModel",
  "PolicyContractModel",
  "ComplianceContractModel",
  "VersioningContractModel",
  "CompatibilityContractModel",
  "LifecycleGovernanceContractModel",
  "ApprovalContractModel",
  "AuditContractModel",
  "RiskContractModel",
  "IntegrationStandardContractModel",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernance(Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernance(Domain|Contract|Capability|Policy|Compliance|Lifecycle)Registry\.ts["']/,
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

describe("EIL-7:3 Integration Governance Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(EIL73_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL73_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Model status, and ReadyForValidation", () => {
    assert.equal(IntegrationGovernanceModelIdentity.phaseId, "EIL-7:3");
    assert.equal(
      IntegrationGovernanceModelIdentity.canonicalId,
      "EIL-7:3/IntegrationGovernanceModel",
    );
    assert.equal(
      IntegrationGovernanceModelIdentity.name,
      "Integration Governance Model",
    );
    assert.equal(IntegrationGovernanceModelIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceModelIdentity.namespace,
      "nexora.eil.integration-governance.model",
    );
    assert.equal(IntegrationGovernanceModelIdentity.status, "Model");
    assert.equal(
      IntegrationGovernanceModelIdentity.readiness,
      "ReadyForValidation",
    );
    assert.equal(IntegrationGovernanceModelReadiness, "ReadyForValidation");
    assert.equal(IntegrationGovernanceModel.readiness, "ReadyForValidation");
    assert.equal(
      IntegrationGovernanceModelIdentity.registryDependency,
      IntegrationGovernanceRegistryCanonicalId,
    );
  });

  it("consumes Registry aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationGovernanceModel.dependency.registryOnly, true);
    assert.equal(
      IntegrationGovernanceModel.dependency.upstreamCanonicalId,
      IntegrationGovernanceRegistryCanonicalId,
    );
    assert.equal(IntegrationGovernanceModel.registry, IntegrationGovernanceRegistry);
    assert.equal(
      IntegrationGovernanceModel.dependency.foundationDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceModel.dependency.laterEil7PhaseImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceModel.dependency.registryInternalImport,
      false,
    );
  });

  it("publishes exactly 55 canonical model instances with deterministic inventory", () => {
    assert.equal(IntegrationGovernanceDomainModels.length, 10);
    assert.equal(IntegrationGovernanceContractModels.length, 10);
    assert.equal(IntegrationGovernanceCapabilityModels.length, 10);
    assert.equal(IntegrationGovernancePolicyModels.length, 8);
    assert.equal(IntegrationGovernanceComplianceModels.length, 8);
    assert.equal(IntegrationGovernanceLifecycleModels.length, 9);

    const derived =
      IntegrationGovernanceDomainModels.length +
      IntegrationGovernanceContractModels.length +
      IntegrationGovernanceCapabilityModels.length +
      IntegrationGovernancePolicyModels.length +
      IntegrationGovernanceComplianceModels.length +
      IntegrationGovernanceLifecycleModels.length;

    assert.equal(derived, 55);
    assert.equal(
      IntegrationGovernanceModelInventory.totalModelInstanceCount,
      derived,
    );
    assert.equal(
      IntegrationGovernanceModelInventory.countsDerivedFromCollections,
      true,
    );
    assert.equal(IntegrationGovernanceRelationshipModels.length, 10);
    assert.deepEqual(
      [...IntegrationGovernanceRelationshipTypes],
      IntegrationGovernanceRelationshipModels.map(
        (item) => item.relationshipType,
      ),
    );
  });

  it("preserves Registry order, uniqueness, and source references", () => {
    assert.deepEqual(
      IntegrationGovernanceDomainModels.map((item) => item.canonicalKey),
      [...EXPECTED_DOMAIN_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceContractModels.map((item) => item.canonicalKey),
      [...EXPECTED_CONTRACT_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceLifecycleModels.map((item) => item.canonicalKey),
      IntegrationGovernanceRegistry.lifecycle.map((item) => item.key),
    );
    assert.deepEqual(
      IntegrationGovernancePolicyModels.map((item) => item.canonicalKey),
      IntegrationGovernanceRegistry.policyCategories.map((item) => item.key),
    );
    assert.deepEqual(
      IntegrationGovernanceComplianceModels.map((item) => item.canonicalKey),
      IntegrationGovernanceRegistry.complianceCategories.map(
        (item) => item.key,
      ),
    );
    assert.deepEqual(
      IntegrationGovernanceCapabilityModels.map((item) => item.canonicalKey),
      IntegrationGovernanceRegistry.capabilities.map((item) => item.key),
    );

    const collections = Object.freeze([
      IntegrationGovernanceDomainModels,
      IntegrationGovernanceContractModels,
      IntegrationGovernanceCapabilityModels,
      IntegrationGovernancePolicyModels,
      IntegrationGovernanceComplianceModels,
      IntegrationGovernanceLifecycleModels,
    ]);

    const allIds = collections.flatMap((collection) =>
      collection.map((item) => item.modelId),
    );
    assertUnique(allIds, "model IDs");

    for (const collection of collections) {
      assertUnique(
        collection.map((item) => item.canonicalKey),
        `${collection[0]?.category ?? "model"} keys`,
      );
      assertSequentialOrders(
        collection.map((item) => item.order),
        `${collection[0]?.category ?? "model"}`,
      );
      assert.ok(
        collection.every(
          (item) =>
            item.status === "Modeled" &&
            item.sourceRegistryId.startsWith("EIL-7:2/") &&
            item.sourceReference.includes(
              IntegrationGovernanceRegistryCanonicalId,
            ),
        ),
      );
    }
  });

  it("exposes an immutable aggregate Model and package Model surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceModel), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceDomainModels), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceContractModels), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceCapabilityModels), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePolicyModels), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceComplianceModels), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceLifecycleModels), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceRelationshipModels),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceModelInventory), true);

    assert.equal(
      IntegrationGovernanceModel.domains,
      IntegrationGovernanceDomainModels,
    );
    assert.equal(
      IntegrationGovernanceModel.contracts,
      IntegrationGovernanceContractModels,
    );
    assert.equal(
      IntegrationGovernanceModel.capabilities,
      IntegrationGovernanceCapabilityModels,
    );
    assert.equal(
      IntegrationGovernanceModel.policies,
      IntegrationGovernancePolicyModels,
    );
    assert.equal(
      IntegrationGovernanceModel.compliance,
      IntegrationGovernanceComplianceModels,
    );
    assert.equal(
      IntegrationGovernanceModel.lifecycle,
      IntegrationGovernanceLifecycleModels,
    );

    for (const exportName of REQUIRED_MODEL_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const model = IntegrationGovernanceModel;
    assert.equal(model.metadataOnly, true);
    assert.equal(model.runtimeBehavior, false);
    assert.equal(model.governanceEngine, false);
    assert.equal(model.policyEngine, false);
    assert.equal(model.complianceEngine, false);
    assert.equal(model.approvalWorkflow, false);
    assert.equal(model.auditRuntime, false);
    assert.equal(model.riskRuntime, false);
    assert.equal(model.versionManager, false);
    assert.equal(model.compatibilityResolver, false);
    assert.equal(model.networkingBehavior, false);
    assert.equal(model.persistenceBehavior, false);
    assert.equal(model.reactBehavior, false);
    assert.equal(model.stateMutation, false);
    assert.equal(model.importsLaterEil7Phases, false);
    assert.ok(
      IntegrationGovernanceRelationshipModels.every(
        (item) => item.resolvesRuntime === false,
      ),
    );
  });

  it("has zero prohibited imports across model sources", () => {
    const sources = EIL73_FILES.filter((name) => !name.endsWith(".test.ts"));
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
      assert.match(
        source,
        /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for model sources", () => {
    const sources = EIL73_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationGovernance/integrationGovernanceRegistry.ts",
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
