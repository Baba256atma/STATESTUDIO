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
import { createRoleDefinition, listCanonicalRoles, type RoleDefinition } from "./identityRoleIndex.ts";
import {
  createPermissionAssignment,
  createPermissionDefinition,
  getPermissionAssignmentsForIdentity,
  getPermissionAssignmentsForRole,
  getPermissionAssignmentsForScope,
  isPermissionAction,
  isPermissionLifecycleState,
  isPermissionResource,
  listCanonicalPermissionActions,
  listCanonicalPermissionResources,
  validatePermissionAssignment,
  validatePermissionAssignmentCollection,
  validatePermissionDefinition,
} from "./identityPermissionIndex.ts";
import type { PermissionAssignment, PermissionDefinition } from "./identityPermissionIndex.ts";
import type { CreatePermissionAssignmentInput } from "./identityPermissionIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-5"],
  metadata: { phase: "permission" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const tenant = identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" });
const organization = identity({ id: "org:a", type: "Organization", displayName: "Organization A" });
const workspace = identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" });
const project = identity({ id: "project:a", type: "Project", displayName: "Project A" });
const user = identity({ id: "user:a", type: "User", displayName: "User A" });
const service = identity({ id: "service:a", type: "Service", displayName: "Service A" });

function registryWith(identities: readonly NexoraIdentity[]): IdentityRegistry {
  return identities.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-5-test")
  );
}

const registry = registryWith([tenant, organization, workspace, project, user, service]);

