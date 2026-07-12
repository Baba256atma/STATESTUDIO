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
import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import { buildResourceModelManifest } from "./resourceModelIndex.ts";
import {
  buildResourceValidationManifest,
  getResourceValidationStatus,
  getResourceValidationSummary,
  runResourceValidation,
} from "./resourceValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildResourceValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-5:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runResourceValidation();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runResourceValidation(), runResourceValidation());
  assert.deepEqual(getResourceValidationSummary(), getResourceValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildResourceValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getResourceValidationStatus(), "PASS");
});

test("immutable exports", () => {
  assert.equal(ExecutiveResourceIntelligenceFoundation.metadataOnly, true);
  assert.equal(buildResourceModelManifest().metadataOnly, true);
  assert.equal(runResourceValidation().metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1 through OPS-5:3", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ResourcePlatformMetadata.platformId, "OPS-5:1");
  assert.equal(buildResourceModelManifest().models.capacity.length, 3);
  assert.equal(ExecutiveResourceIntelligenceFoundation.contracts.all.length, 12);
});
