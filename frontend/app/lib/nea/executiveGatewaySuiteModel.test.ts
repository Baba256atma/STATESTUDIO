/**
 * NEA-8:3 — Executive Gateway Suite Model Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuiteRegistryId,
  ExecutiveGatewaySuiteRegistryPlatform,
} from "./executiveGatewaySuiteRegistry.ts";
import * as ModelModule from "./executiveGatewaySuiteModel.ts";
import {
  ExecutiveGatewaySuiteModelId,
  ExecutiveGatewaySuiteModelName,
  ExecutiveGatewaySuiteModelNamespace,
  ExecutiveGatewaySuiteModelPlatform,
  ExecutiveGatewaySuiteModelReadiness,
  ExecutiveGatewaySuiteModelStatus,
  ExecutiveGatewaySuiteModelVersion,
  getExecutiveGatewaySuiteModelSummary,
} from "./executiveGatewaySuiteModel.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA83_FILES = Object.freeze([
  "executiveGatewaySuiteModelTypes.ts",
  "executiveGatewaySuiteModels.ts",
  "executiveGatewaySuiteRelationships.ts",
  "executiveGatewaySuiteModelMetadata.ts",
  "executiveGatewaySuiteModelOwnership.ts",
  "executiveGatewaySuiteModelLifecycle.ts",
  "executiveGatewaySuiteModel.ts",
  "executiveGatewaySuiteModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteModelId",
  "ExecutiveGatewaySuiteModelVersion",
  "ExecutiveGatewaySuiteModelName",
  "ExecutiveGatewaySuiteModelNamespace",
  "ExecutiveGatewaySuiteModelStatus",
  "ExecutiveGatewaySuiteModelReadiness",
  "ExecutiveGatewaySuiteModelPlatform",
  "getExecutiveGatewaySuiteModelSummary",
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
  "SuiteIdentity",
  "SuiteComponent",
  "SuiteComponentIdentity",
  "SuiteComposition",
  "SuiteDependency",
  "SuiteCapability",
  "SuiteContract",
  "SuiteLifecycle",
  "SuitePolicy",
  "SuiteInventory",
  "SuiteMetadata",
  "SuiteStatus",
  "SuiteVersion",
  "SuiteReadiness",
  "SuiteRelationship",
  "SuiteValidationTarget",
  "SuitePlatformReference",
  "SuitePublicApiInventory",
  "SuiteSummary",
  "ExecutiveGatewaySuite",
] as const);

const EXPECTED_COMPONENT_IDS = Object.freeze([
  "NEA-1",
  "NEA-2",
  "NEA-3",
  "NEA-4",
  "NEA-5",
  "NEA-6",
  "NEA-7",
] as const);

const EXPECTED_COMPONENT_NAMES = Object.freeze([
  "Executive Gateway",
  "Channel Connectors",
  "Session & Conversation",
  "Security Gateway",
  "Gateway Routing",
  "Message Normalization",
  "Intake Orchestration",
] as const);

const EXPECTED_RELATIONSHIPS = Object.freeze([
  "ExecutiveGatewaySuite-SuiteIdentity",
  "ExecutiveGatewaySuite-SuiteComposition",
  "SuiteComposition-SuiteComponent",
  "SuiteComponent-SuiteComponentIdentity",
  "SuiteComponent-SuiteDependency",
  "SuiteComponent-SuitePlatformReference",
  "ExecutiveGatewaySuite-SuiteCapability",
  "ExecutiveGatewaySuite-SuiteContract",
  "ExecutiveGatewaySuite-SuiteLifecycle",
  "ExecutiveGatewaySuite-SuitePolicy",
  "ExecutiveGatewaySuite-SuiteInventory",
  "ExecutiveGatewaySuite-SuiteMetadata",
  "ExecutiveGatewaySuite-SuiteStatus",
  "ExecutiveGatewaySuite-SuiteVersion",
  "ExecutiveGatewaySuite-SuiteReadiness",
  "ExecutiveGatewaySuite-SuitePublicApiInventory",
  "ExecutiveGatewaySuite-SuiteValidationTarget",
  "ExecutiveGatewaySuite-SuiteRelationship",
  "SuiteSummary-ExecutiveGatewaySuite",
  "SuiteSummary-SuitePublicApiInventory",
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

describe("NEA-8:3 Executive Gateway Suite Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA83_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA83_FILES) {
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
      ExecutiveGatewaySuiteModelId,
      "NEA-8:3/ExecutiveGatewaySuiteModel",
    );
    assert.equal(ExecutiveGatewaySuiteModelVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteModelName,
      "Executive Gateway Suite Model",
    );
    assert.equal(
      ExecutiveGatewaySuiteModelNamespace,
      "nexora.nea.executive-gateway-suite.model",
    );
    assert.equal(ExecutiveGatewaySuiteModelStatus, "Model");
    assert.equal(ExecutiveGatewaySuiteModelReadiness, "ReadyForValidation");
    assert.equal(ExecutiveGatewaySuiteModelPlatform.identity.phase, "NEA-8:3");
    assert.equal(ExecutiveGatewaySuiteModelPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.identity.registryId,
      ExecutiveGatewaySuiteRegistryId,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.nextPhase,
      "NEA-8:4 — Executive Gateway Suite Validation",
    );
  });

  it("consumes only Registry and preserves canonical references", () => {
    const dependency = ExecutiveGatewaySuiteModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteRegistry.ts",
    );
    assert.equal(dependency.registryId, ExecutiveGatewaySuiteRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.nea1ThroughNea7InternalImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.registryPlatform,
      ExecutiveGatewaySuiteRegistryPlatform,
    );

    const anchors =
      ExecutiveGatewaySuiteModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.componentCount,
      ExecutiveGatewaySuiteRegistryPlatform.collections.componentCount,
    );
    assert.equal(
      anchors.capabilityCount,
      ExecutiveGatewaySuiteRegistryPlatform.capabilities.capabilityCount,
    );
    assert.equal(
      anchors.publicApiInventoryTotal,
      ExecutiveGatewaySuiteRegistryPlatform.collections.publicApiInventoryTotal,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.metadata.canonicalReferenceMode,
      "RegistryCollectionsOnly",
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.metadata.duplicatesRegistryValues,
      false,
    );
  });

  it("declares exactly twenty domain model kinds", () => {
    const { domainModels } = ExecutiveGatewaySuiteModelPlatform;
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
  });

  it("projects exactly seven suite component instances from Registry", () => {
    const { domainModels } = ExecutiveGatewaySuiteModelPlatform;
    assert.equal(domainModels.suiteComponentModelCount, 7);
    assert.deepEqual(
      domainModels.suiteComponentModels.map((item) => item.componentId),
      [...EXPECTED_COMPONENT_IDS],
    );
    assert.deepEqual(
      domainModels.suiteComponentModels.map((item) => item.componentName),
      [...EXPECTED_COMPONENT_NAMES],
    );
    assert.ok(
      domainModels.suiteComponentModels.every(
        (item) => item.modelKind === "SuiteComponent",
      ),
    );
    assert.ok(
      domainModels.suiteComponentModels.every(
        (item) =>
          item.publicPlatform ===
          ExecutiveGatewaySuiteRegistryPlatform.collections.components[
            item.deterministicOrder - 1
          ]!.publicPlatform,
      ),
    );
    assert.equal(domainModels.suiteComponentIdentityModelCount, 7);
    assert.equal(domainModels.suitePlatformReferenceModelCount, 7);
    assert.ok(
      domainModels.suiteComponentIdentityModels.every(
        (item) =>
          item.releaseStatus === "Released" &&
          item.certificationStatus === "Certified" &&
          item.freezeStatus === "Frozen" &&
          item.consumerReadiness === "ReadyForConsumer",
      ),
    );
  });

  it("declares exactly twenty relationships and model lifecycle", () => {
    const { relationships, lifecycle } = ExecutiveGatewaySuiteModelPlatform;
    assert.equal(relationships.relationshipCount, 20);
    assert.deepEqual(
      relationships.relationships.map((item) =>
        item.relationshipId.split("/").at(-1),
      ),
      [...EXPECTED_RELATIONSHIPS],
    );
    assert.equal(relationships.executesRelationships, false);
    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 6);
    assert.equal(lifecycle.currentState, "Published");
    assert.equal(lifecycle.runtimeStateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewaySuiteModelPlatform;
    assert.ok(ownership.owns.includes("Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Model Lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsRegistryCollections, false);
    assert.equal(ownership.ownsRuntimeGateway, false);
    assert.equal(ownership.ownsDkl, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeGateway, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteModelPlatform;
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

  it("derives deterministic summary with canonical public API inventory of 532", () => {
    const summaryA = getExecutiveGatewaySuiteModelSummary();
    const summaryB = getExecutiveGatewaySuiteModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, ExecutiveGatewaySuiteModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, ExecutiveGatewaySuiteRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.suiteComponentModelCount, 7);
    assert.equal(summaryA.relationshipCount, 20);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuiteRegistryPlatform.collections.publicApiInventoryTotal,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:4 — Executive Gateway Suite Validation",
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.metadata.countsHardcoded,
      false,
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.readiness
        .claimsRuntimeGatewayImplemented,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteModelPlatform.runtimeBehavior, false);
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.implementsRuntimeConnectors,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.implementsRuntimeSessions,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.implementsRuntimeSecurity,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteModelPlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuiteModelPlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteModelPlatform.invokesAssistant, false);
    assert.equal(ExecutiveGatewaySuiteModelPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewaySuiteModelPlatform.businessLogic, false);
  });
});
