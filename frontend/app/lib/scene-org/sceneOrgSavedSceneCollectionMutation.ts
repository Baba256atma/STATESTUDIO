/**
 * NPA-T SAVED-SCENE-COLLECTION-MANAGEMENT:1
 *
 * Bounded rename/delete over the hydrated Saved Scene collection.
 * Does not own restoration, canonical truth, or a second persistence key.
 */

import { createSceneOrgSavedScene, type SceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract";
import { normalizeSavedSceneAccessName } from "./sceneOrgSavedSceneCollectionAccess";
import {
  persistSceneOrgSavedScenes,
  type SceneOrgSavedScenePersistResult,
  type SceneOrgSavedSceneStorage,
} from "./sceneOrgSavedSceneDurability";

export const sceneOrgSavedSceneCollectionMutationIdentity =
  "NPA-T SAVED-SCENE-COLLECTION-MANAGEMENT:1/HydratedCollectionMutation" as const;

export type SceneOrgSavedSceneRenameStatus =
  | "renamed"
  | "unchanged"
  | "not-found"
  | "invalid-name"
  | "name-conflict"
  | "persistence-failed";

export type SceneOrgSavedSceneDeleteStatus =
  | "deleted"
  | "not-found"
  | "persistence-failed";

export type SceneOrgSavedSceneMutationKind = "rename" | "delete";

export type SceneOrgSavedSceneMutationResult = Readonly<{
  kind: SceneOrgSavedSceneMutationKind;
  status: SceneOrgSavedSceneRenameStatus | SceneOrgSavedSceneDeleteStatus;
  sceneId: string;
  scenes: readonly SceneOrgSavedScene[];
  scene: SceneOrgSavedScene | null;
}>;

export type SceneOrgSavedSceneCollectionMutation =
  | Readonly<{ kind: "rename"; sceneId: string; name: string }>
  | Readonly<{ kind: "delete"; sceneId: string }>;

type PersistFn = (
  scenes: readonly SceneOrgSavedScene[],
  storage?: SceneOrgSavedSceneStorage | null,
) => SceneOrgSavedScenePersistResult;

function freezeResult(
  result: SceneOrgSavedSceneMutationResult,
): SceneOrgSavedSceneMutationResult {
  return Object.freeze(result);
}

function commit(
  original: readonly SceneOrgSavedScene[],
  next: readonly SceneOrgSavedScene[],
  kind: SceneOrgSavedSceneMutationKind,
  successStatus: "renamed" | "deleted",
  sceneId: string,
  scene: SceneOrgSavedScene | null,
  persist: PersistFn,
  storage?: SceneOrgSavedSceneStorage | null,
): SceneOrgSavedSceneMutationResult {
  const persistence = persist(next, storage);
  if (!persistence.persisted) {
    return freezeResult({
      kind,
      status: "persistence-failed",
      sceneId,
      scenes: original,
      scene: original.find((candidate) => candidate.sceneId === sceneId) ?? null,
    });
  }
  return freezeResult({
    kind,
    status: successStatus,
    sceneId,
    scenes: Object.freeze([...next]),
    scene,
  });
}

export function applySceneOrgSavedSceneCollectionMutation(input: {
  readonly scenes: readonly SceneOrgSavedScene[];
  readonly mutation: SceneOrgSavedSceneCollectionMutation;
  readonly persist?: PersistFn;
  readonly storage?: SceneOrgSavedSceneStorage | null;
}): SceneOrgSavedSceneMutationResult {
  const persist = input.persist ?? persistSceneOrgSavedScenes;
  const scenes = input.scenes;
  const sceneId = input.mutation.sceneId.trim();
  const index = scenes.findIndex((scene) => scene.sceneId === sceneId);
  if (index < 0) {
    return freezeResult({
      kind: input.mutation.kind,
      status: "not-found",
      sceneId,
      scenes,
      scene: null,
    });
  }
  const current = scenes[index]!;

  if (input.mutation.kind === "delete") {
    const next = scenes.filter((scene) => scene.sceneId !== sceneId);
    return commit(
      scenes,
      next,
      "delete",
      "deleted",
      sceneId,
      current,
      persist,
      input.storage,
    );
  }

  const name = input.mutation.name.trim();
  if (name.length === 0) {
    return freezeResult({
      kind: "rename",
      status: "invalid-name",
      sceneId,
      scenes,
      scene: current,
    });
  }
  if (name === current.name) {
    return freezeResult({
      kind: "rename",
      status: "unchanged",
      sceneId,
      scenes,
      scene: current,
    });
  }
  const normalized = normalizeSavedSceneAccessName(name);
  const conflict = scenes.some(
    (scene) =>
      scene.sceneId !== sceneId &&
      normalizeSavedSceneAccessName(scene.name) === normalized,
  );
  if (conflict) {
    return freezeResult({
      kind: "rename",
      status: "name-conflict",
      sceneId,
      scenes,
      scene: current,
    });
  }
  const renamed = createSceneOrgSavedScene({
    ...current,
    name,
  });
  const next = scenes.map((scene) =>
    scene.sceneId === sceneId ? renamed : scene,
  );
  return commit(
    scenes,
    next,
    "rename",
    "renamed",
    sceneId,
    renamed,
    persist,
    input.storage,
  );
}
