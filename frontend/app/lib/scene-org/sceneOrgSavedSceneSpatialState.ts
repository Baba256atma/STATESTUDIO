/**
 * NPA-T STAGE-SPATIAL-PERSISTENCE:1
 *
 * Saved Scene owns stage-plane presentation positions.
 * Coordinates are Executive True-2D layout positions {x, y} on the render
 * plane z = 0. They are not screen pixels, and they are not a camera.
 */

export const sceneOrgSavedSceneSpatialStateIdentity =
  "NPA-T STAGE-SPATIAL-PERSISTENCE:1/StagePlaneSpatialState" as const;

export const SCENE_ORG_SAVED_SCENE_SPATIAL_SCHEMA_VERSION = 1 as const;

/** Authoritative layout system. Depth is the render plane, not a saved axis. */
export const SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM = "stage-plane-xy" as const;

/**
 * Renderer safety bound for a saved stage-plane coordinate.
 * The fixed camera frames the origin at distance 11. Positions beyond ±4
 * leave the usable stage, so they are rejected rather than clamped.
 */
export const SCENE_ORG_STAGE_PLANE_LIMIT = 4 as const;

/** User nudge step on the stage plane. Stays inside the plane limit. */
export const SCENE_ORG_STAGE_NUDGE_STEP = 0.6 as const;

export const EMPTY_SCENE_SPATIAL_POSITIONS: Readonly<
  Record<string, { readonly x: number; readonly y: number }>
> = Object.freeze({});

export type SceneOrgStagePlanePosition = Readonly<{
  x: number;
  y: number;
  z: 0;
}>;

export type SceneOrgSavedSceneSpatialObject = Readonly<{
  canonicalObjectId: string;
  position: SceneOrgStagePlanePosition;
}>;

export type SceneOrgSavedSceneSpatialState = Readonly<{
  schemaVersion: typeof SCENE_ORG_SAVED_SCENE_SPATIAL_SCHEMA_VERSION;
  coordinateSystem: typeof SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM;
  objects: readonly SceneOrgSavedSceneSpatialObject[];
}>;

function finiteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Rejects non-finite, non-coplanar, and out-of-range positions. Never clamps. */
export function parseStagePlanePosition(value: unknown): SceneOrgStagePlanePosition | null {
  if (value == null || typeof value !== "object") return null;
  const position = value as Record<string, unknown>;
  if (!finiteCoordinate(position.x) || !finiteCoordinate(position.y)) return null;
  if (position.z !== 0) return null;
  if (
    Math.abs(position.x) > SCENE_ORG_STAGE_PLANE_LIMIT ||
    Math.abs(position.y) > SCENE_ORG_STAGE_PLANE_LIMIT
  ) {
    return null;
  }
  return Object.freeze({ x: position.x, y: position.y, z: 0 as const });
}

/**
 * Absent spatial state is a legacy Scene and returns null.
 * An unsupported or invalid payload also returns null so the Scene record
 * itself can stay intact. Invalid numbers are not converted.
 */
export function parseSceneOrgSavedSceneSpatialState(
  value: unknown,
): SceneOrgSavedSceneSpatialState | null {
  if (value == null) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const spatial = value as Record<string, unknown>;
  if (spatial.schemaVersion !== SCENE_ORG_SAVED_SCENE_SPATIAL_SCHEMA_VERSION) return null;
  if (spatial.coordinateSystem !== SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM) return null;
  if ("camera" in spatial || "zoom" in spatial || "pan" in spatial) return null;
  if (!Array.isArray(spatial.objects)) return null;
  const seen = new Set<string>();
  const objects: SceneOrgSavedSceneSpatialObject[] = [];
  for (const entry of spatial.objects) {
    if (entry == null || typeof entry !== "object" || Array.isArray(entry)) return null;
    const record = entry as Record<string, unknown>;
    if ("rotation" in record || "scale" in record || "camera" in record) return null;
    if (typeof record.canonicalObjectId !== "string") return null;
    const canonicalObjectId = record.canonicalObjectId.trim();
    if (canonicalObjectId.length === 0 || seen.has(canonicalObjectId)) return null;
    seen.add(canonicalObjectId);
    const position = parseStagePlanePosition(record.position);
    if (!position) return null;
    objects.push(Object.freeze({ canonicalObjectId, position }));
  }
  return Object.freeze({
    schemaVersion: SCENE_ORG_SAVED_SCENE_SPATIAL_SCHEMA_VERSION,
    coordinateSystem: SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
    objects: Object.freeze(objects),
  });
}

export function captureSceneOrgSavedSceneSpatialState(
  objects: readonly {
    readonly canonicalObjectId: string;
    readonly x: number;
    readonly y: number;
  }[],
): Readonly<{ ok: true; spatialState: SceneOrgSavedSceneSpatialState | null } | { ok: false }> {
  if (objects.length === 0) return Object.freeze({ ok: true as const, spatialState: null });
  const spatialState = parseSceneOrgSavedSceneSpatialState({
    schemaVersion: SCENE_ORG_SAVED_SCENE_SPATIAL_SCHEMA_VERSION,
    coordinateSystem: SCENE_ORG_STAGE_PLANE_COORDINATE_SYSTEM,
    objects: objects.map((entry) => ({
      canonicalObjectId: entry.canonicalObjectId,
      position: { x: entry.x, y: entry.y, z: 0 },
    })),
  });
  if (!spatialState) return Object.freeze({ ok: false as const });
  return Object.freeze({ ok: true as const, spatialState });
}

/** Saved coordinates authorize nothing. Unauthorized ids stay stored and unapplied. */
export function resolveAuthorizedSceneSpatialPositions(input: {
  readonly spatialState: SceneOrgSavedSceneSpatialState | null | undefined;
  readonly authorizedIds: readonly string[];
}): Readonly<{
  positions: Readonly<Record<string, { readonly x: number; readonly y: number }>>;
  unavailableIds: readonly string[];
}> {
  const allowed = new Set(input.authorizedIds);
  const positions: Record<string, { readonly x: number; readonly y: number }> = {};
  const unavailableIds: string[] = [];
  for (const entry of input.spatialState?.objects ?? []) {
    if (!allowed.has(entry.canonicalObjectId)) {
      unavailableIds.push(entry.canonicalObjectId);
      continue;
    }
    positions[entry.canonicalObjectId] = Object.freeze({
      x: entry.position.x,
      y: entry.position.y,
    });
  }
  return Object.freeze({
    positions: Object.freeze(positions),
    unavailableIds: Object.freeze(unavailableIds),
  });
}
