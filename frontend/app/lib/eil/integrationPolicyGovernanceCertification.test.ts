/**
 * EIL-5:7 — Integration Policy & Governance Certification Tests.
 *
 * Deterministic coverage for the immutable Integration Policy & Governance Certification phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPolicyGovernancePlatform,
  IntegrationPolicyGovernancePlatformIdentity,
} from "./integrationPolicyGovernancePlatform.ts";
import * as CertificationModule from "./integrationPolicyGovernanceCertification.ts";
import {
  IntegrationPolicyGovernanceCertificationCollections,
  IntegrationPolicyGovernanceCertificationCriteria,
  IntegrationPolicyGovernanceCertificationGates,
  IntegrationPolicyGovernanceCertificationIdentity,
  IntegrationPolicyGovernanceCertificationPlatform,
  IntegrationPolicyGovernanceCertificationReadiness,
  IntegrationPolicyGovernanceCertificationSummary,
  IntegrationPolicyGovernanceComplianceDeclarations,
} from "./integrationPolicyGovernanceCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL57_FILES = Object.freeze([
  "integrationPolicyGovernanceCertificationTypes.ts",
  "integrationPolicyGovernanceCertificationIdentity.ts",
  "integrationPolicyGovernanceCertificationCriteria.ts",
  "integrationPolicyGovernanceCertificationGates.ts",
  "integrationPolicyGovernanceComplianceDeclarations.ts",
  "integrationPolicyGovernanceCertificationReadiness.ts",
  "integrationPolicyGovernanceCertification.ts",
  "integrationPolicyGovernanceCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernanceCertificationIdentity",
  "IntegrationPolicyGovernanceCertificationCriteria",
  "IntegrationPolicyGovernanceCertificationGates",
  "IntegrationPolicyGovernanceComplianceDeclarations",
  "IntegrationPolicyGovernanceCertificationReadiness",
  "IntegrationPolicyGovernanceCertificationCollections",
  "IntegrationPolicyGovernanceCertificationSummary",
  "IntegrationPolicyGovernanceCertificationPlatform",
] as const);

const EXPECTED_CRITERIA = Object.freeze([
  "CanonicalIdentity",
  "NamespaceIntegrity",
  "VersionIntegrity",
  "DependencyIntegrity",
  "InventoryIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "CompatibilityIntegrity",
  "MetadataImmutability",
  "DeterministicOrdering",
  "ArchitecturalConsistency",
  "AggregateEntryPointIntegrity",
  "ComplianceIntegrity",
  "ReleaseConsistency",
  "ReadinessCompliance",
] as const);

const EXPECTED_GATES = Object.freeze([
  "Identity",
  "Namespace",
  "Dependency",
  "Inventory",
  "Validation",
  "Manifest",
  "Platform",
  "Compatibility",
  "Architecture",
  "Readiness",
  "Compliance",
  "Release",
] as const);

const EXPECTED_COMPLIANCE = Object.freeze([
  "MetadataOnlyCompliance",
  "CanonicalNamingCompliance",
  "DependencyCompliance",
  "CompatibilityCompliance",
  "InventoryCompliance",
  "ImmutabilityCompliance",
  "DeterministicOrderingCompliance",
  "AggregateEntryCompliance",
  "ArchitecturalCompliance",
  "CertificationCompliance",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\/integrationPolicyGovernancePlatform(?!\.ts["'])/,
  /from ["']\.\/integrationPolicyGovernance(Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationPolicyGovernance(Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!PolicyGovernance)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration/,
  /from ["']\.\/integrationPolicyGovernance(Freeze|PublicIndex)/,
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

describe("EIL-5:7 Integration Policy & Governance Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(EIL57_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL57_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.phaseId,
      "EIL-5:7",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.canonicalId,
      "EIL-5:7/IntegrationPolicyGovernanceCertification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.name,
      "Integration Policy & Governance Certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.namespace,
      "nexora.eil.integration-policy-governance.certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.layer,
      "EIL",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.platform,
      "EIL-5",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.phaseType,
      "Certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationPlatform.status,
      "Certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationReadiness.readinessState,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationPlatform.nextPhase,
      "EIL-5:8 — Integration Policy & Governance Freeze",
    );
  });

  it("declares Platform aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationPolicyGovernanceCertificationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.platformId,
      IntegrationPolicyGovernancePlatformIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPolicyGovernancePlatform.ts",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.platformDependency,
      "EIL-5:6/IntegrationPolicyGovernancePlatform",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationIdentity.platformEntryPoint,
      "integrationPolicyGovernancePlatform.ts",
    );
    assert.equal(dependency.platformInternalImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil5PhaseImport, false);
    assert.equal(
      IntegrationPolicyGovernanceCertificationPlatform.integrationPolicyGovernancePlatform,
      IntegrationPolicyGovernancePlatform,
    );
  });

  it("publishes exactly sixteen criteria in deterministic order", () => {
    assert.equal(
      IntegrationPolicyGovernanceCertificationCriteria.length,
      16,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERIA],
    );
    assertUnique(
      IntegrationPolicyGovernanceCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertAscending(
      IntegrationPolicyGovernanceCertificationCriteria.map(
        (item) => item.ordinal,
      ),
      "criterion",
    );
    assert.ok(
      IntegrationPolicyGovernanceCertificationCriteria.every(
        (item) =>
          item.executesCertification === false && item.metadataOnly === true,
      ),
    );
  });

  it("publishes exactly twelve gates and ten compliance declarations", () => {
    assert.equal(IntegrationPolicyGovernanceCertificationGates.length, 12);
    assert.deepEqual(
      IntegrationPolicyGovernanceCertificationGates.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GATES],
    );
    assertAscending(
      IntegrationPolicyGovernanceCertificationGates.map(
        (item) => item.ordinal,
      ),
      "gate",
    );
    assert.ok(
      IntegrationPolicyGovernanceCertificationGates.every(
        (item) => item.executesGate === false,
      ),
    );

    assert.equal(
      IntegrationPolicyGovernanceComplianceDeclarations.length,
      10,
    );
    assert.deepEqual(
      IntegrationPolicyGovernanceComplianceDeclarations.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPLIANCE],
    );
    assertAscending(
      IntegrationPolicyGovernanceComplianceDeclarations.map(
        (item) => item.ordinal,
      ),
      "compliance",
    );
    assert.ok(
      IntegrationPolicyGovernanceComplianceDeclarations.every(
        (item) => item.runtimeEnforced === false,
      ),
    );
  });

  it("derives inventory dynamically as 38 and freezes all collections", () => {
    const { collections, inventory } =
      IntegrationPolicyGovernanceCertificationPlatform;
    assert.equal(collections.criteriaCount, collections.criteria.length);
    assert.equal(collections.gateCount, collections.gates.length);
    assert.equal(collections.complianceCount, collections.compliance.length);
    assert.equal(collections.criteriaCount, 16);
    assert.equal(collections.gateCount, 12);
    assert.equal(collections.complianceCount, 10);
    assert.equal(collections.totalCertificationEntryCount, 38);

    assert.equal(inventory.criteriaCount, collections.criteriaCount);
    assert.equal(inventory.gateCount, collections.gateCount);
    assert.equal(inventory.complianceCount, collections.complianceCount);
    assert.equal(inventory.totalCertificationEntryCount, 38);
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(
      IntegrationPolicyGovernanceCertificationCollections.criteriaCount,
      16,
    );

    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.criteriaCount,
      16,
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.gateCount,
      12,
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.complianceCount,
      10,
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.totalCertificationEntryCount,
      38,
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.status,
      "Certification",
    );
    assert.equal(
      IntegrationPolicyGovernanceCertificationSummary.readiness,
      "ReadyForFreeze",
    );

    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationCriteria),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationGates),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceComplianceDeclarations),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationPolicyGovernanceCertificationPlatform),
      true,
    );
  });

  it("is metadata-only with zero runtime certification behavior", () => {
    const platform = IntegrationPolicyGovernanceCertificationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.runtimeCertification, false);
    assert.equal(platform.gateExecution, false);
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
    assert.equal(platform.importsLaterEil5Phases, false);
    assert.equal(
      IntegrationPolicyGovernanceCertificationReadiness.executesGates,
      false,
    );
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL57_FILES.filter((name) => !name.endsWith(".test.ts"));
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

  it("passes strict TypeScript and ESLint for certification sources", () => {
    const sources = EIL57_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationPolicyGovernancePlatform.ts",
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
