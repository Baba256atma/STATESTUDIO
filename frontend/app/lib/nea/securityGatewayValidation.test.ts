/**
 * NEA-4:4 — Security Gateway Validation Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Validation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SecurityGatewayModelId,
  SecurityGatewayModelPlatform,
} from "./securityGatewayModel.ts";
import * as ValidationModule from "./securityGatewayValidation.ts";
import {
  SecurityGatewayValidationId,
  SecurityGatewayValidationName,
  SecurityGatewayValidationNamespace,
  SecurityGatewayValidationPlatform,
  SecurityGatewayValidationReadiness,
  SecurityGatewayValidationStatus,
  SecurityGatewayValidationVersion,
  getSecurityGatewayValidationSummary,
} from "./securityGatewayValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA44_FILES = Object.freeze([
  "securityGatewayValidationTypes.ts",
  "securityGatewayValidationRules.ts",
  "securityGatewayValidationPolicies.ts",
  "securityGatewayValidationRelationships.ts",
  "securityGatewayValidationMetadata.ts",
  "securityGatewayValidationOwnership.ts",
  "securityGatewayValidation.ts",
  "securityGatewayValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayValidationId",
  "SecurityGatewayValidationVersion",
  "SecurityGatewayValidationName",
  "SecurityGatewayValidationNamespace",
  "SecurityGatewayValidationStatus",
  "SecurityGatewayValidationReadiness",
  "SecurityGatewayValidationPlatform",
  "getSecurityGatewayValidationSummary",
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
  "SecurityIdentity",
  "SecurityPrincipal",
  "SecurityContext",
  "AuthenticationContext",
  "AuthorizationContext",
  "TrustContext",
  "ConsentContext",
  "Role",
  "Permission",
  "SecurityClassification",
  "SecurityPolicy",
  "SecurityEvent",
  "SecurityMetadata",
  "SecurityDecisionDeclaration",
  "SecurityResource",
  "SecurityAction",
  "SecurityConstraint",
  "SecurityDiagnostic",
  "SecurityResult",
  "SecuritySummary",
  "CrossModel",
  "PlatformIntegrity",
] as const);

const EXPECTED_POLICIES = Object.freeze([
  "CanonicalReferenceRequired",
  "MetadataComplete",
  "OwnershipPreserved",
  "ImmutableModels",
  "NoDuplicateDefinitions",
  "NoRuntimeBehavior",
  "NoDeepImports",
  "PlatformIntegrity",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:4 Security Gateway Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(NEA44_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA44_FILES) {
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
      SecurityGatewayValidationId,
      "NEA-4:4/SecurityGatewayValidation",
    );
    assert.equal(SecurityGatewayValidationVersion, "1.0.0");
    assert.equal(
      SecurityGatewayValidationName,
      "Security Gateway Validation",
    );
    assert.equal(
      SecurityGatewayValidationNamespace,
      "nexora.nea.security-gateway.validation",
    );
    assert.equal(SecurityGatewayValidationStatus, "Validation");
    assert.equal(SecurityGatewayValidationReadiness, "ReadyForManifest");
    assert.equal(SecurityGatewayValidationPlatform.identity.phase, "NEA-4:4");
    assert.equal(
      SecurityGatewayValidationPlatform.identity.modelId,
      SecurityGatewayModelId,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.nextPhase,
      "NEA-4:5 — Security Gateway Manifest",
    );
  });

  it("consumes only NEA-4:3 Model and preserves Model references", () => {
    const dependency = SecurityGatewayValidationPlatform.dependency;
    assert.equal(dependency.modelOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayModel.ts",
    );
    assert.equal(dependency.modelId, SecurityGatewayModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.duplicatesModelValues, false);
    assert.equal(
      SecurityGatewayValidationPlatform.modelPlatform,
      SecurityGatewayModelPlatform,
    );

    const anchors = SecurityGatewayValidationPlatform.rules.modelAnchors;
    assert.equal(
      anchors.domainModelCount,
      SecurityGatewayModelPlatform.domainModels.modelCount,
    );
    assert.equal(
      anchors.securityIdentityModelCount,
      SecurityGatewayModelPlatform.domainModels.securityIdentityModelCount,
    );
    assert.equal(
      anchors.relationshipCount,
      SecurityGatewayModelPlatform.relationships.relationshipCount,
    );
    assert.equal(anchors.duplicatesModelValues, false);
    assert.equal(anchors.preservesCanonicalModelReferences, true);
  });

  it("declares exactly twenty-two categories and sixty rules", () => {
    const { categories, rules } = SecurityGatewayValidationPlatform;
    assert.equal(categories.length, 22);
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

    assert.equal(rules.ruleCount, 60);
    assert.equal(rules.categoryCount, 22);
    assertUnique(
      rules.rules.map((item) => item.ruleId),
      "rule ids",
    );
    assert.ok(rules.rules.every((item) => item.executesValidation === false));
    assert.ok(rules.rules.every((item) => item.modelReference.includes("NEA-4:3")));
    assert.equal(rules.executesValidation, false);
  });

  it("declares exactly twenty-six relationships and eight policies", () => {
    const { relationships, policies } = SecurityGatewayValidationPlatform;
    assert.equal(relationships.relationshipCount, 26);
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
          item.sourceCategoryId === "SecurityContext" &&
          item.targetCategoryId === "SecurityIdentity",
      ),
    );

    assert.equal(policies.policyCount, 8);
    assert.deepEqual(
      policies.policies.map((item) => item.policyId.split("/").at(-1)),
      [...EXPECTED_POLICIES],
    );
    assert.ok(policies.policies.every((item) => item.executes === false));
    assert.equal(policies.executesPolicies, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SecurityGatewayValidationPlatform;
    assert.ok(ownership.owns.includes("Validation Categories"));
    assert.ok(ownership.owns.includes("Validation Rules"));
    assert.ok(ownership.owns.includes("Validation Policies"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("Authorization Engine"));
    assert.ok(ownership.doesNotOwn.includes("OAuth"));
    assert.ok(ownership.doesNotOwn.includes("JWT"));
    assert.ok(ownership.doesNotOwn.includes("Domain Models"));
    assert.equal(ownership.ownsValidationEngine, false);
    assert.equal(ownership.ownsDomainModels, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Login"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.equal(boundaries.validationEngine, false);
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.calculatesSecurityDecisions, false);
    assert.equal(boundaries.duplicatesModelValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayValidationPlatform;
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
    const summaryA = getSecurityGatewayValidationSummary();
    const summaryB = getSecurityGatewayValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.validationId, SecurityGatewayValidationId);
    assert.equal(summaryA.status, "Validation");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.modelId, SecurityGatewayModelId);
    assert.equal(summaryA.categoryCount, 22);
    assert.equal(summaryA.ruleCount, 60);
    assert.equal(summaryA.relationshipCount, 26);
    assert.equal(summaryA.policyCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-4:5 — Security Gateway Manifest",
    );
    assert.equal(
      SecurityGatewayValidationPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.metadata.duplicatesModelValues,
      false,
    );
  });

  it("declares ReadyForManifest only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayValidationPlatform.readiness.readiness,
      "ReadyForManifest",
    );
    assert.equal(
      SecurityGatewayValidationPlatform.readiness.claimsReadyForManifest,
      true,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.readiness.claimsValidationEngine,
      false,
    );
    assert.equal(SecurityGatewayValidationPlatform.runtimeBehavior, false);
    assert.equal(SecurityGatewayValidationPlatform.validationExecution, false);
    assert.equal(
      SecurityGatewayValidationPlatform.executesAuthentication,
      false,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.executesAuthorization,
      false,
    );
    assert.equal(
      SecurityGatewayValidationPlatform.calculatesSecurityDecisions,
      false,
    );
    assert.equal(SecurityGatewayValidationPlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayValidationPlatform.aiReasoning, false);
  });
});
