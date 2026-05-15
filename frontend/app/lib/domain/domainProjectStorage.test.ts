import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainProjectSnapshot } from "./domainProjectSnapshot.ts";
import {
  DOMAIN_PROJECT_STORAGE_KEY,
  clearDomainProjectSnapshot,
  loadDomainProjectSnapshot,
  saveDomainProjectSnapshot,
} from "./domainProjectStorage.ts";

type Store = Record<string, string>;

function installStorage(initial: Store = {}): Store {
  const store = { ...initial };
  const localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true,
  });
  return store;
}

function clearWindow(): void {
  delete (globalThis as typeof globalThis & { window?: unknown }).window;
}

const scene = {
  state_vector: {},
  scene: {
    objects: [],
    loops: [],
  },
};

test("storage saves loads and clears a valid snapshot", () => {
  installStorage();
  const built = buildDomainProjectSnapshot({
    projectId: "saved-project",
    projectName: "Saved Project",
    activeDomainId: "retail",
    scene,
  });
  assert.ok(built.snapshot);

  const saved = saveDomainProjectSnapshot(built.snapshot);
  assert.equal(saved.success, true);

  const loaded = loadDomainProjectSnapshot();
  assert.equal(loaded.success, true);
  assert.equal(loaded.snapshot?.projectId, "saved-project");

  const cleared = clearDomainProjectSnapshot();
  assert.equal(cleared.success, true);
  assert.equal(loadDomainProjectSnapshot().success, false);
  clearWindow();
});

test("storage handles invalid JSON safely", () => {
  installStorage({ [DOMAIN_PROJECT_STORAGE_KEY]: "{not-json" });

  const loaded = loadDomainProjectSnapshot();

  assert.equal(loaded.success, false);
  assert.ok(loaded.warnings?.includes("local_storage_read_failed"));
  clearWindow();
});

test("storage fails closed without browser localStorage", () => {
  clearWindow();

  const loaded = loadDomainProjectSnapshot();

  assert.equal(loaded.success, false);
  assert.ok(loaded.warnings?.includes("local_storage_unavailable"));
});
