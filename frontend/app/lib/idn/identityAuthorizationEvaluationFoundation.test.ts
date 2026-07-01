import assert from "node:assert/strict";
import test from "node:test";

import { createIdentity, type CreateIdentityInput, type NexoraIdentity } from "./identityIndex.ts";
import { createIdentityRegistry, registerIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import {
  createIdentityScope,
  createOwnershipRecord,
  type IdentityScope,
  type IdentityScopeGraph,
} from "./identityScopeIndex.ts";
import { createRoleAssignment, createRoleDefinition, listCanonicalRoles, type RoleAssignment } from "./identityRoleIndex.ts";
import {
  createPermissionAssignment,
  createPermissionDefinition,
  type PermissionAssignment,
} from "./identityPermissionIndex.ts";
import {
  createAuthorizationRequest,
  evaluateAuthorization,
  getAuthorizationStatistics,
  getMatchedPermissions,
  getMatchedRoles,
  isAuthorizationDecision,
  isAuthorizationReason,
  validateAuthorizationDecision,
  validateAuthorizationPermissionSet,
  validateAuthorizationRequest,
} from "./identityAuthorizationIndex.ts";
import type { AuthorizationRequest } from "./identityAuthorizationIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-6"],
  metadata: { phase: "authorization" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const tenant = identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" });
const organization = identity({ id: "org:a", type: "Organization", displayName: "Organization A" });
const workspace = identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" });
const project = identity({ id: "project:a", type: "Project", displayName: "Project A" });
const user = identity({ id: "user:a", type: "User", displayName: "User A" });

function registryWith(identities: readonly NexoraIdentity[]): IdentityRegistry {
  return identities.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-6-test")
  );
}

const registry = registryWith([tenant, organization, workspace, project, user]);

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
      identityId: "org:a",
      identityType: "Organization",
      scopeLevel: "Organization",
      ownerIdentityId: "tenant:a",
      parentIdentityId: "tenant:a",
      tenantId: "tenant:a",
      organizationId: "org:a",
      path: ["tenant:a", "org:a"],
    }),
    createIdentityScope({
      identityId: "workspace:a",
      identityType: "Workspace",
      scopeLevel: "Workspace",
      ownerIdentityId: "org:a",
      parentIdentityId: "org:a",
      tenantId: "tenant:a",
      organizationId: "org:a",
      workspaceId: "workspace:a",
      path: ["tenant:a", "org:a", "workspace:a"],
    }),
    createIdentityScope({
      identityId: "project:a",
      identityType: "Project",
      scopeLevel: "Project",
      ownerIdentityId: "workspace:a",
      parentIdentityId: "workspace:a",
      tenantId: "tenant:a",
      organizationId: "org:a",
      workspaceId: "workspace:a",
      projectId: "project:a",
      path: ["tenant:a", "org:a", "workspace:a", "project:a"],
    }),
  ]);

  return Object.freeze({
    scopes,
    ownershipRecords: Object.freeze([
      createOwnershipRecord({
        ownerIdentityId: "Global",
        ownerIdentityType: "Global",
        ownerScopeLevel: "Global",
        childIdentityId: "tenant:a",
        childIdentityType: "Tenant",
        childScopeLevel: "Tenant",
      }),
      createOwnershipRecord({
        ownerIdentityId: "tenant:a",
        ownerIdentityType: "Tenant",
        ownerScopeLevel: "Tenant",
        childIdentityId: "org:a",
        childIdentityType: "Organization",
        childScopeLevel: "Organization",
      }),
      createOwnershipRecord({
        ownerIdentityId: "org:a",
        ownerIdentityType: "Organization",
        ownerScopeLevel: "Organization",
        childIdentityId: "workspace:a",
        childIdentityType: "Workspace",
        childScopeLevel: "Workspace",
      }),
    ]),
  });
}

const permissionDefinitions = Object.freeze([
  createPermissionDefinition({ action: "read", resource: "workspace" }),
  createPermissionDefinition({ action: "manage", resource: "project" }),
  createPermissionDefinition({ action: "export", resource: "report" }),
]);

const roleDefinitions = listCanonicalRoles();

function request(input: Partial<AuthorizationRequest> = {}): AuthorizationRequest {
  return createAuthorizationRequest({
    requestId: input.requestId ?? "request:read-workspace",
    subjectIdentityId: input.subjectIdentityId ?? "user:a",
    action: input.action ?? "read",
    resource: input.resource ?? "workspace",
    resourceIdentityId: input.resourceIdentityId,
    scopeIdentityId: input.scopeIdentityId ?? "workspace:a",
    timestamp: input.timestamp ?? "2026-06-30T00:00:00.000Z",
    metadata: input.metadata,
  });
}

