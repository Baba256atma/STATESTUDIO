import assert from "node:assert/strict";
import test from "node:test";

import { createIdentity, type CreateIdentityInput, type NexoraIdentity } from "./identityIndex.ts";
import { createIdentityRegistry, registerIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import {
  createIdentityScope,
  createOwnershipRecord,
  type IdentityOwnershipRecord,
  type IdentityScope,
  type IdentityScopeGraph,
} from "./identityScopeIndex.ts";
import { createRoleAssignment } from "./identityRoleIndex.ts";
import { createPermissionAssignment } from "./identityPermissionIndex.ts";
import { createSessionMetadata } from "./identitySessionIndex.ts";
import { createAuditEvent } from "./identityAuditIndex.ts";
import {
  createTenantBoundary,
  detectCrossTenantViolations,
  isTenantBoundaryLifecycleState,
  resolveIdentityTenant,
  validateAuditTenantIsolation,
  validateIdentityTenantIsolation,
  validateOwnershipTenantIsolation,
  validatePermissionTenantIsolation,
  validateRoleTenantIsolation,
  validateSessionTenantIsolation,
  validateTenantBoundary,
} from "./identityTenantIsolationIndex.ts";
import type { TenantBoundary } from "./identityTenantIsolationIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-9"],
  metadata: { phase: "tenant-isolation" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const identities = Object.freeze([
  identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" }),
  identity({ id: "tenant:b", type: "Tenant", displayName: "Tenant B" }),
  identity({ id: "org:a", type: "Organization", displayName: "Organization A" }),
  identity({ id: "org:b", type: "Organization", displayName: "Organization B" }),
  identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" }),
  identity({ id: "workspace:b", type: "Workspace", displayName: "Workspace B" }),
  identity({ id: "user:a", type: "User", displayName: "User A" }),
  identity({ id: "user:b", type: "User", displayName: "User B" }),
  identity({ id: "session:a", type: "Session", displayName: "Session A" }),
] as const);

function registryWith(entries: readonly NexoraIdentity[]): IdentityRegistry {
  return entries.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-9-test")
  );
}

const registry = registryWith(identities);

function scope(
  identityId: string,
  identityType: NexoraIdentity["type"],
  tenantId: string,
  path: readonly string[],
  options: Readonly<{ organizationId?: string | null; workspaceId?: string | null; parentIdentityId?: string | null }> = {}
): IdentityScope {
  return createIdentityScope({
    identityId,
    identityType,
    scopeLevel:
      identityType === "Tenant"
        ? "Tenant"
        : identityType === "Organization"
          ? "Organization"
          : identityType === "Workspace"
            ? "Workspace"
            : identityType === "Session"
              ? "Session"
              : "Organization",
    ownerIdentityId: options.parentIdentityId ?? tenantId,
    parentIdentityId: options.parentIdentityId ?? tenantId,
    tenantId,
    organizationId: options.organizationId ?? null,
    workspaceId: options.workspaceId ?? null,
    path,
  });
}

function graph(): IdentityScopeGraph {
  const scopes: readonly IdentityScope[] = Object.freeze([
    createIdentityScope({
      identityId: "tenant:a",
      identityType: "Tenant",
      scopeLevel: "Tenant",
      tenantId: "tenant:a",
      path: ["tenant:a"],
    }),
    createIdentityScope({
      identityId: "tenant:b",
      identityType: "Tenant",
      scopeLevel: "Tenant",
      tenantId: "tenant:b",
      path: ["tenant:b"],
    }),
    scope("org:a", "Organization", "tenant:a", ["tenant:a", "org:a"], { organizationId: "org:a" }),
    scope("org:b", "Organization", "tenant:b", ["tenant:b", "org:b"], { organizationId: "org:b" }),
    scope("workspace:a", "Workspace", "tenant:a", ["tenant:a", "org:a", "workspace:a"], {
      organizationId: "org:a",
      workspaceId: "workspace:a",
      parentIdentityId: "org:a",
    }),
    scope("workspace:b", "Workspace", "tenant:b", ["tenant:b", "org:b", "workspace:b"], {
      organizationId: "org:b",
      workspaceId: "workspace:b",
      parentIdentityId: "org:b",
    }),
    scope("user:a", "User", "tenant:a", ["tenant:a", "org:a", "user:a"], {
      organizationId: "org:a",
      parentIdentityId: "org:a",
    }),
    scope("user:b", "User", "tenant:b", ["tenant:b", "org:b", "user:b"], {
      organizationId: "org:b",
      parentIdentityId: "org:b",
    }),
    scope("session:a", "Session", "tenant:a", ["tenant:a", "org:a", "workspace:a", "session:a"], {
      organizationId: "org:a",
      workspaceId: "workspace:a",
      parentIdentityId: "workspace:a",
    }),
  ]);

  return Object.freeze({
    scopes,
    ownershipRecords: Object.freeze([]),
  });
}

