/**
 * NEA-2:2 — Channel Connectors Registry Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ChannelConnectorFoundationId,
  ChannelConnectorFoundationPlatform,
} from "./channelConnectorFoundation.ts";
import * as RegistryModule from "./channelConnectorRegistry.ts";
import {
  ChannelConnectorRegistryId,
  ChannelConnectorRegistryName,
  ChannelConnectorRegistryNamespace,
  ChannelConnectorRegistryPlatform,
  ChannelConnectorRegistryReadiness,
  ChannelConnectorRegistryStatus,
  ChannelConnectorRegistryVersion,
  getChannelConnectorRegistrySummary,
} from "./channelConnectorRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA22_FILES = Object.freeze([
  "channelConnectorRegistryTypes.ts",
  "channelConnectorRegistryCollections.ts",
  "channelConnectorRegistryPolicies.ts",
  "channelConnectorRegistryCapabilities.ts",
  "channelConnectorRegistryOwnership.ts",
  "channelConnectorRegistryMetadata.ts",
  "channelConnectorRegistry.ts",
  "channelConnectorRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorRegistryId",
  "ChannelConnectorRegistryVersion",
  "ChannelConnectorRegistryName",
  "ChannelConnectorRegistryNamespace",
  "ChannelConnectorRegistryStatus",
  "ChannelConnectorRegistryReadiness",
  "ChannelConnectorRegistryPlatform",
  "getChannelConnectorRegistrySummary",
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

const EXPECTED_PROTOCOLS = Object.freeze([
  "HTTPS",
  "WebSocket",
  "SMTP",
  "IMAP",
  "POP3",
  "SIP",
  "REST",
  "MCP",
  "SDK",
  "Custom",
] as const);

const EXPECTED_DIRECTIONS = Object.freeze([
  "Inbound",
  "Outbound",
  "Bidirectional",
] as const);

const EXPECTED_AUTH = Object.freeze([
  "OAuth2",
  "ApiKey",
  "BearerToken",
  "BasicAuthentication",
  "Certificate",
  "Anonymous",
  "Custom",
] as const);

const EXPECTED_HEALTH = Object.freeze([
  "Healthy",
  "Degraded",
  "Offline",
  "Maintenance",
  "Unknown",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Declared",
  "Registered",
  "Certified",
  "Frozen",
  "Deprecated",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "MessageReceived",
  "MessageSent",
  "FileReceived",
  "FileSent",
  "ConnectionEstablished",
  "ConnectionClosed",
  "AuthenticationRequested",
  "HealthChanged",
] as const);

const EXPECTED_PAYLOADS = Object.freeze([
  "Text",
  "File",
  "Audio",
  "Image",
  "Video",
  "Command",
  "Event",
  "Metadata",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:2 Channel Connectors Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA22_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA22_FILES) {
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
      ChannelConnectorRegistryId,
      "NEA-2:2/ChannelConnectorRegistry",
    );
    assert.equal(ChannelConnectorRegistryVersion, "1.0.0");
    assert.equal(
      ChannelConnectorRegistryName,
      "Channel Connectors Registry",
    );
    assert.equal(
      ChannelConnectorRegistryNamespace,
      "nexora.nea.channel-connectors.registry",
    );
    assert.equal(ChannelConnectorRegistryStatus, "Registry");
    assert.equal(ChannelConnectorRegistryReadiness, "ReadyForModel");
    assert.equal(ChannelConnectorRegistryPlatform.identity.phase, "NEA-2:2");
    assert.equal(
      ChannelConnectorRegistryPlatform.identity.foundationId,
      ChannelConnectorFoundationId,
    );
    assert.equal(
      ChannelConnectorRegistryPlatform.nextPhase,
      "NEA-2:3 — Channel Connectors Model",
    );
  });

  it("consumes only NEA-2:1 Foundation without duplicating Foundation values", () => {
    const dependency = ChannelConnectorRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorFoundation.ts",
    );
    assert.equal(dependency.foundationId, ChannelConnectorFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      ChannelConnectorRegistryPlatform.foundationPlatform,
      ChannelConnectorFoundationPlatform,
    );
    assert.equal(
      ChannelConnectorRegistryPlatform.collections.duplicatesFoundationValues,
      false,
    );

    const families = ChannelConnectorRegistryPlatform.collections.families;
    assert.ok(
      families.every(
        (item) =>
          item.sourcePhase === "NEA-2:1" && item.foundationReference !== null,
      ),
    );
    assert.equal(
      families.length,
      ChannelConnectorFoundationPlatform.families.length,
    );
    assert.equal(
      ChannelConnectorRegistryPlatform.collections.types.length,
      ChannelConnectorFoundationPlatform.types.length,
    );
    assert.equal(
      ChannelConnectorRegistryPlatform.capabilities.capabilityCount,
      ChannelConnectorFoundationPlatform.capabilities.capabilityCount,
    );
  });

  it("declares twelve unique connector identities", () => {
    const identities = ChannelConnectorRegistryPlatform.collections.identities;
    assert.equal(identities.length, 12);
    assertUnique(
      identities.map((item) => item.connectorId),
      "connector ids",
    );
    assert.ok(identities.every((item) => item.implementsConnector === false));
    assert.ok(identities.every((item) => item.executesRuntime === false));
    assert.ok(identities.every((item) => item.connectorStatus === "Registered"));
    assert.ok(
      identities.every(
        (item) =>
          item.connectorCapabilities.length ===
          ChannelConnectorFoundationPlatform.capabilities.capabilityCount,
      ),
    );
  });

  it("declares registry-owned protocols, directions, auth, health, status, events, payloads", () => {
    const collections = ChannelConnectorRegistryPlatform.collections;
    assert.deepEqual(
      collections.protocols.map((item) => item.id),
      [...EXPECTED_PROTOCOLS],
    );
    assert.deepEqual(
      collections.directions.map((item) => item.id),
      [...EXPECTED_DIRECTIONS],
    );
    assert.deepEqual(
      collections.authenticationMethods.map((item) => item.id),
      [...EXPECTED_AUTH],
    );
    assert.deepEqual(
      collections.healthStates.map((item) => item.id),
      [...EXPECTED_HEALTH],
    );
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.deepEqual(
      collections.eventTypes.map((item) => item.id),
      [...EXPECTED_EVENTS],
    );
    assert.deepEqual(
      collections.payloadTypes.map((item) => item.id),
      [...EXPECTED_PAYLOADS],
    );
    assert.ok(
      collections.protocols.every((item) => item.sourcePhase === "NEA-2:2"),
    );
  });

  it("declares policies and ownership without runtime connector behavior", () => {
    const { policies, ownership, boundaries } =
      ChannelConnectorRegistryPlatform;
    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
    assert.ok(ownership.owns.includes("Connector Identity Registry"));
    assert.ok(ownership.owns.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("OAuth"));
    assert.ok(ownership.doesNotOwn.includes("Connector Models"));
    assert.equal(ownership.ownsRuntimeConnectors, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth Flow"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP Requests"));
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.identities), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
  });

  it("derives deterministic summary counts from canonical collections", () => {
    const summaryA = getChannelConnectorRegistrySummary();
    const summaryB = getChannelConnectorRegistrySummary();
    const meta = ChannelConnectorRegistryPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, ChannelConnectorRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, ChannelConnectorFoundationId);
    assert.equal(summaryA.familyCount, 8);
    assert.equal(summaryA.typeCount, 12);
    assert.equal(summaryA.identityCount, 12);
    assert.equal(summaryA.protocolCount, 10);
    assert.equal(summaryA.directionCount, 3);
    assert.equal(summaryA.authenticationMethodCount, 7);
    assert.equal(summaryA.capabilityCount, 9);
    assert.equal(summaryA.lifecycleStateCount, 8);
    assert.equal(summaryA.healthStateCount, 5);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.eventTypeCount, 8);
    assert.equal(summaryA.payloadTypeCount, 8);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.totalRegistryEntryCount, meta.totalEntryCount);
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesFoundationValues, false);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:3 — Channel Connectors Model",
    );
    assert.equal(
      ChannelConnectorRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(ChannelConnectorRegistryPlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorRegistryPlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorRegistryPlatform.oauthFlow, false);
    assert.equal(ChannelConnectorRegistryPlatform.messageProcessing, false);
  });
});
