/**
 * NEA-4:1 — Security Gateway Foundation Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Foundation.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SessionConversationPublicIndexId } from "./sessionConversationPublicIndex.ts";
import * as FoundationModule from "./securityGatewayFoundation.ts";
import {
  SecurityGatewayFoundationId,
  SecurityGatewayFoundationName,
  SecurityGatewayFoundationNamespace,
  SecurityGatewayFoundationPlatform,
  SecurityGatewayFoundationReadiness,
  SecurityGatewayFoundationStatus,
  SecurityGatewayFoundationVersion,
  getSecurityGatewayFoundationSummary,
} from "./securityGatewayFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA41_FILES = Object.freeze([
  "securityGatewayFoundationTypes.ts",
  "securityGatewayContracts.ts",
  "securityGatewayCapabilities.ts",
  "securityGatewayLifecycle.ts",
  "securityGatewayOwnership.ts",
  "securityGatewayBoundaries.ts",
  "securityGatewayFoundation.ts",
  "securityGatewayFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayFoundationId",
  "SecurityGatewayFoundationVersion",
  "SecurityGatewayFoundationName",
  "SecurityGatewayFoundationNamespace",
  "SecurityGatewayFoundationStatus",
  "SecurityGatewayFoundationReadiness",
  "SecurityGatewayFoundationPlatform",
  "getSecurityGatewayFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const EXPECTED_CONTRACTS = Object.freeze([
  "SecurityIdentity",
  "SecurityContext",
  "AuthenticationContext",
  "AuthorizationContext",
  "TrustContext",
  "ConsentContext",
  "PermissionContext",
  "RoleContext",
  "SecurityPolicy",
  "SecurityMetadata",
  "SecurityOwnership",
  "SecurityBoundary",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "IdentityDeclaration",
  "AuthenticationDeclaration",
  "AuthorizationDeclaration",
  "PermissionDeclaration",
  "RoleDeclaration",
  "TrustDeclaration",
  "ConsentDeclaration",
  "PolicyDeclaration",
  "SecurityClassification",
  "SecurityMetadataManagement",
] as const);

const EXPECTED_LIFECYCLE = Object.freeze([
  "Declared",
  "Classified",
  "Reviewed",
  "Approved",
  "Deprecated",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:1 Security Gateway Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(NEA41_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA41_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical foundation identity, status Foundation, and ReadyForRegistry", () => {
    assert.equal(
      SecurityGatewayFoundationId,
      "NEA-4:1/SecurityGatewayFoundation",
    );
    assert.equal(SecurityGatewayFoundationVersion, "1.0.0");
    assert.equal(
      SecurityGatewayFoundationName,
      "Security Gateway Foundation",
    );
    assert.equal(
      SecurityGatewayFoundationNamespace,
      "nexora.nea.security-gateway.foundation",
    );
    assert.equal(SecurityGatewayFoundationStatus, "Foundation");
    assert.equal(SecurityGatewayFoundationReadiness, "ReadyForRegistry");
    assert.equal(SecurityGatewayFoundationPlatform.identity.phase, "NEA-4:1");
    assert.equal(SecurityGatewayFoundationPlatform.identity.layer, "NEA");
    assert.equal(
      SecurityGatewayFoundationPlatform.identity.publicIndexId,
      SessionConversationPublicIndexId,
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.nextPhase,
      "NEA-4:2 — Security Gateway Registry",
    );
  });

  it("consumes only NEA-3 Session & Conversation Public Index", () => {
    const dependency = SecurityGatewayFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationPublicIndex.ts",
    );
    assert.equal(dependency.publicIndexId, SessionConversationPublicIndexId);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.laterNeaPhaseImport, false);
    assert.equal(dependency.circularDependency, false);
  });

  it("declares twelve security contracts", () => {
    const { contracts } = SecurityGatewayFoundationPlatform;
    assert.equal(contracts.contractCount, 12);
    assert.deepEqual(
      contracts.contracts.map((item) => item.contractId.split("/").at(-1)),
      [...EXPECTED_CONTRACTS],
    );
    assertUnique(
      contracts.contracts.map((item) => item.contractId),
      "contract ids",
    );
    assert.ok(
      contracts.contracts.every((item) => item.runtimeBehavior === "None"),
    );
    assert.ok(contracts.contracts.every((item) => item.metadataOnly === true));
  });

  it("declares ten capabilities and five lifecycle states", () => {
    const { capabilities, lifecycle } = SecurityGatewayFoundationPlatform;
    assert.equal(capabilities.capabilityCount, 10);
    assert.deepEqual(
      capabilities.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.ok(
      capabilities.capabilities.every((item) => item.executesRuntime === false),
    );

    assert.deepEqual([...lifecycle.states], [...EXPECTED_LIFECYCLE]);
    assert.equal(lifecycle.stateCount, 5);
    assert.equal(lifecycle.initialState, "Declared");
    assert.equal(lifecycle.terminalState, "Deprecated");
    assert.equal(lifecycle.executesRuntime, false);
    assert.equal(lifecycle.stateMachine, false);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SecurityGatewayFoundationPlatform;
    assert.ok(ownership.owns.includes("Security architecture"));
    assert.ok(ownership.owns.includes("Security contracts"));
    assert.ok(ownership.owns.includes("Security lifecycle"));
    assert.ok(ownership.doesNotOwn.includes("Authentication Engine"));
    assert.ok(ownership.doesNotOwn.includes("Authorization Engine"));
    assert.ok(ownership.doesNotOwn.includes("OAuth"));
    assert.ok(ownership.doesNotOwn.includes("JWT"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsAuthenticationEngine, false);
    assert.equal(ownership.ownsRuntimeAuthentication, false);
    assert.equal(ownership.ownsEncryption, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Login"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("JWT"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.executesAuthorization, false);
    assert.equal(boundaries.implementsEncryption, false);
    assert.equal(boundaries.generatesTokens, false);
    assert.equal(boundaries.runtimeEnforcement, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.contracts.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from canonical foundation collections", () => {
    const summaryA = getSecurityGatewayFoundationSummary();
    const summaryB = getSecurityGatewayFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, SecurityGatewayFoundationId);
    assert.equal(summaryA.status, "Foundation");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.publicIndexId, SessionConversationPublicIndexId);
    assert.equal(summaryA.contractCount, 12);
    assert.equal(summaryA.capabilityCount, 10);
    assert.equal(summaryA.lifecycleStateCount, 5);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.nextPhase,
      "NEA-4:2 — Security Gateway Registry",
    );
    assert.equal(SecurityGatewayFoundationPlatform.metadata.countsHardcoded, false);
    assert.equal(
      SecurityGatewayFoundationPlatform.metadata.architectureVersion,
      "NEA-4.0.0",
    );
  });

  it("declares ReadyForRegistry only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayFoundationPlatform.readiness.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.readiness.claimsReadyForRegistry,
      true,
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.readiness.claimsReadyForRuntime,
      false,
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.readiness.claimsAuthenticationImplemented,
      false,
    );
    assert.equal(SecurityGatewayFoundationPlatform.runtimeBehavior, false);
    assert.equal(
      SecurityGatewayFoundationPlatform.executesAuthentication,
      false,
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.executesAuthorization,
      false,
    );
    assert.equal(
      SecurityGatewayFoundationPlatform.implementsEncryption,
      false,
    );
    assert.equal(SecurityGatewayFoundationPlatform.implementsOAuth, false);
    assert.equal(SecurityGatewayFoundationPlatform.implementsJwt, false);
    assert.equal(SecurityGatewayFoundationPlatform.generatesTokens, false);
    assert.equal(SecurityGatewayFoundationPlatform.aiReasoning, false);
  });
});
