/**
 * NEA-6:2 — Message Normalization Registry Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationFoundationId,
  MessageNormalizationFoundationPlatform,
} from "./messageNormalizationFoundation.ts";
import * as RegistryModule from "./messageNormalizationRegistry.ts";
import {
  MessageNormalizationRegistryId,
  MessageNormalizationRegistryName,
  MessageNormalizationRegistryNamespace,
  MessageNormalizationRegistryPlatform,
  MessageNormalizationRegistryReadiness,
  MessageNormalizationRegistryStatus,
  MessageNormalizationRegistryVersion,
  getMessageNormalizationRegistrySummary,
} from "./messageNormalizationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA62_FILES = Object.freeze([
  "messageNormalizationRegistryTypes.ts",
  "messageNormalizationRegistryCollections.ts",
  "messageNormalizationRegistryPolicies.ts",
  "messageNormalizationRegistryCapabilities.ts",
  "messageNormalizationRegistryOwnership.ts",
  "messageNormalizationRegistryMetadata.ts",
  "messageNormalizationRegistry.ts",
  "messageNormalizationRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationRegistryId",
  "MessageNormalizationRegistryVersion",
  "MessageNormalizationRegistryName",
  "MessageNormalizationRegistryNamespace",
  "MessageNormalizationRegistryStatus",
  "MessageNormalizationRegistryReadiness",
  "MessageNormalizationRegistryPlatform",
  "getMessageNormalizationRegistrySummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_MESSAGE_IDENTITIES = Object.freeze([
  "TextMessage",
  "StructuredMessage",
  "FileMessage",
  "AudioMessage",
  "ImageMessage",
  "VideoMessage",
  "EventMessage",
  "SystemMessage",
] as const);

const EXPECTED_PAYLOADS = Object.freeze([
  "PlainText",
  "Markdown",
  "JSON",
  "XML",
  "BinaryReference",
  "FormData",
  "StructuredObject",
  "UnknownPayload",
] as const);

const EXPECTED_METADATA_FIELDS = Object.freeze([
  "Source",
  "OriginalChannel",
  "OriginalConnector",
  "ReceivedTimestamp",
  "DeliveryTimestamp",
  "Locale",
  "Encoding",
  "ContentType",
  "Priority",
  "MessageSize",
] as const);

const EXPECTED_MAPPINGS = Object.freeze([
  "ChannelToCanonicalChannel",
  "ConnectorToConnectorIdentity",
  "AttachmentToAttachmentReference",
  "PayloadToPayloadType",
  "MetadataToMetadataModel",
] as const);

const EXPECTED_NORMALIZATION_POLICIES = Object.freeze([
  "PreserveOriginalMeaning",
  "PreserveOriginalMetadata",
  "PreserveOrdering",
  "PreserveCorrelation",
  "PreserveAttachments",
  "PreserveTrace",
  "CanonicalStructureOnly",
  "NoBusinessInterpretation",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Declared",
  "Registered",
  "Certified",
  "Frozen",
  "Deprecated",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Received",
  "Identified",
  "Mapped",
  "Normalized",
  "Verified",
  "Published",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:2 Message Normalization Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA62_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA62_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical registry identity, status Registry, and ReadyForModel", () => {
    assert.equal(
      MessageNormalizationRegistryId,
      "NEA-6:2/MessageNormalizationRegistry",
    );
    assert.equal(MessageNormalizationRegistryVersion, "1.0.0");
    assert.equal(
      MessageNormalizationRegistryName,
      "Message Normalization Registry",
    );
    assert.equal(
      MessageNormalizationRegistryNamespace,
      "nexora.nea.message-normalization.registry",
    );
    assert.equal(MessageNormalizationRegistryStatus, "Registry");
    assert.equal(MessageNormalizationRegistryReadiness, "ReadyForModel");
    assert.equal(MessageNormalizationRegistryPlatform.identity.phase, "NEA-6:2");
    assert.equal(
      MessageNormalizationRegistryPlatform.identity.foundationId,
      MessageNormalizationFoundationId,
    );
    assert.equal(
      MessageNormalizationRegistryPlatform.nextPhase,
      "NEA-6:3 — Message Normalization Model",
    );
  });

  it("consumes only NEA-6:1 Foundation and preserves Foundation references", () => {
    const dependency = MessageNormalizationRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationFoundation.ts",
    );
    assert.equal(dependency.foundationId, MessageNormalizationFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      MessageNormalizationRegistryPlatform.foundationPlatform,
      MessageNormalizationFoundationPlatform,
    );

    const { collections, capabilities } = MessageNormalizationRegistryPlatform;
    assert.equal(
      collections.contractCount,
      MessageNormalizationFoundationPlatform.contracts.contractCount,
    );
    assert.equal(
      collections.contextCount,
      MessageNormalizationFoundationPlatform.contexts.contextDimensionCount,
    );
    assert.equal(
      collections.attachmentKindCount,
      MessageNormalizationFoundationPlatform.attachments.attachmentKindCount,
    );
    assert.equal(
      collections.lifecycleEntryCount,
      MessageNormalizationFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      collections.ownershipEntryCount,
      MessageNormalizationFoundationPlatform.ownership.ownsCount,
    );
    assert.equal(
      collections.boundaryEntryCount,
      MessageNormalizationFoundationPlatform.boundaries.prohibitedSurfaceCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      MessageNormalizationFoundationPlatform.capabilities.capabilityCount,
    );
    assert.ok(
      collections.contracts.every(
        (item) => item.sourcePhase === "NEA-6:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.contexts.every(
        (item) => item.sourcePhase === "NEA-6:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.attachmentKinds.every(
        (item) => item.sourcePhase === "NEA-6:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.lifecycleEntries.every(
        (item) => item.sourcePhase === "NEA-6:1" && item.foundationReference,
      ),
    );
    assert.ok(
      capabilities.capabilities.every(
        (item) => item.sourcePhase === "NEA-6:1" && item.foundationReference,
      ),
    );
    assert.equal(collections.duplicatesFoundationValues, false);
  });

  it("declares unique message identity registry", () => {
    const { collections } = MessageNormalizationRegistryPlatform;
    assert.equal(collections.messageIdentityCount, 8);
    assert.deepEqual(
      collections.messageIdentities.map((item) => item.category),
      [...EXPECTED_MESSAGE_IDENTITIES],
    );
    assertUnique(
      collections.messageIdentities.map((item) => item.messageId),
      "message ids",
    );
    assert.ok(
      collections.messageIdentities.every(
        (item) => item.normalizesAtRuntime === false,
      ),
    );
    assert.ok(
      collections.messageIdentities.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      collections.messageIdentities.every((item) => item.version === "1.0.0"),
    );
    assert.ok(collections.messageIdentities.every((item) => item.status));
    assert.ok(collections.messageIdentities.every((item) => item.category));
  });

  it("declares registry-owned vocabularies and Foundation-referenced lifecycle", () => {
    const { collections } = MessageNormalizationRegistryPlatform;
    assert.deepEqual(
      collections.payloads.map((item) => item.id),
      [...EXPECTED_PAYLOADS],
    );
    assert.deepEqual(
      collections.metadataFields.map((item) => item.id),
      [...EXPECTED_METADATA_FIELDS],
    );
    assert.deepEqual(
      collections.mappings.map((item) => item.mappingKey),
      [...EXPECTED_MAPPINGS],
    );
    assert.ok(
      collections.mappings.every((item) => item.mapsAtRuntime === false),
    );
    assert.deepEqual(
      collections.normalizationPolicies.map((item) => item.id),
      [...EXPECTED_NORMALIZATION_POLICIES],
    );
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.deepEqual(
      collections.lifecycleEntries.map((item) => item.id),
      [...EXPECTED_LIFECYCLE],
    );
    assert.ok(
      collections.payloads.every(
        (item) => item.sourcePhase === "NEA-6:2" && item.foundationReference === null,
      ),
    );
    assert.ok(
      collections.statuses.every(
        (item) => item.sourcePhase === "NEA-6:2" && item.foundationReference === null,
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries, policies } =
      MessageNormalizationRegistryPlatform;
    assert.ok(ownership.owns.includes("Message Identity Registry"));
    assert.ok(ownership.owns.includes("Payload Registry"));
    assert.ok(ownership.owns.includes("Mapping Registry"));
    assert.ok(ownership.doesNotOwn.includes("Executive Message Contract"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsRuntimeNormalization, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsAi, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Normalization"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.parsesPayloads, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
    assert.equal(boundaries.runtimeEnforcement, false);

    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.messageIdentities), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical registry collections", () => {
    const summaryA = getMessageNormalizationRegistrySummary();
    const summaryB = getMessageNormalizationRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, MessageNormalizationRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, MessageNormalizationFoundationId);
    assert.equal(summaryA.messageIdentityCount, 8);
    assert.equal(summaryA.payloadCount, 8);
    assert.equal(summaryA.metadataFieldCount, 10);
    assert.equal(summaryA.mappingCount, 5);
    assert.equal(summaryA.normalizationPolicyCount, 8);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.contractCount, 20);
    assert.equal(summaryA.contextCount, 7);
    assert.equal(summaryA.attachmentKindCount, 6);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.lifecycleEntryCount, 6);
    assert.equal(summaryA.registryPolicyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:3 — Message Normalization Model",
    );
    assert.equal(
      MessageNormalizationRegistryPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      summaryA.totalRegistryEntryCount,
      MessageNormalizationRegistryPlatform.metadata.totalEntryCount,
    );
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      MessageNormalizationRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      MessageNormalizationRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      MessageNormalizationRegistryPlatform.readiness
        .claimsRuntimeNormalizationImplemented,
      false,
    );
    assert.equal(MessageNormalizationRegistryPlatform.runtimeBehavior, false);
    assert.equal(
      MessageNormalizationRegistryPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationRegistryPlatform.parsesPayloads, false);
    assert.equal(
      MessageNormalizationRegistryPlatform.interpretsBusinessMeaning,
      false,
    );
    assert.equal(MessageNormalizationRegistryPlatform.implementsHttp, false);
    assert.equal(MessageNormalizationRegistryPlatform.aiReasoning, false);
    assert.equal(MessageNormalizationRegistryPlatform.invokesDkl, false);
    assert.equal(
      MessageNormalizationRegistryPlatform.invokesExecutiveEngine,
      false,
    );
  });
});
