/**
 * NEA-4:5 — Security Gateway Manifest Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Manifest.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./securityGatewayManifest.ts";
import {
  SecurityGatewayManifestId,
  SecurityGatewayManifestName,
  SecurityGatewayManifestNamespace,
  SecurityGatewayManifestPlatform,
  SecurityGatewayManifestReadiness,
  SecurityGatewayManifestStatus,
  SecurityGatewayManifestVersion,
  getSecurityGatewayManifestSummary,
} from "./securityGatewayManifest.ts";
import {
  SecurityGatewayValidationId,
  SecurityGatewayValidationPlatform,
} from "./securityGatewayValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA45_FILES = Object.freeze([
  "securityGatewayManifestTypes.ts",
  "securityGatewayManifestInventory.ts",
  "securityGatewayManifestMetadata.ts",
  "securityGatewayManifestOwnership.ts",
  "securityGatewayManifestReadiness.ts",
  "securityGatewayManifestSummary.ts",
  "securityGatewayManifest.ts",
  "securityGatewayManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayManifestId",
  "SecurityGatewayManifestVersion",
  "SecurityGatewayManifestName",
  "SecurityGatewayManifestNamespace",
  "SecurityGatewayManifestStatus",
  "SecurityGatewayManifestReadiness",
  "SecurityGatewayManifestPlatform",
  "getSecurityGatewayManifestSummary",
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
  "securityContracts",
  "securityCapabilities",
  "securityLifecycle",
  "securityIdentities",
  "securityClassifications",
  "authenticationMethods",
  "authorizationLevels",
  "trustLevels",
  "consentStates",
  "roles",
  "permissions",
  "securityPolicies",
  "securityEvents",
  "contextTypes",
  "domainModels",
  "modelRelationships",
  "validationCategories",
  "validationRules",
  "validationRelationships",
  "validationPolicies",
  "publicExports",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:5 Security Gateway Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(NEA45_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA45_FILES) {
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
      SecurityGatewayManifestId,
      "NEA-4:5/SecurityGatewayManifest",
    );
    assert.equal(SecurityGatewayManifestVersion, "1.0.0");
    assert.equal(
      SecurityGatewayManifestName,
      "Security Gateway Manifest",
    );
    assert.equal(
      SecurityGatewayManifestNamespace,
      "nexora.nea.security-gateway.manifest",
    );
    assert.equal(SecurityGatewayManifestStatus, "Manifest");
    assert.equal(SecurityGatewayManifestReadiness, "ReadyForPlatform");
    assert.equal(SecurityGatewayManifestPlatform.identity.phase, "NEA-4:5");
    assert.equal(
      SecurityGatewayManifestPlatform.identity.validationId,
      SecurityGatewayValidationId,
    );
    assert.equal(
      SecurityGatewayManifestPlatform.nextPhase,
      "NEA-4:6 — Security Gateway Platform",
    );
  });

  it("consumes only NEA-4:4 Validation and preserves the canonical phase chain", () => {
    const dependency = SecurityGatewayManifestPlatform.dependency;
    assert.equal(dependency.validationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayValidation.ts",
    );
    assert.equal(dependency.validationId, SecurityGatewayValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesUpstreamCollections, false);
    assert.equal(dependency.redefinesPriorPhases, false);
    assert.equal(
      SecurityGatewayManifestPlatform.validationPlatform,
      SecurityGatewayValidationPlatform,
    );

    const phases = SecurityGatewayManifestPlatform.phaseReferences;
    assert.equal(phases.length, 4);
    assert.equal(phases[0]?.module, "securityGatewayFoundation.ts");
    assert.equal(phases[1]?.module, "securityGatewayRegistry.ts");
    assert.equal(phases[2]?.module, "securityGatewayModel.ts");
    assert.equal(phases[3]?.module, "securityGatewayValidation.ts");
    assert.ok(phases.every((item) => item.ownership === "Referenced"));
    assert.ok(phases.every((item) => item.reconstructsPhase === false));
  });

  it("derives all inventory counts from canonical upstream collections", () => {
    const inventory = SecurityGatewayManifestPlatform.inventory;
    const validation = SecurityGatewayValidationPlatform;
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
    assert.equal(
      byKey.securityContracts,
      foundation.contracts.contractCount,
    );
    assert.equal(
      byKey.securityCapabilities,
      foundation.capabilities.capabilityCount,
    );
    assert.equal(
      byKey.securityLifecycle,
      foundation.lifecycle.stateCount,
    );
    assert.equal(
      byKey.securityIdentities,
      registry.collections.securityIdentityCount,
    );
    assert.equal(
      byKey.securityClassifications,
      registry.collections.classificationCount,
    );
    assert.equal(
      byKey.authenticationMethods,
      registry.collections.authenticationMethodCount,
    );
    assert.equal(
      byKey.authorizationLevels,
      registry.collections.authorizationLevelCount,
    );
    assert.equal(byKey.trustLevels, registry.collections.trustLevelCount);
    assert.equal(byKey.consentStates, registry.collections.consentStateCount);
    assert.equal(byKey.roles, registry.collections.roleCount);
    assert.equal(byKey.permissions, registry.collections.permissionCount);
    assert.equal(
      byKey.securityPolicies,
      registry.collections.securityPolicyCount,
    );
    assert.equal(byKey.securityEvents, registry.collections.eventCount);
    assert.equal(byKey.contextTypes, registry.collections.contextTypeCount);
    assert.equal(byKey.domainModels, model.domainModels.modelCount);
    assert.equal(
      byKey.modelRelationships,
      model.relationships.relationshipCount,
    );
    assert.equal(byKey.validationCategories, validation.categories.length);
    assert.equal(byKey.validationRules, validation.rules.ruleCount);
    assert.equal(
      byKey.validationRelationships,
      validation.relationships.relationshipCount,
    );
    assert.equal(byKey.validationPolicies, validation.policies.policyCount);
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
    const { ownership, boundaries } = SecurityGatewayManifestPlatform;
    assert.ok(ownership.owns.includes("Manifest Metadata"));
    assert.ok(ownership.owns.includes("Inventory Publication"));
    assert.ok(ownership.owns.includes("Phase References"));
    assert.ok(ownership.owns.includes("Readiness Declaration"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Authentication"));
    assert.ok(ownership.doesNotOwn.includes("Validation Rules"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.equal(ownership.ownsFoundationContracts, false);
    assert.equal(ownership.ownsRuntimeSecurity, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.implementsEncryption, false);
    assert.equal(boundaries.duplicatesUpstreamCollections, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayManifestPlatform;
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
    const summaryA = getSecurityGatewayManifestSummary();
    const summaryB = getSecurityGatewayManifestSummary();
    const inventory = SecurityGatewayManifestPlatform.inventory;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, SecurityGatewayManifestId);
    assert.equal(summaryA.status, "Manifest");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, SecurityGatewayValidationId);
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
      "NEA-4:6 — Security Gateway Platform",
    );
    assert.equal(
      SecurityGatewayManifestPlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SecurityGatewayManifestPlatform.metadata.architectureVersion,
      "NEA-4.0.0",
    );
    assert.equal(
      SecurityGatewayManifestPlatform.metadata.compositionMode,
      "CanonicalReferenceOnly",
    );
    assert.equal(
      SecurityGatewayManifestPlatform.metadata.duplicatesUpstreamCollections,
      false,
    );
  });

  it("declares ReadyForPlatform only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayManifestPlatform.readiness.readiness,
      "ReadyForPlatform",
    );
    assert.equal(
      SecurityGatewayManifestPlatform.readiness
        .architectureCompleteThroughValidation,
      true,
    );
    assert.equal(
      SecurityGatewayManifestPlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(SecurityGatewayManifestPlatform.runtimeBehavior, false);
    assert.equal(
      SecurityGatewayManifestPlatform.executesAuthentication,
      false,
    );
    assert.equal(
      SecurityGatewayManifestPlatform.executesAuthorization,
      false,
    );
    assert.equal(SecurityGatewayManifestPlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayManifestPlatform.runtimeSecurity, false);
    assert.equal(SecurityGatewayManifestPlatform.validationExecution, false);
    assert.equal(SecurityGatewayManifestPlatform.aiReasoning, false);
  });
});
