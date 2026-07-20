/**
 * NEA-3:5 — Session & Conversation Manifest Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./sessionConversationManifest.ts";
import {
  SessionConversationManifestId,
  SessionConversationManifestName,
  SessionConversationManifestNamespace,
  SessionConversationManifestPlatform,
  SessionConversationManifestReadiness,
  SessionConversationManifestStatus,
  SessionConversationManifestVersion,
  getSessionConversationManifestSummary,
} from "./sessionConversationManifest.ts";
import {
  SessionConversationValidationId,
  SessionConversationValidationPlatform,
} from "./sessionConversationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA35_FILES = Object.freeze([
  "sessionConversationManifestTypes.ts",
  "sessionConversationManifestInventory.ts",
  "sessionConversationManifestMetadata.ts",
  "sessionConversationManifestOwnership.ts",
  "sessionConversationManifestReadiness.ts",
  "sessionConversationManifestSummary.ts",
  "sessionConversationManifest.ts",
  "sessionConversationManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationManifestId",
  "SessionConversationManifestVersion",
  "SessionConversationManifestName",
  "SessionConversationManifestNamespace",
  "SessionConversationManifestStatus",
  "SessionConversationManifestReadiness",
  "SessionConversationManifestPlatform",
  "getSessionConversationManifestSummary",
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
  "sessionContracts",
  "conversationContracts",
  "participantRoles",
  "contextDimensions",
  "messageReferenceTypes",
  "correlationTypes",
  "traceTypes",
  "sessionIdentities",
  "conversationIdentities",
  "conversationTypes",
  "sessionStates",
  "conversationStates",
  "capabilities",
  "lifecycleEntries",
  "domainModels",
  "modelRelationships",
  "validationCategories",
  "validationRules",
  "policies",
  "ownership",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:5 Session & Conversation Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA35_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA35_FILES) {
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
      SessionConversationManifestId,
      "NEA-3:5/SessionConversationManifest",
    );
    assert.equal(SessionConversationManifestVersion, "1.0.0");
    assert.equal(
      SessionConversationManifestName,
      "Session & Conversation Manifest",
    );
    assert.equal(
      SessionConversationManifestNamespace,
      "nexora.nea.session-conversation.manifest",
    );
    assert.equal(SessionConversationManifestStatus, "Manifest");
    assert.equal(SessionConversationManifestReadiness, "ReadyForPlatform");
    assert.equal(SessionConversationManifestPlatform.identity.phase, "NEA-3:5");
    assert.equal(
      SessionConversationManifestPlatform.identity.validationId,
      SessionConversationValidationId,
    );
    assert.equal(
      SessionConversationManifestPlatform.nextPhase,
      "NEA-3:6 — Session & Conversation Platform",
    );
  });

  it("consumes only NEA-3:4 Validation and preserves the canonical phase chain", () => {
    const dependency = SessionConversationManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationValidation.ts",
    );
    assert.equal(dependency.validationId, SessionConversationValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SessionConversationManifestPlatform.validationPlatform,
      SessionConversationValidationPlatform,
    );

    const phases = SessionConversationManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.equal(phases[0]?.module, "sessionConversationFoundation.ts");
    assert.equal(phases[1]?.module, "sessionConversationRegistry.ts");
    assert.equal(phases[2]?.module, "sessionConversationModel.ts");
    assert.equal(phases[3]?.module, "sessionConversationValidation.ts");
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("derives all inventory counts from canonical upstream collections", () => {
    const inventory = SessionConversationManifestPlatform.inventory;
    const validation = SessionConversationValidationPlatform;
    const model = validation.modelPlatform;
    const registry = model.registryPlatform;
    const foundation = registry.foundationPlatform;

    assert.equal(inventory.inventoryEntryCount, 21);
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
    assert.equal(byKey.sessionContracts, 4);
    assert.equal(byKey.conversationContracts, 4);
    assert.equal(
      byKey.participantRoles,
      registry.collections.participantRoleCount,
    );
    assert.equal(
      byKey.contextDimensions,
      registry.collections.contextDimensionCount,
    );
    assert.equal(
      byKey.messageReferenceTypes,
      registry.collections.messageReferenceTypeCount,
    );
    assert.equal(
      byKey.correlationTypes,
      registry.collections.correlationTypeCount,
    );
    assert.equal(byKey.traceTypes, registry.collections.traceTypeCount);
    assert.equal(
      byKey.sessionIdentities,
      registry.collections.sessionIdentityCount,
    );
    assert.equal(
      byKey.conversationIdentities,
      registry.collections.conversationIdentityCount,
    );
    assert.equal(
      byKey.conversationTypes,
      registry.collections.conversationTypeCount,
    );
    assert.equal(byKey.sessionStates, registry.collections.sessionStateCount);
    assert.equal(
      byKey.conversationStates,
      registry.collections.conversationStateCount,
    );
    assert.equal(byKey.capabilities, registry.capabilities.capabilityCount);
    assert.equal(
      byKey.lifecycleEntries,
      registry.collections.lifecycleEntryCount,
    );
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.validationCategories, validation.categories.length);
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(
      byKey.policies,
      registry.policies.policyCount + validation.policies.policyCount,
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

    const derivedTotal = inventory.inventory.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    assert.equal(inventory.totalArchitectureCount, derivedTotal);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SessionConversationManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Aggregation"));
    assert.ok(ownership.owns.includes("Phase References"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsRuntimeSessions, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.processesMessages, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationManifestPlatform;
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
    const summaryA = getSessionConversationManifestSummary();
    const summaryB = getSessionConversationManifestSummary();
    const inventory = SessionConversationManifestPlatform.inventory;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, SessionConversationManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, SessionConversationValidationId);
    assert.equal(summaryA.phaseReferenceCount, 4);
    assert.equal(summaryA.inventoryEntryCount, inventory.inventoryEntryCount);
    assert.equal(
      summaryA.totalArchitectureCount,
      inventory.totalArchitectureCount,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:6 — Session & Conversation Platform",
    );
    assert.equal(
      SessionConversationManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationManifestPlatform.metadata.architectureVersion,
      "NEA-3.0.0",
    );
    assert.equal(
      SessionConversationManifestPlatform.metadata.duplicatesUpstreamCollections,
      false,
    );
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      SessionConversationManifestPlatform.readiness
        .architectureCompleteThroughValidation,
      true,
    );
    assert.equal(
      SessionConversationManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(SessionConversationManifestPlatform.runtimeBehavior, false);
    assert.equal(
      SessionConversationManifestPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationManifestPlatform.managesRuntimeConversations,
      false,
    );
    assert.equal(SessionConversationManifestPlatform.processesMessages, false);
    assert.equal(SessionConversationManifestPlatform.validationExecution, false);
    assert.equal(SessionConversationManifestPlatform.aiReasoning, false);
  });
});
