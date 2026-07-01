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
import { createSessionMetadata, createSessionPermissionSnapshot, createSessionRoleSnapshot } from "./identitySessionIndex.ts";
import {
  createAuditEvent,
  getAuditEventsForActor,
  getAuditEventsForScope,
  getAuditEventsForSession,
  getAuditEventsForTarget,
  isAuditAction,
  isAuditLifecycleState,
  listCanonicalAuditActions,
  validateAuditEvent,
  validateAuditEventCollection,
} from "./identityAuditIndex.ts";
import type { AuditEvent } from "./identityAuditIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-8"],
  metadata: { phase: "audit" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const tenant = identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" });
const organization = identity({ id: "org:a", type: "Organization", displayName: "Organization A" });
const workspace = identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" });
const user = identity({ id: "user:a", type: "User", displayName: "User A" });
const sessionIdentity = identity({ id: "session:a", type: "Session", displayName: "Session A" });

function registryWith(identities: readonly NexoraIdentity[]): IdentityRegistry {
  return identities.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-8-test")
  );
}

const registry = registryWith([tenant, organization, workspace, user, sessionIdentity]);

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

const sessionMetadata = createSessionMetadata({
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
  roleSnapshots: [createSessionRoleSnapshot(roleAssignment)],
  permissionSnapshots: [createSessionPermissionSnapshot(permissionAssignment)],
  lifecycleState: "Active",
  createdAt: "2026-06-30T00:00:00.000Z",
});

function auditEvent(input: Partial<AuditEvent> = {}): AuditEvent {
  return createAuditEvent({
    auditEventId: input.auditEventId,
    action: input.action ?? "role.assigned",
    actor: input.actor ?? {
      actorIdentityId: "user:a",
      actorIdentityType: "User",
    },
    target: input.target ?? {
      targetIdentityId: "workspace:a",
      targetIdentityType: "Workspace",
      resourceType: "workspace",
    },
    scope: input.scope ?? {
      scopeIdentityId: "workspace:a",
      scopeLevel: "Workspace",
    },
    session: input.session ?? {
      sessionId: "session:metadata:a",
      sessionIdentityId: "session:a",
    },
    occurredAt: input.occurredAt ?? "2026-06-30T00:00:00.000Z",
    lifecycleState: input.lifecycleState ?? "Recorded",
    metadata: input.metadata,
    version: input.version,
  });
}

test("creates audit events", () => {
  const event = auditEvent();

  assert.equal(event.contractVersion, "IDN-8");
  assert.equal(event.action, "role.assigned");
  assert.equal(event.actor.actorIdentityId, "user:a");
  assert.equal(validateAuditEvent(event, registry, graph(), [sessionMetadata]).valid, true);
});

test("validates audit actions", () => {
  const invalid = { ...auditEvent(), action: "identity.promoted" } as unknown as AuditEvent;

  assert.equal(listCanonicalAuditActions().includes("authorization.evaluated"), true);
  assert.equal(isAuditAction("session.closed"), true);
  assert.equal(isAuditAction("identity.promoted"), false);
  assert.equal(validateAuditEvent(invalid, registry, graph(), [sessionMetadata]).issues.some((issue) => issue.code === "invalid_audit_action"), true);
});

test("validates audit lifecycle states", () => {
  const invalid = { ...auditEvent(), lifecycleState: "Open" } as unknown as AuditEvent;

  assert.equal(isAuditLifecycleState("Validated"), true);
  assert.equal(isAuditLifecycleState("Open"), false);
  assert.equal(validateAuditEvent(invalid, registry, graph(), [sessionMetadata]).issues.some((issue) => issue.code === "invalid_lifecycle"), true);
});

test("validates audit actors", () => {
  const invalid = auditEvent({
    actor: {
      actorIdentityId: "missing:user",
      actorIdentityType: "User",
    },
  });
  const validation = validateAuditEvent(invalid, registry, graph(), [sessionMetadata]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_actor"), true);
});

test("validates audit targets", () => {
  const invalid = auditEvent({
    target: {
      targetIdentityId: "missing:workspace",
      targetIdentityType: "Workspace",
      resourceType: "workspace",
    },
  });
  const validation = validateAuditEvent(invalid, registry, graph(), [sessionMetadata]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_target"), true);
});

test("validates audit session references", () => {
  const invalid = auditEvent({
    session: {
      sessionId: "missing:session",
      sessionIdentityId: "session:a",
    },
  });
  const validation = validateAuditEvent(invalid, registry, graph(), [sessionMetadata]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_session_reference"), true);
});

test("returns structured issues for malformed audit contracts", () => {
  const malformed = { auditEventId: "", actor: null } as unknown as AuditEvent;
  const validation = validateAuditEvent(malformed, registry, graph(), [sessionMetadata]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_audit_event"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_actor"), true);
  assert.equal(validation.issues.some((issue) => issue.code === "invalid_target"), true);
});

test("detects duplicate audit events", () => {
  const first = auditEvent({ auditEventId: "audit:duplicate" });
  const second = auditEvent({ auditEventId: "audit:duplicate" });
  const validation = validateAuditEventCollection([first, second], registry, graph(), [sessionMetadata]);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((issue) => issue.code === "duplicate_audit_event"), true);
});

test("queries audit events by actor", () => {
  const events = [auditEvent({ auditEventId: "audit:actor" }), auditEvent({
    auditEventId: "audit:other",
    actor: { actorIdentityId: "tenant:a", actorIdentityType: "Tenant" },
  })];

  assert.deepEqual(getAuditEventsForActor(events, "user:a").map((event) => event.auditEventId), ["audit:actor"]);
});

test("queries audit events by target", () => {
  const events = [auditEvent({ auditEventId: "audit:target" }), auditEvent({
    auditEventId: "audit:other",
    target: { targetIdentityId: "org:a", targetIdentityType: "Organization", resourceType: "organization" },
  })];

  assert.deepEqual(getAuditEventsForTarget(events, "workspace:a").map((event) => event.auditEventId), ["audit:target"]);
});

test("queries audit events by session", () => {
  const events = [auditEvent({ auditEventId: "audit:session" }), auditEvent({
    auditEventId: "audit:no-session",
    session: { sessionId: null, sessionIdentityId: null },
  })];

  assert.deepEqual(getAuditEventsForSession(events, "session:metadata:a").map((event) => event.auditEventId), ["audit:session"]);
});

test("queries audit events by scope", () => {
  const events = [auditEvent({ auditEventId: "audit:scope" }), auditEvent({
    auditEventId: "audit:tenant",
    scope: { scopeIdentityId: "tenant:a", scopeLevel: "Tenant" },
  })];

  assert.deepEqual(getAuditEventsForScope(events, "workspace:a").map((event) => event.auditEventId), ["audit:scope"]);
});

test("keeps IDN-1 through IDN-7 public contracts consumer-safe", () => {
  const localRegistry = registerIdentity(createIdentityRegistry("idn-8-regression"), user).registry;
  const event = createAuditEvent({
    action: "session.created",
    actor: { actorIdentityId: "user:a", actorIdentityType: "User" },
    target: { targetIdentityId: "session:a", targetIdentityType: "Session", resourceType: "session" },
    scope: { scopeIdentityId: "workspace:a", scopeLevel: "Workspace" },
    session: { sessionId: sessionMetadata.sessionId, sessionIdentityId: "session:a" },
    occurredAt: "2026-06-30T00:00:00.000Z",
  });

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(sessionMetadata.contractVersion, "IDN-7");
  assert.equal(event.contractVersion, "IDN-8");
});
