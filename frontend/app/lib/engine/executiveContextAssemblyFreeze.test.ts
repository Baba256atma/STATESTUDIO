import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextAssemblyCertification } from "./executiveContextAssemblyCertification.ts";
import * as publicApi from "./executiveContextAssemblyFreeze.ts";
import {
  ExecutiveContextAssemblyFreeze,
  ExecutiveContextAssemblyFreezeCompatibility,
  ExecutiveContextAssemblyFreezeDependencies,
  ExecutiveContextAssemblyFreezeDependencyLock,
  ExecutiveContextAssemblyFreezeExtensions,
  ExecutiveContextAssemblyFreezeMetadata,
  ExecutiveContextAssemblyFreezeRegistry,
  getExecutiveContextAssemblyFreeze,
  getExecutiveContextAssemblyFreezeCompatibility,
  getExecutiveContextAssemblyFreezeCompatibilityById,
  getExecutiveContextAssemblyFreezeDependencies,
  getExecutiveContextAssemblyFreezeEntryById,
  getExecutiveContextAssemblyFreezeExtensionById,
  getExecutiveContextAssemblyFreezeExtensions,
  getExecutiveContextAssemblyFreezeMetadata,
  getExecutiveContextAssemblyFreezeRegistry,
  getExecutiveContextAssemblyFreezeSummary,
} from "./executiveContextAssemblyFreeze.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";

test("exactly seven freeze entries exist, are unique, and are frozen", () => {
  assert.equal(ExecutiveContextAssemblyFreezeRegistry.length, 7);
  assert.deepEqual(ExecutiveContextAssemblyFreezeRegistry.map(({ phase }) => phase), [
    "ENG-4:1", "ENG-4:2", "ENG-4:3", "ENG-4:4", "ENG-4:5", "ENG-4:6", "ENG-4:7",
  ]);
  assert.equal(new Set(ExecutiveContextAssemblyFreezeRegistry.map(({ freezeEntryId }) => freezeEntryId)).size, 7);
  assert.equal(ExecutiveContextAssemblyFreezeRegistry.every(({ freezeState, certificationState, lockIdentifier }) => (
    freezeState === "Frozen" && certificationState === "Certified" && lockIdentifier === "ENG-4-LOCKED"
  )), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreezeRegistry), true);
});

test("freeze and certification results remain locked and ready for public index", () => {
  assert.equal(ExecutiveContextAssemblyFreeze.result.status, "Frozen");
  assert.equal(ExecutiveContextAssemblyFreeze.result.lockIdentifier, "ENG-4-LOCKED");
  assert.equal(ExecutiveContextAssemblyFreeze.lock.lockIdentifier, "ENG-4-LOCKED");
  assert.equal(ExecutiveContextAssemblyFreeze.certification, ExecutiveContextAssemblyCertification);
  assert.equal(ExecutiveContextAssemblyCertification.result.status, "Certified");
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.freezeResult, "Frozen");
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.status.readyForPublicIndex, "ReadyForPublicIndex");
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.lockIdentifier, "ENG-4-LOCKED");
  assert.equal(getExecutiveContextAssemblyFreezeSummary().releaseReadiness, "ReadyForPublicIndex");
  assert.equal(getExecutiveContextAssemblyFreezeSummary().certificationResult, "Certified");
});

test("metadata counts match actual collections and all collections are frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreeze), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreezeCompatibility), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreezeDependencies), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreezeExtensions), true);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyFreeze.guarantees), true);
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.frozenComponentCount, ExecutiveContextAssemblyFreeze.registry.length);
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.compatibilityCount, ExecutiveContextAssemblyFreeze.compatibility.length);
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.dependencyCount, ExecutiveContextAssemblyFreeze.dependencies.length);
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.extensionCount, ExecutiveContextAssemblyFreeze.extensions.length);
  assert.equal(ExecutiveContextAssemblyFreezeMetadata.guaranteeCount, ExecutiveContextAssemblyFreeze.guarantees.length);
  assert.equal(ExecutiveContextAssemblyFreeze.guarantees.length, 22);
  assert.equal(ExecutiveContextAssemblyFreeze.guarantees.every(({ status }) => status === "Locked"), true);
});

test("compatibility and ENG-1 relocation remain approved and non-duplicative", () => {
  assert.equal(new Set(ExecutiveContextAssemblyFreezeCompatibility.map(({ id }) => id)).size, ExecutiveContextAssemblyFreezeCompatibility.length);
  const relocation = getExecutiveContextAssemblyFreezeCompatibilityById("eng-4-freeze-compat-eng-1-model-relocation");
  assert.ok(relocation);
  assert.equal(relocation.status, "ApprovedCompatibility");
  assert.match(relocation.classification, /ApprovedCompatibility/);
  assert.match(relocation.classification, /OwnershipPreserved/);
  assert.match(relocation.classification, /PublicSurfaceStable/);
  assert.match(relocation.classification, /NoDuplication/);
  assert.equal(EngineExecutiveContextModel.id, "executive-context");
  assert.equal(AssemblyExecutiveContextModel.id, "eng-4-model-executive-context");
  assert.notEqual(AssemblyExecutiveContextModel.id, EngineExecutiveContextModel.id);
  assert.equal(getExecutiveContextAssemblyFreezeCompatibilityById("eng-4-freeze-compat-future-public-index")?.status, "BoundaryDeclared");
});

