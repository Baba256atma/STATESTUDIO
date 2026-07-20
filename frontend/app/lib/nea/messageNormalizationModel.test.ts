/**
 * NEA-6:3 — Message Normalization Model Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationRegistryId,
  MessageNormalizationRegistryPlatform,
} from "./messageNormalizationRegistry.ts";
import * as ModelModule from "./messageNormalizationModel.ts";
import {
  MessageNormalizationModelId,
  MessageNormalizationModelName,
  MessageNormalizationModelNamespace,
  MessageNormalizationModelPlatform,
  MessageNormalizationModelReadiness,
  MessageNormalizationModelStatus,
  MessageNormalizationModelVersion,
  getMessageNormalizationModelSummary,
} from "./messageNormalizationModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA63_FILES = Object.freeze([
  "messageNormalizationModelTypes.ts",
  "messageNormalizationModels.ts",
  "messageNormalizationRelationships.ts",
  "messageNormalizationModelMetadata.ts",
  "messageNormalizationModelOwnership.ts",
  "messageNormalizationModelLifecycle.ts",
  "messageNormalizationModel.ts",
  "messageNormalizationModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationModelId",
  "MessageNormalizationModelVersion",
  "MessageNormalizationModelName",
  "MessageNormalizationModelNamespace",
  "MessageNormalizationModelStatus",
  "MessageNormalizationModelReadiness",
  "MessageNormalizationModelPlatform",
  "getMessageNormalizationModelSummary",
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
  "ExecutiveMessage",
  "MessageIdentity",
  "Sender",
  "Recipient",
  "Payload",
  "PayloadType",
  "Metadata",
  "Context",
  "Attachment",
  "Correlation",
  "Trace",
  "DeliveryMetadata",
  "SessionReference",
  "ConversationReference",
  "WorkspaceReference",
  "TenantReference",
  "ChannelReference",
  "ConnectorReference",
  "NormalizationResult",
  "MessageSummary",
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

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "ExecutiveMessage-MessageIdentity",
  "ExecutiveMessage-Sender",
  "ExecutiveMessage-Recipient",
  "ExecutiveMessage-Payload",
  "ExecutiveMessage-Metadata",
  "ExecutiveMessage-Context",
  "ExecutiveMessage-Attachment",
  "ExecutiveMessage-Correlation",
  "Correlation-Trace",
  "ExecutiveMessage-DeliveryMetadata",
  "ExecutiveMessage-SessionReference",
  "ExecutiveMessage-ConversationReference",
  "Context-WorkspaceReference",
  "Context-TenantReference",
  "Context-ChannelReference",
  "Context-ConnectorReference",
  "Payload-PayloadType",
  "ExecutiveMessage-NormalizationResult",
  "MessageSummary-ExecutiveMessage",
  "MessageSummary-NormalizationResult",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Composed",
  "Verified",
  "Published",
  "Referenced",
  "Retired",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:3 Message Normalization Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA63_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA63_FILES) {
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
      MessageNormalizationModelId,
      "NEA-6:3/MessageNormalizationModel",
    );
    assert.equal(MessageNormalizationModelVersion, "1.0.0");
    assert.equal(
      MessageNormalizationModelName,
      "Message Normalization Model",
    );
    assert.equal(
      MessageNormalizationModelNamespace,
      "nexora.nea.message-normalization.model",
    );
    assert.equal(MessageNormalizationModelStatus, "Model");
    assert.equal(MessageNormalizationModelReadiness, "ReadyForValidation");
    assert.equal(MessageNormalizationModelPlatform.identity.phase, "NEA-6:3");
    assert.equal(
      MessageNormalizationModelPlatform.identity.registryId,
      MessageNormalizationRegistryId,
    );
    assert.equal(
      MessageNormalizationModelPlatform.nextPhase,
      "NEA-6:4 — Message Normalization Validation",
    );
  });

  it("consumes only NEA-6:2 Registry and preserves Registry references", () => {
    const dependency = MessageNormalizationModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationRegistry.ts",
    );
    assert.equal(dependency.registryId, MessageNormalizationRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      MessageNormalizationModelPlatform.registryPlatform,
      MessageNormalizationRegistryPlatform,
    );

    const anchors =
      MessageNormalizationModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.messageIdentityCount,
      MessageNormalizationRegistryPlatform.collections.messageIdentityCount,
    );
    assert.equal(
      anchors.payloadCount,
      MessageNormalizationRegistryPlatform.collections.payloadCount,
    );
    assert.equal(
      anchors.contractCount,
      MessageNormalizationRegistryPlatform.collections.contractCount,
    );
    assert.equal(
      anchors.capabilityCount,
      MessageNormalizationRegistryPlatform.capabilities.capabilityCount,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
  });

  it("declares exactly twenty domain model kinds", () => {
    const { domainModels } = MessageNormalizationModelPlatform;
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
    assert.ok(domainModels.models.every((item) => item.metadataOnly === true));
  });

  it("declares exactly eight message identity model instances from Registry", () => {
    const { domainModels } = MessageNormalizationModelPlatform;
    assert.equal(domainModels.messageIdentityModelCount, 8);
    assert.equal(
      domainModels.messageIdentityModelCount,
      MessageNormalizationRegistryPlatform.collections.messageIdentityCount,
    );
    assert.deepEqual(
      domainModels.messageIdentityModels.map((item) => item.category),
      [...EXPECTED_MESSAGE_IDENTITIES],
    );
    assertUnique(
      domainModels.messageIdentityModels.map((item) => item.messageId),
      "message identity model ids",
    );
    assert.ok(
      domainModels.messageIdentityModels.every(
        (item) => item.normalizesAtRuntime === false,
      ),
    );
    assert.ok(
      domainModels.messageIdentityModels.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      domainModels.messageIdentityModels.every(
        (item) => item.registryIdentityRef === item.messageId,
      ),
    );
    assert.ok(
      domainModels.messageIdentityModels.every((item) => item.version === "1.0.0"),
    );
  });

  it("declares exactly twenty declarative relationships", () => {
    const { relationships } = MessageNormalizationModelPlatform;
    assert.equal(relationships.relationshipCount, 20);
    assert.deepEqual(
      relationships.relationships.map(
        (item) => item.relationshipId.split("/").at(-1),
      ),
      [...EXPECTED_RELATIONSHIPS],
    );
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.equal(
      relationships.relationships[0]?.sourceModelKind,
      "ExecutiveMessage",
    );
    assert.equal(
      relationships.relationships[0]?.targetModelKind,
      "MessageIdentity",
    );
    assert.equal(relationships.relationships[8]?.sourceModelKind, "Correlation");
    assert.equal(relationships.relationships[8]?.targetModelKind, "Trace");
    assert.equal(
      relationships.relationships[16]?.sourceModelKind,
      "Payload",
    );
    assert.equal(
      relationships.relationships[16]?.targetModelKind,
      "PayloadType",
    );
    assert.equal(relationships.executesRuntime, false);
  });

  it("declares model lifecycle, ownership, and forbidden boundaries", () => {
    const { lifecycle, ownership, boundaries } =
      MessageNormalizationModelPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.currentState, "Published");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);

    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Model Lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsRuntimeNormalization, false);
    assert.equal(ownership.ownsAi, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Normalization"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("Payload Parsing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.parsesPayloads, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationModelPlatform;
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
    const summaryA = getMessageNormalizationModelSummary();
    const summaryB = getMessageNormalizationModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, MessageNormalizationModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, MessageNormalizationRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.messageIdentityModelCount, 8);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:4 — Message Normalization Validation",
    );
    assert.equal(
      MessageNormalizationModelPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      MessageNormalizationModelPlatform.metadata.duplicatesRegistryValues,
      false,
    );
    assert.equal(
      MessageNormalizationModelPlatform.metadata.modelVersion,
      "1.0.0",
    );
    assert.equal(
      MessageNormalizationModelPlatform.metadata.registryVersion,
      "1.0.0",
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      MessageNormalizationModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      MessageNormalizationModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      MessageNormalizationModelPlatform.readiness
        .claimsRuntimeNormalizationImplemented,
      false,
    );
    assert.equal(MessageNormalizationModelPlatform.runtimeBehavior, false);
    assert.equal(
      MessageNormalizationModelPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationModelPlatform.parsesPayloads, false);
    assert.equal(MessageNormalizationModelPlatform.processesMessages, false);
    assert.equal(
      MessageNormalizationModelPlatform.interpretsBusinessMeaning,
      false,
    );
    assert.equal(MessageNormalizationModelPlatform.implementsHttp, false);
    assert.equal(MessageNormalizationModelPlatform.aiReasoning, false);
    assert.equal(MessageNormalizationModelPlatform.invokesDkl, false);
    assert.equal(
      MessageNormalizationModelPlatform.invokesExecutiveEngine,
      false,
    );
  });
});