function scopeGraph(): IdentityScopeGraph {
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
    createIdentityScope({
      identityId: "user:a",
      identityType: "User",
      scopeLevel: "Organization",
      ownerIdentityId: "org:a",
      parentIdentityId: "org:a",
      tenantId: "tenant:a",
      organizationId: "org:a",
      path: ["tenant:a", "org:a", "user:a"],
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

const roleDefinitions: readonly RoleDefinition[] = listCanonicalRoles();

const permissionDefinitions: readonly PermissionDefinition[] = Object.freeze([
  createPermissionDefinition({ action: "read", resource: "workspace" }),
  createPermissionDefinition({ action: "manage", resource: "project" }),
  createPermissionDefinition({ action: "execute", resource: "service" }),
]);

function assignment(input: Partial<CreatePermissionAssignmentInput> = {}): PermissionAssignment {
  return createPermissionAssignment({
    permissionId: input.permissionId ?? "permission:workspace:read",
    action: input.action ?? "read",
    resource: input.resource ?? "workspace",
    subjectType: input.subjectType ?? "Identity",
    subjectIdentityId: input.subjectIdentityId,
    roleId: input.roleId,
    scopeIdentityId: input.scopeIdentityId ?? "workspace:a",
    scopeLevel: input.scopeLevel ?? "Workspace",
    assignedBy: input.assignedBy ?? "user:founder",
    assignedAt: input.assignedAt ?? "2026-06-30T00:00:00.000Z",
    lifecycleState: input.lifecycleState ?? "Active",
    assignmentId: input.assignmentId,
    metadata: input.metadata,
    version: input.version,
  });
}

test("lists canonical permission actions", () => {
  assert.deepEqual(listCanonicalPermissionActions(), [
    "read",
    "create",
    "update",
    "delete",
    "archive",
    "restore",
    "execute",
    "simulate",
    "compare",
    "export",
    "manage",
  ]);
  assert.equal(isPermissionAction("read"), true);
  assert.equal(isPermissionAction("approve"), false);
});

test("lists canonical permission resources", () => {
  assert.deepEqual(listCanonicalPermissionResources(), [
    "identity",
    "organization",
    "workspace",
    "project",
    "object",
    "scenario",
    "dashboard",
    "assistant",
    "report",
    "dataSource",
    "service",
    "api",
  ]);
  assert.equal(isPermissionResource("workspace"), true);
  assert.equal(isPermissionResource("billing"), false);
});

test("creates permission definitions with deterministic defaults", () => {
  const definition = createPermissionDefinition({ action: "simulate", resource: "scenario" });

  assert.equal(definition.contractVersion, "IDN-5");
  assert.equal(definition.permissionId, "permission:scenario:simulate");
  assert.equal(definition.lifecycleState, "Active");
  assert.equal(validatePermissionDefinition(definition).valid, true);
});

test("creates permission assignments with deterministic defaults", () => {
  const permissionAssignment = assignment({ subjectIdentityId: "user:a" });

  assert.equal(permissionAssignment.contractVersion, "IDN-5");
  assert.equal(permissionAssignment.assignmentId, "permission:workspace:read:Identity:user:a:workspace:a:Workspace");
  assert.equal(permissionAssignment.lifecycleState, "Active");
});

test("validates role-based permission assignments", () => {
  const permissionAssignment = assignment({
    permissionId: "permission:project:manage",
    action: "manage",
    resource: "project",
    subjectType: "Role",
    roleId: "role:manager",
    scopeIdentityId: "project:a",
    scopeLevel: "Project",
  });

  assert.equal(
    validatePermissionAssignment(permissionAssignment, registry, scopeGraph(), permissionDefinitions, roleDefinitions).valid,
    true
  );
});

test("validates identity-based permission assignments", () => {
  const permissionAssignment = assignment({ subjectIdentityId: "user:a" });

  assert.equal(
    validatePermissionAssignment(permissionAssignment, registry, scopeGraph(), permissionDefinitions, roleDefinitions).valid,
    true
  );
});

test("detects invalid actions", () => {
  const invalidDefinition = {
    ...createPermissionDefinition({ action: "read", resource: "workspace" }),
    action: "approve",
  } as unknown as PermissionDefinition;
  const invalidAssignment = {
    ...assignment({ subjectIdentityId: "user:a" }),
    action: "approve",
  } as unknown as PermissionAssignment;

  assert.equal(validatePermissionDefinition(invalidDefinition).issues.some((issue) => issue.code === "invalid_action"), true);
  assert.equal(
    validatePermissionAssignment(invalidAssignment, registry, scopeGraph(), permissionDefinitions, roleDefinitions).issues.some(
      (issue) => issue.code === "invalid_action"
    ),
    true
  );
});

test("detects invalid resources", () => {
  const invalidDefinition = {
    ...createPermissionDefinition({ action: "read", resource: "workspace" }),
    resource: "billing",
  } as unknown as PermissionDefinition;
  const invalidAssignment = {
    ...assignment({ subjectIdentityId: "user:a" }),
    resource: "billing",
  } as unknown as PermissionAssignment;

  assert.equal(validatePermissionDefinition(invalidDefinition).issues.some((issue) => issue.code === "invalid_resource"), true);
  assert.equal(
    validatePermissionAssignment(invalidAssignment, registry, scopeGraph(), permissionDefinitions, roleDefinitions).issues.some(
      (issue) => issue.code === "invalid_resource"
    ),
    true
  );
});

test("detects duplicate permission assignments", () => {
  const first = assignment({ assignmentId: "permission-assignment:duplicate", subjectIdentityId: "user:a" });
  const second = assignment({ assignmentId: "permission-assignment:duplicate", subjectIdentityId: "service:a" });
  const validation = validatePermissionAssignmentCollection(
    [first, second],
    registry,
    scopeGraph(),
    permissionDefinitions,
    roleDefinitions
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_assignment"), true);
});

test("detects invalid scope references", () => {
  const invalidScope = assignment({
    subjectIdentityId: "user:a",
    scopeIdentityId: "project:a",
    scopeLevel: "Workspace",
  });
  const validation = validatePermissionAssignment(invalidScope, registry, scopeGraph(), permissionDefinitions, roleDefinitions);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_scope"), true);
});

test("queries assignments by identity", () => {
  const assignments = [
    assignment({ assignmentId: "assignment:identity", subjectIdentityId: "user:a" }),
    assignment({
      assignmentId: "assignment:role",
      subjectType: "Role",
      roleId: "role:manager",
      permissionId: "permission:project:manage",
      action: "manage",
      resource: "project",
      scopeIdentityId: "project:a",
      scopeLevel: "Project",
    }),
  ];

  assert.deepEqual(
    getPermissionAssignmentsForIdentity(assignments, "user:a").map((entry) => entry.assignmentId),
    ["assignment:identity"]
  );
});

test("queries assignments by role", () => {
  const assignments = [
    assignment({ assignmentId: "assignment:identity", subjectIdentityId: "user:a" }),
    assignment({
      assignmentId: "assignment:role",
      subjectType: "Role",
      roleId: "role:manager",
      permissionId: "permission:project:manage",
      action: "manage",
      resource: "project",
      scopeIdentityId: "project:a",
      scopeLevel: "Project",
    }),
  ];

  assert.deepEqual(
    getPermissionAssignmentsForRole(assignments, "role:manager").map((entry) => entry.assignmentId),
    ["assignment:role"]
  );
});

test("queries assignments by scope", () => {
  const assignments = [
    assignment({ assignmentId: "assignment:workspace", subjectIdentityId: "user:a" }),
    assignment({
      assignmentId: "assignment:project",
      subjectType: "Role",
      roleId: "role:manager",
      permissionId: "permission:project:manage",
      action: "manage",
      resource: "project",
      scopeIdentityId: "project:a",
      scopeLevel: "Project",
    }),
  ];

  assert.deepEqual(
    getPermissionAssignmentsForScope(assignments, "project:a").map((entry) => entry.assignmentId),
    ["assignment:project"]
  );
});

test("detects invalid lifecycle and broken subject references", () => {
  const invalidLifecycle = {
    ...assignment({ subjectIdentityId: "user:a" }),
    lifecycleState: "Suspended",
  } as unknown as PermissionAssignment;
  const missingRole = assignment({
    subjectType: "Role",
    roleId: "role:missing",
  });
  const missingIdentity = assignment({
    subjectIdentityId: "missing:identity",
  });

  assert.equal(isPermissionLifecycleState("Revoked"), true);
  assert.equal(
    validatePermissionAssignment(invalidLifecycle, registry, scopeGraph(), permissionDefinitions, roleDefinitions).issues.some(
      (issue) => issue.code === "invalid_lifecycle"
    ),
    true
  );
  assert.equal(
    validatePermissionAssignment(missingRole, registry, scopeGraph(), permissionDefinitions, roleDefinitions).issues.some(
      (issue) => issue.code === "broken_role_reference"
    ),
    true
  );
  assert.equal(
    validatePermissionAssignment(missingIdentity, registry, scopeGraph(), permissionDefinitions, roleDefinitions).issues.some(
      (issue) => issue.code === "broken_identity_reference"
    ),
    true
  );
});

test("keeps IDN-1 through IDN-4 public contracts consumer-safe", () => {
  const localRegistry = registerIdentity(createIdentityRegistry("idn-5-regression"), tenant).registry;
  const localGraph = scopeGraph();
  const localRole = createRoleDefinition({ roleName: "Viewer" });
  const definition = createPermissionDefinition({ action: "read", resource: "identity" });

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(localGraph.scopes.length > 0, true);
  assert.equal(localRole.roleId, "role:viewer");
  assert.equal(definition.permissionId, "permission:identity:read");
});
