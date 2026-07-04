import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_DOMAIN_STATUS,
  buildDomainFoundationManifest,
  createDomainRegistry,
  registerDomain,
  validateDomainFoundation,
} from "./domainFoundationIndex.ts";
import type { DomainCategory, DomainPackage, DomainRegistry } from "./domainFoundationIndex.ts";
import { buildDomainRegistrySnapshot, queryDomains, validateDomainRegistrySnapshot } from "./domainRegistryQueryIndex.ts";
import {
  DomainRegistryStatsLayer,
  buildCompleteDomainRegistryIndex,
  buildDomainCapabilityIndex,
  buildDomainCategoryIndex,
  buildDomainDependencyIndex,
  buildDomainRegistryStats,
  buildDomainStatusIndex,
  calculateDomainDependencyDepth,
  countDomainsByCapability,
  countDomainsByCategory,
  countDomainsByStatus,
  diffDomainRegistrySnapshots,
  findMostConnectedDomains,
  summarizeDomainRegistryDiff,
  validateDomainRegistryDiff,
} from "./domainRegistryStatsIndex.ts";

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

test("builds stats on empty registry", () => {
  const stats = buildDomainRegistryStats(createDomainRegistry());

  assert.equal(stats.totalDomains, 0);
  assert.equal(stats.mostConnectedDomains.length, 0);
  assert.equal(stats.dependencies.length, 0);
  assert.equal(stats.deterministic, true);
});

test("counts domains by category", () => {
  const stats = countDomainsByCategory(buildSampleRegistry());
  const manufacturing = stats.find((entry) => entry.category === "manufacturing");
  const healthcare = stats.find((entry) => entry.category === "healthcare");

  assert.equal(manufacturing?.count, 1);
  assert.equal(healthcare?.count, 1);
  assert.equal(stats.every((entry) => Object.isFrozen(entry.domainIds)), true);
});

test("counts domains by status", () => {
  const stats = countDomainsByStatus(buildSampleRegistry());

  assert.equal(stats.find((entry) => entry.status === "active")?.count, 1);
  assert.equal(stats.find((entry) => entry.status === "registered")?.count, 2);
});

test("counts domains by capability", () => {
  const stats = countDomainsByCapability(buildSampleRegistry());
  const registration = stats.find((entry) => entry.capabilityId === "package-registration");
  const clinical = stats.find((entry) => entry.capabilityId === "clinical-metadata");

  assert.equal(registration?.count, 2);
  assert.equal(clinical?.count, 1);
});

test("calculates dependency depth", () => {
  const dependencies = calculateDomainDependencyDepth(buildSampleRegistry());
  const manufacturing = dependencies.find((entry) => entry.domainId === "domain.manufacturing");
  const logistics = dependencies.find((entry) => entry.domainId === "domain.logistics");

  assert.equal(manufacturing?.dependencyDepth, 0);
  assert.equal(logistics?.dependencyDepth, 1);
  assert.equal(manufacturing?.inboundDependencyCount, 1);
  assert.equal(logistics?.outboundDependencyCount, 1);
});

test("finds most connected domains", () => {
  const connected = findMostConnectedDomains(buildSampleRegistry());

  assert.deepEqual(connected, ["domain.logistics", "domain.manufacturing"]);
});

test("builds category index", () => {
  const index = buildDomainCategoryIndex(buildSampleRegistry());

  assert.equal(index.entries.length, 9);
  assert.deepEqual(index.byCategory.manufacturing, ["domain.manufacturing"]);
  assert.equal(Object.isFrozen(index), true);
});

test("builds status index", () => {
  const index = buildDomainStatusIndex(buildSampleRegistry());

  assert.deepEqual(index.byStatus.active, ["domain.healthcare"]);
  assert.equal(index.byStatus.registered?.length, 2);
});

test("builds capability index", () => {
  const index = buildDomainCapabilityIndex(buildSampleRegistry());

  assert.deepEqual(index.byCapabilityId["clinical-metadata"], ["domain.healthcare"]);
  assert.equal(index.byCapabilityId["package-registration"]?.length, 2);
});

test("builds dependency index", () => {
  const index = buildDomainDependencyIndex(buildSampleRegistry());
  const manufacturing = index.byDomainId["domain.manufacturing"];
  const logistics = index.byDomainId["domain.logistics"];

  assert.deepEqual(manufacturing?.dependedOnBy, ["domain.logistics"]);
  assert.deepEqual(logistics?.dependsOn, ["domain.manufacturing"]);
});

