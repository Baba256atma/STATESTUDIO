/**
 * NEA-6:5 — Message Normalization Manifest Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./messageNormalizationManifest.ts";
import {
  MessageNormalizationManifestId,
  MessageNormalizationManifestName,
  MessageNormalizationManifestNamespace,
  MessageNormalizationManifestPlatform,
  MessageNormalizationManifestReadiness,
  MessageNormalizationManifestStatus,
  MessageNormalizationManifestVersion,
  getMessageNormalizationManifestSummary,
} from "./messageNormalizationManifest.ts";
import {
  MessageNormalizationValidationId,
  MessageNormalizationValidationPlatform,
} from "./messageNormalizationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA65_FILES = Object.freeze([
  "messageNormalizationManifestTypes.ts",
  "messageNormalizationManifestInventory.ts",
  "messageNormalizationManifestMetadata.ts",
  "messageNormalizationManifestOwnership.ts",
  "messageNormalizationManifestReadiness.ts",
  "messageNormalizationManifestSummary.ts",
  "messageNormalizationManifest.ts",
  "messageNormalizationManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationManifestId",
  "MessageNormalizationManifestVersion",
  "MessageNormalizationManifestName",
  "MessageNormalizationManifestNamespace",
  "MessageNormalizationManifestStatus",
  "MessageNormalizationManifestReadiness",
  "MessageNormalizationManifestPlatform",
  "getMessageNormalizationManifestSummary",
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
  "foundationContracts",
  "contextDimensions",
  "attachmentKinds",
  "foundationLifecycle",
  "foundationCapabilities",
  "messageIdentities",
  "payloadTypes",
  "metadataFields",
  "mappingTypes",
  "registryPolicies",
  "registryStatuses",
  "domainModels",
  "modelRelationships",
  "modelLifecycle",
  "validationCategories",
  "validationRules",
  "validationPolicies",
  "validationRelationships",
  "ownership",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:5 Message Normalization Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA65_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA65_FILES) {
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
      MessageNormalizationManifestId,
      "NEA-6:5/MessageNormalizationManifest",
    );
    assert.equal(MessageNormalizationManifestVersion, "1.0.0");
    assert.equal(
      MessageNormalizationManifestName,
      "Message Normalization Manifest",
    );
    assert.equal(
      MessageNormalizationManifestNamespace,
      "nexora.nea.message-normalization.manifest",
    );
    assert.equal(MessageNormalizationManifestStatus, "Manifest");
    assert.equal(MessageNormalizationManifestReadiness, "ReadyForPlatform");
    assert.equal(MessageNormalizationManifestPlatform.identity.phase, "NEA-6:5");
    assert.equal(
      MessageNormalizationManifestPlatform.identity.validationId,
      MessageNormalizationValidationId,
    );
    assert.equal(
      MessageNormalizationManifestPlatform.nextPhase,
      "NEA-6:6 — Message Normalization Platform",
    );
  });

  it("consumes only NEA-6:4 Validation and preserves the canonical phase chain", () => {
    const dependency = MessageNormalizationManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationValidation.ts",
    );
    assert.equal(dependency.validationId, MessageNormalizationValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      MessageNormalizationManifestPlatform.validationPlatform,
      MessageNormalizationValidationPlatform,
    );

    const phases = MessageNormalizationManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.equal(phases[0]?.module, "messageNormalizationFoundation.ts");
    assert.equal(phases[1]?.module, "messageNormalizationRegistry.ts");
    assert.equal(phases[2]?.module, "messageNormalizationModel.ts");
    assert.equal(phases[3]?.module, "messageNormalizationValidation.ts");
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("derives all inventory counts from Validation → Model → Registry → Foundation", () => {
    const inventory = MessageNormalizationManifestPlatform.inventory;
    const validation = MessageNormalizationValidationPlatform;
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
    assert.equal(byKey.foundationContracts, foundation.contracts.contractCount);
    assert.equal(
      byKey.contextDimensions,
      foundation.contexts.contextDimensionCount,
    );
    assert.equal(
      byKey.attachmentKinds,
      foundation.attachments.attachmentKindCount,
    );
    assert.equal(byKey.foundationLifecycle, foundation.lifecycle.stateCount);
    assert.equal(
      byKey.foundationCapabilities,
      foundation.capabilities.capabilityCount,
    );
    assert.equal(
      byKey.messageIdentities,
      registry.collections.messageIdentityCount,
    );
    assert.equal(byKey.payloadTypes, registry.collections.payloadCount);
    assert.equal(byKey.metadataFields, registry.collections.metadataFieldCount);
    assert.equal(byKey.mappingTypes, registry.collections.mappingCount);
    assert.equal(byKey.registryPolicies, registry.policies.policyCount);
    assert.equal(byKey.registryStatuses, registry.collections.statusCount);
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.modelLifecycle, model.lifecycle.stateCount);
    assert.equal(
      byKey.validationCategories,
      validation.rules.domainCategoryCount,
    );
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(byKey.validationPolicies, validation.policies.policyCount);
    assert.equal(
      byKey.validationRelationships,
      validation.relationships.relationshipCount,
    );
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
    const { ownership, boundaries } = MessageNormalizationManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Publication"));
    assert.ok(ownership.owns.includes("Manifest Summary"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsRuntimeNormalization, false);

    assert.ok(
      boundaries.prohibitedSurfaces.includes("Runtime Normalization"),
    );
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
    assert.equal(boundaries.redefinesPriorPhases, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationManifestPlatform;
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
    const summaryA = getMessageNormalizationManifestSummary();
    const summaryB = getMessageNormalizationManifestSummary();
    const meta = MessageNormalizationManifestPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, MessageNormalizationManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, MessageNormalizationValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(
      summaryA.totalArchitectureCount,
      MessageNormalizationManifestPlatform.inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:6 — Message Normalization Platform",
    );
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.compositionMode, "CanonicalReferenceOnly");
    assert.equal(meta.architectureVersion, "NEA-6.0.0");
    assert.equal(meta.duplicatesUpstreamCollections, false);
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      MessageNormalizationManifestPlatform.readiness
        .architectureCompleteThroughValidation,
      true,
    );
    assert.equal(
      MessageNormalizationManifestPlatform.readiness.claimsReadyForCertification,
      false,
    );
    assert.equal(
      MessageNormalizationManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(MessageNormalizationManifestPlatform.runtimeBehavior, false);
    assert.equal(
      MessageNormalizationManifestPlatform.validationExecution,
      false,
    );
    assert.equal(
      MessageNormalizationManifestPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationManifestPlatform.parsesPayloads, false);
    assert.equal(MessageNormalizationManifestPlatform.aiReasoning, false);
  });
});
