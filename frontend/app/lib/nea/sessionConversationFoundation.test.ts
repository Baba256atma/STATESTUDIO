/**
 * NEA-3:1 — Session & Conversation Foundation Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ChannelConnectorPublicIndexId } from "./channelConnectorPublicIndex.ts";
import * as FoundationModule from "./sessionConversationFoundation.ts";
import {
  SessionConversationFoundationId,
  SessionConversationFoundationName,
  SessionConversationFoundationNamespace,
  SessionConversationFoundationPlatform,
  SessionConversationFoundationReadiness,
  SessionConversationFoundationStatus,
  SessionConversationFoundationVersion,
  getSessionConversationFoundationSummary,
} from "./sessionConversationFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA31_FILES = Object.freeze([
  "sessionConversationFoundationTypes.ts",
  "sessionConversationContracts.ts",
  "sessionConversationCapabilities.ts",
  "sessionConversationLifecycle.ts",
  "sessionConversationOwnership.ts",
  "sessionConversationBoundaries.ts",
  "sessionConversationFoundation.ts",
  "sessionConversationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationFoundationId",
  "SessionConversationFoundationVersion",
  "SessionConversationFoundationName",
  "SessionConversationFoundationNamespace",
  "SessionConversationFoundationStatus",
  "SessionConversationFoundationReadiness",
  "SessionConversationFoundationPlatform",
  "getSessionConversationFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "participants",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "SessionIdentity",
  "SessionReference",
  "SessionMetadata",
  "SessionState",
  "ConversationIdentity",
  "ConversationReference",
  "ConversationMetadata",
  "ConversationContext",
  "Participant",
  "MessageReference",
  "CorrelationTraceContext",
  "SessionConversationLifecycle",
  "SessionConversationOwnership",
  "SessionConversationBoundaries",
] as const);

const EXPECTED_PARTICIPANTS = Object.freeze([
  "HumanUser",
  "Executive",
  "ExternalUser",
  "ApprovedAgent",
  "InternalService",
  "Connector",
  "System",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "SessionTracking",
  "ConversationTracking",
  "ParticipantRegistration",
  "ContextDeclaration",
  "CorrelationDeclaration",
  "ConversationContinuity",
  "MetadataManagement",
  "SummaryDeclaration",
] as const);

const EXPECTED_SESSION_LIFECYCLE = Object.freeze([
  "Created",
  "Active",
  "Suspended",
  "Closed",
] as const);

const EXPECTED_CONVERSATION_LIFECYCLE = Object.freeze([
  "Started",
  "Active",
  "Waiting",
  "Completed",
  "Archived",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:1 Session & Conversation Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA31_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA31_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical foundation identity, status Foundation, and ReadyForRegistry", () => {
    assert.equal(
      SessionConversationFoundationId,
      "NEA-3:1/SessionConversationFoundation",
    );
    assert.equal(SessionConversationFoundationVersion, "1.0.0");
    assert.equal(
      SessionConversationFoundationName,
      "Session & Conversation Foundation",
    );
    assert.equal(
      SessionConversationFoundationNamespace,
      "nexora.nea.session-conversation.foundation",
    );
    assert.equal(SessionConversationFoundationStatus, "Foundation");
    assert.equal(SessionConversationFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      SessionConversationFoundationPlatform.identity.phase,
      "NEA-3:1",
    );
    assert.equal(SessionConversationFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      SessionConversationFoundationPlatform.identity.publicIndexId,
      ChannelConnectorPublicIndexId,
    );
    assert.equal(
      SessionConversationFoundationPlatform.nextPhase,
      "NEA-3:2 — Session & Conversation Registry",
    );
  });

  it("consumes only NEA-2 Channel Connectors Public Index", () => {
    const dependency = SessionConversationFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, ChannelConnectorPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares fourteen contracts and seven participant roles", () => {
    const { contracts, participants } = SessionConversationFoundationPlatform;
    assert.equal(contracts.contractCount, 14);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractId.split("/").at(-1)),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      contracts.contracts.map((item) => item.contractId),
      "contract ids",
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );
    assert.ok(contracts.contracts.every((item) => item.metadataOnly === true));

    assert.equal(contracts.participantRoleCount, 7);
    assert.deepEqual(
      participants.map((item) => item.participantRoleId),
      [...EXPECTED_PARTICIPANTS],
    );
    assert.ok(
      participants.every((item) => item.managesRuntimeParticipant === false),
    );
    assert.equal(contracts.contextDimensionCount, 7);
    assert.equal(contracts.messageReferenceFieldCount, 6);
  });

  it("declares eight capabilities without runtime execution", () => {
    const { capabilities } = SessionConversationFoundationPlatform;
    assert.equal(capabilities.capabilityCount, 8);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );
    assert.equal(capabilities.executesRuntime, false);
  });

  it("declares session and conversation lifecycle without runtime state machine", () => {
    const { lifecycle } = SessionConversationFoundationPlatform;
    assert.deepEqual([...lifecycle.session.states], [...EXPECTED_SESSION_LIFECYCLE]);
    assert.deepEqual(
      [...lifecycle.conversation.states],
      [...EXPECTED_CONVERSATION_LIFECYCLE],
    );
    assert.equal(lifecycle.sessionLifecycleStateCount, 4);
    assert.equal(lifecycle.conversationLifecycleStateCount, 5);
    assert.equal(lifecycle.session.initialState, "Created");
    assert.equal(lifecycle.session.terminalState, "Closed");
    assert.equal(lifecycle.conversation.initialState, "Started");
    assert.equal(lifecycle.conversation.terminalState, "Archived");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SessionConversationFoundationPlatform;
    assert.ok(ownership.owns.includes("Session Contracts"));
    assert.ok(ownership.owns.includes("Conversation Contracts"));
    assert.ok(ownership.owns.includes("Conversation Context"));
    assert.ok(ownership.owns.includes("Lifecycle Definitions"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Conversations"));
    assert.ok(ownership.doesNotOwn.includes("Message Transport"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsRuntimeSessions, false);
    assert.equal(ownership.ownsPersistence, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("AI"));
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.processesMessages, false);
    assert.equal(boundaries.invokesDkl, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 11), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 11);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.contracts.contracts), true);
    assert.equal(Object.isFrozen(platform.participants), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical foundation collections", () => {
    const summaryA = getSessionConversationFoundationSummary();
    const summaryB = getSessionConversationFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, SessionConversationFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, ChannelConnectorPublicIndexId);
    assert.equal(summaryA.contractCount, 14);
    assert.equal(summaryA.participantRoleCount, 7);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.sessionLifecycleStateCount, 4);
    assert.equal(summaryA.conversationLifecycleStateCount, 5);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:2 — Session & Conversation Registry",
    );
    assert.equal(
      SessionConversationFoundationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationFoundationPlatform.metadata.architectureVersion,
      "NEA-3.0.0",
    );
  });

  it("declares ReadyForRegistry only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationFoundationPlatform.readiness.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      SessionConversationFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      SessionConversationFoundationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      SessionConversationFoundationPlatform.readiness.claimsSessionsManaged,
      false,
    );
    assert.equal(SessionConversationFoundationPlatform.runtimeBehavior, false);
    assert.equal(
      SessionConversationFoundationPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationFoundationPlatform.processesMessages,
      false,
    );
    assert.equal(
      SessionConversationFoundationPlatform.authenticationExecution,
      false,
    );
    assert.equal(SessionConversationFoundationPlatform.aiReasoning, false);
  });
});
