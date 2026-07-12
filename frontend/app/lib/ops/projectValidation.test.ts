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
import { ExecutiveProjectExecutionFoundation } from "./projectExecutionIndex.ts";
import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import { buildProjectModelManifest } from "./projectModelIndex.ts";
import {
  buildProjectValidationManifest,
  getProjectValidationStatus,
  getProjectValidationSummary,
  runProjectValidation,
} from "./projectValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildProjectValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-4:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runProjectValidation();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runProjectValidation(), runProjectValidation());
  assert.deepEqual(getProjectValidationSummary(), getProjectValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildProjectValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getProjectValidationStatus(), "PASS");
});

test("immutable exports", () => {
  assert.equal(ExecutiveProjectExecutionFoundation.metadataOnly, true);
  assert.equal(buildProjectModelManifest().metadataOnly, true);
  assert.equal(runProjectValidation().metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, and OPS-4:1 through OPS-4:3", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ProjectPlatformMetadata.platformId, "OPS-4:1");
  assert.equal(buildProjectModelManifest().models.phase.length, 5);
  assert.equal(ExecutiveProjectExecutionFoundation.contracts.all.length, 7);
});

