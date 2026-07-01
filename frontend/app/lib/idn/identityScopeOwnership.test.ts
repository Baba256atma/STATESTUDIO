import assert from "node:assert/strict";
import test from "node:test";

import { createIdentity, type CreateIdentityInput, type NexoraIdentity } from "./identityIndex.ts";
import { createIdentityRegistry, registerIdentity } from "./identityRegistryIndex.ts";
import type { IdentityRegistry } from "./identityRegistryIndex.ts";
import {
  createIdentityScope,
  createOwnershipRecord,
  getIdentityScopePath,
  getScopeAncestors,
  getScopeDescendants,
  isIdentityInScope,
  resolveIdentityOwner,
  validateIdentityScope,
  validateOwnershipGraph,
  validateOwnershipRecord,
} from "./identityScopeIndex.ts";
import type { IdentityScope, IdentityScopeGraph } from "./identityScopeIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["idn-3"],
  metadata: { phase: "scope" },
});

function identity(input: Omit<CreateIdentityInput, "created">): NexoraIdentity {
  return createIdentity({ ...input, created });
}

const tenantA = identity({ id: "tenant:a", type: "Tenant", displayName: "Tenant A" });
const tenantB = identity({ id: "tenant:b", type: "Tenant", displayName: "Tenant B" });
const organizationA = identity({ id: "org:a", type: "Organization", displayName: "Organization A" });
const organizationB = identity({ id: "org:b", type: "Organization", displayName: "Organization B" });
const workspaceA = identity({ id: "workspace:a", type: "Workspace", displayName: "Workspace A" });
const projectA = identity({ id: "project:a", type: "Project", displayName: "Project A" });
const objectA = identity({ id: "object:a", type: "Object", displayName: "Object A" });
const userA = identity({ id: "user:a", type: "User", displayName: "User A" });
const serviceA = identity({ id: "service:a", type: "Service", displayName: "Service A" });
const apiA = identity({ id: "api:a", type: "API", displayName: "API A" });

function registryWith(identities: readonly NexoraIdentity[]): IdentityRegistry {
  return identities.reduce(
    (registry, entry) => registerIdentity(registry, entry).registry,
    createIdentityRegistry("idn-3-test")
  );
}

const registry = registryWith([
  tenantA,
  tenantB,
  organizationA,
  organizationB,
  workspaceA,
  projectA,
  objectA,
  userA,
  serviceA,
  apiA,
]);

