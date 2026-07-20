/**
 * NEA-6:1 — Message Normalization Foundation Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./messageNormalizationFoundation.ts";
import {
  MessageNormalizationFoundationId,
  MessageNormalizationFoundationName,
  MessageNormalizationFoundationNamespace,
  MessageNormalizationFoundationPlatform,
  MessageNormalizationFoundationReadiness,
  MessageNormalizationFoundationStatus,
  MessageNormalizationFoundationVersion,
  getMessageNormalizationFoundationSummary,
} from "./messageNormalizationFoundation.ts";
import { GatewayRoutingPublicIndexId } from "./gatewayRoutingPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA61_FILES = Object.freeze([
  "messageNormalizationFoundationTypes.ts",
  "messageNormalizationContracts.ts",
  "messageNormalizationCapabilities.ts",
  "messageNormalizationLifecycle.ts",
  "messageNormalizationOwnership.ts",
  "messageNormalizationBoundaries.ts",
  "messageNormalizationFoundation.ts",
  "messageNormalizationFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationFoundationId",
  "MessageNormalizationFoundationVersion",
  "MessageNormalizationFoundationName",
  "MessageNormalizationFoundationNamespace",
  "MessageNormalizationFoundationStatus",
  "MessageNormalizationFoundationReadiness",
  "MessageNormalizationFoundationPlatform",
  "getMessageNormalizationFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "contexts",
  "attachments",
  "results",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ExecutiveMessage",
  "MessageIdentity",
  "Sender",
  "Recipient",
  "ConversationReference",
  "SessionReference",
  "WorkspaceContext",
  "TenantContext",
  "ChannelContext",
  "ConnectorContext",
  "Attachments",
  "Metadata",
  "Correlation",
  "Trace",
  "DeliveryMetadata",
  "NormalizationResult",
  "NormalizationLifecycle",
  "Capabilities",
  "Ownership",
  "Boundaries",
] as const);

const EXPECTED_CONTEXT_DIMENSIONS = Object.freeze([
  "Tenant",
  "Workspace",
  "Channel",
  "Connector",
  "Locale",
  "Organization",
  "Timezone",
] as const);

const EXPECTED_ATTACHMENT_KINDS = Object.freeze([
  "File",
  "Image",
  "Video",
  "Audio",
  "Document",
  "Link",
] as const);

const EXPECTED_RESULTS = Object.freeze([
  "Success",
  "Warning",
  "Failed",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "ChannelMapping",
  "ContextMapping",
  "IdentityMapping",
  "MetadataMapping",
  "AttachmentMapping",
  "CorrelationMapping",
  "TraceMapping",
  "CanonicalMessageDeclaration",
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

describe("NEA-6:1 Message Normalization Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA61_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA61_FILES) {
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
      MessageNormalizationFoundationId,
      "NEA-6:1/MessageNormalizationFoundation",
    );
    assert.equal(MessageNormalizationFoundationVersion, "1.0.0");
    assert.equal(
      MessageNormalizationFoundationName,
      "Message Normalization Foundation",
    );
    assert.equal(
      MessageNormalizationFoundationNamespace,
      "nexora.nea.message-normalization.foundation",
    );
    assert.equal(MessageNormalizationFoundationStatus, "Foundation");
    assert.equal(MessageNormalizationFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      MessageNormalizationFoundationPlatform.identity.phase,
      "NEA-6:1",
    );
    assert.equal(MessageNormalizationFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      MessageNormalizationFoundationPlatform.identity.publicIndexId,
      GatewayRoutingPublicIndexId,
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.nextPhase,
      "NEA-6:2 — Message Normalization Registry",
    );
  });

  it("consumes only NEA-5 Gateway Routing Public Index", () => {
    const dependency = MessageNormalizationFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, GatewayRoutingPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares twenty contracts with exactly one canonical Executive Message", () => {
    const { contracts } = MessageNormalizationFoundationPlatform;
    assert.equal(contracts.contractCount, 20);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractId.split("/").at(-1)),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      contracts.contracts.map((item) => item.contractId),
      "contract ids",
    );
    assert.equal(contracts.canonicalExecutiveMessageCount, 1);
    assert.equal(contracts.canonicalExecutiveMessageContracts.length, 1);
    assert.equal(
      contracts.canonicalExecutiveMessageContracts[0]?.contractId,
      "NEA-6:1/Contract/ExecutiveMessage",
    );
    assert.equal(
      contracts.contracts.filter((item) => item.isCanonicalExecutiveMessage)
        .length,
      1,
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );
    assert.ok(contracts.contracts.every((item) => item.metadataOnly === true));
  });

  it("declares seven contexts, six attachment kinds, and three results", () => {
    const { contexts, attachments, results } =
      MessageNormalizationFoundationPlatform;

    assert.equal(contexts.contextDimensionCount, 7);
    assert.deepEqual(
      contexts.contextDimensions.map((item) => item.dimensionId),
      [...EXPECTED_CONTEXT_DIMENSIONS],
    );
    assert.ok(
      contexts.contextDimensions.every(
        (item) => item.resolvesAtRuntime === false,
      ),
    );
    assert.equal(contexts.resolvesAtRuntime, false);

    assert.equal(attachments.attachmentKindCount, 6);
    assert.deepEqual(
      attachments.attachmentKinds.map((item) => item.attachmentKindId),
      [...EXPECTED_ATTACHMENT_KINDS],
    );
    assert.ok(
      attachments.attachmentKinds.every((item) => item.storesFiles === false),
    );
    assert.equal(attachments.storesFiles, false);

    assert.equal(results.resultCount, 3);
    assert.deepEqual(
      results.results.map((item) => item.resultId),
      [...EXPECTED_RESULTS],
    );
    assert.ok(
      results.results.every((item) => item.processesAtRuntime === false),
    );
    assert.equal(results.processesAtRuntime, false);
  });

  it("declares eight capabilities and six lifecycle states", () => {
    const { capabilities, lifecycle } = MessageNormalizationFoundationPlatform;
    assert.equal(capabilities.capabilityCount, 8);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );

    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.initialState, "Received");
    assert.equal(lifecycle.terminalState, "Published");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.stateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = MessageNormalizationFoundationPlatform;
    assert.ok(ownership.owns.includes("Executive Message Contract"));
    assert.ok(ownership.owns.includes("Context Contracts"));
    assert.ok(ownership.owns.includes("Normalization Lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Message Parsing"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.ok(ownership.doesNotOwn.includes("Advisor"));
    assert.ok(ownership.doesNotOwn.includes("Director"));
    assert.ok(ownership.doesNotOwn.includes("EVE"));
    assert.equal(ownership.ownsRuntimeNormalization, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsExecutiveEngine, false);
    assert.equal(ownership.ownsAi, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Normalization"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Executive Engine invocation"),
    );
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.parsesMessages, false);
    assert.equal(boundaries.interpretsBusinessMeaning, false);
    assert.equal(boundaries.modifiesUserIntent, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 13), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 13);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.contracts.contracts), true);
    assert.equal(Object.isFrozen(platform.contexts), true);
    assert.equal(Object.isFrozen(platform.attachments), true);
    assert.equal(Object.isFrozen(platform.results), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical foundation collections", () => {
    const summaryA = getMessageNormalizationFoundationSummary();
    const summaryB = getMessageNormalizationFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, MessageNormalizationFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, GatewayRoutingPublicIndexId);
    assert.equal(summaryA.contractCount, 20);
    assert.equal(summaryA.canonicalExecutiveMessageCount, 1);
    assert.equal(summaryA.contextDimensionCount, 7);
    assert.equal(summaryA.attachmentKindCount, 6);
    assert.equal(summaryA.resultCount, 3);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 13);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:2 — Message Normalization Registry",
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.metadata.architectureVersion,
      "NEA-6.0.0",
    );
  });

  it("declares ReadyForRegistry only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationFoundationPlatform.readiness.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.readiness
        .claimsRuntimeNormalizationImplemented,
      false,
    );
    assert.equal(MessageNormalizationFoundationPlatform.runtimeBehavior, false);
    assert.equal(
      MessageNormalizationFoundationPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationFoundationPlatform.parsesMessages, false);
    assert.equal(
      MessageNormalizationFoundationPlatform.interpretsBusinessMeaning,
      false,
    );
    assert.equal(
      MessageNormalizationFoundationPlatform.modifiesUserIntent,
      false,
    );
    assert.equal(MessageNormalizationFoundationPlatform.implementsHttp, false);
    assert.equal(MessageNormalizationFoundationPlatform.implementsRest, false);
    assert.equal(MessageNormalizationFoundationPlatform.aiReasoning, false);
    assert.equal(MessageNormalizationFoundationPlatform.invokesDkl, false);
    assert.equal(
      MessageNormalizationFoundationPlatform.invokesExecutiveEngine,
      false,
    );
  });
});
