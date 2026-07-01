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
import {
  createRoleAssignment,
  createRoleDefinition,
  getRoleAssignmentsForIdentity,
  getRoleAssignmentsForScope,
  isIdentityRole,
  isRoleLifecycleState,
  isRoleScopeAllowed,
  listCanonicalRoles,
  validateRoleAssignment,
  validateRoleAssignmentCollection,
  validateRoleDefinition,
} from "./identityRoleIndex.ts";
import type { RoleAssignment, RoleDefinition } from "./identityRoleIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-4"],
  metadata: { phase: "role" },
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
    createIdentityRegistry("idn-4-test")
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
    createIdentityScope({
      identityId: "service:a",
      identityType: "Service",
      scopeLevel: "Service",
      ownerIdentityId: "tenant:a",
      parentIdentityId: "tenant:a",
      tenantId: "tenant:a",
      path: ["tenant:a", "service:a"],
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
      createOwnershipRecord({
        ownerIdentityId: "workspace:a",
        ownerIdentityType: "Workspace",
        ownerScopeLevel: "Workspace",
        childIdentityId: "project:a",
        childIdentityType: "Project",
        childScopeLevel: "Project",
      }),
    ]),
  });
}

const definitions = listCanonicalRoles();

function assignment(input: Partial<RoleAssignment> = {}): RoleAssignment {
  return createRoleAssignment({
    roleId: input.roleId ?? "role:analyst",
    roleName: input.roleName ?? "Analyst",
    subjectIdentityId: input.subjectIdentityId ?? "user:a",
    subjectIdentityType: input.subjectIdentityType ?? "User",
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

test("lists canonical role definitions", () => {
  assert.deepEqual(
    definitions.map((definition) => definition.roleName),
    ["Owner", "Executive", "Admin", "Manager", "Analyst", "Operator", "Advisor", "Viewer", "Service", "Agent"]
  );
  assert.equal(isIdentityRole("Owner"), true);
  assert.equal(isIdentityRole("Root"), false);
});

test("creates role definitions with deterministic defaults", () => {
  const definition = createRoleDefinition({ roleName: "Manager" });

  assert.equal(definition.contractVersion, "IDN-4");
  assert.equal(definition.roleId, "role:manager");
  assert.equal(definition.lifecycleState, "Active");
  assert.equal(validateRoleDefinition(definition).valid, true);
});

test("creates role assignments with deterministic defaults", () => {
  const roleAssignment = assignment();

  assert.equal(roleAssignment.contractVersion, "IDN-4");
  assert.equal(roleAssignment.assignmentId, "role:analyst:user:a:workspace:a:Workspace");
  assert.equal(roleAssignment.lifecycleState, "Active");
});

test("validates scoped role assignments", () => {
  const roleAssignment = assignment();
  const validation = validateRoleAssignment(roleAssignment, registry, scopeGraph(), definitions);

  assert.equal(validation.valid, true);
});

test("detects missing subject identities", () => {
  const roleAssignment = assignment({ subjectIdentityId: "missing:user" });
  const validation = validateRoleAssignment(roleAssignment, registry, scopeGraph(), definitions);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_subject_identity"), true);
});

test("detects missing scope identities", () => {
  const roleAssignment = assignment({ scopeIdentityId: "missing:scope" });
  const validation = validateRoleAssignment(roleAssignment, registry, scopeGraph(), definitions);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "missing_scope_identity"), true);
});

test("detects duplicate role assignments", () => {
  const first = assignment({ assignmentId: "assignment:duplicate" });
  const second = assignment({ assignmentId: "assignment:duplicate", subjectIdentityId: "service:a", subjectIdentityType: "Service" });
  const validation = validateRoleAssignmentCollection([first, second], registry, scopeGraph(), definitions);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_role_assignment"), true);
});

test("rejects illegal role scopes", () => {
  const roleAssignment = assignment({
    roleId: "role:operator",
    roleName: "Operator",
    scopeIdentityId: "tenant:a",
    scopeLevel: "Tenant",
  });
  const validation = validateRoleAssignment(roleAssignment, registry, scopeGraph(), definitions);

  assert.equal(isRoleScopeAllowed("Operator", "Tenant"), false);
  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "illegal_role_scope"), true);
});

test("validates lifecycle states", () => {
  const invalidDefinition = {
    ...createRoleDefinition({ roleName: "Viewer" }),
    lifecycleState: "Suspended",
  } as unknown as RoleDefinition;
  const invalidAssignment = {
    ...assignment(),
    lifecycleState: "Suspended",
  } as unknown as RoleAssignment;

  assert.equal(isRoleLifecycleState("Archived"), true);
  assert.equal(validateRoleDefinition(invalidDefinition).issues.some((issue) => issue.code === "invalid_lifecycle_state"), true);
  assert.equal(
    validateRoleAssignment(invalidAssignment, registry, scopeGraph(), definitions).issues.some(
      (issue) => issue.code === "invalid_lifecycle_state"
    ),
    true
  );
});

test("queries assignments by identity", () => {
  const assignments = [
    assignment({ assignmentId: "assignment:1" }),
    assignment({
      assignmentId: "assignment:2",
      roleId: "role:service",
      roleName: "Service",
      subjectIdentityId: "service:a",
      subjectIdentityType: "Service",
      scopeIdentityId: "tenant:a",
      scopeLevel: "Tenant",
    }),
  ];

  assert.deepEqual(
    getRoleAssignmentsForIdentity(assignments, "user:a").map((entry) => entry.assignmentId),
    ["assignment:1"]
  );
});

test("queries assignments by scope", () => {
  const assignments = [
    assignment({ assignmentId: "assignment:workspace" }),
    assignment({
      assignmentId: "assignment:project",
      roleId: "role:manager",
      roleName: "Manager",
      scopeIdentityId: "project:a",
      scopeLevel: "Project",
    }),
  ];

  assert.deepEqual(
    getRoleAssignmentsForScope(assignments, "project:a").map((entry) => entry.assignmentId),
    ["assignment:project"]
  );
});

test("detects broken scope references", () => {
  const roleAssignment = assignment({ scopeIdentityId: "project:a", scopeLevel: "Workspace" });
  const validation = validateRoleAssignment(roleAssignment, registry, scopeGraph(), definitions);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "broken_scope_reference"), true);
});

test("keeps IDN-1 through IDN-3 public contracts consumer-safe", () => {
  const localRegistry = registerIdentity(createIdentityRegistry("idn-4-regression"), tenant).registry;
  const localGraph = scopeGraph();
  const roleAssignment = createRoleAssignment({
    roleId: "role:owner",
    roleName: "Owner",
    subjectIdentityId: "tenant:a",
    subjectIdentityType: "Tenant",
    scopeIdentityId: "tenant:a",
    scopeLevel: "Tenant",
    assignedBy: "user:founder",
    assignedAt: "2026-06-30T00:00:00.000Z",
  });

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(localGraph.scopes.length > 0, true);
  assert.equal(roleAssignment.roleName, "Owner");
});
