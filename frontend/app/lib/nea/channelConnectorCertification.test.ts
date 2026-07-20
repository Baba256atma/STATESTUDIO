/**
 * NEA-2:7 — Channel Connectors Certification Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ChannelConnectorPlatform,
  ChannelConnectorPlatformId,
} from "./channelConnectorPlatform.ts";
import * as CertificationModule from "./channelConnectorCertification.ts";
import {
  ChannelConnectorCertificationId,
  ChannelConnectorCertificationName,
  ChannelConnectorCertificationNamespace,
  ChannelConnectorCertificationPlatform,
  ChannelConnectorCertificationReadiness,
  ChannelConnectorCertificationStatus,
  ChannelConnectorCertificationVersion,
  getChannelConnectorCertificationSummary,
} from "./channelConnectorCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA27_FILES = Object.freeze([
  "channelConnectorCertificationTypes.ts",
  "channelConnectorCertificationGates.ts",
  "channelConnectorCertificationMetadata.ts",
  "channelConnectorCertificationCompliance.ts",
  "channelConnectorCertificationOwnership.ts",
  "channelConnectorCertificationSummary.ts",
  "channelConnectorCertification.ts",
  "channelConnectorCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorCertificationId",
  "ChannelConnectorCertificationVersion",
  "ChannelConnectorCertificationName",
  "ChannelConnectorCertificationNamespace",
  "ChannelConnectorCertificationStatus",
  "ChannelConnectorCertificationReadiness",
  "ChannelConnectorCertificationPlatform",
  "getChannelConnectorCertificationSummary",
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
  "ConnectorIdentityIntegrity",
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

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:7 Channel Connectors Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA27_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA27_FILES) {
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
      ChannelConnectorCertificationId,
      "NEA-2:7/ChannelConnectorCertification",
    );
    assert.equal(ChannelConnectorCertificationVersion, "1.0.0");
    assert.equal(
      ChannelConnectorCertificationName,
      "Channel Connectors Certification",
    );
    assert.equal(
      ChannelConnectorCertificationNamespace,
      "nexora.nea.channel-connectors.certification",
    );
    assert.equal(ChannelConnectorCertificationStatus, "Certification");
    assert.equal(ChannelConnectorCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      ChannelConnectorCertificationPlatform.identity.phase,
      "NEA-2:7",
    );
    assert.equal(ChannelConnectorCertificationPlatform.identity.layer, "NEA");
    assert.equal(
      ChannelConnectorCertificationPlatform.identity.platformId,
      ChannelConnectorPlatformId,
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.nextPhase,
      "NEA-2:8 — Channel Connectors Freeze",
    );
  });

  it("consumes only NEA-2:6 Platform and preserves canonical chain", () => {
    const dependency = ChannelConnectorCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorPlatform.ts",
    );
    assert.equal(dependency.platformId, ChannelConnectorPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ChannelConnectorCertificationPlatform.platform,
      ChannelConnectorPlatform,
    );

    const ns = ChannelConnectorCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, ChannelConnectorPlatform.namespace.manifest);
  });

  it("declares sixteen certification gates with all Pass outcomes", () => {
    const gates = ChannelConnectorCertificationPlatform.gates;
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

    const identityGate = gates.gates.find(
      (item) => item.gateId === "ConnectorIdentityIntegrity",
    );
    assert.ok(identityGate);
    assert.equal(identityGate.outcome, "Pass");
    assert.equal(
      ChannelConnectorPlatform.namespace.registry.collections.identityCount,
      12,
    );
  });

  it("declares complete compliance without runtime execution", () => {
    const compliance = ChannelConnectorCertificationPlatform.compliance;
    assert.equal(compliance.complianceCount, 9);
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
        (item) => item.complianceName === "Connector Identity Registry",
      ),
    );
    assert.ok(
      compliance.declarations.some(
        (item) => item.complianceName === "Dependency Direction",
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ChannelConnectorCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Metadata"));
    assert.ok(ownership.owns.includes("Certification Status"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformComposition, false);
    assert.equal(ownership.ownsRuntimeConnectors, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP Requests"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorCertificationPlatform;
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
    const summaryA = getChannelConnectorCertificationSummary();
    const summaryB = getChannelConnectorCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, ChannelConnectorCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, ChannelConnectorPlatformId);
    assert.equal(summaryA.gateCount, 16);
    assert.equal(summaryA.passedGateCount, 16);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 9);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:8 — Channel Connectors Freeze",
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      ChannelConnectorCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ChannelConnectorCertificationPlatform.runtimeBehavior, false);
    assert.equal(
      ChannelConnectorCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      ChannelConnectorCertificationPlatform.implementsConnectors,
      false,
    );
    assert.equal(ChannelConnectorCertificationPlatform.oauthFlow, false);
    assert.equal(ChannelConnectorCertificationPlatform.aiReasoning, false);
  });
});
