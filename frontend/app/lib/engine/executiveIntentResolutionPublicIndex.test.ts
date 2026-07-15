import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveIntentResolutionCertificationPlatform } from "./executiveIntentResolutionCertificationIndex.ts";
import { ExecutiveIntentResolutionFreezePlatform } from "./executiveIntentResolutionFreezeIndex.ts";
import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionManifestPlatform } from "./executiveIntentResolutionManifestIndex.ts";
import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import { ExecutiveIntentResolutionPlatform } from "./executiveIntentResolutionPlatformIndex.ts";
import * as publicApi from "./executiveIntentResolutionPublicIndex.ts";
import {
  ExecutiveIntentResolutionPlatformPublicFoundation,
  ExecutiveIntentResolutionPublicApiRegistry,
  ExecutiveIntentResolutionPublicIndexDescription,
  ExecutiveIntentResolutionPublicIndexId,
  ExecutiveIntentResolutionPublicIndexName,
  ExecutiveIntentResolutionPublicIndexStatus,
  ExecutiveIntentResolutionPublicIndexVersion,
  ExecutiveIntentResolutionPublicNamespace,
  getExecutiveIntentResolutionPublicApiRegistry,
  getExecutiveIntentResolutionPublicFoundation,
  getExecutiveIntentResolutionPublicMetadata,
  getExecutiveIntentResolutionReleaseSummary,
} from "./executiveIntentResolutionPublicIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionValidationPlatform } from "./executiveIntentResolutionValidationIndex.ts";

test("public namespace exists with exactly nine ordered immutable sections", () => {
  assert.ok(ExecutiveIntentResolutionPlatformPublicFoundation);
  assert.deepEqual(Object.keys(ExecutiveIntentResolutionPlatformPublicFoundation), [
    "foundation", "registry", "model", "validation", "manifest",
    "platform", "certification", "freeze", "publicIndex",
  ]);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPlatformPublicFoundation), true);
  assert.equal(Object.values(ExecutiveIntentResolutionPlatformPublicFoundation).every(Object.isFrozen), true);
});

test("public references resolve exclusively to official public-index artifacts", () => {
  const foundation = ExecutiveIntentResolutionPlatformPublicFoundation;
  assert.equal(foundation.foundation, ExecutiveIntentResolutionFoundation);
  assert.equal(foundation.registry, ExecutiveIntentResolutionRegistryPlatform);
  assert.equal(foundation.model, ExecutiveIntentResolutionModelPlatform);
  assert.equal(foundation.validation, ExecutiveIntentResolutionValidationPlatform);
  assert.equal(foundation.manifest, ExecutiveIntentResolutionManifestPlatform);
  assert.equal(foundation.platform, ExecutiveIntentResolutionPlatform);
  assert.equal(foundation.certification, ExecutiveIntentResolutionCertificationPlatform);
  assert.equal(foundation.freeze, ExecutiveIntentResolutionFreezePlatform);
  assert.equal(Object.isFrozen(foundation.publicIndex), true);
  assert.equal(foundation.publicIndex.apiRegistry, ExecutiveIntentResolutionPublicApiRegistry);
});

test("public metadata is complete, immutable, and release-ready", () => {
  const metadata = getExecutiveIntentResolutionPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
  assert.equal(ExecutiveIntentResolutionPublicIndexId, "ENG-3:9");
  assert.equal(ExecutiveIntentResolutionPublicIndexVersion, "1.0.0");
  assert.equal(ExecutiveIntentResolutionPublicIndexName, "Executive Intent Resolution Public Index");
  assert.equal(ExecutiveIntentResolutionPublicIndexDescription.includes("public release surface"), true);
  assert.equal(ExecutiveIntentResolutionPublicNamespace, "nexora.engine.executive.intent-resolution.public");
  assert.equal(metadata.publicIndexId, ExecutiveIntentResolutionPublicIndexId);
  assert.equal(metadata.namespace, ExecutiveIntentResolutionPublicNamespace);
  assert.equal(metadata.owner, "ENG-3");
  assert.equal(metadata.releaseStatus, "Released");
  assert.equal(metadata.certificationStatus, "Certified");
  assert.equal(metadata.freezeStatus, "Frozen");
  assert.equal(metadata.apiStability, "Stable");
  assert.equal(ExecutiveIntentResolutionPublicIndexStatus.releaseStatus, "Released");
  assert.equal(ExecutiveIntentResolutionPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveIntentResolutionPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveIntentResolutionPublicIndexStatus.apiStability, "Stable");
  assert.equal(metadata.metadataOnly, true);
});

