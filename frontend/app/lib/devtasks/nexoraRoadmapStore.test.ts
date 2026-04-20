import test from "node:test";
import assert from "node:assert/strict";

import { normalizeRoadmapPhase } from "./nexoraRoadmapContract.ts";
import {
  clearRoadmapPhases,
  loadRoadmapPhases,
  saveRoadmapPhases,
  seedDefaultRoadmapPhasesIfEmpty,
  upsertRoadmapPhase,
} from "./nexoraRoadmapStore.ts";

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

test("loadRoadmapPhases survives corrupt JSON", () => {
  installMockWindow();
  window.localStorage.setItem("nexora.roadmap.v1", "{");
  assert.deepEqual(loadRoadmapPhases(), []);
});

test("upsert and seed", () => {
  installMockWindow();
  clearRoadmapPhases();
  seedDefaultRoadmapPhasesIfEmpty();
  assert.ok(loadRoadmapPhases().length >= 1);
  upsertRoadmapPhase(
    normalizeRoadmapPhase({
      id: "B.20",
      title: "Custom B20 title",
      order: 20,
      status: "active",
      parentId: null,
    })
  );
  const p = loadRoadmapPhases().find((x) => x.id === "B.20");
  assert.equal(p?.title, "Custom B20 title");
});

test("save dedupes by id", () => {
  installMockWindow();
  saveRoadmapPhases([
    normalizeRoadmapPhase({ id: "x", title: "a", order: 1 }),
    normalizeRoadmapPhase({ id: "x", title: "b", order: 2 }),
  ]);
  assert.equal(loadRoadmapPhases().filter((p) => p.id === "x").length, 1);
  assert.equal(loadRoadmapPhases().find((p) => p.id === "x")?.title, "b");
});
