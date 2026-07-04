import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  createDomainRegistry,
  freezeDomainRegistry,
  registerDomain,
} from "./domainFoundationIndex.ts";
import type { DomainCategory, DomainPackage, DomainRegistry, DomainStatus } from "./domainFoundationIndex.ts";
import {
  DomainRegistryQuery,
  buildDomainRegistrySnapshot,
  compareDomainRegistrySnapshots,
  findDomainsByCapability,
  findDomainsByCategory,
  findDomainsByStatus,
  findDomainsWithDependency,
  queryDomains,
  sortDomains,
  validateDomainRegistrySnapshot,
  validateSnapshotAgainstRegistry,
} from "./domainRegistryQueryIndex.ts";

function domainPackage(
  domainId: string,
  name: string,
  category: DomainCategory,
  overrides: Partial<DomainPackage["manifest"]> = {}
): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId,
      name,
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: `${name} Domain`,
        description: `${name} domain package registration metadata.`,
        category,
        tags: Object.freeze([category]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "package-registration",
          name: "Package Registration",
          description: "Registers the domain package in the foundation registry.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: DEFAULT_DOMAIN_STATUS,
      ...overrides,
    }),
  });
}

function buildSampleRegistry(): DomainRegistry {
  let registry = createDomainRegistry();
  registry = registerDomain(registry, domainPackage("domain.manufacturing", "Manufacturing", "manufacturing")).registry;
  registry = registerDomain(
    registry,
    domainPackage("domain.healthcare", "Healthcare", "healthcare", {
      status: "active",
      capabilities: Object.freeze([
        Object.freeze({
          id: "clinical-metadata",
          name: "Clinical Metadata",
          description: "Clinical metadata registration capability.",
          enabled: true,
        }),
      ]),
    })
  ).registry;
  registry = registerDomain(
    registry,
    domainPackage("domain.logistics", "Logistics", "logistics", {
      dependencies: Object.freeze([
        Object.freeze({
          domainId: "domain.manufacturing",
          minVersion: Object.freeze({ major: 1, minor: 0, patch: 0 }),
          optional: false,
        }),
      ]),
    })
  ).registry;
  return registry;
}

test("queries domains by category", () => {
  const registry = buildSampleRegistry();
  const result = findDomainsByCategory(registry, "healthcare");

  assert.equal(result.length, 1);
  assert.equal(result[0].package.manifest.domainId, "domain.healthcare");
});

test("queries domains by status", () => {
  const registry = buildSampleRegistry();
  const active = findDomainsByStatus(registry, "active");
  const registered = findDomainsByStatus(registry, "registered");

  assert.equal(active.length, 1);
  assert.equal(active[0].package.manifest.domainId, "domain.healthcare");
  assert.equal(registered.length, 2);
});

test("queries domains by capability", () => {
  const registry = buildSampleRegistry();
  const clinical = findDomainsByCapability(registry, "clinical-metadata");
  const registration = findDomainsByCapability(registry, "package-registration");

  assert.equal(clinical.length, 1);
  assert.equal(clinical[0].package.manifest.domainId, "domain.healthcare");
  assert.equal(registration.length, 2);
  assert.deepEqual(
    registration.map((domain) => domain.package.manifest.domainId).sort(),
    ["domain.logistics", "domain.manufacturing"]
  );
});

test("queries domains by dependency", () => {
  const registry = buildSampleRegistry();
  const dependents = findDomainsWithDependency(registry, "domain.manufacturing");

  assert.equal(dependents.length, 1);
  assert.equal(dependents[0].package.manifest.domainId, "domain.logistics");
});

test("sorts domains by id", () => {
  const registry = buildSampleRegistry();
  const sorted = sortDomains(registry.domains, "domainId", "asc");

  assert.deepEqual(
    sorted.map((domain) => domain.package.manifest.domainId),
    ["domain.healthcare", "domain.logistics", "domain.manufacturing"]
  );
});

test("sorts domains by name", () => {
  const registry = buildSampleRegistry();
  const sorted = sortDomains(registry.domains, "name", "asc");

  assert.deepEqual(
    sorted.map((domain) => domain.package.manifest.name),
    ["Healthcare", "Logistics", "Manufacturing"]
  );
});

