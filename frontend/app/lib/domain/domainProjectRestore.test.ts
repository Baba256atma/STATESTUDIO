import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainProjectSnapshot } from "./domainProjectSnapshot.ts";
import { restoreDomainProjectScene } from "./domainProjectRestore.ts";

const scene = {
  state_vector: {},
  scene: {
    objects: [{ id: "cash", label: "Cash Flow", role: "process" }],
    loops: [],
  },
};

test("restore returns scene and active domain id", () => {
  const built = buildDomainProjectSnapshot({
    projectId: "finance-project",
    projectName: "Finance Project",
    activeDomainId: "finance",
    scene,
  });
  assert.ok(built.snapshot);

  const restored = restoreDomainProjectScene({ snapshot: built.snapshot });

  assert.equal(restored.success, true);
  assert.equal(restored.scene, scene);
  assert.equal(restored.activeDomainId, "finance");
});

test("restore rejects invalid snapshot without mutating scene", () => {
  const built = buildDomainProjectSnapshot({
    activeDomainId: "finance",
    scene,
  });
  assert.ok(built.snapshot);
  const original = JSON.stringify(scene);

  const restored = restoreDomainProjectScene({
    snapshot: {
      ...built.snapshot,
      version: "bad" as never,
    },
  });

  assert.equal(restored.success, false);
  assert.ok(restored.warnings?.includes("invalid_version"));
  assert.equal(JSON.stringify(scene), original);
});
