import assert from "node:assert/strict";
import test from "node:test";

import { createIdentity, type CreateIdentityInput, type NexoraIdentity } from "./identityIndex.ts";
import {
  clearRegistry,
  createIdentityRegistry,
  createIdentityRegistrySnapshot,
  getIdentity,
  getRegistryStatistics,
  hasIdentity,
  listIdentities,
  queryIdentities,
  registerIdentity,
  unregisterIdentity,
  updateIdentityMetadata,
  validateRegistryConsistency,
  validateSnapshotIntegrity,
} from "./identityRegistryIndex.ts";

const created = Object.freeze({
  createdAt: "2026-06-30T00:00:00.000Z",
  updatedAt: "2026-06-30T00:00:00.000Z",
  createdBy: "user:founder",
  version: 1,
  source: "system" as const,
  tags: ["foundation"],
  metadata: { phase: "idn-2" },
});

function identity(input: Omit<CreateIdentityInput, "created"> & Partial<Pick<CreateIdentityInput, "created">>): NexoraIdentity {
  return createIdentity({
    ...input,
    created: input.created ?? created,
  });
}

const userIdentity = identity({
  id: "user:001",
  type: "User",
  displayName: "User One",
  lifecycle: "Active",
  tags: ["people"],
});

const workspaceIdentity = identity({
  id: "workspace:001",
  type: "Workspace",
  displayName: "Workspace One",
  lifecycle: "Archived",
  created: { ...created, source: "manual", tags: ["workspace"] },
  tags: ["ops"],
});

const serviceIdentity = identity({
  id: "service:001",
  type: "Service",
  displayName: "Service One",
  lifecycle: "Deleted",
  created: { ...created, source: "integration", tags: ["runtime"] },
  tags: ["system"],
});

test("registers identities and maintains lookup by id", () => {
  const registry = createIdentityRegistry("idn-test");
  const registered = registerIdentity(registry, userIdentity);

  assert.equal(registered.success, true);
  assert.equal(registered.registry.identities.length, 1);
  assert.equal(getIdentity(registered.registry, "user:001")?.displayName, "User One");
  assert.equal(hasIdentity(registered.registry, "user:001"), true);
  assert.equal(hasIdentity(registry, "user:001"), false);
});

test("rejects duplicate identity ids without mutating registry", () => {
  const first = registerIdentity(createIdentityRegistry("idn-test"), userIdentity);
  const duplicate = registerIdentity(first.registry, userIdentity);

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.validation.issues[0]?.code, "duplicate_id");
  assert.equal(duplicate.registry.identities.length, 1);
});

test("rejects invalid identity contracts with structured validation", () => {
  const invalidIdentity = { ...userIdentity, id: "" };
  const result = registerIdentity(createIdentityRegistry("idn-test"), invalidIdentity);

  assert.equal(result.success, false);
  assert.equal(result.validation.issues[0]?.code, "invalid_identity");
});

test("lists identities in deterministic id order", () => {
  const first = registerIdentity(createIdentityRegistry("idn-test"), workspaceIdentity);
  const second = registerIdentity(first.registry, userIdentity);
  const third = registerIdentity(second.registry, serviceIdentity);

  assert.deepEqual(
    listIdentities(third.registry).map((entry) => entry.id),
    ["service:001", "user:001", "workspace:001"]
  );
});

test("queries identities by type lifecycle source tag and predicate", () => {
  const registry = [userIdentity, workspaceIdentity, serviceIdentity].reduce(
    (currentRegistry, entry) => registerIdentity(currentRegistry, entry).registry,
    createIdentityRegistry("idn-test")
  );

  assert.deepEqual(queryIdentities(registry, { type: "User" }).map((entry) => entry.id), ["user:001"]);
  assert.deepEqual(queryIdentities(registry, { lifecycle: "Archived" }).map((entry) => entry.id), ["workspace:001"]);
  assert.deepEqual(queryIdentities(registry, { source: "integration" }).map((entry) => entry.id), ["service:001"]);
  assert.deepEqual(queryIdentities(registry, { tag: "foundation" }).map((entry) => entry.id), ["user:001"]);
  assert.deepEqual(queryIdentities(registry, { tag: "runtime" }).map((entry) => entry.id), ["service:001"]);
  assert.deepEqual(
    queryIdentities(registry, { predicate: (entry) => entry.displayName.includes("One") }).map((entry) => entry.id),
    ["service:001", "user:001", "workspace:001"]
  );
});

