import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveCameraBounds, ExecutiveCameraFrame } from "./executive2DCameraProfile";
import { resolveExecutive2DOrthographicFrame } from "./executive2DCameraProfile";
import {
  applyExecutive3DFramingPullback,
  buildExecutive2DCameraFrame,
  buildExecutive3DCameraFrame,
  computeExecutiveFramingRadius,
  EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER,
  EXECUTIVE_3D_CAMERA_OFFSET,
} from "./executiveCameraFrameFormulas";
import { logExecutiveCameraProfileOnce } from "./executive3DCameraProfile";
import { compute2DStrategicNetworkBounds } from "./executive2DStrategicMapRuntime.ts";
import { resolveObjectVisualExtents } from "./objectVisualExtents";

const loggedCameraAxisMappingSignatures = new Set<string>();

function computeGroundPlaneFootprint(bounds: ExecutiveCameraBounds): {
  width: number;
  depth: number;
  height: number;
  dominantSpan: number;
} {
  const width = bounds.size[0];
  const height = bounds.size[1];
  const depth = bounds.size[2];
  return {
    width,
    depth,
    height,
    dominantSpan: Math.max(width, depth),
  };
}

function logCameraAxisMappingOnce(input: {
  objectCount: number;
  mode: WorkspaceViewMode;
  bounds: ExecutiveCameraBounds;
  footprint: ReturnType<typeof computeGroundPlaneFootprint>;
  radius: number;
  groundPlaneSpan: number;
  executivePadding: number;
  singleObjectMinRadius: number;
  multiObjectMinRadius: number;
  sceneCenter: [number, number, number];
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = [
    input.objectCount,
    input.mode,
    input.bounds.size.map((value) => value.toFixed(3)).join(","),
    input.radius.toFixed(3),
  ].join("|");
  if (loggedCameraAxisMappingSignatures.has(signature)) return;
  loggedCameraAxisMappingSignatures.add(signature);
  console.log("[Nexora][CameraAxisMapping]", {
    objectCount: input.objectCount,
    mode: input.mode,
    boundsSize: input.bounds.size,
    widthX: input.footprint.width,
    heightY: input.footprint.height,
    depthZ: input.footprint.depth,
    radius: input.radius,
    groundPlaneSpan: input.groundPlaneSpan,
    executivePadding: input.executivePadding,
    singleObjectMinRadius: input.singleObjectMinRadius,
    multiObjectMinRadius: input.multiObjectMinRadius,
    sceneCenter: input.sceneCenter,
    source: "xz_ground_plane",
  });
}

function readObjectPosition(
  obj: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] | null {
  const record = obj as { id?: unknown; name?: unknown; transform?: { pos?: unknown }; position?: unknown } | null;
  const id = String(record?.id ?? record?.name ?? "");
  if (layoutPositions && id && layoutPositions[id]) {
    return layoutPositions[id];
  }
  const source =
    Array.isArray(record?.transform?.pos) && (record?.transform?.pos as unknown[]).length >= 3
      ? (record?.transform?.pos as number[])
      : Array.isArray(record?.position) && record.position.length >= 3
        ? (record.position as number[])
        : null;
  if (!source) return null;
  const x = Number(source[0]);
  const y = Number(source[1]);
  const z = Number(source[2]);
  if (![x, y, z].every(Number.isFinite)) return null;
  return [x, y, z];
}

function readObjectId(obj: unknown, index: number): string {
  const record = obj as { id?: unknown; name?: unknown } | null;
  return String(record?.id ?? record?.name ?? `obj:${index}`);
}

export function computeLayoutPositionBounds(
  objects: unknown[],
  layoutPositions: Record<string, [number, number, number]>,
  nodePadding = 0.18
): ExecutiveCameraBounds & {
  min: [number, number, number];
  max: [number, number, number];
} {
  const positionedObjects = objects
    .map((obj, index) => ({
      obj,
      position: layoutPositions[readObjectId(obj, index)],
    }))
    .filter((entry): entry is { obj: unknown; position: [number, number, number] } =>
      Array.isArray(entry.position)
    );

  if (!positionedObjects.length) {
    return computeScaleAwareSceneBounds(objects, layoutPositions);
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  positionedObjects.forEach(({ obj, position: [x, y, z] }) => {
    const extents = resolveObjectVisualExtents(obj, { objectCount: objects.length });
    const halfWidth = extents.width / 2 + nodePadding;
    const halfHeight = extents.height / 2 + nodePadding;
    const halfDepth = extents.depth / 2 + nodePadding;
    minX = Math.min(minX, x - halfWidth);
    minY = Math.min(minY, y - halfHeight);
    minZ = Math.min(minZ, z - halfDepth);
    maxX = Math.max(maxX, x + halfWidth);
    maxY = Math.max(maxY, y + halfHeight);
    maxZ = Math.max(maxZ, z + halfDepth);
  });

  const center: [number, number, number] = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    center,
    size: [
      Math.max(1.5, maxX - minX),
      Math.max(1.2, maxY - minY),
      Math.max(1.5, maxZ - minZ),
    ],
  };
}

export function computeScaleAwareSceneBounds(
  objects: unknown[],
  layoutPositions?: Record<string, [number, number, number]>
): ExecutiveCameraBounds & {
  min: [number, number, number];
  max: [number, number, number];
} {
  if (!objects.length) {
    return {
      min: [-2, -2, -2],
      max: [2, 2, 2],
      center: [0, 0, 0],
      size: [4, 4, 4],
    };
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  objects.forEach((obj, index) => {
    const position = readObjectPosition(obj, layoutPositions);
    if (!position) return;
    const extents = resolveObjectVisualExtents(obj, {
      objectCount: objects.length,
    });
    const [x, y, z] = position;
    minX = Math.min(minX, x - extents.width / 2);
    minY = Math.min(minY, y - extents.height / 2);
    minZ = Math.min(minZ, z - extents.depth / 2);
    maxX = Math.max(maxX, x + extents.width / 2);
    maxY = Math.max(maxY, y + extents.height / 2);
    maxZ = Math.max(maxZ, z + extents.depth / 2);
  });

  if (!Number.isFinite(minX)) {
    return {
      min: [-2, -2, -2],
      max: [2, 2, 2],
      center: [0, 0, 0],
      size: [4, 4, 4],
    };
  }

  const center: [number, number, number] = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    center,
    size: [
      Math.max(1.5, maxX - minX),
      Math.max(1.5, maxY - minY),
      Math.max(1.5, maxZ - minZ),
    ],
  };
}

export function fitCameraToSceneObjects(input: {
  objects: unknown[];
  mode: WorkspaceViewMode;
  viewportWidth?: number;
  viewportHeight?: number;
  layoutPositions?: Record<string, [number, number, number]>;
}): {
  bounds: ExecutiveCameraBounds;
  frame: ExecutiveCameraFrame;
  radius: number;
  center: [number, number, number];
} {
  const useLayoutPositions = Boolean(
    input.layoutPositions && Object.keys(input.layoutPositions).length > 0
  );
  const bounds =
    input.mode === "2D"
      ? compute2DStrategicNetworkBounds(input.objects, input.layoutPositions)
      : useLayoutPositions
        ? computeLayoutPositionBounds(input.objects, input.layoutPositions as Record<string, [number, number, number]>)
        : computeScaleAwareSceneBounds(input.objects, input.layoutPositions);
  const [cx, , cz] = bounds.center;
  const sceneCenter: [number, number, number] = [cx, 0, cz];
  const footprint = computeGroundPlaneFootprint(bounds);
  const groundPlaneSpan = Math.max(footprint.width, footprint.depth, footprint.dominantSpan);
  const executivePadding =
    input.mode === "2D"
      ? input.objects.length >= 10
        ? 1.22
        : input.objects.length >= 6
          ? 1.16
          : 1.08
      : input.objects.length >= 10
        ? 1.3
        : input.objects.length >= 8
          ? 1.22
          : input.objects.length >= 4
            ? 1.1
            : 1.0;
  const groundPlaneRadius = groundPlaneSpan * executivePadding;
  const rawRadius = Math.max(computeExecutiveFramingRadius(bounds, input.mode), groundPlaneRadius);
  const singleObjectMinRadius =
    input.objects.length <= 1
      ? input.mode === "2D"
        ? 8 / EXECUTIVE_2D_CAMERA_LIFT_MULTIPLIER
        : 8 /
          Math.sqrt(
            EXECUTIVE_3D_CAMERA_OFFSET.x ** 2 +
              EXECUTIVE_3D_CAMERA_OFFSET.y ** 2 +
              EXECUTIVE_3D_CAMERA_OFFSET.z ** 2
          )
      : 0;
  const multiObjectMinRadius =
    input.mode === "2D"
      ? input.objects.length >= 10
        ? 5.2
        : input.objects.length >= 6
          ? 4.6
          : 0
      : input.objects.length >= 10
        ? 6.8
        : input.objects.length >= 8
          ? 6.2
          : input.objects.length >= 4
            ? 5.4
            : 0;
  let radius = Math.max(rawRadius, singleObjectMinRadius, multiObjectMinRadius);
  if (input.mode === "3D") {
    radius = applyExecutive3DFramingPullback(radius);
  }
  logCameraAxisMappingOnce({
    objectCount: input.objects.length,
    mode: input.mode,
    bounds,
    footprint,
    radius,
    groundPlaneSpan,
    executivePadding,
    singleObjectMinRadius,
    multiObjectMinRadius,
    sceneCenter,
  });
  const viewportWidth = input.viewportWidth ?? 1440;
  const viewportHeight = input.viewportHeight ?? 900;

  if (input.mode === "2D") {
    const orthoFrame = resolveExecutive2DOrthographicFrame(bounds, viewportWidth, viewportHeight, radius);
    const topDown = buildExecutive2DCameraFrame(sceneCenter, radius);
    return {
      bounds,
      radius,
      center: sceneCenter,
      frame: {
        position: topDown.position,
        lookAt: topDown.lookAt,
        fov: orthoFrame.fov,
        zoom: orthoFrame.zoom,
        orthoSize: orthoFrame.orthoSize,
        projection: orthoFrame.projection,
      } as ExecutiveCameraFrame,
    };
  }

  const angled = buildExecutive3DCameraFrame(sceneCenter, radius);
  logExecutiveCameraProfileOnce({
    viewMode: "3D",
    position: angled.position,
    lookAt: angled.lookAt,
    radius,
    framingRadius: computeExecutiveFramingRadius(bounds, "3D"),
    cameraOffset: EXECUTIVE_3D_CAMERA_OFFSET,
    objectCount: input.objects.length,
    reason: "fit_scene_objects",
  });
  return {
    bounds,
    radius,
    center: sceneCenter,
    frame: {
      position: angled.position,
      lookAt: angled.lookAt,
      fov: angled.fov,
    },
  };
}
