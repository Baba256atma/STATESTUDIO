/**
 * EIL-4:7 — Integration Orchestration Certification Tests.
 *
 * Deterministic coverage for the immutable Integration Orchestration Certification phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationOrchestrationPlatform,
  IntegrationOrchestrationPlatformIdentity,
} from "./integrationOrchestrationPlatform.ts";
import * as CertificationModule from "./integrationOrchestrationCertification.ts";
import {
  IntegrationOrchestrationCertificationCollections,
  IntegrationOrchestrationCertificationCriteria,
  IntegrationOrchestrationCertificationGates,
  IntegrationOrchestrationCertificationIdentity,
  IntegrationOrchestrationCertificationPlatform,
  IntegrationOrchestrationCertificationReadiness,
  IntegrationOrchestrationCertificationSummary,
  IntegrationOrchestrationComplianceDeclarations,
} from "./integrationOrchestrationCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL47_FILES = Object.freeze([
  "integrationOrchestrationCertificationTypes.ts",
  "integrationOrchestrationCertificationIdentity.ts",
  "integrationOrchestrationCertificationCriteria.ts",
  "integrationOrchestrationCertificationGates.ts",
  "integrationOrchestrationComplianceDeclarations.ts",
  "integrationOrchestrationCertificationReadiness.ts",
  "integrationOrchestrationCertification.ts",
  "integrationOrchestrationCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationCertificationIdentity",
  "IntegrationOrchestrationCertificationCriteria",
  "IntegrationOrchestrationCertificationGates",
  "IntegrationOrchestrationComplianceDeclarations",
  "IntegrationOrchestrationCertificationReadiness",
  "IntegrationOrchestrationCertificationCollections",
  "IntegrationOrchestrationCertificationSummary",
  "IntegrationOrchestrationCertificationPlatform",
] as const);

const EXPECTED_CRITERIA = Object.freeze([
  "CanonicalIdentity",
  "NamespaceIntegrity",
  "VersionIntegrity",
  "DependencyIntegrity",
  "InventoryIntegrity",
  "ValidationCompleteness",
  "ManifestCompleteness",
  "PlatformCompleteness",
  "CompatibilityIntegrity",
  "MetadataImmutability",
  "DeterministicOrdering",
  "ArchitecturalConsistency",
  "AggregateEntryPointIntegrity",
  "MetadataOnlyCompliance",
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
  /from ["']\.\/integrationOrchestrationPlatform(?!\.ts["'])/,
  /from ["']\.\/integrationOrchestration(Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationOrchestration(Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Orchestration)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting/,
  /from ["']\.\/integrationOrchestration(Freeze|PublicIndex)/,
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

describe("EIL-4:7 Integration Orchestration Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(EIL47_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL47_FILES) {
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
      IntegrationOrchestrationCertificationIdentity.phaseId,
      "EIL-4:7",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.canonicalId,
      "EIL-4:7/IntegrationOrchestrationCertification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.name,
      "Integration Orchestration Certification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.version,
      "1.0.0",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.namespace,
      "nexora.eil.integration-orchestration.certification",
    );
    assert.equal(IntegrationOrchestrationCertificationIdentity.layer, "EIL");
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.platform,
      "EIL-4",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.phaseType,
      "Certification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationOrchestrationCertificationPlatform.status,
      "Certification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationReadiness.readinessState,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationOrchestrationCertificationPlatform.nextPhase,
      "EIL-4:8 — Integration Orchestration Freeze",
    );
  });

  it("declares Platform aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationOrchestrationCertificationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.platformId,
      IntegrationOrchestrationPlatformIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationOrchestrationPlatform.ts",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.platformDependency,
      "EIL-4:6/IntegrationOrchestrationPlatform",
    );
    assert.equal(
      IntegrationOrchestrationCertificationIdentity.platformEntryPoint,
      "integrationOrchestrationPlatform.ts",
    );
    assert.equal(dependency.platformInternalImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil4PhaseImport, false);
    assert.equal(
      IntegrationOrchestrationCertificationPlatform.integrationOrchestrationPlatform,
      IntegrationOrchestrationPlatform,
    );
  });

  it("publishes exactly sixteen criteria in deterministic order", () => {
    assert.equal(IntegrationOrchestrationCertificationCriteria.length, 16);
    assert.deepEqual(
      IntegrationOrchestrationCertificationCriteria.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_CRITERIA],
    );
    assertUnique(
      IntegrationOrchestrationCertificationCriteria.map(
        (item) => item.criterionId,
      ),
      "criterion IDs",
    );
    assertAscending(
      IntegrationOrchestrationCertificationCriteria.map((item) => item.ordinal),
      "criterion",
    );
    assert.ok(
      IntegrationOrchestrationCertificationCriteria.every(
        (item) =>
          item.executesCertification === false && item.metadataOnly === true,
      ),
    );
  });

  it("publishes exactly twelve gates and ten compliance declarations", () => {
    assert.equal(IntegrationOrchestrationCertificationGates.length, 12);
    assert.deepEqual(
      IntegrationOrchestrationCertificationGates.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_GATES],
    );
    assertAscending(
      IntegrationOrchestrationCertificationGates.map((item) => item.ordinal),
      "gate",
    );
    assert.ok(
      IntegrationOrchestrationCertificationGates.every(
        (item) => item.executesGate === false,
      ),
    );

    assert.equal(IntegrationOrchestrationComplianceDeclarations.length, 10);
    assert.deepEqual(
      IntegrationOrchestrationComplianceDeclarations.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPLIANCE],
    );
    assertAscending(
      IntegrationOrchestrationComplianceDeclarations.map(
        (item) => item.ordinal,
      ),
      "compliance",
    );
    assert.ok(
      IntegrationOrchestrationComplianceDeclarations.every(
        (item) => item.runtimeEnforced === false,
      ),
    );
  });

  it("derives inventory dynamically as 38 and freezes all collections", () => {
    const { collections, inventory } =
      IntegrationOrchestrationCertificationPlatform;
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
      IntegrationOrchestrationCertificationCollections.criteriaCount,
      16,
    );

    assert.equal(IntegrationOrchestrationCertificationSummary.criteriaCount, 16);
    assert.equal(IntegrationOrchestrationCertificationSummary.gateCount, 12);
    assert.equal(
      IntegrationOrchestrationCertificationSummary.complianceCount,
      10,
    );
    assert.equal(
      IntegrationOrchestrationCertificationSummary.totalCertificationEntryCount,
      38,
    );
    assert.equal(
      IntegrationOrchestrationCertificationSummary.status,
      "Certification",
    );
    assert.equal(
      IntegrationOrchestrationCertificationSummary.readiness,
      "ReadyForFreeze",
    );

    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationCriteria),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationGates),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationComplianceDeclarations),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationOrchestrationCertificationPlatform),
      true,
    );
  });

  it("is metadata-only with zero runtime certification behavior", () => {
    const platform = IntegrationOrchestrationCertificationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.runtimeCertification, false);
    assert.equal(platform.gateExecution, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.workflowExecution, false);
    assert.equal(platform.routingExecution, false);
    assert.equal(platform.schedulingBehavior, false);
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
    assert.equal(platform.importsLaterEil4Phases, false);
    assert.equal(
      IntegrationOrchestrationCertificationReadiness.executesGates,
      false,
    );
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL47_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL47_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationOrchestrationPlatform.ts",
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
