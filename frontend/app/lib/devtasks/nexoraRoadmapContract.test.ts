import test from "node:test";
import assert from "node:assert/strict";

import { groupPhasesByParent, normalizeRoadmapPhase, sortRoadmapPhases } from "./nexoraRoadmapContract.ts";

test("normalizeRoadmapPhase defaults parent and order", () => {
  const p = normalizeRoadmapPhase({ id: "B.1", title: "  t  ", status: "ACTIVE" });
  assert.equal(p.title, "t");
  assert.equal(p.status, "active");
  assert.equal(p.parentId ?? null, null);
  assert.equal(p.order, 0);
});

test("sortRoadmapPhases nests children after parent", () => {
  const phases = [
    normalizeRoadmapPhase({ id: "B.child", title: "c", order: 2, parentId: "B.root", status: "planned" }),
    normalizeRoadmapPhase({ id: "B.root", title: "r", order: 1, parentId: null, status: "planned" }),
  ];
  const s = sortRoadmapPhases(phases);
  assert.equal(s[0]?.id, "B.root");
  assert.equal(s[1]?.id, "B.child");
});

test("groupPhasesByParent uses __root__", () => {
  const g = groupPhasesByParent([
    normalizeRoadmapPhase({ id: "a", title: "A", order: 1, parentId: null }),
    normalizeRoadmapPhase({ id: "b", title: "B", order: 1, parentId: "a" }),
  ]);
  assert.ok(g.has("__root__"));
  assert.equal(g.get("a")?.length, 1);
});