test("public API registry completely describes 68 stable unique APIs", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionPublicApiRegistry), true);
  assert.equal(ExecutiveIntentResolutionPublicApiRegistry.length, 68);
  assert.equal(ExecutiveIntentResolutionPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveIntentResolutionPublicApiRegistry.map(({ apiIdentifier }) => apiIdentifier)).size, 68);
  assert.equal(ExecutiveIntentResolutionPublicApiRegistry.every(({ stability, visibility, releaseStatus, metadataOnly }) => (
    stability === "Stable" && visibility === "Public" && releaseStatus === "Released" && metadataOnly === true
  )), true);
});

test("helpers return deterministic canonical immutable references", () => {
  assert.equal(getExecutiveIntentResolutionPublicFoundation(), ExecutiveIntentResolutionPlatformPublicFoundation);
  assert.equal(getExecutiveIntentResolutionPublicApiRegistry(), ExecutiveIntentResolutionPublicApiRegistry);
  assert.equal(getExecutiveIntentResolutionPublicMetadata(), getExecutiveIntentResolutionPublicMetadata());
  assert.equal(getExecutiveIntentResolutionReleaseSummary(), getExecutiveIntentResolutionReleaseSummary());
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionPublicMetadata()), true);
  assert.equal(Object.isFrozen(getExecutiveIntentResolutionReleaseSummary()), true);
});

test("release summary preserves ownership, collision, and dependency policies", () => {
  const summary = getExecutiveIntentResolutionReleaseSummary();
  assert.equal(summary.releaseId, "ENG-3-RELEASE-001");
  assert.equal(summary.completedPhaseCount, 8);
  assert.equal(summary.publicIndexPhase, "ENG-3:9");
  assert.equal(summary.namespaceSectionCount, 9);
  assert.equal(summary.priorPublicApiCount, 56);
  assert.equal(summary.publicIndexApiCount, 12);
  assert.equal(summary.totalPublicApiCount, 68);
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.apiStability, "Stable");
  assert.equal(summary.ownershipStatus, "Protected");
  assert.equal(summary.collisionStatus, "CollisionSafe");
  assert.equal(summary.dependencyPolicy, "PublicIndicesOnly");
  assert.equal(summary.metadataOnly, true);
});

test("public module exposes exactly twelve approved APIs with no implementation leakage", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionPlatformPublicFoundation", "ExecutiveIntentResolutionPublicApiRegistry",
    "ExecutiveIntentResolutionPublicIndexId", "ExecutiveIntentResolutionPublicIndexVersion",
    "ExecutiveIntentResolutionPublicIndexName", "ExecutiveIntentResolutionPublicIndexDescription",
    "ExecutiveIntentResolutionPublicNamespace", "ExecutiveIntentResolutionPublicIndexStatus",
    "getExecutiveIntentResolutionPublicFoundation", "getExecutiveIntentResolutionPublicMetadata",
    "getExecutiveIntentResolutionPublicApiRegistry", "getExecutiveIntentResolutionReleaseSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).every((name) => !name.includes("Types") && !name.includes("Runner") && !name.includes("Internal")), true);
  assert.equal(typeof getExecutiveIntentResolutionPublicFoundation, "function");
  assert.equal(typeof getExecutiveIntentResolutionPublicMetadata, "function");
  assert.equal(typeof getExecutiveIntentResolutionPublicApiRegistry, "function");
  assert.equal(typeof getExecutiveIntentResolutionReleaseSummary, "function");
});
