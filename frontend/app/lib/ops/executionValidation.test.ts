import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveExecutionFoundation } from "./executionIndex.ts";
import {
  ExecutionCapabilityRegistry,
  ExecutionPlatformMetadata,
} from "./executionMetadataIndex.ts";
import { buildExecutionModelManifest } from "./executionModelIndex.ts";
import {
  buildExecutionValidationManifest,
  getExecutionValidationStatus,
  getExecutionValidationSummary,
  runExecutionValidation,
} from "./executionValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildExecutionValidationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-1:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runExecutionValidation();

  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runExecutionValidation(), runExecutionValidation());
  assert.deepEqual(getExecutionValidationSummary(), getExecutionValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildExecutionValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getExecutionValidationStatus(), "PASS");
});

test("no runtime side effects", () => {
  assert.equal(ExecutiveExecutionFoundation.metadataOnly, true);
  assert.equal(buildExecutionModelManifest().metadataOnly, true);
  assert.equal(runExecutionValidation().metadataOnly, true);
});

test("compatibility with OPS-1:1, OPS-1:2, OPS-1:3", () => {
  assert.equal(ExecutionPlatformMetadata.platformId, "OPS-1:1");
  assert.equal(ExecutionCapabilityRegistry.length, 8);
  assert.equal(buildExecutionModelManifest().models.all.length, 7);
});
