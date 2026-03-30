export type LayoutSafeViewportRegion = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type LayoutAwareFrameSpec = {
  horizontalBias: number;
  verticalBias: number;
  pullback: number;
  worldShift: number;
  safeRegion: LayoutSafeViewportRegion;
};

export type LayoutAwareBaselineFrame = {
  position: [number, number, number];
  lookAt: [number, number, number];
  safeRegion: LayoutSafeViewportRegion;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function resolveLayoutAwareFrameSpec(params: {
  viewportWidth: number;
  viewportHeight: number;
  hudDockSide?: "left" | "right";
}): LayoutAwareFrameSpec {
  const height = Math.max(1, Number(params.viewportHeight) || 1);
  const leftInset = params.hudDockSide === "left" ? 0.12 : 0.06;
  const rightInset = params.hudDockSide === "right" ? 0.22 : 0.08;
  const topInset = clamp(72 / height, 0.06, 0.14);
  const bottomInset = clamp(28 / height, 0.03, 0.08);
  const horizontalBias = clamp((rightInset - leftInset) * 0.42, -0.08, 0.08);
  const verticalBias = clamp((topInset - bottomInset) * 0.18, -0.03, 0.04);

  return {
    horizontalBias,
    verticalBias,
    pullback: params.hudDockSide ? 1.05 : 1.02,
    worldShift: params.hudDockSide ? 1.12 : 0.45,
    safeRegion: {
      minX: -1 + leftInset * 2,
      maxX: 1 - rightInset * 2,
      minY: -1 + bottomInset * 2,
      maxY: 1 - topInset * 2,
    },
  };
}

export function isProjectedPointWithinSafeRegion(
  point: { x: number; y: number } | null,
  region: LayoutSafeViewportRegion
) {
  if (!point) return false;
  return point.x >= region.minX && point.x <= region.maxX && point.y >= region.minY && point.y <= region.maxY;
}

export function measureFrameDrift(params: {
  currentPosition: { x: number; y: number; z: number };
  currentLookAt: { x: number; y: number; z: number };
  baselinePosition: [number, number, number];
  baselineLookAt: [number, number, number];
}) {
  const dx = params.currentPosition.x - params.baselinePosition[0];
  const dy = params.currentPosition.y - params.baselinePosition[1];
  const dz = params.currentPosition.z - params.baselinePosition[2];
  const lx = params.currentLookAt.x - params.baselineLookAt[0];
  const ly = params.currentLookAt.y - params.baselineLookAt[1];
  const lz = params.currentLookAt.z - params.baselineLookAt[2];
  return {
    positionDistance: Math.sqrt(dx * dx + dy * dy + dz * dz),
    lookAtDistance: Math.sqrt(lx * lx + ly * ly + lz * lz),
  };
}