function directPermission(input: Partial<PermissionAssignment> = {}): PermissionAssignment {
  return createPermissionAssignment({
    permissionId: input.permissionId ?? "permission:workspace:read",
    action: input.action ?? "read",
    resource: input.resource ?? "workspace",
    subjectType: "Identity",
    subjectIdentityId: input.subjectIdentityId ?? "user:a",
    scopeIdentityId: input.scopeIdentityId ?? "workspace:a",
    scopeLevel: input.scopeLevel === "Workspace" || input.scopeLevel === "Project" || input.scopeLevel === "Tenant" || input.scopeLevel === "Organization" || input.scopeLevel === "Global" ? input.scopeLevel : "Workspace",
    assignedBy: "user:founder",
    assignedAt: "2026-06-30T00:00:00.000Z",
    lifecycleState: input.lifecycleState ?? "Active",
    assignmentId: input.assignmentId,
  });
}

function roleAssignment(input: Partial<RoleAssignment> = {}): RoleAssignment {
  return createRoleAssignment({
    roleId: input.roleId ?? "role:manager",
    roleName: input.roleName ?? "Manager",
    subjectIdentityId: input.subjectIdentityId ?? "user:a",
    subjectIdentityType: input.subjectIdentityType ?? "User",
    scopeIdentityId: input.scopeIdentityId ?? "project:a",
    scopeLevel: input.scopeLevel ?? "Project",
    assignedBy: "user:founder",
    assignedAt: "2026-06-30T00:00:00.000Z",
    lifecycleState: input.lifecycleState ?? "Active",
    assignmentId: input.assignmentId,
  });
}

function rolePermission(input: Partial<PermissionAssignment> = {}): PermissionAssignment {
  return createPermissionAssignment({
    permissionId: input.permissionId ?? "permission:project:manage",
    action: input.action ?? "manage",
    resource: input.resource ?? "project",
    subjectType: "Role",
    roleId: input.roleId ?? "role:manager",
    scopeIdentityId: input.scopeIdentityId ?? "project:a",
    scopeLevel: input.scopeLevel === "Workspace" || input.scopeLevel === "Project" || input.scopeLevel === "Tenant" || input.scopeLevel === "Organization" || input.scopeLevel === "Global" ? input.scopeLevel : "Project",
    assignedBy: "user:founder",
    assignedAt: "2026-06-30T00:00:00.000Z",
    lifecycleState: input.lifecycleState ?? "Active",
    assignmentId: input.assignmentId,
  });
}

test("creates authorization requests", () => {
  const authorizationRequest = request();

  assert.equal(authorizationRequest.contractVersion, "IDN-6");
  assert.equal(authorizationRequest.requestId, "request:read-workspace");
  assert.equal(authorizationRequest.action, "read");
});

test("validates authorization requests", () => {
  assert.equal(validateAuthorizationRequest(request(), registry, graph()).valid, true);

  const invalid = { ...request(), action: "approve" } as unknown as AuthorizationRequest;
  const validation = validateAuthorizationRequest(invalid, registry, graph());

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_action"), true);
});

