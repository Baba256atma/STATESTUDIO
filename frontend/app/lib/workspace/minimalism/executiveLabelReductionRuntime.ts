import { resolveAdaptiveSceneLabelState } from "../../scene/density/adaptiveSceneLabelRuntime";
import type { ExecutiveLabelReductionInput, ExecutiveLabelReductionState } from "./executiveMinimalismTypes";
import { logLabelReduction } from "./executiveMinimalismInstrumentation";

function computePriorityRank(input: ExecutiveLabelReductionInput): number {
  if (input.selected || input.focused) return 1;
  if (input.isCritical) return 2;
  if (input.isHighRisk) return 3;
  if (input.isConnected) return 4;
  return 5;
}

/**
 * Integrates E2:44 adaptive labels with executive label priority ordering.
 * Selected → Critical → High-Risk → Connected → Everything else.
 */
export function resolveExecutiveLabelReduction(input: ExecutiveLabelReductionInput): ExecutiveLabelReductionState {
  const priorityRank = computePriorityRank(input);
  const adaptive = resolveAdaptiveSceneLabelState({
    objectCount: input.objectCount,
    selected: input.selected,
    focused: input.focused,
    viewportWidth: input.viewportWidth,
    cameraDistance: input.cameraDistance,
  });

  let visible = adaptive.showPrimary;
  let opacity = adaptive.opacity;

  if (input.viewMode === "2D" && input.objectCount >= 6 && input.objectCount <= 12) {
    visible = true;
    opacity = Math.max(opacity, 0.88);
  } else if (adaptive.mode === "MINIMAL" && priorityRank >= 5) {
    visible = false;
    opacity = 0;
  } else if (adaptive.mode === "CONDENSED" && priorityRank >= 4 && !input.selected && !input.focused) {
    visible = priorityRank <= 3;
    opacity = visible ? adaptive.opacity * 0.82 : 0;
  }

  const state: ExecutiveLabelReductionState = {
    visible,
    showSecondary: adaptive.showSecondary && priorityRank <= 2,
    showIcon: adaptive.showIcon && priorityRank <= 4,
    opacity,
    priorityRank,
  };

  logLabelReduction({
    priorityRank,
    visible: state.visible,
    mode: adaptive.mode,
    objectCount: input.objectCount,
  });

  return state;
}
