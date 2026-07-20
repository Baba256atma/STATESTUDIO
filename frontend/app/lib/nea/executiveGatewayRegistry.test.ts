/**
 * NEA-1:2 — Executive Gateway Registry Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationPlatform,
} from "./executiveGatewayFoundation.ts";
import * as RegistryModule from "./executiveGatewayRegistry.ts";
import {
  ExecutiveGatewayRegistryId,
  ExecutiveGatewayRegistryName,
  ExecutiveGatewayRegistryNamespace,
  ExecutiveGatewayRegistryPlatform,
  ExecutiveGatewayRegistryReadiness,
  ExecutiveGatewayRegistryStatus,
  ExecutiveGatewayRegistryVersion,
  getExecutiveGatewayRegistrySummary,
} from "./executiveGatewayRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA12_FILES = Object.freeze([
  "executiveGatewayRegistryTypes.ts",
  "executiveGatewayRegistryCollections.ts",
  "executiveGatewayRegistryPolicies.ts",
  "executiveGatewayRegistryCapabilities.ts",
  "executiveGatewayRegistryOwnership.ts",
  "executiveGatewayRegistryMetadata.ts",
  "executiveGatewayRegistry.ts",
  "executiveGatewayRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayRegistryId",
  "ExecutiveGatewayRegistryVersion",
  "ExecutiveGatewayRegistryName",
  "ExecutiveGatewayRegistryNamespace",
  "ExecutiveGatewayRegistryStatus",
  "ExecutiveGatewayRegistryReadiness",
  "ExecutiveGatewayRegistryPlatform",
  "getExecutiveGatewayRegistrySummary",
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

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:2 Executive Gateway Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA12_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA12_FILES) {
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
      ExecutiveGatewayRegistryId,
      "NEA-1:2/ExecutiveGatewayRegistry",
    );
    assert.equal(ExecutiveGatewayRegistryVersion, "1.0.0");
    assert.equal(ExecutiveGatewayRegistryName, "Executive Gateway Registry");
    assert.equal(
      ExecutiveGatewayRegistryNamespace,
      "nexora.nea.executive-gateway.registry",
    );
    assert.equal(ExecutiveGatewayRegistryStatus, "Registry");
    assert.equal(ExecutiveGatewayRegistryReadiness, "ReadyForModel");
    assert.equal(
      ExecutiveGatewayRegistryPlatform.identity.phase,
      "NEA-1:2",
    );
    assert.equal(ExecutiveGatewayRegistryPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayRegistryPlatform.identity.foundationId,
      ExecutiveGatewayFoundationId,
    );
    assert.equal(
      ExecutiveGatewayRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.equal(
      ExecutiveGatewayRegistryPlatform.nextPhase,
      "NEA-1:3 — Executive Gateway Model",
    );
  });

  it("consumes only NEA-1:1 Foundation public surface", () => {
    const dependency = ExecutiveGatewayRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(dependency.foundationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayFoundation.ts",
    );
    assert.equal(dependency.foundationId, ExecutiveGatewayFoundationId);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.dklInternalImport, false);
    assert.equal(dependency.engineInternalImport, false);
    assert.equal(dependency.assistantInternalImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationInventory, false);
    assert.equal(
      ExecutiveGatewayRegistryPlatform.foundationPlatform,
      ExecutiveGatewayFoundationPlatform,
    );
  });

  it("preserves Foundation canonical collections without duplicates", () => {
    const { collections, capabilities, policies } =
      ExecutiveGatewayRegistryPlatform;
    assert.equal(
      collections.sourceFamilies.length,
      ExecutiveGatewayFoundationPlatform.sources.length,
    );
    assert.equal(
      collections.channels.length,
      ExecutiveGatewayFoundationPlatform.channels.length,
    );
    assert.equal(
      collections.modalities.length,
      ExecutiveGatewayFoundationPlatform.modalities.length,
    );
    assert.equal(
      collections.senders.length,
      ExecutiveGatewayFoundationPlatform.senderKinds.length,
    );
    assert.equal(
      collections.routingDestinations.length,
      ExecutiveGatewayFoundationPlatform.routingDestinations.length,
    );
    assert.equal(
      collections.lifecycleStates.length,
      ExecutiveGatewayFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      ExecutiveGatewayFoundationPlatform.capabilities.capabilityCount,
    );
    assert.equal(
      policies.policyCount,
      ExecutiveGatewayFoundationPlatform.policies.length,
    );

    assert.deepEqual(
      collections.sourceFamilies.map((item) => item.id),
      ExecutiveGatewayFoundationPlatform.sources.map((item) => item.id),
    );
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.id),
      ExecutiveGatewayFoundationPlatform.capabilities.capabilities.map(
        (item) => item.capabilityId,
      ),
    );

    assertUnique(
      collections.sourceFamilies.map((item) => item.id),
      "source family ids",
    );
    assertUnique(
      collections.channels.map((item) => item.id),
      "channel ids",
    );
    assertUnique(
      collections.modalities.map((item) => item.id),
      "modality ids",
    );
    assertUnique(
      collections.senders.map((item) => item.id),
      "sender ids",
    );
    assertUnique(
      collections.authenticationMethods.map((item) => item.id),
      "authentication method ids",
    );
    assertUnique(
      collections.authorizationStatuses.map((item) => item.id),
      "authorization status ids",
    );
    assertUnique(
      collections.trustLevels.map((item) => item.id),
      "trust level ids",
    );
    assertUnique(
      collections.consentStatuses.map((item) => item.id),
      "consent status ids",
    );
    assertUnique(
      collections.validationStatuses.map((item) => item.id),
      "validation status ids",
    );
    assertUnique(
      collections.routingDestinations.map((item) => item.id),
      "routing destination ids",
    );
    assertUnique(
      collections.lifecycleStates.map((item) => item.id),
      "lifecycle state ids",
    );
    assertUnique(
      collections.diagnosticCategories.map((item) => item.id),
      "diagnostic category ids",
    );
    assertUnique(
      capabilities.capabilities.map((item) => item.id),
      "capability ids",
    );
    assertUnique(
      policies.policies.map((item) => item.id),
      "policy ids",
    );
  });

  it("declares registry-owned auth, trust, consent, validation, and diagnostic registries", () => {
    const { collections } = ExecutiveGatewayRegistryPlatform;
    assert.ok(collections.authenticationMethods.length >= 1);
    assert.ok(collections.authorizationStatuses.length >= 1);
    assert.ok(collections.trustLevels.length >= 1);
    assert.ok(collections.consentStatuses.length >= 1);
    assert.ok(collections.validationStatuses.length >= 1);
    assert.ok(collections.diagnosticCategories.length >= 1);
    assert.ok(
      collections.authenticationMethods.every(
        (item) => item.executesRuntime === false,
      ),
    );
    assert.ok(
      collections.diagnosticCategories.every(
        (item) => item.sourcePhase === "NEA-1:2",
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayRegistryPlatform;
    assert.ok(ownership.owns.includes("Registry Definitions"));
    assert.ok(ownership.owns.includes("Canonical Lookup Values"));
    assert.ok(ownership.owns.includes("Capability Registry"));
    assert.ok(ownership.owns.includes("Policy Registry"));
    assert.ok(ownership.doesNotOwn.includes("Gateway Models"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Logic"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsRuntimeLogic, false);
    assert.equal(ownership.ownsConnectors, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeRouting, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.invokesEngine, false);
    assert.equal(boundaries.invokesAssistant, false);
    assert.equal(boundaries.reconstructsFoundation, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.sourceFamilies), true);
    assert.equal(Object.isFrozen(platform.collections.channels), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
  });

  it("derives deterministic inventory counts from canonical collections", () => {
    const summaryA = getExecutiveGatewayRegistrySummary();
    const summaryB = getExecutiveGatewayRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, ExecutiveGatewayRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, ExecutiveGatewayFoundationId);

    const meta = ExecutiveGatewayRegistryPlatform.metadata;
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.countsReconstructed, false);
    assert.equal(meta.countsDuplicated, false);
    assert.equal(summaryA.sourceFamilyCount, meta.sourceFamilyCount);
    assert.equal(summaryA.channelTypeCount, meta.channelTypeCount);
    assert.equal(summaryA.modalityCount, meta.modalityCount);
    assert.equal(summaryA.senderKindCount, meta.senderKindCount);
    assert.equal(
      summaryA.authenticationMethodCount,
      meta.authenticationMethodCount,
    );
    assert.equal(
      summaryA.authorizationStatusCount,
      meta.authorizationStatusCount,
    );
    assert.equal(summaryA.trustLevelCount, meta.trustLevelCount);
    assert.equal(summaryA.consentStatusCount, meta.consentStatusCount);
    assert.equal(summaryA.validationStatusCount, meta.validationStatusCount);
    assert.equal(
      summaryA.routingDestinationCount,
      meta.routingDestinationCount,
    );
    assert.equal(summaryA.lifecycleStateCount, meta.lifecycleStateCount);
    assert.equal(summaryA.capabilityCount, meta.capabilityCount);
    assert.equal(summaryA.policyCount, meta.policyCount);
    assert.equal(
      summaryA.diagnosticCategoryCount,
      meta.diagnosticCategoryCount,
    );
    assert.equal(summaryA.totalRegistryEntryCount, meta.totalEntryCount);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:3 — Executive Gateway Model",
    );
    assert.ok(summaryA.totalRegistryEntryCount > 0);
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayRegistryPlatform.readiness,
      "ReadyForModel",
    );
    assert.notEqual(
      ExecutiveGatewayRegistryPlatform.readiness,
      "ReadyForValidation",
    );
    assert.notEqual(
      ExecutiveGatewayRegistryPlatform.readiness,
      "RuntimeReady",
    );
    assert.equal(ExecutiveGatewayRegistryPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.runtimeRouting, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.runtimeValidation, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.runtimeNormalization, false);
    assert.equal(
      ExecutiveGatewayRegistryPlatform.connectorImplementation,
      false,
    );
    assert.equal(ExecutiveGatewayRegistryPlatform.networkingBehavior, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.persistenceBehavior, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.authenticationEngine, false);
    assert.equal(ExecutiveGatewayRegistryPlatform.authorizationEngine, false);
  });
});
