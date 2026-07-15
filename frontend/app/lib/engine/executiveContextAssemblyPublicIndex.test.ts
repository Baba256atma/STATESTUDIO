import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveContextModel as EngineExecutiveContextModel } from "./engineModelIndex.ts";
import { ExecutiveContextAssemblyCertification } from "./executiveContextAssemblyCertification.ts";
import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import {
  ExecutiveContextAssemblyFreeze,
  getExecutiveContextAssemblyFreezeCompatibilityById,
} from "./executiveContextAssemblyFreeze.ts";
import { ExecutiveContextAssemblyManifest } from "./executiveContextAssemblyManifest.ts";
import {
  ExecutiveContextAssemblyModel,
  ExecutiveContextModel as AssemblyExecutiveContextModel,
} from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextAssemblyPlatform } from "./executiveContextAssemblyPlatform.ts";
import * as publicApi from "./executiveContextAssemblyPublicIndex.ts";
import {
  ExecutiveContextAssemblyPlatformPublicFoundation,
  ExecutiveContextAssemblyPublicApiRegistry,
  ExecutiveContextAssemblyPublicIndexDescription,
  ExecutiveContextAssemblyPublicIndexId,
  ExecutiveContextAssemblyPublicIndexName,
  ExecutiveContextAssemblyPublicIndexNamespace,
  ExecutiveContextAssemblyPublicIndexStatus,
  ExecutiveContextAssemblyPublicIndexVersion,
  getExecutiveContextAssemblyPublicApiRegistry,
  getExecutiveContextAssemblyPublicFoundation,
  getExecutiveContextAssemblyPublicMetadata,
  getExecutiveContextAssemblyReleaseSummary,
} from "./executiveContextAssemblyPublicIndex.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";

test("public namespace exists with exactly nine ordered immutable sections", () => {
  assert.deepEqual(Object.keys(ExecutiveContextAssemblyPlatformPublicFoundation), [
    "foundation", "registry", "model", "validation", "manifest",
    "platform", "certification", "freeze", "publicIndex",
  ]);
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPlatformPublicFoundation), true);
  assert.equal(Object.values(ExecutiveContextAssemblyPlatformPublicFoundation).every(Object.isFrozen), true);
});

test("every section references its originating approved public artifact", () => {
  const foundation = ExecutiveContextAssemblyPlatformPublicFoundation;
  assert.equal(foundation.foundation, ExecutiveContextAssemblyFoundation);
  assert.equal(foundation.registry, ExecutiveContextAssemblyRegistry);
  assert.equal(foundation.model, ExecutiveContextAssemblyModel);
  assert.equal(foundation.validation, ExecutiveContextAssemblyValidation);
  assert.equal(foundation.manifest, ExecutiveContextAssemblyManifest);
  assert.equal(foundation.platform, ExecutiveContextAssemblyPlatform);
  assert.equal(foundation.certification, ExecutiveContextAssemblyCertification);
  assert.equal(foundation.certification, ExecutiveContextAssemblyFreeze.certification);
  assert.equal(foundation.freeze, ExecutiveContextAssemblyFreeze);
  assert.equal(foundation.publicIndex.apiRegistry, ExecutiveContextAssemblyPublicApiRegistry);
  assert.equal(Object.isFrozen(foundation.publicIndex), true);
});

test("public metadata and statuses are released, certified, frozen, and locked", () => {
  const metadata = getExecutiveContextAssemblyPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
  assert.equal(ExecutiveContextAssemblyPublicIndexId, "ENG-4:9");
  assert.equal(ExecutiveContextAssemblyPublicIndexVersion, "1.0.0");
  assert.equal(ExecutiveContextAssemblyPublicIndexName, "Executive Context Assembly Public Index");
  assert.match(ExecutiveContextAssemblyPublicIndexDescription, /public release surface/i);
  assert.equal(ExecutiveContextAssemblyPublicIndexNamespace, "nexora.engine.executive.context-assembly.public");
  assert.equal(metadata.phase, "PublicIndex");
  assert.equal(metadata.releaseStatus, "Released");
  assert.equal(metadata.certificationStatus, "Certified");
  assert.equal(metadata.freezeStatus, "Frozen");
  assert.equal(metadata.publicApiStatus, "Stable");
  assert.equal(metadata.compatibilityStatus, "Preserved");
  assert.equal(metadata.ownershipStatus, "Protected");
  assert.equal(metadata.lockIdentifier, "ENG-4-LOCKED");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.released, "Released");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.certified, "Certified");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.frozen, "Frozen");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.publicApiStable, "PublicApiStable");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.namespaceStable, "NamespaceStable");
  assert.equal(ExecutiveContextAssemblyPublicIndexStatus.ownershipProtected, "OwnershipProtected");
  assert.equal(foundationFreezeAndCertRemainStable(), true);
});

