/**
 * NEA-1:7 — Executive Gateway Certification Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayPlatform,
  ExecutiveGatewayPlatformId,
} from "./executiveGatewayPlatform.ts";
import * as CertificationModule from "./executiveGatewayCertification.ts";
import {
  ExecutiveGatewayCertificationId,
  ExecutiveGatewayCertificationName,
  ExecutiveGatewayCertificationNamespace,
  ExecutiveGatewayCertificationPlatform,
  ExecutiveGatewayCertificationReadiness,
  ExecutiveGatewayCertificationStatus,
  ExecutiveGatewayCertificationVersion,
  getExecutiveGatewayCertificationSummary,
} from "./executiveGatewayCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA17_FILES = Object.freeze([
  "executiveGatewayCertificationTypes.ts",
  "executiveGatewayCertificationGates.ts",
  "executiveGatewayCertificationMetadata.ts",
  "executiveGatewayCertificationCompliance.ts",
  "executiveGatewayCertificationOwnership.ts",
  "executiveGatewayCertificationSummary.ts",
  "executiveGatewayCertification.ts",
  "executiveGatewayCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayCertificationId",
  "ExecutiveGatewayCertificationVersion",
  "ExecutiveGatewayCertificationName",
  "ExecutiveGatewayCertificationNamespace",
  "ExecutiveGatewayCertificationStatus",
  "ExecutiveGatewayCertificationReadiness",
  "ExecutiveGatewayCertificationPlatform",
  "getExecutiveGatewayCertificationSummary",
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

const EXPECTED_GATES = Object.freeze([
  "FoundationIntegrity",
  "RegistryIntegrity",
  "ModelIntegrity",
  "ValidationIntegrity",
  "ManifestIntegrity",
  "PlatformIntegrity",
  "CanonicalReferenceIntegrity",
  "OwnershipIntegrity",
  "NamespaceIntegrity",
  "PublicExportIntegrity",
  "InventoryIntegrity",
  "MetadataIntegrity",
  "ReadinessIntegrity",
  "ImmutabilityIntegrity",
  "ArchitectureCompleteness",
  "ConsumerReadiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:7 Executive Gateway Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA17_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA17_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(CertificationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(CertificationModule).length, 8);
  });

  it("has canonical certification identity, status Certification, and ReadyForFreeze", () => {
    assert.equal(
      ExecutiveGatewayCertificationId,
      "NEA-1:7/ExecutiveGatewayCertification",
    );
    assert.equal(ExecutiveGatewayCertificationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewayCertificationName,
      "Executive Gateway Certification",
    );
    assert.equal(
      ExecutiveGatewayCertificationNamespace,
      "nexora.nea.executive-gateway.certification",
    );
    assert.equal(ExecutiveGatewayCertificationStatus, "Certification");
    assert.equal(ExecutiveGatewayCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      ExecutiveGatewayCertificationPlatform.identity.phase,
      "NEA-1:7",
    );
    assert.equal(ExecutiveGatewayCertificationPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayCertificationPlatform.identity.platformId,
      ExecutiveGatewayPlatformId,
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.nextPhase,
      "NEA-1:8 — Executive Gateway Freeze",
    );
  });

  it("consumes only NEA-1:6 Platform and preserves canonical chain", () => {
    const dependency = ExecutiveGatewayCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayPlatform.ts",
    );
    assert.equal(dependency.platformId, ExecutiveGatewayPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ExecutiveGatewayCertificationPlatform.platform,
      ExecutiveGatewayPlatform,
    );
  });

  it("declares sixteen certification gates with all Pass outcomes", () => {
    const gates = ExecutiveGatewayCertificationPlatform.gates;
    assert.equal(gates.gateCount, 16);
    assert.deepEqual(
      gates.gates.map((item) => item.gateId),
      [...EXPECTED_GATES],
    );
    assertUnique(
      gates.gates.map((item) => item.gateId),
      "gate ids",
    );
    assert.ok(gates.gates.every((item) => item.executesRuntime === false));
    assert.ok(gates.gates.every((item) => item.outcome === "Pass"));
    assert.equal(gates.passedGateCount, 16);
    assert.equal(gates.failedGateCount, 0);
    assert.equal(gates.allGatesPass, true);
  });

  it("declares complete compliance without runtime execution", () => {
    const compliance = ExecutiveGatewayCertificationPlatform.compliance;
    assert.equal(compliance.complianceCount, 8);
    assertUnique(
      compliance.declarations.map((item) => item.complianceId),
      "compliance ids",
    );
    assert.ok(compliance.declarations.every((item) => item.compliant === true));
    assert.equal(compliance.allCompliant, true);
    assert.equal(compliance.executesRuntime, false);
    assert.ok(
      compliance.declarations.some(
        (item) => item.complianceName === "Phase Chain",
      ),
    );
    assert.ok(
      compliance.declarations.some(
        (item) => item.complianceName === "Dependency Direction",
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } =
      ExecutiveGatewayCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Metadata"));
    assert.ok(ownership.owns.includes("Certification Status"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformComposition, false);
    assert.equal(ownership.ownsRuntimeProcessing, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayCertificationPlatform;
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

  it("derives deterministic summary with Pass certification outcome", () => {
    const summaryA = getExecutiveGatewayCertificationSummary();
    const summaryB = getExecutiveGatewayCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, ExecutiveGatewayCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, ExecutiveGatewayPlatformId);
    assert.equal(summaryA.gateCount, 16);
    assert.equal(summaryA.passedGateCount, 16);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:8 — Executive Gateway Freeze",
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ExecutiveGatewayCertificationPlatform.runtimeBehavior, false);
    assert.equal(
      ExecutiveGatewayCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.authenticationExecution,
      false,
    );
    assert.equal(
      ExecutiveGatewayCertificationPlatform.authorizationExecution,
      false,
    );
    assert.equal(ExecutiveGatewayCertificationPlatform.routingExecution, false);
    assert.equal(ExecutiveGatewayCertificationPlatform.aiReasoning, false);
  });
});
