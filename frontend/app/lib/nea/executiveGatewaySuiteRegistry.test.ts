/**
 * NEA-8:2 — Executive Gateway Suite Registry Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuiteFoundationId,
  ExecutiveGatewaySuiteFoundationPlatform,
} from "./executiveGatewaySuiteFoundation.ts";
import * as RegistryModule from "./executiveGatewaySuiteRegistry.ts";
import {
  ExecutiveGatewaySuiteRegistryId,
  ExecutiveGatewaySuiteRegistryName,
  ExecutiveGatewaySuiteRegistryNamespace,
  ExecutiveGatewaySuiteRegistryPlatform,
  ExecutiveGatewaySuiteRegistryReadiness,
  ExecutiveGatewaySuiteRegistryStatus,
  ExecutiveGatewaySuiteRegistryVersion,
  getExecutiveGatewaySuiteRegistrySummary,
} from "./executiveGatewaySuiteRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA82_FILES = Object.freeze([
  "executiveGatewaySuiteRegistryTypes.ts",
  "executiveGatewaySuiteRegistryCollections.ts",
  "executiveGatewaySuiteRegistryPolicies.ts",
  "executiveGatewaySuiteRegistryCapabilities.ts",
  "executiveGatewaySuiteRegistryOwnership.ts",
  "executiveGatewaySuiteRegistryMetadata.ts",
  "executiveGatewaySuiteRegistry.ts",
  "executiveGatewaySuiteRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteRegistryId",
  "ExecutiveGatewaySuiteRegistryVersion",
  "ExecutiveGatewaySuiteRegistryName",
  "ExecutiveGatewaySuiteRegistryNamespace",
  "ExecutiveGatewaySuiteRegistryStatus",
  "ExecutiveGatewaySuiteRegistryReadiness",
  "ExecutiveGatewaySuiteRegistryPlatform",
  "getExecutiveGatewaySuiteRegistrySummary",
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

const EXPECTED_COMPONENTS = Object.freeze([
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

const EXPECTED_STATUSES = Object.freeze([
  "Registered",
  "Certified",
  "Frozen",
  "Released",
  "Deprecated",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "GatewaySuiteComposition",
  "CanonicalReferenceAggregation",
  "PublicPlatformAggregation",
  "ExecutiveGatewayExposure",
  "ConsumerPlatformComposition",
  "InventoryAggregation",
  "ArchitecturePublication",
  "SuiteSummaryDeclaration",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:2 Executive Gateway Suite Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA82_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA82_FILES) {
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
      ExecutiveGatewaySuiteRegistryId,
      "NEA-8:2/ExecutiveGatewaySuiteRegistry",
    );
    assert.equal(ExecutiveGatewaySuiteRegistryVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteRegistryName,
      "Executive Gateway Suite Registry",
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryNamespace,
      "nexora.nea.executive-gateway-suite.registry",
    );
    assert.equal(ExecutiveGatewaySuiteRegistryStatus, "Registry");
    assert.equal(ExecutiveGatewaySuiteRegistryReadiness, "ReadyForModel");
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.identity.phase, "NEA-8:2");
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.identity.foundationId,
      ExecutiveGatewaySuiteFoundationId,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.nextPhase,
      "NEA-8:3 — Executive Gateway Suite Model",
    );
  });

  it("consumes only Foundation and preserves canonical references", () => {
    const dependency = ExecutiveGatewaySuiteRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteFoundation.ts",
    );
    assert.equal(dependency.foundationId, ExecutiveGatewaySuiteFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.nea1ThroughNea7InternalImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.foundationPlatform,
      ExecutiveGatewaySuiteFoundationPlatform,
    );

    const { collections, capabilities } = ExecutiveGatewaySuiteRegistryPlatform;
    assert.equal(
      collections.componentCount,
      ExecutiveGatewaySuiteFoundationPlatform.composition.componentCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      ExecutiveGatewaySuiteFoundationPlatform.capabilities.capabilityCount,
    );
    assert.equal(
      collections.contractCount,
      ExecutiveGatewaySuiteFoundationPlatform.contracts.contractCount,
    );
    assert.equal(
      collections.lifecycleEntryCount,
      ExecutiveGatewaySuiteFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      collections.publicApiInventoryTotal,
      ExecutiveGatewaySuiteFoundationPlatform.inventory.publicApiInventoryTotal,
    );
    assert.ok(
      collections.contracts.every(
        (item) =>
          item.sourcePhase === "NEA-8:1" && item.foundationReference !== null,
      ),
    );
    assert.ok(
      collections.lifecycleEntries.every(
        (item) =>
          item.sourcePhase === "NEA-8:1" && item.foundationReference !== null,
      ),
    );
    assert.ok(
      capabilities.capabilities.every(
        (item) =>
          item.sourcePhase === "NEA-8:1" && item.foundationReference !== null,
      ),
    );
    assert.equal(capabilities.duplicatesFoundationValues, false);
  });

  it("registers exactly seven suite components with Public Index identities", () => {
    const { collections } = ExecutiveGatewaySuiteRegistryPlatform;
    assert.equal(collections.componentCount, 7);
    assert.equal(collections.componentIdentityCount, 7);
    assert.deepEqual(
      collections.components.map((item) => item.componentId),
      [...EXPECTED_COMPONENTS],
    );
    assert.deepEqual(
      collections.components.map((item) => item.componentName),
      [...EXPECTED_COMPONENT_NAMES],
    );
    assertUnique(
      collections.components.map((item) => item.componentId),
      "component ids",
    );
    assert.ok(
      collections.components.every((item) => item.ownership === "Referenced"),
    );
    assert.ok(
      collections.components.every(
        (item) => item.registrationStatus === "Registered",
      ),
    );
    assert.ok(
      collections.components.every(
        (item) =>
          item.publicPlatform ===
          ExecutiveGatewaySuiteFoundationPlatform.composition.components[
            item.deterministicOrder - 1
          ]!.publicPlatform,
      ),
    );

    assert.ok(
      collections.componentIdentities.every(
        (item) =>
          item.releaseStatus === "Released" &&
          item.certificationStatus === "Certified" &&
          item.freezeStatus === "Frozen" &&
          item.consumerReadiness === "ReadyForConsumer",
      ),
    );
    assert.ok(
      collections.componentIdentities.every(
        (item) => item.foundationReference !== null,
      ),
    );
    assert.deepEqual(
      collections.componentIdentities.map((item) => item.namespace),
      ExecutiveGatewaySuiteFoundationPlatform.composition.components.map(
        (item) => item.publicIndexNamespace,
      ),
    );
    assert.deepEqual(
      collections.componentIdentities.map((item) => item.version),
      ExecutiveGatewaySuiteFoundationPlatform.composition.components.map(
        (item) => item.publicIndexVersion,
      ),
    );
  });

  it("declares dependencies, statuses, and capabilities without Foundation duplication", () => {
    const { collections, capabilities } = ExecutiveGatewaySuiteRegistryPlatform;
    assert.equal(collections.dependencyCount, 7);
    assert.equal(collections.dependencies[0]!.dependsOnComponentId, null);
    assert.equal(
      collections.dependencies[1]!.dependsOnComponentId,
      "NEA-1",
    );
    assert.equal(
      collections.dependencies[6]!.dependsOnComponentId,
      "NEA-6",
    );
    assert.ok(
      collections.dependencies.every(
        (item) =>
          item.dependencyMode === "DeclarativeOnly" &&
          item.resolvesRuntime === false,
      ),
    );

    assert.equal(collections.statusCount, 5);
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.ok(
      collections.statuses.every(
        (item) =>
          item.sourcePhase === "NEA-8:2" && item.foundationReference === null,
      ),
    );

    assert.equal(capabilities.capabilityCount, 8);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.id),
      [...EXPECTED_CAPABILITIES],
    );
  });

  it("declares ownership, policies, and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries, policies } =
      ExecutiveGatewaySuiteRegistryPlatform;
    assert.ok(ownership.owns.includes("Suite Registry"));
    assert.ok(ownership.owns.includes("Component Registry"));
    assert.ok(ownership.owns.includes("Dependency Registry"));
    assert.ok(ownership.owns.includes("Registry Metadata"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsRuntimeGateway, false);
    assert.equal(ownership.ownsDkl, false);
    assert.equal(ownership.ownsFoundationCapabilities, false);

    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeGateway, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.components), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary with canonical public API inventory of 532", () => {
    const summaryA = getExecutiveGatewaySuiteRegistrySummary();
    const summaryB = getExecutiveGatewaySuiteRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, ExecutiveGatewaySuiteRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, ExecutiveGatewaySuiteFoundationId);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.componentIdentityCount, 7);
    assert.equal(summaryA.dependencyCount, 7);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.contractCount, 12);
    assert.equal(summaryA.lifecycleEntryCount, 9);
    assert.equal(summaryA.registryPolicyCount, 8);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuiteFoundationPlatform.inventory.publicApiInventoryTotal,
    );
    // inherited: 7+7+8+12+9 = 43; created: 7+5+8 = 20; total = 63
    assert.equal(summaryA.totalRegistryEntryCount, 63);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:3 — Executive Gateway Suite Model",
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.metadata.inheritedEntryCount,
      43,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.metadata.createdEntryCount,
      20,
    );
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.readiness
        .claimsRuntimeGatewayImplemented,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.runtimeBehavior, false);
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeConnectors,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeSessions,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeSecurity,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.implementsRuntimeOperations,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuiteRegistryPlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.invokesAssistant, false);
    assert.equal(ExecutiveGatewaySuiteRegistryPlatform.aiReasoning, false);
  });
});
