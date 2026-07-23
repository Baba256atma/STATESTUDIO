/**
 * EIL-3:7 — Integration Routing Certification Tests.
 *
 * Deterministic coverage for the immutable Integration Routing Certification phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationRoutingPlatform,
  IntegrationRoutingPlatformIdentity,
} from "./integrationRoutingPlatform.ts";
import * as CertificationModule from "./integrationRoutingCertification.ts";
import {
  IntegrationRoutingCertificationCollections,
  IntegrationRoutingCertificationCriteria,
  IntegrationRoutingCertificationGates,
  IntegrationRoutingCertificationIdentity,
  IntegrationRoutingCertificationPlatform,
  IntegrationRoutingCertificationReadiness,
  IntegrationRoutingCertificationSummary,
  IntegrationRoutingComplianceDeclarations,
} from "./integrationRoutingCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");

const EIL37_FILES = Object.freeze([
  "integrationRoutingCertificationTypes.ts",
  "integrationRoutingCertificationIdentity.ts",
  "integrationRoutingCertificationCriteria.ts",
  "integrationRoutingCertificationGates.ts",
  "integrationRoutingComplianceDeclarations.ts",
  "integrationRoutingCertificationReadiness.ts",
  "integrationRoutingCertification.ts",
  "integrationRoutingCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationRoutingCertificationIdentity",
  "IntegrationRoutingCertificationCriteria",
  "IntegrationRoutingCertificationGates",
  "IntegrationRoutingComplianceDeclarations",
  "IntegrationRoutingCertificationReadiness",
  "IntegrationRoutingCertificationCollections",
  "IntegrationRoutingCertificationSummary",
  "IntegrationRoutingCertificationPlatform",
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
  /from ["']\.\/integrationRoutingPlatform(?!\.ts["'])/,
  /from ["']\.\/integrationRouting(Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationRouting(Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Routing)/,
  /from ["']\.\/integrationConnector/,
  /from ["']\.\/integrationRouting(Freeze|PublicIndex)/,
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

describe("EIL-3:7 Integration Routing Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(EIL37_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL37_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(IntegrationRoutingCertificationIdentity.phaseId, "EIL-3:7");
    assert.equal(
      IntegrationRoutingCertificationIdentity.canonicalId,
      "EIL-3:7/IntegrationRoutingCertification",
    );
    assert.equal(
      IntegrationRoutingCertificationIdentity.name,
      "Integration Routing Certification",
    );
    assert.equal(IntegrationRoutingCertificationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationRoutingCertificationIdentity.namespace,
      "nexora.eil.integration-routing.certification",
    );
    assert.equal(IntegrationRoutingCertificationIdentity.layer, "EIL");
    assert.equal(IntegrationRoutingCertificationIdentity.platform, "EIL-3");
    assert.equal(
      IntegrationRoutingCertificationIdentity.phaseType,
      "Certification",
    );
    assert.equal(
      IntegrationRoutingCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationRoutingCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationRoutingCertificationPlatform.status,
      "Certification",
    );
    assert.equal(
      IntegrationRoutingCertificationReadiness.readinessState,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationRoutingCertificationPlatform.nextPhase,
      "EIL-3:8 — Integration Routing Freeze",
    );
  });

  it("declares Platform aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationRoutingCertificationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.platformId,
      IntegrationRoutingPlatformIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationRoutingPlatform.ts",
    );
    assert.equal(
      IntegrationRoutingCertificationIdentity.platformDependency,
      "EIL-3:6/IntegrationRoutingPlatform",
    );
    assert.equal(
      IntegrationRoutingCertificationIdentity.platformEntryPoint,
      "integrationRoutingPlatform.ts",
    );
    assert.equal(dependency.platformInternalImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.previousEilPlatformDependency, false);
    assert.equal(dependency.laterEil3PhaseImport, false);
    assert.equal(
      IntegrationRoutingCertificationPlatform.integrationRoutingPlatform,
      IntegrationRoutingPlatform,
    );
  });

  it("publishes exactly sixteen criteria in deterministic order", () => {
    assert.equal(IntegrationRoutingCertificationCriteria.length, 16);
    assert.deepEqual(
      IntegrationRoutingCertificationCriteria.map((item) => item.canonicalKey),
      [...EXPECTED_CRITERIA],
    );
    assertUnique(
      IntegrationRoutingCertificationCriteria.map((item) => item.criterionId),
      "criterion IDs",
    );
    assertAscending(
      IntegrationRoutingCertificationCriteria.map((item) => item.ordinal),
      "criterion",
    );
    assert.ok(
      IntegrationRoutingCertificationCriteria.every(
        (item) =>
          item.executesCertification === false && item.metadataOnly === true,
      ),
    );
  });

  it("publishes exactly twelve gates and ten compliance declarations", () => {
    assert.equal(IntegrationRoutingCertificationGates.length, 12);
    assert.deepEqual(
      IntegrationRoutingCertificationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATES],
    );
    assertAscending(
      IntegrationRoutingCertificationGates.map((item) => item.ordinal),
      "gate",
    );
    assert.ok(
      IntegrationRoutingCertificationGates.every(
        (item) => item.executesGate === false,
      ),
    );

    assert.equal(IntegrationRoutingComplianceDeclarations.length, 10);
    assert.deepEqual(
      IntegrationRoutingComplianceDeclarations.map((item) => item.canonicalKey),
      [...EXPECTED_COMPLIANCE],
    );
    assertAscending(
      IntegrationRoutingComplianceDeclarations.map((item) => item.ordinal),
      "compliance",
    );
    assert.ok(
      IntegrationRoutingComplianceDeclarations.every(
        (item) => item.runtimeEnforced === false,
      ),
    );
  });

  it("derives inventory dynamically and freezes all collections", () => {
    const { collections, inventory } = IntegrationRoutingCertificationPlatform;
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
    assert.equal(inventory.countsDerivedFromCollections, true);
    assert.equal(IntegrationRoutingCertificationCollections.criteriaCount, 16);

    assert.equal(IntegrationRoutingCertificationSummary.criteriaCount, 16);
    assert.equal(IntegrationRoutingCertificationSummary.gateCount, 12);
    assert.equal(IntegrationRoutingCertificationSummary.complianceCount, 10);
    assert.equal(
      IntegrationRoutingCertificationSummary.status,
      "Certification",
    );
    assert.equal(
      IntegrationRoutingCertificationSummary.readiness,
      "ReadyForFreeze",
    );

    assert.equal(Object.isFrozen(IntegrationRoutingCertificationIdentity), true);
    assert.equal(Object.isFrozen(IntegrationRoutingCertificationCriteria), true);
    assert.equal(Object.isFrozen(IntegrationRoutingCertificationGates), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingComplianceDeclarations),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationRoutingCertificationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationRoutingCertificationCollections),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationRoutingCertificationSummary), true);
    assert.equal(
      Object.isFrozen(IntegrationRoutingCertificationPlatform),
      true,
    );
  });

  it("is metadata-only with zero runtime certification behavior", () => {
    const platform = IntegrationRoutingCertificationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.runtimeEnforcement, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.runtimeCertification, false);
    assert.equal(platform.gateExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.messageExecution, false);
    assert.equal(platform.orchestrationBehavior, false);
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
    assert.equal(platform.importsLaterEil3Phases, false);
    assert.equal(IntegrationRoutingCertificationReadiness.executesGates, false);
  });

  it("has zero prohibited imports across certification sources", () => {
    const sources = EIL37_FILES.filter((name) => !name.endsWith(".test.ts"));
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
    const sources = EIL37_FILES.filter((name) => !name.endsWith(".test.ts")).map(
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
        "app/lib/eil/integrationRoutingPlatform.ts",
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
