import {
  createSceneOrgCanonicalReference,
  type SceneOrgCanonicalReferenceKind,
  type SceneOrgRegionId,
} from "./sceneOrgRegionContract";
import {
  createSceneOrgSavedScene,
  SCENE_ORG_SAVED_SCENE_KINDS,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract";
import { SCENE_ORG_VISIBILITY_LEVELS } from "./sceneOrgVisibilityContract";

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
  reason: "persisted" | "unavailable" | "write-failed";
}>;

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
      canonicalReferences: references as NonNullable<(typeof references)[number]>[],
      layout: {
        presentationDepth: layout.presentationDepth as "minimum" | "report" | "operation",
        leftRegion: "management",
        rightRegion: layout.rightRegion as "contextual" | "collapsed",
        detailWorkspace: layout.detailWorkspace as "closed" | "open",
      },
      visibility,
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
  let defaultFound = false;
  let rejectedRecords = 0;
  for (const candidate of parsed.scenes) {
    const scene = parseScene(candidate);
    if (
      !scene ||
      seenIds.has(scene.sceneId) ||
      (scene.kind === "DEFAULT_MANAGER" && defaultFound)
    ) {
      rejectedRecords += 1;
      continue;
    }
    seenIds.add(scene.sceneId);
    defaultFound ||= scene.kind === "DEFAULT_MANAGER";
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

export function persistSceneOrgSavedScenes(
  scenes: readonly SceneOrgSavedScene[],
  storage: SceneOrgSavedSceneStorage | null = browserStorage(),
): SceneOrgSavedScenePersistResult {
  if (!storage) return Object.freeze({ persisted: false, reason: "unavailable" });
  try {
    storage.setItem(SCENE_ORG_SAVED_SCENE_STORAGE_KEY, serializeSceneOrgSavedScenes(scenes));
    return Object.freeze({ persisted: true, reason: "persisted" });
  } catch {
    return Object.freeze({ persisted: false, reason: "write-failed" });
  }
}
