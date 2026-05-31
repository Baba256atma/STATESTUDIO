import type { AdaptiveSceneLabelMode } from "./executiveDensityTypes";
import { evaluateExecutiveSceneDensity } from "./executiveSceneDensityRuntime";
import { logAdaptiveSceneLabelMode } from "./executiveDensityInstrumentation";

export type AdaptiveSceneLabelInput = {
  objectCount: number;
  relationshipCount?: number;
  boundsSize?: [number, number, number] | null;
  viewportWidth?: number;
  viewportHeight?: number;
  cameraDistance?: number;
  selected?: boolean;
  focused?: boolean;
  forceMode?: AdaptiveSceneLabelMode;
};

export type AdaptiveSceneLabelState = {
  mode: AdaptiveSceneLabelMode;
  showPrimary: boolean;
  showSecondary: boolean;
  showIcon: boolean;
  opacity: number;
  fontSizePx: number;
  maxLines: number;
};

function modeFromDensity(input: AdaptiveSceneLabelInput): AdaptiveSceneLabelMode {
  if (input.forceMode) return input.forceMode;
  const density = evaluateExecutiveSceneDensity(input);
  const distance = Math.max(8, input.cameraDistance ?? 18);
  const viewportWidth = input.viewportWidth ?? 1440;

  if (input.selected || input.focused) {
    return density.sceneDensity === "critical" ? "CONDENSED" : "FULL";
  }

  if (density.sceneDensity === "critical" || input.objectCount >= 40) return "MINIMAL";
  if (density.sceneDensity === "dense" || distance > 28 || viewportWidth < 900) return "CONDENSED";
  if (input.objectCount <= 8 && distance <= 22) return "FULL";
  return "CONDENSED";
}

export function resolveAdaptiveSceneLabelState(input: AdaptiveSceneLabelInput): AdaptiveSceneLabelState {
  const mode = modeFromDensity(input);

  const state: AdaptiveSceneLabelState =
    mode === "HIDDEN"
      ? {
          mode,
          showPrimary: false,
          showSecondary: false,
          showIcon: false,
          opacity: 0,
          fontSizePx: 0,
          maxLines: 0,
        }
      : mode === "MINIMAL"
        ? {
            mode,
            showPrimary: input.selected === true || input.focused === true,
            showSecondary: false,
            showIcon: input.selected === true,
            opacity: input.selected ? 0.92 : 0.42,
            fontSizePx: 9,
            maxLines: 1,
          }
        : mode === "CONDENSED"
          ? {
              mode,
              showPrimary: true,
              showSecondary: input.selected === true,
              showIcon: true,
              opacity: input.selected ? 0.95 : 0.72,
              fontSizePx: 10,
              maxLines: 1,
            }
          : {
              mode,
              showPrimary: true,
              showSecondary: true,
              showIcon: true,
              opacity: 0.92,
              fontSizePx: 11,
              maxLines: 2,
            };

  logAdaptiveSceneLabelMode({
    mode,
    objectCount: input.objectCount,
    selected: input.selected === true,
    focused: input.focused === true,
    cameraDistance: input.cameraDistance ?? null,
  });

  return state;
}

export function shouldRenderSceneObjectLabel(
  input: AdaptiveSceneLabelInput & { isPrimaryLabelOwner?: boolean }
): boolean {
  const state = resolveAdaptiveSceneLabelState(input);
  if (state.mode === "HIDDEN") return false;
  if (state.mode === "MINIMAL" && !input.selected && !input.focused) {
    return input.isPrimaryLabelOwner === true;
  }
  return state.showPrimary;
}
