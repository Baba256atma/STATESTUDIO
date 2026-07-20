/**
 * NEA-5:1 — Gateway Routing Foundation Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as FoundationModule from "./gatewayRoutingFoundation.ts";
import {
  GatewayRoutingFoundationId,
  GatewayRoutingFoundationName,
  GatewayRoutingFoundationNamespace,
  GatewayRoutingFoundationPlatform,
  GatewayRoutingFoundationReadiness,
  GatewayRoutingFoundationStatus,
  GatewayRoutingFoundationVersion,
  getGatewayRoutingFoundationSummary,
} from "./gatewayRoutingFoundation.ts";
import { SecurityGatewayPublicIndexId } from "./securityGatewayPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA51_FILES = Object.freeze([
  "gatewayRoutingFoundationTypes.ts",
  "gatewayRoutingContracts.ts",
  "gatewayRoutingCapabilities.ts",
  "gatewayRoutingLifecycle.ts",
  "gatewayRoutingOwnership.ts",
  "gatewayRoutingBoundaries.ts",
  "gatewayRoutingFoundation.ts",
  "gatewayRoutingFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingFoundationId",
  "GatewayRoutingFoundationVersion",
  "GatewayRoutingFoundationName",
  "GatewayRoutingFoundationNamespace",
  "GatewayRoutingFoundationStatus",
  "GatewayRoutingFoundationReadiness",
  "GatewayRoutingFoundationPlatform",
  "getGatewayRoutingFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "destinations",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "RouteRequest",
  "RouteDecision",
  "RouteDestination",
  "RouteContext",
  "RouteMetadata",
  "RouteResult",
  "RoutePolicy",
  "RouteLifecycle",
  "RouteOwnership",
  "RouteBoundary",
] as const);

const EXPECTED_DESTINATIONS = Object.freeze([
  "ExecutiveEngine",
  "DataKnowledgeLayer",
  "Advisor",
  "Director",
  "EVE",
  "Operations",
  "BusinessPlatform",
  "InternalService",
  "Reject",
  "DeadLetter",
] as const);

const EXPECTED_DECISIONS = Object.freeze([
  "Accepted",
  "Routed",
  "Deferred",
  "Rejected",
  "Failed",
  "Unknown",
] as const);

const EXPECTED_CONTEXT_DIMENSIONS = Object.freeze([
  "Tenant",
  "Workspace",
  "Session",
  "Conversation",
  "Security",
  "Connector",
  "Request",
  "Priority",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "DestinationResolution",
  "ConsumerSelection",
  "ContextPropagation",
  "RouteMetadataDeclaration",
  "RoutePolicyDeclaration",
  "PriorityDeclaration",
  "CorrelationPropagation",
  "RoutingSummaryDeclaration",
  "RoutingResultDeclaration",
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

describe("NEA-5:1 Gateway Routing Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA51_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA51_FILES) {
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
      GatewayRoutingFoundationId,
      "NEA-5:1/GatewayRoutingFoundation",
    );
    assert.equal(GatewayRoutingFoundationVersion, "1.0.0");
    assert.equal(
      GatewayRoutingFoundationName,
      "Gateway Routing Foundation",
    );
    assert.equal(
      GatewayRoutingFoundationNamespace,
      "nexora.nea.gateway-routing.foundation",
    );
    assert.equal(GatewayRoutingFoundationStatus, "Foundation");
    assert.equal(GatewayRoutingFoundationReadiness, "ReadyForRegistry");
    assert.equal(GatewayRoutingFoundationPlatform.identity.phase, "NEA-5:1");
    assert.equal(GatewayRoutingFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      GatewayRoutingFoundationPlatform.identity.publicIndexId,
      SecurityGatewayPublicIndexId,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.nextPhase,
      "NEA-5:2 — Gateway Routing Registry",
    );
  });

  it("consumes only NEA-4 Security Gateway Public Index", () => {
    const dependency = GatewayRoutingFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, SecurityGatewayPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares ten routing contracts", () => {
    const { contracts } = GatewayRoutingFoundationPlatform;
    assert.equal(contracts.contractCount, 10);
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
  });

  it("declares ten destinations, six decisions, and eight context dimensions", () => {
    const { destinations } = GatewayRoutingFoundationPlatform;
    assert.equal(destinations.destinationCount, 10);
    assert.deepEqual(
      destinations.destinations.map((item) => item.destinationId),
      [...EXPECTED_DESTINATIONS],
    );
    assert.ok(
      destinations.destinations.every((item) => item.routesAtRuntime === false),
    );

    assert.equal(destinations.decisionCount, 6);
    assert.deepEqual(
      destinations.decisions.map((item) => item.decisionId),
      [...EXPECTED_DECISIONS],
    );
    assert.ok(
      destinations.decisions.every(
        (item) => item.evaluatesAtRuntime === false,
      ),
    );

    assert.equal(destinations.contextDimensionCount, 8);
    assert.deepEqual(
      destinations.contextDimensions.map((item) => item.dimensionId),
      [...EXPECTED_CONTEXT_DIMENSIONS],
    );
    assert.ok(
      destinations.contextDimensions.every(
        (item) => item.propagatesAtRuntime === false,
      ),
    );
    assert.equal(destinations.routesAtRuntime, false);
  });

  it("declares nine capabilities and six lifecycle states", () => {
    const { capabilities, lifecycle } = GatewayRoutingFoundationPlatform;
    assert.equal(capabilities.capabilityCount, 9);
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
    assert.equal(lifecycle.terminalState, "Completed");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.stateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingFoundationPlatform;
    assert.ok(ownership.owns.includes("Routing declarations"));
    assert.ok(ownership.owns.includes("Destination declarations"));
    assert.ok(ownership.owns.includes("Routing lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Runtime routing"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.ok(ownership.doesNotOwn.includes("Advisor"));
    assert.ok(ownership.doesNotOwn.includes("Director"));
    assert.ok(ownership.doesNotOwn.includes("EVE"));
    assert.equal(ownership.ownsRuntimeRouting, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsExecutiveEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.ok(
      boundaries.prohibitedSurfaces.includes("Executive Engine invocation"),
    );
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.implementsRoutingAlgorithms, false);
    assert.equal(boundaries.implementsConsumerSelectionLogic, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 11), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 11);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.contracts.contracts), true);
    assert.equal(Object.isFrozen(platform.destinations), true);
    assert.equal(Object.isFrozen(platform.destinations.destinations), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical foundation collections", () => {
    const summaryA = getGatewayRoutingFoundationSummary();
    const summaryB = getGatewayRoutingFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, GatewayRoutingFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, SecurityGatewayPublicIndexId);
    assert.equal(summaryA.contractCount, 10);
    assert.equal(summaryA.destinationCount, 10);
    assert.equal(summaryA.decisionCount, 6);
    assert.equal(summaryA.contextDimensionCount, 8);
    assert.equal(summaryA.capabilityCount, 9);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:2 — Gateway Routing Registry",
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.metadata.architectureVersion,
      "NEA-5.0.0",
    );
  });

  it("declares ReadyForRegistry only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingFoundationPlatform.readiness.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.readiness.claimsRuntimeRoutingImplemented,
      false,
    );
    assert.equal(GatewayRoutingFoundationPlatform.runtimeBehavior, false);
    assert.equal(
      GatewayRoutingFoundationPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(
      GatewayRoutingFoundationPlatform.implementsConsumerSelectionLogic,
      false,
    );
    assert.equal(GatewayRoutingFoundationPlatform.implementsHttp, false);
    assert.equal(GatewayRoutingFoundationPlatform.implementsRest, false);
    assert.equal(GatewayRoutingFoundationPlatform.aiReasoning, false);
  });
});
