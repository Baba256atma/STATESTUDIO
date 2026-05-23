import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  loadWorkspace,
  saveWorkspace,
  listSavedWorkspaces,
} from "./workspacePersistenceRuntime";
import { resetWorkspacePersistenceInstrumentationForTests } from "./workspacePersistenceInstrumentation";
import type { SceneJson } from "../sceneTypes";

const baseScene: SceneJson = {
  state_vector: {},
  scene: {
    objects: [
      {
        id: "obj_a",
        label: "Supplier",
        category: "operations",
        position: [0, 0, 0],
        meta: { source: "catalog" },
      },
      {
        id: "obj_b",
        label: "Factory",
        category: "operations",
        position: [2, 0, 0],
        meta: { source: "catalog" },
      },
    ],
    relationships: [
      {
        id: "rel_a",
        sourceId: "obj_a",
        targetId: "obj_b",
        type: "supplies",
        direction: "uni",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    loops: [],
  },
};

describe("workspacePersistenceRuntime", () => {
  beforeEach(() => {
    resetWorkspacePersistenceInstrumentationForTests();
    vi.spyOn(globalThis.console, "info").mockImplementation(() => undefined);
    if (typeof globalThis.window === "undefined") {
      const store: Record<string, string> = {};
      (globalThis as typeof globalThis & { window: Window }).window = {
        localStorage: {
          getItem: (key: string) => store[key] ?? null,
          setItem: (key: string, value: string) => {
            store[key] = value;
          },
          removeItem: (key: string) => {
            delete store[key];
          },
          clear: () => {
            Object.keys(store).forEach((key) => delete store[key]);
          },
        },
      } as unknown as Window;
    } else {
      window.localStorage.clear();
    }
  });

  it("saves and lists executive workspaces", () => {
    const result = saveWorkspace({
      sceneJson: baseScene,
      name: "Supply Chain Session",
    });
    expect(result.success).toBe(true);
    const listed = listSavedWorkspaces();
    expect(listed.length).toBe(1);
    expect(listed[0]?.name).toBe("Supply Chain Session");
    expect(listed[0]?.objectCount).toBe(2);
  });

  it("loads and restores workspace contracts", () => {
    const saved = saveWorkspace({ sceneJson: baseScene, name: "Restore Test" });
    expect(saved.success).toBe(true);
    const workspaceId = saved.workspace?.id;
    expect(workspaceId).toBeTruthy();

    const loaded = loadWorkspace(workspaceId!, {
      state_vector: {},
      scene: { objects: [], relationships: [], loops: [] },
    });
    expect(loaded.success).toBe(true);
    expect(loaded.nextScene?.scene.objects?.length).toBe(2);
    expect(loaded.nextScene?.scene.relationships?.length).toBe(1);
  });
});
