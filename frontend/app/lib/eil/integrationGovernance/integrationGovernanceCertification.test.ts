/**
 * EIL-7:7 — Integration Governance Certification Tests.
 *
 * Deterministic architectural coverage for the immutable Certification phase.
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
  IntegrationGovernancePlatform,
  IntegrationGovernancePlatformCanonicalId,
} from "./integrationGovernancePlatform.ts";
import {
  IntegrationGovernanceCertification,
  IntegrationGovernanceCertificationAggregateResult,
  IntegrationGovernanceCertificationCriteria,
  IntegrationGovernanceCertificationDependencies,
  IntegrationGovernanceCertificationGates,
  IntegrationGovernanceCertificationIdentity,
  IntegrationGovernanceCertificationReadiness,
  IntegrationGovernanceCertificationReadinessValue,
} from "./index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../../..");

const EIL77_FILES = Object.freeze([
  "integrationGovernanceCertification.ts",
  "integrationGovernanceCertificationIdentity.ts",
  "integrationGovernanceCertificationCriteria.ts",
  "integrationGovernanceCertificationGates.ts",
  "integrationGovernanceCertificationResults.ts",
  "integrationGovernanceCertificationDependencies.ts",
  "integrationGovernanceCertificationReadiness.ts",
  "integrationGovernanceCertification.test.ts",
]);

const REQUIRED_CERTIFICATION_EXPORTS = Object.freeze([
  "IntegrationGovernanceCertificationIdentity",
  "IntegrationGovernanceCertification",
  "IntegrationGovernanceCertificationCriteria",
  "IntegrationGovernanceCertificationGates",
  "IntegrationGovernanceCertificationDependencies",
  "IntegrationGovernanceCertificationReadiness",
  "IntegrationGovernanceCertificationAggregateResult",
  "IntegrationGovernanceCertificationCanonicalId",
] as const);

const EXPECTED_CRITERION_KEYS = Object.freeze([
  "CanonicalIdentityCertified",
  "NamespaceCertified",
  "DependencyIntegrityCertified",
  "FoundationCompositionCertified",
  "RegistryCompositionCertified",
  "ModelCompositionCertified",
  "ValidationCompositionCertified",
  "ManifestCompositionCertified",
  "PlatformCompositionCertified",
  "MetadataIntegrityCertified",
  "InventoryIntegrityCertified",
  "CompatibilityCertified",
  "ExportSurfaceCertified",
  "TypeIntegrityCertified",
  "ArchitectureIntegrityCertified",
  "RuntimeIndependenceCertified",
  "PlatformReadinessCertified",
  "FreezeReadinessCertified",
] as const);

const EXPECTED_GATE_KEYS = Object.freeze([
  "IdentityGate",
  "NamespaceGate",
  "DependencyGate",
  "CompositionGate",
  "MetadataGate",
  "InventoryGate",
  "CompatibilityGate",
  "ExportGate",
  "TypeGate",
  "ArchitectureGate",
  "RuntimeIndependenceGate",
  "PackageIntegrityGate",
  "PlatformApprovalGate",
  "CertificationApprovalGate",
  "FreezeApprovalGate",
  "ReadyForFreezeGate",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationGovernance(Freeze|PublicIndex)/,
  /from ["']\.\/integrationGovernanceFoundation\.ts["']/,
  /from ["']\.\/integrationGovernanceRegistry\.ts["']/,
  /from ["']\.\/integrationGovernanceModel\.ts["']/,
  /from ["']\.\/integrationGovernanceValidation\.ts["']/,
  /from ["']\.\/integrationGovernanceManifest\.ts["']/,
  /from ["']\.\/integrationGovernancePlatform(Identity|Composition|Compatibility|Capabilities|Dependencies|Readiness)\.ts["']/,
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

describe("EIL-7:7 Integration Governance Certification", () => {
  it("creates exactly eight Certification files", () => {
    assert.equal(EIL77_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL77_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(
      IntegrationGovernanceCertificationIdentity.phaseId,
      "EIL-7:7",
    );
    assert.equal(
      IntegrationGovernanceCertificationIdentity.canonicalId,
      "EIL-7:7/IntegrationGovernanceCertification",
    );
    assert.equal(
      IntegrationGovernanceCertificationIdentity.name,
      "Integration Governance Certification",
    );
    assert.equal(IntegrationGovernanceCertificationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationGovernanceCertificationIdentity.namespace,
      "nexora.eil.integration-governance.certification",
    );
    assert.equal(
      IntegrationGovernanceCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationGovernanceCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationGovernanceCertificationReadinessValue,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationGovernanceCertificationReadiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationGovernanceCertificationIdentity.platformDependency,
      IntegrationGovernancePlatformCanonicalId,
    );
  });

  it("consumes Platform aggregate as the sole upstream dependency", () => {
    assert.equal(
      IntegrationGovernanceCertificationDependencies.platformOnly,
      true,
    );
    assert.equal(
      IntegrationGovernanceCertificationDependencies.upstreamCanonicalId,
      IntegrationGovernancePlatformCanonicalId,
    );
    assert.equal(
      IntegrationGovernanceCertification.platformReference.aggregate,
      IntegrationGovernancePlatform,
    );
    assert.equal(
      IntegrationGovernanceCertificationDependencies.manifestDirectImport,
      false,
    );
    assert.equal(
      IntegrationGovernanceCertificationDependencies.freezeDependency,
      false,
    );
    assert.equal(
      IntegrationGovernanceCertificationDependencies.publicIndexDependency,
      false,
    );
  });

  it("publishes exactly 18 criteria, 16 gates, and aggregate Pass", () => {
    assert.equal(IntegrationGovernanceCertificationCriteria.length, 18);
    assert.equal(IntegrationGovernanceCertificationGates.length, 16);
    assert.equal(IntegrationGovernanceCertificationAggregateResult, "Pass");
    assert.equal(IntegrationGovernanceCertification.aggregateResult, "Pass");
    assert.deepEqual(
      IntegrationGovernanceCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERION_KEYS],
    );
    assert.deepEqual(
      IntegrationGovernanceCertificationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATE_KEYS],
    );
    assertUnique(
      IntegrationGovernanceCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertUnique(
      IntegrationGovernanceCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertSequentialOrders(
      IntegrationGovernanceCertificationCriteria.map((item) => item.order),
      "criteria",
    );
    assertSequentialOrders(
      IntegrationGovernanceCertificationGates.map((item) => item.order),
      "gates",
    );
    assert.ok(
      IntegrationGovernanceCertificationGates.every(
        (item) => item.declaredResult === "Pass",
      ),
    );
  });

  it("derives inventory exclusively from Platform without redefining counts", () => {
    const derived = IntegrationGovernanceCertification.platformDerivedInventory;
    assert.equal(derived.countsDerivedFromPlatform, true);
    assert.equal(derived.independentInventory, false);
    assert.equal(derived.hardcodedTotals, false);
    assert.equal(
      derived.manifestDerivedInventory,
      IntegrationGovernancePlatform.manifestDerivedInventory,
    );
    assert.equal(
      derived.categoryCount,
      IntegrationGovernancePlatform.manifestDerivedInventory.categoryCount,
    );
    assert.equal(
      derived.ruleCount,
      IntegrationGovernancePlatform.manifestDerivedInventory.ruleCount,
    );
    assert.equal(
      derived.gateCount,
      IntegrationGovernancePlatform.manifestDerivedInventory.gateCount,
    );
    assert.equal(
      derived.totalValidationInventory,
      IntegrationGovernancePlatform.manifestDerivedInventory
        .totalValidationInventory,
    );
    assert.equal(derived.validationAggregateResult, "Pass");
    assert.equal(derived.validationReadiness, "ReadyForManifest");
  });

  it("exposes an immutable aggregate Certification and package Certification surface", () => {
    assert.equal(Object.isFrozen(IntegrationGovernanceCertification), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernanceCertificationCriteria),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationGovernanceCertificationGates), true);
    assert.equal(
      Object.isFrozen(IntegrationGovernanceCertificationDependencies),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationGovernanceCertificationReadiness),
      true,
    );

    assert.equal(
      IntegrationGovernanceCertification.criteria,
      IntegrationGovernanceCertificationCriteria,
    );
    assert.equal(
      IntegrationGovernanceCertification.gates,
      IntegrationGovernanceCertificationGates,
    );
    assert.equal(
      IntegrationGovernanceCertification.dependencies,
      IntegrationGovernanceCertificationDependencies,
    );

    for (const exportName of REQUIRED_CERTIFICATION_EXPORTS) {
      assert.ok(
        exportName in PackageModule,
        `package index must export ${exportName}`,
      );
    }
  });

  it("is metadata-only with zero runtime certification or governance behavior", () => {
    const certification = IntegrationGovernanceCertification;
    assert.equal(certification.metadataOnly, true);
    assert.equal(certification.runtimeBehavior, false);
    assert.equal(certification.certificationEngine, false);
    assert.equal(certification.runtimeValidation, false);
    assert.equal(certification.governanceEngine, false);
    assert.equal(certification.policyEngine, false);
    assert.equal(certification.complianceEngine, false);
    assert.equal(certification.approvalWorkflow, false);
    assert.equal(certification.auditRuntime, false);
    assert.equal(certification.riskRuntime, false);
    assert.equal(certification.versionManager, false);
    assert.equal(certification.compatibilityResolver, false);
    assert.equal(certification.dashboard, false);
    assert.equal(certification.networkingBehavior, false);
    assert.equal(certification.persistenceBehavior, false);
    assert.equal(certification.reactBehavior, false);
    assert.equal(certification.stateMutation, false);
    assert.equal(certification.importsLaterEil7Phases, false);
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL77_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["']\.\/integrationGovernancePlatform\.ts["']/,
      );
    }
  });

  it("passes strict TypeScript and ESLint for certification sources", () => {
    const sources = EIL77_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationGovernance/integrationGovernancePlatform.ts",
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
