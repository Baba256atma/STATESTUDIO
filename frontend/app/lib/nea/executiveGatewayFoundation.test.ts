/**
 * NEA-1:1 — Executive Gateway Foundation Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./executiveGatewayFoundation.ts";
import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationName,
  ExecutiveGatewayFoundationNamespace,
  ExecutiveGatewayFoundationPlatform,
  ExecutiveGatewayFoundationReadiness,
  ExecutiveGatewayFoundationStatus,
  ExecutiveGatewayFoundationVersion,
  getExecutiveGatewayFoundationSummary,
} from "./executiveGatewayFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA11_FILES = Object.freeze([
  "executiveGatewayFoundationTypes.ts",
  "executiveGatewayContracts.ts",
  "executiveGatewaySources.ts",
  "executiveGatewayLifecycle.ts",
  "executiveGatewayCapabilities.ts",
  "executiveGatewayOwnership.ts",
  "executiveGatewayFoundation.ts",
  "executiveGatewayFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayFoundationId",
  "ExecutiveGatewayFoundationVersion",
  "ExecutiveGatewayFoundationName",
  "ExecutiveGatewayFoundationNamespace",
  "ExecutiveGatewayFoundationStatus",
  "ExecutiveGatewayFoundationReadiness",
  "ExecutiveGatewayFoundationPlatform",
  "getExecutiveGatewayFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "sources",
  "channels",
  "modalities",
  "senderKinds",
  "contracts",
  "routingDestinations",
  "policies",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_SOURCE_FAMILIES = Object.freeze([
  "Messaging",
  "Collaboration",
  "Email",
  "Voice",
  "REST",
  "MCP",
  "SDK",
  "EnterpriseSystem",
  "ExternalApplication",
  "HumanOperator",
  "ApprovedAgent",
  "UnknownExternalSource",
] as const);

const EXPECTED_CHANNELS = Object.freeze([
  "Telegram",
  "WhatsApp",
  "MicrosoftTeams",
  "Slack",
  "Email",
  "Voice",
  "RestApi",
  "MCP",
  "SDK",
  "Webhook",
  "EnterpriseConnector",
  "ExternalApplication",
  "CustomApprovedChannel",
] as const);

const EXPECTED_MODALITIES = Object.freeze([
  "Text",
  "StructuredData",
  "Command",
  "Event",
  "File",
  "Document",
  "Audio",
  "TranscribedVoice",
  "ImageReference",
  "FormSubmission",
  "APIRequest",
  "AgentRequest",
  "SystemNotification",
] as const);

const EXPECTED_SENDER_KINDS = Object.freeze([
  "Person",
  "Employee",
  "Manager",
  "Customer",
  "Supplier",
  "Partner",
  "ExternalApplication",
  "EnterpriseSystem",
  "ApprovedAgent",
  "UnknownSender",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Received",
  "Identified",
  "ContextResolved",
  "Authenticated",
  "Authorized",
  "Normalized",
  "Validated",
  "RoutingPrepared",
  "Accepted",
  "Rejected",
  "Failed",
  "Completed",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "ExternalInteractionIntake",
  "SourceIdentification",
  "ChannelClassification",
  "SenderReferenceCapture",
  "TenantContextCapture",
  "WorkspaceContextCapture",
  "AuthenticationContextCapture",
  "AuthorizationContextCapture",
  "TrustContextCapture",
  "ConsentContextCapture",
  "InteractionNormalization",
  "GatewayValidationDeclaration",
  "RoutingPreparation",
  "CorrelationAndTracing",
  "DiagnosticGeneration",
  "GatewayResponseDeclaration",
] as const);

const EXPECTED_ROUTING = Object.freeze([
  "DKL",
  "ExecutiveEngine",
  "KnowledgeServices",
  "IntegrationService",
  "NotificationService",
  "HumanReview",
  "Rejected",
  "Quarantine",
  "Unsupported",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:1 Executive Gateway Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA11_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA11_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, version, namespace, phase, and Foundation status", () => {
    assert.equal(
      ExecutiveGatewayFoundationId,
      "NEA-1:1/ExecutiveGatewayFoundation",
    );
    assert.equal(ExecutiveGatewayFoundationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewayFoundationName,
      "Executive Gateway Foundation",
    );
    assert.equal(
      ExecutiveGatewayFoundationNamespace,
      "nexora.nea.executive-gateway.foundation",
    );
    assert.equal(ExecutiveGatewayFoundationStatus, "Foundation");
    assert.equal(ExecutiveGatewayFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      ExecutiveGatewayFoundationPlatform.identity.phase,
      "NEA-1:1",
    );
    assert.equal(ExecutiveGatewayFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayFoundationPlatform.identity.status,
      "Foundation",
    );
    assert.equal(
      ExecutiveGatewayFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveGatewayFoundationPlatform.nextPhase,
      "NEA-1:2 — Executive Gateway Registry",
    );
  });

  it("declares required source families, channels, modalities, and sender kinds", () => {
    const { sources, channels, modalities, senderKinds } =
      ExecutiveGatewayFoundationPlatform;
    assert.deepEqual(
      sources.map((item) => item.id),
      [...EXPECTED_SOURCE_FAMILIES],
    );
    assert.deepEqual(
      channels.map((item) => item.id),
      [...EXPECTED_CHANNELS],
    );
    assert.deepEqual(
      modalities.map((item) => item.id),
      [...EXPECTED_MODALITIES],
    );
    assert.deepEqual(
      senderKinds.map((item) => item.id),
      [...EXPECTED_SENDER_KINDS],
    );
    assert.ok(sources.every((item) => item.connectorImplemented === false));
    assert.ok(channels.every((item) => item.connectorImplemented === false));
    assert.ok(modalities.every((item) => item.connectorImplemented === false));
  });

  it("exposes request and response envelope contracts with security and context contracts", () => {
    const contractIds = ExecutiveGatewayFoundationPlatform.contracts.map(
      (item) => item.contractId,
    );
    assert.ok(
      contractIds.includes(
        "NEA-1:1/Contract/ExecutiveGatewayRequestEnvelope",
      ),
    );
    assert.ok(
      contractIds.includes(
        "NEA-1:1/Contract/ExecutiveGatewayResponseEnvelope",
      ),
    );
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/SenderIdentityReference"),
    );
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/TenantWorkspaceContext"),
    );
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/AuthenticationContext"),
    );
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/AuthorizationContext"),
    );
    assert.ok(contractIds.includes("NEA-1:1/Contract/TrustContext"));
    assert.ok(contractIds.includes("NEA-1:1/Contract/ConsentContext"));
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/NormalizationResult"),
    );
    assert.ok(contractIds.includes("NEA-1:1/Contract/ValidationResult"));
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/RoutingDestinationDeclaration"),
    );
    assert.ok(
      contractIds.includes("NEA-1:1/Contract/RoutingDecisionResult"),
    );

    const request = ExecutiveGatewayFoundationPlatform.contracts.find(
      (item) =>
        item.contractId ===
        "NEA-1:1/Contract/ExecutiveGatewayRequestEnvelope",
    );
    assert.ok(request);
    assert.ok(request!.fields.includes("requestId"));
    assert.ok(request!.fields.includes("correlationId"));
    assert.ok(request!.fields.includes("tenantContext"));
    assert.ok(request!.fields.includes("workspaceContext"));
    assert.ok(request!.fields.includes("authenticationContext"));
    assert.ok(request!.fields.includes("authorizationContext"));
    assert.ok(request!.fields.includes("trustContext"));
    assert.ok(request!.fields.includes("consentContext"));
  });

  it("declares routing destinations without executing routing", () => {
    const destinations =
      ExecutiveGatewayFoundationPlatform.routingDestinations;
    assert.deepEqual(
      destinations.map((item) => item.id),
      [...EXPECTED_ROUTING],
    );
    assert.ok(destinations.every((item) => item.executesRouting === false));
  });

  it("preserves deterministic lifecycle order", () => {
    const { lifecycle } = ExecutiveGatewayFoundationPlatform;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.equal(lifecycle.stateCount, EXPECTED_LIFECYCLE.length);
    assert.equal(lifecycle.transitions.Received.includes("Identified"), true);
    assert.equal(lifecycle.transitions.Completed.length, 0);
  });

  it("declares unique capabilities without runtime execution", () => {
    const caps =
      ExecutiveGatewayFoundationPlatform.capabilities.capabilities;
    assert.equal(caps.length, 16);
    assert.deepEqual(
      caps.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assertUnique(
      caps.map((item) => item.capabilityId),
      "capability IDs",
    );
    assert.ok(caps.every((item) => item.executesRuntime === false));
    assert.ok(caps.every((item) => item.ownedByNea === true));
  });

  it("declares ownership and forbidden boundaries", () => {
    const { ownership, boundaries } = ExecutiveGatewayFoundationPlatform;
    assert.ok(
      ownership.owns.includes("External interaction intake boundary"),
    );
    assert.ok(ownership.owns.includes("Gateway envelope contracts"));
    assert.ok(ownership.owns.includes("Routing preparation"));
    assert.ok(ownership.doesNotOwn.includes("Business understanding"));
    assert.ok(ownership.doesNotOwn.includes("Executive decisions"));
    assert.ok(
      ownership.doesNotOwn.includes(
        "Internal Assistant conversation architecture",
      ),
    );
    assert.ok(
      ownership.doesNotOwn.includes(
        "Channel-specific connector implementation",
      ),
    );
    assert.equal(ownership.ownsChannelConnectors, false);
    assert.equal(ownership.ownsInternalAssistantArchitecture, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("HTTP server implementation"),
    );
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Telegram bot implementation"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Engine invocation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Assistant invocation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime orchestration"));
    assert.equal(boundaries.runtimeEnforcement, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.invokesEngine, false);
    assert.equal(boundaries.invokesAssistant, false);
    assert.equal(boundaries.implementsHttpServer, false);
    assert.equal(boundaries.runtimeOrchestration, false);
    assert.equal(
      boundaries.assistantSeparation.internalAssistantBypassesNea,
      true,
    );
    assert.equal(
      boundaries.assistantSeparation.neaOwnsExternalGatewayBoundaryOnly,
      true,
    );
    assert.ok(boundaries.prohibitedSurfaceCount >= 30);
  });

  it("preserves canonical references and ordered platform sections", () => {
    const platform = ExecutiveGatewayFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 14), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 14);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.sources), true);
    assert.equal(Object.isFrozen(platform.channels), true);
    assert.equal(Object.isFrozen(platform.modalities), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(platform.dependency.prefersLocalContracts, true);
    assert.equal(platform.dependency.dklInternalImport, false);
    assert.equal(platform.dependency.engineInternalImport, false);
    assert.equal(platform.dependency.assistantInternalImport, false);
    assert.equal(platform.dependency.circularDependency, false);
  });

  it("derives deterministic inventory counts from canonical collections", () => {
    const summaryA = getExecutiveGatewayFoundationSummary();
    const summaryB = getExecutiveGatewayFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ExecutiveGatewayFoundationId);
    assert.equal(summaryA.version, "1.0.0");
    assert.equal(summaryA.namespace, ExecutiveGatewayFoundationNamespace);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(
      summaryA.sourceFamilyCount,
      ExecutiveGatewayFoundationPlatform.sources.length,
    );
    assert.equal(
      summaryA.channelTypeCount,
      ExecutiveGatewayFoundationPlatform.channels.length,
    );
    assert.equal(
      summaryA.modalityCount,
      ExecutiveGatewayFoundationPlatform.modalities.length,
    );
    assert.equal(
      summaryA.senderKindCount,
      ExecutiveGatewayFoundationPlatform.senderKinds.length,
    );
    assert.equal(
      summaryA.contractCount,
      ExecutiveGatewayFoundationPlatform.contracts.length,
    );
    assert.equal(
      summaryA.capabilityCount,
      ExecutiveGatewayFoundationPlatform.capabilities.capabilityCount,
    );
    assert.equal(
      summaryA.lifecycleStateCount,
      ExecutiveGatewayFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      summaryA.routingDestinationCount,
      ExecutiveGatewayFoundationPlatform.routingDestinations.length,
    );
    assert.equal(
      summaryA.ownershipCount,
      ExecutiveGatewayFoundationPlatform.ownership.ownsCount,
    );
    assert.equal(
      summaryA.prohibitedSurfaceCount,
      ExecutiveGatewayFoundationPlatform.boundaries.prohibitedSurfaceCount,
    );
    assert.equal(
      summaryA.policyCount,
      ExecutiveGatewayFoundationPlatform.policies.length,
    );
    assert.equal(summaryA.sectionCount, 14);
    assert.equal(summaryA.deterministic, true);
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:2 — Executive Gateway Registry",
    );
  });

  it("declares ReadyForRegistry only and no runtime integration behavior", () => {
    assert.equal(
      ExecutiveGatewayFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      ExecutiveGatewayFoundationPlatform.downstreamReadiness,
      "ReadyForRegistry",
    );
    assert.notEqual(
      ExecutiveGatewayFoundationPlatform.readiness,
      "ReadyForModel",
    );
    assert.notEqual(
      ExecutiveGatewayFoundationPlatform.readiness,
      "ReadyForProduction",
    );
    assert.notEqual(
      ExecutiveGatewayFoundationPlatform.readiness,
      "RuntimeReady",
    );
    assert.equal(ExecutiveGatewayFoundationPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayFoundationPlatform.runtimeIntegration, false);
    assert.equal(
      ExecutiveGatewayFoundationPlatform.connectorImplementation,
      false,
    );
    assert.equal(ExecutiveGatewayFoundationPlatform.networkingBehavior, false);
    assert.equal(ExecutiveGatewayFoundationPlatform.persistenceBehavior, false);
    assert.equal(ExecutiveGatewayFoundationPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewayFoundationPlatform.dataUnderstanding, false);
    assert.equal(
      ExecutiveGatewayFoundationPlatform.runtimeOrchestration,
      false,
    );
  });
});
