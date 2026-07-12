import assert from "node:assert/strict";
import test from "node:test";

import { buildDependencyManifest } from "./dependencyManifestIndex.ts";
import { getDependencyValidationSummary } from "./dependencyValidationIndex.ts";
import {
  ExecutiveDependencyPlatform,
  ExecutiveDependencyPlatformMetadata,
  ExecutiveDependencyPlatformRegistry,
  ExecutiveDependencyPlatformSummary,
  getExecutiveDependencyPlatform,
  getExecutiveDependencyPlatformMetadata,
  getExecutiveDependencyPlatformSummary,
} from "./executiveDependencyPlatformIndex.ts";

test("platform registry", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformRegistry), true);
  assert.equal(ExecutiveDependencyPlatformRegistry.platformId, "OPS-7:1");
  assert.equal(ExecutiveDependencyPlatformRegistry.releaseStatus, "Released");
});

test("platform metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformMetadata), true);
  assert.equal(ExecutiveDependencyPlatformMetadata.publicApiCount, 16);
  assert.equal(ExecutiveDependencyPlatformMetadata.releaseReadiness, "Ready");
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatform), true);
  assert.ok("foundation" in ExecutiveDependencyPlatform);
  assert.ok("registry" in ExecutiveDependencyPlatform);
  assert.ok("model" in ExecutiveDependencyPlatform);
  assert.ok("validation" in ExecutiveDependencyPlatform);
  assert.ok("manifest" in ExecutiveDependencyPlatform);
  assert.ok("metadata" in ExecutiveDependencyPlatform);
});

test("platform helpers", () => {
  assert.deepEqual(getExecutiveDependencyPlatform(), ExecutiveDependencyPlatform);
  assert.deepEqual(
    getExecutiveDependencyPlatformMetadata(),
    ExecutiveDependencyPlatformMetadata,
  );
  assert.deepEqual(
    getExecutiveDependencyPlatformSummary(),
    ExecutiveDependencyPlatformSummary,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveDependencyPlatform()), true);
  assert.equal(Object.isFrozen(getExecutiveDependencyPlatformSummary()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveDependencyPlatform(),
    getExecutiveDependencyPlatform(),
  );
  assert.deepEqual(
    getExecutiveDependencyPlatformMetadata(),
    getExecutiveDependencyPlatformMetadata(),
  );
  assert.deepEqual(
    getExecutiveDependencyPlatformSummary(),
    getExecutiveDependencyPlatformSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveDependencyPlatform.metadataOnly, true);
  assert.equal(ExecutiveDependencyPlatformMetadata.metadataOnlyStatus, "MetadataOnly");
  assert.equal(
    ExecutiveDependencyPlatformSummary.releaseSummary.publicApiStatus,
    "Stable",
  );
});

test("manifest linkage", () => {
  assert.equal(
    ExecutiveDependencyPlatform.metadata.manifestSummary.phaseCount,
    buildDependencyManifest().summary.phaseCount,
  );
  assert.equal(
    ExecutiveDependencyPlatform.manifest.buildDependencyManifest().descriptor.platformId,
    "OPS-7:1",
  );
});

test("validation linkage", () => {
  assert.equal(
    ExecutiveDependencyPlatform.metadata.validationSummary.status,
    getDependencyValidationSummary().status,
  );
  assert.equal(
    ExecutiveDependencyPlatform.validation.validateExecutiveDependencyPlatform().status,
    "PASS",
  );
});
