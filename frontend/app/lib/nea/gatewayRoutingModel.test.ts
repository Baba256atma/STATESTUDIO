/**
 * NEA-5:3 — Gateway Routing Model Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingRegistryId,
  GatewayRoutingRegistryPlatform,
} from "./gatewayRoutingRegistry.ts";
import * as ModelModule from "./gatewayRoutingModel.ts";
import {
  GatewayRoutingModelId,
  GatewayRoutingModelName,
  GatewayRoutingModelNamespace,
  GatewayRoutingModelPlatform,
  GatewayRoutingModelReadiness,
  GatewayRoutingModelStatus,
  GatewayRoutingModelVersion,
  getGatewayRoutingModelSummary,
} from "./gatewayRoutingModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA53_FILES = Object.freeze([
  "gatewayRoutingModelTypes.ts",
  "gatewayRoutingModels.ts",
  "gatewayRoutingRelationships.ts",
  "gatewayRoutingModelMetadata.ts",
  "gatewayRoutingModelOwnership.ts",
  "gatewayRoutingModelLifecycle.ts",
  "gatewayRoutingModel.ts",
  "gatewayRoutingModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingModelId",
  "GatewayRoutingModelVersion",
  "GatewayRoutingModelName",
  "GatewayRoutingModelNamespace",
  "GatewayRoutingModelStatus",
  "GatewayRoutingModelReadiness",
  "GatewayRoutingModelPlatform",
  "getGatewayRoutingModelSummary",
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
  "RouteIdentity",
  "RouteDefinition",
  "RouteDestination",
  "RouteDecision",
  "RouteContext",
  "RouteStrategy",
  "RoutePriority",
  "RouteStatus",
  "RouteResult",
  "RoutePolicy",
  "RouteMetadata",
  "RouteCapability",
  "RouteLifecycle",
  "RouteRequest",
  "RouteResponse",
  "RouteResolution",
  "RouteDiagnostics",
  "RouteSummary",
  "RouteConfiguration",
  "RouteReference",
] as const);

const EXPECTED_RELATIONSHIP_KEYS = Object.freeze([
  "Identity-Definition",
  "Definition-Destination",
  "Definition-Strategy",
  "Definition-Priority",
  "Definition-Policy",
  "Definition-Capability",
  "Definition-Lifecycle",
  "Request-Context",
  "Request-Identity",
  "Request-Resolution",
  "Resolution-Destination",
  "Resolution-Decision",
  "Response-Result",
  "Response-Diagnostics",
  "Summary-Response",
  "Summary-Definition",
  "Configuration-Strategy",
  "Reference-Identity",
  "Metadata-Definition",
  "Diagnostics-Result",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:3 Gateway Routing Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA53_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA53_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(GatewayRoutingModelId, "NEA-5:3/GatewayRoutingModel");
    assert.equal(GatewayRoutingModelVersion, "1.0.0");
    assert.equal(GatewayRoutingModelName, "Gateway Routing Model");
    assert.equal(
      GatewayRoutingModelNamespace,
      "nexora.nea.gateway-routing.model",
    );
    assert.equal(GatewayRoutingModelStatus, "Model");
    assert.equal(GatewayRoutingModelReadiness, "ReadyForValidation");
    assert.equal(GatewayRoutingModelPlatform.identity.phase, "NEA-5:3");
    assert.equal(
      GatewayRoutingModelPlatform.identity.registryId,
      GatewayRoutingRegistryId,
    );
    assert.equal(
      GatewayRoutingModelPlatform.nextPhase,
      "NEA-5:4 — Gateway Routing Validation",
    );
  });

  it("consumes only NEA-5:2 Registry and preserves Registry references", () => {
    const dependency = GatewayRoutingModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingRegistry.ts",
    );
    assert.equal(dependency.registryId, GatewayRoutingRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      GatewayRoutingModelPlatform.registryPlatform,
      GatewayRoutingRegistryPlatform,
    );

    const anchors = GatewayRoutingModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.routeIdentityCount,
      GatewayRoutingRegistryPlatform.collections.routeIdentityCount,
    );
    assert.equal(
      anchors.destinationCount,
      GatewayRoutingRegistryPlatform.collections.destinationCount,
    );
    assert.equal(
      anchors.capabilityCount,
      GatewayRoutingRegistryPlatform.capabilities.capabilityCount,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
  });

  it("declares twenty domain model kinds and unique route identity instances", () => {
    const { domainModels } = GatewayRoutingModelPlatform;
    assert.equal(domainModels.modelCount, 20);
    assert.deepEqual(
      domainModels.models.map((item) => item.modelKind),
      [...EXPECTED_MODEL_KINDS],
    );
    assert.ok(
      domainModels.models.every((item) => item.executesRuntime === false),
    );

    assert.equal(
      domainModels.routeIdentityModelCount,
      GatewayRoutingRegistryPlatform.collections.routeIdentityCount,
    );
    assertUnique(
      domainModels.routeIdentityModels.map((item) => item.routeId),
      "route identity model ids",
    );
    assert.ok(
      domainModels.routeIdentityModels.every(
        (item) => item.routesAtRuntime === false,
      ),
    );
    assert.ok(
      domainModels.routeIdentityModels.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      domainModels.routeIdentityModels.every((item) => item.destination),
    );
    assert.ok(domainModels.routeIdentityModels.every((item) => item.decision));
    assert.ok(domainModels.routeIdentityModels.every((item) => item.priority));
    assert.ok(domainModels.routeIdentityModels.every((item) => item.status));
  });

  it("declares twenty model relationships without runtime behavior", () => {
    const { relationships } = GatewayRoutingModelPlatform;
    assert.equal(relationships.relationshipCount, 20);
    assert.deepEqual(
      relationships.relationships.map(
        (item) => item.relationshipId.split("/").at(-1),
      ),
      [...EXPECTED_RELATIONSHIP_KEYS],
    );
    assert.equal(relationships.executesRuntime, false);
    assert.ok(
      relationships.relationships.every((item) => item.metadataOnly === true),
    );

    const byKey = Object.fromEntries(
      relationships.relationships.map((item) => [
        item.relationshipId.split("/").at(-1),
        item,
      ]),
    );
    assert.equal(byKey["Identity-Definition"]?.sourceModelKind, "RouteIdentity");
    assert.equal(byKey["Identity-Definition"]?.targetModelKind, "RouteDefinition");
    assert.equal(byKey["Request-Resolution"]?.sourceModelKind, "RouteRequest");
    assert.equal(byKey["Resolution-Decision"]?.targetModelKind, "RouteDecision");
    assert.equal(byKey["Diagnostics-Result"]?.cardinality, "many-to-one");
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingModelPlatform;
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Model Metadata"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Routing Algorithms"));
    assert.ok(ownership.doesNotOwn.includes("Strategy Execution"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.equal(ownership.ownsRuntimeRouting, false);
    assert.equal(ownership.ownsRegistryCollections, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Strategy Execution"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.executesStrategies, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingModelPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.domainModels), true);
    assert.equal(Object.isFrozen(platform.domainModels.models), true);
    assert.equal(Object.isFrozen(platform.domainModels.routeIdentityModels), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical model collections", () => {
    const summaryA = getGatewayRoutingModelSummary();
    const summaryB = getGatewayRoutingModelSummary();
    const meta = GatewayRoutingModelPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, GatewayRoutingModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, GatewayRoutingRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.routeIdentityModelCount, 10);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:4 — Gateway Routing Validation",
    );
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesRegistryValues, false);
    assert.equal(
      GatewayRoutingModelPlatform.lifecycle.currentState,
      "ReadyForValidation",
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      GatewayRoutingModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      GatewayRoutingModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      GatewayRoutingModelPlatform.readiness.claimsRuntimeRoutingImplemented,
      false,
    );
    assert.equal(GatewayRoutingModelPlatform.runtimeBehavior, false);
    assert.equal(
      GatewayRoutingModelPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingModelPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(
      GatewayRoutingModelPlatform.implementsConsumerSelection,
      false,
    );
    assert.equal(GatewayRoutingModelPlatform.executesStrategies, false);
    assert.equal(GatewayRoutingModelPlatform.implementsHttp, false);
    assert.equal(GatewayRoutingModelPlatform.aiReasoning, false);
  });
});
