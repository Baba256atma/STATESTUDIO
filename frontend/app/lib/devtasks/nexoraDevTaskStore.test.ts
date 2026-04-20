/**
 * D.2 — dev task store (mocked localStorage).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { normalizeDevTask, sortDevTasks, type NexoraDevTask } from "./nexoraDevTaskContract.ts";
import {
  appendDevTask,
  clearDevTasks,
  deleteDevTask,
  loadDevTasks,
  saveDevTasks,
  updateDevTask,
} from "./nexoraDevTaskStore.ts";

const store = new Map<string, string>();

function installMockWindow(): void {
  store.clear();
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => void store.clear(),
      key: () => null,
      length: 0,
    } as Storage,
  };
}

function task(id: string, title: string, overrides: Partial<NexoraDevTask> = {}): NexoraDevTask {
  const now = 1000;
  return normalizeDevTask({
    id,
    title,
    status: "open",
    priority: "medium",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

test("loadDevTasks survives bad JSON", () => {
  installMockWindow();
  window.localStorage.setItem("nexora.devTasks.v1", "not-json");
  assert.deepEqual(loadDevTasks(), []);
  window.localStorage.setItem("nexora.devTasks.v1", JSON.stringify([{ id: "" }]));
  assert.deepEqual(loadDevTasks(), []);
});

test("append dedupes by id and persists across reload", () => {
  installMockWindow();
  clearDevTasks();
  appendDevTask(task("a", "Outcome lookup should be runId-specific", { tag: "B20-FIX-1", phase: "B.20", priority: "high" }));
  appendDevTask(task("a", "Updated title", { priority: "low" }));
  const one = loadDevTasks();
  assert.equal(one.length, 1);
  assert.equal(one[0]?.title, "Updated title");
});

test("updateDevTask sets status done", () => {
  installMockWindow();
  clearDevTasks();
  appendDevTask(task("x", "t"));
  updateDevTask("x", { status: "done" });
  assert.equal(loadDevTasks()[0]?.status, "done");
});

test("deleteDevTask removes", () => {
  installMockWindow();
  saveDevTasks([task("1", "a"), task("2", "b")]);
  deleteDevTask("1");
  assert.equal(loadDevTasks().length, 1);
  assert.equal(loadDevTasks()[0]?.id, "2");
});

test("sortDevTasks is stable (priority then status then updatedAt)", () => {
  const a = task("a", "low pri", { priority: "low", status: "open", updatedAt: 3 });
  const b = task("b", "high pri", { priority: "high", status: "done", updatedAt: 99 });
  const c = task("c", "high open", { priority: "high", status: "open", updatedAt: 1 });
  const s = sortDevTasks([a, b, c]);
  assert.equal(s[0]?.id, "c");
  assert.equal(s[1]?.id, "b");
  assert.equal(s[2]?.id, "a");
});
