/**
 * NEA-5:7 — Gateway Routing Certification Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
} from "./gatewayRoutingPlatform.ts";
import * as CertificationModule from "./gatewayRoutingCertification.ts";
import {
  GatewayRoutingCertificationId,
  GatewayRoutingCertificationName,
  GatewayRoutingCertificationNamespace,
  GatewayRoutingCertificationPlatform,
  GatewayRoutingCertificationReadiness,
  GatewayRoutingCertificationStatus,
  GatewayRoutingCertificationVersion,
  getGatewayRoutingCertificationSummary,
} from "./gatewayRoutingCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA57_FILES = Object.freeze([
  "gatewayRoutingCertificationTypes.ts",
  "gatewayRoutingCertificationGates.ts",
  "gatewayRoutingCertificationMetadata.ts",
  "gatewayRoutingCertificationCompliance.ts",
  "gatewayRoutingCertificationOwnership.ts",
  "gatewayRoutingCertificationSummary.ts",
  "gatewayRoutingCertification.ts",
  "gatewayRoutingCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingCertificationId",
  "GatewayRoutingCertificationVersion",
  "GatewayRoutingCertificationName",
  "GatewayRoutingCertificationNamespace",
  "GatewayRoutingCertificationStatus",
  "GatewayRoutingCertificationReadiness",
  "GatewayRoutingCertificationPlatform",
  "getGatewayRoutingCertificationSummary",
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
  "RouteIdentityIntegrity",
  "RouteDefinitionIntegrity",
  "CanonicalReferenceIntegrity",
  "OwnershipIntegrity",
  "NamespaceIntegrity",
  "PublicExportIntegrity",
  "InventoryIntegrity",
  "MetadataIntegrity",
  "ImmutabilityIntegrity",
  "ArchitectureCompleteness",
  "ConsumerReadiness",
] as const);

const EXPECTED_COMPLIANCE = Object.freeze([
  "Phase Chain",
  "Canonical References",
  "Route Identity",
  "Route Definition",
  "Ownership",
  "Inventories",
  "Namespace Composition",
  "Public Surface",
  "Immutability",
  "Dependency Direction",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:7 Gateway Routing Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA57_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA57_FILES) {
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
      GatewayRoutingCertificationId,
      "NEA-5:7/GatewayRoutingCertification",
    );
    assert.equal(GatewayRoutingCertificationVersion, "1.0.0");
    assert.equal(
      GatewayRoutingCertificationName,
      "Gateway Routing Certification",
    );
    assert.equal(
      GatewayRoutingCertificationNamespace,
      "nexora.nea.gateway-routing.certification",
    );
    assert.equal(GatewayRoutingCertificationStatus, "Certification");
    assert.equal(GatewayRoutingCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      GatewayRoutingCertificationPlatform.identity.phase,
      "NEA-5:7",
    );
    assert.equal(GatewayRoutingCertificationPlatform.identity.layer, "NEA");
    assert.equal(
      GatewayRoutingCertificationPlatform.identity.platformId,
      GatewayRoutingPlatformId,
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.nextPhase,
      "NEA-5:8 — Gateway Routing Freeze",
    );
  });

  it("consumes only NEA-5:6 Platform and preserves canonical chain", () => {
    const dependency = GatewayRoutingCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingPlatform.ts",
    );
    assert.equal(dependency.platformId, GatewayRoutingPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      GatewayRoutingCertificationPlatform.platform,
      GatewayRoutingPlatform,
    );

    const ns = GatewayRoutingCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, GatewayRoutingPlatform.namespace.manifest);
  });

  it("declares seventeen certification gates with all Pass outcomes", () => {
    const gates = GatewayRoutingCertificationPlatform.gates;
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

    const routeIdentityGate = gates.gates.find(
      (item) => item.gateId === "RouteIdentityIntegrity",
    );
    const routeDefinitionGate = gates.gates.find(
      (item) => item.gateId === "RouteDefinitionIntegrity",
    );
    assert.ok(routeIdentityGate);
    assert.ok(routeDefinitionGate);
    assert.equal(routeIdentityGate.outcome, "Pass");
    assert.equal(routeDefinitionGate.outcome, "Pass");
    assert.equal(
      GatewayRoutingPlatform.namespace.registry.collections.routeIdentityCount,
      10,
    );
    assert.ok(
      GatewayRoutingPlatform.namespace.model.domainModels.models.some(
        (item) => item.modelKind === "RouteDefinition",
      ),
    );
  });

  it("declares complete compliance without runtime execution", () => {
    const compliance = GatewayRoutingCertificationPlatform.compliance;
    assert.equal(compliance.complianceCount, 10);
    assertUnique(
      compliance.declarations.map((item) => item.complianceId),
      "compliance ids",
    );
    assert.deepEqual(
      compliance.declarations.map((item) => item.complianceName),
      [...EXPECTED_COMPLIANCE],
    );
    assert.ok(compliance.declarations.every((item) => item.compliant === true));
    assert.equal(compliance.allCompliant, true);
    assert.equal(compliance.executesRuntime, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Declarations"));
    assert.ok(ownership.owns.includes("Certification Metadata"));
    assert.ok(ownership.owns.includes("Certification Summary"));
    assert.ok(ownership.owns.includes("Certification Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Routing Algorithms"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformComposition, false);
    assert.equal(ownership.ownsRuntimeRouting, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Routing Algorithms"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingCertificationPlatform;
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
    const summaryA = getGatewayRoutingCertificationSummary();
    const summaryB = getGatewayRoutingCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, GatewayRoutingCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, GatewayRoutingPlatformId);
    assert.equal(summaryA.gateCount, 17);
    assert.equal(summaryA.passedGateCount, 17);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:8 — Gateway Routing Freeze",
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
    assert.equal(
      GatewayRoutingPlatform.metadata.inventoryEntryCount,
      20,
    );
    assert.equal(
      GatewayRoutingPlatform.metadata.totalArchitectureCount,
      308,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(GatewayRoutingCertificationPlatform.runtimeBehavior, false);
    assert.equal(
      GatewayRoutingCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(GatewayRoutingCertificationPlatform.runtimeValidation, false);
    assert.equal(
      GatewayRoutingCertificationPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingCertificationPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(GatewayRoutingCertificationPlatform.aiReasoning, false);
  });
});
