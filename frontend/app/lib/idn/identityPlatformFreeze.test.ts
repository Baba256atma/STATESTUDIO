import assert from "node:assert/strict";
import test from "node:test";

import { createIdentity } from "./identityIndex.ts";
import { createIdentityRegistry, registerIdentity } from "./identityRegistryIndex.ts";
import { createIdentityScope } from "./identityScopeIndex.ts";
import { createRoleDefinition } from "./identityRoleIndex.ts";
import { createPermissionDefinition } from "./identityPermissionIndex.ts";
import { createAuthorizationRequest } from "./identityAuthorizationIndex.ts";
import { createSessionMetadata } from "./identitySessionIndex.ts";
import { createAuditEvent } from "./identityAuditIndex.ts";
import { createTenantBoundary } from "./identityTenantIsolationIndex.ts";
import {
  buildIdentityPlatformFreezeManifest,
  getIdentityPlatformCompatibilityMatrix,
  getIdentityPlatformExtensionPolicy,
  getIdentityPlatformFreezeState,
  listIdentityPlatformPhases,
  listIdentityPlatformPublicApis,
  runIdentityPlatformCertification,
  runIdentityPlatformFreeze,
  runIdentityPlatformRegression,
} from "./identityPlatformFreezeIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-10"],
  metadata: { phase: "freeze" },
});

test("publishes the platform phase registry", () => {
  const phases = listIdentityPlatformPhases();

  assert.equal(phases.length, 9);
  assert.deepEqual(phases.map((phase) => phase.phaseId), [
    "IDN-1",
    "IDN-2",
    "IDN-3",
    "IDN-4",
    "IDN-5",
    "IDN-6",
    "IDN-7",
    "IDN-8",
    "IDN-9",
  ]);
  assert.equal(phases.every((phase) => phase.certified && phase.frozen), true);
});

test("publishes the public API registry", () => {
  const publicApis = listIdentityPlatformPublicApis();

  assert.equal(publicApis.length >= 9, true);
  assert.equal(publicApis.every((api) => api.available), true);
  assert.equal(publicApis.some((api) => api.apiName === "createTenantBoundary"), true);
});

test("publishes the compatibility matrix", () => {
  const matrix = getIdentityPlatformCompatibilityMatrix();

  assert.equal(matrix.length, 32);
  assert.equal(matrix.every((entry) => entry.compatible && entry.contract === "public-exports"), true);
  assert.equal(matrix.some((entry) => entry.consumerPhaseId === "IDN-9" && entry.providerPhaseId === "IDN-8"), true);
});

test("publishes the extension policy", () => {
  const policy = getIdentityPlatformExtensionPolicy();

  assert.equal(policy.frozen, true);
  assert.equal(policy.extensionMode, "additive-only");
  assert.equal(policy.breakingChangesAllowed, false);
  assert.equal(policy.runtimeBehaviorAllowed, false);
  assert.equal(policy.requiresNewPhase, true);
});

test("builds the freeze manifest", () => {
  const manifest = buildIdentityPlatformFreezeManifest();

  assert.equal(manifest.contractVersion, "IDN-10");
  assert.equal(manifest.platformId, "nexora-identity-platform");
  assert.equal(manifest.declaration, "The Nexora Identity Platform is Certified, Frozen, and Released.");
  assert.equal(manifest.frozen, true);
  assert.equal(manifest.consumerSafe, true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("passes platform certification", () => {
  const certification = runIdentityPlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
  assert.equal(certification.gates.some((gate) => gate.gateId === "freeze-state-immutable"), true);
});

test("passes platform regression metadata", () => {
  const regression = runIdentityPlatformRegression();

  assert.equal(regression.totalTests, 111);
  assert.equal(regression.passed, 111);
  assert.equal(regression.failed, 0);
  assert.equal(regression.deterministic, true);
});

test("runs the platform freeze", () => {
  const freeze = runIdentityPlatformFreeze();

  assert.equal(freeze.status, "PASS");
  assert.equal(freeze.frozen, true);
  assert.equal(freeze.released, true);
  assert.equal(freeze.manifest.declaration, "The Nexora Identity Platform is Certified, Frozen, and Released.");
});

test("returns an immutable freeze state", () => {
  const freeze = getIdentityPlatformFreezeState();

  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.manifest), true);
  assert.equal(Object.isFrozen(freeze.certification.gates), true);
  assert.equal(Object.isFrozen(freeze.manifest.extensionPolicy.notes), true);
});

test("keeps IDN-1 through IDN-9 public contracts consumer-safe", () => {
  const tenant = createIdentity({
    id: "tenant:freeze",
    type: "Tenant",
    displayName: "Freeze Tenant",
    created,
  });
  const registry = registerIdentity(createIdentityRegistry("freeze-test"), tenant).registry;
  const scope = createIdentityScope({
    identityId: "tenant:freeze",
    identityType: "Tenant",
    scopeLevel: "Tenant",
    tenantId: "tenant:freeze",
    path: ["tenant:freeze"],
  });
  const role = createRoleDefinition({ roleName: "Owner" });
  const permission = createPermissionDefinition({ permissionId: "permission:freeze:read", action: "read", resource: "identity" });
  const authorization = createAuthorizationRequest({
    requestId: "authorization:freeze",
    subjectIdentityId: "tenant:freeze",
    action: "read",
    resource: "identity",
    scopeIdentityId: "tenant:freeze",
    timestamp: "2026-06-30T00:00:00.000Z",
  });
  const session = createSessionMetadata({
    sessionId: "session:freeze:metadata",
    sessionIdentityId: "tenant:freeze",
    subjectIdentityId: "tenant:freeze",
    subjectIdentityType: "Tenant",
    scope: {
      tenantId: "tenant:freeze",
      organizationId: null,
      workspaceId: null,
      projectId: null,
      activeScopeIdentityId: "tenant:freeze",
      activeScopeLevel: "Tenant",
    },
    createdAt: "2026-06-30T00:00:00.000Z",
  });
  const audit = createAuditEvent({
    action: "identity.created",
    actor: { actorIdentityId: "tenant:freeze", actorIdentityType: "Tenant" },
    target: { targetIdentityId: "tenant:freeze", targetIdentityType: "Tenant", resourceType: "identity" },
    scope: { scopeIdentityId: "tenant:freeze", scopeLevel: "Tenant" },
    occurredAt: "2026-06-30T00:00:00.000Z",
  });
  const boundary = createTenantBoundary({ tenantIdentityId: "tenant:freeze" });

  assert.equal(registry.identities.length, 1);
  assert.equal(scope.contractVersion, "IDN-3");
  assert.equal(role.contractVersion, "IDN-4");
  assert.equal(permission.contractVersion, "IDN-5");
  assert.equal(authorization.contractVersion, "IDN-6");
  assert.equal(session.contractVersion, "IDN-7");
  assert.equal(audit.contractVersion, "IDN-8");
  assert.equal(boundary.contractVersion, "IDN-9");
});
