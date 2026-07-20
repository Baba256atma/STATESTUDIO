/**
 * NEA-8:4 — Executive Gateway Suite Validation Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuiteModelId,
  ExecutiveGatewaySuiteModelPlatform,
} from "./executiveGatewaySuiteModel.ts";
import * as ValidationModule from "./executiveGatewaySuiteValidation.ts";
import {
  ExecutiveGatewaySuiteValidationId,
  ExecutiveGatewaySuiteValidationName,
  ExecutiveGatewaySuiteValidationNamespace,
  ExecutiveGatewaySuiteValidationPlatform,
  ExecutiveGatewaySuiteValidationReadiness,
  ExecutiveGatewaySuiteValidationStatus,
  ExecutiveGatewaySuiteValidationVersion,
  getExecutiveGatewaySuiteValidationSummary,
} from "./executiveGatewaySuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA84_FILES = Object.freeze([
  "executiveGatewaySuiteValidationTypes.ts",
  "executiveGatewaySuiteValidationRules.ts",
  "executiveGatewaySuiteValidationPolicies.ts",
  "executiveGatewaySuiteValidationRelationships.ts",
  "executiveGatewaySuiteValidationMetadata.ts",
  "executiveGatewaySuiteValidationOwnership.ts",
  "executiveGatewaySuiteValidation.ts",
  "executiveGatewaySuiteValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteValidationId",
  "ExecutiveGatewaySuiteValidationVersion",
  "ExecutiveGatewaySuiteValidationName",
  "ExecutiveGatewaySuiteValidationNamespace",
  "ExecutiveGatewaySuiteValidationStatus",
  "ExecutiveGatewaySuiteValidationReadiness",
  "ExecutiveGatewaySuiteValidationPlatform",
  "getExecutiveGatewaySuiteValidationSummary",
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

const EXPECTED_CATEGORIES = Object.freeze([
  ...EXPECTED_DOMAIN_CATEGORIES,
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:4 Executive Gateway Suite Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA84_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA84_FILES) {
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
      ExecutiveGatewaySuiteValidationId,
      "NEA-8:4/ExecutiveGatewaySuiteValidation",
    );
    assert.equal(ExecutiveGatewaySuiteValidationVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteValidationName,
      "Executive Gateway Suite Validation",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationNamespace,
      "nexora.nea.executive-gateway-suite.validation",
    );
    assert.equal(ExecutiveGatewaySuiteValidationStatus, "Validation");
    assert.equal(
      ExecutiveGatewaySuiteValidationReadiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.identity.phase,
      "NEA-8:4",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.identity.modelId,
      ExecutiveGatewaySuiteModelId,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.nextPhase,
      "NEA-8:5 — Executive Gateway Suite Manifest",
    );
  });

  it("consumes only NEA-8:3 Model and preserves Model references", () => {
    const dependency = ExecutiveGatewaySuiteValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteModel.ts",
    );
    assert.equal(dependency.modelId, ExecutiveGatewaySuiteModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.nea1ThroughNea7InternalImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.modelPlatform,
      ExecutiveGatewaySuiteModelPlatform,
    );

    const anchors = ExecutiveGatewaySuiteValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      ExecutiveGatewaySuiteModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.suiteComponentModelCount,
      ExecutiveGatewaySuiteModelPlatform.domainModels.suiteComponentModelCount,
    );
    assert.equal(
      anchors.relationshipCount,
      ExecutiveGatewaySuiteModelPlatform.relationships.relationshipCount,
    );
    assert.equal(
      anchors.publicApiInventoryTotal,
      ExecutiveGatewaySuiteModelPlatform.domainModels.registryAnchors
        .publicApiInventoryTotal,
    );
    assert.equal(anchors.publicApiInventoryTotal, 532);
    assert.equal(anchors.duplicatesModelValues, false);
    assert.ok(
      ExecutiveGatewaySuiteValidationPlatform.rules.rules.every((item) =>
        item.modelReference.includes("NEA-8:3"),
      ),
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.metadata.canonicalReferenceMode,
      "ModelPlatformOnly",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
  });

  it("declares exactly 20 domain categories, 56 rules, 10 cross-model, and 6 platform integrity", () => {
    const { categories, rules } = ExecutiveGatewaySuiteValidationPlatform;
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
    assert.equal(rules.ruleCount, 56);
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

  it("declares exactly 24 validation relationships and eight policies", () => {
    const { relationships, policies } = ExecutiveGatewaySuiteValidationPlatform;
    assert.equal(relationships.relationshipCount, 24);
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
    assert.equal(policies.executesPolicies, false);
    assert.ok(
      policies.policies.some(
        (item) => item.policyName === "Canonical Reference Only",
      ),
    );
    assert.ok(
      policies.policies.some((item) => item.policyName === "Inventory Derivation"),
    );
    assert.ok(
      policies.policies.some((item) => item.policyName === "Platform Consistency"),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewaySuiteValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Validation Policies"));
    assert.ok(ownership.doesNotOwn.includes("Foundation"));
    assert.ok(ownership.doesNotOwn.includes("Registry"));
    assert.ok(ownership.doesNotOwn.includes("Model"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsModel, false);
    assert.equal(ownership.ownsRuntimeGateway, false);
    assert.equal(ownership.ownsValidationEngine, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Validation Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.registryDirectImport, false);
    assert.equal(boundaries.foundationDirectImport, false);
    assert.equal(boundaries.duplicatesModelValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteValidationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.categories), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary with canonical public API inventory of 532", () => {
    const summaryA = getExecutiveGatewaySuiteValidationSummary();
    const summaryB = getExecutiveGatewaySuiteValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, ExecutiveGatewaySuiteValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, ExecutiveGatewaySuiteModelId);
    assert.equal(summaryA.domainCategoryCount, 20);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 56);
    assert.equal(summaryA.crossModelRuleCount, 10);
    assert.equal(summaryA.platformIntegrityRuleCount, 6);
    assert.equal(summaryA.relationshipCount, 24);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      ExecutiveGatewaySuiteModelPlatform.domainModels.registryAnchors
        .publicApiInventoryTotal,
    );
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:5 — Executive Gateway Suite Manifest",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.metadata.countsHardcoded,
      false,
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.runtimeBehavior,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.validationEngine,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.runtimeValidation,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteValidationPlatform.invokesDkl, false);
    assert.equal(ExecutiveGatewaySuiteValidationPlatform.invokesEngine, false);
    assert.equal(
      ExecutiveGatewaySuiteValidationPlatform.invokesAssistant,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteValidationPlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewaySuiteValidationPlatform.businessLogic, false);
  });
});