test("allows by direct permission", () => {
  const decision = evaluateAuthorization(
    {
      request: request(),
      roleAssignments: [],
      permissionAssignments: [directPermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Allow");
  assert.deepEqual(decision.matchedPermissionIds, ["permission:workspace:read"]);
  assert.deepEqual(decision.matchedRoleIds, []);
  assert.equal(decision.denialReason, null);
});

test("allows by role permission", () => {
  const decision = evaluateAuthorization(
    {
      request: request({
        requestId: "request:manage-project",
        action: "manage",
        resource: "project",
        scopeIdentityId: "project:a",
      }),
      roleAssignments: [roleAssignment()],
      permissionAssignments: [rolePermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Allow");
  assert.deepEqual(decision.matchedPermissionIds, ["permission:project:manage"]);
  assert.deepEqual(decision.matchedRoleIds, ["role:manager"]);
});

test("denies when permission is missing", () => {
  const decision = evaluateAuthorization(
    {
      request: request({ action: "delete", resource: "workspace" }),
      roleAssignments: [],
      permissionAssignments: [directPermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Deny");
  assert.equal(decision.denialReason, "PermissionMissing");
});

test("denies when scope mismatches", () => {
  const decision = evaluateAuthorization(
    {
      request: request({ scopeIdentityId: "project:a" }),
      roleAssignments: [],
      permissionAssignments: [directPermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Deny");
  assert.equal(decision.denialReason, "ScopeMismatch");
});

test("denies when resource mismatches", () => {
  const decision = evaluateAuthorization(
    {
      request: request({ resource: "project" }),
      roleAssignments: [],
      permissionAssignments: [directPermission({ resource: "workspace" })],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Deny");
  assert.equal(decision.denialReason, "ResourceMismatch");
});

test("reports inactive permission", () => {
  const duplicated = directPermission({ assignmentId: "permission:duplicate" });
  const decision = evaluateAuthorization(
    {
      request: request(),
      roleAssignments: [],
      permissionAssignments: [directPermission({ lifecycleState: "Revoked" })],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Deny");
  assert.equal(decision.denialReason, "PermissionInactive");
  assert.equal(validateAuthorizationPermissionSet([directPermission({ lifecycleState: "Revoked" })]).valid, false);
  assert.equal(validateAuthorizationPermissionSet([duplicated, duplicated]).valid, false);
});

test("reports inactive role", () => {
  const decision = evaluateAuthorization(
    {
      request: request({ action: "manage", resource: "project", scopeIdentityId: "project:a" }),
      roleAssignments: [roleAssignment({ lifecycleState: "Revoked" })],
      permissionAssignments: [rolePermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Deny");
  assert.equal(decision.denialReason, "RoleInactive");
});

test("returns indeterminate for invalid request", () => {
  const invalid = request({ subjectIdentityId: "missing:user" });
  const decision = evaluateAuthorization(
    {
      request: invalid,
      roleAssignments: [],
      permissionAssignments: [],
    },
    registry,
    graph()
  );

  assert.equal(decision.decision, "Indeterminate");
  assert.equal(decision.denialReason, "InvalidRequest");
});

test("generates structured explanations", () => {
  const decision = evaluateAuthorization(
    {
      request: request(),
      roleAssignments: [],
      permissionAssignments: [directPermission()],
    },
    registry,
    graph()
  );

  assert.equal(decision.explanation.evaluatedIdentity, "user:a");
  assert.equal(decision.explanation.evaluatedScope, "workspace:a");
  assert.deepEqual(getMatchedPermissions(decision.explanation), ["permission:workspace:read"]);
  assert.deepEqual(getMatchedRoles(decision.explanation), []);
  assert.equal(validateAuthorizationDecision(decision).valid, true);
});

test("generates authorization statistics", () => {
  const allowed = evaluateAuthorization(
    { request: request(), roleAssignments: [], permissionAssignments: [directPermission()] },
    registry,
    graph()
  );
  const deniedRequest = request({ requestId: "request:denied", action: "delete" });
  const denied = evaluateAuthorization(
    { request: deniedRequest, roleAssignments: [], permissionAssignments: [directPermission()] },
    registry,
    graph()
  );

  const statistics = getAuthorizationStatistics([allowed, denied], [request(), deniedRequest]);

  assert.equal(statistics.totalEvaluations, 2);
  assert.equal(statistics.allowCount, 1);
  assert.equal(statistics.denyCount, 1);
  assert.equal(statistics.evaluationsByAction.read, 1);
  assert.equal(statistics.evaluationsByAction.delete, 1);
});

test("recognizes canonical decision and reason values", () => {
  assert.equal(isAuthorizationDecision("Allow"), true);
  assert.equal(isAuthorizationDecision("Block"), false);
  assert.equal(isAuthorizationReason("PermissionGranted"), true);
  assert.equal(isAuthorizationReason("Unknown"), false);
});

test("keeps IDN-1 through IDN-5 public contracts consumer-safe", () => {
  const localRegistry = registerIdentity(createIdentityRegistry("idn-6-regression"), tenant).registry;
  const localRole = createRoleDefinition({ roleName: "Viewer" });
  const localPermission = createPermissionDefinition({ action: "read", resource: "identity" });
  const localRequest = createAuthorizationRequest({
    requestId: "request:regression",
    subjectIdentityId: "tenant:a",
    action: "read",
    resource: "identity",
    scopeIdentityId: "tenant:a",
    timestamp: "2026-06-30T00:00:00.000Z",
  });

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(localRole.roleId, "role:viewer");
  assert.equal(localPermission.permissionId, "permission:identity:read");
  assert.equal(localRequest.contractVersion, "IDN-6");
  assert.equal(roleDefinitions.length > 0 && permissionDefinitions.length > 0, true);
});
