import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainProjectSnapshot } from "./domainProjectSnapshot.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "supplier", label: "Supplier", role: "input" },
        { id: "inventory", label: "Inventory", role: "process" },
      ],
      loops: [
        {
          id: "supply-flow",
          type: "flow",
          edges: [{ from: "supplier", to: "inventory", kind: "flow" }],
        },
      ],
    },
  };
}

test("builds a domain project snapshot with object and edge counts", () => {
  const result = buildDomainProjectSnapshot({
    projectId: "supply-project",
    projectName: "Supply Project",
    activeDomainId: "supply_chain",
    scene: scene(),
  });

  assert.equal(result.success, true);
  assert.equal(result.snapshot?.version, "domain-project-v1");
  assert.equal(result.snapshot?.activeDomainId, "supply_chain");
  assert.equal(result.snapshot?.metadata.objectCount, 2);
  assert.equal(result.snapshot?.metadata.edgeCount, 1);
});

test("unknown domain falls back safely", () => {
  const result = buildDomainProjectSnapshot({
    activeDomainId: "unknown-domain",
    scene: scene(),
  });

  assert.equal(result.success, true);
  assert.equal(result.snapshot?.activeDomainId, "general");
  assert.ok(result.warnings?.includes("active_domain_fallback_applied"));
});

test("snapshot builder does not mutate scene input", () => {
  const original = scene();
  const before = JSON.stringify(original);
  const result = buildDomainProjectSnapshot({
    activeDomainId: "supply_chain",
    scene: original,
  });

  assert.equal(result.success, true);
  assert.equal(JSON.stringify(original), before);
  assert.equal(result.snapshot?.scene, original);
});
