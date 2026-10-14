/**
 * NPA-T SAVED-SCENE-COLLECTION-ACCESS:1
 *
 * Deterministic discovery/resolution over the hydrated Saved Scene collection.
 * Does not persist, restore business truth, or own OPEN_SCENE restoration.
 */

import {
  savedSceneManagerWorkspaceId,
  type SceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract";

export const sceneOrgSavedSceneCollectionAccessIdentity =
  "NPA-T SAVED-SCENE-COLLECTION-ACCESS:1/HydratedCollectionResolution" as const;

export type SceneOrgSavedSceneHydrationStatus =
  | "pending"
  | "loaded"
  | "empty"
  | "unavailable"
  | "invalid"
  | "incompatible";

export type SceneOrgSavedSceneMatchSource =
  | "scene-id"
  | "exact-name"
  | "normalized-name"
  | "default-role"
  | "ambiguous"
  | "not-found"
  | "pending"
  | "empty";

export type SceneOrgSavedSceneAccessResolution = Readonly<{
  status: "matched" | "ambiguous" | "not-found" | "pending" | "empty";
  source: SceneOrgSavedSceneMatchSource;
  scene: SceneOrgSavedScene | null;
  candidates: readonly SceneOrgSavedScene[];
}>;

export type SceneOrgSavedSceneOpenExtraction = Readonly<{
  kind: "open" | "list" | "none";
  phrase: string | null;
  explicitScene: boolean;
  defaultRequested: boolean;
}>;

const SCENE_OPEN_RESERVED = new Set([
  "details",
  "the details",
  "advisor",
  "the advisor",
  "data",
  "data for this",
  "recent activity",
  "activity",
  "history",
  "overview",
  "all objects",
  "problems",
  "problem",
  "risks",
  "risk",
  "goals",
  "goal",
  "scenarios",
  "scenario",
  "decisions",
  "decision",
  "executions",
  "execution",
  "related",
  "related objects",
]);

function freezeResolution(
  resolution: SceneOrgSavedSceneAccessResolution,
): SceneOrgSavedSceneAccessResolution {
  return Object.freeze({
    ...resolution,
    candidates: Object.freeze([...resolution.candidates]),
  });
}

/** Aligns with CC:1 punctuation/whitespace folding without importing conversation. */
export function normalizeSavedSceneAccessName(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractSavedSceneOpenRequest(
  normalizedUtterance: string,
): SceneOrgSavedSceneOpenExtraction {
  const normalized = normalizeSavedSceneAccessName(normalizedUtterance);
  if (
    /^(?:show|list|what(?: are| is)?(?: my)?|open)?(?: me)?(?: my | the )?saved scenes(?: do i have)?$/.test(
      normalized,
    ) ||
    /^what scenes do i have$/.test(normalized)
  ) {
    return Object.freeze({
      kind: "list",
      phrase: null,
      explicitScene: true,
      defaultRequested: false,
    });
  }
  if (
    /^(?:open|show|go to)(?: the| my)?(?: saved)? default scene$/.test(
      normalized,
    )
  ) {
    return Object.freeze({
      kind: "open",
      phrase: null,
      explicitScene: true,
      defaultRequested: true,
    });
  }
  const matched = normalized.match(
    /^(?:open|show|go to)(?: (?:the|my))* (?:saved )?(?:scene )?(.+?)(?: scene)?$/,
  );
  const phrase = matched?.[1]?.trim() ?? "";
  if (!phrase || SCENE_OPEN_RESERVED.has(phrase)) {
    return Object.freeze({
      kind: "none",
      phrase: null,
      explicitScene: false,
      defaultRequested: false,
    });
  }
  if (/^(?:all|active|current)\s/.test(phrase)) {
    return Object.freeze({
      kind: "none",
      phrase: null,
      explicitScene: false,
      defaultRequested: false,
    });
  }
  return Object.freeze({
    kind: "open",
    phrase,
    explicitScene: /\bscene\b/.test(normalized),
    defaultRequested: false,
  });
}

/** Scenes owned by one canonical Manager Workspace. Unassigned and other owners stay out. */
export function listSceneOrgSavedScenesForManagerWorkspace(
  scenes: readonly SceneOrgSavedScene[],
  managerWorkspaceId: string,
): readonly SceneOrgSavedScene[] {
  const owner = savedSceneManagerWorkspaceId(managerWorkspaceId);
  if (!owner) return Object.freeze([]);
  return Object.freeze(scenes.filter((scene) => scene.managerWorkspaceId === owner));
}

export type SceneOrgSavedSceneOpenAssessment = Readonly<{
  status: "allowed" | "mismatch" | "unassigned" | "not-found";
  scene: SceneOrgSavedScene | null;
}>;

/** A Scene opens only for its owning Manager Workspace. */
export function assessSceneOrgSavedSceneOpen(
  scenes: readonly SceneOrgSavedScene[],
  sceneId: string | null | undefined,
  activeManagerWorkspaceId: string,
): SceneOrgSavedSceneOpenAssessment {
  const id = sceneId?.trim() ?? "";
  const scene = id ? scenes.find((candidate) => candidate.sceneId === id) ?? null : null;
  if (!scene) return Object.freeze({ status: "not-found", scene: null });
  const active = savedSceneManagerWorkspaceId(activeManagerWorkspaceId);
  if (!scene.managerWorkspaceId) return Object.freeze({ status: "unassigned", scene });
  if (!active || scene.managerWorkspaceId !== active) {
    return Object.freeze({ status: "mismatch", scene });
  }
  return Object.freeze({ status: "allowed", scene });
}

export function resolveSceneOrgSavedSceneAccess(
  scenes: readonly SceneOrgSavedScene[],
  request: {
    readonly sceneId?: string | null;
    readonly phrase?: string | null;
    readonly defaultRequested?: boolean;
    readonly hydrationStatus?: SceneOrgSavedSceneHydrationStatus | "unspecified";
  },
): SceneOrgSavedSceneAccessResolution {
  const hydration = request.hydrationStatus ?? "loaded";
  if (hydration === "pending") {
    return freezeResolution({
      status: "pending",
      source: "pending",
      scene: null,
      candidates: [],
    });
  }
  if (scenes.length === 0) {
    return freezeResolution({
      status: "empty",
      source: "empty",
      scene: null,
      candidates: [],
    });
  }

  if (request.sceneId) {
    const match = scenes.find((scene) => scene.sceneId === request.sceneId) ?? null;
    return freezeResolution({
      status: match ? "matched" : "not-found",
      source: match ? "scene-id" : "not-found",
      scene: match,
      candidates: match ? [match] : [],
    });
  }

  if (request.defaultRequested) {
    const defaults = scenes.filter((scene) => scene.kind === "DEFAULT_MANAGER");
    if (defaults.length === 1) {
      return freezeResolution({
        status: "matched",
        source: "default-role",
        scene: defaults[0]!,
        candidates: defaults,
      });
    }
    if (defaults.length > 1) {
      return freezeResolution({
        status: "ambiguous",
        source: "ambiguous",
        scene: null,
        candidates: defaults,
      });
    }
    return freezeResolution({
      status: "not-found",
      source: "not-found",
      scene: null,
      candidates: [],
    });
  }

  const phrase = (request.phrase ?? "").trim();
  if (!phrase) {
    return freezeResolution({
      status: "not-found",
      source: "not-found",
      scene: null,
      candidates: [],
    });
  }

  const exact = scenes.filter(
    (scene) => scene.name.trim().toLowerCase() === phrase.toLowerCase(),
  );
  if (exact.length === 1) {
    return freezeResolution({
      status: "matched",
      source: "exact-name",
      scene: exact[0]!,
      candidates: exact,
    });
  }
  if (exact.length > 1) {
    return freezeResolution({
      status: "ambiguous",
      source: "ambiguous",
      scene: null,
      candidates: exact,
    });
  }

  const normalizedPhrase = normalizeSavedSceneAccessName(phrase);
  const normalized = scenes.filter(
    (scene) => normalizeSavedSceneAccessName(scene.name) === normalizedPhrase,
  );
  if (normalized.length === 1) {
    return freezeResolution({
      status: "matched",
      source: "normalized-name",
      scene: normalized[0]!,
      candidates: normalized,
    });
  }
  if (normalized.length > 1) {
    return freezeResolution({
      status: "ambiguous",
      source: "ambiguous",
      scene: null,
      candidates: normalized,
    });
  }

  return freezeResolution({
    status: "not-found",
    source: "not-found",
    scene: null,
    candidates: [],
  });
}

export function shouldClaimSavedSceneOpenIntent(input: {
  readonly extraction: SceneOrgSavedSceneOpenExtraction;
  readonly resolution: SceneOrgSavedSceneAccessResolution;
  readonly catalogSubjectNames?: readonly string[];
}): boolean {
  const { extraction, resolution } = input;
  if (extraction.kind !== "open") return false;
  if (resolution.status === "pending") return true;
  if (extraction.defaultRequested) return true;
  if (extraction.explicitScene) return true;
  if (resolution.status === "ambiguous") return true;
  if (resolution.status !== "matched" || !resolution.scene) return false;
  const sceneKey = normalizeSavedSceneAccessName(resolution.scene.name);
  const collidesWithObject = (input.catalogSubjectNames ?? []).some(
    (name) => normalizeSavedSceneAccessName(name) === sceneKey,
  );
  return extraction.explicitScene || !collidesWithObject;
}
