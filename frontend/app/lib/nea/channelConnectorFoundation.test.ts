/**
 * NEA-2:1 — Channel Connectors Foundation Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./channelConnectorFoundation.ts";
import {
  ChannelConnectorFoundationId,
  ChannelConnectorFoundationName,
  ChannelConnectorFoundationNamespace,
  ChannelConnectorFoundationPlatform,
  ChannelConnectorFoundationReadiness,
  ChannelConnectorFoundationStatus,
  ChannelConnectorFoundationVersion,
  getChannelConnectorFoundationSummary,
} from "./channelConnectorFoundation.ts";
import { ExecutiveGatewayPublicIndexId } from "./executiveGatewayPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA21_FILES = Object.freeze([
  "channelConnectorFoundationTypes.ts",
  "channelConnectorContracts.ts",
  "channelConnectorCapabilities.ts",
  "channelConnectorLifecycle.ts",
  "channelConnectorOwnership.ts",
  "channelConnectorBoundaries.ts",
  "channelConnectorFoundation.ts",
  "channelConnectorFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorFoundationId",
  "ChannelConnectorFoundationVersion",
  "ChannelConnectorFoundationName",
  "ChannelConnectorFoundationNamespace",
  "ChannelConnectorFoundationStatus",
  "ChannelConnectorFoundationReadiness",
  "ChannelConnectorFoundationPlatform",
  "getChannelConnectorFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "families",
  "types",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "ConnectorIdentity",
  "ConnectorDefinition",
  "ConnectorType",
  "ConnectorFamily",
  "ConnectorCapability",
  "ConnectorConfiguration",
  "ConnectorEndpointReference",
  "ConnectorCredentialReference",
  "ConnectorSessionReference",
  "ConnectorHealthStatus",
  "ConnectorLifecycle",
  "ConnectorOwnership",
  "ConnectorBoundaries",
  "ConnectorMetadata",
] as const);

const EXPECTED_FAMILIES = Object.freeze([
  "Messaging",
  "Collaboration",
  "Email",
  "Voice",
  "API",
  "SDK",
  "Enterprise",
  "Custom",
] as const);

const EXPECTED_TYPES = Object.freeze([
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
  "CustomConnector",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "ReceiveMessages",
  "SendMessages",
  "ReceiveFiles",
  "SendFiles",
  "SessionSupport",
  "AuthenticationSupport",
  "HealthMonitoring",
  "EventReception",
  "MetadataExchange",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Registered",
  "Configured",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
  "Retired",
] as const);

const EXPECTED_HEALTH = Object.freeze([
  "Unknown",
  "Healthy",
  "Warning",
  "Unavailable",
  "Disabled",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:1 Channel Connectors Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA21_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA21_FILES) {
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
      ChannelConnectorFoundationId,
      "NEA-2:1/ChannelConnectorFoundation",
    );
    assert.equal(ChannelConnectorFoundationVersion, "1.0.0");
    assert.equal(
      ChannelConnectorFoundationName,
      "Channel Connectors Foundation",
    );
    assert.equal(
      ChannelConnectorFoundationNamespace,
      "nexora.nea.channel-connectors.foundation",
    );
    assert.equal(ChannelConnectorFoundationStatus, "Foundation");
    assert.equal(ChannelConnectorFoundationReadiness, "ReadyForRegistry");
    assert.equal(ChannelConnectorFoundationPlatform.identity.phase, "NEA-2:1");
    assert.equal(ChannelConnectorFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      ChannelConnectorFoundationPlatform.identity.publicIndexId,
      ExecutiveGatewayPublicIndexId,
    );
    assert.equal(
      ChannelConnectorFoundationPlatform.nextPhase,
      "NEA-2:2 — Channel Connectors Registry",
    );
  });

  it("consumes only NEA-1 Public Index", () => {
    const dependency = ChannelConnectorFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, ExecutiveGatewayPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.dklInternalImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares fourteen contracts, eight families, and twelve types", () => {
    const { contracts, families, types } = ChannelConnectorFoundationPlatform;
    assert.equal(contracts.contractCount, 14);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractName.replace(/\s+/g, "")),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      contracts.contracts.map((item) => item.contractId),
      "contract ids",
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );

    assert.equal(families.length, 8);
    assert.deepEqual(
      families.map((item) => item.familyId),
      [...EXPECTED_FAMILIES],
    );

    assert.equal(types.length, 12);
    assert.deepEqual(
      types.map((item) => item.typeId),
      [...EXPECTED_TYPES],
    );
    assert.ok(types.every((item) => item.implementsConnector === false));
  });

  it("declares nine capabilities without runtime execution", () => {
    const capabilities = ChannelConnectorFoundationPlatform.capabilities;
    assert.equal(capabilities.capabilityCount, 9);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );
    assert.equal(capabilities.executesRuntime, false);
  });

  it("declares lifecycle states and health statuses without a runtime state machine", () => {
    const lifecycle = ChannelConnectorFoundationPlatform.lifecycle;
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 8);
    assert.deepEqual([...lifecycle.healthStatuses], [...EXPECTED_HEALTH]);
    assert.equal(lifecycle.healthStatusCount, 5);
    assert.equal(lifecycle.initialState, "Declared");
    assert.equal(lifecycle.terminalState, "Retired");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
  });

  it("declares ownership and forbidden boundaries without connector implementation", () => {
    const { ownership, boundaries, configuration } =
      ChannelConnectorFoundationPlatform;
    assert.ok(ownership.owns.includes("Connector Foundation Contracts"));
    assert.ok(ownership.owns.includes("Connector Identity"));
    assert.ok(ownership.owns.includes("Connector Lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Connector Registry"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("Network Communication"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsRuntimeConnectors, false);
    assert.equal(ownership.ownsNetworkCommunication, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("WhatsApp API"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP Requests"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime communication"));
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.implementsHttpRequests, false);
    assert.equal(boundaries.runtimeCommunication, false);
    assert.equal(configuration.loadsConfiguration, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 12), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 12);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.families), true);
    assert.equal(Object.isFrozen(platform.types), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.summary), true);
  });

  it("derives deterministic summary and declares ReadyForRegistry only", () => {
    const summaryA = getChannelConnectorFoundationSummary();
    const summaryB = getChannelConnectorFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, ChannelConnectorFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, ExecutiveGatewayPublicIndexId);
    assert.equal(summaryA.contractCount, 14);
    assert.equal(summaryA.familyCount, 8);
    assert.equal(summaryA.typeCount, 12);
    assert.equal(summaryA.capabilityCount, 9);
    assert.equal(summaryA.lifecycleStateCount, 8);
    assert.equal(summaryA.healthStatusCount, 5);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 12);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:2 — Channel Connectors Registry",
    );

    assert.equal(
      ChannelConnectorFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      ChannelConnectorFoundationPlatform.readiness.claimsConnectorsImplemented,
      false,
    );
    assert.equal(ChannelConnectorFoundationPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorFoundationPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorFoundationPlatform.networkCommunication, false);
    assert.equal(
      ChannelConnectorFoundationPlatform.authenticationExecution,
      false,
    );
    assert.equal(ChannelConnectorFoundationPlatform.messageProcessing, false);
    assert.equal(ChannelConnectorFoundationPlatform.aiReasoning, false);
  });
});
