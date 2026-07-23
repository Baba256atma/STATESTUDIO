/**
 * EIL-7:6 — Integration Governance Platform Tests.
 *
 * Deterministic architectural coverage for the immutable Platform phase.
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
  IntegrationGovernanceManifest,
  IntegrationGovernanceManifestCanonicalId,
} from "./integrationGovernanceManifest.ts";
import {
  IntegrationGovernancePlatform,
  IntegrationGovernancePlatformCapabilities,
  IntegrationGovernancePlatformCompatibility,
  IntegrationGovernancePlatformComposition,
  IntegrationGovernancePlatformDependencies,
  IntegrationGovernancePlatformIdentity,
  IntegrationGovernancePlatformReadiness,
  IntegrationGovernancePlatformReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL76_FILES = Object.freeze([
  "integrationGovernancePlatform.ts",
  "integrationGovernancePlatformIdentity.ts",
  "integrationGovernancePlatformComposition.ts",
  "integrationGovernancePlatformCompatibility.ts",
  "integrationGovernancePlatformCapabilities.ts",
  "integrationGovernancePlatformDependencies.ts",
  "integrationGovernancePlatformReadiness.ts",
  "integrationGovernancePlatform.test.ts",
]);

const REQUIRED_PLATFORM_EXPORTS = Object.freeze([
  "IntegrationGovernancePlatformIdentity",
  "IntegrationGovernancePlatform",
  "IntegrationGovernancePlatformComposition",
  "IntegrationGovernancePlatformCapabilities",
  "IntegrationGovernancePlatformCompatibility",
  "IntegrationGovernancePlatformDependencies",
  "IntegrationGovernancePlatformReadiness",
  "IntegrationGovernancePlatformCanonicalId",
] as const);

const EXPECTED_CAPABILITY_KEYS = Object.freeze([
  "FoundationComposition",
  "RegistryComposition",
  "ModelComposition",
  "ValidationComposition",
  "ManifestComposition",
  "MetadataPublication",
  "CanonicalIdentity",
  "DependencyIntegrity",
  "ValidationIntegrity",
  "ReadinessPublication",
  "ExportStability",
  "CompatibilityPublication",
  "PlatformConsistency",
  "InventoryIntegrity",
  "TypeIntegrity",
  "ArchitectureIntegrity",
  "PlatformPackaging",
  "CertificationReadiness",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "ManifestCompatible",
  "CertificationCompatible",
  "FreezeCompatible",
  "PublicIndexCompatible",
  "TypeScriptCompatible",
  "ESLintCompatible",
  "MetadataCompatible",
  "CanonicalArchitectureCompatible",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernance(Certification|Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
  /from ["']\.\/integrationGovernanceModel\.ts["']/,
  /from ["']\.\/integrationGovernanceValidation\.ts["']/,
  /from ["']\.\/integrationGovernance(Validation|Manifest)(Rules|Categories|Results|Gates|Inventory|Report|Identity|Readiness|Compatibility|Guarantees|Dependencies|Exports)\.ts["']/,
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

describe("EIL-7:6 Integration Governance Platform", () => {
  it("creates exactly eight Platform files", () => {
    assert.equal(EIL76_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL76_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Platform status, and ReadyForCertification", () => {
    assert.equal(IntegrationGovernancePlatformIdentity.phaseId, "EIL-7:6");
    assert.equal(
      IntegrationGovernancePlatformIdentity.canonicalId,
      "EIL-7:6/IntegrationGovernancePlatform",
    );
    assert.equal(
      IntegrationGovernancePlatformIdentity.name,
      "Integration Governance Platform",
    );
    assert.equal(IntegrationGovernancePlatformIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernancePlatformIdentity.namespace,
      "nexora.eil.integration-governance.platform",
    );
    assert.equal(IntegrationGovernancePlatformIdentity.status, "Platform");
    assert.equal(
      IntegrationGovernancePlatformIdentity.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationGovernancePlatformReadinessValue,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationGovernancePlatformReadiness.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      IntegrationGovernancePlatformIdentity.manifestDependency,
      IntegrationGovernanceManifestCanonicalId,
    );
  });

  it("consumes Manifest aggregate as the sole upstream dependency", () => {
    assert.equal(IntegrationGovernancePlatformDependencies.manifestOnly, true);
    assert.equal(
      IntegrationGovernancePlatformDependencies.upstreamCanonicalId,
      IntegrationGovernanceManifestCanonicalId,
    );
    assert.equal(
      IntegrationGovernancePlatform.manifestReference.aggregate,
      IntegrationGovernanceManifest,
    );
    assert.equal(
      IntegrationGovernancePlatformDependencies.validationDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernancePlatformDependencies.certificationDependency,
      false,
    );
    assert.equal(
      IntegrationGovernancePlatformDependencies.laterEil7PhaseImport,
      false,
    );
    assert.equal(
      IntegrationGovernancePlatformDependencies.downstreamImplementationDependency,
      false,
    );
  });

  it("publishes exactly 18 capabilities and 12 compatibility declarations", () => {
    assert.equal(IntegrationGovernancePlatformCapabilities.length, 18);
    assert.equal(IntegrationGovernancePlatformCompatibility.length, 12);
    assert.deepEqual(
      IntegrationGovernancePlatformCapabilities.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CAPABILITY_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernancePlatformCompatibility.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assertUnique(
      IntegrationGovernancePlatformCapabilities.map(
        (item) => item.capabilityId,
      ),
      "capability IDs",
    );
    assertUnique(
      IntegrationGovernancePlatformCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertSequentialOrders(
      IntegrationGovernancePlatformCapabilities.map((item) => item.order),
      "capabilities",
    );
    assertSequentialOrders(
      IntegrationGovernancePlatformCompatibility.map((item) => item.order),
      "compatibility",
    );
  });

  it("preserves composition integrity through Manifest reference chains", () => {
    const composition = IntegrationGovernancePlatformComposition;
    assert.equal(composition.duplicatesUpstreamContents, false);
    assert.equal(
      composition.manifest.aggregate,
      IntegrationGovernanceManifest,
    );
    assert.equal(
      composition.validation.aggregate,
      IntegrationGovernanceManifest.validationReference.aggregate,
    );
    assert.equal(
      composition.model.aggregate,
      IntegrationGovernanceManifest.validationReference.aggregate.model,
    );
    assert.equal(
      composition.registry.aggregate,
      IntegrationGovernanceManifest.validationReference.aggregate.model
        .registry,
    );
    assert.equal(
      composition.foundation.aggregate,
      IntegrationGovernanceManifest.validationReference.aggregate.model
        .registry.foundation,
    );
    assert.deepEqual([...composition.canonicalReferenceChain], [
      "EIL-7:1/IntegrationGovernanceFoundation",
      "EIL-7:2/IntegrationGovernanceRegistry",
      "EIL-7:3/IntegrationGovernanceModel",
      "EIL-7:4/IntegrationGovernanceValidation",
      "EIL-7:5/IntegrationGovernanceManifest",
      "EIL-7:6/IntegrationGovernancePlatform",
    ]);
  });

  it("derives inventory exclusively from Manifest without redefining counts", () => {
    const derived = IntegrationGovernancePlatform.manifestDerivedInventory;
    assert.equal(derived.countsDerivedFromManifest, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.validationDerivedInventory,
      IntegrationGovernanceManifest.validationDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationGovernanceManifest.validationDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationGovernanceManifest.validationDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      IntegrationGovernanceManifest.validationDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationGovernanceManifest.validationDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Platform and package Platform surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernancePlatform), true);
    assert.equal(Object.isFrozen(IntegrationGovernancePlatformIdentity), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernancePlatformComposition),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernancePlatformCapabilities),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernancePlatformCompatibility),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernancePlatformDependencies),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernancePlatformReadiness), true);

    assert.equal(
      IntegrationGovernancePlatform.composition,
      IntegrationGovernancePlatformComposition,
    );
    assert.equal(
      IntegrationGovernancePlatform.capabilities,
      IntegrationGovernancePlatformCapabilities,
    );
    assert.equal(
      IntegrationGovernancePlatform.compatibility,
      IntegrationGovernancePlatformCompatibility,
    );

    for (const exportName of REQUIRED_PLATFORM_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const platform = IntegrationGovernancePlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.governanceEngine, false);
    assert.equal(platform.policyEngine, false);
    assert.equal(platform.complianceEngine, false);
    assert.equal(platform.approvalWorkflow, false);
    assert.equal(platform.auditRuntime, false);
    assert.equal(platform.riskRuntime, false);
    assert.equal(platform.versionManager, false);
    assert.equal(platform.compatibilityResolver, false);
    assert.equal(platform.dashboard, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.serviceBehavior, false);
    assert.equal(platform.workerBehavior, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEil7Phases, false);
  });

  it("has zero prohibited imports across platform sources", () => {
    const sources = EIL76_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationGovernanceManifest\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for platform sources", () => {
    const sources = EIL76_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationGovernance/integrationGovernanceManifest.ts",
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
