/**
 * EIL-7:8 — Integration Governance Freeze Tests.
 *
 * Deterministic architectural coverage for the immutable Freeze phase.
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
  IntegrationGovernanceCertification,
  IntegrationGovernanceCertificationCanonicalId,
} from "./integrationGovernanceCertification.ts";
import {
  IntegrationGovernanceFreeze,
  IntegrationGovernanceFreezeArchitecture,
  IntegrationGovernanceFreezeBaselines,
  IntegrationGovernanceFreezeCompatibility,
  IntegrationGovernanceFreezeExtensions,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
  IntegrationGovernanceFreezeLocks,
  IntegrationGovernanceFreezeReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL78_FILES = Object.freeze([
  "integrationGovernanceFreeze.ts",
  "integrationGovernanceFreezeIdentity.ts",
  "integrationGovernanceFreezeLocks.ts",
  "integrationGovernanceFreezeBaselines.ts",
  "integrationGovernanceFreezeCompatibility.ts",
  "integrationGovernanceFreezeExtensions.ts",
  "integrationGovernanceFreezeArchitecture.ts",
  "integrationGovernanceFreeze.test.ts",
]);

const REQUIRED_FREEZE_EXPORTS = Object.freeze([
  "IntegrationGovernanceFreezeIdentity",
  "IntegrationGovernanceFreeze",
  "IntegrationGovernanceFreezeLocks",
  "IntegrationGovernanceFreezeBaselines",
  "IntegrationGovernanceFreezeCompatibility",
  "IntegrationGovernanceFreezeExtensions",
  "IntegrationGovernanceFreezeArchitecture",
  "IntegrationGovernanceFreezeLockId",
  "IntegrationGovernanceFreezeCanonicalId",
] as const);

const EXPECTED_LOCK_KEYS = Object.freeze([
  "CanonicalIdentity",
  "Namespace",
  "DependencyChain",
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "CertificationIntegrity",
  "MetadataImmutability",
  "InventoryIntegrity",
  "ExportIntegrity",
  "RuntimeIndependence",
  "FreezeIntegrity",
  "PublicIndexReadiness",
] as const);

const EXPECTED_BASELINE_KEYS = Object.freeze([
  "IdentityBaseline",
  "DependencyBaseline",
  "MetadataBaseline",
  "ValidationBaseline",
  "ManifestBaseline",
  "PlatformBaseline",
  "CertificationBaseline",
  "FreezeBaseline",
] as const);

const EXPECTED_COMPATIBILITY_KEYS = Object.freeze([
  "FoundationCompatible",
  "RegistryCompatible",
  "ModelCompatible",
  "ValidationCompatible",
  "ManifestCompatible",
  "PlatformCompatible",
  "CertificationCompatible",
  "PublicIndexCompatible",
] as const);

const EXPECTED_EXTENSION_KEYS = Object.freeze([
  "PreserveFrozenContract",
  "NoFrozenMetadataMutation",
  "BackwardCompatibleOnly",
  "CanonicalArchitecturePreserved",
  "NoRuntimeIntroduction",
  "InventoryDerivationPreserved",
  "PackageEntryPreserved",
  "LockIdPreserved",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernancePublicIndex/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
  /from ["']\.\/integrationGovernanceModel\.ts["']/,
  /from ["']\.\/integrationGovernanceValidation\.ts["']/,
  /from ["']\.\/integrationGovernanceManifest\.ts["']/,
  /from ["']\.\/integrationGovernancePlatform\.ts["']/,
  /from ["']\.\/integrationGovernanceCertification(Identity|Criteria|Gates|Results|Dependencies|Readiness)\.ts["']/,
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

describe("EIL-7:8 Integration Governance Freeze", () => {
  it("creates exactly eight Freeze files", () => {
    assert.equal(EIL78_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL78_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, lock ID, Frozen status, and ReadyForPublicIndex", () => {
    assert.equal(IntegrationGovernanceFreezeIdentity.phaseId, "EIL-7:8");
    assert.equal(
      IntegrationGovernanceFreezeIdentity.canonicalId,
      "EIL-7:8/IntegrationGovernanceFreeze",
    );
    assert.equal(
      IntegrationGovernanceFreezeIdentity.name,
      "Integration Governance Freeze",
    );
    assert.equal(IntegrationGovernanceFreezeIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceFreezeIdentity.namespace,
      "nexora.eil.integration-governance.freeze",
    );
    assert.equal(IntegrationGovernanceFreezeIdentity.status, "Frozen");
    assert.equal(
      IntegrationGovernanceFreezeIdentity.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationGovernanceFreezeReadinessValue,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntegrationGovernanceFreezeLockId,
      "EIL-7-INTEGRATION-GOVERNANCE-LOCKED",
    );
    assert.equal(
      IntegrationGovernanceFreezeIdentity.lockId,
      IntegrationGovernanceFreezeLockId,
    );
    assert.equal(
      IntegrationGovernanceFreezeIdentity.certificationDependency,
      IntegrationGovernanceCertificationCanonicalId,
    );
  });

  it("consumes Certification aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationGovernanceFreeze.dependency.certificationOnly,
      true,
    );
    assert.equal(
      IntegrationGovernanceFreeze.dependency.upstreamCanonicalId,
      IntegrationGovernanceCertificationCanonicalId,
    );
    assert.equal(
      IntegrationGovernanceFreeze.certificationReference.aggregate,
      IntegrationGovernanceCertification,
    );
    assert.equal(
      IntegrationGovernanceFreeze.dependency.publicIndexDependency,
      false,
    );
    assert.equal(
      IntegrationGovernanceFreeze.dependency.platformDirectImport,
      false,
    );
  });

  it("publishes 16 locks, 8 baselines, 8 compatibility, and 8 extension declarations", () => {
    assert.equal(IntegrationGovernanceFreezeLocks.length, 16);
    assert.equal(IntegrationGovernanceFreezeBaselines.length, 8);
    assert.equal(IntegrationGovernanceFreezeCompatibility.length, 8);
    assert.equal(IntegrationGovernanceFreezeExtensions.length, 8);

    assert.deepEqual(
      IntegrationGovernanceFreezeLocks.map((item) => item.canonicalKey),
      [...EXPECTED_LOCK_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceFreezeBaselines.map((item) => item.canonicalKey),
      [...EXPECTED_BASELINE_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceFreezeCompatibility.map((item) => item.canonicalKey),
      [...EXPECTED_COMPATIBILITY_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceFreezeExtensions.map((item) => item.canonicalKey),
      [...EXPECTED_EXTENSION_KEYS],
    );

    assertUnique(
      IntegrationGovernanceFreezeLocks.map((item) => item.lockRecordId),
      "lock IDs",
    );
    assertUnique(
      IntegrationGovernanceFreezeBaselines.map((item) => item.baselineId),
      "baseline IDs",
    );
    assertUnique(
      IntegrationGovernanceFreezeCompatibility.map(
        (item) => item.compatibilityId,
      ),
      "compatibility IDs",
    );
    assertUnique(
      IntegrationGovernanceFreezeExtensions.map((item) => item.extensionId),
      "extension IDs",
    );

    assertSequentialOrders(
      IntegrationGovernanceFreezeLocks.map((item) => item.order),
      "locks",
    );
    assertSequentialOrders(
      IntegrationGovernanceFreezeBaselines.map((item) => item.order),
      "baselines",
    );
    assertSequentialOrders(
      IntegrationGovernanceFreezeCompatibility.map((item) => item.order),
      "compatibility",
    );
    assertSequentialOrders(
      IntegrationGovernanceFreezeExtensions.map((item) => item.order),
      "extensions",
    );

    assert.ok(
      IntegrationGovernanceFreezeExtensions.every(
        (item) =>
          item.preservesFrozenContract &&
          item.cannotModifyFrozenMetadata &&
          item.mustRemainBackwardCompatible &&
          item.mustNotViolateCanonicalArchitecture &&
          item.implementsExtension === false,
      ),
    );
  });

  it("exposes deeply immutable freeze architecture with Certification inventory references", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceFreeze), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceFreezeArchitecture),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceFreezeIdentity), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceFreezeLocks), true);
    assert.equal(Object.isFrozen(IntegrationGovernanceFreezeBaselines), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceFreezeCompatibility),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceFreezeExtensions), true);

    assert.equal(IntegrationGovernanceFreeze.deeplyImmutable, true);
    assert.equal(
      IntegrationGovernanceFreezeArchitecture.deeplyImmutable,
      true,
    );
    assert.equal(
      IntegrationGovernanceFreeze.architecture,
      IntegrationGovernanceFreezeArchitecture,
    );
    assert.equal(
      IntegrationGovernanceFreezeArchitecture.lockId,
      IntegrationGovernanceFreezeLockId,
    );

    const derived = IntegrationGovernanceFreeze.certificationDerivedInventory;
    assert.equal(derived.countsDerivedFromCertification, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.platformDerivedInventory,
      IntegrationGovernanceCertification.platformDerivedInventory,
    );
    assert.equal(
      derived.certificationAggregateResult,
      IntegrationGovernanceCertification.aggregateResult,
    );
    assert.equal(derived.certificationAggregateResult, "Pass");
    assert.equal(derived.validationAggregateResult, "Pass");
  });

  it("exposes package Freeze surface", () => {
    for (const exportName of REQUIRED_FREEZE_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime governance behavior", () => {
    const freeze = IntegrationGovernanceFreeze;
    assert.equal(freeze.metadataOnly, true);
    assert.equal(freeze.runtimeBehavior, false);
    assert.equal(freeze.governanceEngine, false);
    assert.equal(freeze.policyEngine, false);
    assert.equal(freeze.complianceEngine, false);
    assert.equal(freeze.certificationEngine, false);
    assert.equal(freeze.approvalWorkflow, false);
    assert.equal(freeze.auditRuntime, false);
    assert.equal(freeze.riskRuntime, false);
    assert.equal(freeze.versionManager, false);
    assert.equal(freeze.compatibilityResolver, false);
    assert.equal(freeze.dashboard, false);
    assert.equal(freeze.networkingBehavior, false);
    assert.equal(freeze.persistenceBehavior, false);
    assert.equal(freeze.reactBehavior, false);
    assert.equal(freeze.stateMutation, false);
    assert.equal(freeze.importsLaterEil7Phases, false);
  });

  it("has zero prohibited imports across freeze sources", () => {
    const sources = EIL78_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationGovernanceCertification\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for freeze sources", () => {
    const sources = EIL78_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationGovernance/integrationGovernanceCertification.ts",
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
