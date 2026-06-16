import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_HOMESCREEN_SPECIAL_CASE_REMOVED,
  ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED_TAG,
  ADVISORY_USES_CANONICAL_WORKSPACE_LAUNCH,
} from "./advisoryNormalWorkspaceLifecycleHotfixContract.ts";

test("exports advisory normal workspace lifecycle fixed tag", () => {
  assert.equal(
    ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED_TAG,
    "[ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED]"
  );
});

test("advisory uses canonical workspace launch path", () => {
  assert.equal(ADVISORY_USES_CANONICAL_WORKSPACE_LAUNCH, true);
  assert.equal(ADVISORY_HOMESCREEN_SPECIAL_CASE_REMOVED, true);
});
