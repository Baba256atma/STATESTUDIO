import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextModel as AssemblyExecutiveContextModel } from "./executiveContextAssemblyModel.ts";
import * as publicApi from "./executiveContextAssemblyManifest.ts";
import {
  ExecutiveContextAssemblyComponentManifest,
  ExecutiveContextAssemblyDependencyManifest,
  ExecutiveContextAssemblyManifest,
  ExecutiveContextAssemblyOwnershipManifest,
  ExecutiveContextAssemblyPhaseManifest,
  ExecutiveContextAssemblyReadinessManifest,
  getExecutiveContextAssemblyComponentManifest,
  getExecutiveContextAssemblyDependencyManifest,
  getExecutiveContextAssemblyManifest,
  getExecutiveContextAssemblyManifestComponentById,
  getExecutiveContextAssemblyManifestMetadata,
  getExecutiveContextAssemblyManifestPhaseById,
  getExecutiveContextAssemblyManifestReadinessGateById,
  getExecutiveContextAssemblyManifestSummary,
  getExecutiveContextAssemblyOwnershipManifest,
  getExecutiveContextAssemblyPhaseManifest,
  getExecutiveContextAssemblyReadinessManifest,
} from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";
import {
  ExecutiveContextDomainRegistry,
  ExecutiveContextSourceRegistry,
  ExecutiveContextCapabilityRegistry,
  ExecutiveContextLifecycleRegistry,
} from "./executiveContextAssemblyRegistry.ts";

test("exactly four completed phases exist with unique IDs", () => {
  assert.equal(ExecutiveContextAssemblyPhaseManifest.length, 4);
  assert.deepEqual(ExecutiveContextAssemblyPhaseManifest.map(({ phaseId }) => phaseId), [
    "ENG-4:1", "ENG-4:2", "ENG-4:3", "ENG-4:4",
  ]);
  assert.equal(new Set(ExecutiveContextAssemblyPhaseManifest.map(({ phaseId }) => phaseId)).size, 4);
  assert.equal(ExecutiveContextAssemblyPhaseManifest.every(({ status, completionState }) => status === "Complete" && completionState === "Complete"), true);
  assert.equal(ExecutiveContextAssemblyPhaseManifest.every(({ phaseId }) => !String(phaseId).startsWith("ENG-4:6")), true);
});

test("component inventory counts match ENG-4:1 through ENG-4:4 public metadata", () => {
  assert.equal(new Set(ExecutiveContextAssemblyComponentManifest.map(({ id }) => id)).size, ExecutiveContextAssemblyComponentManifest.length);
  const { inventories } = ExecutiveContextAssemblyManifest;
  assert.equal(inventories.foundationContracts, 8);
  assert.equal(inventories.contextDomains, 22);
  assert.equal(inventories.contextSources, 8);
  assert.equal(inventories.capabilities, 10);
  assert.equal(inventories.lifecycleStages, 8);
  assert.equal(inventories.validationGroups, 5);
  assert.equal(inventories.validationRules, 43);
  assert.equal(inventories.validationGates, 12);
  assert.equal(inventories.contextDomains, ExecutiveContextDomainRegistry.entries.length);
  assert.equal(inventories.contextSources, ExecutiveContextSourceRegistry.entries.length);
  assert.equal(inventories.capabilities, ExecutiveContextCapabilityRegistry.entries.length);
  assert.equal(inventories.lifecycleStages, ExecutiveContextLifecycleRegistry.entries.length);
  assert.equal(inventories.validationGroups, ExecutiveContextAssemblyValidation.validationGroups.length);
  assert.equal(inventories.validationRules, ExecutiveContextAssemblyValidation.validationRules.length);
  assert.equal(inventories.validationGates, ExecutiveContextAssemblyValidation.validationGates.length);
});

test("domain, source, capability, and lifecycle inventories are fully represented", () => {
  assert.deepEqual(ExecutiveContextDomainRegistry.entries.map(({ name }) => name).slice(0, 3), ["Workspace", "Organization", "User"]);
  assert.equal(ExecutiveContextDomainRegistry.entries.length, 22);
  assert.equal(ExecutiveContextSourceRegistry.entries.length, 8);
  assert.equal(ExecutiveContextCapabilityRegistry.entries.length, 10);
  assert.equal(ExecutiveContextLifecycleRegistry.entries.length, 8);
  assert.equal(ExecutiveContextAssemblyValidation.validationGroups.length, 5);
  assert.equal(ExecutiveContextAssemblyValidation.validationRules.length, 43);
  assert.equal(ExecutiveContextAssemblyValidation.validationGates.length, 12);
});

test("dependency graph is forward-only with no cycles or future phases", () => {
  assert.equal(ExecutiveContextAssemblyDependencyManifest.every(({ direction, consumption, reverseDependency, circularDependency, futurePhaseDependency, internalImplementationDependency }) => (
    direction === "ForwardOnly" && consumption === "PublicIndexOnly" && !reverseDependency && !circularDependency && !futurePhaseDependency && !internalImplementationDependency
  )), true);
  assert.equal(ExecutiveContextAssemblyDependencyManifest.every(({ target }) => !String(target).startsWith("ENG-4:6")), true);
  assert.deepEqual(
    ExecutiveContextAssemblyDependencyManifest.filter(({ source }) => source.startsWith("ENG-4:")).map(({ source, target }) => [source, target]),
    [
      ["ENG-4:2", "ENG-4:1"],
      ["ENG-4:3", "ENG-4:1"], ["ENG-4:3", "ENG-4:2"],
      ["ENG-4:4", "ENG-4:1"], ["ENG-4:4", "ENG-4:2"], ["ENG-4:4", "ENG-4:3"],
      ["ENG-4:5", "ENG-4:1"], ["ENG-4:5", "ENG-4:2"], ["ENG-4:5", "ENG-4:3"], ["ENG-4:5", "ENG-4:4"],
    ],
  );
});

