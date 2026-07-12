import assert from "node:assert/strict";
import test from "node:test";

import { buildAutomationManifest } from "./automationManifestIndex.ts";
import { getAutomationValidationSummary } from "./automationValidationIndex.ts";
import {
  ExecutiveAutomationPlatform,
  ExecutiveAutomationPlatformMetadata,
  ExecutiveAutomationPlatformRegistry,
  ExecutiveAutomationPlatformSummary,
  getExecutiveAutomationPlatform,
  getExecutiveAutomationPlatformMetadata,
  getExecutiveAutomationPlatformSummary,
} from "./executiveAutomationPlatformIndex.ts";

test("platform registry", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformRegistry), true);
  assert.equal(ExecutiveAutomationPlatformRegistry.platformId, "OPS-8:1");
  assert.equal(ExecutiveAutomationPlatformRegistry.releaseStatus, "Released");
});

test("platform metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformMetadata), true);
  assert.equal(ExecutiveAutomationPlatformMetadata.publicApiCount, 27);
  assert.equal(ExecutiveAutomationPlatformMetadata.releaseReadiness, "Ready");
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatform), true);
  assert.ok("foundation" in ExecutiveAutomationPlatform);
  assert.ok("registry" in ExecutiveAutomationPlatform);
  assert.ok("model" in ExecutiveAutomationPlatform);
  assert.ok("validation" in ExecutiveAutomationPlatform);
  assert.ok("manifest" in ExecutiveAutomationPlatform);
  assert.ok("metadata" in ExecutiveAutomationPlatform);
});

test("platform helpers", () => {
  assert.deepEqual(getExecutiveAutomationPlatform(), ExecutiveAutomationPlatform);
  assert.deepEqual(
    getExecutiveAutomationPlatformMetadata(),
    ExecutiveAutomationPlatformMetadata,
  );
  assert.deepEqual(
    getExecutiveAutomationPlatformSummary(),
    ExecutiveAutomationPlatformSummary,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveAutomationPlatform()), true);
  assert.equal(Object.isFrozen(getExecutiveAutomationPlatformSummary()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveAutomationPlatform(),
    getExecutiveAutomationPlatform(),
  );
  assert.deepEqual(
    getExecutiveAutomationPlatformMetadata(),
    getExecutiveAutomationPlatformMetadata(),
  );
  assert.deepEqual(
    getExecutiveAutomationPlatformSummary(),
    getExecutiveAutomationPlatformSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveAutomationPlatform.metadataOnly, true);
  assert.equal(ExecutiveAutomationPlatformMetadata.metadataOnlyStatus, "MetadataOnly");
  assert.equal(
    ExecutiveAutomationPlatformSummary.releaseSummary.publicApiStatus,
    "Stable",
  );
});

test("manifest linkage", () => {
  assert.equal(
    ExecutiveAutomationPlatform.metadata.manifestSummary.phaseCount,
    buildAutomationManifest().summary.phaseCount,
  );
  assert.equal(
    ExecutiveAutomationPlatform.manifest.buildAutomationManifest().descriptor.platformId,
    "OPS-8:1",
  );
});

test("validation linkage", () => {
  assert.equal(
    ExecutiveAutomationPlatform.metadata.validationSummary.status,
    getAutomationValidationSummary().status,
  );
  assert.equal(
    ExecutiveAutomationPlatform.validation.validateExecutiveAutomationPlatform().status,
    "PASS",
  );
});
