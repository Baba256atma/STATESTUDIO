"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
} from "../../../lib/workspace/executiveFocusModeRuntime";
import { shouldHideChromeRail } from "../../../lib/workspace/focusHudVisibilityRuntime";

/** Applies executive focus mode attributes to document chrome without unmounting panels. */
export function ExecutiveFocusModeDocumentBridge(): null {
  const focus = useSyncExternalStore(
    subscribeExecutiveFocusMode,
    getExecutiveFocusModeSnapshot,
    getExecutiveFocusModeServerSnapshot
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-nx-focus-mode", focus.enabled ? "active" : "inactive");
    document.documentElement.setAttribute("data-nx-focus-profile", focus.profile);

    const hideChrome = shouldHideChromeRail({
      focusEnabled: focus.enabled,
      profileId: focus.profile,
    });
    const rightPanel = document.getElementById("nexora-right-panel-root");
    if (rightPanel) {
      rightPanel.style.opacity = hideChrome ? "0" : "1";
      rightPanel.style.visibility = hideChrome ? "hidden" : "visible";
      rightPanel.style.pointerEvents = hideChrome ? "none" : "auto";
    }
  }, [focus.enabled, focus.profile]);

  return null;
}

export default ExecutiveFocusModeDocumentBridge;
