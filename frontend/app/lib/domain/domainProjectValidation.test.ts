import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainProjectSnapshot } from "./domainProjectSnapshot.ts";
import { validateDomainProjectSnapshot } from "./domainProjectValidation.ts";

const scene = {
  state_vector: {},
  scene: {
    objects: [],
    loops: [],
  },
};

test("validation accepts valid domain project snapshot", () => {
  const result = buildDomainProjectSnapshot({
    projectId: "valid",
    projectName: "Valid",
    activeDomainId: "finance",
    scene,
  });
  assert.ok(result.snapshot);

  const validation = validateDomainProjectSnapshot(result.snapshot);
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.warnings, []);
});

test("validation rejects malformed snapshot with warnings", () => {
  const validation = validateDomainProjectSnapshot({
    version: "wrong",
    projectId: "",
    activeDomainId: "not-real",
    scene: null,
    metadata: {
      createdBy: "someone-else",
      domainPhase: "other",
      objectCount: "two",
      edgeCount: Number.NaN,
    },
  });

  assert.equal(validation.valid, false);
  assert.ok(validation.warnings.includes("invalid_version"));
  assert.ok(validation.warnings.includes("missing_project_id"));
  assert.ok(validation.warnings.includes("missing_project_name"));
  assert.ok(validation.warnings.includes("invalid_active_domain"));
  assert.ok(validation.warnings.includes("missing_scene"));
  assert.ok(validation.warnings.includes("invalid_object_count"));
  assert.ok(validation.warnings.includes("invalid_edge_count"));
});