function baseScopes(): readonly IdentityScope[] {
  const tenantScope = createIdentityScope({
    identityId: "tenant:a",
    identityType: "Tenant",
    scopeLevel: "Tenant",
    ownerIdentityId: null,
    path: ["tenant:a"],
    tenantId: "tenant:a",
  });
  const organizationScope = createIdentityScope({
    identityId: "org:a",
    identityType: "Organization",
    scopeLevel: "Organization",
    ownerIdentityId: "tenant:a",
    parentIdentityId: "tenant:a",
    path: ["tenant:a", "org:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
  });
  const workspaceScope = createIdentityScope({
    identityId: "workspace:a",
    identityType: "Workspace",
    scopeLevel: "Workspace",
    ownerIdentityId: "org:a",
    parentIdentityId: "org:a",
    path: ["tenant:a", "org:a", "workspace:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
    workspaceId: "workspace:a",
  });
  const projectScope = createIdentityScope({
    identityId: "project:a",
    identityType: "Project",
    scopeLevel: "Project",
    ownerIdentityId: "workspace:a",
    parentIdentityId: "workspace:a",
    path: ["tenant:a", "org:a", "workspace:a", "project:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
    workspaceId: "workspace:a",
    projectId: "project:a",
  });
  const objectScope = createIdentityScope({
    identityId: "object:a",
    identityType: "Object",
    scopeLevel: "Object",
    ownerIdentityId: "project:a",
    parentIdentityId: "project:a",
    path: ["tenant:a", "org:a", "workspace:a", "project:a", "object:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
    workspaceId: "workspace:a",
    projectId: "project:a",
  });
  const userScope = createIdentityScope({
    identityId: "user:a",
    identityType: "User",
    scopeLevel: "Organization",
    ownerIdentityId: "org:a",
    parentIdentityId: "org:a",
    path: ["tenant:a", "org:a", "user:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
  });
  const serviceScope = createIdentityScope({
    identityId: "service:a",
    identityType: "Service",
    scopeLevel: "Service",
    ownerIdentityId: "tenant:a",
    parentIdentityId: "tenant:a",
    path: ["tenant:a", "service:a"],
    tenantId: "tenant:a",
  });
  const apiScope = createIdentityScope({
    identityId: "api:a",
    identityType: "API",
    scopeLevel: "Global",
    ownerIdentityId: null,
    path: ["api:a"],
  });

  return Object.freeze([
    tenantScope,
    organizationScope,
    workspaceScope,
    projectScope,
    objectScope,
    userScope,
    serviceScope,
    apiScope,
  ]);
}

function baseGraph(): IdentityScopeGraph {
  return Object.freeze({
    scopes: baseScopes(),
    ownershipRecords: Object.freeze([
      createOwnershipRecord({
        ownerIdentityId: "Global",
        ownerIdentityType: "Global",
        ownerScopeLevel: "Global",
        childIdentityId: "tenant:a",
        childIdentityType: "Tenant",
        childScopeLevel: "Tenant",
        tenantId: "tenant:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "tenant:a",
        ownerIdentityType: "Tenant",
        ownerScopeLevel: "Tenant",
        childIdentityId: "org:a",
        childIdentityType: "Organization",
        childScopeLevel: "Organization",
        tenantId: "tenant:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "org:a",
        ownerIdentityType: "Organization",
        ownerScopeLevel: "Organization",
        childIdentityId: "workspace:a",
        childIdentityType: "Workspace",
        childScopeLevel: "Workspace",
        tenantId: "tenant:a",
        organizationId: "org:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "workspace:a",
        ownerIdentityType: "Workspace",
        ownerScopeLevel: "Workspace",
        childIdentityId: "project:a",
        childIdentityType: "Project",
        childScopeLevel: "Project",
        tenantId: "tenant:a",
        organizationId: "org:a",
        workspaceId: "workspace:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "project:a",
        ownerIdentityType: "Project",
        ownerScopeLevel: "Project",
        childIdentityId: "object:a",
        childIdentityType: "Object",
        childScopeLevel: "Object",
        tenantId: "tenant:a",
        organizationId: "org:a",
        workspaceId: "workspace:a",
        projectId: "project:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "org:a",
        ownerIdentityType: "Organization",
        ownerScopeLevel: "Organization",
        childIdentityId: "user:a",
        childIdentityType: "User",
        childScopeLevel: "Organization",
        tenantId: "tenant:a",
        organizationId: "org:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "tenant:a",
        ownerIdentityType: "Tenant",
        ownerScopeLevel: "Tenant",
        childIdentityId: "service:a",
        childIdentityType: "Service",
        childScopeLevel: "Service",
        tenantId: "tenant:a",
      }),
      createOwnershipRecord({
        ownerIdentityId: "Global",
        ownerIdentityType: "Global",
        ownerScopeLevel: "Global",
        childIdentityId: "api:a",
        childIdentityType: "API",
        childScopeLevel: "Global",
      }),
    ]),
  });
}

test("creates valid deterministic identity scopes", () => {
  const scope = baseScopes()[4];

  assert.equal(scope?.identityId, "object:a");
  assert.deepEqual(getIdentityScopePath(scope), ["tenant:a", "org:a", "workspace:a", "project:a", "object:a"]);
  assert.equal(validateIdentityScope(scope).valid, true);
});

test("creates valid ownership records", () => {
  const record = createOwnershipRecord({
    ownerIdentityId: "project:a",
    ownerIdentityType: "Project",
    ownerScopeLevel: "Project",
    childIdentityId: "object:a",
    childIdentityType: "Object",
    childScopeLevel: "Object",
    tenantId: "tenant:a",
    projectId: "project:a",
  });

  assert.equal(record.recordId, "project:a->object:a");
  assert.equal(validateOwnershipRecord(record, registry).valid, true);
});

test("rejects illegal ownership containment", () => {
  const illegal = createOwnershipRecord({
    ownerIdentityId: "workspace:a",
    ownerIdentityType: "Workspace",
    ownerScopeLevel: "Workspace",
    childIdentityId: "tenant:a",
    childIdentityType: "Tenant",
    childScopeLevel: "Tenant",
  });

  const validation = validateOwnershipRecord(illegal, registry);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "illegal_containment"), true);
});

test("resolves scope path and membership", () => {
  const objectScope = baseScopes()[4];

  assert.equal(isIdentityInScope("workspace:a", objectScope), true);
  assert.equal(isIdentityInScope("service:a", objectScope), false);
});

test("resolves scope ancestors", () => {
  const graph = baseGraph();

  assert.deepEqual(
    getScopeAncestors(graph, "object:a").map((scope) => scope.identityId),
    ["tenant:a", "org:a", "workspace:a", "project:a"]
  );
});

test("resolves scope descendants", () => {
  const graph = baseGraph();

  assert.deepEqual(
    getScopeDescendants(graph, "workspace:a").map((scope) => scope.identityId),
    ["object:a", "project:a"]
  );
});

test("resolves identity owner records", () => {
  const graph = baseGraph();
  const owner = resolveIdentityOwner(graph.ownershipRecords, "workspace:a");

  assert.equal(owner.found, true);
  assert.equal(owner.record?.ownerIdentityId, "org:a");
});

test("validates the complete ownership graph", () => {
  const validation = validateOwnershipGraph(baseGraph(), registry);

  assert.equal(validation.valid, true);
});

test("detects circular ownership", () => {
  const graph = baseGraph();
  const circularGraph: IdentityScopeGraph = Object.freeze({
    scopes: graph.scopes,
    ownershipRecords: Object.freeze([
      ...graph.ownershipRecords,
      createOwnershipRecord({
        ownerIdentityId: "object:a",
        ownerIdentityType: "Object",
        ownerScopeLevel: "Object",
        childIdentityId: "project:a",
        childIdentityType: "Project",
        childScopeLevel: "Project",
        recordId: "cycle",
      }),
    ]),
  });

  const validation = validateOwnershipGraph(circularGraph, registry);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "circular_ownership"), true);
});

test("detects invalid cross-tenant ownership", () => {
  const tenantBScope = createIdentityScope({
    identityId: "tenant:b",
    identityType: "Tenant",
    scopeLevel: "Tenant",
    path: ["tenant:b"],
    tenantId: "tenant:b",
  });
  const organizationBScope = createIdentityScope({
    identityId: "org:b",
    identityType: "Organization",
    scopeLevel: "Organization",
    ownerIdentityId: "tenant:b",
    parentIdentityId: "tenant:b",
    path: ["tenant:b", "org:b"],
    tenantId: "tenant:b",
    organizationId: "org:b",
  });
  const workspaceCrossTenant = createOwnershipRecord({
    ownerIdentityId: "org:a",
    ownerIdentityType: "Organization",
    ownerScopeLevel: "Organization",
    childIdentityId: "workspace:a",
    childIdentityType: "Workspace",
    childScopeLevel: "Workspace",
    tenantId: "tenant:b",
    organizationId: "org:b",
  });
  const crossTenantWorkspaceScope = createIdentityScope({
    identityId: "workspace:a",
    identityType: "Workspace",
    scopeLevel: "Workspace",
    ownerIdentityId: "org:a",
    parentIdentityId: "org:b",
    path: ["tenant:b", "org:b", "workspace:a"],
    tenantId: "tenant:b",
    organizationId: "org:b",
    workspaceId: "workspace:a",
  });

  const validation = validateOwnershipGraph(
    Object.freeze({
      scopes: Object.freeze([tenantBScope, organizationBScope, baseScopes()[1], crossTenantWorkspaceScope]),
      ownershipRecords: Object.freeze([workspaceCrossTenant]),
    }),
    registry
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "invalid_cross_tenant"), true);
});

