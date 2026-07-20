/**
 * NEA-5:5 — Gateway Routing Manifest Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./gatewayRoutingManifest.ts";
import {
  GatewayRoutingManifestId,
  GatewayRoutingManifestName,
  GatewayRoutingManifestNamespace,
  GatewayRoutingManifestPlatform,
  GatewayRoutingManifestReadiness,
  GatewayRoutingManifestStatus,
  GatewayRoutingManifestVersion,
  getGatewayRoutingManifestSummary,
} from "./gatewayRoutingManifest.ts";
import {
  GatewayRoutingValidationId,
  GatewayRoutingValidationPlatform,
} from "./gatewayRoutingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA55_FILES = Object.freeze([
  "gatewayRoutingManifestTypes.ts",
  "gatewayRoutingManifestInventory.ts",
  "gatewayRoutingManifestMetadata.ts",
  "gatewayRoutingManifestOwnership.ts",
  "gatewayRoutingManifestReadiness.ts",
  "gatewayRoutingManifestSummary.ts",
  "gatewayRoutingManifest.ts",
  "gatewayRoutingManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingManifestId",
  "GatewayRoutingManifestVersion",
  "GatewayRoutingManifestName",
  "GatewayRoutingManifestNamespace",
  "GatewayRoutingManifestStatus",
  "GatewayRoutingManifestReadiness",
  "GatewayRoutingManifestPlatform",
  "getGatewayRoutingManifestSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const EXPECTED_INVENTORY_KEYS = Object.freeze([
  "routingContracts",
  "routingDestinations",
  "routingDecisions",
  "routingContexts",
  "routingCapabilities",
  "routingLifecycle",
  "routeIdentities",
  "routingStrategies",
  "routingPriorities",
  "routingStatuses",
  "routingResults",
  "routingPolicies",
  "domainModels",
  "modelRelationships",
  "validationCategories",
  "validationRules",
  "validationRelationships",
  "manifestMetadata",
  "ownership",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:5 Gateway Routing Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA55_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA55_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical manifest identity, status Manifest, and ReadyForPlatform", () => {
    assert.equal(
      GatewayRoutingManifestId,
      "NEA-5:5/GatewayRoutingManifest",
    );
    assert.equal(GatewayRoutingManifestVersion, "1.0.0");
    assert.equal(
      GatewayRoutingManifestName,
      "Gateway Routing Manifest",
    );
    assert.equal(
      GatewayRoutingManifestNamespace,
      "nexora.nea.gateway-routing.manifest",
    );
    assert.equal(GatewayRoutingManifestStatus, "Manifest");
    assert.equal(GatewayRoutingManifestReadiness, "ReadyForPlatform");
    assert.equal(GatewayRoutingManifestPlatform.identity.phase, "NEA-5:5");
    assert.equal(
      GatewayRoutingManifestPlatform.identity.validationId,
      GatewayRoutingValidationId,
    );
    assert.equal(
      GatewayRoutingManifestPlatform.nextPhase,
      "NEA-5:6 — Gateway Routing Platform",
    );
  });

  it("consumes only NEA-5:4 Validation and preserves the canonical phase chain", () => {
    const dependency = GatewayRoutingManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingValidation.ts",
    );
    assert.equal(dependency.validationId, GatewayRoutingValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      GatewayRoutingManifestPlatform.validationPlatform,
      GatewayRoutingValidationPlatform,
    );

    const phases = GatewayRoutingManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.equal(phases[0]?.module, "gatewayRoutingFoundation.ts");
    assert.equal(phases[1]?.module, "gatewayRoutingRegistry.ts");
    assert.equal(phases[2]?.module, "gatewayRoutingModel.ts");
    assert.equal(phases[3]?.module, "gatewayRoutingValidation.ts");
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("derives all inventory counts from canonical upstream collections", () => {
    const inventory = GatewayRoutingManifestPlatform.inventory;
    const validation = GatewayRoutingValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;

    assert.equal(inventory.inventoryEntryCount, 20);
    assert.deepEqual(
      inventory.inventory.map((item) => item.inventoryKey),
      [...EXPECTED_INVENTORY_KEYS],
    );
    assertUnique(
      inventory.inventory.map((item) => item.inventoryKey),
      "inventory keys",
    );
    assert.ok(inventory.inventory.every((item) => item.hardcoded === false));
    assert.ok(
      inventory.inventory.every((item) => item.reconstructed === false),
    );
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);

    const byKey = Object.fromEntries(
      inventory.inventory.map((item) => [item.inventoryKey, item.count]),
    );
    assert.equal(byKey.routingContracts, foundation.contracts.contractCount);
    assert.equal(
      byKey.routingDestinations,
      foundation.destinations.destinationCount,
    );
    assert.equal(
      byKey.routingDecisions,
      foundation.destinations.decisionCount,
    );
    assert.equal(
      byKey.routingContexts,
      foundation.destinations.contextDimensionCount,
    );
    assert.equal(
      byKey.routingCapabilities,
      foundation.capabilities.capabilityCount,
    );
    assert.equal(byKey.routingLifecycle, foundation.lifecycle.stateCount);
    assert.equal(
      byKey.routeIdentities,
      registry.collections.routeIdentityCount,
    );
    assert.equal(byKey.routingStrategies, registry.collections.strategyCount);
    assert.equal(byKey.routingPriorities, registry.collections.priorityCount);
    assert.equal(byKey.routingStatuses, registry.collections.statusCount);
    assert.equal(byKey.routingResults, registry.collections.resultCount);
    assert.equal(
      byKey.routingPolicies,
      registry.collections.routingPolicyCount,
    );
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.validationCategories, validation.categories.length);
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(
      byKey.validationRelationships,
      validation.relationships.relationshipCount,
    );
    assert.equal(byKey.manifestMetadata, validation.policies.policyCount);
    assert.equal(
      byKey.ownership,
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
    );
    assert.equal(
      byKey.publicExports,
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
    );

    const expectedTotal = inventory.inventory.reduce(
      (total, entry) => total + entry.count,
      0,
    );
    assert.equal(inventory.totalArchitectureCount, expectedTotal);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Publication"));
    assert.ok(ownership.owns.includes("Manifest Summary"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsRuntimeRouting, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
    assert.equal(boundaries.redefinesPriorPhases, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingManifestPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.phaseReferences), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.inventory.inventory), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
    assert.equal(Object.isFrozen(platform.summary), true);
  });

  it("derives deterministic summary from canonical inventory collections", () => {
    const summaryA = getGatewayRoutingManifestSummary();
    const summaryB = getGatewayRoutingManifestSummary();
    const meta = GatewayRoutingManifestPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, GatewayRoutingManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, GatewayRoutingValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(
      summaryA.totalArchitectureCount,
      GatewayRoutingManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:6 — Gateway Routing Platform",
    );
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.compositionMode, "CanonicalReferenceOnly");
    assert.equal(meta.architectureVersion, "NEA-5.0.0");
    assert.equal(meta.duplicatesUpstreamCollections, false);
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      GatewayRoutingManifestPlatform.readiness.architectureCompleteThroughValidation,
      true,
    );
    assert.equal(
      GatewayRoutingManifestPlatform.readiness.claimsReadyForCertification,
      false,
    );
    assert.equal(
      GatewayRoutingManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(GatewayRoutingManifestPlatform.runtimeBehavior, false);
    assert.equal(GatewayRoutingManifestPlatform.validationExecution, false);
    assert.equal(
      GatewayRoutingManifestPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingManifestPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(GatewayRoutingManifestPlatform.executesStrategies, false);
    assert.equal(GatewayRoutingManifestPlatform.aiReasoning, false);
  });
});
