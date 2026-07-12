import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveWorkflowIntelligenceFoundation,
} from "./workflowIntelligenceIndex.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import { buildWorkflowModelManifest } from "./workflowModelIndex.ts";
import {
  buildWorkflowValidationManifest,
  getWorkflowValidationStatus,
  getWorkflowValidationSummary,
  runWorkflowValidation,
} from "./workflowValidationIndex.ts";

test("validation manifest builds", () => {
  const manifest = buildWorkflowValidationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.validationIdentity.validationId, "OPS-3:4");
  assert.equal(manifest.validationIdentity.consumedPhases.length, 3);
});

test("validation runner returns PASS", () => {
  const result = runWorkflowValidation();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, result.validationEntries.length);
});

test("deterministic output", () => {
  assert.deepEqual(runWorkflowValidation(), runWorkflowValidation());
  assert.deepEqual(getWorkflowValidationSummary(), getWorkflowValidationSummary());
});

test("public API stability", () => {
  assert.equal(buildWorkflowValidationManifest().publicApiSurface.length >= 9, true);
  assert.equal(getWorkflowValidationStatus(), "PASS");
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildWorkflowValidationManifest()), true);
  assert.equal(Object.isFrozen(runWorkflowValidation()), true);
});

test("compatibility with OPS-1, OPS-2, OPS-3:1 through OPS-3:3", () => {
  assert.equal(WorkflowPlatformMetadata.platformId, "OPS-3:1");
  assert.equal(buildWorkflowModelManifest().models.stage.length, 5);
  assert.equal(ExecutiveWorkflowIntelligenceFoundation.contracts.all.length, 7);
});