test("detects orphaned identities and broken ancestry", () => {
  const orphanRecord = createOwnershipRecord({
    ownerIdentityId: "org:a",
    ownerIdentityType: "Organization",
    ownerScopeLevel: "Organization",
    childIdentityId: "workspace:a",
    childIdentityType: "Workspace",
    childScopeLevel: "Workspace",
  });
  const brokenWorkspaceScope = createIdentityScope({
    identityId: "workspace:a",
    identityType: "Workspace",
    scopeLevel: "Workspace",
    ownerIdentityId: "org:a",
    parentIdentityId: "tenant:a",
    path: ["tenant:a", "workspace:a"],
    tenantId: "tenant:a",
    organizationId: "org:a",
  });

  const validation = validateOwnershipGraph(
    Object.freeze({
      scopes: Object.freeze([brokenWorkspaceScope]),
      ownershipRecords: Object.freeze([orphanRecord]),
    }),
    registry
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "broken_ancestry"), true);
});

test("detects duplicate ownership records", () => {
  const graph = baseGraph();
  const duplicateGraph: IdentityScopeGraph = Object.freeze({
    scopes: graph.scopes,
    ownershipRecords: Object.freeze([...graph.ownershipRecords, graph.ownershipRecords[2]]),
  });

  const validation = validateOwnershipGraph(duplicateGraph, registry);

  assert.equal(validation.valid, false);
  assert.equal(validation.issues.some((entry) => entry.code === "duplicate_ownership"), true);
});

