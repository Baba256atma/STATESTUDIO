import {
  createSceneOrgCanonicalReference,
  type SceneOrgCanonicalReferenceKind,
  type SceneOrgRegionId,
} from "./sceneOrgRegionContract";
import {
  createSceneOrgSavedScene,
  parseSceneOrgCausalSelection,
  savedSceneManagerWorkspaceId,
  SCENE_ORG_SAVED_SCENE_KINDS,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract";
import { parseSceneOrgSavedSceneSpatialState } from "./sceneOrgSavedSceneSpatialState";
import { parseStagePresentationView } from "./organizationalSolarView";
import { parseCanonicalTopologyPresentation } from "./canonicalTopologyEngine";
import { SCENE_ORG_VISIBILITY_LEVELS } from "./sceneOrgVisibilityContract";
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination } from "../workspace/workspaceAuthorityFence";

export const sceneOrgSavedSceneDurabilityIdentity =
  "NPA-T SAVED-SCENE-DURABILITY:1/LocalSavedSceneMetadata" as const;
export const SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION = 1 as const;
export const SCENE_ORG_SAVED_SCENE_STORAGE_KEY = "nexora.saved-scenes.v1" as const;

export const SCENE_ORG_SAVED_SCENE_DURABILITY_BOUNDARY = Object.freeze({
  classification: "LOCAL MVP DURABILITY" as const,
  target: "browser-localStorage" as const,
  scope: "browser-profile-and-device" as const,
  accountBound: false as const,
  crossDevice: false as const,
  ownsCanonicalTruth: false as const,
  opensSceneDuringHydration: false as const,
});

export type SceneOrgSavedSceneStorage = Pick<Storage, "getItem" | "setItem">;

export type SceneOrgSavedSceneLoadResult = Readonly<{
  status: "loaded" | "empty" | "unavailable" | "invalid" | "incompatible";
  scenes: readonly SceneOrgSavedScene[];
  rejectedRecords: number;
}>;

export type SceneOrgSavedScenePersistResult = Readonly<{
  persisted: boolean;
  reason: "persisted" | "unavailable" | "write-failed" | "revision-conflict";
  scenes?: readonly SceneOrgSavedScene[];
  current?: SceneOrgSavedScene;
}>;

export const SAVED_SCENE_STALE_MESSAGE =
  "This Saved Scene was changed in another tab. Review the latest version before saving again." as const;

/** Missing revision metadata is revision 1. This does not invent earlier edit events. */
export function readSceneContentRevision(scene: Pick<SceneOrgSavedScene, "revision">): number {
  return typeof scene.revision === "number" && Number.isInteger(scene.revision) && scene.revision >= 1
    ? scene.revision
    : 1;
}

type DurableEnvelope = Readonly<{
  identity: typeof sceneOrgSavedSceneDurabilityIdentity;
  version: typeof SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION;
  scenes: readonly SceneOrgSavedScene[];
}>;

