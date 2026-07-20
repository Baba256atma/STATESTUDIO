/**
 * NEA-3:7 — Session & Conversation Certification Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Certification.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SessionConversationPlatform,
  SessionConversationPlatformId,
} from "./sessionConversationPlatform.ts";
import * as CertificationModule from "./sessionConversationCertification.ts";
import {
  SessionConversationCertificationId,
  SessionConversationCertificationName,
  SessionConversationCertificationNamespace,
  SessionConversationCertificationPlatform,
  SessionConversationCertificationReadiness,
  SessionConversationCertificationStatus,
  SessionConversationCertificationVersion,
  getSessionConversationCertificationSummary,
} from "./sessionConversationCertification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA37_FILES = Object.freeze([
  "sessionConversationCertificationTypes.ts",
  "sessionConversationCertificationGates.ts",
  "sessionConversationCertificationMetadata.ts",
  "sessionConversationCertificationCompliance.ts",
  "sessionConversationCertificationOwnership.ts",
  "sessionConversationCertificationSummary.ts",
  "sessionConversationCertification.ts",
  "sessionConversationCertification.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationCertificationId",
  "SessionConversationCertificationVersion",
  "SessionConversationCertificationName",
  "SessionConversationCertificationNamespace",
  "SessionConversationCertificationStatus",
  "SessionConversationCertificationReadiness",
  "SessionConversationCertificationPlatform",
  "getSessionConversationCertificationSummary",
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
  "SessionIdentityIntegrity",
  "ConversationIdentityIntegrity",
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

describe("NEA-3:7 Session & Conversation Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    assert.equal(NEA37_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA37_FILES) {
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
      SessionConversationCertificationId,
      "NEA-3:7/SessionConversationCertification",
    );
    assert.equal(SessionConversationCertificationVersion, "1.0.0");
    assert.equal(
      SessionConversationCertificationName,
      "Session & Conversation Certification",
    );
    assert.equal(
      SessionConversationCertificationNamespace,
      "nexora.nea.session-conversation.certification",
    );
    assert.equal(SessionConversationCertificationStatus, "Certification");
    assert.equal(SessionConversationCertificationReadiness, "ReadyForFreeze");
    assert.equal(
      SessionConversationCertificationPlatform.identity.phase,
      "NEA-3:7",
    );
    assert.equal(
      SessionConversationCertificationPlatform.identity.layer,
      "NEA",
    );
    assert.equal(
      SessionConversationCertificationPlatform.identity.platformId,
      SessionConversationPlatformId,
    );
    assert.equal(
      SessionConversationCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      SessionConversationCertificationPlatform.nextPhase,
      "NEA-3:8 — Session & Conversation Freeze",
    );
  });

  it("consumes only NEA-3:6 Platform and preserves canonical chain", () => {
    const dependency = SessionConversationCertificationPlatform.dependency;
    assert.equal(dependency.platformOnly, true);
    assert.equal(dependency.platformPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationPlatform.ts",
    );
    assert.equal(dependency.platformId, SessionConversationPlatformId);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesPlatformArchitecture, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SessionConversationCertificationPlatform.platform,
      SessionConversationPlatform,
    );

    const ns = SessionConversationCertificationPlatform.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
    assert.equal(ns.manifest, SessionConversationPlatform.namespace.manifest);
  });

  it("declares seventeen certification gates with all Pass outcomes", () => {
    const gates = SessionConversationCertificationPlatform.gates;
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

    const sessionGate = gates.gates.find(
      (item) => item.gateId === "SessionIdentityIntegrity",
    );
    const conversationGate = gates.gates.find(
      (item) => item.gateId === "ConversationIdentityIntegrity",
    );
    assert.ok(sessionGate);
    assert.ok(conversationGate);
    assert.equal(sessionGate.outcome, "Pass");
    assert.equal(conversationGate.outcome, "Pass");
    assert.equal(
      SessionConversationPlatform.namespace.registry.collections
        .sessionIdentityCount,
      8,
    );
    assert.equal(
      SessionConversationPlatform.namespace.registry.collections
        .conversationIdentityCount,
      8,
    );
  });

  it("declares complete compliance without runtime execution", () => {
    const compliance = SessionConversationCertificationPlatform.compliance;
    assert.equal(compliance.complianceCount, 10);
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
        (item) => item.complianceName === "Session Identity Registry",
      ),
    );
    assert.ok(
      compliance.declarations.some(
        (item) => item.complianceName === "Conversation Identity Registry",
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
      SessionConversationCertificationPlatform;
    assert.ok(ownership.owns.includes("Certification Gates"));
    assert.ok(ownership.owns.includes("Compliance Metadata"));
    assert.ok(ownership.owns.includes("Certification Status"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway Routing"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsPlatformComposition, false);
    assert.equal(ownership.ownsRuntimeSessions, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime certification"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesPlatformArchitecture, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationCertificationPlatform;
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
    const summaryA = getSessionConversationCertificationSummary();
    const summaryB = getSessionConversationCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(
      summaryA.certificationId,
      SessionConversationCertificationId,
    );
    assert.equal(summaryA.status, "Certification");
    assert.equal(summaryA.readiness, "ReadyForFreeze");
    assert.equal(summaryA.platformId, SessionConversationPlatformId);
    assert.equal(summaryA.gateCount, 17);
    assert.equal(summaryA.passedGateCount, 17);
    assert.equal(summaryA.failedGateCount, 0);
    assert.equal(summaryA.complianceCount, 10);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:8 — Session & Conversation Freeze",
    );
    assert.equal(
      SessionConversationCertificationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.metadata
        .duplicatesPlatformArchitecture,
      false,
    );
    assert.equal(
      SessionConversationPlatform.metadata.inventoryEntryCount,
      21,
    );
    assert.equal(
      SessionConversationPlatform.metadata.totalArchitectureCount,
      293,
    );
  });

  it("declares ReadyForFreeze only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationCertificationPlatform.readiness.readiness,
      "ReadyForFreeze",
    );
    assert.equal(
      SessionConversationCertificationPlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(
      SessionConversationCertificationPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.runtimeCertification,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationCertificationPlatform.processesMessages,
      false,
    );
    assert.equal(SessionConversationCertificationPlatform.aiReasoning, false);
  });
});