test("keeps deterministic indexes synchronized", () => {
  const registry = [userIdentity, workspaceIdentity].reduce(
    (currentRegistry, entry) => registerIdentity(currentRegistry, entry).registry,
    createIdentityRegistry("idn-test")
  );

  assert.deepEqual(registry.indexes.byType.User, ["user:001"]);
  assert.deepEqual(registry.indexes.byLifecycle.Archived, ["workspace:001"]);
  assert.deepEqual(registry.indexes.bySource.manual, ["workspace:001"]);
  assert.deepEqual(registry.indexes.byTag.ops, ["workspace:001"]);
  assert.equal(validateRegistryConsistency(registry).valid, true);
});

test("computes registry statistics", () => {
  const registry = [userIdentity, workspaceIdentity, serviceIdentity].reduce(
    (currentRegistry, entry) => registerIdentity(currentRegistry, entry).registry,
    createIdentityRegistry("idn-test")
  );

  const statistics = getRegistryStatistics(registry);

  assert.equal(statistics.totalIdentities, 3);
  assert.equal(statistics.identitiesByType.User, 1);
  assert.equal(statistics.activeIdentities, 1);
  assert.equal(statistics.archivedIdentities, 1);
  assert.equal(statistics.deletedIdentities, 1);
  assert.equal(statistics.identitiesBySource.integration, 1);
});

test("creates immutable registry snapshots without mutable collection references", () => {
  const registered = registerIdentity(createIdentityRegistry("idn-test"), userIdentity);
  const snapshot = createIdentityRegistrySnapshot(registered.registry);

  assert.equal(snapshot.totalIdentities, 1);
  assert.equal(validateSnapshotIntegrity(snapshot).valid, true);
  assert.notEqual(snapshot.identities, registered.registry.identities);
  assert.ok(Object.isFrozen(snapshot));
  assert.ok(Object.isFrozen(snapshot.identities));
  assert.ok(Object.isFrozen(snapshot.indexes.byId));
});

test("updates identity metadata and rebuilds indexes", () => {
  const registered = registerIdentity(createIdentityRegistry("idn-test"), userIdentity);
  const updated = updateIdentityMetadata(registered.registry, "user:001", {
    updatedAt: "2026-06-30T01:00:00.000Z",
    tags: ["people", "priority"],
    metadata: { department: "strategy" },
  });

  assert.equal(updated.success, true);
  assert.equal(updated.identity?.version, 2);
  assert.equal(updated.identity?.created.updatedAt, "2026-06-30T01:00:00.000Z");
  assert.deepEqual(updated.identity?.metadata, { department: "strategy" });
  assert.deepEqual(updated.registry.indexes.byTag.priority, ["user:001"]);
});

test("rejects missing identities and invalid metadata updates", () => {
  const registered = registerIdentity(createIdentityRegistry("idn-test"), userIdentity);
  const missing = unregisterIdentity(registered.registry, "missing:001");
  const invalidUpdate = updateIdentityMetadata(registered.registry, "user:001", {
    updatedAt: "not-a-date",
  });

  assert.equal(missing.success, false);
  assert.equal(missing.validation.issues[0]?.code, "missing_identity");
  assert.equal(invalidUpdate.success, false);
  assert.equal(invalidUpdate.validation.issues[0]?.code, "invalid_update");
});

test("unregisters identities and clears registry deterministically", () => {
  const registered = registerIdentity(createIdentityRegistry("idn-test"), userIdentity);
  const unregistered = unregisterIdentity(registered.registry, "user:001");
  const cleared = clearRegistry(registered.registry);

  assert.equal(unregistered.success, true);
  assert.equal(unregistered.registry.identities.length, 0);
  assert.equal(cleared.identities.length, 0);
  assert.equal(cleared.registryId, "idn-test");
});
