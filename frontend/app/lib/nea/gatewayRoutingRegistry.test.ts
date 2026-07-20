/**
 * NEA-5:2 — Gateway Routing Registry Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingFoundationId,
  GatewayRoutingFoundationPlatform,
} from "./gatewayRoutingFoundation.ts";
import * as RegistryModule from "./gatewayRoutingRegistry.ts";
import {
  GatewayRoutingRegistryId,
  GatewayRoutingRegistryName,
  GatewayRoutingRegistryNamespace,
  GatewayRoutingRegistryPlatform,
  GatewayRoutingRegistryReadiness,
  GatewayRoutingRegistryStatus,
  GatewayRoutingRegistryVersion,
  getGatewayRoutingRegistrySummary,
} from "./gatewayRoutingRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA52_FILES = Object.freeze([
  "gatewayRoutingRegistryTypes.ts",
  "gatewayRoutingRegistryCollections.ts",
  "gatewayRoutingRegistryPolicies.ts",
  "gatewayRoutingRegistryCapabilities.ts",
  "gatewayRoutingRegistryOwnership.ts",
  "gatewayRoutingRegistryMetadata.ts",
  "gatewayRoutingRegistry.ts",
  "gatewayRoutingRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingRegistryId",
  "GatewayRoutingRegistryVersion",
  "GatewayRoutingRegistryName",
  "GatewayRoutingRegistryNamespace",
  "GatewayRoutingRegistryStatus",
  "GatewayRoutingRegistryReadiness",
  "GatewayRoutingRegistryPlatform",
  "getGatewayRoutingRegistrySummary",
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

const EXPECTED_STRATEGIES = Object.freeze([
  "Direct",
  "Broadcast",
  "Priority",
  "Sequential",
  "Conditional",
  "Failover",
  "Deferred",
  "Manual",
] as const);

const EXPECTED_PRIORITIES = Object.freeze([
  "Critical",
  "High",
  "Normal",
  "Low",
  "Deferred",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Registered",
  "Active",
  "Deprecated",
  "Disabled",
  "Reserved",
] as const);

const EXPECTED_RESULTS = Object.freeze([
  "Success",
  "Pending",
  "Rejected",
  "Failed",
  "Unknown",
] as const);

const EXPECTED_ROUTING_POLICIES = Object.freeze([
  "DestinationRequired",
  "PriorityHonored",
  "FailoverAllowed",
  "CorrelationRequired",
  "ContextPropagationRequired",
  "RejectOnUnknown",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Received",
  "Evaluated",
  "DestinationResolved",
  "RoutingPrepared",
  "Routed",
  "Completed",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:2 Gateway Routing Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA52_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA52_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical registry identity, status Registry, and ReadyForModel", () => {
    assert.equal(GatewayRoutingRegistryId, "NEA-5:2/GatewayRoutingRegistry");
    assert.equal(GatewayRoutingRegistryVersion, "1.0.0");
    assert.equal(GatewayRoutingRegistryName, "Gateway Routing Registry");
    assert.equal(
      GatewayRoutingRegistryNamespace,
      "nexora.nea.gateway-routing.registry",
    );
    assert.equal(GatewayRoutingRegistryStatus, "Registry");
    assert.equal(GatewayRoutingRegistryReadiness, "ReadyForModel");
    assert.equal(GatewayRoutingRegistryPlatform.identity.phase, "NEA-5:2");
    assert.equal(
      GatewayRoutingRegistryPlatform.identity.foundationId,
      GatewayRoutingFoundationId,
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.nextPhase,
      "NEA-5:3 — Gateway Routing Model",
    );
  });

  it("consumes only NEA-5:1 Foundation and preserves Foundation references", () => {
    const dependency = GatewayRoutingRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingFoundation.ts",
    );
    assert.equal(dependency.foundationId, GatewayRoutingFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      GatewayRoutingRegistryPlatform.foundationPlatform,
      GatewayRoutingFoundationPlatform,
    );

    const { collections, capabilities } = GatewayRoutingRegistryPlatform;
    assert.equal(
      collections.destinationCount,
      GatewayRoutingFoundationPlatform.destinations.destinationCount,
    );
    assert.equal(
      collections.decisionCount,
      GatewayRoutingFoundationPlatform.destinations.decisionCount,
    );
    assert.equal(
      collections.contextCount,
      GatewayRoutingFoundationPlatform.destinations.contextDimensionCount,
    );
    assert.equal(
      collections.contractCount,
      GatewayRoutingFoundationPlatform.contracts.contractCount,
    );
    assert.equal(
      collections.lifecycleEntryCount,
      GatewayRoutingFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      GatewayRoutingFoundationPlatform.capabilities.capabilityCount,
    );
    assert.ok(
      collections.destinations.every(
        (item) => item.sourcePhase === "NEA-5:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.decisions.every(
        (item) => item.sourcePhase === "NEA-5:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.contexts.every(
        (item) => item.sourcePhase === "NEA-5:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.lifecycleEntries.every(
        (item) => item.sourcePhase === "NEA-5:1" && item.foundationReference,
      ),
    );
    assert.equal(collections.duplicatesFoundationValues, false);
  });

  it("declares unique routing identity registry", () => {
    const { collections } = GatewayRoutingRegistryPlatform;
    assert.equal(collections.routeIdentityCount, 10);
    assertUnique(
      collections.routeIdentities.map((item) => item.routeId),
      "route ids",
    );
    assert.ok(
      collections.routeIdentities.every(
        (item) => item.routesAtRuntime === false,
      ),
    );
    assert.ok(
      collections.routeIdentities.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      collections.routeIdentities.every((item) => item.version === "1.0.0"),
    );
    assert.ok(
      collections.routeIdentities.every((item) => item.destination),
    );
    assert.ok(collections.routeIdentities.every((item) => item.decision));
    assert.ok(collections.routeIdentities.every((item) => item.priority));
    assert.ok(collections.routeIdentities.every((item) => item.status));
  });

  it("declares registry-owned vocabularies and Foundation-referenced lifecycle", () => {
    const { collections } = GatewayRoutingRegistryPlatform;
    assert.deepEqual(
      collections.strategies.map((item) => item.id),
      [...EXPECTED_STRATEGIES],
    );
    assert.deepEqual(
      collections.priorities.map((item) => item.id),
      [...EXPECTED_PRIORITIES],
    );
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.deepEqual(
      collections.results.map((item) => item.id),
      [...EXPECTED_RESULTS],
    );
    assert.deepEqual(
      collections.routingPolicies.map((item) => item.id),
      [...EXPECTED_ROUTING_POLICIES],
    );
    assert.deepEqual(
      [...collections.lifecycleEntries.map((item) => item.id)],
      [...EXPECTED_LIFECYCLE],
    );
    assert.ok(
      collections.strategies.every(
        (item) => item.sourcePhase === "NEA-5:2" && item.foundationReference === null,
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries, policies } =
      GatewayRoutingRegistryPlatform;
    assert.ok(ownership.owns.includes("Registry Collections"));
    assert.ok(ownership.owns.includes("Routing Identity Registry"));
    assert.ok(ownership.owns.includes("Strategy Registry"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Routing Algorithms"));
    assert.ok(ownership.doesNotOwn.includes("Consumer Selection"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsRuntimeRouting, false);
    assert.equal(ownership.ownsFoundationContracts, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Executive Engine invocation"),
    );
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.implementsRoutingAlgorithms, false);
    assert.equal(boundaries.implementsConsumerSelection, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.routeIdentities), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical registry collections", () => {
    const summaryA = getGatewayRoutingRegistrySummary();
    const summaryB = getGatewayRoutingRegistrySummary();
    const meta = GatewayRoutingRegistryPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, GatewayRoutingRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, GatewayRoutingFoundationId);
    assert.equal(summaryA.routeIdentityCount, 10);
    assert.equal(summaryA.destinationCount, 10);
    assert.equal(summaryA.decisionCount, 6);
    assert.equal(summaryA.strategyCount, 8);
    assert.equal(summaryA.priorityCount, 5);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.resultCount, 5);
    assert.equal(summaryA.contextCount, 8);
    assert.equal(summaryA.routingPolicyCount, 6);
    assert.equal(summaryA.contractCount, 10);
    assert.equal(summaryA.capabilityCount, 9);
    assert.equal(summaryA.lifecycleEntryCount, 6);
    assert.equal(summaryA.registryPolicyCount, 8);
    assert.equal(summaryA.totalRegistryEntryCount, meta.totalEntryCount);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.nextPhase, "NEA-5:3 — Gateway Routing Model");
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesFoundationValues, false);
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.readiness.claimsRuntimeRoutingImplemented,
      false,
    );
    assert.equal(GatewayRoutingRegistryPlatform.runtimeBehavior, false);
    assert.equal(
      GatewayRoutingRegistryPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(
      GatewayRoutingRegistryPlatform.implementsConsumerSelection,
      false,
    );
    assert.equal(GatewayRoutingRegistryPlatform.implementsHttp, false);
    assert.equal(GatewayRoutingRegistryPlatform.implementsRest, false);
    assert.equal(GatewayRoutingRegistryPlatform.aiReasoning, false);
  });
});
