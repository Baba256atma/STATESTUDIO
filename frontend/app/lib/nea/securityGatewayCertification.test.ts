/**
 * NEA-4:7 — Security Gateway Certification Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SecurityGatewayPlatform,
  SecurityGatewayPlatformId,
} from "./securityGatewayPlatform.ts";
import * as CertificationModule from "./securityGatewayCertification.ts";
import {
  SecurityGatewayCertificationId,
  SecurityGatewayCertificationName,
  SecurityGatewayCertificationNamespace,
  SecurityGatewayCertificationPlatform,
  SecurityGatewayCertificationReadiness,
  SecurityGatewayCertificationStatus,
  SecurityGatewayCertificationVersion,
  getSecurityGatewayCertificationSummary,
} from "./securityGatewayCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA47_FILES = Object.freeze([
  "securityGatewayCertificationTypes.ts",
  "securityGatewayCertificationGates.ts",
  "securityGatewayCertificationMetadata.ts",
  "securityGatewayCertificationCompliance.ts",
  "securityGatewayCertificationOwnership.ts",
  "securityGatewayCertificationSummary.ts",
  "securityGatewayCertification.ts",
  "securityGatewayCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayCertificationId",
  "SecurityGatewayCertificationVersion",
  "SecurityGatewayCertificationName",
  "SecurityGatewayCertificationNamespace",
  "SecurityGatewayCertificationStatus",
  "SecurityGatewayCertificationReadiness",
  "SecurityGatewayCertificationPlatform",
  "getSecurityGatewayCertificationSummary",
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
  "SecurityIdentityIntegrity",
  "SecurityPolicyIntegrity",
  "PermissionIntegrity",
  "CanonicalReferenceIntegrity",
  "OwnershipIntegrity",
  "NamespaceIntegrity",
  "PublicExportIntegrity",
  "InventoryIntegrity",
  "MetadataIntegrity",
  "ArchitectureCompleteness",
  "ConsumerReadiness",
] as const);

const EXPECTED_COMPLIANCE = Object.freeze([
  "Phase Chain",
  "Canonical References",
  "Security Identity Registry",
  "Security Policy Registry",
  "Permission Registry",
  "Ownership",
  "Inventories",
  "Namespace Composition",
  "Public Surface",
  "Dependency Direction",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:7 Security Gateway Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA47_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA47_FILES) {
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
      SecurityGatewayCertificationId,
      "NEA-4:7/SecurityGatewayCertification",
    );
    assert.equal(SecurityGatewayCertificationVersion, "1.0.0");
    assert.equal(
      SecurityGatewayCertificationName,
      "Security Gateway Certification",
    );
    assert.equal(
      SecurityGatewayCertificationNamespace,
      "nexora.nea.security-gateway.certification",
    );
    assert.equal(SecurityGatewayCertificationStatus, "Certification");
    assert.equal(SecurityGatewayCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      SecurityGatewayCertificationPlatform.identity.phase,
      "NEA-4:7",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.identity.platformId,
      SecurityGatewayPlatformId,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.nextPhase,
      "NEA-4:8 — Security Gateway Freeze",
    );
  });

  it("consumes only NEA-4:6 Platform and preserves canonical chain", () => {
    const dependency = SecurityGatewayCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayPlatform.ts",
    );
    assert.equal(dependency.platformId, SecurityGatewayPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SecurityGatewayCertificationPlatform.platform,
      SecurityGatewayPlatform,
    );

    const ns = SecurityGatewayCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, SecurityGatewayPlatform.namespace.manifest);
  });

  it("declares seventeen certification gates with all Pass outcomes", () => {
    const gates = SecurityGatewayCertificationPlatform.gates;
    assert.equal(gates.gateCount, 17);
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
    assert.equal(gates.passedGateCount, 17);
    assert.equal(gates.failedGateCount, 0);
    assert.equal(gates.allGatesPass, true);

    assert.equal(
      SecurityGatewayPlatform.namespace.registry.collections
        .securityIdentityCount,
      8,
    );
    assert.equal(
      SecurityGatewayPlatform.namespace.registry.collections
        .securityPolicyCount,
      6,
    );
    assert.equal(
      SecurityGatewayPlatform.namespace.registry.collections.permissionCount,
      8,
    );
  });

  it("declares ten compliance declarations without runtime execution", () => {
    const compliance = SecurityGatewayCertificationPlatform.compliance;
    assert.equal(compliance.complianceCount, 10);
    assert.deepEqual(
      compliance.declarations.map((item) => item.complianceName),
      [...EXPECTED_COMPLIANCE],
    );
    assertUnique(
      compliance.declarations.map((item) => item.complianceId),
      "compliance ids",
    );
    assert.ok(compliance.declarations.every((item) => item.compliant === true));
    assert.equal(compliance.allCompliant, true);
    assert.equal(compliance.executesRuntime, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SecurityGatewayCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Metadata"));
    assert.ok(ownership.owns.includes("Certification Status"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Authentication"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformComposition, false);
    assert.equal(ownership.ownsRuntimeSecurity, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.implementsEncryption, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayCertificationPlatform;
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
    const summaryA = getSecurityGatewayCertificationSummary();
    const summaryB = getSecurityGatewayCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, SecurityGatewayCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, SecurityGatewayPlatformId);
    assert.equal(summaryA.gateCount, 17);
    assert.equal(summaryA.passedGateCount, 17);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-4:8 — Security Gateway Freeze",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.metadata.architectureVersion,
      "NEA-4.0.0",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.metadata.inventoryEntryCount,
      SecurityGatewayPlatform.metadata.inventoryEntryCount,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.metadata.totalArchitectureCount,
      SecurityGatewayPlatform.metadata.totalArchitectureCount,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(SecurityGatewayCertificationPlatform.runtimeBehavior, false);
    assert.equal(
      SecurityGatewayCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.executesAuthentication,
      false,
    );
    assert.equal(
      SecurityGatewayCertificationPlatform.implementsEncryption,
      false,
    );
    assert.equal(SecurityGatewayCertificationPlatform.runtimeSecurity, false);
    assert.equal(SecurityGatewayCertificationPlatform.aiReasoning, false);
  });
});
