import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveContextAssemblyFoundation.ts";
import {
  ExecutiveContextAssemblyBoundaries,
  ExecutiveContextAssemblyCapabilities,
  ExecutiveContextAssemblyContracts,
  ExecutiveContextAssemblyDomains,
  ExecutiveContextAssemblyFoundation,
  ExecutiveContextAssemblyLifecycle,
  ExecutiveContextAssemblyMetadata,
  ExecutiveContextAssemblyOwnership,
  getExecutiveContextAssemblyCapabilities,
  getExecutiveContextAssemblyContracts,
  getExecutiveContextAssemblyFoundation,
  getExecutiveContextAssemblyLifecycle,
  getExecutiveContextAssemblyMetadata,
  getExecutiveContextAssemblySummary,
} from "./executiveContextAssemblyFoundation.ts";

test("foundation aggregates immutable contracts, domains, ownership, capabilities, lifecycle, boundaries, and metadata", () => {
  assert.equal(ExecutiveContextAssemblyFoundation.contracts, ExecutiveContextAssemblyContracts);
  assert.equal(ExecutiveContextAssemblyFoundation.domains, ExecutiveContextAssemblyDomains);
  assert.equal(ExecutiveContextAssemblyFoundation.ownership, ExecutiveContextAssemblyOwnership);
  assert.equal(ExecutiveContextAssemblyFoundation.capabilities, ExecutiveContextAssemblyCapabilities);
  assert.equal(ExecutiveContextAssemblyFoundation.lifecycle, ExecutiveContextAssemblyLifecycle);
  assert.equal(ExecutiveContextAssemblyFoundation.boundaries, ExecutiveContextAssemblyBoundaries);
  assert.equal(ExecutiveContextAssemblyFoundation.metadata, ExecutiveContextAssemblyMetadata);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFoundation), true);
  assert.equal(ExecutiveContextAssemblyFoundation.metadataOnly, true);
});

test("all eight architectural contracts are complete and immutable", () => {
  assert.equal(ExecutiveContextAssemblyContracts.length, 8);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyContracts), true);
  assert.equal(ExecutiveContextAssemblyContracts.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveContextAssemblyContracts.map(({ id }) => id)).size, 8);
  assert.deepEqual(ExecutiveContextAssemblyContracts.map(({ name }) => name), [
    "Executive Context", "Context Source", "Context Domain", "Context Snapshot",
    "Context Metadata", "Context Boundary", "Context Validation", "Public Context API",
  ]);
});

test("domain inventory covers the required context domains", () => {
  assert.equal(ExecutiveContextAssemblyDomains.length, 22);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyDomains), true);
  assert.equal(ExecutiveContextAssemblyDomains.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveContextAssemblyDomains.map(({ id }) => id)).size, 22);
  assert.deepEqual(ExecutiveContextAssemblyDomains.map(({ name }) => name), [
    "Workspace", "Organization", "User", "Role", "Business", "Strategy", "KPI", "OKR",
    "Revenue", "Finance", "Resource", "Project", "Workflow", "Task", "Schedule",
    "Dependency", "Risk", "Dataset", "External Source", "Time", "Filter", "Scenario",
  ]);
});

test("capabilities and lifecycle stages are complete, ordered, and immutable", () => {
  assert.equal(ExecutiveContextAssemblyCapabilities.length, 10);
  assert.deepEqual(ExecutiveContextAssemblyCapabilities.map(({ name }) => name), [
    "Context Identification", "Context Aggregation", "Context Classification",
    "Context Composition", "Context Normalization", "Context Metadata",
    "Context Validation", "Context Snapshot Definition", "Context Version Metadata",
    "Context Publication",
  ]);
  assert.equal(ExecutiveContextAssemblyLifecycle.length, 8);
  assert.deepEqual(ExecutiveContextAssemblyLifecycle.map(({ name }) => name), [
    "Defined", "Discovered", "Collected", "Normalized", "Assembled", "Validated", "Published", "Archived",
  ]);
  assert.deepEqual(ExecutiveContextAssemblyLifecycle.map(({ order }) => order), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ExecutiveContextAssemblyCapabilities.every(Object.isFrozen), true);
  assert.equal(ExecutiveContextAssemblyLifecycle.every(Object.isFrozen), true);
});