test("detects invalid scope levels, inconsistent paths, and missing owners", () => {
  const invalidScope = {
    ...createIdentityScope({
      identityId: "workspace:a",
      identityType: "Workspace",
      scopeLevel: "Workspace",
      path: ["tenant:a", "org:a"],
      parentIdentityId: "missing:parent",
    }),
    scopeLevel: "Domain",
  } as unknown as IdentityScope;
  const missingOwner = createOwnershipRecord({
    ownerIdentityId: "missing:owner",
    ownerIdentityType: "Organization",
    ownerScopeLevel: "Organization",
    childIdentityId: "workspace:a",
    childIdentityType: "Workspace",
    childScopeLevel: "Workspace",
  });

  const scopeValidation = validateIdentityScope(invalidScope);
  const ownershipValidation = validateOwnershipRecord(missingOwner, registry);

  assert.equal(scopeValidation.valid, false);
  assert.equal(scopeValidation.issues.some((entry) => entry.code === "invalid_scope_level"), true);
  assert.equal(scopeValidation.issues.some((entry) => entry.code === "scope_path_inconsistent"), true);
  assert.equal(scopeValidation.issues.some((entry) => entry.code === "invalid_parent"), true);
  assert.equal(ownershipValidation.valid, false);
  assert.equal(ownershipValidation.issues.some((entry) => entry.code === "missing_owner"), true);
});

test("keeps IDN-1 and IDN-2 public contracts consumer-safe", () => {
  const localRegistry = registerIdentity(createIdentityRegistry("idn-3-regression"), tenantA).registry;
  const scope = createIdentityScope({
    identityId: "tenant:a",
    identityType: "Tenant",
    scopeLevel: "Tenant",
    tenantId: "tenant:a",
  });

  assert.equal(localRegistry.identities.length, 1);
  assert.equal(validateIdentityScope(scope).valid, true);
});
