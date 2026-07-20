/**
 * NEA-3:2 — Session & Conversation Registry Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SessionConversationFoundationId,
  SessionConversationFoundationPlatform,
} from "./sessionConversationFoundation.ts";
import * as RegistryModule from "./sessionConversationRegistry.ts";
import {
  SessionConversationRegistryId,
  SessionConversationRegistryName,
  SessionConversationRegistryNamespace,
  SessionConversationRegistryPlatform,
  SessionConversationRegistryReadiness,
  SessionConversationRegistryStatus,
  SessionConversationRegistryVersion,
  getSessionConversationRegistrySummary,
} from "./sessionConversationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA32_FILES = Object.freeze([
  "sessionConversationRegistryTypes.ts",
  "sessionConversationRegistryCollections.ts",
  "sessionConversationRegistryPolicies.ts",
  "sessionConversationRegistryCapabilities.ts",
  "sessionConversationRegistryOwnership.ts",
  "sessionConversationRegistryMetadata.ts",
  "sessionConversationRegistry.ts",
  "sessionConversationRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationRegistryId",
  "SessionConversationRegistryVersion",
  "SessionConversationRegistryName",
  "SessionConversationRegistryNamespace",
  "SessionConversationRegistryStatus",
  "SessionConversationRegistryReadiness",
  "SessionConversationRegistryPlatform",
  "getSessionConversationRegistrySummary",
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

const EXPECTED_CONVERSATION_TYPES = Object.freeze([
  "ExecutiveConversation",
  "AdvisoryConversation",
  "OperationalConversation",
  "SupportConversation",
  "NotificationConversation",
  "SystemConversation",
  "ExternalConversation",
  "InternalConversation",
] as const);

const EXPECTED_MESSAGE_REFS = Object.freeze([
  "Root",
  "Parent",
  "Reply",
  "Forward",
  "Reference",
  "System",
] as const);

const EXPECTED_CORRELATION = Object.freeze([
  "CorrelationId",
  "TraceId",
  "ConversationGroup",
  "SessionGroup",
] as const);

const EXPECTED_TRACE = Object.freeze([
  "RootTrace",
  "ChildTrace",
  "SessionTrace",
  "ConversationTrace",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Declared",
  "Registered",
  "Certified",
  "Frozen",
  "Deprecated",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:2 Session & Conversation Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA32_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA32_FILES) {
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
      SessionConversationRegistryId,
      "NEA-3:2/SessionConversationRegistry",
    );
    assert.equal(SessionConversationRegistryVersion, "1.0.0");
    assert.equal(
      SessionConversationRegistryName,
      "Session & Conversation Registry",
    );
    assert.equal(
      SessionConversationRegistryNamespace,
      "nexora.nea.session-conversation.registry",
    );
    assert.equal(SessionConversationRegistryStatus, "Registry");
    assert.equal(SessionConversationRegistryReadiness, "ReadyForModel");
    assert.equal(
      SessionConversationRegistryPlatform.identity.phase,
      "NEA-3:2",
    );
    assert.equal(
      SessionConversationRegistryPlatform.identity.foundationId,
      SessionConversationFoundationId,
    );
    assert.equal(
      SessionConversationRegistryPlatform.nextPhase,
      "NEA-3:3 — Session & Conversation Model",
    );
  });

  it("consumes only NEA-3:1 Foundation and preserves Foundation references", () => {
    const dependency = SessionConversationRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationFoundation.ts",
    );
    assert.equal(dependency.foundationId, SessionConversationFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      SessionConversationRegistryPlatform.foundationPlatform,
      SessionConversationFoundationPlatform,
    );

    const { collections, capabilities } = SessionConversationRegistryPlatform;
    assert.equal(
      collections.participantRoleCount,
      SessionConversationFoundationPlatform.participants.length,
    );
    assert.equal(
      collections.sessionStateCount,
      SessionConversationFoundationPlatform.lifecycle.session.stateCount,
    );
    assert.equal(
      collections.conversationStateCount,
      SessionConversationFoundationPlatform.lifecycle.conversation.stateCount,
    );
    assert.equal(
      collections.contextDimensionCount,
      SessionConversationFoundationPlatform.contracts.contextDimensionCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      SessionConversationFoundationPlatform.capabilities.capabilityCount,
    );
    assert.ok(
      collections.participants.every(
        (item) => item.sourcePhase === "NEA-3:1" && item.foundationReference,
      ),
    );
    assert.equal(collections.duplicatesFoundationValues, false);
  });

  it("declares unique session and conversation identity registries", () => {
    const { collections } = SessionConversationRegistryPlatform;
    assert.equal(collections.sessionIdentityCount, 8);
    assert.equal(collections.conversationIdentityCount, 8);
    assertUnique(
      collections.sessionIdentities.map((item) => item.sessionId),
      "session ids",
    );
    assertUnique(
      collections.conversationIdentities.map((item) => item.conversationId),
      "conversation ids",
    );
    assert.ok(
      collections.sessionIdentities.every(
        (item) => item.managesRuntimeSession === false,
      ),
    );
    assert.ok(
      collections.conversationIdentities.every(
        (item) => item.managesRuntimeConversation === false,
      ),
    );
    assert.ok(
      collections.sessionIdentities.every(
        (item) => item.sessionStatus === "Registered",
      ),
    );
    assert.deepEqual(
      collections.conversationTypes.map((item) => item.id),
      [...EXPECTED_CONVERSATION_TYPES],
    );
  });

  it("declares registry-owned vocabularies and Foundation-referenced states", () => {
    const { collections } = SessionConversationRegistryPlatform;
    assert.deepEqual(
      [...collections.sessionStates.map((item) => item.id)],
      ["Created", "Active", "Suspended", "Closed"],
    );
    assert.deepEqual(
      [...collections.conversationStates.map((item) => item.id)],
      ["Started", "Active", "Waiting", "Completed", "Archived"],
    );
    assert.deepEqual(
      collections.messageReferenceTypes.map((item) => item.id),
      [...EXPECTED_MESSAGE_REFS],
    );
    assert.deepEqual(
      collections.correlationTypes.map((item) => item.id),
      [...EXPECTED_CORRELATION],
    );
    assert.deepEqual(
      collections.traceTypes.map((item) => item.id),
      [...EXPECTED_TRACE],
    );
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.equal(collections.lifecycleEntryCount, 9);
  });

  it("declares policies and ownership without runtime behavior", () => {
    const { policies, ownership, boundaries } =
      SessionConversationRegistryPlatform;
    assert.equal(policies.policyCount, 9);
    assert.equal(policies.executesPolicies, false);
    assert.ok(ownership.owns.includes("Registry Definitions"));
    assert.ok(ownership.owns.includes("Identity Registries"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.equal(ownership.ownsDomainModels, false);
    assert.equal(ownership.ownsRuntimeSessions, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.processesMessages, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.sessionIdentities), true);
    assert.equal(
      Object.isFrozen(platform.collections.conversationIdentities),
      true,
    );
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical registry collections", () => {
    const summaryA = getSessionConversationRegistrySummary();
    const summaryB = getSessionConversationRegistrySummary();
    const meta = SessionConversationRegistryPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, SessionConversationRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, SessionConversationFoundationId);
    assert.equal(summaryA.sessionIdentityCount, 8);
    assert.equal(summaryA.conversationIdentityCount, 8);
    assert.equal(summaryA.participantRoleCount, 7);
    assert.equal(summaryA.conversationTypeCount, 8);
    assert.equal(summaryA.sessionStateCount, 4);
    assert.equal(summaryA.conversationStateCount, 5);
    assert.equal(summaryA.contextDimensionCount, 7);
    assert.equal(summaryA.messageReferenceTypeCount, 6);
    assert.equal(summaryA.correlationTypeCount, 4);
    assert.equal(summaryA.traceTypeCount, 4);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.lifecycleEntryCount, 9);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.policyCount, 9);
    assert.equal(summaryA.totalRegistryEntryCount, meta.totalEntryCount);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:3 — Session & Conversation Model",
    );
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesFoundationValues, false);
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      SessionConversationRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      SessionConversationRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(SessionConversationRegistryPlatform.runtimeBehavior, false);
    assert.equal(
      SessionConversationRegistryPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationRegistryPlatform.managesRuntimeConversations,
      false,
    );
    assert.equal(SessionConversationRegistryPlatform.processesMessages, false);
    assert.equal(SessionConversationRegistryPlatform.aiReasoning, false);
  });
});
