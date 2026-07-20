/**
 * NEA-4:2 — Security Gateway Registry Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Registry.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SecurityGatewayFoundationId,
  SecurityGatewayFoundationPlatform,
} from "./securityGatewayFoundation.ts";
import * as RegistryModule from "./securityGatewayRegistry.ts";
import {
  SecurityGatewayRegistryId,
  SecurityGatewayRegistryName,
  SecurityGatewayRegistryNamespace,
  SecurityGatewayRegistryPlatform,
  SecurityGatewayRegistryReadiness,
  SecurityGatewayRegistryStatus,
  SecurityGatewayRegistryVersion,
  getSecurityGatewayRegistrySummary,
} from "./securityGatewayRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA42_FILES = Object.freeze([
  "securityGatewayRegistryTypes.ts",
  "securityGatewayRegistryCollections.ts",
  "securityGatewayRegistryPolicies.ts",
  "securityGatewayRegistryCapabilities.ts",
  "securityGatewayRegistryOwnership.ts",
  "securityGatewayRegistryMetadata.ts",
  "securityGatewayRegistry.ts",
  "securityGatewayRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayRegistryId",
  "SecurityGatewayRegistryVersion",
  "SecurityGatewayRegistryName",
  "SecurityGatewayRegistryNamespace",
  "SecurityGatewayRegistryStatus",
  "SecurityGatewayRegistryReadiness",
  "SecurityGatewayRegistryPlatform",
  "getSecurityGatewayRegistrySummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const EXPECTED_CLASSIFICATIONS = Object.freeze([
  "Public",
  "Internal",
  "Confidential",
  "Restricted",
  "Secret",
  "TopSecret",
] as const);

const EXPECTED_AUTH_METHODS = Object.freeze([
  "Password",
  "SSO",
  "OAuth",
  "OpenIDConnect",
  "SAML",
  "APIKey",
  "Certificate",
  "MFA",
] as const);

const EXPECTED_AUTHZ_LEVELS = Object.freeze([
  "None",
  "Read",
  "Write",
  "Execute",
  "Admin",
  "Owner",
] as const);

const EXPECTED_TRUST = Object.freeze([
  "Unknown",
  "Low",
  "Medium",
  "High",
  "Verified",
] as const);

const EXPECTED_CONSENT = Object.freeze([
  "Unknown",
  "Pending",
  "Granted",
  "Denied",
  "Revoked",
] as const);

const EXPECTED_ROLES = Object.freeze([
  "CEO",
  "Executive",
  "Manager",
  "Employee",
  "System",
  "Service",
  "Connector",
  "ExternalUser",
] as const);

const EXPECTED_SECURITY_POLICIES = Object.freeze([
  "LeastPrivilege",
  "NeedToKnow",
  "SeparationOfDuty",
  "ZeroTrust",
  "AuditRequired",
  "TenantIsolation",
] as const);

const EXPECTED_STATUSES = Object.freeze([
  "Declared",
  "Registered",
  "Certified",
  "Frozen",
  "Deprecated",
] as const);

const EXPECTED_EVENTS = Object.freeze([
  "AuthenticationRequested",
  "AuthorizationChecked",
  "TrustEvaluated",
  "ConsentVerified",
  "PermissionEvaluated",
  "PolicyMatched",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:2 Security Gateway Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(NEA42_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA42_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical registry identity, status Registry, and ReadyForModel", () => {
    assert.equal(SecurityGatewayRegistryId, "NEA-4:2/SecurityGatewayRegistry");
    assert.equal(SecurityGatewayRegistryVersion, "1.0.0");
    assert.equal(SecurityGatewayRegistryName, "Security Gateway Registry");
    assert.equal(
      SecurityGatewayRegistryNamespace,
      "nexora.nea.security-gateway.registry",
    );
    assert.equal(SecurityGatewayRegistryStatus, "Registry");
    assert.equal(SecurityGatewayRegistryReadiness, "ReadyForModel");
    assert.equal(SecurityGatewayRegistryPlatform.identity.phase, "NEA-4:2");
    assert.equal(
      SecurityGatewayRegistryPlatform.identity.foundationId,
      SecurityGatewayFoundationId,
    );
    assert.equal(
      SecurityGatewayRegistryPlatform.nextPhase,
      "NEA-4:3 — Security Gateway Model",
    );
  });

  it("consumes only NEA-4:1 Foundation and preserves Foundation references", () => {
    const dependency = SecurityGatewayRegistryPlatform.dependency;
    assert.equal(dependency.foundationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayFoundation.ts",
    );
    assert.equal(dependency.foundationId, SecurityGatewayFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.duplicatesFoundationValues, false);
    assert.equal(
      SecurityGatewayRegistryPlatform.foundationPlatform,
      SecurityGatewayFoundationPlatform,
    );

    const { collections, capabilities } = SecurityGatewayRegistryPlatform;
    assert.equal(
      collections.contractCount,
      SecurityGatewayFoundationPlatform.contracts.contractCount,
    );
    assert.equal(
      collections.lifecycleEntryCount,
      SecurityGatewayFoundationPlatform.lifecycle.stateCount,
    );
    assert.equal(
      capabilities.capabilityCount,
      SecurityGatewayFoundationPlatform.capabilities.capabilityCount,
    );
    assert.ok(
      collections.contracts.every(
        (item) => item.sourcePhase === "NEA-4:1" && item.foundationReference,
      ),
    );
    assert.ok(
      collections.lifecycleEntries.every(
        (item) => item.sourcePhase === "NEA-4:1" && item.foundationReference,
      ),
    );
    assert.equal(collections.duplicatesFoundationValues, false);
  });

  it("declares unique security identity and permission registries", () => {
    const { collections } = SecurityGatewayRegistryPlatform;
    assert.equal(collections.securityIdentityCount, 8);
    assert.equal(collections.permissionCount, 8);
    assertUnique(
      collections.securityIdentities.map((item) => item.securityId),
      "security ids",
    );
    assertUnique(
      collections.permissions.map((item) => item.permissionId),
      "permission ids",
    );
    assert.ok(
      collections.securityIdentities.every(
        (item) => item.managesRuntimeSecurity === false,
      ),
    );
    assert.ok(
      collections.securityIdentities.every(
        (item) => item.status === "Registered",
      ),
    );
    assert.ok(
      collections.permissions.every(
        (item) => item.enforcesPermission === false,
      ),
    );
    assert.ok(
      collections.securityIdentities.every((item) => item.version === "1.0.0"),
    );
    assert.ok(
      collections.securityIdentities.every((item) => item.classification),
    );
    assert.ok(collections.securityIdentities.every((item) => item.lifecycle));
  });

  it("declares registry-owned vocabularies and Foundation-referenced lifecycle", () => {
    const { collections } = SecurityGatewayRegistryPlatform;
    assert.deepEqual(
      collections.classifications.map((item) => item.id),
      [...EXPECTED_CLASSIFICATIONS],
    );
    assert.deepEqual(
      collections.authenticationMethods.map((item) => item.id),
      [...EXPECTED_AUTH_METHODS],
    );
    assert.deepEqual(
      collections.authorizationLevels.map((item) => item.id),
      [...EXPECTED_AUTHZ_LEVELS],
    );
    assert.deepEqual(
      collections.trustLevels.map((item) => item.id),
      [...EXPECTED_TRUST],
    );
    assert.deepEqual(
      collections.consentStates.map((item) => item.id),
      [...EXPECTED_CONSENT],
    );
    assert.deepEqual(
      collections.roles.map((item) => item.id),
      [...EXPECTED_ROLES],
    );
    assert.deepEqual(
      collections.securityPolicies.map((item) => item.id),
      [...EXPECTED_SECURITY_POLICIES],
    );
    assert.deepEqual(
      collections.statuses.map((item) => item.id),
      [...EXPECTED_STATUSES],
    );
    assert.deepEqual(
      collections.events.map((item) => item.id),
      [...EXPECTED_EVENTS],
    );
    assert.deepEqual(
      [...collections.lifecycleEntries.map((item) => item.id)],
      ["Declared", "Classified", "Reviewed", "Approved", "Deprecated"],
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries, policies } =
      SecurityGatewayRegistryPlatform;
    assert.ok(ownership.owns.includes("Registry Collections"));
    assert.ok(ownership.owns.includes("Identity Registry"));
    assert.ok(ownership.owns.includes("Permission Registry"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("OAuth"));
    assert.ok(ownership.doesNotOwn.includes("JWT"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.equal(ownership.ownsAuthenticationEngine, false);
    assert.equal(ownership.ownsFoundationContracts, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Login"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("JWT"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.executesAuthorization, false);
    assert.equal(boundaries.implementsEncryption, false);
    assert.equal(boundaries.duplicatesFoundationValues, false);
    assert.equal(policies.policyCount, 9);
    assert.equal(policies.executesPolicies, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayRegistryPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 9), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 9);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.collections), true);
    assert.equal(Object.isFrozen(platform.collections.securityIdentities), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.policies), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical registry collections", () => {
    const summaryA = getSecurityGatewayRegistrySummary();
    const summaryB = getSecurityGatewayRegistrySummary();
    const meta = SecurityGatewayRegistryPlatform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, SecurityGatewayRegistryId);
    assert.equal(summaryA.status, "Registry");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, SecurityGatewayFoundationId);
    assert.equal(summaryA.securityIdentityCount, 8);
    assert.equal(summaryA.classificationCount, 6);
    assert.equal(summaryA.authenticationMethodCount, 8);
    assert.equal(summaryA.authorizationLevelCount, 6);
    assert.equal(summaryA.trustLevelCount, 5);
    assert.equal(summaryA.consentStateCount, 5);
    assert.equal(summaryA.roleCount, 8);
    assert.equal(summaryA.permissionCount, 8);
    assert.equal(summaryA.securityPolicyCount, 6);
    assert.equal(summaryA.statusCount, 5);
    assert.equal(summaryA.eventCount, 6);
    assert.equal(summaryA.contextTypeCount, 8);
    assert.equal(summaryA.contractCount, 12);
    assert.equal(summaryA.capabilityCount, 10);
    assert.equal(summaryA.lifecycleEntryCount, 5);
    assert.equal(summaryA.registryPolicyCount, 9);
    assert.equal(summaryA.totalRegistryEntryCount, meta.totalEntryCount);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 9);
    assert.equal(summaryA.nextPhase, "NEA-4:3 — Security Gateway Model");
    assert.equal(meta.countsHardcoded, false);
    assert.equal(meta.duplicatesFoundationValues, false);
  });

  it("declares ReadyForModel only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayRegistryPlatform.readiness.readiness,
      "ReadyForModel",
    );
    assert.equal(
      SecurityGatewayRegistryPlatform.readiness.claimsReadyForModel,
      true,
    );
    assert.equal(
      SecurityGatewayRegistryPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      SecurityGatewayRegistryPlatform.readiness.claimsAuthenticationImplemented,
      false,
    );
    assert.equal(SecurityGatewayRegistryPlatform.runtimeBehavior, false);
    assert.equal(SecurityGatewayRegistryPlatform.executesAuthentication, false);
    assert.equal(SecurityGatewayRegistryPlatform.executesAuthorization, false);
    assert.equal(SecurityGatewayRegistryPlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayRegistryPlatform.implementsOAuth, false);
    assert.equal(SecurityGatewayRegistryPlatform.implementsJwt, false);
    assert.equal(SecurityGatewayRegistryPlatform.generatesTokens, false);
    assert.equal(SecurityGatewayRegistryPlatform.verifiesIdentity, false);
    assert.equal(SecurityGatewayRegistryPlatform.aiReasoning, false);
  });
});
