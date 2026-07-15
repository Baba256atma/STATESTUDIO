import assert from "node:assert/strict";
import test from "node:test";
import {
  ExecutiveContextAssemblyDomains,
  ExecutiveContextAssemblyCapabilities,
  ExecutiveContextAssemblyLifecycle,
} from "./executiveContextAssemblyFoundation.ts";
import * as publicApi from "./executiveContextAssemblyRegistry.ts";
import {
  ExecutiveContextAssemblyRegistry,
  ExecutiveContextCapabilityRegistry,
  ExecutiveContextDomainRegistry,
  ExecutiveContextLifecycleRegistry,
  ExecutiveContextOwnershipRegistry,
  ExecutiveContextSourceRegistry,
  getExecutiveContextAssemblyRegistry,
  getExecutiveContextAssemblyRegistrySummary,
  getExecutiveContextCapabilityRegistry,
  getExecutiveContextDomainRegistry,
  getExecutiveContextLifecycleRegistry,
  getExecutiveContextOwnershipRegistry,
  getExecutiveContextSourceRegistry,
} from "./executiveContextAssemblyRegistry.ts";

test("aggregate registry exists and is deeply immutable", () => {
  assert.ok(ExecutiveContextAssemblyRegistry);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyRegistry.metadata), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyRegistry.dependencies), true);
  assert.equal(Object.values(ExecutiveContextAssemblyRegistry).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("domain registry registers all ENG-4:1 architectural domains", () => {
  assert.equal(ExecutiveContextDomainRegistry.entries.length, 22);
  assert.equal(Object.isFrozen(ExecutiveContextDomainRegistry), true);
  assert.equal(ExecutiveContextDomainRegistry.entries.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveContextDomainRegistry.entries.map(({ name }) => name), ExecutiveContextAssemblyDomains.map(({ name }) => name));
  assert.deepEqual(ExecutiveContextDomainRegistry.entries.map(({ id }) => id), ExecutiveContextAssemblyDomains.map(({ id }) => id));
});

test("source registry describes architectural sources only", () => {
  assert.equal(ExecutiveContextSourceRegistry.entries.length, 8);
  assert.deepEqual(ExecutiveContextSourceRegistry.entries.map(({ name }) => name), [
    "Workspace Metadata", "Business Platform", "Operations Platform", "Engine Platform",
    "Connected Dataset", "Manual Input", "Imported File", "External Integration",
  ]);
  assert.equal(ExecutiveContextSourceRegistry.entries.every(({ status }) => status === "Registered"), true);
});

test("capability and lifecycle registries align with ENG-4:1 canonical definitions", () => {
  assert.equal(ExecutiveContextCapabilityRegistry.entries.length, 10);
  assert.equal(ExecutiveContextCapabilityRegistry.entries.length, ExecutiveContextAssemblyCapabilities.length);
  assert.deepEqual(ExecutiveContextCapabilityRegistry.entries.map(({ name }) => name), [
    "Identification", "Aggregation", "Classification", "Composition", "Normalization",
    "Metadata", "Validation", "Snapshot", "Version Metadata", "Publication",
  ]);
  assert.deepEqual(ExecutiveContextCapabilityRegistry.entries.map(({ id }) => id), ExecutiveContextAssemblyCapabilities.map(({ id }) => id));
  assert.equal(ExecutiveContextLifecycleRegistry.entries.length, 8);
  assert.deepEqual(ExecutiveContextLifecycleRegistry.entries.map(({ name }) => name), [
    "Defined", "Discovered", "Collected", "Normalized", "Assembled", "Validated", "Published", "Archived",
  ]);
  assert.deepEqual(ExecutiveContextLifecycleRegistry.entries.map(({ order }) => order), ExecutiveContextAssemblyLifecycle.map(({ order }) => order));
});

test("ownership registry covers domains, sources, capabilities, lifecycle, contracts, and public APIs", () => {
  assert.equal(ExecutiveContextOwnershipRegistry.entries.length, 6);
  assert.deepEqual(ExecutiveContextOwnershipRegistry.entries.map(({ group }) => group), [
    "ContextDomains", "ContextSources", "ContextCapabilities", "LifecycleStages",
    "ArchitecturalContracts", "PublicApis",
  ]);
  assert.equal(ExecutiveContextOwnershipRegistry.entries.every(({ owner }) => owner === "ENG-4"), true);
});

test("registry metadata and dependency map are complete and public-index only", () => {
  const { metadata, dependencies } = ExecutiveContextAssemblyRegistry;
  assert.equal(metadata.registryId, "ENG-4:2");
  assert.equal(metadata.registryVersion, "1.0.0");
  assert.equal(metadata.registryName, "Executive Context Assembly Registry");
  assert.equal(metadata.namespace, "nexora.engine.executive.context-assembly.registry");
  assert.equal(metadata.phase, "ENG-4:2");
  assert.equal(metadata.owner, "ENG-4");
  assert.equal(metadata.status.registry, "Registry");
  assert.equal(metadata.status.metadataOnly, "MetadataOnly");
  assert.equal(metadata.status.immutable, "Immutable");
  assert.equal(metadata.status.runtimeFree, "RuntimeFree");
  assert.equal(metadata.status.deterministic, "Deterministic");
  assert.deepEqual(dependencies.map(({ phase }) => phase), ["ENG-1", "ENG-2", "ENG-3", "ENG-4:1"]);
  assert.equal(dependencies.every(({ consumption }) => consumption === "PublicIndexOnly"), true);
});

test("registry identifiers contain no duplicates", () => {
  const collections = [
    ExecutiveContextDomainRegistry, ExecutiveContextSourceRegistry, ExecutiveContextCapabilityRegistry,
    ExecutiveContextLifecycleRegistry, ExecutiveContextOwnershipRegistry,
  ] as const;
  assert.equal(new Set(collections.map(({ id }) => id)).size, collections.length);
  const entryIds = collections.flatMap(({ entries }) => entries.map(({ id }) => id));
  assert.equal(new Set(entryIds).size, entryIds.length);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveContextAssemblyRegistry(), ExecutiveContextAssemblyRegistry);
  assert.equal(getExecutiveContextDomainRegistry(), ExecutiveContextDomainRegistry);
  assert.equal(getExecutiveContextSourceRegistry(), ExecutiveContextSourceRegistry);
  assert.equal(getExecutiveContextCapabilityRegistry(), ExecutiveContextCapabilityRegistry);
  assert.equal(getExecutiveContextLifecycleRegistry(), ExecutiveContextLifecycleRegistry);
  assert.equal(getExecutiveContextOwnershipRegistry(), ExecutiveContextOwnershipRegistry);
  assert.equal(getExecutiveContextAssemblyRegistrySummary(), getExecutiveContextAssemblyRegistrySummary());
  assert.equal(Object.isFrozen(getExecutiveContextAssemblyRegistrySummary()), true);
  assert.equal(getExecutiveContextAssemblyRegistrySummary().domainCount, 22);
  assert.equal(getExecutiveContextAssemblyRegistrySummary().sourceCount, 8);
  assert.equal(getExecutiveContextAssemblyRegistrySummary().capabilityCount, 10);
  assert.equal(getExecutiveContextAssemblyRegistrySummary().lifecycleStageCount, 8);
  assert.equal(getExecutiveContextAssemblyRegistrySummary().modelReady, true);
});

test("public registry surface exposes only approved metadata APIs with no implementation leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyRegistry", "ExecutiveContextCapabilityRegistry",
    "ExecutiveContextDomainRegistry", "ExecutiveContextLifecycleRegistry",
    "ExecutiveContextOwnershipRegistry", "ExecutiveContextSourceRegistry",
    "getExecutiveContextAssemblyRegistry", "getExecutiveContextAssemblyRegistrySummary",
    "getExecutiveContextCapabilityRegistry", "getExecutiveContextDomainRegistry",
    "getExecutiveContextLifecycleRegistry", "getExecutiveContextOwnershipRegistry",
    "getExecutiveContextSourceRegistry",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Model|Query|Planner|Manifest|Platform|Certification|Freeze/i.test(name)), true);
});
