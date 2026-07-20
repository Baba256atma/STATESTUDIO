/**
 * NEA-1:3 — Executive Gateway Model Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayRegistryId,
  ExecutiveGatewayRegistryPlatform,
} from "./executiveGatewayRegistry.ts";
import * as ModelModule from "./executiveGatewayModel.ts";
import {
  ExecutiveGatewayModelId,
  ExecutiveGatewayModelName,
  ExecutiveGatewayModelNamespace,
  ExecutiveGatewayModelPlatform,
  ExecutiveGatewayModelReadiness,
  ExecutiveGatewayModelStatus,
  ExecutiveGatewayModelVersion,
  getExecutiveGatewayModelSummary,
} from "./executiveGatewayModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA13_FILES = Object.freeze([
  "executiveGatewayModelTypes.ts",
  "executiveGatewayModels.ts",
  "executiveGatewayRelationships.ts",
  "executiveGatewayModelMetadata.ts",
  "executiveGatewayModelOwnership.ts",
  "executiveGatewayModelLifecycle.ts",
  "executiveGatewayModel.ts",
  "executiveGatewayModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayModelId",
  "ExecutiveGatewayModelVersion",
  "ExecutiveGatewayModelName",
  "ExecutiveGatewayModelNamespace",
  "ExecutiveGatewayModelStatus",
  "ExecutiveGatewayModelReadiness",
  "ExecutiveGatewayModelPlatform",
  "getExecutiveGatewayModelSummary",
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

const EXPECTED_MODELS = Object.freeze([
  "GatewayIdentity",
  "GatewaySender",
  "GatewayTenant",
  "GatewayWorkspace",
  "GatewayContext",
  "GatewaySession",
  "GatewayConversation",
  "GatewayAuthentication",
  "GatewayAuthorization",
  "GatewayTrust",
  "GatewayConsent",
  "GatewayPayload",
  "GatewayAttachment",
  "GatewayMetadata",
  "GatewayRequest",
  "GatewayRouting",
  "GatewayValidation",
  "GatewayDiagnostic",
  "GatewayProcessingResult",
  "GatewayResponse",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:3 Executive Gateway Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA13_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA13_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(ExecutiveGatewayModelId, "NEA-1:3/ExecutiveGatewayModel");
    assert.equal(ExecutiveGatewayModelVersion, "1.0.0");
    assert.equal(ExecutiveGatewayModelName, "Executive Gateway Model");
    assert.equal(
      ExecutiveGatewayModelNamespace,
      "nexora.nea.executive-gateway.model",
    );
    assert.equal(ExecutiveGatewayModelStatus, "Model");
    assert.equal(ExecutiveGatewayModelReadiness, "ReadyForValidation");
    assert.equal(ExecutiveGatewayModelPlatform.identity.phase, "NEA-1:3");
    assert.equal(ExecutiveGatewayModelPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayModelPlatform.identity.registryId,
      ExecutiveGatewayRegistryId,
    );
    assert.equal(
      ExecutiveGatewayModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveGatewayModelPlatform.nextPhase,
      "NEA-1:4 — Executive Gateway Validation",
    );
  });

  it("consumes only NEA-1:2 Registry public surface", () => {
    const dependency = ExecutiveGatewayModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(dependency.registryPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayRegistry.ts",
    );
    assert.equal(dependency.registryId, ExecutiveGatewayRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.dklInternalImport, false);
    assert.equal(dependency.engineInternalImport, false);
    assert.equal(dependency.assistantInternalImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      ExecutiveGatewayModelPlatform.registryPlatform,
      ExecutiveGatewayRegistryPlatform,
    );
  });

  it("declares exactly twenty domain models with Registry references preserved", () => {
    const catalog = ExecutiveGatewayModelPlatform.domainModels;
    assert.equal(catalog.modelCount, 20);
    assert.deepEqual(
      catalog.models.map((item) => item.modelKind),
      [...EXPECTED_MODELS],
    );
    assertUnique(
      catalog.models.map((item) => item.modelKind),
      "model kinds",
    );
    assert.ok(catalog.models.every((item) => item.executesRuntime === false));
    assert.equal(catalog.registryAnchors.preservesCanonicalReferences, true);
    assert.equal(catalog.registryAnchors.duplicatesRegistryValues, false);
    assert.equal(
      catalog.registryAnchors.sourceFamilyCount,
      ExecutiveGatewayRegistryPlatform.collections.sourceFamilies.length,
    );
    assert.equal(
      catalog.registryAnchors.channelCount,
      ExecutiveGatewayRegistryPlatform.collections.channels.length,
    );
    assert.equal(
      catalog.registryAnchors.senderCount,
      ExecutiveGatewayRegistryPlatform.collections.senders.length,
    );
    assert.equal(
      catalog.registryAnchors.routingDestinationCount,
      ExecutiveGatewayRegistryPlatform.collections.routingDestinations.length,
    );

    const request = catalog.models.find(
      (item) => item.modelKind === "GatewayRequest",
    );
    assert.ok(request);
    assert.ok(request!.composesModels.includes("GatewaySender"));
    assert.ok(request!.composesModels.includes("GatewayContext"));
    assert.ok(request!.registryCollections.includes("sourceFamilies"));

    const response = catalog.models.find(
      (item) => item.modelKind === "GatewayResponse",
    );
    assert.ok(response);
    assert.ok(response!.composesModels.includes("GatewayRouting"));
    assert.ok(response!.composesModels.includes("GatewayValidation"));
  });

  it("declares complete model relationships without graph execution", () => {
    const relationships = ExecutiveGatewayModelPlatform.relationships;
    assert.ok(relationships.relationshipCount >= 20);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.equal(relationships.executesGraphTraversal, false);
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "GatewayRequest" &&
          item.targetModelKind === "GatewaySender",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "GatewayResponse" &&
          item.targetModelKind === "GatewayRequest",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "GatewayContext" &&
          item.targetModelKind === "GatewayTenant",
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayModelPlatform;
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Gateway Request Model"));
    assert.ok(ownership.doesNotOwn.includes("Validation Logic"));
    assert.ok(ownership.doesNotOwn.includes("Routing Logic"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsValidationLogic, false);
    assert.equal(ownership.ownsRoutingLogic, false);
    assert.equal(ownership.ownsRuntimeProcessing, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.performsValidation, false);
    assert.equal(boundaries.executesRouting, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.invokesEngine, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
    assert.equal(boundaries.reconstructsRegistry, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayModelPlatform;
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
  });

  it("derives deterministic inventory counts from canonical collections", () => {
    const summaryA = getExecutiveGatewayModelSummary();
    const summaryB = getExecutiveGatewayModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, ExecutiveGatewayModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, ExecutiveGatewayRegistryId);

    const meta = ExecutiveGatewayModelPlatform.metadata;
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.countsReconstructed, false);
    assert.equal(meta.duplicatesRegistryValues, false);
    assert.equal(summaryA.domainModelCount, meta.domainModelCount);
    assert.equal(summaryA.relationshipCount, meta.relationshipCount);
    assert.equal(summaryA.lifecycleStateCount, meta.lifecycleStateCount);
    assert.equal(summaryA.ownershipCount, meta.ownershipCount);
    assert.equal(summaryA.prohibitedSurfaceCount, meta.prohibitedSurfaceCount);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:4 — Executive Gateway Validation",
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayModelPlatform.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveGatewayModelPlatform.lifecycle.currentState,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveGatewayModelPlatform.lifecycle.executesTransitions,
      false,
    );
    assert.notEqual(
      ExecutiveGatewayModelPlatform.readiness,
      "ReadyForManifest",
    );
    assert.notEqual(ExecutiveGatewayModelPlatform.readiness, "RuntimeReady");
    assert.equal(ExecutiveGatewayModelPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayModelPlatform.validationEngine, false);
    assert.equal(ExecutiveGatewayModelPlatform.routingEngine, false);
    assert.equal(ExecutiveGatewayModelPlatform.authenticationEngine, false);
    assert.equal(ExecutiveGatewayModelPlatform.authorizationEngine, false);
    assert.equal(ExecutiveGatewayModelPlatform.businessLogic, false);
    assert.equal(ExecutiveGatewayModelPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewayModelPlatform.persistenceBehavior, false);
  });
});
