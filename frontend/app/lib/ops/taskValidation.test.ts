import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import { buildTaskModelManifest } from "./taskModelIndex.ts";
import {
  buildTaskValidationManifest,
  getTaskValidationStatus,
  getTaskValidationSummary,
  runTaskValidation,
} from "./taskValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildTaskValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-2:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runTaskValidation();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runTaskValidation(), runTaskValidation());
  assert.deepEqual(getTaskValidationSummary(), getTaskValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildTaskValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getTaskValidationStatus(), "PASS");
});

test("no runtime side effects", () => {
  assert.equal(ExecutiveTaskIntelligenceFoundation.metadataOnly, true);
  assert.equal(buildTaskModelManifest().metadataOnly, true);
  assert.equal(runTaskValidation().metadataOnly, true);
});

test("compatibility with OPS-2:1 through OPS-2:3", () => {
  assert.equal(TaskPlatformMetadata.platformId, "OPS-2:1");
  assert.equal(buildTaskModelManifest().models.lifecycle.length, 8);
  assert.equal(ExecutiveTaskIntelligenceFoundation.contracts.all.length, 7);
});