function foundationFreezeAndCertRemainStable() {
  return ExecutiveContextAssemblyFreeze.result.status === "Frozen"
    && ExecutiveContextAssemblyCertification.result.status === "Certified"
    && ExecutiveContextAssemblyFreeze.lock.lockIdentifier === "ENG-4-LOCKED";
}

test("public API registry is complete, frozen, unique, and single-owner", () => {
  assert.equal(Object.isFrozen(ExecutiveContextAssemblyPublicApiRegistry), true);
  assert.equal(ExecutiveContextAssemblyPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveContextAssemblyPublicApiRegistry.map(({ apiId }) => apiId)).size, ExecutiveContextAssemblyPublicApiRegistry.length);
  assert.equal(new Set(ExecutiveContextAssemblyPublicApiRegistry.map(({ exportName }) => exportName)).size, ExecutiveContextAssemblyPublicApiRegistry.length);
  assert.equal(ExecutiveContextAssemblyPublicApiRegistry.every(({ owningPhase, stability, metadataOnly, runtimeFree, publicStatus, ownership }) => (
    Boolean(owningPhase)
    && stability === "Stable"
    && metadataOnly === true
    && runtimeFree === true
    && publicStatus === "Public"
    && ownership === "ENG-4"
  )), true);
  assert.equal(ExecutiveContextAssemblyPublicApiRegistry.filter(({ owningPhase }) => owningPhase === "ENG-4:9").length, 12);
  assert.equal(ExecutiveContextAssemblyPublicApiRegistry.every(({ exportName }) => (
    !/Builder|Runner|Planner|Manager|Query|Reflect|Private|Internal/i.test(exportName)
  )), true);
});

test("ENG-1 relocation and ENG-4 specialized ownership remain preserved", () => {
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
  assert.match(getExecutiveContextAssemblyReleaseSummary().eng1RelocationClassification, /ApprovedCompatibility/);
});

test("helpers are deterministic and release summary matches collections", () => {
  assert.equal(getExecutiveContextAssemblyPublicFoundation(), ExecutiveContextAssemblyPlatformPublicFoundation);
  assert.equal(getExecutiveContextAssemblyPublicApiRegistry(), ExecutiveContextAssemblyPublicApiRegistry);
  assert.equal(getExecutiveContextAssemblyPublicMetadata(), getExecutiveContextAssemblyPublicMetadata());
  assert.equal(getExecutiveContextAssemblyReleaseSummary(), getExecutiveContextAssemblyReleaseSummary());
  assert.equal(Object.isFrozen(getExecutiveContextAssemblyPublicMetadata()), true);
  assert.equal(Object.isFrozen(getExecutiveContextAssemblyReleaseSummary()), true);
  const summary = getExecutiveContextAssemblyReleaseSummary();
  assert.equal(summary.sectionCount, Object.keys(ExecutiveContextAssemblyPlatformPublicFoundation).length);
  assert.equal(summary.publicApiCount, ExecutiveContextAssemblyPublicApiRegistry.length);
  assert.equal(summary.completedPhaseCount, 8);
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.lockIdentifier, "ENG-4-LOCKED");
  assert.equal(summary.ownershipStatus, "Protected");
  assert.equal(summary.compatibilityStatus, "Preserved");
  assert.equal(summary.runtimeStatus, "RuntimeFree");
  assert.equal(summary.metadataStatus, "MetadataOnly");
});

test("module exposes exactly twelve ENG-4:9 exports with no runtime or future-phase leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveContextAssemblyPlatformPublicFoundation", "ExecutiveContextAssemblyPublicApiRegistry",
    "ExecutiveContextAssemblyPublicIndexId", "ExecutiveContextAssemblyPublicIndexVersion",
    "ExecutiveContextAssemblyPublicIndexName", "ExecutiveContextAssemblyPublicIndexDescription",
    "ExecutiveContextAssemblyPublicIndexNamespace", "ExecutiveContextAssemblyPublicIndexStatus",
    "getExecutiveContextAssemblyPublicFoundation", "getExecutiveContextAssemblyPublicMetadata",
    "getExecutiveContextAssemblyPublicApiRegistry", "getExecutiveContextAssemblyReleaseSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 12);
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Runner|Planner|Manager|Query|Reflect|Types|Internal|Private|ENG-4:10|ENG-5/i.test(name)
  )), true);
  assert.equal(typeof getExecutiveContextAssemblyPublicFoundation, "function");
  assert.equal(typeof getExecutiveContextAssemblyPublicMetadata, "function");
  assert.equal(typeof getExecutiveContextAssemblyPublicApiRegistry, "function");
  assert.equal(typeof getExecutiveContextAssemblyReleaseSummary, "function");
});
