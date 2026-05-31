import { auditedResolve } from "../../audit/auditedResolve";
import type { SceneHudSpatialAlignmentSnapshot } from "./sceneNativeHudVisualTypes";
import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import { logSceneHudSpatialAlignment } from "./sceneNativeHudVisualInstrumentation";

const SURFACE_ALIGNMENT: Partial<
  Record<SceneHudThemeSurfaceId, Omit<SceneHudSpatialAlignmentSnapshot, "preserveSceneCenter">>
> = {
  sceneInfoHud: { dominantAxis: "vertical", maxWidthRatio: 0.22, maxHeightRatio: 0.42, alignmentBias: -0.12 },
  objectInfoHud: { dominantAxis: "vertical", maxWidthRatio: 0.24, maxHeightRatio: 0.48, alignmentBias: 0.12 },
  timelineHud: { dominantAxis: "horizontal", maxWidthRatio: 0.92, maxHeightRatio: 0.18, alignmentBias: 0 },
  executiveStatusHud: { dominantAxis: "horizontal", maxWidthRatio: 0.34, maxHeightRatio: 0.16, alignmentBias: 0.1 },
  quickActionsDock: { dominantAxis: "horizontal", maxWidthRatio: 0.5, maxHeightRatio: 0.1, alignmentBias: 0 },
  sceneNavigationToolbar: { dominantAxis: "horizontal", maxWidthRatio: 0.55, maxHeightRatio: 0.08, alignmentBias: 0 },
};

export type SpatialAlignmentInput = {
  surface: SceneHudThemeSurfaceId;
  viewportWidth?: number;
  viewportHeight?: number;
  objectCount?: number;
};

/** Keep HUD composition secondary to scene topology and camera framing. */
export function resolveSceneHudSpatialAlignment(input: SpatialAlignmentInput): SceneHudSpatialAlignmentSnapshot {
  const viewportWidth = input.viewportWidth ?? 1440;
  const viewportHeight = input.viewportHeight ?? 900;
  const objectCount = input.objectCount ?? 0;

  return auditedResolve({
    auditName: "SpatialAlignment",
    inputs: {
      surface: input.surface,
      viewportWidth,
      viewportHeight,
      objectCount,
    },
    compute: () => {
      const base = SURFACE_ALIGNMENT[input.surface] ?? {
        dominantAxis: "horizontal" as const,
        maxWidthRatio: 0.3,
        maxHeightRatio: 0.2,
        alignmentBias: 0,
      };

      const objectDensityPenalty = objectCount > 24 ? 0.04 : 0;
      const compactViewport = viewportWidth < 900 || viewportHeight < 700 ? 0.06 : 0;

      return {
        ...base,
        maxWidthRatio: Math.max(0.14, base.maxWidthRatio - objectDensityPenalty - compactViewport),
        maxHeightRatio: Math.max(0.08, base.maxHeightRatio - objectDensityPenalty * 0.5),
        preserveSceneCenter: input.surface !== "timelineHud",
      };
    },
    formatLogPayload: (snapshot) => ({
      surface: input.surface,
      objectCount,
      ...snapshot,
    }),
    log: logSceneHudSpatialAlignment,
  });
}
