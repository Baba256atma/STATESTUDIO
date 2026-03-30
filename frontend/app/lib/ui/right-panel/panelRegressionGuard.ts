import type { RightPanelView } from "./rightPanelTypes";
import { resolveSafeRightPanelView } from "./rightPanelRouter";

export function ensurePanelSafeRender(
  view: RightPanelView,
  componentExists: boolean
): {
  safeView: Exclude<RightPanelView, null>;
  shouldFallback: boolean;
  reason: "invalid_view" | "missing_component" | null;
} {
  const safeView = resolveSafeRightPanelView(view);

  if (!componentExists) {
    return {
      safeView,
      shouldFallback: true,
      reason: "missing_component",
    };
  }

  return {
    safeView,
    shouldFallback: false,
    reason: null,
  };
}
