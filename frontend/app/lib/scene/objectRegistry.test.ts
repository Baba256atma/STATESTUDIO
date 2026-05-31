import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SceneObject } from "../sceneTypes";
import {
  buildSceneObjectsRegistrySignature,
  resetSceneObjectRegistryForTests,
  resolveStableObjectId,
  syncSceneObjectRegistry,
} from "./objectRegistryRuntime";
import {
  recordObjectMount,
  recordObjectUnmount,
  resetObjectRemountDetectorForTests,
} from "./objectRemountDetector";
import { resetObjectMountDiagnosticsForTests } from "./objectMountDiagnostics";

const sample = (overrides: Partial<SceneObject> = {}): SceneObject =>
  ({
    id: "node_a",
    name: "Node A",
    type: "sphere",
    ...overrides,
  }) as SceneObject;

describe("objectRegistryRuntime", () => {
  beforeEach(() => {
    resetSceneObjectRegistryForTests();
  });

  it("prefers id then name then semantic fingerprint for stable keys", () => {
    expect(resolveStableObjectId(sample(), 0)).toBe("node_a");
    expect(resolveStableObjectId(sample({ id: undefined, name: "Fallback" }), 2)).toBe("Fallback");
    const first = resolveStableObjectId(sample({ id: undefined, name: undefined }), 4);
    const second = resolveStableObjectId(sample({ id: undefined, name: undefined }), 9);
    expect(first).toMatch(/^sphere:/);
    expect(second).toBe(first);
  });

  it("reuses object references when scene array is recreated with equal content", () => {
    const first = [sample(), sample({ id: "node_b", name: "Node B" })];
    const syncedFirst = syncSceneObjectRegistry(first);
    const recreated = first.map((object) => ({ ...object }));
    const syncedSecond = syncSceneObjectRegistry(recreated);
    expect(buildSceneObjectsRegistrySignature(first)).toBe(buildSceneObjectsRegistrySignature(recreated));
    expect(syncedSecond[0]).toBe(syncedFirst[0]);
    expect(syncedSecond[1]).toBe(syncedFirst[1]);
  });
});

describe("objectRemountDetector", () => {
  beforeEach(() => {
    resetObjectRemountDetectorForTests();
    resetObjectMountDiagnosticsForTests();
  });

  it("flags rapid remount within three seconds", () => {
    vi.useFakeTimers();
    recordObjectMount({ objectId: "node_a", reactKey: "node_a", source: "test" });
    recordObjectUnmount({ objectId: "node_a", reactKey: "node_a", source: "test" });
    vi.advanceTimersByTime(250);
    const remount = recordObjectMount({ objectId: "node_a", reactKey: "node_a", source: "test" });
    expect(remount?.reason).toBe("rapid_remount");
    vi.useRealTimers();
  });
});
