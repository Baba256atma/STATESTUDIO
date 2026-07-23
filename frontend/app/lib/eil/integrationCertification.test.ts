/**
 * EIL-1:7 — Integration Certification Tests.
 *
 * Deterministic coverage for the immutable Integration Certification phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationPlatform,
  IntegrationPlatformIdentity,
} from "./integrationPlatform.ts";
import * as CertificationModule from "./integrationCertification.ts";
import {
  IntegrationCertificationCollections,
  IntegrationCertificationCriteria,
  IntegrationCertificationGates,
  IntegrationCertificationIdentity,
  IntegrationCertificationPlatform,
  IntegrationCertificationReadiness,
  IntegrationCertificationSummary,
  IntegrationComplianceDeclarations,
} from "./integrationCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL17_FILES = Object.freeze([
  "integrationCertificationTypes.ts",
  "integrationCertificationIdentity.ts",
  "integrationCertificationCriteria.ts",
  "integrationCertificationGates.ts",
  "integrationComplianceDeclarations.ts",
  "integrationCertificationReadiness.ts",
  "integrationCertification.ts",
  "integrationCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationCertificationIdentity",
  "IntegrationCertificationCriteria",
  "IntegrationCertificationGates",
  "IntegrationComplianceDeclarations",
  "IntegrationCertificationReadiness",
  "IntegrationCertificationCollections",
  "IntegrationCertificationSummary",
  "IntegrationCertificationPlatform",
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
  "IdentityGate",
  "NamespaceGate",
  "DependencyGate",
  "InventoryGate",
  "ValidationGate",
  "ManifestGate",
  "PlatformGate",
  "CompatibilityGate",
  "ArchitectureGate",
  "ReadinessGate",
  "ComplianceGate",
  "ReleaseGate",
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
  /from ["']\.\/integrationPlatform(?!\.ts["'])/,
  /from ["']\.\/integration(Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|TopologyModels|LifecycleModels|Contracts|Capabilities|Responsibilities|Lifecycle|TypeRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry)\.ts["']/,
  /from ["']\.\/integration(Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
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

describe("EIL-1:7 Integration Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(EIL17_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL17_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(IntegrationCertificationIdentity.phaseId, "EIL-1:7");
    assert.equal(
      IntegrationCertificationIdentity.canonicalId,
      "EIL-1:7/IntegrationCertification",
    );
    assert.equal(
      IntegrationCertificationIdentity.name,
      "Integration Certification",
    );
    assert.equal(IntegrationCertificationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationCertificationIdentity.namespace,
      "nexora.eil.integration.certification",
    );
    assert.equal(IntegrationCertificationIdentity.layer, "EIL");
    assert.equal(IntegrationCertificationIdentity.platform, "EIL-1");
    assert.equal(
      IntegrationCertificationIdentity.phaseType,
      "Certification",
    );
    assert.equal(
      IntegrationCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(IntegrationCertificationPlatform.status, "Certification");
    assert.equal(
      IntegrationCertificationPlatform.readiness.readinessState,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationCertificationPlatform.nextPhase,
      "EIL-1:8 — Integration Freeze",
    );
  });

  it("declares Platform aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationCertificationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.platformId,
      IntegrationPlatformIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationPlatform.ts",
    );
    assert.equal(
      IntegrationCertificationIdentity.platformDependency,
      "EIL-1:6/IntegrationPlatform",
    );
    assert.equal(
      IntegrationCertificationIdentity.platformEntryPoint,
      "integrationPlatform.ts",
    );
    assert.equal(dependency.platformInternalImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.laterEilPhaseImport, false);
    assert.equal(
      IntegrationCertificationPlatform.integrationPlatform,
      IntegrationPlatform,
    );
  });

  it("freezes criteria, gates, compliance, readiness, and aggregates", () => {
    assert.equal(Object.isFrozen(IntegrationCertificationIdentity), true);
    assert.equal(Object.isFrozen(IntegrationCertificationCriteria), true);
    assert.equal(Object.isFrozen(IntegrationCertificationGates), true);
    assert.equal(Object.isFrozen(IntegrationComplianceDeclarations), true);
    assert.equal(Object.isFrozen(IntegrationCertificationReadiness), true);
    assert.equal(Object.isFrozen(IntegrationCertificationCollections), true);
    assert.equal(Object.isFrozen(IntegrationCertificationSummary), true);
    assert.equal(Object.isFrozen(IntegrationCertificationPlatform), true);

    for (const entry of IntegrationCertificationCriteria) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesCertification, false);
    }
    for (const entry of IntegrationCertificationGates) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesGate, false);
    }
    for (const entry of IntegrationComplianceDeclarations) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    assert.equal(IntegrationCertificationReadiness.executesGates, false);
  });

  it("declares complete criteria, gates, and compliance with deterministic ordinals", () => {
    assert.deepEqual(
      IntegrationCertificationCriteria.map((item) => item.canonicalKey),
      [...EXPECTED_CRITERIA],
    );
    assertUnique(
      IntegrationCertificationCriteria.map((item) => item.criterionId),
      "criterion IDs",
    );
    assertAscending(
      IntegrationCertificationCriteria.map((item) => item.ordinal),
      "criterion",
    );

    assert.deepEqual(
      IntegrationCertificationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATES],
    );
    assertUnique(
      IntegrationCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertAscending(
      IntegrationCertificationGates.map((item) => item.ordinal),
      "gate",
    );

    assert.deepEqual(
      IntegrationComplianceDeclarations.map((item) => item.canonicalKey),
      [...EXPECTED_COMPLIANCE],
    );
    assertUnique(
      IntegrationComplianceDeclarations.map((item) => item.complianceId),
      "compliance IDs",
    );
    assertAscending(
      IntegrationComplianceDeclarations.map((item) => item.ordinal),
      "compliance",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationCertificationCollections.criteriaCount,
      IntegrationCertificationCriteria.length,
    );
    assert.equal(
      IntegrationCertificationCollections.gateCount,
      IntegrationCertificationGates.length,
    );
    assert.equal(
      IntegrationCertificationCollections.complianceCount,
      IntegrationComplianceDeclarations.length,
    );
    assert.equal(
      IntegrationCertificationCollections.totalCertificationEntryCount,
      IntegrationCertificationCriteria.length +
        IntegrationCertificationGates.length +
        IntegrationComplianceDeclarations.length,
    );
    assert.equal(
      IntegrationCertificationSummary.criteriaCount,
      IntegrationCertificationCollections.criteriaCount,
    );
    assert.equal(
      IntegrationCertificationSummary.gateCount,
      IntegrationCertificationCollections.gateCount,
    );
    assert.equal(
      IntegrationCertificationSummary.complianceCount,
      IntegrationCertificationCollections.complianceCount,
    );
    assert.equal(
      IntegrationCertificationPlatform.inventory.countsDerivedFromCollections,
      true,
    );
  });

  it("is metadata-only with zero runtime certification behavior", () => {
    const platform = IntegrationCertificationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.runtimeCertification, false);
    assert.equal(platform.gateExecution, false);
    assert.equal(platform.routingEngine, false);
    assert.equal(platform.orchestrationEngine, false);
    assert.equal(platform.validationExecution, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.queueBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.connectorBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.visualizationBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.importsLaterEilPhases, false);
  });

  it("has zero prohibited imports and no later EIL phase dependencies", () => {
    const sources = EIL17_FILES.filter((name) => !name.endsWith(".test.ts"));
    for (const file of sources) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.doesNotMatch(
          source,
          pattern,
          `${file} must not match ${pattern}`,
        );
      }
      assert.doesNotMatch(
        source,
        /from ["'][^"']*integrationFreeze[^"']*["']/,
      );
      assert.doesNotMatch(
        source,
        /from ["'][^"']*EIL-1:[8-9][^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationCertification.ts", import.meta.url),
      "utf8",
    );
    assert.match(aggregate, /from ["']\.\/integrationPlatform\.ts["']/);
    assert.equal(
      IntegrationCertificationPlatform.dependency.laterEilPhaseImport,
      false,
    );
  });

  it("is ready for Freeze with stable summary", () => {
    assert.equal(
      IntegrationCertificationSummary.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationCertificationSummary.status,
      "Certification",
    );
    assert.equal(
      IntegrationCertificationSummary.nextPhase,
      "EIL-1:8 — Integration Freeze",
    );
    assert.equal(
      IntegrationCertificationSummary.platformId,
      "EIL-1:6/IntegrationPlatform",
    );
    assert.equal(Object.isFrozen(IntegrationCertificationSummary), true);
    assert.equal(IntegrationCertificationSummary.criteriaCount, 16);
    assert.equal(IntegrationCertificationSummary.gateCount, 12);
    assert.equal(IntegrationCertificationSummary.complianceCount, 10);
    assert.equal(
      IntegrationCertificationSummary.totalCertificationEntryCount,
      38,
    );
    assert.equal(
      IntegrationCertificationReadiness.readinessState,
      "ReadyForFreeze",
    );
  });
});