const boundaries: readonly TenantBoundary[] = Object.freeze([
  createTenantBoundary({ tenantIdentityId: "tenant:a", displayName: "Tenant A Boundary" }),
  createTenantBoundary({ tenantIdentityId: "tenant:b", displayName: "Tenant B Boundary" }),
]);

function ownership(
  ownerIdentityId: string | "Global",
  childIdentityId: string,
  tenantId: string | null
): IdentityOwnershipRecord {
  return createOwnershipRecord({
    ownerIdentityId,
    ownerIdentityType: ownerIdentityId === "Global" ? "Global" : ownerIdentityId.startsWith("tenant") ? "Tenant" : "Organization",
    ownerScopeLevel: ownerIdentityId === "Global" ? "Global" : ownerIdentityId.startsWith("tenant") ? "Tenant" : "Organization",
    childIdentityId,
    childIdentityType: childIdentityId.startsWith("org") ? "Organization" : "Workspace",
    childScopeLevel: childIdentityId.startsWith("org") ? "Organization" : "Workspace",
    tenantId,
  });
}

test("creates tenant boundaries", () => {
  const boundary = createTenantBoundary({ tenantIdentityId: "tenant:a" });

  assert.equal(boundary.contractVersion, "IDN-9");
  assert.equal(boundary.boundaryId, "tenant-boundary:tenant:a");
  assert.equal(boundary.lifecycleState, "Active");
});

test("validates tenant boundaries", () => {
  const valid = validateTenantBoundary(boundaries[0], registry, graph());
  const invalid = validateTenantBoundary(
    { ...boundaries[0], tenantIdentityId: "missing:tenant", lifecycleState: "Open" } as unknown as TenantBoundary,
    registry,
    graph()
  );

  assert.equal(isTenantBoundaryLifecycleState("Suspended"), true);
  assert.equal(isTenantBoundaryLifecycleState("Open"), false);
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
  assert.equal(invalid.issues.some((issue) => issue.code === "missing_tenant"), true);
  assert.equal(invalid.issues.some((issue) => issue.code === "invalid_lifecycle"), true);
});

test("resolves identity tenants", () => {
  assert.equal(resolveIdentityTenant("workspace:a", registry, graph(), boundaries), "tenant:a");
  assert.equal(resolveIdentityTenant("tenant:b", registry, graph(), boundaries), "tenant:b");
  assert.equal(resolveIdentityTenant("Global", registry, graph(), boundaries), null);
  assert.equal(validateIdentityTenantIsolation("workspace:a", "tenant:a", registry, graph(), boundaries).valid, true);
});

test("validates same-tenant ownership", () => {
  const result = validateOwnershipTenantIsolation(ownership("tenant:a", "org:a", "tenant:a"), registry, graph(), boundaries);

  assert.equal(result.valid, true);
  assert.equal(result.tenantId, "tenant:a");
});

test("detects invalid cross-tenant ownership", () => {
  const result = validateOwnershipTenantIsolation(ownership("tenant:a", "org:b", "tenant:a"), registry, graph(), boundaries);

  assert.equal(result.valid, false);
  assert.equal(result.issues.some((issue) => issue.code === "invalid_ownership_tenant"), true);
});

test("validates role tenant consistency", () => {
  const valid = createRoleAssignment({
    roleId: "role:manager",
    roleName: "Manager",
    subjectIdentityId: "user:a",
    subjectIdentityType: "User",
    scopeIdentityId: "workspace:a",
    scopeLevel: "Workspace",
    assignedBy: "user:a",
    assignedAt: "2026-06-30T00:00:00.000Z",
  });
  const invalid = createRoleAssignment({ ...valid, assignmentId: "role:cross", subjectIdentityId: "user:b" });

  assert.equal(validateRoleTenantIsolation(valid, registry, graph(), boundaries).valid, true);
  assert.equal(validateRoleTenantIsolation(invalid, registry, graph(), boundaries).valid, false);
});

