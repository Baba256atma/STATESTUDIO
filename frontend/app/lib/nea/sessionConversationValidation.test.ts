/**
 * NEA-3:4 — Session & Conversation Validation Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SessionConversationModelId,
  SessionConversationModelPlatform,
} from "./sessionConversationModel.ts";
import * as ValidationModule from "./sessionConversationValidation.ts";
import {
  SessionConversationValidationId,
  SessionConversationValidationName,
  SessionConversationValidationNamespace,
  SessionConversationValidationPlatform,
  SessionConversationValidationReadiness,
  SessionConversationValidationStatus,
  SessionConversationValidationVersion,
  getSessionConversationValidationSummary,
} from "./sessionConversationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA34_FILES = Object.freeze([
  "sessionConversationValidationTypes.ts",
  "sessionConversationValidationRules.ts",
  "sessionConversationValidationPolicies.ts",
  "sessionConversationValidationRelationships.ts",
  "sessionConversationValidationMetadata.ts",
  "sessionConversationValidationOwnership.ts",
  "sessionConversationValidation.ts",
  "sessionConversationValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationValidationId",
  "SessionConversationValidationVersion",
  "SessionConversationValidationName",
  "SessionConversationValidationNamespace",
  "SessionConversationValidationStatus",
  "SessionConversationValidationReadiness",
  "SessionConversationValidationPlatform",
  "getSessionConversationValidationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  "SessionIdentity",
  "ConversationIdentity",
  "Session",
  "Conversation",
  "Participant",
  "MessageReference",
  "Context",
  "Correlation",
  "Trace",
  "SessionState",
  "ConversationState",
  "ConversationType",
  "SessionMetadata",
  "ConversationMetadata",
  "Configuration",
  "Diagnostics",
  "Result",
  "Summary",
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:4 Session & Conversation Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA34_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA34_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical validation identity, status Validation, and ReadyForManifest", () => {
    assert.equal(
      SessionConversationValidationId,
      "NEA-3:4/SessionConversationValidation",
    );
    assert.equal(SessionConversationValidationVersion, "1.0.0");
    assert.equal(
      SessionConversationValidationName,
      "Session & Conversation Validation",
    );
    assert.equal(
      SessionConversationValidationNamespace,
      "nexora.nea.session-conversation.validation",
    );
    assert.equal(SessionConversationValidationStatus, "Validation");
    assert.equal(SessionConversationValidationReadiness, "ReadyForManifest");
    assert.equal(
      SessionConversationValidationPlatform.identity.phase,
      "NEA-3:4",
    );
    assert.equal(
      SessionConversationValidationPlatform.identity.modelId,
      SessionConversationModelId,
    );
    assert.equal(
      SessionConversationValidationPlatform.nextPhase,
      "NEA-3:5 — Session & Conversation Manifest",
    );
  });

  it("consumes only NEA-3:3 Model and preserves Model references", () => {
    const dependency = SessionConversationValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationModel.ts",
    );
    assert.equal(dependency.modelId, SessionConversationModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      SessionConversationValidationPlatform.modelPlatform,
      SessionConversationModelPlatform,
    );

    const anchors = SessionConversationValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      SessionConversationModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.sessionIdentityModelCount,
      SessionConversationModelPlatform.domainModels.sessionIdentityModelCount,
    );
    assert.equal(
      anchors.conversationIdentityModelCount,
      SessionConversationModelPlatform.domainModels
        .conversationIdentityModelCount,
    );
    assert.equal(anchors.preservesCanonicalModelReferences, true);
    assert.equal(anchors.duplicatesModelValues, false);
  });

  it("declares twenty categories and unique validation rules", () => {
    const { categories, rules } = SessionConversationValidationPlatform;
    assert.equal(categories.length, 20);
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assertUnique(
      categories.map((item) => item.categoryId),
      "category ids",
    );
    assert.ok(
      categories.every((item) => item.executesValidation === false),
    );

    assert.equal(rules.ruleCount, 58);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(rules.rules.every((item) => item.executesValidation === false));
    assert.ok(
      rules.rules.every((item) =>
        item.modelReference.startsWith(SessionConversationModelId),
      ),
    );
    assert.equal(rules.executesValidation, false);
  });

  it("declares validation relationships and policies without runtime execution", () => {
    const { relationships, policies } = SessionConversationValidationPlatform;
    assert.equal(relationships.relationshipCount, 25);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.ok(
      relationships.relationships.every(
        (item) => item.executesValidation === false,
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceCategoryId === "Conversation" &&
          item.targetCategoryId === "Session",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceCategoryId === "MessageReference" &&
          item.targetCategoryId === "Correlation",
      ),
    );

    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SessionConversationValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.equal(ownership.ownsRuntimeValidation, false);
    assert.equal(ownership.ownsValidationEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.duplicatesModelValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationValidationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.categories), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.rules.rules), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical validation collections", () => {
    const summaryA = getSessionConversationValidationSummary();
    const summaryB = getSessionConversationValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, SessionConversationValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, SessionConversationModelId);
    assert.equal(summaryA.categoryCount, 20);
    assert.equal(summaryA.ruleCount, 58);
    assert.equal(summaryA.relationshipCount, 25);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:5 — Session & Conversation Manifest",
    );
    assert.equal(
      SessionConversationValidationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      SessionConversationValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      SessionConversationValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      SessionConversationValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(SessionConversationValidationPlatform.runtimeBehavior, false);
    assert.equal(SessionConversationValidationPlatform.validationEngine, false);
    assert.equal(
      SessionConversationValidationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      SessionConversationValidationPlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(
      SessionConversationValidationPlatform.processesMessages,
      false,
    );
    assert.equal(SessionConversationValidationPlatform.aiReasoning, false);
  });
});