const REFERENCE_KINDS = new Set<SceneOrgCanonicalReferenceKind>([
  "object",
  "collection",
  "data-object",
  "data-source",
  "decision",
  "execution",
]);
const REGION_IDS = new Set<SceneOrgRegionId>([
  "left-management",
  "center-stage",
  "right-context",
  "detail-workspace",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseScene(value: unknown): SceneOrgSavedScene | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.sceneId !== "string" ||
    typeof value.name !== "string" ||
    typeof value.sceneIntentType !== "string" ||
    !SCENE_ORG_SAVED_SCENE_KINDS.includes(
      value.kind as (typeof SCENE_ORG_SAVED_SCENE_KINDS)[number],
    ) ||
    value.kind === "TEMPORARY" ||
    !Array.isArray(value.canonicalReferences) ||
    !isRecord(value.layout) ||
    !isRecord(value.visibility)
  ) {
    return null;
  }
  const references = value.canonicalReferences.map((reference) => {
    if (
      !isRecord(reference) ||
      typeof reference.canonicalId !== "string" ||
      typeof reference.owner !== "string" ||
      !REFERENCE_KINDS.has(reference.kind as SceneOrgCanonicalReferenceKind)
    ) {
      return null;
    }
    try {
      return createSceneOrgCanonicalReference({
        canonicalId: reference.canonicalId,
        kind: reference.kind as SceneOrgCanonicalReferenceKind,
        owner: reference.owner,
      });
    } catch {
      return null;
    }
  });
  if (references.some((reference) => reference === null)) return null;

  const layout = value.layout;
  if (
    !["minimum", "report", "operation"].includes(String(layout.presentationDepth)) ||
    layout.leftRegion !== "management" ||
    !["contextual", "collapsed"].includes(String(layout.rightRegion)) ||
    !["closed", "open"].includes(String(layout.detailWorkspace))
  ) {
    return null;
  }
  const visibility: Partial<Record<SceneOrgRegionId, (typeof SCENE_ORG_VISIBILITY_LEVELS)[number]>> = {};
  for (const [region, level] of Object.entries(value.visibility)) {
    if (
      !REGION_IDS.has(region as SceneOrgRegionId) ||
      !SCENE_ORG_VISIBILITY_LEVELS.includes(
        level as (typeof SCENE_ORG_VISIBILITY_LEVELS)[number],
      )
    ) {
      return null;
    }
    visibility[region as SceneOrgRegionId] =
      level as (typeof SCENE_ORG_VISIBILITY_LEVELS)[number];
  }
  try {
    return createSceneOrgSavedScene({
      sceneId: value.sceneId,
      name: value.name,
      kind: value.kind as "SAVED" | "DEFAULT_MANAGER",
      sceneIntentType: value.sceneIntentType,
      managerWorkspaceId: savedSceneManagerWorkspaceId(value.managerWorkspaceId),
      demoProfileId:
        value.demoProfileId === "manufacturing" || value.demoProfileId === "project"
          ? value.demoProfileId
          : null,
      ownerDeckId: typeof value.ownerDeckId === "string" ? value.ownerDeckId : null,
      spatialState: parseSceneOrgSavedSceneSpatialState(value.spatialState),
      stageView: parseStagePresentationView(value.stageView),
      causalSelection: parseSceneOrgCausalSelection(value.causalSelection),
      topologyPresentation: parseCanonicalTopologyPresentation(value.topologyPresentation),
      canonicalReferences: references as NonNullable<(typeof references)[number]>[],
      layout: {
        presentationDepth: layout.presentationDepth as "minimum" | "report" | "operation",
        leftRegion: "management",
        rightRegion: layout.rightRegion as "contextual" | "collapsed",
        detailWorkspace: layout.detailWorkspace as "closed" | "open",
      },
      visibility,
      revision: typeof value.revision === "number" ? value.revision : null,
    });
  } catch {
    return null;
  }
}

export function serializeSceneOrgSavedScenes(
  scenes: readonly SceneOrgSavedScene[],
): string {
  const durableScenes = scenes
    .filter((scene) => scene.kind !== "TEMPORARY")
    .map((scene) => createSceneOrgSavedScene(scene));
  const envelope: DurableEnvelope = Object.freeze({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
    scenes: Object.freeze(durableScenes),
  });
  return JSON.stringify(envelope);
}

