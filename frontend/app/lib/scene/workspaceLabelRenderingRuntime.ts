import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import type { AdaptiveSceneLabelMode } from "./density/executiveDensityTypes";
import {
  resolveAdaptiveSceneLabelState,
  type AdaptiveSceneLabelInput,
  type AdaptiveSceneLabelState,
} from "./density/adaptiveSceneLabelRuntime";

export type WorkspaceLabelProfile = {
  mode: WorkspaceViewMode;
  forceMode?: AdaptiveSceneLabelMode;
  billboard: boolean;
  minFontSizePx: number;
  maxFontSizePx: number;
  flatLabels: boolean;
};

const LABEL_PROFILES: Readonly<Record<WorkspaceViewMode, WorkspaceLabelProfile>> = Object.freeze({
  "2D": {
    mode: "2D",
    forceMode: "CONDENSED",
    billboard: false,
    minFontSizePx: 10,
    maxFontSizePx: 12,
    flatLabels: true,
  },
  "3D": {
    mode: "3D",
    forceMode: undefined,
    billboard: true,
    minFontSizePx: 10,
    maxFontSizePx: 13,
    flatLabels: false,
  },
});

export function resolveWorkspaceLabelProfile(viewMode: WorkspaceViewMode): WorkspaceLabelProfile {
  return LABEL_PROFILES[viewMode];
}

export function resolveWorkspaceLabelState(
  viewMode: WorkspaceViewMode,
  input: AdaptiveSceneLabelInput
): AdaptiveSceneLabelState & { billboard: boolean; flatLabels: boolean } {
  const profile = resolveWorkspaceLabelProfile(viewMode);
  const base = resolveAdaptiveSceneLabelState({
    ...input,
    forceMode: input.forceMode ?? profile.forceMode,
  });

  const fontSizePx = Math.max(
    profile.minFontSizePx,
    Math.min(profile.maxFontSizePx, base.fontSizePx || profile.minFontSizePx)
  );

  return {
    ...base,
    showPrimary: base.showPrimary || input.selected === true || input.focused === true,
    fontSizePx,
    opacity: Math.max(base.opacity, input.selected ? 0.95 : profile.mode === "2D" ? 0.82 : 0.74),
    billboard: profile.billboard,
    flatLabels: profile.flatLabels,
  };
}

export function shouldUseBillboardLabels(viewMode: WorkspaceViewMode): boolean {
  return resolveWorkspaceLabelProfile(viewMode).billboard;
}