test("boundaries prohibit runtime and execution concerns", () => {
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyBoundaries), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyBoundaries.prohibited), true);
  assert.equal(ExecutiveContextAssemblyBoundaries.prohibited.length, 13);
  assert.equal(ExecutiveContextAssemblyBoundaries.prohibited.every(({ status }) => status === "Prohibited"), true);
  assert.deepEqual(ExecutiveContextAssemblyBoundaries.prohibited.map(({ name }) => name), [
    "Runtime Execution", "SQL Generation", "Database Access", "API Calls", "Orchestration",
    "Planning", "Reasoning", "Recommendations", "Decision Making", "Caching", "Persistence",
    "Mutation", "Visualization",
  ]);
  assert.equal(ExecutiveContextAssemblyBoundaries.classification.runtimeFree, true);
});

test("metadata identifies the deterministic ENG-4:1 foundation", () => {
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyMetadata), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyMetadata.status), true);
  assert.equal(ExecutiveContextAssemblyMetadata.platformId, "ENG-4:1");
  assert.equal(ExecutiveContextAssemblyMetadata.phase, "ENG-4:1");
  assert.equal(ExecutiveContextAssemblyMetadata.owner, "ENG-4");
  assert.equal(ExecutiveContextAssemblyMetadata.namespace, "nexora.engine.executive.context-assembly.foundation");
  assert.equal(ExecutiveContextAssemblyMetadata.status.foundation, "Foundation");
  assert.equal(ExecutiveContextAssemblyMetadata.status.metadataOnly, "MetadataOnly");
  assert.equal(ExecutiveContextAssemblyMetadata.status.runtimeFree, "RuntimeFree");
  assert.equal(ExecutiveContextAssemblyMetadata.status.immutable, "Immutable");
  assert.equal(ExecutiveContextAssemblyMetadata.status.deterministic, "Deterministic");
  assert.deepEqual(ExecutiveContextAssemblyMetadata.publicDependencies.map(({ phase }) => phase), ["ENG-1", "ENG-2", "ENG-3"]);
  assert.equal(ExecutiveContextAssemblyMetadata.nextPhase, "ENG-4:2");
  assert.equal(ExecutiveContextAssemblyOwnership.owner, "ENG-4");
  assert.deepEqual([...ExecutiveContextAssemblyOwnership.consumes], ["ENG-1", "ENG-2", "ENG-3"]);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveContextAssemblyFoundation(), ExecutiveContextAssemblyFoundation);
  assert.equal(getExecutiveContextAssemblyContracts(), ExecutiveContextAssemblyContracts);
  assert.equal(getExecutiveContextAssemblyCapabilities(), ExecutiveContextAssemblyCapabilities);
  assert.equal(getExecutiveContextAssemblyLifecycle(), ExecutiveContextAssemblyLifecycle);
  assert.equal(getExecutiveContextAssemblyMetadata(), ExecutiveContextAssemblyMetadata);
  assert.equal(getExecutiveContextAssemblySummary(), getExecutiveContextAssemblySummary());
  assert.equal(Object.isFrozen(getExecutiveContextAssemblySummary()), true);
  assert.equal(getExecutiveContextAssemblySummary().contractCount, 8);
  assert.equal(getExecutiveContextAssemblySummary().domainCount, 22);
  assert.equal(getExecutiveContextAssemblySummary().capabilityCount, 10);
  assert.equal(getExecutiveContextAssemblySummary().lifecycleStageCount, 8);
  assert.equal(getExecutiveContextAssemblySummary().registryReady, true);
});

test("public foundation surface exposes only approved metadata APIs with no implementation leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyBoundaries", "ExecutiveContextAssemblyCapabilities",
    "ExecutiveContextAssemblyContracts", "ExecutiveContextAssemblyDomains",
    "ExecutiveContextAssemblyFoundation", "ExecutiveContextAssemblyLifecycle",
    "ExecutiveContextAssemblyMetadata", "ExecutiveContextAssemblyOwnership",
    "getExecutiveContextAssemblyCapabilities", "getExecutiveContextAssemblyContracts",
    "getExecutiveContextAssemblyFoundation", "getExecutiveContextAssemblyLifecycle",
    "getExecutiveContextAssemblyMetadata", "getExecutiveContextAssemblySummary",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Query|Planner|Advisor|Engine|Registry|Manifest/i.test(name)), true);
});
