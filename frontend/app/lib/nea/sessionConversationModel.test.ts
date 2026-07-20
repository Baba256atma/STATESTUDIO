/**
 * NEA-3:3 — Session & Conversation Model Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./sessionConversationModel.ts";
import {
  SessionConversationModelId,
  SessionConversationModelName,
  SessionConversationModelNamespace,
  SessionConversationModelPlatform,
  SessionConversationModelReadiness,
  SessionConversationModelStatus,
  SessionConversationModelVersion,
  getSessionConversationModelSummary,
} from "./sessionConversationModel.ts";
import {
  SessionConversationRegistryId,
  SessionConversationRegistryPlatform,
} from "./sessionConversationRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA33_FILES = Object.freeze([
  "sessionConversationModelTypes.ts",
  "sessionConversationModels.ts",
  "sessionConversationRelationships.ts",
  "sessionConversationModelMetadata.ts",
  "sessionConversationModelOwnership.ts",
  "sessionConversationModelLifecycle.ts",
  "sessionConversationModel.ts",
  "sessionConversationModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationModelId",
  "SessionConversationModelVersion",
  "SessionConversationModelName",
  "SessionConversationModelNamespace",
  "SessionConversationModelStatus",
  "SessionConversationModelReadiness",
  "SessionConversationModelPlatform",
  "getSessionConversationModelSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_MODEL_KINDS = Object.freeze([
  "SessionIdentity",
  "ConversationIdentity",
  "Session",
  "Conversation",
  "Participant",
  "MessageReference",
  "ConversationContext",
  "Correlation",
  "Trace",
  "SessionLifecycle",
  "ConversationLifecycle",
  "ConversationState",
  "SessionState",
  "ConversationType",
  "SessionMetadata",
  "ConversationMetadata",
  "ConversationConfiguration",
  "ConversationDiagnostics",
  "ConversationResult",
  "ConversationSummary",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:3 Session & Conversation Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA33_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA33_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(
      SessionConversationModelId,
      "NEA-3:3/SessionConversationModel",
    );
    assert.equal(SessionConversationModelVersion, "1.0.0");
    assert.equal(
      SessionConversationModelName,
      "Session & Conversation Model",
    );
    assert.equal(
      SessionConversationModelNamespace,
      "nexora.nea.session-conversation.model",
    );
    assert.equal(SessionConversationModelStatus, "Model");
    assert.equal(SessionConversationModelReadiness, "ReadyForValidation");
    assert.equal(SessionConversationModelPlatform.identity.phase, "NEA-3:3");
    assert.equal(
      SessionConversationModelPlatform.identity.registryId,
      SessionConversationRegistryId,
    );
    assert.equal(
      SessionConversationModelPlatform.nextPhase,
      "NEA-3:4 — Session & Conversation Validation",
    );
  });

  it("consumes only NEA-3:2 Registry and preserves Registry references", () => {
    const dependency = SessionConversationModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationRegistry.ts",
    );
    assert.equal(dependency.registryId, SessionConversationRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      SessionConversationModelPlatform.registryPlatform,
      SessionConversationRegistryPlatform,
    );

    const anchors =
      SessionConversationModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.sessionIdentityCount,
      SessionConversationRegistryPlatform.collections.sessionIdentityCount,
    );
    assert.equal(
      anchors.conversationIdentityCount,
      SessionConversationRegistryPlatform.collections.conversationIdentityCount,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
  });

  it("declares twenty domain model kinds and identity model instances", () => {
    const { domainModels } = SessionConversationModelPlatform;
    assert.equal(domainModels.modelCount, 20);
    assert.deepEqual(
      domainModels.models.map((item) => item.modelKind),
      [...EXPECTED_MODEL_KINDS],
    );
    assertUnique(
      domainModels.models.map((item) => item.modelKind),
      "model kinds",
    );
    assert.ok(
      domainModels.models.every((item) => item.executesRuntime === false),
    );

    assert.equal(domainModels.sessionIdentityModelCount, 8);
    assert.equal(domainModels.conversationIdentityModelCount, 8);
    assertUnique(
      domainModels.sessionIdentityModels.map((item) => item.sessionId),
      "session identity model ids",
    );
    assertUnique(
      domainModels.conversationIdentityModels.map(
        (item) => item.conversationId,
      ),
      "conversation identity model ids",
    );
    assert.ok(
      domainModels.sessionIdentityModels.every(
        (item) => item.managesRuntimeSession === false,
      ),
    );
    assert.ok(
      domainModels.conversationIdentityModels.every(
        (item) => item.managesRuntimeConversation === false,
      ),
    );
    assert.equal(
      domainModels.sessionIdentityModels[0]?.registryIdentityRef,
      SessionConversationRegistryPlatform.collections.sessionIdentities[0]
        ?.sessionId,
    );
  });

  it("declares twenty model relationships without runtime graph traversal", () => {
    const { relationships } = SessionConversationModelPlatform;
    assert.equal(relationships.relationshipCount, 20);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "Session" &&
          item.targetModelKind === "SessionIdentity",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "Conversation" &&
          item.targetModelKind === "Session",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "MessageReference" &&
          item.targetModelKind === "Correlation",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "ConversationContext" &&
          item.targetModelKind === "ConversationConfiguration",
      ),
    );
    assert.equal(relationships.executesRuntime, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SessionConversationModelPlatform;
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Conversations"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.equal(ownership.ownsRuntimeSessions, false);
    assert.equal(ownership.ownsRegistryCollections, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Storage"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.processesMessages, false);
    assert.equal(boundaries.storesMessages, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationModelPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.domainModels), true);
    assert.equal(Object.isFrozen(platform.domainModels.models), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical model collections", () => {
    const summaryA = getSessionConversationModelSummary();
    const summaryB = getSessionConversationModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, SessionConversationModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, SessionConversationRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.sessionIdentityModelCount, 8);
    assert.equal(summaryA.conversationIdentityModelCount, 8);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:4 — Session & Conversation Validation",
    );
    assert.equal(
      SessionConversationModelPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationModelPlatform.metadata.duplicatesRegistryValues,
      false,
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      SessionConversationModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      SessionConversationModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(SessionConversationModelPlatform.runtimeBehavior, false);
    assert.equal(
      SessionConversationModelPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationModelPlatform.managesRuntimeConversations,
      false,
    );
    assert.equal(SessionConversationModelPlatform.processesMessages, false);
    assert.equal(SessionConversationModelPlatform.storesMessages, false);
    assert.equal(SessionConversationModelPlatform.businessLogic, false);
    assert.equal(SessionConversationModelPlatform.aiReasoning, false);
    assert.equal(
      SessionConversationModelPlatform.lifecycle.currentState,
      "ReadyForValidation",
    );
  });
});
