/**
 * NEA-1:4 — Executive Gateway Validation Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Validation layer.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayModelId,
  ExecutiveGatewayModelPlatform,
} from "./executiveGatewayModel.ts";
import * as ValidationModule from "./executiveGatewayValidation.ts";
import {
  ExecutiveGatewayValidationId,
  ExecutiveGatewayValidationName,
  ExecutiveGatewayValidationNamespace,
  ExecutiveGatewayValidationPlatform,
  ExecutiveGatewayValidationReadiness,
  ExecutiveGatewayValidationStatus,
  ExecutiveGatewayValidationVersion,
  getExecutiveGatewayValidationSummary,
} from "./executiveGatewayValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA14_FILES = Object.freeze([
  "executiveGatewayValidationTypes.ts",
  "executiveGatewayValidationRules.ts",
  "executiveGatewayValidationPolicies.ts",
  "executiveGatewayValidationRelationships.ts",
  "executiveGatewayValidationMetadata.ts",
  "executiveGatewayValidationOwnership.ts",
  "executiveGatewayValidation.ts",
  "executiveGatewayValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayValidationId",
  "ExecutiveGatewayValidationVersion",
  "ExecutiveGatewayValidationName",
  "ExecutiveGatewayValidationNamespace",
  "ExecutiveGatewayValidationStatus",
  "ExecutiveGatewayValidationReadiness",
  "ExecutiveGatewayValidationPlatform",
  "getExecutiveGatewayValidationSummary",
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
  "Identity",
  "Sender",
  "Tenant",
  "Workspace",
  "Context",
  "Session",
  "Conversation",
  "Authentication",
  "Authorization",
  "Trust",
  "Consent",
  "Payload",
  "Attachment",
  "Metadata",
  "Request",
  "Routing",
  "ValidationOutcome",
  "Diagnostic",
  "ProcessingResult",
  "Response",
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:4 Executive Gateway Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA14_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA14_FILES) {
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
      ExecutiveGatewayValidationId,
      "NEA-1:4/ExecutiveGatewayValidation",
    );
    assert.equal(ExecutiveGatewayValidationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewayValidationName,
      "Executive Gateway Validation",
    );
    assert.equal(
      ExecutiveGatewayValidationNamespace,
      "nexora.nea.executive-gateway.validation",
    );
    assert.equal(ExecutiveGatewayValidationStatus, "Validation");
    assert.equal(ExecutiveGatewayValidationReadiness, "ReadyForManifest");
    assert.equal(
      ExecutiveGatewayValidationPlatform.identity.phase,
      "NEA-1:4",
    );
    assert.equal(ExecutiveGatewayValidationPlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayValidationPlatform.identity.modelId,
      ExecutiveGatewayModelId,
    );
    assert.equal(
      ExecutiveGatewayValidationPlatform.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveGatewayValidationPlatform.nextPhase,
      "NEA-1:5 — Executive Gateway Manifest",
    );
  });

  it("consumes only NEA-1:3 Model public surface", () => {
    const dependency = ExecutiveGatewayValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(dependency.modelPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayModel.ts",
    );
    assert.equal(dependency.modelId, ExecutiveGatewayModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.dklInternalImport, false);
    assert.equal(dependency.engineInternalImport, false);
    assert.equal(dependency.assistantInternalImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      ExecutiveGatewayValidationPlatform.modelPlatform,
      ExecutiveGatewayModelPlatform,
    );
  });

  it("declares complete validation categories and unique rules", () => {
    const { categories, rules } = ExecutiveGatewayValidationPlatform;
    assert.equal(categories.length, 22);
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assertUnique(
      categories.map((item) => item.categoryId),
      "category ids",
    );
    assert.ok(rules.ruleCount >= 40);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(rules.rules.every((item) => item.executesValidation === false));
    assert.ok(categories.every((item) => item.executesValidation === false));
    assert.equal(rules.modelAnchors.preservesCanonicalModelReferences, true);
    assert.equal(rules.modelAnchors.duplicatesModelValues, false);
    assert.equal(
      rules.modelAnchors.domainModelCount,
      ExecutiveGatewayModelPlatform.domainModels.modelCount,
    );
    assert.deepEqual(
      [...rules.modelAnchors.domainModelKinds],
      ExecutiveGatewayModelPlatform.domainModels.models.map(
        (item) => item.modelKind,
      ),
    );
  });

  it("declares validation relationships and policies without execution", () => {
    const { relationships, policies } = ExecutiveGatewayValidationPlatform;
    assert.ok(relationships.relationshipCount >= 20);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.equal(relationships.executesValidation, false);
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceCategoryId === "Request" &&
          item.targetCategoryId === "Sender",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceCategoryId === "Response" &&
          item.targetCategoryId === "Request",
      ),
    );
    assert.ok(policies.policyCount >= 6);
    assert.equal(policies.executesPolicies, false);
    assertUnique(
      policies.policies.map((item) => item.policyId),
      "policy ids",
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Definitions"));
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Cross-Model Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Validation Engine"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Processing"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.ok(ownership.doesNotOwn.includes("Executive Engine"));
    assert.equal(ownership.ownsValidationEngine, false);
    assert.equal(ownership.ownsRoutingEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Validation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.executesValidationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.executesRouting, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.invokesEngine, false);
    assert.equal(boundaries.duplicatesModelValues, false);
    assert.equal(boundaries.reconstructsModel, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayValidationPlatform;
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
  });

  it("derives deterministic inventory counts from canonical collections", () => {
    const summaryA = getExecutiveGatewayValidationSummary();
    const summaryB = getExecutiveGatewayValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, ExecutiveGatewayValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, ExecutiveGatewayModelId);

    const meta = ExecutiveGatewayValidationPlatform.metadata;
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.countsReconstructed, false);
    assert.equal(meta.duplicatesModelValues, false);
    assert.equal(summaryA.categoryCount, meta.categoryCount);
    assert.equal(summaryA.ruleCount, meta.ruleCount);
    assert.equal(summaryA.relationshipCount, meta.relationshipCount);
    assert.equal(summaryA.policyCount, meta.policyCount);
    assert.equal(summaryA.ownershipCount, meta.ownershipCount);
    assert.equal(summaryA.prohibitedSurfaceCount, meta.prohibitedSurfaceCount);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:5 — Executive Gateway Manifest",
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayValidationPlatform.readiness,
      "ReadyForManifest",
    );
    assert.notEqual(
      ExecutiveGatewayValidationPlatform.readiness,
      "ReadyForPlatform",
    );
    assert.notEqual(
      ExecutiveGatewayValidationPlatform.readiness,
      "RuntimeReady",
    );
    assert.equal(ExecutiveGatewayValidationPlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayValidationPlatform.validationEngine, false);
    assert.equal(ExecutiveGatewayValidationPlatform.runtimeValidation, false);
    assert.equal(
      ExecutiveGatewayValidationPlatform.authenticationEngine,
      false,
    );
    assert.equal(
      ExecutiveGatewayValidationPlatform.authorizationEngine,
      false,
    );
    assert.equal(ExecutiveGatewayValidationPlatform.routingEngine, false);
    assert.equal(ExecutiveGatewayValidationPlatform.aiReasoning, false);
    assert.equal(
      ExecutiveGatewayValidationPlatform.persistenceBehavior,
      false,
    );
  });
});
