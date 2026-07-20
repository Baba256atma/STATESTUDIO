/**
 * NEA-6:4 — Message Normalization Validation Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationModelId,
  MessageNormalizationModelPlatform,
} from "./messageNormalizationModel.ts";
import * as ValidationModule from "./messageNormalizationValidation.ts";
import {
  MessageNormalizationValidationId,
  MessageNormalizationValidationName,
  MessageNormalizationValidationNamespace,
  MessageNormalizationValidationPlatform,
  MessageNormalizationValidationReadiness,
  MessageNormalizationValidationStatus,
  MessageNormalizationValidationVersion,
  getMessageNormalizationValidationSummary,
} from "./messageNormalizationValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA64_FILES = Object.freeze([
  "messageNormalizationValidationTypes.ts",
  "messageNormalizationValidationRules.ts",
  "messageNormalizationValidationPolicies.ts",
  "messageNormalizationValidationRelationships.ts",
  "messageNormalizationValidationMetadata.ts",
  "messageNormalizationValidationOwnership.ts",
  "messageNormalizationValidation.ts",
  "messageNormalizationValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationValidationId",
  "MessageNormalizationValidationVersion",
  "MessageNormalizationValidationName",
  "MessageNormalizationValidationNamespace",
  "MessageNormalizationValidationStatus",
  "MessageNormalizationValidationReadiness",
  "MessageNormalizationValidationPlatform",
  "getMessageNormalizationValidationSummary",
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

const EXPECTED_DOMAIN_CATEGORIES = Object.freeze([
  "ExecutiveMessage",
  "MessageIdentity",
  "Sender",
  "Recipient",
  "Payload",
  "PayloadType",
  "Metadata",
  "Context",
  "Attachment",
  "Correlation",
  "Trace",
  "DeliveryMetadata",
  "SessionReference",
  "ConversationReference",
  "WorkspaceReference",
  "TenantReference",
  "ChannelReference",
  "ConnectorReference",
  "NormalizationResult",
  "MessageSummary",
] as const);

const EXPECTED_CATEGORIES = Object.freeze([
  ...EXPECTED_DOMAIN_CATEGORIES,
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:4 Message Normalization Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA64_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA64_FILES) {
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
      MessageNormalizationValidationId,
      "NEA-6:4/MessageNormalizationValidation",
    );
    assert.equal(MessageNormalizationValidationVersion, "1.0.0");
    assert.equal(
      MessageNormalizationValidationName,
      "Message Normalization Validation",
    );
    assert.equal(
      MessageNormalizationValidationNamespace,
      "nexora.nea.message-normalization.validation",
    );
    assert.equal(MessageNormalizationValidationStatus, "Validation");
    assert.equal(MessageNormalizationValidationReadiness, "ReadyForManifest");
    assert.equal(
      MessageNormalizationValidationPlatform.identity.phase,
      "NEA-6:4",
    );
    assert.equal(
      MessageNormalizationValidationPlatform.identity.modelId,
      MessageNormalizationModelId,
    );
    assert.equal(
      MessageNormalizationValidationPlatform.nextPhase,
      "NEA-6:5 — Message Normalization Manifest",
    );
  });

  it("consumes only NEA-6:3 Model and preserves Model references", () => {
    const dependency = MessageNormalizationValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationModel.ts",
    );
    assert.equal(dependency.modelId, MessageNormalizationModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      MessageNormalizationValidationPlatform.modelPlatform,
      MessageNormalizationModelPlatform,
    );

    const anchors = MessageNormalizationValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      MessageNormalizationModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.messageIdentityModelCount,
      MessageNormalizationModelPlatform.domainModels.messageIdentityModelCount,
    );
    assert.equal(
      anchors.relationshipCount,
      MessageNormalizationModelPlatform.relationships.relationshipCount,
    );
    assert.equal(anchors.duplicatesModelValues, false);
    assert.ok(
      MessageNormalizationValidationPlatform.rules.rules.every((item) =>
        item.modelReference.includes("NEA-6:3"),
      ),
    );
  });

  it("declares exactly 20 domain categories, 58 rules, 10 cross-model, and 6 platform integrity", () => {
    const { categories, rules } = MessageNormalizationValidationPlatform;
    assert.equal(rules.domainCategoryCount, 20);
    assert.deepEqual(
      categories
        .filter(
          (item) =>
            item.categoryId !== "CrossModel" &&
            item.categoryId !== "PlatformIntegrity",
        )
        .map((item) => item.categoryId),
      [...EXPECTED_DOMAIN_CATEGORIES],
    );
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assert.equal(rules.categoryCount, 22);
    assert.equal(rules.ruleCount, 58);
    assert.equal(rules.crossModelRuleCount, 10);
    assert.equal(rules.platformIntegrityRuleCount, 6);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(
      rules.rules.every((item) => item.executesValidation === false),
    );
    assert.ok(categories.every((item) => item.executesValidation === false));
  });

  it("declares validation relationships and eight policies", () => {
    const { relationships, policies } = MessageNormalizationValidationPlatform;
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
    assert.equal(policies.policyCount, 8);
    assert.ok(policies.policies.every((item) => item.executes === false));
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = MessageNormalizationValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Cross-Model Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.equal(ownership.ownsRuntimeValidation, false);
    assert.equal(ownership.ownsValidationEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Normalization"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Payload Parsing"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.implementsRuntimeNormalization, false);
    assert.equal(boundaries.parsesPayloads, false);
    assert.equal(boundaries.duplicatesModelValues, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationValidationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
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
    const summaryA = getMessageNormalizationValidationSummary();
    const summaryB = getMessageNormalizationValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, MessageNormalizationValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, MessageNormalizationModelId);
    assert.equal(summaryA.domainCategoryCount, 20);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 58);
    assert.equal(summaryA.crossModelRuleCount, 10);
    assert.equal(summaryA.platformIntegrityRuleCount, 6);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:5 — Message Normalization Manifest",
    );
    assert.equal(
      MessageNormalizationValidationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      MessageNormalizationValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      MessageNormalizationValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      MessageNormalizationValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      MessageNormalizationValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(MessageNormalizationValidationPlatform.runtimeBehavior, false);
    assert.equal(MessageNormalizationValidationPlatform.validationEngine, false);
    assert.equal(
      MessageNormalizationValidationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      MessageNormalizationValidationPlatform.implementsRuntimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationValidationPlatform.parsesPayloads, false);
    assert.equal(MessageNormalizationValidationPlatform.implementsHttp, false);
    assert.equal(MessageNormalizationValidationPlatform.aiReasoning, false);
    assert.equal(MessageNormalizationValidationPlatform.invokesDkl, false);
    assert.equal(MessageNormalizationValidationPlatform.invokesEngine, false);
  });
});