test("sorts domains by registration order", () => {
  const registry = buildSampleRegistry();
  const sorted = sortDomains(registry.domains, "registrationOrder", "asc");

  assert.deepEqual(
    sorted.map((domain) => domain.registrationOrder),
    [0, 1, 2]
  );
});

test("queries with combined filter and sort", () => {
  const registry = buildSampleRegistry();
  const result = queryDomains(
    registry,
    Object.freeze({
      filter: Object.freeze({ status: "registered" as DomainStatus }),
      sortKey: "name",
      sortDirection: "desc",
    })
  );

  assert.equal(result.total, 2);
  assert.equal(result.deterministic, true);
  assert.deepEqual(
    result.domains.map((domain) => domain.package.manifest.name),
    ["Manufacturing", "Logistics"]
  );
});

test("generates immutable registry snapshots", () => {
  const registry = buildSampleRegistry();
  const snapshot = buildDomainRegistrySnapshot(registry);

  assert.equal(snapshot.metadata.domainCount, 3);
  assert.equal(snapshot.metadata.deterministic, true);
  assert.equal(snapshot.entries.length, 3);
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.entries), true);
  assert.equal(snapshot.fingerprint.length > 0, true);
});

test("validates registry snapshots", () => {
  const registry = buildSampleRegistry();
  const snapshot = buildDomainRegistrySnapshot(registry);
  const validation = validateDomainRegistrySnapshot(snapshot);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
});

test("compares registry snapshots deterministically", () => {
  const registry = buildSampleRegistry();
  const left = buildDomainRegistrySnapshot(registry);
  const right = buildDomainRegistrySnapshot(registry);
  const comparison = compareDomainRegistrySnapshots(left, right);

  assert.equal(comparison.equal, true);
  assert.equal(comparison.metadataEqual, true);
  assert.equal(comparison.entriesEqual, true);
  assert.equal(comparison.fingerprintEqual, true);
});

test("detects snapshot differences", () => {
  const registry = buildSampleRegistry();
  const left = buildDomainRegistrySnapshot(registry);
  const right = buildDomainRegistrySnapshot(
    registerDomain(registry, domainPackage("domain.retail", "Retail", "retail")).registry
  );
  const comparison = compareDomainRegistrySnapshots(left, right);

  assert.equal(comparison.equal, false);
  assert.equal(comparison.entriesEqual, false);
});

test("handles empty registry behavior", () => {
  const registry = createDomainRegistry();
  const query = queryDomains(registry);
  const snapshot = buildDomainRegistrySnapshot(registry);

  assert.equal(query.total, 0);
  assert.deepEqual(query.domains, []);
  assert.equal(snapshot.metadata.domainCount, 0);
  assert.equal(snapshot.entries.length, 0);
  assert.equal(validateDomainRegistrySnapshot(snapshot).valid, true);
});

test("snapshots frozen registry state", () => {
  const registry = freezeDomainRegistry(buildSampleRegistry());
  const snapshot = buildDomainRegistrySnapshot(registry);

  assert.equal(snapshot.metadata.frozen, true);
  assert.equal(validateSnapshotAgainstRegistry(registry, snapshot).valid, true);
});

test("exports public query and snapshot APIs", () => {
  assert.equal(typeof DomainRegistryQuery.queryDomains, "function");
  assert.equal(typeof DomainRegistryQuery.filterDomains, "function");
  assert.equal(typeof DomainRegistryQuery.sortDomains, "function");
  assert.equal(typeof DomainRegistryQuery.buildDomainRegistrySnapshot, "function");
  assert.equal(typeof DomainRegistryQuery.compareDomainRegistrySnapshots, "function");
  assert.equal(Object.isFrozen(DomainRegistryQuery), true);
});

test("keeps query output deterministic", () => {
  const registry = buildSampleRegistry();
  const first = queryDomains(registry, Object.freeze({ sortKey: "name", sortDirection: "asc" }));
  const second = queryDomains(registry, Object.freeze({ sortKey: "name", sortDirection: "asc" }));

  assert.deepEqual(
    first.domains.map((domain) => domain.package.manifest.domainId),
    second.domains.map((domain) => domain.package.manifest.domainId)
  );
  assert.equal(first.total, second.total);
});
