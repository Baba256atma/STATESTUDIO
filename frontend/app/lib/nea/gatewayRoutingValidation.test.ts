/**
 * NEA-5:4 — Gateway Routing Validation Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Validation layer.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingModelId,
  GatewayRoutingModelPlatform,
} from "./gatewayRoutingModel.ts";
import * as ValidationModule from "./gatewayRoutingValidation.ts";
import {
  GatewayRoutingValidationId,
  GatewayRoutingValidationName,
  GatewayRoutingValidationNamespace,
  GatewayRoutingValidationPlatform,
  GatewayRoutingValidationReadiness,
  GatewayRoutingValidationStatus,
  GatewayRoutingValidationVersion,
  getGatewayRoutingValidationSummary,
} from "./gatewayRoutingValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA54_FILES = Object.freeze([
  "gatewayRoutingValidationTypes.ts",
  "gatewayRoutingValidationRules.ts",
  "gatewayRoutingValidationPolicies.ts",
  "gatewayRoutingValidationRelationships.ts",
  "gatewayRoutingValidationMetadata.ts",
  "gatewayRoutingValidationOwnership.ts",
  "gatewayRoutingValidation.ts",
  "gatewayRoutingValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingValidationId",
  "GatewayRoutingValidationVersion",
  "GatewayRoutingValidationName",
  "GatewayRoutingValidationNamespace",
  "GatewayRoutingValidationStatus",
  "GatewayRoutingValidationReadiness",
  "GatewayRoutingValidationPlatform",
  "getGatewayRoutingValidationSummary",
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
  "RouteIdentity",
  "RouteDefinition",
  "RouteDestination",
  "RouteDecision",
  "RouteContext",
  "RouteStrategy",
  "RoutePriority",
  "RouteStatus",
  "RouteResult",
  "RoutePolicy",
  "RouteMetadata",
  "RouteCapability",
  "RouteLifecycle",
  "RouteRequest",
  "RouteResponse",
  "RouteResolution",
  "RouteDiagnostics",
  "RouteSummary",
  "RouteConfiguration",
  "RouteReference",
  "CrossModel",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:4 Gateway Routing Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA54_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA54_FILES) {
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
      GatewayRoutingValidationId,
      "NEA-5:4/GatewayRoutingValidation",
    );
    assert.equal(GatewayRoutingValidationVersion, "1.0.0");
    assert.equal(
      GatewayRoutingValidationName,
      "Gateway Routing Validation",
    );
    assert.equal(
      GatewayRoutingValidationNamespace,
      "nexora.nea.gateway-routing.validation",
    );
    assert.equal(GatewayRoutingValidationStatus, "Validation");
    assert.equal(GatewayRoutingValidationReadiness, "ReadyForManifest");
    assert.equal(GatewayRoutingValidationPlatform.identity.phase, "NEA-5:4");
    assert.equal(
      GatewayRoutingValidationPlatform.identity.modelId,
      GatewayRoutingModelId,
    );
    assert.equal(
      GatewayRoutingValidationPlatform.nextPhase,
      "NEA-5:5 — Gateway Routing Manifest",
    );
  });

  it("consumes only NEA-5:3 Model and preserves Model references", () => {
    const dependency = GatewayRoutingValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingModel.ts",
    );
    assert.equal(dependency.modelId, GatewayRoutingModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      GatewayRoutingValidationPlatform.modelPlatform,
      GatewayRoutingModelPlatform,
    );

    const anchors = GatewayRoutingValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      GatewayRoutingModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.routeIdentityModelCount,
      GatewayRoutingModelPlatform.domainModels.routeIdentityModelCount,
    );
    assert.equal(
      anchors.relationshipCount,
      GatewayRoutingModelPlatform.relationships.relationshipCount,
    );
    assert.equal(anchors.duplicatesModelValues, false);
    assert.equal(anchors.preservesCanonicalModelReferences, true);
    assert.ok(
      GatewayRoutingValidationPlatform.rules.rules.every((item) =>
        item.modelReference.includes("NEA-5:3"),
      ),
    );
  });

  it("declares twenty-two categories and sixty rules without execution", () => {
    const { categories, rules } = GatewayRoutingValidationPlatform;
    assert.equal(categories.length, 22);
    assert.deepEqual(
      categories.map((item) => item.categoryId),
      [...EXPECTED_CATEGORIES],
    );
    assert.ok(
      categories.every((item) => item.executesValidation === false),
    );

    assert.equal(rules.ruleCount, 60);
    assert.equal(rules.categoryCount, 22);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(
      rules.rules.every((item) => item.executesValidation === false),
    );
    assert.ok(rules.rules.every((item) => item.metadataOnly === true));
    assert.equal(rules.executesValidation, false);
  });

  it("declares twenty-six validation relationships and eight policies", () => {
    const { relationships, policies } = GatewayRoutingValidationPlatform;
    assert.equal(relationships.relationshipCount, 26);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.equal(relationships.executesValidation, false);

    const byKey = Object.fromEntries(
      relationships.relationships.map((item) => [
        item.relationshipId.split("/").at(-1),
        item,
      ]),
    );
    assert.equal(byKey["Identity-Definition"]?.sourceCategoryId, "RouteIdentity");
    assert.equal(byKey["Request-Resolution"]?.targetCategoryId, "RouteResolution");
    assert.equal(byKey["Platform-CrossModel"]?.sourceCategoryId, "PlatformIntegrity");

    assert.equal(policies.policyCount, 8);
    assert.equal(policies.executesPolicies, false);
    assert.ok(policies.policies.every((item) => item.executes === false));
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Cross-Model Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Validation"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.equal(ownership.ownsRuntimeValidation, false);
    assert.equal(ownership.ownsValidationEngine, false);
    assert.equal(ownership.ownsDomainModels, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Validation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.runtimeValidation, false);
    assert.equal(boundaries.duplicatesModelValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingValidationPlatform;
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
    const summaryA = getGatewayRoutingValidationSummary();
    const summaryB = getGatewayRoutingValidationSummary();
    const meta = GatewayRoutingValidationPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, GatewayRoutingValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, GatewayRoutingModelId);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 60);
    assert.equal(summaryA.relationshipCount, 26);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:5 — Gateway Routing Manifest",
    );
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesModelValues, false);
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      GatewayRoutingValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      GatewayRoutingValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      GatewayRoutingValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(GatewayRoutingValidationPlatform.runtimeBehavior, false);
    assert.equal(GatewayRoutingValidationPlatform.validationExecution, false);
    assert.equal(
      GatewayRoutingValidationPlatform.implementsRuntimeRouting,
      false,
    );
    assert.equal(
      GatewayRoutingValidationPlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(GatewayRoutingValidationPlatform.executesStrategies, false);
    assert.equal(GatewayRoutingValidationPlatform.implementsHttp, false);
    assert.equal(GatewayRoutingValidationPlatform.aiReasoning, false);
  });
});
