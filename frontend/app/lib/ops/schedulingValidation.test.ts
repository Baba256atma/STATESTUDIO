import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionPublicIndexId,
} from "./executiveProjectExecutionPublicIndex.ts";
import {
  ExecutiveResourceIntelligencePublicIndexId,
} from "./executiveResourceIntelligencePublicIndex.ts";
import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import { SchedulingPlatformMetadata } from "./schedulingMetadataIndex.ts";
import { buildSchedulingModelManifest } from "./schedulingModelIndex.ts";
import {
  buildSchedulingValidationManifest,
  getSchedulingValidationStatus,
  getSchedulingValidationSummary,
  runSchedulingValidation,
} from "./schedulingValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildSchedulingValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-6:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runSchedulingValidation();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runSchedulingValidation(), runSchedulingValidation());
  assert.deepEqual(getSchedulingValidationSummary(), getSchedulingValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildSchedulingValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getSchedulingValidationStatus(), "PASS");
});

test("immutable exports", () => {
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.metadataOnly, true);
  assert.equal(buildSchedulingModelManifest().metadataOnly, true);
  assert.equal(runSchedulingValidation().metadataOnly, true);
});

test("compatibility with OPS-1 through OPS-6:3", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(SchedulingPlatformMetadata.platformId, "OPS-6:1");
  assert.equal(buildSchedulingModelManifest().models.timeline.length, 2);
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.contracts.all.length, 8);
});
