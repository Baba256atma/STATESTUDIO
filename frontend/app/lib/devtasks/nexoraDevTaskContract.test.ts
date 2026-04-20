import test from "node:test";
import assert from "node:assert/strict";

import { normalizeDevTask, sortDevTasks } from "./nexoraDevTaskContract.ts";

test("normalizeDevTask trims and defaults", () => {
  const t = normalizeDevTask({
    id: "id-1",
    title: "  hello  ",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: 5,
    updatedAt: 6,
  });
  assert.equal(t.title, "hello");
  assert.equal(t.status, "in_progress");
  assert.equal(t.priority, "high");
});

test("normalizeDevTask dedupes dependsOn sorted", () => {
  const t = normalizeDevTask({
    id: "z",
    title: "t",
    dependsOn: ["b", "a", "b"],
    createdAt: 1,
    updatedAt: 2,
  });
  assert.deepEqual(t.dependsOn, ["a", "b"]);
});
