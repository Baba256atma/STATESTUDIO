/**
 * EIL-2:7 — Integration Connector Certification Tests.
 *
 * Deterministic coverage for the immutable Integration Connector Certification phase.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntegrationConnectorPlatform,
  IntegrationConnectorPlatformIdentity,
} from "./integrationConnectorPlatform.ts";
import * as CertificationModule from "./integrationConnectorCertification.ts";
import {
  IntegrationConnectorCertificationCollections,
  IntegrationConnectorCertificationCriteria,
  IntegrationConnectorCertificationGates,
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
  IntegrationConnectorCertificationReadiness,
  IntegrationConnectorCertificationSummary,
  IntegrationConnectorComplianceDeclarations,
} from "./integrationConnectorCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EIL27_FILES = Object.freeze([
  "integrationConnectorCertificationTypes.ts",
  "integrationConnectorCertificationIdentity.ts",
  "integrationConnectorCertificationCriteria.ts",
  "integrationConnectorCertificationGates.ts",
  "integrationConnectorComplianceDeclarations.ts",
  "integrationConnectorCertificationReadiness.ts",
  "integrationConnectorCertification.ts",
  "integrationConnectorCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorCertificationIdentity",
  "IntegrationConnectorCertificationCriteria",
  "IntegrationConnectorCertificationGates",
  "IntegrationConnectorComplianceDeclarations",
  "IntegrationConnectorCertificationReadiness",
  "IntegrationConnectorCertificationCollections",
  "IntegrationConnectorCertificationSummary",
  "IntegrationConnectorCertificationPlatform",
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
  /from ["']\.\/integrationConnectorPlatform(?!\.ts["'])/,
  /from ["']\.\/integrationConnector(Platform|Manifest|Validation|Model|Registry|Foundation)(Types|Identity|Composition|Inventory|Guarantees|Compatibility|ArchitectureManifest|InventoryManifest|DependencyManifest|CompatibilityManifest|Rules|Categories|Findings|Readiness|DomainModels|RelationshipModels|EndpointModels|ProtocolModels|CategoryRegistry|ContractRegistry|CapabilityRegistry|ResponsibilityRegistry|Contracts|Capabilities|Responsibilities|Lifecycle)\.ts["']/,
  /from ["']\.\/integrationConnector(Manifest|Validation|Model|Registry|Foundation)\.ts["']/,
  /from ["']\.\/integration(?!Connector)/,
  /from ["']\.\/integrationPublicIndex/,
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

describe("EIL-2:7 Integration Connector Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(EIL27_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EIL27_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical identity, namespace, version, Certification status, and ReadyForFreeze", () => {
    assert.equal(IntegrationConnectorCertificationIdentity.phaseId, "EIL-2:7");
    assert.equal(
      IntegrationConnectorCertificationIdentity.canonicalId,
      "EIL-2:7/IntegrationConnectorCertification",
    );
    assert.equal(
      IntegrationConnectorCertificationIdentity.name,
      "Integration Connector Certification",
    );
    assert.equal(IntegrationConnectorCertificationIdentity.version, "1.0.0");
    assert.equal(
      IntegrationConnectorCertificationIdentity.namespace,
      "nexora.eil.integration-connector.certification",
    );
    assert.equal(IntegrationConnectorCertificationIdentity.layer, "EIL");
    assert.equal(IntegrationConnectorCertificationIdentity.platform, "EIL-2");
    assert.equal(
      IntegrationConnectorCertificationIdentity.phaseType,
      "Certification",
    );
    assert.equal(
      IntegrationConnectorCertificationIdentity.status,
      "Certification",
    );
    assert.equal(
      IntegrationConnectorCertificationIdentity.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationConnectorCertificationPlatform.status,
      "Certification",
    );
    assert.equal(
      IntegrationConnectorCertificationPlatform.readiness.readinessState,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationConnectorCertificationPlatform.nextPhase,
      "EIL-2:8 — Integration Connector Freeze",
    );
  });

  it("declares Platform aggregate as the sole phase dependency", () => {
    const { dependency } = IntegrationConnectorCertificationPlatform;
    assert.equal(dependency.phaseDependencyCount, 1);
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.platformId,
      IntegrationConnectorPlatformIdentity.canonicalId,
    );
    assert.equal(
      dependency.directPreviousPhaseModule,
      "integrationConnectorPlatform.ts",
    );
    assert.equal(
      IntegrationConnectorCertificationIdentity.platformDependency,
      "EIL-2:6/IntegrationConnectorPlatform",
    );
    assert.equal(
      IntegrationConnectorCertificationIdentity.platformEntryPoint,
      "integrationConnectorPlatform.ts",
    );
    assert.equal(dependency.platformInternalImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.eil1Dependency, false);
    assert.equal(dependency.laterEil2PhaseImport, false);
    assert.equal(
      IntegrationConnectorCertificationPlatform.integrationConnectorPlatform,
      IntegrationConnectorPlatform,
    );
  });

  it("freezes criteria, gates, compliance, readiness, and aggregates", () => {
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationIdentity),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationCriteria),
      true,
    );
    assert.equal(Object.isFrozen(IntegrationConnectorCertificationGates), true);
    assert.equal(
      Object.isFrozen(IntegrationConnectorComplianceDeclarations),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationReadiness),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationCollections),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationSummary),
      true,
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationPlatform),
      true,
    );

    for (const entry of IntegrationConnectorCertificationCriteria) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesCertification, false);
    }
    for (const entry of IntegrationConnectorCertificationGates) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.executesGate, false);
    }
    for (const entry of IntegrationConnectorComplianceDeclarations) {
      assert.equal(Object.isFrozen(entry), true);
      assert.equal(entry.runtimeEnforced, false);
    }
    assert.equal(
      IntegrationConnectorCertificationReadiness.executesGates,
      false,
    );
  });

  it("declares exactly sixteen criteria, twelve gates, and ten compliance entries", () => {
    assert.equal(IntegrationConnectorCertificationCriteria.length, 16);
    assert.deepEqual(
      IntegrationConnectorCertificationCriteria.map((item) => item.canonicalKey),
      [...EXPECTED_CRITERIA],
    );
    assertUnique(
      IntegrationConnectorCertificationCriteria.map((item) => item.criterionId),
      "criterion IDs",
    );
    assertAscending(
      IntegrationConnectorCertificationCriteria.map((item) => item.ordinal),
      "criterion",
    );

    assert.equal(IntegrationConnectorCertificationGates.length, 12);
    assert.deepEqual(
      IntegrationConnectorCertificationGates.map((item) => item.canonicalKey),
      [...EXPECTED_GATES],
    );
    assertUnique(
      IntegrationConnectorCertificationGates.map((item) => item.gateId),
      "gate IDs",
    );
    assertAscending(
      IntegrationConnectorCertificationGates.map((item) => item.ordinal),
      "gate",
    );

    assert.equal(IntegrationConnectorComplianceDeclarations.length, 10);
    assert.deepEqual(
      IntegrationConnectorComplianceDeclarations.map(
        (item) => item.canonicalKey,
      ),
      [...EXPECTED_COMPLIANCE],
    );
    assertUnique(
      IntegrationConnectorComplianceDeclarations.map(
        (item) => item.complianceId,
      ),
      "compliance IDs",
    );
    assertAscending(
      IntegrationConnectorComplianceDeclarations.map((item) => item.ordinal),
      "compliance",
    );
  });

  it("derives inventory counts dynamically from canonical collections", () => {
    assert.equal(
      IntegrationConnectorCertificationCollections.criteriaCount,
      IntegrationConnectorCertificationCriteria.length,
    );
    assert.equal(
      IntegrationConnectorCertificationCollections.gateCount,
      IntegrationConnectorCertificationGates.length,
    );
    assert.equal(
      IntegrationConnectorCertificationCollections.complianceCount,
      IntegrationConnectorComplianceDeclarations.length,
    );
    assert.equal(
      IntegrationConnectorCertificationCollections.totalCertificationEntryCount,
      IntegrationConnectorCertificationCriteria.length +
        IntegrationConnectorCertificationGates.length +
        IntegrationConnectorComplianceDeclarations.length,
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.criteriaCount,
      IntegrationConnectorCertificationCollections.criteriaCount,
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.gateCount,
      IntegrationConnectorCertificationCollections.gateCount,
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.complianceCount,
      IntegrationConnectorCertificationCollections.complianceCount,
    );
    assert.equal(
      IntegrationConnectorCertificationPlatform.inventory
        .countsDerivedFromCollections,
      true,
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.totalCertificationEntryCount,
      38,
    );
  });

  it("is metadata-only with zero runtime certification behavior", () => {
    const platform = IntegrationConnectorCertificationPlatform;
    assert.equal(platform.metadataOnly, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.certificationEngine, false);
    assert.equal(platform.runtimeCertification, false);
    assert.equal(platform.gateExecution, false);
    assert.equal(platform.connectorRuntime, false);
    assert.equal(platform.endpointExecution, false);
    assert.equal(platform.protocolExecution, false);
    assert.equal(platform.restBehavior, false);
    assert.equal(platform.graphqlBehavior, false);
    assert.equal(platform.websocketBehavior, false);
    assert.equal(platform.httpClientBehavior, false);
    assert.equal(platform.messageBrokerBehavior, false);
    assert.equal(platform.eventBus, false);
    assert.equal(platform.authenticationLogic, false);
    assert.equal(platform.authorizationLogic, false);
    assert.equal(platform.encryptionBehavior, false);
    assert.equal(platform.adapterBehavior, false);
    assert.equal(platform.dependencyInjection, false);
    assert.equal(platform.persistenceBehavior, false);
    assert.equal(platform.storageBehavior, false);
    assert.equal(platform.cacheBehavior, false);
    assert.equal(platform.filesystemBehavior, false);
    assert.equal(platform.networkingBehavior, false);
    assert.equal(platform.aiBehavior, false);
    assert.equal(platform.llmBehavior, false);
    assert.equal(platform.uiBehavior, false);
    assert.equal(platform.reactBehavior, false);
    assert.equal(platform.sdkRuntime, false);
    assert.equal(platform.apiBehavior, false);
    assert.equal(platform.stateMutation, false);
    assert.equal(platform.eil1Dependency, false);
    assert.equal(platform.importsLaterEil2Phases, false);
  });

  it("has zero prohibited imports and Platform as sole module dependency", () => {
    const sources = EIL27_FILES.filter((name) => !name.endsWith(".test.ts"));
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
        /from ["'][^"']*integrationConnectorFreeze[^"']*["']/,
      );
      assert.doesNotMatch(source, /from ["']node:(net|http|https|dgram)["']/);
      assert.doesNotMatch(source, /\b(fetch|axios)\b/);
      assert.doesNotMatch(source, /\bclass\b/);
      assert.doesNotMatch(source, /\basync\s+function\b/);
    }

    const aggregate = readFileSync(
      new URL("integrationConnectorCertification.ts", import.meta.url),
      "utf8",
    );
    assert.match(
      aggregate,
      /from ["']\.\/integrationConnectorPlatform\.ts["']/,
    );
    assert.equal(
      IntegrationConnectorCertificationPlatform.dependency.laterEil2PhaseImport,
      false,
    );
  });

  it("is ready for Freeze with stable summary", () => {
    assert.equal(
      IntegrationConnectorCertificationSummary.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.status,
      "Certification",
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.nextPhase,
      "EIL-2:8 — Integration Connector Freeze",
    );
    assert.equal(
      IntegrationConnectorCertificationSummary.platformId,
      "EIL-2:6/IntegrationConnectorPlatform",
    );
    assert.equal(
      Object.isFrozen(IntegrationConnectorCertificationSummary),
      true,
    );
    assert.equal(IntegrationConnectorCertificationSummary.criteriaCount, 16);
    assert.equal(IntegrationConnectorCertificationSummary.gateCount, 12);
    assert.equal(IntegrationConnectorCertificationSummary.complianceCount, 10);
    assert.equal(
      IntegrationConnectorCertificationSummary.totalCertificationEntryCount,
      38,
    );
    assert.equal(
      IntegrationConnectorCertificationReadiness.readinessState,
      "ReadyForFreeze",
    );
  });
});