test("ownership and ENG-1 compatibility relocation are protected", () => {
  assert.equal(ExecutiveContextAssemblyOwnershipManifest.length >= 12, true);
  assert.equal(ExecutiveContextAssemblyOwnershipManifest.every(({ owner, status }) => owner === "ENG-4" && status === "Owned"), true);
  assert.equal(ExecutiveContextAssemblyOwnershipManifest.some(({ artifact }) => artifact === "executiveContextModel.ts"), true);
  const compatibility = ExecutiveContextAssemblyManifest.compatibility[0]!;
  assert.equal(compatibility.classification.approvedCompatibility, "ApprovedCompatibility");
  assert.equal(compatibility.classification.ownershipPreserved, "OwnershipPreserved");
  assert.equal(compatibility.classification.publicSurfaceStable, "PublicSurfaceStable");
  assert.equal(compatibility.classification.noDuplication, "NoDuplication");
  assert.equal(compatibility.relocatedTo, "engineModelRegistry.ts");
  assert.equal(compatibility.specializedSurface, "executiveContextModel.ts");
  assert.equal(compatibility.eng1ModelId, EngineExecutiveContextModel.id);
  assert.equal(compatibility.eng4ModelId, AssemblyExecutiveContextModel.id);
  assert.notEqual(AssemblyExecutiveContextModel.id, EngineExecutiveContextModel.id);
});

test("all readiness gates pass and aggregate is frozen", () => {
  assert.equal(ExecutiveContextAssemblyReadinessManifest.length, 15);
  assert.equal(ExecutiveContextAssemblyReadinessManifest.every(({ status }) => status === "Pass" || status === "Ready"), true);
  assert.equal(ExecutiveContextAssemblyManifest.readiness.at(-1)?.status, "Ready");
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyManifest), true);
  assert.equal(Object.values(ExecutiveContextAssemblyManifest).filter((value) => typeof value === "object").every(Object.isFrozen), true);
  assert.equal(ExecutiveContextAssemblyManifest.guarantees.length, 12);
  assert.equal(ExecutiveContextAssemblyManifest.metadata.status.readyForPlatform, "ReadyForPlatform");
  assert.equal(ExecutiveContextAssemblyManifest.summary.status, "ReadyForPlatform");
});

test("helpers are deterministic and unknown IDs return undefined", () => {
  assert.equal(getExecutiveContextAssemblyManifest(), ExecutiveContextAssemblyManifest);
  assert.equal(getExecutiveContextAssemblyManifestMetadata(), ExecutiveContextAssemblyManifest.metadata);
  assert.equal(getExecutiveContextAssemblyPhaseManifest(), ExecutiveContextAssemblyPhaseManifest);
  assert.equal(getExecutiveContextAssemblyComponentManifest(), ExecutiveContextAssemblyComponentManifest);
  assert.equal(getExecutiveContextAssemblyDependencyManifest(), ExecutiveContextAssemblyDependencyManifest);
  assert.equal(getExecutiveContextAssemblyOwnershipManifest(), ExecutiveContextAssemblyOwnershipManifest);
  assert.equal(getExecutiveContextAssemblyReadinessManifest(), ExecutiveContextAssemblyReadinessManifest);
  assert.equal(getExecutiveContextAssemblyManifestSummary(), ExecutiveContextAssemblyManifest.summary);
  assert.equal(getExecutiveContextAssemblyManifestPhaseById("ENG-4:2")?.name, "Registry");
  assert.equal(getExecutiveContextAssemblyManifestPhaseById("ENG-4:9"), undefined);
  assert.equal(getExecutiveContextAssemblyManifestComponentById("eng-4-component-validation-rules")?.count, 43);
  assert.equal(getExecutiveContextAssemblyManifestComponentById("missing-component"), undefined);
  assert.equal(getExecutiveContextAssemblyManifestReadinessGateById("eng-4-readiness-ready-for-platform")?.status, "Ready");
  assert.equal(getExecutiveContextAssemblyManifestReadinessGateById("missing-gate"), undefined);
});

test("public manifest surface exposes approved metadata APIs with no runtime leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyCompatibilityManifest", "ExecutiveContextAssemblyComponentManifest",
    "ExecutiveContextAssemblyDependencyManifest", "ExecutiveContextAssemblyGuaranteeManifest",
    "ExecutiveContextAssemblyManifest", "ExecutiveContextAssemblyOwnershipManifest",
    "ExecutiveContextAssemblyPhaseManifest", "ExecutiveContextAssemblyReadinessManifest",
    "getExecutiveContextAssemblyComponentManifest", "getExecutiveContextAssemblyDependencyManifest",
    "getExecutiveContextAssemblyManifest", "getExecutiveContextAssemblyManifestComponentById",
    "getExecutiveContextAssemblyManifestMetadata", "getExecutiveContextAssemblyManifestPhaseById",
    "getExecutiveContextAssemblyManifestReadinessGateById", "getExecutiveContextAssemblyManifestSummary",
    "getExecutiveContextAssemblyOwnershipManifest", "getExecutiveContextAssemblyPhaseManifest",
    "getExecutiveContextAssemblyReadinessManifest",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !/Builder|Runner|Query|Planner|Certification|Freeze|PublicIndex/i.test(name)), true);
  assert.equal(ExecutiveContextAssemblyManifest.metadataOnly, true);
});
