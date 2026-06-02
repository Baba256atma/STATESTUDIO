export type ExecutiveViewportClass = "laptop" | "desktop" | "ultrawide" | "large";

export type ExecutiveViewportFramingAdjustments = {
  viewportClass: ExecutiveViewportClass;
  radiusScale: number;
  fovScale: number;
  verticalCompositionBias: number;
  horizontalCompositionBias: number;
  compositionPadding: number;
};

export function classifyExecutiveViewport(
  viewportWidth?: number,
  viewportHeight?: number
): ExecutiveViewportClass {
  const width = Math.max(640, viewportWidth ?? 1440);
  const height = Math.max(480, viewportHeight ?? 900);
  const aspect = width / height;
  if (aspect >= 2.05) return "ultrawide";
  if (width >= 2560 || (width >= 2200 && height >= 1200)) return "large";
  if (width < 1280) return "laptop";
  return "desktop";
}

export function resolveExecutiveViewportFramingAdjustments(
  viewportWidth?: number,
  viewportHeight?: number
): ExecutiveViewportFramingAdjustments {
  const viewportClass = classifyExecutiveViewport(viewportWidth, viewportHeight);
  switch (viewportClass) {
    case "laptop":
      return {
        viewportClass,
        radiusScale: 1.06,
        fovScale: 0.96,
        verticalCompositionBias: 0.03,
        horizontalCompositionBias: 0,
        compositionPadding: 1.1,
      };
    case "ultrawide":
      return {
        viewportClass,
        radiusScale: 1.1,
        fovScale: 1.04,
        verticalCompositionBias: 0.02,
        horizontalCompositionBias: 0.04,
        compositionPadding: 1.16,
      };
    case "large":
      return {
        viewportClass,
        radiusScale: 1.08,
        fovScale: 1.02,
        verticalCompositionBias: 0.035,
        horizontalCompositionBias: 0.02,
        compositionPadding: 1.14,
      };
    case "desktop":
    default:
      return {
        viewportClass,
        radiusScale: 1,
        fovScale: 1,
        verticalCompositionBias: 0.025,
        horizontalCompositionBias: 0.015,
        compositionPadding: 1.12,
      };
  }
}

export function applyExecutiveCompositionQuality(input: {
  center: [number, number, number];
  size: [number, number, number];
  verticalCompositionBias: number;
  horizontalCompositionBias: number;
  timelineClearance?: number;
}): {
  lookAt: [number, number, number];
  massOffset: [number, number, number];
} {
  const [cx, cy, cz] = input.center;
  const [sx, sy, sz] = input.size;
  const span = Math.max(sx, sy, sz, 1);
  const massOffsetX = span * input.horizontalCompositionBias * 0.08;
  const massOffsetY = span * input.verticalCompositionBias * 0.12;
  const timelineLift = span * (input.timelineClearance ?? 0) * 0.18;
  return {
    massOffset: [massOffsetX, massOffsetY + timelineLift, 0],
    lookAt: [cx + massOffsetX, cy + massOffsetY + timelineLift, cz],
  };
}
