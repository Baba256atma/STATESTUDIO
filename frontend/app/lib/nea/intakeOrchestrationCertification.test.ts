/**
 * NEA-7:7 — Intake Orchestration Certification Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as CertificationModule from "./intakeOrchestrationCertification.ts";
import {
  IntakeOrchestrationCertificationId,
  IntakeOrchestrationCertificationName,
  IntakeOrchestrationCertificationNamespace,
  IntakeOrchestrationCertificationPlatform,
  IntakeOrchestrationCertificationReadiness,
  IntakeOrchestrationCertificationStatus,
  IntakeOrchestrationCertificationVersion,
  getIntakeOrchestrationCertificationSummary,
} from "./intakeOrchestrationCertification.ts";
import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
} from "./intakeOrchestrationPlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA77_FILES = Object.freeze([
  "intakeOrchestrationCertificationTypes.ts",
  "intakeOrchestrationCertificationGates.ts",
  "intakeOrchestrationCertificationMetadata.ts",
  "intakeOrchestrationCertificationCompliance.ts",
  "intakeOrchestrationCertificationOwnership.ts",
  "intakeOrchestrationCertificationSummary.ts",
  "intakeOrchestrationCertification.ts",
  "intakeOrchestrationCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationCertificationId",
  "IntakeOrchestrationCertificationVersion",
  "IntakeOrchestrationCertificationName",
  "IntakeOrchestrationCertificationNamespace",
  "IntakeOrchestrationCertificationStatus",
  "IntakeOrchestrationCertificationReadiness",
  "IntakeOrchestrationCertificationPlatform",
  "getIntakeOrchestrationCertificationSummary",
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
  "ExecutiveIntakePackageIntegrity",
  "IntakeIdentityRegistryIntegrity",
  "ReferenceIntegrity",
  "CanonicalReferenceIntegrity",
  "OwnershipIntegrity",
  "NamespaceIntegrity",
  "PublicExportIntegrity",
  "InventoryIntegrity",
  "MetadataIntegrity",
  "ArchitectureCompleteness",
  "ConsumerReadiness",
] as const);

const EXPECTED_COMPLIANCE_NAMES = Object.freeze([
  "Phase Chain",
  "Canonical References",
  "Executive Intake Package Contract",
  "Registry Ownership",
  "Model Composition",
  "Inventory Publication",
  "Namespace Composition",
  "Public Surface",
  "Immutability",
  "Dependency Direction",
] as const);

describe("NEA-7:7 Intake Orchestration Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA77_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA77_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical certification identity, outcome Pass, and ReadyForFreeze", () => {
    assert.equal(
      IntakeOrchestrationCertificationId,
      "NEA-7:7/IntakeOrchestrationCertification",
    );
    assert.equal(IntakeOrchestrationCertificationVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationCertificationName,
      "Intake Orchestration Certification",
    );
    assert.equal(
      IntakeOrchestrationCertificationNamespace,
      "nexora.nea.intake-orchestration.certification",
    );
    assert.equal(IntakeOrchestrationCertificationStatus, "Certification");
    assert.equal(IntakeOrchestrationCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      IntakeOrchestrationCertificationPlatform.identity.phase,
      "NEA-7:7",
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.identity.platformId,
      IntakeOrchestrationPlatformId,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.certificationOutcome,
      "Pass",
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.nextPhase,
      "NEA-7:8 — Intake Orchestration Freeze",
    );
  });

  it("consumes only NEA-7:6 Platform and preserves the canonical chain", () => {
    const dependency = IntakeOrchestrationCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationPlatform.ts",
    );
    assert.equal(dependency.platformId, IntakeOrchestrationPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(
      IntakeOrchestrationCertificationPlatform.platform,
      IntakeOrchestrationPlatform,
    );

    const ns = IntakeOrchestrationCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
  });

  it("declares exactly seventeen Pass gates with Intake-specific integrity checks", () => {
    const { gates } = IntakeOrchestrationCertificationPlatform;
    assert.equal(gates.gateCount, 17);
    assert.equal(gates.passedGateCount, 17);
    assert.equal(gates.failedGateCount, 0);
    assert.equal(gates.allGatesPass, true);
    assert.deepEqual(
      gates.gates.map((item) => item.gateId),
      [...EXPECTED_GATE_IDS],
    );
    assert.ok(gates.gates.every((item) => item.outcome === "Pass"));
    assert.ok(gates.gates.every((item) => item.executesRuntime === false));

    const foundation = IntakeOrchestrationPlatform.namespace.foundation;
    const registry = IntakeOrchestrationPlatform.namespace.registry;
    assert.equal(
      foundation.contracts.canonicalExecutiveIntakePackageCount,
      1,
    );
    assert.equal(registry.collections.intakeIdentityCount, 8);
    assert.equal(registry.collections.referenceTypeCount, 10);
  });

  it("declares exactly ten Compliant compliance declarations", () => {
    const { compliance } = IntakeOrchestrationCertificationPlatform;
    assert.equal(compliance.complianceCount, 10);
    assert.equal(compliance.allCompliant, true);
    assert.deepEqual(
      compliance.declarations.map((item) => item.complianceName),
      [...EXPECTED_COMPLIANCE_NAMES],
    );
    assert.ok(
      compliance.declarations.every((item) => item.compliant === true),
    );
    assert.ok(
      compliance.declarations.every((item) => item.executesRuntime === false),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Declarations"));
    assert.ok(ownership.owns.includes("Certification Platform"));
    assert.ok(ownership.doesNotOwn.includes("Platform Namespace"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.ok(ownership.doesNotOwn.includes("Contracts"));
    assert.equal(ownership.ownsRuntimeCertification, false);
    assert.equal(ownership.ownsRuntimeOrchestration, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL Invocation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeOrchestration, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.executesValidation, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.reconstructsInventories, false);
  });

  it("preserves ordered certification sections and immutable collections", () => {
    const platform = IntakeOrchestrationCertificationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.gates), true);
    assert.equal(Object.isFrozen(platform.gates.gates), true);
    assert.equal(Object.isFrozen(platform.compliance), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from Platform inventory collections", () => {
    const summaryA = getIntakeOrchestrationCertificationSummary();
    const summaryB = getIntakeOrchestrationCertificationSummary();
    const platform = IntakeOrchestrationPlatform;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, IntakeOrchestrationCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(summaryA.platformId, IntakeOrchestrationPlatformId);
    assert.equal(summaryA.architectureVersion, "NEA-7.0.0");
    assert.equal(summaryA.gateCount, 17);
    assert.equal(summaryA.passedGateCount, 17);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(
      summaryA.composedPhaseCount,
      platform.metadata.composedPhaseCount,
    );
    assert.equal(
      summaryA.inventoryEntryCount,
      platform.metadata.inventoryEntryCount,
    );
    assert.equal(
      summaryA.totalArchitectureCount,
      platform.metadata.totalArchitectureCount,
    );
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.totalArchitectureCount, 323);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.namespaceSectionCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:8 — Intake Orchestration Freeze",
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.runtimeBehavior,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.runtimeCertification,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.executesValidation,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.assemblesRuntimePackage,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.metadata.invokesDKL,
      false,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.runtimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(
      IntakeOrchestrationCertificationPlatform.executesValidation,
      false,
    );
    assert.equal(IntakeOrchestrationCertificationPlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationCertificationPlatform.invokesDkl, false);
  });
});
