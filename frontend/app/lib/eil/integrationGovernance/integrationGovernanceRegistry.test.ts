/**
 * EIL-7:2 — Integration Governance Registry Tests.
 *
 * Deterministic architectural coverage for the immutable Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as PackageModule from "./index.ts";
import {
  IntegrationGovernanceFoundationId,
  IntegrationGovernanceFoundationPlatform,
} from "./integrationGovernanceFoundation.ts";
import {
  IntegrationGovernanceCapabilityRegistry,
  IntegrationGovernanceComplianceRegistry,
  IntegrationGovernanceContractRegistry,
  IntegrationGovernanceDomainRegistry,
  IntegrationGovernanceLifecycleRegistry,
  IntegrationGovernancePolicyRegistry,
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryIdentity,
  IntegrationGovernanceRegistryInventory,
  IntegrationGovernanceRegistryReadiness,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");
const EIL_ROOT = join(HERE, "..");

const EIL72_FILES = Object.freeze([
  "integrationGovernanceRegistry.ts",
  "integrationGovernanceDomainRegistry.ts",
  "integrationGovernanceContractRegistry.ts",
  "integrationGovernanceCapabilityRegistry.ts",
  "integrationGovernancePolicyRegistry.ts",
  "integrationGovernanceComplianceRegistry.ts",
  "integrationGovernanceLifecycleRegistry.ts",
  "integrationGovernanceRegistry.test.ts",
]);

const REQUIRED_REGISTRY_EXPORTS = Object.freeze([
  "IntegrationGovernanceRegistryIdentity",
  "IntegrationGovernanceRegistry",
  "IntegrationGovernanceDomainRegistry",
  "IntegrationGovernanceContractRegistry",
  "IntegrationGovernanceCapabilityRegistry",
  "IntegrationGovernancePolicyRegistry",
  "IntegrationGovernanceComplianceRegistry",
  "IntegrationGovernanceLifecycleRegistry",
  "IntegrationGovernanceRegistryInventory",
  "IntegrationGovernanceRegistryReadiness",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernance(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernance(Domains|Contracts|Capabilities|Lifecycle|PolicyCategories|ComplianceCategories)\.ts["']/,
  /from ["']\.\.\/integration(?!Governance)/,
  /from ["']\.\.\/integrationObservability/,
  /from ["']\.\.\/integrationPolicyGovernance/,
  /from ["']\.\.\/integrationOrchestration/,
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

describe("EIL-7:2 Integration Governance Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(EIL72_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL72_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(present.includes("index.ts"), true);
    assert.equal(existsSync(join(EIL_ROOT, "index.ts")), false);
  });

  it("has canonical identity, namespace, version, Registry status, and ReadyForModel", () => {
    assert.equal(IntegrationGovernanceRegistryIdentity.phaseId, "EIL-7:2");
    assert.equal(
      IntegrationGovernanceRegistryIdentity.canonicalId,
      "EIL-7:2/IntegrationGovernanceRegistry",
    );
    assert.equal(
      IntegrationGovernanceRegistryIdentity.name,
      "Integration Governance Registry",
    );
    assert.equal(IntegrationGovernanceRegistryIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceRegistryIdentity.namespace,
      "nexora.eil.integration-governance.registry",
    );
    assert.equal(IntegrationGovernanceRegistryIdentity.layer, "EIL");
    assert.equal(IntegrationGovernanceRegistryIdentity.status, "Registry");
    assert.equal(
      IntegrationGovernanceRegistryIdentity.readiness,
      "ReadyForModel",
    );
    assert.equal(IntegrationGovernanceRegistryReadiness, "ReadyForModel");
    assert.equal(IntegrationGovernanceRegistry.readiness, "ReadyForModel");
    assert.equal(IntegrationGovernanceRegistry.status, "Registry");
    assert.equal(
      IntegrationGovernanceRegistryIdentity.upstreamPhase,
      "EIL-7:1",
    );
    assert.equal(
      IntegrationGovernanceRegistryIdentity.upstreamCanonicalId,
      "EIL-7:1/IntegrationGovernanceFoundation",
    );
  });

  it("consumes EIL-7:1 Foundation aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationGovernanceRegistry.dependency.foundationOnly, true);
    assert.equal(
      IntegrationGovernanceRegistry.dependency.upstreamCanonicalId,
      IntegrationGovernanceFoundationId,
    );
    assert.equal(
      IntegrationGovernanceRegistry.foundation,
      IntegrationGovernanceFoundationPlatform,
    );
    assert.equal(
      IntegrationGovernanceRegistry.dependency.laterEil7PhaseImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceRegistry.dependency.previousEilPlatformDependency,
      false,
    );
    assert.equal(
      IntegrationGovernanceRegistry.dependency.foundationInternalImport,
      false,
    );
  });

  it("registers exact Foundation collection counts totaling 55", () => {
    assert.equal(IntegrationGovernanceDomainRegistry.length, 10);
    assert.equal(IntegrationGovernanceContractRegistry.length, 10);
    assert.equal(IntegrationGovernanceCapabilityRegistry.length, 10);
    assert.equal(IntegrationGovernancePolicyRegistry.length, 8);
    assert.equal(IntegrationGovernanceComplianceRegistry.length, 8);
    assert.equal(IntegrationGovernanceLifecycleRegistry.length, 9);

    const derivedTotal =
      IntegrationGovernanceDomainRegistry.length +
      IntegrationGovernanceContractRegistry.length +
      IntegrationGovernanceCapabilityRegistry.length +
      IntegrationGovernancePolicyRegistry.length +
      IntegrationGovernanceComplianceRegistry.length +
      IntegrationGovernanceLifecycleRegistry.length;

    assert.equal(derivedTotal, 55);
    assert.equal(
      IntegrationGovernanceRegistryInventory.totalRegistryRecordCount,
      derivedTotal,
    );
    assert.equal(
      IntegrationGovernanceRegistryInventory.countsDerivedFromCollections,
      true,
    );
  });

  it("preserves uniqueness, sequential order, and Foundation references", () => {
    const collections = Object.freeze([
      IntegrationGovernanceDomainRegistry,
      IntegrationGovernanceContractRegistry,
      IntegrationGovernanceCapabilityRegistry,
      IntegrationGovernancePolicyRegistry,
      IntegrationGovernanceComplianceRegistry,
      IntegrationGovernanceLifecycleRegistry,
    ]);

    const allIds = collections.flatMap((collection) =>
      collection.map((item) => item.id),
    );
    assertUnique(allIds, "canonical IDs");

    for (const collection of collections) {
      assertUnique(
        collection.map((item) => item.key),
        `${collection[0]?.category ?? "registry"} keys`,
      );
      assertSequentialOrders(
        collection.map((item) => item.order),
        `${collection[0]?.category ?? "registry"}`,
      );
      assert.ok(
        collection.every(
          (item) =>
            item.sourcePhase === "EIL-7:1" &&
            item.status === "Registered" &&
            item.sourceCanonicalId.length > 0 &&
            item.sourceReference.includes("EIL-7:1"),
        ),
      );
    }

    assert.deepEqual(
      IntegrationGovernanceLifecycleRegistry.map((item) => item.key),
      [...IntegrationGovernanceFoundationPlatform.lifecycle.states],
    );
    assert.deepEqual(
      IntegrationGovernanceDomainRegistry.map((item) => item.key),
      IntegrationGovernanceFoundationPlatform.domains.map(
        (item) => item.domainKey,
      ),
    );
    assert.deepEqual(
      IntegrationGovernanceContractRegistry.map((item) => item.key),
      IntegrationGovernanceFoundationPlatform.contracts.map(
        (item) => item.contractName,
      ),
    );
    assert.deepEqual(
      IntegrationGovernanceCapabilityRegistry.map((item) => item.key),
      IntegrationGovernanceFoundationPlatform.capabilityDeclarations.map(
        (item) => item.capabilityKey,
      ),
    );
    assert.deepEqual(
      IntegrationGovernancePolicyRegistry.map((item) => item.key),
      IntegrationGovernanceFoundationPlatform.policyCategories.map(
        (item) => item.categoryKey,
      ),
    );
    assert.deepEqual(
      IntegrationGovernanceComplianceRegistry.map((item) => item.key),
      IntegrationGovernanceFoundationPlatform.complianceCategories.map(
        (item) => item.categoryKey,
      ),
    );
  });

  it("exposes an immutable aggregate Registry and package Registry surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceRegistry), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceDomainRegistry), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceContractRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceCapabilityRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernancePolicyRegistry), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceComplianceRegistry),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceLifecycleRegistry), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceRegistryInventory), true);

    assert.equal(
      IntegrationGovernanceRegistry.domains,
      IntegrationGovernanceDomainRegistry,
    );
    assert.equal(
      IntegrationGovernanceRegistry.contracts,
      IntegrationGovernanceContractRegistry,
    );
    assert.equal(
      IntegrationGovernanceRegistry.capabilities,
      IntegrationGovernanceCapabilityRegistry,
    );
    assert.equal(
      IntegrationGovernanceRegistry.policyCategories,
      IntegrationGovernancePolicyRegistry,
    );
    assert.equal(
      IntegrationGovernanceRegistry.complianceCategories,
      IntegrationGovernanceComplianceRegistry,
    );
    assert.equal(
      IntegrationGovernanceRegistry.lifecycle,
      IntegrationGovernanceLifecycleRegistry,
    );

    for (const exportName of REQUIRED_REGISTRY_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const registry = IntegrationGovernanceRegistry;
    assert.equal(registry.metadataOnly, true);
    assert.equal(registry.runtimeBehavior, false);
    assert.equal(registry.governanceEngine, false);
    assert.equal(registry.policyEngine, false);
    assert.equal(registry.complianceEngine, false);
    assert.equal(registry.approvalWorkflow, false);
    assert.equal(registry.auditRuntime, false);
    assert.equal(registry.riskRuntime, false);
    assert.equal(registry.versionManager, false);
    assert.equal(registry.compatibilityResolver, false);
    assert.equal(registry.networkingBehavior, false);
    assert.equal(registry.persistenceBehavior, false);
    assert.equal(registry.reactBehavior, false);
    assert.equal(registry.stateMutation, false);
    assert.equal(registry.importsLaterEil7Phases, false);
  });

  it("has zero prohibited imports across registry sources", () => {
    const sources = EIL72_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for registry sources", () => {
    const sources = EIL72_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationGovernance/integrationGovernanceFoundation.ts",
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