test("validates permission tenant consistency", () => {
  const valid = createPermissionAssignment({
    permissionId: "permission:workspace:read",
    action: "read",
    resource: "workspace",
    subjectType: "Identity",
    subjectIdentityId: "user:a",
    scopeIdentityId: "workspace:a",
    scopeLevel: "Workspace",
    assignedBy: "user:a",
    assignedAt: "2026-06-30T00:00:00.000Z",
  });
  const invalid = createPermissionAssignment({
    permissionId: "permission:workspace:read",
    action: "read",
    resource: "workspace",
    subjectType: "Identity",
    subjectIdentityId: "user:a",
    scopeIdentityId: "workspace:a",
    scopeLevel: "Workspace",
    assignedBy: "user:b",
    assignedAt: "2026-06-30T00:00:00.000Z",
    assignmentId: "permission:cross",
  });

  assert.equal(validatePermissionTenantIsolation(valid, registry, graph(), boundaries).valid, true);
  assert.equal(validatePermissionTenantIsolation(invalid, registry, graph(), boundaries).valid, false);
});

test("validates session tenant consistency", () => {
  const valid = createSessionMetadata({
    sessionId: "session:metadata:a",
    sessionIdentityId: "session:a",
    subjectIdentityId: "user:a",
    subjectIdentityType: "User",
    scope: {
      tenantId: "tenant:a",
      organizationId: "org:a",
      workspaceId: "workspace:a",
      projectId: null,
      activeScopeIdentityId: "workspace:a",
      activeScopeLevel: "Workspace",
    },
    createdAt: "2026-06-30T00:00:00.000Z",
  });
  const invalid = createSessionMetadata({ ...valid, sessionId: "session:cross", subjectIdentityId: "user:b" });

  assert.equal(validateSessionTenantIsolation(valid, registry, graph(), boundaries).valid, true);
  assert.equal(validateSessionTenantIsolation(invalid, registry, graph(), boundaries).valid, false);
});

test("validates audit tenant consistency", () => {
  const valid = createAuditEvent({
    auditEventId: "audit:tenant:valid",
    action: "identity.updated",
    actor: { actorIdentityId: "user:a", actorIdentityType: "User" },
    target: { targetIdentityId: "workspace:a", targetIdentityType: "Workspace", resourceType: "workspace" },
    scope: { scopeIdentityId: "workspace:a", scopeLevel: "Workspace" },
    session: { sessionId: "session:metadata:a", sessionIdentityId: "session:a" },
    occurredAt: "2026-06-30T00:00:00.000Z",
  });
  const invalid = createAuditEvent({
    ...valid,
    auditEventId: "audit:tenant:cross",
    target: { targetIdentityId: "workspace:b", targetIdentityType: "Workspace", resourceType: "workspace" },
  });

  assert.equal(validateAuditTenantIsolation(valid, registry, graph(), boundaries).valid, true);
  assert.equal(validateAuditTenantIsolation(invalid, registry, graph(), boundaries).valid, false);
});

test("detects cross-tenant violations across isolation results", () => {
  const violations = detectCrossTenantViolations([
    validateOwnershipTenantIsolation(ownership("tenant:a", "org:b", "tenant:a"), registry, graph(), boundaries),
    validateIdentityTenantIsolation("workspace:a", "tenant:a", registry, graph(), boundaries),
  ]);

  assert.equal(violations.length > 0, true);
  assert.equal(violations.some((violation) => violation.code === "invalid_ownership_tenant"), true);
});

test("keeps IDN-1 through IDN-8 public contracts consumer-safe", () => {
  const event = createAuditEvent({
    action: "session.closed",
    actor: { actorIdentityId: "user:a", actorIdentityType: "User" },
    target: { targetIdentityId: "session:a", targetIdentityType: "Session", resourceType: "session" },
    scope: { scopeIdentityId: "workspace:a", scopeLevel: "Workspace" },
    occurredAt: "2026-06-30T00:00:00.000Z",
  });
  const localRegistry = registerIdentity(createIdentityRegistry("idn-9-regression"), identities[0]).registry;

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(event.contractVersion, "IDN-8");
  assert.equal(boundaries[0].contractVersion, "IDN-9");
});