test("dependencies stay public-only, forward-only, and free of cycles or ENG-4:9 imports", () => {
  assert.equal(new Set(ExecutiveContextAssemblyFreezeDependencies.map(({ id }) => id)).size, ExecutiveContextAssemblyFreezeDependencies.length);
  assert.equal(ExecutiveContextAssemblyFreezeDependencies.every(({ direction, consumption, reverseDependency, circularDependency, futurePhaseDependency }) => (
    direction === "ForwardOnly" && consumption === "PublicIndexOnly" && !reverseDependency && !circularDependency && !futurePhaseDependency
  )), true);
  assert.equal(ExecutiveContextAssemblyFreezeDependencies.every(({ target }) => !String(target).startsWith("ENG-4:9")), true);
  assert.equal(ExecutiveContextAssemblyFreezeDependencies.some(({ source, target }) => source === "ENG-4:8" && target === "ENG-4:7"), true);
  assert.equal(ExecutiveContextAssemblyFreezeDependencyLock.status, "Locked");
  assert.equal(ExecutiveContextAssemblyFreezeDependencyLock.consumptionPolicy, "PublicIndexOnly");
});

test("extension points are descriptive only and protect frozen ownership", () => {
  assert.equal(ExecutiveContextAssemblyFreezeExtensions.length, 8);
  assert.equal(new Set(ExecutiveContextAssemblyFreezeExtensions.map(({ extensionId }) => extensionId)).size, 8);
  assert.equal(ExecutiveContextAssemblyFreezeExtensions.every(({ currentState, runtimeImplementationAbsent, prohibitedOwnershipChanges }) => (
    currentState === "DeclaredOnly" && runtimeImplementationAbsent && prohibitedOwnershipChanges
  )), true);
  assert.equal(getExecutiveContextAssemblyFreezeExtensionById("eng-4-freeze-extension-public-index")?.allowedFuturePhase, "ENG-4:9");
});

test("helpers are deterministic and unknown IDs return undefined", () => {
  assert.equal(getExecutiveContextAssemblyFreeze(), ExecutiveContextAssemblyFreeze);
  assert.equal(getExecutiveContextAssemblyFreezeMetadata(), ExecutiveContextAssemblyFreezeMetadata);
  assert.equal(getExecutiveContextAssemblyFreezeRegistry(), ExecutiveContextAssemblyFreezeRegistry);
  assert.equal(getExecutiveContextAssemblyFreezeDependencies(), ExecutiveContextAssemblyFreezeDependencies);
  assert.equal(getExecutiveContextAssemblyFreezeCompatibility(), ExecutiveContextAssemblyFreezeCompatibility);
  assert.equal(getExecutiveContextAssemblyFreezeExtensions(), ExecutiveContextAssemblyFreezeExtensions);
  assert.equal(getExecutiveContextAssemblyFreezeSummary(), ExecutiveContextAssemblyFreeze.summary);
  assert.equal(getExecutiveContextAssemblyFreezeEntryById("eng-4-freeze-entry-platform")?.phase, "ENG-4:6");
  assert.equal(getExecutiveContextAssemblyFreezeEntryById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyFreezeCompatibilityById("missing"), undefined);
  assert.equal(getExecutiveContextAssemblyFreezeExtensionById("missing"), undefined);
});

test("public freeze surface exposes approved metadata APIs with no runtime leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyFreeze", "ExecutiveContextAssemblyFreezeCompatibility",
    "ExecutiveContextAssemblyFreezeDependencies", "ExecutiveContextAssemblyFreezeDependencyLock",
    "ExecutiveContextAssemblyFreezeExtensions", "ExecutiveContextAssemblyFreezeMetadata",
    "ExecutiveContextAssemblyFreezeRegistry",
    "getExecutiveContextAssemblyFreeze", "getExecutiveContextAssemblyFreezeCompatibility",
    "getExecutiveContextAssemblyFreezeCompatibilityById", "getExecutiveContextAssemblyFreezeDependencies",
    "getExecutiveContextAssemblyFreezeEntryById", "getExecutiveContextAssemblyFreezeExtensionById",
    "getExecutiveContextAssemblyFreezeExtensions", "getExecutiveContextAssemblyFreezeMetadata",
    "getExecutiveContextAssemblyFreezeRegistry", "getExecutiveContextAssemblyFreezeSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Query|Planner|Manager|PublicIndex|Reflect/i.test(name)), true);
  assert.equal(ExecutiveContextAssemblyFreeze.metadataOnly, true);
  assert.equal(ExecutiveContextAssemblyFreeze.lock.publicApiStabilityState, "Stable");
  assert.equal(ExecutiveContextAssemblyFreeze.lock.namespaceStabilityState, "Stable");
});
