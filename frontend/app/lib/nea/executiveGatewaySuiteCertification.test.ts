/**
 * NEA-8:7 — Executive Gateway Suite Certification Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuitePlatform,
  ExecutiveGatewaySuitePlatformId,
} from "./executiveGatewaySuitePlatform.ts";
import * as CertificationModule from "./executiveGatewaySuiteCertification.ts";
import {
  ExecutiveGatewaySuiteCertificationId,
  ExecutiveGatewaySuiteCertificationName,
  ExecutiveGatewaySuiteCertificationNamespace,
  ExecutiveGatewaySuiteCertificationPlatform,
  ExecutiveGatewaySuiteCertificationReadiness,
  ExecutiveGatewaySuiteCertificationStatus,
  ExecutiveGatewaySuiteCertificationVersion,
  getExecutiveGatewaySuiteCertificationSummary,
} from "./executiveGatewaySuiteCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA87_FILES = Object.freeze([
  "executiveGatewaySuiteCertificationTypes.ts",
  "executiveGatewaySuiteCertificationGates.ts",
  "executiveGatewaySuiteCertificationMetadata.ts",
  "executiveGatewaySuiteCertificationCompliance.ts",
  "executiveGatewaySuiteCertificationOwnership.ts",
  "executiveGatewaySuiteCertificationSummary.ts",
  "executiveGatewaySuiteCertification.ts",
  "executiveGatewaySuiteCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteCertificationId",
  "ExecutiveGatewaySuiteCertificationVersion",
  "ExecutiveGatewaySuiteCertificationName",
  "ExecutiveGatewaySuiteCertificationNamespace",
  "ExecutiveGatewaySuiteCertificationStatus",
  "ExecutiveGatewaySuiteCertificationReadiness",
  "ExecutiveGatewaySuiteCertificationPlatform",
  "getExecutiveGatewaySuiteCertificationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "gates",
  "compliance",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const EXPECTED_GATE_IDS = Object.freeze([
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "SuiteCompositionIntegrity",
  "ComponentIdentityIntegrity",
  "CanonicalReferenceIntegrity",
  "DependencyIntegrity",
  "OwnershipIntegrity",
  "NamespaceIntegrity",
  "PublicExportIntegrity",
  "InventoryIntegrity",
  "MetadataIntegrity",
  "ImmutabilityIntegrity",
  "ArchitectureCompleteness",
  "ConsumerReadiness",
] as const);

const EXPECTED_COMPLIANCE_NAMES = Object.freeze([
  "Phase Chain",
  "Canonical References",
  "Suite Composition",
  "Component Identities",
  "Ownership",
  "Inventory",
  "Namespace Composition",
  "Public Surface",
  "Immutability",
  "Dependency Direction",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:7 Executive Gateway Suite Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA87_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA87_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical certification identity, status Certification, ReadyForFreeze, and Pass outcome", () => {
    assert.equal(
      ExecutiveGatewaySuiteCertificationId,
      "NEA-8:7/ExecutiveGatewaySuiteCertification",
    );
    assert.equal(ExecutiveGatewaySuiteCertificationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteCertificationName,
      "Executive Gateway Suite Certification",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationNamespace,
      "nexora.nea.executive-gateway-suite.certification",
    );
    assert.equal(ExecutiveGatewaySuiteCertificationStatus, "Certification");
    assert.equal(
      ExecutiveGatewaySuiteCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.identity.phase,
      "NEA-8:7",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.identity.platformId,
      ExecutiveGatewaySuitePlatformId,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.metadata.certificationOutcome,
      "Pass",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.nextPhase,
      "NEA-8:8 — Executive Gateway Suite Freeze",
    );
  });

  it("consumes only NEA-8:6 Platform and preserves the canonical phase chain", () => {
    const dependency = ExecutiveGatewaySuiteCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuitePlatform.ts",
    );
    assert.equal(dependency.platformId, ExecutiveGatewaySuitePlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.platform,
      ExecutiveGatewaySuitePlatform,
    );

    const ns = ExecutiveGatewaySuiteCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(
      ns.manifest,
      ExecutiveGatewaySuitePlatform.manifestPlatform,
    );
  });

  it("declares exactly 18 Pass gates with required fields", () => {
    const { gates } = ExecutiveGatewaySuiteCertificationPlatform;
    assert.equal(gates.gateCount, 18);
    assert.equal(gates.passedGateCount, 18);
    assert.equal(gates.failedGateCount, 0);
    assert.equal(gates.allGatesPass, true);
    assert.deepEqual(
      gates.gates.map((item) => item.id),
      [...EXPECTED_GATE_IDS],
    );
    assertUnique(
      gates.gates.map((item) => item.id),
      "gate ids",
    );
    assert.ok(gates.gates.every((item) => item.outcome === "Pass"));
    assert.ok(gates.gates.every((item) => item.status === "Evaluated"));
    assert.ok(gates.gates.every((item) => item.name.length > 0));
    assert.ok(gates.gates.every((item) => item.description.length > 0));
    assert.ok(gates.gates.every((item) => item.rationale.length > 0));
    assert.ok(gates.gates.every((item) => item.executesRuntime === false));
  });

  it("declares exactly 10 Compliant compliance declarations", () => {
    const { compliance } = ExecutiveGatewaySuiteCertificationPlatform;
    assert.equal(compliance.complianceCount, 10);
    assert.equal(compliance.allCompliant, true);
    assert.deepEqual(
      compliance.declarations.map((item) => item.complianceName),
      [...EXPECTED_COMPLIANCE_NAMES],
    );
    assert.ok(compliance.declarations.every((item) => item.compliant === true));
    assert.ok(
      compliance.declarations.every((item) => item.executesRuntime === false),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } =
      ExecutiveGatewaySuiteCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Declarations"));
    assert.ok(ownership.owns.includes("Certification Metadata"));
    assert.ok(ownership.doesNotOwn.includes("Foundation"));
    assert.ok(ownership.doesNotOwn.includes("Platform"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatform, false);
    assert.equal(ownership.ownsRuntimeGateway, false);
    assert.equal(ownership.ownsRuntimeCertification, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Certification Engine"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.manifestDirectImport, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteCertificationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.gates), true);
    assert.equal(Object.isFrozen(platform.compliance), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary with public API inventory 532 and architecture count 820", () => {
    const summaryA = getExecutiveGatewaySuiteCertificationSummary();
    const summaryB = getExecutiveGatewaySuiteCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, ExecutiveGatewaySuiteCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, ExecutiveGatewaySuitePlatformId);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(summaryA.gateCount, 18);
    assert.equal(summaryA.passedGateCount, 18);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
    assert.equal(summaryA.suiteComponentCount, 7);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuitePlatform.metadata.publicApiInventoryTotal,
    );
    assert.equal(summaryA.totalArchitectureCount, 820);
    assert.equal(
      summaryA.totalArchitectureCount,
      ExecutiveGatewaySuitePlatform.metadata.totalArchitectureCount,
    );
    assert.equal(summaryA.architectureVersion, "NEA-8.0.0");
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:8 — Executive Gateway Suite Freeze",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.metadata
        .canonicalReferenceMode,
      "PlatformOnly",
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteCertificationPlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.invokesAssistant,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteCertificationPlatform.aiReasoning, false);
    assert.equal(
      ExecutiveGatewaySuiteCertificationPlatform.businessLogic,
      false,
    );
  });
});
