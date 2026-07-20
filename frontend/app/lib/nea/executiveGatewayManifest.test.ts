/**
 * NEA-1:5 — Executive Gateway Manifest Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayValidationId,
  ExecutiveGatewayValidationPlatform,
} from "./executiveGatewayValidation.ts";
import * as ManifestModule from "./executiveGatewayManifest.ts";
import {
  ExecutiveGatewayManifestId,
  ExecutiveGatewayManifestName,
  ExecutiveGatewayManifestNamespace,
  ExecutiveGatewayManifestPlatform,
  ExecutiveGatewayManifestReadiness,
  ExecutiveGatewayManifestStatus,
  ExecutiveGatewayManifestVersion,
  getExecutiveGatewayManifestSummary,
} from "./executiveGatewayManifest.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA15_FILES = Object.freeze([
  "executiveGatewayManifestTypes.ts",
  "executiveGatewayManifestInventory.ts",
  "executiveGatewayManifestMetadata.ts",
  "executiveGatewayManifestOwnership.ts",
  "executiveGatewayManifestReadiness.ts",
  "executiveGatewayManifestSummary.ts",
  "executiveGatewayManifest.ts",
  "executiveGatewayManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayManifestId",
  "ExecutiveGatewayManifestVersion",
  "ExecutiveGatewayManifestName",
  "ExecutiveGatewayManifestNamespace",
  "ExecutiveGatewayManifestStatus",
  "ExecutiveGatewayManifestReadiness",
  "ExecutiveGatewayManifestPlatform",
  "getExecutiveGatewayManifestSummary",
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
  "sourceFamilies",
  "channelTypes",
  "interactionModalities",
  "senderKinds",
  "authenticationMethods",
  "authorizationStatuses",
  "trustLevels",
  "consentStatuses",
  "validationCategories",
  "validationRules",
  "domainModels",
  "modelRelationships",
  "lifecycleStates",
  "capabilities",
  "policies",
  "routingDestinations",
  "diagnostics",
  "ownership",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:5 Executive Gateway Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA15_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA15_FILES) {
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
      ExecutiveGatewayManifestId,
      "NEA-1:5/ExecutiveGatewayManifest",
    );
    assert.equal(ExecutiveGatewayManifestVersion, "1.0.0");
    assert.equal(ExecutiveGatewayManifestName, "Executive Gateway Manifest");
    assert.equal(
      ExecutiveGatewayManifestNamespace,
      "nexora.nea.executive-gateway.manifest",
    );
    assert.equal(ExecutiveGatewayManifestStatus, "Manifest");
    assert.equal(ExecutiveGatewayManifestReadiness, "ReadyForPlatform");
    assert.equal(ExecutiveGatewayManifestPlatform.identity.phase, "NEA-1:5");
    assert.equal(ExecutiveGatewayManifestPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayManifestPlatform.identity.validationId,
      ExecutiveGatewayValidationId,
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.nextPhase,
      "NEA-1:6 — Executive Gateway Platform",
    );
  });

  it("consumes only NEA-1:4 Validation and preserves canonical phase references", () => {
    const dependency = ExecutiveGatewayManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(dependency.validationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayValidation.ts",
    );
    assert.equal(dependency.validationId, ExecutiveGatewayValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      ExecutiveGatewayManifestPlatform.validationPlatform,
      ExecutiveGatewayValidationPlatform,
    );

    const refs = ExecutiveGatewayManifestPlatform.phaseReferences;
    assert.equal(refs.length, 4);
    assert.deepEqual(
      refs.map((item) => item.module),
      [
        "executiveGatewayFoundation.ts",
        "executiveGatewayRegistry.ts",
        "executiveGatewayModel.ts",
        "executiveGatewayValidation.ts",
      ],
    );
    assert.ok(refs.every((item) => item.ownership === "Referenced"));
    assert.ok(refs.every((item) => item.reconstructsPhase === false));
    assert.ok(refs.every((item) => item.duplicatesInventory === false));
  });

  it("derives architecture inventory from canonical upstream collections", () => {
    const inventory = ExecutiveGatewayManifestPlatform.inventory;
    assert.equal(inventory.inventoryEntryCount, 19);
    assert.deepEqual(
      inventory.inventory.map((item) => item.inventoryKey),
      [...EXPECTED_INVENTORY_KEYS],
    );
    assertUnique(
      inventory.inventory.map((item) => item.inventoryKey),
      "inventory keys",
    );
    assert.ok(inventory.inventory.every((item) => item.hardcoded === false));
    assert.ok(inventory.inventory.every((item) => item.reconstructed === false));
    assert.ok(inventory.inventory.every((item) => item.ownership === "Referenced"));
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.reconstructed, false);
    assert.equal(inventory.duplicatesUpstreamCollections, false);

    const validation = ExecutiveGatewayValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;

    const byKey = (key: string) =>
      inventory.inventory.find((item) => item.inventoryKey === key)!;

    assert.equal(
      byKey("sourceFamilies").count,
      registry.collections.sourceFamilies.length,
    );
    assert.equal(
      byKey("channelTypes").count,
      registry.collections.channels.length,
    );
    assert.equal(
      byKey("domainModels").count,
      model.domainModels.modelCount,
    );
    assert.equal(
      byKey("validationRules").count,
      validation.rules.ruleCount,
    );
    assert.equal(
      byKey("validationCategories").count,
      validation.categories.length,
    );
    assert.equal(
      byKey("capabilities").count,
      registry.capabilities.capabilityCount,
    );
    assert.ok(inventory.totalArchitectureCount > 0);
    assert.equal(
      inventory.totalArchitectureCount,
      inventory.inventory.reduce((total, entry) => total + entry.count, 0),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Aggregation"));
    assert.ok(ownership.owns.includes("Phase References"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsValidationRules, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.executesValidation, false);
    assert.equal(boundaries.executesRouting, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
    assert.equal(boundaries.redefinesPriorPhases, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayManifestPlatform;
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

  it("returns deterministic summary ready for Platform", () => {
    const summaryA = getExecutiveGatewayManifestSummary();
    const summaryB = getExecutiveGatewayManifestSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, ExecutiveGatewayManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, ExecutiveGatewayValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 19);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.totalArchitectureCount,
      ExecutiveGatewayManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:6 — Executive Gateway Platform",
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.metadata.duplicatesUpstreamCollections,
      false,
    );
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.readiness.claimsReadyForCertification,
      false,
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ExecutiveGatewayManifestPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayManifestPlatform.validationExecution, false);
    assert.equal(ExecutiveGatewayManifestPlatform.routingExecution, false);
    assert.equal(
      ExecutiveGatewayManifestPlatform.authenticationExecution,
      false,
    );
    assert.equal(
      ExecutiveGatewayManifestPlatform.authorizationExecution,
      false,
    );
    assert.equal(ExecutiveGatewayManifestPlatform.aiReasoning, false);
    assert.equal(
      ExecutiveGatewayManifestPlatform.persistenceBehavior,
      false,
    );
  });
});
