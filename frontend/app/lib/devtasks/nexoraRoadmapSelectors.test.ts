import test from "node:test";
import assert from "node:assert/strict";

import { normalizeDevTask } from "./nexoraDevTaskContract.ts";
import { normalizeRoadmapPhase } from "./nexoraRoadmapContract.ts";
import { buildPhaseTaskSummary, getTasksForPhase } from "./nexoraRoadmapSelectors.ts";

test("getTasksForPhase includes tag-based dependents", () => {
  const tasks = [
    normalizeDevTask({
      id: "t1",
      title: "fix",
      tag: "B20-FIX-1",
      phase: "B.20",
      status: "open",
      createdAt: 1,
      updatedAt: 1,
    }),
    normalizeDevTask({
      id: "t2",
      title: "follow",
      phase: "B.21",
      dependsOn: ["B20-FIX-1"],
      status: "open",
      createdAt: 2,
      updatedAt: 2,
    }),
  ];
  const linked = getTasksForPhase(tasks, "B.20");
  assert.equal(linked.length, 2);
});

test("buildPhaseTaskSummary reflects done tasks", () => {
  const phase = normalizeRoadmapPhase({ id: "B.20", title: "x", order: 1, status: "active" });
  const tasks = [
    normalizeDevTask({ id: "a", title: "open", phase: "B.20", status: "open", createdAt: 1, updatedAt: 1 }),
    normalizeDevTask({ id: "b", title: "done", phase: "B.20", status: "done", createdAt: 2, updatedAt: 2 }),
  ];
  const s = buildPhaseTaskSummary(tasks, phase, [phase]);
  assert.equal(s.total, 2);
  assert.equal(s.open, 1);
  assert.equal(s.done, 1);
});