export function parseSceneOrgSavedScenes(raw: string): SceneOrgSavedSceneLoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Object.freeze({ status: "invalid", scenes: Object.freeze([]), rejectedRecords: 0 });
  }
  if (!isRecord(parsed) || parsed.identity !== sceneOrgSavedSceneDurabilityIdentity) {
    return Object.freeze({ status: "invalid", scenes: Object.freeze([]), rejectedRecords: 0 });
  }
  if (parsed.version !== SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION) {
    return Object.freeze({ status: "incompatible", scenes: Object.freeze([]), rejectedRecords: 0 });
  }
  if (!Array.isArray(parsed.scenes)) {
    return Object.freeze({ status: "invalid", scenes: Object.freeze([]), rejectedRecords: 0 });
  }

  const scenes: SceneOrgSavedScene[] = [];
  const seenIds = new Set<string>();
  const defaultOwners = new Set<string>();
  let rejectedRecords = 0;
  for (const candidate of parsed.scenes) {
    const scene = parseScene(candidate);
    const ownerKey = scene
      ? `${scene.managerWorkspaceId ?? ""}\0${scene.demoProfileId ?? ""}\0${scene.ownerDeckId ?? ""}`
      : "";
    if (
      !scene ||
      seenIds.has(scene.sceneId) ||
      (scene.kind === "DEFAULT_MANAGER" && defaultOwners.has(ownerKey))
    ) {
      rejectedRecords += 1;
      continue;
    }
    seenIds.add(scene.sceneId);
    if (scene.kind === "DEFAULT_MANAGER") defaultOwners.add(ownerKey);
    scenes.push(scene);
  }
  return Object.freeze({
    status: "loaded",
    scenes: Object.freeze(scenes),
    rejectedRecords,
  });
}

function browserStorage(): SceneOrgSavedSceneStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadSceneOrgSavedScenes(
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedSceneLoadResult {
  if (!storage) {
    return Object.freeze({ status: "unavailable", scenes: Object.freeze([]), rejectedRecords: 0 });
  }
  try {
    const raw = storage.getItem(SCENE_ORG_SAVED_SCENE_STORAGE_KEY);
    return raw
      ? parseSceneOrgSavedScenes(raw)
      : Object.freeze({ status: "empty", scenes: Object.freeze([]), rejectedRecords: 0 });
  } catch {
    return Object.freeze({ status: "unavailable", scenes: Object.freeze([]), rejectedRecords: 0 });
  }
}

export const SAVED_SCENE_OWNERSHIP_EVIDENCE = Object.freeze({
  accepted: Object.freeze([
    "persisted-canonical-id",
    "business-project-reference",
    "explicit-source-link",
    "durable-workspace-bound-reference",
  ]),
  rejected: Object.freeze([
    "scene-name",
    "scene-id",
    "active-workspace",
    "workflow-mode",
    "selected-object",
    "layout",
    "visibility",
    "created-timestamp",
  ]),
});

const ACCEPTED_SCENE_OWNERSHIP_BASES = new Set<string>(SAVED_SCENE_OWNERSHIP_EVIDENCE.accepted);

export type SavedSceneOwnershipProof = Readonly<{
  sceneId: string;
  targetWorkspaceId: string;
  basis: string;
}>;

export type SavedSceneOwnershipMigrationReport = Readonly<{
  activeWorkspaceUsedAsEvidence: false;
  changed: boolean;
  scenes: readonly SceneOrgSavedScene[];
}>;

/** Assigns an owner only from an explicit accepted proof. The active workspace is ignored. */
export function applySavedSceneOwnershipMigration(
  scenes: readonly SceneOrgSavedScene[],
  options: {
    readonly activeWorkspaceId?: string | null;
    readonly proofs?: readonly SavedSceneOwnershipProof[];
  } = {},
): SavedSceneOwnershipMigrationReport {
  void options.activeWorkspaceId;
  const proofs = options.proofs ?? [];
  let changed = false;
  const next = scenes.map((scene) => {
    if (scene.managerWorkspaceId) return scene;
    const accepted = proofs.filter(
      (proof) =>
        proof.sceneId === scene.sceneId &&
        ACCEPTED_SCENE_OWNERSHIP_BASES.has(proof.basis) &&
        savedSceneManagerWorkspaceId(proof.targetWorkspaceId) === proof.targetWorkspaceId,
    );
    const targets = [...new Set(accepted.map((proof) => proof.targetWorkspaceId))];
    if (targets.length !== 1) return scene;
    changed = true;
    return createSceneOrgSavedScene({
      ...scene,
      managerWorkspaceId: targets[0],
    });
  });
  return Object.freeze({
    activeWorkspaceUsedAsEvidence: false as const,
    changed,
    scenes: changed ? Object.freeze(next) : scenes,
  });
}

export function persistSceneOrgSavedScenes(
  scenes: readonly SceneOrgSavedScene[],
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedScenePersistResult {
  if (!storage) return Object.freeze({ persisted: false, reason: "unavailable" });
  if (requireWorkspaceMutationCoordination()) return Object.freeze({ persisted: false, reason: "write-failed" });
  const loaded = loadSceneOrgSavedScenes(storage);
  if (loaded.status === "loaded") {
    const previous = new Map(loaded.scenes.map((scene) => [scene.sceneId, JSON.stringify(scene)]));
    for (const scene of scenes) {
      if (previous.get(scene.sceneId) === JSON.stringify(scene)) continue;
      const owner = savedSceneManagerWorkspaceId(scene.managerWorkspaceId);
      if (owner && !evaluateWorkspaceAuthority(owner).ok) {
        return Object.freeze({ persisted: false, reason: "write-failed" });
      }
    }
  }
  try {
    storage.setItem(SCENE_ORG_SAVED_SCENE_STORAGE_KEY, serializeSceneOrgSavedScenes(scenes));
    return Object.freeze({ persisted: true, reason: "persisted" });
  } catch {
    return Object.freeze({ persisted: false, reason: "write-failed" });
  }
}

function sceneContentKey(scene: SceneOrgSavedScene): string {
  const { revision: _revision, ...content } = scene;
  return JSON.stringify(content);
}

function withSceneRevision(scene: SceneOrgSavedScene, revision: number): SceneOrgSavedScene {
  return createSceneOrgSavedScene({ ...scene, revision });
}

/**
 * Writes one Scene onto the latest collection.
 * expectedRevision 0 creates a Scene that is not stored yet.
 * An update must name the revision the caller read. A mismatch writes nothing.
 */
export function commitSceneOrgSavedScene(
  input: Readonly<{ scene: SceneOrgSavedScene; expectedRevision: number }>,
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedScenePersistResult {
  if (!storage) return Object.freeze({ persisted: false, reason: "unavailable" });
  const loaded = loadSceneOrgSavedScenes(storage);
  if (loaded.status === "invalid" || loaded.status === "incompatible" || loaded.status === "unavailable") {
    return Object.freeze({ persisted: false, reason: "write-failed" });
  }
  const stored = loaded.scenes.find((scene) => scene.sceneId === input.scene.sceneId) ?? null;
  if (!stored) {
    if (input.expectedRevision !== 0) {
      return Object.freeze({ persisted: false, reason: "revision-conflict" });
    }
    const created = withSceneRevision(input.scene, 1);
    const written = persistSceneOrgSavedScenes(Object.freeze([...loaded.scenes, created]), storage);
    return written.persisted
      ? Object.freeze({ ...written, scenes: Object.freeze([...loaded.scenes, created]), current: created })
      : written;
  }
  if (sceneContentKey(stored) === sceneContentKey(input.scene)) {
    return Object.freeze({ persisted: true, reason: "persisted", scenes: loaded.scenes, current: stored });
  }
  if (readSceneContentRevision(stored) !== input.expectedRevision) {
    return Object.freeze({ persisted: false, reason: "revision-conflict", current: stored, scenes: loaded.scenes });
  }
  const next = withSceneRevision(input.scene, input.expectedRevision + 1);
  const scenes = Object.freeze(loaded.scenes.map((scene) => scene.sceneId === next.sceneId ? next : scene));
  const written = persistSceneOrgSavedScenes(scenes, storage);
  return written.persisted
    ? Object.freeze({ ...written, scenes, current: next })
    : written;
}

/** Removes one Scene when the caller read its current revision. Other Scenes stay. */
export function deleteSceneOrgSavedScene(
  input: Readonly<{ sceneId: string; expectedRevision: number }>,
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedScenePersistResult {
  if (!storage) return Object.freeze({ persisted: false, reason: "unavailable" });
  const loaded = loadSceneOrgSavedScenes(storage);
  if (loaded.status !== "loaded") return Object.freeze({ persisted: false, reason: "write-failed" });
  const stored = loaded.scenes.find((scene) => scene.sceneId === input.sceneId) ?? null;
  if (!stored) return Object.freeze({ persisted: true, reason: "persisted", scenes: loaded.scenes });
  if (readSceneContentRevision(stored) !== input.expectedRevision) {
    return Object.freeze({ persisted: false, reason: "revision-conflict", current: stored, scenes: loaded.scenes });
  }
  const scenes = Object.freeze(loaded.scenes.filter((scene) => scene.sceneId !== input.sceneId));
  const written = persistSceneOrgSavedScenes(scenes, storage);
  return written.persisted ? Object.freeze({ ...written, scenes }) : written;
}

/**
 * Applies the caller's scenes onto the latest stored collection.
 * A scene id absent from the caller stays. A changed scene must carry the
 * revision the caller read. Conflicting edits of that same scene are rejected.
 */
export function mergePersistSceneOrgSavedScenes(
  scenes: readonly SceneOrgSavedScene[],
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedScenePersistResult {
  const loaded = storage ? loadSceneOrgSavedScenes(storage) : null;
  if (!loaded || loaded.status !== "loaded") {
    const created = scenes.map((scene) => withSceneRevision(scene, readSceneContentRevision(scene)));
    const written = persistSceneOrgSavedScenes(Object.freeze(created), storage);
    return written.persisted ? Object.freeze({ ...written, scenes: Object.freeze(created) }) : written;
  }
  const storedById = new Map(loaded.scenes.map((scene) => [scene.sceneId, scene]));
  const merged = [...loaded.scenes];
  let current: SceneOrgSavedScene | undefined;
  for (const incoming of scenes) {
    const stored = storedById.get(incoming.sceneId);
    if (!stored) {
      const created = withSceneRevision(incoming, 1);
      merged.push(created);
      storedById.set(created.sceneId, created);
      current = created;
      continue;
    }
    if (sceneContentKey(stored) === sceneContentKey(incoming)) continue;
    if (readSceneContentRevision(incoming) !== readSceneContentRevision(stored)) {
      return Object.freeze({
        persisted: false,
        reason: "revision-conflict",
        current: stored,
        scenes: loaded.scenes,
      });
    }
    const next = withSceneRevision(incoming, readSceneContentRevision(stored) + 1);
    const index = merged.findIndex((scene) => scene.sceneId === incoming.sceneId);
    merged[index] = next;
    storedById.set(next.sceneId, next);
    current = next;
  }
  const written = persistSceneOrgSavedScenes(Object.freeze(merged), storage);
  return written.persisted
    ? Object.freeze({ ...written, scenes: Object.freeze(merged), ...(current ? { current } : {}) })
    : written;
}

/** Removes one Workspace's Scenes. Other Workspaces and Demo records stay. */
export function forgetWorkspaceSavedScenes(
  workspaceId: string,
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): boolean {
  const owner = savedSceneManagerWorkspaceId(workspaceId);
  if (!owner || !storage) return false;
  const loaded = loadSceneOrgSavedScenes(storage);
  if (loaded.status !== "loaded") return false;
  const next = loaded.scenes.filter((scene) => scene.managerWorkspaceId !== owner);
  if (next.length === loaded.scenes.length) return false;
  return persistSceneOrgSavedScenes(next, storage).persisted;
}
