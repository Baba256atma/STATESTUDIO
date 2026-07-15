import assert from "node:assert/strict";
import test from "node:test";
import { ExecutivePlanningCertificationPlatform } from "./executivePlanningCertificationIndex.ts";
import { ExecutivePlanningFreezePlatform } from "./executivePlanningFreezeIndex.ts";
import { ExecutivePlanningManifestPlatform } from "./executivePlanningManifestIndex.ts";
import { ExecutivePlanningModelPlatform } from "./executivePlanningModelIndex.ts";
import { ExecutivePlanningPlatform } from "./executivePlanningPlatformIndex.ts";
import * as publicApi from "./executivePlanningPublicIndex.ts";
import {
  ExecutivePlanningPlatformPublicFoundation,
  ExecutivePlanningPublicApiRegistry,
  ExecutivePlanningPublicIndexDescription,
  ExecutivePlanningPublicIndexId,
  ExecutivePlanningPublicIndexName,
  ExecutivePlanningPublicIndexNamespace,
  ExecutivePlanningPublicIndexStatus,
  ExecutivePlanningPublicIndexVersion,
  getExecutivePlanningPublicApiRegistry,
  getExecutivePlanningPublicFoundation,
  getExecutivePlanningPublicMetadata,
  getExecutivePlanningReleaseSummary,
} from "./executivePlanningPublicIndex.ts";
import { ExecutivePlanningRegistryPlatform } from "./executivePlanningRegistryIndex.ts";
import { ExecutivePlanningValidationPlatform } from "./executivePlanningValidationIndex.ts";
import {
  ExecutivePlanningCapabilityRegistry,
  ExecutivePlanningContracts,
  ExecutivePlanningFoundation,
  ExecutivePlanningLifecycle,
  ExecutivePlanningMetadata,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";

test("public namespace contains exactly nine ordered immutable sections", () => {
  assert.deepEqual(Object.keys(ExecutivePlanningPlatformPublicFoundation), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
    "publicIndex",
  ]);
  assert.equal(Object.isFrozen(ExecutivePlanningPlatformPublicFoundation), true);
  assert.equal(Object.values(ExecutivePlanningPlatformPublicFoundation).every(Object.isFrozen), true);
});

test("every section references its originating approved public surface", () => {
  const ns = ExecutivePlanningPlatformPublicFoundation;
  assert.equal(ns.foundation.foundation, ExecutivePlanningFoundation);
  assert.equal(ns.foundation.contracts, ExecutivePlanningContracts);
  assert.equal(ns.foundation.capabilities, ExecutivePlanningCapabilityRegistry);
  assert.equal(ns.foundation.lifecycle, ExecutivePlanningLifecycle);
  assert.equal(ns.foundation.ownership, ExecutivePlanningOwnership);
  assert.equal(ns.foundation.metadata, ExecutivePlanningMetadata);
  assert.equal(ns.registry, ExecutivePlanningRegistryPlatform);
  assert.equal(ns.model, ExecutivePlanningModelPlatform);
  assert.equal(ns.validation, ExecutivePlanningValidationPlatform);
  assert.equal(ns.manifest, ExecutivePlanningManifestPlatform);
  assert.equal(ns.platform, ExecutivePlanningPlatform);
  assert.equal(ns.certification, ExecutivePlanningCertificationPlatform);
  assert.equal(ns.freeze, ExecutivePlanningFreezePlatform);
  assert.equal(ns.publicIndex.apiRegistry, ExecutivePlanningPublicApiRegistry);
});

test("public metadata reports Released, Certified, Frozen, MetadataOnly, and PublicApiStable", () => {
  const metadata = getExecutivePlanningPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
  assert.equal(ExecutivePlanningPublicIndexId, "ENG-5:9");
  assert.equal(ExecutivePlanningPublicIndexVersion, "1.0.0");
  assert.equal(ExecutivePlanningPublicIndexName, "Executive Planning Public Index");
  assert.match(ExecutivePlanningPublicIndexDescription, /public release surface/i);
  assert.equal(ExecutivePlanningPublicIndexNamespace, "nexora.engine.executive.planning.public");
  assert.equal(ExecutivePlanningPublicIndexStatus.released, "Released");
  assert.equal(ExecutivePlanningPublicIndexStatus.certified, "Certified");
  assert.equal(ExecutivePlanningPublicIndexStatus.frozen, "Frozen");
  assert.equal(ExecutivePlanningPublicIndexStatus.metadataOnly, "MetadataOnly");
  assert.equal(ExecutivePlanningPublicIndexStatus.publicApiStable, "PublicApiStable");
  assert.equal(metadata.releaseStatus, "Released");
  assert.equal(metadata.certificationStatus, "Certified");
  assert.equal(metadata.freezeStatus, "Frozen");
  assert.equal(metadata.metadataOnly, true);
  assert.equal(metadata.publicApiStable, "PublicApiStable");
});

test("public API registry is immutable with unique identifiers", () => {
  assert.equal(Object.isFrozen(ExecutivePlanningPublicApiRegistry), true);
  assert.equal(ExecutivePlanningPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(
    new Set(ExecutivePlanningPublicApiRegistry.map(({ apiId }) => apiId)).size,
    ExecutivePlanningPublicApiRegistry.length,
  );
  assert.equal(
    new Set(ExecutivePlanningPublicApiRegistry.map(({ exportName }) => exportName)).size,
    ExecutivePlanningPublicApiRegistry.length,
  );
  assert.equal(ExecutivePlanningPublicApiRegistry.filter(({ owningPhase }) => owningPhase === "ENG-5:9").length, 12);
  assert.equal(ExecutivePlanningPublicApiRegistry.every(({ publicStatus }) => publicStatus === "Public"), true);
});

test("helpers return deterministic immutable metadata", () => {
  assert.equal(getExecutivePlanningPublicFoundation(), ExecutivePlanningPlatformPublicFoundation);
  assert.equal(getExecutivePlanningPublicApiRegistry(), ExecutivePlanningPublicApiRegistry);
  assert.equal(getExecutivePlanningPublicMetadata(), getExecutivePlanningPublicMetadata());
  assert.equal(getExecutivePlanningReleaseSummary(), getExecutivePlanningReleaseSummary());
  assert.equal(Object.isFrozen(getExecutivePlanningPublicMetadata()), true);
  assert.equal(Object.isFrozen(getExecutivePlanningReleaseSummary()), true);
  const summary = getExecutivePlanningReleaseSummary();
  assert.equal(summary.sectionCount, 9);
  assert.equal(summary.publicApiCount, ExecutivePlanningPublicApiRegistry.length);
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.lockIdentifier, "ENG-5-LOCKED");
  assert.equal(summary.executionOwner, "OPS");
});

test("module exposes exactly twelve approved public exports with no runtime leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutivePlanningPlatformPublicFoundation",
    "ExecutivePlanningPublicApiRegistry",
    "ExecutivePlanningPublicIndexId",
    "ExecutivePlanningPublicIndexVersion",
    "ExecutivePlanningPublicIndexName",
    "ExecutivePlanningPublicIndexNamespace",
    "ExecutivePlanningPublicIndexDescription",
    "ExecutivePlanningPublicIndexStatus",
    "getExecutivePlanningPublicFoundation",
    "getExecutivePlanningPublicMetadata",
    "getExecutivePlanningPublicApiRegistry",
    "getExecutivePlanningReleaseSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 12);
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Runner|Planner|Manager|Query|Reflect|Types|Internal|Private|ENG-5:10|ENG-6/i.test(name)
  )), true);
});
