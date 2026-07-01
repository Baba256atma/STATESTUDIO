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
import { createRoleAssignment } from "./identityRoleIndex.ts";
import { createPermissionAssignment } from "./identityPermissionIndex.ts";
import { createAuthorizationRequest, evaluateAuthorization } from "./identityAuthorizationIndex.ts";
import {
  createSessionContext,
  createSessionMetadata,
  createSessionPermissionSnapshot,
  createSessionRoleSnapshot,
  explainSessionState,
  isSessionActive,
  isSessionLifecycleState,
  validateSessionContext,
  validateSessionMetadata,
} from "./identitySessionIndex.ts";
import type { SessionMetadata } from "./identitySessionIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-7"],
  metadata: { phase: "session" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const tenant = identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" });
const organization = identity({ id: "org:a", type: "Organization", displayName: "Organization A" });
const workspace = identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" });
const project = identity({ id: "project:a", type: "Project", displayName: "Project A" });
const user = identity({ id: "user:a", type: "User", displayName: "User A" });
const sessionIdentity = identity({ id: "session:a", type: "Session", displayName: "Session A" });

function registryWith(identities: readonly NexoraIdentity[]): IdentityRegistry {
  return identities.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-7-test")
  );
}

const registry = registryWith([tenant, organization, workspace, project, user, sessionIdentity]);

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
    ]),
  });
}

const roleAssignment = createRoleAssignment({
  roleId: "role:manager",
  roleName: "Manager",
  subjectIdentityId: "user:a",
  subjectIdentityType: "User",
  scopeIdentityId: "workspace:a",
  scopeLevel: "Workspace",
  assignedBy: "user:founder",
  assignedAt: "2026-06-30T00:00:00.000Z",
});

const permissionAssignment = createPermissionAssignment({
  permissionId: "permission:workspace:read",
  action: "read",
  resource: "workspace",
  subjectType: "Role",
  roleId: "role:manager",
  scopeIdentityId: "workspace:a",
  scopeLevel: "Workspace",
  assignedBy: "user:founder",
  assignedAt: "2026-06-30T00:00:00.000Z",
});

function sessionMetadata(input: Partial<SessionMetadata> = {}): SessionMetadata {
  return createSessionMetadata({
    sessionId: input.sessionId ?? "session:metadata:a",
    sessionIdentityId: input.sessionIdentityId ?? "session:a",
    subjectIdentityId: input.subjectIdentityId ?? "user:a",
    subjectIdentityType: input.subjectIdentityType ?? "User",
    scope: input.scope ?? {
      tenantId: "tenant:a",
      organizationId: "org:a",
      workspaceId: "workspace:a",
      projectId: null,
      activeScopeIdentityId: "workspace:a",
      activeScopeLevel: "Workspace",
    },
    roleSnapshots: input.roleSnapshots ?? [createSessionRoleSnapshot(roleAssignment)],
    permissionSnapshots: input.permissionSnapshots ?? [createSessionPermissionSnapshot(permissionAssignment)],
    lifecycleState: input.lifecycleState ?? "Active",
    createdAt: input.createdAt ?? "2026-06-30T00:00:00.000Z",
    updatedAt: input.updatedAt,
    metadata: input.metadata,
    version: input.version,
  });
}

test("creates session metadata", () => {
  const metadata = sessionMetadata();

  assert.equal(metadata.contractVersion, "IDN-7");
  assert.equal(metadata.subjectIdentityId, "user:a");
  assert.equal(metadata.scope.activeScopeIdentityId, "workspace:a");
  assert.equal(validateSessionMetadata(metadata, registry, graph()).valid, true);
});

test("creates session context", () => {
  const metadata = sessionMetadata();
  const context = createSessionContext({ contextId: "context:a", sessionMetadata: metadata });

  assert.equal(context.contractVersion, "IDN-7");
  assert.equal(context.sessionId, metadata.sessionId);
  assert.equal(context.activeWorkspaceId, "workspace:a");
  assert.equal(validateSessionContext(context, metadata, graph()).valid, true);
});

test("validates lifecycle states", () => {
  const invalid = { ...sessionMetadata(), lifecycleState: "Unknown" } as unknown as SessionMetadata;

  assert.equal(isSessionLifecycleState("Suspended"), true);
  assert.equal(isSessionLifecycleState("Sleeping"), false);
  assert.equal(validateSessionMetadata(invalid, registry, graph()).valid, false);
});

test("detects active sessions", () => {
  assert.equal(isSessionActive(sessionMetadata()), true);
  assert.equal(isSessionActive(sessionMetadata({ lifecycleState: "Closed" })), false);
});

test("detects invalid subject identity", () => {
  const invalid = sessionMetadata({ subjectIdentityId: "missing:user" });
  const validation = validateSessionMetadata(invalid, registry, graph());

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_subject_identity"), true);
});

test("detects invalid scope", () => {
  const invalid = sessionMetadata({
    scope: {
      tenantId: "tenant:a",
      organizationId: "org:a",
      workspaceId: "workspace:missing",
      projectId: null,
      activeScopeIdentityId: "workspace:missing",
      activeScopeLevel: "Workspace",
    },
  });
  const validation = validateSessionMetadata(invalid, registry, graph());

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_scope"), true);
});

test("creates role snapshots", () => {
  const snapshot = createSessionRoleSnapshot(roleAssignment);

  assert.equal(snapshot.roleId, "role:manager");
  assert.equal(snapshot.scopeIdentityId, "workspace:a");
  assert.equal(snapshot.sourceAssignmentId, roleAssignment.assignmentId);
});

test("creates permission snapshots", () => {
  const snapshot = createSessionPermissionSnapshot(permissionAssignment);

  assert.equal(snapshot.permissionId, "permission:workspace:read");
  assert.equal(snapshot.action, "read");
  assert.equal(snapshot.sourceAssignmentId, permissionAssignment.assignmentId);
});

test("explains session state", () => {
  const explanation = explainSessionState(sessionMetadata());

  assert.equal(explanation.active, true);
  assert.equal(explanation.roleCount, 1);
  assert.equal(explanation.permissionCount, 1);
  assert.deepEqual(explanation.reasons, ["SessionActive"]);
});

test("keeps IDN-1 through IDN-6 public contracts consumer-safe", () => {
  const authorizationRequest = createAuthorizationRequest({
    requestId: "request:session-regression",
    subjectIdentityId: "user:a",
    action: "read",
    resource: "workspace",
    scopeIdentityId: "workspace:a",
    timestamp: "2026-06-30T00:00:00.000Z",
  });
  const decision = evaluateAuthorization(
    {
      request: authorizationRequest,
      roleAssignments: [roleAssignment],
      permissionAssignments: [permissionAssignment],
    },
    registry,
    graph()
  );

  assert.equal(registerIdentity(createIdentityRegistry("idn-7-regression"), sessionIdentity).success, true);
  assert.equal(decision.decision, "Allow");
  assert.equal(sessionMetadata().contractVersion, "IDN-7");
});
