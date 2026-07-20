/**
 * NEA-6:7 — Message Normalization Certification Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationPlatform,
  MessageNormalizationPlatformId,
} from "./messageNormalizationPlatform.ts";
import * as CertificationModule from "./messageNormalizationCertification.ts";
import {
  MessageNormalizationCertificationId,
  MessageNormalizationCertificationName,
  MessageNormalizationCertificationNamespace,
  MessageNormalizationCertificationPlatform,
  MessageNormalizationCertificationReadiness,
  MessageNormalizationCertificationStatus,
  MessageNormalizationCertificationVersion,
  getMessageNormalizationCertificationSummary,
} from "./messageNormalizationCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA67_FILES = Object.freeze([
  "messageNormalizationCertificationTypes.ts",
  "messageNormalizationCertificationGates.ts",
  "messageNormalizationCertificationMetadata.ts",
  "messageNormalizationCertificationCompliance.ts",
  "messageNormalizationCertificationOwnership.ts",
  "messageNormalizationCertificationSummary.ts",
  "messageNormalizationCertification.ts",
  "messageNormalizationCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationCertificationId",
  "MessageNormalizationCertificationVersion",
  "MessageNormalizationCertificationName",
  "MessageNormalizationCertificationNamespace",
  "MessageNormalizationCertificationStatus",
  "MessageNormalizationCertificationReadiness",
  "MessageNormalizationCertificationPlatform",
  "getMessageNormalizationCertificationSummary",
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
  "ExecutiveMessageIntegrity",
  "MessageIdentityRegistryIntegrity",
  "PayloadRegistryIntegrity",
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
  "Executive Message Contract",
  "Registry Ownership",
  "Model Composition",
  "Inventory Publication",
  "Namespace Composition",
  "Public Surface",
  "Immutability",
  "Dependency Direction",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:7 Message Normalization Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA67_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA67_FILES) {
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
      MessageNormalizationCertificationId,
      "NEA-6:7/MessageNormalizationCertification",
    );
    assert.equal(MessageNormalizationCertificationVersion, "1.0.0");
    assert.equal(
      MessageNormalizationCertificationName,
      "Message Normalization Certification",
    );
    assert.equal(
      MessageNormalizationCertificationNamespace,
      "nexora.nea.message-normalization.certification",
    );
    assert.equal(MessageNormalizationCertificationStatus, "Certification");
    assert.equal(
      MessageNormalizationCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.identity.phase,
      "NEA-6:7",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.identity.layer,
      "NEA",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.identity.platformId,
      MessageNormalizationPlatformId,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.nextPhase,
      "NEA-6:8 — Message Normalization Freeze",
    );
  });

  it("consumes only NEA-6:6 Platform and preserves canonical chain", () => {
    const dependency = MessageNormalizationCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationPlatform.ts",
    );
    assert.equal(dependency.platformId, MessageNormalizationPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      MessageNormalizationCertificationPlatform.platform,
      MessageNormalizationPlatform,
    );

    const ns = MessageNormalizationCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, MessageNormalizationPlatform.namespace.manifest);
  });

  it("declares seventeen certification gates with all Pass outcomes", () => {
    const gates = MessageNormalizationCertificationPlatform.gates;
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

    const executiveMessageGate = gates.gates.find(
      (item) => item.gateId === "ExecutiveMessageIntegrity",
    );
    const messageIdentityGate = gates.gates.find(
      (item) => item.gateId === "MessageIdentityRegistryIntegrity",
    );
    const payloadGate = gates.gates.find(
      (item) => item.gateId === "PayloadRegistryIntegrity",
    );
    assert.ok(executiveMessageGate);
    assert.ok(messageIdentityGate);
    assert.ok(payloadGate);
    assert.equal(executiveMessageGate.outcome, "Pass");
    assert.equal(messageIdentityGate.outcome, "Pass");
    assert.equal(payloadGate.outcome, "Pass");
    assert.equal(
      MessageNormalizationPlatform.namespace.foundation.contracts
        .canonicalExecutiveMessageCount,
      1,
    );
    assert.equal(
      MessageNormalizationPlatform.namespace.registry.collections
        .messageIdentityCount,
      8,
    );
    assert.equal(
      MessageNormalizationPlatform.namespace.registry.collections.payloadCount,
      8,
    );
  });

  it("declares complete compliance without runtime execution", () => {
    const compliance = MessageNormalizationCertificationPlatform.compliance;
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
    const { ownership, boundaries } = MessageNormalizationCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Declarations"));
    assert.ok(ownership.owns.includes("Certification Metadata"));
    assert.ok(ownership.owns.includes("Certification Summary"));
    assert.ok(ownership.owns.includes("Certification Readiness"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Namespace"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Certification"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformNamespace, false);
    assert.equal(ownership.ownsRuntimeNormalization, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Normalization"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Parsing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeNormalization, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.implementsMessageParsing, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
    assert.equal(boundaries.reconstructsInventories, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationCertificationPlatform;
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
    const summaryA = getMessageNormalizationCertificationSummary();
    const summaryB = getMessageNormalizationCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.certificationId, MessageNormalizationCertificationId);
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, MessageNormalizationPlatformId);
    assert.equal(summaryA.gateCount, 17);
    assert.equal(summaryA.passedGateCount, 17);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:8 — Message Normalization Freeze",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
    assert.equal(
      MessageNormalizationPlatform.metadata.inventoryEntryCount,
      20,
    );
    assert.equal(
      MessageNormalizationPlatform.metadata.totalArchitectureCount,
      312,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.metadata.gateSummary
        .allGatesPass,
      true,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.metadata.complianceSummary
        .allCompliant,
      true,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.runtimeNormalization,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      MessageNormalizationCertificationPlatform.implementsMessageParsing,
      false,
    );
    assert.equal(MessageNormalizationCertificationPlatform.aiReasoning, false);
  });
});
