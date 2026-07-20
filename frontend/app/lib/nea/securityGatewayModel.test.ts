/**
 * NEA-4:3 — Security Gateway Model Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Model.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./securityGatewayModel.ts";
import {
  SecurityGatewayModelId,
  SecurityGatewayModelName,
  SecurityGatewayModelNamespace,
  SecurityGatewayModelPlatform,
  SecurityGatewayModelReadiness,
  SecurityGatewayModelStatus,
  SecurityGatewayModelVersion,
  getSecurityGatewayModelSummary,
} from "./securityGatewayModel.ts";
import {
  SecurityGatewayRegistryId,
  SecurityGatewayRegistryPlatform,
} from "./securityGatewayRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA43_FILES = Object.freeze([
  "securityGatewayModelTypes.ts",
  "securityGatewayModels.ts",
  "securityGatewayRelationships.ts",
  "securityGatewayModelMetadata.ts",
  "securityGatewayModelOwnership.ts",
  "securityGatewayModelLifecycle.ts",
  "securityGatewayModel.ts",
  "securityGatewayModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayModelId",
  "SecurityGatewayModelVersion",
  "SecurityGatewayModelName",
  "SecurityGatewayModelNamespace",
  "SecurityGatewayModelStatus",
  "SecurityGatewayModelReadiness",
  "SecurityGatewayModelPlatform",
  "getSecurityGatewayModelSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_MODEL_KINDS = Object.freeze([
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
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:3 Security Gateway Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    assert.equal(NEA43_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA43_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ModelModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ModelModule).length, 8);
  });

  it("has canonical model identity, status Model, and ReadyForValidation", () => {
    assert.equal(SecurityGatewayModelId, "NEA-4:3/SecurityGatewayModel");
    assert.equal(SecurityGatewayModelVersion, "1.0.0");
    assert.equal(SecurityGatewayModelName, "Security Gateway Model");
    assert.equal(
      SecurityGatewayModelNamespace,
      "nexora.nea.security-gateway.model",
    );
    assert.equal(SecurityGatewayModelStatus, "Model");
    assert.equal(SecurityGatewayModelReadiness, "ReadyForValidation");
    assert.equal(SecurityGatewayModelPlatform.identity.phase, "NEA-4:3");
    assert.equal(
      SecurityGatewayModelPlatform.identity.registryId,
      SecurityGatewayRegistryId,
    );
    assert.equal(
      SecurityGatewayModelPlatform.nextPhase,
      "NEA-4:4 — Security Gateway Validation",
    );
  });

  it("consumes only NEA-4:2 Registry and preserves Registry references", () => {
    const dependency = SecurityGatewayModelPlatform.dependency;
    assert.equal(dependency.registryOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayRegistry.ts",
    );
    assert.equal(dependency.registryId, SecurityGatewayRegistryId);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.reconstructsRegistry, false);
    assert.equal(dependency.duplicatesRegistryValues, false);
    assert.equal(
      SecurityGatewayModelPlatform.registryPlatform,
      SecurityGatewayRegistryPlatform,
    );

    const anchors = SecurityGatewayModelPlatform.domainModels.registryAnchors;
    assert.equal(
      anchors.securityIdentityCount,
      SecurityGatewayRegistryPlatform.collections.securityIdentityCount,
    );
    assert.equal(
      anchors.roleCount,
      SecurityGatewayRegistryPlatform.collections.roleCount,
    );
    assert.equal(
      anchors.permissionCount,
      SecurityGatewayRegistryPlatform.collections.permissionCount,
    );
    assert.equal(anchors.duplicatesRegistryValues, false);
    assert.equal(anchors.preservesCanonicalReferences, true);
  });

  it("declares twenty domain model kinds and identity/principal instances", () => {
    const { domainModels } = SecurityGatewayModelPlatform;
    assert.equal(domainModels.modelCount, 20);
    assert.deepEqual(
      domainModels.models.map((item) => item.modelKind),
      [...EXPECTED_MODEL_KINDS],
    );
    assertUnique(
      domainModels.models.map((item) => item.modelKind),
      "model kinds",
    );
    assert.ok(
      domainModels.models.every((item) => item.executesRuntime === false),
    );

    assert.equal(domainModels.securityIdentityModelCount, 8);
    assert.equal(domainModels.securityPrincipalModelCount, 8);
    assertUnique(
      domainModels.securityIdentityModels.map((item) => item.securityId),
      "security identity ids",
    );
    assertUnique(
      domainModels.securityPrincipalModels.map((item) => item.principalId),
      "principal ids",
    );
    assert.ok(
      domainModels.securityIdentityModels.every(
        (item) => item.managesRuntimeSecurity === false,
      ),
    );
    assert.ok(
      domainModels.securityPrincipalModels.every(
        (item) => item.verifiesIdentity === false,
      ),
    );
    assert.ok(
      domainModels.securityIdentityModels.every(
        (item) =>
          item.version &&
          item.classification &&
          item.status &&
          item.lifecycle,
      ),
    );
  });

  it("declares twenty-four model relationships without runtime graph traversal", () => {
    const { relationships } = SecurityGatewayModelPlatform;
    assert.equal(relationships.relationshipCount, 24);
    assertUnique(
      relationships.relationships.map((item) => item.relationshipId),
      "relationship ids",
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "SecurityIdentity" &&
          item.targetModelKind === "SecurityPrincipal",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "SecurityContext" &&
          item.targetModelKind === "AuthenticationContext",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "Permission" &&
          item.targetModelKind === "SecurityConstraint",
      ),
    );
    assert.ok(
      relationships.relationships.some(
        (item) =>
          item.sourceModelKind === "SecuritySummary" &&
          item.targetModelKind === "SecurityResult",
      ),
    );
    assert.equal(relationships.executesRuntime, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SecurityGatewayModelPlatform;
    assert.ok(ownership.owns.includes("Security Domain Models"));
    assert.ok(ownership.owns.includes("Model Relationships"));
    assert.ok(ownership.owns.includes("Model Composition"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Execution"));
    assert.ok(ownership.doesNotOwn.includes("Authorization Execution"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.ok(ownership.doesNotOwn.includes("Registry Collections"));
    assert.equal(ownership.ownsAuthenticationExecution, false);
    assert.equal(ownership.ownsRegistryCollections, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication Engine"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth Runtime"));
    assert.ok(boundaries.prohibitedSurfaces.includes("JWT Runtime"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.executesAuthorization, false);
    assert.equal(boundaries.calculatesSecurityDecisions, false);
    assert.equal(boundaries.duplicatesRegistryValues, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayModelPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.domainModels), true);
    assert.equal(Object.isFrozen(platform.domainModels.models), true);
    assert.equal(Object.isFrozen(platform.relationships), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical model collections", () => {
    const summaryA = getSecurityGatewayModelSummary();
    const summaryB = getSecurityGatewayModelSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.modelId, SecurityGatewayModelId);
    assert.equal(summaryA.status, "Model");
    assert.equal(summaryA.readiness, "ReadyForValidation");
    assert.equal(summaryA.registryId, SecurityGatewayRegistryId);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.securityIdentityModelCount, 8);
    assert.equal(summaryA.securityPrincipalModelCount, 8);
    assert.equal(summaryA.relationshipCount, 24);
    assert.equal(summaryA.lifecycleStateCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(
      summaryA.nextPhase,
      "NEA-4:4 — Security Gateway Validation",
    );
    assert.equal(
      SecurityGatewayModelPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SecurityGatewayModelPlatform.metadata.duplicatesRegistryValues,
      false,
    );
    assert.equal(
      SecurityGatewayModelPlatform.lifecycle.currentState,
      "ReadyForValidation",
    );
  });

  it("declares ReadyForValidation only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayModelPlatform.readiness.readiness,
      "ReadyForValidation",
    );
    assert.equal(
      SecurityGatewayModelPlatform.readiness.claimsReadyForValidation,
      true,
    );
    assert.equal(
      SecurityGatewayModelPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(SecurityGatewayModelPlatform.runtimeBehavior, false);
    assert.equal(SecurityGatewayModelPlatform.executesAuthentication, false);
    assert.equal(SecurityGatewayModelPlatform.executesAuthorization, false);
    assert.equal(SecurityGatewayModelPlatform.evaluatesPermissions, false);
    assert.equal(SecurityGatewayModelPlatform.evaluatesTrust, false);
    assert.equal(SecurityGatewayModelPlatform.verifiesIdentity, false);
    assert.equal(
      SecurityGatewayModelPlatform.calculatesSecurityDecisions,
      false,
    );
    assert.equal(SecurityGatewayModelPlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayModelPlatform.aiReasoning, false);
    assert.equal(SecurityGatewayModelPlatform.businessLogic, false);
  });
});
