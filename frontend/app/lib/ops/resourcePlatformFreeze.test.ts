import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
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
  buildResourcePlatformFreezeManifest,
  getResourcePlatformFreezeSummary,
  runResourcePlatformFreeze,
  ResourcePlatformFreezeCompatibility,
  ResourcePlatformProjectCompatibility,
  ResourcePlatformRegressionMetadata,
  ResourcePlatformTaskCompatibility,
  ResourcePlatformWorkflowCompatibility,
} from "./resourcePlatformFreezeIndex.ts";

test("freeze manifest builds", () => {
  const manifest = buildResourcePlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeId, "OPS-5:8");
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
});

test("freeze runner returns PASS", () => {
  const result = runResourcePlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 11);
});

test("certification dependency is PASS", () => {
  assert.equal(
    buildResourcePlatformFreezeManifest().certificationDependency.certificationStatus,
    "PASS",
  );
});

test("regression metadata exists", () => {
  assert.equal(Object.isFrozen(ResourcePlatformRegressionMetadata), true);
  assert.equal(ResourcePlatformRegressionMetadata.length, 11);
});

test("resource compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ResourcePlatformFreezeCompatibility), true);
  assert.equal(ResourcePlatformFreezeCompatibility.length, 3);
});

test("task compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ResourcePlatformTaskCompatibility), true);
  assert.equal(ResourcePlatformTaskCompatibility.length, 2);
});

test("workflow compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ResourcePlatformWorkflowCompatibility), true);
  assert.equal(ResourcePlatformWorkflowCompatibility.length, 2);
});

test("project compatibility metadata exists", () => {
  assert.equal(Object.isFrozen(ResourcePlatformProjectCompatibility), true);
  assert.equal(ResourcePlatformProjectCompatibility.length, 2);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildResourcePlatformFreezeManifest()), true);
  assert.equal(Object.isFrozen(runResourcePlatformFreeze()), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    buildResourcePlatformFreezeManifest(),
    buildResourcePlatformFreezeManifest(),
  );
  assert.deepEqual(
    runResourcePlatformFreeze(),
    runResourcePlatformFreeze(),
  );
  assert.deepEqual(
    getResourcePlatformFreezeSummary(),
    getResourcePlatformFreezeSummary(),
  );
});

test("public API stability", () => {
  const manifest = buildResourcePlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1 through OPS-5:7", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ResourcePlatformFreezeCompatibility[0]?.target, "OPS-1 Public Platform");
});