test("builds complete registry index", () => {
  const index = buildCompleteDomainRegistryIndex(buildSampleRegistry());

  assert.equal(index.contractVersion, "DOM-1:3");
  assert.equal(index.categoryIndex.entries.length, 9);
  assert.equal(index.statusIndex.entries.length, 5);
  assert.equal(index.capabilityIndex.entries.length, 2);
  assert.equal(index.dependencyIndex.entries.length, 3);
  assert.equal(index.deterministic, true);
});

test("detects added snapshot diff entries", () => {
  const left = buildDomainRegistrySnapshot(buildSampleRegistry());
  const right = buildDomainRegistrySnapshot(
    registerDomain(buildSampleRegistry(), domainPackage("domain.retail", "Retail", "retail")).registry
  );
  const diff = diffDomainRegistrySnapshots(left, right);
  const added = diff.entries.filter((entry) => entry.diffType === "added");

  assert.equal(diff.summary.added, 1);
  assert.equal(added[0]?.domainId, "domain.retail");
});

test("detects removed snapshot diff entries", () => {
  const left = buildDomainRegistrySnapshot(buildSampleRegistry());
  const right = buildDomainRegistrySnapshot(createDomainRegistry());
  const diff = diffDomainRegistrySnapshots(left, right);

  assert.equal(diff.summary.removed, 3);
  assert.equal(diff.summary.added, 0);
});

test("detects modified snapshot diff entries", () => {
  const registry = buildSampleRegistry();
  const left = buildDomainRegistrySnapshot(registry);
  const modifiedRegistry = registerDomain(
    createDomainRegistry(),
    domainPackage("domain.manufacturing", "Manufacturing", "manufacturing", {
      version: Object.freeze({ major: 2, minor: 0, patch: 0 }),
    })
  ).registry;
  const right = buildDomainRegistrySnapshot(modifiedRegistry);
  const diff = diffDomainRegistrySnapshots(left, right);

  assert.equal(diff.summary.modified, 1);
  assert.equal(diff.entries.find((entry) => entry.diffType === "modified")?.domainId, "domain.manufacturing");
});

test("detects unchanged snapshot diff entries", () => {
  const snapshot = buildDomainRegistrySnapshot(buildSampleRegistry());
  const diff = diffDomainRegistrySnapshots(snapshot, snapshot);

  assert.equal(diff.summary.unchanged, 3);
  assert.equal(diff.summary.added, 0);
  assert.equal(diff.summary.removed, 0);
  assert.equal(diff.summary.modified, 0);
});

test("validates snapshot diffs", () => {
  const left = buildDomainRegistrySnapshot(buildSampleRegistry());
  const right = buildDomainRegistrySnapshot(buildSampleRegistry());
  const diff = diffDomainRegistrySnapshots(left, right);
  const validation = validateDomainRegistryDiff(diff);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.deepEqual(summarizeDomainRegistryDiff(diff), diff.summary);
});

test("exports public stats layer APIs", () => {
  assert.equal(typeof DomainRegistryStatsLayer.buildDomainRegistryStats, "function");
  assert.equal(typeof DomainRegistryStatsLayer.buildCompleteDomainRegistryIndex, "function");
  assert.equal(typeof DomainRegistryStatsLayer.diffDomainRegistrySnapshots, "function");
  assert.equal(Object.isFrozen(DomainRegistryStatsLayer), true);
});

test("keeps DOM-1:1 foundation regression compatible", () => {
  const validation = validateDomainFoundation();
  const manifest = buildDomainFoundationManifest();
  const registry = createDomainRegistry();

  assert.equal(validation.valid, true);
  assert.equal(manifest.platform.version, "DOM-1");
  assert.equal(registry.domains.length, 0);
});

test("keeps DOM-1:2 query regression compatible", () => {
  const registry = buildSampleRegistry();
  const query = queryDomains(registry, Object.freeze({ sortKey: "name", sortDirection: "asc" }));
  const snapshot = buildDomainRegistrySnapshot(registry);

  assert.equal(query.total, 3);
  assert.equal(validateDomainRegistrySnapshot(snapshot).valid, true);
});
